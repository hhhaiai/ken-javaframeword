package com.shine.framework.JFugue.example;

import com.shine.framework.JFugue.JFugueManager;

public class PlayMusicStringExample {

	/**
	 * @param args
	 */
	public static void main(String[] args) {
		JFugueManager.getManager().playMusicString("C D E F G A B");
		JFugueManager.getManager().playMusicString("C3w D6h E3q F#5i Rs Ab7q Bb2i");
		JFugueManager.getManager().playMusicString("I[Piano] C5q D5q I[Flute] G5q F5q");
		JFugueManager.getManager().playMusicString("V0 A3q B3q C3q B3q V1 A2h C2h");
		JFugueManager.getManager().playMusicString("Cmaj5q F#min2h Bbmin13^^^");
		JFugueManager.getManager().playMusicString("E5s A5s C6s B5s E5s B5s D6s C6i E6i G#5i E6i | A5s E5s A5s C6s B5s E5s B5s D6s C6i A5i Ri");
	}

}
