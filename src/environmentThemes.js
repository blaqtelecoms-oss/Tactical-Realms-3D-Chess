import * as THREE_NS from 'three';

/** @type {any} */
const THREE = THREE_NS;

export function createEnvironmentThemes(scene, cathedralRoot, renderer) {
  // ---------------------------------------------------------------------------
  // 1. Imperial Rome Colosseum & Forum Environment
  // ---------------------------------------------------------------------------
  const romeGroup = new THREE.Group();
  romeGroup.name = 'RomeColosseumEnvironment';
  romeGroup.visible = false;
  scene.add(romeGroup);

  // Materials for Imperial Rome
  const travertineMat = new THREE.MeshStandardMaterial({
    color: 0xe8dfce,
    roughness: 0.68,
    metalness: 0.04
  });

  const imperialBronzeMat = new THREE.MeshStandardMaterial({
    color: 0xc8963e,
    roughness: 0.32,
    metalness: 0.84
  });

  const romanCrimsonMat = new THREE.MeshStandardMaterial({
    color: 0x9b1c24,
    roughness: 0.58,
    metalness: 0.12,
    side: THREE.DoubleSide
  });

  const forumFloorMat = new THREE.MeshStandardMaterial({
    color: 0xd6cbb8,
    roughness: 0.74,
    metalness: 0.02
  });

  // Forum Travertine Floor
  const forumFloorGeo = new THREE.CylinderGeometry(18, 18, 0.4, 32);
  const forumFloorMesh = new THREE.Mesh(forumFloorGeo, forumFloorMat);
  forumFloorMesh.position.set(0, 0.55, 0);
  forumFloorMesh.receiveShadow = true;
  romeGroup.add(forumFloorMesh);

  // Colosseum Colonnade: 18 classical fluted columns in an open amphitheater semicircle behind the board
  const colRadius = 5.8;
  const numColumns = 18;
  const colPlinthGeo = new THREE.BoxGeometry(0.55, 0.28, 0.55);
  const colShaftGeo = new THREE.CylinderGeometry(0.20, 0.23, 4.4, 16);
  const colCapitalGeo = new THREE.BoxGeometry(0.52, 0.24, 0.52);

  for (let i = 0; i < numColumns; i++) {
    const angle = (i / (numColumns - 1)) * Math.PI * 1.35 - Math.PI * 0.675;
    const cx = Math.sin(angle) * colRadius;
    const cz = -Math.cos(angle) * colRadius - 1.2;

    const colGroup = new THREE.Group();
    colGroup.position.set(cx, 0.75, cz);

    // Plinth base
    const plinth = new THREE.Mesh(colPlinthGeo, travertineMat);
    plinth.position.y = 0.14;
    plinth.castShadow = true;
    plinth.receiveShadow = true;
    colGroup.add(plinth);

    // Shaft
    const shaft = new THREE.Mesh(colShaftGeo, travertineMat);
    shaft.position.y = 2.48;
    shaft.castShadow = true;
    shaft.receiveShadow = true;
    colGroup.add(shaft);

    // Capital
    const capital = new THREE.Mesh(colCapitalGeo, travertineMat);
    capital.position.y = 4.80;
    capital.castShadow = true;
    colGroup.add(capital);

    romeGroup.add(colGroup);
  }

  // Curved Architrave Entablature spanning the tops of the columns
  const architraveGeo = new THREE.TorusGeometry(colRadius, 0.26, 8, 36, Math.PI * 1.35);
  const architraveMesh = new THREE.Mesh(architraveGeo, travertineMat);
  architraveMesh.rotation.x = Math.PI * 0.5;
  architraveMesh.rotation.z = -Math.PI * 0.675;
  architraveMesh.position.set(0, 5.85, -1.2);
  architraveMesh.castShadow = true;
  romeGroup.add(architraveMesh);

  // Four Imperial Crimson SPQR Vexillum Banners flanking the central altar
  const bannerPositions = [
    [-2.8, -2.8],
    [2.8, -2.8],
    [-2.8, 2.8],
    [2.8, 2.8]
  ];

  for (const [bx, bz] of bannerPositions) {
    const bGroup = new THREE.Group();
    bGroup.position.set(bx, 0.75, bz);

    // Pole
    const poleGeo = new THREE.CylinderGeometry(0.04, 0.04, 3.8, 8);
    const poleMesh = new THREE.Mesh(poleGeo, imperialBronzeMat);
    poleMesh.position.y = 1.9;
    poleMesh.castShadow = true;
    bGroup.add(poleMesh);

    // Golden Roman Eagle (Aquila) finial
    const eagleGeo = new THREE.ConeGeometry(0.12, 0.24, 6);
    const eagleMesh = new THREE.Mesh(eagleGeo, imperialBronzeMat);
    eagleMesh.position.y = 3.92;
    eagleMesh.castShadow = true;
    bGroup.add(eagleMesh);

    // Crimson banner with golden fringe
    const fabricGeo = new THREE.PlaneGeometry(0.85, 1.8);
    const fabricMesh = new THREE.Mesh(fabricGeo, romanCrimsonMat);
    fabricMesh.position.set(0, 2.6, 0.05);
    fabricMesh.rotation.y = bx > 0 ? -0.25 : 0.25;
    fabricMesh.castShadow = true;
    fabricMesh.receiveShadow = true;
    bGroup.add(fabricMesh);

    romeGroup.add(bGroup);
  }

  // Rome Mediterranean Sun & Sky Light Rig
  const romeSunLight = new THREE.DirectionalLight(0xffeed4, 3.4);
  romeSunLight.position.set(6.5, 11.0, 5.5);
  romeSunLight.castShadow = true;
  romeSunLight.shadow.mapSize.width = 2048;
  romeSunLight.shadow.mapSize.height = 2048;
  const rd = 4.2;
  romeSunLight.shadow.camera.left = -rd;
  romeSunLight.shadow.camera.right = rd;
  romeSunLight.shadow.camera.top = rd;
  romeSunLight.shadow.camera.bottom = -rd;
  romeSunLight.shadow.bias = -0.0004;
  romeGroup.add(romeSunLight);

  const romeSkyFill = new THREE.HemisphereLight(0x9bd0ff, 0x906848, 1.15);
  romeGroup.add(romeSkyFill);

  // ---------------------------------------------------------------------------
  // 2. Cyberpunk Sanctum Environment
  // ---------------------------------------------------------------------------
  const cyberpunkGroup = new THREE.Group();
  cyberpunkGroup.name = 'CyberpunkSanctumEnvironment';
  cyberpunkGroup.visible = false;
  scene.add(cyberpunkGroup);

  const cyberObsidianMat = new THREE.MeshStandardMaterial({
    color: 0x090c14,
    roughness: 0.18,
    metalness: 0.92
  });

  const neonCyanMat = new THREE.MeshBasicMaterial({
    color: 0x00f0ff
  });

  const neonMagentaMat = new THREE.MeshBasicMaterial({
    color: 0xff0088
  });

  // Cyber Floor with glowing grid
  const cyberFloorMesh = new THREE.Mesh(
    new THREE.BoxGeometry(24, 0.2, 24),
    cyberObsidianMat
  );
  cyberFloorMesh.position.set(0, 0.65, 0);
  cyberFloorMesh.receiveShadow = true;
  cyberpunkGroup.add(cyberFloorMesh);

  // Floating neon hexagonal conduit rings
  for (let r = 0; r < 4; r++) {
    const ringGeo = new THREE.TorusGeometry(3.6 + r * 1.8, 0.04, 6, 6);
    const ringMesh = new THREE.Mesh(ringGeo, r % 2 === 0 ? neonCyanMat : neonMagentaMat);
    ringMesh.rotation.x = Math.PI * 0.5;
    ringMesh.position.set(0, 2.2 + r * 0.9, 0);
    cyberpunkGroup.add(ringMesh);
  }

  // Cyberpunk Lighting Rig
  const cyberLightCyan = new THREE.DirectionalLight(0x00e5ff, 2.2);
  cyberLightCyan.position.set(-6, 9, 5);
  cyberpunkGroup.add(cyberLightCyan);

  const cyberLightMagenta = new THREE.DirectionalLight(0xff0088, 2.0);
  cyberLightMagenta.position.set(6, 9, -5);
  cyberpunkGroup.add(cyberLightMagenta);

  const cyberAmbient = new THREE.HemisphereLight(0x00e5ff, 0xff0088, 0.7);
  cyberpunkGroup.add(cyberAmbient);

  // ---------------------------------------------------------------------------
  // Environment Controller
  // ---------------------------------------------------------------------------
  let currentEnvironment = 'cathedral';

  function applyEnvironment(envId) {
    currentEnvironment = envId;

    if (envId === 'rome') {
      if (cathedralRoot) cathedralRoot.visible = false;
      romeGroup.visible = true;
      cyberpunkGroup.visible = false;

      scene.background = new THREE.Color(0x181410);
      scene.fog = new THREE.FogExp2(0x231d17, 0.012);
    } else if (envId === 'cyberpunk') {
      if (cathedralRoot) cathedralRoot.visible = false;
      romeGroup.visible = false;
      cyberpunkGroup.visible = true;

      scene.background = new THREE.Color(0x04060c);
      scene.fog = new THREE.FogExp2(0x05070e, 0.018);
    } else {
      // Default: Gothic Cathedral
      if (cathedralRoot) cathedralRoot.visible = true;
      romeGroup.visible = false;
      cyberpunkGroup.visible = false;

      scene.background = new THREE.Color(0x070a12);
      scene.fog = new THREE.FogExp2(0x080b14, 0.015);
    }

    if (renderer) {
      renderer.shadowMap.needsUpdate = true;
    }
  }

  return {
    romeGroup,
    cyberpunkGroup,
    applyEnvironment,
    getCurrentEnvironment: () => currentEnvironment
  };
}
