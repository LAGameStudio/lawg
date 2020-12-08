 var brights = ["Aqua","Aquamarine","Black","Blue","BlueViolet","Brown","BurlyWood","CadetBlue","Chartreuse",
 "Chocolate","Coral","CornflowerBlue","Crimson","Cyan","DarkBlue","DarkCyan","DarkGoldenRod","DarkGray","DarkGrey",
 "DarkGreen","DarkKhaki","DarkMagenta","DarkOliveGreen","DarkOrange","DarkOrchid","DarkRed","DarkSalmon",
 "DarkSeaGreen","DarkSlateBlue","DarkSlateGray","DarkSlateGrey","DarkTurquoise","DarkViolet","DeepPink",
 "DeepSkyBlue","DimGray","DimGrey","DodgerBlue","FireBrick","ForestGreen","Fuchsia","Gainsboro","Gold","GoldenRod",
 "Gray","Grey","Green","GreenYellow","HotPink","IndianRed","Indigo","Khaki","Lavender",
 "LawnGreen","LightBlue","LightCoral","LightCyan","LightGoldenRodYellow",
 "LightGray","LightGrey","LightGreen","LightPink","LightSalmon","LightSeaGreen","LightSkyBlue","LightSlateGray",
 "LightSlateGrey","LightSteelBlue","Lime","LimeGreen","Magenta","Maroon","MediumAquaMarine",
 "MediumBlue","MediumOrchid","MediumPurple","MediumSeaGreen","MediumSlateBlue","MediumSpringGreen","MediumTurquoise",
 "MediumVioletRed","MidnightBlue","MintCream","MistyRose","Moccasin","NavajoWhite","Navy","Olive",
 "OliveDrab","Orange","OrangeRed","Orchid","PaleGoldenRod","PaleGreen","PaleTurquoise","PaleVioletRed","PapayaWhip",
 "PeachPuff","Peru","Pink","Plum","PowderBlue","Purple","RebeccaPurple","Red","RosyBrown","RoyalBlue","SaddleBrown",
 "Salmon","SandyBrown","SeaGreen","Sienna","Silver","SkyBlue","SlateBlue","SlateGray","SlateGrey",
 "SpringGreen","SteelBlue","Tan","Teal","Thistle","Tomato","Turquoise","Violet","Wheat","Yellow",
 "YellowGreen"];
 
function GetCSSColor( seed ) { return (""+brights[seed%brights.length]).trim(); }

class Crayon {
 construct( r, g=null, b=null, a=null ) {
  this.Set(r,g,b,a);
 }
 Set( r, g=null, b=null, a=null ) {
  if ( !g && !b && !a ) {
   if ( is_int(r) ) this.value=new tinycolor({r:r,g:r,b:r});
   else this.value=new tinycolor(r);
  } else if ( g && b && !a ) {
   if ( is_int(r) && is_int(g) && is_int(b) ) this.value=new tinycolor({r:r,g:g,b:b});
   else this.value=tinycolor.fromRatio({r:r,g:g,b:b});
  } else if ( g && b && a ) {
   if ( is_int(r) && is_int(g) && is_int(b) && is_int(a) ) this.value=new tinycolor({r:r,g:g,b:b,a:a});
   else this.value=tinycolor.fromRatio({r:r,g:g,b:b,a:a});
  }
 }
};
