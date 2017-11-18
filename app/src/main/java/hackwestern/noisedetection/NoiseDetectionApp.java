package hackwestern.noisedetection;

import android.app.Application;
import android.content.Intent;

import hackwestern.noisedetection.services.NoiseDetectionService;

/**
 * Created by rowandempster on 11/18/17.
 */

public class NoiseDetectionApp extends Application {
    @Override
    public void onCreate() {
        super.onCreate();
        startService(new Intent(this, NoiseDetectionService.class));
        clo
    }
}
