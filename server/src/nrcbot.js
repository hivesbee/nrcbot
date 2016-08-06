/*
    niconico reccomend slack (nrs) bot
*/

// babel
import 'babel-polyfill';
// Botkit
import Botkit from 'botkit';
// Twit
import Twit from 'twit';
// server
import express from 'express';
import request from 'request';
import log4js from 'log4js';
import corser from 'corser';

import config from './nrcbot-config.json';
import NrcBotProvider from './NRCBotProvider.js';

/** log settings. */
log4js.configure('log-config.json');
let systemLogger = log4js.getLogger('system');
let accessLogger = log4js.getLogger('access');
let errorLogger = log4js.getLogger('error');

/** botkit settings. */
let controller = Botkit.slackbot({ debug: false });
let bot = controller.spawn({
    token: process.env.SLACK_TOKEN
});
let provider = new NrcBotProvider(controller, bot, config);

bot.startRTM(async (error, bot, payload) => {
    await provider.say('nrcbot woke up.', 'test');
});

/** Twit settings */
let twit = new Twit({
    consumer_key: process.env.TWITTER_CONSUMER_KEY,
    consumer_secret: process.env.TWITTER_CONSUMER_SECRET,
    access_token: process.env.TWITTER_ACCESS_TOKEN,
    access_token_secret: process.env.TWITTER_ACCESS_SECRET
});

let follower;
twit.get('friends/list', { screen_name: 'nrcbot_nethive' },  function (err, data, response) {
    follower = data.users;
});
accessLogger.info('Twit initialized.');

/** server settings */
let app = express();
app.use(corser.create()); // allows CORS

app.post('/nrs/post/:username/:videoid', (req, res, next) => {

    // gets params.
    var username = req.params.username;
    var videoid = req.params.videoid;
	var message = username + 'が動画をおすすめしました\n' + config.const.niconicoUrlPattern + videoid;

    accessLogger.info('called : /nrs/post/' + username + '/' + videoid);

    // posts slack.
    try {
        provider.say(message, 'test');
        res.writeHead(200, {'Content-Type': 'text/plain'});
        systemLogger.info('slack post succeeded.');
    } catch (e) {
        res.writeHead(500, {'Content-Type': 'text/plain'});
        errLogger.error('slack error occured.');
        
    }

    // post twitter (mention).
    for (var i = 0; i < follower.length; i++) {
        twit.post('statuses/update', {status: '@' + follower[i].screen_name + ' ' + message}, function(err, data, response) {
            //console.log('@' + follower[i].screen_name + ' ' + data);
            systemLogger.info('twitter post succeeded. : ' + follower[i].screen_name);
        });
    }

    res.end();
});

let server = app.listen(8080, () => {
    console.log('nethive.info(express) is listening to port: ' + server.address().port);
});



/** sample */

controller.hears('こんにちは', ['mention', 'direct_mention', 'ambient'], function(bot, message) {
    console.log(message);
    bot.reply(message, 'おっすお願いしまーす');
});

controller.hears('.*ハゲ.*', ['mention', 'direct_mention', 'ambient'], function(bot, message) {
    console.log(message);
    bot.reply(message, 'また髪の話してる…');
});

controller.hears('.*光(って|る|り).*', ['mention', 'direct_mention', 'ambient'], function(bot, message) {
    console.log(message);
    bot.reply(message, 'また髪の話してる…');
});

controller.hears('やったぜ。', ['mention', 'direct_mention', 'ambient'], function(bot, message) {
    console.log(message);
    bot.reply(message, 'http://blog.goo.ne.jp/kuso_oyazy/e/d97186e9d7a79e09040db494861d9f40');
});

controller.hears('.*キレ(そう|た).*', ['mention', 'direct_mention', 'ambient'], function(bot, message) {
    console.log(message);
    bot.reply(message, 'まぁ落ち着けって。ワカメでも食べて元気だせよ');
});

