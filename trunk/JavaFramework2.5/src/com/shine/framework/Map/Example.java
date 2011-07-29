package com.shine.framework.Map;

public class Example {
	public static void main(String args[]) {
		// System.out
		// .println(MapManager.getGoogleMapXmlCn(38.9146943, 121.612382));

		//System.out.println(MapManager.getLatlng("美国", ""));
		
		String re[]=MapManager.repairLatlng(38.9146943, 121.612382);
		System.out.println();
	}
}
