'use strict';

class Texture extends ListItem {
  constructor() {
   super();
   this.image=null;
   this.w=-1;
   this.h=-1;
   this.complete=false;
  }
  Load( src ) {
   this.image=new Image();
   this.image.handler=this;
   this.image.src=src;
   this.image.onload = function() {
    this.handler.w=this.naturalWidth;
    this.handler.h=this.naturalHeight;
    this.handler.complete=true;
   };
  }
};

class TextureLibrary extends LinkedList {
  constructor() {
   super();
  }
  Load(src) {
    let t=new Texture();
    t.Load(src);
    this.Append(t);
    return t;
  }
};

class SpriteSheet extends ListItem {
  constructor() {
   super();
  }
  
};

class SpriteSheets extends LinkedList {
  constructor() {
   super();
  }
  
};

class Art2D {
  constructor() {
    this.Unbind();
    this.library=new TextureLibrary();
    this.sheets=new SpriteSheets();
  }
  Bind( ctx ) {
    this.context=ctx;
  }
  Unbind() {
    this.context=null;
  }
  
  Pivot( texture, dx, dy, deg, ofsx=0, ofsy=0 ) {
   if ( !texture.complete ) return;
   let rads=deg2rad(deg);
   this.context.translate(dx, dy);
   this.context.rotate(rads);
   this.context.translate(ofsx,ofsy);
   this.context.drawImage(texture.image, -texture.w / 2, -texture.h / 2, texture.w, texture.h);
   this.context.translate(-ofsx, -ofsy);
   this.context.rotate(-rads);
   this.context.translate(-dx, -dy);
  }  
  PivotScale( texture, dx, dy, deg, scale, ofsx=0, ofsy=0 ) {
   if ( !texture.complete ) return;
   let rads=deg2rad(deg);
   this.context.translate(dx, dy);
   this.context.rotate(rads);
   this.context.translate(ofsx,ofsy);
   let fw=texture.width*scale, fh=texture.height*scale;
   this.context.drawImage(texture.image, 0,0, fw, fh, -fh / 2, -fw / 2);
   this.context.translate(-ofsx, -ofsy);
   this.context.rotate(-rads);
   this.context.translate(-dx, -dy);
  }  
  PivotPart( texture, dx, dy, sx, sy, sw, sh, deg, ofsx=0, ofsy=0 ) {
   if ( !texture.complete ) return;
   let rads=deg2rad(deg);
   this.context.translate(dx, dy);
   this.context.rotate(rads);
   this.context.translate(ofsx,ofsy);
   this.context.drawImage(texture.image, sx, sy, -sw / 2, -sh / 2);
   this.context.translate(-ofsx, -ofsy);
   this.context.rotate(-rads);
   this.context.translate(-dx, -dy);
  }  
  Draw( texture, dx, dy, dw=null, dh=null ) {
   if ( !texture.complete ) return;
   this.context.drawImage(texture.image,dx,dy);
  }  
  DrawScaled( texture, dx, dy, scale ) {
   if ( !texture.complete ) return;
   this.context.drawImage(texture.image,dx,dy,texture.w*scale,texture.h*scale);
  }
  Centered( texture, dx, dy, dw=null, dh=null ) {
   if ( !texture.complete ) return;
   this.context.drawImage(texture.image,dx,dy,-texture.w/2,-texture.h/2);
  }
  CenteredPart( texture, dx, dy, sx, sy, sw, sh ) {
   if ( !texture.complete ) return;
   let fw=texture.w, fh=texture.h;
   let ofsx=dx - fw/2, ofsy=dy - fh/2;
   this.context.translate(ofsx,ofsy);
   this.context.rotate(rads);
   this.context.drawImage(texture.image, sx, sy, -sw / 2, -sh / 2);
   this.context.rotate(-rads);
   this.context.translate(-ofsx, -ofsy);
  }
  CenteredScaled( texture, dx, dy, scale ) {
   if ( !texture.complete ) return;
   let fw=texture.w*scale, fh=texture.h*scale;
   this.context.drawImage(texture.image,dx-fw/2,dy-fh/2,fw,fh);
  }
  CenteredScaledPart( texture, dx, dy, sx, sy, sw, sh, scale ) {
   if ( !texture.complete ) return;
   let fw=texture.w*scale, fh=texture.h*scale;
   let ofsx=dx - fw/2, ofsy=dy - fh/2;
   this.context.translate(ofsx,ofsy);
   this.context.rotate(rads);
   this.context.drawImage(texture.image, sx, sy, -sw / 2, -sh / 2);
   this.context.rotate(-rads);
   this.context.translate(-ofsx, -ofsy);
  }
  Stretch( texture, dx, dy, dw, dh ) {
   if ( !texture.complete ) return;
   this.context.drawImage(texture.image, dx,dy,dw,dh);
  }  
  StretchPart( texture, sx, sy, sw, sh, dx, dy, dw, dh ) {
   if ( !texture.complete ) return;
   this.context.drawImage(texture.image, sx,sy, sw,sh, dx,dy, dw,dh );
  }
  
  // Adapted from https://gitlab.com/davideblasutto/canvas-multiline-text
  FitTextInRect( text, opts={}) {
   // Default options
	 if(!opts) opts = {};
   if (!opts.font) opts.font = 'sans-serif';
   if (typeof opts.stroke == 'undefined')	opts.stroke = false;
   if (typeof opts.verbose == 'undefined') opts.verbose = false;
   if (!opts.rect) opts.rect = { x: 0, y: 0, w: this.context.canvas.width,	h: this.context.canvas.height };
   if (!opts.lineHeight) opts.lineHeight = 1.1;
   if (!opts.minFontSize) opts.minFontSize = 30;
   if (!opts.maxFontSize) opts.maxFontSize = 100;
   if (!opts.logFunction) opts.logFunction = function(message) { console.log(message) };
   let words=explode(" ",text);
   if (opts.verbose) opts.logFunction('Text contains ' + words.length + ' words');
   let lines = []
   // Finds max font size  which can be used to print whole text in opts.rec
   for (let fontSize = opts.minFontSize; fontSize <= opts.maxFontSize; fontSize++) {
		let lineHeight = fontSize * opts.lineHeight;
  	this.context.font = " " + fontSize + "px " + opts.font;
		let x = opts.rect.x;
		let y = opts.rect.y + fontSize;
		lines = [];
		let line = "";
		for (let word of words) {
			let linePlus = line + word + " ";
			if (this.context.measureText(linePlus).width > (opts.rect.width)) {
				lines.push({ text: line, x: x, y: y });
				line = word + " ";
				y += lineHeight;
			} else line = linePlus;
		}
		lines.push({ text: line, x: x, y: y });
		if (y > opts.rect.height) break;
	 }
   if (opts.verbose) opts.logFunction("Font used: " + this.context.font);
   for (let line of lines) {
		if (opts.stroke) this.context.strokeText(line.text.trim(), line.x, line.y);
		else this.context.fillText(line.text.trim(), line.x, line.y);
   }
	 return fontSize;
  }
  // Adapted from drawString.js https://gist.github.com/chriskoch/366054#file-drawstring-js
  MultilineText(text, posX, posY, textColor, font, fontSize) {
	 let lines = text.split("\n");
	 if (!font) font = "'serif'";
	 if (!fontSize) fontSize = 16;
	 if (!textColor) textColor = '#000000';
	 this.context.save();
	 this.context.font = fontSize + "px " + font;
	 this.context.fillStyle = textColor;
	 this.context.translate(posX, posY);
	 for (let i = 0; i < lines.length; i++) {
 	 	this.context.fillText(lines[i],0, i*fontSize);
	 }
	 this.context.restore();
  }
  // Adapted from drawString.js https://gist.github.com/chriskoch/366054#file-drawstring-js
  MultilineTextRotated(text, posX, posY, textColor, rotation, font, fontSize) {
	 let lines = text.split("\n");
	 if (!rotation) rotation = 0;
	 if (!font) font = "'serif'";
	 if (!fontSize) fontSize = 16;
	 if (!textColor) textColor = '#000000';
	 this.context.save();
	 this.context.font = fontSize + "px " + font;
	 this.context.fillStyle = textColor;
	 this.context.translate(posX, posY);
	 this.context.rotate(rotation * Math.PI / 180);
	 for (let i = 0; i < lines.length; i++) {
 	 	this.context.fillText(lines[i],0, i*fontSize);
	 }
	 this.context.restore();
  }
  Fill( clr ) {
    this.context.fillStyle=clr;
  }
  Stroke( clr, lineWidth=null ) {
    if ( lineWidth ) this.context.lineWidth = lineWidth;
    this.context.strokeStyle=clr;
  }
  LinesRotated( deg, points, ofsx=0, ofsy=0 ) {
   if ( points.length < 2 ) return;
   this.context.beginPath();
   for ( let i=0; i<points.length; i++ ) {
    let j= i<points.length-1 ? i+1 : 0;
    let p1=new Cartesian(points[i].x,points[i].y);
    p1=p1.Rotate(deg);
    let p2=new Cartesian(points[j].x,points[j].y);
    p2=p2.Rotate(deg);
    this.context.moveTo(p1.x+ofsx, p1.y+ofsy);
    this.context.lineTo(p2.x+ofsx, p2.y+ofsy);
    this.context.stroke();
   }
  }
  Lines( points, ofsx=0, ofsy=0 ) {
   if ( points.length < 2 ) return;
   this.context.beginPath();
   for ( let i=0; i<points.length; i++ ) {
    let j= i<points.length-1 ? i+1 : 0;
    this.context.moveTo(points[i].x+ofsx, points[i].y+ofsy);
    this.context.lineTo(points[j].x+ofsx, points[j].y+ofsy);
   }
   this.context.closePath();
   this.context.stroke();
  }
  FillLines( points, ofsx=0, ofsy=0 ) {
   if ( points.length < 2 ) return;
   this.context.beginPath();
   for ( let i=0; i<points.length; i++ ) {
    let j= i<points.length-1 ? i+1 : 0;
    this.context.moveTo(points[i].x+ofsx, points[i].y+ofsy);
    this.context.lineTo(points[j].x+ofsx, points[j].y+ofsy);
   }
   this.context.closePath();
   this.context.stroke();
   this.context.fill();
  }
  Line( x, y, w, h ) {    
   this.context.beginPath();
   this.context.moveTo(x, y);
   this.context.lineTo(w, h);
   this.context.stroke();
  }
  Rectangle( x, y, w, h ) {
    let _x=x,_y=y,_w=w,_h=h;
    if (classname(x) == "Cartesian") {
      _x=x.x;
      _y=x.y;
      _w=x.w;
      _h=x.h;
    }
    let _x2=_x+_w, _y2=_y+_h;
    this.Line(_x,_y,_x2,_y);
    this.Line(_x,_y,_x,_y2);
    this.Line(_x2,_y,_x2,_y2);
    this.Line(_x,_y2,_x2,_y2);
  }

};

la.art = new Art2D();