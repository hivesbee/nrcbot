/*
    niconico reccomend slack (nrs) bot
*/

// babel
import 'babel-polyfill';
// server
import express from 'express';
import request from 'request';
import log4js from 'log4js';
import corser from 'corser';

import config from './nrcbot-config.json';
import BotkitProvider from './BotkitProvider.js';
import TwitProvider from './TwitProvider.js';

/** log settings. */
/*log4js.configure('log-config.json');
let systemLogger = log4js.getLogger('system');
let accessLogger = log4js.getLogger('access');
let errorLogger = log4js.getLogger('error');*/

/** botkit settings. */
let botkitProvider = new BotkitProvider({token: process.env.SLACK_TOKEN});
//accessLogger.info('BotkitProvider initialized.');

/** Twit settings */
let twitProvider = new TwitProvider({
    consumer_key: process.env.TWITTER_CONSUMER_KEY,
    consumer_secret: process.env.TWITTER_CONSUMER_SECRET,
    access_token: process.env.TWITTER_ACCESS_TOKEN,
    access_token_secret: process.env.TWITTER_ACCESS_SECRET
});
//twitProvider.showFollowers();
//accessLogger.info('TwitProvider initialized.');

/** server settings */
let app = express();
app.use(corser.create()); // allows CORS

app.post('/nrs/post/:username/:videoid', (req, res, next) => {

    // gets params.
    var username = req.params.username;
    var videoid = req.params.videoid;
	var message = username + 'が動画をおすすめしました\n' + config.const.niconicoUrlPattern + videoid;

    //accessLogger.info('called : /nrs/post/' + username + '/' + videoid);

    // posts slack.
    try {
        botkitProvider.say(message, 'test');
        res.writeHead(200, {'Content-Type': 'text/plain'});
        //systemLogger.info('slack post succeeded.');
    } catch (e) {
        res.writeHead(500, {'Content-Type': 'text/plain'});
        //errLogger.error('slack error occured.');
        res.end();
    }

    // post twitter (mention).
    try {
        twitProvider.postToFollowers(message);
        //systemLogger.info('twitter post succeeded.');
    } catch (e) {
        //errLogger.error('twitter error occured.');
        //res.writeHead(500, {'Content-Type': 'text/plain'});
        console.log('error @ twitProvider');
    }

    res.end();
});


/* bot actions (Slack) */
botkitProvider.reacts('こんにちは', ['mention', 'direct_mention', 'ambient'], 'おっすお願いしまーす');
botkitProvider.reacts('.*ハゲ.*', ['mention', 'direct_mention', 'ambient'], 'また髪の話してる…');
botkitProvider.reacts('.*光(って|る|り).*', ['mention', 'direct_mention', 'ambient'], 'また髪の話してる…');
botkitProvider.reacts('やったぜ。', ['mention', 'direct_mention', 'ambient'], 'http://blog.goo.ne.jp/kuso_oyazy/e/d97186e9d7a79e09040db494861d9f40');
botkitProvider.reacts('.*キレ(そう|た).*', ['mention', 'direct_mention', 'ambient'], 'まぁ落ち着けって。ワカメでも食べて元気だせよ');


/* launch server */
let server = app.listen(8080, () => {
    console.log('nethive.info(express) is listening to port: ' + server.address().port);
});
