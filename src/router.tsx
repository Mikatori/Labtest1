import { createHashRouter } from 'react-router-dom';
import AppShell from './components/layout/AppShell';
import Dashboard from './features/dashboard/Dashboard';
import WaterQualityLab from './features/labs/Lab1Water/WaterQualityLab';
import AirQualityLab from './features/labs/Lab2Air/AirQualityLab';

export const router = createHashRouter([
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
                element: <WaterQualityLab />
            },
            {
                path: 'lab/air-quality',
                element: <AirQualityLab />
            },
            {
                path: 'lab/:id',
                element: <div className="text-center py-12">
                    <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Lab đang được phát triển</h2>
                    <p className="text-gray-600 dark:text-gray-400 mt-2">Vui lòng quay lại sau!</p>
                </div>
            }
        ],
    },
]);

