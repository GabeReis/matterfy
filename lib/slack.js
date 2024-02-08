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
exports.Slack = void 0;
const github = __importStar(require("@actions/github"));
const core = __importStar(require("@actions/core"));
const webhook_1 = require("@slack/webhook");
class Slack extends webhook_1.IncomingWebhook {
    // 0: failure, 1: success, 2: cancel
    static color = ['#cb2431', '#2cbe4e', '#ffc107'];
    static mark = [':x:', ':white_check_mark:', ':warning:'];
    static msg = ['Failure', 'Success', 'Cancel'];
    constructor(url, username, icon_emoji, channel) {
        super(url, { username, icon_emoji, channel });
    }
    /**
     * Get mattermost fields
     */
    get fields() {
        const context = github.context;
        const { sha, eventName, workflow, ref } = context;
        const { owner, repo } = context.repo;
        const repo_url = `https://github.com/${owner}/${repo}`;
        const action_url = `${repo_url}/commit/${sha}/checks`;
        const fields = [
            {
                short: true,
                title: `repository`,
                value: `<${repo_url}|${owner}/${repo}>`
            },
            { short: true, title: `ref`, value: `${ref}` },
            { short: true, title: `event name`, value: `${eventName}` },
            { short: true, title: `workflow`, value: `<${action_url}|${workflow}>` }
        ];
        return fields;
    }
    /**
     * Generate payload
     */
    generatePayload(status, msg, username, icon_emoji) {
        const text = `${Slack.mark[status]} GitHub Actions ${Slack.msg[status]}`;
        const attachments = {
            color: Slack.color[status],
            title: msg,
            fields: this.fields
        };
        const payload = {
            text,
            username,
            icon_emoji,
            attachments: [attachments]
        };
        core.debug(`Generated payload for Mattermost: ${JSON.stringify(payload)}`);
        return payload;
    }
    /**
     * Notify information about github actions to Mattermost
     */
    async notify(status, msg, username, icon_emoji) {
        try {
            const payload = this.generatePayload(status, msg, username, icon_emoji);
            const result = await this.send(payload);
            core.debug('Sent message to Mattermost');
            return result;
        }
        catch (err) {
            throw err;
        }
    }
}
exports.Slack = Slack;
