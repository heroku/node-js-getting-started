define('pages/modalView',
[
	'components/services',
	'constantes',
	'messageBus'
],
function(
	Services,
	constantes,
	messageBus
){


	var _services = new Services();
	var _lastColorUsed;

	var modalView = function(){
		this.template = _.template($("#template-modal-view").html());

		this.$el = $(".modal-view");
		this.$close = this.$el.find(".close");
		this.$title = this.$el.find('.modal-title');
		this.$content = this.$el.find('.modal-body');

		messageBus.on('all:colorChange', _.bind(this.setColor, this));
	};

	modalView.prototype.setColor = function(event){
			if( typeof event.data.color === "number"){
				event.data.color = ""+event.data.color;
			}
			
			if( event.data.color.indexOf("0x") === -1 && _lastColorUsed ){
				event.data.color = _lastColorUsed;
			}else if( event.data.color.indexOf("0x") === -1 ){
				event.data.color = "0x"+(event.data.color.toString(16));
			}

			this.$title.css('color', event.data.color.replace("0x", "#"));
			this.$close.css('color', event.data.color.replace("0x", "#"));

	};

	modalView.prototype.show = function(number){
		var _this = this;
		var data = {};

		if( number >= 0 ){

			_services.searchFaces(number, function(data){
				if( data.length > 0 ){
					_this.render(data[0]);
					_this.$el.modal('show');
				}
			});

		}else{
			return;
		}
	};

	modalView.prototype.render = function(data){
		var langs, occupations;

		try {
			occupations = $.parseJSON(data.occupations);	
		}catch(e){
			occupations = [];
		}
		
		try {
			langs = data.lang.split(',');	
		}catch(e){
			langs = [];
		}
		

		this.$title.html(data.accountname);
		this.$content.html(this.template({data:data, langs: langs, occupations: occupations, icons: constantes.icons}));
		setTimeout(function(){
			if( window.FB ){
				FB.XFBML.parse();	
			}	

			if( window.twttr ){
				twttr.widgets.load();	
			}
		}, 100);
	};

	return new modalView();
});
