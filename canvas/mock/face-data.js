define('mock/faces', ['messageBus'], function(messageBus){

    var MockFaces = function(){
        // http://placekitten.com/200/300
        this.source = "http://placekitten.com/";
    };

    /**
     *
     * @param range
     */
    MockFaces.prototype.getFacesByRange = function(range){
        var data = [], face = {};
        messageBus.emit('main:hideLoader');

        for(var i = 0, l = range.length; i<l; i++){
            face = new Face(range[i], this.source);
            data.push(face);
        }

        return data;
    };

    var Face = function(n, sourceImage){

        this.__v = 0;
        this._id = "5598f491565a36"+Math.round(Math.random()*(1000*1000));
        this.accountname = "Sylvain Savajols";
        this.claim = !!Math.round(Math.random());
        this.faceColor = 0x000000;
        this.firstname = "XelCreation";
        this.lang = this.getLang();
        this.occupations = this.getOccupation();
        this.lastname = "XelCreation";
        this.network = "twitter";
        this.network_id = ""+Math.round(Math.random()*1000000);
        this.non_human = false;
        this.number = n;
        this.picture = sourceImage+Math.round(150+Math.random()*20)+"/"+Math.round(150+Math.random()*20);

    };

    Face.prototype.getOccupation = function(){
        var occupations = ['GEEK', 'ATHLETE', 'HYPE', 'WORKER', 'EXPLORER', 'PARENT', 'SCIENTIST', 'STUDENT', 'STUDENT', 'ARTIST'];
        var values = [];

        for(var i = 0, l = 2; i<l; i++){
            if( Math.round(Math.random()) ){
                values.push(occupations[Math.round(Math.random()*(occupations.length-1))]);
            }
        }

        return JSON.stringify(values);
    };

    Face.prototype.getLang = function(){
        var langs = ['FR', 'EN', 'RU', 'ES', 'JP'];
        var values = [];

        for(var i = 0, l = 2; i<l; i++){
            if( Math.round(Math.random()) ){
                values.push(langs[Math.round(Math.random()*(langs.length-1))]);
            }
        }

        return values.toString();
    };

    return new MockFaces();
});