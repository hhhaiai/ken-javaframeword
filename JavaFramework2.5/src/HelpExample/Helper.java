package HelpExample;

import com.shine.framework.core.util.FileResult;
import com.shine.framework.core.util.FileUtil;

public class Helper {

	/**
	 * @param args
	 */
	public static void main(String[] args) {
		FileResult result = new FileResult("E:\\下载\\复件 (2) 客户电话.txt");
		FileUtil.createFile("E:\\下载\\复件 (3) 客户电话.txt");
		FileUtil.cleanFile("E:\\下载\\复件 (3) 客户电话.txt");
		int j = 0;
		StringBuffer buffer=new StringBuffer();
		while (result.next() != 0) {
			for (int i = 0; i < result.size(); i++) {
				System.out.println(result.get(i));
	
				
				if (j == 9) {
					buffer.append("\r\n" + result.get(i));
					j = 0;
				} else {
					buffer.append(result.get(i));
				}
				j++;
			}
		}
		FileUtil.writeFile("E:\\下载\\复件 (3) 客户电话.txt", buffer.toString());

	}
}
