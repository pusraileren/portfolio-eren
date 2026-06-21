// Navigation + contact handling
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


function downloadCV() {
    var pdfPath = 'assets/cv/Eren-CV.pdf';
    fetch(pdfPath).then(function (resp) {
        if (!resp.ok) throw new Error('PDF not found (' + resp.status + ')');
        return resp.blob();
    }).then(function (blob) {
        var url = URL.createObjectURL(blob);
        var a = document.createElement('a');
        a.href = url;
        a.download = 'Eren-CV.pdf';
        document.body.appendChild(a);
        a.click();
        a.remove();
        setTimeout(function () { URL.revokeObjectURL(url); }, 1000);
    }).catch(function (err) {
        try { window.open(pdfPath, '_blank'); } catch (openErr) { alert('Could not download CV: ' + err.message); }
    });
}


function bindDownloadButton() {
    var downloadBtn = document.getElementById('download-cv');
    if (!downloadBtn) return;
    downloadBtn.addEventListener('click', function (e) { e.preventDefault(); downloadCV(); });
}

if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', bindDownloadButton);
} else {
    bindDownloadButton();
}


// ------------------ Afspraakplanner / .ics generator ------------------
function _formatDateToICS(dt) {
    // Zet Date naar YYYYMMDDTHHMMSSZ (UTC)
    return dt.toISOString().replace(/[-:]/g, '').split('.')[0] + 'Z';
}

function _downloadBlob(filename, content, mime) {
    var blob = new Blob([content], { type: mime || 'text/plain' });
    var url = URL.createObjectURL(blob);
    var a = document.createElement('a');
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    a.remove();
    setTimeout(function () { URL.revokeObjectURL(url); }, 1000);
}

function _createICS(summary, description, dtStart, dtEnd, uid) {
    var icsLines = [
        'BEGIN:VCALENDAR',
        'VERSION:2.0',
        'PRODID:-//Eren Portfolio//NL',
        'BEGIN:VEVENT',
        'UID:' + uid,
        'DTSTAMP:' + _formatDateToICS(new Date()),
        'DTSTART:' + _formatDateToICS(dtStart),
        'DTEND:' + _formatDateToICS(dtEnd),
        'SUMMARY:' + summary,
        'DESCRIPTION:' + description,
        'END:VEVENT',
        'END:VCALENDAR'
    ];
    return icsLines.join('\r\n');
}

function bindAppointmentForm() {
    var form = document.getElementById('appointment-form');
    if (!form) return;
    form.addEventListener('submit', function (e) {
        e.preventDefault();
        var name = document.getElementById('appoint-name').value || '';
        var email = document.getElementById('appoint-email').value || '';
        var date = document.getElementById('appoint-date').value; // YYYY-MM-DD
        var time = document.getElementById('appoint-time').value; // HH:MM
        var duration = parseInt(document.getElementById('appoint-duration').value, 10) || 30;
        if (!date || !time) { alert('Kies alstublieft een datum en tijd.'); return; }

        // Bouw lokale Date object en zet duur
        var localDate = new Date(date + 'T' + time);
        var dtStart = localDate;
        var dtEnd = new Date(localDate.getTime() + duration * 60000);

        var summary = 'Afspraak met ' + (name || email || 'Bezoeker');
        var description = 'Afspraakverzoek van: ' + name + ' (' + email + ')\nDuur: ' + duration + ' minuten';
        var uid = 'evt-' + Date.now() + '@eren';

        var ics = _createICS(summary, description, dtStart, dtEnd, uid);
        _downloadBlob('afspraak.ics', ics, 'text/calendar');

        // Voorgevulde e-mail naar jou (Eren) zodat bezoeker deze kan verzenden
        var owner = 'erenozturql@gmail.com';
        var subject = 'Afspraakverzoek: ' + (name || email);
        var body = 'Hallo Eren,%0D%0A%0D%0AIk wil graag een afspraak plannen.%0D%0A%0D%0ANaam: ' + encodeURIComponent(name) + '%0D%0AEmail: ' + encodeURIComponent(email) + '%0D%0ADatum en tijd (lokaal): ' + encodeURIComponent(date + ' ' + time) + '%0D%0ADuur: ' + duration + ' minuten%0D%0A%0D%0AIk heb het .ics-bestand gedownload en kan het toevoegen als bijlage voordat ik verzend.%0D%0A%0D%0AMet vriendelijke groet,%0D%0A' + encodeURIComponent(name || '') ;
        var mailto = 'mailto:' + owner + '?subject=' + encodeURIComponent(subject) + '&body=' + body;
        window.open(mailto, '_blank');
    });
}

if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', bindAppointmentForm);
} else {
    bindAppointmentForm();
}

// ------------------ Einde afspraakplanner ------------------


function setAccessibility(enabled) {
    document.body.classList.toggle('accessibility-mode', enabled);
    var btn = document.getElementById('accessibility-toggle');
    if (btn) btn.setAttribute('aria-pressed', enabled ? 'true' : 'false');
    try { localStorage.setItem('a11y', enabled ? '1' : '0'); } catch (e) { }
}
function loadAccessibility() {
    try {
        var stored = localStorage.getItem('a11y');
        if (stored === '1') setAccessibility(true);
    } catch (e) { }
}


document.addEventListener('DOMContentLoaded', function () {
    loadAccessibility();
    var a11yBtn = document.getElementById('accessibility-toggle');
    if (a11yBtn) a11yBtn.addEventListener('click', function (e) {
        e.preventDefault();
        var pressed = this.getAttribute('aria-pressed') === 'true';
        setAccessibility(!pressed);
    });
});
