import { useState, useEffect } from 'react';
import { ArrowLeft, FlaskConical, Download, Play, Pause, RotateCcw, TrendingUp } from 'lucide-react';
import { Link } from 'react-router-dom';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import jsPDF from 'jspdf';
import EnhancedWaterLabScene from './EnhancedWaterLabScene';
import {
    calculateWaterQuality,
    formatDataForChart,
    type WaterQualityData,
    type WaterQualityResult
} from './waterQualityCalculations';

export default function EnhancedWaterQualityLab() {
    const [measurements, setMeasurements] = useState<WaterQualityData>({
        ph: 7.0,
        turbidity: 5,
        tds: 250,
        temperature: 25,
        dissolvedOxygen: 8,
        timestamp: Date.now()
    });

    const [dataHistory, setDataHistory] = useState<WaterQualityData[]>([]);
    const [result, setResult] = useState<WaterQualityResult | null>(null);

    // Meter controls
    const [showPHMeter, setShowPHMeter] = useState(false);
    const [showTurbidityMeter, setShowTurbidityMeter] = useState(false);
    const [showTDSMeter, setShowTDSMeter] = useState(false);
    const [isAnimating, setIsAnimating] = useState(false);

    // Real-time monitoring
    const [isMonitoring, setIsMonitoring] = useState(false);

    // Calculate results whenever measurements change
    useEffect(() => {
        const newResult = calculateWaterQuality(measurements);
        setResult(newResult);
    }, [measurements]);

    // Real-time monitoring
    useEffect(() => {
        if (isMonitoring) {
            const interval = setInterval(() => {
                const newData = { ...measurements, timestamp: Date.now() };
                setDataHistory(prev => [...prev.slice(-19), newData]); // Keep last 20 points
            }, 2000);
            return () => clearInterval(interval);
        }
    }, [isMonitoring, measurements]);

    const handleMeasurementChange = (key: keyof WaterQualityData, value: number) => {
        setMeasurements(prev => ({ ...prev, [key]: value, timestamp: Date.now() }));
    };

    const handleActivateMeter = (meter: 'ph' | 'turbidity' | 'tds') => {
        setIsAnimating(true);

        if (meter === 'ph') {
            setShowPHMeter(true);
        } else if (meter === 'turbidity') {
            setShowTurbidityMeter(true);
        } else if (meter === 'tds') {
            setShowTDSMeter(true);
        }

        // Stop animation after 2 seconds
        setTimeout(() => setIsAnimating(false), 2000);
    };

    const handleReset = () => {
        setMeasurements({
            ph: 7.0,
            turbidity: 5,
            tds: 250,
            temperature: 25,
            dissolvedOxygen: 8,
            timestamp: Date.now()
        });
        setDataHistory([]);
        setShowPHMeter(false);
        setShowTurbidityMeter(false);
        setShowTDSMeter(false);
        setIsMonitoring(false);
    };

    const handleExportPDF = () => {
        const doc = new jsPDF();

        // Header
        doc.setFontSize(20);
        doc.text('Lab Report: Water Quality Analysis', 20, 20);

        doc.setFontSize(12);
        doc.text(`Date: ${new Date().toLocaleDateString('vi-VN')}`, 20, 30);
        doc.text(`Time: ${new Date().toLocaleTimeString('vi-VN')}`, 20, 37);

        // Overall Result
        doc.setFontSize(16);
        doc.text('Overall Assessment', 20, 50);
        doc.setFontSize(12);
        doc.text(`Classification: ${result?.classificationVI} (${result?.classification})`, 20, 60);
        doc.text(`Overall Score: ${result?.overallScore}/100`, 20, 67);
        doc.text(`Potable: ${result?.potable ? 'YES ✓' : 'NO ✗'}`, 20, 74);

        // Parameters
        doc.setFontSize(16);
        doc.text('Measured Parameters', 20, 90);
        doc.setFontSize(11);

        let yPos = 100;
        doc.text(`pH: ${measurements.ph.toFixed(2)} - ${result?.parameters.ph.statusVI}`, 25, yPos);
        yPos += 7;
        doc.text(`Turbidity: ${measurements.turbidity.toFixed(1)} NTU - ${result?.parameters.turbidity.statusVI}`, 25, yPos);
        yPos += 7;
        doc.text(`TDS: ${measurements.tds.toFixed(0)} ppm - ${result?.parameters.tds.statusVI}`, 25, yPos);
        yPos += 7;
        doc.text(`Temperature: ${measurements.temperature.toFixed(1)}°C`, 25, yPos);
        yPos += 7;
        doc.text(`Dissolved Oxygen: ${measurements.dissolvedOxygen.toFixed(1)} mg/L - ${result?.parameters.dissolvedOxygen.statusVI}`, 25, yPos);

        // Recommendations
        doc.setFontSize(16);
        doc.text('Recommendations', 20, yPos + 15);
        doc.setFontSize(10);

        yPos += 25;
        result?.recommendations.forEach((rec) => {
            const lines = doc.splitTextToSize(rec, 170);
            lines.forEach((line: string) => {
                doc.text(line, 25, yPos);
                yPos += 6;
            });
        });

        // Footer
        doc.setFontSize(8);
        doc.text('Generated by EcoLab Virtual - Environmental Science Education Platform', 20, 280);

        // Save
        doc.save(`water-quality-report-${Date.now()}.pdf`);
    };

    const chartData = formatDataForChart(dataHistory);

    return (
        <div className="max-w-[1600px] mx-auto space-y-6 pb-12">
            {/* Header */}
            <div className="flex items-center justify-between">
                <Link to="/" className="flex items-center gap-2 text-gray-600 dark:text-gray-400 hover:text-primary-600 dark:hover:text-primary-400">
                    <ArrowLeft className="w-5 h-5" />
                    <span>Quay lại Dashboard</span>
                </Link>
                <div className="flex items-center gap-3">
                    <button
                        onClick={handleReset}
                        className="flex items-center gap-2 px-3 py-2 bg-gray-100 dark:bg-gray-700 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
                    >
                        <RotateCcw className="w-4 h-4" />
                        <span className="text-sm">Reset</span>
                    </button>
                    {result && (
                        <button
                            onClick={handleExportPDF}
                            className="flex items-center gap-2 px-3 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
                        >
                            <Download className="w-4 h-4" />
                            <span className="text-sm">Export PDF</span>
                        </button>
                    )}
                </div>
            </div>

            {/* Title */}
            <div>
                <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
                    🔬 Lab 1: Phân tích Chất lượng Nước (Enhanced)
                </h1>
                <p className="text-gray-600 dark:text-gray-400">
                    Interactive simulation với 3D visualization, real-time monitoring, và calculation engine
                </p>
            </div>

            {/* Main Grid */}
            <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
                {/* Left: 3D Scene */}
                <div className="xl:col-span-2 space-y-4">
                    <EnhancedWaterLabScene
                        phLevel={measurements.ph}
                        turbidity={measurements.turbidity}
                        tds={measurements.tds}
                        showPHMeter={showPHMeter}
                        showTurbidityMeter={showTurbidityMeter}
                        showTDSMeter={showTDSMeter}
                        isAnimating={isAnimating}
                    />

                    {/* Meter Controls */}
                    <div className="grid grid-cols-3 gap-3">
                        <button
                            onClick={() => handleActivateMeter('ph')}
                            className={`p-4 rounded-lg border-2 transition-all ${showPHMeter
                                ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20'
                                : 'border-gray-300 dark:border-gray-600 hover:border-blue-400'
                                }`}
                        >
                            <div className="text-sm font-semibold">pH Meter</div>
                            <div className="text-xs text-gray-500">Click to activate</div>
                        </button>
                        <button
                            onClick={() => handleActivateMeter('tds')}
                            className={`p-4 rounded-lg border-2 transition-all ${showTDSMeter
                                ? 'border-cyan-500 bg-cyan-50 dark:bg-cyan-900/20'
                                : 'border-gray-300 dark:border-gray-600 hover:border-cyan-400'
                                }`}
                        >
                            <div className="text-sm font-semibold">TDS Meter</div>
                            <div className="text-xs text-gray-500">Click to activate</div>
                        </button>
                        <button
                            onClick={() => handleActivateMeter('turbidity')}
                            className={`p-4 rounded-lg border-2 transition-all ${showTurbidityMeter
                                ? 'border-yellow-500 bg-yellow-50 dark:bg-yellow-900/20'
                                : 'border-gray-300 dark:border-gray-600 hover:border-yellow-400'
                                }`}
                        >
                            <div className="text-sm font-semibold">Turbidity Meter</div>
                            <div className="text-xs text-gray-500">Click to activate</div>
                        </button>
                    </div>

                    {/* Real-time Chart */}
                    {dataHistory.length > 0 && (
                        <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg border border-gray-200 dark:border-gray-700">
                            <div className="flex items-center justify-between mb-4">
                                <h3 className="font-semibold text-lg flex items-center gap-2">
                                    <TrendingUp className="w-5 h-5" />
                                    Real-time Monitoring
                                </h3>
                                <button
                                    onClick={() => setIsMonitoring(!isMonitoring)}
                                    className={`flex items-center gap-2 px-3 py-1 rounded-lg ${isMonitoring
                                        ? 'bg-red-100 dark:bg-red-900/20 text-red-600'
                                        : 'bg-green-100 dark:bg-green-900/20 text-green-600'
                                        }`}
                                >
                                    {isMonitoring ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
                                    {isMonitoring ? 'Stop' : 'Start'}
                                </button>
                            </div>
                            <ResponsiveContainer width="100%" height={250}>
                                <LineChart data={chartData}>
                                    <CartesianGrid strokeDasharray="3 3" />
                                    <XAxis dataKey="time" tick={{ fontSize: 10 }} />
                                    <YAxis tick={{ fontSize: 10 }} />
                                    <Tooltip />
                                    <Legend />
                                    <Line type="monotone" dataKey="pH" stroke="#3b82f6" strokeWidth={2} dot={false} />
                                    <Line type="monotone" dataKey="Độ đục" stroke="#eab308" strokeWidth={2} dot={false} />
                                    <Line type="monotone" dataKey="DO" stroke="#10b981" strokeWidth={2} dot={false} />
                                </LineChart>
                            </ResponsiveContainer>
                        </div>
                    )}
                </div>

                {/* Right: Controls & Results */}
                <div className="space-y-4">
                    {/* Measurement Controls */}
                    <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg border border-gray-200 dark:border-gray-700">
                        <h3 className="font-semibold text-lg mb-4 flex items-center gap-2">
                            <FlaskConical className="w-5 h-5" />
                            Điều chỉnh thông số
                        </h3>

                        <div className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium mb-2">
                                    pH Level
                                </label>
                                <input
                                    type="range"
                                    min="0"
                                    max="14"
                                    step="0.1"
                                    value={measurements.ph}
                                    onChange={(e) => handleMeasurementChange('ph', parseFloat(e.target.value))}
                                    className="w-full"
                                />
                                <div className="flex justify-between text-xs text-gray-500 mt-1">
                                    <span>Acid</span>
                                    <span className="font-bold text-base text-gray-900 dark:text-white">{measurements.ph.toFixed(1)}</span>
                                    <span>Kiềm</span>
                                </div>
                            </div>

                            <div>
                                <label className="block text-sm font-medium mb-2">
                                    Độ đục (NTU)
                                </label>
                                <input
                                    type="range"
                                    min="0"
                                    max="100"
                                    step="0.5"
                                    value={measurements.turbidity}
                                    onChange={(e) => handleMeasurementChange('turbidity', parseFloat(e.target.value))}
                                    className="w-full"
                                />
                                <div className="flex justify-between text-xs text-gray-500 mt-1">
                                    <span>Trong</span>
                                    <span className="font-bold text-base text-gray-900 dark:text-white">{measurements.turbidity.toFixed(1)}</span>
                                    <span>Đục</span>
                                </div>
                            </div>

                            <div>
                                <label className="block text-sm font-medium mb-2">
                                    TDS (ppm)
                                </label>
                                <input
                                    type="range"
                                    min="0"
                                    max="2000"
                                    step="10"
                                    value={measurements.tds}
                                    onChange={(e) => handleMeasurementChange('tds', parseFloat(e.target.value))}
                                    className="w-full"
                                />
                                <div className="flex justify-between text-xs text-gray-500 mt-1">
                                    <span>0</span>
                                    <span className="font-bold text-base text-gray-900 dark:text-white">{measurements.tds}</span>
                                    <span>2000</span>
                                </div>
                            </div>

                            <div>
                                <label className="block text-sm font-medium mb-2">
                                    Nhiệt độ (°C)
                                </label>
                                <input
                                    type="range"
                                    min="0"
                                    max="40"
                                    step="0.5"
                                    value={measurements.temperature}
                                    onChange={(e) => handleMeasurementChange('temperature', parseFloat(e.target.value))}
                                    className="w-full"
                                />
                                <div className="text-center font-bold text-base text-gray-900 dark:text-white mt-1">
                                    {measurements.temperature.toFixed(1)}°C
                                </div>
                            </div>

                            <div>
                                <label className="block text-sm font-medium mb-2">
                                    Oxy hòa tan (mg/L)
                                </label>
                                <input
                                    type="range"
                                    min="0"
                                    max="15"
                                    step="0.1"
                                    value={measurements.dissolvedOxygen}
                                    onChange={(e) => handleMeasurementChange('dissolvedOxygen', parseFloat(e.target.value))}
                                    className="w-full"
                                />
                                <div className="text-center font-bold text-base text-gray-900 dark:text-white mt-1">
                                    {measurements.dissolvedOxygen.toFixed(1)} mg/L
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Results */}
                    {result && (
                        <div className={`rounded-xl p-6 shadow-lg border-2 ${result.classification === 'Excellent' ? 'border-green-500 bg-green-50 dark:bg-green-900/20' :
                            result.classification === 'Good' ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20' :
                                result.classification === 'Fair' ? 'border-yellow-500 bg-yellow-50 dark:bg-yellow-900/20' :
                                    'border-red-500 bg-red-50 dark:bg-red-900/20'
                            }`}>
                            <h3 className="font-bold text-xl mb-3">Kết quả phân tích</h3>

                            <div className="space-y-2 mb-4">
                                <div className="flex justify-between">
                                    <span>Đánh giá:</span>
                                    <span className="font-bold">{result.classificationVI}</span>
                                </div>
                                <div className="flex justify-between">
                                    <span>Điểm số:</span>
                                    <span className="font-bold">{result.overallScore}/100</span>
                                </div>
                                <div className="flex justify-between">
                                    <span>Có thể uống:</span>
                                    <span className="font-bold">{result.potable ? '✓ CÓ' : '✗ KHÔNG'}</span>
                                </div>
                            </div>

                            <div className="border-t border-gray-300 dark:border-gray-600 pt-3 mt-3">
                                <h4 className="font-semibold mb-2 text-sm">Khuyến nghị:</h4>
                                <ul className="text-sm space-y-1">
                                    {result.recommendations.map((rec, idx) => (
                                        <li key={idx} className="flex gap-2">
                                            <span>•</span>
                                            <span>{rec}</span>
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
