package hackwestern.noisedetection.services;

import android.app.Service;
import android.content.Intent;
import android.os.IBinder;
import android.support.annotation.Nullable;

/**
 * Created by rowandempster on 11/18/17.
 */

public class NoiseDetectionService extends Service {
    @Nullable
    @Override
    public IBinder onBind(Intent intent) {
        return null;
    }

    @Override
    public int onStartCommand(Intent intent, int flags, int startId) {
        // do your jobs here
        return super.onStartCommand(intent, flags, startId);
    }
}
