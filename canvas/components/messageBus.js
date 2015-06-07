define('messageBus', function(){

    var messageBus = {};

    PIXI.EventTarget.call(messageBus);

    return messageBus;
});