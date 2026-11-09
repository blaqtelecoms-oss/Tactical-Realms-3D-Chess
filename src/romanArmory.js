import * as THREE_NS from 'three';

/** @type {any} */
const THREE = THREE_NS;

// Shared PBR materials for Roman armory
const romanGoldMat = new THREE.MeshStandardMaterial({
  color: 0xd4af37,
  roughness: 0.26,
  metalness: 0.88
});

const romanBronzeMat = new THREE.MeshStandardMaterial({
  color: 0xcd7f32,
  roughness: 0.32,
  metalness: 0.82
});

const romanIronMat = new THREE.MeshStandardMaterial({
  color: 0xd8dde4,
  roughness: 0.22,
  metalness: 0.90
});

const romanWoodMat = new THREE.MeshStandardMaterial({
  color: 0x5a3d28,
  roughness: 0.72,
  metalness: 0.04
});

const romanCrimsonMat = new THREE.MeshStandardMaterial({
  color: 0x9b1c24,
  roughness: 0.55,
  metalness: 0.12,
  side: THREE.DoubleSide
});

const romanBlackPlumeMat = new THREE.MeshStandardMaterial({
  color: 0x181a22,
  roughness: 0.65,
  metalness: 0.18,
  side: THREE.DoubleSide
});

const romanDarkShieldMat = new THREE.MeshStandardMaterial({
  color: 0x1b1f29,
  roughness: 0.42,
  metalness: 0.22,
  side: THREE.DoubleSide
});

/**
 * Creates an authentic Roman Galea / Centurion Helmet with crest, brow guard, and cheek plates.
 */
export function createRomanGalea(color, isCenturion = true, isTransverse = false) {
  const helmetGroup = new THREE.Group();
  helmetGroup.name = 'RomanGalea';

  const metalMat = color === 'w' ? romanGoldMat : romanBronzeMat;
  const plumeMat = color === 'w' ? romanCrimsonMat : romanBlackPlumeMat;

  // 1. Skull cap (dome)
  const domeGeo = new THREE.SphereGeometry(0.19, 18, 14, 0, Math.PI * 2, 0, Math.PI * 0.58);
  const domeMesh = new THREE.Mesh(domeGeo, metalMat);
  domeMesh.position.y = 0.02;
  domeMesh.castShadow = true;
  helmetGroup.add(domeMesh);

  // 2. Brow band & peak (visor)
  const visorGeo = new THREE.TorusGeometry(0.185, 0.022, 8, 24);
  const visorMesh = new THREE.Mesh(visorGeo, metalMat);
  visorMesh.rotation.x = Math.PI * 0.48;
  visorMesh.position.set(0, 0.04, 0.02);
  visorMesh.castShadow = true;
  helmetGroup.add(visorMesh);

  // 3. Neck guard (curved flange at back)
  const neckGeo = new THREE.CylinderGeometry(0.19, 0.24, 0.11, 16, 1, true, Math.PI * 0.72, Math.PI * 0.56);
  const neckMesh = new THREE.Mesh(neckGeo, metalMat);
  neckMesh.rotation.x = 0.28;
  neckMesh.position.set(0, -0.01, -0.04);
  neckMesh.castShadow = true;
  helmetGroup.add(neckMesh);

  // 4. Cheek guards (paragnathides)
  const cheekGeo = new THREE.BoxGeometry(0.045, 0.12, 0.08);
  const cheekL = new THREE.Mesh(cheekGeo, metalMat);
  cheekL.position.set(-0.16, -0.04, 0.04);
  cheekL.rotation.z = -0.12;
  cheekL.castShadow = true;
  helmetGroup.add(cheekL);

  const cheekR = cheekL.clone();
  cheekR.position.set(0.16, -0.04, 0.04);
  cheekR.rotation.z = 0.12;
  helmetGroup.add(cheekR);

  // 5. Centurion Horsehair Crest (Crista)
  if (isCenturion) {
    const crestHolderGeo = new THREE.BoxGeometry(isTransverse ? 0.32 : 0.038, 0.04, isTransverse ? 0.04 : 0.32);
    const crestHolder = new THREE.Mesh(crestHolderGeo, romanGoldMat);
    crestHolder.position.y = 0.20;
    crestHolder.castShadow = true;
    helmetGroup.add(crestHolder);

    const plumeGeo = new THREE.BoxGeometry(isTransverse ? 0.34 : 0.042, 0.14, isTransverse ? 0.044 : 0.34);
    const plumeMesh = new THREE.Mesh(plumeGeo, plumeMat);
    plumeMesh.position.y = 0.26;
    plumeMesh.castShadow = true;
    helmetGroup.add(plumeMesh);

    // Arch-shaped plume top
    const arcGeo = new THREE.TorusGeometry(0.16, 0.032, 8, 20, Math.PI * 0.88);
    const arcMesh = new THREE.Mesh(arcGeo, plumeMat);
    if (isTransverse) {
      arcMesh.rotation.y = Math.PI * 0.5;
    }
    arcMesh.position.set(0, 0.24, isTransverse ? 0 : 0.02);
    arcMesh.castShadow = true;
    helmetGroup.add(arcMesh);
  }

  return helmetGroup;
}

/**
 * Creates a curved Roman Scutum Shield with golden boss (umbo) and winged thunderbolt emblem.
 */
export function createRomanScutum(color) {
  const shieldGroup = new THREE.Group();
  shieldGroup.name = 'RomanScutum';

  const faceMat = color === 'w' ? romanCrimsonMat : romanDarkShieldMat;
  const trimMat = color === 'w' ? romanGoldMat : romanBronzeMat;

  // Curved rectangular body
  const bodyGeo = new THREE.CylinderGeometry(0.36, 0.36, 0.68, 16, 1, true, -Math.PI * 0.36, Math.PI * 0.72);
  const bodyMesh = new THREE.Mesh(bodyGeo, faceMat);
  bodyMesh.rotation.y = Math.PI * 0.5;
  bodyMesh.castShadow = true;
  bodyMesh.receiveShadow = true;
  shieldGroup.add(bodyMesh);

  // Metal rim
  const rimGeo = new THREE.BoxGeometry(0.04, 0.70, 0.44);
  const rimMesh = new THREE.Mesh(rimGeo, trimMat);
  rimMesh.position.set(0, 0, -0.04);
  rimMesh.scale.set(0.12, 1.0, 1.0);
  rimMesh.castShadow = true;
  shieldGroup.add(rimMesh);

  // Central golden boss (Umbo)
  const bossPlate = new THREE.Mesh(new THREE.BoxGeometry(0.14, 0.14, 0.04), trimMat);
  bossPlate.position.set(0, 0, 0.16);
  bossPlate.castShadow = true;
  shieldGroup.add(bossPlate);

  const umboGeo = new THREE.SphereGeometry(0.065, 12, 8, 0, Math.PI * 2, 0, Math.PI * 0.5);
  const umboMesh = new THREE.Mesh(umboGeo, trimMat);
  umboMesh.rotation.x = Math.PI * 0.5;
  umboMesh.position.set(0, 0, 0.18);
  umboMesh.castShadow = true;
  shieldGroup.add(umboMesh);

  // Winged thunderbolts / SPQR Laurel design (golden plates)
  const wingGeo = new THREE.BoxGeometry(0.12, 0.024, 0.015);
  for (const s of [-1, 1]) {
    const wTop = new THREE.Mesh(wingGeo, trimMat);
    wTop.position.set(s * 0.11, 0.16, 0.14);
    wTop.rotation.z = s * 0.35;
    shieldGroup.add(wTop);

    const wBottom = new THREE.Mesh(wingGeo, trimMat);
    wBottom.position.set(s * 0.11, -0.16, 0.14);
    wBottom.rotation.z = -s * 0.35;
    shieldGroup.add(wBottom);
  }

  return shieldGroup;
}

/**
 * Creates a Roman Round Cavalry Shield (Parma Equestris).
 */
export function createRomanParma(color) {
  const parmaGroup = new THREE.Group();
  parmaGroup.name = 'RomanParma';

  const faceMat = color === 'w' ? romanCrimsonMat : romanDarkShieldMat;
  const trimMat = color === 'w' ? romanGoldMat : romanBronzeMat;

  const circleGeo = new THREE.CylinderGeometry(0.24, 0.24, 0.03, 24);
  const circleMesh = new THREE.Mesh(circleGeo, faceMat);
  circleMesh.rotation.x = Math.PI * 0.5;
  circleMesh.castShadow = true;
  parmaGroup.add(circleMesh);

  const rimGeo = new THREE.TorusGeometry(0.24, 0.02, 8, 24);
  const rimMesh = new THREE.Mesh(rimGeo, trimMat);
  rimMesh.castShadow = true;
  parmaGroup.add(rimMesh);

  const umboGeo = new THREE.SphereGeometry(0.065, 12, 8, 0, Math.PI * 2, 0, Math.PI * 0.5);
  const umboMesh = new THREE.Mesh(umboGeo, trimMat);
  umboMesh.rotation.x = Math.PI * 0.5;
  umboMesh.position.z = 0.02;
  umboMesh.castShadow = true;
  parmaGroup.add(umboMesh);

  return parmaGroup;
}

/**
 * Creates a Roman Gladius sword.
 */
export function createRomanGladius(color) {
  const gladiusGroup = new THREE.Group();
  gladiusGroup.name = 'RomanGladius';

  const trimMat = color === 'w' ? romanGoldMat : romanBronzeMat;

  // Blade
  const bladeGeo = new THREE.BoxGeometry(0.065, 0.54, 0.018);
  const bladeMesh = new THREE.Mesh(bladeGeo, romanIronMat);
  bladeMesh.position.y = 0.30;
  bladeMesh.castShadow = true;
  gladiusGroup.add(bladeMesh);

  // Crossguard
  const guardGeo = new THREE.CylinderGeometry(0.05, 0.05, 0.032, 12);
  const guardMesh = new THREE.Mesh(guardGeo, trimMat);
  guardMesh.position.y = 0.03;
  guardMesh.castShadow = true;
  gladiusGroup.add(guardMesh);

  // Grip
  const gripGeo = new THREE.CylinderGeometry(0.024, 0.024, 0.12, 10);
  const gripMesh = new THREE.Mesh(gripGeo, romanWoodMat);
  gripMesh.position.y = -0.045;
  gladiusGroup.add(gripMesh);

  // Spherical Pommel
  const pommelGeo = new THREE.SphereGeometry(0.045, 12, 10);
  const pommelMesh = new THREE.Mesh(pommelGeo, trimMat);
  pommelMesh.position.y = -0.115;
  pommelMesh.castShadow = true;
  gladiusGroup.add(pommelMesh);

  return gladiusGroup;
}

/**
 * Creates a Roman Pilum (heavy legionary javelin).
 */
export function createRomanPilum(color) {
  const pilumGroup = new THREE.Group();
  pilumGroup.name = 'RomanPilum';

  const trimMat = color === 'w' ? romanGoldMat : romanBronzeMat;

  // Wooden shaft
  const shaftGeo = new THREE.CylinderGeometry(0.022, 0.022, 0.85, 10);
  const shaftMesh = new THREE.Mesh(shaftGeo, romanWoodMat);
  shaftMesh.position.y = 0.42;
  shaftMesh.castShadow = true;
  pilumGroup.add(shaftMesh);

  // Lead weight joint
  const jointGeo = new THREE.SphereGeometry(0.048, 12, 8);
  const jointMesh = new THREE.Mesh(jointGeo, trimMat);
  jointMesh.position.y = 0.86;
  jointMesh.castShadow = true;
  pilumGroup.add(jointMesh);

  // Long iron shank
  const shankGeo = new THREE.CylinderGeometry(0.012, 0.012, 0.45, 8);
  const shankMesh = new THREE.Mesh(shankGeo, romanIronMat);
  shankMesh.position.y = 1.10;
  shankMesh.castShadow = true;
  pilumGroup.add(shankMesh);

  // Pyramidal barbed tip
  const tipGeo = new THREE.ConeGeometry(0.032, 0.10, 4);
  const tipMesh = new THREE.Mesh(tipGeo, romanIronMat);
  tipMesh.position.y = 1.34;
  tipMesh.castShadow = true;
  pilumGroup.add(tipMesh);

  return pilumGroup;
}

/**
 * Creates a Roman Golden Laurel Wreath (Corona Triumphalis).
 */
export function createRomanLaurelWreath(color) {
  const wreathGroup = new THREE.Group();
  wreathGroup.name = 'RomanLaurelWreath';

  const mat = color === 'w' ? romanGoldMat : romanBronzeMat;
  const ringGeo = new THREE.TorusGeometry(0.18, 0.018, 8, 24);
  const ringMesh = new THREE.Mesh(ringGeo, mat);
  ringMesh.rotation.x = Math.PI * 0.5;
  ringMesh.castShadow = true;
  wreathGroup.add(ringMesh);

  const leafGeo = new THREE.ConeGeometry(0.035, 0.08, 3);
  for (let i = 0; i < 12; i++) {
    const angle = (i / 12) * Math.PI * 2;
    const leaf = new THREE.Mesh(leafGeo, mat);
    leaf.position.set(Math.cos(angle) * 0.18, 0.01, Math.sin(angle) * 0.18);
    leaf.rotation.y = -angle;
    leaf.rotation.z = Math.PI * 0.35;
    leaf.castShadow = true;
    wreathGroup.add(leaf);
  }

  return wreathGroup;
}

/**
 * Creates an Imperial Roman Paludamentum (General / Emperor Cape).
 */
export function createRomanCape(color) {
  const capeGroup = new THREE.Group();
  capeGroup.name = 'RomanCape';

  const mat = color === 'w' ? romanCrimsonMat : romanBlackPlumeMat;
  const trimMat = color === 'w' ? romanGoldMat : romanBronzeMat;

  // Clasp at right shoulder
  const claspGeo = new THREE.CylinderGeometry(0.04, 0.04, 0.02, 12);
  const claspMesh = new THREE.Mesh(claspGeo, trimMat);
  claspMesh.position.set(0.16, 0.28, 0.04);
  claspMesh.rotation.x = Math.PI * 0.5;
  capeGroup.add(claspMesh);

  // Cape sheet
  const capeGeo = new THREE.PlaneGeometry(0.38, 0.72, 4, 4);
  // Give slight curve to the cape
  const pos = capeGeo.attributes.position;
  for (let i = 0; i < pos.count; i++) {
    const y = pos.getY(i);
    const zOffset = -Math.sin((y + 0.36) / 0.72 * Math.PI) * 0.06 - 0.04;
    pos.setZ(i, zOffset);
  }
  capeGeo.computeVertexNormals();

  const capeMesh = new THREE.Mesh(capeGeo, mat);
  capeMesh.position.set(0, -0.06, -0.16);
  capeMesh.castShadow = true;
  capeMesh.receiveShadow = true;
  capeGroup.add(capeMesh);

  return capeGroup;
}

/**
 * Creates a Roman Legionary Standard (SPQR Vexillum & Aquila Eagle) for the Rook.
 */
export function createRomanStandard(color) {
  const standardGroup = new THREE.Group();
  standardGroup.name = 'RomanStandard';

  const trimMat = color === 'w' ? romanGoldMat : romanBronzeMat;
  const bannerMat = color === 'w' ? romanCrimsonMat : romanDarkShieldMat;

  // Tall spear pole
  const poleGeo = new THREE.CylinderGeometry(0.025, 0.025, 1.25, 10);
  const poleMesh = new THREE.Mesh(poleGeo, trimMat);
  poleMesh.position.y = 0.65;
  poleMesh.castShadow = true;
  standardGroup.add(poleMesh);

  // Crossbar
  const crossGeo = new THREE.CylinderGeometry(0.018, 0.018, 0.38, 8);
  const crossMesh = new THREE.Mesh(crossGeo, trimMat);
  crossMesh.rotation.z = Math.PI * 0.5;
  crossMesh.position.y = 1.15;
  standardGroup.add(crossMesh);

  // Golden Aquila (Eagle) at top
  const eagleBody = new THREE.Mesh(new THREE.ConeGeometry(0.05, 0.12, 6), trimMat);
  eagleBody.position.y = 1.34;
  standardGroup.add(eagleBody);

  const eagleWings = new THREE.Mesh(new THREE.BoxGeometry(0.24, 0.04, 0.02), trimMat);
  eagleWings.position.y = 1.35;
  standardGroup.add(eagleWings);

  // Crimson Vexillum banner hanging down
  const bannerGeo = new THREE.PlaneGeometry(0.32, 0.45);
  const bannerMesh = new THREE.Mesh(bannerGeo, bannerMat);
  bannerMesh.position.set(0, 0.90, 0.015);
  bannerMesh.castShadow = true;
  bannerMesh.receiveShadow = true;
  standardGroup.add(bannerMesh);

  // Golden "SPQR" plate
  const spqrPlate = new THREE.Mesh(new THREE.BoxGeometry(0.24, 0.06, 0.02), trimMat);
  spqrPlate.position.set(0, 0.98, 0.025);
  standardGroup.add(spqrPlate);

  return standardGroup;
}

/**
 * Creates a Roman Augur's Lituus Staff for the Bishop.
 */
export function createRomanLituus(color) {
  const lituusGroup = new THREE.Group();
  lituusGroup.name = 'RomanLituus';

  const trimMat = color === 'w' ? romanGoldMat : romanBronzeMat;

  // Staff rod
  const staffGeo = new THREE.CylinderGeometry(0.02, 0.02, 0.85, 10);
  const staffMesh = new THREE.Mesh(staffGeo, trimMat);
  staffMesh.position.y = 0.42;
  staffMesh.castShadow = true;
  lituusGroup.add(staffMesh);

  // Spiral crook at the top
  const crookGeo = new THREE.TorusGeometry(0.08, 0.022, 8, 20, Math.PI * 1.5);
  const crookMesh = new THREE.Mesh(crookGeo, trimMat);
  crookMesh.position.set(0.05, 0.88, 0);
  crookMesh.rotation.z = Math.PI * 0.25;
  crookMesh.castShadow = true;
  lituusGroup.add(crookMesh);

  return lituusGroup;
}

/**
 * Equips custom Roman Legionary Soldier armor & weaponry onto a piece mesh hierarchy.
 * Uses exact bone lookups for 100% synchronized combat animations!
 */
export function equipRomanSoldierOutfit(pieceObj) {
  if (!pieceObj || !pieceObj.mesh) return;

  // Remove existing outfit group if present
  let outfitGroup = pieceObj.mesh.getObjectByName('PieceOutfitGroup');
  if (outfitGroup) {
    pieceObj.mesh.remove(outfitGroup);
  }

  outfitGroup = new THREE.Group();
  outfitGroup.name = 'PieceOutfitGroup';
  pieceObj.outfitGroup = outfitGroup;

  const color = pieceObj.color;
  const type = pieceObj.type;
  const root = pieceObj.mesh;

  // Helper to find bone or fallback to root
  const findBone = (boneName) => {
    let found = null;
    root.traverse((node) => {
      if (node.isBone && node.name === boneName) found = node;
      else if (!found && node.name === boneName) found = node;
    });
    return found;
  };

  switch (type) {
    case 'pawn': {
      // Roman Legionary Soldier
      const headBone = findBone('Head');
      const helmet = createRomanGalea(color, true, false);
      helmet.position.set(0, 0.12, 0.02);
      if (headBone) headBone.add(helmet);
      else {
        helmet.position.set(0, 1.45, 0);
        outfitGroup.add(helmet);
      }

      const shieldBone = findBone('Shield_Bone');
      const scutum = createRomanScutum(color);
      scutum.position.set(0.05, 0.02, 0.06);
      scutum.rotation.y = -Math.PI * 0.35;
      if (shieldBone) shieldBone.add(scutum);
      else {
        scutum.position.set(-0.35, 0.75, 0.15);
        outfitGroup.add(scutum);
      }

      const swordBone = findBone('Sword_Bone');
      const gladius = createRomanGladius(color);
      gladius.position.set(0, 0.08, 0.02);
      if (swordBone) swordBone.add(gladius);
      else {
        gladius.position.set(0.35, 0.75, 0.15);
        outfitGroup.add(gladius);
      }
      break;
    }

    case 'king': {
      // Roman Imperator Caesar
      const headBone = findBone('Head_Crown') || findBone('Head');
      const helmet = createRomanGalea(color, true, true); // Transverse Centurion/Emperor Crest
      helmet.scale.set(1.15, 1.15, 1.15);
      helmet.position.set(0, 0.16, 0.02);

      const laurel = createRomanLaurelWreath(color);
      laurel.position.set(0, 0.08, 0.02);
      helmet.add(laurel);

      if (headBone) headBone.add(helmet);
      else {
        helmet.position.set(0, 2.25, 0);
        outfitGroup.add(helmet);
      }

      const torsoBone = findBone('Torso');
      const cape = createRomanCape(color);
      cape.scale.set(1.2, 1.2, 1.2);
      if (torsoBone) torsoBone.add(cape);
      else {
        cape.position.set(0, 1.4, -0.15);
        outfitGroup.add(cape);
      }

      const weaponBone = findBone('Greatsword_Bone') || findBone('Arm.R');
      const gladius = createRomanGladius(color);
      gladius.scale.set(1.25, 1.25, 1.25);
      if (weaponBone) weaponBone.add(gladius);
      else {
        gladius.position.set(0.45, 1.0, 0.2);
        outfitGroup.add(gladius);
      }
      break;
    }

    case 'queen': {
      // Roman Empress / Bellona
      const headBone = findBone('Head_Crown') || findBone('Head');
      const laurel = createRomanLaurelWreath(color);
      laurel.scale.set(1.1, 1.1, 1.1);
      laurel.position.set(0, 0.18, 0.02);

      const helmet = createRomanGalea(color, true, false);
      helmet.scale.set(1.05, 1.05, 1.05);
      helmet.position.set(0, 0.12, 0.02);
      helmet.add(laurel);

      if (headBone) headBone.add(helmet);
      else {
        helmet.position.set(0, 2.1, 0);
        outfitGroup.add(helmet);
      }

      const torsoBone = findBone('Torso');
      const cape = createRomanCape(color);
      if (torsoBone) torsoBone.add(cape);
      else {
        cape.position.set(0, 1.3, -0.12);
        outfitGroup.add(cape);
      }

      const scepterBone = findBone('Mace_Scepter_Bone') || findBone('Arm.R');
      const pilum = createRomanPilum(color);
      pilum.scale.set(0.9, 0.9, 0.9);
      if (scepterBone) scepterBone.add(pilum);
      else {
        pilum.position.set(0.4, 0.9, 0.15);
        outfitGroup.add(pilum);
      }

      const shieldBone = findBone('Dagger_Shield_Bone') || findBone('Shield_Bone') || findBone('Arm.L');
      const parma = createRomanParma(color);
      if (shieldBone) shieldBone.add(parma);
      else {
        parma.position.set(-0.35, 0.85, 0.15);
        outfitGroup.add(parma);
      }
      break;
    }

    case 'knight': {
      // Roman Cavalryman (Equites)
      const riderHead = findBone('Rider_Head') || findBone('Head');
      const helmet = createRomanGalea(color, true, false);
      helmet.position.set(0, 0.14, 0.02);
      if (riderHead) riderHead.add(helmet);
      else {
        helmet.position.set(0, 1.8, 0.1);
        outfitGroup.add(helmet);
      }

      const shieldBone = findBone('Shield_Bone') || findBone('Rider_Arm.L');
      const parma = createRomanParma(color);
      parma.position.set(0.06, 0.04, 0.04);
      if (shieldBone) shieldBone.add(parma);
      else {
        parma.position.set(-0.4, 1.2, 0.2);
        outfitGroup.add(parma);
      }

      const lanceBone = findBone('Lance_Bone') || findBone('Rider_Arm.R');
      const spear = createRomanPilum(color);
      spear.position.set(0, 0.1, 0.05);
      if (lanceBone) lanceBone.add(spear);
      else {
        spear.position.set(0.4, 1.2, 0.2);
        outfitGroup.add(spear);
      }
      break;
    }

    case 'bishop': {
      // Roman Senator / Pontifex Maximus
      const headBone = findBone('Head_Mitre') || findBone('Head');
      const laurel = createRomanLaurelWreath(color);
      laurel.position.set(0, 0.15, 0.02);
      if (headBone) headBone.add(laurel);
      else {
        laurel.position.set(0, 1.85, 0);
        outfitGroup.add(laurel);
      }

      const crozierBone = findBone('Crozier_Bone') || findBone('Arm.R');
      const lituus = createRomanLituus(color);
      lituus.position.set(0, 0.12, 0.02);
      if (crozierBone) crozierBone.add(lituus);
      else {
        lituus.position.set(0.35, 0.9, 0.15);
        outfitGroup.add(lituus);
      }
      break;
    }

    case 'rook': {
      // Roman Fortified Castrum / Siege Standard
      const crownBone = findBone('Battlement_Crown') || findBone('Tower_Upper');
      const standard = createRomanStandard(color);
      standard.position.set(0, 0.15, 0);
      if (crownBone) crownBone.add(standard);
      else {
        standard.position.set(0, 1.5, 0);
        outfitGroup.add(standard);
      }
      break;
    }
  }

  // Ensure outfit group is attached if fallback attachments were used
  if (outfitGroup.children.length > 0 && !outfitGroup.parent) {
    pieceObj.mesh.add(outfitGroup);
  }
}

/**
 * Strips Roman outfits and restores clean original model hierarchy.
 */
export function removeRomanSoldierOutfit(pieceObj) {
  if (!pieceObj || !pieceObj.mesh) return;

  const namesToRemove = [
    'RomanGalea',
    'RomanScutum',
    'RomanParma',
    'RomanGladius',
    'RomanPilum',
    'RomanLaurelWreath',
    'RomanCape',
    'RomanStandard',
    'RomanLituus',
    'PieceOutfitGroup'
  ];

  const toRemove = [];
  pieceObj.mesh.traverse((child) => {
    if (namesToRemove.includes(child.name)) {
      toRemove.push(child);
    }
  });

  for (const child of toRemove) {
    if (child.parent) {
      child.parent.remove(child);
    }
  }
  pieceObj.outfitGroup = null;
}
