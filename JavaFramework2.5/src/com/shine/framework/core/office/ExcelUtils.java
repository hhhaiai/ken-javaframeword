package com.shine.framework.core.office;

import java.io.FileInputStream;
import java.io.FileNotFoundException;
import java.io.IOException;
import java.util.List;
import java.util.Map;

import org.apache.poi.hssf.usermodel.HSSFCell;
import org.apache.poi.hssf.usermodel.HSSFRow;
import org.apache.poi.hssf.usermodel.HSSFSheet;
import org.apache.poi.hssf.usermodel.HSSFWorkbook;

public class ExcelUtils {

	/**
	 * 建立excelFile
	 * 
	 * @param excelPath
	 * @return
	 */
	public static boolean createExcelFile(String excelPath) {
		return false;
	}
	
	
	/**
	 * 清楚指定内容
	 * 
	 * @param excelPath
	 * @param sheet
	 * @return
	 */
	public static boolean cleanExcelFile(String excelPath,int sheet){
		return false;
	}
	
	/**
	 * 获取指定工作簿行数
	 * 
	 * @param excelPath
	 * @param sheet
	 * @return
	 */
	public static int getExcelSheetRowNum(String excelPath,int sheet){
		return 0;
	}

	/**
	 * 修改单元格数据
	 * 
	 * @excelPath
	 * @param sheet
	 * @param row
	 * @param colName
	 * @param value
	 * @return
	 */
	public static boolean update(String excelPath, int sheet, int row,
			String colName, String value) {
		return false;
	}

	/**
	 * 修改行数据
	 * 
	 * @excelPath
	 * @param sheet
	 * @param row
	 * @param values
	 * @return
	 */
	public static boolean updateRow(String excelPath, int sheet, int row,
			String... values) {
		return false;
	}

	/**
	 * 插入行数据
	 * 
	 * @excelPath
	 * @param sheet
	 * @param values
	 * @return
	 */
	public static boolean insertRow(String excelPath, int sheet,
			String... values) {
		return false;
	}

	/**
	 * 删除行
	 * 
	 * @excelPath
	 * @param sheet
	 * @param row
	 * @return
	 */
	public static boolean deleteRow(String excelPath, int sheet, int row) {
		return false;
	}

	/**
	 * 删除指定行 key=value
	 * 
	 * @excelPath
	 * @param sheet
	 * @param key
	 * @param value
	 * @return
	 */
	public static boolean delete(String excelPath, int sheet, String key,
			String value) {
		return false;
	}

	/**
	 * 获取所有数据
	 * 
	 * @excelPath
	 * @param sheet
	 * @return
	 */
	public static List<Map> getAllData(String excelPath, int sheet) {
		return null;
	}

	/**
	 * 获取指定行列数据
	 * 
	 * @excelPath
	 * @param sheet
	 * @param row
	 * @param key
	 * @return
	 */
	public static String getData(String excelPath, int sheet, int row,
			String key) {
		return null;
	}

	/**
	 * @param filePath
	 *            文件路径
	 * @return 读出的Excel的内容
	 */
	public String getTextFromExcel(String filePath) {
		StringBuffer buff = new StringBuffer();
		try {
			// 创建对Excel工作簿文件的引用
			HSSFWorkbook wb = new HSSFWorkbook(new FileInputStream(filePath));
			// 创建对工作表的引用。
			for (int numSheets = 0; numSheets < wb.getNumberOfSheets(); numSheets++) {
				if (null != wb.getSheetAt(numSheets)) {
					HSSFSheet aSheet = wb.getSheetAt(numSheets);// 获得一个sheet
					for (int rowNumOfSheet = 0; rowNumOfSheet <= aSheet
							.getLastRowNum(); rowNumOfSheet++) {
						if (null != aSheet.getRow(rowNumOfSheet)) {
							HSSFRow aRow = aSheet.getRow(rowNumOfSheet); // 获得一个行
							for (int cellNumOfRow = 0; cellNumOfRow <= aRow
									.getLastCellNum(); cellNumOfRow++) {
								if (null != aRow.getCell(cellNumOfRow)) {
									HSSFCell aCell = aRow.getCell(cellNumOfRow);// 获得列值
									switch (aCell.getCellType()) {
									case HSSFCell.CELL_TYPE_FORMULA:
										break;
									case HSSFCell.CELL_TYPE_NUMERIC:
										buff
												.append(
														aCell
																.getNumericCellValue())
												.append('\t');
										break;
									case HSSFCell.CELL_TYPE_STRING:
										buff.append(aCell.getStringCellValue())
												.append('\t');
										break;
									}
								}
							}
							buff.append('\n');
						}
					}
				}
			}
		} catch (FileNotFoundException e) {
			e.printStackTrace();
		} catch (IOException e) {
			e.printStackTrace();
		}

		return buff.toString();
	}

	/**
	 * @param args
	 */
	public static void main(String[] args) {
		// TODO Auto-generated method stub

	}

}
