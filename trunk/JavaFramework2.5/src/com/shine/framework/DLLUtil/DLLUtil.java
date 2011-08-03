package com.shine.framework.DLLUtil;

import org.xvolks.jnative.JNative;
import org.xvolks.jnative.Type;

import com.shine.framework.DLLUtil.model.DllModel;

public class DLLUtil {
	/**
	 * 调用dll方法
	 * @param dllName
	 * @param methodName
	 * @param returnType
	 * @param args
	 * @return
	 */
	@SuppressWarnings("deprecation")
	public Object callDLL(String dllName, String methodName, Type returnType,
			DllModel... args) {
		JNative n = null;
		Object ret = null;
		JNative.setLoggingEnabled(true);
		try {
			n = new JNative(dllName, methodName); // 常量dllName的值为:windows下不加后缀.dll，linux需要包括后缀.so
			n.setRetVal(returnType); // 指定返回参数的类型
			int i = 0;
			for (DllModel arg : args) {
				n.setParameter(i++, arg.getType(), arg.getValue());
			}

			n.invoke(); // 调用方法
			ret = n.getRetVal(); // 取回返回值

			System.out.println("this is call dll:" + ret + " ");
		} catch (Exception e) {
			System.out.println("cann't call dll: " + dllName + "." + methodName
					+ " ");
			e.printStackTrace();

		} finally {
			if (n != null) {
				try {
					n.dispose(); // 记得释放
				} catch (Exception e) {
					e.printStackTrace();
					System.out.println("can't dispose the dll:" + dllName);
				}
			}
		}
		return ret;
	}
}
