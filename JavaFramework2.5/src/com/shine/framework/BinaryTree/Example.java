package com.shine.framework.BinaryTree;

import com.shine.framework.BinaryTree.model.TreeNode;

public class Example {

	/**
	 * @param args
	 */
	public static void main(String[] args) {
		BinaryTreeHelper biTree = new BinaryTreeHelper();
		int[] data = { 2, 8, 7, 4, 9, 3, 1, 6, 7, 5 };
		biTree.buildTree(data);
		// biTree.printTree();
		TreeNode node = biTree.searchTree(6);
		System.out.println(node.data);
	}
}
