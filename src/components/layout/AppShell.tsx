import { Outlet, Link } from 'react-router-dom';
import { Beaker, User } from 'lucide-react';
import { useStore } from '../../store/useStore';

const AppShell = () => {
    const { theme, toggleTheme } = useStore();

    return (
        <div className={`min-h-screen flex flex-col ${theme}`}>
            <header className="border-b border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 sticky top-0 z-50">
                <div className="container mx-auto px-4 h-16 flex items-center justify-between">
                    <Link to="/" className="flex items-center gap-2 font-bold text-xl text-primary-600 dark:text-primary-400">
                        <Beaker className="w-6 h-6" />
                        <span>EcoLab Virtual</span>
                    </Link>

                    <div className="flex items-center gap-4">
                        <button
                            onClick={toggleTheme}
                            className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
                        >
                            {theme === 'dark' ? '🌞' : '🌙'}
                        </button>
                        <div className="w-8 h-8 rounded-full bg-primary-100 dark:bg-primary-900 flex items-center justify-center">
                            <User className="w-5 h-5 text-primary-600 dark:text-primary-400" />
                        </div>
                    </div>
                </div>
            </header>

            <main className="flex-1 container mx-auto px-4 py-8">
                <Outlet />
            </main>

            <footer className="border-t border-gray-200 dark:border-gray-800 py-6 mt-auto">
                <div className="container mx-auto px-4 text-center text-sm text-gray-500">
                    © 2024 EcoLab Virtual. Environmental Science Education.
                </div>
            </footer>
        </div>
    );
};

export default AppShell;
