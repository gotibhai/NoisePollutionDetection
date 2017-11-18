package hackwestern.noisedetection.services;

import android.media.MediaRecorder;
import android.os.Environment;
import android.os.Handler;
import android.util.Base64;

import java.io.IOException;

import hackwestern.noisedetection.models.RecordingResult;
import hackwestern.noisedetection.utils.FileUtils;
import io.reactivex.Observable;
import io.reactivex.subjects.BehaviorSubject;
import io.reactivex.subjects.PublishSubject;

import static hackwestern.noisedetection.services.AmplitudeMonitor.AMPLITUDE_POLL_RATE;
import static hackwestern.noisedetection.services.AmplitudeMonitor.AMPLITUDE_THRESHOLD;

/**
 * Created by rowandempster on 11/18/17.
 */

public class NoiseRecorder {

    private BehaviorSubject<RecordingResult> resultSubject = BehaviorSubject.create();
    private MediaRecorder mRecorder;
    private String audioFile = Environment.getExternalStorageDirectory().getAbsolutePath() + "/audio_file.mp3";
    private Handler mHandler = new Handler();
    private double totalAmp;
    private double maxAmp;
    private int ampRecordCount;

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

    public Observable<RecordingResult> subscribeToResult() {
        return resultSubject;
    }

    public void startRecording(double initAmp) {
        startMediaRecorder();
        totalAmp = initAmp;
        maxAmp = initAmp;
        ampRecordCount = 0;
        mEndMonitor.run();
    }

    private Runnable mEndMonitor = new Runnable() {
        @Override
        public void run() {
            double amp = mRecorder.getMaxAmplitude();
            NoiseRecorder.this.totalAmp += amp;
            NoiseRecorder.this.ampRecordCount++;
            NoiseRecorder.this.maxAmp = Math.max(NoiseRecorder.this.maxAmp, amp);
            double avgAmp = NoiseRecorder.this.totalAmp / NoiseRecorder.this.ampRecordCount;
            if (avgAmp < AMPLITUDE_THRESHOLD) {
                NoiseRecorder.this.stopAndSendResult();
            } else {
                mHandler.postDelayed(mEndMonitor, AMPLITUDE_POLL_RATE);
            }
        }
    };

    private void stopAndSendResult() {
        mRecorder.stop();
        mRecorder.reset();
        mRecorder.release();
        mRecorder = null;
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
        resultSubject.onNext(res);
    }
}
