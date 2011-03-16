package com.shine.framework.tray;

import java.awt.PopupMenu;

import com.shine.framework.tray.model.SystemTrayModel;

public class Tray {
	private static Tray tray = new Tray();

	private PopupMenu popupMenu = null;
	private Object trayParent = null;
	private static SystemTrayModel systemTrayModel = null;

	public final static Tray getTray() {
		if (systemTrayModel != null) {
			systemTrayModel = new SystemTrayModel();
		}
		return tray;
	}

	public void init(Object trayParent, PopupMenu popupMenu, String imagePath) {
		if (popupMenu != null)
			systemTrayModel.setPopupMenu(popupMenu);
		systemTrayModel.setTrayParent(trayParent);
		systemTrayModel.setImagePath(imagePath);
		systemTrayModel.jbInit();
		// System.out.println("");
	}
}
