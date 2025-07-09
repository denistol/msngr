import { Footer } from "@/components/footer"
import { Header } from "@/components/header"
import { MainWindow } from "@/components/main-window"

export default function Home() {
  
  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <MainWindow/>
      <Footer />
    </div>
  )
}
