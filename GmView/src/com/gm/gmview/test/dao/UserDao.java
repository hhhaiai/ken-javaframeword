package com.gm.gmview.test.dao;

public interface UserDao {
	/*用户登录 
     * pram:userName,passWord 
     * return:boolean 
     */  
    public boolean login(String userName,String passWord); 
}
