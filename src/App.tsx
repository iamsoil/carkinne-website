import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { ThemeProvider } from "@/components/theme-provider";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import Index from "./pages/Index";
import Cars from "./pages/Cars";
import CarDetail from "./pages/CarDetail";
import EmiCalculator from "./pages/EmiCalculator";
import BudgetFinder from "./pages/BudgetFinder";
import ElectricCars from "./pages/ElectricCars";
import Showrooms from "./pages/Showrooms";
import Offers from "./pages/Offers";
import Blog from "./pages/Blog";
import BlogPost from "./pages/BlogPost";
import Compare from "./pages/Compare";
import Admin from "./pages/Admin";
import NotFound from "./pages/NotFound";
import EvCars from "./pages/EvCars";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <ThemeProvider defaultTheme="system" storageKey="vite-ui-theme">
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <div className="flex flex-col min-h-screen">
            <Header />
            <main className="flex-grow">
              <Routes>
                <Route path="/" element={<Index />} />
                <Route path="/cars" element={<Cars />} />
                <Route path="/cars/:slug" element={<CarDetail />} />
                <Route path="/emi-calculator" element={<EmiCalculator />} />
                <Route path="/budget-finder" element={<BudgetFinder />} />
                <Route path="/electric-cars" element={<ElectricCars />} />
                <Route path="/ev-cars" element={<EvCars />} />
                <Route path="/showrooms" element={<Showrooms />} />
                <Route path="/offers" element={<Offers />} />
                <Route path="/blog" element={<Blog />} />
                <Route path="/blog/:slug" element={<BlogPost />} />
                <Route path="/compare" element={<Compare />} />
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