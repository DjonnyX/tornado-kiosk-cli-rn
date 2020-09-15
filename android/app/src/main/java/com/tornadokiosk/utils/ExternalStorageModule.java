package com.tornadokiosk.utils;

import android.content.Context;
import android.os.Environment;
import android.util.Log;

import com.facebook.react.bridge.Promise;
import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.bridge.ReactContextBaseJavaModule;
import com.facebook.react.bridge.ReactMethod;

import java.io.File;
import java.io.FileNotFoundException;
import java.io.FileOutputStream;
import java.io.IOException;
import java.io.PrintWriter;

public class ExternalStorageModule extends ReactContextBaseJavaModule {

    public ExternalStorageModule(ReactApplicationContext reactContext) {
        super(reactContext);
    }

    @Override
    public String getName() {
        return "ExternalStorage";
    }

    @ReactMethod
    public void writeToSDFile(final String path, final String fileName, final String data, final Promise promise) {
        try {
            _writeToSDFile(path, fileName, data);
        } catch (Exception e) {
            promise.reject(e.getMessage());
            return;
        }
        promise.resolve(true);
    }

    @ReactMethod
    public void isExternalStorageReadOnly(final Promise promise) {
        boolean isReadOnly;
        try {
            isReadOnly = _isExternalStorageReadOnly();
        } catch (Exception e) {
            promise.reject(e.getMessage());
            return;
        }
        promise.resolve(isReadOnly);
    }

    @ReactMethod
    public void isExternalStorageAvailable(final Promise promise) {
        boolean isAvailable;
        try {
            isAvailable = _isExternalStorageAvailable();
        } catch (Exception e) {
            promise.reject(e.getMessage());
            return;
        }
        promise.resolve(isAvailable);
    }

    private boolean _isExternalStorageReadOnly() {
        String extStorageState = Environment.getExternalStorageState();
        if (Environment.MEDIA_MOUNTED_READ_ONLY.equals(extStorageState)) {
            return true;
        }
        return false;
    }

    private boolean _isExternalStorageAvailable() {
        String extStorageState = Environment.getExternalStorageState();
        if (Environment.MEDIA_MOUNTED.equals(extStorageState)) {
            return true;
        }
        return false;
    }

    private void _writeToSDFile(String path, String fileName, String data) {
        File root = android.os.Environment.getExternalStorageDirectory();

        File dir = new File (root.getAbsolutePath() + "/" + path);
        dir.mkdirs();
        File file = new File(dir, fileName);

        try {
            FileOutputStream f = new FileOutputStream(file);
            PrintWriter pw = new PrintWriter(f);
            pw.write(data);
            pw.flush();
            pw.close();
            f.close();
        } catch (FileNotFoundException e) {
            e.printStackTrace();
        } catch (IOException e) {
            e.printStackTrace();
        }
    }
}