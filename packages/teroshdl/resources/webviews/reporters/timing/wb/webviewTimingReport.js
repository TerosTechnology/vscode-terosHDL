var fe=function(){if(typeof globalThis<"u")return globalThis;if(typeof global<"u")return global;if(typeof self<"u")return self;if(typeof window<"u")return window;try{return new Function("return this")()}catch{return{}}}();fe.trustedTypes===void 0&&(fe.trustedTypes={createPolicy:(o,e)=>e});var Ii={configurable:!1,enumerable:!1,writable:!1};fe.FAST===void 0&&Reflect.defineProperty(fe,"FAST",Object.assign({value:Object.create(null)},Ii));var Fe=fe.FAST;if(Fe.getById===void 0){let o=Object.create(null);Reflect.defineProperty(Fe,"getById",Object.assign({value(e,t){let i=o[e];return i===void 0&&(i=t?o[e]=t():null),i}},Ii))}var Z=Object.freeze([]);function Dt(){let o=new WeakMap;return function(e){let t=o.get(e);if(t===void 0){let i=Reflect.getPrototypeOf(e);for(;t===void 0&&i!==null;)t=o.get(i),i=Reflect.getPrototypeOf(i);t=t===void 0?[]:t.slice(0),o.set(e,t)}return t}}var io=fe.FAST.getById(1,()=>{let o=[],e=[];function t(){if(e.length)throw e.shift()}function i(s){try{s.call()}catch(a){e.push(a),setTimeout(t,0)}}function r(){let a=0;for(;a<o.length;)if(i(o[a]),a++,a>1024){for(let l=0,c=o.length-a;l<c;l++)o[l]=o[l+a];o.length-=a,a=0}o.length=0}function n(s){o.length<1&&fe.requestAnimationFrame(r),o.push(s)}return Object.freeze({enqueue:n,process:r})}),Di=fe.trustedTypes.createPolicy("fast-html",{createHTML:o=>o}),ro=Di,dt=`fast-${Math.random().toString(36).substring(2,8)}`,no=`${dt}{`,At=`}${dt}`,b=Object.freeze({supportsAdoptedStyleSheets:Array.isArray(document.adoptedStyleSheets)&&"replace"in CSSStyleSheet.prototype,setHTMLPolicy(o){if(ro!==Di)throw new Error("The HTML policy can only be set once.");ro=o},createHTML(o){return ro.createHTML(o)},isMarker(o){return o&&o.nodeType===8&&o.data.startsWith(dt)},extractDirectiveIndexFromMarker(o){return parseInt(o.data.replace(`${dt}:`,""))},createInterpolationPlaceholder(o){return`${no}${o}${At}`},createCustomAttributePlaceholder(o,e){return`${o}="${this.createInterpolationPlaceholder(e)}"`},createBlockPlaceholder(o){return`<!--${dt}:${o}-->`},queueUpdate:io.enqueue,processUpdates:io.process,nextUpdate(){return new Promise(io.enqueue)},setAttribute(o,e,t){t==null?o.removeAttribute(e):o.setAttribute(e,t)},setBooleanAttribute(o,e,t){t?o.setAttribute(e,""):o.removeAttribute(e)},removeChildNodes(o){for(let e=o.firstChild;e!==null;e=o.firstChild)o.removeChild(e)},createTemplateWalker(o){return document.createTreeWalker(o,133,null,!1)}});var xe=class{constructor(e,t){this.sub1=void 0,this.sub2=void 0,this.spillover=void 0,this.source=e,this.sub1=t}has(e){return this.spillover===void 0?this.sub1===e||this.sub2===e:this.spillover.indexOf(e)!==-1}subscribe(e){let t=this.spillover;if(t===void 0){if(this.has(e))return;if(this.sub1===void 0){this.sub1=e;return}if(this.sub2===void 0){this.sub2=e;return}this.spillover=[this.sub1,this.sub2,e],this.sub1=void 0,this.sub2=void 0}else t.indexOf(e)===-1&&t.push(e)}unsubscribe(e){let t=this.spillover;if(t===void 0)this.sub1===e?this.sub1=void 0:this.sub2===e&&(this.sub2=void 0);else{let i=t.indexOf(e);i!==-1&&t.splice(i,1)}}notify(e){let t=this.spillover,i=this.source;if(t===void 0){let r=this.sub1,n=this.sub2;r!==void 0&&r.handleChange(i,e),n!==void 0&&n.handleChange(i,e)}else for(let r=0,n=t.length;r<n;++r)t[r].handleChange(i,e)}},Qe=class{constructor(e){this.subscribers={},this.sourceSubscribers=null,this.source=e}notify(e){var t;let i=this.subscribers[e];i!==void 0&&i.notify(e),(t=this.sourceSubscribers)===null||t===void 0||t.notify(e)}subscribe(e,t){var i;if(t){let r=this.subscribers[t];r===void 0&&(this.subscribers[t]=r=new xe(this.source)),r.subscribe(e)}else this.sourceSubscribers=(i=this.sourceSubscribers)!==null&&i!==void 0?i:new xe(this.source),this.sourceSubscribers.subscribe(e)}unsubscribe(e,t){var i;if(t){let r=this.subscribers[t];r!==void 0&&r.unsubscribe(e)}else(i=this.sourceSubscribers)===null||i===void 0||i.unsubscribe(e)}};var v=Fe.getById(2,()=>{let o=/(:|&&|\|\||if)/,e=new WeakMap,t=b.queueUpdate,i,r=c=>{throw new Error("Must call enableArrayObservation before observing arrays.")};function n(c){let u=c.$fastController||e.get(c);return u===void 0&&(Array.isArray(c)?u=r(c):e.set(c,u=new Qe(c))),u}let s=Dt();class a{constructor(u){this.name=u,this.field=`_${u}`,this.callback=`${u}Changed`}getValue(u){return i!==void 0&&i.watch(u,this.name),u[this.field]}setValue(u,h){let g=this.field,$=u[g];if($!==h){u[g]=h;let S=u[this.callback];typeof S=="function"&&S.call(u,$,h),n(u).notify(this.name)}}}class l extends xe{constructor(u,h,g=!1){super(u,h),this.binding=u,this.isVolatileBinding=g,this.needsRefresh=!0,this.needsQueue=!0,this.first=this,this.last=null,this.propertySource=void 0,this.propertyName=void 0,this.notifier=void 0,this.next=void 0}observe(u,h){this.needsRefresh&&this.last!==null&&this.disconnect();let g=i;i=this.needsRefresh?this:void 0,this.needsRefresh=this.isVolatileBinding;let $=this.binding(u,h);return i=g,$}disconnect(){if(this.last!==null){let u=this.first;for(;u!==void 0;)u.notifier.unsubscribe(this,u.propertyName),u=u.next;this.last=null,this.needsRefresh=this.needsQueue=!0}}watch(u,h){let g=this.last,$=n(u),S=g===null?this.first:{};if(S.propertySource=u,S.propertyName=h,S.notifier=$,$.subscribe(this,h),g!==null){if(!this.needsRefresh){let M;i=void 0,M=g.propertySource[g.propertyName],i=this,u===M&&(this.needsRefresh=!0)}g.next=S}this.last=S}handleChange(){this.needsQueue&&(this.needsQueue=!1,t(this))}call(){this.last!==null&&(this.needsQueue=!0,this.notify(this))}records(){let u=this.first;return{next:()=>{let h=u;return h===void 0?{value:void 0,done:!0}:(u=u.next,{value:h,done:!1})},[Symbol.iterator]:function(){return this}}}}return Object.freeze({setArrayObserverFactory(c){r=c},getNotifier:n,track(c,u){i!==void 0&&i.watch(c,u)},trackVolatile(){i!==void 0&&(i.needsRefresh=!0)},notify(c,u){n(c).notify(u)},defineProperty(c,u){typeof u=="string"&&(u=new a(u)),s(c).push(u),Reflect.defineProperty(c,u.name,{enumerable:!0,get:function(){return u.getValue(this)},set:function(h){u.setValue(this,h)}})},getAccessors:s,binding(c,u,h=this.isVolatileBinding(c)){return new l(c,u,h)},isVolatileBinding(c){return o.test(c.toString())}})});function f(o,e){v.defineProperty(o,e)}function Pi(o,e,t){return Object.assign({},t,{get:function(){return v.trackVolatile(),t.get.apply(this)}})}var Ai=Fe.getById(3,()=>{let o=null;return{get(){return o},set(e){o=e}}}),ye=class{constructor(){this.index=0,this.length=0,this.parent=null,this.parentContext=null}get event(){return Ai.get()}get isEven(){return this.index%2===0}get isOdd(){return this.index%2!==0}get isFirst(){return this.index===0}get isInMiddle(){return!this.isFirst&&!this.isLast}get isLast(){return this.index===this.length-1}static setEvent(e){Ai.set(e)}};v.defineProperty(ye.prototype,"index");v.defineProperty(ye.prototype,"length");var we=Object.seal(new ye);var Ce=class{constructor(){this.targetIndex=0}},Xe=class extends Ce{constructor(){super(...arguments),this.createPlaceholder=b.createInterpolationPlaceholder}},ke=class extends Ce{constructor(e,t,i){super(),this.name=e,this.behavior=t,this.options=i}createPlaceholder(e){return b.createCustomAttributePlaceholder(this.name,e)}createBehavior(e){return new this.behavior(e,this.options)}};function In(o,e){this.source=o,this.context=e,this.bindingObserver===null&&(this.bindingObserver=v.binding(this.binding,this,this.isBindingVolatile)),this.updateTarget(this.bindingObserver.observe(o,e))}function Dn(o,e){this.source=o,this.context=e,this.target.addEventListener(this.targetName,this)}function An(){this.bindingObserver.disconnect(),this.source=null,this.context=null}function Pn(){this.bindingObserver.disconnect(),this.source=null,this.context=null;let o=this.target.$fastView;o!==void 0&&o.isComposed&&(o.unbind(),o.needsBindOnly=!0)}function Fn(){this.target.removeEventListener(this.targetName,this),this.source=null,this.context=null}function Rn(o){b.setAttribute(this.target,this.targetName,o)}function _n(o){b.setBooleanAttribute(this.target,this.targetName,o)}function Bn(o){if(o==null&&(o=""),o.create){this.target.textContent="";let e=this.target.$fastView;e===void 0?e=o.create():this.target.$fastTemplate!==o&&(e.isComposed&&(e.remove(),e.unbind()),e=o.create()),e.isComposed?e.needsBindOnly&&(e.needsBindOnly=!1,e.bind(this.source,this.context)):(e.isComposed=!0,e.bind(this.source,this.context),e.insertBefore(this.target),this.target.$fastView=e,this.target.$fastTemplate=o)}else{let e=this.target.$fastView;e!==void 0&&e.isComposed&&(e.isComposed=!1,e.remove(),e.needsBindOnly?e.needsBindOnly=!1:e.unbind()),this.target.textContent=o}}function Ln(o){this.target[this.targetName]=o}function Mn(o){let e=this.classVersions||Object.create(null),t=this.target,i=this.version||0;if(o!=null&&o.length){let r=o.split(/\s+/);for(let n=0,s=r.length;n<s;++n){let a=r[n];a!==""&&(e[a]=i,t.classList.add(a))}}if(this.classVersions=e,this.version=i+1,i!==0){i-=1;for(let r in e)e[r]===i&&t.classList.remove(r)}}var Re=class extends Xe{constructor(e){super(),this.binding=e,this.bind=In,this.unbind=An,this.updateTarget=Rn,this.isBindingVolatile=v.isVolatileBinding(this.binding)}get targetName(){return this.originalTargetName}set targetName(e){if(this.originalTargetName=e,e!==void 0)switch(e[0]){case":":if(this.cleanedTargetName=e.substr(1),this.updateTarget=Ln,this.cleanedTargetName==="innerHTML"){let t=this.binding;this.binding=(i,r)=>b.createHTML(t(i,r))}break;case"?":this.cleanedTargetName=e.substr(1),this.updateTarget=_n;break;case"@":this.cleanedTargetName=e.substr(1),this.bind=Dn,this.unbind=Fn;break;default:this.cleanedTargetName=e,e==="class"&&(this.updateTarget=Mn);break}}targetAtContent(){this.updateTarget=Bn,this.unbind=Pn}createBehavior(e){return new so(e,this.binding,this.isBindingVolatile,this.bind,this.unbind,this.updateTarget,this.cleanedTargetName)}},so=class{constructor(e,t,i,r,n,s,a){this.source=null,this.context=null,this.bindingObserver=null,this.target=e,this.binding=t,this.isBindingVolatile=i,this.bind=r,this.unbind=n,this.updateTarget=s,this.targetName=a}handleChange(){this.updateTarget(this.bindingObserver.observe(this.source,this.context))}handleEvent(e){ye.setEvent(e);let t=this.binding(this.source,this.context);ye.setEvent(null),t!==!0&&e.preventDefault()}};var ao=null,ut=class{addFactory(e){e.targetIndex=this.targetIndex,this.behaviorFactories.push(e)}captureContentBinding(e){e.targetAtContent(),this.addFactory(e)}reset(){this.behaviorFactories=[],this.targetIndex=-1}release(){ao=this}static borrow(e){let t=ao||new ut;return t.directives=e,t.reset(),ao=null,t}};function Vn(o){if(o.length===1)return o[0];let e,t=o.length,i=o.map(s=>typeof s=="string"?()=>s:(e=s.targetName||e,s.binding)),r=(s,a)=>{let l="";for(let c=0;c<t;++c)l+=i[c](s,a);return l},n=new Re(r);return n.targetName=e,n}var Hn=At.length;function Ri(o,e){let t=e.split(no);if(t.length===1)return null;let i=[];for(let r=0,n=t.length;r<n;++r){let s=t[r],a=s.indexOf(At),l;if(a===-1)l=s;else{let c=parseInt(s.substring(0,a));i.push(o.directives[c]),l=s.substring(a+Hn)}l!==""&&i.push(l)}return i}function Fi(o,e,t=!1){let i=e.attributes;for(let r=0,n=i.length;r<n;++r){let s=i[r],a=s.value,l=Ri(o,a),c=null;l===null?t&&(c=new Re(()=>a),c.targetName=s.name):c=Vn(l),c!==null&&(e.removeAttributeNode(s),r--,n--,o.addFactory(c))}}function Nn(o,e,t){let i=Ri(o,e.textContent);if(i!==null){let r=e;for(let n=0,s=i.length;n<s;++n){let a=i[n],l=n===0?e:r.parentNode.insertBefore(document.createTextNode(""),r.nextSibling);typeof a=="string"?l.textContent=a:(l.textContent=" ",o.captureContentBinding(a)),r=l,o.targetIndex++,l!==e&&t.nextNode()}o.targetIndex--}}function _i(o,e){let t=o.content;document.adoptNode(t);let i=ut.borrow(e);Fi(i,o,!0);let r=i.behaviorFactories;i.reset();let n=b.createTemplateWalker(t),s;for(;s=n.nextNode();)switch(i.targetIndex++,s.nodeType){case 1:Fi(i,s);break;case 3:Nn(i,s,n);break;case 8:b.isMarker(s)&&i.addFactory(e[b.extractDirectiveIndexFromMarker(s)])}let a=0;(b.isMarker(t.firstChild)||t.childNodes.length===1&&e.length)&&(t.insertBefore(document.createComment(""),t.firstChild),a=-1);let l=i.behaviorFactories;return i.release(),{fragment:t,viewBehaviorFactories:l,hostBehaviorFactories:r,targetOffset:a}}var lo=document.createRange(),Ze=class{constructor(e,t){this.fragment=e,this.behaviors=t,this.source=null,this.context=null,this.firstChild=e.firstChild,this.lastChild=e.lastChild}appendTo(e){e.appendChild(this.fragment)}insertBefore(e){if(this.fragment.hasChildNodes())e.parentNode.insertBefore(this.fragment,e);else{let t=this.lastChild;if(e.previousSibling===t)return;let i=e.parentNode,r=this.firstChild,n;for(;r!==t;)n=r.nextSibling,i.insertBefore(r,e),r=n;i.insertBefore(t,e)}}remove(){let e=this.fragment,t=this.lastChild,i=this.firstChild,r;for(;i!==t;)r=i.nextSibling,e.appendChild(i),i=r;e.appendChild(t)}dispose(){let e=this.firstChild.parentNode,t=this.lastChild,i=this.firstChild,r;for(;i!==t;)r=i.nextSibling,e.removeChild(i),i=r;e.removeChild(t);let n=this.behaviors,s=this.source;for(let a=0,l=n.length;a<l;++a)n[a].unbind(s)}bind(e,t){let i=this.behaviors;if(this.source!==e)if(this.source!==null){let r=this.source;this.source=e,this.context=t;for(let n=0,s=i.length;n<s;++n){let a=i[n];a.unbind(r),a.bind(e,t)}}else{this.source=e,this.context=t;for(let r=0,n=i.length;r<n;++r)i[r].bind(e,t)}}unbind(){if(this.source===null)return;let e=this.behaviors,t=this.source;for(let i=0,r=e.length;i<r;++i)e[i].unbind(t);this.source=null}static disposeContiguousBatch(e){if(e.length!==0){lo.setStartBefore(e[0].firstChild),lo.setEndAfter(e[e.length-1].lastChild),lo.deleteContents();for(let t=0,i=e.length;t<i;++t){let r=e[t],n=r.behaviors,s=r.source;for(let a=0,l=n.length;a<l;++a)n[a].unbind(s)}}}};var Pt=class{constructor(e,t){this.behaviorCount=0,this.hasHostBehaviors=!1,this.fragment=null,this.targetOffset=0,this.viewBehaviorFactories=null,this.hostBehaviorFactories=null,this.html=e,this.directives=t}create(e){if(this.fragment===null){let c,u=this.html;if(typeof u=="string"){c=document.createElement("template"),c.innerHTML=b.createHTML(u);let g=c.content.firstElementChild;g!==null&&g.tagName==="TEMPLATE"&&(c=g)}else c=u;let h=_i(c,this.directives);this.fragment=h.fragment,this.viewBehaviorFactories=h.viewBehaviorFactories,this.hostBehaviorFactories=h.hostBehaviorFactories,this.targetOffset=h.targetOffset,this.behaviorCount=this.viewBehaviorFactories.length+this.hostBehaviorFactories.length,this.hasHostBehaviors=this.hostBehaviorFactories.length>0}let t=this.fragment.cloneNode(!0),i=this.viewBehaviorFactories,r=new Array(this.behaviorCount),n=b.createTemplateWalker(t),s=0,a=this.targetOffset,l=n.nextNode();for(let c=i.length;s<c;++s){let u=i[s],h=u.targetIndex;for(;l!==null;)if(a===h){r[s]=u.createBehavior(l);break}else l=n.nextNode(),a++}if(this.hasHostBehaviors){let c=this.hostBehaviorFactories;for(let u=0,h=c.length;u<h;++u,++s)r[s]=c[u].createBehavior(e)}return new Ze(t,r)}render(e,t,i){typeof t=="string"&&(t=document.getElementById(t)),i===void 0&&(i=t);let r=this.create(i);return r.bind(e,we),r.appendTo(t),r}},jn=/([ \x09\x0a\x0c\x0d])([^\0-\x1F\x7F-\x9F "'>=/]+)([ \x09\x0a\x0c\x0d]*=[ \x09\x0a\x0c\x0d]*(?:[^ \x09\x0a\x0c\x0d"'`<>=]*|"[^"]*|'[^']*))$/;function x(o,...e){let t=[],i="";for(let r=0,n=o.length-1;r<n;++r){let s=o[r],a=e[r];if(i+=s,a instanceof Pt){let l=a;a=()=>l}if(typeof a=="function"&&(a=new Re(a)),a instanceof Xe){let l=jn.exec(s);l!==null&&(a.targetName=l[2])}a instanceof Ce?(i+=a.createPlaceholder(t.length),t.push(a)):i+=a}return i+=o[o.length-1],new Pt(i,t)}var A=class{constructor(){this.targets=new WeakSet}addStylesTo(e){this.targets.add(e)}removeStylesFrom(e){this.targets.delete(e)}isAttachedTo(e){return this.targets.has(e)}withBehaviors(...e){return this.behaviors=this.behaviors===null?e:this.behaviors.concat(e),this}};A.create=(()=>{if(b.supportsAdoptedStyleSheets){let o=new Map;return e=>new co(e,o)}return o=>new uo(o)})();function ho(o){return o.map(e=>e instanceof A?ho(e.styles):[e]).reduce((e,t)=>e.concat(t),[])}function Bi(o){return o.map(e=>e instanceof A?e.behaviors:null).reduce((e,t)=>t===null?e:(e===null&&(e=[]),e.concat(t)),null)}var Li=(o,e)=>{o.adoptedStyleSheets=[...o.adoptedStyleSheets,...e]},Mi=(o,e)=>{o.adoptedStyleSheets=o.adoptedStyleSheets.filter(t=>e.indexOf(t)===-1)};if(b.supportsAdoptedStyleSheets)try{document.adoptedStyleSheets.push(),document.adoptedStyleSheets.splice(),Li=(o,e)=>{o.adoptedStyleSheets.push(...e)},Mi=(o,e)=>{for(let t of e){let i=o.adoptedStyleSheets.indexOf(t);i!==-1&&o.adoptedStyleSheets.splice(i,1)}}}catch{}var co=class extends A{constructor(e,t){super(),this.styles=e,this.styleSheetCache=t,this._styleSheets=void 0,this.behaviors=Bi(e)}get styleSheets(){if(this._styleSheets===void 0){let e=this.styles,t=this.styleSheetCache;this._styleSheets=ho(e).map(i=>{if(i instanceof CSSStyleSheet)return i;let r=t.get(i);return r===void 0&&(r=new CSSStyleSheet,r.replaceSync(i),t.set(i,r)),r})}return this._styleSheets}addStylesTo(e){Li(e,this.styleSheets),super.addStylesTo(e)}removeStylesFrom(e){Mi(e,this.styleSheets),super.removeStylesFrom(e)}},zn=0;function Un(){return`fast-style-class-${++zn}`}var uo=class extends A{constructor(e){super(),this.styles=e,this.behaviors=null,this.behaviors=Bi(e),this.styleSheets=ho(e),this.styleClass=Un()}addStylesTo(e){let t=this.styleSheets,i=this.styleClass;e=this.normalizeTarget(e);for(let r=0;r<t.length;r++){let n=document.createElement("style");n.innerHTML=t[r],n.className=i,e.append(n)}super.addStylesTo(e)}removeStylesFrom(e){e=this.normalizeTarget(e);let t=e.querySelectorAll(`.${this.styleClass}`);for(let i=0,r=t.length;i<r;++i)e.removeChild(t[i]);super.removeStylesFrom(e)}isAttachedTo(e){return super.isAttachedTo(this.normalizeTarget(e))}normalizeTarget(e){return e===document?document.body:e}};var ht=Object.freeze({locate:Dt()}),po={toView(o){return o?"true":"false"},fromView(o){return!(o==null||o==="false"||o===!1||o===0)}},Ye={toView(o){if(o==null)return null;let e=o*1;return isNaN(e)?null:e.toString()},fromView(o){if(o==null)return null;let e=o*1;return isNaN(e)?null:e}},_e=class{constructor(e,t,i=t.toLowerCase(),r="reflect",n){this.guards=new Set,this.Owner=e,this.name=t,this.attribute=i,this.mode=r,this.converter=n,this.fieldName=`_${t}`,this.callbackName=`${t}Changed`,this.hasCallback=this.callbackName in e.prototype,r==="boolean"&&n===void 0&&(this.converter=po)}setValue(e,t){let i=e[this.fieldName],r=this.converter;r!==void 0&&(t=r.fromView(t)),i!==t&&(e[this.fieldName]=t,this.tryReflectToAttribute(e),this.hasCallback&&e[this.callbackName](i,t),e.$fastController.notify(this.name))}getValue(e){return v.track(e,this.name),e[this.fieldName]}onAttributeChangedCallback(e,t){this.guards.has(e)||(this.guards.add(e),this.setValue(e,t),this.guards.delete(e))}tryReflectToAttribute(e){let t=this.mode,i=this.guards;i.has(e)||t==="fromView"||b.queueUpdate(()=>{i.add(e);let r=e[this.fieldName];switch(t){case"reflect":let n=this.converter;b.setAttribute(e,this.attribute,n!==void 0?n.toView(r):r);break;case"boolean":b.setBooleanAttribute(e,this.attribute,r);break}i.delete(e)})}static collect(e,...t){let i=[];t.push(ht.locate(e));for(let r=0,n=t.length;r<n;++r){let s=t[r];if(s!==void 0)for(let a=0,l=s.length;a<l;++a){let c=s[a];typeof c=="string"?i.push(new _e(e,c)):i.push(new _e(e,c.property,c.attribute,c.mode,c.converter))}}return i}};function p(o,e){let t;function i(r,n){arguments.length>1&&(t.property=n),ht.locate(r.constructor).push(t)}if(arguments.length>1){t={},i(o,e);return}return t=o===void 0?{}:o,i}var Vi={mode:"open"},Hi={},fo=Fe.getById(4,()=>{let o=new Map;return Object.freeze({register(e){return o.has(e.type)?!1:(o.set(e.type,e),!0)},getByType(e){return o.get(e)}})}),re=class{constructor(e,t=e.definition){typeof t=="string"&&(t={name:t}),this.type=e,this.name=t.name,this.template=t.template;let i=_e.collect(e,t.attributes),r=new Array(i.length),n={},s={};for(let a=0,l=i.length;a<l;++a){let c=i[a];r[a]=c.attribute,n[c.name]=c,s[c.attribute]=c}this.attributes=i,this.observedAttributes=r,this.propertyLookup=n,this.attributeLookup=s,this.shadowOptions=t.shadowOptions===void 0?Vi:t.shadowOptions===null?void 0:Object.assign(Object.assign({},Vi),t.shadowOptions),this.elementOptions=t.elementOptions===void 0?Hi:Object.assign(Object.assign({},Hi),t.elementOptions),this.styles=t.styles===void 0?void 0:Array.isArray(t.styles)?A.create(t.styles):t.styles instanceof A?t.styles:A.create([t.styles])}get isDefined(){return!!fo.getByType(this.type)}define(e=customElements){let t=this.type;if(fo.register(this)){let i=this.attributes,r=t.prototype;for(let n=0,s=i.length;n<s;++n)v.defineProperty(r,i[n]);Reflect.defineProperty(t,"observedAttributes",{value:this.observedAttributes,enumerable:!0})}return e.get(this.name)||e.define(this.name,t,this.elementOptions),this}};re.forType=fo.getByType;var Ni=new WeakMap,qn={bubbles:!0,composed:!0,cancelable:!0};function mo(o){return o.shadowRoot||Ni.get(o)||null}var Je=class extends Qe{constructor(e,t){super(e),this.boundObservables=null,this.behaviors=null,this.needsInitialization=!0,this._template=null,this._styles=null,this._isConnected=!1,this.$fastController=this,this.view=null,this.element=e,this.definition=t;let i=t.shadowOptions;if(i!==void 0){let n=e.attachShadow(i);i.mode==="closed"&&Ni.set(e,n)}let r=v.getAccessors(e);if(r.length>0){let n=this.boundObservables=Object.create(null);for(let s=0,a=r.length;s<a;++s){let l=r[s].name,c=e[l];c!==void 0&&(delete e[l],n[l]=c)}}}get isConnected(){return v.track(this,"isConnected"),this._isConnected}setIsConnected(e){this._isConnected=e,v.notify(this,"isConnected")}get template(){return this._template}set template(e){this._template!==e&&(this._template=e,this.needsInitialization||this.renderTemplate(e))}get styles(){return this._styles}set styles(e){this._styles!==e&&(this._styles!==null&&this.removeStyles(this._styles),this._styles=e,!this.needsInitialization&&e!==null&&this.addStyles(e))}addStyles(e){let t=mo(this.element)||this.element.getRootNode();if(e instanceof HTMLStyleElement)t.append(e);else if(!e.isAttachedTo(t)){let i=e.behaviors;e.addStylesTo(t),i!==null&&this.addBehaviors(i)}}removeStyles(e){let t=mo(this.element)||this.element.getRootNode();if(e instanceof HTMLStyleElement)t.removeChild(e);else if(e.isAttachedTo(t)){let i=e.behaviors;e.removeStylesFrom(t),i!==null&&this.removeBehaviors(i)}}addBehaviors(e){let t=this.behaviors||(this.behaviors=new Map),i=e.length,r=[];for(let n=0;n<i;++n){let s=e[n];t.has(s)?t.set(s,t.get(s)+1):(t.set(s,1),r.push(s))}if(this._isConnected){let n=this.element;for(let s=0;s<r.length;++s)r[s].bind(n,we)}}removeBehaviors(e,t=!1){let i=this.behaviors;if(i===null)return;let r=e.length,n=[];for(let s=0;s<r;++s){let a=e[s];if(i.has(a)){let l=i.get(a)-1;l===0||t?i.delete(a)&&n.push(a):i.set(a,l)}}if(this._isConnected){let s=this.element;for(let a=0;a<n.length;++a)n[a].unbind(s)}}onConnectedCallback(){if(this._isConnected)return;let e=this.element;this.needsInitialization?this.finishInitialization():this.view!==null&&this.view.bind(e,we);let t=this.behaviors;if(t!==null)for(let[i]of t)i.bind(e,we);this.setIsConnected(!0)}onDisconnectedCallback(){if(!this._isConnected)return;this.setIsConnected(!1);let e=this.view;e!==null&&e.unbind();let t=this.behaviors;if(t!==null){let i=this.element;for(let[r]of t)r.unbind(i)}}onAttributeChangedCallback(e,t,i){let r=this.definition.attributeLookup[e];r!==void 0&&r.onAttributeChangedCallback(this.element,i)}emit(e,t,i){return this._isConnected?this.element.dispatchEvent(new CustomEvent(e,Object.assign(Object.assign({detail:t},qn),i))):!1}finishInitialization(){let e=this.element,t=this.boundObservables;if(t!==null){let r=Object.keys(t);for(let n=0,s=r.length;n<s;++n){let a=r[n];e[a]=t[a]}this.boundObservables=null}let i=this.definition;this._template===null&&(this.element.resolveTemplate?this._template=this.element.resolveTemplate():i.template&&(this._template=i.template||null)),this._template!==null&&this.renderTemplate(this._template),this._styles===null&&(this.element.resolveStyles?this._styles=this.element.resolveStyles():i.styles&&(this._styles=i.styles||null)),this._styles!==null&&this.addStyles(this._styles),this.needsInitialization=!1}renderTemplate(e){let t=this.element,i=mo(t)||t;this.view!==null?(this.view.dispose(),this.view=null):this.needsInitialization||b.removeChildNodes(i),e&&(this.view=e.render(t,i,t))}static forCustomElement(e){let t=e.$fastController;if(t!==void 0)return t;let i=re.forType(e.constructor);if(i===void 0)throw new Error("Missing FASTElement definition.");return e.$fastController=new Je(e,i)}};function ji(o){return class extends o{constructor(){super(),Je.forCustomElement(this)}$emit(e,t,i){return this.$fastController.emit(e,t,i)}connectedCallback(){this.$fastController.onConnectedCallback()}disconnectedCallback(){this.$fastController.onDisconnectedCallback()}attributeChangedCallback(e,t,i){this.$fastController.onAttributeChangedCallback(e,t,i)}}}var $e=Object.assign(ji(HTMLElement),{from(o){return ji(o)},define(o,e){return new re(o,e).define().type}});var Be=class{createCSS(){return""}createBehavior(){}};function Gn(o,e){let t=[],i="",r=[];for(let n=0,s=o.length-1;n<s;++n){i+=o[n];let a=e[n];if(a instanceof Be){let l=a.createBehavior();a=a.createCSS(),l&&r.push(l)}a instanceof A||a instanceof CSSStyleSheet?(i.trim()!==""&&(t.push(i),i=""),t.push(a)):i+=a}return i+=o[o.length-1],i.trim()!==""&&t.push(i),{styles:t,behaviors:r}}function O(o,...e){let{styles:t,behaviors:i}=Gn(o,e),r=A.create(t);return i.length&&r.withBehaviors(...i),r}function Y(o,e,t){return{index:o,removed:e,addedCount:t}}var Ui=0,qi=1,go=2,bo=3;function Wn(o,e,t,i,r,n){let s=n-r+1,a=t-e+1,l=new Array(s),c,u;for(let h=0;h<s;++h)l[h]=new Array(a),l[h][0]=h;for(let h=0;h<a;++h)l[0][h]=h;for(let h=1;h<s;++h)for(let g=1;g<a;++g)o[e+g-1]===i[r+h-1]?l[h][g]=l[h-1][g-1]:(c=l[h-1][g]+1,u=l[h][g-1]+1,l[h][g]=c<u?c:u);return l}function Qn(o){let e=o.length-1,t=o[0].length-1,i=o[e][t],r=[];for(;e>0||t>0;){if(e===0){r.push(go),t--;continue}if(t===0){r.push(bo),e--;continue}let n=o[e-1][t-1],s=o[e-1][t],a=o[e][t-1],l;s<a?l=s<n?s:n:l=a<n?a:n,l===n?(n===i?r.push(Ui):(r.push(qi),i=n),e--,t--):l===s?(r.push(bo),e--,i=s):(r.push(go),t--,i=a)}return r.reverse(),r}function Xn(o,e,t){for(let i=0;i<t;++i)if(o[i]!==e[i])return i;return t}function Zn(o,e,t){let i=o.length,r=e.length,n=0;for(;n<t&&o[--i]===e[--r];)n++;return n}function Yn(o,e,t,i){return e<t||i<o?-1:e===t||i===o?0:o<t?e<i?e-t:i-t:i<e?i-o:e-o}function vo(o,e,t,i,r,n){let s=0,a=0,l=Math.min(t-e,n-r);if(e===0&&r===0&&(s=Xn(o,i,l)),t===o.length&&n===i.length&&(a=Zn(o,i,l-s)),e+=s,r+=s,t-=a,n-=a,t-e===0&&n-r===0)return Z;if(e===t){let S=Y(e,[],0);for(;r<n;)S.removed.push(i[r++]);return[S]}else if(r===n)return[Y(e,[],t-e)];let c=Qn(Wn(o,e,t,i,r,n)),u=[],h,g=e,$=r;for(let S=0;S<c.length;++S)switch(c[S]){case Ui:h!==void 0&&(u.push(h),h=void 0),g++,$++;break;case qi:h===void 0&&(h=Y(g,[],0)),h.addedCount++,g++,h.removed.push(i[$]),$++;break;case go:h===void 0&&(h=Y(g,[],0)),h.addedCount++,g++;break;case bo:h===void 0&&(h=Y(g,[],0)),h.removed.push(i[$]),$++;break}return h!==void 0&&u.push(h),u}var zi=Array.prototype.push;function Jn(o,e,t,i){let r=Y(e,t,i),n=!1,s=0;for(let a=0;a<o.length;a++){let l=o[a];if(l.index+=s,n)continue;let c=Yn(r.index,r.index+r.removed.length,l.index,l.index+l.addedCount);if(c>=0){o.splice(a,1),a--,s-=l.addedCount-l.removed.length,r.addedCount+=l.addedCount-c;let u=r.removed.length+l.removed.length-c;if(!r.addedCount&&!u)n=!0;else{let h=l.removed;if(r.index<l.index){let g=r.removed.slice(0,l.index-r.index);zi.apply(g,h),h=g}if(r.index+r.removed.length>l.index+l.addedCount){let g=r.removed.slice(l.index+l.addedCount-r.index);zi.apply(h,g)}r.removed=h,l.index<r.index&&(r.index=l.index)}}else if(r.index<l.index){n=!0,o.splice(a,0,r),a++;let u=r.addedCount-r.removed.length;l.index+=u,s+=u}}n||o.push(r)}function Kn(o){let e=[];for(let t=0,i=o.length;t<i;t++){let r=o[t];Jn(e,r.index,r.removed,r.addedCount)}return e}function Gi(o,e){let t=[],i=Kn(e);for(let r=0,n=i.length;r<n;++r){let s=i[r];if(s.addedCount===1&&s.removed.length===1){s.removed[0]!==o[s.index]&&t.push(s);continue}t=t.concat(vo(o,s.index,s.index+s.addedCount,s.removed,0,s.removed.length))}return t}var Wi=!1;function xo(o,e){let t=o.index,i=e.length;return t>i?t=i-o.addedCount:t<0&&(t=i+o.removed.length+t-o.addedCount),t<0&&(t=0),o.index=t,o}var yo=class extends xe{constructor(e){super(e),this.oldCollection=void 0,this.splices=void 0,this.needsQueue=!0,this.call=this.flush,Reflect.defineProperty(e,"$fastController",{value:this,enumerable:!1})}subscribe(e){this.flush(),super.subscribe(e)}addSplice(e){this.splices===void 0?this.splices=[e]:this.splices.push(e),this.needsQueue&&(this.needsQueue=!1,b.queueUpdate(this))}reset(e){this.oldCollection=e,this.needsQueue&&(this.needsQueue=!1,b.queueUpdate(this))}flush(){let e=this.splices,t=this.oldCollection;if(e===void 0&&t===void 0)return;this.needsQueue=!0,this.splices=void 0,this.oldCollection=void 0;let i=t===void 0?Gi(this.source,e):vo(this.source,0,this.source.length,t,0,t.length);this.notify(i)}};function Qi(){if(Wi)return;Wi=!0,v.setArrayObserverFactory(l=>new yo(l));let o=Array.prototype;if(o.$fastPatch)return;Reflect.defineProperty(o,"$fastPatch",{value:1,enumerable:!1});let e=o.pop,t=o.push,i=o.reverse,r=o.shift,n=o.sort,s=o.splice,a=o.unshift;o.pop=function(){let l=this.length>0,c=e.apply(this,arguments),u=this.$fastController;return u!==void 0&&l&&u.addSplice(Y(this.length,[c],0)),c},o.push=function(){let l=t.apply(this,arguments),c=this.$fastController;return c!==void 0&&c.addSplice(xo(Y(this.length-arguments.length,[],arguments.length),this)),l},o.reverse=function(){let l,c=this.$fastController;c!==void 0&&(c.flush(),l=this.slice());let u=i.apply(this,arguments);return c!==void 0&&c.reset(l),u},o.shift=function(){let l=this.length>0,c=r.apply(this,arguments),u=this.$fastController;return u!==void 0&&l&&u.addSplice(Y(0,[c],0)),c},o.sort=function(){let l,c=this.$fastController;c!==void 0&&(c.flush(),l=this.slice());let u=n.apply(this,arguments);return c!==void 0&&c.reset(l),u},o.splice=function(){let l=s.apply(this,arguments),c=this.$fastController;return c!==void 0&&c.addSplice(xo(Y(+arguments[0],l,arguments.length>2?arguments.length-2:0),this)),l},o.unshift=function(){let l=a.apply(this,arguments),c=this.$fastController;return c!==void 0&&c.addSplice(xo(Y(0,[],arguments.length),this)),l}}var wo=class{constructor(e,t){this.target=e,this.propertyName=t}bind(e){e[this.propertyName]=this.target}unbind(){}};function B(o){return new ke("fast-ref",wo,o)}var Co=o=>typeof o=="function";var es=()=>null;function Xi(o){return o===void 0?es:Co(o)?o:()=>o}function Zi(o,e,t){let i=Co(o)?o:()=>o,r=Xi(e),n=Xi(t);return(s,a)=>i(s,a)?r(s,a):n(s,a)}var Wa=Object.freeze({positioning:!1,recycle:!0});function ts(o,e,t,i){o.bind(e[t],i)}function os(o,e,t,i){let r=Object.create(i);r.index=t,r.length=e.length,o.bind(e[t],r)}var ko=class{constructor(e,t,i,r,n,s){this.location=e,this.itemsBinding=t,this.templateBinding=r,this.options=s,this.source=null,this.views=[],this.items=null,this.itemsObserver=null,this.originalContext=void 0,this.childContext=void 0,this.bindView=ts,this.itemsBindingObserver=v.binding(t,this,i),this.templateBindingObserver=v.binding(r,this,n),s.positioning&&(this.bindView=os)}bind(e,t){this.source=e,this.originalContext=t,this.childContext=Object.create(t),this.childContext.parent=e,this.childContext.parentContext=this.originalContext,this.items=this.itemsBindingObserver.observe(e,this.originalContext),this.template=this.templateBindingObserver.observe(e,this.originalContext),this.observeItems(!0),this.refreshAllViews()}unbind(){this.source=null,this.items=null,this.itemsObserver!==null&&this.itemsObserver.unsubscribe(this),this.unbindAllViews(),this.itemsBindingObserver.disconnect(),this.templateBindingObserver.disconnect()}handleChange(e,t){e===this.itemsBinding?(this.items=this.itemsBindingObserver.observe(this.source,this.originalContext),this.observeItems(),this.refreshAllViews()):e===this.templateBinding?(this.template=this.templateBindingObserver.observe(this.source,this.originalContext),this.refreshAllViews(!0)):this.updateViews(t)}observeItems(e=!1){if(!this.items){this.items=Z;return}let t=this.itemsObserver,i=this.itemsObserver=v.getNotifier(this.items),r=t!==i;r&&t!==null&&t.unsubscribe(this),(r||e)&&i.subscribe(this)}updateViews(e){let t=this.childContext,i=this.views,r=this.bindView,n=this.items,s=this.template,a=this.options.recycle,l=[],c=0,u=0;for(let h=0,g=e.length;h<g;++h){let $=e[h],S=$.removed,M=0,te=$.index,ct=te+$.addedCount,ve=i.splice($.index,S.length),On=u=l.length+ve.length;for(;te<ct;++te){let Ei=i[te],En=Ei?Ei.firstChild:this.location,We;a&&u>0?(M<=On&&ve.length>0?(We=ve[M],M++):(We=l[c],c++),u--):We=s.create(),i.splice(te,0,We),r(We,n,te,t),We.insertBefore(En)}ve[M]&&l.push(...ve.slice(M))}for(let h=c,g=l.length;h<g;++h)l[h].dispose();if(this.options.positioning)for(let h=0,g=i.length;h<g;++h){let $=i[h].context;$.length=g,$.index=h}}refreshAllViews(e=!1){let t=this.items,i=this.childContext,r=this.template,n=this.location,s=this.bindView,a=t.length,l=this.views,c=l.length;if((a===0||e||!this.options.recycle)&&(Ze.disposeContiguousBatch(l),c=0),c===0){this.views=l=new Array(a);for(let u=0;u<a;++u){let h=r.create();s(h,t,u,i),l[u]=h,h.insertBefore(n)}}else{let u=0;for(;u<a;++u)if(u<c){let g=l[u];s(g,t,u,i)}else{let g=r.create();s(g,t,u,i),l.push(g),g.insertBefore(n)}let h=l.splice(u,c-u);for(u=0,a=h.length;u<a;++u)h[u].dispose()}}unbindAllViews(){let e=this.views;for(let t=0,i=e.length;t<i;++t)e[t].unbind()}},Ke=class extends Ce{constructor(e,t,i){super(),this.itemsBinding=e,this.templateBinding=t,this.options=i,this.createPlaceholder=b.createBlockPlaceholder,Qi(),this.isItemsBindingVolatile=v.isVolatileBinding(e),this.isTemplateBindingVolatile=v.isVolatileBinding(t)}createBehavior(e){return new ko(e,this.itemsBinding,this.isItemsBindingVolatile,this.templateBinding,this.isTemplateBindingVolatile,this.options)}};function pt(o){return o?function(e,t,i){return e.nodeType===1&&e.matches(o)}:function(e,t,i){return e.nodeType===1}}var et=class{constructor(e,t){this.target=e,this.options=t,this.source=null}bind(e){let t=this.options.property;this.shouldUpdate=v.getAccessors(e).some(i=>i.name===t),this.source=e,this.updateTarget(this.computeNodes()),this.shouldUpdate&&this.observe()}unbind(){this.updateTarget(Z),this.source=null,this.shouldUpdate&&this.disconnect()}handleEvent(){this.updateTarget(this.computeNodes())}computeNodes(){let e=this.getNodes();return this.options.filter!==void 0&&(e=e.filter(this.options.filter)),e}updateTarget(e){this.source[this.options.property]=e}};var $o=class extends et{constructor(e,t){super(e,t)}observe(){this.target.addEventListener("slotchange",this)}disconnect(){this.target.removeEventListener("slotchange",this)}getNodes(){return this.target.assignedNodes(this.options)}};function G(o){return typeof o=="string"&&(o={property:o}),new ke("fast-slotted",$o,o)}var So=class extends et{constructor(e,t){super(e,t),this.observer=null,t.childList=!0}observe(){this.observer===null&&(this.observer=new MutationObserver(this.handleEvent.bind(this))),this.observer.observe(this.target,this.options)}disconnect(){this.observer.disconnect()}getNodes(){return"subtree"in this.options?Array.from(this.target.querySelectorAll(this.options.selector)):Array.from(this.target.childNodes)}};function Ft(o){return typeof o=="string"&&(o={property:o}),new ke("fast-children",So,o)}var J=class{handleStartContentChange(){this.startContainer.classList.toggle("start",this.start.assignedNodes().length>0)}handleEndContentChange(){this.endContainer.classList.toggle("end",this.end.assignedNodes().length>0)}},ne=(o,e)=>x`
    <span
        part="end"
        ${B("endContainer")}
        class=${t=>e.end?"end":void 0}
    >
        <slot name="end" ${B("end")} @slotchange="${t=>t.handleEndContentChange()}">
            ${e.end||""}
        </slot>
    </span>
`,se=(o,e)=>x`
    <span
        part="start"
        ${B("startContainer")}
        class="${t=>e.start?"start":void 0}"
    >
        <slot
            name="start"
            ${B("start")}
            @slotchange="${t=>t.handleStartContentChange()}"
        >
            ${e.start||""}
        </slot>
    </span>
`,Il=x`
    <span part="end" ${B("endContainer")}>
        <slot
            name="end"
            ${B("end")}
            @slotchange="${o=>o.handleEndContentChange()}"
        ></slot>
    </span>
`,Dl=x`
    <span part="start" ${B("startContainer")}>
        <slot
            name="start"
            ${B("start")}
            @slotchange="${o=>o.handleStartContentChange()}"
        ></slot>
    </span>
`;function d(o,e,t,i){var r=arguments.length,n=r<3?e:i===null?i=Object.getOwnPropertyDescriptor(e,t):i,s;if(typeof Reflect=="object"&&typeof Reflect.decorate=="function")n=Reflect.decorate(o,e,t,i);else for(var a=o.length-1;a>=0;a--)(s=o[a])&&(n=(r<3?s(n):r>3?s(e,t,n):s(e,t))||n);return r>3&&n&&Object.defineProperty(e,t,n),n}var To=new Map;"metadata"in Reflect||(Reflect.metadata=function(o,e){return function(t){Reflect.defineMetadata(o,e,t)}},Reflect.defineMetadata=function(o,e,t){let i=To.get(t);i===void 0&&To.set(t,i=new Map),i.set(o,e)},Reflect.getOwnMetadata=function(o,e){let t=To.get(e);if(t!==void 0)return t.get(o)});var Do=class{constructor(e,t){this.container=e,this.key=t}instance(e){return this.registerResolver(0,e)}singleton(e){return this.registerResolver(1,e)}transient(e){return this.registerResolver(2,e)}callback(e){return this.registerResolver(3,e)}cachedCallback(e){return this.registerResolver(3,ar(e))}aliasTo(e){return this.registerResolver(5,e)}registerResolver(e,t){let{container:i,key:r}=this;return this.container=this.key=void 0,i.registerResolver(r,new z(r,e,t))}};function ft(o){let e=o.slice(),t=Object.keys(o),i=t.length,r;for(let n=0;n<i;++n)r=t[n],lr(r)||(e[r]=o[r]);return e}var is=Object.freeze({none(o){throw Error(`${o.toString()} not registered, did you forget to add @singleton()?`)},singleton(o){return new z(o,1,o)},transient(o){return new z(o,2,o)}}),Oo=Object.freeze({default:Object.freeze({parentLocator:()=>null,responsibleForOwnerRequests:!1,defaultResolver:is.singleton})}),Yi=new Map;function Ji(o){return e=>Reflect.getOwnMetadata(o,e)}var Ki=null,T=Object.freeze({createContainer(o){return new Le(null,Object.assign({},Oo.default,o))},findResponsibleContainer(o){let e=o.$$container$$;return e&&e.responsibleForOwnerRequests?e:T.findParentContainer(o)},findParentContainer(o){let e=new CustomEvent(sr,{bubbles:!0,composed:!0,cancelable:!0,detail:{container:void 0}});return o.dispatchEvent(e),e.detail.container||T.getOrCreateDOMContainer()},getOrCreateDOMContainer(o,e){return o?o.$$container$$||new Le(o,Object.assign({},Oo.default,e,{parentLocator:T.findParentContainer})):Ki||(Ki=new Le(null,Object.assign({},Oo.default,e,{parentLocator:()=>null})))},getDesignParamtypes:Ji("design:paramtypes"),getAnnotationParamtypes:Ji("di:paramtypes"),getOrCreateAnnotationParamTypes(o){let e=this.getAnnotationParamtypes(o);return e===void 0&&Reflect.defineMetadata("di:paramtypes",e=[],o),e},getDependencies(o){let e=Yi.get(o);if(e===void 0){let t=o.inject;if(t===void 0){let i=T.getDesignParamtypes(o),r=T.getAnnotationParamtypes(o);if(i===void 0)if(r===void 0){let n=Object.getPrototypeOf(o);typeof n=="function"&&n!==Function.prototype?e=ft(T.getDependencies(n)):e=[]}else e=ft(r);else if(r===void 0)e=ft(i);else{e=ft(i);let n=r.length,s;for(let c=0;c<n;++c)s=r[c],s!==void 0&&(e[c]=s);let a=Object.keys(r);n=a.length;let l;for(let c=0;c<n;++c)l=a[c],lr(l)||(e[l]=r[l])}}else e=ft(t);Yi.set(o,e)}return e},defineProperty(o,e,t,i=!1){let r=`$di_${e}`;Reflect.defineProperty(o,e,{get:function(){let n=this[r];if(n===void 0&&(n=(this instanceof HTMLElement?T.findResponsibleContainer(this):T.getOrCreateDOMContainer()).get(t),this[r]=n,i&&this instanceof $e)){let a=this.$fastController,l=()=>{let u=T.findResponsibleContainer(this).get(t),h=this[r];u!==h&&(this[r]=n,a.notify(e))};a.subscribe({handleChange:l},"isConnected")}return n}})},createInterface(o,e){let t=typeof o=="function"?o:e,i=typeof o=="string"?o:o&&"friendlyName"in o&&o.friendlyName||ir,r=typeof o=="string"?!1:o&&"respectConnection"in o&&o.respectConnection||!1,n=function(s,a,l){if(s==null||new.target!==void 0)throw new Error(`No registration for interface: '${n.friendlyName}'`);if(a)T.defineProperty(s,a,n,r);else{let c=T.getOrCreateAnnotationParamTypes(s);c[l]=n}};return n.$isInterface=!0,n.friendlyName=i??"(anonymous)",t!=null&&(n.register=function(s,a){return t(new Do(s,a??n))}),n.toString=function(){return`InterfaceSymbol<${n.friendlyName}>`},n},inject(...o){return function(e,t,i){if(typeof i=="number"){let r=T.getOrCreateAnnotationParamTypes(e),n=o[0];n!==void 0&&(r[i]=n)}else if(t)T.defineProperty(e,t,o[0]);else{let r=i?T.getOrCreateAnnotationParamTypes(i.value):T.getOrCreateAnnotationParamTypes(e),n;for(let s=0;s<o.length;++s)n=o[s],n!==void 0&&(r[s]=n)}}},transient(o){return o.register=function(t){return Me.transient(o,o).register(t)},o.registerInRequestor=!1,o},singleton(o,e=ns){return o.register=function(i){return Me.singleton(o,o).register(i)},o.registerInRequestor=e.scoped,o}}),rs=T.createInterface("Container");function Lt(o){return function(e){let t=function(i,r,n){T.inject(t)(i,r,n)};return t.$isResolver=!0,t.resolve=function(i,r){return o(e,i,r)},t}}var Rl=T.inject;var ns={scoped:!1};function ss(o){return function(e,t){t=!!t;let i=function(r,n,s){T.inject(i)(r,n,s)};return i.$isResolver=!0,i.resolve=function(r,n){return o(e,r,n,t)},i}}var _l=ss((o,e,t,i)=>t.getAll(o,i)),Bl=Lt((o,e,t)=>()=>t.get(o)),Ll=Lt((o,e,t)=>{if(t.has(o,!0))return t.get(o)});function Po(o,e,t){T.inject(Po)(o,e,t)}Po.$isResolver=!0;Po.resolve=()=>{};var Ml=Lt((o,e,t)=>{let i=nr(o,e),r=new z(o,0,i);return t.registerResolver(o,r),i}),Vl=Lt((o,e,t)=>nr(o,e));function nr(o,e){return e.getFactory(o).construct(e)}var z=class{constructor(e,t,i){this.key=e,this.strategy=t,this.state=i,this.resolving=!1}get $isResolver(){return!0}register(e){return e.registerResolver(this.key,this)}resolve(e,t){switch(this.strategy){case 0:return this.state;case 1:{if(this.resolving)throw new Error(`Cyclic dependency found: ${this.state.name}`);return this.resolving=!0,this.state=e.getFactory(this.state).construct(t),this.strategy=0,this.resolving=!1,this.state}case 2:{let i=e.getFactory(this.state);if(i===null)throw new Error(`Resolver for ${String(this.key)} returned a null factory`);return i.construct(t)}case 3:return this.state(e,t,this);case 4:return this.state[0].resolve(e,t);case 5:return t.get(this.state);default:throw new Error(`Invalid resolver strategy specified: ${this.strategy}.`)}}getFactory(e){var t,i,r;switch(this.strategy){case 1:case 2:return e.getFactory(this.state);case 5:return(r=(i=(t=e.getResolver(this.state))===null||t===void 0?void 0:t.getFactory)===null||i===void 0?void 0:i.call(t,e))!==null&&r!==void 0?r:null;default:return null}}};function er(o){return this.get(o)}function as(o,e){return e(o)}var Ao=class{constructor(e,t){this.Type=e,this.dependencies=t,this.transformers=null}construct(e,t){let i;return t===void 0?i=new this.Type(...this.dependencies.map(er,e)):i=new this.Type(...this.dependencies.map(er,e),...t),this.transformers==null?i:this.transformers.reduce(as,i)}registerTransformer(e){(this.transformers||(this.transformers=[])).push(e)}},ls={$isResolver:!0,resolve(o,e){return e}};function Bt(o){return typeof o.register=="function"}function cs(o){return Bt(o)&&typeof o.registerInRequestor=="boolean"}function tr(o){return cs(o)&&o.registerInRequestor}function ds(o){return o.prototype!==void 0}var us=new Set(["Array","ArrayBuffer","Boolean","DataView","Date","Error","EvalError","Float32Array","Float64Array","Function","Int8Array","Int16Array","Int32Array","Map","Number","Object","Promise","RangeError","ReferenceError","RegExp","Set","SharedArrayBuffer","String","SyntaxError","TypeError","Uint8Array","Uint8ClampedArray","Uint16Array","Uint32Array","URIError","WeakMap","WeakSet"]),sr="__DI_LOCATE_PARENT__",Eo=new Map,Le=class{constructor(e,t){this.owner=e,this.config=t,this._parent=void 0,this.registerDepth=0,this.context=null,e!==null&&(e.$$container$$=this),this.resolvers=new Map,this.resolvers.set(rs,ls),e instanceof Node&&e.addEventListener(sr,i=>{i.composedPath()[0]!==this.owner&&(i.detail.container=this,i.stopImmediatePropagation())})}get parent(){return this._parent===void 0&&(this._parent=this.config.parentLocator(this.owner)),this._parent}get depth(){return this.parent===null?0:this.parent.depth+1}get responsibleForOwnerRequests(){return this.config.responsibleForOwnerRequests}registerWithContext(e,...t){return this.context=e,this.register(...t),this.context=null,this}register(...e){if(++this.registerDepth===100)throw new Error("Unable to autoregister dependency");let t,i,r,n,s,a=this.context;for(let l=0,c=e.length;l<c;++l)if(t=e[l],!!rr(t))if(Bt(t))t.register(this,a);else if(ds(t))Me.singleton(t,t).register(this);else for(i=Object.keys(t),n=0,s=i.length;n<s;++n)r=t[i[n]],rr(r)&&(Bt(r)?r.register(this,a):this.register(r));return--this.registerDepth,this}registerResolver(e,t){Rt(e);let i=this.resolvers,r=i.get(e);return r==null?i.set(e,t):r instanceof z&&r.strategy===4?r.state.push(t):i.set(e,new z(e,4,[r,t])),t}registerTransformer(e,t){let i=this.getResolver(e);if(i==null)return!1;if(i.getFactory){let r=i.getFactory(this);return r==null?!1:(r.registerTransformer(t),!0)}return!1}getResolver(e,t=!0){if(Rt(e),e.resolve!==void 0)return e;let i=this,r;for(;i!=null;)if(r=i.resolvers.get(e),r==null){if(i.parent==null){let n=tr(e)?this:i;return t?this.jitRegister(e,n):null}i=i.parent}else return r;return null}has(e,t=!1){return this.resolvers.has(e)?!0:t&&this.parent!=null?this.parent.has(e,!0):!1}get(e){if(Rt(e),e.$isResolver)return e.resolve(this,this);let t=this,i;for(;t!=null;)if(i=t.resolvers.get(e),i==null){if(t.parent==null){let r=tr(e)?this:t;return i=this.jitRegister(e,r),i.resolve(t,this)}t=t.parent}else return i.resolve(t,this);throw new Error(`Unable to resolve key: ${String(e)}`)}getAll(e,t=!1){Rt(e);let i=this,r=i,n;if(t){let s=Z;for(;r!=null;)n=r.resolvers.get(e),n!=null&&(s=s.concat(or(n,r,i))),r=r.parent;return s}else for(;r!=null;)if(n=r.resolvers.get(e),n==null){if(r=r.parent,r==null)return Z}else return or(n,r,i);return Z}getFactory(e){let t=Eo.get(e);if(t===void 0){if(hs(e))throw new Error(`${e.name} is a native function and therefore cannot be safely constructed by DI. If this is intentional, please use a callback or cachedCallback resolver.`);Eo.set(e,t=new Ao(e,T.getDependencies(e)))}return t}registerFactory(e,t){Eo.set(e,t)}createChild(e){return new Le(null,Object.assign({},this.config,e,{parentLocator:()=>this}))}jitRegister(e,t){if(typeof e!="function")throw new Error(`Attempted to jitRegister something that is not a constructor: '${e}'. Did you forget to register this dependency?`);if(us.has(e.name))throw new Error(`Attempted to jitRegister an intrinsic type: ${e.name}. Did you forget to add @inject(Key)`);if(Bt(e)){let i=e.register(t);if(!(i instanceof Object)||i.resolve==null){let r=t.resolvers.get(e);if(r!=null)return r;throw new Error("A valid resolver was not returned from the static register method")}return i}else{if(e.$isInterface)throw new Error(`Attempted to jitRegister an interface: ${e.friendlyName}`);{let i=this.config.defaultResolver(e,t);return t.resolvers.set(e,i),i}}}},Io=new WeakMap;function ar(o){return function(e,t,i){if(Io.has(i))return Io.get(i);let r=o(e,t,i);return Io.set(i,r),r}}var Me=Object.freeze({instance(o,e){return new z(o,0,e)},singleton(o,e){return new z(o,1,e)},transient(o,e){return new z(o,2,e)},callback(o,e){return new z(o,3,e)},cachedCallback(o,e){return new z(o,3,ar(e))},aliasTo(o,e){return new z(e,5,o)}});function Rt(o){if(o==null)throw new Error("key/value cannot be null or undefined. Are you trying to inject/register something that doesn't exist with DI?")}function or(o,e,t){if(o instanceof z&&o.strategy===4){let i=o.state,r=i.length,n=new Array(r);for(;r--;)n[r]=i[r].resolve(e,t);return n}return[o.resolve(e,t)]}var ir="(anonymous)";function rr(o){return typeof o=="object"&&o!==null||typeof o=="function"}var hs=function(){let o=new WeakMap,e=!1,t="",i=0;return function(r){return e=o.get(r),e===void 0&&(t=r.toString(),i=t.length,e=i>=29&&i<=100&&t.charCodeAt(i-1)===125&&t.charCodeAt(i-2)<=32&&t.charCodeAt(i-3)===93&&t.charCodeAt(i-4)===101&&t.charCodeAt(i-5)===100&&t.charCodeAt(i-6)===111&&t.charCodeAt(i-7)===99&&t.charCodeAt(i-8)===32&&t.charCodeAt(i-9)===101&&t.charCodeAt(i-10)===118&&t.charCodeAt(i-11)===105&&t.charCodeAt(i-12)===116&&t.charCodeAt(i-13)===97&&t.charCodeAt(i-14)===110&&t.charCodeAt(i-15)===88,o.set(r,e)),e}}(),_t={};function lr(o){switch(typeof o){case"number":return o>=0&&(o|0)===o;case"string":{let e=_t[o];if(e!==void 0)return e;let t=o.length;if(t===0)return _t[o]=!1;let i=0;for(let r=0;r<t;++r)if(i=o.charCodeAt(r),r===0&&i===48&&t>1||i<48||i>57)return _t[o]=!1;return _t[o]=!0}default:return!1}}function cr(o){return`${o.toLowerCase()}:presentation`}var Mt=new Map,Ht=Object.freeze({define(o,e,t){let i=cr(o);Mt.get(i)===void 0?Mt.set(i,e):Mt.set(i,!1),t.register(Me.instance(i,e))},forTag(o,e){let t=cr(o),i=Mt.get(t);return i===!1?T.findResponsibleContainer(e).get(t):i||null}}),Vt=class{constructor(e,t){this.template=e||null,this.styles=t===void 0?null:Array.isArray(t)?A.create(t):t instanceof A?t:A.create([t])}applyTo(e){let t=e.$fastController;t.template===null&&(t.template=this.template),t.styles===null&&(t.styles=this.styles)}};var C=class extends $e{constructor(){super(...arguments),this._presentation=void 0}get $presentation(){return this._presentation===void 0&&(this._presentation=Ht.forTag(this.tagName,this)),this._presentation}templateChanged(){this.template!==void 0&&(this.$fastController.template=this.template)}stylesChanged(){this.styles!==void 0&&(this.$fastController.styles=this.styles)}connectedCallback(){this.$presentation!==null&&this.$presentation.applyTo(this),super.connectedCallback()}static compose(e){return(t={})=>new Fo(this===C?class extends C{}:this,e,t)}};d([f],C.prototype,"template",void 0);d([f],C.prototype,"styles",void 0);function mt(o,e,t){return typeof o=="function"?o(e,t):o}var Fo=class{constructor(e,t,i){this.type=e,this.elementDefinition=t,this.overrideDefinition=i,this.definition=Object.assign(Object.assign({},this.elementDefinition),this.overrideDefinition)}register(e,t){let i=this.definition,r=this.overrideDefinition,s=`${i.prefix||t.elementPrefix}-${i.baseName}`;t.tryDefineElement({name:s,type:this.type,baseClass:this.elementDefinition.baseClass,callback:a=>{let l=new Vt(mt(i.template,a,i),mt(i.styles,a,i));a.definePresentation(l);let c=mt(i.shadowOptions,a,i);a.shadowRootMode&&(c?r.shadowOptions||(c.mode=a.shadowRootMode):c!==null&&(c={mode:a.shadowRootMode})),a.defineElement({elementOptions:mt(i.elementOptions,a,i),shadowOptions:c,attributes:mt(i.attributes,a,i)})}})}};function L(o,...e){let t=ht.locate(o);e.forEach(i=>{Object.getOwnPropertyNames(i.prototype).forEach(n=>{n!=="constructor"&&Object.defineProperty(o.prototype,n,Object.getOwnPropertyDescriptor(i.prototype,n))}),ht.locate(i).forEach(n=>t.push(n))})}var dr={horizontal:"horizontal",vertical:"vertical"};function ur(o,e){let t=o.length;for(;t--;)if(e(o[t],t,o))return t;return-1}function hr(){return!!(typeof window<"u"&&window.document&&window.document.createElement)}function pr(...o){return o.every(e=>e instanceof HTMLElement)}function ps(){let o=document.querySelector('meta[property="csp-nonce"]');return o?o.getAttribute("content"):null}var Ve;function fr(){if(typeof Ve=="boolean")return Ve;if(!hr())return Ve=!1,Ve;let o=document.createElement("style"),e=ps();e!==null&&o.setAttribute("nonce",e),document.head.appendChild(o);try{o.sheet.insertRule("foo:focus-visible {color:inherit}",0),Ve=!0}catch{Ve=!1}finally{document.head.removeChild(o)}return Ve}var Ro="focus",_o="focusin",me="focusout";var ge="keydown";var mr;(function(o){o[o.alt=18]="alt",o[o.arrowDown=40]="arrowDown",o[o.arrowLeft=37]="arrowLeft",o[o.arrowRight=39]="arrowRight",o[o.arrowUp=38]="arrowUp",o[o.back=8]="back",o[o.backSlash=220]="backSlash",o[o.break=19]="break",o[o.capsLock=20]="capsLock",o[o.closeBracket=221]="closeBracket",o[o.colon=186]="colon",o[o.colon2=59]="colon2",o[o.comma=188]="comma",o[o.ctrl=17]="ctrl",o[o.delete=46]="delete",o[o.end=35]="end",o[o.enter=13]="enter",o[o.equals=187]="equals",o[o.equals2=61]="equals2",o[o.equals3=107]="equals3",o[o.escape=27]="escape",o[o.forwardSlash=191]="forwardSlash",o[o.function1=112]="function1",o[o.function10=121]="function10",o[o.function11=122]="function11",o[o.function12=123]="function12",o[o.function2=113]="function2",o[o.function3=114]="function3",o[o.function4=115]="function4",o[o.function5=116]="function5",o[o.function6=117]="function6",o[o.function7=118]="function7",o[o.function8=119]="function8",o[o.function9=120]="function9",o[o.home=36]="home",o[o.insert=45]="insert",o[o.menu=93]="menu",o[o.minus=189]="minus",o[o.minus2=109]="minus2",o[o.numLock=144]="numLock",o[o.numPad0=96]="numPad0",o[o.numPad1=97]="numPad1",o[o.numPad2=98]="numPad2",o[o.numPad3=99]="numPad3",o[o.numPad4=100]="numPad4",o[o.numPad5=101]="numPad5",o[o.numPad6=102]="numPad6",o[o.numPad7=103]="numPad7",o[o.numPad8=104]="numPad8",o[o.numPad9=105]="numPad9",o[o.numPadDivide=111]="numPadDivide",o[o.numPadDot=110]="numPadDot",o[o.numPadMinus=109]="numPadMinus",o[o.numPadMultiply=106]="numPadMultiply",o[o.numPadPlus=107]="numPadPlus",o[o.openBracket=219]="openBracket",o[o.pageDown=34]="pageDown",o[o.pageUp=33]="pageUp",o[o.period=190]="period",o[o.print=44]="print",o[o.quote=222]="quote",o[o.scrollLock=145]="scrollLock",o[o.shift=16]="shift",o[o.space=32]="space",o[o.tab=9]="tab",o[o.tilde=192]="tilde",o[o.windowsLeft=91]="windowsLeft",o[o.windowsOpera=219]="windowsOpera",o[o.windowsRight=92]="windowsRight"})(mr||(mr={}));var Se="ArrowDown",gr="ArrowLeft",br="ArrowRight",Te="ArrowUp",Oe="Enter",Ee="Escape",ae="Home",le="End",vr="F2",xr="PageDown",yr="PageUp",Ie=" ",tt="Tab";function gt(o,e,t=0){return[e,t]=[e,t].sort((i,r)=>i-r),e<=o&&o<t}var fs=0;function Nt(o=""){return`${o}${fs++}`}var wr=(o,e)=>x`
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
        ${B("control")}
    >
        ${se(o,e)}
        <span class="content" part="content">
            <slot ${G("defaultSlottedContent")}></slot>
        </span>
        ${ne(o,e)}
    </a>
`;var k=class{};d([p({attribute:"aria-atomic"})],k.prototype,"ariaAtomic",void 0);d([p({attribute:"aria-busy"})],k.prototype,"ariaBusy",void 0);d([p({attribute:"aria-controls"})],k.prototype,"ariaControls",void 0);d([p({attribute:"aria-current"})],k.prototype,"ariaCurrent",void 0);d([p({attribute:"aria-describedby"})],k.prototype,"ariaDescribedby",void 0);d([p({attribute:"aria-details"})],k.prototype,"ariaDetails",void 0);d([p({attribute:"aria-disabled"})],k.prototype,"ariaDisabled",void 0);d([p({attribute:"aria-errormessage"})],k.prototype,"ariaErrormessage",void 0);d([p({attribute:"aria-flowto"})],k.prototype,"ariaFlowto",void 0);d([p({attribute:"aria-haspopup"})],k.prototype,"ariaHaspopup",void 0);d([p({attribute:"aria-hidden"})],k.prototype,"ariaHidden",void 0);d([p({attribute:"aria-invalid"})],k.prototype,"ariaInvalid",void 0);d([p({attribute:"aria-keyshortcuts"})],k.prototype,"ariaKeyshortcuts",void 0);d([p({attribute:"aria-label"})],k.prototype,"ariaLabel",void 0);d([p({attribute:"aria-labelledby"})],k.prototype,"ariaLabelledby",void 0);d([p({attribute:"aria-live"})],k.prototype,"ariaLive",void 0);d([p({attribute:"aria-owns"})],k.prototype,"ariaOwns",void 0);d([p({attribute:"aria-relevant"})],k.prototype,"ariaRelevant",void 0);d([p({attribute:"aria-roledescription"})],k.prototype,"ariaRoledescription",void 0);var W=class extends C{constructor(){super(...arguments),this.handleUnsupportedDelegatesFocus=()=>{var e;window.ShadowRoot&&!window.ShadowRoot.prototype.hasOwnProperty("delegatesFocus")&&(!((e=this.$fastController.definition.shadowOptions)===null||e===void 0)&&e.delegatesFocus)&&(this.focus=()=>{var t;(t=this.control)===null||t===void 0||t.focus()})}}connectedCallback(){super.connectedCallback(),this.handleUnsupportedDelegatesFocus()}};d([p],W.prototype,"download",void 0);d([p],W.prototype,"href",void 0);d([p],W.prototype,"hreflang",void 0);d([p],W.prototype,"ping",void 0);d([p],W.prototype,"referrerpolicy",void 0);d([p],W.prototype,"rel",void 0);d([p],W.prototype,"target",void 0);d([p],W.prototype,"type",void 0);d([f],W.prototype,"defaultSlottedContent",void 0);var bt=class{};d([p({attribute:"aria-expanded"})],bt.prototype,"ariaExpanded",void 0);L(bt,k);L(W,J,bt);var Cr=(o,e)=>x`
    <template class="${t=>t.circular?"circular":""}">
        <div class="control" part="control" style="${t=>t.generateBadgeStyle()}">
            <slot></slot>
        </div>
    </template>
`;var He=class extends C{constructor(){super(...arguments),this.generateBadgeStyle=()=>{if(!this.fill&&!this.color)return;let e=`background-color: var(--badge-fill-${this.fill});`,t=`color: var(--badge-color-${this.color});`;return this.fill&&!this.color?e:this.color&&!this.fill?t:`${t} ${e}`}}};d([p({attribute:"fill"})],He.prototype,"fill",void 0);d([p({attribute:"color"})],He.prototype,"color",void 0);d([p({mode:"boolean"})],He.prototype,"circular",void 0);var kr=(o,e)=>x`
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
        ${B("control")}
    >
        ${se(o,e)}
        <span class="content" part="content">
            <slot ${G("defaultSlottedContent")}></slot>
        </span>
        ${ne(o,e)}
    </button>
`;var $r="form-associated-proxy",Sr="ElementInternals",Tr=Sr in window&&"setFormValue"in window[Sr].prototype,Or=new WeakMap;function Ne(o){let e=class extends o{constructor(...t){super(...t),this.dirtyValue=!1,this.disabled=!1,this.proxyEventsToBlock=["change","click"],this.proxyInitialized=!1,this.required=!1,this.initialValue=this.initialValue||"",this.elementInternals||(this.formResetCallback=this.formResetCallback.bind(this))}static get formAssociated(){return Tr}get validity(){return this.elementInternals?this.elementInternals.validity:this.proxy.validity}get form(){return this.elementInternals?this.elementInternals.form:this.proxy.form}get validationMessage(){return this.elementInternals?this.elementInternals.validationMessage:this.proxy.validationMessage}get willValidate(){return this.elementInternals?this.elementInternals.willValidate:this.proxy.willValidate}get labels(){if(this.elementInternals)return Object.freeze(Array.from(this.elementInternals.labels));if(this.proxy instanceof HTMLElement&&this.proxy.ownerDocument&&this.id){let t=this.proxy.labels,i=Array.from(this.proxy.getRootNode().querySelectorAll(`[for='${this.id}']`)),r=t?i.concat(Array.from(t)):i;return Object.freeze(r)}else return Z}valueChanged(t,i){this.dirtyValue=!0,this.proxy instanceof HTMLElement&&(this.proxy.value=this.value),this.currentValue=this.value,this.setFormValue(this.value),this.validate()}currentValueChanged(){this.value=this.currentValue}initialValueChanged(t,i){this.dirtyValue||(this.value=this.initialValue,this.dirtyValue=!1)}disabledChanged(t,i){this.proxy instanceof HTMLElement&&(this.proxy.disabled=this.disabled),b.queueUpdate(()=>this.classList.toggle("disabled",this.disabled))}nameChanged(t,i){this.proxy instanceof HTMLElement&&(this.proxy.name=this.name)}requiredChanged(t,i){this.proxy instanceof HTMLElement&&(this.proxy.required=this.required),b.queueUpdate(()=>this.classList.toggle("required",this.required)),this.validate()}get elementInternals(){if(!Tr)return null;let t=Or.get(this);return t||(t=this.attachInternals(),Or.set(this,t)),t}connectedCallback(){super.connectedCallback(),this.addEventListener("keypress",this._keypressHandler),this.value||(this.value=this.initialValue,this.dirtyValue=!1),this.elementInternals||(this.attachProxy(),this.form&&this.form.addEventListener("reset",this.formResetCallback))}disconnectedCallback(){super.disconnectedCallback(),this.proxyEventsToBlock.forEach(t=>this.proxy.removeEventListener(t,this.stopPropagation)),!this.elementInternals&&this.form&&this.form.removeEventListener("reset",this.formResetCallback)}checkValidity(){return this.elementInternals?this.elementInternals.checkValidity():this.proxy.checkValidity()}reportValidity(){return this.elementInternals?this.elementInternals.reportValidity():this.proxy.reportValidity()}setValidity(t,i,r){this.elementInternals?this.elementInternals.setValidity(t,i,r):typeof i=="string"&&this.proxy.setCustomValidity(i)}formDisabledCallback(t){this.disabled=t}formResetCallback(){this.value=this.initialValue,this.dirtyValue=!1}attachProxy(){var t;this.proxyInitialized||(this.proxyInitialized=!0,this.proxy.style.display="none",this.proxyEventsToBlock.forEach(i=>this.proxy.addEventListener(i,this.stopPropagation)),this.proxy.disabled=this.disabled,this.proxy.required=this.required,typeof this.name=="string"&&(this.proxy.name=this.name),typeof this.value=="string"&&(this.proxy.value=this.value),this.proxy.setAttribute("slot",$r),this.proxySlot=document.createElement("slot"),this.proxySlot.setAttribute("name",$r)),(t=this.shadowRoot)===null||t===void 0||t.appendChild(this.proxySlot),this.appendChild(this.proxy)}detachProxy(){var t;this.removeChild(this.proxy),(t=this.shadowRoot)===null||t===void 0||t.removeChild(this.proxySlot)}validate(t){this.proxy instanceof HTMLElement&&this.setValidity(this.proxy.validity,this.proxy.validationMessage,t)}setFormValue(t,i){this.elementInternals&&this.elementInternals.setFormValue(t,i||t)}_keypressHandler(t){switch(t.key){case Oe:if(this.form instanceof HTMLFormElement){let i=this.form.querySelector("[type=submit]");i?.click()}break}}stopPropagation(t){t.stopPropagation()}};return p({mode:"boolean"})(e.prototype,"disabled"),p({mode:"fromView",attribute:"value"})(e.prototype,"initialValue"),p({attribute:"current-value"})(e.prototype,"currentValue"),p(e.prototype,"name"),p({mode:"boolean"})(e.prototype,"required"),f(e.prototype,"value"),e}function Er(o){class e extends Ne(o){}class t extends e{constructor(...r){super(r),this.dirtyChecked=!1,this.checkedAttribute=!1,this.checked=!1,this.dirtyChecked=!1}checkedAttributeChanged(){this.defaultChecked=this.checkedAttribute}defaultCheckedChanged(){this.dirtyChecked||(this.checked=this.defaultChecked,this.dirtyChecked=!1)}checkedChanged(r,n){this.dirtyChecked||(this.dirtyChecked=!0),this.currentChecked=this.checked,this.updateForm(),this.proxy instanceof HTMLInputElement&&(this.proxy.checked=this.checked),r!==void 0&&this.$emit("change"),this.validate()}currentCheckedChanged(r,n){this.checked=this.currentChecked}updateForm(){let r=this.checked?this.value:null;this.setFormValue(r,r)}connectedCallback(){super.connectedCallback(),this.updateForm()}formResetCallback(){super.formResetCallback(),this.checked=!!this.checkedAttribute,this.dirtyChecked=!1}}return p({attribute:"checked",mode:"boolean"})(t.prototype,"checkedAttribute"),p({attribute:"current-checked",converter:po})(t.prototype,"currentChecked"),f(t.prototype,"defaultChecked"),f(t.prototype,"checked"),t}var Bo=class extends C{},jt=class extends Ne(Bo){constructor(){super(...arguments),this.proxy=document.createElement("input")}};var Q=class extends jt{constructor(){super(...arguments),this.handleClick=e=>{var t;this.disabled&&((t=this.defaultSlottedContent)===null||t===void 0?void 0:t.length)<=1&&e.stopPropagation()},this.handleSubmission=()=>{if(!this.form)return;let e=this.proxy.isConnected;e||this.attachProxy(),typeof this.form.requestSubmit=="function"?this.form.requestSubmit(this.proxy):this.proxy.click(),e||this.detachProxy()},this.handleFormReset=()=>{var e;(e=this.form)===null||e===void 0||e.reset()},this.handleUnsupportedDelegatesFocus=()=>{var e;window.ShadowRoot&&!window.ShadowRoot.prototype.hasOwnProperty("delegatesFocus")&&(!((e=this.$fastController.definition.shadowOptions)===null||e===void 0)&&e.delegatesFocus)&&(this.focus=()=>{this.control.focus()})}}formactionChanged(){this.proxy instanceof HTMLInputElement&&(this.proxy.formAction=this.formaction)}formenctypeChanged(){this.proxy instanceof HTMLInputElement&&(this.proxy.formEnctype=this.formenctype)}formmethodChanged(){this.proxy instanceof HTMLInputElement&&(this.proxy.formMethod=this.formmethod)}formnovalidateChanged(){this.proxy instanceof HTMLInputElement&&(this.proxy.formNoValidate=this.formnovalidate)}formtargetChanged(){this.proxy instanceof HTMLInputElement&&(this.proxy.formTarget=this.formtarget)}typeChanged(e,t){this.proxy instanceof HTMLInputElement&&(this.proxy.type=this.type),t==="submit"&&this.addEventListener("click",this.handleSubmission),e==="submit"&&this.removeEventListener("click",this.handleSubmission),t==="reset"&&this.addEventListener("click",this.handleFormReset),e==="reset"&&this.removeEventListener("click",this.handleFormReset)}validate(){super.validate(this.control)}connectedCallback(){var e;super.connectedCallback(),this.proxy.setAttribute("type",this.type),this.handleUnsupportedDelegatesFocus();let t=Array.from((e=this.control)===null||e===void 0?void 0:e.children);t&&t.forEach(i=>{i.addEventListener("click",this.handleClick)})}disconnectedCallback(){var e;super.disconnectedCallback();let t=Array.from((e=this.control)===null||e===void 0?void 0:e.children);t&&t.forEach(i=>{i.removeEventListener("click",this.handleClick)})}};d([p({mode:"boolean"})],Q.prototype,"autofocus",void 0);d([p({attribute:"form"})],Q.prototype,"formId",void 0);d([p],Q.prototype,"formaction",void 0);d([p],Q.prototype,"formenctype",void 0);d([p],Q.prototype,"formmethod",void 0);d([p({mode:"boolean"})],Q.prototype,"formnovalidate",void 0);d([p],Q.prototype,"formtarget",void 0);d([p],Q.prototype,"type",void 0);d([f],Q.prototype,"defaultSlottedContent",void 0);var ot=class{};d([p({attribute:"aria-expanded"})],ot.prototype,"ariaExpanded",void 0);d([p({attribute:"aria-pressed"})],ot.prototype,"ariaPressed",void 0);L(ot,k);L(Q,J,ot);var it={none:"none",default:"default",sticky:"sticky"},ce={default:"default",columnHeader:"columnheader",rowHeader:"rowheader"},De={default:"default",header:"header",stickyHeader:"sticky-header"};var F=class extends C{constructor(){super(...arguments),this.rowType=De.default,this.rowData=null,this.columnDefinitions=null,this.isActiveRow=!1,this.cellsRepeatBehavior=null,this.cellsPlaceholder=null,this.focusColumnIndex=0,this.refocusOnLoad=!1,this.updateRowStyle=()=>{this.style.gridTemplateColumns=this.gridTemplateColumns}}gridTemplateColumnsChanged(){this.$fastController.isConnected&&this.updateRowStyle()}rowTypeChanged(){this.$fastController.isConnected&&this.updateItemTemplate()}rowDataChanged(){if(this.rowData!==null&&this.isActiveRow){this.refocusOnLoad=!0;return}}cellItemTemplateChanged(){this.updateItemTemplate()}headerCellItemTemplateChanged(){this.updateItemTemplate()}connectedCallback(){super.connectedCallback(),this.cellsRepeatBehavior===null&&(this.cellsPlaceholder=document.createComment(""),this.appendChild(this.cellsPlaceholder),this.updateItemTemplate(),this.cellsRepeatBehavior=new Ke(e=>e.columnDefinitions,e=>e.activeCellItemTemplate,{positioning:!0}).createBehavior(this.cellsPlaceholder),this.$fastController.addBehaviors([this.cellsRepeatBehavior])),this.addEventListener("cell-focused",this.handleCellFocus),this.addEventListener(me,this.handleFocusout),this.addEventListener(ge,this.handleKeydown),this.updateRowStyle(),this.refocusOnLoad&&(this.refocusOnLoad=!1,this.cellElements.length>this.focusColumnIndex&&this.cellElements[this.focusColumnIndex].focus())}disconnectedCallback(){super.disconnectedCallback(),this.removeEventListener("cell-focused",this.handleCellFocus),this.removeEventListener(me,this.handleFocusout),this.removeEventListener(ge,this.handleKeydown)}handleFocusout(e){this.contains(e.target)||(this.isActiveRow=!1,this.focusColumnIndex=0)}handleCellFocus(e){this.isActiveRow=!0,this.focusColumnIndex=this.cellElements.indexOf(e.target),this.$emit("row-focused",this)}handleKeydown(e){if(e.defaultPrevented)return;let t=0;switch(e.key){case gr:t=Math.max(0,this.focusColumnIndex-1),this.cellElements[t].focus(),e.preventDefault();break;case br:t=Math.min(this.cellElements.length-1,this.focusColumnIndex+1),this.cellElements[t].focus(),e.preventDefault();break;case ae:e.ctrlKey||(this.cellElements[0].focus(),e.preventDefault());break;case le:e.ctrlKey||(this.cellElements[this.cellElements.length-1].focus(),e.preventDefault());break}}updateItemTemplate(){this.activeCellItemTemplate=this.rowType===De.default&&this.cellItemTemplate!==void 0?this.cellItemTemplate:this.rowType===De.default&&this.cellItemTemplate===void 0?this.defaultCellItemTemplate:this.headerCellItemTemplate!==void 0?this.headerCellItemTemplate:this.defaultHeaderCellItemTemplate}};d([p({attribute:"grid-template-columns"})],F.prototype,"gridTemplateColumns",void 0);d([p({attribute:"row-type"})],F.prototype,"rowType",void 0);d([f],F.prototype,"rowData",void 0);d([f],F.prototype,"columnDefinitions",void 0);d([f],F.prototype,"cellItemTemplate",void 0);d([f],F.prototype,"headerCellItemTemplate",void 0);d([f],F.prototype,"rowIndex",void 0);d([f],F.prototype,"isActiveRow",void 0);d([f],F.prototype,"activeCellItemTemplate",void 0);d([f],F.prototype,"defaultCellItemTemplate",void 0);d([f],F.prototype,"defaultHeaderCellItemTemplate",void 0);d([f],F.prototype,"cellElements",void 0);function ms(o){let e=o.tagFor(F);return x`
    <${e}
        :rowData="${t=>t}"
        :cellItemTemplate="${(t,i)=>i.parent.cellItemTemplate}"
        :headerCellItemTemplate="${(t,i)=>i.parent.headerCellItemTemplate}"
    ></${e}>
`}var Ir=(o,e)=>{let t=ms(o),i=o.tagFor(F);return x`
        <template
            role="grid"
            tabindex="0"
            :rowElementTag="${()=>i}"
            :defaultRowItemTemplate="${t}"
            ${Ft({property:"rowElements",filter:pt("[role=row]")})}
        >
            <slot></slot>
        </template>
    `};var I=class extends C{constructor(){super(),this.noTabbing=!1,this.generateHeader=it.default,this.rowsData=[],this.columnDefinitions=null,this.focusRowIndex=0,this.focusColumnIndex=0,this.rowsPlaceholder=null,this.generatedHeader=null,this.isUpdatingFocus=!1,this.pendingFocusUpdate=!1,this.rowindexUpdateQueued=!1,this.columnDefinitionsStale=!0,this.generatedGridTemplateColumns="",this.focusOnCell=(e,t,i)=>{if(this.rowElements.length===0){this.focusRowIndex=0,this.focusColumnIndex=0;return}let r=Math.max(0,Math.min(this.rowElements.length-1,e)),s=this.rowElements[r].querySelectorAll('[role="cell"], [role="gridcell"], [role="columnheader"], [role="rowheader"]'),a=Math.max(0,Math.min(s.length-1,t)),l=s[a];i&&this.scrollHeight!==this.clientHeight&&(r<this.focusRowIndex&&this.scrollTop>0||r>this.focusRowIndex&&this.scrollTop<this.scrollHeight-this.clientHeight)&&l.scrollIntoView({block:"center",inline:"center"}),l.focus()},this.onChildListChange=(e,t)=>{e&&e.length&&(e.forEach(i=>{i.addedNodes.forEach(r=>{r.nodeType===1&&r.getAttribute("role")==="row"&&(r.columnDefinitions=this.columnDefinitions)})}),this.queueRowIndexUpdate())},this.queueRowIndexUpdate=()=>{this.rowindexUpdateQueued||(this.rowindexUpdateQueued=!0,b.queueUpdate(this.updateRowIndexes))},this.updateRowIndexes=()=>{let e=this.gridTemplateColumns;if(e===void 0){if(this.generatedGridTemplateColumns===""&&this.rowElements.length>0){let t=this.rowElements[0];this.generatedGridTemplateColumns=new Array(t.cellElements.length).fill("1fr").join(" ")}e=this.generatedGridTemplateColumns}this.rowElements.forEach((t,i)=>{let r=t;r.rowIndex=i,r.gridTemplateColumns=e,this.columnDefinitionsStale&&(r.columnDefinitions=this.columnDefinitions)}),this.rowindexUpdateQueued=!1,this.columnDefinitionsStale=!1}}static generateTemplateColumns(e){let t="";return e.forEach(i=>{t=`${t}${t===""?"":" "}1fr`}),t}noTabbingChanged(){this.$fastController.isConnected&&(this.noTabbing?this.setAttribute("tabIndex","-1"):this.setAttribute("tabIndex",this.contains(document.activeElement)||this===document.activeElement?"-1":"0"))}generateHeaderChanged(){this.$fastController.isConnected&&this.toggleGeneratedHeader()}gridTemplateColumnsChanged(){this.$fastController.isConnected&&this.updateRowIndexes()}rowsDataChanged(){this.columnDefinitions===null&&this.rowsData.length>0&&(this.columnDefinitions=I.generateColumns(this.rowsData[0])),this.$fastController.isConnected&&this.toggleGeneratedHeader()}columnDefinitionsChanged(){if(this.columnDefinitions===null){this.generatedGridTemplateColumns="";return}this.generatedGridTemplateColumns=I.generateTemplateColumns(this.columnDefinitions),this.$fastController.isConnected&&(this.columnDefinitionsStale=!0,this.queueRowIndexUpdate())}headerCellItemTemplateChanged(){this.$fastController.isConnected&&this.generatedHeader!==null&&(this.generatedHeader.headerCellItemTemplate=this.headerCellItemTemplate)}focusRowIndexChanged(){this.$fastController.isConnected&&this.queueFocusUpdate()}focusColumnIndexChanged(){this.$fastController.isConnected&&this.queueFocusUpdate()}connectedCallback(){super.connectedCallback(),this.rowItemTemplate===void 0&&(this.rowItemTemplate=this.defaultRowItemTemplate),this.rowsPlaceholder=document.createComment(""),this.appendChild(this.rowsPlaceholder),this.toggleGeneratedHeader(),this.rowsRepeatBehavior=new Ke(e=>e.rowsData,e=>e.rowItemTemplate,{positioning:!0}).createBehavior(this.rowsPlaceholder),this.$fastController.addBehaviors([this.rowsRepeatBehavior]),this.addEventListener("row-focused",this.handleRowFocus),this.addEventListener(Ro,this.handleFocus),this.addEventListener(ge,this.handleKeydown),this.addEventListener(me,this.handleFocusOut),this.observer=new MutationObserver(this.onChildListChange),this.observer.observe(this,{childList:!0}),this.noTabbing&&this.setAttribute("tabindex","-1"),b.queueUpdate(this.queueRowIndexUpdate)}disconnectedCallback(){super.disconnectedCallback(),this.removeEventListener("row-focused",this.handleRowFocus),this.removeEventListener(Ro,this.handleFocus),this.removeEventListener(ge,this.handleKeydown),this.removeEventListener(me,this.handleFocusOut),this.observer.disconnect(),this.rowsPlaceholder=null,this.generatedHeader=null}handleRowFocus(e){this.isUpdatingFocus=!0;let t=e.target;this.focusRowIndex=this.rowElements.indexOf(t),this.focusColumnIndex=t.focusColumnIndex,this.setAttribute("tabIndex","-1"),this.isUpdatingFocus=!1}handleFocus(e){this.focusOnCell(this.focusRowIndex,this.focusColumnIndex,!0)}handleFocusOut(e){(e.relatedTarget===null||!this.contains(e.relatedTarget))&&this.setAttribute("tabIndex",this.noTabbing?"-1":"0")}handleKeydown(e){if(e.defaultPrevented)return;let t,i=this.rowElements.length-1,r=this.offsetHeight+this.scrollTop,n=this.rowElements[i];switch(e.key){case Te:e.preventDefault(),this.focusOnCell(this.focusRowIndex-1,this.focusColumnIndex,!0);break;case Se:e.preventDefault(),this.focusOnCell(this.focusRowIndex+1,this.focusColumnIndex,!0);break;case yr:if(e.preventDefault(),this.rowElements.length===0){this.focusOnCell(0,0,!1);break}if(this.focusRowIndex===0){this.focusOnCell(0,this.focusColumnIndex,!1);return}for(t=this.focusRowIndex-1,t;t>=0;t--){let s=this.rowElements[t];if(s.offsetTop<this.scrollTop){this.scrollTop=s.offsetTop+s.clientHeight-this.clientHeight;break}}this.focusOnCell(t,this.focusColumnIndex,!1);break;case xr:if(e.preventDefault(),this.rowElements.length===0){this.focusOnCell(0,0,!1);break}if(this.focusRowIndex>=i||n.offsetTop+n.offsetHeight<=r){this.focusOnCell(i,this.focusColumnIndex,!1);return}for(t=this.focusRowIndex+1,t;t<=i;t++){let s=this.rowElements[t];if(s.offsetTop+s.offsetHeight>r){let a=0;this.generateHeader===it.sticky&&this.generatedHeader!==null&&(a=this.generatedHeader.clientHeight),this.scrollTop=s.offsetTop-a;break}}this.focusOnCell(t,this.focusColumnIndex,!1);break;case ae:e.ctrlKey&&(e.preventDefault(),this.focusOnCell(0,0,!0));break;case le:e.ctrlKey&&this.columnDefinitions!==null&&(e.preventDefault(),this.focusOnCell(this.rowElements.length-1,this.columnDefinitions.length-1,!0));break}}queueFocusUpdate(){this.isUpdatingFocus&&(this.contains(document.activeElement)||this===document.activeElement)||this.pendingFocusUpdate===!1&&(this.pendingFocusUpdate=!0,b.queueUpdate(()=>this.updateFocus()))}updateFocus(){this.pendingFocusUpdate=!1,this.focusOnCell(this.focusRowIndex,this.focusColumnIndex,!0)}toggleGeneratedHeader(){if(this.generatedHeader!==null&&(this.removeChild(this.generatedHeader),this.generatedHeader=null),this.generateHeader!==it.none&&this.rowsData.length>0){let e=document.createElement(this.rowElementTag);this.generatedHeader=e,this.generatedHeader.columnDefinitions=this.columnDefinitions,this.generatedHeader.gridTemplateColumns=this.gridTemplateColumns,this.generatedHeader.rowType=this.generateHeader===it.sticky?De.stickyHeader:De.header,(this.firstChild!==null||this.rowsPlaceholder!==null)&&this.insertBefore(e,this.firstChild!==null?this.firstChild:this.rowsPlaceholder);return}}};I.generateColumns=o=>Object.getOwnPropertyNames(o).map((e,t)=>({columnDataKey:e,gridColumn:`${t}`}));d([p({attribute:"no-tabbing",mode:"boolean"})],I.prototype,"noTabbing",void 0);d([p({attribute:"generate-header"})],I.prototype,"generateHeader",void 0);d([p({attribute:"grid-template-columns"})],I.prototype,"gridTemplateColumns",void 0);d([f],I.prototype,"rowsData",void 0);d([f],I.prototype,"columnDefinitions",void 0);d([f],I.prototype,"rowItemTemplate",void 0);d([f],I.prototype,"cellItemTemplate",void 0);d([f],I.prototype,"headerCellItemTemplate",void 0);d([f],I.prototype,"focusRowIndex",void 0);d([f],I.prototype,"focusColumnIndex",void 0);d([f],I.prototype,"defaultRowItemTemplate",void 0);d([f],I.prototype,"rowElementTag",void 0);d([f],I.prototype,"rowElements",void 0);var gs=x`
    <template>
        ${o=>o.rowData===null||o.columnDefinition===null||o.columnDefinition.columnDataKey===null?null:o.rowData[o.columnDefinition.columnDataKey]}
    </template>
`,bs=x`
    <template>
        ${o=>o.columnDefinition===null?null:o.columnDefinition.title===void 0?o.columnDefinition.columnDataKey:o.columnDefinition.title}
    </template>
`,K=class extends C{constructor(){super(...arguments),this.cellType=ce.default,this.rowData=null,this.columnDefinition=null,this.isActiveCell=!1,this.customCellView=null,this.updateCellStyle=()=>{this.style.gridColumn=this.gridColumn}}cellTypeChanged(){this.$fastController.isConnected&&this.updateCellView()}gridColumnChanged(){this.$fastController.isConnected&&this.updateCellStyle()}columnDefinitionChanged(e,t){this.$fastController.isConnected&&this.updateCellView()}connectedCallback(){var e;super.connectedCallback(),this.addEventListener(_o,this.handleFocusin),this.addEventListener(me,this.handleFocusout),this.addEventListener(ge,this.handleKeydown),this.style.gridColumn=`${((e=this.columnDefinition)===null||e===void 0?void 0:e.gridColumn)===void 0?0:this.columnDefinition.gridColumn}`,this.updateCellView(),this.updateCellStyle()}disconnectedCallback(){super.disconnectedCallback(),this.removeEventListener(_o,this.handleFocusin),this.removeEventListener(me,this.handleFocusout),this.removeEventListener(ge,this.handleKeydown),this.disconnectCellView()}handleFocusin(e){if(!this.isActiveCell){switch(this.isActiveCell=!0,this.cellType){case ce.columnHeader:if(this.columnDefinition!==null&&this.columnDefinition.headerCellInternalFocusQueue!==!0&&typeof this.columnDefinition.headerCellFocusTargetCallback=="function"){let t=this.columnDefinition.headerCellFocusTargetCallback(this);t!==null&&t.focus()}break;default:if(this.columnDefinition!==null&&this.columnDefinition.cellInternalFocusQueue!==!0&&typeof this.columnDefinition.cellFocusTargetCallback=="function"){let t=this.columnDefinition.cellFocusTargetCallback(this);t!==null&&t.focus()}break}this.$emit("cell-focused",this)}}handleFocusout(e){this!==document.activeElement&&!this.contains(document.activeElement)&&(this.isActiveCell=!1)}handleKeydown(e){if(!(e.defaultPrevented||this.columnDefinition===null||this.cellType===ce.default&&this.columnDefinition.cellInternalFocusQueue!==!0||this.cellType===ce.columnHeader&&this.columnDefinition.headerCellInternalFocusQueue!==!0))switch(e.key){case Oe:case vr:if(this.contains(document.activeElement)&&document.activeElement!==this)return;switch(this.cellType){case ce.columnHeader:if(this.columnDefinition.headerCellFocusTargetCallback!==void 0){let t=this.columnDefinition.headerCellFocusTargetCallback(this);t!==null&&t.focus(),e.preventDefault()}break;default:if(this.columnDefinition.cellFocusTargetCallback!==void 0){let t=this.columnDefinition.cellFocusTargetCallback(this);t!==null&&t.focus(),e.preventDefault()}break}break;case Ee:this.contains(document.activeElement)&&document.activeElement!==this&&(this.focus(),e.preventDefault());break}}updateCellView(){if(this.disconnectCellView(),this.columnDefinition!==null)switch(this.cellType){case ce.columnHeader:this.columnDefinition.headerCellTemplate!==void 0?this.customCellView=this.columnDefinition.headerCellTemplate.render(this,this):this.customCellView=bs.render(this,this);break;case void 0:case ce.rowHeader:case ce.default:this.columnDefinition.cellTemplate!==void 0?this.customCellView=this.columnDefinition.cellTemplate.render(this,this):this.customCellView=gs.render(this,this);break}}disconnectCellView(){this.customCellView!==null&&(this.customCellView.dispose(),this.customCellView=null)}};d([p({attribute:"cell-type"})],K.prototype,"cellType",void 0);d([p({attribute:"grid-column"})],K.prototype,"gridColumn",void 0);d([f],K.prototype,"rowData",void 0);d([f],K.prototype,"columnDefinition",void 0);function vs(o){let e=o.tagFor(K);return x`
    <${e}
        cell-type="${t=>t.isRowHeader?"rowheader":void 0}"
        grid-column="${(t,i)=>i.index+1}"
        :rowData="${(t,i)=>i.parent.rowData}"
        :columnDefinition="${t=>t}"
    ></${e}>
`}function xs(o){let e=o.tagFor(K);return x`
    <${e}
        cell-type="columnheader"
        grid-column="${(t,i)=>i.index+1}"
        :columnDefinition="${t=>t}"
    ></${e}>
`}var Dr=(o,e)=>{let t=vs(o),i=xs(o);return x`
        <template
            role="row"
            class="${r=>r.rowType!=="default"?r.rowType:""}"
            :defaultCellItemTemplate="${t}"
            :defaultHeaderCellItemTemplate="${i}"
            ${Ft({property:"cellElements",filter:pt('[role="cell"],[role="gridcell"],[role="columnheader"],[role="rowheader"]')})}
        >
            <slot ${G("slottedCellElements")}></slot>
        </template>
    `};var Ar=(o,e)=>x`
        <template
            tabindex="-1"
            role="${t=>!t.cellType||t.cellType==="default"?"gridcell":t.cellType}"
            class="
            ${t=>t.cellType==="columnheader"?"column-header":t.cellType==="rowheader"?"row-header":""}
            "
        >
            <slot></slot>
        </template>
    `;var Pr=(o,e)=>x`
    <template
        role="checkbox"
        aria-checked="${t=>t.checked}"
        aria-required="${t=>t.required}"
        aria-disabled="${t=>t.disabled}"
        aria-readonly="${t=>t.readOnly}"
        tabindex="${t=>t.disabled?null:0}"
        @keypress="${(t,i)=>t.keypressHandler(i.event)}"
        @click="${(t,i)=>t.clickHandler(i.event)}"
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
            <slot ${G("defaultSlottedNodes")}></slot>
        </label>
    </template>
`;var Lo=class extends C{},zt=class extends Er(Lo){constructor(){super(...arguments),this.proxy=document.createElement("input")}};var je=class extends zt{constructor(){super(),this.initialValue="on",this.indeterminate=!1,this.keypressHandler=e=>{if(!this.readOnly)switch(e.key){case Ie:this.indeterminate&&(this.indeterminate=!1),this.checked=!this.checked;break}},this.clickHandler=e=>{!this.disabled&&!this.readOnly&&(this.indeterminate&&(this.indeterminate=!1),this.checked=!this.checked)},this.proxy.setAttribute("type","checkbox")}readOnlyChanged(){this.proxy instanceof HTMLInputElement&&(this.proxy.readOnly=this.readOnly)}};d([p({attribute:"readonly",mode:"boolean"})],je.prototype,"readOnly",void 0);d([f],je.prototype,"defaultSlottedNodes",void 0);d([f],je.prototype,"indeterminate",void 0);function Mo(o){return pr(o)&&(o.getAttribute("role")==="option"||o instanceof HTMLOptionElement)}var ee=class extends C{constructor(e,t,i,r){super(),this.defaultSelected=!1,this.dirtySelected=!1,this.selected=this.defaultSelected,this.dirtyValue=!1,e&&(this.textContent=e),t&&(this.initialValue=t),i&&(this.defaultSelected=i),r&&(this.selected=r),this.proxy=new Option(`${this.textContent}`,this.initialValue,this.defaultSelected,this.selected),this.proxy.disabled=this.disabled}checkedChanged(e,t){if(typeof t=="boolean"){this.ariaChecked=t?"true":"false";return}this.ariaChecked=null}contentChanged(e,t){this.proxy instanceof HTMLOptionElement&&(this.proxy.textContent=this.textContent),this.$emit("contentchange",null,{bubbles:!0})}defaultSelectedChanged(){this.dirtySelected||(this.selected=this.defaultSelected,this.proxy instanceof HTMLOptionElement&&(this.proxy.selected=this.defaultSelected))}disabledChanged(e,t){this.ariaDisabled=this.disabled?"true":"false",this.proxy instanceof HTMLOptionElement&&(this.proxy.disabled=this.disabled)}selectedAttributeChanged(){this.defaultSelected=this.selectedAttribute,this.proxy instanceof HTMLOptionElement&&(this.proxy.defaultSelected=this.defaultSelected)}selectedChanged(){this.ariaSelected=this.selected?"true":"false",this.dirtySelected||(this.dirtySelected=!0),this.proxy instanceof HTMLOptionElement&&(this.proxy.selected=this.selected)}initialValueChanged(e,t){this.dirtyValue||(this.value=this.initialValue,this.dirtyValue=!1)}get label(){var e;return(e=this.value)!==null&&e!==void 0?e:this.text}get text(){var e,t;return(t=(e=this.textContent)===null||e===void 0?void 0:e.replace(/\s+/g," ").trim())!==null&&t!==void 0?t:""}set value(e){let t=`${e??""}`;this._value=t,this.dirtyValue=!0,this.proxy instanceof HTMLOptionElement&&(this.proxy.value=t),v.notify(this,"value")}get value(){var e;return v.track(this,"value"),(e=this._value)!==null&&e!==void 0?e:this.text}get form(){return this.proxy?this.proxy.form:null}};d([f],ee.prototype,"checked",void 0);d([f],ee.prototype,"content",void 0);d([f],ee.prototype,"defaultSelected",void 0);d([p({mode:"boolean"})],ee.prototype,"disabled",void 0);d([p({attribute:"selected",mode:"boolean"})],ee.prototype,"selectedAttribute",void 0);d([f],ee.prototype,"selected",void 0);d([p({attribute:"value",mode:"fromView"})],ee.prototype,"initialValue",void 0);var Ae=class{};d([f],Ae.prototype,"ariaChecked",void 0);d([f],Ae.prototype,"ariaPosInSet",void 0);d([f],Ae.prototype,"ariaSelected",void 0);d([f],Ae.prototype,"ariaSetSize",void 0);L(Ae,k);L(ee,J,Ae);var R=class extends C{constructor(){super(...arguments),this._options=[],this.selectedIndex=-1,this.selectedOptions=[],this.shouldSkipFocus=!1,this.typeaheadBuffer="",this.typeaheadExpired=!0,this.typeaheadTimeout=-1}get firstSelectedOption(){var e;return(e=this.selectedOptions[0])!==null&&e!==void 0?e:null}get hasSelectableOptions(){return this.options.length>0&&!this.options.every(e=>e.disabled)}get length(){var e,t;return(t=(e=this.options)===null||e===void 0?void 0:e.length)!==null&&t!==void 0?t:0}get options(){return v.track(this,"options"),this._options}set options(e){this._options=e,v.notify(this,"options")}get typeAheadExpired(){return this.typeaheadExpired}set typeAheadExpired(e){this.typeaheadExpired=e}clickHandler(e){let t=e.target.closest("option,[role=option]");if(t&&!t.disabled)return this.selectedIndex=this.options.indexOf(t),!0}focusAndScrollOptionIntoView(e=this.firstSelectedOption){this.contains(document.activeElement)&&e!==null&&(e.focus(),requestAnimationFrame(()=>{e.scrollIntoView({block:"nearest"})}))}focusinHandler(e){!this.shouldSkipFocus&&e.target===e.currentTarget&&(this.setSelectedOptions(),this.focusAndScrollOptionIntoView()),this.shouldSkipFocus=!1}getTypeaheadMatches(){let e=this.typeaheadBuffer.replace(/[.*+\-?^${}()|[\]\\]/g,"\\$&"),t=new RegExp(`^${e}`,"gi");return this.options.filter(i=>i.text.trim().match(t))}getSelectableIndex(e=this.selectedIndex,t){let i=e>t?-1:e<t?1:0,r=e+i,n=null;switch(i){case-1:{n=this.options.reduceRight((s,a,l)=>!s&&!a.disabled&&l<r?a:s,n);break}case 1:{n=this.options.reduce((s,a,l)=>!s&&!a.disabled&&l>r?a:s,n);break}}return this.options.indexOf(n)}handleChange(e,t){switch(t){case"selected":{R.slottedOptionFilter(e)&&(this.selectedIndex=this.options.indexOf(e)),this.setSelectedOptions();break}}}handleTypeAhead(e){this.typeaheadTimeout&&window.clearTimeout(this.typeaheadTimeout),this.typeaheadTimeout=window.setTimeout(()=>this.typeaheadExpired=!0,R.TYPE_AHEAD_TIMEOUT_MS),!(e.length>1)&&(this.typeaheadBuffer=`${this.typeaheadExpired?"":this.typeaheadBuffer}${e}`)}keydownHandler(e){if(this.disabled)return!0;this.shouldSkipFocus=!1;let t=e.key;switch(t){case ae:{e.shiftKey||(e.preventDefault(),this.selectFirstOption());break}case Se:{e.shiftKey||(e.preventDefault(),this.selectNextOption());break}case Te:{e.shiftKey||(e.preventDefault(),this.selectPreviousOption());break}case le:{e.preventDefault(),this.selectLastOption();break}case tt:return this.focusAndScrollOptionIntoView(),!0;case Oe:case Ee:return!0;case Ie:if(this.typeaheadExpired)return!0;default:return t.length===1&&this.handleTypeAhead(`${t}`),!0}}mousedownHandler(e){return this.shouldSkipFocus=!this.contains(document.activeElement),!0}multipleChanged(e,t){this.ariaMultiSelectable=t?"true":null}selectedIndexChanged(e,t){var i;if(!this.hasSelectableOptions){this.selectedIndex=-1;return}if(!((i=this.options[this.selectedIndex])===null||i===void 0)&&i.disabled&&typeof e=="number"){let r=this.getSelectableIndex(e,t),n=r>-1?r:e;this.selectedIndex=n,t===n&&this.selectedIndexChanged(t,n);return}this.setSelectedOptions()}selectedOptionsChanged(e,t){var i;let r=t.filter(R.slottedOptionFilter);(i=this.options)===null||i===void 0||i.forEach(n=>{let s=v.getNotifier(n);s.unsubscribe(this,"selected"),n.selected=r.includes(n),s.subscribe(this,"selected")})}selectFirstOption(){var e,t;this.disabled||(this.selectedIndex=(t=(e=this.options)===null||e===void 0?void 0:e.findIndex(i=>!i.disabled))!==null&&t!==void 0?t:-1)}selectLastOption(){this.disabled||(this.selectedIndex=ur(this.options,e=>!e.disabled))}selectNextOption(){!this.disabled&&this.selectedIndex<this.options.length-1&&(this.selectedIndex+=1)}selectPreviousOption(){!this.disabled&&this.selectedIndex>0&&(this.selectedIndex=this.selectedIndex-1)}setDefaultSelectedOption(){var e,t;this.selectedIndex=(t=(e=this.options)===null||e===void 0?void 0:e.findIndex(i=>i.defaultSelected))!==null&&t!==void 0?t:-1}setSelectedOptions(){var e,t,i;!((e=this.options)===null||e===void 0)&&e.length&&(this.selectedOptions=[this.options[this.selectedIndex]],this.ariaActiveDescendant=(i=(t=this.firstSelectedOption)===null||t===void 0?void 0:t.id)!==null&&i!==void 0?i:"",this.focusAndScrollOptionIntoView())}slottedOptionsChanged(e,t){this.options=t.reduce((r,n)=>(Mo(n)&&r.push(n),r),[]);let i=`${this.options.length}`;this.options.forEach((r,n)=>{r.id||(r.id=Nt("option-")),r.ariaPosInSet=`${n+1}`,r.ariaSetSize=i}),this.$fastController.isConnected&&(this.setSelectedOptions(),this.setDefaultSelectedOption())}typeaheadBufferChanged(e,t){if(this.$fastController.isConnected){let i=this.getTypeaheadMatches();if(i.length){let r=this.options.indexOf(i[0]);r>-1&&(this.selectedIndex=r)}this.typeaheadExpired=!1}}};R.slottedOptionFilter=o=>Mo(o)&&!o.hidden;R.TYPE_AHEAD_TIMEOUT_MS=1e3;d([p({mode:"boolean"})],R.prototype,"disabled",void 0);d([f],R.prototype,"selectedIndex",void 0);d([f],R.prototype,"selectedOptions",void 0);d([f],R.prototype,"slottedOptions",void 0);d([f],R.prototype,"typeaheadBuffer",void 0);var de=class{};d([f],de.prototype,"ariaActiveDescendant",void 0);d([f],de.prototype,"ariaDisabled",void 0);d([f],de.prototype,"ariaExpanded",void 0);d([f],de.prototype,"ariaMultiSelectable",void 0);L(de,k);L(R,de);var vt={above:"above",below:"below"};function xt(o){let e=o.parentElement;if(e)return e;{let t=o.getRootNode();if(t.host instanceof HTMLElement)return t.host}return null}function Fr(o,e){let t=e;for(;t!==null;){if(t===o)return!0;t=xt(t)}return!1}var ue=document.createElement("div");function ys(o){return o instanceof $e}var yt=class{setProperty(e,t){b.queueUpdate(()=>this.target.setProperty(e,t))}removeProperty(e){b.queueUpdate(()=>this.target.removeProperty(e))}},Ho=class extends yt{constructor(e){super();let t=new CSSStyleSheet;this.target=t.cssRules[t.insertRule(":host{}")].style,e.$fastController.addStyles(A.create([t]))}},No=class extends yt{constructor(){super();let e=new CSSStyleSheet;this.target=e.cssRules[e.insertRule(":root{}")].style,document.adoptedStyleSheets=[...document.adoptedStyleSheets,e]}},jo=class extends yt{constructor(){super(),this.style=document.createElement("style"),document.head.appendChild(this.style);let{sheet:e}=this.style;if(e){let t=e.insertRule(":root{}",e.cssRules.length);this.target=e.cssRules[t].style}}},Ut=class{constructor(e){this.store=new Map,this.target=null;let t=e.$fastController;this.style=document.createElement("style"),t.addStyles(this.style),v.getNotifier(t).subscribe(this,"isConnected"),this.handleChange(t,"isConnected")}targetChanged(){if(this.target!==null)for(let[e,t]of this.store.entries())this.target.setProperty(e,t)}setProperty(e,t){this.store.set(e,t),b.queueUpdate(()=>{this.target!==null&&this.target.setProperty(e,t)})}removeProperty(e){this.store.delete(e),b.queueUpdate(()=>{this.target!==null&&this.target.removeProperty(e)})}handleChange(e,t){let{sheet:i}=this.style;if(i){let r=i.insertRule(":host{}",i.cssRules.length);this.target=i.cssRules[r].style}else this.target=null}};d([f],Ut.prototype,"target",void 0);var zo=class{constructor(e){this.target=e.style}setProperty(e,t){b.queueUpdate(()=>this.target.setProperty(e,t))}removeProperty(e){b.queueUpdate(()=>this.target.removeProperty(e))}},P=class{setProperty(e,t){P.properties[e]=t;for(let i of P.roots.values())ze.getOrCreate(P.normalizeRoot(i)).setProperty(e,t)}removeProperty(e){delete P.properties[e];for(let t of P.roots.values())ze.getOrCreate(P.normalizeRoot(t)).removeProperty(e)}static registerRoot(e){let{roots:t}=P;if(!t.has(e)){t.add(e);let i=ze.getOrCreate(this.normalizeRoot(e));for(let r in P.properties)i.setProperty(r,P.properties[r])}}static unregisterRoot(e){let{roots:t}=P;if(t.has(e)){t.delete(e);let i=ze.getOrCreate(P.normalizeRoot(e));for(let r in P.properties)i.removeProperty(r)}}static normalizeRoot(e){return e===ue?document:e}};P.roots=new Set;P.properties={};var Vo=new WeakMap,ws=b.supportsAdoptedStyleSheets?Ho:Ut,ze=Object.freeze({getOrCreate(o){if(Vo.has(o))return Vo.get(o);let e;return o===ue?e=new P:o instanceof Document?e=b.supportsAdoptedStyleSheets?new No:new jo:ys(o)?e=new ws(o):e=new zo(o),Vo.set(o,e),e}});var V=class extends Be{constructor(e){super(),this.subscribers=new WeakMap,this._appliedTo=new Set,this.name=e.name,e.cssCustomPropertyName!==null&&(this.cssCustomProperty=`--${e.cssCustomPropertyName}`,this.cssVar=`var(${this.cssCustomProperty})`),this.id=V.uniqueId(),V.tokensById.set(this.id,this)}get appliedTo(){return[...this._appliedTo]}static from(e){return new V({name:typeof e=="string"?e:e.name,cssCustomPropertyName:typeof e=="string"?e:e.cssCustomPropertyName===void 0?e.name:e.cssCustomPropertyName})}static isCSSDesignToken(e){return typeof e.cssCustomProperty=="string"}static isDerivedDesignTokenValue(e){return typeof e=="function"}static getTokenById(e){return V.tokensById.get(e)}getOrCreateSubscriberSet(e=this){return this.subscribers.get(e)||this.subscribers.set(e,new Set)&&this.subscribers.get(e)}createCSS(){return this.cssVar||""}getValueFor(e){let t=E.getOrCreate(e).get(this);if(t!==void 0)return t;throw new Error(`Value could not be retrieved for token named "${this.name}". Ensure the value is set for ${e} or an ancestor of ${e}.`)}setValueFor(e,t){return this._appliedTo.add(e),t instanceof V&&(t=this.alias(t)),E.getOrCreate(e).set(this,t),this}deleteValueFor(e){return this._appliedTo.delete(e),E.existsFor(e)&&E.getOrCreate(e).delete(this),this}withDefault(e){return this.setValueFor(ue,e),this}subscribe(e,t){let i=this.getOrCreateSubscriberSet(t);t&&!E.existsFor(t)&&E.getOrCreate(t),i.has(e)||i.add(e)}unsubscribe(e,t){let i=this.subscribers.get(t||this);i&&i.has(e)&&i.delete(e)}notify(e){let t=Object.freeze({token:this,target:e});this.subscribers.has(this)&&this.subscribers.get(this).forEach(i=>i.handleChange(t)),this.subscribers.has(e)&&this.subscribers.get(e).forEach(i=>i.handleChange(t))}alias(e){return t=>e.getValueFor(t)}};V.uniqueId=(()=>{let o=0;return()=>(o++,o.toString(16))})();V.tokensById=new Map;var Uo=class{startReflection(e,t){e.subscribe(this,t),this.handleChange({token:e,target:t})}stopReflection(e,t){e.unsubscribe(this,t),this.remove(e,t)}handleChange(e){let{token:t,target:i}=e;this.add(t,i)}add(e,t){ze.getOrCreate(t).setProperty(e.cssCustomProperty,this.resolveCSSValue(E.getOrCreate(t).get(e)))}remove(e,t){ze.getOrCreate(t).removeProperty(e.cssCustomProperty)}resolveCSSValue(e){return e&&typeof e.createCSS=="function"?e.createCSS():e}},qo=class{constructor(e,t,i){this.source=e,this.token=t,this.node=i,this.dependencies=new Set,this.observer=v.binding(e,this,!1),this.observer.handleChange=this.observer.call,this.handleChange()}disconnect(){this.observer.disconnect()}handleChange(){this.node.store.set(this.token,this.observer.observe(this.node.target,we))}},Go=class{constructor(){this.values=new Map}set(e,t){this.values.get(e)!==t&&(this.values.set(e,t),v.getNotifier(this).notify(e.id))}get(e){return v.track(this,e.id),this.values.get(e)}delete(e){this.values.delete(e)}all(){return this.values.entries()}},wt=new WeakMap,Ct=new WeakMap,E=class{constructor(e){this.target=e,this.store=new Go,this.children=[],this.assignedValues=new Map,this.reflecting=new Set,this.bindingObservers=new Map,this.tokenValueChangeHandler={handleChange:(t,i)=>{let r=V.getTokenById(i);if(r&&(r.notify(this.target),V.isCSSDesignToken(r))){let n=this.parent,s=this.isReflecting(r);if(n){let a=n.get(r),l=t.get(r);a!==l&&!s?this.reflectToCSS(r):a===l&&s&&this.stopReflectToCSS(r)}else s||this.reflectToCSS(r)}}},wt.set(e,this),v.getNotifier(this.store).subscribe(this.tokenValueChangeHandler),e instanceof $e?e.$fastController.addBehaviors([this]):e.isConnected&&this.bind()}static getOrCreate(e){return wt.get(e)||new E(e)}static existsFor(e){return wt.has(e)}static findParent(e){if(ue!==e.target){let t=xt(e.target);for(;t!==null;){if(wt.has(t))return wt.get(t);t=xt(t)}return E.getOrCreate(ue)}return null}static findClosestAssignedNode(e,t){let i=t;do{if(i.has(e))return i;i=i.parent?i.parent:i.target!==ue?E.getOrCreate(ue):null}while(i!==null);return null}get parent(){return Ct.get(this)||null}has(e){return this.assignedValues.has(e)}get(e){let t=this.store.get(e);if(t!==void 0)return t;let i=this.getRaw(e);if(i!==void 0)return this.hydrate(e,i),this.get(e)}getRaw(e){var t;return this.assignedValues.has(e)?this.assignedValues.get(e):(t=E.findClosestAssignedNode(e,this))===null||t===void 0?void 0:t.getRaw(e)}set(e,t){V.isDerivedDesignTokenValue(this.assignedValues.get(e))&&this.tearDownBindingObserver(e),this.assignedValues.set(e,t),V.isDerivedDesignTokenValue(t)?this.setupBindingObserver(e,t):this.store.set(e,t)}delete(e){this.assignedValues.delete(e),this.tearDownBindingObserver(e);let t=this.getRaw(e);t?this.hydrate(e,t):this.store.delete(e)}bind(){let e=E.findParent(this);e&&e.appendChild(this);for(let t of this.assignedValues.keys())t.notify(this.target)}unbind(){this.parent&&Ct.get(this).removeChild(this)}appendChild(e){e.parent&&Ct.get(e).removeChild(e);let t=this.children.filter(i=>e.contains(i));Ct.set(e,this),this.children.push(e),t.forEach(i=>e.appendChild(i)),v.getNotifier(this.store).subscribe(e);for(let[i,r]of this.store.all())e.hydrate(i,this.bindingObservers.has(i)?this.getRaw(i):r)}removeChild(e){let t=this.children.indexOf(e);return t!==-1&&this.children.splice(t,1),v.getNotifier(this.store).unsubscribe(e),e.parent===this?Ct.delete(e):!1}contains(e){return Fr(this.target,e.target)}reflectToCSS(e){this.isReflecting(e)||(this.reflecting.add(e),E.cssCustomPropertyReflector.startReflection(e,this.target))}stopReflectToCSS(e){this.isReflecting(e)&&(this.reflecting.delete(e),E.cssCustomPropertyReflector.stopReflection(e,this.target))}isReflecting(e){return this.reflecting.has(e)}handleChange(e,t){let i=V.getTokenById(t);i&&this.hydrate(i,this.getRaw(i))}hydrate(e,t){if(!this.has(e)){let i=this.bindingObservers.get(e);V.isDerivedDesignTokenValue(t)?i?i.source!==t&&(this.tearDownBindingObserver(e),this.setupBindingObserver(e,t)):this.setupBindingObserver(e,t):(i&&this.tearDownBindingObserver(e),this.store.set(e,t))}}setupBindingObserver(e,t){let i=new qo(t,e,this);return this.bindingObservers.set(e,i),i}tearDownBindingObserver(e){return this.bindingObservers.has(e)?(this.bindingObservers.get(e).disconnect(),this.bindingObservers.delete(e),!0):!1}};E.cssCustomPropertyReflector=new Uo;d([f],E.prototype,"children",void 0);function Cs(o){return V.from(o)}var kt=Object.freeze({create:Cs,notifyConnection(o){return!o.isConnected||!E.existsFor(o)?!1:(E.getOrCreate(o).bind(),!0)},notifyDisconnection(o){return o.isConnected||!E.existsFor(o)?!1:(E.getOrCreate(o).unbind(),!0)},registerRoot(o=ue){P.registerRoot(o)},unregisterRoot(o=ue){P.unregisterRoot(o)}});var Wo=Object.freeze({definitionCallbackOnly:null,ignoreDuplicate:Symbol()}),Qo=new Map,qt=new Map,rt=null,$t=T.createInterface(o=>o.cachedCallback(e=>(rt===null&&(rt=new Gt(null,e)),rt))),Zo=Object.freeze({tagFor(o){return qt.get(o)},responsibleFor(o){let e=o.$$designSystem$$;return e||T.findResponsibleContainer(o).get($t)},getOrCreate(o){if(!o)return rt===null&&(rt=T.getOrCreateDOMContainer().get($t)),rt;let e=o.$$designSystem$$;if(e)return e;let t=T.getOrCreateDOMContainer(o);if(t.has($t,!1))return t.get($t);{let i=new Gt(o,t);return t.register(Me.instance($t,i)),i}}});function ks(o,e,t){return typeof o=="string"?{name:o,type:e,callback:t}:o}var Gt=class{constructor(e,t){this.owner=e,this.container=t,this.designTokensInitialized=!1,this.prefix="fast",this.shadowRootMode=void 0,this.disambiguate=()=>Wo.definitionCallbackOnly,e!==null&&(e.$$designSystem$$=this)}withPrefix(e){return this.prefix=e,this}withShadowRootMode(e){return this.shadowRootMode=e,this}withElementDisambiguation(e){return this.disambiguate=e,this}withDesignTokenRoot(e){return this.designTokenRoot=e,this}register(...e){let t=this.container,i=[],r=this.disambiguate,n=this.shadowRootMode,s={elementPrefix:this.prefix,tryDefineElement(a,l,c){let u=ks(a,l,c),{name:h,callback:g,baseClass:$}=u,{type:S}=u,M=h,te=Qo.get(M),ct=!0;for(;te;){let ve=r(M,S,te);switch(ve){case Wo.ignoreDuplicate:return;case Wo.definitionCallbackOnly:ct=!1,te=void 0;break;default:M=ve,te=Qo.get(M);break}}ct&&((qt.has(S)||S===C)&&(S=class extends S{}),Qo.set(M,S),qt.set(S,M),$&&qt.set($,M)),i.push(new Xo(t,M,S,n,g,ct))}};this.designTokensInitialized||(this.designTokensInitialized=!0,this.designTokenRoot!==null&&kt.registerRoot(this.designTokenRoot)),t.registerWithContext(s,...e);for(let a of i)a.callback(a),a.willDefine&&a.definition!==null&&a.definition.define();return this}},Xo=class{constructor(e,t,i,r,n,s){this.container=e,this.name=t,this.type=i,this.shadowRootMode=r,this.callback=n,this.willDefine=s,this.definition=null}definePresentation(e){Ht.define(this.name,e,this.container)}defineElement(e){this.definition=new re(this.type,Object.assign(Object.assign({},e),{name:this.name}))}tagFor(e){return Zo.tagFor(e)}};var Rr=(o,e)=>x`
    <template role="${t=>t.role}" aria-orientation="${t=>t.orientation}"></template>
`;var Yo={separator:"separator",presentation:"presentation"};var nt=class extends C{constructor(){super(...arguments),this.role=Yo.separator,this.orientation=dr.horizontal}};d([p],nt.prototype,"role",void 0);d([p],nt.prototype,"orientation",void 0);var _r=(o,e)=>x`
    <template
        aria-checked="${t=>t.ariaChecked}"
        aria-disabled="${t=>t.ariaDisabled}"
        aria-posinset="${t=>t.ariaPosInSet}"
        aria-selected="${t=>t.ariaSelected}"
        aria-setsize="${t=>t.ariaSetSize}"
        class="${t=>[t.checked&&"checked",t.selected&&"selected",t.disabled&&"disabled"].filter(Boolean).join(" ")}"
        role="option"
    >
        ${se(o,e)}
        <span class="content" part="content">
            <slot ${G("content")}></slot>
        </span>
        ${ne(o,e)}
    </template>
`;var Ue=class extends R{constructor(){super(...arguments),this.activeIndex=-1,this.rangeStartIndex=-1}get activeOption(){return this.options[this.activeIndex]}get checkedOptions(){var e;return(e=this.options)===null||e===void 0?void 0:e.filter(t=>t.checked)}get firstSelectedOptionIndex(){return this.options.indexOf(this.firstSelectedOption)}activeIndexChanged(e,t){var i,r;this.ariaActiveDescendant=(r=(i=this.options[t])===null||i===void 0?void 0:i.id)!==null&&r!==void 0?r:"",this.focusAndScrollOptionIntoView()}checkActiveIndex(){if(!this.multiple)return;let e=this.activeOption;e&&(e.checked=!0)}checkFirstOption(e=!1){e?(this.rangeStartIndex===-1&&(this.rangeStartIndex=this.activeIndex+1),this.options.forEach((t,i)=>{t.checked=gt(i,this.rangeStartIndex)})):this.uncheckAllOptions(),this.activeIndex=0,this.checkActiveIndex()}checkLastOption(e=!1){e?(this.rangeStartIndex===-1&&(this.rangeStartIndex=this.activeIndex),this.options.forEach((t,i)=>{t.checked=gt(i,this.rangeStartIndex,this.options.length)})):this.uncheckAllOptions(),this.activeIndex=this.options.length-1,this.checkActiveIndex()}connectedCallback(){super.connectedCallback(),this.addEventListener("focusout",this.focusoutHandler)}disconnectedCallback(){this.removeEventListener("focusout",this.focusoutHandler),super.disconnectedCallback()}checkNextOption(e=!1){e?(this.rangeStartIndex===-1&&(this.rangeStartIndex=this.activeIndex),this.options.forEach((t,i)=>{t.checked=gt(i,this.rangeStartIndex,this.activeIndex+1)})):this.uncheckAllOptions(),this.activeIndex+=this.activeIndex<this.options.length-1?1:0,this.checkActiveIndex()}checkPreviousOption(e=!1){e?(this.rangeStartIndex===-1&&(this.rangeStartIndex=this.activeIndex),this.checkedOptions.length===1&&(this.rangeStartIndex+=1),this.options.forEach((t,i)=>{t.checked=gt(i,this.activeIndex,this.rangeStartIndex)})):this.uncheckAllOptions(),this.activeIndex-=this.activeIndex>0?1:0,this.checkActiveIndex()}clickHandler(e){var t;if(!this.multiple)return super.clickHandler(e);let i=(t=e.target)===null||t===void 0?void 0:t.closest("[role=option]");if(!(!i||i.disabled))return this.uncheckAllOptions(),this.activeIndex=this.options.indexOf(i),this.checkActiveIndex(),this.toggleSelectedForAllCheckedOptions(),!0}focusAndScrollOptionIntoView(){super.focusAndScrollOptionIntoView(this.activeOption)}focusinHandler(e){if(!this.multiple)return super.focusinHandler(e);!this.shouldSkipFocus&&e.target===e.currentTarget&&(this.uncheckAllOptions(),this.activeIndex===-1&&(this.activeIndex=this.firstSelectedOptionIndex!==-1?this.firstSelectedOptionIndex:0),this.checkActiveIndex(),this.setSelectedOptions(),this.focusAndScrollOptionIntoView()),this.shouldSkipFocus=!1}focusoutHandler(e){this.multiple&&this.uncheckAllOptions()}keydownHandler(e){if(!this.multiple)return super.keydownHandler(e);if(this.disabled)return!0;let{key:t,shiftKey:i}=e;switch(this.shouldSkipFocus=!1,t){case ae:{this.checkFirstOption(i);return}case Se:{this.checkNextOption(i);return}case Te:{this.checkPreviousOption(i);return}case le:{this.checkLastOption(i);return}case tt:return this.focusAndScrollOptionIntoView(),!0;case Ee:return this.uncheckAllOptions(),this.checkActiveIndex(),!0;case Ie:if(e.preventDefault(),this.typeAheadExpired){this.toggleSelectedForAllCheckedOptions();return}default:return t.length===1&&this.handleTypeAhead(`${t}`),!0}}mousedownHandler(e){if(e.offsetX>=0&&e.offsetX<=this.scrollWidth)return super.mousedownHandler(e)}multipleChanged(e,t){var i;this.ariaMultiSelectable=t?"true":null,(i=this.options)===null||i===void 0||i.forEach(r=>{r.checked=t?!1:void 0}),this.setSelectedOptions()}setSelectedOptions(){if(!this.multiple){super.setSelectedOptions();return}this.$fastController.isConnected&&this.options&&(this.selectedOptions=this.options.filter(e=>e.selected),this.focusAndScrollOptionIntoView())}sizeChanged(e,t){var i;let r=Math.max(0,parseInt((i=t?.toFixed())!==null&&i!==void 0?i:"",10));r!==t&&b.queueUpdate(()=>{this.size=r})}toggleSelectedForAllCheckedOptions(){let e=this.checkedOptions.filter(i=>!i.disabled),t=!e.every(i=>i.selected);e.forEach(i=>i.selected=t),this.selectedIndex=this.options.indexOf(e[e.length-1]),this.setSelectedOptions()}typeaheadBufferChanged(e,t){if(!this.multiple){super.typeaheadBufferChanged(e,t);return}if(this.$fastController.isConnected){let i=this.getTypeaheadMatches(),r=this.options.indexOf(i[0]);r>-1&&(this.activeIndex=r,this.uncheckAllOptions(),this.checkActiveIndex()),this.typeAheadExpired=!1}}uncheckAllOptions(e=!1){this.options.forEach(t=>t.checked=this.multiple?!1:void 0),e||(this.rangeStartIndex=-1)}};d([f],Ue.prototype,"activeIndex",void 0);d([p({mode:"boolean"})],Ue.prototype,"multiple",void 0);d([p({converter:Ye})],Ue.prototype,"size",void 0);var Jo=class extends C{},Wt=class extends Ne(Jo){constructor(){super(...arguments),this.proxy=document.createElement("input")}};var Ko={email:"email",password:"password",tel:"tel",text:"text",url:"url"};var N=class extends Wt{constructor(){super(...arguments),this.type=Ko.text}readOnlyChanged(){this.proxy instanceof HTMLInputElement&&(this.proxy.readOnly=this.readOnly,this.validate())}autofocusChanged(){this.proxy instanceof HTMLInputElement&&(this.proxy.autofocus=this.autofocus,this.validate())}placeholderChanged(){this.proxy instanceof HTMLInputElement&&(this.proxy.placeholder=this.placeholder)}typeChanged(){this.proxy instanceof HTMLInputElement&&(this.proxy.type=this.type,this.validate())}listChanged(){this.proxy instanceof HTMLInputElement&&(this.proxy.setAttribute("list",this.list),this.validate())}maxlengthChanged(){this.proxy instanceof HTMLInputElement&&(this.proxy.maxLength=this.maxlength,this.validate())}minlengthChanged(){this.proxy instanceof HTMLInputElement&&(this.proxy.minLength=this.minlength,this.validate())}patternChanged(){this.proxy instanceof HTMLInputElement&&(this.proxy.pattern=this.pattern,this.validate())}sizeChanged(){this.proxy instanceof HTMLInputElement&&(this.proxy.size=this.size)}spellcheckChanged(){this.proxy instanceof HTMLInputElement&&(this.proxy.spellcheck=this.spellcheck)}connectedCallback(){super.connectedCallback(),this.proxy.setAttribute("type",this.type),this.validate(),this.autofocus&&b.queueUpdate(()=>{this.focus()})}select(){this.control.select(),this.$emit("select")}handleTextInput(){this.value=this.control.value}handleChange(){this.$emit("change")}validate(){super.validate(this.control)}};d([p({attribute:"readonly",mode:"boolean"})],N.prototype,"readOnly",void 0);d([p({mode:"boolean"})],N.prototype,"autofocus",void 0);d([p],N.prototype,"placeholder",void 0);d([p],N.prototype,"type",void 0);d([p],N.prototype,"list",void 0);d([p({converter:Ye})],N.prototype,"maxlength",void 0);d([p({converter:Ye})],N.prototype,"minlength",void 0);d([p],N.prototype,"pattern",void 0);d([p({converter:Ye})],N.prototype,"size",void 0);d([p({mode:"boolean"})],N.prototype,"spellcheck",void 0);d([f],N.prototype,"defaultSlottedNodes",void 0);var Qt=class{};L(Qt,k);L(N,J,Qt);function Br(o,e,t){return o.nodeType!==Node.TEXT_NODE?!0:typeof o.nodeValue=="string"&&!!o.nodeValue.trim().length}var ei=class extends Ue{},Xt=class extends Ne(ei){constructor(){super(...arguments),this.proxy=document.createElement("select")}};var oe=class extends Xt{constructor(){super(...arguments),this.open=!1,this.forcedPosition=!1,this.listboxId=Nt("listbox-"),this.maxHeight=0}openChanged(e,t){if(this.collapsible){if(this.open){this.ariaControls=this.listboxId,this.ariaExpanded="true",this.setPositioning(),this.focusAndScrollOptionIntoView(),this.indexWhenOpened=this.selectedIndex,b.queueUpdate(()=>this.focus());return}this.ariaControls="",this.ariaExpanded="false"}}get collapsible(){return!(this.multiple||typeof this.size=="number")}get value(){return v.track(this,"value"),this._value}set value(e){var t,i,r,n,s,a,l;let c=`${this._value}`;if(!((t=this._options)===null||t===void 0)&&t.length){let u=this._options.findIndex($=>$.value===e),h=(r=(i=this._options[this.selectedIndex])===null||i===void 0?void 0:i.value)!==null&&r!==void 0?r:null,g=(s=(n=this._options[u])===null||n===void 0?void 0:n.value)!==null&&s!==void 0?s:null;(u===-1||h!==g)&&(e="",this.selectedIndex=u),e=(l=(a=this.firstSelectedOption)===null||a===void 0?void 0:a.value)!==null&&l!==void 0?l:e}c!==e&&(this._value=e,super.valueChanged(c,e),v.notify(this,"value"),this.updateDisplayValue())}updateValue(e){var t,i;this.$fastController.isConnected&&(this.value=(i=(t=this.firstSelectedOption)===null||t===void 0?void 0:t.value)!==null&&i!==void 0?i:""),e&&(this.$emit("input"),this.$emit("change",this,{bubbles:!0,composed:void 0}))}selectedIndexChanged(e,t){super.selectedIndexChanged(e,t),this.updateValue()}positionChanged(e,t){this.positionAttribute=t,this.setPositioning()}setPositioning(){let e=this.getBoundingClientRect(),i=window.innerHeight-e.bottom;this.position=this.forcedPosition?this.positionAttribute:e.top>i?vt.above:vt.below,this.positionAttribute=this.forcedPosition?this.positionAttribute:this.position,this.maxHeight=this.position===vt.above?~~e.top:~~i}get displayValue(){var e,t;return v.track(this,"displayValue"),(t=(e=this.firstSelectedOption)===null||e===void 0?void 0:e.text)!==null&&t!==void 0?t:""}disabledChanged(e,t){super.disabledChanged&&super.disabledChanged(e,t),this.ariaDisabled=this.disabled?"true":"false"}formResetCallback(){this.setProxyOptions(),super.setDefaultSelectedOption(),this.selectedIndex===-1&&(this.selectedIndex=0)}clickHandler(e){if(!this.disabled){if(this.open){let t=e.target.closest("option,[role=option]");if(t&&t.disabled)return}return super.clickHandler(e),this.open=this.collapsible&&!this.open,!this.open&&this.indexWhenOpened!==this.selectedIndex&&this.updateValue(!0),!0}}focusoutHandler(e){var t;if(super.focusoutHandler(e),!this.open)return!0;let i=e.relatedTarget;if(this.isSameNode(i)){this.focus();return}!((t=this.options)===null||t===void 0)&&t.includes(i)||(this.open=!1,this.indexWhenOpened!==this.selectedIndex&&this.updateValue(!0))}handleChange(e,t){super.handleChange(e,t),t==="value"&&this.updateValue()}slottedOptionsChanged(e,t){this.options.forEach(i=>{v.getNotifier(i).unsubscribe(this,"value")}),super.slottedOptionsChanged(e,t),this.options.forEach(i=>{v.getNotifier(i).subscribe(this,"value")}),this.setProxyOptions(),this.updateValue()}mousedownHandler(e){var t;return e.offsetX>=0&&e.offsetX<=((t=this.listbox)===null||t===void 0?void 0:t.scrollWidth)?super.mousedownHandler(e):this.collapsible}multipleChanged(e,t){super.multipleChanged(e,t),this.proxy&&(this.proxy.multiple=t)}selectedOptionsChanged(e,t){var i;super.selectedOptionsChanged(e,t),(i=this.options)===null||i===void 0||i.forEach((r,n)=>{var s;let a=(s=this.proxy)===null||s===void 0?void 0:s.options.item(n);a&&(a.selected=r.selected)})}setDefaultSelectedOption(){var e;let t=(e=this.options)!==null&&e!==void 0?e:Array.from(this.children).filter(R.slottedOptionFilter),i=t?.findIndex(r=>r.hasAttribute("selected")||r.selected||r.value===this.value);if(i!==-1){this.selectedIndex=i;return}this.selectedIndex=0}setProxyOptions(){this.proxy instanceof HTMLSelectElement&&this.options&&(this.proxy.options.length=0,this.options.forEach(e=>{let t=e.proxy||(e instanceof HTMLOptionElement?e.cloneNode():null);t&&this.proxy.options.add(t)}))}keydownHandler(e){super.keydownHandler(e);let t=e.key||e.key.charCodeAt(0);switch(t){case Ie:{e.preventDefault(),this.collapsible&&this.typeAheadExpired&&(this.open=!this.open);break}case ae:case le:{e.preventDefault();break}case Oe:{e.preventDefault(),this.open=!this.open;break}case Ee:{this.collapsible&&this.open&&(e.preventDefault(),this.open=!1);break}case tt:return this.collapsible&&this.open&&(e.preventDefault(),this.open=!1),!0}return!this.open&&this.indexWhenOpened!==this.selectedIndex&&(this.updateValue(!0),this.indexWhenOpened=this.selectedIndex),!(t===Se||t===Te)}connectedCallback(){super.connectedCallback(),this.forcedPosition=!!this.positionAttribute,this.addEventListener("contentchange",this.updateDisplayValue)}disconnectedCallback(){this.removeEventListener("contentchange",this.updateDisplayValue),super.disconnectedCallback()}sizeChanged(e,t){super.sizeChanged(e,t),this.proxy&&(this.proxy.size=t)}updateDisplayValue(){this.collapsible&&v.notify(this,"displayValue")}};d([p({attribute:"open",mode:"boolean"})],oe.prototype,"open",void 0);d([Pi],oe.prototype,"collapsible",null);d([f],oe.prototype,"control",void 0);d([p({attribute:"position"})],oe.prototype,"positionAttribute",void 0);d([f],oe.prototype,"position",void 0);d([f],oe.prototype,"maxHeight",void 0);var St=class{};d([f],St.prototype,"ariaControls",void 0);L(St,de);L(oe,J,St);var Lr=(o,e)=>x`
    <template
        class="${t=>[t.collapsible&&"collapsible",t.collapsible&&t.open&&"open",t.disabled&&"disabled",t.collapsible&&t.position].filter(Boolean).join(" ")}"
        aria-activedescendant="${t=>t.ariaActiveDescendant}"
        aria-controls="${t=>t.ariaControls}"
        aria-disabled="${t=>t.ariaDisabled}"
        aria-expanded="${t=>t.ariaExpanded}"
        aria-haspopup="${t=>t.collapsible?"listbox":null}"
        aria-multiselectable="${t=>t.ariaMultiSelectable}"
        ?open="${t=>t.open}"
        role="combobox"
        tabindex="${t=>t.disabled?null:"0"}"
        @click="${(t,i)=>t.clickHandler(i.event)}"
        @focusin="${(t,i)=>t.focusinHandler(i.event)}"
        @focusout="${(t,i)=>t.focusoutHandler(i.event)}"
        @keydown="${(t,i)=>t.keydownHandler(i.event)}"
        @mousedown="${(t,i)=>t.mousedownHandler(i.event)}"
    >
        ${Zi(t=>t.collapsible,x`
                <div
                    class="control"
                    part="control"
                    ?disabled="${t=>t.disabled}"
                    ${B("control")}
                >
                    ${se(o,e)}
                    <slot name="button-container">
                        <div class="selected-value" part="selected-value">
                            <slot name="selected-value">${t=>t.displayValue}</slot>
                        </div>
                        <div aria-hidden="true" class="indicator" part="indicator">
                            <slot name="indicator">
                                ${e.indicator||""}
                            </slot>
                        </div>
                    </slot>
                    ${ne(o,e)}
                </div>
            `)}
        <div
            class="listbox"
            id="${t=>t.listboxId}"
            part="listbox"
            role="listbox"
            ?disabled="${t=>t.disabled}"
            ?hidden="${t=>t.collapsible?!t.open:!1}"
            ${B("listbox")}
        >
            <slot
                ${G({filter:R.slottedOptionFilter,flatten:!0,property:"slottedOptions"})}
            ></slot>
        </div>
    </template>
`;var Mr=(o,e)=>x`
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
                ${G({property:"defaultSlottedNodes",filter:Br})}
            ></slot>
        </label>
        <div class="root" part="root">
            ${se(o,e)}
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
                ${B("control")}
            />
            ${ne(o,e)}
        </div>
    </template>
`;var ie="not-allowed";var $s=":host([hidden]){display:none}";function j(o){return`${$s}:host{display:${o}}`}var _=fr()?"focus-visible":"focus";function Vr(o){return Zo.getOrCreate(o).withPrefix("vscode")}function Nr(o){window.addEventListener("load",()=>{new MutationObserver(()=>{Hr(o)}).observe(document.body,{attributes:!0,attributeFilter:["class"]}),Hr(o)})}function Hr(o){let e=getComputedStyle(document.body),t=document.querySelector("body");if(t){let i=t.getAttribute("data-vscode-theme-kind");for(let[r,n]of o){let s=e.getPropertyValue(r).toString();if(i==="vscode-high-contrast")s.length===0&&n.name.includes("background")&&(s="transparent"),n.name==="button-icon-hover-background"&&(s="transparent");else if(i==="vscode-high-contrast-light"){if(s.length===0&&n.name.includes("background"))switch(n.name){case"button-primary-hover-background":s="#0F4A85";break;case"button-secondary-hover-background":s="transparent";break;case"button-icon-hover-background":s="transparent";break}}else n.name==="contrast-active-border"&&(s="transparent");n.setValueFor(t,s)}}}var jr=new Map,zr=!1;function m(o,e){let t=kt.create(o);if(e){if(e.includes("--fake-vscode-token")){let i="id"+Math.random().toString(16).slice(2);e=`${e}-${i}`}jr.set(e,t)}return zr||(Nr(jr),zr=!0),t}var Ur=m("background","--vscode-editor-background").withDefault("#1e1e1e"),y=m("border-width").withDefault(1),Zt=m("contrast-active-border","--vscode-contrastActiveBorder").withDefault("#f38518"),dp=m("contrast-border","--vscode-contrastBorder").withDefault("#6fc3df"),st=m("corner-radius").withDefault(0),Pe=m("corner-radius-round").withDefault(2),w=m("design-unit").withDefault(4),he=m("disabled-opacity").withDefault(.4),D=m("focus-border","--vscode-focusBorder").withDefault("#007fd4"),X=m("font-family","--vscode-font-family").withDefault("-apple-system, BlinkMacSystemFont, Segoe UI, Roboto, Helvetica, Arial, sans-serif, Apple Color Emoji, Segoe UI Emoji, Segoe UI Symbol"),up=m("font-weight","--vscode-font-weight").withDefault("400"),H=m("foreground","--vscode-foreground").withDefault("#cccccc"),at=m("input-height").withDefault("26"),Yt=m("input-min-width").withDefault("100px"),U=m("type-ramp-base-font-size","--vscode-font-size").withDefault("13px"),q=m("type-ramp-base-line-height").withDefault("normal"),qr=m("type-ramp-minus1-font-size").withDefault("11px"),Gr=m("type-ramp-minus1-line-height").withDefault("16px"),hp=m("type-ramp-minus2-font-size").withDefault("9px"),pp=m("type-ramp-minus2-line-height").withDefault("16px"),fp=m("type-ramp-plus1-font-size").withDefault("16px"),mp=m("type-ramp-plus1-line-height").withDefault("24px"),gp=m("scrollbarWidth").withDefault("10px"),bp=m("scrollbarHeight").withDefault("10px"),vp=m("scrollbar-slider-background","--vscode-scrollbarSlider-background").withDefault("#79797966"),xp=m("scrollbar-slider-hover-background","--vscode-scrollbarSlider-hoverBackground").withDefault("#646464b3"),yp=m("scrollbar-slider-active-background","--vscode-scrollbarSlider-activeBackground").withDefault("#bfbfbf66"),Wr=m("badge-background","--vscode-badge-background").withDefault("#4d4d4d"),Qr=m("badge-foreground","--vscode-badge-foreground").withDefault("#ffffff"),Jt=m("button-border","--vscode-button-border").withDefault("transparent"),ti=m("button-icon-background").withDefault("transparent"),Xr=m("button-icon-corner-radius").withDefault("5px"),Zr=m("button-icon-outline-offset").withDefault(0),oi=m("button-icon-hover-background","--fake-vscode-token").withDefault("rgba(90, 93, 94, 0.31)"),Yr=m("button-icon-padding").withDefault("3px"),qe=m("button-primary-background","--vscode-button-background").withDefault("#0e639c"),ii=m("button-primary-foreground","--vscode-button-foreground").withDefault("#ffffff"),ri=m("button-primary-hover-background","--vscode-button-hoverBackground").withDefault("#1177bb"),Kt=m("button-secondary-background","--vscode-button-secondaryBackground").withDefault("#3a3d41"),Jr=m("button-secondary-foreground","--vscode-button-secondaryForeground").withDefault("#ffffff"),Kr=m("button-secondary-hover-background","--vscode-button-secondaryHoverBackground").withDefault("#45494e"),en=m("button-padding-horizontal").withDefault("11px"),tn=m("button-padding-vertical").withDefault("4px"),eo=m("checkbox-background","--vscode-checkbox-background").withDefault("#3c3c3c"),ni=m("checkbox-border","--vscode-checkbox-border").withDefault("#3c3c3c"),on=m("checkbox-corner-radius").withDefault(3),wp=m("checkbox-foreground","--vscode-checkbox-foreground").withDefault("#f0f0f0"),pe=m("list-active-selection-background","--vscode-list-activeSelectionBackground").withDefault("#094771"),be=m("list-active-selection-foreground","--vscode-list-activeSelectionForeground").withDefault("#ffffff"),rn=m("list-hover-background","--vscode-list-hoverBackground").withDefault("#2a2d2e"),nn=m("divider-background","--vscode-settings-dropdownListBorder").withDefault("#454545"),Tt=m("dropdown-background","--vscode-dropdown-background").withDefault("#3c3c3c"),Ge=m("dropdown-border","--vscode-dropdown-border").withDefault("#3c3c3c"),Cp=m("dropdown-foreground","--vscode-dropdown-foreground").withDefault("#f0f0f0"),sn=m("dropdown-list-max-height").withDefault("200px"),to=m("input-background","--vscode-input-background").withDefault("#3c3c3c"),an=m("input-foreground","--vscode-input-foreground").withDefault("#cccccc"),kp=m("input-placeholder-foreground","--vscode-input-placeholderForeground").withDefault("#cccccc"),si=m("link-active-foreground","--vscode-textLink-activeForeground").withDefault("#3794ff"),ln=m("link-foreground","--vscode-textLink-foreground").withDefault("#3794ff"),$p=m("progress-background","--vscode-progressBar-background").withDefault("#0e70c0"),Sp=m("panel-tab-active-border","--vscode-panelTitle-activeBorder").withDefault("#e7e7e7"),Tp=m("panel-tab-active-foreground","--vscode-panelTitle-activeForeground").withDefault("#e7e7e7"),Op=m("panel-tab-foreground","--vscode-panelTitle-inactiveForeground").withDefault("#e7e7e799"),Ep=m("panel-view-background","--vscode-panel-background").withDefault("#1e1e1e"),Ip=m("panel-view-border","--vscode-panel-border").withDefault("#80808059"),cn=m("tag-corner-radius").withDefault("2px");function dn(o,e,t,i){var r=arguments.length,n=r<3?e:i===null?i=Object.getOwnPropertyDescriptor(e,t):i,s;if(typeof Reflect=="object"&&typeof Reflect.decorate=="function")n=Reflect.decorate(o,e,t,i);else for(var a=o.length-1;a>=0;a--)(s=o[a])&&(n=(r<3?s(n):r>3?s(e,t,n):s(e,t))||n);return r>3&&n&&Object.defineProperty(e,t,n),n}var Ss=O`
	${j("inline-flex")} :host {
		outline: none;
		font-family: ${X};
		font-size: ${U};
		line-height: ${q};
		color: ${ii};
		background: ${qe};
		border-radius: calc(${Pe} * 1px);
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
		padding: ${tn} ${en};
		white-space: wrap;
		outline: none;
		text-decoration: none;
		border: calc(${y} * 1px) solid ${Jt};
		color: inherit;
		border-radius: inherit;
		fill: inherit;
		cursor: inherit;
		font-family: inherit;
	}
	:host(:hover) {
		background: ${ri};
	}
	:host(:active) {
		background: ${qe};
	}
	.control:${_} {
		outline: calc(${y} * 1px) solid ${D};
		outline-offset: calc(${y} * 2px);
	}
	.control::-moz-focus-inner {
		border: 0;
	}
	:host([disabled]) {
		opacity: ${he};
		background: ${qe};
		cursor: ${ie};
	}
	.content {
		display: flex;
	}
	.start {
		display: flex;
	}
	::slotted(svg),
	::slotted(span) {
		width: calc(${w} * 4px);
		height: calc(${w} * 4px);
	}
	.start {
		margin-inline-end: 8px;
	}
`,Ts=O`
	:host([appearance='primary']) {
		background: ${qe};
		color: ${ii};
	}
	:host([appearance='primary']:hover) {
		background: ${ri};
	}
	:host([appearance='primary']:active) .control:active {
		background: ${qe};
	}
	:host([appearance='primary']) .control:${_} {
		outline: calc(${y} * 1px) solid ${D};
		outline-offset: calc(${y} * 2px);
	}
	:host([appearance='primary'][disabled]) {
		background: ${qe};
	}
`,Os=O`
	:host([appearance='secondary']) {
		background: ${Kt};
		color: ${Jr};
	}
	:host([appearance='secondary']:hover) {
		background: ${Kr};
	}
	:host([appearance='secondary']:active) .control:active {
		background: ${Kt};
	}
	:host([appearance='secondary']) .control:${_} {
		outline: calc(${y} * 1px) solid ${D};
		outline-offset: calc(${y} * 2px);
	}
	:host([appearance='secondary'][disabled]) {
		background: ${Kt};
	}
`,Es=O`
	:host([appearance='icon']) {
		background: ${ti};
		border-radius: ${Xr};
		color: ${H};
	}
	:host([appearance='icon']:hover) {
		background: ${oi};
		outline: 1px dotted ${Zt};
		outline-offset: -1px;
	}
	:host([appearance='icon']) .control {
		padding: ${Yr};
		border: none;
	}
	:host([appearance='icon']:active) .control:active {
		background: ${oi};
	}
	:host([appearance='icon']) .control:${_} {
		outline: calc(${y} * 1px) solid ${D};
		outline-offset: ${Zr};
	}
	:host([appearance='icon'][disabled]) {
		background: ${ti};
	}
`,un=(o,e)=>O`
	${Ss}
	${Ts}
	${Os}
	${Es}
`;var oo=class extends Q{connectedCallback(){if(super.connectedCallback(),!this.appearance){let e=this.getAttribute("appearance");this.appearance=e}}attributeChangedCallback(e,t,i){e==="appearance"&&i==="icon"&&(this.getAttribute("aria-label")||(this.ariaLabel="Icon Button")),e==="aria-label"&&(this.ariaLabel=i),e==="disabled"&&(this.disabled=i!==null)}};dn([p],oo.prototype,"appearance",void 0);var ai=oo.compose({baseName:"button",template:kr,styles:un,shadowOptions:{delegatesFocus:!0}});var hn=(o,e)=>O`
	${j("inline-flex")} :host {
		align-items: center;
		outline: none;
		margin: calc(${w} * 1px) 0;
		user-select: none;
		font-size: ${U};
		line-height: ${q};
	}
	.control {
		position: relative;
		width: calc(${w} * 4px + 2px);
		height: calc(${w} * 4px + 2px);
		box-sizing: border-box;
		border-radius: calc(${on} * 1px);
		border: calc(${y} * 1px) solid ${ni};
		background: ${eo};
		outline: none;
		cursor: pointer;
	}
	.label {
		font-family: ${X};
		color: ${H};
		padding-inline-start: calc(${w} * 2px + 2px);
		margin-inline-end: calc(${w} * 2px + 2px);
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
		fill: ${H};
		opacity: 0;
		pointer-events: none;
	}
	.indeterminate-indicator {
		border-radius: 2px;
		background: ${H};
		position: absolute;
		top: 50%;
		left: 50%;
		width: 50%;
		height: 50%;
		transform: translate(-50%, -50%);
		opacity: 0;
	}
	:host(:enabled) .control:hover {
		background: ${eo};
		border-color: ${ni};
	}
	:host(:enabled) .control:active {
		background: ${eo};
		border-color: ${D};
	}
	:host(:${_}) .control {
		border: calc(${y} * 1px) solid ${D};
	}
	:host(.disabled) .label,
	:host(.readonly) .label,
	:host(.readonly) .control,
	:host(.disabled) .control {
		cursor: ${ie};
	}
	:host(.checked:not(.indeterminate)) .checked-indicator,
	:host(.indeterminate) .indeterminate-indicator {
		opacity: 1;
	}
	:host(.disabled) {
		opacity: ${he};
	}
`;var li=class extends je{connectedCallback(){super.connectedCallback(),this.textContent?this.setAttribute("aria-label",this.textContent):this.setAttribute("aria-label","Checkbox")}},ci=li.compose({baseName:"checkbox",template:Pr,styles:hn,checkedIndicator:`
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
	`});var pn=(o,e)=>O`
	:host {
		display: flex;
		position: relative;
		flex-direction: column;
		width: 100%;
	}
`;var fn=(o,e)=>O`
	:host {
		display: grid;
		padding: calc((${w} / 4) * 1px) 0;
		box-sizing: border-box;
		width: 100%;
		background: transparent;
	}
	:host(.header) {
	}
	:host(.sticky-header) {
		background: ${Ur};
		position: sticky;
		top: 0;
	}
	:host(:hover) {
		background: ${rn};
		outline: 1px dotted ${Zt};
		outline-offset: -1px;
	}
`;var mn=(o,e)=>O`
	:host {
		padding: calc(${w} * 1px) calc(${w} * 3px);
		color: ${H};
		opacity: 1;
		box-sizing: border-box;
		font-family: ${X};
		font-size: ${U};
		line-height: ${q};
		font-weight: 400;
		border: solid calc(${y} * 1px) transparent;
		border-radius: calc(${st} * 1px);
		white-space: wrap;
		overflow-wrap: anywhere;
	}
	:host(.column-header) {
		font-weight: 600;
	}
	:host(:${_}),
	:host(:focus),
	:host(:active) {
		background: ${pe};
		border: solid calc(${y} * 1px) ${D};
		color: ${be};
		outline: none;
	}
	:host(:${_}) ::slotted(*),
	:host(:focus) ::slotted(*),
	:host(:active) ::slotted(*) {
		color: ${be} !important;
	}
`;var di=class extends I{connectedCallback(){super.connectedCallback(),this.getAttribute("aria-label")||this.setAttribute("aria-label","Data Grid")}},pi=di.compose({baseName:"data-grid",baseClass:I,template:Ir,styles:pn}),ui=class extends F{},fi=ui.compose({baseName:"data-grid-row",baseClass:F,template:Dr,styles:fn}),hi=class extends K{},mi=hi.compose({baseName:"data-grid-cell",baseClass:K,template:Ar,styles:mn});var gn=(o,e)=>O`
	${j("block")} :host {
		border: none;
		border-top: calc(${y} * 1px) solid ${nn};
		box-sizing: content-box;
		height: 0;
		margin: calc(${w} * 1px) 0;
		width: 100%;
	}
`;var gi=class extends nt{},bi=gi.compose({baseName:"divider",template:Rr,styles:gn});var bn=(o,e)=>O`
	${j("inline-flex")} :host {
		background: ${Tt};
		border-radius: calc(${Pe} * 1px);
		box-sizing: border-box;
		color: ${H};
		contain: contents;
		font-family: ${X};
		height: calc(${at} * 1px);
		position: relative;
		user-select: none;
		min-width: ${Yt};
		outline: none;
		vertical-align: top;
	}
	.control {
		align-items: center;
		box-sizing: border-box;
		border: calc(${y} * 1px) solid ${Ge};
		border-radius: calc(${Pe} * 1px);
		cursor: pointer;
		display: flex;
		font-family: inherit;
		font-size: ${U};
		line-height: ${q};
		min-height: 100%;
		padding: 2px 6px 2px 8px;
		width: 100%;
	}
	.listbox {
		background: ${Tt};
		border: calc(${y} * 1px) solid ${D};
		border-radius: calc(${Pe} * 1px);
		box-sizing: border-box;
		display: inline-flex;
		flex-direction: column;
		left: 0;
		max-height: ${sn};
		padding: 0;
		overflow-y: auto;
		position: absolute;
		width: 100%;
		z-index: 1;
	}
	.listbox[hidden] {
		display: none;
	}
	:host(:${_}) .control {
		border-color: ${D};
	}
	:host(:not([disabled]):hover) {
		background: ${Tt};
		border-color: ${Ge};
	}
	:host(:${_}) ::slotted([aria-selected="true"][role="option"]:not([disabled])) {
		background: ${pe};
		border: calc(${y} * 1px) solid transparent;
		color: ${be};
	}
	:host([disabled]) {
		cursor: ${ie};
		opacity: ${he};
	}
	:host([disabled]) .control {
		cursor: ${ie};
		user-select: none;
	}
	:host([disabled]:hover) {
		background: ${Tt};
		color: ${H};
		fill: currentcolor;
	}
	:host(:not([disabled])) .control:active {
		border-color: ${D};
	}
	:host(:empty) .listbox {
		display: none;
	}
	:host([open]) .control {
		border-color: ${D};
	}
	:host([open][position='above']) .listbox {
		border-bottom-left-radius: 0;
		border-bottom-right-radius: 0;
	}
	:host([open][position='below']) .listbox {
		border-top-left-radius: 0;
		border-top-right-radius: 0;
	}
	:host([open][position='above']) .listbox {
		bottom: calc(${at} * 1px);
	}
	:host([open][position='below']) .listbox {
		top: calc(${at} * 1px);
	}
	.selected-value {
		flex: 1 1 auto;
		font-family: inherit;
		overflow: hidden;
		text-align: start;
		text-overflow: ellipsis;
		white-space: nowrap;
	}
	.indicator {
		flex: 0 0 auto;
		margin-inline-start: 1em;
	}
	slot[name='listbox'] {
		display: none;
		width: 100%;
	}
	:host([open]) slot[name='listbox'] {
		display: flex;
		position: absolute;
	}
	.end {
		margin-inline-start: auto;
	}
	.start,
	.end,
	.indicator,
	.select-indicator,
	::slotted(svg),
	::slotted(span) {
		fill: currentcolor;
		height: 1em;
		min-height: calc(${w} * 4px);
		min-width: calc(${w} * 4px);
		width: 1em;
	}
	::slotted([role='option']),
	::slotted(option) {
		flex: 0 0 auto;
	}
`;var vi=class extends oe{},xi=vi.compose({baseName:"dropdown",template:Lr,styles:bn,indicator:`
		<svg 
			class="select-indicator"
			part="select-indicator"
			width="16" 
			height="16" 
			viewBox="0 0 16 16" 
			xmlns="http://www.w3.org/2000/svg" 
			fill="currentColor"
		>
			<path 
				fill-rule="evenodd" 
				clip-rule="evenodd" 
				d="M7.976 10.072l4.357-4.357.62.618L8.284 11h-.618L3 6.333l.619-.618 4.357 4.357z"
			/>
		</svg>
	`});var vn=(o,e)=>O`
	${j("inline-flex")} :host {
		background: transparent;
		box-sizing: border-box;
		color: ${ln};
		cursor: pointer;
		fill: currentcolor;
		font-family: ${X};
		font-size: ${U};
		line-height: ${q};
		outline: none;
	}
	.control {
		background: transparent;
		border: calc(${y} * 1px) solid transparent;
		border-radius: calc(${st} * 1px);
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
		color: ${si};
	}
	:host(:hover) .content {
		text-decoration: underline;
	}
	:host(:active) {
		background: transparent;
		color: ${si};
	}
	:host(:${_}) .control,
	:host(:focus) .control {
		border: calc(${y} * 1px) solid ${D};
	}
`;var yi=class extends W{},wi=yi.compose({baseName:"link",template:wr,styles:vn,shadowOptions:{delegatesFocus:!0}});var xn=(o,e)=>O`
	${j("inline-flex")} :host {
		font-family: var(--body-font);
		border-radius: ${st};
		border: calc(${y} * 1px) solid transparent;
		box-sizing: border-box;
		color: ${H};
		cursor: pointer;
		fill: currentcolor;
		font-size: ${U};
		line-height: ${q};
		margin: 0;
		outline: none;
		overflow: hidden;
		padding: 0 calc((${w} / 2) * 1px)
			calc((${w} / 4) * 1px);
		user-select: none;
		white-space: nowrap;
	}
	:host(:${_}) {
		border-color: ${D};
		background: ${pe};
		color: ${H};
	}
	:host([aria-selected='true']) {
		background: ${pe};
		border: calc(${y} * 1px) solid transparent;
		color: ${be};
	}
	:host(:active) {
		background: ${pe};
		color: ${be};
	}
	:host(:not([aria-selected='true']):hover) {
		background: ${pe};
		border: calc(${y} * 1px) solid transparent;
		color: ${be};
	}
	:host(:not([aria-selected='true']):active) {
		background: ${pe};
		color: ${H};
	}
	:host([disabled]) {
		cursor: ${ie};
		opacity: ${he};
	}
	:host([disabled]:hover) {
		background-color: inherit;
	}
	.content {
		grid-column-start: 2;
		justify-self: start;
		overflow: hidden;
		text-overflow: ellipsis;
	}
`;var Ci=class extends ee{connectedCallback(){super.connectedCallback(),this.textContent?this.setAttribute("aria-label",this.textContent):this.setAttribute("aria-label","Option")}},ki=Ci.compose({baseName:"option",template:_r,styles:xn});var yn=(o,e)=>O`
	${j("inline-block")} :host {
		box-sizing: border-box;
		font-family: ${X};
		font-size: ${qr};
		line-height: ${Gr};
	}
	.control {
		background-color: ${Wr};
		border: calc(${y} * 1px) solid ${Jt};
		border-radius: ${cn};
		color: ${Qr};
		padding: calc(${w} * 0.5px) calc(${w} * 1px);
		text-transform: uppercase;
	}
`;var $i=class extends He{connectedCallback(){super.connectedCallback(),this.circular&&(this.circular=!1)}},Si=$i.compose({baseName:"tag",template:Cr,styles:yn});var wn=(o,e)=>O`
	${j("inline-block")} :host {
		font-family: ${X};
		outline: none;
		user-select: none;
	}
	.root {
		box-sizing: border-box;
		position: relative;
		display: flex;
		flex-direction: row;
		color: ${an};
		background: ${to};
		border-radius: calc(${Pe} * 1px);
		border: calc(${y} * 1px) solid ${Ge};
		height: calc(${at} * 1px);
		min-width: ${Yt};
	}
	.control {
		-webkit-appearance: none;
		font: inherit;
		background: transparent;
		border: 0;
		color: inherit;
		height: calc(100% - (${w} * 1px));
		width: 100%;
		margin-top: auto;
		margin-bottom: auto;
		border: none;
		padding: 0 calc(${w} * 2px + 1px);
		font-size: ${U};
		line-height: ${q};
	}
	.control:hover,
	.control:${_},
	.control:disabled,
	.control:active {
		outline: none;
	}
	.label {
		display: block;
		color: ${H};
		cursor: pointer;
		font-size: ${U};
		line-height: ${q};
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
		width: calc(${w} * 4px);
		height: calc(${w} * 4px);
	}
	.start {
		margin-inline-start: calc(${w} * 2px);
	}
	.end {
		margin-inline-end: calc(${w} * 2px);
	}
	:host(:hover:not([disabled])) .root {
		background: ${to};
		border-color: ${Ge};
	}
	:host(:active:not([disabled])) .root {
		background: ${to};
		border-color: ${D};
	}
	:host(:focus-within:not([disabled])) .root {
		border-color: ${D};
	}
	:host([disabled]) .label,
	:host([readonly]) .label,
	:host([readonly]) .control,
	:host([disabled]) .control {
		cursor: ${ie};
	}
	:host([disabled]) {
		opacity: ${he};
	}
	:host([disabled]) .control {
		border-color: ${Ge};
	}
`;var Ti=class extends N{connectedCallback(){super.connectedCallback(),this.textContent?this.setAttribute("aria-label",this.textContent):this.setAttribute("aria-label","Text field")}},Oi=Ti.compose({baseName:"text-field",template:Mr,styles:wn,shadowOptions:{delegatesFocus:!0}});Vr().register(ai(),pi(),mi(),fi(),bi(),Oi(),Si(),wi(),ci(),xi(),ki());var It=acquireVsCodeApi(),lt=[],Et=[];function Sn(o){lt=o;let e=document.getElementById("basic-grid");if(e){for(;e.children.length>1;){let t=e.lastChild;t&&e.removeChild(t)}o.forEach(t=>{let i=document.createElement("vscode-data-grid-row"),r=document.createElement("vscode-data-grid-cell");r.setAttribute("grid-column","1");let n=document.createElement("vscode-checkbox");n.setAttribute("id",`check-${t.index}`),n.addEventListener("change",function(){let g=t.index;if(n.checked)Et.push(g);else{let $=Et.findIndex(S=>S===g);$!==-1&&Et.splice($,1)}Is()}),Et.includes(t.index)&&(n.checked=!0),r.appendChild(n),i.appendChild(r);let s=document.createElement("vscode-data-grid-cell");s.setAttribute("grid-column","2");let a=document.createElement("vscode-link");a.textContent="Path #"+t.index,a.addEventListener("click",function(g){It.postMessage({command:"showPathDetails",pathName:t.name})}),s.appendChild(a),i.appendChild(s);let l=document.createElement("vscode-data-grid-cell");l.textContent=t.levelsNumber,l.setAttribute("grid-column","3"),i.appendChild(l);let c=document.createElement("vscode-data-grid-cell");c.setAttribute("grid-column","4"),c.textContent=t.slack.toFixed(3),t.slack<0&&(c.style.color="#DC3545",c.style.fontWeight="bold"),i.appendChild(c);let u=document.createElement("vscode-data-grid-cell");if(u.setAttribute("grid-column","5"),t.fromPath!==""){u.addEventListener("click",function(){It.postMessage({command:"open",file:t.fromPath,line:t.fromLine})}),u.setAttribute("title",`${t.fromPath}:${t.fromLine}`);let g=document.createElement("vscode-link");g.textContent=t.fromNodeName,u.appendChild(g)}else u.textContent=t.fromNodeName;i.appendChild(u);let h=document.createElement("vscode-data-grid-cell");if(h.setAttribute("grid-column","6"),t.fromPath!==""){h.setAttribute("title",`${t.toPath}:${t.toLine}`),h.addEventListener("click",function(){It.postMessage({command:"open",file:t.toPath,line:t.toLine})});let g=document.createElement("vscode-link");g.textContent=t.toNodeName,h.appendChild(g)}else h.textContent=t.toNodeName;i.appendChild(h),e.appendChild(i)})}}window.addEventListener("message",o=>{let e=o.data;switch(e.command){case"update":Sn(e.timingReport);break}});function Is(){It.postMessage({command:"updateDecorators",selectionList:Et})}function Tn(){let e=document.getElementById("num-paths").value;if(!e)return;let t="",i=document.querySelectorAll("vscode-option");console.log(i);for(let r=0;r<i.length;r++){let n=i[r];if(n.selected){t=n.value;break}}It.postMessage({command:"generate",numPaths:parseInt(e),timingMode:t})}var Cn=document.getElementById("generate-button");Cn&&Cn.addEventListener("click",function(){Tn()});var kn=document.getElementById("num-paths");kn&&kn.addEventListener("keydown",function(o){o.key==="Enter"&&Tn()});var Ds=["h0","h1","h2","h3","h4"],$n={};for(let o of Ds){let e=document.getElementById(o);e&&e.addEventListener("click",function(){As(parseInt(o[1]),e)})}function Ot(o,e,t){o==="asc"?t?lt.sort((i,r)=>i[e].localeCompare(r[e])):lt.sort((i,r)=>i[e]-r[e]):t?lt.sort((i,r)=>r[e].localeCompare(i[e])):lt.sort((i,r)=>r[e]-i[e])}function As(o,e){let t=$n[o]==="asc"?"desc":"asc";$n[o]=t,Ps(),o===0?Ot(t,"index",!1):o===1?Ot(t,"levelsNumber",!1):o===2?Ot(t,"slack",!1):o===3?Ot(t,"fromNodeName",!0):o===4&&Ot(t,"toNodeName",!0),Sn(lt),Fs(e,t)}function Ps(){var o=document.querySelectorAll(".sorting");o.forEach(function(e){e.innerHTML="&#8597;"})}function Fs(o,e){var t=o.querySelector(".sorting");t.innerHTML=e==="asc"?"&#8593;":"&#8595;"}
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
