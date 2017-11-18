package hackwestern.noisedetection.models;

import com.google.gson.annotations.Expose;
import com.google.gson.annotations.SerializedName;

import java.util.Dictionary;
import java.util.Map;

/**
 * Created by rowandempster on 11/18/17.
 */

public class NoiseEventInfo {
    @SerializedName("media")
    @Expose
    private String media;

    public String getMedia() {
        return media;
    }

    public void setMedia(String audioType) {
        this.media = audioType;
    }

    @SerializedName("location")
    @Expose
    private Map<String, Double> location;

    public Map<String, Double> getLocation() {
        return location;
    }

    public void setLocation(Map<String, Double> location) {
        this.location = location;
    }

    @SerializedName("time")
    @Expose
    private String time;

    public String getTime() {
        return time;
    }

    public void setTime(String time) {
        this.time = time;
    }

    @SerializedName("amplitude")
    @Expose
    private double amplitude;

    public double getAmplitude() {
        return amplitude;
    }

    public void setAmplitude(double amp) {
        this.amplitude = amp;
    }
}
