'use client'

import PostHackathonPage from '@/components/Pages/PostHackathonPage'
import ProtectedRoute from '@/Services/ProtectedRoute'

export default function PostHackathon() {
  return (
    <ProtectedRoute allowedRoles={['COMPANY']}>
      <PostHackathonPage />
    </ProtectedRoute>
  )
}