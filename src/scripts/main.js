//  ONE PAGE SCROLL
const sections = $('.section');
const display = $('.main');
let inscroll = false;
let scrolable = true;
let pointMenu = $('.point-menu__link');

const mobileDetect = new MobileDetect(window.navigator.userAgent);
const isMobile = mobileDetect.mobile();

const countPositionPercent = sectionEq => {
  return `${sectionEq * -100}%`;
};

const switchActiveClass = (elems, elemNdx) => {

  elems
    .eq(elemNdx)
    .addClass('active')
    .siblings()
    .removeClass('active');

  //черный цвет для dots
  if(elemNdx == 1 || elemNdx == 6 || elemNdx == 8) {
    $(pointMenu).addClass('point-menu__link--black');
  } else {
      $(pointMenu).removeClass('point-menu__link--black');
    };
};

const unBlockScroll = () => {
  setTimeout(() => {
    inscroll = false;
  }, 600); // подождать пока завершится инерция на тачпадах
};

const performTransition = sectionEq => {
  if (inscroll) return;
  inscroll = true;

  const position = countPositionPercent(sectionEq);
  const switchFixedMenuClass = () =>
  switchActiveClass($(pointMenu), sectionEq)

  switchActiveClass(sections, sectionEq);
  switchFixedMenuClass();

  display.css({
    transform: `translateY(${position})`
  });
  unBlockScroll();
};


const scrollViewport = direction => {
  const activeSection = sections.filter(".active");
  const nextSection = activeSection.next();
  const prevSection = activeSection.prev();

  if (direction === "next" && nextSection.length) {
    performTransition(nextSection.index());
  }

  if (direction === "prev" && prevSection.length) {
    performTransition(prevSection.index());
  }
};


$(document).on({
  wheel: e => {
    const deltaY = e.originalEvent.deltaY;
    const direction = deltaY > 0 ? "next" : "prev";

    if (scrolable) {
      scrollViewport(direction);
    } 
  },
  keydown: e => {
    const tagName = e.target.tagName.toLowerCase();
    const userTypingInInputs = tagName === "input" || tagName === "textarea";

    if (userTypingInInputs) return;

    switch (e.keyCode) {
      case 40:
        scrollViewport("next");
        break;

      case 38:
        scrollViewport("prev");
        break;
    }
  }
});

$("[data-scroll-to]").on("click", e => {
  e.preventDefault();
  performTransition(parseInt($(e.currentTarget).attr("data-scroll-to")));
});


// разрешаем свайп на мобильниках
if (isMobile) {
  window.addEventListener(
    "touchmove",
    e => {
      e.preventDefault();
    },
    { passive: false }
  );

  $("body").swipe({
    swipe: (event, direction) => {
      let scrollDirecrion;
      if (direction === "up") scrollDirecrion = "next";
      if (direction === "down") scrollDirecrion = "prev";
      scrollViewport(scrollDirecrion);
    }
  });
}


// ПОЛНОЭКРАННОЕ МЕНЮ
const menuGam = document.querySelector('.nav__hamburger');
const fullscreen = document.querySelector('.fullscreen-menu');
const close = document.querySelector('.fullscreen-menu__close');
const closeLink = document.querySelectorAll('.fullscreen-menu__link')

menuGam.addEventListener('click', function() {
  scrolable = false;
  fullscreen.style.display = 'flex';
});

close.addEventListener('click', function() {
  fullscreen.style.display = 'none';
  scrolable = true;
});

closeLink.forEach(function(btn) {
  btn.addEventListener('click', function() {
    fullscreen.style.display = 'none'
    scrolable = true;
  })
});


// СЛАЙДЕР
$(document).ready(function() {

  let moveSlide = function (container, slideNum) {

    let 
        items = container.find('.slider__item'),
        active = items.filter('.slider__item--active'),
        reqItem = items.eq(slideNum),
        reqIndex = reqItem.index(),
        list = container.find('.slider__list'),
        duration = 800;

    if (reqItem.length) {

      list.animate ({
        'left' : -reqIndex * 100 + '%'
      }, duration, function() {
        active.removeClass('slider__item--active');
        reqItem.addClass('slider__item--active');
      });
    };
  };

  $('.slider__link').on('click', function(e) {
    e.preventDefault();

    let $this = $(this),
        container = $this.closest('.slider__conteiner'),
        items = $('.slider__item', container),
        active = items.filter('.slider__item--active'),
        existedItem, edgeItem, reqItem;

    if ($this.hasClass('slider__link--right')) {
        existedItem = active.next();
        edgeItem = items.last();
    }; 
    
    if ($this.hasClass('slider__link--left')) {
      existedItem = active.prev();
      edgeItem = items.first();
    }; 
    reqItem = existedItem.length ? existedItem.index() : edgeItem.index();
    moveSlide(container, reqItem);
  });
});


// ГОРИЗОНТАЛЬНЫЙ АККОРДЕОН
const acco = document.getElementsByClassName('menu-accordeon__item');

for (let index = 0 ; index < acco.length; index++) {
  const element = acco[index];

  element.addEventListener('click', function(e) {
    e.preventDefault();

    for (let i = 0; i < acco.length; i++) {
      if (i !== index) {
        acco[i].classList.remove('menu-accordeon__item--active'); 
      }
    }

    if (element.classList.contains('menu-accordeon__item--active')) {
        element.classList.remove('menu-accordeon__item--active');
    } else {
      element.classList.add('menu-accordeon__item--active');
    }
  });
}


// ВЕРТИКАЛЬНЫЙ АККОРДЕОН
const member = document.getElementsByClassName('team-accordeon__item');
let height = document.documentElement.clientHeight;

window.addEventListener('resize', function (e) {
  height = document.documentElement.clientHeight;
});

for (let ind = 0 ; ind < member.length; ind++) {
  const elem = member[ind];

  elem.addEventListener('click', function(e) {
    e.preventDefault();
    for (let i = 0; i < member.length; i++) {
      if (i !== ind) {
        member[i].classList.remove('team-accordeon__item--active');
      }
    }
    if (elem.classList.contains('team-accordeon__item--active')) {
        elem.classList.remove('team-accordeon__item--active');
    } 
    else {
      elem.classList.add('team-accordeon__item--active');
    }
  });
}



// ВСПЛЫВАШКА REVIEWS
const openButton = document.querySelectorAll(".btn--review");
const overlayElement = document.querySelector(".reviews__popup");

openButton.forEach(function(btn) {
  btn.addEventListener('click', function() {
    overlayElement.style.display = "flex";
    scrolable = false;
  })
});

const closeElement = overlayElement.querySelector(".fullscreen-menu__close--rev");
closeElement.addEventListener("click", function() {
  overlayElement.style.display = "none";
  scrolable = true;
});

overlayElement.addEventListener("click", function(e) {
  if (e.target === overlayElement) {
    closeElement.click();
  }
});



// ФОРМА
const myForm = document.querySelector('#myForm');
let form = new FormData;

myForm.addEventListener('submit', e => {
   e.preventDefault();

   if (validateForm(myForm)) {
     const data = {
      name: myForm.elements.name.value,
      phone: myForm.elements.phone.value,
      comment: 'comment',
      street: myForm.elements.street.value,
      home: myForm.elements.home.value,
      corps: myForm.elements.corps.value,
      flat: myForm.elements.flat.value,
      floor: myForm.elements.floor.value,
      to: 'dmitr.ribin@yandex.ru'
     };

     for (const key in data) {
      form.append(key, data[key]);
    }

     const xhr = new XMLHttpRequest();
     xhr.onreadystatechange = processReqChange;
     function processReqChange() {
        const formWindow = document.querySelector('#form__window');
        const closeWindow = document.querySelector('#btn--closed');
        const formFail = document.querySelector('#form__fail');
        const closeFail = document.querySelector('#btn--fail');
        if (xhr.readyState == 4) {
            if (xhr.status == 200) {
            // удачно
            formWindow.style.display = "flex";
            scrolable = false;

            closeWindow.addEventListener('click', function() {
              formWindow.style.display = 'none';
              scrolable = true;
            });

            formWindow.addEventListener("click", function(e) {
              if (e.target === formWindow) {
                closeWindow.click();
              }
            });
            } else {
              formFail.style.display = "flex";
              scrolable = false;

              closeFail.addEventListener('click', function() {
                formFail.style.display = 'none';
                scrolable = true;
              });
              
              formFail.addEventListener("click", function(e) {
                if (e.target === formFail) {
                  closeFail.click();
                }
              });
           }
      }
    }
     xhr.open('POST', 'https://webdev-api.loftschool.com/sendmail');
     xhr.send(form);
   }
});

 function validateForm(form) {
   let valid = true;

   if (!validateField(form.elements.name)) {
     valid = false;
   }

   if (!validateField(form.elements.phone)) {
     valid = false;
   }

   if (!validateField(form.elements.street)) {
     valid = false;
   }

   if (!validateField(form.elements.home)) {
     valid = false;
   }

   if (!validateField(form.elements.corps)) {
     valid = false;
   }

   if (!validateField(form.elements.flat)) {
     valid = false;
   }

   if (!validateField(form.elements.floor)) {
     valid = false;
   }

   if (!validateField(form.elements.comment)) {
    valid = false;
  }

   return valid;
 }

 function validateField(field) {
   return field.checkValidity();
 }



//ВИДЕО
const videoEl = document.querySelector('video');
const playBtn = document.querySelector('.work__start');
const mutedEl = document.querySelector('.work__sound');
const volumeEl = document.querySelector('.work__volume-range');
const progressEl = document.querySelector('.work__playback-range');

playBtn.addEventListener('click', function () {
  if (videoEl.paused) {
      videoEl.play();
      playBtn.classList.add('paused');
  } else {
      videoEl.pause();
      playBtn.classList.remove('paused');
  }
}, false);

videoEl.addEventListener('click', function () {
  if (videoEl.paused) {
      videoEl.play();
      playBtn.classList.add('paused');
  } else {
      videoEl.pause();
      playBtn.classList.remove('paused');
  }
}, false);

videoEl.addEventListener('timeupdate', function() {
  let videoDur = videoEl.duration;
  let videoCT = videoEl.currentTime;
  progressEl.value = 100 * (videoCT / videoDur);
});

progressEl.addEventListener('click', function(e) {
  let progressWidth = this.offsetWidth;
  let offset = e.offsetX;
  this.value = 100 * (offset / progressWidth);
  videoEl.pause();
  videoEl.currentTime = videoEl.duration * (offset / progressWidth);
  videoEl.play();
  playBtn.classList.add('paused');
});

mutedEl.addEventListener('click', function () {
  videoEl.muted = !videoEl.muted;
  if (videoEl.muted == true) {
    mutedEl.classList.add('stopped');
  } else {
    mutedEl.classList.remove('stopped');
  }
});

volumeEl.addEventListener('input', function() {
  let v = this.value;
  videoEl.volume = v/100;
});



// КАРТА
let myMap;
let geoCenter = false;

function init(){
    myMap = new ymaps.Map("map", {
        center: [53.36, 83.76],
        zoom: 13
    });
    let coords = [
    [53.35, 83.77],
    [53.34, 83.78],
    [53.34, 83.75],
    [53.33, 83.69]
];
for (let index = 0; index < coords.length; index++) {
    const coord = coords[index];
    let tempText = '<p>'+'пр-т. Ленина - 77'+'</p>'
    let tempHeader = '<h3><span style="color: red">'+'mr.Burger'+'</span></h3>'
    let baloon = tempHeader + tempText;

    myMap.geoObjects.add(new ymaps.Placemark(coord, {balloonContent: baloon}, {iconContent: index + 1,iconLayout: 'default#image', iconImageHref:'images/icons/map-marker.svg',  iconImageSize:[37, 42],}));    
}
    myMap.behaviors.disable('scrollZoom');
    myMap.behaviors.disable('multiTouch');
    myMap.behaviors.disable('drag');
    myMap.setBounds(myMap.geoObjects.getBounds());
    myMap.setZoom(myMap.getZoom()-1.4);
};
ymaps.ready(init);