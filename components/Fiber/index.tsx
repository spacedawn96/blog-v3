import { css } from '@emotion/react';
import * as THREE from 'three';
import { useRef, useState, useMemo, useEffect } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Text, TrackballControls } from '@react-three/drei';
import Link from 'next/link';

import randomWords from 'random-words';

const FiberBlock = css({});

function Word({ children, ...props }: any) {
  const color = new THREE.Color();
  const fontProps = {
    font: '/Inter-Bold.woff',
    fontSize: 2.5,
    letterSpacing: -0.05,
    lineHeight: 1,
    'material-toneMapped': false,
  };
  const ref = useRef();
  const [hovered, setHovered] = useState(false);
  const over = (e: { stopPropagation: () => any }) => (
    e.stopPropagation(), setHovered(true)
  );
  const out = () => setHovered(false);
  // Change the mouse cursor on hover
  useEffect(() => {
    if (hovered) document.body.style.cursor = 'pointer';
    return () => {
      document.body.style.cursor = 'auto';
    };
  }, [hovered]);
  // Tie component to the render-loop
  useFrame(({ camera }) => {
    // Make text face the camera
    (ref.current as any).quaternion.copy(camera.quaternion);
    // Animate font color
    (ref.current as any).material.color.lerp(
      color.set(hovered ? '#fa2720' : 'white'),
      0.1,
    );
  });
  return (
    <>
      <Text
        ref={ref}
        onPointerOver={over}
        onPointerOut={out}
        {...props}
        {...fontProps}
        children={children}
      />
    </>
  );
}

function Cloud({ count = 4, radius = 20 }: any) {
  // Create a count x count random words with spherical distribution
  const words = useMemo(() => {
    const temp = [];
    const spherical = new THREE.Spherical();
    const phiSpan = Math.PI / (count + 1);
    const thetaSpan = (Math.PI * 2) / count;
    for (let i = 1; i < count + 1; i++)
      // Taken from https://discourse.threejs.org/t/can-i-place-obects-on-a-sphere-surface-evenly/4773/6
      for (let j = 0; j < count; j++)
        temp.push([
          new THREE.Vector3().setFromSpherical(
            spherical.set(radius, phiSpan * i, thetaSpan * j),
          ),
          randomWords(),
        ]);
    return temp;
  }, [count, radius]);
  return (
    <>
      {words.map(([pos, word], index) => (
        <>
          <Word key={index} position={pos} children={word} />
        </>
      ))}
    </>
  );
}

export default function Fiber() {
  return (
    <div css={FiberContainer}>
      <Canvas dpr={[1, 2]} camera={{ position: [0, 0, 35], fov: 90 }}>
        <fog attach="fog" args={['#202025', 0, 80]} />
        <Cloud count={8} radius={20} />
        <TrackballControls />
      </Canvas>
    </div>
  );
}

const FiberContainer = css({
  width: '32rem',
  height: '40rem',
  '@media (max-width: 1500px)': {
    display: 'none',
  },
});
