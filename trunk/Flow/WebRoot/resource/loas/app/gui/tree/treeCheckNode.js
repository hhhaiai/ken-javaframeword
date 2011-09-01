/* treeCheckNode.js
*/
require.provide("app.gui.tree.treeCheckNode");
require("lib.core.util.SimpleTemplate");
require("lib.dom.style");
require("app.gui.tree.treeNode");

/* {
CLASS:
  GUI.TreeCheckNode
SUPERCLASS:
  GUI.Tree
DES:
  tree node with a checkbox;
CFG:
PROPERTY:
  {__datatype} __propertyname
    __description
METHOD:
  {__returntype} __function_name({__datatype} __argment1)
} */
GUI.TreeCheckNode = WIN.createClass(function(){
  },{
		initChecked : false,
		initDisabled : false,
		isCheckRoot : false,
		onlyLeafCheckable : true,
		autoToggleLeafChecked : true,
	
		initialize : function(options, async){
      WIN.extend(this, options);
			this.initInputHtml();
      GUI.TreeCheckNode.$initialize.call(this, options, async);
			this.setCheckedState(this.initChecked);
			this.setDisabledState(this.initDisabled);
      this.initAction();
      return this;
    },
		initInputHtml : function(){
			var values = {
				checked : this.initChecked ? " checked = checked " : " ",
				disabled : this.initDisabled ? " disabled = disabled " : " "
			};
			var html = this._inputHtmlTpl.apply(values);
			return this.inputHtml = html;
		},
		initAction : function(){
			var oAction = this.action,
					defAction = GUI.TreeCheckNode.rootCheckAction;
			if(WIN.isFunction(oAction)){
				this.action = function(actionData, node, target){
					defAction.apply(this, arguments);
					return oAction.apply(this, arguments);
				};
			}
			else if(this.isCheckRoot){
				this.action = defAction;
			}
		},
		
    appendChild : function(node){
      var re = GUI.TreeCheckNode.$appendChild.call(this, node);
			if(this.disabled) this._doCascade("setDisabled");
			this.onChildNodesCheckedChange();
			return re;
    },
    insertBefore : function(newNode, targetNode){
      var re = GUI.TreeCheckNode.$insertBefore.call(this, newNode, targetNode);
			if(this.disabled) this._doCascade("setDisabled");
			this.onChildNodesCheckedChange();
			return re;
    },
    removeChild : function(node){
      var re = GUI.TreeCheckNode.$removeChild.call(this, node);
			this.onChildNodesCheckedChange();
			return re;
		},
		
    setChecked : function(disCascade){
			if(this.disabled)return this;
			if(this.checked)return this;
			
			this._setCheckboxAttribute("checked", true);
			this.checked = true;
			if(!disCascade) this._doCascade("setChecked");
			
			var p = this.parent;
			if(p && !p.checked && WIN.isFunction(p.onChildNodesCheckedChange)){
				p.onChildNodesCheckedChange();
			}
			
			return this;
		},
		unChecked : function(disCascade){
			if(this.disabled)return this;
			if(!this.checked)return this;
			
			this._setCheckboxAttribute("checked", false);
			this.checked = false;
			if(!disCascade) this._doCascade("unChecked");
			
			var p = this.parent;
			if(p && WIN.isFunction(p.onChildNodesCheckedChange)){
				p.onChildNodesCheckedChange();
			}
			
			return this;
		},
		toggleChecked : function(disCascade){
			if(this.checked)this.unChecked(disCascade);
			else this.setChecked(disCascade);
			
			return this;
		},
		setCheckedState : function(checked, disCascade){
			if(checked)this.setChecked(disCascade);
			else this.unChecked(disCascade);
			
			return this;
		},
		
		setDisabled : function(disCascade){
			if(this.disabled)return this;
			
			this._setCheckboxAttribute("disabled", true);
			this.disabled = true;
			var ele = this.contentCtn;
			if(WIN.isElement(ele)){
				EL.addClass(ele, "disabled");
			}
			if(!disCascade)this._doCascade("setDisabled");
			
			return this;
		},
		setEnabled : function(disCascade){
			if(this.disabled)return this;
			
			this._setCheckboxAttribute("disabled", false);
			this.disabled = false;
      var ele = this.contentCtn;
      if(WIN.isElement(ele)){
        EL.removeClass(ele, "disabled");
      }
			
			if(!disCascade)this._doCascade("setEnabled");
			
			return this;
		},
		toggleDisabled : function(){
			if(this.disabled)this.setEnabled();
			else this.setDisabled();
			
			return this;
		},
		setDisabledState : function(disabled){
			if(disabled)this.setDisabled();
			else this.setEnabled();
			
			return this;
		},
		
		getCheckedNodes : function(){
			var re = [];
			if(!this.disabled){
				if(!this.hasChildNodes()){
					if(this.checked)re.push(this);
				}
				else{
					if(this.checked && !this.onlyLeafCheckable) re.push(this);
					this.each(function(chd){
						if(WIN.isFunction(chd.getCheckedNodes)){
							re = re.concat(chd.getCheckedNodes());
						}
					});
				}
			}
			return re;
		},
    disableBranchNodes : function(){
			if(this.hasChildNodes()){
				this.setDisabled(true);
				this._doCascade("disableBranchNodes");
			}
		},		
    getCheckboxEle : function(){
			var ctn = this.contentCtn;
			if(!WIN.isElement(ctn))return null;
			return this.checkboxEle = ctn.getElementsByTagName("input")[0];
		},		
		onChildNodesCheckedChange : function(){
			var n = 0,
					chd = this.firstChild;
			while(chd){
			  if(chd.checked){
					n ++;
				}
				chd = chd.nextSibling;
			}
			if(n == this._childNodesNum) this.setChecked(true);
			else this.unChecked(true);
		},

		_inputHtmlTpl : new WIN.SimpleTemplate('<input type="checkbox" {checked} {disabled} />'),
		
		_doCascade : function(method){
			var chd = this.firstChild;
			while(chd){
				if( WIN.isFunction(chd[method])) chd[method].call(chd);
				chd = chd.nextSibling;
			}
		},
    _setCheckboxAttribute : function(name, value){
			var ele = this.checkboxEle;
			if(!ele) ele = this.getCheckboxEle();
			if(WIN.isElement(ele)){
				ele[name] = value;
			}
		},
    toString: function(){return "[object GUI.TreeCheckNode]";}
  },
	GUI.TreeNode
);
GUI.TreeCheckNode.rootCheckAction = function(actionData, node, target){
	if(node instanceof GUI.TreeCheckNode){
		var toggleChecked = node.autoToggleLeafChecked;
		if(toggleChecked){
			if(node.getCheckboxEle() == target){
				toggleChecked = true;
			}
			else if(!node.hasChildNodes()){
				toggleChecked = true;
			}
			else toggleChecked = false;
		}
		if(toggleChecked)node.toggleChecked();
	}
	return false;
};
