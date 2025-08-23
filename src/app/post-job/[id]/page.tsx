'use client'

import PostPage from '@/components/Pages/PostPage'
import ProtectedRoute from '@/Services/ProtectedRoute'

export default function PostJobPage() {
  return (
    <ProtectedRoute allowedRoles={['COMPANY']}>
      <PostPage />
    </ProtectedRoute>
  )
}