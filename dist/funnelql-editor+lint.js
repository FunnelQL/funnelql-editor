!function(g){"use strict";g.defineMode("funnelql-core",function(a,t){function e(t){for(var e={},n=t.split(" "),r=0;r<n.length;++r)e[n[r]]=!0;return e}var o=e("false true null unknown"),c={},s=e("regex fn path count url since page"),u=/^[*+\-%<>!=&|^]/,l=(t.support,!1!==t.backslashStringEscapes),h=t.punctuation||/^[;.,:]/;function f(t,e){var n=t.peek(),r=47<n.charCodeAt(0)&&n.charCodeAt(0)<58;if(r&&t.match(/^\d*(\.[0-9]+)?(y|M|w|d|h|m|s)/))return"timenumber";if(r&&t.match(/^[0-9]{4}-\d{2}-\d{2}T\d{2}:\d{2}/))return"date";if(r)return t.match(/^[0-9]*(\.[0-9]+)?([eE][-+]?[0-9]+)?/),"number";if("'"==n||'"'==n)return e.tokenize=(a=n,function(t,e){for(var n,r=!1;null!=(n=t.next());){if(n==a&&!r){e.tokenize=f;break}r=l&&!r&&"\\"==n}return"string"}),t.next(),e.tokenize(t,e);if("#"==n)return t.skipToEnd(),t.next(),"comment";if("."==n)return t.next(),null;if(u.test(n))return t.eatWhile(u),"operator";if(/^[\(\)]/.test(n))return t.eatWhile(/^[\(\)]/),"bracket";if(h.test(n))return t.eatWhile(h),"punctuation";t.eatWhile(/^[_\w\d]/);var a,i=t.current().toLowerCase();return"regex"!==i?"location"===i?"location":o.hasOwnProperty(i)?"atom":c.hasOwnProperty(i)?"builtin":s.hasOwnProperty(i)?"keyword":"error":t.match(/^\s*\(\s*(\/([^\/]|\\\/)*\/[a-z]*)\s*\)/,!1)?(t.eatWhile(/^[\s\(]/),"regex"):null}function i(t,e,n){e.context={prev:e.context,indent:t.indentation(),col:t.column(),type:n}}return{startState:function(){return{tokenize:f,context:null}},token:function(t,e){if(t.sol()&&e.context&&null==e.context.align&&(e.context.align=!1),e.tokenize==f&&t.eatSpace())return null;var n=e.tokenize(t,e);if("comment"==n)return n;e.context&&null==e.context.align&&(e.context.align=!0);var r,a=t.current();return"("==a?i(t,e,")"):"["==a?i(t,e,"]"):e.context&&e.context.type==a&&((r=e).indent=r.context.indent,r.context=r.context.prev),n},indent:function(t,e){var n=t.context;if(!n)return g.Pass;var r=e.charAt(0)==n.type;return n.align?n.col+(r?0:1):n.indent+(r?0:a.indentUnit)},lineComment:"#",closeBrackets:"()[]{}''\"\"``"}}),g.defineMode("funnelql",function(t,e){var n,r=g.getMode(t,{name:"funnelql-core",fqlMode:!0}),a=g.getMode(t,"regex");function i(t,e){var n=r.token(t,e.fqlState);return"regex"==n&&(e.token=o,e.localState=a.startState(r.indent(e.fqlState,"")),e.mode="regex"),n}function o(t,e){return t.match(/^\/[a-z]*\s*\)/i,!1)&&(n=!0),n&&t.match(/^\)/i,!1)?(n=!1,e.token=i,e.localState=null,e.mode="funnelql-core",i(t,e)):a.token(t,e.localState)}return{startState:function(){var t=r.startState();return t.modes=[],t.tokens=[],t.states=[],{token:i,localState:null,mode:"funnelql",fqlState:t}},copyState:function(t){if(t.localState)var e=g.copyState(t.token==o?a:r,t.localState);return{token:t.token,localState:e,mode:t.mode,fqlState:g.copyState(r,t.fqlState)}},token:function(t,e){return e.token(t,e)},compareStates:function(t,e){return t.mode==e.mode&&(t.localState?g.Pass:r.compareStates(t.fqlState,e.fqlState))},electricChars:"/{}:"}},"funnelql-core","regex"),g.defineMode("regex",function(){function t(){}return t.prototype.tokenize=function(t){var e;return this.state||(this.state=this._start),"\\"===(e=t.next())?(t.next(),"quote-regex"):this.state(t,e)},t.prototype._comment=function(){return"comment-regex"},t.prototype._plain=function(t,e){switch(e){case"/":return this.state=this._options,"qualifier-regex";case"[":return this.entering=!0,this.ccDepth=0,this.state=this._characterClass,"meta-regex";case"(":return this.entering=!0,this.state=this._group,"bracket-regex";case")":return"bracket-regex";case"{":return t.skipTo("}")&&t.next(),"tag-regex";case".":case"*":case"?":case"|":return"operator-regex";case"^":case"$":return"atom-regex"}},t.prototype._start=function(t,e){return this.state=this._plain,"/"===e?"qualifier-regex":this._plain(t,e)},t.prototype._characterClass=function(t,e){var n;switch(n=this.entering,this.entering=!1,e){case"[":return this.ccDepth++,this.entering=!0,"meta-regex";case"]":return 0==this.ccDepth--&&(this.state=this._plain),"meta-regex";case"-":return"qualifier-regex";default:return n&&"^"===e?"operator-regex":"string-regex"}},t.prototype._group=function(t,e){var n;return n=this.entering,this.entering=!1,this.state=this._plain,n&&"?"===e?(this.state=this._name,"tag-regex"):this._plain()},t.prototype._name=function(t,e){return this.state=this._group,"<"===e||"'"===e?(t.skipTo("<"===e?">":"'"),t.next(),"tag-regex"):this._group(t,e)},t.prototype._options=function(t){return t.skipTo(")"),"attribute-regex"},{startState:function(){return new t},token:function(t,e){return e.tokenize(t)}}})}(CodeMirror),function(a){"use strict";a.registerHelper("lint","funnelql",function(t,r,e){$FQL.parse(t).then(function(t){r([])}).catch(function(t){if(void 0!==t.startLine)var e={from:a.Pos(t.startLine,t.startCol),to:a.Pos(t.endLine,t.endCol),message:t.message,severity:"error"};else e={from:a.Pos(0,0),to:a.Pos(0,0),message:t.message,severity:"error"};var n=[];n.push(e),r(n)})})}(CodeMirror),function(r){var l=/MSIE \d/.test(navigator.userAgent)&&(null==document.documentMode||document.documentMode<8),m=r.Pos,p={"(":")>",")":"(<"};function h(t,e,n){var r=t.getLineHandle(e.line),a=e.ch-1,i=n&&n.afterCursor;null==i&&(i=/(^| )cm-fat-cursor($| )/.test(t.getWrapperElement().className));var o=!i&&0<=a&&p[r.text.charAt(a)]||p[r.text.charAt(++a)];if(!o)return null;if("\\"===r.text.charAt(a-1))return null;var c=">"==o.charAt(1)?1:-1;if(n&&n.strict&&0<c!=(a==e.ch))return null;var s=t.getTokenTypeAt(m(e.line,a+1)),u=f(t,m(e.line,a+(0<c?1:0)),c,s||null,n);return null==u?null:{from:m(e.line,a),to:u&&u.pos,match:u&&u.ch==o.charAt(0),forward:0<c}}function f(t,e,n,r,a){for(var i=a&&a.maxScanLineLength||1e4,o=a&&a.maxScanLines||1e3,c=[],s=0<n?Math.min(e.line+o,t.lastLine()+1):Math.max(t.firstLine()-1,e.line-o),u=e.line;u!=s;u+=n){var l=t.getLine(u);if(l){var h=0<n?0:l.length-1,f=0<n?l.length:-1;if(!(l.length>i))for(u==e.line&&(h=e.ch-(n<0?1:0));h!=f;h+=n){var g=l.charAt(h);if(")"===g||"("===g){if("\\"===l.charAt(h-1))continue;if(">"==p[g].charAt(1)==0<n)c.push(g);else{if(!c.length)return{pos:m(u,h),ch:g};c.pop()}}}}}return u-n!=(0<n?t.lastLine():t.firstLine())&&null}function e(t,e,n){for(var r=t.state.matchBrackets.maxHighlightLineLength||1e3,a=[],i=t.listSelections(),o=0;o<i.length;o++){var c=i[o].empty()&&h(t,i[o].head,n);if(c&&t.getLine(c.from.line).length<=r){var s=c.match?"CodeMirror-matchingbracket":"CodeMirror-nonmatchingbracket";a.push(t.markText(c.from,m(c.from.line,c.from.ch+1),{className:s})),c.to&&t.getLine(c.to.line).length<=r&&a.push(t.markText(c.to,m(c.to.line,c.to.ch+1),{className:s}))}}if(a.length){l&&t.state.focused&&t.focus();var u=function(){t.operation(function(){for(var t=0;t<a.length;t++)a[t].clear()})};if(!e)return u;setTimeout(u,800)}}function a(t){t.operation(function(){t.state.matchBrackets.currentlyHighlighted&&(t.state.matchBrackets.currentlyHighlighted(),t.state.matchBrackets.currentlyHighlighted=null),t.state.matchBrackets.currentlyHighlighted=e(t,!1,t.state.matchBrackets)})}r.defineOption("matchBrackets",!1,function(t,e,n){n&&n!=r.Init&&(t.off("cursorActivity",a),t.state.matchBrackets&&t.state.matchBrackets.currentlyHighlighted&&(t.state.matchBrackets.currentlyHighlighted(),t.state.matchBrackets.currentlyHighlighted=null)),e&&(t.state.matchBrackets="object"==typeof e?e:{},t.on("cursorActivity",a))}),r.defineExtension("matchBrackets",function(){e(this,!0)}),r.defineExtension("findMatchingBracket",function(t,e,n){return(n||"boolean"==typeof e)&&(e=n?(n.strict=e,n):e?{strict:!0}:null),h(this,t,e)}),r.defineExtension("scanForBracket",function(t,e,n,r){return f(this,t,e,0,r)})}(CodeMirror);;/*! FunnelQL Editor v1.0.2
 * (c) https://funnelql.com/ */
!function(H){function L(){if(console&&console.error){var c=Array.prototype.slice.call(arguments);c.unshift("font-size:12px;font-weight:bold;color:#333;margin-right:1px;");c.unshift("font-size:8px;color:black;");c.unshift("font-size:8px;font-weight:bold;color:black;");c.unshift("font-size:12px;font-weight:bold;color:blue;margin-right:1px;");"%c\u0192";c.unshift("font-size:12px;font-weight:bold;color:#333;margin-right:1px;");c.unshift("%c\u2772%c\u0192%cQL%c Editor%c\u2773");console.error.apply(null,
c)}}function u(c){return"string"==typeof c}function I(c,a,d){if(d||(d=v),c instanceof Array)for(var b=c.length,e=0;e<b;e++)I(c[e],a,d);else if(aa)d.addEventListener(c,a,!1);else if(d.attachEvent)"DOMContentLoaded"===c&&(c="load",d=H),d.attachEvent("on"+c,a);else try{d["on"+c]=a}catch(B){}}function x(c,a){return a||(a=v),a.getElementsByClassName(c)}function t(c,a,d){return a||(a=v),d?a.querySelectorAll(c):a.querySelector(c)}function n(c,a){return t("[name="+c+"]",a,void 0)}function k(c,a,d){c=v.createElement(c);
a&&M(c,a);d&&(u(d)?c.innerHTML=d:c.appendChild(d));return c}function l(c,a,d){c=c.cloneNode(!0);a&&M(c,a);d&&(u(d)?c.innerHTML=d:c.appendChild(d));return c}function p(c,a){c.appendChild(a)}function M(c,a){for(var d in a)a.hasOwnProperty(d)&&c.setAttribute(d,a[d])}function C(c,a){a.classList.add(c)}function T(c){var a,d=c.match(ba);if(d)try{d=new RegExp(d[1],d[2])}catch(b){d=!1,a=b.message}return a||d||(a="Invalid regular expression: Pattern not recognized: "+c),a?(y=a,!1):!!d}function U(c,a){for(var d,
b=x("fql-popup",c),e=0,k=b.length;e<k;e++)a&&b[e].id===a.id||b[e].classList.remove("fql-active");b=x("fql-btn",c);e=0;for(k=b.length;e<k;e++)(d=b[e].getAttribute("data-cmd"))&&a&&a.classList.contains("fql-popup-"+d)||b[e].classList.remove("fql-active")}function D(c,a){c.style.display=a?"none":""}function q(c,a,d,b){var e=x("fql-error",c)[0];if(b){if(a)a.classList.remove("fql-input-error");else for(c=x("fql-input-error",c),a=0,d=c.length;a<d;a++)c[a].classList.remove("fql-input-error");e.style.visibility=
"hidden"}else a.focus(),C("fql-input-error",a),d&&(e.innerHTML=d),e.style.visibility=d?"visible":"hidden"}function V(c,a,d){var b;b=c.getAttribute("data-on");c=c.getAttribute("data-off");if(b)for(var e=0,k=(b=t(b,d,!0)).length;e<k;e++)D(b[e],!a);if(c)for(e=0,k=(b=t(c,d,!0)).length;e<k;e++)D(b[e],a)}function W(c,a){var d,b={},e=c.parentNode;u(a)&&(a=[d=a]);for(var k=a.length;e&&0<k;){for(var h=0,f=a.length;h<f;h++)e.classList.contains(a[h])&&(b[a[h]]=e,k--);if(e.classList.contains("fql-editor"))break;
e=e.parentNode}return d?b[d]:b}function X(c){var a,d,b=W(c,"fql-popup");c=c.checked;b=((a=n("path-operator",b))||(a=v),a.getElementsByTagName("option"));a=0;for(var e=b.length;a<e;a++)"|"===(d=b[a].innerHTML).substring(0,1)?c||(d=d.substring(1)):c&&(d="|"+d),b[a].innerHTML=d}function Y(){function c(a,b){var c=k,d=e,g=a,f=b,h=g.length,m=c.getCursor(),l=c.getLine(m.line),p=l.substr(0,m.ch),B=p;if(0<m.line)for(var r=m.line-1;0<=r;r--)B=c.getLine(r)+B;var n,l=l.substr(m.ch),r=/\s$/.test(p),q=/^\s/.test(p),
O=(B=/path\([^\)\(]+$/gi.test(B))?">":"+";void 0===f&&(f=0);!1===f&&(O="");(/^\s*$/.test(p)||/\(\s*$/.test(p))&&!B||!/\(\s*$/.test(p)&&(g=/\+\s*$/.test(p)?(n=r?"":" ")+g:(n=(r?"":" ")+O+" ")+g);n&&!1!==f&&0<f&&(f+=n.length);(/^\s*([a-z0-9]|"|\(|\/)/i.test(l)||/^\s*$/i.test(l)&&c.lineCount()>m.line+1)&&(g+=" "+O+(q?"":" "));c.replaceSelection(g);c.focus();g=!1===f||isNaN(f)?m.ch+g.length:0>f?(n&&(h+=n.length),m.ch+h+parseInt(f)):m.ch+parseInt(f);c.setCursor({line:m.line,ch:g});U(d);!0}var a=W(this,
["fql-popup","fql-toolbar","fql-editor"]),d=a["fql-toolbar"],b=a["fql-popup"],e=a["fql-editor"];if(!d)return L(".fql-toolbar not found");var k=P[d.parentNode.getAttribute("data-editor")-1],a=this.getAttribute("data-cmd");switch(a){case "tag":case "url":case "count":case "since":case "path-operator":case "fn":if(b=t(".fql-popup-"+a,d),b.classList.toggle("fql-active")){for(var h,f,l=t("[data-default]",b,!0),g=0,m=l.length;g<m;g++)h=l[g].getAttribute("data-default"),(f=l[g].getAttribute("type"))&&-1!==
["checkbox","radio"].indexOf(f)?l[g].checked=!!h:u(h)&&(l[g].value=h);h=t("[data-show]",b,!0);g=0;for(m=h.length;g<m;g++)f=h[g].getAttribute("data-show"),-1!==["i","v"].indexOf(f)?h[g].style.visibility="i"===f?"hidden":"":D(h[g],!parseInt(f));"path-operator"===a&&function(a,c,b){u(a)&&(a=t("[name="+a+"] option",b,!0));b=0;for(var d=a.length;b<d;b++)"|"===a[b].innerText.substring(0,1)?c||(a[b].innerText=a[b].innerText.substring(1)):c&&(a[b].innerText="|"+a[b].innerText)}(a,!1,b);q(b,!1,!1,1);U(d,b);
C("fql-active",this)}else this.classList.remove("fql-active");break;case "path":c("PATH(  )",6);break;case "insert-since":d=n("operator",b);f=d.value;a=n("since-time",b);g=a.value;m=n("since-date",b);h=m.value;var l=n("since-time-type",b),p=l.value;switch(f){case "time":if(""===g||isNaN(g))return q(b,a,"Invalid time value.");if(0>=(g=parseInt(g)))return q(b,a,"Time value should be greater than 0.");if(-1==="smhdwMy".split("").indexOf(p))return q(b,l,"Invalid time type.");g=g.toString()+p;break;case "date":if(""===
h||!/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}$/.test(h))return q(b,m,"Invalid date");g=h;break;default:return q(b,d,"Select a time type...")}c("SINCE("+g+", (  ) )",-4);break;case "insert-tag":case "insert-url":if("url"==(f="insert-tag"===a?"tag":"url")&&(d=n("loc-"+f+"-cb",b))&&d.checked)return c("URL( location )");if((g=n("regex-"+f+"-cb",b))&&g.checked){if(""===(g=(m=n("regex-"+f,b)).value))return q(b,m);if(!T(g))return q(b,m,y);b="tag"===f?"REGEX( "+g+" )":"URL( REGEX( "+g+" ) )"}else{if(""===(g=(m=n(f,
b)).value))return q(b,m);b="tag"===f?'"'+g+'"':'URL( "'+g+'" )'}c(b);break;case "insert-path-operator":g=n("same-page-cb",b).checked;m=n("path-operator",b);d=m.value;h=n("path-depth",b);f=h.value;a=n("path-depth-type",b).value;if(-1===["<","<=",">",">="].indexOf(d))return q(b,m,"Invalid path depth operator.");if(""!==f&&(isNaN(f)||0>parseInt(f)))return q(b,h,"Path depth should be numeric (>=0).");if(""!==f&&(f=parseInt(f)),!f&&-1!==["<","<=",">="].indexOf(d))return q(b,h,"The selected path depth operator requires a depth.");
if(f&&g&&""===a)return q(b,h,"Same page operator cannot contain path depth.");if(a&&!f)return q(b,h,"The selected path depth type requires a depth.");b=(g?"|":"")+d;f&&(b+=f.toString());c((b+=a)+" ",!1);break;case "insert-count":f=n("operator",b);m=(d=f.value,n("count",b));a=m.value;if(-1===["<","<=",">",">="].indexOf(d))return q(b,f,"Invalid count operator.");if(""===a||isNaN(a)||1>parseInt(a))return q(b,m,"Count value should be numeric (>1).");if((g=n("regex-"+(f="count-tag")+"-cb",b))&&g.checked){if(""===
(g=(m=n("regex-"+f,b)).value))return q(b,m);if(!T(g))return q(b,m,y);b="REGEX( "+g+" )"}else{if(""===(g=(m=n(f,b)).value))return q(b,m);b='"'+g+'"'}c("COUNT( "+b+" "+d+" "+a.toString()+" )");break;case "insert-fn":f=n("fn",b);d=f.value.trim();a=n("arg",b).value.trim();if(""===d||!ca.test(d))return q(b,f,"Invalid function name");c("FN( "+JSON.stringify(d)+(a?", "+JSON.stringify(a):"")+" )")}}function E(c,a,d){a=l(da,{"data-cmd":a,tabindex:d});I("click",Y,a);a=l(ea,!1,a);c.appendChild(a)}function w(c,
a,d,b,e,l,h){b=k("div",{"class":"fql-input fql-"+a+"-input",style:h?"display:none":"","data-show":h?"0":"1"});a=k("input",{type:"text",name:a,placeholder:d,tabindex:e,dir:"auto",id:"fql-input-"+ ++Q,"data-default":l||""});b.appendChild(a);c.appendChild(b);return b}function J(c,a,d,b,e,l){var h=k("div",{"class":"fql-input fql-cb fql-"+a+"-input",style:"","data-show":"1"}),f="fql-input-"+ ++Q,r=k("span",{"class":"fql-cb-input"});a=k("input",{type:"checkbox",name:a,tabindex:b,id:f,"data-default":""});
if(e||l){var g;b={};u(e)&&(b["data-on"]=e,e=g=!0);u(l)&&(b["data-off"]=l,l=g=!0);g&&M(a,b);I("change",function(){this.checked?e&&(!0===e?V(this,!0,c):e(this)):l&&(!0===l?V(this,!1,c):l(this))},a)}r.appendChild(a);p(r,k("span",{},'<svg version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" width="10" height="10" viewBox="0 0 32 32"><path d="M27 4l-15 15-7-7-5 5 12 12 20-20z" fill="#FFF"></path></svg>'));h.appendChild(r);p(h,k("label",{"for":f},d));c.appendChild(h)}
function z(c,a,d,b){a=l(fa,{"data-cmd":a,title:d},k("i",{"class":"fqli-"+b}));I("click",Y,a);c.appendChild(a)}function F(c,a){var d="fql-popup-"+ ++Q,d=l(ga,{id:d});C("fql-popup-"+c,d);d.appendChild(a);return d}var v=H.document,aa=v.addEventListener,ca=/^[$A-Z_][0-9A-Z_$]*(\.[$A-Z_][0-9A-Z_$]*)*$/i,Q=0,P=[],Z=H.CodeMirror;if(Z){var y,ba=RegExp("^\\/(.*)\\/([gimuy]+)?$",void 0),ha={mode:"funnelql",indentWithTabs:!0,smartIndent:!0,matchBrackets:!0,autoCloseBrackets:!0,autofocus:!0,lineWrapping:!0,lineNumbers:!0,
gutters:["CodeMirror-lint-markers"],lint:{async:!0,lintOnChange:!0},extraKeys:{"Ctrl-Space":"autocomplete"},hintOptions:{tables:{users:["name","score","birthDate"],countries:["name","population","size"]}}},ia=k("div",{"class":"fql-editor",role:"application"}),ja=k("div",{"class":"fql-toolbar"},k("div",{"class":"fql-ref"},'<a href="https://funnelql.com/" target="_blank" rel="noopener">&copy; FunnelQL.com<span>Funnel Query Language</span></a>')),fa=k("button",{type:"button",tabindex:"-1",role:"button",
"class":"fql-command fql-btn","aria-pressed":"false","aria-disabled":"false"}),R=k("a",{target:"_blank",rel:"noopener",type:"button",role:"button",tabindex:"-1","class":"fql-command fql-btn"}),S=k("div",{role:"separator","class":"fql-separator","aria-orientation":"vertical"}),ga=k("div",{"class":"fql-popup"},k("div",{"class":"fql-arrow"})),G=k("div",{"class":"fql-layer"}),K=k("select"),A=k("option"),ea=k("div",{"class":"fql-action-buttons"},k("div",{"class":"fql-error",style:"visibility:hidden"})),
da=k("button",{"class":"fql-command fql-submit",role:"button",type:"button"},"Insert");H.FunnelQLEditor=function(c,a){if(void 0===H.$FQL)return L("FunnelQL library not loaded ($FQL missing)");var d;if(u(c)&&(d=c,c=v.getElementById(d)),"object"!=typeof c||!v.body.contains(c)||"TEXTAREA"!==c.nodeName)return L("Invalid FunnelQL editor textarea element reference.",c);d=JSON.parse(JSON.stringify(ha));if(a)for(var b in a)a.hasOwnProperty(b)&&(d[b]=a[b]);var e=0;b=l(ia,{id:(c.id||"fql-editor")+"-"+P.length});
var n=l(ja);z(n,"tag","Tag Query","price-tag");z(n,"url","URL Query","anchor");p(n,l(S));z(n,"path","Path Query","filter");z(n,"path-operator","Path Query Operator","next_path");p(n,l(S));z(n,"count","Count Query","exposure_plus_2");z(n,"since","Since Query (date or time)","restore");p(n,l(S));z(n,"fn","Custom Function Query","plug");var h=l(G);w(h,"tag","Tag name",e=0,++e);var f=w(h,"regex-tag","/tag_name(.*)?/i",0,++e,"",1),r=l(R,{href:"https://regexr.com/",title:"Regular Expression Toolbox (RegExr.com)"},
k("i",{"class":"fqli-gears","aria-hidden":"true"}));C("fql-btn-right",r);f.appendChild(r);J(h,"regex-tag-cb","Regular Expression",++e,".fql-regex-tag-input",".fql-tag-input");E(h,"insert-tag",++e);p(n,F("tag",h));e=0;J(h=l(G),"loc-url-cb","location.href (URL in browser)",++e,"",".fql-input-container");var g=k("div",{"class":"fql-input-container","data-show":"1"});w(g,"url","URL",0,++e);f=w(g,"regex-url","/url(.*)?/i",0,++e,"",1);C("fql-btn-right",r=l(R,{href:"https://regexr.com/",title:"Regular Expression Toolbox (RegExr.com)"},
k("i",{"class":"fqli-gears","aria-hidden":"true"})));f.appendChild(r);J(g,"regex-url-cb","Regular Expression",++e,".fql-regex-url-input",".fql-url-input");h.appendChild(g);E(h,"insert-url",++e);p(n,F("url",h));e=0;J(h=l(G),"same-page-cb","Same page",++e,X,X);for(var g=k("div",{"class":"fql-input fql-path-operator-input"}),f=l(K,{name:"path-operator","data-default":">"}),r=[">",">=","<","<=","=="],m=0,q=r.length;m<q;m++)p(f,l(A,{value:r[m]},r[m]));p(g,k("div",{},f));p(g,k("div",{"class":"fql-depth"},
k("input",{type:"number",min:"1",name:"path-depth",placeholder:"Depth",tabindex:++e,"data-default":""})));for(var f=l(K,{name:"path-depth-type","data-default":""},l(A,{value:""},"Next in path")),t=k("optgroup",{label:"Time depth"}),y="seconds minutes hours days weeks months years".split(" "),m=0,q=(r="smhdwMy".split("")).length;m<q;m++)p(t,l(A,{value:r[m]},y[m]));f.appendChild(t);p(g,k("div",{},f));h.appendChild(g);E(h,"insert-path-operator",++e);p(n,F("path-operator",h));w(h=l(G),"count-tag","Tag name",
e=0,++e);f=w(h,"regex-count-tag","/tag_name(.*)?/i",0,++e,"",1);C("fql-btn-right",r=l(R,{href:"https://regexr.com/",title:"Regular Expression Toolbox (RegExr.com)"},k("i",{"class":"fqli-gears","aria-hidden":"true"})));f.appendChild(r);J(h,"regex-count-cb","Regular Expression",++e,".fql-regex-count-tag-input",".fql-count-tag-input");g=k("div",{"class":"fql-input fql-path-operator-input"});f=l(K,{name:"operator","data-default":">"});m=0;for(q=(r=[">",">=","<","<=","=="]).length;m<q;m++)p(f,l(A,{value:r[m]},
r[m]));p(g,k("div",{},f));p(g,k("div",{"class":"fql-depth"},k("input",{type:"number",min:"1",name:"count",placeholder:"Number of occurrences",tabindex:++e,"data-default":""})));h.appendChild(g);E(h,"insert-count",++e);p(n,F("count",h));h=l(G);e=0;g=k("div",{"class":"fql-input fql-since-input"});p(f=l(K,{name:"operator","data-default":"time"}),l(A,{value:"time"},"Time"));p(f,l(A,{value:"date"},"Date"));I("change",function(){for(var a,b=this.parentNode;b&&!a;){if(b.classList.contains("fql-popup")){a=
b;break}b=b.parentNode}var b=x("fql-since-date",a)[0],c=x("fql-since-time-type",a)[0],d="time"===this.value;D(x("fql-since-time",a)[0],!d);D(c,!d);D(b,d)},f);p(g,k("div",{"class":"fql-since-type"},f));p(g,k("div",{"class":"fql-since-time","data-show":"1"},k("input",{type:"number",min:"1",name:"since-time",placeholder:"Number...",tabindex:++e,"data-default":""})));p(g,k("div",{"class":"fql-since-date",style:"display:none","data-show":"0"},k("input",{type:"datetime-local",name:"since-date",placeholder:"Date",
tabindex:++e,"data-default":""})));f=l(K,{name:"since-time-type","data-default":"s"});y="seconds minutes hours days weeks months years".split(" ");m=0;for(q=(r="smhdwMy".split("")).length;m<q;m++)p(f,l(A,{value:r[m]},y[m]));p(g,k("div",{"class":"fql-since-time-type","data-show":"1"},f));h.appendChild(g);E(h,"insert-since",++e);p(n,F("since",h));w(h=l(G),"fn","Function name",e=0,++e);w(h,"arg","Argument 1...",0,++e);p(h,k("div",{"class":"fql-input-desc"},"You can add multiple arguments. Conditions of a parent query, e.g. <code>SINCE</code>, are added as a extra argument."));
E(h,"insert-fn",++e);p(n,F("fn",h));b.appendChild(n);e=k("div",{"class":"fql-wrapper"});b.appendChild(e);c.parentNode.insertBefore(b,c);e.appendChild(c);var N=Z.fromTextArea(c,d);return N.parse=function(){return new Promise(function(a,b){var c=N.getValue();$FQL.parse(c).then(function(b){a(b)})["catch"](b)})},M(b,{"data-editor":P.push(N)}),N}}else L("CodeMirror not loaded")}(window);