var Player = function(nickName, agility, strength, difficulty)
{
    // CONSTRUCTEUR PROPRIETES
    this.agility = agility;
    this.armor = null;
    this.attackLevel = 1;
    this.defenseLevel = 1;
    this.strength = strength;
    this.sword = null;
    this.x = null;
    this.y = null;

    if (nickName.length == 0)
    {
        nickName = "l'inconnu";
    }
    this.nickName = nickName.toLowerCase();

    switch (difficulty)
    {
        case LEVEL_EASY:
            this.hp = getRandomInteger(this.strength*20,this.strength*20+50);
            break;
        case LEVEL_NORMAL:
            this.hp = getRandomInteger(this.strength*19,this.strength*19+50);
            break;
        case LEVEL_HARD:
            this.hp = getRandomInteger(this.strength*18,this.strength*18+50);
            break;
    }
};

Player.prototype.isDead = function()
{
    // METHODE isDead, la comparaison cidessous génère automatiquement un booléen et dc cette méthode return true si le joueur est mort
    return this.hp <= 0;
};

Player.prototype.takeHp = function (damagePoints)
{
    this.hp -= damagePoints;
    $.event.trigger("message:add", [ "- Le dragon t'inflige " + damagePoints + ' points de dégats.', 'bad' ]);
};

Player.prototype.giveHp = function (healthPoints)
{
    this.hp += healthPoints;
    $.event.trigger("message:add", [ "Tu récupères " + healthPoints + ' PV(s), espéront que ça suffise...', 'good' ]);
};

Player.prototype.giveTreasure = function(type, difficulty)
{
    if (type == TREASURE_TYPE_ARMOR)
    {
        this.armor = dataTreasures[difficulty].armor;

        switch(this.armor)
        {
            case ARMOR_COPPER:
                this.defenseLevel = 2;
                break;

            case ARMOR_IRON:
                this.defenseLevel = 3;
                break;

            case ARMOR_MAGICAL:
                this.defenseLevel = 4;
                break;
        }
        $.event.trigger("message:add",
            [
            "Tu as trouvé l'" + this.armor + ' !',
            'important'
            ]);
    }
    else
    {
        this.sword = dataTreasures[difficulty].sword;

        switch (this.sword)
        {
            case SWORD_WOOD:
                this.attackLevel = 2;
                break;
            case SWORD_STEEL:
                this.attackLevel = 3;
                break;
            case SWORD_EXCALIBUR:
                this.attackLevel = 4;
                break;
        }
        $.event.trigger("message:add",
            [
                "Mazette, l'" + this.sword + ' !',
                'important'
            ]);
    }
};

Player.prototype.attack = function(dragon)
{
    var damagePoints;
    if (dragon.tryHit(this.agility) == false)
    {
        $.event.trigger("message:add", [ '- Echec, tu ne touches pas le dragon...', 'bad' ]);
        // message panel coup manqué
        return;
    }
    damagePoints = getRandomInteger(10,25);

    damagePoints -= dragon.getDefenseLevel();

    damagePoints += this.getAttackLevel();

    damagePoints = Math.ceil(damagePoints);

    if (damagePoints < 0)
    {
        damagePoints = 0;
    }

    dragon.takeHp(damagePoints);
};

Player.prototype.getAttackLevel = function()
{
    return rollDice()*this.attackLevel+this.strength;
};

Player.prototype.getDefenseLevel = function()
{
    return getRandomInteger(2,8)+this.defenseLevel+this.agility;
};

Player.prototype.moveTo = function(x,y)
{
    this.x = x;
    this.y = y;
};

Player.prototype.tryHit = function(dragonAgility)
{
    return getRandomInteger(1, dragonAgility) > getRandomInteger(1, this.agility);
};

Player.prototype.tryMove = function(direction,world) {
    var x;
    var y;

    x = this.x;
    y = this.y;

    switch (direction) {
        case DIRECTION_EAST:
            x++;
            break;

        case DIRECTION_NORTH:
            y--;
            break;

        case DIRECTION_SOUTH:
            y++;
            break;

        case DIRECTION_WEST:
            x--;
            break;
    }

    if(world.canPlayerMoveAt(x, y) == true)
    {
        if(x >= 20 && x < 40)   // 0...19 20...39 40...59
        {
            world.scroll(direction);
        }

        this.x = x;
        this.y = y;
    }

};