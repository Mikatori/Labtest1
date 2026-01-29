// Water quality calculation utilities

export interface WaterQualityData {
    ph: number;
    turbidity: number;
    tds: number;
    temperature: number;
    dissolvedOxygen: number;
    timestamp: number;
}

export interface WaterQualityResult {
    overallScore: number;
    classification: 'Excellent' | 'Good' | 'Fair' | 'Poor' | 'Very Poor';
    classificationVI: string;
    parameters: {
        ph: ParameterResult;
        turbidity: ParameterResult;
        tds: ParameterResult;
        dissolvedOxygen: ParameterResult;
    };
    recommendations: string[];
    potable: boolean;
}

interface ParameterResult {
    value: number;
    status: 'Optimal' | 'Acceptable' | 'Marginal' | 'Poor';
    statusVI: string;
    score: number;
    range: string;
}

// Calculate pH status and score
function evaluatePH(ph: number): ParameterResult {
    let status: ParameterResult['status'];
    let statusVI: string;
    let score: number;

    if (ph >= 6.5 && ph <= 8.5) {
        status = 'Optimal';
        statusVI = 'Tối ưu';
        score = 100;
    } else if ((ph >= 6.0 && ph < 6.5) || (ph > 8.5 && ph <= 9.0)) {
        status = 'Acceptable';
        statusVI = 'Chấp nhận được';
        score = 75;
    } else if ((ph >= 5.5 && ph < 6.0) || (ph > 9.0 && ph <= 9.5)) {
        status = 'Marginal';
        statusVI = 'Biên';
        score = 50;
    } else {
        status = 'Poor';
        statusVI = 'Kém';
        score = 25;
    }

    return {
        value: ph,
        status,
        statusVI,
        score,
        range: '6.5 - 8.5 (optimal)'
    };
}

// Calculate turbidity status
function evaluateTurbidity(turbidity: number): ParameterResult {
    let status: ParameterResult['status'];
    let statusVI: string;
    let score: number;

    if (turbidity < 1) {
        status = 'Optimal';
        statusVI = 'Tối ưu';
        score = 100;
    } else if (turbidity < 5) {
        status = 'Acceptable';
        statusVI = 'Chấp nhận được';
        score = 85;
    } else if (turbidity < 25) {
        status = 'Marginal';
        statusVI = 'Biên';
        score = 60;
    } else {
        status = 'Poor';
        statusVI = 'Kém';
        score = 30;
    }

    return {
        value: turbidity,
        status,
        statusVI,
        score,
        range: '< 5 NTU (drinking water)'
    };
}

// Calculate TDS status
function evaluateTDS(tds: number): ParameterResult {
    let status: ParameterResult['status'];
    let statusVI: string;
    let score: number;

    if (tds < 300) {
        status = 'Optimal';
        statusVI = 'Tối ưu';
        score = 100;
    } else if (tds < 600) {
        status = 'Acceptable';
        statusVI = 'Chấp nhận được';
        score = 80;
    } else if (tds < 1000) {
        status = 'Marginal';
        statusVI = 'Biên';
        score = 55;
    } else {
        status = 'Poor';
        statusVI = 'Kém';
        score = 25;
    }

    return {
        value: tds,
        status,
        statusVI,
        score,
        range: '< 600 ppm (good)'
    };
}

// Calculate Dissolved Oxygen status
function evaluateDO(dissolvedOxygen: number): ParameterResult {
    let status: ParameterResult['status'];
    let statusVI: string;
    let score: number;

    if (dissolvedOxygen >= 8) {
        status = 'Optimal';
        statusVI = 'Tối ưu';
        score = 100;
    } else if (dissolvedOxygen >= 6) {
        status = 'Acceptable';
        statusVI = 'Chấp nhận được';
        score = 80;
    } else if (dissolvedOxygen >= 4) {
        status = 'Marginal';
        statusVI = 'Biên';
        score = 50;
    } else {
        status = 'Poor';
        statusVI = 'Kém';
        score = 20;
    }

    return {
        value: dissolvedOxygen,
        status,
        statusVI,
        score,
        range: '>= 6 mg/L (healthy)'
    };
}

// Generate recommendations based on results
function generateRecommendations(data: WaterQualityData, results: WaterQualityResult): string[] {
    const recommendations: string[] = [];

    if (results.parameters.ph.status !== 'Optimal') {
        if (data.ph < 6.5) {
            recommendations.push('pH quá thấp (acid). Cần trung hòa bằng vôi hoặc natri bicarbonate.');
        } else {
            recommendations.push('pH quá cao (kiềm). Cần điều chỉnh bằng acid citric hoặc giấm.');
        }
    }

    if (results.parameters.turbidity.status !== 'Optimal') {
        recommendations.push('Độ đục cao. Yêu cầu lọc qua cát, than hoạt tính hoặc màng lọc.');
    }

    if (results.parameters.tds.status !== 'Optimal') {
        if (data.tds > 600) {
            recommendations.push('TDS cao. Cân nhắc sử dụng hệ thống lọc RO (Reverse Osmosis).');
        }
    }

    if (results.parameters.dissolvedOxygen.status === 'Poor') {
        recommendations.push('Oxy hòa tan thấp. Cần sục khí hoặc kiểm tra nguồn ô nhiễm hữu cơ.');
    }

    if (results.potable) {
        recommendations.push('✓ Nước đạt tiêu chuẩn sử dụng.');
    } else {
        recommendations.push('⚠ Nước KHÔNG đạt tiêu chuẩn uống. Cần xử lý trước khi sử dụng.');
    }

    return recommendations;
}

// Main calculation function
export function calculateWaterQuality(data: WaterQualityData): WaterQualityResult {
    const phResult = evaluatePH(data.ph);
    const turbidityResult = evaluateTurbidity(data.turbidity);
    const tdsResult = evaluateTDS(data.tds);
    const doResult = evaluateDO(data.dissolvedOxygen);

    // Calculate weighted overall score
    const overallScore = (
        phResult.score * 0.3 +
        turbidityResult.score * 0.25 +
        tdsResult.score * 0.2 +
        doResult.score * 0.25
    );

    // Determine classification
    let classification: WaterQualityResult['classification'];
    let classificationVI: string;

    if (overallScore >= 90) {
        classification = 'Excellent';
        classificationVI = 'Xuất sắc';
    } else if (overallScore >= 75) {
        classification = 'Good';
        classificationVI = 'Tốt';
    } else if (overallScore >= 60) {
        classification = 'Fair';
        classificationVI = 'Trung bình';
    } else if (overallScore >= 40) {
        classification = 'Poor';
        classificationVI = 'Kém';
    } else {
        classification = 'Very Poor';
        classificationVI = 'Rất kém';
    }

    // Determine if water is potable
    const potable = (
        phResult.status === 'Optimal' || phResult.status === 'Acceptable'
    ) && (
            turbidityResult.status === 'Optimal' || turbidityResult.status === 'Acceptable'
        ) && (
            tdsResult.status === 'Optimal' || tdsResult.status === 'Acceptable'
        );

    const result: WaterQualityResult = {
        overallScore: Math.round(overallScore),
        classification,
        classificationVI,
        parameters: {
            ph: phResult,
            turbidity: turbidityResult,
            tds: tdsResult,
            dissolvedOxygen: doResult
        },
        potable,
        recommendations: []
    };

    result.recommendations = generateRecommendations(data, result);

    return result;
}

// Format data for chart display
export function formatDataForChart(history: WaterQualityData[]) {
    return history.map(data => ({
        time: new Date(data.timestamp).toLocaleTimeString('vi-VN', {
            hour: '2-digit',
            minute: '2-digit',
            second: '2-digit'
        }),
        pH: data.ph,
        'Độ đục': data.turbidity,
        TDS: data.tds / 10, // Scale down for visibility
        DO: data.dissolvedOxygen
    }));
}
