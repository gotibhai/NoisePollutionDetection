package hackwestern.noisedetection.models;

/**
 * Created by rowandempster on 11/18/17.
 */

public class RecordingResult {
    private String data;
    private double maxAmplitude;


    public String getData() {
        return data;
    }

    public void setData(String data) {
        this.data = data;
    }

    public double getMaxAmplitude() {
        return maxAmplitude;
    }

    public void setMaxAmplitude(double maxAmplitude) {
        this.maxAmplitude = maxAmplitude;
    }

}
