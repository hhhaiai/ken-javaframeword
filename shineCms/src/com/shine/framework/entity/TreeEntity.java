package com.shine.framework.entity;

/**
 * 树结构实体接口
 * @author JiangKunpeng	2013.03.06
 * @version 2013.03.06
 *
 */
public interface TreeEntity extends Cloneable{
	//树ID
	public void setId(Integer id);
	public Integer getId();
	//上层节点ID
	public void setPid(Integer id);
	public Integer getPid();
	//树编码
	public void setTreeCode(String treeCode);
	public String getTreeCode();
	//public的克隆方法
	public Object clone();
}
