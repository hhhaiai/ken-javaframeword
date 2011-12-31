package com.shine.framework.BinaryTree;

import java.util.List;

import com.shine.framework.BinaryTree.model.TreeNode;

public class BinaryTreeHelper {

	private TreeNode root;

	/**
	 * 创建一个空的二叉树
	 */
	public BinaryTreeHelper() {
		root = null;
	}

	/**
	 * 递归的插入数值
	 * 
	 * @param data
	 *            要插入的数值
	 */
	public void insert(int data) {
		root = insert(root, data);
	}

	/**
	 * 将数值插入到二叉树中，比当前结点小或等于当前结点的插在当前结点的左侧，比当前结点大的数插在当前结点的右侧，每次从根结点开始递归比较
	 * 
	 * @param node
	 *            当前的结点，就是根结点，只是每次根结点的左右子孙更新
	 * @param data
	 *            要插入的数值
	 * @return 新排好的二叉树
	 */
	private TreeNode insert(TreeNode node, int data) {
		if (node == null) {
			node = new TreeNode(data);
		} else {
			if (data <= node.data) {
				node.left = insert(node.left, data);
			} else {
				node.right = insert(node.right, data);
			}
		}
		return (node);
	}

	/**
	 * 将数值输入构建二叉树
	 * 
	 * @param data
	 *            要输入的数值
	 */
	public void buildTree(int[] data) {
		for (int i = 0; i < data.length; i++) {
			insert(data[i]);
		}
	}

	/**
	 * 构建二叉树
	 * 
	 * @param datas
	 */
	public void buildTree(List<Integer> datas) {
		for (int i : datas) {
			insert(i);
		}
	}

	/**
	 * 搜索二叉树
	 * 
	 * @param data
	 * @return
	 */
	public TreeNode searchTree(int data) {
		TreeNode resultNode = null;
		TreeNode node = root;
		boolean b = true;
		while (b) {
			if (node.data == data) {
				resultNode = node;
				break;
			} else if (node.data > data) {
				node = node.left;
			} else if (node.data < data) {
				node = node.right;
			}
		}
		return resultNode;
	}

	/**
	 * 递归打印出二叉树
	 */
	public void printTree() {
		printTree(root);
		System.out.println();
	}

	/**
	 * 从根结点开始遍历，从树的最高层叶子结点开始输出，从左至右
	 * 
	 * @param node
	 *            当前的结点
	 */
	private void printTree(TreeNode node) {
		if (node == null)
			return;
		// left, node itself, right
		printTree(node.left);
		System.out.print(node.data + "  ");
		printTree(node.right);
	}
}
