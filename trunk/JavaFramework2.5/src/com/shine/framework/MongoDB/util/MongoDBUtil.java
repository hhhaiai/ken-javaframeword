package com.shine.framework.MongoDB.util;

import java.util.ArrayList;
import java.util.List;

import com.mongodb.DBCursor;

/**
 * 
 * 
 * @author viruscodecn@gmail.com
 * 
 */
public class MongoDBUtil {
	public List<String> getCollection(DBCursor cur, int start, int size) {
		List<String> list = new ArrayList<String>();
		cur.skip(start).limit(size);
		while (cur.hasNext()) {
			list.add(cur.next().toString());
		}
		return list;
	}
}
