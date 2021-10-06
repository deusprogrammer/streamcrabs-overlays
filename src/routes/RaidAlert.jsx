import React, {useState, useEffect} from 'react';
import Phaser from 'phaser';

let RaidAlert = () => {
    let ground, waterGroup;

    let isHurt = false;
    let isDying = false;
    let timeout = null;

    let scaleDimensions = {w: 1440, h: 820};

    const [clicked, setClicked] = useState(false);
    const [raider, setRaider] = useState("daddyfartbux");
    const [raidSize, setRaidSize] = useState(100);
    const [game, setGame] = useState(null);

    function preload() {
        const slimeImage = process.env.PUBLIC_URL + '/images/slime-sprite.png';
        const linkImage = process.env.PUBLIC_URL + '/images/link.png';

        const groundImage = process.env.PUBLIC_URL + '/images/ground.png';
        const waterImage = process.env.PUBLIC_URL + '/images/water.png';

        const bgmSound = process.env.PUBLIC_URL + '/sounds/bgm.mp3';
        const battleSound = process.env.PUBLIC_URL + '/sounds/battle.wav';
        const hurtSound = process.env.PUBLIC_URL + '/sounds/hurt.wav';
        const dieSound = process.env.PUBLIC_URL + '/sounds/die.wav';
        const fanfareSound = process.env.PUBLIC_URL + '/sounds/fanfare.wav';;

        this.load.image('ground', groundImage);
        this.load.image('water', waterImage);

        this.load.spritesheet('slime', 
            slimeImage,
            { frameWidth: 80, frameHeight: 80 }
        );
        this.load.spritesheet('link', 
            linkImage,
            { frameWidth: 80, frameHeight: 160 }
        );

        this.load.audio('bgm', [bgmSound]);
        this.load.audio('battle', [battleSound]);
        this.load.audio('hurt', [hurtSound]);
        this.load.audio('die', [dieSound]);
        this.load.audio('fanfare', [fanfareSound]);
    }

    function create() {
        const groundWidth = this.textures.get('ground').getSourceImage().width;
        const groundHeight = this.textures.get('ground').getSourceImage().height;
        const waterWidth = this.textures.get('water').getSourceImage().width;
        const groundHeights = [Math.random() * 100 + 200, Math.random() * 100 + 200];
        const scale = this.game.scale.width/scaleDimensions.w;

        console.log("SCALE: " + scale);

        ground = this.physics.add.staticGroup();
        waterGroup = this.physics.add.staticGroup();
        this.anims.create({
            key: 'wobble',
            frames: this.anims.generateFrameNumbers('slime', { start: 0, end: 2 }),
            frameRate: 10,
            repeat: -1
        });

        this.anims.create({
            key: 'idle',
            frames: this.anims.generateFrameNumbers('link', { start: 0, end: 0 }),
            frameRate: 10,
            repeat: -1
        });

        this.anims.create({
            key: 'hurt',
            frames: this.anims.generateFrameNumbers('link', { start: 1, end: 1 }),
            frameRate: 10,
            repeat: -1
        });

        let bgm = this.sound.add('bgm', {loop: true, volume: 0.25});
        let battle = this.sound.add('battle', {loop: false, volume: 3});
        let hurt = this.sound.add('hurt', {loop: false, volume: 3});
        let die = this.sound.add('die', {loop: false});
        let fanfare = this.sound.add('fanfare', {loop: false, volume: 3});
        die.once('complete', () => {
            this.scene.stop();
            this.sys.game.destroy(true);
            setClicked(false);
            clearTimeout(timeout);
        });
        fanfare.once('complete', () => {
            this.scene.stop();
            this.sys.game.destroy(true);
            setClicked(false);
            clearTimeout(timeout);
        })

        battle.play();
        bgm.play();

        // Draw Link
        const linkY = this.game.scale.height - (groundHeight - groundHeights[1]);
        let link = this.physics.add.sprite(groundWidth + 200, linkY, 'link');
        link.setOrigin(0, 1);
        link.setBounce(0.5);
        link.setScale(scale);
        link.setGravityY(300);
        link.refreshBody();
        link.body.setCollideWorldBounds(true);
        link.anims.play('idle', true);
        this.physics.add.collider(link, ground);

        // Draw slimes
        for (let i = 0; i < raidSize; i++) {
            let slime = this.physics.add.sprite(-i * .5, (Math.random() * (this.game.scale.height - 100)) - (groundHeight - groundHeights[0]), 'slime');
            slime.setScale(scale);
            slime.setBounce(Math.min(1, Math.random() + 0.5));
            slime.body.setGravity(400);
            slime.anims.play('wobble', true);
            slime.setVelocityX(Math.random() * 300);
            this.physics.add.collider(slime, ground);
            this.physics.add.overlap(link, slime, () => {
                if (!isHurt) {
                    isHurt = true;
                    hurt.play();
                }
                link.play('hurt');
                link.setVelocity(500, -50);
                link.body.useDamping = true;
                link.setDrag(0.99);
            }, null, this);
            this.physics.add.overlap(link, waterGroup, () => {
                if (!isDying) {
                    isDying = true;
                    die.play();
                }
                bgm.stop();
                link.play('hurt');
                link.setVelocity(0, 50);
            }, null, this);
        }

        // Draw water
        let waterX = 0;
        while (waterX < this.game.scale.width) {
            let water = waterGroup.create(0, 0, "water");
            water.setScale(scale);
            water.setOrigin(0, 1);
            water.x = waterX;
            water.y = this.game.scale.height + 100;
            water.refreshBody();
            waterX += (waterWidth * scale);
        }

        // Draw ground
        for (let i = 0; i < 2; i++) {
            let x = i * ((groundWidth * scale) + 200);
            let height = groundHeights[i];
            let g1 = ground.create(x, this.game.scale.height + height, 'ground');
            g1.setOrigin(0, 1);
            g1.setScale(scale);
            g1.refreshBody();
        }

        this.add.text(0, 0, `Raid of ${raidSize} incoming from ${raider}`, { fontSize: "30pt", stroke: "#000", strokeThickness: 5 });

        // Set timeout
        timeout = setTimeout(() => {
            bgm.stop();
            fanfare.play();
        }, 10000);
    }

    function update() {
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
                    gravity: { y: 200 }
                }
            },
        };

        setGame(new Phaser.Game(config));
    }

    useEffect(() => {
        // Get url params
        const urlParams = new URLSearchParams(window.location.search);
        setRaider(urlParams.get('raider') ? urlParams.get('raider') : "daddyfartbux");
        setRaidSize(urlParams.get('raidSize') ? urlParams.get('raidSize') : 10);
    }, []);

    return (
        <div>
            <div id="phaser" />
            {clicked ? null : 
                <div>
                    <p>Testing with size <b>{raidSize}</b> and raider <b>{raider}</b></p>
                    <button onClick={() => {
                        setClicked(true);
                        start();
                    }}>Click to Test</button>
                </div>
            }
        </div>
    );
}

export default RaidAlert;
