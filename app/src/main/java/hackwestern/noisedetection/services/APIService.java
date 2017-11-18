package hackwestern.noisedetection.services;

import hackwestern.noisedetection.models.NoiseEventInfo;
import retrofit2.Call;
import retrofit2.http.Body;
import retrofit2.http.Field;
import retrofit2.http.FormUrlEncoded;
import retrofit2.http.POST;

/**
 * Created by rowandempster on 11/18/17.
 */

public interface APIService {
    @POST("/postData")
    Call<NoiseEventInfo> savePost(@Body NoiseEventInfo info);
}
