"use strict";

(function() {


// change booth image

const navButtons = document.querySelectorAll(".pc-nav button");
const boothImgs = document.querySelectorAll(".booth-img");
navButtons.forEach((button, buttonIndex) => {
  button.addEventListener("click", () => {
    const indexToShow = buttonIndex % boothImgs.length;
    boothImgs.forEach((img, imgIndex) => {
      if (imgIndex === indexToShow) {
        img.classList.add("active");
      } else {
        img.classList.remove("active");
      }
    });
  });
});

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