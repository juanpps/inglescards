import { NavLink, Link } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import {
  LayoutDashboard,
  BookOpen,
  FolderKanban,
  Upload,
  BarChart3,
  Settings,
  ChevronLeft,
  ChevronRight,
  Menu,
  X,
  PlusSquare,
  Trophy,
  Share2,
  UserCircle,
} from 'lucide-react';
import { cn } from '../../lib/utils';

const navItems = [
  { to: '/', icon: LayoutDashboard, label: 'Dashboard' },
  { to: '/ranking', icon: Trophy, label: 'Ranking' },
  { to: '/compartir', icon: Share2, label: 'Comunidad' },
  { to: '/estudiar', icon: BookOpen, label: 'Estudiar', dataOnboarding: 'estudiar' as const },
  { to: '/grupos', icon: FolderKanban, label: 'Grupos', dataOnboarding: 'grupos' as const },
  { to: '/nueva-tarjeta', icon: PlusSquare, label: 'Nueva tarjeta' },
  { to: '/importar', icon: Upload, label: 'Importar', dataOnboarding: 'import' as const },
  { to: '/estadisticas', icon: BarChart3, label: 'Estadísticas', dataOnboarding: 'estadisticas' as const },
  { to: '/configuracion', icon: Settings, label: 'Configuración', dataOnboarding: 'config' as const },
];

interface SidebarProps {
  collapsed: boolean;
  open: boolean;
  onToggle: () => void;
  onClose?: () => void;
}

export function Sidebar({ collapsed, open, onToggle, onClose }: SidebarProps) {
  const { currentUser } = useAuth();
  return (
    <>
      {/* Overlay en móvil */}
      <div
        className={cn(
          'fixed inset-0 z-40 bg-black/50 lg:hidden transition-opacity duration-200',
          open ? 'opacity-100' : 'opacity-0 pointer-events-none'
        )}
        onClick={onClose}
        aria-hidden="true"
      />

      <aside
        className={cn(
          'flex flex-col border-r border-zinc-200 bg-white dark:border-zinc-800 dark:bg-zinc-900',
          'transition-all duration-200 ease-in-out z-50',
          'fixed inset-y-0 left-0',
          'lg:relative lg:translate-x-0 lg:static',
          collapsed ? 'lg:w-16' : 'lg:w-56',
          open ? 'translate-x-0 w-64' : '-translate-x-full'
        )}
      >
        <div className="flex h-14 min-h-[56px] items-center justify-between px-4 border-b border-zinc-200 dark:border-zinc-800 shrink-0">
          {!collapsed && (
            <span className="font-semibold text-indigo-600 truncate">ICFES-SRS</span>
          )}
          <div className="flex items-center gap-1">
            <button
              onClick={onToggle}
              className="hidden lg:flex p-2 rounded-lg hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors"
              aria-label={collapsed ? 'Expandir' : 'Colapsar'}
            >
              {collapsed ? (
                <ChevronRight className="w-5 h-5 text-zinc-500" />
              ) : (
                <ChevronLeft className="w-5 h-5 text-zinc-500" />
              )}
            </button>
            <button
              onClick={onClose}
              className="lg:hidden p-2 rounded-lg hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors"
              aria-label="Cerrar menú"
            >
              <X className="w-5 h-5 text-zinc-500" />
            </button>
          </div>
        </div>
        <nav className="flex-1 p-3 space-y-1 overflow-y-auto">
          {navItems.map(({ to, icon: Icon, label, dataOnboarding }) => (
            <NavLink
              key={to}
              to={to}
              onClick={onClose}
              data-onboarding={dataOnboarding}
              className={({ isActive }) =>
                cn(
                  'flex items-center gap-3 px-3 py-3 rounded-xl transition-all duration-200 min-h-[44px]',
                  'touch-manipulation',
                  isActive
                    ? 'bg-indigo-50 text-indigo-700 dark:bg-indigo-950 dark:text-indigo-300'
                    : 'text-zinc-600 hover:bg-zinc-100 dark:text-zinc-400 dark:hover:bg-zinc-800'
                )
              }
            >
              <Icon className="w-5 h-5 shrink-0" />
              {(!collapsed || open) && <span>{label}</span>}
            </NavLink>
          ))}
        </nav>

        {/* Profile footer */}
        <div className="p-2 border-t border-zinc-200 dark:border-zinc-800">
          <Link
            to="/perfil"
            onClick={onClose}
            className="flex items-center gap-3 px-3 py-2 rounded-xl hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-all"
          >
            {currentUser?.photoURL ? (
              <img src={currentUser.photoURL} alt="avatar" className="w-7 h-7 rounded-full object-cover shrink-0" />
            ) : (
              <div className="w-7 h-7 rounded-full bg-indigo-100 dark:bg-indigo-900/40 flex items-center justify-center shrink-0">
                <UserCircle className="w-5 h-5 text-indigo-500" />
              </div>
            )}
            {(!collapsed || open) && (
              <div className="flex-1 min-w-0">
                <p className="text-xs font-bold text-zinc-700 dark:text-zinc-300 truncate">
                  {currentUser?.displayName ?? currentUser?.email ?? 'Perfil'}
                </p>
                <p className="text-[10px] text-zinc-400 font-medium">
                  {currentUser ? 'Ver perfil' : 'Iniciar sesión'}
                </p>
              </div>
            )}
          </Link>
        </div>
      </aside>
    </>
  );
}

export function SidebarTrigger({ onClick }: { onClick: () => void }) {
  return (
    <button
      onClick={onClick}
      className="lg:hidden p-2 -ml-2 rounded-lg hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors touch-manipulation"
      aria-label="Abrir menú"
    >
      <Menu className="w-6 h-6 text-zinc-600 dark:text-zinc-400" />
    </button>
  );
}
