/* codeColor.js
*/
require.provide("app.widget.coderHelper.codeColoring.codeColor");
require("app.widget.coderHelper.LineModeStack");

namespace("WIDGET");
WIDGET.CodeColor = WIN.createClass(function(){
	}, {
		doctype : "javascript",
		lineColorMode : "doctype",
		lineColorModeStack : null,
		regNotBlank : /\S+/, //Matches at least a single character other than white space: [^ \f\n\r\t\v]+
		regAN : /\w+/g, //alphanumeric :[A-Za-z0-9_]+
		typesRegLib : null,//
		
		initialize : function(){
			this.lineColorModeStack = new WIDGET.LineModeStack;
		},
		analysis : function(code){
			var results = [];
			var lines = code.split("\n");
			
			Array.each(function(line){  
				if(this.regNotBlank.test(line)){
					results.push(this.analysisNotBlankLine(line));
				}
				else{
					results.push(this.analysisBlankLine(line));
				}
			},lines);
			
			return results;
		},
		
		analysisBlankLine : function(line){
			return line;
		},
		
		analysisNotBlankLine : function(line){
			if(!String.notEmpty(line))return line;
			var arr;
			var result = "";
			var len, index = lastIndex = 0;
			var symbols = word = "";
			var regAN = this.regAN;
			
			while ((arr = regAN.exec(line)) != null){
				index = arr.index;
				if(index > lastIndex){
					symbols = line.substring(lastIndex, index);
					result += this.colorSymbols(symbols);
				}
				word = arr[0];
				lastIndex = arr.lastIndex || (index + word.length);
				result += this.colorWord(word);
			}
			
			len = line.length;
			if(len > lastIndex){
				symbols = line.substring(lastIndex, len);
				result += this.colorSymbols(symbols);
			}
			
			return result;
		},
		
		colorSymbols : function(symbols){
			
		},
		
		colorWord : function(word){
			var doctype = this.getDoctype();
			var wordType = this.deteckWordType();
			return this.lineColorMode;
		},
		
		/*
		():
			{string} deteckWordType({string} word)
		DES:
			return the type of word: escape, normal, Comment, RegExp, Keyword(Reserved, Function, Native, Client), Number, Bracket, Operator.
		*/
		deteckWordType : function(word){
			var re, regLib = this.typesRegLib;
			for(var i in regLib){
				re = regLib[i];
				if()
			}
			return "normal";
		},
		
		setTypesRegLib : function(regLib){
			return this.typesRegLib = regLib;
		},
		
		getLineColorMode : function(){
			return this.lineColorMode;
		},
		setLineColorMode : function(mode){
			this.lineColorMode = mode;
		},
		getDoctype : function(){
			return this.doctype;
		},
		setDoctype : function(type){
			this.doctype = type;
		},
		
		toString : function(){
			return "[object WIDGET.CodeColor]";
		}
	}
);