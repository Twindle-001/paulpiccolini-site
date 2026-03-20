"use client";

import { useEffect } from "react";

export default function ImageProtection() {
  useEffect(() => {
    // Disable right-click on images
    const handleContextMenu = (e: Event) => {
      if ((e.target as HTMLElement).tagName === "IMG") {
        e.preventDefault();
      }
    };

    // Disable drag on images
    const handleDragStart = (e: Event) => {
      if ((e.target as HTMLElement).tagName === "IMG") {
        e.preventDefault();
      }
    };

    document.addEventListener("contextmenu", handleContextMenu);
    document.addEventListener("dragstart", handleDragStart);

    // Add CSS to disable pointer events on long press (mobile)
    const style = document.createElement("style");
    style.textContent = `
      img {
        -webkit-user-select: none;
        -khtml-user-select: none;
        -moz-user-select: none;
        -o-user-select: none;
        user-select: none;
        -webkit-touch-callout: none;
        pointer-events: auto;
      }
    `;
    document.head.appendChild(style);

    return () => {
      document.removeEventListener("contextmenu", handleContextMenu);
      document.removeEventListener("dragstart", handleDragStart);
      document.head.removeChild(style);
    };
  }, []);

  return null;
}
