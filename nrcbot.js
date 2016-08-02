/*
  niconico reccomend slack (nrs) bot
*/

/** plugins. */ 
var express = require('express');
var request = require('request');
var log4js = require('log4js');
var corser = require('corser');
var botkit = require('botkit');

var config = require('./nrcbot-config.json');

/** botkit settings. */
var controller = botkit.slackbot({ debug: false });
var bot = controller.spawn({ token: config.token });

var hoge = (function() {

    var hoge = function(controller, bot) {
        this.controller = controller;
    	this.bot = bot;
    }

    hoge.prototype.say = function() {
        this.bot.say({
            text: 'ほげえええ',
            channel: config.channelId
        })
    };

    return hoge;
})();


var fuga = new hoge(controller, bot);

/** logic */

bot.startRTM(function(error, bot, payload) {
    fuga.say();
});


/** sample */

controller.hears('こんにちは', ['mention', 'direct_mention', 'ambient'], function(bot, message) {
    console.log(message);
    bot.reply(message, 'おっすお願いしまーす');
});

setTimeout(function() {
    fuga.say();
}, 3000);

/*controller.hears('.*ハゲ.*', ['mention', 'direct_mention', 'ambient'], function(bot, message) {
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
});*/

