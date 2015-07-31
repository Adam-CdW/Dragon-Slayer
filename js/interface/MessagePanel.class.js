var MessagePanel = function()
{
    // CONSTRUCTEUR
    this.$messagePanel = $('#js-interface-message-panel').children('ul');
    //Recherche de l'objet jquery représentant l'ul contenu dans le aside "Message panel"

    // EVENT LISTENERS
    $(document).on("message:add",this.onMessageAdd.bind(this));
    $(document).on("message:clear",this.onMessageClear.bind(this));

};

MessagePanel.prototype.onMessageAdd = function(event, message, category)
{
    var messageItem;

    // Création avec jQuery d'une balise <li> avec le message spécifié en contenu.
    messageItem = $('<li>').hide().addClass("message-" + category).text(message);

    // Ajout de la balise <li> à la fin du panneau de messages.
    this.$messagePanel.append(messageItem);

    // Affichage de la balise <li>.
    messageItem.fadeIn( "slow" );

    // Est-ce qu'il y a encore de la place pour afficher le nouveau message ?
    if(this.$messagePanel.height() > 520)
    {
        /*
         * Non, suppression des 2 messages les plus anciens (ceux tout en haut).
         *
         * Cela permet d'éviter d'avoir une barre de scrolling vertical.
         */
        this.$messagePanel.children().first().remove();
        this.$messagePanel.children().first().remove();
    }
};

MessagePanel.prototype.onMessageClear = function()
{
    // Effacement du contenu du panneau de messages.
    this.$messagePanel.empty();
};