import { Outlet } from 'react-router-dom'
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar"
import { AppSidebar } from '@/components/AppSidebar'
import Navbar from '@/components/Navbar'


const Layout = () => {
  return (
    <SidebarProvider>
      <div className="relative min-h-screen w-full">

        {/* Sidebar fixa por cima */}
        <AppSidebar />

        {/* Conteúdo da página */}
        <main className="p-4">
          <Navbar />
          <SidebarTrigger className="relative z-60" />
          <Outlet />
        </main>

      </div>
    </SidebarProvider>
  )
}

export default Layout
