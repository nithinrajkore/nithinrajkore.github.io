/* =========================================
   Nithin Raj Kore — Portfolio JS
   Interactive layer: cursor, particles, tilt,
   reveal observer, counters, filters, cmdk
   ========================================= */

(() => {
  'use strict';

  /* ---------- Year ---------- */
  const yearEl = document.getElementById('year');
  if (yearEl) yearEl.textContent = new Date().getFullYear();

  /* ---------- Custom Cursor ---------- */
  const glow = document.getElementById('cursorGlow');
  const dot = document.getElementById('cursorDot');
  let mx = window.innerWidth / 2, my = window.innerHeight / 2;
  let gx = mx, gy = my;
  const isTouch = window.matchMedia('(pointer: coarse)').matches;

  if (!isTouch && glow && dot) {
    document.addEventListener('mousemove', (e) => {
      mx = e.clientX; my = e.clientY;
      dot.style.transform = `translate(${mx}px, ${my}px) translate(-50%, -50%)`;
    });
    const animateGlow = () => {
      gx += (mx - gx) * 0.12;
      gy += (my - gy) * 0.12;
      glow.style.transform = `translate(${gx}px, ${gy}px) translate(-50%, -50%)`;
      requestAnimationFrame(animateGlow);
    };
    animateGlow();

    const hoverables = 'a, button, .skill-tags span, .project-card, .filter-btn, .contact-item, .dot-link';
    document.querySelectorAll(hoverables).forEach(el => {
      el.addEventListener('mouseenter', () => dot.classList.add('hovering'));
      el.addEventListener('mouseleave', () => dot.classList.remove('hovering'));
    });
  }

  /* ---------- Scroll Progress ---------- */
  const progress = document.getElementById('scrollProgress');
  const updateProgress = () => {
    const h = document.documentElement;
    const scrolled = h.scrollTop / (h.scrollHeight - h.clientHeight);
    if (progress) progress.style.width = (scrolled * 100) + '%';
  };
  document.addEventListener('scroll', updateProgress, { passive: true });
  updateProgress();

  /* ---------- Particle Canvas ---------- */
  const canvas = document.getElementById('particleCanvas');
  if (canvas && !window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    const ctx = canvas.getContext('2d');
    let W, H, particles;
    const PCOUNT = window.innerWidth < 700 ? 28 : 60;

    const resize = () => {
      W = canvas.width = window.innerWidth;
      H = canvas.height = window.innerHeight;
    };
    window.addEventListener('resize', resize);
    resize();

    const initParticles = () => {
      particles = Array.from({ length: PCOUNT }, () => ({
        x: Math.random() * W,
        y: Math.random() * H,
        vx: (Math.random() - 0.5) * 0.3,
        vy: (Math.random() - 0.5) * 0.3,
        r: Math.random() * 1.6 + 0.5,
        op: Math.random() * 0.5 + 0.2
      }));
    };
    initParticles();

    const draw = () => {
      ctx.clearRect(0, 0, W, H);
      // links
      for (let i = 0; i < particles.length; i++) {
        const p = particles[i];
        p.x += p.vx; p.y += p.vy;
        if (p.x < 0 || p.x > W) p.vx *= -1;
        if (p.y < 0 || p.y > H) p.vy *= -1;

        for (let j = i + 1; j < particles.length; j++) {
          const q = particles[j];
          const dx = p.x - q.x, dy = p.y - q.y;
          const dist = Math.sqrt(dx*dx + dy*dy);
          if (dist < 130) {
            const op = (1 - dist / 130) * 0.18;
            ctx.strokeStyle = `rgba(255, 23, 68, ${op})`;
            ctx.lineWidth = 0.6;
            ctx.beginPath();
            ctx.moveTo(p.x, p.y);
            ctx.lineTo(q.x, q.y);
            ctx.stroke();
          }
        }

        // mouse interaction
        const mdx = p.x - mx, mdy = p.y - my;
        const mdist = Math.sqrt(mdx*mdx + mdy*mdy);
        if (mdist < 160) {
          const op = (1 - mdist / 160) * 0.45;
          ctx.strokeStyle = `rgba(255, 87, 112, ${op})`;
          ctx.lineWidth = 0.8;
          ctx.beginPath();
          ctx.moveTo(p.x, p.y);
          ctx.lineTo(mx, my);
          ctx.stroke();
        }

        ctx.fillStyle = `rgba(255, 23, 68, ${p.op})`;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        ctx.fill();
      }
      requestAnimationFrame(draw);
    };
    draw();
  }

  /* ---------- Typing Animation ---------- */
  const typedEl = document.getElementById('typed');
  if (typedEl) {
    const phrases = [
      'production LLM agents.',
      'RAG pipelines at scale.',
      'end-to-end ML systems.',
      'data platforms on the cloud.',
      'AI products that ship.'
    ];
    let pIdx = 0, cIdx = 0, deleting = false;
    const tick = () => {
      const cur = phrases[pIdx];
      if (!deleting) {
        cIdx++;
        typedEl.textContent = cur.slice(0, cIdx);
        if (cIdx === cur.length) {
          deleting = true;
          setTimeout(tick, 1800);
          return;
        }
        setTimeout(tick, 60 + Math.random() * 60);
      } else {
        cIdx--;
        typedEl.textContent = cur.slice(0, cIdx);
        if (cIdx === 0) {
          deleting = false;
          pIdx = (pIdx + 1) % phrases.length;
        }
        setTimeout(tick, 30);
      }
    };
    tick();
  }

  /* ---------- Reveal Observer ---------- */
  const revealEls = document.querySelectorAll('.reveal');
  const revealObs = new IntersectionObserver((entries) => {
    entries.forEach(e => {
      if (e.isIntersecting) {
        e.target.classList.add('visible');
        revealObs.unobserve(e.target);
      }
    });
  }, { threshold: 0.12, rootMargin: '0px 0px -60px 0px' });
  revealEls.forEach(el => revealObs.observe(el));

  /* ---------- Counter Animation ---------- */
  const counters = document.querySelectorAll('[data-counter]');
  const counterObs = new IntersectionObserver((entries) => {
    entries.forEach(e => {
      if (e.isIntersecting) {
        const el = e.target;
        const target = parseInt(el.dataset.counter, 10);
        const dur = 1400;
        const start = performance.now();
        const animate = (now) => {
          const t = Math.min(1, (now - start) / dur);
          const eased = 1 - Math.pow(1 - t, 3);
          el.textContent = Math.floor(eased * target);
          if (t < 1) requestAnimationFrame(animate);
          else el.textContent = target;
        };
        requestAnimationFrame(animate);
        counterObs.unobserve(el);
      }
    });
  }, { threshold: 0.4 });
  counters.forEach(el => counterObs.observe(el));

  /* ---------- Skill Bar Fill on Reveal ---------- */
  const skillFills = document.querySelectorAll('.skill-fill');
  const skillObs = new IntersectionObserver((entries) => {
    entries.forEach(e => {
      if (e.isIntersecting) {
        const lvl = e.target.dataset.level || 80;
        e.target.style.width = lvl + '%';
        skillObs.unobserve(e.target);
      }
    });
  }, { threshold: 0.4 });
  skillFills.forEach(el => skillObs.observe(el));

  /* ---------- 3D Tilt ---------- */
  const tilts = document.querySelectorAll('[data-tilt]');
  tilts.forEach(card => {
    card.addEventListener('mousemove', (e) => {
      const r = card.getBoundingClientRect();
      const x = e.clientX - r.left;
      const y = e.clientY - r.top;
      const cx = r.width / 2, cy = r.height / 2;
      const rx = ((y - cy) / cy) * -4;
      const ry = ((x - cx) / cx) * 4;
      card.style.transform = `perspective(1000px) rotateX(${rx}deg) rotateY(${ry}deg) translateZ(0)`;
      card.style.setProperty('--mx', `${(x / r.width) * 100}%`);
      card.style.setProperty('--my', `${(y / r.height) * 100}%`);
    });
    card.addEventListener('mouseleave', () => {
      card.style.transform = '';
    });
  });

  /* ---------- Magnetic Buttons ---------- */
  const magnetic = (selector, strength) => {
    document.querySelectorAll(selector).forEach(el => {
      el.addEventListener('mousemove', (e) => {
        const r = el.getBoundingClientRect();
        const x = e.clientX - r.left - r.width / 2;
        const y = e.clientY - r.top - r.height / 2;
        el.style.transform = `translate(${x * strength}px, ${y * strength}px)`;
      });
      el.addEventListener('mouseleave', () => { el.style.transform = ''; });
    });
  };
  if (!isTouch) {
    magnetic('.magnetic', 0.18);
    magnetic('.magnetic-sm', 0.25);
  }

  /* ---------- Project Filters ---------- */
  const filterBtns = document.querySelectorAll('.filter-btn');
  const projectCards = document.querySelectorAll('.project-card');
  filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      const filter = btn.dataset.filter;
      filterBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      projectCards.forEach(card => {
        const cats = (card.dataset.categories || '').split(' ');
        const show = filter === 'all' || cats.includes(filter);
        card.style.opacity = '0';
        card.style.transform = 'translateY(10px) scale(0.98)';
        setTimeout(() => {
          card.classList.toggle('hidden', !show);
          if (show) {
            requestAnimationFrame(() => {
              card.style.opacity = '';
              card.style.transform = '';
            });
          }
        }, 200);
      });
    });
  });

  // Update count of "all"
  const countAll = document.getElementById('count-all');
  if (countAll) countAll.textContent = projectCards.length;

  /* ---------- Section Active in Side Indicator + Nav ---------- */
  const sections = ['top', 'about', 'skills', 'experience', 'education', 'projects', 'contact'];
  const dotLinks = document.querySelectorAll('.dot-link');
  const navLinks = document.querySelectorAll('.nav-links a[data-nav]');
  const sectionObs = new IntersectionObserver((entries) => {
    entries.forEach(e => {
      if (e.isIntersecting) {
        const id = e.target.id;
        dotLinks.forEach((d, i) => d.classList.toggle('active', sections[i] === id));
        navLinks.forEach(a => a.classList.toggle('active', a.dataset.nav === id));
      }
    });
  }, { threshold: 0.4 });
  sections.forEach(id => {
    const el = document.getElementById(id);
    if (el) sectionObs.observe(el);
  });

  /* ---------- Mobile Nav Toggle ---------- */
  const navToggle = document.getElementById('navToggle');
  const navLinksWrap = document.querySelector('.nav-links');
  if (navToggle && navLinksWrap) {
    navToggle.addEventListener('click', () => {
      navToggle.classList.toggle('open');
      navLinksWrap.classList.toggle('open');
    });
    navLinksWrap.querySelectorAll('a').forEach(a => {
      a.addEventListener('click', () => {
        navToggle.classList.remove('open');
        navLinksWrap.classList.remove('open');
      });
    });
  }

  /* ---------- Command Palette (⌘K) ---------- */
  const cmdkOverlay = document.getElementById('cmdkOverlay');
  const cmdkInput = document.getElementById('cmdkInput');
  const cmdkList = document.getElementById('cmdkList');
  const cmdkOpen = document.getElementById('cmdkOpen');

  const cmdkItems = [
    { title: 'Home', sub: 'Hero section', href: '#top', icon: 'home' },
    { title: 'About', sub: 'Background & summary', href: '#about', icon: 'info' },
    { title: 'Skills', sub: 'GenAI · ML · Data · Cloud', href: '#skills', icon: 'sparkles' },
    { title: 'Experience', sub: 'Key Pixel · Infosys', href: '#experience', icon: 'briefcase' },
    { title: 'Education', sub: 'University at Buffalo · Vasavi', href: '#education', icon: 'edu' },
    { title: 'Projects', sub: 'Open-source repos', href: '#projects', icon: 'code' },
    { title: 'Contact', sub: 'Email, LinkedIn, GitHub', href: '#contact', icon: 'mail' },
    { title: 'Send Email', sub: 'nithinrajkore1997@gmail.com', href: 'mailto:nithinrajkore1997@gmail.com', icon: 'mail', external: true },
    { title: 'GitHub', sub: 'github.com/nithinrajkore', href: 'https://github.com/nithinrajkore', icon: 'github', external: true },
    { title: 'LinkedIn', sub: 'linkedin.com/in/nithinrajkore', href: 'https://www.linkedin.com/in/nithinrajkore/', icon: 'linkedin', external: true },
    { title: 'PD AI Agent', sub: 'Featured · LLM agent for EDA', href: 'https://github.com/nithinrajkore/PD_AI_AGENT', icon: 'project', external: true },
    { title: 'PDF Data Analyzer', sub: 'RAG · LangChain · Gemini', href: 'https://github.com/nithinrajkore/PDF-DataAnalyzer', icon: 'project', external: true },
    { title: 'HealthCentral Hub', sub: 'BI · Conversational AI', href: 'https://github.com/nithinrajkore/healthcentral-prototype', icon: 'project', external: true },
    { title: 'Deep Learning Suite', sub: 'ANN & CNN', href: 'https://github.com/nithinrajkore/Deep-Learning', icon: 'project', external: true }
  ];

  const iconSvg = {
    home: '<path d="M3 12l9-9 9 9M5 10v10h14V10"/>',
    info: '<circle cx="12" cy="12" r="10"/><path d="M12 16v-4M12 8h.01"/>',
    sparkles: '<path d="M12 3l1.5 4.5L18 9l-4.5 1.5L12 15l-1.5-4.5L6 9l4.5-1.5L12 3z"/>',
    briefcase: '<rect x="3" y="7" width="18" height="13" rx="2"/><path d="M8 7V5a2 2 0 012-2h4a2 2 0 012 2v2"/>',
    edu: '<path d="M22 10v6M2 10l10-5 10 5-10 5z"/><path d="M6 12v5c3 3 9 3 12 0v-5"/>',
    code: '<polyline points="16 18 22 12 16 6"/><polyline points="8 6 2 12 8 18"/>',
    mail: '<path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/><polyline points="22,6 12,13 2,6"/>',
    github: '<path d="M9 19c-5 1.5-5-2.5-7-3m14 6v-3.87a3.37 3.37 0 0 0-.94-2.61c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0 0 20 4.77 5.07 5.07 0 0 0 19.91 1S18.73.65 16 2.48a13.38 13.38 0 0 0-7 0C6.27.65 5.09 1 5.09 1A5.07 5.07 0 0 0 5 4.77a5.44 5.44 0 0 0-1.5 3.78c0 5.42 3.3 6.61 6.44 7A3.37 3.37 0 0 0 9 18.13V22"/>',
    linkedin: '<path d="M16 8a6 6 0 016 6v7h-4v-7a2 2 0 00-4 0v7h-4v-7a6 6 0 016-6z"/><rect x="2" y="9" width="4" height="12"/><circle cx="4" cy="4" r="2"/>',
    project: '<path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/>'
  };

  let cmdkSelected = 0;
  const renderCmdk = (q = '') => {
    const filtered = cmdkItems.filter(it =>
      it.title.toLowerCase().includes(q.toLowerCase()) ||
      it.sub.toLowerCase().includes(q.toLowerCase())
    );
    cmdkList.innerHTML = filtered.length === 0
      ? `<div style="padding:24px;text-align:center;color:var(--gray-2);font-size:13px;">No results for "${q}"</div>`
      : filtered.map((it, i) => `
        <div class="cmdk-item${i === cmdkSelected ? ' selected' : ''}" data-href="${it.href}" data-external="${it.external || false}" data-i="${i}">
          <div class="cmdk-icon"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">${iconSvg[it.icon] || ''}</svg></div>
          <div class="cmdk-meta">
            <div class="cmdk-title">${it.title}</div>
            <div class="cmdk-sub">${it.sub}</div>
          </div>
        </div>
      `).join('');
    return filtered;
  };

  const openCmdk = () => {
    cmdkOverlay.classList.add('open');
    cmdkInput.value = '';
    cmdkSelected = 0;
    renderCmdk('');
    setTimeout(() => cmdkInput.focus(), 50);
  };
  const closeCmdk = () => cmdkOverlay.classList.remove('open');

  const goToItem = (item) => {
    closeCmdk();
    if (item.external) {
      if (item.href.startsWith('mailto:')) window.location.href = item.href;
      else window.open(item.href, '_blank', 'noopener');
    } else {
      const el = document.querySelector(item.href);
      if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  if (cmdkOverlay && cmdkInput && cmdkList) {
    if (cmdkOpen) cmdkOpen.addEventListener('click', openCmdk);

    document.addEventListener('keydown', (e) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        cmdkOverlay.classList.contains('open') ? closeCmdk() : openCmdk();
      } else if (e.key === 'Escape' && cmdkOverlay.classList.contains('open')) {
        closeCmdk();
      }
    });

    cmdkInput.addEventListener('input', () => {
      cmdkSelected = 0;
      renderCmdk(cmdkInput.value);
    });

    cmdkInput.addEventListener('keydown', (e) => {
      const filtered = cmdkItems.filter(it =>
        it.title.toLowerCase().includes(cmdkInput.value.toLowerCase()) ||
        it.sub.toLowerCase().includes(cmdkInput.value.toLowerCase())
      );
      if (e.key === 'ArrowDown') {
        e.preventDefault();
        cmdkSelected = (cmdkSelected + 1) % Math.max(filtered.length, 1);
        renderCmdk(cmdkInput.value);
      } else if (e.key === 'ArrowUp') {
        e.preventDefault();
        cmdkSelected = (cmdkSelected - 1 + filtered.length) % Math.max(filtered.length, 1);
        renderCmdk(cmdkInput.value);
      } else if (e.key === 'Enter') {
        e.preventDefault();
        if (filtered[cmdkSelected]) goToItem(filtered[cmdkSelected]);
      }
    });

    cmdkList.addEventListener('click', (e) => {
      const item = e.target.closest('.cmdk-item');
      if (!item) return;
      const i = parseInt(item.dataset.i, 10);
      const filtered = cmdkItems.filter(it =>
        it.title.toLowerCase().includes(cmdkInput.value.toLowerCase()) ||
        it.sub.toLowerCase().includes(cmdkInput.value.toLowerCase())
      );
      if (filtered[i]) goToItem(filtered[i]);
    });

    cmdkOverlay.addEventListener('click', (e) => {
      if (e.target === cmdkOverlay) closeCmdk();
    });
  }

  /* ---------- Konami secret (because why not) ---------- */
  const konami = ['ArrowUp','ArrowUp','ArrowDown','ArrowDown','ArrowLeft','ArrowRight','ArrowLeft','ArrowRight','b','a'];
  let kIdx = 0;
  document.addEventListener('keydown', (e) => {
    if (e.key === konami[kIdx]) {
      kIdx++;
      if (kIdx === konami.length) {
        document.body.style.transition = 'filter 0.6s';
        document.body.style.filter = 'hue-rotate(180deg)';
        setTimeout(() => { document.body.style.filter = ''; }, 2400);
        kIdx = 0;
      }
    } else {
      kIdx = 0;
    }
  });

})();
