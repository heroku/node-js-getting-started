define('searchBar', ['messageBus'], function(){

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

            if( _this._submitCallback ){
                _this._submitCallback(e, value);
            }

        });

    };

    SearchBar.prototype.onSubmit = function(callback){
        this._submitCallback = callback;
    };

    return SearchBar;

});