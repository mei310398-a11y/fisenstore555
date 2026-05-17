'use client'

import { useState } from 'react'
import { supabase } from '@/lib/supabase'
import { useRouter } from 'next/navigation'

export default function LoginPage() {

  const router = useRouter()

  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')

  async function handleLogin() {

    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    })

    if (error) {
      alert(error.message)
      return
    }

    alert('Login berhasil!')

    router.push('/dashboard')
  }

  return (
    <main className="min-h-screen bg-black text-white flex items-center justify-center">

      <div className="bg-zinc-900 border border-red-500 p-10 rounded-2xl w-[400px]">

        <h1 className="text-4xl font-bold text-red-500">
          LOGIN
        </h1>

        <input
          type="email"
          placeholder="Email"
          className="w-full mt-6 p-3 rounded-xl bg-zinc-800"
          onChange={(e) => setEmail(e.target.value)}
        />

        <input
          type="password"
          placeholder="Password"
          className="w-full mt-4 p-3 rounded-xl bg-zinc-800"
          onChange={(e) => setPassword(e.target.value)}
        />

        <button
          onClick={handleLogin}
          className="w-full mt-6 bg-red-500 hover:bg-red-600 p-3 rounded-xl"
        >
          LOGIN
        </button>

      </div>

    </main>
  )
}