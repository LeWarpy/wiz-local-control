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

export interface SetCctTableMessageParameters {
  cctPoints?: string[],
  maxCctPower?: number,
  confTs?: number,
}

export class SetCctTableParameters {
  @IsArray()
  cctPoints: string[];
  @IsInt()
  maxCctPower: number;
  @IsInt()
  confTs: number;


  constructor(parameters: SetCctTableMessageParameters) {
    Object.assign(this, parameters);
  }
}

export class SetCctTableMessage {
  method: "setCctTable";
  params: SetCctTableParameters;

  constructor() {
    this.method = networkConstants.setCctTableMethod;
  }

  /**
   * Constructs general message
   */
  static buildSetCctTableMessage(
    parameters: SetCctTableMessageParameters,
  ): SetCctTableMessage {
    const msg = new SetCctTableMessage();
    msg.params = new SetCctTableParameters(parameters);
    return msg;
  }
}