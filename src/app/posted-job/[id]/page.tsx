'use client'

import PostedJob from '@/components/Pages/PostedJob'
import ProtectedRoute from '@/Services/ProtectedRoute'

export default function PostedJobPage() {
  return (
    <ProtectedRoute allowedRoles={['COMPANY']}>
      <PostedJob />
    </ProtectedRoute>
  )
}