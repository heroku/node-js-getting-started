define('pagination', function(){

    /**
     *
     * @param data
     * @constructor
     */
    var Pagination = function(el){

        var _this = this;

        this.$el = $(el);
        this.$label = this.$el.find('.pagination-label');
        this.$buttonPrev = this.$el.find('.pagination-button-prev');
        this.$buttonNext = this.$el.find('.pagination-button-next');
        this.data = [];
        this.current = 0;
        this.length = 0;
        this.setData();

        this.$buttonPrev.on('click', function(){ _this.previous();});
        this.$buttonNext.on('click', function(){ _this.next();});
    };

    /**
     *
     * @param data
     */
    Pagination.prototype.setData = function(data){

        this.data = data || [];
        this.length = this.data.length;
        this.current = 0;
        this.el = {};
        this.updatePaginationButtons();
        return this.update();
    };

    /**
     *
     */
    Pagination.prototype.next = function(){
        this.setNextIndex();
        return this.update();
    };

    /**
     *
     */
    Pagination.prototype.previous = function(){
        this.setPrevIndex();
        return this.update();
    };

    /**
     *
     * @returns {{}|*}
     */
    Pagination.prototype.getCurrent = function(){
        return this.el;
    };

    /**
     *
     * @returns {{}|*}
     */
    Pagination.prototype.update = function(){
        this.el = this.data[this.current];
        return this.el;
    };

    /**
     *
     * @returns {number|*}
     */
    Pagination.prototype.setPrevIndex = function(){
        this.current--;

        if( this.current < 0 ){
            this.current = this.length;
        }
        return this.current;
    };

    /**
     *
     * @returns {number|*}
     */
    Pagination.prototype.setNextIndex = function(){
        this.current++;
        if( this.current >= this.length ){
            this.current = 0;
        }
        return this.current;
    };

    /**
     *
     */
    Pagination.prototype.updatePaginationButtons = function(){
        this.setPaginationLabel(this.current);

        if( this.length > 1){
            this.showPaginationButtons();
        }else{
            this.hidePaginationButtons();
        }
    };

    /**
     *
     * @param label
     */
    Pagination.prototype.setPaginationLabel = function(label){
        this.$label.text(this.current+"/"+this.length);
    };

    /**
     *
     */
    Pagination.prototype.showPaginationButtons = function(){
        this.$buttonPrev.addClass('is-active');
        this.$buttonNext.addClass('is-active');
    };

    /**
     *
     */
    Pagination.prototype.hidePaginationButtons = function(){
        this.$buttonPrev.removeClass('is-active');
        this.$buttonNext.removeClass('is-active');
    };


    return Pagination;

});