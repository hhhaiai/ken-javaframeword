package com.shine.framework.entity;


/**
 * ID生成器接口
 * @author JiangKunpeng	2013.03.05
 * @version 2013.03.05
 *
 */
public interface IDGenerator {
	public int getIntID(String className,String field);
}
