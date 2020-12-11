'use strict';

la.config.Update();

// Establish our animation loop

if ( la.config.animation.FRAMERATE == 0 ) { // Technically, this aims for 60FPS, this is probably best.
 la.Frame=function() {
  if ( !la.config.global.paused ) {
   la.config.Frame();
   la.renderers.Frame();
   window.requestAnimationFrame(la.Frame);
  }
 };
 window.requestAnimationFrame(la.Frame);
} else {
 la.Frame=function() {
  if ( !la.config.global.paused ) {
   la.config.Frame();
   la.renderers.Frame();
   window.requestAnimationFrame(la.Frame);
  }
 };
 setInterval(la.Frame,1000/la.config.animation.FRAMERATE);
}
