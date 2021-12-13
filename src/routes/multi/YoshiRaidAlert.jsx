import React, {useEffect} from 'react';
import Phaser from 'phaser';

let RaidAlert = (props) => {
    let yoshiCount = 0;
    let yoshis = [];
    let timeout = false;
    let text;
    let scaleDirection = 1;

    let scaleDimensions = {w: 1440, h: 820};

    function preload() {
        const yoshiImage = process.env.PUBLIC_URL + '/images/yoshi/yoshi-walk.png';
        const yoshiImageBlue = process.env.PUBLIC_URL + '/images/yoshi/yoshi-walk-blue.png';
        const yoshiImagePurple = process.env.PUBLIC_URL + '/images/yoshi/yoshi-walk-purple.png';
        const yoshiImagePink = process.env.PUBLIC_URL + '/images/yoshi/yoshi-walk-pink.png';
        const yoshiImageBlack = process.env.PUBLIC_URL + '/images/yoshi/yoshi-walk-black.png';
        const yoshiImageYellow = process.env.PUBLIC_URL + '/images/yoshi/yoshi-walk-yellow.png';

        const fanfare = process.env.PUBLIC_URL + '/sounds/yoshi/yoshi-fanfare.mp3';
        const badum = process.env.PUBLIC_URL + '/sounds/yoshi/yoshi-tongue.mp3';

        const groundImage = process.env.PUBLIC_URL + '/images/ground.png';
        const waterImage = process.env.PUBLIC_URL + '/images/water.png';

        this.load.image('ground', groundImage);
        this.load.image('water', waterImage);

        this.load.spritesheet('yoshiGreen',
            yoshiImage,
            { frameWidth: 128, frameHeight: 128 }
        );

        this.load.spritesheet('yoshiBlue',
            yoshiImageBlue,
            { frameWidth: 128, frameHeight: 128 }
        );

        this.load.spritesheet('yoshiPurple',
            yoshiImagePurple,
            { frameWidth: 128, frameHeight: 128 }
        );

        this.load.spritesheet('yoshiPink',
            yoshiImagePink,
            { frameWidth: 128, frameHeight: 128 }
        );

        this.load.spritesheet('yoshiBlack',
            yoshiImageBlack,
            { frameWidth: 128, frameHeight: 128 }
        );

        this.load.spritesheet('yoshiYellow',
            yoshiImageYellow,
            { frameWidth: 128, frameHeight: 128 }
        );

        this.load.audio('fanfare', [fanfare]);
        this.load.audio('badum', [badum]);
    }

    function create() {
        const scale = this.game.scale.width/scaleDimensions.w;
        const variable = props.variable;
        // const message = props.message;

        this.anims.create({
            key: 'walkGreen',
            frames: this.anims.generateFrameNumbers('yoshiGreen', { start: 0, end: 9 }),
            frameRate: 15,
            repeat: -1
        });

        this.anims.create({
            key: 'walkPurple',
            frames: this.anims.generateFrameNumbers('yoshiPurple', { start: 0, end: 9 }),
            frameRate: 15,
            repeat: -1
        });

        this.anims.create({
            key: 'walkPink',
            frames: this.anims.generateFrameNumbers('yoshiPink', { start: 0, end: 9 }),
            frameRate: 15,
            repeat: -1
        });

        this.anims.create({
            key: 'walkBlue',
            frames: this.anims.generateFrameNumbers('yoshiBlue', { start: 0, end: 9 }),
            frameRate: 15,
            repeat: -1
        });

        this.anims.create({
            key: 'walkBlack',
            frames: this.anims.generateFrameNumbers('yoshiBlack', { start: 0, end: 9 }),
            frameRate: 15,
            repeat: -1
        });

        this.anims.create({
            key: 'walkYellow',
            frames: this.anims.generateFrameNumbers('yoshiYellow', { start: 0, end: 9 }),
            frameRate: 15,
            repeat: -1
        });

        let fanfare = this.sound.add('fanfare', {loop: true, volume: 1});
        let badum = this.sound.add('badum', {loop: false, volume: 1});

        let speed = Math.ceil(Math.log2(variable) * 100);
        let spacing = Math.ceil(5000/variable);

        let colors = ["Green", "Purple", "Blue", "Pink", "Yellow", "Black"];

        let wall = this.physics.add.sprite(this.game.scale.width + 256, 0, 'ground');
        wall.setOrigin(0, 0);
        wall.displayHeight = this.game.scale.height;

        yoshiCount = variable;

        fanfare.play();

        // Draw yoshis
        for (let i = 0; i < variable; i++) {
            let color = colors[Math.floor(Math.random() * colors.length)];
            let yoshi = this.physics.add.sprite(-i * spacing, Math.random() * this.game.scale.height, `yoshi${color}`);
            yoshi.setScale(scale);
            yoshi.body.setGravity(0);
            yoshi.anims.play(`walk${color}`, true);
            yoshi.setVelocityX(speed);
            yoshis.push(yoshi);

            this.physics.add.overlap(yoshi, wall, () => {
                badum.play();
                yoshi.destroy();
                yoshiCount--;
            }, null, this);
        }

        setTimeout(() => {
            timeout = true;
        }, 15000);

        // text = this.add.text(0.5 * this.game.scale.width, 0.5 * this.game.scale.height, message, { fontSize: "30pt", stroke: "#000", strokeThickness: 5 });
        // text.setOrigin(0.5, 0.5);
    }

    function update() {
        if (yoshiCount <= 0 && timeout) {
            this.scene.stop();
            this.sys.game.destroy(true);
            
            if (props.onComplete) {
                props.onComplete();
            }
        }

        text.setScale(text.scale + (scaleDirection * 0.01));
        text.tint = Math.random() * 0xffffff;
        if (text.scale > 2 || text.scale < 0.5) {
            scaleDirection *= -1;
        }
    }

    const start = () => {
        const config = {
            type: Phaser.AUTO,
            width: "100vw",
            height: "100vh",
            transparent: true,
            parent: "phaser",
            scene: {
                preload,
                create,
                update
            }, 
            physics: {
                default: 'arcade',
                arcade: {
                    gravity: { y: 0 }
                }
            },
        };

        new Phaser.Game(config);
    }

    useEffect(() => {
        start();
    }, []);

    return (
        <div>
            <div id="phaser" />
        </div>
    );
}

export default RaidAlert;