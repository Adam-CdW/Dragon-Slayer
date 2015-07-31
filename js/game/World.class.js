var World = function()
{
    this.offsetX = 0;
    this.offsetY = 0;

};

World.prototype.canPlayerMoveAt = function (x,y)
{
    var tile;

    // Est-ce que les coordonnées spécifiées sont en dehors de la carte du monde ?
    if((x < 0 || x >= WORLD_WIDTH) || (y < 0 || y >= WORLD_HEIGHT))
    {
        return false;
    }

    // Récupération du carreau se trouvant aux coordonnées absolues spécifiées.
    tile = dataWorld[y][x];

    // Renvoie vrai si on a le droit de se déplacer sur ce carreau.
    return dataTiles[tile].walkable;
};

World.prototype.getTileAt = function(x,y)
{
    return dataWorld[y+this.offsetY][x+this.offsetX];
};

World.prototype.scroll = function(direction)
{
    switch(direction)
    {
        case DIRECTION_EAST:
            if(this.offsetX < 20)
            {
                this.offsetX++;
            }
            break;

        case DIRECTION_WEST:
            if(this.offsetX > 0)
            {
                this.offsetX--;
            }
            break;
    }
};