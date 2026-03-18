import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { motion } from "framer-motion";
import { Link } from "wouter";
import { CheckCircle2, ChevronRight } from "lucide-react";
import { useState, useEffect } from "react";

import bg1 from "@/assets/images/spiritual-card_1.jpg";
import bg2 from "@/assets/images/spiritual-card_2.jpg";
import bg3 from "@/assets/images/spiritual-card_3.jpg";

export default function Home() {
  const [siteTitle, setSiteTitle] = useState("Tu poder habita dentro de ti ♥");

  const SpiritualEyeSvg = () => (
    <svg
      viewBox="0 0 200 120"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className="inline-block w-[0.9em] h-[0.55em] align-middle ml-1 -mt-1"
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

  const [siteSubtitle, setSiteSubtitle] = useState(
    "Llegó el momento de despertarlo"
  );
  const [priceFenix, setPriceFenix] = useState("99");
  const [priceFenixPro, setPriceFenixPro] = useState("1499");

  useEffect(() => {
    fetch("/api/settings")
      .then((r) => r.json())
      .then((s) => {
        if (s.siteTitle) setSiteTitle(s.siteTitle);
        if (s.siteSubtitle) setSiteSubtitle(s.siteSubtitle);
        if (s.priceFenix) setPriceFenix(s.priceFenix);
        if (s.priceFenixPro) setPriceFenixPro(s.priceFenixPro);
      })
      .catch(() => {});
  }, []);

  const fadeInUp = {
    initial: { opacity: 0, y: 40 },
    whileInView: { opacity: 1, y: 0 },
    viewport: { once: true, margin: "-100px" },
    transition: { duration: 0.8 },
  };

  return (
    <div className="min-h-screen pt-20">
      {/* HERO SECTION */}
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
              className="text-5xl md:text-7xl lg:text-8xl font-serif text-rose-950 mb-6 leading-tight text-center mx-auto"
            >
              {(() => {
                const clean = siteTitle.replace("♥", "").trim();
                const words = clean.split(" ");
                const mid = Math.ceil(words.length / 2);
                const line1 = words.slice(0, mid).join(" ");
                const line2 = words.slice(mid).join(" ");
                return (
                  <>
                    <span className="block">{line1}</span>
                    <span className="block pl-[0.5em]">
                      {line2}{" "}
                      <span className="animate-pulse-soft inline-block">
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
              className="text-2xl md:text-3xl text-rose-800/80 mb-12 font-semibold tracking-wide font-serif"
            >
              {siteSubtitle}
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.8 }}
            >
              <a href="#salas">
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
      </section>
      {/* 4 CARDS */}
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
                  <div className="absolute inset-0 bg-[radial-gradient(circle_at_70%_70%,rgba(255,255,255,0.25)_0%,transparent_60%)] animate-pulse-slow" />
                </div>

                <div className="absolute inset-0 bg-gradient-to-t from-rose-950/90 via-rose-900/50 to-transparent backdrop-blur-[2px]" />

                <div className="absolute inset-0 p-6 flex items-center justify-center">
                  <h3 className="text-white text-lg md:text-xl font-serif tracking-wide uppercase leading-snug text-center font-bold whitespace-pre-line drop-shadow-[0_0_12px_rgba(255,255,255,0.4)]">
                    {card.title}
                  </h3>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* SALAS (Pricing) */}
      <section id="salas" className="py-24 bg-rose-50 relative overflow-hidden">
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
              Elige tu experiencia
            </h2>
            <p className="text-rose-800/60 text-xl md:text-3xl font-semibold font-serif">
              Únete a nuestra comunidad y transforma tu realidad
            </p>
          </motion.div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 md:gap-8 max-w-6xl mx-auto">
            <motion.div {...fadeInUp}>
              <Card className="glass-card h-full rounded-[2rem] border-rose-200 overflow-hidden relative group hover:-translate-y-1 transition-transform duration-500">
                <CardContent className="p-6 sm:p-8 md:p-10 flex flex-col h-full relative z-10">
                  <h3 className="text-3xl font-serif font-bold text-rose-950 mb-2">
                    Sala Fénix
                  </h3>
                  <div className="flex items-baseline gap-2 mb-6">
                    <span className="text-4xl font-bold text-rose-700">
                      {priceFenix} USD
                    </span>
                    <span className="text-rose-500 font-medium">/ mensual</span>
                  </div>

                  <ul className="space-y-4 mb-10 flex-grow">
                    {[
                      "Mentoría semanal en VIVO con Sofi",
                      "Acceso a comunidad Telegram",
                      "Acceso a contenido práctico grabado",
                    ].map((item, i) => (
                      <li
                        key={i}
                        className="flex items-start gap-3 text-rose-900/80 font-medium"
                      >
                        <CheckCircle2 className="w-5 h-5 text-rose-600 shrink-0 mt-0.5" />
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>

                  <Link href="/pago?plan=fenix">
                    <Button className="w-full bg-rose-600 hover:bg-rose-700 text-white rounded-full h-14 text-lg font-medium shadow-xl shadow-rose-600/20 hover:scale-[1.02] transition-transform">
                      QUIERO UNIRME
                    </Button>
                  </Link>
                </CardContent>
              </Card>
            </motion.div>

            <motion.div
              {...fadeInUp}
              transition={{ duration: 0.8, delay: 0.2 }}
            >
              <Card className="glass-card h-full rounded-[2rem] border-rose-200 overflow-hidden relative group hover:-translate-y-1 transition-transform duration-500">
                <CardContent className="p-6 sm:p-8 md:p-10 flex flex-col h-full relative z-10">
                  <h3 className="text-3xl font-serif font-bold text-rose-950 mb-2">
                    Sala Fénix 2.0
                  </h3>
                  <div className="flex items-baseline gap-2 mb-8">
                    <span className="text-4xl font-bold text-rose-700">
                      {priceFenixPro} USD
                    </span>
                    <span className="text-rose-500 font-medium">/ 6 meses</span>
                  </div>

                  <ul className="space-y-4 mb-10 flex-grow">
                    {[
                      "Mentoría semanal en VIVO con Sofi exclusiva Sala Fenix 2.0",
                      "Acceso total a Sala Fenix",
                      "WhatsApp ilimitado 1:1 conmigo",
                      "Descubrí tu misión de vida",
                      "Rutinas personalizadas de cuerpo, mente y espíritu",
                      "Reprogramá tu subconsciente y creá la vida que merecés y soñás en todas las áreas",
                    ].map((item, i) => (
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

      {/* VIDEO SECTION */}
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

      {/* HISTORIA COMPLETA ABAJO DE TODO */}
      <section id="historia" className="py-24 bg-white">
        <div className="container mx-auto px-4">
          <motion.div
            {...fadeInUp}
            className="max-w-4xl mx-auto text-center mb-12"
          >
            <div className="h-1 w-24 bg-rose-400 rounded-full mx-auto" />
          </motion.div>

          <motion.div
            {...fadeInUp}
            className="max-w-4xl mx-auto space-y-6 text-center text-rose-900/80 leading-8"
          >
            <p className="font-semibold text-rose-800">
              Soy el testimonio vivo de que si se quiere, lo podes lograr.
            </p>

            <p>
              Todo comienza cuando en marzo del 2023 toco fondo. Tenía un
              trabajo dependiente, en el que "ganaba bien", "lo seguro", vivía
              sola en Villa Devoto, Buenos Aires, desde afuera se veía bien pero
              puertas para adentro (mi interior) era un infierno.
            </p>

            <p>
              Me voy 7 días sola a Córdoba a replantearme la vida entera, a
              estar en silencio para poder esclarecerme y tomar decisiones ya
              que no podía más. Me doy cuenta y empiezo con todo el dolor al ego
              del mundo a entender en carne viva que todo mi mal, físico,
              amoroso, laboral, económico, era mi responsabilidad.
            </p>

            <p>
              Y ahí comienza el proceso más importante, transformador, incómodo,
              doloroso y gratificante de mi vida. Allá en lo profundo de mi
              corazón tenía sueños y sabía que me merecía una vida mejor, PERO
              PERO!! tenía precios que pagar. Toda mi vida entera hasta ese
              momento.
            </p>

            <p>
              Me encerré sola a estudiar, trabajar (ya había comenzando en el
              área digital), meditar, iba al gym, lo único social que hacía y
              así todos los días, sin rendirme. Pasé hambre (priorizaba el
              dinero para pagar cuentas), pasé soledad, vendí todos mis muebles,
              mi ropa, mientras me iba descubriendo e iba descubriendo mí misión
              de vida.
            </p>

            <p>
              Quería gritarlo al mundo (como ahora) pero todavía no era el
              momento y te explico por qué:
            </p>

            <p>
              Uno de mis sueños era volver a México (había vivido 2 años antes
              de pandemia acá). Y en una de las meditaciones, ayunando bastante
              por no tener para comer, vi el Caribe. Mi trabajo espiritual con
              Dios (yo no sabía que era Dios, continuaba puertas para adentro).
            </p>

            <p>
              Y acá se une todo: mi otro sueño era trabajar digitalmente y si
              bien lo había empezado a hacer en otras áreas, nada terminaba de
              hacerme sentir plena, porque todo es un proceso de trabajo,
              paciencia y perseverancia. Los tiempos de Dios son perfectos.
            </p>

            <p>
              Mayo 2025 vuelvo a México, me voy a Ciudad de México, lo logré.
              Pero Dios me había mostrado el Caribe. Vuelvo a caer en cosas del
              mundo, porque mis creencias dominantes aún no estaban totalmente
              transformadas.
            </p>

            <p>
              Octubre 2025, gracias a Dios, vuelvo al Caribe. Tan Dios que
              incluso el vuelo me lo regalaron.
            </p>

            <p>
              Diciembre 2025 empiezo a grabar, a encarnar mi misión de vida
              descubierta en 2023. Pero días antes de Navidad vuelvo a tocar
              fondo. Me rindo por completo y escucho esa voz interna —Dios— que
              me dice que diga la verdad, incluso cuando el ego no quiere.
            </p>

            <p className="font-semibold text-rose-950">
              Elegí obedecer. Y mi vida comenzó a cambiar a pasos agigantados.
            </p>

            <p className="font-serif text-lg text-rose-950 font-bold">
              Rendición. Aceptación. Humildad. Disciplina. Obediencia.
            </p>

            <p>
              Hoy, en el Caribe —el lugar que Dios me mostró cuando tenía la
              heladera vacía— encarnando mi misión de vida, todo tuvo un
              propósito mayor: que más seres puedan renacer, despertar su luz y
              recordar quiénes son, como lo hice yo en este camino que Dios me
              hizo transitar.
            </p>
          </motion.div>
        </div>
      </section>
    </div>
  );
}
