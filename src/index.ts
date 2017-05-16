'use strict';

function getDesktop(): string {
    if (!process.env.USERPROFILE) {
        throw Error('User home is undefined');
    }
    return process.env.USERPROFILE + '/Desktop';
}

console.log(getDesktop());

