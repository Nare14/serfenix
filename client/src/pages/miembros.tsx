import { useState, useEffect } from "react";
import { useLocation } from "wouter";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { motion } from "framer-motion";
import { Lock, Mail, ChevronLeft, Eye, EyeOff, User } from "lucide-react";
import { Link } from "wouter";
import { memberLogin, memberRegister } from "@/lib/api";

export default function Miembros() {
  const [, setLocation] = useLocation();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showLoginPassword, setShowLoginPassword] = useState(false);
  const [showRegisterPassword, setShowRegisterPassword] = useState(false);
  const [showRegisterConfirm, setShowRegisterConfirm] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (localStorage.getItem("currentUser")) {
      setLocation("/salas");
    }
  }, [setLocation]);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    if (!email || !password) { setError("Por favor completa todos los campos"); return; }

    setLoading(true);
    try {
      const user = await memberLogin(email, password);
      localStorage.setItem("currentUser", JSON.stringify(user));
      setLocation("/salas");
    } catch (err: any) {
      setError(err.message || "Credenciales incorrectas");
    } finally {
      setLoading(false);
    }
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    if (!name || !email || !password || !confirmPassword) { setError("Por favor completa todos los campos"); return; }
    if (password !== confirmPassword) { setError("Las contraseñas no coinciden"); return; }

    setLoading(true);
    try {
      const user = await memberRegister(name, email, password);
      localStorage.setItem("currentUser", JSON.stringify(user));
      setLocation("/salas");
    } catch (err: any) {
      setError(err.message || "Error al registrarse");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-rose-50/50 p-4 relative overflow-hidden">
      <div className="absolute top-[-10%] left-[-10%] w-[50vw] h-[50vw] rounded-full bg-rose-200/40 blur-[100px] pointer-events-none" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[50vw] h-[50vw] rounded-full bg-red-100/40 blur-[100px] pointer-events-none" />

      <Link href="/">
        <Button variant="ghost" className="absolute top-8 left-8 text-rose-800 hover:bg-rose-100/50 rounded-full">
          <ChevronLeft className="mr-2 h-4 w-4" /> Volver
        </Button>
      </Link>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-md relative z-10"
      >
        <Card className="glass-card border-white/60 shadow-2xl rounded-[2rem] overflow-hidden">
          <CardContent className="p-8">
            <div className="text-center mb-8">
              <h1 className="font-serif text-3xl font-bold text-rose-950 mb-2">Acceso Miembros</h1>
              <p className="text-rose-800/60">Inicia sesión o crea tu cuenta para acceder a las salas.</p>
            </div>

            <Tabs defaultValue="login" className="w-full">
              <TabsList className="grid w-full grid-cols-2 bg-rose-100/50 rounded-full p-1 mb-8">
                <TabsTrigger value="login" className="rounded-full data-[state=active]:bg-white data-[state=active]:text-rose-900 data-[state=active]:shadow-sm">Iniciar Sesión</TabsTrigger>
                <TabsTrigger value="register" className="rounded-full data-[state=active]:bg-white data-[state=active]:text-rose-900 data-[state=active]:shadow-sm">Registrarse</TabsTrigger>
              </TabsList>

              <TabsContent value="login">
                <form onSubmit={handleLogin} className="space-y-5">
                  <div className="space-y-2">
                    <Label htmlFor="login-email" className="text-rose-900 ml-1">Email</Label>
                    <div className="relative">
                      <Mail className="absolute left-3 top-3 h-5 w-5 text-rose-400" />
                      <Input id="login-email" type="email" placeholder="tu@email.com" className="pl-10 h-12 rounded-2xl bg-white/50 border-rose-200 focus-visible:ring-rose-400" value={email} onChange={(e) => setEmail(e.target.value)} data-testid="input-login-email" />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="login-password" className="text-rose-900 ml-1">Contraseña</Label>
                    <div className="relative">
                      <Lock className="absolute left-3 top-3 h-5 w-5 text-rose-400" />
                      <Input id="login-password" type={showLoginPassword ? "text" : "password"} placeholder="••••••••" className="pl-10 pr-10 h-12 rounded-2xl bg-white/50 border-rose-200 focus-visible:ring-rose-400" value={password} onChange={(e) => setPassword(e.target.value)} data-testid="input-login-password" />
                      <button type="button" onClick={() => setShowLoginPassword(!showLoginPassword)} className="absolute right-3 top-3.5 text-rose-400 hover:text-rose-600 transition-colors">
                        {showLoginPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                      </button>
                    </div>
                  </div>
                  {error && <p className="text-red-500 text-sm text-center font-medium" data-testid="text-error">{error}</p>}
                  <Button type="submit" disabled={loading} className="w-full h-12 rounded-2xl bg-rose-600 hover:bg-rose-700 text-white font-medium shadow-lg shadow-rose-600/20 mt-4" data-testid="button-login">
                    {loading ? "Cargando..." : "Entrar"}
                  </Button>
                </form>
              </TabsContent>

              <TabsContent value="register">
                <form onSubmit={handleRegister} className="space-y-5">
                  <div className="space-y-2">
                    <Label htmlFor="register-name" className="text-rose-900 ml-1">Nombre</Label>
                    <div className="relative">
                      <User className="absolute left-3 top-3 h-5 w-5 text-rose-400" />
                      <Input id="register-name" type="text" placeholder="Tu nombre" className="pl-10 h-12 rounded-2xl bg-white/50 border-rose-200 focus-visible:ring-rose-400" value={name} onChange={(e) => setName(e.target.value)} data-testid="input-register-name" />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="register-email" className="text-rose-900 ml-1">Email</Label>
                    <div className="relative">
                      <Mail className="absolute left-3 top-3 h-5 w-5 text-rose-400" />
                      <Input id="register-email" type="email" placeholder="tu@email.com" className="pl-10 h-12 rounded-2xl bg-white/50 border-rose-200 focus-visible:ring-rose-400" value={email} onChange={(e) => setEmail(e.target.value)} data-testid="input-register-email" />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="register-password" className="text-rose-900 ml-1">Contraseña</Label>
                    <div className="relative">
                      <Lock className="absolute left-3 top-3 h-5 w-5 text-rose-400" />
                      <Input id="register-password" type={showRegisterPassword ? "text" : "password"} placeholder="••••••••" className="pl-10 pr-10 h-12 rounded-2xl bg-white/50 border-rose-200 focus-visible:ring-rose-400" value={password} onChange={(e) => setPassword(e.target.value)} data-testid="input-register-password" />
                      <button type="button" onClick={() => setShowRegisterPassword(!showRegisterPassword)} className="absolute right-3 top-3.5 text-rose-400 hover:text-rose-600 transition-colors">
                        {showRegisterPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                      </button>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="register-confirm" className="text-rose-900 ml-1">Confirmar Contraseña</Label>
                    <div className="relative">
                      <Lock className="absolute left-3 top-3 h-5 w-5 text-rose-400" />
                      <Input id="register-confirm" type={showRegisterConfirm ? "text" : "password"} placeholder="••••••••" className="pl-10 pr-10 h-12 rounded-2xl bg-white/50 border-rose-200 focus-visible:ring-rose-400" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} data-testid="input-register-confirm" />
                      <button type="button" onClick={() => setShowRegisterConfirm(!showRegisterConfirm)} className="absolute right-3 top-3.5 text-rose-400 hover:text-rose-600 transition-colors">
                        {showRegisterConfirm ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                      </button>
                    </div>
                  </div>
                  {error && <p className="text-red-500 text-sm text-center font-medium" data-testid="text-error">{error}</p>}
                  <Button type="submit" disabled={loading} className="w-full h-12 rounded-2xl bg-rose-600 hover:bg-rose-700 text-white font-medium shadow-lg shadow-rose-600/20 mt-4" data-testid="button-register">
                    {loading ? "Creando cuenta..." : "Crear cuenta"}
                  </Button>
                </form>
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
}
