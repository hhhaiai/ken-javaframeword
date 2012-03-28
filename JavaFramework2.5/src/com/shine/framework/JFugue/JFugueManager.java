package com.shine.framework.JFugue;

import org.jfugue.Player;

/**
 * java 音符轉化為音樂
 * 
 * @author viruscodecn@gmail.com
 * 
 */
public class JFugueManager {
	public static JFugueManager manager = null;

	public static JFugueManager getManager() {
		if (manager == null)
			manager = new JFugueManager();
		return manager;
	}

	public void playMusicString(String musicString) {
		Player player = null;
		try {
			player = new Player();
			player.play(musicString);
			player.close();
		} catch (Exception e) {
			e.printStackTrace();
		} finally {
			if (player != null)
				player.close();
		}
	}
}
