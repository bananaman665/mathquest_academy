import { currentUser } from '@clerk/nextjs/server'
import { redirect } from 'next/navigation'
import PlacementTestClient from './PlacementTestClient'

export default async function PlacementTestPage() {
  const user = await currentUser()

  if (!user) {
    redirect('/signin')
  }

  return <PlacementTestClient />
}
