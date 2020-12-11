'use strict';

// Effectively an overwriting merge of two objects
function importObject(to, from,name=null) {
 var oname=name;
 if ( !defined(name) || !name ) oname=from.constructor.name;
 for (var prop in from) {
  if ( defined(to[prop]) ) console.log("importObject("+oname+"): Warning `"+prop+"` is already defined, redefining" );
  to[prop] = from[prop];
 }
}

function After( fun ) {
 setTimeout(fun,10);
}

// Iterate an array of objects recursively
function forEachNested(O, f, cur){
 O = [ O ]; // ensure that f is called with the top-level object
 while (O.length) // keep on processing the top item on the stack
  if( f( cur = O.pop() ) && cur && // do not spider down if `f` returns true
   cur instanceof Object && // ensure cur is an object, but not null 
   [Object, Array].includes(cur.constructor) //limit search to [] and {}
  ) O.push.apply(O, Object.values(cur)); //search all values deeper inside
}

// Traverse one level down in a tree, passing it to a function.
function traverse(o,func) {
 for (var i in o) {
  func.apply(this,[i,o[i]]);  
  if (o[i] !== null && typeof(o[i])=="object") traverse(o[i],func); // going one step down in the object tree!!
 }
}

//// Useful web page and browser stuff

// Your GET POST variables
function getUrlParam(name) {
 var results = new RegExp('[\\?&]' + name + '=([^&#]*)').exec(window.location.href);
 return (results && results[1]) || undefined;
}

// Read a page's GET URL variables and return them as an associative array.
function getparams() {
 var vars = [], hash;
 var hashes = window.location.href.slice(window.location.href.indexOf('?') + 1).split('&');
 for(var i = 0; i < hashes.length; i++) { hash = hashes[i].split('='); vars[hash[0]] = hash[1]; }
 return vars;
}

// Check your protocol (returns http: or https:)
function get_protocol() { return location.protocol; }

// Check if the protocol is SSL
function is_ssl() { return (get_protocol() === 'https:'); }


// Fakes an error to generate a callstack in the console
function FakeError(identifier) {
 console.log(identifier);
 console.log(new Error().stack);
}

// DOM retrieval quickness
function Get( id ) { return document.getElementById(id); }

// Prevent all defaults...
function preventDefaults(e) {
  e.preventDefault();
  e.stopPropagation();
}

// Get the value from an ID.
function GetInputValue(id) {
	var a = Get(id);
	return a ? $(a).val() : null;
}

// Check if an element is checked
function isChecked(item) {	
  if ( item.checked ) return true;
  switch(item.getAttribute('aria-checked')) {
      case "true": return true;
   default: return false;
  }
}

// returns the browser's page visibility property
function PageVisibilityProp(){
  var prefixes = ['webkit','moz','ms','o'];    
  // if 'hidden' is natively supported just return it
  if ('hidden' in document) return 'hidden';    
  // otherwise loop over all the known prefixes until we find one
  for (var i = 0; i < prefixes.length; i++){
      if ((prefixes[i] + 'Hidden') in document) 
          return prefixes[i] + 'Hidden';
  }
  // otherwise it's not supported
  return null;
}

function isPageVisible() {
  var prop = PageVisibilityProp();
  if (!prop) return true;    
  return !document[prop];
}

// Responsive tests for area width
function ProbeAreaWidth(domid) {
  var probe=document.createElement("div");
	var outer=Get(domid);
  outer.appendChild(probe);
	probe.setAttribute("id","ProbeAreaWidth-probe");
	probe.setAttribute("style","width:100%;");
	var totalW=probe.clientWidth;
  outer.removeChild(probe);
  return totalW;
}


function randomele( arr ) {
 return arr[Math.floor(Math.random()*arr.length)];
}

// Generate a download from a function
function downloadLink(url,filename) {
  var element = document.createElement('a');
  element.setAttribute('href', url);
  element.setAttribute('download', filename);
  element.style.display = 'none';
  document.body.appendChild(element);
  element.click();
  document.body.removeChild(element);
}

// Function to download data to a file
function downloadAsFile(data, filename, type="text") {
    var file = new Blob([data], {type: type});
    if (window.navigator.msSaveOrOpenBlob) // IE10+
        window.navigator.msSaveOrOpenBlob(file, filename);
    else { // Others
        var a = document.createElement("a"),
                url = URL.createObjectURL(file);
        a.href = url;
        a.download = filename;
        document.body.appendChild(a);
        a.click();
        setTimeout(function() {
            document.body.removeChild(a);
            window.URL.revokeObjectURL(url);  
        }, 0); 
    }
}


// Password strength from zxcvbn.js
var pwstrength=0;
function passCheckFun( event, id="password-strength-text" ) {
 var ele=event.target;
 var outputele = Get(id);
  var password_strength_messages = {
   0: "Worst <span class='fa fa-warning mi-red'></span>",
   1: "Bad <span class='fa fa-thumbs-down mi-red'></span>",
   2: "Weak <span class='fa fa-frown-o mi-red'></span>",
   3: "Good <span class='fa fa-check mi-green'></span>",
   4: "<span class='mi-green'>Strong</span> <span class='fa fa-user-secret'></span>"
  };
  var v = ele.value;
  var result = zxcvbn(v);
  if(v !== "") {
        if ( outputele ) outputele.innerHTML = "Password Strength: " + "<strong>"
         + password_strength_messages[result.score] + "</strong>"
         ;
       //  <BR>"
       //  + " <span class='feedback'>" + result.feedback.warning + " " + result.feedback.suggestions + "</span>";
        pwstrength=result.score;
  } else {
    if ( outputele) outputele.innerHTML = "";
    pwstrength=0;
  }
}

// php brainfarts
function isset(obj,elem) { return defined(obj) && obj.hasOwnProperty(elem); }
function var_dump(a,b=null) { if ( b ) { console.log(a); console.log(b); } else console.log(a); }
function defined(objele) { var result=false; try { result= (typeof objele !== 'undefined'); } catch(e) { result=false; } return result; }
function classname(o) { return typeof o == "object" ? o.constructor.name : false; }
function isnull(obj) { return (obj !== null); }
function int(a) { return parseInt(a); }
function explode( sep, str ) { return str.split(sep); }
function implode( sep, arr ) { var res=""; for ( var i=0; i<arr.length; i++ ) { res+=arr[i]; if ( i != arr.length -1 ) res+=sep; } return res; }
function is_array(arr) { return Array.isArray(arr); }
function is_object(o) { return ( typeof o == 'object') ? true : false; }
function isBoolean(obj) { return obj === true || obj === false || toString.call(obj) === '[object Boolean]'; }
function is_bool(obj) { return isBoolean(obj); }
function is_number(o) { return (typeof o === 'number') ? true : false;  }
function is_int(o) { return Number.isInteger(o); }
function rtrim (str, charlist) {
  //  discuss at: https://locutus.io/php/rtrim/
  // original by: Kevin van Zonneveld (https://kvz.io)
  //    input by: Erkekjetter
  //    input by: rem
  // improved by: Kevin van Zonneveld (https://kvz.io)
  // bugfixed by: Onno Marsman (https://twitter.com/onnomarsman)
  // bugfixed by: Brett Zamir (https://brett-zamir.me)
  //   example 1: rtrim('    Kevin van Zonneveld    ')
  //   returns 1: '    Kevin van Zonneveld'
  charlist = !charlist ? ' \\s\u00A0' : (charlist + '')
    .replace(/([[\]().?/*{}+$^:])/g, '\\$1')
  const re = new RegExp('[' + charlist + ']+$', 'g')
  return (str + '').replace(re, '')
}

// human file size
function humanFileSize(bytes, si=true) {
  var thresh = (si ? 1000 : 1024), u=-1;
  if (Math.abs(bytes) < thresh) return bytes + ' b';
  var units = si ? ['kb','mb','G','TB','PB','EB','ZB','YB'] : ['KiB','MiB','GiB','TiB','PiB','EiB','ZiB','YiB'];
  do { bytes /= thresh; ++u; } while(Math.abs(bytes) >= thresh && u < units.length - 1);
  return bytes.toFixed(1)+' '+units[u];
}

//// Scrolling / Scroll-to-top for entire pages.

// When the user scrolls down 20px from the top of the document, show the button
function scrollFunction() {
  var mybutton=Get("scroll_to_top");
  if ( !mybutton ) return;
  if (document.body.scrollTop > 20 || document.documentElement.scrollTop > 20) {
    mybutton.style.display = "block";
  } else {
    mybutton.style.display = "none";
  }
}
// usage: window.onscroll = function() {scrollFunction();};

// scrolling
// When the user clicks on the button, scroll to the top of the document
function topFunction() {
 document.body.scrollTop = 0; // For Safari
 document.documentElement.scrollTop = 0; // For Chrome, Firefox, IE and Opera
}

// Scroll to an element
function scrollElement( ele, delayed=2000 ) { 
 $([document.documentElement, document.body]).animate({ scrollTop: $("#"+ele.id).offset().top }, delayed);
}

// Wraps Bootstrap tooltips
function Tooltip( domid, content, direction="top" ) {
 var dom=Get(domid);
 if ( !defined(dom) || !dom ) return false;
 $(dom).attr("data-toggle","tooltip");
 $(dom).attr("data-placement",direction);
 $(dom).attr("title",content);
 $(dom).tooltip();
 return true;
}

// Used to create an HTML switch.

function html_Switch( domid, checked=false, disabled=false) {
	return '<div class="onoffswitch" id="'+domid+'-wrapper"><input type="checkbox" name="'+domid+'" class="onoffswitch-checkbox" id="'+domid+'"'+(checked?" checked":"")+(disabled?" disabled":"")+'>'
	 +'<label class="onoffswitch-label" for="'+domid+'"><span class="onoffswitch-inner"></span><span class="onoffswitch-switch"></span></label></div>';
//	return ('<span class="switch"><input type="checkbox" id="'+domid+'"'+(checked?" checked":"")+(disabled?" disabled":"")+'><span class="slider round"></span></span>');
}



/// A deferred queue that gaurantees unique calls
/*
var deferredQueueEventCodes=[];
var deferredQueueFunctions=[];
function CallDeferredUnique(code,fun) {
 for ( var i=0; i<deferredQueueFunctions.length; i++ ) {
  if ( deferredQueueEventCodes[i] == code ) return;
 }
 deferredQueueFunctions[deferredQueueFunctions.length]=fun;
 deferredQueueEventCodes[deferredQueueEventCodes.length]=code;
}
function updateDeferredQueue() {
 for ( var i=0; i<deferredQueueFunctions.length; i++ ) {
  deferredQueueFunctions[i]();
 }
 deferredQueueEventCodes=[];
 deferredQueueFunctions=[];
}
setInterval(updateDeferredQueue,15);
*/

//// Time and date

function getLocalTime() { var d=new Date(); return d.getMilliseconds(); }

function Timestamped(data) { return { data: data, time: getLocalTime() }; }

var todays_html_date=formatDateForHTML(idleSince);
var week_ago_html_date=formatDateForHTML(Date.now() - 7*(24*60*60*1000));

function nowTimeDate() {
 var currentdate = new Date(Date.now());
 return currentdate.toLocaleString().replaceAll(",","");
 /*
 return (currentdate.getMonth()+1)  + "/"
      + currentdate.getDate() + "/"
      + currentdate.getFullYear() + " @ "  
      + currentdate.getHours() + ":"  
      + currentdate.getMinutes();
      */
}

//// Unix Timestamps

// timestamp conversion
function ts(a) { var d= new Date(parseInt(a)*1000);
 return d.toString()
         .replace("Eastern Standard Time","EST")
         .replace("Eastern Daylight Time","EDT")
         .replace("Pacific Standard Time","PST")
         .replace("Pacific Daylight Time","PDT")
         .replace("Mountain Standard Time","MST")
         .replace("Mountain Daylight Time","MDT")
         .replace("Central Standard Time","CST")
         .replace("Central Daylight Time","CDT")
         ;
}

// timestamp conversion
function tsDDMMYYYY(a,sep='-') {
 var d= new Date(parseInt(a)*1000);
 d=d.toISOString().substring(0,10);
 var parts=d.split('-');
 return parts[2]+sep+parts[1]+sep+parts[0];
}

// timestamp conversion
function tsYYYYMMDD(a,sep='-') {
 var d= new Date(parseInt(a)*1000);
 console.log(d.toISOString());
 d=d.toISOString().substring(0,10);
 var parts=d.split('-');
 return parts[0]+sep+parts[1]+sep+parts[2];
}

//// Date features

var Date_options = {};
var idleSince = Date.now();

function formatDateForHTML(date) {
 var d = new Date(date),
     month = '' + (d.getMonth() + 1),
     day = '' + d.getDate(),
     year = d.getFullYear();
 if (month.length < 2) month = '0' + month;
 if (day.length < 2) day = '0' + day;
 return [year, month, day].join('-');
}

function HUMANDATE( dstring ) { // Locale version for human eyes
 var d= new Date(dstring);
 var options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
 return d.toLocaleDateString(undefined,options);
}

function HUMANTIME( dstring ) { // Locale version for human eyes
 var d= new Date(dstring);
 var options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
 return d.toLocaleTimeString(undefined,options);
}

function DDMMYYYY( dstring ){ // this format required for API calls
 if ( !defined(dstring) ) return null;
 var d= new Date(dstring);
 d=d.toISOString().substring(0,10);
 var parts=d.split('-');
 return parts[2]+'/'+parts[1]+'/'+parts[0];
}

function YYYYMMDD( dstring ){ // this format required for html date input tag value
 if ( !defined(dstring) ) return null;
 var d= new Date(dstring);
 d=d.toISOString().substring(0,10);
 var parts=d.split('-');
 return parts[0]+'-'+parts[1]+'-'+parts[2];
}

// flips YYYYMMDD to DDMMYYYY
function DDMMYYYYtoHUMAN( dstring, sep='/' ){
 var parts=dstring.split(sep);
 var d=new Date();
 d.setDate(parseInt(parts[0]));
 d.setMonth(parseInt(parts[1])-1);
 d.setYear(parseInt(parts[2]));
 var options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
 return d.toLocaleDateString(undefined,options);
}

function YYYYMMDDtoDDMMYYYY(ds, sep="-") {
 var parts=ds.split(sep);
 return parts[1]+sep+parts[2]+sep+parts[0];
}

function DDMMYYYYtoYYYYMMDD(ds, sep="-") {
 var parts=ds.split(sep);
 return parts[1]+sep+parts[2]+sep+parts[0];
}

function DDMMtoMMDD(ds, sep="-") {
 var parts=ds.split(sep);
 return parts[1]+sep+parts[0]+sep+parts[2];
}

function MMDDtoDDMM(ds, sep="-") {
 var parts=ds.split(sep);
 return parts[1]+sep+parts[0]+sep+parts[2];
}

//// Canvas and multimedia helpers

// Adapted from canvas-context  https://github.com/dmnsgn/canvas-context

function createCanvasContext(options = {}) {

const contextTypeList = [
  "2d",
  "webgl",
  "experimental-webgl",
  "webgl2",
  "webgl2-compute",
  "bitmaprenderer",
  "gpupresent"
];
// Get options and set defaults
  if ( !defined(options.contextType) ) options.contextType="2d";
  if ( !defined(options.width) ) options.width=100;
  if ( !defined(options.height) ) options.height=100;
  if ( !defined(options.offscreen) ) options.offscreen=false;
  if ( !defined(options.contextAttributes) ) options.contextAttributes={};
  if ( !defined(options.canvas) ) options.canvas=null;

  // Check contextType is valid
  if (!contextTypeList.includes(options.contextType)) {
    throw new TypeError(`Unknown contextType: "${options.contextType}"`);
  }

  // Return in Node or in a Worker unless a canvas is provided
  // See https://github.com/Automattic/node-canvas for an example
  if (typeof window === "undefined" && !options.canvas) {
    return null;
  }

  // Get offscreen canvas if requested and available
  const e = options.canvas || document.createElement("canvas");
  const c = (options.offscreen) && "OffscreenCanvas" in window ? e.transferControlToOffscreen() : e;

  // Set canvas dimensions (default to 300 in browsers)
  if (Number.isInteger(options.width) && options.width >= 0) c.width = options.width;
  if (Number.isInteger(options.height) && options.height >= 0) c.height = options.height;
  // Get the context with specified attributes and handle experimental-webgl
  let context;
  try { context = c.getContext(options.contextType, options.contextAttributes)
   || (options.contextType === "webgl" ? c.getContext("experimental-webgl", options.contextAttributes) : null);
  } catch (error) { context = null; }
  return { c, context };
}

// tintImage from https://github.com/dmnsgn/canvas-tint-image

var tintImageContext = createCanvasContext({ width: 100, height: 100 });

function tintImage(image, color, opacity = 0.5) {
  if (!tintImageContext) {
    const { context: c } = canvasContext("2d", {
      width: image.width,
      height: image.height,
    });
    tintImageContext = c;
  } else {
    context.canvas.width = image.width;
    context.canvas.height = image.height;
  }
  tintImageContext.save();
  tintImageContext.fillStyle = color;
  tintImageContext.globalAlpha = opacity;
  tintImageContext.fillRect(0, 0, tintImageContext.canvas.width, tintImageContext.canvas.height);
  tintImageContext.globalCompositeOperation = "destination-atop";
  tintImageContext.globalAlpha = 1;
  tintImageContext.drawImage(image, 0, 0);
  tintImageContext.restore();

  return tintImageContext.canvas;
}



//// List Helpers, adapted from https://github.com/h3rb/ZeroTypesSFL

var ListItemID=0;

class ListItem {
 constructor() {
  this.name="";
  this.prev=null;
  this.next=null;
  this.index=-1;
  this.id=ListItemID;
  ListItemID+=1;  if (ListItemID == Number.MAX_SAFE_INTEGER-1) ListItemID=Number.MIN_SAFE_INTEGER;
  this.memberOf=null;
  this.wasMemberOf=null;
  this.rootClass=ListItem;
  this.isListItem=true;
 }
 Up() { this.Forward(); }
 Forward() { this.memberOf.Forward(this); }
 Backward() { this.memberOf.Backward(this); }  
 ToBack() { this.memberOf.ToBack(this); }
 ToFront() { this.memberOf.ToFront(this); }
 classname() {
  return this.constructor.name;
 }
 identity() {
  return this.myClass;
 }
 OnReindex( newIndex ) {}
 OnRemoved( wasMemberOf ) {}
 OnIndexed( wasMemberOf ) {}
};

class LinkedList {
 
 constructor() {
  this.list=[];
  this.isLinkedList=true;
 }

 IndexByID( id ) {
  var value = defined(id.isListItem) && id.isListItem ? id.id : id;
  for ( var i=0; i<this.list.length; i++ ) if ( this.list[i].id == value ) return i;
  return -1;
 }
 
 Get( index ) { return this.list[index]; }
 
 Count() { return this.list.length; }
 
 LastIndex() { return this.list.length-1; }
 First() { return this.list[0]; }  
 Last() {
  var index=this.LastIndex();
  if ( defined(this.list[index])) return this.list[index];
  return null;
 }
 
 Append( item ) {
  var wasMemberOf=item.wasMemberOf;
  var last=this.Last();
  if ( last ) {
   last.next=item;
   item.prev=last;
  } else {
   item.prev=null;
  }
  item.next=null;
  item.memberOf=this;
  this.list[this.Count()]=item;
  item.OnIndexed(wasMemberOf);
 }
 
 Prepend( item ) {
  this.Append(item);
  this.ToBack(item);  
 }
 
 Remove( id ) {
  if ( defined(id.isListItem) && id.isListItem ) id=id.id;
  var index=this.IndexByID(id);
  if ( index < 0 ) return false;
  var item=this.list[index];
  if (item.memberOf != this ) return false;
  this.list.splice(index, 1);
  item.wasMemberOf=this;
  item.memberOf=null;
  item.prev=null;
  item.next=null;
  this.Reindex();
  return item;
 }
 
 Pop() {
  var item=this.Last();
  return this.Remove(item);
 }
 
 InsertAt( item, index ) {
  this.Append(item);
  return this.IndexTo( item, index );  
 }
 
 InsertAfter( item, index ) {
  this.Append(item);
  return this.IndexTo( item, index+1 );
 }
 
 Forward( id ) {
  if ( defined(id.isListItem) && id.isListItem ) id=id.id;
  var index=this.IndexByID(id);
  if ( index < 0 || index == this.LastIndex() ) return false;
  return this.IndexTo(id,index);
 }
 
 Backward( id ) {
   if ( defined(id.isListItem) && id.isListItem ) id=id.id;
   var index=this.IndexByID(id);
   if ( index < 1 ) return false;
   return this.IndexTo(id,index-1);
 }
 
 ToBack( id ) { return this.IndexTo(id,0); }  
 ToFront( id ) { return this.IndexTo(id,this.LastIndex()); }
 
 IndexTo( id, to ) {
   if (to < 0 || to > this.LastIndex() ) return false;
   if ( defined(id.isListItem) && id.isListItem ) id=id.id;
   var index=this.IndexByID(id);
   if ( index < 0 ) return false;
   if ( index == to ) return true;
   this.list.splice(to, 0, this.list.splice(index, 1)[0]);
   this.Reindex();
   return true;   
 }
 
 Reindex() {
  for ( var j=0; j<this.list.length; j++ ) {
   this.list[j].prev=(j == 0 ? null : this.list[j-1]);
   this.list[j].next=(j == this.LastIndex() ? null : this.list[j+1]);
   this.list[j].OnReindex(j);
   this.list[j].index=j;
  }  
 }
 
 Sort(fun) {
  this.list.sort(fun);
 }
};
