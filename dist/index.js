"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const UDPManager_1 = require("./UDPManager");
const types_1 = require("./constants/types");
const UDPCommunication_1 = require("./UDPCommunication");
class WiZLocalControl {
    constructor(incomingMsgCallback) {
        const udpManager = new UDPManager_1.default(incomingMsgCallback);
        udpManager.startListening();
        this.udpManager = udpManager;
    }
    /**
     * Starts listening to status updates of WiZ lights
     */
    startListening() {
        this.udpManager.startListening();
    }
    /**
     * Stops listening to status updates of WiZ lights
     */
    stopListening() {
        this.udpManager.stopListening();
    }
    /**
     * Changes brightness of WiZ Light
     * @param brightness Brightness level, 10-100
     * @param lightIp Light IP address
     */
    changeBrightness(brightness, lightIp) {
        return __awaiter(this, void 0, void 0, function* () {
            const msg = types_1.SetPilotMessage.buildDimmingControlMessage(brightness);
            return UDPCommunication_1.default(msg, lightIp);
        });
    }
    /**
     * Changes light mode of WiZ Light
     * @param lightMode Light mode, check LightMode type for details
     * @param lightIp Light IP address
     */
    changeLightMode(lightMode, lightIp) {
        return __awaiter(this, void 0, void 0, function* () {
            switch (lightMode.type) {
                case "scene": {
                    const msg = types_1.SetPilotMessage.buildSceneControlMessage(lightMode);
                    return UDPCommunication_1.default(msg, lightIp);
                }
                case "color": {
                    const msg = types_1.SetPilotMessage.buildColorControlMessage(lightMode.r, lightMode.g, lightMode.b, lightMode.ww);
                    return UDPCommunication_1.default(msg, lightIp);
                }
                case "temperature": {
                    const msg = types_1.SetPilotMessage.buildColorTemperatureControlMessage(lightMode.colorTemperature);
                    return UDPCommunication_1.default(msg, lightIp);
                }
            }
        });
    }
    /**
     * Changes playing speed of Dynamic Scene of WiZ Light
     * @param speed Playing speed, 20-200
     * @param lightIp
     */
    changeSpeed(speed, lightIp) {
        return __awaiter(this, void 0, void 0, function* () {
            const msg = types_1.SetPilotMessage.buildSpeedControlMessage(speed);
            return UDPCommunication_1.default(msg, lightIp);
        });
    }
    /**
     * Changes status of WiZ Light
     * @param status Desired status, true - ON, false - OFF
     * @param lightIp
     */
    changeStatus(status, lightIp) {
        return __awaiter(this, void 0, void 0, function* () {
            const msg = types_1.SetPilotMessage.buildStatusControlMessage(status);
            return UDPCommunication_1.default(msg, lightIp);
        });
    }
}
exports.default = WiZLocalControl;
//# sourceMappingURL=index.js.map