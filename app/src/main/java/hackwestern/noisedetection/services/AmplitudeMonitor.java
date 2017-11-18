package hackwestern.noisedetection.services;

import android.media.MediaRecorder;
import android.os.Handler;
import android.util.Log;

import java.io.IOException;

import io.reactivex.Observable;
import io.reactivex.subjects.BehaviorSubject;
import io.reactivex.subjects.PublishSubject;

/**
 * Created by rowandempster on 11/18/17.
 */

public class AmplitudeMonitor {
    public static final int AMPLITUDE_THRESHOLD = 30000;
    public static final int AMPLITUDE_POLL_RATE = 250;

    private BehaviorSubject<Double> thresholdSubject = BehaviorSubject.create();
    private MediaRecorder mRecorder;
    private Handler mHandler = new Handler();

    public Observable<Double> thresholdPassed() {
        return thresholdSubject;
    }

    public void startMonitoring() {
        Log.d("rowan", "monitoring...");
        startMediaRecorder();
        mMonitor.run();
    }

    private void startMediaRecorder() {
        if (mRecorder != null) {
            return;
        }
        mRecorder = new MediaRecorder();
        mRecorder.setAudioSource(MediaRecorder.AudioSource.MIC);
        mRecorder.setOutputFormat(MediaRecorder.OutputFormat.THREE_GPP);
        mRecorder.setAudioEncoder(MediaRecorder.AudioEncoder.AMR_NB);
        mRecorder.setOutputFile("/dev/null");
        try {
            mRecorder.prepare();
            mRecorder.start();
        } catch (IOException e) {
            e.printStackTrace();
        }
    }

    private Runnable mMonitor = new Runnable() {
        @Override
        public void run() {
            double amp = mRecorder.getMaxAmplitude();
            if (amp > AMPLITUDE_THRESHOLD) {
                mRecorder.stop();
                mRecorder.reset();
                mRecorder.release();
                mRecorder = null;
                thresholdSubject.onNext(amp);
            } else {
                mHandler.postDelayed(mMonitor, AMPLITUDE_POLL_RATE);
            }
        }
    };
}
