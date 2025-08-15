// This file defines the visual layout of the rosary and the mapping between the prayer sequence and the visual beads.

interface VisualBead {
  cx: number;
  cy: number;
  r: number;
  type: 'major' | 'minor';
}

const BEAD_SIZES = {
  major: 7, // Our Father beads
  minor: 5, // Hail Mary beads
};

// Rosary is now more compact vertically
export const CENTERPIECE_POSITION = { cx: 200, cy: 175 };

// Generates the layout for the 59 beads + 1 crucifix placeholder.
const createVisualLayout = (): VisualBead[] => {
  const layout: VisualBead[] = [];
  const pendantCenterX = 200; // Reverted to center to fix connection issue

  // 0: Crucifix (placeholder, rendered separately). This coordinate is where the chain connects to the cross.
  layout.push({ cx: 220, cy: 290, r: 0, type: 'major' }); // Moved to the right

  // --- Pendant Beads (4 beads) ---
  // Connect the crucifix up to the centerpiece
  layout.push({ cx: pendantCenterX, cy: 265, r: BEAD_SIZES.major, type: 'major' }); // 1: Our Father
  layout.push({ cx: pendantCenterX, cy: 240, r: BEAD_SIZES.minor, type: 'minor' }); // 2: Hail Mary
  layout.push({ cx: pendantCenterX, cy: 220, r: BEAD_SIZES.minor, type: 'minor' }); // 3: Hail Mary
  layout.push({ cx: pendantCenterX, cy: 200, r: BEAD_SIZES.minor, type: 'minor' }); // 4: Hail Mary

  // --- Main Loop Beads (5 decades = 5 major + 50 minor = 55 beads) ---
  const centerX = 200;
  const centerY = 90; // Moved up
  const radiusX = 95;
  const radiusY = 75; // Made smaller
  const totalLoopBeads = 55;
  const startAngle = Math.PI / 2; // Start from the bottom center
  const totalAngle = Math.PI * 2;
  
  // Position beads evenly
  for (let i = 0; i < totalLoopBeads; i++) {
    // By subtracting the angle, we make the rosary go counter-clockwise (to the left)
    const angle = startAngle - (i / totalLoopBeads) * totalAngle;
    
    const isMajorBead = i % 11 === 0;

    layout.push({
        cx: centerX + Math.cos(angle) * radiusX,
        cy: centerY + Math.sin(angle) * radiusY,
        r: isMajorBead ? BEAD_SIZES.major : BEAD_SIZES.minor,
        type: isMajorBead ? 'major' : 'minor',
    });
  }
  
  return layout;
};

export const VISUAL_BEAD_LAYOUT = createVisualLayout();

// --- MAPPING LOGIC ---
// Connects the logical prayer sequence (79 steps) to the visual beads (60 items)

// PRAYER_TO_VISUAL_MAP: For a given prayer index, which visual bead should be highlighted?
export const PRAYER_TO_VISUAL_MAP: number[] = [];

// VISUAL_TO_PRAYER_MAP: When a visual bead is clicked, which prayer index should we jump to?
export const VISUAL_TO_PRAYER_MAP: number[] = [];

// --- Build Maps ---

// Intro prayers (6 steps -> 5 visual beads + crucifix)
PRAYER_TO_VISUAL_MAP[0] = 0; // Sign of Cross -> Crucifix
VISUAL_TO_PRAYER_MAP[0] = 0;

PRAYER_TO_VISUAL_MAP[1] = 1; // Our Father -> Bead 1
VISUAL_TO_PRAYER_MAP[1] = 1;

PRAYER_TO_VISUAL_MAP[2] = 2; // Hail Mary -> Bead 2
VISUAL_TO_PRAYER_MAP[2] = 2;

PRAYER_TO_VISUAL_MAP[3] = 3; // Hail Mary -> Bead 3
VISUAL_TO_PRAYER_MAP[3] = 3;

PRAYER_TO_VISUAL_MAP[4] = 4; // Hail Mary -> Bead 4
VISUAL_TO_PRAYER_MAP[4] = 4;

const firstDecadeVisualBeadIndex = 5;
PRAYER_TO_VISUAL_MAP[5] = firstDecadeVisualBeadIndex; // Intro Glory Be -> First Major Bead of Loop

// Decades prayers (5 decades * 14 prayer steps = 70 steps)
let prayerIndex = 6; // Start after intro
let visualIndex = 5; // Start at the first loop bead

for (let d = 0; d < 5; d++) {
    const majorBeadVisualIndex = visualIndex; // e.g., 5, 16, 27, 38, 49
    VISUAL_TO_PRAYER_MAP[majorBeadVisualIndex] = prayerIndex;
    
    // Mystery Announcement & Our Father map to the same major bead
    PRAYER_TO_VISUAL_MAP[prayerIndex++] = majorBeadVisualIndex; // Mystery Announcement
    PRAYER_TO_VISUAL_MAP[prayerIndex++] = majorBeadVisualIndex; // Our Father
    visualIndex++;

    // 10 Hail Marys
    for (let i = 0; i < 10; i++) {
        VISUAL_TO_PRAYER_MAP[visualIndex] = prayerIndex;
        PRAYER_TO_VISUAL_MAP[prayerIndex++] = visualIndex++;
    }

    // Glory Be & Fatima Prayer map to the *next* decade's major bead
    const nextMajorBeadVisualIndex = (d < 4) ? visualIndex : firstDecadeVisualBeadIndex; // Loop back for the last one
    PRAYER_TO_VISUAL_MAP[prayerIndex++] = nextMajorBeadVisualIndex; // Glory Be
    PRAYER_TO_VISUAL_MAP[prayerIndex++] = nextMajorBeadVisualIndex; // Fatima Prayer
}

// Conclusion prayers (3 steps) are mapped to the centerpiece area (visually, the last bead)
const lastVisualBead = VISUAL_BEAD_LAYOUT.length - 1;
VISUAL_TO_PRAYER_MAP[lastVisualBead + 1] = prayerIndex; // Assign a new virtual bead for conclusion
PRAYER_TO_VISUAL_MAP[prayerIndex++] = lastVisualBead; // Hail Holy Queen
PRAYER_TO_VISUAL_MAP[prayerIndex++] = lastVisualBead; // Final Prayer
PRAYER_TO_VISUAL_MAP[prayerIndex++] = 0; // Final Sign of Cross -> Crucifix


// --- CHAIN PATH ---
const createChainPath = (layout: VisualBead[]): string => {
    let path = "";
    
    // --- Pendant Chain ---
    // From centerpiece bottom to first pendant bead (visual idx 4)
    path += `M ${CENTERPIECE_POSITION.cx} ${CENTERPIECE_POSITION.cy + 20} L ${layout[4].cx} ${layout[4].cy} `;
    // Connect pendant beads downwards
    for (let i = 4; i > 1; i--) {
        path += `M ${layout[i].cx} ${layout[i].cy} L ${layout[i-1].cx} ${layout[i-1].cy} `;
    }
    // From last pendant bead (visual idx 1) to crucifix placeholder (visual idx 0)
    path += `M ${layout[1].cx} ${layout[1].cy} L ${layout[0].cx} ${layout[0].cy} `;

    // --- Main Loop Chain ---
    const loopStartIndex = 5;
    const loopEndIndex = layout.length - 1;
    // Connect all loop beads
    for(let i = loopStartIndex; i < loopEndIndex; i++) {
        path += `M ${layout[i].cx} ${layout[i].cy} L ${layout[i+1].cx} ${layout[i+1].cy} `;
    }
    // Close the loop
    path += `M ${layout[loopEndIndex].cx} ${layout[loopEndIndex].cy} L ${layout[loopStartIndex].cx} ${layout[loopStartIndex].cy} `;

    // --- Connector from Centerpiece to Loop ---
    const bottomLoopBead = layout[5]; // The first bead of the loop is at the bottom
    path += `M ${CENTERPIECE_POSITION.cx} ${CENTERPIECE_POSITION.cy - 20} L ${bottomLoopBead.cx} ${bottomLoopBead.cy} `;


    return path;
}

export const CHAIN_PATH = createChainPath(VISUAL_BEAD_LAYOUT);