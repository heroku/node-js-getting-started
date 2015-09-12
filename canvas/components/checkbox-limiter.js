define('components/checkbox-limiter', ['components/animator'], function(animator){

	// import jQuery
	var $ = jQuery;

	// private vars
	var _limit, _checkboxes, _selector;

	var CheckboxLimiter = function(selector){	
		if( typeof $ === undefined){
			throw("jQuery is not defined");
		}

		_limit = 3;

		this.update(selector);
	};

	CheckboxLimiter.prototype.setLimit = function(limit){
		if( typeof limit === "number" && limit >= 0){
			_limit = limit;

		}else{
			throw("limit is not an unsigned number");
		}
	};

	CheckboxLimiter.prototype.checkLimit = function(event){
		var n = 0;
		var id = $(event.currentTarget).attr('id');

		_checkboxes.each(function(index, checkbox){
			if( $(checkbox).is(':checked')){
				n+=1;
			}
		});
		
		if( n > _limit && event){			
			animator.play($(event.currentTarget).prop("checked", false).siblings('label[for='+id+']'), 'wizz');
		}else if( !event ){
			return n >= _limit;
		}
		
	};

	CheckboxLimiter.prototype.update = function(selector){
		var _this = this;
		if( typeof selector !== "string"){
			throw("selector is not a string");
		}else{
			_selector = selector;
		}

		if( _checkboxes && _checkboxes.length ){
			_checkboxes.off('change.CheckboxLimiter');
		}

		_checkboxes = $(_selector);

		_checkboxes.on('change.CheckboxLimiter', function(event){
			if( $(event.currentTarget).is(":checked")){
				_this.checkLimit(event);	
			}
		});
	};

	return CheckboxLimiter;
});