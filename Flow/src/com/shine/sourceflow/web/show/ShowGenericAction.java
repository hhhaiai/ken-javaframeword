package com.shine.sourceflow.web.show;

import java.awt.Color;
import java.awt.Graphics2D;
import java.awt.RenderingHints;
import java.awt.image.BufferedImage;
import java.io.ByteArrayOutputStream;
import java.io.IOException;
import java.io.OutputStream;
import java.util.ArrayList;
import java.util.List;

import javaf.framework.pdf.PDFParser;
import javaf.framework.pdf.element.IPDFElement;
import javaf.framework.pdf.element.impl.PDFImage;
import javaf.framework.pdf.element.impl.PDFParagraph;
import javaf.framework.pdf.element.impl.PDFTable;
import javaf.framework.util.SysUtil;
import javaf.framework.util.UUIDUtil;

import javax.imageio.ImageIO;
import javax.servlet.ServletOutputStream;

import org.apache.struts2.ServletActionContext;

import com.lowagie.text.Paragraph;
import com.lowagie.text.pdf.BaseFont;
import com.lowagie.text.pdf.PdfPCell;
import com.shine.framework.config.ConfigManager;
import com.shine.sourceflow.utils.RequestData;
import com.shine.sourceflow.web.GenericAction;
import com.sun.image.codec.jpeg.JPEGCodec;
import com.sun.image.codec.jpeg.JPEGEncodeParam;
import com.sun.image.codec.jpeg.JPEGImageEncoder;

public abstract class ShowGenericAction extends GenericAction {
	private static final long serialVersionUID = -101338598930614739L;

	/**
	 * 查询数据
	 * 
	 * @return
	 */
	@Override
	public String list() {
		this.dto.init(this.request);
		dbModels = this.service.list(this.dto);
		this.generateCharts();
		return DATA_LIST;
	}
	
	/**
	 * 生成报表数据
	 */
	protected abstract void generateCharts();
	
	/**
	 * 获取PDF标题
	 * 
	 * @return
	 */
	protected abstract String getPDFTitle();
	
	/**
	 * 获取报表表格标题
	 * 
	 * @return
	 */
	protected abstract String getTableTitles();
	
	/**
	 * 获取报表表格数据
	 * 
	 * @return
	 */
	protected abstract List<String> getTableDatas();
	
	/**
	 * 导出图片
	 */
	public void exportImage() {
		// 页面flash的宽度和高度
		int width = Integer.parseInt(request.getParameter("width"));
		int height = Integer.parseInt(request.getParameter("height"));

		BufferedImage result = new BufferedImage(width, height,
				BufferedImage.TYPE_INT_RGB);
		// 页面是将一个个像素作为参数传递进来的,所以如果图表越大,处理时间越长
		for (int y = 0; y < height; y++) {
			int x = 0;
			String[] row = request.getParameter("r" + y).split(",");
			for (int c = 0; c < row.length; c++) {
				String[] pixel = row[c].split(":"); // 十六进制颜色数组
				int repeat = pixel.length > 1 ? Integer.parseInt(pixel[1]) : 1;
				for (int l = 0; l < repeat; l++) {
					result.setRGB(x, y, Integer.parseInt(pixel[0], 16));
					x++;
				}
			}
		}
		response.setContentType("image/jpeg");
		response.addHeader("Content-Disposition",
				"attachment; filename=\"amchart.jpg\"");
		Graphics2D g = result.createGraphics();
		// 处理图形平滑度
		g.setRenderingHint(RenderingHints.KEY_ANTIALIASING,
				RenderingHints.VALUE_ANTIALIAS_ON);
		g.drawImage(result, 0, 0, width, height, null);
		g.dispose();

		ServletOutputStream f = null;
		try {
			f = response.getOutputStream();
			JPEGImageEncoder encoder = JPEGCodec.createJPEGEncoder(f);
			JPEGEncodeParam param = encoder.getDefaultJPEGEncodeParam(result);
			// 设置图片质量,100最大,默认70
			param.setQuality((float) (100 / 100.0), true);
			encoder.encode(result, param);
			// 输出图片
			ImageIO.write(result, "JPEG", response.getOutputStream());
		} catch (IOException e) {
			e.printStackTrace();
		} finally {
			try {
				if (f != null) {
					f.close();
				}
			} catch (IOException e) {
				e.printStackTrace();
			}
		}
	}
	
	/**
	 * 导出PDF
	 */
	public void exportPDF() {
		PDFParser pdfParser = PDFParser.getInstance();
		// TODO 此为WINDOWS字体，在LINUX需注意，需做判断
		pdfParser.setFont("C:/WINDOWS/Fonts/simfang.ttf", BaseFont.IDENTITY_H);
		List<IPDFElement> pdfElements = new ArrayList<IPDFElement>();
		
		// 生成PDF标题
		PDFParagraph pdfParagraph = new PDFParagraph(this.getPDFTitle());
		pdfParagraph.getParagraph().setAlignment(Paragraph.ALIGN_CENTER);
		pdfElements.add(pdfParagraph);
		pdfElements.add(new PDFParagraph(" "));
		
		// 生成表格
		List<PdfPCell> tableTitles = new ArrayList<PdfPCell>();
		for (String title : this.getTableTitles().split(",")) {
			PdfPCell cell = new PdfPCell(new Paragraph(title, PDFParser.fontChinese));
			cell.setHorizontalAlignment(PdfPCell.ALIGN_CENTER);
			cell.setBackgroundColor(new Color(238, 238, 238));
			cell.setPaddingTop(0);
			cell.setPaddingBottom(4);
			tableTitles.add(cell);
		}
		PDFTable pdfTable = new PDFTable(tableTitles, 1);
		List<PdfPCell> tableDatas = new ArrayList<PdfPCell>();
		for (String datas : this.getTableDatas()) {
			String[] columns = datas.split(",");
			for (String data : columns) {
				PdfPCell cell = new PdfPCell(new Paragraph(data, PDFParser.fontChinese));
				cell.setHorizontalAlignment(PdfPCell.ALIGN_CENTER);
				cell.setPaddingTop(0);
				cell.setPaddingBottom(4);
				tableDatas.add(cell);
			}
		}
		pdfTable.addData(tableDatas, 1);
		pdfElements.add(pdfTable);
		
		// 生成图片
		PDFImage image = new PDFImage(this.generateImage());
		// 设置图片大小
		image.getImage().scaleAbsolute(450, 220);
		pdfElements.add(image);
		ByteArrayOutputStream baos = pdfParser.generatePDFBytes(pdfElements);
		
		// 页面输出
		OutputStream os = null;
		String savedFileName = request.getParameter("fileName");
		if (savedFileName == null) {
			savedFileName = "default.pdf";
		}
		try {
			response.setContentType("application/x-msdownload;charset=UTF-8");
			response.setHeader("Content-Disposition","attachment; filename=" + savedFileName);
			os = response.getOutputStream();
			baos.writeTo(os);
		} catch (Exception e) {
			e.printStackTrace();
		} finally {
			try {
				os.flush();
				ServletActionContext.getPageContext().getOut().clear();
				ServletActionContext.getPageContext().pushBody();
			} catch (Exception e) {
			}
			try {
				os.close();
				baos.close();
			} catch (Exception e) {
			}
		}
	}
	
	private BufferedImage generateImage() {
		// 页面flash的宽度和高度
		int width = Integer.parseInt(request.getParameter("width"));
		int height = Integer.parseInt(request.getParameter("height"));

		BufferedImage result = new BufferedImage(width, height,
				BufferedImage.TYPE_INT_RGB);
		// 页面是将一个个像素作为参数传递进来的,所以如果图表越大,处理时间越长
		for (int y = 0; y < height; y++) {
			int x = 0;
			String[] row = request.getParameter("r" + y).split(",");
			for (int c = 0; c < row.length; c++) {
				String[] pixel = row[c].split(":"); // 十六进制颜色数组
				int repeat = pixel.length > 1 ? Integer.parseInt(pixel[1]) : 1;
				for (int l = 0; l < repeat; l++) {
					result.setRGB(x, y, Integer.parseInt(pixel[0], 16));
					x++;
				}
			}
		}
		response.setContentType("image/jpeg");
		response.addHeader("Content-Disposition",
				"attachment; filename=\"amchart.jpg\"");
		Graphics2D g = result.createGraphics();
		// 处理图形平滑度
		g.setRenderingHint(RenderingHints.KEY_ANTIALIASING,
				RenderingHints.VALUE_ANTIALIAS_ON);
		g.drawImage(result, 0, 0, width, height, null);
		g.dispose();
		return result;
	}
	
	/**
	 * 导出PDF
	 */
	public void dumpPDF() {
		StringBuffer appurl = new StringBuffer(100);
		appurl.append(request.getScheme()).append("://");
		appurl.append(request.getServerName()).append(":");
		appurl.append(request.getServerPort()).append(request.getContextPath());
		appurl.append("/"); 
		
		String method = request.getParameter("method");
		StringBuffer cmd = new StringBuffer(200);
		cmd.append(ConfigManager.getManager().getSysPath());
		String targetFile = ConfigManager.getManager().getSysPath();
		RequestData extor = new RequestData(request);
		if (System.getProperty("os.name").startsWith("Windows")) {
			targetFile += "software\\temp\\" + UUIDUtil.getRandomId() + ".pdf";
			
			cmd.append("software\\wkhtmltopdf\\wkhtmltopdf.exe");
			cmd.append(" \"").append(appurl).append(method).append("?exportPdf=true&");
			cmd.append(extor.getParaString()).append("\" ");		
			cmd.append(targetFile);			
		} else {
			targetFile += "software/temp/" + UUIDUtil.getRandomId() + ".pdf";			
			cmd.append("software/wkhtmltopdf/wkhtmltopdf-i386");
			cmd.append(" ").append(appurl).append(method).append("?exportPdf=true&");
			cmd.append(extor.getParaString().replaceAll(" ", "%20")).append(" ");
			cmd.append(targetFile);
		}
		SysUtil.exeCmd(cmd.toString());

		this.download(targetFile, "FlowReport.pdf");
	}
}
