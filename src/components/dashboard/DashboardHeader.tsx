'use client';
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger, SheetHeader, SheetTitle, SheetFooter } from "@/components/ui/sheet";
import { Home, Users, Building, BarChart2, Calendar, ClipboardList, Menu, LogOut, User as UserIcon, FileText } from "lucide-react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useUser } from "@/contexts/UserContext";
import { useState } from "react";
import KarateLogo from "@/app/components/KarateLogo";
import { useProgressBar } from "@/contexts/ProgressBarContext";


const menuItems = [
    { href: '/dashboard', label: 'Dashboard', icon: Home },
    { href: '/dashboard/users', label: 'Usuarios', icon: Users },
    { href: '/dashboard/schools', label: 'Escuelas', icon: Building },
    { href: '/dashboard/ranking', label: 'Ranking', icon: BarChart2 },
    { href: '/dashboard/events', label: 'Eventos', icon: ClipboardList },
    { href: '/dashboard/calendar', label: 'Calendario', icon: Calendar },
    { href: '/dashboard/claims', label: 'Reclamos', icon: FileText },
  ];

export default function DashboardHeader({ children }: { children?: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const { user } = useUser();
  const [isSheetOpen, setSheetOpen] = useState(false);
  const { startProgress } = useProgressBar();

  const handleSignOut = async () => {
    // Simulate sign out
    router.push('/login');
  };
  
  const handleNavigation = (href: string) => {
    if (pathname !== href) {
      startProgress();
    }
    router.push(href);
    setSheetOpen(false);
  };

  const getInitials = (firstName?: string, lastName?: string) => {
    if (!firstName || !lastName) return 'U';
    return `${firstName?.[0] || ''}${lastName?.[0] || ''}`.toUpperCase();
  };
  
  const displayName = user ? `${user.firstName} ${user.lastName}` : "Usuario";

  return (
    <header className="sticky top-0 z-30 flex h-14 items-center gap-4 border-b bg-background px-4 sm:static sm:h-auto sm:border-0 sm:bg-transparent sm:px-6">
        <Sheet open={isSheetOpen} onOpenChange={setSheetOpen}>
            <SheetTrigger asChild>
                <Button size="icon" variant="outline" className="sm:hidden">
                    <Menu className="h-5 w-5" />
                    <span className="sr-only">Abrir Menú</span>
                </Button>
            </SheetTrigger>
            <SheetContent side="left" className="sm:max-w-xs p-0 flex flex-col">
                <SheetHeader className="p-4 border-b">
                    <SheetTitle asChild>
                        <Link href="/" className="flex items-center gap-2" onClick={() => setSheetOpen(false)}>
                            <KarateLogo />
                            <span className="text-2xl font-headline font-bold">SRAM</span>
                        </Link>
                    </SheetTitle>
                </SheetHeader>
                <nav className="grid gap-2 text-lg font-medium p-4">
                    {menuItems.map(item => (
                         <button
                            key={item.label}
                            onClick={() => handleNavigation(item.href)}
                            className={`flex items-center gap-4 px-3 py-2 rounded-md transition-colors w-full text-left ${pathname === item.href ? 'bg-muted text-foreground' : 'text-muted-foreground hover:bg-muted/50 hover:text-foreground'}`}
                        >
                            <item.icon className="h-5 w-5" />
                            {item.label}
                        </button>
                    ))}
                </nav>

                 <SheetFooter className="mt-auto border-t p-4">
                     <div className="w-full flex flex-col gap-2">
                        <button onClick={() => handleNavigation('/dashboard/profile')} className="w-full">
                            <div className="w-full flex items-center justify-start gap-3 h-auto p-2 rounded-md hover:bg-muted">
                                    <Avatar className="h-10 w-10">
                                    <AvatarImage src={user?.photoURL || undefined} alt={displayName} />
                                    <AvatarFallback>{getInitials(user?.firstName, user?.lastName)}</AvatarFallback>
                                </Avatar>
                                <div className="text-left">
                                    <p className="font-semibold text-sm">{displayName}</p>
                                    <p className="text-xs text-muted-foreground">{user?.email}</p>
                                </div>
                            </div>
                        </button>
                        <Button variant="outline" onClick={handleSignOut} className="w-full">
                            <LogOut className="mr-2 h-4 w-4" />
                            Cerrar Sesión
                        </Button>
                    </div>
                </SheetFooter>
            </SheetContent>
        </Sheet>
        <div className="hidden sm:block">
            {children}
        </div>
        <div className="flex-1" />
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <div className="flex items-center gap-3 cursor-pointer rounded-lg p-2 hover:bg-muted/50 transition-colors">
                    <span className='text-sm font-medium hidden sm:inline-block'>{displayName}</span>
                    <Avatar className="h-9 w-9">
                      <AvatarImage src={user?.photoURL || undefined} alt={displayName} />
                      <AvatarFallback>{getInitials(user?.firstName, user?.lastName)}</AvatarFallback>
                    </Avatar>
                </div>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
                <DropdownMenuLabel>{displayName}</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={() => handleNavigation('/dashboard/profile')} className="cursor-pointer">
                    <UserIcon className="mr-2 h-4 w-4" />
                    Perfil
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={handleSignOut} className="cursor-pointer text-red-500 focus:text-red-500">
                  <LogOut className="mr-2 h-4 w-4" />
                  Cerrar Sesión
                </DropdownMenuItem>
            </DropdownMenuContent>
        </DropdownMenu>
    </header>
  );
}
