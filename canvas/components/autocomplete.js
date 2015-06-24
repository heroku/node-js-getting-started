define('autocomplete', ["components/services"], function(Services){

    var _services = new Services();

    var Autocomplete = function(el){

        var _this = this;

        this.el = el;
        this.$el = $(this.el);

        this.$el.typeahead({
            minLength:3,
            items: 5,
            highlighter: function(item){
                var html = "";

                html += "<span class='typeahead-item'>";
                html += "<span class='typeahead-picture'>";
                html += "<img src='"+item.face.picture+"' alt='' />";
                html += "</span>";
                html += "<span class='typeahead-label-wrapper'>";
                html += "<span class='typeahead-label'>"+item.toString()+"";
                html += "</span>";
                html += "<br />";
                html += "<span class='typeahead-number'>Face number : "+item.face.number+"</span>";
                html += "</span>";
                html += "</span>";

                return html;
            },
            afterSelect: function(){
                _this.$el.closest('form').submit();
            },
            source: function(value, process){

                console.log("autocomplete", "source", arguments);
                return _services.searchFaces(value, function(data, query){
                    var list = [];

                    _.each(data, function(face){
                        var str = new String(face.accountname);
                        str.face = face;
                       list.push(str);
                    });
                    return process(list);
                });
            }
        });
    };

    return Autocomplete;
});