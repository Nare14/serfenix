import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { motion } from "framer-motion";
import { Link } from "wouter";
import { CheckCircle2, ChevronRight, Lightbulb } from "lucide-react";
import { useState, useEffect } from "react";
import { fetchSettings } from "@/lib/api";

import bg2 from "@/assets/images/spiritual-card_2.jpg";

export default function Home() {
  const [siteTitle, setSiteTitle] = useState("Tu poder habita dentro de ti ♥");
  const [siteSubtitle, setSiteSubtitle] = useState(
    "Llegó el momento de despertarlo"
  );
  const [priceFenixPro, setPriceFenixPro] = useState("1999");
  const [salaFenixDescription, setSalaFenixDescription] = useState(
    "El espacio donde vas a reconstruirte, alinearte y crear la vida que sentís que es para vos."
  );
  const [salaFenixItems, setSalaFenixItems] = useState<string[]>([
    "Mentoría semanal en VIVO con Sofi exclusiva Sala Fénix 2.0",
    "WhatsApp ilimitado 1:1 conmigo",
    "Descubrí tu propósito de vida",
    "Aprenderás a armar una rutina equilibrada y estratégica de tu vida en todas las áreas",
    "Reprogramá tu subconsciente y sintonizá con la vida que Dios tiene para vos",
    "Creá tu marca personal",
  ]);

  const SpiritualEyeSvg = () => (
    <svg
      viewBox="0 0 200 120"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className="inline-block w-[1.1em] h-[0.7em] align-middle ml-1 -mt-0.5"
    >
      <g>
        <line
          x1="100"
          y1="60"
          x2="100"
          y2="2"
          stroke="#b5956b"
          strokeWidth="5"
          strokeLinecap="round"
        />
        <line
          x1="100"
          y1="60"
          x2="72"
          y2="8"
          stroke="#b5956b"
          strokeWidth="5"
          strokeLinecap="round"
        />
        <line
          x1="100"
          y1="60"
          x2="128"
          y2="8"
          stroke="#b5956b"
          strokeWidth="5"
          strokeLinecap="round"
        />
        <line
          x1="100"
          y1="60"
          x2="48"
          y2="22"
          stroke="#b5956b"
          strokeWidth="5"
          strokeLinecap="round"
        />
        <line
          x1="100"
          y1="60"
          x2="152"
          y2="22"
          stroke="#b5956b"
          strokeWidth="5"
          strokeLinecap="round"
        />
        <line
          x1="100"
          y1="60"
          x2="28"
          y2="40"
          stroke="#b5956b"
          strokeWidth="5"
          strokeLinecap="round"
        />
        <line
          x1="100"
          y1="60"
          x2="172"
          y2="40"
          stroke="#b5956b"
          strokeWidth="5"
          strokeLinecap="round"
        />
        <line
          x1="100"
          y1="60"
          x2="18"
          y2="58"
          stroke="#b5956b"
          strokeWidth="5"
          strokeLinecap="round"
        />
        <line
          x1="100"
          y1="60"
          x2="182"
          y2="58"
          stroke="#b5956b"
          strokeWidth="5"
          strokeLinecap="round"
        />
        <line
          x1="100"
          y1="60"
          x2="55"
          y2="100"
          stroke="#b5956b"
          strokeWidth="5"
          strokeLinecap="round"
        />
        <line
          x1="100"
          y1="60"
          x2="145"
          y2="100"
          stroke="#b5956b"
          strokeWidth="5"
          strokeLinecap="round"
        />
        <line
          x1="100"
          y1="60"
          x2="78"
          y2="108"
          stroke="#b5956b"
          strokeWidth="5"
          strokeLinecap="round"
        />
        <line
          x1="100"
          y1="60"
          x2="122"
          y2="108"
          stroke="#b5956b"
          strokeWidth="5"
          strokeLinecap="round"
        />
        <line
          x1="100"
          y1="60"
          x2="100"
          y2="115"
          stroke="#b5956b"
          strokeWidth="5"
          strokeLinecap="round"
        />
      </g>
      <ellipse cx="100" cy="60" rx="52" ry="34" fill="#b5956b" />
      <path d="M48 60 Q100 20 152 60 Q100 100 48 60Z" fill="#b5956b" />
      <circle cx="100" cy="60" r="30" fill="#1a7a7a" />
      <circle cx="100" cy="60" r="20" fill="#e8f4f4" />
      <circle cx="100" cy="60" r="13" fill="#1a7a7a" />
      <circle cx="100" cy="60" r="7" fill="#0a2e2e" />
      <circle cx="95" cy="54" r="3" fill="white" opacity="0.5" />
    </svg>
  );

  useEffect(() => {
    const loadSettings = async () => {
      try {
        const s = await fetchSettings();

        if (s.siteTitle) setSiteTitle(s.siteTitle);
        if (s.siteSubtitle) setSiteSubtitle(s.siteSubtitle);
        if (s.priceFenixPro) setPriceFenixPro(s.priceFenixPro);
        if (s.salaFenixDescription) {
          setSalaFenixDescription(s.salaFenixDescription);
        }
        if (s.salaFenixItems) {
          setSalaFenixItems(
            s.salaFenixItems
              .split("\n")
              .map((item: string) => item.trim())
              .filter(Boolean)
          );
        }
      } catch (error) {
        console.error("Error cargando settings:", error);
      }
    };

    loadSettings();
  }, []);

  const fadeInUp = {
    initial: { opacity: 0, y: 40 },
    whileInView: { opacity: 1, y: 0 },
    viewport: { once: true, margin: "-100px" },
    transition: { duration: 0.8 },
  };

  return (
    <div className="min-h-screen pt-20">
      <section className="relative min-h-[90vh] flex items-center justify-center overflow-hidden bg-rose-50/50">
        <div className="absolute inset-0 z-0">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,var(--color-rose-100)_0%,transparent_100%)] opacity-70 mix-blend-multiply" />
          <div className="absolute top-1/4 -left-1/4 w-[800px] h-[800px] bg-rose-200/40 rounded-full blur-[120px] animate-float-slow" />
          <div className="absolute bottom-0 right-0 w-[600px] h-[600px] bg-red-100/30 rounded-full blur-[100px] animate-float-slower" />
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[400px] h-[400px] bg-rose-300/20 rounded-full blur-[80px] animate-pulse-soft" />
        </div>

        <div className="container relative z-10 px-4 text-center">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 1 }}
            className="max-w-4xl mx-auto"
          >
            <motion.h1
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.9, delay: 0.2 }}
              className="text-5xl md:text-7xl lg:text-8xl font-serif text-rose-950 mb-6 leading-tight text-center flex flex-col items-center"
            >
              {(() => {
                const clean = siteTitle.replace("♥", "").trim();
                const words = clean.split(" ");
                const mid = Math.ceil(words.length / 2);
                const line1 = words.slice(0, mid).join(" ");
                const line2 = words.slice(mid).join(" ");

                return (
                  <>
                    <span>{line1}</span>
                    <span className="flex items-center justify-center gap-3">
                      {line2}
                      <span className="animate-pulse-soft">
                        <SpiritualEyeSvg />
                      </span>
                    </span>
                  </>
                );
              })()}
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.5 }}
              className="text-2xl md:text-3xl text-rose-800/80 mb-12 font-semibold tracking-wide font-serif flex items-center justify-center gap-2"
            >
              {siteSubtitle}
              <Lightbulb className="w-6 h-6 text-rose-500 animate-pulse" />
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.8 }}
            >
              <a href="#sala">
                <Button
                  size="sm"
                  className="bg-rose-600 hover:bg-rose-700 text-white rounded-full px-10 h-9 shadow-lg shadow-rose-600/20 text-xs font-medium uppercase tracking-widest hover:scale-105 transition-transform duration-300"
                >
                  Te acompaño aquí <ChevronRight className="ml-2 h-4 w-4" />
                </Button>
              </a>
            </motion.div>
          </motion.div>
        </div>

        <div className="absolute bottom-0 left-0 w-full overflow-hidden leading-none">
          <svg
            className="relative block w-full h-[100px]"
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 1200 120"
            preserveAspectRatio="none"
          >
            <path
              d="M321.39,56.44c58-10.79,114.16-30.13,172-41.86,82.39-16.72,168.19-17.73,250.45-.39C823.78,31,906.67,72,985.66,92.83c70.05,18.48,146.53,26.09,214.34,3V120H0V95.8C59.71,118.06,150.71,101.24,222.46,84.13,256.43,76.04,289.4,63.15,321.39,56.44Z"
              className="fill-white"
            />
          </svg>
        </div>
      </section>

      <section className="py-24 bg-white">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-8">
            {[
              { title: "CONECTA CON LA ENERGÍA DE DIOS", img: bg2 },
              {
                title: "ESPIRITUALIDAD PRÁCTICA APLICADA A TU VIDA",
                img: bg2,
              },
              { title: "DESCUBRE TU PROPÓSITO DE VIDA", img: bg2 },
              {
                title:
                  "TRABAJO INTEGRAL Y EQUILIBRADO ESPÍRITU | ALMA-MENTE-CUERPO",
                img: bg2,
              },
            ].map((card, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: idx * 0.15 }}
                className="group relative overflow-hidden rounded-3xl aspect-square cursor-pointer shadow-lg"
              >
                <img
                  src={card.img}
                  alt={card.title}
                  className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                />

                <div className="absolute inset-0 pointer-events-none">
                  <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_30%,rgba(255,255,255,0.35)_0%,transparent_60%)] animate-pulse-soft" />
                  <div className="absolute inset-0 bg-[radial-gradient(circle_at_70%_70%,rgba(255,255,255,0.25)_0%,transparent_60%)] animate-pulse" />
                </div>

                <div className="absolute inset-0 overflow-hidden">
                  <div className="absolute -left-full top-0 h-full w-full bg-gradient-to-r from-transparent via-white/30 to-transparent opacity-0 transition-all duration-1000 group-hover:left-full group-hover:opacity-100" />
                </div>

                <div className="absolute inset-0 bg-gradient-to-t from-rose-950/90 via-rose-900/50 to-transparent backdrop-blur-[2px]" />

                <div className="absolute inset-0 flex items-center justify-center p-6">
                  <h3 className="text-white text-lg md:text-xl font-serif font-bold tracking-[0.12em] uppercase leading-snug text-center whitespace-pre-line drop-shadow-[0_0_25px_rgba(255,255,255,0.6)] transition-all duration-500 group-hover:scale-105">
                    {card.title}
                  </h3>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      <section id="sala" className="py-24 bg-rose-50 relative overflow-hidden">
        <div className="absolute top-0 left-0 w-full overflow-hidden leading-none rotate-180">
          <svg
            className="relative block w-full h-[60px]"
            data-name="Layer 1"
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 1200 120"
            preserveAspectRatio="none"
          >
            <path
              d="M321.39,56.44c58-10.79,114.16-30.13,172-41.86,82.39-16.72,168.19-17.73,250.45-.39C823.78,31,906.67,72,985.66,92.83c70.05,18.48,146.53,26.09,214.34,3V120H0V95.8C59.71,118.06,150.71,101.24,222.46,84.13,256.43,76.04,289.4,63.15,321.39,56.44Z"
              className="fill-white"
            />
          </svg>
        </div>

        <div className="container mx-auto px-4 relative z-10 pt-10">
          <motion.div {...fadeInUp} className="text-center mb-16">
            <h2 className="text-4xl md:text-6xl font-serif text-rose-950 mb-4">
              Sala Fénix 2.0
            </h2>
            <p className="text-rose-800/70 text-xl md:text-2xl font-semibold font-serif max-w-2xl mx-auto">
              Un espacio más profundo para transformar tu vida desde adentro.
            </p>
          </motion.div>

          <div className="max-w-4xl mx-auto">
            <motion.div {...fadeInUp}>
              <Card className="glass-card h-full rounded-[2.5rem] border-rose-200 overflow-hidden relative group hover:-translate-y-1 transition-transform duration-500">
                <CardContent className="p-6 sm:p-8 md:p-10 flex flex-col h-full relative z-10 text-center">
                  <h3 className="text-3xl md:text-4xl font-serif font-bold text-rose-950 mb-4">
                    Sala Fénix 2.0
                  </h3>

                  <p className="text-rose-800/70 mb-8 text-lg leading-relaxed max-w-2xl mx-auto whitespace-pre-line">
                    {salaFenixDescription ||
                      "Próximamente vas a ver acá la descripción de Sala Fénix 2.0."}
                  </p>

                  <div className="text-5xl font-bold text-rose-700 mb-2">
                    {priceFenixPro} USD
                  </div>

                  <p className="text-rose-500 mb-10">/ 6 meses</p>

                  <ul className="space-y-4 text-left max-w-md mx-auto mb-10">
                    {salaFenixItems.map((item, i) => (
                      <li
                        key={i}
                        className="flex items-start gap-3 text-rose-900/80 font-medium"
                      >
                        <CheckCircle2 className="w-5 h-5 text-rose-600 shrink-0 mt-0.5" />
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>

                  <Link href="/pago?plan=fenix_pro">
                    <Button className="w-full bg-rose-600 hover:bg-rose-700 text-white rounded-full h-14 text-lg font-medium shadow-xl shadow-rose-600/20 hover:scale-[1.02] transition-transform">
                      QUIERO UNIRME
                    </Button>
                  </Link>
                </CardContent>
              </Card>
            </motion.div>
          </div>
        </div>
      </section>

      <section className="py-24 bg-rose-50/50">
        <div className="container mx-auto px-4">
          <motion.div {...fadeInUp} className="max-w-4xl mx-auto">
            <div className="text-center mb-10">
              <h2 className="text-4xl md:text-5xl font-serif text-rose-950 mb-4">
                Mi historia completa
              </h2>
            </div>

            <div className="relative aspect-video rounded-3xl overflow-hidden shadow-2xl bg-black group">
              <iframe
                className="w-full h-full"
                src="https://www.youtube.com/embed/GpASEn6F8aA"
                title="Renacer Video"
                frameBorder="0"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                allowFullScreen
              />
            </div>

            <div className="text-center mt-8">
              <a
                href="https://www.youtube.com/@soysofivgonzalez"
                target="_blank"
                rel="noopener noreferrer"
              >
                <Button
                  size="sm"
                  className="bg-rose-600 hover:bg-rose-700 text-white rounded-full px-10 h-10 shadow-lg shadow-rose-600/20 text-xs font-medium uppercase tracking-widest"
                >
                  Suscribite a mi canal
                </Button>
              </a>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
}
