import 'babel-polyfill';

import Twit from 'twit';
import prominence from 'prominence';

export default class TwitProvider {

    constructor(twitterTokens) {
        this.twit = new Twit(twitterTokens);
        this.follower;
        this._loadFollowers();
    }

    async _loadFollowers() {
        let self = this;
        prominence(this.twit).get('friends/list', { screen_name: 'nrcbot_nethive' })
            .then((result) => { self.follower = result.users; });
    }

    postToFollowers(message) {
        let self = this;
        for (var i = 0; i < this.follower.length; i++) {
            this.postToFollower(this.follower[i], message);
        }
    }

    postToFollower(follower, message) {
        prominence(this.twit).post('statuses/update', {status: '@' + follower.screen_name + ' ' + message})
            .then((result) => {
                console.log('succeeded : ' + follower.screen_name);
        });
    }
}
