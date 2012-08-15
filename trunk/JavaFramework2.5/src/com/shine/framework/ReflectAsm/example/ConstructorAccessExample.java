package com.shine.framework.ReflectAsm.example;

import com.esotericsoftware.reflectasm.ConstructorAccess;

public class ConstructorAccessExample {

	public void testNewInstance() {
		ConstructorAccess<SomeClass> access = ConstructorAccess
				.get(SomeClass.class);
		SomeClass someObject = new SomeClass();
		System.out.println(someObject.toString()+access.newInstance());
		System.out.println(someObject.toString()+access.newInstance());
		System.out.println(someObject.toString()+access.newInstance());
	}

	static public class SomeClass {
		public String name;
		public int intValue;
		protected float test1;
		Float test2;
		private String test3;

		public boolean equals(Object obj) {
			if (this == obj)
				return true;
			if (obj == null)
				return false;
			if (getClass() != obj.getClass())
				return false;
			SomeClass other = (SomeClass) obj;
			if (intValue != other.intValue)
				return false;
			if (name == null) {
				if (other.name != null)
					return false;
			} else if (!name.equals(other.name))
				return false;
			if (Float.floatToIntBits(test1) != Float
					.floatToIntBits(other.test1))
				return false;
			if (test2 == null) {
				if (other.test2 != null)
					return false;
			} else if (!test2.equals(other.test2))
				return false;
			if (test3 == null) {
				if (other.test3 != null)
					return false;
			} else if (!test3.equals(other.test3))
				return false;
			return true;
		}
	}

	/**
	 * @param args
	 */
	public static void main(String[] args) {
		new ConstructorAccessExample().testNewInstance();
	}

}
