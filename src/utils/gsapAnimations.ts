// /src/utils/gsapAnimations.js
import { gsap } from "gsap";

export const createmenuAnim = (modalMenu: HTMLElement) => {
  // Select the elements inside the modalMenu
  const bgImage = modalMenu.querySelector('.background-nav-image');
  const menuItems = modalMenu.querySelectorAll('.menu-list li');
  const $modal = document.getElementById("modalMenu");

  // Initial Setup
  gsap.set($modal, { autoAlpha: 0 }); // Fade in the modal
  gsap.set(bgImage, { autoAlpha: 0 }); // Fade in the background image
  gsap.set(menuItems, { opacity: 0, x: 50 }); // Slide in menu items with GPU optimization

  // Create the timeline, initially paused
  const tl = gsap.timeline({ paused: true, reversed: true });

  tl.to($modal, {
    autoAlpha: 1, // Fade in the modal
    display: "flex",
    duration: 0.5,
    ease: "power2.inOut",
  }, 0)
    .to(bgImage, {
      autoAlpha: 1, // Fade in the background image
      duration: 0.4,
      ease: "power2.inOut",
    }, "<0.1")
    .fromTo(menuItems, {
      opacity: 0, // Initial state for menu items
      x: 50, // Slide in from the right
    }, {
      opacity: 1, // Fade in menu items
      x: 0, // Move to original position
      duration: 0.4,
      ease: "power2.out",
      stagger: 0.1, // Stagger for smoother appearance
    }, "-=0.1");

  return tl;
};