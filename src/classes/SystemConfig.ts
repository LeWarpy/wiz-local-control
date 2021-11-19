import { IsArray, IsInt, IsOptional, IsString, ValidateNested } from "class-validator";
import { convertPWMRefreshRateToPWMConf } from "../helpers";
import * as networkConstants from "../constants";

export interface SetSystemConfigMessageParameters {
  environment?: string;
  moduleName?: string;
  extendedWhiteFactor?: string;
  pwmRefreshRate?: number;
  whiteChannels?: number;
  whiteToColorsRatio?: number;
  ewf?: string;
  fs?: number;
  drvConf?: number[];
}

/**
 * Set system config messages parameters for request
 */
export class SetSystemConfigParameters {
  @IsOptional()
  @IsString()
  env?: string;
  @IsOptional()
  @IsInt()
  systemConfigTs: number;
  @IsOptional()
  @IsString()
  moduleName?: string;
  @IsOptional()
  @IsString()
  ewf?: string;
  @IsOptional()
  @IsString()
  pwmConf?: string;
  @IsOptional()
  @IsArray()
  drvConf?: number[];
  @IsOptional()
  @IsInt()
  fs?: number;

  constructor(parameters: SetSystemConfigMessageParameters) {
    Object.assign(this, parameters);
  }
}

export class SetSystemConfigMessage {
  method: "setSystemConfig";
  version: number;
  id: number;
  @ValidateNested() params: SetSystemConfigParameters;

  constructor() {
    this.method = networkConstants.setSystemConfigMethod;
    this.version = 1;
    this.id = Math.floor(Math.random() * 10000 + 1);
  }

  /**
   * Constructs firmware update message
   */
  static buildSetEnvironmentMessage(
    environment: string,
  ): SetSystemConfigMessage {
    const msg = new SetSystemConfigMessage();
    msg.params = new SetSystemConfigParameters({
      environment,
    });
    return msg;
  }

  /**
   * Constructs changing of module name message
   */
  static buildSetModuleNameMessage(moduleName: string): SetSystemConfigMessage {
    const msg = new SetSystemConfigMessage();
    msg.params = new SetSystemConfigParameters({
      moduleName,
    });
    return msg;
  }

  /**
   * Constructs update ewf message
   */
  static buildSetExtendedWhiteFactorMessage(
    extendedWhiteFactor: string,
  ): SetSystemConfigMessage {
    const msg = new SetSystemConfigMessage();
    msg.params = new SetSystemConfigParameters({
      extendedWhiteFactor,
    });
    return msg;
  }

  /**
   * Constructs general message
   */
  static buildSetSystemConfigMessage(
    parameters: SetSystemConfigMessageParameters,
  ): SetSystemConfigMessage {
    const msg = new SetSystemConfigMessage();
    msg.params = new SetSystemConfigParameters(parameters);
    return msg;
  }
}

/**
 * WiZ Light system configuration (fwVersion for example)
 */
export type GetSystemConfigResponse = {
  method: "getSystemConfig";
  result: {
    homeId: number;
    lock: boolean;
    groupId: number;
    typeId: number;
    fwOtaStatus: number;
    fwVersion: string;
  };
};

/**
 * Message sent to the lamp requesting its system configuration (fwVersion for example)
 */
export class GetSystemConfigMessage {
  method: "getSystemConfig";
  version: number;
  id: number;

  constructor() {
    this.method = networkConstants.getSystemConfigMethod;
    this.id = Math.floor(Math.random() * 10000 + 1);
    this.version = 1;
  }
}
