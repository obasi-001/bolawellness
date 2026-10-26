import { useEffect, useState } from 'react'
import { useSearchParams } from 'react-router-dom'
import { verifyResetCode, confirmResetPassword } from '../services/auth'

function ResetPassword() {
    const [searchParams] = useSearchParams()

    const mode = searchParams.get('mode')
    const oobCode = searchParams.get('oobCode')

    const [showNewPassword, setShowNewPassword] = useState(false)
    const [showConfirmPassword, setShowConfirmPassword] = useState(false)

    const [newPassword, setNewPassword] = useState('')
    const [confirmPassword, setConfirmPassword] = useState('')

    const [verifying, setVerifying] = useState(true)
    const [resetError, setResetError] = useState('')

    useEffect(() => {
        async function verifyCode() {
            if (mode !== 'resetPassword' || !oobCode) {
                setResetError('Invalid password reset link.')
                setVerifying(false)
                return
            }

            try {
                await verifyResetCode(oobCode)
            } catch {
                setResetError(
                    'This password reset link is invalid or has expired.',
                )
            } finally {
                setVerifying(false)
            }
        }

        verifyCode()
    }, [mode, oobCode])

    const handleResetPassword = async () => {
        if (!oobCode) {
            setResetError('Invalid password reset link.')
            return
        }

        if (newPassword.length < 6) {
            setResetError('Password must be at least 6 characters.')
            return
        }

        if (newPassword !== confirmPassword) {
            setResetError('Passwords do not match.')
            return
        }

        try {
            await confirmResetPassword(oobCode, newPassword)

            alert('Password reset successfully.')
        } catch {
            setResetError(
                'Unable to reset your password. Please request a new reset link.',
            )
        }
    }

    return (
        <section className="py-5">
            <div className="container">
                {verifying && (
                    <div className="row justify-content-center">
                        <div className="col-12 col-md-6 col-lg-5 text-center">
                            <p className="text-body-secondary">
                                Verifying password reset link...
                            </p>
                        </div>
                    </div>
                )}

                {!verifying && resetError && (
                    <div className="row justify-content-center">
                        <div className="col-12 col-md-6 col-lg-5">
                            <div
                                className="alert alert-danger"
                                role="alert"
                            >
                                <i className="bi bi-exclamation-circle me-2"></i>
                                {resetError}
                            </div>
                        </div>
                    </div>
                )}

                {!verifying && !resetError && (
                    <div className="row justify-content-center">
                        <div className="col-12 col-md-6 col-lg-5">
                            <h1 className="mb-4">Reset Password</h1>

                            <p className="text-body-secondary mb-4">
                                Enter your new password below.
                            </p>

                            <div className="mb-3">
                                <label className="form-label">
                                    New Password
                                </label>

                                <div className="input-group">
                                    <input
                                        type={
                                            showNewPassword
                                                ? 'text'
                                                : 'password'
                                        }
                                        className="form-control"
                                        placeholder="Enter your new password"
                                        value={newPassword}
                                        onChange={(e) =>
                                            setNewPassword(e.target.value)
                                        }
                                    />

                                    <button
                                        type="button"
                                        className="btn btn-outline-secondary"
                                        onClick={() =>
                                            setShowNewPassword(
                                                !showNewPassword,
                                            )
                                        }
                                        aria-label={
                                            showNewPassword
                                                ? 'Hide new password'
                                                : 'Show new password'
                                        }
                                    >
                                        <i
                                            className={`bi ${showNewPassword
                                                    ? 'bi-eye-slash'
                                                    : 'bi-eye'
                                                }`}
                                        ></i>
                                    </button>
                                </div>
                            </div>

                            <div className="mb-3">
                                <label className="form-label">
                                    Confirm Password
                                </label>

                                <div className="input-group">
                                    <input
                                        type={
                                            showConfirmPassword
                                                ? 'text'
                                                : 'password'
                                        }
                                        className="form-control"
                                        placeholder="Confirm your new password"
                                        value={confirmPassword}
                                        onChange={(e) =>
                                            setConfirmPassword(
                                                e.target.value,
                                            )
                                        }
                                    />

                                    <button
                                        type="button"
                                        className="btn btn-outline-secondary"
                                        onClick={() =>
                                            setShowConfirmPassword(
                                                !showConfirmPassword,
                                            )
                                        }
                                        aria-label={
                                            showConfirmPassword
                                                ? 'Hide confirm password'
                                                : 'Show confirm password'
                                        }
                                    >
                                        <i
                                            className={`bi ${showConfirmPassword
                                                    ? 'bi-eye-slash'
                                                    : 'bi-eye'
                                                }`}
                                        ></i>
                                    </button>
                                </div>
                            </div>

                            <button
                                type="button"
                                className="btn btn-primary"
                                onClick={handleResetPassword}
                            >
                                Reset Password
                            </button>
                        </div>
                    </div>
                )}
            </div>
        </section>
    )
}

export default ResetPassword