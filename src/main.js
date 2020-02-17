let BootScene = new Phaser.Class({
    Extends: Phaser.Scene,
    initialize:

        function BootScene ()
        {
            Phaser.Scene.call(this, { key: 'BootScene' });
        },

    preload: function ()
    {
        // здесь будет загрузка ресурсов
    },

    create: function ()
    {
        this.scene.start('WorldScene');
    }
});

let WorldScene = new Phaser.Class({
    Extends: Phaser.Scene,
    initialize:
        function WorldScene ()
        {
            Phaser.Scene.call(this, { key: 'WorldScene' });
        },
    preload: function ()
    {
        // тайлы для карты
        this.load.image('tiles', 'assets/map/w2.png');

        // карта в json формате
        this.load.tilemapTiledJSON('map', 'assets/map/map_w2.json');

        // наши персонаж
        this.load.spritesheet('player', 'resurs/hummen_go3.png', { frameWidth: 38, frameHeight: 39 });
    },
    create: function ()
    {
        let map = this.make.tilemap({ key: 'map' });
        let tiles = map.addTilesetImage('w2', 'tiles');
        // let tiles = map.addTilesetImage('spritesheet', 'tiles');

        // Load layer
        let grass = map.createStaticLayer('Grass', tiles, 0, 0);
        let dirt = map.createStaticLayer('Dirt', tiles, 0, 0);
        let road = map.createStaticLayer('Road', tiles, 0, 0);
        let city_region = map.createStaticLayer('City Region', tiles, 0, 0);
        let water = map.createStaticLayer('Water', tiles, 0, 0);
        let wall = map.createStaticLayer('Wall', tiles, 0, 0);

        // let obstacles = map.createStaticLayer('Obstacles', tiles, 0, 0);
        // obstacles.setCollisionByExclusion([-1]);
        water.setCollisionByProperty({ collides: true });
        wall.setCollisionByProperty({ collides: true });

        const spawnPoint = map.findObject("Objects", obj => obj.name === "Spawn Point");
        console.log(spawnPoint, map, tiles);
        if (spawnPoint) {
            // player = this.physics.add.sprite(spawnPoint.x, spawnPoint.y, "atlas", "misa-front");
            this.player = this.physics.add.sprite(spawnPoint.x, spawnPoint.y, 'player', 0);
        } else {
            this.player = this.physics.add.sprite(48, 79, 'player', 2);
        }

        this.physics.world.bounds.width = map.widthInPixels;
        this.physics.world.bounds.height = map.heightInPixels;
        this.player.setCollideWorldBounds(true);

        this.cursors = this.input.keyboard.createCursorKeys();

        // ограничиваем камеру размерами карты
        this.cameras.main.setBounds(0, 0, map.widthInPixels, map.heightInPixels);
        // заставляем камеру следовать за игроком
        this.cameras.main.startFollow(this.player);
        //своего рода хак, чтобы предотвратить пояление полос в тайлах
        this.cameras.main.roundPixels = true;

        let controls = [
            {
                name: 'left',
                frames: [2, 10, 18, 26, 2]
            },
            {
                name: 'right',
                frames: [2, 10, 18, 26, 2]
            },
            {
                name: 'up',
                frames: [0, 8, 16, 24, 0]
            },
            {
                name: 'down',
                frames: [4, 12, 20, 28, 4]
            },
            {
                name: 'left-up',
                frames: [1, 9, 17, 25, 1]
            },
            {
                name: 'left-down',
                frames: [3, 11, 19, 27, 3]
            },
            {
                name: 'right-up',
                frames: [7, 15, 23, 31, 7]
            },
            {
                name: 'right-down',
                frames: [5, 13, 21, 29, 5]
            },
        ];

        controls.forEach(elem => this.anims.create({
                key: elem.name,
                frames: this.anims.generateFrameNumbers('player', { frames: elem.frames }),
                frameRate: 10,
                repeat: -1
            })
        );
        // анимация клавиши 'left' для персонажа
        // мы используем одни и те же спрайты для левой и правой клавиши, просто зеркалим их
        // this.anims.create({
        //     key: 'left',
        //     frames: this.anims.generateFrameNumbers('player', { frames: [2, 10, 18, 26, 2]}), //2, 10, 18, 26, 2
        //     // frames: this.anims.generateFrameNumbers('player', { frames: [1, 7, 1, 13]}),
        //     frameRate: 10,
        //     repeat: -1
        // });
        // // анимация клавиши 'right' для персонажа
        // this.anims.create({
        //     key: 'right',
        //     frames: this.anims.generateFrameNumbers('player', { frames: [2, 10, 18, 26, 2] }),
        //     // frames: this.anims.generateFrameNumbers('player', { frames: [1, 7, 1, 13] }),
        //     frameRate: 10,
        //     repeat: -1
        // });
        // this.anims.create({
        //     key: 'up',
        //     frames: this.anims.generateFrameNumbers('player', { frames: [0, 8, 16, 24, 0]}), //0, 8, 16, 24, 0
        //     // frames: this.anims.generateFrameNumbers('player', { frames: [2, 8, 2, 14]}),
        //     frameRate: 10,
        //     repeat: -1
        // });
        // this.anims.create({
        //     key: 'down',
        //     frames: this.anims.generateFrameNumbers('player', { frames: [4, 12, 20, 28, 4] }), //
        //     // frames: this.anims.generateFrameNumbers('player', { frames: [ 0, 6, 0, 12 ] }),
        //     frameRate: 10,
        //     repeat: -1
        // });

        // this.physics.add.collider(this.player, obstacles);
        this.physics.add.collider(this.player, water);
        this.physics.add.collider(this.player, wall);

        // this.spawns = this.physics.add.group({ classType: Phaser.GameObjects.Zone });
        // for(let i = 0; i < 30; i++) {
        //     let x = Phaser.Math.RND.between(0, this.physics.world.bounds.width);
        //     let y = Phaser.Math.RND.between(0, this.physics.world.bounds.height);
        //     // параметры: x, y, width, height
        //     this.spawns.create(x, y, 20, 20);
        // }
        // this.physics.add.overlap(this.player, this.spawns, this.onMeetEnemy, false, this);
    },
    // update: function (time, delta)
    update: function ()
    {
        this.player.body.setVelocity(0);

        // горизонтальное перемещение
        if (this.cursors.left.isDown) {
            this.player.body.setVelocityX(-80);
        } else if (this.cursors.right.isDown) {
            this.player.body.setVelocityX(80);
        }

        // вертикальное перемещение
        if (this.cursors.up.isDown) {
            this.player.body.setVelocityY(-80);
        } else if (this.cursors.down.isDown) {
            this.player.body.setVelocityY(80);
        }

        // В конце обновляем анимацию и устанавливаем приоритет анимации
        // left/right над анимацией up/down
        if (this.cursors.left.isDown && this.cursors.up.isDown) {
            this.player.anims.play('left-up', true);
            this.player.flipX = true; //Разворачиваем спрайты персонажа вдоль оси X
        } else if (this.cursors.left.isDown && this.cursors.down.isDown) {
            this.player.anims.play('left-down', true);
            this.player.flipX = true; //Разворачиваем спрайты персонажа вдоль оси X
        } else if (this.cursors.right.isDown && this.cursors.up.isDown) {
            this.player.anims.play('right-up', true);
            this.player.flipX = true; //Разворачиваем спрайты персонажа вдоль оси X
        } else if (this.cursors.right.isDown && this.cursors.down.isDown) {
            this.player.anims.play('right-down', true);
            this.player.flipX = true; //Разворачиваем спрайты персонажа вдоль оси X
        } else if (this.cursors.left.isDown) {
            this.player.anims.play('left', true);
            this.player.flipX = true; //Разворачиваем спрайты персонажа вдоль оси X
        } else if (this.cursors.right.isDown) {
            this.player.anims.play('right', true);
            this.player.flipX = false; //Отменяем разворот спрайтов персонажа вдоль оси X
        } else if (this.cursors.up.isDown) {
            this.player.anims.play('up', true);
        } else if (this.cursors.down.isDown) {
            this.player.anims.play('down', true);
        } else {
            this.player.anims.stop();
        }
    },
    onMeetEnemy: function(player, zone) {
        // мы перемещаем зону в другое место
        zone.x = Phaser.Math.RND.between(0, this.physics.world.bounds.width);
        zone.y = Phaser.Math.RND.between(0, this.physics.world.bounds.height);

        // встряхиваем мир
        this.cameras.main.shake(300);

        // начало боя

    },
});

let config = {
    type: Phaser.AUTO,
    parent: 'game-container',
    // parent: 'content',
    width: 320,
    // width: 640,
    height: 240,
    // height: 480,
    zoom: 2,
    pixelArt: true,
    physics: {
        default: 'arcade',
        arcade: {
            gravity: { y: 0 },
            debug: true
        }
    },
    scene: [
        BootScene,
        WorldScene
    ]
};
let game = new Phaser.Game(config);