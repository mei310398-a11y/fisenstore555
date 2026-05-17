'use client'

import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase'
import Navbar from '@/components/Navbar'

export default function AdminPage() {

  const [products, setProducts] = useState<any[]>([])
  const [users, setUsers] = useState<any[]>([])
  const [topups, setTopups] = useState<any[]>([])

  const [name, setName] = useState('')
  const [description, setDescription] = useState('')
  const [price, setPrice] = useState('')

  const [selectedProduct, setSelectedProduct] = useState('')
  const [productKey, setProductKey] = useState('')

  const [selectedUser, setSelectedUser] = useState('')
  const [balanceAmount, setBalanceAmount] = useState('')

  useEffect(() => {
    checkAdmin()
    getProducts()
    getUsers()
    getTopups()
  }, [])

  async function checkAdmin() {

    const {
      data: { user }
    } = await supabase.auth.getUser()

    if (!user) {
      window.location.href = '/'
      return
    }

    const { data } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', user.id)
      .single()

    if (data?.role !== 'owner') {
      alert('ACCESS DENIED')
      window.location.href = '/'
    }
  }

  async function getProducts() {

    const { data } = await supabase
      .from('products')
      .select('*')

    setProducts(data || [])
  }

  async function getUsers() {

    const { data } = await supabase
      .from('profiles')
      .select('*')

    setUsers(data || [])
  }

  async function getTopups() {

    const { data } = await supabase
      .from('topups')
      .select('*')
      .eq('status', 'pending')

    setTopups(data || [])
  }

  async function addProduct() {

    const { error } = await supabase
      .from('products')
      .insert({
        name,
        description,
        price: Number(price)
      })

    if (error) {
      alert(error.message)
      return
    }

    alert('Product added!')

    setName('')
    setDescription('')
    setPrice('')

    getProducts()
  }

  async function addProductKey() {

    const { error } = await supabase
      .from('product_keys')
      .insert({
        product_id: selectedProduct,
        product_key: productKey,
        is_sold: false
      })

    if (error) {
      alert(error.message)
      return
    }

    alert('Key added!')

    setProductKey('')

    getProducts()
  }

  async function addBalance() {

    const userData = users.find(
      (u) => u.id === selectedUser
    )

    if (!userData) {
      alert('User tidak ditemukan!')
      return
    }

    const newBalance =
      Number(userData.balance) + Number(balanceAmount)

    await supabase
      .from('profiles')
      .update({
        balance: newBalance
      })
      .eq('id', selectedUser)

    await supabase
      .from('balance_logs')
      .insert({
        user_id: selectedUser,
        amount: Number(balanceAmount),
        type: 'admin_add'
      })

    alert('Saldo berhasil ditambahkan!')

    setBalanceAmount('')

    getUsers()
  }

  async function approveTopup(topup: any) {

    const { data: profile } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', topup.user_id)
      .single()

    if (!profile) return

    const newBalance =
      Number(profile.balance) + Number(topup.amount)

    await supabase
      .from('profiles')
      .update({
        balance: newBalance
      })
      .eq('id', topup.user_id)

    await supabase
      .from('topups')
      .update({
        status: 'approved'
      })
      .eq('id', topup.id)

    await supabase
      .from('balance_logs')
      .insert({
        user_id: topup.user_id,
        amount: topup.amount,
        type: 'topup'
      })

    alert('Topup approved!')

    getTopups()
  }

  return (
    <main className="min-h-screen bg-black text-white">

      <Navbar />

      <div className="p-10">

        <h1 className="text-6xl font-bold text-red-500">
          OWNER PANEL
        </h1>

        <div className="bg-zinc-900 border border-red-500 rounded-2xl p-8 mt-10">

          <h2 className="text-4xl font-bold text-red-400">
            ADD PRODUCT
          </h2>

          <input
            type="text"
            placeholder="Product Name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full mt-6 p-3 rounded-xl bg-zinc-800"
          />

          <input
            type="text"
            placeholder="Description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="w-full mt-4 p-3 rounded-xl bg-zinc-800"
          />

          <input
            type="number"
            placeholder="Price"
            value={price}
            onChange={(e) => setPrice(e.target.value)}
            className="w-full mt-4 p-3 rounded-xl bg-zinc-800"
          />

          <button
            onClick={addProduct}
            className="mt-6 bg-red-500 hover:bg-red-600 px-6 py-3 rounded-xl"
          >
            ADD PRODUCT
          </button>

        </div>

        <div className="bg-zinc-900 border border-green-500 rounded-2xl p-8 mt-10">

          <h2 className="text-4xl font-bold text-green-400">
            ADD PRODUCT KEY
          </h2>

          <select
            value={selectedProduct}
            onChange={(e) => setSelectedProduct(e.target.value)}
            className="w-full mt-6 p-3 rounded-xl bg-zinc-800"
          >

            <option value="">
              Select Product
            </option>

            {products.map((item) => (

              <option key={item.id} value={item.id}>
                {item.name}
              </option>

            ))}

          </select>

          <textarea
            placeholder="Product Key / Link"
            value={productKey}
            onChange={(e) => setProductKey(e.target.value)}
            className="w-full mt-4 p-3 rounded-xl bg-zinc-800 h-40"
          />

          <button
            onClick={addProductKey}
            className="mt-6 bg-green-500 hover:bg-green-600 px-6 py-3 rounded-xl"
          >
            ADD KEY
          </button>

        </div>

        <div className="bg-zinc-900 border border-cyan-500 rounded-2xl p-8 mt-10">

          <h2 className="text-4xl font-bold text-cyan-400">
            USER BALANCE
          </h2>

          <select
            value={selectedUser}
            onChange={(e) => setSelectedUser(e.target.value)}
            className="w-full mt-6 p-3 rounded-xl bg-zinc-800"
          >

            <option value="">
              Select User
            </option>

            {users.map((item) => (

              <option key={item.id} value={item.id}>
                {item.email} - Rp {item.balance}
              </option>

            ))}

          </select>

          <input
            type="number"
            placeholder="Balance Amount"
            value={balanceAmount}
            onChange={(e) => setBalanceAmount(e.target.value)}
            className="w-full mt-4 p-3 rounded-xl bg-zinc-800"
          />

          <button
            onClick={addBalance}
            className="mt-6 bg-cyan-500 hover:bg-cyan-600 px-6 py-3 rounded-xl"
          >
            ADD BALANCE
          </button>

        </div>

        <div className="bg-zinc-900 border border-pink-500 rounded-2xl p-8 mt-10">

          <h2 className="text-4xl font-bold text-pink-400">
            TOPUP REQUESTS
          </h2>

          <div className="grid grid-cols-1 gap-6 mt-6">

            {topups.map((item) => (

              <div
                key={item.id}
                className="bg-zinc-800 rounded-2xl p-6"
              >

                <p>
                  USER ID: {item.user_id}
                </p>

                <p className="mt-3">
                  Amount: Rp {item.amount}
                </p>

                <button
                  onClick={() => approveTopup(item)}
                  className="mt-5 bg-pink-500 hover:bg-pink-600 px-5 py-2 rounded-xl"
                >
                  APPROVE
                </button>

              </div>

            ))}

          </div>

        </div>

      </div>

    </main>
  )
}