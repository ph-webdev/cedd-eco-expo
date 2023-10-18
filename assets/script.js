"use strict";

(function() {


// change booth image on scroll and on drag of the scroll button

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

window.addEventListener("wheel", (e) => {
  rotationTracker += (e.deltaY > 0) ? 0.125 : (e.deltaY < 0) ? -0.125 : 0;
  rotationTracker = (rotationTracker + boothImgs.length) % boothImgs.length;
  showBoothImg(Math.floor(rotationTracker));
})

const scrollButton = document.querySelector(".scroll-button");
function dragStart() {
  window.addEventListener("mousemove", dragMove);
  window.addEventListener("mouseup", dragEnd);
}
function dragMove(e) {
  rotationTracker += e.movementY / 64;
  rotationTracker = (rotationTracker + boothImgs.length) % boothImgs.length;
  showBoothImg(Math.floor(rotationTracker));
}
function dragEnd() {
  window.removeEventListener("mousemove", dragMove);
  window.removeEventListener("mouseup", dragEnd);
}
scrollButton.addEventListener("mousedown", dragStart);

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