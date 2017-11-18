package hackwestern.noisedetection.utils;

import hackwestern.noisedetection.services.APIService;
import hackwestern.noisedetection.services.RetrofitClient;

/**
 * Created by rowandempster on 11/18/17.
 */

public class APIUtils {
    private APIUtils() {}

    public static final String BASE_URL = "http://37c62573.ngrok.io/";

    public static APIService getAPIService() {

        return RetrofitClient.getClient(BASE_URL).create(APIService.class);
    }
}
