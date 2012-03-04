/*!
 * jQuery UI 1.8.15
 * $Id: jquery.ui.core.js,v 1.4 2011/12/06 07:19:28 licongping Exp $
 * Copyright 2011, AUTHORS.txt (http://jqueryui.com/about)
 * Dual licensed under the MIT or GPL Version 2 licenses.
 * http://jquery.org/license
 *
 * http://docs.jquery.com/UI
 */
(function( $, undefined ) {

// prevent duplicate loading
// this is only a problem because we proxy existing functions
// and we don't want to double proxy them
$.ui = $.ui || {};
if ( $.ui.version ) {
	return;
}

$.extend( $.ui, {
	version: "1.8.15",

	keyCode: {
		ALT: 18,
		BACKSPACE: 8,
		CAPS_LOCK: 20,
		COMMA: 188,
		COMMAND: 91,
		COMMAND_LEFT: 91, // COMMAND
		COMMAND_RIGHT: 93,
		CONTROL: 17,
		DELETE: 46,
		DOWN: 40,
		END: 35,
		ENTER: 13,
		ESCAPE: 27,
		HOME: 36,
		INSERT: 45,
		LEFT: 37,
		MENU: 93, // COMMAND_RIGHT
		NUMPAD_ADD: 107,
		NUMPAD_DECIMAL: 110,
		NUMPAD_DIVIDE: 111,
		NUMPAD_ENTER: 108,
		NUMPAD_MULTIPLY: 106,
		NUMPAD_SUBTRACT: 109,
		PAGE_DOWN: 34,
		PAGE_UP: 33,
		PERIOD: 190,
		RIGHT: 39,
		SHIFT: 16,
		SPACE: 32,
		TAB: 9,
		UP: 38,
		WINDOWS: 91 // COMMAND
	}
});

// plugins
$.fn.extend({
	propAttr: $.fn.prop || $.fn.attr,

	_focus: $.fn.focus,
	focus: function( delay, fn ) {
		return typeof delay === "number" ?
			this.each(function() {
				var elem = this;
				setTimeout(function() {
					$( elem ).focus();
					if ( fn ) {
						fn.call( elem );
					}
				}, delay );
			}) :
			this._focus.apply( this, arguments );
	},

	scrollParent: function() {
		var scrollParent;
		if (($.browser.msie && (/(static|relative)/).test(this.css('position'))) || (/absolute/).test(this.css('position'))) {
			scrollParent = this.parents().filter(function() {
				return (/(relative|absolute|fixed)/).test($.curCSS(this,'position',1)) && (/(auto|scroll)/).test($.curCSS(this,'overflow',1)+$.curCSS(this,'overflow-y',1)+$.curCSS(this,'overflow-x',1));
			}).eq(0);
		} else {
			scrollParent = this.parents().filter(function() {
				return (/(auto|scroll)/).test($.curCSS(this,'overflow',1)+$.curCSS(this,'overflow-y',1)+$.curCSS(this,'overflow-x',1));
			}).eq(0);
		}

		return (/fixed/).test(this.css('position')) || !scrollParent.length ? $(document) : scrollParent;
	},

	zIndex: function( zIndex ) {
		if ( zIndex !== undefined ) {
			return this.css( "zIndex", zIndex );
		}

		if ( this.length ) {
			var elem = $( this[ 0 ] ), position, value;
			while ( elem.length && elem[ 0 ] !== document ) {
				// Ignore z-index if position is set to a value where z-index is ignored by the browser
				// This makes behavior of this function consistent across browsers
				// WebKit always returns auto if the element is positioned
				position = elem.css( "position" );
				if ( position === "absolute" || position === "relative" || position === "fixed" ) {
					// IE returns 0 when zIndex is not specified
					// other browsers return a string
					// we ignore the case of nested elements with an explicit value of 0
					// <div style="z-index: -10;"><div style="z-index: 0;"></div></div>
					value = parseInt( elem.css( "zIndex" ), 10 );
					if ( !isNaN( value ) && value !== 0 ) {
						return value;
					}
				}
				elem = elem.parent();
			}
		}

		return 0;
	},

	disableSelection: function() {
		return this.bind( ( $.support.selectstart ? "selectstart" : "mousedown" ) +
			".ui-disableSelection", function( event ) {
				event.preventDefault();
			});
	},

	enableSelection: function() {
		return this.unbind( ".ui-disableSelection" );
	}
});

$.each( [ "Width", "Height" ], function( i, name ) {
	var side = name === "Width" ? [ "Left", "Right" ] : [ "Top", "Bottom" ],
		type = name.toLowerCase(),
		orig = {
			innerWidth: $.fn.innerWidth,
			innerHeight: $.fn.innerHeight,
			outerWidth: $.fn.outerWidth,
			outerHeight: $.fn.outerHeight
		};

	function reduce( elem, size, border, margin ) {
		$.each( side, function() {
			size -= parseFloat( $.curCSS( elem, "padding" + this, true) ) || 0;
			if ( border ) {
				size -= parseFloat( $.curCSS( elem, "border" + this + "Width", true) ) || 0;
			}
			if ( margin ) {
				size -= parseFloat( $.curCSS( elem, "margin" + this, true) ) || 0;
			}
		});
		return size;
	}

	$.fn[ "inner" + name ] = function( size ) {
		if ( size === undefined ) {
			return orig[ "inner" + name ].call( this );
		}

		return this.each(function() {
			$( this ).css( type, reduce( this, size ) + "px" );
		});
	};

	$.fn[ "outer" + name] = function( size, margin ) {
		if ( typeof size !== "number" ) {
			return orig[ "outer" + name ].call( this, size );
		}

		return this.each(function() {
			$( this).css( type, reduce( this, size, true, margin ) + "px" );
		});
	};
});

// selectors
function focusable( element, isTabIndexNotNaN ) {
	var nodeName = element.nodeName.toLowerCase();
	if ( "area" === nodeName ) {
		var map = element.parentNode,
			mapName = map.name,
			img;
		if ( !element.href || !mapName || map.nodeName.toLowerCase() !== "map" ) {
			return false;
		}
		img = $( "img[usemap=#" + mapName + "]" )[0];
		return !!img && visible( img );
	}
	return ( /input|select|textarea|button|object/.test( nodeName )
		? !element.disabled
		: "a" == nodeName
			? element.href || isTabIndexNotNaN
			: isTabIndexNotNaN)
		// the element and all of its ancestors must be visible
		&& visible( element );
}

function visible( element ) {
	return !$( element ).parents().andSelf().filter(function() {
		return $.curCSS( this, "visibility" ) === "hidden" ||
			$.expr.filters.hidden( this );
	}).length;
}

$.extend( $.expr[ ":" ], {
	data: function( elem, i, match ) {
		return !!$.data( elem, match[ 3 ] );
	},

	focusable: function( element ) {
		return focusable( element, !isNaN( $.attr( element, "tabindex" ) ) );
	},

	tabbable: function( element ) {
		var tabIndex = $.attr( element, "tabindex" ),
			isTabIndexNaN = isNaN( tabIndex );
		return ( isTabIndexNaN || tabIndex >= 0 ) && focusable( element, !isTabIndexNaN );
	}
});

// support
$(function() {
	var body = document.body,
		div = body.appendChild( div = document.createElement( "div" ) );

	$.extend( div.style, {
		minHeight: "100px",
		height: "auto",
		padding: 0,
		borderWidth: 0
	});

	$.support.minHeight = div.offsetHeight === 100;
	$.support.selectstart = "onselectstart" in div;

	// set display to none to avoid a layout bug in IE
	// http://dev.jquery.com/ticket/4014
	body.removeChild( div ).style.display = "none";
});





// deprecated
$.extend( $.ui, {
	// $.ui.plugin is deprecated.  Use the proxy pattern instead.
	plugin: {
		add: function( module, option, set ) {
			var proto = $.ui[ module ]?$.ui[module].prototype:$.om[module].prototype;
			for ( var i in set ) {
				proto.plugins[ i ] = proto.plugins[ i ] || [];
				proto.plugins[ i ].push( [ option, set[ i ] ] );
			}
		},
		call: function( instance, name, args ) {
			var set = instance.plugins[ name ];
			if ( !set || !instance.element[ 0 ].parentNode ) {
				return;
			}
	
			for ( var i = 0; i < set.length; i++ ) {
				if ( instance.options[ set[ i ][ 0 ] ] ) {
					set[ i ][ 1 ].apply( instance.element, args );
				}
			}
		}
	},
	
	// will be deprecated when we switch to jQuery 1.4 - use jQuery.contains()
	contains: function( a, b ) {
		return document.compareDocumentPosition ?
			a.compareDocumentPosition( b ) & 16 :
			a !== b && a.contains( b );
	},
	
	// only used by resizable
	hasScroll: function( el, a ) {
	
		//If overflow is hidden, the element might have extra content, but the user wants to hide it
		if ( $( el ).css( "overflow" ) === "hidden") {
			return false;
		}
	
		var scroll = ( a && a === "left" ) ? "scrollLeft" : "scrollTop",
			has = false;
	
		if ( el[ scroll ] > 0 ) {
			return true;
		}
	
		// TODO: determine which cases actually cause this to happen
		// if the element doesn't have the scroll set, see if it's possible to
		// set the scroll
		el[ scroll ] = 1;
		has = ( el[ scroll ] > 0 );
		el[ scroll ] = 0;
		return has;
	},
	
	// these are odd functions, fix the API or move into individual plugins
	isOverAxis: function( x, reference, size ) {
		//Determines when x coordinate is over "b" element axis
		return ( x > reference ) && ( x < ( reference + size ) );
	},
	isOver: function( y, x, top, left, height, width ) {
		//Determines when x, y coordinates is over "b" element
		return $.ui.isOverAxis( y, top, height ) && $.ui.isOverAxis( x, left, width );
	}
});

})( jQuery );
/*!
 * jQuery UI Widget 1.8.15
 * $Id: jquery.ui.widget.js,v 1.3 2011/12/06 07:19:29 licongping Exp $
 * Copyright 2011, AUTHORS.txt (http://jqueryui.com/about)
 * Dual licensed under the MIT or GPL Version 2 licenses.
 * http://jquery.org/license
 *
 * http://docs.jquery.com/UI/Widget
 */
(function( $, undefined ) {

// jQuery 1.4+
if ( $.cleanData ) {
	var _cleanData = $.cleanData;
	$.cleanData = function( elems ) {
		for ( var i = 0, elem; (elem = elems[i]) != null; i++ ) {
			$( elem ).triggerHandler( "remove" );
		}
		_cleanData( elems );
	};
} else {
	var _remove = $.fn.remove;
	$.fn.remove = function( selector, keepData ) {
		return this.each(function() {
			if ( !keepData ) {
				if ( !selector || $.filter( selector, [ this ] ).length ) {
					$( "*", this ).add( [ this ] ).each(function() {
						$( this ).triggerHandler( "remove" );
					});
				}
			}
			return _remove.call( $(this), selector, keepData );
		});
	};
}

$.widget = function( name, base, prototype ) {
	var namespace = name.split( "." )[ 0 ],
		fullName;
	name = name.split( "." )[ 1 ];
	fullName = namespace + "-" + name;

	if ( !prototype ) {
		prototype = base;
		base = $.Widget;
	}

	// create selector for plugin
	$.expr[ ":" ][ fullName ] = function( elem ) {
		return !!$.data( elem, name );
	};

	$[ namespace ] = $[ namespace ] || {};
	$[ namespace ][ name ] = function( options, element ) {
		// allow instantiation without initializing for simple inheritance
		if ( arguments.length ) {
			this._createWidget( options, element );
		}
	};

	var basePrototype = new base();
	// we need to make the options hash a property directly on the new instance
	// otherwise we'll modify the options hash on the prototype that we're
	// inheriting from
//	$.each( basePrototype, function( key, val ) {
//		if ( $.isPlainObject(val) ) {
//			basePrototype[ key ] = $.extend( {}, val );
//		}
//	});
	basePrototype.options = $.extend( true, {}, basePrototype.options );
	$[ namespace ][ name ].prototype = $.extend( true, basePrototype, {
		namespace: namespace,
		widgetName: name,
		widgetEventPrefix: $[ namespace ][ name ].prototype.widgetEventPrefix || name,
		widgetBaseClass: fullName
	}, prototype );

	$.widget.bridge( name, $[ namespace ][ name ] );
};

$.widget.bridge = function( name, object ) {
	$.fn[ name ] = function( options ) {
		var isMethodCall = typeof options === "string",
			args = Array.prototype.slice.call( arguments, 1 ),
			returnValue = this;

		// allow multiple hashes to be passed on init
		options = !isMethodCall && args.length ?
			$.extend.apply( null, [ true, options ].concat(args) ) :
			options;

		// prevent calls to internal methods
		if ( isMethodCall && options.charAt( 0 ) === "_" ) {
			return returnValue;
		}

		if ( isMethodCall ) {
			this.each(function() {
				var instance = $.data( this, name ),
					methodValue = instance && $.isFunction( instance[options] ) ?
						instance[ options ].apply( instance, args ) :
						instance;
				// TODO: add this back in 1.9 and use $.error() (see #5972)
//				if ( !instance ) {
//					throw "cannot call methods on " + name + " prior to initialization; " +
//						"attempted to call method '" + options + "'";
//				}
//				if ( !$.isFunction( instance[options] ) ) {
//					throw "no such method '" + options + "' for " + name + " widget instance";
//				}
//				var methodValue = instance[ options ].apply( instance, args );
				if ( methodValue !== instance && methodValue !== undefined ) {
					returnValue = methodValue;
					return false;
				}
			});
		} else {
			this.each(function() {
				var instance = $.data( this, name );
				if ( instance ) {
					instance.option( options || {} )._init();
				} else {
					$.data( this, name, new object( options, this ) );
				}
			});
		}

		return returnValue;
	};
};

$.Widget = function( options, element ) {
	// allow instantiation without initializing for simple inheritance
	if ( arguments.length ) {
		this._createWidget( options, element );
	}
};

$.Widget.prototype = {
	widgetName: "widget",
	widgetEventPrefix: "",
	options: {
		disabled: false
	},
	_createWidget: function( options, element ) {
		// $.widget.bridge stores the plugin instance, but we do it anyway
		// so that it's stored even before the _create function runs
		$.data( element, this.widgetName, this );
		this.element = $( element );
		this.options = $.extend( true, {},
			this.options,
			this._getCreateOptions(),
			options );

		var self = this;
		this.element.bind( "remove." + this.widgetName, function() {
			self.destroy();
		});

		this._create();
		this._trigger( "create" );
		this._init();
	},
	_getCreateOptions: function() {
		return $.metadata && $.metadata.get( this.element[0] )[ this.widgetName ];
	},
	_create: function() {},
	_init: function() {},

	destroy: function() {
		this.element
			.unbind( "." + this.widgetName )
			.removeData( this.widgetName );
		this.widget()
			.unbind( "." + this.widgetName )
			.removeAttr( "aria-disabled" )
			.removeClass(
				this.widgetBaseClass + "-disabled " +
				"ui-state-disabled" );
	},

	widget: function() {
		return this.element;
	},

	option: function( key, value ) {
		var options = key;

		if ( arguments.length === 0 ) {
			// don't return a reference to the internal hash
			return $.extend( {}, this.options );
		}

		if  (typeof key === "string" ) {
			if ( value === undefined ) {
				return this.options[ key ];
			}
			options = {};
			options[ key ] = value;
		}

		this._setOptions( options );

		return this;
	},
	_setOptions: function( options ) {
		var self = this;
		$.each( options, function( key, value ) {
			self._setOption( key, value );
		});

		return this;
	},
	_setOption: function( key, value ) {
		this.options[ key ] = value;

		if ( key === "disabled" ) {
			this.widget()
				[ value ? "addClass" : "removeClass"](
					this.widgetBaseClass + "-disabled" + " " +
					"ui-state-disabled" )
				.attr( "aria-disabled", value );
		}

		return this;
	},

	enable: function() {
		return this._setOption( "disabled", false );
	},
	disable: function() {
		return this._setOption( "disabled", true );
	},

	_trigger: function( type, event, data ) {
		var callback = this.options[ type ];

		event = $.Event( event );
		event.type = ( type === this.widgetEventPrefix ?
			type :
			this.widgetEventPrefix + type ).toLowerCase();
		data = data || {};

		// copy original event properties over to the new event
		// this would happen if we could call $.event.fix instead of $.Event
		// but we don't have a way to force an event to be fixed multiple times
		if ( event.originalEvent ) {
			for ( var i = $.event.props.length, prop; i; ) {
				prop = $.event.props[ --i ];
				event[ prop ] = event.originalEvent[ prop ];
			}
		}

		this.element.trigger( event, data );

		return !( $.isFunction(callback) &&
			callback.call( this.element[0], event, data ) === false ||
			event.isDefaultPrevented() );
	}
};

})( jQuery );
/*!
 * jQuery UI Mouse 1.8.15
 * $Id: jquery.ui.mouse.js,v 1.2 2011/12/06 07:19:29 licongping Exp $
 * Copyright 2011, AUTHORS.txt (http://jqueryui.com/about)
 * Dual licensed under the MIT or GPL Version 2 licenses.
 * http://jquery.org/license
 *
 * http://docs.jquery.com/UI/Mouse
 *
 * Depends:
 *	jquery.ui.widget.js
 */
(function( $, undefined ) {

$.widget("ui.mouse", {
	options: {
		cancel: ':input,option',
		distance: 1,
		delay: 0
	},
	_mouseInit: function() {
		var self = this;

		this.element
			.bind('mousedown.'+this.widgetName, function(event) {
				return self._mouseDown(event);
			})
			.bind('click.'+this.widgetName, function(event) {
				if (true === $.data(event.target, self.widgetName + '.preventClickEvent')) {
				    $.removeData(event.target, self.widgetName + '.preventClickEvent');
					event.stopImmediatePropagation();
					return false;
				}
			});

		this.started = false;
	},

	// TODO: make sure destroying one instance of mouse doesn't mess with
	// other instances of mouse
	_mouseDestroy: function() {
		this.element.unbind('.'+this.widgetName);
	},

	_mouseDown: function(event) {
		// don't let more than one widget handle mouseStart
		// TODO: figure out why we have to use originalEvent
		event.originalEvent = event.originalEvent || {};
		if (event.originalEvent.mouseHandled) { return; }

		// we may have missed mouseup (out of window)
		(this._mouseStarted && this._mouseUp(event));

		this._mouseDownEvent = event;

		var self = this,
			btnIsLeft = (event.which == 1),
			elIsCancel = (typeof this.options.cancel == "string" ? $(event.target).closest(this.options.cancel).length : false);
		if (!btnIsLeft || elIsCancel || !this._mouseCapture(event)) {
			return true;
		}

		this.mouseDelayMet = !this.options.delay;
		if (!this.mouseDelayMet) {
			this._mouseDelayTimer = setTimeout(function() {
				self.mouseDelayMet = true;
			}, this.options.delay);
		}

		if (this._mouseDistanceMet(event) && this._mouseDelayMet(event)) {
			this._mouseStarted = (this._mouseStart(event) !== false);
			if (!this._mouseStarted) {
				event.preventDefault();
				return true;
			}
		}

		// Click event may never have fired (Gecko & Opera)
		if (true === $.data(event.target, this.widgetName + '.preventClickEvent')) {
			$.removeData(event.target, this.widgetName + '.preventClickEvent');
		}

		// these delegates are required to keep context
		this._mouseMoveDelegate = function(event) {
			return self._mouseMove(event);
		};
		this._mouseUpDelegate = function(event) {
			return self._mouseUp(event);
		};
		$(document)
			.bind('mousemove.'+this.widgetName, this._mouseMoveDelegate)
			.bind('mouseup.'+this.widgetName, this._mouseUpDelegate);

		event.preventDefault();
		event.originalEvent.mouseHandled = true;
		return true;
	},

	_mouseMove: function(event) {
		// IE mouseup check - mouseup happened when mouse was out of window
		if ($.browser.msie && !(document.documentMode >= 9) && !event.button) {
			return this._mouseUp(event);
		}

		if (this._mouseStarted) {
			this._mouseDrag(event);
			return event.preventDefault();
		}

		if (this._mouseDistanceMet(event) && this._mouseDelayMet(event)) {
			this._mouseStarted =
				(this._mouseStart(this._mouseDownEvent, event) !== false);
			(this._mouseStarted ? this._mouseDrag(event) : this._mouseUp(event));
		}

		return !this._mouseStarted;
	},

	_mouseUp: function(event) {
		$(document)
			.unbind('mousemove.'+this.widgetName, this._mouseMoveDelegate)
			.unbind('mouseup.'+this.widgetName, this._mouseUpDelegate);

		if (this._mouseStarted) {
			this._mouseStarted = false;

			if (event.target == this._mouseDownEvent.target) {
			    $.data(event.target, this.widgetName + '.preventClickEvent', true);
			}

			this._mouseStop(event);
		}

		return false;
	},

	_mouseDistanceMet: function(event) {
		return (Math.max(
				Math.abs(this._mouseDownEvent.pageX - event.pageX),
				Math.abs(this._mouseDownEvent.pageY - event.pageY)
			) >= this.options.distance
		);
	},

	_mouseDelayMet: function(event) {
		return this.mouseDelayMet;
	},

	// These are placeholder methods, to be overriden by extending plugin
	_mouseStart: function(event) {},
	_mouseDrag: function(event) {},
	_mouseStop: function(event) {},
	_mouseCapture: function(event) { return true; }
});

})(jQuery);
/*
 * jQuery UI Position 1.8.15
 * $Id: jquery.ui.position.js,v 1.2 2011/12/06 07:19:28 licongping Exp $
 * Copyright 2011, AUTHORS.txt (http://jqueryui.com/about)
 * Dual licensed under the MIT or GPL Version 2 licenses.
 * http://jquery.org/license
 *
 * http://docs.jquery.com/UI/Position
 */
(function( $, undefined ) {

$.ui = $.ui || {};

var horizontalPositions = /left|center|right/,
	verticalPositions = /top|center|bottom/,
	center = "center",
	_position = $.fn.position,
	_offset = $.fn.offset;

$.fn.position = function( options ) {
	if ( !options || !options.of ) {
		return _position.apply( this, arguments );
	}

	// make a copy, we don't want to modify arguments
	options = $.extend( {}, options );

	var target = $( options.of ),
		targetElem = target[0],
		collision = ( options.collision || "flip" ).split( " " ),
		offset = options.offset ? options.offset.split( " " ) : [ 0, 0 ],
		targetWidth,
		targetHeight,
		basePosition;

	if ( targetElem.nodeType === 9 ) {
		targetWidth = target.width();
		targetHeight = target.height();
		basePosition = { top: 0, left: 0 };
	// TODO: use $.isWindow() in 1.9
	} else if ( targetElem.setTimeout ) {
		targetWidth = target.width();
		targetHeight = target.height();
		basePosition = { top: target.scrollTop(), left: target.scrollLeft() };
	} else if ( targetElem.preventDefault ) {
		// force left top to allow flipping
		options.at = "left top";
		targetWidth = targetHeight = 0;
		basePosition = { top: options.of.pageY, left: options.of.pageX };
	} else {
		targetWidth = target.outerWidth();
		targetHeight = target.outerHeight();
		basePosition = target.offset();
	}

	// force my and at to have valid horizontal and veritcal positions
	// if a value is missing or invalid, it will be converted to center 
	$.each( [ "my", "at" ], function() {
		var pos = ( options[this] || "" ).split( " " );
		if ( pos.length === 1) {
			pos = horizontalPositions.test( pos[0] ) ?
				pos.concat( [center] ) :
				verticalPositions.test( pos[0] ) ?
					[ center ].concat( pos ) :
					[ center, center ];
		}
		pos[ 0 ] = horizontalPositions.test( pos[0] ) ? pos[ 0 ] : center;
		pos[ 1 ] = verticalPositions.test( pos[1] ) ? pos[ 1 ] : center;
		options[ this ] = pos;
	});

	// normalize collision option
	if ( collision.length === 1 ) {
		collision[ 1 ] = collision[ 0 ];
	}

	// normalize offset option
	offset[ 0 ] = parseInt( offset[0], 10 ) || 0;
	if ( offset.length === 1 ) {
		offset[ 1 ] = offset[ 0 ];
	}
	offset[ 1 ] = parseInt( offset[1], 10 ) || 0;

	if ( options.at[0] === "right" ) {
		basePosition.left += targetWidth;
	} else if ( options.at[0] === center ) {
		basePosition.left += targetWidth / 2;
	}

	if ( options.at[1] === "bottom" ) {
		basePosition.top += targetHeight;
	} else if ( options.at[1] === center ) {
		basePosition.top += targetHeight / 2;
	}

	basePosition.left += offset[ 0 ];
	basePosition.top += offset[ 1 ];

	return this.each(function() {
		var elem = $( this ),
			elemWidth = elem.outerWidth(),
			elemHeight = elem.outerHeight(),
			marginLeft = parseInt( $.curCSS( this, "marginLeft", true ) ) || 0,
			marginTop = parseInt( $.curCSS( this, "marginTop", true ) ) || 0,
			collisionWidth = elemWidth + marginLeft +
				( parseInt( $.curCSS( this, "marginRight", true ) ) || 0 ),
			collisionHeight = elemHeight + marginTop +
				( parseInt( $.curCSS( this, "marginBottom", true ) ) || 0 ),
			position = $.extend( {}, basePosition ),
			collisionPosition;

		if ( options.my[0] === "right" ) {
			position.left -= elemWidth;
		} else if ( options.my[0] === center ) {
			position.left -= elemWidth / 2;
		}

		if ( options.my[1] === "bottom" ) {
			position.top -= elemHeight;
		} else if ( options.my[1] === center ) {
			position.top -= elemHeight / 2;
		}

		// prevent fractions (see #5280)
		position.left = Math.round( position.left );
		position.top = Math.round( position.top );

		collisionPosition = {
			left: position.left - marginLeft,
			top: position.top - marginTop
		};

		$.each( [ "left", "top" ], function( i, dir ) {
			if ( $.ui.position[ collision[i] ] ) {
				$.ui.position[ collision[i] ][ dir ]( position, {
					targetWidth: targetWidth,
					targetHeight: targetHeight,
					elemWidth: elemWidth,
					elemHeight: elemHeight,
					collisionPosition: collisionPosition,
					collisionWidth: collisionWidth,
					collisionHeight: collisionHeight,
					offset: offset,
					my: options.my,
					at: options.at
				});
			}
		});

		if ( $.fn.bgiframe ) {
			elem.bgiframe();
		}
		elem.offset( $.extend( position, { using: options.using } ) );
	});
};

$.ui.position = {
	fit: {
		left: function( position, data ) {
			var win = $( window ),
				over = data.collisionPosition.left + data.collisionWidth - win.width() - win.scrollLeft();
			position.left = over > 0 ? position.left - over : Math.max( position.left - data.collisionPosition.left, position.left );
		},
		top: function( position, data ) {
			var win = $( window ),
				over = data.collisionPosition.top + data.collisionHeight - win.height() - win.scrollTop();
			position.top = over > 0 ? position.top - over : Math.max( position.top - data.collisionPosition.top, position.top );
		}
	},

	flip: {
		left: function( position, data ) {
			if ( data.at[0] === center ) {
				return;
			}
			var win = $( window ),
				over = data.collisionPosition.left + data.collisionWidth - win.width() - win.scrollLeft(),
				myOffset = data.my[ 0 ] === "left" ?
					-data.elemWidth :
					data.my[ 0 ] === "right" ?
						data.elemWidth :
						0,
				atOffset = data.at[ 0 ] === "left" ?
					data.targetWidth :
					-data.targetWidth,
				offset = -2 * data.offset[ 0 ];
			position.left += data.collisionPosition.left < 0 ?
				myOffset + atOffset + offset :
				over > 0 ?
					myOffset + atOffset + offset :
					0;
		},
		top: function( position, data ) {
			if ( data.at[1] === center ) {
				return;
			}
			var win = $( window ),
				over = data.collisionPosition.top + data.collisionHeight - win.height() - win.scrollTop(),
				myOffset = data.my[ 1 ] === "top" ?
					-data.elemHeight :
					data.my[ 1 ] === "bottom" ?
						data.elemHeight :
						0,
				atOffset = data.at[ 1 ] === "top" ?
					data.targetHeight :
					-data.targetHeight,
				offset = -2 * data.offset[ 1 ];
			position.top += data.collisionPosition.top < 0 ?
				myOffset + atOffset + offset :
				over > 0 ?
					myOffset + atOffset + offset :
					0;
		}
	}
};

// offset setter from jQuery 1.4
if ( !$.offset.setOffset ) {
	$.offset.setOffset = function( elem, options ) {
		// set position first, in-case top/left are set even on static elem
		if ( /static/.test( $.curCSS( elem, "position" ) ) ) {
			elem.style.position = "relative";
		}
		var curElem   = $( elem ),
			curOffset = curElem.offset(),
			curTop    = parseInt( $.curCSS( elem, "top",  true ), 10 ) || 0,
			curLeft   = parseInt( $.curCSS( elem, "left", true ), 10)  || 0,
			props     = {
				top:  (options.top  - curOffset.top)  + curTop,
				left: (options.left - curOffset.left) + curLeft
			};
		
		if ( 'using' in options ) {
			options.using.call( elem, props );
		} else {
			curElem.css( props );
		}
	};

	$.fn.offset = function( options ) {
		var elem = this[ 0 ];
		if ( !elem || !elem.ownerDocument ) { return null; }
		if ( options ) { 
			return this.each(function() {
				$.offset.setOffset( this, options );
			});
		}
		return _offset.call( this );
	};
}

}( jQuery ));
/*
 * jQuery UI Resizable 1.8.15
 * $Id: jquery.ui.resizable.js,v 1.3 2011/12/06 07:19:29 licongping Exp $
 * Copyright 2011, AUTHORS.txt (http://jqueryui.com/about)
 * Dual licensed under the MIT or GPL Version 2 licenses.
 * http://jquery.org/license
 *
 * http://docs.jquery.com/UI/Resizables
 *
 * Depends:
 *	jquery.ui.core.js
 *	jquery.ui.mouse.js
 *	jquery.ui.widget.js
 */
(function( $, undefined ) {

$.widget("ui.resizable", $.ui.mouse, {
	widgetEventPrefix: "resize",
	options: {
		alsoResize: false,
		animate: false,
		animateDuration: "slow",
		animateEasing: "swing",
		aspectRatio: false,
		autoHide: false,
		containment: false,
		ghost: false,
		grid: false,
		handles: "e,s,se",
		helper: false,
		maxHeight: null,
		maxWidth: null,
		minHeight: 10,
		minWidth: 10,
		zIndex: 1000
	},
	_create: function() {

		var self = this, o = this.options;
		this.element.addClass("om-resizable");

		$.extend(this, {
			_aspectRatio: !!(o.aspectRatio),
			aspectRatio: o.aspectRatio,
			originalElement: this.element,
			_proportionallyResizeElements: [],
			_helper: o.helper || o.ghost || o.animate ? o.helper || 'om-resizable-helper' : null
		});

		//Wrap the element if it cannot hold child nodes
		if(this.element[0].nodeName.match(/canvas|textarea|input|select|button|img/i)) {

			//Opera fix for relative positioning
			if (/relative/.test(this.element.css('position')) && $.browser.opera)
				this.element.css({ position: 'relative', top: 'auto', left: 'auto' });

			//Create a wrapper element and set the wrapper to the new current internal element
			this.element.wrap(
				$('<div class="om-wrapper" style="overflow: hidden;"></div>').css({
					position: this.element.css('position'),
					width: this.element.outerWidth(),
					height: this.element.outerHeight(),
					top: this.element.css('top'),
					left: this.element.css('left')
				})
			);

			//Overwrite the original this.element
			this.element = this.element.parent().data(
				"resizable", this.element.data('resizable')
			);

			this.elementIsWrapper = true;

			//Move margins to the wrapper
			this.element.css({ marginLeft: this.originalElement.css("marginLeft"), marginTop: this.originalElement.css("marginTop"), marginRight: this.originalElement.css("marginRight"), marginBottom: this.originalElement.css("marginBottom") });
			this.originalElement.css({ marginLeft: 0, marginTop: 0, marginRight: 0, marginBottom: 0});

			//Prevent Safari textarea resize
			this.originalResizeStyle = this.originalElement.css('resize');
			this.originalElement.css('resize', 'none');

			//Push the actual element to our proportionallyResize internal array
			this._proportionallyResizeElements.push(this.originalElement.css({ position: 'static', zoom: 1, display: 'block' }));

			// avoid IE jump (hard set the margin)
			this.originalElement.css({ margin: this.originalElement.css('margin') });

			// fix handlers offset
			this._proportionallyResize();

		}

		this.handles = o.handles || (!$('.om-resizable-handle', this.element).length ? "e,s,se" : { n: '.om-resizable-n', e: '.om-resizable-e', s: '.om-resizable-s', w: '.om-resizable-w', se: '.om-resizable-se', sw: '.om-resizable-sw', ne: '.om-resizable-ne', nw: '.om-resizable-nw' });
		if(this.handles.constructor == String) {

			if(this.handles == 'all') this.handles = 'n,e,s,w,se,sw,ne,nw';
			var n = this.handles.split(","); this.handles = {};

			for(var i = 0; i < n.length; i++) {

				var handle = $.trim(n[i]), hname = 'om-resizable-'+handle;
				var axis = $('<div class="om-resizable-handle ' + hname + '"></div>');

				// increase zIndex of sw, se, ne, nw axis
				//TODO : this modifies original option
				if(/sw|se|ne|nw/.test(handle)) axis.css({ zIndex: ++o.zIndex });

				//TODO : What's going on here?
				if ('se' == handle) {
					axis.addClass('om-icon om-icon-gripsmall-diagonal-se');
				};

				//Insert into internal handles object and append to element
				this.handles[handle] = '.om-resizable-'+handle;
				this.element.append(axis);
			}

		}

		this._renderAxis = function(target) {

			target = target || this.element;

			for(var i in this.handles) {

				if(this.handles[i].constructor == String)
					this.handles[i] = $(this.handles[i], this.element).show();

				//Apply pad to wrapper element, needed to fix axis position (textarea, inputs, scrolls)
				if (this.elementIsWrapper && this.originalElement[0].nodeName.match(/textarea|input|select|button/i)) {

					var axis = $(this.handles[i], this.element), padWrapper = 0;

					//Checking the correct pad and border
					padWrapper = /sw|ne|nw|se|n|s/.test(i) ? axis.outerHeight() : axis.outerWidth();

					//The padding type i have to apply...
					var padPos = [ 'padding',
						/ne|nw|n/.test(i) ? 'Top' :
						/se|sw|s/.test(i) ? 'Bottom' :
						/^e$/.test(i) ? 'Right' : 'Left' ].join("");

					target.css(padPos, padWrapper);

					this._proportionallyResize();

				}

				//TODO: What's that good for? There's not anything to be executed left
				if(!$(this.handles[i]).length)
					continue;

			}
		};

		//TODO: make renderAxis a prototype function
		this._renderAxis(this.element);

		this._handles = $('.om-resizable-handle', this.element)
			.disableSelection();

		//Matching axis name
		this._handles.mouseover(function() {
			if (!self.resizing) {
				if (this.className)
					var axis = this.className.match(/om-resizable-(se|sw|ne|nw|n|e|s|w)/i);
				//Axis, default = se
				self.axis = axis && axis[1] ? axis[1] : 'se';
			}
		});

		//If we want to auto hide the elements
		if (o.autoHide) {
			this._handles.hide();
			$(this.element)
				.addClass("om-resizable-autohide")
				.hover(function() {
					if (o.disabled) return;
					$(this).removeClass("om-resizable-autohide");
					self._handles.show();
				},
				function(){
					if (o.disabled) return;
					if (!self.resizing) {
						$(this).addClass("om-resizable-autohide");
						self._handles.hide();
					}
				});
		}

		//Initialize the mouse interaction
		this._mouseInit();

	},

	destroy: function() {

		this._mouseDestroy();

		var _destroy = function(exp) {
			$(exp).removeClass("om-resizable om-resizable-disabled om-resizable-resizing")
				.removeData("resizable").unbind(".resizable").find('.om-resizable-handle').remove();
		};

		//TODO: Unwrap at same DOM position
		if (this.elementIsWrapper) {
			_destroy(this.element);
			var wrapper = this.element;
			wrapper.after(
				this.originalElement.css({
					position: wrapper.css('position'),
					width: wrapper.outerWidth(),
					height: wrapper.outerHeight(),
					top: wrapper.css('top'),
					left: wrapper.css('left')
				})
			).remove();
		}

		this.originalElement.css('resize', this.originalResizeStyle);
		_destroy(this.originalElement);

		return this;
	},

	_mouseCapture: function(event) {
		var handle = false;
		for (var i in this.handles) {
			if ($(this.handles[i])[0] == event.target) {
				handle = true;
			}
		}

		return !this.options.disabled && handle;
	},

	_mouseStart: function(event) {

		var o = this.options, iniPos = this.element.position(), el = this.element;

		this.resizing = true;
		this.documentScroll = { top: $(document).scrollTop(), left: $(document).scrollLeft() };

		// bugfix for http://dev.jquery.com/ticket/1749
		if (el.is('.ui-draggable') || (/absolute/).test(el.css('position'))) {
			el.css({ position: 'absolute', top: iniPos.top, left: iniPos.left });
		}

		//Opera fixing relative position
		if ($.browser.opera && (/relative/).test(el.css('position')))
			el.css({ position: 'relative', top: 'auto', left: 'auto' });

		this._renderProxy();

		var curleft = num(this.helper.css('left')), curtop = num(this.helper.css('top'));

		if (o.containment) {
			curleft += $(o.containment).scrollLeft() || 0;
			curtop += $(o.containment).scrollTop() || 0;
		}

		//Store needed variables
		this.offset = this.helper.offset();
		this.position = { left: curleft, top: curtop };
		this.size = this._helper ? { width: el.outerWidth(), height: el.outerHeight() } : { width: el.width(), height: el.height() };
		this.originalSize = this._helper ? { width: el.outerWidth(), height: el.outerHeight() } : { width: el.width(), height: el.height() };
		this.originalPosition = { left: curleft, top: curtop };
		this.sizeDiff = { width: el.outerWidth() - el.width(), height: el.outerHeight() - el.height() };
		this.originalMousePosition = { left: event.pageX, top: event.pageY };

		//Aspect Ratio
		this.aspectRatio = (typeof o.aspectRatio == 'number') ? o.aspectRatio : ((this.originalSize.width / this.originalSize.height) || 1);

	    var cursor = $('.om-resizable-' + this.axis).css('cursor');
	    $('body').css('cursor', cursor == 'auto' ? this.axis + '-resize' : cursor);

		el.addClass("om-resizable-resizing");
		this._propagate("start", event);
		return true;
	},

	_mouseDrag: function(event) {

		//Increase performance, avoid regex
		var el = this.helper, o = this.options, props = {},
			self = this, smp = this.originalMousePosition, a = this.axis;

		var dx = (event.pageX-smp.left)||0, dy = (event.pageY-smp.top)||0;
		var trigger = this._change[a];
		if (!trigger) return false;

		// Calculate the attrs that will be change
		var data = trigger.apply(this, [event, dx, dy]), ie6 = $.browser.msie && $.browser.version < 7, csdif = this.sizeDiff;

		// Put this in the mouseDrag handler since the user can start pressing shift while resizing
		this._updateVirtualBoundaries(event.shiftKey);
		if (this._aspectRatio || event.shiftKey)
			data = this._updateRatio(data, event);

		data = this._respectSize(data, event);

		// plugins callbacks need to be called first
		this._propagate("resize", event);

		el.css({
			top: this.position.top + "px", left: this.position.left + "px",
			width: this.size.width + "px", height: this.size.height + "px"
		});

		if (!this._helper && this._proportionallyResizeElements.length)
			this._proportionallyResize();

		this._updateCache(data);

		// calling the user callback at the end
		this._trigger('resize', event, this.ui());

		return false;
	},

	_mouseStop: function(event) {

		this.resizing = false;
		var o = this.options, self = this;

		if(this._helper) {
			var pr = this._proportionallyResizeElements, ista = pr.length && (/textarea/i).test(pr[0].nodeName),
				soffseth = ista && $.ui.hasScroll(pr[0], 'left') /* TODO - jump height */ ? 0 : self.sizeDiff.height,
				soffsetw = ista ? 0 : self.sizeDiff.width;

			var s = { width: (self.helper.width()  - soffsetw), height: (self.helper.height() - soffseth) },
				left = (parseInt(self.element.css('left'), 10) + (self.position.left - self.originalPosition.left)) || null,
				top = (parseInt(self.element.css('top'), 10) + (self.position.top - self.originalPosition.top)) || null;

			if (!o.animate)
				this.element.css($.extend(s, { top: top, left: left }));

			self.helper.height(self.size.height);
			self.helper.width(self.size.width);

			if (this._helper && !o.animate) this._proportionallyResize();
		}

		$('body').css('cursor', 'auto');

		this.element.removeClass("om-resizable-resizing");

		this._propagate("stop", event);

		if (this._helper) this.helper.remove();
		return false;

	},

    _updateVirtualBoundaries: function(forceAspectRatio) {
        var o = this.options, pMinWidth, pMaxWidth, pMinHeight, pMaxHeight, b;

        b = {
            minWidth: isNumber(o.minWidth) ? o.minWidth : 0,
            maxWidth: isNumber(o.maxWidth) ? o.maxWidth : Infinity,
            minHeight: isNumber(o.minHeight) ? o.minHeight : 0,
            maxHeight: isNumber(o.maxHeight) ? o.maxHeight : Infinity
        };

        if(this._aspectRatio || forceAspectRatio) {
            // We want to create an enclosing box whose aspect ration is the requested one
            // First, compute the "projected" size for each dimension based on the aspect ratio and other dimension
            pMinWidth = b.minHeight * this.aspectRatio;
            pMinHeight = b.minWidth / this.aspectRatio;
            pMaxWidth = b.maxHeight * this.aspectRatio;
            pMaxHeight = b.maxWidth / this.aspectRatio;

            if(pMinWidth > b.minWidth) b.minWidth = pMinWidth;
            if(pMinHeight > b.minHeight) b.minHeight = pMinHeight;
            if(pMaxWidth < b.maxWidth) b.maxWidth = pMaxWidth;
            if(pMaxHeight < b.maxHeight) b.maxHeight = pMaxHeight;
        }
        this._vBoundaries = b;
    },

	_updateCache: function(data) {
		var o = this.options;
		this.offset = this.helper.offset();
		if (isNumber(data.left)) this.position.left = data.left;
		if (isNumber(data.top)) this.position.top = data.top;
		if (isNumber(data.height)) this.size.height = data.height;
		if (isNumber(data.width)) this.size.width = data.width;
	},

	_updateRatio: function(data, event) {

		var o = this.options, cpos = this.position, csize = this.size, a = this.axis;

		if (isNumber(data.height)) data.width = (data.height * this.aspectRatio);
		else if (isNumber(data.width)) data.height = (data.width / this.aspectRatio);

		if (a == 'sw') {
			data.left = cpos.left + (csize.width - data.width);
			data.top = null;
		}
		if (a == 'nw') {
			data.top = cpos.top + (csize.height - data.height);
			data.left = cpos.left + (csize.width - data.width);
		}

		return data;
	},

	_respectSize: function(data, event) {

		var el = this.helper, o = this._vBoundaries, pRatio = this._aspectRatio || event.shiftKey, a = this.axis,
				ismaxw = isNumber(data.width) && o.maxWidth && (o.maxWidth < data.width), ismaxh = isNumber(data.height) && o.maxHeight && (o.maxHeight < data.height),
					isminw = isNumber(data.width) && o.minWidth && (o.minWidth > data.width), isminh = isNumber(data.height) && o.minHeight && (o.minHeight > data.height);

		if (isminw) data.width = o.minWidth;
		if (isminh) data.height = o.minHeight;
		if (ismaxw) data.width = o.maxWidth;
		if (ismaxh) data.height = o.maxHeight;

		var dw = this.originalPosition.left + this.originalSize.width, dh = this.position.top + this.size.height;
		var cw = /sw|nw|w/.test(a), ch = /nw|ne|n/.test(a);

		if (isminw && cw) data.left = dw - o.minWidth;
		if (ismaxw && cw) data.left = dw - o.maxWidth;
		if (isminh && ch)	data.top = dh - o.minHeight;
		if (ismaxh && ch)	data.top = dh - o.maxHeight;

		// fixing jump error on top/left - bug #2330
		var isNotwh = !data.width && !data.height;
		if (isNotwh && !data.left && data.top) data.top = null;
		else if (isNotwh && !data.top && data.left) data.left = null;

		return data;
	},

	_proportionallyResize: function() {

		var o = this.options;
		if (!this._proportionallyResizeElements.length) return;
		var element = this.helper || this.element;

		for (var i=0; i < this._proportionallyResizeElements.length; i++) {

			var prel = this._proportionallyResizeElements[i];

			if (!this.borderDif) {
				var b = [prel.css('borderTopWidth'), prel.css('borderRightWidth'), prel.css('borderBottomWidth'), prel.css('borderLeftWidth')],
					p = [prel.css('paddingTop'), prel.css('paddingRight'), prel.css('paddingBottom'), prel.css('paddingLeft')];

				this.borderDif = $.map(b, function(v, i) {
					var border = parseInt(v,10)||0, padding = parseInt(p[i],10)||0;
					return border + padding;
				});
			}

			if ($.browser.msie && !(!($(element).is(':hidden') || $(element).parents(':hidden').length)))
				continue;

			prel.css({
				height: (element.height() - this.borderDif[0] - this.borderDif[2]) || 0,
				width: (element.width() - this.borderDif[1] - this.borderDif[3]) || 0
			});

		};

	},

	_renderProxy: function() {

		var el = this.element, o = this.options;
		this.elementOffset = el.offset();

		if(this._helper) {

			this.helper = this.helper || $('<div style="overflow:hidden;"></div>');

			// fix ie6 offset TODO: This seems broken
			var ie6 = $.browser.msie && $.browser.version < 7, ie6offset = (ie6 ? 1 : 0),
			pxyoffset = ( ie6 ? 2 : -1 );

			this.helper.addClass(this._helper).css({
				width: this.element.outerWidth() + pxyoffset,
				height: this.element.outerHeight() + pxyoffset,
				position: 'absolute',
				left: this.elementOffset.left - ie6offset +'px',
				top: this.elementOffset.top - ie6offset +'px',
				zIndex: ++o.zIndex //TODO: Don't modify option
			});

			this.helper
				.appendTo("body")
				.disableSelection();

		} else {
			this.helper = this.element;
		}

	},

	_change: {
		e: function(event, dx, dy) {
			return { width: this.originalSize.width + dx };
		},
		w: function(event, dx, dy) {
			var o = this.options, cs = this.originalSize, sp = this.originalPosition;
			return { left: sp.left + dx, width: cs.width - dx };
		},
		n: function(event, dx, dy) {
			var o = this.options, cs = this.originalSize, sp = this.originalPosition;
			return { top: sp.top + dy, height: cs.height - dy };
		},
		s: function(event, dx, dy) {
			return { height: this.originalSize.height + dy };
		},
		se: function(event, dx, dy) {
			return $.extend(this._change.s.apply(this, arguments), this._change.e.apply(this, [event, dx, dy]));
		},
		sw: function(event, dx, dy) {
			return $.extend(this._change.s.apply(this, arguments), this._change.w.apply(this, [event, dx, dy]));
		},
		ne: function(event, dx, dy) {
			return $.extend(this._change.n.apply(this, arguments), this._change.e.apply(this, [event, dx, dy]));
		},
		nw: function(event, dx, dy) {
			return $.extend(this._change.n.apply(this, arguments), this._change.w.apply(this, [event, dx, dy]));
		}
	},

	_propagate: function(n, event) {
		$.ui.plugin.call(this, n, [event, this.ui()]);
		(n != "resize" && this._trigger(n, event, this.ui()));
	},

	plugins: {},

	ui: function() {
		return {
			originalElement: this.originalElement,
			element: this.element,
			helper: this.helper,
			position: this.position,
			size: this.size,
			originalSize: this.originalSize,
			originalPosition: this.originalPosition
		};
	}

});

$.extend($.ui.resizable, {
	version: "1.8.15"
});

/*
 * Resizable Extensions
 */

$.ui.plugin.add("resizable", "alsoResize", {

	start: function (event, ui) {
		var self = $(this).data("resizable"), o = self.options;

		var _store = function (exp) {
			$(exp).each(function() {
				var el = $(this);
				el.data("resizable-alsoresize", {
					width: parseInt(el.width(), 10), height: parseInt(el.height(), 10),
					left: parseInt(el.css('left'), 10), top: parseInt(el.css('top'), 10),
					position: el.css('position') // to reset Opera on stop()
				});
			});
		};

		if (typeof(o.alsoResize) == 'object' && !o.alsoResize.parentNode) {
			if (o.alsoResize.length) { o.alsoResize = o.alsoResize[0]; _store(o.alsoResize); }
			else { $.each(o.alsoResize, function (exp) { _store(exp); }); }
		}else{
			_store(o.alsoResize);
		}
	},

	resize: function (event, ui) {
		var self = $(this).data("resizable"), o = self.options, os = self.originalSize, op = self.originalPosition;

		var delta = {
			height: (self.size.height - os.height) || 0, width: (self.size.width - os.width) || 0,
			top: (self.position.top - op.top) || 0, left: (self.position.left - op.left) || 0
		},

		_alsoResize = function (exp, c) {
			$(exp).each(function() {
				var el = $(this), start = $(this).data("resizable-alsoresize"), style = {}, 
					css = c && c.length ? c : el.parents(ui.originalElement[0]).length ? ['width', 'height'] : ['width', 'height', 'top', 'left'];

				$.each(css, function (i, prop) {
					var sum = (start[prop]||0) + (delta[prop]||0);
					if (sum && sum >= 0)
						style[prop] = sum || null;
				});

				// Opera fixing relative position
				if ($.browser.opera && /relative/.test(el.css('position'))) {
					self._revertToRelativePosition = true;
					el.css({ position: 'absolute', top: 'auto', left: 'auto' });
				}

				el.css(style);
			});
		};

		if (typeof(o.alsoResize) == 'object' && !o.alsoResize.nodeType) {
			$.each(o.alsoResize, function (exp, c) { _alsoResize(exp, c); });
		}else{
			_alsoResize(o.alsoResize);
		}
	},

	stop: function (event, ui) {
		var self = $(this).data("resizable"), o = self.options;

		var _reset = function (exp) {
			$(exp).each(function() {
				var el = $(this);
				// reset position for Opera - no need to verify it was changed
				el.css({ position: el.data("resizable-alsoresize").position });
			});
		};

		if (self._revertToRelativePosition) {
			self._revertToRelativePosition = false;
			if (typeof(o.alsoResize) == 'object' && !o.alsoResize.nodeType) {
				$.each(o.alsoResize, function (exp) { _reset(exp); });
			}else{
				_reset(o.alsoResize);
			}
		}

		$(this).removeData("resizable-alsoresize");
	}
});

$.ui.plugin.add("resizable", "animate", {

	stop: function(event, ui) {
		var self = $(this).data("resizable"), o = self.options;

		var pr = self._proportionallyResizeElements, ista = pr.length && (/textarea/i).test(pr[0].nodeName),
					soffseth = ista && $.ui.hasScroll(pr[0], 'left') /* TODO - jump height */ ? 0 : self.sizeDiff.height,
						soffsetw = ista ? 0 : self.sizeDiff.width;

		var style = { width: (self.size.width - soffsetw), height: (self.size.height - soffseth) },
					left = (parseInt(self.element.css('left'), 10) + (self.position.left - self.originalPosition.left)) || null,
						top = (parseInt(self.element.css('top'), 10) + (self.position.top - self.originalPosition.top)) || null;

		self.element.animate(
			$.extend(style, top && left ? { top: top, left: left } : {}), {
				duration: o.animateDuration,
				easing: o.animateEasing,
				step: function() {

					var data = {
						width: parseInt(self.element.css('width'), 10),
						height: parseInt(self.element.css('height'), 10),
						top: parseInt(self.element.css('top'), 10),
						left: parseInt(self.element.css('left'), 10)
					};

					if (pr && pr.length) $(pr[0]).css({ width: data.width, height: data.height });

					// propagating resize, and updating values for each animation step
					self._updateCache(data);
					self._propagate("resize", event);

				}
			}
		);
	}

});

$.ui.plugin.add("resizable", "containment", {

	start: function(event, ui) {
		var self = $(this).data("resizable"), o = self.options, el = self.element;
		var oc = o.containment,	ce = (oc instanceof $) ? oc.get(0) : (/parent/.test(oc)) ? el.parent().get(0) : oc;
		if (!ce) return;

		self.containerElement = $(ce);

		if (/document/.test(oc) || oc == document) {
			self.containerOffset = { left: 0, top: 0 };
			self.containerPosition = { left: 0, top: 0 };

			self.parentData = {
				element: $(document), left: 0, top: 0,
				width: $(document).width(), height: $(document).height() || document.body.parentNode.scrollHeight
			};
		}

		// i'm a node, so compute top, left, right, bottom
		else {
			var element = $(ce), p = [];
			$([ "Top", "Right", "Left", "Bottom" ]).each(function(i, name) { p[i] = num(element.css("padding" + name)); });

			self.containerOffset = element.offset();
			self.containerPosition = element.position();
			self.containerSize = { height: (element.innerHeight() - p[3]), width: (element.innerWidth() - p[1]) };

			var co = self.containerOffset, ch = self.containerSize.height,	cw = self.containerSize.width,
						width = ($.ui.hasScroll(ce, "left") ? ce.scrollWidth : cw ), height = ($.ui.hasScroll(ce) ? ce.scrollHeight : ch);

			self.parentData = {
				element: ce, left: co.left, top: co.top, width: width, height: height
			};
		}
	},

	resize: function(event, ui) {
		var self = $(this).data("resizable"), o = self.options,
				ps = self.containerSize, co = self.containerOffset, cs = self.size, cp = self.position,
				pRatio = self._aspectRatio || event.shiftKey, cop = { top:0, left:0 }, ce = self.containerElement;

		if (ce[0] != document && (/static/).test(ce.css('position'))) cop = co;

		if (cp.left < (self._helper ? co.left : 0)) {
			self.size.width = self.size.width + (self._helper ? (self.position.left - co.left) : (self.position.left - cop.left));
			if (pRatio) self.size.height = self.size.width / o.aspectRatio;
			self.position.left = o.helper ? co.left : 0;
		}

		if (cp.top < (self._helper ? co.top : 0)) {
			self.size.height = self.size.height + (self._helper ? (self.position.top - co.top) : self.position.top);
			if (pRatio) self.size.width = self.size.height * o.aspectRatio;
			self.position.top = self._helper ? co.top : 0;
		}

		self.offset.left = self.parentData.left+self.position.left;
		self.offset.top = self.parentData.top+self.position.top;

		var woset = Math.abs( (self._helper ? self.offset.left - cop.left : (self.offset.left - cop.left)) + self.sizeDiff.width ),
					hoset = Math.abs( (self._helper ? self.offset.top - cop.top : (self.offset.top - co.top)) + self.sizeDiff.height );

		var isParent = self.containerElement.get(0) == self.element.parent().get(0),
		    isOffsetRelative = /relative|absolute/.test(self.containerElement.css('position'));

		if(isParent && isOffsetRelative) woset -= self.parentData.left;

		if (woset + self.size.width >= self.parentData.width) {
			self.size.width = self.parentData.width - woset;
			if (pRatio) self.size.height = self.size.width / self.aspectRatio;
		}

		if (hoset + self.size.height >= self.parentData.height) {
			self.size.height = self.parentData.height - hoset;
			if (pRatio) self.size.width = self.size.height * self.aspectRatio;
		}
	},

	stop: function(event, ui){
		var self = $(this).data("resizable"), o = self.options, cp = self.position,
				co = self.containerOffset, cop = self.containerPosition, ce = self.containerElement;

		var helper = $(self.helper), ho = helper.offset(), w = helper.outerWidth() - self.sizeDiff.width, h = helper.outerHeight() - self.sizeDiff.height;

		if (self._helper && !o.animate && (/relative/).test(ce.css('position')))
			$(this).css({ left: ho.left - cop.left - co.left, width: w, height: h });

		if (self._helper && !o.animate && (/static/).test(ce.css('position')))
			$(this).css({ left: ho.left - cop.left - co.left, width: w, height: h });

	}
});

$.ui.plugin.add("resizable", "ghost", {

	start: function(event, ui) {

		var self = $(this).data("resizable"), o = self.options, cs = self.size;

		self.ghost = self.originalElement.clone();
		self.ghost
			.css({ opacity: .25, display: 'block', position: 'relative', height: cs.height, width: cs.width, margin: 0, left: 0, top: 0 })
			.addClass('om-resizable-ghost')
			.addClass(typeof o.ghost == 'string' ? o.ghost : '');

		self.ghost.appendTo(self.helper);

	},

	resize: function(event, ui){
		var self = $(this).data("resizable"), o = self.options;
		if (self.ghost) self.ghost.css({ position: 'relative', height: self.size.height, width: self.size.width });
	},

	stop: function(event, ui){
		var self = $(this).data("resizable"), o = self.options;
		if (self.ghost && self.helper) self.helper.get(0).removeChild(self.ghost.get(0));
	}

});

$.ui.plugin.add("resizable", "grid", {

	resize: function(event, ui) {
		var self = $(this).data("resizable"), o = self.options, cs = self.size, os = self.originalSize, op = self.originalPosition, a = self.axis, ratio = o._aspectRatio || event.shiftKey;
		o.grid = typeof o.grid == "number" ? [o.grid, o.grid] : o.grid;
		var ox = Math.round((cs.width - os.width) / (o.grid[0]||1)) * (o.grid[0]||1), oy = Math.round((cs.height - os.height) / (o.grid[1]||1)) * (o.grid[1]||1);

		if (/^(se|s|e)$/.test(a)) {
			self.size.width = os.width + ox;
			self.size.height = os.height + oy;
		}
		else if (/^(ne)$/.test(a)) {
			self.size.width = os.width + ox;
			self.size.height = os.height + oy;
			self.position.top = op.top - oy;
		}
		else if (/^(sw)$/.test(a)) {
			self.size.width = os.width + ox;
			self.size.height = os.height + oy;
			self.position.left = op.left - ox;
		}
		else {
			self.size.width = os.width + ox;
			self.size.height = os.height + oy;
			self.position.top = op.top - oy;
			self.position.left = op.left - ox;
		}
	}

});

var num = function(v) {
	return parseInt(v, 10) || 0;
};

var isNumber = function(value) {
	return !isNaN(parseInt(value, 10));
};

})(jQuery);
/*
 * jQuery UI Sortable 1.8.15
 * $Id: jquery.ui.sortable.js,v 1.2 2011/12/06 07:19:29 licongping Exp $
 * Copyright 2011, AUTHORS.txt (http://jqueryui.com/about)
 * Dual licensed under the MIT or GPL Version 2 licenses.
 * http://jquery.org/license
 *
 * http://docs.jquery.com/UI/Sortables
 *
 * Depends:
 *	jquery.ui.core.js
 *	jquery.ui.mouse.js
 *	jquery.ui.widget.js
 */
(function( $, undefined ) {

$.widget("ui.sortable", $.ui.mouse, {
	widgetEventPrefix: "sort",
	options: {
		appendTo: "parent",
		axis: false,
		connectWith: false,
		containment: false,
		cursor: 'auto',
		cursorAt: false,
		dropOnEmpty: true,
		forcePlaceholderSize: false,
		forceHelperSize: false,
		grid: false,
		handle: false,
		helper: "original",
		items: '> *',
		opacity: false,
		placeholder: false,
		revert: false,
		scroll: true,
		scrollSensitivity: 20,
		scrollSpeed: 20,
		scope: "default",
		tolerance: "intersect",
		zIndex: 1000
	},
	_create: function() {

		var o = this.options;
		this.containerCache = {};
		this.element.addClass("ui-sortable");

		//Get the items
		this.refresh();

		//Let's determine if the items are being displayed horizontally
		this.floating = this.items.length ? o.axis === 'x' || (/left|right/).test(this.items[0].item.css('float')) || (/inline|table-cell/).test(this.items[0].item.css('display')) : false;

		//Let's determine the parent's offset
		this.offset = this.element.offset();

		//Initialize mouse events for interaction
		this._mouseInit();

	},

	destroy: function() {
		this.element
			.removeClass("ui-sortable ui-sortable-disabled")
			.removeData("sortable")
			.unbind(".sortable");
		this._mouseDestroy();

		for ( var i = this.items.length - 1; i >= 0; i-- )
			this.items[i].item.removeData("sortable-item");

		return this;
	},

	_setOption: function(key, value){
		if ( key === "disabled" ) {
			this.options[ key ] = value;
	
			this.widget()
				[ value ? "addClass" : "removeClass"]( "ui-sortable-disabled" );
		} else {
			// Don't call widget base _setOption for disable as it adds ui-state-disabled class
			$.Widget.prototype._setOption.apply(this, arguments);
		}
	},

	_mouseCapture: function(event, overrideHandle) {

		if (this.reverting) {
			return false;
		}

		if(this.options.disabled || this.options.type == 'static') return false;

		//We have to refresh the items data once first
		this._refreshItems(event);

		//Find out if the clicked node (or one of its parents) is a actual item in this.items
		var currentItem = null, self = this, nodes = $(event.target).parents().each(function() {
			if($.data(this, 'sortable-item') == self) {
				currentItem = $(this);
				return false;
			}
		});
		if($.data(event.target, 'sortable-item') == self) currentItem = $(event.target);

		if(!currentItem) return false;
		if(this.options.handle && !overrideHandle) {
			var validHandle = false;

			$(this.options.handle, currentItem).find("*").andSelf().each(function() { if(this == event.target) validHandle = true; });
			if(!validHandle) return false;
		}

		this.currentItem = currentItem;
		this._removeCurrentsFromItems();
		return true;

	},

	_mouseStart: function(event, overrideHandle, noActivation) {

		var o = this.options, self = this;
		this.currentContainer = this;

		//We only need to call refreshPositions, because the refreshItems call has been moved to mouseCapture
		this.refreshPositions();

		//Create and append the visible helper
		this.helper = this._createHelper(event);

		//Cache the helper size
		this._cacheHelperProportions();

		/*
		 * - Position generation -
		 * This block generates everything position related - it's the core of draggables.
		 */

		//Cache the margins of the original element
		this._cacheMargins();

		//Get the next scrolling parent
		this.scrollParent = this.helper.scrollParent();

		//The element's absolute position on the page minus margins
		this.offset = this.currentItem.offset();
		this.offset = {
			top: this.offset.top - this.margins.top,
			left: this.offset.left - this.margins.left
		};

		// Only after we got the offset, we can change the helper's position to absolute
		// TODO: Still need to figure out a way to make relative sorting possible
		this.helper.css("position", "absolute");
		this.cssPosition = this.helper.css("position");

		$.extend(this.offset, {
			click: { //Where the click happened, relative to the element
				left: event.pageX - this.offset.left,
				top: event.pageY - this.offset.top
			},
			parent: this._getParentOffset(),
			relative: this._getRelativeOffset() //This is a relative to absolute position minus the actual position calculation - only used for relative positioned helper
		});

		//Generate the original position
		this.originalPosition = this._generatePosition(event);
		this.originalPageX = event.pageX;
		this.originalPageY = event.pageY;

		//Adjust the mouse offset relative to the helper if 'cursorAt' is supplied
		(o.cursorAt && this._adjustOffsetFromHelper(o.cursorAt));

		//Cache the former DOM position
		this.domPosition = { prev: this.currentItem.prev()[0], parent: this.currentItem.parent()[0] };

		//If the helper is not the original, hide the original so it's not playing any role during the drag, won't cause anything bad this way
		if(this.helper[0] != this.currentItem[0]) {
			this.currentItem.hide();
		}

		//Create the placeholder
		this._createPlaceholder();

		//Set a containment if given in the options
		if(o.containment)
			this._setContainment();

		if(o.cursor) { // cursor option
			if ($('body').css("cursor")) this._storedCursor = $('body').css("cursor");
			$('body').css("cursor", o.cursor);
		}

		if(o.opacity) { // opacity option
			if (this.helper.css("opacity")) this._storedOpacity = this.helper.css("opacity");
			this.helper.css("opacity", o.opacity);
		}

		if(o.zIndex) { // zIndex option
			if (this.helper.css("zIndex")) this._storedZIndex = this.helper.css("zIndex");
			this.helper.css("zIndex", o.zIndex);
		}

		//Prepare scrolling
		if(this.scrollParent[0] != document && this.scrollParent[0].tagName != 'HTML')
			this.overflowOffset = this.scrollParent.offset();

		//Call callbacks
		this._trigger("start", event, this._uiHash());

		//Recache the helper size
		if(!this._preserveHelperProportions)
			this._cacheHelperProportions();


		//Post 'activate' events to possible containers
		if(!noActivation) {
			 for (var i = this.containers.length - 1; i >= 0; i--) { this.containers[i]._trigger("activate", event, self._uiHash(this)); }
		}

		//Prepare possible droppables
		if($.ui.ddmanager)
			$.ui.ddmanager.current = this;

		if ($.ui.ddmanager && !o.dropBehaviour)
			$.ui.ddmanager.prepareOffsets(this, event);

		this.dragging = true;

		this.helper.addClass("ui-sortable-helper");
		this._mouseDrag(event); //Execute the drag once - this causes the helper not to be visible before getting its correct position
		return true;

	},

	_mouseDrag: function(event) {

		//Compute the helpers position
		this.position = this._generatePosition(event);
		this.positionAbs = this._convertPositionTo("absolute");

		if (!this.lastPositionAbs) {
			this.lastPositionAbs = this.positionAbs;
		}

		//Do scrolling
		if(this.options.scroll) {
			var o = this.options, scrolled = false;
			if(this.scrollParent[0] != document && this.scrollParent[0].tagName != 'HTML') {

				if((this.overflowOffset.top + this.scrollParent[0].offsetHeight) - event.pageY < o.scrollSensitivity)
					this.scrollParent[0].scrollTop = scrolled = this.scrollParent[0].scrollTop + o.scrollSpeed;
				else if(event.pageY - this.overflowOffset.top < o.scrollSensitivity)
					this.scrollParent[0].scrollTop = scrolled = this.scrollParent[0].scrollTop - o.scrollSpeed;

				if((this.overflowOffset.left + this.scrollParent[0].offsetWidth) - event.pageX < o.scrollSensitivity)
					this.scrollParent[0].scrollLeft = scrolled = this.scrollParent[0].scrollLeft + o.scrollSpeed;
				else if(event.pageX - this.overflowOffset.left < o.scrollSensitivity)
					this.scrollParent[0].scrollLeft = scrolled = this.scrollParent[0].scrollLeft - o.scrollSpeed;

			} else {

				if(event.pageY - $(document).scrollTop() < o.scrollSensitivity)
					scrolled = $(document).scrollTop($(document).scrollTop() - o.scrollSpeed);
				else if($(window).height() - (event.pageY - $(document).scrollTop()) < o.scrollSensitivity)
					scrolled = $(document).scrollTop($(document).scrollTop() + o.scrollSpeed);

				if(event.pageX - $(document).scrollLeft() < o.scrollSensitivity)
					scrolled = $(document).scrollLeft($(document).scrollLeft() - o.scrollSpeed);
				else if($(window).width() - (event.pageX - $(document).scrollLeft()) < o.scrollSensitivity)
					scrolled = $(document).scrollLeft($(document).scrollLeft() + o.scrollSpeed);

			}

			if(scrolled !== false && $.ui.ddmanager && !o.dropBehaviour)
				$.ui.ddmanager.prepareOffsets(this, event);
		}

		//Regenerate the absolute position used for position checks
		this.positionAbs = this._convertPositionTo("absolute");

		//Set the helper position
		if(!this.options.axis || this.options.axis != "y") this.helper[0].style.left = this.position.left+'px';
		if(!this.options.axis || this.options.axis != "x") this.helper[0].style.top = this.position.top+'px';

		//Rearrange
		for (var i = this.items.length - 1; i >= 0; i--) {

			//Cache variables and intersection, continue if no intersection
			var item = this.items[i], itemElement = item.item[0], intersection = this._intersectsWithPointer(item);
			if (!intersection) continue;

			if(itemElement != this.currentItem[0] //cannot intersect with itself
				&&	this.placeholder[intersection == 1 ? "next" : "prev"]()[0] != itemElement //no useless actions that have been done before
				&&	!$.ui.contains(this.placeholder[0], itemElement) //no action if the item moved is the parent of the item checked
				&& (this.options.type == 'semi-dynamic' ? !$.ui.contains(this.element[0], itemElement) : true)
				//&& itemElement.parentNode == this.placeholder[0].parentNode // only rearrange items within the same container
			) {

				this.direction = intersection == 1 ? "down" : "up";

				if (this.options.tolerance == "pointer" || this._intersectsWithSides(item)) {
					this._rearrange(event, item);
				} else {
					break;
				}

				this._trigger("change", event, this._uiHash());
				break;
			}
		}

		//Post events to containers
		this._contactContainers(event);

		//Interconnect with droppables
		if($.ui.ddmanager) $.ui.ddmanager.drag(this, event);

		//Call callbacks
		this._trigger('sort', event, this._uiHash());

		this.lastPositionAbs = this.positionAbs;
		return false;

	},

	_mouseStop: function(event, noPropagation) {

		if(!event) return;

		//If we are using droppables, inform the manager about the drop
		if ($.ui.ddmanager && !this.options.dropBehaviour)
			$.ui.ddmanager.drop(this, event);

		if(this.options.revert) {
			var self = this;
			var cur = self.placeholder.offset();

			self.reverting = true;

			$(this.helper).animate({
				left: cur.left - this.offset.parent.left - self.margins.left + (this.offsetParent[0] == document.body ? 0 : this.offsetParent[0].scrollLeft),
				top: cur.top - this.offset.parent.top - self.margins.top + (this.offsetParent[0] == document.body ? 0 : this.offsetParent[0].scrollTop)
			}, parseInt(this.options.revert, 10) || 500, function() {
				self._clear(event);
			});
		} else {
			this._clear(event, noPropagation);
		}

		return false;

	},

	cancel: function() {

		var self = this;

		if(this.dragging) {

			this._mouseUp({ target: null });

			if(this.options.helper == "original")
				this.currentItem.css(this._storedCSS).removeClass("ui-sortable-helper");
			else
				this.currentItem.show();

			//Post deactivating events to containers
			for (var i = this.containers.length - 1; i >= 0; i--){
				this.containers[i]._trigger("deactivate", null, self._uiHash(this));
				if(this.containers[i].containerCache.over) {
					this.containers[i]._trigger("out", null, self._uiHash(this));
					this.containers[i].containerCache.over = 0;
				}
			}

		}

		if (this.placeholder) {
			//$(this.placeholder[0]).remove(); would have been the jQuery way - unfortunately, it unbinds ALL events from the original node!
			if(this.placeholder[0].parentNode) this.placeholder[0].parentNode.removeChild(this.placeholder[0]);
			if(this.options.helper != "original" && this.helper && this.helper[0].parentNode) this.helper.remove();

			$.extend(this, {
				helper: null,
				dragging: false,
				reverting: false,
				_noFinalSort: null
			});

			if(this.domPosition.prev) {
				$(this.domPosition.prev).after(this.currentItem);
			} else {
				$(this.domPosition.parent).prepend(this.currentItem);
			}
		}

		return this;

	},

	serialize: function(o) {

		var items = this._getItemsAsjQuery(o && o.connected);
		var str = []; o = o || {};

		$(items).each(function() {
			var res = ($(o.item || this).attr(o.attribute || 'id') || '').match(o.expression || (/(.+)[-=_](.+)/));
			if(res) str.push((o.key || res[1]+'[]')+'='+(o.key && o.expression ? res[1] : res[2]));
		});

		if(!str.length && o.key) {
			str.push(o.key + '=');
		}

		return str.join('&');

	},

	toArray: function(o) {

		var items = this._getItemsAsjQuery(o && o.connected);
		var ret = []; o = o || {};

		items.each(function() { ret.push($(o.item || this).attr(o.attribute || 'id') || ''); });
		return ret;

	},

	/* Be careful with the following core functions */
	_intersectsWith: function(item) {

		var x1 = this.positionAbs.left,
			x2 = x1 + this.helperProportions.width,
			y1 = this.positionAbs.top,
			y2 = y1 + this.helperProportions.height;

		var l = item.left,
			r = l + item.width,
			t = item.top,
			b = t + item.height;

		var dyClick = this.offset.click.top,
			dxClick = this.offset.click.left;

		var isOverElement = (y1 + dyClick) > t && (y1 + dyClick) < b && (x1 + dxClick) > l && (x1 + dxClick) < r;

		if(	   this.options.tolerance == "pointer"
			|| this.options.forcePointerForContainers
			|| (this.options.tolerance != "pointer" && this.helperProportions[this.floating ? 'width' : 'height'] > item[this.floating ? 'width' : 'height'])
		) {
			return isOverElement;
		} else {

			return (l < x1 + (this.helperProportions.width / 2) // Right Half
				&& x2 - (this.helperProportions.width / 2) < r // Left Half
				&& t < y1 + (this.helperProportions.height / 2) // Bottom Half
				&& y2 - (this.helperProportions.height / 2) < b ); // Top Half

		}
	},

	_intersectsWithPointer: function(item) {

		var isOverElementHeight = $.ui.isOverAxis(this.positionAbs.top + this.offset.click.top, item.top, item.height),
			isOverElementWidth = $.ui.isOverAxis(this.positionAbs.left + this.offset.click.left, item.left, item.width),
			isOverElement = isOverElementHeight && isOverElementWidth,
			verticalDirection = this._getDragVerticalDirection(),
			horizontalDirection = this._getDragHorizontalDirection();

		if (!isOverElement)
			return false;

		return this.floating ?
			( ((horizontalDirection && horizontalDirection == "right") || verticalDirection == "down") ? 2 : 1 )
			: ( verticalDirection && (verticalDirection == "down" ? 2 : 1) );

	},

	_intersectsWithSides: function(item) {

		var isOverBottomHalf = $.ui.isOverAxis(this.positionAbs.top + this.offset.click.top, item.top + (item.height/2), item.height),
			isOverRightHalf = $.ui.isOverAxis(this.positionAbs.left + this.offset.click.left, item.left + (item.width/2), item.width),
			verticalDirection = this._getDragVerticalDirection(),
			horizontalDirection = this._getDragHorizontalDirection();

		if (this.floating && horizontalDirection) {
			return ((horizontalDirection == "right" && isOverRightHalf) || (horizontalDirection == "left" && !isOverRightHalf));
		} else {
			return verticalDirection && ((verticalDirection == "down" && isOverBottomHalf) || (verticalDirection == "up" && !isOverBottomHalf));
		}

	},

	_getDragVerticalDirection: function() {
		var delta = this.positionAbs.top - this.lastPositionAbs.top;
		return delta != 0 && (delta > 0 ? "down" : "up");
	},

	_getDragHorizontalDirection: function() {
		var delta = this.positionAbs.left - this.lastPositionAbs.left;
		return delta != 0 && (delta > 0 ? "right" : "left");
	},

	refresh: function(event) {
		this._refreshItems(event);
		this.refreshPositions();
		return this;
	},

	_connectWith: function() {
		var options = this.options;
		return options.connectWith.constructor == String
			? [options.connectWith]
			: options.connectWith;
	},
	
	_getItemsAsjQuery: function(connected) {

		var self = this;
		var items = [];
		var queries = [];
		var connectWith = this._connectWith();

		if(connectWith && connected) {
			for (var i = connectWith.length - 1; i >= 0; i--){
				var cur = $(connectWith[i]);
				for (var j = cur.length - 1; j >= 0; j--){
					var inst = $.data(cur[j], 'sortable');
					if(inst && inst != this && !inst.options.disabled) {
						queries.push([$.isFunction(inst.options.items) ? inst.options.items.call(inst.element) : $(inst.options.items, inst.element).not(".ui-sortable-helper").not('.ui-sortable-placeholder'), inst]);
					}
				};
			};
		}

		queries.push([$.isFunction(this.options.items) ? this.options.items.call(this.element, null, { options: this.options, item: this.currentItem }) : $(this.options.items, this.element).not(".ui-sortable-helper").not('.ui-sortable-placeholder'), this]);

		for (var i = queries.length - 1; i >= 0; i--){
			queries[i][0].each(function() {
				items.push(this);
			});
		};

		return $(items);

	},

	_removeCurrentsFromItems: function() {

		var list = this.currentItem.find(":data(sortable-item)");

		for (var i=0; i < this.items.length; i++) {

			for (var j=0; j < list.length; j++) {
				if(list[j] == this.items[i].item[0])
					this.items.splice(i,1);
			};

		};

	},

	_refreshItems: function(event) {

		this.items = [];
		this.containers = [this];
		var items = this.items;
		var self = this;
		var queries = [[$.isFunction(this.options.items) ? this.options.items.call(this.element[0], event, { item: this.currentItem }) : $(this.options.items, this.element), this]];
		var connectWith = this._connectWith();

		if(connectWith) {
			for (var i = connectWith.length - 1; i >= 0; i--){
				var cur = $(connectWith[i]);
				for (var j = cur.length - 1; j >= 0; j--){
					var inst = $.data(cur[j], 'sortable');
					if(inst && inst != this && !inst.options.disabled) {
						queries.push([$.isFunction(inst.options.items) ? inst.options.items.call(inst.element[0], event, { item: this.currentItem }) : $(inst.options.items, inst.element), inst]);
						this.containers.push(inst);
					}
				};
			};
		}

		for (var i = queries.length - 1; i >= 0; i--) {
			var targetData = queries[i][1];
			var _queries = queries[i][0];

			for (var j=0, queriesLength = _queries.length; j < queriesLength; j++) {
				var item = $(_queries[j]);

				item.data('sortable-item', targetData); // Data for target checking (mouse manager)

				items.push({
					item: item,
					instance: targetData,
					width: 0, height: 0,
					left: 0, top: 0
				});
			};
		};

	},

	refreshPositions: function(fast) {

		//This has to be redone because due to the item being moved out/into the offsetParent, the offsetParent's position will change
		if(this.offsetParent && this.helper) {
			this.offset.parent = this._getParentOffset();
		}

		for (var i = this.items.length - 1; i >= 0; i--){
			var item = this.items[i];

			//We ignore calculating positions of all connected containers when we're not over them
			if(item.instance != this.currentContainer && this.currentContainer && item.item[0] != this.currentItem[0])
				continue;

			var t = this.options.toleranceElement ? $(this.options.toleranceElement, item.item) : item.item;

			if (!fast) {
				item.width = t.outerWidth();
				item.height = t.outerHeight();
			}

			var p = t.offset();
			item.left = p.left;
			item.top = p.top;
		};

		if(this.options.custom && this.options.custom.refreshContainers) {
			this.options.custom.refreshContainers.call(this);
		} else {
			for (var i = this.containers.length - 1; i >= 0; i--){
				var p = this.containers[i].element.offset();
				this.containers[i].containerCache.left = p.left;
				this.containers[i].containerCache.top = p.top;
				this.containers[i].containerCache.width	= this.containers[i].element.outerWidth();
				this.containers[i].containerCache.height = this.containers[i].element.outerHeight();
			};
		}

		return this;
	},

	_createPlaceholder: function(that) {

		var self = that || this, o = self.options;

		if(!o.placeholder || o.placeholder.constructor == String) {
			var className = o.placeholder;
			o.placeholder = {
				element: function() {

					var el = $(document.createElement(self.currentItem[0].nodeName))
						.addClass(className || self.currentItem[0].className+" ui-sortable-placeholder")
						.removeClass("ui-sortable-helper")[0];

					if(!className)
						el.style.visibility = "hidden";

					return el;
				},
				update: function(container, p) {

					// 1. If a className is set as 'placeholder option, we don't force sizes - the class is responsible for that
					// 2. The option 'forcePlaceholderSize can be enabled to force it even if a class name is specified
					if(className && !o.forcePlaceholderSize) return;

					//If the element doesn't have a actual height by itself (without styles coming from a stylesheet), it receives the inline height from the dragged item
					if(!p.height()) { p.height(self.currentItem.innerHeight() - parseInt(self.currentItem.css('paddingTop')||0, 10) - parseInt(self.currentItem.css('paddingBottom')||0, 10)); };
					if(!p.width()) { p.width(self.currentItem.innerWidth() - parseInt(self.currentItem.css('paddingLeft')||0, 10) - parseInt(self.currentItem.css('paddingRight')||0, 10)); };
				}
			};
		}

		//Create the placeholder
		self.placeholder = $(o.placeholder.element.call(self.element, self.currentItem));

		//Append it after the actual current item
		self.currentItem.after(self.placeholder);

		//Update the size of the placeholder (TODO: Logic to fuzzy, see line 316/317)
		o.placeholder.update(self, self.placeholder);

	},

	_contactContainers: function(event) {
		
		// get innermost container that intersects with item 
		var innermostContainer = null, innermostIndex = null;		
		
		
		for (var i = this.containers.length - 1; i >= 0; i--){

			// never consider a container that's located within the item itself 
			if($.ui.contains(this.currentItem[0], this.containers[i].element[0]))
				continue;

			if(this._intersectsWith(this.containers[i].containerCache)) {

				// if we've already found a container and it's more "inner" than this, then continue 
				if(innermostContainer && $.ui.contains(this.containers[i].element[0], innermostContainer.element[0]))
					continue;

				innermostContainer = this.containers[i]; 
				innermostIndex = i;
					
			} else {
				// container doesn't intersect. trigger "out" event if necessary 
				if(this.containers[i].containerCache.over) {
					this.containers[i]._trigger("out", event, this._uiHash(this));
					this.containers[i].containerCache.over = 0;
				}
			}

		}
		
		// if no intersecting containers found, return 
		if(!innermostContainer) return; 

		// move the item into the container if it's not there already
		if(this.containers.length === 1) {
			this.containers[innermostIndex]._trigger("over", event, this._uiHash(this));
			this.containers[innermostIndex].containerCache.over = 1;
		} else if(this.currentContainer != this.containers[innermostIndex]) { 

			//When entering a new container, we will find the item with the least distance and append our item near it 
			var dist = 10000; var itemWithLeastDistance = null; var base = this.positionAbs[this.containers[innermostIndex].floating ? 'left' : 'top']; 
			for (var j = this.items.length - 1; j >= 0; j--) { 
				if(!$.ui.contains(this.containers[innermostIndex].element[0], this.items[j].item[0])) continue; 
				var cur = this.items[j][this.containers[innermostIndex].floating ? 'left' : 'top']; 
				if(Math.abs(cur - base) < dist) { 
					dist = Math.abs(cur - base); itemWithLeastDistance = this.items[j]; 
				} 
			} 

			if(!itemWithLeastDistance && !this.options.dropOnEmpty) //Check if dropOnEmpty is enabled 
				return; 

			this.currentContainer = this.containers[innermostIndex]; 
			itemWithLeastDistance ? this._rearrange(event, itemWithLeastDistance, null, true) : this._rearrange(event, null, this.containers[innermostIndex].element, true); 
			this._trigger("change", event, this._uiHash()); 
			this.containers[innermostIndex]._trigger("change", event, this._uiHash(this)); 

			//Update the placeholder 
			this.options.placeholder.update(this.currentContainer, this.placeholder); 
		
			this.containers[innermostIndex]._trigger("over", event, this._uiHash(this)); 
			this.containers[innermostIndex].containerCache.over = 1;
		} 
	
		
	},

	_createHelper: function(event) {

		var o = this.options;
		var helper = $.isFunction(o.helper) ? $(o.helper.apply(this.element[0], [event, this.currentItem])) : (o.helper == 'clone' ? this.currentItem.clone() : this.currentItem);

		if(!helper.parents('body').length) //Add the helper to the DOM if that didn't happen already
			$(o.appendTo != 'parent' ? o.appendTo : this.currentItem[0].parentNode)[0].appendChild(helper[0]);

		if(helper[0] == this.currentItem[0])
			this._storedCSS = { width: this.currentItem[0].style.width, height: this.currentItem[0].style.height, position: this.currentItem.css("position"), top: this.currentItem.css("top"), left: this.currentItem.css("left") };

		if(helper[0].style.width == '' || o.forceHelperSize) helper.width(this.currentItem.width());
		if(helper[0].style.height == '' || o.forceHelperSize) helper.height(this.currentItem.height());

		return helper;

	},

	_adjustOffsetFromHelper: function(obj) {
		if (typeof obj == 'string') {
			obj = obj.split(' ');
		}
		if ($.isArray(obj)) {
			obj = {left: +obj[0], top: +obj[1] || 0};
		}
		if ('left' in obj) {
			this.offset.click.left = obj.left + this.margins.left;
		}
		if ('right' in obj) {
			this.offset.click.left = this.helperProportions.width - obj.right + this.margins.left;
		}
		if ('top' in obj) {
			this.offset.click.top = obj.top + this.margins.top;
		}
		if ('bottom' in obj) {
			this.offset.click.top = this.helperProportions.height - obj.bottom + this.margins.top;
		}
	},

	_getParentOffset: function() {


		//Get the offsetParent and cache its position
		this.offsetParent = this.helper.offsetParent();
		var po = this.offsetParent.offset();

		// This is a special case where we need to modify a offset calculated on start, since the following happened:
		// 1. The position of the helper is absolute, so it's position is calculated based on the next positioned parent
		// 2. The actual offset parent is a child of the scroll parent, and the scroll parent isn't the document, which means that
		//    the scroll is included in the initial calculation of the offset of the parent, and never recalculated upon drag
		if(this.cssPosition == 'absolute' && this.scrollParent[0] != document && $.ui.contains(this.scrollParent[0], this.offsetParent[0])) {
			po.left += this.scrollParent.scrollLeft();
			po.top += this.scrollParent.scrollTop();
		}

		if((this.offsetParent[0] == document.body) //This needs to be actually done for all browsers, since pageX/pageY includes this information
		|| (this.offsetParent[0].tagName && this.offsetParent[0].tagName.toLowerCase() == 'html' && $.browser.msie)) //Ugly IE fix
			po = { top: 0, left: 0 };

		return {
			top: po.top + (parseInt(this.offsetParent.css("borderTopWidth"),10) || 0),
			left: po.left + (parseInt(this.offsetParent.css("borderLeftWidth"),10) || 0)
		};

	},

	_getRelativeOffset: function() {

		if(this.cssPosition == "relative") {
			var p = this.currentItem.position();
			return {
				top: p.top - (parseInt(this.helper.css("top"),10) || 0) + this.scrollParent.scrollTop(),
				left: p.left - (parseInt(this.helper.css("left"),10) || 0) + this.scrollParent.scrollLeft()
			};
		} else {
			return { top: 0, left: 0 };
		}

	},

	_cacheMargins: function() {
		this.margins = {
			left: (parseInt(this.currentItem.css("marginLeft"),10) || 0),
			top: (parseInt(this.currentItem.css("marginTop"),10) || 0)
		};
	},

	_cacheHelperProportions: function() {
		this.helperProportions = {
			width: this.helper.outerWidth(),
			height: this.helper.outerHeight()
		};
	},

	_setContainment: function() {

		var o = this.options;
		if(o.containment == 'parent') o.containment = this.helper[0].parentNode;
		if(o.containment == 'document' || o.containment == 'window') this.containment = [
			0 - this.offset.relative.left - this.offset.parent.left,
			0 - this.offset.relative.top - this.offset.parent.top,
			$(o.containment == 'document' ? document : window).width() - this.helperProportions.width - this.margins.left,
			($(o.containment == 'document' ? document : window).height() || document.body.parentNode.scrollHeight) - this.helperProportions.height - this.margins.top
		];

		if(!(/^(document|window|parent)$/).test(o.containment)) {
			var ce = $(o.containment)[0];
			var co = $(o.containment).offset();
			var over = ($(ce).css("overflow") != 'hidden');

			this.containment = [
				co.left + (parseInt($(ce).css("borderLeftWidth"),10) || 0) + (parseInt($(ce).css("paddingLeft"),10) || 0) - this.margins.left,
				co.top + (parseInt($(ce).css("borderTopWidth"),10) || 0) + (parseInt($(ce).css("paddingTop"),10) || 0) - this.margins.top,
				co.left+(over ? Math.max(ce.scrollWidth,ce.offsetWidth) : ce.offsetWidth) - (parseInt($(ce).css("borderLeftWidth"),10) || 0) - (parseInt($(ce).css("paddingRight"),10) || 0) - this.helperProportions.width - this.margins.left,
				co.top+(over ? Math.max(ce.scrollHeight,ce.offsetHeight) : ce.offsetHeight) - (parseInt($(ce).css("borderTopWidth"),10) || 0) - (parseInt($(ce).css("paddingBottom"),10) || 0) - this.helperProportions.height - this.margins.top
			];
		}

	},

	_convertPositionTo: function(d, pos) {

		if(!pos) pos = this.position;
		var mod = d == "absolute" ? 1 : -1;
		var o = this.options, scroll = this.cssPosition == 'absolute' && !(this.scrollParent[0] != document && $.ui.contains(this.scrollParent[0], this.offsetParent[0])) ? this.offsetParent : this.scrollParent, scrollIsRootNode = (/(html|body)/i).test(scroll[0].tagName);

		return {
			top: (
				pos.top																	// The absolute mouse position
				+ this.offset.relative.top * mod										// Only for relative positioned nodes: Relative offset from element to offset parent
				+ this.offset.parent.top * mod											// The offsetParent's offset without borders (offset + border)
				- ($.browser.safari && this.cssPosition == 'fixed' ? 0 : ( this.cssPosition == 'fixed' ? -this.scrollParent.scrollTop() : ( scrollIsRootNode ? 0 : scroll.scrollTop() ) ) * mod)
			),
			left: (
				pos.left																// The absolute mouse position
				+ this.offset.relative.left * mod										// Only for relative positioned nodes: Relative offset from element to offset parent
				+ this.offset.parent.left * mod											// The offsetParent's offset without borders (offset + border)
				- ($.browser.safari && this.cssPosition == 'fixed' ? 0 : ( this.cssPosition == 'fixed' ? -this.scrollParent.scrollLeft() : scrollIsRootNode ? 0 : scroll.scrollLeft() ) * mod)
			)
		};

	},

	_generatePosition: function(event) {

		var o = this.options, scroll = this.cssPosition == 'absolute' && !(this.scrollParent[0] != document && $.ui.contains(this.scrollParent[0], this.offsetParent[0])) ? this.offsetParent : this.scrollParent, scrollIsRootNode = (/(html|body)/i).test(scroll[0].tagName);

		// This is another very weird special case that only happens for relative elements:
		// 1. If the css position is relative
		// 2. and the scroll parent is the document or similar to the offset parent
		// we have to refresh the relative offset during the scroll so there are no jumps
		if(this.cssPosition == 'relative' && !(this.scrollParent[0] != document && this.scrollParent[0] != this.offsetParent[0])) {
			this.offset.relative = this._getRelativeOffset();
		}

		var pageX = event.pageX;
		var pageY = event.pageY;

		/*
		 * - Position constraining -
		 * Constrain the position to a mix of grid, containment.
		 */

		if(this.originalPosition) { //If we are not dragging yet, we won't check for options

			if(this.containment) {
				if(event.pageX - this.offset.click.left < this.containment[0]) pageX = this.containment[0] + this.offset.click.left;
				if(event.pageY - this.offset.click.top < this.containment[1]) pageY = this.containment[1] + this.offset.click.top;
				if(event.pageX - this.offset.click.left > this.containment[2]) pageX = this.containment[2] + this.offset.click.left;
				if(event.pageY - this.offset.click.top > this.containment[3]) pageY = this.containment[3] + this.offset.click.top;
			}

			if(o.grid) {
				var top = this.originalPageY + Math.round((pageY - this.originalPageY) / o.grid[1]) * o.grid[1];
				pageY = this.containment ? (!(top - this.offset.click.top < this.containment[1] || top - this.offset.click.top > this.containment[3]) ? top : (!(top - this.offset.click.top < this.containment[1]) ? top - o.grid[1] : top + o.grid[1])) : top;

				var left = this.originalPageX + Math.round((pageX - this.originalPageX) / o.grid[0]) * o.grid[0];
				pageX = this.containment ? (!(left - this.offset.click.left < this.containment[0] || left - this.offset.click.left > this.containment[2]) ? left : (!(left - this.offset.click.left < this.containment[0]) ? left - o.grid[0] : left + o.grid[0])) : left;
			}

		}

		return {
			top: (
				pageY																// The absolute mouse position
				- this.offset.click.top													// Click offset (relative to the element)
				- this.offset.relative.top												// Only for relative positioned nodes: Relative offset from element to offset parent
				- this.offset.parent.top												// The offsetParent's offset without borders (offset + border)
				+ ($.browser.safari && this.cssPosition == 'fixed' ? 0 : ( this.cssPosition == 'fixed' ? -this.scrollParent.scrollTop() : ( scrollIsRootNode ? 0 : scroll.scrollTop() ) ))
			),
			left: (
				pageX																// The absolute mouse position
				- this.offset.click.left												// Click offset (relative to the element)
				- this.offset.relative.left												// Only for relative positioned nodes: Relative offset from element to offset parent
				- this.offset.parent.left												// The offsetParent's offset without borders (offset + border)
				+ ($.browser.safari && this.cssPosition == 'fixed' ? 0 : ( this.cssPosition == 'fixed' ? -this.scrollParent.scrollLeft() : scrollIsRootNode ? 0 : scroll.scrollLeft() ))
			)
		};

	},

	_rearrange: function(event, i, a, hardRefresh) {

		a ? a[0].appendChild(this.placeholder[0]) : i.item[0].parentNode.insertBefore(this.placeholder[0], (this.direction == 'down' ? i.item[0] : i.item[0].nextSibling));

		//Various things done here to improve the performance:
		// 1. we create a setTimeout, that calls refreshPositions
		// 2. on the instance, we have a counter variable, that get's higher after every append
		// 3. on the local scope, we copy the counter variable, and check in the timeout, if it's still the same
		// 4. this lets only the last addition to the timeout stack through
		this.counter = this.counter ? ++this.counter : 1;
		var self = this, counter = this.counter;

		window.setTimeout(function() {
			if(counter == self.counter) self.refreshPositions(!hardRefresh); //Precompute after each DOM insertion, NOT on mousemove
		},0);

	},

	_clear: function(event, noPropagation) {

		this.reverting = false;
		// We delay all events that have to be triggered to after the point where the placeholder has been removed and
		// everything else normalized again
		var delayedTriggers = [], self = this;

		// We first have to update the dom position of the actual currentItem
		// Note: don't do it if the current item is already removed (by a user), or it gets reappended (see #4088)
		if(!this._noFinalSort && this.currentItem.parent().length) this.placeholder.before(this.currentItem);
		this._noFinalSort = null;

		if(this.helper[0] == this.currentItem[0]) {
			for(var i in this._storedCSS) {
				if(this._storedCSS[i] == 'auto' || this._storedCSS[i] == 'static') this._storedCSS[i] = '';
			}
			this.currentItem.css(this._storedCSS).removeClass("ui-sortable-helper");
		} else {
			this.currentItem.show();
		}

		if(this.fromOutside && !noPropagation) delayedTriggers.push(function(event) { this._trigger("receive", event, this._uiHash(this.fromOutside)); });
		if((this.fromOutside || this.domPosition.prev != this.currentItem.prev().not(".ui-sortable-helper")[0] || this.domPosition.parent != this.currentItem.parent()[0]) && !noPropagation) delayedTriggers.push(function(event) { this._trigger("update", event, this._uiHash()); }); //Trigger update callback if the DOM position has changed
		if(!$.ui.contains(this.element[0], this.currentItem[0])) { //Node was moved out of the current element
			if(!noPropagation) delayedTriggers.push(function(event) { this._trigger("remove", event, this._uiHash()); });
			for (var i = this.containers.length - 1; i >= 0; i--){
				if($.ui.contains(this.containers[i].element[0], this.currentItem[0]) && !noPropagation) {
					delayedTriggers.push((function(c) { return function(event) { c._trigger("receive", event, this._uiHash(this)); };  }).call(this, this.containers[i]));
					delayedTriggers.push((function(c) { return function(event) { c._trigger("update", event, this._uiHash(this));  }; }).call(this, this.containers[i]));
				}
			};
		};

		//Post events to containers
		for (var i = this.containers.length - 1; i >= 0; i--){
			if(!noPropagation) delayedTriggers.push((function(c) { return function(event) { c._trigger("deactivate", event, this._uiHash(this)); };  }).call(this, this.containers[i]));
			if(this.containers[i].containerCache.over) {
				delayedTriggers.push((function(c) { return function(event) { c._trigger("out", event, this._uiHash(this)); };  }).call(this, this.containers[i]));
				this.containers[i].containerCache.over = 0;
			}
		}

		//Do what was originally in plugins
		if(this._storedCursor) $('body').css("cursor", this._storedCursor); //Reset cursor
		if(this._storedOpacity) this.helper.css("opacity", this._storedOpacity); //Reset opacity
		if(this._storedZIndex) this.helper.css("zIndex", this._storedZIndex == 'auto' ? '' : this._storedZIndex); //Reset z-index

		this.dragging = false;
		if(this.cancelHelperRemoval) {
			if(!noPropagation) {
				this._trigger("beforeStop", event, this._uiHash());
				for (var i=0; i < delayedTriggers.length; i++) { delayedTriggers[i].call(this, event); }; //Trigger all delayed events
				this._trigger("stop", event, this._uiHash());
			}
			return false;
		}

		if(!noPropagation) this._trigger("beforeStop", event, this._uiHash());

		//$(this.placeholder[0]).remove(); would have been the jQuery way - unfortunately, it unbinds ALL events from the original node!
		this.placeholder[0].parentNode.removeChild(this.placeholder[0]);

		if(this.helper[0] != this.currentItem[0]) this.helper.remove(); this.helper = null;

		if(!noPropagation) {
			for (var i=0; i < delayedTriggers.length; i++) { delayedTriggers[i].call(this, event); }; //Trigger all delayed events
			this._trigger("stop", event, this._uiHash());
		}

		this.fromOutside = false;
		return true;

	},

	_trigger: function() {
		if ($.Widget.prototype._trigger.apply(this, arguments) === false) {
			this.cancel();
		}
	},

	_uiHash: function(inst) {
		var self = inst || this;
		return {
			helper: self.helper,
			placeholder: self.placeholder || $([]),
			position: self.position,
			originalPosition: self.originalPosition,
			offset: self.positionAbs,
			item: self.currentItem,
			sender: inst ? inst.element : null
		};
	}

});

$.extend($.ui.sortable, {
	version: "1.8.15"
});

})(jQuery);
/*
 * $Id: om-panel.js,v 1.22 2011/12/22 08:26:59 licongping Exp $
 * operamasks-ui omPanel 1.0
 *
 * Copyright 2011, AUTHORS.txt (http://ui.operamasks.org/about)
 * Dual licensed under the MIT or GPL Version 2 licenses.
 * http://ui.operamasks.org/license
 *
 * http://ui.operamasks.org/docs/
 *
 * Depends:
 */
/**
 * $('#divId').omPanel({ width : 400, height : 400, noHeader : false, title :
 * 'PanelTitle1', content : 'This is panel Content' // innerHTML //collapsible :
 * true,
 * 
 * });
 */
(function() {

    var defaultConfig = {
        title : null,
        iconCls : null,
        width : "auto",
        height : "auto",
        left : null,
        top : null,
        cls : null,
        headerCls : null,
        bodyCls : null,
        style : {},
        href : null,
        cache : true,
        fit : false,
        border : true, //TODO
        doSize : true,
        noHeader : false,
        clickExpand : false,
        content : null,
        url : null,
        collapsible : false,
        minimizable : false,
        maximizable : false,
        closable : false,
        collapsed : false,
        minimized : false,
        maximized : false,
        closed : false,
        tools : [],
        lazyLoad : false,
        loadingMessage : "Loading...",
        extractor : function(_67) {
            var _68 = /<body[^>]*>((.|[\n\r])*)<\/body>/im;
            var _69 = _68.exec(_67);
            if (_69) {
                return _69[1];
            } else {
                return _67;
            }
        },
        onLoad : function() {
        },
        onBeforeOpen : function() {
        },
        onOpen : function() {
        },
        onBeforeClose : function() {
        },
        onClose : function() {
        },
        onBeforeDestroy : function() {
        },
        onDestroy : function() {
        },
        onResize : function(_6a, _6b) {
        },
        onMove : function(_6c, top) {
        },
        onMaximize : function() {
        },
        onRestore : function() {
        },
        onMinimize : function() {
        },
        onBeforeCollapse : function() {
        },
        onBeforeExpand : function() {
        },
        onCollapse : function() {
        },
        onExpand : function() {
        }
    };
    function wrapInPanel(self) {
        var panel = $(self).addClass('om-panel-body om-widget-content').wrap(
                '<div class="om-panel"></div>').parent();
        return panel;
    };

    function render(self) {
        var data = $.data(self, 'panel');
        var options = data.options,
            panel = data.panel;
        var styles = panel.attr('style');
        if ((styles && styles.indexOf('width') != -1 )|| options.width == 'auto') {
        	//just use it, do nothing 
        } else if (options.width == 'fit') {
        	panel.css('width', '100%');
        } else if ( !!options.width ){
        	//other height value, use it anyway
            panel.css('width', options.width);
        }
        if ((styles && styles.indexOf('height') != -1 )|| options.height == 'auto') {
        	//just use it, do nothing 
        } else if (options.height == 'fit') {
        	panel.css('height', '100%');
        } else if ( !!options.height ){
        	//other height value, use it anyway
            panel.css('height', options.height);
        }
        renderHeader(self);
        renderBody(self);
    };

    function renderHeader(self) {
        var data = $.data(self, 'panel');
        var options = data.options,
            panel = data.panel;
        if (options.title && !options.noHeader) {
            var header = $('<div class="om-panel-header"></div>').prependTo(panel);
            if (options.clickExpand) {
                header.addClass("om-state-cursor-pointer");
            }
            var title = $('<div class="om-panel-title"></div>').html(options.title);
            if (options.iconCls) {
                var icon = $('<div class="om-panel-icon"></div>').appendTo(
                        header);
                icon.addClass(options.iconCls);
            }
            title.appendTo(header);
            var tools = $('<div class="om-panel-tool"></div>').appendTo(header);
            var closeIcon, minIcon, maxIcon, collapseIcon;
            if (contain(options.tools, 'collapse')) {
                collapseIcon = $('<div class="om-panel-tool-collapse"></div>')
                        .prependTo(tools);
            }
            if (contain(options.tools, 'min')) {
                minIcon = $('<div class="om-panel-tool-min"></div>').prependTo(
                        tools);
            }
            if (contain(options.tools, 'max')) {
                maxIcon = $('<div class="om-panel-tool-max"></div>').prependTo(
                        tools);
            }
            if (options.closable || contain(options.tools, 'close')) {
                closeIcon = $('<div class="om-panel-tool-close"></div>')
                        .prependTo(tools);
            }
        }

        function contain(array, key) {
            var i = array.length;
            while (i--)
                if (array[i] == key) {
                    return true;
                }
            return false;
        };

    };
    function renderBody(self) {
        var data = $.data(self, 'panel');
        var options = data.options,
            panel = data.panel;
        var body = panel.find('>.om-panel-body');
        
        if (options.noHeader || !options.title) {
            body.addClass('om-panel-body-noheader');
        } else {
            body.removeClass('om-panel-body-noheader');
        }
        // apply content
        if (!options.lazyLoad ) {
            _reload(self);
        }
        // border
        if (options.border == false) {
            body.addClass('om-panel-body-noborder');
        } else {
            body.removeClass('om-panel-body-noborder');
        }
        
        // adjust height.
        var styles = body.attr('style');
        if (( styles && styles.indexOf('height') != -1 ) || options.height == 'auto' ) {
        	//just leave it , do nothing
        } else {
        	// fit the parent
        	var pwm = body.outerHeight() - body.height();// paddings + margins + line-width
        	body.css('height', panel.innerHeight() - panel.find('>.om-panel-header').outerHeight() - pwm);
        }
        // adjust margins
        panel.css({
            'marginTop' : body.css('marginTop'),
            'marginRight' : body.css('marginRight'),
            'marginBottom' : body.css('marginBottom'),
            'marginLeft' : body.css('marginLeft')
        });
        body.css({
            'marginTop' : 0,
            'marginRight' : 0,
            'marginBottom' : 0,
            'marginLeft' : 0,
            'display' : 'block'
        });

    };

    function afterRender(self) {
        // handle panel status
        var data = $.data(self, 'panel');
        var options = data.options,
            panel = data.panel;
        if (options.closed == true) {
            $(self).omPanel('close');
        } else if (options.maximized == true) {
            $(self).omPanel('maximize');
        } else if (options.minimized == true) {
            $(self).omPanel('minimize');
        }
        if (options.collapsed == true) {
            $(self).omPanel('collapse');
        }
        
    };

    function buildEvent(self) {
        // attachEvents
        var data = $.data(self, 'panel');
        var options = data.options,
            panel = data.panel;
        var tools = panel.find('>div.om-panel-header >div.om-panel-tool');
        tools.find('.om-panel-tool-close').click(function() {
            $(self).omPanel('close', true);
            return false;
        });
        tools.find('.om-panel-tool-max').click(function() {
            alert('not implemented yet!');
            return false;
        });
        tools.find('.om-panel-tool-min').click(function() {
            alert('not implemented yet!');
            return false;
        });
        tools.find('.om-panel-tool-collapse').click(function() {
            if (options.collapsed == true) {
                $(self).omPanel('expand', true);
            } else {
                $(self).omPanel('collapse', true);
            }
            return false;
        });
        //click header to expand or collapse
        if (options.clickExpand) {
            panel.find('>div.om-panel-header').click(function() {
                if (options.collapsed == true) {
                    $(self).omPanel('expand', true);
                } else {
                    $(self).omPanel('collapse', true);
                }
                return false;
            });
        }
    };
    
    function purgeEvent(self) {
        var data = $.data(self, 'panel');
        var options = data.options,
            panel = data.panel;
        var header = panel.find('>div.om-panel-header');
        var tools = header.find('>div.om-panel-tool');
        header.unbind();
        tools.children().unbind();
    }

    // private methods
    // show and hide
    function _show(self, anim, speed) {
        var data = $.data(self, 'panel');
        var options = data.options,
            panel = data.panel;
        if (options.onBeforeOpen.call(self) == false) {
            return false;
        }
        var isLoaded = $.data(self, "panel").isLoaded;
        if (!isLoaded) {
            _reload(self);
        }
        
        panel.hide();
        panel.css({
            position : 'static',
            left : 'auto',
            top : 'auto'
        });
        if (anim == true) {
            panel.fadeIn(speed || 'normal', function() {
                options.closed = false;
                options.minimized = false;
                options.onOpen.call(self);
            });
        } else {
            panel.show();
            options.closed = false;
            options.minimized = false;
            options.onOpen.call(self);
        }
    };
    function _hide(self, anim, speed) {
        var data = $.data(self, 'panel');
        var options = data.options,
            panel = data.panel;
        if (options.onBeforeClose.call(self) == false) {
            return false;
        }
        if (anim == true) {
            panel.fadeOut(speed || 'normal', function() {
                options.closed = true;
                panel.css({
                    position : 'absolute',
                    left : -50000,
                    top : -50000
                });
                panel.show();
                options.onClose.call(self);
            });
        } else {
            options.closed = true;
            panel.css({
                position : 'absolute',
                left : -50000,
                top : -50000
            });
            options.onClose.call(self);
        }
    };

    // collapse and expand
    function _collapse(self, anim, speed) {
        var data = $.data(self, 'panel');
        var options = data.options,
            panel = data.panel;
        var header = panel.find('>div.om-panel-header'),
            collapse = header.find('div.om-panel-tool-collapse');
        if (collapse.length == 0) {
            return;
        }
        if (options.onBeforeCollapse.call(self) == false) {
            return false;
        }

        header.removeClass('om-panel-expanded').addClass('om-panel-collapsed');
        collapse.removeClass('om-panel-tool-collapse').addClass(
                'om-panel-tool-expand');
        if (anim) {
            panel.find('>div.om-panel-body').slideUp(speed || 'slow', function() {
                options.collapsed = true;
                options.onCollapse.call(self);
            });
        } else {
            panel.find('>div.om-panel-body').hide();
            options.collapsed = true;
            options.onCollapse.call(self);
        }

    };
    function _expand(self, anim, speed) {
        var data = $.data(self, 'panel');
        var options = data.options,
            panel = data.panel;
        var header = panel.find('>div.om-panel-header'),
            expand = header.find('div.om-panel-tool-expand');
        if (expand.length == 0) {
            return;
        }
        if (options.onBeforeExpand.call(self) == false) {
            return false;
        }

        header.removeClass('om-panel-collapsed').addClass('om-panel-expanded');
        expand.removeClass('om-panel-tool-expand').addClass(
                'om-panel-tool-collapse');
        
        if (anim) {
            panel.find('>div.om-panel-body').slideDown(speed || 'normal', function() {
                options.collapsed = false;
                options.onExpand.call(self);
            });
        } else {
            panel.find('>div.om-panel-body').show();
            options.collapsed = false;
            options.onExpand.call(self);
        }
    };

    // title and content
    function _setTitle(self, title) {
        var data = $.data(self, 'panel');
        var options = data.options,
            panel = data.panel;
        options.title = title;
        panel.find('>div.om-panel-header div.om-panel-title').html(title);
    };
    function _setDataSource(self, ds, isAjax) {
        if (!(ds = $.trim(ds))) {
            return false;
        }
        var options = $.data(self, 'panel').options;
        options.content = options.url = null;
        isAjax == true ? options.url = ds : options.content = ds;
        $.data(self,'panel') && ($.data(self, 'panel').isLoaded = false);
    };
    
    //使用options.content和options.url重新装载数据
    function _reload(self) {
        var data = $.data(self, 'panel');
        var options = data.options,
            panel = data.panel;
        var body = panel.find('>.om-panel-body');
        if ($.data(self, 'panel').isLoading ){
            return;
        };
        $.data(self, 'panel').isLoading = true;
        if (options.url) {
            body.load(options.url, function(res,status,xhr){
                if (status == 'success'){
                    if ($.data(self, 'panel')) {
                        $.data(self, 'panel').isLoaded = true;
                        $.data(self, 'panel').isLoading = false;
                        options.onLoad.call(self);
                    }
                }
            });
        } else if(options.content){
        	body.html(options.content);
        	$.data(self, 'panel').isLoading = false;
        } else {
            $.data(self, 'panel').isLoading = false;
        }
    };
    
    function _disable(self) {
        var data = $.data(self, 'panel');
        var options = data.options,
            panel = data.panel;
        if (!panel.hasClass('om-state-disabled')) {
            panel.addClass('om-state-disabled');
            var header  = $(self).omPanel("header");
            header.addClass("om-state-disabled");
            header.removeClass("om-state-cursor-pointer");
            header.find(">div.om-panel-icon").addClass("om-panel-icon-disabled");
            $(self).omPanel("body").addClass("om-state-disabled");
        }
        purgeEvent(self);
    };
    
    function _enable(self) {
        var data = $.data(self, 'panel');
        var options = data.options,
            panel = data.panel;
        if (panel.hasClass('om-state-disabled')) {
            panel.removeClass('om-state-disabled');
            var header  = $(self).omPanel("header");
            header.removeClass("om-state-disabled");
            header.find(">div.om-panel-icon").removeClass("om-panel-icon-disabled");
            $(self).omPanel("body").removeClass("om-state-disabled");
        }
        $(self).omPanel("header").addClass("om-state-cursor-pointer");
        buildEvent(self);
    };

    // ---end private methods

    // public methods
    var publicMethods = {
        options : function(p) {
            var options = $.data(this[0], "panel").options;
            if (p) {
                $.extend(options, p);
            }
            return options;
        },
        panel : function() {
            return $.data(this[0], "panel").panel;
        },
        header : function() {
            return $.data(this[0], "panel").panel.find(">div.om-panel-header");
        },
        body : function() {
            return $.data(this[0], "panel").panel.find(">div.om-panel-body");
        },
        setTitle : function(title) {
            return this.each(function() {
                _setTitle(this, title);
            });
        },
        /**
         * 设置数据源
         * @param ds 数据源,可额为jQuery对象,或者选择器,或者URL
         * @param isAjax 是否是URL
         * @returns
         */
        setDataSource : function(ds, isAjax) {
            return this.each(function() {
                _setDataSource(this, ds, isAjax);
            });
        },
        open : function(anim, speed) {
            return this.each(function() {
                _show(this, anim, speed);
            });
        },
        close : function(anim, speed) {
            return this.each(function() {
                _hide(this, anim, speed);
            });
        },
        disable : function() {
            return this.each(function() {
                _disable(this);
            });
        },
        enable : function() {
            return this.each(function() {
                _enable(this);
            });
        },
        collapse : function(anim, speed) {
            return this.each(function() {
                _collapse(this, anim, speed);
            });
        },
        expand : function(anim, speed) {
            return this.each(function() {
                _expand(this, anim, speed);
            });
        },

        reload : function(ds, isAjax) {
            return this.each(function() {
                _setDataSource(this, ds, isAjax);
                _reload(this);
            });
        },
        
        destroy : function(_60) {
            return this.each(function() {
                _30(this, _60);
            });
        },
        resize : function(_62) {
            return this.each(function() {
                resize(this, _62);
            });
        },
        move : function(_63) {
            return this.each(function() {
                _a(this, _63);
            });
        },
        maximize : function() {
            return this.each(function() {
                _2a(this);
            });
        },
        minimize : function() {
            return this.each(function() {
                _46(this);
            });
        },
        restore : function() {
            return this.each(function() {
                _4a(this);
            });
        }

    };

    /**
     * 根据config对象,将this指向的div包装成一个omPanel.如果config.url不为空则按需加载.否则不处理.
     */
    $.fn.omPanel = function(p) {
        if (p && typeof (p) == 'string') {
            if (publicMethods[p]) {
                return publicMethods[p].apply(this, Array.prototype.slice.call(
                        arguments, 1));
            }
            return null;
        }
        return this.each(function() {
            var pData = $.data(this, 'panel');
            var options;
            if (pData) {
                $.extend(pData.options, p);
            } else {
                options = $.extend({}, defaultConfig, p);
                pData = $.data(this, 'panel', {
                    options : options,
                    panel : wrapInPanel(this),
                    isLoaded : false,
                    isLoading : false
                });
            }
            render(this);
            afterRender(this);
            buildEvent(this);
        });
    };

})(jQuery);/*
 * $Id: jquery.validate.js,v 1.14 2012/01/09 07:55:53 linxiaomin Exp $
 * operamasks-ui validate 1.0
 *
 * Copyright 2011, AUTHORS.txt (http://ui.operamasks.org/about)
 * Dual licensed under the MIT or GPL Version 2 licenses.
 * http://ui.operamasks.org/license
 *
 * http://ui.operamasks.org/docs/
 */

;(function($) {

/**
 * @class
 * <div>
 * <b>简介</b><br/>
 * validate() 可以方便地对Html Form进行校验. 
 * </div>
 * <div>
 *  <pre>
 * 1、本校验框架提供了丰富的校验规则，满足常用的校验需求。
 *    内置的校验规则有
 <table border="1">
  <tr>
    <td align="center" style="font-weight: bolder;">rule名称</td>
    <td align="center" style="font-weight: bolder;">说明</td>
    <td align="center" style="font-weight: bolder;">默认提示</td>
  </tr>
  <tr>
    <td>required</td>
    <td>值必须输入</td>
    <td>This field is required.</td>
  </tr>
  <tr>
    <td>min</td>
    <td>能输入的最小值</td>
    <td>$.validator.format("Please enter a value greater than or equal to {0}.")</td>
  </tr>
  <tr>
    <td>max</td>
    <td>能输入的最大值</td>
    <td>$.validator.format("Please enter a value less than or equal to {0}."),</td>
  </tr>
  <tr>
    <td>minlength</td>
    <td>必须输入minlength长度的字符</td>
    <td>$.validator.format("Please enter at least {0} characters.")</td>
  </tr>
  <tr>
    <td>maxlength</td>
    <td>最多能输入maxlength长度的字符</td>
    <td>$.validator.format("Please enter no more than {0} characters.")</td>
  </tr>
  <tr>
    <td>email</td>
    <td>邮件格式</td>
    <td>Please enter a valid email address.</td>
  </tr>
  <tr>
    <td>url</td>
    <td>url地址格式</td>
    <td>Please enter a valid URL.</td>
  </tr>
  <tr>
    <td>date</td>
    <td>日期格式</td>
    <td>Please enter a valid date.</td>
  </tr>
  <tr>
    <td>number</td>
    <td>数字格式</td>
    <td>Please enter a valid number.</td>
  </tr>
  <tr>
    <td>rangelength</td>
    <td>输入字符长度在某一个范围，有两个参数传入</td>
    <td>$.validator.format("Please enter a value between {0} and {1} characters long.")</td>
  </tr>
  <tr>
    <td>accept</td>
    <td>可以接受的文件格式</td>
    <td>Please enter a value with a valid extension.</td>
  </tr>
  <tr>
    <td>equalTo</td>
    <td>和已经有的属性做对比（适合重输密码）</td>
    <td>Please enter the same value again.</td>
  </tr>
  <tr>
    <td>range</td>
    <td>输入的数值必须在某一个范围，传入两个参数</td>
    <td>$.validator.format("Please enter a value between {0} and {1}.")</td>
  </tr>
  <tr>
    <td>digits</td>
    <td>必须输入数字</td>
    <td>Please enter only digits.</td>
  </tr>
</table>
 *    
 * 2、提供灵活的校验信息展现风格，你可以让信息展现在校验元素尾部，也可以让它展现在你想要的任何div里面，
 *    对于空间比较吃紧的form表单，也可以采用鼠标移动到提示图标悬浮显示提示信息的方式。这些主要通过配置
 *    errorPlacement(定制错误信息显示)、showErrors(自定义消息处理，onblur/keyup触发，针对当前元素)
 *    只要你够强大，它就有多强大。
 *  
 * 3、提供了灵活的接口用于增加校验规则，当我们提供的校验规则不能满足您的需求的时候，你可以自定义校验
 *    规则，通过$.validator.addMethod("hasreg", function(value,element,params) {return true/false;},"message")的方式实现
 *   </pre>
 * </div>
 * <b>如何使用</b><br/>
 * 1、基本结构
 *    <pre>
 *      $("#reg").validate({
 *         onkeyup : true,
 *         rules : {
 *           password : {
                        required : true,
                        minlength : 5
             }
 *         },
 *         messages : {
 *           password : {
                        required : '密码必须输入',
                        minlength : '密码不能小于5位'
             }
 *         }
 *      });
 *     
 *    上面就是基本的校验结构，reg是需要校验的form的id，password是需要校验的字段的name
 *    (<span style="color:red;">必须配置name，否则将不能校验</span>)rules和messages是成对出现的，如果只配置了rules没有配置messages，
 *    系统将使用默认提示信息。
 * 2、自定义校验规则
 *      $.validator.addMethod("hasreg", function(value) {
 *              return value != 'admin';
 *       }, '此用户已经被注册');
 *       //模拟用户名是否已经被注册，真实的场景应该是使用ajax向后台发送请求，然后后台返回结果，
 *       //需要注意的是必须使用同步请求，异步请求将无效。
 *    
 *    现在就已经有了一个新的rules “hasreg”，它的使用同系统内置的规则一样，在需要校验
 *    的字段里面配置hasreg:true，因为messages已经配置，故可以不写。
 * 3、自定义信息展示
 *    框架默认的是在内容后面增加一个&lt;label for="username" generated="true" class="error"&gt;请输入用
 *    户名&lt;/label&gt;，同时在校验的元素上面增加class="error"属性，如果你想要一些效果，请编写error样式。
 *    如果这种提示方式不是你想要的，或者你不希望它来包装你的提示信息，你需要用到两个方法
 *    errorPlacement、showErrors鉴于这两个方法的复杂性和强自定义性，下面对他们做一个详细的说明。
 *    1)、errorPlacement
 *        错误信息展示，有两个参数error和element，error是生成的错误对象；element为当前元素。
 *        errorPlacement : function(error, element) { 
 *                   if(error){    //error存在的时候
 *                       $('#showMsg').html(error); //showMsg为你自定义的信息显示区域的id。
 *                   }
 *               }
 *     2)、showErrors
 *         它负责处理事件，当错误产生的时候它会将错误信息显示出来，错误消除时它负责将错误信息隐藏
 *         如果自定义了错误展示，而另外一部分还是默认的行为，则请调用this.defaultShowErrors()
 *         以便默认行为生效，它也有两个参数，分别是errorMap和errorList，是所有错误的集合。
 *         showErrors: function(errorMap, errorList) {
 *                   if(errorList && errorList.length > 0){  //如果存在错误信息
 *                       $.each(errorList,function(index,obj){ //遍历错误信息 ，index为错误信息的索引号，
 *                                                             //obj为当前错误信息对象
 *                           var msg = this.message;           //获取当前错误信息文本
 *                           //这里编写一些代码处理你的错误信息
 *                      });
 *                   }else{
 *                       //错误信息已经消除，此处要写隐藏错误信息的代码，
 *                       //通过this.currentElements获取当前对象
 *                   }
 *                   this.defaultShowErrors();  //如果还有默认的行为，请调用它。
 *               }
 * 4、定制提交方式(ajax提交)
 *   如果使用ajax方式提交，那请采用如下两种方式和校验框架结合
 *   1)、使用submitHandler属性配置ajax提交，submithandler：当表单全部校验通过之后会回调配置的代码，此处也就是当校验通过之后
 *      调用ajax提交，详细代码请察看“ajax表单提交校验”示例代码。
 *   2)、使用valid方法，监听form的submit事件，当$('#form').valid()返回true的时候再提交。
 *       //通过监听form的submit事件，对form进行ajax提交。
         $('#formId').submit(function() {
             if (!$("#formId").valid()) 
                 return false;
             $(this).omAjaxSubmit({});
             return false; //此处必须返回false，阻止常规的form提交
         });
 *   
 * </pre>
 * 
 * @name validate
 * @constructor
 * @param options 标准config对象
 */
$.extend($.fn, {
	// http://docs.jquery.com/Plugins/Validation/validate
	validate: function( options ) {

		// if nothing is selected, return nothing; can't chain anyway
		if (!this.length) {
			options && options.debug && window.console && console.warn( "nothing selected, can't validate, returning nothing" );
			return;
		}

		// check if a validator for this form was already created
		var validator = $.data(this[0], 'validator');
		if ( validator ) {
			return validator;
		}

		validator = new $.validator( options, this[0] );
		$.data(this[0], 'validator', validator);

		if ( validator.settings.onsubmit ) {

			// allow suppresing validation by adding a cancel class to the submit button
			this.find("input, button").filter(".cancel").click(function() {
				validator.cancelSubmit = true;
			});

			// when a submitHandler is used, capture the submitting button
			if (validator.settings.submitHandler) {
				this.find("input, button").filter(":submit").click(function() {
					validator.submitButton = this;
				});
			}

			// validate the form on submit
			this.submit( function( event ) {
				if ( validator.settings.debug )
					// prevent form submit to be able to see console output
					event.preventDefault();

				function handle() {
					if ( validator.settings.submitHandler ) {
						if (validator.submitButton) {
							// insert a hidden input as a replacement for the missing submit button
							var hidden = $("<input type='hidden'/>").attr("name", validator.submitButton.name).val(validator.submitButton.value).appendTo(validator.currentForm);
						}
						validator.settings.submitHandler.call( validator, validator.currentForm );
						if (validator.submitButton) {
							// and clean up afterwards; thanks to no-block-scope, hidden can be referenced
							hidden.remove();
						}
						return false;
					}
					return true;
				}

				// prevent submit for invalid forms or custom submit handlers
				if ( validator.cancelSubmit ) {
					validator.cancelSubmit = false;
					return handle();
				}
				if ( validator.form() ) {
					if ( validator.pendingRequest ) {
						validator.formSubmitted = true;
						return false;
					}
					return handle();
				} else {
					validator.focusInvalid();
					return false;
				}
			});
		}

		return validator;
	},
	// http://docs.jquery.com/Plugins/Validation/valid
	valid: function() {
        if ( $(this[0]).is('form')) {
            return this.validate().form();
        } else {
            var valid = true;
            var validator = $(this[0].form).validate();
            this.each(function() {
				valid &= validator.element(this);
            });
            return valid;
        }
    },
	// attributes: space seperated list of attributes to retrieve and remove
	removeAttrs: function(attributes) {
		var result = {},
			$element = this;
		$.each(attributes.split(/\s/), function(index, value) {
			result[value] = $element.attr(value);
			$element.removeAttr(value);
		});
		return result;
	},
	// http://docs.jquery.com/Plugins/Validation/rules
	rules: function(command, argument) {
		var element = this[0];

		if (command) {
			var settings = $.data(element.form, 'validator').settings;
			var staticRules = settings.rules;
			var existingRules = $.validator.staticRules(element);
			switch(command) {
			case "add":
				$.extend(existingRules, $.validator.normalizeRule(argument));
				staticRules[element.name] = existingRules;
				if (argument.messages)
					settings.messages[element.name] = $.extend( settings.messages[element.name], argument.messages );
				break;
			case "remove":
				if (!argument) {
					delete staticRules[element.name];
					return existingRules;
				}
				var filtered = {};
				$.each(argument.split(/\s/), function(index, method) {
					filtered[method] = existingRules[method];
					delete existingRules[method];
				});
				return filtered;
			}
		}

		var data = $.validator.normalizeRules(
		$.extend(
			{},
			$.validator.metadataRules(element),
			$.validator.classRules(element),
			$.validator.attributeRules(element),
			$.validator.staticRules(element)
		), element);

		// make sure required is at front
		if (data.required) {
			var param = data.required;
			delete data.required;
			data = $.extend({required: param}, data);
		}

		return data;
	}
});

// Custom selectors
$.extend($.expr[":"], {
	// http://docs.jquery.com/Plugins/Validation/blank
	blank: function(a) {return !$.trim("" + a.value);},
	// http://docs.jquery.com/Plugins/Validation/filled
	filled: function(a) {return !!$.trim("" + a.value);},
	// http://docs.jquery.com/Plugins/Validation/unchecked
	unchecked: function(a) {return !a.checked;}
});

// constructor for validator
$.validator = function( options, form ) {
	this.settings = $.extend( true, {}, $.validator.defaults, options );
	this.currentForm = form;
	this.init();
};

$.validator.format = function(source, params) {
	if ( arguments.length == 1 )
		return function() {
			var args = $.makeArray(arguments);
			args.unshift(source);
			return $.validator.format.apply( this, args );
		};
	if ( arguments.length > 2 && params.constructor != Array  ) {
		params = $.makeArray(arguments).slice(1);
	}
	if ( params.constructor != Array ) {
		params = [ params ];
	}
	$.each(params, function(i, n) {
		source = source.replace(new RegExp("\\{" + i + "\\}", "g"), n);
	});
	return source;
};

$.extend($.validator, {

	defaults: {
	    /**
	     * 键值对的校验错误信息.键是元素的name属性，值是错误信息的组合对象。<br/>
	     * @name validate#messages
	     * @type JSON
	     * @default {}
	     * @example
	     * $(".selector").validate({
         *  rules: {
         *    name: {
         *      required: true,
         *      minlength: 2
         *    }
         *  },
         *  messages: {
         *    name: {
         *      required: "We need your email address to contact you",
         *      minlength: jQuery.format("At least {0} characters required!")
         *      //这里的{0}就是minlength定义的2
         *    }
         *  }
         *})
	     */
		messages: {},
		/**
		 * 错误消息分组
         * 如果没有设置errorPlacement，则分组内的元素出现错误时仅且在第一个元素后面显示错误消息，
         * 如果设置了errorPlacement，则可以在errorPlacement回调中定义显示位置 <br/>
         * @name validate#groups
         * @type JSON
         * @default {}
         * @example
         * $("#myform").validate({
         *     groups: {
         *       username: "fname lname"
         *     },
         *     errorPlacement: function(error, element) {
         *        if (element.attr("name") == "fname" 
         *                    || element.attr("name") == "lname" ){
         *          error.insertAfter("#lastname");
         *        }else{
         *          error.insertAfter(element);
         *        }
         *      },
         *    }) //将fname和lname的错误信息统一显示在lastname元素后面
         */
		groups: {},
		
		/**
         * 键值对的校验规则.键是元素的name属性，值是校验规则的组合对象，每一个规则都可以绑定一个依赖对象，<br/>
         * 通过depends设定，只有依赖对象成立才会执行验证<br/>
         * @name validate#rules
         * @type JSON
         * @default {}
         * @example
         * $(".selector").validate({
         *  rules: {
         *    contact: {
         *      required: true,
         *      email: { 
         *        depends: function(element) {
         *          return $("#contactform_email:checked")
         *          //email校验的前提是contactform_email被选中
         *        }
         *      }
         *    }
         *  }
         *})
         */
		rules: {},
		
		/**
         * 指定校验错误显示标签的class名称，此class也将添加在校验的元素上面。<br/>
         * @name validate#errorClass
         * @type String
         * @default 'error'
         * @example
         * $(".selector").validate({
         *      errorClass: "invalid"
         *   })
         */
		errorClass: 'error',
		
		/**
         * 指定校验成功没有任何错误后加到元素的class名称<br/>
         * @name validate#validClass
         * @type String
         * @default 'valid'
         * @example
         * $(".selector").validate({
         *      validClass: "success"
         *   })
         */
		validClass: 'valid',
		
		/**
		 * 指定校验成功没有任何错误后加到提示元素上面的样式名称<br/>
		 * 和validClass的区别是它只加在提示元素上面，而不对校验的对象做任何变动。
		 * @name validate#success
		 * @type String
		 * @default 无
		 * @example
		 * $(".selector").validate({
		 *      success: "valid"
		 *   })
		 */
		
		/**
         * 指定显示校验错误信息的html标签名称<br/>
         * @name validate#errorElement
         * @type String
         * @default 'label'
         * @example
         * $(".selector").validate({
         *      errorElement: "em"
         *   })
         */
		errorElement: 'label',
		
		/**
         * 校验错误的时候是否将聚焦元素。<br/>
         * @name validate#focusInvalid
         * @type Boolean
         * @default true
         * @example
         * $(".selector").validate({
         *      focusInvalid: false
         *   })
         */
		focusInvalid: true,
		
		/**
         * 获得焦点的时候是否清除错误提示，这种清除是针对所有元素的，<br/>
         * 如果设置为true，则必须将focusInvalid设置为false，否则将没有校验效果。
         * @name validate#focusCleanup
         * @type Boolean
         * @default false
         * @example
         * $(".selector").validate({
         *      focusInvalid: false, //必须设置
         *      focusCleanup: true
         *   })
         */
		focusCleanup: false,
		
		/**
         * 包含错误信息的容器，根据校验结果隐藏或者显示错误容器。<br />
         * 与 errorLabelContainer 属性的区别是这个属性一般包括后者。
         * @name validate#errorContainer
         * @type Object
         * @default $( [] )
         * @example
         * $("#myform").validate({
         *      errorContainer: "#messageBox1, #messageBox2", 
         *      //可以配置多个容器，这里的messageBox2元素没有被包装处理，只是错误发生的时候显示和隐藏此元素
         *      errorLabelContainer: "#messageBox1 ul",
         *      wrapper: "li",
         *   })
         */
		errorContainer: $( [] ),
		
		/**
         * 显示错误信息的容器，根据校验结果隐藏或者显示错误容器。
         * @name validate#errorLabelContainer
         * @type Object
         * @default $( [] )
         * @example
         * $("#myform").validate({
         *      errorLabelContainer: "#messageBox",
         *      wrapper: "li",
         *   })
         *   //messageBox为容器的id
         */
		errorLabelContainer: $( [] ),
		
		/**
         * 是否在提交时校验表单，如果设置为false，则提交的时候不校验表单，<br/>
         * 但是其它keyup、onblur等事件校验不受影响.
         * @name validate#onsubmit
         * @type Boolean
         * @default true
         * @example
         * $(".selector").validate({
         *      onsubmit: false
         *   })
         */
		onsubmit: true,
		
		/**
         * 校验时忽略指定的元素，可以配置需要校验的元素id和样式名称等jquery识别的选择器。
         * @name validate#ignore
         * @type String
         * @default null
         * @example
         * $("#myform").validate({
         *      ignore: ".ignore" 
         *      //此处还可以配置input[type='password']、#id等jquery的选择器
         *   })
         */
		ignore: [],
		ignoreTitle: false,
		
		onfocusin: function(element) {
			this.lastActive = element;

			// hide error label and remove error class on focus if enabled
			if ( this.settings.focusCleanup && !this.blockFocusCleanup ) {
				this.settings.unhighlight && this.settings.unhighlight.call( this, element, this.settings.errorClass, this.settings.validClass );
				this.addWrapper(this.errorsFor(element)).hide();
			}
		},
		
		/**
         * 在blur事件发生时是否进行校验，如果没有输入任何值，则将忽略校验。
         * @name validate#onfocusout
         * @type Boolean
         * @default true
         * @example
         * $(".selector").validate({
         *      onfocusout: false
         *   })
         */
		onfocusout: function(element) {
			if ( !this.checkable(element) && (element.name in this.submitted || !this.optional(element)) ) {
				this.element(element);
			}
		},
		
		/**
         * 在keyup事件发生时是否进行校验。
         * @name validate#onkeyup
         * @type Boolean
         * @default true
         * @example
         * $(".selector").validate({
         *      onkeyup: false
         *   })
         */
		onkeyup: function(element) {
			if ( element.name in this.submitted || element == this.lastElement ) {
				this.element(element);
			}
		},
		
		/**
         * 在checkbox和radio的click事件发生后是否进行校验。
         * @name validate#onclick
         * @type Boolean
         * @default true
         * @example
         * $(".selector").validate({
         *      onclick: false
         *   })
         */
		onclick: function(element) {
			// click on selects, radiobuttons and checkboxes
			if ( element.name in this.submitted )
				this.element(element);
			// or option elements, check parent select in that case
			else if (element.parentNode.name in this.submitted)
				this.element(element.parentNode);
		},
		highlight: function(element, errorClass, validClass) {
			if (element.type === 'radio') {
				this.findByName(element.name).addClass(errorClass).removeClass(validClass);
			} else {
				$(element).addClass(errorClass).removeClass(validClass);
			}
		},
		unhighlight: function(element, errorClass, validClass) {
			if (element.type === 'radio') {
				this.findByName(element.name).removeClass(errorClass).addClass(validClass);
			} else {
				$(element).removeClass(errorClass).addClass(validClass);
			}
		}
		
		/**
         * 定制错误信息显示的回调方法。该方法有两个参数，第一个参数是错误信息的元素，第二个是触发校验错误的源元素。
         * @name validate#errorPlacement
         * @type Function
         * @default 无
         * @example
         * $("#myform").validate({
         *     errorPlacement: function(error, element) {
         *        error.appendTo( element.parent("td").next("td") );
         *      }
         *    })
         */
		
		/**
         * 它负责处理事件，当错误产生的时候它会将错误信息显示出来，错误消除时它负责将错误信息隐藏
         * 如果自定义了错误展示，而另外一部分还是默认的行为，则请调用this.defaultShowErrors()
         * 以便默认行为生效，它也有两个参数，分别是errorMap和errorList，是所有错误的集合。
         * @name validate#showErrors
         * @type Function
         * @default 无
         * @example
         * $("#myform").validate({
         * showErrors: function(errorMap, errorList) {
         *                   if(errorList && errorList.length > 0){  //如果存在错误信息
         *                       $.each(errorList,function(index,obj){ //遍历错误信息 ，index为错误信息的索引号，
         *                                                             //obj为当前错误信息对象
         *                           var msg = this.message;           //获取当前错误信息文本
         *                           //这里编写一些代码处理你的错误信息
         *                      });
         *                   }else{
         *                       //错误信息已经消除，此处要写隐藏错误信息的代码，
         *                       //通过this.currentElements获取当前对象
         *                   }
         *                   this.defaultShowErrors();  //如果还有默认的行为，请调用它。
         *               }
         *  })
         */

		/**
         * 定制校验通过后表单提交前的回调方法，用来替换默认提交，一般是Ajax提交方式需要使用到。
         * @type Function
         * @name validate#submitHandler
         * @param form 当前表单对象
         * @example
         * $(".selector").validate({
         *      submitHandler: function(form) {
         *       $(form).ajaxSubmit(); //校验通过之后调用ajaxSubmit提交表单
         *      }
         *   })
         */
         
         /**
         * 定制表单提交但校验不通过的回调方法。
         * @type Function
         * @name validate#invalidHandler
         * @param form 当前表单对象
         * @param validator 当前校验器对象
         * @example
         * $(".selector").validate({
         *   invalidHandler: function(form, validator) {
         *     var errors = validator.numberOfInvalids();
         *     if (errors) {
         *       var message = errors == 1
         *         ? 'You missed 1 field. It has been highlighted'
         *         : 'You missed ' + errors + ' fields. They have been highlighted';
         *       $("div.error span").html(message);
         *       $("div.error").show();
         *     } else {
         *       $("div.error").hide();
         *     }
         *   }
         *})
         */   
		
		/**
         * 校验选中的表单
         * @name validate#validate
         * @function
         * @returns 当前form的校验对象
         * @example
         *   $("#myform").validate({
         *      //options
         *   });
         */
		
		/**
         * 检查表单是否通过校验
         * @name validate#valid
         * @function
         * @returns Boolean
         * @example
         *   $("#myform").validate();
         *   $("a.check").click(function() {
         *     alert("Valid: " + $("#myform").valid());
         *     return false;
         *   });
         */
		
		/**
         * 针对选中的元素，动态添加删除校验规则的方法，有rules( "add", rules ) 和rules( "remove", [rules] )两种
         * @name validate#rules
         * @function
         * @returns rules Object{Options}
         * @example
         *  $('#username').rules('add',{
         *       minlength:5,
         *       messages: {
         *           minlength: jQuery.format("Please, at least {0} characters are necessary")
         *       }
         *   });
         *   
         * $("#myinput").rules("remove", "min max"); //remove可以配置多个rule，空格隔开
         */
		
		/**
         * 触发表单校验
         * @name validate#form
         * @function
         * @returns Boolean
         * @example
         *  $("#myform").validate().form()
         */
		
		/**
         * 校验选中的element
         * @name validate#element
         * @param element
         * @function
         * @returns Boolean
         * @example
         *  $("#myform").validate().element( "#myselect" );
         */
		
		/**
         * 重置表单，调用此方法将去掉所有提示信息
         * @name validate#resetForm
         * @function
         * @returns 无
         * @example
         *  var validator = $("#myform").validate();
         *  validator.resetForm();
         */
		
		/**
		 *  添加并显示提示信息
		 * @name validate#showErrors
		 * @function
		 * @param Object
		 * @returns 无
		 * @example
		 * var validator = $("#myform").validate();
         * validator.showErrors({"firstname": "I know that your firstname is Pete, Pete!"});
		 */
		
		/**
		 *  统计没有通过校验的元素个数
		 * @name validate#numberOfInvalids
		 * @function
		 * @returns Integer
		 * @example
		 * var validator = $("#myform").validate();
		 * return validator.numberOfInvalids();
		 */
	},

	// http://docs.jquery.com/Plugins/Validation/Validator/setDefaults
	setDefaults: function(settings) {
		$.extend( $.validator.defaults, settings );
	},

	messages: {
		required: "This field is required.",
		remote: "Please fix this field.",
		email: "Please enter a valid email address.",
		url: "Please enter a valid URL.",
		date: "Please enter a valid date.",
		number: "Please enter a valid number.",
		digits: "Please enter only digits.",
		equalTo: "Please enter the same value again.",
		accept: "Please enter a value with a valid extension.",
		maxlength: $.validator.format("Please enter no more than {0} characters."),
		minlength: $.validator.format("Please enter at least {0} characters."),
		rangelength: $.validator.format("Please enter a value between {0} and {1} characters long."),
		range: $.validator.format("Please enter a value between {0} and {1}."),
		max: $.validator.format("Please enter a value less than or equal to {0}."),
		min: $.validator.format("Please enter a value greater than or equal to {0}.")
	},

	autoCreateRanges: false,

	prototype: {

		init: function() {
			this.labelContainer = $(this.settings.errorLabelContainer);
			this.errorContext = this.labelContainer.length && this.labelContainer || $(this.currentForm);
			this.containers = $(this.settings.errorContainer).add( this.settings.errorLabelContainer );
			this.submitted = {};
			this.valueCache = {};
			this.pendingRequest = 0;
			this.pending = {};
			this.invalid = {};
			this.reset();

			var groups = (this.groups = {});
			$.each(this.settings.groups, function(key, value) {
				$.each(value.split(/\s/), function(index, name) {
					groups[name] = key;
				});
			});
			var rules = this.settings.rules;
			$.each(rules, function(key, value) {
				rules[key] = $.validator.normalizeRule(value);
			});

			function delegate(event) {
				var validator = $.data(this[0].form, "validator"),
					eventType = "on" + event.type.replace(/^validate/, "");
				validator.settings[eventType] && validator.settings[eventType].call(validator, this[0] );
			}
			$(this.currentForm)
				.validateDelegate(":text, :password, :file, select, textarea", "focusin focusout keyup", delegate)
				.validateDelegate(":radio, :checkbox, select, option", "click", delegate);

			if (this.settings.invalidHandler)
				$(this.currentForm).bind("invalid-form.validate", this.settings.invalidHandler);
		},

		// http://docs.jquery.com/Plugins/Validation/Validator/form
		form: function() {
			this.checkForm();
			$.extend(this.submitted, this.errorMap);
			this.invalid = $.extend({}, this.errorMap);
			if (!this.valid())
				$(this.currentForm).triggerHandler("invalid-form", [this]);
			this.showErrors();
			return this.valid();
		},

		checkForm: function() {
			this.prepareForm();
			for ( var i = 0, elements = (this.currentElements = this.elements()); elements[i]; i++ ) {
				this.check( elements[i] );
			}
			return this.valid();
		},

		// http://docs.jquery.com/Plugins/Validation/Validator/element
		element: function( element ) {
			element = this.clean( element );
			this.lastElement = element;
			this.prepareElement( element );
			this.currentElements = $(element);
			var result = this.check( element );
			if ( result ) {
				delete this.invalid[element.name];
			} else {
				this.invalid[element.name] = true;
			}
			if ( !this.numberOfInvalids() ) {
				// Hide error containers on last error
				this.toHide = this.toHide.add( this.containers );
			}
			this.showErrors();
			return result;
		},

		// http://docs.jquery.com/Plugins/Validation/Validator/showErrors
		showErrors: function(errors) {
			if(errors) {
				// add items to error list and map
				$.extend( this.errorMap, errors );
				this.errorList = [];
				for ( var name in errors ) {
					this.errorList.push({
						message: errors[name],
						element: this.findByName(name)[0]
					});
				}
				// remove items from success list
				this.successList = $.grep( this.successList, function(element) {
					return !(element.name in errors);
				});
			}
			this.settings.showErrors
				? this.settings.showErrors.call( this, this.errorMap, this.errorList )
				: this.defaultShowErrors();
		},

		// http://docs.jquery.com/Plugins/Validation/Validator/resetForm
		resetForm: function() {
			if ( $.fn.resetForm )
				$( this.currentForm ).resetForm();
			this.submitted = {};
			this.prepareForm();
			this.hideErrors();
			this.elements().removeClass( this.settings.errorClass );
		},

		numberOfInvalids: function() {
			return this.objectLength(this.invalid);
		},

		objectLength: function( obj ) {
			var count = 0;
			for ( var i in obj )
				count++;
			return count;
		},

		hideErrors: function() {
			this.addWrapper( this.toHide ).hide();
		},

		valid: function() {
			return this.size() == 0;
		},

		size: function() {
			return this.errorList.length;
		},

		focusInvalid: function() {
			if( this.settings.focusInvalid ) {
				try {
					$(this.findLastActive() || this.errorList.length && this.errorList[0].element || [])
					.filter(":visible")
					.focus()
					// manually trigger focusin event; without it, focusin handler isn't called, findLastActive won't have anything to find
					.trigger("focusin");
				} catch(e) {
					// ignore IE throwing errors when focusing hidden elements
				}
			}
		},

		findLastActive: function() {
			var lastActive = this.lastActive;
			return lastActive && $.grep(this.errorList, function(n) {
				return n.element.name == lastActive.name;
			}).length == 1 && lastActive;
		},

		elements: function() {
			var validator = this,
				rulesCache = {};

			// select all valid inputs inside the form (no submit or reset buttons)
			return $(this.currentForm)
			.find("input, select, textarea")
			.not(":submit, :reset, :image, [disabled]")
			.not( this.settings.ignore )
			.filter(function() {
				!this.name && validator.settings.debug && window.console && console.error( "%o has no name assigned", this);

				// select only the first element for each name, and only those with rules specified
				if ( this.name in rulesCache || !validator.objectLength($(this).rules()) )
					return false;

				rulesCache[this.name] = true;
				return true;
			});
		},

		clean: function( selector ) {
			return $( selector )[0];
		},

		errors: function() {
			return $( this.settings.errorElement + "." + this.settings.errorClass, this.errorContext );
		},

		reset: function() {
			this.successList = [];
			this.errorList = [];
			this.errorMap = {};
			this.toShow = $([]);
			this.toHide = $([]);
			this.currentElements = $([]);
		},

		prepareForm: function() {
			this.reset();
			this.toHide = this.errors().add( this.containers );
		},

		prepareElement: function( element ) {
			this.reset();
			this.toHide = this.errorsFor(element);
		},

		check: function( element ) {
			element = this.clean( element );

			// if radio/checkbox, validate first element in group instead
			if (this.checkable(element)) {
				element = this.findByName( element.name ).not(this.settings.ignore)[0];
			}

			var rules = $(element).rules();
			var dependencyMismatch = false;
			for (var method in rules ) {
				var rule = { method: method, parameters: rules[method] };
				try {
					var result = $.validator.methods[method].call( this, element.value.replace(/\r/g, ""), element, rule.parameters );

					// if a method indicates that the field is optional and therefore valid,
					// don't mark it as valid when there are no other rules
					if ( result == "dependency-mismatch" ) {
						dependencyMismatch = true;
						continue;
					}
					dependencyMismatch = false;

					if ( result == "pending" ) {
						this.toHide = this.toHide.not( this.errorsFor(element) );
						return;
					}

					if( !result ) {
						this.formatAndAdd( element, rule );
						return false;
					}
				} catch(e) {
					this.settings.debug && window.console && console.log("exception occured when checking element " + element.id
						 + ", check the '" + rule.method + "' method", e);
					throw e;
				}
			}
			if (dependencyMismatch)
				return;
			if ( this.objectLength(rules) )
				this.successList.push(element);
			return true;
		},

		// return the custom message for the given element and validation method
		// specified in the element's "messages" metadata
		customMetaMessage: function(element, method) {
			if (!$.metadata)
				return;

			var meta = this.settings.meta
				? $(element).metadata()[this.settings.meta]
				: $(element).metadata();

			return meta && meta.messages && meta.messages[method];
		},

		// return the custom message for the given element name and validation method
		customMessage: function( name, method ) {
			var m = this.settings.messages[name];
			return m && (m.constructor == String
				? m
				: m[method]);
		},

		// return the first defined argument, allowing empty strings
		findDefined: function() {
			for(var i = 0; i < arguments.length; i++) {
				if (arguments[i] !== undefined)
					return arguments[i];
			}
			return undefined;
		},

		defaultMessage: function( element, method) {
			return this.findDefined(
				this.customMessage( element.name, method ),
				this.customMetaMessage( element, method ),
				// title is never undefined, so handle empty string as undefined
				!this.settings.ignoreTitle && element.title || undefined,
				$.validator.messages[method],
				"<strong>Warning: No message defined for " + element.name + "</strong>"
			);
		},

		formatAndAdd: function( element, rule ) {
			var message = this.defaultMessage( element, rule.method ),
				theregex = /\$?\{(\d+)\}/g;
			if ( typeof message == "function" ) {
				message = message.call(this, rule.parameters, element);
			} else if (theregex.test(message)) {
				message = jQuery.format(message.replace(theregex, '{$1}'), rule.parameters);
			}
			this.errorList.push({
				message: message,
				element: element
			});

			this.errorMap[element.name] = message;
			this.submitted[element.name] = message;
		},

		/**
         * 显示错误信息的外层标签名称.
         * @name validate#wrapper
         * @type String
         * @default 无
         * @example
         * $(".selector").validate({
         *      wrapper: "li"
         *   })
         */
		addWrapper: function(toToggle) {
			if ( this.settings.wrapper )
				toToggle = toToggle.add( toToggle.parent( this.settings.wrapper ) );
			return toToggle;
		},

		defaultShowErrors: function() {
			for ( var i = 0; this.errorList[i]; i++ ) {
				var error = this.errorList[i];
				this.settings.highlight && this.settings.highlight.call( this, error.element, this.settings.errorClass, this.settings.validClass );
				this.showLabel( error.element, error.message );
			}
			if( this.errorList.length ) {
				this.toShow = this.toShow.add( this.containers );
			}
			if (this.settings.success) {
				for ( var i = 0; this.successList[i]; i++ ) {
					this.showLabel( this.successList[i] );
				}
			}
			if (this.settings.unhighlight) {
				for ( var i = 0, elements = this.validElements(); elements[i]; i++ ) {
					this.settings.unhighlight.call( this, elements[i], this.settings.errorClass, this.settings.validClass );
				}
			}
			this.toHide = this.toHide.not( this.toShow );
			this.hideErrors();
			this.addWrapper( this.toShow ).show();
		},

		validElements: function() {
			return this.currentElements.not(this.invalidElements());
		},

		invalidElements: function() {
			return $(this.errorList).map(function() {
				return this.element;
			});
		},

		showLabel: function(element, message) {
			var label = this.errorsFor( element );
			if ( label.length ) {
				// refresh error/success class
				label.removeClass().addClass( this.settings.errorClass );

				// check if we have a generated label, replace the message then
				label.attr("generated") && label.html(message);
			} else {
				// create label
				label = $("<" + this.settings.errorElement + "/>")
					.attr({"for":  this.idOrName(element), generated: true})
					.addClass(this.settings.errorClass)
					.html(message || "");
				if ( this.settings.wrapper ) {
					// make sure the element is visible, even in IE
					// actually showing the wrapped element is handled elsewhere
					label = label.hide().show().wrap("<" + this.settings.wrapper + "/>").parent();
				}
				if ( !this.labelContainer.append(label).length )
					this.settings.errorPlacement
						? this.settings.errorPlacement(label, $(element) )
						: label.insertAfter(element);
			}
			if ( !message && this.settings.success ) {
				label.text("");
				typeof this.settings.success == "string"
					? label.addClass( this.settings.success )
					: this.settings.success( label );
			}
			this.toShow = this.toShow.add(label);
		},

		errorsFor: function(element) {
			var name = this.idOrName(element);
    		return this.errors().filter(function() {
				return $(this).attr('for') == name;
			});
		},

		idOrName: function(element) {
			return this.groups[element.name] || (this.checkable(element) ? element.name : element.id || element.name);
		},

		checkable: function( element ) {
			return /radio|checkbox/i.test(element.type);
		},

		findByName: function( name ) {
			// select by name and filter by form for performance over form.find("[name=...]")
			var form = this.currentForm;
			return $(document.getElementsByName(name)).map(function(index, element) {
				return element.form == form && element.name == name && element  || null;
			});
		},

		getLength: function(value, element) {
			switch( element.nodeName.toLowerCase() ) {
			case 'select':
				return $("option:selected", element).length;
			case 'input':
				if( this.checkable( element) )
					return this.findByName(element.name).filter(':checked').length;
			}
			return value.length;
		},

		depend: function(param, element) {
			return this.dependTypes[typeof param]
				? this.dependTypes[typeof param](param, element)
				: true;
		},

		dependTypes: {
			"boolean": function(param, element) {
				return param;
			},
			"string": function(param, element) {
				return !!$(param, element.form).length;
			},
			"function": function(param, element) {
				return param(element);
			}
		},

		optional: function(element) {
			return !$.validator.methods.required.call(this, $.trim(element.value), element) && "dependency-mismatch";
		},

		startRequest: function(element) {
			if (!this.pending[element.name]) {
				this.pendingRequest++;
				this.pending[element.name] = true;
			}
		},

		stopRequest: function(element, valid) {
			this.pendingRequest--;
			// sometimes synchronization fails, make sure pendingRequest is never < 0
			if (this.pendingRequest < 0)
				this.pendingRequest = 0;
			delete this.pending[element.name];
			if ( valid && this.pendingRequest == 0 && this.formSubmitted && this.form() ) {
				$(this.currentForm).submit();
				this.formSubmitted = false;
			} else if (!valid && this.pendingRequest == 0 && this.formSubmitted) {
				$(this.currentForm).triggerHandler("invalid-form", [this]);
				this.formSubmitted = false;
			}
		},

		previousValue: function(element) {
			return $.data(element, "previousValue") || $.data(element, "previousValue", {
				old: null,
				valid: true,
				message: this.defaultMessage( element, "remote" )
			});
		}

	},

	classRuleSettings: {
		required: {required: true},
		email: {email: true},
		url: {url: true},
		date: {date: true},
		dateISO: {dateISO: true},
		dateDE: {dateDE: true},
		number: {number: true},
		numberDE: {numberDE: true},
		digits: {digits: true},
		creditcard: {creditcard: true}
	},

	addClassRules: function(className, rules) {
		className.constructor == String ?
			this.classRuleSettings[className] = rules :
			$.extend(this.classRuleSettings, className);
	},

	classRules: function(element) {
		var rules = {};
		var classes = $(element).attr('class');
		classes && $.each(classes.split(' '), function() {
			if (this in $.validator.classRuleSettings) {
				$.extend(rules, $.validator.classRuleSettings[this]);
			}
		});
		return rules;
	},

	attributeRules: function(element) {
		var rules = {};
		var $element = $(element);

		for (var method in $.validator.methods) {
			var value = $element.attr(method);
			if (value) {
				rules[method] = value;
			}
		}

		// maxlength may be returned as -1, 2147483647 (IE) and 524288 (safari) for text inputs
		if (rules.maxlength && /-1|2147483647|524288/.test(rules.maxlength)) {
			delete rules.maxlength;
		}

		return rules;
	},

	metadataRules: function(element) {
		if (!$.metadata) return {};

		var meta = $.data(element.form, 'validator').settings.meta;
		return meta ?
			$(element).metadata()[meta] :
			$(element).metadata();
	},

	staticRules: function(element) {
		var rules = {};
		var validator = $.data(element.form, 'validator');
		if (validator.settings.rules) {
			rules = $.validator.normalizeRule(validator.settings.rules[element.name]) || {};
		}
		return rules;
	},

	normalizeRules: function(rules, element) {
		// handle dependency check
		$.each(rules, function(prop, val) {
			// ignore rule when param is explicitly false, eg. required:false
			if (val === false) {
				delete rules[prop];
				return;
			}
			if (val.param || val.depends) {
				var keepRule = true;
				switch (typeof val.depends) {
					case "string":
						keepRule = !!$(val.depends, element.form).length;
						break;
					case "function":
						keepRule = val.depends.call(element, element);
						break;
				}
				if (keepRule) {
					rules[prop] = val.param !== undefined ? val.param : true;
				} else {
					delete rules[prop];
				}
			}
		});

		// evaluate parameters
		$.each(rules, function(rule, parameter) {
			rules[rule] = $.isFunction(parameter) ? parameter(element) : parameter;
		});

		// clean number parameters
		$.each(['minlength', 'maxlength', 'min', 'max'], function() {
			if (rules[this]) {
				rules[this] = Number(rules[this]);
			}
		});
		$.each(['rangelength', 'range'], function() {
			if (rules[this]) {
				rules[this] = [Number(rules[this][0]), Number(rules[this][1])];
			}
		});

		if ($.validator.autoCreateRanges) {
			// auto-create ranges
			if (rules.min && rules.max) {
				rules.range = [rules.min, rules.max];
				delete rules.min;
				delete rules.max;
			}
			if (rules.minlength && rules.maxlength) {
				rules.rangelength = [rules.minlength, rules.maxlength];
				delete rules.minlength;
				delete rules.maxlength;
			}
		}

		// To support custom messages in metadata ignore rule methods titled "messages"
		if (rules.messages) {
			delete rules.messages;
		}

		return rules;
	},

	// Converts a simple string to a {string: true} rule, e.g., "required" to {required:true}
	normalizeRule: function(data) {
		if( typeof data == "string" ) {
			var transformed = {};
			$.each(data.split(/\s/), function() {
				transformed[this] = true;
			});
			data = transformed;
		}
		return data;
	},

	// http://docs.jquery.com/Plugins/Validation/Validator/addMethod
	addMethod: function(name, method, message) {
		$.validator.methods[name] = method;
		$.validator.messages[name] = message != undefined ? message : $.validator.messages[name];
		if (method.length < 3) {
			$.validator.addClassRules(name, $.validator.normalizeRule(name));
		}
	},

	methods: {

		// http://docs.jquery.com/Plugins/Validation/Methods/required
		required: function(value, element, param) {
			// check if dependency is met
			if ( !this.depend(param, element) )
				return "dependency-mismatch";
			switch( element.nodeName.toLowerCase() ) {
			case 'select':
				// could be an array for select-multiple or a string, both are fine this way
				var val = $(element).val();
				return val && val.length > 0;
			case 'input':
				if ( this.checkable(element) )
					return this.getLength(value, element) > 0;
			default:
				return $.trim(value).length > 0;
			}
		},

		// http://docs.jquery.com/Plugins/Validation/Methods/remote
		remote: function(value, element, param) {
			if ( this.optional(element) )
				return "dependency-mismatch";

			var previous = this.previousValue(element);
			if (!this.settings.messages[element.name] )
				this.settings.messages[element.name] = {};
			previous.originalMessage = this.settings.messages[element.name].remote;
			this.settings.messages[element.name].remote = previous.message;

			param = typeof param == "string" && {url:param} || param;

			if ( this.pending[element.name] ) {
				return "pending";
			}
			if ( previous.old === value ) {
				return previous.valid;
			}

			previous.old = value;
			var validator = this;
			this.startRequest(element);
			var data = {};
			data[element.name] = value;
			$.ajax($.extend(true, {
				url: param,
				mode: "abort",
				port: "validate" + element.name,
				dataType: "json",
				data: data,
				success: function(response) {
					validator.settings.messages[element.name].remote = previous.originalMessage;
					var valid = response === true;
					if ( valid ) {
						var submitted = validator.formSubmitted;
						validator.prepareElement(element);
						validator.formSubmitted = submitted;
						validator.successList.push(element);
						validator.showErrors();
					} else {
						var errors = {};
						var message = response || validator.defaultMessage( element, "remote" );
						errors[element.name] = previous.message = $.isFunction(message) ? message(value) : message;
						validator.showErrors(errors);
					}
					previous.valid = valid;
					validator.stopRequest(element, valid);
				}
			}, param));
			return "pending";
		},

		// http://docs.jquery.com/Plugins/Validation/Methods/minlength
		minlength: function(value, element, param) {
			return this.optional(element) || this.getLength($.trim(value), element) >= param;
		},

		// http://docs.jquery.com/Plugins/Validation/Methods/maxlength
		maxlength: function(value, element, param) {
			return this.optional(element) || this.getLength($.trim(value), element) <= param;
		},

		// http://docs.jquery.com/Plugins/Validation/Methods/rangelength
		rangelength: function(value, element, param) {
			var length = this.getLength($.trim(value), element);
			return this.optional(element) || ( length >= param[0] && length <= param[1] );
		},

		// http://docs.jquery.com/Plugins/Validation/Methods/min
		min: function( value, element, param ) {
			return this.optional(element) || value >= param;
		},

		// http://docs.jquery.com/Plugins/Validation/Methods/max
		max: function( value, element, param ) {
			return this.optional(element) || value <= param;
		},

		// http://docs.jquery.com/Plugins/Validation/Methods/range
		range: function( value, element, param ) {
			return this.optional(element) || ( value >= param[0] && value <= param[1] );
		},

		// http://docs.jquery.com/Plugins/Validation/Methods/email
		email: function(value, element) {
			// contributed by Scott Gonzalez: http://projects.scottsplayground.com/email_address_validation/
			return this.optional(element) || /^((([a-z]|\d|[!#\$%&'\*\+\-\/=\?\^_`{\|}~]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])+(\.([a-z]|\d|[!#\$%&'\*\+\-\/=\?\^_`{\|}~]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])+)*)|((\x22)((((\x20|\x09)*(\x0d\x0a))?(\x20|\x09)+)?(([\x01-\x08\x0b\x0c\x0e-\x1f\x7f]|\x21|[\x23-\x5b]|[\x5d-\x7e]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(\\([\x01-\x09\x0b\x0c\x0d-\x7f]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]))))*(((\x20|\x09)*(\x0d\x0a))?(\x20|\x09)+)?(\x22)))@((([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])*([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])))\.)+(([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])*([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])))\.?$/i.test(value);
		},

		// http://docs.jquery.com/Plugins/Validation/Methods/url
		url: function(value, element) {
			// contributed by Scott Gonzalez: http://projects.scottsplayground.com/iri/
			return this.optional(element) || /^(https?|ftp):\/\/(((([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(%[\da-f]{2})|[!\$&'\(\)\*\+,;=]|:)*@)?(((\d|[1-9]\d|1\d\d|2[0-4]\d|25[0-5])\.(\d|[1-9]\d|1\d\d|2[0-4]\d|25[0-5])\.(\d|[1-9]\d|1\d\d|2[0-4]\d|25[0-5])\.(\d|[1-9]\d|1\d\d|2[0-4]\d|25[0-5]))|((([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])*([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])))\.)+(([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])*([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])))\.?)(:\d*)?)(\/((([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(%[\da-f]{2})|[!\$&'\(\)\*\+,;=]|:|@)+(\/(([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(%[\da-f]{2})|[!\$&'\(\)\*\+,;=]|:|@)*)*)?)?(\?((([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(%[\da-f]{2})|[!\$&'\(\)\*\+,;=]|:|@)|[\uE000-\uF8FF]|\/|\?)*)?(\#((([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(%[\da-f]{2})|[!\$&'\(\)\*\+,;=]|:|@)|\/|\?)*)?$/i.test(value);
		},

		// http://docs.jquery.com/Plugins/Validation/Methods/date
		date: function(value, element) {
			return this.optional(element) || !/Invalid|NaN/.test(new Date(value));
		},

		// http://docs.jquery.com/Plugins/Validation/Methods/number
		number: function(value, element) {
			return this.optional(element) || /^-?(?:\d+|\d{1,3}(?:,\d{3})+)(?:\.\d+)?$/.test(value);
		},

		// http://docs.jquery.com/Plugins/Validation/Methods/digits
		digits: function(value, element) {
			return this.optional(element) || /^\d+$/.test(value);
		},

		// http://docs.jquery.com/Plugins/Validation/Methods/accept
		accept: function(value, element, param) {
			param = typeof param == "string" ? param.replace(/,/g, '|') : "png|jpe?g|gif";
			return this.optional(element) || value.match(new RegExp(".(" + param + ")$", "i"));
		},

		// http://docs.jquery.com/Plugins/Validation/Methods/equalTo
		equalTo: function(value, element, param) {
			// bind to the blur event of the target in order to revalidate whenever the target field is updated
			// TODO find a way to bind the event just once, avoiding the unbind-rebind overhead
			var target = $(param).unbind(".validate-equalTo").bind("blur.validate-equalTo", function() {
				$(element).valid();
			});
			return value == target.val();
		}
	}

});

// deprecated, use $.validator.format instead
$.format = $.validator.format;

})(jQuery);

// ajax mode: abort
// usage: $.ajax({ mode: "abort"[, port: "uniqueport"]});
// if mode:"abort" is used, the previous request on that port (port can be undefined) is aborted via XMLHttpRequest.abort()
;(function($) {
	var pendingRequests = {};
	// Use a prefilter if available (1.5+)
	if ( $.ajaxPrefilter ) {
		$.ajaxPrefilter(function(settings, _, xhr) {
			var port = settings.port;
			if (settings.mode == "abort") {
				if ( pendingRequests[port] ) {
					pendingRequests[port].abort();
				}
				pendingRequests[port] = xhr;
			}
		});
	} else {
		// Proxy ajax
		var ajax = $.ajax;
		$.ajax = function(settings) {
			var mode = ( "mode" in settings ? settings : $.ajaxSettings ).mode,
				port = ( "port" in settings ? settings : $.ajaxSettings ).port;
			if (mode == "abort") {
				if ( pendingRequests[port] ) {
					pendingRequests[port].abort();
				}
				return (pendingRequests[port] = ajax.apply(this, arguments));
			}
			return ajax.apply(this, arguments);
		};
	}
})(jQuery);

// provides cross-browser focusin and focusout events
// IE has native support, in other browsers, use event caputuring (neither bubbles)

// provides delegate(type: String, delegate: Selector, handler: Callback) plugin for easier event delegation
// handler is only called when $(event.target).is(delegate), in the scope of the jquery-object for event.target
;(function($) {
	// only implement if not provided by jQuery core (since 1.4)
	// TODO verify if jQuery 1.4's implementation is compatible with older jQuery special-event APIs
	if (!jQuery.event.special.focusin && !jQuery.event.special.focusout && document.addEventListener) {
		$.each({
			focus: 'focusin',
			blur: 'focusout'
		}, function( original, fix ){
			$.event.special[fix] = {
				setup:function() {
					this.addEventListener( original, handler, true );
				},
				teardown:function() {
					this.removeEventListener( original, handler, true );
				},
				handler: function(e) {
					arguments[0] = $.event.fix(e);
					arguments[0].type = fix;
					return $.event.handle.apply(this, arguments);
				}
			};
			function handler(e) {
				e = $.event.fix(e);
				e.type = fix;
				return $.event.handle.call(this, e);
			}
		});
	};
	$.extend($.fn, {
		validateDelegate: function(delegate, type, handler) {
			return this.bind(type, function(event) {
				var target = $(event.target);
				if (target.is(delegate)) {
					return handler.apply(target, arguments);
				}
			});
		}
	});
})(jQuery);
/*
 * $Id: om-accordion.js,v 1.52 2012/01/16 01:48:41 linxiaomin Exp $
 * operamasks-ui omAccordion 1.0
 *
 * Copyright 2011, AUTHORS.txt (http://ui.operamasks.org/about)
 * Dual licensed under the MIT or GPL Version 2 licenses.
 * http://ui.operamasks.org/license
 *
 * http://ui.operamasks.org/docs/
 *
 * Depends:
 *  jquery.ui.core.js
 *  jquery.ui.widget.js
 *  om-panel.js
 */
(function( $, undefined ) {
    var panelIdPrefix = 'om-accordion-panel-' + (((1+Math.random())*0x10000)|0).toString(16).substring(1) + '-',
    id = 0;
	/**
     * @name omAccordion
     * @class 抽屉布局组件。以抽屉的形式展现信息，每个抽屉内容可为当前页面内容，也可以使用Ajax装载其他页面的内容，其原理是jQuery的load方法，没用到嵌入的iframe，不支持跨域装载.支持初始化过后再次更新某个抽屉的数据源(调用url方法)，值得注意的是:更新数据源不会触发抽屉的刷新操作，需要显示调用另一个api来完成(调用reload方法)<br/><br/>
     * <b>特点：</b><br/>
     * <ol>
     *      <li>支持Ajax装载</li>
     *      <li>支持自定义每个抽屉图标</li>
     *      <li>支持多种抽屉切换方式</li>
     *      <li>支持动态更换数据源</li>
     *      <li>支持动态更换标题</li>
     *      <li>支持定时自动切换抽屉</li>
     *      <li>支持多种事件捕获</li>
     * </ol>
     * <b>使用方式：</b><br/><br/>
     * 页面上有如下html标记
     * <pre>
     * &lt;script type="text/javascript" >
     * $(document).ready(function() {
     *     $('#make-accordion').omAccordion();
     * });
     * &lt;/script>
     * 
     * &lt;div id="make-accordion"&gt;
     *    &lt;ul&gt;
     *        &lt;li&gt;
     *            &lt;a href="./remote.html" id="accordion1"&gt;Title1&lt;/a&gt;&lt;!--此抽屉的id为accordion1，如果没有显示指定，会自动生成--&gt;
     *        &lt;/li&gt;
     *        &lt;li&gt;
     *             &lt;a href="#accordion2"&gt;Title2&lt;/a&gt;&lt;!--此抽屉的id为accordion2--&gt;
     *         &lt;/li&gt;
     *         &lt;li&gt;
     *             &lt;a href="#accordion3"&gt;Title3&lt;/a&gt;&lt;!--此抽屉的id为accordion3--&gt;
     *         &lt;/li&gt;
     *    &lt;/ul&gt;
     *    &lt;div id="accordion2"&gt;
     *      this is accordion2 content
     *    &lt;/div&gt;
     *    &lt;div id="accordion3"&gt;
     *      this is accordion3 content
     *    &lt;/div&gt;
     * &lt;/div&gt;
	 * </pre>
     * @constructor
     * @description 构造函数. 
     * @param p 标准config对象：{width:500, height:300}
     */
$.widget( "om.omAccordion", {
	
    options: /**@lends omAccordion#*/{
        /**
         * 抽屉布局首次展现时，默认展开的抽屉的索引，可以为整数,也可以为抽屉的id,获取当前处于激活状态的抽屉id可用getActivated()方法。<br/>
         * 如果创建组件时想所有抽屉都不展开，可以这样创建<br/>
         * $('#make-accordion').omAccordion({collapsible:true,active:-1});<br/>
         * 组件会优先按id进行处理，如果找不到对应抽屉，则以索引处理，在处理索引时，将会用parseInt及isNaN进行处理。<br/>
         * <ul>
         * <li>如果抽屉个数为0，则active=-1，</li>
         * <li>如果抽屉个数大于0，且active小于0(当为-1时并且collapsible!==false，则可以收起所有抽屉)，则active=0，</li>
         * <li>如果抽屉个数大于0，且active大于抽屉的个数，则active=抽屉的个数-1</li>
         * </ul>
         * @default 0
         * @type Number String
         * @example
         * //激活第一个抽屉
         * $('#make-accordion').omAccordion({active: 1});
         * //激活id为'contentId'的抽屉
         * $('#make-accordion').omAccordion({active: 'contentId'});
         * //收起所有的抽屉(这时必须有collapsible!==false)
         * $('#make-accordion').omAccordion({active:-1});
         */
        active:0,
        /**
         * 是否自动循环切换抽屉。跟interval配合使用，interval用来指定切换的时间间隔。
         * @default false
         * @type Boolean
         * @example
         * //自动循环切换抽屉
         * $('#make-accordion').omAccordion({autoPlay: true});
         */
        autoPlay : false,
        /**
         * 是否允许将所有抽屉收起。当该值为true时，点击已经展开的抽屉时该抽屉被收起，结果所有抽屉都处于收起状态。（默认情况下不可以收起该抽屉，任一时刻总有一个抽屉是处于激活状态的）。
         * @default false
         * @type Boolean
         * @example
         * //设置可以收起所有的抽屉
         * $('#make-accordion').omAccordion({collapsible :true});<br/>
         * //接着再执行下边代码就可以收起所有抽屉了
         * $('#make-accordion').omAccordion({active : -1});<br/>
         */
        collapsible : false,
        /**
         * 是否禁用组件。如果禁用，则不可以对抽屉进行任何操作。
         * @type Boolean
         * @default false
         * @example
         * $('#make-accordion').omAccordion({disabled:true});
         */
        disabled : false,
        /**
         * 抽屉布局的高度，可取值为'auto'（每个抽屉的高度分别由抽屉的内容决定），可以取值为'fit'，表示适应父容器的大小（height:100%）。任何其他的值（比如百分比、数字、em单位、px单位的值等等）将被直接赋给height属性。
         * @default 'auto'
         * @type Number,String
         * @example
         * $('#make-accordion').omAccordion({height: '50%'});
         */
        height:'auto',
        /**
         * 每个抽屉的header前面可以配置一个小图标，iconCls为该小图标的样式。该图标的配置与其他属性不同，不是配置在config对象中，而是作为DOM结构中 &lt;a&gt; 标签的属性而存在。
         * 在上面的demo"简单抽屉"中可以看到完整的示例。
         * @default 无
         * @type String
         * @example
         * //DOM树结构，注意a标签上的iconCls
         * &lt;div id="make-accordion"&gt;
         *  &lt;ul&gt;
         *      &lt;li&gt;
         *          &lt;a iconCls="file-save" href="#accordion-1"&gt;&lt;/a&gt;
         *      &lt;/li&gt;
         *  &lt;/ul&gt;
         *  &lt;div id="accordion-1"&gt;
         *      This is Accordion-1
         *  &lt;/div&gt;
         * &lt;/div&gt;
         */
        iconCls : null,
        /**
         * 当自动循环切换抽屉（将autoPlay设置true）时，两次切换动作之间的时间间隔，单位为毫秒。
         * @default 1000
         * @type Number
         * @example
         * //每隔2s自动切换抽屉
         * $('#make-accordion').omAccordion({autoPlay: true, interval : 2000});
         */
        interval : 1000,
        /**
         * 抽屉切换时是否需要动画效果，若启用动画效果，则使用jQuery的slideUp和slideDown，动画速度为fast， 动画效果不可定制。
         * @default false
         * @type Boolean
         * @example
         * //收起和展开抽屉时使用动画效果
         * $('#make-accordion').omAccordion({switchEffect: true});
         */
        switchEffect : false,
        /**
         * 抽屉切换的方式。取值为下面的2种之一: "click"、"mouseover"。click表示单击切换，mouseover表示鼠标滑过切换。
         * @default "click"
         * @type String
         * @example
         * //鼠标滑过切换抽屉
         * $('#make-accordion').omAccordion({switchMode: 'mouseover'});
         */
        switchMode:"click",
        /**
         * 抽屉布局的宽度，可取值为'auto'（默认情况,由浏览器决定宽度），可以取值为'fit'，表示适应父容器的大小（width:100%）。任何其他的值（比如百分比、数字、em单位、px单位的值等等）将被直接赋给width属性。 
         * @default 'auto'
         * @type Number,String
         * @example
         * $('#make-accordion').omAccordion({width: 500});
         */
        width:'auto',
        /**
         * 激活一个抽屉时执行的方法
         * @event
         * @param index 被激活的抽屉的索引，从0开始计数。
         * @default emptyFn 
         * @example
         *  $('#make-accordion').omAccordion({
         *      onActivate : function(index) {
         *          alert('accordion ' + index + ' has been activated!');
         *      }
         *  });
         */
        onActivate: function(index){
        },
        /**
         * 激活一个抽屉之前执行的方法。
         * 如果返回布尔值false,那么对应抽屉将不会激活。
         * @event
         * @param index 被选择的抽屉的索引，从0开始计数。
         * @default emptyFn 
         * @example
         *  $('#make-accordion').omAccordion({
         *      onBeforeActivate : function(index) {
         *          alert('accordion ' + index + ' will be activated!');
         *      }
         *  });
         */
        onBeforeActivate: function(index){
        },
        /**
         * 收起一个抽屉前执行的方法。
         * 如果返回布尔值false,那么对应抽屉将不会被收起。
         * @event
         * @param index 被收起的抽屉的索引，从0开始计数。
         * @default emptyFn 
         * @example
         *  $('#make-accordion').omAccordion({
         *      onBeforeCollapse : function(index) {
         *          alert('accordion ' + index + ' will been collapsed!');
         *      }
         *  });
         */
        onBeforeCollapse: function(index){
        },
        /**
         * 收起一个抽屉时执行的方法
         * @event
         * @param index 被收起的抽屉的索引，从0开始计数。
         * @default emptyFn 
         * @example
         *  $('#make-accordion').omAccordion({
         *      onCollapse : function(index) {
         *          alert('accordion ' + index + ' has been collapsed!');
         *      }
         *  });
         */
        onCollapse : function(index) {
        }
    },
    /**
     * 激活指定的抽屉。index为整数或者抽屉的id。<br/>
     * 任何其它数据将会用parseInt及isNaN进行处理。
     * (注意，如果组件为禁用状态，执行此方法无任何效果)
     * <ul>
     * <li>如果抽屉个数为0，则不激活任何抽屉</li>
     * <li>如果抽屉个数大于0，且index<0，则激活第一个抽屉(索引为0的那个抽屉)</li>
     * <li>如果抽屉个数大于0，且index>=抽屉的个数，则激活最后一个抽屉</li>
     * </ul>
     * @name omAccordion#activate
     * @function
     * @param index 要激活的抽屉的索引(从0开始)或者抽屉的id
     * @example
     * $('#make-accordion').omAccordion('activate', '1');
     */
    activate: function(index){
    	var options = this.options;
    	clearInterval(options.autoInterId);
    	index = this._correctIndex(index);
        index = index == -1 ? 0 : index;
        this._activate(index);
        this._setAutoInterId(this);
        return this;
    },
    /**
     * 禁用整个抽屉组件。
     * @name omAccordion#disable
     * @function
     * @example
     * $('#make-accordion').omAccordion('disable');
     */
    disable : function() {
        var panels= $.data(this.element , "panels");
        var len = panels.length;
        while(len--){
            $(panels[len]).omPanel("disable");
        }
        var options = this.options;
        if (options.autoPlay) {
            clearInterval(options.autoInterId);
        }
        options.disabled = true;
    },
    /**
     * 使整个抽屉处于可用状态(即非禁用状态)
     * @name omAccordion#enable
     * @function
     * @example
     * $('#make-accordion').omAccordion('enable');
     */
    enable : function() {
        var panels= $.data(this.element , "panels");
        var len = panels.length;
        while(len--){
            $(panels[len]).omPanel("enable");
        }
        this._buildEvent();
        this.options.disabled = false;
    },
    /**获取当前处于激活状态的抽屉的id,如果抽屉总数为0或者当前没有抽屉处于激活状态，那么返回null<br/>
     * 抽屉的id在创建时可以自行指定，如果没有指定，组件内部会动态产生一个.<br/>
     * //DOM树结构，注意，下面代码创建后的抽屉的id为accordion-1.<br/>
     * <pre>
     * &lt;div id="make-accordion"&gt;
     *  &lt;ul&gt;
     *      &lt;li&gt;
     *          &lt;a iconCls="file-save" href="#accordion-1"&gt;&lt;/a&gt;
     *      &lt;/li&gt;
     *  &lt;/ul&gt;
     *  &lt;div id="accordion-1"&gt;
     *      This is Accordion-1
     *  &lt;/div&gt;
     * &lt;/div&gt;
     * </pre>
     * @name omAccordion#getActivated
     * @function
     * @returns 当前处于激活状态的抽屉的id
     * @example
     * $('#make-accordion').omAccordion('getActivated');
     */
    getActivated: function(){
        var panels= $.data(this.element , "panels"),
        active = this.options.active;
        return active===-1||!this.element.data('hasCreated')? null : $(panels[active]).omPanel('body').prop('id');
    },
    /**
     * 获取抽屉的总数。
     * @name omAccordion#getLength
     * @function
     * @return len 抽屉的总数
     * @example
     * var len = $('#make-accordion').omAccordion('getLength');
     * alert('total lenght of accordoins is : ' + len);
     */
    getLength: function(){
        return $.data(this.element, "panels").length;
    },
    /**
     * 重新装载指定抽屉的内容.如果该抽屉的数据源是url，则根据该url去取内容，如果该抽屉的数据源是普通文本，则什么都不会做。
     * @name omAccordion#reload
     * @function
     * @param index 要重新装载内容的抽屉的索引（从0开始计数）或者是抽屉的id
     * @example
     * //重新装载索引为1的抽屉
     * $('#make-accordion').omAccordion('reload', 1);
     */
    reload: function(index) {
        var panels= $.data(this.element , "panels");
        if(this.options.disabled !== false || panels.length === 0){
            return this;
        }
        index = this._correctIndex(index);
        $(panels[index]).omPanel('reload');
    },
    /**
     * 重新计算并动态改变整个布局组件的大小,重新设置了组件的宽和高后要调用此方法才可以生效。
     */
    resize: function() {
        if(this.options.disabled !== false){
            return this;
        }
        var acc = this.element,
            panels = $.data(this.element , "panels"),
            len = panels.length,
            panelBodyHeight;
        this._initWidthOrHeight('width');
        this._initWidthOrHeight('height');
        if(this.options.height !== 'auto'){
            panelBodyHeight = acc.innerHeight();
            var i;
            for(i=0; i<len; i++){
                panelBodyHeight -= $(panels[i]).omPanel("panel").outerHeight(true);
            }
            var activePanelId = this.getActivated();
            if(activePanelId){
                panelBodyHeight += acc.find("#"+activePanelId).omPanel('body').outerHeight();
            }
            for(i=0 ; i<len; i++){
                var panelBody = $(panels[i]).omPanel('body');
                panelBody.height( panelBodyHeight - (panelBody.outerHeight()-panelBody.height()) );
            }
        }else{
            for(i=0 ; i<len; i++){
                var panelBody = $(panels[i]).omPanel('body');
                panelBody.css('height' , "");
            }
        }
        return this;
    }, 
    /**
     * 设置指定抽屉的标题，标题内容可以为html文本
     * @name omAccordion#setTitle
     * @function
     * @param index 要改变标题的抽屉的索引（从0开始计数）或者是抽屉的id
     * @param title 新的标题，内容可以为html
     * @example
     * $('#make-accordion').omAccordion('setTitle',0,'apusic').omAccordion('setTitle',1,'AOM');
     */
    setTitle: function(index , title){
        var panels= $.data(this.element , "panels");
        if(this.options.disabled !== false || panels.length === 0){
            return this;
        }
        index = this._correctIndex(index);
        $(panels[index]).omPanel("header").find(">div.om-panel-title").html(title);
        return this;
    },
    
    /**
     * 重新设置指定抽屉的数据源。注意该方法只会重新设置数据源，而不会主动去装载。<br/>
     * 重新装载需要调用另一个api : $('make-accordion').omAccordion('reload',1);<br/>
     * 如果需要更换内容的抽屉并不是用url去装载的，可以用如下方法更换:<br/>
     * $("#accordionId").find("#accordion-2").html("我们是AOM，一个神奇的团队");<br/>
     * 其中accordion-2为抽屉的id.
     * @name omAccordion#url
     * @function
     * @param index 要重新设置数据源的抽屉的索引（从0开始计数）
     * @example
     * //重新设置第二个抽屉的数据源，然后重新装载该抽屉的内容
     * $('#make-accordion').omAccordion( 'url', 1, './ajax/content2.html' );
     * $('#make-accordion').omAccordion( 'reload',1 );
     */
    url : function(index, url) {
        var panels= $.data(this.element , "panels"),
        	len = panels.length;
        if (!url || this.options.disabled !== false || panels.length === 0) {
            return ;
        }
        index = this._correctIndex(index);
        $(panels[index]).omPanel('options', {
            url : url
        });
    },
    _create: function(){
        var acc = this.element,
            options = this.options,
            panels = [],
            len,
            index = options.active,
            panel;
        acc.addClass("om-widget om-accordion");
        this._renderPanels();
        this.resize();
        index = this._correctIndex(index);
        if(index !=-1 || !(options.collapsible!==false)){
            index = index == -1 ? 0 : index;
            this._activate(index);
        }
        options.disabled !== false ? this.disable() : this._buildEvent();
        acc.data('hasCreated' , true);//组件已创建标记
    },
    /**
     * 修正索引，返回值为-1,0,1,2,...,len-1
     * 只有组件第一次创建的时候才有可能返回-1
     */
    _correctIndex: function(index){
    	var acc = this.element,
        	options = this.options,
        	panels = $.data(this.element , "panels"),
        	panel = acc.children().find(">div#"+index),
        	len = panels.length,
        	oldIndex = index;
        index = panel.length ? $(panels).index(panel) : index;
        index = index==-1 ? oldIndex : index;
        //如果id找不到，则认为是索引，进行修正
        var r = parseInt(index);
        r = (isNaN(r) && '0' || r)-0;
        return len==0 || r==-1&&!acc.data('hasCreated')? -1: (r<0? 0 : (r>=len?len-1 : r));
    },
    _renderPanels: function () {
        var acc = this.element,
        	self = this,
            panels = [],
            options = this.options;
        var headers = acc.find("ul:first");
        headers.find("a").each(function(n){
            var href  = this.getAttribute('href', 2);
            var hrefBase = href.split( "#" )[ 0 ],
                baseEl;
            if ( hrefBase && ( hrefBase === location.toString().split( "#" )[ 0 ] ||
                    ( baseEl = $( "base" )[ 0 ]) && hrefBase === baseEl.href ) ) {
                href = this.hash;
                this.href = href;
            }
            var anchor = $(this);
            var cfg = {
                    title : anchor.text(),
                    tools : ['collapse'],
                    iconCls: anchor.attr("iconCls"),
                    clickExpand : true,
                    onExpand : function() {
                        options.onActivate(n);
                    },
                    collapsed : true,
                    onCollapse : function() {
                        if(acc.data('hasCreated')){
                            options.onCollapse(n);
                        }
                    },
                    border : true
            };
            var target = $('>' + href, acc);
            var pId = target.prop("id"); 
            //target要么指向一个当前页面的div，要么是一个url
            if (!!(target[0])) {
                if(!pId){
                    target.prop("id" , panelIdPrefix+(id++));
                }
                cfg.content = target.html();
                panels.push(self._createPanel(target[0], cfg));
            } else {
                cfg.url = anchor.attr('href');
                var panel = self._createPanel($('<div></div>')[0], cfg);
                panels.push(panel);
                var aid = anchor.prop('id');
                $(panel).prop("id" , aid?aid:panelIdPrefix+(id++));
            }
            
            $(panels[n]).omPanel('panel').appendTo(acc);
            if(n === 0){
                var first = $(panels[0]).omPanel('header');
                first.css('border-top-width' , first.css('border-bottom-width'));
            }
        }); 
        $.data(acc , "panels" , panels);
        headers.remove();
    },
    _initWidthOrHeight: function(type){
    	var acc = this.element,
        	options = this.options,
        	styles = this.element.attr("style"),
        	value = options[type];
    	if(styles && styles.indexOf(type)!=-1 && !acc.data('hasCreated')){
    		options[type] = acc.css(type);
    	}else if(value === 'fit'){
    		options[type] = '100%';
            acc.css(type, '100%');
    	}else{
    		acc.css(type , value==='auto'?"":value);
    	}
    },
    _createPanel: function(target, config){
        $(target).omPanel(config);
        return target;      
    },
    _buildEvent: function() {
        var options = this.options,
            self = this;
        this.element.children().find('>div.om-panel-header').each(function(n){
            var header = $(this);
            header.unbind();
            header.find('div.om-panel-tool').children().unbind();
            header.hover(function(){
                $(this).addClass("om-state-hover");
            },function(){
                $(this).removeClass("om-state-hover");
            });
            if ( options.switchMode == 'mouseover' ) {
                header.bind('mouseenter.omaccordions', function(event){
                	clearInterval(options.autoInterId);
                    var timer = $.data(self.element, 'expandTimer');
                    (typeof timer !=='undefined') && clearTimeout(timer);
                    timer = setTimeout(function(){
                    	self._activate(n , true);
                        self._setAutoInterId(self);
                    },200);
                    $.data(self.element, 'expandTimer', timer);
                });
            } else if ( options.switchMode == 'click' ) {
                header.bind('click.omaccordions', function(event) {
                    clearInterval(options.autoInterId);
                    self._activate(n , true);
                    self._setAutoInterId(self);
                });
            } 
        });
        if (options.autoPlay) {
            clearInterval(options.autoInterId);
            self._setAutoInterId(self);
        }
    },
    _setAutoInterId: function(self){
    	var options = self.options;
    	if (options.autoPlay) {
    		options.autoInterId = setInterval(function(){
                self._activate('next');
            }, options.interval);
        }
    },
    _setOption: function( key, value ) {
		$.Widget.prototype._setOption.apply( this, arguments );
		var options = this.options;
		switch(key){
			case "active":
				var active = this.getActivated();
				if(value == '-1' && options.collapsible!==false && options.disabled===false){
					//说明可以全部收起
					var old = active,
					    anim,
					    speed;
					active = this._correctIndex(active);
					if(old && options.onBeforeCollapse.call(this,active)!==false){
						if (options.switchEffect) {
				            anim = true;
				            speed = 'fast';
				        }
						var panels = $.data(this.element , 'panels');
						$(panels[active]).omPanel('collapse', anim, speed);
//						$(panels[active]).omPanel('header').removeClass('om-state-active');
		                options.active = -1;
					}
					break;
				}
				this.activate(this._correctIndex(value));
				break;
			case "disabled":
				value===false?this.enable():this.disable();
				break;
			case "width":
				if(value == 'fit'){
					options.width = "100%";
				}
				break;
			case "height":
				if(value == 'fit'){
					options.height = "100%";
				}
				break;
		}
    },
    _activate: function(index , isSwitchMode){
        var panels = $.data(this.element , "panels"),
        len = panels.length,
        options = this.options,
        self = this,
        isExpand = false,
        expandIndex=-1,
        anim,
        speed;
    	if(options.disabled !== false && this.element.data('hasCreated') || len === 0){
    		return ;
    	}
    	index = index==='next' ? (options.active + 1) % len : self._correctIndex(index);
        if (options.switchEffect) {
            anim = true;
            speed = 'fast';
        }
        for(var i=0; i<len; i++){
            $(panels[i]).stop(true , true);
        }
        //找出当前展开的panel
        var active = self.getActivated();
        isExpand = !!active;
        if(isExpand){
            expandIndex = self._correctIndex(active);
            if(expandIndex == index){
                if( isSwitchMode === true && options.collapsible !== false && options.onBeforeCollapse.call(self , expandIndex)!==false){
                    $(panels[expandIndex]).omPanel('collapse', anim, speed);
//                    $(panels[expandIndex]).omPanel('header').removeClass('om-state-active');
                    options.active = -1;
                }
            }else{//当前想要激活的抽屉并不是处于激活状态
                var canAct;
                if( options.onBeforeCollapse.call(self , expandIndex)!==false 
                        && ((canAct=options.onBeforeActivate.call(self, index)!==false) || options.collapsible !== false) ){
                    //收起抽屉，然后整个组件的抽屉都将处于收起状态
                    $(panels[expandIndex]).omPanel('collapse', anim, speed);
//                    $(panels[expandIndex]).omPanel('header').removeClass('om-state-active');
                    if(canAct){
                        //可以激活,进行激活
                        $(panels[index]).omPanel('expand', anim, speed);
//                        $(panels[index]).omPanel('header').addClass('om-state-active');
                    }
                    options.active = canAct?index:-1;
                }
            }
        }else{//当前并没有任何已经激活的抽屉
            if(options.onBeforeActivate.call(self, index)!==false){
                $(panels[index]).omPanel('expand', anim, speed);
//                $(panels[index]).omPanel('header').addClass('om-state-active');
                options.active = index;
            }
        }
        return this;
    }
});
})( jQuery );
/*
 * $Id: om-ajaxsubmit.js,v 1.12 2012/01/16 01:48:41 linxiaomin Exp $
 * operamasks-ui omAjaxSubmit 1.0
 *
 * Copyright 2011, AUTHORS.txt (http://ui.operamasks.org/about)
 * Dual licensed under the MIT or GPL Version 2 licenses.
 * http://ui.operamasks.org/license
 *
 * http://ui.operamasks.org/docs/
 */
;(function($) {

/*
	Usage Note:
	-----------
	Do not use both omAjaxSubmit and ajaxForm on the same form.  These
	functions are intended to be exclusive.  Use omAjaxSubmit if you want
	to bind your own submit handler to the form.  For example,

	$(document).ready(function() {
		$('#myForm').bind('submit', function(e) {
			e.preventDefault(); // <-- important
			$(this).omAjaxSubmit({
				target: '#output'
			});
		});
	});

	Use ajaxForm when you want the plugin to manage all the event binding
	for you.  For example,

	$(document).ready(function() {
		$('#myForm').ajaxForm({
			target: '#output'
		});
	});

	When using ajaxForm, the omAjaxSubmit function will be invoked for you
	at the appropriate time.
*/

/**
 * @name omAjaxSubmit
 * @class
 * <div>
 * omAjaxSubmit() 提供使用ajax方式提交HTML form的一种机制。本插件会监听表单的submit事件，<br/>
 * 覆盖传统的submit事件监听器，而使用ajax方式来处理submit事件。在表单提交之前，本插件会收集<br/>
 * 所有的表单字段，并将之序列化后附加在ajax请求的数据域(data)中。支持所有标准的html可提交的<br/>
 * 表。元素。
 * </div><br/>
 * <b>事件回调</b><br/>
 * <div>
 * 通过丰富的配置参数，omAjaxSubmit可以高度自定制。同时提供多个事件回调函数，在每一次完整<br/>
 * 的表单提交的过程中，用户有时机能够对提交的请求进行修改。
 * </div>
 * <pre>beforeSerialize:</pre>
 * <div style="text-indent:2em;">在form序列化之前执行的回调函数。在获取所有form表单字段的值之前，该函数提供了一个操作form的时机</div>
 * <pre>beforeSubmit:</pre>
 * <div style="text-indent:2em;">在form被提交之前执行的回调函数。该函数提供了一个时机来执行预提交的逻辑，比如表单校验</div><br/>
 * <b>工具方法</b><br/>
 * <div>omAjaxSubmit还提供了一系列静态工具方法，用于方便地操作表单及其字段。</div>
 * <pre>$.fn.formToArray()</pre>
 * <div style="text-indent:2em;">将表单所有元素转换成key/value的数组，例如[{name:'username', value:'jack'},{name:'password', value:'secret'}]，<br/>
 * 注意:该数组将作为参数传递给beforeSubmit函数</div>
 * <pre>$.fn.formSerialize()</pre>
 * <div style="text-indent:2em;">将表单数据序列化成可提交的字符串，例如name1=value1&amp;name2=value2</div>
 * <pre>$.fn.fieldSerialize()</pre>
 * <div style="text-indent:2em;">将表单所有元素序列化成可提交的字符串，例如name1=value1&amp;name2=value2</div>
 * <pre>$.fn.fieldValue()</pre>
 * <div style="text-indent:2em;">获取当前元素(或元素数组)的值</div>
 * <pre>$.fieldValue(successful)</pre>
 * <div style="text-indent:2em;">静态工具方法，用于获取元素的值，参数successful的意义同上</div>
 * <pre>$.fn.clearForm()</pre>
 * <div style="text-indent:2em;">清空当前表单各个元素的值</div>
 * <pre>$.fn.clearFields()</pre>
 * <div style="text-indent:2em;">清空当前元素(或元素数组)的值</div>
 * <pre>$.fn.resetForm()</pre>
 * <div style="text-indent:2em;">重置当前表单各个元素的值</div>
 * <pre>$.fn.enable(b)</pre>
 * <div style="text-indent:2em;">设置当前元素(或元素数组)的使能状态</div>
 * <pre>$.fn.selected(selected)</pre>
 * <div style="text-indent:2em;">设置当前元素(或元素数组)的选中状态</div><br/>
 * <b>示例</b><br/>
 * <pre>
 *  $(document).ready(function() {
 *      $('#myForm').bind('submit', function(e) {
 *          e.preventDefault(); //阻止form默认的提交行为
 *              $(this).omAjaxSubmit(//使用ajax提交
 *                  {
 *                      target: '#output'
 *                  }
 *              );
 *      });
 *  });
 * 
 * </pre>
 * @constructor
 * @param options 标准config对象
 * @example
 * 	$('#formId').omAjaxSubmit({target: '#output'});
 */
$.fn.omAjaxSubmit = function(options) {
	// fast fail if nothing selected (http://dev.jquery.com/ticket/2752)
	if (!this.length) {
		log('omAjaxSubmit: skipping submit process - no element selected');
		return this;
	}
	
	var method, action, url, $form = this;

	if (typeof options == 'function') {
		options = { success: options };
	}

	method = this.attr('method');
	action = this.attr('action');

	url = (typeof action === 'string') ? $.trim(action) : '';
	url = url || window.location.href || '';
	if (url) {
		// clean url (don't include hash vaue)
		url = (url.match(/^([^#]+)/)||[])[1];
	}

	options = $.extend(true, {
        /**
         * 表单提交的url。
         * @name omAjaxSubmit#url
         * @type String
         * @default form的action属性值
         * @example
         * $('#formId').omAjaxSubmit({url : 'result.jsp'});
         */
		url:  url,
        /**
         * 当表单提交成功并取到响应时，执行的回调函数。
         * @name omAjaxSubmit#success
         * @param responseText 响应的文本。具体的取值根据options中的dataType有关，请参考dataType属性的说明文档。
         * @param statusText 响应的状态，在该回调中，常见的取值为success
         * @param xhr XMLHttpRequest对象
         * @param $form 经过jQuery包装的form对象
         * @event
         * @default 无
         * @example
         * //定义一个函数
         * function showResponse(responseText, statusText, xhr, $form) {
         *  alert('submit success!');
         * }
         * //提交成功取到响应时的回调函数
         * $('#formId').omAjaxSubmit({success: showResponse});
         */
		success: $.ajaxSettings.success,
        /**
         * 表单的提交方法，取值为：'GET' 或者 'POST'。
         * @name omAjaxSubmit#method
         * @type String
         * @default 'GET'
         * @example
         * $('#formId').omAjaxSubmit({method:'POST'});
         */
		method: method || 'GET',
        /**
         * iframe的src属性值，该属性在页面中有iframe的时候才用得到，通常此时form中有文件需要上传。<br/>
         * 默认值是about:blank ，如果当前页面地址使用 https 协议，则该值为javascript:false
         * @blocked
         */
		iframeSrc: /^https/i.test(window.location.href || '') ? 'javascript:false' : 'about:blank'
	}, options);

	// hook for manipulating the form data before it is extracted;
	// convenient for use with rich editors like tinyMCE or FCKEditor
	var veto = {};
	this.trigger('form-pre-serialize', [this, options, veto]);
	if (veto.veto) {
		log('omAjaxSubmit: submit vetoed via form-pre-serialize trigger');
		return this;
	}

    /**
     * 在form序列化之前执行的回调函数。在获取form表单元素的值之前，该函数提供了一个操作form的时机。<br/>
     * 该函数接受2个参数<br/>
     * @name omAjaxSubmit#beforeSerialize
     * @event
     * @param $form form对应的jQuery对象
     * @param options 传给ajaxSubmit的options对象
     * @return false 取消form的提交
     * @example
     * beforeSerialize: function($form, options) { 
     *     // return false to cancel submit                  
     * }
     */
	// provide opportunity to alter form data before it is serialized
	if (options.beforeSerialize && options.beforeSerialize(this, options) === false) {
		log('omAjaxSubmit: submit aborted via beforeSerialize callback');
		return this;
	}

    /**
     * 
     * 是否以严格的语义化顺序提交form表单元素。同时，设置了该属性会忽略表单中的image标签。<br/>
     * 该属性一般不用设置(默认为false)。只有当你的服务器对semantic order有严格要求，<br/>
     * 并且你的表单中含有image时，你才需要设置它为true<br/>
     * @blocked
     */
	var n,v,a = this.formToArray(options.semantic);
    /**
     * ajax提交中的附加数据，以JSON的形式组成(key/value)。如果value是数组，将会被展开;如果value是函数，将会被求值。
     * @type JSON
     * @name omAjaxSubmit#data
     * @default 无
     * @example
     * data: { key1: 'value1', key2: 'value2' }
     */
	if (options.data) {
		options.extraData = options.data;
		for (n in options.data) {
			if(options.data[n] instanceof Array) {
				for (var k in options.data[n]) {
					a.push( { name: n, value: options.data[n][k] } );
				}
			}
			else {
				v = options.data[n];
				v = $.isFunction(v) ? v() : v; // if value is fn, invoke it
				a.push( { name: n, value: v } );
			}
		}
	}

    /**
     * 在form被提交之前执行的回调函数。该函数提供了一个时机来执行预提交的逻辑，或者可以用来进行校验表单元素。<br/>
     * 该函数接受3个参数:arr, $form, options。<br/>
     * 若函数返回false，则会取消form的提交。<br/>
     * @name omAjaxSubmit#beforeSubmit
     * @type Function
     * @event
     * @param arr 一个数组，包含form所有字段的key/value值，例如: [{key:value},{key1:value1},{key2:value2}]
     * @param $form form对应的jQuery对象
     * @param options 传递给ajaxSubmit的options参数
     * @return false 取消提交表单
     * @example
     * beforeSubmit: function(arr, $form, options) { 
     *     // The array of form data takes the following form: 
     *     // [ { name: 'username', value: 'jresig' }, { name: 'password', value: 'secret' } ] 
     *     // return false to cancel submit                  
     * }
     */
	// give pre-submit callback an opportunity to abort the submit
	if (options.beforeSubmit && options.beforeSubmit(a, this, options) === false) {
		log('omAjaxSubmit: submit aborted via beforeSubmit callback');
		return this;
	}

	// fire vetoable 'validate' event
	this.trigger('form-submit-validate', [a, this, options, veto]);
	if (veto.veto) {
		log('omAjaxSubmit: submit vetoed via form-submit-validate trigger');
		return this;
	}

	var q = $.param(a);

	if (options.method.toUpperCase() == 'GET') {
		options.url += (options.url.indexOf('?') >= 0 ? '&' : '?') + q;
		options.data = null;  // data is null for 'get'
	}
	else {
		options.data = q; // data is the query string for 'post'
	}

    var callbacks = [];
    /**
     * 在form成功提交后，是否将form字段重置
     * @name omAjaxSubmit#resetForm
     * @type Boolean
     * @default false
     * @example
     * //提交后重置表单字段
     * $('#formId').omAjaxSubmit({resetForm: true});
     */
	if (options.resetForm) {
		callbacks.push(function() { $form.resetForm(); });
	}
    /**
     * 在form成功提交后，是否将form字段清空。<br/>
     * @name omAjaxSubmit#clearForm
     * @type Boolean
     * @default false
     * @example
     * $('#formId').omAjaxSubmit({clearForm: true});
     */
	if (options.clearForm) {
		callbacks.push(function() { $form.clearForm(); });
	}

    /**
     * 响应的数据格式，可选的取值为'xml'， 'script'， 'json'或者null。该选项表明了响应将要被如何处理。<br/>
     * 与jQuery.httpData一一对应，其各种取值情况处理如下：<br/>
     * <pre>
     *      'xml':	响应将会被认为是xml格式的，并作为第一个参数传递给success回调函数
     *      'json':	响应将会被认为是json格式的，其将会被求值，结果将会作为第一个参数传递给success回调函数
     *      'script':响应将会被认为是js脚本，其将在全局上下文中被执行
     * </pre>
     * @name omAjaxSubmit#dataType
     * @type String
     * @default undefined
     * @example
     * $('#formId').omAjaxSubmit({dataType : 'json'}); 
     */
    /**
     * 指定了一个更新区域，该区域将会被ajax响应更新。<br/>
     * 该值可以是DOM元素，jQuery对象，或者一个可以被jQuery选择到的选择器。
     * @name omAjaxSubmit#target
     * @type DOM, jQuery, or String
     * @default 无
     * @example
     * $('#formId').omAjaxSubmit({target : '#targetDivId'});
     */
	// perform a load on the target only if dataType is not provided
	if (!options.dataType && options.target) {
		var oldSuccess = options.success || function(){};
		callbacks.push(function(data) {
            /**
             * 可选配置，是否替换target指定的区域。<br/>
             * 设为true将会整体替换target对应的DOM节点，设为false将只会替换节点的内容。<br/>
             * @name omAjaxSubmit#replaceTarget
             * @type Boolean 
             * @default false
             * @example
             * $('#formId').omAjaxSubmit({replaceTarget : true});
             */
			var fn = options.replaceTarget ? 'replaceWith' : 'html';
			$(options.target)[fn](data).each(oldSuccess, arguments);
		});
	}
	else if (options.success) {
		callbacks.push(options.success);
	}

	options.success = function(data, status, xhr) { // jQuery 1.4+ passes xhr as 3rd arg
		var context = options.context || options;   // jQuery 1.4+ supports scope context 
		for (var i=0, max=callbacks.length; i < max; i++) {
			callbacks[i].apply(context, [data, status, xhr || $form, $form]);
		}
	};

	// are there files to upload?
	var fileInputs = $('input:file', this).length > 0;
	var mp = 'multipart/form-data';
	var multipart = ($form.attr('enctype') == mp || $form.attr('encoding') == mp);

    /**
     * 是否总是将form的响应指向一个iframe，该属性在有文件上传的情况下有用。
     * @blocked
     */
	// options.iframe allows user to force iframe mode
	// 06-NOV-09: now defaulting to iframe mode if file input is detected
   if (options.iframe !== false && (fileInputs || options.iframe || multipart)) {
	   // hack to fix Safari hang (thanks to Tim Molendijk for this)
	   // see:  http://groups.google.com/group/jquery-dev/browse_thread/thread/36395b7ab510dd5d
	   if (options.closeKeepAlive) {
		   $.get(options.closeKeepAlive, function() { fileUpload(a); });
		}
	   else {
		   fileUpload(a);
		}
   }
   else {
		// IE7 massage (see issue 57)
		if ($.browser.msie && method == 'get') { 
			var ieMeth = $form[0].getAttribute('method');
			if (typeof ieMeth === 'string')
				options.method = ieMeth;
		}
		options.type = options.method;
		$.ajax(options);
   }

	// fire 'notify' event
	this.trigger('form-submit-notify', [this, options]);
	return this;


	// private function for handling file uploads (hat tip to YAHOO!)
	function fileUpload(a) {
		var form = $form[0], el, i, s, g, id, $io, io, xhr, sub, n, timedOut, timeoutHandle;
        var useProp = !!$.fn.prop;

        if (a) {
        	// ensure that every serialized input is still enabled
          	for (i=0; i < a.length; i++) {
                el = $(form[a[i].name]);
                el[ useProp ? 'prop' : 'attr' ]('disabled', false);
          	}
        }

		if ($(':input[name=submit],:input[id=submit]', form).length) {
			// if there is an input with a name or id of 'submit' then we won't be
			// able to invoke the submit fn on the form (at least not x-browser)
			alert('Error: Form elements must not have name or id of "submit".');
			return;
		}
		
		s = $.extend(true, {}, $.ajaxSettings, options);
		s.context = s.context || s;
		id = 'jqFormIO' + (new Date().getTime());
		/**
		 * 指定一个iframe元素。当本插件处理有文件上传的form时，一般会临时创建一个隐藏的iframe来接收响应。<br/>
		 * 配置该属性，用户可以使用一个已存在的iframe，而不是使用临时iframe。<br/>
		 * 注意使用该属性后，本插件不会再去尝试处理服务器的响应。<br/>
		 * @blocked
         */
		if (s.iframeTarget) {
			$io = $(s.iframeTarget);
			n = $io.attr('name');
			if (n == null)
			 	$io.attr('name', id);
			else
				id = n;
		}
		else {
			$io = $('<iframe name="' + id + '" src="'+ s.iframeSrc +'" />');
			$io.css({ position: 'absolute', top: '-1000px', left: '-1000px' });
		}
		io = $io[0];


		xhr = { // mock object
			aborted: 0,
			responseText: null,
			responseXML: null,
			status: 0,
			statusText: 'n/a',
			getAllResponseHeaders: function() {},
			getResponseHeader: function() {},
			setRequestHeader: function() {},
			abort: function(status) {
				var e = (status === 'timeout' ? 'timeout' : 'aborted');
				log('aborting upload... ' + e);
				this.aborted = 1;
				$io.attr('src', s.iframeSrc); // abort op in progress
				xhr.error = e;
				s.error && s.error.call(s.context, xhr, e, status);
				g && $.event.trigger("ajaxError", [xhr, s, e]);
				s.complete && s.complete.call(s.context, xhr, e);
			}
		};

		g = s.global;
		// trigger ajax global events so that activity/block indicators work like normal
		if (g && ! $.active++) {
			$.event.trigger("ajaxStart");
		}
		if (g) {
			$.event.trigger("ajaxSend", [xhr, s]);
		}

		if (s.beforeSend && s.beforeSend.call(s.context, xhr, s) === false) {
			if (s.global) {
				$.active--;
			}
			return;
		}
		if (xhr.aborted) {
			return;
		}

		// add submitting element to data if we know it
		sub = form.clk;
		if (sub) {
			n = sub.name;
			if (n && !sub.disabled) {
				s.extraData = s.extraData || {};
				s.extraData[n] = sub.value;
				if (sub.type == "image") {
					s.extraData[n+'.x'] = form.clk_x;
					s.extraData[n+'.y'] = form.clk_y;
				}
			}
		}
		
		var CLIENT_TIMEOUT_ABORT = 1;
		var SERVER_ABORT = 2;

		function getDoc(frame) {
			var doc = frame.contentWindow ? frame.contentWindow.document : frame.contentDocument ? frame.contentDocument : frame.document;
			return doc;
		}
		
		// take a breath so that pending repaints get some cpu time before the upload starts
		function doSubmit() {
			// make sure form attrs are set
			var t = $form.attr('target'), a = $form.attr('action');

			// update form attrs in IE friendly way
			form.setAttribute('target',id);
			if (!method) {
				form.setAttribute('method', 'POST');
			}
			if (a != s.url) {
				form.setAttribute('action', s.url);
			}

			// ie borks in some cases when setting encoding
			if (! s.skipEncodingOverride && (!method || /post/i.test(method))) {
				$form.attr({
					encoding: 'multipart/form-data',
					enctype:  'multipart/form-data'
				});
			}

			// support timout
			if (s.timeout) {
				timeoutHandle = setTimeout(function() { timedOut = true; cb(CLIENT_TIMEOUT_ABORT); }, s.timeout);
			}
			
			// look for server aborts
			function checkState() {
				try {
					var state = getDoc(io).readyState;
					log('state = ' + state);
					if (state.toLowerCase() == 'uninitialized')
						setTimeout(checkState,50);
				}
				catch(e) {
					log('Server abort: ' , e, ' (', e.name, ')');
					cb(SERVER_ABORT);
					timeoutHandle && clearTimeout(timeoutHandle);
					timeoutHandle = undefined;
				}
			}

			// add "extra" data to form if provided in options
			var extraInputs = [];
			try {
				if (s.extraData) {
					for (var n in s.extraData) {
						extraInputs.push(
							$('<input type="hidden" name="'+n+'" />').attr('value',s.extraData[n])
								.appendTo(form)[0]);
					}
				}

				if (!s.iframeTarget) {
					// add iframe to doc and submit the form
					$io.appendTo('body');
	                io.attachEvent ? io.attachEvent('onload', cb) : io.addEventListener('load', cb, false);
				}
				setTimeout(checkState,15);
				form.submit();
			}
			finally {
				// reset attrs and remove "extra" input elements
				form.setAttribute('action',a);
				if(t) {
					form.setAttribute('target', t);
				} else {
					$form.removeAttr('target');
				}
				$(extraInputs).remove();
			}
		}
        /**
         * 强制同步，如果设置了该属性，在form提交时将立即进行文件上传，否则在提交表单后会延迟10毫秒再进行文件上传。<br/>
         * 在延迟的这一短暂时间里，浏览器有机会更新DOM结构，比如想要向用户展示"请稍后..."的提示。<br/>
         * 显示这些的提示是需要时间来更新DOM结构的。暂停这一会儿时间，再真正提交表单，可以增加易用性。<br/>
         * @blocked
         */
		if (s.forceSync) {
			doSubmit();
		}
		else {
			setTimeout(doSubmit, 10); // this lets dom updates render
		}

		var data, doc, domCheckCount = 50, callbackProcessed;

		function cb(e) {
			if (xhr.aborted || callbackProcessed) {
				return;
			}
			try {
				doc = getDoc(io);
			}
			catch(ex) {
				log('cannot access response document: ', ex);
				e = SERVER_ABORT;
			}
			if (e === CLIENT_TIMEOUT_ABORT && xhr) {
				xhr.abort('timeout');
				return;
			}
			else if (e == SERVER_ABORT && xhr) {
				xhr.abort('server abort');
				return;
			}

			if (!doc || doc.location.href == s.iframeSrc) {
				// response not received yet
				if (!timedOut)
					return;
			}
            io.detachEvent ? io.detachEvent('onload', cb) : io.removeEventListener('load', cb, false);

			var status = 'success', errMsg;
			try {
				if (timedOut) {
					throw 'timeout';
				}

				var isXml = s.dataType == 'xml' || doc.XMLDocument || $.isXMLDoc(doc);
				log('isXml='+isXml);
				if (!isXml && window.opera && (doc.body == null || doc.body.innerHTML == '')) {
					if (--domCheckCount) {
						// in some browsers (Opera) the iframe DOM is not always traversable when
						// the onload callback fires, so we loop a bit to accommodate
						log('requeing onLoad callback, DOM not available');
						setTimeout(cb, 250);
						return;
					}
					// let this fall through because server response could be an empty document
					//log('Could not access iframe DOM after mutiple tries.');
					//throw 'DOMException: not available';
				}

				//log('response detected');
                var docRoot = doc.body ? doc.body : doc.documentElement;
                xhr.responseText = docRoot ? docRoot.innerHTML : null;
				xhr.responseXML = doc.XMLDocument ? doc.XMLDocument : doc;
				if (isXml)
					s.dataType = 'xml';
				xhr.getResponseHeader = function(header){
					var headers = {'content-type': s.dataType};
					return headers[header];
				};
                // support for XHR 'status' & 'statusText' emulation :
                if (docRoot) {
                    xhr.status = Number( docRoot.getAttribute('status') ) || xhr.status;
                    xhr.statusText = docRoot.getAttribute('statusText') || xhr.statusText;
                }

				var dt = s.dataType || '';
				var scr = /(json|script|text)/.test(dt.toLowerCase());
				if (scr || s.textarea) {
					// see if user embedded response in textarea
					var ta = doc.getElementsByTagName('textarea')[0];
					if (ta) {
						xhr.responseText = ta.value;
                        // support for XHR 'status' & 'statusText' emulation :
                        xhr.status = Number( ta.getAttribute('status') ) || xhr.status;
                        xhr.statusText = ta.getAttribute('statusText') || xhr.statusText;
					}
					else if (scr) {
						// account for browsers injecting pre around json response
						var pre = doc.getElementsByTagName('pre')[0];
						var b = doc.getElementsByTagName('body')[0];
						if (pre) {
							xhr.responseText = pre.textContent ? pre.textContent : pre.innerHTML;
						}
						else if (b) {
							xhr.responseText = b.innerHTML;
						}
					}
				}
				else if (s.dataType == 'xml' && !xhr.responseXML && xhr.responseText != null) {
					xhr.responseXML = toXml(xhr.responseText);
				}

                try {
                    data = httpData(xhr, s.dataType, s);
                }
                catch (e) {
                    status = 'parsererror';
                    xhr.error = errMsg = (e || status);
                }
			}
			catch (e) {
				log('error caught: ',e);
				status = 'error';
                xhr.error = errMsg = (e || status);
			}

			if (xhr.aborted) {
				log('upload aborted');
				status = null;
			}

            if (xhr.status) { // we've set xhr.status
                status = (xhr.status >= 200 && xhr.status < 300 || xhr.status === 304) ? 'success' : 'error';
            }

			// ordering of these callbacks/triggers is odd, but that's how $.ajax does it
			if (status === 'success') {
				s.success && s.success.call(s.context, data, 'success', xhr);
				g && $.event.trigger("ajaxSuccess", [xhr, s]);
			}
            else if (status) {
				if (errMsg == undefined)
					errMsg = xhr.statusText;
				s.error && s.error.call(s.context, xhr, status, errMsg);
				g && $.event.trigger("ajaxError", [xhr, s, errMsg]);
            }

			g && $.event.trigger("ajaxComplete", [xhr, s]);

			if (g && ! --$.active) {
				$.event.trigger("ajaxStop");
			}

			s.complete && s.complete.call(s.context, xhr, status);

			callbackProcessed = true;
			if (s.timeout)
				clearTimeout(timeoutHandle);

			// clean up
			setTimeout(function() {
				if (!s.iframeTarget)
					$io.remove();
				xhr.responseXML = null;
			}, 100);
		}

		var toXml = $.parseXML || function(s, doc) { // use parseXML if available (jQuery 1.5+)
			if (window.ActiveXObject) {
				doc = new ActiveXObject('Microsoft.XMLDOM');
				doc.async = 'false';
				doc.loadXML(s);
			}
			else {
				doc = (new DOMParser()).parseFromString(s, 'text/xml');
			}
			return (doc && doc.documentElement && doc.documentElement.nodeName != 'parsererror') ? doc : null;
		};
		var parseJSON = $.parseJSON || function(s) {
			return window['eval']('(' + s + ')');
		};

		var httpData = function( xhr, type, s ) { // mostly lifted from jq1.4.4

			var ct = xhr.getResponseHeader('content-type') || '',
				xml = type === 'xml' || !type && ct.indexOf('xml') >= 0,
				data = xml ? xhr.responseXML : xhr.responseText;

			if (xml && data.documentElement.nodeName === 'parsererror') {
				$.error && $.error('parsererror');
			}
			if (s && s.dataFilter) {
				data = s.dataFilter(data, type);
			}
			if (typeof data === 'string') {
				if (type === 'json' || !type && ct.indexOf('json') >= 0) {
					data = parseJSON(data);
				} else if (type === "script" || !type && ct.indexOf("javascript") >= 0) {
					$.globalEval(data);
				}
			}
			return data;
		};
	}
};

/**
 * ajaxForm() provides a mechanism for fully automating form submission.
 *
 * The advantages of using this method instead of omAjaxSubmit() are:
 *
 * 1: This method will include coordinates for <input type="image" /> elements (if the element
 *	is used to submit the form).
 * 2. This method will include the submit element's name/value data (for the element that was
 *	used to submit the form).
 * 3. This method binds the submit() method to the form for you.
 *
 * The options argument for ajaxForm works exactly as it does for omAjaxSubmit.  ajaxForm merely
 * passes the options argument along after properly binding events for submit elements and
 * the form itself.
 */
$.fn.ajaxForm = function(options) {
	// in jQuery 1.3+ we can fix mistakes with the ready state
	if (this.length === 0) {
		var o = { s: this.selector, c: this.context };
		if (!$.isReady && o.s) {
			log('DOM not ready, queuing ajaxForm');
			$(function() {
				$(o.s,o.c).ajaxForm(options);
			});
			return this;
		}
		// is your DOM ready?  http://docs.jquery.com/Tutorials:Introducing_$(document).ready()
		log('terminating; zero elements found by selector' + ($.isReady ? '' : ' (DOM not ready)'));
		return this;
	}

	return this.ajaxFormUnbind().bind('submit.form-plugin', function(e) {
		if (!e.isDefaultPrevented()) { // if event has been canceled, don't proceed
			e.preventDefault();
			$(this).omAjaxSubmit(options);
		}
	}).bind('click.form-plugin', function(e) {
		var target = e.target;
		var $el = $(target);
		if (!($el.is(":submit,input:image"))) {
			// is this a child element of the submit el?  (ex: a span within a button)
			var t = $el.closest(':submit');
			if (t.length == 0) {
				return;
			}
			target = t[0];
		}
		var form = this;
		form.clk = target;
		if (target.type == 'image') {
			if (e.offsetX != undefined) {
				form.clk_x = e.offsetX;
				form.clk_y = e.offsetY;
			} else if (typeof $.fn.offset == 'function') { // try to use dimensions plugin
				var offset = $el.offset();
				form.clk_x = e.pageX - offset.left;
				form.clk_y = e.pageY - offset.top;
			} else {
				form.clk_x = e.pageX - target.offsetLeft;
				form.clk_y = e.pageY - target.offsetTop;
			}
		}
		// clear form vars
		setTimeout(function() { form.clk = form.clk_x = form.clk_y = null; }, 100);
	});
};

// ajaxFormUnbind unbinds the event handlers that were bound by ajaxForm
$.fn.ajaxFormUnbind = function() {
	return this.unbind('submit.form-plugin click.form-plugin');
};

/**
 * formToArray() gathers form element data into an array of objects that can
 * be passed to any of the following ajax functions: $.get, $.post, or load.
 * Each object in the array has both a 'name' and 'value' property.  An example of
 * an array for a simple login form might be:
 *
 * [ { name: 'username', value: 'jresig' }, { name: 'password', value: 'secret' } ]
 *
 * It is this array that is passed to pre-submit callback functions provided to the
 * omAjaxSubmit() and ajaxForm() methods.
 */
$.fn.formToArray = function(semantic) {
	var a = [];
	if (this.length === 0) {
		return a;
	}

	var form = this[0];
	var els = semantic ? form.getElementsByTagName('*') : form.elements;
	if (!els) {
		return a;
	}

	var i,j,n,v,el,max,jmax;
	for(i=0, max=els.length; i < max; i++) {
		el = els[i];
		n = el.name;
		if (!n) {
			continue;
		}

		if (semantic && form.clk && el.type == "image") {
			// handle image inputs on the fly when semantic == true
			if(!el.disabled && form.clk == el) {
				a.push({name: n, value: $(el).val()});
				a.push({name: n+'.x', value: form.clk_x}, {name: n+'.y', value: form.clk_y});
			}
			continue;
		}

		v = $.fieldValue(el, true);
		if (v && v.constructor == Array) {
			for(j=0, jmax=v.length; j < jmax; j++) {
				a.push({name: n, value: v[j]});
			}
		}
		else if (v !== null && typeof v != 'undefined') {
			a.push({name: n, value: v});
		}
	}

	if (!semantic && form.clk) {
		// input type=='image' are not found in elements array! handle it here
		var $input = $(form.clk), input = $input[0];
		n = input.name;
		if (n && !input.disabled && input.type == 'image') {
			a.push({name: n, value: $input.val()});
			a.push({name: n+'.x', value: form.clk_x}, {name: n+'.y', value: form.clk_y});
		}
	}
	return a;
};

/**
 * Serializes form data into a 'submittable' string. This method will return a string
 * in the format: name1=value1&amp;name2=value2
 */
$.fn.formSerialize = function(semantic) {
	//hand off to jQuery.param for proper encoding
	return $.param(this.formToArray(semantic));
};

/**
 * Serializes all field elements in the jQuery object into a query string.
 * This method will return a string in the format: name1=value1&amp;name2=value2
 */
$.fn.fieldSerialize = function(successful) {
	var a = [];
	this.each(function() {
		var n = this.name;
		if (!n) {
			return;
		}
		var v = $.fieldValue(this, successful);
		if (v && v.constructor == Array) {
			for (var i=0,max=v.length; i < max; i++) {
				a.push({name: n, value: v[i]});
			}
		}
		else if (v !== null && typeof v != 'undefined') {
			a.push({name: this.name, value: v});
		}
	});
	//hand off to jQuery.param for proper encoding
	return $.param(a);
};

/**
 * Returns the value(s) of the element in the matched set.  For example, consider the following form:
 *
 *  <form><fieldset>
 *	  <input name="A" type="text" />
 *	  <input name="A" type="text" />
 *	  <input name="B" type="checkbox" value="B1" />
 *	  <input name="B" type="checkbox" value="B2"/>
 *	  <input name="C" type="radio" value="C1" />
 *	  <input name="C" type="radio" value="C2" />
 *  </fieldset></form>
 *
 *  var v = $(':text').fieldValue();
 *  // if no values are entered into the text inputs
 *  v == ['','']
 *  // if values entered into the text inputs are 'foo' and 'bar'
 *  v == ['foo','bar']
 *
 *  var v = $(':checkbox').fieldValue();
 *  // if neither checkbox is checked
 *  v === undefined
 *  // if both checkboxes are checked
 *  v == ['B1', 'B2']
 *
 *  var v = $(':radio').fieldValue();
 *  // if neither radio is checked
 *  v === undefined
 *  // if first radio is checked
 *  v == ['C1']
 *
 * The successful argument controls whether or not the field element must be 'successful'
 * (per http://www.w3.org/TR/html4/interact/forms.html#successful-controls).
 * The default value of the successful argument is true.  If this value is false the value(s)
 * for each element is returned.
 *
 * Note: This method *always* returns an array.  If no valid value can be determined the
 *	   array will be empty, otherwise it will contain one or more values.
 */
$.fn.fieldValue = function(successful) {
	for (var val=[], i=0, max=this.length; i < max; i++) {
		var el = this[i];
		var v = $.fieldValue(el, successful);
		if (v === null || typeof v == 'undefined' || (v.constructor == Array && !v.length)) {
			continue;
		}
		v.constructor == Array ? $.merge(val, v) : val.push(v);
	}
	return val;
};

/**
 * Returns the value of the field element.
 */
$.fieldValue = function(el, successful) {
	var n = el.name, t = el.type, tag = el.tagName.toLowerCase();
	if (successful === undefined) {
		successful = true;
	}

	if (successful && (!n || el.disabled || t == 'reset' || t == 'button' ||
		(t == 'checkbox' || t == 'radio') && !el.checked ||
		(t == 'submit' || t == 'image') && el.form && el.form.clk != el ||
		tag == 'select' && el.selectedIndex == -1)) {
			return null;
	}

	if (tag == 'select') {
		var index = el.selectedIndex;
		if (index < 0) {
			return null;
		}
		var a = [], ops = el.options;
		var one = (t == 'select-one');
		var max = (one ? index+1 : ops.length);
		for(var i=(one ? index : 0); i < max; i++) {
			var op = ops[i];
			if (op.selected) {
				var v = op.value;
				if (!v) { // extra pain for IE...
					v = (op.attributes && op.attributes['value'] && !(op.attributes['value'].specified)) ? op.text : op.value;
				}
				if (one) {
					return v;
				}
				a.push(v);
			}
		}
		return a;
	}
	return $(el).val();
};

/**
 * Clears the form data.  Takes the following actions on the form's input fields:
 *  - input text fields will have their 'value' property set to the empty string
 *  - select elements will have their 'selectedIndex' property set to -1
 *  - checkbox and radio inputs will have their 'checked' property set to false
 *  - inputs of type submit, button, reset, and hidden will *not* be effected
 *  - button elements will *not* be effected
 */
$.fn.clearForm = function() {
	return this.each(function() {
		$('input,select,textarea', this).clearFields();
	});
};

/**
 * Clears the selected form elements.
 */
$.fn.clearFields = $.fn.clearInputs = function() {
	var re = /^(?:color|date|datetime|email|month|number|password|range|search|tel|text|time|url|week)$/i; // 'hidden' is not in this list
	return this.each(function() {
		var t = this.type, tag = this.tagName.toLowerCase();
		if (re.test(t) || tag == 'textarea') {
			this.value = '';
		}
		else if (t == 'checkbox' || t == 'radio') {
			this.checked = false;
		}
		else if (tag == 'select') {
			this.selectedIndex = -1;
		}
	});
};

/**
 * Resets the form data.  Causes all form elements to be reset to their original value.
 */
$.fn.resetForm = function() {
	return this.each(function() {
		// guard against an input with the name of 'reset'
		// note that IE reports the reset function as an 'object'
		if (typeof this.reset == 'function' || (typeof this.reset == 'object' && !this.reset.nodeType)) {
			this.reset();
		}
	});
};

/**
 * Enables or disables any matching elements.
 */
$.fn.enable = function(b) {
	if (b === undefined) {
		b = true;
	}
	return this.each(function() {
		this.disabled = !b;
	});
};

/**
 * Checks/unchecks any matching checkboxes or radio buttons and
 * selects/deselects and matching option elements.
 */
$.fn.selected = function(select) {
	if (select === undefined) {
		select = true;
	}
	return this.each(function() {
		var t = this.type;
		if (t == 'checkbox' || t == 'radio') {
			this.checked = select;
		}
		else if (this.tagName.toLowerCase() == 'option') {
			var $sel = $(this).parent('select');
			if (select && $sel[0] && $sel[0].type == 'select-one') {
				// deselect all other options
				$sel.find('option').selected(false);
			}
			this.selected = select;
		}
	});
};

// helper fn for console logging
function log() {
	var msg = '[jquery.form] ' + Array.prototype.join.call(arguments,'');
	if (window.console && window.console.log) {
		window.console.log(msg);
	}
	else if (window.opera && window.opera.postError) {
		window.opera.postError(msg);
	}
};

})(jQuery);/*
 * $Id: om-button.js,v 1.40 2012/01/16 01:48:41 linxiaomin Exp $
 * operamasks-ui omButton 1.0
 *
 * Copyright 2011, AUTHORS.txt (http://ui.operamasks.org/about)
 * Dual licensed under the MIT or GPL Version 2 licenses.
 * http://ui.operamasks.org/license
 *
 * http://ui.operamasks.org/docs/
 *
 * Depends:
 *  jquery.ui.core.js
 *  jquery.ui.widget.js
 */
;(function($) {
	/**
     * @name omButton
     * @class 按钮组件。类似于html中的button、input[type=submit]、input[type=button]，使用背景图片实现圆角，支持icon，可以只显示icon。<br/><br/>
     * <b>特点：</b><br/>
     * <ol>
     *      <li>实现圆角</li>
     *      <li>支持左icon和右icon，可同时出现左右icon，也可以只显示icon不显示label</li>
     *      <li>按钮文字数目不限，也可以任意设置按钮宽度</li>
     *      <li>支持input[type=button]、input[type=submit]、input[type=reset]、button、a五种标签形式</li>
     * </ol>
     * 
     * <b>示例：</b><br/>
     * <pre>
     * &lt;script type="text/javascript" &gt;
     * $(document).ready(function() {
     *     $('#bnt').omButton({
     *         icons : {left:'images/help.png',right:'images/edit_add.png'},
     *         width : 150,
     *         disabled : 'disabled',
     *         onClick : function(event){
     *             // do something
     *         }
     *     });
     * });
     * &lt;/script&gt;
     * 
     * &lt;input id="btn" type="submit" /&gt;
     * </pre>
     * 
     * @constructor
     * @description 构造函数. 
     * @param p 标准config对象：{}
     */
    $.widget('om.omButton', {
    	
        options: /**@lends omButton# */{
        	/**
        	 * 是否禁用组件。可通过('#id').attr('disabled')判断按钮是否禁用。
             * @type String 
             * @default null 
             * @example
             * $("#button").omButton({disabled: true}); 
             */
            disabled : null ,
            /**
             * 显示文本。label值可以写到dom元素里面，也可以设置在属性里面，设置到属性里面的优先级最高。
             * @type String 
             * @default ""
             * @example
             * $("#button").omButton({label: "apusic"});
             */
            label : null ,
            /**
        	 * 显示按钮图标，left表示左图标，right表示右图标，取值均为图片路径。
             * @type Object 
             * @default null 
             * @example
             * $("#button").omButton({
             *     icons: {
             *         left: 'images/help.png',
             *         right: 'images/edit_add.png'
             *     }
             * });
             */
            icons: {
    			left: null,
    			right: null
    		},
    		/**
        	 * 按钮宽度，设置固定宽度之后按钮将不会随文字的多少而改变。
             * @type Number 
             * @default null 
             * @example
             * width : 150
             */
            width : null ,
            /**
        	 * 点击按钮时触发的事件。
             * @event
             * @name omButton#onClick 
             * @example
             * onClick : function(){
             *    //do something
             * }
             */
            onClick : null
        },
        _create:function(){
            var self = this,
                options = this.options;
            if ( typeof options.disabled != "boolean" ) {
                options.disabled = this.element.propAttr( "disabled" );
    		}
            this._determineButtonType();
            if ( this.buttonElement.attr('disabled') == 'disabled' || options.disabled == 'disabled') {
    			options.disabled = true;
    		}
            this._initButton();
            if(options.disabled){
            	self._addClass('disabled');
            	this.buttonElement.css('cursor','default');
            }
            var newButtonElement = this.buttonElement.parent().parent();
            newButtonElement.bind( 'mouseenter.button',function( event ){
            					if ( options.disabled ) {
            						return false;
            					}
            					self._addClass('hover');
            				}).bind( "mouseleave.button", function( event ) {
            					if ( options.disabled ) {
            						return false;
            					}
            					self._removeClass('hover');
            					self._removeClass('active');
            				}).bind( "click.button", function( event ){
            					if ( options.disabled ) {
            						event.preventDefault();
            						event.stopImmediatePropagation();
            						return false;
            					}else if(self.options.onClick){
            					    self.options.onClick();
            					}
            				}).bind( "mousedown.button", function( event ) {
            					if ( options.disabled ) {
            						return false;
            					}
            					self._addClass('active');
            				    self._removeClass('focus');
            					var onClick = options.onClick;
        		                if ( onClick && onClick( event ) === false ) {
        		                    return;
        		                }
            				})
            				.bind( "mouseup.button", function( event ) {
            					if ( options.disabled ) {
            						return false;
            					}
            					self._addClass('focus');
            					self._removeClass('active');
            				})
            				.bind( "keydown.button", function(event) {
            					if ( options.disabled ) {
            						return false;
            					}
            					if ( event.keyCode == $.ui.keyCode.SPACE || event.keyCode == $.ui.keyCode.ENTER ) {
            						self._addClass('active');
            					}
            					if( event.keyCode == $.ui.keyCode.SPACE){
            						var onClick = options.onClick;
            		                if ( onClick && onClick( event ) === false ) {
            		                    return;
            		                }
            					}
            				})
            				.bind( "keyup.button", function() {
            					self._removeClass('active');
            				});
	            this.element.bind( "focus", function( event ) {
								if ( options.disabled ) {
									return false;
								}
								self._addClass('focus');
							}).bind( "blur", function( event ) {
	        					if ( options.disabled ) {
	        						return false;
	        					}
	        					self._removeClass('focus');
	        				});
        },
        /**
         * 启用组件。
         * @name omButton#enable
         * @function
         * @example
         * $('#btn').omButton('enable');
         */
        enable : function(){
            this._removeClass('disabled');
            this.options.disabled = false;
            this.buttonElement.css('cursor','pointer');
            return this.element.removeAttr('disabled');
        },
        /**
         * 禁用组件。
         * @name omButton#disable
         * @function
         * @example
         * $('#btn').omButton('disable');
         */
        disable : function(){
        	this._addClass('disabled');
            this.options.disabled = true;
            this.buttonElement.css('cursor','default');
            return this.element.attr('disabled', 'disabled');
        },
        /**
         * 触发点击事件。
         * @name omButton#click
         * @function
         * @example
         * $('#btn').omButton('click');
         */
        click : function(){
        	if(!this.options.disabled && this.options.onClick){
        	    this.options.onClick();
            }
        },
        /**
         * 改变按钮的label属性。
         * @name omButton#changeLabel
         * @function
         * @param label 按钮文本
         * @example
         * $('#btn').omButton('changeLabel','按钮label');
         */
        changeLabel : function(label){
            if(this.type == 'a'){
            	this.buttonElement.text(label) ;
            }else if( this.type == 'input' ){
            	this.buttonElement.val(label) ;
            }else if ( this.type == 'button' ){
            	this.buttonElement.html(label) ;
            }
        },
        /**
         * 改变按钮的icon属性。
         * @name omButton#changeIcons
         * @function
         * @param icons 图标路径
         * @example
         * $('#btn').omButton('changeIcons',{
         *     left: 'images/help.png',
         *     right: 'images/edit_add.png'
         * });
         */
        changeIcons : function( icons ){
        	if( !this.options.disabled ){
	            if( icons ){
	            	icons.left?this.buttonElement.css( 'backgroundImage','url( '+icons.left+' )' ):null;
	            	icons.right?this.buttonElement.next().attr( 'src',icons.right ):null;
	            }
            }
        },
        _addClass : function( state ){
        	this.buttonElement.parent().parent().addClass( 'om-state-'+state );
        },
        _removeClass : function( state ){
        	this.buttonElement.parent().parent().removeClass( 'om-state-'+state );
        },
        _initButton : function(){
        	var options = this.options;
        	var label = this._getLabel();
        	var wrapperSpan = $( '<span>' ).addClass( 'om-btn om-state-default').css('border','none'),
        	    leftSpan = $( '<span>' ).addClass( 'om-btn-bg om-btn-left' ),
        	    centerSpan = $( '<span>' ).addClass( 'om-btn-bg om-btn-center' ),
        	    rightSpan = $( '<span>' ).addClass( 'om-btn-bg om-btn-right' );
        	if( options.width > 10 ){
        		centerSpan.css( 'width',parseInt( options.width )-10 );
        	}
        	var buttonElement = this.buttonElement.addClass( 'om-btn-txt' );
        	if( this.type == 'a' || this.type == 'button' ){
        	    buttonElement.html( label );
        	}else{
        	    buttonElement.val( label );
        	}
        	if( options.icons.left ){
        	    if( label ){
        	        buttonElement.addClass( 'om-btn-icon' ).css( 'background-image','url('+options.icons.left+')' );
        	    }else{
        	        buttonElement.addClass( 'om-btn-only-icon' ).css('background-image','url('+options.icons.left+')' );
        	    }
        	}
        	buttonElement.css( {'background-position':'left center','background-repeat':'no-repeat'} );
        	buttonElement.wrap( wrapperSpan );
        	leftSpan.insertBefore( buttonElement );
        	rightSpan.insertAfter( buttonElement );
        	buttonElement.wrap( centerSpan );
        	if( options.icons.right ){
        	    if( label != '' ){
        	        $( '<img>' ).attr( 'src',options.icons.right ).css( {'vertical-align':'text-top','padding-left':'3px'} ).insertAfter( buttonElement );
        	    }else{
        	        $( '<img>' ).attr( 'src',options.icons.right ).css( 'vertical-align','text-top' ).insertAfter( buttonElement );
        	    }
            }
        },
        _getLabel : function(){
        	return this.options.label || this.buttonElement.html() || this.buttonElement.text() || this.buttonElement.val();
        },
        _determineButtonType: function() {
    		if ( this.element.is("input") ) {
    			this.type = "input";
    		}  else if ( this.element.is("a") ) {
    			this.type = "a";
    		} else if ( this.element.is('button') ){
    			this.type = "button";
    		}
    		this.buttonElement = this.element;
    	}
    });
})(jQuery);/*
 * $Id: om-calendar.js,v 1.79 2012/01/16 01:48:41 linxiaomin Exp $
 * operamasks-ui omCalendar 1.0
 *
 * Copyright 2011, AUTHORS.txt (http://ui.operamasks.org/about)
 * Dual licensed under the MIT or GPL Version 2 licenses.
 * http://ui.operamasks.org/license
 *
 * http://ui.operamasks.org/docs/
 */
/**
 * @name omCalendar
 * @param p 标准config对象 {minDate : new Date(2011, 7, 5), maxDate : new Date(2011, 7, 15)}
 * @class 日历控件。默认通过绑定一个输入域来触发展示，同时也可以直接显示在页面上。<br /> 
 * 日历控件提供了一系列配置项参数和常用的组件api，尽量考虑到各种不同的应用场景。请注意，此控件支持的年份从100到10000。<br /><br/>
 * <b>工具方法:</b>
 * <pre>$.omCalendar.formatDate(date, formatter)</pre>
 * <p>将传入的日期对象date按照formatter格式化成一个string并返回.</p>
 * <pre>$.omCalendar.parseDate(date_string, formatter)</pre>
 * <p>传入的string遵循formatter格式,此时提取日期信息,构建并返回日期对象.</p>
 * <p>两个方法都接收一个格式字符串参数formater，大概像这样："yy-m-d H:i"，<br />
 * 在该字符串中每个字母(如 yy , m 等等)都有严格的定义，如下所示：<br /></p>
 * <b>日期格式定义:</b>
 * <pre>
 * y:   年份(取后面2位字符),<br />
 * yy:  年份(用4位字符表示),<br />
 * m:   月份(数字表示,最少1个字符表示),<br />
 * mm:  月份(数字表示,最少2个字符表示,不足时在前面添加0),<br />
 * d:   日期(最少1个字符表示),<br />
 * dd:  日期(最少2个字符表示,不足时在前面添加0),<br />
 * h:   小时(12小时制,最少2个字符表示,不足时在前面添加0,取值范围00~11),<br />
 * H:   小时(24小时制,最少2个字符表示,不足时在前面添加0,取值范围00~23),<br />
 * g:   小时(12小时制,最少1个字符表示,取值范围0~11),<br />
 * G:   小时(24小时制,最少1个字符表示,取值范围0~23),<br />
 * i:   分钟(最少2个字符表示,取值范围00~59),<br />
 * s:   秒钟(最少2个字符表示,取值范围00~59),<br />
 * u:   毫秒(最少3个字符表示,取值范围000~999),<br />
 * D:   星期的简写(如 Sun, Sat等等),<br />
 * DD:  星期的全名(如 Sunday, Saturday等等),<br />
 * M:   月份的简写(如 Jan, Feb 等等),<br />
 * MM:  月份的全名(如 January, February等),<br />
 * a:   上午下午(小写 am & pm),<br />
 * A:   上午下午(大写 AM & PM),<br />
 * </pre>
 */
;(function($) {
	function Calendar(trigger, config) {
        this._init(trigger, config);
    }
	
	$.extend(Calendar.prototype, {

        _init: function(selector, config) {
            var self = this,con = selector;
            self.id = self.C_Id = self._stamp(con);
            self._buildParam(config);

            /*
             self.con  日历的容器
             self.id   传进来的id
             self.C_Id 永远代表日历容器的ID
             */
            if (!self.popup) {
                self.con = con;
            } else {
                self.trigger = con;
                //self.trigger仍然指向input,con却成了input的父节点span
                con = $('<span></span>').insertAfter(selector).wrapInner(selector);
                selector.after('<span class="om-calendar-trigger"></span>');
                self.con = $('<div></div>');
                $('body').append(self.con);
				self.C_Id = self._stamp(self.con);
                self.con.css({
                    'top':'0px',
                    'position':'absolute',
                    'background':'white',
                    'visibility':'hidden',
                    'z-index':'10000'
                });
                con.addClass("om-calendar om-widget om-state-default");
                
                var defaultVal = self.trigger.val();
                if ($.trim(defaultVal) !='') {
                    try {
                        var inputDate = $.omCalendar.parseDate(defaultVal, self.dateFormat);
                        inputDate && (self.date = inputDate);
                    } catch (e) {
                    }
                }
            }

            self.render();
            self._buildEvent();
            //只有当日历控件带有input时才可以禁用或者不可编辑
            if (self.popup) {
                if (self.readOnly || !self.editable) {
                    self.trigger.attr('readonly', 'readOnly').unbind();
                }
                if (self.disabled) {
                    self.trigger.attr("disabled", true);
                    self.trigger.next().addClass('om-state-disabled').unbind();
                }
            }
            return this;
        },

        render: function(o) {
            var self = this,
                i = 0,
                _prev,_next,_oym;

            o = o || {};
            self._parseParam(o);
            self.ca = [];

            self.con.addClass('om-calendar-list-wrapper om-widget om-clearfix multi-' + self.pages + ' om-widget-content');
            self.con.html('');

            for (i = 0,_oym = [self.year,self.month]; i < self.pages; i++) {
                if (i === 0) {
                    _prev = true;
                } else {
                    _prev = false;
                    _oym = self._computeNextMonth(_oym);
                }
                _next = i == (self.pages - 1);
                self.ca.push(new self.Page({
                    year:_oym[0],
                    month:_oym[1],
                    prevArrow:_prev,
                    nextArrow:_next,
                    showTime:self.showTime
                }, self));


                self.ca[i].render();
            }
            if(self.pages>1){
            	var calbox = self.con.find(".om-cal-box");
            	var array = [];
            	$.each(calbox, function(i,n){
            		array.push($(n).css("height"));
            	});
            	array.sort();
            	
            	calbox.css("height",array[array.length-1]);
            }
            return this;

        },

		/**
		 * 用以给容器打上id的标记,容器有id则返回
		 * @method _stamp
		 * @param { JQuery-Node }
		 * @return { string }
		 * @private
		 */
		_stamp: function(el){
			if(el.attr('id') === undefined || el.attr('id')===''){
				el.attr('id','K_'+ new Date().getTime());
			}
			return el.attr('id');
		},

        /**
         * 计算d天的前几天或者后几天，返回date
		 * @method _showdate
		 * @private
         */
        _showdate: function(n, d) {
            var uom = new Date(d - 0 + n * 86400000);
            uom = uom.getFullYear() + "/" + (uom.getMonth() + 1) + "/" + uom.getDate();
            return new Date(uom);
        },

        /**
         * 创建日历外框的事件
		 * @method _buildEvent
		 * @private
         */
        _buildEvent: function(refreshOnly) {
            var self = this;
            if (!self.popup){
				return this;
			}
            //点击空白
            //flush event
            for (var i = 1; i < self.EV.length; i++) {
                self.EV[i] && self.EV[i].unbind(".omCalendar");
            }
            if (!refreshOnly) {
                self.EV[0] && self.EV[0].unbind(".omCalendar");
                self.EV[0] = $('body').bind('mousedown.omCalendar', function(e) {
                    var source = $(e.target);
                    //点击到日历上
                    if (source.attr('id') === self.C_Id){
                        return;
                    }
                    if ((source.hasClass('om-next') || source.hasClass('om-prev')) && 
                        source[0].nodeName.toLowerCase() === 'a'){
                        return;
                    }
                    //点击到月选择器上
                    if ($.contains(self.con[0], source[0]) &&
                            (source[0].nodeName.toLowerCase() === 'option' ||
                                    source[0].nodeName.toLowerCase() === 'select')) {
                            return;
                    } 
                    
                    //点击在trigger上
                    if (source.attr('id') == self.id || source.siblings().attr('id') == self.id){
                        return;
                    }

                    if(self.con.css('visibility') == 'hidden') return ;
                    var inRegion = function(dot,r){
                        if(dot[0]> r[0].x && dot[0]<r[1].x && dot[1] > r[0].y && dot[1] < r[1].y){
                            return true;
                        }else{
                            return false;
                        }
                    };

                    if(!inRegion([e.pageX,e.pageY],[
                                    {
                                        x:self.con.offset().left,
                                        y:self.con.offset().top
                                    },
                                    {
                                        x:self.con.offset().left + self.con.width(),
                                        y:self.con.offset().top + self.con.height()
                                    }])){
                        self.hide();
                    }
                });
            }
            
           
            //点击触点
            var inputTrigger = self.trigger || self.con || $("#" + self.id);
            self.EV[1] = inputTrigger.bind("click.omCalendar", function(e) {
                e.preventDefault();
                self.toggle();
            }).bind('focus.omCalendar', function(){
                $(this).parent().addClass('om-state-hover om-state-active');
            }).bind('blur.omCalendar', function(){
                $(this).parent().removeClass('om-state-hover om-state-active');
            });
            
            var iconTrigger = inputTrigger.next();
            self.EV[2] = iconTrigger.bind('click.omCalendar', function(){
                inputTrigger.trigger('focus');
                self.show();
            }).bind('mouseover.omCalendar', function(){
                $(this).parent().addClass('om-state-hover');
            }).bind('mouseout.omCalendar', function(){
                !self.isVisible() && $(this).parent().removeClass('om-state-hover');
            });
            return this;
        },

		/**
		 * 改变日历是否显示的状态
		 * @mathod toggle
		 */
        toggle: function() {
            var self = this;
            if (!self.isVisible()) {
                self.show();
            } else {
                self.hide();
            }
        },
        
        isVisible : function() {
            var self = this;
            if (self.con.css('visibility') == 'hidden') {
                return false;
            } 
            return true;
        },

        /**
         * 显示日历
		 * @method show
         */
        show: function() {
            var self = this;
            self.con.css('visibility', '');
            var _x = self.trigger.parent().offset().left,
                //KISSY得到DOM的width是innerWidth，这里期望得到outterWidth
                height = self.trigger.parent().offsetHeight || self.trigger.parent().outerHeight(),
                _y = self.trigger.parent().offset().top + height;
            self.con.css('left', _x.toString() + 'px');
            self.con.css('top', _y.toString() + 'px');
            return this;
        },

        /**
         * 隐藏日历
		 * @method hide
         */
        hide: function() {
            var self = this;
            self.con.css('visibility', 'hidden');
            $('.om-trigger-press').removeClass('om-trigger-press');
            return this;
        },

        /**
         * 创建参数列表
		 * @method _buildParam
		 * @private
         */
        _buildParam: function(o) {
            var self = this;
            if (o === undefined || o === null) {
                o = { };
            }

            function setParam(def, key) {
                var v = o[key];
                // null在这里是“占位符”，用来清除参数的一个道具
                self[key] = (v === undefined || v === null) ? def : v;
            }

			//这种处理方式不错
            var defaults = {
                /**
                 * 默认显示日期。
                 * @name omCalendar#date
                 * @type Date
                 * @default 当前日期
                 * @example 
                 *   $("#input").omCalendar({date : new Date(2012, 0, 1)});
                 */
                date:        new Date(),
                
                /**
                 * 下拉框中第一列是星期几（默认起始星期是星期天）。值为0-6的数字，分别代表星期天到星期六。
                 * @name omCalendar#startDay
                 * @type Number
                 * @default 0
                 * @example
                 *   $("#input").omCalendar({startDay : 1});
                 */
                startDay:    0,
                
                /**
                 * 下拉框中一次显示几个月。默认只显示一个月。
                 * @name omCalendar#pages
                 * @type Number
                 * @default 1
                 * @example
                 *   $("#input").omCalendar({pages : 3});
                 */
                pages:       1,
                closable:    true,
                
                /**
                 * 最小日期。小于这个日期的日期将禁止选择。
                 * @name omCalendar#minDate
                 * @type Date
                 * @default 无
                 * @example
                 *   $("#input").omCalendar({minDate : new Date(2010, 0, 1)});
                 */
                minDate:  false,
                
                /**
                 * 最大日期。大于这个日期的日期将禁止选择。
                 * @name omCalendar#maxDate
                 * @type Date
                 * @default 无
                 * @example
                 *   $("#input").omCalendar({maxDate : new Date(2010, 0, 1)});
                 */
                maxDate:    false,
                multiSelect: false,
                navigator:   true,
                
                /**
                 * 是否带有input框。设成false时下拉框将不再需要通过输入框得到焦点来让它显示，而是下拉框直接显示在页面上。
                 * @name omCalendar#popup
                 * @type Boolean
                 * @default true
                 * @example
                 *   <div id="container" />
                 *   $("#container").omCalendar({popup : false});
                 */
                popup:       true,
                
                /**
                 * 是否显示时间。默认情况下只显示日期不显示时间。
                 * @name omCalendar#showTime
                 * @type Boolean
                 * @default false
                 * @example
                 *   $("#input").omCalendar({showTime : true});
                 */
                showTime:    false,
                
                /**
                 * 选择日期后触发。
                 * @event
                 * @name omCalendar#onSelect
                 * @type Function
                 * @default emptyFn
                 * @param date 选中的日期
                 * @example
                 *   $("#input").omCalendar({onSelect : function(date) {alert(date);}});
                 */
                onSelect:    function(date) {}, 
                
                /**
                 * 不可选的星期。数组类型，里面的元素为 0-6，分别代表星期天到星期六。
                 * @name omCalendar#disabledDays
                 * @type Array[Number]
                 * @default []
                 * @example
                 *   将星期六和星期天设为不可用:
                 *     $("#input").omCalendar({disabledDays : [0, 6]});
                 */
                disabledDays : [], 
                
                /**
                 * 设置过滤不可选日期方法。
                 * @name omCalendar#disabledFn
                 * @type Function
                 * @default 无
                 * @param 未经过滤的日期
                 * @example 
                 * 大于当月10号的日期不可用
                 * $("#input").omCalendar({
                 *     disabledFn : function disFn(date) {
                 *         var nowMiddle = new Date();
                 *         nowMiddle.setDate(10);
                 *         if (date > nowMiddle) {
                 *             return false;
                 *         }
                 *     }
                 * });
                 */
                disabledFn : function(d) {}, 
                
                /**
                 * 是否禁用组件。
                 * @name omCalendar#disabled
                 * @type Boolean
                 * @default false
                 * @example
                 * $("#input").omCalendar({disabled : false});
                 */
                disabled : false,
                
                /**
                 * 组件是否只读。
                 * @name omCalendar#readOnly
                 * @type Boolean
                 * @default false
                 * @example
                 * $("#input").omCalendar({readOnly : false});
                 */
                readOnly : false,
                
                /**
                 * 组件是否可编辑。如果设成false则只可以通过下拉框选择日期，而不能在输入框里直接输入日期。
                 * @name omCalendar#editable
                 * @type Boolean
                 * @default false
                 * @example
                 * $("#input").omCalendar({editable : true});
                 */
                editable : true,
                
                /**
                 * 日期格式化。具体的日期格式化参数请参考预览页签。如果设置showtime:false，默认取值为 'yy-mm-dd'，否则为 'yy-mm-dd H:i:s'。
                 * @name omCalendar#dateFormat
                 * @type String
                 * @default 'yy-mm-dd H:i:s'
                 * @example
                 * $("#input").omCalendar({dateFormat : 'yy-mm-dd'});
                 */
                dateFormat : false
            };
			
			for (var i in defaults) {
				setParam(defaults[i], i);
			}

            setParam(self.date, 'selected');
            if(o.startDay){
				self.startDay = (7 - o.startDay) % 7;
			}

            if (!self.dateFormat) {
                self.dateFormat = self.showTime ?  "yy-mm-dd H:i:s" : "yy-mm-dd"; 
            }
            
            self.EV = [];
            return this;
        },

        /**
         * 过滤参数列表
		 * @method _parseParam
		 * @private
         */
        _parseParam: function(o) {
            var self = this,i;
            if (o === undefined || o === null) {
                o = {};
            }
            for (i in o) {
                self[i] = o[i];
            }
            self._handleDate();
            return this;
        },

        /**
         * 模板函数
		 * @method _templetShow
		 * @private
         */
        _templetShow: function(templet, data) {
            var str_in,value_s,i,m,value,par;
            if (data instanceof Array) {
                str_in = '';
                for (i = 0; i < data.length; i++) {
                    str_in += arguments.callee(templet, data[i]);
                }
                templet = str_in;
            } else {
                value_s = templet.match(/{\$(.*?)}/g);
                if (data !== undefined && value_s !== null) {
                    for (i = 0,m = value_s.length; i < m; i++) {
                        par = value_s[i].replace(/({\$)|}/g, '');
                        value = (data[par] !== undefined) ? data[par] : '';
                        templet = templet.replace(value_s[i], value);
                    }
                }
            }
            return templet;
        },

        /**
         * 处理日期
		 * @method _handleDate
		 * @private
         */
        _handleDate: function() {
            var self = this,
            date = self.date;
            self.weekday = date.getDay() + 1;//星期几 //指定日期是星期几
            self.day = date.getDate();//几号
            self.month = date.getMonth();//月份
            self.year = date.getFullYear();//年份
            return this;
        },

        //get标题
        _getHeadStr: function(year, month) {
            return year.toString() + '年' + (Number(month) + 1).toString() + '月';
        },

        //月加
        _monthAdd: function() {
            var self = this;
            if (self.month == 11) {
                self.year++;
                self.month = 0;
            } else {
                self.month++;
            }
            self.date = new Date(self.year.toString() + '/' + (self.month + 1).toString() + '/' + self.day.toString());
            return this;
        },

        //月减
        _monthMinus: function() {
            var self = this;
            if (self.month === 0) {
                self.year--;
                self.month = 11;
            } else {
                self.month--;
            }
            self.date = new Date(self.year.toString() + '/' + (self.month + 1).toString() + '/' + self.day.toString());
            return this;
        },

        //裸算下一个月的年月,[2009,11],年:fullYear，月:从0开始计数
        _computeNextMonth: function(a) {
            var _year = a[0],
                _month = a[1];
            if (_month == 11) {
                _year++;
                _month = 0;
            } else {
                _month++;
            }
            return [_year,_month];
        },

        //处理日期的偏移量
        _handleOffset: function() {
            var self = this,
                data = ['日','一','二','三','四','五','六'],
                temp = '<span>{$day}</span>',
                offset = self.startDay,
                day_html = '',
                a = [];
            for (var i = 0; i < 7; i++) {
                a[i] = {
                    day:data[(i - offset + 7) % 7]
                };
            }
            day_html = self._templetShow(temp, a);

            return {
                day_html:day_html
            };
        }
    });
	
	$.extend(Calendar.prototype, {
		Page: function(config, father) {

            //属性
            this.father = father;
            this.month = Number(config.month);
            this.year = Number(config.year);
            this.prevArrow = config.prevArrow;
            this.nextArrow = config.nextArrow;
            this.node = null;
            this.timmer = null;//时间选择的实例
            this.id = '';
            this.EV = [];
            this.html = [
                '<div class="om-cal-box" id="{$id}">',
                '<div class="om-cal-hd om-widget-header">',
                '<a href="javascript:void(0);" class="om-prev {$prev}"><span class="om-icon om-icon-seek-prev">Prev</span></a>',
                '<a href="javascript:void(0);" class="om-title">{$title}</a>',
                '<a href="javascript:void(0);" class="om-next {$next}"><span class="om-icon om-icon-seek-next">Next</span></a>',
                '</div>',
                '<div class="om-cal-bd">',
                '<div class="om-whd">',
                /*
                 '<span>日</span>',
                 '<span>一</span>',
                 '<span>二</span>',
                 '<span>三</span>',
                 '<span>四</span>',
                 '<span>五</span>',
                 '<span>六</span>',
                 */
                father._handleOffset().day_html,
                '</div>',
                '<div class="om-dbd om-clearfix">',
                '{$ds}',
                /*
                 <a href="" class="om-null">1</a>
                 <a href="" class="om-state-disabled">3</a>
                 <a href="" class="om-selected">1</a>
                 <a href="" class="om-today">1</a>
                 <a href="">1</a>
                 */
                '</div>',
                '</div>',
                '<div class="om-setime om-state-default hidden">',
                '</div>',
                '<div class="om-cal-ft {$showtime}">',
                '<div class="om-cal-time om-state-default">',
                '时间：00:00 &hearts;',
                '</div>',
                '</div>',
                '<div class="om-selectime om-state-default hidden">',//<!--用以存放点选时间的一些关键值-->',
                '</div>',
                '</div><!--#om-cal-box-->'
            ].join("");
            this.nav_html = [
                '<p>',
                '月',
                '<select value="{$the_month}">',
                '<option class="m1" value="1">01</option>',
                '<option class="m2" value="2">02</option>',
                '<option class="m3" value="3">03</option>',
                '<option class="m4" value="4">04</option>',
                '<option class="m5" value="5">05</option>',
                '<option class="m6" value="6">06</option>',
                '<option class="m7" value="7">07</option>',
                '<option class="m8" value="8">08</option>',
                '<option class="m9" value="9">09</option>',
                '<option class="m10" value="10">10</option>',
                '<option class="m11" value="11">11</option>',
                '<option class="m12" value="12">12</option>',
                '</select>',
                '</p>',
                '<p>',
                '年',
                '<input type="text" value="{$the_year}" onfocus="this.select()"/>',
                '</p>',
                '<p>',
                '<button class="ok">确定</button><button class="cancel">取消</button>',
                '</p>'
            ].join("");


            //方法
            //常用的数据格式的验证
            this.Verify = function() {

                var isDay = function(n) {
                    if (!/^\d+$/i.test(n)){
						return false;
					}
                    n = Number(n);
                    return !(n < 1 || n > 31);

                },
                    isYear = function(n) {
                        if (!/^\d+$/i.test(n)){
							return false;
						}
                        n = Number(n);
                        return !(n < 100 || n > 10000);

                    },
                    isMonth = function(n) {
                        if (!/^\d+$/i.test(n)){
							return false;
						}
                        n = Number(n);
                        return !(n < 1 || n > 12);


                    };

                return {
                    isDay:isDay,
                    isYear:isYear,
                    isMonth:isMonth

                };

            };

            /**
             * 渲染子日历的UI
             */
            this._renderUI = function() {
                var cc = this,_o = {},ft;
                cc.HTML = '';
                _o.prev = '';
                _o.next = '';
                _o.title = '';
                _o.ds = '';
                if (!cc.prevArrow) {
                    _o.prev = 'hidden';
                }
                if (!cc.nextArrow) {
                    _o.next = 'hidden';
                }
                if (!cc.father.showtime) {
                    _o.showtime = 'hidden';
                }
                _o.id = cc.id = 'om-cal-' + Math.random().toString().replace(/.\./i, '');
                _o.title = cc.father._getHeadStr(cc.year, cc.month);
                cc.createDS();
                _o.ds = cc.ds;
                cc.father.con.append(cc.father._templetShow(cc.html, _o));
                cc.node = $('#' + cc.id);
                if (cc.father.showTime) {
                    ft = cc.node.find('.om-cal-ft');
                    ft.removeClass('hidden');
                    cc.timmer = new cc.father.TimeSelector(ft, cc.father);
                }
                return this;
            };
            /**
             * 创建子日历的事件
             */
            this._buildEvent = function() {
                var cc = this,i,
                    con = $('#' + cc.id);
                //flush event
                for (i = 0; i < cc.EV.length; i++) {
                    if (typeof cc.EV[i] != 'undefined') {
                        cc.EV[i].unbind(".omCalednar");
                    }
                }

                cc.EV[0] = con.find('div.om-dbd').bind('click', function(e) {
                    //e.preventDefault();
                    source = $(e.target);
                    if (source.hasClass('om-null')){
						return;
					}
                    if (source.hasClass('om-state-disabled')){
						return;
					}
                    var selected = Number(source.html());
					//如果当天是30日或者31日，设置2月份就会出问题
                    var d = new Date('2010/01/01');
                    d.setYear(cc.year);
                    d.setMonth(cc.month);
                    d.setDate(selected);
                    //self.callback(d);
                    //datetime的date
                    cc.father.dt_date = d;
                    
                    if (!cc.father.showTime) {
                        cc.father.onSelect.call(cc.father.con, d);
                    }
                    
                    if (cc.father.popup && !cc.father.showTime) {
                        if (cc.father.closable) {
                            cc.father.hide();
                        }
                        if(!isNaN(cc.father.dt_date)){  //解决ie7拖动日期仍然回填的问题，如果不是数字则忽略回填
                            var dateStr = $.omCalendar.formatDate(cc.father.dt_date, cc.father.dateFormat);
                            $(cc.father.trigger).val(dateStr);
                        }
                    }
                    cc.father.render({selected:d});
                }).find('a').bind('mouseover',function(e){
                    $(this).addClass('om-state-hover om-state-nobd');
                }).bind('mouseout',function(e){
                    $(this).removeClass('om-state-hover');
                    if($(this).hasClass('om-state-highlight') || $(this).hasClass('om-state-active')){
                        return;
                    } else {
                        $(this).removeClass('om-state-nobd');
                    }
                });
                //向前
                cc.EV[1] = con.find('a.om-prev').bind('click', function(e) {
                    e.preventDefault();
                    cc.father._monthMinus().render();
                    cc.father.con.trigger('monthChange', {
                        date:new Date(cc.father.year + '/' + (cc.father.month + 1) + '/01')
                    });

                });
                //向后
                cc.EV[2] = con.find('a.om-next').bind('click', function(e) {
                    e.preventDefault();
                    cc.father._monthAdd().render();
                    cc.father.con.trigger('monthChange', {
                        date:new Date(cc.father.year + '/' + (cc.father.month + 1) + '/01')
                    });
                });
                if (cc.father.navigator) {
                    cc.EV[3] = con.find('a.om-title').bind('click', function(e) {
                        try {
                            cc.timmer.hidePopup();
                            e.preventDefault();
                        } catch(exp) {
                        }
                        source = $(e.target);
                        var setime_node = con.find('.om-setime');
                        setime_node.html('');
                        var in_str = cc.father._templetShow(cc.nav_html, {
                            the_month:cc.month + 1,
                            the_year:cc.year
                        });
                        setime_node.html(in_str);
                        setime_node.find("option:[value=" + (cc.month + 1) + "]").attr("selected", "selected");
                        setime_node.removeClass('hidden');
                        con.find('input').bind('keydown', function(e) {
                            source = $(e.target);
                            if (e.keyCode == 38) {//up
                                source.val(Number(source.val()) + 1);
                                source[0].select();
                            }
                            if (e.keyCode == 40) {//down
                                source.val(Number(source.val()) - 1);
                                source[0].select();
                            }
                            if (e.keyCode == 13) {//enter
                                var _month = con.find('.om-setime select').val();
                                var _year = con.find('.om-setime input').val();
                                con.find('.om-setime').addClass('hidden');
                                if (!cc.Verify().isYear(_year)){
									return;
								}
                                if (!cc.Verify().isMonth(_month)){
									return;
								}
                                cc.father.render({
                                    date:new Date(_year + '/' + _month + '/01')
                                });
                                cc.father.con.trigger('monthChange', {
                                    date:new Date(_year + '/' + _month + '/01')
                                });
                            }
                        });
                    }).bind("mouseover", function(e){
                        $(this).addClass("om-state-hover");
                    }).bind("mouseout", function(e){
                        $(this).removeClass("om-state-hover");
                    });
                    cc.EV[4] = con.find('.om-setime').bind('click', function(e) {
                        e.preventDefault();
                        source = $(e.target);
                        if (source.hasClass('ok')) {
                            var _month = $(this).find('select').val(),
                                _year = $(this).find('input').val();
                            $(this).addClass('hidden');
                            if (!cc.Verify().isYear(_year)){
								return;
							}
                            if (!cc.Verify().isMonth(_month)){
								return;
							}
                            cc.father.render({
                                date:new Date(_year + '/' + _month + '/01')
                            });
                            cc.father.con.trigger('monthChange', {
                                date:new Date(_year + '/' + _month + '/01')
                            });
                        } else if (source.hasClass('cancel')) {
                            $(this).addClass('hidden');
                        }
                    });
                }
                return this;

            };
            /**
             * 得到当前子日历的node引用
             */
            this._getNode = function() {
                var cc = this;
                return cc.node;
            };
            /**
             * 得到某月有多少天,需要给定年来判断闰年
             */
            this._getNumOfDays = function(year, month) {
                return 32 - new Date(year, month - 1, 32).getDate();
            };
            /**
             * 生成日期的html
             */
            this.createDS = function() {
                var cc = this,
                    s = '',
                    startweekday = (new Date(cc.year + '/' + (cc.month + 1) + '/01').getDay() + cc.father.startDay + 7) % 7,//当月第一天是星期几
                    k = cc._getNumOfDays(cc.year, cc.month + 1) + startweekday,
                    i, _td_s;
                
                
                var _dis_days = [];
                for (i = 0; i < cc.father.disabledDays.length; i++) {
                    _dis_days[i] = cc.father.disabledDays[i] % 7;
                }

                for (i = 0; i < k; i++) {
                    var _td_e = new Date(cc.year + '/' + Number(cc.month + 1) + '/' + (i + 1 - startweekday).toString());
                    if (i < startweekday) {//null
                        s += '<a href="javascript:void(0);" class="om-null" >0</a>';
                    } else if ($.inArray((i + cc.father.startDay) % 7, _dis_days) >= 0) {
                        s += '<a href="javascript:void(0);" class="om-state-disabled">' + (i - startweekday + 1) + '</a>';
                    } else if (cc.father.disabledFn(_td_e) === false) {
                        s += '<a href="javascript:void(0);" class="om-state-disabled">' + (i - startweekday + 1) + '</a>';
                    } else if (cc.father.minDate instanceof Date &&
                        new Date(cc.year + '/' + (cc.month + 1) + '/' + (i + 1 - startweekday)).getTime() < (cc.father.minDate.getTime() + 1)) {//disabled
                        s += '<a href="javascript:void(0);" class="om-state-disabled">' + (i - startweekday + 1) + '</a>';

                    } else if (cc.father.maxDate instanceof Date &&
                        new Date(cc.year + '/' + (cc.month + 1) + '/' + (i + 1 - startweekday)).getTime() > cc.father.maxDate.getTime()) {//disabled
                        s += '<a href="javascript:void(0);" class="om-state-disabled">' + (i - startweekday + 1) + '</a>';
                    } else if (i == (startweekday + (new Date()).getDate() - 1) &&
                        (new Date()).getFullYear() == cc.year  &&
                        (new Date()).getMonth() == cc.month) {//today
                        s += '<a href="javascript:void(0);" class="om-state-highlight om-state-nobd">' + (i - startweekday + 1) + '</a>';

                    } else if (i == (startweekday + cc.father.selected.getDate() - 1) &&
                        cc.month == cc.father.selected.getMonth() &&
                        cc.year == cc.father.selected.getFullYear()) {//selected
                        s += '<a href="javascript:void(0);" class="om-state-active om-state-nobd">' + (i - startweekday + 1) + '</a>';
                    } else {//other
                        s += '<a href="javascript:void(0);">' + (i - startweekday + 1) + '</a>';
                    }
                }
                if (k % 7 !== 0) {
                    for (i = 0; i < (7 - k % 7); i++) {
                        s += '<a href="javascript:void(0);" class="om-null">0</a>';
                    }
                }
                cc.ds = s;
                return this;
            };
            /**
             * 渲染
             */
            this.render = function() {
                var cc = this;
                cc._renderUI();
                cc._buildEvent();
                return this;
            };


        }//Page constructor over
    });
	
	$.extend(Calendar.prototype, {
        /**
         * 时间选择构造器
         * @constructor Calendar.TimerSelector
         * @param {object} ft ,timer所在的容器
         * @param {object} father 指向Calendar实例的指针，需要共享父框的参数
         */
        TimeSelector:function(ft, father) {
            //属性
            this.father = father;
            this.fcon = ft.parent('.om-cal-box');
            this.popupannel = this.fcon.find('.om-selectime');//点选时间的弹出层
            if (typeof father.date == 'undefined') {//确保初始值和当前时间一致
                father.date = new Date();
            }
            this.time = father.date;
            this.status = 's';//当前选择的状态，'h','m','s'依次判断更新哪个值
            this.ctime = $('<div class="om-cal-time om-state-default">时间：<span class="h">h</span>:<span class="m">m</span>:<span class="s">s</span><!--{{arrow--><div class="cta"><button class="u om-icon om-icon-triangle-1-n"></button><button class="d om-icon om-icon-triangle-1-s"></button></div><!--arrow}}--></div>');
            this.button = $('<button class="ct-ok om-state-default">确定</button>');
            //小时
            this.h_a = ['00','01','02','03','04','05','06','07','08','09','10','11','12','13','14','15','16','17','18','19','20','21','22','23'];
            //分钟
            this.m_a = ['00','10','20','30','40','50'];
            //秒
            this.s_a = ['00','10','20','30','40','50'];


            //方法
            /**
             * 创建相应的容器html，值均包含在a中
             * 参数：要拼装的数组
             * 返回：拼好的innerHTML,结尾还要带一个关闭的a
             *
             */
            this.parseSubHtml = function(a) {
                var in_str = '';
                for (var i = 0; i < a.length; i++) {
                    in_str += '<a href="javascript:void(0);" class="om-cal-item">' + a[i] + '</a>';
                }
                in_str += '<a href="javascript:void(0);" class="x">x</a>';
                return in_str;
            };
            /**
             * 显示om-selectime容器
             * 参数，构造好的innerHTML
             */
            this.showPopup = function(instr) {
                var self = this;
                this.popupannel.html(instr);
                this.popupannel.removeClass('hidden');
                var status = self.status;
                var active_cls = "om-state-active om-state-nobd";
                self.ctime.find('span').removeClass(active_cls);
                switch (status) {
                    case 'h':
                        self.ctime.find('.h').addClass(active_cls);
                        break;
                    case 'm':
                        self.ctime.find('.m').addClass(active_cls);
                        break;
                    case 's':
                        self.ctime.find('.s').addClass(active_cls);
                        break;
                }
            };
            /**
             * 隐藏om-selectime容器
             */
            this.hidePopup = function() {
                this.popupannel.addClass('hidden');
            };
            /**
             * 不对其做更多的上下文假设，仅仅根据time显示出来
             */
            this.render = function() {
                var self = this;
                var h = self.get('h');
                var m = self.get('m');
                var s = self.get('s');
                self.father._time = self.time;
                self.ctime.find('.h').html(h);
                self.ctime.find('.m').html(m);
                self.ctime.find('.s').html(s);
                return self;
            };
            //这里的set和get都只是对time的操作，并不对上下文做过多假设
            /**
             * set(status,v)
             * h:2,'2'
             */
            this.set = function(status, v) {
                var self = this;
                v = Number(v);
                switch (status) {
                    case 'h':
                        self.time.setHours(v);
                        break;
                    case 'm':
                        self.time.setMinutes(v);
                        break;
                    case 's':
                        self.time.setSeconds(v);
                        break;
                }
                self.render();
            };
            /**
             * get(status)
             */
            this.get = function(status) {
                var self = this;
                var time = self.time;
                switch (status) {
                    case 'h':
                        return time.getHours();
                    case 'm':
                        return time.getMinutes();
                    case 's':
                        return time.getSeconds();
                }
            };

            /**
             * add()
             * 状态值代表的变量增1
             */
            this.add = function() {
                var self = this;
                var status = self.status;
                var v = self.get(status);
                v++;
                self.set(status, v);
            };
            /**
             * minus()
             * 状态值代表的变量增1
             */
            this.minus = function() {
                var self = this;
                var status = self.status;
                var v = self.get(status);
                v--;
                self.set(status, v);
            };


            //构造
            this._init = function() {
                var self = this;
                ft.html('').append(self.ctime);
                ft.append(self.button);
                self.render();
				//TODO:
                self.popupannel.bind('click', function(e) {
                    var el = $(e.target);
                    if (el.hasClass('x')) {//关闭
                        self.hidePopup();
                    } else if (el.hasClass('om-cal-item')) {//点选一个值
                        var v = Number(el.html());
                        self.set(self.status, v);
                        self.hidePopup();
                    }
                });
                //确定的动作
                self.button.bind('click', function() {
                    //初始化读取父框的date
                    var d = typeof self.father.dt_date == 'undefined' ? self.father.date : self.father.dt_date;
                    d.setHours(self.get('h'));
                    d.setMinutes(self.get('m'));
                    d.setSeconds(self.get('s'));
                    self.father.onSelect.call(self.father.trigger, d);
                    if (self.father.popup) {
                        var dateStr = $.omCalendar.formatDate(d, self.father.dateFormat);
                        $(self.father.trigger).val(dateStr);
                        if (self.father.closable) {
                            self.father.hide();
                        }
                    }
                });
                //ctime上的键盘事件，上下键，左右键的监听
                //TODO 考虑是否去掉
                self.ctime.bind('keyup', function(e) {
                    if (e.keyCode == 38 || e.keyCode == 37) {//up or left
                        //e.stopPropagation();
                        e.preventDefault();
                        self.add();
                    }
                    if (e.keyCode == 40 || e.keyCode == 39) {//down or right
                        //e.stopPropagation();
                        e.preventDefault();
                        self.minus();
                    }
                });
                //上的箭头动作
                self.ctime.find('.u').bind('click', function() {
                    self.hidePopup();
                    self.add();
                });
                //下的箭头动作
                self.ctime.find('.d').bind('click', function() {
                    self.hidePopup();
                    self.minus();
                });
                //弹出选择小时
                self.ctime.find('.h').bind('click', function() {
                    var in_str = self.parseSubHtml(self.h_a);
                    self.status = 'h';
                    self.showPopup(in_str);
                });
                //弹出选择分钟
                self.ctime.find('.m').bind('click', function() {
                    var in_str = self.parseSubHtml(self.m_a);
                    self.status = 'm';
                    self.showPopup(in_str);
                });
                //弹出选择秒
                self.ctime.find('.s').bind('click', function() {
                    var in_str = self.parseSubHtml(self.s_a);
                    self.status = 's';
                    self.showPopup(in_str);
                });
            };
            this._init();
        }

    });
	
	var docloaded = false;
    $(document).ready(function() {
        docloaded = true;
    });
	
    var publicMethods = {
            /**
             * 将控件设置为不可用。会将input设置为不可用。
             * @name omCalendar#disable
             * @function
             * @returns jQuery对象
             * @example
             * $('#input').omCalendar('disable');
             */
            disable : function() {
                return this.each(function() {
                    $(this).attr("disabled", true);
                    $(this).next().addClass('om-state-disabled').unbind();
                });
            }, 
            
            /**
             * 将控件设置为可用状态。会将input设置为可用状态。
             * @name omCalendar#enable
             * @function
             * @returns jQuery对象
             * @example
             * $('#input').omCalendar('enable');
             */
            enable : function() {
                return this.each(function() {
                    $(this).attr("disabled", false);
                    $(this).next().removeClass('om-state-disabled');
                    this.calendar._buildEvent(true);
                });
            },
            
            /**
             * 获取控件选中的日期。
             * @name omCalendar#getDate
             * @function
             * @returns Date
             * @example
             * var date = $('#input').omCalendar('getDate');
             */
            getDate : function(){
                var target = this[0];
                if (target && target.calendar) {
                    return target.calendar.selected;
                }
            }, 
           
            /**
             * 设置控件选中的日期。
             * @name omCalendar#setDate
             * @function
             * @param Date
             * @returns jQuery 对象
             * @example
             * $('#input').omCalendar('setDate', new Date(2012, 0, 1));
             */
            setDate : function(d) {
                return this.each(function() {
                    if (this.calendar) {
                        this.calendar.render({selected : d, date : d});
                    }
                });
            }
        };
    
	$.fn.omCalendar = function(p) {
	    if (p && typeof(p) == 'string') {
            if (publicMethods[p]) {
                return publicMethods[p].apply(this, Array.prototype.slice.call(arguments, 1));
            }
            return null;
        }
        
        return this.each(function() {
            if (!docloaded) {
                $(this).hide();
                var t = this;
                $(document).ready(function() {
                    this.calendar = new Calendar($(this), p);
                });
            } else {
                this.calendar = new Calendar($(this), p);
            }
        });
	};
	
	$.omCalendar = $.omCalendar || {};
	
	$.extend($.omCalendar, {
        leftPad : function (val, size, ch) {
            var result = new String(val);
            if(!ch) {
                ch = " ";
            }
            while (result.length < size) {
                result = ch + result;
            }
            return result.toString();
        }
    });
	$.extend($.omCalendar, {
	    getShortDayName : function(day){
            return $.omCalendar.dayMaps[day][0];
        },
        getDayName : function (day) { 
            return $.omCalendar.dayMaps[day][1];
        },
	    
        getShortMonthName : function(month){
            return $.omCalendar.monthMaps[month][0];
	    },
	    getMonthName : function (month) { 
	        return $.omCalendar.monthMaps[month][1];
	    },
	    dayMaps : [
            ['Sun', 'Sunday'],
	        ['Mon', 'Monday'],
	        ['Tue', 'Tuesday'],
	        ['Wed', 'Wednesday'],
	        ['Thu', 'Thursday'],
	        ['Fri', 'Friday'],
	        ['Sat', 'Saturday']
	    ],
	    monthMaps : [
            ['Jan', 'January'],
            ['Feb', 'February'],
            ['Mar', 'March'],
            ['Apr', 'April'],
            ['May', 'May'],
            ['Jun', 'June'],
            ['Jul', 'July'],
            ['Aug', 'August'],
            ['Sep', 'September'],
            ['Oct', 'October'],
            ['Nov', 'November'],
            ['Dec', 'December']
        ],
        /**
         * g: getter method
         * s: setter method
         * r: regExp
         */
        formatCodes : {
	        //date
	        d: {
	            g: "this.getDate()", //date of month (no leading zero)
	            s: "this.setDate({param})",
	            r: "(0[1-9]|[1-2][0-9]|3[0-1]|[1-9])"
	        },
	        dd: {
	            g: "$.omCalendar.leftPad(this.getDate(), 2, '0')", //date of month (two digit)
	            s: "this.setDate(parseInt('{param}', 10))",
	            r: "(0[1-9]|[1-2][0-9]|3[0-1]|[1-9])"
	        },
	         
	        //month
	        m: {
	            g: "(this.getMonth() + 1)", // get month in one digits, no leading zero
	            s: "this.setMonth(parseInt('{param}', 10))",
	            r: "(0[1-9]|1[0-2]|[1-9])"
	        },
	        mm: { 
	            g: "$.omCalendar.leftPad(this.getMonth() + 1, 2, '0')",//two digits
	            s: "this.setMonth(parseInt('{param}', 10))",
	            r: "(0[1-9]|1[0-2]|[1-9])"
	        },
	        
	        //year
	        y: {
	            g: "('' + this.getFullYear()).substring(2, 4)", // get year in 2 digits
	            s: "this.setFullYear(parseInt('20{param}', 10))",
	            r: "(\\d{2})"
	        },
	        yy: {
	            g: "this.getFullYear()", // get year in 4 digits
	            s: "this.setFullYear(parseInt('{param}', 10))",
	            r: "(\\d{4})"
	        },
	        
	        //hour
	        h: {
	            g: "$.omCalendar.leftPad((this.getHours() % 12) ? this.getHours() % 12 : 12, 2, '0')",// 12 hours, two digits
	            s: "this.setHours(parseInt('{param}', 10))", // TODO,need to be fixed
	            r: "(0[0-9]|1[0-1])" // 00~11
	        },
            H: {
                g: "$.omCalendar.leftPad(this.getHours(), 2, '0')",   //24 hours, two digits
                s: "this.setHours(parseInt('{param}', 10))",
                r: "([0-1][0-9]|2[0-3])"   //00~23
            },
            g: {
                g: "((this.getHours() % 12) ? this.getHours() % 12 : 12)", // 12 hours, no leading 0
                s: "this.setHours(parseInt('{param}', 10))", // TODO,need to be fixed
                r: "([0-9]|1[0-1])" // 0, 1, 2, 3, ..., 11
            },
            G: {
                g: "this.getHours()",   // 24 hours, no leading 0
                s: "this.setHours(parseInt('{param}', 10))",
                r: "([0-9]|1[0-9]|2[0-3])" //0, 1, 2, 3, ..., 23
            },
            
            //minute
            i: {
                g: "$.omCalendar.leftPad(this.getMinutes(), 2, '0')", // get minute (two digits)
                s: "this.setMinutes(parseInt('{param}', 10))",
                r: "([0-5][0-9])" //00, 01, 02, ..., 59
            }, 
            
            //second
            s: {
                g: "$.omCalendar.leftPad(this.getSeconds(), 2, '0')", // get seconds (two digits)
                s: "this.setSeconds(parseInt('{param}', 10))",
                r: "([0-5][0-9])" //00, 01, 02, ..., 59
            },
            
            // millisecond
            u: {
                g: "$.omCalendar.leftPad(this.getMilliseconds(), 3, '0')",
                s: "this.setMilliseconds(parseInt('{param}', 10))",
                r: "(\\d{1,3})" //0, 1, 2, ..., 999
            },
            
            //localised names
            D: {
                g: "$.omCalendar.getShortDayName(this.getDay())", // get localised short day name
                s: "",
                r: ""
            },
            DD: {
                g: "$.omCalendar.getDayName(this.getDay())", // get localised long day name
                s: "",
                r: ""
            },
            
            M: {
                g: "$.omCalendar.getShortMonthName(this.getMonth())", // get localised short month name
                s: "",
                r: ""
            },
            MM: {
                g: "$.omCalendar.getMonthName(this.getMonth())", // get localised long month name
                s:"",
                r:""
            },
            
            //am & pm
            a: {
                g: "(this.getHours() < 12 ? 'am' : 'pm')", // am pm
                s: "",
                r: ""
            },
            A: {
                g: "(this.getHours() < 12 ? 'AM' : 'PM')", // AM PM
                s: "",
                r: ""
            }
        }
	});
	$.extend($.omCalendar, {
		
	    formatDate : function(date, formatter){
	        if (!date || !formatter) {
	            return null;
	        }
	        if (!(Object.prototype.toString.call(date) === '[object Date]')) {
	            return null;
	        }
	        var i, fi , result = '', literal = false;
	        for (i = 0; i < formatter.length ; i++ ) {
	            fi = formatter.charAt(i);
	            fi_next = formatter.charAt(i + 1);
	            if (fi == "'") {
	                literal = !literal;
	                continue;
	            }
	            if (!literal && $.omCalendar.formatCodes[fi + fi_next]) {
	                fi = new Function("return " + $.omCalendar.formatCodes[fi + fi_next].g).call(date);
	                i ++;
	            } else if (!literal && $.omCalendar.formatCodes[fi]) {
	                fi = new Function("return " + $.omCalendar.formatCodes[fi].g).call(date);
	            }
	            result += fi;
	        }
	        return result;
	        
	    },
	    parseDate : function(date_string, formatter){
	        if (!date_string || !formatter) {
	            return null;
	        }
	        if (!(Object.prototype.toString.call(date_string) === '[object String]')) {
	            return null;
	        }
	        var setterArr = [], i, fi, $fci = null, m_result;
	        for (i = 0 ; i < formatter.length; i ++) {
	            fi = formatter.charAt(i);
	            fi_next = formatter.charAt(i + 1);
	            if ($.omCalendar.formatCodes[fi + fi_next]) {
	                $fci = $.omCalendar.formatCodes[fi + fi_next];
                    i ++;
                } else if ($.omCalendar.formatCodes[fi]) {
                    $fci = $.omCalendar.formatCodes[fi];
                } else {
                    continue;
                }
	            m_result = date_string.match(new RegExp($fci.r));
	            if (!m_result) {
	                // your string and your formmatter is not matched!
	                return null;
	            }
	            setterArr.push($fci.s.replace('{param}', m_result[0]));
	            date_string = date_string.substring(m_result.index + m_result[0].length);
	            var newChar = formatter.charAt(i + 1);
	            if (!(newChar == "" && date_string == "") 
	                    && (newChar !== date_string.charAt(0))
	                    && ($.omCalendar.formatCodes[newChar] === undefined)) {
	                // your string and your formmatter is not matched!
                    return null;
                }
	        }
	        var date = new Date();
	        new Function(setterArr.join(";")).call(date);
	        return date;
	    }
	});
	
})(jQuery);/*
 * $Id: om-combo.js,v 1.149 2012/01/16 01:48:41 linxiaomin Exp $
 * operamasks-ui omCombo 1.0
 *
 * Copyright 2011, AUTHORS.txt (http://ui.operamasks.org/about)
 * Dual licensed under the MIT or GPL Version 2 licenses.
 * http://ui.operamasks.org/license
 *
 * http://ui.operamasks.org/docs/
 *
 * Depends:
 *  jquery.ui.core.js
 *  jquery.ui.widget.js
 */
;(function($) {
    var _valueKey='_value';
    
    // Array.prototype.indexOf is added in JavaScript v1.6.
    // IE8 only support JavaScript v1.3. So added it to make this component support IE.
    if(!Array.prototype.indexOf){
        Array.prototype.indexOf=function(item){
            var len=this.length;
            for(var i=0;i<len;i++){
                if(this[i]===item){
                    return i;
                }
            }
            return -1;
        };
    }
	/**
     * @name omCombo
     * @class 下拉输入框组件。类似于html中的select，但是可以输入，可以过滤，可以使用远程数据。<br/><br/>
     * <b>特点：</b><br/>
     * <ol>
     *      <li>可以使用本地数据源，也可以使用远程数据源</li>
     *      <li>支持下拉框的缓加载（第一次显示时才初始化下拉框中的内容）</li>
     *      <li>用户可定制下拉框中数据的显示效果</li>
     *      <li>用户可定制选择后回填到输入框的文字</li>
     *      <li>用户可定制选择后组件的value值</li>
     *      <li>用户可定制下拉框的宽度和最大高度</li>
     *      <li>具有边输入边过滤的功能，也可定制过滤的算法</li>
     *      <li>提供丰富的事件</li>
     * </ol>
     * 
     * <b>示例：</b><br/>
     * <pre>
     * &lt;script type="text/javascript" >
     * $(document).ready(function() {
     *     $('#combo').omCombo({
     *         dataSource:[
     *                 {text:'Java',value:'1'},
     *                 {text:'JavaScript',value:'2'},
     *                 {text:'C',value:'3'},
     *                 {text:'PHP',value:'4'},
     *                 {text:'ASP',value:'5'}
     *         ],
     *         optionField:function(data,index){
     *             return '&lt;font color="red">'+index+'：&lt;/font>'+data.text+'('+data.value+')';
     *         },
     *         emptyText:'select one option!',
     *         value:'1',
     *         editable:false,
     *         lazyLoad:true,
     *         listMaxHeight:40
     *     });
     * });
     * &lt;/script>
     * 
     * &lt;input id="combo"/>
     * </pre>
     * 
     * @constructor
     * @description 构造函数. 
     * @param p 标准config对象：{}
     */
	$.widget('om.omCombo', {
	    options: 
	       /** @lends omCombo#*/
	       {
                /**
                 * 将JSON对象中哪个字段作为option的text，可以指定为JSON的一个属性，也可以指定一个function来自己决定如何显示option的text。<br/><br/> 
                 * <ul>
                 * <li>对于[{"text":"Java语言","value":"java"},{"text":"C语言","value":"c"},{"text":"C#语言","value":"c#"}]这样的对象,此属性可以不设置，将采用默认值'text'。</li>
                 * <li>对于[{"label":"Java语言","id":"java"},{"label":"C语言","id":"c"},{"label":"C#语言","id":"c#"}]这样的对象,此属性可以设置为'label'。</li>
                 * <li>对于[{"name":"深圳","abbreviation":"sz","code":"0755"},{"name":"武汉","abbreviation":"wh","code":"027"},{"name":"北京","abbreviation":"bj","code":"010"}]这样的对象,此属性可以设置为</li>
                 * </ul>
                 * <br/>
                 * @type String or Function 
                 * @default 'text' 
                 * @example
                 * optionField:function(data,index){ 
                 *   return data.name+'('+ data.abbreviation+')'; 
                 * }  
                 * // 最后options分显示成"深圳(sz)、武汉(wh)、北京(bj)"这样的。
                 * // 当然也可以写成其它东西，如下面的代码可以实现options为左图片右文字的情况
                 * // return '&lt;img src="options.jpg" style="float:left"/>&lt;span style="float:right">' + data.value+'&lt;/span>'; 
                 */
                optionField : 'text',
                /**
                 * JSON对象中哪个字段作为option的value属性，可以指定为JSON的一个属性，也可以指定一个function来自己决定如何显示option的value。<br/><br/>
                 * <ul>
                 *   <li>[{"text":"Java语言","value":"java"},{"text":"C语言","value":"c"},{"text":"C#语言","value":"c#"}] 将采用默认值'value'。</li>
                 *   <li>[{"label":"Java语言","id":"java"},{"label":"C语言","id":"c"},{"label":"C#语言","id":"c#"}] 此属性可以设置为'id'。</li>
                 *   <li>[{"name":"深圳","abbreviation":"sz","code":"0755"},{"name":"武汉","abbreviation":"wh","code":"027"},{"name":"北京","abbreviation":"bj","code":"010"}]此属性可以设置为'code'</li>
                 * </ul>
                 * <br/>
                 * @type String , Function
                 * @default 'value'
                 * @example
                 * 如果JSON数据为
                 * [
                 *   {"name":"深圳","abbreviation":"sz","code":"0755"},
                 *   {"name":"武汉","abbreviation":"wh","code":"027"}
                 * ]
                 * function(data,index){
                 *    return data.code+'(' + data.abbreviation+')';
                 * } 
                 *  最后各options的值分别是"0755(sz)、027(wh)、010(bj)"这样的。
                 *  当然也可以写成其它复杂的东西，如return data.code.substring(1); 
                 *  以实现将区号前面的0去掉作为option的value这样的功能。
                 */
                valueField : 'value',
                /**
                 * 组件宽度。可以使用px、pt、em、auto，如'100px'、'10pt'、'15em'、'auto'
                 * @type String
                 * @default 'auto'
                 * @example
                 * width : '100px'
                 */
                width : 'auto',
                /**
                 * 是否禁用组件。如果禁用，则不可以输入，form提交时也将忽略这个输入框。
                 * @type Boolean
                 * @default false
                 * @example
                 * disabled : true
                 */
                disabled : false,
                /**
                 * 组件是否只读。如果是只读，则不可以输入，不可以通过下拉框选择一个option，form提交时将包含这个输入框。
                 * @type Boolean
                 * @default false
                 * @example
                 * readOnly : true
                 */
                readOnly : false,
                /**
                 * 组件是否可以输入。设成false时不可以输入，但可以从下拉框里选择一个option。
                 * @type Boolean
                 * @default true
                 * @example
                 * editable : true
                 */
                editable : true,
                /**
                 * 是否延迟加载下拉框里的选项，设成true时页面显示时不加载下拉框选项，第一次展开下拉框才加载。
                 * @type Boolean
                 * @default false
                 * @example
                 * lazyLoad : true
                 */
                lazyLoad : false,
                /**
                 * 组件的下拉框的最大高度，设成'auto'时高度不固定，有多少选项就显示多高；设成50时表示下拉框最大高度50px，如果超过这个则显示垂直滚动条。<b>注意：由于浏览器的限制，这个属性的最小值是31，如果小于这个值时将看不到垂直滚动条</b>
                 * @type Number
                 * @default 300
                 * @example
                 * listMaxHeight : 500
                 */
                listMaxHeight : 300,
                /**
                 * 组件的下拉框的宽度是否自动扩展。设成false时下拉框的宽度将与输入框宽度保持一致；设成true时下拉框宽度将等于最宽的那个选项的宽度。
                 * @type Boolean
                 * @default false
                 * @example
                 * listAutoWidth : true
                 */
                listAutoWidth : false,
                /**
                 * 是否自动过滤下拉框选项。设成true时下拉框中将仅显示与输入框当前值匹配（匹配算法由filterStrategy决定）的选项。
                 * @type Boolean
                 * @default true
                 * @example
                 * autoFilter : true
                 */
                autoFilter : true,
                /**
                 * 自动过滤下拉框选项采用的过滤算法。<b>注意：仅当autoFilter不为false时该属性才有效果</b><br/>
                 * 默认值为'first'表示从左边匹配（相当于startWith），即下拉框的选项的label以输入框的值开头的才会显示。<br/>
                 * 设为'last'表示从右边匹配（相当于endWith），即下拉框的选项的label以输入框的值结尾的才会显示。<br/>
                 * 设为'anywhere'表示从任意位置匹配（相当于contains），即下拉框的选项的label只要出现过与输入框的值一样的都会显示。<br/>
                 * 也可以设为一个自定义function，该function返回true表示匹配成功，将会显示在下拉列表中，返回true则不显示。
                 * @type String,Function
                 * @default 'first'
                 * @example
                 * //此属性可以设置为'first' 或 'last' 或 'anywhere' 或 
                 * function(text,record){ 
                 *      var reg=new RegExp(text); 
                 *      //只要当前记录的postCode属性或idCardNo属性中包含输入框的值就算匹配成功
                 *      return reg.test(record.postCode) || reg.test(record.idCradNo); 
                 * } 
                 */
                filterStrategy : 'first',
                /**
                 * 自动过滤下拉框选项延迟时间（单位：毫秒）。如果设成300则表示在300毫秒内输入连续按键多次，则只进行最后一次按键的过滤。<b>注意：仅当autoFilter不为false时该属性才有效果</b>
                 * @type Number
                 * @default 500
                 * @example
                 * filterDelay : 1000
                 */
                filterDelay : 500, 
                
                /**
                 * 是否支持多选，默认为 false。如果支持多选默认将不可编辑只可选择。
                 * @type Boolean
                 * @default false
                 * @example
                 *  multi : true
                 */
                multi : false, 
                
                /**
                 * 支持多选时的多个选项之间的分隔符，默认为 ','.
                 * @type String
                 * @default ','
                 * @example
                 *  multiSeparator : ';'
                 */
                multiSeparator : ','
                
                /**
                 * 数据源属性，可以设置为“后台获取数据的URL”或者“JSON数据”
                 * @name omCombo#dataSource
                 * @type Array[JSON],URL
                 * @default 无
                 * @example
                 * dataSource : '/operamasks-ui/getCountryNameServlet.json' 
                 * 或者
                 * dataSource : [{"value":"001","text":"张三"},{"value":"002","text":"李四"}]
                 */
                /**
                 * 当input框的值为空时，input框里出现提示消息。当input框得到焦点或者input框的值不为空时这个提示消息会自动消失。
                 * @name omCombo#emptyText
                 * @default 无
                 * @type String
                 * @example
                 * emptyText : '请输入值'
                 */
                /**
                 * combo组件的初始值。<b>注意：如果设置了value属性的值则lazyLoad属性将会被强制转换为false</b>
                 * @name omCombo#value
                 * @default 无
                 * @type String
                 * @example
                 * value : '北京'
                 */
                /**
                 * 填充下拉框内容的function。设置此属性时表示用户要自己接管从records到下拉框的显示过程，用户拿到所有的records然后自己填充下拉框里的内容，最后返回一个JQuery元素集合，集合里的每个元素表示一个option，按上下键选择时将会在这个集合的元素间循环高亮。
                 * @name omCombo#listProvider
                 * @type Function
                 * @default 无
                 * @returns {jQuery Array} 应该返回一个jQuery数组，里面的每个元素表示下拉框里的一个option（如下示例中下拉框里是一个table，tabody中的每个tr表示一个option，所以返回container.find('tbody tr')）。
                 * @example
                 * listProvider:function(container,records){ 
                 *      $('&lt;table&gt;').appendTo(container);
                 *      records.each(function(){ 
                 *          $('&lt;tr&gt;&lt;td&gt;'+this.text+'&lt;td&gt;&lt;/tr&gt;').appendTo(container); 
                 *      }); 
                 *      $('&lt;/table>').appendTo(container);
                 *      return container.find('tbody tr'); //tbody中每个tr表示一个option，而thead中的tr表示表头，不是option
                 *  } 
                 */
                 /**
                 * 将JSON对象的哪个字段作为显示到input框的文字。可以指定为JSON的一个属性，也可以指定一个function来自己决定显示什么文字到input框。<b>注意：这里的内容在选择一个option后会直接显示在input框里，所以只能显示普通字符串，不能使用html</b>
                 * @name omCombo#inputField
                 * @type String or Function
                 * @default 'text'
                 * @example
                 * //以JSON对象的userName属性值作为显示到输入框的文字
                 * inputField:'userName'
                 * 
                 * //自定义一个Function来决定以什么作为显示到输入框的文字
                 * inputField:function(data,index){ 
                 *      return data.text+'('+data.value+')';
                 * } 
                 */
                 /**
                 * omCombo的输入框的内容发生变化时的回调函数。
                 * @event
                 * @param target 当前输入框对象
                 * @param newValue 选择的新值
                 * @param oldValue 原来的值
                 * @name omCombo#onValueChange
                 * @type Function
                 * @example
                 * onValueChange:function(target,newValue,oldValue){ 
                 *      //do something
                 *  } 
                 */
                 /**
                 * 以Ajax方式加载下拉列表中的内容出错时的回调函数。可以在这里进行一些处理，比如以人性化的方式提示用户。
                 * @event
                 * @param xmlHttpRequest XMLHttpRequest对象
                 * @param textStatus  错误类型
                 * @param errorThrown  捕获的异常对象
                 * @name omCombo#onError
                 * @type Function
                 * @example
                 * onError:function(xmlHttpRequest, textStatus, errorThrown){ 
                 *      alert('An error occurred while load records from URL "'+url+'",the error message is:'+errorThrown.message);
                 *  } 
                 */
                 /**
                 * Ajax响应回来时执行的方法。
                 * @event
                 * @param data Ajax请求返回的数据
                 * @param textStatus 响应的状态
                 * @name omCombo#onSuccess
                 * @type Function
                 * @example
                 * onSuccess:function(data, textStatus){
                 *     if(data.length==0){
                 *          $('#txt').omSuggestion('showMessage','没有数据！');
                 *     } 
                 * }
                 */
        },
        _init:function(){
            var options = this.options,
                inputEl = this.element,
                source = options.dataSource;
            if (options.width != 'auto') {
                var span = inputEl.parent().width(options.width);
                inputEl.width(span.innerWidth() - inputEl.next().outerWidth() - inputEl.outerWidth() + inputEl.width());
            }
            /*if (!options.listAutoWidth) {
                this.dropList.width(inputEl.parent().width());
            }*/
            
            if (options.multi) {
                options.editable = this.options.editable = false;
            }
            
            options.disabled ? inputEl.attr('disabled', true) : inputEl.removeAttr('disabled');
            (options.readOnly || !options.editable) ? inputEl.attr('readonly', 'readOnly') : inputEl.removeAttr('readonly');
            
            if (!options.lazyLoad) {
                //load data immediately
                this._toggleLoading('add');
                if(source && typeof source == 'string'){
                    this._ajaxLoad(source);
                }else if(source && typeof source == 'object'){
                    this._loadData(source);
                    this._toggleLoading('remove');
                }else{
                    //neither records nor remote url was found
                    this.dataHasLoaded = true;
                    this._toggleLoading('remove');
                }
                
            } else {
                this.dataHasLoaded = false;
            }
            var unusable = options.disabled || options.readOnly;
            
            if (unusable) {
                this.expandTrigger.addClass('om-state-disabled');
            } else {
                this._bindEvent();
            }
        },
        _create:function(){
            var options = this.options;
            if (!options.inputField) {
                options.inputField = options.optionField;
            }
            //由于在lazyLoad=false的情况下设置value时无法显示正确的fieldText
            if (typeof options.value !== 'undefined') {
                options.lazyLoad = false;
            }
            var inputEl = this.element;
            this._refeshEmptyText(options.emptyText);
            inputEl.attr('autocomplete', 'off');
            var span = $('<span class="om-combo om-widget om-state-default"></span>').insertAfter(inputEl).wrapInner(inputEl);
            this.expandTrigger = $('<span class="om-combo-trigger"></span>').appendTo(span);
            this.dropList = $($('<div class="om-widget"><div class="om-widget-content om-droplist"></div></div>').css({position:'absolute', zIndex:10000}).appendTo(document.body).children()[0]).hide();
        },
        /**
         * 重新加载下拉框里的数据，一般用于级联combo功能。
         * @name omCombo#setData
         * @function
         * @param arg records（JSON数组）或url
         * @example
         * //用一个固定的JSON数组来重新加载combo的下拉列表
         * $('#productCombo').omCombo('setData',[
         *      {"text":'Apusic Server',"value":"aas"},
         *      {"text":'Apusic OperaMasks SDK',"value":"aom"},
         *      {"text":'Apusic OperaMasks Studio',"value":"studio"}
         * ]);
         * 
         * //通过一个url来发送Ajax请求重新加载combo的下拉列表
         * $('#cityCombo').omCombo('setData',"../data/cityData.do?province="+$('#cityCombo').omCombo('value'));
         */
        setData:function(param){
            var self = this;
            var inputEl = self.element;
            self.options.value = '';
            inputEl.val('');
            self._toggleLoading('add');
            if (typeof param === 'string') {
                self._ajaxLoad(param);
            } else {
                self._loadData(param);
                self._toggleLoading('remove');
            }
        },
        /**
         * 获取combo的数据源，返回一个JSON数组。<b>注意：该数组和下拉项数组不是等同的，但存在一一对应的关系:前者经过格式化后能转变成后者</b>
         * @name omCombo#getData
         * @function
         * @returns 如果combo中有数据，则返回combo的数据源(一个由所有记录组成的JSON数组)；否则返回null
         * @example
         * //获取combo的数据源
         * var store = $('#productCombo').omCombo('getData');
         * 
         */
        getData:function(){
            //如果已经存在dataSource则直接取出
            var returnValue = this.options.dataSource;
            return (typeof returnValue == 'object') ? returnValue : null;
        },
        /**
         * 得到或设置combo的value值。
         * @name omCombo#value
         * @param v 设置的值，不设置表示获取值
         * @type Function
         * @returns 如果没有参数时表示getValue()返回combo的value值。如果有参数时表示setValue(newValue)返回jQuery对象。
         * 
         */
         value:function(v){
             if (typeof v === 'undefined') {
                 var value = $(this.element).attr(_valueKey);
                 return value ? value : '';
             } else {
                 this._setValue(v);
                 return this;
             }
         },
        /**
         * 禁用组件。
         * @name omCombo#disable
         * @function
         * @example
         * $('#mycombo').omCombo('disable');
         */
        disable:function(){
            var input=this.element;
            //distroy event listening
            input.attr('disabled', true).unbind();
            this.options.disabled = true;
            this.expandTrigger.addClass('om-state-disabled').unbind();
        },
        /**
         * 启用组件。
         * @name omCombo#enable
         * @function
         * @example
         * $('#mycombo').omCombo('enable');
         */
        enable:function(){
            var input=this.element;
            input.removeAttr('disabled').unbind();
            this.options.disabled = false;
            this.expandTrigger.removeClass('om-state-disabled').unbind();
            //rebuild event listening
            this._bindEvent();
        },
        //private
        _bindEvent:function(){
            var self = this;
            var options = this.options;
            var input = this.element;
            var span = input.parent('span');
            var dropList = this.dropList;
            var expandTrigger = this.expandTrigger;
            var emptyText = options.emptyText;
            var isFocus = false;
            span.mouseenter(function(){   
               if(!options.disabled){
                   span.addClass("om-state-hover");
               }
            }).mouseleave(function(){      
                span.removeClass("om-state-hover");
            });
            input.focus(function(){
                if(isFocus) 
                    return;
                isFocus = true;
                $('.om-droplist').hide(); //hide all other dropLists
                span.addClass('om-state-focus');
                //input.addClass('om-span-field-focus');
                //input.parent('span').
                //expandTrigger.addClass('om-state-hover');
                self._refeshEmptyText(emptyText);
                if (!self.dataHasLoaded) {
                    if(!expandTrigger.hasClass('om-loading')){
                        self._toggleLoading('add');
                        if (typeof(options.dataSource) == 'object') {
                            self._loadData(options.dataSource);
                            self._toggleLoading('remove');
                        } else if (typeof(options.dataSource) == 'string') {
                            self._ajaxLoad(options.dataSource);
                        } else {
                            //neither records nor remote url was found
                            self.dataHasLoaded = true;
                            self._toggleLoading('remove');
                        }
                    }
                }
                if (!options.disabled && !options.readOnly) {
                    self._showDropList();
                }
            }).blur(function(e){
                isFocus = false;
                span.removeClass('om-state-focus');
                input.removeClass('om-combo-focus');
                //expandTrigger.removeClass('om-trigger-hover');
                if (!options.disabled && !options.readOnly && !options.multi) {
                    if (self.hasManualInput) {
                        //如果有手工输入过值，在blur时检查是否是合法的值，如果不是要清除不合法的输入并还原成输入前的值
                        self.hasManualInput = false;
                        var text = input.val();
                        if (text !== '') {
                            var allInputText = $.data(input, 'allInputText');
                            var allValues = $.data(input, 'allValues');
                            var index = allInputText.indexOf(text);
                            if (index > -1) {
                                self._setValue(allValues[index]);
                            } else {
                                var value = input.attr(_valueKey);
                                index = allValues.indexOf(value);
                                if (index > -1) {
                                    input.val(allInputText[index]);
                                } else {
                                    input.val('');
                                }
                            }
                        }
                    }
                    self._refeshEmptyText(emptyText);
                }
            }).keyup(function(e){
                var key = e.keyCode;
                switch (key) {
                    case 40: //down
                        self._selectNext();
                        break;
                    case 38: //up
                        self._selectPrev();
                        break;
                    case 13: //enter
                        self._backfill(self.dropList.find('.om-state-hover'));
                        break;
                    case 27: //esc
                        dropList.hide();
                        break;
                    case 9: //tab
                        //only trigger the blur event
                        break;
                    default:
                        //fiter功能
                        self.hasManualInput = true;
                        if (!options.disabled && !options.readOnly && options.editable && options.autoFilter) {
                            if (window._omcomboFilterTimer) {
                                clearTimeout(window._omcomboFilterTimer);
                            }
                            window._omcomboFilterTimer = setTimeout(function(){
                                if($(document).attr('activeElement').id == input.attr('id')){//当焦点在当前输入框的时候才显示下拉框，否则隐藏
                                    dropList.show();
                                }
                                self._doFilter(input);
                            }, options.filterDelay);
                        }
                }
            });
            span.mousedown(function(e){
                e.stopPropagation(); //document的mousedown会隐藏下拉框，这里要阻止冒泡
            });
            dropList.mousedown(function(e){
                e.stopPropagation(); //document的mousedown会隐藏下拉框，这里要阻止冒泡
            });
            expandTrigger.click(function(){
                !expandTrigger.hasClass('om-loading') && input.focus();
            }).mousedown(function(){
                !expandTrigger.hasClass('om-loading') && span.addClass('om-state-active');
            }).mouseup(function(){
                !expandTrigger.hasClass('om-loading') && span.removeClass('om-state-active');
            });
            
            $(document).bind('mousedown.omCombo',function(){
                dropList.hide();
            });
        },
        _showDropList:function(){
            var inputEl = this.element;
            var allItems = this._getAllOptionsBeforeFiltered().removeClass('om-helper-hidden om-state-hover');
            if(allItems.size()<=0){ //如果下拉框没有数据
                return;
            }
            var options = this.options;
            var dropList = this.dropList.scrollTop(0).css('height','auto');
            var valuedItem;
            var nowValue = inputEl.attr(_valueKey);
            if (nowValue !== undefined && nowValue !== '') {
                var allValues = $.data(inputEl, 'allValues');
                if (options.multi) {
                    var selectedValues = nowValue.split(options.multiSeparator);
                    for (var i=0; i<selectedValues.length; i++) {
                        var index = allValues.indexOf(selectedValues[i]);
                        if (index > -1) {
                            $(dropList.find('.om-combo-list-row').get(index)).addClass('om-combo-selected');
                        }
                    }
                    valueItem = selectedValues[0];
                } else {
                    var index = allValues?allValues.indexOf(nowValue):-1;
                    if (index > -1) {
                        valuedItem = $(dropList.find('.om-combo-list-row').get(index)).addClass('om-combo-selected');
                    }
                }
            }
            var dropListContainer = dropList.parent(), span = inputEl.parent();
            if (!options.listAutoWidth) {
                dropListContainer.width(span.outerWidth());
            }else{
            	if($.browser.msie&&($.browser.version == "7.0")&&!$.support.style){
            		dropListContainer.width(dropList.show().outerWidth());
            	}else{
            		dropListContainer.width(dropList.outerWidth());
            	}
            }
            if (options.listMaxHeight != 'auto' && dropList.show().height() > options.listMaxHeight) {
                dropList.height(options.listMaxHeight).css('overflow-y','auto');
            }
            var inputPos = span.offset();
            dropListContainer.css({
                'left': inputPos.left,
                'top': inputPos.top + span.outerHeight()
            });
            dropList.show();
            if (valuedItem) { //自动滚动滚动条到高亮的行
                dropList.scrollTop($(valuedItem).offset().top - dropList.offset().top);
            }
        },
        _toggleLoading:function(type){
            if(!this.options.disabled){
                if (type == 'add') {
                    this.expandTrigger.removeClass('om-icon-carat-1-s').addClass('om-loading');
                } else if (type == 'remove') {
                    this.expandTrigger.removeClass('om-loading').addClass('om-icon-carat-1-s');
                }
            }
        },
        _ajaxLoad:function(url){
            var self=this;
            var options = this.options;
            $.ajax({
                url: url,
                method: 'POST',
                dataType: 'json',
                success: function(data, textStatus){
                    self.dataHasLoaded = true;
                    var onSuccess = options.onSuccess;
                    if (onSuccess && onSuccess(data, textStatus) === false) {
                        options.dataSource = data;
                        return;
                    }
                    self._loadData(data);
                    self._toggleLoading('remove');
                },
                error: function(XMLHttpRequest, textStatus, errorThrown){
                    self.dataHasLoaded = true; // 必须设置为true，否则在lazyLoad为true的时候会陷入死循环
                    if (options.onError) {
                        self._toggleLoading('remove');
                        options.onError(XMLHttpRequest, textStatus, errorThrown);
                    } else {
                        self._toggleLoading('remove');
                        throw new Error('An error occurred while load records from URL "' + url + '",the error message is:' + errorThrown.message);
                    }
                }
            });
        },
        _loadData:function(records){
            var options = this.options,
                inputEl = this.element;
            options.dataSource = records;
            this.dataHasLoaded = true;
            //build all inputText
            var inputField = options.inputField;
            var allInputText = [];
            if (typeof inputField === 'string') {
                $(records).each(function(){
                    allInputText.push(this[inputField]);
                });
            } else {
                $(records).each(function(index){
                    allInputText.push(inputField(this, index));
                });
            }
            $.data(inputEl, 'allInputText', allInputText);
            //build all value
            var valueField = options.valueField;
            var allValues = [];
            if (typeof valueField === 'string') {
                $(records).each(function(){
                    allValues.push(this[valueField]);
                });
            } else {
                $(records).each(function(index){
                    allValues.push(valueField(this, index));
                });
            }
            $.data(inputEl, 'allValues', allValues);
            //build dropList
            var dropList = this.dropList.empty();
            if (options.listProvider) {
                var selectableOptions = options.listProvider(dropList, records);
                if (selectableOptions) {
                    selectableOptions.each(function(){
                        $(this).addClass('om-combo-list-row');
                    });
                }
            } else {
                var optionField = options.optionField;
                var innerHtml = '';
                var self = this;
                if (typeof optionField === 'string') {
                    $(records).each(function(index){
                        innerHtml += self._wrapText(this[options.optionField]);
                    });
                } else {
                    $(records).each(function(index){
                        innerHtml += self._wrapText(options.optionField(this, index));
                    });
                }
                if (innerHtml) {
                    $(innerHtml).appendTo(dropList);
                    dropList.show().css('height','auto');
                    if (options.listMaxHeight != 'auto' && dropList.height() > options.listMaxHeight) {
                        dropList.height(options.listMaxHeight).css('overflow-y','auto');
                    }
                    dropList.hide();
                    if(inputEl.parent().hasClass('om-state-hover')){
                        self._showDropList();
                    }
                }
            }
           
            if (options.value) {
                this._setValue(options.value);
            }
            this._bindEventsToList();
        },
        _bindEventsToList:function(){
            var items = this._getAllOptionsBeforeFiltered();
            var self = this;
            items.hover(function(){
                items.removeClass('om-state-hover');
                $(this).addClass('om-state-hover');
            }, function(){
                $(this).removeClass('om-state-hover');
            }).mousedown(function(){
                self._backfill(this);
            });
        },
        _wrapText:function(text) {
            return '<div class="om-combo-list-row">' + text + '</div>';
        },
        _setValue:function(value){
            var input = this.element;
            var valueChange = true ;
            var oldValue = input.attr(_valueKey);
            var options = this.options;
            if(value == oldValue){
                valueChange = false ;
            }
            var allValues = $.data(input, 'allValues');
            
            var inputText = [], values=[];
            if (options.multi) {
                values = value.split(options.multiSeparator);
            } else {
                values.push(value);
            }
            for (var i=0; i<values.length; i++) {
                var index = allValues.indexOf(values[i]);
                if (index > -1) {
                    inputText.push($.data(input, 'allInputText')[index]);
                } else {
                    input.attr(_valueKey, '').val('');
                    value = '';
                }
            }
            input.attr(_valueKey, value);
            if (options.multi) {
                input.val(inputText.join(this.options.multiSeparator));
            } else {
                input.val(inputText.join(''));
            }
            var options = this.options;
            options.value = value;
            // trigger onValueChange event
            if (options.onValueChange && valueChange) {
                options.onValueChange(input, value, oldValue);
            }
            //refresh the emptyText
            this._refeshEmptyText(options.emptyText);
        },
        
        _findHighlightItem : function() {
            var dropList = this.dropList;
            var hoverItem = dropList.find('.om-state-hover');
            
            // only one item hover
            if (hoverItem.length > 0) {
                return hoverItem;
            }
            var selectedItems = dropList.find('.om-combo-selected');
            return selectedItems.length > 0 ? selectedItems[0] : selectedItems;
        },
        
        _selectPrev:function(){
            var highLightItem = this._findHighlightItem();
            var all = this._getAllOptionsAfterFiltered();
            var nowIndex = all.index(highLightItem);
            var currentItem = $(all[nowIndex]);
            if (nowIndex === 0) {
                nowIndex = all.length;
            } else if (nowIndex == -1) {
                nowIndex = all.length;
            }
            var preNeighborItem = $(all[nowIndex - 1]);
            this._highLisghtAndScrollTo(currentItem,preNeighborItem);
        },
        _selectNext:function(){
            var dropList = this.dropList;
            if (dropList.css('display') == 'none') {
                this._showDropList();
                return;
            }
            var all = this._getAllOptionsAfterFiltered();
            var nowIndex = all.index(this._findHighlightItem());
            var currentItem = $(all[nowIndex]);
            if (nowIndex == all.length - 1) {
                nowIndex = -1;
            }
            var nextNeighbor = $(all[nowIndex + 1]);
            this._highLisghtAndScrollTo(currentItem,nextNeighbor);
        },
        _highLisghtAndScrollTo: function(currentItem, targetItem){
            var dropList = this.dropList;
            currentItem.removeClass('om-state-hover');
            targetItem.addClass('om-state-hover');
            if (targetItem.position().top <= 0) {
                dropList.scrollTop(dropList.scrollTop() + targetItem.position().top);
            } else if (targetItem.position().top + targetItem.outerHeight() > dropList.height()) {
                dropList.scrollTop(dropList.scrollTop() + targetItem.position().top + targetItem.outerHeight() - dropList.height());
            }
        },
        _backfill:function(source){
            var inputEl = this.element;
            var dropList = this.dropList;
            var options = this.options;
            var enableMulti = options.multi;
            
            if (enableMulti) {
                $(source).toggleClass('om-combo-selected').removeClass('om-state-hover');
            } else {
                this._getAllOptionsBeforeFiltered().removeClass('om-combo-selected');
                $(source).addClass('om-combo-selected');
            }
            
            if (dropList.css('display') == 'none') {
                return;
            }
            var value = [];
            var selectedIndexs = dropList.find('.om-combo-selected');
            for (var i=0; i<selectedIndexs.length; i++) {
                var nowIndex = $(selectedIndexs[i]).index();
                if (nowIndex > -1) {
                    value.push($.data(inputEl, 'allValues')[nowIndex]);
                }
            }
            
            this._setValue(value.join(enableMulti ? options.multiSeparator : ''));
            if (!enableMulti) {
                dropList.hide();
            }
        },
        _getAllOptionsBeforeFiltered:function(){
            return this.dropList.find('.om-combo-list-row');
        },
        _getAllOptionsAfterFiltered:function(){
            var dropList=this.dropList;
            return dropList.find('.om-combo-list-row').not(dropList.find('.om-helper-hidden'));
        },
        _doFilter:function(){
            var inputEl = this.element;
            var options = this.options;
            var records = options.dataSource;
            var filterStrategy = options.filterStrategy;
            var text = inputEl.val();
            var items = this._getAllOptionsBeforeFiltered();
            var allInputText = $.data(inputEl, 'allInputText');
            var self = this;
            var needShow=false;
            $(records).each(function(index){
                if (self._filetrPass(filterStrategy, text, records[index], allInputText[index])) {
                    $(items.get(index)).removeClass('om-helper-hidden');
                    needShow=true;
                } else {
                    $(items.get(index)).addClass('om-helper-hidden');
                }
            });
            var dropList = this.dropList.css('height','auto');
            //过滤后重新计算下拉框的高度，看是否需要出现滚动条
            if (options.listMaxHeight != 'auto' && dropList.height() > options.listMaxHeight) {
                dropList.height(options.listMaxHeight).css('overflow-y','auto');
            }
            if(!needShow){
                dropList.hide();
            }
        },
        _filetrPass:function(filterStrategy,text,record,inputText){
            if (text === '') {
                return true;
            }
            if (typeof filterStrategy === 'function') {
                return filterStrategy(text, record);
            } else {
                if (filterStrategy === 'first') {
                    return inputText.indexOf(text) === 0;
                } else if (filterStrategy === 'anywhere') {
                    return inputText.indexOf(text) > -1;
                } else if (filterStrategy === 'last') {
                    var i = inputText.lastIndexOf(text);
                    return i > -1 && i + text.length == inputText.length;
                } else {
                    return false;
                }
            }
        },
        _refeshEmptyText: function(emptyText){
            var inputEl = this.element;
            if(!emptyText)
                return;
            if (inputEl.val() === '') {
                inputEl.val(emptyText).addClass('om-empty-text');
            } else {
                if(inputEl.val() === emptyText){
                    inputEl.val('');
                }
                inputEl.removeClass('om-empty-text');
            }
        }
	});
})(jQuery);/*
 * $Id: om-dialog.js,v 1.20 2012/01/16 01:48:41 linxiaomin Exp $
 * operamasks-ui omDialog 1.0
 *
 * Copyright 2011, AUTHORS.txt (http://ui.operamasks.org/about)
 * Dual licensed under the MIT or GPL Version 2 licenses.
 * http://ui.operamasks.org/license
 *
 * http://ui.operamasks.org/docs/
 *
 * Depends:
 *  jquery.ui.core.js
 *  jquery.ui.widget.js
 *  jquery.ui.button.js
 *  om-draggable.js
 *  jquery.ui.mouse.js
 *  jquery.ui.position.js
 *  jquery.ui.resizable.js
 */
(function( $, undefined ) {

var uiDialogClasses =
		'om-dialog ' +
		'om-widget ' +
		'om-widget-content ' +
		'om-corner-all ',
	sizeRelatedOptions = {
		buttons: true,
		height: true,
		maxHeight: true,
		maxWidth: true,
		minHeight: true,
		minWidth: true,
		width: true
	},
	resizableRelatedOptions = {
		maxHeight: true,
		maxWidth: true,
		minHeight: true,
		minWidth: true
	},
	// support for jQuery 1.3.2 - handle common attrFn methods for dialog
	attrFn = $.attrFn || {
		val: true,
		css: true,
		html: true,
		text: true,
		data: true,
		width: true,
		height: true,
		offset: true,
		click: true
	};

	/**
     * @name omDialog
     * @class 对话框组件。可以放置html。<br/><br/>
     * <b>特点：</b><br/>
     * <ol>
     *      <li>方便地自定义按钮</li>
     * </ol>
     * 
     * <b>示例：</b><br/>
     * <pre>
     * &lt;script type="text/javascript" >
     * $(document).ready(function() {
     *     $('#dialog').omDialog({
     *     });
     * });
     * &lt;/script>
     * 
     * &lt;div id="dialog"/>
     * </pre>
     * 
     * @constructor
     * @description 构造函数. 
     * @param p 标准config对象：{}
     */
$.widget("om.omDialog", {
	options: /** @lends omDialog#*/ {
	    /**
         * 对话框创建完成后是否自动打开。
         * @type Boolean
         * @default true
         * @example
         *   $("#select").omDialog({autoOpen : true});
         */
		autoOpen: true,
		
		/**
         * 对话框中的按钮。此配置项为JSON数组。每个JSON对象具有 <code>text</code> 属性(配置按钮文字)
         * 和 <code>click</code> 属性配置按钮触发时的回调方法。
         * @type Array
         * @default []
         *  @example
         *   $("#select").omDialog({buttons : [{
         *      text : "确定", 
         *      click : function () {...}
         *  }, {
         *      text : "取消", 
         *      click : function () {...}
         *  }]);
         */
		buttons: {},
		
		/**
		 * 按下 Esc 键时是否关闭对话框。
		 * @type Boolean
		 * @default true
		 * @example
         *   $("#select").omDialog({closeOnEscape : true});
		 */
		closeOnEscape: true,
		closeText: 'close',
		
		/**
		 * 对话框的样式。
		 * @type String
		 * @default ''
		 * @example
         *   $("#select").omDialog({dialogClass : 'class1'});
		 */
		dialogClass: '',
		
		/**
		 * 组件是否可拖动。
		 * @type Boolean
		 * @default true
		 * @example
         *   $("#select").omDialog({draggable : true});
		 */
		draggable: true,
		
		hide: null,
		
		/**
		 * 组件的高度。
		 * @type Number
		 * @default 'auto'
		 * @example
         *   $("#select").omDialog({height : 200});
		 */
		height: 'auto',
		
		/**
		 * 可改变大小时组件最大高度。
		 * @type Number
		 * @default null
		 * @example
         *   $("#select").omDialog({maxHeight : 500});
		 */
		maxHeight: false,
		
		/**
		 * 可改变大小时组件最大宽度。
		 * @type Number
		 * @default null
		 * @example
         *   $("#select").omDialog({maxWidth : 500});
		 */
		maxWidth: false,
		
		/**
		 * 可改变大小时组件最小高度。
		 * @type Number
		 * @default 150
		 * @example
         *   $("#select").omDialog({minHeight : 150});
		 */
		minHeight: 150,
		
		/**
		 * 可改变大小时组件最小宽度。
		 * @type Number
		 * @default 150
		 * @example
         *   $("#select").omDialog({minWidth : 150});
		 */
		minWidth: 150,
		
		/**
		 * 是否模态窗口。
		 * @type Boolean
		 * @default false
		 * @example
         *   $("#select").omDialog({modal : true});
		 */
		modal: false,
		position: {
			my: 'center',
			at: 'center',
			collision: 'fit',
			// ensure that the titlebar is never outside the document
			using: function(pos) {
				var topOffset = $(this).css(pos).offset().top;
				if (topOffset < 0) {
					$(this).css('top', pos.top - topOffset);
				}
			}
		},
		
		/**
		 * 是否可改变大小。
		 * @type Boolean
		 * @default true
		 * @example
         *   $("#select").omDialog({resizable : true});
		 */
		resizable: true,
		show: null,
		
		stack: true,
		
		/**
		 * 对话框的标题。
		 * @type String
		 * @default ''
		 */
		title: '',
		
		/**
		 * 组件的宽度。
		 * @type Number
		 * @default 300
		 * @example
         *   $("#select").omDialog({width : 300});
		 */
		width: 300,
		zIndex: 1000
		
		/**
         * 对话框打开时触发事件。
         * @event
         * @name omDialog#onOpen
         * @type Function
         * @example
         *   $("#select").omDialog({onOpen : function() {doSomething...}});
         */
		
		/**
         * 对话框关闭时触发事件。
         * @event
         * @name omDialog#onClose
         * @type Function
         * @example
         *   $("#select").omDialog({onClose : function() {doSomething...}});
         */
		
		/**
         * 对话框关闭前触发事件。
         * @event
         * @name omDialog#onBeforeClose
         * @type Function
         * @example
         *   $("#select").omDialog({onBeforeClose : function() {doSomething...}});
         */
	},

	_create: function() {
		this.originalTitle = this.element.attr('title');
		// #5742 - .attr() might return a DOMElement
		if ( typeof this.originalTitle !== "string" ) {
			this.originalTitle = "";
		}

		this.options.title = this.options.title || this.originalTitle;
		var self = this,
			options = self.options,

			title = options.title || '&#160;',
			titleId = $.om.omDialog.getTitleId(self.element),

			uiDialog = (self.uiDialog = $('<div></div>'))
				.appendTo(document.body)
				.hide()
				.addClass(uiDialogClasses + options.dialogClass)
				.css({
					zIndex: options.zIndex
				})
				// setting tabIndex makes the div focusable
				// setting outline to 0 prevents a border on focus in Mozilla
				.attr('tabIndex', -1).css('outline', 0).keydown(function(event) {
					if (options.closeOnEscape && event.keyCode &&
						event.keyCode === $.ui.keyCode.ESCAPE) {
						
						self.close(event);
						event.preventDefault();
					}
				})
				.attr({
					role: 'dialog',
					'aria-labelledby': titleId
				})
				.mousedown(function(event) {
					self.moveToTop(false, event);
				}),

			uiDialogContent = self.element
				.show()
				.removeAttr('title')
				.addClass(
					'om-dialog-content ' +
					'om-widget-content')
				.appendTo(uiDialog),

			uiDialogTitlebar = (self.uiDialogTitlebar = $('<div></div>'))
				.addClass(
					'om-dialog-titlebar ' +
					'om-widget-header ' +
					'om-corner-all ' +
					'om-helper-clearfix'
				)
				.prependTo(uiDialog),

			uiDialogTitlebarClose = $('<a href="#"></a>')
				.addClass(
					'om-dialog-titlebar-close ' +
					'om-corner-all'
				)
				.attr('role', 'button')
				.hover(
					function() {
						uiDialogTitlebarClose.addClass('om-state-hover');
					},
					function() {
						uiDialogTitlebarClose.removeClass('om-state-hover');
					}
				)
				.focus(function() {
					uiDialogTitlebarClose.addClass('om-state-focus');
				})
				.blur(function() {
					uiDialogTitlebarClose.removeClass('om-state-focus');
				})
				.click(function(event) {
					self.close(event);
					return false;
				})
				.appendTo(uiDialogTitlebar),

			uiDialogTitlebarCloseText = (self.uiDialogTitlebarCloseText = $('<span></span>'))
				.addClass('om-icon-closethick')
				.text(options.closeText)
				.appendTo(uiDialogTitlebarClose),

			uiDialogTitle = $('<span></span>')
				.addClass('om-dialog-title')
				.attr('id', titleId)
				.html(title)
				.prependTo(uiDialogTitlebar);

		uiDialogTitlebar.find("*").add(uiDialogTitlebar).disableSelection();

		if (options.draggable && $.om.omDraggable) {
			self._makeDraggable();
		}
		if (options.resizable && $.fn.resizable) {
			self._makeResizable();
		}

		self._createButtons(options.buttons);
		self._isOpen = false;

		if ($.fn.bgiframe) {
			uiDialog.bgiframe();
		}
	},

	_init: function() {
		if ( this.options.autoOpen ) {
			this.open();
		}
	},

	destroy: function() {
		var self = this;
		
		if (self.overlay) {
			self.overlay.destroy();
		}
		self.uiDialog.hide();
		self.element
			.unbind('.dialog')
			.removeData('dialog')
			.removeClass('om-dialog-content om-widget-content')
			.hide().appendTo('body');
		self.uiDialog.remove();

		if (self.originalTitle) {
			self.element.attr('title', self.originalTitle);
		}

		return self;
	},

	widget: function() {
		return this.uiDialog;
	},

	/**
     * 关闭对话框.
     * @name omDialog#close
     * @function
     * @returns 支持链式操作，返回JQuery对象
     * @example
     * var store = $("#select").omDialog('close');
     * 
     */
	close: function(event) {
		var self = this,
			maxZ, thisZ,
			options = this.options,
			onBeforeClose = options.onBeforeClose,
			onClose = options.onClose;
		
		if (onBeforeClose && false === onBeforeClose.call(self.element, event)) {
			return;
		}

		if (self.overlay) {
			self.overlay.destroy();
		}
		self.uiDialog.unbind('keypress.om-dialog');

		self._isOpen = false;

		if (self.options.hide) {
			self.uiDialog.hide(self.options.hide, function() {
                onClose && onClose.call(self.element, event);
			});
		} else {
			self.uiDialog.hide();
			onClose && onClose.call(self.element, event);
		}

		$.om.omDialog.overlay.resize();

		// adjust the maxZ to allow other modal dialogs to continue to work (see #4309)
		if (self.options.modal) {
			maxZ = 0;
			$('.om-dialog').each(function() {
				if (this !== self.uiDialog[0]) {
					thisZ = $(this).css('z-index');
					if(!isNaN(thisZ)) {
						maxZ = Math.max(maxZ, thisZ);
					}
				}
			});
			$.om.omDialog.maxZ = maxZ;
		}

		return self;
	},

	/**
     * 判断对话框是否已打开。
     * @name omDialog#isOpen
     * @function
     * @returns 如果对话框已打开返回true，否则返回false
     * @example
     * var isOpen = $("#select").omDialog('isOpen');
     * 
     */
	isOpen: function() {
		return this._isOpen;
	},

	// the force parameter allows us to move modal dialogs to their correct
	// position on open
	moveToTop: function(force, event) {
		var self = this,
			options = self.options,
			saveScroll;

		if ((options.modal && !force) ||
			(!options.stack && !options.modal)) {
			return self._trigger('onFocus', event);
		}

		if (options.zIndex > $.om.omDialog.maxZ) {
			$.om.omDialog.maxZ = options.zIndex;
		}
		if (self.overlay) {
			$.om.omDialog.maxZ += 1;
			self.overlay.$el.css('z-index', $.om.omDialog.overlay.maxZ = $.om.omDialog.maxZ);
		}

		//Save and then restore scroll since Opera 9.5+ resets when parent z-Index is changed.
		//  http://ui.jquery.com/bugs/ticket/3193
		saveScroll = { scrollTop: self.element.scrollTop(), scrollLeft: self.element.scrollLeft() };
		$.om.omDialog.maxZ += 1;
		self.uiDialog.css('z-index', $.om.omDialog.maxZ);
		self.element.attr(saveScroll);
		self._trigger('onFocus', event);

		return self;
	},

	/**
     * 打开对话框。
     * @name omDialog#open
     * @function
     * @returns 支持链式操作，返回JQuery对象
     * @example
     * var store = $("#select").omDialog('open');
     * 
     */
	open: function() {
		if (this._isOpen) { return; }

		var self = this,
			options = self.options,
			uiDialog = self.uiDialog;

		self.overlay = options.modal ? new $.om.omDialog.overlay(self) : null;
		self._size();
		self._position(options.position);
		uiDialog.show(options.show);
		self.moveToTop(true);

		// prevent tabbing out of modal dialogs
		if (options.modal) {
			uiDialog.bind('keypress.om-dialog', function(event) {
				if (event.keyCode !== $.ui.keyCode.TAB) {
					return;
				}

				var tabbables = $(':tabbable', this),
					first = tabbables.filter(':first'),
					last  = tabbables.filter(':last');

				if (event.target === last[0] && !event.shiftKey) {
					first.focus(1);
					return false;
				} else if (event.target === first[0] && event.shiftKey) {
					last.focus(1);
					return false;
				}
			});
		}

		// set focus to the first tabbable element in the content area or the first button
		// if there are no tabbable elements, set focus on the dialog itself
		$(self.element.find(':tabbable').get().concat(
			uiDialog.find('.om-dialog-buttonpane :tabbable').get().concat(
				uiDialog.get()))).eq(0).focus();

		self._isOpen = true;
		var onOpen = options.onOpen;
		if(onOpen){
		    onOpen.call(self.element);
		}
		return self;
	},

	_createButtons: function(buttons) {
		var self = this,
			hasButtons = false,
			uiDialogButtonPane = $('<div></div>')
				.addClass(
					'om-dialog-buttonpane ' +
					'om-widget-content ' +
					'om-helper-clearfix'
				),
			uiButtonSet = $( "<div></div>" )
				.addClass( "om-dialog-buttonset" )
				.appendTo( uiDialogButtonPane );

		// if we already have a button pane, remove it
		self.uiDialog.find('.om-dialog-buttonpane').remove();

		if (typeof buttons === 'object' && buttons !== null) {
			$.each(buttons, function() {
				return !(hasButtons = true);
			});
		}
		if (hasButtons) {
			$.each(buttons, function(name, props) {
				props = $.isFunction( props ) ?
					{ click: props, text: name } :
					props;
				var button = $('<button type="button"></button>')
					.click(function() {
						props.click.apply(self.element[0], arguments);
					})
					.appendTo(uiButtonSet);
				// can't use .attr( props, true ) with jQuery 1.3.2.
				$.each( props, function( key, value ) {
					if ( key === "click" ) {
						return;
					}
					if ( key in attrFn ) {
						button[ key ]( value );
					} else {
						button.attr( key, value );
					}
				});
				if ($.fn.omButton) {
					button.omButton();
				}
			});
			uiDialogButtonPane.appendTo(self.uiDialog);
		}
	},

	_makeDraggable: function() {
		var self = this,
			options = self.options,
			doc = $(document),
			heightBeforeDrag;

		function filteredUi(ui) {
			return {
				position: ui.position,
				offset: ui.offset
			};
		}

		self.uiDialog.omDraggable({
			cancel: '.om-dialog-content, .om-dialog-titlebar-close',
			handle: '.om-dialog-titlebar',
			containment: 'document',
			cursor: 'move',
			onStart: function(event, ui) {
				heightBeforeDrag = options.height === "auto" ? "auto" : $(this).height();
				$(this).height($(this).height()).addClass("om-dialog-dragging");
				self._trigger('onDragStart', event, filteredUi(ui));
			},
			onDrag: function(event, ui) {
				self._trigger('onDrag', event, filteredUi(ui));
			},
			onStop: function(event, ui) {
				options.position = [ui.position.left - doc.scrollLeft(),
					ui.position.top - doc.scrollTop()];
				$(this).removeClass("om-dialog-dragging").height(heightBeforeDrag);
				self._trigger('onDragStop', event, filteredUi(ui));
				$.om.omDialog.overlay.resize();
			}
		});
	},

	_makeResizable: function(handles) {
		handles = (handles === undefined ? this.options.resizable : handles);
		var self = this,
			options = self.options,
			// .ui-resizable has position: relative defined in the stylesheet
			// but dialogs have to use absolute or fixed positioning
			position = self.uiDialog.css('position'),
			resizeHandles = (typeof handles === 'string' ?
				handles	:
				'n,e,s,w,se,sw,ne,nw'
			);

		function filteredUi(ui) {
			return {
				originalPosition: ui.originalPosition,
				originalSize: ui.originalSize,
				position: ui.position,
				size: ui.size
			};
		}

		self.uiDialog.resizable({
			cancel: '.om-dialog-content',
			containment: 'document',
			alsoResize: self.element,
			maxWidth: options.maxWidth,
			maxHeight: options.maxHeight,
			minWidth: options.minWidth,
			minHeight: self._minHeight(),
			handles: resizeHandles,
			start: function(event, ui) {
				$(this).addClass("om-dialog-resizing");
				self._trigger('onResizeStart', event, filteredUi(ui));
			},
			resize: function(event, ui) {
				self._trigger('onResize', event, filteredUi(ui));
			},
			stop: function(event, ui) {
				$(this).removeClass("om-dialog-resizing");
				options.height = $(this).height();
				options.width = $(this).width();
				self._trigger('onResizeStop', event, filteredUi(ui));
				$.om.omDialog.overlay.resize();
			}
		})
		.css('position', position)
		.find('.om-resizable-se').addClass('om-icon om-icon-grip-diagonal-se');
	},

	_minHeight: function() {
		var options = this.options;

		if (options.height === 'auto') {
			return options.minHeight;
		} else {
			return Math.min(options.minHeight, options.height);
		}
	},

	_position: function(position) {
		var myAt = [],
			offset = [0, 0],
			isVisible;

		if (position) {
			// deep extending converts arrays to objects in jQuery <= 1.3.2 :-(
	//		if (typeof position == 'string' || $.isArray(position)) {
	//			myAt = $.isArray(position) ? position : position.split(' ');

			if (typeof position === 'string' || (typeof position === 'object' && '0' in position)) {
				myAt = position.split ? position.split(' ') : [position[0], position[1]];
				if (myAt.length === 1) {
					myAt[1] = myAt[0];
				}

				$.each(['left', 'top'], function(i, offsetPosition) {
					if (+myAt[i] === myAt[i]) {
						offset[i] = myAt[i];
						myAt[i] = offsetPosition;
					}
				});

				position = {
					my: myAt.join(" "),
					at: myAt.join(" "),
					offset: offset.join(" ")
				};
			} 

			position = $.extend({}, $.om.omDialog.prototype.options.position, position);
		} else {
			position = $.om.omDialog.prototype.options.position;
		}

		// need to show the dialog to get the actual offset in the position plugin
		isVisible = this.uiDialog.is(':visible');
		if (!isVisible) {
			this.uiDialog.show();
		}
		this.uiDialog
			// workaround for jQuery bug #5781 http://dev.jquery.com/ticket/5781
			.css({ top: 0, left: 0 })
			.position($.extend({ of: window }, position));
		if (!isVisible) {
			this.uiDialog.hide();
		}
	},

	_setOptions: function( options ) {
		var self = this,
			resizableOptions = {},
			resize = false;

		$.each( options, function( key, value ) {
			self._setOption( key, value );
			
			if ( key in sizeRelatedOptions ) {
				resize = true;
			}
			if ( key in resizableRelatedOptions ) {
				resizableOptions[ key ] = value;
			}
		});

		if ( resize ) {
			this._size();
		}
		if ( this.uiDialog.is( ":data(resizable)" ) ) {
			this.uiDialog.resizable( "option", resizableOptions );
		}
	},

	_setOption: function(key, value){
		var self = this,
			uiDialog = self.uiDialog;

		switch (key) {
			case "buttons":
				self._createButtons(value);
				break;
			case "closeText":
				// ensure that we always pass a string
				self.uiDialogTitlebarCloseText.text("" + value);
				break;
			case "dialogClass":
				uiDialog
					.removeClass(self.options.dialogClass)
					.addClass(uiDialogClasses + value);
				break;
			case "disabled":
				if (value) {
					uiDialog.addClass('om-dialog-disabled');
				} else {
					uiDialog.removeClass('om-dialog-disabled');
				}
				break;
			case "draggable":
				var isDraggable = uiDialog.is( ":data(draggable)" );
				if ( isDraggable && !value ) {
					uiDialog.omDraggable( "destroy" );
				}
				
				if ( !isDraggable && value ) {
					self._makeDraggable();
				}
				break;
			case "position":
				self._position(value);
				break;
			case "resizable":
				// currently resizable, becoming non-resizable
				var isResizable = uiDialog.is( ":data(resizable)" );
				if (isResizable && !value) {
					uiDialog.resizable('destroy');
				}

				// currently resizable, changing handles
				if (isResizable && typeof value === 'string') {
					uiDialog.resizable('option', 'handles', value);
				}

				// currently non-resizable, becoming resizable
				if (!isResizable && value !== false) {
					self._makeResizable(value);
				}
				break;
			case "title":
				// convert whatever was passed in o a string, for html() to not throw up
				$(".om-dialog-title", self.uiDialogTitlebar).html("" + (value || '&#160;'));
				break;
		}

		$.Widget.prototype._setOption.apply(self, arguments);
	},

	_size: function() {
		/* If the user has resized the dialog, the .ui-dialog and .ui-dialog-content
		 * divs will both have width and height set, so we need to reset them
		 */
		var options = this.options,
			nonContentHeight,
			minContentHeight,
			isVisible = this.uiDialog.is( ":visible" );

		// reset content sizing
		this.element.show().css({
			width: 'auto',
			minHeight: 0,
			height: 0
		});

		if (options.minWidth > options.width) {
			options.width = options.minWidth;
		}

		// reset wrapper sizing
		// determine the height of all the non-content elements
		nonContentHeight = this.uiDialog.css({
				height: 'auto',
				width: options.width
			})
			.height();
		minContentHeight = Math.max( 0, options.minHeight - nonContentHeight );
		
		if ( options.height === "auto" ) {
			// only needed for IE6 support
			if ( $.support.minHeight ) {
				this.element.css({
					minHeight: minContentHeight,
					height: "auto"
				});
			} else {
				this.uiDialog.show();
				var autoHeight = this.element.css( "height", "auto" ).height();
				if ( !isVisible ) {
					this.uiDialog.hide();
				}
				this.element.height( Math.max( autoHeight, minContentHeight ) );
			}
		} else {
			this.element.height( Math.max( options.height - nonContentHeight, 0 ) );
		}

		if (this.uiDialog.is(':data(resizable)')) {
			this.uiDialog.resizable('option', 'minHeight', this._minHeight());
		}
	}
});

$.extend($.om.omDialog, {
	version: "1.0",

	uuid: 0,
	maxZ: 0,

	getTitleId: function($el) {
		var id = $el.attr('id');
		if (!id) {
			this.uuid += 1;
			id = this.uuid;
		}
		return 'ui-dialog-title-' + id;
	},

	overlay: function(dialog) {
		this.$el = $.om.omDialog.overlay.create(dialog);
	}
});

$.extend($.om.omDialog.overlay, {
	instances: [],
	// reuse old instances due to IE memory leak with alpha transparency (see #5185)
	oldInstances: [],
	maxZ: 0,
	events: $.map('focus,mousedown,mouseup,keydown,keypress,click'.split(','),
		function(event) { return event + '.dialog-overlay'; }).join(' '),
	create: function(dialog) {
		if (this.instances.length === 0) {
			// prevent use of anchors and inputs
			// we use a setTimeout in case the overlay is created from an
			// event that we're going to be cancelling (see #2804)
			setTimeout(function() {
				// handle $(el).dialog().dialog('close') (see #4065)
				if ($.om.omDialog.overlay.instances.length) {
					$(document).bind($.om.omDialog.overlay.events, function(event) {
						// stop events if the z-index of the target is < the z-index of the overlay
						// we cannot return true when we don't want to cancel the event (#3523)
						if ($(event.target).zIndex() < $.om.omDialog.overlay.maxZ) {
							return false;
						}
					});
				}
			}, 1);

			// allow closing by pressing the escape key
			$(document).bind('keydown.dialog-overlay', function(event) {
				if (dialog.options.closeOnEscape && event.keyCode &&
					event.keyCode === $.ui.keyCode.ESCAPE) {
					
					dialog.close(event);
					event.preventDefault();
				}
			});

			// handle window resize
			$(window).bind('resize.dialog-overlay', $.om.omDialog.overlay.resize);
		}

		var $el = (this.oldInstances.pop() || $('<div></div>').addClass('om-widget-overlay'))
			.appendTo(document.body)
			.css({
				width: this.width(),
				height: this.height()
			});

		if ($.fn.bgiframe) {
			$el.bgiframe();
		}

		this.instances.push($el);
		return $el;
	},

	destroy: function($el) {
		var indexOf = $.inArray($el, this.instances);
		if (indexOf != -1){
			this.oldInstances.push(this.instances.splice(indexOf, 1)[0]);
		}

		if (this.instances.length === 0) {
			$([document, window]).unbind('.dialog-overlay');
		}

		$el.remove();
		
		// adjust the maxZ to allow other modal dialogs to continue to work (see #4309)
		var maxZ = 0;
		$.each(this.instances, function() {
			maxZ = Math.max(maxZ, this.css('z-index'));
		});
		this.maxZ = maxZ;
	},

	height: function() {
		var scrollHeight,
			offsetHeight;
		// handle IE 6
		if ($.browser.msie && $.browser.version < 7) {
			scrollHeight = Math.max(
				document.documentElement.scrollHeight,
				document.body.scrollHeight
			);
			offsetHeight = Math.max(
				document.documentElement.offsetHeight,
				document.body.offsetHeight
			);

			if (scrollHeight < offsetHeight) {
				return $(window).height() + 'px';
			} else {
				return scrollHeight + 'px';
			}
		// handle "good" browsers
		} else {
			return $(document).height() + 'px';
		}
	},

	width: function() {
		var scrollWidth,
			offsetWidth;
		// handle IE
		if ( $.browser.msie ) {
			scrollWidth = Math.max(
				document.documentElement.scrollWidth,
				document.body.scrollWidth
			);
			offsetWidth = Math.max(
				document.documentElement.offsetWidth,
				document.body.offsetWidth
			);

			if (scrollWidth < offsetWidth) {
				return $(window).width() + 'px';
			} else {
				return scrollWidth + 'px';
			}
		// handle "good" browsers
		} else {
			return $(document).width() + 'px';
		}
	},

	resize: function() {
		/* If the dialog is draggable and the user drags it past the
		 * right edge of the window, the document becomes wider so we
		 * need to stretch the overlay. If the user then drags the
		 * dialog back to the left, the document will become narrower,
		 * so we need to shrink the overlay to the appropriate size.
		 * This is handled by shrinking the overlay before setting it
		 * to the full document size.
		 */
		var $overlays = $([]);
		$.each($.om.omDialog.overlay.instances, function() {
			$overlays = $overlays.add(this);
		});

		$overlays.css({
			width: 0,
			height: 0
		}).css({
			width: $.om.omDialog.overlay.width(),
			height: $.om.omDialog.overlay.height()
		});
	}
});

$.extend($.om.omDialog.overlay.prototype, {
	destroy: function() {
		$.om.omDialog.overlay.destroy(this.$el);
	}
});

}(jQuery));
/*
 * $Id: om-draggable.js,v 1.7 2012/01/16 01:48:41 linxiaomin Exp $
 * operamasks-ui omTree 1.0
 *
 * Copyright 2011, AUTHORS.txt (http://ui.operamasks.org/about)
 * Dual licensed under the MIT or GPL Version 2 licenses.
 * http://ui.operamasks.org/license
 *
 * http://ui.operamasks.org/docs/
 *
 * Depends:
 *	jquery.ui.core.js
 *	jquery.ui.mouse.js
 *	jquery.ui.widget.js
 */
/** 
     * @name omDraggable
     * @class 用来提供拖动功能.<br/>
     * <b>特点：</b><br/>
     * <ol>
     * 		<li>轻量级，简单易用</li>
     * 		<li>可限制拖动的范围及方向</li>
     * 		<li>可自定义鼠标在拖动时的样式</li>
     * </ol>
     * <b>示例：</b><br/>
     * <pre>
     * &lt;script type="text/javascript" &gt;
     * $(document).ready(function() {
     *     $('#selector').omDraggable();
     * });
     * &lt;/script&gt;
     * 
     * &lt;div id="selector"&gt;
	 * &lt;/div&gt;
	 * </pre>
     * @constructor
     * @description 构造函数. 
     * @param p 标准config对象：{}
     */
;(function( $, undefined ) {

$.widget("om.omDraggable", $.ui.mouse, {
	widgetEventPrefix: "drag",
	options: {
		/**
         * 指定拖动的方向,提供的取值有“x”，“y”，默认不指定方向，可以任意拖动。
         * @name omDraggable#axis
         * @type String
         * @default 无
         * @example
         * //只能沿着x轴的方向拖动
         * $("#selector").omDraggable({axis:"x"});
         */
		axis: false,
		/**
         * 设置拖动的范围,不能拖动到该范围以外的地方，默认不指定拖动的范围，可以任意拖动。
         * 其值可以是：“parent”、“document”、“window”、[x1,y1,x2,y2]等。
         * @name omDraggable#containment
         * @type Selector,Element,String,Array
         * @default 无
         * @example
         * //只能在上一级父元素范围内拖动
         * $("#selector").omDraggable({containment:"parent"});
         */
		containment: false,
		/**
         * 设置鼠标拖动时的样式。其值为CSS中cursor属性的取值。
         * @name omDraggable#cursor
         * @type String
         * @default “auto”
         * @example
         * //拖动元素时，鼠标呈现十字状
         * $("#selector").omDraggable({cursor:"crosshair"});
         */
		cursor: "auto",
		/**
         * 不能启动拖动操作的区域。
         * @name omDraggable#cancel
         * @type Selector
         * @default :input,option
         * @example
         * //$("#selector")的子元素的&lt;p /&gt不能能够启动拖动操作
         * $("#selector").omDraggable({cancel:"p"});
         */
		_scope:"default",
		/**
         * 能够启动拖动操作的区域，默认不指定区域，拖动元素内的所有区域都可以启动拖动操作。
         * @name omDraggable#handle
         * @type Selector
         * @default 无
         * @example
         * //只有$("#selector")的子元素的&lt;p /&gt内才能够启动拖动操作
         * $("#selector").omDraggable({handle:"p"});
         */
		handle: false,
		/**
         * 提供一个辅助的元素作为元素被拖动时的展现，默认为被拖动元素本身作为拖动时的展现元素。
         * @name omDraggable#helper
         * @type String,function
         * @default "original"
         * @example
         * //$("#selector")的clone元素将作为辅助元素
         * $("#selector").omDraggable({helper:"clone"});
         */
		helper: "original",
		/**
         * 设置当拖动结束后，元素是否会返回到初始位置。默认为false，不会返回；反之为true时，返回到初始位置。
         * String类型的取值有：“valid”，“invalid”。如果该值为“invalid”，则当元素没有拖动到目的位置时返回；反之为“valid”
         * 时，当元素拖动到目的位置返回。
         * @name omDraggable#revert
         * @type Boolean,String
         * @default false
         * @example
         * //元素没有拖动到目的位置时，返回到原位。
         * $("#selector").omDraggable({revert:"invalid"});
         */
		revert: false,
		/**
		 * 是否可拖动。
		 * @name omDraggable#disabled
         * @type Boolean
         * @default false
         * @example
         * //元素不可拖动
         * $("#selector").omDraggable({disabled:true});
         */

		/**
		 * 拖动元素时，是否自动滚屏。
		 * @name omDraggable#scroll
         * @type Boolean
         * @default true
         * @example
         * //拖动元素时，不自动滚屏
         * $("#selector").omDraggable({scroll:false});
         */
		scroll: true
		
		/**
         * 开始拖动时触发事件。其中参数ui为Objec对象，包括四个属性：helper，position(当前位置)，
         * originalPosition(原始位置)，offset(偏移量)。
         * @event
         * @name omDraggable#onStart
         * @type Function
         * @example
         *   $("#selector").omDraggable({onStart : function(event, ui) {doSomething...}});
         */
		
		/**
         * 拖动时触发事件，当返回为false时，将取消拖动操作。其中参数ui为Objec对象，包括四个属性：helper，
         * position(当前位置)，originalPosition(原始位置)，offset(偏移量)。
         * @event
         * @name omDraggable#onDrag
         * @type Function
         * @example
         *   $("#selector").omDraggable({onDrag : function(event, ui) {doSomething...}});
         */
		
		/**
         * 停止拖动时触发事件。其中参数ui为Objec对象，包括四个属性：helper，
         * position(当前位置)，originalPosition(原始位置)，offset(偏移量)。
         * @event
         * @name omDraggable#onStop
         * @type Function
         * @example
         *   $("#selector").omDraggable({onStop : function(event, ui) {doSomething...}});
         */
	},
	_create: function() {

		if (this.options.helper == 'original' && !(/^(?:r|a|f)/).test(this.element.css("position")))
			this.element[0].style.position = 'relative';

		this.element.addClass("om-draggable");
		(this.options.disabled && this.element.addClass("om-draggable-disabled"));

		this._mouseInit();

	},
	/**
     * 拖动功能不可用.
     * @name omDraggable#disable
     * @function
     * @example
     * $("#selector").omDraggable('disable');
     * 
     */
	
	/**
     * 拖动功能可用.
     * @name omDraggable#enable
     * @function
     * @example
     * $("#selector").omDraggable('enable');
     * 
     */

	/**
     * 删除元素的拖动功能.
     * @name omDraggable#destroy
     * @function
     * @returns JQuery对象
     * @example
     * var $selector = $("#selector").omDraggable('destroy');
     * 
     */
	destroy: function() {
		if(!this.element.data('omDraggable')) return;
		this.element
			.removeData("omDraggable")
			.unbind(".draggable")
			.removeClass("om-draggable"
				+ " om-draggable-dragging"
				+ " om-draggable-disabled");
		this._mouseDestroy();

		return this;
	},

	_mouseCapture: function(event) {

		var o = this.options;

		// among others, prevent a drag on a resizable-handle
		if (this.helper || o.disabled || $(event.target).is('.om-resizable-handle'))
			return false;

		//Quit if we're not on a valid handle
		this.handle = this._getHandle(event);
		if (!this.handle)
			return false;
		return true;

	},

	_mouseStart: function(event) {

		var o = this.options;

		//Create and append the visible helper
		this.helper = this._createHelper(event);

		//Cache the helper size
		this._cacheHelperProportions();

		//If ddmanager is used for droppables, set the global draggable
		if($.ui.ddmanager)
			$.ui.ddmanager.current = this;

		/*
		 * - Position generation -
		 * This block generates everything position related - it's the core of draggables.
		 */

		//Cache the margins of the original element
		this._cacheMargins();

		//Store the helper's css position
		this.cssPosition = this.helper.css("position");
		this.scrollParent = this.helper.scrollParent();

		//The element's absolute position on the page minus margins
		this.offset = this.positionAbs = this.element.offset();
		this.offset = {
			top: this.offset.top - this.margins.top,
			left: this.offset.left - this.margins.left
		};

		$.extend(this.offset, {
			click: { //Where the click happened, relative to the element
				left: event.pageX - this.offset.left,
				top: event.pageY - this.offset.top
			},
			parent: this._getParentOffset(),
			relative: this._getRelativeOffset() //This is a relative to absolute position minus the actual position calculation - only used for relative positioned helper
		});

		//Generate the original position
		this.originalPosition = this.position = this._generatePosition(event);
		this.originalPageX = event.pageX;
		this.originalPageY = event.pageY;

		//Set a containment if given in the options
		if(o.containment)
			this._setContainment();

		//Trigger event + callbacks
		if(this._trigger("onStart", event) === false) {
			this._clear();
			return false;
		}

		//Recache the helper size
		this._cacheHelperProportions();

		//Prepare the droppable offsets
		if ($.ui.ddmanager && !o.dropBehaviour)
			$.ui.ddmanager.prepareOffsets(this, event);

		this.helper.addClass("om-draggable-dragging");
		this._mouseDrag(event, true); //Execute the drag once - this causes the helper not to be visible before getting its correct position
		
		//If the ddmanager is used for droppables, inform the manager that dragging has started (see #5003)
		if ( $.ui.ddmanager ) $.ui.ddmanager.dragStart(this, event);
		
		return true;
	},

	_mouseDrag: function(event, noPropagation) {

		//Compute the helpers position
		this.position = this._generatePosition(event);
		this.positionAbs = this._convertPositionTo("absolute");

		//Call plugins and callbacks and use the resulting position if something is returned
		if (!noPropagation) {
			var ui = this._uiHash();
			if(this._trigger('onDrag', event, ui) === false) {
				this._mouseUp({});
				return false;
			}
			this.position = ui.position;
		}

		if(!this.options.axis || this.options.axis != "y") this.helper[0].style.left = this.position.left+'px';
		if(!this.options.axis || this.options.axis != "x") this.helper[0].style.top = this.position.top+'px';
		if($.ui.ddmanager) $.ui.ddmanager.drag(this, event);

		return false;
	},

	_mouseStop: function(event) {

		//If we are using droppables, inform the manager about the drop
		var dropped = false;
		if ($.ui.ddmanager && !this.options.dropBehaviour)
			dropped = $.ui.ddmanager.drop(this, event);

		//if a drop comes from outside (a sortable)
		if(this.dropped) {
			dropped = this.dropped;
			this.dropped = false;
		}
		
		//if the original element is removed, don't bother to continue if helper is set to "original"
		if((!this.element[0] || !this.element[0].parentNode) && this.options.helper == "original")
			return false;

		if((this.options.revert == "invalid" && !dropped) || (this.options.revert == "valid" && dropped) || this.options.revert === true || ($.isFunction(this.options.revert) && this.options.revert.call(this.element, dropped))) {
			var self = this;
			$(this.helper).animate(this.originalPosition, 500, function() {
				if(self._trigger("onStop", event) !== false) {
					self._clear();
				}
			});
		} else {
			if(this._trigger("onStop", event) !== false) {
				this._clear();
			}
		}

		return false;
	},
	
	_mouseUp: function(event) {
		//If the ddmanager is used for droppables, inform the manager that dragging has stopped (see #5003)
		if( $.ui.ddmanager ) $.ui.ddmanager.dragStop(this, event);
		
		return $.ui.mouse.prototype._mouseUp.call(this, event);
	},
	
	cancel: function() {
		
		if(this.helper.is(".om-draggable-dragging")) {
			this._mouseUp({});
		} else {
			this._clear();
		}
		
		return this;
		
	},

	_getHandle: function(event) {

		var handle = !this.options.handle || !$(this.options.handle, this.element).length ? true : false;
		$(this.options.handle, this.element)
			.find("*")
			.andSelf()
			.each(function() {
				if(this == event.target) handle = true;
			});

		return handle;

	},

	_createHelper: function(event) {

		var o = this.options;
		var helper = $.isFunction(o.helper) ? $(o.helper.apply(this.element[0], [event])) : (o.helper == 'clone' ? this.element.clone().removeAttr('id') : this.element);

		if(!helper.parents('body').length)
			helper.appendTo( this.element[0].parentNode);

		if(helper[0] != this.element[0] && !(/(fixed|absolute)/).test(helper.css("position")))
			helper.css("position", "absolute");

		return helper;

	},

	

	_getParentOffset: function() {

		//Get the offsetParent and cache its position
		this.offsetParent = this.helper.offsetParent();
		var po = this.offsetParent.offset();

		// This is a special case where we need to modify a offset calculated on start, since the following happened:
		// 1. The position of the helper is absolute, so it's position is calculated based on the next positioned parent
		// 2. The actual offset parent is a child of the scroll parent, and the scroll parent isn't the document, which means that
		//    the scroll is included in the initial calculation of the offset of the parent, and never recalculated upon drag
		if(this.cssPosition == 'absolute' && this.scrollParent[0] != document && $.ui.contains(this.scrollParent[0], this.offsetParent[0])) {
			po.left += this.scrollParent.scrollLeft();
			po.top += this.scrollParent.scrollTop();
		}

		if((this.offsetParent[0] == document.body) //This needs to be actually done for all browsers, since pageX/pageY includes this information
		|| (this.offsetParent[0].tagName && this.offsetParent[0].tagName.toLowerCase() == 'html' && $.browser.msie)) //Ugly IE fix
			po = { top: 0, left: 0 };

		return {
			top: po.top + (parseInt(this.offsetParent.css("borderTopWidth"),10) || 0),
			left: po.left + (parseInt(this.offsetParent.css("borderLeftWidth"),10) || 0)
		};

	},

	_getRelativeOffset: function() {

		if(this.cssPosition == "relative") {
			var p = this.element.position();
			return {
				top: p.top - (parseInt(this.helper.css("top"),10) || 0) + this.scrollParent.scrollTop(),
				left: p.left - (parseInt(this.helper.css("left"),10) || 0) + this.scrollParent.scrollLeft()
			};
		} else {
			return { top: 0, left: 0 };
		}

	},

	_cacheMargins: function() {
		this.margins = {
			left: (parseInt(this.element.css("marginLeft"),10) || 0),
			top: (parseInt(this.element.css("marginTop"),10) || 0),
			right: (parseInt(this.element.css("marginRight"),10) || 0),
			bottom: (parseInt(this.element.css("marginBottom"),10) || 0)
		};
	},

	_cacheHelperProportions: function() {
		this.helperProportions = {
			width: this.helper.outerWidth(),
			height: this.helper.outerHeight()
		};
	},

	_setContainment: function() {

		var o = this.options;
		if(o.containment == 'parent') o.containment = this.helper[0].parentNode;
		if(o.containment == 'document' || o.containment == 'window') this.containment = [
			o.containment == 'document' ? 0 : $(window).scrollLeft() - this.offset.relative.left - this.offset.parent.left,
			o.containment == 'document' ? 0 : $(window).scrollTop() - this.offset.relative.top - this.offset.parent.top,
			(o.containment == 'document' ? 0 : $(window).scrollLeft()) + $(o.containment == 'document' ? document : window).width() - this.helperProportions.width - this.margins.left,
			(o.containment == 'document' ? 0 : $(window).scrollTop()) + ($(o.containment == 'document' ? document : window).height() || document.body.parentNode.scrollHeight) - this.helperProportions.height - this.margins.top
		];

		if(!(/^(document|window|parent)$/).test(o.containment) && o.containment.constructor != Array) {
		        var c = $(o.containment);
			var ce = c[0]; if(!ce) return;
			var co = c.offset();
			var over = ($(ce).css("overflow") != 'hidden');

			this.containment = [
				(parseInt($(ce).css("borderLeftWidth"),10) || 0) + (parseInt($(ce).css("paddingLeft"),10) || 0),
				(parseInt($(ce).css("borderTopWidth"),10) || 0) + (parseInt($(ce).css("paddingTop"),10) || 0),
				(over ? Math.max(ce.scrollWidth,ce.offsetWidth) : ce.offsetWidth) - (parseInt($(ce).css("borderLeftWidth"),10) || 0) - (parseInt($(ce).css("paddingRight"),10) || 0) - this.helperProportions.width - this.margins.left - this.margins.right,
				(over ? Math.max(ce.scrollHeight,ce.offsetHeight) : ce.offsetHeight) - (parseInt($(ce).css("borderTopWidth"),10) || 0) - (parseInt($(ce).css("paddingBottom"),10) || 0) - this.helperProportions.height - this.margins.top  - this.margins.bottom
			];
			this.relative_container = c;

		} else if(o.containment.constructor == Array) {
			this.containment = o.containment;
		}

	},

	_convertPositionTo: function(d, pos) {

		if(!pos) pos = this.position;
		var mod = d == "absolute" ? 1 : -1;
		var o = this.options, scroll = this.cssPosition == 'absolute' && !(this.scrollParent[0] != document && $.ui.contains(this.scrollParent[0], this.offsetParent[0])) ? this.offsetParent : this.scrollParent, scrollIsRootNode = (/(html|body)/i).test(scroll[0].tagName);

		return {
			top: (
				pos.top																	// The absolute mouse position
				+ this.offset.relative.top * mod										// Only for relative positioned nodes: Relative offset from element to offset parent
				+ this.offset.parent.top * mod											// The offsetParent's offset without borders (offset + border)
				- ($.browser.safari && $.browser.version < 526 && this.cssPosition == 'fixed' ? 0 : ( this.cssPosition == 'fixed' ? -this.scrollParent.scrollTop() : ( scrollIsRootNode ? 0 : scroll.scrollTop() ) ) * mod)
			),
			left: (
				pos.left																// The absolute mouse position
				+ this.offset.relative.left * mod										// Only for relative positioned nodes: Relative offset from element to offset parent
				+ this.offset.parent.left * mod											// The offsetParent's offset without borders (offset + border)
				- ($.browser.safari && $.browser.version < 526 && this.cssPosition == 'fixed' ? 0 : ( this.cssPosition == 'fixed' ? -this.scrollParent.scrollLeft() : scrollIsRootNode ? 0 : scroll.scrollLeft() ) * mod)
			)
		};

	},

	_generatePosition: function(event) {

		var o = this.options, scroll = this.cssPosition == 'absolute' && !(this.scrollParent[0] != document && $.ui.contains(this.scrollParent[0], this.offsetParent[0])) ? this.offsetParent : this.scrollParent, scrollIsRootNode = (/(html|body)/i).test(scroll[0].tagName);
		var pageX = event.pageX;
		var pageY = event.pageY;

		/*
		 * - Position constraining -
		 * Constrain the position to a mix of grid, containment.
		 */

		if(this.originalPosition) { //If we are not dragging yet, we won't check for options
		         var containment;
		         if(this.containment) {
				 if (this.relative_container){
				     var co = this.relative_container.offset();
				     containment = [ this.containment[0] + co.left,
						     this.containment[1] + co.top,
						     this.containment[2] + co.left,
						     this.containment[3] + co.top ];
				 }
				 else {
				     containment = this.containment;
				 }

				if(event.pageX - this.offset.click.left < containment[0]) pageX = containment[0] + this.offset.click.left;
				if(event.pageY - this.offset.click.top < containment[1]) pageY = containment[1] + this.offset.click.top;
				if(event.pageX - this.offset.click.left > containment[2]) pageX = containment[2] + this.offset.click.left;
				if(event.pageY - this.offset.click.top > containment[3]) pageY = containment[3] + this.offset.click.top;
			}

		}

		return {
			top: (
				pageY																// The absolute mouse position
				- this.offset.click.top													// Click offset (relative to the element)
				- this.offset.relative.top												// Only for relative positioned nodes: Relative offset from element to offset parent
				- this.offset.parent.top												// The offsetParent's offset without borders (offset + border)
				+ ($.browser.safari && $.browser.version < 526 && this.cssPosition == 'fixed' ? 0 : ( this.cssPosition == 'fixed' ? -this.scrollParent.scrollTop() : ( scrollIsRootNode ? 0 : scroll.scrollTop() ) ))
			),
			left: (
				pageX																// The absolute mouse position
				- this.offset.click.left												// Click offset (relative to the element)
				- this.offset.relative.left												// Only for relative positioned nodes: Relative offset from element to offset parent
				- this.offset.parent.left												// The offsetParent's offset without borders (offset + border)
				+ ($.browser.safari && $.browser.version < 526 && this.cssPosition == 'fixed' ? 0 : ( this.cssPosition == 'fixed' ? -this.scrollParent.scrollLeft() : scrollIsRootNode ? 0 : scroll.scrollLeft() ))
			)
		};

	},

	_clear: function() {
		this.helper.removeClass("om-draggable-dragging");
		if(this.helper[0] != this.element[0] && !this.cancelHelperRemoval) this.helper.remove();
		//if($.ui.ddmanager) $.ui.ddmanager.current = null;
		this.helper = null;
		this.cancelHelperRemoval = false;
	},

	// From now on bulk stuff - mainly helpers

	_trigger: function(type, event, ui) {
		ui = ui || this._uiHash();
		$.ui.plugin.call(this, type, [event, ui]);
		if(type == "onDrag") this.positionAbs = this._convertPositionTo("absolute"); //The absolute position has to be recalculated after plugins
		return $.Widget.prototype._trigger.call(this, type, event, ui);
	},

	plugins: {},

	_uiHash: function(event) {
		return {
			helper: this.helper,
			position: this.position,
			originalPosition: this.originalPosition,
			offset: this.positionAbs
		};
	}

});

$.ui.plugin.add("omDraggable", "cursor", {
	onStart: function(event, ui) {
		var t = $('body'), o = $(this).data('omDraggable').options;
		if (t.css("cursor")) o._cursor = t.css("cursor");
		t.css("cursor", o.cursor);
	},
	onStop: function(event, ui) {
	    var drag = $(this).data('omDraggable');
	    if(drag){
	        var o = drag.options;
	        if (o._cursor) $('body').css("cursor", o._cursor);
	    }
	}
});

$.ui.plugin.add("omDraggable", "scroll", {
	onStart: function(event, ui) {
		var i = $(this).data("omDraggable");
		if(i.scrollParent[0] != document && i.scrollParent[0].tagName != 'HTML') i.overflowOffset = i.scrollParent.offset();
	},
	onDrag: function(event, ui) {
		
		var i = $(this).data("omDraggable"), o = i.options, scrolled = false, scrollSensitivity = 20, scrollSpeed = 20;

		if(i.scrollParent[0] != document && i.scrollParent[0].tagName != 'HTML') {

			if(!o.axis || o.axis != 'x') {
				if((i.overflowOffset.top + i.scrollParent[0].offsetHeight) - event.pageY < scrollSensitivity)
					i.scrollParent[0].scrollTop = scrolled = i.scrollParent[0].scrollTop + scrollSpeed;
				else if(event.pageY - i.overflowOffset.top < scrollSensitivity)
					i.scrollParent[0].scrollTop = scrolled = i.scrollParent[0].scrollTop - scrollSpeed;
			}

			if(!o.axis || o.axis != 'y') {
				if((i.overflowOffset.left + i.scrollParent[0].offsetWidth) - event.pageX < scrollSensitivity)
					i.scrollParent[0].scrollLeft = scrolled = i.scrollParent[0].scrollLeft + scrollSpeed;
				else if(event.pageX - i.overflowOffset.left < scrollSensitivity)
					i.scrollParent[0].scrollLeft = scrolled = i.scrollParent[0].scrollLeft - scrollSpeed;
			}

		} else {

			if(!o.axis || o.axis != 'x') {
				if(event.pageY - $(document).scrollTop() < scrollSensitivity)
					scrolled = $(document).scrollTop($(document).scrollTop() - scrollSpeed);
				else if($(window).height() - (event.pageY - $(document).scrollTop()) < scrollSensitivity)
					scrolled = $(document).scrollTop($(document).scrollTop() + scrollSpeed);
			}

			if(!o.axis || o.axis != 'y') {
				if(event.pageX - $(document).scrollLeft() < scrollSensitivity)
					scrolled = $(document).scrollLeft($(document).scrollLeft() - scrollSpeed);
				else if($(window).width() - (event.pageX - $(document).scrollLeft()) < scrollSensitivity)
					scrolled = $(document).scrollLeft($(document).scrollLeft() + scrollSpeed);
			}

		}

		if(scrolled !== false && $.ui.ddmanager && !o.dropBehaviour)
			$.ui.ddmanager.prepareOffsets(i, event);

	}
});

})(jQuery);
/*
 * $Id: om-droppable.js,v 1.4 2012/01/16 01:48:41 linxiaomin Exp $
 * operamasks-ui omTree 1.0
 *
 * Copyright 2011, AUTHORS.txt (http://ui.operamasks.org/about)
 * Dual licensed under the MIT or GPL Version 2 licenses.
 * http://ui.operamasks.org/license
 *
 * http://ui.operamasks.org/docs/
 *
 * Depends:
 *	jquery.ui.core.js
 *	jquery.ui.widget.js
 *	jquery.ui.mouse.js
 *	om-draggable.js
 */
/** 
     * @name omDroppable
     * @class 用来提供放置功能.<br/>
     * <b>特点：</b><br/>
     * <ol>
     * 		<li>轻量级，简单易用</li>
     * 		<li>可定义放置元素的范围</li>
     * </ol>
     * <b>示例：</b><br/>
     * <pre>
     * &lt;script type="text/javascript" &gt;
     * $(document).ready(function() {
     *     $('#selector').omDroppable();
     * });
     * &lt;/script&gt;
     * 
     * &lt;div id="selector"&gt;
	 * &lt;/div&gt;
	 * </pre>
     * @constructor
     * @description 构造函数. 
     * @param p 标准config对象：{}
     */
;(function( $, undefined ) {

$.widget("om.omDroppable", {
	widgetEventPrefix: "drop",
	options: {
		/**
         * 指定可以接受的拖动元素，默认任意元素都可以被接受。
         * @name omDroppable#accept
         * @type Selector，function
         * @default "*"
         * @example
         * //只接受id为draggable的元素
         * $("#selector").omDroppable({accept:"#draggable"});
         */
		accept: '*',
		/**
         * 当可接受的元素被拖动时，添加到droppable元素上的样式。
         * @name omDroppable#activeClass
         * @type String
         * @default 无
         * @example
         * $("#selector").omDroppable({activeClass:"om-state-highlight"});
         */
		activeClass: false,
		/**
         * 指定是否在嵌套的droppable元素中阻止事件传播，默认为false，不阻止事件传播；反正为true时，阻止事件传播。
         * @name omDroppable#greedy
         * @type Boolean
         * @default false
         * @example
         * $("#selector").omDroppable({greedy:true});
         */
		greedy: false,
		/**
         * 当可接受的元素悬停在droppable元素上时，添加到droppable元素上的样式。
         * @name omDroppable#hoverClass
         * @type String
         * @default 无
         * @example
         * $("#selector").omDroppable({hoverClass:"om-state-hover"});
         */
		hoverClass: false,
		_scope: 'default'
		/**
		 * 设置放置功能是否可用。
		 * @name omDroppable#disabled
         * @type Boolean
         * @default false
         * @example
         * $("#selector").omDroppable({disabled:true});
         */
		
		/**
         * 可接受的元素开始拖动时触发事件。参数source为被拖动的Dom元素。
         * @event
         * @name omDroppable#onDragStart
         * @type Function
         * @example
         *   $("#selector").omDroppable({onDragStart : function(event, source) {doSomething...}});
         */
			
		/**
         * 拖动元素可以放置时触发事件。参数source为被拖动的Dom元素。
         * @event
         * @name omDroppable#onDragOver
         * @type Function
         * @example
         *   $("#selector").omDroppable({onDragOver : function(event, source) {doSomething...}});
         */
			
		/**
         * 拖动元素移出可放置位置时触发事件。参数source为被拖动的Dom元素。
         * @event
         * @name omDroppable#onDragOut
         * @type Function
         * @example
         *   $("#selector").omDroppable({onDragOut : function(event, source) {doSomething...}});
         */
		
		/**
         * 拖动的元素成功放置时触发事件。参数source为被拖动的Dom元素。
         * @event
         * @name omDroppable#onDrop
         * @type Function
         * @example
         *   $("#selector").omDroppable({onDrop : function(event, source) {doSomething...}});
         */
	},
	_create: function() {

		var o = this.options, accept = o.accept;
		this.isover = 0; this.isout = 1;

		this.accept = $.isFunction(accept) ? accept : function(d) {
			return d.is(accept);
		};

		//Store the droppable's proportions
		this.proportions = { width: this.element[0].offsetWidth, height: this.element[0].offsetHeight };

		// Add the reference and positions to the manager
		$.ui.ddmanager.droppables[o._scope] = $.ui.ddmanager.droppables[o._scope] || [];
		$.ui.ddmanager.droppables[o._scope].push(this);

		this.element.addClass("om-droppable");

	},

	/**
     * 放置功能不可用.
     * @name omDroppable#disable
     * @function
     * @example
     * $("#selector").omDroppable('disable');
     * 
     */
	
	/**
     * 放置功能可用.
     * @name omDroppable#enable
     * @function
     * @example
     * $("#selector").omDroppable('enable');
     * 
     */
	
	/**
     * 删除元素的放置功能.
     * @name omDroppable#destroy
     * @function
     * @returns JQuery对象
     * @example
     * var $selector = $("#selector").omDroppable('destroy');
     * 
     */
	destroy: function() {
		var drop = $.ui.ddmanager.droppables[this.options._scope];
		for ( var i = 0; i < drop.length; i++ )
			if ( drop[i] == this )
				drop.splice(i, 1);

		this.element
			.removeClass("om-droppable om-droppable-disabled")
			.removeData("omDroppable")
			.unbind(".droppable");

		return this;
	},

	_setOption: function(key, value) {

		if(key == 'accept') {
			this.accept = $.isFunction(value) ? value : function(d) {
				return d.is(value);
			};
		}
		$.Widget.prototype._setOption.apply(this, arguments);
	},

	_activate: function(event) {
		var draggable = $.ui.ddmanager.current;
		if(this.options.activeClass) this.element.addClass(this.options.activeClass);
		(draggable && this._trigger('onDragStart', event, draggable.currentItem || draggable.element));
	},

	_deactivate: function(event) {
		var draggable = $.ui.ddmanager.current;
		if(this.options.activeClass) this.element.removeClass(this.options.activeClass);
		//(draggable && this._trigger('onDeactivate', event, draggable.currentItem || draggable.element));
	},

	_over: function(event) {

		var draggable = $.ui.ddmanager.current;
		if (!draggable || (draggable.currentItem || draggable.element)[0] == this.element[0]) return; // Bail if draggable and droppable are same element

		if (this.accept.call(this.element[0],(draggable.currentItem || draggable.element))) {
			if(this.options.hoverClass) this.element.addClass(this.options.hoverClass);
			this._trigger('onDragOver', event, draggable.currentItem || draggable.element);
		}

	},

	_out: function(event) {

		var draggable = $.ui.ddmanager.current;
		if (!draggable || (draggable.currentItem || draggable.element)[0] == this.element[0]) return; // Bail if draggable and droppable are same element

		if (this.accept.call(this.element[0],(draggable.currentItem || draggable.element))) {
			if(this.options.hoverClass) this.element.removeClass(this.options.hoverClass);
			this._trigger('onDragOut', event, draggable.currentItem || draggable.element);
		}

	},

	_drop: function(event,custom) {

		var draggable = custom || $.ui.ddmanager.current;
		if (!draggable || (draggable.currentItem || draggable.element)[0] == this.element[0]) return false; // Bail if draggable and droppable are same element

		var childrenIntersection = false;
		this.element.find(":data(omDroppable)").not(".om-draggable-dragging").each(function() {
			var inst = $.data(this, 'omDroppable');
			if(
				inst.options.greedy
				&& !inst.options.disabled
				&& inst.options._scope == draggable.options._scope
				&& inst.accept.call(inst.element[0], (draggable.currentItem || draggable.element))
				&& $.ui.intersect(draggable, $.extend(inst, { offset: inst.element.offset() }))
			) { childrenIntersection = true; return false; }
		});
		if(childrenIntersection) return false;

		if(this.accept.call(this.element[0],(draggable.currentItem || draggable.element))) {
			if(this.options.activeClass) this.element.removeClass(this.options.activeClass);
			if(this.options.hoverClass) this.element.removeClass(this.options.hoverClass);
			this._trigger('onDrop', event, draggable.currentItem || draggable.element);
			return this.element;
		}

		return false;

	}

});


$.ui.intersect = function(draggable, droppable) {

	if (!droppable.offset) return false;

	var x1 = (draggable.positionAbs || draggable.position.absolute).left, x2 = x1 + draggable.helperProportions.width,
		y1 = (draggable.positionAbs || draggable.position.absolute).top, y2 = y1 + draggable.helperProportions.height;
	var l = droppable.offset.left, r = l + droppable.proportions.width,
		t = droppable.offset.top, b = t + droppable.proportions.height;
	return (l < x1 + (draggable.helperProportions.width / 2) // Right Half
		&& x2 - (draggable.helperProportions.width / 2) < r // Left Half
		&& t < y1 + (draggable.helperProportions.height / 2) // Bottom Half
		&& y2 - (draggable.helperProportions.height / 2) < b ); // Top Half
};

/*
	This manager tracks offsets of draggables and droppables
*/
$.ui.ddmanager = {
	current: null,
	droppables: { 'default': [] },
	prepareOffsets: function(t, event) {

		var m = $.ui.ddmanager.droppables[t.options._scope] || [];
		var type = event ? event.type : null; // workaround for #2317
		var list = (t.currentItem || t.element).find(":data(omDroppable)").andSelf();

		droppablesLoop: for (var i = 0; i < m.length; i++) {

			if(m[i].options.disabled || (t && !m[i].accept.call(m[i].element[0],(t.currentItem || t.element)))) continue;	//No disabled and non-accepted
			for (var j=0; j < list.length; j++) { if(list[j] == m[i].element[0]) { m[i].proportions.height = 0; continue droppablesLoop; } }; //Filter out elements in the current dragged item
			m[i].visible = m[i].element.css("display") != "none"; if(!m[i].visible) continue; 									//If the element is not visible, continue

			if(type == "mousedown") m[i]._activate.call(m[i], event); //Activate the droppable if used directly from draggables

			m[i].offset = m[i].element.offset();
			m[i].proportions = { width: m[i].element[0].offsetWidth, height: m[i].element[0].offsetHeight };

		}

	},
	drop: function(draggable, event) {

		var dropped = false;
		$.each($.ui.ddmanager.droppables[draggable.options._scope] || [], function() {

			if(!this.options) return;
			if (!this.options.disabled && this.visible && $.ui.intersect(draggable, this))
				dropped = dropped || this._drop.call(this, event);

			if (!this.options.disabled && this.visible && this.accept.call(this.element[0],(draggable.currentItem || draggable.element))) {
				this.isout = 1; this.isover = 0;
				this._deactivate.call(this, event);
			}

		});
		return dropped;

	},
	dragStart: function( draggable, event ) {
		//Listen for scrolling so that if the dragging causes scrolling the position of the droppables can be recalculated (see #5003)
		draggable.element.parentsUntil( "body" ).bind( "scroll.droppable", function() {
			if( !draggable.options.refreshPositions ) $.ui.ddmanager.prepareOffsets( draggable, event );
		});
	},
	drag: function(draggable, event) {

		//If you have a highly dynamic page, you might try this option. It renders positions every time you move the mouse.
		if(draggable.options.refreshPositions) $.ui.ddmanager.prepareOffsets(draggable, event);

		//Run through all droppables and check their positions based on specific tolerance options
		$.each($.ui.ddmanager.droppables[draggable.options._scope] || [], function() {

			if(this.options.disabled || this.greedyChild || !this.visible) return;
			var intersects = $.ui.intersect(draggable, this);

			var c = !intersects && this.isover == 1 ? 'isout' : (intersects && this.isover == 0 ? 'isover' : null);
			if(!c) return;

			var parentInstance;
			if (this.options.greedy) {
				var parent = this.element.parents(':data(omDroppable):eq(0)');
				if (parent.length) {
					parentInstance = $.data(parent[0], 'omDroppable');
					parentInstance.greedyChild = (c == 'isover' ? 1 : 0);
				}
			}

			// we just moved into a greedy child
			if (parentInstance && c == 'isover') {
				parentInstance['isover'] = 0;
				parentInstance['isout'] = 1;
				parentInstance._out.call(parentInstance, event);
			}

			this[c] = 1; this[c == 'isout' ? 'isover' : 'isout'] = 0;
			this[c == "isover" ? "_over" : "_out"].call(this, event);

			// we just moved out of a greedy child
			if (parentInstance && c == 'isout') {
				parentInstance['isout'] = 0;
				parentInstance['isover'] = 1;
				parentInstance._over.call(parentInstance, event);
			}
		});

	},
	dragStop: function( draggable, event ) {
		draggable.element.parentsUntil( "body" ).unbind( "scroll.droppable" );
		//Call prepareOffsets one final time since IE does not fire return scroll events when overflow was caused by drag (see #5003)
		if( !draggable.options.refreshPositions ) $.ui.ddmanager.prepareOffsets( draggable, event );
	}
};

})(jQuery);
/*
 * $Id: om-fileupload.js,v 1.15 2012/01/16 01:48:41 linxiaomin Exp $
 * operamasks-ui omFileUpload 1.0
 *
 * Copyright 2011, AUTHORS.txt (http://ui.operamasks.org/about)
 * Dual licensed under the MIT or GPL Version 2 licenses.
 * http://ui.operamasks.org/license
 *
 * http://ui.operamasks.org/docs/
 *
 * Depends:
 */
    /** 
     * @name omFileUpload
     * @class 文件上传.<br/>
     * <b>特点：</b><br/>
     * <ol>
     * 		<li>支持限制上传文件的大小和类型</li>
     * 		<li>支持批量上传文件</li>
     * 		<li>内置进度条展示文件上传进度</li>
     * 		<li>支持选中，上传成功，上传失败等多种回调事件</li>
     * 		<li>可自定义上传按钮的背景图片和文字</li>
     * </ol>
     * <b>示例：</b><br/>
     * <pre>
     * &lt;script type="text/javascript" &gt;
     * $(document).ready(function() {
     *     $('#file_upload').omFileUpload({
     *         action : '/operamasks-ui/omFileUpload.do',
     *         onComplete : function(event,ID,fileObj,response,data){
     *             alert('文件'+fileObj.name+'上传完毕');
     *         }
     *     });
     * });
     * &lt;/script&gt;
     * 
     * &lt;input id="file_upload" name="file_upload" type="file" /&gt;
	 * </pre>
     * @constructor
     * @description 构造函数. 
     * @param p 标准config对象：{}
     */

var swfobject=function(){var D="undefined",r="object",S="Shockwave Flash",W="ShockwaveFlash.ShockwaveFlash",q="application/x-shockwave-flash",R="SWFObjectExprInst",x="onreadystatechange",O=window,j=document,t=navigator,T=false,U=[h],o=[],N=[],I=[],l,Q,E,B,J=false,a=false,n,G,m=true,M=function(){var aa=typeof j.getElementById!=D&&typeof j.getElementsByTagName!=D&&typeof j.createElement!=D,ah=t.userAgent.toLowerCase(),Y=t.platform.toLowerCase(),ae=Y?/win/.test(Y):/win/.test(ah),ac=Y?/mac/.test(Y):/mac/.test(ah),af=/webkit/.test(ah)?parseFloat(ah.replace(/^.*webkit\/(\d+(\.\d+)?).*$/,"$1")):false,X=!+"\v1",ag=[0,0,0],ab=null;if(typeof t.plugins!=D&&typeof t.plugins[S]==r){ab=t.plugins[S].description;if(ab&&!(typeof t.mimeTypes!=D&&t.mimeTypes[q]&&!t.mimeTypes[q].enabledPlugin)){T=true;X=false;ab=ab.replace(/^.*\s+(\S+\s+\S+$)/,"$1");ag[0]=parseInt(ab.replace(/^(.*)\..*$/,"$1"),10);ag[1]=parseInt(ab.replace(/^.*\.(.*)\s.*$/,"$1"),10);ag[2]=/[a-zA-Z]/.test(ab)?parseInt(ab.replace(/^.*[a-zA-Z]+(.*)$/,"$1"),10):0}}else{if(typeof O.ActiveXObject!=D){try{var ad=new ActiveXObject(W);if(ad){ab=ad.GetVariable("$version");if(ab){X=true;ab=ab.split(" ")[1].split(",");ag=[parseInt(ab[0],10),parseInt(ab[1],10),parseInt(ab[2],10)]}}}catch(Z){}}}return{w3:aa,pv:ag,wk:af,ie:X,win:ae,mac:ac}}(),k=function(){if(!M.w3){return}if((typeof j.readyState!=D&&j.readyState=="complete")||(typeof j.readyState==D&&(j.getElementsByTagName("body")[0]||j.body))){f()}if(!J){if(typeof j.addEventListener!=D){j.addEventListener("DOMContentLoaded",f,false)}if(M.ie&&M.win){j.attachEvent(x,function(){if(j.readyState=="complete"){j.detachEvent(x,arguments.callee);f()}});if(O==top){(function(){if(J){return}try{j.documentElement.doScroll("left")}catch(X){setTimeout(arguments.callee,0);return}f()})()}}if(M.wk){(function(){if(J){return}if(!/loaded|complete/.test(j.readyState)){setTimeout(arguments.callee,0);return}f()})()}s(f)}}();function f(){if(J){return}try{var Z=j.getElementsByTagName("body")[0].appendChild(C("span"));Z.parentNode.removeChild(Z)}catch(aa){return}J=true;var X=U.length;for(var Y=0;Y<X;Y++){U[Y]()}}function K(X){if(J){X()}else{U[U.length]=X}}function s(Y){if(typeof O.addEventListener!=D){O.addEventListener("load",Y,false)}else{if(typeof j.addEventListener!=D){j.addEventListener("load",Y,false)}else{if(typeof O.attachEvent!=D){i(O,"onload",Y)}else{if(typeof O.onload=="function"){var X=O.onload;O.onload=function(){X();Y()}}else{O.onload=Y}}}}}function h(){if(T){V()}else{H()}}function V(){var X=j.getElementsByTagName("body")[0];var aa=C(r);aa.setAttribute("type",q);var Z=X.appendChild(aa);if(Z){var Y=0;(function(){if(typeof Z.GetVariable!=D){var ab=Z.GetVariable("$version");if(ab){ab=ab.split(" ")[1].split(",");M.pv=[parseInt(ab[0],10),parseInt(ab[1],10),parseInt(ab[2],10)]}}else{if(Y<10){Y++;setTimeout(arguments.callee,10);return}}X.removeChild(aa);Z=null;H()})()}else{H()}}function H(){var ag=o.length;if(ag>0){for(var af=0;af<ag;af++){var Y=o[af].id;var ab=o[af].callbackFn;var aa={success:false,id:Y};if(M.pv[0]>0){var ae=c(Y);if(ae){if(F(o[af].swfVersion)&&!(M.wk&&M.wk<312)){w(Y,true);if(ab){aa.success=true;aa.ref=z(Y);ab(aa)}}else{if(o[af].expressInstall&&A()){var ai={};ai.data=o[af].expressInstall;ai.width=ae.getAttribute("width")||"0";ai.height=ae.getAttribute("height")||"0";if(ae.getAttribute("class")){ai.styleclass=ae.getAttribute("class")}if(ae.getAttribute("align")){ai.align=ae.getAttribute("align")}var ah={};var X=ae.getElementsByTagName("param");var ac=X.length;for(var ad=0;ad<ac;ad++){if(X[ad].getAttribute("name").toLowerCase()!="movie"){ah[X[ad].getAttribute("name")]=X[ad].getAttribute("value")}}P(ai,ah,Y,ab)}else{p(ae);if(ab){ab(aa)}}}}}else{w(Y,true);if(ab){var Z=z(Y);if(Z&&typeof Z.SetVariable!=D){aa.success=true;aa.ref=Z}ab(aa)}}}}}function z(aa){var X=null;var Y=c(aa);if(Y&&Y.nodeName=="OBJECT"){if(typeof Y.SetVariable!=D){X=Y}else{var Z=Y.getElementsByTagName(r)[0];if(Z){X=Z}}}return X}function A(){return !a&&F("6.0.65")&&(M.win||M.mac)&&!(M.wk&&M.wk<312)}function P(aa,ab,X,Z){a=true;E=Z||null;B={success:false,id:X};var ae=c(X);if(ae){if(ae.nodeName=="OBJECT"){l=g(ae);Q=null}else{l=ae;Q=X}aa.id=R;if(typeof aa.width==D||(!/%$/.test(aa.width)&&parseInt(aa.width,10)<310)){aa.width="310"}if(typeof aa.height==D||(!/%$/.test(aa.height)&&parseInt(aa.height,10)<137)){aa.height="137"}j.title=j.title.slice(0,47)+" - Flash Player Installation";var ad=M.ie&&M.win?"ActiveX":"PlugIn",ac="MMredirectURL="+O.location.toString().replace(/&/g,"%26")+"&MMplayerType="+ad+"&MMdoctitle="+j.title;if(typeof ab.flashvars!=D){ab.flashvars+="&"+ac}else{ab.flashvars=ac}if(M.ie&&M.win&&ae.readyState!=4){var Y=C("div");X+="SWFObjectNew";Y.setAttribute("id",X);ae.parentNode.insertBefore(Y,ae);ae.style.display="none";(function(){if(ae.readyState==4){ae.parentNode.removeChild(ae)}else{setTimeout(arguments.callee,10)}})()}u(aa,ab,X)}}function p(Y){if(M.ie&&M.win&&Y.readyState!=4){var X=C("div");Y.parentNode.insertBefore(X,Y);X.parentNode.replaceChild(g(Y),X);Y.style.display="none";(function(){if(Y.readyState==4){Y.parentNode.removeChild(Y)}else{setTimeout(arguments.callee,10)}})()}else{Y.parentNode.replaceChild(g(Y),Y)}}function g(ab){var aa=C("div");if(M.win&&M.ie){aa.innerHTML=ab.innerHTML}else{var Y=ab.getElementsByTagName(r)[0];if(Y){var ad=Y.childNodes;if(ad){var X=ad.length;for(var Z=0;Z<X;Z++){if(!(ad[Z].nodeType==1&&ad[Z].nodeName=="PARAM")&&!(ad[Z].nodeType==8)){aa.appendChild(ad[Z].cloneNode(true))}}}}}return aa}function u(ai,ag,Y){var X,aa=c(Y);if(M.wk&&M.wk<312){return X}if(aa){if(typeof ai.id==D){ai.id=Y}if(M.ie&&M.win){var ah="";for(var ae in ai){if(ai[ae]!=Object.prototype[ae]){if(ae.toLowerCase()=="data"){ag.movie=ai[ae]}else{if(ae.toLowerCase()=="styleclass"){ah+=' class="'+ai[ae]+'"'}else{if(ae.toLowerCase()!="classid"){ah+=" "+ae+'="'+ai[ae]+'"'}}}}}var af="";for(var ad in ag){if(ag[ad]!=Object.prototype[ad]){af+='<param name="'+ad+'" value="'+ag[ad]+'" />'}}aa.outerHTML='<object classid="clsid:D27CDB6E-AE6D-11cf-96B8-444553540000"'+ah+">"+af+"</object>";N[N.length]=ai.id;X=c(ai.id)}else{var Z=C(r);Z.setAttribute("type",q);for(var ac in ai){if(ai[ac]!=Object.prototype[ac]){if(ac.toLowerCase()=="styleclass"){Z.setAttribute("class",ai[ac])}else{if(ac.toLowerCase()!="classid"){Z.setAttribute(ac,ai[ac])}}}}for(var ab in ag){if(ag[ab]!=Object.prototype[ab]&&ab.toLowerCase()!="movie"){e(Z,ab,ag[ab])}}aa.parentNode.replaceChild(Z,aa);X=Z}}return X}function e(Z,X,Y){var aa=C("param");aa.setAttribute("name",X);aa.setAttribute("value",Y);Z.appendChild(aa)}function y(Y){var X=c(Y);if(X&&X.nodeName=="OBJECT"){if(M.ie&&M.win){X.style.display="none";(function(){if(X.readyState==4){b(Y)}else{setTimeout(arguments.callee,10)}})()}else{X.parentNode.removeChild(X)}}}function b(Z){var Y=c(Z);if(Y){for(var X in Y){if(typeof Y[X]=="function"){Y[X]=null}}Y.parentNode.removeChild(Y)}}function c(Z){var X=null;try{X=j.getElementById(Z)}catch(Y){}return X}function C(X){return j.createElement(X)}function i(Z,X,Y){Z.attachEvent(X,Y);I[I.length]=[Z,X,Y]}function F(Z){var Y=M.pv,X=Z.split(".");X[0]=parseInt(X[0],10);X[1]=parseInt(X[1],10)||0;X[2]=parseInt(X[2],10)||0;return(Y[0]>X[0]||(Y[0]==X[0]&&Y[1]>X[1])||(Y[0]==X[0]&&Y[1]==X[1]&&Y[2]>=X[2]))?true:false}function v(ac,Y,ad,ab){if(M.ie&&M.mac){return}var aa=j.getElementsByTagName("head")[0];if(!aa){return}var X=(ad&&typeof ad=="string")?ad:"screen";if(ab){n=null;G=null}if(!n||G!=X){var Z=C("style");Z.setAttribute("type","text/css");Z.setAttribute("media",X);n=aa.appendChild(Z);if(M.ie&&M.win&&typeof j.styleSheets!=D&&j.styleSheets.length>0){n=j.styleSheets[j.styleSheets.length-1]}G=X}if(M.ie&&M.win){if(n&&typeof n.addRule==r){n.addRule(ac,Y)}}else{if(n&&typeof j.createTextNode!=D){n.appendChild(j.createTextNode(ac+" {"+Y+"}"))}}}function w(Z,X){if(!m){return}var Y=X?"visible":"hidden";if(J&&c(Z)){c(Z).style.visibility=Y}else{v("#"+Z,"visibility:"+Y)}}function L(Y){var Z=/[\\\"<>\.;]/;var X=Z.exec(Y)!=null;return X&&typeof encodeURIComponent!=D?encodeURIComponent(Y):Y}var d=function(){if(M.ie&&M.win){window.attachEvent("onunload",function(){var ac=I.length;for(var ab=0;ab<ac;ab++){I[ab][0].detachEvent(I[ab][1],I[ab][2])}var Z=N.length;for(var aa=0;aa<Z;aa++){y(N[aa])}for(var Y in M){M[Y]=null}M=null;for(var X in swfobject){swfobject[X]=null}swfobject=null})}}();return{registerObject:function(ab,X,aa,Z){if(M.w3&&ab&&X){var Y={};Y.id=ab;Y.swfVersion=X;Y.expressInstall=aa;Y.callbackFn=Z;o[o.length]=Y;w(ab,false)}else{if(Z){Z({success:false,id:ab})}}},getObjectById:function(X){if(M.w3){return z(X)}},embedSWF:function(ab,ah,ae,ag,Y,aa,Z,ad,af,ac){var X={success:false,id:ah};if(M.w3&&!(M.wk&&M.wk<312)&&ab&&ah&&ae&&ag&&Y){w(ah,false);K(function(){ae+="";ag+="";var aj={};if(af&&typeof af===r){for(var al in af){aj[al]=af[al]}}aj.data=ab;aj.width=ae;aj.height=ag;var am={};if(ad&&typeof ad===r){for(var ak in ad){am[ak]=ad[ak]}}if(Z&&typeof Z===r){for(var ai in Z){if(typeof am.flashvars!=D){am.flashvars+="&"+ai+"="+Z[ai]}else{am.flashvars=ai+"="+Z[ai]}}}if(F(Y)){var an=u(aj,am,ah);if(aj.id==ah){w(ah,true)}X.success=true;X.ref=an}else{if(aa&&A()){aj.data=aa;P(aj,am,ah,ac);return}else{w(ah,true)}}if(ac){ac(X)}})}else{if(ac){ac(X)}}},switchOffAutoHideShow:function(){m=false},ua:M,getFlashPlayerVersion:function(){return{major:M.pv[0],minor:M.pv[1],release:M.pv[2]}},hasFlashPlayerVersion:F,createSWF:function(Z,Y,X){if(M.w3){return u(Z,Y,X)}else{return undefined}},showExpressInstall:function(Z,aa,X,Y){if(M.w3&&A()){P(Z,aa,X,Y)}},removeSWF:function(X){if(M.w3){y(X)}},createCSS:function(aa,Z,Y,X){if(M.w3){v(aa,Z,Y,X)}},addDomLoadEvent:K,addLoadEvent:s,getQueryParamValue:function(aa){var Z=j.location.search||j.location.hash;if(Z){if(/\?/.test(Z)){Z=Z.split("?")[1]}if(aa==null){return L(Z)}var Y=Z.split("&");for(var X=0;X<Y.length;X++){if(Y[X].substring(0,Y[X].indexOf("="))==aa){return L(Y[X].substring((Y[X].indexOf("=")+1)))}}}return""},expressInstallCallback:function(){if(a){var X=c(R);if(X&&l){X.parentNode.replaceChild(l,X);if(Q){w(Q,true);if(M.ie&&M.win){l.style.display="block"}}if(E){E(B)}}a=false}}}}();
if(!$.omFileUpload) $.omFileUpload={};
$.omFileUpload.lang={
		queueSizeLimitMsg:'文件上传队列已满，数量不能超过',
		selectFileText:'选择文件'
};

(function($){
	$.fn.omFileUpload = function(options){
		// 根据上传组件id和文件在队列中的index查找文件ID
		function _findIDByIndex(uploadId,index){
			var queueId = uploadId + 'Queue';
			var queueSize = $('#' + queueId + ' .om-fileupload-queueitem').length;
			if(index == null || isNaN(index) || index < 0 || index >= queueSize){
				return false;
			}
			var item = $('#' + queueId + ' .om-fileupload-queueitem:eq('+index+')');
			return item.attr('id').replace(uploadId,'');				
		};
		var methods = {
	        /**
	         * 上传文件。如果不设置index参数则上传队列里面的所有文件
	         * @name omFileUpload#upload
	         * @function
	         * @param index 文件在上传队列中的索引，从0开始
	         * @example
	         * $('#file_upload').omFileUpload('upload'); // 上传队列中的所有文件
	         * $('#file_upload').omFileUpload('upload',1); // 上传队列中的第2个文件
	         */					
			upload:function(index) {
				return this.each(function() {
					var id = $(this).attr('id'),
						fileId = null,
						queueId = $(this).attr('id') + 'Queue',
						uploaderId = $(this).attr('id') + 'Uploader';
					if(typeof(index) != 'undefined'){
						if((fileId = _findIDByIndex(id,index)) === false) return;
					}
					document.getElementById(uploaderId).startFileUpload(fileId, false);
				});
			},
	        /**
	         * 取消上传文件。如果不设置index参数则取消队列里面的所有文件
	         * @name omFileUpload#cancel
	         * @function
	         * @param index 文件在上传队列中的索引，从0开始
	         * @example
	         * $('#file_upload').omFileUpload('cancel'); // 取消上传队列中的所有文件
	         * $('#file_upload').omFileUpload('cancel',1); // 取消上传队列中的第2个文件
	         */					
			cancel:function(index) {
				return this.each(function() {
					var id = $(this).attr('id'),
						fileId = null,
						queueId = $(this).attr('id') + 'Queue',
						uploaderId = $(this).attr('id') + 'Uploader';
					if(typeof(index) != 'undefined'){
						// 增加对index参数为ID的情况的处理
						if(isNaN(index)){
							fileId = index;
						} else{
							if((fileId = _findIDByIndex($(this).attr('id'),index)) === false) return;
						}
						document.getElementById(uploaderId).cancelFileUpload(fileId, true, true, false);
					} else{
						// cancel all
						document.getElementById(uploaderId).clearFileUploadQueue(false);
					}
				});
			}
			
		};
		// 调用公用方法
		if (methods[options]) {
			return methods[options].apply(this, Array.prototype.slice.call(arguments, 1));
		} 
		// 动态修改参数
		var dynOpts = ['buttonImg','buttonText','fileDesc','fileExt','height','action','actionData','sizeLimit','width'];
		if($.inArray(options,dynOpts) != -1){
			var args = arguments;
			return this.each(function() {
				var uploader = document.getElementById($(this).attr('id') + 'Uploader');
				if(uploader != null && args.length > 1){
					if ('actionData' == args[0]) {
						var actionDataString = '';
						for (var name in args[1]) {
							actionDataString += '&' + name + '=' + args[1][name];
						}
						
						var cookieArray = document.cookie.split(';')
			            for (var i = 0; i < cookieArray.length; i++){
			                actionDataString += '&' + cookieArray[i];
			            }
						
						args[1] = encodeURI(actionDataString.substr(1));
					}
					return uploader.updateSettings(args[0],args[1]);
				}
			});
		}
		
		
		var settings = $.extend(/** @lends omFileUpload#*/{
			id : $(this).attr('id'),
			/**
			 * 设置处理上传的swf文件的位置。
			 * @default '/operamasks-ui/ui/om-fileupload.swf'
			 * @type String
			 * @example
			 * $('#file_upload').omFileUpload({swf : 'om-fileupload.swf'});
			 */
			swf : '/operamasks-ui/ui/om-fileupload.swf',
			/**
			 * 处理文件上传的服务端地址。
			 * @default ''
			 * @type String
			 * @example
			 * $('#file_upload').omFileUpload({action : '/operamasks-ui/omFileUpload'});
			 */
			action : '',
			/**
			 * 设置上传到服务端的附加数据。使用这个属性的时候必须把method设置为'GET'
			 * @default empty object
			 * @type Object
			 * @example
			 * $('#file_upload').omFileUpload({method:'GET', actionData : {'name':'operamasks','age':'5'}});
			 */
			actionData : {},
			/**
			 * 设置上传按钮的高度 
			 * @default 30
			 * @type Number
			 * @example
			 * $('#file_upload').omFileUpload({height : 50});
			 */			
			height : 30,
			/**
			 * 设置上传按钮的宽度 
			 * @default 120
			 * @type Number
			 * @example
			 * $('#file_upload').omFileUpload({width : 150});
			 */			
			width : 120,
			/**
			 * 上传按钮的文字 
			 * @default '选择文件'
			 * @type String
			 * @example
			 * $('#file_upload').omFileUpload({buttonText: '选择图片'});
			 */			
			buttonText : $.omFileUpload.lang.selectFileText,
			
			/**
			 * 上传按钮的背景图片
			 * @default null(swf内置图片)
			 * @type String
			 * @example
			 * $('#file_upload').omFileUpload({buttonImg: 'btn.jpg'});
			 */
			buttonImg : null,
			
			/**
			 * 是否允许批量上传文件
			 * @default false
			 * @type Boolean
			 * @example
			 * $('#file_upload').omFileUpload({multi: true});
			 */			
			multi : false,
			
			/**
			 * 是否在选择完文件后自动执行上传 
			 * @default false
			 * @type Boolean
			 * @example
			 * $('#file_upload').omFileUpload({autoUpload: true});
			 */			
			autoUpload : false,
			fileDataName : 'Filedata',
			/**
			 * 文件上传的表单提交方式。 
			 * @default 'POST'
			 * @type String
			 * @example
			 * $('#file_upload').omFileUpload({method: 'GET'});
			 */				
			method : 'POST',
			/**
			 * 批量上传文件数量的最大限制 
			 * @default 999
			 * @type Number
			 * @example
			 * $('#file_upload').omFileUpload({queueSizeLimit : 5});
			 */			
			queueSizeLimit : 999,
			/**
			 * 文件上传完成后是否自动移除上传的状态提示框。如果设置false则文件上传完后需要点击提示框的关闭按钮进行关闭。
			 * @default true
			 * @type Boolean
			 * @example
			 * $('#file_upload').omFileUpload({removeCompleted : false});
			 */			
			removeCompleted : true,
			/**
			 * 上传文件的类型限制,这个属性必须和fileDesc属性一起使用。 
			 * @default '*.*'
			 * @type String
			 * @example
			 * $('#file_upload').omFileUpload({fileExt : '*.jpg;*.png;*.gif',fileDesc:'Image Files'});
			 */			
			fileExt : '*.*',
			/**
			 * 在选择文件的弹出窗口中“文件类型”下拉框中显示的文字。
			 * @default null
			 * @type String
			 * @example
			 * $('#file_upload').omFileUpload({fileExt : '*.jpg;*.png;*.gif',fileDesc:'Image Files'});
			 */			
			fileDesc : null,
			/**
			 * 上传文件的最大限制 
			 * @default null(无大小限制)
			 * @type Number
			 * @example
			 * $('#file_upload').omFileUpload({sizeLimit : 1024});
			 */			
			sizeLimit : null,
			/**
			 * 选择上传文件后触发。
			 * 返回的fileObj对象封装了文件的信息，包含以下属性：
			 * <ol>
			 * 	<li>name：文件名</li>
			 * 	<li>size：文件大小</li>
			 * 	<li>creationDate：文件创建时间</li>
			 * 	<li>modificationDate：文件最后修改时间</li>
			 * 	<li>type：文件类型</li>
			 * </ol>
			 * @event
			 * @type Function
			 * @default emptyFn
			 * @param event,ID,fileObj
			 * @name omFileUpload#onSelect
			 * @example
			 * $('#file_upload').omFileUpload({onSelect:function(event,ID,fileObj){alert('你选择了文件：'+fileObj.name);}});
			 */			
			onSelect : function() {},
			/**
			 * 批量上传的文件数量超过限制后触发
			 * @event
			 * @type Function
			 * @default emptyFn
			 * @param event,queueSizeLimit
			 * @name omFileUpload#onQueueFull
			 * @example
			 * $('#file_upload').omFileUpload({onSelect:function(event,queueSizeLimit){alert('批量上传文件的数量不能超过：'+queueSizeLimit);}});
			 */				
			onQueueFull : function() {},
			/**
			 * 选择上传文件后触发。
			 * 返回的fileObj对象封装了文件的信息，包含以下属性：
			 * <ol>
			 * 	<li>name：文件名</li>
			 * 	<li>size：文件大小</li>
			 * 	<li>creationDate：文件创建时间</li>
			 * 	<li>modificationDate：文件最后修改时间</li>
			 * 	<li>type：文件类型</li>
			 * </ol>
			 * 返回的data对象封装了文件上传的相关信息，包含以下属性：
			 * <ol>
			 * 	<li>fileCount：文件上传队列中剩余文件的数量</li>
			 * 	<li>speed：文件上传的平均速度 KB/s</li>
			 * </ol>
			 * @event
			 * @type Function
			 * @default emptyFn
			 * @param event,ID,fileObj,data
			 * @name omFileUpload#onCancel
			 * @example
			 * $('#file_upload').omFileUpload({onCalcel:function(event,ID,fileObj,data){alert('取消上传：'+fileObj.name);}});
			 */			
			onCancel : function() {},
			/**
			 * 文件上传出错后触发。
			 * 返回的fileObj对象封装了文件的信息，包含以下属性：
			 * <ol>
			 * 	<li>name：文件名</li>
			 * 	<li>size：文件大小</li>
			 * 	<li>creationDate：文件创建时间</li>
			 * 	<li>modificationDate：文件最后修改时间</li>
			 * 	<li>type：文件类型</li>
			 * </ol>
			 * 返回的errorObj对象封装了返回的出错信息，包含以下属性：
			 * <ol>
			 * 	<li>type：'HTTP'或'IO'或'Security'</li>
			 * 	<li>info：返回的错误信息描述</li>
			 * </ol>
			 * @event
			 * @type Function
			 * @default emptyFn
			 * @param event,ID,fileObj,errorObj
			 * @name omFileUpload#onError
			 * @example
			 * $('#file_upload').omFileUpload({onError:function(event,ID,fileObj,errorObj){alert('文件'+fileObj.name+'上传失败。错误类型：'+errorObj.type+'。原因：'+errorObj.info);}});
			 */				
			onError : function() {},
			/**
			 * 每次更新文件的上传进度后触发。
			 * 返回的fileObj对象封装了文件的信息，包含以下属性：
			 * <ol>
			 * 	<li>name：文件名</li>
			 * 	<li>size：文件大小</li>
			 * 	<li>creationDate：文件创建时间</li>
			 * 	<li>modificationDate：文件最后修改时间</li>
			 * 	<li>type：文件类型</li>
			 * </ol>
			 * 返回的data对象封装了文件上传的相关信息，包含以下属性：
			 * <ol>
			 * 	<li>fileCount：文件上传队列中剩余文件的数量</li>
			 * 	<li>speed：文件上传的平均速度 KB/s</li>
			 * </ol>
			 * @event
			 * @type Function
			 * @default emptyFn
			 * @param event,ID,fileObj,data
			 * @name omFileUpload#onProgress
			 * @example
			 * $('#file_upload').omFileUpload({onProgress:function(event,ID,fileObj,data){alert(fileObj.name+'上传平均速度：'+data.speed);}});
			 */				
			onProgress : function() {},
			/**
			 * 每个文件完成上传后触发。
			 * 返回的response参数表示服务端返回的内容。
			 * 返回的fileObj对象封装了文件的信息，包含以下属性：
			 * <ol>
			 * 	<li>name：文件名</li>
			 * 	<li>size：文件大小</li>
			 * 	<li>creationDate：文件创建时间</li>
			 * 	<li>modificationDate：文件最后修改时间</li>
			 * 	<li>type：文件类型</li>
			 * </ol>
			 * 返回的data对象封装了文件上传的相关信息，包含以下属性：
			 * <ol>
			 * 	<li>fileCount：文件上传队列中剩余文件的数量</li>
			 * 	<li>speed：文件上传的平均速度 KB/s</li>
			 * </ol>
			 * @event
			 * @type Function
			 * @default emptyFn
			 * @param event,ID,fileObj,response,data
			 * @name omFileUpload#onComplete
			 * @example
			 * $('#file_upload').omFileUpload({onComplete:function(event,ID,fileObj,response,data){alert(fileObj.name+'上传完成');}});
			 */				
			onComplete : function() {},
			/**
			 * 所有文件上传完后触发。
			 * 返回的data对象封装了文件上传的相关信息，包含以下属性：
			 * <ol>
			 * 	<li>fileCount：文件上传队列中剩余文件的数量</li>
			 * 	<li>speed：文件上传的平均速度 KB/s</li>
			 * </ol>
			 * @event
			 * @type Function
			 * @default emptyFn
			 * @param event,data
			 * @name omFileUpload#onAllComplete
			 * @example
			 * $('#file_upload').omFileUpload({onAllComplete:function(event,data){alert('所有文件上传完毕');}});
			 */				
			onAllComplete : function() {}
		}, options);
		// 内置属性，不公布
		settings.wmode = 'opaque'; // The wmode of the flash file
		settings.expressInstall = null;
		settings.displayData = 'percentage';
		settings.folder = ''; // The path to the upload folder
		settings.simUploadLimit = 1; // The number of simultaneous uploads allowed
		settings.scriptAccess = 'sameDomain'; // Set to "always" to allow script access across domains
		settings.queueID = false; // The optional ID of the queue container
		settings.onInit = function(){}; // Function to run when omFileUpload is initialized
		settings.onSelectOnce = function(){}; // Function to run once when files are added to the queue
		settings.onClearQueue = function(){}; // Function to run when the queue is manually cleared
		return this.each(function(){
			$(this).data('settings',settings);
			var pagePath = location.pathname;
			pagePath = pagePath.split('/');
			pagePath.pop();
			pagePath = pagePath.join('/') + '/';
			var data = {};
			data.omFileUploadID = settings.id;
			
			data.pagepath = pagePath;
			if (settings.buttonImg) data.buttonImg = escape(settings.buttonImg);
			if (settings.buttonText) data.buttonText = encodeURI(settings.buttonText);
			if (settings.rollover) data.rollover = true;
			data.action = settings.action;
			data.folder = escape(settings.folder);
			
			var actionDataString = '';
			var cookieArray = document.cookie.split(';')
            for (var i = 0; i < cookieArray.length; i++){
                actionDataString += '&' + cookieArray[i];
            }
			if (settings.actionData) {
				for (var name in settings.actionData) {
					actionDataString += '&' + name + '=' + settings.actionData[name];
				}
			}
			data.actionData = encodeURI(actionDataString.substr(1));
			data.width = settings.width;
			data.height = settings.height;
			data.wmode = settings.wmode;
			data.method = settings.method;
			data.queueSizeLimit = settings.queueSizeLimit;
			data.simUploadLimit = settings.simUploadLimit;
			if (settings.hideButton) data.hideButton = true;
			if (settings.fileDesc) data.fileDesc = settings.fileDesc;
			if (settings.fileExt) data.fileExt = settings.fileExt;
			if (settings.multi) data.multi = true;
			if (settings.autoUpload) data.autoUpload = true;
			if (settings.sizeLimit) data.sizeLimit = settings.sizeLimit;
			if (settings.checkScript) data.checkScript = settings.checkScript;
			if (settings.fileDataName) data.fileDataName = settings.fileDataName;
			if (settings.queueID) data.queueID = settings.queueID;
			if (settings.onInit() !== false) {
				$(this).css('display','none');
				$(this).after('<div id="' + $(this).attr('id') + 'Uploader"></div>');
				swfobject.embedSWF(settings.swf, settings.id + 'Uploader', settings.width, settings.height, '9.0.24', settings.expressInstall, data, {'quality':'high','wmode':settings.wmode,'allowScriptAccess':settings.scriptAccess},{},function(event) {
					if (typeof(settings.onSWFReady) == 'function' && event.success) settings.onSWFReady();
				});
				if (settings.queueID == false) {
					$("#" + $(this).attr('id') + "Uploader").after('<div id="' + $(this).attr('id') + 'Queue" class="om-fileupload-queue"></div>');
				} else {
					$("#" + settings.queueID).addClass('om-fileupload-queue');
				}
			}
			if (typeof(settings.onOpen) == 'function') {
				$(this).bind("omFileUploadOpen", settings.onOpen);
			}
			$(this).bind("omFileUploadSelect", {'action': settings.onSelect, 'queueID': settings.queueID}, function(event, ID, fileObj) {
				if (event.data.action(event, ID, fileObj) !== false) {
					var byteSize = Math.round(fileObj.size / 1024 * 100) * .01;
					var suffix = 'KB';
					if (byteSize > 1000) {
						byteSize = Math.round(byteSize *.001 * 100) * .01;
						suffix = 'MB';
					}
					var sizeParts = byteSize.toString().split('.');
					if (sizeParts.length > 1) {
						byteSize = sizeParts[0] + '.' + sizeParts[1].substr(0,2);
					} else {
						byteSize = sizeParts[0];
					}
					if (fileObj.name.length > 20) {
						fileName = fileObj.name.substr(0,20) + '...';
					} else {
						fileName = fileObj.name;
					}
					queue = '#' + $(this).attr('id') + 'Queue';
					if (event.data.queueID) {
						queue = '#' + event.data.queueID;
					}
					$(queue).append('<div id="' + $(this).attr('id') + ID + '" class="om-fileupload-queueitem">\
							<div class="cancel" onclick="$(\'#' + $(this).attr('id') + '\').omFileUpload(\'cancel\',\'' + ID + '\')">\
							</div>\
							<span class="fileName">' + fileName + ' (' + byteSize + suffix + ')</span><span class="percentage"></span>\
							<div class="om-fileupload-progress">\
								<div id="' + $(this).attr('id') + ID + 'ProgressBar" class="om-fileupload-progressbar"><!--Progress Bar--></div>\
							</div>\
						</div>');
				}
			});
			$(this).bind("omFileUploadSelectOnce", {'action': settings.onSelectOnce}, function(event, data) {
				event.data.action(event, data);
				if (settings.autoUpload) {
					$(this).omFileUpload('upload');
				}
			});
			$(this).bind("omFileUploadQueueFull", {'action': settings.onQueueFull}, function(event, queueSizeLimit) {
				if (event.data.action(event, queueSizeLimit) !== false) {
					alert($.omFileUpload.lang.queueSizeLimitMsg + queueSizeLimit + '.');
				}
			});
			$(this).bind("omFileUploadCancel", {'action': settings.onCancel}, function(event, ID, fileObj, data, remove, clearFast) {
				if (event.data.action(event, ID, fileObj, data, clearFast) !== false) {
					if (remove) { 
						var fadeSpeed = (clearFast == true) ? 0 : 250;
						$("#" + $(this).attr('id') + ID).fadeOut(fadeSpeed, function() { $(this).remove() });
					}
				}
			});
			$(this).bind("omFileUploadClearQueue", {'action': settings.onClearQueue}, function(event, clearFast) {
				var queueID = (settings.queueID) ? settings.queueID : $(this).attr('id') + 'Queue';
				if (clearFast) {
					$("#" + queueID).find('.om-fileupload-queueitem').remove();
				}
				if (event.data.action(event, clearFast) !== false) {
					$("#" + queueID).find('.om-fileupload-queueitem').each(function() {
						var index = $('.om-fileupload-queueitem').index(this);
						$(this).delay(index * 100).fadeOut(250, function() { $(this).remove() });
					});
				}
			});
			var errorArray = [];
			$(this).bind("omFileUploadError", {'action': settings.onError}, function(event, ID, fileObj, errorObj) {
				if (event.data.action(event, ID, fileObj, errorObj) !== false) {
					var fileArray = new Array(ID, fileObj, errorObj);
					errorArray.push(fileArray);
					$("#" + $(this).attr('id') + ID).find('.percentage').text(" - " + errorObj.type + " Error");
					$("#" + $(this).attr('id') + ID).find('.om-fileupload-progress').hide();
					$("#" + $(this).attr('id') + ID).addClass('om-fileupload-error');
				}
			});
			if (typeof(settings.onUpload) == 'function') {
				$(this).bind("omFileUploadUpload", settings.onUpload);
			}
			$(this).bind("omFileUploadProgress", {'action': settings.onProgress, 'toDisplay': settings.displayData}, function(event, ID, fileObj, data) {
				if (event.data.action(event, ID, fileObj, data) !== false) {
					$("#" + $(this).attr('id') + ID + "ProgressBar").animate({'width': data.percentage + '%'},250,function() {
						if (data.percentage == 100) {
							$(this).closest('.om-fileupload-progress').fadeOut(250,function() {$(this).remove()});
						}
					});
					if (event.data.toDisplay == 'percentage') displayData = ' - ' + data.percentage + '%';
					if (event.data.toDisplay == 'speed') displayData = ' - ' + data.speed + 'KB/s';
					if (event.data.toDisplay == null) displayData = ' ';
					$("#" + $(this).attr('id') + ID).find('.percentage').text(displayData);
				}
			});
			$(this).bind("omFileUploadComplete", {'action': settings.onComplete}, function(event, ID, fileObj, response, data) {
				if (event.data.action(event, ID, fileObj, unescape(response), data) !== false) {
					$("#" + $(this).attr('id') + ID).find('.percentage').text(' - Completed');
					if (settings.removeCompleted) {
						$("#" + $(event.target).attr('id') + ID).fadeOut(250,function() {$(this).remove()});
					}
					$("#" + $(event.target).attr('id') + ID).addClass('completed');
				}
			});
			if (typeof(settings.onAllComplete) == 'function') {
				$(this).bind("omFileUploadAllComplete", {'action': settings.onAllComplete}, function(event, data) {
					if (event.data.action(event, data) !== false) {
						errorArray = [];
					}
				});
			}
		});
	};
})(jQuery);/*
 * $Id: om-grid.js,v 1.98 2012/01/16 01:48:41 linxiaomin Exp $
 * operamasks-ui omGrid 1.0
 *
 * Copyright 2011, AUTHORS.txt (http://ui.operamasks.org/about)
 * Dual licensed under the MIT or GPL Version 2 licenses.
 * http://ui.operamasks.org/license
 *
 * http://ui.operamasks.org/docs/
 * 
 * Depends:
 *  jquery.ui.widget.js
 *  jquery.ui.core.js
 *  jquery.ui.mouse.js
 *  jquery.ui.resizable.js
 */
 
/**
     * @name omGrid
     * @class 表格组件。类似于html中的table，支持后台数据源、分页、自动列宽、单选/多选、行样式、自定义列渲染等功能。<br/><br/>
     * <b>特点：</b><br/>
     * <ol>
     *      <li>使用远程数据源</li>
     *      <li>支持分页展现</li>
     *      <li>自动添加行号</li>
     *      <li>允许某列的宽度自动扩充（该列宽度等于表格总宽度送去其它列宽度之和）</li>
     *      <li>允许所有列自动缩放（自动缩放各列的宽度，使得它适应表格的总宽度）</li>
     *      <li>可以定制隔行样式，也可以根据记录的不同使用不同的行样式</li>
     *      <li>可以定制各列的显示效果</li>
     *      <li>可以设置表头和表体自动换行</li>
     *      <li>可以改变列宽</li>
     *      <li>提供丰富的事件</li>
     * </ol>
     * 
     * <b>示例：</b><br/>
     * <pre>
     * &lt;script type="text/javascript" >
     *  $(document).ready(function() {
     *      $('#mytable').omGrid({
     *          height : 250,
     *          width : 600,
     *          limit : 8, //分页显示，每页显示8条
     *          singleSelect : false, //出现checkbox列，可以选择同时多行记录
     *          colModel : [    {header:'编号',name:'id', width:100, align : 'center'},
     *                          {header:'地区',name:'city', width:250, align : 'left',wrap:true},
     *                          {header:'地址',name:'address', width:'autoExpand',renderer:function(value){ return '&lt;b>'+value+'&lt/b>'; }}
     *          ],
     *          dataSource : 'griddata.json' //后台取数的URL
     *      });
     *  });
     * &lt;/script>
     * 
     * &lt;table id="mytable"/>
     * </pre>
     * 
     * colModel配置项是列模型，它定义了表格与具体数据无关的展现。它是一个JSON数组，其中数组中每一个item（是一个JSON对象）代表表格中的一列。可以使用以下属性：<br/>
     * <ol>
     *      <li>header:String类型，表示表格的表头文字。无默认值。</li>
     *      <li>width:Number类型或'autoExpand'，如果是数字200表示该列宽度是200px。如果是'autoExpand'表示该列的宽度是表格总宽度减去其它各列宽度之和。默认值是60。</li>
     *      <li>align:'left'或'right'或'center'，表示表格的表头和表体文字的对齐方式。默认值是'left'。</li>
     *      <li>id:String类型，说明表体这一列要显示后台返回的数据记录（JSON对象）中的哪个属性的值，如id:'name'表示这一列显示JSON对象的name属性的值。无默认值。</li>
     *      <li>wrap:Boolean类型，说明这一列的表头和表体当内容太多时是否允许自动换行显示，如wrap:true表示这一列的表头和表体在显示时自动换行（比如该列宽度是100px但是表体某td内容宽度是120px时则该td的内容自动换行显示）。默认值是false。</li>
     *      <li>renderer:Function类型，允许在显示该列的值是进行客户端处理。无默认值（不做转换直接输出，比如id是'name'的列将会直接把JSON行数据中的name属性的值显示在表格的td中）。有时可能需要进行一些处理，比如：<br/>
     *          <ul>
     *              <li>该td中的字体要加粗可以使用
     *                  <pre>
     *      renderer:function(value){
     *          return '&lt;b>'+value+'&lt;/b>';
     *      }
     *                  </pre>
     *              </li>
     *              <li>比如后台返回的数据中sex是0或1，页面中要转换为中文'男'和'女'可以使用
     *                  <pre>
     *      renderer:function(value){
     *          return value==0?'男':'女';
     *      }
     *                  </pre>
     *              </li>
     *              <li>比如一个后台返回的数据中score是分数，现要求100分输出为绿色的'满分'小于60分时输出红色的'不及格'其它的不变，可以使用
     *                  <pre>
     *      renderer:function(value){ 
     *          if(value==100){
     *              return value==100?'&lt;font color="green">满分&lt;/font>';
     *          }else if(value&lt;60){
     *              return '&lt;font color="red">不及格&lt;/font>';
     *          }else{
     *              return value;
     *          }
     *      }
     *                  </pre>
     *              </li>
     *          <ul>
     *      </li>
     * </ol>
     * 
     * 后台返回的数据格式如下（可以不包含空格换行等格式内容，大括号内的各属性顺序可任意交换）：<br/>
     * <pre>
     * {"total":126, "rows":
     *     [
     *         {"address":"CZ88.NET ","city":"IANA保留地址","id":"1"},
     *         {"address":"CZ88.NET ","city":"澳大利亚","id":"2"},
     *         {"address":"电信","city":"福建省","id":"3"},
     *         {"address":"CZ88.NET ","city":"澳大利亚","id":"4"},
     *         {"address":"CZ88.NET ","city":"泰国","id":"5"},
     *         {"address":"CZ88.NET ","city":"日本","id":"6"},
     *         {"address":"电信","city":"广东省","id":"7"},
     *         {"address":"CZ88.NET ","city":"日本","id":"8"}
     *     ]
     * }
     * </pre>
     * 
     * <b>其它特殊说明：</b><br/>
     * 单击一行时有可能会触发onRowSelect、onRowDeselect、onRowClick这些事件中一个一个或多个。具体结果是这样的：
     * <ol>
     *     <li>单选（一次只能选择一行）表格：①如果该行还未被选中，先触发其它已选择的行的onRowDeselect事件监听再触发该行的onRowSelect事件监听②触发该行的onRowClick事件监听。</li>
     *     <li>多选（一次可以选择多行）表格：①如果该行还未被选中，先触发该行的onRowSelect事件监听，如果该行已经选中，则先触发该行的onRowDeselect事件监听②触发该行的onRowClick事件监听。</li>
     * </ol>
     * 
     * @constructor
     * @description 构造函数. 
     * @param p 标准config对象：{}
     */
;(function($) {
    $.omGrid={
        lang:{
            loadingMsg:'正在加载数据，请稍候...',
            emptyMsg:'没有数据',
            errorMsg:'取数出错',
            pageText:'第{index}页，共{totalPage}页',
            pageStat:'共{total}条数据，显示{from}-{to}条'
        }
    };
    $.widget('om.omGrid', {
        options:/** @lends omGrid#*/{
            //外观
            /**
             * 表格高度，单位为px。
             * @default 462
             * @type Number
             * @example
             * $('.selector').omGrid({height : 300});
             */
            height:462,
            /**
             * 表格宽度，单位为px。
             * @type Number
             * @default '100%'
             * @example
             * $('.selector').omGrid({width : 600});
             */
            width:'100%',
            /**
             * 列数据模型。每一个元素都是一个对象字面量，定义该列的各个属性，这些属性包括:<br/>
             * header : 表头文字。<br/>
             * name : 与数据模型对应的字段。<br/>
             * align : 列文字对齐方式，可以为'left'、'center'、'right'之中的一个。<br/>
             * renderer : 列的渲染函数，接受2个参数，v表示当前值，row表示当前行号。<br/>
             * width : 列的宽度，取值为Number或者'autoExpand'。注意只能有一个列被设置为'autoExpand'属性。<br/>
             * wrap : 是否自动换行，取值为true或者false。<br/>
             * @type Array[JSON]
             * @default false
             * @example
             * 
             * $(".selector").omGrid({
             *      colModel : [ {
             *              header : '地区',          //表头文字
             *              name : 'city',          //与数据模型对应的字段
             *              width : 120,            //列宽,可设置具体数字，也可设置为'autoExpand'，表示自动扩展
             *              align : 'left',         //列文字对齐
             *              renderer : function(v, row) {   //列渲染函数，接受2个参数，v表示当前值，row表示当前行号
             *                  return '&lt;b>'+v+'&lt;/b>';  //地区这一列的文字加粗显示
             *              }
             *          }, {
             *              header : '地址',
             *              name : 'address',
             *              align : 'left',
             *              width : 'autoExpand'
             *          } 
             *      ]
             * });
             */
            colModel:false,
            /**
             * 是否自动拉伸各列以适应表格的宽度（比如共2列第一列宽度100第二列宽度200，则当表格总宽度是600px时第一列自动会变成200px第二列宽度会自动变成400px，而如果表格总宽度是210px时第一列自动会变成70px第二列宽度会自动变成140px）。<b>注意：只有所有列的宽度都不是'autoExpand'时该属性才会起作用。</b>
             * @default false
             * @type Boolean
             * @example
             * $('.selector').omGrid({autoFit : true});
             */
            autoFit:false,
            /**
             * 是否在最左边显示序号列。
             * @default true
             * @type Boolean
             * @example
             * $('.selector').omGrid({showIndex : false});
             */
            showIndex:true,
            //数据源
            /**
             * ajax取数方式对应的url地址。
             * @type String
             * @default 无
             * @example
             * //下面的示例设置的url，表示将从griddata.json这个地址取数，同时附带有start和limit两个请求参数。
             * //该文件必须返回一段具有特定格式（格式可参考文档的“预览”页签的说明）的JSON数据，omGrid拿到该数据即可用来填充表格。
             * $('.selector').omGrid({url:'griddata.json'});
             */
            dataSource:false,
            /**
             * 使用GET请求还是POST请求来取数据，取值为：'POST'或'GET'。
             * @type String
             * @default 'GET'
             * @example
             * $('.selector').omGrid({method : 'POST'});
             */
            method:'GET',
            /**
             * 正在取数时显示在分页条上的提示。
             * @type String
             * @default '正在加载数据，请稍候...'
             * @example
             * $('.selector').omGrid({loadingMsg : '取数中...'});
             */
            loadingMsg:$.omGrid.lang.loadingMsg,
            /**
             * 取数完成后但是后台没有返回任何数据时显示在分页条上的提示。
             * @type String
             * @default '没有数据'
             * @example
             * $('.selector').omGrid({emptyMsg : 'No data!'});
             */
            emptyMsg:$.omGrid.lang.emptyMsg,
            /**
             * 取数发生错误时显示在分页条上的提示。
             * @type String
             * @default '取数出错'
             * @example
             * $('.selector').omGrid({emptyMsg : '应用异常，请与网站管理员联系!'});
             */
            errorMsg:$.omGrid.lang.errorMsg,
            /**
             * 取数成功后的预处理，可以在取数成功后开始显示数据前对后台返回的数据进行一次预处理。<b>注意：此方法一定要返回一个值</b>。
             * @type Function
             * @default 无
             * @example
             * //将后台返回的数据中所有记录的id属性改名成name属性，并将sex中的0/1分别转换为'男'或'女'。
             * //如后台返回{"total":35,"rows":[{id:1,sex:0,password:'abc'},{id:2,sex:1,password:'def'}]}
             * //转换后结果为{"total":35,"rows":[{name:1,sex:'男',password:'abc'},{name:2,sex:'女',password:'def'}]}
             * $('.selector').omGrid({preProcess : function(data){
             *          var temp;
             *          for(var i=0,len=data.rows.length;i&lt;len;i++){
             *              temp=data.rows[i];
             *              temp.name=temp.id;
             *              temp.id=undefined;
             *              temp.sex= temp.sex==0?'男':'女';
             *          }
             *          return data;
             *      }
             * });
             */
            preProcess:false,
            //分页
            /**
             * 每页数据条数，比如每页要显示10条则设成10。<b>注意：如果设成0或负数则不分页</b>。此属性仅用于取数不用于显示（即如果limit设成10，取数时告诉后台要10条数据，如果后台非要返回15条数据，则页面会显示出15条而不是10条数据）。
             * @type Number
             * @default 15
             * @example
             * $('.selector').omGrid({limit : 15});
             */
            limit:15,
            /**
             * 显示在分页条上“上一页”和“下一页”按钮之间的文字。在显示时其中的{totalPage}会被替换为总页数，{index}会被替换为一个输入框（默认显示当前的页号，用户可以输入任意数字然后回车来跳转到指定的页）。
             * @type String
             * @default '第{index}页，共{totalPage}页'
             * @example
             * $('.selector').omGrid({pageText : '共{totalPage}页，转到{index}页'});
             */
            pageText:$.omGrid.lang.pageText,
            /**
             * 显示在分页条上的统计文字。在显示时其中的{total}会被替换为总记录数，{from}和{to}会被替换为当前显示的起止行号。比如可能会显示成'共125条数据，显示21-30条'。
             * @type String
             * @default '共{total}条数据，显示{from}-{to}条'
             * @example
             * $('.selector').omGrid({pageStat : '总共有{total}条记录，当前正在显示第{from}行至第{to}行'});
             */
            pageStat:$.omGrid.lang.pageStat,
            //行显示
            /**
             * 行样式，默认显示成斑马纹（奇偶行背景不一样）。当然用户也可以定义成3行一循环或5行一循环。也可以定义成一个Function来根据行数据不同显示成不同的样式（比如一个显示学生成绩的表格中把不及格的记录整行显示成红色背景，满分的记录整行显示成绿色背景）。
             * @type Array或Function
             * @default ['oddRow','evenRow']
             * @example
             * 
             * //示例1：结果表格中第1/4/7/10...行的tr会加上样式class1；
             * //第2/5/8/11...行的tr会加上样式class2；
             * //第3/6/9/12...行的tr会加上样式class3
             * $('.selector').omGrid({rowClasses : ['class1','class2','class2']});
             * 
             * //示例2：满分的行加上样式fullMarks，不及格的行加上样式flunk，其它行使用默认样式。
             * $('.selector').omGrid({rowClasses : function(rowIndex,rowData){
             *          if(rowData.score==100){
             *              reuturn 'fullMarks';
             *          }else if(rowData.score<60){
             *              return 'flunk';
             *          }
             *      }
             * });
             */
            rowClasses:['oddRow','evenRow'],
            //行选择
            /**
             * 是否只能单选（一次只能选择一条记录，选择第二条时第一条会自动取消选择）。若设置为false表示可以多选（选择其它行时原来已经选择的将继续保持选择状态）。<b>注意：设成true时将不会出现checkbox列，设成false则将自动出现checkbox列</b>。
             * @type Boolean
             * @default true
             * @example
             * $('.selector').omGrid({singleSelect : false});
             */
            singleSelect:true,
            
            //event
            /**
             * 选择一行记录后执行的方法。
             * @event
             * @type Function
             * @param rowIndex 行号（从0开始）
             * @param rowData 选择的行所代表的JSON对象
             * @default 无
             * @example
             *  $(".selector").omGrid({
             *      onRowSelect:function(rowIndex,rowData){
             *          alert('the '+rowIndex+'th row has been selected!');
             *      }
             *  });
             */
            onRowSelect:function(rowIndex,rowData){},
            /**
             * 取消一行记录的选择后执行的方法。
             * @event
             * @type Function
             * @param rowIndex 行号（从0开始）
             * @param rowData 选择的行所代表的JSON对象
             * @default 无
             * @example
             *  $(".selector").omGrid({
             *      onRowDeselect:function(rowIndex,rowData){
             *          alert('the '+rowIndex+'th row has been deselected!');
             *      }
             *  });
             */
            onRowDeselect:function(rowIndex,rowData){},
            /**
             * 单击一行记录后执行的方法。
             * @event
             * @type Function
             * @param rowIndex 行号（从0开始）
             * @param rowData 选择的行所代表的JSON对象
             * @default 无
             * @example
             *  $(".selector").omGrid({
             *      onRowClick:function(rowIndex,rowData){
             *          alert('the '+rowIndex+'th row has been clicked!city='+rowData.city);
             *      }
             *  });
             */
            onRowClick:function(rowIndex,rowData){},
            /**
             * 双击一行记录后执行的方法。
             * @event
             * @type Function
             * @param rowIndex 行号（从0开始）
             * @param rowData 选择的行所代表的JSON对象
             * @default 无
             * @example
             *  $(".selector").omGrid({
             *      onRowDblClick:function(rowIndex,rowData){
             *          alert('the '+rowIndex+'th row has been double clicked!city='+rowData.city);
             *      }
             *  });
             */
            onRowDblClick:function(rowIndex,rowData){},
            /**
             * 改变分页<b>之前</b>执行的方法。<b>注意：如果此方法返回false则不进行分页切换或跳转</b>。
             * @event
             * @type Function
             * @param type 切换类型，是'first'、'prev'、'next'、'last'、'input'之一。
             * @param newPage 要转到的页号（从1开始，第一页是1而不是0）
             * @default 无
             * @example
             *  $(".selector").omGrid({
             *      onPageChange:function(type,newPage){
             *          alert('will goto page '+newPage);
             *      }
             *  });
             */
            onPageChange:function(type,newPage){},
            /**
             * 从后台取数成功时执行的方法。
             * @event
             * @type Function
             * @param data 取回来的数据（ 格式是{"total":35,"rows":[{"id":11,"city":"河南省安阳市","address":"电信"},{"id":12,"city":"北京市","address":"北龙中网科技有限公司"},{"id":13,"city":"澳大利亚","address":"CZ88.NET"}]}  ）。
             * @param testStatus 响应的状态（参考jQuery的$.ajax的success属性）
             * @param XMLHttpRequest XMLHttpRequest对象（参考jQuery的$.ajax的success属性）
             * @default 无
             * @example
             *  $(".selector").omGrid({
             *      onSuccess:function(data,testStatus,XMLHttpRequest){
             *          alert('fetch data success,got '+data.rows+' rows');
             *      }
             *  });
             */
            onSuccess:function(data,testStatus,XMLHttpRequest){},
            /**
             * 从后台取数失败时执行的方法。
             * @event
             * @type Function
             * @param XMLHttpRequest XMLHttpRequest对象（参考jQuery的$.ajax的error属性）
             * @param testStatus 响应的状态（参考jQuery的$.ajax的error属性）
             * @param errorThrown 捕获的异常对象（参考jQuery的$.ajax的error属性）
             * @default 无
             * @example
             *  $(".selector").omGrid({
             *      onError:function(XMLHttpRequest,textStatus,errorThrown){
             *          alert('fetch data error');
             *      }
             *  });
             */
            onError:function(XMLHttpRequest,textStatus,errorThrown){},
            /**
             * 数据已全部显示到表体中后执行的方法。
             * @event
             * @type Function
             * @param nowPage 当前页号(第一页是1第二页是2)
             * @param pageRecords 当前页的所有记录
             * @default 无
             * @example
             * //数据显示完后自动选中所有地址是'电信'的行。
             *  $(".selector").omGrid({
             *      signleSelect:false,
             *      onRefresh:function(nowPage,pageRecords){
             *          var rows=[];
             *          $(pageRecords).each(function(i){
             *              if(this.address=='电信'){
             *                  rows.push(i);
             *              }
             *          });
             *          $('.selector').omGrid('setSelections',rows);
             *      }
             *  });
             */
            onRefresh:function(nowPage,pageRecords){}
        },
        //private methods
        _create:function(){
            var options=this.options,el=this.element.show() // show if hidden
                .attr({
                    cellPadding : 0,
                    cellSpacing : 0,
                    border : 0
                })
                .empty()
                .append('<tbody></tbody>');
            el.wrap('<div class="om-grid om-widget om-widget-content"><div class="bDiv"></div></div>').closest('.om-grid').width(options.width).height(options.height);
            var colModel=options.colModel;
            if(!$.isArray(colModel)){
                return; //如果colModel没设置或值不对，什么也不做
            }
            this.tbody=this.element.children().eq(0);
            this._buildTableHead();
            this._buildPagingToolBar();
            this._buildLoadMask();
            this._bindSelectAndClickEnvent();
            this._bindScrollEnvent();
            this._makeColsResizable();
        },
        _init:function(){
            if(!$.isArray(this.options.colModel)){
                return; //如果colModel没设置或值不对，什么也不做
            }
            var el=this.element,
                op = this.options,
                grid = el.closest('.om-grid'),
                theadHeight = grid.children('.hDiv').outerHeight(),
                pagingToolBarHeight = grid.children('.pDiv').outerHeight() || 0,
                tbody = grid.children('.bDiv');
            tbody.height(grid.height()-theadHeight-pagingToolBarHeight);
            this.pageData={nowPage:1,totalPages:1};
            this._populate();
        },
        _setOption : function(key, value) {
            //todo
            var options=this.options,oldValue=options[key];
            options[key]=value;
            switch(key){
                case 'colModel':
                    //重绘表头和表体。不需要重新加载数据，也不需要重绘工具栏
                    break;
                case 'dataSource':
                case 'limit':
                    //调用reload(0)
                    break;
                case 'autoFit':
                    //重新计算各列的宽度
                    break;
                case 'height':
                    //简单修改grid高度即可
                    break;
                case 'width':
                    //先修改grid宽度，然后如果autoFit=true还要重新计算各列的宽度
                    break;
                case 'pageText':
                    //简单修改
                    break;
                case 'fillEmptyRows':
                    //value=true判断将前records.length是否小于limit，如果是添加空行
                    //value=false判断将前records.length是否小于limit，如果是删除空行
                    break;
                case 'wrap':
                    //修改td的样式即可
                    break;
                case 'singleSelect':
                    //添加或删除checkbox列,selections只保留最后一行。autoFit=true还要重新计算各列的宽度
                    break;
                case 'rowClasses':
                    //先遍历oldValue依次去掉样式，再遍历newValue依次添加
                    break;
                case 'paged':
                    //
                    break;
                default:
                    //简单修改options
                    options[key]=value;
            }
        },
        _buildTableHead:function(){
            var op=this.options,
                el=this.element,
                grid = el.closest('.om-grid'),
                cms=op.colModel,
                allColsWidth = 0, //colModel的宽度
                indexWidth = 0, //colModel的宽度
                checkboxWidth = 0, //colModel的宽度
                autoExpandColIndex = -1;
                thead=$('<thead></thead');
                tr=$('<tr></tr>').appendTo(thead);
            //渲染序号列
            if(op.showIndex){
                var cell=$('<th></th').attr({axis:'indexCol',align:'center'}).addClass('indexCol').append($('<div class="indexheader" style="text-align:center;width:25px;"></div'));
                tr.append(cell);
                indexWidth=25;
            }
            //渲染checkbox列
            if(!op.singleSelect){
                var cell=$('<th></th').attr({axis:'checkboxCol',align:'center'}).addClass('checkboxCol').append($('<div class="checkboxheader" style="text-align:center;width:17px;"><span class="checkbox"/></div'));
                tr.append(cell);
                checkboxWidth=17;
            }
            //渲染colModel各列
            for (var i=0,len=cms.length;i<len;i++) {
                var cm=cms[i],cmWidth = cm.width || 60,cmAlign=cm.align || 'center';
                if(cmWidth == 'autoExpand'){
                    cmWidth = 0;
                    autoExpandColIndex = i;
                }
                var thCell=$('<div></div').html(cm.header).css({'text-align':cmAlign,width:cmWidth});
                cm.wrap && thCell.addClass('wrap');
                var th=$('<th></th').attr('axis', 'col' + i).addClass('col' + i).append(thCell);
                if(cm.name) {
                    th.attr('abbr', cm.name);
                }
                if(cm.align) {
                    th.attr('align',cm.align);
                }
                //var _div=$('<div></div>').html(cm.header).attr('width', cmWidth);
                allColsWidth += cmWidth;
                tr.append(th);
            }
            //tr.append($('<th></th'));
            el.prepend(thead);
            
            var hDiv = $('<div class="hDiv om-state-default"></div>').append('<div class="hDivBox"><table cellPadding="0" cellSpacing="0"></table></div>');
            el.parent().before(hDiv);
            
                $('table',hDiv).append(thead);
            //修正各列的列宽
            if(autoExpandColIndex != -1){ //说明有某列要自动扩充
                var tableWidth=grid.width()-20,
                    //usableWidth=tableWidth-allColsWidth-indexWidth-checkboxWidth;
                    usableWidth=tableWidth-thead.width();
                    toBeExpandedTh=tr.find('th[axis="col'+autoExpandColIndex+'"] div');
                if(usableWidth<=0){
                    toBeExpandedTh.css('width',60);
                }else{
                    toBeExpandedTh.css('width',usableWidth);
                }
            }else if(op.autoFit){
                //var tableWidth=el.width(),
                 //   usableWidth=tableWidth-indexWidth-checkboxWidth;
                var tableWidth=grid.width()-20,
                    usableWidth=tableWidth-thead.width(),
                    percent=1+usableWidth/allColsWidth,
                    toFixedThs=tr.find('th[axis^="col"] div');
                for (var i=0,len=cms.length;i<len;i++) {
                    var col=toFixedThs.eq(i);
                    col.css('width',parseInt(col.width()*percent));
                }
            }
            this.thead=thead;
            thead = null;
        },
        _buildPagingToolBar:function(){
            var op=this.options;
            if(op.limit<=0){
                return;
            }
            var self=this,
                el=this.element,
                pDiv=$('<div class="pDiv om-state-default">'+
                          '<div class="pDiv2">'+
                            '<div class="pGroup">'+
                                '<div class="pFirst pButton om-icon"><span class="om-icon-seek-start"></span></div>'+
                                '<div class="pPrev pButton om-icon"><span class="om-icon-seek-prev"></span></div>'+
                            '</div>'+
                            '<div class="btnseparator"></div>'+
                            '<div class="pGroup"><span class="pControl"></span></div>'+
                            '<div class="btnseparator"></div>'+
                            '<div class="pGroup">'+
                                '<div class="pNext pButton om-icon"><span class="om-icon-seek-next"></span></div>'+
                                '<div class="pLast pButton om-icon"><span class="om-icon-seek-end"></span></div>'+
                            '</div>'+
                            '<div class="btnseparator"></div>'+
                            '<div class="pGroup">'+
                                '<div class="pReload pButton om-icon"><span class="om-icon-refresh"></span></div>'+
                            '</div>'+
                            '<div class="btnseparator"></div>'+
                            '<div class="pGroup"><span class="pPageStat"></span></div>'+
                       '</div></div>');
            var pageText = op.pageText.replace(/{totalPage}/, '<span>1</span>').replace(/{index}/, '<input type="text" size="4" value="1" />');
            $('.pControl',pDiv).html(pageText);
            el.parent().after(pDiv);
            $('.pReload', pDiv).click(function() {
                self._populate();
            });
            $('.pFirst', pDiv).click(function() {
                self._changePage('first');
            });
            $('.pPrev', pDiv).click(function() {
                self._changePage('prev');
            });
            $('.pNext', pDiv).click(function() {
                self._changePage('next');
            });
            $('.pLast', pDiv).click(function() {
                self._changePage('last');
            });
            $('.pControl input', pDiv).keydown(function(e) {
                if (e.keyCode == 13) {
					self._changePage('input');
				}
            });
            $('.pButton', pDiv).hover(function() {
                $(this).addClass('om-state-hover');
            }, function() {
                $(this).removeClass('om-state-hover');
            });
            this.pager=pDiv;
        },
        _buildLoadMask:function(){
            var self=this,
                op=this.options,
                el=this.element,
                grid = el.closest('.om-grid'),
                loadMask=$('<div class="gBlock"><div align="center" class="gBlock-valignMiddle" ><div class="loadingImg" style="display:block"/></div></div>')
                    .css({width:grid.width(),height:grid.height()})
                    .mousedown(function(e){
                        return false;  //禁用双击（默认双击全把div下面的内容全选）
                    })
                    .hide();
            grid.append(loadMask);
            this.loadMask=loadMask;
        },
        _changePage : function(ctype) { // change page
            if (this.loading) {
                return true;
            }
            var el=this.element,
                op=this.options,
                grid = el.closest('.om-grid'),
                pageData = this.pageData,
                nowPage=pageData.nowPage,
                totalPages=pageData.totalPages,
                newPage = nowPage;
            switch (ctype) {
                case 'first':
                    newPage = 1;
                    break;
                case 'prev':
                    if (nowPage > 1) {
                        newPage = nowPage - 1;
                    }
                    break;
                case 'next':
                    if (nowPage < totalPages) {
                        newPage = nowPage + 1;
                    }
                    break;
                case 'last':
                    newPage = totalPages;
                    break;
                case 'input':
                    var nv = parseInt($('.pControl input', el.closest('.om-grid')).val());
                    if (isNaN(nv)) {
                        nv = nowPage;
                    }
                    if (nv < 1) {
                        nv = 1;
                    } else if (nv > totalPages) {
                        nv = totalPages;
                    }
                    $('.pControl input', this.pDiv).val(nv);
                    newPage = nv;
                    break;
                default:
                    if (/\d/.test(ctype)) {
                        var nv = parseInt(ctype);
                        if (isNaN(nv)) {
                            nv = 1;
                        }
                        if (nv < 1) {
                            nv = 1;
                        } else if (nv > totalPages) {
                            nv = totalPages;
                        }
                        $('.pControl input', el.closest('.om-grid')).val(nv);
                        newPage = nv;
                    }
            }
            if (newPage == nowPage) {
                return false;
            }
            //触发事件
            if(op.onPageChange(ctype,newPage)===false){
                return;
            }
            //修改pageData
            pageData.nowPage=newPage;
            //翻页时去掉全选状态
            $('th.checkboxCol span.checkbox',grid).removeClass('selected');
            //刷新数据
            this._populate();
        },
        //刷新数据
        _populate : function() { // get latest data
            var self=this,
                el = this.element,
                grid = el.closest('.om-grid'),
                op = this.options,
                pageStat = $('.pPageStat', grid);
            if (!op.dataSource) {
                $('.pPageStat', grid).html(op.emptygMsg);
                return false;
            }
            if (this.loading) {
                return true;
            }
            var pageData = this.pageData,
                nowPage = pageData.nowPage || 1,
                loadMask = $('.gBlock',grid);
            //具备加载数据的前提条件了，准备加载
            this.loading = true;
            pageStat.html(op.loadingMsg);
            loadMask.show();
            if ($.browser.opera) {
                $(grid).css('visibility', 'hidden');
            }
            var limit = (op.limit<=0)?100000000:op.limit;
            var param = [ {
                name : 'start',
                value : limit * (nowPage - 1)
            }, {
                name : 'limit',
                value : limit
            }, {
                name : '_time_stamp_',
                value : new Date().getTime()
            } ];
            $.ajax({
                type : op.method,
                url : op.dataSource,
                data : param,
                dataType : 'json',
                success : function(data,textStatus,request) {
                    var onSuccess = op.onSuccess;
                    if (typeof(onSuccess) == 'function') {
                        onSuccess(data,textStatus,request);
                    }
                    self._addData(data);
                    op.onRefresh(nowPage,data.rows);
                    loadMask.hide();
                    self.loading = false;
                },
                error : function(XMLHttpRequest, textStatus, errorThrown) {
                    pageStat.html(op.errorMsg).css('color','red');
                    try {
                        var onError = op.onError;
                        if (typeof(onError) == 'function') {
                            onError(XMLHttpRequest, textStatus, errorThrown);
                        }
                    } catch (e) {
                        // do nothing 
                    } finally {
                        loadMask.hide();
                        self.loading = false;
                        return false;
                    }
                    
                }
            });
        },
        _addData:function(data){
            var op = this.options,
                el = this.element,
                grid = el.closest('.om-grid'),
                pageStat = $('.pPageStat', grid),
                preProcess = op.preProcess,
                pageData=this.pageData;
            //预处理
            preProcess && (data=preProcess(data));
            pageData.data=data;
            pageData.totalPages = Math.ceil(data.total/op.limit);
            //刷新分页条
            this._buildPager();
            this._renderDatas();
        },
        _buildPager:function(){
            var op=this.options;
            if(op.limit<=0){
                return;
            }
            var el=this.element,
                pager=this.pager,
                pControl=$('.pControl',pager),
                pageData = this.pageData,
                nowPage=pageData.nowPage,
                totalPages=pageData.totalPages,
                data=pageData.data,
                from=op.limit* (nowPage-1)+1,
                to=from-1+data.rows.length,
                pageStat='';
            if(data.total===0){
                pageStat=op.emptyMsg;
            }else{
                pageStat = op.pageStat.replace(/{from}/, from).replace(/{to}/, to).replace(/{total}/, data.total);
            }
            $('input',pControl).val(nowPage);
            $('span',pControl).html(totalPages);
            $('.pPageStat', pager).html(pageStat);
        },
        _renderDatas:function(from,to){
            var self=this,
                el=this.element,
                op=this.options,
                grid=el.closest('.om-grid'),
                gridHeaderCols=$('.hDiv thead tr:first th',grid),
                rows=this.pageData.data.rows,
                colModel=op.colModel,
                rowClasses=op.rowClasses,
                tbody=$('tbody',el).empty(),
                isRowClassesFn= (typeof rowClasses === 'function'),
                pageData = this.pageData,start=(pageData.nowPage-1)*op.limit;
            $.each(rows,function(i, rowData) {
                var rowCls = isRowClassesFn? rowClasses(i,rowData):rowClasses[i % rowClasses.length];
                var tr=$('<tr></tr>').addClass(rowCls);
                var rowValues=self._buildRowCellValues(colModel,rowData,i);
                $(gridHeaderCols).each(function(){
                    var axis = $(this).attr('axis'),wrap=false,html;
                    if(axis == 'indexCol'){
                        html=i+start+1;
                    }else if(axis == 'checkboxCol'){
                        html = '<span class="checkbox"/>';
                    }else{
                        var colIndex=axis.substring(3);
                        html=rowValues[colIndex];
                        if(colModel[colIndex].wrap){
							wrap=true;
						} 
                    }
                    var td = $('<td></td>').attr({align:this.align,abbr:this.abbr}).addClass(axis).append($('<div></div>').html(html).addClass(wrap?'wrap':'').attr({'align':this.align}).width($('div',$(this)).width()));
                    tr.append(td);
                });
                tbody.append(tr);
            });
        },
        _buildRowCellValues:function(colModel,rowData,rowIndex){
            var len=colModel.length,values=[];
            for(var i=0;i<len;i++){
                var c=colModel[i],v=rowData[c.name],r=c.renderer;
                if(typeof r === 'function'){
                    v=r(v,rowIndex);
                }
                values[i]=v;
            }
            return values;
        },
        //滚动水平滚动条时让表头和表体一起滚动（如果没有这个方法则只有表体滚动，表头不会动，表头和表体就对不齐了）
        _bindScrollEnvent:function(){
            var hDiv=this.thead.closest('.hDiv');
            this.tbody.closest('.bDiv').scroll(function(){
                hDiv.scrollLeft($(this).scrollLeft());
            });
        },
        //绑定行选择/行反选/行单击/行双击等事件监听
        _bindSelectAndClickEnvent:function(){
            var self=this;
            //如果有checkbo列则绑定事件
            if(!this.options.singleSelect){ //可以多选
                // 全选/反选,不需要刷新headerChekcbox的选择状态
                $('th.checkboxCol span.checkbox',this.thead).click(function(){
                    var thCheckbox=$(this),trSize=$('tr',this.tbody).size();
                    if(thCheckbox.hasClass('selected')){ //说明是要全部取消选择
                        thCheckbox.removeClass('selected');
                        for(var i=0;i<trSize;i++){
                            self._rowDeSelect(i);
                        }
                    }else{ //说明是要全选
                        thCheckbox.addClass('selected');
                        for(var i=0;i<trSize;i++){
                            self._rowSelect(i);
                        }
                    }
                });
                //行单击,需要刷新headerChekcbox的选择状态
                this.tbody.delegate('tr','click',function(){
                    var row=$(this),index=row.index();
                    if(row.hasClass('om-state-highlight')){ //已选择
                        self._rowDeSelect(index);
                    }else{
                        self._rowSelect(index);
                    }
                    self._refreshHeaderCheckBox();
                    self.options.onRowClick(index,self._getRowData(index));
                });
                //行双击
                this.tbody.delegate('tr','dblclick',function(){
                    var row=$(this),index=row.index();
                    if(row.hasClass('om-state-highlight')){ //已选择
                        //do nothing
                    }else{
                        self._rowSelect(index);
                        self._refreshHeaderCheckBox();
                    }
                    self.options.onRowDblClick(index,self._getRowData(index));
                });
            }else{ //不可多选
                //行单击
                this.tbody.delegate('tr','click',function(){
                    var row=$(this),index=row.index();
                    if(row.hasClass('om-state-highlight')){ //已选择
                        // no need to deselect another row and select this row
                    }else{
                        var lastSelectedIndex = $('tr.om-state-highlight',self.tbody).index();
                        (lastSelectedIndex != -1) && self._rowDeSelect(lastSelectedIndex);
                        self._rowSelect(index);
                    }
                    self.options.onRowClick(index,self._getRowData(index));
                });
                
                //行双击,因为双击一定会先触发单击，所以对于单选表格双击时这一行一定是选中的，所以不需要强制双击前选中
                this.tbody.delegate('tr','dblclick',function(){
                    var index=$(this).index();
                    self.options.onRowDblClick(index,self._getRowData(index));
                });
            }
        },
        _getRowData:function(index){
            return this.pageData.data.rows[index];
        },
        _rowSelect:function(index){
             var el=this.element,
                op=this.options,
                tbody=$('tbody',el),
                tr=$('tr:eq('+index+')',tbody),
                chk=$('td.checkboxCol span.checkbox',tr);
            tr.addClass('om-state-highlight');
            chk.addClass('selected');
            op.onRowSelect(index,this._getRowData(index));
        },
        _rowDeSelect:function(index){
            var self=this,
                el=this.element,
                op=this.options,
                tbody=$('tbody',el),
                tr=$('tr:eq('+index+')',tbody),
                chk=$('td.checkboxCol span.checkbox',tr);
            tr.removeClass('om-state-highlight');
            chk.removeClass('selected');
            op.onRowDeselect(index,this._getRowData(index));
        },
        _refreshHeaderCheckBox:function(){
            var selectedRowSize=$('td.checkboxCol span.selected',this.tbody).size(),
                headerCheckbox = $('th.checkboxCol span.checkbox',this.thead);
            if(selectedRowSize < this.pageData.data.rows.length){
                headerCheckbox.removeClass('selected');
            }else{
                headerCheckbox.addClass('selected');
            }
        },
        //让列可以改变宽度（index列和checkbox列不可以改变宽度）
        _makeColsResizable:function(){
            var self=this,
                bDiv=self.tbody.closest('.bDiv'),
                grid=self.element.closest('.om-grid'),
                pDiv=self.pager; 
            $('th[axis^="col"] div',self.thead).resizable({
                handles: 'e',//只可水平改变大小
                containment: 'document',
                minWidth: 60,
                resize: function(event, ui) {
                    var _this=$(this),abbr=_this.parent().attr('abbr'),dataCells=$('td[abbr="'+abbr+'"] > div',self.tbody),hDiv=self.thead.closest('.hDiv');
                    _this.width(ui.size.width).height('');
                    dataCells.width(ui.size.width).height('');
                    bDiv.height(grid.height()-hDiv.outerHeight()-pDiv.outerHeight());
                }
            });
        },

        //public methods
        /**
         * 修改取数url并立即刷新数据。一般用于查询操作。比如开始时取数url是data.json则后台实际收到data.json?start=0&limit=15这样的请求。查询时使用setData方法将取数url改成data.json?queryString=admin，后台实际收到data.json?queryString=admin&start=0&limit=15这样的请求，后台根据参数queryString来做查询即可。
         * @name omGrid#setData
         * @function
         * @param url 新的数据源url
         * @returns jQuery对象
         * @example
         *  //使用新的url来取数，设置完后会立即开始刷新表格数据。
         *  $('.selector').omGrid('setData', 'newgriddata.json');
         */
        setData:function(url){
            this.options.dataSource=url;
            this.pageData={nowPage:1,totalPages:1};
            this._populate();
        },
        /**
         * 获取表格JSON数据。<br/>
         *     
         * @name omGrid#getData
         * @function
         * @returns 如果没有设置preProcess则返回由后台返回来的对象。如果有preProcess则返回处理后的对象
         * @example
         * //获取grid的数据源
         * var store = $('.selector').omGrid('getData');
         * 
         * 
         */
        getData:function(){
            return this.pageData.data;
        },
        /**
         * 使用getData方法的结果重新渲染数据。<b>注意：该方法并不会发送Ajax请求，而且如果表格当前正在加载数据（loadmask还未消失）的话则什么也不做直接返回</b>。
         * @name omGrid#refresh
         * @function
         * @returns jQuery对象
         * @example
         * //根据当前grid数据模型中的数据，重新刷新grid
         * $('.selector').omGrid('refresh');//注意refresh没有传入参数
         * 
         */
        refresh:function(){
            // 修改数据模型后可以用此方法来强制刷新（仅客户端行为,不向后台发送请求）
            if (this.loading) {
                return true;
            }
            this.loading = true;
            var op=this.options;
            $('.pPageStat', this.pager).html(op.loadingMsg);
            this.loadMask.show();
            this._buildPager();
            this._renderDatas();
            op.onRefresh(this.pageData.nowPage || 1,this.pageData.data.rows);
            this.loadMask.hide();
            this.loading = false;
        },
        /**
         * 刷新表格。如果没有参数则刷新当前页，如果有参数则转到参数所表示的页（如果参数不合法会自动进行修正）。<b>注意：该方法会发送Ajax请求，而且如果表格当前正在加载数据（loadmask还未消失）的话则什么也不做直接返回</b>。
         * @name omGrid#reload
         * @function
         * @param page 要转到的页，参数为空表示刷新当前页。如果参数不是数字或者小于1则自动修正为1，如果参数大于总页数则自动修正为总页数。
         * @returns jQuery对象
         * @example
         * $('.selector').omGrid('reload');//刷新当前页
         * $('.selector').omGrid('reload',3);//转到第3页
         * 
         */
        reload:function(page){
            if (this.loading) {
                return true;
            }
            if(typeof page !=='undefined'){
                page=parseInt(page) || 1;
                if(page<0){
                    page = 1;
                }
                if(page>this.pageData.totalPages){
                    page=this.pageData.totalPages;
                }
                this.pageData.nowPage = page;
            }
            //相当于goto(page) and reload()，会转到那一页并重新刷新数据（向后台发送请求）
            //没有参数时刷新当前页
            this._populate();
        },
        /**
         * 选择行。<b>注意：传入的参数是序号（第一行是0第二行是1）数组（比如[0,1]表示选择第一行和第二行）；要想清除所有选择，请使用空数组[]作为参数；只能传入序号数组，如果要做复杂的选择算法，请先在其它地方算好序号数组后后调用此方法；此方法会清除其它选择状态，如选择第1,2行然后setSelections([3])最后结果中只有第3行，如setSelections([3,4]);setSelections([5,6])后只会选择5,6两行</b>。
         * @name omGrid#setSelections
         * @function
         * @param indexes 序号（第一行是0第二行是1）数组。
         * @returns jQuery对象
         * @example
         * //选择表格中第二行、第三行、第五行
         * $('.selector').omGrid('setSelections',[1,2,4]);
         * 
         */
        setSelections:function(indexes){
            var self=this;
            if(!$.isArray(indexes)){
                indexes=[indexes];
            }
            var selected=this.getSelections();
            $(selected).each(function(){
                self._rowDeSelect(this);
            });
            $(indexes).each(function(){
                self._rowSelect(this);
            });
        },
        /**
         * 获取选择的行的行号或行记录。<b>注意：默认返回的是行序号组成的数组（如选择了第2行和第5行则返回[1,4]），如果要返回行记录JSON组成的数组需要传入一个true作为参数</b>。
         * @name omGrid#getSelections
         * @function
         * @param needRecords 参数为true时返回的不是行序号数组而是行记录数组。参数为空或不是true时返回行序号数组。
         * @returns jQuery对象
         * @example
         * var selectedIndexed = $('.selector').omGrid('getSelections');
         * var selectedRecords = $('.selector').omGrid('getSelections',true);
         * 
         */
        getSelections:function(needRecords){
            //needRecords=true时返回Record[],不设或为false时返回index[]
            var self=this,trs=$('tr.om-state-highlight',this.tbody),result=[];
            if(needRecords){
                var rows=self.pageData.data.rows;
                trs.each(function(){
                    result[result.length]=rows[$(this).index()];
                });
            }else{
                trs.each(function(){
                    result[result.length]=$(this).index();
                });
            }
            return result;
        }
    });
})(jQuery);/*
 * $Id: om-menu.js,v 1.22 2012/01/16 01:48:41 linxiaomin Exp $
 * operamasks-ui om-menu.js 1.0
 *
 * Copyright 2011, AUTHORS.txt (http://ui.operamasks.org/about)
 * Dual licensed under the MIT or GPL Version 2 licenses.
 * http://ui.operamasks.org/license
 *
 * http://ui.operamasks.org/docs/
 *
 * Depends:
 *	jquery.ui.core.js
 *	jquery.ui.widget.js
 */
;(function($){
    /**
     * @name omMenu
     * @class menu组件。menu组件支持三种数据组织方式，分别为页面dom元素、json数据、url取值。<br/>
     *        基本的json格式为{id:"",label:"",icon:"img/abc.png",seperator:true,disabled:true,children:[{},{}]},其中的id和label必须设置，<br/>
     *        seperator为分割线，如果设置为true，则会在当前menuItem下面增加一条分割线。<br/><br/>
     *        组件默认会处理的属性为上面列举的6个，即id、label、icon、seperator、disabled、children。<br/>
     *        如果你自定义了某个属性，比如url，系统不会处理，它是在点击的时候交给onSelect方法处理，通过item.url获取url参数。
     * <b>特点：</b><br/>
     * <ol>
     *      <li>支持icon自定制</li>
     *      <li>灵活的事件处理机制，自由增加json属性，事件执行时获取数据进行处理</li>
     *      <li>支持动态改变menuItem的disabled属性</li>
     *      <li>支持右键菜单，无需指定位置，自动定位</li>
     *      <li>支持菜单分组，使用showSeparator属性配置</li>
     * </ol>
     * 
     * <b>示例：</b><br/>
     * <pre>
     * &lt;script type="text/javascript" &gt;
     * $(document).ready(function() {
     *      //menu定义
     *      $('#contextMenu').omMenu({
     *          contextMenu : true,
     *          dataSource : '../../omMenu.json'
     *      });
     *      //显示menu菜单
     *      $('#contextMenu_test').bind('contextmenu',function(e){
     *           $('#contextMenu').omMenu('show',e);
     *      });
     * });
     * &lt;/script&gt;
     * </pre>
     * 
     * @constructor
     * @description 构造函数. 
     * @param p 标准config对象：{}
     */
    $.widget('om.omMenu', {
        options: /**@lends omMenu# */{
            /**
             * 是否为右键菜单
             * @type Boolean 
             * @default false
             * @example
             * $("#menu_1").omMenu({contextMenu:true});
             */
            contextMenu : false,
            
            /**
             * 最大宽度，如果menuItem文字长度超出了最大宽度，将会隐藏，鼠标移动到上面会有全文提示
             * @type Number 
             * @default 200
             * @example
             * $("#menu_1").omMenu({maxWidth:150});
             */
            maxWidth : 200,
            
            /**
             * 最小宽度，如果menuItem文字长度少于minWidth，则将使用空白填充。
             * @type Number 
             * @default 100
             * @example
             * $("#menu_1").omMenu({minWidth:50});
             */
            minWidth : 100,
            
            /**
             * 数据源，可以设置为json数据，也可以是url，如果不设置则为local，默认使用页面的dom元素生成Menu
             * @type String 
             * @default local
             * @example
             * $("#menu_1").omMenu({dataSource:'menuData.json'});
             */
            dataSource : 'local'
            
            /**
             * 当点击选择menu的时候触发的事件，item包含当前menuItem的所有数据。
             * @name omMenu#onSelect
             * @event
             * @type Function
             * @default 无
             * @example
             * $("#menu_1").omMenu({
             *         onSelect:function(item){
             *            location.href = item.url;
             *         }
             * });
             */
        },
        
        /**
         * 显示menu，menu不会自己显示，必须调用show方法才能显示
         * @name omMenu#show
         * @function
         * @param triggerEle 触发显示事件的对象，如点击的button触发的就是button对象
         * @example
         * //通过点击button显示menu
         *  $('#btn').click(function(){
         *     $('#menu_simple').omMenu('show',this);
         *});
         */
        show : function(triggerEle){
            var self = this, options = self.options , top , left, element = self.element;
            if( options.contextMenu ){
                top = triggerEle.pageY;
                left = triggerEle.pageX;
                triggerEle.preventDefault();
                triggerEle.stopPropagation();
                triggerEle.cancelBubble=true; //IE
            }else{
                var buttomWidth = parseInt($(triggerEle).css('borderBottomWidth').replace('px',''));
                var offSet = $(triggerEle).offset();
                top = offSet.top +  $(triggerEle).height() + (buttomWidth != 'NaN'?buttomWidth:0) + 1; //1px作为调节距离
                left = offSet.left +  1;
            }
            $(element).css({"top":top,'left':left}).show();
            $(element).children("ul.om-menu").show();
        },
        
        /**
         * 隐藏menu，隐藏之后会清空menu当前的状态。
         * @name omMenu#hide
         * @function
         * @example
         * //调用hide方法
         *  $('#btn').click(function(){
         *     $('#menu_simple').omMenu('hide');
         *});
         */
        hide : function(){
            this._hide();
        },
        
        /**
         * 将某个menuitem设置为disabled，设置之后menuitem将不会触发事件，如果有子菜单将不能打开子菜单，必须有menuItem。
         * @name omMenu#disableItem
         * @function
         * @param itemId menuItem的ID
         * @example
         * //调用disableItem方法
         *  $('#btn').click(function(){
         *     $('#menu_simple').omMenu('disableItem','001');
         *});
         */
        disableItem : function(itemId){
            var self = this , element = self.element;
            var cli = element.find("#"+itemId);
                cli.addClass("om-state-disabled");
                cli.unbind("mouseenter.menuItem").unbind("mouseleave.menuItem").unbind("mousedown.menuItem");
        },
        /**
         * 将某个menuitem设置为enable。
         * @name omMenu#enableItem
         * @function
         * @param itemId menuItem的ID
         * @example
         * //调用enableItem方法
         *  $('#btn').click(function(){
         *     $('#menu_simple').omMenu('enableItem','001');
         *});
         */
        enableItem : function(itemId){
            var self = this , element = self.element;
            var cli = element.find("#"+itemId);
                cli.removeClass("om-state-disabled");
                self._bindLiEvent(cli);
        },
        
        _create:function(){
            var elem = this.element , options = this.options;
            $(elem).css({"position":"absolute","minWidth":options.minWidth,"maxWidth":options.maxWidth-10})
                   .addClass('om-menu-container om-menu-content om-corner-all');
            if($.browser.msie && $.browser.version == '6.0') $(elem).css("width",options.minWidth + 30); //TODO
        },
        
        _init : function(){
            var self = this , options = self.options , 
                target = self.element,
                source = options.dataSource;
            if(source) {
               if(source != 'local'){
                    if(typeof source == 'string'){
                        self._ajaxLoad(target,source);
                    }else if(typeof source == 'object'){
                        target.append(self._appendNodes.apply(self, [source]));
                        self._bindEvent();
                    }
               }else{
                   var firstMenu = self.element.children("ul").addClass("om-menu");
                   self._parseDomMenu(firstMenu);
                   self._bindEvent();
               }
            }
        },
        
        _ajaxLoad : function(target,source){
             var self = this ;
             $.ajax({
                 url : source,
                 method: 'POST',
                 dataType: 'json',
                 success: function(data){
                     target.append(self._appendNodes.apply(self, [data]));
                     self._bindEvent();
                 }
             });
        },
        _appendNodes : function(source,index){
            var self = this , menuHtml = [];
            var ulClass = (index == undefined)?"om-menu":"om-menu-content";
            var display = (index == undefined)?"block":"none";
            var imgClass = (index == undefined)?"om-menu-icon" : "om-menu-icon om-menu-icon-child";
            menuHtml.push("<ul class=\""+ulClass+" om-corner-all\" style=\"display:"+display+";\">");
            var childrenHtml = [];
            $(source).each(function(index , item){
                    if(item.children != null){
                        if(item.disabled === true || item.disabled == "true"){
                            childrenHtml.push("<li id=\""+item.id+"\" aria-haspopup=\"true\"  class=\"om-state-disabled\">");
                        }else{
                            childrenHtml.push("<li id=\""+item.id+"\"  aria-haspopup=\"true\">");
                        }
                        childrenHtml.push("<a href=\"javascript:void(0)\" class=\"om-corner-all om-menu-indicator\">");
                        item.icon?childrenHtml.push("<img class=\""+imgClass+"\" src=\""+item.icon+"\">"):null;
                        item.icon?childrenHtml.push("<span>"+item.label+"</span>"):childrenHtml.push("<span style=\"margin-left:2em;\">"+item.label+"</span>");
                        childrenHtml.push("<span class=\"ui-icon-span\" role=\"popup\"></span>");
                        childrenHtml.push("</a>");
                        childrenHtml.push(self._appendNodes(item.children,index++));
                        childrenHtml.push("</li>");
                    }else{
                        if(item.disabled === true || item.disabled == "true"){
                            childrenHtml.push("<li id=\""+item.id+"\"  class=\"om-state-disabled\">");
                        }else{
                            childrenHtml.push("<li id=\""+item.id+"\" >");
                        }
                        childrenHtml.push("<a href=\"javascript:void(0)\" class=\"om-corner-all om-menu-indicator\">");
                        item.icon?childrenHtml.push("<img class=\""+imgClass+"\" src=\""+item.icon+"\">"):null;
                        item.icon?childrenHtml.push("<span>"+item.label+"</span>"):childrenHtml.push("<span style=\"margin-left:2em;\">"+item.label+"</span>");
                        childrenHtml.push("</a>");
                        childrenHtml.push("</li>");
                    }
                    if(item.seperator == "true" || item.seperator == true){
                        childrenHtml.push("<li class=\"om-menu-sep-li\"  ><span class=\"om-menu-item-sep\">&nbsp;</span></li>");
                    }
                    var li = $(self.element).attr('id') + "_"+item.id;
                    $(self.element).data(li , item);
            });
            menuHtml.push(childrenHtml.join(""));
            menuHtml.push("</ul>");
            return menuHtml.join("");
        },
        
        //处理页面编写dom节点的情况
        _parseDomMenu : function(element){
            if(element.parent().attr("aria-haspopup") == "true"){ //判断是否为第一帧
                element.addClass("om-menu-content om-corner-all").css("display","none");
            }
            var lis = element.children();
            for(var i=0;i<lis.length;i++){
                var li = $(lis[i]) , liCul = li.children("ul");
                if(liCul.length > 0){
                    li.attr("aria-haspopup","true");
                    li.find("span[role='popup']").addClass("ui-icon-span");
                    this._parseDomMenu(liCul);
                }
                li.find("a").addClass("om-corner-all om-menu-indicator");
                li.find("img").addClass("om-menu-icon");
            }
        },
        _showChildren : function(li){
            if(li && li.length > 0){
                var li_child_ul = li.children("ul").eq(0);
                li_child_ul.css({"minWidth":this.options.minWidth,"maxWidth":this.options.maxWidth, "top":li.position().top });
                if($.browser.msie && $.browser.version == '6.0'){
                    (li.parent().parent().hasClass("om-menu-container"))?li_child_ul.css("left",0):
                                                                        li_child_ul.css("left",li.width());
                    li_child_ul.css("width",this.options.minWidth);
                }else{
                    li_child_ul.css("left",li.width());
                }
                li_child_ul.css("display","block");
                li_child_ul.show();
            }
        },
        _hideChildren : function(li){
            li.children("ul").eq(0).hide();
        },
        
        _bindLiEvent : function(li){
            var self = this, element = self.element, options = self.options ;
            $(li).bind("mouseenter.menuItem",function(){
                var self_li = $(this);
                self_li.addClass("om-menu-item-hover");
                if(self_li.attr("aria-haspopup")){
                    setTimeout(function(){
                        self._showChildren(self_li);
                    },200);
                }
            }).bind("mouseleave.menuItem",function(){
                var self_li = $(this);
                self_li.removeClass("om-menu-item-hover");
                setTimeout(function(){
                    self_li.children("ul").hide();
                },200);
            }).bind("mousedown.menuItem",function(event){
                var item = $(element).data($(element).attr("id")+"_"+this.id);
                if(options.onSelect){
                    options.onSelect(item);
                    event.preventDefault();
                    event.stopPropagation();
                    event.cancelBubble=true; //IE
                }
            });
        },
        
        _bindEvent : function(){
            var self = this , element = self.element, options = self.options ;
            var uls = element.find("ul");
            var lis = element.find("li");
            for(var i=0 ; i<lis.length ; i++){
                if(!$(lis[i]).hasClass("om-state-disabled")){
                   self._bindLiEvent(lis[i]);
                }
            };
            for(var j=0 ; j<uls.length ; j++){
                $(uls[j]).bind("mouseleave.menuContainer",function(){
                    var ul = $(this);
                    if(ul.parent().attr("aria-haspopup") == "true"){
                        ul.hide();
                    }
                });
            };
            $(document).bind('mousedown.omMenu',function(){
                self._hide();
            }).keyup(function(e){
                var key = e.keyCode;
                switch (key) {
                case 40: //down
                    self._selectNext();
                    break;
                case 38: //up
                    self._selectPrev();
                    break;
                case 37: //left
                    self._hideRight();
                    break;
                case 39: //right
                    self._showRight();
                    break;
                case 13: //enter 建立在当前menu就是打开的menu前提下
                    if(element.css("display") == "block")
                        self._backfill(element);
                    break;
                case 27: //esc
                    self._hide();
                    break;
                default:
                   null;
            }
            }).keydown(function(e){//fixed AOM-430
            	if(e.keyCode >= 37 && e.keyCode <= 40){
            		e.preventDefault();
            	}
            });
        },
        
        _hide : function(){
            var self = this , element = self.element;
            element.find("ul").css("display","none");
            element.find("li.om-menu-item-hover").each(function(index,item){
                $(item).removeClass("om-menu-item-hover");
            });
            element.hide();
        },
        /**
         * 排除掉分隔条的干扰，找到下一个menuItem
         * 返回li
         * @param liMenuItem
         */
        _findNext : function(liMenuItem){
            var next,
                oldItem = liMenuItem;
            while( (next=liMenuItem.next("li")).length !== 0 ){
            	if(!next.hasClass("om-menu-sep-li") && !next.hasClass("om-state-disabled")){
            		return next;
            	}
            	liMenuItem = next;
            }
            //如果没有，则从上到下再找一遍
            var item = oldItem.parent().find("li:first");
            while(item.length !== 0 && item != oldItem){
            	if(!item.hasClass("om-menu-sep-li") && !item.hasClass("om-state-disabled")){
            		return item;
            	}
            	item = item.next("li");
            }
        },
        /**
         * 排除掉分隔条的干扰，找到前一个menuItem
         * 返回li
         * @param liMenuItem
         */
        _findPrev : function(liMenuItem){
            var prev,
            	oldItem = liMenuItem;
            while( (prev=liMenuItem.prev("li")).length !== 0 ){
            	if(!prev.hasClass("om-menu-sep-li") && !prev.hasClass("om-state-disabled")){
            		return prev;
            	}
            	liMenuItem = prev;
            }
            //如果没有，则从下往上再找一遍
            var item = oldItem.parent().find("li:last");
            while(item.length !== 0 && item != oldItem){
            	if(!item.hasClass("om-menu-sep-li") && !item.hasClass("om-state-disabled")){
            		return item;
            	}
            	item = item.prev("li");
            }
        },
        _selectNext : function(){
            var self = this , element = self.element ,curLi;
            var menuItemHover = element.find("li.om-menu-item-hover");
            var hoverLast = menuItemHover.eq(menuItemHover.length-1);
            if(menuItemHover.length == 0){ //如果没有被选中的就选中第一个
                curLi = element.find("li").eq(0);
                curLi.addClass("om-menu-item-hover");
            }else{
                curLi = self._findNext(hoverLast);
                if(curLi.length <= 0) return;
                curLi.addClass("om-menu-item-hover");
                hoverLast.removeClass("om-menu-item-hover");
            }
            this._hideChildren(hoverLast);
            this._showChildren(curLi);
        },
        _selectPrev : function(){
            var self = this , element = self.element,curLi;
            var menuItemHover = element.find("li.om-menu-item-hover");
            var hoverLast = menuItemHover.eq(menuItemHover.length-1);
                curLi = element.find("ul.om-menu > li");
            if(menuItemHover.length == 0){ //如果没有被选中的就选中最后一个
                curLi.eq(curLi.length-1).addClass("om-menu-item-hover");
            }else{
                curLi = self._findPrev(hoverLast);
                if(curLi.length <= 0) return;
                curLi.addClass("om-menu-item-hover");
                hoverLast.removeClass("om-menu-item-hover");
            }
            this._hideChildren(hoverLast);
            this._showChildren(curLi);
        },
        _hideRight : function(){
            var self = this , element = self.element;
            var currentA = element.find("li.om-menu-item-hover") , 
                hoverLast = currentA.eq(currentA.length - 1);
            hoverLast.removeClass("om-menu-item-hover");
            self._hideChildren(hoverLast);
        },
        _showRight : function(){
            var self = this , element = self.element,curLi;
            var parentA = element.find("li.om-menu-item-hover") , 
                parentLi = parentA.eq(parentA.length - 1);
            if(parentLi.attr("aria-haspopup") == "true"){
                curLi = parentLi.children("ul").find("li").eq(0);
                curLi.addClass("om-menu-item-hover");
            }
            self._showChildren(curLi);
        },
        _backfill : function(element){
            var curas = element.find("li.om-menu-item-hover");
            curas.eq(curas.length - 1).mousedown();
        }
    });
})(jQuery);/*
 * $Id: om-messagebox.js,v 1.16 2012/01/16 01:48:41 linxiaomin Exp $
 * operamasks-ui omMessageBox 1.0
 *
 * Copyright 2011, AUTHORS.txt (http://ui.operamasks.org/about)
 * Dual licensed under the MIT or GPL Version 2 licenses.
 * http://ui.operamasks.org/license
 *
 * http://ui.operamasks.org/docs/
 *
 * Depends:
 *  jquery.ui.core.js
 *  jquery.ui.widget.js
 *  jquery.ui.mouse.js
 *  om-draggable.js
 *  jquery.ui.position.js
 */
 
(function( $, undefined ) {
	 var tmpl = '<div class="om-messageBox om-widget om-widget-content om-corner-all" tabindex="-1">'+
	                '<div class="om-messageBox-titlebar om-widget-header om-helper-clearfix">'+
	                    '<span class="om-messageBox-title"></span>'+
	                    '<a href="#" class="om-messageBox-titlebar-close"><span class="om-icon om-icon-closethick"></span></a>' +
	                '</div>'+
	                '<div class="om-messageBox-content om-widget-content">'+
	                    '<table><tr vailgn="top">' +
	                        '<td class="om-messageBox-imageTd"><div class="om-messageBox-image"/>&nbsp;</td>' +
	                        '<td class="om-message-content-html"></td>' +
	                    '</tr></table>'+
	                '</div>'+
	                '<div class="om-messageBox-buttonpane om-widget-content om-helper-clearfix">'+
	                    '<div class="om-messageBox-buttonset"></div>'+
	                '</div>'+
	            '</div>';
	var _height = function(){
        // handle IE 6
        if ($.browser.msie && $.browser.version < 7) {
            var scrollHeight = Math.max(document.documentElement.scrollHeight, document.body.scrollHeight),
                offsetHeight = Math.max(document.documentElement.offsetHeight, document.body.offsetHeight);
            return (scrollHeight < offsetHeight) ?  $(window).height() : scrollHeight;
        // handle "good" browsers
        } else {
            return $(document).height();
        }
	};
	var _width = function() {
        // handle IE
        if ( $.browser.msie ) {
            var scrollWidth = Math.max(document.documentElement.scrollWidth, document.body.scrollWidth),
                offsetWidth = Math.max(document.documentElement.offsetWidth, document.body.offsetWidth);
            return (scrollWidth < offsetWidth) ? $(window).width() : scrollWidth;
        // handle "good" browsers
        } else {
            return $(document).width();
        }
    };
	var close = function(messageBox, mask, handler, value){
	    if (messageBox.hasClass('om-messageBox-waiting')) {
	        return;
	    }
	    handler ? handler(value) : jQuery.noop();
	    messageBox.remove();
	    mask.remove();
	};
    var _show = function(config){
        var onClose = config.onClose;
        var messageBox = $(tmpl).appendTo(document.body).css('z-index', 9999).position({
            of:window,
            collision: 'fit'
        }).omDraggable({
            containment: 'document',
            cursor:'move',
            handle: '.om-messageBox-titlebar'
        }).hide().keydown(function(event){
            if (event.keyCode && event.keyCode === $.ui.keyCode.ESCAPE) {
                close(messageBox, mask, null, false);
                event.preventDefault();
            }
        });
        var mask = $('<div class="om-widget-overlay"/>').appendTo(document.body).show().css({height:_height(),width:_width()});
        var closeBut = messageBox.find('span.om-messageBox-title').html(config.title).next().hover(function(){
            $(this).addClass('om-state-hover');
        }, function(){
            $(this).removeClass('om-state-hover');
        }).focus(function(){
            $(this).addClass('om-state-focus');
        }).blur(function(){
            $(this).removeClass('om-state-focus');
        }).click(function(event){
            close(messageBox, mask, null, false);
            return false;
        }).bind('mousedown mouseup', function(){
            $(this).toggleClass('om-state-mousedown');
        });
        messageBox.find('div.om-messageBox-image').addClass('om-messageBox-image-' + config.type);
        var content = config.content;
        if (config.type == 'prompt') {
            content = content || '';
            content += '<br/><input id="om-messageBox-prompt-input" type="text"/>';
        }
        messageBox.find('td.om-message-content-html').html(content);
        var buttonSet = messageBox.find('div.om-messageBox-buttonset');
        switch (config.type) {
            case 'confirm':
                buttonSet.html('<button>确定</button><button>取消</button>').children().first().click(function(){
                    close(messageBox, mask, onClose, true);
                }).next().click(function(){
                    close(messageBox, mask, onClose, false);
                });
                break;
            case 'prompt':
                buttonSet.html('<button>确定</button><button>取消</button>').children().first().click(function(){
                    var returnValue = onClose ? onClose($('#om-messageBox-prompt-input').val()) : jQuery.noop();
                    if (returnValue !== false) {
                        messageBox.remove();
                        mask.remove();
                    }
                }).next().click(function(){
                    close(messageBox, mask, onClose, false);
                });
                break;
            case 'waiting':
                messageBox.addClass('om-messageBox-waiting');
                mask.addClass('om-messageBox-waiting');
                closeBut.hide(); //不显示关闭按钮
                buttonSet.parent().hide(); //不显示下面的按钮面板
                break;
            default:
                buttonSet.html('<button>确定</button>').children().first().click(function(){
                    close(messageBox, mask, onClose, true);
                });
        }
        var buts = $('button',buttonSet);
        if($.fn.omButton){
            buts.omButton();
        }
        messageBox.show();
        var okBut = buts.first()[0];
        okBut ? okBut.focus() : messageBox.focus();
    };
     /**
      * @name omMessageBox
      * @class
      * omMessageBox用于提供提示信息的弹出窗口，类似于JavaScript中使用alert()、confirm()、prompt()函数时出现的那种提示信息的弹出窗口。<br/><br/>
      * <br/>
      * <h2>有以下特点：</h2><br/>
      * <ul>
      *     <li>有较好的浏览器兼容性</li>
      *     <li>可以定义标题、内容，并且标题和内容可以使用html代码</li>
      *     <li>标题栏有关闭按钮，也可以按Esc键关闭</li>
      *     <li>支持丰富的提示（图标不同）</li>
      *     <li>可以监听关闭事件</li>
      * </ul>
      * <br/>
      * <h2>提供了以下工具方法：</h2><br/>
      * <ul>
      *     <li>
      *         <b>$.omMessageBox.alert(config)</b><br/>
      *         弹出一个Alert提示，仅有一个“确定”按钮。其中config有以下配置项：<br/>
      *         <ul style="margin-left:40px">
      *             <li>type：alert提示的类型，类型不同时弹出窗口左边的图标会不同。String类型，可选的值有'alert'、'success'、'error'、'question'、'warning'。默认值为'alert'。</li>
      *             <li>title：弹出窗口的标题文字，String类型，可以使用普通字符串，也可以使用html代码。默认值为'提示'。</li>
      *             <li>content：弹出窗口的提示内容，String类型，可以使用普通字符串，也可以使用html代码。无默认值。</li>
      *             <li>onClose：弹出窗口关闭时的回调函数，Function类型，点击"确定"按钮来关闭弹出窗口时，Function的参数value值为true，按ESC键关闭弹出窗口时，Function的参数value值为false。无默认值。</li>
      *         </ul>
      *         <br/>使用方式如下：<br/>
      *         <pre>
      *             $.omMessageBox.alert({
      *                 type:'error',
      *                 title:'失败',
      *                 content:'不能删除&lt;font color="red">admin&lt;/font>用户',
      *                 onClose:function(value){
      *                     alert('do something');
      *                 }
      *             });
      *         </pre>
      *     </li>
      *     <li>
      *         <b>$.omMessageBox.confirm(config)</b><br/>
      *         弹出一个Confirm提示，有“确定”和“取消”按钮。其中config有以下配置项：<br/>
      *         <ul style="margin-left:40px">
      *             <li>title：弹出窗口的标题文字，String类型，可以使用普通字符串，也可以使用html代码。默认值为'确认'。</li>
      *             <li>content：弹出窗口的提示内容，String类型，可以使用普通字符串，也可以使用html代码。无默认值。</li>
      *             <li>onClose：弹出窗口关闭时的回调函数，Function类型，点击"确定"按钮来关闭弹出窗口时，Function的参数value值为true，点击“取消”按钮或按ESC键关闭弹出窗口时，Function的参数value值为false。无默认值。</li>
      *         </ul>
      *         <br/>使用方式如下：<br/>
      *         <pre>
      *             $.omMessageBox.confirm({
      *                 title:'确认删除',
      *                 content:'删除用户后，它所有的发帖和回帖将同时删除（不可恢复），你确定要这样做吗？',
      *                 onClose:function(value){
      *                     alert(value?'开始删除操作':'不删除了');
      *                 }
      *             });
      *         </pre>
      *     </li>
      *     <li>
      *         <b>$.omMessageBox.prompt(config)</b><br/>
      *         弹出一个Prompt提示，有一个输入框和“确定”和“取消”按钮。其中config有以下配置项：
      *         <ul style="margin-left:40px">
      *             <li>title：弹出窗口的标题文字，String类型，可以使用普通字符串，也可以使用html代码。默认值为'请输入'。</li>
      *             <li>content：弹出窗口的提示内容，String类型，可以使用普通字符串，也可以使用html代码。无默认值。</li>
      *             <li>onClose：弹出窗口关闭时的回调函数，Function类型，点击"确定"按钮来关闭弹出窗口时，Function的参数value值为用户在输入框里输入的字符串（一定是字符串），点击“取消”按钮或按ESC键关闭弹出窗口时，Function的参数value值为false。无默认值。<b>注意：在此方法中返回false将会阻止弹出窗口关闭。</b></li>
      *         </ul>
      *         <br/>使用方式如下：<br/>
      *         <pre>
      *             $.omMessageBox.prompt({
      *                 title:'商品数量',
      *                 content:'请输入你要购买的商品的数量（你的余额最多只能购买12千克）：',
      *                 onClose:function(value){
      *                     if(value===false){ //按了取消或ESC
      *                         alert('取消购买');
      *                         return;
      *                     }
      *                     if(value==''){
      *                         alert('数量不能为空');
      *                         return false; //不关闭弹出窗口
      *                     }
      *                     if(value-0+'' !== value){
      *                         alert('只能输入数字');
      *                         return false;  //不关闭弹出窗口
      *     `               }
      *                     if(value&lt;0 || value&gt;12){
      *                         alert('请输入0-12之间的数字（可带小数）');
      *                         return false; //不关闭弹出窗口
      *                     }else{
      *                         alert('开始购买'+value+'千克商品');
      *                     }
      *                 }
      *             });
      *         </pre>
      *     </li>
      *     <li>
      *         <b>$.omMessageBox.waiting(config | 'close')</b><br/>
      *         弹出一个Prompt提示，有一个输入框和“确定”和“取消”按钮。该提示窗口没有关闭按钮，也不可以按ESC关闭。如果参数是'close'时表示关闭上次弹出的Waiting提示窗口。如果是config时表示要弹出一个Waiting提示窗口，其中config有以下配置项：
      *         <ul style="margin-left:40px">
      *             <li>title：弹出窗口的标题文字，String类型，可以使用普通字符串，也可以使用html代码。默认值为'请稍候'。</li>
      *             <li>content：弹出窗口的提示内容，String类型，可以使用普通字符串，也可以使用html代码。无默认值。</li>
      *         </ul>
      *         <br/>使用方式如下：<br/>
      *         <pre>
      *             //弹出提示
      *             $.omMessageBox.waiting({
      *                 title:'请稍候',
      *                 content:'服务器正在处理您的请求，请稍候...',
      *             });
      * 
      *             //关闭提示
      *             $.omMessageBox.waiting('close');
      *         </pre>
      *     </li>
      * </ul>
      */
    $.omMessageBox = {
        alert: function(config){
            config = config || {};
            config.title = config.title || '提示';
            config.type = config.type || 'alert';
            _show(config);
        },
        confirm: function(config){
            config = config || {};
            config.title = config.title || '确认';
            config.type = 'confirm';
            _show(config);
        },
        prompt: function(config){
            config = config || {};
            config.title = config.title || '请输入';
            config.type = 'prompt';
            _show(config);
        },
        waiting: function(config){
            if (config === 'close') {
                $('.om-messageBox-waiting').remove();
                return;
            }
            config = config || {};
            config.title = config.title || '请等待';
            config.type = 'waiting';
            _show(config);
        }
    };
}(jQuery));/*
 * $Id: om-messagetip.js,v 1.6 2012/01/16 01:48:41 linxiaomin Exp $
 * operamasks-ui omMessageBox 1.0
 *
 * Copyright 2011, AUTHORS.txt (http://ui.operamasks.org/about)
 * Dual licensed under the MIT or GPL Version 2 licenses.
 * http://ui.operamasks.org/license
 *
 * http://ui.operamasks.org/docs/
 *
 * Depends:
 *  jquery.ui.core.js
 *  jquery.ui.widget.js
 */
 
(function( $, undefined ) {
     /**
      * @name omMessageTip
      * @class
      * omMessageTip用于右下角弹出提示窗口（像QQ新闻一样）。<br/><br/>
      * <br/>
      * <h2>有以下特点：</h2><br/>
      * <ul>
      *     <li>不中断用户操作（非模态窗口提示）</li>
      *     <li>有较好的浏览器兼容性</li>
      *     <li>可以定义标题、内容，并且标题和内容可以使用html代码</li>
      *     <li>支持丰富的提示（图标不同）</li>
      *     <li>可以监听关闭事件</li>
      *     <li>弹出提示和关闭提示时有简单动画</li>
      *     <li>较轻量（仅简单的提示功能和定时消失功能，不可改变提示窗口大小，不可拖动提示窗口位置）</li>
      * </ul>
      * <br/>
      * 该组件非常轻量，功能也较少，如果需要中断用户操作，请使用omDialog或omMessageBox组件。内容区也仅能放html代码，如果有较复杂的内容请使用omDialog组件。
      * <br/>
      * <h2>提供了以下工具方法：</h2><br/>
      * <ul>
      *     <li>
      *         <b>$.omMessageTip.show(config)</b><br/>
      *         从当前页面右下角弹出一个非中断提示，弹出的提示可以关闭。其中config有以下配置项：<br/>
      *         <ul style="margin-left:40px">
      *             <li>type：提示的类型，类型不同时弹出窗口左边的图标会不同。String类型，可选的值有'alert'、'success'、'error'、'question'、'warning'、'waiting'。默认值为'alert'。</li>
      *             <li>title：弹出窗口的标题文字，String类型，可以使用普通字符串，也可以使用html代码。默认值为'提示'。</li>
      *             <li>content：弹出窗口的提示内容，String类型，可以使用普通字符串，也可以使用html代码。无默认值。</li>
      *             <li>onClose：弹出窗口关闭时的无参回调函数，Function类型。</li>
      *             <li>timeout：弹出窗口持续的时间，单位为毫秒，窗口弹出后经过这么长的时间后自动关闭（如果有onClose回调函数，会自动触发它），Int类型。默认值为无穷大（即不自动关闭）</li>
      *         </ul>
      *         <br/>使用方式如下：<br/>
      *         <pre>
      *             $.omMessageTip.show({
      *                 type:'warning',
      *                 title:'提醒',
      *                 content:'请选择你要删除的记录（可以选择一条或多条）！'
      *             });
      *             $.omMessageTip.show({
      *                 type:'error',
      *                 title:'数据非法',
      *                 content:'&lt;font color="red">123456&lt;/font>不是有效的邮箱地址！',
      *                 onClose:function(){
      *                     $('#emial').focus();
      *                 }
      *             });
      *         </pre>
      *     </li>
      * </ul>
      */
    $.omMessageTip = {
        show: function(config){
            config = $.extend({
                title : '提醒',
                content : '&#160;',
                type : 'alert'
            },config);
            var html = '<div class="om-messageTip om-widget om-corner-all" tabindex="-1">'+
                    '<div class="om-widget-header om-helper-clearfix">'+
                        '<span class="om-messageTip-title">'+config.title+'</span>'+
                        '<a href="#" class="om-messageTip-titlebar-close"><span class="om-icon-closethick"></span></a>' +
                    '</div>'+
                    '<div class="om-messageTip-content om-widget-content">'+
                        '<div class="om-messageTip-image om-messageTip-image-'+config.type+'"></div>' +
                        '<div class="om-messageTip-content-body">'+config.content+'</div>' +
                    '</div>'+
                '</div>';
            var messageTip = $(html).appendTo(document.body).css('z-index', 10000).hide();
            var result = {d:messageTip,l:config.onClose};
            messageTip.find('a.om-messageTip-titlebar-close')
                .bind('mouseenter mouseleave',function(){
                    $(this).toggleClass('om-state-hover');
                })
                .bind('focus blur',function(){
                    $(this).toggleClass('om-state-focus');
                })
                .bind('mousedown mouseup', function(){
                    $(this).toggleClass('om-state-mousedown');
                })
                .click(function(event){
                    $.omMessageTip._close(result);
                    return false;
                });
            messageTip.slideDown('slow');
            if(config.timeout){ //定时关闭
                setTimeout(function(){
                    $.omMessageTip._close(result);
                },config.timeout);
            }
            return messageTip;
        },
        _close : function(result){
            result.d.slideUp('slow');
            if(result.l){
                result.l(); //调用onClose回调函数
            }
            setTimeout(function(){
                result.d.remove();
            },1000);
        }
    };
}(jQuery));/*
 * $Id: om-numberfield.js,v 1.59 2012/01/16 01:48:41 linxiaomin Exp $
 * operamasks-ui omNumberField 1.0
 *
 * Copyright 2011, AUTHORS.txt (http://ui.operamasks.org/about)
 * Dual licensed under the MIT or GPL Version 2 licenses.
 * http://ui.operamasks.org/license
 *
 * http://ui.operamasks.org/docs/
 *
 * Depends:
 *  jquery.ui.core.js
 *  jquery.ui.widget.js
 */
(function($) {
    
    // 设置小数精度
    var fixPrecision = function(value, c, p) {12.2
        var v = value.indexOf(".");       
        if (isNaN(value) && value != ".") {
            for (; isNaN(value);) {
                value = value.substring(0, value.length - 1);
            }
        }
        if(!p.allowNegative && value.indexOf("-")!= -1){
        	var array=value.split("-");
        	value=array.join("");
        }
        if(!p.allowDecimals&&v!=-1 || value[value.length-1]==='.'){
            return value.substring(0, v);
         }
        if(v!=-1){
            value=value.substring(0,v+p.decimalPrecision+1);
        }
        return value;
    };

    /** 
     * @name omNumberField
     * @class 数字输入框组件，只能输入数字，字符自动过滤掉。<br/>
     * @constructor
     * @description 构造函数. 
     * @param p 标准config对象：{}
     * @example
     * $('numberFielddiv').omNumberField({decimalPrecision:3});
     */
    $.widget("om.omNumberField", {
        options: /** @lends omNumberField.prototype */ 
        {
            /**
             * 是否允许输入小数。
             * @default true
             * @type Boolean
             * @example
             * $('#input').omNumberField({allowDecimals:true});
             */
            allowDecimals: true,  //是否允许输入小数
            /**
             * 是否允许输入负数。
             * @default true
             * @type Boolean
             * @example
             * $('#input').omNumberField({allowNegative:true});
             */
            allowNegative: true,  //是否允许输入负数
            /**
             * 精确到小数点后几位。
             * @default 2
             * @type Number
             * @example
             * $('#input').omNumberField({decimalPrecision:2});
             */
            decimalPrecision: 2, //精确到小数点后几位
            /**
             * 是否禁用组件。
             * @default false
             * @type Boolean
             * @example
             * $('#input').omNumberField({disabled:true});
             */
            disabled: false,
            /**
             * 在输入框失去焦点时触发的方法。
             * @event
             * @param value 当前输入框的值
             * @default emptyFn
             * @example
             * $('#input').omNumberField({onBlur:function(value){alert('now the value is'+value);}});
             */
            onBlur: function(value){},
            /**
             * 是否只读。
             * @default false
             * @type Boolean
             * @example
             * $('#input').omNumberField({readOnly:true});
             */
            readOnly: false            
        },

        _create : function() {
            // 允许输入的字符
            var options = this.options;
            this.element.addClass("om-numberfield om-widget om-state-default om-state-nobg")
            			.css("ime-mode" , "disabled");
			
            if (typeof options.disabled !== "boolean") {
                this.options.disabled = this.element.attr("disabled");
            }

            if (options.readOnly) {
                this.element.attr("readonly","readonly");
            }

            if (this.element.is(":disabled")) {
                this.options.disabled = true;
            }
            this.element.keypress(function(e) {
                if (e.which == null && (e.charCode != null || e.keyCode != null)) {
                    e.which = e.charCode != null ? e.charCode : e.keyCode;
                }
                var k = e.which;
                if (k === 8 || (k == 46 && e.button == -1) || k === 0) {
                    return;
                }
                var character = String.fromCharCode(k);
                $.data(this,"character",character);
                var allowed = $.data(this, "allowed");
                if (allowed.indexOf(character) === -1||($(this).val().indexOf("-") !== -1 && character == "-")
                        || ($(this).val().indexOf(".") !== -1 && character == ".")) {
                    e.preventDefault();
                }
            }).focus(function(){
            	$(this).addClass('om-state-focus');
            }).blur(function(){
                $(this).removeClass('om-state-focus');
            	var character = $.data(this,"character");
                this.value=fixPrecision(this.value, character, options);
                options.onBlur.apply(this , [this.value]);
            }).keydown(function(e){
            	//Chrome并不支持css属性ime-mode,无法阻止拼音输入，但当使用输入法时，事件的e.which===229恒成立.
            	if(229 === e.which){
            		e.preventDefault();
            	}
            }).keyup(function(e){//在Chrome中文输入法下，输入  ，。等字符不会触发input框的keypress事件
            	var v = this.value,
            	len = v.length;
            	if(v && $.data(this,"allowed").indexOf(v.charAt(len-1))===-1
            		|| v.indexOf('.') != v.lastIndexOf('.')
            		|| v.indexOf('-') != v.lastIndexOf('-')){
            		this.value = v.substring(0 , len-1);
            	}
            }).bind('cut paste',function(e){
            	return false;
            });
            this._setOption("disabled", options.disabled);
        },

        _setOption : function(key, value) {
          //  $.Widget.prototype._setOption.apply(this, arguments);
            this._buildAllowChars();
            if (key === "disabled") {
                if (value) {
                    this.element.attr(key, true);
                   // this.element.removeClass("om-state-nobg");
                    this.element.addClass("om-numberfield-disabled");
                } else {
                    this.element.attr(key, false);
                    this.element.removeClass("om-numberfield-disabled");
                }
            }
        },

        _buildAllowChars : function() {
            var allowed = "0123456789";

            // 允许输入的字符
            if (this.options.allowDecimals) {
                allowed = allowed + ".";
            }
            if (this.options.allowNegative) {
                allowed = allowed + "-";
            }
            if (this.options.readOnly) {
                allowed = "";
            }
            $.data(this.element[0], "allowed", allowed);
        }
        /**
         * 禁用组件。
         * @name omNumberField#disable
         * @function
         * @example
         * $('#input').omNumberField("disable")
         */

        /**
         * 启用组件。
         * @name omNumberField#enable
         * @function
         * @example
         * $('#input').omNumberField("enable")
         */
    });
})(jQuery);/*
 * $Id: om-slider.js,v 1.22 2012/01/16 01:48:41 linxiaomin Exp $
 * operamasks-ui omSlider 1.0
 *
 * Copyright 2011, AUTHORS.txt (http://ui.operamasks.org/about)
 * Dual licensed under the MIT or GPL Version 2 licenses.
 * http://ui.operamasks.org/license
 *
 * http://ui.operamasks.org/docs/
 *
 * Depends:
 */
    /** 
     * @name omSlider
     * @class 用来展示页面中多个HTML元素的滑动器.<br/>
     * <b>特点：</b><br/>
     * <ol>
     * 		<li>以滑动器的方式展示页面中的多个元素，元素的HTML结构不限</li>
     * 		<li>内置控制导航条</li>
     * 		<li>内置多种切换的动画效果</li>
     * 		<li>可自定义导航条的内容和样式</li>
     * </ol>
     * <b>示例：</b><br/>
     * <pre>
     * &lt;script type="text/javascript" &gt;
     * $(document).ready(function() {
     *     $('#slider').omSlider({
     *         animSpeed : 100,
     *         effect : 'slide-v',
     *         onBeforeSlide : function(index){
     *             // do something
     *         }
     *     });
     * });
     * &lt;/script&gt;
     * 
     * &lt;div id="slider" class="slider-demo"&gt;
     *	&lt;img src="images/turtle.jpg" /&gt;
     *	&lt;a href="#"&gt;&lt;img src="images/rabbit.jpg" /&gt;&lt;/a&gt;
     *	&lt;img src="images/penguin.jpg" /&gt;
     *	&lt;img src="images/lizard.jpg" /&gt;
     *	&lt;img src="images/crocodile.jpg" /&gt;
	 * &lt;/div&gt;
	 * </pre>
     * @constructor
     * @description 构造函数. 
     * @param p 标准config对象：{}
     */
(function($) {
	$.fn.omSlider = function(options) {
		var methods = {
	        /**
	         * 切换到指定index的面板。
	         * @name omSlider#slideTo
	         * @function
	         * @param index 面板的索引
	         * @example
	         * //切换到第三个面板
	         * $('#slider').omSlider('slideTo', 2);
	         */
			slideTo : function(index) {
				return this.each(function(){
					opts = $(this).data('omSlider:opts');
					_slideTo($(this),index);
				});
			},
	        /**
	         * 切换到下一个面板。
	         * @name omSlider#next
	         * @function
	         * @example
	         * $('#slider').omSlider('next');
	         */			
			next : function(){
				return this.each(function(){
					opts = $(this).data('omSlider:opts');
					_next($(this));
				});
			},
	        /**
	         * 切换到上一个面板。
	         * @name omSlider#prev
	         * @function
	         * @example
	         * $('#slider').omSlider('prev');
	         */			
			prev : function(){
				return this.each(function(){
					opts = $(this).data('omSlider:opts');
					_prev($(this));
				});
			}
		};
		if (methods[options]) {
			return methods[options].apply(this, Array.prototype.slice.call(arguments, 1));
		} 
		var defaults = /** @lends omSlider#*/{
	        /**
	         * 设置面板是否自动切换。
	         * @default true
	         * @type Boolean
	         * @example
	         * $('#slider').omSlider({autoPlay : false});
	         */
			autoPlay : true,
	        /**
	         * 自动切换间隔时间，只有当autoPlay为true的时候这个属性才有效。
	         * @default 5000
	         * @type Number
	         * @example
	         * $('#slider').omSlider({interval: 1000});//设置slider自动切换的间隔时间为1秒
	         */
			interval : 5000,
			/**
			 * 设置是否需要显示用来切换上一个或下一个面板的方向导航键（设为true时把鼠标移动到slider上面的时候会出现一个悬浮的上一个或下一个的工具条）。
			 * @default false
			 * @type Boolean
			 * @example
			 * $('#slider').omSlider({directionNav : true});
			 */
			directionNav: false,
			/**
			 * 设置当鼠标移动到slider上面的时候是否暂停自动切换。
			 * @default true
			 * @type Boolean
			 * @example
			 * $('#slider').omSlider({pauseOnHover : false});
			 */
			pauseOnHover: true,
			/**
			 * 设置是否需要导航条，当属性值为String的时候表示使用内置的导航条类型，
			 * 当属性值为Selector的时候表示使用自定义的导航条，当属性值设置为true的时候默认使用内置的"classical"导航条。
			 * 内置的导航条类型包括"classical"，"dot"。
			 * @default true
			 * @type Boolean,String,Selector
			 * @example
			 * $('#slider').omSlider({controlNav : false});//不使用导航条
			 * $('#slider').omSlider({controlNav : 'dot'});//使用内置的风格为'dot'的导航条
			 * $('#slider').omSlider({controlNav : 'div#my-nav'});//使用页面中id为'my-nav'的div作为导航条
			 */
			controlNav: true,
	        /**
	         * 设置导航条选中的时候设置的class样式，同时作用于内置导航条和自定义导航条。
	         * @default 'nav-selected'
	         * @type String
	         * @example
	         * $('#slider').omSlider({activeNavCls: 'my-nav-selected'});
	         */
			activeNavCls: 'nav-selected',

	        /**
	         * 设置面板切换的动画效果。
	         * 内置的动画效果包括'fade'(淡入淡出)、'slide-v'(垂直滑动)、'slide-h'(水平滑动)、'random'(随机动画)。
	         * 设置为true使用默认'fade'动画效果，设置为false不使用动画效果。
	         * @default 'fade'
	         * @type String,Boolean
	         * @example
	         * $('#slider').omSlider({effect : false});
	         * //使用垂直滑动的动画效果。
	         * $('#slider').omSlider({effect : 'slide-v'});
	         */
			effect : 'fade',
	        /**
	         * 动画执行的速度。单位毫秒，值越小动画执行的速度越快。
	         * @default 500
	         * @type Number
	         * @example
	         * $('#slider').omSlider({animSpeed : 100});
	         */
			animSpeed : 500,
			/**
			 * 组件初始化时默认激活的面板的index，index从0开始计算，0表示第一个面板。比如设成2则页面显示后默认显示第3个面板。
			 * @default 0
			 * @type Number
	         * @example
	         * $('#slider').omSlider({startSlide : 2});
			 */
			startSlide: 0,
			/**
			 * 鼠标移动到导航条上面后触发切换动作的延迟时间。单位为毫秒。
			 * @default 200
			 * @type Number
	         * @example
	         * $('#slider').omSlider({delay : 100});
			 */
			delay: 200,
            /**
             * 面板切换前触发事件，事件的处理函数返回false则阻止切换动作。
             * @event
             * @type Function
             * @default emptyFn
             * @param index 面板的索引
             * @name omSlider#onBeforeSlide
	         * @example
	         * $('#slider').omSlider({onBeforeSlide : function(index){if(index==2) return false;}});// 阻止slider切换到第三个面板
             */
			onBeforeSlide:function(index){},
			/**
			 * 面板切换后触发事件。
			 * @event
			 * @type Function
			 * @default emptyFn
			 * @param index 面板的索引
			 * @name omSlider#onAfterSlide
			 * @example
			 * $('#slider').omSlider({onAfterSlide : function(index){alert(index + ' slide complete');});
			 */
			onAfterSlide:function(index){}
		};
		var opts = $.extend({}, defaults, options);
		
		/**
		 * 获取slider中保存的变量
		 */
		function _getSliderVars(slider){
			return slider.data('omSlider:vars');
		}
		
		function _runSlideEffect(slider, index, effect){
			var vars = _getSliderVars(slider),
				$container = slider.find('ul.om-slider-content'),
				$item = $container.children(),
				top = 0,
				left = 0;
			var effectnow = effect ? effect : opts.effect;
			if(opts.effect == 'random'){
				$container.removeClass('om-slider-effect-'+ effectnow)
				.addClass('om-slider-effect-'+ effectnow);
			}
			if(effectnow == 'slide-v'){
				// 垂直滑动效果
				$item.each(function(n){
					if(n == index) return false;
					top -= $(this).height();
				});
			} else if(effectnow == 'slide-h'){
				// 水平滑动效果
				$item.each(function(n){
					if(n == index) return false;
					left -= $(this).width();
				});
			} else{
				return false;
			}
			vars.running = true;
			$container.stop().animate({top:top,left:left},opts.animSpeed,function(){
				vars.running = false;
				opts.onAfterSlide.call(self, index);
			});
		}
		
		function _runFadeEffect(slider,index){
			var vars = _getSliderVars(slider),
				items = slider.find('ul.om-slider-content').children();
			items.each(function(n){
				var $child = $(this);
				if(n == index){
					vars.running = true;
					$child.fadeIn(opts.animSpeed,function(){
						vars.running = false;
						opts.onAfterSlide.call(self, index);
					});
				} else if(n == vars.currentSlide){
					$child.fadeOut(opts.animSpeed);
				}
			});
		}
		
		function _runNoEffect(slider,index){
			var vars = _getSliderVars(slider),
				items = slider.find('ul.om-slider-content').children();
			items.each(function(n){
				var $child = $(this);
				if(n == index){
					$child.show();
					opts.onAfterSlide.call(self, index);
				} else if(n == vars.currentSlide){
					$child.hide();
				}
			});
		}
		
		/**
		 * 切换导航条
		 */
		function _toggleControlNav(slider, index){
			var vars = _getSliderVars(slider);
			var parent = slider;
			// 如果是自定义导航条，则controlNav的位置在slider外面，所以从body下面找controlNav
			if(vars.customNav){
				parent = $('body');
			}
			var navItems = parent.find(vars.controlNav).children();
			navItems.each(function(n){
				$(this).toggleClass(opts.activeNavCls,n==index);
			});
		}
		
		/**
		 * 切换至指定面板，index从0开始
		 */
		function _slideTo(slider, index){
			var vars = _getSliderVars(slider),
			$container = slider.find('ul.om-slider-content');
			if(isNaN(index) || index < 0 || index >= vars.totalSlides){
				return;
			}
	        if (opts.onBeforeSlide.call(self, index) == false) {
	            return false;
	        }
	        if(opts.effect == 'random'){
	        	var array=['fade','slide-h','slide-v'];
	        	var effect = array[Math.floor(Math.random()*3)];
	        	$container.removeClass().addClass('om-slider-content');
	        	$container.removeAttr('style');
	        	$container.find('li').removeAttr('style');
	        	if(effect == 'slide-h' || effect == 'slide-v'){
					_runSlideEffect(slider, index, effect);
				} else {
					_runFadeEffect(slider, index);
				}
	        }else if(opts.effect == 'slide-h' || opts.effect == 'slide-v'){
				_runSlideEffect(slider, index);
			} else if(opts.effect == 'fade' || opts.effect === true){
				_runFadeEffect(slider, index);
			} else{
				_runNoEffect(slider, index);
			}
			
			if(vars.controlNav){
				_toggleControlNav(slider, index);
			}
			vars.currentSlide = index;
			return slider;
		}
		
		function _next(slider){
			var vars = _getSliderVars(slider),
				next_index = 0;
			if(vars.currentSlide+2 <= vars.totalSlides){
				next_index = vars.currentSlide + 1;
			}
			return _slideTo(slider,next_index);
		}
		function _prev(slider){
			var vars = _getSliderVars(slider),
				index = vars.totalSlides - 1;
			if(vars.currentSlide != 0){
				index = vars.currentSlide - 1;
			}
			return _slideTo(slider,index);
		}
		function _processDirectionNav(slider){
			var vars = _getSliderVars(slider),
				directionNav = $('<div class="om-slider-directionNav">').appendTo(slider);
			$('<a class="om-slider-prevNav"></a>').appendTo(directionNav).click(function(){
				if(vars.running)return false;
				_prev(slider);
			});
			$('<a class="om-slider-nextNav"></a>').appendTo(directionNav).click(function(){
				if(vars.running)return false;
				_next(slider);
			});
			slider.hover(function(){
				directionNav.show();
			},function(){
				directionNav.hide();
			});
			
		} 
		function _processControlNav(slider){
			var vars = _getSliderVars(slider);
			if(opts.controlNav === true || opts.controlNav === 'classical'){
				var $nav = $('<ul class="om-slider-nav-classical"></ul>');
				vars.controlNav = '.om-slider-nav-classical';
				for(n=0;n<vars.totalSlides;n++){
					var $navItem = $('<li>'+(n+1)+'</li>');
					$navItem.data('sid',n);
					var hTimer = 0;
					$navItem.click(function(){
						//if(vars.running)return false;
						_slideTo(slider,$(this).data('sid'));
					});
					$navItem.hover(function(){
						if(vars.running)return false;
						var _self = $(this);
						if(_self.hasClass(opts.activeNavCls))return false;
						hTimer = setTimeout(function(){_slideTo(slider,_self.data('sid'));},opts.delay);
					},function(){
						clearTimeout(hTimer);
					});
					$nav.append($navItem);
				}
				slider.append($nav);
			} else if(opts.controlNav === 'dot'){
				var $nav = $('<div class="om-slider-nav-dot"></div>');
				vars.controlNav = '.om-slider-nav-dot';
				for(n=0;n<vars.totalSlides;n++){
					var $navItem = $('<a href="javascript:void(0)">'+(n+1)+'</a>');
					$navItem.data('sid',n);
					var hTimer = 0;
					$navItem.click(function(){
						//if(vars.running)return false;
						_slideTo(slider,$(this).data('sid'));
					});					
					$navItem.hover(function(){
						if(vars.running)return false;
						var _self = $(this);
						if(_self.hasClass(opts.activeNavCls))return false;
						hTimer = setTimeout(function(){_slideTo(slider,_self.data('sid'));},opts.delay);
					},function(){
						clearTimeout(hTimer);
					});
					$nav.append($navItem);
				}
				//$nav.insertAfter(slider);
				$nav.appendTo(slider).css({marginLeft:-1*$nav.width()/2});
			} else{
				if($(opts.controlNav).length > 0){
					vars.controlNav = opts.controlNav;
					vars.customNav = true;
					var $nav = $(opts.controlNav);
					$nav.children().each(function(n){
						var $navItem = $(this);
						$navItem.data('sid',n);
						var hTimer = 0;
						$navItem.click(function(){
							//if(vars.running)return false;
							_slideTo(slider,$(this).data('sid'));
						});
						$navItem.hover(function(){
							if(vars.running)return false;
							var _self = $(this);
							if(_self.hasClass(opts.activeNavCls))return false;
							hTimer = setTimeout(function(){_slideTo(slider,_self.data('sid'));},opts.delay);
						},function(){
							clearTimeout(hTimer);
						});
					});
				}
			}
		}
		return this.each(function() {
			var timer = 0;
			var $this = $(this);
	        var vars = {
                currentSlide: 0,
                totalSlides: 0,
                running: false,
                paused: false,
                stop: false,
                controlNav: '.om-slider-nav-classical'
            };
			var data = $this.data('omSlider');
			if(data){return data;}
			
			$this.data('omSlider',$this).data('omSlider:vars',vars).data('omSlider:opts',opts).addClass('om-slider');
			if(opts.startSlide > 0){
				vars.currentSlide = opts.startSlide; 
			}
			var kids = $this.children();
			kids.wrapAll('<ul class="om-slider-content"></ul>').wrap('<li class="om-slider-item"></li>');
			if(opts.effect == 'slide-v' || opts.effect == 'slide-h'){
				$this.find('.om-slider-content').addClass('om-slider-effect-'+opts.effect);
			}
			vars.totalSlides = kids.length;
			_processControlNav($this);
			/**
			 * 内部方法。在effect="slide-h||slide-v"且startSlide>0的情况下需要在window.onload中执行。
			 */
			function _initSlider(slider, startSlide){
				if(isNaN(startSlide) || startSlide < 0 || startSlide >= vars.totalSlides){
					return;
				}
				var $container = slider.find('ul.om-slider-content'),
					$item = $container.children(),
					top = 0,
					left = 0;
				if(opts.effect == 'slide-h'){
					$item.each(function(n){
						if(n == startSlide) return false;
						left -= $(this).width();
					});
					setTimeout(function(){$container.css({left:left,top:top});},0);
				} else if(opts.effect == 'slide-v'){
					$item.each(function(n){
						if(n == startSlide) return false;
						top -= $(this).height();
					});
					// 修复omSlider在omTabs的隐藏tab下设置样式无效的问题。只在IE7浏览器下发生。
					setTimeout(function(){$container.css({left:left,top:top});},0);
				} else{
					$container.children().eq(startSlide).show();
				}
				
				if(vars.controlNav){
					_toggleControlNav(slider, startSlide);
				}
				if(opts.autoPlay){
					timer = setInterval(function(){_next(slider);},opts.interval);
				}
				if(opts.pauseOnHover){
					slider.hover(function(){
						vars.paused = true;
						clearInterval(timer);
					},function(){
						vars.paused = false;
						if(opts.autoPlay){
							timer = setInterval(function(){_next(slider);},opts.interval);
						}
					});
				}
				if(opts.directionNav){
					_processDirectionNav(slider);
				}
			}
			
			if(opts.startSlide > 0 && (opts.effect == 'slide-h' || opts.effect == 'slide-v')){
				// 考虑到slide的动画效果下如果设置startSlide>0需要计算startSlide前面的面板的大小。
				// 如果面板里面包含img标签的话只有在图片下载完后(既window.onload事件)才能获得面板的大小。
				$(window).load(function(){
					_initSlider($this,opts.startSlide);
				});
			} else{
				_initSlider($this,opts.startSlide);
			}

		});
	};
})(jQuery);/*
 * $Id: om-suggestion.js,v 1.72 2012/01/16 01:48:41 linxiaomin Exp $
 * operamasks-ui omSuggestion 1.0
 *
 * Copyright 2011, AUTHORS.txt (http://ui.operamasks.org/about)
 * Dual licensed under the MIT or GPL Version 2 licenses.
 * http://ui.operamasks.org/license
 *
 * http://ui.operamasks.org/docs/
 *
 * Depends:
 *  jquery.ui.core.js
 *  jquery.ui.widget.js
 */
;(function($){
    var suggestionRowClass='om-suggestion-list-row';
    var suggestionHighLightClass='om-state-hover';
    /**
     * @name omSuggestion
     * @class 
     * &nbsp;&nbsp;&nbsp;&nbsp;Ajax提示组件。类似于google首页的搜索功能（在输入的同时下拉框里给出可用的提示，用户可以从里面选择一个）。<br/>
     * &nbsp;&nbsp;&nbsp;&nbsp;将该功能添加到一个input输入框上，将允许用户在输入的同时可以快速地查找和选择所要的内容。当输入框得到焦点并输入字符时，该组件会将用户输入的内容以Ajax方式发送到服务器进行处理，服务器处理完后返回一个数据集，客户端将数据集显示成一个可选列表，用户可以从可选列表中很方便地选择自己所要查找的东西。<br/>
     * &nbsp;&nbsp;&nbsp;&nbsp;目前该组件主要用于从远程URL取得数据（如果是本地数据的话，可以使用omCombo组件，它也有边输入边过滤的功能）。一般用于从大量数据中进行查找的场合，如百度搜索、google搜索、taobao商品搜索、邮件系统快速输入收件人。<br/>
     * &nbsp;&nbsp;&nbsp;&nbsp;该组件有客户端缓存的功能，如输入a开始Ajax查找；再输入b（输入框内容是ab）再次Ajax查找；再删除b（输入框内容是a）将不进行Ajax查找，因为缓存中已经有key=a的缓存内容，将直接根据缓存内容来重构可选列表而不发送Ajax请求从服务器取数。如果不需要缓存可以将cacheSize参数设成0。如果要清除缓存可以调用clearCache()方法。<br/>
     * &nbsp;&nbsp;&nbsp;&nbsp;实际应用中一般都要控制可选列表框中记录的数目（如百度搜索、google搜索、taobao商品搜索的可选列表中记录数都为10，有道搜索的可选列表中记录数为8），这个要由服务器进行控制，服务器返回数据时请不要返回得太多（比如从数据库中查询时一般使用TOP-N查询）。<br/><br/>
     * <b>特点：</b><br/>
     * <ol>
     *      <li>可以使用普通数组，也可使用JSON数组</li>
     *      <li>支持鼠标操作和键盘操作</li>
     *      <li>支持数据的客户端缓存</li>
     *      <li>提供丰富的事件</li>
     *      <li>用户可定制数据的显示效果</li>
     *      <li>用户可定制请求的发送与处理</li>
     *      <li>支持跨域请求数据</li>
     * </ol><br/>
     * <b>示例：</b><br/>
     * <pre>
     * &lt;script type="text/javascript" >
     * $(document).ready(function() {
     *     $('#input1').omSuggestion({
     *         dataSource:'/suggestion.json',
     *         minChars :3,
     *         listMaxHeight:40
     *     });
     * });
     * &lt;/script>
     * 
     * &lt;input id="input1"/>
     * </pre>
     * @constructor
     * @description 构造函数. 
     * @param p 标准config对象：
     */
    $.widget('om.omSuggestion', {
        options:/** @lends omSuggestion#*/{
            /**
             * 是否禁用组件。如果禁用，则不可以输入，form提交时也将忽略这个输入框。
             * @type Boolean
             * @default false
             */
            disabled : false,
            /**
             * 组件是否只读。如果是只读，则不可以输入，form提交时将会包含这个输入框。
             * @type Boolean
             * @default false
             */
            readOnly : false,
            /**
             * 输入框输入字符数大于等于minChars时，才发送请求。<b>注意：如果要页面一显示完就开始提示，可以设成0。</b>
             * @type Number
             * @default 1
             */
            minChars : 1,
            /**
             * 发送请求的延迟时间（单位是毫秒）。比如设成300，假设输入时每隔100ms输入一个字符，则快速输入1234时，只会在4输入完成后300ms才进行一次提示。<b>注意：如果此属性值设成0或负数则不会延迟</b>
             * @type Number
             * @default 500
             */
            delay : 500,
            /**
             * 本地缓存的数目。组件针对每一次输入值进行缓存，如果缓存中存在输入域中的输入值，不再发送ajax请求取数。<br/>
             * <b>注意：该属性值必须为非负整数。设置cacheSize:0禁用缓存</b>
             * @type Number
             * @default 10
             */
            cacheSize : 10,
            /**
             * Ajax请求时的方式，取值GET'或'POST'。
             * @type String
             * @default 'GET'
             */
            method : 'GET',
            /**
             * 下拉框的最大高度（单位是px）。<b>注意：由于浏览器的限制，这个属性的最小值是31，如果小于这个值时将看不到垂直滚动条</b>
             * @type Number
             * @default 300
             */
            listMaxHeight : 300,
            /**
             * 发送Ajax请求时代表输入值的参数名。比如url是'fetchData.jsp?type=book'，queryName是'q'，当前输入的值是'abc'，则最终发送请求的url是'fetchData.jsp?type=book&q=abc'。
             * @type String
             * @default 'key'
             */
            queryName : 'key',
            /**
             * Ajax请求是否需要跨域（从本页面所在的网站以外的地方取数）。<b>注意：跨域请求时后台处理逻辑要进行特殊处理，具体请参考jQuery的JSONP相关知识。</b>
             * @type Boolean
             * @default false
             */
            crossDomain : false,
            /**
             * 数据成功响应后触发事件。<b>注意：此方法一定要返回处理后的结果。</b><br/>
             * 一个Ajax请求成功（不出错误也不超时）后会先执行onSuccess事件的监听器，如果它返回false则不显示下拉框。如果没有监听器或者监听没有返回false则执行此preProcess预处理，处理结束后开始刷新并显示下拉框。
             * @event
             * @name omSuggestion#preProcess
             * @type Function
             * @default 无
             * @example
             * //text是输入框的值,data是服务器返回的数据
             * preProcess:function(text,data){
             *     return $(data).each(function(){
             *         this.sex = this.sex==0?'男':'女';
             *     });
             * }
             */
            /**
             * Ajax请求的URL路径，所有的请求将由此URL来处理，处理结果必须返回一个JSON数组。<br/>
             * 后台可以返回两种格式的数据：
             * <ul>
             * <li><b>普通数组（如['a','b','c']）：可以不设置clientFormatter属性，也可以设置这个属性。</b></li>
             * <li><b>非普通数组（如{"valueField":"text","data":[{"name":'张三',"sex":"男"},{"name":'李四',"sex":"女"},{"name":'王五',"sex":"男"}]}）：其中valueField表示回填时把data中每个JSON对象的哪个字段回填到输入框里。非普通数组时必须设置clientFormatter属性来告诉组件如果把这个JSON对象显示到下拉框里。</b></li>
             * @name omSuggestion#dataSource
             * @type URL
             * @default 无
             * @example
             * dataSource:'/operamasks-ui/getData.json'
             */
            /**
             * 下拉框中每行显示内容的转换器。对dataSource进行格式化（<b>注意：如果dataSource返回的是非普通数组(具体请看dataSource属性的描述)一定要写clientFormatter属性进行格式化</b>）。<br/>
             * @name omSuggestion#clientFormatter
             * @type Function
             * @example
             * //对于非普通record一定要写这个属性
             * clientFormatter:function(data,index){
             *         return '&lt;b>'+data.text+'&lt;/b>(共找到'+data.count+'条记录)';
             * }
             * 
             * //对于普通的record也可以写这个属性
             * clientFormatter:function(data,index){
             *         return '&lt;span style="color:red">'+data+'&lt;/span>;
             * }
             */
            /**
             * 下拉框的宽度。必须为数字。<b>不设置时默认与输入框一样宽</b>
             * @name omSuggestion#listWidth
             * @type Number
             * @default 无
             */
            /**
             * 发送Ajax请求之前触发事件。<b>注意：return false将会阻止请求发送。无返回值或return true将继续发送请求</b>
             * @event
             * @param text 输入框里当前文本
             * @example
             * $('#inputID').omSuggestion({
             *         onBeforeSuggest:function(text){
             *                 if(text=='不文明用语'){
             *                         return false;//如果是不文明用语不进行提示
             *                 }else{
             *                         return true;
             *                 } 
             *         }
             * });
             */
            onBeforeSuggest : function(text){/*do nothing*/},
            /**
             * Ajax请求发送后响应回来前触发事件。
             * @event
             * @param text 输入框里当前文本
             * @example
             * $('#inputID').omSuggestion({
             *         onSuggesting:function(text){
             *                 $('#inputID').omSuggestion('showMessage','正在加载...'); 
             *         }
             * });
             */
            onSuggesting : function(text){/*do nothing*/},
            /**
             * Ajax响应回来时触发事件。
             * @event
             * @param data Ajax请求返回的数据
             * @param textStatus 响应的状态
             * @example
             * $('#inputID').omSuggestion({
             *         onSuccess:function(data, textStatus){
             *                 if(data.length==0){
             *                         $('#txt').omSuggestion('showMessage','无提示数据！');
             *                 } 
             *         }
             * });
             */
            onSuccess : function(data, textStatus){/*do nothing*/},
            /**
             * Ajax请求出错时触发事件。
             * @event
             * @param xmlHttpRequest XMLHttpRequest对象
             * @param textStatus  错误类型
             * @param errorThrown  捕获的异常对象
             * @example
             * $('#inputID').omSuggestion({
             *         onError:function(xmlHttpRequest, textStatus, errorThrown){
             *                 $('#txt').omSuggestion('showMessage','请求出错。原因：'+errorThrown.message); 
             *         }
             * });
             */
            onError : function(xmlHttpRequest, textStatus, errorThrown){/*do nothing*/},
            /**
             * 选择下拉框中一个后触发事件。
             * @event
             * @param text 输入框里当前文本
             * @param rowData 行记录，是Ajax请求返回的数据中的一行
             * @param index 当前行在下拉框所有行中的索引（第一行是0，第二行是1...）
             * @example
             * $('#inputID').omSuggestion({
             *         onSelect:function(rowData,text,index){
             *                 $('#searchbut').click(); //选择完后自动点击“查询”按钮
             *         }
             * });
             */
            onSelect : function(rowData,text,index){/*do nothing*/}
        },
        _create:function(){
            this.element.addClass('om-suggestion om-widget om-state-default om-state-nobg');
            this.dropList = $('<div class="om-widget"><div class="om-widget-content om-droplist"></div></div>').css({position:'absolute', zIndex:10000}).appendTo(document.body).children().first().hide();
        },
        _init:function(){
            var self = this,
				options = this.options,
				inputEl = this.element.attr('autocomplete', 'off'),
				dropList = this.dropList;
            //非法属性值修正
            if(options.minChars<0){
                options.minChars=0;
            }
            if(options.cacheSize<0){
                options.cacheSize=0;
            }
            if(options.delay<0){
                options.delay=0;
            }
            //其它处理
            options.disabled?this.disable():this.enable();
            options.readOnly?inputEl.attr('readonly', 'readonly'):inputEl.removeAttr('readonly');
            //绑定按键事件
            inputEl.focus(function(){      
                $(this).addClass("om-state-focus");
            }).blur(function(){      
                $(this).removeClass("om-state-focus");
            }).keydown(function(e){
                if(e.keyCode == 9){ //hide the dropList when press [Tab] key
                    dropList.hide();
                }
            }).keyup(function(e){
                var key = e.keyCode;
                switch (key) {
                    case 40: //down
                        if (dropList.css('display') !== 'none') {
                            self._selectNext();
                        } else {
                            if (dropList.find('.' + suggestionRowClass).size() > 0) {
                                dropList.show();
                            }
                        }
                        break;
                    case 38: //up
                        if (dropList.css('display') !== 'none') {
                            self._selectPrev();
                        } else {
                            if (dropList.find('.' + suggestionRowClass).size() > 0) {
                                dropList.show();
                            }
                        }
                        break;
                    case 13: //enter
                        if (dropList.css('display') === 'none'){
                            return;
                        }
                        dropList.hide();
                        //trigger onSelect handler
                        self._triggerOnSelect();
                        return false;
                    case 27: //esc
                        dropList.hide();
                        break;
                    case 9: //tab
                        //only trigger the blur event
                        break;
                    default:
                        if (options.disabled || options.readOnly) {
                            return false;
                        }
                        if (options.delay > 0) {
                            var delayTimer = $.data(inputEl, 'delayTimer');
                            if (delayTimer) {
                                clearTimeout(delayTimer);
                            }
                            delayTimer = setTimeout(function(){
                                self._suggest();
                            }, options.delay);
                            $.data(inputEl, 'delayTimer', delayTimer);
                        } else {
                            self._suggest();
                        }
                }
            }).mousedown(function(e){
                e.stopPropagation();
            });
            dropList.mousedown(function(e){
                e.stopPropagation();
            });
            $(document).bind('mousedown.omSuggestion',function(){
                dropList.hide();
            });
        },
        /**
         * 清空与此组件相关的缓存数据。每次提示后都会将结果集缓存（缓存的数目为config中配置的cacheSize），下次再需要对相同内容进行提示时会直接从缓存读取而不发送请求到服务器，如果需要忽略缓存而从服务器重新提示则可以调用此方法清除缓存。
         * @name omSuggestion#clearCache
         * @function
         * @returns 无
         * @example
         * $('#txt').omSuggestion('clearCache');
         */
        clearCache:function(){
            $.removeData(this.element,'cache');
        },
        /**
         * 在下拉框中显示一个提示信息（仅用于阅读，不可以通过快捷键或鼠标选择它）。
         * @name omSuggestion#showMessage
         * @function
         * @param message 要显示在下拉框中的消息
         * @example
         * $('#txt').omSuggestion('showMessage','请求数据出错');
         */
        showMessage: function(message){
            var inputEl = this.element;
            var dropList = this.dropList.empty().css('height','auto');
            $('<div>' + message + '<div>').appendTo(dropList);
            dropList.parent().css('left', inputEl.offset().left).css('top',inputEl.offset().top+inputEl.outerHeight());
            var listWidth = this.options.listWidth;
            if (!listWidth) {//没有定义
                dropList.parent().width(inputEl.outerWidth());
            } else if (listWidth !== 'auto') {
                dropList.parent().width(listWidth);
            }
            dropList.show();
            var listMaxHeight = this.options.listMaxHeight;
            if(listMaxHeight !== 'auto'){
                if(dropList.height() > listMaxHeight){
                    dropList.height(listMaxHeight).css('overflow','auto');
                }
            }
            return this;
        },
        /**
         * 禁用组件。
         * @name omSuggestion#disable
         * @function
         * @example
         * $('#myinput').omSuggestion('disable');
         */
        disable:function(){
            this.options.disabled=true;
            return this.element.attr('disabled', 'disabled').addClass('om-state-disabled');
        },
        /**
         * 启用组件。
         * @name omSuggestion#enable
         * @function
         * @example
         * $('#myinput').omSuggestion('enable');
         */
        enable:function(){
            this.options.disabled=false;
            return this.element.removeAttr('disabled').removeClass('om-state-disabled');
        },
        /**
         * 设置新的请求地址，新地址表示参数的改变或者地址的改变。
         * @name omSuggestion#setData
         * @function
         * @param dataSource
         * @example
         * $('#country').change(function() {
         *   var v = $('#country').val();
         *   $('#txt').omSuggestion("setData","../../../advancedSuggestion.json?contry="+v+"&province=hunan");
         * });
         */
        setData:function(dataSource){
            var options = this.options;
            if(dataSource){
                options.dataSource = dataSource;
            }
			if(options.cacheSize > 0){
			    this.clearCache(); //清空缓存
			}
        },
        /**
         * 获取当前下拉框中的数据（服务器端返回的数据）。
         * @name omSuggestion#getData
         * @function
         * @return Array[Json]
         * @example
         * $('#txt').omSuggestion("getData");
         */
        getData:function(){
            var returnValue = $.data(this.element, 'records');
            return returnValue || null;
        },
        /**
         * 获取当前组件的下拉框。
         * @name omSuggestion#getDropList
         * @function
         * @return jQuery Element
         * @example
         * $('#txt').omSuggestion("getDropList").addClass('myselfClass');
         */
        getDropList:function(){
            return this.dropList;
        },
        _clear:function(){
            this.element.val('');
            return this.dropList.find('.'+suggestionRowClass).removeClass(suggestionHighLightClass);
        },
        _selectNext:function(){
            var dropList = this.dropList,
                index = dropList.find('.' + suggestionHighLightClass).index(),
                all = this._clear();
            index += 1;
            if (index >= all.size()) {
                index = 0;
            }
            this._scrollToAndSelect(all,index,dropList);
        },
        _selectPrev:function(){
            var dropList = this.dropList,
                index = dropList.find('.' + suggestionHighLightClass).index(),
                all = this._clear();
            index-=1;
            if(index<0){
                index=all.size()-1;
            }
            this._scrollToAndSelect(all,index,dropList);
        },
        _scrollToAndSelect:function(all,index,dropList){
        	if(all.size()<1){
        		return;
        	}
            var target = $(all.get(index)).addClass(suggestionHighLightClass);
            var targetTop = target.position().top;
            if (targetTop <= 0) {
                //需要向上滚动滚动条
                dropList.scrollTop(dropList.scrollTop() + targetTop);
            } else {
                //需要向下滚动滚动条
                var offset = targetTop + target.outerHeight() - dropList.height();
                if (offset > 0) {
                    dropList.scrollTop(dropList.scrollTop() + offset);
                }
            }
            this._select(index);
        },
        _select:function(index){
            var inputEl = this.element;
            var records=$.data(inputEl, 'records');
            var rowData,text;
            if(records.valueField){
                rowData=records.data[index];
                text=rowData[records.valueField];
            }else{
                rowData=records[index];
                text=rowData;
            }
            inputEl.val(text);
            $.data(inputEl, 'lastStr', text);
        },
        _suggest:function(){
            var inputEl = this.element;
            var text = inputEl.val();
            var last = $.data(inputEl, 'lastStr');
            if (last && last === text) {
                return;
            }
            $.data(inputEl, 'lastStr', text);
            var options = this.options;
            var cache = $.data(inputEl, 'cache');
            if (text.length > 0 && text.length >= options.minChars) {
                if (cache) {
                    var data = cache[text];
                    if (data) {//有缓存
                        $.data(inputEl, 'records', data);
                        this._buildDropList(data, text);
                        return;
                    }
                }
                //无缓存
                if (options.onBeforeSuggest) {
                    if (options.onBeforeSuggest(text) === false) {
                    	this.dropList.empty().hide();
                        return;
                    }
                }
                var self = this;
                var requestOption = {
                    url: options.dataSource,
                    type: options.method,
                    dataType: options.crossDomain ? 'jsonp':'json',
                    data: {},
                    success: function(data, textStatus){
                        var onSuccess = options.onSuccess;
                        if (onSuccess && onSuccess(data, textStatus) === false) {
                            return;
                        }
                        var preProcess = options.preProcess;
                        if(preProcess){
                            data = preProcess(text,data);
                        }
                        //如果有preProcess且没有返回值
                        if(typeof data === 'undefined'){
                            data=[];
                        }
                        //cache data
                        if (options.cacheSize > 0) {
                            var cache = $.data(inputEl, 'cache') ||
                            {
                                ___keys: []
                            };
                            var keys = cache.___keys;
                            if (keys.length == options.cacheSize) {
                                //cache满了先去掉一个
                                var k = keys[0];
                                cache.___keys = keys.slice(1);
                                cache[k] = undefined;
                            }
                            cache[text] = data;
                            cache.___keys.push(text);
                            $.data(inputEl, 'cache', cache);
                        }
                        $.data(inputEl, 'records', data);
                        //buildDropList
                        self._buildDropList(data, text);
                    },
                    error: function(XMLHttpRequest, textStatus, errorThrown){
                        var onError = options.onError;
                        if (onError) {
                            onError(XMLHttpRequest, textStatus, errorThrown);
                        }
                    }
                };
                requestOption.data[options.queryName]=text;
                $.ajax(requestOption);
                var onSuggesting = options.onSuggesting;
                if (onSuggesting) {
                    onSuggesting(text);
                }
            } else {
            	this.dropList.empty().hide();
            }
        },
        _buildDropList:function(records,text){
            var inputEl = this.element;
            var dropList = this.dropList.empty().css('height','auto');
            var isSimple = records.valueField ? false : true;
            var clientFormatter = this.options.clientFormatter;
            var self = this;
            if (isSimple) {
                if (clientFormatter) {
                    $(records).each(function(index){
                        self._addRow(clientFormatter(this, index), dropList);
                    });
                } else {
                    $(records).each(function(index){
                        self._addRow(this, dropList);
                    });
                }
            } else {
                if (clientFormatter) {
                    $(records.data).each(function(index){
                        self._addRow(clientFormatter(this, index), dropList);
                    });
                }
            }
            var all = dropList.find('.' + suggestionRowClass);
            if (all.size() > 0) {
                dropList.parent().css('left', parseInt(inputEl.offset().left)).css('top',inputEl.offset().top+inputEl.outerHeight());
                var listWidth = this.options.listWidth;
                if (!listWidth) {//没有定义
                    dropList.parent().width(inputEl.outerWidth());
                } else if (listWidth !== 'auto') {
                    dropList.parent().width(listWidth);
                }
                all.mouseover(function(){
                    all.removeClass(suggestionHighLightClass);
                    $(this).addClass(suggestionHighLightClass);
                }).mousedown(function(){
                    var index = dropList.find('.' + suggestionHighLightClass).index();
                    self._select(index);
                    dropList.hide();
                    //trigger onSelect handler
                    self._triggerOnSelect();
                });
                dropList.show();
                var listMaxHeight = this.options.listMaxHeight;
                if(listMaxHeight !== 'auto'){
                    if(dropList.height() > listMaxHeight){
                        dropList.height(listMaxHeight).css('overflow','auto');
                    }
                }
                dropList.scrollTop(0);
            }
        },
        _addRow: function(html,dropList){
            $('<div class="' + suggestionRowClass + '">' + html + '</div>').appendTo(dropList);
        },
        _triggerOnSelect: function(){
            var onSelect=this.options.onSelect;
            if(onSelect){
                var index = this.dropList.find('.' + suggestionHighLightClass).index();
                if(index<0){
                    return;
                }
                var records=$.data(this.element, 'records'),
                    rowData,
                    text;
                if(records.valueField){
                    rowData=records.data[index];
                    text=rowData[records.valueField];
                }else{
                    rowData=records[index];
                    text=rowData;
                }
                onSelect(rowData,text,index);
            }
        }
    });
    
})(jQuery);
/*
 * $Id: om-tabs.js,v 1.65 2012/01/16 01:48:41 linxiaomin Exp $
 * operamasks-ui omTabs 1.0
 *
 * Copyright 2011, AUTHORS.txt (http://ui.operamasks.org/about)
 * Dual licensed under the MIT or GPL Version 2 licenses.
 * http://ui.operamasks.org/license
 *
 * http://ui.operamasks.org/docs/
 *
 * Depends:
 *  om-panel.js
 */
/**
 * $.fn.omTabs
 * 将如下html结构转变成一个tab页签布局。
 *      <div id="make-tab">
 *          <ul>
 *              <li>
 *                  <a href="#tab1"></a>
 *              </li>
 *              <li>
 *                  <a href="#tab2"></a>
 *              </li>
 *              <li>
 *                  <a href="#tab3"></a>
 *              </li>
 *          </ul>
 *          <div id="tab1">
 *              this is tab1 content
 *          </div>
 *          <div id="tab2">
 *              this is tab2 content
 *          </div>
 *          <div id="tab3">
 *              this is tab3 content
 *          </div>
 *      </div>
 *          ......//some other stuff
 *      
 *  最终的dom结构如下所示：
 * 
 *      <div id="make-tab" class="om-tabs">
 *          <div class="om-tabs-headers">
 *              <ul>
 *                  <li>
 *                      <a href="#tab1"></a>
 *                  </li>
 *                  <li>
 *                      <a href="#tab2"></a>
 *                  </li>
 *                  <li>
 *                      <a href="#tab3"></a>
 *                  </li>
 *              </ul>
 *          </div>
 *          <div class="om-tabs-panels">
 *              <div id="tab1">
 *                  this is tab1 content
 *              </div>
 *              <div id="tab2">
 *                  this is tab2 content
 *              </div>
 *              <div id="tab3">
 *                  this is tab3 content
 *              </div>
 *          </div>
 *      
 *      </div>
 * 
 */
(function(){
    var tabIdPrefix = 'om-tabs-' + (((1+Math.random())*0x10000)|0).toString(16).substring(1) + '-',
        id = 0;
    /**
     * class OmPanel， 在target指定的地方根据config生成一个Panel， 该类是$.fn.omPanel包装器。
     * param target dom元素，一般指向一个div。
     * param config 生成Panel所需要的配置项，如果设置了content属性，则使用其为内容将会被传递给 $.fn.omPanel。
     * return 原先的target
     */
    function OmPanel (target, config) {
        if ( config.content ) {
            $(target).text(config.content);
        }
        $(target).omPanel(config);
        return target;
    }
    function makeSketch(self) {
        var tabs = $(self).find('>ul').wrap('<div class="om-tabs-headers om-helper-reset om-helper-clearfix om-widget-header om-corner-all"></div>').parent().parent();
        tabs.addClass('om-tabs om-widget om-widget-content om-corner-all').append('<div class="om-tabs-panels om-widget-content om-corner-bottom"></div>');
        //now we have a sketch, which contains the headers and panels
        return tabs;
    }
    function collectItems(self) {
        var options = $.data(self, 'omtabs').options;
        var items = [];
        $(self).find('>div.om-tabs-headers a').each(function(){
            var href  = this.getAttribute('href', 2);
            var hrefBase = href.split( "#" )[ 0 ],
                baseEl;
            if ( hrefBase && ( hrefBase === location.toString().split( "#" )[ 0 ] ||
                    ( baseEl = $( "base" )[ 0 ]) && hrefBase === baseEl.href ) ) {
                href = this.hash;
                this.href = href;
            }
            var anchor = $(this);
            var tabId = anchor.attr('tabId') || anchor.attr('id') || tabIdPrefix + id++ ;
            anchor.attr('tabId', tabId);
            var cfg = {
                    tabId : tabId,
                    title : anchor.text(),
                    noHeader : true,
                    onLoad : function() {
                        options.onLoadComplete.call(self, tabId);
                    },
                    closed : true,//先全部隐藏.
                    lazyLoad : true, //先全部不加载
                    border : false
            };
            var target = $('>' + href, $(self))[0];
            
            // 考虑到tab DOM结构不完整的情况。
            // 例如，当anchor的href='#tab-3'，而用户忘记在tabs里面写id=tab-3的DOM，此时不应该把#tab-3作为url进行load
            // http://jira.apusic.net/browse/AOM-204
            if (!target && href.indexOf('#') != 0) {
                //是url
                cfg.url = href;
            }
            var item = new OmPanel(target || $('<div></div>')[0], cfg);
            items.push(item);
        });
        // items 是panel的集合.每一个item通过 $(item).omPanel('panel')之后能获取到对应的panel对象
        return items;
    }
    function render(self) {
        var data = $.data(self, 'omtabs'),
            options = data.options,
            omtabs = data.omtabs,
            items = data.items;
        // 对不合法的值处理
        if(typeof options.active == 'number'){
        	if (options.active < 0) {
        		options.active = 0;
        	}
        	if (options.active > items.length - 1) {
        		options.active = items.length - 1;
        	}
        }
        if (options.width == 'fit') {
            omtabs.css('width', '100%');
        } else if (options.width != 'auto') {
            omtabs.css('width', options.width);
            // 解决IE7下，tabs在table>tr>td中ul把table的宽度撑宽的问题
//            omtabs.children(':first').css('width',options.width);
            var isPercent = isNaN(options.width) && options.width.indexOf('%') != -1;
            omtabs.children(':first').css('width',isPercent?'100%':options.width);
        }
        if (options.height == 'fit') {
            omtabs.css('height', '100%');
        } else if (options.height != 'auto') {
            omtabs.css('height', options.height);
        }
        renderHeader(self);
        renderBody(self);
    }
    function renderHeader(self) {
        var data = $.data(self, 'omtabs'),
            options = data.options,
            omtabs = data.omtabs;
        var headers = omtabs.find('>div.om-tabs-headers');
        var lis = headers.find('ul li');
        lis.addClass('om-state-default om-corner-top');
        lis.each(function(n){
            var innera = $(this).find('a:first');
            if ($.browser.msie && parseInt($.browser.version) == 7 ) {
                innera.attr('hideFocus', 'true');
            }
            if (!innera.hasClass('om-tabs-inner')) {
                innera.addClass('om-tabs-inner');
            }
            if (n === options.active || options.active === innera.attr('tabId')) {
                $(this).addClass('om-tabs-activated om-state-active');
                options.activeTabId = innera.attr('tabId');
                options.active = n;
            }
            //tab width and height. by default, tabWidth=80 tabHeight=25, accept 'auto'
            innera.css({
                'width' : options.tabWidth,
                'height' : options.tabHeight
            });
            if (options.closable===true || ($.isArray(options.closable) && -1 !== $.inArray(n,options.closable))) {
                $('<a class="om-icon om-icon-close"></a>').insertAfter(innera);
            }
        });
        var aHeight = lis.find('a').height();
        lis.parent().css({
            'height' : ++ aHeight ,
            'line-height' : aHeight + 'px'
        });
        headers.height(aHeight + 2);
        _checkScroller(self) && _enableScroller(self);
    }
    function renderBody(self) {
        var data = $.data(self, 'omtabs'),
            options = data.options,
            omtabs = data.omtabs,
            items = data.items;
        var panels = omtabs.find('>div.om-tabs-panels');
        //detach all sub divs
        panels.children().detach();
        if (options.height !== 'auto') {
            var omtabsHeight = omtabs.innerHeight(),
                headersHeight = omtabs.find('>div.om-tabs-headers').outerHeight();
            panels.css('height', omtabsHeight - headersHeight);
        }
        if (!options.border) {
            omtabs.css('border-width', '0');
        }
        var i = items.length;
        while( i -- ) {
            var panel = $(items[i]).omPanel('panel');
            panel.prependTo(panels);
        }
    }
    function afterRender(self) {
        var data = $.data(self, 'omtabs'),
            options = data.options,
            items = data.items,
            omtabs = data.omtabs;
        var i = items.length;
        $(self).children().each(function(){
            if (!$(this).hasClass('om-tabs-headers') &&
                    !$(this).hasClass('om-tabs-panels') ) {
                $(this).remove();
            }
        });
        if (!options.lazyLoad) {
            $(items).omPanel('reload');
        }
        while( i -- ) {
            var target = $(items[i]);
            if (i == options.active) {
                target.omPanel('open');
            } else {
                target.omPanel('close');
            }
        }
        omtabs.css('height',omtabs.height());
    	omtabs.css('height',options.height);
    }
    function buildEvent(self) {
        var data = $.data(self, 'omtabs'),
            options = data.options,
            omtabs = data.omtabs;
        //close icon
        omtabs.find('>div.om-tabs-headers a.om-icon-close').bind('click.omtabs', function(e){
            var tabid = $(e.target).prev().attr('tabId');
            _close(self, tabid);
            return false;
        });
        // tab click
        var tabInner = omtabs.find('>div.om-tabs-headers a.om-tabs-inner'); 
        if (options.switchMode.indexOf('mouseover') != -1) {
        	tabInner.bind('mouseover.omtabs', function() {
                 var tabId = $(this).attr('tabId'), timer = $.data(self, 'activateTimer');
                (typeof timer !=='undefined') && clearTimeout(timer);
                timer = setTimeout(function(){
                    _activate(self, tabId);
                    return false;
                },500);
                $.data(self, 'activateTimer', timer);
            });
        } else if (options.switchMode.indexOf('click') != -1 ) {
        	tabInner.bind('click.omtabs', function(){
                _activate(self, $(this).attr('tabId'));
            });
        }
        tabInner.bind('click.omtabs',function(){
        	return false;
        });
        if (options.autoPlay != false ) {
            options.autoInterId = setInterval(function(){
                $(self).omTabs('activate', 'next');
            }, options.interval);
        }
        //tab hover
        if ( options.switchMode.indexOf("mouseover") == -1 ) {
            var lis = omtabs.find('>div.om-tabs-headers li');
            var addState = function( state, el ) {
                if ( el.is( ":not(.om-state-disabled)" ) ) {
                    el.addClass( "om-state-" + state );
                }
            };
            var removeState = function( state, el ) {
                el.removeClass( "om-state-" + state );
            };
            lis.bind( "mouseover.omtabs" , function() {
                addState( "hover", $( this ) );
            });
            lis.bind( "mouseout.omtabs", function() {
                removeState( "hover", $( this ) );
            });
        }
        //scroller click
        omtabs.find('>div.om-tabs-headers >span').bind('click.omtabs', function(e) {
            if ($(this).hasClass('om-tabs-scroll-disabled')) {
                return false;
            }
            var scrOffset =  $(this).offset();
            var ul = $(this).parent().find('ul');
            var li = ul.children(':last');
            var dist = li.outerWidth(true);
            var parent = $(this).parent();
            if ($(this).hasClass('om-tabs-scroll-left')) {
                _scroll(self, dist, _scrollCbFn(self));
            }
            if ($(this).hasClass('om-tabs-scroll-right')) {
                _scroll(self, - dist, _scrollCbFn(self));
            }
            return false;
        });
    }
    //remove every events.
    function purgeEvent(self) {
        var data = $.data(self, 'omtabs'),
            options = data.options,
            omtabs = data.omtabs;
        var headers = omtabs.find('>div.om-tabs-headers');

        headers.children().unbind('.omtabs');
        headers.find('>ul >li >a').unbind('.omtabs');
        if (options.autoInterId) {
            clearInterval(options.autoInterId);
        }
    }
    //private methods
    /**
     * 选中特定的页签
     * n 可为页签的索引（从0开始计数），或者页签的tabId TODO n 需要支持first  和 last 表示选中第一个和最后一个
     */
    function _activate(self, n) {
        var data = $.data(self, 'omtabs'),
            options = data.options,
            omtabs = data.omtabs,
            items = data.items;
        var ul = omtabs.find('>div.om-tabs-headers ul');
        if ( options.activeTabId == n || options.active == n ) {
            return false;
        }
        n = n || 0;
        var anchor , tid = n;
        if ( n == 'next' ) {
            n = (options.active + 1) % items.length ;
        } else if ( n == 'prev' ) {
            n = (options.active - 1) % items.length ;
        } 
        if (typeof n == 'number') {
            tid = _getAlter(self, n);
        } else if (typeof n == 'string') {
            n = _getAlter(self, n);
        }
        if (options.onBeforeActivate.call(self, n) == false) {
            return false;
        }
        anchor = ul.find('li a[tabId=' + tid + ']');
        anchor.parent().siblings().removeClass('om-tabs-activated om-state-active');
        anchor.parent().addClass('om-tabs-activated om-state-active');
        options.activeTabId = tid;
        options.active = n;
        var i = items.length;
        // 保证切换面板时先显示后隐藏，防止页面抖动的现象
        for(i=items.length;i--;i>=0){
        	var target = $(items[i]);
        	if (target.omPanel('options').tabId == tid) {
        		target.omPanel('open');
        	}
        }
        for(i=items.length;i--;i>=0){
        	var target = $(items[i]);
        	if (target.omPanel('options').tabId != tid) {
        		target.omPanel('close');
        	}
        }
        //当选中了一个并未完全显示的页签,需要滚动让他完全显示出来
        if (_checkScroller(self)) {
            //stop every animation.
            ul.stop(true, true);
            $(self).clearQueue();
            var lScroller = ul.prev();
            var rScroller = ul.next();
            var lBorder = anchor.parent().offset().left;
            var rBorder = lBorder + anchor.parent().outerWidth(true);
            var lDiff = lScroller.offset().left + lScroller.outerWidth(true) + 4 - lBorder ;
            var rDiff = rScroller.offset().left - rBorder ;
            if (lDiff >= 0) {
                _scroll(self, lDiff, _scrollCbFn(self));
            } else if (rDiff <= 0) {
                _scroll(self, rDiff, _scrollCbFn(self));
            } else {
                _scrollCbFn(self)();
            }
        }
        options.onActivate.call(self, n);
    }
    
    /**
     * 页签索引和tabId的转换器。
     * 如果传入的id为数字，则表示页签的索引，函数返回页签的tabId；如果id为字符串，则表示该页签的tabId，函数返回页签的索引。
     */
    function _getAlter (self, id) {
        var omtabs = $.data(self, 'omtabs').omtabs,
            rt;
        if (typeof id == 'number'){
            rt = omtabs.find('>div.om-tabs-headers li:nth-child(' + ++id + ') a.om-tabs-inner').attr('tabId');
        } else if (typeof id == 'string') {
            omtabs.find('>div.om-tabs-headers li a.om-tabs-inner').each(function(i){
                if ($(this).attr('tabId') == id ) {
                    rt = i;
                    return false;
                }
            });
        }
        return rt;
    }
    /**
     * 返回当前选中的页签的tabId
     */
    function _getActivated(self) {
        var options = $.data(self, 'omtabs').options;
        return options.activeTabId;
    }
    /**
     * 增加一个tab到页签布局中.最后一个参数isAjax指示了ds是否为一个URL
     */
    function _add (self, config/*title, content, url, closable , index,tabId*/) {
        var data = $.data(self, 'omtabs'),
            options = data.options,
            omtabs = data.omtabs,
            items = data.items;
        var ul = omtabs.find('>div.om-tabs-headers ul');
        var tabId = config.tabId?config.tabId:tabIdPrefix + id++;
        //调整参数
        config.index = config.index || 'last';
        if (config.index == 'last' || config.index > items.length - 1) {
            config.index = items.length;
        }
        config.title = config.title || 'New Title ' + tabId;
        config.url = $.trim(config.url);
        config.content = $.trim(config.content);
        if (config.url) {
            config.content = undefined;
        } else {
            config.url = undefined;
            config.content = config.content || 'New Content ' + tabId;
        }
        if (options.onBeforeAdd.call(self, config/*title, content, url, closable , index*/) == false) {
            return false;
        }
        var nHeader=$('<li class="om-state-default om-corner-top"> </li>');
        var anchor = $('<a class="om-tabs-inner"></a>').html(config.title).attr({
                href : '#' + tabId,
                tabId : tabId
            }).css({
                width : options.tabWidth,
                height : options.tabHeight
            }).appendTo(nHeader);
        if ($.browser.msie && parseInt($.browser.version) == 7) {
            anchor.attr('hideFocus','true');
        }
        if ((config.closable === true) || 
                (config.closable == undefined && options.closable)) {
            anchor.after('<a class="om-icon om-icon-close"></a>');
        }
        var cfg = {
            tabId : tabId,
            noHeader : true,
            closed : true,
            lazyLoad : options.lazyLoad,
            onLoad : function() {
                options.onLoadComplete.call(self, tabId);
            },
            border : false
        };
        
        $.extend(cfg, config);
        var nPanel = new OmPanel($('<div></div>')[0],cfg);
        if (config.index == items.length) {
            items[config.index] = nPanel;
            nHeader.appendTo(ul);
        } else {
            //insert at index
            items.splice(config.index, 0, nPanel);
            ul.children().eq(config.index).before(nHeader);
        }
        //every time we add or close an tab, check if scroller is needed.
        _checkScroller(self) && _enableScroller(self);
        renderBody(self);
        purgeEvent(self);
        buildEvent(self);
        options.onAdd.call(self, cfg);
        _activate(self, config.index);
    }
    /**
     * 将index处的页签关闭，如果index指向当前页签，则激活下一页签；如果当前页签是最后一个页签，则激活第一个页签
     * index :页签的位置，可为数字，tabId等。 TODO index将要支持prev，  next， first， last
     */
    function _close (self, index) {
        var data = $.data(self, 'omtabs'),
            options = data.options,
            omtabs = data.omtabs,
            items = data.items;
        var headers = omtabs.find('>div.om-tabs-headers');
        var panels = omtabs.find('>div.om-tabs-panels');
        var omtabsHeight = omtabs.height();
        index = (index === undefined ? options.active:index);
        if (typeof index == 'string') {
            //index is a tabid
            index = _getAlter(self, index);
        }
        if (options.onBeforeClose.call(self, index) == false) {
            return false;
        }
        headers.find('li').eq(index).remove();
        panels.children().eq(index).remove();
        items.splice(index, 1);
        //in case of all tabs are closed, set body height
        if (panels.children().length == 0) {
            panels.css({height : omtabsHeight - headers.outerHeight()});
        }
        options.onClose.call(self, index);
        if (items.length == 0) {
            options.active = -1;
            options.activeTabId = null;
            return ;
        } else if (index == options.active) {
            options.active = -1;
            !items[index] && (index = 0);
            _activate(self, index);
        } else {
            index < options.active && options.active --;
            _checkScroller(self) && _enableScroller(self);
        }
    } 
    /**
     * 关闭所有页签，该操作会触发 closeAll事件
     */
    function _closeAll(self) {
        var data = $.data(self, 'omtabs'),
            options = data.options,
            omtabs = data.omtabs,
            items = data.items;
        var headers = omtabs.find('>div.om-tabs-headers');
        var panels = omtabs.find('>div.om-tabs-panels');
        var omtabsHeight = omtabs.height();
        
        if (options.onBeforeCloseAll.call(self) == false) {
            return false;
        }
        headers.find('li').remove();
        panels.children().remove();
        items.splice(0,items.length);
        panels.css({height : omtabsHeight - headers.outerHeight()});
        options.active = -1;
        options.activeTabId = null;
        options.onCloseAll.call(self);
    }
    /**
     * 如果tab页签总宽度较大，则显示scroll并返回true；否则删除scroll并返回false。
     */
    function _checkScroller(self) {
        var data = $.data(self, 'omtabs'),
            options = data.options,
            omtabs = data.omtabs;
        if (!options.scrollable) {
            return false;
        }
        var ul = omtabs.find('>div.om-tabs-headers ul');
        var totalWidth = 0, flag = false;
        if (ul.hasClass('om-tabs-scrollable')) {
            //先假定没有左右滚动器 ,来计算宽度是否超过.
            flag = true;
            ul.removeClass('om-tabs-scrollable');
        }
        totalWidth += parseInt(ul.css('paddingLeft')) + parseInt(ul.css('paddingRight'));
        if (flag == true) {
            //重新加上滚动器 .
            flag = false;
            ul.addClass('om-tabs-scrollable');
        }
        ul.children().each(function() {
            //计算一个li占用的总宽度
            totalWidth += $(this).outerWidth(true);//sub element's width
        });
        if (totalWidth > ul.parent().innerWidth()) {
            if (!ul.hasClass('om-tabs-scrollable')) {
                var leftScr = $('<span></span>').insertBefore(ul).addClass('om-tabs-scroll-left');
                var rightScr = $('<span></span>').insertAfter(ul).addClass('om-tabs-scroll-right');
                var mgn = (ul.height() - leftScr.height())/2;
                leftScr.add(rightScr).css({ // scroller in vertical center.
                    'marginTop' : mgn,
                    'marginBottom' : mgn
                });
                ul.addClass('om-tabs-scrollable');
            }
            return true;
        } else {
            ul.siblings().remove();
            ul.removeClass('om-tabs-scrollable');
            return false;
        }
    }
    /**
     * 一般滚动之后都需要执行回调_enableScroller设置滚动条的状态，现包装成方法。
     */
    function _scrollCbFn (self) {
        return function(){
            _enableScroller(self);
        };
    }
    /**
     * 根据页签的位置，设置scroller的状态。
     * 当最右边的页签顶住组件右边沿，则右边的scroller应该禁用，表示不能再往右滚动了。
     * 当最左边的页签顶住组件左边沿，则左边的scroller应该禁用，表示不能再往左滚动了。
     */
    function _enableScroller (self) {
        var omtabs = $.data(self, 'omtabs').omtabs;
        var headers = omtabs.find('>div.om-tabs-headers');
        var ul = headers.children('ul');
        var lScroller = ul.prev();
        var rScroller = ul.next();
        var li = ul.children(':last');
        var lBorder = headers.offset().left,
            rBorder = rScroller.offset().left,
            ulLeft = ul.offset().left,
            ulRight = li.offset().left + li.outerWidth(true);
        if (ulLeft < lBorder) {
            lScroller.removeClass('om-tabs-scroll-disabled');
        } else {
            lScroller.addClass('om-tabs-scroll-disabled');
            //_scroll(self, lBorder - ulLeft);
        }
        if (ulRight > rBorder) {
            rScroller.removeClass('om-tabs-scroll-disabled');
        } else {
            rScroller.addClass('om-tabs-scroll-disabled');
            //_scroll(self, rBorder - ulRight);
        }
    }
    /**
     * 将页签头部往右边滑动distance的距离。当distance为负数时，表示往左边滑动；fn为回调函数
     */
    function _scroll(self, distance, fn) {
        var omtabs = $.data(self, 'omtabs').omtabs;
        var ul = omtabs.find('>div.om-tabs-headers ul');
        var li = ul.children(':last');
        if (distance == 0) {
            return;
        }
        var scrOffset = distance > 0 ? ul.prev().offset() : ul.next().offset();
        var queuedFn = function(next) {
            if (distance > 0 && ul.prev().hasClass('.om-tabs-scroll-disabled') ||
                    distance < 0 && ul.next().hasClass('.om-tabs-scroll-disabled')){
                ul.stop(true, true);
                $(self).clearQueue();
                return;
            }
            var flag = false;
            //fix distance.
            distance = (distance > 0) ? '+=' + Math.min(scrOffset.left - ul.offset().left, distance) : 
                '-=' + Math.min(li.offset().left + li.outerWidth(true) - scrOffset.left, Math.abs(distance));
            $.data(self, 'omtabs').isScrolling = true;
            ul.animate({
                left : distance + 'px'
            },'normal', 'swing', function() {
                !!fn && fn();
                $.data(self, 'omtabs').isScrolling = false;
                next();
            });
        };
        $(self).queue(queuedFn);
        if( $(self).queue().length == 1 && 
                !$.data(self, 'omtabs').isScrolling){
            $(self).dequeue(); //start queue
        }
    }
    /**
     * 获得当前所有页签的数目
     */
    function _getLength (self) {
        return $.data(self, 'omtabs').items.length;//items is the array of body dom
    }
    /**
     * 重新计算omTabs布局
     */
    function _doLayout(self) {
        _checkScroller(self) && _enableScroller(self);
    }
    /**
     * 设置第config.index个页签的数据源，如果设置了cofnig.url，则数据源为远程数据，如果设置了config.content数据源为普通文本。
     */
    function _setDataSource(self, config /*content, url, index*/) {
        var items = $.data(self, 'omtabs').items;//items is the array of body dom
        var ds, isAjax;
        config.url = $.trim(config.url);
        config.content = $.trim(config.content);
        if (config.url) {
            ds = config.url;
            isAjax = true;
        } else {
            ds = config.content;
            isAjax = false;
        }
        $(items[config.index]).omPanel('setDataSource', ds, isAjax);
    }
    /**
     * 重新加载第n个页签，如果该Panel有content，则重新刷新content，如果该Panel有url，则根据url取到最新的内容。
     */
    function _reload(self, n) {
        var items = $.data(self, 'omtabs').items;//items is the array of body dom
        $(items[n]).omPanel('reload');
    }
    
    var publicMethods = {
        disable : function() {
            
        },
        enable : function() {
            
        },
        /**
         * 在index处增加一个tab页签。参数为json格式的配置项。 调用该方法会触发 add事件。
         * 配置项参数：
         * <ol>
         * <li>index：新增页签的位置（从0开始计数,默认在末尾增加页签），可设置为'last'</li>
         * <li>title：新增页签的标题，默认值为 'New Title' + 全局唯一字符串</li>
         * <li>content：新增页签的内容，默认值为 'New Content' + 全局唯一字符串</li>
         * <li>url：新增页签的数据源为url。如果同时设置了content和url，则优先使用url</li>
         * <li>tabId：设置tabId，作为唯一标识，可以通过此标识唯一确定一个tab页签，tabId不能重复</li>
         * <li>closable：该新增的页签是否可关闭。</li>
         * </ol>
         * @name omTabs#add
         * @function
         * @param Object {index,title,content,url,colsable,tabId}
         * @example
         * //在第一个页签的位置新增一个页签,该页签的内容是远程数据
         * $('#make-tab').omTabs('add', {
         *     index : 0,
         *     title : 'New Tab1',
         *     content : 'New Content1',
         *     closable : false
         * });
         */
        // TODO: index param should support 'first'
        add : function(config /*title, content, url, closable , index,tabId*/) {
            this.each(function(){
                _add(this, config /*title, content, url, closable , index,tabId*/);
            });
        },
        
        /**
         * 关闭特定的页签，如果n指向当前页签，则会选中下一页签；如果当前页签是最末尾的页签，则会选中第一个页签。可以看到每关闭一个页签就会分别触发一次close事件和activate事件。
         * @name omTabs#close
         * @function
         * @param n 要关闭的页签的位置（从0开始计数），或者该页签的tabId(一个全局唯一的字符串)。 如果未指定该参数，则默认关闭当前页签。
         * @example
         * //关闭第一个页签
         * $('#make-tab').omTabs('close', 0);
         */
        close : function(n) {
            this.each(function(){
                _close(this, n);
            });
        },
        /**
         * 关闭所有页签，由于该操作只关注于删除所有页签，因此只会触发 onCloseAll事件，而不会逐个触发每个页签的onClose事件。
         * @name omTabs#closeAll
         * @function
         * @example
         * //关闭所有页签
         * $('#make-tab').omTabs('closeAll');
         */
        closeAll : function() {
            this.each(function(){
                _closeAll(this);
            });
        },
    
        /**
         * 选中特定的页签，触发activate事件。
         * @name omTabs#activate
         * @function
         * @param n 可为页签的索引（从0开始计数），或者页签的tabId
         * @example
         * //激活第一个页签
         * $('#make-tab').omTabs('activate', 0);
         */
        activate : function(n) {
            this.each(function(){
                _activate(this, n);
            });
        },
        /**
         * 页签索引和tabId的转换器。传入其中的一个值，获取另一个值。
         * @name omTabs#getAlter
         * @function
         * @param id 标识符
         * @returns 如果id为数字，则表示页签的索引，函数返回页签的tabId；如果id为字符串，则表示该页签的tabId，函数返回页签的索引。
         * @example
         * //获取第一个页签的tabId
         * var tabId = $('#make-tab').omTabs('getAlter', 0);
         */
        getAlter : function(id) {
            return _getAlter(this[0], id);
        },
        /**
         * 返回当前选中的页签的tabId。
         * @name omTabs#getActivated
         * @function
         * @returns 当前选中页签的tabId
         * @example
         * //获取当前选中页签的tabId
         * var activatedTabId = $('#make-tab').omTabs('getActivated');
         */
        getActivated : function() {
            return _getActivated(this[0]);
        },
        /**
         * 获得所有页签的数目。
         * @name omTabs#getLength
         * @function
         * @returns 页签的数目
         * @example
         * //获取页签的总数
         * var total = $('#make-tab').omTabs('getLength');
         */
        getLength : function() {
            return _getLength(this[0]);
        },
        /**
         * 设置第n个页签的数据源，可为普通文本或者url。注意该方法只是会重置一个当前页签是否已被加载的标记，而不负责实际加载数据，
         * 在非懒加载的情况下，需要手动加载数据。在懒加载的情况下，当页签被点击选中时会检查是否已经加载的标记，从而尝试重新加载内容
         * @name omTabs#setDataSource
         * @function
         * @param index 被操作页签的索引(从0开始计数)
         * @param content 设置了该属性则表示数据源为普通文本。
         * @param url 设置了该属性表示数据源是远程url，如果同时设置了content和url，则优先使用url。
         * @example
         * //设置第一个页签的数据源为远程数据
         *  $('#make-tab').omTabs('setDataSource', {
         *      index : 0,
         *      url : './ajax/content1.html'
         *  });
         */
        setDataSource : function(config /*content, url, index*/) {
            if (config.index === undefined || (  !config.url && !config.content )) {
                return;
            }
            this.each(function(){
                _setDataSource(this, config /*content, url, index*/);
            });
        },
        /**
         * 根据第n个页签当前的数据源，重新加载该页签。
         * @name omTabs#reload
         * @function
         * @param n 页签的索引
         * @example
         * //重新加载第一个页签的内容
         * $('#make-tab').omTabs('reload', 0);
         */
        reload : function(n) {
            this.each(function(){
                _reload(this, n);
            });
        },
        /**
         * 对组件重新布局，主要操作是刷新页签滚动箭头。
         * 如果有必要使用页签滚动箭头，则刷新滚动箭头的状态。如果没必要使用页签滚动箭头，则将存在的删除。
         * @name omTabs#doLayout
         * @function
         * @example
         * //对组件重新布局，如果有必要使用页签滚动箭头，则刷新滚动箭头的状态。
         */
        doLayout : function() {
            this.each(function(){
                _doLayout(this);
            });
        }
    };
    var defaultConfig = /** @lends omTabs#*/{
        /**
         * 页签布局的宽度，可取值为'auto'(默认情况，不做处理)，可以取值为'fit'，表示适应父容器的大小(width:100%)，也可以直接设置width大小（单位：像素）。
         * @default 'auto'
         * @type Number,String
         * @example
         * $('#make-tab').omTabs({width: 500});
         */
        width : 'auto',
        /**
         * 页签布局的高度，可取值为'auto'(默认情况，不做处理)，可以取值为'fit'，表示适应父容器的大小(height:100%)，也可以直接设置height大小（单位：像素）。
         * @default 'auto'
         * @type Number,String
         * @example
         * $('#make-tab').omTabs({height: 200});
         */
        height : 'auto',
        /**
         * 是否显示页签正文区的边框。
         * @default true
         * @type Boolean
         * @example
         * $('#make-tab').omTabs({border: false});//不显示页签正文区的边框
         */
        border : true,
        /**
         * 单个页签头部的宽度，可取值为'auto'。默认为80像素。
         * @default 80
         * @type Number,String
         * @example
         * $('#make-tab').omTabs({tabWidth: 'auto'});
         */
        tabWidth : 80,
        /**
         * 单个页签头部的高度，可取值为'auto'。默认为25像素。
         * @default 25
         * @type Number,String
         * @example
         * $('#make-tab').omTabs({tabHeight: 'auto'});
         */
        tabHeight : 25,
        // TODO: 暂时不启用
        /*
         * 是否禁用组件。 
         * @name omTabs#disabled
         * @default false
         * @type Boolean
         * @example
         * $('#make-tab').omTabs({disabled : true});//初始化时禁用组件
         */
        disabled : false,
        /**
         * 当页签超过组件宽度时是否出现左右滚动箭头
         * @default true
         * @type Boolean
         * @example
         * //当页签数目较多时不显示滚动箭头，将访问不到未显示的页签
         * $('#make-tab').omTabs({scrollable: false});
         */
        scrollable : true,
        /**
         * 页签是否可关闭，当本属性为true时，所有页签都可以关闭。当属性值为数组时，只有数组中指定的index的页签可以关闭，index从0开始。
         * @default false
         * @type Boolean,Array
         * @example
         * //页签可关闭
         * $('#make-tab').omTabs({closable : true});
         * 
         * //只有第一个和第三个页签可以关闭
         * $('#make-tab').omTabs({closable : [0,2]);
         */
        closable : false,
        
        //  暂时不公布
        //  页签头部的位置，可为top和left //TODO 'left'
        // @default 'top'
        // @type String
        // @example
        // $('#make-tab').omTabs({position : 'left'});//页签头部在组件的左边
        //
        position : 'top',
        /**
         * 页签切换的模式。可为click(鼠标点击切换)，mouseover(鼠标滑过切换)。<b>注意：当设置了autoPlay属性时，虽然组件在自动切换，此时仍可以使用鼠标点击（鼠标划过）切换页签</b>
         * @default 'click'
         * @type String
         * @example
         * $('#make-tab').omTabs({switchMode : 'mouseover'});//鼠标划过切换页签
         */
        switchMode : 'click',
        /**
         * 是否自动循环切换页签
         * @default false
         * @type Boolean
         * @example
         * $('#make-tab').omTabs({autoPlay:true});//自动切换页签
         */
        autoPlay : false,
        /**
         * 自动切换页签的时间间隔，单位为毫秒。 该属性在 switchMode 为auto时才生效。
         * @default 1000
         * @type Number
         * @example
         * $('#make-tab').omTabs({autoPlay:true, interval : 2000});//自动切换页签时，时间间隔为2s
         */
        interval : 1000,
        /**
         * 初始化时被激活页签的索引（从0开始计数）或者tabId。
         * @default 0
         * @type Number,String
         * @example
         * $('#make-tab').omTabs({active : 1});//初始化时激活第二个页签
         * $('#make-tab').omTabs({active : 'tab-1'});//初始化时激活Id为'tab-1'的页签
         */
        active : 0,
        /**
         * 是否懒加载，当该属性为true时，只有在页签被单击选中时才尝试加载页签正文区。
         * @default false
         * @type Boolean
         * @example
         * $('#make-tab').omTabs({lazyLoad : true});
         */
        lazyLoad : false,
        /**
         * 当页签被选中之前执行的方法。
         * @event
         * @param n 选中页签的索引，从0开始计数.
         * @default emptyFn 
         * @example
         *  $('#make-tab').omTabs({
         *      onBeforeActivate : function(n) {
         *          alert('tab ' + n + ' will be activated!');
         *      }
         *  });
         */
        onBeforeActivate : function(n) {
        },
        /**
         * 当页签被选中后执行的方法。
         * @event
         * @param n 选中页签的索引，从0开始计数.
         * @default emptyFn 
         * @example
         *  $('#make-tab').omTabs({
         *      onActivate : function(n) {
         *          alert('tab ' + n + ' has been activated!');
         *      }
         *  });
         */
        onActivate : function(n) {
        },
        /**
         * 当页签被关闭之前执行的方法。
         * @event
         * @param n 被关闭页签的索引，从0开始计数。
         * @default emptyFn 
         * @example
         *  $('#make-tab').omTabs({
         *      onBeforeClose : function(n) {
         *          alert('tab ' + n + ' will be closed!');
         *      }
         *  });
         */
        onBeforeClose : function(n) {
        },
        /**
         * 当页签被关闭之后执行的方法。
         * @event
         * @param n 被关闭页签的索引，从0开始计数。
         * @default emptyFn 
         * @example
         *  $('#make-tab').omTabs({
         *      onClose : function(n) {
         *          alert('tab ' + n + ' has been closed!');
         *      }
         *  });
         */
        onClose : function(n) {
        },
        /**
         * 当关闭所有页签之前执行的方法。
         * @event
         * @default emptyFn 
         * @example
         *  $('#make-tab').omTabs({
         *      onBeforeCloseAll : function() {
         *          alert('all tabs will be closed !');
         *      }
         *  });
         */
        onBeforeCloseAll : function() {
        },
        /**
         * 当关闭所有页签之后执行的方法。
         * @event
         * @default emptyFn 
         * @example
         *  $('#make-tab').omTabs({
         *      onCloseAll : function() {
         *          alert('tabs are all closed now !');
         *      }
         *  });
         */
        onCloseAll : function() {
        },
        /**
         * 当新页签被添加之后执行的方法。
         * @event
         * @default emptyFn 
         * @param config 经过处理的配置项。在调用add新增页签时，传入的配置项参数可能不完整(使用默认值)，此处的config就是完整的配置项
         * @example
         *  $('#make-tab').omTabs({
         *      onAdd : function(config) {
         *          console.dir(config);
         *          alert('you have added a tab at position:' + config.index );
         *      }
         *  });
         */
        onAdd : function(config/*title, content, url, closable , index*/) {
        },
        /**
         * 当新页签被添加之前执行的方法。
         * @event
         * @default emptyFn 
         * @param config 经过处理的配置项。在调用add新增页签时，传入的配置项参数可能不完整(使用默认值)，此处的config就是完整的配置项
         * @example
         *  $('#make-tab').omTabs({
         *      onBeforeAdd : function(config) {
         *          console.dir(config);
         *          alert('you will add a tab at position:' + index );
         *      }
         *  });
         */
        onBeforeAdd : function(config/*title, content, url, closable , index*/) {
        },
        /**
         * 当页签使用ajax方式加载内容，加载完成后执行的方法。
         * @event
         * @default emptyFn
         * @param tabId 刚加载完成的页签的tabId
         * @example
         *  $('#make-tab').omTabs({
         *      onLoadComplete : function(tabId) {
         *          alert(tabId + 'has just been loaded!' );
         *      }
         *  });
         */
        onLoadComplete : function(tabId) {
        }
        
    };
    /**
     * @name omTabs
     * @class 页签布局组件，通过简单的配置展示多页签信息，同时组件提供丰富的事件支持，比如选中页签，关闭页签，添加页签等等。<br/>
     * 支持各个页签以ajax方式加载内容；支持懒加载；支持页签滚动<br/>
     * <b>使用方式：</b><br/><br/>
     * 页面上的html标记如下
     * <pre>
     * &lt;script type="text/javascript" >
     * $(document).ready(function() {
     *     $('#make-tab').omTabs({});
     * });
     * &lt;/script>
     * 
     *      &lt;div id="make-tab"&gt;
     *          &lt;ul&gt;
     *              &lt;li&gt;
     *                  &lt;a href="#tab1"&gt;Title1&lt;/a&gt;
     *              &lt;/li&gt;
     *              &lt;li&gt;
     *                  &lt;a href="#tab2"&gt;Title2&lt;/a&gt;
     *              &lt;/li&gt;
     *              &lt;li&gt;
     *                  &lt;a href="#tab3"&gt;Title3&lt;/a&gt;
     *              &lt;/li&gt;
     *          &lt;/ul&gt;
     *          &lt;div id="tab1"&gt;
     *              this is tab1 content
     *          &lt;/div&gt;
     *          &lt;div id="tab2"&gt;
     *              this is tab2 content
     *          &lt;/div&gt;
     *          &lt;div id="tab3"&gt;
     *              this is tab3 content
     *          &lt;/div&gt;
     *      &lt;/div&gt;
     * </pre>
     * @constructor
     * @description 构造函数
     * @param p 标准config对象：{width:500, height:300}
     * @example
     * $('#make-tab').omTabs({width:500, height:300});
     */
    $.fn.omTabs = function(p) {
        if (p && typeof(p) == 'string') {
            if (publicMethods[p]) {
                return publicMethods[p].apply(this, Array.prototype.slice.call(arguments, 1));
            }
            return null;
        }
        return this.each(function() {
            var tData = $.data(this, 'omtabs');
            var options;
            if (tData) {
                $.extend(tData.options, p);
            } else {
                options = $.extend({}, defaultConfig, p);
                tData = $.data(this, 'omtabs', {
                    options : options
                });
                $.data(this, 'omtabs').omtabs = makeSketch(this);
                $.data(this, 'omtabs').items = collectItems(this);
            }
            render(this);
            afterRender(this);
            buildEvent(this);
        });
    };
})(jQuery);/*
 * $Id: om-tree.js,v 1.86 2012/01/16 01:48:41 linxiaomin Exp $
 * operamasks-ui omTree 1.0
 *
 * Copyright 2011, AUTHORS.txt (http://ui.operamasks.org/about)
 * Dual licensed under the MIT or GPL Version 2 licenses.
 * http://ui.operamasks.org/license
 *
 * http://ui.operamasks.org/docs/
 *
 * Depends:
 *  jquery.ui.core.js
 *  jquery.ui.widget.js
 */
/**
     * @name omTree
     * @class 树型组件<br/><br/>
     * treenode json格式为：<br/>
     * <pre>
     * {
     *     id:'n1',      // 树节点唯一标识，非必需
     *     text:'node1', // 树节点显示文本，必需
     *     expanded:true, // 是否默认展开，非必须，默认值是false
     *     classes:'folder', // 树节点样式，非必需，默认有folder和file，如果用户自定制为其他，则显示用户自定义样式
     *     children:childrenDataArray, //子节点，非必需。缓加载时可以没有这个属性 
     *     hasChildren: false // 是否有子节点，非必需，如果值为true表示要缓加载此时可以没有children属性
     * } 
     * </pre>
     * omTree为每个节点自动生成的唯一标识nid，生成规则为treeId+ "_" + 计数，请用户在omTree的页面上避免
     * 使用此种规则定义其他对象的nid。不需要用户进行初始化，属于内部参数。
     * <br/>
     * <b>特点：</b><br/>
     * <ol>
     *      <li>可以使用本地数据源，也可以使用远程数据源</li>
     *      <li>支持数据的缓加载（开始取数时不取子节点数据，第一次展开时才开始向后台取数）</li>
     *      <li>提供丰富的事件</li>
     * </ol>
     * 
     * <b>示例：</b><br/>
     * <pre>
     * &lt;script type="text/javascript" >
     * var data = 
     *       [{
     *           "text": "1. Review of existing structures",
     *           "children":[{
     *               "text": "1.1 jQuery core"
     *           }]
     *       }, {
     *           "text": "2. Wrapper plugins",
     *           "expanded": true,
     *           "children":[{
     *               "text":"2.1 wrapper tips",
     *               "expanded": true,
     *               "children": [{
     *                   "text":"2.1.1 wrapper loader tips"
     *               },{
     *                   "text":"2.1.2 wrapper runder tips"
     *               }]
     *           },{
     *               "text":"2.2 tree nodes"
     *           }]
     *       }, {
     *           "text": "3. Summary"
     *       }, {
     *           "text": "4. Questions and answers"
     *       }];
     *   $(document).ready(function(){
     *       $("#mytree").omTree({
     *           dataSource : data
     *       });
     *   });
     * &lt;/script>
     * 
     * &lt;ul id="mytree"/>
     * </pre>
     * 
     * @constructor
     * @description 构造函数. 
     * @param options 标准options对象：{}
     */
;(function($) {
    /**
     * treenode: { text:'node1', expanded:true}
     */
    $.treeview = {};
    var CLASSES = ($.treeview.classes = {
            open: "open",
            closed: "closed",
            expandable: "expandable",
            expandableHitarea: "expandable-hitarea",
            lastExpandableHitarea: "lastExpandable-hitarea",
            collapsable: "collapsable",
            collapsableHitarea: "collapsable-hitarea",
            lastCollapsableHitarea: "lastCollapsable-hitarea",
            lastCollapsable: "lastCollapsable",
            lastExpandable: "lastExpandable",
            last: "last",
            hitarea: "hitarea"
        });
    
    $.widget("om.omTree", {
        _swapClass: function(target, c1, c2) {
            var c1Elements = target.filter('.' + c1);
            target.filter('.' + c2).removeClass(c2).addClass(c1);
            c1Elements.removeClass(c1).addClass(c2);
        },
        
        /**
         * target: treenode LI DOM 
         */
        _getParentNode :function (target){
            if(target){
                var pnode = $(target).parent().parent();
                if(pnode && pnode.hasClass("om-tree-node")) {
                    return pnode;
                }
            }
            return null;
        },
        
        _setParentCheckbox: function (node){
            var pnode = this._getParentNode(node);
            if (pnode){
                var checkbox = pnode.find(">ul >li >div.tree-checkbox");
                var allChild = checkbox.length;
                var full_len = checkbox.filter(".checkbox_full").length;
                var part_len = checkbox.filter(".checkbox_part").length;
                var pnode_checkbox = pnode.find(">div.tree-checkbox"); 
                pnode_checkbox.removeClass("checkbox_full checkbox_part");
                if(full_len == allChild) {
                    pnode_checkbox.addClass("checkbox_full");
                } else if(full_len > 0 || part_len > 0) {
                    pnode_checkbox.addClass("checkbox_part");
                }
                this._setParentCheckbox(pnode);
            }
        },
        
        _setChildCheckbox : function (node, checked){
            var childck = node.find(">ul").find('.tree-checkbox');
            childck.removeClass("checkbox_part checkbox_full");
            if(checked) {
                childck.addClass("checkbox_full");
            }
        },
        
        // target equal the li elements
        _applyEvents: function(target) {
            var self = this,
                options = self.options,
                onClick = options.onClick,
                onDblClick = options.onDblClick,
                onRightClick = options.onRightClick,
                onDrag =options.onDrag,
                onSelect = options.onSelect,
                onDrop = options.onDrop;
            target.find("span a").bind("click",function(e){
            	var node = self.element.data("nodes")[$(this).parent().parent().attr("id")];
           	    onClick && onClick.call(self, node, e);
                self.select(node);
                return false;
            }).bind("dblclick", function(e){
            	var nDom = $(this).parent().parent();
                var node = self.element.data("nodes")[nDom.attr("id")];
                if ( nDom.has("ul").length >0 && $(e.target, this) )
                    self.toggler(nDom);
                onDblClick && onDblClick.call(self, node, e);
            }).bind("contextmenu", function(e){
                     var node = self.element.data("nodes")[$(this).parent().parent().attr("id")];
                     onRightClick && onRightClick.call(self, node, e);
            }).bind("mouseover mouseout", function(e){
                      if(e.type == "mouseover"){
                          $(this).addClass("hover");
                      }
                      else if(e.type == "mouseout"){
                          $(this).removeClass("hover");
                      }
                      return false;
            });
            self._bindHitEvent(target);
			
			 target.find("div.tree-checkbox").click(function(e){
                var node = $(this).parent();
                var nodedata = self.findByNId(node.attr("id"));
                self._toggleCheck(node, self.isCheck(nodedata));
            });
            if (self.options.draggable) {
                target.omDraggable({
                    revert: "invalid",
                    onDrag: function(e) {
                        onDrag && onDrag(node, e);
                    }
                });
                target
                .find(">span")
                .omDroppable({
                    accept : "li.om-tree-node",
                    hoverClass : "treenode-droppable",
                    onDrop : function(event, source) {
                        var pnode,bnode,$item = source;
                        var $drop = $(event.target).parent();
                        var $list = $drop.find(">ul");
                        $item.css("left", "");
                        $item.css("top", "");
                        var dragnode = self.findByNId($item.attr("id"));
                        if($drop.has("ul").length > 0){
                           pnode = self.findByNId($drop.attr("id"));
                        }else{
                           bnode = self.findByNId($drop.attr("id")); 
                        }
                        self.remove(dragnode);
                        self.insert(dragnode, pnode, bnode, true);
                        var node = self.findByNId($item.parent().find("li").attr("id"));
                        onDrop && onDrop(node, event);
                    }
                });
            }
            target.bind("mousedown", function(e){
                e.stopPropagation();                
            });
        },
        _bindHitEvent: function(target){
        	var self=this;
        	target.find("div.hitarea").click(function() {
                var node = $(this).parent();
                self.toggler(node);
            });
        },
        options: /** @lends omTree#*/{
            /* 暂不支持
             * 树初始状态时展开的层级.
             * @type Number
             * @default 0
             * @example
             * $("#mytree").omTree({initExpandLevel:2});
             */
            initExpandLevel: 0,
            /**
             * 数据源属性，可以设置为后台获取数据的URL，比如dataSource : 'treedata.json'
             * 也可以设置为静态数据，数据必须为JSON格式数组，比如dataSource : [{"text":"iPhone"},{"text":"iPad"}]；
             * 其中JSON格式为
             * <pre>
             * {
             *     text: 'node1', // 树节点显示文本，必需
             *     expanded: true, // 是否默认展开
             *     classes: 'folder', // 树节点样式，非必需，默认有folder和file，用户可自定制此样式
             *     hasChildren: false // 树节点懒加载的情况下，该节点在展开时自动向后台取数
             * }
             * </pre>
             * @name omTree#dataSource
             * @type String,Array[JSON]
             * @default 无
             * @example
             * dataSource : 'treedata.json'
             * 或者
             * dataSource : [{"text":"iPhone"},{"text":"iPad"}]
             */
            /* 暂不支持
             * 鼠标划过某个节点时是否高亮。
             * @type Boolean
             * @default false
             * @example
             * $("#mytree").omTree({lineHover:false});
             */
            lineHover: false,
            /**
             * 树节点是否显示图标。
             * @type Boolean
             * @default true
             * @example
             * $("#mytree").omTree({showIcon:false});
             */
            showIcon: true,
            /* 暂不支持
             * 树节点之间是否显示连线。
             * @type Boolean
             * @default true
             * @example
             * $("#mytree").omTree({showLine:true});
             */
            showLine: true,
            /**
             * 是否显示checkbox。
             * @type Boolean
             * @default false
             * @example
             * $("#mytree").omTree({showCheckbox:false});
             */
            showCheckbox: false,
            /**
             * 是否级联选中，该属性在showCheckbox为true的时候生效。
             * @type Boolean
             * @default true
             * @example
             * $("#mytree").omTree({cascadeCheck:true});
             */
            cascadeCheck: true,
            /**
             * 树节点是否可拖拽。
             * @type Boolean
             * @default false
             * @example
             * $("#mytree").omTree({draggable:true});
             */
            draggable: false,
            /*
             * 暂不支持，通过方法过滤树节点，该方法会被每个树节点调用，当返回为false，该节点会被过滤掉。
             * @type function
             * @default null
             * @example
             * 将叶子节点过滤掉
             * fucntion fn(node){
             *   if(node.children){
             *      return true;
             *   }
             *   retrun false;
             * } 
             * $("#mytree").omTree({filter:fn});
             */
            filter: null,
            // before refresh the node ,you can change the node
            // nodeFomatter:null,
            nodeCount:0
        },
        _create: function() {
            var self = this, options = self.options;
            if ( options.toggle ) {
                var callback = options.toggle;
                options.toggle = function() {
                    return callback.apply($(this).parent()[0], arguments);
                };
            }
            var elem = self.element;
            
            elem.data("nodes", []);
            elem.data("selected", "");
            
            // add treeview class to activate styles
            elem.addClass("treeview");
            
        },
       
        updateNode: function(target) {
            var self = this, options = self.options;
            // prepare branches and find all tree items with child lists
            var branches = target.find("li");
            //.prepareBranches(options);
            
            //self._applyClasses(branches);
            self._applyEvents(branches);
            
            if(options.control) {
                self._treeController(self, options.control);
            }
        },
        
        
        
        // handle toggle event
        // change the target to the treenode (li dom)
        toggler: function(target) {
            var self = this,
                options = self.options;
            var nid = target.attr("id");
            var node = self.findByNId(nid);
            var hidden = target.hasClass(CLASSES.expandable);
            
            if ( hidden ) {
                var onBeforeExpand = options.onBeforeExpand;
                if(onBeforeExpand && false === onBeforeExpand(node)){
                    return self;
                }
            } else {
                var onBeforeCollapse = options.onBeforeCollapse;
                if(onBeforeCollapse && false === onBeforeCollapse(node)){
                    return self;
                }
            }
            
            // swap classes for hitarea
            var hitarea = target.find( target.find(">.hitarea") );
            self._swapClass(hitarea, CLASSES.collapsableHitarea, CLASSES.expandableHitarea);
            self._swapClass(hitarea, CLASSES.lastCollapsableHitarea, CLASSES.lastExpandableHitarea);
            
            // swap classes for li
            self._swapClass(target, CLASSES.collapsable, CLASSES.expandable);
            self._swapClass(target, CLASSES.lastCollapsable, CLASSES.lastExpandable);
            
            // find child lists
            target.find( ">ul" )
                .each(function(){
                    if ( hidden ) {
                        $(this).show();
                        var onExpand = options.onExpand;
                        onExpand && onExpand.call(this, node);
                    } else {
                        $(this).hide();
                        var onCollapse = options.onCollapse;
                        onCollapse && onCollapse.call(this, node);
                    }
                });
        },
        
        _init: function() {
            var self = this, options = self.options,
                target = self.element,
                source = options.dataSource;
            target.data("init_dataSource", source);
            if(source) {
                if(typeof source == 'string'){
                    self._ajaxLoad(target, source);
                }else if(typeof source == 'object'){
                    self._appendNodes.apply(self, [target, source]);
                    self.updateNode(target);
                }
            }
        },
        
        _ajaxLoad:function(target, url){
            var self = this,
                options = this.options,
                onBeforeLoad = options.onBeforeLoad,
                onSuccess = options.onSuccess,
                onError = options.onError;
            onBeforeLoad && onBeforeLoad(self.findByNId(target.parent().attr("id")));
            $.ajax({
                url: url,
                method: 'POST',
                dataType: 'json',
                success: function(data){
                    self._appendNodes.apply(self, [target, data]);
                    self.setData(data);
                    self.updateNode(target);
                    onSuccess && onSuccess.call(self, data);
                },
                error: function(XMLHttpRequest, textStatus, errorThrown){
                    onError && onError.call(self, XMLHttpRequest, textStatus, errorThrown);
                }
            });
        },
        /* -------------------- check and select node ------------------- */
        /**
         * 将指定节点前的勾选框设置为被勾选状态，该方法只有在属性showCheckbox为true时才生效。
         * @name omTree#check
         * @function
         * @param target 指定节点的JSON数据对象，并且该节点数据中包括了nid属性
         * @example
         * //将target节点的勾选状态设置为被勾选状态
         * var target = $('#myTree').omTree("findNode", "text", "node1");
         * $('#myTree').omTree('check',target);
         */  
        check: function(target) {
            this._toggleCheck($("#" + target.nid), false);
        },
        /**
         * 将指定节点前的勾选框设置为未被勾选状态，该方法只有在属性showCheckbox为true时才生效。
         * @name omTree#uncheck
         * @function
         * @param target 指定节点的JSON数据对象，并且该节点数据中包括了nid属性
         * @example
         * //将target节点的勾选状态设置为不被勾选状态
         * var target = $('#myTree').omTree("findNode", "text", "node1");
         * $('#myTree').omTree('uncheck',target);
         */  
        uncheck: function(target) {
            this._toggleCheck($("#" + target.nid), true);
        },
        
        // target equal le elem
        _toggleCheck: function(target, checked) {
            var checkbox_item = target.find(">div.tree-checkbox"), self = this,
            options = self.options,
            onCheck = options.onCheck;
            if(checked) {
                checkbox_item
                    .removeClass("checkbox_part checkbox_full");
            } else {
                checkbox_item
                    .removeClass("checkbox_part")
                    .addClass("checkbox_full");
            }
            if(self.options.cascadeCheck) {
                self._setChildCheckbox(target, !checked);
                self._setParentCheckbox(target);
            }
            onCheck && onCheck(self.findByNId(target.attr("id")));
        },
        /**
         * 将所有节点的勾选框设置为被勾选状态，该方法只有在属性showCheckbox为true时才生效。
         * @name omTree#checkAll
         * @function
         * @param checked 指定勾选框的勾选状态，checked为true为被勾选状态，为false为未被勾选状态
         * @example
         * //将所有节点的勾选框都设置为被勾选状态
         * $('#myTree').omTree('checkAll',true);
         */  
        checkAll: function(checked) {
            if(checked) {
                this.element
                    .find(".tree-checkbox")
                    .removeClass("checkbox_part")
                    .addClass("checkbox_full");
            } else {
                this.element
                    .find(".tree-checkbox")
                    .removeClass("checkbox_part checkbox_full");
            }
        },
        /**
         * 判断指定节点的勾选状态，该方法只有在属性showCheckbox为true时才生效。
         * @name omTree#isCheck
         * @function
         * @param target 指定节点的JSON数据对象，并且该节点数据中包括了nid属性
         * @returns true or false
         * @example
         * //判断target节点的勾选状态
         * var target = $('#myTree').omTree("findNode", "text", "node1");
         * $('#myTree').omTree('isCheck',target);
         */  
        isCheck: function(target) {
            return $("#"+target.nid)
                       .find(">div.tree-checkbox")
                       .hasClass("checkbox_full");
        },
        /**
         * 获取所有被勾选或未被勾选节点的JSON数据对象集合。
         * @name omTree#getChecked
         * @function
         * @param checked 指定勾选框的勾选状态，checked为true为被勾选状态，为false为未被勾选状态，默认为false
         * @returns JSON数据对象集合
         * @example
         * //获取所有被勾选节点的JSON数据对象集合
         * $('#myTree').omTree('getChecked',true);
         */      
        getChecked: function(checked) {
            var self = this,
                nodes = [];
            var filter_config = checked?".checkbox_full":":not(.checkbox_full)";
            this.element
                .find(".tree-checkbox")
                .filter(filter_config).each(function(i,name){
                    nodes.push(self.element.data("nodes")[$(this).parent().attr("id")]);
                });
            return nodes;
        },
        /**
         * 将指定节点设置为选中状态。
         * @name omTree#select
         * @function
         * @param target 指定节点的JSON数据，并且该节点数据中包括了nid属性。
         * @example
         * //将target节点设置为选中状态
         * var target = $('#myTree').omTree("findNode", "text", "node1");
         * $('#myTree').omTree('select',target);
         */  
        select: function(target) {
            var self = this,
                options = this.options,
                onBeforeSelect = options.onBeforeSelect,
                onSelect = options.onSelect;
            if(onBeforeSelect && false === onBeforeSelect(target)) {
                return self;
            }
            var node = $("#" + target.nid);
            var a = $(" >span >a", node);
            a.addClass("selected");
            var oldSelected = self.element.data("selected");
            var curSelected = node.attr("id");
            if(oldSelected != "" && !(oldSelected == curSelected)) {
                $("#" + oldSelected + " >span >a").removeClass("selected");
            }
            self.element.data("selected", curSelected);
            onSelect && onSelect.call(self, target);
        },
        /**
         * 将指定节点设置为未选中状态。
         * @name omTree#unselect
         * @function
         * @param target 指定节点的JSON数据，并且该节点数据中包括了nid属性
         * @example
         * //将target节点设置为未选中状态
         * var target = $('#myTree').omTree("findNode", "text", "node1");
         * $('#myTree').omTree('unselect',target);
         */
        unselect: function(target) {
            var self = this;
            var node = $("#" + target.nid);
            var a = $(" >span >a", node);
            a.removeClass("selected");
            var oldSelected = self.element.data("selected");
            var curSelected = node.attr("id");
            if( oldSelected == curSelected) {
                self.element.data("selected", "");
            }
        },
        /**
         * 获取被选中的节点的JSON数据对象。
         * @name omTree#getSelected
         * @function
         * @returns JSON数据对象
         * @example
         * //获取被选中节点的JSON数据对象
         * $('#myTree').omTree('getSelected');
         */
        getSelected: function() {
            var selected = this.element.data("selected");
            return selected ? this.element.data("nodes")[selected] : null;
        },
        
        /* -------------------- find node ------------------- */
        /**
         * 根据节点数据的属性精确查找节点 pNode 下面的子节点中的 JSON 数据对象集合。
         * @name omTree#findNodes
         * @function
         * @param key 进行查找的节点数据的属性名称
         * @param value 属性值
         * @param pNode 可选，指定的父节点，默认为查找所有节点
         * @param deep 可选，是否递归查找子节点，默认为递归查找子节点
         * @returns JSON数据对象集合
         * @example
         * //查找所有树节点中属性“classes”等于“folder”的节点
         * $('#myTree').omTree('findNodes', "classes", 'folder', "",true);
         */
        findNodes: function(key, value, pNode, deep) {
            var result = [], len;
            var data = pNode ? pNode.children :this.getData();
            deep = (deep!=false)? true : deep;
            if(data && (len = data.length) > 0) {
                for(var i = 0; i < len; i++){
                  result = this._searchNode.apply(data[i], [key, value, this._searchNode, result, false, deep]);
                }
           }
            return result.length > 0 ? result : null;
        },
        /**
         * 根据节点数据的属性精确查找节点 pNode 的子节点中满足条件的 JSON 数据对象。
         * 查找到第一个满足条件的节点则停止查找，返回该节点。
         * @name omTree#findNode
         * @function
         * @param key 进行查找的节点数据的属性名称
         * @param value 属性值
         * @param pNode 可选，指定的父节点，默认为查找所有节点
         * @param deep 可选，是否递归查找子节点，默认为递归查询子节点
         * @returns JSON数据对象
         * @example
         * //查找所有树节点中第一个满足属性“classes”等于“folder”的节点
         * $('#myTree').omTree('findNode', "classes", 'folder', "",true);
         */
        findNode: function(key, value, pNode, deep){
            var res, len, data = pNode ? pNode.children : this.getData();
            deep = (deep!=false)? true : deep;
            if(data && (len = data.length)> 0) {
                for(var i = 0; i < len; i++){
                  res = this._searchNode.apply(data[i], [key, value, this._searchNode, [], true, deep]);
                  if(res != null){
                      return res;
                  }
               }
           }
            return null;
        },
        /**
         * 根据id精确查找节点。查找到第一个满足条件的节点则停止查找，返回该节点。
         * @name omTree#findByNId
         * @function
         * @param nid 节点的唯一标识,该值是自动生成的，生成规则为treeId+ "_" + 计数
         * @returns JSON数据对象
         * @example
         * //查找“nid”等于“treeId_4”的节点
         * $('#myTree').omTree('findByNId','treeId_4');
         */
        findByNId : function(nid) {
            return this.element.data("nodes")[nid];
        },
        /**
         * 根据指定函数fn精确查找指定pNode的子节点中满足条件的JSON数据对象集合，函数fn中可以定义复杂的查询逻辑。
         * @name omTree#findNodesBy
         * @function
         * @param fn 指定的查找函数，参数为节点的JSON数据对象，函数返回为true则改节点满足查找条件，反之false则不满足条件
         * @param pNode 可选，指定的父节点，默认为查找所有节点
         * @param deep 可选，是否递归查找子节点，默认为递归查找子节点
         * @returns JSON数据对象集合
         * @example
         * //根据函数fn查找符合条件的所有节点的JSON数据对象集合
         * $('#myTree').omTree('findNodesBy',fn);
         */
        findNodesBy: function(fn, pNode, deep){
            var res, data = pNode ? pNode.children : this.getData();
            deep = (deep!=false)? true : deep;
            var result = [];
            if(data && (len = data.length)> 0) {
             for(var i = 0; i < len; i++){
                if(fn.call(data[i], data[i]) === true){
                    result.push(data[i]);
                }
                if(deep && data[i].children){
                    res = this.findNodesBy(fn, data[i], deep);
                    if(res){
                        result = result.concat(res);
                    }
                }
              }
            }
            return result.length > 0 ? result : null;
        },
        /**
         * 根据指定函数fn精确查找指定pNode的子节点中满足条件的第一个节点的JSON数据对象，函数fn中可以定义复杂的查询逻辑。
         * 查找到第一个满足条件的节点则停止查找，返回该节点的JSON数据对象。
         * @name omTree#findNodeBy
         * @function
         * @param fn 指定的查找函数，拥有一个参数为节点的JSON数据对象，函数返回为true则该节点满足查找条件，反之false则不满足条件
         * @param pNode 可选，指定的父节点，默认为查找所有节点
         * @param deep 可选，是否递归查找子节点，默认为不递归查找子节点
         * @returns JSON数据对象
         * @example
         * //根据函数fn查找符合条件的第一个子节点的JSON数据对象
         * $('#myTree').omTree('findNodeBy',fn);
         */       
        findNodeBy: function(fn, pNode, deep){
            var res, data = pNode ? pNode.children : this.getData();
            deep = (deep!=false)? true : deep;
            if(data && (len = data.length)> 0) {
              for(var i = 0, len = data.length; i < len; i++){
                if(fn.call(data[i], data[i]) === true){
                    return data[i];
                }
                if(deep){
                    res = this.findNodeBy(fn, data[i], deep);
                    if(res != null){
                        return res;
                    }
                }
              }
            }
            return null;
         },
         
        _searchNode: function(key, value, _searchNode, result, isSingle, deep) {
            if(isSingle){
                if(this[key] == value)
                return this;
                if(this.children && this.children.length && deep) {
                    for(var i in this.children){
                        var temp=_searchNode.apply(this.children[i],[key,value,_searchNode,[],true]);
                        if(temp) return temp;
                    }
                }
            }else{
                if(this[key] == value){      
                    result.push(this);
                }
                if(this.children && this.children.length && deep) {
                    $.each(this.children, _searchNode, [key, value, _searchNode, result, false, deep]);
                }
                return result;
            }
        },
        /**
         * 获取指定节点的父节点。
         * @name omTree#getParent
         * @function
         * @param target 指定节点的JSON数据对象，并且该节点数据中包括了nid属性
         * @returns JSON数据对象
         * @example
         * //查找target的父节点的JSON数据对象
         * var target = $('#myTree').omTree("findNode", "text", "node1");
         * $('#myTree').omTree('getParent',target);
         */  
        getParent: function(target) {
            var pid = this.element.data("nodes")["pid" + target.nid];
            return pid?this.findByNId(pid):null;
        },
        /**
         * 获取指定节点的所有子节点的JSON数据对象集合。
         * @name omTree#getChildren
         * @function
         * @param target 指定节点的JSON数据对象，并且该节点数据中包括了nid属性
         * @returns JSON数据对象集合
         * @example
         * //查找target的父节点的JSON数据对象
         * var target = $('#myTree').omTree("findNode", "text", "node1");
         * $('#myTree').omTree('getChildren',target);
         */      
        getChildren: function(target) {
            return target.children;
        },
        /**
         * 获取树的dataSource对应的静态数据。
         * @name omTree#getData
         * @function
         * @returns JSON数据对象集合
         * @example
         * //获取dataSource对应的静态数据
         * $('#myTree').omTree('getData');
         */
        getData: function() {
            return this.options.dataSource;
        },
        /**
         * 设置树的dataSource所对应的静态数据。
         * @name omTree#setData
         * @function
         * @example
         * //设置dataSource对应的静态数据
         * var data=[{text:'node2',children:[{text:'node21'},{text:'node22'}]},
         *             {text:'node3'}
         *      ];
         * $('#myTree').omTree('setData',data);
         * 
         * //设置dataSource对应的动态数据
         * $('#myTree').omTree('setData','../../omTree.json');
         */
        setData: function(data) {
            this.options.dataSource = data;
            this.element.data("init_dataSource", data);
        },
        /* -------------------- expand and collapse node ------------------- */
        /**
         * 展开指定节点。
         * @name omTree#expand
         * @function
         * @param target 指定节点的JSON数据对象
         * @example
         * //将target节点展开
         * $('#myTree').omTree('expand',target);
         */  
        expand: function(target) {
            if(target.nid) {
                this._collapseHandler(CLASSES.expandable, $("#" + target.nid));
            }
        },
        /**
         * 收缩指定节点。
         * @name omTree#collapse
         * @function
         * @param target 指定节点的JSON数据对象
         * @example
         * //将target节点收缩
         * $('#myTree').omTree('collapse',target);
         */  
        collapse: function(target) {
            if(target.nid) {
                this._collapseHandler(CLASSES.collapsable, $("#" + target.nid));
            }
        },
        /**
         * 展开所有的树节点。
         * @name omTree#expandAll
         * @function
         * @example
         * //将所有的树节点展开
         * $('#myTree').omTree('expandAll');
         */  
        expandAll: function() {
            this._collapseHandler(CLASSES.expandable, this.element);
        },
        /**
         * 收缩所有的树节点。
         * @name omTree#collapseAll
         * @function
         * @example
         * //将所有的树节点收缩
         * $('#myTree').omTree('collapseAll');
         */
        collapseAll: function() {
            this._collapseHandler(CLASSES.collapsable, this.element);
        },
        
        // filter: the class filter by the toggler
        // elem: from witch element
        _collapseHandler: function(filter, target) {
            this.toggler( $("div." + CLASSES.hitarea, target).filter(function(){
                return filter ? $(this).parent("." + filter).length : true;
            }).parent() );
            return false;
        },
        /* -------------------- edit node ------------------- */ 
        /**
         * 刷新指定树节点及其子节点。
         * @name omTree#refresh
         * @param target 可选，指定节点的JSON数据对象。不传参数则刷新整棵树。
         * @function
         * @example
         * //刷新整棵树
         * $('#myTree').omTree('refresh');
         */
        refresh: function( target ) {
            var self = this, tree=self.element;
            var data = self.getData();
            	if( !target ){
            		tree.data("nodes",[]);
            		self.setData([]);
            		tree.html("");
            		tree.data("init_dataSource", data);
            		if(typeof data == 'string'){
                        self._ajaxLoad(tree, data);
                    }else if(typeof data == 'object'){
            		   for(var i = 0; i < data.length; i ++ ) {
            			  self.insert(data[i]);
            		   }
            	  }
            	} else {
            		var nextNode = $("#" + target.nid).next();
            		var pid = tree.data("nodes")["pid" + target.nid];
            		self.remove( target );
            		self.insert(target, self.findByNId(pid),self.findByNId(nextNode.attr("id")));
            	}
            
        },
        
        // target equal the ul emelemt
        
        _appendNodes: function(target, nodes, bNode, isDrop) {
            var self = this, ht=[];
            var checkable = self.options.showCheckbox;
            var treeid=self.element.attr("id")?self.element.attr("id"):("treeId"+parseInt(Math.random()*1000));
            self.element.attr("id",treeid);
            for(var i = 0, l = nodes.length; i < l; i++){
                var node = nodes[i], isLastNode = (i == (nodes.length - 1));
                var nodeClass = "om-tree-node " + (checkable?"treenode-checkable ":"")+(node.hasChildren ? "hasChildren ":"");
                var nid=treeid+"_"+(++self.options.nodeCount);
                node.nid=nid;
                var caches = self.element.data("nodes");
                caches[node.nid] = node;
                if(typeof target == "string"){
                    caches["pid"+node.nid] = target;
                    if(isLastNode){
                        target = null;
                    }
                }else{
                    caches["pid"+node.nid] = target.parent("li").attr("id");
                }
                var childHtml = [];
                if(node.children && node.children.length > 0){
                    childHtml.push((self._appendNodes(node.nid, node.children)).join(""));
                }
                var len = 0;
                if (node.children && (len=node.children.length)>0||node.hasChildren) {
                    if(node.expanded){
                        nodeClass=nodeClass+"open "+CLASSES.collapsable+" "+(isLastNode ? CLASSES.lastCollapsable:"");
                    }else{
                        nodeClass=nodeClass+CLASSES.expandable+" "+(isLastNode ? CLASSES.lastExpandable:"");
                    }
                }else{
                    nodeClass=nodeClass+(isLastNode ? CLASSES.last:"");
                }
                ht.push("<li id='", node.nid, "' class='" ,nodeClass ,"'>");
                if(node.hasChildren || len >0){
                	var classes = "";
                    $.each(nodeClass.split(" "), function() {
                        classes += this + "-hitarea ";
                    });
                	ht.push("<div class='", CLASSES.hitarea +" "+classes, "'/>");
                }
                if(checkable){
                    ht.push("<div class='tree-checkbox'/>");
                }
                var spanClass = (node.classes?node.classes:"");
                if(self.options.showIcon){
                    if(node.hasChildren || node.children && node.children.length>0){
                        spanClass = spanClass + " folder ";
                    }else{
                        spanClass = spanClass + " file ";
                    }    
                }
                ht.push("<span class='", spanClass, "'>", "<a href='#'>", node.text, "</a></span>");
                if (node.hasChildren || len>0) {
                    ht.push("<ul", " style='display:", (node.expanded ? "block": "none"),"'>");
                    ht.push(childHtml.join(''));
                    ht.push("</ul>");
                }
                ht.push("</li>");
            }
            if(bNode){
                if(isDrop){
                    $("#"+bNode.nid).after(ht.join(""));
                }else{
                    $("#"+bNode.nid).before(ht.join(""));
                }
            }else if(target){
                target.append(ht.join(""));
            }
            return ht;
        },
        /**
         * 删除指定pNode的子节点中对应的JSON数据对象为target的节点。
         * @name omTree#remove
         * @function
         * @param target 需要被删除的节点对应的JSON数据，并且该节点数据中包括了nid属性
         * @param pNode 可选，指定的父节点对应的JSON数据对象，不传入，则为树的根节点
         * @example
         * //删除树种对应JSON数据对象为target的节点
         * var target = $('#myTree').omTree("findNode", "text", "node1");
         * $('#myTree').omTree('remove',target);
         */  
        remove: function(target, pNode) {
            var flag, self = this, data=pNode ? pNode.children : self.getData();
            for(var i in data){
                if(data[i] == target){
                    var ids = [];
                    ids = self._findChildrenId(target, ids);
                    ids.push(target.nid);
                    for(var n = 0, len = ids.length; n < len ; n++){
                        delete self.element.data("nodes")[ids[n]];
                        delete self.element.data("nodes")["pid"+ids[n]];
                    }
                    if(target.nid == self.element.data("selected")){
                        this.element.data("selected",null);
                    }
                    var pre = $("#"+target.nid).prev();
                    if($("#"+target.nid).next().length<1 && pre.length > 0){
                        if(pre.hasClass(CLASSES.collapsable)){
                            pre.addClass(CLASSES.lastCollapsable);
                            pre.find("div.hitarea").addClass(CLASSES.lastCollapsableHitarea);
                        }else if(pre.hasClass(CLASSES.expandable)){
                            pre.addClass(CLASSES.lastExpandable);
                            pre.find("div.hitarea").addClass(CLASSES.lastExpandableHitarea);
                        }else{
                            pre.addClass(CLASSES.last);
                        }
                    }
                    $("#"+target.nid).remove();
                    data.splice(i, 1);
                    if(pNode&&pNode.nid&&data.length < 1){
                    	self._changeToFolderOrFile(pNode,false);
                    }
                    return true;
                }else if(data[i].children){
                    flag = self.remove(target, data[i]);
                    if(flag){
                        return true;
                    }
                }
            }
            return false;
        },
        
        _findChildrenId: function(target, ids){
            if(target.children){
                for(var i = 0, children = target.children, len = children.length; i < len; i++){
                    ids.push(children[i].nid);
                    if(children[i].children){
                        this._findChildrenId(children[i], ids);
                    }
                }
            }
            return ids;
        },
        /**
         * 在指定pNode的子节点中插入一个JSON数据对象为target的节点，并且被插入的节点在指定bNode节点前。
         * @name omTree#insert
         * @function
         * @param target 需要被插入的节点对应的JSON数据对象，并且该节点数据中包括了nid属性
         * @param pNode 可选，指定的父节点对应的JSON数据对象，，并且该节点数据中包括了nid属性，不传入，则为树的根节点
         * @param bNode 可选，指定被插入节点位置，，并且该节点数据中包括了nid属性，不传入，则在pNode子节点的最后插入节点
         * @example
         * //在pNode的子节点后插入对应JSON数据对象为target的节点
         * var target = $('#myTree').omTree("findNode", "text", "node1");
         * $('#myTree').omTree('insert',target，pNode);
         */  

        insert : function(target, pNode, bNode, isDrop) {
            var self = this, nodes=[], parent, otherChildren, flag = $.isArray(target);
            if(flag){
            	nodes = target;
            } else{
            	nodes.push(target);
            }
            if (bNode) { 
                pNode = pNode || self.findByNId(self.element.data("nodes")["pid" + bNode.nid]);
            }
            var index, data = pNode ? pNode.children : self.getData();
            if (pNode && (!pNode.children||pNode.children.length<1)) {
            	if(!pNode.hasChildren){           		
            		self._changeToFolderOrFile(pNode,true);
            		self._bindHitEvent($("#" + pNode.nid));
            	}
                data = pNode.children = [];
            }
            parent = pNode ? $("#" + pNode.nid).children("ul").first() : self.element;
            otherChildren = parent.find("li");
            if (bNode && ((index = $.inArray(bNode, data)) >= 0)) {
                self._appendNodes(parent, nodes, bNode, isDrop);
                data.splice(index, 0, target);
            } else {
                self._appendNodes(parent, nodes, bNode, isDrop);
                if(flag){
                    $.merge(data, target);             
                }else{
                	data.push(target);
                }
            }
            var m = parent.find("li")
                        .filter("." + CLASSES.last + ",." + CLASSES.lastCollapsable+",."+CLASSES.lastExpandable)
                        .not(parent.find("li")
                        .filter(":last-child:not(ul)"));
            m.removeClass(CLASSES.last + " " + CLASSES.lastCollapsable + " " + CLASSES.lastExpandable);
            m.find(" >div").removeClass(CLASSES.lastCollapsableHitarea+" "+CLASSES.lastExpandableHitarea);
            var tdom = parent.find("li").not(otherChildren);                        
            self._applyEvents(tdom);
        },
        
        _changeToFolderOrFile: function(node,isToFolder){
        	var nDom = $("#" + node.nid),self=this;
        	if(isToFolder){
        		var parent = $("<ul/>").css("display",  "block").appendTo(nDom);
        		nDom.addClass("open "+CLASSES.collapsable);
        		self._swapClass(nDom, CLASSES.last, CLASSES.lastCollapsable);
        		node.children = [];
        	}else{
        		nDom.find("ul").remove();
        		nDom.find("div."+CLASSES.hitarea).remove();
        		nDom.filter("."+CLASSES.lastCollapsable+",."+CLASSES.lastExpandable)
        		.removeClass(CLASSES.lastCollapsable+" "+CLASSES.lastExpandable).addClass(CLASSES.last);
        		nDom.removeClass("open "+CLASSES.collapsable+" "+CLASSES.expandable);
        	}
            if(self.options.showIcon) {
                self._swapClass(nDom.children("span"),"file","folder");
            }
        	var hitarea = nDom.filter(":has(>ul)").prepend("<div class=\"" + CLASSES.hitarea + "\"/>").find("div." + CLASSES.hitarea);
            hitarea.each(function() {
                var classes = "";
                $.each($(this).parent().attr("class").split(" "), function() {
                    classes += this + "-hitarea ";
                });
                $(this).addClass( classes );
            });
        },
        
        
        /**
         * 在指定pNode的子节点中将JSON数据对象为target的节点修改其JSON数据对象为newNode。
         * @name omTree#modify
         * @function
         * @param target 需要修改的节点的JSON数据对象，并且该节点数据中包括了nid属性
         * @param newNode 修改后节点的JSON数据对象，并且该节点数据中包括了nid属性
         * @param pNode 可选，指定的父节点对应的JSON数据对象，，并且该节点数据中包括了nid属性，不传入，则为树的根节点
         * @example
         * //将JSON数据对象为target的节点修改其JSON数据对象为newNode
         * var target = $('#myTree').omTree("findNode", "text", "node1");
         * var newNode ={text: "node5"};
         * $('#myTree').omTree('insert',target，newNode);
         */  
        modify: function(target, newNode, pNode) {
        	if(target&&newNode){
        		var self = this, nextNode = $("#" + target.nid).next(), bNode;
                pNode = pNode || this.findByNId(self.element.data("nodes")["pid" + target.nid]);
                if(nextNode.is("ul") || nextNode.is("li"))
                    bNode = self.findByNId(nextNode.attr("id"));
                self.remove(target, pNode);
                self.insert(newNode, pNode, bNode);	
        	}
        },
        /* -------------------- disable and enable node ------------------- */
        disable: function() {
            
        },
        enable: function() {
            
        }
        
        /**
         * 更新数据异常后执行的方法 .错误信息为jQuery.ajax返回的异常信息，可参考jQuery.ajax官方文档。
         * @event
         * @name omTree#onError
         * @param xmlHttpRequest XMLHttpRequest 对象
         * @param textStatus 错误信息
         * @param errorThrown （可选）捕获的异常对象
         * @example
         *  $(".selector").omTree({
         *      onError:function(xmlHttpRequest,textStatus,errorThrown){
         *          alert('error occured');
         *      }
         *  });
         */
        /**
         * 单击树节点触发事件。
         * @event
         * @name omTree#onClick
         * @param nodeData 树节点的json对象
         * @param event 标准的 js event 对象
         * @example
         *  $("#tree").omTree({
         *      onClick: function(nodeData, event){ ... }
         *  });
         */
        /**
         * 双击树节点触发事件。
         * @event
         * @name omTree#onDblClick
         * @param nodeData 树节点的json对象
         * @param event 标准的 js event 对象
         * @example
         *  $("#tree").omTree({
         *      onDblClick: function(nodeData, event){ ... }
         *  });
         */
        /**
         * 右键树节点触发事件。
         * @event
         * @name omTree#onRightClick
         * @param nodeData 树节点的json对象
         * @param event 标准的 js event 对象
         * @example
         *  $("#tree").omTree({
         *      onRightClick: function(nodeData, event){ ... }
         *  });
         */
        /**
         * 树节点装载前触发事件。
         * @event
         * @name omTree#onBeforeLoad
         * @param nodeData 树节点的json对象
         * @example
         *  $("#tree").omTree({
         *      onBeforeLoad: function(nodeData){ ... }
         *  });
         */
        /**
         * 树节点装载成功后触发事件。
         * @event
         * @name omTree#onSuccess
         * @param data 装载成功后获取的数据json
         * @example
         *  $("#tree").omTree({
         *      onSuccess: function(data){ ... }
         *  });
         */
        /**
         * 树节点拖动时触发事件。
         * @event
         * @name omTree#onDrag
         * @param nodeData 树节点的json对象
         * @param event 标准的 js event 对象
         * @example
         *  $("#tree").omTree({
         *      onDrag: function(nodeData, event){ ... }
         *  });
         */
        /**
         * 树节点拖动时触发事件。
         * @event
         * @name omTree#onDrop
         * @param nodeData 树节点的json对象
         * @param event 标准的 js event 对象
         * @example
         *  $("#tree").omTree({
         *      onDrop: function(nodeData, event){ ... }
         *  });
         */
        /**
         * 树节点展开前触发事件。
         * @event
         * @name omTree#onBeforeExpand
         * @param nodeData 树节点的json对象
         * @example
         *  $("#tree").omTree({
         *      onBeforeExpand: function(nodeData){ ... }
         *  });
         */
        /**
         * 树节点收缩前触发事件。
         * @event
         * @name omTree#onBeforeCollapse
         * @param nodeData 树节点的json对象
         * @example
         *  $("#tree").omTree({
         *      onBeforeCollapse: function(nodeData){ ... }
         *  });
         */
        /**
         * 树节点展开后触发事件。
         * @event
         * @name omTree#onExpand
         * @param nodeData 树节点的json对象
         * @example
         *  $("#tree").omTree({
         *      onExpand: function(nodeData){ ... }
         *  });
         */
        /**
         * 树节点收缩后触发事件。
         * @event
         * @name omTree#onCollapse
         * @param nodeData 树节点的json对象
         * @example
         *  $("#tree").omTree({
         *      onCollapse: function(nodeData){ ... }
         *  });
         */
        /**
         * 树节点选中后触发事件。
         * @event
         * @name omTree#onCheck
         * @param nodeData 树节点的json对象
         * @param event 标准的 js event 对象
         * @example
         *  $("#tree").omTree({
         *      onCheck: function(nodeData){ ... }
         *  });
         */
        /**
         * 树节点选择后触发事件。
         * @event
         * @name omTree#onSelect
         * @param nodeData 树节点的json对象
         * @example
         *  $("#tree").omTree({
         *      onSelect: function(nodeData){ ... }
         *  });
         */
        /**
         * 树节点选择前触发事件。
         * @event
         * @name omTree#onBeforeSelect
         * @param nodeData 树节点的json对象
         * @example
         *  $("#tree").omTree({
         *      onBeforeSelect: function(nodeData){ ... }
         *  });
         */
    });
})(jQuery);