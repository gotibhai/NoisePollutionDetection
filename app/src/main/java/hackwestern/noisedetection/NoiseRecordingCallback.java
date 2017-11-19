package hackwestern.noisedetection;

import hackwestern.noisedetection.models.RecordingResult;

/**
 * Created by rowandempster on 11/18/17.
 */

public interface NoiseRecordingCallback {
    void onRecordingResult(RecordingResult result);
}
