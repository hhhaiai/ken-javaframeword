/* methodPool.js
*/
require.provide("lib.core.util.methodPool");

/* {
NAMESPACE| OBJECT | Singleton:
  WIN.MethodPool
DES:
  MethodPool is simulant interface mechanism;
FUNCTION:
  {pool} WIN.MethodPool.declare({object} pool, {object} requireProps)
  {boolean} WIN.MethodPool.extendsPool({class} impl, {object} pool)
  {boolean} WIN.MethodPool.extendsPools({object} obj [, {object} pool ...])
  {boolean} WIN.MethodPool.hasImplemented({object} obj, {object} pool)
} */
WIN.MethodPool = {
  /* {
  ():
    {pool} WIN.MethodPool.declare({object} pool, {function} check)
  DES:
    declare a pool,prescribes the rule of implemention;
    we set requireProps as a property named "_requireProperties" of pool;
  ARG:
    {object} pool
      the methods pool;
    {function} check
      boolean function to check whether the implement object is valid or not;
  RTN:
    pool self
  } */
  declare : function(pool, check){
    pool._requireCheck = check;
    return pool;
  },
  /* {
  ():
    {boolean} WIN.MethodPool.hasImplemented({object} obj, {object} pool)
  DES:
    check a obj has implemented the pool(interface) or not;
  } */
  hasImplemented : function(obj, pool){
    var i = false,
        impledPools = obj._implementedPools;
    if(WIN.isArray(impledPools))i = impledPools.contains(pool);
    return i;
  },
  /* {
  ():
    {boolean} WIN.MethodPool.extendsPool({function | object} impl, {object} pool)
  DES:
    if the impl object cant pass the check of the method _hasRequireProps, we raise an error;
    else we extend the pool propties to impl if they were undefined
    and add a property named "_implementedPools" to the impl;
  ARG:
    {function | object} impl
      if impl is a class function we use its prototype instead;
    {object} pool
      the methods provider pool;
  RTN:
    if the impl is not hasRequireProps, raises a error;
  } */
  extendsPool : function(impl, pool){
    if(!pool || !impl)return false;
    var p = WIN.isFunction(impl) ? impl.prototype : impl,
        check = pool._requireCheck;
    
		
    if(WIN.isFunction(check) && !check(p))
      throw {
        description : "WIN.MethodPool -> extendsPool() : Invalid implement: " + p + " !"
      };
    for(var i in pool){
      if(p[i] === undefined) p[i] = pool[i];
    }
    if(!p._implementedPools)p._implementedPools = [];
    p._implementedPools.push(pool);
    return true;
  },
  /* {
  ():
    {boolean} WIN.MethodPool.extendsPools({object} obj [, {object} pool ...])
  DES:
    extends pools;@see extendsPool;
  } */
  extendsPools : function(impl){
    var ext = WIN.MethodPool.extendsPool;
    Array.each(function(pool){
      ext(impl, pool);
    }, arguments, 1);
    return true;
  }
};