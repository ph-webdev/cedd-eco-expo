"use strict";

(function() {


// booth views handling setup

const boothImgs = document.querySelectorAll(".booth-img.outer");
let rotationTracker = 0.5;
function showBoothImg() {
  rotationTracker = (rotationTracker + boothImgs.length) % boothImgs.length;
  const indexToShow = Math.floor(rotationTracker);
  boothImgs.forEach((img, imgIndex) => {
    if (imgIndex === indexToShow) {
      img.classList.add("active");
    } else {
      img.classList.remove("active");
    }
  })
}

// change booth view by scrolling

const scrollStepSize = document.body.offsetHeight / 4;
window.addEventListener("wheel", (e) => {
  rotationTracker += e.deltaY / scrollStepSize;
  showBoothImg();
});

// change booth view by dragging the scroll button

const scrollButton = document.querySelector(".scroll-button");
let initialMouseY;
const dragStepSize = scrollButton.offsetWidth / 4;
function dragStart(e) {
  window.addEventListener("mousemove", dragMove);
  window.addEventListener("mouseup", dragEnd);
  initialMouseY = e.clientY;
}
function dragMove(e) {
  rotationTracker += e.movementY / dragStepSize;
  showBoothImg();
  if (e.clientY > initialMouseY) {
    scrollButton.classList.remove("scrolling-up");
    scrollButton.classList.add("scrolling-down");
  }
  if (e.clientY < initialMouseY) {
    scrollButton.classList.remove("scrolling-down");
    scrollButton.classList.add("scrolling-up");
  }
}
function dragEnd() {
  window.removeEventListener("mousemove", dragMove);
  window.removeEventListener("mouseup", dragEnd);
  scrollButton.classList.remove("scrolling-up");
  scrollButton.classList.remove("scrolling-down");
}
scrollButton.addEventListener("mousedown", dragStart);

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
      showBoothImg();
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
      break;
    }
  }
}
window.addEventListener("touchstart", touchStart);
window.addEventListener("touchmove", (e) => { e.preventDefault(); touchMove(e); }, {passive: false});
window.addEventListener("touchend", touchEnd);
window.addEventListener("touchcancel", touchEnd);

// handle opening and closing of popouts

const popoutShows = document.querySelectorAll(".popout-show");
const popoutHides = document.querySelectorAll(".popout-hide");
for (let ps of popoutShows) {
  ps.addEventListener("click", () => {
    const popout = document.querySelector(`.popout[data-pid="${ps.dataset.pid}"]`);
    popout.showModal();
  });
}
for (let ph of popoutHides) {
  ph.addEventListener("click", () => {
    const popout = ph.closest(".popout");
    popout.close();
  });
}


})();