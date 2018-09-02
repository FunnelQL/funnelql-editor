var $FQL = {};
$FQL.init = function() {};
$FQL.parse = function() {};
$FQL.query = function() {};
$FQL.on = function() {};
$FQL.once = function() {};
$FQL.off = function() {};
$FQL.tag = function() {};
$FQL.debug = function() {};

var QUERY_REGEX_INDEX = {
    "base": [],
    "path": [],
    "sequence": [],
    "compare": [],
    "fn_args": [],
    "count": [],
    "since": []
};

var TOKEN_REGEX = {
    "whitespace": '',
    "tag": '',
    "and": '',
    "or": '',
    "regex": '',
    "current_url": '',
    "url": '',
    "path": '',
    "sequence": '',
    "fn": '',
    "compare": '',
    "path_depth": '',
    "path_next": '',
    "count": '',
    "sub": '',
    "operator": '',
    "num": '',
    "str": '',
    "comma": '',
    "fn_args_bool": '',

    // date / time
    "since": '',
    "date_range": '',
    "date": '',
    "timenum": ''
};

window.$FQL = $FQL;

window['funnelql-worker'] = '';

/* EDITOR */
window.FunnelQLEditor = '';
var EDITOR = {};
EDITOR.parse = function() {};
EDITOR.getCursor = function() {};
EDITOR.getLine = function() {};
EDITOR.replaceSelection = function() {};
EDITOR.focus = function() {};
EDITOR.setCursor = function() {};

var setAttrs = {
    class: '',
    role: ''
};