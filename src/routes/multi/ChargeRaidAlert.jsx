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
        const variant = props.config.variant ? props.config.variant : "CHARGE_RIGHT";

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

        let wall;

        if (variant === "CHARGE_RIGHT") {
            wall = this.physics.add.sprite(this.game.scale.width + 256, 0, 'ground');
            wall.setOrigin(0, 0);
            wall.displayHeight = this.game.scale.height;
        } else if (variant === "CHARGE_LEFT") {
            wall = this.physics.add.sprite(-256, 0, 'ground');
            wall.setOrigin(1, 0);
            wall.displayHeight = this.game.scale.height;
        } else if (variant === "CHARGE_UP") {
            wall = this.physics.add.sprite(0, -256, 'ground');
            wall.setOrigin(0, 1);
            wall.displayWidth = this.game.scale.width;
        } else if (variant === "CHARGE_DOWN") {
            wall = this.physics.add.sprite(0, this.game.scale.width + 256, 'ground');
            wall.setOrigin(0, 0);
            wall.displayWidth = this.game.scale.width;
        }

        spriteCount = variable;

        music.play();

        // Draw sprites
        for (let i = 0; i < variable; i++) {
            let r = Math.floor(Math.random() * props.config.sprites.length);
            let sprite;
            const spriteHeight = props.config.sprites[r].frameHeight * scale;
            const spriteWidth = props.config.sprites[r].frameWidth * scale;
            if (variant === "CHARGE_RIGHT") {
                sprite = this.physics.add.sprite(-i * spacing, Math.random() * (this.game.scale.height - spriteHeight), `sprite${r}`);
                sprite.setOrigin(0, 0);
                sprite.setScale(scale);
                sprite.body.setGravity(0);
                sprite.anims.play(`animation${r}`, true);
                sprite.setVelocityX(speed);
            } else if (variant === "CHARGE_LEFT") {
                sprite = this.physics.add.sprite((i * spacing) + this.game.scale.width, Math.random() * (this.game.scale.height - spriteHeight), `sprite${r}`);
                sprite.setOrigin(0, 0);
                sprite.setScale(scale);
                sprite.body.setGravity(0);
                sprite.anims.play(`animation${r}`, true);
                sprite.setVelocityX(-speed);
            } else if (variant === "CHARGE_UP") {
                sprite = this.physics.add.sprite(Math.random() * (this.game.scale.width - spriteWidth), (i * spacing) + this.game.scale.height, `sprite${r}`);
                sprite.setOrigin(0, 0);
                sprite.setScale(scale);
                sprite.body.setGravity(0);
                sprite.anims.play(`animation${r}`, true);
                sprite.setVelocityY(-speed);
            } else if (variant === "CHARGE_DOWN") {
                sprite = this.physics.add.sprite(Math.random() * (this.game.scale.width - spriteWidth), -i * spacing, `sprite${r}`);
                sprite.setOrigin(0, 0);
                sprite.setScale(scale);
                sprite.body.setGravity(0);
                sprite.anims.play(`animation${r}`, true);
                sprite.setVelocityY(speed);
            }

            this.physics.add.overlap(sprite, wall, () => {
                leavingSound.play();
                sprite.destroy();
                spriteCount--;
            }, null, this);
        }

        setTimeout(() => {
            timeout = true;
        }, 15000);
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
            width: window.innerWidth,
            height: window.innerHeight,
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