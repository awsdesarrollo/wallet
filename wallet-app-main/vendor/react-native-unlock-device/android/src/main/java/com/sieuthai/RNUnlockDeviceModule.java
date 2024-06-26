
package com.sieuthai;

import android.app.Activity;
import android.content.Intent;
import android.os.Build;
import android.os.Bundle;
import android.util.Log;
import android.content.Context;
import android.os.PowerManager;
import android.app.KeyguardManager;
import android.app.KeyguardManager.KeyguardLock;
import android.view.Window;
import android.view.WindowManager;

import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.bridge.ReactContextBaseJavaModule;
import com.facebook.react.bridge.ReactMethod;
import com.facebook.react.bridge.Callback;
import com.facebook.react.bridge.UiThreadUtil;

public class RNUnlockDeviceModule extends ReactContextBaseJavaModule {

  private final ReactApplicationContext reactContext;
  private static final String TAG = "RNUnlockDevice";

  public RNUnlockDeviceModule(ReactApplicationContext reactContext) {
    super(reactContext);
    this.reactContext = reactContext;
  }

  @Override
  public String getName() {
    return "RNUnlockDevice";
  }

  @ReactMethod
  public void unlock() {
    Log.d(TAG, "manualTurnScreenOn()");
    UiThreadUtil.runOnUiThread(new Runnable() {
        public void run() {

            String packageName = reactContext.getPackageName();
            Intent launchIntent = reactContext.getPackageManager().getLaunchIntentForPackage(packageName);
            String className = launchIntent.getComponent().getClassName();

            try {
                Activity mCurrentActivity = getCurrentActivity();

                Class<?> activityClass = Class.forName(className);

                if (mCurrentActivity == null) {
                    Log.d(TAG, "ReactContext doesn't hava any Activity attached.");
                    return;
                }
                KeyguardManager keyguardManager = (KeyguardManager) reactContext.getSystemService(Context.KEYGUARD_SERVICE);
                KeyguardLock keyguardLock = keyguardManager.newKeyguardLock(Context.KEYGUARD_SERVICE);
                keyguardLock.disableKeyguard();
                
                PowerManager powerManager = (PowerManager) reactContext.getSystemService(Context.POWER_SERVICE);
                PowerManager.WakeLock wakeLock = powerManager.newWakeLock(
                          PowerManager.FULL_WAKE_LOCK
                        | PowerManager.ACQUIRE_CAUSES_WAKEUP
                        | PowerManager.SCREEN_BRIGHT_WAKE_LOCK
                        | PowerManager.ON_AFTER_RELEASE, "RNUnlockDeviceModule");
                
                wakeLock.acquire();
               // wakeLock.release();

                //if (!screenOn) {
                  Intent intent11 = new Intent(reactContext,activityClass);
                  intent11.addFlags(Intent.FLAG_ACTIVITY_NEW_TASK);
                 // intent11.addFlags(Intent.FLAG_ACTIVITY_RESET_TASK_IF_NEEDED);
                  mCurrentActivity.startActivity(intent11);
                /*} else {
                  Intent intent11 = new Intent(reactContext,activityClass);
                  intent11.addFlags(Intent.FLAG_ACTIVITY_NEW_TASK);
                }*/
                
                Window window = mCurrentActivity.getWindow();
              /* window.addFlags(WindowManager.LayoutParams.FLAG_SHOW_WHEN_LOCKED |
                WindowManager.LayoutParams.FLAG_DISMISS_KEYGUARD |
                WindowManager.LayoutParams.FLAG_KEEP_SCREEN_ON |
                WindowManager.LayoutParams.FLAG_TURN_SCREEN_ON);*/
                window.addFlags(WindowManager.LayoutParams.FLAG_SHOW_WHEN_LOCKED);
                window.addFlags(WindowManager.LayoutParams.FLAG_DISMISS_KEYGUARD);
                window.addFlags(WindowManager.LayoutParams.FLAG_KEEP_SCREEN_ON);
                window.addFlags(WindowManager.LayoutParams.FLAG_TURN_SCREEN_ON);
            } catch (Exception e) {
                return;
            }
        }
    });
  }
}