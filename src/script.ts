const navToggle = document.getElementById('nav-toggle') as HTMLButtonElement | null;
const navLinks = document.getElementById('nav-links') as HTMLElement | null;

const contactForm = document.getElementById('contact-form') as HTMLFormElement | null;
if (contactForm) {
  contactForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const name = (document.getElementById('name') as HTMLInputElement | null)?.value || '';
    const email = (document.getElementById('email') as HTMLInputElement | null)?.value || '';
    const message = (document.getElementById('message') as HTMLTextAreaElement | null)?.value || '';
    const subject = encodeURIComponent(`Bericht van ${name}`);
    const body = encodeURIComponent(`${message}\n\nVan: ${name} (${email})`);
    window.location.href = `mailto:erenozturql@gmail.com?subject=${subject}&body=${body}`;
  });
}

navToggle?.addEventListener('click', () => {
  const expanded = navToggle.getAttribute('aria-expanded') === 'true';
  navToggle.setAttribute('aria-expanded', String(!expanded));
  if (navLinks) navLinks.style.display = expanded ? 'none' : 'flex';
});

if (navLinks) {
  navLinks.querySelectorAll('a').forEach((a) => {
    a.addEventListener('click', () => {
      if (window.innerWidth <= 800 && navLinks) navLinks.style.display = 'none';
      if (navToggle) navToggle.setAttribute('aria-expanded', 'false');
    });
  });
}
