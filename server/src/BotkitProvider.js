import 'babel-polyfill';

import Botkit from 'botkit';
import request from 'request';
import prominence from 'prominence';

export default class NrcBotProvider {
    constructor(tokens, roomName) {
        this.token = tokens.token;
        this.controller = Botkit.slackbot({ debug: false });
        this.bot = this.controller.spawn(tokens);
        this.channels = this._loadChannels();
        this.roomName = roomName;

        this.bot.startRTM(async (error, bot, payload) => {
            await this.say('nrcbot woke up.');
        });
    }

    _loadChannels() {
        let url = `https://slack.com/api/channels.list?token=${this.token}&pretty=1`;
        let channelList = {};
        request(url, (err, res, body) => {
            let channels = JSON.parse(body).channels;
            for(let channel of channels) {
                channelList[channel.name] = channel.id;
            }

            console.log(channelList);
        });

        return channelList;
    }

    hears(patterns, types, middlewareFn, callback) {
        this.controller.hears(patterns, types, middlewareFn, callback);
    }

    reacts(patterns, types, reply, callback) {
        this.controller.hears(patterns, types, (bot, message) => {
            console.log(message);
            prominence(this.bot).reply(message, reply, callback);
        });
    }

    async say(text) {
        let channel = this.channels[this.roomName];
        if (channel) {
            console.log('call.');
            prominence(this.bot).say({
                text: text,
                channel: channel
            });
        }
    }

    reply(message, reply, callback) {
        this.bot.reply(message, reply, callback);
    }

}
