'use client'

import ApplyJob from '@/components/Pages/ApplyJob'
import { useSelector } from 'react-redux'
import { redirect, useParams } from 'next/navigation'
import { useEffect } from 'react'

export default function ApplyJobPage() {
  const params = useParams();
  const user = useSelector((state: any) => state.user)

  useEffect(() => {
    if (!user) {
      redirect('/login')
    }
  }, [user])

  if (!user) {
    return null
  }

  return <ApplyJob />
}