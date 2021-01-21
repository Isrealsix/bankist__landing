'use strict';

const modal = document.querySelector('.modal');
const overlay = document.querySelector('.overlay');
const btnCloseModal = document.querySelector('.btn--close-modal');
const btnsOpenModal = document.querySelectorAll('.btn--show-modal');
const section1 = document.querySelector('#section--1');
const btnScrollTo = document.querySelector('.btn--scroll-to');
const navLinks = document.querySelector('.nav__links');
const tabMenu = document.querySelector('.operations__tab-container');
const allTabsBtn = document.querySelectorAll('.operations__tab');
const allOperations = document.querySelectorAll('.operations__content');
const nav = document.querySelector('.nav');

///////////////////////////////////////
// Modal window

const openModal = function () {
  modal.classList.remove('hidden');
  overlay.classList.remove('hidden');
};

const closeModal = function () {
  modal.classList.add('hidden');
  overlay.classList.add('hidden');
};

for (let i = 0; i < btnsOpenModal.length; i++)
  btnsOpenModal[i].addEventListener('click', openModal);

btnCloseModal.addEventListener('click', closeModal);
overlay.addEventListener('click', closeModal);

document.addEventListener('keydown', function (e) {
  if (e.key === 'Escape' && !modal.classList.contains('hidden')) {
    closeModal();
  }
});

// btnScrollTo.addEventListener('click', function (e) {
//   const s1coords = section1.getBoundingClientRect();

//   window.scrollTo({
//     left: s1coords.left + window.pageXOffset,
//     top: s1coords.top + window.pageYOffset,
//     behavior: 'smooth',
//   });

//   // section1.scrollIntoView({ behavior: 'smooth' });
// });

// Scroll the tabs into view
navLinks.addEventListener('click', function (e) {
  e.preventDefault();

  // Mathching strategy to ensure the targets are the navs
  if (e.target.classList.contains('nav__link')) {
    const id = e.target.getAttribute('href');

    // Guard clause
    if (id === '#') return;
    const section = document.querySelector(id);
    section.scrollIntoView({ behavior: 'smooth' });
  }
});

// Tabbed Component

tabMenu.addEventListener('click', function (e) {
  const btn = e.target.closest('.operations__tab');
  if (!btn) return;
  allTabsBtn.forEach(t => t.classList.remove('operations__tab--active'));
  btn.classList.add('operations__tab--active');

  const id = btn.dataset.tab;

  allOperations.forEach(op =>
    op.classList.remove('operations__content--active')
  );

  document
    .querySelector(`.operations__content--${id}`)
    .classList.add('operations__content--active');
});

// Hover opacity of all elements

const handleHover = function (e) {
  if (e.target.classList.contains('nav__link')) {
    const link = e.target;
    // console.log(e.currentTarget);
    const siblings = link.closest('nav').querySelectorAll('.nav__link');
    const logo = link.closest('nav').querySelector('img');

    siblings.forEach(sib => {
      if (sib !== link) {
        sib.style.opacity = this;
        logo.style.opacity = this;
      }
    });
  }
};
nav.addEventListener('mouseover', handleHover.bind(0.5));
nav.addEventListener('mouseout', handleHover.bind(1));

// Sticky effect!
// const section1coords = section1.getBoundingClientRect();
// window.addEventListener('scroll', function () {
//   if (window.scrollY > section1coords.top) nav.classList.add('sticky');
//   else nav.classList.remove('sticky');
// });

const header = document.querySelector('.header');

const stickyNav = function (entries, observer) {
  const [entry] = entries;

  if (!entry.isIntersecting) nav.classList.add('sticky');
  else nav.classList.remove('sticky');
};
const navHeight = nav.getBoundingClientRect().height;
const obsOptions = {
  root: null,
  threshold: 0,
  rootMargin: `-${navHeight}px`,
};

const headerObserver = new IntersectionObserver(stickyNav, obsOptions);

headerObserver.observe(header);

// Reavealing elements on Scroll!
const secObs = {
  root: null,
  threshold: 0.15,
};

const revealSection = function (entries, observer) {
  const [entry] = entries;
  // console.log(entry, observer);
  if (!entry.isIntersecting) return;
  entry.target.classList.remove('section--hidden');
  observer.unobserve(entry.target);
};

const sectionsObserver = new IntersectionObserver(revealSection, secObs);
const allSections = document.querySelectorAll('.section');

allSections.forEach(sec => {
  // sec.classList.add('section--hidden');
  // sectionsObserver.observe(sec);
});

// Lazy image loading

const allBigImages = document.querySelectorAll('img[data-src]');

const unveilPhoto = function (entries, observer) {
  const [entry] = entries;
  if (!entry.isIntersecting) return;

  // Replace src with data-src
  entry.target.src = entry.target.dataset.src;

  entry.target.addEventListener('load', function () {
    entry.target.classList.remove('lazy-img');
  });

  observer.unobserve(entry.target);
};

const lazyImageIntersection = new IntersectionObserver(unveilPhoto, {
  root: null,
  threshold: 0,
  rootMargin: '200px',
});

allBigImages.forEach(img => {
  lazyImageIntersection.observe(img);
});

// SLIDER EFFECT

const slider = function () {
  const allSlide = document.querySelectorAll('.slide');

  const btnRight = document.querySelector('.slider__btn--right');
  const btnLeft = document.querySelector('.slider__btn--left');

  let currSlide = 0;
  const maxSlides = allSlide.length;

  const goToslide = function (slideCount) {
    allSlide.forEach((el, i) => {
      el.style.transform = `translateX(${100 * (i - slideCount)}%)`;
    });
    activateDots(slideCount);
  };

  const createDots = function () {
    const dotContainer = document.querySelector('.dots');
    allSlide.forEach((_, i) =>
      dotContainer.insertAdjacentHTML(
        'beforeend',
        `<button class="dots__dot" data-slide="${i}"></button>`
      )
    );
    // Added event listeners after creation
    dotContainer.addEventListener('click', function (e) {
      if (e.target.classList.contains('dots__dot')) {
        const { slide } = e.target.dataset;
        goToslide(slide);
      }
    });
  };

  const activateDots = function (slide) {
    const allDots = document.querySelectorAll('.dots__dot');
    allDots.forEach(d => {
      d.classList.remove('dots__dot--active');
      document
        .querySelector(`.dots__dot[data-slide="${slide}"]`)
        .classList.add('dots__dot--active');
    });
  };

  const init = function () {
    createDots();
    goToslide(currSlide);
  };
  init();

  const nextSlide = function () {
    if (currSlide === maxSlides - 1) {
      currSlide = 0;
    } else {
      currSlide++;
    }

    goToslide(currSlide);
  };

  const prevSlide = function () {
    if (currSlide === 0) {
      currSlide = maxSlides - 1;
    } else {
      currSlide--;
    }

    goToslide(currSlide);
  };

  btnRight.addEventListener('click', nextSlide);
  btnLeft.addEventListener('click', prevSlide);

  document.addEventListener('keydown', function (e) {
    e.key === 'ArrowRight' && nextSlide();
    e.key === 'ArrowLeft' && prevSlide();
  });
};
slider();
