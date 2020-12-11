
class Bullet extends Entity {
  constructor() {
    super();
    this.lifespan=la.FPS() * 5;
    this.position=new Cartesian(0,0);
    this.velocity=new Cartesian(0,0);
    this.source=null;
    this.Between=function(list) {
     this.lifespan--;
     this.position=this.position.Add(this.velocity);
     if ( this.lifespan <= 0 ) list.Remove(this);
    };
    this.Render=function(list) {
     la.art.Bind(list.renderer.ctx);
     la.art.Stroke("red",2);
     la.art.Rectangle(this.position.x-1,this.position.y-1,1,1);
    };
  }
};

class Player extends Entity {
  constructor() {
    super();
    this.points=[];
    this.points[0]=new Cartesian(0,0);
    this.points[1]=new Cartesian(5,15);
    this.points[2]=new Cartesian(-5,15);
    this.position=new Cartesian(la.display.w/2,la.display.h/2);
    this.angle=0.0;
    this.velocity=0.0;
    this.jarred=0.0;
    this.health=10;
    this.lives=3;
    this.cooldown=0;
    this.score=0;
    this.Render=function(list) {
     la.art.Bind(list.renderer.ctx);
     la.art.Stroke("green",2);
     la.art.LinesRotated(this.angle,this.points,this.position.x,this.position.y);
    };
    this.Between=function(list) {
      list.CheckCollisions(this);
      if ( this.cooldown > 0 ) this.cooldown--;
      if ( this.cooldown <= 0 && la.input.keyboard.ctrl.isDown ) {
       la.audio.Play("tests/s/fire.wav");
       var bullet=new Bullet();
       bullet.position.Set(this.position);
       var fired=new Cartesian(0,-(10+this.velocity));
       fired=fired.Rotate(this.angle);
       bullet.velocity.Set(fired);
       bullet.source=this;
       list.Append(bullet);
       this.cooldown=la.FPS() * 0.1;
      }
      if ( la.input.keyboard.left.isDown || la.input.keyboard.A.isDown ) this.angle+=3.6;
      if ( la.input.keyboard.right.isDown || la.input.keyboard.D.isDown ) this.angle-=3.6;
      if ( la.input.keyboard.up.isDown || la.input.keyboard.W.isDown ) { if ( this.velocity < 10 ) this.velocity+=0.1; }
      else if ( this.velocity > 0 ) this.velocity-=1;
      else this.velocity=0;
      var momentum=new Cartesian(0,-this.velocity);
      momentum=momentum.Rotate(this.angle);
      this.position=this.position.Add(momentum);
      if ( this.jarred > 0.001 ) this.jarred *= 0.5;
      else this.jarred=0;
      if ( this.jarred > 0 ) {
       momentum=new Cartesian(0,this.jarred);
       momentum=momentum.Rotate(uniform()*360);
       this.position=this.position.Add(momentum);
      }
      while ( this.position.x < 0 ) this.position.x+=la.display.w;
      while ( this.position.y < 0 ) this.position.y+=la.display.h;
      if ( this.position.x > la.display.w ) this.position.x-=la.display.w;
      if ( this.position.y > la.display.h ) this.position.y-=la.display.h;
    };
  }
};


var entities= new Entities();

entities.CheckCollisions=function(against) {
  for ( var i=0; i<this.list.length; i++ ) {
    if ( this.list[i] == against ) continue;
  }
};

$(document).ready(function(e){
  var renderer=la.renderers.Get(la.renderers.Add("sprites"));
  renderer.background="black";
  entities.Bind(renderer);
  entities.Append(new Player());
  renderer.entities=entities;
  renderer.Frame=function(renderer,list) {
   renderer.Clear();
   // update positions
   renderer.entities.Between();
   // draw everything
   renderer.entities.Render();
  };
});

