import {
    collection,
    getDocs,
    where,
    query,
} from 'firebase/firestore'

import { db } from './firestore'
import type { Product } from '../types/product'

export async function getProducts(): Promise<Product[]> {
    const productsCollection = collection(db, 'products')

    const productsQuery = query(
    productsCollection,
    where('isPublished', '==', true),
)

const snapshot = await getDocs(productsQuery)

    return snapshot.docs.map((document) => ({
        ...document.data(),
        id: document.id,
    })) as Product[]
}

export async function getProductBySlug(
    slug: string,
): Promise<Product | null> {
    const productsCollection = collection(db, 'products')

    const productQuery = query(
        productsCollection,
        where('slug', '==', slug),
        where('isPublished', '==', true),
    )

    const snapshot = await getDocs(productQuery)

    if (snapshot.empty) {
        return null
    }

    const productDocument = snapshot.docs[0]

    return {
        ...productDocument.data(),
        id: productDocument.id,
    } as Product
}