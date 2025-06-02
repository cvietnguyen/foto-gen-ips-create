
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { DemoProvider } from "./contexts/DemoContext";
import DemoControls from "./components/DemoControls";
import Index from "./pages/Index";
import LoginPage from "./pages/LoginPage";
import HomePage from "./pages/HomePage";
import TrainingPage from "./pages/TrainingPage";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <DemoProvider>
        <Toaster />
        <Sonner />
        <DemoControls />
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/home" element={<HomePage />} />
            <Route path="/training" element={<TrainingPage />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </DemoProvider>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
