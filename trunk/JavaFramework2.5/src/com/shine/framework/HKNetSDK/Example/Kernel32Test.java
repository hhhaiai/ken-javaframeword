package com.shine.framework.HKNetSDK.Example;

import com.sun.jna.Native;  
import com.sun.jna.Structure;  
import com.sun.jna.win32.StdCallLibrary;  
  
/** 
 * 测试JNA是否可以使用结构体调用dll 
 * User: xiaoming 
 * Email: xiaoming8484@gmail.com 
 * Date: 11-8-21 
 * Time: 下午2:13 
 */  
public class Kernel32Test {  
  
    /** 
     * 声明dll的接口 
     */  
    public interface Kernel32 extends StdCallLibrary {  
        Kernel32 INSTANCE = (Kernel32) Native.loadLibrary("kernel32", Kernel32.class);  
        void GetSystemTime(SYSTEMTIME result);  
    }  
  
    /** 
     * 定义与dll结构体对应的对象 
     */  
    public static class SYSTEMTIME extends Structure {  
        public short wYear;  
        public short wMonth;  
        public short wDayOfWeek;  
        public short wDay;  
        public short wHour;  
        public short wMinute;  
        public short wSecond;  
        public short wMilliseconds;  
  
    }   
  
    /** 
     * 结构体的定义名称不一定要与c的保持一致，只需要数据结构一致即可 
     */  
    public static class Input extends Structure {  
        public SYSTEMTIME systemtime;  
    }  
  
    public static void main(String args[]) {  
        Kernel32 lib = Kernel32.INSTANCE;  
        SYSTEMTIME time = new SYSTEMTIME();  
        Input input = new Input();  
        lib.GetSystemTime(time);  
        //lib.GetSystemTime(input);  
  
        System.out.println("Today's integer value is " + time.wDay);  
        System.out.println("Year's integer value is " + time.wYear);  
//        System.out.println("Today's integer value is " + input.systemtime.wDay);  
    }  
}  
