import ProtectedRoute from '../../../components/ProtectedRoute';
import { DashboardProvider } from '../../../context/DashboardContext';
import DashboardLayout from '../../../components/dashboard/DashboardLayout';

export default async function DashboardTabPage({ params }) {
  const { tab } = await params;
  return (
    <ProtectedRoute>
      <DashboardProvider initialTab={tab}>
        <DashboardLayout />
      </DashboardProvider>
    </ProtectedRoute>
  );
}


