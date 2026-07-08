import { sesionActiva } from '@/lib/session';
import { Dashboard } from '@/components/dashboard/Dashboard';
import { LoginForm } from '@/components/dashboard/LoginForm';

// Página del dashboard: si hay cookie de sesión válida muestra el tablero; si no, el login.
export const dynamic = 'force-dynamic';

export default function DashboardPage() {
  if (!sesionActiva()) return <LoginForm />;
  return <Dashboard />;
}
