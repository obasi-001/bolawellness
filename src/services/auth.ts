import app from '../firebase'

import {
  getAuth,
  GoogleAuthProvider,
  signInWithPopup,
  signOut,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  updateProfile,
  sendPasswordResetEmail,
  verifyPasswordResetCode,
  confirmPasswordReset,
  type ActionCodeSettings,
} from 'firebase/auth'

export const auth = getAuth(app)

const googleProvider = new GoogleAuthProvider()

export const signInWithGoogle = () => {
  return signInWithPopup(auth, googleProvider)
}

export const signOutUser = () => {
  return signOut(auth)
}

export const registerWithEmail = async (
  name: string,
  email: string,
  password: string,
) => {
  const userCredential =
    await createUserWithEmailAndPassword(
      auth,
      email,
      password,
    )

  await updateProfile(userCredential.user, {
    displayName: name,
  })

  return userCredential
}

export const loginWithEmail = (
  email: string,
  password: string,
) => {
  return signInWithEmailAndPassword(
    auth,
    email,
    password,
  )
}

const passwordResetSettings: ActionCodeSettings = {
  url: `${window.location.origin}/reset-password`,
  handleCodeInApp: true,
}

export const resetPassword = (email: string) => {
  return sendPasswordResetEmail(
    auth,
    email,
    passwordResetSettings,
  )
}

export const verifyResetCode = (code: string) => {
  return verifyPasswordResetCode(auth, code)
}

export const confirmResetPassword = (
  code: string,
  newPassword: string,
) => {
  return confirmPasswordReset(auth, code, newPassword)
}