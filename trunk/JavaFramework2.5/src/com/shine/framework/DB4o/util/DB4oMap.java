package com.shine.framework.DB4o.util;

import java.util.ArrayList;
import java.util.List;

import com.db4o.Db4o;
import com.db4o.ObjectContainer;
import com.db4o.ObjectSet;
import com.shine.framework.DB4o.model.DB4oBaseModel;

public class DB4oMap {
	private ObjectContainer db = null;

	public DB4oMap() {

	}

	public DB4oMap(String filePath) {
		db = Db4o.openFile(filePath);
	}

	public void put(String key, Object o) {
		DB4oBaseModel model = new DB4oBaseModel(key, o);
		db.store(model);
		db.commit();
	}

	public List get(String key) {
		// Find all the Brians
		ObjectSet objects = db.queryByExample(new DB4oBaseModel(key, null));
		List<Object> list = new ArrayList<Object>();
		while (objects.hasNext())
			list.add(((DB4oBaseModel) objects.next()).getO());
		return list;
	}
}
