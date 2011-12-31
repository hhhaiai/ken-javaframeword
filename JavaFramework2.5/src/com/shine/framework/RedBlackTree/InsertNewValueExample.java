package com.shine.framework.RedBlackTree;

public class InsertNewValueExample {

	/**
	 * @param args
	 */
	public static void main(String[] args) {
		int[] E = { 1, 6, 8, 11, 13, 15, 17, 25, 22, 27 };

		for (int i = 0; i < 9; i++) {
			System.out.print(E[i] + ",");
		}
		System.out.println();

		RebBlackTreeHelper RBtree = new RebBlackTreeHelper(E);
		RBtree.preorder();
		RBtree.insert(16);
		System.out.println();
		RBtree.preorder();

	}

}
