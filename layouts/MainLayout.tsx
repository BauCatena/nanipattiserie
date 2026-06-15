import { Header } from "@/components/Header"
import { ProductList } from "@/components/ProductList"
import { config } from "@/data/config"

/**
 * Composición del inicio. Reordenar los bloques en el JSX
 * (por ejemplo intercambiar Hero y ProductList) cambia el orden en pantalla.
 */
function MainLayout() {
  return (
    <main className="min-h-screen">
      <Header {...config.header} />
      <div className="pt-16 md:pt-20">
        <ProductList {...config.productList} />
      </div>
    </main>
  )
}

export { MainLayout }
export default MainLayout
