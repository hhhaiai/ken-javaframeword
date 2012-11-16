package com.shine.framework.core.office;

import java.io.File;
import java.io.FileInputStream;
import java.io.FileNotFoundException;
import java.io.IOException;
import org.apache.poi.hwpf.extractor.WordExtractor;

public class WordUtils {
	/**
	 * @param filePath
	 *            文件路径
	 * @return 读出的Word的内容
	 */
	public static String getTextFromWord(String filePath) {
		String result = null;
		File file = new File(filePath);
		FileInputStream fis = null;
		try {
			fis = new FileInputStream(file);
			WordExtractor wordExtractor = new WordExtractor(fis);
			result = wordExtractor.getText();
		} catch (FileNotFoundException e) {
			e.printStackTrace();
		} catch (IOException e) {
			e.printStackTrace();
		} finally {
			try {
				if (fis != null)
					fis.close();
			} catch (Exception e) {
				e.printStackTrace();
			}
		}
		return result;
	}

	public static void main(String args[]) {
		System.out
				.println(WordUtils
						.getTextFromWord("C:\\Users\\123\\Desktop\\IT source trace 改进建议II.doc"));
	}
}
