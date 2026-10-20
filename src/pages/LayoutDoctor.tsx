import { Outlet } from "react-router-dom";
import Navbar from "../components/Navbar";
import Sidebar from "../components/sidebar";
import { Toaster } from "react-hot-toast";
import { useState } from "react";








export default function LayOutDoctor() {
   const [sidebarOpen, setSidebarOpen] = useState(true);

   return (
    <>
             <Navbar isOpen={sidebarOpen} />
        <div className="flex flex-1 overflow-hidden">
              <Sidebar isOpen={sidebarOpen} onToggle={() => setSidebarOpen((open) => !open)} />

              <main className={`min-w-0 flex-1 mb-25 mt-11 transition-[margin] duration-300 ${sidebarOpen ? "ml-[18%]" : "ml-0"}`}>
                <div className="w-full max-w-none px-4 py-8">
                  <Outlet />
                </div>
              </main>
       </div>
       
         <Toaster
            position="top-right"
            reverseOrder={false}
            gutter={8}
            toastOptions={{
                
              duration: 4000,
              style: {
                background: '#fff',
                color: '#000',
              },
              success: {
                duration: 3000,
                style: {
                  background: '#10b981',
                  color: '#fff',
                },
              },
              error: {
                duration: 4000,
                style: {
                  background: '#ef4444',
                  color: '#fff',
                },
              },
            }}
         />

    </>
   )
};