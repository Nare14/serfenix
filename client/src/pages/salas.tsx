import { useState, useEffect } from "react";
import { useLocation, Link } from "wouter";
import { Button } from "@/components/ui/button";
import { LogOut, PlayCircle, Lock, AlertCircle, CreditCard, CheckCircle2, Sparkles, ChevronLeft } from "lucide-react";
import { motion } from "framer-motion";
import { fetchMemberVideos, fetchSettings } from "@/lib/api";

interface VideoItem {
  id: number;
  title: string;
  description: string | null;
  url: string;
  category: string;
  membershipRequired: string;
}

function getEmbedUrl(url: string): string {
  const ytMatch = url.match(/(?:youtu\.be\/|youtube\.com\/watch\?v=|youtube\.com\/embed\/)([a-zA-Z0-9_-]+)/);
  if (ytMatch) return `https://www.youtube.com/embed/${ytMatch[1]}`;
  const vimeoMatch = url.match(/vimeo\.com\/(\d+)/);
  if (vimeoMatch) return `https://player.vimeo.com/video/${vimeoMatch[1]}`;
  return url;
}

export default function Salas() {
  const [, setLocation] = useLocation();
  const [user, setUser] = useState<any>(null);
  const [videos, setVideos] = useState<VideoItem[]>([]);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);
  const [settings, setSettings] = useState<any>({});

  useEffect(() => {
    const stored = localStorage.getItem("currentUser");
    if (!stored) {
      setLocation("/miembros");
      return;
    }

    const parsed = JSON.parse(stored);
    setUser(parsed);

    fetchSettings().then(setSettings).catch(() => {});

    fetchMemberVideos(parsed.id)
      .then(setVideos)
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }, [setLocation]);

  const handleLogout = () => {
    localStorage.removeItem("currentUser");
    setLocation("/");
  };

  if (!user) return null;

  const grouped = videos.reduce<Record<string, VideoItem[]>>((acc, v) => {
    const cat = v.category || "general";
    if (!acc[cat]) acc[cat] = [];
    acc[cat].push(v);
    return acc;
  }, {});

  const priceFenix = settings.priceFenix || "99";
  const priceFenixPro = settings.priceFenixPro || "899";
  const payLinkFenix = settings.payLinkFenix || "#";
  const payLinkFenixPro = settings.payLinkFenixPro || "#";

  const needsPayment = !user.membershipActive;

  return (
    <div className="min-h-screen bg-rose-50/30 pb-24">

      {/* ========== BANNER / BARRA SUPERIOR ========== */}
      <header className="glass sticky top-0 z-40 border-b border-rose-100">
        <div className="container mx-auto px-4 h-16 flex items-center justify-between">
          {/* Izquierda: Volver al inicio */}
          <Link href="/">
            <span
              className="flex items-center gap-1.5 text-rose-700 hover:text-rose-900 transition-colors duration-300 text-sm font-medium cursor-pointer"
              data-testid="button-back-home"
            >
              <ChevronLeft className="h-4 w-4" /> Volver al inicio
            </span>
          </Link>

          {/* Centro: Bienvenido */}
          <p className="text-base text-rose-800/70 font-serif hidden md:block" data-testid="text-user-email">
            Bienvenido, <span className="font-semibold text-rose-950">{user.name || user.email}</span>
            {user.membershipActive && (
              <span className="ml-2 bg-rose-100 text-rose-700 px-2.5 py-0.5 rounded-full text-xs font-medium">
                {user.membershipType === "fenix_pro" ? "Fénix 2.0" : "Fénix"}
              </span>
            )}
          </p>

          {/* Derecha: Cerrar sesión */}
          <button
            className="flex items-center gap-1.5 text-rose-500/70 hover:text-rose-800 transition-colors duration-300 text-sm cursor-pointer"
            onClick={handleLogout}
            data-testid="button-logout"
          >
            <LogOut className="h-4 w-4" /> Salir
          </button>
        </div>

        {/* Bienvenido en mobile (debajo de la barra) */}
        <div className="md:hidden border-t border-rose-100/50 px-4 py-2 text-center">
          <p className="text-xs text-rose-800/70 font-serif">
            Bienvenido, <span className="font-semibold text-rose-950">{user.name || user.email}</span>
            {user.membershipActive && (
              <span className="ml-2 bg-rose-100 text-rose-700 px-2 py-0.5 rounded-full text-xs font-medium">
                {user.membershipType === "fenix_pro" ? "Fénix 2.0" : "Fénix"}
              </span>
            )}
          </p>
        </div>
      </header>

      {/* ========== TÍTULOS PRINCIPALES ========== */}
      <section className="relative py-20 overflow-hidden">
        {/* Fondos decorativos */}
        <div className="absolute inset-0 z-0">
          <div className="absolute top-1/2 left-1/4 -translate-y-1/2 w-[500px] h-[500px] bg-rose-200/30 rounded-full blur-[100px] animate-float-slow" />
          <div className="absolute top-1/2 right-1/4 -translate-y-1/2 w-[400px] h-[400px] bg-red-100/20 rounded-full blur-[80px] animate-float-slower" />
        </div>

        <div className="container mx-auto px-4 relative z-10 text-center">
          {/* Título principal: GOD IS FIRST */}
          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.1 }}
            className="text-5xl md:text-7xl lg:text-8xl font-serif font-bold text-rose-950 uppercase tracking-tight mb-4"
            data-testid="text-main-title"
          >
            GOD IS FIRST
          </motion.h1>

          {/* Línea decorativa */}
          <motion.div
            initial={{ scaleX: 0 }}
            animate={{ scaleX: 1 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="w-24 h-1 bg-rose-400 rounded-full mx-auto mb-6"
          />

          {/* Subtítulo: MIS SALAS */}
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.5 }}
            className="text-2xl md:text-4xl font-serif font-bold text-rose-800/80 uppercase tracking-wide"
            data-testid="text-subtitle"
          >
            MIS SALAS
          </motion.h2>
        </div>
      </section>

      {/* ========== CONTENIDO PRINCIPAL ========== */}
      <main className="container mx-auto px-4 space-y-16">

        {/* Sección de pago (si no tiene membresía) */}
        {needsPayment && (
          <motion.section
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="max-w-4xl mx-auto"
          >
            <div className="text-center mb-10">
              <Sparkles className="w-10 h-10 text-rose-400 mx-auto mb-3" />
              <h2 className="text-3xl font-serif text-rose-950 mb-2">Elige tu membresía</h2>
              <p className="text-rose-700/70 max-w-md mx-auto">
                Selecciona el plan que mejor se adapte a ti y accede al contenido exclusivo.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <motion.div
                initial={{ opacity: 0, x: -30 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6, delay: 0.2 }}
                className="relative rounded-3xl border-2 border-rose-200 bg-white/80 backdrop-blur-sm p-8 shadow-lg hover:shadow-xl hover:-translate-y-1 transition-all duration-400"
              >
                <div className="text-center">
                  <h3 className="font-serif text-2xl font-bold text-rose-900 mb-1">Sala Fénix</h3>
                  <p className="text-rose-600/70 text-sm mb-6">Acceso al contenido esencial</p>
                  <div className="mb-6">
                    <span className="text-4xl font-bold text-rose-900">${priceFenix}</span>
                    <span className="text-rose-600/60 ml-1">USD / mes</span>
                  </div>
                  <ul className="text-left space-y-3 mb-8 text-rose-800/80">
                    <li className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-green-500 shrink-0" /> Acceso a la mentoría semanal grupal (sábados 9AM MEX y 11AM ARG)</li>
                    <li className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-green-500 shrink-0" /> Acceso al contenido práctico</li>
                    <li className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-green-500 shrink-0" /> Acceso comunidad vía telegram</li>
                  </ul>
                  <Link href="/pago?plan=fenix">
                    <Button className="w-full bg-rose-600 hover:bg-rose-700 text-white rounded-full py-6 text-lg font-medium shadow-md hover:shadow-lg transition-all" data-testid="button-pay-fenix">
                      <CreditCard className="w-5 h-5 mr-2" /> Unirme a esta sala
                    </Button>
                  </Link>
                </div>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, x: 30 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6, delay: 0.4 }}
                className="relative rounded-3xl border-2 border-rose-200 bg-white/80 backdrop-blur-sm p-8 shadow-lg hover:shadow-xl hover:-translate-y-1 transition-all duration-400"
              >
                <div className="text-center">
                  <h3 className="font-serif text-2xl font-bold text-rose-900 mb-1">Sala Fénix 2.0</h3>
                  <p className="text-rose-600/70 text-sm mb-2">Transforma tu realidad a fuego 🔥</p>
                  <div className="mb-6">
                    <span className="text-4xl font-bold text-rose-900">$1499</span>
                    <span className="text-rose-600/60 ml-1">USD / 6 meses</span>
                  </div>
                  <ul className="text-left space-y-3 mb-8 text-rose-800/80">
                    <li className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-green-500 shrink-0" /> Mentoría 1:1 una vez por semana</li>
                    <li className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-green-500 shrink-0" /> Rutinas personalizadas (cuerpo – mente – espíritu)</li>
                    <li className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-green-500 shrink-0" /> Acceso WhatsApp 1:1 ilimitado</li>
                    <li className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-green-500 shrink-0" /> Descubrí tu misión de vida</li>
                    <li className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-green-500 shrink-0" /> Acceso a mentoría grupal Sala Fénix</li>
                    <li className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-green-500 shrink-0" /> Acceso a la comunidad vía Telegram</li>
                    <li className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-green-500 shrink-0" /> Acceso al contenido práctico</li>
                  </ul>
                  <Link href="/pago?plan=fenix_pro">
                    <Button className="w-full bg-rose-600 hover:bg-rose-700 text-white rounded-full py-6 text-lg font-medium shadow-md hover:shadow-lg transition-all" data-testid="button-pay-fenix-pro">
                      <CreditCard className="w-5 h-5 mr-2" /> Unirme a esta sala
                    </Button>
                  </Link>
                </div>
              </motion.div>
            </div>

            <p className="text-center text-rose-500/60 text-sm mt-8">
              Serás redirigido a Mercado Pago para completar el pago de forma segura. Una vez confirmado, tu membresía será activada.
            </p>
          </motion.section>
        )}

        {/* Sección de contenido (si tiene membresía activa) */}
        {user.membershipActive && (
          <>
            {loading && (
              <div className="text-center py-20">
                <div className="inline-block w-8 h-8 border-4 border-rose-200 border-t-rose-600 rounded-full animate-spin" />
                <p className="mt-4 text-rose-600">Cargando contenido...</p>
              </div>
            )}

            {!loading && error && (
              <div className="max-w-lg mx-auto text-center py-20">
                <AlertCircle className="w-16 h-16 text-rose-400 mx-auto mb-4" />
                <h2 className="text-2xl font-serif text-rose-950 mb-2">Acceso Restringido</h2>
                <p className="text-rose-800/60 mb-8">{error}</p>
                <p className="text-rose-600/80 text-sm mb-6">Para ver los videos exclusivos necesitas una membresía activa.</p>
                <Button className="bg-rose-600 hover:bg-rose-700 text-white rounded-full px-8" onClick={() => setLocation("/")}>
                  Ver Planes
                </Button>
              </div>
            )}

            {!loading && !error && videos.length === 0 && (
              <div className="text-center py-20">
                <PlayCircle className="w-16 h-16 text-rose-300 mx-auto mb-4" />
                <h2 className="text-2xl font-serif text-rose-950 mb-2">Pronto habrá contenido</h2>
                <p className="text-rose-800/60">Estamos preparando los mejores videos para ti.</p>
              </div>
            )}

            {/* Listado de videos agrupados por categoría */}
            {!loading && !error && Object.entries(grouped).map(([category, vids]) => (
              <section key={category}>
                <div className="mb-8">
                  <h2 className="text-3xl font-serif font-bold text-rose-950 mb-2 capitalize">{category === "general" ? "Contenido práctico" : category}</h2>
                  <p className="text-rose-800/60">{vids.length} {vids.length === 1 ? "clase" : "clases"} disponibles</p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                  {vids.map((video, i) => (
                    <motion.div
                      key={video.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.4, delay: i * 0.1 }}
                      className="group"
                    >
                      <div className="relative aspect-video rounded-2xl overflow-hidden shadow-md group-hover:shadow-xl group-hover:scale-[1.02] transition-all duration-300 border border-white bg-black">
                        <iframe
                          className="w-full h-full"
                          src={getEmbedUrl(video.url)}
                          title={video.title}
                          frameBorder="0"
                          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                          allowFullScreen
                        ></iframe>
                      </div>
                      <div className="mt-4">
                        <h3 className="text-xl font-serif font-bold text-rose-950 group-hover:text-rose-600 transition-colors">{video.title}</h3>
                        {video.description && <p className="text-base text-rose-500/80 mt-1">{video.description}</p>}
                        {video.membershipRequired === "fenix_pro" && (
                          <span className="inline-block mt-2 bg-rose-100 text-rose-700 px-2 py-0.5 rounded-full text-xs font-semibold">PREMIUM</span>
                        )}
                      </div>
                    </motion.div>
                  ))}
                </div>
              </section>
            ))}
          </>
        )}
      </main>
    </div>
  );
}
