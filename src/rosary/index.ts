import { RosaryOptions } from '../types';
import { calculateLayout } from './layout';
import { renderSVG } from './render';

export function renderRosary(options: RosaryOptions) {
  const layout = calculateLayout();
  renderSVG(options.container, layout, options.onBeadSelect);
}
