'use strict';

class Entity extends ListItem {
  constructor() {
    super();
    this.Render=function(list){};
    this.Between=function(list){};
  }
};


class Entities extends LinkedList {
  constructor() {
    super();
    this.Unbind();
    this.Pre=function(){}
    this.Post=function(){}
  }
  Bind( renderer ) {
    this.renderer=renderer;
  }
  Unbind() {
    this.renderer=null;
  }
  Render() {
    this.Pre();
    for ( let i =0; i<this.list.length; i++ ) this.list[i].Render(this);
    this.Post();
  }
  Between() {
    for ( let i =0; i<this.list.length; i++ ) this.list[i].Between(this);
  }
};