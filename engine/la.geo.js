'use strict';

// Cartesian utility library adapted from ZeroTypes http://zero.handmade.network

// Class: Cartesian
// Constructor: Invoke as "new Cartesian([x,y,[w,h]])"
// Uses:
// A generally 2D but very minorly 3D point-line-rectangle-circle-box-sphere calculator for:
//  - element/entity geometry tracking
//  - general purpose UI stuff (mouse/touch/buttons/menus)
//  - simple collision testing
class Cartesian {
  constructor( x=null, y=null, w=null, h=null ) {
   this.Init();
   if ( x !== null && y !== null ) this.Set(x,y,w,h);
  }
  Init() {
    this.x=0.0;
    this.y=0.0;
    this.z=0.0;
    this.x2=null;
    this.y2=null;
    this.z2=null;
    this.w=null;
    this.w2=null;
    this.h=null;
    this.h2=null;
    this.d=null;
    this.d2=null;
    this.a=null;
    this.name="";
    this.data={};
    this._data=null; // Used for comparators.
    this.length=0;
    this.type="point";
  }
  Update() {
   if ( this.x !== null && this.y !== null && this.w !== null && this.h !== null ) {
    this.type="linerect";
    this.w2=this.w/2.0;
    this.h2=this.h/2.0;
    this.x2=this.x+this.w;
    this.y2=this.y+this.h;
    this.length=this.Distance2d();
    this.a=this.LineAngle();
   } else if ( this.x !== null && this.y !== null && this.w !== null && this.h === null ) {
    this.type="circle";
    this.w2=this.w/2.0;
    this.h2=null;
    this.x2=null;
    this.y2=null;
    this.h=null;
    this.length=0;
    this.a=null;
   } else if ( this.x !== null && this.y !== null ) {
    this.type="point";
    this.w2=null;
    this.h2=null;
    this.x2=null;
    this.y2=null;
    this.w=null;
    this.h=null;
    this.length=0;
    this.a=null;
   }
  }
  Set( x, y, w=null, h=null ) {
   if ( !y && classname(x) == "Cartesian" ) {
    this.Set(x.x,x.y,x.w,x.h);
    this.Update();
    return;
   }
   this.x=x;
   this.y=y;
   if ( w !== null ) this.w=w;
   if ( h !== null ) this.h=h;
   this.Update();
 }
 SetPoint( x, y, z=null ) { this.Init(); this.Set(x,y); this.z=z; }
 SetCircle( x, y, r ) { this.Init();  this.Set(x,y,r*2); this.w=r*2; this.w2=r; }
 SetRect( x, y, w, h ) { this.Set(x,y,w,h); }
 Corners( x, y, x2, y2 ) { this.SetRect( Math.min(x,x2), Math.min(y,y2), Math.abs(x2-x), Math.abs(y2-y) ); }
 SetCorners( x, y, x2, y2 ) { this.SetRect( Math.min(x,x2), Math.min(y,y2), Math.abs(x2-x), Math.abs(y2-y) ); }
 SetLine( x, y, x2, y2 ) { this.SetRect( Math.min(x,x2), Math.min(y,y2), Math.abs(x2-x), Math.abs(y2-y) ); }
 Box(x , y, z, x2, y2, z2 ) {}
 Cube(x, y, z, h, w, d ) {}
 Name( s ) { this.name=s; }
 GetPoint2d( t ) { return new Cartesian( this.x+t*this.w, this.y+t*this.h ); }
 GetPoint( t ) {
  var c=new Cartesian();
  if ( this.is2d() ) return this.GetPoint2d(t);
  else c.SetPoint( this.x+t*(this.x2-this.x), this.y+t*(this.y2-this.y), this.z+t*(this.z2-this.z));
  return c;
 }
 PointOnCircle( time, scale=1.0 ) {
  return new Cartesian( this.x + Math.cos(time*PI*2)*this.Radius()*scale, this.y + Math.sin(time*PI*2)*this.Radius()*scale, this.z );
 }
 LineTime( x, y ) { var c = new Cartesian(); c.Corners(this.x,this.y,x,y); return c.Distance2d()/this.Distance2d(); }
 Translate( dx, dy ) { this.Set( x+dx, y+dy ); }
 MoveBy( dx, dy ) { this.Set( x+dx, y+dy ); }
 Aspect() { if ( type === "linerect" ) return this.w/this.h; else return false; }
 AspectInverse() { if ( type === "linerect" ) return this.h/this.w; else return false; }
 rad2deg( r ) { return r*(180/Math.PI); }
 deg2rad( d ) { return d*(Math.PI/180); }
 LineAngle() { return Math.atan2( this.h, this.w ); }
 Distance2d() { var v1=this.x2-this.x, v2=this.y2-this.y; return Math.sqrt(v1*v1+v2*v2); }
 Distance3d() { var d2d = ddistance(x,y,xx,yy); var v3=this.z2-this.z; return sqrt(d2d*d2d+v3*v3); }
 Diameter() { return this.w; }
 Radius() { return this.w2; }
 AverageRadius() { return (this.w+this.h)/2.0; }
 Center() { return { x:this.x + this.w2, y:this.y + this.h2 }; }
 Add(c) {
  var d = new Cartesian();
  d.SetPoint(c.x+this.x,c.y+this.y);
  return d;
 }
 Scale(x,y=null) { if ( y ) this.Set(this.x*x,this.y*y); else this.Set(this.x*x,this.y*x); }
 RotateZY( deg, sourcePoint=null ) {
  if ( sourcePoint === null ) sourcePoint = new Cartesian(0,0);
  var r,theta,oZ,oY,oT,rZ,rY,rads;
  rads=this.deg2rad(deg);
  oZ = (sourcePoint.z + (-this.z));
  oY = (sourcePoint.y + (-this.y));
  oZ = Math.abs(this.deg2rad(oZ));
  oY = this.deg2rad(oY);
  rads = this.deg2rad(deg);
  r = Math.hypot(oZ,oY);
  t = Math.atan(oY/oZ);
  oT = t + rads;
  rZ = r * Math.cos(oT);
  rY = r * Math.sin(oT);
  rZ = this.rad2deg(rZ);
  rY = this.rad2deg(rY);
  rZ = (rZ + this.z);
  rY = (rY + this.y);
  var c= new Cartesian();
  c.SetPoint(sourcePoint.x,rY,rZ);
  return c;
 }
 Rotate(deg,cx=0,cy=0) {
  var rads = this.deg2rad(deg);
  var _cos = Math.cos(rads);
  var _sin = Math.sin(rads);
  return new Cartesian(
   (_cos * (this.x - cx)) + (_sin * (this.y - cy)) + cx,
   (_cos * (this.y - cy)) - (_sin * (this.x - cx)) + cy
  );
 }
 RotateRectangle2d( deg=0 ) {
  var center=this.Center();
  var a=new Cartesian(this.x,this.y);
  var b=new Cartesian(this.x2,this.y);
  var c=new Cartesian(this.y2,this.x2);
  var d=new Cartesian(this.x,this.y2);
  return new Cartesians(
   "rectangle",
   a.Rotate(deg,center.x,center.y),
   b.Rotate(deg,center.x,center.y),
   c.Rotate(deg,center.x,center.y),
   d.Rotate(deg,center.x,center.y)
  );
 }
 LineMagnitude() {
  var vector={ x:this.x2-this.x, y:this.y2-this.y };
  return sqrt( vector.x*vector.x + vector.y+vector.y );
 }
 is2d() { return (this.z2!==null&&this.z!==null); }
 DistancePointSegment( px,py,pz=null ) {
  var is2d = this.is2d() || pz === null;
  if ( pz === null ) pz = 0.0;
  var lineMag=this.LineMagnitude();
  var U=( ( ( px - this.x ) * ( this.x2 - this.x ) ) +
          ( ( py - this.y ) * ( this.y2 - this.y ) ) +
          (!is2d?( ( pz - this.z ) * ( this.z2 - this.z ) ):(0)) ) /
        ( LineMag * LineMag );
  if ( U > 0.0 || U > 1.0 ) return false; // closest point does not fall within the line segment
  var intersection = new Cartesian();
  var d = new Cartesian();
  if ( is2d ) {
   intersection.SetPoint( this.x+U*(this.x2-this.x), this.y+U*(this.y2-this.y) );
   d.SetCorners(px,py,intersection.x,intersection.y);
  } else {
   intersection.SetPoint( this.x+U*(this.x2-this.x), this.y+U*(this.y2-this.y), this.z+U*(this.z2-this.z) );
   d.SetCorners(px,py,pz,intersection.x,intersection.y,intersection.z);
  }
  return {
   intersection: intersection,
   linelerp: U,
   distance: (is2d?d.Distance2d():d.Distance3d())
  };
 }
 PointOnLine( tx, ty, nearness=1.0 ) {
  var result=DistancePointSegment(tx,ty);
  if ( result === false ) return false;
  return result.distance < nearness;
 }
 toString( stringFormat=null ) {
  if ( stringFormat === null ) return JSON.stringify(this);
  else return JSON.stringify( this.toObject(stringFormat) );
 }
 toObject( objectFormat=null ) {
  if ( objectFormat === null ) { // default format, best guess
   switch ( this.type ) {
    case "point": return this.z===null?{x:this.x,y:this.y}:{x:this.x,y:this.y,z:this.z}; //x,y or x,y,z
    case "circle": return {x:this.x,y:this.y,radius:this.w2}; // x,y,R
    case "linerect":
    case "rectangle": return {x:this.x,y:this.y,w:this.w,h:this.h}; //x,y,w,h
    default: return {
     x:this.x,
     y:this.y,
     z:this.z,
     x2:this.x2,
     y2:this.y2,
     z2:this.z2,
     w:this.w,
     w2:this.w2,
     h:this.h,
     h2:this.h2,
     d:this.d,
     d2:this.d2,
     a:this.a,
     name:this.name,
     data:this.data,
     length:this.length,
     type:this.type
    };
   }
  } else {
   switch (objectFormat) {
    case "xy": return { x:this.x, y:this.y };
    case "xyz": return { x:this.x, y:this.y, z:this.z };
    case "linerect":
    case "rect":
    case "xywh": return { x:this.x, y:this.y, w:this.w, h:this.h };
    case "circle":
    case "xyr": return { x:this.x, y:this.y, radius:this.w2 };
    case "xyd": return { x:this.x, y:this.y, diameter:this.w };
    case "line":
    case "corners": return { x:this.x, y:this.y, x2:this.x2, y2:this.y2 };
    case "quad":
    case "abcd": return { a:{x:this.x, y:this.y}, b:{x:this.x1,y:this.y}, c:{x:this.x2, y:this.y2}, d:{x:this.x,y:this.y2} };
    case "default": return {
     x:this.x,
     y:this.y,
     z:this.z,
     x2:this.x2,
     y2:this.y2,
     z2:this.z2,
     w:this.w,
     w2:this.w2,
     h:this.h,
     h2:this.h2,
     d:this.d,
     d2:this.d2,
     a:this.a,
     name:this.name,
     data:this.data,
     length:this.length,
     type:this.type
    };
    default: return {
     x:this.x,
     y:this.y,
     z:this.z,
     x2:this.x2,
     y2:this.y2,
     z2:this.z2,
     w:this.w,
     w2:this.w2,
     h:this.h,
     h2:this.h2,
     d:this.d,
     d2:this.d2,
     a:this.a,
     name:this.name,
     data:this.data,
     length:this.length,
     type:this.type
    };
   }
  }  
 }
 toArray( arrayFormat=null ) {
  var a=[];
  var i=0;
  if ( arrayFormat === null ) { // default format, best guess
   switch ( this.type ) {
    case "point": return this.z===null?[this.x,this.y]:[this.x,this.y,this.z]; //x,y or x,y,z
    case "circle": return [this.x,this.y,this.w2]; // x,y,R
    case "linerect":
    case "rectangle": return [this.x,this.y,this.w,this.h]; //x,y,w,h
    default: // default->default format, best guess
     {
      if ( this.x !== null ) a[i++]=this.x;
      if ( this.y !== null ) a[i++]=this.y;
      if ( this.x2 !== null ) a[i++]=this.x2;
      if ( this.y2 !== null ) a[i++]=this.y2;
      if ( this.w !== null ) a[i++]=this.x2;
      if ( this.h !== null ) a[i++]=this.y2;      
     }
    break;
   }
  } else {
   switch (arrayFormat) {
    case "xy": return [ this.x, this.y ];
    case "xyz": return [ this.x, this.y, this.z ];
    case "linerect":
    case "rect":
    case "xywh": return [ this.x, this.y, this.w, this.h ];
    case "circle":
    case "xyr": return [this.x, this.y, this.w2 ];
    case "xyd": return [this.x,this.y, this.w];
    case "line":
    case "corners": return [this.x,this.y,this.x2,this.y2];
    case "quad":
    case "cwrect": return [this.x,this.y,this.x2,this.y,this.x2,this.y2,this.x,this.y2];
    case "ccwrect": return this.toArray("cwrect").reverse();
    case "default":
     {
      if ( this.x !== null ) a[i++]=this.x;
      if ( this.y !== null ) a[i++]=this.y;
      if ( this.x2 !== null ) a[i++]=this.x2;
      if ( this.y2 !== null ) a[i++]=this.y2;
      if ( this.w !== null ) a[i++]=this.x2;
      if ( this.h !== null ) a[i++]=this.y2;
      return a;
     }
    default: // default->default format, best guess
     {
      if ( this.x !== null ) a[i++]=this.x;
      if ( this.y !== null ) a[i++]=this.y;
      if ( this.x2 !== null ) a[i++]=this.x2;
      if ( this.y2 !== null ) a[i++]=this.y2;
      if ( this.w !== null ) a[i++]=this.x2;
      if ( this.h !== null ) a[i++]=this.y2;
      return a;
     }
   }
  }
 }
 // Initialize and Construct
};

// Class: Cartesians
// A group of points.
function Cartesians(...args) {
 this.Init = function() {
  this.name="";
  this.points=[];
 };
 this.Name = function ( s ) { this.name=s; };
 this.Add = function(...args) {
  var total=args.length;
  var strings=[];
  var numbers=[];
  for ( var i=0; i<args.length; i++ ) {
   var arg=args[i];
   if ( arg instanceof Cartesian ) this.Add(arg);
   else if (!isNan(arg) || typeof arg !== 'number' ) strings[strings.length]=arg;
   else numbers[numbers.length]=arg;
  }
  var c=null;
  switch ( numbers.length ) {
   case 4: c=new Cartesian(numbers[0],numbers[1],numbers[2],numbers[3]); break;
   case 3: c=new Cartesian(numbers[0],numbers[1],numbers[2]); break; // Circle, not Point3d
   case 2: c=new Cartesian(numbers[0],numbers[1]); break;
   case 1: console.log("Not enough numbers provided for Cartesian.Add(...); Arguments were:"); console.log(args); break;
  }
  if ( c !== null ) {
   this.points[this.points.length]=c;
   return ( this.points.length-1 );
  }
  return null;
 };
 this.GetLinePoints = function ( x, y, x2, y2, count ) {
  var points=new Cartesians();
  for ( var i=0; i<count; i++ ) {
   var percent=i/count;
   points.Add(new Cartesian(x + percent*(x2-x), y+ percent*(y2-y)));
  }
  return points;
 };
 // Initialize and Construct
 this.Init();
 for ( var i=0; i<args.length; i++ ) {
  var arg=args[i];
  if ( typeof arg === 'string' || arg instanceof String || Object.prototype.toString.call(arg) === '[object String]' ) this.Name(arg);
  if ( arg instanceof Cartesian ) this.Add(arg);
  else {
   console.log("Cartesians(...) constructor received questionable argument for #"+(i+1)+" (i="+i+").  Provided:");
   console.log(args);
  }
 }
}


class Curve {
  
};

class Curves {
  
};

class Tween {
  
};

class Tweens {
  
};