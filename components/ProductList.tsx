'use client'

import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase'

export default function ProductList() {

  const [products, setProducts] = useState<any[]>([])

  useEffect(() => {
    getProducts()
  }, [])

  async function getProducts() {

    const { data } = await supabase
      .from('products')
      .select(`
        *,
        product_keys (
          id,
          product_key,
          is_sold
        )
      `)

    setProducts(data || [])
  }

  async function buyProduct(product: any) {

    const {
      data: { user }
    } = await supabase.auth.getUser()

    if (!user) {
      alert('Login dulu!')
      return
    }

    const { data: profile } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', user.id)
      .single()

    if (!profile) {
      alert('Profile tidak ditemukan!')
      return
    }

    if (profile.balance < product.price) {
      alert('Saldo tidak cukup!')
      return
    }

    const availableKey = product.product_keys?.find(
      (key: any) => !key.is_sold
    )

    if (!availableKey) {
      alert('Stock habis!')
      return
    }

    const { error: updateError } = await supabase
      .from('product_keys')
      .update({
        is_sold: true
      })
      .eq('id', availableKey.id)

    if (updateError) {
      alert(updateError.message)
      return
    }

    await supabase
      .from('profiles')
      .update({
        balance: profile.balance - product.price
      })
      .eq('id', user.id)

    const { error: transactionError } = await supabase
      .from('transactions')
      .insert({
        user_id: user.id,
        product_id: product.id,
        product_key: availableKey.product_key,
        price: product.price,
      })

    if (transactionError) {
      alert(transactionError.message)
      return
    }

    try {

      await fetch('/api/send-email', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          to: profile.email,
          subject: `FISENSTORE555 - ${product.name}`,
          text: `
Terima kasih telah membeli di FISENSTORE555

Produk:
${product.name}

KEY / LINK:
${availableKey.product_key}

Harga:
Rp ${product.price}

Enjoy 🔥
          `
        })
      })

    } catch (err) {
      console.log(err)
    }

    alert(
      `Pembelian berhasil!\n\nKEY:\n${availableKey.product_key}`
    )

    getProducts()
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-10">

      {products.map((item) => {

        const stock =
          item.product_keys?.filter(
            (key: any) => !key.is_sold
          ).length || 0

        return (

          <div
            key={item.id}
            className="bg-zinc-900 border border-red-500 rounded-2xl p-6"
          >

            <h2 className="text-3xl font-bold text-red-400">
              {item.name}
            </h2>

            <p className="text-zinc-400 mt-3">
              {item.description}
            </p>

            <p className="text-green-400 text-2xl mt-5">
              Rp {item.price}
            </p>

            <p className="text-yellow-400 mt-3">
              Stock: {stock}
            </p>

            <button
              onClick={() => buyProduct(item)}
              className="mt-6 bg-red-500 hover:bg-red-600 px-6 py-3 rounded-xl w-full"
            >
              BUY
            </button>

          </div>

        )
      })}

    </div>
  )
}