package com.shine.framework.ReflectAsm.example;

import java.io.ByteArrayOutputStream;
import java.io.IOException;
import java.io.InputStream;

import com.esotericsoftware.reflectasm.FieldAccess;

public class ClassLoaderExample {
	public void testDifferentClassloaders() throws Exception {
		// This classloader can see only the Test class and core Java classes.
		ClassLoader testClassLoader = new ClassLoader() {
			protected synchronized Class<?> loadClass(String name,
					boolean resolve) throws ClassNotFoundException {
				Class c = findLoadedClass(name);
				if (c != null)
					return c;
				if (name.startsWith("java."))
					return super.loadClass(name, resolve);
				if (!name
						.equals("com.shine.framework.ReflectAsm.example.ClassLoaderExample$Test"))
					throw new ClassNotFoundException(
							"Class not found on purpose: " + name);
				ByteArrayOutputStream output = new ByteArrayOutputStream(
						32 * 1024);
				InputStream input = ClassLoaderExample.class
						.getResourceAsStream("/" + name.replace('.', '/')
								+ ".class");
				if (input == null)
					return null;
				try {
					byte[] buffer = new byte[4096];
					int total = 0;
					while (true) {
						int length = input.read(buffer, 0, buffer.length);
						if (length == -1)
							break;
						output.write(buffer, 0, length);
					}
				} catch (IOException ex) {
					throw new ClassNotFoundException(
							"Error reading class file.", ex);
				} finally {
					try {
						input.close();
					} catch (IOException ignored) {
					}
				}
				byte[] buffer = output.toByteArray();
				return defineClass(name, buffer, 0, buffer.length);
			}
		};
		Class testClass = testClassLoader
				.loadClass("com.shine.framework.ReflectAsm.example.ClassLoaderExample$Test");
		Object testObject = testClass.newInstance();

		// Ensure AccessClassLoader can access both the Test class and
		// FieldAccess.
		FieldAccess access = FieldAccess.get(testObject.getClass());
		access.set(testObject, "name", "first");
		System.out.println("first" + testObject.toString());
		System.out.println("first" + access.get(testObject, "name"));
	}

	static public class Test {
		public String name;

		public String toString() {
			return name;
		}
	}

	public static void main(String args[]) throws Exception {
		new ClassLoaderExample().testDifferentClassloaders();
	}
}
