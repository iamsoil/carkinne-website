import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { ThemeProvider } from "next-themes";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import Index from "./pages/Index";
import Cars from "./pages/Cars";
import CarDetail from "./pages/CarDetail";
import BudgetFinder from "./pages/BudgetFinder";
import EmiCalculator from "./pages/EmiCalculator";
import Compare from "./pages/Compare";
import Showrooms from "./pages/Showrooms";
import ElectricCars from "./pages/ElectricCars";
import Offers from "./pages/Offers";
import Blog from "./pages/Blog";
import BlogPost from "./pages/BlogPost";
import Admin from "./pages/Admin";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <div className="flex flex-col min-h-screen">
            <Navbar />
            <main className="flex-1">
              <Routes>
                <Route path="/" element={<Index />} />
                <Route path="/cars" element={<Cars />} />
                <Route path="/cars/:slug" element={<CarDetail />} />
                <Route path="/budget-finder" element={<BudgetFinder />} />
                <Route path="/emi-calculator" element={<EmiCalculator />} />
                <Route path="/compare" element={<Compare />} />
                <Route path="/showrooms" element={<Showrooms />} />
                <Route path="/electric-cars" element={<ElectricCars />} />
                <Route path="/offers" element={<Offers />} />
                <Route path="/blog" element={<Blog />} />
                <Route path="/blog/:slug" element={<BlogPost />} />
                <Route path="/admin" element={<Admin />} />
                {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
                <Route path="*" element={<NotFound />} />
              </Routes>
            </main>
            <Footer />
          </div>
        </BrowserRouter>
      </TooltipProvider>
    </ThemeProvider>
  </QueryClientProvider>
);

export default App;