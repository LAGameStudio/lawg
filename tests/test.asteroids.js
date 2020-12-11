'use strict';

class Asteroid extends Entity {
  constructor() {
    super();
    this.isAsteroid=true;
    this.Make(64);
    this.Between=function(list) {
     this.position=this.position.Add(this.velocity);
     while ( this.position.x < 0 ) this.position.x+=la.display.w;
     while ( this.position.y < 0 ) this.position.y+=la.display.h;
     if ( this.position.x > la.display.w ) this.position.x-=la.display.w;
     if ( this.position.y > la.display.h ) this.position.y-=la.display.h;
    };
    this.Render=function(list) {
     la.art.Bind(list.renderer.ctx);
     la.art.Fill("peru");
     la.art.Stroke("brown",3);
     la.art.FillLines(this.points,this.position.x,this.position.y);
    };
    this.Shatter=function(list){
      if ( list.Count() < 50 && this.radius > 30 ) for (var i=0; i<this.radius/30; i++ ) {
        var a=new Asteroid();
        a.Make(this.radius/3);
        a.position=this.position;
        list.Append(a);
      }
      list.Remove(this);
    };
  }
  Make( size ) {
    this.position=new Cartesian(0,0);
    this.velocity=new Cartesian(2.5-uniform()*5,2.5-uniform()*5);
    this.radius=uniform()*size + size;
    this.points=[];
    var rim=new Cartesian();
    rim.SetCircle(0,0,this.radius);
    var complexity=this.radius/10;
    if ( complexity < 3 ) complexity=3;
    for( var i=0; i<complexity; i++ ) {
      var time= i / (complexity);
      this.points[this.points.length] = rim.PointOnCircle(time,uniform()/10+0.9);
    }
  }
};

class Bullet extends Entity {
  constructor() {
    super();
    this.isBullet=true;
    this.lifespan=la.FPS() * 5;
    this.position=new Cartesian(0,0);
    this.velocity=new Cartesian(0,0);
    this.source=null;
    this.Between=function(list) {
     list.CheckCollisions(this);
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
    this.isPlayer=true;
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
    this.shooting=la.audio.Load({
     src: "tests/s/fire.wav",
     html5: true,
     volume: 1.0,
     loop: false
    });
    this.thrusting=la.audio.Load({
     src: "tests/s/thrust.wav",
     html5: true,
     volume: 0.0,
     loop: true
    });
    console.log(this.thrusting);
    this.Render=function(list) {
     la.art.Bind(list.renderer.ctx);
     la.art.Stroke("green",2);
     la.art.LinesRotated(this.angle,this.points,this.position.x,this.position.y);
     if ( this.velocity > 0 ) {
      var thrust=[];
      thrust[0]=new Cartesian(0,-15);
      thrust[1]=new Cartesian(5,-15-this.velocity/2);
      thrust[2]=new Cartesian(-5,-15-this.velocity/2);
      la.art.Stroke(randomele(["yellow","orange","red"]));
      la.art.LinesRotated(this.angle-180,thrust,this.position.x,this.position.y);
     }
    };
    this.Between=function(list) {
      list.CheckCollisions(this);
      if ( this.cooldown > 0 ) this.cooldown--;
      if ( this.cooldown <= 0 && la.input.keyboard.ctrl.isDown ) {
       var bullet=new Bullet();
       this.shooting.play();
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
      if ( this.velocity > 0 && !this.thrusting.playing() ) {
        console.log("Playing thrust sound...");
        this.thrusting.play();
      }
      this.thrusting.volume(this.velocity/10 * 0.5);
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
  if ( defined(against.isPlayer) ) {
   for ( var i=0; i<this.list.length; i++ ) {
     if ( this.list[i] == against ) continue;
     if ( defined(this.list[i].isAsteroid) ) {
      if ( Math.getDistance( against.position.x, against.position.y, this.list[i].position.x, this.list[i].position.y )
          < this.list[i].radius * 0.9 ) { // Player crashes into asteroid
        console.log("Player hit asteroid!  Game over!");
      }
     }    
   }
   return;
  }
  if ( !defined(against.isBullet) ) return;
  for ( var i=0; i<this.list.length; i++ ) {
    if ( this.list[i] == against ) continue;
    if ( defined(this.list[i].isAsteroid) ) {
     if ( Math.getDistance( against.position.x, against.position.y, this.list[i].position.x, this.list[i].position.y )
         < this.list[i].radius ) { // Bullet hits asteroid
      if ( this.list[i].radius > 64 ) la.audio.Play("tests/s/bangMedium.wav");
      else la.audio.Play("tests/s/bangSmall.wav");
      this.list[i].Shatter(this);
      this.Remove(against);
      return;
     }
    }
  }
};

$(document).ready(function(e){
  la.audio.SetMasterVolume(0.5);
  var renderer=la.renderers.Get(la.renderers.Add("sprites"));
  renderer.background="black";
  entities.Bind(renderer);
  entities.Append(new Player());
  var nearby=new Cartesian();
  nearby.SetCircle(la.display.w/2,la.display.h/2,la.display.h/4);
  for ( var i=0; i<5; i++ ) {
    var a=new Asteroid();
    a.position=nearby.PointOnCircle(uniform());
    entities.Append(a);
  }
  renderer.entities=entities;
  renderer.Frame=function(renderer,list) {
   renderer.Clear();
   // update positions
   renderer.entities.Between();
   // draw everything
   renderer.entities.Render();
  };
});

