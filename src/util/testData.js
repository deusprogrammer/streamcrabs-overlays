export const configs = {
    YOSHI: {
        message: 'Incoming raid from ${raider} with a party of ${raidSize}!',
        sprites: [
            {
                file: process.env.PUBLIC_URL + '/images/yoshi/yoshi-walk.png',
                frames: 10,
                frameWidth: 128,
                frameHeight: 128,
                frameRate: 15
            },
            {
                file: process.env.PUBLIC_URL + '/images/yoshi/yoshi-walk-black.png',
                frames: 10,
                frameWidth: 128,
                frameHeight: 128,
                frameRate: 15
            },
            {
                file: process.env.PUBLIC_URL + '/images/yoshi/yoshi-walk-blue.png',
                frames: 10,
                frameWidth: 128,
                frameHeight: 128,
                frameRate: 15
            },
            {
                file: process.env.PUBLIC_URL + '/images/yoshi/yoshi-walk-pink.png',
                frames: 10,
                frameWidth: 128,
                frameHeight: 128,
                frameRate: 15
            },
            {
                file: process.env.PUBLIC_URL + '/images/yoshi/yoshi-walk-purple.png',
                frames: 10,
                frameWidth: 128,
                frameHeight: 128,
                frameRate: 15
            },
            {
                file: process.env.PUBLIC_URL + '/images/yoshi/yoshi-walk-yellow.png',
                frames: 10,
                frameWidth: 128,
                frameHeight: 128,
                frameRate: 15
            }
        ],
        music: {
            file: process.env.PUBLIC_URL + '/sounds/yoshi/yoshi-fanfare.mp3',
            volume: 1
        },
        leavingSound: {
            file: process.env.PUBLIC_URL + '/sounds/yoshi/yoshi-tongue.mp3',
            volume: 1
        }
    },
    SKULLMAN: {
        message: 'HOLY SHIT! ${raider} raided with a party of ${raidSize}!',
        sprites: [
            {
                file: process.env.PUBLIC_URL + '/images/skullman/skullman-walk.png',
                frames: 10,
                frameWidth: 99,
                frameHeight: 128,
                frameRate: 15
            }
        ],
        music: {
            file: process.env.PUBLIC_URL + '/sounds/skullman/battle.mp3',
            volume: 1
        },
        leavingSound: {
            file: process.env.PUBLIC_URL + '/sounds/skullman/ash-groovy.mp3',
            volume: 3
        }
    },
    CHAIR: {
        message: 'CHEESE IT UP! ${raider} raided with a party of ${raidSize}!',
        sprites: [
            {
                file: process.env.PUBLIC_URL + '/images/chair/cheesesteak-walk.png',
                frames: 6,
                frameWidth: 128,
                frameHeight: 128,
                frameRate: 15
            }
        ],
        music: {
            file: process.env.PUBLIC_URL + '/sounds/chair/music.mp3',
            volume: 1
        },
        leavingSound: {
            file: process.env.PUBLIC_URL + '/sounds/chair/fart.mp3',
            volume: 1
        }
    }
}