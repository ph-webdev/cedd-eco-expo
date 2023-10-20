"use strict";

(function() {


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
  })
}

// change booth view by scrolling

const scrollStepSize = document.body.offsetHeight / 4;
window.addEventListener("wheel", (e) => {
  rotationTracker += e.deltaY / scrollStepSize;
  showBoothView();
});

// change booth view by dragging the scroll button

const scrollButton = document.querySelector(".scroll-button");
let isDragging = false;
let initialMouseY;
let dragDirection = 0;
let switchReady = true;
const dragThreshold = scrollButton.offsetWidth / 8;
function dragStart(e) {
  window.addEventListener("mousemove", dragMove);
  window.addEventListener("mouseup", dragEnd);
  isDragging = true;
  initialMouseY = e.clientY;
}
function dragMove(e) {
  dragDirection = 0;
  scrollButton.classList.remove("scrolling-up");
  scrollButton.classList.remove("scrolling-down");
  if (e.clientY > initialMouseY + dragThreshold) {
    dragDirection = 1;
    dragSwitch();
    scrollButton.classList.add("scrolling-down");
  }
  if (e.clientY < initialMouseY - dragThreshold) {
    dragDirection = -1;
    dragSwitch();
    scrollButton.classList.add("scrolling-up");
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
  scrollButton.classList.remove("scrolling-up");
  scrollButton.classList.remove("scrolling-down");
  isDragging = false;
  dragDirection = 0;
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