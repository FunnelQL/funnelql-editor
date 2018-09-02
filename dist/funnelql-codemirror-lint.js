!function(g){"use strict";g.defineMode("funnelql-core",function(a,t){function e(t){for(var e={},n=t.split(" "),r=0;r<n.length;++r)e[n[r]]=!0;return e}var o=e("false true null unknown"),c={},s=e("regex fn path count url since page"),u=/^[*+\-%<>!=&|^]/,l=(t.support,!1!==t.backslashStringEscapes),h=t.punctuation||/^[;.,:]/;function f(t,e){var n=t.peek(),r=47<n.charCodeAt(0)&&n.charCodeAt(0)<58;if(r&&t.match(/^\d*(\.[0-9]+)?(y|M|w|d|h|m|s)/))return"timenumber";if(r&&t.match(/^[0-9]{4}-\d{2}-\d{2}T\d{2}:\d{2}/))return"date";if(r)return t.match(/^[0-9]*(\.[0-9]+)?([eE][-+]?[0-9]+)?/),"number";if("'"==n||'"'==n)return e.tokenize=(a=n,function(t,e){for(var n,r=!1;null!=(n=t.next());){if(n==a&&!r){e.tokenize=f;break}r=l&&!r&&"\\"==n}return"string"}),t.next(),e.tokenize(t,e);if("#"==n)return t.skipToEnd(),t.next(),"comment";if("."==n)return t.next(),null;if(u.test(n))return t.eatWhile(u),"operator";if(/^[\(\)]/.test(n))return t.eatWhile(/^[\(\)]/),"bracket";if(h.test(n))return t.eatWhile(h),"punctuation";t.eatWhile(/^[_\w\d]/);var a,i=t.current().toLowerCase();return"regex"!==i?"location"===i?"location":o.hasOwnProperty(i)?"atom":c.hasOwnProperty(i)?"builtin":s.hasOwnProperty(i)?"keyword":"error":t.match(/^\s*\(\s*(\/([^\/]|\\\/)*\/[a-z]*)\s*\)/,!1)?(t.eatWhile(/^[\s\(]/),"regex"):null}function i(t,e,n){e.context={prev:e.context,indent:t.indentation(),col:t.column(),type:n}}return{startState:function(){return{tokenize:f,context:null}},token:function(t,e){if(t.sol()&&e.context&&null==e.context.align&&(e.context.align=!1),e.tokenize==f&&t.eatSpace())return null;var n=e.tokenize(t,e);if("comment"==n)return n;e.context&&null==e.context.align&&(e.context.align=!0);var r,a=t.current();return"("==a?i(t,e,")"):"["==a?i(t,e,"]"):e.context&&e.context.type==a&&((r=e).indent=r.context.indent,r.context=r.context.prev),n},indent:function(t,e){var n=t.context;if(!n)return g.Pass;var r=e.charAt(0)==n.type;return n.align?n.col+(r?0:1):n.indent+(r?0:a.indentUnit)},lineComment:"#",closeBrackets:"()[]{}''\"\"``"}}),g.defineMode("funnelql",function(t,e){var n,r=g.getMode(t,{name:"funnelql-core",fqlMode:!0}),a=g.getMode(t,"regex");function i(t,e){var n=r.token(t,e.fqlState);return"regex"==n&&(e.token=o,e.localState=a.startState(r.indent(e.fqlState,"")),e.mode="regex"),n}function o(t,e){return t.match(/^\/[a-z]*\s*\)/i,!1)&&(n=!0),n&&t.match(/^\)/i,!1)?(n=!1,e.token=i,e.localState=null,e.mode="funnelql-core",i(t,e)):a.token(t,e.localState)}return{startState:function(){var t=r.startState();return t.modes=[],t.tokens=[],t.states=[],{token:i,localState:null,mode:"funnelql",fqlState:t}},copyState:function(t){if(t.localState)var e=g.copyState(t.token==o?a:r,t.localState);return{token:t.token,localState:e,mode:t.mode,fqlState:g.copyState(r,t.fqlState)}},token:function(t,e){return e.token(t,e)},compareStates:function(t,e){return t.mode==e.mode&&(t.localState?g.Pass:r.compareStates(t.fqlState,e.fqlState))},electricChars:"/{}:"}},"funnelql-core","regex"),g.defineMode("regex",function(){function t(){}return t.prototype.tokenize=function(t){var e;return this.state||(this.state=this._start),"\\"===(e=t.next())?(t.next(),"quote-regex"):this.state(t,e)},t.prototype._comment=function(){return"comment-regex"},t.prototype._plain=function(t,e){switch(e){case"/":return this.state=this._options,"qualifier-regex";case"[":return this.entering=!0,this.ccDepth=0,this.state=this._characterClass,"meta-regex";case"(":return this.entering=!0,this.state=this._group,"bracket-regex";case")":return"bracket-regex";case"{":return t.skipTo("}")&&t.next(),"tag-regex";case".":case"*":case"?":case"|":return"operator-regex";case"^":case"$":return"atom-regex"}},t.prototype._start=function(t,e){return this.state=this._plain,"/"===e?"qualifier-regex":this._plain(t,e)},t.prototype._characterClass=function(t,e){var n;switch(n=this.entering,this.entering=!1,e){case"[":return this.ccDepth++,this.entering=!0,"meta-regex";case"]":return 0==this.ccDepth--&&(this.state=this._plain),"meta-regex";case"-":return"qualifier-regex";default:return n&&"^"===e?"operator-regex":"string-regex"}},t.prototype._group=function(t,e){var n;return n=this.entering,this.entering=!1,this.state=this._plain,n&&"?"===e?(this.state=this._name,"tag-regex"):this._plain()},t.prototype._name=function(t,e){return this.state=this._group,"<"===e||"'"===e?(t.skipTo("<"===e?">":"'"),t.next(),"tag-regex"):this._group(t,e)},t.prototype._options=function(t){return t.skipTo(")"),"attribute-regex"},{startState:function(){return new t},token:function(t,e){return e.tokenize(t)}}})}(CodeMirror),function(a){"use strict";a.registerHelper("lint","funnelql",function(t,r,e){$FQL.parse(t).then(function(t){r([])}).catch(function(t){if(void 0!==t.startLine)var e={from:a.Pos(t.startLine,t.startCol),to:a.Pos(t.endLine,t.endCol),message:t.message,severity:"error"};else e={from:a.Pos(0,0),to:a.Pos(0,0),message:t.message,severity:"error"};var n=[];n.push(e),r(n)})})}(CodeMirror),function(r){var l=/MSIE \d/.test(navigator.userAgent)&&(null==document.documentMode||document.documentMode<8),m=r.Pos,p={"(":")>",")":"(<"};function h(t,e,n){var r=t.getLineHandle(e.line),a=e.ch-1,i=n&&n.afterCursor;null==i&&(i=/(^| )cm-fat-cursor($| )/.test(t.getWrapperElement().className));var o=!i&&0<=a&&p[r.text.charAt(a)]||p[r.text.charAt(++a)];if(!o)return null;if("\\"===r.text.charAt(a-1))return null;var c=">"==o.charAt(1)?1:-1;if(n&&n.strict&&0<c!=(a==e.ch))return null;var s=t.getTokenTypeAt(m(e.line,a+1)),u=f(t,m(e.line,a+(0<c?1:0)),c,s||null,n);return null==u?null:{from:m(e.line,a),to:u&&u.pos,match:u&&u.ch==o.charAt(0),forward:0<c}}function f(t,e,n,r,a){for(var i=a&&a.maxScanLineLength||1e4,o=a&&a.maxScanLines||1e3,c=[],s=0<n?Math.min(e.line+o,t.lastLine()+1):Math.max(t.firstLine()-1,e.line-o),u=e.line;u!=s;u+=n){var l=t.getLine(u);if(l){var h=0<n?0:l.length-1,f=0<n?l.length:-1;if(!(l.length>i))for(u==e.line&&(h=e.ch-(n<0?1:0));h!=f;h+=n){var g=l.charAt(h);if(")"===g||"("===g){if("\\"===l.charAt(h-1))continue;if(">"==p[g].charAt(1)==0<n)c.push(g);else{if(!c.length)return{pos:m(u,h),ch:g};c.pop()}}}}}return u-n!=(0<n?t.lastLine():t.firstLine())&&null}function e(t,e,n){for(var r=t.state.matchBrackets.maxHighlightLineLength||1e3,a=[],i=t.listSelections(),o=0;o<i.length;o++){var c=i[o].empty()&&h(t,i[o].head,n);if(c&&t.getLine(c.from.line).length<=r){var s=c.match?"CodeMirror-matchingbracket":"CodeMirror-nonmatchingbracket";a.push(t.markText(c.from,m(c.from.line,c.from.ch+1),{className:s})),c.to&&t.getLine(c.to.line).length<=r&&a.push(t.markText(c.to,m(c.to.line,c.to.ch+1),{className:s}))}}if(a.length){l&&t.state.focused&&t.focus();var u=function(){t.operation(function(){for(var t=0;t<a.length;t++)a[t].clear()})};if(!e)return u;setTimeout(u,800)}}function a(t){t.operation(function(){t.state.matchBrackets.currentlyHighlighted&&(t.state.matchBrackets.currentlyHighlighted(),t.state.matchBrackets.currentlyHighlighted=null),t.state.matchBrackets.currentlyHighlighted=e(t,!1,t.state.matchBrackets)})}r.defineOption("matchBrackets",!1,function(t,e,n){n&&n!=r.Init&&(t.off("cursorActivity",a),t.state.matchBrackets&&t.state.matchBrackets.currentlyHighlighted&&(t.state.matchBrackets.currentlyHighlighted(),t.state.matchBrackets.currentlyHighlighted=null)),e&&(t.state.matchBrackets="object"==typeof e?e:{},t.on("cursorActivity",a))}),r.defineExtension("matchBrackets",function(){e(this,!0)}),r.defineExtension("findMatchingBracket",function(t,e,n){return(n||"boolean"==typeof e)&&(e=n?(n.strict=e,n):e?{strict:!0}:null),h(this,t,e)}),r.defineExtension("scanForBracket",function(t,e,n,r){return f(this,t,e,0,r)})}(CodeMirror);