/***************************************************************
prioritystate.js
defined statechain module
****************************************************************/
//ensure that we has provided this resource so it wont be downloaded again.
require.provide("lib.core.util.prioritystate");

/*
CLASS:
  WIN.PriorityState
DES:
  PriorityState help to control the different states of an object by the state priority.
PROPERTY:
  {string} actingState
    acting state
  {string} currentState
    current state but may not be acting
  {object} states
    the different states.It's an associate array like this: {state: priority};
  {WIN.Observer} actingStateObserver
    the acting state observer, executed onActingStateChange;
METHOD:
  {this} initialize([{object} states])
  {string} getMaxPriorityState()
  {boolean} insertState({string} state, {int} priority)
  {void} onActingStateChange()
  {boolean} removeState({string} state)
*/
WIN.PriorityState = function(){
  /*
  ():
    {this} initialize([{object} states])
  DES:
    init the states and actingState.
  */
  this.initialize = function(states){
    this.states = states || {};
    this.actingState = this.getMaxPriorityState();  
  };
  /*
  ():
    {string} getMaxPriorityState()
  DES:
    return the max priority state of the states if it has or return undefined;
  */
  this.getMaxPriorityState = function(){
    var p = - Number.MAX_VALUE , state, states = this.states;
    for(var i in states){
      if(states[i] >= p ){
        p = states[i];
        state = i;
      }
    }
    return state;
  };
  /*
  ():
    {boolean} insertState({string} state, {int} priority)
  DES:
    insert a new state to states,return true when insert success;
  ARG:
    {string} state
    {int} priority
      the priority of the state
  */
  this.insertState = function(state, priority){
    if(! (state && priority) )return false;
    state = state.toLowerCase();
    this.currentState = state;
    if( WIN.isDefined(this.states[state]) )return true;
    this.states[state] = priority;
    var actingState = this.actingState;
    var actingPriority = this.states[actingState];
    if(!actingState || priority >= actingPriority){
      this.actingState = state;
      this.onActingStateChange();
    }
    return true;
  };
  /*
  ():
    {void} onActingStateChange()
  DES:
    on acting state change we execute the actingStateObserver;
  */
  this.onActingStateChange = function(){
    this.actingStateObserver.execute();
  };
  /*
  ():
    {boolean} removeState({string} state)
  DES:
    remove a state from states,return true when removed success;
  */
  this.removeState = function(state){
    if(! state)return false;
    state = state.toLowerCase();
    delete this.states[state];
    var actingState = this.actingState;
    if(actingState == state){
      this.actingState = this.getMaxPriorityState();
      this.onActingStateChange();
    }
    return true;
  };
  this.actingStateObserver = new WIN.Observer();
};