(function () {
  'use strict';

  if (window.top !== window.self || document.getElementById('shared-shell-host')) return;

  document.querySelectorAll('body > header.site-header, body > footer.site-footer').forEach(function (element) {
    element.remove();
  });

  var host = document.createElement('div');
  host.id = 'shared-shell-host';
  host.setAttribute('aria-live', 'polite');
  document.body.insertBefore(host, document.body.firstChild);

  var footerHost = document.createElement('div');
  footerHost.id = 'shared-shell-footer-host';
  footerHost.setAttribute('aria-live', 'polite');
  document.body.appendChild(footerHost);

  var shadow = host.attachShadow({ mode: 'open' });
  var footerShadow = footerHost.attachShadow({ mode: 'open' });
  var baseUrl = new URL('index.html', document.baseURI);

  fetch(baseUrl.href)
    .then(function (response) {
      if (!response.ok) throw new Error('Unable to load the shared site shell.');
      return response.text();
    })
    .then(function (html) {
      var documentParser = new DOMParser();
      var master = documentParser.parseFromString(html, 'text/html');
      var masterStyle = master.querySelector('style');
      var header = master.querySelector('body > header');
      var footer = master.querySelector('body > footer');
      if (!header || !footer) throw new Error('The master header or footer is missing from index.html.');

      var style = document.createElement('style');
      if (masterStyle) {
        style.textContent = masterStyle.textContent
          .replace(/:root\s*\{/g, ':host{')
          .replace(/body\s*\{/g, ':host{');
      }
      shadow.appendChild(style.cloneNode(true));
      footerShadow.appendChild(style);

      var responsiveLink = document.createElement('link');
      responsiveLink.rel = 'stylesheet';
      responsiveLink.href = new URL('css/responsive.css', document.baseURI).href;
      shadow.appendChild(responsiveLink.cloneNode(true));
      footerShadow.appendChild(responsiveLink);

      shadow.appendChild(header.cloneNode(true));
      footerShadow.appendChild(footer.cloneNode(true));

      footerShadow.querySelectorAll('.footer-social a[aria-label="Facebook"], .footer-social a[aria-label="Instagram"], .footer-social a[aria-label="LinkedIn"], .footer-social a[aria-label="Twitter / X"], .footer-social a[aria-label="TikTok"]').forEach(function (link) {
        link.target = '_blank';
        link.rel = 'noopener';
      });

      shadow.querySelectorAll('a[href]').forEach(function (link) {
        var href = link.getAttribute('href');
        if (href && href.charAt(0) === '#') {
          link.setAttribute('href', 'index.html' + href);
        }
      });

      var nav = shadow.querySelector('#mainNav');
      var toggle = shadow.querySelector('#menuToggle');
      if (nav && toggle) {
        toggle.addEventListener('click', function () {
          var isOpen = nav.classList.toggle('open');
          toggle.classList.toggle('active', isOpen);
          toggle.classList.toggle('open', isOpen);
          toggle.classList.toggle('is-open', isOpen);
          toggle.setAttribute('aria-expanded', isOpen ? 'true' : 'false');
        });
        nav.querySelectorAll('a').forEach(function (link) {
          link.addEventListener('click', function () {
            toggle.classList.remove('active');
            toggle.classList.remove('open');
            toggle.classList.remove('is-open');
            toggle.setAttribute('aria-expanded', 'false');
            nav.classList.remove('open');
          });
        });
        document.addEventListener('click', function (e) {
          if (nav.classList.contains('open') && !host.contains(e.target)) {
            toggle.classList.remove('active');
            toggle.classList.remove('open');
            toggle.classList.remove('is-open');
            toggle.setAttribute('aria-expanded', 'false');
            nav.classList.remove('open');
          }
        });
      }

      var currentPage = window.location.pathname.split('/').pop() || 'index.html';
      shadow.querySelectorAll('.main-nav a[href]').forEach(function (link) {
        var href = link.getAttribute('href').split('#')[0];
        if (href === currentPage || (currentPage === '' && href === 'index.html')) {
          link.classList.add('active');
          link.setAttribute('aria-current', 'page');
        }
      });

      window.dispatchEvent(new CustomEvent('shared-shell-ready'));
    })
    .catch(function (error) {
      host.remove();
      footerHost.remove();
      console.error(error);
    });
})();
