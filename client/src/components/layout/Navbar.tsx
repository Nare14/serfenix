import { Link, useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import { Menu } from "lucide-react";
import { useState } from "react";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import logo from "/logo-fenix.png";

export default function Navbar() {
  const [location] = useLocation();
  const [isOpen, setIsOpen] = useState(false);

  const navLinks = [
    { href: "/", label: "Inicio" },
    { href: "/#historia", label: "Mi historia" },
    { href: "/#sala", label: "Sala Fénix 2.0" },
  ];

  return (
    <motion.header
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.6, ease: "easeOut" }}
      className="fixed top-0 left-0 right-0 z-50 glass"
    >
      <div className="container mx-auto px-4 h-20 flex items-center justify-between">
        <Link href="/">
          <div className="flex items-center cursor-pointer">
            <img
              src={logo}
              alt="Sabiduría Fénix"
              className="h-16 w-auto object-contain max-h-full"
            />
          </div>
        </Link>

        <nav className="hidden md:flex items-center gap-8">
          <div className="flex items-center gap-6">
            {navLinks.map((link) => (
              <a
                key={link.href}
                href={link.href}
                className="text-rose-950/70 hover:text-rose-600 transition-all duration-300 text-sm font-medium uppercase tracking-widest relative after:absolute after:bottom-[-4px] after:left-0 after:w-0 after:h-[2px] after:bg-rose-500 after:rounded-full after:transition-all after:duration-300 hover:after:w-full"
              >
                {link.label}
              </a>
            ))}
          </div>

          <div className="h-6 w-px bg-rose-200" />

          <Link href="/miembros">
            <Button
              variant={location === "/miembros" ? "secondary" : "default"}
              className="bg-rose-600 hover:bg-rose-700 text-white rounded-full px-8 shadow-lg shadow-rose-600/20"
            >
              ACCESO MIEMBROS
            </Button>
          </Link>
        </nav>

        <div className="md:hidden">
          <Sheet open={isOpen} onOpenChange={setIsOpen}>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon" className="text-rose-900">
                <Menu className="h-6 w-6" />
              </Button>
            </SheetTrigger>

            <SheetContent className="bg-white/95 backdrop-blur-xl border-l-white/20">
              <div className="flex flex-col gap-8 mt-12 items-center text-center">
                {navLinks.map((link) => (
                  <a
                    key={link.href}
                    href={link.href}
                    onClick={() => setIsOpen(false)}
                    className="text-rose-950 font-serif text-xl"
                  >
                    {link.label}
                  </a>
                ))}

                <Link href="/miembros">
                  <Button
                    onClick={() => setIsOpen(false)}
                    className="bg-rose-600 text-white rounded-full px-8 w-full mt-4"
                  >
                    ACCESO MIEMBROS
                  </Button>
                </Link>
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </motion.header>
  );
}
