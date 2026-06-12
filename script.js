var navToggle = document.getElementById('nav-toggle');
var navLinks = document.getElementById('nav-links');
var contactForm = document.getElementById('contact-form');
if (contactForm) {
    contactForm.addEventListener('submit', function (e) {
        e.preventDefault();
        var name = (document.getElementById('name') && document.getElementById('name')).value || '';
        var email = (document.getElementById('email') && document.getElementById('email')).value || '';
        var message = (document.getElementById('message') && document.getElementById('message')).value || '';
        var subject = encodeURIComponent("Bericht van " + name);
        var body = encodeURIComponent(message + "\n\nVan: " + name + " (" + email + ")");
        window.location.href = "mailto:erenozturql@gmail.com?subject=" + subject + "&body=" + body;
    });
}
if (navToggle)
    navToggle.addEventListener('click', function () {
        var expanded = navToggle.getAttribute('aria-expanded') === 'true';
        navToggle.setAttribute('aria-expanded', String(!expanded));
        if (navLinks)
            navLinks.style.display = expanded ? 'none' : 'flex';
    });
if (navLinks) {
    navLinks.querySelectorAll('a').forEach(function (a) {
        a.addEventListener('click', function () {
            if (window.innerWidth <= 800 && navLinks)
                navLinks.style.display = 'none';
            if (navToggle)
                navToggle.setAttribute('aria-expanded', 'false');
        });
    });
}
