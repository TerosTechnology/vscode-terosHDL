var te=function(){if(typeof globalThis<"u")return globalThis;if(typeof global<"u")return global;if(typeof self<"u")return self;if(typeof window<"u")return window;try{return new Function("return this")()}catch{return{}}}();te.trustedTypes===void 0&&(te.trustedTypes={createPolicy:(o,e)=>e});var rr={configurable:!1,enumerable:!1,writable:!1};te.FAST===void 0&&Reflect.defineProperty(te,"FAST",Object.assign({value:Object.create(null)},rr));var me=te.FAST;if(me.getById===void 0){let o=Object.create(null);Reflect.defineProperty(me,"getById",Object.assign({value(e,t){let r=o[e];return r===void 0&&(r=t?o[e]=t():null),r}},rr))}var j=Object.freeze([]);function nt(){let o=new WeakMap;return function(e){let t=o.get(e);if(t===void 0){let r=Reflect.getPrototypeOf(e);for(;t===void 0&&r!==null;)t=o.get(r),r=Reflect.getPrototypeOf(r);t=t===void 0?[]:t.slice(0),o.set(e,t)}return t}}var Bt=te.FAST.getById(1,()=>{let o=[],e=[];function t(){if(e.length)throw e.shift()}function r(s){try{s.call()}catch(a){e.push(a),setTimeout(t,0)}}function n(){let a=0;for(;a<o.length;)if(r(o[a]),a++,a>1024){for(let l=0,c=o.length-a;l<c;l++)o[l]=o[l+a];o.length-=a,a=0}o.length=0}function i(s){o.length<1&&te.requestAnimationFrame(n),o.push(s)}return Object.freeze({enqueue:i,process:n})}),nr=te.trustedTypes.createPolicy("fast-html",{createHTML:o=>o}),_t=nr,Ue=`fast-${Math.random().toString(36).substring(2,8)}`,Lt=`${Ue}{`,it=`}${Ue}`,g=Object.freeze({supportsAdoptedStyleSheets:Array.isArray(document.adoptedStyleSheets)&&"replace"in CSSStyleSheet.prototype,setHTMLPolicy(o){if(_t!==nr)throw new Error("The HTML policy can only be set once.");_t=o},createHTML(o){return _t.createHTML(o)},isMarker(o){return o&&o.nodeType===8&&o.data.startsWith(Ue)},extractDirectiveIndexFromMarker(o){return parseInt(o.data.replace(`${Ue}:`,""))},createInterpolationPlaceholder(o){return`${Lt}${o}${it}`},createCustomAttributePlaceholder(o,e){return`${o}="${this.createInterpolationPlaceholder(e)}"`},createBlockPlaceholder(o){return`<!--${Ue}:${o}-->`},queueUpdate:Bt.enqueue,processUpdates:Bt.process,nextUpdate(){return new Promise(Bt.enqueue)},setAttribute(o,e,t){t==null?o.removeAttribute(e):o.setAttribute(e,t)},setBooleanAttribute(o,e,t){t?o.setAttribute(e,""):o.removeAttribute(e)},removeChildNodes(o){for(let e=o.firstChild;e!==null;e=o.firstChild)o.removeChild(e)},createTemplateWalker(o){return document.createTreeWalker(o,133,null,!1)}});var ae=class{constructor(e,t){this.sub1=void 0,this.sub2=void 0,this.spillover=void 0,this.source=e,this.sub1=t}has(e){return this.spillover===void 0?this.sub1===e||this.sub2===e:this.spillover.indexOf(e)!==-1}subscribe(e){let t=this.spillover;if(t===void 0){if(this.has(e))return;if(this.sub1===void 0){this.sub1=e;return}if(this.sub2===void 0){this.sub2=e;return}this.spillover=[this.sub1,this.sub2,e],this.sub1=void 0,this.sub2=void 0}else t.indexOf(e)===-1&&t.push(e)}unsubscribe(e){let t=this.spillover;if(t===void 0)this.sub1===e?this.sub1=void 0:this.sub2===e&&(this.sub2=void 0);else{let r=t.indexOf(e);r!==-1&&t.splice(r,1)}}notify(e){let t=this.spillover,r=this.source;if(t===void 0){let n=this.sub1,i=this.sub2;n!==void 0&&n.handleChange(r,e),i!==void 0&&i.handleChange(r,e)}else for(let n=0,i=t.length;n<i;++n)t[n].handleChange(r,e)}},Ee=class{constructor(e){this.subscribers={},this.sourceSubscribers=null,this.source=e}notify(e){var t;let r=this.subscribers[e];r!==void 0&&r.notify(e),(t=this.sourceSubscribers)===null||t===void 0||t.notify(e)}subscribe(e,t){var r;if(t){let n=this.subscribers[t];n===void 0&&(this.subscribers[t]=n=new ae(this.source)),n.subscribe(e)}else this.sourceSubscribers=(r=this.sourceSubscribers)!==null&&r!==void 0?r:new ae(this.source),this.sourceSubscribers.subscribe(e)}unsubscribe(e,t){var r;if(t){let n=this.subscribers[t];n!==void 0&&n.unsubscribe(e)}else(r=this.sourceSubscribers)===null||r===void 0||r.unsubscribe(e)}};var v=me.getById(2,()=>{let o=/(:|&&|\|\||if)/,e=new WeakMap,t=g.queueUpdate,r,n=c=>{throw new Error("Must call enableArrayObservation before observing arrays.")};function i(c){let d=c.$fastController||e.get(c);return d===void 0&&(Array.isArray(c)?d=n(c):e.set(c,d=new Ee(c))),d}let s=nt();class a{constructor(d){this.name=d,this.field=`_${d}`,this.callback=`${d}Changed`}getValue(d){return r!==void 0&&r.watch(d,this.name),d[this.field]}setValue(d,h){let m=this.field,k=d[m];if(k!==h){d[m]=h;let $=d[this.callback];typeof $=="function"&&$.call(d,k,h),i(d).notify(this.name)}}}class l extends ae{constructor(d,h,m=!1){super(d,h),this.binding=d,this.isVolatileBinding=m,this.needsRefresh=!0,this.needsQueue=!0,this.first=this,this.last=null,this.propertySource=void 0,this.propertyName=void 0,this.notifier=void 0,this.next=void 0}observe(d,h){this.needsRefresh&&this.last!==null&&this.disconnect();let m=r;r=this.needsRefresh?this:void 0,this.needsRefresh=this.isVolatileBinding;let k=this.binding(d,h);return r=m,k}disconnect(){if(this.last!==null){let d=this.first;for(;d!==void 0;)d.notifier.unsubscribe(this,d.propertyName),d=d.next;this.last=null,this.needsRefresh=this.needsQueue=!0}}watch(d,h){let m=this.last,k=i(d),$=m===null?this.first:{};if($.propertySource=d,$.propertyName=h,$.notifier=k,k.subscribe(this,h),m!==null){if(!this.needsRefresh){let F;r=void 0,F=m.propertySource[m.propertyName],r=this,d===F&&(this.needsRefresh=!0)}m.next=$}this.last=$}handleChange(){this.needsQueue&&(this.needsQueue=!1,t(this))}call(){this.last!==null&&(this.needsQueue=!0,this.notify(this))}records(){let d=this.first;return{next:()=>{let h=d;return h===void 0?{value:void 0,done:!0}:(d=d.next,{value:h,done:!1})},[Symbol.iterator]:function(){return this}}}}return Object.freeze({setArrayObserverFactory(c){n=c},getNotifier:i,track(c,d){r!==void 0&&r.watch(c,d)},trackVolatile(){r!==void 0&&(r.needsRefresh=!0)},notify(c,d){i(c).notify(d)},defineProperty(c,d){typeof d=="string"&&(d=new a(d)),s(c).push(d),Reflect.defineProperty(c,d.name,{enumerable:!0,get:function(){return d.getValue(this)},set:function(h){d.setValue(this,h)}})},getAccessors:s,binding(c,d,h=this.isVolatileBinding(c)){return new l(c,d,h)},isVolatileBinding(c){return o.test(c.toString())}})});function b(o,e){v.defineProperty(o,e)}var ir=me.getById(3,()=>{let o=null;return{get(){return o},set(e){o=e}}}),le=class{constructor(){this.index=0,this.length=0,this.parent=null,this.parentContext=null}get event(){return ir.get()}get isEven(){return this.index%2===0}get isOdd(){return this.index%2!==0}get isFirst(){return this.index===0}get isInMiddle(){return!this.isFirst&&!this.isLast}get isLast(){return this.index===this.length-1}static setEvent(e){ir.set(e)}};v.defineProperty(le.prototype,"index");v.defineProperty(le.prototype,"length");var ce=Object.seal(new le);var de=class{constructor(){this.targetIndex=0}},Oe=class extends de{constructor(){super(...arguments),this.createPlaceholder=g.createInterpolationPlaceholder}},ue=class extends de{constructor(e,t,r){super(),this.name=e,this.behavior=t,this.options=r}createPlaceholder(e){return g.createCustomAttributePlaceholder(this.name,e)}createBehavior(e){return new this.behavior(e,this.options)}};function Yn(o,e){this.source=o,this.context=e,this.bindingObserver===null&&(this.bindingObserver=v.binding(this.binding,this,this.isBindingVolatile)),this.updateTarget(this.bindingObserver.observe(o,e))}function Kn(o,e){this.source=o,this.context=e,this.target.addEventListener(this.targetName,this)}function ei(){this.bindingObserver.disconnect(),this.source=null,this.context=null}function ti(){this.bindingObserver.disconnect(),this.source=null,this.context=null;let o=this.target.$fastView;o!==void 0&&o.isComposed&&(o.unbind(),o.needsBindOnly=!0)}function oi(){this.target.removeEventListener(this.targetName,this),this.source=null,this.context=null}function ri(o){g.setAttribute(this.target,this.targetName,o)}function ni(o){g.setBooleanAttribute(this.target,this.targetName,o)}function ii(o){if(o==null&&(o=""),o.create){this.target.textContent="";let e=this.target.$fastView;e===void 0?e=o.create():this.target.$fastTemplate!==o&&(e.isComposed&&(e.remove(),e.unbind()),e=o.create()),e.isComposed?e.needsBindOnly&&(e.needsBindOnly=!1,e.bind(this.source,this.context)):(e.isComposed=!0,e.bind(this.source,this.context),e.insertBefore(this.target),this.target.$fastView=e,this.target.$fastTemplate=o)}else{let e=this.target.$fastView;e!==void 0&&e.isComposed&&(e.isComposed=!1,e.remove(),e.needsBindOnly?e.needsBindOnly=!1:e.unbind()),this.target.textContent=o}}function si(o){this.target[this.targetName]=o}function ai(o){let e=this.classVersions||Object.create(null),t=this.target,r=this.version||0;if(o!=null&&o.length){let n=o.split(/\s+/);for(let i=0,s=n.length;i<s;++i){let a=n[i];a!==""&&(e[a]=r,t.classList.add(a))}}if(this.classVersions=e,this.version=r+1,r!==0){r-=1;for(let n in e)e[n]===r&&t.classList.remove(n)}}var ge=class extends Oe{constructor(e){super(),this.binding=e,this.bind=Yn,this.unbind=ei,this.updateTarget=ri,this.isBindingVolatile=v.isVolatileBinding(this.binding)}get targetName(){return this.originalTargetName}set targetName(e){if(this.originalTargetName=e,e!==void 0)switch(e[0]){case":":if(this.cleanedTargetName=e.substr(1),this.updateTarget=si,this.cleanedTargetName==="innerHTML"){let t=this.binding;this.binding=(r,n)=>g.createHTML(t(r,n))}break;case"?":this.cleanedTargetName=e.substr(1),this.updateTarget=ni;break;case"@":this.cleanedTargetName=e.substr(1),this.bind=Kn,this.unbind=oi;break;default:this.cleanedTargetName=e,e==="class"&&(this.updateTarget=ai);break}}targetAtContent(){this.updateTarget=ii,this.unbind=ti}createBehavior(e){return new Mt(e,this.binding,this.isBindingVolatile,this.bind,this.unbind,this.updateTarget,this.cleanedTargetName)}},Mt=class{constructor(e,t,r,n,i,s,a){this.source=null,this.context=null,this.bindingObserver=null,this.target=e,this.binding=t,this.isBindingVolatile=r,this.bind=n,this.unbind=i,this.updateTarget=s,this.targetName=a}handleChange(){this.updateTarget(this.bindingObserver.observe(this.source,this.context))}handleEvent(e){le.setEvent(e);let t=this.binding(this.source,this.context);le.setEvent(null),t!==!0&&e.preventDefault()}};var Vt=null,ze=class{addFactory(e){e.targetIndex=this.targetIndex,this.behaviorFactories.push(e)}captureContentBinding(e){e.targetAtContent(),this.addFactory(e)}reset(){this.behaviorFactories=[],this.targetIndex=-1}release(){Vt=this}static borrow(e){let t=Vt||new ze;return t.directives=e,t.reset(),Vt=null,t}};function li(o){if(o.length===1)return o[0];let e,t=o.length,r=o.map(s=>typeof s=="string"?()=>s:(e=s.targetName||e,s.binding)),n=(s,a)=>{let l="";for(let c=0;c<t;++c)l+=r[c](s,a);return l},i=new ge(n);return i.targetName=e,i}var ci=it.length;function ar(o,e){let t=e.split(Lt);if(t.length===1)return null;let r=[];for(let n=0,i=t.length;n<i;++n){let s=t[n],a=s.indexOf(it),l;if(a===-1)l=s;else{let c=parseInt(s.substring(0,a));r.push(o.directives[c]),l=s.substring(a+ci)}l!==""&&r.push(l)}return r}function sr(o,e,t=!1){let r=e.attributes;for(let n=0,i=r.length;n<i;++n){let s=r[n],a=s.value,l=ar(o,a),c=null;l===null?t&&(c=new ge(()=>a),c.targetName=s.name):c=li(l),c!==null&&(e.removeAttributeNode(s),n--,i--,o.addFactory(c))}}function di(o,e,t){let r=ar(o,e.textContent);if(r!==null){let n=e;for(let i=0,s=r.length;i<s;++i){let a=r[i],l=i===0?e:n.parentNode.insertBefore(document.createTextNode(""),n.nextSibling);typeof a=="string"?l.textContent=a:(l.textContent=" ",o.captureContentBinding(a)),n=l,o.targetIndex++,l!==e&&t.nextNode()}o.targetIndex--}}function lr(o,e){let t=o.content;document.adoptNode(t);let r=ze.borrow(e);sr(r,o,!0);let n=r.behaviorFactories;r.reset();let i=g.createTemplateWalker(t),s;for(;s=i.nextNode();)switch(r.targetIndex++,s.nodeType){case 1:sr(r,s);break;case 3:di(r,s,i);break;case 8:g.isMarker(s)&&r.addFactory(e[g.extractDirectiveIndexFromMarker(s)])}let a=0;(g.isMarker(t.firstChild)||t.childNodes.length===1&&e.length)&&(t.insertBefore(document.createComment(""),t.firstChild),a=-1);let l=r.behaviorFactories;return r.release(),{fragment:t,viewBehaviorFactories:l,hostBehaviorFactories:n,targetOffset:a}}var Ht=document.createRange(),Re=class{constructor(e,t){this.fragment=e,this.behaviors=t,this.source=null,this.context=null,this.firstChild=e.firstChild,this.lastChild=e.lastChild}appendTo(e){e.appendChild(this.fragment)}insertBefore(e){if(this.fragment.hasChildNodes())e.parentNode.insertBefore(this.fragment,e);else{let t=this.lastChild;if(e.previousSibling===t)return;let r=e.parentNode,n=this.firstChild,i;for(;n!==t;)i=n.nextSibling,r.insertBefore(n,e),n=i;r.insertBefore(t,e)}}remove(){let e=this.fragment,t=this.lastChild,r=this.firstChild,n;for(;r!==t;)n=r.nextSibling,e.appendChild(r),r=n;e.appendChild(t)}dispose(){let e=this.firstChild.parentNode,t=this.lastChild,r=this.firstChild,n;for(;r!==t;)n=r.nextSibling,e.removeChild(r),r=n;e.removeChild(t);let i=this.behaviors,s=this.source;for(let a=0,l=i.length;a<l;++a)i[a].unbind(s)}bind(e,t){let r=this.behaviors;if(this.source!==e)if(this.source!==null){let n=this.source;this.source=e,this.context=t;for(let i=0,s=r.length;i<s;++i){let a=r[i];a.unbind(n),a.bind(e,t)}}else{this.source=e,this.context=t;for(let n=0,i=r.length;n<i;++n)r[n].bind(e,t)}}unbind(){if(this.source===null)return;let e=this.behaviors,t=this.source;for(let r=0,n=e.length;r<n;++r)e[r].unbind(t);this.source=null}static disposeContiguousBatch(e){if(e.length!==0){Ht.setStartBefore(e[0].firstChild),Ht.setEndAfter(e[e.length-1].lastChild),Ht.deleteContents();for(let t=0,r=e.length;t<r;++t){let n=e[t],i=n.behaviors,s=n.source;for(let a=0,l=i.length;a<l;++a)i[a].unbind(s)}}}};var st=class{constructor(e,t){this.behaviorCount=0,this.hasHostBehaviors=!1,this.fragment=null,this.targetOffset=0,this.viewBehaviorFactories=null,this.hostBehaviorFactories=null,this.html=e,this.directives=t}create(e){if(this.fragment===null){let c,d=this.html;if(typeof d=="string"){c=document.createElement("template"),c.innerHTML=g.createHTML(d);let m=c.content.firstElementChild;m!==null&&m.tagName==="TEMPLATE"&&(c=m)}else c=d;let h=lr(c,this.directives);this.fragment=h.fragment,this.viewBehaviorFactories=h.viewBehaviorFactories,this.hostBehaviorFactories=h.hostBehaviorFactories,this.targetOffset=h.targetOffset,this.behaviorCount=this.viewBehaviorFactories.length+this.hostBehaviorFactories.length,this.hasHostBehaviors=this.hostBehaviorFactories.length>0}let t=this.fragment.cloneNode(!0),r=this.viewBehaviorFactories,n=new Array(this.behaviorCount),i=g.createTemplateWalker(t),s=0,a=this.targetOffset,l=i.nextNode();for(let c=r.length;s<c;++s){let d=r[s],h=d.targetIndex;for(;l!==null;)if(a===h){n[s]=d.createBehavior(l);break}else l=i.nextNode(),a++}if(this.hasHostBehaviors){let c=this.hostBehaviorFactories;for(let d=0,h=c.length;d<h;++d,++s)n[s]=c[d].createBehavior(e)}return new Re(t,n)}render(e,t,r){typeof t=="string"&&(t=document.getElementById(t)),r===void 0&&(r=t);let n=this.create(r);return n.bind(e,ce),n.appendTo(t),n}},ui=/([ \x09\x0a\x0c\x0d])([^\0-\x1F\x7F-\x9F "'>=/]+)([ \x09\x0a\x0c\x0d]*=[ \x09\x0a\x0c\x0d]*(?:[^ \x09\x0a\x0c\x0d"'`<>=]*|"[^"]*|'[^']*))$/;function y(o,...e){let t=[],r="";for(let n=0,i=o.length-1;n<i;++n){let s=o[n],a=e[n];if(r+=s,a instanceof st){let l=a;a=()=>l}if(typeof a=="function"&&(a=new ge(a)),a instanceof Oe){let l=ui.exec(s);l!==null&&(a.targetName=l[2])}a instanceof de?(r+=a.createPlaceholder(t.length),t.push(a)):r+=a}return r+=o[o.length-1],new st(r,t)}var R=class{constructor(){this.targets=new WeakSet}addStylesTo(e){this.targets.add(e)}removeStylesFrom(e){this.targets.delete(e)}isAttachedTo(e){return this.targets.has(e)}withBehaviors(...e){return this.behaviors=this.behaviors===null?e:this.behaviors.concat(e),this}};R.create=(()=>{if(g.supportsAdoptedStyleSheets){let o=new Map;return e=>new Nt(e,o)}return o=>new jt(o)})();function Ut(o){return o.map(e=>e instanceof R?Ut(e.styles):[e]).reduce((e,t)=>e.concat(t),[])}function cr(o){return o.map(e=>e instanceof R?e.behaviors:null).reduce((e,t)=>t===null?e:(e===null&&(e=[]),e.concat(t)),null)}var dr=(o,e)=>{o.adoptedStyleSheets=[...o.adoptedStyleSheets,...e]},ur=(o,e)=>{o.adoptedStyleSheets=o.adoptedStyleSheets.filter(t=>e.indexOf(t)===-1)};if(g.supportsAdoptedStyleSheets)try{document.adoptedStyleSheets.push(),document.adoptedStyleSheets.splice(),dr=(o,e)=>{o.adoptedStyleSheets.push(...e)},ur=(o,e)=>{for(let t of e){let r=o.adoptedStyleSheets.indexOf(t);r!==-1&&o.adoptedStyleSheets.splice(r,1)}}}catch{}var Nt=class extends R{constructor(e,t){super(),this.styles=e,this.styleSheetCache=t,this._styleSheets=void 0,this.behaviors=cr(e)}get styleSheets(){if(this._styleSheets===void 0){let e=this.styles,t=this.styleSheetCache;this._styleSheets=Ut(e).map(r=>{if(r instanceof CSSStyleSheet)return r;let n=t.get(r);return n===void 0&&(n=new CSSStyleSheet,n.replaceSync(r),t.set(r,n)),n})}return this._styleSheets}addStylesTo(e){dr(e,this.styleSheets),super.addStylesTo(e)}removeStylesFrom(e){ur(e,this.styleSheets),super.removeStylesFrom(e)}},hi=0;function pi(){return`fast-style-class-${++hi}`}var jt=class extends R{constructor(e){super(),this.styles=e,this.behaviors=null,this.behaviors=cr(e),this.styleSheets=Ut(e),this.styleClass=pi()}addStylesTo(e){let t=this.styleSheets,r=this.styleClass;e=this.normalizeTarget(e);for(let n=0;n<t.length;n++){let i=document.createElement("style");i.innerHTML=t[n],i.className=r,e.append(i)}super.addStylesTo(e)}removeStylesFrom(e){e=this.normalizeTarget(e);let t=e.querySelectorAll(`.${this.styleClass}`);for(let r=0,n=t.length;r<n;++r)e.removeChild(t[r]);super.removeStylesFrom(e)}isAttachedTo(e){return super.isAttachedTo(this.normalizeTarget(e))}normalizeTarget(e){return e===document?document.body:e}};var qe=Object.freeze({locate:nt()}),zt={toView(o){return o?"true":"false"},fromView(o){return!(o==null||o==="false"||o===!1||o===0)}},at={toView(o){if(o==null)return null;let e=o*1;return isNaN(e)?null:e.toString()},fromView(o){if(o==null)return null;let e=o*1;return isNaN(e)?null:e}},be=class{constructor(e,t,r=t.toLowerCase(),n="reflect",i){this.guards=new Set,this.Owner=e,this.name=t,this.attribute=r,this.mode=n,this.converter=i,this.fieldName=`_${t}`,this.callbackName=`${t}Changed`,this.hasCallback=this.callbackName in e.prototype,n==="boolean"&&i===void 0&&(this.converter=zt)}setValue(e,t){let r=e[this.fieldName],n=this.converter;n!==void 0&&(t=n.fromView(t)),r!==t&&(e[this.fieldName]=t,this.tryReflectToAttribute(e),this.hasCallback&&e[this.callbackName](r,t),e.$fastController.notify(this.name))}getValue(e){return v.track(e,this.name),e[this.fieldName]}onAttributeChangedCallback(e,t){this.guards.has(e)||(this.guards.add(e),this.setValue(e,t),this.guards.delete(e))}tryReflectToAttribute(e){let t=this.mode,r=this.guards;r.has(e)||t==="fromView"||g.queueUpdate(()=>{r.add(e);let n=e[this.fieldName];switch(t){case"reflect":let i=this.converter;g.setAttribute(e,this.attribute,i!==void 0?i.toView(n):n);break;case"boolean":g.setBooleanAttribute(e,this.attribute,n);break}r.delete(e)})}static collect(e,...t){let r=[];t.push(qe.locate(e));for(let n=0,i=t.length;n<i;++n){let s=t[n];if(s!==void 0)for(let a=0,l=s.length;a<l;++a){let c=s[a];typeof c=="string"?r.push(new be(e,c)):r.push(new be(e,c.property,c.attribute,c.mode,c.converter))}}return r}};function p(o,e){let t;function r(n,i){arguments.length>1&&(t.property=i),qe.locate(n.constructor).push(t)}if(arguments.length>1){t={},r(o,e);return}return t=o===void 0?{}:o,r}var hr={mode:"open"},pr={},qt=me.getById(4,()=>{let o=new Map;return Object.freeze({register(e){return o.has(e.type)?!1:(o.set(e.type,e),!0)},getByType(e){return o.get(e)}})}),X=class{constructor(e,t=e.definition){typeof t=="string"&&(t={name:t}),this.type=e,this.name=t.name,this.template=t.template;let r=be.collect(e,t.attributes),n=new Array(r.length),i={},s={};for(let a=0,l=r.length;a<l;++a){let c=r[a];n[a]=c.attribute,i[c.name]=c,s[c.attribute]=c}this.attributes=r,this.observedAttributes=n,this.propertyLookup=i,this.attributeLookup=s,this.shadowOptions=t.shadowOptions===void 0?hr:t.shadowOptions===null?void 0:Object.assign(Object.assign({},hr),t.shadowOptions),this.elementOptions=t.elementOptions===void 0?pr:Object.assign(Object.assign({},pr),t.elementOptions),this.styles=t.styles===void 0?void 0:Array.isArray(t.styles)?R.create(t.styles):t.styles instanceof R?t.styles:R.create([t.styles])}get isDefined(){return!!qt.getByType(this.type)}define(e=customElements){let t=this.type;if(qt.register(this)){let r=this.attributes,n=t.prototype;for(let i=0,s=r.length;i<s;++i)v.defineProperty(n,r[i]);Reflect.defineProperty(t,"observedAttributes",{value:this.observedAttributes,enumerable:!0})}return e.get(this.name)||e.define(this.name,t,this.elementOptions),this}};X.forType=qt.getByType;var fr=new WeakMap,fi={bubbles:!0,composed:!0,cancelable:!0};function Gt(o){return o.shadowRoot||fr.get(o)||null}var Pe=class extends Ee{constructor(e,t){super(e),this.boundObservables=null,this.behaviors=null,this.needsInitialization=!0,this._template=null,this._styles=null,this._isConnected=!1,this.$fastController=this,this.view=null,this.element=e,this.definition=t;let r=t.shadowOptions;if(r!==void 0){let i=e.attachShadow(r);r.mode==="closed"&&fr.set(e,i)}let n=v.getAccessors(e);if(n.length>0){let i=this.boundObservables=Object.create(null);for(let s=0,a=n.length;s<a;++s){let l=n[s].name,c=e[l];c!==void 0&&(delete e[l],i[l]=c)}}}get isConnected(){return v.track(this,"isConnected"),this._isConnected}setIsConnected(e){this._isConnected=e,v.notify(this,"isConnected")}get template(){return this._template}set template(e){this._template!==e&&(this._template=e,this.needsInitialization||this.renderTemplate(e))}get styles(){return this._styles}set styles(e){this._styles!==e&&(this._styles!==null&&this.removeStyles(this._styles),this._styles=e,!this.needsInitialization&&e!==null&&this.addStyles(e))}addStyles(e){let t=Gt(this.element)||this.element.getRootNode();if(e instanceof HTMLStyleElement)t.append(e);else if(!e.isAttachedTo(t)){let r=e.behaviors;e.addStylesTo(t),r!==null&&this.addBehaviors(r)}}removeStyles(e){let t=Gt(this.element)||this.element.getRootNode();if(e instanceof HTMLStyleElement)t.removeChild(e);else if(e.isAttachedTo(t)){let r=e.behaviors;e.removeStylesFrom(t),r!==null&&this.removeBehaviors(r)}}addBehaviors(e){let t=this.behaviors||(this.behaviors=new Map),r=e.length,n=[];for(let i=0;i<r;++i){let s=e[i];t.has(s)?t.set(s,t.get(s)+1):(t.set(s,1),n.push(s))}if(this._isConnected){let i=this.element;for(let s=0;s<n.length;++s)n[s].bind(i,ce)}}removeBehaviors(e,t=!1){let r=this.behaviors;if(r===null)return;let n=e.length,i=[];for(let s=0;s<n;++s){let a=e[s];if(r.has(a)){let l=r.get(a)-1;l===0||t?r.delete(a)&&i.push(a):r.set(a,l)}}if(this._isConnected){let s=this.element;for(let a=0;a<i.length;++a)i[a].unbind(s)}}onConnectedCallback(){if(this._isConnected)return;let e=this.element;this.needsInitialization?this.finishInitialization():this.view!==null&&this.view.bind(e,ce);let t=this.behaviors;if(t!==null)for(let[r]of t)r.bind(e,ce);this.setIsConnected(!0)}onDisconnectedCallback(){if(!this._isConnected)return;this.setIsConnected(!1);let e=this.view;e!==null&&e.unbind();let t=this.behaviors;if(t!==null){let r=this.element;for(let[n]of t)n.unbind(r)}}onAttributeChangedCallback(e,t,r){let n=this.definition.attributeLookup[e];n!==void 0&&n.onAttributeChangedCallback(this.element,r)}emit(e,t,r){return this._isConnected?this.element.dispatchEvent(new CustomEvent(e,Object.assign(Object.assign({detail:t},fi),r))):!1}finishInitialization(){let e=this.element,t=this.boundObservables;if(t!==null){let n=Object.keys(t);for(let i=0,s=n.length;i<s;++i){let a=n[i];e[a]=t[a]}this.boundObservables=null}let r=this.definition;this._template===null&&(this.element.resolveTemplate?this._template=this.element.resolveTemplate():r.template&&(this._template=r.template||null)),this._template!==null&&this.renderTemplate(this._template),this._styles===null&&(this.element.resolveStyles?this._styles=this.element.resolveStyles():r.styles&&(this._styles=r.styles||null)),this._styles!==null&&this.addStyles(this._styles),this.needsInitialization=!1}renderTemplate(e){let t=this.element,r=Gt(t)||t;this.view!==null?(this.view.dispose(),this.view=null):this.needsInitialization||g.removeChildNodes(r),e&&(this.view=e.render(t,r,t))}static forCustomElement(e){let t=e.$fastController;if(t!==void 0)return t;let r=X.forType(e.constructor);if(r===void 0)throw new Error("Missing FASTElement definition.");return e.$fastController=new Pe(e,r)}};function mr(o){return class extends o{constructor(){super(),Pe.forCustomElement(this)}$emit(e,t,r){return this.$fastController.emit(e,t,r)}connectedCallback(){this.$fastController.onConnectedCallback()}disconnectedCallback(){this.$fastController.onDisconnectedCallback()}attributeChangedCallback(e,t,r){this.$fastController.onAttributeChangedCallback(e,t,r)}}}var he=Object.assign(mr(HTMLElement),{from(o){return mr(o)},define(o,e){return new X(o,e).define().type}});var ve=class{createCSS(){return""}createBehavior(){}};function mi(o,e){let t=[],r="",n=[];for(let i=0,s=o.length-1;i<s;++i){r+=o[i];let a=e[i];if(a instanceof ve){let l=a.createBehavior();a=a.createCSS(),l&&n.push(l)}a instanceof R||a instanceof CSSStyleSheet?(r.trim()!==""&&(t.push(r),r=""),t.push(a)):r+=a}return r+=o[o.length-1],r.trim()!==""&&t.push(r),{styles:t,behaviors:n}}function D(o,...e){let{styles:t,behaviors:r}=mi(o,e),n=R.create(t);return r.length&&n.withBehaviors(...r),n}function U(o,e,t){return{index:o,removed:e,addedCount:t}}var br=0,vr=1,Wt=2,Qt=3;function gi(o,e,t,r,n,i){let s=i-n+1,a=t-e+1,l=new Array(s),c,d;for(let h=0;h<s;++h)l[h]=new Array(a),l[h][0]=h;for(let h=0;h<a;++h)l[0][h]=h;for(let h=1;h<s;++h)for(let m=1;m<a;++m)o[e+m-1]===r[n+h-1]?l[h][m]=l[h-1][m-1]:(c=l[h-1][m]+1,d=l[h][m-1]+1,l[h][m]=c<d?c:d);return l}function bi(o){let e=o.length-1,t=o[0].length-1,r=o[e][t],n=[];for(;e>0||t>0;){if(e===0){n.push(Wt),t--;continue}if(t===0){n.push(Qt),e--;continue}let i=o[e-1][t-1],s=o[e-1][t],a=o[e][t-1],l;s<a?l=s<i?s:i:l=a<i?a:i,l===i?(i===r?n.push(br):(n.push(vr),r=i),e--,t--):l===s?(n.push(Qt),e--,r=s):(n.push(Wt),t--,r=a)}return n.reverse(),n}function vi(o,e,t){for(let r=0;r<t;++r)if(o[r]!==e[r])return r;return t}function yi(o,e,t){let r=o.length,n=e.length,i=0;for(;i<t&&o[--r]===e[--n];)i++;return i}function xi(o,e,t,r){return e<t||r<o?-1:e===t||r===o?0:o<t?e<r?e-t:r-t:r<e?r-o:e-o}function Zt(o,e,t,r,n,i){let s=0,a=0,l=Math.min(t-e,i-n);if(e===0&&n===0&&(s=vi(o,r,l)),t===o.length&&i===r.length&&(a=yi(o,r,l-s)),e+=s,n+=s,t-=a,i-=a,t-e===0&&i-n===0)return j;if(e===t){let $=U(e,[],0);for(;n<i;)$.removed.push(r[n++]);return[$]}else if(n===i)return[U(e,[],t-e)];let c=bi(gi(o,e,t,r,n,i)),d=[],h,m=e,k=n;for(let $=0;$<c.length;++$)switch(c[$]){case br:h!==void 0&&(d.push(h),h=void 0),m++,k++;break;case vr:h===void 0&&(h=U(m,[],0)),h.addedCount++,m++,h.removed.push(r[k]),k++;break;case Wt:h===void 0&&(h=U(m,[],0)),h.addedCount++,m++;break;case Qt:h===void 0&&(h=U(m,[],0)),h.removed.push(r[k]),k++;break}return h!==void 0&&d.push(h),d}var gr=Array.prototype.push;function wi(o,e,t,r){let n=U(e,t,r),i=!1,s=0;for(let a=0;a<o.length;a++){let l=o[a];if(l.index+=s,i)continue;let c=xi(n.index,n.index+n.removed.length,l.index,l.index+l.addedCount);if(c>=0){o.splice(a,1),a--,s-=l.addedCount-l.removed.length,n.addedCount+=l.addedCount-c;let d=n.removed.length+l.removed.length-c;if(!n.addedCount&&!d)i=!0;else{let h=l.removed;if(n.index<l.index){let m=n.removed.slice(0,l.index-n.index);gr.apply(m,h),h=m}if(n.index+n.removed.length>l.index+l.addedCount){let m=n.removed.slice(l.index+l.addedCount-n.index);gr.apply(h,m)}n.removed=h,l.index<n.index&&(n.index=l.index)}}else if(n.index<l.index){i=!0,o.splice(a,0,n),a++;let d=n.addedCount-n.removed.length;l.index+=d,s+=d}}i||o.push(n)}function Ci(o){let e=[];for(let t=0,r=o.length;t<r;t++){let n=o[t];wi(e,n.index,n.removed,n.addedCount)}return e}function yr(o,e){let t=[],r=Ci(e);for(let n=0,i=r.length;n<i;++n){let s=r[n];if(s.addedCount===1&&s.removed.length===1){s.removed[0]!==o[s.index]&&t.push(s);continue}t=t.concat(Zt(o,s.index,s.index+s.addedCount,s.removed,0,s.removed.length))}return t}var xr=!1;function Xt(o,e){let t=o.index,r=e.length;return t>r?t=r-o.addedCount:t<0&&(t=r+o.removed.length+t-o.addedCount),t<0&&(t=0),o.index=t,o}var Jt=class extends ae{constructor(e){super(e),this.oldCollection=void 0,this.splices=void 0,this.needsQueue=!0,this.call=this.flush,Reflect.defineProperty(e,"$fastController",{value:this,enumerable:!1})}subscribe(e){this.flush(),super.subscribe(e)}addSplice(e){this.splices===void 0?this.splices=[e]:this.splices.push(e),this.needsQueue&&(this.needsQueue=!1,g.queueUpdate(this))}reset(e){this.oldCollection=e,this.needsQueue&&(this.needsQueue=!1,g.queueUpdate(this))}flush(){let e=this.splices,t=this.oldCollection;if(e===void 0&&t===void 0)return;this.needsQueue=!0,this.splices=void 0,this.oldCollection=void 0;let r=t===void 0?yr(this.source,e):Zt(this.source,0,this.source.length,t,0,t.length);this.notify(r)}};function wr(){if(xr)return;xr=!0,v.setArrayObserverFactory(l=>new Jt(l));let o=Array.prototype;if(o.$fastPatch)return;Reflect.defineProperty(o,"$fastPatch",{value:1,enumerable:!1});let e=o.pop,t=o.push,r=o.reverse,n=o.shift,i=o.sort,s=o.splice,a=o.unshift;o.pop=function(){let l=this.length>0,c=e.apply(this,arguments),d=this.$fastController;return d!==void 0&&l&&d.addSplice(U(this.length,[c],0)),c},o.push=function(){let l=t.apply(this,arguments),c=this.$fastController;return c!==void 0&&c.addSplice(Xt(U(this.length-arguments.length,[],arguments.length),this)),l},o.reverse=function(){let l,c=this.$fastController;c!==void 0&&(c.flush(),l=this.slice());let d=r.apply(this,arguments);return c!==void 0&&c.reset(l),d},o.shift=function(){let l=this.length>0,c=n.apply(this,arguments),d=this.$fastController;return d!==void 0&&l&&d.addSplice(U(0,[c],0)),c},o.sort=function(){let l,c=this.$fastController;c!==void 0&&(c.flush(),l=this.slice());let d=i.apply(this,arguments);return c!==void 0&&c.reset(l),d},o.splice=function(){let l=s.apply(this,arguments),c=this.$fastController;return c!==void 0&&c.addSplice(Xt(U(+arguments[0],l,arguments.length>2?arguments.length-2:0),this)),l},o.unshift=function(){let l=a.apply(this,arguments),c=this.$fastController;return c!==void 0&&c.addSplice(Xt(U(0,[],arguments.length),this)),l}}var Yt=class{constructor(e,t){this.target=e,this.propertyName=t}bind(e){e[this.propertyName]=this.target}unbind(){}};function _(o){return new ue("fast-ref",Yt,o)}var ha=Object.freeze({positioning:!1,recycle:!0});function ki(o,e,t,r){o.bind(e[t],r)}function $i(o,e,t,r){let n=Object.create(r);n.index=t,n.length=e.length,o.bind(e[t],n)}var Kt=class{constructor(e,t,r,n,i,s){this.location=e,this.itemsBinding=t,this.templateBinding=n,this.options=s,this.source=null,this.views=[],this.items=null,this.itemsObserver=null,this.originalContext=void 0,this.childContext=void 0,this.bindView=ki,this.itemsBindingObserver=v.binding(t,this,r),this.templateBindingObserver=v.binding(n,this,i),s.positioning&&(this.bindView=$i)}bind(e,t){this.source=e,this.originalContext=t,this.childContext=Object.create(t),this.childContext.parent=e,this.childContext.parentContext=this.originalContext,this.items=this.itemsBindingObserver.observe(e,this.originalContext),this.template=this.templateBindingObserver.observe(e,this.originalContext),this.observeItems(!0),this.refreshAllViews()}unbind(){this.source=null,this.items=null,this.itemsObserver!==null&&this.itemsObserver.unsubscribe(this),this.unbindAllViews(),this.itemsBindingObserver.disconnect(),this.templateBindingObserver.disconnect()}handleChange(e,t){e===this.itemsBinding?(this.items=this.itemsBindingObserver.observe(this.source,this.originalContext),this.observeItems(),this.refreshAllViews()):e===this.templateBinding?(this.template=this.templateBindingObserver.observe(this.source,this.originalContext),this.refreshAllViews(!0)):this.updateViews(t)}observeItems(e=!1){if(!this.items){this.items=j;return}let t=this.itemsObserver,r=this.itemsObserver=v.getNotifier(this.items),n=t!==r;n&&t!==null&&t.unsubscribe(this),(n||e)&&r.subscribe(this)}updateViews(e){let t=this.childContext,r=this.views,n=this.bindView,i=this.items,s=this.template,a=this.options.recycle,l=[],c=0,d=0;for(let h=0,m=e.length;h<m;++h){let k=e[h],$=k.removed,F=0,W=k.index,je=W+k.addedCount,se=r.splice(k.index,$.length),Xn=d=l.length+se.length;for(;W<je;++W){let or=r[W],Jn=or?or.firstChild:this.location,De;a&&d>0?(F<=Xn&&se.length>0?(De=se[F],F++):(De=l[c],c++),d--):De=s.create(),r.splice(W,0,De),n(De,i,W,t),De.insertBefore(Jn)}se[F]&&l.push(...se.slice(F))}for(let h=c,m=l.length;h<m;++h)l[h].dispose();if(this.options.positioning)for(let h=0,m=r.length;h<m;++h){let k=r[h].context;k.length=m,k.index=h}}refreshAllViews(e=!1){let t=this.items,r=this.childContext,n=this.template,i=this.location,s=this.bindView,a=t.length,l=this.views,c=l.length;if((a===0||e||!this.options.recycle)&&(Re.disposeContiguousBatch(l),c=0),c===0){this.views=l=new Array(a);for(let d=0;d<a;++d){let h=n.create();s(h,t,d,r),l[d]=h,h.insertBefore(i)}}else{let d=0;for(;d<a;++d)if(d<c){let m=l[d];s(m,t,d,r)}else{let m=n.create();s(m,t,d,r),l.push(m),m.insertBefore(i)}let h=l.splice(d,c-d);for(d=0,a=h.length;d<a;++d)h[d].dispose()}}unbindAllViews(){let e=this.views;for(let t=0,r=e.length;t<r;++t)e[t].unbind()}},Ie=class extends de{constructor(e,t,r){super(),this.itemsBinding=e,this.templateBinding=t,this.options=r,this.createPlaceholder=g.createBlockPlaceholder,wr(),this.isItemsBindingVolatile=v.isVolatileBinding(e),this.isTemplateBindingVolatile=v.isVolatileBinding(t)}createBehavior(e){return new Kt(e,this.itemsBinding,this.isItemsBindingVolatile,this.templateBinding,this.isTemplateBindingVolatile,this.options)}};function Ge(o){return o?function(e,t,r){return e.nodeType===1&&e.matches(o)}:function(e,t,r){return e.nodeType===1}}var Fe=class{constructor(e,t){this.target=e,this.options=t,this.source=null}bind(e){let t=this.options.property;this.shouldUpdate=v.getAccessors(e).some(r=>r.name===t),this.source=e,this.updateTarget(this.computeNodes()),this.shouldUpdate&&this.observe()}unbind(){this.updateTarget(j),this.source=null,this.shouldUpdate&&this.disconnect()}handleEvent(){this.updateTarget(this.computeNodes())}computeNodes(){let e=this.getNodes();return this.options.filter!==void 0&&(e=e.filter(this.options.filter)),e}updateTarget(e){this.source[this.options.property]=e}};var eo=class extends Fe{constructor(e,t){super(e,t)}observe(){this.target.addEventListener("slotchange",this)}disconnect(){this.target.removeEventListener("slotchange",this)}getNodes(){return this.target.assignedNodes(this.options)}};function J(o){return typeof o=="string"&&(o={property:o}),new ue("fast-slotted",eo,o)}var to=class extends Fe{constructor(e,t){super(e,t),this.observer=null,t.childList=!0}observe(){this.observer===null&&(this.observer=new MutationObserver(this.handleEvent.bind(this))),this.observer.observe(this.target,this.options)}disconnect(){this.observer.disconnect()}getNodes(){return"subtree"in this.options?Array.from(this.target.querySelectorAll(this.options.selector)):Array.from(this.target.childNodes)}};function lt(o){return typeof o=="string"&&(o={property:o}),new ue("fast-children",to,o)}var pe=class{handleStartContentChange(){this.startContainer.classList.toggle("start",this.start.assignedNodes().length>0)}handleEndContentChange(){this.endContainer.classList.toggle("end",this.end.assignedNodes().length>0)}},Ae=(o,e)=>y`
    <span
        part="end"
        ${_("endContainer")}
        class=${t=>e.end?"end":void 0}
    >
        <slot name="end" ${_("end")} @slotchange="${t=>t.handleEndContentChange()}">
            ${e.end||""}
        </slot>
    </span>
`,Be=(o,e)=>y`
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
`,Qa=y`
    <span part="end" ${_("endContainer")}>
        <slot
            name="end"
            ${_("end")}
            @slotchange="${o=>o.handleEndContentChange()}"
        ></slot>
    </span>
`,Za=y`
    <span part="start" ${_("startContainer")}>
        <slot
            name="start"
            ${_("start")}
            @slotchange="${o=>o.handleStartContentChange()}"
        ></slot>
    </span>
`;function u(o,e,t,r){var n=arguments.length,i=n<3?e:r===null?r=Object.getOwnPropertyDescriptor(e,t):r,s;if(typeof Reflect=="object"&&typeof Reflect.decorate=="function")i=Reflect.decorate(o,e,t,r);else for(var a=o.length-1;a>=0;a--)(s=o[a])&&(i=(n<3?s(i):n>3?s(e,t,i):s(e,t))||i);return n>3&&i&&Object.defineProperty(e,t,i),i}var oo=new Map;"metadata"in Reflect||(Reflect.metadata=function(o,e){return function(t){Reflect.defineMetadata(o,e,t)}},Reflect.defineMetadata=function(o,e,t){let r=oo.get(t);r===void 0&&oo.set(t,r=new Map),r.set(o,e)},Reflect.getOwnMetadata=function(o,e){let t=oo.get(e);if(t!==void 0)return t.get(o)});var so=class{constructor(e,t){this.container=e,this.key=t}instance(e){return this.registerResolver(0,e)}singleton(e){return this.registerResolver(1,e)}transient(e){return this.registerResolver(2,e)}callback(e){return this.registerResolver(3,e)}cachedCallback(e){return this.registerResolver(3,Ir(e))}aliasTo(e){return this.registerResolver(5,e)}registerResolver(e,t){let{container:r,key:n}=this;return this.container=this.key=void 0,r.registerResolver(n,new L(n,e,t))}};function We(o){let e=o.slice(),t=Object.keys(o),r=t.length,n;for(let i=0;i<r;++i)n=t[i],Fr(n)||(e[n]=o[n]);return e}var Si=Object.freeze({none(o){throw Error(`${o.toString()} not registered, did you forget to add @singleton()?`)},singleton(o){return new L(o,1,o)},transient(o){return new L(o,2,o)}}),ro=Object.freeze({default:Object.freeze({parentLocator:()=>null,responsibleForOwnerRequests:!1,defaultResolver:Si.singleton})}),Cr=new Map;function kr(o){return e=>Reflect.getOwnMetadata(o,e)}var $r=null,x=Object.freeze({createContainer(o){return new ye(null,Object.assign({},ro.default,o))},findResponsibleContainer(o){let e=o.$$container$$;return e&&e.responsibleForOwnerRequests?e:x.findParentContainer(o)},findParentContainer(o){let e=new CustomEvent(Pr,{bubbles:!0,composed:!0,cancelable:!0,detail:{container:void 0}});return o.dispatchEvent(e),e.detail.container||x.getOrCreateDOMContainer()},getOrCreateDOMContainer(o,e){return o?o.$$container$$||new ye(o,Object.assign({},ro.default,e,{parentLocator:x.findParentContainer})):$r||($r=new ye(null,Object.assign({},ro.default,e,{parentLocator:()=>null})))},getDesignParamtypes:kr("design:paramtypes"),getAnnotationParamtypes:kr("di:paramtypes"),getOrCreateAnnotationParamTypes(o){let e=this.getAnnotationParamtypes(o);return e===void 0&&Reflect.defineMetadata("di:paramtypes",e=[],o),e},getDependencies(o){let e=Cr.get(o);if(e===void 0){let t=o.inject;if(t===void 0){let r=x.getDesignParamtypes(o),n=x.getAnnotationParamtypes(o);if(r===void 0)if(n===void 0){let i=Object.getPrototypeOf(o);typeof i=="function"&&i!==Function.prototype?e=We(x.getDependencies(i)):e=[]}else e=We(n);else if(n===void 0)e=We(r);else{e=We(r);let i=n.length,s;for(let c=0;c<i;++c)s=n[c],s!==void 0&&(e[c]=s);let a=Object.keys(n);i=a.length;let l;for(let c=0;c<i;++c)l=a[c],Fr(l)||(e[l]=n[l])}}else e=We(t);Cr.set(o,e)}return e},defineProperty(o,e,t,r=!1){let n=`$di_${e}`;Reflect.defineProperty(o,e,{get:function(){let i=this[n];if(i===void 0&&(i=(this instanceof HTMLElement?x.findResponsibleContainer(this):x.getOrCreateDOMContainer()).get(t),this[n]=i,r&&this instanceof he)){let a=this.$fastController,l=()=>{let d=x.findResponsibleContainer(this).get(t),h=this[n];d!==h&&(this[n]=i,a.notify(e))};a.subscribe({handleChange:l},"isConnected")}return i}})},createInterface(o,e){let t=typeof o=="function"?o:e,r=typeof o=="string"?o:o&&"friendlyName"in o&&o.friendlyName||Er,n=typeof o=="string"?!1:o&&"respectConnection"in o&&o.respectConnection||!1,i=function(s,a,l){if(s==null||new.target!==void 0)throw new Error(`No registration for interface: '${i.friendlyName}'`);if(a)x.defineProperty(s,a,i,n);else{let c=x.getOrCreateAnnotationParamTypes(s);c[l]=i}};return i.$isInterface=!0,i.friendlyName=r??"(anonymous)",t!=null&&(i.register=function(s,a){return t(new so(s,a??i))}),i.toString=function(){return`InterfaceSymbol<${i.friendlyName}>`},i},inject(...o){return function(e,t,r){if(typeof r=="number"){let n=x.getOrCreateAnnotationParamTypes(e),i=o[0];i!==void 0&&(n[r]=i)}else if(t)x.defineProperty(e,t,o[0]);else{let n=r?x.getOrCreateAnnotationParamTypes(r.value):x.getOrCreateAnnotationParamTypes(e),i;for(let s=0;s<o.length;++s)i=o[s],i!==void 0&&(n[s]=i)}}},transient(o){return o.register=function(t){return xe.transient(o,o).register(t)},o.registerInRequestor=!1,o},singleton(o,e=Di){return o.register=function(r){return xe.singleton(o,o).register(r)},o.registerInRequestor=e.scoped,o}}),Ti=x.createInterface("Container");function ht(o){return function(e){let t=function(r,n,i){x.inject(t)(r,n,i)};return t.$isResolver=!0,t.resolve=function(r,n){return o(e,r,n)},t}}var Ka=x.inject;var Di={scoped:!1};function Ei(o){return function(e,t){t=!!t;let r=function(n,i,s){x.inject(r)(n,i,s)};return r.$isResolver=!0,r.resolve=function(n,i){return o(e,n,i,t)},r}}var el=Ei((o,e,t,r)=>t.getAll(o,r)),tl=ht((o,e,t)=>()=>t.get(o)),ol=ht((o,e,t)=>{if(t.has(o,!0))return t.get(o)});function lo(o,e,t){x.inject(lo)(o,e,t)}lo.$isResolver=!0;lo.resolve=()=>{};var rl=ht((o,e,t)=>{let r=Rr(o,e),n=new L(o,0,r);return t.registerResolver(o,n),r}),nl=ht((o,e,t)=>Rr(o,e));function Rr(o,e){return e.getFactory(o).construct(e)}var L=class{constructor(e,t,r){this.key=e,this.strategy=t,this.state=r,this.resolving=!1}get $isResolver(){return!0}register(e){return e.registerResolver(this.key,this)}resolve(e,t){switch(this.strategy){case 0:return this.state;case 1:{if(this.resolving)throw new Error(`Cyclic dependency found: ${this.state.name}`);return this.resolving=!0,this.state=e.getFactory(this.state).construct(t),this.strategy=0,this.resolving=!1,this.state}case 2:{let r=e.getFactory(this.state);if(r===null)throw new Error(`Resolver for ${String(this.key)} returned a null factory`);return r.construct(t)}case 3:return this.state(e,t,this);case 4:return this.state[0].resolve(e,t);case 5:return t.get(this.state);default:throw new Error(`Invalid resolver strategy specified: ${this.strategy}.`)}}getFactory(e){var t,r,n;switch(this.strategy){case 1:case 2:return e.getFactory(this.state);case 5:return(n=(r=(t=e.getResolver(this.state))===null||t===void 0?void 0:t.getFactory)===null||r===void 0?void 0:r.call(t,e))!==null&&n!==void 0?n:null;default:return null}}};function Sr(o){return this.get(o)}function Oi(o,e){return e(o)}var ao=class{constructor(e,t){this.Type=e,this.dependencies=t,this.transformers=null}construct(e,t){let r;return t===void 0?r=new this.Type(...this.dependencies.map(Sr,e)):r=new this.Type(...this.dependencies.map(Sr,e),...t),this.transformers==null?r:this.transformers.reduce(Oi,r)}registerTransformer(e){(this.transformers||(this.transformers=[])).push(e)}},Ri={$isResolver:!0,resolve(o,e){return e}};function ut(o){return typeof o.register=="function"}function Pi(o){return ut(o)&&typeof o.registerInRequestor=="boolean"}function Tr(o){return Pi(o)&&o.registerInRequestor}function Ii(o){return o.prototype!==void 0}var Fi=new Set(["Array","ArrayBuffer","Boolean","DataView","Date","Error","EvalError","Float32Array","Float64Array","Function","Int8Array","Int16Array","Int32Array","Map","Number","Object","Promise","RangeError","ReferenceError","RegExp","Set","SharedArrayBuffer","String","SyntaxError","TypeError","Uint8Array","Uint8ClampedArray","Uint16Array","Uint32Array","URIError","WeakMap","WeakSet"]),Pr="__DI_LOCATE_PARENT__",no=new Map,ye=class{constructor(e,t){this.owner=e,this.config=t,this._parent=void 0,this.registerDepth=0,this.context=null,e!==null&&(e.$$container$$=this),this.resolvers=new Map,this.resolvers.set(Ti,Ri),e instanceof Node&&e.addEventListener(Pr,r=>{r.composedPath()[0]!==this.owner&&(r.detail.container=this,r.stopImmediatePropagation())})}get parent(){return this._parent===void 0&&(this._parent=this.config.parentLocator(this.owner)),this._parent}get depth(){return this.parent===null?0:this.parent.depth+1}get responsibleForOwnerRequests(){return this.config.responsibleForOwnerRequests}registerWithContext(e,...t){return this.context=e,this.register(...t),this.context=null,this}register(...e){if(++this.registerDepth===100)throw new Error("Unable to autoregister dependency");let t,r,n,i,s,a=this.context;for(let l=0,c=e.length;l<c;++l)if(t=e[l],!!Or(t))if(ut(t))t.register(this,a);else if(Ii(t))xe.singleton(t,t).register(this);else for(r=Object.keys(t),i=0,s=r.length;i<s;++i)n=t[r[i]],Or(n)&&(ut(n)?n.register(this,a):this.register(n));return--this.registerDepth,this}registerResolver(e,t){ct(e);let r=this.resolvers,n=r.get(e);return n==null?r.set(e,t):n instanceof L&&n.strategy===4?n.state.push(t):r.set(e,new L(e,4,[n,t])),t}registerTransformer(e,t){let r=this.getResolver(e);if(r==null)return!1;if(r.getFactory){let n=r.getFactory(this);return n==null?!1:(n.registerTransformer(t),!0)}return!1}getResolver(e,t=!0){if(ct(e),e.resolve!==void 0)return e;let r=this,n;for(;r!=null;)if(n=r.resolvers.get(e),n==null){if(r.parent==null){let i=Tr(e)?this:r;return t?this.jitRegister(e,i):null}r=r.parent}else return n;return null}has(e,t=!1){return this.resolvers.has(e)?!0:t&&this.parent!=null?this.parent.has(e,!0):!1}get(e){if(ct(e),e.$isResolver)return e.resolve(this,this);let t=this,r;for(;t!=null;)if(r=t.resolvers.get(e),r==null){if(t.parent==null){let n=Tr(e)?this:t;return r=this.jitRegister(e,n),r.resolve(t,this)}t=t.parent}else return r.resolve(t,this);throw new Error(`Unable to resolve key: ${String(e)}`)}getAll(e,t=!1){ct(e);let r=this,n=r,i;if(t){let s=j;for(;n!=null;)i=n.resolvers.get(e),i!=null&&(s=s.concat(Dr(i,n,r))),n=n.parent;return s}else for(;n!=null;)if(i=n.resolvers.get(e),i==null){if(n=n.parent,n==null)return j}else return Dr(i,n,r);return j}getFactory(e){let t=no.get(e);if(t===void 0){if(Ai(e))throw new Error(`${e.name} is a native function and therefore cannot be safely constructed by DI. If this is intentional, please use a callback or cachedCallback resolver.`);no.set(e,t=new ao(e,x.getDependencies(e)))}return t}registerFactory(e,t){no.set(e,t)}createChild(e){return new ye(null,Object.assign({},this.config,e,{parentLocator:()=>this}))}jitRegister(e,t){if(typeof e!="function")throw new Error(`Attempted to jitRegister something that is not a constructor: '${e}'. Did you forget to register this dependency?`);if(Fi.has(e.name))throw new Error(`Attempted to jitRegister an intrinsic type: ${e.name}. Did you forget to add @inject(Key)`);if(ut(e)){let r=e.register(t);if(!(r instanceof Object)||r.resolve==null){let n=t.resolvers.get(e);if(n!=null)return n;throw new Error("A valid resolver was not returned from the static register method")}return r}else{if(e.$isInterface)throw new Error(`Attempted to jitRegister an interface: ${e.friendlyName}`);{let r=this.config.defaultResolver(e,t);return t.resolvers.set(e,r),r}}}},io=new WeakMap;function Ir(o){return function(e,t,r){if(io.has(r))return io.get(r);let n=o(e,t,r);return io.set(r,n),n}}var xe=Object.freeze({instance(o,e){return new L(o,0,e)},singleton(o,e){return new L(o,1,e)},transient(o,e){return new L(o,2,e)},callback(o,e){return new L(o,3,e)},cachedCallback(o,e){return new L(o,3,Ir(e))},aliasTo(o,e){return new L(e,5,o)}});function ct(o){if(o==null)throw new Error("key/value cannot be null or undefined. Are you trying to inject/register something that doesn't exist with DI?")}function Dr(o,e,t){if(o instanceof L&&o.strategy===4){let r=o.state,n=r.length,i=new Array(n);for(;n--;)i[n]=r[n].resolve(e,t);return i}return[o.resolve(e,t)]}var Er="(anonymous)";function Or(o){return typeof o=="object"&&o!==null||typeof o=="function"}var Ai=function(){let o=new WeakMap,e=!1,t="",r=0;return function(n){return e=o.get(n),e===void 0&&(t=n.toString(),r=t.length,e=r>=29&&r<=100&&t.charCodeAt(r-1)===125&&t.charCodeAt(r-2)<=32&&t.charCodeAt(r-3)===93&&t.charCodeAt(r-4)===101&&t.charCodeAt(r-5)===100&&t.charCodeAt(r-6)===111&&t.charCodeAt(r-7)===99&&t.charCodeAt(r-8)===32&&t.charCodeAt(r-9)===101&&t.charCodeAt(r-10)===118&&t.charCodeAt(r-11)===105&&t.charCodeAt(r-12)===116&&t.charCodeAt(r-13)===97&&t.charCodeAt(r-14)===110&&t.charCodeAt(r-15)===88,o.set(n,e)),e}}(),dt={};function Fr(o){switch(typeof o){case"number":return o>=0&&(o|0)===o;case"string":{let e=dt[o];if(e!==void 0)return e;let t=o.length;if(t===0)return dt[o]=!1;let r=0;for(let n=0;n<t;++n)if(r=o.charCodeAt(n),n===0&&r===48&&t>1||r<48||r>57)return dt[o]=!1;return dt[o]=!0}default:return!1}}function Ar(o){return`${o.toLowerCase()}:presentation`}var pt=new Map,mt=Object.freeze({define(o,e,t){let r=Ar(o);pt.get(r)===void 0?pt.set(r,e):pt.set(r,!1),t.register(xe.instance(r,e))},forTag(o,e){let t=Ar(o),r=pt.get(t);return r===!1?x.findResponsibleContainer(e).get(t):r||null}}),ft=class{constructor(e,t){this.template=e||null,this.styles=t===void 0?null:Array.isArray(t)?R.create(t):t instanceof R?t:R.create([t])}applyTo(e){let t=e.$fastController;t.template===null&&(t.template=this.template),t.styles===null&&(t.styles=this.styles)}};var w=class extends he{constructor(){super(...arguments),this._presentation=void 0}get $presentation(){return this._presentation===void 0&&(this._presentation=mt.forTag(this.tagName,this)),this._presentation}templateChanged(){this.template!==void 0&&(this.$fastController.template=this.template)}stylesChanged(){this.styles!==void 0&&(this.$fastController.styles=this.styles)}connectedCallback(){this.$presentation!==null&&this.$presentation.applyTo(this),super.connectedCallback()}static compose(e){return(t={})=>new co(this===w?class extends w{}:this,e,t)}};u([b],w.prototype,"template",void 0);u([b],w.prototype,"styles",void 0);function Qe(o,e,t){return typeof o=="function"?o(e,t):o}var co=class{constructor(e,t,r){this.type=e,this.elementDefinition=t,this.overrideDefinition=r,this.definition=Object.assign(Object.assign({},this.elementDefinition),this.overrideDefinition)}register(e,t){let r=this.definition,n=this.overrideDefinition,s=`${r.prefix||t.elementPrefix}-${r.baseName}`;t.tryDefineElement({name:s,type:this.type,baseClass:this.elementDefinition.baseClass,callback:a=>{let l=new ft(Qe(r.template,a,r),Qe(r.styles,a,r));a.definePresentation(l);let c=Qe(r.shadowOptions,a,r);a.shadowRootMode&&(c?n.shadowOptions||(c.mode=a.shadowRootMode):c!==null&&(c={mode:a.shadowRootMode})),a.defineElement({elementOptions:Qe(r.elementOptions,a,r),shadowOptions:c,attributes:Qe(r.attributes,a,r)})}})}};function oe(o,...e){let t=qe.locate(o);e.forEach(r=>{Object.getOwnPropertyNames(r.prototype).forEach(i=>{i!=="constructor"&&Object.defineProperty(o.prototype,i,Object.getOwnPropertyDescriptor(r.prototype,i))}),qe.locate(r).forEach(i=>t.push(i))})}var Br={horizontal:"horizontal",vertical:"vertical"};function _r(){return!!(typeof window<"u"&&window.document&&window.document.createElement)}function Bi(){let o=document.querySelector('meta[property="csp-nonce"]');return o?o.getAttribute("content"):null}var we;function Lr(){if(typeof we=="boolean")return we;if(!_r())return we=!1,we;let o=document.createElement("style"),e=Bi();e!==null&&o.setAttribute("nonce",e),document.head.appendChild(o);try{o.sheet.insertRule("foo:focus-visible {color:inherit}",0),we=!0}catch{we=!1}finally{document.head.removeChild(o)}return we}var uo="focus",ho="focusin",re="focusout";var ne="keydown";var Mr;(function(o){o[o.alt=18]="alt",o[o.arrowDown=40]="arrowDown",o[o.arrowLeft=37]="arrowLeft",o[o.arrowRight=39]="arrowRight",o[o.arrowUp=38]="arrowUp",o[o.back=8]="back",o[o.backSlash=220]="backSlash",o[o.break=19]="break",o[o.capsLock=20]="capsLock",o[o.closeBracket=221]="closeBracket",o[o.colon=186]="colon",o[o.colon2=59]="colon2",o[o.comma=188]="comma",o[o.ctrl=17]="ctrl",o[o.delete=46]="delete",o[o.end=35]="end",o[o.enter=13]="enter",o[o.equals=187]="equals",o[o.equals2=61]="equals2",o[o.equals3=107]="equals3",o[o.escape=27]="escape",o[o.forwardSlash=191]="forwardSlash",o[o.function1=112]="function1",o[o.function10=121]="function10",o[o.function11=122]="function11",o[o.function12=123]="function12",o[o.function2=113]="function2",o[o.function3=114]="function3",o[o.function4=115]="function4",o[o.function5=116]="function5",o[o.function6=117]="function6",o[o.function7=118]="function7",o[o.function8=119]="function8",o[o.function9=120]="function9",o[o.home=36]="home",o[o.insert=45]="insert",o[o.menu=93]="menu",o[o.minus=189]="minus",o[o.minus2=109]="minus2",o[o.numLock=144]="numLock",o[o.numPad0=96]="numPad0",o[o.numPad1=97]="numPad1",o[o.numPad2=98]="numPad2",o[o.numPad3=99]="numPad3",o[o.numPad4=100]="numPad4",o[o.numPad5=101]="numPad5",o[o.numPad6=102]="numPad6",o[o.numPad7=103]="numPad7",o[o.numPad8=104]="numPad8",o[o.numPad9=105]="numPad9",o[o.numPadDivide=111]="numPadDivide",o[o.numPadDot=110]="numPadDot",o[o.numPadMinus=109]="numPadMinus",o[o.numPadMultiply=106]="numPadMultiply",o[o.numPadPlus=107]="numPadPlus",o[o.openBracket=219]="openBracket",o[o.pageDown=34]="pageDown",o[o.pageUp=33]="pageUp",o[o.period=190]="period",o[o.print=44]="print",o[o.quote=222]="quote",o[o.scrollLock=145]="scrollLock",o[o.shift=16]="shift",o[o.space=32]="space",o[o.tab=9]="tab",o[o.tilde=192]="tilde",o[o.windowsLeft=91]="windowsLeft",o[o.windowsOpera=219]="windowsOpera",o[o.windowsRight=92]="windowsRight"})(Mr||(Mr={}));var Vr="ArrowDown",Hr="ArrowLeft",Nr="ArrowRight",jr="ArrowUp",gt="Enter",Ur="Escape",bt="Home",vt="End",zr="F2",qr="PageDown",Gr="PageUp",Wr=" ";var Qr=(o,e)=>y`
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
        ${Be(o,e)}
        <span class="content" part="content">
            <slot ${J("defaultSlottedContent")}></slot>
        </span>
        ${Ae(o,e)}
    </a>
`;var C=class{};u([p({attribute:"aria-atomic"})],C.prototype,"ariaAtomic",void 0);u([p({attribute:"aria-busy"})],C.prototype,"ariaBusy",void 0);u([p({attribute:"aria-controls"})],C.prototype,"ariaControls",void 0);u([p({attribute:"aria-current"})],C.prototype,"ariaCurrent",void 0);u([p({attribute:"aria-describedby"})],C.prototype,"ariaDescribedby",void 0);u([p({attribute:"aria-details"})],C.prototype,"ariaDetails",void 0);u([p({attribute:"aria-disabled"})],C.prototype,"ariaDisabled",void 0);u([p({attribute:"aria-errormessage"})],C.prototype,"ariaErrormessage",void 0);u([p({attribute:"aria-flowto"})],C.prototype,"ariaFlowto",void 0);u([p({attribute:"aria-haspopup"})],C.prototype,"ariaHaspopup",void 0);u([p({attribute:"aria-hidden"})],C.prototype,"ariaHidden",void 0);u([p({attribute:"aria-invalid"})],C.prototype,"ariaInvalid",void 0);u([p({attribute:"aria-keyshortcuts"})],C.prototype,"ariaKeyshortcuts",void 0);u([p({attribute:"aria-label"})],C.prototype,"ariaLabel",void 0);u([p({attribute:"aria-labelledby"})],C.prototype,"ariaLabelledby",void 0);u([p({attribute:"aria-live"})],C.prototype,"ariaLive",void 0);u([p({attribute:"aria-owns"})],C.prototype,"ariaOwns",void 0);u([p({attribute:"aria-relevant"})],C.prototype,"ariaRelevant",void 0);u([p({attribute:"aria-roledescription"})],C.prototype,"ariaRoledescription",void 0);var V=class extends w{constructor(){super(...arguments),this.handleUnsupportedDelegatesFocus=()=>{var e;window.ShadowRoot&&!window.ShadowRoot.prototype.hasOwnProperty("delegatesFocus")&&(!((e=this.$fastController.definition.shadowOptions)===null||e===void 0)&&e.delegatesFocus)&&(this.focus=()=>{var t;(t=this.control)===null||t===void 0||t.focus()})}}connectedCallback(){super.connectedCallback(),this.handleUnsupportedDelegatesFocus()}};u([p],V.prototype,"download",void 0);u([p],V.prototype,"href",void 0);u([p],V.prototype,"hreflang",void 0);u([p],V.prototype,"ping",void 0);u([p],V.prototype,"referrerpolicy",void 0);u([p],V.prototype,"rel",void 0);u([p],V.prototype,"target",void 0);u([p],V.prototype,"type",void 0);u([b],V.prototype,"defaultSlottedContent",void 0);var Ze=class{};u([p({attribute:"aria-expanded"})],Ze.prototype,"ariaExpanded",void 0);oe(Ze,C);oe(V,pe,Ze);var Zr=(o,e)=>y`
    <template class="${t=>t.circular?"circular":""}">
        <div class="control" part="control" style="${t=>t.generateBadgeStyle()}">
            <slot></slot>
        </div>
    </template>
`;var Ce=class extends w{constructor(){super(...arguments),this.generateBadgeStyle=()=>{if(!this.fill&&!this.color)return;let e=`background-color: var(--badge-fill-${this.fill});`,t=`color: var(--badge-color-${this.color});`;return this.fill&&!this.color?e:this.color&&!this.fill?t:`${t} ${e}`}}};u([p({attribute:"fill"})],Ce.prototype,"fill",void 0);u([p({attribute:"color"})],Ce.prototype,"color",void 0);u([p({mode:"boolean"})],Ce.prototype,"circular",void 0);var Xr=(o,e)=>y`
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
        ${Be(o,e)}
        <span class="content" part="content">
            <slot ${J("defaultSlottedContent")}></slot>
        </span>
        ${Ae(o,e)}
    </button>
`;var Jr="form-associated-proxy",Yr="ElementInternals",Kr=Yr in window&&"setFormValue"in window[Yr].prototype,en=new WeakMap;function Xe(o){let e=class extends o{constructor(...t){super(...t),this.dirtyValue=!1,this.disabled=!1,this.proxyEventsToBlock=["change","click"],this.proxyInitialized=!1,this.required=!1,this.initialValue=this.initialValue||"",this.elementInternals||(this.formResetCallback=this.formResetCallback.bind(this))}static get formAssociated(){return Kr}get validity(){return this.elementInternals?this.elementInternals.validity:this.proxy.validity}get form(){return this.elementInternals?this.elementInternals.form:this.proxy.form}get validationMessage(){return this.elementInternals?this.elementInternals.validationMessage:this.proxy.validationMessage}get willValidate(){return this.elementInternals?this.elementInternals.willValidate:this.proxy.willValidate}get labels(){if(this.elementInternals)return Object.freeze(Array.from(this.elementInternals.labels));if(this.proxy instanceof HTMLElement&&this.proxy.ownerDocument&&this.id){let t=this.proxy.labels,r=Array.from(this.proxy.getRootNode().querySelectorAll(`[for='${this.id}']`)),n=t?r.concat(Array.from(t)):r;return Object.freeze(n)}else return j}valueChanged(t,r){this.dirtyValue=!0,this.proxy instanceof HTMLElement&&(this.proxy.value=this.value),this.currentValue=this.value,this.setFormValue(this.value),this.validate()}currentValueChanged(){this.value=this.currentValue}initialValueChanged(t,r){this.dirtyValue||(this.value=this.initialValue,this.dirtyValue=!1)}disabledChanged(t,r){this.proxy instanceof HTMLElement&&(this.proxy.disabled=this.disabled),g.queueUpdate(()=>this.classList.toggle("disabled",this.disabled))}nameChanged(t,r){this.proxy instanceof HTMLElement&&(this.proxy.name=this.name)}requiredChanged(t,r){this.proxy instanceof HTMLElement&&(this.proxy.required=this.required),g.queueUpdate(()=>this.classList.toggle("required",this.required)),this.validate()}get elementInternals(){if(!Kr)return null;let t=en.get(this);return t||(t=this.attachInternals(),en.set(this,t)),t}connectedCallback(){super.connectedCallback(),this.addEventListener("keypress",this._keypressHandler),this.value||(this.value=this.initialValue,this.dirtyValue=!1),this.elementInternals||(this.attachProxy(),this.form&&this.form.addEventListener("reset",this.formResetCallback))}disconnectedCallback(){super.disconnectedCallback(),this.proxyEventsToBlock.forEach(t=>this.proxy.removeEventListener(t,this.stopPropagation)),!this.elementInternals&&this.form&&this.form.removeEventListener("reset",this.formResetCallback)}checkValidity(){return this.elementInternals?this.elementInternals.checkValidity():this.proxy.checkValidity()}reportValidity(){return this.elementInternals?this.elementInternals.reportValidity():this.proxy.reportValidity()}setValidity(t,r,n){this.elementInternals?this.elementInternals.setValidity(t,r,n):typeof r=="string"&&this.proxy.setCustomValidity(r)}formDisabledCallback(t){this.disabled=t}formResetCallback(){this.value=this.initialValue,this.dirtyValue=!1}attachProxy(){var t;this.proxyInitialized||(this.proxyInitialized=!0,this.proxy.style.display="none",this.proxyEventsToBlock.forEach(r=>this.proxy.addEventListener(r,this.stopPropagation)),this.proxy.disabled=this.disabled,this.proxy.required=this.required,typeof this.name=="string"&&(this.proxy.name=this.name),typeof this.value=="string"&&(this.proxy.value=this.value),this.proxy.setAttribute("slot",Jr),this.proxySlot=document.createElement("slot"),this.proxySlot.setAttribute("name",Jr)),(t=this.shadowRoot)===null||t===void 0||t.appendChild(this.proxySlot),this.appendChild(this.proxy)}detachProxy(){var t;this.removeChild(this.proxy),(t=this.shadowRoot)===null||t===void 0||t.removeChild(this.proxySlot)}validate(t){this.proxy instanceof HTMLElement&&this.setValidity(this.proxy.validity,this.proxy.validationMessage,t)}setFormValue(t,r){this.elementInternals&&this.elementInternals.setFormValue(t,r||t)}_keypressHandler(t){switch(t.key){case gt:if(this.form instanceof HTMLFormElement){let r=this.form.querySelector("[type=submit]");r?.click()}break}}stopPropagation(t){t.stopPropagation()}};return p({mode:"boolean"})(e.prototype,"disabled"),p({mode:"fromView",attribute:"value"})(e.prototype,"initialValue"),p({attribute:"current-value"})(e.prototype,"currentValue"),p(e.prototype,"name"),p({mode:"boolean"})(e.prototype,"required"),b(e.prototype,"value"),e}function tn(o){class e extends Xe(o){}class t extends e{constructor(...n){super(n),this.dirtyChecked=!1,this.checkedAttribute=!1,this.checked=!1,this.dirtyChecked=!1}checkedAttributeChanged(){this.defaultChecked=this.checkedAttribute}defaultCheckedChanged(){this.dirtyChecked||(this.checked=this.defaultChecked,this.dirtyChecked=!1)}checkedChanged(n,i){this.dirtyChecked||(this.dirtyChecked=!0),this.currentChecked=this.checked,this.updateForm(),this.proxy instanceof HTMLInputElement&&(this.proxy.checked=this.checked),n!==void 0&&this.$emit("change"),this.validate()}currentCheckedChanged(n,i){this.checked=this.currentChecked}updateForm(){let n=this.checked?this.value:null;this.setFormValue(n,n)}connectedCallback(){super.connectedCallback(),this.updateForm()}formResetCallback(){super.formResetCallback(),this.checked=!!this.checkedAttribute,this.dirtyChecked=!1}}return p({attribute:"checked",mode:"boolean"})(t.prototype,"checkedAttribute"),p({attribute:"current-checked",converter:zt})(t.prototype,"currentChecked"),b(t.prototype,"defaultChecked"),b(t.prototype,"checked"),t}var po=class extends w{},yt=class extends Xe(po){constructor(){super(...arguments),this.proxy=document.createElement("input")}};var H=class extends yt{constructor(){super(...arguments),this.handleClick=e=>{var t;this.disabled&&((t=this.defaultSlottedContent)===null||t===void 0?void 0:t.length)<=1&&e.stopPropagation()},this.handleSubmission=()=>{if(!this.form)return;let e=this.proxy.isConnected;e||this.attachProxy(),typeof this.form.requestSubmit=="function"?this.form.requestSubmit(this.proxy):this.proxy.click(),e||this.detachProxy()},this.handleFormReset=()=>{var e;(e=this.form)===null||e===void 0||e.reset()},this.handleUnsupportedDelegatesFocus=()=>{var e;window.ShadowRoot&&!window.ShadowRoot.prototype.hasOwnProperty("delegatesFocus")&&(!((e=this.$fastController.definition.shadowOptions)===null||e===void 0)&&e.delegatesFocus)&&(this.focus=()=>{this.control.focus()})}}formactionChanged(){this.proxy instanceof HTMLInputElement&&(this.proxy.formAction=this.formaction)}formenctypeChanged(){this.proxy instanceof HTMLInputElement&&(this.proxy.formEnctype=this.formenctype)}formmethodChanged(){this.proxy instanceof HTMLInputElement&&(this.proxy.formMethod=this.formmethod)}formnovalidateChanged(){this.proxy instanceof HTMLInputElement&&(this.proxy.formNoValidate=this.formnovalidate)}formtargetChanged(){this.proxy instanceof HTMLInputElement&&(this.proxy.formTarget=this.formtarget)}typeChanged(e,t){this.proxy instanceof HTMLInputElement&&(this.proxy.type=this.type),t==="submit"&&this.addEventListener("click",this.handleSubmission),e==="submit"&&this.removeEventListener("click",this.handleSubmission),t==="reset"&&this.addEventListener("click",this.handleFormReset),e==="reset"&&this.removeEventListener("click",this.handleFormReset)}validate(){super.validate(this.control)}connectedCallback(){var e;super.connectedCallback(),this.proxy.setAttribute("type",this.type),this.handleUnsupportedDelegatesFocus();let t=Array.from((e=this.control)===null||e===void 0?void 0:e.children);t&&t.forEach(r=>{r.addEventListener("click",this.handleClick)})}disconnectedCallback(){var e;super.disconnectedCallback();let t=Array.from((e=this.control)===null||e===void 0?void 0:e.children);t&&t.forEach(r=>{r.removeEventListener("click",this.handleClick)})}};u([p({mode:"boolean"})],H.prototype,"autofocus",void 0);u([p({attribute:"form"})],H.prototype,"formId",void 0);u([p],H.prototype,"formaction",void 0);u([p],H.prototype,"formenctype",void 0);u([p],H.prototype,"formmethod",void 0);u([p({mode:"boolean"})],H.prototype,"formnovalidate",void 0);u([p],H.prototype,"formtarget",void 0);u([p],H.prototype,"type",void 0);u([b],H.prototype,"defaultSlottedContent",void 0);var _e=class{};u([p({attribute:"aria-expanded"})],_e.prototype,"ariaExpanded",void 0);u([p({attribute:"aria-pressed"})],_e.prototype,"ariaPressed",void 0);oe(_e,C);oe(H,pe,_e);var Le={none:"none",default:"default",sticky:"sticky"},Y={default:"default",columnHeader:"columnheader",rowHeader:"rowheader"},fe={default:"default",header:"header",stickyHeader:"sticky-header"};var I=class extends w{constructor(){super(...arguments),this.rowType=fe.default,this.rowData=null,this.columnDefinitions=null,this.isActiveRow=!1,this.cellsRepeatBehavior=null,this.cellsPlaceholder=null,this.focusColumnIndex=0,this.refocusOnLoad=!1,this.updateRowStyle=()=>{this.style.gridTemplateColumns=this.gridTemplateColumns}}gridTemplateColumnsChanged(){this.$fastController.isConnected&&this.updateRowStyle()}rowTypeChanged(){this.$fastController.isConnected&&this.updateItemTemplate()}rowDataChanged(){if(this.rowData!==null&&this.isActiveRow){this.refocusOnLoad=!0;return}}cellItemTemplateChanged(){this.updateItemTemplate()}headerCellItemTemplateChanged(){this.updateItemTemplate()}connectedCallback(){super.connectedCallback(),this.cellsRepeatBehavior===null&&(this.cellsPlaceholder=document.createComment(""),this.appendChild(this.cellsPlaceholder),this.updateItemTemplate(),this.cellsRepeatBehavior=new Ie(e=>e.columnDefinitions,e=>e.activeCellItemTemplate,{positioning:!0}).createBehavior(this.cellsPlaceholder),this.$fastController.addBehaviors([this.cellsRepeatBehavior])),this.addEventListener("cell-focused",this.handleCellFocus),this.addEventListener(re,this.handleFocusout),this.addEventListener(ne,this.handleKeydown),this.updateRowStyle(),this.refocusOnLoad&&(this.refocusOnLoad=!1,this.cellElements.length>this.focusColumnIndex&&this.cellElements[this.focusColumnIndex].focus())}disconnectedCallback(){super.disconnectedCallback(),this.removeEventListener("cell-focused",this.handleCellFocus),this.removeEventListener(re,this.handleFocusout),this.removeEventListener(ne,this.handleKeydown)}handleFocusout(e){this.contains(e.target)||(this.isActiveRow=!1,this.focusColumnIndex=0)}handleCellFocus(e){this.isActiveRow=!0,this.focusColumnIndex=this.cellElements.indexOf(e.target),this.$emit("row-focused",this)}handleKeydown(e){if(e.defaultPrevented)return;let t=0;switch(e.key){case Hr:t=Math.max(0,this.focusColumnIndex-1),this.cellElements[t].focus(),e.preventDefault();break;case Nr:t=Math.min(this.cellElements.length-1,this.focusColumnIndex+1),this.cellElements[t].focus(),e.preventDefault();break;case bt:e.ctrlKey||(this.cellElements[0].focus(),e.preventDefault());break;case vt:e.ctrlKey||(this.cellElements[this.cellElements.length-1].focus(),e.preventDefault());break}}updateItemTemplate(){this.activeCellItemTemplate=this.rowType===fe.default&&this.cellItemTemplate!==void 0?this.cellItemTemplate:this.rowType===fe.default&&this.cellItemTemplate===void 0?this.defaultCellItemTemplate:this.headerCellItemTemplate!==void 0?this.headerCellItemTemplate:this.defaultHeaderCellItemTemplate}};u([p({attribute:"grid-template-columns"})],I.prototype,"gridTemplateColumns",void 0);u([p({attribute:"row-type"})],I.prototype,"rowType",void 0);u([b],I.prototype,"rowData",void 0);u([b],I.prototype,"columnDefinitions",void 0);u([b],I.prototype,"cellItemTemplate",void 0);u([b],I.prototype,"headerCellItemTemplate",void 0);u([b],I.prototype,"rowIndex",void 0);u([b],I.prototype,"isActiveRow",void 0);u([b],I.prototype,"activeCellItemTemplate",void 0);u([b],I.prototype,"defaultCellItemTemplate",void 0);u([b],I.prototype,"defaultHeaderCellItemTemplate",void 0);u([b],I.prototype,"cellElements",void 0);function _i(o){let e=o.tagFor(I);return y`
    <${e}
        :rowData="${t=>t}"
        :cellItemTemplate="${(t,r)=>r.parent.cellItemTemplate}"
        :headerCellItemTemplate="${(t,r)=>r.parent.headerCellItemTemplate}"
    ></${e}>
`}var on=(o,e)=>{let t=_i(o),r=o.tagFor(I);return y`
        <template
            role="grid"
            tabindex="0"
            :rowElementTag="${()=>r}"
            :defaultRowItemTemplate="${t}"
            ${lt({property:"rowElements",filter:Ge("[role=row]")})}
        >
            <slot></slot>
        </template>
    `};var O=class extends w{constructor(){super(),this.noTabbing=!1,this.generateHeader=Le.default,this.rowsData=[],this.columnDefinitions=null,this.focusRowIndex=0,this.focusColumnIndex=0,this.rowsPlaceholder=null,this.generatedHeader=null,this.isUpdatingFocus=!1,this.pendingFocusUpdate=!1,this.rowindexUpdateQueued=!1,this.columnDefinitionsStale=!0,this.generatedGridTemplateColumns="",this.focusOnCell=(e,t,r)=>{if(this.rowElements.length===0){this.focusRowIndex=0,this.focusColumnIndex=0;return}let n=Math.max(0,Math.min(this.rowElements.length-1,e)),s=this.rowElements[n].querySelectorAll('[role="cell"], [role="gridcell"], [role="columnheader"], [role="rowheader"]'),a=Math.max(0,Math.min(s.length-1,t)),l=s[a];r&&this.scrollHeight!==this.clientHeight&&(n<this.focusRowIndex&&this.scrollTop>0||n>this.focusRowIndex&&this.scrollTop<this.scrollHeight-this.clientHeight)&&l.scrollIntoView({block:"center",inline:"center"}),l.focus()},this.onChildListChange=(e,t)=>{e&&e.length&&(e.forEach(r=>{r.addedNodes.forEach(n=>{n.nodeType===1&&n.getAttribute("role")==="row"&&(n.columnDefinitions=this.columnDefinitions)})}),this.queueRowIndexUpdate())},this.queueRowIndexUpdate=()=>{this.rowindexUpdateQueued||(this.rowindexUpdateQueued=!0,g.queueUpdate(this.updateRowIndexes))},this.updateRowIndexes=()=>{let e=this.gridTemplateColumns;if(e===void 0){if(this.generatedGridTemplateColumns===""&&this.rowElements.length>0){let t=this.rowElements[0];this.generatedGridTemplateColumns=new Array(t.cellElements.length).fill("1fr").join(" ")}e=this.generatedGridTemplateColumns}this.rowElements.forEach((t,r)=>{let n=t;n.rowIndex=r,n.gridTemplateColumns=e,this.columnDefinitionsStale&&(n.columnDefinitions=this.columnDefinitions)}),this.rowindexUpdateQueued=!1,this.columnDefinitionsStale=!1}}static generateTemplateColumns(e){let t="";return e.forEach(r=>{t=`${t}${t===""?"":" "}1fr`}),t}noTabbingChanged(){this.$fastController.isConnected&&(this.noTabbing?this.setAttribute("tabIndex","-1"):this.setAttribute("tabIndex",this.contains(document.activeElement)||this===document.activeElement?"-1":"0"))}generateHeaderChanged(){this.$fastController.isConnected&&this.toggleGeneratedHeader()}gridTemplateColumnsChanged(){this.$fastController.isConnected&&this.updateRowIndexes()}rowsDataChanged(){this.columnDefinitions===null&&this.rowsData.length>0&&(this.columnDefinitions=O.generateColumns(this.rowsData[0])),this.$fastController.isConnected&&this.toggleGeneratedHeader()}columnDefinitionsChanged(){if(this.columnDefinitions===null){this.generatedGridTemplateColumns="";return}this.generatedGridTemplateColumns=O.generateTemplateColumns(this.columnDefinitions),this.$fastController.isConnected&&(this.columnDefinitionsStale=!0,this.queueRowIndexUpdate())}headerCellItemTemplateChanged(){this.$fastController.isConnected&&this.generatedHeader!==null&&(this.generatedHeader.headerCellItemTemplate=this.headerCellItemTemplate)}focusRowIndexChanged(){this.$fastController.isConnected&&this.queueFocusUpdate()}focusColumnIndexChanged(){this.$fastController.isConnected&&this.queueFocusUpdate()}connectedCallback(){super.connectedCallback(),this.rowItemTemplate===void 0&&(this.rowItemTemplate=this.defaultRowItemTemplate),this.rowsPlaceholder=document.createComment(""),this.appendChild(this.rowsPlaceholder),this.toggleGeneratedHeader(),this.rowsRepeatBehavior=new Ie(e=>e.rowsData,e=>e.rowItemTemplate,{positioning:!0}).createBehavior(this.rowsPlaceholder),this.$fastController.addBehaviors([this.rowsRepeatBehavior]),this.addEventListener("row-focused",this.handleRowFocus),this.addEventListener(uo,this.handleFocus),this.addEventListener(ne,this.handleKeydown),this.addEventListener(re,this.handleFocusOut),this.observer=new MutationObserver(this.onChildListChange),this.observer.observe(this,{childList:!0}),this.noTabbing&&this.setAttribute("tabindex","-1"),g.queueUpdate(this.queueRowIndexUpdate)}disconnectedCallback(){super.disconnectedCallback(),this.removeEventListener("row-focused",this.handleRowFocus),this.removeEventListener(uo,this.handleFocus),this.removeEventListener(ne,this.handleKeydown),this.removeEventListener(re,this.handleFocusOut),this.observer.disconnect(),this.rowsPlaceholder=null,this.generatedHeader=null}handleRowFocus(e){this.isUpdatingFocus=!0;let t=e.target;this.focusRowIndex=this.rowElements.indexOf(t),this.focusColumnIndex=t.focusColumnIndex,this.setAttribute("tabIndex","-1"),this.isUpdatingFocus=!1}handleFocus(e){this.focusOnCell(this.focusRowIndex,this.focusColumnIndex,!0)}handleFocusOut(e){(e.relatedTarget===null||!this.contains(e.relatedTarget))&&this.setAttribute("tabIndex",this.noTabbing?"-1":"0")}handleKeydown(e){if(e.defaultPrevented)return;let t,r=this.rowElements.length-1,n=this.offsetHeight+this.scrollTop,i=this.rowElements[r];switch(e.key){case jr:e.preventDefault(),this.focusOnCell(this.focusRowIndex-1,this.focusColumnIndex,!0);break;case Vr:e.preventDefault(),this.focusOnCell(this.focusRowIndex+1,this.focusColumnIndex,!0);break;case Gr:if(e.preventDefault(),this.rowElements.length===0){this.focusOnCell(0,0,!1);break}if(this.focusRowIndex===0){this.focusOnCell(0,this.focusColumnIndex,!1);return}for(t=this.focusRowIndex-1,t;t>=0;t--){let s=this.rowElements[t];if(s.offsetTop<this.scrollTop){this.scrollTop=s.offsetTop+s.clientHeight-this.clientHeight;break}}this.focusOnCell(t,this.focusColumnIndex,!1);break;case qr:if(e.preventDefault(),this.rowElements.length===0){this.focusOnCell(0,0,!1);break}if(this.focusRowIndex>=r||i.offsetTop+i.offsetHeight<=n){this.focusOnCell(r,this.focusColumnIndex,!1);return}for(t=this.focusRowIndex+1,t;t<=r;t++){let s=this.rowElements[t];if(s.offsetTop+s.offsetHeight>n){let a=0;this.generateHeader===Le.sticky&&this.generatedHeader!==null&&(a=this.generatedHeader.clientHeight),this.scrollTop=s.offsetTop-a;break}}this.focusOnCell(t,this.focusColumnIndex,!1);break;case bt:e.ctrlKey&&(e.preventDefault(),this.focusOnCell(0,0,!0));break;case vt:e.ctrlKey&&this.columnDefinitions!==null&&(e.preventDefault(),this.focusOnCell(this.rowElements.length-1,this.columnDefinitions.length-1,!0));break}}queueFocusUpdate(){this.isUpdatingFocus&&(this.contains(document.activeElement)||this===document.activeElement)||this.pendingFocusUpdate===!1&&(this.pendingFocusUpdate=!0,g.queueUpdate(()=>this.updateFocus()))}updateFocus(){this.pendingFocusUpdate=!1,this.focusOnCell(this.focusRowIndex,this.focusColumnIndex,!0)}toggleGeneratedHeader(){if(this.generatedHeader!==null&&(this.removeChild(this.generatedHeader),this.generatedHeader=null),this.generateHeader!==Le.none&&this.rowsData.length>0){let e=document.createElement(this.rowElementTag);this.generatedHeader=e,this.generatedHeader.columnDefinitions=this.columnDefinitions,this.generatedHeader.gridTemplateColumns=this.gridTemplateColumns,this.generatedHeader.rowType=this.generateHeader===Le.sticky?fe.stickyHeader:fe.header,(this.firstChild!==null||this.rowsPlaceholder!==null)&&this.insertBefore(e,this.firstChild!==null?this.firstChild:this.rowsPlaceholder);return}}};O.generateColumns=o=>Object.getOwnPropertyNames(o).map((e,t)=>({columnDataKey:e,gridColumn:`${t}`}));u([p({attribute:"no-tabbing",mode:"boolean"})],O.prototype,"noTabbing",void 0);u([p({attribute:"generate-header"})],O.prototype,"generateHeader",void 0);u([p({attribute:"grid-template-columns"})],O.prototype,"gridTemplateColumns",void 0);u([b],O.prototype,"rowsData",void 0);u([b],O.prototype,"columnDefinitions",void 0);u([b],O.prototype,"rowItemTemplate",void 0);u([b],O.prototype,"cellItemTemplate",void 0);u([b],O.prototype,"headerCellItemTemplate",void 0);u([b],O.prototype,"focusRowIndex",void 0);u([b],O.prototype,"focusColumnIndex",void 0);u([b],O.prototype,"defaultRowItemTemplate",void 0);u([b],O.prototype,"rowElementTag",void 0);u([b],O.prototype,"rowElements",void 0);var Li=y`
    <template>
        ${o=>o.rowData===null||o.columnDefinition===null||o.columnDefinition.columnDataKey===null?null:o.rowData[o.columnDefinition.columnDataKey]}
    </template>
`,Mi=y`
    <template>
        ${o=>o.columnDefinition===null?null:o.columnDefinition.title===void 0?o.columnDefinition.columnDataKey:o.columnDefinition.title}
    </template>
`,z=class extends w{constructor(){super(...arguments),this.cellType=Y.default,this.rowData=null,this.columnDefinition=null,this.isActiveCell=!1,this.customCellView=null,this.updateCellStyle=()=>{this.style.gridColumn=this.gridColumn}}cellTypeChanged(){this.$fastController.isConnected&&this.updateCellView()}gridColumnChanged(){this.$fastController.isConnected&&this.updateCellStyle()}columnDefinitionChanged(e,t){this.$fastController.isConnected&&this.updateCellView()}connectedCallback(){var e;super.connectedCallback(),this.addEventListener(ho,this.handleFocusin),this.addEventListener(re,this.handleFocusout),this.addEventListener(ne,this.handleKeydown),this.style.gridColumn=`${((e=this.columnDefinition)===null||e===void 0?void 0:e.gridColumn)===void 0?0:this.columnDefinition.gridColumn}`,this.updateCellView(),this.updateCellStyle()}disconnectedCallback(){super.disconnectedCallback(),this.removeEventListener(ho,this.handleFocusin),this.removeEventListener(re,this.handleFocusout),this.removeEventListener(ne,this.handleKeydown),this.disconnectCellView()}handleFocusin(e){if(!this.isActiveCell){switch(this.isActiveCell=!0,this.cellType){case Y.columnHeader:if(this.columnDefinition!==null&&this.columnDefinition.headerCellInternalFocusQueue!==!0&&typeof this.columnDefinition.headerCellFocusTargetCallback=="function"){let t=this.columnDefinition.headerCellFocusTargetCallback(this);t!==null&&t.focus()}break;default:if(this.columnDefinition!==null&&this.columnDefinition.cellInternalFocusQueue!==!0&&typeof this.columnDefinition.cellFocusTargetCallback=="function"){let t=this.columnDefinition.cellFocusTargetCallback(this);t!==null&&t.focus()}break}this.$emit("cell-focused",this)}}handleFocusout(e){this!==document.activeElement&&!this.contains(document.activeElement)&&(this.isActiveCell=!1)}handleKeydown(e){if(!(e.defaultPrevented||this.columnDefinition===null||this.cellType===Y.default&&this.columnDefinition.cellInternalFocusQueue!==!0||this.cellType===Y.columnHeader&&this.columnDefinition.headerCellInternalFocusQueue!==!0))switch(e.key){case gt:case zr:if(this.contains(document.activeElement)&&document.activeElement!==this)return;switch(this.cellType){case Y.columnHeader:if(this.columnDefinition.headerCellFocusTargetCallback!==void 0){let t=this.columnDefinition.headerCellFocusTargetCallback(this);t!==null&&t.focus(),e.preventDefault()}break;default:if(this.columnDefinition.cellFocusTargetCallback!==void 0){let t=this.columnDefinition.cellFocusTargetCallback(this);t!==null&&t.focus(),e.preventDefault()}break}break;case Ur:this.contains(document.activeElement)&&document.activeElement!==this&&(this.focus(),e.preventDefault());break}}updateCellView(){if(this.disconnectCellView(),this.columnDefinition!==null)switch(this.cellType){case Y.columnHeader:this.columnDefinition.headerCellTemplate!==void 0?this.customCellView=this.columnDefinition.headerCellTemplate.render(this,this):this.customCellView=Mi.render(this,this);break;case void 0:case Y.rowHeader:case Y.default:this.columnDefinition.cellTemplate!==void 0?this.customCellView=this.columnDefinition.cellTemplate.render(this,this):this.customCellView=Li.render(this,this);break}}disconnectCellView(){this.customCellView!==null&&(this.customCellView.dispose(),this.customCellView=null)}};u([p({attribute:"cell-type"})],z.prototype,"cellType",void 0);u([p({attribute:"grid-column"})],z.prototype,"gridColumn",void 0);u([b],z.prototype,"rowData",void 0);u([b],z.prototype,"columnDefinition",void 0);function Vi(o){let e=o.tagFor(z);return y`
    <${e}
        cell-type="${t=>t.isRowHeader?"rowheader":void 0}"
        grid-column="${(t,r)=>r.index+1}"
        :rowData="${(t,r)=>r.parent.rowData}"
        :columnDefinition="${t=>t}"
    ></${e}>
`}function Hi(o){let e=o.tagFor(z);return y`
    <${e}
        cell-type="columnheader"
        grid-column="${(t,r)=>r.index+1}"
        :columnDefinition="${t=>t}"
    ></${e}>
`}var rn=(o,e)=>{let t=Vi(o),r=Hi(o);return y`
        <template
            role="row"
            class="${n=>n.rowType!=="default"?n.rowType:""}"
            :defaultCellItemTemplate="${t}"
            :defaultHeaderCellItemTemplate="${r}"
            ${lt({property:"cellElements",filter:Ge('[role="cell"],[role="gridcell"],[role="columnheader"],[role="rowheader"]')})}
        >
            <slot ${J("slottedCellElements")}></slot>
        </template>
    `};var nn=(o,e)=>y`
        <template
            tabindex="-1"
            role="${t=>!t.cellType||t.cellType==="default"?"gridcell":t.cellType}"
            class="
            ${t=>t.cellType==="columnheader"?"column-header":t.cellType==="rowheader"?"row-header":""}
            "
        >
            <slot></slot>
        </template>
    `;var sn=(o,e)=>y`
    <template
        role="checkbox"
        aria-checked="${t=>t.checked}"
        aria-required="${t=>t.required}"
        aria-disabled="${t=>t.disabled}"
        aria-readonly="${t=>t.readOnly}"
        tabindex="${t=>t.disabled?null:0}"
        @keypress="${(t,r)=>t.keypressHandler(r.event)}"
        @click="${(t,r)=>t.clickHandler(r.event)}"
        class="${t=>t.readOnly?"readonly":""} ${t=>t.checked?"checked":""} ${t=>t.indeterminate?"indeterminate":""}"
    >
        <div part="control" class="control">
            <slot name="checked-indicator">
                ${e.checkedIndicator||""}
            </slot>
            <slot name="indeterminate-indicator">
                ${e.indeterminateIndicator||""}
            </slot>
        </div>
        <label
            part="label"
            class="${t=>t.defaultSlottedNodes&&t.defaultSlottedNodes.length?"label":"label label__hidden"}"
        >
            <slot ${J("defaultSlottedNodes")}></slot>
        </label>
    </template>
`;var fo=class extends w{},xt=class extends tn(fo){constructor(){super(...arguments),this.proxy=document.createElement("input")}};var ke=class extends xt{constructor(){super(),this.initialValue="on",this.indeterminate=!1,this.keypressHandler=e=>{if(!this.readOnly)switch(e.key){case Wr:this.indeterminate&&(this.indeterminate=!1),this.checked=!this.checked;break}},this.clickHandler=e=>{!this.disabled&&!this.readOnly&&(this.indeterminate&&(this.indeterminate=!1),this.checked=!this.checked)},this.proxy.setAttribute("type","checkbox")}readOnlyChanged(){this.proxy instanceof HTMLInputElement&&(this.proxy.readOnly=this.readOnly)}};u([p({attribute:"readonly",mode:"boolean"})],ke.prototype,"readOnly",void 0);u([b],ke.prototype,"defaultSlottedNodes",void 0);u([b],ke.prototype,"indeterminate",void 0);function Je(o){let e=o.parentElement;if(e)return e;{let t=o.getRootNode();if(t.host instanceof HTMLElement)return t.host}return null}function an(o,e){let t=e;for(;t!==null;){if(t===o)return!0;t=Je(t)}return!1}var K=document.createElement("div");function Ni(o){return o instanceof he}var Ye=class{setProperty(e,t){g.queueUpdate(()=>this.target.setProperty(e,t))}removeProperty(e){g.queueUpdate(()=>this.target.removeProperty(e))}},go=class extends Ye{constructor(e){super();let t=new CSSStyleSheet;this.target=t.cssRules[t.insertRule(":host{}")].style,e.$fastController.addStyles(R.create([t]))}},bo=class extends Ye{constructor(){super();let e=new CSSStyleSheet;this.target=e.cssRules[e.insertRule(":root{}")].style,document.adoptedStyleSheets=[...document.adoptedStyleSheets,e]}},vo=class extends Ye{constructor(){super(),this.style=document.createElement("style"),document.head.appendChild(this.style);let{sheet:e}=this.style;if(e){let t=e.insertRule(":root{}",e.cssRules.length);this.target=e.cssRules[t].style}}},wt=class{constructor(e){this.store=new Map,this.target=null;let t=e.$fastController;this.style=document.createElement("style"),t.addStyles(this.style),v.getNotifier(t).subscribe(this,"isConnected"),this.handleChange(t,"isConnected")}targetChanged(){if(this.target!==null)for(let[e,t]of this.store.entries())this.target.setProperty(e,t)}setProperty(e,t){this.store.set(e,t),g.queueUpdate(()=>{this.target!==null&&this.target.setProperty(e,t)})}removeProperty(e){this.store.delete(e),g.queueUpdate(()=>{this.target!==null&&this.target.removeProperty(e)})}handleChange(e,t){let{sheet:r}=this.style;if(r){let n=r.insertRule(":host{}",r.cssRules.length);this.target=r.cssRules[n].style}else this.target=null}};u([b],wt.prototype,"target",void 0);var yo=class{constructor(e){this.target=e.style}setProperty(e,t){g.queueUpdate(()=>this.target.setProperty(e,t))}removeProperty(e){g.queueUpdate(()=>this.target.removeProperty(e))}},P=class{setProperty(e,t){P.properties[e]=t;for(let r of P.roots.values())$e.getOrCreate(P.normalizeRoot(r)).setProperty(e,t)}removeProperty(e){delete P.properties[e];for(let t of P.roots.values())$e.getOrCreate(P.normalizeRoot(t)).removeProperty(e)}static registerRoot(e){let{roots:t}=P;if(!t.has(e)){t.add(e);let r=$e.getOrCreate(this.normalizeRoot(e));for(let n in P.properties)r.setProperty(n,P.properties[n])}}static unregisterRoot(e){let{roots:t}=P;if(t.has(e)){t.delete(e);let r=$e.getOrCreate(P.normalizeRoot(e));for(let n in P.properties)r.removeProperty(n)}}static normalizeRoot(e){return e===K?document:e}};P.roots=new Set;P.properties={};var mo=new WeakMap,ji=g.supportsAdoptedStyleSheets?go:wt,$e=Object.freeze({getOrCreate(o){if(mo.has(o))return mo.get(o);let e;return o===K?e=new P:o instanceof Document?e=g.supportsAdoptedStyleSheets?new bo:new vo:Ni(o)?e=new ji(o):e=new yo(o),mo.set(o,e),e}});var A=class extends ve{constructor(e){super(),this.subscribers=new WeakMap,this._appliedTo=new Set,this.name=e.name,e.cssCustomPropertyName!==null&&(this.cssCustomProperty=`--${e.cssCustomPropertyName}`,this.cssVar=`var(${this.cssCustomProperty})`),this.id=A.uniqueId(),A.tokensById.set(this.id,this)}get appliedTo(){return[...this._appliedTo]}static from(e){return new A({name:typeof e=="string"?e:e.name,cssCustomPropertyName:typeof e=="string"?e:e.cssCustomPropertyName===void 0?e.name:e.cssCustomPropertyName})}static isCSSDesignToken(e){return typeof e.cssCustomProperty=="string"}static isDerivedDesignTokenValue(e){return typeof e=="function"}static getTokenById(e){return A.tokensById.get(e)}getOrCreateSubscriberSet(e=this){return this.subscribers.get(e)||this.subscribers.set(e,new Set)&&this.subscribers.get(e)}createCSS(){return this.cssVar||""}getValueFor(e){let t=E.getOrCreate(e).get(this);if(t!==void 0)return t;throw new Error(`Value could not be retrieved for token named "${this.name}". Ensure the value is set for ${e} or an ancestor of ${e}.`)}setValueFor(e,t){return this._appliedTo.add(e),t instanceof A&&(t=this.alias(t)),E.getOrCreate(e).set(this,t),this}deleteValueFor(e){return this._appliedTo.delete(e),E.existsFor(e)&&E.getOrCreate(e).delete(this),this}withDefault(e){return this.setValueFor(K,e),this}subscribe(e,t){let r=this.getOrCreateSubscriberSet(t);t&&!E.existsFor(t)&&E.getOrCreate(t),r.has(e)||r.add(e)}unsubscribe(e,t){let r=this.subscribers.get(t||this);r&&r.has(e)&&r.delete(e)}notify(e){let t=Object.freeze({token:this,target:e});this.subscribers.has(this)&&this.subscribers.get(this).forEach(r=>r.handleChange(t)),this.subscribers.has(e)&&this.subscribers.get(e).forEach(r=>r.handleChange(t))}alias(e){return t=>e.getValueFor(t)}};A.uniqueId=(()=>{let o=0;return()=>(o++,o.toString(16))})();A.tokensById=new Map;var xo=class{startReflection(e,t){e.subscribe(this,t),this.handleChange({token:e,target:t})}stopReflection(e,t){e.unsubscribe(this,t),this.remove(e,t)}handleChange(e){let{token:t,target:r}=e;this.add(t,r)}add(e,t){$e.getOrCreate(t).setProperty(e.cssCustomProperty,this.resolveCSSValue(E.getOrCreate(t).get(e)))}remove(e,t){$e.getOrCreate(t).removeProperty(e.cssCustomProperty)}resolveCSSValue(e){return e&&typeof e.createCSS=="function"?e.createCSS():e}},wo=class{constructor(e,t,r){this.source=e,this.token=t,this.node=r,this.dependencies=new Set,this.observer=v.binding(e,this,!1),this.observer.handleChange=this.observer.call,this.handleChange()}disconnect(){this.observer.disconnect()}handleChange(){this.node.store.set(this.token,this.observer.observe(this.node.target,ce))}},Co=class{constructor(){this.values=new Map}set(e,t){this.values.get(e)!==t&&(this.values.set(e,t),v.getNotifier(this).notify(e.id))}get(e){return v.track(this,e.id),this.values.get(e)}delete(e){this.values.delete(e)}all(){return this.values.entries()}},Ke=new WeakMap,et=new WeakMap,E=class{constructor(e){this.target=e,this.store=new Co,this.children=[],this.assignedValues=new Map,this.reflecting=new Set,this.bindingObservers=new Map,this.tokenValueChangeHandler={handleChange:(t,r)=>{let n=A.getTokenById(r);if(n&&(n.notify(this.target),A.isCSSDesignToken(n))){let i=this.parent,s=this.isReflecting(n);if(i){let a=i.get(n),l=t.get(n);a!==l&&!s?this.reflectToCSS(n):a===l&&s&&this.stopReflectToCSS(n)}else s||this.reflectToCSS(n)}}},Ke.set(e,this),v.getNotifier(this.store).subscribe(this.tokenValueChangeHandler),e instanceof he?e.$fastController.addBehaviors([this]):e.isConnected&&this.bind()}static getOrCreate(e){return Ke.get(e)||new E(e)}static existsFor(e){return Ke.has(e)}static findParent(e){if(K!==e.target){let t=Je(e.target);for(;t!==null;){if(Ke.has(t))return Ke.get(t);t=Je(t)}return E.getOrCreate(K)}return null}static findClosestAssignedNode(e,t){let r=t;do{if(r.has(e))return r;r=r.parent?r.parent:r.target!==K?E.getOrCreate(K):null}while(r!==null);return null}get parent(){return et.get(this)||null}has(e){return this.assignedValues.has(e)}get(e){let t=this.store.get(e);if(t!==void 0)return t;let r=this.getRaw(e);if(r!==void 0)return this.hydrate(e,r),this.get(e)}getRaw(e){var t;return this.assignedValues.has(e)?this.assignedValues.get(e):(t=E.findClosestAssignedNode(e,this))===null||t===void 0?void 0:t.getRaw(e)}set(e,t){A.isDerivedDesignTokenValue(this.assignedValues.get(e))&&this.tearDownBindingObserver(e),this.assignedValues.set(e,t),A.isDerivedDesignTokenValue(t)?this.setupBindingObserver(e,t):this.store.set(e,t)}delete(e){this.assignedValues.delete(e),this.tearDownBindingObserver(e);let t=this.getRaw(e);t?this.hydrate(e,t):this.store.delete(e)}bind(){let e=E.findParent(this);e&&e.appendChild(this);for(let t of this.assignedValues.keys())t.notify(this.target)}unbind(){this.parent&&et.get(this).removeChild(this)}appendChild(e){e.parent&&et.get(e).removeChild(e);let t=this.children.filter(r=>e.contains(r));et.set(e,this),this.children.push(e),t.forEach(r=>e.appendChild(r)),v.getNotifier(this.store).subscribe(e);for(let[r,n]of this.store.all())e.hydrate(r,this.bindingObservers.has(r)?this.getRaw(r):n)}removeChild(e){let t=this.children.indexOf(e);return t!==-1&&this.children.splice(t,1),v.getNotifier(this.store).unsubscribe(e),e.parent===this?et.delete(e):!1}contains(e){return an(this.target,e.target)}reflectToCSS(e){this.isReflecting(e)||(this.reflecting.add(e),E.cssCustomPropertyReflector.startReflection(e,this.target))}stopReflectToCSS(e){this.isReflecting(e)&&(this.reflecting.delete(e),E.cssCustomPropertyReflector.stopReflection(e,this.target))}isReflecting(e){return this.reflecting.has(e)}handleChange(e,t){let r=A.getTokenById(t);r&&this.hydrate(r,this.getRaw(r))}hydrate(e,t){if(!this.has(e)){let r=this.bindingObservers.get(e);A.isDerivedDesignTokenValue(t)?r?r.source!==t&&(this.tearDownBindingObserver(e),this.setupBindingObserver(e,t)):this.setupBindingObserver(e,t):(r&&this.tearDownBindingObserver(e),this.store.set(e,t))}}setupBindingObserver(e,t){let r=new wo(t,e,this);return this.bindingObservers.set(e,r),r}tearDownBindingObserver(e){return this.bindingObservers.has(e)?(this.bindingObservers.get(e).disconnect(),this.bindingObservers.delete(e),!0):!1}};E.cssCustomPropertyReflector=new xo;u([b],E.prototype,"children",void 0);function Ui(o){return A.from(o)}var tt=Object.freeze({create:Ui,notifyConnection(o){return!o.isConnected||!E.existsFor(o)?!1:(E.getOrCreate(o).bind(),!0)},notifyDisconnection(o){return o.isConnected||!E.existsFor(o)?!1:(E.getOrCreate(o).unbind(),!0)},registerRoot(o=K){P.registerRoot(o)},unregisterRoot(o=K){P.unregisterRoot(o)}});var ko=Object.freeze({definitionCallbackOnly:null,ignoreDuplicate:Symbol()}),$o=new Map,Ct=new Map,Me=null,ot=x.createInterface(o=>o.cachedCallback(e=>(Me===null&&(Me=new kt(null,e)),Me))),To=Object.freeze({tagFor(o){return Ct.get(o)},responsibleFor(o){let e=o.$$designSystem$$;return e||x.findResponsibleContainer(o).get(ot)},getOrCreate(o){if(!o)return Me===null&&(Me=x.getOrCreateDOMContainer().get(ot)),Me;let e=o.$$designSystem$$;if(e)return e;let t=x.getOrCreateDOMContainer(o);if(t.has(ot,!1))return t.get(ot);{let r=new kt(o,t);return t.register(xe.instance(ot,r)),r}}});function zi(o,e,t){return typeof o=="string"?{name:o,type:e,callback:t}:o}var kt=class{constructor(e,t){this.owner=e,this.container=t,this.designTokensInitialized=!1,this.prefix="fast",this.shadowRootMode=void 0,this.disambiguate=()=>ko.definitionCallbackOnly,e!==null&&(e.$$designSystem$$=this)}withPrefix(e){return this.prefix=e,this}withShadowRootMode(e){return this.shadowRootMode=e,this}withElementDisambiguation(e){return this.disambiguate=e,this}withDesignTokenRoot(e){return this.designTokenRoot=e,this}register(...e){let t=this.container,r=[],n=this.disambiguate,i=this.shadowRootMode,s={elementPrefix:this.prefix,tryDefineElement(a,l,c){let d=zi(a,l,c),{name:h,callback:m,baseClass:k}=d,{type:$}=d,F=h,W=$o.get(F),je=!0;for(;W;){let se=n(F,$,W);switch(se){case ko.ignoreDuplicate:return;case ko.definitionCallbackOnly:je=!1,W=void 0;break;default:F=se,W=$o.get(F);break}}je&&((Ct.has($)||$===w)&&($=class extends ${}),$o.set(F,$),Ct.set($,F),k&&Ct.set(k,F)),r.push(new So(t,F,$,i,m,je))}};this.designTokensInitialized||(this.designTokensInitialized=!0,this.designTokenRoot!==null&&tt.registerRoot(this.designTokenRoot)),t.registerWithContext(s,...e);for(let a of r)a.callback(a),a.willDefine&&a.definition!==null&&a.definition.define();return this}},So=class{constructor(e,t,r,n,i,s){this.container=e,this.name=t,this.type=r,this.shadowRootMode=n,this.callback=i,this.willDefine=s,this.definition=null}definePresentation(e){mt.define(this.name,e,this.container)}defineElement(e){this.definition=new X(this.type,Object.assign(Object.assign({},e),{name:this.name}))}tagFor(e){return To.tagFor(e)}};var ln=(o,e)=>y`
    <template role="${t=>t.role}" aria-orientation="${t=>t.orientation}"></template>
`;var Do={separator:"separator",presentation:"presentation"};var Ve=class extends w{constructor(){super(...arguments),this.role=Do.separator,this.orientation=Br.horizontal}};u([p],Ve.prototype,"role",void 0);u([p],Ve.prototype,"orientation",void 0);var Eo=class extends w{},$t=class extends Xe(Eo){constructor(){super(...arguments),this.proxy=document.createElement("input")}};var Oo={email:"email",password:"password",tel:"tel",text:"text",url:"url"};var B=class extends $t{constructor(){super(...arguments),this.type=Oo.text}readOnlyChanged(){this.proxy instanceof HTMLInputElement&&(this.proxy.readOnly=this.readOnly,this.validate())}autofocusChanged(){this.proxy instanceof HTMLInputElement&&(this.proxy.autofocus=this.autofocus,this.validate())}placeholderChanged(){this.proxy instanceof HTMLInputElement&&(this.proxy.placeholder=this.placeholder)}typeChanged(){this.proxy instanceof HTMLInputElement&&(this.proxy.type=this.type,this.validate())}listChanged(){this.proxy instanceof HTMLInputElement&&(this.proxy.setAttribute("list",this.list),this.validate())}maxlengthChanged(){this.proxy instanceof HTMLInputElement&&(this.proxy.maxLength=this.maxlength,this.validate())}minlengthChanged(){this.proxy instanceof HTMLInputElement&&(this.proxy.minLength=this.minlength,this.validate())}patternChanged(){this.proxy instanceof HTMLInputElement&&(this.proxy.pattern=this.pattern,this.validate())}sizeChanged(){this.proxy instanceof HTMLInputElement&&(this.proxy.size=this.size)}spellcheckChanged(){this.proxy instanceof HTMLInputElement&&(this.proxy.spellcheck=this.spellcheck)}connectedCallback(){super.connectedCallback(),this.proxy.setAttribute("type",this.type),this.validate(),this.autofocus&&g.queueUpdate(()=>{this.focus()})}select(){this.control.select(),this.$emit("select")}handleTextInput(){this.value=this.control.value}handleChange(){this.$emit("change")}validate(){super.validate(this.control)}};u([p({attribute:"readonly",mode:"boolean"})],B.prototype,"readOnly",void 0);u([p({mode:"boolean"})],B.prototype,"autofocus",void 0);u([p],B.prototype,"placeholder",void 0);u([p],B.prototype,"type",void 0);u([p],B.prototype,"list",void 0);u([p({converter:at})],B.prototype,"maxlength",void 0);u([p({converter:at})],B.prototype,"minlength",void 0);u([p],B.prototype,"pattern",void 0);u([p({converter:at})],B.prototype,"size",void 0);u([p({mode:"boolean"})],B.prototype,"spellcheck",void 0);u([b],B.prototype,"defaultSlottedNodes",void 0);var St=class{};oe(St,C);oe(B,pe,St);function cn(o,e,t){return o.nodeType!==Node.TEXT_NODE?!0:typeof o.nodeValue=="string"&&!!o.nodeValue.trim().length}var dn=(o,e)=>y`
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
                ${J({property:"defaultSlottedNodes",filter:cn})}
            ></slot>
        </label>
        <div class="root" part="root">
            ${Be(o,e)}
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
            ${Ae(o,e)}
        </div>
    </template>
`;var He="not-allowed";var qi=":host([hidden]){display:none}";function q(o){return`${qi}:host{display:${o}}`}var N=Lr()?"focus-visible":"focus";function un(o){return To.getOrCreate(o).withPrefix("vscode")}function pn(o){window.addEventListener("load",()=>{new MutationObserver(()=>{hn(o)}).observe(document.body,{attributes:!0,attributeFilter:["class"]}),hn(o)})}function hn(o){let e=getComputedStyle(document.body),t=document.querySelector("body");if(t){let r=t.getAttribute("data-vscode-theme-kind");for(let[n,i]of o){let s=e.getPropertyValue(n).toString();if(r==="vscode-high-contrast")s.length===0&&i.name.includes("background")&&(s="transparent"),i.name==="button-icon-hover-background"&&(s="transparent");else if(r==="vscode-high-contrast-light"){if(s.length===0&&i.name.includes("background"))switch(i.name){case"button-primary-hover-background":s="#0F4A85";break;case"button-secondary-hover-background":s="transparent";break;case"button-icon-hover-background":s="transparent";break}}else i.name==="contrast-active-border"&&(s="transparent");i.setValueFor(t,s)}}}var fn=new Map,mn=!1;function f(o,e){let t=tt.create(o);if(e){if(e.includes("--fake-vscode-token")){let r="id"+Math.random().toString(16).slice(2);e=`${e}-${r}`}fn.set(e,t)}return mn||(pn(fn),mn=!0),t}var gn=f("background","--vscode-editor-background").withDefault("#1e1e1e"),T=f("border-width").withDefault(1),Tt=f("contrast-active-border","--vscode-contrastActiveBorder").withDefault("#f38518"),Vu=f("contrast-border","--vscode-contrastBorder").withDefault("#6fc3df"),Dt=f("corner-radius").withDefault(0),Et=f("corner-radius-round").withDefault(2),S=f("design-unit").withDefault(4),Ne=f("disabled-opacity").withDefault(.4),M=f("focus-border","--vscode-focusBorder").withDefault("#007fd4"),G=f("font-family","--vscode-font-family").withDefault("-apple-system, BlinkMacSystemFont, Segoe UI, Roboto, Helvetica, Arial, sans-serif, Apple Color Emoji, Segoe UI Emoji, Segoe UI Symbol"),Hu=f("font-weight","--vscode-font-weight").withDefault("400"),ee=f("foreground","--vscode-foreground").withDefault("#cccccc"),bn=f("input-height").withDefault("26"),vn=f("input-min-width").withDefault("100px"),Q=f("type-ramp-base-font-size","--vscode-font-size").withDefault("13px"),Z=f("type-ramp-base-line-height").withDefault("normal"),yn=f("type-ramp-minus1-font-size").withDefault("11px"),xn=f("type-ramp-minus1-line-height").withDefault("16px"),Nu=f("type-ramp-minus2-font-size").withDefault("9px"),ju=f("type-ramp-minus2-line-height").withDefault("16px"),Uu=f("type-ramp-plus1-font-size").withDefault("16px"),zu=f("type-ramp-plus1-line-height").withDefault("24px"),qu=f("scrollbarWidth").withDefault("10px"),Gu=f("scrollbarHeight").withDefault("10px"),Wu=f("scrollbar-slider-background","--vscode-scrollbarSlider-background").withDefault("#79797966"),Qu=f("scrollbar-slider-hover-background","--vscode-scrollbarSlider-hoverBackground").withDefault("#646464b3"),Zu=f("scrollbar-slider-active-background","--vscode-scrollbarSlider-activeBackground").withDefault("#bfbfbf66"),wn=f("badge-background","--vscode-badge-background").withDefault("#4d4d4d"),Cn=f("badge-foreground","--vscode-badge-foreground").withDefault("#ffffff"),Ot=f("button-border","--vscode-button-border").withDefault("transparent"),Ro=f("button-icon-background").withDefault("transparent"),kn=f("button-icon-corner-radius").withDefault("5px"),$n=f("button-icon-outline-offset").withDefault(0),Po=f("button-icon-hover-background","--fake-vscode-token").withDefault("rgba(90, 93, 94, 0.31)"),Sn=f("button-icon-padding").withDefault("3px"),Se=f("button-primary-background","--vscode-button-background").withDefault("#0e639c"),Io=f("button-primary-foreground","--vscode-button-foreground").withDefault("#ffffff"),Fo=f("button-primary-hover-background","--vscode-button-hoverBackground").withDefault("#1177bb"),Rt=f("button-secondary-background","--vscode-button-secondaryBackground").withDefault("#3a3d41"),Tn=f("button-secondary-foreground","--vscode-button-secondaryForeground").withDefault("#ffffff"),Dn=f("button-secondary-hover-background","--vscode-button-secondaryHoverBackground").withDefault("#45494e"),En=f("button-padding-horizontal").withDefault("11px"),On=f("button-padding-vertical").withDefault("4px"),Pt=f("checkbox-background","--vscode-checkbox-background").withDefault("#3c3c3c"),Ao=f("checkbox-border","--vscode-checkbox-border").withDefault("#3c3c3c"),Rn=f("checkbox-corner-radius").withDefault(3),Xu=f("checkbox-foreground","--vscode-checkbox-foreground").withDefault("#f0f0f0"),Pn=f("list-active-selection-background","--vscode-list-activeSelectionBackground").withDefault("#094771"),Bo=f("list-active-selection-foreground","--vscode-list-activeSelectionForeground").withDefault("#ffffff"),In=f("list-hover-background","--vscode-list-hoverBackground").withDefault("#2a2d2e"),Fn=f("divider-background","--vscode-settings-dropdownListBorder").withDefault("#454545"),Ju=f("dropdown-background","--vscode-dropdown-background").withDefault("#3c3c3c"),It=f("dropdown-border","--vscode-dropdown-border").withDefault("#3c3c3c"),Yu=f("dropdown-foreground","--vscode-dropdown-foreground").withDefault("#f0f0f0"),Ku=f("dropdown-list-max-height").withDefault("200px"),Ft=f("input-background","--vscode-input-background").withDefault("#3c3c3c"),An=f("input-foreground","--vscode-input-foreground").withDefault("#cccccc"),eh=f("input-placeholder-foreground","--vscode-input-placeholderForeground").withDefault("#cccccc"),_o=f("link-active-foreground","--vscode-textLink-activeForeground").withDefault("#3794ff"),Bn=f("link-foreground","--vscode-textLink-foreground").withDefault("#3794ff"),th=f("progress-background","--vscode-progressBar-background").withDefault("#0e70c0"),oh=f("panel-tab-active-border","--vscode-panelTitle-activeBorder").withDefault("#e7e7e7"),rh=f("panel-tab-active-foreground","--vscode-panelTitle-activeForeground").withDefault("#e7e7e7"),nh=f("panel-tab-foreground","--vscode-panelTitle-inactiveForeground").withDefault("#e7e7e799"),ih=f("panel-view-background","--vscode-panel-background").withDefault("#1e1e1e"),sh=f("panel-view-border","--vscode-panel-border").withDefault("#80808059"),_n=f("tag-corner-radius").withDefault("2px");function Ln(o,e,t,r){var n=arguments.length,i=n<3?e:r===null?r=Object.getOwnPropertyDescriptor(e,t):r,s;if(typeof Reflect=="object"&&typeof Reflect.decorate=="function")i=Reflect.decorate(o,e,t,r);else for(var a=o.length-1;a>=0;a--)(s=o[a])&&(i=(n<3?s(i):n>3?s(e,t,i):s(e,t))||i);return n>3&&i&&Object.defineProperty(e,t,i),i}var Gi=D`
	${q("inline-flex")} :host {
		outline: none;
		font-family: ${G};
		font-size: ${Q};
		line-height: ${Z};
		color: ${Io};
		background: ${Se};
		border-radius: calc(${Et} * 1px);
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
		padding: ${On} ${En};
		white-space: wrap;
		outline: none;
		text-decoration: none;
		border: calc(${T} * 1px) solid ${Ot};
		color: inherit;
		border-radius: inherit;
		fill: inherit;
		cursor: inherit;
		font-family: inherit;
	}
	:host(:hover) {
		background: ${Fo};
	}
	:host(:active) {
		background: ${Se};
	}
	.control:${N} {
		outline: calc(${T} * 1px) solid ${M};
		outline-offset: calc(${T} * 2px);
	}
	.control::-moz-focus-inner {
		border: 0;
	}
	:host([disabled]) {
		opacity: ${Ne};
		background: ${Se};
		cursor: ${He};
	}
	.content {
		display: flex;
	}
	.start {
		display: flex;
	}
	::slotted(svg),
	::slotted(span) {
		width: calc(${S} * 4px);
		height: calc(${S} * 4px);
	}
	.start {
		margin-inline-end: 8px;
	}
`,Wi=D`
	:host([appearance='primary']) {
		background: ${Se};
		color: ${Io};
	}
	:host([appearance='primary']:hover) {
		background: ${Fo};
	}
	:host([appearance='primary']:active) .control:active {
		background: ${Se};
	}
	:host([appearance='primary']) .control:${N} {
		outline: calc(${T} * 1px) solid ${M};
		outline-offset: calc(${T} * 2px);
	}
	:host([appearance='primary'][disabled]) {
		background: ${Se};
	}
`,Qi=D`
	:host([appearance='secondary']) {
		background: ${Rt};
		color: ${Tn};
	}
	:host([appearance='secondary']:hover) {
		background: ${Dn};
	}
	:host([appearance='secondary']:active) .control:active {
		background: ${Rt};
	}
	:host([appearance='secondary']) .control:${N} {
		outline: calc(${T} * 1px) solid ${M};
		outline-offset: calc(${T} * 2px);
	}
	:host([appearance='secondary'][disabled]) {
		background: ${Rt};
	}
`,Zi=D`
	:host([appearance='icon']) {
		background: ${Ro};
		border-radius: ${kn};
		color: ${ee};
	}
	:host([appearance='icon']:hover) {
		background: ${Po};
		outline: 1px dotted ${Tt};
		outline-offset: -1px;
	}
	:host([appearance='icon']) .control {
		padding: ${Sn};
		border: none;
	}
	:host([appearance='icon']:active) .control:active {
		background: ${Po};
	}
	:host([appearance='icon']) .control:${N} {
		outline: calc(${T} * 1px) solid ${M};
		outline-offset: ${$n};
	}
	:host([appearance='icon'][disabled]) {
		background: ${Ro};
	}
`,Mn=(o,e)=>D`
	${Gi}
	${Wi}
	${Qi}
	${Zi}
`;var At=class extends H{connectedCallback(){if(super.connectedCallback(),!this.appearance){let e=this.getAttribute("appearance");this.appearance=e}}attributeChangedCallback(e,t,r){e==="appearance"&&r==="icon"&&(this.getAttribute("aria-label")||(this.ariaLabel="Icon Button")),e==="aria-label"&&(this.ariaLabel=r),e==="disabled"&&(this.disabled=r!==null)}};Ln([p],At.prototype,"appearance",void 0);var Lo=At.compose({baseName:"button",template:Xr,styles:Mn,shadowOptions:{delegatesFocus:!0}});var Vn=(o,e)=>D`
	${q("inline-flex")} :host {
		align-items: center;
		outline: none;
		margin: calc(${S} * 1px) 0;
		user-select: none;
		font-size: ${Q};
		line-height: ${Z};
	}
	.control {
		position: relative;
		width: calc(${S} * 4px + 2px);
		height: calc(${S} * 4px + 2px);
		box-sizing: border-box;
		border-radius: calc(${Rn} * 1px);
		border: calc(${T} * 1px) solid ${Ao};
		background: ${Pt};
		outline: none;
		cursor: pointer;
	}
	.label {
		font-family: ${G};
		color: ${ee};
		padding-inline-start: calc(${S} * 2px + 2px);
		margin-inline-end: calc(${S} * 2px + 2px);
		cursor: pointer;
	}
	.label__hidden {
		display: none;
		visibility: hidden;
	}
	.checked-indicator {
		width: 100%;
		height: 100%;
		display: block;
		fill: ${ee};
		opacity: 0;
		pointer-events: none;
	}
	.indeterminate-indicator {
		border-radius: 2px;
		background: ${ee};
		position: absolute;
		top: 50%;
		left: 50%;
		width: 50%;
		height: 50%;
		transform: translate(-50%, -50%);
		opacity: 0;
	}
	:host(:enabled) .control:hover {
		background: ${Pt};
		border-color: ${Ao};
	}
	:host(:enabled) .control:active {
		background: ${Pt};
		border-color: ${M};
	}
	:host(:${N}) .control {
		border: calc(${T} * 1px) solid ${M};
	}
	:host(.disabled) .label,
	:host(.readonly) .label,
	:host(.readonly) .control,
	:host(.disabled) .control {
		cursor: ${He};
	}
	:host(.checked:not(.indeterminate)) .checked-indicator,
	:host(.indeterminate) .indeterminate-indicator {
		opacity: 1;
	}
	:host(.disabled) {
		opacity: ${Ne};
	}
`;var Mo=class extends ke{connectedCallback(){super.connectedCallback(),this.textContent?this.setAttribute("aria-label",this.textContent):this.setAttribute("aria-label","Checkbox")}},Vo=Mo.compose({baseName:"checkbox",template:sn,styles:Vn,checkedIndicator:`
		<svg 
			part="checked-indicator"
			class="checked-indicator"
			width="16" 
			height="16" 
			viewBox="0 0 16 16" 
			xmlns="http://www.w3.org/2000/svg" 
			fill="currentColor"
		>
			<path 
				fill-rule="evenodd" 
				clip-rule="evenodd" 
				d="M14.431 3.323l-8.47 10-.79-.036-3.35-4.77.818-.574 2.978 4.24 8.051-9.506.764.646z"
			/>
		</svg>
	`,indeterminateIndicator:`
		<div part="indeterminate-indicator" class="indeterminate-indicator"></div>
	`});var Hn=(o,e)=>D`
	:host {
		display: flex;
		position: relative;
		flex-direction: column;
		width: 100%;
	}
`;var Nn=(o,e)=>D`
	:host {
		display: grid;
		padding: calc((${S} / 4) * 1px) 0;
		box-sizing: border-box;
		width: 100%;
		background: transparent;
	}
	:host(.header) {
	}
	:host(.sticky-header) {
		background: ${gn};
		position: sticky;
		top: 0;
	}
	:host(:hover) {
		background: ${In};
		outline: 1px dotted ${Tt};
		outline-offset: -1px;
	}
`;var jn=(o,e)=>D`
	:host {
		padding: calc(${S} * 1px) calc(${S} * 3px);
		color: ${ee};
		opacity: 1;
		box-sizing: border-box;
		font-family: ${G};
		font-size: ${Q};
		line-height: ${Z};
		font-weight: 400;
		border: solid calc(${T} * 1px) transparent;
		border-radius: calc(${Dt} * 1px);
		white-space: wrap;
		overflow-wrap: anywhere;
	}
	:host(.column-header) {
		font-weight: 600;
	}
	:host(:${N}),
	:host(:focus),
	:host(:active) {
		background: ${Pn};
		border: solid calc(${T} * 1px) ${M};
		color: ${Bo};
		outline: none;
	}
	:host(:${N}) ::slotted(*),
	:host(:focus) ::slotted(*),
	:host(:active) ::slotted(*) {
		color: ${Bo} !important;
	}
`;var Ho=class extends O{connectedCallback(){super.connectedCallback(),this.getAttribute("aria-label")||this.setAttribute("aria-label","Data Grid")}},Uo=Ho.compose({baseName:"data-grid",baseClass:O,template:on,styles:Hn}),No=class extends I{},zo=No.compose({baseName:"data-grid-row",baseClass:I,template:rn,styles:Nn}),jo=class extends z{},qo=jo.compose({baseName:"data-grid-cell",baseClass:z,template:nn,styles:jn});var Un=(o,e)=>D`
	${q("block")} :host {
		border: none;
		border-top: calc(${T} * 1px) solid ${Fn};
		box-sizing: content-box;
		height: 0;
		margin: calc(${S} * 1px) 0;
		width: 100%;
	}
`;var Go=class extends Ve{},Wo=Go.compose({baseName:"divider",template:ln,styles:Un});var zn=(o,e)=>D`
	${q("inline-flex")} :host {
		background: transparent;
		box-sizing: border-box;
		color: ${Bn};
		cursor: pointer;
		fill: currentcolor;
		font-family: ${G};
		font-size: ${Q};
		line-height: ${Z};
		outline: none;
	}
	.control {
		background: transparent;
		border: calc(${T} * 1px) solid transparent;
		border-radius: calc(${Dt} * 1px);
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
		color: ${_o};
	}
	:host(:hover) .content {
		text-decoration: underline;
	}
	:host(:active) {
		background: transparent;
		color: ${_o};
	}
	:host(:${N}) .control,
	:host(:focus) .control {
		border: calc(${T} * 1px) solid ${M};
	}
`;var Qo=class extends V{},Zo=Qo.compose({baseName:"link",template:Qr,styles:zn,shadowOptions:{delegatesFocus:!0}});var qn=(o,e)=>D`
	${q("inline-block")} :host {
		box-sizing: border-box;
		font-family: ${G};
		font-size: ${yn};
		line-height: ${xn};
	}
	.control {
		background-color: ${wn};
		border: calc(${T} * 1px) solid ${Ot};
		border-radius: ${_n};
		color: ${Cn};
		padding: calc(${S} * 0.5px) calc(${S} * 1px);
		text-transform: uppercase;
	}
`;var Xo=class extends Ce{connectedCallback(){super.connectedCallback(),this.circular&&(this.circular=!1)}},Jo=Xo.compose({baseName:"tag",template:Zr,styles:qn});var Gn=(o,e)=>D`
	${q("inline-block")} :host {
		font-family: ${G};
		outline: none;
		user-select: none;
	}
	.root {
		box-sizing: border-box;
		position: relative;
		display: flex;
		flex-direction: row;
		color: ${An};
		background: ${Ft};
		border-radius: calc(${Et} * 1px);
		border: calc(${T} * 1px) solid ${It};
		height: calc(${bn} * 1px);
		min-width: ${vn};
	}
	.control {
		-webkit-appearance: none;
		font: inherit;
		background: transparent;
		border: 0;
		color: inherit;
		height: calc(100% - (${S} * 1px));
		width: 100%;
		margin-top: auto;
		margin-bottom: auto;
		border: none;
		padding: 0 calc(${S} * 2px + 1px);
		font-size: ${Q};
		line-height: ${Z};
	}
	.control:hover,
	.control:${N},
	.control:disabled,
	.control:active {
		outline: none;
	}
	.label {
		display: block;
		color: ${ee};
		cursor: pointer;
		font-size: ${Q};
		line-height: ${Z};
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
		width: calc(${S} * 4px);
		height: calc(${S} * 4px);
	}
	.start {
		margin-inline-start: calc(${S} * 2px);
	}
	.end {
		margin-inline-end: calc(${S} * 2px);
	}
	:host(:hover:not([disabled])) .root {
		background: ${Ft};
		border-color: ${It};
	}
	:host(:active:not([disabled])) .root {
		background: ${Ft};
		border-color: ${M};
	}
	:host(:focus-within:not([disabled])) .root {
		border-color: ${M};
	}
	:host([disabled]) .label,
	:host([readonly]) .label,
	:host([readonly]) .control,
	:host([disabled]) .control {
		cursor: ${He};
	}
	:host([disabled]) {
		opacity: ${Ne};
	}
	:host([disabled]) .control {
		border-color: ${It};
	}
`;var Yo=class extends B{connectedCallback(){super.connectedCallback(),this.textContent?this.setAttribute("aria-label",this.textContent):this.setAttribute("aria-label","Text field")}},Ko=Yo.compose({baseName:"text-field",template:dn,styles:Gn,shadowOptions:{delegatesFocus:!0}});un().register(Lo(),Uo(),qo(),zo(),Wo(),Ko(),Jo(),Zo(),Vo());var Qn=acquireVsCodeApi(),ie=[],Te=[];function Zn(o){ie=o;let e=document.getElementById("basic-grid");if(e){for(;e.children.length>1;){let t=e.lastChild;t&&e.removeChild(t)}o.forEach(t=>{let r=document.createElement("vscode-data-grid-row"),n=document.createElement("vscode-data-grid-cell");n.setAttribute("grid-column","1");let i=document.createElement("vscode-checkbox");i.setAttribute("id",`check-${t.index}`),i.addEventListener("change",function(){let h=t.index;if(i.checked)Te.push(h);else{let m=Te.findIndex(k=>k===h);m!==-1&&Te.splice(m,1)}tr()}),n.appendChild(i),r.appendChild(n);let s=document.createElement("vscode-data-grid-cell");s.setAttribute("grid-column","2"),s.classList.add("numberCell"),s.textContent=t.index,r.appendChild(s);let a=document.createElement("vscode-data-grid-cell");a.setAttribute("grid-column","3"),a.textContent=t.total_delay.toFixed(3),r.appendChild(a);let l=document.createElement("vscode-data-grid-cell");l.setAttribute("grid-column","4"),l.textContent=t.incremental_delay.toFixed(3),r.appendChild(l);let c=document.createElement("vscode-data-grid-cell");if(c.setAttribute("grid-column","5"),t.path!==""){let h=document.createElement("vscode-link");h.textContent=t.cell_location,h.setAttribute("title",`${t.path}:${t.line}`),h.addEventListener("click",function(m){Qn.postMessage({command:"open",file:t.path,line:t.line})}),c.appendChild(h)}else c.textContent=t.cell_location;r.appendChild(c);let d=document.createElement("vscode-data-grid-cell");d.setAttribute("grid-column","6"),d.textContent=t.name,r.appendChild(d),e.appendChild(r)})}}window.addEventListener("message",o=>{let e=o.data;switch(e.command){case"update":Zn(e.pathDetails);break}});function tr(){Qn.postMessage({command:"updateDecorators",selectionList:Te})}var er=document.getElementById("select-all");er&&er.addEventListener("change",function(){er.checked?Xi():Ji()});function Xi(){for(let o of ie){let e=document.getElementById(`check-${o.index}`);e&&(e.checked=!0)}Te=[],ie.forEach(o=>{Te.push(o.index)}),tr()}function Ji(){for(let o of ie){let e=document.getElementById(`check-${o.index}`);e&&(e.checked=!1)}Te=[],tr()}var Yi=["h0","h1","h2","h3","h4"],Wn={};for(let o of Yi){let e=document.getElementById(o);e&&e.addEventListener("click",function(){Ki(parseInt(o[1]),e)})}function rt(o,e,t){o==="asc"?t?ie.sort((r,n)=>r[e].localeCompare(n[e])):ie.sort((r,n)=>r[e]-n[e]):t?ie.sort((r,n)=>n[e].localeCompare(r[e])):ie.sort((r,n)=>n[e]-r[e])}function Ki(o,e){let t=Wn[o]==="asc"?"desc":"asc";Wn[o]=t,es(),o===0?rt(t,"index",!1):o===1?rt(t,"levelsNumber",!1):o===2?rt(t,"slack",!1):o===3?rt(t,"fromNodeName",!0):o===4&&rt(t,"toNodeName",!0),Zn(ie),ts(e,t)}function es(){var o=document.querySelectorAll(".sorting");o.forEach(function(e){e.innerHTML="&#8597;"})}function ts(o,e){var t=o.querySelector(".sorting");t.innerHTML=e==="asc"?"&#8593;":"&#8595;"}
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
