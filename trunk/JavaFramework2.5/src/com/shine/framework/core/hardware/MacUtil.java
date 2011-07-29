package com.shine.framework.core.hardware;

import java.io.BufferedReader;
import java.io.File;
import java.io.FileWriter;
import java.io.InputStreamReader;

public class MacUtil {
	/**
	 * 获取网卡序列号
	 * @return
	 */
	public static String getMACNumber() {
		String result = "";
		String vbs = null;
		try {
			File file = File.createTempFile("realhowto", ".vbs");
			file.deleteOnExit();
			FileWriter fw = new FileWriter(file);
			BufferedReader input = null;
			Process p = null;
			vbs = "Set objWMIService = GetObject(\"winmgmts:\\\\.\\root\\cimv2\")\n"
					+ "Set colItems = objWMIService.ExecQuery(\"SELECT MACAddress FROM Win32_NetworkAdapter WHERE ((MACAddress Is Not NULL) AND (ManufaCturer <> 'MiCrosoft'))\") \n"
					+ "For Each objItem in colItems \n"
					+ "Wscript.Echo objItem.MACAddress \n" + "Next \n";
			fw.write(vbs);
			fw.close();
			p = Runtime.getRuntime().exec("cscript //NoLogo " + file.getPath());
			input = new BufferedReader(
					new InputStreamReader(p.getInputStream()));
			String line;
			while ((line = input.readLine()) != null) {
				result += line+"\n";
			}
			input.close();
		} catch (Exception ex) {
			ex.printStackTrace();
		}
		return result;
	}

	public static void main(String args[]) {
		System.out.println(getMACNumber());
	}
}
