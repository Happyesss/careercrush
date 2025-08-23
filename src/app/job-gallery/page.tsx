'use client'

import JobGalleryPage from '@/components/Pages/JobGalleryPage'
import { useSelector } from 'react-redux'
import { redirect } from 'next/navigation'
import { useEffect } from 'react'

export default function JobGallery() {
  const user = useSelector((state: any) => state.user)

  useEffect(() => {
    if (!user) {
      redirect('/login')
    }
  }, [user])

  if (!user) {
    return null
  }

  return <JobGalleryPage />
}