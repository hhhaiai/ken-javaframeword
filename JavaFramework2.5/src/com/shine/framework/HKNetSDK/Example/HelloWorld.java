package com.shine.framework.HKNetSDK.Example;

import com.sun.jna.Library;
import com.sun.jna.Native;
import com.sun.jna.Platform;

/** Simple example of native library declaration and usage. */
public class HelloWorld {
	public interface CLibrary extends Library {
		CLibrary INSTANCE = (CLibrary) Native.loadLibrary(
				(Platform.isWindows() ? "msvcrt" : "c"), CLibrary.class);

		void printf(String format, Object... args);
	}

	public static void main(String[] args) {
		CLibrary.INSTANCE.printf("Hello, World/n");
		for (int i = 0; i < 10; i++) {
			CLibrary.INSTANCE.printf("1/n", i, "1/n");
		}
	}
}
