class LADisplay {
  constructor() {
    this.screenfull=screenfull;
    $(document).ready(function(){
     la.display.Setup();  
    });
  }
  
  ResizeTo( w, h ) {
//    console.log("display.ResizeTo("+w+","+h+")");
    document.body.style.width=w+"px";
    document.body.style.height=h+"px";
    document.body.width=w;
    document.body.height=h;
    document.body.style.overflow="none";
    if ( defined(this.outer) && this.outer ) {
     this.outer.style.width=w+"px";
     this.outer.style.height=h+"px";
     this.outer.width=w;
     this.outer.height=h;
    }
    la.display.w=w;
    la.display.h=h;
    if ( defined(la.renderers) ) la.renderers.ResizeTo(w,h);
  }
  
  Resized() {
    la.display.ResizeTo(window.innerWidth,window.innerHeight);
  }
  
  Setup() {
    this.Resized();
    window.onresize = la.display.Resized;
    var screen=document.createElement("div");
    screen.id="outer-container";
    screen.style.width="100%";
    screen.style.height="100%";
    screen.style.padding="0";
    screen.style.margin="0";
    screen.style.background="orange";
    screen.style.overflow="none";
    this.outer=screen;
    document.body.appendChild(screen);
    this.outer=Get("outer-container");
  }
};

la.display = new LADisplay();
