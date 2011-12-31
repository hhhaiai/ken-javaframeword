package com.shine.framework.core.util;

import java.util.ArrayList;
import java.util.List;

public class SorterUtil {
	/**
	 * 插入排序
	 * 
	 * @param list
	 * @return
	 */
	public static List insertSort(List<Integer> list) {
		int tmp = 0;
		for (int i = 0; i < list.size(); i++) {
			tmp = list.get(i);
			int j = i;
			for (; j > 0; j--) {
				if ((tmp - list.get(j - 1)) < 0) {
					list.set(j, list.get(j - 1));
				} else {
					break;
				}
			}
			list.set(j, tmp);
		}
		return list;
	}

	/**
	 * 冒泡排序递增
	 * 
	 * @param list
	 */
	public static List bubbleSortUp(List<Integer> list) {
		for (int i = 0; i < list.size(); i++) {
			for (int j = list.size() - 1; j > 0; j--) {
				if ((list.get(j) - list.get(j - 1)) < 0) {
					list = swap(list, j - 1, j);
				}
			}
		}
		return list;
	}

	/**
	 * 冒泡排序递减
	 * 
	 * @param list
	 */
	public static List bubbleSortDown(List<Integer> list) {
		for (int i = list.size() - 1; i >= 0; i--) {
			for (int j = 0; j < i; j++) {
				if ((list.get(j) - list.get(j + 1)) < 0) {
					list = swap(list, j, j + 1);
				}
			}
		}
		return list;
	}

	/**
	 * 希尔排序
	 * 
	 * @param list
	 * @return
	 */
	public static List shellSorter(List<Integer> list) {
		List<Integer> resultList = new ArrayList<Integer>();

		int value = 1;
		while ((value + 1) * 2 < list.size()) {
			value = (value + 1) * 2 - 1;

		}

		for (int delta = value; delta >= 1; delta = (delta + 1) / 2 - 1) {
			for (int i = 0; i < delta; i++) {
				resultList = shellInsertSort(list, i, list.size() - i, delta);
			}
		}
		return resultList;
	}

	/**
	 * 希尔排序协助
	 * 
	 * @param list
	 * @param from
	 * @param len
	 * @param delta
	 * @return
	 */
	private static List<Integer> shellInsertSort(List<Integer> list, int from,
			int len, int delta) {
		if (len <= 1) {
			return list;
		}
		int tmp = 0;
		for (int i = from + delta; i < from + len; i += delta) {
			tmp = list.get(i);
			int j = i;
			for (; j > from; j -= delta) {
				if ((tmp - list.get(j - delta)) < 0) {
					list.set(j, list.get(j - delta));
				} else {
					break;
				}
			}
			list.set(j, tmp);
		}
		return list;
	}

	/**
	 * 快速排序
	 * 
	 * @param list
	 * @return
	 */
	public static List<Integer> quickSorter(List<Integer> list) {
		qSort(list, 0, list.size() - 1);
		return list;
	}

	/**
	 * 快速排序递归
	 * 
	 * @param list
	 * @param from
	 * @param to
	 */
	private static void qSort(List<Integer> list, int from, int to) {
		if (to - from < 1) {
			return;
		}
		int pivot = selectPivot(from, to);

		pivot = partion(list, from, to, pivot);

		qSort(list, from, pivot - 1);
		qSort(list, pivot + 1, to);
	}

	/**
	 * 获取中间点
	 * 
	 * @param from
	 * @param to
	 * @return
	 */
	private static int selectPivot(int from, int to) {
		return (from + to) / 2;
	}

	/**
	 * 快速排序分析
	 * 
	 * @param list
	 * @param from
	 * @param to
	 * @param pivot
	 * @return
	 */
	private static int partion(List<Integer> list, int from, int to, int pivot) {
		int tmp = list.get(pivot);
		list.set(pivot, list.get(to));

		while (from != to) {
			while (from < to && (list.get(from) - tmp) <= 0) {
				from++;
			}
			if (from < to) {
				list.set(to, list.get(from));
				to--;
			}
			while (from < to && (list.get(to) - tmp) >= 0) {
				to--;
			}
			if (from < to) {
				list.set(from, list.get(to));
				from++;
			}
		}
		list.set(from, tmp);
		return from;
	}

	/**
	 * 归并排序（合并排序）
	 * 
	 * @param list
	 * @return
	 */
	public static List<Integer> mergeSort(List<Integer> list) {
		if (list.size() <= 1) {
			return list;
		}
		List<Integer> temporary = new ArrayList<Integer>();
		mergeSort(list, 0, list.size() - 1, temporary);
		return list;
	}

	private static void mergeSort(List<Integer> list, int from, int to,
			List<Integer> temporary) {
		if (to <= from) {
			return;
		}
		int middle = (from + to) / 2;
		mergeSort(list, from, middle, temporary);
		mergeSort(list, middle + 1, to, temporary);
		merge(list, from, to, middle, temporary);
	}

	private static void merge(List<Integer> list, int from, int to, int middle,
			List<Integer> temporary) {
		int k = 0, leftIndex = 0, rightIndex = to - from;
		for (int i = 0; i < (middle - from + 2); i++) {
			temporary.add(i, list.get(from + i));
		}
		for (int i = 0; i < to - middle; i++) {
			temporary.add(to - from - i, list.get(middle + i + 1));
		}
		while (k < to - from + 1) {
			if ((temporary.get(leftIndex) - temporary.get(rightIndex)) < 0) {
				list.set(k + from, temporary.get(leftIndex++));
			} else {
				list.set(k + from, temporary.get(rightIndex--));
			}
			k++;
		}
	}

	/**
	 * 桶排序
	 * 
	 * @param list
	 * @param max
	 * @return
	 */
	public static List<Integer> bucketSorter(List<Integer> list, int max) {
		int[] temp = new int[list.size()];
		int[] count = new int[max];

		for (int i = 0; i < list.size(); i++) {
			count[list.get(i)]++;
		}
		// calculate position info
		for (int i = 1; i < max; i++) {
			count[i] = count[i] + count[i - 1];
		}
		for (int i = 0; i < list.size(); i++) {
			temp[i] = list.get(i);
		}

		for (int k = list.size() - 1; k >= 0; k--) {
			list.set(--count[temp[k]], temp[k]);
		}
		return list;
	}

	/**
	 * 交换位置
	 * 
	 * @param list
	 * @param from
	 * @param to
	 */
	public static List swap(List<Integer> list, int from, int to) {
		int tmp = list.get(from);
		list.set(from, list.get(to));
		list.set(to, tmp);
		return list;
	}

	public static void main(String args[]) {
		List<Integer> list = new ArrayList<Integer>();
		for (int i = 0; i < 10; i++) {
			list.add(i);
		}

		list = DataUtil.randomList(list);

		for (int i = 0; i < list.size(); i++) {
			System.out.print(list.get(i) + ",");
		}
		System.out.println();

		// 插入
		// List<Integer> resultList = SorterUtil.insertSort(list);

		// 冒泡递减
		// List<Integer> resultList = SorterUtil.bubbleSortDown(list);

		// 冒泡递增
		// List<Integer> resultList = SorterUtil.bubbleSortUp(list);

		// 希尔排序
		// List<Integer> resultList = SorterUtil.shellSorter(list);

		// 快速排序
		// List<Integer> resultList = SorterUtil.quickSorter(list);

		// 合并排序
		// List<Integer> resultList = SorterUtil.mergeSort(list);

		// 桶排序
		List<Integer> resultList = SorterUtil.bucketSorter(list,
				list.size() + 1);

		for (int i : resultList) {
			System.out.print(i+",");
		}
	}
}
