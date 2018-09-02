/* FUNNELQL EDITOR */
window.FunnelQLEditor = '';
/*var EDITOR = {};
EDITOR.parse = function() {};
EDITOR.getCursor = function() {};
EDITOR.getLine = function() {};
EDITOR.replaceSelection = function() {};
EDITOR.focus = function() {};
EDITOR.setCursor = function() {};*/
var FUNNELQL_EDITOR_DEFAULT_CODEMIRROR_OPTIONS = {
    mode: 'funnelql', //'regex',
    indentWithTabs: true,
    smartIndent: true,
    matchBrackets: true,
    autoCloseBrackets: true,
    autofocus: true,
    lineWrapping: true,
    lineNumbers: true,
    gutters: ["CodeMirror-lint-markers"],
    lint: {
        async: true,
        lintOnChange: true
    },
    extraKeys: {
        "Ctrl-Space": "autocomplete"
    },
    hintOptions: {
        tables: {
            users: ["name", "score", "birthDate"],
            countries: ["name", "population", "size"]
        }
    }
};

var setAttrs = {
    class: '',
    role: '',
    'data-editor': '',
    'data-off': '',
    'data-on': ''
};