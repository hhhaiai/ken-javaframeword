package com.shine.framework.Compile;

public class Example {

	/**
	 * @param args
	 */
	public static void main(String[] args) throws Exception {
		// CompileUtils.CompileFile("E:\\workspace\\JavaFramework2.0\\src\\com\\shine\\framework\\Compile\\Test.java",
		// "E:\\");

		System.out
				.println(CompileUtils
						.executeJavaFile(
								"E:\\workspace\\JavaFramework2.0\\src\\com\\shine\\framework\\Compile\\Test.java",
								"E:\\", null,
								"com.shine.framework.Compile.Test", "test"));
	}

}
