import 'babel-polyfill';

import Twit from 'twit';
import prominence from 'prominence';
import Enumerable from 'linq';

import Log from './LogManager.js';

export default class TwitProvider {

    constructor(twitterTokens) {
        this.twit = new Twit(twitterTokens);
        this.followers;
        this._loadFollowers();

        Log.System().info('[TwitProvider] initialized.');
    }

    async _loadFollowers() {
        let self = this;
        prominence(this.twit).get('friends/list', { screen_name: 'nrcbot_nethive' })
            .then((result) => {
                self.followers = result.users;
                Log.System().info('[TwitProvider._loadFollowers] followers loaded.');
            });
    }

    postToFollowers(message) {
        try {
            Enumerable.from(this.followers).forEach((e) => { this.postToFollower(e, message); }, this);
            Log.System().info('[TwitProvider.postToFollowers] tweets posted.');
        } catch (e) {
            Log.Error().error('[TwitProvider.postToFollowers] error occured.\n' + err.stack);
        }
    }

    postToFollower(follower, message) {
        prominence(this.twit).post('statuses/update', {status: '@' + follower.screen_name + ' ' + message})
            .catch((err) => {
                Log.Error().error('[TwitProvider.postToFollower] error occured.\n' + err.stack);
            })
            .then((result) => {
                Log.System().info('[TwitProvider.postToFollower] tweet posted to ' + follower.screen_name);
        });
    }
}
