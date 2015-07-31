var Dragon = function(type, difficulty)
{
    this.image = dataDragons[type].image;
    this.attackLevel= dataDragons[type].attack;
    this.defenseLevel= dataDragons[type].defense;
    this.agility = dataDragons[type].agility;
    this.strength = dataDragons[type].strength;
    this.type = type;

    switch (difficulty)
    {
        case LEVEL_EASY:
            this.hp = getRandomInteger(this.strength*15,this.strength*20);
            break;
        case LEVEL_NORMAL:
            this.hp = getRandomInteger(this.strength*20,this.strength*25);
            break;
        case LEVEL_HARD:
            this.hp = getRandomInteger(this.strength*22,this.strength*30);
            break;
    }
};

Dragon.prototype.isDead = function()
{
    // METHODE isDead, la comparaison cidessous génère automatiquement un booléen et dc cette méthode return true si le Dragon est mort
    return this.hp <= 0;
};

Dragon.prototype.takeHp = function (damagePoints)
{
    this.hp -= damagePoints;
    $.event.trigger("message:add", [ '- Attaque réussi ! Tu infliges ' + damagePoints + ' dégats au dragon.', 'good' ]);
};

Dragon.prototype.giveHp = function (healthPoints)
{
    this.hp += healthPoints
};

Dragon.prototype.attack = function(player)
{
    var damagePoints;

    if (player.tryHit(this.agility) == false)
    {
        $.event.trigger("message:add", [ "- Bravo, tu évites l'attaque du dragon !", 'good' ]);
        // message panel coup évité
        return;
    }
    damagePoints = getRandomInteger(10,20);

    damagePoints -= player.getDefenseLevel();

    damagePoints += this.getAttackLevel();

    damagePoints = Math.floor(damagePoints);

    if (damagePoints < 0)
    {
        damagePoints = 0;
    }

    player.takeHp(damagePoints);
};

Dragon.prototype.getAttackLevel = function()
{
    return rollDice()*this.attackLevel+this.strength;
};

Dragon.prototype.getDefenseLevel = function()
{
    return getRandomInteger(1,4)+this.defenseLevel+this.agility;
};

Dragon.prototype.tryHit = function(playerAgility)
{
    return getRandomInteger(1, playerAgility) > getRandomInteger(1, this.agility);
};