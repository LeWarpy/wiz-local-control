import { IsArray, IsBoolean, IsInt, IsOptional, IsString, ValidateNested } from "class-validator";
import * as networkConstants from "../constants";

export interface SetModelConfigMessageParameters {
  confTs: number,
  ps?: number,
  pwmFreq: number,
  pwmRange: number[],
  wcr: number,
  nowc: number,
  cctRange: number[]
  renderFactor: string,
  hasAdjMinDim?: boolean,
  hasTapSensor?: boolean,
  pm?: number,
  fanSpeed?: number
}

export class SetModelConfigParameters {
  @IsInt()
  confTs: number;
  @IsOptional()
  @IsInt()
  ps?: number;
  @IsInt()
  pwmFreq: number;
  @IsArray()
  pwmRange: number[];
  @IsInt()
  wcr: number;
  @IsInt()
  nowc: number;
  @IsArray()
  cctRange: number[];
  @IsString()
  renderFactor: string;
  @IsOptional()
  @IsBoolean()
  hasAdjMinDim?: boolean;
  @IsOptional()
  @IsBoolean()
  hasTapSensor?: boolean;
  @IsOptional()
  @IsInt()
  pm?: number;
  @IsOptional()
  @IsInt()
  fanSpeed?: number;


  constructor(parameters: SetModelConfigMessageParameters) {
    Object.assign(this, parameters);
  }
}
export class SetCCTTableMessage{
  method: "setCctTable";
  params:{
    cctPoints: ["12ff00007800","15ff0000ff00","1b000000ff00","28000000ffff","2a00000096ff","4100000000ff"],
    maxCctPower:2500,
    confTs:0
  }

  static buildCCTTableMessage():SetCCTTableMessage{
    const msg = new SetCCTTableMessage();
    return msg;
  }
}  
export class SetModelConfigMessage {
  method: "setModelConfig";
  version: number;
  id: number;
  @ValidateNested() params: SetModelConfigParameters;

  constructor() {
    this.method = networkConstants.setModelConfigMethod;
    this.version = 1;
    this.id = Math.floor(Math.random() * 10000 + 1);
  }

  /**
   * Constructs general message
   */
  static buildSetModelConfigMessage(
    parameters: SetModelConfigMessageParameters,
  ): SetModelConfigMessage {
    const msg = new SetModelConfigMessage();
    msg.params = new SetModelConfigParameters(parameters);
    return msg;
  }
}
