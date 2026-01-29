import { useState } from 'react';
import { ArrowLeft, Wind, AlertTriangle, CheckCircle2 } from 'lucide-react';
import { Link } from 'react-router-dom';
import AirLabScene from './AirLabScene';

interface AirMeasurement {
    co2: number;
    pm25: number;
    pm10: number;
    temperature: number;
    humidity: number;
}

const STEPS = [
    'Chuẩn bị máy đo chất lượng không khí',
    'Đo nồng độ CO2 trong không khí',
    'Đo bụi mịn PM2.5 và PM10',
    'Đo nhiệt độ và độ ẩm',
    'Phân tích và đánh giá AQI (Air Quality Index)'
];

export default function AirQualityLab() {
    const [currentStep, setCurrentStep] = useState(0);
    const [measurements, setMeasurements] = useState<AirMeasurement>({
        co2: 400,
        pm25: 12,
        pm10: 20,
        temperature: 25,
        humidity: 60
    });

    const handleMeasurement = (key: keyof AirMeasurement, value: number) => {
        setMeasurements(prev => ({ ...prev, [key]: value }));
    };

    const getAQI = () => {
        const { co2, pm25, pm10 } = measurements;

        if (pm25 <= 12 && pm10 <= 50 && co2 <= 500) {
            return { status: 'Tốt', level: 'Good', color: 'text-green-600 dark:text-green-400', icon: CheckCircle2 };
        } else if (pm25 <= 35 && pm10 <= 150 && co2 <= 800) {
            return { status: 'Trung bình', level: 'Moderate', color: 'text-yellow-600 dark:text-yellow-400', icon: AlertTriangle };
        } else if (pm25 <= 55 && pm10 <= 250 && co2 <= 1000) {
            return { status: 'Kém', level: 'Unhealthy', color: 'text-orange-600 dark:text-orange-400', icon: AlertTriangle };
        } else {
            return { status: 'Nguy hại', level: 'Hazardous', color: 'text-red-600 dark:text-red-400', icon: AlertTriangle };
        }
    };

    const aqi = getAQI();
    const AQIIcon = aqi.icon;

    return (
        <div className="max-w-7xl mx-auto space-y-6">
            {/* Header */}
            <div className="flex items-center justify-between">
                <Link to="/" className="flex items-center gap-2 text-gray-600 dark:text-gray-400 hover:text-primary-600 dark:hover:text-primary-400">
                    <ArrowLeft className="w-5 h-5" />
                    <span>Quay lại Dashboard</span>
                </Link>
                <div className="flex items-center gap-2 text-sm">
                    <Wind className="w-4 h-4" />
                    <span className="text-gray-500">Bước {currentStep + 1}/{STEPS.length}</span>
                </div>
            </div>

            {/* Title */}
            <div>
                <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
                    Lab 2: Giám sát Chất lượng Không khí
                </h1>
                <p className="text-gray-600 dark:text-gray-400">
                    Học cách đo và phân tích các chỉ số chất lượng không khí: CO2, PM2.5, PM10, và tính toán AQI.
                </p>
            </div>

            {/* Progress Bar */}
            <div className="bg-gray-200 dark:bg-gray-700 h-2 rounded-full overflow-hidden">
                <div
                    className="bg-secondary-600 h-full transition-all duration-300"
                    style={{ width: `${((currentStep + 1) / STEPS.length) * 100}%` }}
                />
            </div>

            {/* Main Content Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Left: 3D Scene */}
                <div className="space-y-4">
                    <AirLabScene co2Level={measurements.co2} pm25={measurements.pm25} pm10={measurements.pm10} />

                    <div className={`p-4 rounded-lg border-2 ${aqi.status === 'Tốt' ? 'border-green-500 bg-green-50 dark:bg-green-900/20' : aqi.status === 'Trung bình' ? 'border-yellow-500 bg-yellow-50 dark:bg-yellow-900/20' : aqi.status === 'Kém' ? 'border-orange-500 bg-orange-50 dark:bg-orange-900/20' : 'border-red-500 bg-red-50 dark:bg-red-900/20'}`}>
                        <div className="flex items-center gap-2 font-semibold">
                            <AQIIcon className="w-5 h-5" />
                            <span className={aqi.color}>Chất lượng không khí: {aqi.status} ({aqi.level})</span>
                        </div>
                    </div>
                </div>

                {/* Right: Controls & Instructions */}
                <div className="space-y-4">
                    <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-md border border-gray-200 dark:border-gray-700">
                        <h3 className="font-semibold text-lg mb-3 text-gray-900 dark:text-white">
                            Bước {currentStep + 1}: {STEPS[currentStep]}
                        </h3>

                        {currentStep === 0 && (
                            <p className="text-gray-600 dark:text-gray-400">
                                Chuẩn bị máy đo chất lượng không khí. Đảm bảo thiết bị đã được hiệu chuẩn
                                và đặt ở vị trí thích hợp để có kết quả chính xác.
                            </p>
                        )}

                        {currentStep === 1 && (
                            <div className="space-y-4">
                                <label className="block">
                                    <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                                        Nồng độ CO2 (ppm)
                                    </span>
                                    <input
                                        type="range"
                                        min="300"
                                        max="2000"
                                        step="10"
                                        value={measurements.co2}
                                        onChange={(e) => handleMeasurement('co2', parseFloat(e.target.value))}
                                        className="w-full mt-2"
                                    />
                                    <div className="flex justify-between text-xs text-gray-500 mt-1">
                                        <span>300 ppm</span>
                                        <span className="font-semibold text-lg">{measurements.co2} ppm</span>
                                        <span>2000 ppm</span>
                                    </div>
                                </label>
                                <div className="bg-blue-50 dark:bg-blue-900/20 p-3 rounded-lg text-sm">
                                    <p className="text-blue-800 dark:text-blue-200">
                                        <strong>Tham khảo:</strong> 400-500 ppm (tốt), 500-800 ppm (trung bình), &gt;1000 ppm (kém)
                                    </p>
                                </div>
                            </div>
                        )}

                        {currentStep === 2 && (
                            <div className="space-y-4">
                                <label className="block">
                                    <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                                        PM2.5 (µg/m³)
                                    </span>
                                    <input
                                        type="range"
                                        min="0"
                                        max="100"
                                        step="0.5"
                                        value={measurements.pm25}
                                        onChange={(e) => handleMeasurement('pm25', parseFloat(e.target.value))}
                                        className="w-full mt-2"
                                    />
                                    <div className="flex justify-between text-xs text-gray-500 mt-1">
                                        <span>0</span>
                                        <span className="font-semibold text-lg">{measurements.pm25.toFixed(1)} µg/m³</span>
                                        <span>100</span>
                                    </div>
                                </label>

                                <label className="block">
                                    <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                                        PM10 (µg/m³)
                                    </span>
                                    <input
                                        type="range"
                                        min="0"
                                        max="300"
                                        step="1"
                                        value={measurements.pm10}
                                        onChange={(e) => handleMeasurement('pm10', parseFloat(e.target.value))}
                                        className="w-full mt-2"
                                    />
                                    <div className="flex justify-between text-xs text-gray-500 mt-1">
                                        <span>0</span>
                                        <span className="font-semibold text-lg">{measurements.pm10.toFixed(1)} µg/m³</span>
                                        <span>300</span>
                                    </div>
                                </label>

                                <div className="bg-blue-50 dark:bg-blue-900/20 p-3 rounded-lg text-sm">
                                    <p className="text-blue-800 dark:text-blue-200">
                                        Bụi mịn PM2.5 nguy hiểm hơn PM10 vì có thể xâm nhập sâu vào phổi.
                                    </p>
                                </div>
                            </div>
                        )}

                        {currentStep === 3 && (
                            <div className="space-y-4">
                                <label className="block">
                                    <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Nhiệt độ (°C)</span>
                                    <input
                                        type="range"
                                        min="0"
                                        max="45"
                                        step="0.5"
                                        value={measurements.temperature}
                                        onChange={(e) => handleMeasurement('temperature', parseFloat(e.target.value))}
                                        className="w-full mt-2"
                                    />
                                    <div className="flex justify-between text-xs text-gray-500 mt-1">
                                        <span>0°C</span>
                                        <span className="font-semibold text-lg">{measurements.temperature.toFixed(1)}°C</span>
                                        <span>45°C</span>
                                    </div>
                                </label>

                                <label className="block">
                                    <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Độ ẩm (%)</span>
                                    <input
                                        type="range"
                                        min="0"
                                        max="100"
                                        step="1"
                                        value={measurements.humidity}
                                        onChange={(e) => handleMeasurement('humidity', parseFloat(e.target.value))}
                                        className="w-full mt-2"
                                    />
                                    <div className="flex justify-between text-xs text-gray-500 mt-1">
                                        <span>0%</span>
                                        <span className="font-semibold text-lg">{measurements.humidity}%</span>
                                        <span>100%</span>
                                    </div>
                                </label>
                            </div>
                        )}

                        {currentStep === 4 && (
                            <div className="space-y-3">
                                <div className="grid grid-cols-2 gap-3 text-sm">
                                    <div className="bg-gray-50 dark:bg-gray-700 p-3 rounded-lg">
                                        <div className="text-gray-500 dark:text-gray-400">CO2</div>
                                        <div className="text-lg font-semibold">{measurements.co2} ppm</div>
                                    </div>
                                    <div className="bg-gray-50 dark:bg-gray-700 p-3 rounded-lg">
                                        <div className="text-gray-500 dark:text-gray-400">PM2.5</div>
                                        <div className="text-lg font-semibold">{measurements.pm25.toFixed(1)} µg/m³</div>
                                    </div>
                                    <div className="bg-gray-50 dark:bg-gray-700 p-3 rounded-lg">
                                        <div className="text-gray-500 dark:text-gray-400">PM10</div>
                                        <div className="text-lg font-semibold">{measurements.pm10.toFixed(1)} µg/m³</div>
                                    </div>
                                    <div className="bg-gray-50 dark:bg-gray-700 p-3 rounded-lg">
                                        <div className="text-gray-500 dark:text-gray-400">Nhiệt độ</div>
                                        <div className="text-lg font-semibold">{measurements.temperature.toFixed(1)}°C</div>
                                    </div>
                                </div>
                                <p className="text-sm text-gray-600 dark:text-gray-400">
                                    Chất lượng không khí được đánh giá: <strong className={aqi.color}>{aqi.status}</strong>
                                </p>
                            </div>
                        )}
                    </div>

                    {/* Navigation */}
                    <div className="flex gap-3">
                        {currentStep > 0 && (
                            <button
                                onClick={() => setCurrentStep(prev => prev - 1)}
                                className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                            >
                                Quay lại
                            </button>
                        )}
                        {currentStep < STEPS.length - 1 && (
                            <button
                                onClick={() => setCurrentStep(prev => prev + 1)}
                                className="flex-1 px-4 py-2 bg-secondary-600 text-white rounded-lg hover:bg-secondary-700 transition-colors"
                            >
                                Tiếp theo
                            </button>
                        )}
                        {currentStep === STEPS.length - 1 && (
                            <Link
                                to="/"
                                className="flex-1 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors text-center"
                            >
                                Hoàn thành
                            </Link>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}
