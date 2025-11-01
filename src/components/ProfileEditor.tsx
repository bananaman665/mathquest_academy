'use client'

import { useState } from 'react'
import { Edit2, Check, X, Lock, User as UserIcon, AlertCircle } from 'lucide-react'

interface ProfileEditorProps {
  username: string | null
  userId: string
}

export default function ProfileEditor({ username, userId }: ProfileEditorProps) {
  const [isEditingUsername, setIsEditingUsername] = useState(false)
  const [isEditingPassword, setIsEditingPassword] = useState(false)
  const [newUsername, setNewUsername] = useState(username || '')
  const [currentPassword, setCurrentPassword] = useState('')
  const [newPassword, setNewPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')

  const handleUsernameUpdate = async () => {
    if (!newUsername.trim()) {
      setError('Username cannot be empty')
      return
    }

    if (newUsername.length < 3) {
      setError('Username must be at least 3 characters')
      return
    }

    setLoading(true)
    setError('')
    setSuccess('')

    try {
      const response = await fetch('/api/profile/update-username', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username: newUsername })
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || 'Failed to update username')
      }

      setSuccess('Username updated successfully!')
      setIsEditingUsername(false)
      setTimeout(() => setSuccess(''), 3000)
    } catch (err: any) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  const handlePasswordUpdate = async () => {
    setError('')
    setSuccess('')

    if (!currentPassword || !newPassword || !confirmPassword) {
      setError('All password fields are required')
      return
    }

    if (newPassword.length < 8) {
      setError('New password must be at least 8 characters')
      return
    }

    if (newPassword !== confirmPassword) {
      setError('New passwords do not match')
      return
    }

    setLoading(true)

    try {
      const response = await fetch('/api/profile/update-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          currentPassword,
          newPassword 
        })
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || 'Failed to update password')
      }

      setSuccess('Password updated successfully!')
      setIsEditingPassword(false)
      setCurrentPassword('')
      setNewPassword('')
      setConfirmPassword('')
      setTimeout(() => setSuccess(''), 3000)
    } catch (err: any) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="space-y-4">
      {/* Success/Error Messages */}
      {success && (
        <div className="bg-green-100 border-2 border-green-300 text-green-800 px-4 py-3 rounded-xl flex items-center gap-2">
          <Check className="w-5 h-5" />
          <span className="font-semibold">{success}</span>
        </div>
      )}

      {error && (
        <div className="bg-red-100 border-2 border-red-300 text-red-800 px-4 py-3 rounded-xl flex items-center gap-2">
          <AlertCircle className="w-5 h-5" />
          <span className="font-semibold">{error}</span>
        </div>
      )}

      {/* Username Section */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-gray-200 gap-4">
        {!isEditingUsername ? (
          <>
            <div className="flex-1">
              <p className="font-bold text-gray-900">Username</p>
              <p className="text-sm text-gray-600">{username || 'Not set'}</p>
            </div>
            <button
              onClick={() => setIsEditingUsername(true)}
              className="flex items-center gap-2 text-blue-600 font-bold hover:text-blue-700 transition-colors"
            >
              <Edit2 className="w-4 h-4" />
              <span>Edit</span>
            </button>
          </>
        ) : (
          <div className="flex-1 space-y-3">
            <div className="flex items-center gap-2">
              <UserIcon className="w-5 h-5 text-gray-600" />
              <input
                type="text"
                value={newUsername}
                onChange={(e) => setNewUsername(e.target.value)}
                placeholder="Enter username"
                className="flex-1 px-4 py-2 border-2 border-gray-300 rounded-xl focus:border-blue-500 focus:outline-none font-semibold"
                disabled={loading}
              />
            </div>
            <div className="flex gap-2">
              <button
                onClick={handleUsernameUpdate}
                disabled={loading}
                className="flex items-center gap-2 bg-green-600 hover:bg-green-700 disabled:bg-gray-400 text-white font-bold px-4 py-2 rounded-xl transition-colors"
              >
                <Check className="w-4 h-4" />
                <span>{loading ? 'Saving...' : 'Save'}</span>
              </button>
              <button
                onClick={() => {
                  setIsEditingUsername(false)
                  setNewUsername(username || '')
                  setError('')
                }}
                disabled={loading}
                className="flex items-center gap-2 bg-gray-200 hover:bg-gray-300 text-gray-700 font-bold px-4 py-2 rounded-xl transition-colors"
              >
                <X className="w-4 h-4" />
                <span>Cancel</span>
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Password Section */}
      <div className="flex flex-col sm:flex-row sm:items-start justify-between pb-4 border-b border-gray-200 gap-4">
        {!isEditingPassword ? (
          <>
            <div className="flex-1">
              <p className="font-bold text-gray-900">Password</p>
              <p className="text-sm text-gray-600">••••••••</p>
            </div>
            <button
              onClick={() => setIsEditingPassword(true)}
              className="flex items-center gap-2 text-blue-600 font-bold hover:text-blue-700 transition-colors"
            >
              <Edit2 className="w-4 h-4" />
              <span>Change</span>
            </button>
          </>
        ) : (
          <div className="flex-1 space-y-3">
            <div className="flex items-center gap-2">
              <Lock className="w-5 h-5 text-gray-600" />
              <input
                type="password"
                value={currentPassword}
                onChange={(e) => setCurrentPassword(e.target.value)}
                placeholder="Current password"
                className="flex-1 px-4 py-2 border-2 border-gray-300 rounded-xl focus:border-blue-500 focus:outline-none font-semibold"
                disabled={loading}
              />
            </div>
            <div className="flex items-center gap-2">
              <Lock className="w-5 h-5 text-gray-600" />
              <input
                type="password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                placeholder="New password (min 8 characters)"
                className="flex-1 px-4 py-2 border-2 border-gray-300 rounded-xl focus:border-blue-500 focus:outline-none font-semibold"
                disabled={loading}
              />
            </div>
            <div className="flex items-center gap-2">
              <Lock className="w-5 h-5 text-gray-600" />
              <input
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="Confirm new password"
                className="flex-1 px-4 py-2 border-2 border-gray-300 rounded-xl focus:border-blue-500 focus:outline-none font-semibold"
                disabled={loading}
              />
            </div>
            <div className="flex gap-2">
              <button
                onClick={handlePasswordUpdate}
                disabled={loading}
                className="flex items-center gap-2 bg-green-600 hover:bg-green-700 disabled:bg-gray-400 text-white font-bold px-4 py-2 rounded-xl transition-colors"
              >
                <Check className="w-4 h-4" />
                <span>{loading ? 'Updating...' : 'Update'}</span>
              </button>
              <button
                onClick={() => {
                  setIsEditingPassword(false)
                  setCurrentPassword('')
                  setNewPassword('')
                  setConfirmPassword('')
                  setError('')
                }}
                disabled={loading}
                className="flex items-center gap-2 bg-gray-200 hover:bg-gray-300 text-gray-700 font-bold px-4 py-2 rounded-xl transition-colors"
              >
                <X className="w-4 h-4" />
                <span>Cancel</span>
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
