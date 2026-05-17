'use client'

import Link from 'next/link'
import { supabase } from '@/lib/supabase'
import { useRouter } from 'next/navigation'

export default function Navbar() {

  const router = useRouter()

  async function handleLogout() {

    await supabase.auth.signOut()

    router.push('/auth/login')
  }

  return (
    <nav className="bg-zinc-900 border-b border-red-500 p-5 flex justify-between items-center">

      <h1 className="text-3xl font-bold text-red-500">
        FISENSTORE555
      </h1>

      <div className="flex gap-5">

        <Link href="/">
          Home
        </Link>

        <Link href="/dashboard">
          Dashboard
        </Link>

        <Link href="/auth/login">
          Login
        </Link>

        <Link href="/auth/register">
          Register
        </Link>

        <button
          onClick={handleLogout}
          className="bg-red-500 px-4 py-1 rounded-xl"
        >
          Logout
        </button>

      </div>

    </nav>
  )
}