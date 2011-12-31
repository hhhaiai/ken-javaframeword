package com.shine.framework.RedBlackTree.model;

public class TreeNode {
	int key;
	String color;
	TreeNode left;
	TreeNode right;
	TreeNode parent;

	public TreeNode(int key) {
		this.key = key;
	}

	public TreeNode(String color) {
		this.color = color;
		this.key = -1;
	}

	public int getKey() {
		return key;
	}

	public void setKey(int key) {
		this.key = key;
	}

	public String getColor() {
		return color;
	}

	public void setColor(String color) {
		this.color = color;
	}

	public TreeNode getLeft() {
		return left;
	}

	public void setLeft(TreeNode left) {
		this.left = left;
	}

	public TreeNode getRight() {
		return right;
	}

	public void setRight(TreeNode right) {
		this.right = right;
	}

	public TreeNode getParent() {
		return parent;
	}

	public void setParent(TreeNode parent) {
		this.parent = parent;
	}
}
