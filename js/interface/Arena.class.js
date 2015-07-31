var Arena = function ()
{
    // CONSTRUCTEUR PROPRIETES
    // Recherche de l'objet JavaScript natif représentant la balise <canvas> et récupération du contexte 2D du canvas.
    this.canvas = document.querySelector('#js-interface-map canvas').getContext("2d");

    this.spriteLink = new Image();
    this.spriteLink.src = "images/Link_fight.gif";

    this.spriteGreenDragon = new Image();
    this.spriteGreenDragon.src = "images/green-dragon.gif";

    this.spriteRedDragon = new Image();
    this.spriteRedDragon.src = "images/red-dragon.gif";

    this.spriteBlackDragon = new Image();
    this.spriteBlackDragon.src = "images/black-dragon.gif";

    this.tileset = new Image();
    this.tileset.src = "images/cavern.jpg";

    this.gameOver = new Image();
    this.gameOver.src = "images/gameover.jpg";

    this.gameWin = new Image();
    this.gameWin.src = "images/gamewin.png";

};

Arena.prototype.drawCavern = function()
{
    this.canvas.drawImage
    (
        this.tileset, // image
        0, // dx
        0 // dy
    );
};

Arena.prototype.drawPlayer = function()
{
    this.canvas.drawImage
    (
        this.spriteLink, // image
        41, // dx
        234 // dy
    );
};

Arena.prototype.drawDragon = function(dragon)
{
    switch(dragon.type)
    {
        case DRAGON_TYPE_GREEN:
            this.canvas.drawImage
            (
                this.spriteGreenDragon,
                265,
                104
            );
            break;
        case DRAGON_TYPE_RED:
            this.canvas.drawImage
            (
                this.spriteRedDragon,
                230,
                41
            );
            break;
        case DRAGON_TYPE_BLACK:
            this.canvas.drawImage
            (
                this.spriteBlackDragon,
                170,
                42
            );
            break;
    }
};

Arena.prototype.drawOver = function()
{
    this.canvas.drawImage
    (
        this.gameOver, // image
        0, // dx
        0 // dy
    );
};

Arena.prototype.drawWin = function()
{
    this.canvas.drawImage
    (
        this.gameWin, // image
        0, // dx
        0 // dy
    );
};