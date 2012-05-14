﻿/*
Copyright 2011, AUTHORS.txt (http://ui.operamasks.org/about)
Dual licensed under the MIT or LGPL Version 2 licenses.
*/

/**
 * @fileOverview Defines the {@link OMEDITOR.env} object, which constains
 *		environment and browser information.
 */

if ( !OMEDITOR.env )
{
	/**
	 * @namespace Environment and browser information.
	 */
	OMEDITOR.env = (function()
	{
		var agent = navigator.userAgent.toLowerCase();
		var opera = window.opera;

		var env =
		/** @lends OMEDITOR.env */
		{
			/**
			 * Indicates that OMEditor is running on Internet Explorer.
			 * @type Boolean
			 * @example
			 * if ( OMEDITOR.env.ie )
			 *     alert( "I'm on IE!" );
			 */
			ie		: /*@cc_on!@*/false,

			/**
			 * Indicates that OMEditor is running on Opera.
			 * @type Boolean
			 * @example
			 * if ( OMEDITOR.env.opera )
			 *     alert( "I'm on Opera!" );
			 */
			opera	: ( !!opera && opera.version ),

			/**
			 * Indicates that OMEditor is running on a WebKit based browser, like
			 * Safari.
			 * @type Boolean
			 * @example
			 * if ( OMEDITOR.env.webkit )
			 *     alert( "I'm on WebKit!" );
			 */
			webkit	: ( agent.indexOf( ' applewebkit/' ) > -1 ),

			/**
			 * Indicates that OMEditor is running on Adobe AIR.
			 * @type Boolean
			 * @example
			 * if ( OMEDITOR.env.air )
			 *     alert( "I'm on AIR!" );
			 */
			air		: ( agent.indexOf( ' adobeair/' ) > -1 ),

			/**
			 * Indicates that OMEditor is running on Macintosh.
			 * @type Boolean
			 * @example
			 * if ( OMEDITOR.env.mac )
			 *     alert( "I love apples!" );
			 */
			mac	: ( agent.indexOf( 'macintosh' ) > -1 ),

			/**
			 * Indicates that OMEditor is running on a quirks mode environemnt.
			 * @type Boolean
			 * @example
			 * if ( OMEDITOR.env.quirks )
			 *     alert( "Nooooo!" );
			 */
			quirks : ( document.compatMode == 'BackCompat' ),

			/**
			 * Indicates that OMEditor is running on a mobile like environemnt.
			 * @type Boolean
			 * @example
			 * if ( OMEDITOR.env.mobile )
			 *     alert( "I'm running with OMEditor today!" );
			 */
			mobile : ( agent.indexOf( 'mobile' ) > -1 ),

			/**
			 * Indicates that the browser has a custom domain enabled. This has
			 * been set with "document.domain".
			 * @returns {Boolean} "true" if a custom domain is enabled.
			 * @example
			 * if ( OMEDITOR.env.isCustomDomain() )
			 *     alert( "I'm in a custom domain!" );
			 */
			isCustomDomain : function()
			{
				if ( !this.ie )
					return false;

				var domain = document.domain,
					hostname = window.location.hostname;

				return domain != hostname &&
					domain != ( '[' + hostname + ']' );	// IPv6 IP support (#5434)
			},

			/**
			 * Indicates that page is running under an encrypted connection.
			 * @returns {Boolean} "true" if the page has an encrypted connection.
			 * @example
			 * if ( OMEDITOR.env.secure )
			 *     alert( "I'm in SSL!" );
			 */
			secure : location.protocol == 'https:'
		};

		/**
		 * Indicates that OMEditor is running on a Gecko based browser, like
		 * Firefox.
		 * @name OMEDITOR.env.gecko
		 * @type Boolean
		 * @example
		 * if ( OMEDITOR.env.gecko )
		 *     alert( "I'm riding a gecko!" );
		 */
		env.gecko = ( navigator.product == 'Gecko' && !env.webkit && !env.opera );

		var version = 0;

		// Internet Explorer 6.0+
		if ( env.ie )
		{
			version = parseFloat( agent.match( /msie (\d+)/ )[1] );

			/**
			 * Indicates that OMEditor is running on Internet Explorer 8.
			 * @name OMEDITOR.env.ie8
			 * @type Boolean
			 * @example
			 * if ( OMEDITOR.env.ie8 )
			 *     alert( "I'm on IE8!" );
			 */
			env.ie8 = !!document.documentMode;

			/**
			 * Indicates that OMEditor is running on Internet Explorer 8 on
			 * standards mode.
			 * @name OMEDITOR.env.ie8Compat
			 * @type Boolean
			 * @example
			 * if ( OMEDITOR.env.ie8Compat )
			 *     alert( "Now I'm on IE8, for real!" );
			 */
			env.ie8Compat = document.documentMode == 8;

			/**
			 * Indicates that OMEditor is running on Internet Explorer 9's standards mode.
			 * @name OMEDITOR.env.ie9Compat
			 * @type Boolean
			 * @example
			 * if ( OMEDITOR.env.ie9Compat )
			 *     alert( "IE9, the beauty of the web!" );
			 */
			env.ie9Compat = document.documentMode == 9;

			/**
			 * Indicates that OMEditor is running on an IE7-like environment, which
			 * includes IE7 itself and IE8's IE7 document mode.
			 * @name OMEDITOR.env.ie7Compat
			 * @type Boolean
			 * @example
			 * if ( OMEDITOR.env.ie8Compat )
			 *     alert( "I'm on IE7 or on an IE7 like IE8!" );
			 */
			env.ie7Compat = ( ( version == 7 && !document.documentMode )
					|| document.documentMode == 7 );

			/**
			 * Indicates that OMEditor is running on an IE6-like environment, which
			 * includes IE6 itself and IE7 and IE8 quirks mode.
			 * @name OMEDITOR.env.ie6Compat
			 * @type Boolean
			 * @example
			 * if ( OMEDITOR.env.ie6Compat )
			 *     alert( "I'm on IE6 or quirks mode!" );
			 */
			env.ie6Compat = ( version < 7 || env.quirks );
		}

		// Gecko.
		if ( env.gecko )
		{
			var geckoRelease = agent.match( /rv:([\d\.]+)/ );
			if ( geckoRelease )
			{
				geckoRelease = geckoRelease[1].split( '.' );
				version = geckoRelease[0] * 10000 + ( geckoRelease[1] || 0 ) * 100 + ( geckoRelease[2] || 0 ) * 1;
			}
		}

		// Opera 9.50+
		if ( env.opera )
			version = parseFloat( opera.version() );

		// Adobe AIR 1.0+
		// Checked before Safari because AIR have the WebKit rich text editor
		// features from Safari 3.0.4, but the version reported is 420.
		if ( env.air )
			version = parseFloat( agent.match( / adobeair\/(\d+)/ )[1] );

		// WebKit 522+ (Safari 3+)
		if ( env.webkit )
			version = parseFloat( agent.match( / applewebkit\/(\d+)/ )[1] );

		/**
		 * Contains the browser version.<br />
		 * <br />
		 * For gecko based browsers (like Firefox) it contains the revision
		 * number with first three parts concatenated with a padding zero
		 * (e.g. for revision 1.9.0.2 we have 10900).<br />
		 * <br />
		 * For webkit based browser (like Safari and Chrome) it contains the
		 * WebKit build version (e.g. 522).
		 * @name OMEDITOR.env.version
		 * @type Boolean
		 * @example
		 * if ( OMEDITOR.env.ie && <b>OMEDITOR.env.version</b> <= 6 )
		 *     alert( "Ouch!" );
		 */
		env.version = version;

		/**
		 * Indicates that OMEditor is running on a compatible browser.
		 * @name OMEDITOR.env.isCompatible
		 * @type Boolean
		 * @example
		 * if ( OMEDITOR.env.isCompatible )
		 *     alert( "Your browser is pretty cool!" );
		 */
		env.isCompatible =
			!env.mobile && (
			( env.ie && version >= 6 ) ||
			( env.gecko && version >= 10801 ) ||
			( env.opera && version >= 9.5 ) ||
			( env.air && version >= 1 ) ||
			( env.webkit && version >= 522 ) ||
			false );

		/**
		 * The CSS class to be appended on the main UI containers, making it
		 * easy to apply browser specific styles to it.
		 * @name OMEDITOR.env.cssClass
		 * @type String
		 * @example
		 * myDiv.className = OMEDITOR.env.cssClass;
		 */
		env.cssClass =
			'cke_browser_' + (
				env.ie ? 'ie' :
				env.gecko ? 'gecko' :
				env.opera ? 'opera' :
				env.webkit ? 'webkit' :
				'unknown' );

		if ( env.quirks )
			env.cssClass += ' cke_browser_quirks';

		if ( env.ie )
		{
			env.cssClass += ' cke_browser_ie' + (
				env.version < 7 ? '6' :
				env.version >= 8 ? document.documentMode:
				'7' );

			if ( env.quirks )
				env.cssClass += ' cke_browser_iequirks';
		}

		if ( env.gecko && version < 10900 )
			env.cssClass += ' cke_browser_gecko18';

		if ( env.air )
			env.cssClass += ' cke_browser_air';

		return env;
	})();
}

// PACKAGER_RENAME( OMEDITOR.env )
// PACKAGER_RENAME( OMEDITOR.env.ie )
