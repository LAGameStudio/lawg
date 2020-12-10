class LARenderer extends ListItem {
  constructor() {
    super();
    this.element=null;
    this.ctx=null;
    this.gl=null;
    this.id=-1;
    this.index=-1;
    this.type=-1;
    this.three=null;
    this.background="clear";
    this.twglFrameFunction=function(time){};
    this.twglRenderFunction=function(time){
     twgl.resizeCanvasToDisplaySize(this.gl.canvas);
     this.gl.viewport(0, 0, this.gl.canvas.width, this.gl.canvas.height);
     this.twglFrameFunction(time);    
     requestAnimationFrame(render);
    };
    this.Frame=function(renderer,list){};
    this.Clear=function(){}; // Clear background function.
  }
  
  ResizeTo( w, h ) {
//    console.log("la.renderers.["+this.element.id+"].ResizeTo("+w+","+h+")");
    var oldw=this.w;
    var oldh=this.h;
    this.w=w;
    this.h=h;
    if ( this.element ) {
     this.element.style.width=la.display.w+"px";
     this.element.style.height=la.display.h+"px";
     this.element.width=la.display.w;
     this.element.height=la.display.h;      
    }
    this.OnResize(oldw,oldh);
  }
  
  OnResize( oldw, oldh ) {
    
  }
  
  Background( value ) {
    this.background=value;
  }
  
  Dispose() {
   $(this.element).remove();
  }
};


class LARenderers extends LinkedList {
  
  constructor() {
   super();
   this.HTML5 = 0;
   this.HTMLOverlay = 1;
   this.THREEjs = 2;
   this.TWGL = 3;
//   this.PIXI = 4;
//   this.CREATEjs = 5;
//   this.WEBGL = 6;
   this.list=[];
   this.unique_id=0;
  }
  
  Add(name=null,stage_type=0) {
    if ( name == null ) name="Stage "+this.list.length+1;
    var renderer=new LARenderer();
    renderer.id=this.unique_id;
    this.unique_id++;
    renderer.index=this.list.length;
    switch ( stage_type ) {
      case this.HTML5: // Installs a standard HTML5 canvas
        var element=document.createElement("canvas");
        element.id="la-render-"+renderer.id;
        element.style.width=la.display.w+"px";
        element.style.height=la.display.h+"px";
        element.width=la.display.w;
        element.height=la.display.h;
        element.style.padding="0";
        element.style.margin="0";
        element.style.overflow="none";
        element.zIndex=renderer.index*10;
        element.position="static";
        la.display.outer.appendChild(element);
        renderer.element=element;
        renderer.ctx=element.getContext("2d");
        // Clear canvas
        renderer.Clear=function() {
          this.ctx.clearRect(0, 0,la.display.w, la.display.h);
          this.ctx.rect(0, 0, la.display.w, la.display.h);
          this.ctx.fillStyle = this.background;
          this.ctx.fill();
        }
        // Per-frame call (customizable)
        renderer.Frame=function(renderer,list) { renderer.Clear(); };
        console.log(element);
       break;
      case this.HTMLOverlay:  // Adds an HTML Overlay
       break;
      case this.THREEjs: // Uses ThreeJS to add a canvas
        var element=document.createElement("div");
        element.id="la-render-"+renderer.id;
        element.style.width=la.display.w+"px";
        element.style.height=la.display.h+"px";
        element.width=la.display.w;
        element.height=la.display.h;
        element.style.padding="0";
        element.style.margin="0";
        element.style.overflow="none";
        element.zIndex=renderer.index*10;
        element.position="static";
        la.display.outer.appendChild(element);
        renderer.element=element;
        var three = new THREE.WebGLRenderer( { alpha: true } );
        three.setClearColor( 0x000000, 0 );
        renderer.three=three;
        renderer.element.appendChild(three);
        console.log(element);
       break;
      case this.TWGL:
        var element=document.createElement("canvas");
        element.id="la-render-"+renderer.id;
        element.style.width=la.display.w+"px";
        element.style.height=la.display.h+"px";
        element.width=la.display.w;
        element.height=la.display.h;
        element.style.padding="0";
        element.style.margin="0";
        element.style.overflow="none";
        element.zIndex=renderer.index*10;
        element.position="static";
        renderer.gl=element.getContext("webgl");
        la.display.outer.appendChild(element);
        renderer.element=element;
        renderer.ctx=element.getContext("2d");
        console.log(element);
       break;
    }
    this.Append(renderer);
    return renderer.id;
  }
  
  Get( id ) {
    if ( id instanceof LARenderer ) return id;    
    for ( var i=0; i<this.list.length; i++ ) {
     if ( id == this.list[i].id ) return this.list[i];
    }
    return null;
  }
  
  Drop( id ) {
    if ( id instanceof LARenderer ) id=id.id;
    var list=[];
    var j=0;
    for ( var i=0; i<this.list.length; i++ ) {
     if ( id != this.list[i].id ) {
      list[j]=this.list[i];
      this.list[j].OnReindex(j);
     } else {
      this.list[i].Dispose();
     }
    }
    this.list=list;
  }
  
  ResizeTo( w, h ) {
//    console.log("la.renderers.ResizeTo("+w+","+h+")");
//    console.log(this.list);
    for ( var i=0; i<this.list.length; i++ ) this.list[i].ResizeTo(w,h);
  }
  
  Frame() {
    for ( var i=0; i<this.list.length; i++ ) this.list[i].Frame(this.list[i],this.list); 
  }
  
};


la.renderers = new LARenderers();