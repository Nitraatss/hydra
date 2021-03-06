// Styles
import 'sanitize.css';
import './sass/style.scss';

// Polyfills
import 'focus-within-polyfill';
import objectFitImages from 'object-fit-images';
import webkitLineClamp from 'webkit-line-clamp';
import Stickyfill from 'stickyfilljs';

// Utils
import LazyLoad from 'vanilla-lazyload';
import Typed from 'typed.js';

objectFitImages();

// eslint-disable-next-line no-unused-vars
const lazyLoad = new LazyLoad({
  elements_selector: '.lazy',
  load_delay: 300,
});

const stickyElements = document.querySelectorAll('.sticky');
Stickyfill.add(stickyElements);

// Header search form
const mainHeader = document.querySelector('.main-header');
if (mainHeader) {
  const searchToggler = mainHeader.querySelector('.main-header__toggler');
  const searchForm = mainHeader.querySelector('.main-header__search-form');
  const searchInput = searchForm.querySelector('input');
  const searchHiddler = searchForm.querySelector('.main-header__hiddler');
  const searchSubmit = searchForm.querySelector('.main-header__search-button');
  const mobileMenuToggler = mainHeader.querySelector('.main-header__mobile-burger');

  mobileMenuToggler.addEventListener('click', () => {
    mobileMenuToggler.classList.toggle('main-header__mobile-burger--active');
  });

  searchToggler.addEventListener('click', () => {
    mobileMenuToggler.classList.remove('main-header__mobile-burger--active');
    searchForm.classList.add('main-header__search-form--active');
    searchInput.focus();
  });

  searchHiddler.addEventListener('click', () => {
    searchForm.classList.remove('main-header__search-form--active');
    searchInput.value = '';
  });

  searchSubmit.addEventListener('click', (evt) => {
    evt.preventDefault();
  });
}

// Posts
const postsPool = document.querySelector('.posts-pool');
if (postsPool) {
  const postsSummaries = [].slice.call(postsPool.querySelectorAll('.entity-preview__summary'));
  postsSummaries.forEach((summary) => {
    webkitLineClamp(summary.querySelector('p'), 6);
  });
}

// Videos
const videosPool = document.querySelector('.videos-pool');
if (videosPool) {
  const player = videosPool.querySelector('.player');
  const playButton = player.querySelector('.player__play-button');
  const videoItem = player.querySelector('.player__video');
  const playlist = videosPool.querySelector('.playlist');
  const options = [].slice.call(playlist.querySelectorAll('.playlist__button'));

  playButton.addEventListener('click', () => {
    videoItem.play();
    videoItem.controls = true;
    playButton.classList.add('player__play-button--clicked');
  });

  let activeOptionIndex = 0;
  options.forEach((option, index) => {
    option.addEventListener('click', () => {
      videoItem.pause();

      if (index !== activeOptionIndex) {
        playButton.classList.remove('player__play-button--clicked');
        videoItem.controls = false;
        videoItem.load();

        options[activeOptionIndex].classList.remove('playlist__button--active');
        option.classList.add('playlist__button--active');

        activeOptionIndex = index;
      }
    });
  });
}

// Typed titles
const checkElementVisibility = (element) => {
  const rect = element.getBoundingClientRect();
  const windowHeight = (window.innerHeight || document.documentElement.clientHeight);

  const inView = (rect.top <= windowHeight) && ((rect.top + rect.height) >= 0);

  if (inView === true) {
    return true;
  }
  return false;
};

const initiateTypedTitle = (element, text) => {
  const typed = new Typed(element, {
    strings: [text],
    typeSpeed: 30,
    showCursor: false,
  });

  return typed;
};

const sectionTitles = [].slice.call(document.querySelectorAll('.section-title'));
if (sectionTitles.length) {
  sectionTitles.forEach((title) => {
    const text = title.querySelector('span').textContent;
    const typedElement = title.querySelector('.section-title__typed');
    let typed = null;

    if (checkElementVisibility(title)) {
      typed = initiateTypedTitle(typedElement, text);
    } else {
      window.addEventListener('scroll', () => {
        if (!typed && checkElementVisibility(title)) {
          typed = initiateTypedTitle(typedElement, text);
        }
      });
    }
  });
}
