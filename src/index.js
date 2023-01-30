require('normalize.css/normalize.css');
require('./styles/index.scss');
import EmblaCarousel from 'embla-carousel';
import smoothscroll from 'smoothscroll-polyfill';
import sal from 'sal.js'

const emblaSlider = function (element) {
  const emblaNode = document.querySelector(element);
  const options = {
    align: 'center',
    containScroll: 'keepSnaps'
  }
  if (emblaNode) {
    EmblaCarousel(emblaNode, options);
  } else {
    return false
  }
}
window.theSlider = emblaSlider;

const goToElement = function (x) {
  const w = window.innerWidth || document.documentElement.clientWidth || document.body.clientWidth;
  const element = document.querySelector(x);
  const headerOffset = 40;
  const elementPosition = window.pageYOffset + element.getBoundingClientRect().top;
  if (w > 768){
    window.scrollTo({
      top:  elementPosition - headerOffset,
      behavior: "smooth"
    });
    setTimeout(function(){
      body.classList.remove('scroll-up');
      body.classList.add('scroll-down');
    }, 750);
  } else {
    setTimeout(function(){
      // allow for animation delay - iOS needs this otherwise will send links to wrong area
      document.querySelector(x).scrollIntoView({
        behaviour: 'smooth',
        block: 'start'
      })
    }, 50);
  }
}
window.goToElement = goToElement;
smoothscroll.polyfill();
sal({
  threshold: 0.1,
  once: false
});


