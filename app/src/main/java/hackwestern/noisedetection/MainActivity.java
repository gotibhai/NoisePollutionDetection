package hackwestern.noisedetection;

import android.app.Activity;
import android.content.Intent;
import android.os.Bundle;

import hackwestern.noisedetection.services.NoiseDetectionService;

/**
 * Created by rowandempster on 11/18/17.
 */

public class MainActivity extends Activity {
    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        startService(new Intent(this, NoiseDetectionService.class));
        finish();
    }
}
