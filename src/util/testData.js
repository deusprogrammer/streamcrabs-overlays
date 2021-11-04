export const configs = {
    YOSHI: {
        message: 'Incoming raid from ${raider} with a party of ${raidSize}!',
        sprites: [
            {
                file: process.env.PUBLIC_URL + '/images/yoshi/yoshi-walk.png',
                startFrame: 0,
                endFrame: 9,
                frameWidth: 128,
                frameHeight: 128,
                frameRate: 15
            },
            {
                file: process.env.PUBLIC_URL + '/images/yoshi/yoshi-walk-black.png',
                startFrame: 0,
                endFrame: 9,
                frameWidth: 128,
                frameHeight: 128,
                frameRate: 15
            },
            {
                file: process.env.PUBLIC_URL + '/images/yoshi/yoshi-walk-blue.png',
                startFrame: 0,
                endFrame: 9,
                frameWidth: 128,
                frameHeight: 128,
                frameRate: 15
            },
            {
                file: process.env.PUBLIC_URL + '/images/yoshi/yoshi-walk-pink.png',
                startFrame: 0,
                endFrame: 9,
                frameWidth: 128,
                frameHeight: 128,
                frameRate: 15
            },
            {
                file: process.env.PUBLIC_URL + '/images/yoshi/yoshi-walk-purple.png',
                startFrame: 0,
                endFrame: 9,
                frameWidth: 128,
                frameHeight: 128,
                frameRate: 15
            },
            {
                file: process.env.PUBLIC_URL + '/images/yoshi/yoshi-walk-yellow.png',
                startFrame: 0,
                endFrame: 9,
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
                startFrame: 0,
                endFrame: 9,
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
                startFrame: 0,
                endFrame: 5,
                frameWidth: 128,
                frameHeight: 128,
                frameRate: 15
            },
            {
                file: process.env.PUBLIC_URL + '/images/chair/yuu.png',
                startFrame: 24,
                endFrame: 29,
                frameWidth: 128,
                frameHeight: 128,
                frameRate: 15
            },
            {
                file: process.env.PUBLIC_URL + '/images/chair/tanako.png',
                startFrame: 30,
                endFrame: 41,
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
            file: process.env.PUBLIC_URL + '/sounds/chair/cheeseitup.wav',
            volume: 1
        }
    }
}