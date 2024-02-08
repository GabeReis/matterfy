"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
const core = __importStar(require("@actions/core"));
const slack_1 = require("./slack");
const utils_1 = require("./utils");
async function run() {
    try {
        const type = core.getInput('type', { required: true });
        const job_name = core.getInput('job_name', { required: true });
        const username = core.getInput('username') || 'Github Actions';
        const icon_emoji = core.getInput('icon_emoji') || 'octocat';
        const channel = core.getInput('channel');
        const url = core.getInput('url') || process.env.SLACK_WEBHOOK || '';
        if (url === '') {
            throw new Error(`
        ERROR: Missing Slack Incoming Webhooks URL.
        Please configure "SLACK_WEBHOOK" as environment variable or
        specify the key called "url" in "with" section.
      `);
        }
        const status = (0, utils_1.getStatus)(type);
        const slack = new slack_1.Slack(url, username, icon_emoji, channel);
        const result = await slack.notify(status, job_name, username, icon_emoji);
        core.debug(`Response from Slack: ${JSON.stringify(result)}`);
    }
    catch (err) {
        console.log(err);
        if (err instanceof Error) {
            core.setFailed(err.message);
        }
    }
}
run();
