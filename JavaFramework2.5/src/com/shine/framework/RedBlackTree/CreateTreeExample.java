package com.shine.framework.RedBlackTree;

public class CreateTreeExample {

	/**
	 * @param args
	 */
	public static void main(String[] args) {
		int[] E = { 1, 6, 8, 11, 13, 15, 17, 25, 22, 27 };

		for (int i = 0; i < 9; i++) {
			System.out.print(E[i] + ",");
		}
		System.out.println();

		RB_Tree RBtree = new RB_Tree(E);
		RBtree.preorder();
	}

}
