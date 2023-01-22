export declare enum NativeActions {
    getConsentStatus = "getConsentStatus",
    getFormStatus = "getFormStatus",
    loadForm = "loadForm",
    ready = "ready",
    requestInfoUpdate = "requestInfoUpdate",
    requestTrackingAuthorization = "requestTrackingAuthorization",
    reset = "reset",
    showForm = "showForm",
    trackingAuthorizationStatus = "trackingAuthorizationStatus"
}
export declare enum Events {
    ready = "consent.ready"
}
export declare enum ConsentStatus {
    Unknown = 0,
    Required = 1,
    NotRequired = 2,
    Obtained = 3
}
export declare const execAsync: (action: string, args?: any[]) => Promise<unknown>;
export declare function waitEvent(successEvent: string, failEvent?: string): Promise<CustomEvent>;
export declare const initPlugin: () => void;
