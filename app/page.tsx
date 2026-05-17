import Navbar from '@/components/Navbar'
import ProductList from '@/components/ProductList'
export default function Home() {
  return (
    <main className="min-h-screen bg-black text-white flex items-center justify-center">
      <Navbar />
      <div>
        <h1 className="text-6xl font-bold text-red-500">
          FISENSTORE555
        </h1>

        <p className="text-green-400 text-2xl mt-4">
          DIGITAL STORE NEON GAMING
        </p>
        <ProductList />
      </div>
    </main>
  )
}