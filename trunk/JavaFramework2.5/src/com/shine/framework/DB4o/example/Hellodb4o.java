package com.shine.framework.DB4o.example;

import com.db4o.Db4o;
import com.db4o.ObjectContainer;
import com.db4o.ObjectSet;

public class Hellodb4o {
	public static void main(String[] args) throws Exception {
		ObjectContainer db = null;
		try {
			db = Db4o.openFile
			("persons.data");

			Person brian = new Person("Brian", "Goetz", 39);
			Person jason = new Person("Jason", "Hunter", 35);
			Person clinton = new Person("Brian", "Sletten", 38);
			Person david = new Person("David", "Geary", 55);
			Person glenn = new Person("Glenn", "Vanderberg", 40);
			Person neal = new Person("Neal", "Ford", 39);

			db.store(brian);
			db.store(jason);
			db.store(clinton);
			db.store(david);
			db.store(glenn);
			db.store(neal);

			db.commit();

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
