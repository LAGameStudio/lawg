'use strict';

class LAAudio {
  
  constructor() {
    this.howls=[];
    this.unique_howls=[];
    this.limited_howls=[];
    this.sprite_howls=[];
    this.howler = {
      volume: 1.0,
      html5: true,
      loop: false,
      preload: true,
      autoplay: false,
      mute: false,
      rate: 1.0,
      pool: la.config.howler.pool_size
    };
    this.tracker=null;
    this.spatial=[];
  }
  
  InitTracker() {
    this.tracker = { player: new ScripTracker(), ready:false, loaded:null, playing:false };
    this.tracker.player.on(ScripTracker.Events.playerReady,function(player){this.tracker.ready=true;});
  }
  
  StopAll() {
    this.TrackerStop();
    Clear();
  }
  
  Clear() {
    la.config.global.howler.unload();
    this.howls=[];
    this.unique_howls=[];
    this.limited_howls=[];
    this.sprite_howls=[];    
  }
  
  SetMasterVolume( value ) {
    la.config.global.howler.volume(value);
  }
  
  Load( file_or_files_or_json ) {
    var a=is_object(file_or_files_or_json) ? new Howl(file_or_files_or_json) : new Howl({ src: assure_string_array(file_or_files_or_json) });
    return a;
  }  
  
  Sound( file_or_files_or_json ) {
    var a=is_object(file_or_files_or_json) ? new Howl(file_or_files_or_json) : new Howl({ src: assure_string_array(file_or_files_or_json) });
    return a;
  }
  
  Play( filename ) {
    if ( is_object(filename) ) this.howls[filename.src]=new Howl(filename);
    else if ( !defined(this.howls[filename]) ) {
     this.howls[filename]=new Howl({ src: assure_string_array(filename), html5:true });
     this.howls[filename].play();
    } else {
      this.howls[filename].play();
    }
    return this.howls[filename];
  }
  
  PlayOnce( unique_string, file_or_files_or_json ) {
    if ( defined(this.unique_howls[unique_string]) ) return false;
    this.unique_howls[unique_string] = is_object(file_or_files_or_json) ? new Howl(file_or_files_or_json) : new Howl({ src: assure_string_array(file_or_files_or_json) });
    this.unique_howls[unique_string].unique_string=unique_string;
    this.unique_howls[unique_string].play();
    return true;
  }

  PlayLimited( limit, unique_string, file_or_files_or_json ) {
    var a=null;
    if ( defined(this.limited_howls[unique_string]) ) {
      a=this.limited_howls[unique_string];
      a.playing_limit=limit;
      a.playing_counter++;
      a.play();
      a.once('end',function(){
        a.playing_counter--;
      });
    } else {
      a=is_object(file_or_files_or_json) ? new Howl(file_or_files_or_json) : new Howl({ src: assure_string_array(file_or_files_or_json) });
      this.limited_howls[unique_string] = a;
      a.unique_string=unique_string;
      a.playing_counter=1;
      a.playing_limit=limit;
      a.play();
      a.once('end',function(){
        a.playing_counter--;
      });
    }
    return a;
  }
    
  Sprites( unique_string, file_or_files_or_json, spritedata ) {
  }
  
  //// MOD, S3M and XM File Playback with ScripTracker

  TrackStop() {
    if ( !this.tracker ) return;
    if ( this.tracker.ready && this.tracker.playing ) {
      this.tracker.player.stop();
      this.tracker.playing=false;
      return true;
    }
    return false;
  }
  
  TrackLoad( fn, play=true ) {
    if ( !this.tracker ) return;
    if ( this.tracker.playing ) {
      this.tracker.player.stop();
      this.tracker.playing=false;
    }
    this.tracker.ready=false;
    this.tracker.loaded=fn;
    this.tracker.playing=false;
    if ( play ) this.tracker.player.on(ScripTracker.Events.playerReady, function(player){la.audio.tracker.ready=true; player.play(); la.audio.tracker.playing=true;});
    this.tracker.player.load("http://my.website.com/cool_song.xm");
  }
  
  TrackUnload() {
    if ( !this.tracker ) return;
    TrackStop();
    this.tracker.ready=false;
    this.tracker.loaded=null;
  }
  
  TrackPlay( force_restart=true ) {
    if ( !this.tracker ) return;
    if ( this.tracker.ready && !this.tracker.playing ) {
      player.play();
      return true;
    } else if ( force_restart ) {
      if ( this.tracker.ready ) {
        if ( this.tracker.playing ) {
          this.tracker.player.stop();
          this.tracker.player.rewind();
          this.tracker.player.play();
        } else {
          this.tracker.player.play();
        }
      }
    }
  }
  
  TrackRewind( play=false ) {
    if ( !this.tracker ) return;
    if ( this.tracker.ready ) {
      if ( this.tracker.playing ) this.TrackStop();
      this.tracker.player.rewind();
      if ( play ) this.tracker.player.play();
    }
  }
  
  TrackNext() {
    if ( !this.tracker ) return;
    if ( this.tracker.ready && this.tracker.playing ) this.tracker.player.nextOrder();
  }
  
  TrackPrev() {
    if ( !this.tracker ) return;
    if ( this.tracker.ready && this.tracker.playing ) this.tracker.player.prevOrder();
  }
  
  TrackOn(a,f) {
    if ( !this.tracker ) return;
    this.tracker.player.on(a,f);
  }
  
  TrackOff(a,f) {
    if ( !this.tracker ) return;
    this.tracker.player.off(a,f);    
  }
  
};

la.audio=new LAAudio();