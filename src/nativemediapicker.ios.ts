import * as application from "tns-core-modules/application";
export class Nativemediapicker {
    get() {
        let version = NSBundle.mainBundle.objectForInfoDictionaryKey("CFBundleShortVersionString");
        return version;
    }
    static registerFileProvider(provider) { }
    static pickFiles(mimeType, onResult, onError) {
        onError("ERROR: For ios this feature is comming soon.");
    }
    static takePicture(onResult, onError) {
        onError("ERROR: For ios this feature is comming soon.");
    }
    static recordVideo(onResult, onError) {
        onError("ERROR: For ios this feature is comming soon.");
    }
    static recordAudio(onResult, onError) {
        onError("ERROR: For ios this feature is comming soon.");
    }
}