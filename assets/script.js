"use strict";
import { localeStrings } from "./locale.js";

(function() {


// mobile navigation menu

document.querySelector(".sp-nav-open").addEventListener("click", () => {
  document.querySelector(".sp-nav-menu").showModal();
});
document.querySelector(".sp-nav-close").addEventListener("click", () => {
  document.querySelector(".sp-nav-menu").close();
});

// language switch

function setLang(lang) {
  document.documentElement.lang = lang;
  document.querySelectorAll(".locale").forEach((el) => {
    const string = el.dataset.string;
    el.innerHTML = localeStrings[lang][string];
  });
  document.querySelectorAll(".locale-attr").forEach((el) => {
    const attr = el.dataset.attr;
    const string = el.dataset.string;
    el.setAttribute(attr, localeStrings[lang][string]);
  });
}

document.querySelectorAll(".lang-en").forEach((el) => {
  el.addEventListener("click", () => setLang("en"));
});
document.querySelectorAll(".lang-zh-hk").forEach((el) => {
  el.addEventListener("click", () => setLang("zh-hk"));
});
document.querySelectorAll(".lang-zh-cn").forEach((el) => {
  el.addEventListener("click", () => setLang("zh-cn"));
});

setLang("en");

// booth views handling setup

const boothViews = document.querySelectorAll(".booth-view");
let rotationTracker = 0.5;
function showBoothView() {

  rotationTracker = (rotationTracker + boothViews.length) % boothViews.length;
  const indexToShow = Math.floor(rotationTracker);
  boothViews.forEach((img, imgIndex) => {
    if (imgIndex === indexToShow) {
      img.classList.add("active");
    } else {
      img.classList.remove("active");
    }
  });

  // swipe indicator
  const belt = document.querySelector(".sp-swipe-indicator .belt");
  const beltPosition = -(rotationTracker - Math.floor(rotationTracker)) + 0.5;
  belt.style.translate = `${beltPosition * belt.offsetWidth / 6}px 0`;
  const dots = document.querySelectorAll(".sp-swipe-indicator .dot");
  dots.forEach((dot, dotIndex) => {
    if (dotIndex === indexToShow) {
      dot.classList.add("active")
    } else {
      dot.classList.remove("active");
    }
    let dotPosition = dotIndex + 0.5 - rotationTracker;
    if (dotPosition < -boothViews.length / 2) {
      dotPosition += boothViews.length;
    } else if (dotPosition > boothViews.length / 2) {
      dotPosition -= boothViews.length;
    }
    dot.style.translate = `${dotPosition * belt.offsetWidth / 6}px 0`;
  });

}
showBoothView();

// change booth view by scrolling

const scrollStepSize = document.body.offsetHeight / 4;
window.addEventListener("wheel", (e) => {
  rotationTracker += e.deltaY / scrollStepSize;
  showBoothView();
});

// change booth view by dragging the scroll button

const pcScrollButton = document.querySelector(".pc-scroll-button");
let initialMouseY;
let dragDirection = 0;
let switchReady = true;
const dragThreshold = pcScrollButton.offsetWidth / 8;
function dragStart(e) {
  window.addEventListener("mousemove", dragMove);
  window.addEventListener("mouseup", dragEnd);
  initialMouseY = e.clientY;
}
function dragMove(e) {
  dragDirection = 0;
  pcScrollButton.classList.remove("scrolling-up");
  pcScrollButton.classList.remove("scrolling-down");
  if (e.clientY > initialMouseY + dragThreshold) {
    dragDirection = 1;
    dragSwitch();
    pcScrollButton.classList.add("scrolling-down");
  }
  if (e.clientY < initialMouseY - dragThreshold) {
    dragDirection = -1;
    dragSwitch();
    pcScrollButton.classList.add("scrolling-up");
  }
}
function dragSwitch() {
  if (!switchReady || dragDirection === 0) return;
  if (dragDirection === 1) {
    switchReady = false;
    rotationTracker++;
    showBoothView();
    setTimeout(() => {
      switchReady = true;
      dragSwitch();
    }, 1000);
  } else if (dragDirection === -1) {
    switchReady = false;
    rotationTracker--;
    showBoothView();
    setTimeout(() => {
      switchReady = true;
      dragSwitch();
    }, 1000);
  }
}
function dragEnd() {
  window.removeEventListener("mousemove", dragMove);
  window.removeEventListener("mouseup", dragEnd);
  pcScrollButton.classList.remove("scrolling-up");
  pcScrollButton.classList.remove("scrolling-down");
  dragDirection = 0;
}
pcScrollButton.addEventListener("mousedown", dragStart);

// change booth view by swiping

let activeTouchId = null;
let lastTouchX;
const swipeStepSize = document.body.offsetWidth / 4;
function touchStart(e) {
  if (activeTouchId !== null) return;
  const touch = e.changedTouches.item(0);
  activeTouchId = touch.identifier;
  lastTouchX = touch.clientX;
}
function touchMove(e) {
  if (activeTouchId === null) return;
  for (let i = 0; i < e.changedTouches.length; i++) {
    const touch = e.changedTouches.item(i);
    if (touch.identifier === activeTouchId) {
      rotationTracker -= (touch.clientX - lastTouchX) / swipeStepSize;
      showBoothView();
      lastTouchX = touch.clientX;
    }
  }
}
function touchEnd(e) {
  if (activeTouchId === null) return;
  for (let i = 0; i < e.changedTouches.length; i++) {
    const touch = e.changedTouches.item(i);
    if (touch.identifier === activeTouchId) {
      activeTouchId = null;
      rotationTracker = Math.floor(rotationTracker) + 0.5;
      showBoothView();
      break;
    }
  }
}
window.addEventListener("touchstart", touchStart);
window.addEventListener("touchmove", (e) => { e.preventDefault(); touchMove(e); }, {passive: false});
window.addEventListener("touchend", touchEnd);
window.addEventListener("touchcancel", touchEnd);


})();