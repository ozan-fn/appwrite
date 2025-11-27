import { useState, useEffect } from 'react'
import { createFileRoute, Link } from '@tanstack/react-router'
import logo from '../logo.svg'
import { storage, account, ID } from '@/lib/appwrite'
import { useAuth } from '@/contexts/AuthContext'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'

export const Route = createFileRoute('/')({
  component: App,
})

function App() {
  const { user, loading, logout } = useAuth()
  const [files, setFiles] = useState<any[]>([])
  const [selectedFile, setSelectedFile] = useState<File | null>(null)
  const [profileFile, setProfileFile] = useState<File | null>(null)
  const [profilePhotoUrl, setProfilePhotoUrl] = useState('')

  const bucketId = import.meta.env.VITE_APPWRITE_BUCKET_ID || 'media'

  useEffect(() => {
    if (user) {
      loadFiles()
      loadProfilePhoto()
    }
  }, [user])

  async function loadProfilePhoto() {
    try {
      const prefs = await account.getPrefs()
      if (prefs.profilePhotoId) {
        setProfilePhotoUrl(storage.getFileView(bucketId, prefs.profilePhotoId))
      }
    } catch (e) {
      console.error('Failed to load profile photo:', e)
    }
  }

  async function loadFiles() {
    try {
      const response = await storage.listFiles(bucketId)
      setFiles(response.files || [])
    } catch (e) {
      console.error('Failed to load files:', e)
    }
  }

  async function uploadFile() {
    if (!selectedFile) return
    try {
      await storage.createFile(bucketId, ID.unique(), selectedFile)
      loadFiles()
      setSelectedFile(null)
    } catch (e) {
      console.error('Failed to upload file:', e)
    }
  }

  async function deleteFile(fileId: string) {
    try {
      await storage.deleteFile(bucketId, fileId)
      loadFiles()
    } catch (e) {
      console.error('Failed to delete file:', e)
    }
  }

  async function uploadProfilePhoto() {
    if (!profileFile) return
    try {
      const file = await storage.createFile(bucketId, ID.unique(), profileFile)
      await account.updatePrefs({ profilePhotoId: file.$id })
      setProfilePhotoUrl(storage.getFileView(bucketId, file.$id))
      setProfileFile(null)
    } catch (e) {
      console.error('Failed to upload profile photo:', e)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div className="flex items-center space-x-4">
              <img src={logo} className="h-8 w-8" alt="logo" />
              <h1 className="text-xl font-semibold text-gray-900">
                Appwrite App
              </h1>
            </div>
            <div className="flex items-center space-x-4">
              {user ? (
                <>
                  <div className="flex items-center space-x-2">
                    <div className="w-8 h-8 rounded-full overflow-hidden bg-gray-200">
                      {profilePhotoUrl ? (
                        <img
                          src={profilePhotoUrl}
                          alt="Profile"
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-gray-500 text-xs">
                          {user?.name?.charAt(0)?.toUpperCase() || 'U'}
                        </div>
                      )}
                    </div>
                    <span className="text-sm text-gray-700">
                      {user?.name || user?.email}
                    </span>
                  </div>
                  <Button onClick={logout} variant="outline" size="sm">
                    Logout
                  </Button>
                </>
              ) : (
                <div className="space-x-2">
                  <Link to="/login">
                    <Button variant="outline" size="sm">
                      Login
                    </Button>
                  </Link>
                  <Link to="/signup">
                    <Button size="sm">Signup</Button>
                  </Link>
                </div>
              )}
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {user ? (
          <div className="space-y-8">
            {/* Profile Section */}
            <Card>
              <CardHeader>
                <CardTitle>Profile</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-center space-x-4">
                  <div className="w-16 h-16 rounded-full overflow-hidden bg-gray-200">
                    {profilePhotoUrl ? (
                      <img
                        src={profilePhotoUrl}
                        alt="Profile"
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-gray-500">
                        {user?.name?.charAt(0)?.toUpperCase() || 'U'}
                      </div>
                    )}
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-medium text-gray-900">
                      {user?.name || 'User'}
                    </p>
                    <p className="text-sm text-gray-500">{user?.email}</p>
                  </div>
                </div>
                <div className="mt-4 flex items-center space-x-2">
                  <Input
                    type="file"
                    accept="image/*"
                    onChange={(e) =>
                      setProfileFile(e.target.files?.[0] || null)
                    }
                    className="flex-1"
                  />
                  <Button onClick={uploadProfilePhoto} disabled={!profileFile}>
                    Upload Photo
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Welcome Section */}
            <Card>
              <CardHeader>
                <CardTitle>Dashboard</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600">
                  Manage your media files and test the connection.
                </p>
                <div className="mt-4">
                  <p className="text-sm text-gray-600">
                    Manage your media files below.
                  </p>
                </div>
              </CardContent>
            </Card>

            {/* Media CRUD Section */}
            <Card>
              <CardHeader>
                <CardTitle>Media Management</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center space-x-4">
                    <Input
                      type="file"
                      onChange={(e) =>
                        setSelectedFile(e.target.files?.[0] || null)
                      }
                      className="flex-1"
                    />
                    <Button onClick={uploadFile} disabled={!selectedFile}>
                      Upload File
                    </Button>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                    {files.map((file) => (
                      <Card key={file.$id} className="overflow-hidden">
                        <CardContent className="p-0">
                          {file.mimeType.startsWith('image/') ? (
                            <img
                              src={storage.getFileView(bucketId, file.$id)}
                              alt={file.name}
                              className="w-full h-48 object-cover"
                            />
                          ) : (
                            <div className="w-full h-48 bg-gray-200 flex items-center justify-center">
                              <span className="text-gray-500 text-sm">
                                {file.name}
                              </span>
                            </div>
                          )}
                          <div className="p-4">
                            <p className="text-sm font-medium text-gray-900 truncate">
                              {file.name}
                            </p>
                            <p className="text-xs text-gray-500 mt-1">
                              {file.size
                                ? (file.size / 1024).toFixed(1) + ' KB'
                                : 'Unknown size'}
                            </p>
                            <Button
                              onClick={() => deleteFile(file.$id)}
                              variant="destructive"
                              size="sm"
                              className="mt-2 w-full"
                            >
                              Delete
                            </Button>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                  {files.length === 0 && (
                    <div className="text-center py-12">
                      <p className="text-gray-500">No files uploaded yet.</p>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>
        ) : (
          <div className="text-center py-12">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Welcome</h2>
            <p className="text-gray-600 mb-8">
              Please log in to access your dashboard and manage media files.
            </p>
            <div className="space-x-4">
              <Link to="/login">
                <Button size="lg">Login</Button>
              </Link>
              <Link to="/signup">
                <Button variant="outline" size="lg">
                  Create Account
                </Button>
              </Link>
            </div>
          </div>
        )}
      </main>
    </div>
  )
}
