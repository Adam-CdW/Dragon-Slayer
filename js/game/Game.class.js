var Game = function()
{
    // CONSTRUCTEUR PROPRIETES
    this.menu = new Menu();
    this.messagePanel = new MessagePanel();
    this.difficulty = null;
    this.dragon = null;
    this.player = null;
    this.map = new Map();
    this.world = new World();
    this.arena = new Arena();
    this.animationId = null;

    // EVENT LISTENER
    $(document).on("game:start",this.onGameStart.bind(this));
    $(document).on("game:change-state",this.onGameChangeState.bind(this));
};

Game.prototype.onGameChangeState = function(event, state)
{
    switch (state)
    {
        case GAME_STATE_PLAY_START:
        {
            // Changement d'affichage
            $("#js-interface-menu").fadeOut(1000);
            $("main").delay(1000).fadeIn(1500, function()
            {
                $("h1").removeClass("animate-fire").addClass("static-title");
            });

            // Messages de bienvenue et didacticiel
            $.event.trigger("message:add", [ 'Bienvenue ' + this.player.nickName + '.', 'important' ]);
            $.event.trigger("message:add", [ "- Trouve et détruis le dragon noir pour gagner la partie !", 'normal' ]);
            $.event.trigger("message:add", [ "- Pour commencer à explorer cette zone, déplace toi en utilisant les flèches du clavier.", 'normal' ]);
            $.event.trigger("message:add", [ "- Les escaliers mènent à des cavernes. Certaines contiennent des trésors, d'autres des dragons...", 'normal' ]);

            // Mise à jour de l'état du jeu.
            this.map.refreshGameState(this.dragon, this.player);

            // Placement du joueur sur la position de départ
            this.player.moveTo(16,23);

            // Gestionnaire d'event pour les touche du clavier
            $(document).on("keydown",this.onKeyDownGamePlay.bind(this));

            // Affichage de la carte
            this.animationId = window.requestAnimationFrame(this.update.bind(this));

            break;
        }
        case GAME_STATE_PLAY:
        {
            $(document).off("keydown");
            $(document).on("keydown",this.onKeyDownGamePlay.bind(this));
            // Affichage de la carte
            window.requestAnimationFrame(this.update.bind(this));
            break;
        }

        case GAME_STATE_FIGHT:
        {
            $(document).off("keydown");

            window.cancelAnimationFrame(this.animationId);

            this.arena.drawCavern();
            this.arena.drawPlayer();
            this.arena.drawDragon(this.dragon);

            $(document).on("keydown",this.onKeyDownGameFight.bind(this));
            break;
        }

        case GAME_STATE_PLAY_OVER:
        {
            $(document).off("keydown");
            this.arena.drawOver();
            $.event.trigger("message:add", [ "Tu as perdu ! Pour rejouer clique sur le titre en haut", 'important' ]);
            break;
        }

        case GAME_STATE_PLAY_WIN:
        {
            $(document).off("keydown");
            this.arena.drawWin();
            $.event.trigger("message:add", [ "Bravo tu as vaincu ! Pour essayer un autre niveau de difficulté clique sur le titre en haut", 'important' ]);
            break;
        }
    }
};

Game.prototype.onGameStart = function()
{
    // Récupération des données du formulaire du menu de démarrage
    var options;
    options = this.menu.getOptions();

    // Réglage de la difficulté
    this.difficulty = options.difficulty;

    // Création du joueur
    this.player = new Player
    (
        options.nickName,
        options.agility,
        options.strength,
        options.difficulty
    );

    // Lancement du jeu !
    $.event.trigger("game:change-state",[GAME_STATE_PLAY_START]);
};

Game.prototype.onKeyDownGameFight = function(event)
{
    var playerSpeed;
    var dragonSpeed;

    if (event.keyCode != KEY_F)
    {
        return false;
    }

    playerSpeed = rollDice();
    dragonSpeed = rollDice();

    if (playerSpeed >= dragonSpeed)
    {
        this.player.attack(this.dragon);
    }
    else
    {
        this.dragon.attack(this.player);
    }

    // Mise à jour de l'état du jeu.
    this.map.refreshGameState(this.dragon, this.player);

    if (this.player.isDead() == true)
    {
        $.event.trigger("game:change-state",[GAME_STATE_PLAY_OVER]);
    }

    if (this.dragon.isDead() == true)
    {
        if (this.dragon.type == DRAGON_TYPE_BLACK)
        {
            $.event.trigger("game:change-state",[GAME_STATE_PLAY_WIN]);
        }
        else
        {
            $.event.trigger("message:add", [ "Tu as vaincu un dragon mais leur roi t'attend...", 'important' ]);
            this.player.giveHp(getRandomInteger(20,40));
            // Mise à jour de l'état du jeu.
            this.map.refreshGameState(this.dragon, this.player);
            $.event.trigger("game:change-state",[GAME_STATE_PLAY]);
        }
    }


};

Game.prototype.onKeyDownGamePlay = function(event)
{
    var index;

    switch(event.keyCode)
    {
        case KEY_DOWN_ARROW:
            this.player.tryMove(DIRECTION_SOUTH,this.world);
            this.map.setPlayerDirection(DIRECTION_SOUTH);
            break;

        case KEY_LEFT_ARROW:
            this.player.tryMove(DIRECTION_WEST,this.world);
            this.map.setPlayerDirection(DIRECTION_WEST);
            break;

        case KEY_RIGHT_ARROW:
            this.player.tryMove(DIRECTION_EAST,this.world);
            this.map.setPlayerDirection(DIRECTION_EAST);
            break;

        case KEY_UP_ARROW:
            this.player.tryMove(DIRECTION_NORTH,this.world);
            this.map.setPlayerDirection(DIRECTION_NORTH);
            break;

        default :
            return false;
    }

    console.log("position du joueur :" + this.player.x + this.player.y);

    for (index = 0; index < dataWorldEvents.length; index++)
    {
        if (dataWorldEvents[index].done == false)
        {
            if(this.player.x == dataWorldEvents[index].x && this.player.y == dataWorldEvents[index].y)
            {
                switch(dataWorldEvents[index].what)
                {
                    case 'treasure-1':
                        this.player.giveTreasure(TREASURE_TYPE_SWORD,this.difficulty);
                        break;

                    case 'treasure-2':
                        this.player.giveTreasure(TREASURE_TYPE_ARMOR,this.difficulty);
                        break;

                    case 'treasure-3':
                        $.event.trigger("message:add", [ "Tu as trouvé une fontaine magique !", 'important' ]);
                        this.player.giveHp(getRandomInteger(45,70));
                        break;

                    case 'dragon-1':
                        // Lancement du combat !
                        $.event.trigger("message:add", [ "Tu as pénétré dans l'antre du dragon d'emmeraude, prépare toi au combat. Appuie sur la touche F de ton clavier pour essayer de le taper.", 'important' ]);
                        this.dragon = new Dragon(DRAGON_TYPE_GREEN,this.difficulty);
                        $.event.trigger("game:change-state",[GAME_STATE_FIGHT]);
                        break;

                    case 'dragon-2':
                        // Lancement du combat !
                        $.event.trigger("message:add", [ "Tu as pénétré dans l'antre du dragon des ténèbres, prépare toi au combat. Appuie sur la touche F de ton clavier pour essayer de le taper.", 'important' ]);
                        this.dragon = new Dragon(DRAGON_TYPE_BLACK,this.difficulty);
                        $.event.trigger("game:change-state",[GAME_STATE_FIGHT]);
                        break;

                    case 'dragon-3':
                        // Lancement du combat !
                        $.event.trigger("message:add", [ "Tu as pénétré dans l'antre du dragon rouge, prépare toi au combat. Appuie sur la touche F de ton clavier pour essayer de le taper.", 'important' ]);
                        this.dragon = new Dragon(DRAGON_TYPE_RED,this.difficulty);
                        $.event.trigger("game:change-state",[GAME_STATE_FIGHT]);
                        break;
                }

                // L'évènement s'est produit, il ne doit plus s'exécuter de nouveau.
                dataWorldEvents[index].done = true;
            }
        }
        else
        {
            if(this.player.x == dataWorldEvents[index].x && this.player.y == dataWorldEvents[index].y)
            {
                $.event.trigger("message:add",
                    [
                        "Tu es déjà passé ici, il n'y a plus rien...",
                        'normal'
                    ]);
            }
        }
    }
    // Mise à jour de l'état du jeu.
    this.map.refreshGameState(this.dragon, this.player);
};

Game.prototype.update = function()
{
    this.map.drawCavern(this.world);
    this.map.drawPlayer(this.player.x-this.world.offsetX,this.player.y-this.world.offsetY);
    this.animationId = window.requestAnimationFrame(this.update.bind(this));
};
