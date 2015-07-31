var Menu = function()
{
    // CONSTRUCTEUR
    this.$menu = $('#js-interface-menu');
    //Recherche de l'objet jquery représentant le menu de démarrage du jeu ; this.$ est très utilisé dans les framework type angular ou Jquery pour montrer que l'objet DOM en question est la balise html (ici le formulaire menu) qui correspond à la classe (ici Menu)

    this.remainingPoints = 3;
    // Variable qui représente les points de carac restant à répartir.

    this.$menu.find('.meter-control').on('click', this.onClickMeterButton.bind(this));
    // On recherche à l'intérieur du formulaire le selector ".meter-control", à l'aide de la méthode Jquery find()

    this.$menu.find('.start').on('click', this.onClickStartButton.bind(this));
    // On installe un gestionnaire d'event sur le bouton start

    this.drawCavern();

};

Menu.prototype.onClickMeterButton = function(event)
{
    // Méthode appelée lors du click sur les boutons + et -
    var button;
    var meter;

    button = $(event.currentTarget); // On utilise le event.target (qui dans ce cas est une alternative à $(this)) car on a bindé le this à la class, on veut que this représente toujours la classe dans laquelle nous sommes

    meter = document.getElementById(button.data("meter"));

    if (button.data("action") == "decrease")
    {
        if (meter.value > meter.min)
        {
            meter.value --;
            this.remainingPoints ++;
            this.drawCavern();
        }

    }
    else
    {
        if(this.remainingPoints > 0 && meter.value < meter.max)
        {
            meter.value ++;
            this.remainingPoints --;
            this.drawCavern();
        }

    }

    event.preventDefault();
    //console.log(event);
};

Menu.prototype.drawCavern = function()
{
    this.$menu.find(".remaining-points").text(this.remainingPoints);
    this.$menu.find(".strength-value").text($("#strength").val());
    this.$menu.find(".agility-value").text($("#agility").val());
};

Menu.prototype.onClickStartButton = function(event)
{
    $.event.trigger("game:start");
    // Propriété de Jquery qui permet de déclencher des event

    event.preventDefault();
    //console.log(event);
};

Menu.prototype.getOptions = function()
{
    return {
        agility : $('#agility').val(),
        difficulty : $('[name="difficulty"]:checked').val(),
        nickName : $("[name='nickName']").val(),
        strength : $('#strength').val()
    }
};
