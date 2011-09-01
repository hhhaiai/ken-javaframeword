/* box.js
about elements layout -- position
*/
require.provide("lib.dom.layout.box");
require("lib.dom.engin");
require("lib.dom.layout.size");
require("lib.dom.layout.position");

WIN.extend(EL,{
	/*
	():
		EL.hasPoint(e, iLeft, iTop[, iClpT[, iClpR[, iClpB[, iClpL]]]])
	DES:
		Determines if an element contains an absolute point. The element's boundary is extended (negative clip), or contracted (positive clip) by the clipping parameters.
	ARG:
		e: An ID string or object reference.
		
		iLeft,iTop: An absolute point.
		
		iClpT: Clip top. If not of type 'number' (if only 3 arguments) then t=r=b=l=0;
		
		iClpR: Clip right. If not of type 'number' (if only 4 arguments) then r=b=l=t;
		
		iClpB: Clip bottom. If not of type 'number' (if only 5 arguments) then l=r; b=t;
		
		iClpL: Clip left.
	RTN:
		boolean
	*/
	hasPoint     :function (e,x,y,t,r,b,l){
		if(isNaN(t)){
			t=r=b=l=0;
		}else if(isNaN(r)){
			r=b=l=t;
		}else if(isNaN(b)){
			l=r;
			b=t;
		}
		var eX=EL.getPageX(e),eY=EL.getPageY(e);
		return (x >= eX+l && x <= eX + EL.width(e) - r && y >= eY + t && y <= eY + EL.height(e)-b);
	}
});