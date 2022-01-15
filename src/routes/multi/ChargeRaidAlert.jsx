import React, {useEffect} from 'react';
import Phaser from 'phaser';

let RaidAlert = (props) => {
    let spriteCount = 0;
    let timeout = false;

    let scaleDimensions = {w: 1440, h: 820};

    function preload() {
        const groundImage = process.env.PUBLIC_URL + '/images/ground.png';
        this.load.image('ground', groundImage);

        props.config.sprites.forEach((sprite, index) => {
            this.load.spritesheet(`sprite${index}`,
                sprite.file,
                { frameWidth: sprite.frameWidth, frameHeight: sprite.frameHeight }
            );
        });

        this.load.audio('music', [props.config.music.file]);
        this.load.audio('leaving', [props.config.leavingSound.file]);
    }

    function create() {
        const scale = this.game.scale.width/scaleDimensions.w;
        const variable = props.variable;
        const message = props.message;

        props.config.sprites.forEach((sprite, index) => {
            this.anims.create({
                key: `animation${index}`,
                frames: this.anims.generateFrameNumbers(`sprite${index}`, { start: sprite.startFrame, end: sprite.endFrame }),
                frameRate: sprite.frameRate,
                repeat: -1
            });
        });

        let music = this.sound.add('music', {loop: true, volume: props.config.music.volume});
        let leavingSound = this.sound.add('leaving', {loop: false, volume: props.config.leavingSound.volume});

        let speed = (Math.ceil(Math.log2(variable) + 1) * 100);
        let spacing = Math.ceil(5000/variable);

        let wall = this.physics.add.sprite(this.game.scale.width + 256, 0, 'ground');
        wall.setOrigin(0, 0);
        wall.displayHeight = this.game.scale.height;

        spriteCount = variable;

        music.play();

        // Draw sprites
        for (let i = 0; i < variable; i++) {
            let r = Math.floor(Math.random() * props.config.sprites.length);
            const spriteHeight = this.textures.get(`sprite${r}`).getSourceImage().height * scale;
            let sprite = this.physics.add.sprite(-i * spacing, Math.random() * (this.game.scale.height - spriteHeight), `sprite${r}`);
            sprite.setOrigin(0, 0);
            sprite.setScale(scale);
            sprite.body.setGravity(0);
            sprite.anims.play(`animation${r}`, true);
            sprite.setVelocityX(speed);

            this.physics.add.overlap(sprite, wall, () => {
                leavingSound.play();
                sprite.destroy();
                spriteCount--;
            }, null, this);
        }

        setTimeout(() => {
            timeout = true;
        }, 15000);

        // text = this.add.text(0.5 * this.game.scale.width, 0.5 * this.game.scale.height, message, { fontSize: "30pt", stroke: "#000", strokeThickness: 5 });
        // text.setOrigin(0.5, 0.5);
    }

    function update() {
        if (spriteCount <= 0 && timeout) {
            this.scene.stop();
            this.sys.game.destroy(true);
            
            if (props.onComplete) {
                props.onComplete();
            }
        }

        // text.setScale(text.scale + (scaleDirection * 0.01));
        // text.tint = Math.random() * 0xffffff;
        // if (text.scale > 2 || text.scale < 0.5) {
        //     scaleDirection *= -1;
        // }
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