/**
 * Generates the SVG path data for an oval.
 * @param cx - Center x-coordinate.
 * @param cy - Center y-coordinate.
 * @param rx - Radius x.
 * @param ry - Radius y.
 * @returns The SVG path data string.
 */
export function createOvalPath(cx: number, cy: number, rx: number, ry: number): string {
  return `M ${cx - rx},${cy} a ${rx},${ry} 0 1,0 ${2 * rx},0 a ${rx},${ry} 0 1,0 -${2 * rx},0`;
}

/**
 * Generates the SVG path data for the rosary tail.
 * @param startX - Starting x-coordinate.
 * @param startY - Starting y-coordinate.
 * @param length - The length of the tail.
 * @returns The SVG path data string.
 */
export function createTailPath(startX: number, startY: number, length: number): string {
  return `M ${startX},${startY} Q ${startX},${startY + length / 2} ${startX},${startY + length}`;
}

/**
 * Samples a series of equidistant points along an SVG path.
 * @param path - The SVG path element.
 * @param numPoints - The number of points to sample.
 * @returns An array of {x, y} coordinates.
 */
export function samplePath(path: SVGPathElement, numPoints: number): { x: number; y: number }[] {
  const totalLength = path.getTotalLength();
  const step = totalLength / (numPoints - 1);
  const points = [];

  for (let i = 0; i < numPoints; i++) {
    points.push(path.getPointAtLength(i * step));
  }

  return points;
}
