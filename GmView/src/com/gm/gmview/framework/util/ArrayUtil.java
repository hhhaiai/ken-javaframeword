package com.gm.gmview.framework.util;

import java.util.List;

/**
 * 数组工具类
 * @author JiangKunpeng	2011.05.27
 * @version 2012.03.01
 */
final public class ArrayUtil {
	private ArrayUtil(){
	}
	
	/**
	 * 合并两个数组，将将两个数组的值进行拼接，并返回合并后的新数组
	 * @param arr1
	 * @param arr2
	 * @return
	 */
	public static Object[] mergeArray(Object[] arr1,Object[] arr2){
		if(arr1==null)
			return arr2;
		if(arr2==null)
			return arr1;
		Object[] target = new Object[arr1.length+arr2.length];
		System.arraycopy(arr1, 0, target, 0, arr1.length);
		System.arraycopy(arr2, 0, target, arr1.length, arr2.length);
		return target;
	}
	
	/**
	 * 合并两个数组，将将两个数组的值进行拼接，并返回合并后的新数组
	 * @param arr1
	 * @param arr2
	 * @return
	 */
	public static String[] mergeArray(String[] arr1,String[] arr2){
		if(arr1==null)
			return arr2;
		if(arr2==null)
			return arr1;
		String[] target = new String[arr1.length+arr2.length];
		System.arraycopy(arr1, 0, target, 0, arr1.length);
		System.arraycopy(arr2, 0, target, arr1.length, arr2.length);
		return target;
	}
	
	/**
	 * 判断字符串数组中是否包含指定字符串
	 * @param arr
	 * @param str
	 * @return
	 */
	public static boolean contains(String[] arr,String str){
		boolean flag = false;
		if(arr!=null&&str!=null){
			for(String a:arr){
				if(str.equals(a)){
					flag = true;
					break;
				}
			}
		}
		return flag;
	}
	
	/**
	 * 将值加入List，确保不存在相同值
	 * @param dest		目标List
	 * @param value		要加入的值
	 * @return
	 */
	public static <T> List<T> addNoReplaceRepeat(List<T> dest,T value){
		boolean repeat = false;
		int len = dest.size();
		for(int i=0;i<len;i++){
			if(dest.get(i).equals(value)){
				repeat = true;
				break;
			}
		}
		if(!repeat)
			dest.add(value);
		return dest;
	}
	
	/**
	 * 将List全部加入目标List，确保不存在相同值
	 * @param dest		目标List
	 * @param values	要加入的值的List(将该List中的所有值加入dest)
	 * @return
	 */
	public static <T> List<T> addAllNoReplaceRepeat(List<T> dest,List<T> values){
		for(T v:values){
			addNoReplaceRepeat(dest, v);
		}
		return dest;
	}
	
}
