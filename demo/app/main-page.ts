import * as observable from 'tns-core-modules/data/observable';
import * as pages from 'tns-core-modules/ui/page';
import { Button } from "tns-core-modules/ui/button";
import { HelloWorldModel } from './main-view-model';
import { Nativemediapicker } from 'nativescript-nativemediapicker';
import * as application from "tns-core-modules/application";
import * as Alerts from "tns-core-modules/ui/dialogs";
import { getViewById } from "tns-core-modules/ui/core/view";
import { Label } from "tns-core-modules/ui/label";
import { View } from "tns-core-modules/ui/core/view";

// Event handler for Page 'loaded' event attached in main-page.xml
let mainObject: HelloWorldModel;
let buttonParent;
export function pageLoaded(args: observable.EventData) {
    // Get the event sender
    let page = <pages.Page>args.object;
    mainObject = new HelloWorldModel();
    page.bindingContext = mainObject;
}

function onMediaPickerResult(res) {
    if (buttonParent) {
        let lbl = <Label>getViewById(buttonParent, "mainText");
        if (lbl) {
            lbl.text = JSON.stringify(res);
        }
    }
}
function onMediaPickerError(err) {
    if (buttonParent) {
        let lbl = <Label>getViewById(buttonParent, "mainText");
        if (lbl) {
            lbl.text = JSON.stringify(err);
        }
    }
}

export function onSelectFiles(args: observable.EventData) {
    let button = <Button>args.object;
    buttonParent = button.parent;
    Nativemediapicker.pickFiles("image/*",
        onMediaPickerResult.bind(this),
        onMediaPickerError.bind(this));
}

export function onCapture(args: observable.EventData) {
    let button = <Button>args.object;
    buttonParent = button.parent;
    Alerts.action("Choose one!", "Or cancel...", ["Image", "Video", "Audio"]).then(
        result => {
            console.log(result);
            if (result === "Image") {
                Nativemediapicker.registerFileProvider(
                    application.android.foregroundActivity.getPackageName() +
                    ".fileprovider"
                );
                Nativemediapicker.takePicture(
                    onMediaPickerResult.bind(this),
                    onMediaPickerError.bind(this)
                );
            } else if (result === "Video") {
                Nativemediapicker.recordVideo(
                    onMediaPickerResult.bind(this),
                    onMediaPickerError.bind(this)
                );
            } else if (result === "Audio") {
                Nativemediapicker.recordAudio(
                    onMediaPickerResult.bind(this),
                    onMediaPickerError.bind(this)
                );
            }
        }
    );
}
