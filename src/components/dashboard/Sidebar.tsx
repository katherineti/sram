'use client';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Home, User, BarChart2, Users, Building, LogOut, Calendar, ClipboardList, FileText } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useUser } from '@/contexts/UserContext';
import { Avatar, AvatarFallback, AvatarImage } from '../ui/avatar';
import { Badge } from '../ui/badge';
import { Tooltip, TooltipProvider, TooltipContent, TooltipTrigger } from '../ui/tooltip';
import KarateLogo from '@/app/components/KarateLogo';
import { useProgressBar } from '@/contexts/ProgressBarContext';

const allMenuItems = [
  { href: '/dashboard', label: 'Dashboard', icon: Home, roles: ['admin', 'master', 'alumno', 'representante'] },
  { href: '/dashboard/users', label: 'Usuarios', icon: Users, roles: ['admin'] },
  { href: '/dashboard/schools', label: 'Escuelas', icon: Building, roles: ['admin'] },
  { href: '/dashboard/ranking', label: 'Ranking', icon: BarChart2, roles: ['admin', 'master'] },
  { href: '/dashboard/events', label: 'Eventos', icon: ClipboardList, roles: ['admin'] },
  { href: '/dashboard/calendar', label: 'Calendario', icon: Calendar, roles: ['admin', 'master', 'alumno', 'representante'] },
  { href: '/dashboard/claims', label: 'Reclamos', icon: FileText, roles: ['admin', 'master', 'representante'] },
];

const roleLabels: { [key: string]: string } = {
  admin: "Administrador",
  master: "Master",
  alumno: "Alumno",
  representante: "Representante",
};


export default function Sidebar({ isOpen }: { isOpen: boolean }) {
  const pathname = usePathname();
  const { user } = useUser();
  const { startProgress } = useProgressBar();

  const handleNavigation = (e: React.MouseEvent<HTMLAnchorElement>, href: string) => {
    if (pathname !== href) {
        startProgress();
    }
    // La navegación por Link continuará de forma natural.
  };

  const menuItems = user ? allMenuItems.filter(item => item.roles.includes(user.role)) : [];

  const getInitials = (firstName?: string, lastName?: string) => {
    if (!firstName || !lastName) return 'U';
    return `${firstName?.[0] || ''}${lastName?.[0] || ''}`.toUpperCase();
  };

  return (
    <aside className={cn(
        "fixed inset-y-0 left-0 z-10 hidden flex-col border-r bg-sidebar sm:flex transition-all duration-300",
        isOpen ? "w-64" : "w-14"
      )}>
        <TooltipProvider>
            <nav className="flex flex-col items-center gap-4 px-2 py-4">
                <Link
                    href="/dashboard"
                    onClick={(e) => handleNavigation(e, '/dashboard')}
                    className="group flex h-9 w-9 shrink-0 items-center justify-center gap-2 rounded-full bg-primary text-lg font-semibold text-primary-foreground md:h-8 md:w-8 md:text-base"
                >
                    <KarateLogo className="h-5 w-5 text-primary-foreground transition-all group-hover:scale-110" />
                    <span className="sr-only">SRAM</span>
                </Link>
                {menuItems.map((item) => (
                <Tooltip key={item.label}>
                    <TooltipTrigger asChild>
                         <Link
                            href={item.href}
                            onClick={(e) => handleNavigation(e, item.href)}
                            className={cn(
                                'flex h-9 items-center justify-center rounded-lg text-sidebar-foreground transition-colors hover:bg-sidebar-muted hover:text-sidebar-foreground md:h-8',
                                (pathname === item.href || (item.href !== '/dashboard' && pathname.startsWith(item.href))) && 'bg-sidebar-accent text-sidebar-accent-foreground',
                                isOpen ? 'w-full justify-start px-2' : 'w-9 md:w-8'
                            )}
                        >
                            <item.icon className={cn("h-5 w-5", isOpen && "mr-3")} />
                            <span className={cn("sr-only", isOpen && "not-sr-only")}>{item.label}</span>
                        </Link>
                    </TooltipTrigger>
                    {!isOpen && <TooltipContent side="right">{item.label}</TooltipContent>}
                </Tooltip>
            ))}
            </nav>
            <nav className="mt-auto flex flex-col items-center gap-2 px-2 py-4">
                <Tooltip>
                    <TooltipTrigger asChild>
                        <Link
                            href="/dashboard/profile"
                            onClick={(e) => handleNavigation(e, '/dashboard/profile')}
                            className={cn(
                                "flex h-auto items-center justify-center rounded-lg text-sidebar-foreground transition-colors hover:bg-sidebar-muted",
                                isOpen ? 'w-full flex-col gap-2 p-2' : 'w-9 md:w-8 h-9 md:h-8'
                            )}
                        >
                            <Avatar className={cn("h-8 w-8")}>
                                <AvatarImage src={user?.photoURL || undefined} />
                                <AvatarFallback>{getInitials(user?.firstName, user?.lastName)}</AvatarFallback>
                            </Avatar>
                             <div className={cn("sr-only text-center", isOpen && "not-sr-only")}>
                                <p className='font-semibold text-sm text-sidebar-foreground'>{user?.firstName} {user?.lastName}</p>
                                {user?.role && <p className='text-xs text-sidebar-muted-foreground'>{roleLabels[user.role]}</p>}
                             </div>
                        </Link>
                    </TooltipTrigger>
                    {!isOpen && <TooltipContent side="right">Perfil</TooltipContent>}
                </Tooltip>
            </nav>
        </TooltipProvider>
    </aside>
  );
}
