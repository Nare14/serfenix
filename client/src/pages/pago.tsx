import React from "react";

export default function OtrosMediosPago() {
  return (
    <div className="min-h-screen px-6 py-12 max-w-3xl mx-auto text-center">
      {/* TÍTULO PRINCIPAL MÁS CHICO */}
      <h1 className="text-2xl md:text-3xl font-bold mb-4">
        Cómo acceder a las salas utilizando otros medios de pago
      </h1>

      {/* SUBTÍTULO 1 */}
      <h2 className="text-xl font-semibold mb-2">Elegí tu medio de pago.</h2>

      {/* SUBTÍTULO 2 */}
      <p className="text-base mb-10">
        Podés realizar el pago utilizando otros medios disponibles.
      </p>

      {/* OPCIÓN 1 */}
      <div className="mb-12">
        <h3 className="text-lg font-semibold mb-4">Pagar con Mercado Pago</h3>

        <button
          onClick={() => window.open("LINK_MERCADO_PAGO_AQUI", "_blank")}
          className="w-full md:w-auto px-6 py-3 rounded-lg font-medium transition"
        >
          Pagar con Mercado Pago
        </button>
      </div>

      {/* OPCIÓN 2 */}
      <div>
        <h3 className="text-lg font-semibold mb-4">Otro medio de pago</h3>

        <p className="mb-4">
          Es importante que te encuentres registrado/a en la plataforma con tu
          email para poder continuar con la operación y luego habilitar tu
          acceso.
        </p>

        <p className="mb-4">
          Contactanos por Instagram Escribinos por Instagram para informarnos
          que querés pagar por otro medio y coordinar ahí el método de pago que
          prefieras.
        </p>

        <p className="mb-6 font-medium">
          Importante: El acceso a la sala se habilita una vez confirmado el
          pago.
        </p>

        <button
          onClick={() => window.open("LINK_INSTAGRAM_AQUI", "_blank")}
          className="w-full md:w-auto px-6 py-3 rounded-lg font-medium transition"
        >
          Contactar por Instagram
        </button>
      </div>
    </div>
  );
}
