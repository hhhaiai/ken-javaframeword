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
	 * 修改单元格数据
	 * 
	 * @param sheet
	 * @param row
	 * @param colName
	 * @param value
	 * @return
	 */
	public boolean update(int sheet,int row, String colName, String value) {
		return false;
	}

	/**
	 * 修改行数据
	 * 
	 * @param sheet
	 * @param row
	 * @param values
	 * @return
	 */
	public boolean updateRow(int sheet,int row, String... values) {
		return false;
	}

	/**
	 * 插入行数据
	 * 
	 * @param sheet
	 * @param values
	 * @return
	 */
	public boolean insertRow(int sheet,String... values) {
		return false;
	}

	/**
	 * 删除行
	 * 
	 * @param sheet
	 * @param row
	 * @return
	 */
	public boolean deleteRow(int sheet,int row) {
		return false;
	}

	/**
	 * 删除指定行 key=value
	 * 
	 * @param sheet
	 * @param key
	 * @param value
	 * @return
	 */
	public boolean delete(int sheet,String key, String value) {
		return false;
	}

	/**
	 * 获取所有数据
	 *
	 * @param sheet
	 * @return
	 */
	public List<Map> getAllData(int sheet) {
		return null;
	}

	/**
	 * 获取指定行列数据
	 * 
	 * @param sheet
	 * @param row
	 * @param key
	 * @return
	 */
	public String getData(int sheet,int row, String key) {
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
