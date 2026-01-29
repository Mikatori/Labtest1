import { createHashRouter } from 'react-router-dom';
import AppShell from './components/layout/AppShell';
import Dashboard from './features/dashboard/Dashboard';
import EnhancedWaterQualityLab from './features/labs/Lab1Water/EnhancedWaterQualityLab';
import AirQualityLab from './features/labs/Lab2Air/AirQualityLab';
import LoginPage from './features/auth/LoginPage';
import RegisterPage from './features/auth/RegisterPage';
import ResetPasswordPage from './features/auth/ResetPasswordPage';
import ProtectedRoute from './components/auth/ProtectedRoute';

export const router = createHashRouter([
    // Auth routes (public)
    {
        path: '/login',
        element: <LoginPage />,
    },
    {
        path: '/register',
        element: <RegisterPage />,
    },
    {
        path: '/reset-password',
        element: <ResetPasswordPage />,
    },
    // Main app routes
    {
        path: '/',
        element: <AppShell />,
        children: [
            {
                path: '/',
                element: <Dashboard />,
            },
            {
                path: 'lab/water-quality',
                element: (
                    <ProtectedRoute>
                        <EnhancedWaterQualityLab />
                    </ProtectedRoute>
                ),
            },
            {
                path: 'lab/air-quality',
                element: (
                    <ProtectedRoute>
                        <AirQualityLab />
                    </ProtectedRoute>
                ),
            },
            {
                path: 'lab/:id',
                element: (
                    <ProtectedRoute>
                        <div className="text-center py-12">
                            <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Lab đang được phát triển</h2>
                            <p className="text-gray-600 dark:text-gray-400 mt-2">Vui lòng quay lại sau!</p>
                        </div>
                    </ProtectedRoute>
                ),
            }
        ],
    },
]);

