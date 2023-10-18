"use strict";

(function() {


// booth images handling setup

const boothImgs = document.querySelectorAll(".booth-img.outer");
let rotationTracker = 0.5;
function showBoothImg(indexToShow) {
  boothImgs.forEach((img, imgIndex) => {
    if (imgIndex === indexToShow) {
      img.classList.add("active");
    } else {
      img.classList.remove("active");
    }
  })
}

// change booth image by scrolling

window.addEventListener("wheel", (e) => {
  rotationTracker += (e.deltaY > 0) ? 0.125 : (e.deltaY < 0) ? -0.125 : 0;
  rotationTracker = (rotationTracker + boothImgs.length) % boothImgs.length;
  showBoothImg(Math.floor(rotationTracker));
});

// change booth image by dragging the scroll button

let initialMouseY;
const scrollButton = document.querySelector(".scroll-button");
function dragStart(e) {
  window.addEventListener("mousemove", dragMove);
  window.addEventListener("mouseup", dragEnd);
  initialMouseY = e.clientY;
}
function dragMove(e) {
  rotationTracker += e.movementY / 64;
  rotationTracker = (rotationTracker + boothImgs.length) % boothImgs.length;
  showBoothImg(Math.floor(rotationTracker));
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

// change booth image by swipe

// WIP

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