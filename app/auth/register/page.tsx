'use client'

import { useState } from 'react'
import { supabase } from '@/lib/supabase'

export default function RegisterPage() {

  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')

  async function handleRegister() {

    const { data, error } = await supabase.auth.signUp({
      email,
      password,
    })

    if (error) {
      alert(error.message)
      return
    }

    const user = data.user

    if (!user) return

    await supabase
      .from('profiles')
      .insert({
        id: user.id,
        email: user.email,
        display_name: 'New User',
        role: 'customer',
        balance: 100000,
        unique_code: Math.random().toString(36).substring(2, 10),
      })

    alert('Register berhasil!')
  }

  return (
    <main className="min-h-screen bg-black text-white flex items-center justify-center">

      <div className="bg-zinc-900 border border-green-500 p-10 rounded-2xl w-[400px]">

        <h1 className="text-4xl font-bold text-green-500">
          REGISTER
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
          onClick={handleRegister}
          className="w-full mt-6 bg-green-500 hover:bg-green-600 p-3 rounded-xl"
        >
          REGISTER
        </button>

      </div>

    </main>
  )
}