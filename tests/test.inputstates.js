var mouseRect=new Cartesian();
var corner=0;

class MyEntity extends Entity {
  constructor() {
    super();
    this.Render=function(list) {
      la.art.Bind(list.renderer.ctx);
      //var str = JSON.stringify(la.input, null, 2); // spacing level = 2
      var content = "";
      content+="Keyboard: ";
      for (var i=0; i<la.input.keyboard.bindings.length; i++) {
        var key=la.input.keyboard.bindings[i];
        //console.log(key);
        if ( defined(key.code) ) {
          if ( key.isDown ) content+=key.name+" ("+la.input.keyboard.getDown(key)+") ";
        }
      }
      content +="\n";
      content +="Mouse: ";
      if ( la.input.left ) content+="LEFT ";
      if ( la.input.middle ) content+="MIDDLE ";
      if ( la.input.right ) content+="RIGHT ";
      content += "\n      ";
      content += la.input.mx+","+la.input.my;
      content += "\n      ";
      content += la.input.mxd+","+la.input.myd;
      content += "\n      ";
      content += int(la.input.mxd*100)+"%,"+int(la.input.myd*100)+"%";
      content += "\nDisplay: "+JSON.stringify(la.display,null,2);
      la.art.MultilineText(content,16,16,"cornflowerBlue", "'Lucida Console', monospace", 16);
      la.art.Stroke("darkGreen");
      la.art.Line(la.input.mx,0,la.input.mx,la.display.h);
      la.art.Stroke("darkRed");
      la.art.Line(0,la.input.my,la.display.w,la.input.my);
      la.art.Stroke("purple");
      la.art.Rectangle(mouseRect);
    }
  }
};


var entities= new Entities();

$(document).ready(function(e){ 
  var renderer=la.renderers.Get(la.renderers.Add("sprites"));
  renderer.background="white";
  entities.Bind(renderer);
  entities.Append(new MyEntity());
  renderer.entities=entities;
  renderer.Frame=function(renderer,list) {
   renderer.Clear();  
   // draw everything
   if (renderer.entities) renderer.entities.Render();
  }
  
  $(document).click(function(){
    console.log("clicked");
    corner++;
    switch ( corner % 2 ) {
      case 0: mouseRect.Corners(mouseRect.x,mouseRect.y,la.input.mx,la.input.my);
      case 1: mouseRect.Corners(la.input.mx,la.input.my,mouseRect.x2,mouseRect.y2);
    }
    console.log(mouseRect.toString());
  });
});

