import { Outlet } from "react-router-dom";
import Navbar from "../components/Navbar";
import Sidebar from "../components/sidebar";
import { Toaster } from "react-hot-toast";








export default function LayOutDoctor() {
   return (
    <>
             <Navbar />
        <div className="flex flex-1 overflow-hidden">
              <Sidebar />

              <main className="flex-1  mb-25 mt-11">
                <div className="container py-8">
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