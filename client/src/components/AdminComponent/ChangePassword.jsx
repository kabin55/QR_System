import React, { useState } from 'react';
import { changeCredentials } from '../../service/adminapi';
import { useToast } from  '../../utils/toastProvider'


const ChangeCredentials = ({ backendUrl, restaurantId, onClose }) => {
  const [username, setUsername] = useState('');
  const [oldPassword, setOldPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const [showOld, setShowOld] = useState(false);
  const [showNew, setShowNew] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
    const { showToast } = useToast()
  

  const [error, setError] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

 const handleSubmit = async (e) => {
  e.preventDefault()
  setError(null)

  if (newPassword !== confirmPassword) {
    setError('Passwords do not match')
    return
  }

  if (newPassword.length < 6) {
    setError('Password must be at least 6 characters long')
    return
  }

  if (!oldPassword) {
    setError('Please enter your current password')
    return
  }

  setIsSubmitting(true)

  try {
    await changeCredentials({
      backendUrl,
      restaurantId,
      username,
      oldPassword,
      newPassword,
      showToast
    })

    onClose()
  } catch (err) {
    setError(err.message)
  } finally {
    setIsSubmitting(false)
  }
}


  // Helper function for password fields with toggle
  const renderPasswordField = (label, value, setValue, show, setShow, placeholder) => (
    <div className="relative w-full">
      <label className="block text-gray-600 text-sm mb-1">{label}</label>
      <input
        type={show ? 'text' : 'password'}
        value={value}
        onChange={(e) => setValue(e.target.value)}
        placeholder={placeholder}
        required
        className="w-full h-11 px-4 pr-10 rounded-lg border border-gray-300 text-sm text-gray-700
                   focus:ring-2 focus:ring-blue-200 focus:border-blue-400 outline-none relative z-10"
      />
      <button
        type="button"
        onClick={() => setShow(!show)}
        className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-700 z-20"
      >
        {show ? (
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M13.875 18.825A10.05 10.05 0 0112 19c-5.523 0-10-4.477-10-10a9.956 9.956 0 012.167-5.794M21.95 12a9.958 9.958 0 00-1.612-4.48M15 12a3 3 0 11-6 0 3 3 0 016 0z"
            />
          </svg>
        ) : (
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M15 12a3 3 0 11-6 0 3 3 0 016 0zM2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
            />
          </svg>
        )}
      </button>
    </div>
  );

  return (
    <div className="min-h-[80vh] flex items-center justify-center bg-gray-50 px-4">
      <div className="w-full max-w-md bg-white rounded-xl shadow-lg overflow-hidden">
        {/* Header */}
        <div className="bg-gradient-to-r from-blue-600 to-cyan-500 p-6 text-center">
          <h2 className="text-lg font-semibold text-white">Update Credentials</h2>
          <p className="text-xs text-blue-100 mt-1">Securely update your username and password</p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          {/* Username */}
          <div>
            <label className="block text-gray-600 text-sm mb-1">Username</label>
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
              placeholder="New Username"
              className="w-full h-11 px-4 rounded-lg border border-gray-300 text-sm text-gray-700
                         focus:ring-2 focus:ring-blue-200 focus:border-blue-400 outline-none"
            />
          </div>

          {/* Old Password */}
          {renderPasswordField('Old Password', oldPassword, setOldPassword, showOld, setShowOld, 'Old Password')}

          {/* New Password */}
          {renderPasswordField('New Password', newPassword, setNewPassword, showNew, setShowNew, 'New Password')}

          {/* Confirm Password */}
          {renderPasswordField('Confirm Password', confirmPassword, setConfirmPassword, showConfirm, setShowConfirm, 'Confirm Password')}

          {/* Error */}
          {error && (
            <div className="flex items-center gap-2 p-2 bg-red-50 border border-red-200 rounded-lg text-red-600 text-xs">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
              <span>{error}</span>
            </div>
          )}

          {/* Buttons */}
          <div className="flex gap-3 pt-3">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 h-11 rounded-lg border border-gray-300 text-gray-700 text-sm font-medium hover:bg-gray-100 transition"
            >
              Cancel
            </button>

            <button
              type="submit"
              disabled={isSubmitting}
              className="flex-1 h-11 rounded-lg bg-gradient-to-r from-blue-600 to-cyan-500 text-white text-sm font-semibold
                         hover:from-blue-700 hover:to-cyan-600 disabled:opacity-50 transition"
            >
              {isSubmitting ? 'Updating...' : 'Update'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ChangeCredentials;