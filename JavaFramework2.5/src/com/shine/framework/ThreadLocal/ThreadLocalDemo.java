package com.shine.framework.ThreadLocal;

/** Demonstrate use of ThreadLocal */
public class ThreadLocalDemo extends Thread {
	/** A serial number for clients */
	private static int clientNum = 0;

	/** This ThreadLocal holds the Client reference for each Thread */
	private ThreadLocal myClient = new ThreadLocal() {
		// The initialValue() method is called magically when you call get().
		protected synchronized Object initialValue() {
			return new Client(clientNum++);
		}
	};

	public void run() {
		System.out.println("Thread " + Thread.currentThread().getName()
				+ " has client " + myClient.get());
	}

	public static void main(String[] args) {
		Thread t1 = new ThreadLocalDemo();
		Thread t2 = new ThreadLocalDemo();
		t1.start();
		t2.start();
	}

	/** Simple data class, in real life clients would have more fields! */
	private class Client {
		private int clNum;

		Client(int n) {
			clNum = n;
		}

		public String toString() {
			return "Client[" + clNum + "]";
		}
	}
}
