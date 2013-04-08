package com.shine.framework.Memcached.utils;

import java.util.Collection;
import java.util.Map;
import java.util.Set;

import com.shine.framework.Memcached.MemCachedManager;

public class MemCacheMap implements Map<Object, Object> {

	private String clientName;

	public MemCacheMap(String clientName) {
		if (!MemCachedManager.getManager().checkCacheName(clientName)) {
			System.out.println("缓存" + clientName + "尚未初始化!!!!");
		} else
			this.clientName = clientName;
	}

	@Override
	public void clear() {
		// TODO Auto-generated method stub

	}

	@Override
	public boolean containsKey(Object key) {
		// TODO Auto-generated method stub
		return false;
	}

	@Override
	public boolean containsValue(Object value) {
		// TODO Auto-generated method stub
		return false;
	}

	@Override
	public Set<java.util.Map.Entry<Object, Object>> entrySet() {
		// TODO Auto-generated method stub
		return null;
	}

	@Override
	public Object get(Object key) {
		return MemCachedManager.getManager().get(clientName,
				String.valueOf(key));
	}

	@Override
	public boolean isEmpty() {
		// TODO Auto-generated method stub
		return false;
	}

	@Override
	public Set<Object> keySet() {
		// TODO Auto-generated method stub
		return null;
	}

	@Override
	public Object put(Object key, Object value) {
		return MemCachedManager.getManager().add(clientName,
				String.valueOf(key), value);
	}

	@Override
	public void putAll(Map<? extends Object, ? extends Object> m) {
		// TODO Auto-generated method stub

	}

	@Override
	public Object remove(Object key) {
		// TODO Auto-generated method stub
		return null;
	}

	@Override
	public int size() {
		// TODO Auto-generated method stub
		return 0;
	}

	@Override
	public Collection<Object> values() {
		// TODO Auto-generated method stub
		return null;
	}

}
