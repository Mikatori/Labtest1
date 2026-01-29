import { Canvas } from '@react-three/fiber';
import { OrbitControls, Environment, Cylinder, Box, Text } from '@react-three/drei';
import * as THREE from 'three';

interface WaterLabSceneProps {
    phLevel: number;
    turbidity: number;
}

function WaterSample({ phLevel, turbidity }: { phLevel: number; turbidity: number }) {
    const waterColor = new THREE.Color();

    // pH affects water color: acidic (red), neutral (blue), alkaline (green)
    if (phLevel < 6) {
        waterColor.setRGB(1, 0.3, 0.3); // Acidic - reddish
    } else if (phLevel > 8) {
        waterColor.setRGB(0.3, 1, 0.3); // Alkaline - greenish
    } else {
        waterColor.setRGB(0.3, 0.5, 1); // Neutral - blueish
    }

    // Turbidity affects opacity
    const opacity = Math.max(0.3, 1 - (turbidity / 200));

    return (
        <group position={[0, 0, 0]}>
            {/* Beaker */}
            <Cylinder args={[1, 1, 3, 32, 1, true]} position={[0, 0, 0]}>
                <meshPhysicalMaterial
                    color="#ffffff"
                    transparent
                    opacity={0.2}
                    roughness={0.1}
                    metalness={0}
                    clearcoat={1}
                />
            </Cylinder>

            {/* Water inside */}
            <Cylinder args={[0.95, 0.95, 2.8, 32]} position={[0, -0.1, 0]}>
                <meshPhysicalMaterial
                    color={waterColor}
                    transparent
                    opacity={opacity}
                    roughness={0.2}
                    metalness={0.1}
                />
            </Cylinder>

            {/* pH Meter probe */}
            <group position={[0, 1.5, 0.5]}>
                <Cylinder args={[0.05, 0.05, 2, 8]} rotation={[0, 0, Math.PI / 6]}>
                    <meshStandardMaterial color="#666666" />
                </Cylinder>
                <Box args={[0.3, 0.5, 0.1]} position={[0, 1.5, 0]}>
                    <meshStandardMaterial color="#333333" />
                </Box>
                <Text
                    position={[0, 1.5, 0.06]}
                    fontSize={0.15}
                    color="#00ff00"
                    anchorX="center"
                    anchorY="middle"
                >
                    {phLevel.toFixed(1)}
                </Text>
            </group>

            {/* Base platform */}
            <Cylinder args={[1.5, 1.5, 0.2, 32]} position={[0, -1.7, 0]}>
                <meshStandardMaterial color="#444444" />
            </Cylinder>
        </group>
    );
}

function Lighting() {
    return (
        <>
            <ambientLight intensity={0.5} />
            <directionalLight position={[5, 5, 5]} intensity={1} castShadow />
            <pointLight position={[-5, 5, -5]} intensity={0.5} />
        </>
    );
}

export default function WaterLabScene({ phLevel, turbidity }: WaterLabSceneProps) {
    return (
        <div className="w-full h-[400px] rounded-xl overflow-hidden bg-gradient-to-b from-gray-100 to-gray-200 dark:from-gray-800 dark:to-gray-900">
            <Canvas camera={{ position: [4, 3, 4], fov: 50 }} shadows>
                <Lighting />
                <WaterSample phLevel={phLevel} turbidity={turbidity} />
                <OrbitControls enableZoom={true} maxDistance={10} minDistance={3} />
                <Environment preset="city" />
            </Canvas>
        </div>
    );
}
