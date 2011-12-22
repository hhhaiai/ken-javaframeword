package com.shine.framework.MibBrowser;

import java.io.File;
import java.io.IOException;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.Iterator;
import java.util.List;

import net.percederberg.mibble.Mib;
import net.percederberg.mibble.MibLoader;
import net.percederberg.mibble.MibLoaderException;
import net.percederberg.mibble.MibSymbol;
import net.percederberg.mibble.MibValue;
import net.percederberg.mibble.MibValueSymbol;
import net.percederberg.mibble.value.ObjectIdentifierValue;

import com.shine.framework.MibBrowser.model.MibModel;

/**
 * mib 文件分析类库
 * 
 * @author fjz 2011.10.08
 * 
 */
public class MibBrowserUtils {
	/**
	 * 获取所有mib
	 * @param mibfilePath
	 * @return
	 */
	public static List<MibModel> getAllOid(String mibfilePath) {
		File file=checkFile(mibfilePath);
		if(file==null)
			return null;
		MibModel map ;
		Mib mib;
		List<MibModel> list=new ArrayList<MibModel>();
		try {
			mib = loadMib(file);
		    Iterator   iter = mib.getAllSymbols().iterator();
		    MibSymbol  symbol;
		    MibValue   value;
		    while (iter.hasNext()) {
		        symbol = (MibSymbol) iter.next();
		        value = extractOid(symbol);
		        if (value != null) {
		        	map=new MibModel();
		        	map.setName(symbol.getName());
		        	map.setOid(value.toString());
		        	map.setDetail(symbol.toString());
		        	list.add(map);
		        }
		    }
		} catch (MibLoaderException e) {
			e.printStackTrace();
		} catch (IOException e) {
			e.printStackTrace();
		}
		return list;
	}
	
	/**
	 * 检查该oid是否属于mib
	 * 
	 * @param mibfilePath
	 * @param oid
	 * @return
	 */
	public static boolean checkOid(String mibfilePath, String oid) {
		List<MibModel> list=getAllOid(mibfilePath);
		return checkOid(list,oid);
	}
	/**
	 * 检查该oid是否属于mib
	 * @param list
	 * @param oid
	 * @return
	 */
	public static boolean checkOid(List<MibModel> list, String oid){
		if(list==null)
			return false;
		for (MibModel mibModel : list) {
			if(mibModel.getOid().equals(oid))
				return true;
		}
		return false;
	}
	/**
	 * 获取oid信息
	 * 
	 * @param mibfilePath
	 * @param oid
	 * @return
	 */
	public static MibModel getOidInfo(String mibfilePath, String oid) {
		List<MibModel> list=getAllOid(mibfilePath);
		return getOidInfo(list,oid);
	}
	/**
	 * 获取oid信息
	 * 
	 * @param mibfilePath
	 * @param oid
	 * @return
	 */
	public static MibModel getOidInfo(List<MibModel> list, String oid) {
		//System.out.println(list.size());
		if(list==null)
			return null;
		for (MibModel mibModel : list) {
			if(mibModel.getOid().equals(oid))
				return mibModel;
		}
		return null;
	}
	/**
	 * 根据文件提取出mib
	 * @param file地址
	 * @return
	 * @throws MibLoaderException
	 * @throws IOException
	 */
	public static Mib loadMib(File file) throws MibLoaderException, IOException {
	    MibLoader  loader = new MibLoader();
	    loader.addDir(file.getParentFile());
	    return loader.load(file);
	}
	/**
	 * 提取oid出来
	 * @param symbol
	 * @return
	 */
	public static ObjectIdentifierValue extractOid(MibSymbol symbol) {
	    MibValue  value;
	    if (symbol instanceof MibValueSymbol) {
	        value = ((MibValueSymbol) symbol).getValue();
	        if (value instanceof ObjectIdentifierValue) {
	            return (ObjectIdentifierValue) value;
	        }
	    }
	    return null;
	}
	/**
	 * 检测文件是否文件，存不存在
	 * @param mibfilePath
	 * @return
	 */
	public static File checkFile(String mibfilePath){
		File file=new File(mibfilePath);
		if(!file.exists())
			return null;
		if(!file.isFile())
			return null;
		return file;
	}
}
