
var µ = (function (w) {

    var self = {}, route = [], container, navigated, scripTmpl = [], hashActive = '', l = w.location, timehash;

    self.conf = function (c, n) {
        container = c;
        navigated = n;
    };

    //util context / render template
    self.send = function (callback) {
        var ctex = this;

        ctex.route = (typeof callback === 'string') ? callback : ctex.route;

        if (ctex.route) {
            self.tmpl(ctex.route, ctex, callback);
        }
    };

    self.db = function (name, val) {

        if (val === undefined) {
            return JSON.parse(window.localStorage.getItem(name));
        }
        window.localStorage.setItem(name, JSON.stringify(val));
    };

    self.redirect = function (hash) {

        if (l.hash === '#' + hash) {
            hashActive = '';
            hashChange();
        } else
            l.hash = '#' + hash;
    };

    //Ajax
    self.ajax = function (action, params, callback, iscache) {

        var ctex = this;
        params = params || {};
        iscache = iscache || false;
		
        var optionAjax = {
                            'type': "GET",
                            'url': action,
                            'data': params,
                            'dataType': "json",
                            'success': function (rdata) {
                                var data = RJSON ? RJSON.unpack(rdata) : rdata;

                                if (!data || data.hasOwnProperty('list') === false) {
                                    data = {'list': []};
                                }

                                callback.call(ctex, data);
                            }
                        };
                        
        if(iscache === true && params.hasOwnProperty('HTTP_AUTHORIZATION') === false){
            optionAjax.localCache = true;
            optionAjax.cacheTTL = 1;
            optionAjax.isCacheValid = function () { return true; };
        }
        
        return $.ajax(optionAjax);

    };

    //render template
    self.tmpl = function (name, data, callback) {

        var body = container;

        data = data || {};

        if (scripTmpl.hasOwnProperty(name)) {

            var tmploade;

            if (data.length < 1) {

                tmploade = scripTmpl[name];

            } else {

                var text_html = scripTmpl[name];

                tmploade = _.template(text_html, data);
            }

            body.innerHTML = tmploade;

            window.scrollTo(0, 0);

            if (typeof callback === 'function')
                callback(text_html);

            if (typeof navigated === 'function')
                navigated();

            //console.timeEnd(name);

            return true;

        } else {

            console.log('tmpl => 404', name);
        }

        return false;
    };

    //add route
    self.add = function (hash, call) {

        if (typeof hash === 'undefined' && typeof call === 'undefined'){
            return self;
		}
		
        if (typeof (hash) === 'object') {
            for (var i in hash) {
                self.add(i, hash[i]);
            }
        }

        if (typeof call !== 'function'){
            call = function () {
                self.send.call({'route': hash});
            };
		}

        route.push({'h': hash, 'regx': new RegExp(hash), 'callback': call});

        return self.add;
    };

    //init
    self.run = function (callback) {

        //load script/template
        try {
            var scriptTemp = document.getElementsByTagName('script');
            for (var s in scriptTemp) {
                if (scriptTemp[s].getAttribute && scriptTemp[s].getAttribute('type') == 'text/template') {
                    scripTmpl[scriptTemp[s].id] = scriptTemp[s].innerHTML;
                }
            }
        } catch (err) {
            console.log('erro load Script');
            callback(false);
            return false;
        }

        //set change event
        try {
            if (typeof jQuery !== "undefined")
                $(w).hashchange(hashChange);
            else if (w.onhashchange)
                w.onhashchange = hashChange;
            else if (w.addEventListener) {
                w.addEventListener('hashchange', hashChange, false);
            } else {
                w.attachEvent('onhashchange', hashChange);
            }
        } catch (err) {
            timehash = setInterval(hashChange, 800);
        }

        try {
            if (location.hash !== '')
                hashChange();
            else
                location.hash = 'index'; //home set index
        } catch (err) {
            timehash = setInterval(hashChange, 800);
            callback(false);
            return false;
        }

        callback(true);
    };

    function hashChange(e) {

        if (typeof e !== 'undefined' && e.preventDefault)
            e.preventDefault(), e.stopPropagation();

        var params = [p()];
        var error = true;
        var u = l.hash.split("?")[0].split("#")[1] === "" ? "index" : l.hash.split("?")[0].split("#")[1];

        var uhashCode = (typeof u !== 'undefined') ? l.hash.toString().hashCode() : '9999999';

        for (var i in route) {

            if (hashActive === uhashCode) {
                break;
            }

            if (u === route[i].h || (route[i].regx.test(u) && u.toString().match(route[i].regx).length > 1)) {

                if (u.toString().match(route[i].regx).length) {
                    var padd = u.toString().match(route[i].regx);
                    padd.shift('index: 0');
                    params = params.concat(padd);
                }

                var _self = {};

                _self.db = self.db;
                _self.send = self.send;
                _self.redirect = self.redirect;
                _self.route = route[i].h;
                _self.ajax = self.ajax;

                hashActive = uhashCode;

                try {
                    //console.time(_self.route);
                    route[i].callback.call(_self, params);
                } catch (e) {
                    console.log('erro', _self.route, e);
                } error = false;
				
                break;
            }
        }

        if (error === true) {
            // self.tmpl('erro', {msg:'Não encontrada'});
        }
    }

    function p() {
        var u = l.hash;
        var parms = {}, pieces, parts, i;
        var hash = u.lastIndexOf("#");
        if (hash !== -1) {
            u = u.slice(hash + 1);
        }
        var question = u.indexOf("?");
        if (question !== -1) {
            u = u.slice(question + 1);
            pieces = u.split("&");
            for (i = 0; i < pieces.length; i++) {
                parts = pieces[i].split("=");
                if (parts.length < 2) {
                    parts.push("");
                }
                parms[decodeURIComponent(parts[0])] = decodeURIComponent(parts[1]);
            }
        }
        return parms;
    }

    return self.add;

}(window));window['µ'] = µ;

//hashCode
String.prototype.hashCode=function(){var b=0,d,a,c;if(this.length==0){return b}for(d=0,c=this.length;d<c;d++){a=this.charCodeAt(d);b=((b<<5)-b)+a;b|=0}return b};

//Cache AJAX - github.com/paulirish/jquery-ajax-localstorage-cache
if (typeof jQuery !== "undefined")
$.ajaxPrefilter(function(b,h,d){function c(){var i="modernizr";try{localStorage.setItem(i,i);localStorage.removeItem(i);return true}catch(j){return false}}if(!c()||!b.localCache){return}var g=b.cacheTTL||5;var f=b.cacheKey||b.url.replace(/jQuery.*/,"")+b.type+(b.data||"");if(b.isCacheValid&&!b.isCacheValid()){localStorage.removeItem(f)}var a=localStorage.getItem(f+"cachettl");if(a&&a<+new Date()){localStorage.removeItem(f);localStorage.removeItem(f+"cachettl");a="expired"}var e=localStorage.getItem(f);if(e){if(b.dataType.toLowerCase().indexOf("json")===0){e=JSON.parse(e)}b.success(e);d.abort()}else{if(b.success){b.realsuccess=b.success}b.success=function(j){var i=j;if(this.dataType.toLowerCase().indexOf("json")===0){i=JSON.stringify(j)}try{localStorage.setItem(f,i)}catch(k){localStorage.removeItem(f);localStorage.removeItem(f+"cachettl");if(b.cacheError){b.cacheError(k,f,i)}}if(b.realsuccess){b.realsuccess(j)}};if(!a||a==="expired"){localStorage.setItem(f+"cachettl",+new Date()+1000*60*60*g)}}});


/*
 *  container, a referencia do body
 *  navigated, assim que atualiza body, executar
 *  cache , ativa o cache em AJAX TRUE [jQuery (>1.5.1) && localStorage]

 µ().conf(document.getElementById('container-tpl'), navigated, true);
    
 µ('index', function(p){ console.log(p); alert('lol'); });
 
 µ({
 'teste':function(){ alert('teste'); }
 });
 
 µ('teste\/([a-z]{3})/([a-z]{3})/([a-z]{3})', function(data){ console.log(data); alert('lol'); });
 
 µ('teste\/([a-z]{3})', function(data){ console.log(data); alert('lol'); });

 µ().run(function(isrun){
    if(isrun === false){
        alert('Não foi possivel abrir o aplicativo.');
    };
 });

 */