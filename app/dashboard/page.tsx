'use client'

import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase'
import Navbar from '@/components/Navbar'

export default function DashboardPage() {

  const [profile, setProfile] = useState<any>(null)

  const [transactions, setTransactions] = useState<any[]>([])

  const [topupAmount, setTopupAmount] = useState('')

  useEffect(() => {
    getProfile()
  }, [])

  async function getProfile() {

    const {
      data: { user }
    } = await supabase.auth.getUser()

    if (!user) return

    const { data } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', user.id)
      .single()

    setProfile(data)

    getTransactions(user.id)
  }

  async function getTransactions(userId: string) {

    const { data } = await supabase
      .from('transactions')
      .select(`
        *,
        products (
          name
        )
      `)
      .eq('user_id', userId)

    setTransactions(data || [])
  }

  async function requestTopup() {

    const {
      data: { user }
    } = await supabase.auth.getUser()

    if (!user) return

    const { error } = await supabase
      .from('topups')
      .insert({
        user_id: user.id,
        amount: Number(topupAmount),
      })

    if (error) {
      alert(error.message)
      return
    }

    alert('Request top up berhasil!')

    setTopupAmount('')
  }

  if (!profile) {
    return (
      <main className="min-h-screen bg-black text-white flex items-center justify-center">
        Loading...
      </main>
    )
  }

  return (
    <main className="min-h-screen bg-black text-white">

      <Navbar />

      <div className="p-10">

        <h1 className="text-6xl font-bold text-red-500">
          USER DASHBOARD
        </h1>

        <div className="bg-zinc-900 border border-red-500 rounded-2xl p-8 mt-10">

          <p className="text-2xl">
            Email: {profile.email}
          </p>

          <p className="text-2xl mt-4">
            Role: {profile.role}
          </p>

          <p className="text-2xl mt-4 text-green-400">
            Balance: Rp {profile.balance}
          </p>

          <p className="text-2xl mt-4 text-yellow-400">
            Unique Code: {profile.unique_code}
          </p>

        </div>

        <div className="bg-zinc-900 border border-cyan-500 rounded-2xl p-8 mt-10">

          <h2 className="text-4xl font-bold text-cyan-400">
            TOP UP BALANCE
          </h2>

          <input
            type="number"
            placeholder="Top Up Amount"
            value={topupAmount}
            onChange={(e) => setTopupAmount(e.target.value)}
            className="w-full mt-6 p-3 rounded-xl bg-zinc-800"
          />

          <button
            onClick={requestTopup}
            className="mt-6 bg-cyan-500 hover:bg-cyan-600 px-6 py-3 rounded-xl"
          >
            REQUEST TOP UP
          </button>

        </div>

        <div className="mt-10">

          <h2 className="text-4xl font-bold text-green-400">
            PURCHASE HISTORY
          </h2>

          <div className="grid grid-cols-1 gap-6 mt-6">

            {transactions.map((item) => (

              <div
                key={item.id}
                className="bg-zinc-900 border border-green-500 rounded-2xl p-6"
              >

                <h3 className="text-3xl font-bold text-green-400">
                  {item.products?.name}
                </h3>

                <p className="mt-3 text-zinc-400">
                  KEY:
                </p>

                <p className="mt-2 break-all text-yellow-400">
                  {item.product_key}
                </p>

                <p className="mt-4 text-zinc-500">
                  Rp {item.price}
                </p>

              </div>

            ))}

          </div>

        </div>

      </div>

    </main>
  )
}