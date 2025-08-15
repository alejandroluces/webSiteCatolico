import { RosaryLayout, RosaryStep } from '../types';

const COLORS = {
  small: '#F4C430',
  large: '#2D6BFF',
  medal: '#B3B3B3',
  cross: '#8B5A2B',
};

export function renderSVG(container: HTMLElement, layout: RosaryLayout, onBeadSelect: (step: RosaryStep) => void) {
  const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
  svg.setAttribute('viewBox', layout.viewBox);
  svg.style.width = '100%';
  svg.style.height = '100%';

  const defs = document.createElementNS('http://www.w3.org/2000/svg', 'defs');
  const filter = document.createElementNS('http://www.w3.org/2000/svg', 'filter');
  filter.setAttribute('id', 'glow');
  filter.innerHTML = `
    <feGaussianBlur stdDeviation="3.5" result="coloredBlur" />
    <feMerge>
      <feMergeNode in="coloredBlur" />
      <feMergeNode in="SourceGraphic" />
    </feMerge>
  `;
  defs.appendChild(filter);
  svg.appendChild(defs);

  layout.steps.forEach((step) => {
    const bead = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
    bead.setAttribute('cx', step.position.x.toString());
    bead.setAttribute('cy', step.position.y.toString());
    bead.setAttribute('r', step.meta.beadType === 'large' ? '16' : '10');
    bead.setAttribute('fill', COLORS[step.meta.beadType] || '#ccc');
    bead.setAttribute('role', 'button');
    bead.setAttribute('tabindex', '0');
    bead.setAttribute('aria-label', step.meta.prayer);
    bead.style.cursor = 'pointer';

    bead.addEventListener('click', () => onBeadSelect(step));
    bead.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' || e.key === ' ') {
        onBeadSelect(step);
      }
    });

    svg.appendChild(bead);
  });

  container.innerHTML = '';
  container.appendChild(svg);
}
