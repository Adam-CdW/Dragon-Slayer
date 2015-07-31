function getRandomInteger(min, max)
{
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

function rollDice()
{
    return getRandomInteger(1, 6);
}