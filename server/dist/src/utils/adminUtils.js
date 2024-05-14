"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.nbVisits24h = void 0;
const fs_1 = require("fs");
/**
 * Function to get the number of visits in the last 24 hours.
 * Reads the 'access.log' file and counts the number of requests within the last 24 hours.
 * @returns Promise<number> The number of visits in the last 24 hours.
 */
function nbVisits24h() {
    return new Promise((resolve, reject) => {
        (0, fs_1.readFile)('access.log', 'utf8', (err, data) => {
            if (err) {
                reject(err);
                return;
            }
            // Split the log file content into lines
            const logLines = data.split('\n');
            // Get the current date and time
            const now = Date.now();
            // Calculate the timestamp of 24 hours ago
            const twentyFourHoursAgo = new Date(now - 24 * 60 * 60 * 1000).getTime();
            // Filter requests that occurred in the last 24 hours
            const requestsInLast24Hours = logLines.filter(line => {
                // Extract the timestamp from the log line
                const timestampStr = line.split(' - ')[0].trim();
                const timestamp = new Date(timestampStr).getTime();
                // Check if the timestamp is within the last 24 hours
                if (!isNaN(timestamp))
                    return timestamp > twentyFourHoursAgo && timestamp <= now;
            });
            // Get the number of requests in the last 24 hours
            resolve(requestsInLast24Hours.length);
        });
    });
}
exports.nbVisits24h = nbVisits24h;
