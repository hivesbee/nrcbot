import 'babel-polyfill';

import log4js from 'log4js';

const SINGLETON = Symbol();
const SINGLETON_ENFORCER = Symbol();

class LogManager {
    constructor(enforcer) {
        if (enforcer != SINGLETON_ENFORCER) {
            throw new Error('Can not construct singleton.');
        }

        log4js.configure('log-config.json');
        this.systemLogger = log4js.getLogger('system');
        this.accessLogger = log4js.getLogger('access');
        this.errorLogger = log4js.getLogger('error');
    }

    static get instance() {
        if (! this[SINGLETON]) {
            this[SINGLETON] = new LogManager(SINGLETON_ENFORCER);
        }

        return this[SINGLETON];
    }

    System() {
        return this.systemLogger;
    }

    Access() {
        return this.accessLogger;
    }

    Error() {
        return this.errorLogger;
    }
}

export default LogManager.instance;
