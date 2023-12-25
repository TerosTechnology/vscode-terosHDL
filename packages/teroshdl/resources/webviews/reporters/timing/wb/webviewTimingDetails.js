var J=function(){if(typeof globalThis<"u")return globalThis;if(typeof global<"u")return global;if(typeof self<"u")return self;if(typeof window<"u")return window;try{return new Function("return this")()}catch{return{}}}();J.trustedTypes===void 0&&(J.trustedTypes={createPolicy:(o,e)=>e});var Go={configurable:!1,enumerable:!1,writable:!1};J.FAST===void 0&&Reflect.defineProperty(J,"FAST",Object.assign({value:Object.create(null)},Go));var pe=J.FAST;if(pe.getById===void 0){let o=Object.create(null);Reflect.defineProperty(pe,"getById",Object.assign({value(e,t){let r=o[e];return r===void 0&&(r=t?o[e]=t():null),r}},Go))}var H=Object.freeze([]);function Ke(){let o=new WeakMap;return function(e){let t=o.get(e);if(t===void 0){let r=Reflect.getPrototypeOf(e);for(;t===void 0&&r!==null;)t=o.get(r),r=Reflect.getPrototypeOf(r);t=t===void 0?[]:t.slice(0),o.set(e,t)}return t}}var Rt=J.FAST.getById(1,()=>{let o=[],e=[];function t(){if(e.length)throw e.shift()}function r(s){try{s.call()}catch(a){e.push(a),setTimeout(t,0)}}function n(){let a=0;for(;a<o.length;)if(r(o[a]),a++,a>1024){for(let l=0,c=o.length-a;l<c;l++)o[l]=o[l+a];o.length-=a,a=0}o.length=0}function i(s){o.length<1&&J.requestAnimationFrame(n),o.push(s)}return Object.freeze({enqueue:i,process:n})}),Wo=J.trustedTypes.createPolicy("fast-html",{createHTML:o=>o}),Ft=Wo,Ve=`fast-${Math.random().toString(36).substring(2,8)}`,It=`${Ve}{`,et=`}${Ve}`,g=Object.freeze({supportsAdoptedStyleSheets:Array.isArray(document.adoptedStyleSheets)&&"replace"in CSSStyleSheet.prototype,setHTMLPolicy(o){if(Ft!==Wo)throw new Error("The HTML policy can only be set once.");Ft=o},createHTML(o){return Ft.createHTML(o)},isMarker(o){return o&&o.nodeType===8&&o.data.startsWith(Ve)},extractDirectiveIndexFromMarker(o){return parseInt(o.data.replace(`${Ve}:`,""))},createInterpolationPlaceholder(o){return`${It}${o}${et}`},createCustomAttributePlaceholder(o,e){return`${o}="${this.createInterpolationPlaceholder(e)}"`},createBlockPlaceholder(o){return`<!--${Ve}:${o}-->`},queueUpdate:Rt.enqueue,processUpdates:Rt.process,nextUpdate(){return new Promise(Rt.enqueue)},setAttribute(o,e,t){t==null?o.removeAttribute(e):o.setAttribute(e,t)},setBooleanAttribute(o,e,t){t?o.setAttribute(e,""):o.removeAttribute(e)},removeChildNodes(o){for(let e=o.firstChild;e!==null;e=o.firstChild)o.removeChild(e)},createTemplateWalker(o){return document.createTreeWalker(o,133,null,!1)}});var ne=class{constructor(e,t){this.sub1=void 0,this.sub2=void 0,this.spillover=void 0,this.source=e,this.sub1=t}has(e){return this.spillover===void 0?this.sub1===e||this.sub2===e:this.spillover.indexOf(e)!==-1}subscribe(e){let t=this.spillover;if(t===void 0){if(this.has(e))return;if(this.sub1===void 0){this.sub1=e;return}if(this.sub2===void 0){this.sub2=e;return}this.spillover=[this.sub1,this.sub2,e],this.sub1=void 0,this.sub2=void 0}else t.indexOf(e)===-1&&t.push(e)}unsubscribe(e){let t=this.spillover;if(t===void 0)this.sub1===e?this.sub1=void 0:this.sub2===e&&(this.sub2=void 0);else{let r=t.indexOf(e);r!==-1&&t.splice(r,1)}}notify(e){let t=this.spillover,r=this.source;if(t===void 0){let n=this.sub1,i=this.sub2;n!==void 0&&n.handleChange(r,e),i!==void 0&&i.handleChange(r,e)}else for(let n=0,i=t.length;n<i;++n)t[n].handleChange(r,e)}},$e=class{constructor(e){this.subscribers={},this.sourceSubscribers=null,this.source=e}notify(e){var t;let r=this.subscribers[e];r!==void 0&&r.notify(e),(t=this.sourceSubscribers)===null||t===void 0||t.notify(e)}subscribe(e,t){var r;if(t){let n=this.subscribers[t];n===void 0&&(this.subscribers[t]=n=new ne(this.source)),n.subscribe(e)}else this.sourceSubscribers=(r=this.sourceSubscribers)!==null&&r!==void 0?r:new ne(this.source),this.sourceSubscribers.subscribe(e)}unsubscribe(e,t){var r;if(t){let n=this.subscribers[t];n!==void 0&&n.unsubscribe(e)}else(r=this.sourceSubscribers)===null||r===void 0||r.unsubscribe(e)}};var v=pe.getById(2,()=>{let o=/(:|&&|\|\||if)/,e=new WeakMap,t=g.queueUpdate,r,n=c=>{throw new Error("Must call enableArrayObservation before observing arrays.")};function i(c){let d=c.$fastController||e.get(c);return d===void 0&&(Array.isArray(c)?d=n(c):e.set(c,d=new $e(c))),d}let s=Ke();class a{constructor(d){this.name=d,this.field=`_${d}`,this.callback=`${d}Changed`}getValue(d){return r!==void 0&&r.watch(d,this.name),d[this.field]}setValue(d,h){let m=this.field,$=d[m];if($!==h){d[m]=h;let C=d[this.callback];typeof C=="function"&&C.call(d,$,h),i(d).notify(this.name)}}}class l extends ne{constructor(d,h,m=!1){super(d,h),this.binding=d,this.isVolatileBinding=m,this.needsRefresh=!0,this.needsQueue=!0,this.first=this,this.last=null,this.propertySource=void 0,this.propertyName=void 0,this.notifier=void 0,this.next=void 0}observe(d,h){this.needsRefresh&&this.last!==null&&this.disconnect();let m=r;r=this.needsRefresh?this:void 0,this.needsRefresh=this.isVolatileBinding;let $=this.binding(d,h);return r=m,$}disconnect(){if(this.last!==null){let d=this.first;for(;d!==void 0;)d.notifier.unsubscribe(this,d.propertyName),d=d.next;this.last=null,this.needsRefresh=this.needsQueue=!0}}watch(d,h){let m=this.last,$=i(d),C=m===null?this.first:{};if(C.propertySource=d,C.propertyName=h,C.notifier=$,$.subscribe(this,h),m!==null){if(!this.needsRefresh){let I;r=void 0,I=m.propertySource[m.propertyName],r=this,d===I&&(this.needsRefresh=!0)}m.next=C}this.last=C}handleChange(){this.needsQueue&&(this.needsQueue=!1,t(this))}call(){this.last!==null&&(this.needsQueue=!0,this.notify(this))}records(){let d=this.first;return{next:()=>{let h=d;return h===void 0?{value:void 0,done:!0}:(d=d.next,{value:h,done:!1})},[Symbol.iterator]:function(){return this}}}}return Object.freeze({setArrayObserverFactory(c){n=c},getNotifier:i,track(c,d){r!==void 0&&r.watch(c,d)},trackVolatile(){r!==void 0&&(r.needsRefresh=!0)},notify(c,d){i(c).notify(d)},defineProperty(c,d){typeof d=="string"&&(d=new a(d)),s(c).push(d),Reflect.defineProperty(c,d.name,{enumerable:!0,get:function(){return d.getValue(this)},set:function(h){d.setValue(this,h)}})},getAccessors:s,binding(c,d,h=this.isVolatileBinding(c)){return new l(c,d,h)},isVolatileBinding(c){return o.test(c.toString())}})});function b(o,e){v.defineProperty(o,e)}var Qo=pe.getById(3,()=>{let o=null;return{get(){return o},set(e){o=e}}}),ie=class{constructor(){this.index=0,this.length=0,this.parent=null,this.parentContext=null}get event(){return Qo.get()}get isEven(){return this.index%2===0}get isOdd(){return this.index%2!==0}get isFirst(){return this.index===0}get isInMiddle(){return!this.isFirst&&!this.isLast}get isLast(){return this.index===this.length-1}static setEvent(e){Qo.set(e)}};v.defineProperty(ie.prototype,"index");v.defineProperty(ie.prototype,"length");var se=Object.seal(new ie);var ae=class{constructor(){this.targetIndex=0}},Te=class extends ae{constructor(){super(...arguments),this.createPlaceholder=g.createInterpolationPlaceholder}},le=class extends ae{constructor(e,t,r){super(),this.name=e,this.behavior=t,this.options=r}createPlaceholder(e){return g.createCustomAttributePlaceholder(this.name,e)}createBehavior(e){return new this.behavior(e,this.options)}};function _n(o,e){this.source=o,this.context=e,this.bindingObserver===null&&(this.bindingObserver=v.binding(this.binding,this,this.isBindingVolatile)),this.updateTarget(this.bindingObserver.observe(o,e))}function Ln(o,e){this.source=o,this.context=e,this.target.addEventListener(this.targetName,this)}function Mn(){this.bindingObserver.disconnect(),this.source=null,this.context=null}function Vn(){this.bindingObserver.disconnect(),this.source=null,this.context=null;let o=this.target.$fastView;o!==void 0&&o.isComposed&&(o.unbind(),o.needsBindOnly=!0)}function Hn(){this.target.removeEventListener(this.targetName,this),this.source=null,this.context=null}function Nn(o){g.setAttribute(this.target,this.targetName,o)}function jn(o){g.setBooleanAttribute(this.target,this.targetName,o)}function Un(o){if(o==null&&(o=""),o.create){this.target.textContent="";let e=this.target.$fastView;e===void 0?e=o.create():this.target.$fastTemplate!==o&&(e.isComposed&&(e.remove(),e.unbind()),e=o.create()),e.isComposed?e.needsBindOnly&&(e.needsBindOnly=!1,e.bind(this.source,this.context)):(e.isComposed=!0,e.bind(this.source,this.context),e.insertBefore(this.target),this.target.$fastView=e,this.target.$fastTemplate=o)}else{let e=this.target.$fastView;e!==void 0&&e.isComposed&&(e.isComposed=!1,e.remove(),e.needsBindOnly?e.needsBindOnly=!1:e.unbind()),this.target.textContent=o}}function zn(o){this.target[this.targetName]=o}function qn(o){let e=this.classVersions||Object.create(null),t=this.target,r=this.version||0;if(o!=null&&o.length){let n=o.split(/\s+/);for(let i=0,s=n.length;i<s;++i){let a=n[i];a!==""&&(e[a]=r,t.classList.add(a))}}if(this.classVersions=e,this.version=r+1,r!==0){r-=1;for(let n in e)e[n]===r&&t.classList.remove(n)}}var fe=class extends Te{constructor(e){super(),this.binding=e,this.bind=_n,this.unbind=Mn,this.updateTarget=Nn,this.isBindingVolatile=v.isVolatileBinding(this.binding)}get targetName(){return this.originalTargetName}set targetName(e){if(this.originalTargetName=e,e!==void 0)switch(e[0]){case":":if(this.cleanedTargetName=e.substr(1),this.updateTarget=zn,this.cleanedTargetName==="innerHTML"){let t=this.binding;this.binding=(r,n)=>g.createHTML(t(r,n))}break;case"?":this.cleanedTargetName=e.substr(1),this.updateTarget=jn;break;case"@":this.cleanedTargetName=e.substr(1),this.bind=Ln,this.unbind=Hn;break;default:this.cleanedTargetName=e,e==="class"&&(this.updateTarget=qn);break}}targetAtContent(){this.updateTarget=Un,this.unbind=Vn}createBehavior(e){return new At(e,this.binding,this.isBindingVolatile,this.bind,this.unbind,this.updateTarget,this.cleanedTargetName)}},At=class{constructor(e,t,r,n,i,s,a){this.source=null,this.context=null,this.bindingObserver=null,this.target=e,this.binding=t,this.isBindingVolatile=r,this.bind=n,this.unbind=i,this.updateTarget=s,this.targetName=a}handleChange(){this.updateTarget(this.bindingObserver.observe(this.source,this.context))}handleEvent(e){ie.setEvent(e);let t=this.binding(this.source,this.context);ie.setEvent(null),t!==!0&&e.preventDefault()}};var Bt=null,He=class{addFactory(e){e.targetIndex=this.targetIndex,this.behaviorFactories.push(e)}captureContentBinding(e){e.targetAtContent(),this.addFactory(e)}reset(){this.behaviorFactories=[],this.targetIndex=-1}release(){Bt=this}static borrow(e){let t=Bt||new He;return t.directives=e,t.reset(),Bt=null,t}};function Gn(o){if(o.length===1)return o[0];let e,t=o.length,r=o.map(s=>typeof s=="string"?()=>s:(e=s.targetName||e,s.binding)),n=(s,a)=>{let l="";for(let c=0;c<t;++c)l+=r[c](s,a);return l},i=new fe(n);return i.targetName=e,i}var Wn=et.length;function Xo(o,e){let t=e.split(It);if(t.length===1)return null;let r=[];for(let n=0,i=t.length;n<i;++n){let s=t[n],a=s.indexOf(et),l;if(a===-1)l=s;else{let c=parseInt(s.substring(0,a));r.push(o.directives[c]),l=s.substring(a+Wn)}l!==""&&r.push(l)}return r}function Zo(o,e,t=!1){let r=e.attributes;for(let n=0,i=r.length;n<i;++n){let s=r[n],a=s.value,l=Xo(o,a),c=null;l===null?t&&(c=new fe(()=>a),c.targetName=s.name):c=Gn(l),c!==null&&(e.removeAttributeNode(s),n--,i--,o.addFactory(c))}}function Qn(o,e,t){let r=Xo(o,e.textContent);if(r!==null){let n=e;for(let i=0,s=r.length;i<s;++i){let a=r[i],l=i===0?e:n.parentNode.insertBefore(document.createTextNode(""),n.nextSibling);typeof a=="string"?l.textContent=a:(l.textContent=" ",o.captureContentBinding(a)),n=l,o.targetIndex++,l!==e&&t.nextNode()}o.targetIndex--}}function Jo(o,e){let t=o.content;document.adoptNode(t);let r=He.borrow(e);Zo(r,o,!0);let n=r.behaviorFactories;r.reset();let i=g.createTemplateWalker(t),s;for(;s=i.nextNode();)switch(r.targetIndex++,s.nodeType){case 1:Zo(r,s);break;case 3:Qn(r,s,i);break;case 8:g.isMarker(s)&&r.addFactory(e[g.extractDirectiveIndexFromMarker(s)])}let a=0;(g.isMarker(t.firstChild)||t.childNodes.length===1&&e.length)&&(t.insertBefore(document.createComment(""),t.firstChild),a=-1);let l=r.behaviorFactories;return r.release(),{fragment:t,viewBehaviorFactories:l,hostBehaviorFactories:n,targetOffset:a}}var _t=document.createRange(),Se=class{constructor(e,t){this.fragment=e,this.behaviors=t,this.source=null,this.context=null,this.firstChild=e.firstChild,this.lastChild=e.lastChild}appendTo(e){e.appendChild(this.fragment)}insertBefore(e){if(this.fragment.hasChildNodes())e.parentNode.insertBefore(this.fragment,e);else{let t=this.lastChild;if(e.previousSibling===t)return;let r=e.parentNode,n=this.firstChild,i;for(;n!==t;)i=n.nextSibling,r.insertBefore(n,e),n=i;r.insertBefore(t,e)}}remove(){let e=this.fragment,t=this.lastChild,r=this.firstChild,n;for(;r!==t;)n=r.nextSibling,e.appendChild(r),r=n;e.appendChild(t)}dispose(){let e=this.firstChild.parentNode,t=this.lastChild,r=this.firstChild,n;for(;r!==t;)n=r.nextSibling,e.removeChild(r),r=n;e.removeChild(t);let i=this.behaviors,s=this.source;for(let a=0,l=i.length;a<l;++a)i[a].unbind(s)}bind(e,t){let r=this.behaviors;if(this.source!==e)if(this.source!==null){let n=this.source;this.source=e,this.context=t;for(let i=0,s=r.length;i<s;++i){let a=r[i];a.unbind(n),a.bind(e,t)}}else{this.source=e,this.context=t;for(let n=0,i=r.length;n<i;++n)r[n].bind(e,t)}}unbind(){if(this.source===null)return;let e=this.behaviors,t=this.source;for(let r=0,n=e.length;r<n;++r)e[r].unbind(t);this.source=null}static disposeContiguousBatch(e){if(e.length!==0){_t.setStartBefore(e[0].firstChild),_t.setEndAfter(e[e.length-1].lastChild),_t.deleteContents();for(let t=0,r=e.length;t<r;++t){let n=e[t],i=n.behaviors,s=n.source;for(let a=0,l=i.length;a<l;++a)i[a].unbind(s)}}}};var tt=class{constructor(e,t){this.behaviorCount=0,this.hasHostBehaviors=!1,this.fragment=null,this.targetOffset=0,this.viewBehaviorFactories=null,this.hostBehaviorFactories=null,this.html=e,this.directives=t}create(e){if(this.fragment===null){let c,d=this.html;if(typeof d=="string"){c=document.createElement("template"),c.innerHTML=g.createHTML(d);let m=c.content.firstElementChild;m!==null&&m.tagName==="TEMPLATE"&&(c=m)}else c=d;let h=Jo(c,this.directives);this.fragment=h.fragment,this.viewBehaviorFactories=h.viewBehaviorFactories,this.hostBehaviorFactories=h.hostBehaviorFactories,this.targetOffset=h.targetOffset,this.behaviorCount=this.viewBehaviorFactories.length+this.hostBehaviorFactories.length,this.hasHostBehaviors=this.hostBehaviorFactories.length>0}let t=this.fragment.cloneNode(!0),r=this.viewBehaviorFactories,n=new Array(this.behaviorCount),i=g.createTemplateWalker(t),s=0,a=this.targetOffset,l=i.nextNode();for(let c=r.length;s<c;++s){let d=r[s],h=d.targetIndex;for(;l!==null;)if(a===h){n[s]=d.createBehavior(l);break}else l=i.nextNode(),a++}if(this.hasHostBehaviors){let c=this.hostBehaviorFactories;for(let d=0,h=c.length;d<h;++d,++s)n[s]=c[d].createBehavior(e)}return new Se(t,n)}render(e,t,r){typeof t=="string"&&(t=document.getElementById(t)),r===void 0&&(r=t);let n=this.create(r);return n.bind(e,se),n.appendTo(t),n}},Zn=/([ \x09\x0a\x0c\x0d])([^\0-\x1F\x7F-\x9F "'>=/]+)([ \x09\x0a\x0c\x0d]*=[ \x09\x0a\x0c\x0d]*(?:[^ \x09\x0a\x0c\x0d"'`<>=]*|"[^"]*|'[^']*))$/;function x(o,...e){let t=[],r="";for(let n=0,i=o.length-1;n<i;++n){let s=o[n],a=e[n];if(r+=s,a instanceof tt){let l=a;a=()=>l}if(typeof a=="function"&&(a=new fe(a)),a instanceof Te){let l=Zn.exec(s);l!==null&&(a.targetName=l[2])}a instanceof ae?(r+=a.createPlaceholder(t.length),t.push(a)):r+=a}return r+=o[o.length-1],new tt(r,t)}var D=class{constructor(){this.targets=new WeakSet}addStylesTo(e){this.targets.add(e)}removeStylesFrom(e){this.targets.delete(e)}isAttachedTo(e){return this.targets.has(e)}withBehaviors(...e){return this.behaviors=this.behaviors===null?e:this.behaviors.concat(e),this}};D.create=(()=>{if(g.supportsAdoptedStyleSheets){let o=new Map;return e=>new Lt(e,o)}return o=>new Mt(o)})();function Vt(o){return o.map(e=>e instanceof D?Vt(e.styles):[e]).reduce((e,t)=>e.concat(t),[])}function Yo(o){return o.map(e=>e instanceof D?e.behaviors:null).reduce((e,t)=>t===null?e:(e===null&&(e=[]),e.concat(t)),null)}var Ko=(o,e)=>{o.adoptedStyleSheets=[...o.adoptedStyleSheets,...e]},er=(o,e)=>{o.adoptedStyleSheets=o.adoptedStyleSheets.filter(t=>e.indexOf(t)===-1)};if(g.supportsAdoptedStyleSheets)try{document.adoptedStyleSheets.push(),document.adoptedStyleSheets.splice(),Ko=(o,e)=>{o.adoptedStyleSheets.push(...e)},er=(o,e)=>{for(let t of e){let r=o.adoptedStyleSheets.indexOf(t);r!==-1&&o.adoptedStyleSheets.splice(r,1)}}}catch{}var Lt=class extends D{constructor(e,t){super(),this.styles=e,this.styleSheetCache=t,this._styleSheets=void 0,this.behaviors=Yo(e)}get styleSheets(){if(this._styleSheets===void 0){let e=this.styles,t=this.styleSheetCache;this._styleSheets=Vt(e).map(r=>{if(r instanceof CSSStyleSheet)return r;let n=t.get(r);return n===void 0&&(n=new CSSStyleSheet,n.replaceSync(r),t.set(r,n)),n})}return this._styleSheets}addStylesTo(e){Ko(e,this.styleSheets),super.addStylesTo(e)}removeStylesFrom(e){er(e,this.styleSheets),super.removeStylesFrom(e)}},Xn=0;function Jn(){return`fast-style-class-${++Xn}`}var Mt=class extends D{constructor(e){super(),this.styles=e,this.behaviors=null,this.behaviors=Yo(e),this.styleSheets=Vt(e),this.styleClass=Jn()}addStylesTo(e){let t=this.styleSheets,r=this.styleClass;e=this.normalizeTarget(e);for(let n=0;n<t.length;n++){let i=document.createElement("style");i.innerHTML=t[n],i.className=r,e.append(i)}super.addStylesTo(e)}removeStylesFrom(e){e=this.normalizeTarget(e);let t=e.querySelectorAll(`.${this.styleClass}`);for(let r=0,n=t.length;r<n;++r)e.removeChild(t[r]);super.removeStylesFrom(e)}isAttachedTo(e){return super.isAttachedTo(this.normalizeTarget(e))}normalizeTarget(e){return e===document?document.body:e}};var Ne=Object.freeze({locate:Ke()}),tr={toView(o){return o?"true":"false"},fromView(o){return!(o==null||o==="false"||o===!1||o===0)}},ot={toView(o){if(o==null)return null;let e=o*1;return isNaN(e)?null:e.toString()},fromView(o){if(o==null)return null;let e=o*1;return isNaN(e)?null:e}},me=class{constructor(e,t,r=t.toLowerCase(),n="reflect",i){this.guards=new Set,this.Owner=e,this.name=t,this.attribute=r,this.mode=n,this.converter=i,this.fieldName=`_${t}`,this.callbackName=`${t}Changed`,this.hasCallback=this.callbackName in e.prototype,n==="boolean"&&i===void 0&&(this.converter=tr)}setValue(e,t){let r=e[this.fieldName],n=this.converter;n!==void 0&&(t=n.fromView(t)),r!==t&&(e[this.fieldName]=t,this.tryReflectToAttribute(e),this.hasCallback&&e[this.callbackName](r,t),e.$fastController.notify(this.name))}getValue(e){return v.track(e,this.name),e[this.fieldName]}onAttributeChangedCallback(e,t){this.guards.has(e)||(this.guards.add(e),this.setValue(e,t),this.guards.delete(e))}tryReflectToAttribute(e){let t=this.mode,r=this.guards;r.has(e)||t==="fromView"||g.queueUpdate(()=>{r.add(e);let n=e[this.fieldName];switch(t){case"reflect":let i=this.converter;g.setAttribute(e,this.attribute,i!==void 0?i.toView(n):n);break;case"boolean":g.setBooleanAttribute(e,this.attribute,n);break}r.delete(e)})}static collect(e,...t){let r=[];t.push(Ne.locate(e));for(let n=0,i=t.length;n<i;++n){let s=t[n];if(s!==void 0)for(let a=0,l=s.length;a<l;++a){let c=s[a];typeof c=="string"?r.push(new me(e,c)):r.push(new me(e,c.property,c.attribute,c.mode,c.converter))}}return r}};function p(o,e){let t;function r(n,i){arguments.length>1&&(t.property=i),Ne.locate(n.constructor).push(t)}if(arguments.length>1){t={},r(o,e);return}return t=o===void 0?{}:o,r}var or={mode:"open"},rr={},Ht=pe.getById(4,()=>{let o=new Map;return Object.freeze({register(e){return o.has(e.type)?!1:(o.set(e.type,e),!0)},getByType(e){return o.get(e)}})}),G=class{constructor(e,t=e.definition){typeof t=="string"&&(t={name:t}),this.type=e,this.name=t.name,this.template=t.template;let r=me.collect(e,t.attributes),n=new Array(r.length),i={},s={};for(let a=0,l=r.length;a<l;++a){let c=r[a];n[a]=c.attribute,i[c.name]=c,s[c.attribute]=c}this.attributes=r,this.observedAttributes=n,this.propertyLookup=i,this.attributeLookup=s,this.shadowOptions=t.shadowOptions===void 0?or:t.shadowOptions===null?void 0:Object.assign(Object.assign({},or),t.shadowOptions),this.elementOptions=t.elementOptions===void 0?rr:Object.assign(Object.assign({},rr),t.elementOptions),this.styles=t.styles===void 0?void 0:Array.isArray(t.styles)?D.create(t.styles):t.styles instanceof D?t.styles:D.create([t.styles])}get isDefined(){return!!Ht.getByType(this.type)}define(e=customElements){let t=this.type;if(Ht.register(this)){let r=this.attributes,n=t.prototype;for(let i=0,s=r.length;i<s;++i)v.defineProperty(n,r[i]);Reflect.defineProperty(t,"observedAttributes",{value:this.observedAttributes,enumerable:!0})}return e.get(this.name)||e.define(this.name,t,this.elementOptions),this}};G.forType=Ht.getByType;var nr=new WeakMap,Yn={bubbles:!0,composed:!0,cancelable:!0};function Nt(o){return o.shadowRoot||nr.get(o)||null}var De=class extends $e{constructor(e,t){super(e),this.boundObservables=null,this.behaviors=null,this.needsInitialization=!0,this._template=null,this._styles=null,this._isConnected=!1,this.$fastController=this,this.view=null,this.element=e,this.definition=t;let r=t.shadowOptions;if(r!==void 0){let i=e.attachShadow(r);r.mode==="closed"&&nr.set(e,i)}let n=v.getAccessors(e);if(n.length>0){let i=this.boundObservables=Object.create(null);for(let s=0,a=n.length;s<a;++s){let l=n[s].name,c=e[l];c!==void 0&&(delete e[l],i[l]=c)}}}get isConnected(){return v.track(this,"isConnected"),this._isConnected}setIsConnected(e){this._isConnected=e,v.notify(this,"isConnected")}get template(){return this._template}set template(e){this._template!==e&&(this._template=e,this.needsInitialization||this.renderTemplate(e))}get styles(){return this._styles}set styles(e){this._styles!==e&&(this._styles!==null&&this.removeStyles(this._styles),this._styles=e,!this.needsInitialization&&e!==null&&this.addStyles(e))}addStyles(e){let t=Nt(this.element)||this.element.getRootNode();if(e instanceof HTMLStyleElement)t.append(e);else if(!e.isAttachedTo(t)){let r=e.behaviors;e.addStylesTo(t),r!==null&&this.addBehaviors(r)}}removeStyles(e){let t=Nt(this.element)||this.element.getRootNode();if(e instanceof HTMLStyleElement)t.removeChild(e);else if(e.isAttachedTo(t)){let r=e.behaviors;e.removeStylesFrom(t),r!==null&&this.removeBehaviors(r)}}addBehaviors(e){let t=this.behaviors||(this.behaviors=new Map),r=e.length,n=[];for(let i=0;i<r;++i){let s=e[i];t.has(s)?t.set(s,t.get(s)+1):(t.set(s,1),n.push(s))}if(this._isConnected){let i=this.element;for(let s=0;s<n.length;++s)n[s].bind(i,se)}}removeBehaviors(e,t=!1){let r=this.behaviors;if(r===null)return;let n=e.length,i=[];for(let s=0;s<n;++s){let a=e[s];if(r.has(a)){let l=r.get(a)-1;l===0||t?r.delete(a)&&i.push(a):r.set(a,l)}}if(this._isConnected){let s=this.element;for(let a=0;a<i.length;++a)i[a].unbind(s)}}onConnectedCallback(){if(this._isConnected)return;let e=this.element;this.needsInitialization?this.finishInitialization():this.view!==null&&this.view.bind(e,se);let t=this.behaviors;if(t!==null)for(let[r]of t)r.bind(e,se);this.setIsConnected(!0)}onDisconnectedCallback(){if(!this._isConnected)return;this.setIsConnected(!1);let e=this.view;e!==null&&e.unbind();let t=this.behaviors;if(t!==null){let r=this.element;for(let[n]of t)n.unbind(r)}}onAttributeChangedCallback(e,t,r){let n=this.definition.attributeLookup[e];n!==void 0&&n.onAttributeChangedCallback(this.element,r)}emit(e,t,r){return this._isConnected?this.element.dispatchEvent(new CustomEvent(e,Object.assign(Object.assign({detail:t},Yn),r))):!1}finishInitialization(){let e=this.element,t=this.boundObservables;if(t!==null){let n=Object.keys(t);for(let i=0,s=n.length;i<s;++i){let a=n[i];e[a]=t[a]}this.boundObservables=null}let r=this.definition;this._template===null&&(this.element.resolveTemplate?this._template=this.element.resolveTemplate():r.template&&(this._template=r.template||null)),this._template!==null&&this.renderTemplate(this._template),this._styles===null&&(this.element.resolveStyles?this._styles=this.element.resolveStyles():r.styles&&(this._styles=r.styles||null)),this._styles!==null&&this.addStyles(this._styles),this.needsInitialization=!1}renderTemplate(e){let t=this.element,r=Nt(t)||t;this.view!==null?(this.view.dispose(),this.view=null):this.needsInitialization||g.removeChildNodes(r),e&&(this.view=e.render(t,r,t))}static forCustomElement(e){let t=e.$fastController;if(t!==void 0)return t;let r=G.forType(e.constructor);if(r===void 0)throw new Error("Missing FASTElement definition.");return e.$fastController=new De(e,r)}};function ir(o){return class extends o{constructor(){super(),De.forCustomElement(this)}$emit(e,t,r){return this.$fastController.emit(e,t,r)}connectedCallback(){this.$fastController.onConnectedCallback()}disconnectedCallback(){this.$fastController.onDisconnectedCallback()}attributeChangedCallback(e,t,r){this.$fastController.onAttributeChangedCallback(e,t,r)}}}var ce=Object.assign(ir(HTMLElement),{from(o){return ir(o)},define(o,e){return new G(o,e).define().type}});var ge=class{createCSS(){return""}createBehavior(){}};function Kn(o,e){let t=[],r="",n=[];for(let i=0,s=o.length-1;i<s;++i){r+=o[i];let a=e[i];if(a instanceof ge){let l=a.createBehavior();a=a.createCSS(),l&&n.push(l)}a instanceof D||a instanceof CSSStyleSheet?(r.trim()!==""&&(t.push(r),r=""),t.push(a)):r+=a}return r+=o[o.length-1],r.trim()!==""&&t.push(r),{styles:t,behaviors:n}}function E(o,...e){let{styles:t,behaviors:r}=Kn(o,e),n=D.create(t);return r.length&&n.withBehaviors(...r),n}function N(o,e,t){return{index:o,removed:e,addedCount:t}}var ar=0,lr=1,jt=2,Ut=3;function ei(o,e,t,r,n,i){let s=i-n+1,a=t-e+1,l=new Array(s),c,d;for(let h=0;h<s;++h)l[h]=new Array(a),l[h][0]=h;for(let h=0;h<a;++h)l[0][h]=h;for(let h=1;h<s;++h)for(let m=1;m<a;++m)o[e+m-1]===r[n+h-1]?l[h][m]=l[h-1][m-1]:(c=l[h-1][m]+1,d=l[h][m-1]+1,l[h][m]=c<d?c:d);return l}function ti(o){let e=o.length-1,t=o[0].length-1,r=o[e][t],n=[];for(;e>0||t>0;){if(e===0){n.push(jt),t--;continue}if(t===0){n.push(Ut),e--;continue}let i=o[e-1][t-1],s=o[e-1][t],a=o[e][t-1],l;s<a?l=s<i?s:i:l=a<i?a:i,l===i?(i===r?n.push(ar):(n.push(lr),r=i),e--,t--):l===s?(n.push(Ut),e--,r=s):(n.push(jt),t--,r=a)}return n.reverse(),n}function oi(o,e,t){for(let r=0;r<t;++r)if(o[r]!==e[r])return r;return t}function ri(o,e,t){let r=o.length,n=e.length,i=0;for(;i<t&&o[--r]===e[--n];)i++;return i}function ni(o,e,t,r){return e<t||r<o?-1:e===t||r===o?0:o<t?e<r?e-t:r-t:r<e?r-o:e-o}function zt(o,e,t,r,n,i){let s=0,a=0,l=Math.min(t-e,i-n);if(e===0&&n===0&&(s=oi(o,r,l)),t===o.length&&i===r.length&&(a=ri(o,r,l-s)),e+=s,n+=s,t-=a,i-=a,t-e===0&&i-n===0)return H;if(e===t){let C=N(e,[],0);for(;n<i;)C.removed.push(r[n++]);return[C]}else if(n===i)return[N(e,[],t-e)];let c=ti(ei(o,e,t,r,n,i)),d=[],h,m=e,$=n;for(let C=0;C<c.length;++C)switch(c[C]){case ar:h!==void 0&&(d.push(h),h=void 0),m++,$++;break;case lr:h===void 0&&(h=N(m,[],0)),h.addedCount++,m++,h.removed.push(r[$]),$++;break;case jt:h===void 0&&(h=N(m,[],0)),h.addedCount++,m++;break;case Ut:h===void 0&&(h=N(m,[],0)),h.removed.push(r[$]),$++;break}return h!==void 0&&d.push(h),d}var sr=Array.prototype.push;function ii(o,e,t,r){let n=N(e,t,r),i=!1,s=0;for(let a=0;a<o.length;a++){let l=o[a];if(l.index+=s,i)continue;let c=ni(n.index,n.index+n.removed.length,l.index,l.index+l.addedCount);if(c>=0){o.splice(a,1),a--,s-=l.addedCount-l.removed.length,n.addedCount+=l.addedCount-c;let d=n.removed.length+l.removed.length-c;if(!n.addedCount&&!d)i=!0;else{let h=l.removed;if(n.index<l.index){let m=n.removed.slice(0,l.index-n.index);sr.apply(m,h),h=m}if(n.index+n.removed.length>l.index+l.addedCount){let m=n.removed.slice(l.index+l.addedCount-n.index);sr.apply(h,m)}n.removed=h,l.index<n.index&&(n.index=l.index)}}else if(n.index<l.index){i=!0,o.splice(a,0,n),a++;let d=n.addedCount-n.removed.length;l.index+=d,s+=d}}i||o.push(n)}function si(o){let e=[];for(let t=0,r=o.length;t<r;t++){let n=o[t];ii(e,n.index,n.removed,n.addedCount)}return e}function cr(o,e){let t=[],r=si(e);for(let n=0,i=r.length;n<i;++n){let s=r[n];if(s.addedCount===1&&s.removed.length===1){s.removed[0]!==o[s.index]&&t.push(s);continue}t=t.concat(zt(o,s.index,s.index+s.addedCount,s.removed,0,s.removed.length))}return t}var dr=!1;function qt(o,e){let t=o.index,r=e.length;return t>r?t=r-o.addedCount:t<0&&(t=r+o.removed.length+t-o.addedCount),t<0&&(t=0),o.index=t,o}var Gt=class extends ne{constructor(e){super(e),this.oldCollection=void 0,this.splices=void 0,this.needsQueue=!0,this.call=this.flush,Reflect.defineProperty(e,"$fastController",{value:this,enumerable:!1})}subscribe(e){this.flush(),super.subscribe(e)}addSplice(e){this.splices===void 0?this.splices=[e]:this.splices.push(e),this.needsQueue&&(this.needsQueue=!1,g.queueUpdate(this))}reset(e){this.oldCollection=e,this.needsQueue&&(this.needsQueue=!1,g.queueUpdate(this))}flush(){let e=this.splices,t=this.oldCollection;if(e===void 0&&t===void 0)return;this.needsQueue=!0,this.splices=void 0,this.oldCollection=void 0;let r=t===void 0?cr(this.source,e):zt(this.source,0,this.source.length,t,0,t.length);this.notify(r)}};function ur(){if(dr)return;dr=!0,v.setArrayObserverFactory(l=>new Gt(l));let o=Array.prototype;if(o.$fastPatch)return;Reflect.defineProperty(o,"$fastPatch",{value:1,enumerable:!1});let e=o.pop,t=o.push,r=o.reverse,n=o.shift,i=o.sort,s=o.splice,a=o.unshift;o.pop=function(){let l=this.length>0,c=e.apply(this,arguments),d=this.$fastController;return d!==void 0&&l&&d.addSplice(N(this.length,[c],0)),c},o.push=function(){let l=t.apply(this,arguments),c=this.$fastController;return c!==void 0&&c.addSplice(qt(N(this.length-arguments.length,[],arguments.length),this)),l},o.reverse=function(){let l,c=this.$fastController;c!==void 0&&(c.flush(),l=this.slice());let d=r.apply(this,arguments);return c!==void 0&&c.reset(l),d},o.shift=function(){let l=this.length>0,c=n.apply(this,arguments),d=this.$fastController;return d!==void 0&&l&&d.addSplice(N(0,[c],0)),c},o.sort=function(){let l,c=this.$fastController;c!==void 0&&(c.flush(),l=this.slice());let d=i.apply(this,arguments);return c!==void 0&&c.reset(l),d},o.splice=function(){let l=s.apply(this,arguments),c=this.$fastController;return c!==void 0&&c.addSplice(qt(N(+arguments[0],l,arguments.length>2?arguments.length-2:0),this)),l},o.unshift=function(){let l=a.apply(this,arguments),c=this.$fastController;return c!==void 0&&c.addSplice(qt(N(0,[],arguments.length),this)),l}}var Wt=class{constructor(e,t){this.target=e,this.propertyName=t}bind(e){e[this.propertyName]=this.target}unbind(){}};function _(o){return new le("fast-ref",Wt,o)}var Zs=Object.freeze({positioning:!1,recycle:!0});function ai(o,e,t,r){o.bind(e[t],r)}function li(o,e,t,r){let n=Object.create(r);n.index=t,n.length=e.length,o.bind(e[t],n)}var Qt=class{constructor(e,t,r,n,i,s){this.location=e,this.itemsBinding=t,this.templateBinding=n,this.options=s,this.source=null,this.views=[],this.items=null,this.itemsObserver=null,this.originalContext=void 0,this.childContext=void 0,this.bindView=ai,this.itemsBindingObserver=v.binding(t,this,r),this.templateBindingObserver=v.binding(n,this,i),s.positioning&&(this.bindView=li)}bind(e,t){this.source=e,this.originalContext=t,this.childContext=Object.create(t),this.childContext.parent=e,this.childContext.parentContext=this.originalContext,this.items=this.itemsBindingObserver.observe(e,this.originalContext),this.template=this.templateBindingObserver.observe(e,this.originalContext),this.observeItems(!0),this.refreshAllViews()}unbind(){this.source=null,this.items=null,this.itemsObserver!==null&&this.itemsObserver.unsubscribe(this),this.unbindAllViews(),this.itemsBindingObserver.disconnect(),this.templateBindingObserver.disconnect()}handleChange(e,t){e===this.itemsBinding?(this.items=this.itemsBindingObserver.observe(this.source,this.originalContext),this.observeItems(),this.refreshAllViews()):e===this.templateBinding?(this.template=this.templateBindingObserver.observe(this.source,this.originalContext),this.refreshAllViews(!0)):this.updateViews(t)}observeItems(e=!1){if(!this.items){this.items=H;return}let t=this.itemsObserver,r=this.itemsObserver=v.getNotifier(this.items),n=t!==r;n&&t!==null&&t.unsubscribe(this),(n||e)&&r.subscribe(this)}updateViews(e){let t=this.childContext,r=this.views,n=this.bindView,i=this.items,s=this.template,a=this.options.recycle,l=[],c=0,d=0;for(let h=0,m=e.length;h<m;++h){let $=e[h],C=$.removed,I=0,q=$.index,Me=q+$.addedCount,re=r.splice($.index,C.length),An=d=l.length+re.length;for(;q<Me;++q){let qo=r[q],Bn=qo?qo.firstChild:this.location,ke;a&&d>0?(I<=An&&re.length>0?(ke=re[I],I++):(ke=l[c],c++),d--):ke=s.create(),r.splice(q,0,ke),n(ke,i,q,t),ke.insertBefore(Bn)}re[I]&&l.push(...re.slice(I))}for(let h=c,m=l.length;h<m;++h)l[h].dispose();if(this.options.positioning)for(let h=0,m=r.length;h<m;++h){let $=r[h].context;$.length=m,$.index=h}}refreshAllViews(e=!1){let t=this.items,r=this.childContext,n=this.template,i=this.location,s=this.bindView,a=t.length,l=this.views,c=l.length;if((a===0||e||!this.options.recycle)&&(Se.disposeContiguousBatch(l),c=0),c===0){this.views=l=new Array(a);for(let d=0;d<a;++d){let h=n.create();s(h,t,d,r),l[d]=h,h.insertBefore(i)}}else{let d=0;for(;d<a;++d)if(d<c){let m=l[d];s(m,t,d,r)}else{let m=n.create();s(m,t,d,r),l.push(m),m.insertBefore(i)}let h=l.splice(d,c-d);for(d=0,a=h.length;d<a;++d)h[d].dispose()}}unbindAllViews(){let e=this.views;for(let t=0,r=e.length;t<r;++t)e[t].unbind()}},Ee=class extends ae{constructor(e,t,r){super(),this.itemsBinding=e,this.templateBinding=t,this.options=r,this.createPlaceholder=g.createBlockPlaceholder,ur(),this.isItemsBindingVolatile=v.isVolatileBinding(e),this.isTemplateBindingVolatile=v.isVolatileBinding(t)}createBehavior(e){return new Qt(e,this.itemsBinding,this.isItemsBindingVolatile,this.templateBinding,this.isTemplateBindingVolatile,this.options)}};function je(o){return o?function(e,t,r){return e.nodeType===1&&e.matches(o)}:function(e,t,r){return e.nodeType===1}}var Oe=class{constructor(e,t){this.target=e,this.options=t,this.source=null}bind(e){let t=this.options.property;this.shouldUpdate=v.getAccessors(e).some(r=>r.name===t),this.source=e,this.updateTarget(this.computeNodes()),this.shouldUpdate&&this.observe()}unbind(){this.updateTarget(H),this.source=null,this.shouldUpdate&&this.disconnect()}handleEvent(){this.updateTarget(this.computeNodes())}computeNodes(){let e=this.getNodes();return this.options.filter!==void 0&&(e=e.filter(this.options.filter)),e}updateTarget(e){this.source[this.options.property]=e}};var Zt=class extends Oe{constructor(e,t){super(e,t)}observe(){this.target.addEventListener("slotchange",this)}disconnect(){this.target.removeEventListener("slotchange",this)}getNodes(){return this.target.assignedNodes(this.options)}};function de(o){return typeof o=="string"&&(o={property:o}),new le("fast-slotted",Zt,o)}var Xt=class extends Oe{constructor(e,t){super(e,t),this.observer=null,t.childList=!0}observe(){this.observer===null&&(this.observer=new MutationObserver(this.handleEvent.bind(this))),this.observer.observe(this.target,this.options)}disconnect(){this.observer.disconnect()}getNodes(){return"subtree"in this.options?Array.from(this.target.querySelectorAll(this.options.selector)):Array.from(this.target.childNodes)}};function rt(o){return typeof o=="string"&&(o={property:o}),new le("fast-children",Xt,o)}var ue=class{handleStartContentChange(){this.startContainer.classList.toggle("start",this.start.assignedNodes().length>0)}handleEndContentChange(){this.endContainer.classList.toggle("end",this.end.assignedNodes().length>0)}},Pe=(o,e)=>x`
    <span
        part="end"
        ${_("endContainer")}
        class=${t=>e.end?"end":void 0}
    >
        <slot name="end" ${_("end")} @slotchange="${t=>t.handleEndContentChange()}">
            ${e.end||""}
        </slot>
    </span>
`,Re=(o,e)=>x`
    <span
        part="start"
        ${_("startContainer")}
        class="${t=>e.start?"start":void 0}"
    >
        <slot
            name="start"
            ${_("start")}
            @slotchange="${t=>t.handleStartContentChange()}"
        >
            ${e.start||""}
        </slot>
    </span>
`,Ra=x`
    <span part="end" ${_("endContainer")}>
        <slot
            name="end"
            ${_("end")}
            @slotchange="${o=>o.handleEndContentChange()}"
        ></slot>
    </span>
`,Fa=x`
    <span part="start" ${_("startContainer")}>
        <slot
            name="start"
            ${_("start")}
            @slotchange="${o=>o.handleStartContentChange()}"
        ></slot>
    </span>
`;function u(o,e,t,r){var n=arguments.length,i=n<3?e:r===null?r=Object.getOwnPropertyDescriptor(e,t):r,s;if(typeof Reflect=="object"&&typeof Reflect.decorate=="function")i=Reflect.decorate(o,e,t,r);else for(var a=o.length-1;a>=0;a--)(s=o[a])&&(i=(n<3?s(i):n>3?s(e,t,i):s(e,t))||i);return n>3&&i&&Object.defineProperty(e,t,i),i}var Jt=new Map;"metadata"in Reflect||(Reflect.metadata=function(o,e){return function(t){Reflect.defineMetadata(o,e,t)}},Reflect.defineMetadata=function(o,e,t){let r=Jt.get(t);r===void 0&&Jt.set(t,r=new Map),r.set(o,e)},Reflect.getOwnMetadata=function(o,e){let t=Jt.get(e);if(t!==void 0)return t.get(o)});var to=class{constructor(e,t){this.container=e,this.key=t}instance(e){return this.registerResolver(0,e)}singleton(e){return this.registerResolver(1,e)}transient(e){return this.registerResolver(2,e)}callback(e){return this.registerResolver(3,e)}cachedCallback(e){return this.registerResolver(3,Cr(e))}aliasTo(e){return this.registerResolver(5,e)}registerResolver(e,t){let{container:r,key:n}=this;return this.container=this.key=void 0,r.registerResolver(n,new L(n,e,t))}};function Ue(o){let e=o.slice(),t=Object.keys(o),r=t.length,n;for(let i=0;i<r;++i)n=t[i],kr(n)||(e[n]=o[n]);return e}var ci=Object.freeze({none(o){throw Error(`${o.toString()} not registered, did you forget to add @singleton()?`)},singleton(o){return new L(o,1,o)},transient(o){return new L(o,2,o)}}),Yt=Object.freeze({default:Object.freeze({parentLocator:()=>null,responsibleForOwnerRequests:!1,defaultResolver:ci.singleton})}),hr=new Map;function pr(o){return e=>Reflect.getOwnMetadata(o,e)}var fr=null,y=Object.freeze({createContainer(o){return new be(null,Object.assign({},Yt.default,o))},findResponsibleContainer(o){let e=o.$$container$$;return e&&e.responsibleForOwnerRequests?e:y.findParentContainer(o)},findParentContainer(o){let e=new CustomEvent(wr,{bubbles:!0,composed:!0,cancelable:!0,detail:{container:void 0}});return o.dispatchEvent(e),e.detail.container||y.getOrCreateDOMContainer()},getOrCreateDOMContainer(o,e){return o?o.$$container$$||new be(o,Object.assign({},Yt.default,e,{parentLocator:y.findParentContainer})):fr||(fr=new be(null,Object.assign({},Yt.default,e,{parentLocator:()=>null})))},getDesignParamtypes:pr("design:paramtypes"),getAnnotationParamtypes:pr("di:paramtypes"),getOrCreateAnnotationParamTypes(o){let e=this.getAnnotationParamtypes(o);return e===void 0&&Reflect.defineMetadata("di:paramtypes",e=[],o),e},getDependencies(o){let e=hr.get(o);if(e===void 0){let t=o.inject;if(t===void 0){let r=y.getDesignParamtypes(o),n=y.getAnnotationParamtypes(o);if(r===void 0)if(n===void 0){let i=Object.getPrototypeOf(o);typeof i=="function"&&i!==Function.prototype?e=Ue(y.getDependencies(i)):e=[]}else e=Ue(n);else if(n===void 0)e=Ue(r);else{e=Ue(r);let i=n.length,s;for(let c=0;c<i;++c)s=n[c],s!==void 0&&(e[c]=s);let a=Object.keys(n);i=a.length;let l;for(let c=0;c<i;++c)l=a[c],kr(l)||(e[l]=n[l])}}else e=Ue(t);hr.set(o,e)}return e},defineProperty(o,e,t,r=!1){let n=`$di_${e}`;Reflect.defineProperty(o,e,{get:function(){let i=this[n];if(i===void 0&&(i=(this instanceof HTMLElement?y.findResponsibleContainer(this):y.getOrCreateDOMContainer()).get(t),this[n]=i,r&&this instanceof ce)){let a=this.$fastController,l=()=>{let d=y.findResponsibleContainer(this).get(t),h=this[n];d!==h&&(this[n]=i,a.notify(e))};a.subscribe({handleChange:l},"isConnected")}return i}})},createInterface(o,e){let t=typeof o=="function"?o:e,r=typeof o=="string"?o:o&&"friendlyName"in o&&o.friendlyName||vr,n=typeof o=="string"?!1:o&&"respectConnection"in o&&o.respectConnection||!1,i=function(s,a,l){if(s==null||new.target!==void 0)throw new Error(`No registration for interface: '${i.friendlyName}'`);if(a)y.defineProperty(s,a,i,n);else{let c=y.getOrCreateAnnotationParamTypes(s);c[l]=i}};return i.$isInterface=!0,i.friendlyName=r??"(anonymous)",t!=null&&(i.register=function(s,a){return t(new to(s,a??i))}),i.toString=function(){return`InterfaceSymbol<${i.friendlyName}>`},i},inject(...o){return function(e,t,r){if(typeof r=="number"){let n=y.getOrCreateAnnotationParamTypes(e),i=o[0];i!==void 0&&(n[r]=i)}else if(t)y.defineProperty(e,t,o[0]);else{let n=r?y.getOrCreateAnnotationParamTypes(r.value):y.getOrCreateAnnotationParamTypes(e),i;for(let s=0;s<o.length;++s)i=o[s],i!==void 0&&(n[s]=i)}}},transient(o){return o.register=function(t){return ve.transient(o,o).register(t)},o.registerInRequestor=!1,o},singleton(o,e=ui){return o.register=function(r){return ve.singleton(o,o).register(r)},o.registerInRequestor=e.scoped,o}}),di=y.createInterface("Container");function at(o){return function(e){let t=function(r,n,i){y.inject(t)(r,n,i)};return t.$isResolver=!0,t.resolve=function(r,n){return o(e,r,n)},t}}var _a=y.inject;var ui={scoped:!1};function hi(o){return function(e,t){t=!!t;let r=function(n,i,s){y.inject(r)(n,i,s)};return r.$isResolver=!0,r.resolve=function(n,i){return o(e,n,i,t)},r}}var La=hi((o,e,t,r)=>t.getAll(o,r)),Ma=at((o,e,t)=>()=>t.get(o)),Va=at((o,e,t)=>{if(t.has(o,!0))return t.get(o)});function ro(o,e,t){y.inject(ro)(o,e,t)}ro.$isResolver=!0;ro.resolve=()=>{};var Ha=at((o,e,t)=>{let r=xr(o,e),n=new L(o,0,r);return t.registerResolver(o,n),r}),Na=at((o,e,t)=>xr(o,e));function xr(o,e){return e.getFactory(o).construct(e)}var L=class{constructor(e,t,r){this.key=e,this.strategy=t,this.state=r,this.resolving=!1}get $isResolver(){return!0}register(e){return e.registerResolver(this.key,this)}resolve(e,t){switch(this.strategy){case 0:return this.state;case 1:{if(this.resolving)throw new Error(`Cyclic dependency found: ${this.state.name}`);return this.resolving=!0,this.state=e.getFactory(this.state).construct(t),this.strategy=0,this.resolving=!1,this.state}case 2:{let r=e.getFactory(this.state);if(r===null)throw new Error(`Resolver for ${String(this.key)} returned a null factory`);return r.construct(t)}case 3:return this.state(e,t,this);case 4:return this.state[0].resolve(e,t);case 5:return t.get(this.state);default:throw new Error(`Invalid resolver strategy specified: ${this.strategy}.`)}}getFactory(e){var t,r,n;switch(this.strategy){case 1:case 2:return e.getFactory(this.state);case 5:return(n=(r=(t=e.getResolver(this.state))===null||t===void 0?void 0:t.getFactory)===null||r===void 0?void 0:r.call(t,e))!==null&&n!==void 0?n:null;default:return null}}};function mr(o){return this.get(o)}function pi(o,e){return e(o)}var oo=class{constructor(e,t){this.Type=e,this.dependencies=t,this.transformers=null}construct(e,t){let r;return t===void 0?r=new this.Type(...this.dependencies.map(mr,e)):r=new this.Type(...this.dependencies.map(mr,e),...t),this.transformers==null?r:this.transformers.reduce(pi,r)}registerTransformer(e){(this.transformers||(this.transformers=[])).push(e)}},fi={$isResolver:!0,resolve(o,e){return e}};function st(o){return typeof o.register=="function"}function mi(o){return st(o)&&typeof o.registerInRequestor=="boolean"}function gr(o){return mi(o)&&o.registerInRequestor}function gi(o){return o.prototype!==void 0}var bi=new Set(["Array","ArrayBuffer","Boolean","DataView","Date","Error","EvalError","Float32Array","Float64Array","Function","Int8Array","Int16Array","Int32Array","Map","Number","Object","Promise","RangeError","ReferenceError","RegExp","Set","SharedArrayBuffer","String","SyntaxError","TypeError","Uint8Array","Uint8ClampedArray","Uint16Array","Uint32Array","URIError","WeakMap","WeakSet"]),wr="__DI_LOCATE_PARENT__",Kt=new Map,be=class{constructor(e,t){this.owner=e,this.config=t,this._parent=void 0,this.registerDepth=0,this.context=null,e!==null&&(e.$$container$$=this),this.resolvers=new Map,this.resolvers.set(di,fi),e instanceof Node&&e.addEventListener(wr,r=>{r.composedPath()[0]!==this.owner&&(r.detail.container=this,r.stopImmediatePropagation())})}get parent(){return this._parent===void 0&&(this._parent=this.config.parentLocator(this.owner)),this._parent}get depth(){return this.parent===null?0:this.parent.depth+1}get responsibleForOwnerRequests(){return this.config.responsibleForOwnerRequests}registerWithContext(e,...t){return this.context=e,this.register(...t),this.context=null,this}register(...e){if(++this.registerDepth===100)throw new Error("Unable to autoregister dependency");let t,r,n,i,s,a=this.context;for(let l=0,c=e.length;l<c;++l)if(t=e[l],!!yr(t))if(st(t))t.register(this,a);else if(gi(t))ve.singleton(t,t).register(this);else for(r=Object.keys(t),i=0,s=r.length;i<s;++i)n=t[r[i]],yr(n)&&(st(n)?n.register(this,a):this.register(n));return--this.registerDepth,this}registerResolver(e,t){nt(e);let r=this.resolvers,n=r.get(e);return n==null?r.set(e,t):n instanceof L&&n.strategy===4?n.state.push(t):r.set(e,new L(e,4,[n,t])),t}registerTransformer(e,t){let r=this.getResolver(e);if(r==null)return!1;if(r.getFactory){let n=r.getFactory(this);return n==null?!1:(n.registerTransformer(t),!0)}return!1}getResolver(e,t=!0){if(nt(e),e.resolve!==void 0)return e;let r=this,n;for(;r!=null;)if(n=r.resolvers.get(e),n==null){if(r.parent==null){let i=gr(e)?this:r;return t?this.jitRegister(e,i):null}r=r.parent}else return n;return null}has(e,t=!1){return this.resolvers.has(e)?!0:t&&this.parent!=null?this.parent.has(e,!0):!1}get(e){if(nt(e),e.$isResolver)return e.resolve(this,this);let t=this,r;for(;t!=null;)if(r=t.resolvers.get(e),r==null){if(t.parent==null){let n=gr(e)?this:t;return r=this.jitRegister(e,n),r.resolve(t,this)}t=t.parent}else return r.resolve(t,this);throw new Error(`Unable to resolve key: ${String(e)}`)}getAll(e,t=!1){nt(e);let r=this,n=r,i;if(t){let s=H;for(;n!=null;)i=n.resolvers.get(e),i!=null&&(s=s.concat(br(i,n,r))),n=n.parent;return s}else for(;n!=null;)if(i=n.resolvers.get(e),i==null){if(n=n.parent,n==null)return H}else return br(i,n,r);return H}getFactory(e){let t=Kt.get(e);if(t===void 0){if(vi(e))throw new Error(`${e.name} is a native function and therefore cannot be safely constructed by DI. If this is intentional, please use a callback or cachedCallback resolver.`);Kt.set(e,t=new oo(e,y.getDependencies(e)))}return t}registerFactory(e,t){Kt.set(e,t)}createChild(e){return new be(null,Object.assign({},this.config,e,{parentLocator:()=>this}))}jitRegister(e,t){if(typeof e!="function")throw new Error(`Attempted to jitRegister something that is not a constructor: '${e}'. Did you forget to register this dependency?`);if(bi.has(e.name))throw new Error(`Attempted to jitRegister an intrinsic type: ${e.name}. Did you forget to add @inject(Key)`);if(st(e)){let r=e.register(t);if(!(r instanceof Object)||r.resolve==null){let n=t.resolvers.get(e);if(n!=null)return n;throw new Error("A valid resolver was not returned from the static register method")}return r}else{if(e.$isInterface)throw new Error(`Attempted to jitRegister an interface: ${e.friendlyName}`);{let r=this.config.defaultResolver(e,t);return t.resolvers.set(e,r),r}}}},eo=new WeakMap;function Cr(o){return function(e,t,r){if(eo.has(r))return eo.get(r);let n=o(e,t,r);return eo.set(r,n),n}}var ve=Object.freeze({instance(o,e){return new L(o,0,e)},singleton(o,e){return new L(o,1,e)},transient(o,e){return new L(o,2,e)},callback(o,e){return new L(o,3,e)},cachedCallback(o,e){return new L(o,3,Cr(e))},aliasTo(o,e){return new L(e,5,o)}});function nt(o){if(o==null)throw new Error("key/value cannot be null or undefined. Are you trying to inject/register something that doesn't exist with DI?")}function br(o,e,t){if(o instanceof L&&o.strategy===4){let r=o.state,n=r.length,i=new Array(n);for(;n--;)i[n]=r[n].resolve(e,t);return i}return[o.resolve(e,t)]}var vr="(anonymous)";function yr(o){return typeof o=="object"&&o!==null||typeof o=="function"}var vi=function(){let o=new WeakMap,e=!1,t="",r=0;return function(n){return e=o.get(n),e===void 0&&(t=n.toString(),r=t.length,e=r>=29&&r<=100&&t.charCodeAt(r-1)===125&&t.charCodeAt(r-2)<=32&&t.charCodeAt(r-3)===93&&t.charCodeAt(r-4)===101&&t.charCodeAt(r-5)===100&&t.charCodeAt(r-6)===111&&t.charCodeAt(r-7)===99&&t.charCodeAt(r-8)===32&&t.charCodeAt(r-9)===101&&t.charCodeAt(r-10)===118&&t.charCodeAt(r-11)===105&&t.charCodeAt(r-12)===116&&t.charCodeAt(r-13)===97&&t.charCodeAt(r-14)===110&&t.charCodeAt(r-15)===88,o.set(n,e)),e}}(),it={};function kr(o){switch(typeof o){case"number":return o>=0&&(o|0)===o;case"string":{let e=it[o];if(e!==void 0)return e;let t=o.length;if(t===0)return it[o]=!1;let r=0;for(let n=0;n<t;++n)if(r=o.charCodeAt(n),n===0&&r===48&&t>1||r<48||r>57)return it[o]=!1;return it[o]=!0}default:return!1}}function $r(o){return`${o.toLowerCase()}:presentation`}var lt=new Map,dt=Object.freeze({define(o,e,t){let r=$r(o);lt.get(r)===void 0?lt.set(r,e):lt.set(r,!1),t.register(ve.instance(r,e))},forTag(o,e){let t=$r(o),r=lt.get(t);return r===!1?y.findResponsibleContainer(e).get(t):r||null}}),ct=class{constructor(e,t){this.template=e||null,this.styles=t===void 0?null:Array.isArray(t)?D.create(t):t instanceof D?t:D.create([t])}applyTo(e){let t=e.$fastController;t.template===null&&(t.template=this.template),t.styles===null&&(t.styles=this.styles)}};var k=class extends ce{constructor(){super(...arguments),this._presentation=void 0}get $presentation(){return this._presentation===void 0&&(this._presentation=dt.forTag(this.tagName,this)),this._presentation}templateChanged(){this.template!==void 0&&(this.$fastController.template=this.template)}stylesChanged(){this.styles!==void 0&&(this.$fastController.styles=this.styles)}connectedCallback(){this.$presentation!==null&&this.$presentation.applyTo(this),super.connectedCallback()}static compose(e){return(t={})=>new no(this===k?class extends k{}:this,e,t)}};u([b],k.prototype,"template",void 0);u([b],k.prototype,"styles",void 0);function ze(o,e,t){return typeof o=="function"?o(e,t):o}var no=class{constructor(e,t,r){this.type=e,this.elementDefinition=t,this.overrideDefinition=r,this.definition=Object.assign(Object.assign({},this.elementDefinition),this.overrideDefinition)}register(e,t){let r=this.definition,n=this.overrideDefinition,s=`${r.prefix||t.elementPrefix}-${r.baseName}`;t.tryDefineElement({name:s,type:this.type,baseClass:this.elementDefinition.baseClass,callback:a=>{let l=new ct(ze(r.template,a,r),ze(r.styles,a,r));a.definePresentation(l);let c=ze(r.shadowOptions,a,r);a.shadowRootMode&&(c?n.shadowOptions||(c.mode=a.shadowRootMode):c!==null&&(c={mode:a.shadowRootMode})),a.defineElement({elementOptions:ze(r.elementOptions,a,r),shadowOptions:c,attributes:ze(r.attributes,a,r)})}})}};function Y(o,...e){let t=Ne.locate(o);e.forEach(r=>{Object.getOwnPropertyNames(r.prototype).forEach(i=>{i!=="constructor"&&Object.defineProperty(o.prototype,i,Object.getOwnPropertyDescriptor(r.prototype,i))}),Ne.locate(r).forEach(i=>t.push(i))})}var Tr={horizontal:"horizontal",vertical:"vertical"};function Sr(){return!!(typeof window<"u"&&window.document&&window.document.createElement)}function yi(){let o=document.querySelector('meta[property="csp-nonce"]');return o?o.getAttribute("content"):null}var ye;function Dr(){if(typeof ye=="boolean")return ye;if(!Sr())return ye=!1,ye;let o=document.createElement("style"),e=yi();e!==null&&o.setAttribute("nonce",e),document.head.appendChild(o);try{o.sheet.insertRule("foo:focus-visible {color:inherit}",0),ye=!0}catch{ye=!1}finally{document.head.removeChild(o)}return ye}var io="focus",so="focusin",K="focusout";var ee="keydown";var Er;(function(o){o[o.alt=18]="alt",o[o.arrowDown=40]="arrowDown",o[o.arrowLeft=37]="arrowLeft",o[o.arrowRight=39]="arrowRight",o[o.arrowUp=38]="arrowUp",o[o.back=8]="back",o[o.backSlash=220]="backSlash",o[o.break=19]="break",o[o.capsLock=20]="capsLock",o[o.closeBracket=221]="closeBracket",o[o.colon=186]="colon",o[o.colon2=59]="colon2",o[o.comma=188]="comma",o[o.ctrl=17]="ctrl",o[o.delete=46]="delete",o[o.end=35]="end",o[o.enter=13]="enter",o[o.equals=187]="equals",o[o.equals2=61]="equals2",o[o.equals3=107]="equals3",o[o.escape=27]="escape",o[o.forwardSlash=191]="forwardSlash",o[o.function1=112]="function1",o[o.function10=121]="function10",o[o.function11=122]="function11",o[o.function12=123]="function12",o[o.function2=113]="function2",o[o.function3=114]="function3",o[o.function4=115]="function4",o[o.function5=116]="function5",o[o.function6=117]="function6",o[o.function7=118]="function7",o[o.function8=119]="function8",o[o.function9=120]="function9",o[o.home=36]="home",o[o.insert=45]="insert",o[o.menu=93]="menu",o[o.minus=189]="minus",o[o.minus2=109]="minus2",o[o.numLock=144]="numLock",o[o.numPad0=96]="numPad0",o[o.numPad1=97]="numPad1",o[o.numPad2=98]="numPad2",o[o.numPad3=99]="numPad3",o[o.numPad4=100]="numPad4",o[o.numPad5=101]="numPad5",o[o.numPad6=102]="numPad6",o[o.numPad7=103]="numPad7",o[o.numPad8=104]="numPad8",o[o.numPad9=105]="numPad9",o[o.numPadDivide=111]="numPadDivide",o[o.numPadDot=110]="numPadDot",o[o.numPadMinus=109]="numPadMinus",o[o.numPadMultiply=106]="numPadMultiply",o[o.numPadPlus=107]="numPadPlus",o[o.openBracket=219]="openBracket",o[o.pageDown=34]="pageDown",o[o.pageUp=33]="pageUp",o[o.period=190]="period",o[o.print=44]="print",o[o.quote=222]="quote",o[o.scrollLock=145]="scrollLock",o[o.shift=16]="shift",o[o.space=32]="space",o[o.tab=9]="tab",o[o.tilde=192]="tilde",o[o.windowsLeft=91]="windowsLeft",o[o.windowsOpera=219]="windowsOpera",o[o.windowsRight=92]="windowsRight"})(Er||(Er={}));var Or="ArrowDown",Pr="ArrowLeft",Rr="ArrowRight",Fr="ArrowUp",ut="Enter",Ir="Escape",ht="Home",pt="End",Ar="F2",Br="PageDown",_r="PageUp";var Lr=(o,e)=>x`
    <a
        class="control"
        part="control"
        download="${t=>t.download}"
        href="${t=>t.href}"
        hreflang="${t=>t.hreflang}"
        ping="${t=>t.ping}"
        referrerpolicy="${t=>t.referrerpolicy}"
        rel="${t=>t.rel}"
        target="${t=>t.target}"
        type="${t=>t.type}"
        aria-atomic="${t=>t.ariaAtomic}"
        aria-busy="${t=>t.ariaBusy}"
        aria-controls="${t=>t.ariaControls}"
        aria-current="${t=>t.ariaCurrent}"
        aria-describedby="${t=>t.ariaDescribedby}"
        aria-details="${t=>t.ariaDetails}"
        aria-disabled="${t=>t.ariaDisabled}"
        aria-errormessage="${t=>t.ariaErrormessage}"
        aria-expanded="${t=>t.ariaExpanded}"
        aria-flowto="${t=>t.ariaFlowto}"
        aria-haspopup="${t=>t.ariaHaspopup}"
        aria-hidden="${t=>t.ariaHidden}"
        aria-invalid="${t=>t.ariaInvalid}"
        aria-keyshortcuts="${t=>t.ariaKeyshortcuts}"
        aria-label="${t=>t.ariaLabel}"
        aria-labelledby="${t=>t.ariaLabelledby}"
        aria-live="${t=>t.ariaLive}"
        aria-owns="${t=>t.ariaOwns}"
        aria-relevant="${t=>t.ariaRelevant}"
        aria-roledescription="${t=>t.ariaRoledescription}"
        ${_("control")}
    >
        ${Re(o,e)}
        <span class="content" part="content">
            <slot ${de("defaultSlottedContent")}></slot>
        </span>
        ${Pe(o,e)}
    </a>
`;var w=class{};u([p({attribute:"aria-atomic"})],w.prototype,"ariaAtomic",void 0);u([p({attribute:"aria-busy"})],w.prototype,"ariaBusy",void 0);u([p({attribute:"aria-controls"})],w.prototype,"ariaControls",void 0);u([p({attribute:"aria-current"})],w.prototype,"ariaCurrent",void 0);u([p({attribute:"aria-describedby"})],w.prototype,"ariaDescribedby",void 0);u([p({attribute:"aria-details"})],w.prototype,"ariaDetails",void 0);u([p({attribute:"aria-disabled"})],w.prototype,"ariaDisabled",void 0);u([p({attribute:"aria-errormessage"})],w.prototype,"ariaErrormessage",void 0);u([p({attribute:"aria-flowto"})],w.prototype,"ariaFlowto",void 0);u([p({attribute:"aria-haspopup"})],w.prototype,"ariaHaspopup",void 0);u([p({attribute:"aria-hidden"})],w.prototype,"ariaHidden",void 0);u([p({attribute:"aria-invalid"})],w.prototype,"ariaInvalid",void 0);u([p({attribute:"aria-keyshortcuts"})],w.prototype,"ariaKeyshortcuts",void 0);u([p({attribute:"aria-label"})],w.prototype,"ariaLabel",void 0);u([p({attribute:"aria-labelledby"})],w.prototype,"ariaLabelledby",void 0);u([p({attribute:"aria-live"})],w.prototype,"ariaLive",void 0);u([p({attribute:"aria-owns"})],w.prototype,"ariaOwns",void 0);u([p({attribute:"aria-relevant"})],w.prototype,"ariaRelevant",void 0);u([p({attribute:"aria-roledescription"})],w.prototype,"ariaRoledescription",void 0);var M=class extends k{constructor(){super(...arguments),this.handleUnsupportedDelegatesFocus=()=>{var e;window.ShadowRoot&&!window.ShadowRoot.prototype.hasOwnProperty("delegatesFocus")&&(!((e=this.$fastController.definition.shadowOptions)===null||e===void 0)&&e.delegatesFocus)&&(this.focus=()=>{var t;(t=this.control)===null||t===void 0||t.focus()})}}connectedCallback(){super.connectedCallback(),this.handleUnsupportedDelegatesFocus()}};u([p],M.prototype,"download",void 0);u([p],M.prototype,"href",void 0);u([p],M.prototype,"hreflang",void 0);u([p],M.prototype,"ping",void 0);u([p],M.prototype,"referrerpolicy",void 0);u([p],M.prototype,"rel",void 0);u([p],M.prototype,"target",void 0);u([p],M.prototype,"type",void 0);u([b],M.prototype,"defaultSlottedContent",void 0);var qe=class{};u([p({attribute:"aria-expanded"})],qe.prototype,"ariaExpanded",void 0);Y(qe,w);Y(M,ue,qe);var Mr=(o,e)=>x`
    <template class="${t=>t.circular?"circular":""}">
        <div class="control" part="control" style="${t=>t.generateBadgeStyle()}">
            <slot></slot>
        </div>
    </template>
`;var xe=class extends k{constructor(){super(...arguments),this.generateBadgeStyle=()=>{if(!this.fill&&!this.color)return;let e=`background-color: var(--badge-fill-${this.fill});`,t=`color: var(--badge-color-${this.color});`;return this.fill&&!this.color?e:this.color&&!this.fill?t:`${t} ${e}`}}};u([p({attribute:"fill"})],xe.prototype,"fill",void 0);u([p({attribute:"color"})],xe.prototype,"color",void 0);u([p({mode:"boolean"})],xe.prototype,"circular",void 0);var Vr=(o,e)=>x`
    <button
        class="control"
        part="control"
        ?autofocus="${t=>t.autofocus}"
        ?disabled="${t=>t.disabled}"
        form="${t=>t.formId}"
        formaction="${t=>t.formaction}"
        formenctype="${t=>t.formenctype}"
        formmethod="${t=>t.formmethod}"
        formnovalidate="${t=>t.formnovalidate}"
        formtarget="${t=>t.formtarget}"
        name="${t=>t.name}"
        type="${t=>t.type}"
        value="${t=>t.value}"
        aria-atomic="${t=>t.ariaAtomic}"
        aria-busy="${t=>t.ariaBusy}"
        aria-controls="${t=>t.ariaControls}"
        aria-current="${t=>t.ariaCurrent}"
        aria-describedby="${t=>t.ariaDescribedby}"
        aria-details="${t=>t.ariaDetails}"
        aria-disabled="${t=>t.ariaDisabled}"
        aria-errormessage="${t=>t.ariaErrormessage}"
        aria-expanded="${t=>t.ariaExpanded}"
        aria-flowto="${t=>t.ariaFlowto}"
        aria-haspopup="${t=>t.ariaHaspopup}"
        aria-hidden="${t=>t.ariaHidden}"
        aria-invalid="${t=>t.ariaInvalid}"
        aria-keyshortcuts="${t=>t.ariaKeyshortcuts}"
        aria-label="${t=>t.ariaLabel}"
        aria-labelledby="${t=>t.ariaLabelledby}"
        aria-live="${t=>t.ariaLive}"
        aria-owns="${t=>t.ariaOwns}"
        aria-pressed="${t=>t.ariaPressed}"
        aria-relevant="${t=>t.ariaRelevant}"
        aria-roledescription="${t=>t.ariaRoledescription}"
        ${_("control")}
    >
        ${Re(o,e)}
        <span class="content" part="content">
            <slot ${de("defaultSlottedContent")}></slot>
        </span>
        ${Pe(o,e)}
    </button>
`;var Hr="form-associated-proxy",Nr="ElementInternals",jr=Nr in window&&"setFormValue"in window[Nr].prototype,Ur=new WeakMap;function ft(o){let e=class extends o{constructor(...t){super(...t),this.dirtyValue=!1,this.disabled=!1,this.proxyEventsToBlock=["change","click"],this.proxyInitialized=!1,this.required=!1,this.initialValue=this.initialValue||"",this.elementInternals||(this.formResetCallback=this.formResetCallback.bind(this))}static get formAssociated(){return jr}get validity(){return this.elementInternals?this.elementInternals.validity:this.proxy.validity}get form(){return this.elementInternals?this.elementInternals.form:this.proxy.form}get validationMessage(){return this.elementInternals?this.elementInternals.validationMessage:this.proxy.validationMessage}get willValidate(){return this.elementInternals?this.elementInternals.willValidate:this.proxy.willValidate}get labels(){if(this.elementInternals)return Object.freeze(Array.from(this.elementInternals.labels));if(this.proxy instanceof HTMLElement&&this.proxy.ownerDocument&&this.id){let t=this.proxy.labels,r=Array.from(this.proxy.getRootNode().querySelectorAll(`[for='${this.id}']`)),n=t?r.concat(Array.from(t)):r;return Object.freeze(n)}else return H}valueChanged(t,r){this.dirtyValue=!0,this.proxy instanceof HTMLElement&&(this.proxy.value=this.value),this.currentValue=this.value,this.setFormValue(this.value),this.validate()}currentValueChanged(){this.value=this.currentValue}initialValueChanged(t,r){this.dirtyValue||(this.value=this.initialValue,this.dirtyValue=!1)}disabledChanged(t,r){this.proxy instanceof HTMLElement&&(this.proxy.disabled=this.disabled),g.queueUpdate(()=>this.classList.toggle("disabled",this.disabled))}nameChanged(t,r){this.proxy instanceof HTMLElement&&(this.proxy.name=this.name)}requiredChanged(t,r){this.proxy instanceof HTMLElement&&(this.proxy.required=this.required),g.queueUpdate(()=>this.classList.toggle("required",this.required)),this.validate()}get elementInternals(){if(!jr)return null;let t=Ur.get(this);return t||(t=this.attachInternals(),Ur.set(this,t)),t}connectedCallback(){super.connectedCallback(),this.addEventListener("keypress",this._keypressHandler),this.value||(this.value=this.initialValue,this.dirtyValue=!1),this.elementInternals||(this.attachProxy(),this.form&&this.form.addEventListener("reset",this.formResetCallback))}disconnectedCallback(){super.disconnectedCallback(),this.proxyEventsToBlock.forEach(t=>this.proxy.removeEventListener(t,this.stopPropagation)),!this.elementInternals&&this.form&&this.form.removeEventListener("reset",this.formResetCallback)}checkValidity(){return this.elementInternals?this.elementInternals.checkValidity():this.proxy.checkValidity()}reportValidity(){return this.elementInternals?this.elementInternals.reportValidity():this.proxy.reportValidity()}setValidity(t,r,n){this.elementInternals?this.elementInternals.setValidity(t,r,n):typeof r=="string"&&this.proxy.setCustomValidity(r)}formDisabledCallback(t){this.disabled=t}formResetCallback(){this.value=this.initialValue,this.dirtyValue=!1}attachProxy(){var t;this.proxyInitialized||(this.proxyInitialized=!0,this.proxy.style.display="none",this.proxyEventsToBlock.forEach(r=>this.proxy.addEventListener(r,this.stopPropagation)),this.proxy.disabled=this.disabled,this.proxy.required=this.required,typeof this.name=="string"&&(this.proxy.name=this.name),typeof this.value=="string"&&(this.proxy.value=this.value),this.proxy.setAttribute("slot",Hr),this.proxySlot=document.createElement("slot"),this.proxySlot.setAttribute("name",Hr)),(t=this.shadowRoot)===null||t===void 0||t.appendChild(this.proxySlot),this.appendChild(this.proxy)}detachProxy(){var t;this.removeChild(this.proxy),(t=this.shadowRoot)===null||t===void 0||t.removeChild(this.proxySlot)}validate(t){this.proxy instanceof HTMLElement&&this.setValidity(this.proxy.validity,this.proxy.validationMessage,t)}setFormValue(t,r){this.elementInternals&&this.elementInternals.setFormValue(t,r||t)}_keypressHandler(t){switch(t.key){case ut:if(this.form instanceof HTMLFormElement){let r=this.form.querySelector("[type=submit]");r?.click()}break}}stopPropagation(t){t.stopPropagation()}};return p({mode:"boolean"})(e.prototype,"disabled"),p({mode:"fromView",attribute:"value"})(e.prototype,"initialValue"),p({attribute:"current-value"})(e.prototype,"currentValue"),p(e.prototype,"name"),p({mode:"boolean"})(e.prototype,"required"),b(e.prototype,"value"),e}var ao=class extends k{},mt=class extends ft(ao){constructor(){super(...arguments),this.proxy=document.createElement("input")}};var V=class extends mt{constructor(){super(...arguments),this.handleClick=e=>{var t;this.disabled&&((t=this.defaultSlottedContent)===null||t===void 0?void 0:t.length)<=1&&e.stopPropagation()},this.handleSubmission=()=>{if(!this.form)return;let e=this.proxy.isConnected;e||this.attachProxy(),typeof this.form.requestSubmit=="function"?this.form.requestSubmit(this.proxy):this.proxy.click(),e||this.detachProxy()},this.handleFormReset=()=>{var e;(e=this.form)===null||e===void 0||e.reset()},this.handleUnsupportedDelegatesFocus=()=>{var e;window.ShadowRoot&&!window.ShadowRoot.prototype.hasOwnProperty("delegatesFocus")&&(!((e=this.$fastController.definition.shadowOptions)===null||e===void 0)&&e.delegatesFocus)&&(this.focus=()=>{this.control.focus()})}}formactionChanged(){this.proxy instanceof HTMLInputElement&&(this.proxy.formAction=this.formaction)}formenctypeChanged(){this.proxy instanceof HTMLInputElement&&(this.proxy.formEnctype=this.formenctype)}formmethodChanged(){this.proxy instanceof HTMLInputElement&&(this.proxy.formMethod=this.formmethod)}formnovalidateChanged(){this.proxy instanceof HTMLInputElement&&(this.proxy.formNoValidate=this.formnovalidate)}formtargetChanged(){this.proxy instanceof HTMLInputElement&&(this.proxy.formTarget=this.formtarget)}typeChanged(e,t){this.proxy instanceof HTMLInputElement&&(this.proxy.type=this.type),t==="submit"&&this.addEventListener("click",this.handleSubmission),e==="submit"&&this.removeEventListener("click",this.handleSubmission),t==="reset"&&this.addEventListener("click",this.handleFormReset),e==="reset"&&this.removeEventListener("click",this.handleFormReset)}validate(){super.validate(this.control)}connectedCallback(){var e;super.connectedCallback(),this.proxy.setAttribute("type",this.type),this.handleUnsupportedDelegatesFocus();let t=Array.from((e=this.control)===null||e===void 0?void 0:e.children);t&&t.forEach(r=>{r.addEventListener("click",this.handleClick)})}disconnectedCallback(){var e;super.disconnectedCallback();let t=Array.from((e=this.control)===null||e===void 0?void 0:e.children);t&&t.forEach(r=>{r.removeEventListener("click",this.handleClick)})}};u([p({mode:"boolean"})],V.prototype,"autofocus",void 0);u([p({attribute:"form"})],V.prototype,"formId",void 0);u([p],V.prototype,"formaction",void 0);u([p],V.prototype,"formenctype",void 0);u([p],V.prototype,"formmethod",void 0);u([p({mode:"boolean"})],V.prototype,"formnovalidate",void 0);u([p],V.prototype,"formtarget",void 0);u([p],V.prototype,"type",void 0);u([b],V.prototype,"defaultSlottedContent",void 0);var Fe=class{};u([p({attribute:"aria-expanded"})],Fe.prototype,"ariaExpanded",void 0);u([p({attribute:"aria-pressed"})],Fe.prototype,"ariaPressed",void 0);Y(Fe,w);Y(V,ue,Fe);var Ie={none:"none",default:"default",sticky:"sticky"},W={default:"default",columnHeader:"columnheader",rowHeader:"rowheader"},he={default:"default",header:"header",stickyHeader:"sticky-header"};var R=class extends k{constructor(){super(...arguments),this.rowType=he.default,this.rowData=null,this.columnDefinitions=null,this.isActiveRow=!1,this.cellsRepeatBehavior=null,this.cellsPlaceholder=null,this.focusColumnIndex=0,this.refocusOnLoad=!1,this.updateRowStyle=()=>{this.style.gridTemplateColumns=this.gridTemplateColumns}}gridTemplateColumnsChanged(){this.$fastController.isConnected&&this.updateRowStyle()}rowTypeChanged(){this.$fastController.isConnected&&this.updateItemTemplate()}rowDataChanged(){if(this.rowData!==null&&this.isActiveRow){this.refocusOnLoad=!0;return}}cellItemTemplateChanged(){this.updateItemTemplate()}headerCellItemTemplateChanged(){this.updateItemTemplate()}connectedCallback(){super.connectedCallback(),this.cellsRepeatBehavior===null&&(this.cellsPlaceholder=document.createComment(""),this.appendChild(this.cellsPlaceholder),this.updateItemTemplate(),this.cellsRepeatBehavior=new Ee(e=>e.columnDefinitions,e=>e.activeCellItemTemplate,{positioning:!0}).createBehavior(this.cellsPlaceholder),this.$fastController.addBehaviors([this.cellsRepeatBehavior])),this.addEventListener("cell-focused",this.handleCellFocus),this.addEventListener(K,this.handleFocusout),this.addEventListener(ee,this.handleKeydown),this.updateRowStyle(),this.refocusOnLoad&&(this.refocusOnLoad=!1,this.cellElements.length>this.focusColumnIndex&&this.cellElements[this.focusColumnIndex].focus())}disconnectedCallback(){super.disconnectedCallback(),this.removeEventListener("cell-focused",this.handleCellFocus),this.removeEventListener(K,this.handleFocusout),this.removeEventListener(ee,this.handleKeydown)}handleFocusout(e){this.contains(e.target)||(this.isActiveRow=!1,this.focusColumnIndex=0)}handleCellFocus(e){this.isActiveRow=!0,this.focusColumnIndex=this.cellElements.indexOf(e.target),this.$emit("row-focused",this)}handleKeydown(e){if(e.defaultPrevented)return;let t=0;switch(e.key){case Pr:t=Math.max(0,this.focusColumnIndex-1),this.cellElements[t].focus(),e.preventDefault();break;case Rr:t=Math.min(this.cellElements.length-1,this.focusColumnIndex+1),this.cellElements[t].focus(),e.preventDefault();break;case ht:e.ctrlKey||(this.cellElements[0].focus(),e.preventDefault());break;case pt:e.ctrlKey||(this.cellElements[this.cellElements.length-1].focus(),e.preventDefault());break}}updateItemTemplate(){this.activeCellItemTemplate=this.rowType===he.default&&this.cellItemTemplate!==void 0?this.cellItemTemplate:this.rowType===he.default&&this.cellItemTemplate===void 0?this.defaultCellItemTemplate:this.headerCellItemTemplate!==void 0?this.headerCellItemTemplate:this.defaultHeaderCellItemTemplate}};u([p({attribute:"grid-template-columns"})],R.prototype,"gridTemplateColumns",void 0);u([p({attribute:"row-type"})],R.prototype,"rowType",void 0);u([b],R.prototype,"rowData",void 0);u([b],R.prototype,"columnDefinitions",void 0);u([b],R.prototype,"cellItemTemplate",void 0);u([b],R.prototype,"headerCellItemTemplate",void 0);u([b],R.prototype,"rowIndex",void 0);u([b],R.prototype,"isActiveRow",void 0);u([b],R.prototype,"activeCellItemTemplate",void 0);u([b],R.prototype,"defaultCellItemTemplate",void 0);u([b],R.prototype,"defaultHeaderCellItemTemplate",void 0);u([b],R.prototype,"cellElements",void 0);function xi(o){let e=o.tagFor(R);return x`
    <${e}
        :rowData="${t=>t}"
        :cellItemTemplate="${(t,r)=>r.parent.cellItemTemplate}"
        :headerCellItemTemplate="${(t,r)=>r.parent.headerCellItemTemplate}"
    ></${e}>
`}var zr=(o,e)=>{let t=xi(o),r=o.tagFor(R);return x`
        <template
            role="grid"
            tabindex="0"
            :rowElementTag="${()=>r}"
            :defaultRowItemTemplate="${t}"
            ${rt({property:"rowElements",filter:je("[role=row]")})}
        >
            <slot></slot>
        </template>
    `};var S=class extends k{constructor(){super(),this.noTabbing=!1,this.generateHeader=Ie.default,this.rowsData=[],this.columnDefinitions=null,this.focusRowIndex=0,this.focusColumnIndex=0,this.rowsPlaceholder=null,this.generatedHeader=null,this.isUpdatingFocus=!1,this.pendingFocusUpdate=!1,this.rowindexUpdateQueued=!1,this.columnDefinitionsStale=!0,this.generatedGridTemplateColumns="",this.focusOnCell=(e,t,r)=>{if(this.rowElements.length===0){this.focusRowIndex=0,this.focusColumnIndex=0;return}let n=Math.max(0,Math.min(this.rowElements.length-1,e)),s=this.rowElements[n].querySelectorAll('[role="cell"], [role="gridcell"], [role="columnheader"], [role="rowheader"]'),a=Math.max(0,Math.min(s.length-1,t)),l=s[a];r&&this.scrollHeight!==this.clientHeight&&(n<this.focusRowIndex&&this.scrollTop>0||n>this.focusRowIndex&&this.scrollTop<this.scrollHeight-this.clientHeight)&&l.scrollIntoView({block:"center",inline:"center"}),l.focus()},this.onChildListChange=(e,t)=>{e&&e.length&&(e.forEach(r=>{r.addedNodes.forEach(n=>{n.nodeType===1&&n.getAttribute("role")==="row"&&(n.columnDefinitions=this.columnDefinitions)})}),this.queueRowIndexUpdate())},this.queueRowIndexUpdate=()=>{this.rowindexUpdateQueued||(this.rowindexUpdateQueued=!0,g.queueUpdate(this.updateRowIndexes))},this.updateRowIndexes=()=>{let e=this.gridTemplateColumns;if(e===void 0){if(this.generatedGridTemplateColumns===""&&this.rowElements.length>0){let t=this.rowElements[0];this.generatedGridTemplateColumns=new Array(t.cellElements.length).fill("1fr").join(" ")}e=this.generatedGridTemplateColumns}this.rowElements.forEach((t,r)=>{let n=t;n.rowIndex=r,n.gridTemplateColumns=e,this.columnDefinitionsStale&&(n.columnDefinitions=this.columnDefinitions)}),this.rowindexUpdateQueued=!1,this.columnDefinitionsStale=!1}}static generateTemplateColumns(e){let t="";return e.forEach(r=>{t=`${t}${t===""?"":" "}1fr`}),t}noTabbingChanged(){this.$fastController.isConnected&&(this.noTabbing?this.setAttribute("tabIndex","-1"):this.setAttribute("tabIndex",this.contains(document.activeElement)||this===document.activeElement?"-1":"0"))}generateHeaderChanged(){this.$fastController.isConnected&&this.toggleGeneratedHeader()}gridTemplateColumnsChanged(){this.$fastController.isConnected&&this.updateRowIndexes()}rowsDataChanged(){this.columnDefinitions===null&&this.rowsData.length>0&&(this.columnDefinitions=S.generateColumns(this.rowsData[0])),this.$fastController.isConnected&&this.toggleGeneratedHeader()}columnDefinitionsChanged(){if(this.columnDefinitions===null){this.generatedGridTemplateColumns="";return}this.generatedGridTemplateColumns=S.generateTemplateColumns(this.columnDefinitions),this.$fastController.isConnected&&(this.columnDefinitionsStale=!0,this.queueRowIndexUpdate())}headerCellItemTemplateChanged(){this.$fastController.isConnected&&this.generatedHeader!==null&&(this.generatedHeader.headerCellItemTemplate=this.headerCellItemTemplate)}focusRowIndexChanged(){this.$fastController.isConnected&&this.queueFocusUpdate()}focusColumnIndexChanged(){this.$fastController.isConnected&&this.queueFocusUpdate()}connectedCallback(){super.connectedCallback(),this.rowItemTemplate===void 0&&(this.rowItemTemplate=this.defaultRowItemTemplate),this.rowsPlaceholder=document.createComment(""),this.appendChild(this.rowsPlaceholder),this.toggleGeneratedHeader(),this.rowsRepeatBehavior=new Ee(e=>e.rowsData,e=>e.rowItemTemplate,{positioning:!0}).createBehavior(this.rowsPlaceholder),this.$fastController.addBehaviors([this.rowsRepeatBehavior]),this.addEventListener("row-focused",this.handleRowFocus),this.addEventListener(io,this.handleFocus),this.addEventListener(ee,this.handleKeydown),this.addEventListener(K,this.handleFocusOut),this.observer=new MutationObserver(this.onChildListChange),this.observer.observe(this,{childList:!0}),this.noTabbing&&this.setAttribute("tabindex","-1"),g.queueUpdate(this.queueRowIndexUpdate)}disconnectedCallback(){super.disconnectedCallback(),this.removeEventListener("row-focused",this.handleRowFocus),this.removeEventListener(io,this.handleFocus),this.removeEventListener(ee,this.handleKeydown),this.removeEventListener(K,this.handleFocusOut),this.observer.disconnect(),this.rowsPlaceholder=null,this.generatedHeader=null}handleRowFocus(e){this.isUpdatingFocus=!0;let t=e.target;this.focusRowIndex=this.rowElements.indexOf(t),this.focusColumnIndex=t.focusColumnIndex,this.setAttribute("tabIndex","-1"),this.isUpdatingFocus=!1}handleFocus(e){this.focusOnCell(this.focusRowIndex,this.focusColumnIndex,!0)}handleFocusOut(e){(e.relatedTarget===null||!this.contains(e.relatedTarget))&&this.setAttribute("tabIndex",this.noTabbing?"-1":"0")}handleKeydown(e){if(e.defaultPrevented)return;let t,r=this.rowElements.length-1,n=this.offsetHeight+this.scrollTop,i=this.rowElements[r];switch(e.key){case Fr:e.preventDefault(),this.focusOnCell(this.focusRowIndex-1,this.focusColumnIndex,!0);break;case Or:e.preventDefault(),this.focusOnCell(this.focusRowIndex+1,this.focusColumnIndex,!0);break;case _r:if(e.preventDefault(),this.rowElements.length===0){this.focusOnCell(0,0,!1);break}if(this.focusRowIndex===0){this.focusOnCell(0,this.focusColumnIndex,!1);return}for(t=this.focusRowIndex-1,t;t>=0;t--){let s=this.rowElements[t];if(s.offsetTop<this.scrollTop){this.scrollTop=s.offsetTop+s.clientHeight-this.clientHeight;break}}this.focusOnCell(t,this.focusColumnIndex,!1);break;case Br:if(e.preventDefault(),this.rowElements.length===0){this.focusOnCell(0,0,!1);break}if(this.focusRowIndex>=r||i.offsetTop+i.offsetHeight<=n){this.focusOnCell(r,this.focusColumnIndex,!1);return}for(t=this.focusRowIndex+1,t;t<=r;t++){let s=this.rowElements[t];if(s.offsetTop+s.offsetHeight>n){let a=0;this.generateHeader===Ie.sticky&&this.generatedHeader!==null&&(a=this.generatedHeader.clientHeight),this.scrollTop=s.offsetTop-a;break}}this.focusOnCell(t,this.focusColumnIndex,!1);break;case ht:e.ctrlKey&&(e.preventDefault(),this.focusOnCell(0,0,!0));break;case pt:e.ctrlKey&&this.columnDefinitions!==null&&(e.preventDefault(),this.focusOnCell(this.rowElements.length-1,this.columnDefinitions.length-1,!0));break}}queueFocusUpdate(){this.isUpdatingFocus&&(this.contains(document.activeElement)||this===document.activeElement)||this.pendingFocusUpdate===!1&&(this.pendingFocusUpdate=!0,g.queueUpdate(()=>this.updateFocus()))}updateFocus(){this.pendingFocusUpdate=!1,this.focusOnCell(this.focusRowIndex,this.focusColumnIndex,!0)}toggleGeneratedHeader(){if(this.generatedHeader!==null&&(this.removeChild(this.generatedHeader),this.generatedHeader=null),this.generateHeader!==Ie.none&&this.rowsData.length>0){let e=document.createElement(this.rowElementTag);this.generatedHeader=e,this.generatedHeader.columnDefinitions=this.columnDefinitions,this.generatedHeader.gridTemplateColumns=this.gridTemplateColumns,this.generatedHeader.rowType=this.generateHeader===Ie.sticky?he.stickyHeader:he.header,(this.firstChild!==null||this.rowsPlaceholder!==null)&&this.insertBefore(e,this.firstChild!==null?this.firstChild:this.rowsPlaceholder);return}}};S.generateColumns=o=>Object.getOwnPropertyNames(o).map((e,t)=>({columnDataKey:e,gridColumn:`${t}`}));u([p({attribute:"no-tabbing",mode:"boolean"})],S.prototype,"noTabbing",void 0);u([p({attribute:"generate-header"})],S.prototype,"generateHeader",void 0);u([p({attribute:"grid-template-columns"})],S.prototype,"gridTemplateColumns",void 0);u([b],S.prototype,"rowsData",void 0);u([b],S.prototype,"columnDefinitions",void 0);u([b],S.prototype,"rowItemTemplate",void 0);u([b],S.prototype,"cellItemTemplate",void 0);u([b],S.prototype,"headerCellItemTemplate",void 0);u([b],S.prototype,"focusRowIndex",void 0);u([b],S.prototype,"focusColumnIndex",void 0);u([b],S.prototype,"defaultRowItemTemplate",void 0);u([b],S.prototype,"rowElementTag",void 0);u([b],S.prototype,"rowElements",void 0);var wi=x`
    <template>
        ${o=>o.rowData===null||o.columnDefinition===null||o.columnDefinition.columnDataKey===null?null:o.rowData[o.columnDefinition.columnDataKey]}
    </template>
`,Ci=x`
    <template>
        ${o=>o.columnDefinition===null?null:o.columnDefinition.title===void 0?o.columnDefinition.columnDataKey:o.columnDefinition.title}
    </template>
`,j=class extends k{constructor(){super(...arguments),this.cellType=W.default,this.rowData=null,this.columnDefinition=null,this.isActiveCell=!1,this.customCellView=null,this.updateCellStyle=()=>{this.style.gridColumn=this.gridColumn}}cellTypeChanged(){this.$fastController.isConnected&&this.updateCellView()}gridColumnChanged(){this.$fastController.isConnected&&this.updateCellStyle()}columnDefinitionChanged(e,t){this.$fastController.isConnected&&this.updateCellView()}connectedCallback(){var e;super.connectedCallback(),this.addEventListener(so,this.handleFocusin),this.addEventListener(K,this.handleFocusout),this.addEventListener(ee,this.handleKeydown),this.style.gridColumn=`${((e=this.columnDefinition)===null||e===void 0?void 0:e.gridColumn)===void 0?0:this.columnDefinition.gridColumn}`,this.updateCellView(),this.updateCellStyle()}disconnectedCallback(){super.disconnectedCallback(),this.removeEventListener(so,this.handleFocusin),this.removeEventListener(K,this.handleFocusout),this.removeEventListener(ee,this.handleKeydown),this.disconnectCellView()}handleFocusin(e){if(!this.isActiveCell){switch(this.isActiveCell=!0,this.cellType){case W.columnHeader:if(this.columnDefinition!==null&&this.columnDefinition.headerCellInternalFocusQueue!==!0&&typeof this.columnDefinition.headerCellFocusTargetCallback=="function"){let t=this.columnDefinition.headerCellFocusTargetCallback(this);t!==null&&t.focus()}break;default:if(this.columnDefinition!==null&&this.columnDefinition.cellInternalFocusQueue!==!0&&typeof this.columnDefinition.cellFocusTargetCallback=="function"){let t=this.columnDefinition.cellFocusTargetCallback(this);t!==null&&t.focus()}break}this.$emit("cell-focused",this)}}handleFocusout(e){this!==document.activeElement&&!this.contains(document.activeElement)&&(this.isActiveCell=!1)}handleKeydown(e){if(!(e.defaultPrevented||this.columnDefinition===null||this.cellType===W.default&&this.columnDefinition.cellInternalFocusQueue!==!0||this.cellType===W.columnHeader&&this.columnDefinition.headerCellInternalFocusQueue!==!0))switch(e.key){case ut:case Ar:if(this.contains(document.activeElement)&&document.activeElement!==this)return;switch(this.cellType){case W.columnHeader:if(this.columnDefinition.headerCellFocusTargetCallback!==void 0){let t=this.columnDefinition.headerCellFocusTargetCallback(this);t!==null&&t.focus(),e.preventDefault()}break;default:if(this.columnDefinition.cellFocusTargetCallback!==void 0){let t=this.columnDefinition.cellFocusTargetCallback(this);t!==null&&t.focus(),e.preventDefault()}break}break;case Ir:this.contains(document.activeElement)&&document.activeElement!==this&&(this.focus(),e.preventDefault());break}}updateCellView(){if(this.disconnectCellView(),this.columnDefinition!==null)switch(this.cellType){case W.columnHeader:this.columnDefinition.headerCellTemplate!==void 0?this.customCellView=this.columnDefinition.headerCellTemplate.render(this,this):this.customCellView=Ci.render(this,this);break;case void 0:case W.rowHeader:case W.default:this.columnDefinition.cellTemplate!==void 0?this.customCellView=this.columnDefinition.cellTemplate.render(this,this):this.customCellView=wi.render(this,this);break}}disconnectCellView(){this.customCellView!==null&&(this.customCellView.dispose(),this.customCellView=null)}};u([p({attribute:"cell-type"})],j.prototype,"cellType",void 0);u([p({attribute:"grid-column"})],j.prototype,"gridColumn",void 0);u([b],j.prototype,"rowData",void 0);u([b],j.prototype,"columnDefinition",void 0);function ki(o){let e=o.tagFor(j);return x`
    <${e}
        cell-type="${t=>t.isRowHeader?"rowheader":void 0}"
        grid-column="${(t,r)=>r.index+1}"
        :rowData="${(t,r)=>r.parent.rowData}"
        :columnDefinition="${t=>t}"
    ></${e}>
`}function $i(o){let e=o.tagFor(j);return x`
    <${e}
        cell-type="columnheader"
        grid-column="${(t,r)=>r.index+1}"
        :columnDefinition="${t=>t}"
    ></${e}>
`}var qr=(o,e)=>{let t=ki(o),r=$i(o);return x`
        <template
            role="row"
            class="${n=>n.rowType!=="default"?n.rowType:""}"
            :defaultCellItemTemplate="${t}"
            :defaultHeaderCellItemTemplate="${r}"
            ${rt({property:"cellElements",filter:je('[role="cell"],[role="gridcell"],[role="columnheader"],[role="rowheader"]')})}
        >
            <slot ${de("slottedCellElements")}></slot>
        </template>
    `};var Gr=(o,e)=>x`
        <template
            tabindex="-1"
            role="${t=>!t.cellType||t.cellType==="default"?"gridcell":t.cellType}"
            class="
            ${t=>t.cellType==="columnheader"?"column-header":t.cellType==="rowheader"?"row-header":""}
            "
        >
            <slot></slot>
        </template>
    `;function Ge(o){let e=o.parentElement;if(e)return e;{let t=o.getRootNode();if(t.host instanceof HTMLElement)return t.host}return null}function Wr(o,e){let t=e;for(;t!==null;){if(t===o)return!0;t=Ge(t)}return!1}var Q=document.createElement("div");function Ti(o){return o instanceof ce}var We=class{setProperty(e,t){g.queueUpdate(()=>this.target.setProperty(e,t))}removeProperty(e){g.queueUpdate(()=>this.target.removeProperty(e))}},co=class extends We{constructor(e){super();let t=new CSSStyleSheet;this.target=t.cssRules[t.insertRule(":host{}")].style,e.$fastController.addStyles(D.create([t]))}},uo=class extends We{constructor(){super();let e=new CSSStyleSheet;this.target=e.cssRules[e.insertRule(":root{}")].style,document.adoptedStyleSheets=[...document.adoptedStyleSheets,e]}},ho=class extends We{constructor(){super(),this.style=document.createElement("style"),document.head.appendChild(this.style);let{sheet:e}=this.style;if(e){let t=e.insertRule(":root{}",e.cssRules.length);this.target=e.cssRules[t].style}}},gt=class{constructor(e){this.store=new Map,this.target=null;let t=e.$fastController;this.style=document.createElement("style"),t.addStyles(this.style),v.getNotifier(t).subscribe(this,"isConnected"),this.handleChange(t,"isConnected")}targetChanged(){if(this.target!==null)for(let[e,t]of this.store.entries())this.target.setProperty(e,t)}setProperty(e,t){this.store.set(e,t),g.queueUpdate(()=>{this.target!==null&&this.target.setProperty(e,t)})}removeProperty(e){this.store.delete(e),g.queueUpdate(()=>{this.target!==null&&this.target.removeProperty(e)})}handleChange(e,t){let{sheet:r}=this.style;if(r){let n=r.insertRule(":host{}",r.cssRules.length);this.target=r.cssRules[n].style}else this.target=null}};u([b],gt.prototype,"target",void 0);var po=class{constructor(e){this.target=e.style}setProperty(e,t){g.queueUpdate(()=>this.target.setProperty(e,t))}removeProperty(e){g.queueUpdate(()=>this.target.removeProperty(e))}},O=class{setProperty(e,t){O.properties[e]=t;for(let r of O.roots.values())we.getOrCreate(O.normalizeRoot(r)).setProperty(e,t)}removeProperty(e){delete O.properties[e];for(let t of O.roots.values())we.getOrCreate(O.normalizeRoot(t)).removeProperty(e)}static registerRoot(e){let{roots:t}=O;if(!t.has(e)){t.add(e);let r=we.getOrCreate(this.normalizeRoot(e));for(let n in O.properties)r.setProperty(n,O.properties[n])}}static unregisterRoot(e){let{roots:t}=O;if(t.has(e)){t.delete(e);let r=we.getOrCreate(O.normalizeRoot(e));for(let n in O.properties)r.removeProperty(n)}}static normalizeRoot(e){return e===Q?document:e}};O.roots=new Set;O.properties={};var lo=new WeakMap,Si=g.supportsAdoptedStyleSheets?co:gt,we=Object.freeze({getOrCreate(o){if(lo.has(o))return lo.get(o);let e;return o===Q?e=new O:o instanceof Document?e=g.supportsAdoptedStyleSheets?new uo:new ho:Ti(o)?e=new Si(o):e=new po(o),lo.set(o,e),e}});var A=class extends ge{constructor(e){super(),this.subscribers=new WeakMap,this._appliedTo=new Set,this.name=e.name,e.cssCustomPropertyName!==null&&(this.cssCustomProperty=`--${e.cssCustomPropertyName}`,this.cssVar=`var(${this.cssCustomProperty})`),this.id=A.uniqueId(),A.tokensById.set(this.id,this)}get appliedTo(){return[...this._appliedTo]}static from(e){return new A({name:typeof e=="string"?e:e.name,cssCustomPropertyName:typeof e=="string"?e:e.cssCustomPropertyName===void 0?e.name:e.cssCustomPropertyName})}static isCSSDesignToken(e){return typeof e.cssCustomProperty=="string"}static isDerivedDesignTokenValue(e){return typeof e=="function"}static getTokenById(e){return A.tokensById.get(e)}getOrCreateSubscriberSet(e=this){return this.subscribers.get(e)||this.subscribers.set(e,new Set)&&this.subscribers.get(e)}createCSS(){return this.cssVar||""}getValueFor(e){let t=T.getOrCreate(e).get(this);if(t!==void 0)return t;throw new Error(`Value could not be retrieved for token named "${this.name}". Ensure the value is set for ${e} or an ancestor of ${e}.`)}setValueFor(e,t){return this._appliedTo.add(e),t instanceof A&&(t=this.alias(t)),T.getOrCreate(e).set(this,t),this}deleteValueFor(e){return this._appliedTo.delete(e),T.existsFor(e)&&T.getOrCreate(e).delete(this),this}withDefault(e){return this.setValueFor(Q,e),this}subscribe(e,t){let r=this.getOrCreateSubscriberSet(t);t&&!T.existsFor(t)&&T.getOrCreate(t),r.has(e)||r.add(e)}unsubscribe(e,t){let r=this.subscribers.get(t||this);r&&r.has(e)&&r.delete(e)}notify(e){let t=Object.freeze({token:this,target:e});this.subscribers.has(this)&&this.subscribers.get(this).forEach(r=>r.handleChange(t)),this.subscribers.has(e)&&this.subscribers.get(e).forEach(r=>r.handleChange(t))}alias(e){return t=>e.getValueFor(t)}};A.uniqueId=(()=>{let o=0;return()=>(o++,o.toString(16))})();A.tokensById=new Map;var fo=class{startReflection(e,t){e.subscribe(this,t),this.handleChange({token:e,target:t})}stopReflection(e,t){e.unsubscribe(this,t),this.remove(e,t)}handleChange(e){let{token:t,target:r}=e;this.add(t,r)}add(e,t){we.getOrCreate(t).setProperty(e.cssCustomProperty,this.resolveCSSValue(T.getOrCreate(t).get(e)))}remove(e,t){we.getOrCreate(t).removeProperty(e.cssCustomProperty)}resolveCSSValue(e){return e&&typeof e.createCSS=="function"?e.createCSS():e}},mo=class{constructor(e,t,r){this.source=e,this.token=t,this.node=r,this.dependencies=new Set,this.observer=v.binding(e,this,!1),this.observer.handleChange=this.observer.call,this.handleChange()}disconnect(){this.observer.disconnect()}handleChange(){this.node.store.set(this.token,this.observer.observe(this.node.target,se))}},go=class{constructor(){this.values=new Map}set(e,t){this.values.get(e)!==t&&(this.values.set(e,t),v.getNotifier(this).notify(e.id))}get(e){return v.track(this,e.id),this.values.get(e)}delete(e){this.values.delete(e)}all(){return this.values.entries()}},Qe=new WeakMap,Ze=new WeakMap,T=class{constructor(e){this.target=e,this.store=new go,this.children=[],this.assignedValues=new Map,this.reflecting=new Set,this.bindingObservers=new Map,this.tokenValueChangeHandler={handleChange:(t,r)=>{let n=A.getTokenById(r);if(n&&(n.notify(this.target),A.isCSSDesignToken(n))){let i=this.parent,s=this.isReflecting(n);if(i){let a=i.get(n),l=t.get(n);a!==l&&!s?this.reflectToCSS(n):a===l&&s&&this.stopReflectToCSS(n)}else s||this.reflectToCSS(n)}}},Qe.set(e,this),v.getNotifier(this.store).subscribe(this.tokenValueChangeHandler),e instanceof ce?e.$fastController.addBehaviors([this]):e.isConnected&&this.bind()}static getOrCreate(e){return Qe.get(e)||new T(e)}static existsFor(e){return Qe.has(e)}static findParent(e){if(Q!==e.target){let t=Ge(e.target);for(;t!==null;){if(Qe.has(t))return Qe.get(t);t=Ge(t)}return T.getOrCreate(Q)}return null}static findClosestAssignedNode(e,t){let r=t;do{if(r.has(e))return r;r=r.parent?r.parent:r.target!==Q?T.getOrCreate(Q):null}while(r!==null);return null}get parent(){return Ze.get(this)||null}has(e){return this.assignedValues.has(e)}get(e){let t=this.store.get(e);if(t!==void 0)return t;let r=this.getRaw(e);if(r!==void 0)return this.hydrate(e,r),this.get(e)}getRaw(e){var t;return this.assignedValues.has(e)?this.assignedValues.get(e):(t=T.findClosestAssignedNode(e,this))===null||t===void 0?void 0:t.getRaw(e)}set(e,t){A.isDerivedDesignTokenValue(this.assignedValues.get(e))&&this.tearDownBindingObserver(e),this.assignedValues.set(e,t),A.isDerivedDesignTokenValue(t)?this.setupBindingObserver(e,t):this.store.set(e,t)}delete(e){this.assignedValues.delete(e),this.tearDownBindingObserver(e);let t=this.getRaw(e);t?this.hydrate(e,t):this.store.delete(e)}bind(){let e=T.findParent(this);e&&e.appendChild(this);for(let t of this.assignedValues.keys())t.notify(this.target)}unbind(){this.parent&&Ze.get(this).removeChild(this)}appendChild(e){e.parent&&Ze.get(e).removeChild(e);let t=this.children.filter(r=>e.contains(r));Ze.set(e,this),this.children.push(e),t.forEach(r=>e.appendChild(r)),v.getNotifier(this.store).subscribe(e);for(let[r,n]of this.store.all())e.hydrate(r,this.bindingObservers.has(r)?this.getRaw(r):n)}removeChild(e){let t=this.children.indexOf(e);return t!==-1&&this.children.splice(t,1),v.getNotifier(this.store).unsubscribe(e),e.parent===this?Ze.delete(e):!1}contains(e){return Wr(this.target,e.target)}reflectToCSS(e){this.isReflecting(e)||(this.reflecting.add(e),T.cssCustomPropertyReflector.startReflection(e,this.target))}stopReflectToCSS(e){this.isReflecting(e)&&(this.reflecting.delete(e),T.cssCustomPropertyReflector.stopReflection(e,this.target))}isReflecting(e){return this.reflecting.has(e)}handleChange(e,t){let r=A.getTokenById(t);r&&this.hydrate(r,this.getRaw(r))}hydrate(e,t){if(!this.has(e)){let r=this.bindingObservers.get(e);A.isDerivedDesignTokenValue(t)?r?r.source!==t&&(this.tearDownBindingObserver(e),this.setupBindingObserver(e,t)):this.setupBindingObserver(e,t):(r&&this.tearDownBindingObserver(e),this.store.set(e,t))}}setupBindingObserver(e,t){let r=new mo(t,e,this);return this.bindingObservers.set(e,r),r}tearDownBindingObserver(e){return this.bindingObservers.has(e)?(this.bindingObservers.get(e).disconnect(),this.bindingObservers.delete(e),!0):!1}};T.cssCustomPropertyReflector=new fo;u([b],T.prototype,"children",void 0);function Di(o){return A.from(o)}var Xe=Object.freeze({create:Di,notifyConnection(o){return!o.isConnected||!T.existsFor(o)?!1:(T.getOrCreate(o).bind(),!0)},notifyDisconnection(o){return o.isConnected||!T.existsFor(o)?!1:(T.getOrCreate(o).unbind(),!0)},registerRoot(o=Q){O.registerRoot(o)},unregisterRoot(o=Q){O.unregisterRoot(o)}});var bo=Object.freeze({definitionCallbackOnly:null,ignoreDuplicate:Symbol()}),vo=new Map,bt=new Map,Ae=null,Je=y.createInterface(o=>o.cachedCallback(e=>(Ae===null&&(Ae=new vt(null,e)),Ae))),xo=Object.freeze({tagFor(o){return bt.get(o)},responsibleFor(o){let e=o.$$designSystem$$;return e||y.findResponsibleContainer(o).get(Je)},getOrCreate(o){if(!o)return Ae===null&&(Ae=y.getOrCreateDOMContainer().get(Je)),Ae;let e=o.$$designSystem$$;if(e)return e;let t=y.getOrCreateDOMContainer(o);if(t.has(Je,!1))return t.get(Je);{let r=new vt(o,t);return t.register(ve.instance(Je,r)),r}}});function Ei(o,e,t){return typeof o=="string"?{name:o,type:e,callback:t}:o}var vt=class{constructor(e,t){this.owner=e,this.container=t,this.designTokensInitialized=!1,this.prefix="fast",this.shadowRootMode=void 0,this.disambiguate=()=>bo.definitionCallbackOnly,e!==null&&(e.$$designSystem$$=this)}withPrefix(e){return this.prefix=e,this}withShadowRootMode(e){return this.shadowRootMode=e,this}withElementDisambiguation(e){return this.disambiguate=e,this}withDesignTokenRoot(e){return this.designTokenRoot=e,this}register(...e){let t=this.container,r=[],n=this.disambiguate,i=this.shadowRootMode,s={elementPrefix:this.prefix,tryDefineElement(a,l,c){let d=Ei(a,l,c),{name:h,callback:m,baseClass:$}=d,{type:C}=d,I=h,q=vo.get(I),Me=!0;for(;q;){let re=n(I,C,q);switch(re){case bo.ignoreDuplicate:return;case bo.definitionCallbackOnly:Me=!1,q=void 0;break;default:I=re,q=vo.get(I);break}}Me&&((bt.has(C)||C===k)&&(C=class extends C{}),vo.set(I,C),bt.set(C,I),$&&bt.set($,I)),r.push(new yo(t,I,C,i,m,Me))}};this.designTokensInitialized||(this.designTokensInitialized=!0,this.designTokenRoot!==null&&Xe.registerRoot(this.designTokenRoot)),t.registerWithContext(s,...e);for(let a of r)a.callback(a),a.willDefine&&a.definition!==null&&a.definition.define();return this}},yo=class{constructor(e,t,r,n,i,s){this.container=e,this.name=t,this.type=r,this.shadowRootMode=n,this.callback=i,this.willDefine=s,this.definition=null}definePresentation(e){dt.define(this.name,e,this.container)}defineElement(e){this.definition=new G(this.type,Object.assign(Object.assign({},e),{name:this.name}))}tagFor(e){return xo.tagFor(e)}};var Qr=(o,e)=>x`
    <template role="${t=>t.role}" aria-orientation="${t=>t.orientation}"></template>
`;var wo={separator:"separator",presentation:"presentation"};var Be=class extends k{constructor(){super(...arguments),this.role=wo.separator,this.orientation=Tr.horizontal}};u([p],Be.prototype,"role",void 0);u([p],Be.prototype,"orientation",void 0);var Co=class extends k{},yt=class extends ft(Co){constructor(){super(...arguments),this.proxy=document.createElement("input")}};var ko={email:"email",password:"password",tel:"tel",text:"text",url:"url"};var B=class extends yt{constructor(){super(...arguments),this.type=ko.text}readOnlyChanged(){this.proxy instanceof HTMLInputElement&&(this.proxy.readOnly=this.readOnly,this.validate())}autofocusChanged(){this.proxy instanceof HTMLInputElement&&(this.proxy.autofocus=this.autofocus,this.validate())}placeholderChanged(){this.proxy instanceof HTMLInputElement&&(this.proxy.placeholder=this.placeholder)}typeChanged(){this.proxy instanceof HTMLInputElement&&(this.proxy.type=this.type,this.validate())}listChanged(){this.proxy instanceof HTMLInputElement&&(this.proxy.setAttribute("list",this.list),this.validate())}maxlengthChanged(){this.proxy instanceof HTMLInputElement&&(this.proxy.maxLength=this.maxlength,this.validate())}minlengthChanged(){this.proxy instanceof HTMLInputElement&&(this.proxy.minLength=this.minlength,this.validate())}patternChanged(){this.proxy instanceof HTMLInputElement&&(this.proxy.pattern=this.pattern,this.validate())}sizeChanged(){this.proxy instanceof HTMLInputElement&&(this.proxy.size=this.size)}spellcheckChanged(){this.proxy instanceof HTMLInputElement&&(this.proxy.spellcheck=this.spellcheck)}connectedCallback(){super.connectedCallback(),this.proxy.setAttribute("type",this.type),this.validate(),this.autofocus&&g.queueUpdate(()=>{this.focus()})}select(){this.control.select(),this.$emit("select")}handleTextInput(){this.value=this.control.value}handleChange(){this.$emit("change")}validate(){super.validate(this.control)}};u([p({attribute:"readonly",mode:"boolean"})],B.prototype,"readOnly",void 0);u([p({mode:"boolean"})],B.prototype,"autofocus",void 0);u([p],B.prototype,"placeholder",void 0);u([p],B.prototype,"type",void 0);u([p],B.prototype,"list",void 0);u([p({converter:ot})],B.prototype,"maxlength",void 0);u([p({converter:ot})],B.prototype,"minlength",void 0);u([p],B.prototype,"pattern",void 0);u([p({converter:ot})],B.prototype,"size",void 0);u([p({mode:"boolean"})],B.prototype,"spellcheck",void 0);u([b],B.prototype,"defaultSlottedNodes",void 0);var xt=class{};Y(xt,w);Y(B,ue,xt);function Zr(o,e,t){return o.nodeType!==Node.TEXT_NODE?!0:typeof o.nodeValue=="string"&&!!o.nodeValue.trim().length}var Xr=(o,e)=>x`
    <template
        class="
            ${t=>t.readOnly?"readonly":""}
        "
    >
        <label
            part="label"
            for="control"
            class="${t=>t.defaultSlottedNodes&&t.defaultSlottedNodes.length?"label":"label label__hidden"}"
        >
            <slot
                ${de({property:"defaultSlottedNodes",filter:Zr})}
            ></slot>
        </label>
        <div class="root" part="root">
            ${Re(o,e)}
            <input
                class="control"
                part="control"
                id="control"
                @input="${t=>t.handleTextInput()}"
                @change="${t=>t.handleChange()}"
                ?autofocus="${t=>t.autofocus}"
                ?disabled="${t=>t.disabled}"
                list="${t=>t.list}"
                maxlength="${t=>t.maxlength}"
                minlength="${t=>t.minlength}"
                pattern="${t=>t.pattern}"
                placeholder="${t=>t.placeholder}"
                ?readonly="${t=>t.readOnly}"
                ?required="${t=>t.required}"
                size="${t=>t.size}"
                ?spellcheck="${t=>t.spellcheck}"
                :value="${t=>t.value}"
                type="${t=>t.type}"
                aria-atomic="${t=>t.ariaAtomic}"
                aria-busy="${t=>t.ariaBusy}"
                aria-controls="${t=>t.ariaControls}"
                aria-current="${t=>t.ariaCurrent}"
                aria-describedby="${t=>t.ariaDescribedby}"
                aria-details="${t=>t.ariaDetails}"
                aria-disabled="${t=>t.ariaDisabled}"
                aria-errormessage="${t=>t.ariaErrormessage}"
                aria-flowto="${t=>t.ariaFlowto}"
                aria-haspopup="${t=>t.ariaHaspopup}"
                aria-hidden="${t=>t.ariaHidden}"
                aria-invalid="${t=>t.ariaInvalid}"
                aria-keyshortcuts="${t=>t.ariaKeyshortcuts}"
                aria-label="${t=>t.ariaLabel}"
                aria-labelledby="${t=>t.ariaLabelledby}"
                aria-live="${t=>t.ariaLive}"
                aria-owns="${t=>t.ariaOwns}"
                aria-relevant="${t=>t.ariaRelevant}"
                aria-roledescription="${t=>t.ariaRoledescription}"
                ${_("control")}
            />
            ${Pe(o,e)}
        </div>
    </template>
`;var wt="not-allowed";var Oi=":host([hidden]){display:none}";function Z(o){return`${Oi}:host{display:${o}}`}var U=Dr()?"focus-visible":"focus";function Jr(o){return xo.getOrCreate(o).withPrefix("vscode")}function Kr(o){window.addEventListener("load",()=>{new MutationObserver(()=>{Yr(o)}).observe(document.body,{attributes:!0,attributeFilter:["class"]}),Yr(o)})}function Yr(o){let e=getComputedStyle(document.body),t=document.querySelector("body");if(t){let r=t.getAttribute("data-vscode-theme-kind");for(let[n,i]of o){let s=e.getPropertyValue(n).toString();if(r==="vscode-high-contrast")s.length===0&&i.name.includes("background")&&(s="transparent"),i.name==="button-icon-hover-background"&&(s="transparent");else if(r==="vscode-high-contrast-light"){if(s.length===0&&i.name.includes("background"))switch(i.name){case"button-primary-hover-background":s="#0F4A85";break;case"button-secondary-hover-background":s="transparent";break;case"button-icon-hover-background":s="transparent";break}}else i.name==="contrast-active-border"&&(s="transparent");i.setValueFor(t,s)}}}var en=new Map,tn=!1;function f(o,e){let t=Xe.create(o);if(e){if(e.includes("--fake-vscode-token")){let r="id"+Math.random().toString(16).slice(2);e=`${e}-${r}`}en.set(e,t)}return tn||(Kr(en),tn=!0),t}var on=f("background","--vscode-editor-background").withDefault("#1e1e1e"),P=f("border-width").withDefault(1),Ct=f("contrast-active-border","--vscode-contrastActiveBorder").withDefault("#f38518"),hu=f("contrast-border","--vscode-contrastBorder").withDefault("#6fc3df"),kt=f("corner-radius").withDefault(0),$t=f("corner-radius-round").withDefault(2),F=f("design-unit").withDefault(4),Tt=f("disabled-opacity").withDefault(.4),z=f("focus-border","--vscode-focusBorder").withDefault("#007fd4"),X=f("font-family","--vscode-font-family").withDefault("-apple-system, BlinkMacSystemFont, Segoe UI, Roboto, Helvetica, Arial, sans-serif, Apple Color Emoji, Segoe UI Emoji, Segoe UI Symbol"),pu=f("font-weight","--vscode-font-weight").withDefault("400"),_e=f("foreground","--vscode-foreground").withDefault("#cccccc"),rn=f("input-height").withDefault("26"),nn=f("input-min-width").withDefault("100px"),te=f("type-ramp-base-font-size","--vscode-font-size").withDefault("13px"),oe=f("type-ramp-base-line-height").withDefault("normal"),sn=f("type-ramp-minus1-font-size").withDefault("11px"),an=f("type-ramp-minus1-line-height").withDefault("16px"),fu=f("type-ramp-minus2-font-size").withDefault("9px"),mu=f("type-ramp-minus2-line-height").withDefault("16px"),gu=f("type-ramp-plus1-font-size").withDefault("16px"),bu=f("type-ramp-plus1-line-height").withDefault("24px"),vu=f("scrollbarWidth").withDefault("10px"),yu=f("scrollbarHeight").withDefault("10px"),xu=f("scrollbar-slider-background","--vscode-scrollbarSlider-background").withDefault("#79797966"),wu=f("scrollbar-slider-hover-background","--vscode-scrollbarSlider-hoverBackground").withDefault("#646464b3"),Cu=f("scrollbar-slider-active-background","--vscode-scrollbarSlider-activeBackground").withDefault("#bfbfbf66"),ln=f("badge-background","--vscode-badge-background").withDefault("#4d4d4d"),cn=f("badge-foreground","--vscode-badge-foreground").withDefault("#ffffff"),St=f("button-border","--vscode-button-border").withDefault("transparent"),$o=f("button-icon-background").withDefault("transparent"),dn=f("button-icon-corner-radius").withDefault("5px"),un=f("button-icon-outline-offset").withDefault(0),To=f("button-icon-hover-background","--fake-vscode-token").withDefault("rgba(90, 93, 94, 0.31)"),hn=f("button-icon-padding").withDefault("3px"),Ce=f("button-primary-background","--vscode-button-background").withDefault("#0e639c"),So=f("button-primary-foreground","--vscode-button-foreground").withDefault("#ffffff"),Do=f("button-primary-hover-background","--vscode-button-hoverBackground").withDefault("#1177bb"),Dt=f("button-secondary-background","--vscode-button-secondaryBackground").withDefault("#3a3d41"),pn=f("button-secondary-foreground","--vscode-button-secondaryForeground").withDefault("#ffffff"),fn=f("button-secondary-hover-background","--vscode-button-secondaryHoverBackground").withDefault("#45494e"),mn=f("button-padding-horizontal").withDefault("11px"),gn=f("button-padding-vertical").withDefault("4px"),ku=f("checkbox-background","--vscode-checkbox-background").withDefault("#3c3c3c"),$u=f("checkbox-border","--vscode-checkbox-border").withDefault("#3c3c3c"),Tu=f("checkbox-corner-radius").withDefault(3),Su=f("checkbox-foreground","--vscode-checkbox-foreground").withDefault("#f0f0f0"),bn=f("list-active-selection-background","--vscode-list-activeSelectionBackground").withDefault("#094771"),Eo=f("list-active-selection-foreground","--vscode-list-activeSelectionForeground").withDefault("#ffffff"),vn=f("list-hover-background","--vscode-list-hoverBackground").withDefault("#2a2d2e"),yn=f("divider-background","--vscode-settings-dropdownListBorder").withDefault("#454545"),Du=f("dropdown-background","--vscode-dropdown-background").withDefault("#3c3c3c"),Et=f("dropdown-border","--vscode-dropdown-border").withDefault("#3c3c3c"),Eu=f("dropdown-foreground","--vscode-dropdown-foreground").withDefault("#f0f0f0"),Ou=f("dropdown-list-max-height").withDefault("200px"),Ot=f("input-background","--vscode-input-background").withDefault("#3c3c3c"),xn=f("input-foreground","--vscode-input-foreground").withDefault("#cccccc"),Pu=f("input-placeholder-foreground","--vscode-input-placeholderForeground").withDefault("#cccccc"),Oo=f("link-active-foreground","--vscode-textLink-activeForeground").withDefault("#3794ff"),wn=f("link-foreground","--vscode-textLink-foreground").withDefault("#3794ff"),Ru=f("progress-background","--vscode-progressBar-background").withDefault("#0e70c0"),Fu=f("panel-tab-active-border","--vscode-panelTitle-activeBorder").withDefault("#e7e7e7"),Iu=f("panel-tab-active-foreground","--vscode-panelTitle-activeForeground").withDefault("#e7e7e7"),Au=f("panel-tab-foreground","--vscode-panelTitle-inactiveForeground").withDefault("#e7e7e799"),Bu=f("panel-view-background","--vscode-panel-background").withDefault("#1e1e1e"),_u=f("panel-view-border","--vscode-panel-border").withDefault("#80808059"),Cn=f("tag-corner-radius").withDefault("2px");function kn(o,e,t,r){var n=arguments.length,i=n<3?e:r===null?r=Object.getOwnPropertyDescriptor(e,t):r,s;if(typeof Reflect=="object"&&typeof Reflect.decorate=="function")i=Reflect.decorate(o,e,t,r);else for(var a=o.length-1;a>=0;a--)(s=o[a])&&(i=(n<3?s(i):n>3?s(e,t,i):s(e,t))||i);return n>3&&i&&Object.defineProperty(e,t,i),i}var Pi=E`
	${Z("inline-flex")} :host {
		outline: none;
		font-family: ${X};
		font-size: ${te};
		line-height: ${oe};
		color: ${So};
		background: ${Ce};
		border-radius: calc(${$t} * 1px);
		fill: currentColor;
		cursor: pointer;
	}
	.control {
		background: transparent;
		height: inherit;
		flex-grow: 1;
		box-sizing: border-box;
		display: inline-flex;
		justify-content: center;
		align-items: center;
		padding: ${gn} ${mn};
		white-space: wrap;
		outline: none;
		text-decoration: none;
		border: calc(${P} * 1px) solid ${St};
		color: inherit;
		border-radius: inherit;
		fill: inherit;
		cursor: inherit;
		font-family: inherit;
	}
	:host(:hover) {
		background: ${Do};
	}
	:host(:active) {
		background: ${Ce};
	}
	.control:${U} {
		outline: calc(${P} * 1px) solid ${z};
		outline-offset: calc(${P} * 2px);
	}
	.control::-moz-focus-inner {
		border: 0;
	}
	:host([disabled]) {
		opacity: ${Tt};
		background: ${Ce};
		cursor: ${wt};
	}
	.content {
		display: flex;
	}
	.start {
		display: flex;
	}
	::slotted(svg),
	::slotted(span) {
		width: calc(${F} * 4px);
		height: calc(${F} * 4px);
	}
	.start {
		margin-inline-end: 8px;
	}
`,Ri=E`
	:host([appearance='primary']) {
		background: ${Ce};
		color: ${So};
	}
	:host([appearance='primary']:hover) {
		background: ${Do};
	}
	:host([appearance='primary']:active) .control:active {
		background: ${Ce};
	}
	:host([appearance='primary']) .control:${U} {
		outline: calc(${P} * 1px) solid ${z};
		outline-offset: calc(${P} * 2px);
	}
	:host([appearance='primary'][disabled]) {
		background: ${Ce};
	}
`,Fi=E`
	:host([appearance='secondary']) {
		background: ${Dt};
		color: ${pn};
	}
	:host([appearance='secondary']:hover) {
		background: ${fn};
	}
	:host([appearance='secondary']:active) .control:active {
		background: ${Dt};
	}
	:host([appearance='secondary']) .control:${U} {
		outline: calc(${P} * 1px) solid ${z};
		outline-offset: calc(${P} * 2px);
	}
	:host([appearance='secondary'][disabled]) {
		background: ${Dt};
	}
`,Ii=E`
	:host([appearance='icon']) {
		background: ${$o};
		border-radius: ${dn};
		color: ${_e};
	}
	:host([appearance='icon']:hover) {
		background: ${To};
		outline: 1px dotted ${Ct};
		outline-offset: -1px;
	}
	:host([appearance='icon']) .control {
		padding: ${hn};
		border: none;
	}
	:host([appearance='icon']:active) .control:active {
		background: ${To};
	}
	:host([appearance='icon']) .control:${U} {
		outline: calc(${P} * 1px) solid ${z};
		outline-offset: ${un};
	}
	:host([appearance='icon'][disabled]) {
		background: ${$o};
	}
`,$n=(o,e)=>E`
	${Pi}
	${Ri}
	${Fi}
	${Ii}
`;var Pt=class extends V{connectedCallback(){if(super.connectedCallback(),!this.appearance){let e=this.getAttribute("appearance");this.appearance=e}}attributeChangedCallback(e,t,r){e==="appearance"&&r==="icon"&&(this.getAttribute("aria-label")||(this.ariaLabel="Icon Button")),e==="aria-label"&&(this.ariaLabel=r),e==="disabled"&&(this.disabled=r!==null)}};kn([p],Pt.prototype,"appearance",void 0);var Po=Pt.compose({baseName:"button",template:Vr,styles:$n,shadowOptions:{delegatesFocus:!0}});var Tn=(o,e)=>E`
	:host {
		display: flex;
		position: relative;
		flex-direction: column;
		width: 100%;
	}
`;var Sn=(o,e)=>E`
	:host {
		display: grid;
		padding: calc((${F} / 4) * 1px) 0;
		box-sizing: border-box;
		width: 100%;
		background: transparent;
	}
	:host(.header) {
	}
	:host(.sticky-header) {
		background: ${on};
		position: sticky;
		top: 0;
	}
	:host(:hover) {
		background: ${vn};
		outline: 1px dotted ${Ct};
		outline-offset: -1px;
	}
`;var Dn=(o,e)=>E`
	:host {
		padding: calc(${F} * 1px) calc(${F} * 3px);
		color: ${_e};
		opacity: 1;
		box-sizing: border-box;
		font-family: ${X};
		font-size: ${te};
		line-height: ${oe};
		font-weight: 400;
		border: solid calc(${P} * 1px) transparent;
		border-radius: calc(${kt} * 1px);
		white-space: wrap;
		overflow-wrap: anywhere;
	}
	:host(.column-header) {
		font-weight: 600;
	}
	:host(:${U}),
	:host(:focus),
	:host(:active) {
		background: ${bn};
		border: solid calc(${P} * 1px) ${z};
		color: ${Eo};
		outline: none;
	}
	:host(:${U}) ::slotted(*),
	:host(:focus) ::slotted(*),
	:host(:active) ::slotted(*) {
		color: ${Eo} !important;
	}
`;var Ro=class extends S{connectedCallback(){super.connectedCallback(),this.getAttribute("aria-label")||this.setAttribute("aria-label","Data Grid")}},Ao=Ro.compose({baseName:"data-grid",baseClass:S,template:zr,styles:Tn}),Fo=class extends R{},Bo=Fo.compose({baseName:"data-grid-row",baseClass:R,template:qr,styles:Sn}),Io=class extends j{},_o=Io.compose({baseName:"data-grid-cell",baseClass:j,template:Gr,styles:Dn});var En=(o,e)=>E`
	${Z("block")} :host {
		border: none;
		border-top: calc(${P} * 1px) solid ${yn};
		box-sizing: content-box;
		height: 0;
		margin: calc(${F} * 1px) 0;
		width: 100%;
	}
`;var Lo=class extends Be{},Mo=Lo.compose({baseName:"divider",template:Qr,styles:En});var On=(o,e)=>E`
	${Z("inline-flex")} :host {
		background: transparent;
		box-sizing: border-box;
		color: ${wn};
		cursor: pointer;
		fill: currentcolor;
		font-family: ${X};
		font-size: ${te};
		line-height: ${oe};
		outline: none;
	}
	.control {
		background: transparent;
		border: calc(${P} * 1px) solid transparent;
		border-radius: calc(${kt} * 1px);
		box-sizing: border-box;
		color: inherit;
		cursor: inherit;
		fill: inherit;
		font-family: inherit;
		height: inherit;
		padding: 0;
		outline: none;
		text-decoration: none;
		word-break: break-word;
	}
	.control::-moz-focus-inner {
		border: 0;
	}
	:host(:hover) {
		color: ${Oo};
	}
	:host(:hover) .content {
		text-decoration: underline;
	}
	:host(:active) {
		background: transparent;
		color: ${Oo};
	}
	:host(:${U}) .control,
	:host(:focus) .control {
		border: calc(${P} * 1px) solid ${z};
	}
`;var Vo=class extends M{},Ho=Vo.compose({baseName:"link",template:Lr,styles:On,shadowOptions:{delegatesFocus:!0}});var Pn=(o,e)=>E`
	${Z("inline-block")} :host {
		box-sizing: border-box;
		font-family: ${X};
		font-size: ${sn};
		line-height: ${an};
	}
	.control {
		background-color: ${ln};
		border: calc(${P} * 1px) solid ${St};
		border-radius: ${Cn};
		color: ${cn};
		padding: calc(${F} * 0.5px) calc(${F} * 1px);
		text-transform: uppercase;
	}
`;var No=class extends xe{connectedCallback(){super.connectedCallback(),this.circular&&(this.circular=!1)}},jo=No.compose({baseName:"tag",template:Mr,styles:Pn});var Rn=(o,e)=>E`
	${Z("inline-block")} :host {
		font-family: ${X};
		outline: none;
		user-select: none;
	}
	.root {
		box-sizing: border-box;
		position: relative;
		display: flex;
		flex-direction: row;
		color: ${xn};
		background: ${Ot};
		border-radius: calc(${$t} * 1px);
		border: calc(${P} * 1px) solid ${Et};
		height: calc(${rn} * 1px);
		min-width: ${nn};
	}
	.control {
		-webkit-appearance: none;
		font: inherit;
		background: transparent;
		border: 0;
		color: inherit;
		height: calc(100% - (${F} * 1px));
		width: 100%;
		margin-top: auto;
		margin-bottom: auto;
		border: none;
		padding: 0 calc(${F} * 2px + 1px);
		font-size: ${te};
		line-height: ${oe};
	}
	.control:hover,
	.control:${U},
	.control:disabled,
	.control:active {
		outline: none;
	}
	.label {
		display: block;
		color: ${_e};
		cursor: pointer;
		font-size: ${te};
		line-height: ${oe};
		margin-bottom: 2px;
	}
	.label__hidden {
		display: none;
		visibility: hidden;
	}
	.start,
	.end {
		display: flex;
		margin: auto;
		fill: currentcolor;
	}
	::slotted(svg),
	::slotted(span) {
		width: calc(${F} * 4px);
		height: calc(${F} * 4px);
	}
	.start {
		margin-inline-start: calc(${F} * 2px);
	}
	.end {
		margin-inline-end: calc(${F} * 2px);
	}
	:host(:hover:not([disabled])) .root {
		background: ${Ot};
		border-color: ${Et};
	}
	:host(:active:not([disabled])) .root {
		background: ${Ot};
		border-color: ${z};
	}
	:host(:focus-within:not([disabled])) .root {
		border-color: ${z};
	}
	:host([disabled]) .label,
	:host([readonly]) .label,
	:host([readonly]) .control,
	:host([disabled]) .control {
		cursor: ${wt};
	}
	:host([disabled]) {
		opacity: ${Tt};
	}
	:host([disabled]) .control {
		border-color: ${Et};
	}
`;var Uo=class extends B{connectedCallback(){super.connectedCallback(),this.textContent?this.setAttribute("aria-label",this.textContent):this.setAttribute("aria-label","Text field")}},zo=Uo.compose({baseName:"text-field",template:Xr,styles:Rn,shadowOptions:{delegatesFocus:!0}});Jr().register(Po(),Ao(),_o(),Bo(),Mo(),zo(),jo(),Ho());var Ai=acquireVsCodeApi(),Le=[];function In(o){Le=o;let e=document.getElementById("basic-grid");if(e){for(;e.children.length>1;){let t=e.lastChild;t&&e.removeChild(t)}o.forEach(t=>{let r=document.createElement("vscode-data-grid-row");r.style.cursor="pointer",r.addEventListener("click",function(d){Ai.postMessage({command:"open",file:t.path,line:t.line})});let n=document.createElement("vscode-data-grid-cell");n.setAttribute("grid-column","1"),n.classList.add("numberCell"),n.textContent=t.index,r.appendChild(n);let i=document.createElement("vscode-data-grid-cell");i.setAttribute("grid-column","2"),i.textContent=t.total_delay.toFixed(3),r.appendChild(i);let s=document.createElement("vscode-data-grid-cell");s.setAttribute("grid-column","3"),s.textContent=t.incremental_delay.toFixed(3),r.appendChild(s);let a=document.createElement("vscode-data-grid-cell");a.setAttribute("grid-column","4");let l=document.createElement("vscode-link");l.textContent=t.cell_location,a.appendChild(l),r.appendChild(a);let c=document.createElement("vscode-data-grid-cell");c.setAttribute("grid-column","5"),c.textContent=t.name,r.appendChild(c),e.appendChild(r)})}}window.addEventListener("message",o=>{let e=o.data;switch(e.command){case"update":In(e.pathDetails);break}});var Bi=["h0","h1","h2","h3","h4"],Fn={};for(let o of Bi){let e=document.getElementById(o);e&&e.addEventListener("click",function(){_i(parseInt(o[1]),e)})}function Ye(o,e,t){o==="asc"?t?Le.sort((r,n)=>r[e].localeCompare(n[e])):Le.sort((r,n)=>r[e]-n[e]):t?Le.sort((r,n)=>n[e].localeCompare(r[e])):Le.sort((r,n)=>n[e]-r[e])}function _i(o,e){let t=Fn[o]==="asc"?"desc":"asc";Fn[o]=t,Li(),o===0?Ye(t,"index",!1):o===1?Ye(t,"levelsNumber",!1):o===2?Ye(t,"slack",!1):o===3?Ye(t,"fromNodeName",!0):o===4&&Ye(t,"toNodeName",!0),In(Le),Mi(e,t)}function Li(){var o=document.querySelectorAll(".sorting");o.forEach(function(e){e.innerHTML="&#8597;"})}function Mi(o,e){var t=o.querySelector(".sorting");t.innerHTML=e==="asc"?"&#8593;":"&#8595;"}
/*! Bundled license information:

tslib/tslib.es6.js:
  (*! *****************************************************************************
  Copyright (c) Microsoft Corporation.
  
  Permission to use, copy, modify, and/or distribute this software for any
  purpose with or without fee is hereby granted.
  
  THE SOFTWARE IS PROVIDED "AS IS" AND THE AUTHOR DISCLAIMS ALL WARRANTIES WITH
  REGARD TO THIS SOFTWARE INCLUDING ALL IMPLIED WARRANTIES OF MERCHANTABILITY
  AND FITNESS. IN NO EVENT SHALL THE AUTHOR BE LIABLE FOR ANY SPECIAL, DIRECT,
  INDIRECT, OR CONSEQUENTIAL DAMAGES OR ANY DAMAGES WHATSOEVER RESULTING FROM
  LOSS OF USE, DATA OR PROFITS, WHETHER IN AN ACTION OF CONTRACT, NEGLIGENCE OR
  OTHER TORTIOUS ACTION, ARISING OUT OF OR IN CONNECTION WITH THE USE OR
  PERFORMANCE OF THIS SOFTWARE.
  ***************************************************************************** *)
*/
