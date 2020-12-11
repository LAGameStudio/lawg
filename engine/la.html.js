'use strict';

// Executes your fun "form model" that usually is built off an API data block
// expects: unpackFunc( data, model, domid_prefix, context )
function Modelize( injectpoint, prefix="jsapp-model", model, jqueryIt=true ) {
	$(injectpoint).html(PackForm(model,prefix));
	if ( jqueryIt ) jQueryForm(model, prefix);
}

function defaultUnmapForm(data) { return data; }

function Demodelize( model, unmapFunc=defaultUnmapForm, completionFunc=api.EmptyFunction, prefix="jsapp-model" ) {
 console.log(model);
	let data=UnpackForm(model,prefix);
	console.log(data);
	if ( data.error ) Warn(data.error.message);
	else app.api.Modify("Program", data.id, 
		unmapFunc(data),
		completionFunc,
		function(e){ Warn("Unable to save changes!"); }
 );
}



// HTML form helper

// an html form handler that supports jquery automation with ajax api

/*
 * Form Model Description:
 *
 *
 * Example model :
 [
	 { name: "id", type:"hidden", value:id },
	 { name: "name", label: "Name:", type:"string", value: program.name, hint: "Program Name" },
	 { name: "desc", label: "Description:", type:"text", value: program.desc, hint: "Description" },
	 { name: "mode", label: "Testing Mode", type: "select", value: parseInt(program.mode),
		 options: [
		 { name: "Each test", value: 1 },
		 { name: "All tests", value: 2 }
		 ]
	 }, ...
	 
	 ... html inserts
	 { type: "p", css: "alert alert-dark", text: "When set to <i>ON</i>, prior certified students are given a chance to weigh in to help grade exams that require a human grader.  Final exam results are still approved by you, but their suggested grade shows up if they participate.  This can help cut down grading time.  You can also mark participants as trusted so their grading opinions appear higher in the list.  Participants receive extra bling on their badges indicating they have helped you certify others for something in which they are certified.  Please note that students can opt out of this feature." },
 ...]
 * Values for "type":
 *  -html types:
 *   p, div, span, h1, h2, h3, h4, h5, h6, hr
 *  -input types:
 *   hidden, string, text, markdown, date, slider, range,
 *   integer, money, decimal, number, select, color, toggle,
 *   button
 *  -special form structures:
 *   extendable ("extend" short form typename)
 *
 *   { type:"extendable", model:<data-model>, close:<html|optional>, add:<html|optional> }
 *
 * Other parameters:
 * name    (unqiue) property.name, used to create id
 * css      css class list applied to input area
 * style    style to add to tag
 * list     used to do autocomplete for limited value scenarios (integer, money, decimal, number, string)
 * text     used to populate the interior of an html element type
 * label    labels an area, button, or input
 * labelcss css class list added to label wrapper div
 * caption  for textarea, text and other input types onlye:
 *        (optional) this shows <small> (or user-defined) caption near label,
 *                   if object is provided, must be of the form:
 *                      {
 *                       where: "label", "afterlabel" (default), "after" or "before" (on input tag),
 *                       html: <content>,
 *                       tag: "small" (default) (or false for none, so no wrapper tag will be used),
 *                       css: (optional) adds a class to the tag,
 *                       style: (optional) adds specific style to the tag
 *                      }
 * range  (optional) for numeric data entry (types integer, decimal, money, date),
 *          object that must contain the format { min: # (optional), max: # (optional) }
 * autofocus To enable autofocus feature (true/false)
 * multiple  To enable multiple selections (true/false)
 * disabled  To disable (true/false)
 * currency  For "money" element types, if not present defaults to USD
 * tip       activates a tooltip, provide text/html for content,
 *           if an object is provided, expects the format { direction: (default to "bottom"), html: <content> }
 * wrapper   Used for certain input types to define a tag wrapper
 * after     Appended to input type
 * switch   for 'toggle', adds a span tag to allow for a slider toggle, provide css class or defaults to "slider"
 *
 * Event parameters for further customization (expects jquery function(e){..}):
 * hide, hover, click, scroll, toggle, select, resize, blur, load, unload, menu, focus, focusin, focusout,
 * submit, contextmenu,
 * input, change, mousemove, mouseenter, mouseleave, mouseover, mouseout, mousedown, mouseup, keyup, keydown, keypress,
 * (or) onmousemove, onmouseenter, onmouseleave, onmouseover, onmouseout, onmousedown, onmouseup,
 * onkeydown, onkeypress, onkeyup, onchange, oninput
 * 
 * Parameters only for 'extendable':
 * model    recursion (use with extendable)
 * close    html for close button, use with extendable, has default
 * closecss css class for close button, has default
 * closefirst  (default: false) allow removal of the "first"
 * closebefore (default: false) moves the close button before the form copy
 * add      html for add button, use with extendable, has default
 * addcss   css class for add button, has default
 * initial  a number that describes the number of initial copies
 * limit    (default: 0 = unlimited), limits the number of times an extendable can be extended
 * minimum  a number that must be less than limit, describing a minimum number of entries
 * title    A title for each section, where ### is replaced with the number of the extension
 * inner    describes the CSS class list to applied to each extendable form copy
 * before   html inserted before the extendable, a section title for example
 */

var html="",prehtml="",posthtml="",afterlabel="", inlabel="";
var pfPrototypes={};
function PackForm( model, prefix="jsapp-model", keepPrototypes=false ) {
 let property=prefix.replaceAll("-","");
 if ( !keepPrototypes || !defined(pfPrototypes[property]) ) pfPrototypes[property]=[];
 html="";
 html='<table width="100%">';
 model.forEach(function(item,index) {
  inlabel="";
  afterlabel="";
  prehtml="";
  posthtml="";
	 let n = (item.name?item.name:index);
	 let i = prefix+'-'+slugify(n);
	 let v = (defined(item.value)?item.value:"");
	 let p = (item.hint?item.hint:"");
	 if ( item.type === "markdown" || item.type === "text" ) html+='<tr><td>';
	 else html+='<tr id="'+i+'-wrapper"><td>';
  if ( defined(item.caption) ) {
   let content="",where="after",tag="small";
   if ( is_string(item.caption) ) {
    content=item.caption;
   } else if ( defined(item.caption.html) ) {
    content=item.caption.html;
    if ( defined(item.caption.where) ) where=item.caption.where;
    if ( defined(item.caption.tag) ) tag=item.caption.tag;
   }
   let caption=div((tag?('<'+tag+(defined(item.caption.css)?' class="'+item.caption.css+'"':'')+(defined(item.caption.style)?' style="'+item.caption.style+'"':'')+'>'):'')+content+(tag?('</'+tag+'>'):''));
   switch ( where ) {
    case "label": inlabel+=caption; break;
    case "afterlabel": afterlabel+=caption; break;
    case "after": case "post": posthtml+=caption; break;
    case "before": case "pre": prehtml+=caption; break;
    default: afterlabel+=caption; break;
   }
  }
	 if ( item.label ) html+=div('<label for="'+n+'">'+item.label+inlabel+'</label>',defined(item.labelcss)?item.labelcss:null);
  html+=afterlabel;
	 html+="</td><td>";
	 if ( item.type === "p" ) {
	 	html+='</td><td></td></tr><tr><td colspan=2><p id="'+i+'" style="'+(item.style?item.style:"")+'" class="'+(item.css?item.css:"")+'">'+item.text+'</p></td></tr>';
	 } else if ( item.type === "div" ) {
	 	html+='<div id="'+i+'" style="'+(item.style?item.style:"")+'" class="'+(item.css?item.css:"")+'">'+item.text+'</div>';
	 } else if ( item.type === "span" ) {
	 	html+='<span id="'+i+'" style="'+(item.style?item.style:"")+'" class="'+(item.css?item.css:"")+'">'+item.text+'</span>';
	 } else if ( item.type === "h1" ) {
	 	html+='<h1 id="'+i+'" style="'+(item.style?item.style:"")+'" class="'+(item.css?item.css:"")+'">'+item.text+'</h1>';
	 } else if ( item.type === "h2" ) {
	 	html+='<h2 id="'+i+'" style="'+(item.style?item.style:"")+'" class="'+(item.css?item.css:"")+'">'+item.text+'</h2>';
	 } else if ( item.type === "h3" ) {
	 	html+='<h3 id="'+i+'" style="'+(item.style?item.style:"")+'" class="'+(item.css?item.css:"")+'">'+item.text+'</h3>';
	 } else if ( item.type === "h4" ) {
	 	html+='<h4 id="'+i+'" style="'+(item.style?item.style:"")+'" class="'+(item.css?item.css:"")+'">'+item.text+'</h4>';
	 } else if ( item.type === "h5" ) {
	 	html+='<h5 id="'+i+'" style="'+(item.style?item.style:"")+'" class="'+(item.css?item.css:"")+'">'+item.text+'</h5>';
	 } else if ( item.type === "h6" ) {
	 	html+='<h6 id="'+i+'" style="'+(item.style?item.style:"")+'" class="'+(item.css?item.css:"")+'">'+item.text+'</h6>';
  } else if ( item.type == "hr" ) {
   html+='<hr size=1 width="'+(item.width?item.width:"60%")+'"/>';
	 } else if ( item.type === "hidden" ) {
 		html+='<input name="'+n+'" id="'+i+'" type="hidden" value="'+v+'" placeholder="'+p+'" style="'+(item.style?item.style:"")+'" class="'+(item.css?item.css:"")+'">';
	 } else if ( item.type === "string" ) {
   html+=prehtml;
 		html+='<input name="'+n+'" id="'+i+'" type="text" value="'+v+'" placeholder="'+p+'" style="'+(item.style?item.style:"")+'" class="'+(item.css?item.css:"")+'"';
   html+= item.list ? ('list="'+i+'-datalist" ')  : '';
   html+= '/>';
   html+=posthtml;
		 if ( item.list ) {
			 html+='<datalist id="'+i+'-datalist">';
			 for( let j=0; j<item.list.length; j++ ) {
			 	html+=isString(item.list[j])?'<option value="'+item.list[j]+'">':'<option value="'+item.list[j].value+'">'+item.list[j].text;
			 }
			 html+='</datalist>';
		 }
	 } else if ( item.type === "text" ) {
	  html+="</td></tr>";
   html+='<tr><td colspan=2>'
   html+=prehtml;
	  html+='<div id="'+i+'-wrapper"><textarea name="'+n+'" id="'+i+'" placeholder="'+p+'" style="width:100%; resize:vertical; '+(item.style?item.style:"")+'" class="'+(item.css?item.css:"")+'">'+v+'</textarea></div>';
   html+=posthtml;
	 } else if ( item.type === "markdown" ) {
		 html+="</td></tr>";
   html+='<tr><td colspan=2>'
   html+=prehtml;
 	 html+='<div id="'+i+'-wrapper" class="roundbox markdown-editor"><textarea name="'+n+'" id="'+i+'" placeholder="'+p+'" style="width:100%; resize:vertical; '+(item.style?item.style:"")+'" class="'+(item.css?item.css:"")+'">'+v+'</textarea></div>';
   html+=posthtml;
	 } else if ( item.type === "date" ) {
   html+=prehtml;
 		html+='<input name="'+n+'" id="'+i+'" type="date" value="'+v+'" placeholder="'+p+'" style="'+(item.style?item.style:"")+'" class="'+(item.css?item.css:"")+'"';
		 html+= item.range ? ( (defined(item.range.min)?(' min="'+item.range.min+'"'):'') + (defined(item.range.max)?(' max="'+item.range.max+'"'):'') + (defined(item.range.step)?(' step="'+item.range.step+'"'):'') + (defined(item.list)?(' list="'+i+'-datalist"'):'') ) : '';
   html+= item.list ? ('list="'+i+'-datalist" ')  : '';   
		 html+='/>';
   html+=posthtml;
		 if ( item.list ) {
			 html+='<datalist id="'+i+'-datalist">';
			 for( let j=0; j<item.list.length; j++ ) {
			 	html+=isString(item.list[j])?'<option value="'+item.list[j]+'">':'<option value="'+item.list[j].value+'">'+item.list[j].text;
			 }
			 html+='</datalist>';
		 }   
	 } else if ( item.type === "slider" ) {
   html+=prehtml;
		 html+='<input name="'+n+'" id="'+i+'" type="number" value="'+v+'" placeholder="'+p+'" style="'+(item.style?item.style:"")+'" class="'+(item.css?item.css:"")+'">';
   html+=posthtml;
	 } else if ( item.type === "integer" || item.type == "decimal" || item.type == "number" || item.type == "money" ) {
   html+=prehtml;
		 if ( item.type == "money" ) html+="<span><b>$</b>";
		 html+='<input name="'+n+'" id="'+i+'" type="number" value="'+v+'" placeholder="'+p+'" style="'+(item.style?item.style:"")+'" class="'+(item.css?item.css:"")+'"';
		 html+= item.range ? ( (defined(item.range.min)?(' min="'+item.range.min+'"'):'') + (defined(item.range.max)?(' max="'+item.range.max+'"'):'') + (defined(item.range.step)?(' step="'+item.range.step+'"'):'') + (defined(item.list)?(' list="'+i+'-datalist"'):'') ) : '';
   html+= item.list ? ('list="'+i+'-datalist" ') : '';
		 html+='/>';
		 if ( item.list ) {
			 html+='<datalist id="'+i+'-datalist">';
		  for( let j=0; j<item.list.length; j++ ) {
		  	html+=isString(item.list[j])?'<option value="'+item.list[j]+'">':'<option value="'+item.list[j].value+'">'+item.list[j].text;
		  }
			 html+='</datalist>';
		 }
		 if ( item.type == "money" ) html+=(item.currency?item.currency:"USD")+" </span>";
   html+=posthtml;
	 } else if ( item.type === "radio" ) {
   html+=prehtml;
		 if ( item.title ) html+=item.title;
		 item.options.forEach(function(opt,num){
			 html+=(item.wrapper?'<'+item.wrapper+'>':'<div>')+'<input type="radio" name="'+i+'" id="'+i+'-'+num+'" value="'+opt.value+'" style="'+(item.style?item.style:"")+'" class="'+(item.css?item.css:"")+'"> '+opt.label+((item.wrapper?'</'+item.wrapper+'>':'</div>')+(item.after?item.after:''));
		 });
   html+=posthtml;
	 } else if ( item.type === "select" ) {
   html+=prehtml;
		 html+='<select id="'+i+'"';
		 html+=(item.autofocus?" autofocus":'');
		 html+=(item.multiple?" multiple":'');
		 html+=(item.disabled?" disabled":'');
   html+=(item.css?' class="'+item.css+'"':'');
		 html+=(item.size?(' size="'+item.size+'"'):'');
		 html+='>';
		 item.options.forEach(function(opt,num){
			 html+='<option value="'+opt.value+'" id="'+i+'-'+num+'"';
			 html+=(""+opt.value) == (""+item.value)?' selected':'';
			 html+=opt.label?(' label="'+opt.label+'"'):'';
			 html+=opt.disabled?' disabled':'';
			 html+='>'+opt.name+'</option>';
		 });
		 html+='</select>';
   html+=posthtml;
  } else if ( item.type === "color" ) {
   html+=prehtml;
   html+= '<input type="color" id="'+i+'" name="'+i+'"'+(item.css?' class="'+item.css+'"':'')+' value="'+(v.length>0?v:"#FF0000")+'">';
   html+=posthtml;
	 } else if ( item.type === "toggle" ) {
   html+=prehtml;
		 html+= '<input type="checkbox" id="'+i+'" name="'+i+'"'+(item.css?' class="'+item.css+'"':'')+' value="'+i+'"'+(istrue(v)?" checked":'')+'>';
   if ( defined(item.switch) ) html+='<span class="'+(item.switch===true?"slider":item.switch)+'"></span>';
   html+=posthtml;
	 } else if ( item.type === "extendable" || item.type === "extend" ) {
   let p=pfPrototypes[property].length;
   pfPrototypes[property][p]=item;
   let outer=i;
   let add=(item.add?item.add:faicon("fa-plus"));
   let addcss=(item.addcss?item.addcss:"form-extendable-add");
   html+='</td><td></td></tr><tr><td colspan=2>'+(defined(item.before)?item.before:'')+div(
    hrefbtn(add,"packFormExtendAdd('"+prefix+"','"+outer+"')",addcss,outer+"-addbtn"),
    item.css?item.css:"", outer, null, null, [
       {name:"pf-extendable",value:item.name},
       {name:"pf-prototype",value:p},
       {name:"pf-extendable-id",value:i},
       {name:"pf-counter",value:0},
       {name:"pf-outer",value:outer},
       {name:"pf-prefix",value:prefix}
    ]
   );
  }
	 html+="</td></tr>";
 });
 return html;
}

function packFormExtendClose( outer, itemNumber, closeFirst=false ) {
 let wrapper=Get(outer);
 let counter=parseInt($(wrapper).attr("pf-counter"));
 let prototype=parseInt($(wrapper).attr("pf-prototype"));
 let inner=outer+"-inner-"+itemNumber;
 let ele=Get( inner );
 ele.parentNode.removeChild(ele);
 counter--;
 $(wrapper).attr("pf-counter",counter);
 let elements=document.querySelectorAll('[pf-outer="'+outer+'"]');
 let i=1;
 elements.forEach(function(e) {
  $(e).attr("pf-number",i);
  i++;
 });
 scrollElement(Get(outer));
}

function packFormExtendAdd( prefix, outer, calledDuringCreate=false ) {
 let property=prefix.replaceAll("-","");
// console.log(pfPrototypes[property]);
// console.log(outer);
 let wrapper=Get(outer);
 let counter=parseInt($(wrapper).attr("pf-counter"));
 let prototype=parseInt($(wrapper).attr("pf-prototype"));
// console.log("Prototype: "+prototype);
 let item=pfPrototypes[property][prototype];
 let closebtn="";
 let makeCloseButton=false;
 let disableAddButton=false;
 if ( defined(item.limit) ) {
  if ( item.limit != 0 ) {
   if ( item.limit <= counter ) makeCloseButton=true;
   if ( item.limit >= counter ) disableAddButton=true;
  } else makeCloseButton = true;
 } else makeCloseButton = true;
 if ( defined(item.minimum) ) {
  if ( counter < item.minimum ) makeCloseButton=false;
  else makeCloseButton=true;
 }
 counter++;
 let inner=outer+"-inner-"+counter;
 if ( makeCloseButton ) {
  let close=(item.close?item.close:faicon("fa-close"));
  let closecss=(item.closecss?item.closecss:"form-extendable-close");
  closebtn=div(hrefbtn(close,"packFormExtendClose('"+outer+"',"+counter+","+(item.closefirst?"true":"false")+")",closecss),null,outer+"-closer");
 }
 let html=div(
  (item.closebefore === true ? closebtn : "")
  +(item.title?item.title.replaceAll("###",counter):"")
  +div( PackForm( item.model, inner, true ),
   null,inner,null,null,[
    {name:"pf-prototype",value:prototype},
    {name:"pf-number",value:counter},
    {name:"pf-outer",value:outer}
   ]
  )
  +(item.closebefore === true ? "" : closebtn),
  (item.inner ? item.inner : ""),inner
 );
 $(wrapper).attr("pf-counter",counter);
 $(wrapper).append(html);
 let addbtn=Get(outer+"-addbtn");
 addbtn.parentNode.removeChild(addbtn);
 let add=(item.add?item.add:faicon("fa-plus"));
 let addcss=(item.addcss?item.addcss:"form-extendable-add");
 $(wrapper).append( hrefbtn(add,"packFormExtendAdd('"+prefix+"','"+outer+"')",addcss,outer+"-addbtn") );
 jQueryForm( item.model, inner );
 if ( !calledDuringCreate ) scrollElement(Get(inner));
}

function enableByValue( ele ) {
	let item=ele.formitem;
	let n = (item.name?item.name:index);
	let i = ele.id;
	let p = (item.hint?item.hint:"");
	if ( !( item.type === 'radio'
      || item.type === 'select') ) return;
	if ( item.type === 'radio' ) {
  let value=null;
  let value_domid=null;
  let opt_list=[];
	 for ( let i=0; i<item.options.length; i++ ) {
 	 let domid=i+'-'+num;
		 opt_list[opt_list.length]=domid;
   let domlist;
   if ( is_array(item.options[i].enable) ) domlist=item.options[i].enable;
	  else { domlist=[]; domlist[0]=item.options[i].enable; }
   for(let i=0;i<domlist.length;i++) domlist[i]=item.prefix+'-'+slugify(domlist[i]);
	  if ( $(Get(domid)).is(':checked') || isChecked(Get(domid)) ) {
	  	value=i;
	  	value_domid=domid;
 	 	for(let j=0;j<domlist.length;j++){
  		 Get('#'+domlist[j]).prop("disabled",true);
  		 Get('#'+domlist[j]).removeAttr("disabled");
	 		}
		 } else {
		 	for ( let j=0; j<domlist.length; j++ ) Get('#'+domlist[j]).setAttribute("disabled",true);
		 }
	 }
	} else if ( item.type === 'select' ) {
	 let value=ele.selectedIndex;
	 let value_domid=value?(i+'-'+value):null;
	 let opt_list=[];
 	 for ( let i=0; i<item.options.length; i++ ) {
		  let domid=i+'-'+num;
		  opt_list[opt_list.length]=domid;
	   let domlist;
	   if ( is_array(item.options[i].enable) ) domlist=item.options[i].enable;
		  else { domlist=[]; domlist[0]=item.options[i].enable; }
	   for (let i=0;i<domlist.length;i++) domlist[i]=item.prefix+'-'+slugify(domlist[i]);
		  if ( value == i ) {
		 	for(let j=0;j<domlist.length;j++){
	 		 Get('#'+domlist[j]).prop("disabled",true);
	 		 Get('#'+domlist[j]).removeAttr("disabled");
 			}
		 } else {
    for ( let j=0; j<domlist.length; j++ ) Get('#'+domlist[j]).setAttribute("disabled",true);
		 }
	 }
	}
}

function revealByValue( ele ) {
	let item=ele.formitem;
	let n = (item.name?item.name:index);
	let id = ele.id;
	let p = (item.hint?item.hint:"");
	if ( !( item.type == 'radio' || item.type == 'select' ) ) return;
	if ( item.type == 'radio' ) {
  let value=null;
	 let value_domid=null;
	 let opt_list=[];
	 for ( let i=0; i<item.options.length; i++ ) {
		 let domid=id+'-'+i;
		 opt_list[opt_list.length]=domid;
 	 let domlist;
 	 if ( is_array(item.options[i].enable) ) domlist=item.options[i].enable;
		 else { domlist=[]; domlist[0]=item.options[i].enable; }
 	 for(let i=0;i<domlist.length;i++) domlist[i]=item.prefix+'-'+slugify(domlist[i]);
		 if ( $(Get(domid)).is(':checked') || isChecked(Get(domid)) ) {
 			value=i;
 			value_domid=domid;
 			for(let j=0;j<domlist.length;j++) $('#'+domlist[j]+'-wrapper').show();
		 } else {
 			for ( let j=0; j<domlist.length; j++ ) $('#'+domlist[j]+'-wrapper').hide();
		 }
	 }
	} else if ( item.type == 'select' ) {
	 let value=ele.selectedIndex;
	 let value_domid=value?(i+'-'+value):null;
	 let opt_list=[];
 	for ( let i=0; i<item.options.length; i++ ) {
		 let domid=id+'-'+i;
		 opt_list[opt_list.length]=domid;
	  let domlist;
	  if ( is_array(item.options[i].enable) ) domlist=item.options[i].enable;
		 else { domlist=[]; domlist[0]=item.options[i].enable; }
	  for(let i=0;i<domlist.length;i++) domlist[i]=item.prefix+'-'+slugify(domlist[i]);
		 if ( value == i ) {
 			for(let j=0;j<domlist.length;j++) $('#'+domlist[j]+'-wrapper').show();
		 } else {
 			for (let j=0; j<domlist.length; j++) $('#'+domlist[j]+'-wrapper').hide();
		 }
	 }
	}
}

// call to bind functions in jquery after packing the form and spewing it
function jQueryForm( model, prefix="jsapp-model" ) {
 model.forEach(function(item,index){
   item.prefix=prefix;
	  let n = (item.name?item.name:index);
	  let i = prefix+'-'+slugify(n);
	  let v = (item.value?item.value:"");
	  let p = (item.hint?item.hint:"");
   // extendable
   if ( item.type === 'extend' || item.type === 'extendable' ) {
    if ( defined(item.initial) && item.initial > 0 ) {
     let outer=i;
     for ( let x=0; x<item.initial; x++ ) { packFormExtendAdd(prefix,outer,true); }
    }
   } else {
    let ele=Get(i);
    if ( !ele ) { console.log("Warning: no valid element found by id "+i+" (index: "+index+")"); console.log(item); }
    ele.formitem=item;
    if ( item.tip ) {
     if ( is_string(item.tip) ) Tooltip(i,item.tip,"bottom");
     else if ( defined(item.tip.direction) && defined(item.tip.html) ) Tooltip(i,item.tip.html,item.tip.direction);
     else { console.log("Warning: item.tip did not have valid definition, requires {direction:'top', html:'<content>'} or 'string' for id "+i+" (index: "+index+")"); console.log(item); }
    }
    if ( item.hide ) $("#"+i).hide();
    if ( item.hover ) $("#"+i).hover(item.hover.enter,item.hover.leave);
    if ( item.click ) $("#"+i).click(item.click);
    if ( item.scroll ) $("#"+i).scroll(item.scroll);
    if ( item.toggle ) $("#"+i).toggle(item.toggle.even,item.toggle.odd);
    if ( item.select ) $("#"+i).select(item.select);
    if ( item.resize ) $("#"+i).resize(item.resize);
    if ( item.blur ) $("#"+i).blur(item.blur);
    if ( item.load ) $("#"+i).load(item.load);
    if ( item.unload ) $("#"+i).contextmenu(item.unload);
    if ( item.input ) $("#"+i).input(item.input);
    if ( item.menu ) $("#"+i).contextmenu(item.menu);
    if ( item.focus ) $("#"+i).focus(item.focus);
    if ( item.focusin ) $("#"+i).focusin(item.focusin);
    if ( item.focusout ) $("#"+i).focusout(item.focusout);
    if ( item.submit ) $("#"+i).submit(item.submit);
    if ( item.mousemove ) $("#"+i).mousemove(item.mousemove);
    if ( item.mouseenter ) $("#"+i).mouseenter(item.mouseenter);
    if ( item.mouseleave ) $("#"+i).mouseleave(item.mouseleave);
    if ( item.mouseover ) $("#"+i).mouseover(item.mouseover);
    if ( item.mouseout ) $("#"+i).mouseout(item.mouseout);
    if ( item.mousedown ) $("#"+i).mousedown(item.mousedown);
    if ( item.mouseup ) $("#"+i).mouseup(item.mouseup);
    if ( item.keyup ) $("#"+i).keyup(item.keyup);
    if ( item.keydown ) $("#"+i).keydown(item.keydown);
    if ( item.keypress ) $("#"+i).keypress(item.keypress);
    if ( item.change ) $("#"+i).change(item.change);
    // "on"	 
    if ( item.onmousemove ) $("#"+i).mousemove(item.onmousemove);
    if ( item.onmouseenter ) $("#"+i).mouseenter(item.onmouseenter);
    if ( item.onmouseleave ) $("#"+i).mouseleave(item.onmouseleave);
    if ( item.onmouseover ) $("#"+i).mouseover(item.onmouseover);
    if ( item.onmouseout ) $("#"+i).mouseout(item.onmouseout);
    if ( item.onmousedown ) $("#"+i).mousedown(item.onmousedown);
    if ( item.onmouseup ) $("#"+i).mouseup(item.onmouseup);
    if ( item.onkeydown ) $("#"+i).keydown(item.onkeydown);
    if ( item.onkeypress ) $("#"+i).keypress(item.onkeypress);
    if ( item.onkeyup ) $("#"+i).keyup(item.onkeyup);
    if ( item.onchange ) $("#"+i).change(item.onchange);
    if ( item.oninput ) $("#"+i).input(item.oninput);
    if ( item.contextmenu ) $("#"+i).contextmenu(item.contextmenu);
    if ( item.type === "markdown" ) {
     console.log("woofmarking "+i);
     item.live=woofmark(Get(i),{
      parseMarkdown: function (input) {
       return megamark(input, {
        tokenizers: [{
         token: /(^|\s)@([A-z]+)\b/g,
         transform: function (all, separator, id) { return separator + '<a href="/users/' + id + '">@' + id + '</a>'; }
        }]
       });
      },
      parseHTML: function (input) {
       return domador(input, {
        transform: function (el) {if (el.tagName === 'A' && el.innerHTML[0] === '@') { return el.innerHTML; } }
       });
      },
      fencing: true,
      html: false,
      wysiwyg: true,
      defaultMode: 'wysiwyg'
     });
   }
   // enable,reveal expects "domid" or ["domid","domid2"...]
   if ( item.type == 'toggle' ) {
    if ( item.enable ) {
     let domlist;
     if ( is_array(item.enable) ) domlist=item.enable;
     else { domlist=[]; domlist[0]=item.enable; }
     let ele=Get(i);
     for(let k=0;k<domlist.length;k++) domlist[k]=prefix+'-'+slugify(domlist[k]);
     ele.domlist=domlist;
     $(ele).toggle(
      function(e){for(let i=0;i<this.domlist.length;i++){$('#'+this.domlist[i]).setAttribute("disabled",true);}},
      function(e){for(let i=0;i<this.domlist.length;i++){$('#'+this.domlist[i]).prop("disabled",true);$(this.domlist[i]).removeAttr("disabled");}}
     );
     $(ele).click(function(e){
   	  console.log(this);
   	  if ( ($(this).is(":checked") || isChecked(this)) ) {
   	 	for(let i=0;i<this.domlist.length;i++){$('#'+this.domlist[i]).setAttribute("disabled",true);} 
   	 	if (this.formitem.toggle && this.formitem.toggle.even) this.formitem.toggle.even(); 
   	  } else {
   	 	for(let i=0;i<this.domlist.length;i++){$('#'+this.domlist[i]).prop("disabled",true);$(this.domlist[i]).removeAttr("disabled");}
   	 	if (this.formitem.toggle && this.formitem.toggle.odd) this.formitem.toggle.odd(); 
   	  }			 
   	 });		 
     if ( istrue(item.value) ) {
    	 for(let k=0;k<domlist.length;k++){Get(domlist[k]).setAttribute("disabled",true);}
     } else {
   	  for(let k=0;k<domlist.length;k++){Get(domlist[k]).prop("disabled",true);Get('#'+domlist[k]).removeAttr("disabled");}
     }
    }
    if ( item.reveal ) {
     let domlist;
     if ( is_array(item.reveal) ) domlist=item.reveal;
     else { domlist=[]; domlist[0]=item.reveal; }
     console.log(domlist);
     let ele=Get(i);
     for(let k=0;k<domlist.length;k++) domlist[k]=prefix+'-'+slugify(domlist[k]);
     ele.domlist=domlist;
     $(ele).toggle(
     	function(e){console.log("even");for(let m=0;m<this.domlist.length;m++){$(this.domlist[m]).show();} if (this.formitem.toggle && this.formitem.toggle.even) this.formitem.toggle.even(); },
      function(e){console.log("odd"); for(let m=0;m<this.domlist.length;m++){$(this.domlist[m]).hide();} if (this.formitem.toggle && this.formitem.toggle.odd) this.formitem.toggle.odd(); }
     );
     $(ele).click(function(e){
   	  if ( ($(this).is(":checked") || isChecked(this)) ) {
   	 	for(let k=0;k<this.domlist.length;k++){$(Get(this.domlist[k]+'-wrapper')).show();} 
   	 	if (this.formitem.toggle && this.formitem.toggle.even) this.formitem.toggle.even(); 
   	  } else {
   	 	for(let k=0;k<this.domlist.length;k++){$(Get(this.domlist[k]+'-wrapper')).hide();}
   	 	if (this.formitem.toggle && this.formitem.toggle.odd) this.formitem.toggle.odd(); 
   	  }			 
     });
     if ( istrue(item.value) ) {
   	  for(let k=0;k<domlist.length;k++){$(Get(domlist[k]+'-wrapper')).show();}
     } else {
   	  for(let k=0;k<domlist.length;k++){$(Get(domlist[k]+'-wrapper')).hide();}
     }
    }
   }
   // enable or reveal appear inside the options list
   // enable,reveal expects [] of { value:"triggervalue", elements: "domid" or ["domid","domid"] }
   if ( item.type == 'radio' ) {
    if ( item.enable ) {
     for ( let k=0; k<item.options.length; k++ ) {
      let opt_i = k+'-'+num;
      let opt_ele=Get(opt_i);
      opt_ele.formitem=item;
      $(opt_ele).change( function(e){ enableByValue(this); } );
      if ( $(opt_ele).is(':checked') ) enableByValue(opt_ele);
   	 }
    }
    if ( item.reveal ) {
     for ( let i=0; k<item.options.length; k++ ) {
      let opt_i = k+'-'+num;
      let opt_ele=Get(opt_i);
      opt_ele.formitem=item;
      $(opt_ele).change( function(e){ revealByValue(this); } );
      if ( $(opt_ele).is(':checked') ) revealByValue(opt_ele);
     }
    }
   }
   // enable or reveal appear inside the options list
   // enable,reveal expects [] of { value:"triggervalue", elements: "domid" or ["domid","domid"] }
   if ( item.type == 'select' ) {
    if ( item.enable ) for ( let k=0; k<item.options.length; k++ ) $(ele).change( function(e){ enableByValue(this); } );
    if ( item.reveal ) for ( let k=0; k<item.options.length; k++ ) $(ele).change( function(e){ revealByValue(this); } );
    $(ele).trigger('change');
   }
  }
 });
}

function FormErr(item,model,prefix) {
 if ( item.onrequired ) item.onrequired(item,model,prefix);
 return { error: 'form requirement not met', message: (isString(item.required) ? item.required : (n+' cannot be blank.')) };
}

// Get the data out of a packed form
function UnpackForm( model, prefix="jsapp-model" ) {
 let data={};
 console.log("Unpacking: ");
 console.log(model);
 model.forEach(function(item,index){
	 let n = (item.name?item.name:index);
	 let i = prefix+'-'+slugify(n);
	 let v = ( item.type == "toggle" ) ? ($('#'+i).is(':checked')?1:0) :
             ( item.type == "markdown" ) ? (item.live.value()) :
			 $("#"+i).val();
//  console.log(n+"("+i+")="+v);
	 if ( item.required ) {
		 if ( item.type == "string" && v.length < 1 ) return FormErr(item,model,prefix);
		 else if ( item.type == "color" && v.length < 1 ) return FormErr(item,model,prefix);
		 else if ( item.type == "date" && v.length < 1 ) return FormErr(item,model,prefix);
		 else if ( item.type == "toggle" && isfalse(v) ) return FormErr(item,model,prefix);
		 else if ( (item.type === "integer" || item.type == "decimal" || item.type == "number" || item.type == "money" )
          && (item.range && beyond_range(v,item.range.min,item.range.max)) ) return FormErr(item,model,prefix);
	 }
  if ( item.type == "extend" || item.type == "extendable" ) {
   let unpacked=[];
   let outer=i;
   let wrapper=Get(outer);
   let inners=$(wrapper).children().each(function(index){
    let pre=$(this).attr("id");
    if ( !pre.endsWith("addbtn") ) unpacked[unpacked.length]=UnpackForm(item.model,pre);
   });
   data[n]=unpacked;
  } else
	 if ( !(item.type == 'h1'      || item.type == 'h2'
	    || item.type == 'h3'	      || item.type == 'h4'
	    || item.type == 'h5'       || item.type == 'h6'
	    || item.type == 'span'     || item.type == 'div'
	    || item.type == 'p') ) {
			data[n] = v;
	 }
 });
// console.log("UnpackForm:data:");
// console.log(data);
 return data;
}

// HTML helpers

// One or more non-breaking spaces
function nbsp( count=1 ) {
 let s="";
 for ( let i=0; i<count; i++ ) s+="&nbsp;";
 return s;
}

// Fontawesome Icon
function faicon( css=null, tip=null, inner="", id=null, style=null, click=null ) {
 let s='<i';
 if ( tip ) s+= ' alt="'
 if ( id ) s+=' id="'+id+'"';
 if ( css ) s+=' class="fa '+css+'"';
 if ( style ) s+=' style="'+style+'"';
 if ( click ) s+=' onclick="javascript:'+click+'"';
 s+='>';
 return s+inner+'</i>';
}

// <I> as an icon tag
function icon( css=null, tip=null, inner="", id=null, style=null, click=null ) {
 let s='<i';
 if ( tip ) s+= ' alt="'
 if ( id ) s+=' id="'+id+'"';
 if ( css ) s+=' class="'+css+'"';
 if ( style ) s+=' style="'+style+'"';
 if ( click ) s+=' onclick="javascript:'+click+'"';
 s+='>';
 return s+inner+'</i>';
}

// Href as a button
function hrefbtn( inner="", click=null, css=null, id=null, style=null, other=null ) {
 let s='<a href="#" ';
 if ( id ) s+=' id="'+id+'"';
 if ( css ) s+=' class="'+css+'"';
 if ( style ) s+=' style="'+style+'"';
 if ( click ) s+=' onclick="javascript:'+click+'"';
 if ( other ) { if ( is_array(other) ) { for ( let i=0; i<other.length; i++ ) s+=' '+other[i].name+'="'+other[i].value+'"'; } else s+=other; }
 s+='>';
 return s+inner+'</a>';
}

// Form input elements (and datalist)
function input( id=null, type="text", placeholder=null, css=null, style=null, value=null, min=null, max=null, datalist=null, disabled=null, other=null ) {
 let s='<input type="'+type+'"';
 if ( id ) s+=' id="'+id+'"';
 if ( css ) s+=' class="'+css+'"';
 if ( style ) s+=' style="'+style+'"';
 if ( placeholder ) s+=' placeholder="'+placeholder+'"';
 if ( disabled ) s+=' disabled=disabled';
 if ( value ) s+=' value="'+value+'"';
 if ( min ) s+=' min="'+min+'"'; else if ( max ) s+=' min="none"';
 if ( max ) s+=' max="'+max+'"'; else if ( min ) s+=' max="none"';
 let after="";
 if ( datalist && is_array(datalist) && datalist.length > 0 ) {
  s+=' list="'+id+'-datalist"';
  after+='<datalist id="'+id+'-datalist">';
  for ( let i=0; i<datalist.length; i++ ) {
   after+='<option value="'+datalist[i]+'">';
  }
  after+='</datalist>';
 }
 if ( other ) { if ( is_array(other) ) { for ( let i=0; i<other.length; i++ ) s+=' '+other[i].name+'="'+other[i].value+'"'; } else s+=other; }
 return s+' />'+after; 
}

// A button
function button( inner="", click=null, css=null, id=null, style=null, other=null ) {
 let s='<button';
 if ( id ) s+=' id="'+id+'"';
 if ( css ) s+=' class="'+css+'"';
 if ( style ) s+=' style="'+style+'"';
 if ( click ) s+=' onclick="javascript:'+click+'"';
 if ( other ) { if ( is_array(other) ) { for ( let i=0; i<other.length; i++ ) s+=' '+other[i].name+'="'+other[i].value+'"'; } else s+=other; }
 s+='>';
 return s+inner+'</button>';
}

// p
function p( inner="", css=null, id=null, style=null, click=null, other=null ) {
 let s='<p';
 if ( id ) s+=' id="'+id+'"';
 if ( css ) s+=' class="'+css+'"';
 if ( style ) s+=' style="'+style+'"';
 if ( click ) s+=' onclick="javascript:'+click+'"';
 if ( other ) { if ( is_array(other) ) { for ( let i=0; i<other.length; i++ ) s+=' '+other[i].name+'="'+other[i].value+'"'; } else s+=other; }
 s+='>';
 return s+inner+'</p>';
}

// Heading 6
function h6( inner="", css=null, id=null, style=null, click=null, other=null ) {
 let s='<h6';
 if ( id ) s+=' id="'+id+'"';
 if ( css ) s+=' class="'+css+'"';
 if ( style ) s+=' style="'+style+'"';
 if ( click ) s+=' onclick="javascript:'+click+'"';
 s+='>';
 if ( other ) { if ( is_array(other) ) { for ( let i=0; i<other.length; i++ ) s+=' '+other[i].name+'="'+other[i].value+'"'; } else s+=other; }
 return s+inner+'</h6>';
}

// Heading 5
function h5( inner="", css=null, id=null, style=null, click=null, other=null ) {
 let s='<h5';
 if ( id ) s+=' id="'+id+'"';
 if ( css ) s+=' class="'+css+'"';
 if ( style ) s+=' style="'+style+'"';
 if ( click ) s+=' onclick="javascript:'+click+'"';
 if ( other ) { if ( is_array(other) ) { for ( let i=0; i<other.length; i++ ) s+=' '+other[i].name+'="'+other[i].value+'"'; } else s+=other; }
 s+='>';
 return s+inner+'</h5>';
}

// Heading 4
function h4( inner="", css=null, id=null, style=null, click=null, other=null ) {
 let s='<h4';
 if ( id ) s+=' id="'+id+'"';
 if ( css ) s+=' class="'+css+'"';
 if ( style ) s+=' style="'+style+'"';
 if ( click ) s+=' onclick="javascript:'+click+'"';
 if ( other ) { if ( is_array(other) ) { for ( let i=0; i<other.length; i++ ) s+=' '+other[i].name+'="'+other[i].value+'"'; } else s+=other; }
 s+='>';
 return s+inner+'</h4>';
}

// Heading 3
function h3( inner="", css=null, id=null, style=null, click=null, other=null ) {
 let s='<h3';
 if ( id ) s+=' id="'+id+'"';
 if ( css ) s+=' class="'+css+'"';
 if ( style ) s+=' style="'+style+'"';
 if ( click ) s+=' onclick="javascript:'+click+'"';
 if ( other ) { if ( is_array(other) ) { for ( let i=0; i<other.length; i++ ) s+=' '+other[i].name+'="'+other[i].value+'"'; } else s+=other; }
 s+='>';
 return s+inner+'</h3>';
}

// Heading 2
function h2( inner="", css=null, id=null, style=null, click=null, other=null ) {
 let s='<h2';
 if ( id ) s+=' id="'+id+'"';
 if ( css ) s+=' class="'+css+'"';
 if ( style ) s+=' style="'+style+'"';
 if ( click ) s+=' onclick="javascript:'+click+'"';
 if ( other ) { if ( is_array(other) ) { for ( let i=0; i<other.length; i++ ) s+=' '+other[i].name+'="'+other[i].value+'"'; } else s+=other; }
 s+='>';
 return s+inner+'</h2>';
}

// Heading 1
function h1( inner="", css=null, id=null, style=null, click=null, other=null ) {
 let s='<h1';
 if ( id ) s+=' id="'+id+'"';
 if ( css ) s+=' class="'+css+'"';
 if ( style ) s+=' style="'+style+'"';
 if ( click ) s+=' onclick="javascript:'+click+'"';
 if ( other ) { if ( is_array(other) ) { for ( let i=0; i<other.length; i++ ) s+=' '+other[i].name+'="'+other[i].value+'"'; } else s+=other; }
 s+='>';
 return s+inner+'</h1>';
}

// small tag
function small( inner="", css=null, id=null, style=null, click=null, other=null ) {
 let s='<small';
 if ( id ) s+=' id="'+id+'"';
 if ( css ) s+=' class="'+css+'"';
 if ( style ) s+=' style="'+style+'"';
 if ( click ) s+=' onclick="javascript:'+click+'"';
 if ( other ) { if ( is_array(other) ) { for ( let i=0; i<other.length; i++ ) s+=' '+other[i].name+'="'+other[i].value+'"'; } else s+=other; }
 s+='>';
 return s+inner+'</small>';
}

// span tag
function span( inner="", css=null, id=null, style=null, click=null, other=null ) {
 let s='<span';
 if ( id ) s+=' id="'+id+'"';
 if ( css ) s+=' class="'+css+'"';
 if ( style ) s+=' style="'+style+'"';
 if ( click ) s+=' onclick="javascript:'+click+'"';
 if ( other ) { if ( is_array(other) ) { for ( let i=0; i<other.length; i++ ) s+=' '+other[i].name+'="'+other[i].value+'"'; } else s+=other; }
 s+='>';
 return s+inner+'</span>';
}

// div tag
function div( inner="", css=null, id=null, style=null, click=null, other=null ) {
 let s='<div';
 if ( id ) s+=' id="'+id+'"';
 if ( css ) s+=' class="'+css+'"';
 if ( style ) s+=' style="'+style+'"';
 if ( click ) s+=' onclick="javascript:'+click+'"';
 if ( other ) { if ( is_array(other) ) { for ( let i=0; i<other.length; i++ ) s+=' '+other[i].name+'="'+other[i].value+'"'; } else s+=other; }
 s+='>';
 return s+inner+'</div>';
}


// table, tr, th, td, td_ (multi-span)

function thead( inner="", css=null, id=null, style=null, click=null, other=null ) {
 let s='<thead';
 if ( id ) s+=' id="'+id+'"';
 if ( css ) s+=' class="'+css+'"';
 if ( style ) s+=' style="'+style+'"';
 if ( click ) s+=' onclick="javascript:'+click+'"';
 if ( other ) { if ( is_array(other) ) { for ( let i=0; i<other.length; i++ ) s+=' '+other[i].name+'="'+other[i].value+'"'; } else s+=other; }
 s+='>';
 return s+inner+'</thead>'; 
}

function tbody( inner="", css=null, id=null, style=null, click=null, other=null ) {
 let s='<tbody';
 if ( id ) s+=' id="'+id+'"';
 if ( css ) s+=' class="'+css+'"';
 if ( style ) s+=' style="'+style+'"';
 if ( click ) s+=' onclick="javascript:'+click+'"';
 if ( other ) { if ( is_array(other) ) { for ( let i=0; i<other.length; i++ ) s+=' '+other[i].name+'="'+other[i].value+'"'; } else s+=other; }
 s+='>';
 return s+inner+'</tbody>'; 
}

function tfoot( inner="", css=null, id=null, style=null, click=null, other=null ) {
 let s='<tfoot';
 if ( id ) s+=' id="'+id+'"';
 if ( css ) s+=' class="'+css+'"';
 if ( style ) s+=' style="'+style+'"';
 if ( click ) s+=' onclick="javascript:'+click+'"';
 if ( other ) { if ( is_array(other) ) { for ( let i=0; i<other.length; i++ ) s+=' '+other[i].name+'="'+other[i].value+'"'; } else s+=other; }
 s+='>';
 return s+inner+'</tfoot>'; 
}

function table( body="", head="", foot="", css=null, id=null, style=null, other=null ) {
 let s='<table';
 if ( id ) s+=' id="'+id+'"';
 if ( css ) s+=' class="'+css+'"';
 if ( style ) s+=' style="'+style+'"';
 if ( other ) { if ( is_array(other) ) { for ( let i=0; i<other.length; i++ ) s+=' '+other[i].name+'="'+other[i].value+'"'; } else s+=other; }
 s+=' cellpadding=0 cellspacing=0>';
 return s+(head && head.length>0?thead(head):"")+(body && body.length >0?tbody(body):"")+(foot && foot.length>0?tfoot(foot):"")+'</table>'; 
}

function th( inner="", css=null, id=null, style=null, click=null, other=null ) {
 let s='<th';
 if ( id ) s+=' id="'+id+'"';
 if ( css ) s+=' class="'+css+'"';
 if ( style ) s+=' style="'+style+'"';
 if ( click ) s+=' onclick="javascript:'+click+'"';
 if ( other ) { if ( is_array(other) ) { for ( let i=0; i<other.length; i++ ) s+=' '+other[i].name+'="'+other[i].value+'"'; } else s+=other; }
 s+='>';
 return s+inner+'</th>'; 
}

function tr( inner="", css=null, id=null, style=null, click=null, other=null ) {
 let s='<tr';
 if ( id ) s+=' id="'+id+'"';
 if ( css ) s+=' class="'+css+'"';
 if ( style ) s+=' style="'+style+'"';
 if ( click ) s+=' onclick="javascript:'+click+'"';
 if ( other ) { if ( is_array(other) ) { for ( let i=0; i<other.length; i++ ) s+=' '+other[i].name+'="'+other[i].value+'"'; } else s+=other; }
 s+='>';
 return s+inner+'</tr>'; 
}

function td( inner="", width=null, css=null, id=null, style=null, click=null, other=null ) {
 let s='<td';
 if ( width ) s+=' width="'+width+'"';
 if ( id ) s+=' id="'+id+'"';
 if ( css ) s+=' class="'+css+'"';
 if ( style ) s+=' style="'+style+'"';
 if ( click ) s+=' onclick="javascript:'+click+'"';
 if ( other ) { if ( is_array(other) ) { for ( let i=0; i<other.length; i++ ) s+=' '+other[i].name+'="'+other[i].value+'"'; } else s+=other; }
 s+='>';
 return s+inner+'</td>'; 
}

function td_( columns, inner="", css=null, id=null, style=null, click=null, other=null ) {
 let s='<td colspan='+columns;
 if ( id ) s+=' id="'+id+'"';
 if ( css ) s+=' class="'+css+'"';
 if ( style ) s+=' style="'+style+'"';
 if ( click ) s+=' onclick="javascript:'+click+'"';
 if ( other ) { if ( is_array(other) ) { for ( let i=0; i<other.length; i++ ) s+=' '+other[i].name+'="'+other[i].value+'"'; } else s+=other; }
 s+='>';
 return s+inner+'</td>'; 
}

// canvas tag
function canvas( id=null, style=null, css=null, other=null ) {
 let s='<canvas';
 if ( id ) s+=' id="'+id+'"';
 if ( css ) s+=' class="'+css+'"';
 if ( style ) s+=' style="'+style+'"';
 if ( other ) { if ( is_array(other) ) { for ( let i=0; i<other.length; i++ ) s+=' '+other[i].name+'="'+other[i].value+'"'; } else s+=other; }
 s+='>';
 return s+'</canvas>';
}

// ol tag
function ol( inner="", css=null, id=null, style=null, click=null, other=null ) {
 let s='<ol';
 if ( id ) s+=' id="'+id+'"';
 if ( css ) s+=' class="'+css+'"';
 if ( style ) s+=' style="'+style+'"';
 if ( click ) s+=' onclick="javascript:'+click+'"';
 if ( other ) { if ( is_array(other) ) { for ( let i=0; i<other.length; i++ ) s+=' '+other[i].name+'="'+other[i].value+'"'; } else s+=other; }
 s+='>';
 return s+inner+'</ol>';
}

// ul tag
function ul( inner="", css=null, id=null, style=null, click=null, other=null ) {
 let s='<ul';
 if ( id ) s+=' id="'+id+'"';
 if ( css ) s+=' class="'+css+'"';
 if ( style ) s+=' style="'+style+'"';
 if ( click ) s+=' onclick="javascript:'+click+'"';
 if ( other ) { if ( is_array(other) ) { for ( let i=0; i<other.length; i++ ) s+=' '+other[i].name+'="'+other[i].value+'"'; } else s+=other; }
 s+='>';
 return s+inner+'</ul>';
}

// li tag
function li( inner="", css=null, id=null, style=null, click=null, other=null ) {
 let s='<li';
 if ( id ) s+=' id="'+id+'"';
 if ( css ) s+=' class="'+css+'"';
 if ( style ) s+=' style="'+style+'"';
 if ( click ) s+=' onclick="javascript:'+click+'"';
 if ( other ) { if ( is_array(other) ) { for ( let i=0; i<other.length; i++ ) s+=' '+other[i].name+'="'+other[i].value+'"'; } else s+=other; }
 s+='>';
 return s+inner+'</li>';
}

// center tag
function center( inner="", css=null, id=null, style=null, click=null, other=null ) {
 let s='<center';
 if ( id ) s+=' id="'+id+'"';
 if ( css ) s+=' class="'+css+'"';
 if ( style ) s+=' style="'+style+'"';
 if ( click ) s+=' onclick="javascript:'+click+'"';
 if ( other ) { if ( is_array(other) ) { for ( let i=0; i<other.length; i++ ) s+=' '+other[i].name+'="'+other[i].value+'"'; } else s+=other; }
 s+='>';
 return s+inner+'</center>';
}
