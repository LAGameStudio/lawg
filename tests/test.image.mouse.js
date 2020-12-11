
class MyEntity extends Entity {
  constructor() {
    super();
    this.image=la.art.library.Load("tests/i/Pacman.png");
    this.Render=function(list) {
     la.art.Bind(list.renderer.ctx);
     la.art.Draw(this.image,la.input.mx,la.input.my);
    }
  }
};


var entities= new Entities();

$(document).ready(function(e){
  var renderer=la.renderers.Get(la.renderers.Add("sprites"));
  renderer.background="black";
  entities.Bind(renderer);
  entities.Append(new MyEntity());
  renderer.entities=entities;
  renderer.Frame=function(renderer,list) {
   renderer.Clear();  
   // draw everything
   if (renderer.entities) renderer.entities.Render();
  }
});

