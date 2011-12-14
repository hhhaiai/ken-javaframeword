package com.shine.framework.Jave;

import it.sauronsoftware.jave.AudioAttributes;
import it.sauronsoftware.jave.Encoder;
import it.sauronsoftware.jave.EncodingAttributes;
import it.sauronsoftware.jave.VideoAttributes;
import it.sauronsoftware.jave.VideoSize;

import java.io.File;

/**
 * java多媒体视频格式转换
 * 
 * @author viruscodecn@gmail.com
 * @help http://www.sauronsoftware.it/projects/jave/manual.php#10
 * 
 */
public class JaveUtil {
	/**
	 * avi to flv
	 * 
	 * @param aviPath
	 * @param flvPath
	 * @param targetWidth
	 * @param targetHeight
	 * @return
	 */
	public static boolean avi2flv(String aviPath, String flvPath,
			int targetWidth, int targetHeight) {
		try {
			File source = new File(aviPath);
			File target = new File(flvPath);
			AudioAttributes audio = new AudioAttributes();
			audio.setCodec("libmp3lame");
			audio.setBitRate(new Integer(64000));
			audio.setChannels(new Integer(1));
			audio.setSamplingRate(new Integer(22050));
			VideoAttributes video = new VideoAttributes();
			video.setCodec("flv");
			video.setBitRate(new Integer(160000));
			video.setFrameRate(new Integer(15));
			video.setSize(new VideoSize(targetWidth, targetHeight));
			EncodingAttributes attrs = new EncodingAttributes();
			attrs.setFormat("flv");
			attrs.setAudioAttributes(audio);
			attrs.setVideoAttributes(video);
			Encoder encoder = new Encoder();
			encoder.encode(source, target, attrs);
			return true;
		} catch (Exception e) {
			e.printStackTrace();
			return false;
		}
	}

	/**
	 * avi to wav
	 * 
	 * @param aviPath
	 * @param wavPath
	 * @return
	 */
	public static boolean avi2wav(String aviPath, String wavPath) {
		try {
			File source = new File(aviPath);
			File target = new File(wavPath);
			AudioAttributes audio = new AudioAttributes();
			audio.setCodec("pcm_s16le");
			EncodingAttributes attrs = new EncodingAttributes();
			attrs.setFormat("wav");
			attrs.setAudioAttributes(audio);
			Encoder encoder = new Encoder();
			encoder.encode(source, target, attrs);
			return true;
		} catch (Exception e) {
			e.printStackTrace();
			return false;
		}
	}

	/**
	 * avi to 3gp
	 * 
	 * @param aviPath
	 * @param _3gpPath
	 * @return
	 */
	public static boolean avi23gp(String aviPath, String _3gpPath) {
		try {
			File source = new File(aviPath);
			File target = new File(_3gpPath);
			AudioAttributes audio = new AudioAttributes();
			audio.setCodec("libfaac");
			audio.setBitRate(new Integer(128000));
			audio.setSamplingRate(new Integer(44100));
			audio.setChannels(new Integer(2));
			VideoAttributes video = new VideoAttributes();
			video.setCodec("mpeg4");
			video.setBitRate(new Integer(160000));
			video.setFrameRate(new Integer(15));
			video.setSize(new VideoSize(176, 144));
			EncodingAttributes attrs = new EncodingAttributes();
			attrs.setFormat("3gp");
			attrs.setAudioAttributes(audio);
			attrs.setVideoAttributes(video);
			Encoder encoder = new Encoder();
			encoder.encode(source, target, attrs);
			return true;
		} catch (Exception e) {
			e.printStackTrace();
			return false;
		}
	}

}
