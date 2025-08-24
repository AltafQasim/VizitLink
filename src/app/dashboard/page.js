import ProtectedRoute from '../../components/ProtectedRoute';
import { DashboardProvider } from '../../context/DashboardContext';
import DashboardLayout from '../../components/dashboard/DashboardLayout';

export default function DashboardPage() {
  return (
    <ProtectedRoute>
      <DashboardProvider>
        <DashboardLayout />
      </DashboardProvider>
    </ProtectedRoute>
  );
}
