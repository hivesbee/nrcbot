import 'babel-polyfill';

import Twit from 'twit';
import prominence from 'prominence';
import Enumerable from 'linq';

export default class TwitProvider {

    constructor(twitterTokens) {
        this.twit = new Twit(twitterTokens);
        this.followers;
        this._loadFollowers();
    }

    async _loadFollowers() {
        let self = this;
        prominence(this.twit).get('friends/list', { screen_name: 'nrcbot_nethive' })
            .then((result) => { self.followers = result.users; });
    }

    postToFollowers(message) {
        Enumerable.from(this.followers).forEach((e) => { this.postToFollower(e, message); }, this);
    }

    postToFollower(follower, message) {
        prominence(this.twit).post('statuses/update', {status: '@' + follower.screen_name + ' ' + message})
            .catch((err) => {
                console.log('[postToFollower] error occured. : ' + err.stack);
            })
            .then((result) => {
                console.log('succeeded : ' + follower.screen_name);
        });
    }
}
