import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import NotFound from "@/pages/not-found";

// Layout & Pages
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import Home from "@/pages/home";
import Miembros from "@/pages/miembros";
import Salas from "@/pages/salas";
import Pago from "@/pages/pago";
import AdminLogin from "@/pages/admin/login";
import AdminDashboard from "@/pages/admin/dashboard";

function Router() {
  return (
    <Switch>
      <Route path="/admin/dashboard">
        <AdminDashboard />
      </Route>

      <Route path="/admin">
        <AdminLogin />
      </Route>

      <Route path="/miembros">
        <Navbar />
        <Miembros />
        <Footer />
      </Route>

      {/* Ruta principal existente */}
      <Route path="/salas">
        <Salas />
      </Route>

      {/* Alias opcional por si querés usar singular */}
      <Route path="/sala">
        <Salas />
      </Route>

      <Route path="/pago">
        <Pago />
      </Route>

      <Route path="/">
        <Navbar />
        <Home />
        <Footer />
      </Route>

      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Router />
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
