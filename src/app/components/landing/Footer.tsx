import Link from "next/link";
import KarateLogo from "../KarateLogo";

const menuItems = [
  { name: "Competencias", href: "#" },
  { name: "Eventos", href: "#" },
  { name: "Ganadores", href: "#winners" },
  { name: "Conócenos", href: "#conocenos" },
];

export default function Footer() {
  return (
    <footer className="bg-black text-accent-foreground border-t border-border">
      <div className="container mx-auto px-4 py-8">
        <div className="flex flex-col md:flex-row justify-between items-center space-y-6 md:space-y-0">
          <Link href="/" className="flex items-center gap-2">
            <KarateLogo className="h-8 w-8 text-primary" />
            <span className="text-2xl font-headline font-bold">SRAM</span>
          </Link>
          <nav className="flex flex-wrap justify-center gap-4 md:gap-6">
            {menuItems.map((item) => (
              <Link
                key={item.name}
                href={item.href}
                className="text-sm font-medium text-accent-foreground/80 hover:text-accent-foreground transition-colors"
              >
                {item.name}
              </Link>
            ))}
             <Link
                href="/login"
                className="text-sm font-medium text-accent-foreground/80 hover:text-accent-foreground transition-colors"
              >
                Iniciar Sesión
              </Link>
          </nav>
          <p className="text-sm text-accent-foreground/60">
            &copy; {new Date().getFullYear()} SRAM Venezuela. Todos los derechos reservados.
          </p>
        </div>
      </div>
    </footer>
  );
}
