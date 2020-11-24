LA Web GCF Dependencies
=======================

For production, you would want to modify your index.html to use the "minified" versions, but for development these
are included

### Audio

* howler.js et al, provides HTML5 audio functionality similar to OpenAL and is used by la.audio.js
* WebAudioFontPlayer.js provides MIDI sequencing and tonal note playing (different license! turned off by default)
* scriptracker-1.1.1 provides support for S3M and MOD files from the Amiga Music Scene (turned off by default)

### Input

* gamecontroller.js wraps Gamepad API
* Tocca.js provides simple touch gesturing support without depending on jquery
* magic-mouse.css / .js provides advanced mouse cursor manipulation

### Display

* three.js provides WebGL support for a wide range of features including shading pipelines
* twgl.js provides simplified WebGL API
* screenfull.min.js wraps Fullscreen API

### Utility

* jquery (3.5.1) provides DOM manipulation functionality and is used in conjunction with la.utils.js
* js.cookie is used for handling cookies and is used in conjunction with la.utils.js
* tinycolor.js provides useful CSS conversions to HSV RGB to support la.color.js

### Others

* planck.js is provided as a Box2D implementation
* two.js is included, billed as a two-dimensional drawing api geared towards modern web browsers by jonobr1
* createjs.js is included to provide a suggested (but heavy, its 1MB+) alternative to LAWG's built-in HTML5 engine (turned off by default)
