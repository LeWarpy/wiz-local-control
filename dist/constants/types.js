"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
const networkConstants = require("../constants/communication");
const class_validator_1 = require("class-validator");
/**
 * Set Pilot messages parameters for changing color
 */
class SetPilotParametersColor {
    constructor(r, g, b, whiteLevel) {
        this.r = r;
        this.g = g;
        this.b = b;
        this.w = whiteLevel;
    }
}
__decorate([
    class_validator_1.IsInt(),
    class_validator_1.Min(0),
    class_validator_1.Max(255)
], SetPilotParametersColor.prototype, "r", void 0);
__decorate([
    class_validator_1.IsInt(),
    class_validator_1.Min(0),
    class_validator_1.Max(255)
], SetPilotParametersColor.prototype, "g", void 0);
__decorate([
    class_validator_1.IsInt(),
    class_validator_1.Min(0),
    class_validator_1.Max(255)
], SetPilotParametersColor.prototype, "b", void 0);
__decorate([
    class_validator_1.IsInt(),
    class_validator_1.Min(0),
    class_validator_1.Max(255)
], SetPilotParametersColor.prototype, "w", void 0);
__decorate([
    class_validator_1.IsInt(),
    class_validator_1.Min(0),
    class_validator_1.Max(255)
], SetPilotParametersColor.prototype, "c", void 0);
exports.SetPilotParametersColor = SetPilotParametersColor;
/**
 * Set Pilot messages parameters for scene
 */
class SetPilotParametersScene {
    constructor(sceneId) {
        this.sceneId = sceneId;
    }
}
__decorate([
    class_validator_1.IsInt(),
    class_validator_1.Min(1),
    class_validator_1.Max(28)
], SetPilotParametersScene.prototype, "sceneId", void 0);
exports.SetPilotParametersScene = SetPilotParametersScene;
/**
 * Set Pilot messages parameters for status
 */
class SetPilotParametersStatus {
    constructor(status) {
        this.state = status;
    }
}
exports.SetPilotParametersStatus = SetPilotParametersStatus;
/**
 * Set Pilot messages parameters for changing dimming
 */
class SetPilotParametersDimming {
    constructor(dimming) {
        this.dimming = dimming;
    }
}
__decorate([
    class_validator_1.IsInt(),
    class_validator_1.Min(10),
    class_validator_1.Max(100)
], SetPilotParametersDimming.prototype, "dimming", void 0);
exports.SetPilotParametersDimming = SetPilotParametersDimming;
/**
 * Set Pilot messages parameters for changing speed
 */
class SetPilotParametersSpeed {
    constructor(speed) {
        this.speed = speed;
    }
}
__decorate([
    class_validator_1.IsInt(),
    class_validator_1.Min(20),
    class_validator_1.Max(200)
], SetPilotParametersSpeed.prototype, "speed", void 0);
exports.SetPilotParametersSpeed = SetPilotParametersSpeed;
/**
 * Set Pilot messages parameters for changing color temperature
 */
class SetPilotParametersColorTemperature {
    constructor(temperature) {
        this.temp = temperature;
    }
}
__decorate([
    class_validator_1.IsInt(),
    class_validator_1.Min(2200),
    class_validator_1.Max(6500)
], SetPilotParametersColorTemperature.prototype, "temp", void 0);
exports.SetPilotParametersColorTemperature = SetPilotParametersColorTemperature;
class SetPilotMessage {
    constructor() {
        this.method = networkConstants.setPilotMethod;
        this.id = Math.floor(Math.random() * 10000 + 1);
        this.version = 1;
    }
    /**
     * Constructs dimming control message
     * @param dimming - Integer, valid range is 10-100
     */
    static buildDimmingControlMessage(dimming) {
        const msg = new SetPilotMessage();
        msg.params = new SetPilotParametersDimming(dimming);
        return msg;
    }
    /**
     * Constructs status control message
     * @param status - Boolean, true - turn the lamp on, false - off
     */
    static buildStatusControlMessage(status) {
        const msg = new SetPilotMessage();
        msg.params = new SetPilotParametersStatus(status);
        return msg;
    }
    /**
     * Constructs scene control message
     * @param scene - Scene object, from the list of static scenes
     */
    static buildSceneControlMessage(scene) {
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
    static buildColorControlMessage(red, green, blue, whiteLevel) {
        const msg = new SetPilotMessage();
        msg.params = new SetPilotParametersColor(red, green, blue, whiteLevel);
        return msg;
    }
    /**
     * Constructs color temperature control message.
     * @param colorTemperature - Integer, valid range 2200-6500
     */
    static buildColorTemperatureControlMessage(colorTemperature) {
        const msg = new SetPilotMessage();
        msg.params = new SetPilotParametersColorTemperature(colorTemperature);
        return msg;
    }
    /**
     * Constructs playing speed control message.
     * Valid only for dynamic scenes
     * @param speed Playing speed, valid range 20-200
     */
    static buildSpeedControlMessage(speed) {
        const msg = new SetPilotMessage();
        msg.params = new SetPilotParametersSpeed(speed);
        return msg;
    }
}
__decorate([
    class_validator_1.ValidateNested()
], SetPilotMessage.prototype, "params", void 0);
exports.SetPilotMessage = SetPilotMessage;
/**
 * Message sent by device to the lamp (via broadcast or unicast)
 * Lamp will add specified IP to the list devices that it notifies on status change using
 * SyncPilot messages
 */
class RegistrationMessage {
    constructor(ip, mac) {
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
exports.RegistrationMessage = RegistrationMessage;
/**
 * Message sent to the lamp requesting its system configuration (fwVersion for example)
 */
class GetSystemConfigMessage {
    constructor(ip) {
        this.method = networkConstants.getSystemConfigMethod;
        this.id = Math.floor(Math.random() * 10000 + 1);
        this.version = 1;
    }
}
exports.GetSystemConfigMessage = GetSystemConfigMessage;
exports.staticScenes = [
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
//# sourceMappingURL=types.js.map