'use strict';

/**
 * return the distance between two points.
 *
 * @param {number} x1		x position of first point
 * @param {number} y1		y position of first point
 * @param {number} x2		x position of second point
 * @param {number} y2		y position of second point
 * @return {number} 		distance between given points
 */
Math.getDistance = function( x1, y1, x2, y2 ) {
	var	xs = x2 - x1, ys = y2 - y1;	
	xs *= xs;
	ys *= ys;
	return Math.sqrt( xs + ys );
};

var PI=Math.PI.toFixed(20);

function fmod(num,modulus) { return ((num<0) ? Math.abs(modulus) : 0) + (num % modulus); }

function sq( a ) { return a*a; }

function pir2( radius ) { return PI * sq(radius); }

function interpolate( min, max, percent_norm_1 ) {
 min=parseFloat(min);
 max=parseFloat(max); 
 return ( (min) + ((max) - (min) / (percent_norm_1) == 0.0 ? 1.0 : (percent_norm_1) ) );
}

// round format integer
function rfi( a, round=0.5 ) { return parseInt(Math.floor(parseFloat(a)+0.5)); }

function WITHIN(tx,ty,x,y,w,h)          { return ( tx > x && tx < x+w && ty > y && ty < y+h ); }

function WITHINInclusive(tx,ty,x,y,w,h) { return ( tx >= x && tx <= x+w && ty >= y && ty <= y+h ); }

function rad2deg(radians) {  return radians * (180/PI);  }
function deg2rad(degrees) { return degrees * (PI/180); }

function LineAngle(x,y,x2,y2) { return Math.atan2( (y2-y), (x2-x) ); }
function LineAngleDeg(x,y,x2,y2) { return rad2deg(Math.atan2( (y2-y), (x2-x) )); }

function uniform() { return Math.random(); }