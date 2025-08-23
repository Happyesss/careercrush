'use client'

import SignUpPage from '@/components/Pages/SignUpPage'
import PublicRoute from '@/Services/PublicRoute'

export default function SignUp() {
  return (
    <PublicRoute restricted={true}>
      <SignUpPage />
    </PublicRoute>
  )
}