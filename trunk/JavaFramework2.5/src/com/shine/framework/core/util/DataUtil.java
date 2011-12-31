package com.shine.framework.core.util;

import java.util.ArrayList;
import java.util.Arrays;
import java.util.HashMap;
import java.util.Iterator;
import java.util.List;
import java.util.Map;

public class DataUtil {
	/**
	 * check String
	 * 
	 * @param s
	 * @return
	 */
	public static boolean isNull(String s) {
		if (s == null || s.trim().equals(""))
			return true;
		return false;
	}

	/**
	 * check list
	 * 
	 * @param list
	 * @return
	 */
	public static boolean isNull(List list) {
		if (list == null || list.size() == 0)
			return true;
		return false;
	}

	/**
	 * check map
	 * 
	 * @param map
	 * @return
	 */
	public static boolean isNull(Map map) {
		if (map == null || map.size() == 0)
			return true;
		return false;
	}

	/**
	 * 数组是否为空
	 * 
	 * @param array
	 * @return
	 */
	public static boolean isNull(Object[] array) {
		return array == null || array.length == 0;
	}

	/**
	 * 把null替换成""
	 */
	public static String ifNull(String str) {
		if (str == null || str.equalsIgnoreCase("null"))
			return "";
		else
			return str;
	}

	/**
	 * 把null替换成别的字符
	 */
	public static String ifNull(String str, String replaceStr) {
		if (str == null || str.equalsIgnoreCase("null"))
			return replaceStr;
		else
			return str;
	}

	/**
	 * 判断<TT>obj</TT>是否在数组<TT>array</TT>里面
	 * 
	 * @param array
	 * @param obj
	 * @return
	 */
	public static boolean contain(Object[] array, Object obj) {
		if (isNull(array))
			return false;
		for (Object arrayElement : array) {
			if (arrayElement.equals(obj))
				return true;
		}
		return false;
	}

	/**
	 * compare two string Lists 找出lastElements有但legacyElements没有的元素
	 */
	public static <T> List<T> getOffset(final List<T> lastElements,
			final List<T> legacyElements) {
		if (DataUtil.isNull(legacyElements))
			return lastElements;
		if (DataUtil.isNull(lastElements))
			return null;
		List<T> offsetElements = new ArrayList<T>();
		for (T lastElement : lastElements) {
			if (!legacyElements.contains(lastElement))
				offsetElements.add(lastElement);
		}
		if (offsetElements.isEmpty())
			return null;
		return offsetElements;
	}

	/**
	 * 获取两个列表都存在的元素列表
	 * 
	 * @param <T>
	 * @param lastElements
	 * @param legacyElements
	 * @return
	 */
	public static <T> List<T> getIntersect(final List<T> lastElements,
			final List<T> legacyElements) {
		if (!isNull(lastElements) && !isNull(legacyElements)) {
			List<T> list = new ArrayList<T>();
			for (T lastEle : lastElements) {
				if (legacyElements.contains(lastEle))
					list.add(lastEle);
			}
			return list;
		}
		return null;
	}

	/**
	 * 
	 * @param fSet
	 * @param sSet
	 * @return 返回 集合A 与 集合B 的差集 fSet - sSet
	 */
	public static String[] differenceSet(List<String> fSet, List<String> sSet) {
		StringBuffer result = new StringBuffer();
		boolean found = false;
		if (sSet == null || sSet.size() == 0) {
			for (String cs : fSet)
				result.append(cs + ";");
		} else {
			for (String cs : fSet) {
				found = false;
				for (String ck : sSet)
					if (ck.equals(cs)) {
						found = true;
						break;
					}
				if (!found)
					result.append(cs + ";");
			}
		}
		if (result.indexOf(";") > 0)
			return result.substring(0, result.length() - 1).split(";");
		else
			return null;
	}

	/**
	 * 
	 * @param fSet
	 * @param sSet
	 * @return 返回 集合A 与 集合B 的差集 fSet - sSet
	 */
	public static String[] differenceSet(List<String> fSet, String[] sSet) {
		StringBuffer result = new StringBuffer();
		boolean found = false;
		if (sSet == null || sSet.length == 0) {
			for (String cs : fSet)
				result.append(cs + ";");
		} else {
			for (String cs : fSet) {
				found = false;
				for (String ck : sSet)
					if (ck.equals(cs)) {
						found = true;
						break;
					}
				if (!found)
					result.append(cs + ";");
			}
		}
		if (result.indexOf(";") > 0)
			return result.substring(0, result.length() - 1).split(";");
		else
			return null;
	}

	/**
	 * 
	 * @param fSet
	 * @param sSet
	 * @return 返回 集合A 与 集合B 的差集 fSet - sSet
	 */
	public static String[] differenceSet(String[] fSet, String[] sSet) {
		StringBuffer result = new StringBuffer();
		boolean found = false;
		if (sSet == null || sSet.length == 0) {
			for (String cs : fSet)
				result.append(cs + ";");
		} else {
			for (String cs : fSet) {
				found = false;
				for (String ck : sSet)
					if (ck.equals(cs)) {
						found = true;
						break;
					}
				if (!found)
					result.append(cs + ";");
			}
		}
		if (result.indexOf(";") > 0)
			return result.substring(0, result.length() - 1).split(";");
		else
			return null;
	}

	/**
	 * 比较两个列表
	 * 
	 * @param list1
	 * @param list2
	 * @return 相同返回true，不同返回false
	 */
	public static boolean compare(List list1, List list2) {
		return DataUtil.isNull(list1) && DataUtil.isNull(list2)
				|| !DataUtil.isNull(list1) && !DataUtil.isNull(list2)
				&& list1.equals(list2);
	}

	/**
	 * 数组转换成列表
	 * 
	 * @param array
	 * @return
	 */
	public static List<String> convert(String[] array) {
		if (!DataUtil.isNull(array)) {
			return Arrays.asList(array);
		}
		return null;
	}

	/**
	 * 把MAP转化为数组
	 * 
	 * @param map
	 * @return
	 */
	public static String[][] getArrayFromMap(Map map) {
		if (isNull(map))
			return null;

		Map kv = getKeysAndValues(map);
		String[] keys = kv.get("keys").toString().split(",");
		String[] values = kv.get("values").toString().split(",");
		String[][] array = { keys, values };
		return array;
	}

	/**
	 * 分别统计MAP的KEYS和VALUES
	 * 
	 * @param map
	 * @return
	 */
	public static Map getKeysAndValues(Map map) {
		Map datas = new HashMap();
		String keys = "", values = "", key = "";
		Iterator it = map.keySet().iterator();
		while (it.hasNext()) {
			key = it.next().toString();
			keys += key + ",";
			values += map.get(key) + ",";
		}
		datas.put("keys", keys.substring(0, keys.length() - 1));
		datas.put("values", values.substring(0, values.length() - 1));
		return datas;
	}

	/**
	 * 获取map的所有数据 map {1,'s'} {2,'b'} ->> {(1,2),('s','b')}
	 * 
	 * @param map
	 * @return
	 */
	public static Map getRegisterKeysAndValues(Map map) {
		Map datas = new HashMap();
		String keys = "", values = "'", key = "";
		Iterator it = map.keySet().iterator();
		while (it.hasNext()) {
			key = it.next().toString();
			keys += key + ",";
			values += map.get(key) + "','";
		}
		datas.put("keys", keys.substring(0, keys.length() - 1));
		datas.put("values", values.substring(0, values.length() - 2));
		return datas;
	}

	/**
	 * 从文件路径中获取file名称
	 * 
	 * @param path
	 * @return
	 */
	public static String getFileName(String path) {
		for (int i = path.length() - 1; i >= 0; i--) {
			if (path.charAt(i) == '\\' || path.charAt(i) == '/')
				return path.substring(i + 1, path.length());
		}
		return path;
	}

	/**
	 * 反转二维对象数据的值
	 * 
	 * @param obj
	 * @return
	 */
	public static Object[][] reverseObjArray(Object[][] obj) {
		int objRow = obj.length, objColumn = obj[0].length;
		Object[][] result = new Object[objColumn][objRow];
		for (int row = 0; row < result.length; row++)
			for (int column = 0; column < result[0].length; column++)
				result[row][column] = obj[column][row];
		return result;
	}

	/**
	 * 把二维对象数据转化为二维字符串数组
	 * 
	 * @param obj
	 * @return
	 */
	public static String[][] toStringArray(Object[][] obj) {
		int objRow = obj.length, objColumn = obj[0].length;
		String[][] result = new String[objRow][objColumn];
		for (int row = 0; row < result.length; row++)
			for (int column = 0; column < result[0].length; column++)
				result[row][column] = obj[row][column].toString();
		return result;
	}

	/**
	 * utf8转gdk
	 * 
	 * @param String
	 * @return String
	 */
	public static String utf82gbk(String utf8) {
		try {
			return new String(utf8.getBytes("UTF-8"), "GBK");
		} catch (Exception e) {
			e.printStackTrace();
			return utf8;
		}
	}

	/**
	 * gdk转utf8
	 * 
	 * @param String
	 * @return String
	 */
	public static String gbk2utf8(String gbk) {
		try {
			return new String(gbk.getBytes("GBK"), "UTF-8");
		} catch (Exception e) {
			e.printStackTrace();
			return gbk;
		}
	}

	/**
	 * 获取数组某一列的值
	 * 
	 * @param array
	 * @param index
	 * @return
	 */
	public static String[] toColumnArray(String[][] array, int index) {
		if (array == null || index >= array[0].length)
			return null;

		String[] result = new String[array.length];
		for (int i = 0; i < result.length; i++)
			result[i] = array[i][index];
		return result;
	}

	/**
	 * 生成start和end间的随机数
	 * 
	 * @param start
	 * @param end
	 * @return
	 */
	public static int genRandom(int start, int end) {
		return (int) (end + (start - end) * Math.random());
	}

	/**
	 * 生成start和end间的随机数,带小数,保留小数点后2位
	 * 
	 * @param start
	 * @param end
	 * @return
	 */
	public static float genRandomFloat(int start, int end) {
		return (float) (Math.round((float) ((end * 10 + (start * 10 - end * 10)
				* Math.random()) / 10) * 100)) / 100;
	}

	/**
	 * 打乱正常的数字队列
	 * 
	 * @param list
	 * @return
	 */
	public static List<Integer> randomList(List<Integer> list) {
		List<Integer> resultList = new ArrayList<Integer>();
		int num = list.size();
		for (int i = 0; i < num; i++) {
			resultList.add(list.remove(genRandom(0, list.size())));
		}
		return resultList;
	}

	public static void main(String args[]) {
		List<Integer> list = new ArrayList<Integer>();
		list.add(1);
		list.add(2);
		list.add(3);
		list.add(4);
		

		List<Integer> resultList = randomList(list);
		for (int num : resultList) {
			System.out.println(num);
		}
	}

}
