export interface SetModelConfigMessageParameters {
    confTs: number;
    ps?: number;
    pwmFreq: number;
    pwmRange: number[];
    wcr: number;
    nowc: number;
    cctRange: number[];
    renderFactor: string;
    hasAdjMinDim?: boolean;
    hasTapSensor?: boolean;
    pm?: number;
    fanSpeed?: number;
}
export declare class SetModelConfigParameters {
    confTs: number;
    ps?: number;
    pwmFreq: number;
    pwmRange: number[];
    wcr: number;
    nowc: number;
    cctRange: number[];
    renderFactor: string;
    hasAdjMinDim?: boolean;
    hasTapSensor?: boolean;
    pm?: number;
    fanSpeed?: number;
    constructor(parameters: SetModelConfigMessageParameters);
}
export declare class SetCctTableParameters {
    confTs: number;
    maxCctPower: number;
    cctPoints: string[];
    constructor();
}
export declare class SetCCTTableMessage {
    method: string;
    params: SetCctTableParameters;
    constructor();
    static buildCCTTableMessage(): SetCCTTableMessage;
}
export declare class SetModelConfigMessage {
    method: "setModelConfig";
    version: number;
    id: number;
    params: SetModelConfigParameters;
    constructor();
    /**
     * Constructs general message
     */
    static buildSetModelConfigMessage(parameters: SetModelConfigMessageParameters): SetModelConfigMessage;
}
