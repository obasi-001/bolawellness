import {
    doc,
    getDoc,
    setDoc,
    runTransaction,
} from 'firebase/firestore'

import { db } from './firestore'
import type { UserProfile } from '../types/user'

export async function getUserProfile(
    uid: string,
): Promise<UserProfile | null> {
    const userRef = doc(db, 'users', uid)

    const snapshot = await getDoc(userRef)

    if (!snapshot.exists()) {
        return null
    }

    return snapshot.data() as UserProfile
}

export async function saveUserProfile(
    uid: string,
    profile: UserProfile,
): Promise<void> {
    const userRef = doc(db, 'users', uid)

    await setDoc(userRef, profile, { merge: true })
}

export async function ensureCustomerNumber(
    uid: string,
    email: string,
): Promise<string> {
    const userRef = doc(db, 'users', uid)
    const alphabet = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789'

    for (let attempt = 0; attempt < 10; attempt++) {
        const bytes = crypto.getRandomValues(new Uint8Array(6))

        const code = Array.from(bytes)
            .map((byte) => alphabet[byte % alphabet.length])
            .join('')

        const customerNumber = `CUS-${code}`
        const reservationRef = doc(
            db,
            'customerNumbers',
            customerNumber,
        )

        const result = await runTransaction(db, async (transaction) => {
            const userSnapshot = await transaction.get(userRef)
            const userData = userSnapshot.data()

            // Reuse an existing customer number.
            if (userData?.customerNumber) {
                // Save the email if it is missing.
                if (!userData.email) {
                    transaction.set(
                        userRef,
                        { email },
                        { merge: true },
                    )
                }

                return userData.customerNumber as string
            }

            // Check whether the generated number is already reserved.
            const reservationSnapshot =
                await transaction.get(reservationRef)

            if (reservationSnapshot.exists()) {
                return null
            }

            // Reserve the number for this customer.
            transaction.set(reservationRef, { uid })

            // Save the number and email without replacing profile fields.
            transaction.set(
                userRef,
                {
                    customerNumber,
                    email,
                },
                { merge: true },
            )

            return customerNumber
        })

        if (result) {
            return result
        }
    }

    throw new Error(
        'Unable to assign a customer number. Please try again.',
    )
}