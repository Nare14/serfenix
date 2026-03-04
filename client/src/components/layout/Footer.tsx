import { Link } from "wouter";
import { useState, useEffect } from "react";

function InstagramIcon({ className }: { className?: string }) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className={className}>
      <rect width="20" height="20" x="2" y="2" rx="5" ry="5"/><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/><line x1="17.5" x2="17.51" y1="6.5" y2="6.5"/>
    </svg>
  );
}

function TikTokIcon({ className }: { className?: string }) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className={className}>
      <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-2.88 2.5 2.89 2.89 0 0 1-2.89-2.89 2.89 2.89 0 0 1 2.89-2.89c.28 0 .54.04.79.1v-3.5a6.37 6.37 0 0 0-.79-.05A6.34 6.34 0 0 0 3.15 15a6.34 6.34 0 0 0 6.34 6.34 6.34 6.34 0 0 0 6.34-6.34V8.71a8.26 8.26 0 0 0 4.76 1.5V6.76a4.79 4.79 0 0 1-1-.07z"/>
    </svg>
  );
}

function TelegramIcon({ className }: { className?: string }) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className={className}>
      <path d="M11.944 0A12 12 0 0 0 0 12a12 12 0 0 0 12 12 12 12 0 0 0 12-12A12 12 0 0 0 12 0a12 12 0 0 0-.056 0zm4.962 7.224c.1-.002.321.023.465.14a.506.506 0 0 1 .171.325c.016.093.036.306.02.472-.18 1.898-.962 6.502-1.36 8.627-.168.9-.499 1.201-.82 1.23-.696.065-1.225-.46-1.9-.902-1.056-.693-1.653-1.124-2.678-1.8-1.185-.78-.417-1.21.258-1.91.177-.184 3.247-2.977 3.307-3.23.007-.032.014-.15-.056-.212s-.174-.041-.249-.024c-.106.024-1.793 1.14-5.061 3.345-.48.33-.913.49-1.302.48-.428-.008-1.252-.241-1.865-.44-.752-.245-1.349-.374-1.297-.789.027-.216.325-.437.893-.663 3.498-1.524 5.83-2.529 6.998-3.014 3.332-1.386 4.025-1.627 4.476-1.635z"/>
    </svg>
  );
}

function YouTubeIcon({ className }: { className?: string }) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className={className}>
      <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/>
    </svg>
  );
}

export default function Footer() {
  const [socials, setSocials] = useState({
    instagram: "https://www.instagram.com/sofivgonzalez?igsh=MXM4ZndidHk4dDBkNg%3D%3D&utm_source=qr",
    tiktok: "https://www.tiktok.com/@sofivgonzalez7?_r=1&_t=ZS-94KQsdzD6nI",
    youtube: "https://youtube.com/@soysofivgonzalez?si=Tqtj3wXKXznFiKBc",
    telegram: "https://t.me/+LgcrZJtoUIQ5MmM5",
  });

  useEffect(() => {
    fetch("/api/settings").then(r => r.json()).then(s => {
      setSocials(prev => ({
        instagram: s.socialInstagram || prev.instagram,
        tiktok: s.socialTiktok || prev.tiktok,
        youtube: s.socialYoutube || prev.youtube,
        telegram: s.socialTelegram || prev.telegram,
      }));
    }).catch(() => {});
  }, []);

  return (
    <footer className="bg-rose-950 text-rose-100 py-16">
      <div className="container mx-auto px-4">
        <div className="flex flex-col md:flex-row justify-between items-center gap-8">
          <div className="text-center md:text-left">
            <h3 className="font-serif text-2xl font-bold text-white mb-2">Fénix</h3>
            <p className="text-rose-300 max-w-sm">Tu poder habita dentro de ti. 
            Despierta tu verdadero potencial.</p>
            {/* Redes Sociales */}
            <div className="flex items-center gap-4 mt-5 justify-center md:justify-start">
              <a href={socials.instagram} target="_blank" rel="noopener noreferrer" className="w-10 h-10 rounded-full bg-rose-900/50 hover:bg-rose-800 hover:scale-110 flex items-center justify-center transition-all duration-300 group" aria-label="Instagram">
                <InstagramIcon className="w-5 h-5 text-rose-300 group-hover:text-white transition-colors" />
              </a>
              <a href={socials.tiktok} target="_blank" rel="noopener noreferrer" className="w-10 h-10 rounded-full bg-rose-900/50 hover:bg-rose-800 hover:scale-110 flex items-center justify-center transition-all duration-300 group" aria-label="TikTok">
                <TikTokIcon className="w-5 h-5 text-rose-300 group-hover:text-white transition-colors" />
              </a>
              <a href={socials.youtube} target="_blank" rel="noopener noreferrer" className="w-10 h-10 rounded-full bg-rose-900/50 hover:bg-rose-800 hover:scale-110 flex items-center justify-center transition-all duration-300 group" aria-label="YouTube">
                <YouTubeIcon className="w-5 h-5 text-rose-300 group-hover:text-white transition-colors" />
              </a>
              <a href={socials.telegram} target="_blank" rel="noopener noreferrer" className="w-10 h-10 rounded-full bg-rose-900/50 hover:bg-rose-800 hover:scale-110 flex items-center justify-center transition-all duration-300 group" aria-label="Telegram">
                <TelegramIcon className="w-5 h-5 text-rose-300 group-hover:text-white transition-colors" />
              </a>
            </div>
          </div>
          
          <div className="flex flex-wrap justify-center gap-8">
            <Link href="/" className="hover:text-white transition-colors">Inicio</Link>
            <a href="/#historia" className="hover:text-white transition-colors">Mi historia</a>
            <a href="/#salas" className="hover:text-white transition-colors">Salas</a>
            <Link href="/miembros" className="hover:text-white transition-colors font-medium text-rose-300">Acceso miembros</Link>
          </div>
        </div>
        
        <div className="mt-12 pt-8 border-t border-rose-900/50 text-center text-rose-400/60 text-sm flex flex-col md:flex-row justify-between items-center gap-4">
          <p>© {new Date().getFullYear()} Fénix. Todos los derechos reservados.</p>
          <Link href="/admin">
            <span className="text-rose-400/40 hover:text-rose-300 transition-colors text-xs cursor-pointer">
              Portal Admin
            </span>
          </Link>
        </div>
      </div>
    </footer>
  );
}
