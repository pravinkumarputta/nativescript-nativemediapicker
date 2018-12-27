# nativescript-nativemediapicker
A complete media picker solution for NativeScript. You will be able to pickup any types of file. Capturing image, video & audio are supported. 

**Note:** For iOS this plugin is in under development, it contains dummy methods for ios return error :)

**Features:**

* Image, Video, Audio & custom file picker.
* Capturing Image, Video and Audio from APP directly.
* Custom files like pdf, text etc support.
* Single or Multiple selections.
* More...

**Limitations**
*  Now, only supported for android.


## Installation

```javascript
tns plugin add nativescript-nativemediapicker
```

## Android Permissions Required

```javascript
<uses-permission android:name="android.permission.READ_EXTERNAL_STORAGE" />
<uses-permission android:name="android.permission.WRITE_EXTERNAL_STORAGE" />
<uses-permission android:name="android.permission.READ_USER_DICTIONARY"/>
<uses-permission android:name="android.permission.CAMERA"/>
<uses-feature android:name="android.hardware.camera" android:required="true" />
```

**Add FileProvider to support (>=Android N) (create file_paths.xml in "app\App_Resources\Android\src\main\res\xml" & copy-paste following code)**
```javascript
<?xml version="1.0" encoding="utf-8"?>
<paths>
    <files-path path="demo/" name="myfiles" />
    <external-path name="mediafiles" path="." />
</paths>
```

**Add FileProvider tag to application tag in AndroidManifest.xml**
```javascript
<provider android:name="android.support.v4.content.FileProvider" android:authorities="{applicationId}.provider" android:grantUriPermissions="true" android:exported="false">
    <meta-data android:name="android.support.FILE_PROVIDER_PATHS"android:resource="@xml/file_paths" />
</provider>
```

## Usage (Please check demo project for details)

**Import**

JavaScript:
```javascript
var nativemediapicker = require("nativescript-nativemediapicker");
```

TS:
```javascript
import { Nativemediapicker } from 'nativescript-nativemediapicker';
```

**File Picker**
```javascript
// replace first parameter with your mime type
Nativemediapicker.pickFiles("image/*",
    function(res){
		console.log(res);
	},
    function(err){
		console.log(err);
	});
```


**Capture Image**
```javascript
// registerFileProvider is needed to capture image
Nativemediapicker.registerFileProvider(
      application.android.currentContext.getPackageName() +
        ".provider"
    );
Nativemediapicker.takePicture(
    function(res){
		console.log(res);
	},
    function(err){
		console.log(err);
	});
```

**Capture Video**
```javascript
Nativemediapicker.recordVideo(
    function(res){
		console.log(res);
	},
    function(err){
		console.log(err);
	});
```

**Capture Audio**
```javascript
Nativemediapicker.recordAudio(
    function(res){
    	console.log(res);
    },
    function(err){
    	console.log(err);
    });
```


## Screenshots

**Android**

![Android](https://raw.githubusercontent.com/pravinkumarputta/nativescript-nativemediapicker/master/screenshots/android/demo.png)
![Android](https://raw.githubusercontent.com/pravinkumarputta/nativescript-nativemediapicker/master/screenshots/android/filepicker.png)
![Android](https://raw.githubusercontent.com/pravinkumarputta/nativescript-nativemediapicker/master/screenshots/android/capture.png)


## License

Apache License Version 2.0, January 2004