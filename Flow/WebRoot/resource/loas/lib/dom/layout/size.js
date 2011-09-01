/***************************************************************
size.js
about elements layout -- size
****************************************************************/
//ensure that we has provided this resource so it wont be downloaded again.
require.provide("lib.dom.layout.size");
//require resource
require("lib.dom.engin");

WIN.extend(EL,{
	/*
	():
		EL.height(e[,h])
	DES:
		get||set element scroll height except margin
	ARG:
		e: id string or object reference
		h: num
	RTN:
		num height
	*/
  height :function (e,h){
    if(!(e=$(e)))return 0;
    if(!isNaN(h)){
      if(h<0)h=0;
      else h=Math.round(h);
    }else h=-1;
    var css=WIN.isDefined(e.style);
    if(EL.isClientNode(e)){
      h=DOC.getClientHeight();
    }else if(css&&WIN.isDefined(e.offsetHeight)&&WIN.isString(e.style.height)){
      if(h>=0){
        var pt=0,pb=0,bt=0,bb=0;
        if(document.compatMode=='CSS1Compat'){
          var gcs=EL.getCssVal;
          pt=gcs(e,'padding-top',1);
          if(pt!==null){
            pb=gcs(e,'padding-bottom',1);
            bt=gcs(e,'border-top-width',1);
            bb=gcs(e,'border-bottom-width',1);
          }else if(WIN.isDefinedAll(e.offsetHeight,e.style.height)){
            e.style.height=h+'px';
            pt=e.offsetHeight-h;
          }  
        }
        h -=(pt+pb+bt+bb);  
        if(isNaN(h)||h<0)  return;
        else e.style.height=h+'px';
      }
      h = e.offsetHeight;
    }else if(css&&WIN.isDefined(e.style.pixelHeight)){    
      if(h>=0)e.style.pixelHeight=h;
      h = e.style.pixelHeight;
    }
    return h;
  },
	/*
	():
		EL.setSize(e, uW, uH)
	DES:
		set element Size.
	ARG:
		e: id string or element reference
		uW: unsigned integer width
		uH: unsigned integer height
	*/
	setSize :function (e, w, h){
		EL.width(e,w);
		EL.height(e,h);
	},
	/*
	():
		EL.width(e[,w])
	DES:
		get||set element scroll width except margin
	ARG:
		e: id string or object reference
		h: num
	RTN:
		num width
	*/
  width :function (e,w){
    if(!(e=$(e)))return 0;
    if(!isNaN(w)){
      if(w<0)w=0;
      else w=Math.round(w);
    }else w=-1;
    var css=WIN.isDefined(e.style);
    if(EL.isClientNode(e)){
      w=DOC.getClientWidth();
    }else if(css&&WIN.isDefined(e.offsetWidth)&&WIN.isString(e.style.width)){
      if(w>=0){
        var pl=0,pr=0,bl=0,br=0;
        if(document.compatMode=='CSS1Compat'){
          var gcs=EL.getCssVal;
          pl=gcs(e,'padding-left',1);
          if(pl!==null){
            pr=gcs(e,'padding-right',1);
            bl=gcs(e,'border-left-width',1);
            br=gcs(e,'border-right-width',1);
          }else if(WIN.isDefinedAll(e.offsetWidth,e.style.width)){
            e.style.width=w+'px';
            pl=e.offsetWidth-w;
          }
        }
        w-=(pl+pr+bl+br);
        if(isNaN(w)||w<0)  return;
        else e.style.width=w+'px';
      }
      w=e.offsetWidth;
    }else if(css&&WIN.isDefined(e.style.pixelWidth)){
      if(w>=0)e.style.pixelWidth=w;
      w=e.style.pixelWidth;
    }
    return w;
  }
});
