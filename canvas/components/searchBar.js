define('searchBar', ['messageBus', "components/services", 'pagination'], function(messageBus, Services, Pagination){

    var _services = new Services();
    var _lastValue = "";

    /**
     *
     * @param options
     * @constructor
     */
    var SearchBar = function(options){

        var _this = this;

        this.pagination = new Pagination("#search-field-pagination");
        this.$field = $('#search-field');
        this.$form = $('#form-search');

        this.$form.on('submit', function(e){
            var value = _this.$field.val();

            console.log(value);

            if( _lastValue === value ){
                _this.pagination.next() ;
                return;
            }

            e.preventDefault();

            if(options.blurAfterSubmit === true){
                _this.$field.blur();
            }

            _this.submit(e, value);

            if( _this._submitCallback ){
                _this._submitCallback(e, value);
            }

            _lastValue = value;

        });

    };

    /**
     *
     * @param e
     * @param value
     */
    SearchBar.prototype.submit = function(e, value){
        var _this = this;

        if( value*1 >= 0){
            messageBus.emit('map:gotoFaceNumber', {number: value*1, directly: false});
            _this.pagination.reset();
        }else if(value.length > 2){
            _services.searchFaces(value, function(data,query){
                _this.pagination.setData(data);
                console.log('SEARCH RESULTS', data);
            });
        }
    };

    /**
     *
     * @param callback
     */
    SearchBar.prototype.onSubmit = function(callback){
        this._submitCallback = callback;
    };

    return SearchBar;

});