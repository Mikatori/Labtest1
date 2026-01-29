import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls, Environment, Cylinder, Box, Text, Sphere, Cone } from '@react-three/drei';
import { useRef } from 'react';
import * as THREE from 'three';

interface EnhancedWaterLabSceneProps {
    phLevel: number;
    turbidity: number;
    tds: number;
    showPHMeter: boolean;
    showTurbidityMeter: boolean;
    showTDSMeter: boolean;
    isAnimating: boolean;
}

// Animated pH Meter Probe
function PHMeterProbe({ phLevel, isVisible, isAnimating }: { phLevel: number; isVisible: boolean; isAnimating: boolean }) {
    const probeRef = useRef<THREE.Group>(null);

    useFrame(() => {
        if (isAnimating && probeRef.current && isVisible) {
            // Animate probe going into water
            if (probeRef.current.position.y > 0.5) {
                probeRef.current.position.y -= 0.05;
            }
        } else if (!isAnimating && probeRef.current && probeRef.current.position.y < 3) {
            // Animate probe going up
            probeRef.current.position.y += 0.05;
        }
    });

    if (!isVisible) return null;

    return (
        <group ref={probeRef} position={[1.5, 3, 0]}>
            {/* Probe handle */}
            <Box args={[0.3, 0.8, 0.2]} position={[0, 0, 0]}>
                <meshStandardMaterial color="#333333" />
            </Box>

            {/* Display screen */}
            <Box args={[0.28, 0.4, 0.05]} position={[0, 0, 0.11]}>
                <meshStandardMaterial color="#000000" />
            </Box>

            {/* pH reading */}
            <Text
                position={[0, 0, 0.14]}
                fontSize={0.12}
                color="#00ff00"
                anchorX="center"
                anchorY="middle"
            >
                pH: {phLevel.toFixed(1)}
            </Text>

            {/* Probe shaft */}
            <Cylinder args={[0.03, 0.03, 2.5, 16]} position={[0, -1.6, 0]}>
                <meshStandardMaterial color="#666666" metalness={0.8} />
            </Cylinder>

            {/* Probe tip */}
            <Cone args={[0.05, 0.15, 16]} position={[0, -2.95, 0]} rotation={[Math.PI, 0, 0]}>
                <meshStandardMaterial color="#888888" />
            </Cone>
        </group>
    );
}

// TDS Meter
function TDSMeter({ tds, isVisible, isAnimating }: { tds: number; isVisible: boolean; isAnimating: boolean }) {
    const meterRef = useRef<THREE.Group>(null);

    useFrame(() => {
        if (isAnimating && meterRef.current && isVisible) {
            if (meterRef.current.position.y > 0.5) {
                meterRef.current.position.y -= 0.05;
            }
        } else if (!isAnimating && meterRef.current && meterRef.current.position.y < 3) {
            meterRef.current.position.y += 0.05;
        }
    });

    if (!isVisible) return null;

    return (
        <group ref={meterRef} position={[-1.5, 3, 0]}>
            <Box args={[0.25, 0.7, 0.15]}>
                <meshStandardMaterial color="#1a1a1a" />
            </Box>
            <Text
                position={[0, 0, 0.09]}
                fontSize={0.08}
                color="#00ddff"
                anchorX="center"
                anchorY="middle"
            >
                {tds.toFixed(0)} ppm
            </Text>
            <Cylinder args={[0.02, 0.02, 2.2, 12]} position={[0, -1.45, 0]}>
                <meshStandardMaterial color="#555555" />
            </Cylinder>
        </group>
    );
}

// Turbidity Meter (light beam visualization)
function TurbidityMeter({ turbidity, isVisible }: { turbidity: number; isVisible: boolean }) {
    if (!isVisible) return null;

    return (
        <group position={[0, 0, 1.5]}>
            {/* Light source */}
            <Sphere args={[0.1, 16, 16]} position={[0, 0.5, 0]}>
                <meshStandardMaterial color="#ffff00" emissive="#ffff00" emissiveIntensity={2} />
            </Sphere>

            {/* Light beam through water */}
            <Cylinder
                args={[0.15, 0.15, 2, 16, 1, true]}
                position={[0, -0.5, 0]}
                rotation={[0, 0, 0]}
            >
                <meshStandardMaterial
                    color="#ffff88"
                    transparent
                    opacity={Math.max(0.1, 0.7 - turbidity / 100)}
                    emissive="#ffff88"
                    emissiveIntensity={0.5}
                />
            </Cylinder>

            {/* Detector */}
            <Box args={[0.3, 0.15, 0.15]} position={[0, -1.6, 0]}>
                <meshStandardMaterial color="#222222" />
            </Box>

            <Text
                position={[0, -1.6, 0.1]}
                fontSize={0.06}
                color="#ff6600"
                anchorX="center"
                anchorY="middle"
            >
                {turbidity.toFixed(1)} NTU
            </Text>
        </group>
    );
}

// Main Water Sample with animated water level
function WaterSample({ phLevel, turbidity, tds }: { phLevel: number; turbidity: number; tds: number }) {
    const waterRef = useRef<THREE.Mesh>(null);

    useFrame((state) => {
        if (waterRef.current) {
            // Gentle wave animation
            waterRef.current.position.y = -0.1 + Math.sin(state.clock.elapsedTime * 0.5) * 0.02;
        }
    });

    // Color based on pH
    const waterColor = new THREE.Color();
    if (phLevel < 6) {
        waterColor.setRGB(1, 0.3 + (phLevel / 6) * 0.3, 0.3);
    } else if (phLevel > 8) {
        waterColor.setRGB(0.3, 1, 0.3 + ((phLevel - 8) / 6) * 0.3);
    } else {
        waterColor.setRGB(0.3, 0.5 + (phLevel - 6) * 0.1, 1);
    }

    // Opacity based on turbidity and TDS
    const opacity = Math.max(0.3, 1 - (turbidity / 100) - (tds / 1000));

    return (
        <group position={[0, 0, 0]}>
            {/* Glass beaker */}
            <Cylinder args={[1, 1, 3, 32, 1, true]} position={[0, 0, 0]}>
                <meshPhysicalMaterial
                    color="#ffffff"
                    transparent
                    opacity={0.15}
                    roughness={0.05}
                    metalness={0}
                    clearcoat={1}
                    clearcoatRoughness={0.1}
                />
            </Cylinder>

            {/* Measurement markings */}
            {[...Array(5)].map((_, i) => (
                <group key={i} position={[0, -1.2 + i * 0.6, 0]}>
                    <Text
                        position={[1.1, 0, 0]}
                        fontSize={0.1}
                        color="#666666"
                        anchorX="left"
                    >
                        {(i + 1) * 100}ml
                    </Text>
                </group>
            ))}

            {/* Water inside */}
            <Cylinder ref={waterRef} args={[0.95, 0.95, 2.8, 32]} position={[0, -0.1, 0]}>
                <meshPhysicalMaterial
                    color={waterColor}
                    transparent
                    opacity={opacity}
                    roughness={0.1}
                    metalness={0.05}
                    transmission={0.9}
                    thickness={0.5}
                />
            </Cylinder>

            {/* Suspended particles (based on turbidity) */}
            {Array.from({ length: Math.min(30, Math.floor(turbidity / 2)) }).map((_, i) => (
                <Sphere
                    key={i}
                    args={[0.02, 8, 8]}
                    position={[
                        (Math.random() - 0.5) * 1.8,
                        (Math.random() - 0.5) * 2.6,
                        (Math.random() - 0.5) * 1.8
                    ]}
                >
                    <meshStandardMaterial color="#8b7355" opacity={0.6} transparent />
                </Sphere>
            ))}

            {/* Base platform */}
            <Cylinder args={[1.5, 1.5, 0.2, 32]} position={[0, -1.7, 0]}>
                <meshStandardMaterial color="#2c2c2c" metalness={0.6} roughness={0.3} />
            </Cylinder>

            {/* Lab table */}
            <Box args={[4, 0.1, 3]} position={[0, -2.5, 0]}>
                <meshStandardMaterial color="#8b8b8b" />
            </Box>
        </group>
    );
}

function Lighting() {
    return (
        <>
            <ambientLight intensity={0.6} />
            <directionalLight position={[5, 5, 5]} intensity={1} castShadow />
            <pointLight position={[-5, 5, -5]} intensity={0.4} />
            <spotLight position={[0, 10, 0]} intensity={0.5} angle={0.3} penumbra={0.5} />
        </>
    );
}

export default function EnhancedWaterLabScene({
    phLevel,
    turbidity,
    tds,
    showPHMeter,
    showTurbidityMeter,
    showTDSMeter,
    isAnimating
}: EnhancedWaterLabSceneProps) {
    return (
        <div className="w-full h-[500px] rounded-xl overflow-hidden bg-gradient-to-b from-blue-50 to-blue-100 dark:from-gray-800 dark:to-gray-900 shadow-lg">
            <Canvas camera={{ position: [5, 3, 5], fov: 50 }} shadows>
                <Lighting />
                <WaterSample phLevel={phLevel} turbidity={turbidity} tds={tds} />
                <PHMeterProbe phLevel={phLevel} isVisible={showPHMeter} isAnimating={isAnimating} />
                <TDSMeter tds={tds} isVisible={showTDSMeter} isAnimating={isAnimating} />
                <TurbidityMeter turbidity={turbidity} isVisible={showTurbidityMeter} />
                <OrbitControls
                    enableZoom={true}
                    maxDistance={12}
                    minDistance={3}
                    maxPolarAngle={Math.PI / 2}
                />
                <Environment preset="apartment" />
            </Canvas>
        </div>
    );
}
