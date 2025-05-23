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
exports.getEvents = void 0;
const eventModel_1 = require("./eventModel");
const getEvents = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        // Retrieve all events from the database
        const events = yield eventModel_1.Event.find({});
        // Return the events as JSON response
        return res.status(200).json(events);
    }
    catch (error) {
        // Log any errors and return a 500 status code
        console.log(error);
        return res.sendStatus(500);
    }
});
exports.getEvents = getEvents;
