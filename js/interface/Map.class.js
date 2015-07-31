var Map = function ()
{
    // CONSTRUCTEUR PROPRIETES
    // Recherche de l'objet jQuery représentant l'état du jeu.
    this.$mapState = $('#js-interface-map').find('table');

    // Recherche de l'objet JavaScript natif représentant la balise <canvas> et récupération du contexte 2D du canvas.
    this.canvas = document.querySelector('#js-interface-map canvas').getContext("2d");

    // Création du sprite du joueur qui sera dessiné dans le canvas.
    this.sprite = new Image();
    this.sprite.src = "images/link.png";
    this.spriteX = 0;
    this.spriteY = 0;

    /*
     * Chargement du fichier image contenant tous les petits carreaux.
     *
     * La classe Image représente un objet DOM de la balise HTML <img>.
     */
    this.tileset = new Image();
    this.tileset.src = "images/tileset.png";

};

Map.prototype.refreshGameState = function(dragon, player)
{
    var dragonHp;
    var playerArmor;
    var playerSword;

    dragonHp = 'N/A';
    if(dragon != null && dragon.hp > 0)
    {
        // Il y a bien un dragon vivant, récupération de ses points de vie.
        dragonHp = dragon.hp;

        this.$mapState.find('th:first-child').addClass('dragon')
            .removeClass('disabled');
    }

    playerArmor = 'Aucune';
    if(player.armor != null)
    {
        // Le joueur possède une armure, récupération de son nom.
        playerArmor = player.armor;

        this.$mapState.find('th:nth-child(3)').addClass('player')
            .removeClass('disabled');
    }

    playerSword = 'Aucune';
    if(player.sword != null)
    {
        // Le joueur possède une épée, récupération de son nom.
        playerSword = player.sword;

        this.$mapState.find('th:nth-child(4)').addClass('player')
            .removeClass('disabled');
    }

    // Consulter dragon-slayer.html pour l'ordre des colonnes du tableau.
    this.$mapState.find('td:first-child').text(dragonHp);
    this.$mapState.find('td:nth-child(2)').text(player.hp);
    this.$mapState.find('td:nth-child(3)').text(playerArmor);
    this.$mapState.find('td:nth-child(4)').text(playerSword);
};

Map.prototype.drawCavern = function(world)
{
    var x;
    var y;
    var tile;

    for (x = 0; x < 40; x++)
    {
        for (y = 0; y < 30; y++)
        {
            tile = world.getTileAt(x,y);

            this.canvas.drawImage
            (
                this.tileset, // image
                dataTiles[tile].sx, // sx
                dataTiles[tile].sy, // sy
                TILESET_PIXEL_SIZE, // sWidth
                TILESET_PIXEL_SIZE, // sHeight
                TILESET_PIXEL_SIZE*x, // dx
                TILESET_PIXEL_SIZE*y, // dy
                TILESET_PIXEL_SIZE, // dWidth
                TILESET_PIXEL_SIZE // dHeight
            );
        }
    }
};

Map.prototype.drawPlayer = function (playerX, playerY)
{
    this.canvas.drawImage
    (
        this.sprite, // image
        this.spriteX, // sx
        this.spriteY, // sy
        TILESET_PIXEL_SIZE, // sWidth
        TILESET_PIXEL_SIZE, // sHeight
        TILESET_PIXEL_SIZE*playerX, // dx
        TILESET_PIXEL_SIZE*playerY, // dy
        TILESET_PIXEL_SIZE, // dWidth
        TILESET_PIXEL_SIZE // dHeight
    );
};

Map.prototype.setPlayerDirection = function(direction)
{
    if (this.spriteY == 0)
    {
        this.spriteY = 16;
    }
    else
    {
        this.spriteY = 0;
    }

    // On change la coordonnée X du sprite en fonction de la direction du joueur.
    switch(direction)
    {
        case DIRECTION_EAST:
            this.spriteX = 48;
            break;

        case DIRECTION_NORTH:
            this.spriteX = 32;
            break;

        case DIRECTION_SOUTH:
            this.spriteX = 0;
            break;

        case DIRECTION_WEST:
            this.spriteX = 16;
            break;
    }
};
