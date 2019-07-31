import * as application from "tns-core-modules/application";
import {
    requestPermissions
} from "nativescript-permissions";

declare let android, global: any;

function useAndroidX() {
    return global.androidx && global.androidx.appcompat;
}

let fileProvider = null;
export class Nativemediapicker {
    private REQ_FILE = 1111;
    private REQ_IMAGE = 2222;
    private REQ_VIDEO = 3333;
    private REQ_AUDIO = 4444;
    private mCurrentPhotoPath: any;
    private imagePath: any;
    private postResult: any;
    private postError: any;
    private resultEvent: any;
    constructor() {
        this.registerActivityResult();
    }
    get() {
        let PackageManager = android.content.pm.PackageManager;
        let pkg = application.android.foregroundActivity.getPackageManager().getPackageInfo(application.android.foregroundActivity.getPackageName(),
            PackageManager.GET_META_DATA);
        return pkg.versionName;
    }
    static registerFileProvider(provider) {
        fileProvider = provider;
    }
    static pickFiles(mimeType, onResult, onError) {
        let mediaPicker = new Nativemediapicker();
        mediaPicker.postResult = onResult;
        mediaPicker.postError = onError;
        requestPermissions([android.Manifest.permission.CAMERA, android.Manifest.permission.WRITE_EXTERNAL_STORAGE], "Need permission for access media & storage.").then(() => {
            mediaPicker.openFileChooser(mimeType);
        }).catch((error) => {
            onError("Permissions denied");
        });
    }
    static takePicture(onResult, onError) {
        let mediaPicker = new Nativemediapicker();
        mediaPicker.postResult = onResult;
        mediaPicker.postError = onError;
        requestPermissions([android.Manifest.permission.CAMERA, android.Manifest.permission.WRITE_EXTERNAL_STORAGE], "Need permission for access media & storage.").then(() => {
            if (fileProvider == null) {
                onError('ERROR: File provider not registered. Please register file provider using "MediaPicker.registerFileProvider()" method.');
                return;
            }
            mediaPicker.captureImage();
        }).catch(() => {
            onError("Permissions denied");
        });
    }
    static recordVideo(onResult, onError) {
        let mediaPicker = new Nativemediapicker();
        mediaPicker.postResult = onResult;
        mediaPicker.postError = onError;
        requestPermissions([android.Manifest.permission.CAMERA, android.Manifest.permission.WRITE_EXTERNAL_STORAGE], "Need permission for access media & storage.").then(() => {
            mediaPicker.captureVideo();
        }).catch(() => {
            onError("Permissions denied");
        });
    }
    static recordAudio(onResult, onError) {
        let mediaPicker = new Nativemediapicker();
        mediaPicker.postResult = onResult;
        mediaPicker.postError = onError;
        requestPermissions([android.Manifest.permission.CAMERA, android.Manifest.permission.WRITE_EXTERNAL_STORAGE], "Need permission for access media & storage.").then(() => {
            mediaPicker.captureAudio();
        }).catch(() => {
            onError("Permissions denied");
        });
    }
    registerActivityResult() {
        this.resultEvent = application.android.on(
            application.AndroidApplication.activityResultEvent,
            this.activityResultEvent.bind(this)
        );
    }
    openFileChooser(filetype) {
        let pickFilesIntent = new android.content.Intent();
        pickFilesIntent.setType(filetype.toLocaleLowerCase());
        pickFilesIntent.setAction(android.content.Intent.ACTION_GET_CONTENT);
        pickFilesIntent.putExtra(
            android.content.Intent['EXTRA_ALLOW_MULTIPLE'],
            true
        );

        if (
            pickFilesIntent.resolveActivity(
                application.android.foregroundActivity.getPackageManager()
            ) != null
        ) {
            application.android.foregroundActivity.startActivityForResult(
                android.content.Intent.createChooser(
                    pickFilesIntent,
                    "Select files"
                ),
                this.REQ_FILE
            );
        }
    }
    activityResultEvent(args) {
        if (this.postResult === undefined || this.postError === undefined) {
            return;
        }
        let selectedFiles = [];
        if (
            args.requestCode === this.REQ_IMAGE &&
            args.resultCode === android.app.Activity.RESULT_OK
        ) {
            selectedFiles.push({
                type: "image",
                path: this.mCurrentPhotoPath
            });
            this.postResult(selectedFiles);
        }
        if (
            args.requestCode === this.REQ_AUDIO &&
            args.resultCode === android.app.Activity.RESULT_OK
        ) {
            let path = RealPathUtil.getRealPath(
                application.android.foregroundActivity,
                args.intent.getData()
            );
            selectedFiles.push({
                type: "audio",
                path: path
            });
            this.postResult(selectedFiles);
        }
        if (
            args.requestCode === this.REQ_VIDEO &&
            args.resultCode === android.app.Activity.RESULT_OK
        ) {
            let path = RealPathUtil.getRealPath(
                application.android.foregroundActivity,
                args.intent.getData()
            );
            selectedFiles.push({
                type: "video",
                path: path
            });
            this.postResult(selectedFiles);
        }
        if (
            args.requestCode === this.REQ_FILE &&
            args.resultCode === android.app.Activity.RESULT_OK
        ) {
            let data = args.intent;
            try {
                if (data.getClipData() != null) {
                    for (let i = 0; i < data.getClipData().getItemCount(); i++) {
                        let uri = data
                            .getClipData()
                            .getItemAt(i)
                            .getUri();
                        let path = RealPathUtil.getRealPath(
                            application.android.foregroundActivity,
                            uri
                        );
                        selectedFiles.push({
                            type: this.getFileType(uri),
                            path: path
                        });
                    }
                } else {
                    let uri = data.getData();
                    let path = RealPathUtil.getRealPath(
                        application.android.foregroundActivity,
                        uri
                    );
                    selectedFiles.push({
                        type: this.getFileType(uri),
                        path: path
                    });
                }
                this.postResult(selectedFiles);
            } catch (error) {
                this.postError(error);
            }
        }
        application.android.off(
            application.AndroidApplication.activityResultEvent, this.resultEvent);
    }
    captureImage() {
        let takePictureIntent = new android.content.Intent(
            android.provider.MediaStore.ACTION_IMAGE_CAPTURE
        );
        // Ensure that there's a camera activity to handle the intent
        if (
            takePictureIntent.resolveActivity(
                application.android.foregroundActivity.getPackageManager()
            ) != null
        ) {
            // Create the File where the photo should go
            let photoFile = null;
            try {
                photoFile = this.createImageFile();
            } catch (exception) {
                console.log(exception);
                // Error occurred while creating the File
            }
            // Continue only if the File was successfully created
            if (photoFile != null) {
                this.imagePath = (useAndroidX()) ? androidx.core.content.FileProvider.getUriForFile(
                    application.android.foregroundActivity,
                    fileProvider,
                    photoFile
                ) : android.support.v4.content.FileProvider.getUriForFile(
                    application.android.foregroundActivity,
                    fileProvider,
                    photoFile
                );
                takePictureIntent.putExtra(
                    android.provider.MediaStore.EXTRA_OUTPUT,
                    this.imagePath
                );
                application.android.foregroundActivity.startActivityForResult(
                    takePictureIntent,
                    this.REQ_IMAGE
                );
            }
        }
    }
    createImageFile() {
        let image;
        try {
            // Create an image file name
            let timeStamp = new java.text.SimpleDateFormat(
                "yyyyMMdd_HHmmss"
            ).format(new java.util.Date());
            let imageFileName = "JPEG_" + timeStamp + "_";
            let storageDir = application.android.foregroundActivity.getExternalFilesDir(
                android.os.Environment.DIRECTORY_PICTURES
            );
            image = java.io.File.createTempFile(
                imageFileName /* prefix */,
                ".jpg" /* suffix */,
                storageDir /* directory */
            );

            // Save a file: path for use with ACTION_VIEW intents
            this.mCurrentPhotoPath = image.getAbsolutePath();
        } catch (error) {
            this.postError(error);
        }
        return image;
    }
    getFileType(uri) {
        let type = application.android.foregroundActivity.getContentResolver().getType(uri);
        return type.split("/")[0];
    }
    captureVideo() {
        let takeVideoIntent = new android.content.Intent(
            android.provider.MediaStore.ACTION_VIDEO_CAPTURE
        );
        if (
            takeVideoIntent.resolveActivity(
                application.android.foregroundActivity.getPackageManager()
            ) != null
        ) {
            application.android.foregroundActivity.startActivityForResult(
                takeVideoIntent,
                this.REQ_VIDEO
            );
        }
    }
    captureAudio() {
        let intent = new android.content.Intent(
            android.provider.MediaStore.Audio.Media.RECORD_SOUND_ACTION
        );
        application.android.foregroundActivity.startActivityForResult(
            intent,
            this.REQ_AUDIO
        );
    }
}

export default class RealPathUtil {
    static getRealPath(context, fileUri) {
        let realPath;
        // SDK < API11
        if (android.os.Build.VERSION.SDK_INT < 11) {
            realPath = RealPathUtil.getRealPathFromURI_BelowAPI11(context, fileUri);
        }
        // SDK >= 11 && SDK < 19
        else if (android.os.Build.VERSION.SDK_INT < 19) {
            realPath = RealPathUtil.getRealPathFromURI_API11to18(context, fileUri);
        }
        // SDK > 19 (Android 4.4) and up
        else {
            realPath = RealPathUtil.getRealPathFromURI_API19(context, fileUri);
        }
        return realPath;
    }


    static getRealPathFromURI_API11to18(context, contentUri) {
        let proj = [
            android.provider.MediaStore.Images.Media['DATA']
        ];
        let result = null;

        let v4Lib = useAndroidX() ? android.v4 : android.support.v4;
        let cursorLoader = new v4Lib.content.CursorLoader(context, contentUri, proj, null, null, null);
        let cursor = cursorLoader.loadInBackground();

        if (cursor != null) {
            let column_index = cursor.getColumnIndexOrThrow(android.provider.MediaStore.Images.Media['DATA']);
            cursor.moveToFirst();
            result = cursor.getString(column_index);
            cursor.close();
        }
        return result;
    }

    static getRealPathFromURI_BelowAPI11(context, contentUri) {
        let proj = [
            android.provider.MediaStore.Images.Media['DATA']
        ];
        let cursor = context.getContentResolver().query(contentUri, proj, null, null, null);
        let column_index = 0;
        let result = "";
        if (cursor != null) {
            column_index = cursor.getColumnIndexOrThrow(android.provider.MediaStore.Images.Media['DATA']);
            cursor.moveToFirst();
            result = cursor.getString(column_index);
            cursor.close();
            return result;
        }
        return result;
    }

    static getRealPathFromURI_API19(context, uri) {

        let isKitKat = android.os.Build.VERSION.SDK_INT >= android.os.Build.VERSION_CODES['KITKAT'];

        // DocumentProvider
        if (isKitKat && android.provider['DocumentsContract'].isDocumentUri(context, uri)) {
            // ExternalStorageProvider
            if (RealPathUtil.isExternalStorageDocument(uri)) {
                let docId = android.provider['DocumentsContract'].getDocumentId(uri);
                let split = docId.split(":");
                let type = split[0];

                if ("primary".toLocaleLowerCase() === type.toLocaleLowerCase()) {
                    return android.os.Environment.getExternalStorageDirectory() + "/" + split[1];
                }

                // TODO handle non-primary volumes
            }
            // DownloadsProvider
            else if (RealPathUtil.isDownloadsDocument(uri)) {

                let id = android.provider['DocumentsContract'].getDocumentId(uri);
                let contentUri = android.content.ContentUris.withAppendedId(
                    android.net.Uri.parse("content://downloads/public_downloads"), parseInt(id));

                return RealPathUtil.getDataColumn(context, contentUri, null, null);
            }
            // MediaProvider
            else if (RealPathUtil.isMediaDocument(uri)) {
                let docId = android.provider['DocumentsContract'].getDocumentId(uri);
                let split = docId.split(":");
                let type = split[0];

                let contentUri = null;
                if ("image" === type) {
                    contentUri = android.provider.MediaStore.Images.Media.EXTERNAL_CONTENT_URI;
                } else if ("video" === type) {
                    contentUri = android.provider.MediaStore.Video.Media.EXTERNAL_CONTENT_URI;
                } else if ("audio" === type) {
                    contentUri = android.provider.MediaStore.Audio.Media.EXTERNAL_CONTENT_URI;
                }

                let selection = "_id=?";
                let selectionArgs = [
                    split[1]
                ];

                return RealPathUtil.getDataColumn(context, contentUri, selection, selectionArgs);
            }
        }
        // android.provider.MediaStore (and general)
        else if ("content".toLocaleLowerCase() === uri.getScheme().toLocaleLowerCase()) {

            // Return the remote address
            if (RealPathUtil.isGooglePhotosUri(uri))
                return uri.getLastPathSegment();

            return RealPathUtil.getDataColumn(context, uri, null, null);
        }
        // File
        else if ("file".toLocaleLowerCase() === uri.getScheme().toLocaleLowerCase()) {
            return uri.getPath();
        }

        return null;
    }

    static getDataColumn(context, uri, selection,
        selectionArgs) {

        let cursor = null;
        let column = "_data";
        let projection = [column];

        try {
            cursor = context.getContentResolver().query(uri, projection, selection, selectionArgs,
                null);
            if (cursor != null && cursor.moveToFirst()) {
                let index = cursor.getColumnIndexOrThrow(column);
                return cursor.getString(index);
            }
        } finally {
            if (cursor != null)
                cursor.close();
        }
        return null;
    }

    static isExternalStorageDocument(uri) {
        return "com.android.externalstorage.documents".toLocaleLowerCase() === uri.getAuthority().toLocaleLowerCase();
    }

    static isDownloadsDocument(uri) {
        return "com.android.providers.downloads.documents".toLocaleLowerCase() === uri.getAuthority().toLocaleLowerCase();
    }

    static isMediaDocument(uri) {
        return "com.android.providers.media.documents".toLocaleLowerCase() === uri.getAuthority().toLocaleLowerCase();
    }

    static isGooglePhotosUri(uri) {
        return "com.google.android.apps.photos.content".toLocaleLowerCase() === uri.getAuthority().toLocaleLowerCase();
    }
}