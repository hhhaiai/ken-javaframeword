package com.shine.DataBaseSource;

import com.shine.DataBaseSource.util.DeleteOptionList;
import com.shine.DataBaseSource.util.JndiArrayList;
import com.shine.DataBaseSource.util.SelectOptionList;
import com.shine.DataBaseSource.util.UpdateOptionList;

/**
 * 数据库实体类
 * 
 * @author viruscodecn@gmail.com
 * 
 */
public abstract class DBModel {

	// jndiList
	private JndiArrayList jndiArrayList;

	// 加载表名
	private String tableName;

	private SelectOptionList selectOptionList = new SelectOptionList();

	// 更新sql条件列表
	private UpdateOptionList updateOptionList = new UpdateOptionList();

	// 删除sql条件列表
	private DeleteOptionList deleteOptionList = new DeleteOptionList();

	public DBModel(String tableName, String... jndiList) {
		if (jndiArrayList == null)
			jndiArrayList = new JndiArrayList();
		else
			jndiArrayList.clear();

		this.tableName = tableName;
		for (String jndi : jndiList) {
			jndiArrayList.add(jndi);
		}
	}

	// /////////////////

	public abstract void putSelectAndOption(String optionSql);

	public abstract void putSelectOrOption(String optionSql);

	/**
	 * select每次加载1000行数据
	 */
	public abstract void select();

	/**
	 * select每次加载1000行数据,从startRow开始
	 */
	public abstract void select(int startRow);

	// /////////////////

	/**
	 * DBModel model=.... ; model.putUpdateAndOption("name=1"); int
	 * refectNum=model.update();
	 */
	public abstract void putUpdateAndOption(String optionSql);

	public abstract void putUpdateOrOption(String optionSql);

	public abstract int update();

	// /////////////////

	/**
	 * DBModel model=.... ; model.putDeleteAndOption("name=1"); int
	 * refectNum=model.delete();
	 */
	public abstract void putDeleteAndOption(String optionSql);

	public abstract void putDeleteOrOption(String optionSql);

	public abstract int delete();

	// /////////////////

	/**
	 * DBModel model=.... ; int refectNum=model.insert("1","2");
	 */
	public abstract int insert(String... values);
}
