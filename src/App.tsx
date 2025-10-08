import React from "react";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { PageTransition } from "@/components/ui/loading-spinner";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import SplashScreen from "@/components/SplashScreen";
import { useSplashScreen } from "@/hooks/useSplashScreen";
import Index from "./pages/Index";
import HowItWorks from "./pages/HowItWorks";
import Features from "./pages/Features";
import Pricing from "./pages/Pricing";
import About from "./pages/About";
import Contact from "./pages/Contact";
import Login from "./pages/Login";
import Demo from "./pages/Demo";
import Subscribe from "./pages/Subscribe";
import SubscriptionSuccess from "./pages/SubscriptionSuccess";
import PaymentGatewaySimulation from "./pages/PaymentGatewaySimulation";
import AdminDashboard from "./pages/AdminDashboard";
import StudentTutor from "./pages/StudentTutor";
import NotFound from "./pages/NotFound";
// Acadira prototype imports
import Student from "./pages/Student";
import AdminLayout from "./components/admin/AdminLayout";
import Dashboard from "./pages/admin/Dashboard";
import Curriculum from "./pages/admin/Curriculum";
import Students from "./pages/admin/Students";
import Conversations from "./pages/admin/Conversations";
import Questions from "./pages/admin/Questions";
import Institution from "./pages/admin/Institution";
import SuperAdminLayout from "./components/superadmin/SuperAdminLayout";
import SuperAdminDashboard from "./pages/superadmin/Dashboard";
import SuperAdminInstitutions from "./pages/superadmin/Institutions";
import SuperAdminUsers from "./pages/superadmin/Users";
import SuperAdminSubscriptions from "./pages/superadmin/Subscriptions";
import SuperAdminSettings from "./pages/superadmin/Settings";

const queryClient = new QueryClient();

const App = () => {
  const { showSplash, completeSplash } = useSplashScreen();

  if (showSplash) {
    return <SplashScreen onComplete={completeSplash} />;
  }

  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
        <Routes>
          {/* Marketing/Landing Pages */}
          <Route path="/" element={<PageTransition><Index /></PageTransition>} />
          <Route path="/how-it-works" element={<PageTransition><HowItWorks /></PageTransition>} />
          <Route path="/features" element={<PageTransition><Features /></PageTransition>} />
          <Route path="/pricing" element={<PageTransition><Pricing /></PageTransition>} />
          <Route path="/about" element={<PageTransition><About /></PageTransition>} />
          <Route path="/contact" element={<PageTransition><Contact /></PageTransition>} />
          <Route path="/login" element={<PageTransition><Login /></PageTransition>} />
          <Route path="/demo" element={<PageTransition><Demo /></PageTransition>} />
          <Route path="/subscribe" element={<PageTransition><Subscribe /></PageTransition>} />
          <Route path="/subscription-success" element={<PageTransition><SubscriptionSuccess /></PageTransition>} />
          <Route path="/payment-gateway-simulation" element={<PaymentGatewaySimulation />} />
          <Route path="/admin-dashboard" element={<PageTransition><AdminDashboard /></PageTransition>} />
          <Route path="/student-tutor" element={<PageTransition><StudentTutor /></PageTransition>} />
          
          {/* Acadira Application Routes */}
          {/* Redirect old login routes to unified /login */}
          <Route path="/student-login" element={<Navigate to="/login" replace />} />
          <Route path="/admin-login" element={<Navigate to="/login" replace />} />
          <Route path="/student" element={<Student />} />
          <Route path="/admin" element={<AdminLayout />}>
            <Route index element={<Dashboard />} />
            <Route path="curriculum" element={<Curriculum />} />
            <Route path="students" element={<Students />} />
            <Route path="conversations" element={<Conversations />} />
            <Route path="questions" element={<Questions />} />
            <Route path="institution" element={<Institution />} />
          </Route>
          <Route path="/superadmin" element={<SuperAdminLayout />}>
            <Route index element={<SuperAdminDashboard />} />
            <Route path="institutions" element={<SuperAdminInstitutions />} />
            <Route path="users" element={<SuperAdminUsers />} />
            <Route path="subscriptions" element={<SuperAdminSubscriptions />} />
            <Route path="settings" element={<SuperAdminSettings />} />
          </Route>
          
          {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
  );
};

export default App;
