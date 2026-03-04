import { useState, useEffect } from "react";
import { useLocation } from "wouter";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Lock, Mail, ChevronLeft, Eye, EyeOff } from "lucide-react";
import { Link } from "wouter";
import { motion } from "framer-motion";
import { adminLogin } from "@/lib/api";

export default function AdminLogin() {
  const [, setLocation] = useLocation();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (localStorage.getItem("adminAuth") === "true") {
      setLocation("/admin/dashboard");
    }
  }, [setLocation]);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      await adminLogin(email, password);
      localStorage.setItem("adminAuth", "true");
      setLocation("/admin/dashboard");
    } catch (err: any) {
      setError("Credenciales de administrador incorrectas.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-zinc-950 p-4 relative overflow-hidden">
      <div className="absolute top-[-20%] left-[-10%] w-[50vw] h-[50vw] rounded-full bg-rose-900/20 blur-[120px] pointer-events-none" />
      
      <Link href="/">
        <Button variant="ghost" className="absolute top-8 left-8 text-zinc-400 hover:text-white hover:bg-white/10 rounded-full">
          <ChevronLeft className="mr-2 h-4 w-4" /> Volver al sitio
        </Button>
      </Link>

      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.4 }}
        className="w-full max-w-md relative z-10"
      >
        <Card className="bg-zinc-900/80 border-zinc-800 backdrop-blur-xl shadow-2xl rounded-3xl overflow-hidden">
          <CardContent className="p-10">
            <div className="text-center mb-8">
              <h1 className="font-serif text-3xl font-bold text-white mb-2">Panel Fénix</h1>
              <p className="text-zinc-400 text-sm">Acceso exclusivo para administradores</p>
            </div>

            <form onSubmit={handleLogin} className="space-y-6">
              <div className="space-y-3">
                <Label htmlFor="email" className="text-zinc-300 ml-1">Email de Administrador</Label>
                <div className="relative">
                  <Mail className="absolute left-3 top-3 h-5 w-5 text-zinc-500" />
                  <Input 
                    id="email" 
                    type="email" 
                    placeholder="admin@fenix.com" 
                    className="pl-10 h-12 rounded-xl bg-zinc-950/50 border-zinc-800 text-white focus-visible:ring-rose-600 focus-visible:border-rose-600"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                  />
                </div>
              </div>
              
              <div className="space-y-3">
                <Label htmlFor="password" className="text-zinc-300 ml-1">Contraseña</Label>
                <div className="relative">
                  <Lock className="absolute left-3 top-3 h-5 w-5 text-zinc-500" />
                  <Input 
                    id="password" 
                    type={showPassword ? "text" : "password"} 
                    placeholder="••••••••" 
                    className="pl-10 pr-10 h-12 rounded-xl bg-zinc-950/50 border-zinc-800 text-white focus-visible:ring-rose-600 focus-visible:border-rose-600"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                  />
                  <button 
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-3.5 text-zinc-500 hover:text-zinc-300 transition-colors"
                  >
                    {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                  </button>
                </div>
              </div>

              {error && <p className="text-red-400 text-sm text-center font-medium bg-red-400/10 py-2 rounded-lg">{error}</p>}

              <Button type="submit" disabled={loading} className="w-full h-12 rounded-xl bg-rose-600 hover:bg-rose-700 text-white font-medium shadow-lg shadow-rose-600/20 mt-2">
                {loading ? "Ingresando..." : "Ingresar al Panel"}
              </Button>
            </form>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
}
