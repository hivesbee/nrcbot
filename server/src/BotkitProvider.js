import 'babel-polyfill';

import Botkit from 'botkit';
import request from 'request';
import prominence from 'prominence';
import Enumerable from 'linq';

import Log from './LogManager.js';

export default class BotkitProvider {
    constructor(tokens, roomName) {
        this.token = tokens.token;
        this.controller = Botkit.slackbot({ debug: false });
        this.bot = this.controller.spawn(tokens);
        this.channels = this._loadChannels();
        this.roomName = roomName;

        this.bot.startRTM(async (error, bot, payload) => {
            await this.say('nrcbot woke up.');
            Log.System().info('[BotkitProvider] initialized.');
        });
    }

    _loadChannels() {
        let url = `https://slack.com/api/channels.list?token=${this.token}&pretty=1`;
        let channelList = {};
        request(url, (err, res, body) => {
            let channels = JSON.parse(body).channels;

            Enumerable.from(channels).
                forEach((e) => { channelList[e.name] = e.id; }, this);

            Log.System().info('[BotkitProvider._loadChannels] channels loaded.');
        });

        return channelList;
    }

    hears(patterns, types, middlewareFn, callback) {
        this.controller.hears(patterns, types, middlewareFn, callback);
    }

    reacts(patterns, types, reply, callback) {
        this.controller.hears(patterns, types, (bot, message) => {
            prominence(this.bot).reply(message, reply, callback);
            Log.System().info('[BotkitProvider.reacts] reacted (text - ' + message.text + ', reply - ' + reply + ')');
        });
    }

    async say(text) {
        let channel = this.channels[this.roomName];
        if (channel) {
            prominence(this.bot).say({
                text: text,
                channel: channel
            });
            Log.System().info('[BotkitProvider.say] said (text - ' + text + ', channel - ' + channel + ')');
        } else {
            Log.Error().error('[BotkitProvider.say] channel is undefined.');
        }
    }

    reply(message, reply, callback) {
        this.bot.reply(message, reply, callback);
        Log.System().info('[BotkitProvider.reply] replied (text - ' + message + ')');
    }
}
