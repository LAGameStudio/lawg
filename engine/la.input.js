// Keyboard Events
class KeyboardInput {
 constructor() {
  this.Reset();
 }
 keyboard(keyCode) {
   var key = {};
   key.code = keyCode;
   key.isDown = false;
   key.isUp = true;
   key.press = undefined;
   key.release = undefined;
   //The `downHandler`
   key.downHandler = function(event) {
     if (event.keyCode === key.code) {
       if (key.isUp && key.press) key.press();
       key.isDown = true;
       key.isUp = false;
       console.log(key);
     }
     event.preventDefault();
   };
   //The `upHandler`
   key.upHandler = function(event) {
     if (event.keyCode === key.code) {
       if (key.isDown && key.release) key.release();
       key.isDown = false;
       key.isUp = true;
       console.log(key);
     }
     event.preventDefault();
   };
   //Attach event listeners
   window.addEventListener(    "keydown", key.downHandler.bind(key), false  );
   window.addEventListener(    "keyup", key.upHandler.bind(key), false  );
   return key;
 }
 Reset() {
   this.ignoring=false;
   this.bksp=this.keyboard(8);
   this.enter=this.keyboard(10);
   this.esc=this.keyboard(27);
   this.space=this.keyboard(32);
   this.left=this.keyboard(37);
   this.up=this.keyboard(38);
   this.down=this.keyboard(40);
   this.right=this.keyboard(39);
   this.multiply=this.keyboard(42);
   this.add=this.keyboard(43);
   this.comma=this.keyboard(44);
   this.minus=this.keyboard(45);
   this.period=this.keyboard(46);
   this.slash=this.keyboard(47);
   this.n0=this.keyboard(48);
   this.n1=this.keyboard(49);
   this.n2=this.keyboard(50);
   this.n3=this.keyboard(51);
   this.n4=this.keyboard(52);
   this.n5=this.keyboard(53);
   this.n6=this.keyboard(54);
   this.n7=this.keyboard(55);
   this.n8=this.keyboard(56);
   this.n9=this.keyboard(57);
   this.colon=this.keyboard(59);
   this.equals=this.keyboard(61);
   /*
   this.A=this.keyboard(65); this.N=this.keyboard(78);
   this.B=this.keyboard(66); this.O=this.keyboard(79);
   this.C=this.keyboard(67); this.P=this.keyboard(80);
   this.D=this.keyboard(68); this.Q=this.keyboard(81);
   this.E=this.keyboard(69); this.R=this.keyboard(82);
   this.F=this.keyboard(70); this.S=this.keyboard(83);
   this.G=this.keyboard(71); this.T=this.keyboard(84);
   this.H=this.keyboard(72); this.U=this.keyboard(85);
   this.I=this.keyboard(73); this.V=this.keyboard(86);
   this.J=this.keyboard(74); this.W=this.keyboard(87);
   this.K=this.keyboard(75); this.X=this.keyboard(88);
   this.L=this.keyboard(76); this.Y=this.keyboard(89);
   this.M=this.keyboard(77); this.Z=this.keyboard(90);
   */
   this.lbracket=this.keyboard(91);
   this.backslash=this.keyboard(92);
   this.rbracket=this.keyboard(93);
   this.apostrophe=this.keyboard(94);
   this.backtick=this.keyboard(96);
   /*
   this.a=this.keyboard(97);  this.n=this.keyboard(110);
   this.b=this.keyboard(98);  this.o=this.keyboard(111);
   this.c=this.keyboard(99);  this.p=this.keyboard(112);
   this.d=this.keyboard(100); this.q=this.keyboard(113);
   this.e=this.keyboard(101); this.r=this.keyboard(114);
   this.f=this.keyboard(102); this.s=this.keyboard(115);
   this.g=this.keyboard(103); this.t=this.keyboard(116);
   this.h=this.keyboard(104); this.u=this.keyboard(117);
   this.i=this.keyboard(105); this.v=this.keyboard(118);
   this.j=this.keyboard(106); this.w=this.keyboard(119);
   this.k=this.keyboard(107); this.x=this.keyboard(120);
   this.l=this.keyboard(108); this.y=this.keyboard(121);
   this.m=this.keyboard(109); this.z=this.keyboard(122);  
   */
   this.del=this.keyboard(127);
 }
};

class LAInput {
  constructor() {
    la.config.gameControl=gameControl;
    this.gamepad=[];
    this.InitGamepads();
    this.beforeGamepadsCycleFunction = function(){};
    this.afterGamepadsCycleFunction = function(){};
    this.InitTouch();
    this.ResetKeyboard();
    this.ResetEvents();
    this.mx=-1;
    this.my=-1;
    this.mxd=-1;
    this.myd=-1;
  }
  
  UpdateMouse( mx, my, w, h ) {
    this.mx=mx;
    this.my=my;
    this.mxd=mx/w;
    this.myd=my/h;
  }
  
  InitTouch() {
   window.addEventListener('tap', function(e){ la.input.TouchTap(e); });
   window.addEventListener('dbltap', function(e){ la.input.TouchDoubleTap(e); });
   window.addEventListener('longtap', function(e){ la.input.TouchLongTap(e); });
   window.addEventListener('swipeleft', function(e){ la.input.TouchLeft(e); });
   window.addEventListener('swiperight', function(e){la.input.TouchRight(e); });
   window.addEventListener('swipeup', function(e){la.input.TouchUp(e); });
   window.addEventListener('swipedown', function(e){la.input.TouchDown(e); });
   // Turn off default events
   window.addEventListener('touchmove',function(e){e.preventDefault();});
   window.addEventListener('touchstart',function(e){e.preventDefault();});
   window.addEventListener('touchend',function(e){e.preventDefault();});
  }
  
  InitGamepads() {
   gameControl.on('beforeCycle', () => { la.input.beforeGamepadsCycleFunction(); } );
   gameControl.on('afterCycle', () => { la.input.afterGamepadsCycleFunction(); } );
   gameControl.on('connect', gamepad => {
    if ( !defined(this.gamepad[gamepad.id]) ) {
     gamepad.on('button0',  gamepad => { la.input.GamepadButton0Depressed(gamepad); })
        .before('button0',  gamepad => { la.input.GamepadButton0Pressed(gamepad); })
         .after('button0',  gamepad => { la.input.GamepadButton0Released(gamepad); });
     gamepad.on('button1',  gamepad => { la.input.GamepadButton1Depressed(gamepad); })
        .before('button1',  gamepad => { la.input.GamepadButton1Pressed(gamepad); })
         .after('button1',  gamepad => { la.input.GamepadButton1Released(gamepad); });
     gamepad.on('button2',  gamepad => { la.input.GamepadButton2Depressed(gamepad); })
        .before('button2',  gamepad => { la.input.GamepadButton2Pressed(gamepad); })
         .after('button2',  gamepad => { la.input.GamepadButton2Released(gamepad); });
     gamepad.on('button3',  gamepad => { la.input.GamepadButton3Depressed(gamepad); })
        .before('button3',  gamepad => { la.input.GamepadButton3Pressed(gamepad); })
         .after('button3',  gamepad => { la.input.GamepadButton3Released(gamepad); });
     gamepad.on('button4',  gamepad => { la.input.GamepadButton4Depressed(gamepad); })
        .before('button4',  gamepad => { la.input.GamepadButton4Pressed(gamepad); })
         .after('button4',  gamepad => { la.input.GamepadButton4Released(gamepad); });
     gamepad.on('button5',  gamepad => { la.input.GamepadButton5Depressed(gamepad); })
        .before('button5',  gamepad => { la.input.GamepadButton5Pressed(gamepad); })
         .after('button5',  gamepad => { la.input.GamepadButton5Released(gamepad); });
     gamepad.on('button6',  gamepad => { la.input.GamepadButton6Depressed(gamepad); })
        .before('button6',  gamepad => { la.input.GamepadButton6Pressed(gamepad); })
         .after('button6',  gamepad => { la.input.GamepadButton6Released(gamepad); });
     gamepad.on('button7',  gamepad => { la.input.GamepadButton7Depressed(gamepad); })
        .before('button7',  gamepad => { la.input.GamepadButton7Pressed(gamepad); })
         .after('button7',  gamepad => { la.input.GamepadButton7Released(gamepad); });
     gamepad.on('button8',  gamepad => { la.input.GamepadButton8Depressed(gamepad); })
        .before('button8',  gamepad => { la.input.GamepadButton8Pressed(gamepad); })
         .after('button8',  gamepad => { la.input.GamepadButton8Released(gamepad); });
     gamepad.on('button9',  gamepad => { la.input.GamepadButton9Depressed(gamepad); })
        .before('button9',  gamepad => { la.input.GamepadButton9Pressed(gamepad); })
         .after('button9',  gamepad => { la.input.GamepadButton9Released(gamepad); });
     gamepad.on('button10', gamepad => { la.input.GamepadButton10Depressed(gamepad); })
        .before('button10', gamepad => { la.input.GamepadButton10Pressed(gamepad); })
         .after('button10', gamepad => { la.input.GamepadButton10Released(gamepad); });
     gamepad.on('button11', gamepad => { la.input.GamepadButton11Depressed(gamepad); })
        .before('button11', gamepad => { la.input.GamepadButton11Pressed(gamepad); })
         .after('button11', gamepad => { la.input.GamepadButton11Released(gamepad); });
     gamepad.on('button12', gamepad => { la.input.GamepadButton12Depressed(gamepad); })
        .before('button12', gamepad => { la.input.GamepadButton12Pressed(gamepad); })
         .after('button12', gamepad => { la.input.GamepadButton12Released(gamepad); });
     gamepad.on('button13', gamepad => { la.input.GamepadButton13Depressed(gamepad); })
        .before('button13', gamepad => { la.input.GamepadButton13Pressed(gamepad); })
         .after('button13', gamepad => { la.input.GamepadButton13Released(gamepad); });
     gamepad.on('button14', gamepad => { la.input.GamepadButton14Depressed(gamepad); })
        .before('button14', gamepad => { la.input.GamepadButton14Pressed(gamepad); })
         .after('button14', gamepad => { la.input.GamepadButton14Released(gamepad); });
     gamepad.on('button15', gamepad => { la.input.GamepadButton15Depressed(gamepad); })
        .before('button15', gamepad => { la.input.GamepadButton15Pressed(gamepad); })
         .after('button15', gamepad => { la.input.GamepadButton15Released(gamepad); });
     gamepad.on('button16', gamepad => { la.input.GamepadButton16Depressed(gamepad); })
        .before('button16', gamepad => { la.input.GamepadButton16Pressed(gamepad); })
         .after('button16', gamepad => { la.input.GamepadButton16Released(gamepad); });
     gamepad.on('up0',      gamepad => { la.input.GamepadUp0Depressed(gamepad); })
        .before('up0',      gamepad => { la.input.GamepadUp0Pressed(gamepad); })
         .after('up0',      gamepad => { la.input.GamepadUp0Released(gamepad); });
     gamepad.on('down0',    gamepad => { la.input.GamepadDown0Depressed(gamepad); })
        .before('down0',    gamepad => { la.input.GamepadDown0Pressed(gamepad); })
         .after('down0',    gamepad => { la.input.GamepadDown0Released(gamepad); });
     gamepad.on('right0',   gamepad => { la.input.GamepadRight0Depressed(gamepad); })
        .before('right0',   gamepad => { la.input.GamepadRight0Pressed(gamepad); })
         .after('right0',   gamepad => { la.input.GamepadRight0Released(gamepad); });
     gamepad.on('left0',    gamepad => { la.input.GamepadLeft0Depressed(gamepad); })
        .before('left0',    gamepad => { la.input.GamepadLeft0Pressed(gamepad); })
         .after('left0',    gamepad => { la.input.GamepadLeft0Released(gamepad); });
     gamepad.on('up1',      gamepad => { la.input.GamepadUp1Depressed(gamepad); })
        .before('up1',      gamepad => { la.input.GamepadUp1Pressed(gamepad); })
         .after('up1',      gamepad => { la.input.GamepadUp1Released(gamepad); });
     gamepad.on('down1',    gamepad => { la.input.GamepadDown1Depressed(gamepad); })
        .before('down1',    gamepad => { la.input.GamepadDown1Pressed(gamepad); })
         .after('down1',    gamepad => { la.input.GamepadDown1Released(gamepad); });
     gamepad.on('right1',   gamepad => { la.input.GamepadRight1Depressed(gamepad); })
        .before('right1',   gamepad => { la.input.GamepadRight1Pressed(gamepad); })
         .after('right1',   gamepad => { la.input.GamepadRight1Released(gamepad); });
     gamepad.on('left1',    gamepad => { la.input.GamepadLeft1Depressed(gamepad); })
        .before('left1',    gamepad => { la.input.GamepadLeft1Pressed(gamepad); })
         .after('left1',    gamepad => { la.input.GamepadLeft1Released(gamepad); });
     gamepad.on('start',    gamepad => { la.input.GamepadStartDepressed(gamepad); })
        .before('start',    gamepad => { la.input.GamepadStartPressed(gamepad); })
         .after('start',    gamepad => { la.input.GamepadStartReleased(gamepad); });
     gamepad.on('select',   gamepad => { la.input.GamepadSelectDepressed(gamepad); })
        .before('select',   gamepad => { la.input.GamepadSelectPressed(gamepad); })
         .after('select',   gamepad => { la.input.GamepadSelectReleased(gamepad); });
     gamepad.on('power',    gamepad => { la.input.GamepadPowerDepressed(gamepad); })
        .before('power',    gamepad => { la.input.GamepadPowerPressed(gamepad); })
         .after('power',    gamepad => { la.input.GamepadPowerReleased(gamepad); });
     gamepad.on('l1',       gamepad => { la.input.GamepadL1Depressed(gamepad); })
        .before('l1',       gamepad => { la.input.GamepadL1Pressed(gamepad); })
         .after('l1',       gamepad => { la.input.GamepadL1Released(gamepad); });
     gamepad.on('l2',       gamepad => { la.input.GamepadL2Depressed(gamepad); })
        .before('l2',       gamepad => { la.input.GamepadL2Pressed(gamepad); })
         .after('l2',       gamepad => { la.input.GamepadL2Released(gamepad); });
     gamepad.on('r1',       gamepad => { la.input.GamepadR1Depressed(gamepad); })
        .before('r1',       gamepad => { la.input.GamepadR1Pressed(gamepad); })
         .after('r1',       gamepad => { la.input.GamepadR1Released(gamepad); });
     gamepad.on('r2',       gamepad => { la.input.GamepadR2Depressed(gamepad); })
        .before('r2',       gamepad => { la.input.GamepadR2Pressed(gamepad); })
         .after('r2',       gamepad => { la.input.GamepadR2Released(gamepad); });
    }
    this.gamepad[gamepad.id]=gamepad;    
   });
  }
  
  ResetKeyboard() {
    this.keyboard=new KeyboardInput();
  }
  
  ResetEvents() {
    this.GamepadButton0Depressed = function (gamepad) {};
    this.GamepadButton0Pressed = function (gamepad) {};
    this.GamepadButton0Released = function (gamepad) {};
    this.GamepadButton1Depressed = function (gamepad) {};
    this.GamepadButton1Pressed = function (gamepad) {};
    this.GamepadButton1Released = function (gamepad) {};
    this.GamepadButton2Depressed = function (gamepad) {};
    this.GamepadButton2Pressed = function (gamepad) {};
    this.GamepadButton2Released = function (gamepad) {};
    this.GamepadButton3Depressed = function (gamepad) {};
    this.GamepadButton3Pressed = function (gamepad) {};
    this.GamepadButton3Released = function (gamepad) {};
    this.GamepadButton4Depressed = function (gamepad) {};
    this.GamepadButton4Pressed = function (gamepad) {};
    this.GamepadButton4Released = function (gamepad) {};
    this.GamepadButton5Depressed = function (gamepad) {};
    this.GamepadButton5Pressed = function (gamepad) {};
    this.GamepadButton5Released = function (gamepad) {};
    this.GamepadButton6Depressed = function (gamepad) {};
    this.GamepadButton6Pressed = function (gamepad) {};
    this.GamepadButton6Released = function (gamepad) {};
    this.GamepadButton7Depressed = function (gamepad) {};
    this.GamepadButton7Pressed = function (gamepad) {};
    this.GamepadButton7Released = function (gamepad) {};
    this.GamepadButton8Depressed = function (gamepad) {};
    this.GamepadButton8Pressed = function (gamepad) {};
    this.GamepadButton8Released = function (gamepad) {};
    this.GamepadButton9Depressed = function (gamepad) {};
    this.GamepadButton9Pressed = function (gamepad) {};
    this.GamepadButton9Released = function (gamepad) {};
    this.GamepadButton10Depressed = function (gamepad) {};
    this.GamepadButton10Pressed = function (gamepad) {};
    this.GamepadButton10Released = function (gamepad) {};
    this.GamepadButton11Depressed = function (gamepad) {};
    this.GamepadButton11Pressed = function (gamepad) {};
    this.GamepadButton11Released = function (gamepad) {};
    this.GamepadButton12Depressed = function (gamepad) {};
    this.GamepadButton12Pressed = function (gamepad) {};
    this.GamepadButton12Released = function (gamepad) {};
    this.GamepadButton13Depressed = function (gamepad) {};
    this.GamepadButton13Pressed = function (gamepad) {};
    this.GamepadButton13Released = function (gamepad) {};
    this.GamepadButton14Depressed = function (gamepad) {};
    this.GamepadButton14Pressed = function (gamepad) {};
    this.GamepadButton14Released = function (gamepad) {};
    this.GamepadButton15Depressed = function (gamepad) {};
    this.GamepadButton15Pressed = function (gamepad) {};
    this.GamepadButton15Released = function (gamepad) {};
    this.GamepadButton16Depressed = function (gamepad) {};
    this.GamepadButton16Pressed = function (gamepad) {};
    this.GamepadButton16Released = function (gamepad) {};
    this.GamepadUp0Depressed = function (gamepad) {};
    this.GamepadUp0Pressed = function (gamepad) {};
    this.GamepadUp0Released = function (gamepad) {};
    this.GamepadDown0Depressed = function (gamepad) {};
    this.GamepadDown0Pressed = function (gamepad) {};
    this.GamepadDown0Released = function (gamepad) {};
    this.GamepadRight0Depressed = function (gamepad) {};
    this.GamepadRight0Pressed = function (gamepad) {};
    this.GamepadRight0Released = function (gamepad) {};
    this.GamepadLeft0Depressed = function (gamepad) {};
    this.GamepadLeft0Pressed = function (gamepad) {};
    this.GamepadLeft0Released = function (gamepad) {};
    this.GamepadUp1Depressed = function (gamepad) {};
    this.GamepadUp1Pressed = function (gamepad) {};
    this.GamepadUp1Released = function (gamepad) {};
    this.GamepadDown1Depressed = function (gamepad) {};
    this.GamepadDown1Pressed = function (gamepad) {};
    this.GamepadDown1Released = function (gamepad) {};
    this.GamepadRight1Depressed = function (gamepad) {};
    this.GamepadRight1Pressed = function (gamepad) {};
    this.GamepadRight1Released = function (gamepad) {};
    this.GamepadLeft1Depressed = function (gamepad) {};
    this.GamepadLeft1Pressed = function (gamepad) {};
    this.GamepadLeft1Released = function (gamepad) {};
    this.GamepadStartDepressed = function (gamepad) {};
    this.GamepadStartPressed = function (gamepad) {};
    this.GamepadStartReleased = function (gamepad) {};
    this.GamepadSelectDepressed = function (gamepad) {};
    this.GamepadSelectPressed = function (gamepad) {};
    this.GamepadSelectReleased = function (gamepad) {};
    this.GamepadPowerDepressed = function (gamepad) {};
    this.GamepadPowerPressed = function (gamepad) {};
    this.GamepadPowerReleased = function (gamepad) {};
    this.GamepadL1Depressed = function (gamepad) {};
    this.GamepadL1Pressed = function (gamepad) {};
    this.GamepadL1Released = function (gamepad) {};
    this.GamepadL2Depressed = function (gamepad) {};
    this.GamepadL2Pressed = function (gamepad) {};
    this.GamepadL2Released = function (gamepad) {};
    this.GamepadR1Depressed = function (gamepad) {};
    this.GamepadR1Pressed = function (gamepad) {};
    this.GamepadR1Released = function (gamepad) {};
    this.GamepadR2Depressed = function (gamepad) {};
    this.GamepadR2Pressed = function (gamepad) {};
    this.GamepadR2Released = function (gamepad) {};
    this.TouchTap = function (event) {};
    this.TouchDoubleTap = function (event) {};
    this.TouchLongTap = function (event) {};
    this.TouchRight = function (event) {};
    this.TouchLeft = function (event) {};
    this.TouchUp = function (event) {};
    this.TouchDown = function (event) {};
  }
  
};

la.input = new LAInput();