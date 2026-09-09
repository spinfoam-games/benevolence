//	DOM-based UI helpers (replacing the Flash Sprite/TextField widgets)
var UI = {
	//	Image button that swaps between an off and over image (HoverButton.as)
	hoverButton: function (offName, overName, callback) {
		var el = document.createElement('div')
		el.className = 'hover-button'

		var off = Assets.images[offName].cloneNode()
		var over = Assets.images[overName].cloneNode()
		over.style.display = 'none'

		el.appendChild(off)
		el.appendChild(over)

		el.addEventListener('mouseenter', function () {
			Sounds.PlayButtonHover()
			off.style.display = 'none'
			over.style.display = 'block'
		})
		el.addEventListener('mouseleave', function () {
			off.style.display = 'block'
			over.style.display = 'none'
		})
		el.addEventListener('click', function (event) {
			event.stopPropagation()
			Sounds.PlayButtonClick()
			callback()
		})

		return el
	},

	//	Kootenay-font text label (Label.as)
	label: function (align, size, color) {
		var el = document.createElement('div')
		el.className = 'game-label'
		el.style.textAlign = align || 'left'
		el.style.fontSize = (size || 24) + 'px'
		el.style.color = color || '#FFFFFF'
		return el
	},

	//	Miramonte-font text label (WasabiLabel.as)
	wasabiLabel: function (align, size, color) {
		var el = document.createElement('div')
		el.className = 'wasabi-label'
		el.style.textAlign = align || 'left'
		el.style.fontSize = (size || 24) + 'px'
		el.style.color = color || '#FFFFFF'
		return el
	},

	//	Flat rectangular text button with hover/click sounds (WasabiButton.as)
	wasabiButton: function (text, onclick, width) {
		var el = document.createElement('div')
		el.className = 'wasabi-button'
		el.style.width = (width || 200) + 'px'
		el.textContent = text

		el.addEventListener('mouseenter', function () { Sounds.PlayButtonHover() })
		el.addEventListener('click', function (event) {
			event.stopPropagation()
			Sounds.PlayButtonClick()
			if (onclick) onclick()
		})

		el.setSelected = function (s) {
			el.classList.toggle('selected', s)
		}

		return el
	},

	//	Section separator: text over a horizontal rule (WasabiSeparator.as)
	wasabiSeparator: function (text, width) {
		var el = document.createElement('div')
		el.className = 'wasabi-separator'
		el.style.width = width + 'px'
		var span = document.createElement('span')
		span.textContent = text
		el.appendChild(span)
		return el
	},

	//	Cyan tooltip box (Tooltip.as)
	tooltip: function (container) {
		var el = document.createElement('div')
		el.className = 'tooltip'
		el.style.display = 'none'
		container.appendChild(el)

		return {
			el: el,
			setText: function (t) {
				el.textContent = t
			},
			setLevelCompletionText: function (i) {
				var data = Game.levelCompletionData[i]
				if (data) {
					var time = data.BestTime
					var minutes = Math.floor(time / 60)
					var seconds = Math.floor(time - minutes * 60)
					el.textContent =
						'Level: ' + (i + 1) + '\n' +
						'Best time: ' + minutes + ':' + (seconds < 10 ? '0' : '') + seconds + '\n' +
						'Fewest moves: ' + data.FewestMoves
				} else {
					el.textContent = 'Level: ' + (i + 1) + '\nNever completed.'
				}
			},
			placeAt: function (x, y) {
				x = Math.min(x, 600 - 154)
				el.style.left = x + 'px'
				el.style.top = (y - 70 - 5) + 'px'
			},
			show: function () { el.style.display = 'block' },
			hide: function () { el.style.display = 'none' }
		}
	},

	//	Brown footer bar with logo and credits (WasabiBar.as)
	wasabiBar: function (thanksText) {
		var bar = document.createElement('div')
		bar.className = 'wasabi-bar'

		var logo = Assets.images['WasabiLogo'].cloneNode()
		logo.className = 'wasabi-bar-logo'
		//bar.appendChild(logo)

		var copyright = UI.wasabiLabel('left', 18, '#FFF874')
		copyright.className += ' wasabi-bar-copyright'
		copyright.textContent = 'Copyright 2026 - Spinfoam Games'
		bar.appendChild(copyright)

		var site = document.createElement('div')
		site.className = 'wasabi-label wasabi-bar-site'
		site.textContent = 'http://www.spinfoamgames.com/'
		bar.appendChild(site)

		var thanks = UI.wasabiLabel('left', 12, '#7D4C30')
		thanks.className += ' wasabi-bar-thanks'
		thanks.textContent = thanksText
		bar.appendChild(thanks)

		bar.addEventListener('click', function () {
			window.open('http://www.spinfoamgames.com/', '_blank')
		})

		return bar
	},

	//	Full-screen black overlay with a message and an Ok button
	//	(SubmitLevelResponseOverlay.as / CustomLevelsResponseOverlay.as)
	messageOverlay: function (text, onOk) {
		var overlay = document.createElement('div')
		overlay.className = 'full-overlay'

		var info = UI.wasabiLabel('left', 18)
		info.className += ' overlay-text'
		info.textContent = text
		overlay.appendChild(info)

		var ok = UI.wasabiButton('Ok', onOk)
		ok.style.position = 'absolute'
		ok.style.left = (300 - 100) + 'px'
		ok.style.bottom = '10px'
		overlay.appendChild(ok)

		return overlay
	}
}

//	Star particles (Particle.as). Drawn on a dedicated canvas that sits above
//	the game; original moved 8 px/frame at 30 fps over a 1 second lifespan.
var Particles = {
	list: [],
	canvas: null,
	ctx: null,
	lastTime: 0,

	init: function (canvas) {
		Particles.canvas = canvas
		Particles.ctx = canvas.getContext('2d')
		requestAnimationFrame(Particles.tick)
	},

	spawn: function (x, y, count) {
		for (var i = 0; i < count; i++) {
			Particles.list.push({
				x: x, y: y,
				heading: Math.random() * Math.PI * 2,
				speed: 240,		// 8 px/frame * 30 fps
				age: 0,
				lifespan: 1.0
			})
		}
	},

	clear: function () {
		Particles.list = []
	},

	tick: function (time) {
		var dt = Particles.lastTime ? (time - Particles.lastTime) / 1000 : 0
		Particles.lastTime = time
		if (dt > 0.1) dt = 0.1

		var ctx = Particles.ctx
		ctx.clearRect(0, 0, Particles.canvas.width, Particles.canvas.height)

		var star = Assets.images['Star']
		var alive = []

		Particles.list.forEach(function (p) {
			p.age += dt
			if (p.age >= p.lifespan) return

			p.x += Math.cos(p.heading) * p.speed * dt
			p.y += Math.sin(p.heading) * p.speed * dt

			ctx.globalAlpha = 1.0 - p.age / p.lifespan
			ctx.drawImage(star, p.x - star.width / 2, p.y - star.height / 2)
			alive.push(p)
		})

		ctx.globalAlpha = 1.0
		Particles.list = alive

		requestAnimationFrame(Particles.tick)
	}
}
