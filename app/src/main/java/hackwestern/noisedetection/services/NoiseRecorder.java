package hackwestern.noisedetection.services;

import android.media.MediaRecorder;
import android.os.Environment;
import android.os.Handler;
import android.util.Base64;
import android.util.Log;

import java.io.File;
import java.io.IOException;

import hackwestern.noisedetection.NoiseRecordingCallback;
import hackwestern.noisedetection.models.RecordingResult;
import hackwestern.noisedetection.utils.FileUtils;
import hackwestern.noisedetection.utils.audio_clipping.CheapSoundFile;
import hackwestern.noisedetection.utils.audio_clipping.Util;
import io.reactivex.Observable;
import io.reactivex.subjects.BehaviorSubject;
import io.reactivex.subjects.PublishSubject;


import static hackwestern.noisedetection.services.AmplitudeMonitor.AMPLITUDE_POLL_RATE;
import static hackwestern.noisedetection.services.AmplitudeMonitor.AMPLITUDE_THRESHOLD;

/**
 * Created by rowandempster on 11/18/17.
 */

public class NoiseRecorder {

    private static final int MIN_RECORD_TIME = 1000;

    private MediaRecorder mRecorder;
    private String audioFile = Environment.getExternalStorageDirectory().getAbsolutePath() + "/audio_file.mp3";
    private String cutAudioFile = Environment.getExternalStorageDirectory().getAbsolutePath() + "/cut_audio_file.mp3";
    private Handler mHandler = new Handler();
    long startTime;
    private double maxAmp;
    private int ampRecordCount;
    private NoiseRecordingCallback callback;

    NoiseRecorder(NoiseRecordingCallback callback) {
        this.callback = callback;
    }

    private void startMediaRecorder() {
        if (mRecorder != null) {
            return;
        }
        mRecorder = new MediaRecorder();
        mRecorder.setAudioSource(MediaRecorder.AudioSource.MIC);
        mRecorder.setOutputFormat(MediaRecorder.OutputFormat.THREE_GPP);
        mRecorder.setAudioEncoder(MediaRecorder.AudioEncoder.AMR_NB);
        mRecorder.setOutputFile(audioFile);
        try {
            mRecorder.prepare();
            mRecorder.start();
        } catch (IOException e) {
            e.printStackTrace();
        }
    }

    public void startRecording(double initAmp) {
        startMediaRecorder();
        maxAmp = initAmp;
        ampRecordCount = 1;
        mRecorder.getMaxAmplitude();
        mHandler.postDelayed(mEndMonitor, MIN_RECORD_TIME);
        startTime =  System.nanoTime();
    }

    private Runnable mEndMonitor = new Runnable() {
        @Override
        public void run() {
            double amp = mRecorder.getMaxAmplitude();
            Log.d("rowan", "recorder got new amp: " + amp);
            NoiseRecorder.this.maxAmp = Math.max(NoiseRecorder.this.maxAmp, amp);
            NoiseRecorder.this.ampRecordCount++;
            boolean cancel = false;
            if(NoiseRecorder.this.ampRecordCount >= 12) {
                if (NoiseRecorder.this.maxAmp < AMPLITUDE_THRESHOLD) {
                    cancel = true;
                }
                else {
                    NoiseRecorder.this.ampRecordCount = 0;
                    NoiseRecorder.this.maxAmp = 0;
                }
            }
            if (cancel) {
                NoiseRecorder.this.stopAndSendResult();
            } else {
                mHandler.postDelayed(mEndMonitor, AMPLITUDE_POLL_RATE);
            }
        }
    };

    private void stopAndSendResult() {
        mRecorder.release();
        mRecorder = null;
//        final CheapSoundFile.ProgressListener listener = new CheapSoundFile.ProgressListener() {
//            public boolean reportProgress(double frac) {
//                Log.d("rowan", "progress: " + frac);
//                if(frac > 99.999) {
//                            byte[] bytes = new byte[0];
//        try {
//            bytes = FileUtils.readFileToString(audioFile);
//        } catch (IOException e) {
//            e.printStackTrace();
//        }
//        String encoded = Base64.encodeToString(bytes, 0);
//        RecordingResult res = new RecordingResult();
//        res.setData(encoded);
//        res.setMaxAmplitude(maxAmp);
//        callback.onRecordingResult(res);
//                }
//                return true;
//            }
//        };
//        CheapSoundFile cheapSoundFile = null;
//        try {
//            cheapSoundFile = CheapSoundFile.create(audioFile,listener);
//        } catch (IOException e) {
//            e.printStackTrace();
//        }
//
//        int mSampleRate = cheapSoundFile.getSampleRate();
//
//        int mSamplesPerFrame = cheapSoundFile.getSamplesPerFrame();
//
//        int startFrame = Util.secondsToFrames(0,mSampleRate, mSamplesPerFrame);
//
//        int endFrame = Util.secondsToFrames(this.startTime - System.nanoTime() - 3, mSampleRate,mSamplesPerFrame);
//
//        try {
//            cheapSoundFile.WriteFile(new File(cutAudioFile), startFrame, endFrame-startFrame);
//        } catch (IOException e) {
//            e.printStackTrace();
//        }


        byte[] bytes = new byte[0];
        try {
            bytes = FileUtils.readFileToString(audioFile);
        } catch (IOException e) {
            e.printStackTrace();
        }
        String encoded = Base64.encodeToString(bytes, 0);
        RecordingResult res = new RecordingResult();
        res.setData(encoded);
        res.setMaxAmplitude(maxAmp);
        callback.onRecordingResult(res);
    }
}
