import { FlaskConical, Wind, Leaf, Droplets, ThermometerSun } from 'lucide-react';
import { Link } from 'react-router-dom';

const labs = [
    {
        id: 'water-quality',
        title: 'Water Quality Analysis',
        description: 'Measure pH, turbidity, and identify pollutants in water samples.',
        icon: Droplets,
        color: 'bg-blue-500',
        difficulty: 'Easy'
    },
    {
        id: 'air-quality',
        title: 'Air Quality Monitoring',
        description: 'Analyze CO2 levels, PM2.5, and PM10 to determine air quality index.',
        icon: Wind,
        color: 'bg-gray-500',
        difficulty: 'Medium'
    },
    {
        id: 'carbon-cycle',
        title: 'Carbon Cycle Simulation',
        description: 'Explore how carbon moves through the atmosphere, biosphere, and geosphere.',
        icon: Leaf,
        color: 'bg-green-500',
        difficulty: 'Hard'
    },
    {
        id: 'greenhouse',
        title: 'Greenhouse Effect',
        description: 'Simulate the greenhouse effect and efficient energy usage.',
        icon: ThermometerSun,
        color: 'bg-orange-500',
        difficulty: 'Medium'
    },
    {
        id: 'soil-analysis',
        title: 'Soil & Microbes',
        description: 'Microscopic analysis of soil composition and microbial life.',
        icon: FlaskConical,
        color: 'bg-yellow-600',
        difficulty: 'Hard'
    }
];

const Dashboard = () => {
    return (
        <div className="space-y-8">
            <div className="text-center space-y-4">
                <h1 className="text-4xl font-extrabold tracking-tight text-gray-900 dark:text-white sm:text-5xl">
                    Virtual Environmental Laboratory
                </h1>
                <p className="max-w-2xl mx-auto text-xl text-gray-500 dark:text-gray-400">
                    Interactive experiments to understand our planet, from water quality to climate change.
                </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {labs.map((lab) => (
                    <Link
                        key={lab.id}
                        to={`/lab/${lab.id}`}
                        className="group relative bg-white dark:bg-gray-800 rounded-2xl shadow-sm hover:shadow-xl border border-gray-200 dark:border-gray-700 transition-all duration-300 overflow-hidden"
                    >
                        <div className={`h-2 w-full ${lab.color}`} />
                        <div className="p-6">
                            <div className="flex items-center justify-between mb-4">
                                <div className={`p-3 rounded-lg ${lab.color} bg-opacity-10 dark:bg-opacity-20`}>
                                    <lab.icon className={`w-6 h-6 ${lab.color.replace('bg-', 'text-')}`} />
                                </div>
                                <span className="text-xs font-semibold px-2 py-1 rounded-full bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300">
                                    {lab.difficulty}
                                </span>
                            </div>
                            <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2 group-hover:text-primary-600 dark:group-hover:text-primary-400 transition-colors">
                                {lab.title}
                            </h3>
                            <p className="text-gray-500 dark:text-gray-400">
                                {lab.description}
                            </p>
                        </div>
                    </Link>
                ))}
            </div>
        </div>
    );
};

export default Dashboard;
