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
export declare class SetCCTTableMessage {
    method: "setCctTable";
    params: {
        cctPoints: ["12ff00007800", "15ff0000ff00", "1b000000ff00", "28000000ffff", "2a00000096ff", "4100000000ff"];
        maxCctPower: 2500;
        confTs: 0;
    };
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
