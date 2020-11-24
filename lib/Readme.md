LA Web GCF Dependencies
=======================

### Audio

* howler.js et al, provides basic audio functionality and is used by la.audio.js
* WebAudioFontPlayer.js provides MIDI sequencing and tonal note playing
* scriptracker-1.1.1 provides support for S3M and MOD files from the Amiga Music Scene

### Input

* gamecontroller.js wraps Gamepad API
* Tocca.js provides simple touch gesturing support without depending on jquery
* magic-mouse.css / .js provides advanced mouse cursor manipulation

### Display

* three.js provides WebGL support for a wide range of features including shading pipelines
* twgl.js provides simplified WebGL API
* screenfull.min.js wraps Fullscreen API

### Utility

* jquery provides DOM manipulation functionality and is used in conjunction with la.utils.js
* js.cookie is used for handling cookies and is used in conjunction with la.utils.js
* tinycolor.js provides useful CSS conversions to HSV RGB to support la.color.js