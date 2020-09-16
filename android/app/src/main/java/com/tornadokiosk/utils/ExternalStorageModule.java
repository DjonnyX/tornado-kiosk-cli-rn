package com.tornadokiosk.utils;

import android.net.Uri;
import android.os.Environment;
import android.util.Base64;

import com.facebook.react.bridge.Promise;
import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.bridge.ReactContextBaseJavaModule;
import com.facebook.react.bridge.ReactMethod;

import java.io.ByteArrayOutputStream;
import java.io.File;
import java.io.FileNotFoundException;
import java.io.IOException;
import java.io.InputStream;
import java.io.OutputStream;

public class ExternalStorageModule extends ReactContextBaseJavaModule {

    private String storagePath;
    private ReactApplicationContext reactContext;
    private boolean storageAvailable;
    private boolean storageReadOnly;

    public ExternalStorageModule(ReactApplicationContext reactContext) {
        super(reactContext);

        this.reactContext = reactContext;

        File root = android.os.Environment.getExternalStorageDirectory();
        storagePath = root.getAbsolutePath();

        String extStorageState = Environment.getExternalStorageState();
        storageReadOnly = Environment.MEDIA_MOUNTED_READ_ONLY.equals(extStorageState);
        storageAvailable = Environment.MEDIA_MOUNTED.equals(extStorageState);
    }

    @Override
    public String getName() {
        return "ExternalStorage";
    }

    @ReactMethod
    public void exists(String filepath, Promise promise) {
        boolean isExists = false;
        try {
            File file = new File(filepath);
            isExists = file.exists();
        } catch (Exception ex) {
            ex.printStackTrace();
            promise.reject(ex);
        }
        promise.resolve(isExists);
    }

    @ReactMethod
    public void writeFile(String filepath, String base64Content, Promise promise) {
        try {
            byte[] bytes = Base64.decode(base64Content, Base64.DEFAULT);

            OutputStream outputStream = getOutputStream(filepath, false);
            outputStream.write(bytes);
            outputStream.close();
        } catch (Exception ex) {
            ex.printStackTrace();
            promise.reject(ex);
        }

        promise.resolve(null);
    }

    @ReactMethod
    public void readFile(String filepath, Promise promise) {
        String base64 = "";
        try {
            InputStream inputStream = getInputStream(filepath);
            byte[] inputData = getInputStreamBytes(inputStream);
            base64 = Base64.encodeToString(inputData, Base64.NO_WRAP);
        } catch (Exception ex) {
            ex.printStackTrace();
            promise.reject(ex);
        }

        promise.resolve(base64);
    }

    @ReactMethod
    public void unlink(String filepath, Promise promise) {
        try {
            File file = new File(filepath);

            if (!file.exists()) throw new Exception("File does not exist");

            DeleteRecursive(file);

            promise.resolve(null);
        } catch (Exception ex) {
            ex.printStackTrace();
            promise.reject(ex);
        }
    }

    @ReactMethod
    public void mkdir(String filepath, Promise promise) {
        try {
            File file = new File(filepath);

            file.mkdirs();

            boolean exists = file.exists();

            if (!exists) throw new Exception("Directory could not be created");
        } catch (Exception ex) {
            ex.printStackTrace();
            promise.reject(ex);
        }

        promise.resolve(null);
    }

    /**
     * Возвращает true, если внешнее хранилище (SD) доступно только для чтения
     */
    @ReactMethod
    public void isStorageReadOnly(final Promise promise) {
        promise.resolve(storageReadOnly);
    }

    /**
     * Возвращает true, если внешнее хранилище (SD) доступно
     */
    @ReactMethod
    public void isStorageAvailable(final Promise promise) {
        promise.resolve(storageAvailable);
    }

    /**
     * Возвращает путь к внешнему хранилищу (SD)
     */
    @ReactMethod
    public void getPath(final Promise promise) {
        promise.resolve(storagePath);
    }

    private Uri getFileUri(String filepath, boolean isDirectoryAllowed) throws IORejectionException {
        Uri uri = Uri.parse(filepath);
        if (uri.getScheme() == null) {
            // No prefix, assuming that provided path is absolute path to file
            File file = new File(filepath);
            if (!isDirectoryAllowed && file.isDirectory()) {
                throw new IORejectionException("EISDIR", "EISDIR: illegal operation on a directory, read '" + filepath + "'");
            }
            uri = Uri.parse("file://" + filepath);
        }
        return uri;
    }

    private OutputStream getOutputStream(String filepath, boolean append) throws IORejectionException {
        Uri uri = getFileUri(filepath, false);
        OutputStream stream;
        try {
            stream = reactContext.getContentResolver().openOutputStream(uri, append ? "wa" : "w");
        } catch (FileNotFoundException ex) {
            throw new IORejectionException("ENOENT", "ENOENT: " + ex.getMessage() + ", open '" + filepath + "'");
        }
        if (stream == null) {
            throw new IORejectionException("ENOENT", "ENOENT: could not open an output stream for '" + filepath + "'");
        }
        return stream;
    }
    
    private InputStream getInputStream(String filepath) throws IORejectionException {
        Uri uri = getFileUri(filepath, false);
        InputStream stream;
        try {
            stream = reactContext.getContentResolver().openInputStream(uri);
        } catch (FileNotFoundException ex) {
            throw new IORejectionException("ENOENT", "ENOENT: " + ex.getMessage() + ", open '" + filepath + "'");
        }
        if (stream == null) {
            throw new IORejectionException("ENOENT", "ENOENT: could not open an input stream for '" + filepath + "'");
        }
        return stream;
    }

    private static byte[] getInputStreamBytes(InputStream inputStream) throws IOException {
        byte[] bytesResult;
        ByteArrayOutputStream byteBuffer = new ByteArrayOutputStream();
        int bufferSize = 1024;
        byte[] buffer = new byte[bufferSize];
        try {
            int len;
            while ((len = inputStream.read(buffer)) != -1) {
                byteBuffer.write(buffer, 0, len);
            }
            bytesResult = byteBuffer.toByteArray();
        } finally {
            try {
                byteBuffer.close();
            } catch (IOException ignored) {
            }
        }
        return bytesResult;
    }

    private void DeleteRecursive(File fileOrDirectory) {
        if (fileOrDirectory.isDirectory()) {
            for (File child : fileOrDirectory.listFiles()) {
                DeleteRecursive(child);
            }
        }

        fileOrDirectory.delete();
    }
}