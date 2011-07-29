package com.shine.framework.tray.model;

import java.awt.AWTException;
import java.awt.Image;
import java.awt.MenuItem;
import java.awt.PopupMenu;
import java.awt.SystemTray;
import java.awt.Toolkit;
import java.awt.TrayIcon;
import java.awt.event.ActionEvent;
import java.awt.event.ActionListener;
import java.awt.event.MouseEvent;
import javax.swing.JFrame;

public class SystemTrayModel {
	private TrayIcon trayIcon = null;
	private static Image image = null;
	private Object trayParent = null;
	// imagePath="logo16x16_green.png"
	private String imagePath = null;
	private PopupMenu popupMenu;
	private static SystemTray tray = SystemTray.getSystemTray();

	public void jbInit() {
		if (imagePath != null) {
			image = Toolkit.getDefaultToolkit().getImage(imagePath);
			if (SystemTray.isSupported()) {
				MenuItem exitItem = new MenuItem("关闭");
				MenuItem menuItema = new MenuItem("打开");
				exitItem.addActionListener(new ActionListener() {

					public void actionPerformed(ActionEvent e) {
						try {
							System.exit(0);
						} catch (Exception ex) {
							ex.printStackTrace();
						}
					}
				});
				menuItema.addActionListener(new ActionListener() {

					public void actionPerformed(ActionEvent e) {
						try {
							show(true);
						} catch (Exception ex) {
							ex.printStackTrace();
						}
					}
				});

				popupMenu.add(menuItema);
				popupMenu.add(exitItem);

				trayIcon = new TrayIcon(image, "OpManage", popupMenu);
				trayIcon.addMouseListener(new java.awt.event.MouseAdapter() {

					@Override
					public void mouseClicked(MouseEvent e) {
						if (e.getClickCount() == 2) {
							show(true);
						}
					}
				});

				try {
					tray.add(trayIcon);
				} catch (AWTException e) {
					e.printStackTrace();
				}
			}
		} else {
			System.out.println(SystemTrayModel.class + ":imagePath没定义");
		}
	}

	public void delete() throws AWTException {
		tray.remove(trayIcon);
	}

	public void show(boolean visable) {
		((JFrame) trayParent).setVisible(visable);
	}

	public String getImagePath() {
		return imagePath;
	}

	public void setImagePath(String imagePath) {
		this.imagePath = imagePath;
	}

	public Object getTrayParent() {
		return trayParent;
	}

	public void setTrayParent(Object trayParent) {
		this.trayParent = trayParent;
	}

	public PopupMenu getPopupMenu() {
		return popupMenu;
	}

	public void setPopupMenu(PopupMenu popupMenu) {
		this.popupMenu = popupMenu;
	}

}
