import { useState, useEffect } from "react";
import { useLocation, Link } from "wouter";
import { Button } from "@/components/ui/button";
import {
  LogOut,
  PlayCircle,
  CreditCard,
  CheckCircle2,
  Sparkles,
  ChevronLeft,
} from "lucide-react";
import { motion } from "framer-motion";
import { fetchMemberVideos } from "@/lib/api";

interface VideoItem {
  id: number;
  title: string;
  description: string | null;
  url: string;
  category: string;
  membershipRequired: string;
  active?: boolean;
}

function getEmbedUrl(url: string): string {
  const clean = (url || "").trim();
  if (!clean) return "";

  if (clean.includes("youtube.com/embed/")) return clean;

  const ytShortMatch = clean.match(/youtu\.be\/([a-zA-Z0-9_-]+)/);
  if (ytShortMatch) {
    return `https://www.youtube.com/embed/${ytShortMatch[1]}`;
  }

  const ytWatchMatch = clean.match(/[?&]v=([a-zA-Z0-9_-]+)/);
  if (clean.includes("youtube.com/watch") && ytWatchMatch) {
    return `https://www.youtube.com/embed/${ytWatchMatch[1]}`;
  }

  const ytEmbedMatch = clean.match(/youtube\.com\/embed\/([a-zA-Z0-9_-]+)/);
  if (ytEmbedMatch) {
    return `https://www.youtube.com/embed/${ytEmbedMatch[1]}`;
  }

  const vimeoPlayerMatch = clean.match(/player\.vimeo\.com\/video\/(\d+)/);
  if (vimeoPlayerMatch) {
    return `https://player.vimeo.com/video/${vimeoPlayerMatch[1]}`;
  }

  const vimeoMatch = clean.match(/vimeo\.com\/(\d+)/);
  if (vimeoMatch) {
    return `https://player.vimeo.com/video/${vimeoMatch[1]}`;
  }

  return clean;
}

function getMembershipType(user: any): string | null {
  if (!user) return null;

  if (
    user.membershipType === "fenix_pro" ||
    user.plan === "fenix_pro" ||
    user.membership === "fenix_pro"
  ) {
    return "fenix_pro";
  }

  return null;
}

function hasActiveMembership(user: any): boolean {
  return getMembershipType(user) === "fenix_pro";
}

function canUserSeeVideo(user: any, video: VideoItem): boolean {
  const membership = getMembershipType(user);

  if (membership !== "fenix_pro") return false;
  if (video.active === false) return false;

  return (
    video.membershipRequired === "fenix_pro" ||
    video.membershipRequired === "all" ||
    !video.membershipRequired
  );
}

export default function Salas() {
  const [, setLocation] = useLocation();
  const [user, setUser] = useState<any>(null);
  const [videos, setVideos] = useState<VideoItem[]>([]);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadPage = async () => {
      try {
        const stored = localStorage.getItem("currentUser");

        if (!stored) {
          setLocation("/miembros");
          return;
        }

        const parsed = JSON.parse(stored);
        setUser(parsed);

        if (!hasActiveMembership(parsed)) {
          setLoading(false);
          return;
        }

        const userId = parsed?.id ?? parsed?.userId;

        if (!userId) {
          setError("No se pudo identificar al usuario.");
          setLoading(false);
          return;
        }

        const data = await fetchMemberVideos(userId);
        const allVideos = Array.isArray(data) ? data : [];

        const visibleVideos = allVideos.filter((video) =>
          canUserSeeVideo(parsed, video)
        );

        setVideos(visibleVideos);
      } catch (err: any) {
        console.error("Error cargando sala:", err);
        setError(err?.message || "No se pudo cargar el contenido");
      } finally {
        setLoading(false);
      }
    };

    loadPage();
  }, [setLocation]);

  const handleLogout = () => {
    localStorage.removeItem("currentUser");
    setLocation("/");
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#fcf7f8] flex items-center justify-center px-4">
        <div className="rounded-[2rem] border border-rose-200/70 bg-white/80 backdrop-blur-sm p-10 text-center shadow-[0_10px_40px_rgba(120,40,60,0.06)]">
          <p className="text-rose-800/70 text-lg">Cargando tu espacio...</p>
        </div>
      </div>
    );
  }

  if (!user) return null;

  const membershipType = getMembershipType(user);
  const needsPayment = membershipType !== "fenix_pro";

  return (
    <div className="min-h-screen bg-[#fcf7f8] pb-24 relative overflow-hidden">
      <div className="absolute top-[-10%] left-[-10%] w-[40vw] h-[40vw] rounded-full bg-rose-200/30 blur-[100px] pointer-events-none" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[40vw] h-[40vw] rounded-full bg-amber-100/30 blur-[100px] pointer-events-none" />

      <header className="sticky top-0 z-40 border-b border-rose-100/80 bg-white/85 backdrop-blur-md">
        <div className="max-w-7xl mx-auto px-4 md:px-6 h-16 flex items-center justify-between">
          <Link href="/">
            <span className="flex items-center gap-1.5 text-rose-700 hover:text-rose-900 text-sm font-medium cursor-pointer transition-colors">
              <ChevronLeft className="h-4 w-4" />
              Volver al inicio
            </span>
          </Link>

          <button
            className="flex items-center gap-1.5 text-rose-500/80 hover:text-rose-800 text-sm transition-colors"
            onClick={handleLogout}
          >
            <LogOut className="h-4 w-4" />
            Salir
          </button>
        </div>
      </header>

      <section className="relative py-14 md:py-20">
        <div className="max-w-6xl mx-auto px-4 md:px-6 text-center">
          {!needsPayment && (
            <motion.p
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4 }}
              className="text-sm uppercase tracking-[0.28em] text-rose-500/80 mb-4"
            >
              Área privada de miembros
            </motion.p>
          )}

          <motion.h1
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.45 }}
            className="text-4xl md:text-6xl lg:text-7xl font-serif font-bold text-rose-950 mb-4"
          >
            SALA FÉNIX 2.0
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="text-rose-900/65 max-w-2xl mx-auto text-base md:text-lg leading-relaxed"
          >
            {needsPayment
              ? "Accedé a Sala Fénix 2.0 y encontrá un espacio exclusivo para tu transformación."
              : "Bienvenida a tu espacio privado. Aquí vas a encontrar tu contenido exclusivo de Sala Fénix 2.0 para avanzar a tu ritmo."}
          </motion.p>
        </div>
      </section>

      <main className="max-w-7xl mx-auto px-4 md:px-6 relative z-10">
        {error ? (
          <div className="max-w-3xl mx-auto">
            <div className="rounded-[2rem] border border-red-200 bg-white/90 p-8 text-center shadow-sm">
              <p className="text-red-500 font-medium">{error}</p>
            </div>
          </div>
        ) : needsPayment ? (
          <section className="max-w-3xl mx-auto">
            <div className="text-center mb-12">
              <Sparkles className="w-10 h-10 text-rose-400 mx-auto mb-3" />
              <h2 className="text-3xl md:text-4xl font-serif text-rose-950 mb-3">
                Sumate a Sala Fénix 2.0
              </h2>
              <p className="text-rose-700/70 max-w-xl mx-auto">
                Activá tu acceso y empezá tu proceso dentro de Sala Fénix 2.0.
              </p>
            </div>

            <motion.div
              initial={{ opacity: 0, y: 18 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.45 }}
              className="rounded-[2rem] border border-rose-300 bg-white/90 backdrop-blur-sm p-8 shadow-[0_16px_50px_rgba(120,40,60,0.10)] text-center relative overflow-hidden"
            >
              <div className="absolute top-4 right-4 rounded-full bg-rose-100 text-rose-700 text-xs font-semibold px-3 py-1">
                Acceso exclusivo
              </div>

              <div className="w-14 h-14 rounded-2xl bg-rose-100 flex items-center justify-center mx-auto mb-5 text-2xl">
                🔥
              </div>

              <h3 className="font-serif text-2xl md:text-3xl font-bold text-rose-900 mb-2">
                Sala Fénix 2.0
              </h3>

              <p className="text-rose-600 font-semibold mb-4">
                TRANSFORMA TU REALIDAD A FUEGO
              </p>

              <div className="mb-6">
                <span className="text-4xl font-bold text-rose-900">
                  1499 USD
                </span>
                <span className="text-rose-600/60 ml-1">/ 6 meses</span>
              </div>

              <ul className="text-left space-y-3 mb-8 text-rose-800/80">
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="w-4 h-4 text-green-500 shrink-0 mt-1" />
                  <span>
                    Mentoría semanal en VIVO con Sofi exclusiva Sala Fénix 2.0
                  </span>
                </li>

                <li className="flex items-start gap-2">
                  <CheckCircle2 className="w-4 h-4 text-green-500 shrink-0 mt-1" />
                  <span>WhatsApp ilimitado 1:1 conmigo</span>
                </li>

                <li className="flex items-start gap-2">
                  <CheckCircle2 className="w-4 h-4 text-green-500 shrink-0 mt-1" />
                  <span>
                    Acceso a comunidad exclusiva WhatsApp Sala Fénix 2.0
                  </span>
                </li>

                <li className="flex items-start gap-2">
                  <CheckCircle2 className="w-4 h-4 text-green-500 shrink-0 mt-1" />
                  <span>Descubrí tu misión de vida</span>
                </li>

                <li className="flex items-start gap-2">
                  <CheckCircle2 className="w-4 h-4 text-green-500 shrink-0 mt-1" />
                  <span>
                    Rutinas personalizadas de cuerpo, mente y espíritu
                  </span>
                </li>

                <li className="flex items-start gap-2">
                  <CheckCircle2 className="w-4 h-4 text-green-500 shrink-0 mt-1" />
                  <span>
                    Reprogramá tu subconsciente y creá la vida que merecés y
                    soñás en todas las áreas
                  </span>
                </li>
              </ul>

              <Link href="/pago?plan=fenix_pro">
                <Button className="w-full bg-rose-600 hover:bg-rose-700 text-white rounded-full py-6 text-lg shadow-lg shadow-rose-600/20">
                  <CreditCard className="w-5 h-5 mr-2" />
                  Unirme a Sala Fénix 2.0
                </Button>
              </Link>
            </motion.div>
          </section>
        ) : (
          <section className="max-w-6xl mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 14 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.35 }}
              className="mb-10"
            >
              <div className="rounded-[2rem] border border-rose-200/70 bg-white/75 backdrop-blur-sm shadow-[0_12px_40px_rgba(120,40,60,0.08)] p-6 md:p-8">
                <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
                  <div>
                    <p className="text-sm uppercase tracking-[0.24em] text-rose-500/80 mb-2">
                      Membresía activa
                    </p>

                    <h2 className="text-2xl md:text-4xl font-serif text-rose-950 mb-3">
                      Bienvenida, {user?.name || "hermosa"}
                    </h2>

                    <p className="text-rose-900/65 max-w-2xl leading-relaxed">
                      Este es tu espacio privado para volver a tu contenido
                      cuando quieras, aprender con calma y seguir tu proceso con
                      claridad.
                    </p>
                  </div>

                  <div className="shrink-0 flex flex-col items-start lg:items-end gap-2">
                    <div className="rounded-full bg-emerald-50 border border-emerald-200 text-emerald-700 px-5 py-2.5 text-sm font-medium">
                      Acceso habilitado
                    </div>

                    <div className="text-xs text-rose-500/70 uppercase tracking-[0.18em]">
                      Sala Fénix 2.0
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>

            {videos.length > 0 ? (
              <>
                <div className="mb-8">
                  <h3 className="text-2xl md:text-3xl font-serif text-rose-950 mb-2">
                    Tu contenido
                  </h3>
                  <p className="text-rose-900/60">
                    Acá encontrarás el contenido disponible para tu proceso de
                    transformación.
                  </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                  {videos.map((video, index) => (
                    <motion.div
                      key={video.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.35, delay: index * 0.05 }}
                      className="group rounded-[2rem] border border-rose-200/70 bg-white/85 backdrop-blur-sm overflow-hidden shadow-[0_10px_30px_rgba(120,40,60,0.06)] hover:shadow-[0_18px_45px_rgba(120,40,60,0.11)] hover:-translate-y-1 transition-all duration-300"
                    >
                      <div className="aspect-video bg-rose-100/40 overflow-hidden">
                        <iframe
                          src={getEmbedUrl(video.url)}
                          className="w-full h-full"
                          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                          allowFullScreen
                          title={video.title}
                        />
                      </div>

                      <div className="p-6">
                        {video.category && (
                          <p className="text-xs uppercase tracking-[0.22em] text-rose-500/80 mb-3">
                            {video.category}
                          </p>
                        )}

                        <h4 className="text-xl font-semibold text-rose-950 mb-2 leading-snug">
                          {video.title}
                        </h4>

                        <p className="text-rose-900/65 text-sm leading-relaxed mb-5 min-h-[48px]">
                          {video.description ||
                            "Contenido exclusivo disponible dentro de tu membresía."}
                        </p>

                        <div className="flex items-center justify-between gap-3">
                          <div className="inline-flex items-center gap-2 text-rose-700 font-medium">
                            <PlayCircle className="w-5 h-5" />
                            Ver contenido
                          </div>

                          <div className="text-xs text-rose-500/70">
                            Acceso privado
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </>
            ) : (
              <motion.div
                initial={{ opacity: 0, y: 14 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4 }}
                className="max-w-3xl mx-auto mt-8"
              >
                <div className="rounded-[2rem] border border-rose-200/70 bg-white/85 backdrop-blur-sm p-8 md:p-10 text-center shadow-[0_10px_30px_rgba(120,40,60,0.06)]">
                  <div className="w-16 h-16 mx-auto rounded-full bg-rose-100 flex items-center justify-center text-2xl text-rose-700 mb-5">
                    ✨
                  </div>

                  <h3 className="text-3xl font-serif text-rose-950 mb-3">
                    Tu acceso está activo
                  </h3>

                  <p className="text-rose-900/65 max-w-xl mx-auto leading-relaxed mb-6">
                    Ya formas parte de Sala Fénix 2.0. Muy pronto tu contenido
                    disponible aparecerá aquí dentro de este espacio.
                  </p>

                  <Link href="/">
                    <Button className="rounded-full bg-rose-600 hover:bg-rose-700 text-white px-6 py-3 shadow-lg shadow-rose-600/20">
                      Volver al inicio
                    </Button>
                  </Link>
                </div>
              </motion.div>
            )}
          </section>
        )}
      </main>
    </div>
  );
}
