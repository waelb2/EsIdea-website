"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getModules = void 0;
const moduleModel_1 = require("./moduleModel");
// Controller function to handle GET request for fetching modules
const getModules = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        // Retrieving all modules from the database
        const modules = yield moduleModel_1.Module.find({});
        // Formatting the retrieved modules before sending the response
        const formattedModules = modules.map(module => {
            return {
                moduleName: module.moduleName,
                _id: module._id
            };
        });
        // Sending a success response with the formatted modules
        return res.status(200).json(formattedModules);
    }
    catch (error) {
        // Handling errors and logging them
        console.log(error);
        // Sending a server error response if an error occurs
        return res.sendStatus(500);
    }
});
exports.getModules = getModules;
