package com.shine.framework.core.util
{
	import mx.collections.ArrayCollection;

	public class ArrayMap
	{
		private var entry:ArrayCollection=new ArrayCollection;
		
		public function ArrayMap()
		{
		}
		
		/**
		 * 比较是否存在相同的key
		 * @param key
		 * */
		public function containsKey(key:Object):Boolean{
			var length:int=entry.length;
			var b:Boolean=false;
			for(var i:int=0;i<length;i++){
				var mapValue:MapValue=entry.getItemAt(i) as MapValue;
				if(mapValue.key==key){
					b=true;
					break;
				}
			}
			return b;
		}
		
		/**
		 * 比较是否存在相同的value
		 * @param value
		 * */
		public function containsValue(value:Object):Boolean{
			var length:int=entry.length;
			var b:Boolean=false;
			for(var i:int=0;i<length;i++){
				var mapValue:MapValue=entry.getItemAt(i) as MapValue;
				if(mapValue.value==value){
					b=true;
					break;
				}
			}
			return b;
		}
		
		/**
		 * 存入数据
		 * @param key
		 * @param value
		 * */
		public function put(key:Object,value:Object):void{
			var mapValue:MapValue=null;
			var length:int=entry.length;
			var b:Boolean=true;
			for(var i:int=0;i<length;i++){
				mapValue=entry.getItemAt(i) as MapValue;
				if(mapValue.key==key){
					MapValue(entry.getItemAt(i)).value=value;
					b=false;
					break;
				}
			}
			if(b){
				mapValue=new MapValue;
				mapValue.key=key;
				mapValue.value=value;
				entry.addItem(mapValue);
				mapValue=null;
			}
		}
		
		/**
		 * 根据key获取数据
		 * @param key
		 * */
		public function get(key:Object):Object{
			var length:int=entry.length;
			for(var i:int=0;i<length;i++){
				var mapValue:MapValue=entry.getItemAt(i) as MapValue;
				if(mapValue.key==key){
					return mapValue.value;
				}
			}
			return null;
		}
		
		/**
		 * 获取长度
		 * */
		public function getLength():int{
			return entry.length;
		}
		
		/**
		 * 根据顺序获取key
		 * @param index
		 * */
		public function getKeyByIndex(value:int):Object{
			if(value<entry.length)
				return (entry.getItemAt(value) as MapValue).key;
			return null;
		}
		
		/**
		 * 根据顺序获取value
		 * @param index
		 * */
		public function getValueByIndex(value:int):Object{
			if(value<entry.length)
				return (entry.getItemAt(value) as MapValue).value;
			return null;
		}
		
		/**
		 *获取key的位置
		 *@param key
		 * */
		public function getIndexByKey(key:Object):int{
			if(this.containsKey(key)){
				var length:int=entry.length;
				for(var i:int=0;i<length;i++){
					var mapValue:MapValue=entry.getItemAt(i) as MapValue;
					if(mapValue.key==key){
						return i;
					}
				}
			}
			return 0;
		}
		
		/**
		 *获取首个value的位置
		 *@param value
		 * */
		public function getIndexByValue(value:Object):int{
			if(this.containsValue(value)){
				var length:int=entry.length;
				for(var i:int=0;i<length;i++){
					var mapValue:MapValue=entry.getItemAt(i) as MapValue;
					if(mapValue.value==value){
						return i;
					}
				}
			}
			return 0;
		}
		
		/**
		 *删除该key
		 *@param key
		 * */
		public function removeMapValue(key:Object):void{
			if(this.containsKey(key)){
				entry.removeItemAt(this.getIndexByKey(key));
			}
		}
		
		/**
		 *删除该value
		 *@param value
		 * */
		public function removeMapByValue(value:Object):void{
			if(this.containsValue(value)){
				entry.removeItemAt(this.getIndexByValue(value));
			}	
		}
		
		
		/**
		 * 删除所有数据
		 * */
		public function removeAll():void{
			entry.removeAll();
		}
		
		/**
		 * 获取所有值的数组
		 * */
		public function getValueArray():Array{
			var valueArray:Array=new Array;
			var num:int=this.getLength();
			for(var i:int=0;i<num;i++){
				valueArray.push(this.getValueByIndex(i));
			}
			return valueArray;
		}
	}
}
class MapValue{
	public var key:Object;
	public var value:Object;
}