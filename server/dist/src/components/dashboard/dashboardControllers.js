"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.dashboard = void 0;
const dashboard = (req, res) => {
    if (req.user) {
        return res.status(200).json(req.user);
    }
};
exports.dashboard = dashboard;
