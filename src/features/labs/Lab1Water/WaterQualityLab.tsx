import { useState } from 'react';
import { ArrowLeft, FlaskConical, AlertCircle, CheckCircle } from 'lucide-react';
import { Link } from 'react-router-dom';
import WaterLabScene from './WaterLabScene';

interface MeasurementData {
    ph: number;
    turbidity: number;
    temperature: number;
    dissolvedOxygen: number;
}

const STEPS = [
    'Chuẩn bị mẫu nước để kiểm tra',
    'Đo độ pH của mẫu nước',
    'Đo độ đục (Turbidity) của nước',
    'Đo nhiệt độ và oxy hòa tan',
    'Phân tích kết quả và đánh giá chất lượng nước'
];

export default function WaterQualityLab() {
    const [currentStep, setCurrentStep] = useState(0);
    const [measurements, setMeasurements] = useState<MeasurementData>({
        ph: 7.0,
        turbidity: 5,
        temperature: 25,
        dissolvedOxygen: 8
    });
    const [showQuiz, setShowQuiz] = useState(false);
    const [quizAnswers, setQuizAnswers] = useState<number[]>([]);
    const [showResults, setShowResults] = useState(false);

    const handleMeasurement = (key: keyof MeasurementData, value: number) => {
        setMeasurements(prev => ({ ...prev, [key]: value }));
    };

    const getWaterQuality = () => {
        const { ph, turbidity, dissolvedOxygen } = measurements;

        if (ph >= 6.5 && ph <= 8.5 && turbidity < 5 && dissolvedOxygen >= 6) {
            return { status: 'Tốt', color: 'text-green-600 dark:text-green-400', icon: CheckCircle };
        } else if (ph >= 6 && ph <= 9 && turbidity < 10 && dissolvedOxygen >= 4) {
            return { status: 'Trung bình', color: 'text-yellow-600 dark:text-yellow-400', icon: AlertCircle };
        } else {
            return { status: 'Kém', color: 'text-red-600 dark:text-red-400', icon: AlertCircle };
        }
    };

    const quality = getWaterQuality();
    const QualityIcon = quality.icon;

    const quizQuestions = [
        {
            question: 'Khoảng pH lý tưởng cho nước uống là?',
            options: ['3.0 - 5.0', '6.5 - 8.5', '9.0 - 11.0', '12.0 - 14.0'],
            correct: 1
        },
        {
            question: 'Độ đục cao trong nước thường chỉ ra điều gì?',
            options: [
                'Nước rất sạch',
                'Có nhiều khoáng chất tốt',
                'Có nhiều hạt lơ lửng và vi sinh vật',
                'Nước lạnh'
            ],
            correct: 2
        },
        {
            question: 'Oxy hòa tan (DO) quan trọng vì?',
            options: [
                'Giúp nước có vị ngon',
                'Cần thiết cho sinh vật dưới nước sống',
                'Làm nước trong hơn',
                'Giúp nước nóng nhanh hơn'
            ],
            correct: 1
        }
    ];

    const handleQuizSubmit = () => {
        setShowResults(true);
    };

    const correctAnswers = quizAnswers.filter((ans, idx) => ans === quizQuestions[idx].correct).length;

    return (
        <div className="max-w-7xl mx-auto space-y-6">
            {/* Header */}
            <div className="flex items-center justify-between">
                <Link to="/" className="flex items-center gap-2 text-gray-600 dark:text-gray-400 hover:text-primary-600 dark:hover:text-primary-400">
                    <ArrowLeft className="w-5 h-5" />
                    <span>Quay lại Dashboard</span>
                </Link>
                <div className="flex items-center gap-2 text-sm">
                    <FlaskConical className="w-4 h-4" />
                    <span className="text-gray-500">Bước {currentStep + 1}/{STEPS.length}</span>
                </div>
            </div>

            {/* Title */}
            <div>
                <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
                    Lab 1: Phân tích Chất lượng Nước
                </h1>
                <p className="text-gray-600 dark:text-gray-400">
                    Học cách đo và đánh giá các thông số chất lượng nước: pH, độ đục, nhiệt độ, và oxy hòa tan.
                </p>
            </div>

            {/* Progress Bar */}
            <div className="bg-gray-200 dark:bg-gray-700 h-2 rounded-full overflow-hidden">
                <div
                    className="bg-primary-600 h-full transition-all duration-300"
                    style={{ width: `${((currentStep + 1) / STEPS.length) * 100}%` }}
                />
            </div>

            {/* Main Content Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Left: 3D Scene */}
                <div className="space-y-4">
                    <WaterLabScene phLevel={measurements.ph} turbidity={measurements.turbidity} />

                    <div className={`p-4 rounded-lg border-2 ${quality.color.includes('green') ? 'border-green-500 bg-green-50 dark:bg-green-900/20' : quality.color.includes('yellow') ? 'border-yellow-500 bg-yellow-50 dark:bg-yellow-900/20' : 'border-red-500 bg-red-50 dark:bg-red-900/20'}`}>
                        <div className="flex items-center gap-2 font-semibold">
                            <QualityIcon className="w-5 h-5" />
                            <span className={quality.color}>Chất lượng nước: {quality.status}</span>
                        </div>
                    </div>
                </div>

                {/* Right: Controls & Instructions */}
                <div className="space-y-4">
                    {/* Current Step */}
                    <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-md border border-gray-200 dark:border-gray-700">
                        <h3 className="font-semibold text-lg mb-3 text-gray-900 dark:text-white">
                            Bước {currentStep + 1}: {STEPS[currentStep]}
                        </h3>

                        {currentStep === 0 && (
                            <p className="text-gray-600 dark:text-gray-400">
                                Chuẩn bị mẫu nước từ các nguồn khác nhau (ao, sông, nước máy).
                                Đảm bảo mẫu được lấy đúng cách và bảo quản trong bình sạch.
                            </p>
                        )}

                        {currentStep === 1 && (
                            <div className="space-y-4">
                                <label className="block">
                                    <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Độ pH</span>
                                    <input
                                        type="range"
                                        min="0"
                                        max="14"
                                        step="0.1"
                                        value={measurements.ph}
                                        onChange={(e) => handleMeasurement('ph', parseFloat(e.target.value))}
                                        className="w-full mt-2"
                                    />
                                    <div className="flex justify-between text-xs text-gray-500 mt-1">
                                        <span>Acid (0)</span>
                                        <span className="font-semibold text-lg">{measurements.ph.toFixed(1)}</span>
                                        <span>Kiềm (14)</span>
                                    </div>
                                </label>
                                <p className="text-sm text-gray-600 dark:text-gray-400">
                                    Sử dụng máy đo pH để xác định tính acid/kiềm của nước.
                                    Nước uống an toàn thường có pH từ 6.5 đến 8.5.
                                </p>
                            </div>
                        )}

                        {currentStep === 2 && (
                            <div className="space-y-4">
                                <label className="block">
                                    <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                                        Độ đục (NTU - Nephelometric Turbidity Units)
                                    </span>
                                    <input
                                        type="range"
                                        min="0"
                                        max="100"
                                        step="0.5"
                                        value={measurements.turbidity}
                                        onChange={(e) => handleMeasurement('turbidity', parseFloat(e.target.value))}
                                        className="w-full mt-2"
                                    />
                                    <div className="flex justify-between text-xs text-gray-500 mt-1">
                                        <span>Trong (0)</span>
                                        <span className="font-semibold text-lg">{measurements.turbidity.toFixed(1)} NTU</span>
                                        <span>Đục (100)</span>
                                    </div>
                                </label>
                                <p className="text-sm text-gray-600 dark:text-gray-400">
                                    Độ đục đo lượng hạt lơ lửng trong nước. Độ đục cao có thể chỉ ra ô nhiễm hoặc nhiều vi sinh vật.
                                </p>
                            </div>
                        )}

                        {currentStep === 3 && (
                            <div className="space-y-4">
                                <label className="block">
                                    <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Nhiệt độ (°C)</span>
                                    <input
                                        type="range"
                                        min="0"
                                        max="40"
                                        step="0.5"
                                        value={measurements.temperature}
                                        onChange={(e) => handleMeasurement('temperature', parseFloat(e.target.value))}
                                        className="w-full mt-2"
                                    />
                                    <div className="flex justify-between text-xs text-gray-500 mt-1">
                                        <span>0°C</span>
                                        <span className="font-semibold text-lg">{measurements.temperature.toFixed(1)}°C</span>
                                        <span>40°C</span>
                                    </div>
                                </label>

                                <label className="block">
                                    <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                                        Oxy hòa tan (mg/L)
                                    </span>
                                    <input
                                        type="range"
                                        min="0"
                                        max="15"
                                        step="0.1"
                                        value={measurements.dissolvedOxygen}
                                        onChange={(e) => handleMeasurement('dissolvedOxygen', parseFloat(e.target.value))}
                                        className="w-full mt-2"
                                    />
                                    <div className="flex justify-between text-xs text-gray-500 mt-1">
                                        <span>0</span>
                                        <span className="font-semibold text-lg">{measurements.dissolvedOxygen.toFixed(1)} mg/L</span>
                                        <span>15</span>
                                    </div>
                                </label>
                                <p className="text-sm text-gray-600 dark:text-gray-400">
                                    Oxy hòa tan (DO) cần thiết cho sự sống của sinh vật dưới nước. Mức DO ≥ 6 mg/L được coi là tốt.
                                </p>
                            </div>
                        )}

                        {currentStep === 4 && (
                            <div className="space-y-3">
                                <div className="grid grid-cols-2 gap-3 text-sm">
                                    <div className="bg-gray-50 dark:bg-gray-700 p-3 rounded-lg">
                                        <div className="text-gray-500 dark:text-gray-400">pH</div>
                                        <div className="text-lg font-semibold">{measurements.ph.toFixed(1)}</div>
                                    </div>
                                    <div className="bg-gray-50 dark:bg-gray-700 p-3 rounded-lg">
                                        <div className="text-gray-500 dark:text-gray-400">Độ đục</div>
                                        <div className="text-lg font-semibold">{measurements.turbidity.toFixed(1)} NTU</div>
                                    </div>
                                    <div className="bg-gray-50 dark:bg-gray-700 p-3 rounded-lg">
                                        <div className="text-gray-500 dark:text-gray-400">Nhiệt độ</div>
                                        <div className="text-lg font-semibold">{measurements.temperature.toFixed(1)}°C</div>
                                    </div>
                                    <div className="bg-gray-50 dark:bg-gray-700 p-3 rounded-lg">
                                        <div className="text-gray-500 dark:text-gray-400">DO</div>
                                        <div className="text-lg font-semibold">{measurements.dissolvedOxygen.toFixed(1)} mg/L</div>
                                    </div>
                                </div>
                                <p className="text-sm text-gray-600 dark:text-gray-400">
                                    Dựa trên các thông số đo được, chất lượng nước được đánh giá là <strong className={quality.color}>{quality.status}</strong>.
                                </p>
                            </div>
                        )}
                    </div>

                    {/* Navigation Buttons */}
                    <div className="flex gap-3">
                        {currentStep > 0 && (
                            <button
                                onClick={() => setCurrentStep(prev => prev - 1)}
                                className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                            >
                                Quay lại
                            </button>
                        )}
                        {currentStep < STEPS.length - 1 ? (
                            <button
                                onClick={() => setCurrentStep(prev => prev + 1)}
                                className="flex-1 px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors"
                            >
                                Tiếp theo
                            </button>
                        ) : (
                            <button
                                onClick={() => setShowQuiz(true)}
                                className="flex-1 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
                            >
                                Làm bài kiểm tra
                            </button>
                        )}
                    </div>
                </div>
            </div>

            {/* Quiz Modal */}
            {showQuiz && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
                    <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 max-w-2xl w-full max-h-[90vh] overflow-y-auto">
                        <h2 className="text-2xl font-bold mb-4 text-gray-900 dark:text-white">
                            Quiz: Kiểm tra hiểu biết
                        </h2>

                        {!showResults ? (
                            <div className="space-y-6">
                                {quizQuestions.map((q, idx) => (
                                    <div key={idx} className="space-y-2">
                                        <p className="font-semibold text-gray-900 dark:text-white">
                                            {idx + 1}. {q.question}
                                        </p>
                                        <div className="space-y-2">
                                            {q.options.map((opt, optIdx) => (
                                                <label key={optIdx} className="flex items-center gap-2 cursor-pointer">
                                                    <input
                                                        type="radio"
                                                        name={`question-${idx}`}
                                                        checked={quizAnswers[idx] === optIdx}
                                                        onChange={() => {
                                                            const newAnswers = [...quizAnswers];
                                                            newAnswers[idx] = optIdx;
                                                            setQuizAnswers(newAnswers);
                                                        }}
                                                        className="text-primary-600"
                                                    />
                                                    <span className="text-gray-700 dark:text-gray-300">{opt}</span>
                                                </label>
                                            ))}
                                        </div>
                                    </div>
                                ))}

                                <div className="flex gap-3 pt-4">
                                    <button
                                        onClick={() => setShowQuiz(false)}
                                        className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700"
                                    >
                                        Đóng
                                    </button>
                                    <button
                                        onClick={handleQuizSubmit}
                                        disabled={quizAnswers.length !== quizQuestions.length}
                                        className="flex-1 px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 disabled:opacity-50 disabled:cursor-not-allowed"
                                    >
                                        Nộp bài
                                    </button>
                                </div>
                            </div>
                        ) : (
                            <div className="space-y-4">
                                <div className="text-center p-6 bg-primary-50 dark:bg-primary-900/20 rounded-lg">
                                    <div className="text-4xl font-bold text-primary-600 dark:text-primary-400">
                                        {correctAnswers}/{quizQuestions.length}
                                    </div>
                                    <p className="text-gray-600 dark:text-gray-400 mt-2">
                                        Số câu trả lời đúng
                                    </p>
                                </div>

                                {quizQuestions.map((q, idx) => (
                                    <div key={idx} className={`p-4 rounded-lg border-2 ${quizAnswers[idx] === q.correct ? 'border-green-500 bg-green-50 dark:bg-green-900/20' : 'border-red-500 bg-red-50 dark:bg-red-900/20'}`}>
                                        <p className="font-semibold">{q.question}</p>
                                        <p className="text-sm mt-1">
                                            Đáp án đúng: <span className="text-green-600 dark:text-green-400">{q.options[q.correct]}</span>
                                        </p>
                                    </div>
                                ))}

                                <button
                                    onClick={() => {
                                        setShowQuiz(false);
                                        setShowResults(false);
                                        setQuizAnswers([]);
                                    }}
                                    className="w-full px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700"
                                >
                                    Hoàn thành
                                </button>
                            </div>
                        )}
                    </div>
                </div>
            )}
        </div>
    );
}
