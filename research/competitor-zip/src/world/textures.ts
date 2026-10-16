import * as THREE from 'three';

/**
 * Procedural texture generator for Lokoja Life 3D (The Confluence City).
 * 100% Canvas generated with SRGBColorSpace - zero external HTTP requests, zero 404s.
 */

function createTextureFromCanvas(canvas: HTMLCanvasElement, repeatX = 1, repeatY = 1): THREE.CanvasTexture {
  const tex = new THREE.CanvasTexture(canvas);
  tex.colorSpace = THREE.SRGBColorSpace;
  tex.wrapS = THREE.RepeatWrapping;
  tex.wrapT = THREE.RepeatWrapping;
  tex.repeat.set(repeatX, repeatY);
  tex.anisotropy = 8;
  return tex;
}

// 1. Asphalt Road Texture with Yellow dashed centerline and white edges
export function createRoadTexture(): THREE.CanvasTexture {
  const canvas = document.createElement('canvas');
  canvas.width = 512;
  canvas.height = 512;
  const ctx = canvas.getContext('2d')!;

  // Base asphalt
  ctx.fillStyle = '#242528';
  ctx.fillRect(0, 0, 512, 512);

  // Road grit
  for (let i = 0; i < 4000; i++) {
    const x = Math.random() * 512;
    const y = Math.random() * 512;
    const gray = Math.floor(25 + Math.random() * 25);
    ctx.fillStyle = `rgb(${gray}, ${gray}, ${gray})`;
    ctx.fillRect(x, y, 2, 2);
  }

  // White edge lines
  ctx.fillStyle = '#e5e7eb';
  ctx.fillRect(18, 0, 10, 512);
  ctx.fillRect(484, 0, 10, 512);

  // Yellow dashed center divider
  ctx.fillStyle = '#f59e0b';
  const dashHeight = 48;
  const gapHeight = 32;
  for (let y = 8; y < 512; y += dashHeight + gapHeight) {
    ctx.fillRect(251, y, 10, dashHeight);
  }

  return createTextureFromCanvas(canvas, 1, 6);
}

// 2. Lokoja Confluence City Bus Livery
export function createLokojaBusLiveryTexture(): THREE.CanvasTexture {
  const canvas = document.createElement('canvas');
  canvas.width = 512;
  canvas.height = 256;
  const ctx = canvas.getContext('2d')!;

  // Clean White upper & Green lower livery (Iconic Kogi / Northern commercial transit)
  ctx.fillStyle = '#ffffff';
  ctx.fillRect(0, 0, 512, 130);
  ctx.fillStyle = '#008751'; // Nigerian Green
  ctx.fillRect(0, 130, 512, 126);

  // Golden yellow speedline stripe
  ctx.fillStyle = '#f59e0b';
  ctx.fillRect(0, 120, 512, 14);

  // Route text painted on bus
  ctx.font = 'bold 24px system-ui, sans-serif';
  ctx.fillStyle = '#0f172a';
  ctx.fillText('NATACO • GANAJA • PATTI • FELELE', 40, 80);

  ctx.font = 'bold 18px monospace';
  ctx.fillStyle = '#ffffff';
  ctx.fillText('LOKOJA CONFLUENCE TRANSIT', 110, 180);
  ctx.font = '13px system-ui, sans-serif';
  ctx.fillText('FEDERAL CAPITAL LINK • SAFE JOURNEY', 115, 215);

  return createTextureFromCanvas(canvas, 1, 1);
}

// 3. Concrete & Administrative Building Facade
export function createColonialBrickTexture(): THREE.CanvasTexture {
  const canvas = document.createElement('canvas');
  canvas.width = 256;
  canvas.height = 256;
  const ctx = canvas.getContext('2d')!;

  // Warm terracotta colonial tone
  ctx.fillStyle = '#a2593b';
  ctx.fillRect(0, 0, 256, 256);

  ctx.strokeStyle = '#d7ba9d';
  ctx.lineWidth = 2;
  const brickH = 16;
  const brickW = 32;

  for (let y = 0; y < 256; y += brickH) {
    const offset = (y / brickH) % 2 === 0 ? 0 : 16;
    for (let x = -16; x < 256; x += brickW) {
      ctx.strokeRect(x + offset, y, brickW, brickH);
    }
  }

  return createTextureFromCanvas(canvas, 4, 4);
}

// 4. Sidewalk Pavers
export function createSidewalkTexture(): THREE.CanvasTexture {
  const canvas = document.createElement('canvas');
  canvas.width = 256;
  canvas.height = 256;
  const ctx = canvas.getContext('2d')!;

  ctx.fillStyle = '#9ca3af';
  ctx.fillRect(0, 0, 256, 256);

  ctx.strokeStyle = '#6b7280';
  ctx.lineWidth = 3;
  ctx.strokeRect(0, 0, 128, 128);
  ctx.strokeRect(128, 0, 128, 128);
  ctx.strokeRect(0, 128, 128, 128);
  ctx.strokeRect(128, 128, 128, 128);

  return createTextureFromCanvas(canvas, 6, 6);
}

// 5. Authentic Lokoja Billboards
export type LokojaBillboardType = 'kogi' | 'mount_patti' | 'confluence' | 'catfish' | 'nataco' | 'fulokoja';

export function createLokojaBillboardTexture(type: LokojaBillboardType): THREE.CanvasTexture {
  const canvas = document.createElement('canvas');
  canvas.width = 512;
  canvas.height = 256;
  const ctx = canvas.getContext('2d')!;

  if (type === 'kogi') {
    // Welcome to Kogi
    ctx.fillStyle = '#006837';
    ctx.fillRect(0, 0, 512, 256);
    ctx.fillStyle = '#fbbf24';
    ctx.font = 'bold 34px system-ui, sans-serif';
    ctx.fillText('WELCOME TO KOGI STATE', 30, 60);
    ctx.fillStyle = '#ffffff';
    ctx.font = 'italic bold 22px Georgia, serif';
    ctx.fillText('The Confluence State • Lokoja Capital', 30, 105);
    ctx.fillStyle = '#fef08a';
    ctx.font = '17px system-ui, sans-serif';
    ctx.fillText('Gateway Connecting North & South Nigeria', 30, 155);
    ctx.fillStyle = '#ffffff';
    ctx.font = 'bold 20px monospace';
    ctx.fillText('PEACE • TOURISM • COMMERCE', 30, 205);
  } else if (type === 'mount_patti') {
    // Mount Patti
    ctx.fillStyle = '#1e293b';
    ctx.fillRect(0, 0, 512, 256);
    ctx.fillStyle = '#38bdf8';
    ctx.font = 'bold 32px system-ui, sans-serif';
    ctx.fillText('MOUNT PATTI (458M)', 30, 58);
    ctx.fillStyle = '#fbbf24';
    ctx.font = 'bold 20px system-ui, sans-serif';
    ctx.fillText('Where Flora Shaw Coined "NIGERIA" (1897)', 30, 105);
    ctx.fillStyle = '#e2e8f0';
    ctx.font = '16px system-ui, sans-serif';
    ctx.fillText('Panoramic Confluence View & Lord Lugard Rest House', 30, 155);
    ctx.fillStyle = '#4ade80';
    ctx.font = 'bold 18px monospace';
    ctx.fillText('VISIT SUMMIT LOOKOUT TODAY!', 30, 205);
  } else if (type === 'confluence') {
    // Confluence of Niger and Benue
    ctx.fillStyle = '#0369a1';
    ctx.fillRect(0, 0, 512, 256);
    ctx.fillStyle = '#fef08a';
    ctx.font = 'bold 32px system-ui, sans-serif';
    ctx.fillText('THE GREAT CONFLUENCE', 30, 58);
    ctx.fillStyle = '#ffffff';
    ctx.font = 'bold 20px system-ui, sans-serif';
    ctx.fillText('River Niger Meets River Benue', 30, 105);
    ctx.fillStyle = '#bae6fd';
    ctx.font = '16px system-ui, sans-serif';
    ctx.fillText('Brownish Niger + Clear Teal Benue Flow Together', 30, 155);
    ctx.fillStyle = '#38bdf8';
    ctx.font = 'bold 18px monospace';
    ctx.fillText('CONFLUENCE BEACH RESORT & BOAT MARINA', 30, 205);
  } else if (type === 'catfish') {
    // Mama Halima Catfish
    ctx.fillStyle = '#78350f';
    ctx.fillRect(0, 0, 512, 256);
    ctx.fillStyle = '#fbbf24';
    ctx.font = 'bold 32px system-ui, sans-serif';
    ctx.fillText('MAMA HALIMA CATFISH SPOT', 30, 58);
    ctx.fillStyle = '#ffffff';
    ctx.font = 'bold 20px system-ui, sans-serif';
    ctx.fillText('Fresh River Niger Giant Catfish & Pepper Soup', 30, 105);
    ctx.fillStyle = '#fed7aa';
    ctx.font = '16px system-ui, sans-serif';
    ctx.fillText('Served with Hot Tuwo Shinkafa & Miyan Kuka', 30, 155);
    ctx.fillStyle = '#f97316';
    ctx.font = 'bold 22px monospace';
    ctx.fillText('FULL BOWL: ₦4,500 • ENERGY BOOST 100%', 30, 205);
  } else if (type === 'nataco') {
    // Nataco Interstate Terminal
    ctx.fillStyle = '#172554';
    ctx.fillRect(0, 0, 512, 256);
    ctx.fillStyle = '#fbbf24';
    ctx.font = 'bold 32px system-ui, sans-serif';
    ctx.fillText('NATACO INTERSTATE HUB', 30, 58);
    ctx.fillStyle = '#ffffff';
    ctx.font = 'bold 20px system-ui, sans-serif';
    ctx.fillText('Transit Crossroads of All Nigeria', 30, 105);
    ctx.fillStyle = '#93c5fd';
    ctx.font = '16px system-ui, sans-serif';
    ctx.fillText('Direct Buses: Abuja • Kaduna • Lagos • Port Harcourt', 30, 155);
    ctx.fillStyle = '#34d399';
    ctx.font = 'bold 20px monospace';
    ctx.fillText('EARN HIGH COMMUTER TRANSIT FARES', 30, 205);
  } else {
    // Federal University Lokoja (FULokoja)
    ctx.fillStyle = '#312e81';
    ctx.fillRect(0, 0, 512, 256);
    ctx.fillStyle = '#a5b4fc';
    ctx.font = 'bold 30px system-ui, sans-serif';
    ctx.fillText('FEDERAL UNIVERSITY LOKOJA', 30, 58);
    ctx.fillStyle = '#ffffff';
    ctx.font = '20px system-ui, sans-serif';
    ctx.fillText('Excellence in Research, Tech & Confluence Studies', 30, 105);
    ctx.fillStyle = '#fbbf24';
    ctx.font = 'bold 22px monospace';
    ctx.fillText('FELELE MAIN CAMPUS • LOKOJA', 30, 165);
    ctx.fillStyle = '#c7d2fe';
    ctx.font = '14px system-ui, sans-serif';
    ctx.fillText('Campus Shuttle Services Run Daily', 30, 210);
  }

  return createTextureFromCanvas(canvas, 1, 1);
}

// 6. Nigerian Flag Texture
export function createNigerianFlagTexture(): THREE.CanvasTexture {
  const canvas = document.createElement('canvas');
  canvas.width = 192;
  canvas.height = 96;
  const ctx = canvas.getContext('2d')!;

  ctx.fillStyle = '#008751';
  ctx.fillRect(0, 0, 64, 96);
  ctx.fillStyle = '#ffffff';
  ctx.fillRect(64, 0, 64, 96);
  ctx.fillStyle = '#008751';
  ctx.fillRect(128, 0, 64, 96);

  return createTextureFromCanvas(canvas, 1, 1);
}

// 7. Striped Fabric Texture
export function createStripedFabricTexture(c1 = '#008751', c2 = '#fef08a'): THREE.CanvasTexture {
  const canvas = document.createElement('canvas');
  canvas.width = 128;
  canvas.height = 128;
  const ctx = canvas.getContext('2d')!;

  ctx.fillStyle = c1;
  ctx.fillRect(0, 0, 128, 128);

  ctx.fillStyle = c2;
  for (let x = 0; x < 128; x += 32) {
    ctx.fillRect(x, 0, 16, 128);
  }

  return createTextureFromCanvas(canvas, 2, 2);
}
