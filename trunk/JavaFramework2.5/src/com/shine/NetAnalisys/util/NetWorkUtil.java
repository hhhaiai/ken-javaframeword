package com.shine.NetAnalisys.util;

import java.util.ArrayList;
import java.util.List;
import java.util.StringTokenizer;

public class NetWorkUtil {
	private NetWorkUtil() {
	}
	
	public static void main(String[] args) {
		List<String[]> ips = NetWorkUtil.seperateIpRange("192.168.1.1", "192.168.1.8", 7);
		System.out.println(ips);
	}
	
	/**
	 * 将开始IP和结束IP拆开成各IP数组
	 * 
	 * @param  startIp 开始IP
	 * @param  endIp 结束IP
	 * @return 属于该IP范围内的所有IP
	 */
	public static List<String> seperateIpList(String startIp, String endIp) {
		List<String> ipRange = new ArrayList<String>();
		long startIpLong = ipToLong(startIp);
		long endIpLong = ipToLong(endIp);
		if (startIpLong != -1 && startIpLong <= endIpLong) {
			for (long i = startIpLong; i <= endIpLong; i++) {
				String ip = longToIp(i);
				ipRange.add(ip);
			}
		}
		return ipRange;
	}
	
	/**
     * 将标准IP字符串转换成长整数
     *
     * @param  ipAddress IP地址
     * @return 整型IP
     */
    public static long ipToLong(final String ipAddress) {               
       int[] ipSegment = splitIp(ipAddress);
       if (ipSegment==null) {
    	   return -1;
       }
       long longIp = 0;
       int k = 24;
       for(int i = 0; i < ipSegment.length; i++){              
           longIp += ((long)ipSegment[i]) << k;
           k -= 8;        
       }
       return longIp;
    }

    /**
     * 将整型IP转换成标准IP字符串
     * 
     * @param  ip 整型IP
     * @return 标准IP字符串
     */
	public static String longToIp(final long ip){
        int b[] = new int[4];
        b[0] = (int)(ip >> 24 & 255L);
        b[1] = (int)(ip >> 16 & 255L);
        b[2] = (int)(ip >> 8 & 255L);
        b[3] = (int)(ip & 255L);
        return b[0] + "." + b[1] + "." + b[2] + "." + b[3];
    }
	
	/**
	 * 将IP地址拆分成不同区域
	 * 
	 * @param  ipAddress IP地址
	 * @return IP区域
	 */
	public static int[] splitIp(final String ipAddress){
	    if (!isIpValid(ipAddress)) {
	    	return null;
	    }
	    int[] ipSegment = new int[4];
			
	    StringTokenizer st = new StringTokenizer(ipAddress, ".");
		for (int i=0; i<4; i++) {
		   	ipSegment[i] = Integer.parseInt(st.nextToken());
		}
	    return ipSegment;    
	 }
	
	/**
	 * 将开始IP和结束IP拆开成各IP数组
	 * 
	 * @param  startIp 开始IP
	 * @param  endIp 结束IP
	 * @return 属于该IP范围内的所有IP
	 */
	public static List<String[]> seperateIpRange(String startIp, String endIp) {
		return seperateIpRange(startIp, endIp, 10);
	}
	
	/**
	 * 将开始IP和结束IP拆开成各IP数组
	 * 
	 * @param  startIp 开始IP
	 * @param  endIp 结束IP
	 * @param  subsection IP分段数
	 * @return 属于该IP范围内的所有IP
	 */
	public static List<String[]> seperateIpRange(String startIp, String endIp, long subsection) {
		List<String[]> ipRangeList = new ArrayList<String[]>();
		long startIpLong = ipToLong(startIp);
		long endIpLong = ipToLong(endIp);
		// 无效参数直接返回
		if (startIpLong == -1 || endIpLong == -1 || subsection <= 1) {
			return ipRangeList;
		}
		// 对各IP进行分组
		long ipRange = endIpLong - startIpLong + 1;
		if (ipRange > subsection) {
			for (long i = startIpLong; i <= endIpLong; i += subsection) {
				String[] ips = new String[2];
				ips[0] = longToIp(i);
				long ip = (i + subsection - 1) > endIpLong ? endIpLong : (i + subsection - 1);
				ips[1] = longToIp(ip);
				ipRangeList.add(ips);
			}
		} else {
			String[] ips = new String[2];
			ips[0] = startIp;
			ips[1] = endIp;
			ipRangeList.add(ips);
		}
		return ipRangeList;
	}
	
	/**
	 * 拆分IP端口
	 */
	public static List<String[]> seperateIpPort(String ip, int minPort, int maxPort) {
		return seperateIpPort(ip, minPort, maxPort, 10);
	}
	
	/**
	 * 拆分IP端口
	 */
	public static List<String[]> seperateIpPort(String ip, int minPort, int maxPort, int subsection) {
		List<String[]> ipPortList = new ArrayList<String[]>();
		// 无效参数直接返回
		if (minPort < 0 || maxPort > 65535 || minPort > maxPort) {
			return ipPortList;
		}
		// 对各端口进行分组
		int ipRange = maxPort - minPort + 1;
		if (ipRange > subsection) {
			for (int i = minPort; i <= maxPort; i += subsection) {
				String[] ports = new String[3];
				ports[0] = ip;
				ports[1] = String.valueOf(i);
				int port = (i + subsection - 1) > maxPort ? maxPort : (i + subsection - 1);
				ports[2] = String.valueOf(port);
				ipPortList.add(ports);
			}
		} else {
			String[] ports = new String[2];
			ports[0] = ip;
			ports[1] = String.valueOf(minPort);
			ports[2] = String.valueOf(maxPort);
			ipPortList.add(ports);
		}
		return ipPortList;
	}
    
	/**
     * 判断IP地址是否有效
     * 
     * @param  ipAddress IP地址
     * @return 有效IP返回true
     */
    public static boolean isIpValid(final String ipAddress){
        boolean isValid = true;
    	try{
    		StringTokenizer st = new StringTokenizer(ipAddress,".");
    		int len = st.countTokens();
		    if (len!=4) {
		    	return false;
		    }
		    int ipSegment = 0;
		    for(int i=0;i<len;i++){
		    	ipSegment = Integer.parseInt(st.nextToken());
		    	if(ipSegment < 0 || ipSegment > 255){
		    		isValid = false; 
		    	  	break;
		    	}
		    }		    
		} catch (Exception e) {    		
    		return false;
		}
    	return isValid;
    }
    
    /**
	 * 判断IP地址是否在有效IP范围内
	 * 
	 * @param  ipAddress IP地址
	 * @param  startIp 开始IP
	 * @param  endIp 结束IP
	 * @return 有效返回true
	 */
	public static boolean ipInRange(String ip, String startIp, String endIp) {		
		long ipLong = ipToLong(ip);
		long startIpLong = ipToLong(startIp);
		long endIpLong = ipToLong(endIp);
		
        if (ipLong>=startIpLong && ipLong<=endIpLong) {
            return true;
        }
        return false;
	}
	
	/**
	 * 判断IP地址是否在有效IP范围内
	 * 
	 * @param  ipAddress IP地址
	 * @param  startIp 开始IP
	 * @param  endIp 结束IP
	 * @return 有效返回true
	 */
	public static boolean ipInRange(long ip, long startIp, long endIp){
        if (ip >= startIp && ip <= endIp) {
            return true;
        }
        return false;
	}
}
