import { ConsentStatus } from './generated';
export declare enum DebugGeography {
    Disabled = 0,
    EEA = 1,
    NotEEA = 2
}
declare type RequestInfoUpdateOptions = {
    debugGeography?: DebugGeography;
    tagForUnderAgeOfConsent?: boolean;
    testDeviceIds?: string[];
};
export declare enum FormStatus {
    Unknown = 0,
    Available = 1,
    Unavailable = 2
}
export declare enum TrackingAuthorizationStatus {
    notDetermined = 0,
    restricted = 1,
    denied = 2,
    authorized = 3
}
export declare class ConsentForm {
    readonly id: number;
    constructor(id: number);
    show(): Promise<unknown>;
}
export declare class Consent {
    readonly ConsentStatus: typeof ConsentStatus;
    readonly DebugGeography: typeof DebugGeography;
    readonly FormStatus: typeof FormStatus;
    constructor();
    trackingAuthorizationStatus(): Promise<TrackingAuthorizationStatus | false>;
    requestTrackingAuthorization(): Promise<TrackingAuthorizationStatus | false>;
    getConsentStatus(): Promise<ConsentStatus>;
    getFormStatus(): Promise<FormStatus>;
    requestInfoUpdate(opts?: RequestInfoUpdateOptions): Promise<unknown>;
    loadForm(): Promise<ConsentForm>;
    reset(): Promise<unknown>;
}
export {};
