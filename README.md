# TornadoKiosk

## Install app as kiosk mode

Установка администратора устройства:

```
adb shell dpm set-device-owner com.tornadokiosk/.TornadoAdmin
```

Обновление приложения:

```
adb install -r path/to/tornado-kiosk.apk
```

Удаление администратора устройства:

```
adb shell dpm remove-active-admin com.tornadokiosk/.TornadoAdmin
```

source:
https://snow.dog/blog/kiosk-mode-android
http://wenchaojiang.github.io/blog/realise-Android-kiosk-mode/


Запуск приложения:

```
adb shell
am start -n com.tornadokiosk/com.tornadokiosk.MainActivity
```