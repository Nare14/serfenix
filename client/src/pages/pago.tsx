import React from "react";
import { Button } from "@/components/ui/button";
import {
  ChevronLeft,
  LogOut,
  CreditCard,
  MessageCircle,
  DollarSign,
  Sparkles,
} from "lucide-react";
import { Link, useLocation } from "wouter";
import { motion } from "framer-motion";

export default function Pago() {
  const user = JSON.parse(localStorage.getItem("currentUser") || "null");

  const handleLogout = () => {
    localStorage.removeItem("currentUser");
    window.location.href = "/";
  };

  const [location] = useLocation();
  const params = new URLSearchParams(location.split("?")[1] || "");
  const plan = params.get("plan");

  const instagramLink =
    "https://www.instagram.com/sofivgonzalez?igsh=MXM4ZndidHk4dDBkNg%3D%3D&utm_source=qr";

  const isFenixPro = plan === "fenix_pro";

  const planName = isFenixPro ? "Sala Fénix 2.0" : "Sala Fénix";

  const paymentOptions = isFenixPro
    ? [
        {
          title: "PayPal",
          description:
            "Pagá de forma online con tu cuenta o tarjeta desde PayPal.",
          href: "https://www.paypal.com/ncp/payment/DQGGMRWCB9ZAL",
          icon: DollarSign,
          buttonText: "Pagar con PayPal",
        },
        {
          title: "Pago a acordar",
          description:
            "Si preferís otro medio de pago, escribinos por Instagram para coordinar tu acceso.",
          href: instagramLink,
          icon: MessageCircle,
          buttonText: "Contactar por Instagram",
        },
      ]
    : [
        {
          title: "Mercado Pago",
          description:
            "Pagá de forma rápida y segura a través de Mercado Pago.",
          href: "https://mpago.la/1rjkQVx",
          icon: CreditCard,
          buttonText: "Pagar con Mercado Pago",
        },
        {
          title: "PayPal",
          description:
            "Pagá de forma online con tu cuenta o tarjeta desde PayPal.",
          href: "https://www.paypal.com/ncp/payment/9Y2TWTFFA2U32",
          icon: DollarSign,
          buttonText: "Pagar con PayPal",
        },
        {
          title: "Pago a acordar",
          description:
            "Si preferís otro medio de pago, escribinos por Instagram para coordinar el pago y activar tu acceso.",
          href: instagramLink,
          icon: MessageCircle,
          buttonText: "Contactar por Instagram",
        },
      ];

  return (
    <div className="min-h-screen bg-[#fcf7f8] py-14 md:py-20 px-4 relative overflow-hidden">
      <div className="absolute top-[-20%] left-[-20%] w-[55vw] h-[55vw] bg-rose-200/35 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute bottom-[-20%] right-[-20%] w-[55vw] h-[55vw] bg-red-100/35 rounded-full blur-[120px] pointer-events-none" />

      {/* BARRA SUPERIOR */}
      <div className="max-w-6xl mx-auto mb-12 flex items-center justify-between bg-white/85 backdrop-blur-md border border-rose-200/70 rounded-[1.5rem] px-4 md:px-6 py-4 shadow-sm">
        <Link href="/">
          <Button
            variant="ghost"
            className="text-rose-800 hover:bg-rose-100 rounded-full font-medium"
          >
            <ChevronLeft className="mr-2 h-4 w-4" />
            Inicio
          </Button>
        </Link>

        <p className="text-rose-900 font-medium text-sm md:text-base text-center">
          Bienvenido/a{" "}
          <span className="font-semibold text-rose-950">{user?.name}</span>
        </p>

        <Button
          onClick={handleLogout}
          variant="ghost"
          className="text-rose-700 hover:bg-rose-100 rounded-full font-medium"
        >
          <LogOut className="mr-2 h-4 w-4" />
          Salir
        </Button>
      </div>

      {/* HERO */}
      <motion.div
        initial={{ opacity: 0, y: 18 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="text-center mb-12 md:mb-14 max-w-4xl mx-auto"
      >
        <p className="text-sm uppercase tracking-[0.28em] text-rose-500/80 mb-4">
          Medios de pago
        </p>

        <h1 className="text-4xl sm:text-5xl md:text-6xl font-serif text-rose-950 mb-4 leading-tight">
          Elegí tu medio de pago
        </h1>

        <p className="text-rose-800/75 text-base md:text-lg max-w-2xl mx-auto leading-relaxed px-2">
          Estás por unirte a{" "}
          <span className="font-semibold text-rose-950">{planName}</span>. Elegí
          la opción de pago que te resulte más cómoda.
        </p>
      </motion.div>

      {/* BLOQUE IMPORTANTE */}
      <motion.div
        initial={{ opacity: 0, y: 18 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.55 }}
        className="max-w-6xl mx-auto mb-10"
      >
        <div className="rounded-[2rem] border border-rose-200/70 bg-white/85 backdrop-blur-sm p-6 md:p-8 shadow-[0_12px_40px_rgba(120,40,60,0.06)]">
          <div className="flex items-start gap-4">
            <div className="w-12 h-12 rounded-2xl bg-rose-100 flex items-center justify-center shrink-0">
              <Sparkles className="w-5 h-5 text-rose-700" />
            </div>

            <div>
              <h2 className="text-xl md:text-2xl font-serif text-rose-950 mb-2">
                Importante
              </h2>

              <p className="text-rose-900/65 leading-relaxed">
                Es importante que te encuentres registrado/a en la plataforma
                con tu mail para que podamos identificar correctamente tu pago y
                habilitar el acceso a tu sala una vez confirmado.
              </p>
            </div>
          </div>
        </div>
      </motion.div>

      {/* OPCIONES DE PAGO */}
      <div
        className={`max-w-6xl mx-auto grid grid-cols-1 ${
          paymentOptions.length === 2
            ? "md:grid-cols-2"
            : "md:grid-cols-2 xl:grid-cols-3"
        } gap-6 md:gap-8`}
      >
        {paymentOptions.map((option, index) => {
          const Icon = option.icon;

          return (
            <motion.div
              key={option.title}
              initial={{ opacity: 0, y: 18 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.08 }}
              className="bg-white/90 border border-rose-200/70 rounded-[2rem] p-6 sm:p-8 md:p-8 shadow-[0_10px_30px_rgba(120,40,60,0.06)] backdrop-blur-sm flex flex-col"
            >
              <div className="w-12 h-12 rounded-2xl bg-rose-100 flex items-center justify-center mb-5">
                <Icon className="h-5 w-5 text-rose-700" />
              </div>

              <h2 className="text-2xl md:text-3xl font-serif text-rose-950 mb-3">
                {option.title}
              </h2>

              <p className="text-rose-800/80 leading-relaxed mb-8 flex-grow text-sm sm:text-base">
                {option.description}
              </p>

              <a href={option.href} target="_blank" rel="noopener noreferrer">
                <Button className="w-full h-12 md:h-13 rounded-2xl bg-rose-600 hover:bg-rose-700 text-white font-medium shadow-lg shadow-rose-600/20">
                  <Icon className="mr-2 h-5 w-5" />
                  {option.buttonText}
                </Button>
              </a>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}
