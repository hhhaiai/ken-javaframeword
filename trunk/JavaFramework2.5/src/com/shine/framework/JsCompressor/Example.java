package com.shine.framework.JsCompressor;

public class Example {

	/**
	 * @param args
	 */
	public static void main(String[] args) {
		// 压缩js
		JsCompressorUtils
				.jsCompressor(
						"utf-8",
						"F:\\JavaWorkSpace\\nms4.6\\WebContent\\resource\\js\\sv\\tmp.js",
						"E://test.js");
		
		//压缩css
		
	}
}
