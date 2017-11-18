package hackwestern.noisedetection.services;

import android.Manifest;
import android.app.Service;
import android.content.Context;
import android.content.Intent;
import android.content.pm.PackageManager;
import android.location.Location;
import android.location.LocationListener;
import android.location.LocationManager;
import android.media.MediaPlayer;
import android.media.MediaRecorder;
import android.os.Bundle;
import android.os.Environment;
import android.os.Handler;
import android.os.IBinder;
import android.support.annotation.Nullable;
import android.support.v4.app.ActivityCompat;
import android.util.Base64;
import android.util.Log;

import java.io.IOException;
import java.text.DateFormat;
import java.text.SimpleDateFormat;
import java.util.Date;
import java.util.Dictionary;
import java.util.HashMap;
import java.util.Map;
import java.util.TimeZone;
import java.util.Timer;
import java.util.TimerTask;

import hackwestern.noisedetection.models.NoiseEventInfo;
import hackwestern.noisedetection.models.RecordingResult;
import hackwestern.noisedetection.utils.APIUtils;
import hackwestern.noisedetection.utils.FileUtils;
import hackwestern.noisedetection.utils.TimeUtils;
import io.reactivex.android.schedulers.AndroidSchedulers;
import io.reactivex.functions.Consumer;
import io.reactivex.schedulers.Schedulers;
import retrofit2.Call;
import retrofit2.Callback;
import retrofit2.Response;

/**
 * Created by rowandempster on 11/18/17.
 */

public class NoiseDetectionService extends Service {
    private Location mLocation;
    private AmplitudeMonitor amplitudeMonitor = new AmplitudeMonitor();
    private NoiseRecorder noiseRecorder = new NoiseRecorder();

    @Nullable
    @Override
    public IBinder onBind(Intent intent) {
        return null;
    }

    @Override
    public int onStartCommand(Intent intent, int flags, int startId) {
        startLocationPoller();
        startMonitoring();
        return super.onStartCommand(intent, flags, startId);
    }

    void startMonitoring() {
        amplitudeMonitor.thresholdPassed().subscribeOn(AndroidSchedulers.mainThread()).subscribe(new Consumer<Double>() {
            @Override
            public void accept(Double initAmp) throws Exception {
                Log.d("rowan", "recording...");
                startRecording(initAmp.doubleValue());
            }
        });
        amplitudeMonitor.startMonitoring();
    }

    private void startRecording(double initAmp) {
        noiseRecorder.subscribeToResult().subscribeOn(AndroidSchedulers.mainThread()).subscribe(new Consumer<RecordingResult>() {
            @Override
            public void accept(RecordingResult recordingResult) throws Exception {
                Log.d("rowan", "posting...");
                postData(recordingResult);
                amplitudeMonitor.startMonitoring();
            }
        });
        noiseRecorder.startRecording(initAmp);
    }

    public void postData(RecordingResult recordingResult) {
        NoiseEventInfo toSend = new NoiseEventInfo();
        toSend.setMedia(recordingResult.getData());
        toSend.setAmplitude(recordingResult.getMaxAmplitude());
        Map<String, Double> locDict = new HashMap<>();
        locDict.put("latitude", mLocation.getLatitude());
        locDict.put("longitude", mLocation.getLongitude());
        toSend.setLocation(locDict);
        toSend.setTime(TimeUtils.getCurrentTimeString());
        APIUtils.getAPIService().savePost(toSend).enqueue(new Callback<NoiseEventInfo>() {
            @Override
            public void onResponse(Call<NoiseEventInfo> call, Response<NoiseEventInfo> response) {

            }

            @Override
            public void onFailure(Call<NoiseEventInfo> call, Throwable t) {

            }
        });
    }

    private void startLocationPoller() {
        LocationPoller locationPoller = new LocationPoller(this);
        mLocation = locationPoller.getLastLocation();
        locationPoller.subscribeToNewLocations().subscribe(new Consumer<Location>() {
            @Override
            public void accept(Location location) throws Exception {
                NoiseDetectionService.this.mLocation = location;
            }
        });
    }
}
