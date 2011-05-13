package com.shine.framework.JsCompressor;

import java.io.FileInputStream;
import java.io.FileOutputStream;
import java.io.InputStreamReader;
import java.io.OutputStreamWriter;

import org.mozilla.javascript.ErrorReporter;
import org.mozilla.javascript.EvaluatorException;

import com.yahoo.platform.yui.compressor.CssCompressor;
import com.yahoo.platform.yui.compressor.JavaScriptCompressor;

/**
 * 压缩js和CSS
 * 
 * @author viruscodecn@gmail.com
 * @lib jargs-1.0.jar,rhino-1.6R7.jar,yuicompressor-2.4.6.jar
 * @date 2011.5.13
 * 
 */
public class JsCompressorUtils {

	/**
	 * 压缩JS
	 * 
	 * @param type
	 * @param charset
	 * @param sourceJsPath
	 * @param targetJsPath
	 */
	public static void jsCompressor(String charset, String sourceJsPath,
			String targetJsPath) {
		InputStreamReader in = null;
		OutputStreamWriter out = null;
		try {
			in = new InputStreamReader(new FileInputStream(sourceJsPath),
					charset);
			JavaScriptCompressor compressor = new JavaScriptCompressor(in,
					new ErrorReporter() {

						public void warning(String message, String sourceName,
								int line, String lineSource, int lineOffset) {
							if (line < 0) {
								System.err.println("\n[WARNING] " + message);
							} else {
								System.err.println("\n[WARNING] " + line + ':'
										+ lineOffset + ':' + message);
							}
						}

						public void error(String message, String sourceName,
								int line, String lineSource, int lineOffset) {
							if (line < 0) {
								System.err.println("\n[ERROR] " + message);
							} else {
								System.err.println("\n[ERROR] " + line + ':'
										+ lineOffset + ':' + message);
							}
						}

						public EvaluatorException runtimeError(String message,
								String sourceName, int line, String lineSource,
								int lineOffset) {
							error(message, sourceName, line, lineSource,
									lineOffset);
							return new EvaluatorException(message);
						}
					});
			out = new OutputStreamWriter(new FileOutputStream(targetJsPath),
					charset);
			compressor.compress(out, -1, false, true, false, false);
		} catch (Exception e) {
			e.printStackTrace();
		} finally {
			try {
				if (in != null)
					in.close();
				if (out != null)
					out.close();
			} catch (Exception ex) {
				ex.printStackTrace();
			}
		}
	}

	/**
	 * 压缩css
	 * 
	 * @param charset
	 * @param sourceCssPath
	 * @param targetCssPath
	 */
	public static void cssCompressor(String charset, String sourceCssPath,
			String targetCssPath) {
		InputStreamReader in = null;
		OutputStreamWriter out = null;
		try {
			in = new InputStreamReader(new FileInputStream(sourceCssPath),
					charset);
			out = new OutputStreamWriter(new FileOutputStream(targetCssPath),
					charset);
			CssCompressor compressor = new CssCompressor(in);
			compressor.compress(out, -1);
		} catch (Exception e) {
			e.printStackTrace();
		} finally {
			try {
				if (in != null)
					in.close();
				if (out != null)
					out.close();
			} catch (Exception ex) {
				ex.printStackTrace();
			}
		}
	}
}
