// babel
import 'babel-polyfill';
// server
import request from 'request';
import prominence from 'prominence';

export default class NrcBotProvider {
    constructor(controller, bot, config) {
        this.token = process.env.SLACK_TOKEN;
        this.controller = controller;
        this.bot = bot;
        this.config = config;
        this.channels = this._loadChannels();
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

    async say(text, channelName) {
        let channel = this.channels[channelName];
        if (channel) {
            console.log('call.');
            prominence(this.bot).say({
                text: text,
                channel: channel
            });
        }
    }
}
