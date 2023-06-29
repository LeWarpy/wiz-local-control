"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.FavoriteLightMode = exports.staticScenes = void 0;
const UDPManager_1 = require("./UDPManager");
const class_validator_1 = require("class-validator");
const types_1 = require("./classes/types");
Object.defineProperty(exports, "staticScenes", { enumerable: true, get: function () { return types_1.staticScenes; } });
const Control_1 = require("./classes/Control");
const SystemConfig_1 = require("./classes/SystemConfig");
const Pilot_1 = require("./classes/Pilot");
const GetMessage_1 = require("./classes/GetMessage");
const Favorites_1 = require("./classes/Favorites");
Object.defineProperty(exports, "FavoriteLightMode", { enumerable: true, get: function () { return Favorites_1.FavoriteLightMode; } });
const WiZClick_1 = require("./classes/WiZClick");
const SetUserConfig_1 = require("./classes/SetUserConfig");
const SetModelConfig_1 = require("./classes/SetModelConfig");
class WiZLocalControl {
    constructor(options) {
        this.udpManager = new UDPManager_1.default(options.incomingMsgCallback, options.interfaceName || "eth0");
    }
    async validateMsg(msg, skipMissingProperties = false) {
        const validationErrors = await (0, class_validator_1.validate)(msg, {
            skipMissingProperties,
        });
        if (validationErrors.length > 0) {
            throw Error(JSON.stringify(validationErrors));
        }
    }
    /**
     * Starts listening to status updates of WiZ lights
     */
    async startListening() {
        return this.udpManager.startListening();
    }
    /**
     * Stops listening to status updates of WiZ lights
     */
    async stopListening() {
        await this.udpManager.stopListening();
    }
    /**
     * Requests firmware update of WiZ Light
     * @param firmwareVersion target fw version, if undefined - then default
     * @param lightIp Light IP address
     */
    async updateFirmware(firmwareVersion, lightIp) {
        const msg = Control_1.UpdateFirmwareMessage.buildUpdateFirmwareMessage(firmwareVersion);
        await this.validateMsg(msg);
        return this.udpManager.sendUDPCommand(msg, lightIp);
    }
    /**
     * Reset WiZ Light
     * @param lightIp Light IP address
     */
    async reset(lightIp) {
        const msg = Control_1.ResetMessage.buildResetMessage();
        await this.validateMsg(msg);
        return this.udpManager.sendUDPCommand(msg, lightIp);
    }
    /**
     * Reboot WiZ Light
     * @param lightIp Light IP address
     */
    async reboot(lightIp) {
        const msg = Control_1.RebootMessage.buildRebootMessage();
        await this.validateMsg(msg);
        return this.udpManager.sendUDPCommand(msg, lightIp);
    }
    /**
     * Sets environment of WiZ Light (OBSOLETE after fw 1.18)
     * @param environment system environment
     * @param lightIp Light IP address
     */
    async setEnvironment(environment, lightIp) {
        const msg = SystemConfig_1.SetSystemConfigMessage.buildSetEnvironmentMessage(environment);
        await this.validateMsg(msg);
        return this.udpManager.sendUDPCommand(msg, lightIp);
    }
    /**
     * Changes module name for WiZ Light
     * @param moduleName module name
     * @param lightIp Light IP address
     */
    async setModuleName(moduleName, lightIp) {
        const msg = SystemConfig_1.SetSystemConfigMessage.buildSetModuleNameMessage(moduleName);
        await this.validateMsg(msg);
        return this.udpManager.sendUDPCommand(msg, lightIp);
    }
    /**
     * Changes extended white factor for WiZ Light
     * @param extendedWhiteFactor extended white factor
     * @param lightIp Light IP address
     */
    async setExtendedWhiteFactor(extendedWhiteFactor, lightIp) {
        const msg = SystemConfig_1.SetSystemConfigMessage.buildSetExtendedWhiteFactorMessage(extendedWhiteFactor);
        await this.validateMsg(msg);
        return this.udpManager.sendUDPCommand(msg, lightIp);
    }
    /**
     * Sets system config for WiZ Light
     * @param parameters SetSystemConfig message parameters
     * @param lightIp Light IP address
     */
    async setSystemConfig(parameters, lightIp) {
        const msg = SystemConfig_1.SetSystemConfigMessage.buildSetSystemConfigMessage(parameters);
        await this.validateMsg(msg);
        return this.udpManager.sendUDPCommand(msg, lightIp);
    }
    /**
     * Sets model config for WiZ Light
     * @param parameters SetModelConfig message parameters
     * @param lightIp Light IP address
     */
    async setModelConfig(parameters, lightIp) {
        const msg = SetModelConfig_1.SetModelConfigMessage.buildSetModelConfigMessage(parameters);
        await this.validateMsg(msg);
        return this.udpManager.sendUDPCommand(msg, lightIp);
    }
    /**
    * Sets CCT Table for WiZ Light
    * @param parameters SetCctTable message parameters
    * @param lightIp Light IP address
    */
    async setCctTable(parameters, lightIp) {
        const msg = SetModelConfig_1.SetCctTableMessage.buildSetCctTableMessage(parameters);
        await this.validateMsg(msg);
        return this.udpManager.sendUDPCommand(msg, lightIp);
    }
    /**
     * Changes temperature ranges for WiZ Light
     * @param whiteTemperatureMin the temperature in Kelvin for the native warm white
     * @param whiteTemperatureMax the temperature in Kelvin for the native cool white
     * @param extendedTemperatureMin the temperature in Kelvin for the extended warm white where red and blue need to be added.
     * @param extendedTemperatureMax the temperature in Kelvin for the extended cool white where red and blue need to be added.
     * @param lightIp Light IP address
     */
    async setTemperatureRanges(whiteTemperatureMin, whiteTemperatureMax, extendedTemperatureMin, extendedTemperatureMax, lightIp) {
        const msg = SetUserConfig_1.SetUserConfigMessage.buildSetTemperatureRangeMessage(whiteTemperatureMin, whiteTemperatureMax, extendedTemperatureMin, extendedTemperatureMax);
        await this.validateMsg(msg);
        return this.udpManager.sendUDPCommand(msg, lightIp);
    }
    /**
     * Sets user config for WiZ Light
     * @param parameters SetUserConfig message parameters
     * @param lightIp Light IP address
     */
    async setUserConfig(parameters, lightIp) {
        const msg = SetUserConfig_1.SetUserConfigMessage.buildSetUserConfigMessage(parameters);
        await this.validateMsg(msg);
        return this.udpManager.sendUDPCommand(msg, lightIp);
    }
    /**
     * Changes brightness of WiZ Light
     * @param brightness Brightness level, 10-100
     * @param lightIp Light IP address
     */
    async changeBrightness(brightness, lightIp) {
        const msg = Pilot_1.SetPilotMessage.buildDimmingControlMessage(brightness);
        await this.validateMsg(msg, true);
        return this.udpManager.sendUDPCommand(msg, lightIp);
    }
    /**
     * Changes light mode of WiZ Light
     * @param lightMode Light mode, check LightMode type for details
     * @param lightIp Light IP address
     */
    async changeLightMode(lightMode, lightIp) {
        switch (lightMode.type) {
            case "scene": {
                const msg = Pilot_1.SetPilotMessage.buildSceneControlMessage(lightMode);
                await this.validateMsg(msg, true);
                return this.udpManager.sendUDPCommand(msg, lightIp);
            }
            case "color": {
                const msg = Pilot_1.SetPilotMessage.buildColorControlMessage(lightMode.r, lightMode.g, lightMode.b, lightMode.cw, lightMode.ww);
                await this.validateMsg(msg, true);
                return this.udpManager.sendUDPCommand(msg, lightIp);
            }
            case "temperature": {
                const msg = Pilot_1.SetPilotMessage.buildColorTemperatureControlMessage(lightMode.colorTemperature);
                await this.validateMsg(msg, true);
                return this.udpManager.sendUDPCommand(msg, lightIp);
            }
        }
    }
    /**
     * Changes light mode of WiZ Light
     * @param lightMode Light mode, check LightMode type for details
     * @param brightness Brightness level, 10-100
     * @param lightIp Light IP address
     */
    async changeLightModeAndBrightness(lightMode, brightness, lightIp) {
        let msg;
        switch (lightMode.type) {
            case "scene": {
                msg = Pilot_1.SetPilotMessage.buildSceneAndBrightnessControlMessage(lightMode, brightness);
                break;
            }
            case "color": {
                msg = Pilot_1.SetPilotMessage.buildColorAndBrightnessControlMessage(lightMode.r, lightMode.g, lightMode.b, lightMode.cw, lightMode.ww, brightness);
                break;
            }
            case "temperature": {
                msg = Pilot_1.SetPilotMessage.buildColorTemperatureAndBrightnessControlMessage(lightMode.colorTemperature, brightness);
                break;
            }
        }
        await this.validateMsg(msg, true);
        return this.udpManager.sendUDPCommand(msg, lightIp);
    }
    /**
     * Changes playing speed of Dynamic Scene of WiZ Light
     * @param speed Playing speed, 20-200
     * @param lightIp
     */
    async changeSpeed(speed, lightIp) {
        const msg = Pilot_1.SetPilotMessage.buildSpeedControlMessage(speed);
        await this.validateMsg(msg, true);
        return this.udpManager.sendUDPCommand(msg, lightIp);
    }
    /**
     * Changes status of WiZ Light
     * @param status Desired status, true - ON, false - OFF
     * @param lightIp
     */
    async changeStatus(status, lightIp) {
        const msg = Pilot_1.SetPilotMessage.buildStatusControlMessage(status);
        await this.validateMsg(msg, true);
        return this.udpManager.sendUDPCommand(msg, lightIp);
    }
    /**
     * Changes ratio of WiZ Light (for supported products)
     * @param ratio Ratio between top and bottom part, number in range 0..100
     * @param lightIp Light IP address
     */
    async changeRatio(ratio, lightIp) {
        const msg = Pilot_1.SetPilotMessage.buildRatioControlMessage(ratio);
        await this.validateMsg(msg, true);
        return this.udpManager.sendUDPCommand(msg, lightIp);
    }
    /**
     * Retrieves system configuration for WiZ Device (like FW version)
     * @param lightIp
     */
    async getSystemConfig(lightIp) {
        const msg = new SystemConfig_1.GetSystemConfigMessage();
        return this.udpManager.sendUDPCommand(msg, lightIp);
    }
    /**
     * Retrieves system configuration for WiZ Device (like FW version)
     * @param lightIp
     */
    async getPower(lightIp) {
        const msg = new GetMessage_1.GetPowerMessage();
        return this.udpManager.sendUDPCommand(msg, lightIp);
    }
    /**
     * Raven Camera Self Test
     * @param lightIp Light IP address
     */
    async camSelfTest(lightIp) {
        const msg = new GetMessage_1.GetCamSelfTestMessage();
        return this.udpManager.sendUDPCommand(msg, lightIp);
    }
    /**
     * Sets favorites on the light
     * @param favorite1
     * @param favorite2
     * @param favorite3
     * @param favorite4
     * @param lightIp
     */
    async setFavorites(favorite1, favorite2, favorite3, favorite4, lightIp) {
        const params = Favorites_1.SetFavoritesParameters.buildFromFavorites(favorite1, favorite2, favorite3, favorite4);
        const msg = Favorites_1.SetFavoritesMessage.buildSetFavoritesMessage(params);
        await this.validateMsg(msg);
        return this.udpManager.sendUDPCommand(msg, lightIp);
    }
    /**
     * Sets WiZ CLick settings on the light
     * @param wizClick1
     * @param wizClick2
     * @param lightIp
     */
    async setWiZClick(wizClick1, wizClick2, lightIp) {
        const params = WiZClick_1.SetWiZClickParameters.buildFromWiZClickModes(wizClick1, wizClick2);
        const msg = WiZClick_1.SetWiZClickMessage.buildSetWiZClickMessage(params);
        await this.validateMsg(msg);
        return this.udpManager.sendUDPCommand(msg, lightIp);
    }
}
exports.default = WiZLocalControl;
//# sourceMappingURL=index.js.map