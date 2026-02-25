import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { FilterProvider } from "@/contexts/FilterContext";
import { SocialDataProvider } from "@/contexts/SocialDataContext";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import CMHome from "./pages/CMHome";
import Trends from "./pages/Trends";
import Sentiment from "./pages/Sentiment";
import BreakingNews from "./pages/BreakingNews";
import Misinformation from "./pages/Misinformation";
import Influencers from "./pages/Influencers";
import PolicyImpact from "./pages/PolicyImpact";
import Reports from "./pages/Reports";
import Admin from "./pages/Admin";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <FilterProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <SocialDataProvider>
            <DashboardLayout>
              <Routes>
                <Route path="/" element={<CMHome />} />
                <Route path="/trends" element={<Trends />} />
                <Route path="/sentiment" element={<Sentiment />} />
                <Route path="/breaking" element={<BreakingNews />} />
                <Route path="/misinfo" element={<Misinformation />} />
                <Route path="/influencers" element={<Influencers />} />
                <Route path="/policy" element={<PolicyImpact />} />
                <Route path="/reports" element={<Reports />} />
                <Route path="/admin" element={<Admin />} />
                <Route path="*" element={<NotFound />} />
              </Routes>
            </DashboardLayout>
          </SocialDataProvider>
        </BrowserRouter>
      </FilterProvider>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;