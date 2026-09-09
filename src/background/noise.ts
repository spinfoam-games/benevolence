//	Seeded 3D value noise + fractal Brownian motion, used by the animated
//	cloud background. Value (not gradient) noise keeps it cheap; the softness
//	comes from fBm plus upscaling a low-resolution buffer.

function mulberry32(seed: number): () => number {
	let s = seed >>> 0;
	return () => {
		s = (s + 0x6d2b79f5) | 0;
		let t = Math.imul(s ^ (s >>> 15), 1 | s);
		t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
		return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
	};
}

const fade = (t: number): number => t * t * t * (t * (t * 6 - 15) + 10);
const lerp = (a: number, b: number, t: number): number => a + (b - a) * t;

export class ValueNoise3D {
	private readonly perm = new Uint8Array(512);

	constructor(seed = 1337) {
		const rand = mulberry32(seed);
		const p = new Uint8Array(256);
		for (let i = 0; i < 256; i++) p[i] = i;
		for (let i = 255; i > 0; i--) {
			const j = Math.floor(rand() * (i + 1));
			const tmp = p[i];
			p[i] = p[j];
			p[j] = tmp;
		}
		for (let i = 0; i < 512; i++) this.perm[i] = p[i & 255];
	}

	private hash(x: number, y: number, z: number): number {
		const p = this.perm;
		return p[(p[(p[x & 255] + (y & 255)) & 255] + (z & 255)) & 255] / 255;
	}

	noise(x: number, y: number, z: number): number {
		const xi = Math.floor(x);
		const yi = Math.floor(y);
		const zi = Math.floor(z);
		const u = fade(x - xi);
		const v = fade(y - yi);
		const w = fade(z - zi);

		const x00 = lerp(this.hash(xi, yi, zi), this.hash(xi + 1, yi, zi), u);
		const x10 = lerp(this.hash(xi, yi + 1, zi), this.hash(xi + 1, yi + 1, zi), u);
		const x01 = lerp(this.hash(xi, yi, zi + 1), this.hash(xi + 1, yi, zi + 1), u);
		const x11 = lerp(this.hash(xi, yi + 1, zi + 1), this.hash(xi + 1, yi + 1, zi + 1), u);

		return lerp(lerp(x00, x10, v), lerp(x01, x11, v), w);
	}

	//	fBm in [0, 1]
	fbm(x: number, y: number, z: number, octaves = 3): number {
		let amp = 1;
		let freq = 1;
		let sum = 0;
		let norm = 0;
		for (let o = 0; o < octaves; o++) {
			sum += amp * this.noise(x * freq, y * freq, z * freq);
			norm += amp;
			amp *= 0.5;
			freq *= 2;
		}
		return sum / norm;
	}
}
