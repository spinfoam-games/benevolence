//	Star particles (Particle.as). Drawn on a dedicated canvas that sits above
//	the game; the original moved 8 px/frame at 30 fps over a 1 second lifespan.
import { Assets } from "./assets.ts";

interface Particle {
	x: number;
	y: number;
	heading: number;
	speed: number;
	age: number;
	lifespan: number;
}

export const Particles = {
	list: [] as Particle[],
	canvas: null as HTMLCanvasElement | null,
	ctx: null as CanvasRenderingContext2D | null,
	lastTime: 0,

	init(canvas: HTMLCanvasElement): void {
		Particles.canvas = canvas;
		Particles.ctx = canvas.getContext("2d");
		requestAnimationFrame(Particles.tick);
	},

	spawn(x: number, y: number, count: number): void {
		for (let i = 0; i < count; i++) {
			Particles.list.push({
				x, y,
				heading: Math.random() * Math.PI * 2,
				speed: 240, // 8 px/frame * 30 fps
				age: 0,
				lifespan: 1.0,
			});
		}
	},

	clear(): void {
		Particles.list = [];
	},

	tick(time: number): void {
		const canvas = Particles.canvas;
		const ctx = Particles.ctx;
		if (!canvas || !ctx) return;

		let dt = Particles.lastTime ? (time - Particles.lastTime) / 1000 : 0;
		Particles.lastTime = time;
		if (dt > 0.1) dt = 0.1;

		ctx.clearRect(0, 0, canvas.width, canvas.height);

		const star = Assets.image("Star");
		const alive: Particle[] = [];

		Particles.list.forEach((p) => {
			p.age += dt;
			if (p.age >= p.lifespan) return;

			p.x += Math.cos(p.heading) * p.speed * dt;
			p.y += Math.sin(p.heading) * p.speed * dt;

			ctx.globalAlpha = 1.0 - p.age / p.lifespan;
			ctx.drawImage(star, p.x - star.width / 2, p.y - star.height / 2);
			alive.push(p);
		});

		ctx.globalAlpha = 1.0;
		Particles.list = alive;

		requestAnimationFrame(Particles.tick);
	},
};
