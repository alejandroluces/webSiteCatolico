import { RosaryLayout, RosaryStep } from '../types';
import { createOvalPath, createTailPath, samplePath } from './geometry';

const VIEWBOX_WIDTH = 1000;
const VIEWBOX_HEIGHT = 1200;

export function calculateLayout(): RosaryLayout {
  const steps: RosaryStep[] = [];
  const ringPath = document.createElementNS('http://www.w3.org/2000/svg', 'path');
  ringPath.setAttribute('d', createOvalPath(500, 400, 300, 200));

  const tailPath = document.createElementNS('http://www.w3.org/2000/svg', 'path');
  tailPath.setAttribute('d', createTailPath(500, 600, 300));

  const ringPoints = samplePath(ringPath, 55); // 5 decades * (10 small + 1 large)
  const tailPoints = samplePath(tailPath, 5); // 1 large, 3 small, 1 small

  let globalIndex = 0;

  // Tail beads
  const tailPrayers = ['Padre Nuestro', 'Ave María', 'Ave María', 'Ave María', 'Gloria'];
  tailPoints.forEach((point, i) => {
    steps.push({
      position: point,
      meta: {
        section: 'intro',
        beadType: i === 0 ? 'large' : 'small',
        globalIndex: globalIndex++,
        prayer: tailPrayers[i],
      },
    });
  });

  // Ring beads
  for (let i = 0; i < 5; i++) {
    for (let j = 0; j < 11; j++) {
      const pointIndex = i * 11 + j;
      steps.push({
        position: ringPoints[pointIndex],
        meta: {
          section: 'decade',
          decadeIndex: i as any,
          beadType: j === 10 ? 'large' : 'small',
          beadIndexInDecade: j,
          globalIndex: globalIndex++,
          prayer: j === 10 ? `Misterio ${i + 1}` : `Ave María ${j + 1}`,
        },
      });
    }
  }

  return {
    steps,
    paths: {
      ring: ringPath.getAttribute('d')!,
      tail: tailPath.getAttribute('d')!,
    },
    viewBox: `0 0 ${VIEWBOX_WIDTH} ${VIEWBOX_HEIGHT}`,
  };
}
