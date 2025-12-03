const navToggle = document.querySelector('.nav-toggle');
const nav = document.querySelector('.nav');
if (navToggle && nav) {
  navToggle.addEventListener('click', () => {
    const expanded = nav.getAttribute('aria-expanded') === 'true';
    nav.setAttribute('aria-expanded', String(!expanded));
    navToggle.setAttribute('aria-expanded', String(!expanded));
  });
}

document.getElementById('ano').textContent = new Date().getFullYear();

const brandImg = document.querySelector('.brand img');
const brandText = document.querySelector('.brand__text');
if (brandImg) {
  let tried = 0;
  const exts = ['.png', '.jpg', '.jpeg', '.webp', '.svg'];
  brandImg.addEventListener('error', () => {
    const src = brandImg.getAttribute('src');
    const idx = exts.findIndex((e) => src.endsWith(e));
    const nextIdx = idx >= 0 ? idx + 1 : 1;
    if (tried < exts.length - 1) {
      const base = src.replace(/\.(png|jpg|jpeg|webp|svg)$/i, '');
      brandImg.src = `${base}${exts[nextIdx]}`;
      tried++;
    } else {
      brandImg.style.display = 'none';
      if (brandText) brandText.style.display = 'inline-block';
    }
  });
}

const contactForm = document.getElementById('contact-form');
const contactStatus = document.getElementById('contact-status');
if (contactForm && contactStatus) {
  contactForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    const btn = contactForm.querySelector('button[type="submit"]');
    btn.disabled = true;
    contactStatus.textContent = 'Enviando...';
    contactStatus.className = 'form-status is-visible';
    const endpoint = contactForm.dataset.endpoint || 'https://postman-echo.com/post';
    const data = {
      nome: contactForm.nome.value.trim(),
      email: contactForm.email.value.trim(),
      mensagem: contactForm.mensagem.value.trim(),
      meta: { ts: Date.now(), origem: location.href }
    };
    try {
      const res = await fetch(endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
      });
      if (!res.ok) throw new Error('Falha no envio');
      contactStatus.textContent = 'Mensagem enviada com sucesso!';
      contactStatus.className = 'form-status is-visible is-success';
      contactForm.reset();
    } catch (err) {
      contactStatus.textContent = 'Não foi possível enviar. Tente novamente.';
      contactStatus.className = 'form-status is-visible is-error';
    } finally {
      btn.disabled = false;
    }
  });
}

const backToTop = document.getElementById('backToTop');
if (backToTop) {
  const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  backToTop.addEventListener('click', () => {
    window.scrollTo({ top: 0, behavior: prefersReduced ? 'auto' : 'smooth' });
  });
  const toggleBtn = () => {
    const show = window.scrollY > 400;
    backToTop.classList.toggle('is-visible', show);
  };
  toggleBtn();
  window.addEventListener('scroll', toggleBtn, { passive: true });
}

// Fallback automático de imagens: tenta .png → .jpg → .webp
document.querySelectorAll('.project-thumb img').forEach((img) => {
  let tried = 0;
  const exts = ['.png', '.jpg', '.jpeg', '.webp'];
  img.addEventListener('error', () => {
    const src = img.getAttribute('src');
    const idx = exts.findIndex((e) => src.endsWith(e));
    const nextIdx = idx >= 0 ? idx + 1 : 1; // se não achou, tenta .jpg
    if (tried < exts.length - 1) {
      const base = src.replace(/\.(png|jpg|jpeg|webp)$/i, '');
      img.src = `${base}${exts[nextIdx]}`;
      tried++;
    } else {
      img.style.display = 'none';
    }
  });
});

const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
if (!prefersReduced) {
  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.style.transform = 'translateY(0)';
        entry.target.style.opacity = '1';
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.1 });

  document.querySelectorAll('.section').forEach((sec) => {
    sec.style.transform = 'translateY(12px)';
    sec.style.opacity = '0';
    sec.style.transition = 'transform 600ms ease, opacity 600ms ease';
    observer.observe(sec);
  });
}
