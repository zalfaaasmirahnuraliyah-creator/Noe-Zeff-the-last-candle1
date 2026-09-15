import {
  Platform,
  WindHazard,
  ShadowMonster,
  FallingHazard,
  PressurePlate,
  GateDoor,
  CollectibleKey,
  WaxPickup,
  CollapsingFloor,
  BackgroundElement,
  SectionMarker
} from './types';

export const LEVEL_WIDTH = 7600;
export const FLOOR_Y = 480; // Standard ground floor level
export const CEILING_Y = 80;

export const SECTION_MARKERS: SectionMarker[] = [
  { id: 1, name: 'SECTION 1', startX: 0, title: 'The Silent Foyer', subtitle: 'NOE protects. ZEFF holds the flame.' },
  { id: 2, name: 'SECTION 2', startX: 950, title: 'The Drafty Gallery', subtitle: 'Strong wind from broken windows. NOE must block the gust.' },
  { id: 3, name: 'SECTION 3', startX: 1900, title: 'The Rotting Floorboards', subtitle: 'Tread with care across fractured timbers.' },
  { id: 4, name: 'SECTION 4', startX: 2900, title: 'The Shadowed Corridor', subtitle: 'Lurkers emerge from the dark. Stand between them and the flame.' },
  { id: 5, name: 'SECTION 5', startX: 4000, title: 'The Locked Vestibule', subtitle: 'ZEFF must claim the brass key while NOE holds the line.' },
  { id: 6, name: 'SECTION 6', startX: 5100, title: 'The Gale Hallway', subtitle: 'Supernatural winds shift unpredictably.' },
  { id: 7, name: 'SECTION 7', startX: 6100, title: 'The Haunted Passageway', subtitle: 'Whispering spectres and falling ruins.' },
  { id: 8, name: 'FINAL SECTION', startX: 6850, title: 'The Deep Shadows & Dawn Exit', subtitle: 'The flame is dying. Reach the threshold together!' }
];

export function createInitialLevelData() {
  // 1. Platforms (Solid ground and elevated bridges)
  const platforms: Platform[] = [
    // Section 1: Intro (0 -> 950)
    { x: 0, y: FLOOR_Y, width: 950, height: 80, type: 'floor' },

    // Section 2: Wind corridor (950 -> 1900)
    { x: 950, y: FLOOR_Y, width: 950, height: 80, type: 'floor' },

    // Section 3: Broken Floorboards (1900 -> 2900)
    { x: 1900, y: FLOOR_Y, width: 220, height: 80, type: 'floor' },
    // Gap 1: 2120 -> 2180 (60px gap)
    { x: 2180, y: FLOOR_Y, width: 140, height: 80, type: 'floor' },
    // Elevated crate platform
    { x: 2260, y: FLOOR_Y - 45, width: 60, height: 45, type: 'crate' },
    // Gap 2: 2320 -> 2400 (80px gap)
    { x: 2400, y: FLOOR_Y, width: 180, height: 80, type: 'floor' },
    // Gap 3: 2580 -> 2660 (80px gap)
    { x: 2660, y: FLOOR_Y, width: 240, height: 80, type: 'floor' },

    // Section 4: Shadows (2900 -> 4000)
    { x: 2900, y: FLOOR_Y, width: 1100, height: 80, type: 'floor' },

    // Section 5: Locked Area (4000 -> 5100)
    { x: 4000, y: FLOOR_Y, width: 450, height: 80, type: 'floor' },
    // Upper balcony where the key sits
    { x: 4220, y: FLOOR_Y - 65, width: 110, height: 20, type: 'bridge' },
    { x: 4450, y: FLOOR_Y, width: 650, height: 80, type: 'floor' },

    // Section 6: Strong Wind (5100 -> 6100)
    { x: 5100, y: FLOOR_Y, width: 320, height: 80, type: 'floor' },
    // Pit gap
    { x: 5460, y: FLOOR_Y, width: 240, height: 80, type: 'floor' },
    { x: 5740, y: FLOOR_Y, width: 360, height: 80, type: 'floor' },

    // Section 7: Haunted Hall (6100 -> 6850)
    { x: 6100, y: FLOOR_Y, width: 750, height: 80, type: 'floor' },

    // Final Section: Exit (6850 -> 7600)
    { x: 6850, y: FLOOR_Y, width: 750, height: 80, type: 'floor' },

    // End Wall
    { x: LEVEL_WIDTH - 20, y: 0, width: 40, height: 600, type: 'wall' },
    // Start Wall
    { x: -40, y: 0, width: 40, height: 600, type: 'wall' },
  ];

  // 2. Wind Hazards
  const windHazards: WindHazard[] = [
    // Section 2: First Wind draft (Wind blows from Right to Left, NOE must step ahead of ZEFF!)
    {
      id: 'wind-sec2',
      startX: 1150,
      endX: 1750,
      y: FLOOR_Y - 120,
      height: 120,
      direction: 'left',
      strength: 2,
      active: true,
      pulseTimer: 0,
    },
    // Section 5: Mild draft around the locked archway
    {
      id: 'wind-sec5',
      startX: 4500,
      endX: 4900,
      y: FLOOR_Y - 110,
      height: 110,
      direction: 'left',
      strength: 2.2,
      active: true,
      pulseTimer: 0,
    },
    // Section 6: Strong Supernatural Gale (Shifting direction gusts!)
    {
      id: 'wind-sec6-a',
      startX: 5150,
      endX: 5650,
      y: FLOOR_Y - 130,
      height: 130,
      direction: 'left',
      strength: 3.2,
      active: true,
      pulseTimer: 0,
      isSupernatural: true,
    },
    {
      id: 'wind-sec6-b',
      startX: 5700,
      endX: 6050,
      y: FLOOR_Y - 130,
      height: 130,
      direction: 'right', // Gusts from behind! NOE must stay behind ZEFF here!
      strength: 2.8,
      active: true,
      pulseTimer: 0,
      isSupernatural: true,
    },
    // Section 7: Final eerie wind whisper
    {
      id: 'wind-sec7',
      startX: 6300,
      endX: 6700,
      y: FLOOR_Y - 120,
      height: 120,
      direction: 'left',
      strength: 2.5,
      active: true,
      pulseTimer: 0,
    },
  ];

  // 3. Shadow Monsters
  const shadowMonsters: ShadowMonster[] = [
    // Section 4: First Shadow encounter
    {
      id: 'shadow-1',
      x: 3350,
      y: FLOOR_Y - 35,
      targetX: 3350,
      vx: 0,
      vy: 0,
      width: 32,
      height: 32,
      state: 'dormant',
      animTimer: 0,
      health: 2,
      triggerX: 3100,
      speed: 1.2,
    },
    // Section 4: Second shadow that stalks from behind
    {
      id: 'shadow-2',
      x: 3550,
      y: FLOOR_Y - 35,
      targetX: 3550,
      vx: 0,
      vy: 0,
      width: 34,
      height: 34,
      state: 'dormant',
      animTimer: 0,
      health: 2,
      triggerX: 3600,
      speed: 1.4,
    },
    // Section 5: Guardian near the gate
    {
      id: 'shadow-3',
      x: 4850,
      y: FLOOR_Y - 35,
      targetX: 4850,
      vx: 0,
      vy: 0,
      width: 36,
      height: 36,
      state: 'dormant',
      animTimer: 0,
      health: 2,
      triggerX: 4650,
      speed: 1.5,
    },
    // Section 7: Haunted gauntlet of 2 shadows
    {
      id: 'shadow-4',
      x: 6350,
      y: FLOOR_Y - 35,
      targetX: 6350,
      vx: 0,
      vy: 0,
      width: 34,
      height: 34,
      state: 'dormant',
      animTimer: 0,
      health: 2,
      triggerX: 6200,
      speed: 1.6,
    },
    {
      id: 'shadow-5',
      x: 6600,
      y: FLOOR_Y - 35,
      targetX: 6600,
      vx: 0,
      vy: 0,
      width: 38,
      height: 38,
      state: 'dormant',
      animTimer: 0,
      health: 3,
      triggerX: 6480,
      speed: 1.7,
    },
  ];

  // 4. Falling Hazards (Chandeliers & Old Ceiling Timbers)
  const fallingHazards: FallingHazard[] = [
    // Section 3: Old chandelier that creaks and drops
    {
      id: 'fall-sec3',
      x: 2500,
      y: 90,
      targetY: FLOOR_Y - 20,
      width: 44,
      height: 34,
      state: 'hanging',
      warnTimer: 0,
      vy: 0,
      triggerX: 2420,
    },
    // Section 6: Falling stone gargoyle cornice
    {
      id: 'fall-sec6',
      x: 5540,
      y: 90,
      targetY: FLOOR_Y - 20,
      width: 38,
      height: 32,
      state: 'hanging',
      warnTimer: 0,
      vy: 0,
      triggerX: 5480,
    },
    // Section 7: Final collapsing chandelier
    {
      id: 'fall-sec7',
      x: 6420,
      y: 90,
      targetY: FLOOR_Y - 20,
      width: 48,
      height: 36,
      state: 'hanging',
      warnTimer: 0,
      vy: 0,
      triggerX: 6360,
    },
  ];

  // 5. Pressure Plates (NOE stands on them to lift heavy iron portcullis)
  const pressurePlates: PressurePlate[] = [
    {
      id: 'plate-sec5',
      x: 4140,
      y: FLOOR_Y - 6,
      width: 48,
      height: 6,
      isPressed: false,
      connectedDoorId: 'door-sec5-gate',
    },
  ];

  // 6. Gate Doors
  const gateDoors: GateDoor[] = [
    // Section 5: Iron Gate lifted by pressure plate
    {
      id: 'door-sec5-gate',
      x: 4420,
      y: FLOOR_Y - 110,
      width: 22,
      height: 110,
      targetHeight: 110,
      currentHeight: 110,
      isLocked: false,
      isOpen: false,
    },
    // Section 5: Ornate Locked Door requiring the Brass Key (ZEFF must interact!)
    {
      id: 'door-sec5-locked',
      x: 4980,
      y: FLOOR_Y - 115,
      width: 28,
      height: 115,
      targetHeight: 115,
      currentHeight: 115,
      isLocked: true,
      requiresKeyId: 'brass-key-1',
      isOpen: false,
    },
    // Section 8: Final Mansion Threshold Exit Door
    {
      id: 'door-exit',
      x: 7450,
      y: FLOOR_Y - 130,
      width: 40,
      height: 130,
      targetHeight: 130,
      currentHeight: 130,
      isLocked: false,
      isOpen: true,
    },
  ];

  // 7. Collectible Keys (ZEFF must retrieve)
  const collectibleKeys: CollectibleKey[] = [
    {
      id: 'brass-key-1',
      x: 4260,
      y: FLOOR_Y - 85,
      collected: false,
      label: 'Brass Sanctum Key',
    },
  ];

  // 8. Sacred Wax Drops (Restore candle stability)
  const waxPickups: WaxPickup[] = [
    { id: 'wax-1', x: 880, y: FLOOR_Y - 15, collected: false, amount: 25 },
    { id: 'wax-2', x: 2800, y: FLOOR_Y - 15, collected: false, amount: 35 },
    { id: 'wax-3', x: 4620, y: FLOOR_Y - 15, collected: false, amount: 35 },
    { id: 'wax-4', x: 6050, y: FLOOR_Y - 15, collected: false, amount: 40 },
    { id: 'wax-5', x: 6780, y: FLOOR_Y - 15, collected: false, amount: 45 },
  ];

  // 9. Collapsing Floors
  const collapsingFloors: CollapsingFloor[] = [
    {
      id: 'floor-rot-1',
      x: 2120,
      y: FLOOR_Y,
      width: 58,
      height: 80,
      state: 'stable',
      shakeTimer: 0,
    },
    {
      id: 'floor-rot-2',
      x: 2320,
      y: FLOOR_Y,
      width: 78,
      height: 80,
      state: 'stable',
      shakeTimer: 0,
    },
  ];

  // 10. Background Elements (Portraits, broken windows, grandfather clocks, etc.)
  const backgroundElements: BackgroundElement[] = [
    // Windows with wind
    { x: 1350, y: 150, type: 'window', width: 64, height: 110, detail: 'broken' },
    { x: 1600, y: 150, type: 'window', width: 64, height: 110, detail: 'broken' },
    { x: 3200, y: 150, type: 'window', width: 64, height: 110, detail: 'intact' },
    { x: 4650, y: 150, type: 'window', width: 64, height: 110, detail: 'broken' },
    { x: 5350, y: 150, type: 'window', width: 64, height: 110, detail: 'broken' },
    { x: 5850, y: 150, type: 'window', width: 64, height: 110, detail: 'broken' },
    { x: 6450, y: 150, type: 'window', width: 64, height: 110, detail: 'broken' },

    // Grandfather Clocks
    { x: 520, y: FLOOR_Y - 95, type: 'grandfather_clock', width: 28, height: 95 },
    { x: 3800, y: FLOOR_Y - 95, type: 'grandfather_clock', width: 28, height: 95 },

    // Chandeliers
    { x: 350, y: 90, type: 'chandelier', width: 40, height: 32 },
    { x: 1450, y: 90, type: 'chandelier', width: 40, height: 32 },
    { x: 3400, y: 90, type: 'chandelier', width: 40, height: 32 },
    { x: 4700, y: 90, type: 'chandelier', width: 40, height: 32 },
    { x: 7100, y: 90, type: 'chandelier', width: 40, height: 32 },
  ];

  return {
    platforms,
    windHazards,
    shadowMonsters,
    fallingHazards,
    pressurePlates,
    gateDoors,
    collectibleKeys,
    waxPickups,
    collapsingFloors,
    backgroundElements,
  };
}
