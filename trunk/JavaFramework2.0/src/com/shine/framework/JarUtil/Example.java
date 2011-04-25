package com.shine.framework.JarUtil;

public class Example {
	public static void main(String args[]) {
		JarLoader.executeJarClass("test.jar", "test.Test", "test", "123");
	}
}
