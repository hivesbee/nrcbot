import 'babel-polyfill';

import Twit from 'twit';
import prominence from 'prominence';

export default class TwitProvider {
    constructor(twitterTokens) {
        this.twit = new Twit(twitterTokens);
        this.follower = this._loadFollowers();
        /*this.follower = prominence(this.twit).get('friends/list', { screen_name: 'nrcbot_nethive' },  function (err, data, response) {
            return data.users;
        });*/
        
        console.log('followers:');
        console.log();
    }

    async _loadFollowers() {
        return prominence(this.twit).get('friends/list', { screen_name: 'nrcbot_nethive' })
            .then((result) => {
                console.log('then');
                console.log(result.users);

                return result.users;
            });
    }

    postToFollowers(message) {
        console.log('a');
        for (var i = 0; i < this.follower.length; i++) {
            console.log('i = ' + i);
            prominence(this.twit).post('statuses/update', {status: '@' + this.follower[i].screen_name + ' ' + message}, function(err, data, response) {
                console.log('twitter post succeeded. : ' + this.follower[i].screen_name);
                //systemLogger.info('twitter post succeeded. : ' + this.follower[i].screen_name);
            });
        }
    }

    showFollowers() {
        console.log(this.follower);
    }
}
