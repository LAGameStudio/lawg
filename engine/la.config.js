'use strict';

var la={};

class LAConfig {
  constructor() {
    this.howler = {
      pool_size: 5,
      autoUnlock: true,
      html5PoolSize: 10,
      autoSuspend: true,
    };
    this.mouse = {
      OVERRIDE_CONTEXT_MENU:true
    };
    this.touch = {
     SWIPE_THRESHOLD:100, //  (milliseconds)
     DBL_TAP_THRESHOLD:200, // range of time in which a dbltap event could be detected,
     LONG_TAP_THRESHOLD:1000, // range of time after which a longtap event could be detected
     TAP_THRESHOLD:150, // range of time in which a tap event could be detected
     TAP_PRECISION:60 / 2, //  (touch events boundaries) (pixels)
     JUST_ON_TOUCH_DEVICES:true, //  ( decide whether you want to use the Tocca.js events only on the touch devices )
     USE_JQUERY:false //  ( will not use jQuery events, even if jQuery is detected )     
    };
    this.animation = {
      FRAMERATE: 0 // 0 means "as fast as optimal, try for 60FPS", otherwise values are in "frames per second", 0 is probably best value, and aims for 60fps
    };
    this.animation.FPS=60; // update when you change the above    
    // Global values
    this.global={ frame: 0, paused: false };
    var d = new Date();
    this.global.started= d.getMilliseconds();
  }
  // Updates (or initializes) states for global settings.
  Update() {
    // howler.js
    this.global.howler = Howler;
    Howler.html5PoolSize = this.html5PoolSize;
    // tocca.js
    window.tocca({
     useJquery: la.config.touch.IGNORE_JQUERY,
     swipeThreshold: la.config.touch.SWIPE_THRESHOLD,
     tapThreshold: la.config.touch.TAP_THRESHOLD,
     dbltapThreshold: la.config.touch.DBL_TAP_THRESHOLD,
     longtapThreshold: la.config.touch.LONG_TAP_THRESHOLD,
     tapPrecision: la.config.touch.TAP_PRECISION,
     justTouchEvents: la.config.touch.JUST_ON_TOUCH_DEVICES      
    });
  }
  Frame() {
    var d = new Date();
    this.global.time = d.getMilliseconds();
    this.global.elapsed = this.global.time-this.global.started;
    this.global.expired = this.global.elapsed / 1000.0;
    this.global.frame+=1;
    if ( this.global.frame >  Number.MAX_SAFE_INTEGER-1 ) this.global.frame=0;
  }
};

la.config = new LAConfig();
la.FPS = function () { return la.config.animation.FPS; }