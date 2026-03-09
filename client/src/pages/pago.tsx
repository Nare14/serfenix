import React from "react";
import { Button } from "@/components/ui/button";
import { ChevronLeft, LogOut, CreditCard, MessageCircle } from "lucide-react";
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

  const mercadoPagoLink = "https://www.mercadopago.com.ar/";
  const instagramLink =
    "https://www.instagram.com/sofivgonzalez?igsh=MXM4ZndidHk4dDBkNg%3D%3D&utm_source=qr";

  const planName = plan === "fenix_pro" ? "Sala Fénix 2.0" : "Sala Fénix";

  return (
    <div className="min-h-screen bg-rose-50/40 py-16 md:py-20 px-4 relative overflow-hidden">
      <div className="absolute top-[-20%] left-[-20%] w-[55vw] h-[55vw] bg-rose-200/40 rounded-full blur-[120px]" />
      <div className="absolute bottom-[-20%] right-[-20%] w-[55vw] h-[55vw] bg-red-100/40 rounded-full blur-[120px]" />
      {/* BARRA SUPERIOR */}
      <div className="max-w-5xl mx-auto mb-12 flex items-center justify-between bg-white/90 backdrop-blur-sm border border-rose-200 rounded-2xl px-6 py-4 shadow-sm">
        {/* IZQUIERDA */}
        <Link href="/">
          <Button
            variant="ghost"
            className="text-rose-800 hover:bg-rose-100 rounded-full font-medium"
          >
            <ChevronLeft className="mr-2 h-4 w-4" />
            Inicio
          </Button>
        </Link>

        {/* CENTRO */}
        <p className="text-rose-900 font-medium text-sm md:text-base text-center">
          Bienvenido/a{" "}
          <span className="font-semibold text-rose-950">{user?.name}</span>
        </p>

        {/* DERECHA */}
        <Button
          onClick={handleLogout}
          variant="ghost"
          className="text-rose-700 hover:bg-rose-100 rounded-full font-medium"
        >
          <LogOut className="mr-2 h-4 w-4" />
          Salir
        </Button>
      </div>

      <motion.div
        initial={{ opacity: 0, y: 18 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="text-center mb-12 md:mb-16"
      >
        <h1 className="text-3xl sm:text-4xl md:text-6xl font-serif text-rose-950 mb-4 leading-tight">
          Elegí tu medio de pago
        </h1>

        <p className="text-rose-800/75 text-base md:text-lg max-w-2xl mx-auto leading-relaxed px-2">
          Estás por unirte a{" "}
          <span className="font-semibold text-rose-950">{planName}</span>. Elegí
          la opción de pago que te resulte más cómoda.
        </p>
      </motion.div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8">
        <motion.div
          initial={{ opacity: 0, y: 18 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="bg-white/90 border border-rose-200 rounded-[2rem] p-6 sm:p-8 md:p-10 shadow-lg backdrop-blur-sm text-center flex flex-col"
        >
          <h2 className="text-2xl md:text-3xl font-serif text-rose-950 mb-3">
            Mercado Pago
          </h2>

          <p className="text-rose-800/80 leading-relaxed mb-8 flex-grow text-sm sm:text-base">
            Aboná directamente desde Mercado Pago y elegí la forma de pago que
            prefieras: tarjeta, saldo en cuenta u otros métodos disponibles.
          </p>

          <a href={mercadoPagoLink} target="_blank" rel="noopener noreferrer">
            <Button className="w-full h-12 md:h-13 rounded-2xl bg-rose-600 hover:bg-rose-700 text-white font-medium shadow-lg shadow-rose-600/20">
              <CreditCard className="mr-2 h-5 w-5" />
              Pagar con Mercado Pago
            </Button>
          </a>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 18 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="bg-white/90 border border-rose-200 rounded-[2rem] p-6 sm:p-8 md:p-10 shadow-lg backdrop-blur-sm text-center flex flex-col"
        >
          <h2 className="text-2xl md:text-3xl font-serif text-rose-950 mb-4">
            Otro medio de pago
          </h2>

          <div className="text-left text-rose-800/80 space-y-4 leading-relaxed mb-8 flex-grow text-sm sm:text-base">
            <p>
              <span className="font-semibold text-rose-950">Registro:</span> Es
              importante que te encuentres registrado/a en la plataforma con tu
              email para poder continuar con la operación.
            </p>

            <p>
              <span className="font-semibold text-rose-950">Contacto:</span>{" "}
              Escribinos por Instagram para informarnos que querés pagar por
              otro medio y coordinar ahí el método de pago que prefieras.
            </p>

            <p>
              <span className="font-semibold text-rose-950">Activación:</span>{" "}
              El acceso a la sala se habilita una vez confirmado el pago.
            </p>
          </div>

          <a href={instagramLink} target="_blank" rel="noopener noreferrer">
            <Button className="w-full h-12 md:h-13 rounded-2xl bg-rose-600 hover:bg-rose-700 text-white font-medium shadow-lg shadow-rose-600/20">
              <MessageCircle className="mr-2 h-5 w-5" />
              Contactar por Instagram
            </Button>
          </a>
        </motion.div>
      </div>
    </div>
  );
}
