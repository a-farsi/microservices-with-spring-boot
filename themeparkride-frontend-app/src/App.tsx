
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import NotFound from "./pages/NotFound";
import CustomerList from "./components/customers/CustomerList";
import CustomerForm from "./components/customers/CustomerForm";
import RideList from "./components/rides/RideList";
import RideForm from "./components/rides/RideForm";
import BookingList from "./components/bookings/BookingList";
import BookingForm from "./components/bookings/BookingForm";
import Navbar from "./components/layout/Navbar";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <div className="min-h-screen flex flex-col bg-gray-50">
          <Navbar />
          <div className="flex-1">
            <Routes>
              <Route path="/" element={<Home />} />
              
              {/* Routes pour les customers */}
              <Route path="/customers" element={<CustomerList />} />
              <Route path="/customers/:id" element={<CustomerForm />} />
              <Route path="/customers/new" element={<CustomerForm />} />

              {/* Routes pour les attractions */}
              <Route path="/rides" element={<RideList />} />
              <Route path="/rides/:id" element={<RideForm />} />
              <Route path="/rides/new" element={<RideForm />} />

              {/* Routes pour les réservations */}
              <Route path="/bookings" element={<BookingList />} />
              <Route path="/bookings/:id" element={<BookingForm />} />
              <Route path="/bookings/new" element={<BookingForm />} />
              
              {/* Route 404 */}
              <Route path="*" element={<NotFound />} />
            </Routes>
          </div>
        </div>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
