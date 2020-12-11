'use strict';

String.prototype.replaceAll = function(search, replacement) {
    let target = this;
    return target.split(search).join(replacement);
};

function numToLetter( n ) {
 return String.fromCharCode(n % 26 + 'a'.charCodeAt(0));
}

function isString(x) {
  return Object.prototype.toString.call(x) === "[object String]";
}

function is_string(x) { return isString(x); }

function assure_string_array(x) { if ( !is_array(x) ) return [ x ]; else return x; }

function stripHtml(html) {
   let tmp = document.createElement("DIV");
   tmp.innerHTML = html;
   return tmp.textContent || tmp.innerText || "";
}

function slugify(s) {
  return s.toString().toLowerCase()
    .replace(/\s+/g, '-') // Replace spaces with -
    .replace(/&/g, '-and-') // Replace & with 'and'
    .replace(/[^\w\-]+/g, '') // Remove all non-word characters
    .replace(/\-\-+/g, '-') // Replace multiple - with single -
    .replace(/^-+/, '') // Trim - from start of text
    .replace(/-+$/, '') // Trim - from end of text
    ;
}

// Data normalization: is true?
function istrue(v) {
	let b=isString(b)?v.toLowerCase():v;
	if ( b === true ) return true;
	if ( b == '1' ) return true;
	if ( b === 1 ) return true;
	if ( b == 'true' ) return true;
	if ( b == 'y' ) return true;
	if ( b == 'yes' ) return true;
	return false;
}

// Data normalization: is false?
function isfalse(v) {
	let b=isString(b)?v.toLowerCase():v;
	if ( b === false ) return true;
	if ( b == '0' ) return true;
	if ( b === 0 ) return true;
	if ( b == 'false' ) return true;
	if ( b == 'n' ) return true;
	if ( b == 'no' ) return true;
	return false;
}

class LFS {
 constructor() {
  if (typeof(Storage) !== "undefined") this.supported=true;
  else this.supported=false;
 }
 Get( named ) {
  return localStorage.getItem(named);
 }
 Set( named, value ) {
  return localStorage.setItem(named);
 }
};