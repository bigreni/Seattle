// THIS IS AN AUTOGENERATED FILE. DO NOT EDIT THIS FILE DIRECTLY.
/// <reference types="cordova-plus" />
export var NativeActions;
(function (NativeActions) {
    NativeActions["getConsentStatus"] = "getConsentStatus";
    NativeActions["getFormStatus"] = "getFormStatus";
    NativeActions["loadForm"] = "loadForm";
    NativeActions["ready"] = "ready";
    NativeActions["requestInfoUpdate"] = "requestInfoUpdate";
    NativeActions["requestTrackingAuthorization"] = "requestTrackingAuthorization";
    NativeActions["reset"] = "reset";
    NativeActions["showForm"] = "showForm";
    NativeActions["trackingAuthorizationStatus"] = "trackingAuthorizationStatus";
})(NativeActions || (NativeActions = {}));
export var Events;
(function (Events) {
    Events["ready"] = "consent.ready";
})(Events || (Events = {}));
export var ConsentStatus;
(function (ConsentStatus) {
    ConsentStatus[ConsentStatus["Unknown"] = 0] = "Unknown";
    ConsentStatus[ConsentStatus["Required"] = 1] = "Required";
    ConsentStatus[ConsentStatus["NotRequired"] = 2] = "NotRequired";
    ConsentStatus[ConsentStatus["Obtained"] = 3] = "Obtained";
})(ConsentStatus || (ConsentStatus = {}));
export var execAsync = function (action, args) {
    return new Promise(function (resolve, reject) {
        cordova.exec(resolve, reject, 'Consent', action, args);
    });
};
export function waitEvent(successEvent, failEvent) {
    if (failEvent === void 0) { failEvent = ''; }
    return new Promise(function (resolve, reject) {
        document.addEventListener(successEvent, function (event) {
            resolve(event);
        }, false);
        if (failEvent) {
            document.addEventListener(failEvent, function (failedEvent) {
                reject(failedEvent);
            }, false);
        }
    });
}
export var initPlugin = function () {
    document.addEventListener('deviceready', function () {
        cordova.exec(function (event) {
            cordova.fireDocumentEvent(event.type, event.data);
        }, console.error, 'Consent', NativeActions.ready);
    }, false);
};
//# sourceMappingURL=generated.js.map