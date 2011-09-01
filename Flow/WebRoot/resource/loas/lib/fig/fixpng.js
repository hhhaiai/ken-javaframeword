//For fix Internet explorer <6 png24 no alpha.
function fixPNG(img){
	if (IEversion > 0 && IEversion < 7)
	{
		var myImage = document.getElementById(img);
		if(myImage) {
			myImage.style.filter = "progid:DXImageTransform.Microsoft.AlphaImageLoader(src='" + myImage.src + "', sizingMethod='scale')";
			myImage.src = 'index.php?extern=apps/eyeX/gfx/spacer.gif';
		}
	}
}
