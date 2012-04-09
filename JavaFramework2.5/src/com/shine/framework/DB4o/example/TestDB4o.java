package com.shine.framework.DB4o.example;

import com.db4o.Db4o;
import com.db4o.ObjectContainer;
import com.db4o.ObjectSet;

public class TestDB4o {

	/**
	 * @param args
	 */
	public static void main(String[] args) throws Exception {
		ObjectContainer db = null;
		try {
			db = Db4o.openFile("persons.data");

			Person data =null;
			//for (int i = 0; i < 10000; i++) {
				for (int j = 0; j < 10000; j++) {
					data = new Person("aa", "Goetz", 39);
					db.store(data);	
				}
				db.commit();
			//}

//			Person brian = new Person("Brian", "Goetz", 39);
//			db.store(brian);
//
//			db.commit();
			
			System.out.println("插入完成");

			// Find all the Brians
			ObjectSet brians = db.queryByExample(new Person("Brian", null, 0));
			while (brians.hasNext())
				System.out.println(brians.next());
		} finally {
			if (db != null)
				db.close();
		}

	}

}
