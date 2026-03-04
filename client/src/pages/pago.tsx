import { useState, useEffect } from "react";
import { useLocation, Link } from "wouter";
import { Button } from "@/components/ui/button";
import { motion, AnimatePresence } from "framer-motion";
import { CreditCard, ChevronLeft, MessageCircle, CheckCircle2, Shield, Check } from "lucide-react";
import { fetchSettings } from "@/lib/api";

type PaymentOption = "mercadopago" | "otro" | null;

export default function Pago() {
  const [, setLocation] = useLocation();
  const [user, setUser] = useState<any>(null);
  const [settings, setSettings] = useState<any>({});
  const [selectedOption, setSelectedOption] = useState<PaymentOption>(null);
  const [acceptTerms, setAcceptTerms] = useState(false);
  const [acceptPrivacy, setAcceptPrivacy] = useState(false);

  const params = new URLSearchParams(window.location.search);
  const plan = params.get("plan") || "fenix";

  useEffect(() => {
    const stored = localStorage.getItem("currentUser");
    if (!stored) {
      setLocation("/miembros");
      return;
    }
    setUser(JSON.parse(stored));
    fetchSettings().then(setSettings).catch(() => {});
  }, [setLocation]);

  if (!user) return null;

  const isFenixPro = plan === "fenix_pro";
  const salaName = isFenixPro ? "Sala Fénix 2.0" : "Sala Fénix";
  const price = isFenixPro ? (settings.priceFenixPro || "899") : (settings.priceFenix || "99");
  const period = isFenixPro ? "3 meses" : "mes";
  const payLink = isFenixPro ? (settings.payLinkFenixPro || "#") : (settings.payLinkFenix || "#");
  const instagramLink = settings.socialInstagram || "https://instagram.com";

  const canProceed = acceptTerms && acceptPrivacy;

  return (
    <div className="min-h-screen bg-rose-50/30 pb-24">
      <header className="glass sticky top-0 z-40 border-b border-rose-100">
        <div className="container mx-auto px-4 h-16 flex items-center justify-between">
          <Link href="/salas">
            <span className="flex items-center gap-1.5 text-rose-700 hover:text-rose-900 transition-colors duration-300 text-sm font-medium cursor-pointer">
              <ChevronLeft className="h-4 w-4" /> Volver a salas
            </span>
          </Link>
          <p className="text-base text-rose-800/70 font-serif hidden md:block">
            Comprando: <span className="font-semibold text-rose-950">{salaName}</span>
          </p>
          <div className="w-24" />
        </div>
      </header>

      <div className="container mx-auto px-4 max-w-4xl">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center pt-16 pb-12"
        >
          <h1 className="text-3xl md:text-5xl font-serif font-bold text-rose-950 mb-4">
            ¿Cómo acceder a las salas utilizando otros medios de pago?
          </h1>
          <p className="text-lg md:text-xl text-rose-800/70 font-serif max-w-2xl mx-auto">
            Elegí tu medio de pago.<br />
            Podés realizar el pago utilizando otros medios disponibles. El método se coordina de forma directa con nosotros.
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.15 }}
          className="glass-card rounded-2xl p-6 mb-10 text-center border border-rose-200"
        >
          <p className="text-rose-800/60 text-sm uppercase tracking-widest mb-1">Sala seleccionada</p>
          <h2 className="text-2xl font-serif font-bold text-rose-950">{salaName}</h2>
          <p className="text-rose-700 mt-1">
            <span className="text-3xl font-bold">${price}</span>
            <span className="text-rose-500 ml-1">USD / {period}</span>
          </p>
        </motion.div>

        {/* PASO 1: Elegir opción de pago */}
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="mb-6"
        >
          <p className="text-rose-800/60 text-sm uppercase tracking-widest mb-4 text-center">Paso 1 — Elegí tu medio de pago</p>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-12">
          {/* OPCIÓN 1: Mercado Pago */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.25 }}
            onClick={() => setSelectedOption("mercadopago")}
            className={`glass-card rounded-3xl p-8 border-2 flex flex-col cursor-pointer transition-all duration-300 ${selectedOption === "mercadopago" ? "border-rose-500 shadow-xl shadow-rose-200/40 scale-[1.01]" : "border-rose-200 hover:border-rose-300 hover:shadow-lg"}`}
            data-testid="option-mercadopago"
          >
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-3">
                <div className={`w-12 h-12 rounded-full flex items-center justify-center transition-colors ${selectedOption === "mercadopago" ? "bg-rose-600" : "bg-rose-100"}`}>
                  <CreditCard className={`w-6 h-6 ${selectedOption === "mercadopago" ? "text-white" : "text-rose-600"}`} />
                </div>
                <div>
                  <h3 className="text-xl font-serif font-bold text-rose-950">Opción 1</h3>
                  <p className="text-rose-600/70 text-sm">Pago con Mercado Pago</p>
                </div>
              </div>
              <div className={`w-7 h-7 rounded-full border-2 flex items-center justify-center transition-all ${selectedOption === "mercadopago" ? "border-rose-600 bg-rose-600" : "border-rose-300"}`}>
                {selectedOption === "mercadopago" && <Check className="w-4 h-4 text-white" />}
              </div>
            </div>

            <p className="text-rose-800/70 flex-grow">
              Realizá el pago de forma segura a través de Mercado Pago. Serás redirigido a la plataforma para completar la transacción.
            </p>
          </motion.div>

          {/* OPCIÓN 2: Otro medio de pago */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            onClick={() => setSelectedOption("otro")}
            className={`glass-card rounded-3xl p-8 border-2 flex flex-col cursor-pointer transition-all duration-300 ${selectedOption === "otro" ? "border-rose-500 shadow-xl shadow-rose-200/40 scale-[1.01]" : "border-rose-200 hover:border-rose-300 hover:shadow-lg"}`}
            data-testid="option-otro"
          >
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-3">
                <div className={`w-12 h-12 rounded-full flex items-center justify-center transition-colors ${selectedOption === "otro" ? "bg-rose-600" : "bg-rose-100"}`}>
                  <MessageCircle className={`w-6 h-6 ${selectedOption === "otro" ? "text-white" : "text-rose-600"}`} />
                </div>
                <div>
                  <h3 className="text-xl font-serif font-bold text-rose-950">Opción 2</h3>
                  <p className="text-rose-600/70 text-sm">Otro medio de pago</p>
                </div>
              </div>
              <div className={`w-7 h-7 rounded-full border-2 flex items-center justify-center transition-all ${selectedOption === "otro" ? "border-rose-600 bg-rose-600" : "border-rose-300"}`}>
                {selectedOption === "otro" && <Check className="w-4 h-4 text-white" />}
              </div>
            </div>

            <div className="space-y-5 flex-grow">
              <div className="flex gap-3">
                <div className="w-7 h-7 rounded-full bg-rose-600 text-white flex items-center justify-center text-xs font-bold shrink-0 mt-0.5">1</div>
                <div>
                  <h4 className="font-semibold text-rose-950 mb-0.5 text-sm">Completá el registro</h4>
                  <p className="text-rose-800/70 text-xs">Avanzá con el registro en la plataforma utilizando el mismo email que vas a usar para el pago.</p>
                </div>
              </div>
              <div className="flex gap-3">
                <div className="w-7 h-7 rounded-full bg-rose-600 text-white flex items-center justify-center text-xs font-bold shrink-0 mt-0.5">2</div>
                <div>
                  <h4 className="font-semibold text-rose-950 mb-0.5 text-sm">Contactanos por Instagram</h4>
                  <p className="text-rose-800/70 text-xs">Escribinos por Instagram para informarnos que querés pagar por otro medio y coordinar ahí el método de pago que prefieras.</p>
                </div>
              </div>
              <div className="flex gap-3">
                <div className="w-7 h-7 rounded-full bg-rose-600 text-white flex items-center justify-center text-xs font-bold shrink-0 mt-0.5">3</div>
                <div>
                  <h4 className="font-semibold text-rose-950 mb-0.5 text-sm">Activación del acceso</h4>
                  <p className="text-rose-800/70 text-xs"><strong>Importante:</strong> El acceso a la escuela se habilita una vez confirmado el pago.</p>
                </div>
              </div>
            </div>
          </motion.div>
        </div>

        {/* PASO 2: Términos y botón — solo aparece tras elegir opción */}
        <AnimatePresence>
          {selectedOption && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 20 }}
              transition={{ duration: 0.4 }}
            >
              <p className="text-rose-800/60 text-sm uppercase tracking-widest mb-4 text-center">Paso 2 — Aceptá los términos</p>

              <div className="glass-card rounded-2xl p-8 border border-rose-200 mb-10">
                <div className="flex items-center gap-3 mb-6">
                  <Shield className="w-5 h-5 text-rose-600" />
                  <h3 className="font-serif font-bold text-rose-950 text-lg">Términos y condiciones</h3>
                </div>

                <div className="space-y-4">
                  <label className="flex items-start gap-3 cursor-pointer group" data-testid="checkbox-terms">
                    <input
                      type="checkbox"
                      checked={acceptTerms}
                      onChange={(e) => setAcceptTerms(e.target.checked)}
                      className="mt-1 w-5 h-5 rounded border-rose-300 text-rose-600 focus:ring-rose-500 accent-rose-600 cursor-pointer"
                    />
                    <span className="text-rose-800/80 group-hover:text-rose-950 transition-colors">
                      He leído y acepto los <a href="#" className="text-rose-600 underline hover:text-rose-800 font-medium">Términos y Condiciones del Servicio</a>.
                    </span>
                  </label>

                  <label className="flex items-start gap-3 cursor-pointer group" data-testid="checkbox-privacy">
                    <input
                      type="checkbox"
                      checked={acceptPrivacy}
                      onChange={(e) => setAcceptPrivacy(e.target.checked)}
                      className="mt-1 w-5 h-5 rounded border-rose-300 text-rose-600 focus:ring-rose-500 accent-rose-600 cursor-pointer"
                    />
                    <span className="text-rose-800/80 group-hover:text-rose-950 transition-colors">
                      He leído y acepto la <a href="#" className="text-rose-600 underline hover:text-rose-800 font-medium">Política de Privacidad</a>.
                    </span>
                  </label>
                </div>

                {!canProceed && (
                  <p className="text-rose-500 text-sm mt-4 flex items-center gap-1.5">
                    <CheckCircle2 className="w-4 h-4" /> Debes aceptar ambos para continuar.
                  </p>
                )}
              </div>

              {/* Botón de acción final */}
              <div className="text-center">
                {selectedOption === "mercadopago" ? (
                  <a
                    href={canProceed ? payLink : undefined}
                    target="_blank"
                    rel="noopener noreferrer"
                    onClick={(e) => { if (!canProceed) e.preventDefault(); }}
                    data-testid="button-pay-mercadopago"
                  >
                    <Button
                      className={`w-full max-w-md rounded-full py-6 text-lg font-medium shadow-md transition-all ${canProceed ? "bg-rose-600 hover:bg-rose-700 text-white hover:shadow-lg hover:scale-[1.02]" : "bg-rose-300 text-white cursor-not-allowed"}`}
                      disabled={!canProceed}
                    >
                      <CreditCard className="w-5 h-5 mr-2" /> Pagar con Mercado Pago
                    </Button>
                  </a>
                ) : (
                  <a
                    href={canProceed ? instagramLink : undefined}
                    target="_blank"
                    rel="noopener noreferrer"
                    onClick={(e) => { if (!canProceed) e.preventDefault(); }}
                    data-testid="button-contact-instagram"
                  >
                    <Button
                      className={`w-full max-w-md rounded-full py-6 text-lg font-medium shadow-md transition-all ${canProceed ? "bg-rose-600 hover:bg-rose-700 text-white hover:shadow-lg hover:scale-[1.02]" : "bg-rose-300 text-white cursor-not-allowed"}`}
                      disabled={!canProceed}
                    >
                      <MessageCircle className="w-5 h-5 mr-2" /> Contactar por Instagram
                    </Button>
                  </a>
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
