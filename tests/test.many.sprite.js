
class MyEntity extends Entity {
  constructor() {
    super();
    this.ofsx=(uniform()*1024-512);
    this.ofsy=(uniform()*1024-512);
    this.angle=uniform()*360;
    this.scale=(uniform()+0.1) * 0.1;
    this.image=la.art.library.Load("i/Pacman.png");
    this.Render=function(list) {
     la.art.Bind(list.renderer.ctx);
     la.art.CenteredScaled(this.image,this.ofsx+la.input.mx,this.ofsy+la.input.my,this.scale);
    };
  }
};


var entities= new Entities();

$(document).ready(function(e){
  var renderer=la.renderers.Get(la.renderers.Add("sprites"));
  renderer.background="black";
  entities.Bind(renderer);
  for ( var e=0; e<1000; e++ ) entities.Append(new MyEntity());
  entities.Sort( (a,b)=> (a.scale < b.scale) ? 1 : -1 );
  renderer.entities=entities;
  renderer.Frame=function(renderer,list) {
   renderer.Clear();  
   // draw everything
   if (renderer.entities) renderer.entities.Render();
  }
});

