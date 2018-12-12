export declare class Nativemediapicker {
  get(): string;
  static registerFileProvider(provider);
  static pickFiles(mimeType, onResult, onError);
  static takePicture(onResult, onError);
  static recordVideo(onResult, onError);
  static recordAudio(onResult, onError);
}