package hackwestern.noisedetection.utils;

import java.io.BufferedInputStream;
import java.io.File;
import java.io.FileInputStream;
import java.io.FileNotFoundException;
import java.io.IOException;
import java.io.InputStream;

/**
 * Created by rowandempster on 11/18/17.
 */

public class FileUtils {

        /**
         * Instances should NOT be constructed in standard programming.
         */
        public FileUtils() { }

        /**
         * The number of bytes in a kilobyte.
         */
        public static final long ONE_KB = 1024;

        /**
         * The number of bytes in a megabyte.
         */
        public static final long ONE_MB = ONE_KB * ONE_KB;

        /**
         * The number of bytes in a gigabyte.
         */
        public static final long ONE_GB = ONE_KB * ONE_MB;



        public static byte[] readFileToString(
                String path) throws IOException {
            File file = new File(path);
            int size = (int) file.length();
            byte[] bytes = new byte[size];
            try {
                BufferedInputStream buf = new BufferedInputStream(new FileInputStream(file));
                buf.read(bytes, 0, bytes.length);
                buf.close();
                return bytes;
            } catch (FileNotFoundException e) {
                // TODO Auto-generated catch block
                e.printStackTrace();
            } catch (IOException e) {
                // TODO Auto-generated catch block
                e.printStackTrace();
            }
            return bytes;
        }



    }

