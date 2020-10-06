<script>
    /**
     * Created by Steven on 2016-10-25.
     */
    var oTxt = document.getElementById('txt');
    var oBtn = document.getElementById('btn');
    var oList = document.getElementById('list');
 
    var fruits = ["Romano, Simone and Fucci, Davide and Baldassarre"+
                "Maria Teresa and Caivano, Danilo and Scanniello, Giuseppe"+"苹果","梨子","香蕉","香瓜","葡萄","柠檬","橘子","草莓","草莓子","草拟吗","s","ssr"];
    //点击事件
    oBtn.addEventListener('click', function(){
        var keyWord = oTxt.value;
        // var fruitList = searchByIndexOf(keyWord,fruits);
        console.log(fruitList);
        var fruitList = searchByRegExp(keyWord, fruits);
        renderFruits(fruitList);
    }, false);
    //回车查询
    oTxt.addEventListener('keydown', function(e){
        if(e.keyCode == 13){
            var keyWord = oTxt.value;
            // var fruitList = searchByIndexOf(keyWord,fruits);
            var fruitList = searchByRegExp(keyWord, fruits);
            renderFruits(fruitList);
        }
    }, false);
    var cpLock = false;
    $('#txt').on('compositionstart', function () {
        cpLock = true;
        console.log("不搜索")
    });
    $('#txt').on('compositionend', function () {
        cpLock = false;
        console.log("汉字搜索");
        var keyWord = oTxt.value;
        // var fruitList = searchByIndexOf(keyWord,fruits);
        var fruitList = searchByRegExp(keyWord, fruits);
        renderFruits(fruitList);
    });
    $('#txt').on('input', function () {
        if (!cpLock) {
            console.log("字母搜索")
            var keyWord = oTxt.value;
            // var fruitList = searchByIndexOf(keyWord,fruits);
            var fruitList = searchByRegExp(keyWord, fruits);
            renderFruits(fruitList);
        }
    });
    function renderFruits(list){
        if(!(list instanceof Array)){
            return ;
        }
        oList.innerHTML = '';
        var len = list.length;
        var item = null;
        for(var i=0;i<len;i++){
            item = document.createElement('li');
            item.innerHTML = list[i];
            oList.appendChild(item);
        }
    }
    //模糊匹配的时候如果不区分大小写，可以使用toLowerCase()或者toUpperCase()转换之后去匹配。
 
    //模糊查询1:利用字符串的indexOf方法
    function searchByIndexOf(keyWord, list){
        if(!(list instanceof Array)){
            return ;
        }
        var len = list.length;
        var arr = [];
        for(var i=0;i<len;i++){
            //如果字符串中不包含目标字符会返回-1
            if(list[i].indexOf(keyWord)>=0){
                arr.push(list[i]);
            }
        }
        return arr;
    }
    //正则匹配
    function searchByRegExp(keyWord, list){
        if(!(list instanceof Array)){
            return ;
        }
        var len = list.length;
        var arr = [];
        var reg = new RegExp(keyWord);
        for(var i=0;i<len;i++){
            //如果字符串中不包含目标字符会返回-1
            if(list[i].match(reg)){
                arr.push(list[i]);
            }
        }
        return arr;
    }
    renderFruits(fruits);
</script>
