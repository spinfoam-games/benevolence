//	Full-page animated cloud background. A low-resolution fBm buffer is redrawn
//	each frame and upscaled with smoothing, which gives soft blue -> white
//	clouds that slowly drift and evolve. Purely decorative.
import { useEffect, useRef } from "react"
import { ValueNoise3D } from "./noise.ts"

//	Soft sky blue that shows between the clouds
const BASE_R = 140
const BASE_G = 205
const BASE_B = 233

//	fBm values below LOW read as clear sky, above HIGH as solid white cloud
const LOW_EDGE = 0.44
const HIGH_EDGE = 0.82

const DRIFT_X = 0.022
const DRIFT_Y = 0.010
const EVOLVE = 0.035
const CLOUD_SPAN = 3.0 // roughly how many cloud masses across the long edge
const TARGET_FPS = 30

export function CloudBackground() {
	const ref = useRef<HTMLCanvasElement>(null)

	useEffect(() => {
		const canvas = ref.current
		if (!canvas) return
		const ctx = canvas.getContext("2d")
		const buffer = document.createElement("canvas")
		const bctx = buffer.getContext("2d", { willReadFrequently: true })
		if (!ctx || !bctx) return

		const noise = new ValueNoise3D(20260908)
		const started = performance.now()
		const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches

		let bw = 2
		let bh = 2
		let image = bctx.createImageData(bw, bh)
		let raf = 0
		let lastFrame = 0

		const resize = () => {
			const w = Math.max(1, window.innerWidth)
			const h = Math.max(1, window.innerHeight)
			canvas.width = w
			canvas.height = h
			ctx.imageSmoothingEnabled = true

			const step = Math.max(w, h) > 900 ? 9 : 6
			bw = Math.min(220, Math.max(2, Math.round(w / step)))
			bh = Math.min(150, Math.max(2, Math.round(h / step)))
			buffer.width = bw
			buffer.height = bh
			image = bctx.createImageData(bw, bh)
		}

		const render = (nowMs: number) => {
			const t = (nowMs - started) / 1000
			const span = CLOUD_SPAN / Math.max(bw, bh)
			const ox = t * DRIFT_X
			const oy = t * DRIFT_Y
			const oz = t * EVOLVE
			const data = image.data

			let i = 0
			for (let y = 0; y < bh; y++) {
				const ny = y * span + oy
				for (let x = 0; x < bw; x++) {
					const n = noise.fbm(x * span + ox, ny, oz)
					let c = (n - LOW_EDGE) / (HIGH_EDGE - LOW_EDGE)
					c = c < 0 ? 0 : c > 1 ? 1 : c
					c = c * c * (3 - 2 * c) // smoothstep

					data[i++] = BASE_R + (255 - BASE_R) * c
					data[i++] = BASE_G + (255 - BASE_G) * c
					data[i++] = BASE_B + (255 - BASE_B) * c
					data[i++] = 255
				}
			}

			bctx.putImageData(image, 0, 0)
			ctx.drawImage(buffer, 0, 0, bw, bh, 0, 0, canvas.width, canvas.height)
		}

		const frame = (now: number) => {
			raf = requestAnimationFrame(frame)
			if (now - lastFrame < 1000 / TARGET_FPS) return
			lastFrame = now
			render(now)
		}

		const onVisibilityChange = () => {
			if (document.hidden) {
				cancelAnimationFrame(raf)
				raf = 0
			} else if (!raf && !reduceMotion) {
				lastFrame = 0
				raf = requestAnimationFrame(frame)
			}
		}

		resize()
		render(performance.now())
		if (!reduceMotion) raf = requestAnimationFrame(frame)

		window.addEventListener("resize", resize)
		document.addEventListener("visibilitychange", onVisibilityChange)

		return () => {
			cancelAnimationFrame(raf)
			window.removeEventListener("resize", resize)
			document.removeEventListener("visibilitychange", onVisibilityChange)
		}
	}, [])

	return <canvas ref={ref} className="cloud-bg" aria-hidden="true" />
}
