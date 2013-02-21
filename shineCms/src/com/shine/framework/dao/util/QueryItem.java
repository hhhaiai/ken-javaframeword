package com.shine.framework.dao.util;

import java.text.SimpleDateFormat;

import com.shine.platform.logger.LoggerFactory;

/**
 * 查询条件
 * @author JiangKunpeng 2011.05.06
 * @version 2013.02.21
 */
public class QueryItem extends Joinable{
	private String value;		//参数值
	private String operator;	//运算符
	private String type;		//字段类型
	
	public QueryItem(){
	}
	
	public QueryItem(String name,String value,String operator,String type){
		setName(name);
		this.value = value;
		this.operator = operator;
		this.type = type;
	}
	
	public String getValue() {
		return value;
	}
	public void setValue(String value) {
		this.value = value;
	}
	public String getType() {
		return type;
	}
	public void setType(String type) {
		if(type!=null)
			this.type = type.toLowerCase();
	}
	public String getOperator() {
		return operator;
	}
	public void setOperator(String operator) {
		if(operator!=null)
			this.operator = operator.toLowerCase();
	}
	
	/**
	 * 获取查询条件SQL语句(以问号为通配符,如: "and name=?")
	 * @return
	 */
	public String getCriterionSQL(){
		return getOperatorSQL() + "?";
	}
	
	/**
	 * 获取查询条件SQL语句(以名称为通配符,如:"name=:name")
	 * @return
	 */
	public String getCriterionSQLWithName(){
		return getOperatorSQL() + ":" + name;
	}
	
	/**
	 * 拼接运算SQL
	 * @return
	 */
	private String getOperatorSQL(){
		String sql = null;
		if(EQ.equals(operator))
			sql = " = ";
		else if(NE.equals(operator))
			sql = " != ";
		else if(GT.equals(operator))
			sql = " > ";
		else if(GE.equals(operator))
			sql = " >= ";
		else if(LT.equals(operator))
			sql = " < ";
		else if(LE.equals(operator))
			sql = " <= ";
		else if(LIKE.equals(operator))
			sql = " like ";
		else
			sql = " = ";
		return sql;
	}
	
	/**
	 * 获取查询条件值
	 * @return
	 */
	public Object getCriterionValue(){
		Object o = null;
		try{
			if(type==null||"".equals(type))
				o = value;
			else if(STRING.equals(type)){
				if(LIKE.equals(operator))
					o = "%"+value+"%";
				else
					o = value;
			}else if(INTEGER.equals(type))
				o = Integer.parseInt(value.toString());
			else if(LONG.equals(type))
				o = Long.parseLong(value.toString());
			else if(DOUBLE.equals(type))
				o = Double.parseDouble(value.toString());
			else if(FLOAT.equals(type))
				o = Float.parseFloat(value.toString());
			else if(DATE.equals(type))
				o = DATEFORMAT.parse(value.toString());
			else if(DATETIME.equals(type))
				o = DATETIMEFORMAT.parse(value.toString());
			else if(type.startsWith(DATEOTHER)){
				String pattern = type.substring(DATEOTHER.length());
				synchronized(DATEOTHERFORMAT){
					DATEOTHERFORMAT.applyPattern(pattern);
					o = DATEOTHERFORMAT.parse(value);
				}
			}
			else
				o = value;
		}catch(Exception e){
			o = value;
			LoggerFactory.getLogger(getClass()).error("条件查询值解析异常", e);
			e.printStackTrace();
		}
		return o;
	}
	
	//对比运算符
	public static final String EQ = "EQ";		//等于
	public static final String NE = "NE";		//不等于
	public static final String GT = "GT";		//大于
	public static final String GE = "GE";		//大于等于
	public static final String LT = "LT";		//小于
	public static final String LE = "LE";		//小于等于
	public static final String LIKE = "LK";		//模糊匹配
	
	//值类型
	public static final String STRING = "S";
	public static final String INTEGER = "I";
	public static final String LONG = "L";
	public static final String DOUBLE = "D";
	public static final String FLOAT = "F";
	public static final String DATE = "DATE";			//yyyy-MM-dd
	public static final String DATETIME = "DT";		//yyyy-MM-dd HH:mm:ss
	public static final String DATEOTHER = "DT_";		//自定义格式时间 如：date_yyyy年MM月dd日
	
	private static final SimpleDateFormat DATEFORMAT = new SimpleDateFormat("yyyy-MM-dd");
	private static final SimpleDateFormat DATETIMEFORMAT = new SimpleDateFormat("yyyy-MM-dd HH:mm:ss");
	private static final SimpleDateFormat DATEOTHERFORMAT = new SimpleDateFormat();
}
