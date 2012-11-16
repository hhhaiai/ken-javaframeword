package com.shine.framework.core.office;

import java.io.FileInputStream;
import java.io.FileNotFoundException;
import java.io.FileOutputStream;
import java.io.IOException;
import java.util.ArrayList;
import java.util.List;

import org.apache.poi.hssf.usermodel.HSSFCell;
import org.apache.poi.hssf.usermodel.HSSFCellStyle;
import org.apache.poi.hssf.usermodel.HSSFFont;
import org.apache.poi.hssf.usermodel.HSSFRow;
import org.apache.poi.hssf.usermodel.HSSFSheet;
import org.apache.poi.hssf.usermodel.HSSFWorkbook;

import com.shine.framework.core.util.FileUtil;

/**
 * Java操作Excel封装
 * 
 * @author Ken
 * @blog http://blog.csdn.net/arjick/article/details/8182484
 * 
 */
public class ExcelUtils {

	/**
	 * 建立excelFile
	 * 
	 * @param excelPath
	 * @return
	 */
	public static boolean createExcelFile(String excelPath) {
		HSSFWorkbook workbook = new HSSFWorkbook();
		return outputHSSFWorkbook(workbook, excelPath);
	}

	/**
	 * 插入新的工作表
	 * 
	 * @param excelPath
	 * @param sheetName
	 * @return
	 */
	public static boolean insertSheet(String excelPath, String sheetName) {
		try {
			if (FileUtil.checkFile(excelPath)) {
				HSSFWorkbook workbook = ExcelUtils.getHSSFWorkbook(excelPath);
				HSSFSheet sheet = workbook.createSheet(sheetName);
				return outputHSSFWorkbook(workbook, excelPath);
			} else {
				System.out.println(excelPath + ":文件不存在.....");
			}
			return false;
		} catch (Exception e) {
			e.printStackTrace();
		}
		return false;
	}

	/**
	 * 复制工作表
	 * 
	 * @param excelPath
	 * @param sheetName
	 * @param sheetNum
	 * @return
	 */
	public static boolean copySheet(String excelPath, String sheetName,
			int formSheetNum) {
		try {
			if (FileUtil.checkFile(excelPath)) {
				HSSFWorkbook workbook = ExcelUtils.getHSSFWorkbook(excelPath);
				if (!ExcelUtils.checkSheet(workbook, sheetName)) {
					workbook.cloneSheet(formSheetNum);
					workbook.setSheetName(workbook.getNumberOfSheets() - 1,
							sheetName);
					return outputHSSFWorkbook(workbook, excelPath);
				} else {
					System.out.println(excelPath + ":存在同名工作表" + sheetName
							+ ".....");
				}
			} else {
				System.out.println(excelPath + ":文件不存在.....");
			}
			return false;
		} catch (Exception e) {
			e.printStackTrace();
		}
		return false;
	}

	/**
	 * 插入或者更新单元格
	 * 
	 * @param excelPath
	 * @param sheetName
	 * @param rowNum
	 * @param cellNum
	 * @param value
	 * @return
	 */
	public static boolean insertOrUpdateCell(String excelPath,
			String sheetName, int rowNum, int cellNum, String value) {
		try {
			if (FileUtil.checkFile(excelPath)) {
				HSSFWorkbook wb = getHSSFWorkbook(excelPath);
				if (ExcelUtils.checkSheet(wb, sheetName)) {
					HSSFSheet sheet = wb.getSheet(sheetName);
					HSSFRow row = null;
					if (sheet.getLastRowNum() < rowNum) {
						row = sheet.createRow(rowNum);
					} else {
						row = sheet.getRow(rowNum);
					}
					HSSFCell cell = row.getCell(cellNum);
					cell.setCellType(HSSFCell.CELL_TYPE_STRING);
					cell.setCellValue(value);

					return outputHSSFWorkbook(wb, excelPath);
				} else {
					System.out.println(excelPath + "的" + sheetName
							+ ":工作表不存在.....");
				}
			} else {
				System.out.println(excelPath + ":文件不存在.....");
			}
			return false;
		} catch (Exception e) {
			e.printStackTrace();
		}
		return false;
	}

	/**
	 * 插入或者更新单元格
	 * 
	 * @param excelPath
	 * @param sheetIndex
	 * @param rowNum
	 * @param cellNum
	 * @param value
	 * @return
	 */
	public static boolean insertOrUpdateCell(String excelPath, int sheetIndex,
			int rowNum, int cellNum, String value) {
		try {
			if (FileUtil.checkFile(excelPath)) {
				HSSFWorkbook wb = getHSSFWorkbook(excelPath);
				if (ExcelUtils.checkSheet(wb, sheetIndex)) {
					HSSFSheet sheet = wb.getSheetAt(sheetIndex);
					HSSFRow row = null;
					if (sheet.getLastRowNum() < rowNum) {
						row = sheet.createRow(rowNum);
					} else {
						row = sheet.getRow(rowNum);
					}
					HSSFCell cell = row.getCell(cellNum);
					cell.setCellType(HSSFCell.CELL_TYPE_STRING);
					cell.setCellValue(value);

					return outputHSSFWorkbook(wb, excelPath);
				} else {
					System.out.println(excelPath + "的" + sheetIndex
							+ ":工作表不存在.....");
				}
			} else {
				System.out.println(excelPath + ":文件不存在.....");
			}
			return false;
		} catch (Exception e) {
			e.printStackTrace();
		}
		return false;
	}

	/**
	 * 
	 * @param excelPath
	 * @param sheetIndex
	 * @param rowNum
	 * @param cellNum
	 * @param value
	 * @param style
	 * @return
	 */
	public static boolean insertOrUpdateCell(String excelPath, int sheetIndex,
			int rowNum, int cellNum, String value, HSSFCellStyle style) {
		try {
			if (FileUtil.checkFile(excelPath)) {
				HSSFWorkbook wb = getHSSFWorkbook(excelPath);
				if (ExcelUtils.checkSheet(wb, sheetIndex)) {
					HSSFSheet sheet = wb.getSheetAt(sheetIndex);
					HSSFRow row = null;
					if (sheet.getLastRowNum() < rowNum) {
						row = sheet.createRow(rowNum);
					} else {
						row = sheet.getRow(rowNum);
					}
					HSSFCell cell = row.createCell(cellNum);
					// cell.setCellType(HSSFCell.CELL_TYPE_STRING);

					HSSFFont font = wb.createFont();
					font.setFontHeight((short) 18);

					HSSFCellStyle style1 = wb.createCellStyle();
					style1.setFont(font);
					// cell.setCellStyle(style1);
					cell.setCellValue(value);
					
					System.out.println(value);
					return outputHSSFWorkbook(wb, excelPath);
				} else {
					System.out.println("insertOrUpdateCell:" + excelPath + "的"
							+ sheetIndex + ":工作表不存在.....");
				}
			} else {
				System.out.println(excelPath + ":文件不存在.....");
			}
			return false;
		} catch (Exception e) {
			e.printStackTrace();
		}
		return false;
	}

	/**
	 * 插入指定行数据
	 * 
	 * @param excelPath
	 * @param sheetName
	 * @param rowNum
	 * @param values
	 * @return
	 */
	public static boolean insertOrUpadateRowDatas(String excelPath,
			String sheetName, int rowNum, String... values) {
		try {
			for (int i = 0; i < values.length; i++) {
				insertOrUpdateCell(excelPath, sheetName, rowNum, i, values[i]);
			}
			return false;
		} catch (Exception e) {
			e.printStackTrace();
		}
		return false;
	}

	/**
	 * 读入excel
	 * 
	 * @param excelPath
	 * @return
	 * @throws Exception
	 */
	public static HSSFWorkbook getHSSFWorkbook(String excelPath)
			throws Exception {
		FileInputStream fs = null;
		try {
			fs = new FileInputStream(excelPath);
			HSSFWorkbook wb = new HSSFWorkbook(fs);
			return wb;
		} catch (Exception e) {
			throw e;
		} finally {
			try {
				if (fs != null)
					fs.close();
			} catch (Exception e) {
				e.printStackTrace();
			}
		}
	}

	/**
	 * 输入Excel
	 * 
	 * @param wb
	 * @param excelPath
	 * @return
	 */
	private static boolean outputHSSFWorkbook(HSSFWorkbook wb, String excelPath) {
		FileOutputStream fOut = null;
		try {
			fOut = new FileOutputStream(excelPath);
			wb.write(fOut);
			fOut.flush();
			System.out.println(excelPath + ":文件生成...");
			return true;
		} catch (FileNotFoundException e) {
			// TODO 自动生成 catch 块
			e.printStackTrace();
		} catch (IOException e) {
			// TODO 自动生成 catch 块
			e.printStackTrace();
		} finally {
			try {
				if (fOut != null)
					fOut.close();
			} catch (Exception e) {
				e.printStackTrace();
			}
		}
		return false;

	}

	/**
	 * 检查是否存在工作表
	 * 
	 * @param excelPath
	 * @param sheetName
	 * @return
	 */
	public static boolean checkSheet(HSSFWorkbook wb, String sheetName) {
		try {
			for (int numSheets = 0; numSheets < wb.getNumberOfSheets(); numSheets++) {
				HSSFSheet sheet = wb.getSheetAt(numSheets);
				if (sheetName.equals(sheet.getSheetName())) {
					return true;
				}
			}
			return false;
		} catch (Exception e) {
			e.printStackTrace();
		}
		return false;
	}

	/**
	 * 检查是否存在表数量
	 * 
	 * @param wb
	 * @param sheetIndex
	 * @return
	 */
	public static boolean checkSheet(HSSFWorkbook wb, int sheetIndex) {
		try {
			if (wb.getNumberOfSheets() > sheetIndex)
				return true;
			return false;
		} catch (Exception e) {
			e.printStackTrace();
		}
		return false;
	}

	/**
	 * 清除指定excel的工作表所有内容
	 * 
	 * @param excelPath
	 * @param sheet
	 * @return
	 */
	public static boolean cleanExcelFile1(String excelPath, String sheetName) {
		try {
			if (FileUtil.checkFile(excelPath)) {
				HSSFWorkbook wb = getHSSFWorkbook(excelPath);
				if (ExcelUtils.checkSheet(wb, sheetName)) {
					HSSFSheet sheet = wb.getSheet(sheetName);
					for (int i = 0; i < sheet.getLastRowNum() + 1; i++) {
						if (sheet.getRow(i) != null)
							sheet.removeRow(sheet.getRow(i));
					}
					return outputHSSFWorkbook(wb, excelPath);
				} else {
					System.out.println("cleanExcelFile:" + excelPath + "的"
							+ sheetName + ":工作表不存在.....");
				}

			} else {
				System.out.println(excelPath + ":文件不存在.....");
			}
			return false;
		} catch (Exception e) {
			e.printStackTrace();
		}
		return false;
	}

	/**
	 * 获取指定工作簿行数
	 * 
	 * @param excelPath
	 * @param sheetName
	 * @return
	 */
	public static int getExcelSheetRowNum(String excelPath, String sheetName) {
		try {
			if (FileUtil.checkFile(excelPath)) {
				HSSFWorkbook wb = getHSSFWorkbook(excelPath);
				if (ExcelUtils.checkSheet(wb, sheetName)) {
					HSSFSheet sheet = wb.getSheet(sheetName);
					return sheet.getLastRowNum() + 1;
				} else {
					System.out.println("getExcelSheetRowNum:" + excelPath + "的"
							+ sheetName + ":工作表不存在.....");
				}

			} else {
				System.out.println(excelPath + ":文件不存在.....");
			}
			return 0;
		} catch (Exception e) {
			e.printStackTrace();
		}
		return 0;
	}

	/**
	 * 删除行
	 * 
	 * @excelPath
	 * @param sheetName
	 * @param row
	 * @return
	 */
	public static boolean deleteRow(String excelPath, String sheetName, int row) {
		if (getExcelSheetRowNum(excelPath, sheetName) > row) {
			try {
				if (FileUtil.checkFile(excelPath)) {
					HSSFWorkbook wb = getHSSFWorkbook(excelPath);
					if (ExcelUtils.checkSheet(wb, sheetName)) {
						HSSFSheet sheet = wb.getSheet(sheetName);
						if (sheet.getRow(row) != null)
							sheet.removeRow(sheet.getRow(row));
						return outputHSSFWorkbook(wb, excelPath);
					} else {
						System.out.println("deleteRow:" + excelPath + "的"
								+ sheetName + ":工作表不存在.....");
					}

				} else {
					System.out.println(excelPath + ":文件不存在.....");
				}
				return false;
			} catch (Exception e) {
				e.printStackTrace();
			}
		} else {
			System.out.println("不存在指定行");
			return true;
		}
		return false;
	}

	/**
	 * 获取所有数据
	 * 
	 * @excelPath
	 * @param sheetName
	 * @return
	 */
	public static List<List> getAllData(String excelPath, String sheetName) {
		try {
			List<List> list = new ArrayList<List>();
			if (FileUtil.checkFile(excelPath)) {
				HSSFWorkbook wb = getHSSFWorkbook(excelPath);
				if (ExcelUtils.checkSheet(wb, sheetName)) {
					HSSFSheet sheet = wb.getSheet(sheetName);
					for (int i = 0; i < sheet.getLastRowNum() + 1; i++) {
						if (sheet.getRow(i) != null) {
							List<String> rowList = new ArrayList<String>();
							HSSFRow aRow = sheet.getRow(i);
							for (int cellNumOfRow = 0; cellNumOfRow < aRow
									.getLastCellNum(); cellNumOfRow++) {
								if (null != aRow.getCell(cellNumOfRow)) {
									HSSFCell aCell = aRow.getCell(cellNumOfRow);// 获得列值
									if (aCell.getCellType() == HSSFCell.CELL_TYPE_STRING) {
										rowList.add(aCell.getStringCellValue());
									} else if (aCell.getCellType() == HSSFCell.CELL_TYPE_NUMERIC) {
										rowList.add(String.valueOf(
												aCell.getNumericCellValue())
												.replace(".0", ""));
									}
								} else {
									rowList.add("");
								}
							}
							list.add(rowList);
						}
					}
					return list;
				} else {
					System.out.println("getAllData:" + excelPath + "的"
							+ sheetName + ":工作表不存在.....");
				}
			} else {
				System.out.println(excelPath + ":文件不存在.....");
			}
		} catch (Exception e) {
			e.printStackTrace();
		}
		return null;
	}

	/**
	 * 读取部分数据
	 * 
	 * @param excelPath
	 * @param sheetName
	 * @param start
	 * @param end
	 * @return
	 */
	public static List<List> getDatas(String excelPath, String sheetName,
			int start, int end) {
		try {
			List<List> list = new ArrayList<List>();
			if (FileUtil.checkFile(excelPath)) {
				HSSFWorkbook wb = getHSSFWorkbook(excelPath);
				if (ExcelUtils.checkSheet(wb, sheetName)) {
					HSSFSheet sheet = wb.getSheet(sheetName);
					for (int i = start - 1; i < end; i++) {
						if (sheet.getRow(i) != null) {
							List<String> rowList = new ArrayList<String>();
							HSSFRow aRow = sheet.getRow(i);
							for (int cellNumOfRow = 0; cellNumOfRow < aRow
									.getLastCellNum(); cellNumOfRow++) {
								if (null != aRow.getCell(cellNumOfRow)) {
									HSSFCell aCell = aRow.getCell(cellNumOfRow);// 获得列值
									if (aCell.getCellType() == HSSFCell.CELL_TYPE_STRING) {
										rowList.add(aCell.getStringCellValue());
									} else if (aCell.getCellType() == HSSFCell.CELL_TYPE_NUMERIC) {
										rowList.add(String.valueOf(
												aCell.getNumericCellValue())
												.replace(".0", ""));
									}
								} else {
									rowList.add("");
								}
							}
							list.add(rowList);
						}
					}
					return list;
				} else {
					System.out.println("getDatas:" + excelPath + "的"
							+ sheetName + ":工作表不存在.....");
				}
			} else {
				System.out.println(excelPath + ":文件不存在.....");
			}
		} catch (Exception e) {
			e.printStackTrace();
		}
		return null;
	}

	/**
	 * 获取指定行列数据
	 * 
	 * @param excelPath
	 * @param sheetName
	 * @param row
	 * @param cellNum
	 * @return
	 */
	public static String getData(String excelPath, String sheetName, int row,
			int cellNum) {
		if (getExcelSheetRowNum(excelPath, sheetName) > row) {
			try {
				if (FileUtil.checkFile(excelPath)) {
					HSSFWorkbook wb = getHSSFWorkbook(excelPath);
					if (ExcelUtils.checkSheet(wb, sheetName)) {
						HSSFSheet sheet = wb.getSheet(sheetName);
						HSSFCell aCell = sheet.getRow(row).getCell(cellNum);
						if (aCell != null)
							return aCell.getStringCellValue();
					} else {
						System.out.println("getData" + excelPath + "的"
								+ sheetName + ":工作表不存在.....");
					}
				} else {
					System.out.println(excelPath + ":文件不存在.....");
				}
			} catch (Exception e) {
				e.printStackTrace();
			}
		}
		return null;
	}

	/**
	 * @param args
	 */
	public static void main(String[] args) {
		// 创建新的excle
		// ExcelUtils.createExcelFile("D:\\test.xls");

		// 插入新的工作表
		// ExcelUtils.insertSheet("D:\\test.xls", "333");

		// 检查是否存在工作表
		// HSSFWorkbook wb;
		// try {
		// wb = getHSSFWorkbook("D:\\test.xls");
		// System.out.println(ExcelUtils.checkSheet(wb, "3334"));
		// } catch (Exception e) {
		// // TODO Auto-generated catch block
		// e.printStackTrace();
		// }

		// 插入一行数据
		// ExcelUtils.insertOrUpadateRowDatas("D:\\test.xls", "333", 5, "123",
		// "0000");

		// 插入单元格数据
		// ExcelUtils.insertOrUpdateCell("D:\\test.xls", "123", 5, 1, "0000");

		// 删除指定工作表所有的行数据、
		// ExcelUtils.cleanExcelFile("D:\\test.xls", "123");

		// 删除指定行
		// ExcelUtils.deleteRow("D:\\test.xls", "123", 0);

		// 获取所有的数据
		// List<List> list = ExcelUtils.getAllData("D:\\test.xls", "333");
		// for (int i = 0; i < list.size(); i++) {
		// List<String> rowList = list.get(i);
		// for (int j = 0; j < rowList.size(); j++) {
		// System.out.println(rowList.get(j));
		// }
		// }

		// 获取部分的数据
		// List<List> list = ExcelUtils.getDatas(
		// "C:\\Users\\Ken\\Desktop\\测试名单.xls", "Sheet1", 5, 374);
		// for (int i = 0; i < list.size(); i++) {
		// List<String> rowList = list.get(i);
		// for (int j = 0; j < rowList.size(); j++) {
		// System.out.print(rowList.get(j) + " ");
		// }
		// System.out.println();
		// }

		// 获取指定行列数据
		// System.out.println(ExcelUtils.getData("D:\\test.xls", "333", 5, 1));

		// 复制指定工作表
		ExcelUtils.copySheet("D:\\考场模版2.XLS", "333", 0);

	}
}
