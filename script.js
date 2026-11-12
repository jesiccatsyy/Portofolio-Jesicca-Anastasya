// ===== Mobile menu toggle =====
const burger = document.getElementById('burger');
const navLinks = document.getElementById('navLinks');

if (burger && navLinks) {
  burger.addEventListener('click', () => {
    const isOpen = navLinks.classList.toggle('open');
    burger.setAttribute('aria-expanded', isOpen);
  });

  navLinks.querySelectorAll('a').forEach(link => {
    link.addEventListener('click', () => {
      navLinks.classList.remove('open');
      burger.setAttribute('aria-expanded', 'false');
    });
  });
}

// ===== Active nav link on scroll (homepage only) =====
const isProjectPage = document.querySelector('.project-page');
const sections = document.querySelectorAll('main section[id]');
const navItems = document.querySelectorAll('.nav-links a');

if (!isProjectPage) {
  window.addEventListener('scroll', () => {
    let current = '';
    sections.forEach(section => {
      const sectionTop = section.offsetTop - 130;
      if (window.scrollY >= sectionTop) {
        current = section.getAttribute('id');
      }
    });
    navItems.forEach(item => {
      item.classList.remove('active');
      if (item.getAttribute('href') === `#${current}`) {
        item.classList.add('active');
      }
    });
  });
}

// ===== Fade-in on scroll =====
const revealEls = document.querySelectorAll('.reveal');

if ('IntersectionObserver' in window) {
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('in-view');
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.12 });

  revealEls.forEach(el => observer.observe(el));
} else {
  revealEls.forEach(el => el.classList.add('in-view'));
}

// ===== Experience tabs (homepage) =====
const tabButtons = document.querySelectorAll('.tab-btn');

function activateTab(btn) {
  tabButtons.forEach(b => {
    const isActive = b === btn;
    b.classList.toggle('active', isActive);
    b.setAttribute('aria-selected', isActive);
    b.setAttribute('tabindex', isActive ? '0' : '-1');
    document.getElementById(b.getAttribute('aria-controls')).hidden = !isActive;
  });
}

tabButtons.forEach((btn, i) => {
  btn.addEventListener('click', () => activateTab(btn));
  btn.addEventListener('keydown', (e) => {
    if (e.key !== 'ArrowRight' && e.key !== 'ArrowLeft') return;
    const next = tabButtons[(i + (e.key === 'ArrowRight' ? 1 : -1) + tabButtons.length) % tabButtons.length];
    activateTab(next);
    next.focus();
  });
});

// ===== Project page tabs =====
const pjTabs = document.querySelectorAll('.pj-tab');

function activatePjTab(tab, updateHash = true) {
  pjTabs.forEach(t => {
    const on = t === tab;
    t.classList.toggle('active', on);
    t.setAttribute('aria-selected', on);
    t.setAttribute('tabindex', on ? '0' : '-1');
    document.getElementById(t.getAttribute('aria-controls')).hidden = !on;
  });
  if (updateHash) {
    try {
      history.replaceState(null, '', '#' + tab.getAttribute('aria-controls'));
    } catch (e) {
      /* some browsers block this when the page is opened as a local file; safe to ignore */
    }
  }
}

pjTabs.forEach((tab, i) => {
  tab.addEventListener('click', () => activatePjTab(tab));
  tab.addEventListener('keydown', e => {
    if (e.key !== 'ArrowRight' && e.key !== 'ArrowLeft') return;
    const next = pjTabs[(i + (e.key === 'ArrowRight' ? 1 : -1) + pjTabs.length) % pjTabs.length];
    activatePjTab(next);
    next.focus();
  });
});

// Open a tab straight from the URL, e.g. project-fileshare.html#p-security
const fromHash = [...pjTabs].find(t => '#' + t.getAttribute('aria-controls') === location.hash);
if (fromHash) activatePjTab(fromHash, false);

// ===== Project screenshots: placeholder + zoom =====
function showPlaceholder(img) {
  const box = document.createElement('div');
  box.className = 'img-placeholder';
  const file = img.getAttribute('src');
  box.innerHTML = '<i class="fa-regular fa-image"></i><span>Add photo:</span><code></code>';
  box.querySelector('code').textContent = file;
  img.replaceWith(box);
}

document.querySelectorAll('.pj-figure img').forEach(img => {
  img.addEventListener('error', () => showPlaceholder(img));
  if (img.complete && img.naturalWidth === 0 && img.getAttribute('loading') !== 'lazy') showPlaceholder(img);

  img.addEventListener('click', () => {
    const box = document.createElement('div');
    box.className = 'img-lightbox';
    box.innerHTML = '<img alt="">';
    box.querySelector('img').src = img.src;
    box.querySelector('img').alt = img.alt;
    box.addEventListener('click', () => box.remove());
    document.addEventListener('keydown', function esc(e) {
      if (e.key === 'Escape') { box.remove(); document.removeEventListener('keydown', esc); }
    });
    document.body.appendChild(box);
  });
});