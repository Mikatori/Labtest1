import { Canvas } from '@react-three/fiber';
import { OrbitControls, Environment, Box, Sphere, Text } from '@react-three/drei';
import * as THREE from 'three';

interface AirLabSceneProps {
    co2Level: number;
    pm25: number;
    pm10: number;
}

function AirMonitor({ co2Level, pm25, pm10 }: { co2Level: number; pm25: number; pm10: number }) {
    // Color based on air quality
    const getAirQualityColor = () => {
        if (pm25 > 55 || co2Level > 1000) {
            return new THREE.Color(0xff4444); // Red - Poor
        } else if (pm25 > 35 || co2Level > 700) {
            return new THREE.Color(0xffaa00); // Orange - Moderate
        } else {
            return new THREE.Color(0x44ff44); // Green - Good
        }
    };

    const airColor = getAirQualityColor();

    return (
        <group position={[0, 0, 0]}>
            {/* Air Quality Monitor Device */}
            <Box args={[2, 2.5, 0.3]} position={[0, 0, 0]}>
                <meshStandardMaterial color="#333333" />
            </Box>

            {/* Display Screen */}
            <Box args={[1.8, 2.2, 0.1]} position={[0, 0, 0.2]}>
                <meshStandardMaterial color="#000000" />
            </Box>

            {/* CO2 Display */}
            <Text
                position={[0, 0.8, 0.25]}
                fontSize={0.12}
                color="#00ff00"
                anchorX="center"
                anchorY="middle"
            >
                CO2: {co2Level.toFixed(0)} ppm
            </Text>

            {/* PM2.5 Display */}
            <Text
                position={[0, 0.3, 0.25]}
                fontSize={0.12}
                color="#00ddff"
                anchorX="center"
                anchorY="middle"
            >
                PM2.5: {pm25.toFixed(1)} µg/m³
            </Text>

            {/* PM10 Display */}
            <Text
                position={[0, -0.2, 0.25]}
                fontSize={0.12}
                color="#ffaa00"
                anchorX="center"
                anchorY="middle"
            >
                PM10: {pm10.toFixed(1)} µg/m³
            </Text>

            {/* Air quality indicator light */}
            <Sphere args={[0.15, 32, 32]} position={[0, -0.8, 0.25]}>
                <meshStandardMaterial color={airColor} emissive={airColor} emissiveIntensity={2} />
            </Sphere>

            {/* Floating particles (visualization) */}
            {Array.from({ length: Math.min(20, Math.floor(pm25 / 2)) }).map((_, i) => (
                <Sphere
                    key={i}
                    args={[0.02, 8, 8]}
                    position={[
                        (Math.random() - 0.5) * 3,
                        (Math.random() - 0.5) * 3,
                        (Math.random() - 0.5) * 2
                    ]}
                >
                    <meshStandardMaterial color="#888888" opacity={0.5} transparent />
                </Sphere>
            ))}

            {/* Stand */}
            <Box args={[0.3, 1, 0.2]} position={[0, -1.8, 0]}>
                <meshStandardMaterial color="#444444" />
            </Box>
            <Box args={[1.5, 0.2, 1.5]} position={[0, -2.5, 0]}>
                <meshStandardMaterial color="#444444" />
            </Box>
        </group>
    );
}

function Lighting() {
    return (
        <>
            <ambientLight intensity={0.6} />
            <directionalLight position={[5, 5, 5]} intensity={1} />
            <pointLight position={[-5, 5, -5]} intensity={0.3} />
        </>
    );
}

export default function AirLabScene({ co2Level, pm25, pm10 }: AirLabSceneProps) {
    return (
        <div className="w-full h-[400px] rounded-xl overflow-hidden bg-gradient-to-b from-gray-100 to-gray-200 dark:from-gray-800 dark:to-gray-900">
            <Canvas camera={{ position: [4, 2, 4], fov: 50 }}>
                <Lighting />
                <AirMonitor co2Level={co2Level} pm25={pm25} pm10={pm10} />
                <OrbitControls enableZoom={true} maxDistance={10} minDistance={3} />
                <Environment preset="sunset" />
            </Canvas>
        </div>
    );
}
