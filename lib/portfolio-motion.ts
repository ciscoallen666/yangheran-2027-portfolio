import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

export async function preparePortfolioMedia(src: string) {
  const image = new Image();
  image.src = src;
  // Keep the previous frame visible until the replacement is decoded.
  await image.decode().catch(() => {});
}

export function initPortfolioMotion(root: HTMLElement) {
  const hero = root.querySelector<HTMLElement>('.hero-cover');
  const article = root.querySelector<HTMLElement>('.surface-block');
  const light = root.querySelector<HTMLElement>('.hero-light');
  const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
  let heroVisible = true;
  const syncAmbient = () => {
    root.classList.toggle(
      'motion-paused',
      document.hidden || !heroVisible || reducedMotion.matches,
    );
  };
  const heroObserver = new IntersectionObserver(([entry]) => {
    heroVisible = entry.isIntersecting;
    syncAmbient();
  });
  if (hero) heroObserver.observe(hero);
  document.addEventListener('visibilitychange', syncAmbient);
  reducedMotion.addEventListener('change', syncAmbient);
  syncAmbient();

  const navLinks = Array.from(
    root.querySelectorAll<HTMLAnchorElement>('nav a'),
  );
  const sections = navLinks
    .map((link) => root.querySelector<HTMLElement>(link.hash))
    .filter((section): section is HTMLElement => Boolean(section));
  const navObserver = new IntersectionObserver(
    (entries) => {
      for (const entry of entries) {
        if (!entry.isIntersecting) continue;
        navLinks.forEach((link) => {
          if (link.hash === `#${entry.target.id}`) {
            link.setAttribute('aria-current', 'location');
          } else {
            link.removeAttribute('aria-current');
          }
        });
      }
    },
    { rootMargin: '-15% 0px -65% 0px' },
  );
  sections.forEach((section) => navObserver.observe(section));

  const mediaQuery = gsap.matchMedia();
  mediaQuery.add('(prefers-reduced-motion: no-preference)', () => {
    const context = gsap.context(() => {
      gsap
        .timeline({ defaults: { ease: 'power3.out' } })
        .fromTo(
          light,
          { xPercent: -20, opacity: 0 },
          { xPercent: 0, opacity: 0.55, duration: 1.1 },
          0,
        )
        .fromTo(
          '.hero-name',
          { clipPath: 'inset(100% 0 0 0)' },
          {
            clipPath: 'inset(0% 0 0 0)',
            duration: 0.8,
            clearProps: 'clipPath',
          },
          0.12,
        )
        .fromTo(
          '.hero-avatar',
          { opacity: 0.25 },
          { opacity: 1, duration: 0.65, clearProps: 'opacity' },
          0.12,
        )
        .fromTo(
          ['.hero-english', '.hero-summary', '.hero-tags'],
          { opacity: 0 },
          { opacity: 1, duration: 0.5, stagger: 0.08, clearProps: 'opacity' },
          0.38,
        );

      const stage = article?.querySelector('.project-media-stage');
      if (stage) {
        gsap.fromTo(
          stage,
          { clipPath: 'inset(0 8% 0 8%)' },
          {
            clipPath: 'inset(0 0% 0 0%)',
            duration: 0.7,
            ease: 'power3.out',
            clearProps: 'clipPath',
            scrollTrigger: { trigger: stage, start: 'top 88%', once: true },
          },
        );
      }
    }, root);

    let mediaTween: gsap.core.Tween | undefined;
    const revealMedia = () => {
      mediaTween?.revert();
      const media = article?.querySelector(
        '.project-media-stage > img, .project-media-stage > video',
      );
      if (media) {
        mediaTween = gsap.fromTo(
          media,
          { opacity: 0.45, x: 10 },
          {
            opacity: 1,
            x: 0,
            duration: 0.24,
            ease: 'power3.out',
            clearProps: 'opacity,transform',
          },
        );
      }
      ScrollTrigger.refresh();
    };
    article?.addEventListener('portfolio:media-change', revealMedia);

    const finePointer = window.matchMedia('(hover: hover) and (pointer: fine)');
    const moveLightX = gsap.quickTo(light, 'x', {
      duration: 0.6,
      ease: 'power3.out',
    });
    const moveLightY = gsap.quickTo(light, 'y', {
      duration: 0.6,
      ease: 'power3.out',
    });
    const moveLight = (event: PointerEvent) => {
      if (!finePointer.matches || !hero) return;
      const bounds = hero.getBoundingClientRect();
      moveLightX((event.clientX / bounds.width - 0.5) * 24);
      moveLightY(((event.clientY - bounds.top) / bounds.height - 0.5) * 12);
    };
    const resetLight = () => {
      moveLightX(0);
      moveLightY(0);
    };
    hero?.addEventListener('pointermove', moveLight, { passive: true });
    hero?.addEventListener('pointerleave', resetLight);
    return () => {
      hero?.removeEventListener('pointermove', moveLight);
      hero?.removeEventListener('pointerleave', resetLight);
      article?.removeEventListener('portfolio:media-change', revealMedia);
      mediaTween?.revert();
      moveLightX.tween.kill();
      moveLightY.tween.kill();
      context.revert();
    };
  });

  return () => {
    mediaQuery.revert();
    heroObserver.disconnect();
    navObserver.disconnect();
    document.removeEventListener('visibilitychange', syncAmbient);
    reducedMotion.removeEventListener('change', syncAmbient);
    root.classList.remove('motion-paused');
    navLinks.forEach((link) => link.removeAttribute('aria-current'));
  };
}
