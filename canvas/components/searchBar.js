define('searchBar', ['messageBus', "components/services"], function(messageBus, Services){

    var _services = new Services();

    var SearchBar = function(options){

        var _this = this;

        this.$field = $('#search-field');
        this.$form = $('#form-search');

        this.$form.on('submit', function(e){
            var value = _this.$field.val();;

            e.preventDefault();

            if(options.blurAfterSubmit === true){
                _this.$field.blur();
            }

            _this.submit(e, value);

            if( _this._submitCallback ){
                _this._submitCallback(e, value);
            }

        });

    };

    SearchBar.prototype.submit = function(e, value){
        if( value*1 >= 0){
            messageBus.emit('map:gotoFaceNumber', {number: value*1, directly: false});
        }else if(value.length > 2){
            _services.searchFaces(value, function(data,query){
                console.log('SEARCH RESULTS', data);
            });
        }
    };


    SearchBar.prototype.onSubmit = function(callback){
        this._submitCallback = callback;
    };

    return SearchBar;

});