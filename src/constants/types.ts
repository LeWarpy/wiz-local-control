import * as networkConstants from "../constants/communication";
import { validate, IsInt, Min, Max, ValidateNested } from "class-validator";

/**
 * Scene type – built in the bulb scenes. Could be one of the scenes listed
 * in staticScenes const
 */
export type Scene = {
  type: "scene";
  sceneId: number;
  name: string;
};

/**
 * Light Mode type,
 * could be either
 * 1. Scene – determined by sceneId (1-28)
 * 2. Color - determined by Red, Green, Blue, Cool White, Warm White
 * (0-255). There is a limit on a maximum amount of channels used in the same time:
 * 3 RGB or 2 RGB + 1 White or 2 Whites
 * 3. Color temperature – form color temperature using Cool and Warm white LEDs (2200-6500)
 */
export type LightMode =
  | Scene
  | {
      type: "color";
      r: number;
      g: number;
      b: number;
      cw: number;
      ww: number;
    }
  | {
      type: "temperature";
      colorTemperature: number;
    };

/**
 * Incoming message that lamp sends to report its status
 */
export type SyncPilotMessage = {
  method: "syncPilot";
  id: number;
  env: string;
  timestamp: Date;
  ip: string;
  params: {
    r?: number;
    g?: number;
    b?: number;
    w?: number;
    c?: number;
    state?: boolean;
    sceneId?: number;
    temp?: number;
    dimming?: number;
    rssi: number;
    mac: string;
  };
};

/**
 * Acknowledgement message device should send to
 * the lamp on receiving SyncPilot message
 */
export type SyncPilotAckMessage = {
  method: "syncPilot";
  id: number;
  env: string;
  result: {
    mac: string;
  };
};

/**
 * Message sent to the lamp requesting its status
 */
export type GetPilotMessage = {
  method: "getPilot";
  version: number;
  id: number;
};

/**
 * Set Pilot messages parameters for changing color
 */
export class SetPilotParametersColor {
  @IsInt()
  @Min(0)
  @Max(255)
  r?: number;
  @IsInt()
  @Min(0)
  @Max(255)
  g?: number;
  @IsInt()
  @Min(0)
  @Max(255)
  b?: number;
  @IsInt()
  @Min(0)
  @Max(255)
  w?: number;
  @IsInt()
  @Min(0)
  @Max(255)
  c?: number;

  constructor(r: number, g: number, b: number, whiteLevel: number) {
    this.r = r;
    this.g = g;
    this.b = b;
    this.w = whiteLevel;
  }
}

/**
 * Set Pilot messages parameters for scene
 */
export class SetPilotParametersScene {
  @IsInt()
  @Min(1)
  @Max(28)
  sceneId?: number;

  constructor(sceneId: number) {
    this.sceneId = sceneId;
  }
}

/**
 * Set Pilot messages parameters for status
 */
export class SetPilotParametersStatus {
  state?: boolean;

  constructor(status: boolean) {
    this.state = status;
  }
}

/**
 * Set Pilot messages parameters for changing dimming
 */
export class SetPilotParametersDimming {
  @IsInt()
  @Min(10)
  @Max(100)
  dimming?: number;

  constructor(dimming: number) {
    this.dimming = dimming;
  }
}

/**
 * Set Pilot messages parameters for changing speed
 */
export class SetPilotParametersSpeed {
  @IsInt()
  @Min(20)
  @Max(200)
  speed?: number;

  constructor(speed: number) {
    this.speed = speed;
  }
}

/**
 * Set Pilot messages parameters for changing color temperature
 */
export class SetPilotParametersColorTemperature {
  @IsInt()
  @Min(2200)
  @Max(6500)
  temp?: number;

  constructor(temperature: number) {
    this.temp = temperature;
  }
}

export type SetPilotParams =
  | SetPilotParametersColor
  | SetPilotParametersColorTemperature
  | SetPilotParametersDimming
  | SetPilotParametersScene
  | SetPilotParametersSpeed
  | SetPilotParametersStatus;

export class SetPilotMessage {
  method: "setPilot";
  version: number;
  id: number;
  @ValidateNested() params: SetPilotParams;

  constructor() {
    this.method = networkConstants.setPilotMethod;
    this.id = Math.floor(Math.random() * 10000 + 1);
    this.version = 1;
  }
  /**
   * Constructs dimming control message
   * @param dimming - Integer, valid range is 10-100
   */
  static buildDimmingControlMessage(dimming: number): SetPilotMessage {
    const msg = new SetPilotMessage();
    msg.params = new SetPilotParametersDimming(dimming);
    return msg;
  }

  /**
   * Constructs status control message
   * @param status - Boolean, true - turn the lamp on, false - off
   */
  static buildStatusControlMessage(status: boolean): SetPilotMessage {
    const msg = new SetPilotMessage();
    msg.params = new SetPilotParametersStatus(status);
    return msg;
  }

  /**
   * Constructs scene control message
   * @param scene - Scene object, from the list of static scenes
   */
  static buildSceneControlMessage(scene: Scene): SetPilotMessage {
    const msg = new SetPilotMessage();
    msg.params = new SetPilotParametersScene(scene.sceneId);
    return msg;
  }

  /**
   * Constructs color control message.
   * Valid combinations: R+G+B, R+G+W, G+B+W. R+B+W.
   * R+G+B+W could not be played due to limitations in the light engine
   * @param red - Integer, valid range 0-255
   * @param green - Integer, valid range 0-255
   * @param blue - Integer, valid range 0-255
   * @param whiteLevel - Integer, valid range 0-255
   */
  static buildColorControlMessage(
    red: number,
    green: number,
    blue: number,
    whiteLevel: number,
  ) {
    const msg = new SetPilotMessage();
    msg.params = new SetPilotParametersColor(red, green, blue, whiteLevel);
    return msg;
  }

  /**
   * Constructs color temperature control message.
   * @param colorTemperature - Integer, valid range 2200-6500
   */
  static buildColorTemperatureControlMessage(colorTemperature: number) {
    const msg = new SetPilotMessage();
    msg.params = new SetPilotParametersColorTemperature(colorTemperature);
    return msg;
  }

  /**
   * Constructs playing speed control message.
   * Valid only for dynamic scenes
   * @param speed Playing speed, valid range 20-200
   */
  static buildSpeedControlMessage(speed: number) {
    const msg = new SetPilotMessage();
    msg.params = new SetPilotParametersSpeed(speed);
    return msg;
  }
}

/**
 * Message broadcasted by the light after booting,
 * way to inform nearby devices about its presence
 */
export type FirstBeatMessage = {
  method: "firstBeat";
  id: number;
  env: string;
  params: {
    mac: string;
    fwVersion: string;
  };
};

/**
 * Message sent by device to the lamp (via broadcast or unicast)
 * Lamp will add specified IP to the list devices that it notifies on status change using
 * SyncPilot messages
 */
export class RegistrationMessage {
  method: "registration";
  version: number;
  id: number;
  params: {
    register: boolean;
    phoneMac: string;
    phoneIp: string;
  };
  constructor(ip: string, mac: string) {
    this.method = networkConstants.registrationMethod;
    this.id = Math.floor(Math.random() * 10000 + 1);
    this.version = 1;
    this.params = {
      register: true,
      phoneIp: ip,
      phoneMac: mac,
    };
  }
}

export type WiZControlMessage =
  | SetPilotMessage
  | SyncPilotAckMessage
  | RegistrationMessage;

export type WiZMessage =
  | GetPilotMessage
  | SetPilotMessage
  | SyncPilotMessage
  | FirstBeatMessage
  | RegistrationMessage;

export type Result =
  | {
      type: "success";
    }
  | {
      type: "error";
      message: string;
    };

export const staticScenes: Array<LightMode> = [
  {
    type: "scene",
    sceneId: 1,
    name: "Ocean",
  },
  {
    type: "scene",
    sceneId: 2,
    name: "Romance",
  },
  {
    type: "scene",
    sceneId: 3,
    name: "Sunset",
  },
  {
    type: "scene",
    sceneId: 4,
    name: "Party",
  },
  {
    type: "scene",
    sceneId: 5,
    name: "Fireplace",
  },
  {
    type: "scene",
    sceneId: 6,
    name: "Cozy",
  },
  {
    type: "scene",
    sceneId: 7,
    name: "Forest",
  },
  {
    type: "scene",
    sceneId: 8,
    name: "Pastel colors",
  },
  {
    type: "scene",
    sceneId: 9,
    name: "Wake up",
  },
  {
    type: "scene",
    sceneId: 10,
    name: "Bedtime",
  },
  {
    type: "scene",
    sceneId: 11,
    name: "Warm white",
  },
  {
    type: "scene",
    sceneId: 12,
    name: "Daylight",
  },
  {
    type: "scene",
    sceneId: 13,
    name: "Cool white",
  },
  {
    type: "scene",
    sceneId: 14,
    name: "Night Light",
  },
  {
    type: "scene",
    sceneId: 15,
    name: "Focus",
  },
  {
    type: "scene",
    sceneId: 16,
    name: "Relax",
  },
  {
    type: "scene",
    sceneId: 17,
    name: "True colors",
  },
  {
    type: "scene",
    sceneId: 18,
    name: "TV Time",
  },
  {
    type: "scene",
    sceneId: 19,
    name: "Plant growth",
  },
  {
    type: "scene",
    sceneId: 20,
    name: "Spring",
  },
  {
    type: "scene",
    sceneId: 21,
    name: "Summer",
  },
  {
    type: "scene",
    sceneId: 22,
    name: "Fall",
  },
  {
    type: "scene",
    sceneId: 23,
    name: "Deep dive",
  },
  {
    type: "scene",
    sceneId: 24,
    name: "Jungle",
  },
  {
    type: "scene",
    sceneId: 25,
    name: "Mojito",
  },
  {
    type: "scene",
    sceneId: 26,
    name: "Club",
  },
  {
    type: "scene",
    sceneId: 27,
    name: "Christmas",
  },
  {
    type: "scene",
    sceneId: 28,
    name: "Halloween",
  },
];

export type Color = {
  red: number;
  green: number;
  blue: number;
};
