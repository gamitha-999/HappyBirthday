const Effects = {
  cleaners: [],

  rand(min, max) { return Math.random() * (max - min) + min; },
  randInt(min, max) { return Math.floor(Math.random() * (max - min + 1)) + min; },

  qsa(sel, ctx) { return (ctx || document).querySelectorAll(sel); },
  qs(sel, ctx) { return (ctx || document).querySelector(sel); },

  isMobile() {
    return window.innerWidth < 640 || 'ontouchstart' in window;
  },

  /* ===== BIRTHDAY CELEBRATION CANVAS ===== */
  initBirthday(canvasId) {
    const canvas = document.getElementById(canvasId);
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    let items = [];
    let running = true;
    let animId;
    const mobile = this.isMobile();

    const colors = ['#ec4899', '#a855f7', '#fbbf24', '#f43f5e', '#3b82f6', '#6ee7b7', '#f97316', '#14b8a6', '#f472b6', '#818cf8'];
    const count = mobile ? 35 : 80;

    function resize() {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    }

    function createItem() {
      const t = Math.random();
      if (t < 0.30) {
        return {
          type: 'balloon', x: Effects.rand(0, canvas.width), y: canvas.height + Effects.rand(10, 80),
          r: Effects.rand(10, 22), speed: Effects.rand(0.3, 1.0),
          swing: Effects.rand(0.5, 2.5), freq: Effects.rand(0.002, 0.006), ph: Effects.rand(0, Math.PI * 2),
          color: colors[~~(Math.random() * colors.length)], a: Effects.rand(0.15, 0.35), sl: Effects.rand(20, 35)
        };
      } else if (t < 0.60) {
        return {
          type: 'confetti', x: Effects.rand(0, canvas.width), y: Effects.rand(-50, -10),
          w: Effects.rand(4, 10), h: Effects.rand(6, 16), speed: Effects.rand(0.6, 2.0),
          rot: Effects.rand(0, Math.PI * 2), rs: Effects.rand(-0.06, 0.06), drift: Effects.rand(-0.4, 0.4),
          color: colors[~~(Math.random() * colors.length)], a: Effects.rand(0.3, 0.7)
        };
      } else if (t < 0.80) {
        return {
          type: 'star', x: Effects.rand(0, canvas.width), y: Effects.rand(0, canvas.height),
          s: Effects.rand(2, 6), ph: Effects.rand(0, Math.PI * 2), ts: Effects.rand(0.02, 0.06), a: Effects.rand(0.2, 0.6)
        };
      } else if (t < 0.92) {
        return {
          type: 'gift', x: Effects.rand(0, canvas.width), y: canvas.height + Effects.rand(5, 50),
          s: Effects.rand(8, 18), speed: Effects.rand(0.2, 0.6),
          swing: Effects.rand(0.3, 1.2), freq: Effects.rand(0.003, 0.008), ph: Effects.rand(0, Math.PI * 2),
          color: ['#ec4899', '#a855f7', '#fbbf24', '#f43f5e'][~~(Math.random() * 4)], a: Effects.rand(0.12, 0.25)
        };
      } else {
        return {
          type: 'sparkle', x: Effects.rand(0, canvas.width), y: Effects.rand(0, canvas.height),
          s: Effects.rand(1, 3), ph: Effects.rand(0, Math.PI * 2), speed: Effects.rand(0.01, 0.03),
          color: colors[~~(Math.random() * colors.length)], a: Effects.rand(0.4, 0.8)
        };
      }
    }

    function drawBalloon(p) {
      ctx.save();
      ctx.translate(p.x, p.y);
      ctx.beginPath();
      ctx.moveTo(0, p.r);
      ctx.lineTo(1, p.r + p.sl);
      ctx.strokeStyle = 'rgba(255,255,255,0.15)';
      ctx.lineWidth = 0.5;
      ctx.stroke();
      const g = ctx.createRadialGradient(-p.r*0.3, -p.r*0.3, 0, 0, 0, p.r);
      g.addColorStop(0, `rgba(255,255,255,${p.a * 0.8})`);
      g.addColorStop(0.3, p.color.replace(')', `,${p.a})`));
      g.addColorStop(1, p.color.replace(')', `,${p.a * 0.4})`));
      ctx.beginPath();
      ctx.ellipse(0, 0, p.r, p.r * 1.2, 0, 0, Math.PI * 2);
      ctx.fillStyle = g;
      ctx.fill();
      ctx.restore();
    }

    function drawConfetti(p) {
      ctx.save();
      ctx.translate(p.x, p.y);
      ctx.rotate(p.rot);
      ctx.fillStyle = p.color.replace(')', `,${p.a})`);
      ctx.fillRect(-p.w/2, -p.h/2, p.w, p.h);
      ctx.restore();
    }

    function drawStar(p, twinkle) {
      ctx.save();
      ctx.translate(p.x, p.y);
      ctx.globalAlpha = p.a * twinkle;
      ctx.fillStyle = '#fcd34d';
      ctx.shadowColor = 'rgba(251,191,36,0.6)';
      ctx.shadowBlur = 12;
      const s = p.s * twinkle;
      ctx.beginPath();
      for (let i = 0; i < 5; i++) {
        const a = (i * 4 * Math.PI) / 5 - Math.PI / 2;
        i === 0 ? ctx.moveTo(Math.cos(a) * s, Math.sin(a) * s) : ctx.lineTo(Math.cos(a) * s, Math.sin(a) * s);
      }
      ctx.closePath();
      ctx.fill();
      ctx.restore();
    }

    function drawGift(p) {
      ctx.save();
      ctx.translate(p.x, p.y);
      ctx.globalAlpha = p.a;
      ctx.fillStyle = p.color.replace(')', `,${p.a})`);
      ctx.fillRect(-p.s/2, -p.s/2, p.s, p.s);
      ctx.strokeStyle = 'rgba(255,255,255,0.2)';
      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.moveTo(0, -p.s/2);
      ctx.lineTo(0, p.s/2);
      ctx.moveTo(-p.s/2, 0);
      ctx.lineTo(p.s/2, 0);
      ctx.stroke();
      const bowSize = p.s * 0.2;
      ctx.fillStyle = 'rgba(255,255,255,0.3)';
      ctx.beginPath();
      ctx.arc(-bowSize/2, -p.s/2, bowSize, 0, Math.PI * 2);
      ctx.arc(bowSize/2, -p.s/2, bowSize, 0, Math.PI * 2);
      ctx.fill();
      ctx.restore();
    }

    function drawSparkle(p, time) {
      ctx.save();
      ctx.translate(p.x, p.y);
      const pulse = Math.sin(time * 4 + p.ph) * 0.3 + 0.7;
      ctx.globalAlpha = p.a * pulse;
      ctx.fillStyle = p.color;
      ctx.shadowColor = p.color;
      ctx.shadowBlur = 15;
      const s = p.s * pulse;
      ctx.beginPath();
      for (let i = 0; i < 4; i++) {
        const a = (i / 4) * Math.PI * 2;
        const px = Math.cos(a) * s * 2;
        const py = Math.sin(a) * s * 2;
        if (i === 0) ctx.moveTo(px, py);
        else ctx.lineTo(px, py);
      }
      ctx.closePath();
      ctx.fill();
      ctx.restore();
    }

    function animate() {
      if (!running) return;
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      const t = Date.now() * 0.001;
      for (const p of items) {
        if (p.type === 'balloon') {
          p.y -= p.speed;
          p.x += Math.sin(p.ph + p.y * p.freq) * p.swing;
          if (p.y < -p.r * 3) { Object.assign(p, createItem()); p.y = canvas.height + 50; }
          drawBalloon(p);
        } else if (p.type === 'confetti') {
          p.y += p.speed;
          p.x += p.drift;
          p.rot += p.rs;
          if (p.y > canvas.height + 10) { Object.assign(p, createItem()); p.y = -10; }
          drawConfetti(p);
        } else if (p.type === 'star') {
          drawStar(p, Math.sin(t * 3 + p.ph) * 0.3 + 0.7);
        } else if (p.type === 'gift') {
          p.y -= p.speed;
          p.x += Math.sin(p.ph + p.y * p.freq) * p.swing;
          if (p.y < -p.s * 2) { Object.assign(p, createItem()); p.y = canvas.height + 20; }
          drawGift(p);
        } else if (p.type === 'sparkle') {
          drawSparkle(p, t);
        }
      }
      animId = requestAnimationFrame(animate);
    }

    window.addEventListener('resize', resize);
    resize();
    for (let i = 0; i < count; i++) items.push(createItem());
    animate();

    this.cleaners.push(() => {
      running = false;
      if (animId) cancelAnimationFrame(animId);
      window.removeEventListener('resize', resize);
    });
  },

  initHearts(canvasId) {
    const canvas = document.getElementById(canvasId);
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    let hearts = [];
    let running = true;
    let animId;
    const mobile = this.isMobile();
    const count = mobile ? 15 : 35;

    function resize() {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    }

    function createHeart(offScreen) {
      return {
        x: Effects.rand(0, canvas.width),
        y: offScreen ? canvas.height + Effects.rand(20, 100) : Effects.rand(0, canvas.height),
        size: 8 + Effects.rand(0, 16),
        speed: 0.2 + Effects.rand(0, 0.6),
        opacity: 0.08 + Effects.rand(0, 0.18),
        phase: Effects.rand(0, Math.PI * 2),
        color: ['#ec4899', '#f43f5e', '#db2777', '#a855f7', '#f472b6', '#fb7185'][Math.floor(Math.random() * 6)]
      };
    }

    function drawHeart(h) {
      ctx.save();
      ctx.translate(h.x, h.y);
      ctx.scale(h.size / 20, h.size / 20);
      ctx.beginPath();
      ctx.moveTo(0, 5);
      ctx.bezierCurveTo(-10, -5, -20, 5, 0, 18);
      ctx.bezierCurveTo(20, 5, 10, -5, 0, 5);
      ctx.closePath();
      ctx.fillStyle = h.color;
      ctx.globalAlpha = h.opacity;
      ctx.fill();
      ctx.restore();
    }

    function animate() {
      if (!running) return;
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      for (const h of hearts) {
        h.y -= h.speed;
        h.x += Math.sin(h.phase + h.y * 0.005) * 0.4;
        if (h.y < -50) {
          Object.assign(h, createHeart(true));
        }
        drawHeart(h);
      }
      animId = requestAnimationFrame(animate);
    }

    window.addEventListener('resize', resize);
    resize();
    for (let i = 0; i < count; i++) hearts.push(createHeart(false));
    animate();

    this.cleaners.push(() => {
      running = false;
      if (animId) cancelAnimationFrame(animId);
      window.removeEventListener('resize', resize);
    });
  },

  initParticles(canvasId) {
    const canvas = document.getElementById(canvasId);
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    let particles = [];
    let running = true;
    let animId;
    const mobile = this.isMobile();
    const count = mobile ? 25 : 60;

    function resize() {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    }

    function createParticle() {
      return {
        x: Effects.rand(0, canvas.width),
        y: Effects.rand(0, canvas.height),
        radius: 1.5 + Effects.rand(0, 3),
        vx: (Effects.rand(0, 1) - 0.5) * 0.4,
        vy: (Effects.rand(0, 1) - 0.5) * 0.4,
        opacity: 0.15 + Effects.rand(0, 0.35),
        hue: Effects.rand(280, 330)
      };
    }

    function animate() {
      if (!running) return;
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      const time = Date.now() * 0.001;
      for (const p of particles) {
        p.x += p.vx;
        p.y += p.vy;
        if (p.x < 0 || p.x > canvas.width) p.vx *= -1;
        if (p.y < 0 || p.y > canvas.height) p.vy *= -1;
        const pulse = Math.sin(time + p.hue) * 0.3 + 0.7;
        const grad = ctx.createRadialGradient(p.x, p.y, 0, p.x, p.y, p.radius * 4);
        grad.addColorStop(0, `hsla(${p.hue}, 80%, 70%, ${0.6 * pulse})`);
        grad.addColorStop(1, `hsla(${p.hue}, 80%, 70%, 0)`);
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.radius * 4, 0, Math.PI * 2);
        ctx.fillStyle = grad;
        ctx.globalAlpha = p.opacity * pulse;
        ctx.fill();
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
        ctx.fillStyle = `hsla(${p.hue}, 80%, 80%, ${0.8 * pulse})`;
        ctx.globalAlpha = p.opacity * 0.6;
        ctx.fill();
      }
      for (let i = 0; i < particles.length; i++) {
        for (let j = i + 1; j < particles.length; j++) {
          const dx = particles[i].x - particles[j].x;
          const dy = particles[i].y - particles[j].y;
          const dist = Math.sqrt(dx * dx + dy * dy);
          if (dist < 120) {
            const alpha = (1 - dist / 120) * 0.2;
            ctx.beginPath();
            ctx.moveTo(particles[i].x, particles[i].y);
            ctx.lineTo(particles[j].x, particles[j].y);
            ctx.strokeStyle = `hsla(${(particles[i].hue + particles[j].hue) / 2}, 80%, 70%, ${alpha})`;
            ctx.globalAlpha = alpha;
            ctx.lineWidth = 0.5;
            ctx.stroke();
          }
        }
      }
      ctx.globalAlpha = 1;
      animId = requestAnimationFrame(animate);
    }

    window.addEventListener('resize', resize);
    resize();
    for (let i = 0; i < count; i++) particles.push(createParticle());
    animate();

    this.cleaners.push(() => {
      running = false;
      if (animId) cancelAnimationFrame(animId);
      window.removeEventListener('resize', resize);
    });
  },

  initSparkles(canvasId) {
    const canvas = document.getElementById(canvasId);
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    let sparkles = [];
    let running = true;
    let animId;
    const mobile = this.isMobile();
    const count = mobile ? 30 : 80;

    function resize() {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    }

    function createSparkle() {
      return {
        x: Effects.rand(0, canvas.width),
        y: Effects.rand(0, canvas.height),
        size: Effects.rand(1, 4),
        speed: Effects.rand(0.002, 0.01),
        angle: Effects.rand(0, Math.PI * 2),
        phase: Effects.rand(0, Math.PI * 2),
        opacity: Effects.rand(0.3, 0.9),
        color: ['#ec4899', '#a855f7', '#fbbf24', '#fce4ec', '#fff', '#f472b6', '#818cf8'][~~(Math.random() * 7)]
      };
    }

    function animate() {
      if (!running) return;
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      const time = Date.now() * 0.001;
      for (const s of sparkles) {
        s.angle += s.speed;
        s.y += Math.sin(s.angle) * 0.2;
        s.x += Math.cos(s.angle) * 0.15;
        if (s.x < -10 || s.x > canvas.width + 10) s.x = Effects.rand(0, canvas.width);
        if (s.y < -10 || s.y > canvas.height + 10) s.y = Effects.rand(0, canvas.height);
        const pulse = Math.sin(time * 3 + s.phase) * 0.3 + 0.7;
        const alpha = s.opacity * pulse;
        ctx.save();
        ctx.translate(s.x, s.y);
        ctx.globalAlpha = alpha;
        ctx.fillStyle = s.color;
        ctx.shadowColor = s.color;
        ctx.shadowBlur = 15;
        ctx.beginPath();
        for (let i = 0; i < 4; i++) {
          const a = (i / 4) * Math.PI * 2 + time * 0.3;
          const px = Math.cos(a) * s.size * 2.5;
          const py = Math.sin(a) * s.size * 2.5;
          if (i === 0) ctx.moveTo(px, py);
          else ctx.lineTo(px, py);
        }
        ctx.closePath();
        ctx.fill();
        ctx.restore();
      }
      animId = requestAnimationFrame(animate);
    }

    window.addEventListener('resize', resize);
    resize();
    for (let i = 0; i < count; i++) sparkles.push(createSparkle());
    animate();

    this.cleaners.push(() => {
      running = false;
      if (animId) cancelAnimationFrame(animId);
      window.removeEventListener('resize', resize);
    });
  },

  fireConfetti(type) {
    const container = document.createElement('div');
    container.className = 'confetti-overlay';
    document.body.appendChild(container);
    const mobile = this.isMobile();

    function rand(min, max) { return Math.random() * (max - min) + min; }

    if (type === 'hearts') {
      const count = mobile ? 25 : 50;
      for (let i = 0; i < count; i++) {
        const el = document.createElement('div');
        el.textContent = '❤️';
        el.style.cssText = `
          position: absolute;
          font-size: ${Effects.randInt(18, 40)}px;
          left: ${rand(5, 95)}vw;
          top: ${rand(-20, 40)}px;
          transform: translateY(0) rotate(0deg);
          transition: transform ${rand(2, 4)}s linear, opacity 0.5s;
          opacity: 1;
        `;
        container.appendChild(el);
        requestAnimationFrame(() => {
          el.style.transform = `translateY(${window.innerHeight + 100}px) rotate(${rand(-360, 360)}deg)`;
        });
        setTimeout(() => {
          el.style.opacity = '0';
          setTimeout(() => el.remove(), 500);
        }, rand(2000, 4000));
      }
    } else if (type === 'stars') {
      const emojis = ['⭐', '🌟', '✨', '💫', '🎉', '🎊', '🥳', '🎂'];
      const count = mobile ? 35 : 70;
      for (let i = 0; i < count; i++) {
        const el = document.createElement('div');
        el.textContent = emojis[Math.floor(Math.random() * emojis.length)];
        el.style.cssText = `
          position: absolute;
          font-size: ${Effects.randInt(18, 36)}px;
          left: ${rand(0, 100)}vw;
          top: ${rand(-10, 30)}px;
          transform: translate(0, 0) scale(1) rotate(0deg);
          transition: transform ${rand(2, 4)}s ease-out, opacity ${rand(2, 4)}s ease-out;
          opacity: 1;
        `;
        container.appendChild(el);
        requestAnimationFrame(() => {
          el.style.transform = `translate(${rand(-200, 200)}px, ${window.innerHeight + 100}px) scale(0.3) rotate(${rand(-720, 720)}deg)`;
          el.style.opacity = '0';
        });
        setTimeout(() => el.remove(), 4500);
      }
    } else {
      const colors = ['#ec4899', '#a855f7', '#fbbf24', '#f43f5e', '#fce4ec', '#7c3aed', '#fcd34d', '#f472b6', '#34d399'];
      const count = mobile ? 40 : 90;
      for (let i = 0; i < count; i++) {
        const el = document.createElement('div');
        const w = Effects.randInt(6, 10);
        const h = Effects.randInt(8, 18);
        const color = colors[Math.floor(Math.random() * colors.length)];
        const round = Math.random() < 0.3;
        const y = rand(-40, window.innerHeight * 0.3);
        let posX = rand(0, window.innerWidth);
        let posY = y;
        let gravity = 0;
        const vx = rand(-200, 200);
        const vy = -(rand(400, 900));
        const rotSpeed = rand(-15, 15);
        let rotation = 0;
        el.style.cssText = `
          position: absolute;
          width: ${w}px;
          height: ${h}px;
          background: ${color};
          border-radius: ${round ? '50%' : '1px'};
          left: ${posX}px;
          top: ${posY}px;
          transform: rotate(0deg);
        `;
        container.appendChild(el);
        (function animatePiece() {
          if (!el.parentNode) return;
          gravity += 0.15;
          posX += vx * 0.016;
          posY += vy * 0.016 + gravity;
          rotation += rotSpeed;
          el.style.left = posX + 'px';
          el.style.top = posY + 'px';
          el.style.transform = `rotate(${rotation}deg)`;
          if (posY < window.innerHeight + 50) {
            requestAnimationFrame(animatePiece);
          } else {
            el.remove();
          }
        })();
      }
    }
    setTimeout(() => container.remove(), 5000);
  },

  /* ===== PARTICLE BURST ON HOVER ===== */
  initParticleBurst() {
    const self = this;
    const mobile = this.isMobile();
    if (mobile) return;

    document.addEventListener('mouseover', function(e) {
      const target = e.target.closest('.twin-card, .masonry-item, .polaroid-card, .playful-card, [data-tilt]');
      if (!target) return;
      if (target.dataset.burstActive) return;
      target.dataset.burstActive = '1';

      const rect = target.getBoundingClientRect();
      const cx = rect.left + rect.width / 2;
      const cy = rect.top + rect.height / 2;

      const colors = ['#ec4899', '#a855f7', '#fbbf24', '#f43f5e', '#fce4ec', '#f472b6'];

      for (let i = 0; i < 12; i++) {
        const dot = document.createElement('div');
        const size = self.rand(3, 6);
        const angle = self.rand(0, Math.PI * 2);
        const velocity = self.rand(40, 100);
        const tx = Math.cos(angle) * velocity;
        const ty = Math.sin(angle) * velocity;
        dot.style.cssText = `
          position: fixed;
          width: ${size}px;
          height: ${size}px;
          background: ${colors[~~(Math.random() * colors.length)]};
          border-radius: 50%;
          left: ${cx}px;
          top: ${cy}px;
          pointer-events: none;
          z-index: 9999;
          opacity: 1;
          transition: transform ${self.rand(0.5, 0.9)}s cubic-bezier(.2,.8,.3,1), opacity ${self.rand(0.5, 0.9)}s ease-out;
          transform: translate(0, 0) scale(1);
        `;
        document.body.appendChild(dot);
        requestAnimationFrame(() => {
          dot.style.transform = `translate(${tx}px, ${ty}px) scale(0)`;
          dot.style.opacity = '0';
        });
        setTimeout(() => dot.remove(), 900);
      }
      setTimeout(() => { delete target.dataset.burstActive; }, 300);
    });
  },

  /* ===== MOUSE PARALLAX ===== */
  initMouseParallax(selector, intensity) {
    const elements = document.querySelectorAll(selector);
    if (!elements.length) return;
    intensity = intensity || 0.05;
    let ticking = false;

    function onMouseMove(e) {
      if (ticking) return;
      ticking = true;
      const cx = e.clientX / window.innerWidth - 0.5;
      const cy = e.clientY / window.innerHeight - 0.5;
      requestAnimationFrame(() => {
        elements.forEach(el => {
          const tx = cx * (parseFloat(el.dataset.parallaxIntensity || intensity) * 100);
          const ty = cy * (parseFloat(el.dataset.parallaxIntensity || intensity) * 100);
          el.style.transform = `translate(${tx}px, ${ty}px)`;
        });
        ticking = false;
      });
    }

    document.addEventListener('mousemove', onMouseMove);

    this.cleaners.push(() => {
      document.removeEventListener('mousemove', onMouseMove);
      elements.forEach(el => el.style.transform = '');
    });
  },

  /* ===== FLOATING GLASS ELEMENTS ===== */
  initFloatingGlass(containerId) {
    const container = document.getElementById(containerId);
    if (!container) return;
    const mobile = this.isMobile();
    const count = mobile ? 4 : 8;
    const self = this;

    const shapes = ['circle', 'square', 'triangle'];
    const sizes = mobile ? ['4rem', '6rem', '5rem'] : ['6rem', '10rem', '8rem', '5rem', '12rem'];

    for (let i = 0; i < count; i++) {
      const el = document.createElement('div');
      const shape = shapes[~~(Math.random() * shapes.length)];
      const size = sizes[~~(Math.random() * sizes.length)];
      const x = self.rand(5, 90);
      const y = self.rand(5, 85);
      const dur = self.rand(8, 16);
      const delay = self.rand(0, 5);
      const blurAmt = self.rand(4, 12);

      el.className = 'floating-glass';
      el.style.cssText = `
        position: absolute;
        width: ${size};
        height: ${size};
        left: ${x}%;
        top: ${y}%;
        background: radial-gradient(circle at 30% 30%,
          rgba(255,255,255,${self.rand(0.04, 0.08)}),
          rgba(236,72,153,${self.rand(0.02, 0.05)}),
          transparent 70%
        );
        border-radius: ${shape === 'circle' ? '50%' : shape === 'square' ? '20%' : '40% 10% 40% 10%'};
        backdrop-filter: blur(${blurAmt}px);
        -webkit-backdrop-filter: blur(${blurAmt}px);
        border: 1px solid rgba(255,255,255,${self.rand(0.04, 0.1)});
        animation: glassFloat ${dur}s ease-in-out infinite;
        animation-delay: ${delay}s;
        pointer-events: none;
        z-index: 0;
        transform: rotate(${self.rand(0, 360)}deg);
        box-shadow: 0 0 ${self.rand(20, 60)}px rgba(236,72,153,${self.rand(0.02, 0.06)}), inset 0 0 ${self.rand(10, 30)}px rgba(255,255,255,${self.rand(0.02, 0.05)});
      `;
      container.appendChild(el);
    }
  },

  /* ===== SHINE SWEEP ===== */
  initShineSweep() {
    const self = this;
    self.qsa('.twin-card').forEach(card => {
      const shine = document.createElement('div');
      shine.className = 'shine-sweep';
      card.appendChild(shine);
    });
  },

  /* ===== ENHANCED TILT EFFECT ===== */
  initTiltEffect() {
    const self = this;
    self.qsa('[data-tilt]').forEach(el => {
      let timeout;

      el.addEventListener('mousemove', e => {
        const rect = el.getBoundingClientRect();
        const x = (e.clientX - rect.left) / rect.width - 0.5;
        const y = (e.clientY - rect.top) / rect.height - 0.5;
        el.style.setProperty('--rotX', (-y * 14) + 'deg');
        el.style.setProperty('--rotY', (x * 14) + 'deg');

        const shine = el.querySelector('.shine-sweep');
        if (shine) {
          const px = (e.clientX - rect.left) / rect.width * 100;
          const py = (e.clientY - rect.top) / rect.height * 100;
          shine.style.setProperty('--sx', px + '%');
          shine.style.setProperty('--sy', py + '%');
          shine.style.opacity = '1';
        }
      });

      el.addEventListener('mouseleave', () => {
        el.style.setProperty('--rotX', '0deg');
        el.style.setProperty('--rotY', '0deg');
        const shine = el.querySelector('.shine-sweep');
        if (shine) {
          shine.style.opacity = '0';
        }
      });
    });
  },

  /* ===== SCROLL REVEAL OBSERVER ===== */
  initScrollReveal() {
    const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (!entry.isIntersecting) return;
        const el = entry.target;
        const delay = parseInt(el.dataset.revealDelay || 0);
        const anim = el.dataset.revealAnim || 'fadeInUp';

        if (reducedMotion) {
          el.style.opacity = '1';
          el.style.transform = 'none';
        } else {
          setTimeout(() => {
            el.classList.add('animate__animated', `animate__${anim}`, 'animate__fast');
          }, delay);
        }
        observer.unobserve(el);
      });
    }, { threshold: 0.1 });

    document.querySelectorAll('[data-reveal]').forEach(el => {
      observer.observe(el);
    });

    this.cleaners.push(() => observer.disconnect());
  },

  /* ===== SPARKLE TRAIL ENHANCED ===== */
  initSparkleTrail() {
    const trail = document.createElement('div');
    trail.style.cssText = 'position:fixed;inset:0;pointer-events:none;z-index:9998;';
    document.body.appendChild(trail);
    let lastX = 0, lastY = 0;
    let throttle = 0;
    const self = this;

    function onMove(e) {
      const now = Date.now();
      if (now - throttle < 30) return;
      throttle = now;
      const x = e.clientX, y = e.clientY;
      const dist = Math.hypot(x - lastX, y - lastY);
      lastX = x; lastY = y;
      if (dist < 5) return;

      const count = Math.min(Math.floor(dist / 3), 3);
      for (let i = 0; i < count; i++) {
        const spark = document.createElement('div');
        const size = self.rand(3, 10);
        const colors = ['#ec4899', '#a855f7', '#fbbf24', '#fce4ec', '#fff', '#f472b6', '#818cf8'];
        const color = colors[Math.floor(Math.random() * colors.length)];
        const offX = self.rand(-8, 8);
        const offY = self.rand(-8, 8);
        spark.style.cssText = `
          position:absolute;
          width:${size}px;
          height:${size}px;
          background:${color};
          border-radius:50%;
          left:${x + offX}px;
          top:${y + offY}px;
          filter:blur(${self.rand(0.5, 3)}px);
          opacity:${self.rand(0.4, 0.9)};
          pointer-events:none;
          z-index:9999;
          transition:transform ${self.rand(0.4, 0.8)}s ease-out, opacity ${self.rand(0.4, 0.8)}s ease-out;
          transform:scale(1);
        `;
        trail.appendChild(spark);
        requestAnimationFrame(() => {
          spark.style.transform = `translate(${self.rand(-40, 40)}px, ${self.rand(-40, 40)}px) scale(0)`;
          spark.style.opacity = '0';
        });
        setTimeout(() => spark.remove(), 800);
      }
    }

    document.addEventListener('mousemove', onMove);
    this.cleaners.push(() => {
      document.removeEventListener('mousemove', onMove);
      trail.remove();
    });
  },

  initBalloons(containerId, count) {
    const container = document.getElementById(containerId);
    if (!container) return;
    count = count || 8;
    const emojis = ['🎈', '🎈', '🎈', '🎈', '🎈'];
    const self = this;
    for (let i = 0; i < count; i++) {
      const el = document.createElement('div');
      el.className = 'floating-balloon';
      el.textContent = emojis[i % emojis.length];
      el.style.left = self.rand(5, 90) + 'vw';
      el.style.setProperty('--dur', (5 + self.rand(0, 4)) + 's');
      el.style.setProperty('--delay', self.rand(0, 3) + 's');
      el.style.fontSize = self.rand(1.8, 3.5) + 'rem';
      el.style.opacity = self.rand(0.3, 0.6);
      container.appendChild(el);
    }
    this.cleaners.push(() => {
      self.qsa('.floating-balloon', container).forEach(b => b.remove());
    });
  },

  initHeroCelebration(heroId) {
    const container = document.getElementById(heroId);
    if (!container) return;
    const self = this;
    const mobile = this.isMobile();
    const count = mobile ? 4 : 8;

    for (let i = 0; i < count; i++) {
      const el = document.createElement('div');
      const isBalloon = Math.random() < 0.6;
      el.textContent = isBalloon ? '🎈' : ['✨', '⭐', '🌟', '💫', '🎉'][~~(Math.random() * 5)];
      el.style.cssText = `
        position:absolute;
        font-size:${self.rand(isBalloon ? 2 : 1.5, isBalloon ? 3.5 : 2.5)}rem;
        left:${self.rand(3, 95)}%;
        bottom:${self.rand(-10, 50)}px;
        pointer-events:none;
        z-index:4;
        opacity:${self.rand(0.3, 0.7)};
        animation:${isBalloon ? 'floatBalloon' : 'twinkle'} ${self.rand(5, 9)}s ease-in-out infinite;
        animation-delay:${self.rand(0, 4)}s;
        filter:drop-shadow(0 4px 12px rgba(0,0,0,0.3));
      `;
      container.appendChild(el);
    }
    this.cleaners.push(() => {
      self.qsa('.hero-balloon', container).forEach(b => b.remove());
    });
  },

  initOrbs(canvasId) {
    const canvas = document.getElementById(canvasId);
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    let orbs = [];
    let running = true;
    let animId;
    const mobile = this.isMobile();
    const count = mobile ? 4 : 8;

    function resize() {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    }

    function createOrb() {
      const colors = [
        'rgba(236, 72, 153, {{a}})',
        'rgba(168, 85, 247, {{a}})',
        'rgba(251, 191, 36, {{a}})',
        'rgba(244, 63, 94, {{a}})',
        'rgba(147, 197, 253, {{a}})',
        'rgba(244, 114, 182, {{a}})',
        'rgba(129, 140, 248, {{a}})'
      ];
      return {
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        r: 40 + Math.random() * (mobile ? 100 : 150),
        vx: (Math.random() - 0.5) * 0.25,
        vy: (Math.random() - 0.5) * 0.25,
        color: colors[Math.floor(Math.random() * colors.length)],
        alpha: 0.04 + Math.random() * 0.07,
        phase: Math.random() * Math.PI * 2
      };
    }

    function animate() {
      if (!running) return;
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      const time = Date.now() * 0.0005;
      for (const o of orbs) {
        o.x += o.vx;
        o.y += o.vy;
        if (o.x < -o.r || o.x > canvas.width + o.r) o.vx *= -1;
        if (o.y < -o.r || o.y > canvas.height + o.r) o.vy *= -1;
        const pulse = Math.sin(time + o.phase) * 0.3 + 0.7;
        const grad = ctx.createRadialGradient(o.x, o.y, 0, o.x, o.y, o.r);
        const c = o.color.replace('{{a}}', (o.alpha * pulse).toString());
        grad.addColorStop(0, c);
        grad.addColorStop(0.4, o.color.replace('{{a}}', (o.alpha * pulse * 0.3).toString()));
        grad.addColorStop(1, 'rgba(0,0,0,0)');
        ctx.beginPath();
        ctx.arc(o.x, o.y, o.r, 0, Math.PI * 2);
        ctx.fillStyle = grad;
        ctx.fill();
      }
      animId = requestAnimationFrame(animate);
    }

    window.addEventListener('resize', resize);
    resize();
    for (let i = 0; i < count; i++) orbs.push(createOrb());
    animate();

    this.cleaners.push(() => {
      running = false;
      if (animId) cancelAnimationFrame(animId);
      window.removeEventListener('resize', resize);
    });
  },

  createFloatingEmojis(emojis, count) {
    count = count || 8;
    const self = this;
    for (let i = 0; i < count; i++) {
      const el = document.createElement('div');
      el.textContent = emojis[i % emojis.length];
      el.style.cssText = `
        position:fixed;
        font-size:${self.rand(1.5, 3)}rem;
        left:${self.rand(5, 90)}vw;
        bottom:-3rem;
        pointer-events:none;
        z-index:3;
        animation:floatUp ${self.rand(6, 12)}s ease-in forwards;
        animation-delay:${self.rand(0, 3)}s;
        opacity:0;
      `;
      document.body.appendChild(el);
      setTimeout(() => el.remove(), 15000);
    }
  },

  cleanup() {
    for (const fn of this.cleaners) fn();
    this.cleaners = [];
  }
};
