// /src/utils/gsapAnimations.js
import { gsap } from "gsap";

export const createmenuAnim = (modalMenu: HTMLElement) => {
  // Select the elements inside the modalMenu
  const bgImage = modalMenu.querySelector('.background-nav-image');
  const menuItems = modalMenu.querySelectorAll('.menu-list li');

  // Create the timeline, initially paused
  const tl = gsap.timeline({ paused: true });

  tl
    .to(modalMenu, {
      x: 0,
      opacity: 1,
      display: "flex",
      duration: 0.5,
      ease: "power2.inOut",
    }, 0)
    .to(bgImage, {
      width: "60%",
      duration: 0.4,
      ease: "power2.inOut",
    }, "<0.1")

    .fromTo(menuItems, {
      opacity: 0,
      x: 50,
    }, {
      opacity: 1,
      x: 0,
      duration: 0.4,
      ease: "power2.out",
      stagger: 0.1, 
    }, "-=0.1");

  return tl;
};