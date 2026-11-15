export type CameraKeyframe = {
  t: number;
  pos: [number, number, number];
  look: [number, number, number];
};

export const CAMERA_PATH: CameraKeyframe[] = [
  { t: 0.0, pos: [0, 1.05, 7.0], look: [0, 0.35, 0] },
  { t: 0.16, pos: [0, 1.05, 7.0], look: [0, 0.35, 0] },
  { t: 0.34, pos: [1.7, 0.5, 1.95], look: [0, 0.3, 0] },
  { t: 0.56, pos: [-1.75, 0.95, 1.55], look: [0, 0.88, 0] },
  { t: 0.78, pos: [0.95, 1.9, 1.05], look: [0, 1.55, 0] },
  { t: 1.0, pos: [0, 2.0, 5.8], look: [0, 1.0, 0] },
];

export const HOTSPOT_RANGES: [number, number][] = [
  [0.22, 0.44], // biscuit / base
  [0.46, 0.66], // raspberry / middle
  [0.68, 0.9], // glaze / top
];

function lerp(a: number, b: number, t: number) {
  return a + (b - a) * t;
}

function lerpVec3(a: [number, number, number], b: [number, number, number], t: number): [number, number, number] {
  return [lerp(a[0], b[0], t), lerp(a[1], b[1], t), lerp(a[2], b[2], t)];
}

export function getCameraState(progress: number, mobileScale = 1) {
  const p = Math.min(1, Math.max(0, progress));
  const path = CAMERA_PATH;
  for (let i = 0; i < path.length - 1; i++) {
    const a = path[i];
    const b = path[i + 1];
    if (p >= a.t && p <= b.t) {
      const localT = (p - a.t) / (b.t - a.t || 1);
      const eased = localT * localT * (3 - 2 * localT); // smoothstep
      const pos = lerpVec3(a.pos, b.pos, eased);
      return {
        pos: [pos[0] * mobileScale, pos[1] * mobileScale, pos[2] * mobileScale] as [number, number, number],
        look: lerpVec3(a.look, b.look, eased),
      };
    }
  }
  const last = path[path.length - 1];
  return {
    pos: [last.pos[0] * mobileScale, last.pos[1] * mobileScale, last.pos[2] * mobileScale] as [number, number, number],
    look: last.look,
  };
}

export function getActiveHotspot(progress: number): number | null {
  for (let i = 0; i < HOTSPOT_RANGES.length; i++) {
    const [start, end] = HOTSPOT_RANGES[i];
    if (progress >= start && progress <= end) return i;
  }
  return null;
}
