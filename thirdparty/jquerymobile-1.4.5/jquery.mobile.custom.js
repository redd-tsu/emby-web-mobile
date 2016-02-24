﻿(function(root,doc,factory){factory(root.jQuery,root,doc);}(this,document,function(jQuery,window,document,undefined){jQuery.mobile={};(function($,window,undefined){function parentWithClass(elem,className){while(!elem.classList||!elem.classList.contains(className)){elem=elem.parentNode;if(!elem){return null;}}
return elem;}
$.extend($.mobile,{behaviors:{},getClosestBaseUrl:function(ele){var page=parentWithClass(ele,'ui-page');var url=(page?page.getAttribute("data-url"):null),base=$.mobile.path.documentBase.hrefNoHash;if(!url||!$.mobile.path.isPath(url)){url=base;}
return $.mobile.path.makeUrlAbsolute(url,base);}});$.fn.extend({enhanceWithin:function(){var index,widgetElements={},that=this;$.each($.mobile.widgets,function(name,constructor){if(constructor.initSelector){var elements=that[0].querySelectorAll(constructor.initSelector);if(elements.length>0){widgetElements[constructor.prototype.widgetName]=$(elements);}}});for(index in widgetElements){widgetElements[index][index]();}
return this;}});})(jQuery,this);var previousState={};jQuery.onStatePushed=function(state){previousState=state;};function ignorePopState(event){var state=event.state||{};if(previousState.navigate===false){previousState=state;return true;}
previousState=state;return false;}
function fireNavigateFromPopstateEvent(event){var state=event.state||{};if(event.historyState){$.extend(state,event.historyState);}
window.dispatchEvent(new CustomEvent("navigate",{detail:{state:state,originalEvent:event}}));}
jQuery.mobile.widgets={};jQuery(document).on("create",function(event){jQuery(event.target).enhanceWithin();});(function($,undefined){var path,$base;$.mobile.path=path={uiStateKey:"&ui-state",urlParseRE:/^\s*(((([^:\/#\?]+:)?(?:(\/\/)((?:(([^:@\/#\?]+)(?:\:([^:@\/#\?]+))?)@)?(([^:\/#\?\]\[]+|\[[^\/\]@#?]+\])(?:\:([0-9]+))?))?)?)?((\/?(?:[^\/\?#]+\/+)*)([^\?#]*)))?(\?[^#]+)?)(#.*)?/,getLocation:function(url){var parsedUrl=this.parseUrl(url||location.href),uri=url?parsedUrl:location,hash=parsedUrl.hash;hash=hash==="#"?"":hash;return uri.protocol+
parsedUrl.doubleSlash+
uri.host+
((uri.protocol!==""&&uri.pathname.substring(0,1)!=="/")?"/":"")+
uri.pathname+
uri.search+
hash;},getDocumentUrl:function(asParsedObject){return asParsedObject?$.extend({},path.documentUrl):path.documentUrl.href;},parseLocation:function(){return this.parseUrl(this.getLocation());},parseUrl:function(url){if($.type(url)==="object"){return url;}
var matches=path.urlParseRE.exec(url||"")||[];return{href:matches[0]||"",hrefNoHash:matches[1]||"",hrefNoSearch:matches[2]||"",domain:matches[3]||"",protocol:matches[4]||"",doubleSlash:matches[5]||"",authority:matches[6]||"",username:matches[8]||"",password:matches[9]||"",host:matches[10]||"",hostname:matches[11]||"",port:matches[12]||"",pathname:matches[13]||"",directory:matches[14]||"",filename:matches[15]||"",search:matches[16]||"",hash:matches[17]||""};},makePathAbsolute:function(relPath,absPath){var absStack,relStack,i,d;if(relPath&&relPath.charAt(0)==="/"){return relPath;}
relPath=relPath||"";absPath=absPath?absPath.replace(/^\/|(\/[^\/]*|[^\/]+)$/g,""):"";absStack=absPath?absPath.split("/"):[];relStack=relPath.split("/");for(i=0;i<relStack.length;i++){d=relStack[i];switch(d){case".":break;case"..":if(absStack.length){absStack.pop();}
break;default:absStack.push(d);break;}}
return"/"+absStack.join("/");},isSameDomain:function(absUrl1,absUrl2){return path.parseUrl(absUrl1).domain.toLowerCase()===path.parseUrl(absUrl2).domain.toLowerCase();},isRelativeUrl:function(url){return path.parseUrl(url).protocol==="";},isAbsoluteUrl:function(url){return path.parseUrl(url).protocol!=="";},makeUrlAbsolute:function(relUrl,absUrl){if(!path.isRelativeUrl(relUrl)){return relUrl;}
if(absUrl===undefined){absUrl=this.documentBase;}
var relObj=path.parseUrl(relUrl),absObj=path.parseUrl(absUrl),protocol=relObj.protocol||absObj.protocol,doubleSlash=relObj.protocol?relObj.doubleSlash:(relObj.doubleSlash||absObj.doubleSlash),authority=relObj.authority||absObj.authority,hasPath=relObj.pathname!=="",pathname=path.makePathAbsolute(relObj.pathname||absObj.filename,absObj.pathname),search=relObj.search||(!hasPath&&absObj.search)||"",hash=relObj.hash;return protocol+doubleSlash+authority+pathname+search+hash;},convertUrlToDataUrl:function(absUrl){var result=absUrl,u=path.parseUrl(absUrl);if(path.isEmbeddedPage(u)){result=u.hash.replace(/^#/,"").replace(/\?.*$/,"");}else if(path.isSameDomain(u,this.documentBase)){result=u.hrefNoHash.replace(this.documentBase.domain,"");}
return window.decodeURIComponent(result);},get:function(newPath){if(newPath===undefined){newPath=path.parseLocation().hash;}
return path.stripHash(newPath).replace(/[^\/]*\.[^\/*]+$/,"");},set:function(path){location.hash=path;},isPath:function(url){return(/\//).test(url);},clean:function(url){return url.replace(this.documentBase.domain,"");},stripHash:function(url){return url.replace(/^#/,"");},stripQueryParams:function(url){return url.replace(/\?.*$/,"");},cleanHash:function(hash){return path.stripHash(hash.replace(/\?.*$/,""));},isHashValid:function(hash){return(/^#[^#]+$/).test(hash);},isExternal:function(url){var u=path.parseUrl(url);return!!(u.protocol&&(u.domain.toLowerCase()!==this.documentUrl.domain.toLowerCase()));},hasProtocol:function(url){return(/^(:?\w+:)/).test(url);},isEmbeddedPage:function(url){var u=path.parseUrl(url);if(u.protocol!==""){return(!this.isPath(u.hash)&&u.hash&&(u.hrefNoHash===this.documentUrl.hrefNoHash||(this.documentBaseDiffers&&u.hrefNoHash===this.documentBase.hrefNoHash)));}
return(/^#/).test(u.href);},squash:function(url,resolutionUrl){var href,cleanedUrl,search,stateIndex,docUrl,isPath=this.isPath(url),uri=this.parseUrl(url),preservedHash=uri.hash,uiState="";if(!resolutionUrl){if(isPath){resolutionUrl=path.getLocation();}else{docUrl=path.getDocumentUrl(true);if(path.isPath(docUrl.hash)){resolutionUrl=path.squash(docUrl.href);}else{resolutionUrl=docUrl.href;}}}
cleanedUrl=isPath?path.stripHash(url):url;cleanedUrl=path.isPath(uri.hash)?path.stripHash(uri.hash):cleanedUrl;stateIndex=cleanedUrl.indexOf(this.uiStateKey);if(stateIndex>-1){uiState=cleanedUrl.slice(stateIndex);cleanedUrl=cleanedUrl.slice(0,stateIndex);}
href=path.makeUrlAbsolute(cleanedUrl,resolutionUrl);search=this.parseUrl(href).search;if(isPath){if(path.isPath(preservedHash)||preservedHash.replace("#","").indexOf(this.uiStateKey)===0){preservedHash="";}
if(uiState&&preservedHash.indexOf(this.uiStateKey)===-1){preservedHash+=uiState;}
if(preservedHash.indexOf("#")===-1&&preservedHash!==""){preservedHash="#"+preservedHash;}
href=path.parseUrl(href);href=href.protocol+href.doubleSlash+href.host+href.pathname+search+
preservedHash;}else{href+=href.indexOf("#")>-1?uiState:"#"+uiState;}
return href;},isPreservableHash:function(hash){return hash.replace("#","").indexOf(this.uiStateKey)===0;},hashToSelector:function(hash){var hasHash=(hash.substring(0,1)==="#");if(hasHash){hash=hash.substring(1);}
return(hasHash?"#":"")+hash.replace(/([!"#$%&'()*+,./:;<=>?@[\]^`{|}~])/g,"\\$1");},isFirstPageUrl:function(url){var u=path.parseUrl(path.makeUrlAbsolute(url,this.documentBase)),samePath=u.hrefNoHash===this.documentUrl.hrefNoHash||(this.documentBaseDiffers&&u.hrefNoHash===this.documentBase.hrefNoHash),fp=$.mobile.firstPage,fpId=fp&&fp[0]?fp[0].id:undefined;return samePath&&(!u.hash||u.hash==="#"||(fpId&&u.hash.replace(/^#/,"")===fpId));}};path.documentUrl=path.parseLocation();$base=$("head").find("base");path.documentBase=$base.length?path.parseUrl(path.makeUrlAbsolute($base.attr("href"),path.documentUrl.href)):path.documentUrl;path.documentBaseDiffers=(path.documentUrl.hrefNoHash!==path.documentBase.hrefNoHash);path.getDocumentBase=function(asParsedObject){return asParsedObject?$.extend({},path.documentBase):path.documentBase.href;};$.extend($.mobile,{getDocumentUrl:path.getDocumentUrl,getDocumentBase:path.getDocumentBase});})(jQuery);(function($,undefined){$.mobile.History=function(stack,index){this.stack=stack||[];this.activeIndex=index||0;};$.extend($.mobile.History.prototype,{getActive:function(){return this.stack[this.activeIndex];},getLast:function(){return this.stack[this.previousIndex];},getNext:function(){return this.stack[this.activeIndex+1];},getPrev:function(){return this.stack[this.activeIndex-1];},add:function(url,data){data=data||{};if(this.getNext()){this.clearForward();}
if(data.hash&&data.hash.indexOf("#")===-1){data.hash="#"+data.hash;}
data.url=url;this.stack.push(data);this.activeIndex=this.stack.length-1;},clearForward:function(){this.stack=this.stack.slice(0,this.activeIndex+1);},find:function(url,stack,earlyReturn){stack=stack||this.stack;var entry,i,length=stack.length,index;for(i=0;i<length;i++){entry=stack[i];if(decodeURIComponent(url)===decodeURIComponent(entry.url)||decodeURIComponent(url)===decodeURIComponent(entry.hash)){index=i;if(earlyReturn){return index;}}}
return index;},closest:function(url){var closest,a=this.activeIndex;closest=this.find(url,this.stack.slice(0,a));if(closest===undefined){closest=this.find(url,this.stack.slice(a),true);closest=closest===undefined?closest:closest+a;}
return closest;},direct:function(opts){var newActiveIndex=this.closest(opts.url),a=this.activeIndex;if(newActiveIndex!==undefined){this.activeIndex=newActiveIndex;this.previousIndex=a;}
if(newActiveIndex<a){(opts.present||opts.back||$.noop)(this.getActive(),"back");}else if(newActiveIndex>a){(opts.present||opts.forward||$.noop)(this.getActive(),"forward");}else if(newActiveIndex===undefined&&opts.missing){opts.missing(this.getActive());}}});})(jQuery);(function($,undefined){var path=$.mobile.path,initialHref=location.href;$.mobile.Navigator=function(history){this.history=history;this.ignoreInitialHashChange=true;window.addEventListener('popstate',$.proxy(this.popstate,this));};$.extend($.mobile.Navigator.prototype,{squash:function(url,data){var state,href,hash=path.isPath(url)?path.stripHash(url):url;href=path.squash(url);state=$.extend({hash:hash,url:href},data);window.history.replaceState(state,state.title||document.title,href);return state;},hash:function(url,href){var parsed,loc,hash,resolved;parsed=path.parseUrl(url);loc=path.parseLocation();if(loc.pathname+loc.search===parsed.pathname+parsed.search){hash=parsed.hash?parsed.hash:parsed.pathname+parsed.search;}else if(path.isPath(url)){resolved=path.parseUrl(href);hash=resolved.pathname+resolved.search+(path.isPreservableHash(resolved.hash)?resolved.hash.replace("#",""):"");}else{hash=url;}
return hash;},go:function(url,data,noEvents){var state,href,hash,popstateEvent;href=path.squash(url);hash=this.hash(url,href);if(noEvents&&hash!==path.stripHash(path.parseLocation().hash)){this.preventNextHashChange=noEvents;}
this.preventHashAssignPopState=true;window.location.hash=hash;if(!browserInfo.safari){this.preventHashAssignPopState=false;}
state=$.extend({url:href,hash:hash,title:document.title},data);this.squash(url,state);if(!noEvents){this.ignorePopState=true;window.dispatchEvent(new CustomEvent("popstate",{detail:{originalEvent:{type:"popstate",state:null}}}));}
this.history.add(state.url,state);},popstate:function(event){if(ignorePopState(event)){return;}
setTimeout(function(){fireNavigateFromPopstateEvent(event);},0);var hash,state;if(this.preventHashAssignPopState){this.preventHashAssignPopState=false;event.stopImmediatePropagation();return;}
if(this.ignorePopState){this.ignorePopState=false;return;}
var originalEventState=event.state||(event.detail?event.detail.originalEvent.state:event.state);if(!originalEventState&&this.history.stack.length===1&&this.ignoreInitialHashChange){this.ignoreInitialHashChange=false;if(location.href===initialHref){event.preventDefault();return;}}
hash=path.parseLocation().hash;if(!originalEventState&&hash){state=this.squash(hash);this.history.add(state.url,state);event.historyState=state;return;}
this.history.direct({url:(originalEventState||{}).url||hash,present:function(historyEntry,direction){event.historyState=$.extend({},historyEntry);event.historyState.direction=direction;}});}});})(jQuery);(function($,undefined){$.mobile.navigate=function(url,data,noEvents){$.mobile.navigate.navigator.go(url,data,noEvents);};$.mobile.navigate.history=new $.mobile.History();$.mobile.navigate.navigator=new $.mobile.Navigator($.mobile.navigate.history);var loc=$.mobile.path.parseLocation();$.mobile.navigate.history.add(loc.href,{hash:loc.hash});})(jQuery);(function($,undefined){function jqmPage(pageElem){var self=this;if(pageElem.hasPage){return;}
pageElem.hasPage=true;pageElem.dispatchEvent(new CustomEvent("pagecreate",{bubbles:true}));self.element=$(pageElem);self.options={theme:pageElem.getAttribute('data-theme')||'a'};self._enhance=function(){var attrPrefix="data-";var element=self.element[0];element.setAttribute("data-role",'page');element.setAttribute("tabindex","0");element.classList.add("ui-page");element.classList.add("ui-page-theme-"+self.options.theme);var contents=element.querySelectorAll("div[data-role='content']");for(var i=0,length=contents.length;i<length;i++){var content=contents[i];var theme=content.getAttribute(attrPrefix+"theme")||undefined;self.options.contentTheme=theme||self.options.contentTheme||(self.options.dialog&&self.options.theme)||(self.element.data("role")==="dialog"&&self.options.theme);content.classList.add("ui-content");if(self.options.contentTheme){content.classList.add("ui-body-"+(self.options.contentTheme));}
content.setAttribute("role","main");content.classList.add("ui-content");}};self._enhance();self.element.enhanceWithin();pageElem.dispatchEvent(new CustomEvent("pageinit",{bubbles:true}));}
var pageCache={};function pageContainer(containerElem){var self=this;self.element=containerElem;self.initSelector=false;window.addEventListener("navigate",function(e){var url;if(e.defaultPrevented){return;}
var originalEvent=e.detail.originalEvent;if(originalEvent&&originalEvent.defaultPrevented){return;}
var data=e.detail;url=originalEvent.type.indexOf("hashchange")>-1?data.state.hash:data.state.url;if(!url){url=$.mobile.path.parseLocation().hash;}
if(!url||url==="#"||url.indexOf("#"+$.mobile.path.uiStateKey)===0){url=location.href;}
self._handleNavigate(url,data.state);});self.back=function(){self.go(-1);};self.forward=function(){self.go(1);};self.go=function(steps){window.history.go(steps);};self._handleDestination=function(to){if($.type(to)==="string"){to=$.mobile.path.stripHash(to);}
if(to){to=!$.mobile.path.isPath(to)?($.mobile.path.makeUrlAbsolute("#"+to,$.mobile.path.documentBase)):to;}
return to||$.mobile.firstPage;};self._handleNavigate=function(url,data){var to=$.mobile.path.stripHash(url),changePageOptions={changeHash:false,fromHashChange:true,reverse:data.direction==="back"};$.extend(changePageOptions,data,{transition:"none"});$.mobile.changePage(self._handleDestination(to),changePageOptions);};self._enhance=function(content,role){new jqmPage(content[0]);};self._include=function(page,jPage,settings){jPage.appendTo(self.element);self._enhance(jPage,settings.role);};self._find=function(absUrl){var fileUrl=absUrl,dataUrl=self._createDataUrl(absUrl),page,initialContent=$.mobile.firstPage;page=self.element[0].querySelector("[data-url='"+$.mobile.path.hashToSelector(dataUrl)+"']");if(!page&&dataUrl&&!$.mobile.path.isPath(dataUrl)){page=self.element[0].querySelector($.mobile.path.hashToSelector("#"+dataUrl));if(page){$(page).attr("data-url",dataUrl).data("url",dataUrl);}}
if(!page&&$.mobile.path.isFirstPageUrl(fileUrl)&&initialContent&&initialContent.parent().length){page=initialContent;}
return page?$(page):$();};self._parse=function(html,fileUrl){var page,all=document.createElement('div');all.innerHTML=html;page=all.querySelector("div[data-role='page']");if(!page){page=$("<div data-role='page'>"+
(html.split(/<\/?body[^>]*>/gmi)[1]||"")+"</div>")[0];}
page.setAttribute("data-url",self._createDataUrl(fileUrl));page.setAttribute("data-external-page",true);return page;};self._setLoadedTitle=function(page,html){if(!page.data("title")){var newPageTitle=html.match(/<title[^>]*>([^<]*)/)&&RegExp.$1;if(newPageTitle){page.data("title",newPageTitle);}}};self._createDataUrl=function(absoluteUrl){return $.mobile.path.convertUrlToDataUrl(absoluteUrl);};self._triggerWithDeprecated=function(name,data,page){(page||this.element)[0].dispatchEvent(new CustomEvent("page"+name,{bubbles:true,detail:{data:data}}));};self._loadSuccess=function(absUrl,settings,deferred){var fileUrl=absUrl;var currentSelf=self;return function(html,wasCached){if(!wasCached||typeof(wasCached)!='boolean'){if($.mobile.filterHtml){html=$.mobile.filterHtml(html);}
if(absUrl.toLowerCase().indexOf('/configurationpage?')==-1){pageCache[absUrl.split('?')[0]]=html;}}
var contentElem=currentSelf._parse(html,fileUrl);var content=$(contentElem);currentSelf._setLoadedTitle(content,html);var dependencies=contentElem.getAttribute('data-require');dependencies=dependencies?dependencies.split(','):null;if(contentElem.classList.contains('type-interior')){dependencies=dependencies||[];addLegacyDependencies(dependencies,absUrl);}
require(dependencies,function(){currentSelf._include(contentElem,content,settings);deferred.resolve(absUrl,settings,content);});};};self._loadDefaults={type:"get",data:undefined,reloadPage:false,reload:false,role:undefined};self.load=function(url,options){var deferred=(options&&options.deferred)||$.Deferred(),settings=$.extend({},self._loadDefaults,options),absUrl=$.mobile.path.makeUrlAbsolute(url,self._findBaseWithDefault());var content=self._find(absUrl);if(content.length===0&&$.mobile.path.isEmbeddedPage(absUrl)&&!$.mobile.path.isFirstPageUrl(absUrl)){deferred.reject(absUrl,settings);return deferred.promise();}
if(content.length&&!settings.reload){self._enhance(content,settings.role);deferred.resolve(absUrl,settings,content);return deferred.promise();}
var successFn=self._loadSuccess(absUrl,settings,deferred);var cachedResult=pageCache[absUrl.split('?')[0]];if(cachedResult){successFn(cachedResult,true);return deferred.promise();}
var xhr=new XMLHttpRequest();xhr.open('GET',absUrl,true);xhr.onload=function(e){successFn(this.response);};xhr.send();return deferred.promise();};self._triggerCssTransitionEvents=function(to,from,prefix){prefix=prefix||"";if(from){self._triggerWithDeprecated(prefix+"hide",{nextPage:to,toPage:to,prevPage:from,samePage:to[0]===from[0]},from);}
if(!prefix&&browserInfo.msie){setTimeout(function(){self._triggerWithDeprecated(prefix+"show",{prevPage:from||$(""),toPage:to},to);},50);}else{self._triggerWithDeprecated(prefix+"show",{prevPage:from||$(""),toPage:to},to);}};self._cssTransition=function(to,from,options){self._triggerCssTransitionEvents(to,from,"before");if(from){from[0].style.display='none';var pages=self.element[0].childNodes;for(var i=0,length=pages.length;i<length;i++){var pg=pages[i];if(pg.getAttribute&&pg.getAttribute('data-role')=='page'){pg.style.display='none';}}}
var toPage=to[0];toPage.style.display='block';self._triggerCssTransitionEvents(to,from);};self.change=function(to,options){var settings=$.extend({},$.mobile.changePage.defaults,options),triggerData={};settings.fromPage=settings.fromPage||self.activePage;triggerData.prevPage=self.activePage;$.extend(triggerData,{toPage:to,options:settings});if($.type(to)==="string"){triggerData.absUrl=$.mobile.path.makeUrlAbsolute(to,self._findBaseWithDefault());settings.target=to;settings.deferred=$.Deferred();self.load(to,settings);settings.deferred.then($.proxy(function(url,options,content){options.absUrl=triggerData.absUrl;self.transition(content,triggerData,options);},self));}else{triggerData.absUrl=settings.absUrl;self.transition(to,triggerData,settings);}};self.transition=function(toPage,triggerData,settings){var fromPage,url,pageUrl,fileUrl,active,historyDir,pageTitle,alreadyThere,newPageTitle,params;triggerData.prevPage=settings.fromPage;if(toPage[0]===$.mobile.firstPage[0]&&!settings.dataUrl){settings.dataUrl=$.mobile.path.documentUrl.hrefNoHash;}
fromPage=settings.fromPage;url=(settings.dataUrl&&$.mobile.path.convertUrlToDataUrl(settings.dataUrl))||toPage.data("url");pageUrl=url;fileUrl=url;active=$.mobile.navigate.history.getActive();historyDir=0;pageTitle=document.title;if(fromPage&&fromPage[0]===toPage[0]){self._triggerWithDeprecated("transition",triggerData);self._triggerWithDeprecated("change",triggerData);if(settings.fromHashChange){$.mobile.navigate.history.direct({url:url});}
return;}
new jqmPage(toPage[0]);if(settings.fromHashChange){historyDir=settings.direction==="back"?-1:1;}
alreadyThere=false;newPageTitle=(!active)?pageTitle:toPage.data("title");if(!!newPageTitle&&pageTitle===document.title){pageTitle=newPageTitle;}
if(!toPage.data("title")){toPage.data("title",pageTitle);}
if(!historyDir&&alreadyThere){$.mobile.navigate.history.getActive().pageUrl=pageUrl;}
if(url&&!settings.fromHashChange){if(!$.mobile.path.isPath(url)&&url.indexOf("#")<0){url="#"+url;}
params={title:pageTitle,pageUrl:pageUrl,role:settings.role};$.mobile.navigate(encodeURI(url),params,true);}
document.title=pageTitle;$.mobile.activePage=toPage;self.activePage=toPage;settings.reverse=settings.reverse||historyDir<0;self._cssTransition(toPage,fromPage,{transition:settings.transition,reverse:settings.reverse});};self._findBaseWithDefault=function(){var closestBase=(self.activePage&&$.mobile.getClosestBaseUrl(self.activePage[0]));return closestBase||$.mobile.path.documentBase.hrefNoHash;};}
$.mobile.pageContainerBuilder=pageContainer;})(jQuery);(function($,undefined){var
documentUrl=$.mobile.path.documentUrl;$.mobile.changePage=function(to,options){$.mobile.pageContainer.change(to,options);};$.mobile.changePage.defaults={reverse:false,changeHash:true,fromHashChange:false,role:undefined,duplicateCachedPage:undefined,pageContainer:undefined,dataUrl:undefined,fromPage:undefined};function parentWithTag(elem,tagName){while(elem.tagName!=tagName){elem=elem.parentNode;if(!elem){return null;}}
return elem;}
$.mobile._registerInternalEvents=function(){document.addEventListener("click",function(event){var link=parentWithTag(event.target,'A');var $link=$(link);if(!link||event.which>1){return;}
if(link.getAttribute('data-rel')=='back'){$.mobile.pageContainer.back();return false;}
var baseUrl=$.mobile.getClosestBaseUrl(link);var href=$.mobile.path.makeUrlAbsolute(link.getAttribute("href")||"#",baseUrl);if(href.search("#")!==-1&&!($.mobile.path.isExternal(href)&&$.mobile.path.isAbsoluteUrl(href))){href=href.replace(/[^#]*#/,"");if(!href){event.preventDefault();return;}else if($.mobile.path.isPath(href)){href=$.mobile.path.makeUrlAbsolute(href,baseUrl);}else{href=$.mobile.path.makeUrlAbsolute("#"+href,documentUrl.hrefNoHash);}}
if(link.getAttribute("rel")=="external"||link.getAttribute("data-ajax")=="false"||link.getAttribute('target')||($.mobile.path.isExternal(href))){return;}
var reverse=$link.data("direction")==="reverse";var role=link.getAttribute("data-rel")||undefined;$.mobile.changePage(href,{reverse:reverse,role:role,link:$link});event.preventDefault();});function removePage(page){page.parentNode.removeChild(page);}
function cleanPages(newPage){var pages=document.querySelectorAll("div[data-role='page']");if(pages.length<5){}
for(var i=0,length=pages.length;i<length;i++){var page=pages[i];if(page!=newPage){removePage(page);}}}
document.addEventListener("pagehide",function(e){var data=e.detail.data;var toPage=data.toPage?data.toPage[0]:null;if(toPage){if(toPage.getAttribute('data-dom-cache')){cleanPages(toPage);}
else if((toPage.getAttribute('data-url')||'').toLowerCase().indexOf('/configurationpage')!=-1){cleanPages(toPage);}}});};})(jQuery);jQuery.mobile.initializePage=function(){var path=$.mobile.path,firstPage=document.querySelector("div[data-role='page']"),hash=path.stripHash(path.stripQueryParams(path.parseLocation().hash)),theLocation=$.mobile.path.parseLocation(),hashPage=hash?document.getElementById(hash):undefined;if(firstPage){if(!firstPage.getAttribute("data-url")){firstPage.setAttribute("data-url",firstPage.getAttribute("id")||path.convertUrlToDataUrl(theLocation.pathname+theLocation.search));}}
$.mobile.firstPage=$(firstPage);$.mobile.pageContainer=new $.mobile.pageContainerBuilder($.mobile.firstPage.parent().addClass("ui-mobile-viewport"));$.mobile._registerInternalEvents();if(!($.mobile.path.isHashValid(location.hash)&&($(hashPage).is("[data-role='page']")||$.mobile.path.isPath(hash)))){$.mobile.navigate.navigator.squash(path.parseLocation().href);$.mobile.changePage($.mobile.firstPage,{reverse:true,changeHash:false,fromHashChange:true});}else{$.mobile.navigate.history.stack=[];$.mobile.navigate($.mobile.path.isPath(location.hash)?location.hash:location.href);}};jQuery.fn.selectmenu=function(){return this;};}));