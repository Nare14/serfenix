import { useState, useEffect } from "react";
import { useLocation, Link } from "wouter";
import { Button } from "@/components/ui/button";
import {
  LogOut,
  PlayCircle,
  AlertCircle,
  CreditCard,
  CheckCircle2,
  Sparkles,
  ChevronLeft,
} from "lucide-react";
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
  const ytMatch = url.match(
    /(?:youtu\.be\/|youtube\.com\/watch\?v=|youtube\.com\/embed\/)([a-zA-Z0-9_-]+)/
  );
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

  useEffect(() => {
    const stored = localStorage.getItem("currentUser");
    if (!stored) {
      setLocation("/miembros");
      return;
    }

    const parsed = JSON.parse(stored);
    setUser(parsed);

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

  const needsPayment = !user.membershipActive;

  return (
    <div className="min-h-screen bg-rose-50/30 pb-24">
      {/* HEADER */}
      <header className="sticky top-0 z-40 border-b border-rose-100 bg-white">
        <div className="container mx-auto px-4 h-16 flex items-center justify-between">
          <Link href="/">
            <span className="flex items-center gap-1.5 text-rose-700 hover:text-rose-900 text-sm font-medium cursor-pointer">
              <ChevronLeft className="h-4 w-4" /> Volver al inicio
            </span>
          </Link>

          <button
            className="flex items-center gap-1.5 text-rose-500/70 hover:text-rose-800 text-sm"
            onClick={handleLogout}
          >
            <LogOut className="h-4 w-4" /> Salir
          </button>
        </div>
      </header>

      {/* TÍTULO */}
      <section className="py-16 text-center">
        <h1 className="text-4xl md:text-6xl font-serif font-bold text-rose-950 mb-4">
          MIS SALAS
        </h1>
      </section>

      <main className="container mx-auto px-4">
        {needsPayment && (
          <section className="max-w-5xl mx-auto">
            <div className="text-center mb-12">
              <Sparkles className="w-10 h-10 text-rose-400 mx-auto mb-3" />
              <h2 className="text-3xl font-serif text-rose-950 mb-2">
                Elegí tu membresía
              </h2>
              <p className="text-rose-700/70">
                Selecciona el plan que mejor se adapte a ti.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {/* SALA FENIX */}
              <div className="rounded-3xl border-2 border-rose-200 bg-white p-8 shadow-lg text-center">
                <h3 className="font-serif text-2xl font-bold text-rose-900 mb-3">
                  Sala Fenix
                </h3>

                <p className="text-rose-600/70 text-sm mb-6">
                  99 USD – Suscripción mensual
                </p>

                <ul className="text-left space-y-3 mb-8 text-rose-800/80">
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-green-500 shrink-0" />
                    Mentoria semanal en VIVO con Sofi
                  </li>

                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-green-500 shrink-0" />
                    Acceso comunidad Telegram
                  </li>

                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-green-500 shrink-0" />
                    Acceso contenido práctico grabado
                  </li>
                </ul>

                <Link href="/pago?plan=fenix">
                  <Button className="w-full bg-rose-600 hover:bg-rose-700 text-white rounded-full py-6 text-lg">
                    <CreditCard className="w-5 h-5 mr-2" />
                    Unirme a esta sala
                  </Button>
                </Link>
              </div>

              {/* SALA FENIX 2.0 */}
              <div className="rounded-3xl border-2 border-rose-300 bg-white p-8 shadow-xl text-center">
                <h3 className="font-serif text-2xl font-bold text-rose-900 mb-2">
                  Sala Fenix 2.0
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
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-green-500 shrink-0" />
                    Mentoria semanal en VIVO con Sofi exclusiva Sala Fenix 2.0
                  </li>

                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-green-500 shrink-0" />
                    WhatsApp ilimitado 1:1 conmigo
                  </li>

                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-green-500 shrink-0" />
                    Acceso a comunidad exclusiva WhatsApp Sala Fénix 2.0
                  </li>

                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-green-500 shrink-0" />
                    Descubrí tu misión de vida
                  </li>

                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-green-500 shrink-0" />
                    Rutinas personalizadas de cuerpo, mente y espiritu
                  </li>

                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-green-500 shrink-0" />
                    Reprograma tu subconsciente y crea la vida que mereces y
                    sueñas en todas las áreas.
                  </li>
                </ul>

                <Link href="/pago?plan=fenix_pro">
                  <Button className="w-full bg-rose-600 hover:bg-rose-700 text-white rounded-full py-6 text-lg">
                    <CreditCard className="w-5 h-5 mr-2" />
                    Unirme a esta sala
                  </Button>
                </Link>
              </div>
            </div>
          </section>
        )}
      </main>
    </div>
  );
}
