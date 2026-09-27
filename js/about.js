(function () {
  'use strict';

  /* =========================================
     INNOVEXA — ABOUT PAGE INTERACTIONS
     ========================================= */

  /* -----------------------------------------
     01. Dynamic Footer Year
     ----------------------------------------- */
  const year = document.getElementById('year');

  if (year) {
    year.textContent = new Date().getFullYear();
  }

  const backToTop = document.getElementById('backToTop');
  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  function updateBackToTop() {
    if (backToTop) {
      backToTop.classList.toggle('is-visible', window.scrollY > 500);
    }
  }

  window.addEventListener('scroll', updateBackToTop, { passive: true });
  updateBackToTop();

  if (backToTop) {
    backToTop.addEventListener('click', function () {
      window.scrollTo({
        top: 0,
        behavior: prefersReducedMotion ? 'auto' : 'smooth'
      });
    });
  }

  const identityTitle = document.querySelector('.identity h1');
  const reducedIdentityMotion = prefersReducedMotion;

  if (identityTitle) {
    identityTitle.innerHTML = '<span class="identity-title-main"></span><span class="identity-title-accent"></span>';

    const titleMain = identityTitle.querySelector('.identity-title-main');
    const titleAccent = identityTitle.querySelector('.identity-title-accent');

    function typeIdentityText(element, text, done) {
      let index = 0;
      element.classList.add('is-typing');

      function typeNextCharacter() {
        element.textContent = text.slice(0, index + 1);
        index += 1;

        if (index < text.length) {
          window.setTimeout(typeNextCharacter, 125);
        } else {
          element.classList.remove('is-typing');
          done();
        }
      }

      typeNextCharacter();
    }

    if (reducedIdentityMotion) {
      titleMain.textContent = 'We Are';
      titleAccent.textContent = 'Innovexa.';
    } else {
      function startIdentityTyping() {
        titleMain.textContent = '';
        titleAccent.textContent = '';

        typeIdentityText(titleMain, 'We Are', function () {
          window.setTimeout(function () {
            typeIdentityText(titleAccent, 'Innovexa.', function () {
              window.setTimeout(startIdentityTyping, 1800);
            });
          }, 180);
        });
      }

      startIdentityTyping();
    }
  }


  /* -----------------------------------------
     02. INNOVEXA DNA — Interactive Nodes
     ----------------------------------------- */
  const dnaNodes = document.querySelectorAll('.dna-node');
  const dnaReadout = document.getElementById('dnaReadout');

  const dnaContent = {
    clarity: {
      title: 'Clarity',
      description:
        'We make the complex feel understandable, actionable and beautifully simple.'
    },

    craft: {
      title: 'Craft',
      description:
        'We care about the small decisions that turn a working product into a memorable one.'
    },

    curiosity: {
      title: 'Curiosity',
      description:
        'We keep asking better questions so the solution can move beyond the obvious.'
    },

    care: {
      title: 'Care',
      description:
        'We build with empathy for the people, teams and businesses using the result.'
    }
  };


  /* -----------------------------------------
     DNA Node Interaction
     ----------------------------------------- */
  dnaNodes.forEach(function (node) {
    node.addEventListener('click', function () {

      // Remove active state from all nodes
      dnaNodes.forEach(function (item) {
        item.classList.remove('is-active');
      });

      // Activate selected node
      node.classList.add('is-active');

      const dnaKey = node.dataset.dna;
      const content = dnaContent[dnaKey];

      // Safety check
      if (!content || !dnaReadout) {
        return;
      }

      // Get readable label
      const nodeText = node.textContent.trim();
      const firstWord = nodeText.split(' ')[0];

      dnaReadout.innerHTML = `
        <small>${firstWord} / PRINCIPLE</small>
        <h3>${content.title}</h3>
        <p>${content.description}</p>
      `;
    });
  });


  /* -----------------------------------------
     03. Scroll Reveal System
     ----------------------------------------- */
  const scenes = document.querySelectorAll('.scene:not(.origin):not(.thinking):not(.ending)');
  const teamCards = document.querySelectorAll('.team-editorial .team-card');
  const originScene = document.querySelector('.origin');
  const thinkingScene = document.querySelector('.thinking');
  const endingScene = document.querySelector('.ending');
  const endingTitle = document.querySelector('.ending .kinetic-title');

  if ('IntersectionObserver' in window) {

    const sceneObserver = new IntersectionObserver(
      function (entries) {

        entries.forEach(function (entry) {

          if (entry.isIntersecting) {
            entry.target.classList.add('is-seen');
          }

        });

      },
      {
        threshold: 0.12,
        rootMargin: '0px 0px -8% 0px'
      }
    );

    scenes.forEach(function (scene) {
      sceneObserver.observe(scene);
    });

    const teamCardObserver = new IntersectionObserver(
      function (entries, observer) {

        entries.forEach(function (entry) {

          if (entry.isIntersecting) {
            entry.target.classList.add('is-visible');
            observer.unobserve(entry.target);
          }

        });

      },
      {
        threshold: 0.12,
        rootMargin: '0px 0px -8% 0px'
      }
    );

    teamCards.forEach(function (card) {
      teamCardObserver.observe(card);
    });

    if (originScene) {
      const originObserver = new IntersectionObserver(
        function (entries, observer) {
          entries.forEach(function (entry) {
            if (entry.isIntersecting) {
              entry.target.classList.add('is-seen');
              observer.unobserve(entry.target);
            }
          });
        },
        {
          threshold: 0.12,
          rootMargin: '0px 0px -8% 0px'
        }
      );

      originObserver.observe(originScene);
    }

    if (thinkingScene) {
      const thinkingObserver = new IntersectionObserver(
        function (entries, observer) {
          entries.forEach(function (entry) {
            if (entry.isIntersecting) {
              entry.target.classList.add('is-seen');
              observer.unobserve(entry.target);
            }
          });
        },
        {
          threshold: 0.12,
          rootMargin: '0px 0px -8% 0px'
        }
      );

      thinkingObserver.observe(thinkingScene);
    }

    if (endingScene && endingTitle) {
      const endingObserver = new IntersectionObserver(
        function (entries, observer) {
          entries.forEach(function (entry) {
            if (entry.isIntersecting) {
              endingScene.classList.add('is-seen');
              observer.unobserve(endingTitle);
            }
          });
        },
        {
          threshold: 0.15,
          rootMargin: '0px'
        }
      );

      endingObserver.observe(endingTitle);
    }

  } else {

    // Fallback for older browsers
    scenes.forEach(function (scene) {
      scene.classList.add('is-seen');
    });

    teamCards.forEach(function (card) {
      card.classList.add('is-visible');
    });

    if (originScene) {
      originScene.classList.add('is-seen');
    }

    if (thinkingScene) {
      thinkingScene.classList.add('is-seen');
    }

    if (endingScene) {
      endingScene.classList.add('is-seen');
    }

  }


  /* -----------------------------------------
     04. Smooth Internal Navigation
     ----------------------------------------- */
  const internalLinks = document.querySelectorAll(
    'a[href^="#"]'
  );

  internalLinks.forEach(function (link) {

    link.addEventListener('click', function (event) {

      const targetId = link.getAttribute('href');

      if (!targetId || targetId === '#') {
        return;
      }

      const target = document.querySelector(targetId);

      if (!target) {
        return;
      }

      event.preventDefault();

      target.scrollIntoView({
        behavior: 'smooth',
        block: 'start'
      });

    });

  });


  /* -----------------------------------------
     05. Active DNA Node — First Principle
     ----------------------------------------- */
  if (dnaNodes.length && !document.querySelector('.dna-node.is-active')) {
    dnaNodes[0].classList.add('is-active');
  }


  /* -----------------------------------------
     06. Subtle Mouse Parallax
     For immersive visual sections
     ----------------------------------------- */
  const parallaxItems = document.querySelectorAll(
    '[data-parallax]'
  );

  if (parallaxItems.length && window.matchMedia('(pointer: fine)').matches) {

    let mouseX = 0;
    let mouseY = 0;
    let currentX = 0;
    let currentY = 0;

    window.addEventListener('mousemove', function (event) {

      mouseX =
        (event.clientX / window.innerWidth - 0.5) * 2;

      mouseY =
        (event.clientY / window.innerHeight - 0.5) * 2;

    });

    function animateParallax() {

      currentX += (mouseX - currentX) * 0.05;
      currentY += (mouseY - currentY) * 0.05;

      parallaxItems.forEach(function (item) {

        const strength =
          Number(item.dataset.parallax) || 12;

        item.style.transform =
          `translate3d(
            ${currentX * strength}px,
            ${currentY * strength}px,
            0
          )`;

      });

      requestAnimationFrame(animateParallax);
    }

    animateParallax();
  }


  /* -----------------------------------------
     07. Horizontal Evolution Scroll Support
     ----------------------------------------- */
  const horizontalSections =
    document.querySelectorAll('[data-horizontal-scroll]');

  horizontalSections.forEach(function (section) {

    section.addEventListener(
      'wheel',
      function (event) {

        if (Math.abs(event.deltaY) <= Math.abs(event.deltaX)) {
          return;
        }

        const canScrollLeft =
          section.scrollLeft > 0;

        const canScrollRight =
          section.scrollLeft + section.clientWidth <
          section.scrollWidth - 1;

        if (
          (event.deltaY > 0 && canScrollRight) ||
          (event.deltaY < 0 && canScrollLeft)
        ) {
          event.preventDefault();

          section.scrollLeft += event.deltaY;
        }

      },
      {
        passive: false
      }
    );

  });

  const evolutionTrack = document.querySelector('.evolution-track');
  const evolutionCards = evolutionTrack
    ? Array.from(evolutionTrack.querySelectorAll('article'))
    : [];
  const reducedEvolutionMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  if (evolutionTrack && evolutionCards.length && !reducedEvolutionMotion) {
    const clonedCards = evolutionCards.map(function (card) {
      const clone = card.cloneNode(true);
      clone.setAttribute('aria-hidden', 'true');
      return clone;
    });

    clonedCards.forEach(function (card) {
      evolutionTrack.appendChild(card);
    });

    let animationFrame = null;
    let touchPaused = false;
    let loopWidth = 0;

    function stopEvolutionCarousel() {
      if (animationFrame) {
        window.cancelAnimationFrame(animationFrame);
        animationFrame = null;
      }
    }

    function runEvolutionCarousel() {
      if (touchPaused) {
        return;
      }

      evolutionTrack.scrollLeft += 1.7;

      if (loopWidth && evolutionTrack.scrollLeft >= loopWidth) {
        evolutionTrack.scrollLeft -= loopWidth;
      }

      animationFrame = window.requestAnimationFrame(runEvolutionCarousel);
    }

    function startEvolutionCarousel() {
      stopEvolutionCarousel();
      loopWidth = clonedCards[0].offsetLeft - evolutionCards[0].offsetLeft;

      if (!touchPaused) {
        animationFrame = window.requestAnimationFrame(runEvolutionCarousel);
      }
    }

    evolutionTrack.addEventListener('mouseenter', stopEvolutionCarousel);
    evolutionTrack.addEventListener('mouseleave', startEvolutionCarousel);
    evolutionTrack.addEventListener('focusin', stopEvolutionCarousel);
    evolutionTrack.addEventListener('focusout', startEvolutionCarousel);
    evolutionTrack.addEventListener('touchstart', function () {
      touchPaused = true;
      stopEvolutionCarousel();
    }, { passive: true });
    evolutionTrack.addEventListener('touchend', function () {
      touchPaused = false;
      startEvolutionCarousel();
    }, { passive: true });

    const evolutionObserver = new IntersectionObserver(function (entries) {
      if (entries[0].isIntersecting) {
        startEvolutionCarousel();
      } else {
        stopEvolutionCarousel();
      }
    }, { threshold: 0.15 });

    evolutionObserver.observe(evolutionTrack);
  }


  /* -----------------------------------------
     08. Page Loaded State
     ----------------------------------------- */
  window.addEventListener('load', function () {
    document.body.classList.add('about-page-ready');
  });


})();