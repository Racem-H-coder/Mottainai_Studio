var nw=Object.defineProperty;var iw=(bs,nn,Ln)=>nn in bs?nw(bs,nn,{enumerable:!0,configurable:!0,writable:!0,value:Ln}):bs[nn]=Ln;var ut=(bs,nn,Ln)=>iw(bs,typeof nn!="symbol"?nn+"":nn,Ln);(function(){"use strict";/**
 * @license
 * Copyright 2010-2023 Three.js Authors
 * SPDX-License-Identifier: MIT
 */const nn={ROTATE:0,DOLLY:1,PAN:2},Ln={ROTATE:0,PAN:1,DOLLY_PAN:2,DOLLY_ROTATE:3},bm=0,sh=1,Mm=2,rh=1,oh=2,ei=3,yi=0,sn=1,dn=2,ni=0,Ms=1,Ga=2,ah=3,lh=4,ym=5,Wi=100,Sm=101,Em=102,ch=103,hh=104,Tm=200,wm=201,Am=202,Cm=203,Wa=204,Xa=205,Rm=206,Pm=207,Lm=208,Dm=209,Im=210,Om=211,Um=212,Fm=213,Nm=214,km=0,Bm=1,zm=2,ro=3,Hm=4,Vm=5,Gm=6,Wm=7,uh=0,Xm=1,jm=2,Si=0,dh=1,fh=2,ph=3,ja=4,Ym=5,mh=6,gh=300,ys=301,Ss=302,Ya=303,qa=304,oo=306,$a=1e3,Dn=1001,Ka=1002,Ze=1003,_h=1004,Za=1005,Mn=1006,qm=1007,ar=1008,Ei=1009,$m=1010,Km=1011,Ja=1012,xh=1013,Ti=1014,wi=1015,ii=1016,vh=1017,bh=1018,Xi=1020,Zm=1021,In=1023,Jm=1024,Qm=1025,ji=1026,Es=1027,tg=1028,Mh=1029,eg=1030,yh=1031,Sh=1033,Qa=33776,tl=33777,el=33778,nl=33779,Eh=35840,Th=35841,wh=35842,Ah=35843,Ch=36196,Rh=37492,Ph=37496,Lh=37808,Dh=37809,Ih=37810,Oh=37811,Uh=37812,Fh=37813,Nh=37814,kh=37815,Bh=37816,zh=37817,Hh=37818,Vh=37819,Gh=37820,Wh=37821,il=36492,Xh=36494,jh=36495,ng=36283,Yh=36284,qh=36285,$h=36286,Kh=3e3,Yi=3001,ig=3200,sg=3201,Zh=0,rg=1,yn="",Ve="srgb",si="srgb-linear",sl="display-p3",ao="display-p3-linear",lo="linear",he="srgb",co="rec709",ho="p3",Ts=7680,Jh=519,og=512,ag=513,lg=514,Qh=515,cg=516,hg=517,ug=518,dg=519,tu=35044,fg=35048,eu="300 es",rl=1035,ri=2e3,uo=2001;class qi{addEventListener(t,e){this._listeners===void 0&&(this._listeners={});const i=this._listeners;i[t]===void 0&&(i[t]=[]),i[t].indexOf(e)===-1&&i[t].push(e)}hasEventListener(t,e){if(this._listeners===void 0)return!1;const i=this._listeners;return i[t]!==void 0&&i[t].indexOf(e)!==-1}removeEventListener(t,e){if(this._listeners===void 0)return;const s=this._listeners[t];if(s!==void 0){const r=s.indexOf(e);r!==-1&&s.splice(r,1)}}dispatchEvent(t){if(this._listeners===void 0)return;const i=this._listeners[t.type];if(i!==void 0){t.target=this;const s=i.slice(0);for(let r=0,o=s.length;r<o;r++)s[r].call(this,t);t.target=null}}}const Xe=["00","01","02","03","04","05","06","07","08","09","0a","0b","0c","0d","0e","0f","10","11","12","13","14","15","16","17","18","19","1a","1b","1c","1d","1e","1f","20","21","22","23","24","25","26","27","28","29","2a","2b","2c","2d","2e","2f","30","31","32","33","34","35","36","37","38","39","3a","3b","3c","3d","3e","3f","40","41","42","43","44","45","46","47","48","49","4a","4b","4c","4d","4e","4f","50","51","52","53","54","55","56","57","58","59","5a","5b","5c","5d","5e","5f","60","61","62","63","64","65","66","67","68","69","6a","6b","6c","6d","6e","6f","70","71","72","73","74","75","76","77","78","79","7a","7b","7c","7d","7e","7f","80","81","82","83","84","85","86","87","88","89","8a","8b","8c","8d","8e","8f","90","91","92","93","94","95","96","97","98","99","9a","9b","9c","9d","9e","9f","a0","a1","a2","a3","a4","a5","a6","a7","a8","a9","aa","ab","ac","ad","ae","af","b0","b1","b2","b3","b4","b5","b6","b7","b8","b9","ba","bb","bc","bd","be","bf","c0","c1","c2","c3","c4","c5","c6","c7","c8","c9","ca","cb","cc","cd","ce","cf","d0","d1","d2","d3","d4","d5","d6","d7","d8","d9","da","db","dc","dd","de","df","e0","e1","e2","e3","e4","e5","e6","e7","e8","e9","ea","eb","ec","ed","ee","ef","f0","f1","f2","f3","f4","f5","f6","f7","f8","f9","fa","fb","fc","fd","fe","ff"],lr=Math.PI/180,ol=180/Math.PI;function cr(){const n=Math.random()*4294967295|0,t=Math.random()*4294967295|0,e=Math.random()*4294967295|0,i=Math.random()*4294967295|0;return(Xe[n&255]+Xe[n>>8&255]+Xe[n>>16&255]+Xe[n>>24&255]+"-"+Xe[t&255]+Xe[t>>8&255]+"-"+Xe[t>>16&15|64]+Xe[t>>24&255]+"-"+Xe[e&63|128]+Xe[e>>8&255]+"-"+Xe[e>>16&255]+Xe[e>>24&255]+Xe[i&255]+Xe[i>>8&255]+Xe[i>>16&255]+Xe[i>>24&255]).toLowerCase()}function Je(n,t,e){return Math.max(t,Math.min(e,n))}function pg(n,t){return(n%t+t)%t}function al(n,t,e){return(1-e)*n+e*t}function nu(n){return(n&n-1)===0&&n!==0}function ll(n){return Math.pow(2,Math.floor(Math.log(n)/Math.LN2))}function hr(n,t){switch(t.constructor){case Float32Array:return n;case Uint32Array:return n/4294967295;case Uint16Array:return n/65535;case Uint8Array:return n/255;case Int32Array:return Math.max(n/2147483647,-1);case Int16Array:return Math.max(n/32767,-1);case Int8Array:return Math.max(n/127,-1);default:throw new Error("Invalid component type.")}}function rn(n,t){switch(t.constructor){case Float32Array:return n;case Uint32Array:return Math.round(n*4294967295);case Uint16Array:return Math.round(n*65535);case Uint8Array:return Math.round(n*255);case Int32Array:return Math.round(n*2147483647);case Int16Array:return Math.round(n*32767);case Int8Array:return Math.round(n*127);default:throw new Error("Invalid component type.")}}const mg={DEG2RAD:lr};class St{constructor(t=0,e=0){St.prototype.isVector2=!0,this.x=t,this.y=e}get width(){return this.x}set width(t){this.x=t}get height(){return this.y}set height(t){this.y=t}set(t,e){return this.x=t,this.y=e,this}setScalar(t){return this.x=t,this.y=t,this}setX(t){return this.x=t,this}setY(t){return this.y=t,this}setComponent(t,e){switch(t){case 0:this.x=e;break;case 1:this.y=e;break;default:throw new Error("index is out of range: "+t)}return this}getComponent(t){switch(t){case 0:return this.x;case 1:return this.y;default:throw new Error("index is out of range: "+t)}}clone(){return new this.constructor(this.x,this.y)}copy(t){return this.x=t.x,this.y=t.y,this}add(t){return this.x+=t.x,this.y+=t.y,this}addScalar(t){return this.x+=t,this.y+=t,this}addVectors(t,e){return this.x=t.x+e.x,this.y=t.y+e.y,this}addScaledVector(t,e){return this.x+=t.x*e,this.y+=t.y*e,this}sub(t){return this.x-=t.x,this.y-=t.y,this}subScalar(t){return this.x-=t,this.y-=t,this}subVectors(t,e){return this.x=t.x-e.x,this.y=t.y-e.y,this}multiply(t){return this.x*=t.x,this.y*=t.y,this}multiplyScalar(t){return this.x*=t,this.y*=t,this}divide(t){return this.x/=t.x,this.y/=t.y,this}divideScalar(t){return this.multiplyScalar(1/t)}applyMatrix3(t){const e=this.x,i=this.y,s=t.elements;return this.x=s[0]*e+s[3]*i+s[6],this.y=s[1]*e+s[4]*i+s[7],this}min(t){return this.x=Math.min(this.x,t.x),this.y=Math.min(this.y,t.y),this}max(t){return this.x=Math.max(this.x,t.x),this.y=Math.max(this.y,t.y),this}clamp(t,e){return this.x=Math.max(t.x,Math.min(e.x,this.x)),this.y=Math.max(t.y,Math.min(e.y,this.y)),this}clampScalar(t,e){return this.x=Math.max(t,Math.min(e,this.x)),this.y=Math.max(t,Math.min(e,this.y)),this}clampLength(t,e){const i=this.length();return this.divideScalar(i||1).multiplyScalar(Math.max(t,Math.min(e,i)))}floor(){return this.x=Math.floor(this.x),this.y=Math.floor(this.y),this}ceil(){return this.x=Math.ceil(this.x),this.y=Math.ceil(this.y),this}round(){return this.x=Math.round(this.x),this.y=Math.round(this.y),this}roundToZero(){return this.x=Math.trunc(this.x),this.y=Math.trunc(this.y),this}negate(){return this.x=-this.x,this.y=-this.y,this}dot(t){return this.x*t.x+this.y*t.y}cross(t){return this.x*t.y-this.y*t.x}lengthSq(){return this.x*this.x+this.y*this.y}length(){return Math.sqrt(this.x*this.x+this.y*this.y)}manhattanLength(){return Math.abs(this.x)+Math.abs(this.y)}normalize(){return this.divideScalar(this.length()||1)}angle(){return Math.atan2(-this.y,-this.x)+Math.PI}angleTo(t){const e=Math.sqrt(this.lengthSq()*t.lengthSq());if(e===0)return Math.PI/2;const i=this.dot(t)/e;return Math.acos(Je(i,-1,1))}distanceTo(t){return Math.sqrt(this.distanceToSquared(t))}distanceToSquared(t){const e=this.x-t.x,i=this.y-t.y;return e*e+i*i}manhattanDistanceTo(t){return Math.abs(this.x-t.x)+Math.abs(this.y-t.y)}setLength(t){return this.normalize().multiplyScalar(t)}lerp(t,e){return this.x+=(t.x-this.x)*e,this.y+=(t.y-this.y)*e,this}lerpVectors(t,e,i){return this.x=t.x+(e.x-t.x)*i,this.y=t.y+(e.y-t.y)*i,this}equals(t){return t.x===this.x&&t.y===this.y}fromArray(t,e=0){return this.x=t[e],this.y=t[e+1],this}toArray(t=[],e=0){return t[e]=this.x,t[e+1]=this.y,t}fromBufferAttribute(t,e){return this.x=t.getX(e),this.y=t.getY(e),this}rotateAround(t,e){const i=Math.cos(e),s=Math.sin(e),r=this.x-t.x,o=this.y-t.y;return this.x=r*i-o*s+t.x,this.y=r*s+o*i+t.y,this}random(){return this.x=Math.random(),this.y=Math.random(),this}*[Symbol.iterator](){yield this.x,yield this.y}}class Yt{constructor(t,e,i,s,r,o,a,l,c){Yt.prototype.isMatrix3=!0,this.elements=[1,0,0,0,1,0,0,0,1],t!==void 0&&this.set(t,e,i,s,r,o,a,l,c)}set(t,e,i,s,r,o,a,l,c){const h=this.elements;return h[0]=t,h[1]=s,h[2]=a,h[3]=e,h[4]=r,h[5]=l,h[6]=i,h[7]=o,h[8]=c,this}identity(){return this.set(1,0,0,0,1,0,0,0,1),this}copy(t){const e=this.elements,i=t.elements;return e[0]=i[0],e[1]=i[1],e[2]=i[2],e[3]=i[3],e[4]=i[4],e[5]=i[5],e[6]=i[6],e[7]=i[7],e[8]=i[8],this}extractBasis(t,e,i){return t.setFromMatrix3Column(this,0),e.setFromMatrix3Column(this,1),i.setFromMatrix3Column(this,2),this}setFromMatrix4(t){const e=t.elements;return this.set(e[0],e[4],e[8],e[1],e[5],e[9],e[2],e[6],e[10]),this}multiply(t){return this.multiplyMatrices(this,t)}premultiply(t){return this.multiplyMatrices(t,this)}multiplyMatrices(t,e){const i=t.elements,s=e.elements,r=this.elements,o=i[0],a=i[3],l=i[6],c=i[1],h=i[4],u=i[7],d=i[2],f=i[5],g=i[8],_=s[0],m=s[3],p=s[6],v=s[1],x=s[4],y=s[7],b=s[2],E=s[5],S=s[8];return r[0]=o*_+a*v+l*b,r[3]=o*m+a*x+l*E,r[6]=o*p+a*y+l*S,r[1]=c*_+h*v+u*b,r[4]=c*m+h*x+u*E,r[7]=c*p+h*y+u*S,r[2]=d*_+f*v+g*b,r[5]=d*m+f*x+g*E,r[8]=d*p+f*y+g*S,this}multiplyScalar(t){const e=this.elements;return e[0]*=t,e[3]*=t,e[6]*=t,e[1]*=t,e[4]*=t,e[7]*=t,e[2]*=t,e[5]*=t,e[8]*=t,this}determinant(){const t=this.elements,e=t[0],i=t[1],s=t[2],r=t[3],o=t[4],a=t[5],l=t[6],c=t[7],h=t[8];return e*o*h-e*a*c-i*r*h+i*a*l+s*r*c-s*o*l}invert(){const t=this.elements,e=t[0],i=t[1],s=t[2],r=t[3],o=t[4],a=t[5],l=t[6],c=t[7],h=t[8],u=h*o-a*c,d=a*l-h*r,f=c*r-o*l,g=e*u+i*d+s*f;if(g===0)return this.set(0,0,0,0,0,0,0,0,0);const _=1/g;return t[0]=u*_,t[1]=(s*c-h*i)*_,t[2]=(a*i-s*o)*_,t[3]=d*_,t[4]=(h*e-s*l)*_,t[5]=(s*r-a*e)*_,t[6]=f*_,t[7]=(i*l-c*e)*_,t[8]=(o*e-i*r)*_,this}transpose(){let t;const e=this.elements;return t=e[1],e[1]=e[3],e[3]=t,t=e[2],e[2]=e[6],e[6]=t,t=e[5],e[5]=e[7],e[7]=t,this}getNormalMatrix(t){return this.setFromMatrix4(t).invert().transpose()}transposeIntoArray(t){const e=this.elements;return t[0]=e[0],t[1]=e[3],t[2]=e[6],t[3]=e[1],t[4]=e[4],t[5]=e[7],t[6]=e[2],t[7]=e[5],t[8]=e[8],this}setUvTransform(t,e,i,s,r,o,a){const l=Math.cos(r),c=Math.sin(r);return this.set(i*l,i*c,-i*(l*o+c*a)+o+t,-s*c,s*l,-s*(-c*o+l*a)+a+e,0,0,1),this}scale(t,e){return this.premultiply(cl.makeScale(t,e)),this}rotate(t){return this.premultiply(cl.makeRotation(-t)),this}translate(t,e){return this.premultiply(cl.makeTranslation(t,e)),this}makeTranslation(t,e){return t.isVector2?this.set(1,0,t.x,0,1,t.y,0,0,1):this.set(1,0,t,0,1,e,0,0,1),this}makeRotation(t){const e=Math.cos(t),i=Math.sin(t);return this.set(e,-i,0,i,e,0,0,0,1),this}makeScale(t,e){return this.set(t,0,0,0,e,0,0,0,1),this}equals(t){const e=this.elements,i=t.elements;for(let s=0;s<9;s++)if(e[s]!==i[s])return!1;return!0}fromArray(t,e=0){for(let i=0;i<9;i++)this.elements[i]=t[i+e];return this}toArray(t=[],e=0){const i=this.elements;return t[e]=i[0],t[e+1]=i[1],t[e+2]=i[2],t[e+3]=i[3],t[e+4]=i[4],t[e+5]=i[5],t[e+6]=i[6],t[e+7]=i[7],t[e+8]=i[8],t}clone(){return new this.constructor().fromArray(this.elements)}}const cl=new Yt;function iu(n){for(let t=n.length-1;t>=0;--t)if(n[t]>=65535)return!0;return!1}function fo(n){return document.createElementNS("http://www.w3.org/1999/xhtml",n)}function gg(){const n=fo("canvas");return n.style.display="block",n}const su={};function ur(n){n in su||(su[n]=!0,console.warn(n))}const ru=new Yt().set(.8224621,.177538,0,.0331941,.9668058,0,.0170827,.0723974,.9105199),ou=new Yt().set(1.2249401,-.2249404,0,-.0420569,1.0420571,0,-.0196376,-.0786361,1.0982735),po={[si]:{transfer:lo,primaries:co,toReference:n=>n,fromReference:n=>n},[Ve]:{transfer:he,primaries:co,toReference:n=>n.convertSRGBToLinear(),fromReference:n=>n.convertLinearToSRGB()},[ao]:{transfer:lo,primaries:ho,toReference:n=>n.applyMatrix3(ou),fromReference:n=>n.applyMatrix3(ru)},[sl]:{transfer:he,primaries:ho,toReference:n=>n.convertSRGBToLinear().applyMatrix3(ou),fromReference:n=>n.applyMatrix3(ru).convertLinearToSRGB()}},_g=new Set([si,ao]),se={enabled:!0,_workingColorSpace:si,get workingColorSpace(){return this._workingColorSpace},set workingColorSpace(n){if(!_g.has(n))throw new Error(`Unsupported working color space, "${n}".`);this._workingColorSpace=n},convert:function(n,t,e){if(this.enabled===!1||t===e||!t||!e)return n;const i=po[t].toReference,s=po[e].fromReference;return s(i(n))},fromWorkingColorSpace:function(n,t){return this.convert(n,this._workingColorSpace,t)},toWorkingColorSpace:function(n,t){return this.convert(n,t,this._workingColorSpace)},getPrimaries:function(n){return po[n].primaries},getTransfer:function(n){return n===yn?lo:po[n].transfer}};function ws(n){return n<.04045?n*.0773993808:Math.pow(n*.9478672986+.0521327014,2.4)}function hl(n){return n<.0031308?n*12.92:1.055*Math.pow(n,.41666)-.055}let As;class au{static getDataURL(t){if(/^data:/i.test(t.src)||typeof HTMLCanvasElement>"u")return t.src;let e;if(t instanceof HTMLCanvasElement)e=t;else{As===void 0&&(As=fo("canvas")),As.width=t.width,As.height=t.height;const i=As.getContext("2d");t instanceof ImageData?i.putImageData(t,0,0):i.drawImage(t,0,0,t.width,t.height),e=As}return e.width>2048||e.height>2048?(console.warn("THREE.ImageUtils.getDataURL: Image converted to jpg for performance reasons",t),e.toDataURL("image/jpeg",.6)):e.toDataURL("image/png")}static sRGBToLinear(t){if(typeof HTMLImageElement<"u"&&t instanceof HTMLImageElement||typeof HTMLCanvasElement<"u"&&t instanceof HTMLCanvasElement||typeof ImageBitmap<"u"&&t instanceof ImageBitmap){const e=fo("canvas");e.width=t.width,e.height=t.height;const i=e.getContext("2d");i.drawImage(t,0,0,t.width,t.height);const s=i.getImageData(0,0,t.width,t.height),r=s.data;for(let o=0;o<r.length;o++)r[o]=ws(r[o]/255)*255;return i.putImageData(s,0,0),e}else if(t.data){const e=t.data.slice(0);for(let i=0;i<e.length;i++)e instanceof Uint8Array||e instanceof Uint8ClampedArray?e[i]=Math.floor(ws(e[i]/255)*255):e[i]=ws(e[i]);return{data:e,width:t.width,height:t.height}}else return console.warn("THREE.ImageUtils.sRGBToLinear(): Unsupported image type. No color space conversion applied."),t}}let xg=0;class lu{constructor(t=null){this.isSource=!0,Object.defineProperty(this,"id",{value:xg++}),this.uuid=cr(),this.data=t,this.version=0}set needsUpdate(t){t===!0&&this.version++}toJSON(t){const e=t===void 0||typeof t=="string";if(!e&&t.images[this.uuid]!==void 0)return t.images[this.uuid];const i={uuid:this.uuid,url:""},s=this.data;if(s!==null){let r;if(Array.isArray(s)){r=[];for(let o=0,a=s.length;o<a;o++)s[o].isDataTexture?r.push(ul(s[o].image)):r.push(ul(s[o]))}else r=ul(s);i.url=r}return e||(t.images[this.uuid]=i),i}}function ul(n){return typeof HTMLImageElement<"u"&&n instanceof HTMLImageElement||typeof HTMLCanvasElement<"u"&&n instanceof HTMLCanvasElement||typeof ImageBitmap<"u"&&n instanceof ImageBitmap?au.getDataURL(n):n.data?{data:Array.from(n.data),width:n.width,height:n.height,type:n.data.constructor.name}:(console.warn("THREE.Texture: Unable to serialize Texture."),{})}let vg=0;class fn extends qi{constructor(t=fn.DEFAULT_IMAGE,e=fn.DEFAULT_MAPPING,i=Dn,s=Dn,r=Mn,o=ar,a=In,l=Ei,c=fn.DEFAULT_ANISOTROPY,h=yn){super(),this.isTexture=!0,Object.defineProperty(this,"id",{value:vg++}),this.uuid=cr(),this.name="",this.source=new lu(t),this.mipmaps=[],this.mapping=e,this.channel=0,this.wrapS=i,this.wrapT=s,this.magFilter=r,this.minFilter=o,this.anisotropy=c,this.format=a,this.internalFormat=null,this.type=l,this.offset=new St(0,0),this.repeat=new St(1,1),this.center=new St(0,0),this.rotation=0,this.matrixAutoUpdate=!0,this.matrix=new Yt,this.generateMipmaps=!0,this.premultiplyAlpha=!1,this.flipY=!0,this.unpackAlignment=4,typeof h=="string"?this.colorSpace=h:(ur("THREE.Texture: Property .encoding has been replaced by .colorSpace."),this.colorSpace=h===Yi?Ve:yn),this.userData={},this.version=0,this.onUpdate=null,this.isRenderTargetTexture=!1,this.needsPMREMUpdate=!1}get image(){return this.source.data}set image(t=null){this.source.data=t}updateMatrix(){this.matrix.setUvTransform(this.offset.x,this.offset.y,this.repeat.x,this.repeat.y,this.rotation,this.center.x,this.center.y)}clone(){return new this.constructor().copy(this)}copy(t){return this.name=t.name,this.source=t.source,this.mipmaps=t.mipmaps.slice(0),this.mapping=t.mapping,this.channel=t.channel,this.wrapS=t.wrapS,this.wrapT=t.wrapT,this.magFilter=t.magFilter,this.minFilter=t.minFilter,this.anisotropy=t.anisotropy,this.format=t.format,this.internalFormat=t.internalFormat,this.type=t.type,this.offset.copy(t.offset),this.repeat.copy(t.repeat),this.center.copy(t.center),this.rotation=t.rotation,this.matrixAutoUpdate=t.matrixAutoUpdate,this.matrix.copy(t.matrix),this.generateMipmaps=t.generateMipmaps,this.premultiplyAlpha=t.premultiplyAlpha,this.flipY=t.flipY,this.unpackAlignment=t.unpackAlignment,this.colorSpace=t.colorSpace,this.userData=JSON.parse(JSON.stringify(t.userData)),this.needsUpdate=!0,this}toJSON(t){const e=t===void 0||typeof t=="string";if(!e&&t.textures[this.uuid]!==void 0)return t.textures[this.uuid];const i={metadata:{version:4.6,type:"Texture",generator:"Texture.toJSON"},uuid:this.uuid,name:this.name,image:this.source.toJSON(t).uuid,mapping:this.mapping,channel:this.channel,repeat:[this.repeat.x,this.repeat.y],offset:[this.offset.x,this.offset.y],center:[this.center.x,this.center.y],rotation:this.rotation,wrap:[this.wrapS,this.wrapT],format:this.format,internalFormat:this.internalFormat,type:this.type,colorSpace:this.colorSpace,minFilter:this.minFilter,magFilter:this.magFilter,anisotropy:this.anisotropy,flipY:this.flipY,generateMipmaps:this.generateMipmaps,premultiplyAlpha:this.premultiplyAlpha,unpackAlignment:this.unpackAlignment};return Object.keys(this.userData).length>0&&(i.userData=this.userData),e||(t.textures[this.uuid]=i),i}dispose(){this.dispatchEvent({type:"dispose"})}transformUv(t){if(this.mapping!==gh)return t;if(t.applyMatrix3(this.matrix),t.x<0||t.x>1)switch(this.wrapS){case $a:t.x=t.x-Math.floor(t.x);break;case Dn:t.x=t.x<0?0:1;break;case Ka:Math.abs(Math.floor(t.x)%2)===1?t.x=Math.ceil(t.x)-t.x:t.x=t.x-Math.floor(t.x);break}if(t.y<0||t.y>1)switch(this.wrapT){case $a:t.y=t.y-Math.floor(t.y);break;case Dn:t.y=t.y<0?0:1;break;case Ka:Math.abs(Math.floor(t.y)%2)===1?t.y=Math.ceil(t.y)-t.y:t.y=t.y-Math.floor(t.y);break}return this.flipY&&(t.y=1-t.y),t}set needsUpdate(t){t===!0&&(this.version++,this.source.needsUpdate=!0)}get encoding(){return ur("THREE.Texture: Property .encoding has been replaced by .colorSpace."),this.colorSpace===Ve?Yi:Kh}set encoding(t){ur("THREE.Texture: Property .encoding has been replaced by .colorSpace."),this.colorSpace=t===Yi?Ve:yn}}fn.DEFAULT_IMAGE=null,fn.DEFAULT_MAPPING=gh,fn.DEFAULT_ANISOTROPY=1;class Ue{constructor(t=0,e=0,i=0,s=1){Ue.prototype.isVector4=!0,this.x=t,this.y=e,this.z=i,this.w=s}get width(){return this.z}set width(t){this.z=t}get height(){return this.w}set height(t){this.w=t}set(t,e,i,s){return this.x=t,this.y=e,this.z=i,this.w=s,this}setScalar(t){return this.x=t,this.y=t,this.z=t,this.w=t,this}setX(t){return this.x=t,this}setY(t){return this.y=t,this}setZ(t){return this.z=t,this}setW(t){return this.w=t,this}setComponent(t,e){switch(t){case 0:this.x=e;break;case 1:this.y=e;break;case 2:this.z=e;break;case 3:this.w=e;break;default:throw new Error("index is out of range: "+t)}return this}getComponent(t){switch(t){case 0:return this.x;case 1:return this.y;case 2:return this.z;case 3:return this.w;default:throw new Error("index is out of range: "+t)}}clone(){return new this.constructor(this.x,this.y,this.z,this.w)}copy(t){return this.x=t.x,this.y=t.y,this.z=t.z,this.w=t.w!==void 0?t.w:1,this}add(t){return this.x+=t.x,this.y+=t.y,this.z+=t.z,this.w+=t.w,this}addScalar(t){return this.x+=t,this.y+=t,this.z+=t,this.w+=t,this}addVectors(t,e){return this.x=t.x+e.x,this.y=t.y+e.y,this.z=t.z+e.z,this.w=t.w+e.w,this}addScaledVector(t,e){return this.x+=t.x*e,this.y+=t.y*e,this.z+=t.z*e,this.w+=t.w*e,this}sub(t){return this.x-=t.x,this.y-=t.y,this.z-=t.z,this.w-=t.w,this}subScalar(t){return this.x-=t,this.y-=t,this.z-=t,this.w-=t,this}subVectors(t,e){return this.x=t.x-e.x,this.y=t.y-e.y,this.z=t.z-e.z,this.w=t.w-e.w,this}multiply(t){return this.x*=t.x,this.y*=t.y,this.z*=t.z,this.w*=t.w,this}multiplyScalar(t){return this.x*=t,this.y*=t,this.z*=t,this.w*=t,this}applyMatrix4(t){const e=this.x,i=this.y,s=this.z,r=this.w,o=t.elements;return this.x=o[0]*e+o[4]*i+o[8]*s+o[12]*r,this.y=o[1]*e+o[5]*i+o[9]*s+o[13]*r,this.z=o[2]*e+o[6]*i+o[10]*s+o[14]*r,this.w=o[3]*e+o[7]*i+o[11]*s+o[15]*r,this}divideScalar(t){return this.multiplyScalar(1/t)}setAxisAngleFromQuaternion(t){this.w=2*Math.acos(t.w);const e=Math.sqrt(1-t.w*t.w);return e<1e-4?(this.x=1,this.y=0,this.z=0):(this.x=t.x/e,this.y=t.y/e,this.z=t.z/e),this}setAxisAngleFromRotationMatrix(t){let e,i,s,r;const l=t.elements,c=l[0],h=l[4],u=l[8],d=l[1],f=l[5],g=l[9],_=l[2],m=l[6],p=l[10];if(Math.abs(h-d)<.01&&Math.abs(u-_)<.01&&Math.abs(g-m)<.01){if(Math.abs(h+d)<.1&&Math.abs(u+_)<.1&&Math.abs(g+m)<.1&&Math.abs(c+f+p-3)<.1)return this.set(1,0,0,0),this;e=Math.PI;const x=(c+1)/2,y=(f+1)/2,b=(p+1)/2,E=(h+d)/4,S=(u+_)/4,C=(g+m)/4;return x>y&&x>b?x<.01?(i=0,s=.707106781,r=.707106781):(i=Math.sqrt(x),s=E/i,r=S/i):y>b?y<.01?(i=.707106781,s=0,r=.707106781):(s=Math.sqrt(y),i=E/s,r=C/s):b<.01?(i=.707106781,s=.707106781,r=0):(r=Math.sqrt(b),i=S/r,s=C/r),this.set(i,s,r,e),this}let v=Math.sqrt((m-g)*(m-g)+(u-_)*(u-_)+(d-h)*(d-h));return Math.abs(v)<.001&&(v=1),this.x=(m-g)/v,this.y=(u-_)/v,this.z=(d-h)/v,this.w=Math.acos((c+f+p-1)/2),this}min(t){return this.x=Math.min(this.x,t.x),this.y=Math.min(this.y,t.y),this.z=Math.min(this.z,t.z),this.w=Math.min(this.w,t.w),this}max(t){return this.x=Math.max(this.x,t.x),this.y=Math.max(this.y,t.y),this.z=Math.max(this.z,t.z),this.w=Math.max(this.w,t.w),this}clamp(t,e){return this.x=Math.max(t.x,Math.min(e.x,this.x)),this.y=Math.max(t.y,Math.min(e.y,this.y)),this.z=Math.max(t.z,Math.min(e.z,this.z)),this.w=Math.max(t.w,Math.min(e.w,this.w)),this}clampScalar(t,e){return this.x=Math.max(t,Math.min(e,this.x)),this.y=Math.max(t,Math.min(e,this.y)),this.z=Math.max(t,Math.min(e,this.z)),this.w=Math.max(t,Math.min(e,this.w)),this}clampLength(t,e){const i=this.length();return this.divideScalar(i||1).multiplyScalar(Math.max(t,Math.min(e,i)))}floor(){return this.x=Math.floor(this.x),this.y=Math.floor(this.y),this.z=Math.floor(this.z),this.w=Math.floor(this.w),this}ceil(){return this.x=Math.ceil(this.x),this.y=Math.ceil(this.y),this.z=Math.ceil(this.z),this.w=Math.ceil(this.w),this}round(){return this.x=Math.round(this.x),this.y=Math.round(this.y),this.z=Math.round(this.z),this.w=Math.round(this.w),this}roundToZero(){return this.x=Math.trunc(this.x),this.y=Math.trunc(this.y),this.z=Math.trunc(this.z),this.w=Math.trunc(this.w),this}negate(){return this.x=-this.x,this.y=-this.y,this.z=-this.z,this.w=-this.w,this}dot(t){return this.x*t.x+this.y*t.y+this.z*t.z+this.w*t.w}lengthSq(){return this.x*this.x+this.y*this.y+this.z*this.z+this.w*this.w}length(){return Math.sqrt(this.x*this.x+this.y*this.y+this.z*this.z+this.w*this.w)}manhattanLength(){return Math.abs(this.x)+Math.abs(this.y)+Math.abs(this.z)+Math.abs(this.w)}normalize(){return this.divideScalar(this.length()||1)}setLength(t){return this.normalize().multiplyScalar(t)}lerp(t,e){return this.x+=(t.x-this.x)*e,this.y+=(t.y-this.y)*e,this.z+=(t.z-this.z)*e,this.w+=(t.w-this.w)*e,this}lerpVectors(t,e,i){return this.x=t.x+(e.x-t.x)*i,this.y=t.y+(e.y-t.y)*i,this.z=t.z+(e.z-t.z)*i,this.w=t.w+(e.w-t.w)*i,this}equals(t){return t.x===this.x&&t.y===this.y&&t.z===this.z&&t.w===this.w}fromArray(t,e=0){return this.x=t[e],this.y=t[e+1],this.z=t[e+2],this.w=t[e+3],this}toArray(t=[],e=0){return t[e]=this.x,t[e+1]=this.y,t[e+2]=this.z,t[e+3]=this.w,t}fromBufferAttribute(t,e){return this.x=t.getX(e),this.y=t.getY(e),this.z=t.getZ(e),this.w=t.getW(e),this}random(){return this.x=Math.random(),this.y=Math.random(),this.z=Math.random(),this.w=Math.random(),this}*[Symbol.iterator](){yield this.x,yield this.y,yield this.z,yield this.w}}class bg extends qi{constructor(t=1,e=1,i={}){super(),this.isRenderTarget=!0,this.width=t,this.height=e,this.depth=1,this.scissor=new Ue(0,0,t,e),this.scissorTest=!1,this.viewport=new Ue(0,0,t,e);const s={width:t,height:e,depth:1};i.encoding!==void 0&&(ur("THREE.WebGLRenderTarget: option.encoding has been replaced by option.colorSpace."),i.colorSpace=i.encoding===Yi?Ve:yn),i=Object.assign({generateMipmaps:!1,internalFormat:null,minFilter:Mn,depthBuffer:!0,stencilBuffer:!1,depthTexture:null,samples:0},i),this.texture=new fn(s,i.mapping,i.wrapS,i.wrapT,i.magFilter,i.minFilter,i.format,i.type,i.anisotropy,i.colorSpace),this.texture.isRenderTargetTexture=!0,this.texture.flipY=!1,this.texture.generateMipmaps=i.generateMipmaps,this.texture.internalFormat=i.internalFormat,this.depthBuffer=i.depthBuffer,this.stencilBuffer=i.stencilBuffer,this.depthTexture=i.depthTexture,this.samples=i.samples}setSize(t,e,i=1){(this.width!==t||this.height!==e||this.depth!==i)&&(this.width=t,this.height=e,this.depth=i,this.texture.image.width=t,this.texture.image.height=e,this.texture.image.depth=i,this.dispose()),this.viewport.set(0,0,t,e),this.scissor.set(0,0,t,e)}clone(){return new this.constructor().copy(this)}copy(t){this.width=t.width,this.height=t.height,this.depth=t.depth,this.scissor.copy(t.scissor),this.scissorTest=t.scissorTest,this.viewport.copy(t.viewport),this.texture=t.texture.clone(),this.texture.isRenderTargetTexture=!0;const e=Object.assign({},t.texture.image);return this.texture.source=new lu(e),this.depthBuffer=t.depthBuffer,this.stencilBuffer=t.stencilBuffer,t.depthTexture!==null&&(this.depthTexture=t.depthTexture.clone()),this.samples=t.samples,this}dispose(){this.dispatchEvent({type:"dispose"})}}class On extends bg{constructor(t=1,e=1,i={}){super(t,e,i),this.isWebGLRenderTarget=!0}}class cu extends fn{constructor(t=null,e=1,i=1,s=1){super(null),this.isDataArrayTexture=!0,this.image={data:t,width:e,height:i,depth:s},this.magFilter=Ze,this.minFilter=Ze,this.wrapR=Dn,this.generateMipmaps=!1,this.flipY=!1,this.unpackAlignment=1}}class Mg extends fn{constructor(t=null,e=1,i=1,s=1){super(null),this.isData3DTexture=!0,this.image={data:t,width:e,height:i,depth:s},this.magFilter=Ze,this.minFilter=Ze,this.wrapR=Dn,this.generateMipmaps=!1,this.flipY=!1,this.unpackAlignment=1}}class Sn{constructor(t=0,e=0,i=0,s=1){this.isQuaternion=!0,this._x=t,this._y=e,this._z=i,this._w=s}static slerpFlat(t,e,i,s,r,o,a){let l=i[s+0],c=i[s+1],h=i[s+2],u=i[s+3];const d=r[o+0],f=r[o+1],g=r[o+2],_=r[o+3];if(a===0){t[e+0]=l,t[e+1]=c,t[e+2]=h,t[e+3]=u;return}if(a===1){t[e+0]=d,t[e+1]=f,t[e+2]=g,t[e+3]=_;return}if(u!==_||l!==d||c!==f||h!==g){let m=1-a;const p=l*d+c*f+h*g+u*_,v=p>=0?1:-1,x=1-p*p;if(x>Number.EPSILON){const b=Math.sqrt(x),E=Math.atan2(b,p*v);m=Math.sin(m*E)/b,a=Math.sin(a*E)/b}const y=a*v;if(l=l*m+d*y,c=c*m+f*y,h=h*m+g*y,u=u*m+_*y,m===1-a){const b=1/Math.sqrt(l*l+c*c+h*h+u*u);l*=b,c*=b,h*=b,u*=b}}t[e]=l,t[e+1]=c,t[e+2]=h,t[e+3]=u}static multiplyQuaternionsFlat(t,e,i,s,r,o){const a=i[s],l=i[s+1],c=i[s+2],h=i[s+3],u=r[o],d=r[o+1],f=r[o+2],g=r[o+3];return t[e]=a*g+h*u+l*f-c*d,t[e+1]=l*g+h*d+c*u-a*f,t[e+2]=c*g+h*f+a*d-l*u,t[e+3]=h*g-a*u-l*d-c*f,t}get x(){return this._x}set x(t){this._x=t,this._onChangeCallback()}get y(){return this._y}set y(t){this._y=t,this._onChangeCallback()}get z(){return this._z}set z(t){this._z=t,this._onChangeCallback()}get w(){return this._w}set w(t){this._w=t,this._onChangeCallback()}set(t,e,i,s){return this._x=t,this._y=e,this._z=i,this._w=s,this._onChangeCallback(),this}clone(){return new this.constructor(this._x,this._y,this._z,this._w)}copy(t){return this._x=t.x,this._y=t.y,this._z=t.z,this._w=t.w,this._onChangeCallback(),this}setFromEuler(t,e=!0){const i=t._x,s=t._y,r=t._z,o=t._order,a=Math.cos,l=Math.sin,c=a(i/2),h=a(s/2),u=a(r/2),d=l(i/2),f=l(s/2),g=l(r/2);switch(o){case"XYZ":this._x=d*h*u+c*f*g,this._y=c*f*u-d*h*g,this._z=c*h*g+d*f*u,this._w=c*h*u-d*f*g;break;case"YXZ":this._x=d*h*u+c*f*g,this._y=c*f*u-d*h*g,this._z=c*h*g-d*f*u,this._w=c*h*u+d*f*g;break;case"ZXY":this._x=d*h*u-c*f*g,this._y=c*f*u+d*h*g,this._z=c*h*g+d*f*u,this._w=c*h*u-d*f*g;break;case"ZYX":this._x=d*h*u-c*f*g,this._y=c*f*u+d*h*g,this._z=c*h*g-d*f*u,this._w=c*h*u+d*f*g;break;case"YZX":this._x=d*h*u+c*f*g,this._y=c*f*u+d*h*g,this._z=c*h*g-d*f*u,this._w=c*h*u-d*f*g;break;case"XZY":this._x=d*h*u-c*f*g,this._y=c*f*u-d*h*g,this._z=c*h*g+d*f*u,this._w=c*h*u+d*f*g;break;default:console.warn("THREE.Quaternion: .setFromEuler() encountered an unknown order: "+o)}return e===!0&&this._onChangeCallback(),this}setFromAxisAngle(t,e){const i=e/2,s=Math.sin(i);return this._x=t.x*s,this._y=t.y*s,this._z=t.z*s,this._w=Math.cos(i),this._onChangeCallback(),this}setFromRotationMatrix(t){const e=t.elements,i=e[0],s=e[4],r=e[8],o=e[1],a=e[5],l=e[9],c=e[2],h=e[6],u=e[10],d=i+a+u;if(d>0){const f=.5/Math.sqrt(d+1);this._w=.25/f,this._x=(h-l)*f,this._y=(r-c)*f,this._z=(o-s)*f}else if(i>a&&i>u){const f=2*Math.sqrt(1+i-a-u);this._w=(h-l)/f,this._x=.25*f,this._y=(s+o)/f,this._z=(r+c)/f}else if(a>u){const f=2*Math.sqrt(1+a-i-u);this._w=(r-c)/f,this._x=(s+o)/f,this._y=.25*f,this._z=(l+h)/f}else{const f=2*Math.sqrt(1+u-i-a);this._w=(o-s)/f,this._x=(r+c)/f,this._y=(l+h)/f,this._z=.25*f}return this._onChangeCallback(),this}setFromUnitVectors(t,e){let i=t.dot(e)+1;return i<Number.EPSILON?(i=0,Math.abs(t.x)>Math.abs(t.z)?(this._x=-t.y,this._y=t.x,this._z=0,this._w=i):(this._x=0,this._y=-t.z,this._z=t.y,this._w=i)):(this._x=t.y*e.z-t.z*e.y,this._y=t.z*e.x-t.x*e.z,this._z=t.x*e.y-t.y*e.x,this._w=i),this.normalize()}angleTo(t){return 2*Math.acos(Math.abs(Je(this.dot(t),-1,1)))}rotateTowards(t,e){const i=this.angleTo(t);if(i===0)return this;const s=Math.min(1,e/i);return this.slerp(t,s),this}identity(){return this.set(0,0,0,1)}invert(){return this.conjugate()}conjugate(){return this._x*=-1,this._y*=-1,this._z*=-1,this._onChangeCallback(),this}dot(t){return this._x*t._x+this._y*t._y+this._z*t._z+this._w*t._w}lengthSq(){return this._x*this._x+this._y*this._y+this._z*this._z+this._w*this._w}length(){return Math.sqrt(this._x*this._x+this._y*this._y+this._z*this._z+this._w*this._w)}normalize(){let t=this.length();return t===0?(this._x=0,this._y=0,this._z=0,this._w=1):(t=1/t,this._x=this._x*t,this._y=this._y*t,this._z=this._z*t,this._w=this._w*t),this._onChangeCallback(),this}multiply(t){return this.multiplyQuaternions(this,t)}premultiply(t){return this.multiplyQuaternions(t,this)}multiplyQuaternions(t,e){const i=t._x,s=t._y,r=t._z,o=t._w,a=e._x,l=e._y,c=e._z,h=e._w;return this._x=i*h+o*a+s*c-r*l,this._y=s*h+o*l+r*a-i*c,this._z=r*h+o*c+i*l-s*a,this._w=o*h-i*a-s*l-r*c,this._onChangeCallback(),this}slerp(t,e){if(e===0)return this;if(e===1)return this.copy(t);const i=this._x,s=this._y,r=this._z,o=this._w;let a=o*t._w+i*t._x+s*t._y+r*t._z;if(a<0?(this._w=-t._w,this._x=-t._x,this._y=-t._y,this._z=-t._z,a=-a):this.copy(t),a>=1)return this._w=o,this._x=i,this._y=s,this._z=r,this;const l=1-a*a;if(l<=Number.EPSILON){const f=1-e;return this._w=f*o+e*this._w,this._x=f*i+e*this._x,this._y=f*s+e*this._y,this._z=f*r+e*this._z,this.normalize(),this}const c=Math.sqrt(l),h=Math.atan2(c,a),u=Math.sin((1-e)*h)/c,d=Math.sin(e*h)/c;return this._w=o*u+this._w*d,this._x=i*u+this._x*d,this._y=s*u+this._y*d,this._z=r*u+this._z*d,this._onChangeCallback(),this}slerpQuaternions(t,e,i){return this.copy(t).slerp(e,i)}random(){const t=Math.random(),e=Math.sqrt(1-t),i=Math.sqrt(t),s=2*Math.PI*Math.random(),r=2*Math.PI*Math.random();return this.set(e*Math.cos(s),i*Math.sin(r),i*Math.cos(r),e*Math.sin(s))}equals(t){return t._x===this._x&&t._y===this._y&&t._z===this._z&&t._w===this._w}fromArray(t,e=0){return this._x=t[e],this._y=t[e+1],this._z=t[e+2],this._w=t[e+3],this._onChangeCallback(),this}toArray(t=[],e=0){return t[e]=this._x,t[e+1]=this._y,t[e+2]=this._z,t[e+3]=this._w,t}fromBufferAttribute(t,e){return this._x=t.getX(e),this._y=t.getY(e),this._z=t.getZ(e),this._w=t.getW(e),this._onChangeCallback(),this}toJSON(){return this.toArray()}_onChange(t){return this._onChangeCallback=t,this}_onChangeCallback(){}*[Symbol.iterator](){yield this._x,yield this._y,yield this._z,yield this._w}}class L{constructor(t=0,e=0,i=0){L.prototype.isVector3=!0,this.x=t,this.y=e,this.z=i}set(t,e,i){return i===void 0&&(i=this.z),this.x=t,this.y=e,this.z=i,this}setScalar(t){return this.x=t,this.y=t,this.z=t,this}setX(t){return this.x=t,this}setY(t){return this.y=t,this}setZ(t){return this.z=t,this}setComponent(t,e){switch(t){case 0:this.x=e;break;case 1:this.y=e;break;case 2:this.z=e;break;default:throw new Error("index is out of range: "+t)}return this}getComponent(t){switch(t){case 0:return this.x;case 1:return this.y;case 2:return this.z;default:throw new Error("index is out of range: "+t)}}clone(){return new this.constructor(this.x,this.y,this.z)}copy(t){return this.x=t.x,this.y=t.y,this.z=t.z,this}add(t){return this.x+=t.x,this.y+=t.y,this.z+=t.z,this}addScalar(t){return this.x+=t,this.y+=t,this.z+=t,this}addVectors(t,e){return this.x=t.x+e.x,this.y=t.y+e.y,this.z=t.z+e.z,this}addScaledVector(t,e){return this.x+=t.x*e,this.y+=t.y*e,this.z+=t.z*e,this}sub(t){return this.x-=t.x,this.y-=t.y,this.z-=t.z,this}subScalar(t){return this.x-=t,this.y-=t,this.z-=t,this}subVectors(t,e){return this.x=t.x-e.x,this.y=t.y-e.y,this.z=t.z-e.z,this}multiply(t){return this.x*=t.x,this.y*=t.y,this.z*=t.z,this}multiplyScalar(t){return this.x*=t,this.y*=t,this.z*=t,this}multiplyVectors(t,e){return this.x=t.x*e.x,this.y=t.y*e.y,this.z=t.z*e.z,this}applyEuler(t){return this.applyQuaternion(hu.setFromEuler(t))}applyAxisAngle(t,e){return this.applyQuaternion(hu.setFromAxisAngle(t,e))}applyMatrix3(t){const e=this.x,i=this.y,s=this.z,r=t.elements;return this.x=r[0]*e+r[3]*i+r[6]*s,this.y=r[1]*e+r[4]*i+r[7]*s,this.z=r[2]*e+r[5]*i+r[8]*s,this}applyNormalMatrix(t){return this.applyMatrix3(t).normalize()}applyMatrix4(t){const e=this.x,i=this.y,s=this.z,r=t.elements,o=1/(r[3]*e+r[7]*i+r[11]*s+r[15]);return this.x=(r[0]*e+r[4]*i+r[8]*s+r[12])*o,this.y=(r[1]*e+r[5]*i+r[9]*s+r[13])*o,this.z=(r[2]*e+r[6]*i+r[10]*s+r[14])*o,this}applyQuaternion(t){const e=this.x,i=this.y,s=this.z,r=t.x,o=t.y,a=t.z,l=t.w,c=2*(o*s-a*i),h=2*(a*e-r*s),u=2*(r*i-o*e);return this.x=e+l*c+o*u-a*h,this.y=i+l*h+a*c-r*u,this.z=s+l*u+r*h-o*c,this}project(t){return this.applyMatrix4(t.matrixWorldInverse).applyMatrix4(t.projectionMatrix)}unproject(t){return this.applyMatrix4(t.projectionMatrixInverse).applyMatrix4(t.matrixWorld)}transformDirection(t){const e=this.x,i=this.y,s=this.z,r=t.elements;return this.x=r[0]*e+r[4]*i+r[8]*s,this.y=r[1]*e+r[5]*i+r[9]*s,this.z=r[2]*e+r[6]*i+r[10]*s,this.normalize()}divide(t){return this.x/=t.x,this.y/=t.y,this.z/=t.z,this}divideScalar(t){return this.multiplyScalar(1/t)}min(t){return this.x=Math.min(this.x,t.x),this.y=Math.min(this.y,t.y),this.z=Math.min(this.z,t.z),this}max(t){return this.x=Math.max(this.x,t.x),this.y=Math.max(this.y,t.y),this.z=Math.max(this.z,t.z),this}clamp(t,e){return this.x=Math.max(t.x,Math.min(e.x,this.x)),this.y=Math.max(t.y,Math.min(e.y,this.y)),this.z=Math.max(t.z,Math.min(e.z,this.z)),this}clampScalar(t,e){return this.x=Math.max(t,Math.min(e,this.x)),this.y=Math.max(t,Math.min(e,this.y)),this.z=Math.max(t,Math.min(e,this.z)),this}clampLength(t,e){const i=this.length();return this.divideScalar(i||1).multiplyScalar(Math.max(t,Math.min(e,i)))}floor(){return this.x=Math.floor(this.x),this.y=Math.floor(this.y),this.z=Math.floor(this.z),this}ceil(){return this.x=Math.ceil(this.x),this.y=Math.ceil(this.y),this.z=Math.ceil(this.z),this}round(){return this.x=Math.round(this.x),this.y=Math.round(this.y),this.z=Math.round(this.z),this}roundToZero(){return this.x=Math.trunc(this.x),this.y=Math.trunc(this.y),this.z=Math.trunc(this.z),this}negate(){return this.x=-this.x,this.y=-this.y,this.z=-this.z,this}dot(t){return this.x*t.x+this.y*t.y+this.z*t.z}lengthSq(){return this.x*this.x+this.y*this.y+this.z*this.z}length(){return Math.sqrt(this.x*this.x+this.y*this.y+this.z*this.z)}manhattanLength(){return Math.abs(this.x)+Math.abs(this.y)+Math.abs(this.z)}normalize(){return this.divideScalar(this.length()||1)}setLength(t){return this.normalize().multiplyScalar(t)}lerp(t,e){return this.x+=(t.x-this.x)*e,this.y+=(t.y-this.y)*e,this.z+=(t.z-this.z)*e,this}lerpVectors(t,e,i){return this.x=t.x+(e.x-t.x)*i,this.y=t.y+(e.y-t.y)*i,this.z=t.z+(e.z-t.z)*i,this}cross(t){return this.crossVectors(this,t)}crossVectors(t,e){const i=t.x,s=t.y,r=t.z,o=e.x,a=e.y,l=e.z;return this.x=s*l-r*a,this.y=r*o-i*l,this.z=i*a-s*o,this}projectOnVector(t){const e=t.lengthSq();if(e===0)return this.set(0,0,0);const i=t.dot(this)/e;return this.copy(t).multiplyScalar(i)}projectOnPlane(t){return dl.copy(this).projectOnVector(t),this.sub(dl)}reflect(t){return this.sub(dl.copy(t).multiplyScalar(2*this.dot(t)))}angleTo(t){const e=Math.sqrt(this.lengthSq()*t.lengthSq());if(e===0)return Math.PI/2;const i=this.dot(t)/e;return Math.acos(Je(i,-1,1))}distanceTo(t){return Math.sqrt(this.distanceToSquared(t))}distanceToSquared(t){const e=this.x-t.x,i=this.y-t.y,s=this.z-t.z;return e*e+i*i+s*s}manhattanDistanceTo(t){return Math.abs(this.x-t.x)+Math.abs(this.y-t.y)+Math.abs(this.z-t.z)}setFromSpherical(t){return this.setFromSphericalCoords(t.radius,t.phi,t.theta)}setFromSphericalCoords(t,e,i){const s=Math.sin(e)*t;return this.x=s*Math.sin(i),this.y=Math.cos(e)*t,this.z=s*Math.cos(i),this}setFromCylindrical(t){return this.setFromCylindricalCoords(t.radius,t.theta,t.y)}setFromCylindricalCoords(t,e,i){return this.x=t*Math.sin(e),this.y=i,this.z=t*Math.cos(e),this}setFromMatrixPosition(t){const e=t.elements;return this.x=e[12],this.y=e[13],this.z=e[14],this}setFromMatrixScale(t){const e=this.setFromMatrixColumn(t,0).length(),i=this.setFromMatrixColumn(t,1).length(),s=this.setFromMatrixColumn(t,2).length();return this.x=e,this.y=i,this.z=s,this}setFromMatrixColumn(t,e){return this.fromArray(t.elements,e*4)}setFromMatrix3Column(t,e){return this.fromArray(t.elements,e*3)}setFromEuler(t){return this.x=t._x,this.y=t._y,this.z=t._z,this}setFromColor(t){return this.x=t.r,this.y=t.g,this.z=t.b,this}equals(t){return t.x===this.x&&t.y===this.y&&t.z===this.z}fromArray(t,e=0){return this.x=t[e],this.y=t[e+1],this.z=t[e+2],this}toArray(t=[],e=0){return t[e]=this.x,t[e+1]=this.y,t[e+2]=this.z,t}fromBufferAttribute(t,e){return this.x=t.getX(e),this.y=t.getY(e),this.z=t.getZ(e),this}random(){return this.x=Math.random(),this.y=Math.random(),this.z=Math.random(),this}randomDirection(){const t=(Math.random()-.5)*2,e=Math.random()*Math.PI*2,i=Math.sqrt(1-t**2);return this.x=i*Math.cos(e),this.y=i*Math.sin(e),this.z=t,this}*[Symbol.iterator](){yield this.x,yield this.y,yield this.z}}const dl=new L,hu=new Sn;class $i{constructor(t=new L(1/0,1/0,1/0),e=new L(-1/0,-1/0,-1/0)){this.isBox3=!0,this.min=t,this.max=e}set(t,e){return this.min.copy(t),this.max.copy(e),this}setFromArray(t){this.makeEmpty();for(let e=0,i=t.length;e<i;e+=3)this.expandByPoint(Un.fromArray(t,e));return this}setFromBufferAttribute(t){this.makeEmpty();for(let e=0,i=t.count;e<i;e++)this.expandByPoint(Un.fromBufferAttribute(t,e));return this}setFromPoints(t){this.makeEmpty();for(let e=0,i=t.length;e<i;e++)this.expandByPoint(t[e]);return this}setFromCenterAndSize(t,e){const i=Un.copy(e).multiplyScalar(.5);return this.min.copy(t).sub(i),this.max.copy(t).add(i),this}setFromObject(t,e=!1){return this.makeEmpty(),this.expandByObject(t,e)}clone(){return new this.constructor().copy(this)}copy(t){return this.min.copy(t.min),this.max.copy(t.max),this}makeEmpty(){return this.min.x=this.min.y=this.min.z=1/0,this.max.x=this.max.y=this.max.z=-1/0,this}isEmpty(){return this.max.x<this.min.x||this.max.y<this.min.y||this.max.z<this.min.z}getCenter(t){return this.isEmpty()?t.set(0,0,0):t.addVectors(this.min,this.max).multiplyScalar(.5)}getSize(t){return this.isEmpty()?t.set(0,0,0):t.subVectors(this.max,this.min)}expandByPoint(t){return this.min.min(t),this.max.max(t),this}expandByVector(t){return this.min.sub(t),this.max.add(t),this}expandByScalar(t){return this.min.addScalar(-t),this.max.addScalar(t),this}expandByObject(t,e=!1){t.updateWorldMatrix(!1,!1);const i=t.geometry;if(i!==void 0){const r=i.getAttribute("position");if(e===!0&&r!==void 0&&t.isInstancedMesh!==!0)for(let o=0,a=r.count;o<a;o++)t.isMesh===!0?t.getVertexPosition(o,Un):Un.fromBufferAttribute(r,o),Un.applyMatrix4(t.matrixWorld),this.expandByPoint(Un);else t.boundingBox!==void 0?(t.boundingBox===null&&t.computeBoundingBox(),mo.copy(t.boundingBox)):(i.boundingBox===null&&i.computeBoundingBox(),mo.copy(i.boundingBox)),mo.applyMatrix4(t.matrixWorld),this.union(mo)}const s=t.children;for(let r=0,o=s.length;r<o;r++)this.expandByObject(s[r],e);return this}containsPoint(t){return!(t.x<this.min.x||t.x>this.max.x||t.y<this.min.y||t.y>this.max.y||t.z<this.min.z||t.z>this.max.z)}containsBox(t){return this.min.x<=t.min.x&&t.max.x<=this.max.x&&this.min.y<=t.min.y&&t.max.y<=this.max.y&&this.min.z<=t.min.z&&t.max.z<=this.max.z}getParameter(t,e){return e.set((t.x-this.min.x)/(this.max.x-this.min.x),(t.y-this.min.y)/(this.max.y-this.min.y),(t.z-this.min.z)/(this.max.z-this.min.z))}intersectsBox(t){return!(t.max.x<this.min.x||t.min.x>this.max.x||t.max.y<this.min.y||t.min.y>this.max.y||t.max.z<this.min.z||t.min.z>this.max.z)}intersectsSphere(t){return this.clampPoint(t.center,Un),Un.distanceToSquared(t.center)<=t.radius*t.radius}intersectsPlane(t){let e,i;return t.normal.x>0?(e=t.normal.x*this.min.x,i=t.normal.x*this.max.x):(e=t.normal.x*this.max.x,i=t.normal.x*this.min.x),t.normal.y>0?(e+=t.normal.y*this.min.y,i+=t.normal.y*this.max.y):(e+=t.normal.y*this.max.y,i+=t.normal.y*this.min.y),t.normal.z>0?(e+=t.normal.z*this.min.z,i+=t.normal.z*this.max.z):(e+=t.normal.z*this.max.z,i+=t.normal.z*this.min.z),e<=-t.constant&&i>=-t.constant}intersectsTriangle(t){if(this.isEmpty())return!1;this.getCenter(dr),go.subVectors(this.max,dr),Cs.subVectors(t.a,dr),Rs.subVectors(t.b,dr),Ps.subVectors(t.c,dr),Ai.subVectors(Rs,Cs),Ci.subVectors(Ps,Rs),Ki.subVectors(Cs,Ps);let e=[0,-Ai.z,Ai.y,0,-Ci.z,Ci.y,0,-Ki.z,Ki.y,Ai.z,0,-Ai.x,Ci.z,0,-Ci.x,Ki.z,0,-Ki.x,-Ai.y,Ai.x,0,-Ci.y,Ci.x,0,-Ki.y,Ki.x,0];return!fl(e,Cs,Rs,Ps,go)||(e=[1,0,0,0,1,0,0,0,1],!fl(e,Cs,Rs,Ps,go))?!1:(_o.crossVectors(Ai,Ci),e=[_o.x,_o.y,_o.z],fl(e,Cs,Rs,Ps,go))}clampPoint(t,e){return e.copy(t).clamp(this.min,this.max)}distanceToPoint(t){return this.clampPoint(t,Un).distanceTo(t)}getBoundingSphere(t){return this.isEmpty()?t.makeEmpty():(this.getCenter(t.center),t.radius=this.getSize(Un).length()*.5),t}intersect(t){return this.min.max(t.min),this.max.min(t.max),this.isEmpty()&&this.makeEmpty(),this}union(t){return this.min.min(t.min),this.max.max(t.max),this}applyMatrix4(t){return this.isEmpty()?this:(oi[0].set(this.min.x,this.min.y,this.min.z).applyMatrix4(t),oi[1].set(this.min.x,this.min.y,this.max.z).applyMatrix4(t),oi[2].set(this.min.x,this.max.y,this.min.z).applyMatrix4(t),oi[3].set(this.min.x,this.max.y,this.max.z).applyMatrix4(t),oi[4].set(this.max.x,this.min.y,this.min.z).applyMatrix4(t),oi[5].set(this.max.x,this.min.y,this.max.z).applyMatrix4(t),oi[6].set(this.max.x,this.max.y,this.min.z).applyMatrix4(t),oi[7].set(this.max.x,this.max.y,this.max.z).applyMatrix4(t),this.setFromPoints(oi),this)}translate(t){return this.min.add(t),this.max.add(t),this}equals(t){return t.min.equals(this.min)&&t.max.equals(this.max)}}const oi=[new L,new L,new L,new L,new L,new L,new L,new L],Un=new L,mo=new $i,Cs=new L,Rs=new L,Ps=new L,Ai=new L,Ci=new L,Ki=new L,dr=new L,go=new L,_o=new L,Zi=new L;function fl(n,t,e,i,s){for(let r=0,o=n.length-3;r<=o;r+=3){Zi.fromArray(n,r);const a=s.x*Math.abs(Zi.x)+s.y*Math.abs(Zi.y)+s.z*Math.abs(Zi.z),l=t.dot(Zi),c=e.dot(Zi),h=i.dot(Zi);if(Math.max(-Math.max(l,c,h),Math.min(l,c,h))>a)return!1}return!0}const yg=new $i,fr=new L,pl=new L;class Ls{constructor(t=new L,e=-1){this.isSphere=!0,this.center=t,this.radius=e}set(t,e){return this.center.copy(t),this.radius=e,this}setFromPoints(t,e){const i=this.center;e!==void 0?i.copy(e):yg.setFromPoints(t).getCenter(i);let s=0;for(let r=0,o=t.length;r<o;r++)s=Math.max(s,i.distanceToSquared(t[r]));return this.radius=Math.sqrt(s),this}copy(t){return this.center.copy(t.center),this.radius=t.radius,this}isEmpty(){return this.radius<0}makeEmpty(){return this.center.set(0,0,0),this.radius=-1,this}containsPoint(t){return t.distanceToSquared(this.center)<=this.radius*this.radius}distanceToPoint(t){return t.distanceTo(this.center)-this.radius}intersectsSphere(t){const e=this.radius+t.radius;return t.center.distanceToSquared(this.center)<=e*e}intersectsBox(t){return t.intersectsSphere(this)}intersectsPlane(t){return Math.abs(t.distanceToPoint(this.center))<=this.radius}clampPoint(t,e){const i=this.center.distanceToSquared(t);return e.copy(t),i>this.radius*this.radius&&(e.sub(this.center).normalize(),e.multiplyScalar(this.radius).add(this.center)),e}getBoundingBox(t){return this.isEmpty()?(t.makeEmpty(),t):(t.set(this.center,this.center),t.expandByScalar(this.radius),t)}applyMatrix4(t){return this.center.applyMatrix4(t),this.radius=this.radius*t.getMaxScaleOnAxis(),this}translate(t){return this.center.add(t),this}expandByPoint(t){if(this.isEmpty())return this.center.copy(t),this.radius=0,this;fr.subVectors(t,this.center);const e=fr.lengthSq();if(e>this.radius*this.radius){const i=Math.sqrt(e),s=(i-this.radius)*.5;this.center.addScaledVector(fr,s/i),this.radius+=s}return this}union(t){return t.isEmpty()?this:this.isEmpty()?(this.copy(t),this):(this.center.equals(t.center)===!0?this.radius=Math.max(this.radius,t.radius):(pl.subVectors(t.center,this.center).setLength(t.radius),this.expandByPoint(fr.copy(t.center).add(pl)),this.expandByPoint(fr.copy(t.center).sub(pl))),this)}equals(t){return t.center.equals(this.center)&&t.radius===this.radius}clone(){return new this.constructor().copy(this)}}const ai=new L,ml=new L,xo=new L,Ri=new L,gl=new L,vo=new L,_l=new L;class bo{constructor(t=new L,e=new L(0,0,-1)){this.origin=t,this.direction=e}set(t,e){return this.origin.copy(t),this.direction.copy(e),this}copy(t){return this.origin.copy(t.origin),this.direction.copy(t.direction),this}at(t,e){return e.copy(this.origin).addScaledVector(this.direction,t)}lookAt(t){return this.direction.copy(t).sub(this.origin).normalize(),this}recast(t){return this.origin.copy(this.at(t,ai)),this}closestPointToPoint(t,e){e.subVectors(t,this.origin);const i=e.dot(this.direction);return i<0?e.copy(this.origin):e.copy(this.origin).addScaledVector(this.direction,i)}distanceToPoint(t){return Math.sqrt(this.distanceSqToPoint(t))}distanceSqToPoint(t){const e=ai.subVectors(t,this.origin).dot(this.direction);return e<0?this.origin.distanceToSquared(t):(ai.copy(this.origin).addScaledVector(this.direction,e),ai.distanceToSquared(t))}distanceSqToSegment(t,e,i,s){ml.copy(t).add(e).multiplyScalar(.5),xo.copy(e).sub(t).normalize(),Ri.copy(this.origin).sub(ml);const r=t.distanceTo(e)*.5,o=-this.direction.dot(xo),a=Ri.dot(this.direction),l=-Ri.dot(xo),c=Ri.lengthSq(),h=Math.abs(1-o*o);let u,d,f,g;if(h>0)if(u=o*l-a,d=o*a-l,g=r*h,u>=0)if(d>=-g)if(d<=g){const _=1/h;u*=_,d*=_,f=u*(u+o*d+2*a)+d*(o*u+d+2*l)+c}else d=r,u=Math.max(0,-(o*d+a)),f=-u*u+d*(d+2*l)+c;else d=-r,u=Math.max(0,-(o*d+a)),f=-u*u+d*(d+2*l)+c;else d<=-g?(u=Math.max(0,-(-o*r+a)),d=u>0?-r:Math.min(Math.max(-r,-l),r),f=-u*u+d*(d+2*l)+c):d<=g?(u=0,d=Math.min(Math.max(-r,-l),r),f=d*(d+2*l)+c):(u=Math.max(0,-(o*r+a)),d=u>0?r:Math.min(Math.max(-r,-l),r),f=-u*u+d*(d+2*l)+c);else d=o>0?-r:r,u=Math.max(0,-(o*d+a)),f=-u*u+d*(d+2*l)+c;return i&&i.copy(this.origin).addScaledVector(this.direction,u),s&&s.copy(ml).addScaledVector(xo,d),f}intersectSphere(t,e){ai.subVectors(t.center,this.origin);const i=ai.dot(this.direction),s=ai.dot(ai)-i*i,r=t.radius*t.radius;if(s>r)return null;const o=Math.sqrt(r-s),a=i-o,l=i+o;return l<0?null:a<0?this.at(l,e):this.at(a,e)}intersectsSphere(t){return this.distanceSqToPoint(t.center)<=t.radius*t.radius}distanceToPlane(t){const e=t.normal.dot(this.direction);if(e===0)return t.distanceToPoint(this.origin)===0?0:null;const i=-(this.origin.dot(t.normal)+t.constant)/e;return i>=0?i:null}intersectPlane(t,e){const i=this.distanceToPlane(t);return i===null?null:this.at(i,e)}intersectsPlane(t){const e=t.distanceToPoint(this.origin);return e===0||t.normal.dot(this.direction)*e<0}intersectBox(t,e){let i,s,r,o,a,l;const c=1/this.direction.x,h=1/this.direction.y,u=1/this.direction.z,d=this.origin;return c>=0?(i=(t.min.x-d.x)*c,s=(t.max.x-d.x)*c):(i=(t.max.x-d.x)*c,s=(t.min.x-d.x)*c),h>=0?(r=(t.min.y-d.y)*h,o=(t.max.y-d.y)*h):(r=(t.max.y-d.y)*h,o=(t.min.y-d.y)*h),i>o||r>s||((r>i||isNaN(i))&&(i=r),(o<s||isNaN(s))&&(s=o),u>=0?(a=(t.min.z-d.z)*u,l=(t.max.z-d.z)*u):(a=(t.max.z-d.z)*u,l=(t.min.z-d.z)*u),i>l||a>s)||((a>i||i!==i)&&(i=a),(l<s||s!==s)&&(s=l),s<0)?null:this.at(i>=0?i:s,e)}intersectsBox(t){return this.intersectBox(t,ai)!==null}intersectTriangle(t,e,i,s,r){gl.subVectors(e,t),vo.subVectors(i,t),_l.crossVectors(gl,vo);let o=this.direction.dot(_l),a;if(o>0){if(s)return null;a=1}else if(o<0)a=-1,o=-o;else return null;Ri.subVectors(this.origin,t);const l=a*this.direction.dot(vo.crossVectors(Ri,vo));if(l<0)return null;const c=a*this.direction.dot(gl.cross(Ri));if(c<0||l+c>o)return null;const h=-a*Ri.dot(_l);return h<0?null:this.at(h/o,r)}applyMatrix4(t){return this.origin.applyMatrix4(t),this.direction.transformDirection(t),this}equals(t){return t.origin.equals(this.origin)&&t.direction.equals(this.direction)}clone(){return new this.constructor().copy(this)}}class ge{constructor(t,e,i,s,r,o,a,l,c,h,u,d,f,g,_,m){ge.prototype.isMatrix4=!0,this.elements=[1,0,0,0,0,1,0,0,0,0,1,0,0,0,0,1],t!==void 0&&this.set(t,e,i,s,r,o,a,l,c,h,u,d,f,g,_,m)}set(t,e,i,s,r,o,a,l,c,h,u,d,f,g,_,m){const p=this.elements;return p[0]=t,p[4]=e,p[8]=i,p[12]=s,p[1]=r,p[5]=o,p[9]=a,p[13]=l,p[2]=c,p[6]=h,p[10]=u,p[14]=d,p[3]=f,p[7]=g,p[11]=_,p[15]=m,this}identity(){return this.set(1,0,0,0,0,1,0,0,0,0,1,0,0,0,0,1),this}clone(){return new ge().fromArray(this.elements)}copy(t){const e=this.elements,i=t.elements;return e[0]=i[0],e[1]=i[1],e[2]=i[2],e[3]=i[3],e[4]=i[4],e[5]=i[5],e[6]=i[6],e[7]=i[7],e[8]=i[8],e[9]=i[9],e[10]=i[10],e[11]=i[11],e[12]=i[12],e[13]=i[13],e[14]=i[14],e[15]=i[15],this}copyPosition(t){const e=this.elements,i=t.elements;return e[12]=i[12],e[13]=i[13],e[14]=i[14],this}setFromMatrix3(t){const e=t.elements;return this.set(e[0],e[3],e[6],0,e[1],e[4],e[7],0,e[2],e[5],e[8],0,0,0,0,1),this}extractBasis(t,e,i){return t.setFromMatrixColumn(this,0),e.setFromMatrixColumn(this,1),i.setFromMatrixColumn(this,2),this}makeBasis(t,e,i){return this.set(t.x,e.x,i.x,0,t.y,e.y,i.y,0,t.z,e.z,i.z,0,0,0,0,1),this}extractRotation(t){const e=this.elements,i=t.elements,s=1/Ds.setFromMatrixColumn(t,0).length(),r=1/Ds.setFromMatrixColumn(t,1).length(),o=1/Ds.setFromMatrixColumn(t,2).length();return e[0]=i[0]*s,e[1]=i[1]*s,e[2]=i[2]*s,e[3]=0,e[4]=i[4]*r,e[5]=i[5]*r,e[6]=i[6]*r,e[7]=0,e[8]=i[8]*o,e[9]=i[9]*o,e[10]=i[10]*o,e[11]=0,e[12]=0,e[13]=0,e[14]=0,e[15]=1,this}makeRotationFromEuler(t){const e=this.elements,i=t.x,s=t.y,r=t.z,o=Math.cos(i),a=Math.sin(i),l=Math.cos(s),c=Math.sin(s),h=Math.cos(r),u=Math.sin(r);if(t.order==="XYZ"){const d=o*h,f=o*u,g=a*h,_=a*u;e[0]=l*h,e[4]=-l*u,e[8]=c,e[1]=f+g*c,e[5]=d-_*c,e[9]=-a*l,e[2]=_-d*c,e[6]=g+f*c,e[10]=o*l}else if(t.order==="YXZ"){const d=l*h,f=l*u,g=c*h,_=c*u;e[0]=d+_*a,e[4]=g*a-f,e[8]=o*c,e[1]=o*u,e[5]=o*h,e[9]=-a,e[2]=f*a-g,e[6]=_+d*a,e[10]=o*l}else if(t.order==="ZXY"){const d=l*h,f=l*u,g=c*h,_=c*u;e[0]=d-_*a,e[4]=-o*u,e[8]=g+f*a,e[1]=f+g*a,e[5]=o*h,e[9]=_-d*a,e[2]=-o*c,e[6]=a,e[10]=o*l}else if(t.order==="ZYX"){const d=o*h,f=o*u,g=a*h,_=a*u;e[0]=l*h,e[4]=g*c-f,e[8]=d*c+_,e[1]=l*u,e[5]=_*c+d,e[9]=f*c-g,e[2]=-c,e[6]=a*l,e[10]=o*l}else if(t.order==="YZX"){const d=o*l,f=o*c,g=a*l,_=a*c;e[0]=l*h,e[4]=_-d*u,e[8]=g*u+f,e[1]=u,e[5]=o*h,e[9]=-a*h,e[2]=-c*h,e[6]=f*u+g,e[10]=d-_*u}else if(t.order==="XZY"){const d=o*l,f=o*c,g=a*l,_=a*c;e[0]=l*h,e[4]=-u,e[8]=c*h,e[1]=d*u+_,e[5]=o*h,e[9]=f*u-g,e[2]=g*u-f,e[6]=a*h,e[10]=_*u+d}return e[3]=0,e[7]=0,e[11]=0,e[12]=0,e[13]=0,e[14]=0,e[15]=1,this}makeRotationFromQuaternion(t){return this.compose(Sg,t,Eg)}lookAt(t,e,i){const s=this.elements;return pn.subVectors(t,e),pn.lengthSq()===0&&(pn.z=1),pn.normalize(),Pi.crossVectors(i,pn),Pi.lengthSq()===0&&(Math.abs(i.z)===1?pn.x+=1e-4:pn.z+=1e-4,pn.normalize(),Pi.crossVectors(i,pn)),Pi.normalize(),Mo.crossVectors(pn,Pi),s[0]=Pi.x,s[4]=Mo.x,s[8]=pn.x,s[1]=Pi.y,s[5]=Mo.y,s[9]=pn.y,s[2]=Pi.z,s[6]=Mo.z,s[10]=pn.z,this}multiply(t){return this.multiplyMatrices(this,t)}premultiply(t){return this.multiplyMatrices(t,this)}multiplyMatrices(t,e){const i=t.elements,s=e.elements,r=this.elements,o=i[0],a=i[4],l=i[8],c=i[12],h=i[1],u=i[5],d=i[9],f=i[13],g=i[2],_=i[6],m=i[10],p=i[14],v=i[3],x=i[7],y=i[11],b=i[15],E=s[0],S=s[4],C=s[8],M=s[12],w=s[1],U=s[5],O=s[9],Z=s[13],D=s[2],F=s[6],V=s[10],$=s[14],K=s[3],Y=s[7],Q=s[11],et=s[15];return r[0]=o*E+a*w+l*D+c*K,r[4]=o*S+a*U+l*F+c*Y,r[8]=o*C+a*O+l*V+c*Q,r[12]=o*M+a*Z+l*$+c*et,r[1]=h*E+u*w+d*D+f*K,r[5]=h*S+u*U+d*F+f*Y,r[9]=h*C+u*O+d*V+f*Q,r[13]=h*M+u*Z+d*$+f*et,r[2]=g*E+_*w+m*D+p*K,r[6]=g*S+_*U+m*F+p*Y,r[10]=g*C+_*O+m*V+p*Q,r[14]=g*M+_*Z+m*$+p*et,r[3]=v*E+x*w+y*D+b*K,r[7]=v*S+x*U+y*F+b*Y,r[11]=v*C+x*O+y*V+b*Q,r[15]=v*M+x*Z+y*$+b*et,this}multiplyScalar(t){const e=this.elements;return e[0]*=t,e[4]*=t,e[8]*=t,e[12]*=t,e[1]*=t,e[5]*=t,e[9]*=t,e[13]*=t,e[2]*=t,e[6]*=t,e[10]*=t,e[14]*=t,e[3]*=t,e[7]*=t,e[11]*=t,e[15]*=t,this}determinant(){const t=this.elements,e=t[0],i=t[4],s=t[8],r=t[12],o=t[1],a=t[5],l=t[9],c=t[13],h=t[2],u=t[6],d=t[10],f=t[14],g=t[3],_=t[7],m=t[11],p=t[15];return g*(+r*l*u-s*c*u-r*a*d+i*c*d+s*a*f-i*l*f)+_*(+e*l*f-e*c*d+r*o*d-s*o*f+s*c*h-r*l*h)+m*(+e*c*u-e*a*f-r*o*u+i*o*f+r*a*h-i*c*h)+p*(-s*a*h-e*l*u+e*a*d+s*o*u-i*o*d+i*l*h)}transpose(){const t=this.elements;let e;return e=t[1],t[1]=t[4],t[4]=e,e=t[2],t[2]=t[8],t[8]=e,e=t[6],t[6]=t[9],t[9]=e,e=t[3],t[3]=t[12],t[12]=e,e=t[7],t[7]=t[13],t[13]=e,e=t[11],t[11]=t[14],t[14]=e,this}setPosition(t,e,i){const s=this.elements;return t.isVector3?(s[12]=t.x,s[13]=t.y,s[14]=t.z):(s[12]=t,s[13]=e,s[14]=i),this}invert(){const t=this.elements,e=t[0],i=t[1],s=t[2],r=t[3],o=t[4],a=t[5],l=t[6],c=t[7],h=t[8],u=t[9],d=t[10],f=t[11],g=t[12],_=t[13],m=t[14],p=t[15],v=u*m*c-_*d*c+_*l*f-a*m*f-u*l*p+a*d*p,x=g*d*c-h*m*c-g*l*f+o*m*f+h*l*p-o*d*p,y=h*_*c-g*u*c+g*a*f-o*_*f-h*a*p+o*u*p,b=g*u*l-h*_*l-g*a*d+o*_*d+h*a*m-o*u*m,E=e*v+i*x+s*y+r*b;if(E===0)return this.set(0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0);const S=1/E;return t[0]=v*S,t[1]=(_*d*r-u*m*r-_*s*f+i*m*f+u*s*p-i*d*p)*S,t[2]=(a*m*r-_*l*r+_*s*c-i*m*c-a*s*p+i*l*p)*S,t[3]=(u*l*r-a*d*r-u*s*c+i*d*c+a*s*f-i*l*f)*S,t[4]=x*S,t[5]=(h*m*r-g*d*r+g*s*f-e*m*f-h*s*p+e*d*p)*S,t[6]=(g*l*r-o*m*r-g*s*c+e*m*c+o*s*p-e*l*p)*S,t[7]=(o*d*r-h*l*r+h*s*c-e*d*c-o*s*f+e*l*f)*S,t[8]=y*S,t[9]=(g*u*r-h*_*r-g*i*f+e*_*f+h*i*p-e*u*p)*S,t[10]=(o*_*r-g*a*r+g*i*c-e*_*c-o*i*p+e*a*p)*S,t[11]=(h*a*r-o*u*r-h*i*c+e*u*c+o*i*f-e*a*f)*S,t[12]=b*S,t[13]=(h*_*s-g*u*s+g*i*d-e*_*d-h*i*m+e*u*m)*S,t[14]=(g*a*s-o*_*s-g*i*l+e*_*l+o*i*m-e*a*m)*S,t[15]=(o*u*s-h*a*s+h*i*l-e*u*l-o*i*d+e*a*d)*S,this}scale(t){const e=this.elements,i=t.x,s=t.y,r=t.z;return e[0]*=i,e[4]*=s,e[8]*=r,e[1]*=i,e[5]*=s,e[9]*=r,e[2]*=i,e[6]*=s,e[10]*=r,e[3]*=i,e[7]*=s,e[11]*=r,this}getMaxScaleOnAxis(){const t=this.elements,e=t[0]*t[0]+t[1]*t[1]+t[2]*t[2],i=t[4]*t[4]+t[5]*t[5]+t[6]*t[6],s=t[8]*t[8]+t[9]*t[9]+t[10]*t[10];return Math.sqrt(Math.max(e,i,s))}makeTranslation(t,e,i){return t.isVector3?this.set(1,0,0,t.x,0,1,0,t.y,0,0,1,t.z,0,0,0,1):this.set(1,0,0,t,0,1,0,e,0,0,1,i,0,0,0,1),this}makeRotationX(t){const e=Math.cos(t),i=Math.sin(t);return this.set(1,0,0,0,0,e,-i,0,0,i,e,0,0,0,0,1),this}makeRotationY(t){const e=Math.cos(t),i=Math.sin(t);return this.set(e,0,i,0,0,1,0,0,-i,0,e,0,0,0,0,1),this}makeRotationZ(t){const e=Math.cos(t),i=Math.sin(t);return this.set(e,-i,0,0,i,e,0,0,0,0,1,0,0,0,0,1),this}makeRotationAxis(t,e){const i=Math.cos(e),s=Math.sin(e),r=1-i,o=t.x,a=t.y,l=t.z,c=r*o,h=r*a;return this.set(c*o+i,c*a-s*l,c*l+s*a,0,c*a+s*l,h*a+i,h*l-s*o,0,c*l-s*a,h*l+s*o,r*l*l+i,0,0,0,0,1),this}makeScale(t,e,i){return this.set(t,0,0,0,0,e,0,0,0,0,i,0,0,0,0,1),this}makeShear(t,e,i,s,r,o){return this.set(1,i,r,0,t,1,o,0,e,s,1,0,0,0,0,1),this}compose(t,e,i){const s=this.elements,r=e._x,o=e._y,a=e._z,l=e._w,c=r+r,h=o+o,u=a+a,d=r*c,f=r*h,g=r*u,_=o*h,m=o*u,p=a*u,v=l*c,x=l*h,y=l*u,b=i.x,E=i.y,S=i.z;return s[0]=(1-(_+p))*b,s[1]=(f+y)*b,s[2]=(g-x)*b,s[3]=0,s[4]=(f-y)*E,s[5]=(1-(d+p))*E,s[6]=(m+v)*E,s[7]=0,s[8]=(g+x)*S,s[9]=(m-v)*S,s[10]=(1-(d+_))*S,s[11]=0,s[12]=t.x,s[13]=t.y,s[14]=t.z,s[15]=1,this}decompose(t,e,i){const s=this.elements;let r=Ds.set(s[0],s[1],s[2]).length();const o=Ds.set(s[4],s[5],s[6]).length(),a=Ds.set(s[8],s[9],s[10]).length();this.determinant()<0&&(r=-r),t.x=s[12],t.y=s[13],t.z=s[14],Fn.copy(this);const c=1/r,h=1/o,u=1/a;return Fn.elements[0]*=c,Fn.elements[1]*=c,Fn.elements[2]*=c,Fn.elements[4]*=h,Fn.elements[5]*=h,Fn.elements[6]*=h,Fn.elements[8]*=u,Fn.elements[9]*=u,Fn.elements[10]*=u,e.setFromRotationMatrix(Fn),i.x=r,i.y=o,i.z=a,this}makePerspective(t,e,i,s,r,o,a=ri){const l=this.elements,c=2*r/(e-t),h=2*r/(i-s),u=(e+t)/(e-t),d=(i+s)/(i-s);let f,g;if(a===ri)f=-(o+r)/(o-r),g=-2*o*r/(o-r);else if(a===uo)f=-o/(o-r),g=-o*r/(o-r);else throw new Error("THREE.Matrix4.makePerspective(): Invalid coordinate system: "+a);return l[0]=c,l[4]=0,l[8]=u,l[12]=0,l[1]=0,l[5]=h,l[9]=d,l[13]=0,l[2]=0,l[6]=0,l[10]=f,l[14]=g,l[3]=0,l[7]=0,l[11]=-1,l[15]=0,this}makeOrthographic(t,e,i,s,r,o,a=ri){const l=this.elements,c=1/(e-t),h=1/(i-s),u=1/(o-r),d=(e+t)*c,f=(i+s)*h;let g,_;if(a===ri)g=(o+r)*u,_=-2*u;else if(a===uo)g=r*u,_=-1*u;else throw new Error("THREE.Matrix4.makeOrthographic(): Invalid coordinate system: "+a);return l[0]=2*c,l[4]=0,l[8]=0,l[12]=-d,l[1]=0,l[5]=2*h,l[9]=0,l[13]=-f,l[2]=0,l[6]=0,l[10]=_,l[14]=-g,l[3]=0,l[7]=0,l[11]=0,l[15]=1,this}equals(t){const e=this.elements,i=t.elements;for(let s=0;s<16;s++)if(e[s]!==i[s])return!1;return!0}fromArray(t,e=0){for(let i=0;i<16;i++)this.elements[i]=t[i+e];return this}toArray(t=[],e=0){const i=this.elements;return t[e]=i[0],t[e+1]=i[1],t[e+2]=i[2],t[e+3]=i[3],t[e+4]=i[4],t[e+5]=i[5],t[e+6]=i[6],t[e+7]=i[7],t[e+8]=i[8],t[e+9]=i[9],t[e+10]=i[10],t[e+11]=i[11],t[e+12]=i[12],t[e+13]=i[13],t[e+14]=i[14],t[e+15]=i[15],t}}const Ds=new L,Fn=new ge,Sg=new L(0,0,0),Eg=new L(1,1,1),Pi=new L,Mo=new L,pn=new L,uu=new ge,du=new Sn;class yo{constructor(t=0,e=0,i=0,s=yo.DEFAULT_ORDER){this.isEuler=!0,this._x=t,this._y=e,this._z=i,this._order=s}get x(){return this._x}set x(t){this._x=t,this._onChangeCallback()}get y(){return this._y}set y(t){this._y=t,this._onChangeCallback()}get z(){return this._z}set z(t){this._z=t,this._onChangeCallback()}get order(){return this._order}set order(t){this._order=t,this._onChangeCallback()}set(t,e,i,s=this._order){return this._x=t,this._y=e,this._z=i,this._order=s,this._onChangeCallback(),this}clone(){return new this.constructor(this._x,this._y,this._z,this._order)}copy(t){return this._x=t._x,this._y=t._y,this._z=t._z,this._order=t._order,this._onChangeCallback(),this}setFromRotationMatrix(t,e=this._order,i=!0){const s=t.elements,r=s[0],o=s[4],a=s[8],l=s[1],c=s[5],h=s[9],u=s[2],d=s[6],f=s[10];switch(e){case"XYZ":this._y=Math.asin(Je(a,-1,1)),Math.abs(a)<.9999999?(this._x=Math.atan2(-h,f),this._z=Math.atan2(-o,r)):(this._x=Math.atan2(d,c),this._z=0);break;case"YXZ":this._x=Math.asin(-Je(h,-1,1)),Math.abs(h)<.9999999?(this._y=Math.atan2(a,f),this._z=Math.atan2(l,c)):(this._y=Math.atan2(-u,r),this._z=0);break;case"ZXY":this._x=Math.asin(Je(d,-1,1)),Math.abs(d)<.9999999?(this._y=Math.atan2(-u,f),this._z=Math.atan2(-o,c)):(this._y=0,this._z=Math.atan2(l,r));break;case"ZYX":this._y=Math.asin(-Je(u,-1,1)),Math.abs(u)<.9999999?(this._x=Math.atan2(d,f),this._z=Math.atan2(l,r)):(this._x=0,this._z=Math.atan2(-o,c));break;case"YZX":this._z=Math.asin(Je(l,-1,1)),Math.abs(l)<.9999999?(this._x=Math.atan2(-h,c),this._y=Math.atan2(-u,r)):(this._x=0,this._y=Math.atan2(a,f));break;case"XZY":this._z=Math.asin(-Je(o,-1,1)),Math.abs(o)<.9999999?(this._x=Math.atan2(d,c),this._y=Math.atan2(a,r)):(this._x=Math.atan2(-h,f),this._y=0);break;default:console.warn("THREE.Euler: .setFromRotationMatrix() encountered an unknown order: "+e)}return this._order=e,i===!0&&this._onChangeCallback(),this}setFromQuaternion(t,e,i){return uu.makeRotationFromQuaternion(t),this.setFromRotationMatrix(uu,e,i)}setFromVector3(t,e=this._order){return this.set(t.x,t.y,t.z,e)}reorder(t){return du.setFromEuler(this),this.setFromQuaternion(du,t)}equals(t){return t._x===this._x&&t._y===this._y&&t._z===this._z&&t._order===this._order}fromArray(t){return this._x=t[0],this._y=t[1],this._z=t[2],t[3]!==void 0&&(this._order=t[3]),this._onChangeCallback(),this}toArray(t=[],e=0){return t[e]=this._x,t[e+1]=this._y,t[e+2]=this._z,t[e+3]=this._order,t}_onChange(t){return this._onChangeCallback=t,this}_onChangeCallback(){}*[Symbol.iterator](){yield this._x,yield this._y,yield this._z,yield this._order}}yo.DEFAULT_ORDER="XYZ";class xl{constructor(){this.mask=1}set(t){this.mask=(1<<t|0)>>>0}enable(t){this.mask|=1<<t|0}enableAll(){this.mask=-1}toggle(t){this.mask^=1<<t|0}disable(t){this.mask&=~(1<<t|0)}disableAll(){this.mask=0}test(t){return(this.mask&t.mask)!==0}isEnabled(t){return(this.mask&(1<<t|0))!==0}}let Tg=0;const fu=new L,Is=new Sn,li=new ge,So=new L,pr=new L,wg=new L,Ag=new Sn,pu=new L(1,0,0),mu=new L(0,1,0),gu=new L(0,0,1),Cg={type:"added"},Rg={type:"removed"};class Fe extends qi{constructor(){super(),this.isObject3D=!0,Object.defineProperty(this,"id",{value:Tg++}),this.uuid=cr(),this.name="",this.type="Object3D",this.parent=null,this.children=[],this.up=Fe.DEFAULT_UP.clone();const t=new L,e=new yo,i=new Sn,s=new L(1,1,1);function r(){i.setFromEuler(e,!1)}function o(){e.setFromQuaternion(i,void 0,!1)}e._onChange(r),i._onChange(o),Object.defineProperties(this,{position:{configurable:!0,enumerable:!0,value:t},rotation:{configurable:!0,enumerable:!0,value:e},quaternion:{configurable:!0,enumerable:!0,value:i},scale:{configurable:!0,enumerable:!0,value:s},modelViewMatrix:{value:new ge},normalMatrix:{value:new Yt}}),this.matrix=new ge,this.matrixWorld=new ge,this.matrixAutoUpdate=Fe.DEFAULT_MATRIX_AUTO_UPDATE,this.matrixWorldAutoUpdate=Fe.DEFAULT_MATRIX_WORLD_AUTO_UPDATE,this.matrixWorldNeedsUpdate=!1,this.layers=new xl,this.visible=!0,this.castShadow=!1,this.receiveShadow=!1,this.frustumCulled=!0,this.renderOrder=0,this.animations=[],this.userData={}}onBeforeShadow(){}onAfterShadow(){}onBeforeRender(){}onAfterRender(){}applyMatrix4(t){this.matrixAutoUpdate&&this.updateMatrix(),this.matrix.premultiply(t),this.matrix.decompose(this.position,this.quaternion,this.scale)}applyQuaternion(t){return this.quaternion.premultiply(t),this}setRotationFromAxisAngle(t,e){this.quaternion.setFromAxisAngle(t,e)}setRotationFromEuler(t){this.quaternion.setFromEuler(t,!0)}setRotationFromMatrix(t){this.quaternion.setFromRotationMatrix(t)}setRotationFromQuaternion(t){this.quaternion.copy(t)}rotateOnAxis(t,e){return Is.setFromAxisAngle(t,e),this.quaternion.multiply(Is),this}rotateOnWorldAxis(t,e){return Is.setFromAxisAngle(t,e),this.quaternion.premultiply(Is),this}rotateX(t){return this.rotateOnAxis(pu,t)}rotateY(t){return this.rotateOnAxis(mu,t)}rotateZ(t){return this.rotateOnAxis(gu,t)}translateOnAxis(t,e){return fu.copy(t).applyQuaternion(this.quaternion),this.position.add(fu.multiplyScalar(e)),this}translateX(t){return this.translateOnAxis(pu,t)}translateY(t){return this.translateOnAxis(mu,t)}translateZ(t){return this.translateOnAxis(gu,t)}localToWorld(t){return this.updateWorldMatrix(!0,!1),t.applyMatrix4(this.matrixWorld)}worldToLocal(t){return this.updateWorldMatrix(!0,!1),t.applyMatrix4(li.copy(this.matrixWorld).invert())}lookAt(t,e,i){t.isVector3?So.copy(t):So.set(t,e,i);const s=this.parent;this.updateWorldMatrix(!0,!1),pr.setFromMatrixPosition(this.matrixWorld),this.isCamera||this.isLight?li.lookAt(pr,So,this.up):li.lookAt(So,pr,this.up),this.quaternion.setFromRotationMatrix(li),s&&(li.extractRotation(s.matrixWorld),Is.setFromRotationMatrix(li),this.quaternion.premultiply(Is.invert()))}add(t){if(arguments.length>1){for(let e=0;e<arguments.length;e++)this.add(arguments[e]);return this}return t===this?(console.error("THREE.Object3D.add: object can't be added as a child of itself.",t),this):(t&&t.isObject3D?(t.parent!==null&&t.parent.remove(t),t.parent=this,this.children.push(t),t.dispatchEvent(Cg)):console.error("THREE.Object3D.add: object not an instance of THREE.Object3D.",t),this)}remove(t){if(arguments.length>1){for(let i=0;i<arguments.length;i++)this.remove(arguments[i]);return this}const e=this.children.indexOf(t);return e!==-1&&(t.parent=null,this.children.splice(e,1),t.dispatchEvent(Rg)),this}removeFromParent(){const t=this.parent;return t!==null&&t.remove(this),this}clear(){return this.remove(...this.children)}attach(t){return this.updateWorldMatrix(!0,!1),li.copy(this.matrixWorld).invert(),t.parent!==null&&(t.parent.updateWorldMatrix(!0,!1),li.multiply(t.parent.matrixWorld)),t.applyMatrix4(li),this.add(t),t.updateWorldMatrix(!1,!0),this}getObjectById(t){return this.getObjectByProperty("id",t)}getObjectByName(t){return this.getObjectByProperty("name",t)}getObjectByProperty(t,e){if(this[t]===e)return this;for(let i=0,s=this.children.length;i<s;i++){const o=this.children[i].getObjectByProperty(t,e);if(o!==void 0)return o}}getObjectsByProperty(t,e,i=[]){this[t]===e&&i.push(this);const s=this.children;for(let r=0,o=s.length;r<o;r++)s[r].getObjectsByProperty(t,e,i);return i}getWorldPosition(t){return this.updateWorldMatrix(!0,!1),t.setFromMatrixPosition(this.matrixWorld)}getWorldQuaternion(t){return this.updateWorldMatrix(!0,!1),this.matrixWorld.decompose(pr,t,wg),t}getWorldScale(t){return this.updateWorldMatrix(!0,!1),this.matrixWorld.decompose(pr,Ag,t),t}getWorldDirection(t){this.updateWorldMatrix(!0,!1);const e=this.matrixWorld.elements;return t.set(e[8],e[9],e[10]).normalize()}raycast(){}traverse(t){t(this);const e=this.children;for(let i=0,s=e.length;i<s;i++)e[i].traverse(t)}traverseVisible(t){if(this.visible===!1)return;t(this);const e=this.children;for(let i=0,s=e.length;i<s;i++)e[i].traverseVisible(t)}traverseAncestors(t){const e=this.parent;e!==null&&(t(e),e.traverseAncestors(t))}updateMatrix(){this.matrix.compose(this.position,this.quaternion,this.scale),this.matrixWorldNeedsUpdate=!0}updateMatrixWorld(t){this.matrixAutoUpdate&&this.updateMatrix(),(this.matrixWorldNeedsUpdate||t)&&(this.parent===null?this.matrixWorld.copy(this.matrix):this.matrixWorld.multiplyMatrices(this.parent.matrixWorld,this.matrix),this.matrixWorldNeedsUpdate=!1,t=!0);const e=this.children;for(let i=0,s=e.length;i<s;i++){const r=e[i];(r.matrixWorldAutoUpdate===!0||t===!0)&&r.updateMatrixWorld(t)}}updateWorldMatrix(t,e){const i=this.parent;if(t===!0&&i!==null&&i.matrixWorldAutoUpdate===!0&&i.updateWorldMatrix(!0,!1),this.matrixAutoUpdate&&this.updateMatrix(),this.parent===null?this.matrixWorld.copy(this.matrix):this.matrixWorld.multiplyMatrices(this.parent.matrixWorld,this.matrix),e===!0){const s=this.children;for(let r=0,o=s.length;r<o;r++){const a=s[r];a.matrixWorldAutoUpdate===!0&&a.updateWorldMatrix(!1,!0)}}}toJSON(t){const e=t===void 0||typeof t=="string",i={};e&&(t={geometries:{},materials:{},textures:{},images:{},shapes:{},skeletons:{},animations:{},nodes:{}},i.metadata={version:4.6,type:"Object",generator:"Object3D.toJSON"});const s={};s.uuid=this.uuid,s.type=this.type,this.name!==""&&(s.name=this.name),this.castShadow===!0&&(s.castShadow=!0),this.receiveShadow===!0&&(s.receiveShadow=!0),this.visible===!1&&(s.visible=!1),this.frustumCulled===!1&&(s.frustumCulled=!1),this.renderOrder!==0&&(s.renderOrder=this.renderOrder),Object.keys(this.userData).length>0&&(s.userData=this.userData),s.layers=this.layers.mask,s.matrix=this.matrix.toArray(),s.up=this.up.toArray(),this.matrixAutoUpdate===!1&&(s.matrixAutoUpdate=!1),this.isInstancedMesh&&(s.type="InstancedMesh",s.count=this.count,s.instanceMatrix=this.instanceMatrix.toJSON(),this.instanceColor!==null&&(s.instanceColor=this.instanceColor.toJSON())),this.isBatchedMesh&&(s.type="BatchedMesh",s.perObjectFrustumCulled=this.perObjectFrustumCulled,s.sortObjects=this.sortObjects,s.drawRanges=this._drawRanges,s.reservedRanges=this._reservedRanges,s.visibility=this._visibility,s.active=this._active,s.bounds=this._bounds.map(a=>({boxInitialized:a.boxInitialized,boxMin:a.box.min.toArray(),boxMax:a.box.max.toArray(),sphereInitialized:a.sphereInitialized,sphereRadius:a.sphere.radius,sphereCenter:a.sphere.center.toArray()})),s.maxGeometryCount=this._maxGeometryCount,s.maxVertexCount=this._maxVertexCount,s.maxIndexCount=this._maxIndexCount,s.geometryInitialized=this._geometryInitialized,s.geometryCount=this._geometryCount,s.matricesTexture=this._matricesTexture.toJSON(t),this.boundingSphere!==null&&(s.boundingSphere={center:s.boundingSphere.center.toArray(),radius:s.boundingSphere.radius}),this.boundingBox!==null&&(s.boundingBox={min:s.boundingBox.min.toArray(),max:s.boundingBox.max.toArray()}));function r(a,l){return a[l.uuid]===void 0&&(a[l.uuid]=l.toJSON(t)),l.uuid}if(this.isScene)this.background&&(this.background.isColor?s.background=this.background.toJSON():this.background.isTexture&&(s.background=this.background.toJSON(t).uuid)),this.environment&&this.environment.isTexture&&this.environment.isRenderTargetTexture!==!0&&(s.environment=this.environment.toJSON(t).uuid);else if(this.isMesh||this.isLine||this.isPoints){s.geometry=r(t.geometries,this.geometry);const a=this.geometry.parameters;if(a!==void 0&&a.shapes!==void 0){const l=a.shapes;if(Array.isArray(l))for(let c=0,h=l.length;c<h;c++){const u=l[c];r(t.shapes,u)}else r(t.shapes,l)}}if(this.isSkinnedMesh&&(s.bindMode=this.bindMode,s.bindMatrix=this.bindMatrix.toArray(),this.skeleton!==void 0&&(r(t.skeletons,this.skeleton),s.skeleton=this.skeleton.uuid)),this.material!==void 0)if(Array.isArray(this.material)){const a=[];for(let l=0,c=this.material.length;l<c;l++)a.push(r(t.materials,this.material[l]));s.material=a}else s.material=r(t.materials,this.material);if(this.children.length>0){s.children=[];for(let a=0;a<this.children.length;a++)s.children.push(this.children[a].toJSON(t).object)}if(this.animations.length>0){s.animations=[];for(let a=0;a<this.animations.length;a++){const l=this.animations[a];s.animations.push(r(t.animations,l))}}if(e){const a=o(t.geometries),l=o(t.materials),c=o(t.textures),h=o(t.images),u=o(t.shapes),d=o(t.skeletons),f=o(t.animations),g=o(t.nodes);a.length>0&&(i.geometries=a),l.length>0&&(i.materials=l),c.length>0&&(i.textures=c),h.length>0&&(i.images=h),u.length>0&&(i.shapes=u),d.length>0&&(i.skeletons=d),f.length>0&&(i.animations=f),g.length>0&&(i.nodes=g)}return i.object=s,i;function o(a){const l=[];for(const c in a){const h=a[c];delete h.metadata,l.push(h)}return l}}clone(t){return new this.constructor().copy(this,t)}copy(t,e=!0){if(this.name=t.name,this.up.copy(t.up),this.position.copy(t.position),this.rotation.order=t.rotation.order,this.quaternion.copy(t.quaternion),this.scale.copy(t.scale),this.matrix.copy(t.matrix),this.matrixWorld.copy(t.matrixWorld),this.matrixAutoUpdate=t.matrixAutoUpdate,this.matrixWorldAutoUpdate=t.matrixWorldAutoUpdate,this.matrixWorldNeedsUpdate=t.matrixWorldNeedsUpdate,this.layers.mask=t.layers.mask,this.visible=t.visible,this.castShadow=t.castShadow,this.receiveShadow=t.receiveShadow,this.frustumCulled=t.frustumCulled,this.renderOrder=t.renderOrder,this.animations=t.animations.slice(),this.userData=JSON.parse(JSON.stringify(t.userData)),e===!0)for(let i=0;i<t.children.length;i++){const s=t.children[i];this.add(s.clone())}return this}}Fe.DEFAULT_UP=new L(0,1,0),Fe.DEFAULT_MATRIX_AUTO_UPDATE=!0,Fe.DEFAULT_MATRIX_WORLD_AUTO_UPDATE=!0;const Nn=new L,ci=new L,vl=new L,hi=new L,Os=new L,Us=new L,_u=new L,bl=new L,Ml=new L,yl=new L;let Eo=!1;class En{constructor(t=new L,e=new L,i=new L){this.a=t,this.b=e,this.c=i}static getNormal(t,e,i,s){s.subVectors(i,e),Nn.subVectors(t,e),s.cross(Nn);const r=s.lengthSq();return r>0?s.multiplyScalar(1/Math.sqrt(r)):s.set(0,0,0)}static getBarycoord(t,e,i,s,r){Nn.subVectors(s,e),ci.subVectors(i,e),vl.subVectors(t,e);const o=Nn.dot(Nn),a=Nn.dot(ci),l=Nn.dot(vl),c=ci.dot(ci),h=ci.dot(vl),u=o*c-a*a;if(u===0)return r.set(0,0,0),null;const d=1/u,f=(c*l-a*h)*d,g=(o*h-a*l)*d;return r.set(1-f-g,g,f)}static containsPoint(t,e,i,s){return this.getBarycoord(t,e,i,s,hi)===null?!1:hi.x>=0&&hi.y>=0&&hi.x+hi.y<=1}static getUV(t,e,i,s,r,o,a,l){return Eo===!1&&(console.warn("THREE.Triangle.getUV() has been renamed to THREE.Triangle.getInterpolation()."),Eo=!0),this.getInterpolation(t,e,i,s,r,o,a,l)}static getInterpolation(t,e,i,s,r,o,a,l){return this.getBarycoord(t,e,i,s,hi)===null?(l.x=0,l.y=0,"z"in l&&(l.z=0),"w"in l&&(l.w=0),null):(l.setScalar(0),l.addScaledVector(r,hi.x),l.addScaledVector(o,hi.y),l.addScaledVector(a,hi.z),l)}static isFrontFacing(t,e,i,s){return Nn.subVectors(i,e),ci.subVectors(t,e),Nn.cross(ci).dot(s)<0}set(t,e,i){return this.a.copy(t),this.b.copy(e),this.c.copy(i),this}setFromPointsAndIndices(t,e,i,s){return this.a.copy(t[e]),this.b.copy(t[i]),this.c.copy(t[s]),this}setFromAttributeAndIndices(t,e,i,s){return this.a.fromBufferAttribute(t,e),this.b.fromBufferAttribute(t,i),this.c.fromBufferAttribute(t,s),this}clone(){return new this.constructor().copy(this)}copy(t){return this.a.copy(t.a),this.b.copy(t.b),this.c.copy(t.c),this}getArea(){return Nn.subVectors(this.c,this.b),ci.subVectors(this.a,this.b),Nn.cross(ci).length()*.5}getMidpoint(t){return t.addVectors(this.a,this.b).add(this.c).multiplyScalar(1/3)}getNormal(t){return En.getNormal(this.a,this.b,this.c,t)}getPlane(t){return t.setFromCoplanarPoints(this.a,this.b,this.c)}getBarycoord(t,e){return En.getBarycoord(t,this.a,this.b,this.c,e)}getUV(t,e,i,s,r){return Eo===!1&&(console.warn("THREE.Triangle.getUV() has been renamed to THREE.Triangle.getInterpolation()."),Eo=!0),En.getInterpolation(t,this.a,this.b,this.c,e,i,s,r)}getInterpolation(t,e,i,s,r){return En.getInterpolation(t,this.a,this.b,this.c,e,i,s,r)}containsPoint(t){return En.containsPoint(t,this.a,this.b,this.c)}isFrontFacing(t){return En.isFrontFacing(this.a,this.b,this.c,t)}intersectsBox(t){return t.intersectsTriangle(this)}closestPointToPoint(t,e){const i=this.a,s=this.b,r=this.c;let o,a;Os.subVectors(s,i),Us.subVectors(r,i),bl.subVectors(t,i);const l=Os.dot(bl),c=Us.dot(bl);if(l<=0&&c<=0)return e.copy(i);Ml.subVectors(t,s);const h=Os.dot(Ml),u=Us.dot(Ml);if(h>=0&&u<=h)return e.copy(s);const d=l*u-h*c;if(d<=0&&l>=0&&h<=0)return o=l/(l-h),e.copy(i).addScaledVector(Os,o);yl.subVectors(t,r);const f=Os.dot(yl),g=Us.dot(yl);if(g>=0&&f<=g)return e.copy(r);const _=f*c-l*g;if(_<=0&&c>=0&&g<=0)return a=c/(c-g),e.copy(i).addScaledVector(Us,a);const m=h*g-f*u;if(m<=0&&u-h>=0&&f-g>=0)return _u.subVectors(r,s),a=(u-h)/(u-h+(f-g)),e.copy(s).addScaledVector(_u,a);const p=1/(m+_+d);return o=_*p,a=d*p,e.copy(i).addScaledVector(Os,o).addScaledVector(Us,a)}equals(t){return t.a.equals(this.a)&&t.b.equals(this.b)&&t.c.equals(this.c)}}const xu={aliceblue:15792383,antiquewhite:16444375,aqua:65535,aquamarine:8388564,azure:15794175,beige:16119260,bisque:16770244,black:0,blanchedalmond:16772045,blue:255,blueviolet:9055202,brown:10824234,burlywood:14596231,cadetblue:6266528,chartreuse:8388352,chocolate:13789470,coral:16744272,cornflowerblue:6591981,cornsilk:16775388,crimson:14423100,cyan:65535,darkblue:139,darkcyan:35723,darkgoldenrod:12092939,darkgray:11119017,darkgreen:25600,darkgrey:11119017,darkkhaki:12433259,darkmagenta:9109643,darkolivegreen:5597999,darkorange:16747520,darkorchid:10040012,darkred:9109504,darksalmon:15308410,darkseagreen:9419919,darkslateblue:4734347,darkslategray:3100495,darkslategrey:3100495,darkturquoise:52945,darkviolet:9699539,deeppink:16716947,deepskyblue:49151,dimgray:6908265,dimgrey:6908265,dodgerblue:2003199,firebrick:11674146,floralwhite:16775920,forestgreen:2263842,fuchsia:16711935,gainsboro:14474460,ghostwhite:16316671,gold:16766720,goldenrod:14329120,gray:8421504,green:32768,greenyellow:11403055,grey:8421504,honeydew:15794160,hotpink:16738740,indianred:13458524,indigo:4915330,ivory:16777200,khaki:15787660,lavender:15132410,lavenderblush:16773365,lawngreen:8190976,lemonchiffon:16775885,lightblue:11393254,lightcoral:15761536,lightcyan:14745599,lightgoldenrodyellow:16448210,lightgray:13882323,lightgreen:9498256,lightgrey:13882323,lightpink:16758465,lightsalmon:16752762,lightseagreen:2142890,lightskyblue:8900346,lightslategray:7833753,lightslategrey:7833753,lightsteelblue:11584734,lightyellow:16777184,lime:65280,limegreen:3329330,linen:16445670,magenta:16711935,maroon:8388608,mediumaquamarine:6737322,mediumblue:205,mediumorchid:12211667,mediumpurple:9662683,mediumseagreen:3978097,mediumslateblue:8087790,mediumspringgreen:64154,mediumturquoise:4772300,mediumvioletred:13047173,midnightblue:1644912,mintcream:16121850,mistyrose:16770273,moccasin:16770229,navajowhite:16768685,navy:128,oldlace:16643558,olive:8421376,olivedrab:7048739,orange:16753920,orangered:16729344,orchid:14315734,palegoldenrod:15657130,palegreen:10025880,paleturquoise:11529966,palevioletred:14381203,papayawhip:16773077,peachpuff:16767673,peru:13468991,pink:16761035,plum:14524637,powderblue:11591910,purple:8388736,rebeccapurple:6697881,red:16711680,rosybrown:12357519,royalblue:4286945,saddlebrown:9127187,salmon:16416882,sandybrown:16032864,seagreen:3050327,seashell:16774638,sienna:10506797,silver:12632256,skyblue:8900331,slateblue:6970061,slategray:7372944,slategrey:7372944,snow:16775930,springgreen:65407,steelblue:4620980,tan:13808780,teal:32896,thistle:14204888,tomato:16737095,turquoise:4251856,violet:15631086,wheat:16113331,white:16777215,whitesmoke:16119285,yellow:16776960,yellowgreen:10145074},Li={h:0,s:0,l:0},To={h:0,s:0,l:0};function Sl(n,t,e){return e<0&&(e+=1),e>1&&(e-=1),e<1/6?n+(t-n)*6*e:e<1/2?t:e<2/3?n+(t-n)*6*(2/3-e):n}let xt=class{constructor(t,e,i){return this.isColor=!0,this.r=1,this.g=1,this.b=1,this.set(t,e,i)}set(t,e,i){if(e===void 0&&i===void 0){const s=t;s&&s.isColor?this.copy(s):typeof s=="number"?this.setHex(s):typeof s=="string"&&this.setStyle(s)}else this.setRGB(t,e,i);return this}setScalar(t){return this.r=t,this.g=t,this.b=t,this}setHex(t,e=Ve){return t=Math.floor(t),this.r=(t>>16&255)/255,this.g=(t>>8&255)/255,this.b=(t&255)/255,se.toWorkingColorSpace(this,e),this}setRGB(t,e,i,s=se.workingColorSpace){return this.r=t,this.g=e,this.b=i,se.toWorkingColorSpace(this,s),this}setHSL(t,e,i,s=se.workingColorSpace){if(t=pg(t,1),e=Je(e,0,1),i=Je(i,0,1),e===0)this.r=this.g=this.b=i;else{const r=i<=.5?i*(1+e):i+e-i*e,o=2*i-r;this.r=Sl(o,r,t+1/3),this.g=Sl(o,r,t),this.b=Sl(o,r,t-1/3)}return se.toWorkingColorSpace(this,s),this}setStyle(t,e=Ve){function i(r){r!==void 0&&parseFloat(r)<1&&console.warn("THREE.Color: Alpha component of "+t+" will be ignored.")}let s;if(s=/^(\w+)\(([^\)]*)\)/.exec(t)){let r;const o=s[1],a=s[2];switch(o){case"rgb":case"rgba":if(r=/^\s*(\d+)\s*,\s*(\d+)\s*,\s*(\d+)\s*(?:,\s*(\d*\.?\d+)\s*)?$/.exec(a))return i(r[4]),this.setRGB(Math.min(255,parseInt(r[1],10))/255,Math.min(255,parseInt(r[2],10))/255,Math.min(255,parseInt(r[3],10))/255,e);if(r=/^\s*(\d+)\%\s*,\s*(\d+)\%\s*,\s*(\d+)\%\s*(?:,\s*(\d*\.?\d+)\s*)?$/.exec(a))return i(r[4]),this.setRGB(Math.min(100,parseInt(r[1],10))/100,Math.min(100,parseInt(r[2],10))/100,Math.min(100,parseInt(r[3],10))/100,e);break;case"hsl":case"hsla":if(r=/^\s*(\d*\.?\d+)\s*,\s*(\d*\.?\d+)\%\s*,\s*(\d*\.?\d+)\%\s*(?:,\s*(\d*\.?\d+)\s*)?$/.exec(a))return i(r[4]),this.setHSL(parseFloat(r[1])/360,parseFloat(r[2])/100,parseFloat(r[3])/100,e);break;default:console.warn("THREE.Color: Unknown color model "+t)}}else if(s=/^\#([A-Fa-f\d]+)$/.exec(t)){const r=s[1],o=r.length;if(o===3)return this.setRGB(parseInt(r.charAt(0),16)/15,parseInt(r.charAt(1),16)/15,parseInt(r.charAt(2),16)/15,e);if(o===6)return this.setHex(parseInt(r,16),e);console.warn("THREE.Color: Invalid hex color "+t)}else if(t&&t.length>0)return this.setColorName(t,e);return this}setColorName(t,e=Ve){const i=xu[t.toLowerCase()];return i!==void 0?this.setHex(i,e):console.warn("THREE.Color: Unknown color "+t),this}clone(){return new this.constructor(this.r,this.g,this.b)}copy(t){return this.r=t.r,this.g=t.g,this.b=t.b,this}copySRGBToLinear(t){return this.r=ws(t.r),this.g=ws(t.g),this.b=ws(t.b),this}copyLinearToSRGB(t){return this.r=hl(t.r),this.g=hl(t.g),this.b=hl(t.b),this}convertSRGBToLinear(){return this.copySRGBToLinear(this),this}convertLinearToSRGB(){return this.copyLinearToSRGB(this),this}getHex(t=Ve){return se.fromWorkingColorSpace(je.copy(this),t),Math.round(Je(je.r*255,0,255))*65536+Math.round(Je(je.g*255,0,255))*256+Math.round(Je(je.b*255,0,255))}getHexString(t=Ve){return("000000"+this.getHex(t).toString(16)).slice(-6)}getHSL(t,e=se.workingColorSpace){se.fromWorkingColorSpace(je.copy(this),e);const i=je.r,s=je.g,r=je.b,o=Math.max(i,s,r),a=Math.min(i,s,r);let l,c;const h=(a+o)/2;if(a===o)l=0,c=0;else{const u=o-a;switch(c=h<=.5?u/(o+a):u/(2-o-a),o){case i:l=(s-r)/u+(s<r?6:0);break;case s:l=(r-i)/u+2;break;case r:l=(i-s)/u+4;break}l/=6}return t.h=l,t.s=c,t.l=h,t}getRGB(t,e=se.workingColorSpace){return se.fromWorkingColorSpace(je.copy(this),e),t.r=je.r,t.g=je.g,t.b=je.b,t}getStyle(t=Ve){se.fromWorkingColorSpace(je.copy(this),t);const e=je.r,i=je.g,s=je.b;return t!==Ve?`color(${t} ${e.toFixed(3)} ${i.toFixed(3)} ${s.toFixed(3)})`:`rgb(${Math.round(e*255)},${Math.round(i*255)},${Math.round(s*255)})`}offsetHSL(t,e,i){return this.getHSL(Li),this.setHSL(Li.h+t,Li.s+e,Li.l+i)}add(t){return this.r+=t.r,this.g+=t.g,this.b+=t.b,this}addColors(t,e){return this.r=t.r+e.r,this.g=t.g+e.g,this.b=t.b+e.b,this}addScalar(t){return this.r+=t,this.g+=t,this.b+=t,this}sub(t){return this.r=Math.max(0,this.r-t.r),this.g=Math.max(0,this.g-t.g),this.b=Math.max(0,this.b-t.b),this}multiply(t){return this.r*=t.r,this.g*=t.g,this.b*=t.b,this}multiplyScalar(t){return this.r*=t,this.g*=t,this.b*=t,this}lerp(t,e){return this.r+=(t.r-this.r)*e,this.g+=(t.g-this.g)*e,this.b+=(t.b-this.b)*e,this}lerpColors(t,e,i){return this.r=t.r+(e.r-t.r)*i,this.g=t.g+(e.g-t.g)*i,this.b=t.b+(e.b-t.b)*i,this}lerpHSL(t,e){this.getHSL(Li),t.getHSL(To);const i=al(Li.h,To.h,e),s=al(Li.s,To.s,e),r=al(Li.l,To.l,e);return this.setHSL(i,s,r),this}setFromVector3(t){return this.r=t.x,this.g=t.y,this.b=t.z,this}applyMatrix3(t){const e=this.r,i=this.g,s=this.b,r=t.elements;return this.r=r[0]*e+r[3]*i+r[6]*s,this.g=r[1]*e+r[4]*i+r[7]*s,this.b=r[2]*e+r[5]*i+r[8]*s,this}equals(t){return t.r===this.r&&t.g===this.g&&t.b===this.b}fromArray(t,e=0){return this.r=t[e],this.g=t[e+1],this.b=t[e+2],this}toArray(t=[],e=0){return t[e]=this.r,t[e+1]=this.g,t[e+2]=this.b,t}fromBufferAttribute(t,e){return this.r=t.getX(e),this.g=t.getY(e),this.b=t.getZ(e),this}toJSON(){return this.getHex()}*[Symbol.iterator](){yield this.r,yield this.g,yield this.b}};const je=new xt;xt.NAMES=xu;let Pg=0;class Fs extends qi{constructor(){super(),this.isMaterial=!0,Object.defineProperty(this,"id",{value:Pg++}),this.uuid=cr(),this.name="",this.type="Material",this.blending=Ms,this.side=yi,this.vertexColors=!1,this.opacity=1,this.transparent=!1,this.alphaHash=!1,this.blendSrc=Wa,this.blendDst=Xa,this.blendEquation=Wi,this.blendSrcAlpha=null,this.blendDstAlpha=null,this.blendEquationAlpha=null,this.blendColor=new xt(0,0,0),this.blendAlpha=0,this.depthFunc=ro,this.depthTest=!0,this.depthWrite=!0,this.stencilWriteMask=255,this.stencilFunc=Jh,this.stencilRef=0,this.stencilFuncMask=255,this.stencilFail=Ts,this.stencilZFail=Ts,this.stencilZPass=Ts,this.stencilWrite=!1,this.clippingPlanes=null,this.clipIntersection=!1,this.clipShadows=!1,this.shadowSide=null,this.colorWrite=!0,this.precision=null,this.polygonOffset=!1,this.polygonOffsetFactor=0,this.polygonOffsetUnits=0,this.dithering=!1,this.alphaToCoverage=!1,this.premultipliedAlpha=!1,this.forceSinglePass=!1,this.visible=!0,this.toneMapped=!0,this.userData={},this.version=0,this._alphaTest=0}get alphaTest(){return this._alphaTest}set alphaTest(t){this._alphaTest>0!=t>0&&this.version++,this._alphaTest=t}onBuild(){}onBeforeRender(){}onBeforeCompile(){}customProgramCacheKey(){return this.onBeforeCompile.toString()}setValues(t){if(t!==void 0)for(const e in t){const i=t[e];if(i===void 0){console.warn(`THREE.Material: parameter '${e}' has value of undefined.`);continue}const s=this[e];if(s===void 0){console.warn(`THREE.Material: '${e}' is not a property of THREE.${this.type}.`);continue}s&&s.isColor?s.set(i):s&&s.isVector3&&i&&i.isVector3?s.copy(i):this[e]=i}}toJSON(t){const e=t===void 0||typeof t=="string";e&&(t={textures:{},images:{}});const i={metadata:{version:4.6,type:"Material",generator:"Material.toJSON"}};i.uuid=this.uuid,i.type=this.type,this.name!==""&&(i.name=this.name),this.color&&this.color.isColor&&(i.color=this.color.getHex()),this.roughness!==void 0&&(i.roughness=this.roughness),this.metalness!==void 0&&(i.metalness=this.metalness),this.sheen!==void 0&&(i.sheen=this.sheen),this.sheenColor&&this.sheenColor.isColor&&(i.sheenColor=this.sheenColor.getHex()),this.sheenRoughness!==void 0&&(i.sheenRoughness=this.sheenRoughness),this.emissive&&this.emissive.isColor&&(i.emissive=this.emissive.getHex()),this.emissiveIntensity&&this.emissiveIntensity!==1&&(i.emissiveIntensity=this.emissiveIntensity),this.specular&&this.specular.isColor&&(i.specular=this.specular.getHex()),this.specularIntensity!==void 0&&(i.specularIntensity=this.specularIntensity),this.specularColor&&this.specularColor.isColor&&(i.specularColor=this.specularColor.getHex()),this.shininess!==void 0&&(i.shininess=this.shininess),this.clearcoat!==void 0&&(i.clearcoat=this.clearcoat),this.clearcoatRoughness!==void 0&&(i.clearcoatRoughness=this.clearcoatRoughness),this.clearcoatMap&&this.clearcoatMap.isTexture&&(i.clearcoatMap=this.clearcoatMap.toJSON(t).uuid),this.clearcoatRoughnessMap&&this.clearcoatRoughnessMap.isTexture&&(i.clearcoatRoughnessMap=this.clearcoatRoughnessMap.toJSON(t).uuid),this.clearcoatNormalMap&&this.clearcoatNormalMap.isTexture&&(i.clearcoatNormalMap=this.clearcoatNormalMap.toJSON(t).uuid,i.clearcoatNormalScale=this.clearcoatNormalScale.toArray()),this.iridescence!==void 0&&(i.iridescence=this.iridescence),this.iridescenceIOR!==void 0&&(i.iridescenceIOR=this.iridescenceIOR),this.iridescenceThicknessRange!==void 0&&(i.iridescenceThicknessRange=this.iridescenceThicknessRange),this.iridescenceMap&&this.iridescenceMap.isTexture&&(i.iridescenceMap=this.iridescenceMap.toJSON(t).uuid),this.iridescenceThicknessMap&&this.iridescenceThicknessMap.isTexture&&(i.iridescenceThicknessMap=this.iridescenceThicknessMap.toJSON(t).uuid),this.anisotropy!==void 0&&(i.anisotropy=this.anisotropy),this.anisotropyRotation!==void 0&&(i.anisotropyRotation=this.anisotropyRotation),this.anisotropyMap&&this.anisotropyMap.isTexture&&(i.anisotropyMap=this.anisotropyMap.toJSON(t).uuid),this.map&&this.map.isTexture&&(i.map=this.map.toJSON(t).uuid),this.matcap&&this.matcap.isTexture&&(i.matcap=this.matcap.toJSON(t).uuid),this.alphaMap&&this.alphaMap.isTexture&&(i.alphaMap=this.alphaMap.toJSON(t).uuid),this.lightMap&&this.lightMap.isTexture&&(i.lightMap=this.lightMap.toJSON(t).uuid,i.lightMapIntensity=this.lightMapIntensity),this.aoMap&&this.aoMap.isTexture&&(i.aoMap=this.aoMap.toJSON(t).uuid,i.aoMapIntensity=this.aoMapIntensity),this.bumpMap&&this.bumpMap.isTexture&&(i.bumpMap=this.bumpMap.toJSON(t).uuid,i.bumpScale=this.bumpScale),this.normalMap&&this.normalMap.isTexture&&(i.normalMap=this.normalMap.toJSON(t).uuid,i.normalMapType=this.normalMapType,i.normalScale=this.normalScale.toArray()),this.displacementMap&&this.displacementMap.isTexture&&(i.displacementMap=this.displacementMap.toJSON(t).uuid,i.displacementScale=this.displacementScale,i.displacementBias=this.displacementBias),this.roughnessMap&&this.roughnessMap.isTexture&&(i.roughnessMap=this.roughnessMap.toJSON(t).uuid),this.metalnessMap&&this.metalnessMap.isTexture&&(i.metalnessMap=this.metalnessMap.toJSON(t).uuid),this.emissiveMap&&this.emissiveMap.isTexture&&(i.emissiveMap=this.emissiveMap.toJSON(t).uuid),this.specularMap&&this.specularMap.isTexture&&(i.specularMap=this.specularMap.toJSON(t).uuid),this.specularIntensityMap&&this.specularIntensityMap.isTexture&&(i.specularIntensityMap=this.specularIntensityMap.toJSON(t).uuid),this.specularColorMap&&this.specularColorMap.isTexture&&(i.specularColorMap=this.specularColorMap.toJSON(t).uuid),this.envMap&&this.envMap.isTexture&&(i.envMap=this.envMap.toJSON(t).uuid,this.combine!==void 0&&(i.combine=this.combine)),this.envMapIntensity!==void 0&&(i.envMapIntensity=this.envMapIntensity),this.reflectivity!==void 0&&(i.reflectivity=this.reflectivity),this.refractionRatio!==void 0&&(i.refractionRatio=this.refractionRatio),this.gradientMap&&this.gradientMap.isTexture&&(i.gradientMap=this.gradientMap.toJSON(t).uuid),this.transmission!==void 0&&(i.transmission=this.transmission),this.transmissionMap&&this.transmissionMap.isTexture&&(i.transmissionMap=this.transmissionMap.toJSON(t).uuid),this.thickness!==void 0&&(i.thickness=this.thickness),this.thicknessMap&&this.thicknessMap.isTexture&&(i.thicknessMap=this.thicknessMap.toJSON(t).uuid),this.attenuationDistance!==void 0&&this.attenuationDistance!==1/0&&(i.attenuationDistance=this.attenuationDistance),this.attenuationColor!==void 0&&(i.attenuationColor=this.attenuationColor.getHex()),this.size!==void 0&&(i.size=this.size),this.shadowSide!==null&&(i.shadowSide=this.shadowSide),this.sizeAttenuation!==void 0&&(i.sizeAttenuation=this.sizeAttenuation),this.blending!==Ms&&(i.blending=this.blending),this.side!==yi&&(i.side=this.side),this.vertexColors===!0&&(i.vertexColors=!0),this.opacity<1&&(i.opacity=this.opacity),this.transparent===!0&&(i.transparent=!0),this.blendSrc!==Wa&&(i.blendSrc=this.blendSrc),this.blendDst!==Xa&&(i.blendDst=this.blendDst),this.blendEquation!==Wi&&(i.blendEquation=this.blendEquation),this.blendSrcAlpha!==null&&(i.blendSrcAlpha=this.blendSrcAlpha),this.blendDstAlpha!==null&&(i.blendDstAlpha=this.blendDstAlpha),this.blendEquationAlpha!==null&&(i.blendEquationAlpha=this.blendEquationAlpha),this.blendColor&&this.blendColor.isColor&&(i.blendColor=this.blendColor.getHex()),this.blendAlpha!==0&&(i.blendAlpha=this.blendAlpha),this.depthFunc!==ro&&(i.depthFunc=this.depthFunc),this.depthTest===!1&&(i.depthTest=this.depthTest),this.depthWrite===!1&&(i.depthWrite=this.depthWrite),this.colorWrite===!1&&(i.colorWrite=this.colorWrite),this.stencilWriteMask!==255&&(i.stencilWriteMask=this.stencilWriteMask),this.stencilFunc!==Jh&&(i.stencilFunc=this.stencilFunc),this.stencilRef!==0&&(i.stencilRef=this.stencilRef),this.stencilFuncMask!==255&&(i.stencilFuncMask=this.stencilFuncMask),this.stencilFail!==Ts&&(i.stencilFail=this.stencilFail),this.stencilZFail!==Ts&&(i.stencilZFail=this.stencilZFail),this.stencilZPass!==Ts&&(i.stencilZPass=this.stencilZPass),this.stencilWrite===!0&&(i.stencilWrite=this.stencilWrite),this.rotation!==void 0&&this.rotation!==0&&(i.rotation=this.rotation),this.polygonOffset===!0&&(i.polygonOffset=!0),this.polygonOffsetFactor!==0&&(i.polygonOffsetFactor=this.polygonOffsetFactor),this.polygonOffsetUnits!==0&&(i.polygonOffsetUnits=this.polygonOffsetUnits),this.linewidth!==void 0&&this.linewidth!==1&&(i.linewidth=this.linewidth),this.dashSize!==void 0&&(i.dashSize=this.dashSize),this.gapSize!==void 0&&(i.gapSize=this.gapSize),this.scale!==void 0&&(i.scale=this.scale),this.dithering===!0&&(i.dithering=!0),this.alphaTest>0&&(i.alphaTest=this.alphaTest),this.alphaHash===!0&&(i.alphaHash=!0),this.alphaToCoverage===!0&&(i.alphaToCoverage=!0),this.premultipliedAlpha===!0&&(i.premultipliedAlpha=!0),this.forceSinglePass===!0&&(i.forceSinglePass=!0),this.wireframe===!0&&(i.wireframe=!0),this.wireframeLinewidth>1&&(i.wireframeLinewidth=this.wireframeLinewidth),this.wireframeLinecap!=="round"&&(i.wireframeLinecap=this.wireframeLinecap),this.wireframeLinejoin!=="round"&&(i.wireframeLinejoin=this.wireframeLinejoin),this.flatShading===!0&&(i.flatShading=!0),this.visible===!1&&(i.visible=!1),this.toneMapped===!1&&(i.toneMapped=!1),this.fog===!1&&(i.fog=!1),Object.keys(this.userData).length>0&&(i.userData=this.userData);function s(r){const o=[];for(const a in r){const l=r[a];delete l.metadata,o.push(l)}return o}if(e){const r=s(t.textures),o=s(t.images);r.length>0&&(i.textures=r),o.length>0&&(i.images=o)}return i}clone(){return new this.constructor().copy(this)}copy(t){this.name=t.name,this.blending=t.blending,this.side=t.side,this.vertexColors=t.vertexColors,this.opacity=t.opacity,this.transparent=t.transparent,this.blendSrc=t.blendSrc,this.blendDst=t.blendDst,this.blendEquation=t.blendEquation,this.blendSrcAlpha=t.blendSrcAlpha,this.blendDstAlpha=t.blendDstAlpha,this.blendEquationAlpha=t.blendEquationAlpha,this.blendColor.copy(t.blendColor),this.blendAlpha=t.blendAlpha,this.depthFunc=t.depthFunc,this.depthTest=t.depthTest,this.depthWrite=t.depthWrite,this.stencilWriteMask=t.stencilWriteMask,this.stencilFunc=t.stencilFunc,this.stencilRef=t.stencilRef,this.stencilFuncMask=t.stencilFuncMask,this.stencilFail=t.stencilFail,this.stencilZFail=t.stencilZFail,this.stencilZPass=t.stencilZPass,this.stencilWrite=t.stencilWrite;const e=t.clippingPlanes;let i=null;if(e!==null){const s=e.length;i=new Array(s);for(let r=0;r!==s;++r)i[r]=e[r].clone()}return this.clippingPlanes=i,this.clipIntersection=t.clipIntersection,this.clipShadows=t.clipShadows,this.shadowSide=t.shadowSide,this.colorWrite=t.colorWrite,this.precision=t.precision,this.polygonOffset=t.polygonOffset,this.polygonOffsetFactor=t.polygonOffsetFactor,this.polygonOffsetUnits=t.polygonOffsetUnits,this.dithering=t.dithering,this.alphaTest=t.alphaTest,this.alphaHash=t.alphaHash,this.alphaToCoverage=t.alphaToCoverage,this.premultipliedAlpha=t.premultipliedAlpha,this.forceSinglePass=t.forceSinglePass,this.visible=t.visible,this.toneMapped=t.toneMapped,this.userData=JSON.parse(JSON.stringify(t.userData)),this}dispose(){this.dispatchEvent({type:"dispose"})}set needsUpdate(t){t===!0&&this.version++}}class on extends Fs{constructor(t){super(),this.isMeshBasicMaterial=!0,this.type="MeshBasicMaterial",this.color=new xt(16777215),this.map=null,this.lightMap=null,this.lightMapIntensity=1,this.aoMap=null,this.aoMapIntensity=1,this.specularMap=null,this.alphaMap=null,this.envMap=null,this.combine=uh,this.reflectivity=1,this.refractionRatio=.98,this.wireframe=!1,this.wireframeLinewidth=1,this.wireframeLinecap="round",this.wireframeLinejoin="round",this.fog=!0,this.setValues(t)}copy(t){return super.copy(t),this.color.copy(t.color),this.map=t.map,this.lightMap=t.lightMap,this.lightMapIntensity=t.lightMapIntensity,this.aoMap=t.aoMap,this.aoMapIntensity=t.aoMapIntensity,this.specularMap=t.specularMap,this.alphaMap=t.alphaMap,this.envMap=t.envMap,this.combine=t.combine,this.reflectivity=t.reflectivity,this.refractionRatio=t.refractionRatio,this.wireframe=t.wireframe,this.wireframeLinewidth=t.wireframeLinewidth,this.wireframeLinecap=t.wireframeLinecap,this.wireframeLinejoin=t.wireframeLinejoin,this.fog=t.fog,this}}const we=new L,wo=new St;class Tn{constructor(t,e,i=!1){if(Array.isArray(t))throw new TypeError("THREE.BufferAttribute: array should be a Typed Array.");this.isBufferAttribute=!0,this.name="",this.array=t,this.itemSize=e,this.count=t!==void 0?t.length/e:0,this.normalized=i,this.usage=tu,this._updateRange={offset:0,count:-1},this.updateRanges=[],this.gpuType=wi,this.version=0}onUploadCallback(){}set needsUpdate(t){t===!0&&this.version++}get updateRange(){return console.warn("THREE.BufferAttribute: updateRange() is deprecated and will be removed in r169. Use addUpdateRange() instead."),this._updateRange}setUsage(t){return this.usage=t,this}addUpdateRange(t,e){this.updateRanges.push({start:t,count:e})}clearUpdateRanges(){this.updateRanges.length=0}copy(t){return this.name=t.name,this.array=new t.array.constructor(t.array),this.itemSize=t.itemSize,this.count=t.count,this.normalized=t.normalized,this.usage=t.usage,this.gpuType=t.gpuType,this}copyAt(t,e,i){t*=this.itemSize,i*=e.itemSize;for(let s=0,r=this.itemSize;s<r;s++)this.array[t+s]=e.array[i+s];return this}copyArray(t){return this.array.set(t),this}applyMatrix3(t){if(this.itemSize===2)for(let e=0,i=this.count;e<i;e++)wo.fromBufferAttribute(this,e),wo.applyMatrix3(t),this.setXY(e,wo.x,wo.y);else if(this.itemSize===3)for(let e=0,i=this.count;e<i;e++)we.fromBufferAttribute(this,e),we.applyMatrix3(t),this.setXYZ(e,we.x,we.y,we.z);return this}applyMatrix4(t){for(let e=0,i=this.count;e<i;e++)we.fromBufferAttribute(this,e),we.applyMatrix4(t),this.setXYZ(e,we.x,we.y,we.z);return this}applyNormalMatrix(t){for(let e=0,i=this.count;e<i;e++)we.fromBufferAttribute(this,e),we.applyNormalMatrix(t),this.setXYZ(e,we.x,we.y,we.z);return this}transformDirection(t){for(let e=0,i=this.count;e<i;e++)we.fromBufferAttribute(this,e),we.transformDirection(t),this.setXYZ(e,we.x,we.y,we.z);return this}set(t,e=0){return this.array.set(t,e),this}getComponent(t,e){let i=this.array[t*this.itemSize+e];return this.normalized&&(i=hr(i,this.array)),i}setComponent(t,e,i){return this.normalized&&(i=rn(i,this.array)),this.array[t*this.itemSize+e]=i,this}getX(t){let e=this.array[t*this.itemSize];return this.normalized&&(e=hr(e,this.array)),e}setX(t,e){return this.normalized&&(e=rn(e,this.array)),this.array[t*this.itemSize]=e,this}getY(t){let e=this.array[t*this.itemSize+1];return this.normalized&&(e=hr(e,this.array)),e}setY(t,e){return this.normalized&&(e=rn(e,this.array)),this.array[t*this.itemSize+1]=e,this}getZ(t){let e=this.array[t*this.itemSize+2];return this.normalized&&(e=hr(e,this.array)),e}setZ(t,e){return this.normalized&&(e=rn(e,this.array)),this.array[t*this.itemSize+2]=e,this}getW(t){let e=this.array[t*this.itemSize+3];return this.normalized&&(e=hr(e,this.array)),e}setW(t,e){return this.normalized&&(e=rn(e,this.array)),this.array[t*this.itemSize+3]=e,this}setXY(t,e,i){return t*=this.itemSize,this.normalized&&(e=rn(e,this.array),i=rn(i,this.array)),this.array[t+0]=e,this.array[t+1]=i,this}setXYZ(t,e,i,s){return t*=this.itemSize,this.normalized&&(e=rn(e,this.array),i=rn(i,this.array),s=rn(s,this.array)),this.array[t+0]=e,this.array[t+1]=i,this.array[t+2]=s,this}setXYZW(t,e,i,s,r){return t*=this.itemSize,this.normalized&&(e=rn(e,this.array),i=rn(i,this.array),s=rn(s,this.array),r=rn(r,this.array)),this.array[t+0]=e,this.array[t+1]=i,this.array[t+2]=s,this.array[t+3]=r,this}onUpload(t){return this.onUploadCallback=t,this}clone(){return new this.constructor(this.array,this.itemSize).copy(this)}toJSON(){const t={itemSize:this.itemSize,type:this.array.constructor.name,array:Array.from(this.array),normalized:this.normalized};return this.name!==""&&(t.name=this.name),this.usage!==tu&&(t.usage=this.usage),t}}class vu extends Tn{constructor(t,e,i){super(new Uint16Array(t),e,i)}}class bu extends Tn{constructor(t,e,i){super(new Uint32Array(t),e,i)}}class re extends Tn{constructor(t,e,i){super(new Float32Array(t),e,i)}}let Lg=0;const wn=new ge,El=new Fe,Ns=new L,mn=new $i,mr=new $i,Ne=new L;class Ce extends qi{constructor(){super(),this.isBufferGeometry=!0,Object.defineProperty(this,"id",{value:Lg++}),this.uuid=cr(),this.name="",this.type="BufferGeometry",this.index=null,this.attributes={},this.morphAttributes={},this.morphTargetsRelative=!1,this.groups=[],this.boundingBox=null,this.boundingSphere=null,this.drawRange={start:0,count:1/0},this.userData={}}getIndex(){return this.index}setIndex(t){return Array.isArray(t)?this.index=new(iu(t)?bu:vu)(t,1):this.index=t,this}getAttribute(t){return this.attributes[t]}setAttribute(t,e){return this.attributes[t]=e,this}deleteAttribute(t){return delete this.attributes[t],this}hasAttribute(t){return this.attributes[t]!==void 0}addGroup(t,e,i=0){this.groups.push({start:t,count:e,materialIndex:i})}clearGroups(){this.groups=[]}setDrawRange(t,e){this.drawRange.start=t,this.drawRange.count=e}applyMatrix4(t){const e=this.attributes.position;e!==void 0&&(e.applyMatrix4(t),e.needsUpdate=!0);const i=this.attributes.normal;if(i!==void 0){const r=new Yt().getNormalMatrix(t);i.applyNormalMatrix(r),i.needsUpdate=!0}const s=this.attributes.tangent;return s!==void 0&&(s.transformDirection(t),s.needsUpdate=!0),this.boundingBox!==null&&this.computeBoundingBox(),this.boundingSphere!==null&&this.computeBoundingSphere(),this}applyQuaternion(t){return wn.makeRotationFromQuaternion(t),this.applyMatrix4(wn),this}rotateX(t){return wn.makeRotationX(t),this.applyMatrix4(wn),this}rotateY(t){return wn.makeRotationY(t),this.applyMatrix4(wn),this}rotateZ(t){return wn.makeRotationZ(t),this.applyMatrix4(wn),this}translate(t,e,i){return wn.makeTranslation(t,e,i),this.applyMatrix4(wn),this}scale(t,e,i){return wn.makeScale(t,e,i),this.applyMatrix4(wn),this}lookAt(t){return El.lookAt(t),El.updateMatrix(),this.applyMatrix4(El.matrix),this}center(){return this.computeBoundingBox(),this.boundingBox.getCenter(Ns).negate(),this.translate(Ns.x,Ns.y,Ns.z),this}setFromPoints(t){const e=[];for(let i=0,s=t.length;i<s;i++){const r=t[i];e.push(r.x,r.y,r.z||0)}return this.setAttribute("position",new re(e,3)),this}computeBoundingBox(){this.boundingBox===null&&(this.boundingBox=new $i);const t=this.attributes.position,e=this.morphAttributes.position;if(t&&t.isGLBufferAttribute){console.error('THREE.BufferGeometry.computeBoundingBox(): GLBufferAttribute requires a manual bounding box. Alternatively set "mesh.frustumCulled" to "false".',this),this.boundingBox.set(new L(-1/0,-1/0,-1/0),new L(1/0,1/0,1/0));return}if(t!==void 0){if(this.boundingBox.setFromBufferAttribute(t),e)for(let i=0,s=e.length;i<s;i++){const r=e[i];mn.setFromBufferAttribute(r),this.morphTargetsRelative?(Ne.addVectors(this.boundingBox.min,mn.min),this.boundingBox.expandByPoint(Ne),Ne.addVectors(this.boundingBox.max,mn.max),this.boundingBox.expandByPoint(Ne)):(this.boundingBox.expandByPoint(mn.min),this.boundingBox.expandByPoint(mn.max))}}else this.boundingBox.makeEmpty();(isNaN(this.boundingBox.min.x)||isNaN(this.boundingBox.min.y)||isNaN(this.boundingBox.min.z))&&console.error('THREE.BufferGeometry.computeBoundingBox(): Computed min/max have NaN values. The "position" attribute is likely to have NaN values.',this)}computeBoundingSphere(){this.boundingSphere===null&&(this.boundingSphere=new Ls);const t=this.attributes.position,e=this.morphAttributes.position;if(t&&t.isGLBufferAttribute){console.error('THREE.BufferGeometry.computeBoundingSphere(): GLBufferAttribute requires a manual bounding sphere. Alternatively set "mesh.frustumCulled" to "false".',this),this.boundingSphere.set(new L,1/0);return}if(t){const i=this.boundingSphere.center;if(mn.setFromBufferAttribute(t),e)for(let r=0,o=e.length;r<o;r++){const a=e[r];mr.setFromBufferAttribute(a),this.morphTargetsRelative?(Ne.addVectors(mn.min,mr.min),mn.expandByPoint(Ne),Ne.addVectors(mn.max,mr.max),mn.expandByPoint(Ne)):(mn.expandByPoint(mr.min),mn.expandByPoint(mr.max))}mn.getCenter(i);let s=0;for(let r=0,o=t.count;r<o;r++)Ne.fromBufferAttribute(t,r),s=Math.max(s,i.distanceToSquared(Ne));if(e)for(let r=0,o=e.length;r<o;r++){const a=e[r],l=this.morphTargetsRelative;for(let c=0,h=a.count;c<h;c++)Ne.fromBufferAttribute(a,c),l&&(Ns.fromBufferAttribute(t,c),Ne.add(Ns)),s=Math.max(s,i.distanceToSquared(Ne))}this.boundingSphere.radius=Math.sqrt(s),isNaN(this.boundingSphere.radius)&&console.error('THREE.BufferGeometry.computeBoundingSphere(): Computed radius is NaN. The "position" attribute is likely to have NaN values.',this)}}computeTangents(){const t=this.index,e=this.attributes;if(t===null||e.position===void 0||e.normal===void 0||e.uv===void 0){console.error("THREE.BufferGeometry: .computeTangents() failed. Missing required attributes (index, position, normal or uv)");return}const i=t.array,s=e.position.array,r=e.normal.array,o=e.uv.array,a=s.length/3;this.hasAttribute("tangent")===!1&&this.setAttribute("tangent",new Tn(new Float32Array(4*a),4));const l=this.getAttribute("tangent").array,c=[],h=[];for(let w=0;w<a;w++)c[w]=new L,h[w]=new L;const u=new L,d=new L,f=new L,g=new St,_=new St,m=new St,p=new L,v=new L;function x(w,U,O){u.fromArray(s,w*3),d.fromArray(s,U*3),f.fromArray(s,O*3),g.fromArray(o,w*2),_.fromArray(o,U*2),m.fromArray(o,O*2),d.sub(u),f.sub(u),_.sub(g),m.sub(g);const Z=1/(_.x*m.y-m.x*_.y);isFinite(Z)&&(p.copy(d).multiplyScalar(m.y).addScaledVector(f,-_.y).multiplyScalar(Z),v.copy(f).multiplyScalar(_.x).addScaledVector(d,-m.x).multiplyScalar(Z),c[w].add(p),c[U].add(p),c[O].add(p),h[w].add(v),h[U].add(v),h[O].add(v))}let y=this.groups;y.length===0&&(y=[{start:0,count:i.length}]);for(let w=0,U=y.length;w<U;++w){const O=y[w],Z=O.start,D=O.count;for(let F=Z,V=Z+D;F<V;F+=3)x(i[F+0],i[F+1],i[F+2])}const b=new L,E=new L,S=new L,C=new L;function M(w){S.fromArray(r,w*3),C.copy(S);const U=c[w];b.copy(U),b.sub(S.multiplyScalar(S.dot(U))).normalize(),E.crossVectors(C,U);const Z=E.dot(h[w])<0?-1:1;l[w*4]=b.x,l[w*4+1]=b.y,l[w*4+2]=b.z,l[w*4+3]=Z}for(let w=0,U=y.length;w<U;++w){const O=y[w],Z=O.start,D=O.count;for(let F=Z,V=Z+D;F<V;F+=3)M(i[F+0]),M(i[F+1]),M(i[F+2])}}computeVertexNormals(){const t=this.index,e=this.getAttribute("position");if(e!==void 0){let i=this.getAttribute("normal");if(i===void 0)i=new Tn(new Float32Array(e.count*3),3),this.setAttribute("normal",i);else for(let d=0,f=i.count;d<f;d++)i.setXYZ(d,0,0,0);const s=new L,r=new L,o=new L,a=new L,l=new L,c=new L,h=new L,u=new L;if(t)for(let d=0,f=t.count;d<f;d+=3){const g=t.getX(d+0),_=t.getX(d+1),m=t.getX(d+2);s.fromBufferAttribute(e,g),r.fromBufferAttribute(e,_),o.fromBufferAttribute(e,m),h.subVectors(o,r),u.subVectors(s,r),h.cross(u),a.fromBufferAttribute(i,g),l.fromBufferAttribute(i,_),c.fromBufferAttribute(i,m),a.add(h),l.add(h),c.add(h),i.setXYZ(g,a.x,a.y,a.z),i.setXYZ(_,l.x,l.y,l.z),i.setXYZ(m,c.x,c.y,c.z)}else for(let d=0,f=e.count;d<f;d+=3)s.fromBufferAttribute(e,d+0),r.fromBufferAttribute(e,d+1),o.fromBufferAttribute(e,d+2),h.subVectors(o,r),u.subVectors(s,r),h.cross(u),i.setXYZ(d+0,h.x,h.y,h.z),i.setXYZ(d+1,h.x,h.y,h.z),i.setXYZ(d+2,h.x,h.y,h.z);this.normalizeNormals(),i.needsUpdate=!0}}normalizeNormals(){const t=this.attributes.normal;for(let e=0,i=t.count;e<i;e++)Ne.fromBufferAttribute(t,e),Ne.normalize(),t.setXYZ(e,Ne.x,Ne.y,Ne.z)}toNonIndexed(){function t(a,l){const c=a.array,h=a.itemSize,u=a.normalized,d=new c.constructor(l.length*h);let f=0,g=0;for(let _=0,m=l.length;_<m;_++){a.isInterleavedBufferAttribute?f=l[_]*a.data.stride+a.offset:f=l[_]*h;for(let p=0;p<h;p++)d[g++]=c[f++]}return new Tn(d,h,u)}if(this.index===null)return console.warn("THREE.BufferGeometry.toNonIndexed(): BufferGeometry is already non-indexed."),this;const e=new Ce,i=this.index.array,s=this.attributes;for(const a in s){const l=s[a],c=t(l,i);e.setAttribute(a,c)}const r=this.morphAttributes;for(const a in r){const l=[],c=r[a];for(let h=0,u=c.length;h<u;h++){const d=c[h],f=t(d,i);l.push(f)}e.morphAttributes[a]=l}e.morphTargetsRelative=this.morphTargetsRelative;const o=this.groups;for(let a=0,l=o.length;a<l;a++){const c=o[a];e.addGroup(c.start,c.count,c.materialIndex)}return e}toJSON(){const t={metadata:{version:4.6,type:"BufferGeometry",generator:"BufferGeometry.toJSON"}};if(t.uuid=this.uuid,t.type=this.type,this.name!==""&&(t.name=this.name),Object.keys(this.userData).length>0&&(t.userData=this.userData),this.parameters!==void 0){const l=this.parameters;for(const c in l)l[c]!==void 0&&(t[c]=l[c]);return t}t.data={attributes:{}};const e=this.index;e!==null&&(t.data.index={type:e.array.constructor.name,array:Array.prototype.slice.call(e.array)});const i=this.attributes;for(const l in i){const c=i[l];t.data.attributes[l]=c.toJSON(t.data)}const s={};let r=!1;for(const l in this.morphAttributes){const c=this.morphAttributes[l],h=[];for(let u=0,d=c.length;u<d;u++){const f=c[u];h.push(f.toJSON(t.data))}h.length>0&&(s[l]=h,r=!0)}r&&(t.data.morphAttributes=s,t.data.morphTargetsRelative=this.morphTargetsRelative);const o=this.groups;o.length>0&&(t.data.groups=JSON.parse(JSON.stringify(o)));const a=this.boundingSphere;return a!==null&&(t.data.boundingSphere={center:a.center.toArray(),radius:a.radius}),t}clone(){return new this.constructor().copy(this)}copy(t){this.index=null,this.attributes={},this.morphAttributes={},this.groups=[],this.boundingBox=null,this.boundingSphere=null;const e={};this.name=t.name;const i=t.index;i!==null&&this.setIndex(i.clone(e));const s=t.attributes;for(const c in s){const h=s[c];this.setAttribute(c,h.clone(e))}const r=t.morphAttributes;for(const c in r){const h=[],u=r[c];for(let d=0,f=u.length;d<f;d++)h.push(u[d].clone(e));this.morphAttributes[c]=h}this.morphTargetsRelative=t.morphTargetsRelative;const o=t.groups;for(let c=0,h=o.length;c<h;c++){const u=o[c];this.addGroup(u.start,u.count,u.materialIndex)}const a=t.boundingBox;a!==null&&(this.boundingBox=a.clone());const l=t.boundingSphere;return l!==null&&(this.boundingSphere=l.clone()),this.drawRange.start=t.drawRange.start,this.drawRange.count=t.drawRange.count,this.userData=t.userData,this}dispose(){this.dispatchEvent({type:"dispose"})}}const Mu=new ge,Ji=new bo,Ao=new Ls,yu=new L,ks=new L,Bs=new L,zs=new L,Tl=new L,Co=new L,Ro=new St,Po=new St,Lo=new St,Su=new L,Eu=new L,Tu=new L,Do=new L,Io=new L;class Kt extends Fe{constructor(t=new Ce,e=new on){super(),this.isMesh=!0,this.type="Mesh",this.geometry=t,this.material=e,this.updateMorphTargets()}copy(t,e){return super.copy(t,e),t.morphTargetInfluences!==void 0&&(this.morphTargetInfluences=t.morphTargetInfluences.slice()),t.morphTargetDictionary!==void 0&&(this.morphTargetDictionary=Object.assign({},t.morphTargetDictionary)),this.material=Array.isArray(t.material)?t.material.slice():t.material,this.geometry=t.geometry,this}updateMorphTargets(){const e=this.geometry.morphAttributes,i=Object.keys(e);if(i.length>0){const s=e[i[0]];if(s!==void 0){this.morphTargetInfluences=[],this.morphTargetDictionary={};for(let r=0,o=s.length;r<o;r++){const a=s[r].name||String(r);this.morphTargetInfluences.push(0),this.morphTargetDictionary[a]=r}}}}getVertexPosition(t,e){const i=this.geometry,s=i.attributes.position,r=i.morphAttributes.position,o=i.morphTargetsRelative;e.fromBufferAttribute(s,t);const a=this.morphTargetInfluences;if(r&&a){Co.set(0,0,0);for(let l=0,c=r.length;l<c;l++){const h=a[l],u=r[l];h!==0&&(Tl.fromBufferAttribute(u,t),o?Co.addScaledVector(Tl,h):Co.addScaledVector(Tl.sub(e),h))}e.add(Co)}return e}raycast(t,e){const i=this.geometry,s=this.material,r=this.matrixWorld;s!==void 0&&(i.boundingSphere===null&&i.computeBoundingSphere(),Ao.copy(i.boundingSphere),Ao.applyMatrix4(r),Ji.copy(t.ray).recast(t.near),!(Ao.containsPoint(Ji.origin)===!1&&(Ji.intersectSphere(Ao,yu)===null||Ji.origin.distanceToSquared(yu)>(t.far-t.near)**2))&&(Mu.copy(r).invert(),Ji.copy(t.ray).applyMatrix4(Mu),!(i.boundingBox!==null&&Ji.intersectsBox(i.boundingBox)===!1)&&this._computeIntersections(t,e,Ji)))}_computeIntersections(t,e,i){let s;const r=this.geometry,o=this.material,a=r.index,l=r.attributes.position,c=r.attributes.uv,h=r.attributes.uv1,u=r.attributes.normal,d=r.groups,f=r.drawRange;if(a!==null)if(Array.isArray(o))for(let g=0,_=d.length;g<_;g++){const m=d[g],p=o[m.materialIndex],v=Math.max(m.start,f.start),x=Math.min(a.count,Math.min(m.start+m.count,f.start+f.count));for(let y=v,b=x;y<b;y+=3){const E=a.getX(y),S=a.getX(y+1),C=a.getX(y+2);s=Oo(this,p,t,i,c,h,u,E,S,C),s&&(s.faceIndex=Math.floor(y/3),s.face.materialIndex=m.materialIndex,e.push(s))}}else{const g=Math.max(0,f.start),_=Math.min(a.count,f.start+f.count);for(let m=g,p=_;m<p;m+=3){const v=a.getX(m),x=a.getX(m+1),y=a.getX(m+2);s=Oo(this,o,t,i,c,h,u,v,x,y),s&&(s.faceIndex=Math.floor(m/3),e.push(s))}}else if(l!==void 0)if(Array.isArray(o))for(let g=0,_=d.length;g<_;g++){const m=d[g],p=o[m.materialIndex],v=Math.max(m.start,f.start),x=Math.min(l.count,Math.min(m.start+m.count,f.start+f.count));for(let y=v,b=x;y<b;y+=3){const E=y,S=y+1,C=y+2;s=Oo(this,p,t,i,c,h,u,E,S,C),s&&(s.faceIndex=Math.floor(y/3),s.face.materialIndex=m.materialIndex,e.push(s))}}else{const g=Math.max(0,f.start),_=Math.min(l.count,f.start+f.count);for(let m=g,p=_;m<p;m+=3){const v=m,x=m+1,y=m+2;s=Oo(this,o,t,i,c,h,u,v,x,y),s&&(s.faceIndex=Math.floor(m/3),e.push(s))}}}}function Dg(n,t,e,i,s,r,o,a){let l;if(t.side===sn?l=i.intersectTriangle(o,r,s,!0,a):l=i.intersectTriangle(s,r,o,t.side===yi,a),l===null)return null;Io.copy(a),Io.applyMatrix4(n.matrixWorld);const c=e.ray.origin.distanceTo(Io);return c<e.near||c>e.far?null:{distance:c,point:Io.clone(),object:n}}function Oo(n,t,e,i,s,r,o,a,l,c){n.getVertexPosition(a,ks),n.getVertexPosition(l,Bs),n.getVertexPosition(c,zs);const h=Dg(n,t,e,i,ks,Bs,zs,Do);if(h){s&&(Ro.fromBufferAttribute(s,a),Po.fromBufferAttribute(s,l),Lo.fromBufferAttribute(s,c),h.uv=En.getInterpolation(Do,ks,Bs,zs,Ro,Po,Lo,new St)),r&&(Ro.fromBufferAttribute(r,a),Po.fromBufferAttribute(r,l),Lo.fromBufferAttribute(r,c),h.uv1=En.getInterpolation(Do,ks,Bs,zs,Ro,Po,Lo,new St),h.uv2=h.uv1),o&&(Su.fromBufferAttribute(o,a),Eu.fromBufferAttribute(o,l),Tu.fromBufferAttribute(o,c),h.normal=En.getInterpolation(Do,ks,Bs,zs,Su,Eu,Tu,new L),h.normal.dot(i.direction)>0&&h.normal.multiplyScalar(-1));const u={a,b:l,c,normal:new L,materialIndex:0};En.getNormal(ks,Bs,zs,u.normal),h.face=u}return h}class Qi extends Ce{constructor(t=1,e=1,i=1,s=1,r=1,o=1){super(),this.type="BoxGeometry",this.parameters={width:t,height:e,depth:i,widthSegments:s,heightSegments:r,depthSegments:o};const a=this;s=Math.floor(s),r=Math.floor(r),o=Math.floor(o);const l=[],c=[],h=[],u=[];let d=0,f=0;g("z","y","x",-1,-1,i,e,t,o,r,0),g("z","y","x",1,-1,i,e,-t,o,r,1),g("x","z","y",1,1,t,i,e,s,o,2),g("x","z","y",1,-1,t,i,-e,s,o,3),g("x","y","z",1,-1,t,e,i,s,r,4),g("x","y","z",-1,-1,t,e,-i,s,r,5),this.setIndex(l),this.setAttribute("position",new re(c,3)),this.setAttribute("normal",new re(h,3)),this.setAttribute("uv",new re(u,2));function g(_,m,p,v,x,y,b,E,S,C,M){const w=y/S,U=b/C,O=y/2,Z=b/2,D=E/2,F=S+1,V=C+1;let $=0,K=0;const Y=new L;for(let Q=0;Q<V;Q++){const et=Q*U-Z;for(let pt=0;pt<F;pt++){const B=pt*w-O;Y[_]=B*v,Y[m]=et*x,Y[p]=D,c.push(Y.x,Y.y,Y.z),Y[_]=0,Y[m]=0,Y[p]=E>0?1:-1,h.push(Y.x,Y.y,Y.z),u.push(pt/S),u.push(1-Q/C),$+=1}}for(let Q=0;Q<C;Q++)for(let et=0;et<S;et++){const pt=d+et+F*Q,B=d+et+F*(Q+1),J=d+(et+1)+F*(Q+1),ct=d+(et+1)+F*Q;l.push(pt,B,ct),l.push(B,J,ct),K+=6}a.addGroup(f,K,M),f+=K,d+=$}}copy(t){return super.copy(t),this.parameters=Object.assign({},t.parameters),this}static fromJSON(t){return new Qi(t.width,t.height,t.depth,t.widthSegments,t.heightSegments,t.depthSegments)}}function Hs(n){const t={};for(const e in n){t[e]={};for(const i in n[e]){const s=n[e][i];s&&(s.isColor||s.isMatrix3||s.isMatrix4||s.isVector2||s.isVector3||s.isVector4||s.isTexture||s.isQuaternion)?s.isRenderTargetTexture?(console.warn("UniformsUtils: Textures of render targets cannot be cloned via cloneUniforms() or mergeUniforms()."),t[e][i]=null):t[e][i]=s.clone():Array.isArray(s)?t[e][i]=s.slice():t[e][i]=s}}return t}function Qe(n){const t={};for(let e=0;e<n.length;e++){const i=Hs(n[e]);for(const s in i)t[s]=i[s]}return t}function Ig(n){const t=[];for(let e=0;e<n.length;e++)t.push(n[e].clone());return t}function wu(n){return n.getRenderTarget()===null?n.outputColorSpace:se.workingColorSpace}const gr={clone:Hs,merge:Qe};var Og=`void main() {
	gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );
}`,Ug=`void main() {
	gl_FragColor = vec4( 1.0, 0.0, 0.0, 1.0 );
}`;class an extends Fs{constructor(t){super(),this.isShaderMaterial=!0,this.type="ShaderMaterial",this.defines={},this.uniforms={},this.uniformsGroups=[],this.vertexShader=Og,this.fragmentShader=Ug,this.linewidth=1,this.wireframe=!1,this.wireframeLinewidth=1,this.fog=!1,this.lights=!1,this.clipping=!1,this.forceSinglePass=!0,this.extensions={derivatives:!1,fragDepth:!1,drawBuffers:!1,shaderTextureLOD:!1,clipCullDistance:!1},this.defaultAttributeValues={color:[1,1,1],uv:[0,0],uv1:[0,0]},this.index0AttributeName=void 0,this.uniformsNeedUpdate=!1,this.glslVersion=null,t!==void 0&&this.setValues(t)}copy(t){return super.copy(t),this.fragmentShader=t.fragmentShader,this.vertexShader=t.vertexShader,this.uniforms=Hs(t.uniforms),this.uniformsGroups=Ig(t.uniformsGroups),this.defines=Object.assign({},t.defines),this.wireframe=t.wireframe,this.wireframeLinewidth=t.wireframeLinewidth,this.fog=t.fog,this.lights=t.lights,this.clipping=t.clipping,this.extensions=Object.assign({},t.extensions),this.glslVersion=t.glslVersion,this}toJSON(t){const e=super.toJSON(t);e.glslVersion=this.glslVersion,e.uniforms={};for(const s in this.uniforms){const o=this.uniforms[s].value;o&&o.isTexture?e.uniforms[s]={type:"t",value:o.toJSON(t).uuid}:o&&o.isColor?e.uniforms[s]={type:"c",value:o.getHex()}:o&&o.isVector2?e.uniforms[s]={type:"v2",value:o.toArray()}:o&&o.isVector3?e.uniforms[s]={type:"v3",value:o.toArray()}:o&&o.isVector4?e.uniforms[s]={type:"v4",value:o.toArray()}:o&&o.isMatrix3?e.uniforms[s]={type:"m3",value:o.toArray()}:o&&o.isMatrix4?e.uniforms[s]={type:"m4",value:o.toArray()}:e.uniforms[s]={value:o}}Object.keys(this.defines).length>0&&(e.defines=this.defines),e.vertexShader=this.vertexShader,e.fragmentShader=this.fragmentShader,e.lights=this.lights,e.clipping=this.clipping;const i={};for(const s in this.extensions)this.extensions[s]===!0&&(i[s]=!0);return Object.keys(i).length>0&&(e.extensions=i),e}}class Au extends Fe{constructor(){super(),this.isCamera=!0,this.type="Camera",this.matrixWorldInverse=new ge,this.projectionMatrix=new ge,this.projectionMatrixInverse=new ge,this.coordinateSystem=ri}copy(t,e){return super.copy(t,e),this.matrixWorldInverse.copy(t.matrixWorldInverse),this.projectionMatrix.copy(t.projectionMatrix),this.projectionMatrixInverse.copy(t.projectionMatrixInverse),this.coordinateSystem=t.coordinateSystem,this}getWorldDirection(t){return super.getWorldDirection(t).negate()}updateMatrixWorld(t){super.updateMatrixWorld(t),this.matrixWorldInverse.copy(this.matrixWorld).invert()}updateWorldMatrix(t,e){super.updateWorldMatrix(t,e),this.matrixWorldInverse.copy(this.matrixWorld).invert()}clone(){return new this.constructor().copy(this)}}class An extends Au{constructor(t=50,e=1,i=.1,s=2e3){super(),this.isPerspectiveCamera=!0,this.type="PerspectiveCamera",this.fov=t,this.zoom=1,this.near=i,this.far=s,this.focus=10,this.aspect=e,this.view=null,this.filmGauge=35,this.filmOffset=0,this.updateProjectionMatrix()}copy(t,e){return super.copy(t,e),this.fov=t.fov,this.zoom=t.zoom,this.near=t.near,this.far=t.far,this.focus=t.focus,this.aspect=t.aspect,this.view=t.view===null?null:Object.assign({},t.view),this.filmGauge=t.filmGauge,this.filmOffset=t.filmOffset,this}setFocalLength(t){const e=.5*this.getFilmHeight()/t;this.fov=ol*2*Math.atan(e),this.updateProjectionMatrix()}getFocalLength(){const t=Math.tan(lr*.5*this.fov);return .5*this.getFilmHeight()/t}getEffectiveFOV(){return ol*2*Math.atan(Math.tan(lr*.5*this.fov)/this.zoom)}getFilmWidth(){return this.filmGauge*Math.min(this.aspect,1)}getFilmHeight(){return this.filmGauge/Math.max(this.aspect,1)}setViewOffset(t,e,i,s,r,o){this.aspect=t/e,this.view===null&&(this.view={enabled:!0,fullWidth:1,fullHeight:1,offsetX:0,offsetY:0,width:1,height:1}),this.view.enabled=!0,this.view.fullWidth=t,this.view.fullHeight=e,this.view.offsetX=i,this.view.offsetY=s,this.view.width=r,this.view.height=o,this.updateProjectionMatrix()}clearViewOffset(){this.view!==null&&(this.view.enabled=!1),this.updateProjectionMatrix()}updateProjectionMatrix(){const t=this.near;let e=t*Math.tan(lr*.5*this.fov)/this.zoom,i=2*e,s=this.aspect*i,r=-.5*s;const o=this.view;if(this.view!==null&&this.view.enabled){const l=o.fullWidth,c=o.fullHeight;r+=o.offsetX*s/l,e-=o.offsetY*i/c,s*=o.width/l,i*=o.height/c}const a=this.filmOffset;a!==0&&(r+=t*a/this.getFilmWidth()),this.projectionMatrix.makePerspective(r,r+s,e,e-i,t,this.far,this.coordinateSystem),this.projectionMatrixInverse.copy(this.projectionMatrix).invert()}toJSON(t){const e=super.toJSON(t);return e.object.fov=this.fov,e.object.zoom=this.zoom,e.object.near=this.near,e.object.far=this.far,e.object.focus=this.focus,e.object.aspect=this.aspect,this.view!==null&&(e.object.view=Object.assign({},this.view)),e.object.filmGauge=this.filmGauge,e.object.filmOffset=this.filmOffset,e}}const Vs=-90,Gs=1;class Fg extends Fe{constructor(t,e,i){super(),this.type="CubeCamera",this.renderTarget=i,this.coordinateSystem=null,this.activeMipmapLevel=0;const s=new An(Vs,Gs,t,e);s.layers=this.layers,this.add(s);const r=new An(Vs,Gs,t,e);r.layers=this.layers,this.add(r);const o=new An(Vs,Gs,t,e);o.layers=this.layers,this.add(o);const a=new An(Vs,Gs,t,e);a.layers=this.layers,this.add(a);const l=new An(Vs,Gs,t,e);l.layers=this.layers,this.add(l);const c=new An(Vs,Gs,t,e);c.layers=this.layers,this.add(c)}updateCoordinateSystem(){const t=this.coordinateSystem,e=this.children.concat(),[i,s,r,o,a,l]=e;for(const c of e)this.remove(c);if(t===ri)i.up.set(0,1,0),i.lookAt(1,0,0),s.up.set(0,1,0),s.lookAt(-1,0,0),r.up.set(0,0,-1),r.lookAt(0,1,0),o.up.set(0,0,1),o.lookAt(0,-1,0),a.up.set(0,1,0),a.lookAt(0,0,1),l.up.set(0,1,0),l.lookAt(0,0,-1);else if(t===uo)i.up.set(0,-1,0),i.lookAt(-1,0,0),s.up.set(0,-1,0),s.lookAt(1,0,0),r.up.set(0,0,1),r.lookAt(0,1,0),o.up.set(0,0,-1),o.lookAt(0,-1,0),a.up.set(0,-1,0),a.lookAt(0,0,1),l.up.set(0,-1,0),l.lookAt(0,0,-1);else throw new Error("THREE.CubeCamera.updateCoordinateSystem(): Invalid coordinate system: "+t);for(const c of e)this.add(c),c.updateMatrixWorld()}update(t,e){this.parent===null&&this.updateMatrixWorld();const{renderTarget:i,activeMipmapLevel:s}=this;this.coordinateSystem!==t.coordinateSystem&&(this.coordinateSystem=t.coordinateSystem,this.updateCoordinateSystem());const[r,o,a,l,c,h]=this.children,u=t.getRenderTarget(),d=t.getActiveCubeFace(),f=t.getActiveMipmapLevel(),g=t.xr.enabled;t.xr.enabled=!1;const _=i.texture.generateMipmaps;i.texture.generateMipmaps=!1,t.setRenderTarget(i,0,s),t.render(e,r),t.setRenderTarget(i,1,s),t.render(e,o),t.setRenderTarget(i,2,s),t.render(e,a),t.setRenderTarget(i,3,s),t.render(e,l),t.setRenderTarget(i,4,s),t.render(e,c),i.texture.generateMipmaps=_,t.setRenderTarget(i,5,s),t.render(e,h),t.setRenderTarget(u,d,f),t.xr.enabled=g,i.texture.needsPMREMUpdate=!0}}class Cu extends fn{constructor(t,e,i,s,r,o,a,l,c,h){t=t!==void 0?t:[],e=e!==void 0?e:ys,super(t,e,i,s,r,o,a,l,c,h),this.isCubeTexture=!0,this.flipY=!1}get images(){return this.image}set images(t){this.image=t}}class Ng extends On{constructor(t=1,e={}){super(t,t,e),this.isWebGLCubeRenderTarget=!0;const i={width:t,height:t,depth:1},s=[i,i,i,i,i,i];e.encoding!==void 0&&(ur("THREE.WebGLCubeRenderTarget: option.encoding has been replaced by option.colorSpace."),e.colorSpace=e.encoding===Yi?Ve:yn),this.texture=new Cu(s,e.mapping,e.wrapS,e.wrapT,e.magFilter,e.minFilter,e.format,e.type,e.anisotropy,e.colorSpace),this.texture.isRenderTargetTexture=!0,this.texture.generateMipmaps=e.generateMipmaps!==void 0?e.generateMipmaps:!1,this.texture.minFilter=e.minFilter!==void 0?e.minFilter:Mn}fromEquirectangularTexture(t,e){this.texture.type=e.type,this.texture.colorSpace=e.colorSpace,this.texture.generateMipmaps=e.generateMipmaps,this.texture.minFilter=e.minFilter,this.texture.magFilter=e.magFilter;const i={uniforms:{tEquirect:{value:null}},vertexShader:`

				varying vec3 vWorldDirection;

				vec3 transformDirection( in vec3 dir, in mat4 matrix ) {

					return normalize( ( matrix * vec4( dir, 0.0 ) ).xyz );

				}

				void main() {

					vWorldDirection = transformDirection( position, modelMatrix );

					#include <begin_vertex>
					#include <project_vertex>

				}
			`,fragmentShader:`

				uniform sampler2D tEquirect;

				varying vec3 vWorldDirection;

				#include <common>

				void main() {

					vec3 direction = normalize( vWorldDirection );

					vec2 sampleUV = equirectUv( direction );

					gl_FragColor = texture2D( tEquirect, sampleUV );

				}
			`},s=new Qi(5,5,5),r=new an({name:"CubemapFromEquirect",uniforms:Hs(i.uniforms),vertexShader:i.vertexShader,fragmentShader:i.fragmentShader,side:sn,blending:ni});r.uniforms.tEquirect.value=e;const o=new Kt(s,r),a=e.minFilter;return e.minFilter===ar&&(e.minFilter=Mn),new Fg(1,10,this).update(t,o),e.minFilter=a,o.geometry.dispose(),o.material.dispose(),this}clear(t,e,i,s){const r=t.getRenderTarget();for(let o=0;o<6;o++)t.setRenderTarget(this,o),t.clear(e,i,s);t.setRenderTarget(r)}}const wl=new L,kg=new L,Bg=new Yt;class Di{constructor(t=new L(1,0,0),e=0){this.isPlane=!0,this.normal=t,this.constant=e}set(t,e){return this.normal.copy(t),this.constant=e,this}setComponents(t,e,i,s){return this.normal.set(t,e,i),this.constant=s,this}setFromNormalAndCoplanarPoint(t,e){return this.normal.copy(t),this.constant=-e.dot(this.normal),this}setFromCoplanarPoints(t,e,i){const s=wl.subVectors(i,e).cross(kg.subVectors(t,e)).normalize();return this.setFromNormalAndCoplanarPoint(s,t),this}copy(t){return this.normal.copy(t.normal),this.constant=t.constant,this}normalize(){const t=1/this.normal.length();return this.normal.multiplyScalar(t),this.constant*=t,this}negate(){return this.constant*=-1,this.normal.negate(),this}distanceToPoint(t){return this.normal.dot(t)+this.constant}distanceToSphere(t){return this.distanceToPoint(t.center)-t.radius}projectPoint(t,e){return e.copy(t).addScaledVector(this.normal,-this.distanceToPoint(t))}intersectLine(t,e){const i=t.delta(wl),s=this.normal.dot(i);if(s===0)return this.distanceToPoint(t.start)===0?e.copy(t.start):null;const r=-(t.start.dot(this.normal)+this.constant)/s;return r<0||r>1?null:e.copy(t.start).addScaledVector(i,r)}intersectsLine(t){const e=this.distanceToPoint(t.start),i=this.distanceToPoint(t.end);return e<0&&i>0||i<0&&e>0}intersectsBox(t){return t.intersectsPlane(this)}intersectsSphere(t){return t.intersectsPlane(this)}coplanarPoint(t){return t.copy(this.normal).multiplyScalar(-this.constant)}applyMatrix4(t,e){const i=e||Bg.getNormalMatrix(t),s=this.coplanarPoint(wl).applyMatrix4(t),r=this.normal.applyMatrix3(i).normalize();return this.constant=-s.dot(r),this}translate(t){return this.constant-=t.dot(this.normal),this}equals(t){return t.normal.equals(this.normal)&&t.constant===this.constant}clone(){return new this.constructor().copy(this)}}const ts=new Ls,Uo=new L;class Al{constructor(t=new Di,e=new Di,i=new Di,s=new Di,r=new Di,o=new Di){this.planes=[t,e,i,s,r,o]}set(t,e,i,s,r,o){const a=this.planes;return a[0].copy(t),a[1].copy(e),a[2].copy(i),a[3].copy(s),a[4].copy(r),a[5].copy(o),this}copy(t){const e=this.planes;for(let i=0;i<6;i++)e[i].copy(t.planes[i]);return this}setFromProjectionMatrix(t,e=ri){const i=this.planes,s=t.elements,r=s[0],o=s[1],a=s[2],l=s[3],c=s[4],h=s[5],u=s[6],d=s[7],f=s[8],g=s[9],_=s[10],m=s[11],p=s[12],v=s[13],x=s[14],y=s[15];if(i[0].setComponents(l-r,d-c,m-f,y-p).normalize(),i[1].setComponents(l+r,d+c,m+f,y+p).normalize(),i[2].setComponents(l+o,d+h,m+g,y+v).normalize(),i[3].setComponents(l-o,d-h,m-g,y-v).normalize(),i[4].setComponents(l-a,d-u,m-_,y-x).normalize(),e===ri)i[5].setComponents(l+a,d+u,m+_,y+x).normalize();else if(e===uo)i[5].setComponents(a,u,_,x).normalize();else throw new Error("THREE.Frustum.setFromProjectionMatrix(): Invalid coordinate system: "+e);return this}intersectsObject(t){if(t.boundingSphere!==void 0)t.boundingSphere===null&&t.computeBoundingSphere(),ts.copy(t.boundingSphere).applyMatrix4(t.matrixWorld);else{const e=t.geometry;e.boundingSphere===null&&e.computeBoundingSphere(),ts.copy(e.boundingSphere).applyMatrix4(t.matrixWorld)}return this.intersectsSphere(ts)}intersectsSprite(t){return ts.center.set(0,0,0),ts.radius=.7071067811865476,ts.applyMatrix4(t.matrixWorld),this.intersectsSphere(ts)}intersectsSphere(t){const e=this.planes,i=t.center,s=-t.radius;for(let r=0;r<6;r++)if(e[r].distanceToPoint(i)<s)return!1;return!0}intersectsBox(t){const e=this.planes;for(let i=0;i<6;i++){const s=e[i];if(Uo.x=s.normal.x>0?t.max.x:t.min.x,Uo.y=s.normal.y>0?t.max.y:t.min.y,Uo.z=s.normal.z>0?t.max.z:t.min.z,s.distanceToPoint(Uo)<0)return!1}return!0}containsPoint(t){const e=this.planes;for(let i=0;i<6;i++)if(e[i].distanceToPoint(t)<0)return!1;return!0}clone(){return new this.constructor().copy(this)}}function Ru(){let n=null,t=!1,e=null,i=null;function s(r,o){e(r,o),i=n.requestAnimationFrame(s)}return{start:function(){t!==!0&&e!==null&&(i=n.requestAnimationFrame(s),t=!0)},stop:function(){n.cancelAnimationFrame(i),t=!1},setAnimationLoop:function(r){e=r},setContext:function(r){n=r}}}function zg(n,t){const e=t.isWebGL2,i=new WeakMap;function s(c,h){const u=c.array,d=c.usage,f=u.byteLength,g=n.createBuffer();n.bindBuffer(h,g),n.bufferData(h,u,d),c.onUploadCallback();let _;if(u instanceof Float32Array)_=n.FLOAT;else if(u instanceof Uint16Array)if(c.isFloat16BufferAttribute)if(e)_=n.HALF_FLOAT;else throw new Error("THREE.WebGLAttributes: Usage of Float16BufferAttribute requires WebGL2.");else _=n.UNSIGNED_SHORT;else if(u instanceof Int16Array)_=n.SHORT;else if(u instanceof Uint32Array)_=n.UNSIGNED_INT;else if(u instanceof Int32Array)_=n.INT;else if(u instanceof Int8Array)_=n.BYTE;else if(u instanceof Uint8Array)_=n.UNSIGNED_BYTE;else if(u instanceof Uint8ClampedArray)_=n.UNSIGNED_BYTE;else throw new Error("THREE.WebGLAttributes: Unsupported buffer data format: "+u);return{buffer:g,type:_,bytesPerElement:u.BYTES_PER_ELEMENT,version:c.version,size:f}}function r(c,h,u){const d=h.array,f=h._updateRange,g=h.updateRanges;if(n.bindBuffer(u,c),f.count===-1&&g.length===0&&n.bufferSubData(u,0,d),g.length!==0){for(let _=0,m=g.length;_<m;_++){const p=g[_];e?n.bufferSubData(u,p.start*d.BYTES_PER_ELEMENT,d,p.start,p.count):n.bufferSubData(u,p.start*d.BYTES_PER_ELEMENT,d.subarray(p.start,p.start+p.count))}h.clearUpdateRanges()}f.count!==-1&&(e?n.bufferSubData(u,f.offset*d.BYTES_PER_ELEMENT,d,f.offset,f.count):n.bufferSubData(u,f.offset*d.BYTES_PER_ELEMENT,d.subarray(f.offset,f.offset+f.count)),f.count=-1),h.onUploadCallback()}function o(c){return c.isInterleavedBufferAttribute&&(c=c.data),i.get(c)}function a(c){c.isInterleavedBufferAttribute&&(c=c.data);const h=i.get(c);h&&(n.deleteBuffer(h.buffer),i.delete(c))}function l(c,h){if(c.isGLBufferAttribute){const d=i.get(c);(!d||d.version<c.version)&&i.set(c,{buffer:c.buffer,type:c.type,bytesPerElement:c.elementSize,version:c.version});return}c.isInterleavedBufferAttribute&&(c=c.data);const u=i.get(c);if(u===void 0)i.set(c,s(c,h));else if(u.version<c.version){if(u.size!==c.array.byteLength)throw new Error("THREE.WebGLAttributes: The size of the buffer attribute's array buffer does not match the original size. Resizing buffer attributes is not supported.");r(u.buffer,c,h),u.version=c.version}}return{get:o,remove:a,update:l}}class _r extends Ce{constructor(t=1,e=1,i=1,s=1){super(),this.type="PlaneGeometry",this.parameters={width:t,height:e,widthSegments:i,heightSegments:s};const r=t/2,o=e/2,a=Math.floor(i),l=Math.floor(s),c=a+1,h=l+1,u=t/a,d=e/l,f=[],g=[],_=[],m=[];for(let p=0;p<h;p++){const v=p*d-o;for(let x=0;x<c;x++){const y=x*u-r;g.push(y,-v,0),_.push(0,0,1),m.push(x/a),m.push(1-p/l)}}for(let p=0;p<l;p++)for(let v=0;v<a;v++){const x=v+c*p,y=v+c*(p+1),b=v+1+c*(p+1),E=v+1+c*p;f.push(x,y,E),f.push(y,b,E)}this.setIndex(f),this.setAttribute("position",new re(g,3)),this.setAttribute("normal",new re(_,3)),this.setAttribute("uv",new re(m,2))}copy(t){return super.copy(t),this.parameters=Object.assign({},t.parameters),this}static fromJSON(t){return new _r(t.width,t.height,t.widthSegments,t.heightSegments)}}var Hg=`#ifdef USE_ALPHAHASH
	if ( diffuseColor.a < getAlphaHashThreshold( vPosition ) ) discard;
#endif`,Vg=`#ifdef USE_ALPHAHASH
	const float ALPHA_HASH_SCALE = 0.05;
	float hash2D( vec2 value ) {
		return fract( 1.0e4 * sin( 17.0 * value.x + 0.1 * value.y ) * ( 0.1 + abs( sin( 13.0 * value.y + value.x ) ) ) );
	}
	float hash3D( vec3 value ) {
		return hash2D( vec2( hash2D( value.xy ), value.z ) );
	}
	float getAlphaHashThreshold( vec3 position ) {
		float maxDeriv = max(
			length( dFdx( position.xyz ) ),
			length( dFdy( position.xyz ) )
		);
		float pixScale = 1.0 / ( ALPHA_HASH_SCALE * maxDeriv );
		vec2 pixScales = vec2(
			exp2( floor( log2( pixScale ) ) ),
			exp2( ceil( log2( pixScale ) ) )
		);
		vec2 alpha = vec2(
			hash3D( floor( pixScales.x * position.xyz ) ),
			hash3D( floor( pixScales.y * position.xyz ) )
		);
		float lerpFactor = fract( log2( pixScale ) );
		float x = ( 1.0 - lerpFactor ) * alpha.x + lerpFactor * alpha.y;
		float a = min( lerpFactor, 1.0 - lerpFactor );
		vec3 cases = vec3(
			x * x / ( 2.0 * a * ( 1.0 - a ) ),
			( x - 0.5 * a ) / ( 1.0 - a ),
			1.0 - ( ( 1.0 - x ) * ( 1.0 - x ) / ( 2.0 * a * ( 1.0 - a ) ) )
		);
		float threshold = ( x < ( 1.0 - a ) )
			? ( ( x < a ) ? cases.x : cases.y )
			: cases.z;
		return clamp( threshold , 1.0e-6, 1.0 );
	}
#endif`,Gg=`#ifdef USE_ALPHAMAP
	diffuseColor.a *= texture2D( alphaMap, vAlphaMapUv ).g;
#endif`,Wg=`#ifdef USE_ALPHAMAP
	uniform sampler2D alphaMap;
#endif`,Xg=`#ifdef USE_ALPHATEST
	if ( diffuseColor.a < alphaTest ) discard;
#endif`,jg=`#ifdef USE_ALPHATEST
	uniform float alphaTest;
#endif`,Yg=`#ifdef USE_AOMAP
	float ambientOcclusion = ( texture2D( aoMap, vAoMapUv ).r - 1.0 ) * aoMapIntensity + 1.0;
	reflectedLight.indirectDiffuse *= ambientOcclusion;
	#if defined( USE_CLEARCOAT ) 
		clearcoatSpecularIndirect *= ambientOcclusion;
	#endif
	#if defined( USE_SHEEN ) 
		sheenSpecularIndirect *= ambientOcclusion;
	#endif
	#if defined( USE_ENVMAP ) && defined( STANDARD )
		float dotNV = saturate( dot( geometryNormal, geometryViewDir ) );
		reflectedLight.indirectSpecular *= computeSpecularOcclusion( dotNV, ambientOcclusion, material.roughness );
	#endif
#endif`,qg=`#ifdef USE_AOMAP
	uniform sampler2D aoMap;
	uniform float aoMapIntensity;
#endif`,$g=`#ifdef USE_BATCHING
	attribute float batchId;
	uniform highp sampler2D batchingTexture;
	mat4 getBatchingMatrix( const in float i ) {
		int size = textureSize( batchingTexture, 0 ).x;
		int j = int( i ) * 4;
		int x = j % size;
		int y = j / size;
		vec4 v1 = texelFetch( batchingTexture, ivec2( x, y ), 0 );
		vec4 v2 = texelFetch( batchingTexture, ivec2( x + 1, y ), 0 );
		vec4 v3 = texelFetch( batchingTexture, ivec2( x + 2, y ), 0 );
		vec4 v4 = texelFetch( batchingTexture, ivec2( x + 3, y ), 0 );
		return mat4( v1, v2, v3, v4 );
	}
#endif`,Kg=`#ifdef USE_BATCHING
	mat4 batchingMatrix = getBatchingMatrix( batchId );
#endif`,Zg=`vec3 transformed = vec3( position );
#ifdef USE_ALPHAHASH
	vPosition = vec3( position );
#endif`,Jg=`vec3 objectNormal = vec3( normal );
#ifdef USE_TANGENT
	vec3 objectTangent = vec3( tangent.xyz );
#endif`,Qg=`float G_BlinnPhong_Implicit( ) {
	return 0.25;
}
float D_BlinnPhong( const in float shininess, const in float dotNH ) {
	return RECIPROCAL_PI * ( shininess * 0.5 + 1.0 ) * pow( dotNH, shininess );
}
vec3 BRDF_BlinnPhong( const in vec3 lightDir, const in vec3 viewDir, const in vec3 normal, const in vec3 specularColor, const in float shininess ) {
	vec3 halfDir = normalize( lightDir + viewDir );
	float dotNH = saturate( dot( normal, halfDir ) );
	float dotVH = saturate( dot( viewDir, halfDir ) );
	vec3 F = F_Schlick( specularColor, 1.0, dotVH );
	float G = G_BlinnPhong_Implicit( );
	float D = D_BlinnPhong( shininess, dotNH );
	return F * ( G * D );
} // validated`,t0=`#ifdef USE_IRIDESCENCE
	const mat3 XYZ_TO_REC709 = mat3(
		 3.2404542, -0.9692660,  0.0556434,
		-1.5371385,  1.8760108, -0.2040259,
		-0.4985314,  0.0415560,  1.0572252
	);
	vec3 Fresnel0ToIor( vec3 fresnel0 ) {
		vec3 sqrtF0 = sqrt( fresnel0 );
		return ( vec3( 1.0 ) + sqrtF0 ) / ( vec3( 1.0 ) - sqrtF0 );
	}
	vec3 IorToFresnel0( vec3 transmittedIor, float incidentIor ) {
		return pow2( ( transmittedIor - vec3( incidentIor ) ) / ( transmittedIor + vec3( incidentIor ) ) );
	}
	float IorToFresnel0( float transmittedIor, float incidentIor ) {
		return pow2( ( transmittedIor - incidentIor ) / ( transmittedIor + incidentIor ));
	}
	vec3 evalSensitivity( float OPD, vec3 shift ) {
		float phase = 2.0 * PI * OPD * 1.0e-9;
		vec3 val = vec3( 5.4856e-13, 4.4201e-13, 5.2481e-13 );
		vec3 pos = vec3( 1.6810e+06, 1.7953e+06, 2.2084e+06 );
		vec3 var = vec3( 4.3278e+09, 9.3046e+09, 6.6121e+09 );
		vec3 xyz = val * sqrt( 2.0 * PI * var ) * cos( pos * phase + shift ) * exp( - pow2( phase ) * var );
		xyz.x += 9.7470e-14 * sqrt( 2.0 * PI * 4.5282e+09 ) * cos( 2.2399e+06 * phase + shift[ 0 ] ) * exp( - 4.5282e+09 * pow2( phase ) );
		xyz /= 1.0685e-7;
		vec3 rgb = XYZ_TO_REC709 * xyz;
		return rgb;
	}
	vec3 evalIridescence( float outsideIOR, float eta2, float cosTheta1, float thinFilmThickness, vec3 baseF0 ) {
		vec3 I;
		float iridescenceIOR = mix( outsideIOR, eta2, smoothstep( 0.0, 0.03, thinFilmThickness ) );
		float sinTheta2Sq = pow2( outsideIOR / iridescenceIOR ) * ( 1.0 - pow2( cosTheta1 ) );
		float cosTheta2Sq = 1.0 - sinTheta2Sq;
		if ( cosTheta2Sq < 0.0 ) {
			return vec3( 1.0 );
		}
		float cosTheta2 = sqrt( cosTheta2Sq );
		float R0 = IorToFresnel0( iridescenceIOR, outsideIOR );
		float R12 = F_Schlick( R0, 1.0, cosTheta1 );
		float T121 = 1.0 - R12;
		float phi12 = 0.0;
		if ( iridescenceIOR < outsideIOR ) phi12 = PI;
		float phi21 = PI - phi12;
		vec3 baseIOR = Fresnel0ToIor( clamp( baseF0, 0.0, 0.9999 ) );		vec3 R1 = IorToFresnel0( baseIOR, iridescenceIOR );
		vec3 R23 = F_Schlick( R1, 1.0, cosTheta2 );
		vec3 phi23 = vec3( 0.0 );
		if ( baseIOR[ 0 ] < iridescenceIOR ) phi23[ 0 ] = PI;
		if ( baseIOR[ 1 ] < iridescenceIOR ) phi23[ 1 ] = PI;
		if ( baseIOR[ 2 ] < iridescenceIOR ) phi23[ 2 ] = PI;
		float OPD = 2.0 * iridescenceIOR * thinFilmThickness * cosTheta2;
		vec3 phi = vec3( phi21 ) + phi23;
		vec3 R123 = clamp( R12 * R23, 1e-5, 0.9999 );
		vec3 r123 = sqrt( R123 );
		vec3 Rs = pow2( T121 ) * R23 / ( vec3( 1.0 ) - R123 );
		vec3 C0 = R12 + Rs;
		I = C0;
		vec3 Cm = Rs - T121;
		for ( int m = 1; m <= 2; ++ m ) {
			Cm *= r123;
			vec3 Sm = 2.0 * evalSensitivity( float( m ) * OPD, float( m ) * phi );
			I += Cm * Sm;
		}
		return max( I, vec3( 0.0 ) );
	}
#endif`,e0=`#ifdef USE_BUMPMAP
	uniform sampler2D bumpMap;
	uniform float bumpScale;
	vec2 dHdxy_fwd() {
		vec2 dSTdx = dFdx( vBumpMapUv );
		vec2 dSTdy = dFdy( vBumpMapUv );
		float Hll = bumpScale * texture2D( bumpMap, vBumpMapUv ).x;
		float dBx = bumpScale * texture2D( bumpMap, vBumpMapUv + dSTdx ).x - Hll;
		float dBy = bumpScale * texture2D( bumpMap, vBumpMapUv + dSTdy ).x - Hll;
		return vec2( dBx, dBy );
	}
	vec3 perturbNormalArb( vec3 surf_pos, vec3 surf_norm, vec2 dHdxy, float faceDirection ) {
		vec3 vSigmaX = normalize( dFdx( surf_pos.xyz ) );
		vec3 vSigmaY = normalize( dFdy( surf_pos.xyz ) );
		vec3 vN = surf_norm;
		vec3 R1 = cross( vSigmaY, vN );
		vec3 R2 = cross( vN, vSigmaX );
		float fDet = dot( vSigmaX, R1 ) * faceDirection;
		vec3 vGrad = sign( fDet ) * ( dHdxy.x * R1 + dHdxy.y * R2 );
		return normalize( abs( fDet ) * surf_norm - vGrad );
	}
#endif`,n0=`#if NUM_CLIPPING_PLANES > 0
	vec4 plane;
	#pragma unroll_loop_start
	for ( int i = 0; i < UNION_CLIPPING_PLANES; i ++ ) {
		plane = clippingPlanes[ i ];
		if ( dot( vClipPosition, plane.xyz ) > plane.w ) discard;
	}
	#pragma unroll_loop_end
	#if UNION_CLIPPING_PLANES < NUM_CLIPPING_PLANES
		bool clipped = true;
		#pragma unroll_loop_start
		for ( int i = UNION_CLIPPING_PLANES; i < NUM_CLIPPING_PLANES; i ++ ) {
			plane = clippingPlanes[ i ];
			clipped = ( dot( vClipPosition, plane.xyz ) > plane.w ) && clipped;
		}
		#pragma unroll_loop_end
		if ( clipped ) discard;
	#endif
#endif`,i0=`#if NUM_CLIPPING_PLANES > 0
	varying vec3 vClipPosition;
	uniform vec4 clippingPlanes[ NUM_CLIPPING_PLANES ];
#endif`,s0=`#if NUM_CLIPPING_PLANES > 0
	varying vec3 vClipPosition;
#endif`,r0=`#if NUM_CLIPPING_PLANES > 0
	vClipPosition = - mvPosition.xyz;
#endif`,o0=`#if defined( USE_COLOR_ALPHA )
	diffuseColor *= vColor;
#elif defined( USE_COLOR )
	diffuseColor.rgb *= vColor;
#endif`,a0=`#if defined( USE_COLOR_ALPHA )
	varying vec4 vColor;
#elif defined( USE_COLOR )
	varying vec3 vColor;
#endif`,l0=`#if defined( USE_COLOR_ALPHA )
	varying vec4 vColor;
#elif defined( USE_COLOR ) || defined( USE_INSTANCING_COLOR )
	varying vec3 vColor;
#endif`,c0=`#if defined( USE_COLOR_ALPHA )
	vColor = vec4( 1.0 );
#elif defined( USE_COLOR ) || defined( USE_INSTANCING_COLOR )
	vColor = vec3( 1.0 );
#endif
#ifdef USE_COLOR
	vColor *= color;
#endif
#ifdef USE_INSTANCING_COLOR
	vColor.xyz *= instanceColor.xyz;
#endif`,h0=`#define PI 3.141592653589793
#define PI2 6.283185307179586
#define PI_HALF 1.5707963267948966
#define RECIPROCAL_PI 0.3183098861837907
#define RECIPROCAL_PI2 0.15915494309189535
#define EPSILON 1e-6
#ifndef saturate
#define saturate( a ) clamp( a, 0.0, 1.0 )
#endif
#define whiteComplement( a ) ( 1.0 - saturate( a ) )
float pow2( const in float x ) { return x*x; }
vec3 pow2( const in vec3 x ) { return x*x; }
float pow3( const in float x ) { return x*x*x; }
float pow4( const in float x ) { float x2 = x*x; return x2*x2; }
float max3( const in vec3 v ) { return max( max( v.x, v.y ), v.z ); }
float average( const in vec3 v ) { return dot( v, vec3( 0.3333333 ) ); }
highp float rand( const in vec2 uv ) {
	const highp float a = 12.9898, b = 78.233, c = 43758.5453;
	highp float dt = dot( uv.xy, vec2( a,b ) ), sn = mod( dt, PI );
	return fract( sin( sn ) * c );
}
#ifdef HIGH_PRECISION
	float precisionSafeLength( vec3 v ) { return length( v ); }
#else
	float precisionSafeLength( vec3 v ) {
		float maxComponent = max3( abs( v ) );
		return length( v / maxComponent ) * maxComponent;
	}
#endif
struct IncidentLight {
	vec3 color;
	vec3 direction;
	bool visible;
};
struct ReflectedLight {
	vec3 directDiffuse;
	vec3 directSpecular;
	vec3 indirectDiffuse;
	vec3 indirectSpecular;
};
#ifdef USE_ALPHAHASH
	varying vec3 vPosition;
#endif
vec3 transformDirection( in vec3 dir, in mat4 matrix ) {
	return normalize( ( matrix * vec4( dir, 0.0 ) ).xyz );
}
vec3 inverseTransformDirection( in vec3 dir, in mat4 matrix ) {
	return normalize( ( vec4( dir, 0.0 ) * matrix ).xyz );
}
mat3 transposeMat3( const in mat3 m ) {
	mat3 tmp;
	tmp[ 0 ] = vec3( m[ 0 ].x, m[ 1 ].x, m[ 2 ].x );
	tmp[ 1 ] = vec3( m[ 0 ].y, m[ 1 ].y, m[ 2 ].y );
	tmp[ 2 ] = vec3( m[ 0 ].z, m[ 1 ].z, m[ 2 ].z );
	return tmp;
}
float luminance( const in vec3 rgb ) {
	const vec3 weights = vec3( 0.2126729, 0.7151522, 0.0721750 );
	return dot( weights, rgb );
}
bool isPerspectiveMatrix( mat4 m ) {
	return m[ 2 ][ 3 ] == - 1.0;
}
vec2 equirectUv( in vec3 dir ) {
	float u = atan( dir.z, dir.x ) * RECIPROCAL_PI2 + 0.5;
	float v = asin( clamp( dir.y, - 1.0, 1.0 ) ) * RECIPROCAL_PI + 0.5;
	return vec2( u, v );
}
vec3 BRDF_Lambert( const in vec3 diffuseColor ) {
	return RECIPROCAL_PI * diffuseColor;
}
vec3 F_Schlick( const in vec3 f0, const in float f90, const in float dotVH ) {
	float fresnel = exp2( ( - 5.55473 * dotVH - 6.98316 ) * dotVH );
	return f0 * ( 1.0 - fresnel ) + ( f90 * fresnel );
}
float F_Schlick( const in float f0, const in float f90, const in float dotVH ) {
	float fresnel = exp2( ( - 5.55473 * dotVH - 6.98316 ) * dotVH );
	return f0 * ( 1.0 - fresnel ) + ( f90 * fresnel );
} // validated`,u0=`#ifdef ENVMAP_TYPE_CUBE_UV
	#define cubeUV_minMipLevel 4.0
	#define cubeUV_minTileSize 16.0
	float getFace( vec3 direction ) {
		vec3 absDirection = abs( direction );
		float face = - 1.0;
		if ( absDirection.x > absDirection.z ) {
			if ( absDirection.x > absDirection.y )
				face = direction.x > 0.0 ? 0.0 : 3.0;
			else
				face = direction.y > 0.0 ? 1.0 : 4.0;
		} else {
			if ( absDirection.z > absDirection.y )
				face = direction.z > 0.0 ? 2.0 : 5.0;
			else
				face = direction.y > 0.0 ? 1.0 : 4.0;
		}
		return face;
	}
	vec2 getUV( vec3 direction, float face ) {
		vec2 uv;
		if ( face == 0.0 ) {
			uv = vec2( direction.z, direction.y ) / abs( direction.x );
		} else if ( face == 1.0 ) {
			uv = vec2( - direction.x, - direction.z ) / abs( direction.y );
		} else if ( face == 2.0 ) {
			uv = vec2( - direction.x, direction.y ) / abs( direction.z );
		} else if ( face == 3.0 ) {
			uv = vec2( - direction.z, direction.y ) / abs( direction.x );
		} else if ( face == 4.0 ) {
			uv = vec2( - direction.x, direction.z ) / abs( direction.y );
		} else {
			uv = vec2( direction.x, direction.y ) / abs( direction.z );
		}
		return 0.5 * ( uv + 1.0 );
	}
	vec3 bilinearCubeUV( sampler2D envMap, vec3 direction, float mipInt ) {
		float face = getFace( direction );
		float filterInt = max( cubeUV_minMipLevel - mipInt, 0.0 );
		mipInt = max( mipInt, cubeUV_minMipLevel );
		float faceSize = exp2( mipInt );
		highp vec2 uv = getUV( direction, face ) * ( faceSize - 2.0 ) + 1.0;
		if ( face > 2.0 ) {
			uv.y += faceSize;
			face -= 3.0;
		}
		uv.x += face * faceSize;
		uv.x += filterInt * 3.0 * cubeUV_minTileSize;
		uv.y += 4.0 * ( exp2( CUBEUV_MAX_MIP ) - faceSize );
		uv.x *= CUBEUV_TEXEL_WIDTH;
		uv.y *= CUBEUV_TEXEL_HEIGHT;
		#ifdef texture2DGradEXT
			return texture2DGradEXT( envMap, uv, vec2( 0.0 ), vec2( 0.0 ) ).rgb;
		#else
			return texture2D( envMap, uv ).rgb;
		#endif
	}
	#define cubeUV_r0 1.0
	#define cubeUV_m0 - 2.0
	#define cubeUV_r1 0.8
	#define cubeUV_m1 - 1.0
	#define cubeUV_r4 0.4
	#define cubeUV_m4 2.0
	#define cubeUV_r5 0.305
	#define cubeUV_m5 3.0
	#define cubeUV_r6 0.21
	#define cubeUV_m6 4.0
	float roughnessToMip( float roughness ) {
		float mip = 0.0;
		if ( roughness >= cubeUV_r1 ) {
			mip = ( cubeUV_r0 - roughness ) * ( cubeUV_m1 - cubeUV_m0 ) / ( cubeUV_r0 - cubeUV_r1 ) + cubeUV_m0;
		} else if ( roughness >= cubeUV_r4 ) {
			mip = ( cubeUV_r1 - roughness ) * ( cubeUV_m4 - cubeUV_m1 ) / ( cubeUV_r1 - cubeUV_r4 ) + cubeUV_m1;
		} else if ( roughness >= cubeUV_r5 ) {
			mip = ( cubeUV_r4 - roughness ) * ( cubeUV_m5 - cubeUV_m4 ) / ( cubeUV_r4 - cubeUV_r5 ) + cubeUV_m4;
		} else if ( roughness >= cubeUV_r6 ) {
			mip = ( cubeUV_r5 - roughness ) * ( cubeUV_m6 - cubeUV_m5 ) / ( cubeUV_r5 - cubeUV_r6 ) + cubeUV_m5;
		} else {
			mip = - 2.0 * log2( 1.16 * roughness );		}
		return mip;
	}
	vec4 textureCubeUV( sampler2D envMap, vec3 sampleDir, float roughness ) {
		float mip = clamp( roughnessToMip( roughness ), cubeUV_m0, CUBEUV_MAX_MIP );
		float mipF = fract( mip );
		float mipInt = floor( mip );
		vec3 color0 = bilinearCubeUV( envMap, sampleDir, mipInt );
		if ( mipF == 0.0 ) {
			return vec4( color0, 1.0 );
		} else {
			vec3 color1 = bilinearCubeUV( envMap, sampleDir, mipInt + 1.0 );
			return vec4( mix( color0, color1, mipF ), 1.0 );
		}
	}
#endif`,d0=`vec3 transformedNormal = objectNormal;
#ifdef USE_TANGENT
	vec3 transformedTangent = objectTangent;
#endif
#ifdef USE_BATCHING
	mat3 bm = mat3( batchingMatrix );
	transformedNormal /= vec3( dot( bm[ 0 ], bm[ 0 ] ), dot( bm[ 1 ], bm[ 1 ] ), dot( bm[ 2 ], bm[ 2 ] ) );
	transformedNormal = bm * transformedNormal;
	#ifdef USE_TANGENT
		transformedTangent = bm * transformedTangent;
	#endif
#endif
#ifdef USE_INSTANCING
	mat3 im = mat3( instanceMatrix );
	transformedNormal /= vec3( dot( im[ 0 ], im[ 0 ] ), dot( im[ 1 ], im[ 1 ] ), dot( im[ 2 ], im[ 2 ] ) );
	transformedNormal = im * transformedNormal;
	#ifdef USE_TANGENT
		transformedTangent = im * transformedTangent;
	#endif
#endif
transformedNormal = normalMatrix * transformedNormal;
#ifdef FLIP_SIDED
	transformedNormal = - transformedNormal;
#endif
#ifdef USE_TANGENT
	transformedTangent = ( modelViewMatrix * vec4( transformedTangent, 0.0 ) ).xyz;
	#ifdef FLIP_SIDED
		transformedTangent = - transformedTangent;
	#endif
#endif`,f0=`#ifdef USE_DISPLACEMENTMAP
	uniform sampler2D displacementMap;
	uniform float displacementScale;
	uniform float displacementBias;
#endif`,p0=`#ifdef USE_DISPLACEMENTMAP
	transformed += normalize( objectNormal ) * ( texture2D( displacementMap, vDisplacementMapUv ).x * displacementScale + displacementBias );
#endif`,m0=`#ifdef USE_EMISSIVEMAP
	vec4 emissiveColor = texture2D( emissiveMap, vEmissiveMapUv );
	totalEmissiveRadiance *= emissiveColor.rgb;
#endif`,g0=`#ifdef USE_EMISSIVEMAP
	uniform sampler2D emissiveMap;
#endif`,_0="gl_FragColor = linearToOutputTexel( gl_FragColor );",x0=`
const mat3 LINEAR_SRGB_TO_LINEAR_DISPLAY_P3 = mat3(
	vec3( 0.8224621, 0.177538, 0.0 ),
	vec3( 0.0331941, 0.9668058, 0.0 ),
	vec3( 0.0170827, 0.0723974, 0.9105199 )
);
const mat3 LINEAR_DISPLAY_P3_TO_LINEAR_SRGB = mat3(
	vec3( 1.2249401, - 0.2249404, 0.0 ),
	vec3( - 0.0420569, 1.0420571, 0.0 ),
	vec3( - 0.0196376, - 0.0786361, 1.0982735 )
);
vec4 LinearSRGBToLinearDisplayP3( in vec4 value ) {
	return vec4( value.rgb * LINEAR_SRGB_TO_LINEAR_DISPLAY_P3, value.a );
}
vec4 LinearDisplayP3ToLinearSRGB( in vec4 value ) {
	return vec4( value.rgb * LINEAR_DISPLAY_P3_TO_LINEAR_SRGB, value.a );
}
vec4 LinearTransferOETF( in vec4 value ) {
	return value;
}
vec4 sRGBTransferOETF( in vec4 value ) {
	return vec4( mix( pow( value.rgb, vec3( 0.41666 ) ) * 1.055 - vec3( 0.055 ), value.rgb * 12.92, vec3( lessThanEqual( value.rgb, vec3( 0.0031308 ) ) ) ), value.a );
}
vec4 LinearToLinear( in vec4 value ) {
	return value;
}
vec4 LinearTosRGB( in vec4 value ) {
	return sRGBTransferOETF( value );
}`,v0=`#ifdef USE_ENVMAP
	#ifdef ENV_WORLDPOS
		vec3 cameraToFrag;
		if ( isOrthographic ) {
			cameraToFrag = normalize( vec3( - viewMatrix[ 0 ][ 2 ], - viewMatrix[ 1 ][ 2 ], - viewMatrix[ 2 ][ 2 ] ) );
		} else {
			cameraToFrag = normalize( vWorldPosition - cameraPosition );
		}
		vec3 worldNormal = inverseTransformDirection( normal, viewMatrix );
		#ifdef ENVMAP_MODE_REFLECTION
			vec3 reflectVec = reflect( cameraToFrag, worldNormal );
		#else
			vec3 reflectVec = refract( cameraToFrag, worldNormal, refractionRatio );
		#endif
	#else
		vec3 reflectVec = vReflect;
	#endif
	#ifdef ENVMAP_TYPE_CUBE
		vec4 envColor = textureCube( envMap, vec3( flipEnvMap * reflectVec.x, reflectVec.yz ) );
	#else
		vec4 envColor = vec4( 0.0 );
	#endif
	#ifdef ENVMAP_BLENDING_MULTIPLY
		outgoingLight = mix( outgoingLight, outgoingLight * envColor.xyz, specularStrength * reflectivity );
	#elif defined( ENVMAP_BLENDING_MIX )
		outgoingLight = mix( outgoingLight, envColor.xyz, specularStrength * reflectivity );
	#elif defined( ENVMAP_BLENDING_ADD )
		outgoingLight += envColor.xyz * specularStrength * reflectivity;
	#endif
#endif`,b0=`#ifdef USE_ENVMAP
	uniform float envMapIntensity;
	uniform float flipEnvMap;
	#ifdef ENVMAP_TYPE_CUBE
		uniform samplerCube envMap;
	#else
		uniform sampler2D envMap;
	#endif
	
#endif`,M0=`#ifdef USE_ENVMAP
	uniform float reflectivity;
	#if defined( USE_BUMPMAP ) || defined( USE_NORMALMAP ) || defined( PHONG ) || defined( LAMBERT )
		#define ENV_WORLDPOS
	#endif
	#ifdef ENV_WORLDPOS
		varying vec3 vWorldPosition;
		uniform float refractionRatio;
	#else
		varying vec3 vReflect;
	#endif
#endif`,y0=`#ifdef USE_ENVMAP
	#if defined( USE_BUMPMAP ) || defined( USE_NORMALMAP ) || defined( PHONG ) || defined( LAMBERT )
		#define ENV_WORLDPOS
	#endif
	#ifdef ENV_WORLDPOS
		
		varying vec3 vWorldPosition;
	#else
		varying vec3 vReflect;
		uniform float refractionRatio;
	#endif
#endif`,S0=`#ifdef USE_ENVMAP
	#ifdef ENV_WORLDPOS
		vWorldPosition = worldPosition.xyz;
	#else
		vec3 cameraToVertex;
		if ( isOrthographic ) {
			cameraToVertex = normalize( vec3( - viewMatrix[ 0 ][ 2 ], - viewMatrix[ 1 ][ 2 ], - viewMatrix[ 2 ][ 2 ] ) );
		} else {
			cameraToVertex = normalize( worldPosition.xyz - cameraPosition );
		}
		vec3 worldNormal = inverseTransformDirection( transformedNormal, viewMatrix );
		#ifdef ENVMAP_MODE_REFLECTION
			vReflect = reflect( cameraToVertex, worldNormal );
		#else
			vReflect = refract( cameraToVertex, worldNormal, refractionRatio );
		#endif
	#endif
#endif`,E0=`#ifdef USE_FOG
	vFogDepth = - mvPosition.z;
#endif`,T0=`#ifdef USE_FOG
	varying float vFogDepth;
#endif`,w0=`#ifdef USE_FOG
	#ifdef FOG_EXP2
		float fogFactor = 1.0 - exp( - fogDensity * fogDensity * vFogDepth * vFogDepth );
	#else
		float fogFactor = smoothstep( fogNear, fogFar, vFogDepth );
	#endif
	gl_FragColor.rgb = mix( gl_FragColor.rgb, fogColor, fogFactor );
#endif`,A0=`#ifdef USE_FOG
	uniform vec3 fogColor;
	varying float vFogDepth;
	#ifdef FOG_EXP2
		uniform float fogDensity;
	#else
		uniform float fogNear;
		uniform float fogFar;
	#endif
#endif`,C0=`#ifdef USE_GRADIENTMAP
	uniform sampler2D gradientMap;
#endif
vec3 getGradientIrradiance( vec3 normal, vec3 lightDirection ) {
	float dotNL = dot( normal, lightDirection );
	vec2 coord = vec2( dotNL * 0.5 + 0.5, 0.0 );
	#ifdef USE_GRADIENTMAP
		return vec3( texture2D( gradientMap, coord ).r );
	#else
		vec2 fw = fwidth( coord ) * 0.5;
		return mix( vec3( 0.7 ), vec3( 1.0 ), smoothstep( 0.7 - fw.x, 0.7 + fw.x, coord.x ) );
	#endif
}`,R0=`#ifdef USE_LIGHTMAP
	vec4 lightMapTexel = texture2D( lightMap, vLightMapUv );
	vec3 lightMapIrradiance = lightMapTexel.rgb * lightMapIntensity;
	reflectedLight.indirectDiffuse += lightMapIrradiance;
#endif`,P0=`#ifdef USE_LIGHTMAP
	uniform sampler2D lightMap;
	uniform float lightMapIntensity;
#endif`,L0=`LambertMaterial material;
material.diffuseColor = diffuseColor.rgb;
material.specularStrength = specularStrength;`,D0=`varying vec3 vViewPosition;
struct LambertMaterial {
	vec3 diffuseColor;
	float specularStrength;
};
void RE_Direct_Lambert( const in IncidentLight directLight, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in LambertMaterial material, inout ReflectedLight reflectedLight ) {
	float dotNL = saturate( dot( geometryNormal, directLight.direction ) );
	vec3 irradiance = dotNL * directLight.color;
	reflectedLight.directDiffuse += irradiance * BRDF_Lambert( material.diffuseColor );
}
void RE_IndirectDiffuse_Lambert( const in vec3 irradiance, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in LambertMaterial material, inout ReflectedLight reflectedLight ) {
	reflectedLight.indirectDiffuse += irradiance * BRDF_Lambert( material.diffuseColor );
}
#define RE_Direct				RE_Direct_Lambert
#define RE_IndirectDiffuse		RE_IndirectDiffuse_Lambert`,I0=`uniform bool receiveShadow;
uniform vec3 ambientLightColor;
#if defined( USE_LIGHT_PROBES )
	uniform vec3 lightProbe[ 9 ];
#endif
vec3 shGetIrradianceAt( in vec3 normal, in vec3 shCoefficients[ 9 ] ) {
	float x = normal.x, y = normal.y, z = normal.z;
	vec3 result = shCoefficients[ 0 ] * 0.886227;
	result += shCoefficients[ 1 ] * 2.0 * 0.511664 * y;
	result += shCoefficients[ 2 ] * 2.0 * 0.511664 * z;
	result += shCoefficients[ 3 ] * 2.0 * 0.511664 * x;
	result += shCoefficients[ 4 ] * 2.0 * 0.429043 * x * y;
	result += shCoefficients[ 5 ] * 2.0 * 0.429043 * y * z;
	result += shCoefficients[ 6 ] * ( 0.743125 * z * z - 0.247708 );
	result += shCoefficients[ 7 ] * 2.0 * 0.429043 * x * z;
	result += shCoefficients[ 8 ] * 0.429043 * ( x * x - y * y );
	return result;
}
vec3 getLightProbeIrradiance( const in vec3 lightProbe[ 9 ], const in vec3 normal ) {
	vec3 worldNormal = inverseTransformDirection( normal, viewMatrix );
	vec3 irradiance = shGetIrradianceAt( worldNormal, lightProbe );
	return irradiance;
}
vec3 getAmbientLightIrradiance( const in vec3 ambientLightColor ) {
	vec3 irradiance = ambientLightColor;
	return irradiance;
}
float getDistanceAttenuation( const in float lightDistance, const in float cutoffDistance, const in float decayExponent ) {
	#if defined ( LEGACY_LIGHTS )
		if ( cutoffDistance > 0.0 && decayExponent > 0.0 ) {
			return pow( saturate( - lightDistance / cutoffDistance + 1.0 ), decayExponent );
		}
		return 1.0;
	#else
		float distanceFalloff = 1.0 / max( pow( lightDistance, decayExponent ), 0.01 );
		if ( cutoffDistance > 0.0 ) {
			distanceFalloff *= pow2( saturate( 1.0 - pow4( lightDistance / cutoffDistance ) ) );
		}
		return distanceFalloff;
	#endif
}
float getSpotAttenuation( const in float coneCosine, const in float penumbraCosine, const in float angleCosine ) {
	return smoothstep( coneCosine, penumbraCosine, angleCosine );
}
#if NUM_DIR_LIGHTS > 0
	struct DirectionalLight {
		vec3 direction;
		vec3 color;
	};
	uniform DirectionalLight directionalLights[ NUM_DIR_LIGHTS ];
	void getDirectionalLightInfo( const in DirectionalLight directionalLight, out IncidentLight light ) {
		light.color = directionalLight.color;
		light.direction = directionalLight.direction;
		light.visible = true;
	}
#endif
#if NUM_POINT_LIGHTS > 0
	struct PointLight {
		vec3 position;
		vec3 color;
		float distance;
		float decay;
	};
	uniform PointLight pointLights[ NUM_POINT_LIGHTS ];
	void getPointLightInfo( const in PointLight pointLight, const in vec3 geometryPosition, out IncidentLight light ) {
		vec3 lVector = pointLight.position - geometryPosition;
		light.direction = normalize( lVector );
		float lightDistance = length( lVector );
		light.color = pointLight.color;
		light.color *= getDistanceAttenuation( lightDistance, pointLight.distance, pointLight.decay );
		light.visible = ( light.color != vec3( 0.0 ) );
	}
#endif
#if NUM_SPOT_LIGHTS > 0
	struct SpotLight {
		vec3 position;
		vec3 direction;
		vec3 color;
		float distance;
		float decay;
		float coneCos;
		float penumbraCos;
	};
	uniform SpotLight spotLights[ NUM_SPOT_LIGHTS ];
	void getSpotLightInfo( const in SpotLight spotLight, const in vec3 geometryPosition, out IncidentLight light ) {
		vec3 lVector = spotLight.position - geometryPosition;
		light.direction = normalize( lVector );
		float angleCos = dot( light.direction, spotLight.direction );
		float spotAttenuation = getSpotAttenuation( spotLight.coneCos, spotLight.penumbraCos, angleCos );
		if ( spotAttenuation > 0.0 ) {
			float lightDistance = length( lVector );
			light.color = spotLight.color * spotAttenuation;
			light.color *= getDistanceAttenuation( lightDistance, spotLight.distance, spotLight.decay );
			light.visible = ( light.color != vec3( 0.0 ) );
		} else {
			light.color = vec3( 0.0 );
			light.visible = false;
		}
	}
#endif
#if NUM_RECT_AREA_LIGHTS > 0
	struct RectAreaLight {
		vec3 color;
		vec3 position;
		vec3 halfWidth;
		vec3 halfHeight;
	};
	uniform sampler2D ltc_1;	uniform sampler2D ltc_2;
	uniform RectAreaLight rectAreaLights[ NUM_RECT_AREA_LIGHTS ];
#endif
#if NUM_HEMI_LIGHTS > 0
	struct HemisphereLight {
		vec3 direction;
		vec3 skyColor;
		vec3 groundColor;
	};
	uniform HemisphereLight hemisphereLights[ NUM_HEMI_LIGHTS ];
	vec3 getHemisphereLightIrradiance( const in HemisphereLight hemiLight, const in vec3 normal ) {
		float dotNL = dot( normal, hemiLight.direction );
		float hemiDiffuseWeight = 0.5 * dotNL + 0.5;
		vec3 irradiance = mix( hemiLight.groundColor, hemiLight.skyColor, hemiDiffuseWeight );
		return irradiance;
	}
#endif`,O0=`#ifdef USE_ENVMAP
	vec3 getIBLIrradiance( const in vec3 normal ) {
		#ifdef ENVMAP_TYPE_CUBE_UV
			vec3 worldNormal = inverseTransformDirection( normal, viewMatrix );
			vec4 envMapColor = textureCubeUV( envMap, worldNormal, 1.0 );
			return PI * envMapColor.rgb * envMapIntensity;
		#else
			return vec3( 0.0 );
		#endif
	}
	vec3 getIBLRadiance( const in vec3 viewDir, const in vec3 normal, const in float roughness ) {
		#ifdef ENVMAP_TYPE_CUBE_UV
			vec3 reflectVec = reflect( - viewDir, normal );
			reflectVec = normalize( mix( reflectVec, normal, roughness * roughness) );
			reflectVec = inverseTransformDirection( reflectVec, viewMatrix );
			vec4 envMapColor = textureCubeUV( envMap, reflectVec, roughness );
			return envMapColor.rgb * envMapIntensity;
		#else
			return vec3( 0.0 );
		#endif
	}
	#ifdef USE_ANISOTROPY
		vec3 getIBLAnisotropyRadiance( const in vec3 viewDir, const in vec3 normal, const in float roughness, const in vec3 bitangent, const in float anisotropy ) {
			#ifdef ENVMAP_TYPE_CUBE_UV
				vec3 bentNormal = cross( bitangent, viewDir );
				bentNormal = normalize( cross( bentNormal, bitangent ) );
				bentNormal = normalize( mix( bentNormal, normal, pow2( pow2( 1.0 - anisotropy * ( 1.0 - roughness ) ) ) ) );
				return getIBLRadiance( viewDir, bentNormal, roughness );
			#else
				return vec3( 0.0 );
			#endif
		}
	#endif
#endif`,U0=`ToonMaterial material;
material.diffuseColor = diffuseColor.rgb;`,F0=`varying vec3 vViewPosition;
struct ToonMaterial {
	vec3 diffuseColor;
};
void RE_Direct_Toon( const in IncidentLight directLight, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in ToonMaterial material, inout ReflectedLight reflectedLight ) {
	vec3 irradiance = getGradientIrradiance( geometryNormal, directLight.direction ) * directLight.color;
	reflectedLight.directDiffuse += irradiance * BRDF_Lambert( material.diffuseColor );
}
void RE_IndirectDiffuse_Toon( const in vec3 irradiance, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in ToonMaterial material, inout ReflectedLight reflectedLight ) {
	reflectedLight.indirectDiffuse += irradiance * BRDF_Lambert( material.diffuseColor );
}
#define RE_Direct				RE_Direct_Toon
#define RE_IndirectDiffuse		RE_IndirectDiffuse_Toon`,N0=`BlinnPhongMaterial material;
material.diffuseColor = diffuseColor.rgb;
material.specularColor = specular;
material.specularShininess = shininess;
material.specularStrength = specularStrength;`,k0=`varying vec3 vViewPosition;
struct BlinnPhongMaterial {
	vec3 diffuseColor;
	vec3 specularColor;
	float specularShininess;
	float specularStrength;
};
void RE_Direct_BlinnPhong( const in IncidentLight directLight, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in BlinnPhongMaterial material, inout ReflectedLight reflectedLight ) {
	float dotNL = saturate( dot( geometryNormal, directLight.direction ) );
	vec3 irradiance = dotNL * directLight.color;
	reflectedLight.directDiffuse += irradiance * BRDF_Lambert( material.diffuseColor );
	reflectedLight.directSpecular += irradiance * BRDF_BlinnPhong( directLight.direction, geometryViewDir, geometryNormal, material.specularColor, material.specularShininess ) * material.specularStrength;
}
void RE_IndirectDiffuse_BlinnPhong( const in vec3 irradiance, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in BlinnPhongMaterial material, inout ReflectedLight reflectedLight ) {
	reflectedLight.indirectDiffuse += irradiance * BRDF_Lambert( material.diffuseColor );
}
#define RE_Direct				RE_Direct_BlinnPhong
#define RE_IndirectDiffuse		RE_IndirectDiffuse_BlinnPhong`,B0=`PhysicalMaterial material;
material.diffuseColor = diffuseColor.rgb * ( 1.0 - metalnessFactor );
vec3 dxy = max( abs( dFdx( nonPerturbedNormal ) ), abs( dFdy( nonPerturbedNormal ) ) );
float geometryRoughness = max( max( dxy.x, dxy.y ), dxy.z );
material.roughness = max( roughnessFactor, 0.0525 );material.roughness += geometryRoughness;
material.roughness = min( material.roughness, 1.0 );
#ifdef IOR
	material.ior = ior;
	#ifdef USE_SPECULAR
		float specularIntensityFactor = specularIntensity;
		vec3 specularColorFactor = specularColor;
		#ifdef USE_SPECULAR_COLORMAP
			specularColorFactor *= texture2D( specularColorMap, vSpecularColorMapUv ).rgb;
		#endif
		#ifdef USE_SPECULAR_INTENSITYMAP
			specularIntensityFactor *= texture2D( specularIntensityMap, vSpecularIntensityMapUv ).a;
		#endif
		material.specularF90 = mix( specularIntensityFactor, 1.0, metalnessFactor );
	#else
		float specularIntensityFactor = 1.0;
		vec3 specularColorFactor = vec3( 1.0 );
		material.specularF90 = 1.0;
	#endif
	material.specularColor = mix( min( pow2( ( material.ior - 1.0 ) / ( material.ior + 1.0 ) ) * specularColorFactor, vec3( 1.0 ) ) * specularIntensityFactor, diffuseColor.rgb, metalnessFactor );
#else
	material.specularColor = mix( vec3( 0.04 ), diffuseColor.rgb, metalnessFactor );
	material.specularF90 = 1.0;
#endif
#ifdef USE_CLEARCOAT
	material.clearcoat = clearcoat;
	material.clearcoatRoughness = clearcoatRoughness;
	material.clearcoatF0 = vec3( 0.04 );
	material.clearcoatF90 = 1.0;
	#ifdef USE_CLEARCOATMAP
		material.clearcoat *= texture2D( clearcoatMap, vClearcoatMapUv ).x;
	#endif
	#ifdef USE_CLEARCOAT_ROUGHNESSMAP
		material.clearcoatRoughness *= texture2D( clearcoatRoughnessMap, vClearcoatRoughnessMapUv ).y;
	#endif
	material.clearcoat = saturate( material.clearcoat );	material.clearcoatRoughness = max( material.clearcoatRoughness, 0.0525 );
	material.clearcoatRoughness += geometryRoughness;
	material.clearcoatRoughness = min( material.clearcoatRoughness, 1.0 );
#endif
#ifdef USE_IRIDESCENCE
	material.iridescence = iridescence;
	material.iridescenceIOR = iridescenceIOR;
	#ifdef USE_IRIDESCENCEMAP
		material.iridescence *= texture2D( iridescenceMap, vIridescenceMapUv ).r;
	#endif
	#ifdef USE_IRIDESCENCE_THICKNESSMAP
		material.iridescenceThickness = (iridescenceThicknessMaximum - iridescenceThicknessMinimum) * texture2D( iridescenceThicknessMap, vIridescenceThicknessMapUv ).g + iridescenceThicknessMinimum;
	#else
		material.iridescenceThickness = iridescenceThicknessMaximum;
	#endif
#endif
#ifdef USE_SHEEN
	material.sheenColor = sheenColor;
	#ifdef USE_SHEEN_COLORMAP
		material.sheenColor *= texture2D( sheenColorMap, vSheenColorMapUv ).rgb;
	#endif
	material.sheenRoughness = clamp( sheenRoughness, 0.07, 1.0 );
	#ifdef USE_SHEEN_ROUGHNESSMAP
		material.sheenRoughness *= texture2D( sheenRoughnessMap, vSheenRoughnessMapUv ).a;
	#endif
#endif
#ifdef USE_ANISOTROPY
	#ifdef USE_ANISOTROPYMAP
		mat2 anisotropyMat = mat2( anisotropyVector.x, anisotropyVector.y, - anisotropyVector.y, anisotropyVector.x );
		vec3 anisotropyPolar = texture2D( anisotropyMap, vAnisotropyMapUv ).rgb;
		vec2 anisotropyV = anisotropyMat * normalize( 2.0 * anisotropyPolar.rg - vec2( 1.0 ) ) * anisotropyPolar.b;
	#else
		vec2 anisotropyV = anisotropyVector;
	#endif
	material.anisotropy = length( anisotropyV );
	if( material.anisotropy == 0.0 ) {
		anisotropyV = vec2( 1.0, 0.0 );
	} else {
		anisotropyV /= material.anisotropy;
		material.anisotropy = saturate( material.anisotropy );
	}
	material.alphaT = mix( pow2( material.roughness ), 1.0, pow2( material.anisotropy ) );
	material.anisotropyT = tbn[ 0 ] * anisotropyV.x + tbn[ 1 ] * anisotropyV.y;
	material.anisotropyB = tbn[ 1 ] * anisotropyV.x - tbn[ 0 ] * anisotropyV.y;
#endif`,z0=`struct PhysicalMaterial {
	vec3 diffuseColor;
	float roughness;
	vec3 specularColor;
	float specularF90;
	#ifdef USE_CLEARCOAT
		float clearcoat;
		float clearcoatRoughness;
		vec3 clearcoatF0;
		float clearcoatF90;
	#endif
	#ifdef USE_IRIDESCENCE
		float iridescence;
		float iridescenceIOR;
		float iridescenceThickness;
		vec3 iridescenceFresnel;
		vec3 iridescenceF0;
	#endif
	#ifdef USE_SHEEN
		vec3 sheenColor;
		float sheenRoughness;
	#endif
	#ifdef IOR
		float ior;
	#endif
	#ifdef USE_TRANSMISSION
		float transmission;
		float transmissionAlpha;
		float thickness;
		float attenuationDistance;
		vec3 attenuationColor;
	#endif
	#ifdef USE_ANISOTROPY
		float anisotropy;
		float alphaT;
		vec3 anisotropyT;
		vec3 anisotropyB;
	#endif
};
vec3 clearcoatSpecularDirect = vec3( 0.0 );
vec3 clearcoatSpecularIndirect = vec3( 0.0 );
vec3 sheenSpecularDirect = vec3( 0.0 );
vec3 sheenSpecularIndirect = vec3(0.0 );
vec3 Schlick_to_F0( const in vec3 f, const in float f90, const in float dotVH ) {
    float x = clamp( 1.0 - dotVH, 0.0, 1.0 );
    float x2 = x * x;
    float x5 = clamp( x * x2 * x2, 0.0, 0.9999 );
    return ( f - vec3( f90 ) * x5 ) / ( 1.0 - x5 );
}
float V_GGX_SmithCorrelated( const in float alpha, const in float dotNL, const in float dotNV ) {
	float a2 = pow2( alpha );
	float gv = dotNL * sqrt( a2 + ( 1.0 - a2 ) * pow2( dotNV ) );
	float gl = dotNV * sqrt( a2 + ( 1.0 - a2 ) * pow2( dotNL ) );
	return 0.5 / max( gv + gl, EPSILON );
}
float D_GGX( const in float alpha, const in float dotNH ) {
	float a2 = pow2( alpha );
	float denom = pow2( dotNH ) * ( a2 - 1.0 ) + 1.0;
	return RECIPROCAL_PI * a2 / pow2( denom );
}
#ifdef USE_ANISOTROPY
	float V_GGX_SmithCorrelated_Anisotropic( const in float alphaT, const in float alphaB, const in float dotTV, const in float dotBV, const in float dotTL, const in float dotBL, const in float dotNV, const in float dotNL ) {
		float gv = dotNL * length( vec3( alphaT * dotTV, alphaB * dotBV, dotNV ) );
		float gl = dotNV * length( vec3( alphaT * dotTL, alphaB * dotBL, dotNL ) );
		float v = 0.5 / ( gv + gl );
		return saturate(v);
	}
	float D_GGX_Anisotropic( const in float alphaT, const in float alphaB, const in float dotNH, const in float dotTH, const in float dotBH ) {
		float a2 = alphaT * alphaB;
		highp vec3 v = vec3( alphaB * dotTH, alphaT * dotBH, a2 * dotNH );
		highp float v2 = dot( v, v );
		float w2 = a2 / v2;
		return RECIPROCAL_PI * a2 * pow2 ( w2 );
	}
#endif
#ifdef USE_CLEARCOAT
	vec3 BRDF_GGX_Clearcoat( const in vec3 lightDir, const in vec3 viewDir, const in vec3 normal, const in PhysicalMaterial material) {
		vec3 f0 = material.clearcoatF0;
		float f90 = material.clearcoatF90;
		float roughness = material.clearcoatRoughness;
		float alpha = pow2( roughness );
		vec3 halfDir = normalize( lightDir + viewDir );
		float dotNL = saturate( dot( normal, lightDir ) );
		float dotNV = saturate( dot( normal, viewDir ) );
		float dotNH = saturate( dot( normal, halfDir ) );
		float dotVH = saturate( dot( viewDir, halfDir ) );
		vec3 F = F_Schlick( f0, f90, dotVH );
		float V = V_GGX_SmithCorrelated( alpha, dotNL, dotNV );
		float D = D_GGX( alpha, dotNH );
		return F * ( V * D );
	}
#endif
vec3 BRDF_GGX( const in vec3 lightDir, const in vec3 viewDir, const in vec3 normal, const in PhysicalMaterial material ) {
	vec3 f0 = material.specularColor;
	float f90 = material.specularF90;
	float roughness = material.roughness;
	float alpha = pow2( roughness );
	vec3 halfDir = normalize( lightDir + viewDir );
	float dotNL = saturate( dot( normal, lightDir ) );
	float dotNV = saturate( dot( normal, viewDir ) );
	float dotNH = saturate( dot( normal, halfDir ) );
	float dotVH = saturate( dot( viewDir, halfDir ) );
	vec3 F = F_Schlick( f0, f90, dotVH );
	#ifdef USE_IRIDESCENCE
		F = mix( F, material.iridescenceFresnel, material.iridescence );
	#endif
	#ifdef USE_ANISOTROPY
		float dotTL = dot( material.anisotropyT, lightDir );
		float dotTV = dot( material.anisotropyT, viewDir );
		float dotTH = dot( material.anisotropyT, halfDir );
		float dotBL = dot( material.anisotropyB, lightDir );
		float dotBV = dot( material.anisotropyB, viewDir );
		float dotBH = dot( material.anisotropyB, halfDir );
		float V = V_GGX_SmithCorrelated_Anisotropic( material.alphaT, alpha, dotTV, dotBV, dotTL, dotBL, dotNV, dotNL );
		float D = D_GGX_Anisotropic( material.alphaT, alpha, dotNH, dotTH, dotBH );
	#else
		float V = V_GGX_SmithCorrelated( alpha, dotNL, dotNV );
		float D = D_GGX( alpha, dotNH );
	#endif
	return F * ( V * D );
}
vec2 LTC_Uv( const in vec3 N, const in vec3 V, const in float roughness ) {
	const float LUT_SIZE = 64.0;
	const float LUT_SCALE = ( LUT_SIZE - 1.0 ) / LUT_SIZE;
	const float LUT_BIAS = 0.5 / LUT_SIZE;
	float dotNV = saturate( dot( N, V ) );
	vec2 uv = vec2( roughness, sqrt( 1.0 - dotNV ) );
	uv = uv * LUT_SCALE + LUT_BIAS;
	return uv;
}
float LTC_ClippedSphereFormFactor( const in vec3 f ) {
	float l = length( f );
	return max( ( l * l + f.z ) / ( l + 1.0 ), 0.0 );
}
vec3 LTC_EdgeVectorFormFactor( const in vec3 v1, const in vec3 v2 ) {
	float x = dot( v1, v2 );
	float y = abs( x );
	float a = 0.8543985 + ( 0.4965155 + 0.0145206 * y ) * y;
	float b = 3.4175940 + ( 4.1616724 + y ) * y;
	float v = a / b;
	float theta_sintheta = ( x > 0.0 ) ? v : 0.5 * inversesqrt( max( 1.0 - x * x, 1e-7 ) ) - v;
	return cross( v1, v2 ) * theta_sintheta;
}
vec3 LTC_Evaluate( const in vec3 N, const in vec3 V, const in vec3 P, const in mat3 mInv, const in vec3 rectCoords[ 4 ] ) {
	vec3 v1 = rectCoords[ 1 ] - rectCoords[ 0 ];
	vec3 v2 = rectCoords[ 3 ] - rectCoords[ 0 ];
	vec3 lightNormal = cross( v1, v2 );
	if( dot( lightNormal, P - rectCoords[ 0 ] ) < 0.0 ) return vec3( 0.0 );
	vec3 T1, T2;
	T1 = normalize( V - N * dot( V, N ) );
	T2 = - cross( N, T1 );
	mat3 mat = mInv * transposeMat3( mat3( T1, T2, N ) );
	vec3 coords[ 4 ];
	coords[ 0 ] = mat * ( rectCoords[ 0 ] - P );
	coords[ 1 ] = mat * ( rectCoords[ 1 ] - P );
	coords[ 2 ] = mat * ( rectCoords[ 2 ] - P );
	coords[ 3 ] = mat * ( rectCoords[ 3 ] - P );
	coords[ 0 ] = normalize( coords[ 0 ] );
	coords[ 1 ] = normalize( coords[ 1 ] );
	coords[ 2 ] = normalize( coords[ 2 ] );
	coords[ 3 ] = normalize( coords[ 3 ] );
	vec3 vectorFormFactor = vec3( 0.0 );
	vectorFormFactor += LTC_EdgeVectorFormFactor( coords[ 0 ], coords[ 1 ] );
	vectorFormFactor += LTC_EdgeVectorFormFactor( coords[ 1 ], coords[ 2 ] );
	vectorFormFactor += LTC_EdgeVectorFormFactor( coords[ 2 ], coords[ 3 ] );
	vectorFormFactor += LTC_EdgeVectorFormFactor( coords[ 3 ], coords[ 0 ] );
	float result = LTC_ClippedSphereFormFactor( vectorFormFactor );
	return vec3( result );
}
#if defined( USE_SHEEN )
float D_Charlie( float roughness, float dotNH ) {
	float alpha = pow2( roughness );
	float invAlpha = 1.0 / alpha;
	float cos2h = dotNH * dotNH;
	float sin2h = max( 1.0 - cos2h, 0.0078125 );
	return ( 2.0 + invAlpha ) * pow( sin2h, invAlpha * 0.5 ) / ( 2.0 * PI );
}
float V_Neubelt( float dotNV, float dotNL ) {
	return saturate( 1.0 / ( 4.0 * ( dotNL + dotNV - dotNL * dotNV ) ) );
}
vec3 BRDF_Sheen( const in vec3 lightDir, const in vec3 viewDir, const in vec3 normal, vec3 sheenColor, const in float sheenRoughness ) {
	vec3 halfDir = normalize( lightDir + viewDir );
	float dotNL = saturate( dot( normal, lightDir ) );
	float dotNV = saturate( dot( normal, viewDir ) );
	float dotNH = saturate( dot( normal, halfDir ) );
	float D = D_Charlie( sheenRoughness, dotNH );
	float V = V_Neubelt( dotNV, dotNL );
	return sheenColor * ( D * V );
}
#endif
float IBLSheenBRDF( const in vec3 normal, const in vec3 viewDir, const in float roughness ) {
	float dotNV = saturate( dot( normal, viewDir ) );
	float r2 = roughness * roughness;
	float a = roughness < 0.25 ? -339.2 * r2 + 161.4 * roughness - 25.9 : -8.48 * r2 + 14.3 * roughness - 9.95;
	float b = roughness < 0.25 ? 44.0 * r2 - 23.7 * roughness + 3.26 : 1.97 * r2 - 3.27 * roughness + 0.72;
	float DG = exp( a * dotNV + b ) + ( roughness < 0.25 ? 0.0 : 0.1 * ( roughness - 0.25 ) );
	return saturate( DG * RECIPROCAL_PI );
}
vec2 DFGApprox( const in vec3 normal, const in vec3 viewDir, const in float roughness ) {
	float dotNV = saturate( dot( normal, viewDir ) );
	const vec4 c0 = vec4( - 1, - 0.0275, - 0.572, 0.022 );
	const vec4 c1 = vec4( 1, 0.0425, 1.04, - 0.04 );
	vec4 r = roughness * c0 + c1;
	float a004 = min( r.x * r.x, exp2( - 9.28 * dotNV ) ) * r.x + r.y;
	vec2 fab = vec2( - 1.04, 1.04 ) * a004 + r.zw;
	return fab;
}
vec3 EnvironmentBRDF( const in vec3 normal, const in vec3 viewDir, const in vec3 specularColor, const in float specularF90, const in float roughness ) {
	vec2 fab = DFGApprox( normal, viewDir, roughness );
	return specularColor * fab.x + specularF90 * fab.y;
}
#ifdef USE_IRIDESCENCE
void computeMultiscatteringIridescence( const in vec3 normal, const in vec3 viewDir, const in vec3 specularColor, const in float specularF90, const in float iridescence, const in vec3 iridescenceF0, const in float roughness, inout vec3 singleScatter, inout vec3 multiScatter ) {
#else
void computeMultiscattering( const in vec3 normal, const in vec3 viewDir, const in vec3 specularColor, const in float specularF90, const in float roughness, inout vec3 singleScatter, inout vec3 multiScatter ) {
#endif
	vec2 fab = DFGApprox( normal, viewDir, roughness );
	#ifdef USE_IRIDESCENCE
		vec3 Fr = mix( specularColor, iridescenceF0, iridescence );
	#else
		vec3 Fr = specularColor;
	#endif
	vec3 FssEss = Fr * fab.x + specularF90 * fab.y;
	float Ess = fab.x + fab.y;
	float Ems = 1.0 - Ess;
	vec3 Favg = Fr + ( 1.0 - Fr ) * 0.047619;	vec3 Fms = FssEss * Favg / ( 1.0 - Ems * Favg );
	singleScatter += FssEss;
	multiScatter += Fms * Ems;
}
#if NUM_RECT_AREA_LIGHTS > 0
	void RE_Direct_RectArea_Physical( const in RectAreaLight rectAreaLight, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in PhysicalMaterial material, inout ReflectedLight reflectedLight ) {
		vec3 normal = geometryNormal;
		vec3 viewDir = geometryViewDir;
		vec3 position = geometryPosition;
		vec3 lightPos = rectAreaLight.position;
		vec3 halfWidth = rectAreaLight.halfWidth;
		vec3 halfHeight = rectAreaLight.halfHeight;
		vec3 lightColor = rectAreaLight.color;
		float roughness = material.roughness;
		vec3 rectCoords[ 4 ];
		rectCoords[ 0 ] = lightPos + halfWidth - halfHeight;		rectCoords[ 1 ] = lightPos - halfWidth - halfHeight;
		rectCoords[ 2 ] = lightPos - halfWidth + halfHeight;
		rectCoords[ 3 ] = lightPos + halfWidth + halfHeight;
		vec2 uv = LTC_Uv( normal, viewDir, roughness );
		vec4 t1 = texture2D( ltc_1, uv );
		vec4 t2 = texture2D( ltc_2, uv );
		mat3 mInv = mat3(
			vec3( t1.x, 0, t1.y ),
			vec3(    0, 1,    0 ),
			vec3( t1.z, 0, t1.w )
		);
		vec3 fresnel = ( material.specularColor * t2.x + ( vec3( 1.0 ) - material.specularColor ) * t2.y );
		reflectedLight.directSpecular += lightColor * fresnel * LTC_Evaluate( normal, viewDir, position, mInv, rectCoords );
		reflectedLight.directDiffuse += lightColor * material.diffuseColor * LTC_Evaluate( normal, viewDir, position, mat3( 1.0 ), rectCoords );
	}
#endif
void RE_Direct_Physical( const in IncidentLight directLight, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in PhysicalMaterial material, inout ReflectedLight reflectedLight ) {
	float dotNL = saturate( dot( geometryNormal, directLight.direction ) );
	vec3 irradiance = dotNL * directLight.color;
	#ifdef USE_CLEARCOAT
		float dotNLcc = saturate( dot( geometryClearcoatNormal, directLight.direction ) );
		vec3 ccIrradiance = dotNLcc * directLight.color;
		clearcoatSpecularDirect += ccIrradiance * BRDF_GGX_Clearcoat( directLight.direction, geometryViewDir, geometryClearcoatNormal, material );
	#endif
	#ifdef USE_SHEEN
		sheenSpecularDirect += irradiance * BRDF_Sheen( directLight.direction, geometryViewDir, geometryNormal, material.sheenColor, material.sheenRoughness );
	#endif
	reflectedLight.directSpecular += irradiance * BRDF_GGX( directLight.direction, geometryViewDir, geometryNormal, material );
	reflectedLight.directDiffuse += irradiance * BRDF_Lambert( material.diffuseColor );
}
void RE_IndirectDiffuse_Physical( const in vec3 irradiance, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in PhysicalMaterial material, inout ReflectedLight reflectedLight ) {
	reflectedLight.indirectDiffuse += irradiance * BRDF_Lambert( material.diffuseColor );
}
void RE_IndirectSpecular_Physical( const in vec3 radiance, const in vec3 irradiance, const in vec3 clearcoatRadiance, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in PhysicalMaterial material, inout ReflectedLight reflectedLight) {
	#ifdef USE_CLEARCOAT
		clearcoatSpecularIndirect += clearcoatRadiance * EnvironmentBRDF( geometryClearcoatNormal, geometryViewDir, material.clearcoatF0, material.clearcoatF90, material.clearcoatRoughness );
	#endif
	#ifdef USE_SHEEN
		sheenSpecularIndirect += irradiance * material.sheenColor * IBLSheenBRDF( geometryNormal, geometryViewDir, material.sheenRoughness );
	#endif
	vec3 singleScattering = vec3( 0.0 );
	vec3 multiScattering = vec3( 0.0 );
	vec3 cosineWeightedIrradiance = irradiance * RECIPROCAL_PI;
	#ifdef USE_IRIDESCENCE
		computeMultiscatteringIridescence( geometryNormal, geometryViewDir, material.specularColor, material.specularF90, material.iridescence, material.iridescenceFresnel, material.roughness, singleScattering, multiScattering );
	#else
		computeMultiscattering( geometryNormal, geometryViewDir, material.specularColor, material.specularF90, material.roughness, singleScattering, multiScattering );
	#endif
	vec3 totalScattering = singleScattering + multiScattering;
	vec3 diffuse = material.diffuseColor * ( 1.0 - max( max( totalScattering.r, totalScattering.g ), totalScattering.b ) );
	reflectedLight.indirectSpecular += radiance * singleScattering;
	reflectedLight.indirectSpecular += multiScattering * cosineWeightedIrradiance;
	reflectedLight.indirectDiffuse += diffuse * cosineWeightedIrradiance;
}
#define RE_Direct				RE_Direct_Physical
#define RE_Direct_RectArea		RE_Direct_RectArea_Physical
#define RE_IndirectDiffuse		RE_IndirectDiffuse_Physical
#define RE_IndirectSpecular		RE_IndirectSpecular_Physical
float computeSpecularOcclusion( const in float dotNV, const in float ambientOcclusion, const in float roughness ) {
	return saturate( pow( dotNV + ambientOcclusion, exp2( - 16.0 * roughness - 1.0 ) ) - 1.0 + ambientOcclusion );
}`,H0=`
vec3 geometryPosition = - vViewPosition;
vec3 geometryNormal = normal;
vec3 geometryViewDir = ( isOrthographic ) ? vec3( 0, 0, 1 ) : normalize( vViewPosition );
vec3 geometryClearcoatNormal = vec3( 0.0 );
#ifdef USE_CLEARCOAT
	geometryClearcoatNormal = clearcoatNormal;
#endif
#ifdef USE_IRIDESCENCE
	float dotNVi = saturate( dot( normal, geometryViewDir ) );
	if ( material.iridescenceThickness == 0.0 ) {
		material.iridescence = 0.0;
	} else {
		material.iridescence = saturate( material.iridescence );
	}
	if ( material.iridescence > 0.0 ) {
		material.iridescenceFresnel = evalIridescence( 1.0, material.iridescenceIOR, dotNVi, material.iridescenceThickness, material.specularColor );
		material.iridescenceF0 = Schlick_to_F0( material.iridescenceFresnel, 1.0, dotNVi );
	}
#endif
IncidentLight directLight;
#if ( NUM_POINT_LIGHTS > 0 ) && defined( RE_Direct )
	PointLight pointLight;
	#if defined( USE_SHADOWMAP ) && NUM_POINT_LIGHT_SHADOWS > 0
	PointLightShadow pointLightShadow;
	#endif
	#pragma unroll_loop_start
	for ( int i = 0; i < NUM_POINT_LIGHTS; i ++ ) {
		pointLight = pointLights[ i ];
		getPointLightInfo( pointLight, geometryPosition, directLight );
		#if defined( USE_SHADOWMAP ) && ( UNROLLED_LOOP_INDEX < NUM_POINT_LIGHT_SHADOWS )
		pointLightShadow = pointLightShadows[ i ];
		directLight.color *= ( directLight.visible && receiveShadow ) ? getPointShadow( pointShadowMap[ i ], pointLightShadow.shadowMapSize, pointLightShadow.shadowBias, pointLightShadow.shadowRadius, vPointShadowCoord[ i ], pointLightShadow.shadowCameraNear, pointLightShadow.shadowCameraFar ) : 1.0;
		#endif
		RE_Direct( directLight, geometryPosition, geometryNormal, geometryViewDir, geometryClearcoatNormal, material, reflectedLight );
	}
	#pragma unroll_loop_end
#endif
#if ( NUM_SPOT_LIGHTS > 0 ) && defined( RE_Direct )
	SpotLight spotLight;
	vec4 spotColor;
	vec3 spotLightCoord;
	bool inSpotLightMap;
	#if defined( USE_SHADOWMAP ) && NUM_SPOT_LIGHT_SHADOWS > 0
	SpotLightShadow spotLightShadow;
	#endif
	#pragma unroll_loop_start
	for ( int i = 0; i < NUM_SPOT_LIGHTS; i ++ ) {
		spotLight = spotLights[ i ];
		getSpotLightInfo( spotLight, geometryPosition, directLight );
		#if ( UNROLLED_LOOP_INDEX < NUM_SPOT_LIGHT_SHADOWS_WITH_MAPS )
		#define SPOT_LIGHT_MAP_INDEX UNROLLED_LOOP_INDEX
		#elif ( UNROLLED_LOOP_INDEX < NUM_SPOT_LIGHT_SHADOWS )
		#define SPOT_LIGHT_MAP_INDEX NUM_SPOT_LIGHT_MAPS
		#else
		#define SPOT_LIGHT_MAP_INDEX ( UNROLLED_LOOP_INDEX - NUM_SPOT_LIGHT_SHADOWS + NUM_SPOT_LIGHT_SHADOWS_WITH_MAPS )
		#endif
		#if ( SPOT_LIGHT_MAP_INDEX < NUM_SPOT_LIGHT_MAPS )
			spotLightCoord = vSpotLightCoord[ i ].xyz / vSpotLightCoord[ i ].w;
			inSpotLightMap = all( lessThan( abs( spotLightCoord * 2. - 1. ), vec3( 1.0 ) ) );
			spotColor = texture2D( spotLightMap[ SPOT_LIGHT_MAP_INDEX ], spotLightCoord.xy );
			directLight.color = inSpotLightMap ? directLight.color * spotColor.rgb : directLight.color;
		#endif
		#undef SPOT_LIGHT_MAP_INDEX
		#if defined( USE_SHADOWMAP ) && ( UNROLLED_LOOP_INDEX < NUM_SPOT_LIGHT_SHADOWS )
		spotLightShadow = spotLightShadows[ i ];
		directLight.color *= ( directLight.visible && receiveShadow ) ? getShadow( spotShadowMap[ i ], spotLightShadow.shadowMapSize, spotLightShadow.shadowBias, spotLightShadow.shadowRadius, vSpotLightCoord[ i ] ) : 1.0;
		#endif
		RE_Direct( directLight, geometryPosition, geometryNormal, geometryViewDir, geometryClearcoatNormal, material, reflectedLight );
	}
	#pragma unroll_loop_end
#endif
#if ( NUM_DIR_LIGHTS > 0 ) && defined( RE_Direct )
	DirectionalLight directionalLight;
	#if defined( USE_SHADOWMAP ) && NUM_DIR_LIGHT_SHADOWS > 0
	DirectionalLightShadow directionalLightShadow;
	#endif
	#pragma unroll_loop_start
	for ( int i = 0; i < NUM_DIR_LIGHTS; i ++ ) {
		directionalLight = directionalLights[ i ];
		getDirectionalLightInfo( directionalLight, directLight );
		#if defined( USE_SHADOWMAP ) && ( UNROLLED_LOOP_INDEX < NUM_DIR_LIGHT_SHADOWS )
		directionalLightShadow = directionalLightShadows[ i ];
		directLight.color *= ( directLight.visible && receiveShadow ) ? getShadow( directionalShadowMap[ i ], directionalLightShadow.shadowMapSize, directionalLightShadow.shadowBias, directionalLightShadow.shadowRadius, vDirectionalShadowCoord[ i ] ) : 1.0;
		#endif
		RE_Direct( directLight, geometryPosition, geometryNormal, geometryViewDir, geometryClearcoatNormal, material, reflectedLight );
	}
	#pragma unroll_loop_end
#endif
#if ( NUM_RECT_AREA_LIGHTS > 0 ) && defined( RE_Direct_RectArea )
	RectAreaLight rectAreaLight;
	#pragma unroll_loop_start
	for ( int i = 0; i < NUM_RECT_AREA_LIGHTS; i ++ ) {
		rectAreaLight = rectAreaLights[ i ];
		RE_Direct_RectArea( rectAreaLight, geometryPosition, geometryNormal, geometryViewDir, geometryClearcoatNormal, material, reflectedLight );
	}
	#pragma unroll_loop_end
#endif
#if defined( RE_IndirectDiffuse )
	vec3 iblIrradiance = vec3( 0.0 );
	vec3 irradiance = getAmbientLightIrradiance( ambientLightColor );
	#if defined( USE_LIGHT_PROBES )
		irradiance += getLightProbeIrradiance( lightProbe, geometryNormal );
	#endif
	#if ( NUM_HEMI_LIGHTS > 0 )
		#pragma unroll_loop_start
		for ( int i = 0; i < NUM_HEMI_LIGHTS; i ++ ) {
			irradiance += getHemisphereLightIrradiance( hemisphereLights[ i ], geometryNormal );
		}
		#pragma unroll_loop_end
	#endif
#endif
#if defined( RE_IndirectSpecular )
	vec3 radiance = vec3( 0.0 );
	vec3 clearcoatRadiance = vec3( 0.0 );
#endif`,V0=`#if defined( RE_IndirectDiffuse )
	#ifdef USE_LIGHTMAP
		vec4 lightMapTexel = texture2D( lightMap, vLightMapUv );
		vec3 lightMapIrradiance = lightMapTexel.rgb * lightMapIntensity;
		irradiance += lightMapIrradiance;
	#endif
	#if defined( USE_ENVMAP ) && defined( STANDARD ) && defined( ENVMAP_TYPE_CUBE_UV )
		iblIrradiance += getIBLIrradiance( geometryNormal );
	#endif
#endif
#if defined( USE_ENVMAP ) && defined( RE_IndirectSpecular )
	#ifdef USE_ANISOTROPY
		radiance += getIBLAnisotropyRadiance( geometryViewDir, geometryNormal, material.roughness, material.anisotropyB, material.anisotropy );
	#else
		radiance += getIBLRadiance( geometryViewDir, geometryNormal, material.roughness );
	#endif
	#ifdef USE_CLEARCOAT
		clearcoatRadiance += getIBLRadiance( geometryViewDir, geometryClearcoatNormal, material.clearcoatRoughness );
	#endif
#endif`,G0=`#if defined( RE_IndirectDiffuse )
	RE_IndirectDiffuse( irradiance, geometryPosition, geometryNormal, geometryViewDir, geometryClearcoatNormal, material, reflectedLight );
#endif
#if defined( RE_IndirectSpecular )
	RE_IndirectSpecular( radiance, iblIrradiance, clearcoatRadiance, geometryPosition, geometryNormal, geometryViewDir, geometryClearcoatNormal, material, reflectedLight );
#endif`,W0=`#if defined( USE_LOGDEPTHBUF ) && defined( USE_LOGDEPTHBUF_EXT )
	gl_FragDepthEXT = vIsPerspective == 0.0 ? gl_FragCoord.z : log2( vFragDepth ) * logDepthBufFC * 0.5;
#endif`,X0=`#if defined( USE_LOGDEPTHBUF ) && defined( USE_LOGDEPTHBUF_EXT )
	uniform float logDepthBufFC;
	varying float vFragDepth;
	varying float vIsPerspective;
#endif`,j0=`#ifdef USE_LOGDEPTHBUF
	#ifdef USE_LOGDEPTHBUF_EXT
		varying float vFragDepth;
		varying float vIsPerspective;
	#else
		uniform float logDepthBufFC;
	#endif
#endif`,Y0=`#ifdef USE_LOGDEPTHBUF
	#ifdef USE_LOGDEPTHBUF_EXT
		vFragDepth = 1.0 + gl_Position.w;
		vIsPerspective = float( isPerspectiveMatrix( projectionMatrix ) );
	#else
		if ( isPerspectiveMatrix( projectionMatrix ) ) {
			gl_Position.z = log2( max( EPSILON, gl_Position.w + 1.0 ) ) * logDepthBufFC - 1.0;
			gl_Position.z *= gl_Position.w;
		}
	#endif
#endif`,q0=`#ifdef USE_MAP
	vec4 sampledDiffuseColor = texture2D( map, vMapUv );
	#ifdef DECODE_VIDEO_TEXTURE
		sampledDiffuseColor = vec4( mix( pow( sampledDiffuseColor.rgb * 0.9478672986 + vec3( 0.0521327014 ), vec3( 2.4 ) ), sampledDiffuseColor.rgb * 0.0773993808, vec3( lessThanEqual( sampledDiffuseColor.rgb, vec3( 0.04045 ) ) ) ), sampledDiffuseColor.w );
	
	#endif
	diffuseColor *= sampledDiffuseColor;
#endif`,$0=`#ifdef USE_MAP
	uniform sampler2D map;
#endif`,K0=`#if defined( USE_MAP ) || defined( USE_ALPHAMAP )
	#if defined( USE_POINTS_UV )
		vec2 uv = vUv;
	#else
		vec2 uv = ( uvTransform * vec3( gl_PointCoord.x, 1.0 - gl_PointCoord.y, 1 ) ).xy;
	#endif
#endif
#ifdef USE_MAP
	diffuseColor *= texture2D( map, uv );
#endif
#ifdef USE_ALPHAMAP
	diffuseColor.a *= texture2D( alphaMap, uv ).g;
#endif`,Z0=`#if defined( USE_POINTS_UV )
	varying vec2 vUv;
#else
	#if defined( USE_MAP ) || defined( USE_ALPHAMAP )
		uniform mat3 uvTransform;
	#endif
#endif
#ifdef USE_MAP
	uniform sampler2D map;
#endif
#ifdef USE_ALPHAMAP
	uniform sampler2D alphaMap;
#endif`,J0=`float metalnessFactor = metalness;
#ifdef USE_METALNESSMAP
	vec4 texelMetalness = texture2D( metalnessMap, vMetalnessMapUv );
	metalnessFactor *= texelMetalness.b;
#endif`,Q0=`#ifdef USE_METALNESSMAP
	uniform sampler2D metalnessMap;
#endif`,t_=`#if defined( USE_MORPHCOLORS ) && defined( MORPHTARGETS_TEXTURE )
	vColor *= morphTargetBaseInfluence;
	for ( int i = 0; i < MORPHTARGETS_COUNT; i ++ ) {
		#if defined( USE_COLOR_ALPHA )
			if ( morphTargetInfluences[ i ] != 0.0 ) vColor += getMorph( gl_VertexID, i, 2 ) * morphTargetInfluences[ i ];
		#elif defined( USE_COLOR )
			if ( morphTargetInfluences[ i ] != 0.0 ) vColor += getMorph( gl_VertexID, i, 2 ).rgb * morphTargetInfluences[ i ];
		#endif
	}
#endif`,e_=`#ifdef USE_MORPHNORMALS
	objectNormal *= morphTargetBaseInfluence;
	#ifdef MORPHTARGETS_TEXTURE
		for ( int i = 0; i < MORPHTARGETS_COUNT; i ++ ) {
			if ( morphTargetInfluences[ i ] != 0.0 ) objectNormal += getMorph( gl_VertexID, i, 1 ).xyz * morphTargetInfluences[ i ];
		}
	#else
		objectNormal += morphNormal0 * morphTargetInfluences[ 0 ];
		objectNormal += morphNormal1 * morphTargetInfluences[ 1 ];
		objectNormal += morphNormal2 * morphTargetInfluences[ 2 ];
		objectNormal += morphNormal3 * morphTargetInfluences[ 3 ];
	#endif
#endif`,n_=`#ifdef USE_MORPHTARGETS
	uniform float morphTargetBaseInfluence;
	#ifdef MORPHTARGETS_TEXTURE
		uniform float morphTargetInfluences[ MORPHTARGETS_COUNT ];
		uniform sampler2DArray morphTargetsTexture;
		uniform ivec2 morphTargetsTextureSize;
		vec4 getMorph( const in int vertexIndex, const in int morphTargetIndex, const in int offset ) {
			int texelIndex = vertexIndex * MORPHTARGETS_TEXTURE_STRIDE + offset;
			int y = texelIndex / morphTargetsTextureSize.x;
			int x = texelIndex - y * morphTargetsTextureSize.x;
			ivec3 morphUV = ivec3( x, y, morphTargetIndex );
			return texelFetch( morphTargetsTexture, morphUV, 0 );
		}
	#else
		#ifndef USE_MORPHNORMALS
			uniform float morphTargetInfluences[ 8 ];
		#else
			uniform float morphTargetInfluences[ 4 ];
		#endif
	#endif
#endif`,i_=`#ifdef USE_MORPHTARGETS
	transformed *= morphTargetBaseInfluence;
	#ifdef MORPHTARGETS_TEXTURE
		for ( int i = 0; i < MORPHTARGETS_COUNT; i ++ ) {
			if ( morphTargetInfluences[ i ] != 0.0 ) transformed += getMorph( gl_VertexID, i, 0 ).xyz * morphTargetInfluences[ i ];
		}
	#else
		transformed += morphTarget0 * morphTargetInfluences[ 0 ];
		transformed += morphTarget1 * morphTargetInfluences[ 1 ];
		transformed += morphTarget2 * morphTargetInfluences[ 2 ];
		transformed += morphTarget3 * morphTargetInfluences[ 3 ];
		#ifndef USE_MORPHNORMALS
			transformed += morphTarget4 * morphTargetInfluences[ 4 ];
			transformed += morphTarget5 * morphTargetInfluences[ 5 ];
			transformed += morphTarget6 * morphTargetInfluences[ 6 ];
			transformed += morphTarget7 * morphTargetInfluences[ 7 ];
		#endif
	#endif
#endif`,s_=`float faceDirection = gl_FrontFacing ? 1.0 : - 1.0;
#ifdef FLAT_SHADED
	vec3 fdx = dFdx( vViewPosition );
	vec3 fdy = dFdy( vViewPosition );
	vec3 normal = normalize( cross( fdx, fdy ) );
#else
	vec3 normal = normalize( vNormal );
	#ifdef DOUBLE_SIDED
		normal *= faceDirection;
	#endif
#endif
#if defined( USE_NORMALMAP_TANGENTSPACE ) || defined( USE_CLEARCOAT_NORMALMAP ) || defined( USE_ANISOTROPY )
	#ifdef USE_TANGENT
		mat3 tbn = mat3( normalize( vTangent ), normalize( vBitangent ), normal );
	#else
		mat3 tbn = getTangentFrame( - vViewPosition, normal,
		#if defined( USE_NORMALMAP )
			vNormalMapUv
		#elif defined( USE_CLEARCOAT_NORMALMAP )
			vClearcoatNormalMapUv
		#else
			vUv
		#endif
		);
	#endif
	#if defined( DOUBLE_SIDED ) && ! defined( FLAT_SHADED )
		tbn[0] *= faceDirection;
		tbn[1] *= faceDirection;
	#endif
#endif
#ifdef USE_CLEARCOAT_NORMALMAP
	#ifdef USE_TANGENT
		mat3 tbn2 = mat3( normalize( vTangent ), normalize( vBitangent ), normal );
	#else
		mat3 tbn2 = getTangentFrame( - vViewPosition, normal, vClearcoatNormalMapUv );
	#endif
	#if defined( DOUBLE_SIDED ) && ! defined( FLAT_SHADED )
		tbn2[0] *= faceDirection;
		tbn2[1] *= faceDirection;
	#endif
#endif
vec3 nonPerturbedNormal = normal;`,r_=`#ifdef USE_NORMALMAP_OBJECTSPACE
	normal = texture2D( normalMap, vNormalMapUv ).xyz * 2.0 - 1.0;
	#ifdef FLIP_SIDED
		normal = - normal;
	#endif
	#ifdef DOUBLE_SIDED
		normal = normal * faceDirection;
	#endif
	normal = normalize( normalMatrix * normal );
#elif defined( USE_NORMALMAP_TANGENTSPACE )
	vec3 mapN = texture2D( normalMap, vNormalMapUv ).xyz * 2.0 - 1.0;
	mapN.xy *= normalScale;
	normal = normalize( tbn * mapN );
#elif defined( USE_BUMPMAP )
	normal = perturbNormalArb( - vViewPosition, normal, dHdxy_fwd(), faceDirection );
#endif`,o_=`#ifndef FLAT_SHADED
	varying vec3 vNormal;
	#ifdef USE_TANGENT
		varying vec3 vTangent;
		varying vec3 vBitangent;
	#endif
#endif`,a_=`#ifndef FLAT_SHADED
	varying vec3 vNormal;
	#ifdef USE_TANGENT
		varying vec3 vTangent;
		varying vec3 vBitangent;
	#endif
#endif`,l_=`#ifndef FLAT_SHADED
	vNormal = normalize( transformedNormal );
	#ifdef USE_TANGENT
		vTangent = normalize( transformedTangent );
		vBitangent = normalize( cross( vNormal, vTangent ) * tangent.w );
	#endif
#endif`,c_=`#ifdef USE_NORMALMAP
	uniform sampler2D normalMap;
	uniform vec2 normalScale;
#endif
#ifdef USE_NORMALMAP_OBJECTSPACE
	uniform mat3 normalMatrix;
#endif
#if ! defined ( USE_TANGENT ) && ( defined ( USE_NORMALMAP_TANGENTSPACE ) || defined ( USE_CLEARCOAT_NORMALMAP ) || defined( USE_ANISOTROPY ) )
	mat3 getTangentFrame( vec3 eye_pos, vec3 surf_norm, vec2 uv ) {
		vec3 q0 = dFdx( eye_pos.xyz );
		vec3 q1 = dFdy( eye_pos.xyz );
		vec2 st0 = dFdx( uv.st );
		vec2 st1 = dFdy( uv.st );
		vec3 N = surf_norm;
		vec3 q1perp = cross( q1, N );
		vec3 q0perp = cross( N, q0 );
		vec3 T = q1perp * st0.x + q0perp * st1.x;
		vec3 B = q1perp * st0.y + q0perp * st1.y;
		float det = max( dot( T, T ), dot( B, B ) );
		float scale = ( det == 0.0 ) ? 0.0 : inversesqrt( det );
		return mat3( T * scale, B * scale, N );
	}
#endif`,h_=`#ifdef USE_CLEARCOAT
	vec3 clearcoatNormal = nonPerturbedNormal;
#endif`,u_=`#ifdef USE_CLEARCOAT_NORMALMAP
	vec3 clearcoatMapN = texture2D( clearcoatNormalMap, vClearcoatNormalMapUv ).xyz * 2.0 - 1.0;
	clearcoatMapN.xy *= clearcoatNormalScale;
	clearcoatNormal = normalize( tbn2 * clearcoatMapN );
#endif`,d_=`#ifdef USE_CLEARCOATMAP
	uniform sampler2D clearcoatMap;
#endif
#ifdef USE_CLEARCOAT_NORMALMAP
	uniform sampler2D clearcoatNormalMap;
	uniform vec2 clearcoatNormalScale;
#endif
#ifdef USE_CLEARCOAT_ROUGHNESSMAP
	uniform sampler2D clearcoatRoughnessMap;
#endif`,f_=`#ifdef USE_IRIDESCENCEMAP
	uniform sampler2D iridescenceMap;
#endif
#ifdef USE_IRIDESCENCE_THICKNESSMAP
	uniform sampler2D iridescenceThicknessMap;
#endif`,p_=`#ifdef OPAQUE
diffuseColor.a = 1.0;
#endif
#ifdef USE_TRANSMISSION
diffuseColor.a *= material.transmissionAlpha;
#endif
gl_FragColor = vec4( outgoingLight, diffuseColor.a );`,m_=`vec3 packNormalToRGB( const in vec3 normal ) {
	return normalize( normal ) * 0.5 + 0.5;
}
vec3 unpackRGBToNormal( const in vec3 rgb ) {
	return 2.0 * rgb.xyz - 1.0;
}
const float PackUpscale = 256. / 255.;const float UnpackDownscale = 255. / 256.;
const vec3 PackFactors = vec3( 256. * 256. * 256., 256. * 256., 256. );
const vec4 UnpackFactors = UnpackDownscale / vec4( PackFactors, 1. );
const float ShiftRight8 = 1. / 256.;
vec4 packDepthToRGBA( const in float v ) {
	vec4 r = vec4( fract( v * PackFactors ), v );
	r.yzw -= r.xyz * ShiftRight8;	return r * PackUpscale;
}
float unpackRGBAToDepth( const in vec4 v ) {
	return dot( v, UnpackFactors );
}
vec2 packDepthToRG( in highp float v ) {
	return packDepthToRGBA( v ).yx;
}
float unpackRGToDepth( const in highp vec2 v ) {
	return unpackRGBAToDepth( vec4( v.xy, 0.0, 0.0 ) );
}
vec4 pack2HalfToRGBA( vec2 v ) {
	vec4 r = vec4( v.x, fract( v.x * 255.0 ), v.y, fract( v.y * 255.0 ) );
	return vec4( r.x - r.y / 255.0, r.y, r.z - r.w / 255.0, r.w );
}
vec2 unpackRGBATo2Half( vec4 v ) {
	return vec2( v.x + ( v.y / 255.0 ), v.z + ( v.w / 255.0 ) );
}
float viewZToOrthographicDepth( const in float viewZ, const in float near, const in float far ) {
	return ( viewZ + near ) / ( near - far );
}
float orthographicDepthToViewZ( const in float depth, const in float near, const in float far ) {
	return depth * ( near - far ) - near;
}
float viewZToPerspectiveDepth( const in float viewZ, const in float near, const in float far ) {
	return ( ( near + viewZ ) * far ) / ( ( far - near ) * viewZ );
}
float perspectiveDepthToViewZ( const in float depth, const in float near, const in float far ) {
	return ( near * far ) / ( ( far - near ) * depth - far );
}`,g_=`#ifdef PREMULTIPLIED_ALPHA
	gl_FragColor.rgb *= gl_FragColor.a;
#endif`,__=`vec4 mvPosition = vec4( transformed, 1.0 );
#ifdef USE_BATCHING
	mvPosition = batchingMatrix * mvPosition;
#endif
#ifdef USE_INSTANCING
	mvPosition = instanceMatrix * mvPosition;
#endif
mvPosition = modelViewMatrix * mvPosition;
gl_Position = projectionMatrix * mvPosition;`,x_=`#ifdef DITHERING
	gl_FragColor.rgb = dithering( gl_FragColor.rgb );
#endif`,v_=`#ifdef DITHERING
	vec3 dithering( vec3 color ) {
		float grid_position = rand( gl_FragCoord.xy );
		vec3 dither_shift_RGB = vec3( 0.25 / 255.0, -0.25 / 255.0, 0.25 / 255.0 );
		dither_shift_RGB = mix( 2.0 * dither_shift_RGB, -2.0 * dither_shift_RGB, grid_position );
		return color + dither_shift_RGB;
	}
#endif`,b_=`float roughnessFactor = roughness;
#ifdef USE_ROUGHNESSMAP
	vec4 texelRoughness = texture2D( roughnessMap, vRoughnessMapUv );
	roughnessFactor *= texelRoughness.g;
#endif`,M_=`#ifdef USE_ROUGHNESSMAP
	uniform sampler2D roughnessMap;
#endif`,y_=`#if NUM_SPOT_LIGHT_COORDS > 0
	varying vec4 vSpotLightCoord[ NUM_SPOT_LIGHT_COORDS ];
#endif
#if NUM_SPOT_LIGHT_MAPS > 0
	uniform sampler2D spotLightMap[ NUM_SPOT_LIGHT_MAPS ];
#endif
#ifdef USE_SHADOWMAP
	#if NUM_DIR_LIGHT_SHADOWS > 0
		uniform sampler2D directionalShadowMap[ NUM_DIR_LIGHT_SHADOWS ];
		varying vec4 vDirectionalShadowCoord[ NUM_DIR_LIGHT_SHADOWS ];
		struct DirectionalLightShadow {
			float shadowBias;
			float shadowNormalBias;
			float shadowRadius;
			vec2 shadowMapSize;
		};
		uniform DirectionalLightShadow directionalLightShadows[ NUM_DIR_LIGHT_SHADOWS ];
	#endif
	#if NUM_SPOT_LIGHT_SHADOWS > 0
		uniform sampler2D spotShadowMap[ NUM_SPOT_LIGHT_SHADOWS ];
		struct SpotLightShadow {
			float shadowBias;
			float shadowNormalBias;
			float shadowRadius;
			vec2 shadowMapSize;
		};
		uniform SpotLightShadow spotLightShadows[ NUM_SPOT_LIGHT_SHADOWS ];
	#endif
	#if NUM_POINT_LIGHT_SHADOWS > 0
		uniform sampler2D pointShadowMap[ NUM_POINT_LIGHT_SHADOWS ];
		varying vec4 vPointShadowCoord[ NUM_POINT_LIGHT_SHADOWS ];
		struct PointLightShadow {
			float shadowBias;
			float shadowNormalBias;
			float shadowRadius;
			vec2 shadowMapSize;
			float shadowCameraNear;
			float shadowCameraFar;
		};
		uniform PointLightShadow pointLightShadows[ NUM_POINT_LIGHT_SHADOWS ];
	#endif
	float texture2DCompare( sampler2D depths, vec2 uv, float compare ) {
		return step( compare, unpackRGBAToDepth( texture2D( depths, uv ) ) );
	}
	vec2 texture2DDistribution( sampler2D shadow, vec2 uv ) {
		return unpackRGBATo2Half( texture2D( shadow, uv ) );
	}
	float VSMShadow (sampler2D shadow, vec2 uv, float compare ){
		float occlusion = 1.0;
		vec2 distribution = texture2DDistribution( shadow, uv );
		float hard_shadow = step( compare , distribution.x );
		if (hard_shadow != 1.0 ) {
			float distance = compare - distribution.x ;
			float variance = max( 0.00000, distribution.y * distribution.y );
			float softness_probability = variance / (variance + distance * distance );			softness_probability = clamp( ( softness_probability - 0.3 ) / ( 0.95 - 0.3 ), 0.0, 1.0 );			occlusion = clamp( max( hard_shadow, softness_probability ), 0.0, 1.0 );
		}
		return occlusion;
	}
	float getShadow( sampler2D shadowMap, vec2 shadowMapSize, float shadowBias, float shadowRadius, vec4 shadowCoord ) {
		float shadow = 1.0;
		shadowCoord.xyz /= shadowCoord.w;
		shadowCoord.z += shadowBias;
		bool inFrustum = shadowCoord.x >= 0.0 && shadowCoord.x <= 1.0 && shadowCoord.y >= 0.0 && shadowCoord.y <= 1.0;
		bool frustumTest = inFrustum && shadowCoord.z <= 1.0;
		if ( frustumTest ) {
		#if defined( SHADOWMAP_TYPE_PCF )
			vec2 texelSize = vec2( 1.0 ) / shadowMapSize;
			float dx0 = - texelSize.x * shadowRadius;
			float dy0 = - texelSize.y * shadowRadius;
			float dx1 = + texelSize.x * shadowRadius;
			float dy1 = + texelSize.y * shadowRadius;
			float dx2 = dx0 / 2.0;
			float dy2 = dy0 / 2.0;
			float dx3 = dx1 / 2.0;
			float dy3 = dy1 / 2.0;
			shadow = (
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( dx0, dy0 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( 0.0, dy0 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( dx1, dy0 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( dx2, dy2 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( 0.0, dy2 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( dx3, dy2 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( dx0, 0.0 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( dx2, 0.0 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy, shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( dx3, 0.0 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( dx1, 0.0 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( dx2, dy3 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( 0.0, dy3 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( dx3, dy3 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( dx0, dy1 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( 0.0, dy1 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( dx1, dy1 ), shadowCoord.z )
			) * ( 1.0 / 17.0 );
		#elif defined( SHADOWMAP_TYPE_PCF_SOFT )
			vec2 texelSize = vec2( 1.0 ) / shadowMapSize;
			float dx = texelSize.x;
			float dy = texelSize.y;
			vec2 uv = shadowCoord.xy;
			vec2 f = fract( uv * shadowMapSize + 0.5 );
			uv -= f * texelSize;
			shadow = (
				texture2DCompare( shadowMap, uv, shadowCoord.z ) +
				texture2DCompare( shadowMap, uv + vec2( dx, 0.0 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, uv + vec2( 0.0, dy ), shadowCoord.z ) +
				texture2DCompare( shadowMap, uv + texelSize, shadowCoord.z ) +
				mix( texture2DCompare( shadowMap, uv + vec2( -dx, 0.0 ), shadowCoord.z ),
					 texture2DCompare( shadowMap, uv + vec2( 2.0 * dx, 0.0 ), shadowCoord.z ),
					 f.x ) +
				mix( texture2DCompare( shadowMap, uv + vec2( -dx, dy ), shadowCoord.z ),
					 texture2DCompare( shadowMap, uv + vec2( 2.0 * dx, dy ), shadowCoord.z ),
					 f.x ) +
				mix( texture2DCompare( shadowMap, uv + vec2( 0.0, -dy ), shadowCoord.z ),
					 texture2DCompare( shadowMap, uv + vec2( 0.0, 2.0 * dy ), shadowCoord.z ),
					 f.y ) +
				mix( texture2DCompare( shadowMap, uv + vec2( dx, -dy ), shadowCoord.z ),
					 texture2DCompare( shadowMap, uv + vec2( dx, 2.0 * dy ), shadowCoord.z ),
					 f.y ) +
				mix( mix( texture2DCompare( shadowMap, uv + vec2( -dx, -dy ), shadowCoord.z ),
						  texture2DCompare( shadowMap, uv + vec2( 2.0 * dx, -dy ), shadowCoord.z ),
						  f.x ),
					 mix( texture2DCompare( shadowMap, uv + vec2( -dx, 2.0 * dy ), shadowCoord.z ),
						  texture2DCompare( shadowMap, uv + vec2( 2.0 * dx, 2.0 * dy ), shadowCoord.z ),
						  f.x ),
					 f.y )
			) * ( 1.0 / 9.0 );
		#elif defined( SHADOWMAP_TYPE_VSM )
			shadow = VSMShadow( shadowMap, shadowCoord.xy, shadowCoord.z );
		#else
			shadow = texture2DCompare( shadowMap, shadowCoord.xy, shadowCoord.z );
		#endif
		}
		return shadow;
	}
	vec2 cubeToUV( vec3 v, float texelSizeY ) {
		vec3 absV = abs( v );
		float scaleToCube = 1.0 / max( absV.x, max( absV.y, absV.z ) );
		absV *= scaleToCube;
		v *= scaleToCube * ( 1.0 - 2.0 * texelSizeY );
		vec2 planar = v.xy;
		float almostATexel = 1.5 * texelSizeY;
		float almostOne = 1.0 - almostATexel;
		if ( absV.z >= almostOne ) {
			if ( v.z > 0.0 )
				planar.x = 4.0 - v.x;
		} else if ( absV.x >= almostOne ) {
			float signX = sign( v.x );
			planar.x = v.z * signX + 2.0 * signX;
		} else if ( absV.y >= almostOne ) {
			float signY = sign( v.y );
			planar.x = v.x + 2.0 * signY + 2.0;
			planar.y = v.z * signY - 2.0;
		}
		return vec2( 0.125, 0.25 ) * planar + vec2( 0.375, 0.75 );
	}
	float getPointShadow( sampler2D shadowMap, vec2 shadowMapSize, float shadowBias, float shadowRadius, vec4 shadowCoord, float shadowCameraNear, float shadowCameraFar ) {
		vec2 texelSize = vec2( 1.0 ) / ( shadowMapSize * vec2( 4.0, 2.0 ) );
		vec3 lightToPosition = shadowCoord.xyz;
		float dp = ( length( lightToPosition ) - shadowCameraNear ) / ( shadowCameraFar - shadowCameraNear );		dp += shadowBias;
		vec3 bd3D = normalize( lightToPosition );
		#if defined( SHADOWMAP_TYPE_PCF ) || defined( SHADOWMAP_TYPE_PCF_SOFT ) || defined( SHADOWMAP_TYPE_VSM )
			vec2 offset = vec2( - 1, 1 ) * shadowRadius * texelSize.y;
			return (
				texture2DCompare( shadowMap, cubeToUV( bd3D + offset.xyy, texelSize.y ), dp ) +
				texture2DCompare( shadowMap, cubeToUV( bd3D + offset.yyy, texelSize.y ), dp ) +
				texture2DCompare( shadowMap, cubeToUV( bd3D + offset.xyx, texelSize.y ), dp ) +
				texture2DCompare( shadowMap, cubeToUV( bd3D + offset.yyx, texelSize.y ), dp ) +
				texture2DCompare( shadowMap, cubeToUV( bd3D, texelSize.y ), dp ) +
				texture2DCompare( shadowMap, cubeToUV( bd3D + offset.xxy, texelSize.y ), dp ) +
				texture2DCompare( shadowMap, cubeToUV( bd3D + offset.yxy, texelSize.y ), dp ) +
				texture2DCompare( shadowMap, cubeToUV( bd3D + offset.xxx, texelSize.y ), dp ) +
				texture2DCompare( shadowMap, cubeToUV( bd3D + offset.yxx, texelSize.y ), dp )
			) * ( 1.0 / 9.0 );
		#else
			return texture2DCompare( shadowMap, cubeToUV( bd3D, texelSize.y ), dp );
		#endif
	}
#endif`,S_=`#if NUM_SPOT_LIGHT_COORDS > 0
	uniform mat4 spotLightMatrix[ NUM_SPOT_LIGHT_COORDS ];
	varying vec4 vSpotLightCoord[ NUM_SPOT_LIGHT_COORDS ];
#endif
#ifdef USE_SHADOWMAP
	#if NUM_DIR_LIGHT_SHADOWS > 0
		uniform mat4 directionalShadowMatrix[ NUM_DIR_LIGHT_SHADOWS ];
		varying vec4 vDirectionalShadowCoord[ NUM_DIR_LIGHT_SHADOWS ];
		struct DirectionalLightShadow {
			float shadowBias;
			float shadowNormalBias;
			float shadowRadius;
			vec2 shadowMapSize;
		};
		uniform DirectionalLightShadow directionalLightShadows[ NUM_DIR_LIGHT_SHADOWS ];
	#endif
	#if NUM_SPOT_LIGHT_SHADOWS > 0
		struct SpotLightShadow {
			float shadowBias;
			float shadowNormalBias;
			float shadowRadius;
			vec2 shadowMapSize;
		};
		uniform SpotLightShadow spotLightShadows[ NUM_SPOT_LIGHT_SHADOWS ];
	#endif
	#if NUM_POINT_LIGHT_SHADOWS > 0
		uniform mat4 pointShadowMatrix[ NUM_POINT_LIGHT_SHADOWS ];
		varying vec4 vPointShadowCoord[ NUM_POINT_LIGHT_SHADOWS ];
		struct PointLightShadow {
			float shadowBias;
			float shadowNormalBias;
			float shadowRadius;
			vec2 shadowMapSize;
			float shadowCameraNear;
			float shadowCameraFar;
		};
		uniform PointLightShadow pointLightShadows[ NUM_POINT_LIGHT_SHADOWS ];
	#endif
#endif`,E_=`#if ( defined( USE_SHADOWMAP ) && ( NUM_DIR_LIGHT_SHADOWS > 0 || NUM_POINT_LIGHT_SHADOWS > 0 ) ) || ( NUM_SPOT_LIGHT_COORDS > 0 )
	vec3 shadowWorldNormal = inverseTransformDirection( transformedNormal, viewMatrix );
	vec4 shadowWorldPosition;
#endif
#if defined( USE_SHADOWMAP )
	#if NUM_DIR_LIGHT_SHADOWS > 0
		#pragma unroll_loop_start
		for ( int i = 0; i < NUM_DIR_LIGHT_SHADOWS; i ++ ) {
			shadowWorldPosition = worldPosition + vec4( shadowWorldNormal * directionalLightShadows[ i ].shadowNormalBias, 0 );
			vDirectionalShadowCoord[ i ] = directionalShadowMatrix[ i ] * shadowWorldPosition;
		}
		#pragma unroll_loop_end
	#endif
	#if NUM_POINT_LIGHT_SHADOWS > 0
		#pragma unroll_loop_start
		for ( int i = 0; i < NUM_POINT_LIGHT_SHADOWS; i ++ ) {
			shadowWorldPosition = worldPosition + vec4( shadowWorldNormal * pointLightShadows[ i ].shadowNormalBias, 0 );
			vPointShadowCoord[ i ] = pointShadowMatrix[ i ] * shadowWorldPosition;
		}
		#pragma unroll_loop_end
	#endif
#endif
#if NUM_SPOT_LIGHT_COORDS > 0
	#pragma unroll_loop_start
	for ( int i = 0; i < NUM_SPOT_LIGHT_COORDS; i ++ ) {
		shadowWorldPosition = worldPosition;
		#if ( defined( USE_SHADOWMAP ) && UNROLLED_LOOP_INDEX < NUM_SPOT_LIGHT_SHADOWS )
			shadowWorldPosition.xyz += shadowWorldNormal * spotLightShadows[ i ].shadowNormalBias;
		#endif
		vSpotLightCoord[ i ] = spotLightMatrix[ i ] * shadowWorldPosition;
	}
	#pragma unroll_loop_end
#endif`,T_=`float getShadowMask() {
	float shadow = 1.0;
	#ifdef USE_SHADOWMAP
	#if NUM_DIR_LIGHT_SHADOWS > 0
	DirectionalLightShadow directionalLight;
	#pragma unroll_loop_start
	for ( int i = 0; i < NUM_DIR_LIGHT_SHADOWS; i ++ ) {
		directionalLight = directionalLightShadows[ i ];
		shadow *= receiveShadow ? getShadow( directionalShadowMap[ i ], directionalLight.shadowMapSize, directionalLight.shadowBias, directionalLight.shadowRadius, vDirectionalShadowCoord[ i ] ) : 1.0;
	}
	#pragma unroll_loop_end
	#endif
	#if NUM_SPOT_LIGHT_SHADOWS > 0
	SpotLightShadow spotLight;
	#pragma unroll_loop_start
	for ( int i = 0; i < NUM_SPOT_LIGHT_SHADOWS; i ++ ) {
		spotLight = spotLightShadows[ i ];
		shadow *= receiveShadow ? getShadow( spotShadowMap[ i ], spotLight.shadowMapSize, spotLight.shadowBias, spotLight.shadowRadius, vSpotLightCoord[ i ] ) : 1.0;
	}
	#pragma unroll_loop_end
	#endif
	#if NUM_POINT_LIGHT_SHADOWS > 0
	PointLightShadow pointLight;
	#pragma unroll_loop_start
	for ( int i = 0; i < NUM_POINT_LIGHT_SHADOWS; i ++ ) {
		pointLight = pointLightShadows[ i ];
		shadow *= receiveShadow ? getPointShadow( pointShadowMap[ i ], pointLight.shadowMapSize, pointLight.shadowBias, pointLight.shadowRadius, vPointShadowCoord[ i ], pointLight.shadowCameraNear, pointLight.shadowCameraFar ) : 1.0;
	}
	#pragma unroll_loop_end
	#endif
	#endif
	return shadow;
}`,w_=`#ifdef USE_SKINNING
	mat4 boneMatX = getBoneMatrix( skinIndex.x );
	mat4 boneMatY = getBoneMatrix( skinIndex.y );
	mat4 boneMatZ = getBoneMatrix( skinIndex.z );
	mat4 boneMatW = getBoneMatrix( skinIndex.w );
#endif`,A_=`#ifdef USE_SKINNING
	uniform mat4 bindMatrix;
	uniform mat4 bindMatrixInverse;
	uniform highp sampler2D boneTexture;
	mat4 getBoneMatrix( const in float i ) {
		int size = textureSize( boneTexture, 0 ).x;
		int j = int( i ) * 4;
		int x = j % size;
		int y = j / size;
		vec4 v1 = texelFetch( boneTexture, ivec2( x, y ), 0 );
		vec4 v2 = texelFetch( boneTexture, ivec2( x + 1, y ), 0 );
		vec4 v3 = texelFetch( boneTexture, ivec2( x + 2, y ), 0 );
		vec4 v4 = texelFetch( boneTexture, ivec2( x + 3, y ), 0 );
		return mat4( v1, v2, v3, v4 );
	}
#endif`,C_=`#ifdef USE_SKINNING
	vec4 skinVertex = bindMatrix * vec4( transformed, 1.0 );
	vec4 skinned = vec4( 0.0 );
	skinned += boneMatX * skinVertex * skinWeight.x;
	skinned += boneMatY * skinVertex * skinWeight.y;
	skinned += boneMatZ * skinVertex * skinWeight.z;
	skinned += boneMatW * skinVertex * skinWeight.w;
	transformed = ( bindMatrixInverse * skinned ).xyz;
#endif`,R_=`#ifdef USE_SKINNING
	mat4 skinMatrix = mat4( 0.0 );
	skinMatrix += skinWeight.x * boneMatX;
	skinMatrix += skinWeight.y * boneMatY;
	skinMatrix += skinWeight.z * boneMatZ;
	skinMatrix += skinWeight.w * boneMatW;
	skinMatrix = bindMatrixInverse * skinMatrix * bindMatrix;
	objectNormal = vec4( skinMatrix * vec4( objectNormal, 0.0 ) ).xyz;
	#ifdef USE_TANGENT
		objectTangent = vec4( skinMatrix * vec4( objectTangent, 0.0 ) ).xyz;
	#endif
#endif`,P_=`float specularStrength;
#ifdef USE_SPECULARMAP
	vec4 texelSpecular = texture2D( specularMap, vSpecularMapUv );
	specularStrength = texelSpecular.r;
#else
	specularStrength = 1.0;
#endif`,L_=`#ifdef USE_SPECULARMAP
	uniform sampler2D specularMap;
#endif`,D_=`#if defined( TONE_MAPPING )
	gl_FragColor.rgb = toneMapping( gl_FragColor.rgb );
#endif`,I_=`#ifndef saturate
#define saturate( a ) clamp( a, 0.0, 1.0 )
#endif
uniform float toneMappingExposure;
vec3 LinearToneMapping( vec3 color ) {
	return saturate( toneMappingExposure * color );
}
vec3 ReinhardToneMapping( vec3 color ) {
	color *= toneMappingExposure;
	return saturate( color / ( vec3( 1.0 ) + color ) );
}
vec3 OptimizedCineonToneMapping( vec3 color ) {
	color *= toneMappingExposure;
	color = max( vec3( 0.0 ), color - 0.004 );
	return pow( ( color * ( 6.2 * color + 0.5 ) ) / ( color * ( 6.2 * color + 1.7 ) + 0.06 ), vec3( 2.2 ) );
}
vec3 RRTAndODTFit( vec3 v ) {
	vec3 a = v * ( v + 0.0245786 ) - 0.000090537;
	vec3 b = v * ( 0.983729 * v + 0.4329510 ) + 0.238081;
	return a / b;
}
vec3 ACESFilmicToneMapping( vec3 color ) {
	const mat3 ACESInputMat = mat3(
		vec3( 0.59719, 0.07600, 0.02840 ),		vec3( 0.35458, 0.90834, 0.13383 ),
		vec3( 0.04823, 0.01566, 0.83777 )
	);
	const mat3 ACESOutputMat = mat3(
		vec3(  1.60475, -0.10208, -0.00327 ),		vec3( -0.53108,  1.10813, -0.07276 ),
		vec3( -0.07367, -0.00605,  1.07602 )
	);
	color *= toneMappingExposure / 0.6;
	color = ACESInputMat * color;
	color = RRTAndODTFit( color );
	color = ACESOutputMat * color;
	return saturate( color );
}
const mat3 LINEAR_REC2020_TO_LINEAR_SRGB = mat3(
	vec3( 1.6605, - 0.1246, - 0.0182 ),
	vec3( - 0.5876, 1.1329, - 0.1006 ),
	vec3( - 0.0728, - 0.0083, 1.1187 )
);
const mat3 LINEAR_SRGB_TO_LINEAR_REC2020 = mat3(
	vec3( 0.6274, 0.0691, 0.0164 ),
	vec3( 0.3293, 0.9195, 0.0880 ),
	vec3( 0.0433, 0.0113, 0.8956 )
);
vec3 agxDefaultContrastApprox( vec3 x ) {
	vec3 x2 = x * x;
	vec3 x4 = x2 * x2;
	return + 15.5 * x4 * x2
		- 40.14 * x4 * x
		+ 31.96 * x4
		- 6.868 * x2 * x
		+ 0.4298 * x2
		+ 0.1191 * x
		- 0.00232;
}
vec3 AgXToneMapping( vec3 color ) {
	const mat3 AgXInsetMatrix = mat3(
		vec3( 0.856627153315983, 0.137318972929847, 0.11189821299995 ),
		vec3( 0.0951212405381588, 0.761241990602591, 0.0767994186031903 ),
		vec3( 0.0482516061458583, 0.101439036467562, 0.811302368396859 )
	);
	const mat3 AgXOutsetMatrix = mat3(
		vec3( 1.1271005818144368, - 0.1413297634984383, - 0.14132976349843826 ),
		vec3( - 0.11060664309660323, 1.157823702216272, - 0.11060664309660294 ),
		vec3( - 0.016493938717834573, - 0.016493938717834257, 1.2519364065950405 )
	);
	const float AgxMinEv = - 12.47393;	const float AgxMaxEv = 4.026069;
	color = LINEAR_SRGB_TO_LINEAR_REC2020 * color;
	color *= toneMappingExposure;
	color = AgXInsetMatrix * color;
	color = max( color, 1e-10 );	color = log2( color );
	color = ( color - AgxMinEv ) / ( AgxMaxEv - AgxMinEv );
	color = clamp( color, 0.0, 1.0 );
	color = agxDefaultContrastApprox( color );
	color = AgXOutsetMatrix * color;
	color = pow( max( vec3( 0.0 ), color ), vec3( 2.2 ) );
	color = LINEAR_REC2020_TO_LINEAR_SRGB * color;
	return color;
}
vec3 CustomToneMapping( vec3 color ) { return color; }`,O_=`#ifdef USE_TRANSMISSION
	material.transmission = transmission;
	material.transmissionAlpha = 1.0;
	material.thickness = thickness;
	material.attenuationDistance = attenuationDistance;
	material.attenuationColor = attenuationColor;
	#ifdef USE_TRANSMISSIONMAP
		material.transmission *= texture2D( transmissionMap, vTransmissionMapUv ).r;
	#endif
	#ifdef USE_THICKNESSMAP
		material.thickness *= texture2D( thicknessMap, vThicknessMapUv ).g;
	#endif
	vec3 pos = vWorldPosition;
	vec3 v = normalize( cameraPosition - pos );
	vec3 n = inverseTransformDirection( normal, viewMatrix );
	vec4 transmitted = getIBLVolumeRefraction(
		n, v, material.roughness, material.diffuseColor, material.specularColor, material.specularF90,
		pos, modelMatrix, viewMatrix, projectionMatrix, material.ior, material.thickness,
		material.attenuationColor, material.attenuationDistance );
	material.transmissionAlpha = mix( material.transmissionAlpha, transmitted.a, material.transmission );
	totalDiffuse = mix( totalDiffuse, transmitted.rgb, material.transmission );
#endif`,U_=`#ifdef USE_TRANSMISSION
	uniform float transmission;
	uniform float thickness;
	uniform float attenuationDistance;
	uniform vec3 attenuationColor;
	#ifdef USE_TRANSMISSIONMAP
		uniform sampler2D transmissionMap;
	#endif
	#ifdef USE_THICKNESSMAP
		uniform sampler2D thicknessMap;
	#endif
	uniform vec2 transmissionSamplerSize;
	uniform sampler2D transmissionSamplerMap;
	uniform mat4 modelMatrix;
	uniform mat4 projectionMatrix;
	varying vec3 vWorldPosition;
	float w0( float a ) {
		return ( 1.0 / 6.0 ) * ( a * ( a * ( - a + 3.0 ) - 3.0 ) + 1.0 );
	}
	float w1( float a ) {
		return ( 1.0 / 6.0 ) * ( a *  a * ( 3.0 * a - 6.0 ) + 4.0 );
	}
	float w2( float a ){
		return ( 1.0 / 6.0 ) * ( a * ( a * ( - 3.0 * a + 3.0 ) + 3.0 ) + 1.0 );
	}
	float w3( float a ) {
		return ( 1.0 / 6.0 ) * ( a * a * a );
	}
	float g0( float a ) {
		return w0( a ) + w1( a );
	}
	float g1( float a ) {
		return w2( a ) + w3( a );
	}
	float h0( float a ) {
		return - 1.0 + w1( a ) / ( w0( a ) + w1( a ) );
	}
	float h1( float a ) {
		return 1.0 + w3( a ) / ( w2( a ) + w3( a ) );
	}
	vec4 bicubic( sampler2D tex, vec2 uv, vec4 texelSize, float lod ) {
		uv = uv * texelSize.zw + 0.5;
		vec2 iuv = floor( uv );
		vec2 fuv = fract( uv );
		float g0x = g0( fuv.x );
		float g1x = g1( fuv.x );
		float h0x = h0( fuv.x );
		float h1x = h1( fuv.x );
		float h0y = h0( fuv.y );
		float h1y = h1( fuv.y );
		vec2 p0 = ( vec2( iuv.x + h0x, iuv.y + h0y ) - 0.5 ) * texelSize.xy;
		vec2 p1 = ( vec2( iuv.x + h1x, iuv.y + h0y ) - 0.5 ) * texelSize.xy;
		vec2 p2 = ( vec2( iuv.x + h0x, iuv.y + h1y ) - 0.5 ) * texelSize.xy;
		vec2 p3 = ( vec2( iuv.x + h1x, iuv.y + h1y ) - 0.5 ) * texelSize.xy;
		return g0( fuv.y ) * ( g0x * textureLod( tex, p0, lod ) + g1x * textureLod( tex, p1, lod ) ) +
			g1( fuv.y ) * ( g0x * textureLod( tex, p2, lod ) + g1x * textureLod( tex, p3, lod ) );
	}
	vec4 textureBicubic( sampler2D sampler, vec2 uv, float lod ) {
		vec2 fLodSize = vec2( textureSize( sampler, int( lod ) ) );
		vec2 cLodSize = vec2( textureSize( sampler, int( lod + 1.0 ) ) );
		vec2 fLodSizeInv = 1.0 / fLodSize;
		vec2 cLodSizeInv = 1.0 / cLodSize;
		vec4 fSample = bicubic( sampler, uv, vec4( fLodSizeInv, fLodSize ), floor( lod ) );
		vec4 cSample = bicubic( sampler, uv, vec4( cLodSizeInv, cLodSize ), ceil( lod ) );
		return mix( fSample, cSample, fract( lod ) );
	}
	vec3 getVolumeTransmissionRay( const in vec3 n, const in vec3 v, const in float thickness, const in float ior, const in mat4 modelMatrix ) {
		vec3 refractionVector = refract( - v, normalize( n ), 1.0 / ior );
		vec3 modelScale;
		modelScale.x = length( vec3( modelMatrix[ 0 ].xyz ) );
		modelScale.y = length( vec3( modelMatrix[ 1 ].xyz ) );
		modelScale.z = length( vec3( modelMatrix[ 2 ].xyz ) );
		return normalize( refractionVector ) * thickness * modelScale;
	}
	float applyIorToRoughness( const in float roughness, const in float ior ) {
		return roughness * clamp( ior * 2.0 - 2.0, 0.0, 1.0 );
	}
	vec4 getTransmissionSample( const in vec2 fragCoord, const in float roughness, const in float ior ) {
		float lod = log2( transmissionSamplerSize.x ) * applyIorToRoughness( roughness, ior );
		return textureBicubic( transmissionSamplerMap, fragCoord.xy, lod );
	}
	vec3 volumeAttenuation( const in float transmissionDistance, const in vec3 attenuationColor, const in float attenuationDistance ) {
		if ( isinf( attenuationDistance ) ) {
			return vec3( 1.0 );
		} else {
			vec3 attenuationCoefficient = -log( attenuationColor ) / attenuationDistance;
			vec3 transmittance = exp( - attenuationCoefficient * transmissionDistance );			return transmittance;
		}
	}
	vec4 getIBLVolumeRefraction( const in vec3 n, const in vec3 v, const in float roughness, const in vec3 diffuseColor,
		const in vec3 specularColor, const in float specularF90, const in vec3 position, const in mat4 modelMatrix,
		const in mat4 viewMatrix, const in mat4 projMatrix, const in float ior, const in float thickness,
		const in vec3 attenuationColor, const in float attenuationDistance ) {
		vec3 transmissionRay = getVolumeTransmissionRay( n, v, thickness, ior, modelMatrix );
		vec3 refractedRayExit = position + transmissionRay;
		vec4 ndcPos = projMatrix * viewMatrix * vec4( refractedRayExit, 1.0 );
		vec2 refractionCoords = ndcPos.xy / ndcPos.w;
		refractionCoords += 1.0;
		refractionCoords /= 2.0;
		vec4 transmittedLight = getTransmissionSample( refractionCoords, roughness, ior );
		vec3 transmittance = diffuseColor * volumeAttenuation( length( transmissionRay ), attenuationColor, attenuationDistance );
		vec3 attenuatedColor = transmittance * transmittedLight.rgb;
		vec3 F = EnvironmentBRDF( n, v, specularColor, specularF90, roughness );
		float transmittanceFactor = ( transmittance.r + transmittance.g + transmittance.b ) / 3.0;
		return vec4( ( 1.0 - F ) * attenuatedColor, 1.0 - ( 1.0 - transmittedLight.a ) * transmittanceFactor );
	}
#endif`,F_=`#if defined( USE_UV ) || defined( USE_ANISOTROPY )
	varying vec2 vUv;
#endif
#ifdef USE_MAP
	varying vec2 vMapUv;
#endif
#ifdef USE_ALPHAMAP
	varying vec2 vAlphaMapUv;
#endif
#ifdef USE_LIGHTMAP
	varying vec2 vLightMapUv;
#endif
#ifdef USE_AOMAP
	varying vec2 vAoMapUv;
#endif
#ifdef USE_BUMPMAP
	varying vec2 vBumpMapUv;
#endif
#ifdef USE_NORMALMAP
	varying vec2 vNormalMapUv;
#endif
#ifdef USE_EMISSIVEMAP
	varying vec2 vEmissiveMapUv;
#endif
#ifdef USE_METALNESSMAP
	varying vec2 vMetalnessMapUv;
#endif
#ifdef USE_ROUGHNESSMAP
	varying vec2 vRoughnessMapUv;
#endif
#ifdef USE_ANISOTROPYMAP
	varying vec2 vAnisotropyMapUv;
#endif
#ifdef USE_CLEARCOATMAP
	varying vec2 vClearcoatMapUv;
#endif
#ifdef USE_CLEARCOAT_NORMALMAP
	varying vec2 vClearcoatNormalMapUv;
#endif
#ifdef USE_CLEARCOAT_ROUGHNESSMAP
	varying vec2 vClearcoatRoughnessMapUv;
#endif
#ifdef USE_IRIDESCENCEMAP
	varying vec2 vIridescenceMapUv;
#endif
#ifdef USE_IRIDESCENCE_THICKNESSMAP
	varying vec2 vIridescenceThicknessMapUv;
#endif
#ifdef USE_SHEEN_COLORMAP
	varying vec2 vSheenColorMapUv;
#endif
#ifdef USE_SHEEN_ROUGHNESSMAP
	varying vec2 vSheenRoughnessMapUv;
#endif
#ifdef USE_SPECULARMAP
	varying vec2 vSpecularMapUv;
#endif
#ifdef USE_SPECULAR_COLORMAP
	varying vec2 vSpecularColorMapUv;
#endif
#ifdef USE_SPECULAR_INTENSITYMAP
	varying vec2 vSpecularIntensityMapUv;
#endif
#ifdef USE_TRANSMISSIONMAP
	uniform mat3 transmissionMapTransform;
	varying vec2 vTransmissionMapUv;
#endif
#ifdef USE_THICKNESSMAP
	uniform mat3 thicknessMapTransform;
	varying vec2 vThicknessMapUv;
#endif`,N_=`#if defined( USE_UV ) || defined( USE_ANISOTROPY )
	varying vec2 vUv;
#endif
#ifdef USE_MAP
	uniform mat3 mapTransform;
	varying vec2 vMapUv;
#endif
#ifdef USE_ALPHAMAP
	uniform mat3 alphaMapTransform;
	varying vec2 vAlphaMapUv;
#endif
#ifdef USE_LIGHTMAP
	uniform mat3 lightMapTransform;
	varying vec2 vLightMapUv;
#endif
#ifdef USE_AOMAP
	uniform mat3 aoMapTransform;
	varying vec2 vAoMapUv;
#endif
#ifdef USE_BUMPMAP
	uniform mat3 bumpMapTransform;
	varying vec2 vBumpMapUv;
#endif
#ifdef USE_NORMALMAP
	uniform mat3 normalMapTransform;
	varying vec2 vNormalMapUv;
#endif
#ifdef USE_DISPLACEMENTMAP
	uniform mat3 displacementMapTransform;
	varying vec2 vDisplacementMapUv;
#endif
#ifdef USE_EMISSIVEMAP
	uniform mat3 emissiveMapTransform;
	varying vec2 vEmissiveMapUv;
#endif
#ifdef USE_METALNESSMAP
	uniform mat3 metalnessMapTransform;
	varying vec2 vMetalnessMapUv;
#endif
#ifdef USE_ROUGHNESSMAP
	uniform mat3 roughnessMapTransform;
	varying vec2 vRoughnessMapUv;
#endif
#ifdef USE_ANISOTROPYMAP
	uniform mat3 anisotropyMapTransform;
	varying vec2 vAnisotropyMapUv;
#endif
#ifdef USE_CLEARCOATMAP
	uniform mat3 clearcoatMapTransform;
	varying vec2 vClearcoatMapUv;
#endif
#ifdef USE_CLEARCOAT_NORMALMAP
	uniform mat3 clearcoatNormalMapTransform;
	varying vec2 vClearcoatNormalMapUv;
#endif
#ifdef USE_CLEARCOAT_ROUGHNESSMAP
	uniform mat3 clearcoatRoughnessMapTransform;
	varying vec2 vClearcoatRoughnessMapUv;
#endif
#ifdef USE_SHEEN_COLORMAP
	uniform mat3 sheenColorMapTransform;
	varying vec2 vSheenColorMapUv;
#endif
#ifdef USE_SHEEN_ROUGHNESSMAP
	uniform mat3 sheenRoughnessMapTransform;
	varying vec2 vSheenRoughnessMapUv;
#endif
#ifdef USE_IRIDESCENCEMAP
	uniform mat3 iridescenceMapTransform;
	varying vec2 vIridescenceMapUv;
#endif
#ifdef USE_IRIDESCENCE_THICKNESSMAP
	uniform mat3 iridescenceThicknessMapTransform;
	varying vec2 vIridescenceThicknessMapUv;
#endif
#ifdef USE_SPECULARMAP
	uniform mat3 specularMapTransform;
	varying vec2 vSpecularMapUv;
#endif
#ifdef USE_SPECULAR_COLORMAP
	uniform mat3 specularColorMapTransform;
	varying vec2 vSpecularColorMapUv;
#endif
#ifdef USE_SPECULAR_INTENSITYMAP
	uniform mat3 specularIntensityMapTransform;
	varying vec2 vSpecularIntensityMapUv;
#endif
#ifdef USE_TRANSMISSIONMAP
	uniform mat3 transmissionMapTransform;
	varying vec2 vTransmissionMapUv;
#endif
#ifdef USE_THICKNESSMAP
	uniform mat3 thicknessMapTransform;
	varying vec2 vThicknessMapUv;
#endif`,k_=`#if defined( USE_UV ) || defined( USE_ANISOTROPY )
	vUv = vec3( uv, 1 ).xy;
#endif
#ifdef USE_MAP
	vMapUv = ( mapTransform * vec3( MAP_UV, 1 ) ).xy;
#endif
#ifdef USE_ALPHAMAP
	vAlphaMapUv = ( alphaMapTransform * vec3( ALPHAMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_LIGHTMAP
	vLightMapUv = ( lightMapTransform * vec3( LIGHTMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_AOMAP
	vAoMapUv = ( aoMapTransform * vec3( AOMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_BUMPMAP
	vBumpMapUv = ( bumpMapTransform * vec3( BUMPMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_NORMALMAP
	vNormalMapUv = ( normalMapTransform * vec3( NORMALMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_DISPLACEMENTMAP
	vDisplacementMapUv = ( displacementMapTransform * vec3( DISPLACEMENTMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_EMISSIVEMAP
	vEmissiveMapUv = ( emissiveMapTransform * vec3( EMISSIVEMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_METALNESSMAP
	vMetalnessMapUv = ( metalnessMapTransform * vec3( METALNESSMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_ROUGHNESSMAP
	vRoughnessMapUv = ( roughnessMapTransform * vec3( ROUGHNESSMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_ANISOTROPYMAP
	vAnisotropyMapUv = ( anisotropyMapTransform * vec3( ANISOTROPYMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_CLEARCOATMAP
	vClearcoatMapUv = ( clearcoatMapTransform * vec3( CLEARCOATMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_CLEARCOAT_NORMALMAP
	vClearcoatNormalMapUv = ( clearcoatNormalMapTransform * vec3( CLEARCOAT_NORMALMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_CLEARCOAT_ROUGHNESSMAP
	vClearcoatRoughnessMapUv = ( clearcoatRoughnessMapTransform * vec3( CLEARCOAT_ROUGHNESSMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_IRIDESCENCEMAP
	vIridescenceMapUv = ( iridescenceMapTransform * vec3( IRIDESCENCEMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_IRIDESCENCE_THICKNESSMAP
	vIridescenceThicknessMapUv = ( iridescenceThicknessMapTransform * vec3( IRIDESCENCE_THICKNESSMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_SHEEN_COLORMAP
	vSheenColorMapUv = ( sheenColorMapTransform * vec3( SHEEN_COLORMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_SHEEN_ROUGHNESSMAP
	vSheenRoughnessMapUv = ( sheenRoughnessMapTransform * vec3( SHEEN_ROUGHNESSMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_SPECULARMAP
	vSpecularMapUv = ( specularMapTransform * vec3( SPECULARMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_SPECULAR_COLORMAP
	vSpecularColorMapUv = ( specularColorMapTransform * vec3( SPECULAR_COLORMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_SPECULAR_INTENSITYMAP
	vSpecularIntensityMapUv = ( specularIntensityMapTransform * vec3( SPECULAR_INTENSITYMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_TRANSMISSIONMAP
	vTransmissionMapUv = ( transmissionMapTransform * vec3( TRANSMISSIONMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_THICKNESSMAP
	vThicknessMapUv = ( thicknessMapTransform * vec3( THICKNESSMAP_UV, 1 ) ).xy;
#endif`,B_=`#if defined( USE_ENVMAP ) || defined( DISTANCE ) || defined ( USE_SHADOWMAP ) || defined ( USE_TRANSMISSION ) || NUM_SPOT_LIGHT_COORDS > 0
	vec4 worldPosition = vec4( transformed, 1.0 );
	#ifdef USE_BATCHING
		worldPosition = batchingMatrix * worldPosition;
	#endif
	#ifdef USE_INSTANCING
		worldPosition = instanceMatrix * worldPosition;
	#endif
	worldPosition = modelMatrix * worldPosition;
#endif`;const Gt={alphahash_fragment:Hg,alphahash_pars_fragment:Vg,alphamap_fragment:Gg,alphamap_pars_fragment:Wg,alphatest_fragment:Xg,alphatest_pars_fragment:jg,aomap_fragment:Yg,aomap_pars_fragment:qg,batching_pars_vertex:$g,batching_vertex:Kg,begin_vertex:Zg,beginnormal_vertex:Jg,bsdfs:Qg,iridescence_fragment:t0,bumpmap_pars_fragment:e0,clipping_planes_fragment:n0,clipping_planes_pars_fragment:i0,clipping_planes_pars_vertex:s0,clipping_planes_vertex:r0,color_fragment:o0,color_pars_fragment:a0,color_pars_vertex:l0,color_vertex:c0,common:h0,cube_uv_reflection_fragment:u0,defaultnormal_vertex:d0,displacementmap_pars_vertex:f0,displacementmap_vertex:p0,emissivemap_fragment:m0,emissivemap_pars_fragment:g0,colorspace_fragment:_0,colorspace_pars_fragment:x0,envmap_fragment:v0,envmap_common_pars_fragment:b0,envmap_pars_fragment:M0,envmap_pars_vertex:y0,envmap_physical_pars_fragment:O0,envmap_vertex:S0,fog_vertex:E0,fog_pars_vertex:T0,fog_fragment:w0,fog_pars_fragment:A0,gradientmap_pars_fragment:C0,lightmap_fragment:R0,lightmap_pars_fragment:P0,lights_lambert_fragment:L0,lights_lambert_pars_fragment:D0,lights_pars_begin:I0,lights_toon_fragment:U0,lights_toon_pars_fragment:F0,lights_phong_fragment:N0,lights_phong_pars_fragment:k0,lights_physical_fragment:B0,lights_physical_pars_fragment:z0,lights_fragment_begin:H0,lights_fragment_maps:V0,lights_fragment_end:G0,logdepthbuf_fragment:W0,logdepthbuf_pars_fragment:X0,logdepthbuf_pars_vertex:j0,logdepthbuf_vertex:Y0,map_fragment:q0,map_pars_fragment:$0,map_particle_fragment:K0,map_particle_pars_fragment:Z0,metalnessmap_fragment:J0,metalnessmap_pars_fragment:Q0,morphcolor_vertex:t_,morphnormal_vertex:e_,morphtarget_pars_vertex:n_,morphtarget_vertex:i_,normal_fragment_begin:s_,normal_fragment_maps:r_,normal_pars_fragment:o_,normal_pars_vertex:a_,normal_vertex:l_,normalmap_pars_fragment:c_,clearcoat_normal_fragment_begin:h_,clearcoat_normal_fragment_maps:u_,clearcoat_pars_fragment:d_,iridescence_pars_fragment:f_,opaque_fragment:p_,packing:m_,premultiplied_alpha_fragment:g_,project_vertex:__,dithering_fragment:x_,dithering_pars_fragment:v_,roughnessmap_fragment:b_,roughnessmap_pars_fragment:M_,shadowmap_pars_fragment:y_,shadowmap_pars_vertex:S_,shadowmap_vertex:E_,shadowmask_pars_fragment:T_,skinbase_vertex:w_,skinning_pars_vertex:A_,skinning_vertex:C_,skinnormal_vertex:R_,specularmap_fragment:P_,specularmap_pars_fragment:L_,tonemapping_fragment:D_,tonemapping_pars_fragment:I_,transmission_fragment:O_,transmission_pars_fragment:U_,uv_pars_fragment:F_,uv_pars_vertex:N_,uv_vertex:k_,worldpos_vertex:B_,background_vert:`varying vec2 vUv;
uniform mat3 uvTransform;
void main() {
	vUv = ( uvTransform * vec3( uv, 1 ) ).xy;
	gl_Position = vec4( position.xy, 1.0, 1.0 );
}`,background_frag:`uniform sampler2D t2D;
uniform float backgroundIntensity;
varying vec2 vUv;
void main() {
	vec4 texColor = texture2D( t2D, vUv );
	#ifdef DECODE_VIDEO_TEXTURE
		texColor = vec4( mix( pow( texColor.rgb * 0.9478672986 + vec3( 0.0521327014 ), vec3( 2.4 ) ), texColor.rgb * 0.0773993808, vec3( lessThanEqual( texColor.rgb, vec3( 0.04045 ) ) ) ), texColor.w );
	#endif
	texColor.rgb *= backgroundIntensity;
	gl_FragColor = texColor;
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
}`,backgroundCube_vert:`varying vec3 vWorldDirection;
#include <common>
void main() {
	vWorldDirection = transformDirection( position, modelMatrix );
	#include <begin_vertex>
	#include <project_vertex>
	gl_Position.z = gl_Position.w;
}`,backgroundCube_frag:`#ifdef ENVMAP_TYPE_CUBE
	uniform samplerCube envMap;
#elif defined( ENVMAP_TYPE_CUBE_UV )
	uniform sampler2D envMap;
#endif
uniform float flipEnvMap;
uniform float backgroundBlurriness;
uniform float backgroundIntensity;
varying vec3 vWorldDirection;
#include <cube_uv_reflection_fragment>
void main() {
	#ifdef ENVMAP_TYPE_CUBE
		vec4 texColor = textureCube( envMap, vec3( flipEnvMap * vWorldDirection.x, vWorldDirection.yz ) );
	#elif defined( ENVMAP_TYPE_CUBE_UV )
		vec4 texColor = textureCubeUV( envMap, vWorldDirection, backgroundBlurriness );
	#else
		vec4 texColor = vec4( 0.0, 0.0, 0.0, 1.0 );
	#endif
	texColor.rgb *= backgroundIntensity;
	gl_FragColor = texColor;
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
}`,cube_vert:`varying vec3 vWorldDirection;
#include <common>
void main() {
	vWorldDirection = transformDirection( position, modelMatrix );
	#include <begin_vertex>
	#include <project_vertex>
	gl_Position.z = gl_Position.w;
}`,cube_frag:`uniform samplerCube tCube;
uniform float tFlip;
uniform float opacity;
varying vec3 vWorldDirection;
void main() {
	vec4 texColor = textureCube( tCube, vec3( tFlip * vWorldDirection.x, vWorldDirection.yz ) );
	gl_FragColor = texColor;
	gl_FragColor.a *= opacity;
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
}`,depth_vert:`#include <common>
#include <batching_pars_vertex>
#include <uv_pars_vertex>
#include <displacementmap_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
varying vec2 vHighPrecisionZW;
void main() {
	#include <uv_vertex>
	#include <batching_vertex>
	#include <skinbase_vertex>
	#ifdef USE_DISPLACEMENTMAP
		#include <beginnormal_vertex>
		#include <morphnormal_vertex>
		#include <skinnormal_vertex>
	#endif
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <displacementmap_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	vHighPrecisionZW = gl_Position.zw;
}`,depth_frag:`#if DEPTH_PACKING == 3200
	uniform float opacity;
#endif
#include <common>
#include <packing>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
varying vec2 vHighPrecisionZW;
void main() {
	#include <clipping_planes_fragment>
	vec4 diffuseColor = vec4( 1.0 );
	#if DEPTH_PACKING == 3200
		diffuseColor.a = opacity;
	#endif
	#include <map_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	#include <logdepthbuf_fragment>
	float fragCoordZ = 0.5 * vHighPrecisionZW[0] / vHighPrecisionZW[1] + 0.5;
	#if DEPTH_PACKING == 3200
		gl_FragColor = vec4( vec3( 1.0 - fragCoordZ ), opacity );
	#elif DEPTH_PACKING == 3201
		gl_FragColor = packDepthToRGBA( fragCoordZ );
	#endif
}`,distanceRGBA_vert:`#define DISTANCE
varying vec3 vWorldPosition;
#include <common>
#include <batching_pars_vertex>
#include <uv_pars_vertex>
#include <displacementmap_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	#include <batching_vertex>
	#include <skinbase_vertex>
	#ifdef USE_DISPLACEMENTMAP
		#include <beginnormal_vertex>
		#include <morphnormal_vertex>
		#include <skinnormal_vertex>
	#endif
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <displacementmap_vertex>
	#include <project_vertex>
	#include <worldpos_vertex>
	#include <clipping_planes_vertex>
	vWorldPosition = worldPosition.xyz;
}`,distanceRGBA_frag:`#define DISTANCE
uniform vec3 referencePosition;
uniform float nearDistance;
uniform float farDistance;
varying vec3 vWorldPosition;
#include <common>
#include <packing>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <clipping_planes_pars_fragment>
void main () {
	#include <clipping_planes_fragment>
	vec4 diffuseColor = vec4( 1.0 );
	#include <map_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	float dist = length( vWorldPosition - referencePosition );
	dist = ( dist - nearDistance ) / ( farDistance - nearDistance );
	dist = saturate( dist );
	gl_FragColor = packDepthToRGBA( dist );
}`,equirect_vert:`varying vec3 vWorldDirection;
#include <common>
void main() {
	vWorldDirection = transformDirection( position, modelMatrix );
	#include <begin_vertex>
	#include <project_vertex>
}`,equirect_frag:`uniform sampler2D tEquirect;
varying vec3 vWorldDirection;
#include <common>
void main() {
	vec3 direction = normalize( vWorldDirection );
	vec2 sampleUV = equirectUv( direction );
	gl_FragColor = texture2D( tEquirect, sampleUV );
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
}`,linedashed_vert:`uniform float scale;
attribute float lineDistance;
varying float vLineDistance;
#include <common>
#include <uv_pars_vertex>
#include <color_pars_vertex>
#include <fog_pars_vertex>
#include <morphtarget_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	vLineDistance = scale * lineDistance;
	#include <uv_vertex>
	#include <color_vertex>
	#include <morphcolor_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	#include <fog_vertex>
}`,linedashed_frag:`uniform vec3 diffuse;
uniform float opacity;
uniform float dashSize;
uniform float totalSize;
varying float vLineDistance;
#include <common>
#include <color_pars_fragment>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <fog_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	#include <clipping_planes_fragment>
	if ( mod( vLineDistance, totalSize ) > dashSize ) {
		discard;
	}
	vec3 outgoingLight = vec3( 0.0 );
	vec4 diffuseColor = vec4( diffuse, opacity );
	#include <logdepthbuf_fragment>
	#include <map_fragment>
	#include <color_fragment>
	outgoingLight = diffuseColor.rgb;
	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
	#include <premultiplied_alpha_fragment>
}`,meshbasic_vert:`#include <common>
#include <batching_pars_vertex>
#include <uv_pars_vertex>
#include <envmap_pars_vertex>
#include <color_pars_vertex>
#include <fog_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	#include <color_vertex>
	#include <morphcolor_vertex>
	#include <batching_vertex>
	#if defined ( USE_ENVMAP ) || defined ( USE_SKINNING )
		#include <beginnormal_vertex>
		#include <morphnormal_vertex>
		#include <skinbase_vertex>
		#include <skinnormal_vertex>
		#include <defaultnormal_vertex>
	#endif
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	#include <worldpos_vertex>
	#include <envmap_vertex>
	#include <fog_vertex>
}`,meshbasic_frag:`uniform vec3 diffuse;
uniform float opacity;
#ifndef FLAT_SHADED
	varying vec3 vNormal;
#endif
#include <common>
#include <dithering_pars_fragment>
#include <color_pars_fragment>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <aomap_pars_fragment>
#include <lightmap_pars_fragment>
#include <envmap_common_pars_fragment>
#include <envmap_pars_fragment>
#include <fog_pars_fragment>
#include <specularmap_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	#include <clipping_planes_fragment>
	vec4 diffuseColor = vec4( diffuse, opacity );
	#include <logdepthbuf_fragment>
	#include <map_fragment>
	#include <color_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	#include <specularmap_fragment>
	ReflectedLight reflectedLight = ReflectedLight( vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ) );
	#ifdef USE_LIGHTMAP
		vec4 lightMapTexel = texture2D( lightMap, vLightMapUv );
		reflectedLight.indirectDiffuse += lightMapTexel.rgb * lightMapIntensity * RECIPROCAL_PI;
	#else
		reflectedLight.indirectDiffuse += vec3( 1.0 );
	#endif
	#include <aomap_fragment>
	reflectedLight.indirectDiffuse *= diffuseColor.rgb;
	vec3 outgoingLight = reflectedLight.indirectDiffuse;
	#include <envmap_fragment>
	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
	#include <premultiplied_alpha_fragment>
	#include <dithering_fragment>
}`,meshlambert_vert:`#define LAMBERT
varying vec3 vViewPosition;
#include <common>
#include <batching_pars_vertex>
#include <uv_pars_vertex>
#include <displacementmap_pars_vertex>
#include <envmap_pars_vertex>
#include <color_pars_vertex>
#include <fog_pars_vertex>
#include <normal_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <shadowmap_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	#include <color_vertex>
	#include <morphcolor_vertex>
	#include <batching_vertex>
	#include <beginnormal_vertex>
	#include <morphnormal_vertex>
	#include <skinbase_vertex>
	#include <skinnormal_vertex>
	#include <defaultnormal_vertex>
	#include <normal_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <displacementmap_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	vViewPosition = - mvPosition.xyz;
	#include <worldpos_vertex>
	#include <envmap_vertex>
	#include <shadowmap_vertex>
	#include <fog_vertex>
}`,meshlambert_frag:`#define LAMBERT
uniform vec3 diffuse;
uniform vec3 emissive;
uniform float opacity;
#include <common>
#include <packing>
#include <dithering_pars_fragment>
#include <color_pars_fragment>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <aomap_pars_fragment>
#include <lightmap_pars_fragment>
#include <emissivemap_pars_fragment>
#include <envmap_common_pars_fragment>
#include <envmap_pars_fragment>
#include <fog_pars_fragment>
#include <bsdfs>
#include <lights_pars_begin>
#include <normal_pars_fragment>
#include <lights_lambert_pars_fragment>
#include <shadowmap_pars_fragment>
#include <bumpmap_pars_fragment>
#include <normalmap_pars_fragment>
#include <specularmap_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	#include <clipping_planes_fragment>
	vec4 diffuseColor = vec4( diffuse, opacity );
	ReflectedLight reflectedLight = ReflectedLight( vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ) );
	vec3 totalEmissiveRadiance = emissive;
	#include <logdepthbuf_fragment>
	#include <map_fragment>
	#include <color_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	#include <specularmap_fragment>
	#include <normal_fragment_begin>
	#include <normal_fragment_maps>
	#include <emissivemap_fragment>
	#include <lights_lambert_fragment>
	#include <lights_fragment_begin>
	#include <lights_fragment_maps>
	#include <lights_fragment_end>
	#include <aomap_fragment>
	vec3 outgoingLight = reflectedLight.directDiffuse + reflectedLight.indirectDiffuse + totalEmissiveRadiance;
	#include <envmap_fragment>
	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
	#include <premultiplied_alpha_fragment>
	#include <dithering_fragment>
}`,meshmatcap_vert:`#define MATCAP
varying vec3 vViewPosition;
#include <common>
#include <batching_pars_vertex>
#include <uv_pars_vertex>
#include <color_pars_vertex>
#include <displacementmap_pars_vertex>
#include <fog_pars_vertex>
#include <normal_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	#include <color_vertex>
	#include <morphcolor_vertex>
	#include <batching_vertex>
	#include <beginnormal_vertex>
	#include <morphnormal_vertex>
	#include <skinbase_vertex>
	#include <skinnormal_vertex>
	#include <defaultnormal_vertex>
	#include <normal_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <displacementmap_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	#include <fog_vertex>
	vViewPosition = - mvPosition.xyz;
}`,meshmatcap_frag:`#define MATCAP
uniform vec3 diffuse;
uniform float opacity;
uniform sampler2D matcap;
varying vec3 vViewPosition;
#include <common>
#include <dithering_pars_fragment>
#include <color_pars_fragment>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <fog_pars_fragment>
#include <normal_pars_fragment>
#include <bumpmap_pars_fragment>
#include <normalmap_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	#include <clipping_planes_fragment>
	vec4 diffuseColor = vec4( diffuse, opacity );
	#include <logdepthbuf_fragment>
	#include <map_fragment>
	#include <color_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	#include <normal_fragment_begin>
	#include <normal_fragment_maps>
	vec3 viewDir = normalize( vViewPosition );
	vec3 x = normalize( vec3( viewDir.z, 0.0, - viewDir.x ) );
	vec3 y = cross( viewDir, x );
	vec2 uv = vec2( dot( x, normal ), dot( y, normal ) ) * 0.495 + 0.5;
	#ifdef USE_MATCAP
		vec4 matcapColor = texture2D( matcap, uv );
	#else
		vec4 matcapColor = vec4( vec3( mix( 0.2, 0.8, uv.y ) ), 1.0 );
	#endif
	vec3 outgoingLight = diffuseColor.rgb * matcapColor.rgb;
	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
	#include <premultiplied_alpha_fragment>
	#include <dithering_fragment>
}`,meshnormal_vert:`#define NORMAL
#if defined( FLAT_SHADED ) || defined( USE_BUMPMAP ) || defined( USE_NORMALMAP_TANGENTSPACE )
	varying vec3 vViewPosition;
#endif
#include <common>
#include <batching_pars_vertex>
#include <uv_pars_vertex>
#include <displacementmap_pars_vertex>
#include <normal_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	#include <batching_vertex>
	#include <beginnormal_vertex>
	#include <morphnormal_vertex>
	#include <skinbase_vertex>
	#include <skinnormal_vertex>
	#include <defaultnormal_vertex>
	#include <normal_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <displacementmap_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
#if defined( FLAT_SHADED ) || defined( USE_BUMPMAP ) || defined( USE_NORMALMAP_TANGENTSPACE )
	vViewPosition = - mvPosition.xyz;
#endif
}`,meshnormal_frag:`#define NORMAL
uniform float opacity;
#if defined( FLAT_SHADED ) || defined( USE_BUMPMAP ) || defined( USE_NORMALMAP_TANGENTSPACE )
	varying vec3 vViewPosition;
#endif
#include <packing>
#include <uv_pars_fragment>
#include <normal_pars_fragment>
#include <bumpmap_pars_fragment>
#include <normalmap_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	#include <clipping_planes_fragment>
	#include <logdepthbuf_fragment>
	#include <normal_fragment_begin>
	#include <normal_fragment_maps>
	gl_FragColor = vec4( packNormalToRGB( normal ), opacity );
	#ifdef OPAQUE
		gl_FragColor.a = 1.0;
	#endif
}`,meshphong_vert:`#define PHONG
varying vec3 vViewPosition;
#include <common>
#include <batching_pars_vertex>
#include <uv_pars_vertex>
#include <displacementmap_pars_vertex>
#include <envmap_pars_vertex>
#include <color_pars_vertex>
#include <fog_pars_vertex>
#include <normal_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <shadowmap_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	#include <color_vertex>
	#include <morphcolor_vertex>
	#include <batching_vertex>
	#include <beginnormal_vertex>
	#include <morphnormal_vertex>
	#include <skinbase_vertex>
	#include <skinnormal_vertex>
	#include <defaultnormal_vertex>
	#include <normal_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <displacementmap_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	vViewPosition = - mvPosition.xyz;
	#include <worldpos_vertex>
	#include <envmap_vertex>
	#include <shadowmap_vertex>
	#include <fog_vertex>
}`,meshphong_frag:`#define PHONG
uniform vec3 diffuse;
uniform vec3 emissive;
uniform vec3 specular;
uniform float shininess;
uniform float opacity;
#include <common>
#include <packing>
#include <dithering_pars_fragment>
#include <color_pars_fragment>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <aomap_pars_fragment>
#include <lightmap_pars_fragment>
#include <emissivemap_pars_fragment>
#include <envmap_common_pars_fragment>
#include <envmap_pars_fragment>
#include <fog_pars_fragment>
#include <bsdfs>
#include <lights_pars_begin>
#include <normal_pars_fragment>
#include <lights_phong_pars_fragment>
#include <shadowmap_pars_fragment>
#include <bumpmap_pars_fragment>
#include <normalmap_pars_fragment>
#include <specularmap_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	#include <clipping_planes_fragment>
	vec4 diffuseColor = vec4( diffuse, opacity );
	ReflectedLight reflectedLight = ReflectedLight( vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ) );
	vec3 totalEmissiveRadiance = emissive;
	#include <logdepthbuf_fragment>
	#include <map_fragment>
	#include <color_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	#include <specularmap_fragment>
	#include <normal_fragment_begin>
	#include <normal_fragment_maps>
	#include <emissivemap_fragment>
	#include <lights_phong_fragment>
	#include <lights_fragment_begin>
	#include <lights_fragment_maps>
	#include <lights_fragment_end>
	#include <aomap_fragment>
	vec3 outgoingLight = reflectedLight.directDiffuse + reflectedLight.indirectDiffuse + reflectedLight.directSpecular + reflectedLight.indirectSpecular + totalEmissiveRadiance;
	#include <envmap_fragment>
	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
	#include <premultiplied_alpha_fragment>
	#include <dithering_fragment>
}`,meshphysical_vert:`#define STANDARD
varying vec3 vViewPosition;
#ifdef USE_TRANSMISSION
	varying vec3 vWorldPosition;
#endif
#include <common>
#include <batching_pars_vertex>
#include <uv_pars_vertex>
#include <displacementmap_pars_vertex>
#include <color_pars_vertex>
#include <fog_pars_vertex>
#include <normal_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <shadowmap_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	#include <color_vertex>
	#include <morphcolor_vertex>
	#include <batching_vertex>
	#include <beginnormal_vertex>
	#include <morphnormal_vertex>
	#include <skinbase_vertex>
	#include <skinnormal_vertex>
	#include <defaultnormal_vertex>
	#include <normal_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <displacementmap_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	vViewPosition = - mvPosition.xyz;
	#include <worldpos_vertex>
	#include <shadowmap_vertex>
	#include <fog_vertex>
#ifdef USE_TRANSMISSION
	vWorldPosition = worldPosition.xyz;
#endif
}`,meshphysical_frag:`#define STANDARD
#ifdef PHYSICAL
	#define IOR
	#define USE_SPECULAR
#endif
uniform vec3 diffuse;
uniform vec3 emissive;
uniform float roughness;
uniform float metalness;
uniform float opacity;
#ifdef IOR
	uniform float ior;
#endif
#ifdef USE_SPECULAR
	uniform float specularIntensity;
	uniform vec3 specularColor;
	#ifdef USE_SPECULAR_COLORMAP
		uniform sampler2D specularColorMap;
	#endif
	#ifdef USE_SPECULAR_INTENSITYMAP
		uniform sampler2D specularIntensityMap;
	#endif
#endif
#ifdef USE_CLEARCOAT
	uniform float clearcoat;
	uniform float clearcoatRoughness;
#endif
#ifdef USE_IRIDESCENCE
	uniform float iridescence;
	uniform float iridescenceIOR;
	uniform float iridescenceThicknessMinimum;
	uniform float iridescenceThicknessMaximum;
#endif
#ifdef USE_SHEEN
	uniform vec3 sheenColor;
	uniform float sheenRoughness;
	#ifdef USE_SHEEN_COLORMAP
		uniform sampler2D sheenColorMap;
	#endif
	#ifdef USE_SHEEN_ROUGHNESSMAP
		uniform sampler2D sheenRoughnessMap;
	#endif
#endif
#ifdef USE_ANISOTROPY
	uniform vec2 anisotropyVector;
	#ifdef USE_ANISOTROPYMAP
		uniform sampler2D anisotropyMap;
	#endif
#endif
varying vec3 vViewPosition;
#include <common>
#include <packing>
#include <dithering_pars_fragment>
#include <color_pars_fragment>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <aomap_pars_fragment>
#include <lightmap_pars_fragment>
#include <emissivemap_pars_fragment>
#include <iridescence_fragment>
#include <cube_uv_reflection_fragment>
#include <envmap_common_pars_fragment>
#include <envmap_physical_pars_fragment>
#include <fog_pars_fragment>
#include <lights_pars_begin>
#include <normal_pars_fragment>
#include <lights_physical_pars_fragment>
#include <transmission_pars_fragment>
#include <shadowmap_pars_fragment>
#include <bumpmap_pars_fragment>
#include <normalmap_pars_fragment>
#include <clearcoat_pars_fragment>
#include <iridescence_pars_fragment>
#include <roughnessmap_pars_fragment>
#include <metalnessmap_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	#include <clipping_planes_fragment>
	vec4 diffuseColor = vec4( diffuse, opacity );
	ReflectedLight reflectedLight = ReflectedLight( vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ) );
	vec3 totalEmissiveRadiance = emissive;
	#include <logdepthbuf_fragment>
	#include <map_fragment>
	#include <color_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	#include <roughnessmap_fragment>
	#include <metalnessmap_fragment>
	#include <normal_fragment_begin>
	#include <normal_fragment_maps>
	#include <clearcoat_normal_fragment_begin>
	#include <clearcoat_normal_fragment_maps>
	#include <emissivemap_fragment>
	#include <lights_physical_fragment>
	#include <lights_fragment_begin>
	#include <lights_fragment_maps>
	#include <lights_fragment_end>
	#include <aomap_fragment>
	vec3 totalDiffuse = reflectedLight.directDiffuse + reflectedLight.indirectDiffuse;
	vec3 totalSpecular = reflectedLight.directSpecular + reflectedLight.indirectSpecular;
	#include <transmission_fragment>
	vec3 outgoingLight = totalDiffuse + totalSpecular + totalEmissiveRadiance;
	#ifdef USE_SHEEN
		float sheenEnergyComp = 1.0 - 0.157 * max3( material.sheenColor );
		outgoingLight = outgoingLight * sheenEnergyComp + sheenSpecularDirect + sheenSpecularIndirect;
	#endif
	#ifdef USE_CLEARCOAT
		float dotNVcc = saturate( dot( geometryClearcoatNormal, geometryViewDir ) );
		vec3 Fcc = F_Schlick( material.clearcoatF0, material.clearcoatF90, dotNVcc );
		outgoingLight = outgoingLight * ( 1.0 - material.clearcoat * Fcc ) + ( clearcoatSpecularDirect + clearcoatSpecularIndirect ) * material.clearcoat;
	#endif
	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
	#include <premultiplied_alpha_fragment>
	#include <dithering_fragment>
}`,meshtoon_vert:`#define TOON
varying vec3 vViewPosition;
#include <common>
#include <batching_pars_vertex>
#include <uv_pars_vertex>
#include <displacementmap_pars_vertex>
#include <color_pars_vertex>
#include <fog_pars_vertex>
#include <normal_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <shadowmap_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	#include <color_vertex>
	#include <morphcolor_vertex>
	#include <batching_vertex>
	#include <beginnormal_vertex>
	#include <morphnormal_vertex>
	#include <skinbase_vertex>
	#include <skinnormal_vertex>
	#include <defaultnormal_vertex>
	#include <normal_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <displacementmap_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	vViewPosition = - mvPosition.xyz;
	#include <worldpos_vertex>
	#include <shadowmap_vertex>
	#include <fog_vertex>
}`,meshtoon_frag:`#define TOON
uniform vec3 diffuse;
uniform vec3 emissive;
uniform float opacity;
#include <common>
#include <packing>
#include <dithering_pars_fragment>
#include <color_pars_fragment>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <aomap_pars_fragment>
#include <lightmap_pars_fragment>
#include <emissivemap_pars_fragment>
#include <gradientmap_pars_fragment>
#include <fog_pars_fragment>
#include <bsdfs>
#include <lights_pars_begin>
#include <normal_pars_fragment>
#include <lights_toon_pars_fragment>
#include <shadowmap_pars_fragment>
#include <bumpmap_pars_fragment>
#include <normalmap_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	#include <clipping_planes_fragment>
	vec4 diffuseColor = vec4( diffuse, opacity );
	ReflectedLight reflectedLight = ReflectedLight( vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ) );
	vec3 totalEmissiveRadiance = emissive;
	#include <logdepthbuf_fragment>
	#include <map_fragment>
	#include <color_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	#include <normal_fragment_begin>
	#include <normal_fragment_maps>
	#include <emissivemap_fragment>
	#include <lights_toon_fragment>
	#include <lights_fragment_begin>
	#include <lights_fragment_maps>
	#include <lights_fragment_end>
	#include <aomap_fragment>
	vec3 outgoingLight = reflectedLight.directDiffuse + reflectedLight.indirectDiffuse + totalEmissiveRadiance;
	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
	#include <premultiplied_alpha_fragment>
	#include <dithering_fragment>
}`,points_vert:`uniform float size;
uniform float scale;
#include <common>
#include <color_pars_vertex>
#include <fog_pars_vertex>
#include <morphtarget_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
#ifdef USE_POINTS_UV
	varying vec2 vUv;
	uniform mat3 uvTransform;
#endif
void main() {
	#ifdef USE_POINTS_UV
		vUv = ( uvTransform * vec3( uv, 1 ) ).xy;
	#endif
	#include <color_vertex>
	#include <morphcolor_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <project_vertex>
	gl_PointSize = size;
	#ifdef USE_SIZEATTENUATION
		bool isPerspective = isPerspectiveMatrix( projectionMatrix );
		if ( isPerspective ) gl_PointSize *= ( scale / - mvPosition.z );
	#endif
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	#include <worldpos_vertex>
	#include <fog_vertex>
}`,points_frag:`uniform vec3 diffuse;
uniform float opacity;
#include <common>
#include <color_pars_fragment>
#include <map_particle_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <fog_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	#include <clipping_planes_fragment>
	vec3 outgoingLight = vec3( 0.0 );
	vec4 diffuseColor = vec4( diffuse, opacity );
	#include <logdepthbuf_fragment>
	#include <map_particle_fragment>
	#include <color_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	outgoingLight = diffuseColor.rgb;
	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
	#include <premultiplied_alpha_fragment>
}`,shadow_vert:`#include <common>
#include <batching_pars_vertex>
#include <fog_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <shadowmap_pars_vertex>
void main() {
	#include <batching_vertex>
	#include <beginnormal_vertex>
	#include <morphnormal_vertex>
	#include <skinbase_vertex>
	#include <skinnormal_vertex>
	#include <defaultnormal_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <worldpos_vertex>
	#include <shadowmap_vertex>
	#include <fog_vertex>
}`,shadow_frag:`uniform vec3 color;
uniform float opacity;
#include <common>
#include <packing>
#include <fog_pars_fragment>
#include <bsdfs>
#include <lights_pars_begin>
#include <logdepthbuf_pars_fragment>
#include <shadowmap_pars_fragment>
#include <shadowmask_pars_fragment>
void main() {
	#include <logdepthbuf_fragment>
	gl_FragColor = vec4( color, opacity * ( 1.0 - getShadowMask() ) );
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
}`,sprite_vert:`uniform float rotation;
uniform vec2 center;
#include <common>
#include <uv_pars_vertex>
#include <fog_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	vec4 mvPosition = modelViewMatrix * vec4( 0.0, 0.0, 0.0, 1.0 );
	vec2 scale;
	scale.x = length( vec3( modelMatrix[ 0 ].x, modelMatrix[ 0 ].y, modelMatrix[ 0 ].z ) );
	scale.y = length( vec3( modelMatrix[ 1 ].x, modelMatrix[ 1 ].y, modelMatrix[ 1 ].z ) );
	#ifndef USE_SIZEATTENUATION
		bool isPerspective = isPerspectiveMatrix( projectionMatrix );
		if ( isPerspective ) scale *= - mvPosition.z;
	#endif
	vec2 alignedPosition = ( position.xy - ( center - vec2( 0.5 ) ) ) * scale;
	vec2 rotatedPosition;
	rotatedPosition.x = cos( rotation ) * alignedPosition.x - sin( rotation ) * alignedPosition.y;
	rotatedPosition.y = sin( rotation ) * alignedPosition.x + cos( rotation ) * alignedPosition.y;
	mvPosition.xy += rotatedPosition;
	gl_Position = projectionMatrix * mvPosition;
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	#include <fog_vertex>
}`,sprite_frag:`uniform vec3 diffuse;
uniform float opacity;
#include <common>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <fog_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	#include <clipping_planes_fragment>
	vec3 outgoingLight = vec3( 0.0 );
	vec4 diffuseColor = vec4( diffuse, opacity );
	#include <logdepthbuf_fragment>
	#include <map_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	outgoingLight = diffuseColor.rgb;
	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
}`},ft={common:{diffuse:{value:new xt(16777215)},opacity:{value:1},map:{value:null},mapTransform:{value:new Yt},alphaMap:{value:null},alphaMapTransform:{value:new Yt},alphaTest:{value:0}},specularmap:{specularMap:{value:null},specularMapTransform:{value:new Yt}},envmap:{envMap:{value:null},flipEnvMap:{value:-1},reflectivity:{value:1},ior:{value:1.5},refractionRatio:{value:.98}},aomap:{aoMap:{value:null},aoMapIntensity:{value:1},aoMapTransform:{value:new Yt}},lightmap:{lightMap:{value:null},lightMapIntensity:{value:1},lightMapTransform:{value:new Yt}},bumpmap:{bumpMap:{value:null},bumpMapTransform:{value:new Yt},bumpScale:{value:1}},normalmap:{normalMap:{value:null},normalMapTransform:{value:new Yt},normalScale:{value:new St(1,1)}},displacementmap:{displacementMap:{value:null},displacementMapTransform:{value:new Yt},displacementScale:{value:1},displacementBias:{value:0}},emissivemap:{emissiveMap:{value:null},emissiveMapTransform:{value:new Yt}},metalnessmap:{metalnessMap:{value:null},metalnessMapTransform:{value:new Yt}},roughnessmap:{roughnessMap:{value:null},roughnessMapTransform:{value:new Yt}},gradientmap:{gradientMap:{value:null}},fog:{fogDensity:{value:25e-5},fogNear:{value:1},fogFar:{value:2e3},fogColor:{value:new xt(16777215)}},lights:{ambientLightColor:{value:[]},lightProbe:{value:[]},directionalLights:{value:[],properties:{direction:{},color:{}}},directionalLightShadows:{value:[],properties:{shadowBias:{},shadowNormalBias:{},shadowRadius:{},shadowMapSize:{}}},directionalShadowMap:{value:[]},directionalShadowMatrix:{value:[]},spotLights:{value:[],properties:{color:{},position:{},direction:{},distance:{},coneCos:{},penumbraCos:{},decay:{}}},spotLightShadows:{value:[],properties:{shadowBias:{},shadowNormalBias:{},shadowRadius:{},shadowMapSize:{}}},spotLightMap:{value:[]},spotShadowMap:{value:[]},spotLightMatrix:{value:[]},pointLights:{value:[],properties:{color:{},position:{},decay:{},distance:{}}},pointLightShadows:{value:[],properties:{shadowBias:{},shadowNormalBias:{},shadowRadius:{},shadowMapSize:{},shadowCameraNear:{},shadowCameraFar:{}}},pointShadowMap:{value:[]},pointShadowMatrix:{value:[]},hemisphereLights:{value:[],properties:{direction:{},skyColor:{},groundColor:{}}},rectAreaLights:{value:[],properties:{color:{},position:{},width:{},height:{}}},ltc_1:{value:null},ltc_2:{value:null}},points:{diffuse:{value:new xt(16777215)},opacity:{value:1},size:{value:1},scale:{value:1},map:{value:null},alphaMap:{value:null},alphaMapTransform:{value:new Yt},alphaTest:{value:0},uvTransform:{value:new Yt}},sprite:{diffuse:{value:new xt(16777215)},opacity:{value:1},center:{value:new St(.5,.5)},rotation:{value:0},map:{value:null},mapTransform:{value:new Yt},alphaMap:{value:null},alphaMapTransform:{value:new Yt},alphaTest:{value:0}}},Vn={basic:{uniforms:Qe([ft.common,ft.specularmap,ft.envmap,ft.aomap,ft.lightmap,ft.fog]),vertexShader:Gt.meshbasic_vert,fragmentShader:Gt.meshbasic_frag},lambert:{uniforms:Qe([ft.common,ft.specularmap,ft.envmap,ft.aomap,ft.lightmap,ft.emissivemap,ft.bumpmap,ft.normalmap,ft.displacementmap,ft.fog,ft.lights,{emissive:{value:new xt(0)}}]),vertexShader:Gt.meshlambert_vert,fragmentShader:Gt.meshlambert_frag},phong:{uniforms:Qe([ft.common,ft.specularmap,ft.envmap,ft.aomap,ft.lightmap,ft.emissivemap,ft.bumpmap,ft.normalmap,ft.displacementmap,ft.fog,ft.lights,{emissive:{value:new xt(0)},specular:{value:new xt(1118481)},shininess:{value:30}}]),vertexShader:Gt.meshphong_vert,fragmentShader:Gt.meshphong_frag},standard:{uniforms:Qe([ft.common,ft.envmap,ft.aomap,ft.lightmap,ft.emissivemap,ft.bumpmap,ft.normalmap,ft.displacementmap,ft.roughnessmap,ft.metalnessmap,ft.fog,ft.lights,{emissive:{value:new xt(0)},roughness:{value:1},metalness:{value:0},envMapIntensity:{value:1}}]),vertexShader:Gt.meshphysical_vert,fragmentShader:Gt.meshphysical_frag},toon:{uniforms:Qe([ft.common,ft.aomap,ft.lightmap,ft.emissivemap,ft.bumpmap,ft.normalmap,ft.displacementmap,ft.gradientmap,ft.fog,ft.lights,{emissive:{value:new xt(0)}}]),vertexShader:Gt.meshtoon_vert,fragmentShader:Gt.meshtoon_frag},matcap:{uniforms:Qe([ft.common,ft.bumpmap,ft.normalmap,ft.displacementmap,ft.fog,{matcap:{value:null}}]),vertexShader:Gt.meshmatcap_vert,fragmentShader:Gt.meshmatcap_frag},points:{uniforms:Qe([ft.points,ft.fog]),vertexShader:Gt.points_vert,fragmentShader:Gt.points_frag},dashed:{uniforms:Qe([ft.common,ft.fog,{scale:{value:1},dashSize:{value:1},totalSize:{value:2}}]),vertexShader:Gt.linedashed_vert,fragmentShader:Gt.linedashed_frag},depth:{uniforms:Qe([ft.common,ft.displacementmap]),vertexShader:Gt.depth_vert,fragmentShader:Gt.depth_frag},normal:{uniforms:Qe([ft.common,ft.bumpmap,ft.normalmap,ft.displacementmap,{opacity:{value:1}}]),vertexShader:Gt.meshnormal_vert,fragmentShader:Gt.meshnormal_frag},sprite:{uniforms:Qe([ft.sprite,ft.fog]),vertexShader:Gt.sprite_vert,fragmentShader:Gt.sprite_frag},background:{uniforms:{uvTransform:{value:new Yt},t2D:{value:null},backgroundIntensity:{value:1}},vertexShader:Gt.background_vert,fragmentShader:Gt.background_frag},backgroundCube:{uniforms:{envMap:{value:null},flipEnvMap:{value:-1},backgroundBlurriness:{value:0},backgroundIntensity:{value:1}},vertexShader:Gt.backgroundCube_vert,fragmentShader:Gt.backgroundCube_frag},cube:{uniforms:{tCube:{value:null},tFlip:{value:-1},opacity:{value:1}},vertexShader:Gt.cube_vert,fragmentShader:Gt.cube_frag},equirect:{uniforms:{tEquirect:{value:null}},vertexShader:Gt.equirect_vert,fragmentShader:Gt.equirect_frag},distanceRGBA:{uniforms:Qe([ft.common,ft.displacementmap,{referencePosition:{value:new L},nearDistance:{value:1},farDistance:{value:1e3}}]),vertexShader:Gt.distanceRGBA_vert,fragmentShader:Gt.distanceRGBA_frag},shadow:{uniforms:Qe([ft.lights,ft.fog,{color:{value:new xt(0)},opacity:{value:1}}]),vertexShader:Gt.shadow_vert,fragmentShader:Gt.shadow_frag}};Vn.physical={uniforms:Qe([Vn.standard.uniforms,{clearcoat:{value:0},clearcoatMap:{value:null},clearcoatMapTransform:{value:new Yt},clearcoatNormalMap:{value:null},clearcoatNormalMapTransform:{value:new Yt},clearcoatNormalScale:{value:new St(1,1)},clearcoatRoughness:{value:0},clearcoatRoughnessMap:{value:null},clearcoatRoughnessMapTransform:{value:new Yt},iridescence:{value:0},iridescenceMap:{value:null},iridescenceMapTransform:{value:new Yt},iridescenceIOR:{value:1.3},iridescenceThicknessMinimum:{value:100},iridescenceThicknessMaximum:{value:400},iridescenceThicknessMap:{value:null},iridescenceThicknessMapTransform:{value:new Yt},sheen:{value:0},sheenColor:{value:new xt(0)},sheenColorMap:{value:null},sheenColorMapTransform:{value:new Yt},sheenRoughness:{value:1},sheenRoughnessMap:{value:null},sheenRoughnessMapTransform:{value:new Yt},transmission:{value:0},transmissionMap:{value:null},transmissionMapTransform:{value:new Yt},transmissionSamplerSize:{value:new St},transmissionSamplerMap:{value:null},thickness:{value:0},thicknessMap:{value:null},thicknessMapTransform:{value:new Yt},attenuationDistance:{value:0},attenuationColor:{value:new xt(0)},specularColor:{value:new xt(1,1,1)},specularColorMap:{value:null},specularColorMapTransform:{value:new Yt},specularIntensity:{value:1},specularIntensityMap:{value:null},specularIntensityMapTransform:{value:new Yt},anisotropyVector:{value:new St},anisotropyMap:{value:null},anisotropyMapTransform:{value:new Yt}}]),vertexShader:Gt.meshphysical_vert,fragmentShader:Gt.meshphysical_frag};const Fo={r:0,b:0,g:0};function z_(n,t,e,i,s,r,o){const a=new xt(0);let l=r===!0?0:1,c,h,u=null,d=0,f=null;function g(m,p){let v=!1,x=p.isScene===!0?p.background:null;x&&x.isTexture&&(x=(p.backgroundBlurriness>0?e:t).get(x)),x===null?_(a,l):x&&x.isColor&&(_(x,1),v=!0);const y=n.xr.getEnvironmentBlendMode();y==="additive"?i.buffers.color.setClear(0,0,0,1,o):y==="alpha-blend"&&i.buffers.color.setClear(0,0,0,0,o),(n.autoClear||v)&&n.clear(n.autoClearColor,n.autoClearDepth,n.autoClearStencil),x&&(x.isCubeTexture||x.mapping===oo)?(h===void 0&&(h=new Kt(new Qi(1,1,1),new an({name:"BackgroundCubeMaterial",uniforms:Hs(Vn.backgroundCube.uniforms),vertexShader:Vn.backgroundCube.vertexShader,fragmentShader:Vn.backgroundCube.fragmentShader,side:sn,depthTest:!1,depthWrite:!1,fog:!1})),h.geometry.deleteAttribute("normal"),h.geometry.deleteAttribute("uv"),h.onBeforeRender=function(b,E,S){this.matrixWorld.copyPosition(S.matrixWorld)},Object.defineProperty(h.material,"envMap",{get:function(){return this.uniforms.envMap.value}}),s.update(h)),h.material.uniforms.envMap.value=x,h.material.uniforms.flipEnvMap.value=x.isCubeTexture&&x.isRenderTargetTexture===!1?-1:1,h.material.uniforms.backgroundBlurriness.value=p.backgroundBlurriness,h.material.uniforms.backgroundIntensity.value=p.backgroundIntensity,h.material.toneMapped=se.getTransfer(x.colorSpace)!==he,(u!==x||d!==x.version||f!==n.toneMapping)&&(h.material.needsUpdate=!0,u=x,d=x.version,f=n.toneMapping),h.layers.enableAll(),m.unshift(h,h.geometry,h.material,0,0,null)):x&&x.isTexture&&(c===void 0&&(c=new Kt(new _r(2,2),new an({name:"BackgroundMaterial",uniforms:Hs(Vn.background.uniforms),vertexShader:Vn.background.vertexShader,fragmentShader:Vn.background.fragmentShader,side:yi,depthTest:!1,depthWrite:!1,fog:!1})),c.geometry.deleteAttribute("normal"),Object.defineProperty(c.material,"map",{get:function(){return this.uniforms.t2D.value}}),s.update(c)),c.material.uniforms.t2D.value=x,c.material.uniforms.backgroundIntensity.value=p.backgroundIntensity,c.material.toneMapped=se.getTransfer(x.colorSpace)!==he,x.matrixAutoUpdate===!0&&x.updateMatrix(),c.material.uniforms.uvTransform.value.copy(x.matrix),(u!==x||d!==x.version||f!==n.toneMapping)&&(c.material.needsUpdate=!0,u=x,d=x.version,f=n.toneMapping),c.layers.enableAll(),m.unshift(c,c.geometry,c.material,0,0,null))}function _(m,p){m.getRGB(Fo,wu(n)),i.buffers.color.setClear(Fo.r,Fo.g,Fo.b,p,o)}return{getClearColor:function(){return a},setClearColor:function(m,p=1){a.set(m),l=p,_(a,l)},getClearAlpha:function(){return l},setClearAlpha:function(m){l=m,_(a,l)},render:g}}function H_(n,t,e,i){const s=n.getParameter(n.MAX_VERTEX_ATTRIBS),r=i.isWebGL2?null:t.get("OES_vertex_array_object"),o=i.isWebGL2||r!==null,a={},l=m(null);let c=l,h=!1;function u(D,F,V,$,K){let Y=!1;if(o){const Q=_($,V,F);c!==Q&&(c=Q,f(c.object)),Y=p(D,$,V,K),Y&&v(D,$,V,K)}else{const Q=F.wireframe===!0;(c.geometry!==$.id||c.program!==V.id||c.wireframe!==Q)&&(c.geometry=$.id,c.program=V.id,c.wireframe=Q,Y=!0)}K!==null&&e.update(K,n.ELEMENT_ARRAY_BUFFER),(Y||h)&&(h=!1,C(D,F,V,$),K!==null&&n.bindBuffer(n.ELEMENT_ARRAY_BUFFER,e.get(K).buffer))}function d(){return i.isWebGL2?n.createVertexArray():r.createVertexArrayOES()}function f(D){return i.isWebGL2?n.bindVertexArray(D):r.bindVertexArrayOES(D)}function g(D){return i.isWebGL2?n.deleteVertexArray(D):r.deleteVertexArrayOES(D)}function _(D,F,V){const $=V.wireframe===!0;let K=a[D.id];K===void 0&&(K={},a[D.id]=K);let Y=K[F.id];Y===void 0&&(Y={},K[F.id]=Y);let Q=Y[$];return Q===void 0&&(Q=m(d()),Y[$]=Q),Q}function m(D){const F=[],V=[],$=[];for(let K=0;K<s;K++)F[K]=0,V[K]=0,$[K]=0;return{geometry:null,program:null,wireframe:!1,newAttributes:F,enabledAttributes:V,attributeDivisors:$,object:D,attributes:{},index:null}}function p(D,F,V,$){const K=c.attributes,Y=F.attributes;let Q=0;const et=V.getAttributes();for(const pt in et)if(et[pt].location>=0){const J=K[pt];let ct=Y[pt];if(ct===void 0&&(pt==="instanceMatrix"&&D.instanceMatrix&&(ct=D.instanceMatrix),pt==="instanceColor"&&D.instanceColor&&(ct=D.instanceColor)),J===void 0||J.attribute!==ct||ct&&J.data!==ct.data)return!0;Q++}return c.attributesNum!==Q||c.index!==$}function v(D,F,V,$){const K={},Y=F.attributes;let Q=0;const et=V.getAttributes();for(const pt in et)if(et[pt].location>=0){let J=Y[pt];J===void 0&&(pt==="instanceMatrix"&&D.instanceMatrix&&(J=D.instanceMatrix),pt==="instanceColor"&&D.instanceColor&&(J=D.instanceColor));const ct={};ct.attribute=J,J&&J.data&&(ct.data=J.data),K[pt]=ct,Q++}c.attributes=K,c.attributesNum=Q,c.index=$}function x(){const D=c.newAttributes;for(let F=0,V=D.length;F<V;F++)D[F]=0}function y(D){b(D,0)}function b(D,F){const V=c.newAttributes,$=c.enabledAttributes,K=c.attributeDivisors;V[D]=1,$[D]===0&&(n.enableVertexAttribArray(D),$[D]=1),K[D]!==F&&((i.isWebGL2?n:t.get("ANGLE_instanced_arrays"))[i.isWebGL2?"vertexAttribDivisor":"vertexAttribDivisorANGLE"](D,F),K[D]=F)}function E(){const D=c.newAttributes,F=c.enabledAttributes;for(let V=0,$=F.length;V<$;V++)F[V]!==D[V]&&(n.disableVertexAttribArray(V),F[V]=0)}function S(D,F,V,$,K,Y,Q){Q===!0?n.vertexAttribIPointer(D,F,V,K,Y):n.vertexAttribPointer(D,F,V,$,K,Y)}function C(D,F,V,$){if(i.isWebGL2===!1&&(D.isInstancedMesh||$.isInstancedBufferGeometry)&&t.get("ANGLE_instanced_arrays")===null)return;x();const K=$.attributes,Y=V.getAttributes(),Q=F.defaultAttributeValues;for(const et in Y){const pt=Y[et];if(pt.location>=0){let B=K[et];if(B===void 0&&(et==="instanceMatrix"&&D.instanceMatrix&&(B=D.instanceMatrix),et==="instanceColor"&&D.instanceColor&&(B=D.instanceColor)),B!==void 0){const J=B.normalized,ct=B.itemSize,vt=e.get(B);if(vt===void 0)continue;const Tt=vt.buffer,Ft=vt.type,Nt=vt.bytesPerElement,Lt=i.isWebGL2===!0&&(Ft===n.INT||Ft===n.UNSIGNED_INT||B.gpuType===xh);if(B.isInterleavedBufferAttribute){const Jt=B.data,G=Jt.stride,Be=B.offset;if(Jt.isInstancedInterleavedBuffer){for(let Rt=0;Rt<pt.locationSize;Rt++)b(pt.location+Rt,Jt.meshPerAttribute);D.isInstancedMesh!==!0&&$._maxInstanceCount===void 0&&($._maxInstanceCount=Jt.meshPerAttribute*Jt.count)}else for(let Rt=0;Rt<pt.locationSize;Rt++)y(pt.location+Rt);n.bindBuffer(n.ARRAY_BUFFER,Tt);for(let Rt=0;Rt<pt.locationSize;Rt++)S(pt.location+Rt,ct/pt.locationSize,Ft,J,G*Nt,(Be+ct/pt.locationSize*Rt)*Nt,Lt)}else{if(B.isInstancedBufferAttribute){for(let Jt=0;Jt<pt.locationSize;Jt++)b(pt.location+Jt,B.meshPerAttribute);D.isInstancedMesh!==!0&&$._maxInstanceCount===void 0&&($._maxInstanceCount=B.meshPerAttribute*B.count)}else for(let Jt=0;Jt<pt.locationSize;Jt++)y(pt.location+Jt);n.bindBuffer(n.ARRAY_BUFFER,Tt);for(let Jt=0;Jt<pt.locationSize;Jt++)S(pt.location+Jt,ct/pt.locationSize,Ft,J,ct*Nt,ct/pt.locationSize*Jt*Nt,Lt)}}else if(Q!==void 0){const J=Q[et];if(J!==void 0)switch(J.length){case 2:n.vertexAttrib2fv(pt.location,J);break;case 3:n.vertexAttrib3fv(pt.location,J);break;case 4:n.vertexAttrib4fv(pt.location,J);break;default:n.vertexAttrib1fv(pt.location,J)}}}}E()}function M(){O();for(const D in a){const F=a[D];for(const V in F){const $=F[V];for(const K in $)g($[K].object),delete $[K];delete F[V]}delete a[D]}}function w(D){if(a[D.id]===void 0)return;const F=a[D.id];for(const V in F){const $=F[V];for(const K in $)g($[K].object),delete $[K];delete F[V]}delete a[D.id]}function U(D){for(const F in a){const V=a[F];if(V[D.id]===void 0)continue;const $=V[D.id];for(const K in $)g($[K].object),delete $[K];delete V[D.id]}}function O(){Z(),h=!0,c!==l&&(c=l,f(c.object))}function Z(){l.geometry=null,l.program=null,l.wireframe=!1}return{setup:u,reset:O,resetDefaultState:Z,dispose:M,releaseStatesOfGeometry:w,releaseStatesOfProgram:U,initAttributes:x,enableAttribute:y,disableUnusedAttributes:E}}function V_(n,t,e,i){const s=i.isWebGL2;let r;function o(h){r=h}function a(h,u){n.drawArrays(r,h,u),e.update(u,r,1)}function l(h,u,d){if(d===0)return;let f,g;if(s)f=n,g="drawArraysInstanced";else if(f=t.get("ANGLE_instanced_arrays"),g="drawArraysInstancedANGLE",f===null){console.error("THREE.WebGLBufferRenderer: using THREE.InstancedBufferGeometry but hardware does not support extension ANGLE_instanced_arrays.");return}f[g](r,h,u,d),e.update(u,r,d)}function c(h,u,d){if(d===0)return;const f=t.get("WEBGL_multi_draw");if(f===null)for(let g=0;g<d;g++)this.render(h[g],u[g]);else{f.multiDrawArraysWEBGL(r,h,0,u,0,d);let g=0;for(let _=0;_<d;_++)g+=u[_];e.update(g,r,1)}}this.setMode=o,this.render=a,this.renderInstances=l,this.renderMultiDraw=c}function G_(n,t,e){let i;function s(){if(i!==void 0)return i;if(t.has("EXT_texture_filter_anisotropic")===!0){const S=t.get("EXT_texture_filter_anisotropic");i=n.getParameter(S.MAX_TEXTURE_MAX_ANISOTROPY_EXT)}else i=0;return i}function r(S){if(S==="highp"){if(n.getShaderPrecisionFormat(n.VERTEX_SHADER,n.HIGH_FLOAT).precision>0&&n.getShaderPrecisionFormat(n.FRAGMENT_SHADER,n.HIGH_FLOAT).precision>0)return"highp";S="mediump"}return S==="mediump"&&n.getShaderPrecisionFormat(n.VERTEX_SHADER,n.MEDIUM_FLOAT).precision>0&&n.getShaderPrecisionFormat(n.FRAGMENT_SHADER,n.MEDIUM_FLOAT).precision>0?"mediump":"lowp"}const o=typeof WebGL2RenderingContext<"u"&&n.constructor.name==="WebGL2RenderingContext";let a=e.precision!==void 0?e.precision:"highp";const l=r(a);l!==a&&(console.warn("THREE.WebGLRenderer:",a,"not supported, using",l,"instead."),a=l);const c=o||t.has("WEBGL_draw_buffers"),h=e.logarithmicDepthBuffer===!0,u=n.getParameter(n.MAX_TEXTURE_IMAGE_UNITS),d=n.getParameter(n.MAX_VERTEX_TEXTURE_IMAGE_UNITS),f=n.getParameter(n.MAX_TEXTURE_SIZE),g=n.getParameter(n.MAX_CUBE_MAP_TEXTURE_SIZE),_=n.getParameter(n.MAX_VERTEX_ATTRIBS),m=n.getParameter(n.MAX_VERTEX_UNIFORM_VECTORS),p=n.getParameter(n.MAX_VARYING_VECTORS),v=n.getParameter(n.MAX_FRAGMENT_UNIFORM_VECTORS),x=d>0,y=o||t.has("OES_texture_float"),b=x&&y,E=o?n.getParameter(n.MAX_SAMPLES):0;return{isWebGL2:o,drawBuffers:c,getMaxAnisotropy:s,getMaxPrecision:r,precision:a,logarithmicDepthBuffer:h,maxTextures:u,maxVertexTextures:d,maxTextureSize:f,maxCubemapSize:g,maxAttributes:_,maxVertexUniforms:m,maxVaryings:p,maxFragmentUniforms:v,vertexTextures:x,floatFragmentTextures:y,floatVertexTextures:b,maxSamples:E}}function W_(n){const t=this;let e=null,i=0,s=!1,r=!1;const o=new Di,a=new Yt,l={value:null,needsUpdate:!1};this.uniform=l,this.numPlanes=0,this.numIntersection=0,this.init=function(u,d){const f=u.length!==0||d||i!==0||s;return s=d,i=u.length,f},this.beginShadows=function(){r=!0,h(null)},this.endShadows=function(){r=!1},this.setGlobalState=function(u,d){e=h(u,d,0)},this.setState=function(u,d,f){const g=u.clippingPlanes,_=u.clipIntersection,m=u.clipShadows,p=n.get(u);if(!s||g===null||g.length===0||r&&!m)r?h(null):c();else{const v=r?0:i,x=v*4;let y=p.clippingState||null;l.value=y,y=h(g,d,x,f);for(let b=0;b!==x;++b)y[b]=e[b];p.clippingState=y,this.numIntersection=_?this.numPlanes:0,this.numPlanes+=v}};function c(){l.value!==e&&(l.value=e,l.needsUpdate=i>0),t.numPlanes=i,t.numIntersection=0}function h(u,d,f,g){const _=u!==null?u.length:0;let m=null;if(_!==0){if(m=l.value,g!==!0||m===null){const p=f+_*4,v=d.matrixWorldInverse;a.getNormalMatrix(v),(m===null||m.length<p)&&(m=new Float32Array(p));for(let x=0,y=f;x!==_;++x,y+=4)o.copy(u[x]).applyMatrix4(v,a),o.normal.toArray(m,y),m[y+3]=o.constant}l.value=m,l.needsUpdate=!0}return t.numPlanes=_,t.numIntersection=0,m}}function X_(n){let t=new WeakMap;function e(o,a){return a===Ya?o.mapping=ys:a===qa&&(o.mapping=Ss),o}function i(o){if(o&&o.isTexture){const a=o.mapping;if(a===Ya||a===qa)if(t.has(o)){const l=t.get(o).texture;return e(l,o.mapping)}else{const l=o.image;if(l&&l.height>0){const c=new Ng(l.height/2);return c.fromEquirectangularTexture(n,o),t.set(o,c),o.addEventListener("dispose",s),e(c.texture,o.mapping)}else return null}}return o}function s(o){const a=o.target;a.removeEventListener("dispose",s);const l=t.get(a);l!==void 0&&(t.delete(a),l.dispose())}function r(){t=new WeakMap}return{get:i,dispose:r}}class Cl extends Au{constructor(t=-1,e=1,i=1,s=-1,r=.1,o=2e3){super(),this.isOrthographicCamera=!0,this.type="OrthographicCamera",this.zoom=1,this.view=null,this.left=t,this.right=e,this.top=i,this.bottom=s,this.near=r,this.far=o,this.updateProjectionMatrix()}copy(t,e){return super.copy(t,e),this.left=t.left,this.right=t.right,this.top=t.top,this.bottom=t.bottom,this.near=t.near,this.far=t.far,this.zoom=t.zoom,this.view=t.view===null?null:Object.assign({},t.view),this}setViewOffset(t,e,i,s,r,o){this.view===null&&(this.view={enabled:!0,fullWidth:1,fullHeight:1,offsetX:0,offsetY:0,width:1,height:1}),this.view.enabled=!0,this.view.fullWidth=t,this.view.fullHeight=e,this.view.offsetX=i,this.view.offsetY=s,this.view.width=r,this.view.height=o,this.updateProjectionMatrix()}clearViewOffset(){this.view!==null&&(this.view.enabled=!1),this.updateProjectionMatrix()}updateProjectionMatrix(){const t=(this.right-this.left)/(2*this.zoom),e=(this.top-this.bottom)/(2*this.zoom),i=(this.right+this.left)/2,s=(this.top+this.bottom)/2;let r=i-t,o=i+t,a=s+e,l=s-e;if(this.view!==null&&this.view.enabled){const c=(this.right-this.left)/this.view.fullWidth/this.zoom,h=(this.top-this.bottom)/this.view.fullHeight/this.zoom;r+=c*this.view.offsetX,o=r+c*this.view.width,a-=h*this.view.offsetY,l=a-h*this.view.height}this.projectionMatrix.makeOrthographic(r,o,a,l,this.near,this.far,this.coordinateSystem),this.projectionMatrixInverse.copy(this.projectionMatrix).invert()}toJSON(t){const e=super.toJSON(t);return e.object.zoom=this.zoom,e.object.left=this.left,e.object.right=this.right,e.object.top=this.top,e.object.bottom=this.bottom,e.object.near=this.near,e.object.far=this.far,this.view!==null&&(e.object.view=Object.assign({},this.view)),e}}const Ws=4,Pu=[.125,.215,.35,.446,.526,.582],es=20,Rl=new Cl,Lu=new xt;let Pl=null,Ll=0,Dl=0;const ns=(1+Math.sqrt(5))/2,Xs=1/ns,Du=[new L(1,1,1),new L(-1,1,1),new L(1,1,-1),new L(-1,1,-1),new L(0,ns,Xs),new L(0,ns,-Xs),new L(Xs,0,ns),new L(-Xs,0,ns),new L(ns,Xs,0),new L(-ns,Xs,0)];class Iu{constructor(t){this._renderer=t,this._pingPongRenderTarget=null,this._lodMax=0,this._cubeSize=0,this._lodPlanes=[],this._sizeLods=[],this._sigmas=[],this._blurMaterial=null,this._cubemapMaterial=null,this._equirectMaterial=null,this._compileMaterial(this._blurMaterial)}fromScene(t,e=0,i=.1,s=100){Pl=this._renderer.getRenderTarget(),Ll=this._renderer.getActiveCubeFace(),Dl=this._renderer.getActiveMipmapLevel(),this._setSize(256);const r=this._allocateTargets();return r.depthBuffer=!0,this._sceneToCubeUV(t,i,s,r),e>0&&this._blur(r,0,0,e),this._applyPMREM(r),this._cleanup(r),r}fromEquirectangular(t,e=null){return this._fromTexture(t,e)}fromCubemap(t,e=null){return this._fromTexture(t,e)}compileCubemapShader(){this._cubemapMaterial===null&&(this._cubemapMaterial=Fu(),this._compileMaterial(this._cubemapMaterial))}compileEquirectangularShader(){this._equirectMaterial===null&&(this._equirectMaterial=Uu(),this._compileMaterial(this._equirectMaterial))}dispose(){this._dispose(),this._cubemapMaterial!==null&&this._cubemapMaterial.dispose(),this._equirectMaterial!==null&&this._equirectMaterial.dispose()}_setSize(t){this._lodMax=Math.floor(Math.log2(t)),this._cubeSize=Math.pow(2,this._lodMax)}_dispose(){this._blurMaterial!==null&&this._blurMaterial.dispose(),this._pingPongRenderTarget!==null&&this._pingPongRenderTarget.dispose();for(let t=0;t<this._lodPlanes.length;t++)this._lodPlanes[t].dispose()}_cleanup(t){this._renderer.setRenderTarget(Pl,Ll,Dl),t.scissorTest=!1,No(t,0,0,t.width,t.height)}_fromTexture(t,e){t.mapping===ys||t.mapping===Ss?this._setSize(t.image.length===0?16:t.image[0].width||t.image[0].image.width):this._setSize(t.image.width/4),Pl=this._renderer.getRenderTarget(),Ll=this._renderer.getActiveCubeFace(),Dl=this._renderer.getActiveMipmapLevel();const i=e||this._allocateTargets();return this._textureToCubeUV(t,i),this._applyPMREM(i),this._cleanup(i),i}_allocateTargets(){const t=3*Math.max(this._cubeSize,112),e=4*this._cubeSize,i={magFilter:Mn,minFilter:Mn,generateMipmaps:!1,type:ii,format:In,colorSpace:si,depthBuffer:!1},s=Ou(t,e,i);if(this._pingPongRenderTarget===null||this._pingPongRenderTarget.width!==t||this._pingPongRenderTarget.height!==e){this._pingPongRenderTarget!==null&&this._dispose(),this._pingPongRenderTarget=Ou(t,e,i);const{_lodMax:r}=this;({sizeLods:this._sizeLods,lodPlanes:this._lodPlanes,sigmas:this._sigmas}=j_(r)),this._blurMaterial=Y_(r,t,e)}return s}_compileMaterial(t){const e=new Kt(this._lodPlanes[0],t);this._renderer.compile(e,Rl)}_sceneToCubeUV(t,e,i,s){const a=new An(90,1,e,i),l=[1,-1,1,1,1,1],c=[1,1,1,-1,-1,-1],h=this._renderer,u=h.autoClear,d=h.toneMapping;h.getClearColor(Lu),h.toneMapping=Si,h.autoClear=!1;const f=new on({name:"PMREM.Background",side:sn,depthWrite:!1,depthTest:!1}),g=new Kt(new Qi,f);let _=!1;const m=t.background;m?m.isColor&&(f.color.copy(m),t.background=null,_=!0):(f.color.copy(Lu),_=!0);for(let p=0;p<6;p++){const v=p%3;v===0?(a.up.set(0,l[p],0),a.lookAt(c[p],0,0)):v===1?(a.up.set(0,0,l[p]),a.lookAt(0,c[p],0)):(a.up.set(0,l[p],0),a.lookAt(0,0,c[p]));const x=this._cubeSize;No(s,v*x,p>2?x:0,x,x),h.setRenderTarget(s),_&&h.render(g,a),h.render(t,a)}g.geometry.dispose(),g.material.dispose(),h.toneMapping=d,h.autoClear=u,t.background=m}_textureToCubeUV(t,e){const i=this._renderer,s=t.mapping===ys||t.mapping===Ss;s?(this._cubemapMaterial===null&&(this._cubemapMaterial=Fu()),this._cubemapMaterial.uniforms.flipEnvMap.value=t.isRenderTargetTexture===!1?-1:1):this._equirectMaterial===null&&(this._equirectMaterial=Uu());const r=s?this._cubemapMaterial:this._equirectMaterial,o=new Kt(this._lodPlanes[0],r),a=r.uniforms;a.envMap.value=t;const l=this._cubeSize;No(e,0,0,3*l,2*l),i.setRenderTarget(e),i.render(o,Rl)}_applyPMREM(t){const e=this._renderer,i=e.autoClear;e.autoClear=!1;for(let s=1;s<this._lodPlanes.length;s++){const r=Math.sqrt(this._sigmas[s]*this._sigmas[s]-this._sigmas[s-1]*this._sigmas[s-1]),o=Du[(s-1)%Du.length];this._blur(t,s-1,s,r,o)}e.autoClear=i}_blur(t,e,i,s,r){const o=this._pingPongRenderTarget;this._halfBlur(t,o,e,i,s,"latitudinal",r),this._halfBlur(o,t,i,i,s,"longitudinal",r)}_halfBlur(t,e,i,s,r,o,a){const l=this._renderer,c=this._blurMaterial;o!=="latitudinal"&&o!=="longitudinal"&&console.error("blur direction must be either latitudinal or longitudinal!");const h=3,u=new Kt(this._lodPlanes[s],c),d=c.uniforms,f=this._sizeLods[i]-1,g=isFinite(r)?Math.PI/(2*f):2*Math.PI/(2*es-1),_=r/g,m=isFinite(r)?1+Math.floor(h*_):es;m>es&&console.warn(`sigmaRadians, ${r}, is too large and will clip, as it requested ${m} samples when the maximum is set to ${es}`);const p=[];let v=0;for(let S=0;S<es;++S){const C=S/_,M=Math.exp(-C*C/2);p.push(M),S===0?v+=M:S<m&&(v+=2*M)}for(let S=0;S<p.length;S++)p[S]=p[S]/v;d.envMap.value=t.texture,d.samples.value=m,d.weights.value=p,d.latitudinal.value=o==="latitudinal",a&&(d.poleAxis.value=a);const{_lodMax:x}=this;d.dTheta.value=g,d.mipInt.value=x-i;const y=this._sizeLods[s],b=3*y*(s>x-Ws?s-x+Ws:0),E=4*(this._cubeSize-y);No(e,b,E,3*y,2*y),l.setRenderTarget(e),l.render(u,Rl)}}function j_(n){const t=[],e=[],i=[];let s=n;const r=n-Ws+1+Pu.length;for(let o=0;o<r;o++){const a=Math.pow(2,s);e.push(a);let l=1/a;o>n-Ws?l=Pu[o-n+Ws-1]:o===0&&(l=0),i.push(l);const c=1/(a-2),h=-c,u=1+c,d=[h,h,u,h,u,u,h,h,u,u,h,u],f=6,g=6,_=3,m=2,p=1,v=new Float32Array(_*g*f),x=new Float32Array(m*g*f),y=new Float32Array(p*g*f);for(let E=0;E<f;E++){const S=E%3*2/3-1,C=E>2?0:-1,M=[S,C,0,S+2/3,C,0,S+2/3,C+1,0,S,C,0,S+2/3,C+1,0,S,C+1,0];v.set(M,_*g*E),x.set(d,m*g*E);const w=[E,E,E,E,E,E];y.set(w,p*g*E)}const b=new Ce;b.setAttribute("position",new Tn(v,_)),b.setAttribute("uv",new Tn(x,m)),b.setAttribute("faceIndex",new Tn(y,p)),t.push(b),s>Ws&&s--}return{lodPlanes:t,sizeLods:e,sigmas:i}}function Ou(n,t,e){const i=new On(n,t,e);return i.texture.mapping=oo,i.texture.name="PMREM.cubeUv",i.scissorTest=!0,i}function No(n,t,e,i,s){n.viewport.set(t,e,i,s),n.scissor.set(t,e,i,s)}function Y_(n,t,e){const i=new Float32Array(es),s=new L(0,1,0);return new an({name:"SphericalGaussianBlur",defines:{n:es,CUBEUV_TEXEL_WIDTH:1/t,CUBEUV_TEXEL_HEIGHT:1/e,CUBEUV_MAX_MIP:`${n}.0`},uniforms:{envMap:{value:null},samples:{value:1},weights:{value:i},latitudinal:{value:!1},dTheta:{value:0},mipInt:{value:0},poleAxis:{value:s}},vertexShader:Il(),fragmentShader:`

			precision mediump float;
			precision mediump int;

			varying vec3 vOutputDirection;

			uniform sampler2D envMap;
			uniform int samples;
			uniform float weights[ n ];
			uniform bool latitudinal;
			uniform float dTheta;
			uniform float mipInt;
			uniform vec3 poleAxis;

			#define ENVMAP_TYPE_CUBE_UV
			#include <cube_uv_reflection_fragment>

			vec3 getSample( float theta, vec3 axis ) {

				float cosTheta = cos( theta );
				// Rodrigues' axis-angle rotation
				vec3 sampleDirection = vOutputDirection * cosTheta
					+ cross( axis, vOutputDirection ) * sin( theta )
					+ axis * dot( axis, vOutputDirection ) * ( 1.0 - cosTheta );

				return bilinearCubeUV( envMap, sampleDirection, mipInt );

			}

			void main() {

				vec3 axis = latitudinal ? poleAxis : cross( poleAxis, vOutputDirection );

				if ( all( equal( axis, vec3( 0.0 ) ) ) ) {

					axis = vec3( vOutputDirection.z, 0.0, - vOutputDirection.x );

				}

				axis = normalize( axis );

				gl_FragColor = vec4( 0.0, 0.0, 0.0, 1.0 );
				gl_FragColor.rgb += weights[ 0 ] * getSample( 0.0, axis );

				for ( int i = 1; i < n; i++ ) {

					if ( i >= samples ) {

						break;

					}

					float theta = dTheta * float( i );
					gl_FragColor.rgb += weights[ i ] * getSample( -1.0 * theta, axis );
					gl_FragColor.rgb += weights[ i ] * getSample( theta, axis );

				}

			}
		`,blending:ni,depthTest:!1,depthWrite:!1})}function Uu(){return new an({name:"EquirectangularToCubeUV",uniforms:{envMap:{value:null}},vertexShader:Il(),fragmentShader:`

			precision mediump float;
			precision mediump int;

			varying vec3 vOutputDirection;

			uniform sampler2D envMap;

			#include <common>

			void main() {

				vec3 outputDirection = normalize( vOutputDirection );
				vec2 uv = equirectUv( outputDirection );

				gl_FragColor = vec4( texture2D ( envMap, uv ).rgb, 1.0 );

			}
		`,blending:ni,depthTest:!1,depthWrite:!1})}function Fu(){return new an({name:"CubemapToCubeUV",uniforms:{envMap:{value:null},flipEnvMap:{value:-1}},vertexShader:Il(),fragmentShader:`

			precision mediump float;
			precision mediump int;

			uniform float flipEnvMap;

			varying vec3 vOutputDirection;

			uniform samplerCube envMap;

			void main() {

				gl_FragColor = textureCube( envMap, vec3( flipEnvMap * vOutputDirection.x, vOutputDirection.yz ) );

			}
		`,blending:ni,depthTest:!1,depthWrite:!1})}function Il(){return`

		precision mediump float;
		precision mediump int;

		attribute float faceIndex;

		varying vec3 vOutputDirection;

		// RH coordinate system; PMREM face-indexing convention
		vec3 getDirection( vec2 uv, float face ) {

			uv = 2.0 * uv - 1.0;

			vec3 direction = vec3( uv, 1.0 );

			if ( face == 0.0 ) {

				direction = direction.zyx; // ( 1, v, u ) pos x

			} else if ( face == 1.0 ) {

				direction = direction.xzy;
				direction.xz *= -1.0; // ( -u, 1, -v ) pos y

			} else if ( face == 2.0 ) {

				direction.x *= -1.0; // ( -u, v, 1 ) pos z

			} else if ( face == 3.0 ) {

				direction = direction.zyx;
				direction.xz *= -1.0; // ( -1, v, -u ) neg x

			} else if ( face == 4.0 ) {

				direction = direction.xzy;
				direction.xy *= -1.0; // ( -u, -1, v ) neg y

			} else if ( face == 5.0 ) {

				direction.z *= -1.0; // ( u, v, -1 ) neg z

			}

			return direction;

		}

		void main() {

			vOutputDirection = getDirection( uv, faceIndex );
			gl_Position = vec4( position, 1.0 );

		}
	`}function q_(n){let t=new WeakMap,e=null;function i(a){if(a&&a.isTexture){const l=a.mapping,c=l===Ya||l===qa,h=l===ys||l===Ss;if(c||h)if(a.isRenderTargetTexture&&a.needsPMREMUpdate===!0){a.needsPMREMUpdate=!1;let u=t.get(a);return e===null&&(e=new Iu(n)),u=c?e.fromEquirectangular(a,u):e.fromCubemap(a,u),t.set(a,u),u.texture}else{if(t.has(a))return t.get(a).texture;{const u=a.image;if(c&&u&&u.height>0||h&&u&&s(u)){e===null&&(e=new Iu(n));const d=c?e.fromEquirectangular(a):e.fromCubemap(a);return t.set(a,d),a.addEventListener("dispose",r),d.texture}else return null}}}return a}function s(a){let l=0;const c=6;for(let h=0;h<c;h++)a[h]!==void 0&&l++;return l===c}function r(a){const l=a.target;l.removeEventListener("dispose",r);const c=t.get(l);c!==void 0&&(t.delete(l),c.dispose())}function o(){t=new WeakMap,e!==null&&(e.dispose(),e=null)}return{get:i,dispose:o}}function $_(n){const t={};function e(i){if(t[i]!==void 0)return t[i];let s;switch(i){case"WEBGL_depth_texture":s=n.getExtension("WEBGL_depth_texture")||n.getExtension("MOZ_WEBGL_depth_texture")||n.getExtension("WEBKIT_WEBGL_depth_texture");break;case"EXT_texture_filter_anisotropic":s=n.getExtension("EXT_texture_filter_anisotropic")||n.getExtension("MOZ_EXT_texture_filter_anisotropic")||n.getExtension("WEBKIT_EXT_texture_filter_anisotropic");break;case"WEBGL_compressed_texture_s3tc":s=n.getExtension("WEBGL_compressed_texture_s3tc")||n.getExtension("MOZ_WEBGL_compressed_texture_s3tc")||n.getExtension("WEBKIT_WEBGL_compressed_texture_s3tc");break;case"WEBGL_compressed_texture_pvrtc":s=n.getExtension("WEBGL_compressed_texture_pvrtc")||n.getExtension("WEBKIT_WEBGL_compressed_texture_pvrtc");break;default:s=n.getExtension(i)}return t[i]=s,s}return{has:function(i){return e(i)!==null},init:function(i){i.isWebGL2?(e("EXT_color_buffer_float"),e("WEBGL_clip_cull_distance")):(e("WEBGL_depth_texture"),e("OES_texture_float"),e("OES_texture_half_float"),e("OES_texture_half_float_linear"),e("OES_standard_derivatives"),e("OES_element_index_uint"),e("OES_vertex_array_object"),e("ANGLE_instanced_arrays")),e("OES_texture_float_linear"),e("EXT_color_buffer_half_float"),e("WEBGL_multisampled_render_to_texture")},get:function(i){const s=e(i);return s===null&&console.warn("THREE.WebGLRenderer: "+i+" extension not supported."),s}}}function K_(n,t,e,i){const s={},r=new WeakMap;function o(u){const d=u.target;d.index!==null&&t.remove(d.index);for(const g in d.attributes)t.remove(d.attributes[g]);for(const g in d.morphAttributes){const _=d.morphAttributes[g];for(let m=0,p=_.length;m<p;m++)t.remove(_[m])}d.removeEventListener("dispose",o),delete s[d.id];const f=r.get(d);f&&(t.remove(f),r.delete(d)),i.releaseStatesOfGeometry(d),d.isInstancedBufferGeometry===!0&&delete d._maxInstanceCount,e.memory.geometries--}function a(u,d){return s[d.id]===!0||(d.addEventListener("dispose",o),s[d.id]=!0,e.memory.geometries++),d}function l(u){const d=u.attributes;for(const g in d)t.update(d[g],n.ARRAY_BUFFER);const f=u.morphAttributes;for(const g in f){const _=f[g];for(let m=0,p=_.length;m<p;m++)t.update(_[m],n.ARRAY_BUFFER)}}function c(u){const d=[],f=u.index,g=u.attributes.position;let _=0;if(f!==null){const v=f.array;_=f.version;for(let x=0,y=v.length;x<y;x+=3){const b=v[x+0],E=v[x+1],S=v[x+2];d.push(b,E,E,S,S,b)}}else if(g!==void 0){const v=g.array;_=g.version;for(let x=0,y=v.length/3-1;x<y;x+=3){const b=x+0,E=x+1,S=x+2;d.push(b,E,E,S,S,b)}}else return;const m=new(iu(d)?bu:vu)(d,1);m.version=_;const p=r.get(u);p&&t.remove(p),r.set(u,m)}function h(u){const d=r.get(u);if(d){const f=u.index;f!==null&&d.version<f.version&&c(u)}else c(u);return r.get(u)}return{get:a,update:l,getWireframeAttribute:h}}function Z_(n,t,e,i){const s=i.isWebGL2;let r;function o(f){r=f}let a,l;function c(f){a=f.type,l=f.bytesPerElement}function h(f,g){n.drawElements(r,g,a,f*l),e.update(g,r,1)}function u(f,g,_){if(_===0)return;let m,p;if(s)m=n,p="drawElementsInstanced";else if(m=t.get("ANGLE_instanced_arrays"),p="drawElementsInstancedANGLE",m===null){console.error("THREE.WebGLIndexedBufferRenderer: using THREE.InstancedBufferGeometry but hardware does not support extension ANGLE_instanced_arrays.");return}m[p](r,g,a,f*l,_),e.update(g,r,_)}function d(f,g,_){if(_===0)return;const m=t.get("WEBGL_multi_draw");if(m===null)for(let p=0;p<_;p++)this.render(f[p]/l,g[p]);else{m.multiDrawElementsWEBGL(r,g,0,a,f,0,_);let p=0;for(let v=0;v<_;v++)p+=g[v];e.update(p,r,1)}}this.setMode=o,this.setIndex=c,this.render=h,this.renderInstances=u,this.renderMultiDraw=d}function J_(n){const t={geometries:0,textures:0},e={frame:0,calls:0,triangles:0,points:0,lines:0};function i(r,o,a){switch(e.calls++,o){case n.TRIANGLES:e.triangles+=a*(r/3);break;case n.LINES:e.lines+=a*(r/2);break;case n.LINE_STRIP:e.lines+=a*(r-1);break;case n.LINE_LOOP:e.lines+=a*r;break;case n.POINTS:e.points+=a*r;break;default:console.error("THREE.WebGLInfo: Unknown draw mode:",o);break}}function s(){e.calls=0,e.triangles=0,e.points=0,e.lines=0}return{memory:t,render:e,programs:null,autoReset:!0,reset:s,update:i}}function Q_(n,t){return n[0]-t[0]}function tx(n,t){return Math.abs(t[1])-Math.abs(n[1])}function ex(n,t,e){const i={},s=new Float32Array(8),r=new WeakMap,o=new Ue,a=[];for(let c=0;c<8;c++)a[c]=[c,0];function l(c,h,u){const d=c.morphTargetInfluences;if(t.isWebGL2===!0){const f=h.morphAttributes.position||h.morphAttributes.normal||h.morphAttributes.color,g=f!==void 0?f.length:0;let _=r.get(h);if(_===void 0||_.count!==g){let D=function(){O.dispose(),r.delete(h),h.removeEventListener("dispose",D)};_!==void 0&&_.texture.dispose();const v=h.morphAttributes.position!==void 0,x=h.morphAttributes.normal!==void 0,y=h.morphAttributes.color!==void 0,b=h.morphAttributes.position||[],E=h.morphAttributes.normal||[],S=h.morphAttributes.color||[];let C=0;v===!0&&(C=1),x===!0&&(C=2),y===!0&&(C=3);let M=h.attributes.position.count*C,w=1;M>t.maxTextureSize&&(w=Math.ceil(M/t.maxTextureSize),M=t.maxTextureSize);const U=new Float32Array(M*w*4*g),O=new cu(U,M,w,g);O.type=wi,O.needsUpdate=!0;const Z=C*4;for(let F=0;F<g;F++){const V=b[F],$=E[F],K=S[F],Y=M*w*4*F;for(let Q=0;Q<V.count;Q++){const et=Q*Z;v===!0&&(o.fromBufferAttribute(V,Q),U[Y+et+0]=o.x,U[Y+et+1]=o.y,U[Y+et+2]=o.z,U[Y+et+3]=0),x===!0&&(o.fromBufferAttribute($,Q),U[Y+et+4]=o.x,U[Y+et+5]=o.y,U[Y+et+6]=o.z,U[Y+et+7]=0),y===!0&&(o.fromBufferAttribute(K,Q),U[Y+et+8]=o.x,U[Y+et+9]=o.y,U[Y+et+10]=o.z,U[Y+et+11]=K.itemSize===4?o.w:1)}}_={count:g,texture:O,size:new St(M,w)},r.set(h,_),h.addEventListener("dispose",D)}let m=0;for(let v=0;v<d.length;v++)m+=d[v];const p=h.morphTargetsRelative?1:1-m;u.getUniforms().setValue(n,"morphTargetBaseInfluence",p),u.getUniforms().setValue(n,"morphTargetInfluences",d),u.getUniforms().setValue(n,"morphTargetsTexture",_.texture,e),u.getUniforms().setValue(n,"morphTargetsTextureSize",_.size)}else{const f=d===void 0?0:d.length;let g=i[h.id];if(g===void 0||g.length!==f){g=[];for(let x=0;x<f;x++)g[x]=[x,0];i[h.id]=g}for(let x=0;x<f;x++){const y=g[x];y[0]=x,y[1]=d[x]}g.sort(tx);for(let x=0;x<8;x++)x<f&&g[x][1]?(a[x][0]=g[x][0],a[x][1]=g[x][1]):(a[x][0]=Number.MAX_SAFE_INTEGER,a[x][1]=0);a.sort(Q_);const _=h.morphAttributes.position,m=h.morphAttributes.normal;let p=0;for(let x=0;x<8;x++){const y=a[x],b=y[0],E=y[1];b!==Number.MAX_SAFE_INTEGER&&E?(_&&h.getAttribute("morphTarget"+x)!==_[b]&&h.setAttribute("morphTarget"+x,_[b]),m&&h.getAttribute("morphNormal"+x)!==m[b]&&h.setAttribute("morphNormal"+x,m[b]),s[x]=E,p+=E):(_&&h.hasAttribute("morphTarget"+x)===!0&&h.deleteAttribute("morphTarget"+x),m&&h.hasAttribute("morphNormal"+x)===!0&&h.deleteAttribute("morphNormal"+x),s[x]=0)}const v=h.morphTargetsRelative?1:1-p;u.getUniforms().setValue(n,"morphTargetBaseInfluence",v),u.getUniforms().setValue(n,"morphTargetInfluences",s)}}return{update:l}}function nx(n,t,e,i){let s=new WeakMap;function r(l){const c=i.render.frame,h=l.geometry,u=t.get(l,h);if(s.get(u)!==c&&(t.update(u),s.set(u,c)),l.isInstancedMesh&&(l.hasEventListener("dispose",a)===!1&&l.addEventListener("dispose",a),s.get(l)!==c&&(e.update(l.instanceMatrix,n.ARRAY_BUFFER),l.instanceColor!==null&&e.update(l.instanceColor,n.ARRAY_BUFFER),s.set(l,c))),l.isSkinnedMesh){const d=l.skeleton;s.get(d)!==c&&(d.update(),s.set(d,c))}return u}function o(){s=new WeakMap}function a(l){const c=l.target;c.removeEventListener("dispose",a),e.remove(c.instanceMatrix),c.instanceColor!==null&&e.remove(c.instanceColor)}return{update:r,dispose:o}}class Nu extends fn{constructor(t,e,i,s,r,o,a,l,c,h){if(h=h!==void 0?h:ji,h!==ji&&h!==Es)throw new Error("DepthTexture format must be either THREE.DepthFormat or THREE.DepthStencilFormat");i===void 0&&h===ji&&(i=Ti),i===void 0&&h===Es&&(i=Xi),super(null,s,r,o,a,l,h,i,c),this.isDepthTexture=!0,this.image={width:t,height:e},this.magFilter=a!==void 0?a:Ze,this.minFilter=l!==void 0?l:Ze,this.flipY=!1,this.generateMipmaps=!1,this.compareFunction=null}copy(t){return super.copy(t),this.compareFunction=t.compareFunction,this}toJSON(t){const e=super.toJSON(t);return this.compareFunction!==null&&(e.compareFunction=this.compareFunction),e}}const ku=new fn,Bu=new Nu(1,1);Bu.compareFunction=Qh;const zu=new cu,Hu=new Mg,Vu=new Cu,Gu=[],Wu=[],Xu=new Float32Array(16),ju=new Float32Array(9),Yu=new Float32Array(4);function js(n,t,e){const i=n[0];if(i<=0||i>0)return n;const s=t*e;let r=Gu[s];if(r===void 0&&(r=new Float32Array(s),Gu[s]=r),t!==0){i.toArray(r,0);for(let o=1,a=0;o!==t;++o)a+=e,n[o].toArray(r,a)}return r}function Re(n,t){if(n.length!==t.length)return!1;for(let e=0,i=n.length;e<i;e++)if(n[e]!==t[e])return!1;return!0}function Pe(n,t){for(let e=0,i=t.length;e<i;e++)n[e]=t[e]}function ko(n,t){let e=Wu[t];e===void 0&&(e=new Int32Array(t),Wu[t]=e);for(let i=0;i!==t;++i)e[i]=n.allocateTextureUnit();return e}function ix(n,t){const e=this.cache;e[0]!==t&&(n.uniform1f(this.addr,t),e[0]=t)}function sx(n,t){const e=this.cache;if(t.x!==void 0)(e[0]!==t.x||e[1]!==t.y)&&(n.uniform2f(this.addr,t.x,t.y),e[0]=t.x,e[1]=t.y);else{if(Re(e,t))return;n.uniform2fv(this.addr,t),Pe(e,t)}}function rx(n,t){const e=this.cache;if(t.x!==void 0)(e[0]!==t.x||e[1]!==t.y||e[2]!==t.z)&&(n.uniform3f(this.addr,t.x,t.y,t.z),e[0]=t.x,e[1]=t.y,e[2]=t.z);else if(t.r!==void 0)(e[0]!==t.r||e[1]!==t.g||e[2]!==t.b)&&(n.uniform3f(this.addr,t.r,t.g,t.b),e[0]=t.r,e[1]=t.g,e[2]=t.b);else{if(Re(e,t))return;n.uniform3fv(this.addr,t),Pe(e,t)}}function ox(n,t){const e=this.cache;if(t.x!==void 0)(e[0]!==t.x||e[1]!==t.y||e[2]!==t.z||e[3]!==t.w)&&(n.uniform4f(this.addr,t.x,t.y,t.z,t.w),e[0]=t.x,e[1]=t.y,e[2]=t.z,e[3]=t.w);else{if(Re(e,t))return;n.uniform4fv(this.addr,t),Pe(e,t)}}function ax(n,t){const e=this.cache,i=t.elements;if(i===void 0){if(Re(e,t))return;n.uniformMatrix2fv(this.addr,!1,t),Pe(e,t)}else{if(Re(e,i))return;Yu.set(i),n.uniformMatrix2fv(this.addr,!1,Yu),Pe(e,i)}}function lx(n,t){const e=this.cache,i=t.elements;if(i===void 0){if(Re(e,t))return;n.uniformMatrix3fv(this.addr,!1,t),Pe(e,t)}else{if(Re(e,i))return;ju.set(i),n.uniformMatrix3fv(this.addr,!1,ju),Pe(e,i)}}function cx(n,t){const e=this.cache,i=t.elements;if(i===void 0){if(Re(e,t))return;n.uniformMatrix4fv(this.addr,!1,t),Pe(e,t)}else{if(Re(e,i))return;Xu.set(i),n.uniformMatrix4fv(this.addr,!1,Xu),Pe(e,i)}}function hx(n,t){const e=this.cache;e[0]!==t&&(n.uniform1i(this.addr,t),e[0]=t)}function ux(n,t){const e=this.cache;if(t.x!==void 0)(e[0]!==t.x||e[1]!==t.y)&&(n.uniform2i(this.addr,t.x,t.y),e[0]=t.x,e[1]=t.y);else{if(Re(e,t))return;n.uniform2iv(this.addr,t),Pe(e,t)}}function dx(n,t){const e=this.cache;if(t.x!==void 0)(e[0]!==t.x||e[1]!==t.y||e[2]!==t.z)&&(n.uniform3i(this.addr,t.x,t.y,t.z),e[0]=t.x,e[1]=t.y,e[2]=t.z);else{if(Re(e,t))return;n.uniform3iv(this.addr,t),Pe(e,t)}}function fx(n,t){const e=this.cache;if(t.x!==void 0)(e[0]!==t.x||e[1]!==t.y||e[2]!==t.z||e[3]!==t.w)&&(n.uniform4i(this.addr,t.x,t.y,t.z,t.w),e[0]=t.x,e[1]=t.y,e[2]=t.z,e[3]=t.w);else{if(Re(e,t))return;n.uniform4iv(this.addr,t),Pe(e,t)}}function px(n,t){const e=this.cache;e[0]!==t&&(n.uniform1ui(this.addr,t),e[0]=t)}function mx(n,t){const e=this.cache;if(t.x!==void 0)(e[0]!==t.x||e[1]!==t.y)&&(n.uniform2ui(this.addr,t.x,t.y),e[0]=t.x,e[1]=t.y);else{if(Re(e,t))return;n.uniform2uiv(this.addr,t),Pe(e,t)}}function gx(n,t){const e=this.cache;if(t.x!==void 0)(e[0]!==t.x||e[1]!==t.y||e[2]!==t.z)&&(n.uniform3ui(this.addr,t.x,t.y,t.z),e[0]=t.x,e[1]=t.y,e[2]=t.z);else{if(Re(e,t))return;n.uniform3uiv(this.addr,t),Pe(e,t)}}function _x(n,t){const e=this.cache;if(t.x!==void 0)(e[0]!==t.x||e[1]!==t.y||e[2]!==t.z||e[3]!==t.w)&&(n.uniform4ui(this.addr,t.x,t.y,t.z,t.w),e[0]=t.x,e[1]=t.y,e[2]=t.z,e[3]=t.w);else{if(Re(e,t))return;n.uniform4uiv(this.addr,t),Pe(e,t)}}function xx(n,t,e){const i=this.cache,s=e.allocateTextureUnit();i[0]!==s&&(n.uniform1i(this.addr,s),i[0]=s);const r=this.type===n.SAMPLER_2D_SHADOW?Bu:ku;e.setTexture2D(t||r,s)}function vx(n,t,e){const i=this.cache,s=e.allocateTextureUnit();i[0]!==s&&(n.uniform1i(this.addr,s),i[0]=s),e.setTexture3D(t||Hu,s)}function bx(n,t,e){const i=this.cache,s=e.allocateTextureUnit();i[0]!==s&&(n.uniform1i(this.addr,s),i[0]=s),e.setTextureCube(t||Vu,s)}function Mx(n,t,e){const i=this.cache,s=e.allocateTextureUnit();i[0]!==s&&(n.uniform1i(this.addr,s),i[0]=s),e.setTexture2DArray(t||zu,s)}function yx(n){switch(n){case 5126:return ix;case 35664:return sx;case 35665:return rx;case 35666:return ox;case 35674:return ax;case 35675:return lx;case 35676:return cx;case 5124:case 35670:return hx;case 35667:case 35671:return ux;case 35668:case 35672:return dx;case 35669:case 35673:return fx;case 5125:return px;case 36294:return mx;case 36295:return gx;case 36296:return _x;case 35678:case 36198:case 36298:case 36306:case 35682:return xx;case 35679:case 36299:case 36307:return vx;case 35680:case 36300:case 36308:case 36293:return bx;case 36289:case 36303:case 36311:case 36292:return Mx}}function Sx(n,t){n.uniform1fv(this.addr,t)}function Ex(n,t){const e=js(t,this.size,2);n.uniform2fv(this.addr,e)}function Tx(n,t){const e=js(t,this.size,3);n.uniform3fv(this.addr,e)}function wx(n,t){const e=js(t,this.size,4);n.uniform4fv(this.addr,e)}function Ax(n,t){const e=js(t,this.size,4);n.uniformMatrix2fv(this.addr,!1,e)}function Cx(n,t){const e=js(t,this.size,9);n.uniformMatrix3fv(this.addr,!1,e)}function Rx(n,t){const e=js(t,this.size,16);n.uniformMatrix4fv(this.addr,!1,e)}function Px(n,t){n.uniform1iv(this.addr,t)}function Lx(n,t){n.uniform2iv(this.addr,t)}function Dx(n,t){n.uniform3iv(this.addr,t)}function Ix(n,t){n.uniform4iv(this.addr,t)}function Ox(n,t){n.uniform1uiv(this.addr,t)}function Ux(n,t){n.uniform2uiv(this.addr,t)}function Fx(n,t){n.uniform3uiv(this.addr,t)}function Nx(n,t){n.uniform4uiv(this.addr,t)}function kx(n,t,e){const i=this.cache,s=t.length,r=ko(e,s);Re(i,r)||(n.uniform1iv(this.addr,r),Pe(i,r));for(let o=0;o!==s;++o)e.setTexture2D(t[o]||ku,r[o])}function Bx(n,t,e){const i=this.cache,s=t.length,r=ko(e,s);Re(i,r)||(n.uniform1iv(this.addr,r),Pe(i,r));for(let o=0;o!==s;++o)e.setTexture3D(t[o]||Hu,r[o])}function zx(n,t,e){const i=this.cache,s=t.length,r=ko(e,s);Re(i,r)||(n.uniform1iv(this.addr,r),Pe(i,r));for(let o=0;o!==s;++o)e.setTextureCube(t[o]||Vu,r[o])}function Hx(n,t,e){const i=this.cache,s=t.length,r=ko(e,s);Re(i,r)||(n.uniform1iv(this.addr,r),Pe(i,r));for(let o=0;o!==s;++o)e.setTexture2DArray(t[o]||zu,r[o])}function Vx(n){switch(n){case 5126:return Sx;case 35664:return Ex;case 35665:return Tx;case 35666:return wx;case 35674:return Ax;case 35675:return Cx;case 35676:return Rx;case 5124:case 35670:return Px;case 35667:case 35671:return Lx;case 35668:case 35672:return Dx;case 35669:case 35673:return Ix;case 5125:return Ox;case 36294:return Ux;case 36295:return Fx;case 36296:return Nx;case 35678:case 36198:case 36298:case 36306:case 35682:return kx;case 35679:case 36299:case 36307:return Bx;case 35680:case 36300:case 36308:case 36293:return zx;case 36289:case 36303:case 36311:case 36292:return Hx}}class Gx{constructor(t,e,i){this.id=t,this.addr=i,this.cache=[],this.type=e.type,this.setValue=yx(e.type)}}class Wx{constructor(t,e,i){this.id=t,this.addr=i,this.cache=[],this.type=e.type,this.size=e.size,this.setValue=Vx(e.type)}}class Xx{constructor(t){this.id=t,this.seq=[],this.map={}}setValue(t,e,i){const s=this.seq;for(let r=0,o=s.length;r!==o;++r){const a=s[r];a.setValue(t,e[a.id],i)}}}const Ol=/(\w+)(\])?(\[|\.)?/g;function qu(n,t){n.seq.push(t),n.map[t.id]=t}function jx(n,t,e){const i=n.name,s=i.length;for(Ol.lastIndex=0;;){const r=Ol.exec(i),o=Ol.lastIndex;let a=r[1];const l=r[2]==="]",c=r[3];if(l&&(a=a|0),c===void 0||c==="["&&o+2===s){qu(e,c===void 0?new Gx(a,n,t):new Wx(a,n,t));break}else{let u=e.map[a];u===void 0&&(u=new Xx(a),qu(e,u)),e=u}}}class Bo{constructor(t,e){this.seq=[],this.map={};const i=t.getProgramParameter(e,t.ACTIVE_UNIFORMS);for(let s=0;s<i;++s){const r=t.getActiveUniform(e,s),o=t.getUniformLocation(e,r.name);jx(r,o,this)}}setValue(t,e,i,s){const r=this.map[e];r!==void 0&&r.setValue(t,i,s)}setOptional(t,e,i){const s=e[i];s!==void 0&&this.setValue(t,i,s)}static upload(t,e,i,s){for(let r=0,o=e.length;r!==o;++r){const a=e[r],l=i[a.id];l.needsUpdate!==!1&&a.setValue(t,l.value,s)}}static seqWithValue(t,e){const i=[];for(let s=0,r=t.length;s!==r;++s){const o=t[s];o.id in e&&i.push(o)}return i}}function $u(n,t,e){const i=n.createShader(t);return n.shaderSource(i,e),n.compileShader(i),i}const Yx=37297;let qx=0;function $x(n,t){const e=n.split(`
`),i=[],s=Math.max(t-6,0),r=Math.min(t+6,e.length);for(let o=s;o<r;o++){const a=o+1;i.push(`${a===t?">":" "} ${a}: ${e[o]}`)}return i.join(`
`)}function Kx(n){const t=se.getPrimaries(se.workingColorSpace),e=se.getPrimaries(n);let i;switch(t===e?i="":t===ho&&e===co?i="LinearDisplayP3ToLinearSRGB":t===co&&e===ho&&(i="LinearSRGBToLinearDisplayP3"),n){case si:case ao:return[i,"LinearTransferOETF"];case Ve:case sl:return[i,"sRGBTransferOETF"];default:return console.warn("THREE.WebGLProgram: Unsupported color space:",n),[i,"LinearTransferOETF"]}}function Ku(n,t,e){const i=n.getShaderParameter(t,n.COMPILE_STATUS),s=n.getShaderInfoLog(t).trim();if(i&&s==="")return"";const r=/ERROR: 0:(\d+)/.exec(s);if(r){const o=parseInt(r[1]);return e.toUpperCase()+`

`+s+`

`+$x(n.getShaderSource(t),o)}else return s}function Zx(n,t){const e=Kx(t);return`vec4 ${n}( vec4 value ) { return ${e[0]}( ${e[1]}( value ) ); }`}function Jx(n,t){let e;switch(t){case dh:e="Linear";break;case fh:e="Reinhard";break;case ph:e="OptimizedCineon";break;case ja:e="ACESFilmic";break;case mh:e="AgX";break;case Ym:e="Custom";break;default:console.warn("THREE.WebGLProgram: Unsupported toneMapping:",t),e="Linear"}return"vec3 "+n+"( vec3 color ) { return "+e+"ToneMapping( color ); }"}function Qx(n){return[n.extensionDerivatives||n.envMapCubeUVHeight||n.bumpMap||n.normalMapTangentSpace||n.clearcoatNormalMap||n.flatShading||n.shaderID==="physical"?"#extension GL_OES_standard_derivatives : enable":"",(n.extensionFragDepth||n.logarithmicDepthBuffer)&&n.rendererExtensionFragDepth?"#extension GL_EXT_frag_depth : enable":"",n.extensionDrawBuffers&&n.rendererExtensionDrawBuffers?"#extension GL_EXT_draw_buffers : require":"",(n.extensionShaderTextureLOD||n.envMap||n.transmission)&&n.rendererExtensionShaderTextureLod?"#extension GL_EXT_shader_texture_lod : enable":""].filter(Ys).join(`
`)}function tv(n){return[n.extensionClipCullDistance?"#extension GL_ANGLE_clip_cull_distance : require":""].filter(Ys).join(`
`)}function ev(n){const t=[];for(const e in n){const i=n[e];i!==!1&&t.push("#define "+e+" "+i)}return t.join(`
`)}function nv(n,t){const e={},i=n.getProgramParameter(t,n.ACTIVE_ATTRIBUTES);for(let s=0;s<i;s++){const r=n.getActiveAttrib(t,s),o=r.name;let a=1;r.type===n.FLOAT_MAT2&&(a=2),r.type===n.FLOAT_MAT3&&(a=3),r.type===n.FLOAT_MAT4&&(a=4),e[o]={type:r.type,location:n.getAttribLocation(t,o),locationSize:a}}return e}function Ys(n){return n!==""}function Zu(n,t){const e=t.numSpotLightShadows+t.numSpotLightMaps-t.numSpotLightShadowsWithMaps;return n.replace(/NUM_DIR_LIGHTS/g,t.numDirLights).replace(/NUM_SPOT_LIGHTS/g,t.numSpotLights).replace(/NUM_SPOT_LIGHT_MAPS/g,t.numSpotLightMaps).replace(/NUM_SPOT_LIGHT_COORDS/g,e).replace(/NUM_RECT_AREA_LIGHTS/g,t.numRectAreaLights).replace(/NUM_POINT_LIGHTS/g,t.numPointLights).replace(/NUM_HEMI_LIGHTS/g,t.numHemiLights).replace(/NUM_DIR_LIGHT_SHADOWS/g,t.numDirLightShadows).replace(/NUM_SPOT_LIGHT_SHADOWS_WITH_MAPS/g,t.numSpotLightShadowsWithMaps).replace(/NUM_SPOT_LIGHT_SHADOWS/g,t.numSpotLightShadows).replace(/NUM_POINT_LIGHT_SHADOWS/g,t.numPointLightShadows)}function Ju(n,t){return n.replace(/NUM_CLIPPING_PLANES/g,t.numClippingPlanes).replace(/UNION_CLIPPING_PLANES/g,t.numClippingPlanes-t.numClipIntersection)}const iv=/^[ \t]*#include +<([\w\d./]+)>/gm;function Ul(n){return n.replace(iv,rv)}const sv=new Map([["encodings_fragment","colorspace_fragment"],["encodings_pars_fragment","colorspace_pars_fragment"],["output_fragment","opaque_fragment"]]);function rv(n,t){let e=Gt[t];if(e===void 0){const i=sv.get(t);if(i!==void 0)e=Gt[i],console.warn('THREE.WebGLRenderer: Shader chunk "%s" has been deprecated. Use "%s" instead.',t,i);else throw new Error("Can not resolve #include <"+t+">")}return Ul(e)}const ov=/#pragma unroll_loop_start\s+for\s*\(\s*int\s+i\s*=\s*(\d+)\s*;\s*i\s*<\s*(\d+)\s*;\s*i\s*\+\+\s*\)\s*{([\s\S]+?)}\s+#pragma unroll_loop_end/g;function Qu(n){return n.replace(ov,av)}function av(n,t,e,i){let s="";for(let r=parseInt(t);r<parseInt(e);r++)s+=i.replace(/\[\s*i\s*\]/g,"[ "+r+" ]").replace(/UNROLLED_LOOP_INDEX/g,r);return s}function td(n){let t="precision "+n.precision+` float;
precision `+n.precision+" int;";return n.precision==="highp"?t+=`
#define HIGH_PRECISION`:n.precision==="mediump"?t+=`
#define MEDIUM_PRECISION`:n.precision==="lowp"&&(t+=`
#define LOW_PRECISION`),t}function lv(n){let t="SHADOWMAP_TYPE_BASIC";return n.shadowMapType===rh?t="SHADOWMAP_TYPE_PCF":n.shadowMapType===oh?t="SHADOWMAP_TYPE_PCF_SOFT":n.shadowMapType===ei&&(t="SHADOWMAP_TYPE_VSM"),t}function cv(n){let t="ENVMAP_TYPE_CUBE";if(n.envMap)switch(n.envMapMode){case ys:case Ss:t="ENVMAP_TYPE_CUBE";break;case oo:t="ENVMAP_TYPE_CUBE_UV";break}return t}function hv(n){let t="ENVMAP_MODE_REFLECTION";if(n.envMap)switch(n.envMapMode){case Ss:t="ENVMAP_MODE_REFRACTION";break}return t}function uv(n){let t="ENVMAP_BLENDING_NONE";if(n.envMap)switch(n.combine){case uh:t="ENVMAP_BLENDING_MULTIPLY";break;case Xm:t="ENVMAP_BLENDING_MIX";break;case jm:t="ENVMAP_BLENDING_ADD";break}return t}function dv(n){const t=n.envMapCubeUVHeight;if(t===null)return null;const e=Math.log2(t)-2,i=1/t;return{texelWidth:1/(3*Math.max(Math.pow(2,e),112)),texelHeight:i,maxMip:e}}function fv(n,t,e,i){const s=n.getContext(),r=e.defines;let o=e.vertexShader,a=e.fragmentShader;const l=lv(e),c=cv(e),h=hv(e),u=uv(e),d=dv(e),f=e.isWebGL2?"":Qx(e),g=tv(e),_=ev(r),m=s.createProgram();let p,v,x=e.glslVersion?"#version "+e.glslVersion+`
`:"";e.isRawShaderMaterial?(p=["#define SHADER_TYPE "+e.shaderType,"#define SHADER_NAME "+e.shaderName,_].filter(Ys).join(`
`),p.length>0&&(p+=`
`),v=[f,"#define SHADER_TYPE "+e.shaderType,"#define SHADER_NAME "+e.shaderName,_].filter(Ys).join(`
`),v.length>0&&(v+=`
`)):(p=[td(e),"#define SHADER_TYPE "+e.shaderType,"#define SHADER_NAME "+e.shaderName,_,e.extensionClipCullDistance?"#define USE_CLIP_DISTANCE":"",e.batching?"#define USE_BATCHING":"",e.instancing?"#define USE_INSTANCING":"",e.instancingColor?"#define USE_INSTANCING_COLOR":"",e.useFog&&e.fog?"#define USE_FOG":"",e.useFog&&e.fogExp2?"#define FOG_EXP2":"",e.map?"#define USE_MAP":"",e.envMap?"#define USE_ENVMAP":"",e.envMap?"#define "+h:"",e.lightMap?"#define USE_LIGHTMAP":"",e.aoMap?"#define USE_AOMAP":"",e.bumpMap?"#define USE_BUMPMAP":"",e.normalMap?"#define USE_NORMALMAP":"",e.normalMapObjectSpace?"#define USE_NORMALMAP_OBJECTSPACE":"",e.normalMapTangentSpace?"#define USE_NORMALMAP_TANGENTSPACE":"",e.displacementMap?"#define USE_DISPLACEMENTMAP":"",e.emissiveMap?"#define USE_EMISSIVEMAP":"",e.anisotropy?"#define USE_ANISOTROPY":"",e.anisotropyMap?"#define USE_ANISOTROPYMAP":"",e.clearcoatMap?"#define USE_CLEARCOATMAP":"",e.clearcoatRoughnessMap?"#define USE_CLEARCOAT_ROUGHNESSMAP":"",e.clearcoatNormalMap?"#define USE_CLEARCOAT_NORMALMAP":"",e.iridescenceMap?"#define USE_IRIDESCENCEMAP":"",e.iridescenceThicknessMap?"#define USE_IRIDESCENCE_THICKNESSMAP":"",e.specularMap?"#define USE_SPECULARMAP":"",e.specularColorMap?"#define USE_SPECULAR_COLORMAP":"",e.specularIntensityMap?"#define USE_SPECULAR_INTENSITYMAP":"",e.roughnessMap?"#define USE_ROUGHNESSMAP":"",e.metalnessMap?"#define USE_METALNESSMAP":"",e.alphaMap?"#define USE_ALPHAMAP":"",e.alphaHash?"#define USE_ALPHAHASH":"",e.transmission?"#define USE_TRANSMISSION":"",e.transmissionMap?"#define USE_TRANSMISSIONMAP":"",e.thicknessMap?"#define USE_THICKNESSMAP":"",e.sheenColorMap?"#define USE_SHEEN_COLORMAP":"",e.sheenRoughnessMap?"#define USE_SHEEN_ROUGHNESSMAP":"",e.mapUv?"#define MAP_UV "+e.mapUv:"",e.alphaMapUv?"#define ALPHAMAP_UV "+e.alphaMapUv:"",e.lightMapUv?"#define LIGHTMAP_UV "+e.lightMapUv:"",e.aoMapUv?"#define AOMAP_UV "+e.aoMapUv:"",e.emissiveMapUv?"#define EMISSIVEMAP_UV "+e.emissiveMapUv:"",e.bumpMapUv?"#define BUMPMAP_UV "+e.bumpMapUv:"",e.normalMapUv?"#define NORMALMAP_UV "+e.normalMapUv:"",e.displacementMapUv?"#define DISPLACEMENTMAP_UV "+e.displacementMapUv:"",e.metalnessMapUv?"#define METALNESSMAP_UV "+e.metalnessMapUv:"",e.roughnessMapUv?"#define ROUGHNESSMAP_UV "+e.roughnessMapUv:"",e.anisotropyMapUv?"#define ANISOTROPYMAP_UV "+e.anisotropyMapUv:"",e.clearcoatMapUv?"#define CLEARCOATMAP_UV "+e.clearcoatMapUv:"",e.clearcoatNormalMapUv?"#define CLEARCOAT_NORMALMAP_UV "+e.clearcoatNormalMapUv:"",e.clearcoatRoughnessMapUv?"#define CLEARCOAT_ROUGHNESSMAP_UV "+e.clearcoatRoughnessMapUv:"",e.iridescenceMapUv?"#define IRIDESCENCEMAP_UV "+e.iridescenceMapUv:"",e.iridescenceThicknessMapUv?"#define IRIDESCENCE_THICKNESSMAP_UV "+e.iridescenceThicknessMapUv:"",e.sheenColorMapUv?"#define SHEEN_COLORMAP_UV "+e.sheenColorMapUv:"",e.sheenRoughnessMapUv?"#define SHEEN_ROUGHNESSMAP_UV "+e.sheenRoughnessMapUv:"",e.specularMapUv?"#define SPECULARMAP_UV "+e.specularMapUv:"",e.specularColorMapUv?"#define SPECULAR_COLORMAP_UV "+e.specularColorMapUv:"",e.specularIntensityMapUv?"#define SPECULAR_INTENSITYMAP_UV "+e.specularIntensityMapUv:"",e.transmissionMapUv?"#define TRANSMISSIONMAP_UV "+e.transmissionMapUv:"",e.thicknessMapUv?"#define THICKNESSMAP_UV "+e.thicknessMapUv:"",e.vertexTangents&&e.flatShading===!1?"#define USE_TANGENT":"",e.vertexColors?"#define USE_COLOR":"",e.vertexAlphas?"#define USE_COLOR_ALPHA":"",e.vertexUv1s?"#define USE_UV1":"",e.vertexUv2s?"#define USE_UV2":"",e.vertexUv3s?"#define USE_UV3":"",e.pointsUvs?"#define USE_POINTS_UV":"",e.flatShading?"#define FLAT_SHADED":"",e.skinning?"#define USE_SKINNING":"",e.morphTargets?"#define USE_MORPHTARGETS":"",e.morphNormals&&e.flatShading===!1?"#define USE_MORPHNORMALS":"",e.morphColors&&e.isWebGL2?"#define USE_MORPHCOLORS":"",e.morphTargetsCount>0&&e.isWebGL2?"#define MORPHTARGETS_TEXTURE":"",e.morphTargetsCount>0&&e.isWebGL2?"#define MORPHTARGETS_TEXTURE_STRIDE "+e.morphTextureStride:"",e.morphTargetsCount>0&&e.isWebGL2?"#define MORPHTARGETS_COUNT "+e.morphTargetsCount:"",e.doubleSided?"#define DOUBLE_SIDED":"",e.flipSided?"#define FLIP_SIDED":"",e.shadowMapEnabled?"#define USE_SHADOWMAP":"",e.shadowMapEnabled?"#define "+l:"",e.sizeAttenuation?"#define USE_SIZEATTENUATION":"",e.numLightProbes>0?"#define USE_LIGHT_PROBES":"",e.useLegacyLights?"#define LEGACY_LIGHTS":"",e.logarithmicDepthBuffer?"#define USE_LOGDEPTHBUF":"",e.logarithmicDepthBuffer&&e.rendererExtensionFragDepth?"#define USE_LOGDEPTHBUF_EXT":"","uniform mat4 modelMatrix;","uniform mat4 modelViewMatrix;","uniform mat4 projectionMatrix;","uniform mat4 viewMatrix;","uniform mat3 normalMatrix;","uniform vec3 cameraPosition;","uniform bool isOrthographic;","#ifdef USE_INSTANCING","	attribute mat4 instanceMatrix;","#endif","#ifdef USE_INSTANCING_COLOR","	attribute vec3 instanceColor;","#endif","attribute vec3 position;","attribute vec3 normal;","attribute vec2 uv;","#ifdef USE_UV1","	attribute vec2 uv1;","#endif","#ifdef USE_UV2","	attribute vec2 uv2;","#endif","#ifdef USE_UV3","	attribute vec2 uv3;","#endif","#ifdef USE_TANGENT","	attribute vec4 tangent;","#endif","#if defined( USE_COLOR_ALPHA )","	attribute vec4 color;","#elif defined( USE_COLOR )","	attribute vec3 color;","#endif","#if ( defined( USE_MORPHTARGETS ) && ! defined( MORPHTARGETS_TEXTURE ) )","	attribute vec3 morphTarget0;","	attribute vec3 morphTarget1;","	attribute vec3 morphTarget2;","	attribute vec3 morphTarget3;","	#ifdef USE_MORPHNORMALS","		attribute vec3 morphNormal0;","		attribute vec3 morphNormal1;","		attribute vec3 morphNormal2;","		attribute vec3 morphNormal3;","	#else","		attribute vec3 morphTarget4;","		attribute vec3 morphTarget5;","		attribute vec3 morphTarget6;","		attribute vec3 morphTarget7;","	#endif","#endif","#ifdef USE_SKINNING","	attribute vec4 skinIndex;","	attribute vec4 skinWeight;","#endif",`
`].filter(Ys).join(`
`),v=[f,td(e),"#define SHADER_TYPE "+e.shaderType,"#define SHADER_NAME "+e.shaderName,_,e.useFog&&e.fog?"#define USE_FOG":"",e.useFog&&e.fogExp2?"#define FOG_EXP2":"",e.map?"#define USE_MAP":"",e.matcap?"#define USE_MATCAP":"",e.envMap?"#define USE_ENVMAP":"",e.envMap?"#define "+c:"",e.envMap?"#define "+h:"",e.envMap?"#define "+u:"",d?"#define CUBEUV_TEXEL_WIDTH "+d.texelWidth:"",d?"#define CUBEUV_TEXEL_HEIGHT "+d.texelHeight:"",d?"#define CUBEUV_MAX_MIP "+d.maxMip+".0":"",e.lightMap?"#define USE_LIGHTMAP":"",e.aoMap?"#define USE_AOMAP":"",e.bumpMap?"#define USE_BUMPMAP":"",e.normalMap?"#define USE_NORMALMAP":"",e.normalMapObjectSpace?"#define USE_NORMALMAP_OBJECTSPACE":"",e.normalMapTangentSpace?"#define USE_NORMALMAP_TANGENTSPACE":"",e.emissiveMap?"#define USE_EMISSIVEMAP":"",e.anisotropy?"#define USE_ANISOTROPY":"",e.anisotropyMap?"#define USE_ANISOTROPYMAP":"",e.clearcoat?"#define USE_CLEARCOAT":"",e.clearcoatMap?"#define USE_CLEARCOATMAP":"",e.clearcoatRoughnessMap?"#define USE_CLEARCOAT_ROUGHNESSMAP":"",e.clearcoatNormalMap?"#define USE_CLEARCOAT_NORMALMAP":"",e.iridescence?"#define USE_IRIDESCENCE":"",e.iridescenceMap?"#define USE_IRIDESCENCEMAP":"",e.iridescenceThicknessMap?"#define USE_IRIDESCENCE_THICKNESSMAP":"",e.specularMap?"#define USE_SPECULARMAP":"",e.specularColorMap?"#define USE_SPECULAR_COLORMAP":"",e.specularIntensityMap?"#define USE_SPECULAR_INTENSITYMAP":"",e.roughnessMap?"#define USE_ROUGHNESSMAP":"",e.metalnessMap?"#define USE_METALNESSMAP":"",e.alphaMap?"#define USE_ALPHAMAP":"",e.alphaTest?"#define USE_ALPHATEST":"",e.alphaHash?"#define USE_ALPHAHASH":"",e.sheen?"#define USE_SHEEN":"",e.sheenColorMap?"#define USE_SHEEN_COLORMAP":"",e.sheenRoughnessMap?"#define USE_SHEEN_ROUGHNESSMAP":"",e.transmission?"#define USE_TRANSMISSION":"",e.transmissionMap?"#define USE_TRANSMISSIONMAP":"",e.thicknessMap?"#define USE_THICKNESSMAP":"",e.vertexTangents&&e.flatShading===!1?"#define USE_TANGENT":"",e.vertexColors||e.instancingColor?"#define USE_COLOR":"",e.vertexAlphas?"#define USE_COLOR_ALPHA":"",e.vertexUv1s?"#define USE_UV1":"",e.vertexUv2s?"#define USE_UV2":"",e.vertexUv3s?"#define USE_UV3":"",e.pointsUvs?"#define USE_POINTS_UV":"",e.gradientMap?"#define USE_GRADIENTMAP":"",e.flatShading?"#define FLAT_SHADED":"",e.doubleSided?"#define DOUBLE_SIDED":"",e.flipSided?"#define FLIP_SIDED":"",e.shadowMapEnabled?"#define USE_SHADOWMAP":"",e.shadowMapEnabled?"#define "+l:"",e.premultipliedAlpha?"#define PREMULTIPLIED_ALPHA":"",e.numLightProbes>0?"#define USE_LIGHT_PROBES":"",e.useLegacyLights?"#define LEGACY_LIGHTS":"",e.decodeVideoTexture?"#define DECODE_VIDEO_TEXTURE":"",e.logarithmicDepthBuffer?"#define USE_LOGDEPTHBUF":"",e.logarithmicDepthBuffer&&e.rendererExtensionFragDepth?"#define USE_LOGDEPTHBUF_EXT":"","uniform mat4 viewMatrix;","uniform vec3 cameraPosition;","uniform bool isOrthographic;",e.toneMapping!==Si?"#define TONE_MAPPING":"",e.toneMapping!==Si?Gt.tonemapping_pars_fragment:"",e.toneMapping!==Si?Jx("toneMapping",e.toneMapping):"",e.dithering?"#define DITHERING":"",e.opaque?"#define OPAQUE":"",Gt.colorspace_pars_fragment,Zx("linearToOutputTexel",e.outputColorSpace),e.useDepthPacking?"#define DEPTH_PACKING "+e.depthPacking:"",`
`].filter(Ys).join(`
`)),o=Ul(o),o=Zu(o,e),o=Ju(o,e),a=Ul(a),a=Zu(a,e),a=Ju(a,e),o=Qu(o),a=Qu(a),e.isWebGL2&&e.isRawShaderMaterial!==!0&&(x=`#version 300 es
`,p=[g,"precision mediump sampler2DArray;","#define attribute in","#define varying out","#define texture2D texture"].join(`
`)+`
`+p,v=["precision mediump sampler2DArray;","#define varying in",e.glslVersion===eu?"":"layout(location = 0) out highp vec4 pc_fragColor;",e.glslVersion===eu?"":"#define gl_FragColor pc_fragColor","#define gl_FragDepthEXT gl_FragDepth","#define texture2D texture","#define textureCube texture","#define texture2DProj textureProj","#define texture2DLodEXT textureLod","#define texture2DProjLodEXT textureProjLod","#define textureCubeLodEXT textureLod","#define texture2DGradEXT textureGrad","#define texture2DProjGradEXT textureProjGrad","#define textureCubeGradEXT textureGrad"].join(`
`)+`
`+v);const y=x+p+o,b=x+v+a,E=$u(s,s.VERTEX_SHADER,y),S=$u(s,s.FRAGMENT_SHADER,b);s.attachShader(m,E),s.attachShader(m,S),e.index0AttributeName!==void 0?s.bindAttribLocation(m,0,e.index0AttributeName):e.morphTargets===!0&&s.bindAttribLocation(m,0,"position"),s.linkProgram(m);function C(O){if(n.debug.checkShaderErrors){const Z=s.getProgramInfoLog(m).trim(),D=s.getShaderInfoLog(E).trim(),F=s.getShaderInfoLog(S).trim();let V=!0,$=!0;if(s.getProgramParameter(m,s.LINK_STATUS)===!1)if(V=!1,typeof n.debug.onShaderError=="function")n.debug.onShaderError(s,m,E,S);else{const K=Ku(s,E,"vertex"),Y=Ku(s,S,"fragment");console.error("THREE.WebGLProgram: Shader Error "+s.getError()+" - VALIDATE_STATUS "+s.getProgramParameter(m,s.VALIDATE_STATUS)+`

Program Info Log: `+Z+`
`+K+`
`+Y)}else Z!==""?console.warn("THREE.WebGLProgram: Program Info Log:",Z):(D===""||F==="")&&($=!1);$&&(O.diagnostics={runnable:V,programLog:Z,vertexShader:{log:D,prefix:p},fragmentShader:{log:F,prefix:v}})}s.deleteShader(E),s.deleteShader(S),M=new Bo(s,m),w=nv(s,m)}let M;this.getUniforms=function(){return M===void 0&&C(this),M};let w;this.getAttributes=function(){return w===void 0&&C(this),w};let U=e.rendererExtensionParallelShaderCompile===!1;return this.isReady=function(){return U===!1&&(U=s.getProgramParameter(m,Yx)),U},this.destroy=function(){i.releaseStatesOfProgram(this),s.deleteProgram(m),this.program=void 0},this.type=e.shaderType,this.name=e.shaderName,this.id=qx++,this.cacheKey=t,this.usedTimes=1,this.program=m,this.vertexShader=E,this.fragmentShader=S,this}let pv=0;class mv{constructor(){this.shaderCache=new Map,this.materialCache=new Map}update(t){const e=t.vertexShader,i=t.fragmentShader,s=this._getShaderStage(e),r=this._getShaderStage(i),o=this._getShaderCacheForMaterial(t);return o.has(s)===!1&&(o.add(s),s.usedTimes++),o.has(r)===!1&&(o.add(r),r.usedTimes++),this}remove(t){const e=this.materialCache.get(t);for(const i of e)i.usedTimes--,i.usedTimes===0&&this.shaderCache.delete(i.code);return this.materialCache.delete(t),this}getVertexShaderID(t){return this._getShaderStage(t.vertexShader).id}getFragmentShaderID(t){return this._getShaderStage(t.fragmentShader).id}dispose(){this.shaderCache.clear(),this.materialCache.clear()}_getShaderCacheForMaterial(t){const e=this.materialCache;let i=e.get(t);return i===void 0&&(i=new Set,e.set(t,i)),i}_getShaderStage(t){const e=this.shaderCache;let i=e.get(t);return i===void 0&&(i=new gv(t),e.set(t,i)),i}}class gv{constructor(t){this.id=pv++,this.code=t,this.usedTimes=0}}function _v(n,t,e,i,s,r,o){const a=new xl,l=new mv,c=[],h=s.isWebGL2,u=s.logarithmicDepthBuffer,d=s.vertexTextures;let f=s.precision;const g={MeshDepthMaterial:"depth",MeshDistanceMaterial:"distanceRGBA",MeshNormalMaterial:"normal",MeshBasicMaterial:"basic",MeshLambertMaterial:"lambert",MeshPhongMaterial:"phong",MeshToonMaterial:"toon",MeshStandardMaterial:"physical",MeshPhysicalMaterial:"physical",MeshMatcapMaterial:"matcap",LineBasicMaterial:"basic",LineDashedMaterial:"dashed",PointsMaterial:"points",ShadowMaterial:"shadow",SpriteMaterial:"sprite"};function _(M){return M===0?"uv":`uv${M}`}function m(M,w,U,O,Z){const D=O.fog,F=Z.geometry,V=M.isMeshStandardMaterial?O.environment:null,$=(M.isMeshStandardMaterial?e:t).get(M.envMap||V),K=$&&$.mapping===oo?$.image.height:null,Y=g[M.type];M.precision!==null&&(f=s.getMaxPrecision(M.precision),f!==M.precision&&console.warn("THREE.WebGLProgram.getParameters:",M.precision,"not supported, using",f,"instead."));const Q=F.morphAttributes.position||F.morphAttributes.normal||F.morphAttributes.color,et=Q!==void 0?Q.length:0;let pt=0;F.morphAttributes.position!==void 0&&(pt=1),F.morphAttributes.normal!==void 0&&(pt=2),F.morphAttributes.color!==void 0&&(pt=3);let B,J,ct,vt;if(Y){const tn=Vn[Y];B=tn.vertexShader,J=tn.fragmentShader}else B=M.vertexShader,J=M.fragmentShader,l.update(M),ct=l.getVertexShaderID(M),vt=l.getFragmentShaderID(M);const Tt=n.getRenderTarget(),Ft=Z.isInstancedMesh===!0,Nt=Z.isBatchedMesh===!0,Lt=!!M.map,Jt=!!M.matcap,G=!!$,Be=!!M.aoMap,Rt=!!M.lightMap,Ot=!!M.bumpMap,yt=!!M.normalMap,me=!!M.displacementMap,Bt=!!M.emissiveMap,R=!!M.metalnessMap,T=!!M.roughnessMap,W=M.anisotropy>0,rt=M.clearcoat>0,it=M.iridescence>0,st=M.sheen>0,Et=M.transmission>0,gt=W&&!!M.anisotropyMap,bt=rt&&!!M.clearcoatMap,Dt=rt&&!!M.clearcoatNormalMap,Ht=rt&&!!M.clearcoatRoughnessMap,nt=it&&!!M.iridescenceMap,Qt=it&&!!M.iridescenceThicknessMap,P=st&&!!M.sheenColorMap,tt=st&&!!M.sheenRoughnessMap,dt=!!M.specularMap,ot=!!M.specularColorMap,wt=!!M.specularIntensityMap,qt=Et&&!!M.transmissionMap,te=Et&&!!M.thicknessMap,Xt=!!M.gradientMap,ht=!!M.alphaMap,I=M.alphaTest>0,at=!!M.alphaHash,lt=!!M.extensions,Pt=!!F.attributes.uv1,At=!!F.attributes.uv2,ne=!!F.attributes.uv3;let ie=Si;return M.toneMapped&&(Tt===null||Tt.isXRRenderTarget===!0)&&(ie=n.toneMapping),{isWebGL2:h,shaderID:Y,shaderType:M.type,shaderName:M.name,vertexShader:B,fragmentShader:J,defines:M.defines,customVertexShaderID:ct,customFragmentShaderID:vt,isRawShaderMaterial:M.isRawShaderMaterial===!0,glslVersion:M.glslVersion,precision:f,batching:Nt,instancing:Ft,instancingColor:Ft&&Z.instanceColor!==null,supportsVertexTextures:d,outputColorSpace:Tt===null?n.outputColorSpace:Tt.isXRRenderTarget===!0?Tt.texture.colorSpace:si,map:Lt,matcap:Jt,envMap:G,envMapMode:G&&$.mapping,envMapCubeUVHeight:K,aoMap:Be,lightMap:Rt,bumpMap:Ot,normalMap:yt,displacementMap:d&&me,emissiveMap:Bt,normalMapObjectSpace:yt&&M.normalMapType===rg,normalMapTangentSpace:yt&&M.normalMapType===Zh,metalnessMap:R,roughnessMap:T,anisotropy:W,anisotropyMap:gt,clearcoat:rt,clearcoatMap:bt,clearcoatNormalMap:Dt,clearcoatRoughnessMap:Ht,iridescence:it,iridescenceMap:nt,iridescenceThicknessMap:Qt,sheen:st,sheenColorMap:P,sheenRoughnessMap:tt,specularMap:dt,specularColorMap:ot,specularIntensityMap:wt,transmission:Et,transmissionMap:qt,thicknessMap:te,gradientMap:Xt,opaque:M.transparent===!1&&M.blending===Ms,alphaMap:ht,alphaTest:I,alphaHash:at,combine:M.combine,mapUv:Lt&&_(M.map.channel),aoMapUv:Be&&_(M.aoMap.channel),lightMapUv:Rt&&_(M.lightMap.channel),bumpMapUv:Ot&&_(M.bumpMap.channel),normalMapUv:yt&&_(M.normalMap.channel),displacementMapUv:me&&_(M.displacementMap.channel),emissiveMapUv:Bt&&_(M.emissiveMap.channel),metalnessMapUv:R&&_(M.metalnessMap.channel),roughnessMapUv:T&&_(M.roughnessMap.channel),anisotropyMapUv:gt&&_(M.anisotropyMap.channel),clearcoatMapUv:bt&&_(M.clearcoatMap.channel),clearcoatNormalMapUv:Dt&&_(M.clearcoatNormalMap.channel),clearcoatRoughnessMapUv:Ht&&_(M.clearcoatRoughnessMap.channel),iridescenceMapUv:nt&&_(M.iridescenceMap.channel),iridescenceThicknessMapUv:Qt&&_(M.iridescenceThicknessMap.channel),sheenColorMapUv:P&&_(M.sheenColorMap.channel),sheenRoughnessMapUv:tt&&_(M.sheenRoughnessMap.channel),specularMapUv:dt&&_(M.specularMap.channel),specularColorMapUv:ot&&_(M.specularColorMap.channel),specularIntensityMapUv:wt&&_(M.specularIntensityMap.channel),transmissionMapUv:qt&&_(M.transmissionMap.channel),thicknessMapUv:te&&_(M.thicknessMap.channel),alphaMapUv:ht&&_(M.alphaMap.channel),vertexTangents:!!F.attributes.tangent&&(yt||W),vertexColors:M.vertexColors,vertexAlphas:M.vertexColors===!0&&!!F.attributes.color&&F.attributes.color.itemSize===4,vertexUv1s:Pt,vertexUv2s:At,vertexUv3s:ne,pointsUvs:Z.isPoints===!0&&!!F.attributes.uv&&(Lt||ht),fog:!!D,useFog:M.fog===!0,fogExp2:D&&D.isFogExp2,flatShading:M.flatShading===!0,sizeAttenuation:M.sizeAttenuation===!0,logarithmicDepthBuffer:u,skinning:Z.isSkinnedMesh===!0,morphTargets:F.morphAttributes.position!==void 0,morphNormals:F.morphAttributes.normal!==void 0,morphColors:F.morphAttributes.color!==void 0,morphTargetsCount:et,morphTextureStride:pt,numDirLights:w.directional.length,numPointLights:w.point.length,numSpotLights:w.spot.length,numSpotLightMaps:w.spotLightMap.length,numRectAreaLights:w.rectArea.length,numHemiLights:w.hemi.length,numDirLightShadows:w.directionalShadowMap.length,numPointLightShadows:w.pointShadowMap.length,numSpotLightShadows:w.spotShadowMap.length,numSpotLightShadowsWithMaps:w.numSpotLightShadowsWithMaps,numLightProbes:w.numLightProbes,numClippingPlanes:o.numPlanes,numClipIntersection:o.numIntersection,dithering:M.dithering,shadowMapEnabled:n.shadowMap.enabled&&U.length>0,shadowMapType:n.shadowMap.type,toneMapping:ie,useLegacyLights:n._useLegacyLights,decodeVideoTexture:Lt&&M.map.isVideoTexture===!0&&se.getTransfer(M.map.colorSpace)===he,premultipliedAlpha:M.premultipliedAlpha,doubleSided:M.side===dn,flipSided:M.side===sn,useDepthPacking:M.depthPacking>=0,depthPacking:M.depthPacking||0,index0AttributeName:M.index0AttributeName,extensionDerivatives:lt&&M.extensions.derivatives===!0,extensionFragDepth:lt&&M.extensions.fragDepth===!0,extensionDrawBuffers:lt&&M.extensions.drawBuffers===!0,extensionShaderTextureLOD:lt&&M.extensions.shaderTextureLOD===!0,extensionClipCullDistance:lt&&M.extensions.clipCullDistance&&i.has("WEBGL_clip_cull_distance"),rendererExtensionFragDepth:h||i.has("EXT_frag_depth"),rendererExtensionDrawBuffers:h||i.has("WEBGL_draw_buffers"),rendererExtensionShaderTextureLod:h||i.has("EXT_shader_texture_lod"),rendererExtensionParallelShaderCompile:i.has("KHR_parallel_shader_compile"),customProgramCacheKey:M.customProgramCacheKey()}}function p(M){const w=[];if(M.shaderID?w.push(M.shaderID):(w.push(M.customVertexShaderID),w.push(M.customFragmentShaderID)),M.defines!==void 0)for(const U in M.defines)w.push(U),w.push(M.defines[U]);return M.isRawShaderMaterial===!1&&(v(w,M),x(w,M),w.push(n.outputColorSpace)),w.push(M.customProgramCacheKey),w.join()}function v(M,w){M.push(w.precision),M.push(w.outputColorSpace),M.push(w.envMapMode),M.push(w.envMapCubeUVHeight),M.push(w.mapUv),M.push(w.alphaMapUv),M.push(w.lightMapUv),M.push(w.aoMapUv),M.push(w.bumpMapUv),M.push(w.normalMapUv),M.push(w.displacementMapUv),M.push(w.emissiveMapUv),M.push(w.metalnessMapUv),M.push(w.roughnessMapUv),M.push(w.anisotropyMapUv),M.push(w.clearcoatMapUv),M.push(w.clearcoatNormalMapUv),M.push(w.clearcoatRoughnessMapUv),M.push(w.iridescenceMapUv),M.push(w.iridescenceThicknessMapUv),M.push(w.sheenColorMapUv),M.push(w.sheenRoughnessMapUv),M.push(w.specularMapUv),M.push(w.specularColorMapUv),M.push(w.specularIntensityMapUv),M.push(w.transmissionMapUv),M.push(w.thicknessMapUv),M.push(w.combine),M.push(w.fogExp2),M.push(w.sizeAttenuation),M.push(w.morphTargetsCount),M.push(w.morphAttributeCount),M.push(w.numDirLights),M.push(w.numPointLights),M.push(w.numSpotLights),M.push(w.numSpotLightMaps),M.push(w.numHemiLights),M.push(w.numRectAreaLights),M.push(w.numDirLightShadows),M.push(w.numPointLightShadows),M.push(w.numSpotLightShadows),M.push(w.numSpotLightShadowsWithMaps),M.push(w.numLightProbes),M.push(w.shadowMapType),M.push(w.toneMapping),M.push(w.numClippingPlanes),M.push(w.numClipIntersection),M.push(w.depthPacking)}function x(M,w){a.disableAll(),w.isWebGL2&&a.enable(0),w.supportsVertexTextures&&a.enable(1),w.instancing&&a.enable(2),w.instancingColor&&a.enable(3),w.matcap&&a.enable(4),w.envMap&&a.enable(5),w.normalMapObjectSpace&&a.enable(6),w.normalMapTangentSpace&&a.enable(7),w.clearcoat&&a.enable(8),w.iridescence&&a.enable(9),w.alphaTest&&a.enable(10),w.vertexColors&&a.enable(11),w.vertexAlphas&&a.enable(12),w.vertexUv1s&&a.enable(13),w.vertexUv2s&&a.enable(14),w.vertexUv3s&&a.enable(15),w.vertexTangents&&a.enable(16),w.anisotropy&&a.enable(17),w.alphaHash&&a.enable(18),w.batching&&a.enable(19),M.push(a.mask),a.disableAll(),w.fog&&a.enable(0),w.useFog&&a.enable(1),w.flatShading&&a.enable(2),w.logarithmicDepthBuffer&&a.enable(3),w.skinning&&a.enable(4),w.morphTargets&&a.enable(5),w.morphNormals&&a.enable(6),w.morphColors&&a.enable(7),w.premultipliedAlpha&&a.enable(8),w.shadowMapEnabled&&a.enable(9),w.useLegacyLights&&a.enable(10),w.doubleSided&&a.enable(11),w.flipSided&&a.enable(12),w.useDepthPacking&&a.enable(13),w.dithering&&a.enable(14),w.transmission&&a.enable(15),w.sheen&&a.enable(16),w.opaque&&a.enable(17),w.pointsUvs&&a.enable(18),w.decodeVideoTexture&&a.enable(19),M.push(a.mask)}function y(M){const w=g[M.type];let U;if(w){const O=Vn[w];U=gr.clone(O.uniforms)}else U=M.uniforms;return U}function b(M,w){let U;for(let O=0,Z=c.length;O<Z;O++){const D=c[O];if(D.cacheKey===w){U=D,++U.usedTimes;break}}return U===void 0&&(U=new fv(n,w,M,r),c.push(U)),U}function E(M){if(--M.usedTimes===0){const w=c.indexOf(M);c[w]=c[c.length-1],c.pop(),M.destroy()}}function S(M){l.remove(M)}function C(){l.dispose()}return{getParameters:m,getProgramCacheKey:p,getUniforms:y,acquireProgram:b,releaseProgram:E,releaseShaderCache:S,programs:c,dispose:C}}function xv(){let n=new WeakMap;function t(r){let o=n.get(r);return o===void 0&&(o={},n.set(r,o)),o}function e(r){n.delete(r)}function i(r,o,a){n.get(r)[o]=a}function s(){n=new WeakMap}return{get:t,remove:e,update:i,dispose:s}}function vv(n,t){return n.groupOrder!==t.groupOrder?n.groupOrder-t.groupOrder:n.renderOrder!==t.renderOrder?n.renderOrder-t.renderOrder:n.material.id!==t.material.id?n.material.id-t.material.id:n.z!==t.z?n.z-t.z:n.id-t.id}function ed(n,t){return n.groupOrder!==t.groupOrder?n.groupOrder-t.groupOrder:n.renderOrder!==t.renderOrder?n.renderOrder-t.renderOrder:n.z!==t.z?t.z-n.z:n.id-t.id}function nd(){const n=[];let t=0;const e=[],i=[],s=[];function r(){t=0,e.length=0,i.length=0,s.length=0}function o(u,d,f,g,_,m){let p=n[t];return p===void 0?(p={id:u.id,object:u,geometry:d,material:f,groupOrder:g,renderOrder:u.renderOrder,z:_,group:m},n[t]=p):(p.id=u.id,p.object=u,p.geometry=d,p.material=f,p.groupOrder=g,p.renderOrder=u.renderOrder,p.z=_,p.group=m),t++,p}function a(u,d,f,g,_,m){const p=o(u,d,f,g,_,m);f.transmission>0?i.push(p):f.transparent===!0?s.push(p):e.push(p)}function l(u,d,f,g,_,m){const p=o(u,d,f,g,_,m);f.transmission>0?i.unshift(p):f.transparent===!0?s.unshift(p):e.unshift(p)}function c(u,d){e.length>1&&e.sort(u||vv),i.length>1&&i.sort(d||ed),s.length>1&&s.sort(d||ed)}function h(){for(let u=t,d=n.length;u<d;u++){const f=n[u];if(f.id===null)break;f.id=null,f.object=null,f.geometry=null,f.material=null,f.group=null}}return{opaque:e,transmissive:i,transparent:s,init:r,push:a,unshift:l,finish:h,sort:c}}function bv(){let n=new WeakMap;function t(i,s){const r=n.get(i);let o;return r===void 0?(o=new nd,n.set(i,[o])):s>=r.length?(o=new nd,r.push(o)):o=r[s],o}function e(){n=new WeakMap}return{get:t,dispose:e}}function Mv(){const n={};return{get:function(t){if(n[t.id]!==void 0)return n[t.id];let e;switch(t.type){case"DirectionalLight":e={direction:new L,color:new xt};break;case"SpotLight":e={position:new L,direction:new L,color:new xt,distance:0,coneCos:0,penumbraCos:0,decay:0};break;case"PointLight":e={position:new L,color:new xt,distance:0,decay:0};break;case"HemisphereLight":e={direction:new L,skyColor:new xt,groundColor:new xt};break;case"RectAreaLight":e={color:new xt,position:new L,halfWidth:new L,halfHeight:new L};break}return n[t.id]=e,e}}}function yv(){const n={};return{get:function(t){if(n[t.id]!==void 0)return n[t.id];let e;switch(t.type){case"DirectionalLight":e={shadowBias:0,shadowNormalBias:0,shadowRadius:1,shadowMapSize:new St};break;case"SpotLight":e={shadowBias:0,shadowNormalBias:0,shadowRadius:1,shadowMapSize:new St};break;case"PointLight":e={shadowBias:0,shadowNormalBias:0,shadowRadius:1,shadowMapSize:new St,shadowCameraNear:1,shadowCameraFar:1e3};break}return n[t.id]=e,e}}}let Sv=0;function Ev(n,t){return(t.castShadow?2:0)-(n.castShadow?2:0)+(t.map?1:0)-(n.map?1:0)}function Tv(n,t){const e=new Mv,i=yv(),s={version:0,hash:{directionalLength:-1,pointLength:-1,spotLength:-1,rectAreaLength:-1,hemiLength:-1,numDirectionalShadows:-1,numPointShadows:-1,numSpotShadows:-1,numSpotMaps:-1,numLightProbes:-1},ambient:[0,0,0],probe:[],directional:[],directionalShadow:[],directionalShadowMap:[],directionalShadowMatrix:[],spot:[],spotLightMap:[],spotShadow:[],spotShadowMap:[],spotLightMatrix:[],rectArea:[],rectAreaLTC1:null,rectAreaLTC2:null,point:[],pointShadow:[],pointShadowMap:[],pointShadowMatrix:[],hemi:[],numSpotLightShadowsWithMaps:0,numLightProbes:0};for(let h=0;h<9;h++)s.probe.push(new L);const r=new L,o=new ge,a=new ge;function l(h,u){let d=0,f=0,g=0;for(let O=0;O<9;O++)s.probe[O].set(0,0,0);let _=0,m=0,p=0,v=0,x=0,y=0,b=0,E=0,S=0,C=0,M=0;h.sort(Ev);const w=u===!0?Math.PI:1;for(let O=0,Z=h.length;O<Z;O++){const D=h[O],F=D.color,V=D.intensity,$=D.distance,K=D.shadow&&D.shadow.map?D.shadow.map.texture:null;if(D.isAmbientLight)d+=F.r*V*w,f+=F.g*V*w,g+=F.b*V*w;else if(D.isLightProbe){for(let Y=0;Y<9;Y++)s.probe[Y].addScaledVector(D.sh.coefficients[Y],V);M++}else if(D.isDirectionalLight){const Y=e.get(D);if(Y.color.copy(D.color).multiplyScalar(D.intensity*w),D.castShadow){const Q=D.shadow,et=i.get(D);et.shadowBias=Q.bias,et.shadowNormalBias=Q.normalBias,et.shadowRadius=Q.radius,et.shadowMapSize=Q.mapSize,s.directionalShadow[_]=et,s.directionalShadowMap[_]=K,s.directionalShadowMatrix[_]=D.shadow.matrix,y++}s.directional[_]=Y,_++}else if(D.isSpotLight){const Y=e.get(D);Y.position.setFromMatrixPosition(D.matrixWorld),Y.color.copy(F).multiplyScalar(V*w),Y.distance=$,Y.coneCos=Math.cos(D.angle),Y.penumbraCos=Math.cos(D.angle*(1-D.penumbra)),Y.decay=D.decay,s.spot[p]=Y;const Q=D.shadow;if(D.map&&(s.spotLightMap[S]=D.map,S++,Q.updateMatrices(D),D.castShadow&&C++),s.spotLightMatrix[p]=Q.matrix,D.castShadow){const et=i.get(D);et.shadowBias=Q.bias,et.shadowNormalBias=Q.normalBias,et.shadowRadius=Q.radius,et.shadowMapSize=Q.mapSize,s.spotShadow[p]=et,s.spotShadowMap[p]=K,E++}p++}else if(D.isRectAreaLight){const Y=e.get(D);Y.color.copy(F).multiplyScalar(V),Y.halfWidth.set(D.width*.5,0,0),Y.halfHeight.set(0,D.height*.5,0),s.rectArea[v]=Y,v++}else if(D.isPointLight){const Y=e.get(D);if(Y.color.copy(D.color).multiplyScalar(D.intensity*w),Y.distance=D.distance,Y.decay=D.decay,D.castShadow){const Q=D.shadow,et=i.get(D);et.shadowBias=Q.bias,et.shadowNormalBias=Q.normalBias,et.shadowRadius=Q.radius,et.shadowMapSize=Q.mapSize,et.shadowCameraNear=Q.camera.near,et.shadowCameraFar=Q.camera.far,s.pointShadow[m]=et,s.pointShadowMap[m]=K,s.pointShadowMatrix[m]=D.shadow.matrix,b++}s.point[m]=Y,m++}else if(D.isHemisphereLight){const Y=e.get(D);Y.skyColor.copy(D.color).multiplyScalar(V*w),Y.groundColor.copy(D.groundColor).multiplyScalar(V*w),s.hemi[x]=Y,x++}}v>0&&(t.isWebGL2?n.has("OES_texture_float_linear")===!0?(s.rectAreaLTC1=ft.LTC_FLOAT_1,s.rectAreaLTC2=ft.LTC_FLOAT_2):(s.rectAreaLTC1=ft.LTC_HALF_1,s.rectAreaLTC2=ft.LTC_HALF_2):n.has("OES_texture_float_linear")===!0?(s.rectAreaLTC1=ft.LTC_FLOAT_1,s.rectAreaLTC2=ft.LTC_FLOAT_2):n.has("OES_texture_half_float_linear")===!0?(s.rectAreaLTC1=ft.LTC_HALF_1,s.rectAreaLTC2=ft.LTC_HALF_2):console.error("THREE.WebGLRenderer: Unable to use RectAreaLight. Missing WebGL extensions.")),s.ambient[0]=d,s.ambient[1]=f,s.ambient[2]=g;const U=s.hash;(U.directionalLength!==_||U.pointLength!==m||U.spotLength!==p||U.rectAreaLength!==v||U.hemiLength!==x||U.numDirectionalShadows!==y||U.numPointShadows!==b||U.numSpotShadows!==E||U.numSpotMaps!==S||U.numLightProbes!==M)&&(s.directional.length=_,s.spot.length=p,s.rectArea.length=v,s.point.length=m,s.hemi.length=x,s.directionalShadow.length=y,s.directionalShadowMap.length=y,s.pointShadow.length=b,s.pointShadowMap.length=b,s.spotShadow.length=E,s.spotShadowMap.length=E,s.directionalShadowMatrix.length=y,s.pointShadowMatrix.length=b,s.spotLightMatrix.length=E+S-C,s.spotLightMap.length=S,s.numSpotLightShadowsWithMaps=C,s.numLightProbes=M,U.directionalLength=_,U.pointLength=m,U.spotLength=p,U.rectAreaLength=v,U.hemiLength=x,U.numDirectionalShadows=y,U.numPointShadows=b,U.numSpotShadows=E,U.numSpotMaps=S,U.numLightProbes=M,s.version=Sv++)}function c(h,u){let d=0,f=0,g=0,_=0,m=0;const p=u.matrixWorldInverse;for(let v=0,x=h.length;v<x;v++){const y=h[v];if(y.isDirectionalLight){const b=s.directional[d];b.direction.setFromMatrixPosition(y.matrixWorld),r.setFromMatrixPosition(y.target.matrixWorld),b.direction.sub(r),b.direction.transformDirection(p),d++}else if(y.isSpotLight){const b=s.spot[g];b.position.setFromMatrixPosition(y.matrixWorld),b.position.applyMatrix4(p),b.direction.setFromMatrixPosition(y.matrixWorld),r.setFromMatrixPosition(y.target.matrixWorld),b.direction.sub(r),b.direction.transformDirection(p),g++}else if(y.isRectAreaLight){const b=s.rectArea[_];b.position.setFromMatrixPosition(y.matrixWorld),b.position.applyMatrix4(p),a.identity(),o.copy(y.matrixWorld),o.premultiply(p),a.extractRotation(o),b.halfWidth.set(y.width*.5,0,0),b.halfHeight.set(0,y.height*.5,0),b.halfWidth.applyMatrix4(a),b.halfHeight.applyMatrix4(a),_++}else if(y.isPointLight){const b=s.point[f];b.position.setFromMatrixPosition(y.matrixWorld),b.position.applyMatrix4(p),f++}else if(y.isHemisphereLight){const b=s.hemi[m];b.direction.setFromMatrixPosition(y.matrixWorld),b.direction.transformDirection(p),m++}}}return{setup:l,setupView:c,state:s}}function id(n,t){const e=new Tv(n,t),i=[],s=[];function r(){i.length=0,s.length=0}function o(u){i.push(u)}function a(u){s.push(u)}function l(u){e.setup(i,u)}function c(u){e.setupView(i,u)}return{init:r,state:{lightsArray:i,shadowsArray:s,lights:e},setupLights:l,setupLightsView:c,pushLight:o,pushShadow:a}}function wv(n,t){let e=new WeakMap;function i(r,o=0){const a=e.get(r);let l;return a===void 0?(l=new id(n,t),e.set(r,[l])):o>=a.length?(l=new id(n,t),a.push(l)):l=a[o],l}function s(){e=new WeakMap}return{get:i,dispose:s}}class Av extends Fs{constructor(t){super(),this.isMeshDepthMaterial=!0,this.type="MeshDepthMaterial",this.depthPacking=ig,this.map=null,this.alphaMap=null,this.displacementMap=null,this.displacementScale=1,this.displacementBias=0,this.wireframe=!1,this.wireframeLinewidth=1,this.setValues(t)}copy(t){return super.copy(t),this.depthPacking=t.depthPacking,this.map=t.map,this.alphaMap=t.alphaMap,this.displacementMap=t.displacementMap,this.displacementScale=t.displacementScale,this.displacementBias=t.displacementBias,this.wireframe=t.wireframe,this.wireframeLinewidth=t.wireframeLinewidth,this}}class Cv extends Fs{constructor(t){super(),this.isMeshDistanceMaterial=!0,this.type="MeshDistanceMaterial",this.map=null,this.alphaMap=null,this.displacementMap=null,this.displacementScale=1,this.displacementBias=0,this.setValues(t)}copy(t){return super.copy(t),this.map=t.map,this.alphaMap=t.alphaMap,this.displacementMap=t.displacementMap,this.displacementScale=t.displacementScale,this.displacementBias=t.displacementBias,this}}const Rv=`void main() {
	gl_Position = vec4( position, 1.0 );
}`,Pv=`uniform sampler2D shadow_pass;
uniform vec2 resolution;
uniform float radius;
#include <packing>
void main() {
	const float samples = float( VSM_SAMPLES );
	float mean = 0.0;
	float squared_mean = 0.0;
	float uvStride = samples <= 1.0 ? 0.0 : 2.0 / ( samples - 1.0 );
	float uvStart = samples <= 1.0 ? 0.0 : - 1.0;
	for ( float i = 0.0; i < samples; i ++ ) {
		float uvOffset = uvStart + i * uvStride;
		#ifdef HORIZONTAL_PASS
			vec2 distribution = unpackRGBATo2Half( texture2D( shadow_pass, ( gl_FragCoord.xy + vec2( uvOffset, 0.0 ) * radius ) / resolution ) );
			mean += distribution.x;
			squared_mean += distribution.y * distribution.y + distribution.x * distribution.x;
		#else
			float depth = unpackRGBAToDepth( texture2D( shadow_pass, ( gl_FragCoord.xy + vec2( 0.0, uvOffset ) * radius ) / resolution ) );
			mean += depth;
			squared_mean += depth * depth;
		#endif
	}
	mean = mean / samples;
	squared_mean = squared_mean / samples;
	float std_dev = sqrt( squared_mean - mean * mean );
	gl_FragColor = pack2HalfToRGBA( vec2( mean, std_dev ) );
}`;function Lv(n,t,e){let i=new Al;const s=new St,r=new St,o=new Ue,a=new Av({depthPacking:sg}),l=new Cv,c={},h=e.maxTextureSize,u={[yi]:sn,[sn]:yi,[dn]:dn},d=new an({defines:{VSM_SAMPLES:8},uniforms:{shadow_pass:{value:null},resolution:{value:new St},radius:{value:4}},vertexShader:Rv,fragmentShader:Pv}),f=d.clone();f.defines.HORIZONTAL_PASS=1;const g=new Ce;g.setAttribute("position",new Tn(new Float32Array([-1,-1,.5,3,-1,.5,-1,3,.5]),3));const _=new Kt(g,d),m=this;this.enabled=!1,this.autoUpdate=!0,this.needsUpdate=!1,this.type=rh;let p=this.type;this.render=function(E,S,C){if(m.enabled===!1||m.autoUpdate===!1&&m.needsUpdate===!1||E.length===0)return;const M=n.getRenderTarget(),w=n.getActiveCubeFace(),U=n.getActiveMipmapLevel(),O=n.state;O.setBlending(ni),O.buffers.color.setClear(1,1,1,1),O.buffers.depth.setTest(!0),O.setScissorTest(!1);const Z=p!==ei&&this.type===ei,D=p===ei&&this.type!==ei;for(let F=0,V=E.length;F<V;F++){const $=E[F],K=$.shadow;if(K===void 0){console.warn("THREE.WebGLShadowMap:",$,"has no shadow.");continue}if(K.autoUpdate===!1&&K.needsUpdate===!1)continue;s.copy(K.mapSize);const Y=K.getFrameExtents();if(s.multiply(Y),r.copy(K.mapSize),(s.x>h||s.y>h)&&(s.x>h&&(r.x=Math.floor(h/Y.x),s.x=r.x*Y.x,K.mapSize.x=r.x),s.y>h&&(r.y=Math.floor(h/Y.y),s.y=r.y*Y.y,K.mapSize.y=r.y)),K.map===null||Z===!0||D===!0){const et=this.type!==ei?{minFilter:Ze,magFilter:Ze}:{};K.map!==null&&K.map.dispose(),K.map=new On(s.x,s.y,et),K.map.texture.name=$.name+".shadowMap",K.camera.updateProjectionMatrix()}n.setRenderTarget(K.map),n.clear();const Q=K.getViewportCount();for(let et=0;et<Q;et++){const pt=K.getViewport(et);o.set(r.x*pt.x,r.y*pt.y,r.x*pt.z,r.y*pt.w),O.viewport(o),K.updateMatrices($,et),i=K.getFrustum(),y(S,C,K.camera,$,this.type)}K.isPointLightShadow!==!0&&this.type===ei&&v(K,C),K.needsUpdate=!1}p=this.type,m.needsUpdate=!1,n.setRenderTarget(M,w,U)};function v(E,S){const C=t.update(_);d.defines.VSM_SAMPLES!==E.blurSamples&&(d.defines.VSM_SAMPLES=E.blurSamples,f.defines.VSM_SAMPLES=E.blurSamples,d.needsUpdate=!0,f.needsUpdate=!0),E.mapPass===null&&(E.mapPass=new On(s.x,s.y)),d.uniforms.shadow_pass.value=E.map.texture,d.uniforms.resolution.value=E.mapSize,d.uniforms.radius.value=E.radius,n.setRenderTarget(E.mapPass),n.clear(),n.renderBufferDirect(S,null,C,d,_,null),f.uniforms.shadow_pass.value=E.mapPass.texture,f.uniforms.resolution.value=E.mapSize,f.uniforms.radius.value=E.radius,n.setRenderTarget(E.map),n.clear(),n.renderBufferDirect(S,null,C,f,_,null)}function x(E,S,C,M){let w=null;const U=C.isPointLight===!0?E.customDistanceMaterial:E.customDepthMaterial;if(U!==void 0)w=U;else if(w=C.isPointLight===!0?l:a,n.localClippingEnabled&&S.clipShadows===!0&&Array.isArray(S.clippingPlanes)&&S.clippingPlanes.length!==0||S.displacementMap&&S.displacementScale!==0||S.alphaMap&&S.alphaTest>0||S.map&&S.alphaTest>0){const O=w.uuid,Z=S.uuid;let D=c[O];D===void 0&&(D={},c[O]=D);let F=D[Z];F===void 0&&(F=w.clone(),D[Z]=F,S.addEventListener("dispose",b)),w=F}if(w.visible=S.visible,w.wireframe=S.wireframe,M===ei?w.side=S.shadowSide!==null?S.shadowSide:S.side:w.side=S.shadowSide!==null?S.shadowSide:u[S.side],w.alphaMap=S.alphaMap,w.alphaTest=S.alphaTest,w.map=S.map,w.clipShadows=S.clipShadows,w.clippingPlanes=S.clippingPlanes,w.clipIntersection=S.clipIntersection,w.displacementMap=S.displacementMap,w.displacementScale=S.displacementScale,w.displacementBias=S.displacementBias,w.wireframeLinewidth=S.wireframeLinewidth,w.linewidth=S.linewidth,C.isPointLight===!0&&w.isMeshDistanceMaterial===!0){const O=n.properties.get(w);O.light=C}return w}function y(E,S,C,M,w){if(E.visible===!1)return;if(E.layers.test(S.layers)&&(E.isMesh||E.isLine||E.isPoints)&&(E.castShadow||E.receiveShadow&&w===ei)&&(!E.frustumCulled||i.intersectsObject(E))){E.modelViewMatrix.multiplyMatrices(C.matrixWorldInverse,E.matrixWorld);const Z=t.update(E),D=E.material;if(Array.isArray(D)){const F=Z.groups;for(let V=0,$=F.length;V<$;V++){const K=F[V],Y=D[K.materialIndex];if(Y&&Y.visible){const Q=x(E,Y,M,w);E.onBeforeShadow(n,E,S,C,Z,Q,K),n.renderBufferDirect(C,null,Z,Q,E,K),E.onAfterShadow(n,E,S,C,Z,Q,K)}}}else if(D.visible){const F=x(E,D,M,w);E.onBeforeShadow(n,E,S,C,Z,F,null),n.renderBufferDirect(C,null,Z,F,E,null),E.onAfterShadow(n,E,S,C,Z,F,null)}}const O=E.children;for(let Z=0,D=O.length;Z<D;Z++)y(O[Z],S,C,M,w)}function b(E){E.target.removeEventListener("dispose",b);for(const C in c){const M=c[C],w=E.target.uuid;w in M&&(M[w].dispose(),delete M[w])}}}function Dv(n,t,e){const i=e.isWebGL2;function s(){let I=!1;const at=new Ue;let lt=null;const Pt=new Ue(0,0,0,0);return{setMask:function(At){lt!==At&&!I&&(n.colorMask(At,At,At,At),lt=At)},setLocked:function(At){I=At},setClear:function(At,ne,ie,ze,tn){tn===!0&&(At*=ze,ne*=ze,ie*=ze),at.set(At,ne,ie,ze),Pt.equals(at)===!1&&(n.clearColor(At,ne,ie,ze),Pt.copy(at))},reset:function(){I=!1,lt=null,Pt.set(-1,0,0,0)}}}function r(){let I=!1,at=null,lt=null,Pt=null;return{setTest:function(At){At?Nt(n.DEPTH_TEST):Lt(n.DEPTH_TEST)},setMask:function(At){at!==At&&!I&&(n.depthMask(At),at=At)},setFunc:function(At){if(lt!==At){switch(At){case km:n.depthFunc(n.NEVER);break;case Bm:n.depthFunc(n.ALWAYS);break;case zm:n.depthFunc(n.LESS);break;case ro:n.depthFunc(n.LEQUAL);break;case Hm:n.depthFunc(n.EQUAL);break;case Vm:n.depthFunc(n.GEQUAL);break;case Gm:n.depthFunc(n.GREATER);break;case Wm:n.depthFunc(n.NOTEQUAL);break;default:n.depthFunc(n.LEQUAL)}lt=At}},setLocked:function(At){I=At},setClear:function(At){Pt!==At&&(n.clearDepth(At),Pt=At)},reset:function(){I=!1,at=null,lt=null,Pt=null}}}function o(){let I=!1,at=null,lt=null,Pt=null,At=null,ne=null,ie=null,ze=null,tn=null;return{setTest:function(de){I||(de?Nt(n.STENCIL_TEST):Lt(n.STENCIL_TEST))},setMask:function(de){at!==de&&!I&&(n.stencilMask(de),at=de)},setFunc:function(de,en,ti){(lt!==de||Pt!==en||At!==ti)&&(n.stencilFunc(de,en,ti),lt=de,Pt=en,At=ti)},setOp:function(de,en,ti){(ne!==de||ie!==en||ze!==ti)&&(n.stencilOp(de,en,ti),ne=de,ie=en,ze=ti)},setLocked:function(de){I=de},setClear:function(de){tn!==de&&(n.clearStencil(de),tn=de)},reset:function(){I=!1,at=null,lt=null,Pt=null,At=null,ne=null,ie=null,ze=null,tn=null}}}const a=new s,l=new r,c=new o,h=new WeakMap,u=new WeakMap;let d={},f={},g=new WeakMap,_=[],m=null,p=!1,v=null,x=null,y=null,b=null,E=null,S=null,C=null,M=new xt(0,0,0),w=0,U=!1,O=null,Z=null,D=null,F=null,V=null;const $=n.getParameter(n.MAX_COMBINED_TEXTURE_IMAGE_UNITS);let K=!1,Y=0;const Q=n.getParameter(n.VERSION);Q.indexOf("WebGL")!==-1?(Y=parseFloat(/^WebGL (\d)/.exec(Q)[1]),K=Y>=1):Q.indexOf("OpenGL ES")!==-1&&(Y=parseFloat(/^OpenGL ES (\d)/.exec(Q)[1]),K=Y>=2);let et=null,pt={};const B=n.getParameter(n.SCISSOR_BOX),J=n.getParameter(n.VIEWPORT),ct=new Ue().fromArray(B),vt=new Ue().fromArray(J);function Tt(I,at,lt,Pt){const At=new Uint8Array(4),ne=n.createTexture();n.bindTexture(I,ne),n.texParameteri(I,n.TEXTURE_MIN_FILTER,n.NEAREST),n.texParameteri(I,n.TEXTURE_MAG_FILTER,n.NEAREST);for(let ie=0;ie<lt;ie++)i&&(I===n.TEXTURE_3D||I===n.TEXTURE_2D_ARRAY)?n.texImage3D(at,0,n.RGBA,1,1,Pt,0,n.RGBA,n.UNSIGNED_BYTE,At):n.texImage2D(at+ie,0,n.RGBA,1,1,0,n.RGBA,n.UNSIGNED_BYTE,At);return ne}const Ft={};Ft[n.TEXTURE_2D]=Tt(n.TEXTURE_2D,n.TEXTURE_2D,1),Ft[n.TEXTURE_CUBE_MAP]=Tt(n.TEXTURE_CUBE_MAP,n.TEXTURE_CUBE_MAP_POSITIVE_X,6),i&&(Ft[n.TEXTURE_2D_ARRAY]=Tt(n.TEXTURE_2D_ARRAY,n.TEXTURE_2D_ARRAY,1,1),Ft[n.TEXTURE_3D]=Tt(n.TEXTURE_3D,n.TEXTURE_3D,1,1)),a.setClear(0,0,0,1),l.setClear(1),c.setClear(0),Nt(n.DEPTH_TEST),l.setFunc(ro),Bt(!1),R(sh),Nt(n.CULL_FACE),yt(ni);function Nt(I){d[I]!==!0&&(n.enable(I),d[I]=!0)}function Lt(I){d[I]!==!1&&(n.disable(I),d[I]=!1)}function Jt(I,at){return f[I]!==at?(n.bindFramebuffer(I,at),f[I]=at,i&&(I===n.DRAW_FRAMEBUFFER&&(f[n.FRAMEBUFFER]=at),I===n.FRAMEBUFFER&&(f[n.DRAW_FRAMEBUFFER]=at)),!0):!1}function G(I,at){let lt=_,Pt=!1;if(I)if(lt=g.get(at),lt===void 0&&(lt=[],g.set(at,lt)),I.isWebGLMultipleRenderTargets){const At=I.texture;if(lt.length!==At.length||lt[0]!==n.COLOR_ATTACHMENT0){for(let ne=0,ie=At.length;ne<ie;ne++)lt[ne]=n.COLOR_ATTACHMENT0+ne;lt.length=At.length,Pt=!0}}else lt[0]!==n.COLOR_ATTACHMENT0&&(lt[0]=n.COLOR_ATTACHMENT0,Pt=!0);else lt[0]!==n.BACK&&(lt[0]=n.BACK,Pt=!0);Pt&&(e.isWebGL2?n.drawBuffers(lt):t.get("WEBGL_draw_buffers").drawBuffersWEBGL(lt))}function Be(I){return m!==I?(n.useProgram(I),m=I,!0):!1}const Rt={[Wi]:n.FUNC_ADD,[Sm]:n.FUNC_SUBTRACT,[Em]:n.FUNC_REVERSE_SUBTRACT};if(i)Rt[ch]=n.MIN,Rt[hh]=n.MAX;else{const I=t.get("EXT_blend_minmax");I!==null&&(Rt[ch]=I.MIN_EXT,Rt[hh]=I.MAX_EXT)}const Ot={[Tm]:n.ZERO,[wm]:n.ONE,[Am]:n.SRC_COLOR,[Wa]:n.SRC_ALPHA,[Im]:n.SRC_ALPHA_SATURATE,[Lm]:n.DST_COLOR,[Rm]:n.DST_ALPHA,[Cm]:n.ONE_MINUS_SRC_COLOR,[Xa]:n.ONE_MINUS_SRC_ALPHA,[Dm]:n.ONE_MINUS_DST_COLOR,[Pm]:n.ONE_MINUS_DST_ALPHA,[Om]:n.CONSTANT_COLOR,[Um]:n.ONE_MINUS_CONSTANT_COLOR,[Fm]:n.CONSTANT_ALPHA,[Nm]:n.ONE_MINUS_CONSTANT_ALPHA};function yt(I,at,lt,Pt,At,ne,ie,ze,tn,de){if(I===ni){p===!0&&(Lt(n.BLEND),p=!1);return}if(p===!1&&(Nt(n.BLEND),p=!0),I!==ym){if(I!==v||de!==U){if((x!==Wi||E!==Wi)&&(n.blendEquation(n.FUNC_ADD),x=Wi,E=Wi),de)switch(I){case Ms:n.blendFuncSeparate(n.ONE,n.ONE_MINUS_SRC_ALPHA,n.ONE,n.ONE_MINUS_SRC_ALPHA);break;case Ga:n.blendFunc(n.ONE,n.ONE);break;case ah:n.blendFuncSeparate(n.ZERO,n.ONE_MINUS_SRC_COLOR,n.ZERO,n.ONE);break;case lh:n.blendFuncSeparate(n.ZERO,n.SRC_COLOR,n.ZERO,n.SRC_ALPHA);break;default:console.error("THREE.WebGLState: Invalid blending: ",I);break}else switch(I){case Ms:n.blendFuncSeparate(n.SRC_ALPHA,n.ONE_MINUS_SRC_ALPHA,n.ONE,n.ONE_MINUS_SRC_ALPHA);break;case Ga:n.blendFunc(n.SRC_ALPHA,n.ONE);break;case ah:n.blendFuncSeparate(n.ZERO,n.ONE_MINUS_SRC_COLOR,n.ZERO,n.ONE);break;case lh:n.blendFunc(n.ZERO,n.SRC_COLOR);break;default:console.error("THREE.WebGLState: Invalid blending: ",I);break}y=null,b=null,S=null,C=null,M.set(0,0,0),w=0,v=I,U=de}return}At=At||at,ne=ne||lt,ie=ie||Pt,(at!==x||At!==E)&&(n.blendEquationSeparate(Rt[at],Rt[At]),x=at,E=At),(lt!==y||Pt!==b||ne!==S||ie!==C)&&(n.blendFuncSeparate(Ot[lt],Ot[Pt],Ot[ne],Ot[ie]),y=lt,b=Pt,S=ne,C=ie),(ze.equals(M)===!1||tn!==w)&&(n.blendColor(ze.r,ze.g,ze.b,tn),M.copy(ze),w=tn),v=I,U=!1}function me(I,at){I.side===dn?Lt(n.CULL_FACE):Nt(n.CULL_FACE);let lt=I.side===sn;at&&(lt=!lt),Bt(lt),I.blending===Ms&&I.transparent===!1?yt(ni):yt(I.blending,I.blendEquation,I.blendSrc,I.blendDst,I.blendEquationAlpha,I.blendSrcAlpha,I.blendDstAlpha,I.blendColor,I.blendAlpha,I.premultipliedAlpha),l.setFunc(I.depthFunc),l.setTest(I.depthTest),l.setMask(I.depthWrite),a.setMask(I.colorWrite);const Pt=I.stencilWrite;c.setTest(Pt),Pt&&(c.setMask(I.stencilWriteMask),c.setFunc(I.stencilFunc,I.stencilRef,I.stencilFuncMask),c.setOp(I.stencilFail,I.stencilZFail,I.stencilZPass)),W(I.polygonOffset,I.polygonOffsetFactor,I.polygonOffsetUnits),I.alphaToCoverage===!0?Nt(n.SAMPLE_ALPHA_TO_COVERAGE):Lt(n.SAMPLE_ALPHA_TO_COVERAGE)}function Bt(I){O!==I&&(I?n.frontFace(n.CW):n.frontFace(n.CCW),O=I)}function R(I){I!==bm?(Nt(n.CULL_FACE),I!==Z&&(I===sh?n.cullFace(n.BACK):I===Mm?n.cullFace(n.FRONT):n.cullFace(n.FRONT_AND_BACK))):Lt(n.CULL_FACE),Z=I}function T(I){I!==D&&(K&&n.lineWidth(I),D=I)}function W(I,at,lt){I?(Nt(n.POLYGON_OFFSET_FILL),(F!==at||V!==lt)&&(n.polygonOffset(at,lt),F=at,V=lt)):Lt(n.POLYGON_OFFSET_FILL)}function rt(I){I?Nt(n.SCISSOR_TEST):Lt(n.SCISSOR_TEST)}function it(I){I===void 0&&(I=n.TEXTURE0+$-1),et!==I&&(n.activeTexture(I),et=I)}function st(I,at,lt){lt===void 0&&(et===null?lt=n.TEXTURE0+$-1:lt=et);let Pt=pt[lt];Pt===void 0&&(Pt={type:void 0,texture:void 0},pt[lt]=Pt),(Pt.type!==I||Pt.texture!==at)&&(et!==lt&&(n.activeTexture(lt),et=lt),n.bindTexture(I,at||Ft[I]),Pt.type=I,Pt.texture=at)}function Et(){const I=pt[et];I!==void 0&&I.type!==void 0&&(n.bindTexture(I.type,null),I.type=void 0,I.texture=void 0)}function gt(){try{n.compressedTexImage2D.apply(n,arguments)}catch(I){console.error("THREE.WebGLState:",I)}}function bt(){try{n.compressedTexImage3D.apply(n,arguments)}catch(I){console.error("THREE.WebGLState:",I)}}function Dt(){try{n.texSubImage2D.apply(n,arguments)}catch(I){console.error("THREE.WebGLState:",I)}}function Ht(){try{n.texSubImage3D.apply(n,arguments)}catch(I){console.error("THREE.WebGLState:",I)}}function nt(){try{n.compressedTexSubImage2D.apply(n,arguments)}catch(I){console.error("THREE.WebGLState:",I)}}function Qt(){try{n.compressedTexSubImage3D.apply(n,arguments)}catch(I){console.error("THREE.WebGLState:",I)}}function P(){try{n.texStorage2D.apply(n,arguments)}catch(I){console.error("THREE.WebGLState:",I)}}function tt(){try{n.texStorage3D.apply(n,arguments)}catch(I){console.error("THREE.WebGLState:",I)}}function dt(){try{n.texImage2D.apply(n,arguments)}catch(I){console.error("THREE.WebGLState:",I)}}function ot(){try{n.texImage3D.apply(n,arguments)}catch(I){console.error("THREE.WebGLState:",I)}}function wt(I){ct.equals(I)===!1&&(n.scissor(I.x,I.y,I.z,I.w),ct.copy(I))}function qt(I){vt.equals(I)===!1&&(n.viewport(I.x,I.y,I.z,I.w),vt.copy(I))}function te(I,at){let lt=u.get(at);lt===void 0&&(lt=new WeakMap,u.set(at,lt));let Pt=lt.get(I);Pt===void 0&&(Pt=n.getUniformBlockIndex(at,I.name),lt.set(I,Pt))}function Xt(I,at){const Pt=u.get(at).get(I);h.get(at)!==Pt&&(n.uniformBlockBinding(at,Pt,I.__bindingPointIndex),h.set(at,Pt))}function ht(){n.disable(n.BLEND),n.disable(n.CULL_FACE),n.disable(n.DEPTH_TEST),n.disable(n.POLYGON_OFFSET_FILL),n.disable(n.SCISSOR_TEST),n.disable(n.STENCIL_TEST),n.disable(n.SAMPLE_ALPHA_TO_COVERAGE),n.blendEquation(n.FUNC_ADD),n.blendFunc(n.ONE,n.ZERO),n.blendFuncSeparate(n.ONE,n.ZERO,n.ONE,n.ZERO),n.blendColor(0,0,0,0),n.colorMask(!0,!0,!0,!0),n.clearColor(0,0,0,0),n.depthMask(!0),n.depthFunc(n.LESS),n.clearDepth(1),n.stencilMask(4294967295),n.stencilFunc(n.ALWAYS,0,4294967295),n.stencilOp(n.KEEP,n.KEEP,n.KEEP),n.clearStencil(0),n.cullFace(n.BACK),n.frontFace(n.CCW),n.polygonOffset(0,0),n.activeTexture(n.TEXTURE0),n.bindFramebuffer(n.FRAMEBUFFER,null),i===!0&&(n.bindFramebuffer(n.DRAW_FRAMEBUFFER,null),n.bindFramebuffer(n.READ_FRAMEBUFFER,null)),n.useProgram(null),n.lineWidth(1),n.scissor(0,0,n.canvas.width,n.canvas.height),n.viewport(0,0,n.canvas.width,n.canvas.height),d={},et=null,pt={},f={},g=new WeakMap,_=[],m=null,p=!1,v=null,x=null,y=null,b=null,E=null,S=null,C=null,M=new xt(0,0,0),w=0,U=!1,O=null,Z=null,D=null,F=null,V=null,ct.set(0,0,n.canvas.width,n.canvas.height),vt.set(0,0,n.canvas.width,n.canvas.height),a.reset(),l.reset(),c.reset()}return{buffers:{color:a,depth:l,stencil:c},enable:Nt,disable:Lt,bindFramebuffer:Jt,drawBuffers:G,useProgram:Be,setBlending:yt,setMaterial:me,setFlipSided:Bt,setCullFace:R,setLineWidth:T,setPolygonOffset:W,setScissorTest:rt,activeTexture:it,bindTexture:st,unbindTexture:Et,compressedTexImage2D:gt,compressedTexImage3D:bt,texImage2D:dt,texImage3D:ot,updateUBOMapping:te,uniformBlockBinding:Xt,texStorage2D:P,texStorage3D:tt,texSubImage2D:Dt,texSubImage3D:Ht,compressedTexSubImage2D:nt,compressedTexSubImage3D:Qt,scissor:wt,viewport:qt,reset:ht}}function Iv(n,t,e,i,s,r,o){const a=s.isWebGL2,l=t.has("WEBGL_multisampled_render_to_texture")?t.get("WEBGL_multisampled_render_to_texture"):null,c=typeof navigator>"u"?!1:/OculusBrowser/g.test(navigator.userAgent),h=new WeakMap;let u;const d=new WeakMap;let f=!1;try{f=typeof OffscreenCanvas<"u"&&new OffscreenCanvas(1,1).getContext("2d")!==null}catch{}function g(R,T){return f?new OffscreenCanvas(R,T):fo("canvas")}function _(R,T,W,rt){let it=1;if((R.width>rt||R.height>rt)&&(it=rt/Math.max(R.width,R.height)),it<1||T===!0)if(typeof HTMLImageElement<"u"&&R instanceof HTMLImageElement||typeof HTMLCanvasElement<"u"&&R instanceof HTMLCanvasElement||typeof ImageBitmap<"u"&&R instanceof ImageBitmap){const st=T?ll:Math.floor,Et=st(it*R.width),gt=st(it*R.height);u===void 0&&(u=g(Et,gt));const bt=W?g(Et,gt):u;return bt.width=Et,bt.height=gt,bt.getContext("2d").drawImage(R,0,0,Et,gt),console.warn("THREE.WebGLRenderer: Texture has been resized from ("+R.width+"x"+R.height+") to ("+Et+"x"+gt+")."),bt}else return"data"in R&&console.warn("THREE.WebGLRenderer: Image in DataTexture is too big ("+R.width+"x"+R.height+")."),R;return R}function m(R){return nu(R.width)&&nu(R.height)}function p(R){return a?!1:R.wrapS!==Dn||R.wrapT!==Dn||R.minFilter!==Ze&&R.minFilter!==Mn}function v(R,T){return R.generateMipmaps&&T&&R.minFilter!==Ze&&R.minFilter!==Mn}function x(R){n.generateMipmap(R)}function y(R,T,W,rt,it=!1){if(a===!1)return T;if(R!==null){if(n[R]!==void 0)return n[R];console.warn("THREE.WebGLRenderer: Attempt to use non-existing WebGL internal format '"+R+"'")}let st=T;if(T===n.RED&&(W===n.FLOAT&&(st=n.R32F),W===n.HALF_FLOAT&&(st=n.R16F),W===n.UNSIGNED_BYTE&&(st=n.R8)),T===n.RED_INTEGER&&(W===n.UNSIGNED_BYTE&&(st=n.R8UI),W===n.UNSIGNED_SHORT&&(st=n.R16UI),W===n.UNSIGNED_INT&&(st=n.R32UI),W===n.BYTE&&(st=n.R8I),W===n.SHORT&&(st=n.R16I),W===n.INT&&(st=n.R32I)),T===n.RG&&(W===n.FLOAT&&(st=n.RG32F),W===n.HALF_FLOAT&&(st=n.RG16F),W===n.UNSIGNED_BYTE&&(st=n.RG8)),T===n.RGBA){const Et=it?lo:se.getTransfer(rt);W===n.FLOAT&&(st=n.RGBA32F),W===n.HALF_FLOAT&&(st=n.RGBA16F),W===n.UNSIGNED_BYTE&&(st=Et===he?n.SRGB8_ALPHA8:n.RGBA8),W===n.UNSIGNED_SHORT_4_4_4_4&&(st=n.RGBA4),W===n.UNSIGNED_SHORT_5_5_5_1&&(st=n.RGB5_A1)}return(st===n.R16F||st===n.R32F||st===n.RG16F||st===n.RG32F||st===n.RGBA16F||st===n.RGBA32F)&&t.get("EXT_color_buffer_float"),st}function b(R,T,W){return v(R,W)===!0||R.isFramebufferTexture&&R.minFilter!==Ze&&R.minFilter!==Mn?Math.log2(Math.max(T.width,T.height))+1:R.mipmaps!==void 0&&R.mipmaps.length>0?R.mipmaps.length:R.isCompressedTexture&&Array.isArray(R.image)?T.mipmaps.length:1}function E(R){return R===Ze||R===_h||R===Za?n.NEAREST:n.LINEAR}function S(R){const T=R.target;T.removeEventListener("dispose",S),M(T),T.isVideoTexture&&h.delete(T)}function C(R){const T=R.target;T.removeEventListener("dispose",C),U(T)}function M(R){const T=i.get(R);if(T.__webglInit===void 0)return;const W=R.source,rt=d.get(W);if(rt){const it=rt[T.__cacheKey];it.usedTimes--,it.usedTimes===0&&w(R),Object.keys(rt).length===0&&d.delete(W)}i.remove(R)}function w(R){const T=i.get(R);n.deleteTexture(T.__webglTexture);const W=R.source,rt=d.get(W);delete rt[T.__cacheKey],o.memory.textures--}function U(R){const T=R.texture,W=i.get(R),rt=i.get(T);if(rt.__webglTexture!==void 0&&(n.deleteTexture(rt.__webglTexture),o.memory.textures--),R.depthTexture&&R.depthTexture.dispose(),R.isWebGLCubeRenderTarget)for(let it=0;it<6;it++){if(Array.isArray(W.__webglFramebuffer[it]))for(let st=0;st<W.__webglFramebuffer[it].length;st++)n.deleteFramebuffer(W.__webglFramebuffer[it][st]);else n.deleteFramebuffer(W.__webglFramebuffer[it]);W.__webglDepthbuffer&&n.deleteRenderbuffer(W.__webglDepthbuffer[it])}else{if(Array.isArray(W.__webglFramebuffer))for(let it=0;it<W.__webglFramebuffer.length;it++)n.deleteFramebuffer(W.__webglFramebuffer[it]);else n.deleteFramebuffer(W.__webglFramebuffer);if(W.__webglDepthbuffer&&n.deleteRenderbuffer(W.__webglDepthbuffer),W.__webglMultisampledFramebuffer&&n.deleteFramebuffer(W.__webglMultisampledFramebuffer),W.__webglColorRenderbuffer)for(let it=0;it<W.__webglColorRenderbuffer.length;it++)W.__webglColorRenderbuffer[it]&&n.deleteRenderbuffer(W.__webglColorRenderbuffer[it]);W.__webglDepthRenderbuffer&&n.deleteRenderbuffer(W.__webglDepthRenderbuffer)}if(R.isWebGLMultipleRenderTargets)for(let it=0,st=T.length;it<st;it++){const Et=i.get(T[it]);Et.__webglTexture&&(n.deleteTexture(Et.__webglTexture),o.memory.textures--),i.remove(T[it])}i.remove(T),i.remove(R)}let O=0;function Z(){O=0}function D(){const R=O;return R>=s.maxTextures&&console.warn("THREE.WebGLTextures: Trying to use "+R+" texture units while this GPU supports only "+s.maxTextures),O+=1,R}function F(R){const T=[];return T.push(R.wrapS),T.push(R.wrapT),T.push(R.wrapR||0),T.push(R.magFilter),T.push(R.minFilter),T.push(R.anisotropy),T.push(R.internalFormat),T.push(R.format),T.push(R.type),T.push(R.generateMipmaps),T.push(R.premultiplyAlpha),T.push(R.flipY),T.push(R.unpackAlignment),T.push(R.colorSpace),T.join()}function V(R,T){const W=i.get(R);if(R.isVideoTexture&&me(R),R.isRenderTargetTexture===!1&&R.version>0&&W.__version!==R.version){const rt=R.image;if(rt===null)console.warn("THREE.WebGLRenderer: Texture marked for update but no image data found.");else if(rt.complete===!1)console.warn("THREE.WebGLRenderer: Texture marked for update but image is incomplete");else{ct(W,R,T);return}}e.bindTexture(n.TEXTURE_2D,W.__webglTexture,n.TEXTURE0+T)}function $(R,T){const W=i.get(R);if(R.version>0&&W.__version!==R.version){ct(W,R,T);return}e.bindTexture(n.TEXTURE_2D_ARRAY,W.__webglTexture,n.TEXTURE0+T)}function K(R,T){const W=i.get(R);if(R.version>0&&W.__version!==R.version){ct(W,R,T);return}e.bindTexture(n.TEXTURE_3D,W.__webglTexture,n.TEXTURE0+T)}function Y(R,T){const W=i.get(R);if(R.version>0&&W.__version!==R.version){vt(W,R,T);return}e.bindTexture(n.TEXTURE_CUBE_MAP,W.__webglTexture,n.TEXTURE0+T)}const Q={[$a]:n.REPEAT,[Dn]:n.CLAMP_TO_EDGE,[Ka]:n.MIRRORED_REPEAT},et={[Ze]:n.NEAREST,[_h]:n.NEAREST_MIPMAP_NEAREST,[Za]:n.NEAREST_MIPMAP_LINEAR,[Mn]:n.LINEAR,[qm]:n.LINEAR_MIPMAP_NEAREST,[ar]:n.LINEAR_MIPMAP_LINEAR},pt={[og]:n.NEVER,[dg]:n.ALWAYS,[ag]:n.LESS,[Qh]:n.LEQUAL,[lg]:n.EQUAL,[ug]:n.GEQUAL,[cg]:n.GREATER,[hg]:n.NOTEQUAL};function B(R,T,W){if(W?(n.texParameteri(R,n.TEXTURE_WRAP_S,Q[T.wrapS]),n.texParameteri(R,n.TEXTURE_WRAP_T,Q[T.wrapT]),(R===n.TEXTURE_3D||R===n.TEXTURE_2D_ARRAY)&&n.texParameteri(R,n.TEXTURE_WRAP_R,Q[T.wrapR]),n.texParameteri(R,n.TEXTURE_MAG_FILTER,et[T.magFilter]),n.texParameteri(R,n.TEXTURE_MIN_FILTER,et[T.minFilter])):(n.texParameteri(R,n.TEXTURE_WRAP_S,n.CLAMP_TO_EDGE),n.texParameteri(R,n.TEXTURE_WRAP_T,n.CLAMP_TO_EDGE),(R===n.TEXTURE_3D||R===n.TEXTURE_2D_ARRAY)&&n.texParameteri(R,n.TEXTURE_WRAP_R,n.CLAMP_TO_EDGE),(T.wrapS!==Dn||T.wrapT!==Dn)&&console.warn("THREE.WebGLRenderer: Texture is not power of two. Texture.wrapS and Texture.wrapT should be set to THREE.ClampToEdgeWrapping."),n.texParameteri(R,n.TEXTURE_MAG_FILTER,E(T.magFilter)),n.texParameteri(R,n.TEXTURE_MIN_FILTER,E(T.minFilter)),T.minFilter!==Ze&&T.minFilter!==Mn&&console.warn("THREE.WebGLRenderer: Texture is not power of two. Texture.minFilter should be set to THREE.NearestFilter or THREE.LinearFilter.")),T.compareFunction&&(n.texParameteri(R,n.TEXTURE_COMPARE_MODE,n.COMPARE_REF_TO_TEXTURE),n.texParameteri(R,n.TEXTURE_COMPARE_FUNC,pt[T.compareFunction])),t.has("EXT_texture_filter_anisotropic")===!0){const rt=t.get("EXT_texture_filter_anisotropic");if(T.magFilter===Ze||T.minFilter!==Za&&T.minFilter!==ar||T.type===wi&&t.has("OES_texture_float_linear")===!1||a===!1&&T.type===ii&&t.has("OES_texture_half_float_linear")===!1)return;(T.anisotropy>1||i.get(T).__currentAnisotropy)&&(n.texParameterf(R,rt.TEXTURE_MAX_ANISOTROPY_EXT,Math.min(T.anisotropy,s.getMaxAnisotropy())),i.get(T).__currentAnisotropy=T.anisotropy)}}function J(R,T){let W=!1;R.__webglInit===void 0&&(R.__webglInit=!0,T.addEventListener("dispose",S));const rt=T.source;let it=d.get(rt);it===void 0&&(it={},d.set(rt,it));const st=F(T);if(st!==R.__cacheKey){it[st]===void 0&&(it[st]={texture:n.createTexture(),usedTimes:0},o.memory.textures++,W=!0),it[st].usedTimes++;const Et=it[R.__cacheKey];Et!==void 0&&(it[R.__cacheKey].usedTimes--,Et.usedTimes===0&&w(T)),R.__cacheKey=st,R.__webglTexture=it[st].texture}return W}function ct(R,T,W){let rt=n.TEXTURE_2D;(T.isDataArrayTexture||T.isCompressedArrayTexture)&&(rt=n.TEXTURE_2D_ARRAY),T.isData3DTexture&&(rt=n.TEXTURE_3D);const it=J(R,T),st=T.source;e.bindTexture(rt,R.__webglTexture,n.TEXTURE0+W);const Et=i.get(st);if(st.version!==Et.__version||it===!0){e.activeTexture(n.TEXTURE0+W);const gt=se.getPrimaries(se.workingColorSpace),bt=T.colorSpace===yn?null:se.getPrimaries(T.colorSpace),Dt=T.colorSpace===yn||gt===bt?n.NONE:n.BROWSER_DEFAULT_WEBGL;n.pixelStorei(n.UNPACK_FLIP_Y_WEBGL,T.flipY),n.pixelStorei(n.UNPACK_PREMULTIPLY_ALPHA_WEBGL,T.premultiplyAlpha),n.pixelStorei(n.UNPACK_ALIGNMENT,T.unpackAlignment),n.pixelStorei(n.UNPACK_COLORSPACE_CONVERSION_WEBGL,Dt);const Ht=p(T)&&m(T.image)===!1;let nt=_(T.image,Ht,!1,s.maxTextureSize);nt=Bt(T,nt);const Qt=m(nt)||a,P=r.convert(T.format,T.colorSpace);let tt=r.convert(T.type),dt=y(T.internalFormat,P,tt,T.colorSpace,T.isVideoTexture);B(rt,T,Qt);let ot;const wt=T.mipmaps,qt=a&&T.isVideoTexture!==!0&&dt!==Ch,te=Et.__version===void 0||it===!0,Xt=b(T,nt,Qt);if(T.isDepthTexture)dt=n.DEPTH_COMPONENT,a?T.type===wi?dt=n.DEPTH_COMPONENT32F:T.type===Ti?dt=n.DEPTH_COMPONENT24:T.type===Xi?dt=n.DEPTH24_STENCIL8:dt=n.DEPTH_COMPONENT16:T.type===wi&&console.error("WebGLRenderer: Floating point depth texture requires WebGL2."),T.format===ji&&dt===n.DEPTH_COMPONENT&&T.type!==Ja&&T.type!==Ti&&(console.warn("THREE.WebGLRenderer: Use UnsignedShortType or UnsignedIntType for DepthFormat DepthTexture."),T.type=Ti,tt=r.convert(T.type)),T.format===Es&&dt===n.DEPTH_COMPONENT&&(dt=n.DEPTH_STENCIL,T.type!==Xi&&(console.warn("THREE.WebGLRenderer: Use UnsignedInt248Type for DepthStencilFormat DepthTexture."),T.type=Xi,tt=r.convert(T.type))),te&&(qt?e.texStorage2D(n.TEXTURE_2D,1,dt,nt.width,nt.height):e.texImage2D(n.TEXTURE_2D,0,dt,nt.width,nt.height,0,P,tt,null));else if(T.isDataTexture)if(wt.length>0&&Qt){qt&&te&&e.texStorage2D(n.TEXTURE_2D,Xt,dt,wt[0].width,wt[0].height);for(let ht=0,I=wt.length;ht<I;ht++)ot=wt[ht],qt?e.texSubImage2D(n.TEXTURE_2D,ht,0,0,ot.width,ot.height,P,tt,ot.data):e.texImage2D(n.TEXTURE_2D,ht,dt,ot.width,ot.height,0,P,tt,ot.data);T.generateMipmaps=!1}else qt?(te&&e.texStorage2D(n.TEXTURE_2D,Xt,dt,nt.width,nt.height),e.texSubImage2D(n.TEXTURE_2D,0,0,0,nt.width,nt.height,P,tt,nt.data)):e.texImage2D(n.TEXTURE_2D,0,dt,nt.width,nt.height,0,P,tt,nt.data);else if(T.isCompressedTexture)if(T.isCompressedArrayTexture){qt&&te&&e.texStorage3D(n.TEXTURE_2D_ARRAY,Xt,dt,wt[0].width,wt[0].height,nt.depth);for(let ht=0,I=wt.length;ht<I;ht++)ot=wt[ht],T.format!==In?P!==null?qt?e.compressedTexSubImage3D(n.TEXTURE_2D_ARRAY,ht,0,0,0,ot.width,ot.height,nt.depth,P,ot.data,0,0):e.compressedTexImage3D(n.TEXTURE_2D_ARRAY,ht,dt,ot.width,ot.height,nt.depth,0,ot.data,0,0):console.warn("THREE.WebGLRenderer: Attempt to load unsupported compressed texture format in .uploadTexture()"):qt?e.texSubImage3D(n.TEXTURE_2D_ARRAY,ht,0,0,0,ot.width,ot.height,nt.depth,P,tt,ot.data):e.texImage3D(n.TEXTURE_2D_ARRAY,ht,dt,ot.width,ot.height,nt.depth,0,P,tt,ot.data)}else{qt&&te&&e.texStorage2D(n.TEXTURE_2D,Xt,dt,wt[0].width,wt[0].height);for(let ht=0,I=wt.length;ht<I;ht++)ot=wt[ht],T.format!==In?P!==null?qt?e.compressedTexSubImage2D(n.TEXTURE_2D,ht,0,0,ot.width,ot.height,P,ot.data):e.compressedTexImage2D(n.TEXTURE_2D,ht,dt,ot.width,ot.height,0,ot.data):console.warn("THREE.WebGLRenderer: Attempt to load unsupported compressed texture format in .uploadTexture()"):qt?e.texSubImage2D(n.TEXTURE_2D,ht,0,0,ot.width,ot.height,P,tt,ot.data):e.texImage2D(n.TEXTURE_2D,ht,dt,ot.width,ot.height,0,P,tt,ot.data)}else if(T.isDataArrayTexture)qt?(te&&e.texStorage3D(n.TEXTURE_2D_ARRAY,Xt,dt,nt.width,nt.height,nt.depth),e.texSubImage3D(n.TEXTURE_2D_ARRAY,0,0,0,0,nt.width,nt.height,nt.depth,P,tt,nt.data)):e.texImage3D(n.TEXTURE_2D_ARRAY,0,dt,nt.width,nt.height,nt.depth,0,P,tt,nt.data);else if(T.isData3DTexture)qt?(te&&e.texStorage3D(n.TEXTURE_3D,Xt,dt,nt.width,nt.height,nt.depth),e.texSubImage3D(n.TEXTURE_3D,0,0,0,0,nt.width,nt.height,nt.depth,P,tt,nt.data)):e.texImage3D(n.TEXTURE_3D,0,dt,nt.width,nt.height,nt.depth,0,P,tt,nt.data);else if(T.isFramebufferTexture){if(te)if(qt)e.texStorage2D(n.TEXTURE_2D,Xt,dt,nt.width,nt.height);else{let ht=nt.width,I=nt.height;for(let at=0;at<Xt;at++)e.texImage2D(n.TEXTURE_2D,at,dt,ht,I,0,P,tt,null),ht>>=1,I>>=1}}else if(wt.length>0&&Qt){qt&&te&&e.texStorage2D(n.TEXTURE_2D,Xt,dt,wt[0].width,wt[0].height);for(let ht=0,I=wt.length;ht<I;ht++)ot=wt[ht],qt?e.texSubImage2D(n.TEXTURE_2D,ht,0,0,P,tt,ot):e.texImage2D(n.TEXTURE_2D,ht,dt,P,tt,ot);T.generateMipmaps=!1}else qt?(te&&e.texStorage2D(n.TEXTURE_2D,Xt,dt,nt.width,nt.height),e.texSubImage2D(n.TEXTURE_2D,0,0,0,P,tt,nt)):e.texImage2D(n.TEXTURE_2D,0,dt,P,tt,nt);v(T,Qt)&&x(rt),Et.__version=st.version,T.onUpdate&&T.onUpdate(T)}R.__version=T.version}function vt(R,T,W){if(T.image.length!==6)return;const rt=J(R,T),it=T.source;e.bindTexture(n.TEXTURE_CUBE_MAP,R.__webglTexture,n.TEXTURE0+W);const st=i.get(it);if(it.version!==st.__version||rt===!0){e.activeTexture(n.TEXTURE0+W);const Et=se.getPrimaries(se.workingColorSpace),gt=T.colorSpace===yn?null:se.getPrimaries(T.colorSpace),bt=T.colorSpace===yn||Et===gt?n.NONE:n.BROWSER_DEFAULT_WEBGL;n.pixelStorei(n.UNPACK_FLIP_Y_WEBGL,T.flipY),n.pixelStorei(n.UNPACK_PREMULTIPLY_ALPHA_WEBGL,T.premultiplyAlpha),n.pixelStorei(n.UNPACK_ALIGNMENT,T.unpackAlignment),n.pixelStorei(n.UNPACK_COLORSPACE_CONVERSION_WEBGL,bt);const Dt=T.isCompressedTexture||T.image[0].isCompressedTexture,Ht=T.image[0]&&T.image[0].isDataTexture,nt=[];for(let ht=0;ht<6;ht++)!Dt&&!Ht?nt[ht]=_(T.image[ht],!1,!0,s.maxCubemapSize):nt[ht]=Ht?T.image[ht].image:T.image[ht],nt[ht]=Bt(T,nt[ht]);const Qt=nt[0],P=m(Qt)||a,tt=r.convert(T.format,T.colorSpace),dt=r.convert(T.type),ot=y(T.internalFormat,tt,dt,T.colorSpace),wt=a&&T.isVideoTexture!==!0,qt=st.__version===void 0||rt===!0;let te=b(T,Qt,P);B(n.TEXTURE_CUBE_MAP,T,P);let Xt;if(Dt){wt&&qt&&e.texStorage2D(n.TEXTURE_CUBE_MAP,te,ot,Qt.width,Qt.height);for(let ht=0;ht<6;ht++){Xt=nt[ht].mipmaps;for(let I=0;I<Xt.length;I++){const at=Xt[I];T.format!==In?tt!==null?wt?e.compressedTexSubImage2D(n.TEXTURE_CUBE_MAP_POSITIVE_X+ht,I,0,0,at.width,at.height,tt,at.data):e.compressedTexImage2D(n.TEXTURE_CUBE_MAP_POSITIVE_X+ht,I,ot,at.width,at.height,0,at.data):console.warn("THREE.WebGLRenderer: Attempt to load unsupported compressed texture format in .setTextureCube()"):wt?e.texSubImage2D(n.TEXTURE_CUBE_MAP_POSITIVE_X+ht,I,0,0,at.width,at.height,tt,dt,at.data):e.texImage2D(n.TEXTURE_CUBE_MAP_POSITIVE_X+ht,I,ot,at.width,at.height,0,tt,dt,at.data)}}}else{Xt=T.mipmaps,wt&&qt&&(Xt.length>0&&te++,e.texStorage2D(n.TEXTURE_CUBE_MAP,te,ot,nt[0].width,nt[0].height));for(let ht=0;ht<6;ht++)if(Ht){wt?e.texSubImage2D(n.TEXTURE_CUBE_MAP_POSITIVE_X+ht,0,0,0,nt[ht].width,nt[ht].height,tt,dt,nt[ht].data):e.texImage2D(n.TEXTURE_CUBE_MAP_POSITIVE_X+ht,0,ot,nt[ht].width,nt[ht].height,0,tt,dt,nt[ht].data);for(let I=0;I<Xt.length;I++){const lt=Xt[I].image[ht].image;wt?e.texSubImage2D(n.TEXTURE_CUBE_MAP_POSITIVE_X+ht,I+1,0,0,lt.width,lt.height,tt,dt,lt.data):e.texImage2D(n.TEXTURE_CUBE_MAP_POSITIVE_X+ht,I+1,ot,lt.width,lt.height,0,tt,dt,lt.data)}}else{wt?e.texSubImage2D(n.TEXTURE_CUBE_MAP_POSITIVE_X+ht,0,0,0,tt,dt,nt[ht]):e.texImage2D(n.TEXTURE_CUBE_MAP_POSITIVE_X+ht,0,ot,tt,dt,nt[ht]);for(let I=0;I<Xt.length;I++){const at=Xt[I];wt?e.texSubImage2D(n.TEXTURE_CUBE_MAP_POSITIVE_X+ht,I+1,0,0,tt,dt,at.image[ht]):e.texImage2D(n.TEXTURE_CUBE_MAP_POSITIVE_X+ht,I+1,ot,tt,dt,at.image[ht])}}}v(T,P)&&x(n.TEXTURE_CUBE_MAP),st.__version=it.version,T.onUpdate&&T.onUpdate(T)}R.__version=T.version}function Tt(R,T,W,rt,it,st){const Et=r.convert(W.format,W.colorSpace),gt=r.convert(W.type),bt=y(W.internalFormat,Et,gt,W.colorSpace);if(!i.get(T).__hasExternalTextures){const Ht=Math.max(1,T.width>>st),nt=Math.max(1,T.height>>st);it===n.TEXTURE_3D||it===n.TEXTURE_2D_ARRAY?e.texImage3D(it,st,bt,Ht,nt,T.depth,0,Et,gt,null):e.texImage2D(it,st,bt,Ht,nt,0,Et,gt,null)}e.bindFramebuffer(n.FRAMEBUFFER,R),yt(T)?l.framebufferTexture2DMultisampleEXT(n.FRAMEBUFFER,rt,it,i.get(W).__webglTexture,0,Ot(T)):(it===n.TEXTURE_2D||it>=n.TEXTURE_CUBE_MAP_POSITIVE_X&&it<=n.TEXTURE_CUBE_MAP_NEGATIVE_Z)&&n.framebufferTexture2D(n.FRAMEBUFFER,rt,it,i.get(W).__webglTexture,st),e.bindFramebuffer(n.FRAMEBUFFER,null)}function Ft(R,T,W){if(n.bindRenderbuffer(n.RENDERBUFFER,R),T.depthBuffer&&!T.stencilBuffer){let rt=a===!0?n.DEPTH_COMPONENT24:n.DEPTH_COMPONENT16;if(W||yt(T)){const it=T.depthTexture;it&&it.isDepthTexture&&(it.type===wi?rt=n.DEPTH_COMPONENT32F:it.type===Ti&&(rt=n.DEPTH_COMPONENT24));const st=Ot(T);yt(T)?l.renderbufferStorageMultisampleEXT(n.RENDERBUFFER,st,rt,T.width,T.height):n.renderbufferStorageMultisample(n.RENDERBUFFER,st,rt,T.width,T.height)}else n.renderbufferStorage(n.RENDERBUFFER,rt,T.width,T.height);n.framebufferRenderbuffer(n.FRAMEBUFFER,n.DEPTH_ATTACHMENT,n.RENDERBUFFER,R)}else if(T.depthBuffer&&T.stencilBuffer){const rt=Ot(T);W&&yt(T)===!1?n.renderbufferStorageMultisample(n.RENDERBUFFER,rt,n.DEPTH24_STENCIL8,T.width,T.height):yt(T)?l.renderbufferStorageMultisampleEXT(n.RENDERBUFFER,rt,n.DEPTH24_STENCIL8,T.width,T.height):n.renderbufferStorage(n.RENDERBUFFER,n.DEPTH_STENCIL,T.width,T.height),n.framebufferRenderbuffer(n.FRAMEBUFFER,n.DEPTH_STENCIL_ATTACHMENT,n.RENDERBUFFER,R)}else{const rt=T.isWebGLMultipleRenderTargets===!0?T.texture:[T.texture];for(let it=0;it<rt.length;it++){const st=rt[it],Et=r.convert(st.format,st.colorSpace),gt=r.convert(st.type),bt=y(st.internalFormat,Et,gt,st.colorSpace),Dt=Ot(T);W&&yt(T)===!1?n.renderbufferStorageMultisample(n.RENDERBUFFER,Dt,bt,T.width,T.height):yt(T)?l.renderbufferStorageMultisampleEXT(n.RENDERBUFFER,Dt,bt,T.width,T.height):n.renderbufferStorage(n.RENDERBUFFER,bt,T.width,T.height)}}n.bindRenderbuffer(n.RENDERBUFFER,null)}function Nt(R,T){if(T&&T.isWebGLCubeRenderTarget)throw new Error("Depth Texture with cube render targets is not supported");if(e.bindFramebuffer(n.FRAMEBUFFER,R),!(T.depthTexture&&T.depthTexture.isDepthTexture))throw new Error("renderTarget.depthTexture must be an instance of THREE.DepthTexture");(!i.get(T.depthTexture).__webglTexture||T.depthTexture.image.width!==T.width||T.depthTexture.image.height!==T.height)&&(T.depthTexture.image.width=T.width,T.depthTexture.image.height=T.height,T.depthTexture.needsUpdate=!0),V(T.depthTexture,0);const rt=i.get(T.depthTexture).__webglTexture,it=Ot(T);if(T.depthTexture.format===ji)yt(T)?l.framebufferTexture2DMultisampleEXT(n.FRAMEBUFFER,n.DEPTH_ATTACHMENT,n.TEXTURE_2D,rt,0,it):n.framebufferTexture2D(n.FRAMEBUFFER,n.DEPTH_ATTACHMENT,n.TEXTURE_2D,rt,0);else if(T.depthTexture.format===Es)yt(T)?l.framebufferTexture2DMultisampleEXT(n.FRAMEBUFFER,n.DEPTH_STENCIL_ATTACHMENT,n.TEXTURE_2D,rt,0,it):n.framebufferTexture2D(n.FRAMEBUFFER,n.DEPTH_STENCIL_ATTACHMENT,n.TEXTURE_2D,rt,0);else throw new Error("Unknown depthTexture format")}function Lt(R){const T=i.get(R),W=R.isWebGLCubeRenderTarget===!0;if(R.depthTexture&&!T.__autoAllocateDepthBuffer){if(W)throw new Error("target.depthTexture not supported in Cube render targets");Nt(T.__webglFramebuffer,R)}else if(W){T.__webglDepthbuffer=[];for(let rt=0;rt<6;rt++)e.bindFramebuffer(n.FRAMEBUFFER,T.__webglFramebuffer[rt]),T.__webglDepthbuffer[rt]=n.createRenderbuffer(),Ft(T.__webglDepthbuffer[rt],R,!1)}else e.bindFramebuffer(n.FRAMEBUFFER,T.__webglFramebuffer),T.__webglDepthbuffer=n.createRenderbuffer(),Ft(T.__webglDepthbuffer,R,!1);e.bindFramebuffer(n.FRAMEBUFFER,null)}function Jt(R,T,W){const rt=i.get(R);T!==void 0&&Tt(rt.__webglFramebuffer,R,R.texture,n.COLOR_ATTACHMENT0,n.TEXTURE_2D,0),W!==void 0&&Lt(R)}function G(R){const T=R.texture,W=i.get(R),rt=i.get(T);R.addEventListener("dispose",C),R.isWebGLMultipleRenderTargets!==!0&&(rt.__webglTexture===void 0&&(rt.__webglTexture=n.createTexture()),rt.__version=T.version,o.memory.textures++);const it=R.isWebGLCubeRenderTarget===!0,st=R.isWebGLMultipleRenderTargets===!0,Et=m(R)||a;if(it){W.__webglFramebuffer=[];for(let gt=0;gt<6;gt++)if(a&&T.mipmaps&&T.mipmaps.length>0){W.__webglFramebuffer[gt]=[];for(let bt=0;bt<T.mipmaps.length;bt++)W.__webglFramebuffer[gt][bt]=n.createFramebuffer()}else W.__webglFramebuffer[gt]=n.createFramebuffer()}else{if(a&&T.mipmaps&&T.mipmaps.length>0){W.__webglFramebuffer=[];for(let gt=0;gt<T.mipmaps.length;gt++)W.__webglFramebuffer[gt]=n.createFramebuffer()}else W.__webglFramebuffer=n.createFramebuffer();if(st)if(s.drawBuffers){const gt=R.texture;for(let bt=0,Dt=gt.length;bt<Dt;bt++){const Ht=i.get(gt[bt]);Ht.__webglTexture===void 0&&(Ht.__webglTexture=n.createTexture(),o.memory.textures++)}}else console.warn("THREE.WebGLRenderer: WebGLMultipleRenderTargets can only be used with WebGL2 or WEBGL_draw_buffers extension.");if(a&&R.samples>0&&yt(R)===!1){const gt=st?T:[T];W.__webglMultisampledFramebuffer=n.createFramebuffer(),W.__webglColorRenderbuffer=[],e.bindFramebuffer(n.FRAMEBUFFER,W.__webglMultisampledFramebuffer);for(let bt=0;bt<gt.length;bt++){const Dt=gt[bt];W.__webglColorRenderbuffer[bt]=n.createRenderbuffer(),n.bindRenderbuffer(n.RENDERBUFFER,W.__webglColorRenderbuffer[bt]);const Ht=r.convert(Dt.format,Dt.colorSpace),nt=r.convert(Dt.type),Qt=y(Dt.internalFormat,Ht,nt,Dt.colorSpace,R.isXRRenderTarget===!0),P=Ot(R);n.renderbufferStorageMultisample(n.RENDERBUFFER,P,Qt,R.width,R.height),n.framebufferRenderbuffer(n.FRAMEBUFFER,n.COLOR_ATTACHMENT0+bt,n.RENDERBUFFER,W.__webglColorRenderbuffer[bt])}n.bindRenderbuffer(n.RENDERBUFFER,null),R.depthBuffer&&(W.__webglDepthRenderbuffer=n.createRenderbuffer(),Ft(W.__webglDepthRenderbuffer,R,!0)),e.bindFramebuffer(n.FRAMEBUFFER,null)}}if(it){e.bindTexture(n.TEXTURE_CUBE_MAP,rt.__webglTexture),B(n.TEXTURE_CUBE_MAP,T,Et);for(let gt=0;gt<6;gt++)if(a&&T.mipmaps&&T.mipmaps.length>0)for(let bt=0;bt<T.mipmaps.length;bt++)Tt(W.__webglFramebuffer[gt][bt],R,T,n.COLOR_ATTACHMENT0,n.TEXTURE_CUBE_MAP_POSITIVE_X+gt,bt);else Tt(W.__webglFramebuffer[gt],R,T,n.COLOR_ATTACHMENT0,n.TEXTURE_CUBE_MAP_POSITIVE_X+gt,0);v(T,Et)&&x(n.TEXTURE_CUBE_MAP),e.unbindTexture()}else if(st){const gt=R.texture;for(let bt=0,Dt=gt.length;bt<Dt;bt++){const Ht=gt[bt],nt=i.get(Ht);e.bindTexture(n.TEXTURE_2D,nt.__webglTexture),B(n.TEXTURE_2D,Ht,Et),Tt(W.__webglFramebuffer,R,Ht,n.COLOR_ATTACHMENT0+bt,n.TEXTURE_2D,0),v(Ht,Et)&&x(n.TEXTURE_2D)}e.unbindTexture()}else{let gt=n.TEXTURE_2D;if((R.isWebGL3DRenderTarget||R.isWebGLArrayRenderTarget)&&(a?gt=R.isWebGL3DRenderTarget?n.TEXTURE_3D:n.TEXTURE_2D_ARRAY:console.error("THREE.WebGLTextures: THREE.Data3DTexture and THREE.DataArrayTexture only supported with WebGL2.")),e.bindTexture(gt,rt.__webglTexture),B(gt,T,Et),a&&T.mipmaps&&T.mipmaps.length>0)for(let bt=0;bt<T.mipmaps.length;bt++)Tt(W.__webglFramebuffer[bt],R,T,n.COLOR_ATTACHMENT0,gt,bt);else Tt(W.__webglFramebuffer,R,T,n.COLOR_ATTACHMENT0,gt,0);v(T,Et)&&x(gt),e.unbindTexture()}R.depthBuffer&&Lt(R)}function Be(R){const T=m(R)||a,W=R.isWebGLMultipleRenderTargets===!0?R.texture:[R.texture];for(let rt=0,it=W.length;rt<it;rt++){const st=W[rt];if(v(st,T)){const Et=R.isWebGLCubeRenderTarget?n.TEXTURE_CUBE_MAP:n.TEXTURE_2D,gt=i.get(st).__webglTexture;e.bindTexture(Et,gt),x(Et),e.unbindTexture()}}}function Rt(R){if(a&&R.samples>0&&yt(R)===!1){const T=R.isWebGLMultipleRenderTargets?R.texture:[R.texture],W=R.width,rt=R.height;let it=n.COLOR_BUFFER_BIT;const st=[],Et=R.stencilBuffer?n.DEPTH_STENCIL_ATTACHMENT:n.DEPTH_ATTACHMENT,gt=i.get(R),bt=R.isWebGLMultipleRenderTargets===!0;if(bt)for(let Dt=0;Dt<T.length;Dt++)e.bindFramebuffer(n.FRAMEBUFFER,gt.__webglMultisampledFramebuffer),n.framebufferRenderbuffer(n.FRAMEBUFFER,n.COLOR_ATTACHMENT0+Dt,n.RENDERBUFFER,null),e.bindFramebuffer(n.FRAMEBUFFER,gt.__webglFramebuffer),n.framebufferTexture2D(n.DRAW_FRAMEBUFFER,n.COLOR_ATTACHMENT0+Dt,n.TEXTURE_2D,null,0);e.bindFramebuffer(n.READ_FRAMEBUFFER,gt.__webglMultisampledFramebuffer),e.bindFramebuffer(n.DRAW_FRAMEBUFFER,gt.__webglFramebuffer);for(let Dt=0;Dt<T.length;Dt++){st.push(n.COLOR_ATTACHMENT0+Dt),R.depthBuffer&&st.push(Et);const Ht=gt.__ignoreDepthValues!==void 0?gt.__ignoreDepthValues:!1;if(Ht===!1&&(R.depthBuffer&&(it|=n.DEPTH_BUFFER_BIT),R.stencilBuffer&&(it|=n.STENCIL_BUFFER_BIT)),bt&&n.framebufferRenderbuffer(n.READ_FRAMEBUFFER,n.COLOR_ATTACHMENT0,n.RENDERBUFFER,gt.__webglColorRenderbuffer[Dt]),Ht===!0&&(n.invalidateFramebuffer(n.READ_FRAMEBUFFER,[Et]),n.invalidateFramebuffer(n.DRAW_FRAMEBUFFER,[Et])),bt){const nt=i.get(T[Dt]).__webglTexture;n.framebufferTexture2D(n.DRAW_FRAMEBUFFER,n.COLOR_ATTACHMENT0,n.TEXTURE_2D,nt,0)}n.blitFramebuffer(0,0,W,rt,0,0,W,rt,it,n.NEAREST),c&&n.invalidateFramebuffer(n.READ_FRAMEBUFFER,st)}if(e.bindFramebuffer(n.READ_FRAMEBUFFER,null),e.bindFramebuffer(n.DRAW_FRAMEBUFFER,null),bt)for(let Dt=0;Dt<T.length;Dt++){e.bindFramebuffer(n.FRAMEBUFFER,gt.__webglMultisampledFramebuffer),n.framebufferRenderbuffer(n.FRAMEBUFFER,n.COLOR_ATTACHMENT0+Dt,n.RENDERBUFFER,gt.__webglColorRenderbuffer[Dt]);const Ht=i.get(T[Dt]).__webglTexture;e.bindFramebuffer(n.FRAMEBUFFER,gt.__webglFramebuffer),n.framebufferTexture2D(n.DRAW_FRAMEBUFFER,n.COLOR_ATTACHMENT0+Dt,n.TEXTURE_2D,Ht,0)}e.bindFramebuffer(n.DRAW_FRAMEBUFFER,gt.__webglMultisampledFramebuffer)}}function Ot(R){return Math.min(s.maxSamples,R.samples)}function yt(R){const T=i.get(R);return a&&R.samples>0&&t.has("WEBGL_multisampled_render_to_texture")===!0&&T.__useRenderToTexture!==!1}function me(R){const T=o.render.frame;h.get(R)!==T&&(h.set(R,T),R.update())}function Bt(R,T){const W=R.colorSpace,rt=R.format,it=R.type;return R.isCompressedTexture===!0||R.isVideoTexture===!0||R.format===rl||W!==si&&W!==yn&&(se.getTransfer(W)===he?a===!1?t.has("EXT_sRGB")===!0&&rt===In?(R.format=rl,R.minFilter=Mn,R.generateMipmaps=!1):T=au.sRGBToLinear(T):(rt!==In||it!==Ei)&&console.warn("THREE.WebGLTextures: sRGB encoded textures have to use RGBAFormat and UnsignedByteType."):console.error("THREE.WebGLTextures: Unsupported texture color space:",W)),T}this.allocateTextureUnit=D,this.resetTextureUnits=Z,this.setTexture2D=V,this.setTexture2DArray=$,this.setTexture3D=K,this.setTextureCube=Y,this.rebindTextures=Jt,this.setupRenderTarget=G,this.updateRenderTargetMipmap=Be,this.updateMultisampleRenderTarget=Rt,this.setupDepthRenderbuffer=Lt,this.setupFrameBufferTexture=Tt,this.useMultisampledRTT=yt}function Ov(n,t,e){const i=e.isWebGL2;function s(r,o=yn){let a;const l=se.getTransfer(o);if(r===Ei)return n.UNSIGNED_BYTE;if(r===vh)return n.UNSIGNED_SHORT_4_4_4_4;if(r===bh)return n.UNSIGNED_SHORT_5_5_5_1;if(r===$m)return n.BYTE;if(r===Km)return n.SHORT;if(r===Ja)return n.UNSIGNED_SHORT;if(r===xh)return n.INT;if(r===Ti)return n.UNSIGNED_INT;if(r===wi)return n.FLOAT;if(r===ii)return i?n.HALF_FLOAT:(a=t.get("OES_texture_half_float"),a!==null?a.HALF_FLOAT_OES:null);if(r===Zm)return n.ALPHA;if(r===In)return n.RGBA;if(r===Jm)return n.LUMINANCE;if(r===Qm)return n.LUMINANCE_ALPHA;if(r===ji)return n.DEPTH_COMPONENT;if(r===Es)return n.DEPTH_STENCIL;if(r===rl)return a=t.get("EXT_sRGB"),a!==null?a.SRGB_ALPHA_EXT:null;if(r===tg)return n.RED;if(r===Mh)return n.RED_INTEGER;if(r===eg)return n.RG;if(r===yh)return n.RG_INTEGER;if(r===Sh)return n.RGBA_INTEGER;if(r===Qa||r===tl||r===el||r===nl)if(l===he)if(a=t.get("WEBGL_compressed_texture_s3tc_srgb"),a!==null){if(r===Qa)return a.COMPRESSED_SRGB_S3TC_DXT1_EXT;if(r===tl)return a.COMPRESSED_SRGB_ALPHA_S3TC_DXT1_EXT;if(r===el)return a.COMPRESSED_SRGB_ALPHA_S3TC_DXT3_EXT;if(r===nl)return a.COMPRESSED_SRGB_ALPHA_S3TC_DXT5_EXT}else return null;else if(a=t.get("WEBGL_compressed_texture_s3tc"),a!==null){if(r===Qa)return a.COMPRESSED_RGB_S3TC_DXT1_EXT;if(r===tl)return a.COMPRESSED_RGBA_S3TC_DXT1_EXT;if(r===el)return a.COMPRESSED_RGBA_S3TC_DXT3_EXT;if(r===nl)return a.COMPRESSED_RGBA_S3TC_DXT5_EXT}else return null;if(r===Eh||r===Th||r===wh||r===Ah)if(a=t.get("WEBGL_compressed_texture_pvrtc"),a!==null){if(r===Eh)return a.COMPRESSED_RGB_PVRTC_4BPPV1_IMG;if(r===Th)return a.COMPRESSED_RGB_PVRTC_2BPPV1_IMG;if(r===wh)return a.COMPRESSED_RGBA_PVRTC_4BPPV1_IMG;if(r===Ah)return a.COMPRESSED_RGBA_PVRTC_2BPPV1_IMG}else return null;if(r===Ch)return a=t.get("WEBGL_compressed_texture_etc1"),a!==null?a.COMPRESSED_RGB_ETC1_WEBGL:null;if(r===Rh||r===Ph)if(a=t.get("WEBGL_compressed_texture_etc"),a!==null){if(r===Rh)return l===he?a.COMPRESSED_SRGB8_ETC2:a.COMPRESSED_RGB8_ETC2;if(r===Ph)return l===he?a.COMPRESSED_SRGB8_ALPHA8_ETC2_EAC:a.COMPRESSED_RGBA8_ETC2_EAC}else return null;if(r===Lh||r===Dh||r===Ih||r===Oh||r===Uh||r===Fh||r===Nh||r===kh||r===Bh||r===zh||r===Hh||r===Vh||r===Gh||r===Wh)if(a=t.get("WEBGL_compressed_texture_astc"),a!==null){if(r===Lh)return l===he?a.COMPRESSED_SRGB8_ALPHA8_ASTC_4x4_KHR:a.COMPRESSED_RGBA_ASTC_4x4_KHR;if(r===Dh)return l===he?a.COMPRESSED_SRGB8_ALPHA8_ASTC_5x4_KHR:a.COMPRESSED_RGBA_ASTC_5x4_KHR;if(r===Ih)return l===he?a.COMPRESSED_SRGB8_ALPHA8_ASTC_5x5_KHR:a.COMPRESSED_RGBA_ASTC_5x5_KHR;if(r===Oh)return l===he?a.COMPRESSED_SRGB8_ALPHA8_ASTC_6x5_KHR:a.COMPRESSED_RGBA_ASTC_6x5_KHR;if(r===Uh)return l===he?a.COMPRESSED_SRGB8_ALPHA8_ASTC_6x6_KHR:a.COMPRESSED_RGBA_ASTC_6x6_KHR;if(r===Fh)return l===he?a.COMPRESSED_SRGB8_ALPHA8_ASTC_8x5_KHR:a.COMPRESSED_RGBA_ASTC_8x5_KHR;if(r===Nh)return l===he?a.COMPRESSED_SRGB8_ALPHA8_ASTC_8x6_KHR:a.COMPRESSED_RGBA_ASTC_8x6_KHR;if(r===kh)return l===he?a.COMPRESSED_SRGB8_ALPHA8_ASTC_8x8_KHR:a.COMPRESSED_RGBA_ASTC_8x8_KHR;if(r===Bh)return l===he?a.COMPRESSED_SRGB8_ALPHA8_ASTC_10x5_KHR:a.COMPRESSED_RGBA_ASTC_10x5_KHR;if(r===zh)return l===he?a.COMPRESSED_SRGB8_ALPHA8_ASTC_10x6_KHR:a.COMPRESSED_RGBA_ASTC_10x6_KHR;if(r===Hh)return l===he?a.COMPRESSED_SRGB8_ALPHA8_ASTC_10x8_KHR:a.COMPRESSED_RGBA_ASTC_10x8_KHR;if(r===Vh)return l===he?a.COMPRESSED_SRGB8_ALPHA8_ASTC_10x10_KHR:a.COMPRESSED_RGBA_ASTC_10x10_KHR;if(r===Gh)return l===he?a.COMPRESSED_SRGB8_ALPHA8_ASTC_12x10_KHR:a.COMPRESSED_RGBA_ASTC_12x10_KHR;if(r===Wh)return l===he?a.COMPRESSED_SRGB8_ALPHA8_ASTC_12x12_KHR:a.COMPRESSED_RGBA_ASTC_12x12_KHR}else return null;if(r===il||r===Xh||r===jh)if(a=t.get("EXT_texture_compression_bptc"),a!==null){if(r===il)return l===he?a.COMPRESSED_SRGB_ALPHA_BPTC_UNORM_EXT:a.COMPRESSED_RGBA_BPTC_UNORM_EXT;if(r===Xh)return a.COMPRESSED_RGB_BPTC_SIGNED_FLOAT_EXT;if(r===jh)return a.COMPRESSED_RGB_BPTC_UNSIGNED_FLOAT_EXT}else return null;if(r===ng||r===Yh||r===qh||r===$h)if(a=t.get("EXT_texture_compression_rgtc"),a!==null){if(r===il)return a.COMPRESSED_RED_RGTC1_EXT;if(r===Yh)return a.COMPRESSED_SIGNED_RED_RGTC1_EXT;if(r===qh)return a.COMPRESSED_RED_GREEN_RGTC2_EXT;if(r===$h)return a.COMPRESSED_SIGNED_RED_GREEN_RGTC2_EXT}else return null;return r===Xi?i?n.UNSIGNED_INT_24_8:(a=t.get("WEBGL_depth_texture"),a!==null?a.UNSIGNED_INT_24_8_WEBGL:null):n[r]!==void 0?n[r]:null}return{convert:s}}class Uv extends An{constructor(t=[]){super(),this.isArrayCamera=!0,this.cameras=t}}class xr extends Fe{constructor(){super(),this.isGroup=!0,this.type="Group"}}const Fv={type:"move"};class Fl{constructor(){this._targetRay=null,this._grip=null,this._hand=null}getHandSpace(){return this._hand===null&&(this._hand=new xr,this._hand.matrixAutoUpdate=!1,this._hand.visible=!1,this._hand.joints={},this._hand.inputState={pinching:!1}),this._hand}getTargetRaySpace(){return this._targetRay===null&&(this._targetRay=new xr,this._targetRay.matrixAutoUpdate=!1,this._targetRay.visible=!1,this._targetRay.hasLinearVelocity=!1,this._targetRay.linearVelocity=new L,this._targetRay.hasAngularVelocity=!1,this._targetRay.angularVelocity=new L),this._targetRay}getGripSpace(){return this._grip===null&&(this._grip=new xr,this._grip.matrixAutoUpdate=!1,this._grip.visible=!1,this._grip.hasLinearVelocity=!1,this._grip.linearVelocity=new L,this._grip.hasAngularVelocity=!1,this._grip.angularVelocity=new L),this._grip}dispatchEvent(t){return this._targetRay!==null&&this._targetRay.dispatchEvent(t),this._grip!==null&&this._grip.dispatchEvent(t),this._hand!==null&&this._hand.dispatchEvent(t),this}connect(t){if(t&&t.hand){const e=this._hand;if(e)for(const i of t.hand.values())this._getHandJoint(e,i)}return this.dispatchEvent({type:"connected",data:t}),this}disconnect(t){return this.dispatchEvent({type:"disconnected",data:t}),this._targetRay!==null&&(this._targetRay.visible=!1),this._grip!==null&&(this._grip.visible=!1),this._hand!==null&&(this._hand.visible=!1),this}update(t,e,i){let s=null,r=null,o=null;const a=this._targetRay,l=this._grip,c=this._hand;if(t&&e.session.visibilityState!=="visible-blurred"){if(c&&t.hand){o=!0;for(const _ of t.hand.values()){const m=e.getJointPose(_,i),p=this._getHandJoint(c,_);m!==null&&(p.matrix.fromArray(m.transform.matrix),p.matrix.decompose(p.position,p.rotation,p.scale),p.matrixWorldNeedsUpdate=!0,p.jointRadius=m.radius),p.visible=m!==null}const h=c.joints["index-finger-tip"],u=c.joints["thumb-tip"],d=h.position.distanceTo(u.position),f=.02,g=.005;c.inputState.pinching&&d>f+g?(c.inputState.pinching=!1,this.dispatchEvent({type:"pinchend",handedness:t.handedness,target:this})):!c.inputState.pinching&&d<=f-g&&(c.inputState.pinching=!0,this.dispatchEvent({type:"pinchstart",handedness:t.handedness,target:this}))}else l!==null&&t.gripSpace&&(r=e.getPose(t.gripSpace,i),r!==null&&(l.matrix.fromArray(r.transform.matrix),l.matrix.decompose(l.position,l.rotation,l.scale),l.matrixWorldNeedsUpdate=!0,r.linearVelocity?(l.hasLinearVelocity=!0,l.linearVelocity.copy(r.linearVelocity)):l.hasLinearVelocity=!1,r.angularVelocity?(l.hasAngularVelocity=!0,l.angularVelocity.copy(r.angularVelocity)):l.hasAngularVelocity=!1));a!==null&&(s=e.getPose(t.targetRaySpace,i),s===null&&r!==null&&(s=r),s!==null&&(a.matrix.fromArray(s.transform.matrix),a.matrix.decompose(a.position,a.rotation,a.scale),a.matrixWorldNeedsUpdate=!0,s.linearVelocity?(a.hasLinearVelocity=!0,a.linearVelocity.copy(s.linearVelocity)):a.hasLinearVelocity=!1,s.angularVelocity?(a.hasAngularVelocity=!0,a.angularVelocity.copy(s.angularVelocity)):a.hasAngularVelocity=!1,this.dispatchEvent(Fv)))}return a!==null&&(a.visible=s!==null),l!==null&&(l.visible=r!==null),c!==null&&(c.visible=o!==null),this}_getHandJoint(t,e){if(t.joints[e.jointName]===void 0){const i=new xr;i.matrixAutoUpdate=!1,i.visible=!1,t.joints[e.jointName]=i,t.add(i)}return t.joints[e.jointName]}}class Nv extends qi{constructor(t,e){super();const i=this;let s=null,r=1,o=null,a="local-floor",l=1,c=null,h=null,u=null,d=null,f=null,g=null;const _=e.getContextAttributes();let m=null,p=null;const v=[],x=[],y=new St;let b=null;const E=new An;E.layers.enable(1),E.viewport=new Ue;const S=new An;S.layers.enable(2),S.viewport=new Ue;const C=[E,S],M=new Uv;M.layers.enable(1),M.layers.enable(2);let w=null,U=null;this.cameraAutoUpdate=!0,this.enabled=!1,this.isPresenting=!1,this.getController=function(B){let J=v[B];return J===void 0&&(J=new Fl,v[B]=J),J.getTargetRaySpace()},this.getControllerGrip=function(B){let J=v[B];return J===void 0&&(J=new Fl,v[B]=J),J.getGripSpace()},this.getHand=function(B){let J=v[B];return J===void 0&&(J=new Fl,v[B]=J),J.getHandSpace()};function O(B){const J=x.indexOf(B.inputSource);if(J===-1)return;const ct=v[J];ct!==void 0&&(ct.update(B.inputSource,B.frame,c||o),ct.dispatchEvent({type:B.type,data:B.inputSource}))}function Z(){s.removeEventListener("select",O),s.removeEventListener("selectstart",O),s.removeEventListener("selectend",O),s.removeEventListener("squeeze",O),s.removeEventListener("squeezestart",O),s.removeEventListener("squeezeend",O),s.removeEventListener("end",Z),s.removeEventListener("inputsourceschange",D);for(let B=0;B<v.length;B++){const J=x[B];J!==null&&(x[B]=null,v[B].disconnect(J))}w=null,U=null,t.setRenderTarget(m),f=null,d=null,u=null,s=null,p=null,pt.stop(),i.isPresenting=!1,t.setPixelRatio(b),t.setSize(y.width,y.height,!1),i.dispatchEvent({type:"sessionend"})}this.setFramebufferScaleFactor=function(B){r=B,i.isPresenting===!0&&console.warn("THREE.WebXRManager: Cannot change framebuffer scale while presenting.")},this.setReferenceSpaceType=function(B){a=B,i.isPresenting===!0&&console.warn("THREE.WebXRManager: Cannot change reference space type while presenting.")},this.getReferenceSpace=function(){return c||o},this.setReferenceSpace=function(B){c=B},this.getBaseLayer=function(){return d!==null?d:f},this.getBinding=function(){return u},this.getFrame=function(){return g},this.getSession=function(){return s},this.setSession=async function(B){if(s=B,s!==null){if(m=t.getRenderTarget(),s.addEventListener("select",O),s.addEventListener("selectstart",O),s.addEventListener("selectend",O),s.addEventListener("squeeze",O),s.addEventListener("squeezestart",O),s.addEventListener("squeezeend",O),s.addEventListener("end",Z),s.addEventListener("inputsourceschange",D),_.xrCompatible!==!0&&await e.makeXRCompatible(),b=t.getPixelRatio(),t.getSize(y),s.renderState.layers===void 0||t.capabilities.isWebGL2===!1){const J={antialias:s.renderState.layers===void 0?_.antialias:!0,alpha:!0,depth:_.depth,stencil:_.stencil,framebufferScaleFactor:r};f=new XRWebGLLayer(s,e,J),s.updateRenderState({baseLayer:f}),t.setPixelRatio(1),t.setSize(f.framebufferWidth,f.framebufferHeight,!1),p=new On(f.framebufferWidth,f.framebufferHeight,{format:In,type:Ei,colorSpace:t.outputColorSpace,stencilBuffer:_.stencil})}else{let J=null,ct=null,vt=null;_.depth&&(vt=_.stencil?e.DEPTH24_STENCIL8:e.DEPTH_COMPONENT24,J=_.stencil?Es:ji,ct=_.stencil?Xi:Ti);const Tt={colorFormat:e.RGBA8,depthFormat:vt,scaleFactor:r};u=new XRWebGLBinding(s,e),d=u.createProjectionLayer(Tt),s.updateRenderState({layers:[d]}),t.setPixelRatio(1),t.setSize(d.textureWidth,d.textureHeight,!1),p=new On(d.textureWidth,d.textureHeight,{format:In,type:Ei,depthTexture:new Nu(d.textureWidth,d.textureHeight,ct,void 0,void 0,void 0,void 0,void 0,void 0,J),stencilBuffer:_.stencil,colorSpace:t.outputColorSpace,samples:_.antialias?4:0});const Ft=t.properties.get(p);Ft.__ignoreDepthValues=d.ignoreDepthValues}p.isXRRenderTarget=!0,this.setFoveation(l),c=null,o=await s.requestReferenceSpace(a),pt.setContext(s),pt.start(),i.isPresenting=!0,i.dispatchEvent({type:"sessionstart"})}},this.getEnvironmentBlendMode=function(){if(s!==null)return s.environmentBlendMode};function D(B){for(let J=0;J<B.removed.length;J++){const ct=B.removed[J],vt=x.indexOf(ct);vt>=0&&(x[vt]=null,v[vt].disconnect(ct))}for(let J=0;J<B.added.length;J++){const ct=B.added[J];let vt=x.indexOf(ct);if(vt===-1){for(let Ft=0;Ft<v.length;Ft++)if(Ft>=x.length){x.push(ct),vt=Ft;break}else if(x[Ft]===null){x[Ft]=ct,vt=Ft;break}if(vt===-1)break}const Tt=v[vt];Tt&&Tt.connect(ct)}}const F=new L,V=new L;function $(B,J,ct){F.setFromMatrixPosition(J.matrixWorld),V.setFromMatrixPosition(ct.matrixWorld);const vt=F.distanceTo(V),Tt=J.projectionMatrix.elements,Ft=ct.projectionMatrix.elements,Nt=Tt[14]/(Tt[10]-1),Lt=Tt[14]/(Tt[10]+1),Jt=(Tt[9]+1)/Tt[5],G=(Tt[9]-1)/Tt[5],Be=(Tt[8]-1)/Tt[0],Rt=(Ft[8]+1)/Ft[0],Ot=Nt*Be,yt=Nt*Rt,me=vt/(-Be+Rt),Bt=me*-Be;J.matrixWorld.decompose(B.position,B.quaternion,B.scale),B.translateX(Bt),B.translateZ(me),B.matrixWorld.compose(B.position,B.quaternion,B.scale),B.matrixWorldInverse.copy(B.matrixWorld).invert();const R=Nt+me,T=Lt+me,W=Ot-Bt,rt=yt+(vt-Bt),it=Jt*Lt/T*R,st=G*Lt/T*R;B.projectionMatrix.makePerspective(W,rt,it,st,R,T),B.projectionMatrixInverse.copy(B.projectionMatrix).invert()}function K(B,J){J===null?B.matrixWorld.copy(B.matrix):B.matrixWorld.multiplyMatrices(J.matrixWorld,B.matrix),B.matrixWorldInverse.copy(B.matrixWorld).invert()}this.updateCamera=function(B){if(s===null)return;M.near=S.near=E.near=B.near,M.far=S.far=E.far=B.far,(w!==M.near||U!==M.far)&&(s.updateRenderState({depthNear:M.near,depthFar:M.far}),w=M.near,U=M.far);const J=B.parent,ct=M.cameras;K(M,J);for(let vt=0;vt<ct.length;vt++)K(ct[vt],J);ct.length===2?$(M,E,S):M.projectionMatrix.copy(E.projectionMatrix),Y(B,M,J)};function Y(B,J,ct){ct===null?B.matrix.copy(J.matrixWorld):(B.matrix.copy(ct.matrixWorld),B.matrix.invert(),B.matrix.multiply(J.matrixWorld)),B.matrix.decompose(B.position,B.quaternion,B.scale),B.updateMatrixWorld(!0),B.projectionMatrix.copy(J.projectionMatrix),B.projectionMatrixInverse.copy(J.projectionMatrixInverse),B.isPerspectiveCamera&&(B.fov=ol*2*Math.atan(1/B.projectionMatrix.elements[5]),B.zoom=1)}this.getCamera=function(){return M},this.getFoveation=function(){if(!(d===null&&f===null))return l},this.setFoveation=function(B){l=B,d!==null&&(d.fixedFoveation=B),f!==null&&f.fixedFoveation!==void 0&&(f.fixedFoveation=B)};let Q=null;function et(B,J){if(h=J.getViewerPose(c||o),g=J,h!==null){const ct=h.views;f!==null&&(t.setRenderTargetFramebuffer(p,f.framebuffer),t.setRenderTarget(p));let vt=!1;ct.length!==M.cameras.length&&(M.cameras.length=0,vt=!0);for(let Tt=0;Tt<ct.length;Tt++){const Ft=ct[Tt];let Nt=null;if(f!==null)Nt=f.getViewport(Ft);else{const Jt=u.getViewSubImage(d,Ft);Nt=Jt.viewport,Tt===0&&(t.setRenderTargetTextures(p,Jt.colorTexture,d.ignoreDepthValues?void 0:Jt.depthStencilTexture),t.setRenderTarget(p))}let Lt=C[Tt];Lt===void 0&&(Lt=new An,Lt.layers.enable(Tt),Lt.viewport=new Ue,C[Tt]=Lt),Lt.matrix.fromArray(Ft.transform.matrix),Lt.matrix.decompose(Lt.position,Lt.quaternion,Lt.scale),Lt.projectionMatrix.fromArray(Ft.projectionMatrix),Lt.projectionMatrixInverse.copy(Lt.projectionMatrix).invert(),Lt.viewport.set(Nt.x,Nt.y,Nt.width,Nt.height),Tt===0&&(M.matrix.copy(Lt.matrix),M.matrix.decompose(M.position,M.quaternion,M.scale)),vt===!0&&M.cameras.push(Lt)}}for(let ct=0;ct<v.length;ct++){const vt=x[ct],Tt=v[ct];vt!==null&&Tt!==void 0&&Tt.update(vt,J,c||o)}Q&&Q(B,J),J.detectedPlanes&&i.dispatchEvent({type:"planesdetected",data:J}),g=null}const pt=new Ru;pt.setAnimationLoop(et),this.setAnimationLoop=function(B){Q=B},this.dispose=function(){}}}function kv(n,t){function e(m,p){m.matrixAutoUpdate===!0&&m.updateMatrix(),p.value.copy(m.matrix)}function i(m,p){p.color.getRGB(m.fogColor.value,wu(n)),p.isFog?(m.fogNear.value=p.near,m.fogFar.value=p.far):p.isFogExp2&&(m.fogDensity.value=p.density)}function s(m,p,v,x,y){p.isMeshBasicMaterial||p.isMeshLambertMaterial?r(m,p):p.isMeshToonMaterial?(r(m,p),u(m,p)):p.isMeshPhongMaterial?(r(m,p),h(m,p)):p.isMeshStandardMaterial?(r(m,p),d(m,p),p.isMeshPhysicalMaterial&&f(m,p,y)):p.isMeshMatcapMaterial?(r(m,p),g(m,p)):p.isMeshDepthMaterial?r(m,p):p.isMeshDistanceMaterial?(r(m,p),_(m,p)):p.isMeshNormalMaterial?r(m,p):p.isLineBasicMaterial?(o(m,p),p.isLineDashedMaterial&&a(m,p)):p.isPointsMaterial?l(m,p,v,x):p.isSpriteMaterial?c(m,p):p.isShadowMaterial?(m.color.value.copy(p.color),m.opacity.value=p.opacity):p.isShaderMaterial&&(p.uniformsNeedUpdate=!1)}function r(m,p){m.opacity.value=p.opacity,p.color&&m.diffuse.value.copy(p.color),p.emissive&&m.emissive.value.copy(p.emissive).multiplyScalar(p.emissiveIntensity),p.map&&(m.map.value=p.map,e(p.map,m.mapTransform)),p.alphaMap&&(m.alphaMap.value=p.alphaMap,e(p.alphaMap,m.alphaMapTransform)),p.bumpMap&&(m.bumpMap.value=p.bumpMap,e(p.bumpMap,m.bumpMapTransform),m.bumpScale.value=p.bumpScale,p.side===sn&&(m.bumpScale.value*=-1)),p.normalMap&&(m.normalMap.value=p.normalMap,e(p.normalMap,m.normalMapTransform),m.normalScale.value.copy(p.normalScale),p.side===sn&&m.normalScale.value.negate()),p.displacementMap&&(m.displacementMap.value=p.displacementMap,e(p.displacementMap,m.displacementMapTransform),m.displacementScale.value=p.displacementScale,m.displacementBias.value=p.displacementBias),p.emissiveMap&&(m.emissiveMap.value=p.emissiveMap,e(p.emissiveMap,m.emissiveMapTransform)),p.specularMap&&(m.specularMap.value=p.specularMap,e(p.specularMap,m.specularMapTransform)),p.alphaTest>0&&(m.alphaTest.value=p.alphaTest);const v=t.get(p).envMap;if(v&&(m.envMap.value=v,m.flipEnvMap.value=v.isCubeTexture&&v.isRenderTargetTexture===!1?-1:1,m.reflectivity.value=p.reflectivity,m.ior.value=p.ior,m.refractionRatio.value=p.refractionRatio),p.lightMap){m.lightMap.value=p.lightMap;const x=n._useLegacyLights===!0?Math.PI:1;m.lightMapIntensity.value=p.lightMapIntensity*x,e(p.lightMap,m.lightMapTransform)}p.aoMap&&(m.aoMap.value=p.aoMap,m.aoMapIntensity.value=p.aoMapIntensity,e(p.aoMap,m.aoMapTransform))}function o(m,p){m.diffuse.value.copy(p.color),m.opacity.value=p.opacity,p.map&&(m.map.value=p.map,e(p.map,m.mapTransform))}function a(m,p){m.dashSize.value=p.dashSize,m.totalSize.value=p.dashSize+p.gapSize,m.scale.value=p.scale}function l(m,p,v,x){m.diffuse.value.copy(p.color),m.opacity.value=p.opacity,m.size.value=p.size*v,m.scale.value=x*.5,p.map&&(m.map.value=p.map,e(p.map,m.uvTransform)),p.alphaMap&&(m.alphaMap.value=p.alphaMap,e(p.alphaMap,m.alphaMapTransform)),p.alphaTest>0&&(m.alphaTest.value=p.alphaTest)}function c(m,p){m.diffuse.value.copy(p.color),m.opacity.value=p.opacity,m.rotation.value=p.rotation,p.map&&(m.map.value=p.map,e(p.map,m.mapTransform)),p.alphaMap&&(m.alphaMap.value=p.alphaMap,e(p.alphaMap,m.alphaMapTransform)),p.alphaTest>0&&(m.alphaTest.value=p.alphaTest)}function h(m,p){m.specular.value.copy(p.specular),m.shininess.value=Math.max(p.shininess,1e-4)}function u(m,p){p.gradientMap&&(m.gradientMap.value=p.gradientMap)}function d(m,p){m.metalness.value=p.metalness,p.metalnessMap&&(m.metalnessMap.value=p.metalnessMap,e(p.metalnessMap,m.metalnessMapTransform)),m.roughness.value=p.roughness,p.roughnessMap&&(m.roughnessMap.value=p.roughnessMap,e(p.roughnessMap,m.roughnessMapTransform)),t.get(p).envMap&&(m.envMapIntensity.value=p.envMapIntensity)}function f(m,p,v){m.ior.value=p.ior,p.sheen>0&&(m.sheenColor.value.copy(p.sheenColor).multiplyScalar(p.sheen),m.sheenRoughness.value=p.sheenRoughness,p.sheenColorMap&&(m.sheenColorMap.value=p.sheenColorMap,e(p.sheenColorMap,m.sheenColorMapTransform)),p.sheenRoughnessMap&&(m.sheenRoughnessMap.value=p.sheenRoughnessMap,e(p.sheenRoughnessMap,m.sheenRoughnessMapTransform))),p.clearcoat>0&&(m.clearcoat.value=p.clearcoat,m.clearcoatRoughness.value=p.clearcoatRoughness,p.clearcoatMap&&(m.clearcoatMap.value=p.clearcoatMap,e(p.clearcoatMap,m.clearcoatMapTransform)),p.clearcoatRoughnessMap&&(m.clearcoatRoughnessMap.value=p.clearcoatRoughnessMap,e(p.clearcoatRoughnessMap,m.clearcoatRoughnessMapTransform)),p.clearcoatNormalMap&&(m.clearcoatNormalMap.value=p.clearcoatNormalMap,e(p.clearcoatNormalMap,m.clearcoatNormalMapTransform),m.clearcoatNormalScale.value.copy(p.clearcoatNormalScale),p.side===sn&&m.clearcoatNormalScale.value.negate())),p.iridescence>0&&(m.iridescence.value=p.iridescence,m.iridescenceIOR.value=p.iridescenceIOR,m.iridescenceThicknessMinimum.value=p.iridescenceThicknessRange[0],m.iridescenceThicknessMaximum.value=p.iridescenceThicknessRange[1],p.iridescenceMap&&(m.iridescenceMap.value=p.iridescenceMap,e(p.iridescenceMap,m.iridescenceMapTransform)),p.iridescenceThicknessMap&&(m.iridescenceThicknessMap.value=p.iridescenceThicknessMap,e(p.iridescenceThicknessMap,m.iridescenceThicknessMapTransform))),p.transmission>0&&(m.transmission.value=p.transmission,m.transmissionSamplerMap.value=v.texture,m.transmissionSamplerSize.value.set(v.width,v.height),p.transmissionMap&&(m.transmissionMap.value=p.transmissionMap,e(p.transmissionMap,m.transmissionMapTransform)),m.thickness.value=p.thickness,p.thicknessMap&&(m.thicknessMap.value=p.thicknessMap,e(p.thicknessMap,m.thicknessMapTransform)),m.attenuationDistance.value=p.attenuationDistance,m.attenuationColor.value.copy(p.attenuationColor)),p.anisotropy>0&&(m.anisotropyVector.value.set(p.anisotropy*Math.cos(p.anisotropyRotation),p.anisotropy*Math.sin(p.anisotropyRotation)),p.anisotropyMap&&(m.anisotropyMap.value=p.anisotropyMap,e(p.anisotropyMap,m.anisotropyMapTransform))),m.specularIntensity.value=p.specularIntensity,m.specularColor.value.copy(p.specularColor),p.specularColorMap&&(m.specularColorMap.value=p.specularColorMap,e(p.specularColorMap,m.specularColorMapTransform)),p.specularIntensityMap&&(m.specularIntensityMap.value=p.specularIntensityMap,e(p.specularIntensityMap,m.specularIntensityMapTransform))}function g(m,p){p.matcap&&(m.matcap.value=p.matcap)}function _(m,p){const v=t.get(p).light;m.referencePosition.value.setFromMatrixPosition(v.matrixWorld),m.nearDistance.value=v.shadow.camera.near,m.farDistance.value=v.shadow.camera.far}return{refreshFogUniforms:i,refreshMaterialUniforms:s}}function Bv(n,t,e,i){let s={},r={},o=[];const a=e.isWebGL2?n.getParameter(n.MAX_UNIFORM_BUFFER_BINDINGS):0;function l(v,x){const y=x.program;i.uniformBlockBinding(v,y)}function c(v,x){let y=s[v.id];y===void 0&&(g(v),y=h(v),s[v.id]=y,v.addEventListener("dispose",m));const b=x.program;i.updateUBOMapping(v,b);const E=t.render.frame;r[v.id]!==E&&(d(v),r[v.id]=E)}function h(v){const x=u();v.__bindingPointIndex=x;const y=n.createBuffer(),b=v.__size,E=v.usage;return n.bindBuffer(n.UNIFORM_BUFFER,y),n.bufferData(n.UNIFORM_BUFFER,b,E),n.bindBuffer(n.UNIFORM_BUFFER,null),n.bindBufferBase(n.UNIFORM_BUFFER,x,y),y}function u(){for(let v=0;v<a;v++)if(o.indexOf(v)===-1)return o.push(v),v;return console.error("THREE.WebGLRenderer: Maximum number of simultaneously usable uniforms groups reached."),0}function d(v){const x=s[v.id],y=v.uniforms,b=v.__cache;n.bindBuffer(n.UNIFORM_BUFFER,x);for(let E=0,S=y.length;E<S;E++){const C=Array.isArray(y[E])?y[E]:[y[E]];for(let M=0,w=C.length;M<w;M++){const U=C[M];if(f(U,E,M,b)===!0){const O=U.__offset,Z=Array.isArray(U.value)?U.value:[U.value];let D=0;for(let F=0;F<Z.length;F++){const V=Z[F],$=_(V);typeof V=="number"||typeof V=="boolean"?(U.__data[0]=V,n.bufferSubData(n.UNIFORM_BUFFER,O+D,U.__data)):V.isMatrix3?(U.__data[0]=V.elements[0],U.__data[1]=V.elements[1],U.__data[2]=V.elements[2],U.__data[3]=0,U.__data[4]=V.elements[3],U.__data[5]=V.elements[4],U.__data[6]=V.elements[5],U.__data[7]=0,U.__data[8]=V.elements[6],U.__data[9]=V.elements[7],U.__data[10]=V.elements[8],U.__data[11]=0):(V.toArray(U.__data,D),D+=$.storage/Float32Array.BYTES_PER_ELEMENT)}n.bufferSubData(n.UNIFORM_BUFFER,O,U.__data)}}}n.bindBuffer(n.UNIFORM_BUFFER,null)}function f(v,x,y,b){const E=v.value,S=x+"_"+y;if(b[S]===void 0)return typeof E=="number"||typeof E=="boolean"?b[S]=E:b[S]=E.clone(),!0;{const C=b[S];if(typeof E=="number"||typeof E=="boolean"){if(C!==E)return b[S]=E,!0}else if(C.equals(E)===!1)return C.copy(E),!0}return!1}function g(v){const x=v.uniforms;let y=0;const b=16;for(let S=0,C=x.length;S<C;S++){const M=Array.isArray(x[S])?x[S]:[x[S]];for(let w=0,U=M.length;w<U;w++){const O=M[w],Z=Array.isArray(O.value)?O.value:[O.value];for(let D=0,F=Z.length;D<F;D++){const V=Z[D],$=_(V),K=y%b;K!==0&&b-K<$.boundary&&(y+=b-K),O.__data=new Float32Array($.storage/Float32Array.BYTES_PER_ELEMENT),O.__offset=y,y+=$.storage}}}const E=y%b;return E>0&&(y+=b-E),v.__size=y,v.__cache={},this}function _(v){const x={boundary:0,storage:0};return typeof v=="number"||typeof v=="boolean"?(x.boundary=4,x.storage=4):v.isVector2?(x.boundary=8,x.storage=8):v.isVector3||v.isColor?(x.boundary=16,x.storage=12):v.isVector4?(x.boundary=16,x.storage=16):v.isMatrix3?(x.boundary=48,x.storage=48):v.isMatrix4?(x.boundary=64,x.storage=64):v.isTexture?console.warn("THREE.WebGLRenderer: Texture samplers can not be part of an uniforms group."):console.warn("THREE.WebGLRenderer: Unsupported uniform value type.",v),x}function m(v){const x=v.target;x.removeEventListener("dispose",m);const y=o.indexOf(x.__bindingPointIndex);o.splice(y,1),n.deleteBuffer(s[x.id]),delete s[x.id],delete r[x.id]}function p(){for(const v in s)n.deleteBuffer(s[v]);o=[],s={},r={}}return{bind:l,update:c,dispose:p}}class sd{constructor(t={}){const{canvas:e=gg(),context:i=null,depth:s=!0,stencil:r=!0,alpha:o=!1,antialias:a=!1,premultipliedAlpha:l=!0,preserveDrawingBuffer:c=!1,powerPreference:h="default",failIfMajorPerformanceCaveat:u=!1}=t;this.isWebGLRenderer=!0;let d;i!==null?d=i.getContextAttributes().alpha:d=o;const f=new Uint32Array(4),g=new Int32Array(4);let _=null,m=null;const p=[],v=[];this.domElement=e,this.debug={checkShaderErrors:!0,onShaderError:null},this.autoClear=!0,this.autoClearColor=!0,this.autoClearDepth=!0,this.autoClearStencil=!0,this.sortObjects=!0,this.clippingPlanes=[],this.localClippingEnabled=!1,this._outputColorSpace=Ve,this._useLegacyLights=!1,this.toneMapping=Si,this.toneMappingExposure=1;const x=this;let y=!1,b=0,E=0,S=null,C=-1,M=null;const w=new Ue,U=new Ue;let O=null;const Z=new xt(0);let D=0,F=e.width,V=e.height,$=1,K=null,Y=null;const Q=new Ue(0,0,F,V),et=new Ue(0,0,F,V);let pt=!1;const B=new Al;let J=!1,ct=!1,vt=null;const Tt=new ge,Ft=new St,Nt=new L,Lt={background:null,fog:null,environment:null,overrideMaterial:null,isScene:!0};function Jt(){return S===null?$:1}let G=i;function Be(A,k){for(let j=0;j<A.length;j++){const q=A[j],X=e.getContext(q,k);if(X!==null)return X}return null}try{const A={alpha:!0,depth:s,stencil:r,antialias:a,premultipliedAlpha:l,preserveDrawingBuffer:c,powerPreference:h,failIfMajorPerformanceCaveat:u};if("setAttribute"in e&&e.setAttribute("data-engine","three.js r160"),e.addEventListener("webglcontextlost",ht,!1),e.addEventListener("webglcontextrestored",I,!1),e.addEventListener("webglcontextcreationerror",at,!1),G===null){const k=["webgl2","webgl","experimental-webgl"];if(x.isWebGL1Renderer===!0&&k.shift(),G=Be(k,A),G===null)throw Be(k)?new Error("Error creating WebGL context with your selected attributes."):new Error("Error creating WebGL context.")}typeof WebGLRenderingContext<"u"&&G instanceof WebGLRenderingContext&&console.warn("THREE.WebGLRenderer: WebGL 1 support was deprecated in r153 and will be removed in r163."),G.getShaderPrecisionFormat===void 0&&(G.getShaderPrecisionFormat=function(){return{rangeMin:1,rangeMax:1,precision:1}})}catch(A){throw console.error("THREE.WebGLRenderer: "+A.message),A}let Rt,Ot,yt,me,Bt,R,T,W,rt,it,st,Et,gt,bt,Dt,Ht,nt,Qt,P,tt,dt,ot,wt,qt;function te(){Rt=new $_(G),Ot=new G_(G,Rt,t),Rt.init(Ot),ot=new Ov(G,Rt,Ot),yt=new Dv(G,Rt,Ot),me=new J_(G),Bt=new xv,R=new Iv(G,Rt,yt,Bt,Ot,ot,me),T=new X_(x),W=new q_(x),rt=new zg(G,Ot),wt=new H_(G,Rt,rt,Ot),it=new K_(G,rt,me,wt),st=new nx(G,it,rt,me),P=new ex(G,Ot,R),Ht=new W_(Bt),Et=new _v(x,T,W,Rt,Ot,wt,Ht),gt=new kv(x,Bt),bt=new bv,Dt=new wv(Rt,Ot),Qt=new z_(x,T,W,yt,st,d,l),nt=new Lv(x,st,Ot),qt=new Bv(G,me,Ot,yt),tt=new V_(G,Rt,me,Ot),dt=new Z_(G,Rt,me,Ot),me.programs=Et.programs,x.capabilities=Ot,x.extensions=Rt,x.properties=Bt,x.renderLists=bt,x.shadowMap=nt,x.state=yt,x.info=me}te();const Xt=new Nv(x,G);this.xr=Xt,this.getContext=function(){return G},this.getContextAttributes=function(){return G.getContextAttributes()},this.forceContextLoss=function(){const A=Rt.get("WEBGL_lose_context");A&&A.loseContext()},this.forceContextRestore=function(){const A=Rt.get("WEBGL_lose_context");A&&A.restoreContext()},this.getPixelRatio=function(){return $},this.setPixelRatio=function(A){A!==void 0&&($=A,this.setSize(F,V,!1))},this.getSize=function(A){return A.set(F,V)},this.setSize=function(A,k,j=!0){if(Xt.isPresenting){console.warn("THREE.WebGLRenderer: Can't change size while VR device is presenting.");return}F=A,V=k,e.width=Math.floor(A*$),e.height=Math.floor(k*$),j===!0&&(e.style.width=A+"px",e.style.height=k+"px"),this.setViewport(0,0,A,k)},this.getDrawingBufferSize=function(A){return A.set(F*$,V*$).floor()},this.setDrawingBufferSize=function(A,k,j){F=A,V=k,$=j,e.width=Math.floor(A*j),e.height=Math.floor(k*j),this.setViewport(0,0,A,k)},this.getCurrentViewport=function(A){return A.copy(w)},this.getViewport=function(A){return A.copy(Q)},this.setViewport=function(A,k,j,q){A.isVector4?Q.set(A.x,A.y,A.z,A.w):Q.set(A,k,j,q),yt.viewport(w.copy(Q).multiplyScalar($).floor())},this.getScissor=function(A){return A.copy(et)},this.setScissor=function(A,k,j,q){A.isVector4?et.set(A.x,A.y,A.z,A.w):et.set(A,k,j,q),yt.scissor(U.copy(et).multiplyScalar($).floor())},this.getScissorTest=function(){return pt},this.setScissorTest=function(A){yt.setScissorTest(pt=A)},this.setOpaqueSort=function(A){K=A},this.setTransparentSort=function(A){Y=A},this.getClearColor=function(A){return A.copy(Qt.getClearColor())},this.setClearColor=function(){Qt.setClearColor.apply(Qt,arguments)},this.getClearAlpha=function(){return Qt.getClearAlpha()},this.setClearAlpha=function(){Qt.setClearAlpha.apply(Qt,arguments)},this.clear=function(A=!0,k=!0,j=!0){let q=0;if(A){let X=!1;if(S!==null){const _t=S.texture.format;X=_t===Sh||_t===yh||_t===Mh}if(X){const _t=S.texture.type,Ct=_t===Ei||_t===Ti||_t===Ja||_t===Xi||_t===vh||_t===bh,It=Qt.getClearColor(),Ut=Qt.getClearAlpha(),jt=It.r,zt=It.g,Vt=It.b;Ct?(f[0]=jt,f[1]=zt,f[2]=Vt,f[3]=Ut,G.clearBufferuiv(G.COLOR,0,f)):(g[0]=jt,g[1]=zt,g[2]=Vt,g[3]=Ut,G.clearBufferiv(G.COLOR,0,g))}else q|=G.COLOR_BUFFER_BIT}k&&(q|=G.DEPTH_BUFFER_BIT),j&&(q|=G.STENCIL_BUFFER_BIT,this.state.buffers.stencil.setMask(4294967295)),G.clear(q)},this.clearColor=function(){this.clear(!0,!1,!1)},this.clearDepth=function(){this.clear(!1,!0,!1)},this.clearStencil=function(){this.clear(!1,!1,!0)},this.dispose=function(){e.removeEventListener("webglcontextlost",ht,!1),e.removeEventListener("webglcontextrestored",I,!1),e.removeEventListener("webglcontextcreationerror",at,!1),bt.dispose(),Dt.dispose(),Bt.dispose(),T.dispose(),W.dispose(),st.dispose(),wt.dispose(),qt.dispose(),Et.dispose(),Xt.dispose(),Xt.removeEventListener("sessionstart",tn),Xt.removeEventListener("sessionend",de),vt&&(vt.dispose(),vt=null),en.stop()};function ht(A){A.preventDefault(),console.log("THREE.WebGLRenderer: Context Lost."),y=!0}function I(){console.log("THREE.WebGLRenderer: Context Restored."),y=!1;const A=me.autoReset,k=nt.enabled,j=nt.autoUpdate,q=nt.needsUpdate,X=nt.type;te(),me.autoReset=A,nt.enabled=k,nt.autoUpdate=j,nt.needsUpdate=q,nt.type=X}function at(A){console.error("THREE.WebGLRenderer: A WebGL context could not be created. Reason: ",A.statusMessage)}function lt(A){const k=A.target;k.removeEventListener("dispose",lt),Pt(k)}function Pt(A){At(A),Bt.remove(A)}function At(A){const k=Bt.get(A).programs;k!==void 0&&(k.forEach(function(j){Et.releaseProgram(j)}),A.isShaderMaterial&&Et.releaseShaderCache(A))}this.renderBufferDirect=function(A,k,j,q,X,_t){k===null&&(k=Lt);const Ct=X.isMesh&&X.matrixWorld.determinant()<0,It=JT(A,k,j,q,X);yt.setMaterial(q,Ct);let Ut=j.index,jt=1;if(q.wireframe===!0){if(Ut=it.getWireframeAttribute(j),Ut===void 0)return;jt=2}const zt=j.drawRange,Vt=j.attributes.position;let Te=zt.start*jt,bn=(zt.start+zt.count)*jt;_t!==null&&(Te=Math.max(Te,_t.start*jt),bn=Math.min(bn,(_t.start+_t.count)*jt)),Ut!==null?(Te=Math.max(Te,0),bn=Math.min(bn,Ut.count)):Vt!=null&&(Te=Math.max(Te,0),bn=Math.min(bn,Vt.count));const He=bn-Te;if(He<0||He===1/0)return;wt.setup(X,q,It,j,Ut);let Mi,ve=tt;if(Ut!==null&&(Mi=rt.get(Ut),ve=dt,ve.setIndex(Mi)),X.isMesh)q.wireframe===!0?(yt.setLineWidth(q.wireframeLinewidth*Jt()),ve.setMode(G.LINES)):ve.setMode(G.TRIANGLES);else if(X.isLine){let $t=q.linewidth;$t===void 0&&($t=1),yt.setLineWidth($t*Jt()),X.isLineSegments?ve.setMode(G.LINES):X.isLineLoop?ve.setMode(G.LINE_LOOP):ve.setMode(G.LINE_STRIP)}else X.isPoints?ve.setMode(G.POINTS):X.isSprite&&ve.setMode(G.TRIANGLES);if(X.isBatchedMesh)ve.renderMultiDraw(X._multiDrawStarts,X._multiDrawCounts,X._multiDrawCount);else if(X.isInstancedMesh)ve.renderInstances(Te,He,X.count);else if(j.isInstancedBufferGeometry){const $t=j._maxInstanceCount!==void 0?j._maxInstanceCount:1/0,th=Math.min(j.instanceCount,$t);ve.renderInstances(Te,He,th)}else ve.render(Te,He)};function ne(A,k,j){A.transparent===!0&&A.side===dn&&A.forceSinglePass===!1?(A.side=sn,A.needsUpdate=!0,Va(A,k,j),A.side=yi,A.needsUpdate=!0,Va(A,k,j),A.side=dn):Va(A,k,j)}this.compile=function(A,k,j=null){j===null&&(j=A),m=Dt.get(j),m.init(),v.push(m),j.traverseVisible(function(X){X.isLight&&X.layers.test(k.layers)&&(m.pushLight(X),X.castShadow&&m.pushShadow(X))}),A!==j&&A.traverseVisible(function(X){X.isLight&&X.layers.test(k.layers)&&(m.pushLight(X),X.castShadow&&m.pushShadow(X))}),m.setupLights(x._useLegacyLights);const q=new Set;return A.traverse(function(X){const _t=X.material;if(_t)if(Array.isArray(_t))for(let Ct=0;Ct<_t.length;Ct++){const It=_t[Ct];ne(It,j,X),q.add(It)}else ne(_t,j,X),q.add(_t)}),v.pop(),m=null,q},this.compileAsync=function(A,k,j=null){const q=this.compile(A,k,j);return new Promise(X=>{function _t(){if(q.forEach(function(Ct){Bt.get(Ct).currentProgram.isReady()&&q.delete(Ct)}),q.size===0){X(A);return}setTimeout(_t,10)}Rt.get("KHR_parallel_shader_compile")!==null?_t():setTimeout(_t,10)})};let ie=null;function ze(A){ie&&ie(A)}function tn(){en.stop()}function de(){en.start()}const en=new Ru;en.setAnimationLoop(ze),typeof self<"u"&&en.setContext(self),this.setAnimationLoop=function(A){ie=A,Xt.setAnimationLoop(A),A===null?en.stop():en.start()},Xt.addEventListener("sessionstart",tn),Xt.addEventListener("sessionend",de),this.render=function(A,k){if(k!==void 0&&k.isCamera!==!0){console.error("THREE.WebGLRenderer.render: camera is not an instance of THREE.Camera.");return}if(y===!0)return;A.matrixWorldAutoUpdate===!0&&A.updateMatrixWorld(),k.parent===null&&k.matrixWorldAutoUpdate===!0&&k.updateMatrixWorld(),Xt.enabled===!0&&Xt.isPresenting===!0&&(Xt.cameraAutoUpdate===!0&&Xt.updateCamera(k),k=Xt.getCamera()),A.isScene===!0&&A.onBeforeRender(x,A,k,S),m=Dt.get(A,v.length),m.init(),v.push(m),Tt.multiplyMatrices(k.projectionMatrix,k.matrixWorldInverse),B.setFromProjectionMatrix(Tt),ct=this.localClippingEnabled,J=Ht.init(this.clippingPlanes,ct),_=bt.get(A,p.length),_.init(),p.push(_),ti(A,k,0,x.sortObjects),_.finish(),x.sortObjects===!0&&_.sort(K,Y),this.info.render.frame++,J===!0&&Ht.beginShadows();const j=m.state.shadowsArray;if(nt.render(j,A,k),J===!0&&Ht.endShadows(),this.info.autoReset===!0&&this.info.reset(),Qt.render(_,A),m.setupLights(x._useLegacyLights),k.isArrayCamera){const q=k.cameras;for(let X=0,_t=q.length;X<_t;X++){const Ct=q[X];pm(_,A,Ct,Ct.viewport)}}else pm(_,A,k);S!==null&&(R.updateMultisampleRenderTarget(S),R.updateRenderTargetMipmap(S)),A.isScene===!0&&A.onAfterRender(x,A,k),wt.resetDefaultState(),C=-1,M=null,v.pop(),v.length>0?m=v[v.length-1]:m=null,p.pop(),p.length>0?_=p[p.length-1]:_=null};function ti(A,k,j,q){if(A.visible===!1)return;if(A.layers.test(k.layers)){if(A.isGroup)j=A.renderOrder;else if(A.isLOD)A.autoUpdate===!0&&A.update(k);else if(A.isLight)m.pushLight(A),A.castShadow&&m.pushShadow(A);else if(A.isSprite){if(!A.frustumCulled||B.intersectsSprite(A)){q&&Nt.setFromMatrixPosition(A.matrixWorld).applyMatrix4(Tt);const Ct=st.update(A),It=A.material;It.visible&&_.push(A,Ct,It,j,Nt.z,null)}}else if((A.isMesh||A.isLine||A.isPoints)&&(!A.frustumCulled||B.intersectsObject(A))){const Ct=st.update(A),It=A.material;if(q&&(A.boundingSphere!==void 0?(A.boundingSphere===null&&A.computeBoundingSphere(),Nt.copy(A.boundingSphere.center)):(Ct.boundingSphere===null&&Ct.computeBoundingSphere(),Nt.copy(Ct.boundingSphere.center)),Nt.applyMatrix4(A.matrixWorld).applyMatrix4(Tt)),Array.isArray(It)){const Ut=Ct.groups;for(let jt=0,zt=Ut.length;jt<zt;jt++){const Vt=Ut[jt],Te=It[Vt.materialIndex];Te&&Te.visible&&_.push(A,Ct,Te,j,Nt.z,Vt)}}else It.visible&&_.push(A,Ct,It,j,Nt.z,null)}}const _t=A.children;for(let Ct=0,It=_t.length;Ct<It;Ct++)ti(_t[Ct],k,j,q)}function pm(A,k,j,q){const X=A.opaque,_t=A.transmissive,Ct=A.transparent;m.setupLightsView(j),J===!0&&Ht.setGlobalState(x.clippingPlanes,j),_t.length>0&&ZT(X,_t,k,j),q&&yt.viewport(w.copy(q)),X.length>0&&Ha(X,k,j),_t.length>0&&Ha(_t,k,j),Ct.length>0&&Ha(Ct,k,j),yt.buffers.depth.setTest(!0),yt.buffers.depth.setMask(!0),yt.buffers.color.setMask(!0),yt.setPolygonOffset(!1)}function ZT(A,k,j,q){if((j.isScene===!0?j.overrideMaterial:null)!==null)return;const _t=Ot.isWebGL2;vt===null&&(vt=new On(1,1,{generateMipmaps:!0,type:Rt.has("EXT_color_buffer_half_float")?ii:Ei,minFilter:ar,samples:_t?4:0})),x.getDrawingBufferSize(Ft),_t?vt.setSize(Ft.x,Ft.y):vt.setSize(ll(Ft.x),ll(Ft.y));const Ct=x.getRenderTarget();x.setRenderTarget(vt),x.getClearColor(Z),D=x.getClearAlpha(),D<1&&x.setClearColor(16777215,.5),x.clear();const It=x.toneMapping;x.toneMapping=Si,Ha(A,j,q),R.updateMultisampleRenderTarget(vt),R.updateRenderTargetMipmap(vt);let Ut=!1;for(let jt=0,zt=k.length;jt<zt;jt++){const Vt=k[jt],Te=Vt.object,bn=Vt.geometry,He=Vt.material,Mi=Vt.group;if(He.side===dn&&Te.layers.test(q.layers)){const ve=He.side;He.side=sn,He.needsUpdate=!0,mm(Te,j,q,bn,He,Mi),He.side=ve,He.needsUpdate=!0,Ut=!0}}Ut===!0&&(R.updateMultisampleRenderTarget(vt),R.updateRenderTargetMipmap(vt)),x.setRenderTarget(Ct),x.setClearColor(Z,D),x.toneMapping=It}function Ha(A,k,j){const q=k.isScene===!0?k.overrideMaterial:null;for(let X=0,_t=A.length;X<_t;X++){const Ct=A[X],It=Ct.object,Ut=Ct.geometry,jt=q===null?Ct.material:q,zt=Ct.group;It.layers.test(j.layers)&&mm(It,k,j,Ut,jt,zt)}}function mm(A,k,j,q,X,_t){A.onBeforeRender(x,k,j,q,X,_t),A.modelViewMatrix.multiplyMatrices(j.matrixWorldInverse,A.matrixWorld),A.normalMatrix.getNormalMatrix(A.modelViewMatrix),X.onBeforeRender(x,k,j,q,A,_t),X.transparent===!0&&X.side===dn&&X.forceSinglePass===!1?(X.side=sn,X.needsUpdate=!0,x.renderBufferDirect(j,k,q,X,A,_t),X.side=yi,X.needsUpdate=!0,x.renderBufferDirect(j,k,q,X,A,_t),X.side=dn):x.renderBufferDirect(j,k,q,X,A,_t),A.onAfterRender(x,k,j,q,X,_t)}function Va(A,k,j){k.isScene!==!0&&(k=Lt);const q=Bt.get(A),X=m.state.lights,_t=m.state.shadowsArray,Ct=X.state.version,It=Et.getParameters(A,X.state,_t,k,j),Ut=Et.getProgramCacheKey(It);let jt=q.programs;q.environment=A.isMeshStandardMaterial?k.environment:null,q.fog=k.fog,q.envMap=(A.isMeshStandardMaterial?W:T).get(A.envMap||q.environment),jt===void 0&&(A.addEventListener("dispose",lt),jt=new Map,q.programs=jt);let zt=jt.get(Ut);if(zt!==void 0){if(q.currentProgram===zt&&q.lightsStateVersion===Ct)return _m(A,It),zt}else It.uniforms=Et.getUniforms(A),A.onBuild(j,It,x),A.onBeforeCompile(It,x),zt=Et.acquireProgram(It,Ut),jt.set(Ut,zt),q.uniforms=It.uniforms;const Vt=q.uniforms;return(!A.isShaderMaterial&&!A.isRawShaderMaterial||A.clipping===!0)&&(Vt.clippingPlanes=Ht.uniform),_m(A,It),q.needsLights=tw(A),q.lightsStateVersion=Ct,q.needsLights&&(Vt.ambientLightColor.value=X.state.ambient,Vt.lightProbe.value=X.state.probe,Vt.directionalLights.value=X.state.directional,Vt.directionalLightShadows.value=X.state.directionalShadow,Vt.spotLights.value=X.state.spot,Vt.spotLightShadows.value=X.state.spotShadow,Vt.rectAreaLights.value=X.state.rectArea,Vt.ltc_1.value=X.state.rectAreaLTC1,Vt.ltc_2.value=X.state.rectAreaLTC2,Vt.pointLights.value=X.state.point,Vt.pointLightShadows.value=X.state.pointShadow,Vt.hemisphereLights.value=X.state.hemi,Vt.directionalShadowMap.value=X.state.directionalShadowMap,Vt.directionalShadowMatrix.value=X.state.directionalShadowMatrix,Vt.spotShadowMap.value=X.state.spotShadowMap,Vt.spotLightMatrix.value=X.state.spotLightMatrix,Vt.spotLightMap.value=X.state.spotLightMap,Vt.pointShadowMap.value=X.state.pointShadowMap,Vt.pointShadowMatrix.value=X.state.pointShadowMatrix),q.currentProgram=zt,q.uniformsList=null,zt}function gm(A){if(A.uniformsList===null){const k=A.currentProgram.getUniforms();A.uniformsList=Bo.seqWithValue(k.seq,A.uniforms)}return A.uniformsList}function _m(A,k){const j=Bt.get(A);j.outputColorSpace=k.outputColorSpace,j.batching=k.batching,j.instancing=k.instancing,j.instancingColor=k.instancingColor,j.skinning=k.skinning,j.morphTargets=k.morphTargets,j.morphNormals=k.morphNormals,j.morphColors=k.morphColors,j.morphTargetsCount=k.morphTargetsCount,j.numClippingPlanes=k.numClippingPlanes,j.numIntersection=k.numClipIntersection,j.vertexAlphas=k.vertexAlphas,j.vertexTangents=k.vertexTangents,j.toneMapping=k.toneMapping}function JT(A,k,j,q,X){k.isScene!==!0&&(k=Lt),R.resetTextureUnits();const _t=k.fog,Ct=q.isMeshStandardMaterial?k.environment:null,It=S===null?x.outputColorSpace:S.isXRRenderTarget===!0?S.texture.colorSpace:si,Ut=(q.isMeshStandardMaterial?W:T).get(q.envMap||Ct),jt=q.vertexColors===!0&&!!j.attributes.color&&j.attributes.color.itemSize===4,zt=!!j.attributes.tangent&&(!!q.normalMap||q.anisotropy>0),Vt=!!j.morphAttributes.position,Te=!!j.morphAttributes.normal,bn=!!j.morphAttributes.color;let He=Si;q.toneMapped&&(S===null||S.isXRRenderTarget===!0)&&(He=x.toneMapping);const Mi=j.morphAttributes.position||j.morphAttributes.normal||j.morphAttributes.color,ve=Mi!==void 0?Mi.length:0,$t=Bt.get(q),th=m.state.lights;if(J===!0&&(ct===!0||A!==M)){const Pn=A===M&&q.id===C;Ht.setState(q,A,Pn)}let ye=!1;q.version===$t.__version?($t.needsLights&&$t.lightsStateVersion!==th.state.version||$t.outputColorSpace!==It||X.isBatchedMesh&&$t.batching===!1||!X.isBatchedMesh&&$t.batching===!0||X.isInstancedMesh&&$t.instancing===!1||!X.isInstancedMesh&&$t.instancing===!0||X.isSkinnedMesh&&$t.skinning===!1||!X.isSkinnedMesh&&$t.skinning===!0||X.isInstancedMesh&&$t.instancingColor===!0&&X.instanceColor===null||X.isInstancedMesh&&$t.instancingColor===!1&&X.instanceColor!==null||$t.envMap!==Ut||q.fog===!0&&$t.fog!==_t||$t.numClippingPlanes!==void 0&&($t.numClippingPlanes!==Ht.numPlanes||$t.numIntersection!==Ht.numIntersection)||$t.vertexAlphas!==jt||$t.vertexTangents!==zt||$t.morphTargets!==Vt||$t.morphNormals!==Te||$t.morphColors!==bn||$t.toneMapping!==He||Ot.isWebGL2===!0&&$t.morphTargetsCount!==ve)&&(ye=!0):(ye=!0,$t.__version=q.version);let xs=$t.currentProgram;ye===!0&&(xs=Va(q,k,X));let xm=!1,so=!1,eh=!1;const Ke=xs.getUniforms(),vs=$t.uniforms;if(yt.useProgram(xs.program)&&(xm=!0,so=!0,eh=!0),q.id!==C&&(C=q.id,so=!0),xm||M!==A){Ke.setValue(G,"projectionMatrix",A.projectionMatrix),Ke.setValue(G,"viewMatrix",A.matrixWorldInverse);const Pn=Ke.map.cameraPosition;Pn!==void 0&&Pn.setValue(G,Nt.setFromMatrixPosition(A.matrixWorld)),Ot.logarithmicDepthBuffer&&Ke.setValue(G,"logDepthBufFC",2/(Math.log(A.far+1)/Math.LN2)),(q.isMeshPhongMaterial||q.isMeshToonMaterial||q.isMeshLambertMaterial||q.isMeshBasicMaterial||q.isMeshStandardMaterial||q.isShaderMaterial)&&Ke.setValue(G,"isOrthographic",A.isOrthographicCamera===!0),M!==A&&(M=A,so=!0,eh=!0)}if(X.isSkinnedMesh){Ke.setOptional(G,X,"bindMatrix"),Ke.setOptional(G,X,"bindMatrixInverse");const Pn=X.skeleton;Pn&&(Ot.floatVertexTextures?(Pn.boneTexture===null&&Pn.computeBoneTexture(),Ke.setValue(G,"boneTexture",Pn.boneTexture,R)):console.warn("THREE.WebGLRenderer: SkinnedMesh can only be used with WebGL 2. With WebGL 1 OES_texture_float and vertex textures support is required."))}X.isBatchedMesh&&(Ke.setOptional(G,X,"batchingTexture"),Ke.setValue(G,"batchingTexture",X._matricesTexture,R));const nh=j.morphAttributes;if((nh.position!==void 0||nh.normal!==void 0||nh.color!==void 0&&Ot.isWebGL2===!0)&&P.update(X,j,xs),(so||$t.receiveShadow!==X.receiveShadow)&&($t.receiveShadow=X.receiveShadow,Ke.setValue(G,"receiveShadow",X.receiveShadow)),q.isMeshGouraudMaterial&&q.envMap!==null&&(vs.envMap.value=Ut,vs.flipEnvMap.value=Ut.isCubeTexture&&Ut.isRenderTargetTexture===!1?-1:1),so&&(Ke.setValue(G,"toneMappingExposure",x.toneMappingExposure),$t.needsLights&&QT(vs,eh),_t&&q.fog===!0&&gt.refreshFogUniforms(vs,_t),gt.refreshMaterialUniforms(vs,q,$,V,vt),Bo.upload(G,gm($t),vs,R)),q.isShaderMaterial&&q.uniformsNeedUpdate===!0&&(Bo.upload(G,gm($t),vs,R),q.uniformsNeedUpdate=!1),q.isSpriteMaterial&&Ke.setValue(G,"center",X.center),Ke.setValue(G,"modelViewMatrix",X.modelViewMatrix),Ke.setValue(G,"normalMatrix",X.normalMatrix),Ke.setValue(G,"modelMatrix",X.matrixWorld),q.isShaderMaterial||q.isRawShaderMaterial){const Pn=q.uniformsGroups;for(let ih=0,ew=Pn.length;ih<ew;ih++)if(Ot.isWebGL2){const vm=Pn[ih];qt.update(vm,xs),qt.bind(vm,xs)}else console.warn("THREE.WebGLRenderer: Uniform Buffer Objects can only be used with WebGL 2.")}return xs}function QT(A,k){A.ambientLightColor.needsUpdate=k,A.lightProbe.needsUpdate=k,A.directionalLights.needsUpdate=k,A.directionalLightShadows.needsUpdate=k,A.pointLights.needsUpdate=k,A.pointLightShadows.needsUpdate=k,A.spotLights.needsUpdate=k,A.spotLightShadows.needsUpdate=k,A.rectAreaLights.needsUpdate=k,A.hemisphereLights.needsUpdate=k}function tw(A){return A.isMeshLambertMaterial||A.isMeshToonMaterial||A.isMeshPhongMaterial||A.isMeshStandardMaterial||A.isShadowMaterial||A.isShaderMaterial&&A.lights===!0}this.getActiveCubeFace=function(){return b},this.getActiveMipmapLevel=function(){return E},this.getRenderTarget=function(){return S},this.setRenderTargetTextures=function(A,k,j){Bt.get(A.texture).__webglTexture=k,Bt.get(A.depthTexture).__webglTexture=j;const q=Bt.get(A);q.__hasExternalTextures=!0,q.__hasExternalTextures&&(q.__autoAllocateDepthBuffer=j===void 0,q.__autoAllocateDepthBuffer||Rt.has("WEBGL_multisampled_render_to_texture")===!0&&(console.warn("THREE.WebGLRenderer: Render-to-texture extension was disabled because an external texture was provided"),q.__useRenderToTexture=!1))},this.setRenderTargetFramebuffer=function(A,k){const j=Bt.get(A);j.__webglFramebuffer=k,j.__useDefaultFramebuffer=k===void 0},this.setRenderTarget=function(A,k=0,j=0){S=A,b=k,E=j;let q=!0,X=null,_t=!1,Ct=!1;if(A){const Ut=Bt.get(A);Ut.__useDefaultFramebuffer!==void 0?(yt.bindFramebuffer(G.FRAMEBUFFER,null),q=!1):Ut.__webglFramebuffer===void 0?R.setupRenderTarget(A):Ut.__hasExternalTextures&&R.rebindTextures(A,Bt.get(A.texture).__webglTexture,Bt.get(A.depthTexture).__webglTexture);const jt=A.texture;(jt.isData3DTexture||jt.isDataArrayTexture||jt.isCompressedArrayTexture)&&(Ct=!0);const zt=Bt.get(A).__webglFramebuffer;A.isWebGLCubeRenderTarget?(Array.isArray(zt[k])?X=zt[k][j]:X=zt[k],_t=!0):Ot.isWebGL2&&A.samples>0&&R.useMultisampledRTT(A)===!1?X=Bt.get(A).__webglMultisampledFramebuffer:Array.isArray(zt)?X=zt[j]:X=zt,w.copy(A.viewport),U.copy(A.scissor),O=A.scissorTest}else w.copy(Q).multiplyScalar($).floor(),U.copy(et).multiplyScalar($).floor(),O=pt;if(yt.bindFramebuffer(G.FRAMEBUFFER,X)&&Ot.drawBuffers&&q&&yt.drawBuffers(A,X),yt.viewport(w),yt.scissor(U),yt.setScissorTest(O),_t){const Ut=Bt.get(A.texture);G.framebufferTexture2D(G.FRAMEBUFFER,G.COLOR_ATTACHMENT0,G.TEXTURE_CUBE_MAP_POSITIVE_X+k,Ut.__webglTexture,j)}else if(Ct){const Ut=Bt.get(A.texture),jt=k||0;G.framebufferTextureLayer(G.FRAMEBUFFER,G.COLOR_ATTACHMENT0,Ut.__webglTexture,j||0,jt)}C=-1},this.readRenderTargetPixels=function(A,k,j,q,X,_t,Ct){if(!(A&&A.isWebGLRenderTarget)){console.error("THREE.WebGLRenderer.readRenderTargetPixels: renderTarget is not THREE.WebGLRenderTarget.");return}let It=Bt.get(A).__webglFramebuffer;if(A.isWebGLCubeRenderTarget&&Ct!==void 0&&(It=It[Ct]),It){yt.bindFramebuffer(G.FRAMEBUFFER,It);try{const Ut=A.texture,jt=Ut.format,zt=Ut.type;if(jt!==In&&ot.convert(jt)!==G.getParameter(G.IMPLEMENTATION_COLOR_READ_FORMAT)){console.error("THREE.WebGLRenderer.readRenderTargetPixels: renderTarget is not in RGBA or implementation defined format.");return}const Vt=zt===ii&&(Rt.has("EXT_color_buffer_half_float")||Ot.isWebGL2&&Rt.has("EXT_color_buffer_float"));if(zt!==Ei&&ot.convert(zt)!==G.getParameter(G.IMPLEMENTATION_COLOR_READ_TYPE)&&!(zt===wi&&(Ot.isWebGL2||Rt.has("OES_texture_float")||Rt.has("WEBGL_color_buffer_float")))&&!Vt){console.error("THREE.WebGLRenderer.readRenderTargetPixels: renderTarget is not in UnsignedByteType or implementation defined type.");return}k>=0&&k<=A.width-q&&j>=0&&j<=A.height-X&&G.readPixels(k,j,q,X,ot.convert(jt),ot.convert(zt),_t)}finally{const Ut=S!==null?Bt.get(S).__webglFramebuffer:null;yt.bindFramebuffer(G.FRAMEBUFFER,Ut)}}},this.copyFramebufferToTexture=function(A,k,j=0){const q=Math.pow(2,-j),X=Math.floor(k.image.width*q),_t=Math.floor(k.image.height*q);R.setTexture2D(k,0),G.copyTexSubImage2D(G.TEXTURE_2D,j,0,0,A.x,A.y,X,_t),yt.unbindTexture()},this.copyTextureToTexture=function(A,k,j,q=0){const X=k.image.width,_t=k.image.height,Ct=ot.convert(j.format),It=ot.convert(j.type);R.setTexture2D(j,0),G.pixelStorei(G.UNPACK_FLIP_Y_WEBGL,j.flipY),G.pixelStorei(G.UNPACK_PREMULTIPLY_ALPHA_WEBGL,j.premultiplyAlpha),G.pixelStorei(G.UNPACK_ALIGNMENT,j.unpackAlignment),k.isDataTexture?G.texSubImage2D(G.TEXTURE_2D,q,A.x,A.y,X,_t,Ct,It,k.image.data):k.isCompressedTexture?G.compressedTexSubImage2D(G.TEXTURE_2D,q,A.x,A.y,k.mipmaps[0].width,k.mipmaps[0].height,Ct,k.mipmaps[0].data):G.texSubImage2D(G.TEXTURE_2D,q,A.x,A.y,Ct,It,k.image),q===0&&j.generateMipmaps&&G.generateMipmap(G.TEXTURE_2D),yt.unbindTexture()},this.copyTextureToTexture3D=function(A,k,j,q,X=0){if(x.isWebGL1Renderer){console.warn("THREE.WebGLRenderer.copyTextureToTexture3D: can only be used with WebGL2.");return}const _t=A.max.x-A.min.x+1,Ct=A.max.y-A.min.y+1,It=A.max.z-A.min.z+1,Ut=ot.convert(q.format),jt=ot.convert(q.type);let zt;if(q.isData3DTexture)R.setTexture3D(q,0),zt=G.TEXTURE_3D;else if(q.isDataArrayTexture||q.isCompressedArrayTexture)R.setTexture2DArray(q,0),zt=G.TEXTURE_2D_ARRAY;else{console.warn("THREE.WebGLRenderer.copyTextureToTexture3D: only supports THREE.DataTexture3D and THREE.DataTexture2DArray.");return}G.pixelStorei(G.UNPACK_FLIP_Y_WEBGL,q.flipY),G.pixelStorei(G.UNPACK_PREMULTIPLY_ALPHA_WEBGL,q.premultiplyAlpha),G.pixelStorei(G.UNPACK_ALIGNMENT,q.unpackAlignment);const Vt=G.getParameter(G.UNPACK_ROW_LENGTH),Te=G.getParameter(G.UNPACK_IMAGE_HEIGHT),bn=G.getParameter(G.UNPACK_SKIP_PIXELS),He=G.getParameter(G.UNPACK_SKIP_ROWS),Mi=G.getParameter(G.UNPACK_SKIP_IMAGES),ve=j.isCompressedTexture?j.mipmaps[X]:j.image;G.pixelStorei(G.UNPACK_ROW_LENGTH,ve.width),G.pixelStorei(G.UNPACK_IMAGE_HEIGHT,ve.height),G.pixelStorei(G.UNPACK_SKIP_PIXELS,A.min.x),G.pixelStorei(G.UNPACK_SKIP_ROWS,A.min.y),G.pixelStorei(G.UNPACK_SKIP_IMAGES,A.min.z),j.isDataTexture||j.isData3DTexture?G.texSubImage3D(zt,X,k.x,k.y,k.z,_t,Ct,It,Ut,jt,ve.data):j.isCompressedArrayTexture?(console.warn("THREE.WebGLRenderer.copyTextureToTexture3D: untested support for compressed srcTexture."),G.compressedTexSubImage3D(zt,X,k.x,k.y,k.z,_t,Ct,It,Ut,ve.data)):G.texSubImage3D(zt,X,k.x,k.y,k.z,_t,Ct,It,Ut,jt,ve),G.pixelStorei(G.UNPACK_ROW_LENGTH,Vt),G.pixelStorei(G.UNPACK_IMAGE_HEIGHT,Te),G.pixelStorei(G.UNPACK_SKIP_PIXELS,bn),G.pixelStorei(G.UNPACK_SKIP_ROWS,He),G.pixelStorei(G.UNPACK_SKIP_IMAGES,Mi),X===0&&q.generateMipmaps&&G.generateMipmap(zt),yt.unbindTexture()},this.initTexture=function(A){A.isCubeTexture?R.setTextureCube(A,0):A.isData3DTexture?R.setTexture3D(A,0):A.isDataArrayTexture||A.isCompressedArrayTexture?R.setTexture2DArray(A,0):R.setTexture2D(A,0),yt.unbindTexture()},this.resetState=function(){b=0,E=0,S=null,yt.reset(),wt.reset()},typeof __THREE_DEVTOOLS__<"u"&&__THREE_DEVTOOLS__.dispatchEvent(new CustomEvent("observe",{detail:this}))}get coordinateSystem(){return ri}get outputColorSpace(){return this._outputColorSpace}set outputColorSpace(t){this._outputColorSpace=t;const e=this.getContext();e.drawingBufferColorSpace=t===sl?"display-p3":"srgb",e.unpackColorSpace=se.workingColorSpace===ao?"display-p3":"srgb"}get outputEncoding(){return console.warn("THREE.WebGLRenderer: Property .outputEncoding has been removed. Use .outputColorSpace instead."),this.outputColorSpace===Ve?Yi:Kh}set outputEncoding(t){console.warn("THREE.WebGLRenderer: Property .outputEncoding has been removed. Use .outputColorSpace instead."),this.outputColorSpace=t===Yi?Ve:si}get useLegacyLights(){return console.warn("THREE.WebGLRenderer: The property .useLegacyLights has been deprecated. Migrate your lighting according to the following guide: https://discourse.threejs.org/t/updates-to-lighting-in-three-js-r155/53733."),this._useLegacyLights}set useLegacyLights(t){console.warn("THREE.WebGLRenderer: The property .useLegacyLights has been deprecated. Migrate your lighting according to the following guide: https://discourse.threejs.org/t/updates-to-lighting-in-three-js-r155/53733."),this._useLegacyLights=t}}class zv extends sd{}zv.prototype.isWebGL1Renderer=!0;class Nl{constructor(t,e=1,i=1e3){this.isFog=!0,this.name="",this.color=new xt(t),this.near=e,this.far=i}clone(){return new Nl(this.color,this.near,this.far)}toJSON(){return{type:"Fog",name:this.name,color:this.color.getHex(),near:this.near,far:this.far}}}class Hv extends Fe{constructor(){super(),this.isScene=!0,this.type="Scene",this.background=null,this.environment=null,this.fog=null,this.backgroundBlurriness=0,this.backgroundIntensity=1,this.overrideMaterial=null,typeof __THREE_DEVTOOLS__<"u"&&__THREE_DEVTOOLS__.dispatchEvent(new CustomEvent("observe",{detail:this}))}copy(t,e){return super.copy(t,e),t.background!==null&&(this.background=t.background.clone()),t.environment!==null&&(this.environment=t.environment.clone()),t.fog!==null&&(this.fog=t.fog.clone()),this.backgroundBlurriness=t.backgroundBlurriness,this.backgroundIntensity=t.backgroundIntensity,t.overrideMaterial!==null&&(this.overrideMaterial=t.overrideMaterial.clone()),this.matrixAutoUpdate=t.matrixAutoUpdate,this}toJSON(t){const e=super.toJSON(t);return this.fog!==null&&(e.object.fog=this.fog.toJSON()),this.backgroundBlurriness>0&&(e.object.backgroundBlurriness=this.backgroundBlurriness),this.backgroundIntensity!==1&&(e.object.backgroundIntensity=this.backgroundIntensity),e}}class rd extends Tn{constructor(t,e,i,s=1){super(t,e,i),this.isInstancedBufferAttribute=!0,this.meshPerAttribute=s}copy(t){return super.copy(t),this.meshPerAttribute=t.meshPerAttribute,this}toJSON(){const t=super.toJSON();return t.meshPerAttribute=this.meshPerAttribute,t.isInstancedBufferAttribute=!0,t}}const qs=new ge,od=new ge,zo=[],ad=new $i,Vv=new ge,vr=new Kt,br=new Ls;class Gv extends Kt{constructor(t,e,i){super(t,e),this.isInstancedMesh=!0,this.instanceMatrix=new rd(new Float32Array(i*16),16),this.instanceColor=null,this.count=i,this.boundingBox=null,this.boundingSphere=null;for(let s=0;s<i;s++)this.setMatrixAt(s,Vv)}computeBoundingBox(){const t=this.geometry,e=this.count;this.boundingBox===null&&(this.boundingBox=new $i),t.boundingBox===null&&t.computeBoundingBox(),this.boundingBox.makeEmpty();for(let i=0;i<e;i++)this.getMatrixAt(i,qs),ad.copy(t.boundingBox).applyMatrix4(qs),this.boundingBox.union(ad)}computeBoundingSphere(){const t=this.geometry,e=this.count;this.boundingSphere===null&&(this.boundingSphere=new Ls),t.boundingSphere===null&&t.computeBoundingSphere(),this.boundingSphere.makeEmpty();for(let i=0;i<e;i++)this.getMatrixAt(i,qs),br.copy(t.boundingSphere).applyMatrix4(qs),this.boundingSphere.union(br)}copy(t,e){return super.copy(t,e),this.instanceMatrix.copy(t.instanceMatrix),t.instanceColor!==null&&(this.instanceColor=t.instanceColor.clone()),this.count=t.count,t.boundingBox!==null&&(this.boundingBox=t.boundingBox.clone()),t.boundingSphere!==null&&(this.boundingSphere=t.boundingSphere.clone()),this}getColorAt(t,e){e.fromArray(this.instanceColor.array,t*3)}getMatrixAt(t,e){e.fromArray(this.instanceMatrix.array,t*16)}raycast(t,e){const i=this.matrixWorld,s=this.count;if(vr.geometry=this.geometry,vr.material=this.material,vr.material!==void 0&&(this.boundingSphere===null&&this.computeBoundingSphere(),br.copy(this.boundingSphere),br.applyMatrix4(i),t.ray.intersectsSphere(br)!==!1))for(let r=0;r<s;r++){this.getMatrixAt(r,qs),od.multiplyMatrices(i,qs),vr.matrixWorld=od,vr.raycast(t,zo);for(let o=0,a=zo.length;o<a;o++){const l=zo[o];l.instanceId=r,l.object=this,e.push(l)}zo.length=0}}setColorAt(t,e){this.instanceColor===null&&(this.instanceColor=new rd(new Float32Array(this.instanceMatrix.count*3),3)),e.toArray(this.instanceColor.array,t*3)}setMatrixAt(t,e){e.toArray(this.instanceMatrix.array,t*16)}updateMorphTargets(){}dispose(){this.dispatchEvent({type:"dispose"})}}class $s extends Fs{constructor(t){super(),this.isLineBasicMaterial=!0,this.type="LineBasicMaterial",this.color=new xt(16777215),this.map=null,this.linewidth=1,this.linecap="round",this.linejoin="round",this.fog=!0,this.setValues(t)}copy(t){return super.copy(t),this.color.copy(t.color),this.map=t.map,this.linewidth=t.linewidth,this.linecap=t.linecap,this.linejoin=t.linejoin,this.fog=t.fog,this}}const ld=new L,cd=new L,hd=new ge,kl=new bo,Ho=new Ls;class ud extends Fe{constructor(t=new Ce,e=new $s){super(),this.isLine=!0,this.type="Line",this.geometry=t,this.material=e,this.updateMorphTargets()}copy(t,e){return super.copy(t,e),this.material=Array.isArray(t.material)?t.material.slice():t.material,this.geometry=t.geometry,this}computeLineDistances(){const t=this.geometry;if(t.index===null){const e=t.attributes.position,i=[0];for(let s=1,r=e.count;s<r;s++)ld.fromBufferAttribute(e,s-1),cd.fromBufferAttribute(e,s),i[s]=i[s-1],i[s]+=ld.distanceTo(cd);t.setAttribute("lineDistance",new re(i,1))}else console.warn("THREE.Line.computeLineDistances(): Computation only possible with non-indexed BufferGeometry.");return this}raycast(t,e){const i=this.geometry,s=this.matrixWorld,r=t.params.Line.threshold,o=i.drawRange;if(i.boundingSphere===null&&i.computeBoundingSphere(),Ho.copy(i.boundingSphere),Ho.applyMatrix4(s),Ho.radius+=r,t.ray.intersectsSphere(Ho)===!1)return;hd.copy(s).invert(),kl.copy(t.ray).applyMatrix4(hd);const a=r/((this.scale.x+this.scale.y+this.scale.z)/3),l=a*a,c=new L,h=new L,u=new L,d=new L,f=this.isLineSegments?2:1,g=i.index,m=i.attributes.position;if(g!==null){const p=Math.max(0,o.start),v=Math.min(g.count,o.start+o.count);for(let x=p,y=v-1;x<y;x+=f){const b=g.getX(x),E=g.getX(x+1);if(c.fromBufferAttribute(m,b),h.fromBufferAttribute(m,E),kl.distanceSqToSegment(c,h,d,u)>l)continue;d.applyMatrix4(this.matrixWorld);const C=t.ray.origin.distanceTo(d);C<t.near||C>t.far||e.push({distance:C,point:u.clone().applyMatrix4(this.matrixWorld),index:x,face:null,faceIndex:null,object:this})}}else{const p=Math.max(0,o.start),v=Math.min(m.count,o.start+o.count);for(let x=p,y=v-1;x<y;x+=f){if(c.fromBufferAttribute(m,x),h.fromBufferAttribute(m,x+1),kl.distanceSqToSegment(c,h,d,u)>l)continue;d.applyMatrix4(this.matrixWorld);const E=t.ray.origin.distanceTo(d);E<t.near||E>t.far||e.push({distance:E,point:u.clone().applyMatrix4(this.matrixWorld),index:x,face:null,faceIndex:null,object:this})}}}updateMorphTargets(){const e=this.geometry.morphAttributes,i=Object.keys(e);if(i.length>0){const s=e[i[0]];if(s!==void 0){this.morphTargetInfluences=[],this.morphTargetDictionary={};for(let r=0,o=s.length;r<o;r++){const a=s[r].name||String(r);this.morphTargetInfluences.push(0),this.morphTargetDictionary[a]=r}}}}}const dd=new L,fd=new L;class Vo extends ud{constructor(t,e){super(t,e),this.isLineSegments=!0,this.type="LineSegments"}computeLineDistances(){const t=this.geometry;if(t.index===null){const e=t.attributes.position,i=[];for(let s=0,r=e.count;s<r;s+=2)dd.fromBufferAttribute(e,s),fd.fromBufferAttribute(e,s+1),i[s]=s===0?0:i[s-1],i[s+1]=i[s]+dd.distanceTo(fd);t.setAttribute("lineDistance",new re(i,1))}else console.warn("THREE.LineSegments.computeLineDistances(): Computation only possible with non-indexed BufferGeometry.");return this}}class Wv extends ud{constructor(t,e){super(t,e),this.isLineLoop=!0,this.type="LineLoop"}}class Go extends Ce{constructor(t=1,e=32,i=0,s=Math.PI*2){super(),this.type="CircleGeometry",this.parameters={radius:t,segments:e,thetaStart:i,thetaLength:s},e=Math.max(3,e);const r=[],o=[],a=[],l=[],c=new L,h=new St;o.push(0,0,0),a.push(0,0,1),l.push(.5,.5);for(let u=0,d=3;u<=e;u++,d+=3){const f=i+u/e*s;c.x=t*Math.cos(f),c.y=t*Math.sin(f),o.push(c.x,c.y,c.z),a.push(0,0,1),h.x=(o[d]/t+1)/2,h.y=(o[d+1]/t+1)/2,l.push(h.x,h.y)}for(let u=1;u<=e;u++)r.push(u,u+1,0);this.setIndex(r),this.setAttribute("position",new re(o,3)),this.setAttribute("normal",new re(a,3)),this.setAttribute("uv",new re(l,2))}copy(t){return super.copy(t),this.parameters=Object.assign({},t.parameters),this}static fromJSON(t){return new Go(t.radius,t.segments,t.thetaStart,t.thetaLength)}}class Le extends Ce{constructor(t=1,e=1,i=1,s=32,r=1,o=!1,a=0,l=Math.PI*2){super(),this.type="CylinderGeometry",this.parameters={radiusTop:t,radiusBottom:e,height:i,radialSegments:s,heightSegments:r,openEnded:o,thetaStart:a,thetaLength:l};const c=this;s=Math.floor(s),r=Math.floor(r);const h=[],u=[],d=[],f=[];let g=0;const _=[],m=i/2;let p=0;v(),o===!1&&(t>0&&x(!0),e>0&&x(!1)),this.setIndex(h),this.setAttribute("position",new re(u,3)),this.setAttribute("normal",new re(d,3)),this.setAttribute("uv",new re(f,2));function v(){const y=new L,b=new L;let E=0;const S=(e-t)/i;for(let C=0;C<=r;C++){const M=[],w=C/r,U=w*(e-t)+t;for(let O=0;O<=s;O++){const Z=O/s,D=Z*l+a,F=Math.sin(D),V=Math.cos(D);b.x=U*F,b.y=-w*i+m,b.z=U*V,u.push(b.x,b.y,b.z),y.set(F,S,V).normalize(),d.push(y.x,y.y,y.z),f.push(Z,1-w),M.push(g++)}_.push(M)}for(let C=0;C<s;C++)for(let M=0;M<r;M++){const w=_[M][C],U=_[M+1][C],O=_[M+1][C+1],Z=_[M][C+1];h.push(w,U,Z),h.push(U,O,Z),E+=6}c.addGroup(p,E,0),p+=E}function x(y){const b=g,E=new St,S=new L;let C=0;const M=y===!0?t:e,w=y===!0?1:-1;for(let O=1;O<=s;O++)u.push(0,m*w,0),d.push(0,w,0),f.push(.5,.5),g++;const U=g;for(let O=0;O<=s;O++){const D=O/s*l+a,F=Math.cos(D),V=Math.sin(D);S.x=M*V,S.y=m*w,S.z=M*F,u.push(S.x,S.y,S.z),d.push(0,w,0),E.x=F*.5+.5,E.y=V*.5*w+.5,f.push(E.x,E.y),g++}for(let O=0;O<s;O++){const Z=b+O,D=U+O;y===!0?h.push(D,D+1,Z):h.push(D+1,D,Z),C+=3}c.addGroup(p,C,y===!0?1:2),p+=C}}copy(t){return super.copy(t),this.parameters=Object.assign({},t.parameters),this}static fromJSON(t){return new Le(t.radiusTop,t.radiusBottom,t.height,t.radialSegments,t.heightSegments,t.openEnded,t.thetaStart,t.thetaLength)}}class Mr extends Le{constructor(t=1,e=1,i=32,s=1,r=!1,o=0,a=Math.PI*2){super(0,t,e,i,s,r,o,a),this.type="ConeGeometry",this.parameters={radius:t,height:e,radialSegments:i,heightSegments:s,openEnded:r,thetaStart:o,thetaLength:a}}static fromJSON(t){return new Mr(t.radius,t.height,t.radialSegments,t.heightSegments,t.openEnded,t.thetaStart,t.thetaLength)}}const Wo=new L,Xo=new L,Bl=new L,jo=new En;class Xv extends Ce{constructor(t=null,e=1){if(super(),this.type="EdgesGeometry",this.parameters={geometry:t,thresholdAngle:e},t!==null){const s=Math.pow(10,4),r=Math.cos(lr*e),o=t.getIndex(),a=t.getAttribute("position"),l=o?o.count:a.count,c=[0,0,0],h=["a","b","c"],u=new Array(3),d={},f=[];for(let g=0;g<l;g+=3){o?(c[0]=o.getX(g),c[1]=o.getX(g+1),c[2]=o.getX(g+2)):(c[0]=g,c[1]=g+1,c[2]=g+2);const{a:_,b:m,c:p}=jo;if(_.fromBufferAttribute(a,c[0]),m.fromBufferAttribute(a,c[1]),p.fromBufferAttribute(a,c[2]),jo.getNormal(Bl),u[0]=`${Math.round(_.x*s)},${Math.round(_.y*s)},${Math.round(_.z*s)}`,u[1]=`${Math.round(m.x*s)},${Math.round(m.y*s)},${Math.round(m.z*s)}`,u[2]=`${Math.round(p.x*s)},${Math.round(p.y*s)},${Math.round(p.z*s)}`,!(u[0]===u[1]||u[1]===u[2]||u[2]===u[0]))for(let v=0;v<3;v++){const x=(v+1)%3,y=u[v],b=u[x],E=jo[h[v]],S=jo[h[x]],C=`${y}_${b}`,M=`${b}_${y}`;M in d&&d[M]?(Bl.dot(d[M].normal)<=r&&(f.push(E.x,E.y,E.z),f.push(S.x,S.y,S.z)),d[M]=null):C in d||(d[C]={index0:c[v],index1:c[x],normal:Bl.clone()})}}for(const g in d)if(d[g]){const{index0:_,index1:m}=d[g];Wo.fromBufferAttribute(a,_),Xo.fromBufferAttribute(a,m),f.push(Wo.x,Wo.y,Wo.z),f.push(Xo.x,Xo.y,Xo.z)}this.setAttribute("position",new re(f,3))}}copy(t){return super.copy(t),this.parameters=Object.assign({},t.parameters),this}}class Yo extends Ce{constructor(t=.5,e=1,i=32,s=1,r=0,o=Math.PI*2){super(),this.type="RingGeometry",this.parameters={innerRadius:t,outerRadius:e,thetaSegments:i,phiSegments:s,thetaStart:r,thetaLength:o},i=Math.max(3,i),s=Math.max(1,s);const a=[],l=[],c=[],h=[];let u=t;const d=(e-t)/s,f=new L,g=new St;for(let _=0;_<=s;_++){for(let m=0;m<=i;m++){const p=r+m/i*o;f.x=u*Math.cos(p),f.y=u*Math.sin(p),l.push(f.x,f.y,f.z),c.push(0,0,1),g.x=(f.x/e+1)/2,g.y=(f.y/e+1)/2,h.push(g.x,g.y)}u+=d}for(let _=0;_<s;_++){const m=_*(i+1);for(let p=0;p<i;p++){const v=p+m,x=v,y=v+i+1,b=v+i+2,E=v+1;a.push(x,y,E),a.push(y,b,E)}}this.setIndex(a),this.setAttribute("position",new re(l,3)),this.setAttribute("normal",new re(c,3)),this.setAttribute("uv",new re(h,2))}copy(t){return super.copy(t),this.parameters=Object.assign({},t.parameters),this}static fromJSON(t){return new Yo(t.innerRadius,t.outerRadius,t.thetaSegments,t.phiSegments,t.thetaStart,t.thetaLength)}}class Ii extends Ce{constructor(t=1,e=32,i=16,s=0,r=Math.PI*2,o=0,a=Math.PI){super(),this.type="SphereGeometry",this.parameters={radius:t,widthSegments:e,heightSegments:i,phiStart:s,phiLength:r,thetaStart:o,thetaLength:a},e=Math.max(3,Math.floor(e)),i=Math.max(2,Math.floor(i));const l=Math.min(o+a,Math.PI);let c=0;const h=[],u=new L,d=new L,f=[],g=[],_=[],m=[];for(let p=0;p<=i;p++){const v=[],x=p/i;let y=0;p===0&&o===0?y=.5/e:p===i&&l===Math.PI&&(y=-.5/e);for(let b=0;b<=e;b++){const E=b/e;u.x=-t*Math.cos(s+E*r)*Math.sin(o+x*a),u.y=t*Math.cos(o+x*a),u.z=t*Math.sin(s+E*r)*Math.sin(o+x*a),g.push(u.x,u.y,u.z),d.copy(u).normalize(),_.push(d.x,d.y,d.z),m.push(E+y,1-x),v.push(c++)}h.push(v)}for(let p=0;p<i;p++)for(let v=0;v<e;v++){const x=h[p][v+1],y=h[p][v],b=h[p+1][v],E=h[p+1][v+1];(p!==0||o>0)&&f.push(x,y,E),(p!==i-1||l<Math.PI)&&f.push(y,b,E)}this.setIndex(f),this.setAttribute("position",new re(g,3)),this.setAttribute("normal",new re(_,3)),this.setAttribute("uv",new re(m,2))}copy(t){return super.copy(t),this.parameters=Object.assign({},t.parameters),this}static fromJSON(t){return new Ii(t.radius,t.widthSegments,t.heightSegments,t.phiStart,t.phiLength,t.thetaStart,t.thetaLength)}}class zl extends Ce{constructor(t=1,e=.4,i=12,s=48,r=Math.PI*2){super(),this.type="TorusGeometry",this.parameters={radius:t,tube:e,radialSegments:i,tubularSegments:s,arc:r},i=Math.floor(i),s=Math.floor(s);const o=[],a=[],l=[],c=[],h=new L,u=new L,d=new L;for(let f=0;f<=i;f++)for(let g=0;g<=s;g++){const _=g/s*r,m=f/i*Math.PI*2;u.x=(t+e*Math.cos(m))*Math.cos(_),u.y=(t+e*Math.cos(m))*Math.sin(_),u.z=e*Math.sin(m),a.push(u.x,u.y,u.z),h.x=t*Math.cos(_),h.y=t*Math.sin(_),d.subVectors(u,h).normalize(),l.push(d.x,d.y,d.z),c.push(g/s),c.push(f/i)}for(let f=1;f<=i;f++)for(let g=1;g<=s;g++){const _=(s+1)*f+g-1,m=(s+1)*(f-1)+g-1,p=(s+1)*(f-1)+g,v=(s+1)*f+g;o.push(_,m,v),o.push(m,p,v)}this.setIndex(o),this.setAttribute("position",new re(a,3)),this.setAttribute("normal",new re(l,3)),this.setAttribute("uv",new re(c,2))}copy(t){return super.copy(t),this.parameters=Object.assign({},t.parameters),this}static fromJSON(t){return new zl(t.radius,t.tube,t.radialSegments,t.tubularSegments,t.arc)}}class jv extends an{constructor(t){super(t),this.isRawShaderMaterial=!0,this.type="RawShaderMaterial"}}class Ks extends Fs{constructor(t){super(),this.isMeshStandardMaterial=!0,this.defines={STANDARD:""},this.type="MeshStandardMaterial",this.color=new xt(16777215),this.roughness=1,this.metalness=0,this.map=null,this.lightMap=null,this.lightMapIntensity=1,this.aoMap=null,this.aoMapIntensity=1,this.emissive=new xt(0),this.emissiveIntensity=1,this.emissiveMap=null,this.bumpMap=null,this.bumpScale=1,this.normalMap=null,this.normalMapType=Zh,this.normalScale=new St(1,1),this.displacementMap=null,this.displacementScale=1,this.displacementBias=0,this.roughnessMap=null,this.metalnessMap=null,this.alphaMap=null,this.envMap=null,this.envMapIntensity=1,this.wireframe=!1,this.wireframeLinewidth=1,this.wireframeLinecap="round",this.wireframeLinejoin="round",this.flatShading=!1,this.fog=!0,this.setValues(t)}copy(t){return super.copy(t),this.defines={STANDARD:""},this.color.copy(t.color),this.roughness=t.roughness,this.metalness=t.metalness,this.map=t.map,this.lightMap=t.lightMap,this.lightMapIntensity=t.lightMapIntensity,this.aoMap=t.aoMap,this.aoMapIntensity=t.aoMapIntensity,this.emissive.copy(t.emissive),this.emissiveMap=t.emissiveMap,this.emissiveIntensity=t.emissiveIntensity,this.bumpMap=t.bumpMap,this.bumpScale=t.bumpScale,this.normalMap=t.normalMap,this.normalMapType=t.normalMapType,this.normalScale.copy(t.normalScale),this.displacementMap=t.displacementMap,this.displacementScale=t.displacementScale,this.displacementBias=t.displacementBias,this.roughnessMap=t.roughnessMap,this.metalnessMap=t.metalnessMap,this.alphaMap=t.alphaMap,this.envMap=t.envMap,this.envMapIntensity=t.envMapIntensity,this.wireframe=t.wireframe,this.wireframeLinewidth=t.wireframeLinewidth,this.wireframeLinecap=t.wireframeLinecap,this.wireframeLinejoin=t.wireframeLinejoin,this.flatShading=t.flatShading,this.fog=t.fog,this}}class pd extends Fe{constructor(t,e=1){super(),this.isLight=!0,this.type="Light",this.color=new xt(t),this.intensity=e}dispose(){}copy(t,e){return super.copy(t,e),this.color.copy(t.color),this.intensity=t.intensity,this}toJSON(t){const e=super.toJSON(t);return e.object.color=this.color.getHex(),e.object.intensity=this.intensity,this.groundColor!==void 0&&(e.object.groundColor=this.groundColor.getHex()),this.distance!==void 0&&(e.object.distance=this.distance),this.angle!==void 0&&(e.object.angle=this.angle),this.decay!==void 0&&(e.object.decay=this.decay),this.penumbra!==void 0&&(e.object.penumbra=this.penumbra),this.shadow!==void 0&&(e.object.shadow=this.shadow.toJSON()),e}}class Yv extends pd{constructor(t,e,i){super(t,i),this.isHemisphereLight=!0,this.type="HemisphereLight",this.position.copy(Fe.DEFAULT_UP),this.updateMatrix(),this.groundColor=new xt(e)}copy(t,e){return super.copy(t,e),this.groundColor.copy(t.groundColor),this}}const Hl=new ge,md=new L,gd=new L;class qv{constructor(t){this.camera=t,this.bias=0,this.normalBias=0,this.radius=1,this.blurSamples=8,this.mapSize=new St(512,512),this.map=null,this.mapPass=null,this.matrix=new ge,this.autoUpdate=!0,this.needsUpdate=!1,this._frustum=new Al,this._frameExtents=new St(1,1),this._viewportCount=1,this._viewports=[new Ue(0,0,1,1)]}getViewportCount(){return this._viewportCount}getFrustum(){return this._frustum}updateMatrices(t){const e=this.camera,i=this.matrix;md.setFromMatrixPosition(t.matrixWorld),e.position.copy(md),gd.setFromMatrixPosition(t.target.matrixWorld),e.lookAt(gd),e.updateMatrixWorld(),Hl.multiplyMatrices(e.projectionMatrix,e.matrixWorldInverse),this._frustum.setFromProjectionMatrix(Hl),i.set(.5,0,0,.5,0,.5,0,.5,0,0,.5,.5,0,0,0,1),i.multiply(Hl)}getViewport(t){return this._viewports[t]}getFrameExtents(){return this._frameExtents}dispose(){this.map&&this.map.dispose(),this.mapPass&&this.mapPass.dispose()}copy(t){return this.camera=t.camera.clone(),this.bias=t.bias,this.radius=t.radius,this.mapSize.copy(t.mapSize),this}clone(){return new this.constructor().copy(this)}toJSON(){const t={};return this.bias!==0&&(t.bias=this.bias),this.normalBias!==0&&(t.normalBias=this.normalBias),this.radius!==1&&(t.radius=this.radius),(this.mapSize.x!==512||this.mapSize.y!==512)&&(t.mapSize=this.mapSize.toArray()),t.camera=this.camera.toJSON(!1).object,delete t.camera.matrix,t}}class $v extends qv{constructor(){super(new Cl(-5,5,5,-5,.5,500)),this.isDirectionalLightShadow=!0}}class Kv extends pd{constructor(t,e){super(t,e),this.isDirectionalLight=!0,this.type="DirectionalLight",this.position.copy(Fe.DEFAULT_UP),this.updateMatrix(),this.target=new Fe,this.shadow=new $v}dispose(){this.shadow.dispose()}copy(t){return super.copy(t),this.target=t.target.clone(),this.shadow=t.shadow.clone(),this}}class Zv{constructor(t=!0){this.autoStart=t,this.startTime=0,this.oldTime=0,this.elapsedTime=0,this.running=!1}start(){this.startTime=_d(),this.oldTime=this.startTime,this.elapsedTime=0,this.running=!0}stop(){this.getElapsedTime(),this.running=!1,this.autoStart=!1}getElapsedTime(){return this.getDelta(),this.elapsedTime}getDelta(){let t=0;if(this.autoStart&&!this.running)return this.start(),0;if(this.running){const e=_d();t=(e-this.oldTime)/1e3,this.oldTime=e,this.elapsedTime+=t}return t}}function _d(){return(typeof performance>"u"?Date:performance).now()}class Jv{constructor(t,e,i=0,s=1/0){this.ray=new bo(t,e),this.near=i,this.far=s,this.camera=null,this.layers=new xl,this.params={Mesh:{},Line:{threshold:1},LOD:{},Points:{threshold:1},Sprite:{}}}set(t,e){this.ray.set(t,e)}setFromCamera(t,e){e.isPerspectiveCamera?(this.ray.origin.setFromMatrixPosition(e.matrixWorld),this.ray.direction.set(t.x,t.y,.5).unproject(e).sub(this.ray.origin).normalize(),this.camera=e):e.isOrthographicCamera?(this.ray.origin.set(t.x,t.y,(e.near+e.far)/(e.near-e.far)).unproject(e),this.ray.direction.set(0,0,-1).transformDirection(e.matrixWorld),this.camera=e):console.error("THREE.Raycaster: Unsupported camera type: "+e.type)}intersectObject(t,e=!0,i=[]){return Vl(t,this,i,e),i.sort(xd),i}intersectObjects(t,e=!0,i=[]){for(let s=0,r=t.length;s<r;s++)Vl(t[s],this,i,e);return i.sort(xd),i}}function xd(n,t){return n.distance-t.distance}function Vl(n,t,e,i){if(n.layers.test(t.layers)&&n.raycast(t,e),i===!0){const s=n.children;for(let r=0,o=s.length;r<o;r++)Vl(s[r],t,e,!0)}}class vd{constructor(t=1,e=0,i=0){return this.radius=t,this.phi=e,this.theta=i,this}set(t,e,i){return this.radius=t,this.phi=e,this.theta=i,this}copy(t){return this.radius=t.radius,this.phi=t.phi,this.theta=t.theta,this}makeSafe(){return this.phi=Math.max(1e-6,Math.min(Math.PI-1e-6,this.phi)),this}setFromVector3(t){return this.setFromCartesianCoords(t.x,t.y,t.z)}setFromCartesianCoords(t,e,i){return this.radius=Math.sqrt(t*t+e*e+i*i),this.radius===0?(this.theta=0,this.phi=0):(this.theta=Math.atan2(t,i),this.phi=Math.acos(Je(e/this.radius,-1,1))),this}clone(){return new this.constructor().copy(this)}}class Qv extends Vo{constructor(t=10,e=10,i=4473924,s=8947848){i=new xt(i),s=new xt(s);const r=e/2,o=t/e,a=t/2,l=[],c=[];for(let d=0,f=0,g=-a;d<=e;d++,g+=o){l.push(-a,0,g,a,0,g),l.push(g,0,-a,g,0,a);const _=d===r?i:s;_.toArray(c,f),f+=3,_.toArray(c,f),f+=3,_.toArray(c,f),f+=3,_.toArray(c,f),f+=3}const h=new Ce;h.setAttribute("position",new re(l,3)),h.setAttribute("color",new re(c,3));const u=new $s({vertexColors:!0,toneMapped:!1});super(h,u),this.type="GridHelper"}dispose(){this.geometry.dispose(),this.material.dispose()}}typeof __THREE_DEVTOOLS__<"u"&&__THREE_DEVTOOLS__.dispatchEvent(new CustomEvent("register",{detail:{revision:"160"}})),typeof window<"u"&&(window.__THREE__?console.warn("WARNING: Multiple instances of Three.js being imported."):window.__THREE__="160");const bd={type:"change"},Gl={type:"start"},Md={type:"end"},qo=new bo,yd=new Di,tb=Math.cos(70*mg.DEG2RAD);class eb extends qi{constructor(t,e){super(),this.object=t,this.domElement=e,this.domElement.style.touchAction="none",this.enabled=!0,this.target=new L,this.cursor=new L,this.minDistance=0,this.maxDistance=1/0,this.minZoom=0,this.maxZoom=1/0,this.minTargetRadius=0,this.maxTargetRadius=1/0,this.minPolarAngle=0,this.maxPolarAngle=Math.PI,this.minAzimuthAngle=-1/0,this.maxAzimuthAngle=1/0,this.enableDamping=!1,this.dampingFactor=.05,this.enableZoom=!0,this.zoomSpeed=1,this.enableRotate=!0,this.rotateSpeed=1,this.enablePan=!0,this.panSpeed=1,this.screenSpacePanning=!0,this.keyPanSpeed=7,this.zoomToCursor=!1,this.autoRotate=!1,this.autoRotateSpeed=2,this.keys={LEFT:"ArrowLeft",UP:"ArrowUp",RIGHT:"ArrowRight",BOTTOM:"ArrowDown"},this.mouseButtons={LEFT:nn.ROTATE,MIDDLE:nn.DOLLY,RIGHT:nn.PAN},this.touches={ONE:Ln.ROTATE,TWO:Ln.DOLLY_PAN},this.target0=this.target.clone(),this.position0=this.object.position.clone(),this.zoom0=this.object.zoom,this._domElementKeyEvents=null,this.getPolarAngle=function(){return a.phi},this.getAzimuthalAngle=function(){return a.theta},this.getDistance=function(){return this.object.position.distanceTo(this.target)},this.listenToKeyEvents=function(P){P.addEventListener("keydown",st),this._domElementKeyEvents=P},this.stopListenToKeyEvents=function(){this._domElementKeyEvents.removeEventListener("keydown",st),this._domElementKeyEvents=null},this.saveState=function(){i.target0.copy(i.target),i.position0.copy(i.object.position),i.zoom0=i.object.zoom},this.reset=function(){i.target.copy(i.target0),i.object.position.copy(i.position0),i.object.zoom=i.zoom0,i.object.updateProjectionMatrix(),i.dispatchEvent(bd),i.update(),r=s.NONE},this.update=(function(){const P=new L,tt=new Sn().setFromUnitVectors(t.up,new L(0,1,0)),dt=tt.clone().invert(),ot=new L,wt=new Sn,qt=new L,te=2*Math.PI;return function(ht=null){const I=i.object.position;P.copy(I).sub(i.target),P.applyQuaternion(tt),a.setFromVector3(P),i.autoRotate&&r===s.NONE&&U(M(ht)),i.enableDamping?(a.theta+=l.theta*i.dampingFactor,a.phi+=l.phi*i.dampingFactor):(a.theta+=l.theta,a.phi+=l.phi);let at=i.minAzimuthAngle,lt=i.maxAzimuthAngle;isFinite(at)&&isFinite(lt)&&(at<-Math.PI?at+=te:at>Math.PI&&(at-=te),lt<-Math.PI?lt+=te:lt>Math.PI&&(lt-=te),at<=lt?a.theta=Math.max(at,Math.min(lt,a.theta)):a.theta=a.theta>(at+lt)/2?Math.max(at,a.theta):Math.min(lt,a.theta)),a.phi=Math.max(i.minPolarAngle,Math.min(i.maxPolarAngle,a.phi)),a.makeSafe(),i.enableDamping===!0?i.target.addScaledVector(h,i.dampingFactor):i.target.add(h),i.target.sub(i.cursor),i.target.clampLength(i.minTargetRadius,i.maxTargetRadius),i.target.add(i.cursor),i.zoomToCursor&&E||i.object.isOrthographicCamera?a.radius=Y(a.radius):a.radius=Y(a.radius*c),P.setFromSpherical(a),P.applyQuaternion(dt),I.copy(i.target).add(P),i.object.lookAt(i.target),i.enableDamping===!0?(l.theta*=1-i.dampingFactor,l.phi*=1-i.dampingFactor,h.multiplyScalar(1-i.dampingFactor)):(l.set(0,0,0),h.set(0,0,0));let Pt=!1;if(i.zoomToCursor&&E){let At=null;if(i.object.isPerspectiveCamera){const ne=P.length();At=Y(ne*c);const ie=ne-At;i.object.position.addScaledVector(y,ie),i.object.updateMatrixWorld()}else if(i.object.isOrthographicCamera){const ne=new L(b.x,b.y,0);ne.unproject(i.object),i.object.zoom=Math.max(i.minZoom,Math.min(i.maxZoom,i.object.zoom/c)),i.object.updateProjectionMatrix(),Pt=!0;const ie=new L(b.x,b.y,0);ie.unproject(i.object),i.object.position.sub(ie).add(ne),i.object.updateMatrixWorld(),At=P.length()}else console.warn("WARNING: OrbitControls.js encountered an unknown camera type - zoom to cursor disabled."),i.zoomToCursor=!1;At!==null&&(this.screenSpacePanning?i.target.set(0,0,-1).transformDirection(i.object.matrix).multiplyScalar(At).add(i.object.position):(qo.origin.copy(i.object.position),qo.direction.set(0,0,-1).transformDirection(i.object.matrix),Math.abs(i.object.up.dot(qo.direction))<tb?t.lookAt(i.target):(yd.setFromNormalAndCoplanarPoint(i.object.up,i.target),qo.intersectPlane(yd,i.target))))}else i.object.isOrthographicCamera&&(i.object.zoom=Math.max(i.minZoom,Math.min(i.maxZoom,i.object.zoom/c)),i.object.updateProjectionMatrix(),Pt=!0);return c=1,E=!1,Pt||ot.distanceToSquared(i.object.position)>o||8*(1-wt.dot(i.object.quaternion))>o||qt.distanceToSquared(i.target)>0?(i.dispatchEvent(bd),ot.copy(i.object.position),wt.copy(i.object.quaternion),qt.copy(i.target),!0):!1}})(),this.dispose=function(){i.domElement.removeEventListener("contextmenu",bt),i.domElement.removeEventListener("pointerdown",Bt),i.domElement.removeEventListener("pointercancel",T),i.domElement.removeEventListener("wheel",it),i.domElement.removeEventListener("pointermove",R),i.domElement.removeEventListener("pointerup",T),i._domElementKeyEvents!==null&&(i._domElementKeyEvents.removeEventListener("keydown",st),i._domElementKeyEvents=null)};const i=this,s={NONE:-1,ROTATE:0,DOLLY:1,PAN:2,TOUCH_ROTATE:3,TOUCH_PAN:4,TOUCH_DOLLY_PAN:5,TOUCH_DOLLY_ROTATE:6};let r=s.NONE;const o=1e-6,a=new vd,l=new vd;let c=1;const h=new L,u=new St,d=new St,f=new St,g=new St,_=new St,m=new St,p=new St,v=new St,x=new St,y=new L,b=new St;let E=!1;const S=[],C={};function M(P){return P!==null?2*Math.PI/60*i.autoRotateSpeed*P:2*Math.PI/60/60*i.autoRotateSpeed}function w(P){const tt=Math.abs(P)/(100*(window.devicePixelRatio|0));return Math.pow(.95,i.zoomSpeed*tt)}function U(P){l.theta-=P}function O(P){l.phi-=P}const Z=(function(){const P=new L;return function(dt,ot){P.setFromMatrixColumn(ot,0),P.multiplyScalar(-dt),h.add(P)}})(),D=(function(){const P=new L;return function(dt,ot){i.screenSpacePanning===!0?P.setFromMatrixColumn(ot,1):(P.setFromMatrixColumn(ot,0),P.crossVectors(i.object.up,P)),P.multiplyScalar(dt),h.add(P)}})(),F=(function(){const P=new L;return function(dt,ot){const wt=i.domElement;if(i.object.isPerspectiveCamera){const qt=i.object.position;P.copy(qt).sub(i.target);let te=P.length();te*=Math.tan(i.object.fov/2*Math.PI/180),Z(2*dt*te/wt.clientHeight,i.object.matrix),D(2*ot*te/wt.clientHeight,i.object.matrix)}else i.object.isOrthographicCamera?(Z(dt*(i.object.right-i.object.left)/i.object.zoom/wt.clientWidth,i.object.matrix),D(ot*(i.object.top-i.object.bottom)/i.object.zoom/wt.clientHeight,i.object.matrix)):(console.warn("WARNING: OrbitControls.js encountered an unknown camera type - pan disabled."),i.enablePan=!1)}})();function V(P){i.object.isPerspectiveCamera||i.object.isOrthographicCamera?c/=P:(console.warn("WARNING: OrbitControls.js encountered an unknown camera type - dolly/zoom disabled."),i.enableZoom=!1)}function $(P){i.object.isPerspectiveCamera||i.object.isOrthographicCamera?c*=P:(console.warn("WARNING: OrbitControls.js encountered an unknown camera type - dolly/zoom disabled."),i.enableZoom=!1)}function K(P,tt){if(!i.zoomToCursor)return;E=!0;const dt=i.domElement.getBoundingClientRect(),ot=P-dt.left,wt=tt-dt.top,qt=dt.width,te=dt.height;b.x=ot/qt*2-1,b.y=-(wt/te)*2+1,y.set(b.x,b.y,1).unproject(i.object).sub(i.object.position).normalize()}function Y(P){return Math.max(i.minDistance,Math.min(i.maxDistance,P))}function Q(P){u.set(P.clientX,P.clientY)}function et(P){K(P.clientX,P.clientX),p.set(P.clientX,P.clientY)}function pt(P){g.set(P.clientX,P.clientY)}function B(P){d.set(P.clientX,P.clientY),f.subVectors(d,u).multiplyScalar(i.rotateSpeed);const tt=i.domElement;U(2*Math.PI*f.x/tt.clientHeight),O(2*Math.PI*f.y/tt.clientHeight),u.copy(d),i.update()}function J(P){v.set(P.clientX,P.clientY),x.subVectors(v,p),x.y>0?V(w(x.y)):x.y<0&&$(w(x.y)),p.copy(v),i.update()}function ct(P){_.set(P.clientX,P.clientY),m.subVectors(_,g).multiplyScalar(i.panSpeed),F(m.x,m.y),g.copy(_),i.update()}function vt(P){K(P.clientX,P.clientY),P.deltaY<0?$(w(P.deltaY)):P.deltaY>0&&V(w(P.deltaY)),i.update()}function Tt(P){let tt=!1;switch(P.code){case i.keys.UP:P.ctrlKey||P.metaKey||P.shiftKey?O(2*Math.PI*i.rotateSpeed/i.domElement.clientHeight):F(0,i.keyPanSpeed),tt=!0;break;case i.keys.BOTTOM:P.ctrlKey||P.metaKey||P.shiftKey?O(-2*Math.PI*i.rotateSpeed/i.domElement.clientHeight):F(0,-i.keyPanSpeed),tt=!0;break;case i.keys.LEFT:P.ctrlKey||P.metaKey||P.shiftKey?U(2*Math.PI*i.rotateSpeed/i.domElement.clientHeight):F(i.keyPanSpeed,0),tt=!0;break;case i.keys.RIGHT:P.ctrlKey||P.metaKey||P.shiftKey?U(-2*Math.PI*i.rotateSpeed/i.domElement.clientHeight):F(-i.keyPanSpeed,0),tt=!0;break}tt&&(P.preventDefault(),i.update())}function Ft(P){if(S.length===1)u.set(P.pageX,P.pageY);else{const tt=Qt(P),dt=.5*(P.pageX+tt.x),ot=.5*(P.pageY+tt.y);u.set(dt,ot)}}function Nt(P){if(S.length===1)g.set(P.pageX,P.pageY);else{const tt=Qt(P),dt=.5*(P.pageX+tt.x),ot=.5*(P.pageY+tt.y);g.set(dt,ot)}}function Lt(P){const tt=Qt(P),dt=P.pageX-tt.x,ot=P.pageY-tt.y,wt=Math.sqrt(dt*dt+ot*ot);p.set(0,wt)}function Jt(P){i.enableZoom&&Lt(P),i.enablePan&&Nt(P)}function G(P){i.enableZoom&&Lt(P),i.enableRotate&&Ft(P)}function Be(P){if(S.length==1)d.set(P.pageX,P.pageY);else{const dt=Qt(P),ot=.5*(P.pageX+dt.x),wt=.5*(P.pageY+dt.y);d.set(ot,wt)}f.subVectors(d,u).multiplyScalar(i.rotateSpeed);const tt=i.domElement;U(2*Math.PI*f.x/tt.clientHeight),O(2*Math.PI*f.y/tt.clientHeight),u.copy(d)}function Rt(P){if(S.length===1)_.set(P.pageX,P.pageY);else{const tt=Qt(P),dt=.5*(P.pageX+tt.x),ot=.5*(P.pageY+tt.y);_.set(dt,ot)}m.subVectors(_,g).multiplyScalar(i.panSpeed),F(m.x,m.y),g.copy(_)}function Ot(P){const tt=Qt(P),dt=P.pageX-tt.x,ot=P.pageY-tt.y,wt=Math.sqrt(dt*dt+ot*ot);v.set(0,wt),x.set(0,Math.pow(v.y/p.y,i.zoomSpeed)),V(x.y),p.copy(v);const qt=(P.pageX+tt.x)*.5,te=(P.pageY+tt.y)*.5;K(qt,te)}function yt(P){i.enableZoom&&Ot(P),i.enablePan&&Rt(P)}function me(P){i.enableZoom&&Ot(P),i.enableRotate&&Be(P)}function Bt(P){i.enabled!==!1&&(S.length===0&&(i.domElement.setPointerCapture(P.pointerId),i.domElement.addEventListener("pointermove",R),i.domElement.addEventListener("pointerup",T)),Dt(P),P.pointerType==="touch"?Et(P):W(P))}function R(P){i.enabled!==!1&&(P.pointerType==="touch"?gt(P):rt(P))}function T(P){Ht(P),S.length===0&&(i.domElement.releasePointerCapture(P.pointerId),i.domElement.removeEventListener("pointermove",R),i.domElement.removeEventListener("pointerup",T)),i.dispatchEvent(Md),r=s.NONE}function W(P){let tt;switch(P.button){case 0:tt=i.mouseButtons.LEFT;break;case 1:tt=i.mouseButtons.MIDDLE;break;case 2:tt=i.mouseButtons.RIGHT;break;default:tt=-1}switch(tt){case nn.DOLLY:if(i.enableZoom===!1)return;et(P),r=s.DOLLY;break;case nn.ROTATE:if(P.ctrlKey||P.metaKey||P.shiftKey){if(i.enablePan===!1)return;pt(P),r=s.PAN}else{if(i.enableRotate===!1)return;Q(P),r=s.ROTATE}break;case nn.PAN:if(P.ctrlKey||P.metaKey||P.shiftKey){if(i.enableRotate===!1)return;Q(P),r=s.ROTATE}else{if(i.enablePan===!1)return;pt(P),r=s.PAN}break;default:r=s.NONE}r!==s.NONE&&i.dispatchEvent(Gl)}function rt(P){switch(r){case s.ROTATE:if(i.enableRotate===!1)return;B(P);break;case s.DOLLY:if(i.enableZoom===!1)return;J(P);break;case s.PAN:if(i.enablePan===!1)return;ct(P);break}}function it(P){i.enabled===!1||i.enableZoom===!1||r!==s.NONE||(P.preventDefault(),i.dispatchEvent(Gl),vt(P),i.dispatchEvent(Md))}function st(P){i.enabled===!1||i.enablePan===!1||Tt(P)}function Et(P){switch(nt(P),S.length){case 1:switch(i.touches.ONE){case Ln.ROTATE:if(i.enableRotate===!1)return;Ft(P),r=s.TOUCH_ROTATE;break;case Ln.PAN:if(i.enablePan===!1)return;Nt(P),r=s.TOUCH_PAN;break;default:r=s.NONE}break;case 2:switch(i.touches.TWO){case Ln.DOLLY_PAN:if(i.enableZoom===!1&&i.enablePan===!1)return;Jt(P),r=s.TOUCH_DOLLY_PAN;break;case Ln.DOLLY_ROTATE:if(i.enableZoom===!1&&i.enableRotate===!1)return;G(P),r=s.TOUCH_DOLLY_ROTATE;break;default:r=s.NONE}break;default:r=s.NONE}r!==s.NONE&&i.dispatchEvent(Gl)}function gt(P){switch(nt(P),r){case s.TOUCH_ROTATE:if(i.enableRotate===!1)return;Be(P),i.update();break;case s.TOUCH_PAN:if(i.enablePan===!1)return;Rt(P),i.update();break;case s.TOUCH_DOLLY_PAN:if(i.enableZoom===!1&&i.enablePan===!1)return;yt(P),i.update();break;case s.TOUCH_DOLLY_ROTATE:if(i.enableZoom===!1&&i.enableRotate===!1)return;me(P),i.update();break;default:r=s.NONE}}function bt(P){i.enabled!==!1&&P.preventDefault()}function Dt(P){S.push(P.pointerId)}function Ht(P){delete C[P.pointerId];for(let tt=0;tt<S.length;tt++)if(S[tt]==P.pointerId){S.splice(tt,1);return}}function nt(P){let tt=C[P.pointerId];tt===void 0&&(tt=new St,C[P.pointerId]=tt),tt.set(P.pageX,P.pageY)}function Qt(P){const tt=P.pointerId===S[0]?S[1]:S[0];return C[tt]}i.domElement.addEventListener("contextmenu",bt),i.domElement.addEventListener("pointerdown",Bt),i.domElement.addEventListener("pointercancel",T),i.domElement.addEventListener("wheel",it,{passive:!1}),this.update()}}const Sd={name:"CopyShader",uniforms:{tDiffuse:{value:null},opacity:{value:1}},vertexShader:`

		varying vec2 vUv;

		void main() {

			vUv = uv;
			gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );

		}`,fragmentShader:`

		uniform float opacity;

		uniform sampler2D tDiffuse;

		varying vec2 vUv;

		void main() {

			vec4 texel = texture2D( tDiffuse, vUv );
			gl_FragColor = opacity * texel;


		}`};class Zs{constructor(){this.isPass=!0,this.enabled=!0,this.needsSwap=!0,this.clear=!1,this.renderToScreen=!1}setSize(){}render(){console.error("THREE.Pass: .render() must be implemented in derived pass.")}dispose(){}}const nb=new Cl(-1,1,1,-1,0,1);class ib extends Ce{constructor(){super(),this.setAttribute("position",new re([-1,3,0,-1,-1,0,3,-1,0],3)),this.setAttribute("uv",new re([0,2,0,0,2,0],2))}}const sb=new ib;class Wl{constructor(t){this._mesh=new Kt(sb,t)}dispose(){this._mesh.geometry.dispose()}render(t){t.render(this._mesh,nb)}get material(){return this._mesh.material}set material(t){this._mesh.material=t}}class rb extends Zs{constructor(t,e){super(),this.textureID=e!==void 0?e:"tDiffuse",t instanceof an?(this.uniforms=t.uniforms,this.material=t):t&&(this.uniforms=gr.clone(t.uniforms),this.material=new an({name:t.name!==void 0?t.name:"unspecified",defines:Object.assign({},t.defines),uniforms:this.uniforms,vertexShader:t.vertexShader,fragmentShader:t.fragmentShader})),this.fsQuad=new Wl(this.material)}render(t,e,i){this.uniforms[this.textureID]&&(this.uniforms[this.textureID].value=i.texture),this.fsQuad.material=this.material,this.renderToScreen?(t.setRenderTarget(null),this.fsQuad.render(t)):(t.setRenderTarget(e),this.clear&&t.clear(t.autoClearColor,t.autoClearDepth,t.autoClearStencil),this.fsQuad.render(t))}dispose(){this.material.dispose(),this.fsQuad.dispose()}}class Ed extends Zs{constructor(t,e){super(),this.scene=t,this.camera=e,this.clear=!0,this.needsSwap=!1,this.inverse=!1}render(t,e,i){const s=t.getContext(),r=t.state;r.buffers.color.setMask(!1),r.buffers.depth.setMask(!1),r.buffers.color.setLocked(!0),r.buffers.depth.setLocked(!0);let o,a;this.inverse?(o=0,a=1):(o=1,a=0),r.buffers.stencil.setTest(!0),r.buffers.stencil.setOp(s.REPLACE,s.REPLACE,s.REPLACE),r.buffers.stencil.setFunc(s.ALWAYS,o,4294967295),r.buffers.stencil.setClear(a),r.buffers.stencil.setLocked(!0),t.setRenderTarget(i),this.clear&&t.clear(),t.render(this.scene,this.camera),t.setRenderTarget(e),this.clear&&t.clear(),t.render(this.scene,this.camera),r.buffers.color.setLocked(!1),r.buffers.depth.setLocked(!1),r.buffers.color.setMask(!0),r.buffers.depth.setMask(!0),r.buffers.stencil.setLocked(!1),r.buffers.stencil.setFunc(s.EQUAL,1,4294967295),r.buffers.stencil.setOp(s.KEEP,s.KEEP,s.KEEP),r.buffers.stencil.setLocked(!0)}}class ob extends Zs{constructor(){super(),this.needsSwap=!1}render(t){t.state.buffers.stencil.setLocked(!1),t.state.buffers.stencil.setTest(!1)}}class ab{constructor(t,e){if(this.renderer=t,this._pixelRatio=t.getPixelRatio(),e===void 0){const i=t.getSize(new St);this._width=i.width,this._height=i.height,e=new On(this._width*this._pixelRatio,this._height*this._pixelRatio,{type:ii}),e.texture.name="EffectComposer.rt1"}else this._width=e.width,this._height=e.height;this.renderTarget1=e,this.renderTarget2=e.clone(),this.renderTarget2.texture.name="EffectComposer.rt2",this.writeBuffer=this.renderTarget1,this.readBuffer=this.renderTarget2,this.renderToScreen=!0,this.passes=[],this.copyPass=new rb(Sd),this.copyPass.material.blending=ni,this.clock=new Zv}swapBuffers(){const t=this.readBuffer;this.readBuffer=this.writeBuffer,this.writeBuffer=t}addPass(t){this.passes.push(t),t.setSize(this._width*this._pixelRatio,this._height*this._pixelRatio)}insertPass(t,e){this.passes.splice(e,0,t),t.setSize(this._width*this._pixelRatio,this._height*this._pixelRatio)}removePass(t){const e=this.passes.indexOf(t);e!==-1&&this.passes.splice(e,1)}isLastEnabledPass(t){for(let e=t+1;e<this.passes.length;e++)if(this.passes[e].enabled)return!1;return!0}render(t){t===void 0&&(t=this.clock.getDelta());const e=this.renderer.getRenderTarget();let i=!1;for(let s=0,r=this.passes.length;s<r;s++){const o=this.passes[s];if(o.enabled!==!1){if(o.renderToScreen=this.renderToScreen&&this.isLastEnabledPass(s),o.render(this.renderer,this.writeBuffer,this.readBuffer,t,i),o.needsSwap){if(i){const a=this.renderer.getContext(),l=this.renderer.state.buffers.stencil;l.setFunc(a.NOTEQUAL,1,4294967295),this.copyPass.render(this.renderer,this.writeBuffer,this.readBuffer,t),l.setFunc(a.EQUAL,1,4294967295)}this.swapBuffers()}Ed!==void 0&&(o instanceof Ed?i=!0:o instanceof ob&&(i=!1))}}this.renderer.setRenderTarget(e)}reset(t){if(t===void 0){const e=this.renderer.getSize(new St);this._pixelRatio=this.renderer.getPixelRatio(),this._width=e.width,this._height=e.height,t=this.renderTarget1.clone(),t.setSize(this._width*this._pixelRatio,this._height*this._pixelRatio)}this.renderTarget1.dispose(),this.renderTarget2.dispose(),this.renderTarget1=t,this.renderTarget2=t.clone(),this.writeBuffer=this.renderTarget1,this.readBuffer=this.renderTarget2}setSize(t,e){this._width=t,this._height=e;const i=this._width*this._pixelRatio,s=this._height*this._pixelRatio;this.renderTarget1.setSize(i,s),this.renderTarget2.setSize(i,s);for(let r=0;r<this.passes.length;r++)this.passes[r].setSize(i,s)}setPixelRatio(t){this._pixelRatio=t,this.setSize(this._width,this._height)}dispose(){this.renderTarget1.dispose(),this.renderTarget2.dispose(),this.copyPass.dispose()}}class lb extends Zs{constructor(t,e,i=null,s=null,r=null){super(),this.scene=t,this.camera=e,this.overrideMaterial=i,this.clearColor=s,this.clearAlpha=r,this.clear=!0,this.clearDepth=!1,this.needsSwap=!1,this._oldClearColor=new xt}render(t,e,i){const s=t.autoClear;t.autoClear=!1;let r,o;this.overrideMaterial!==null&&(o=this.scene.overrideMaterial,this.scene.overrideMaterial=this.overrideMaterial),this.clearColor!==null&&(t.getClearColor(this._oldClearColor),t.setClearColor(this.clearColor)),this.clearAlpha!==null&&(r=t.getClearAlpha(),t.setClearAlpha(this.clearAlpha)),this.clearDepth==!0&&t.clearDepth(),t.setRenderTarget(this.renderToScreen?null:i),this.clear===!0&&t.clear(t.autoClearColor,t.autoClearDepth,t.autoClearStencil),t.render(this.scene,this.camera),this.clearColor!==null&&t.setClearColor(this._oldClearColor),this.clearAlpha!==null&&t.setClearAlpha(r),this.overrideMaterial!==null&&(this.scene.overrideMaterial=o),t.autoClear=s}}const cb={uniforms:{tDiffuse:{value:null},luminosityThreshold:{value:1},smoothWidth:{value:1},defaultColor:{value:new xt(0)},defaultOpacity:{value:0}},vertexShader:`

		varying vec2 vUv;

		void main() {

			vUv = uv;

			gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );

		}`,fragmentShader:`

		uniform sampler2D tDiffuse;
		uniform vec3 defaultColor;
		uniform float defaultOpacity;
		uniform float luminosityThreshold;
		uniform float smoothWidth;

		varying vec2 vUv;

		void main() {

			vec4 texel = texture2D( tDiffuse, vUv );

			vec3 luma = vec3( 0.299, 0.587, 0.114 );

			float v = dot( texel.xyz, luma );

			vec4 outputColor = vec4( defaultColor.rgb, defaultOpacity );

			float alpha = smoothstep( luminosityThreshold, luminosityThreshold + smoothWidth, v );

			gl_FragColor = mix( outputColor, texel, alpha );

		}`};class Js extends Zs{constructor(t,e,i,s){super(),this.strength=e!==void 0?e:1,this.radius=i,this.threshold=s,this.resolution=t!==void 0?new St(t.x,t.y):new St(256,256),this.clearColor=new xt(0,0,0),this.renderTargetsHorizontal=[],this.renderTargetsVertical=[],this.nMips=5;let r=Math.round(this.resolution.x/2),o=Math.round(this.resolution.y/2);this.renderTargetBright=new On(r,o,{type:ii}),this.renderTargetBright.texture.name="UnrealBloomPass.bright",this.renderTargetBright.texture.generateMipmaps=!1;for(let u=0;u<this.nMips;u++){const d=new On(r,o,{type:ii});d.texture.name="UnrealBloomPass.h"+u,d.texture.generateMipmaps=!1,this.renderTargetsHorizontal.push(d);const f=new On(r,o,{type:ii});f.texture.name="UnrealBloomPass.v"+u,f.texture.generateMipmaps=!1,this.renderTargetsVertical.push(f),r=Math.round(r/2),o=Math.round(o/2)}const a=cb;this.highPassUniforms=gr.clone(a.uniforms),this.highPassUniforms.luminosityThreshold.value=s,this.highPassUniforms.smoothWidth.value=.01,this.materialHighPassFilter=new an({uniforms:this.highPassUniforms,vertexShader:a.vertexShader,fragmentShader:a.fragmentShader}),this.separableBlurMaterials=[];const l=[3,5,7,9,11];r=Math.round(this.resolution.x/2),o=Math.round(this.resolution.y/2);for(let u=0;u<this.nMips;u++)this.separableBlurMaterials.push(this.getSeperableBlurMaterial(l[u])),this.separableBlurMaterials[u].uniforms.invSize.value=new St(1/r,1/o),r=Math.round(r/2),o=Math.round(o/2);this.compositeMaterial=this.getCompositeMaterial(this.nMips),this.compositeMaterial.uniforms.blurTexture1.value=this.renderTargetsVertical[0].texture,this.compositeMaterial.uniforms.blurTexture2.value=this.renderTargetsVertical[1].texture,this.compositeMaterial.uniforms.blurTexture3.value=this.renderTargetsVertical[2].texture,this.compositeMaterial.uniforms.blurTexture4.value=this.renderTargetsVertical[3].texture,this.compositeMaterial.uniforms.blurTexture5.value=this.renderTargetsVertical[4].texture,this.compositeMaterial.uniforms.bloomStrength.value=e,this.compositeMaterial.uniforms.bloomRadius.value=.1;const c=[1,.8,.6,.4,.2];this.compositeMaterial.uniforms.bloomFactors.value=c,this.bloomTintColors=[new L(1,1,1),new L(1,1,1),new L(1,1,1),new L(1,1,1),new L(1,1,1)],this.compositeMaterial.uniforms.bloomTintColors.value=this.bloomTintColors;const h=Sd;this.copyUniforms=gr.clone(h.uniforms),this.blendMaterial=new an({uniforms:this.copyUniforms,vertexShader:h.vertexShader,fragmentShader:h.fragmentShader,blending:Ga,depthTest:!1,depthWrite:!1,transparent:!0}),this.enabled=!0,this.needsSwap=!1,this._oldClearColor=new xt,this.oldClearAlpha=1,this.basic=new on,this.fsQuad=new Wl(null)}dispose(){for(let t=0;t<this.renderTargetsHorizontal.length;t++)this.renderTargetsHorizontal[t].dispose();for(let t=0;t<this.renderTargetsVertical.length;t++)this.renderTargetsVertical[t].dispose();this.renderTargetBright.dispose();for(let t=0;t<this.separableBlurMaterials.length;t++)this.separableBlurMaterials[t].dispose();this.compositeMaterial.dispose(),this.blendMaterial.dispose(),this.basic.dispose(),this.fsQuad.dispose()}setSize(t,e){let i=Math.round(t/2),s=Math.round(e/2);this.renderTargetBright.setSize(i,s);for(let r=0;r<this.nMips;r++)this.renderTargetsHorizontal[r].setSize(i,s),this.renderTargetsVertical[r].setSize(i,s),this.separableBlurMaterials[r].uniforms.invSize.value=new St(1/i,1/s),i=Math.round(i/2),s=Math.round(s/2)}render(t,e,i,s,r){t.getClearColor(this._oldClearColor),this.oldClearAlpha=t.getClearAlpha();const o=t.autoClear;t.autoClear=!1,t.setClearColor(this.clearColor,0),r&&t.state.buffers.stencil.setTest(!1),this.renderToScreen&&(this.fsQuad.material=this.basic,this.basic.map=i.texture,t.setRenderTarget(null),t.clear(),this.fsQuad.render(t)),this.highPassUniforms.tDiffuse.value=i.texture,this.highPassUniforms.luminosityThreshold.value=this.threshold,this.fsQuad.material=this.materialHighPassFilter,t.setRenderTarget(this.renderTargetBright),t.clear(),this.fsQuad.render(t);let a=this.renderTargetBright;for(let l=0;l<this.nMips;l++)this.fsQuad.material=this.separableBlurMaterials[l],this.separableBlurMaterials[l].uniforms.colorTexture.value=a.texture,this.separableBlurMaterials[l].uniforms.direction.value=Js.BlurDirectionX,t.setRenderTarget(this.renderTargetsHorizontal[l]),t.clear(),this.fsQuad.render(t),this.separableBlurMaterials[l].uniforms.colorTexture.value=this.renderTargetsHorizontal[l].texture,this.separableBlurMaterials[l].uniforms.direction.value=Js.BlurDirectionY,t.setRenderTarget(this.renderTargetsVertical[l]),t.clear(),this.fsQuad.render(t),a=this.renderTargetsVertical[l];this.fsQuad.material=this.compositeMaterial,this.compositeMaterial.uniforms.bloomStrength.value=this.strength,this.compositeMaterial.uniforms.bloomRadius.value=this.radius,this.compositeMaterial.uniforms.bloomTintColors.value=this.bloomTintColors,t.setRenderTarget(this.renderTargetsHorizontal[0]),t.clear(),this.fsQuad.render(t),this.fsQuad.material=this.blendMaterial,this.copyUniforms.tDiffuse.value=this.renderTargetsHorizontal[0].texture,r&&t.state.buffers.stencil.setTest(!0),this.renderToScreen?(t.setRenderTarget(null),this.fsQuad.render(t)):(t.setRenderTarget(i),this.fsQuad.render(t)),t.setClearColor(this._oldClearColor,this.oldClearAlpha),t.autoClear=o}getSeperableBlurMaterial(t){const e=[];for(let i=0;i<t;i++)e.push(.39894*Math.exp(-.5*i*i/(t*t))/t);return new an({defines:{KERNEL_RADIUS:t},uniforms:{colorTexture:{value:null},invSize:{value:new St(.5,.5)},direction:{value:new St(.5,.5)},gaussianCoefficients:{value:e}},vertexShader:`varying vec2 vUv;
				void main() {
					vUv = uv;
					gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );
				}`,fragmentShader:`#include <common>
				varying vec2 vUv;
				uniform sampler2D colorTexture;
				uniform vec2 invSize;
				uniform vec2 direction;
				uniform float gaussianCoefficients[KERNEL_RADIUS];

				void main() {
					float weightSum = gaussianCoefficients[0];
					vec3 diffuseSum = texture2D( colorTexture, vUv ).rgb * weightSum;
					for( int i = 1; i < KERNEL_RADIUS; i ++ ) {
						float x = float(i);
						float w = gaussianCoefficients[i];
						vec2 uvOffset = direction * invSize * x;
						vec3 sample1 = texture2D( colorTexture, vUv + uvOffset ).rgb;
						vec3 sample2 = texture2D( colorTexture, vUv - uvOffset ).rgb;
						diffuseSum += (sample1 + sample2) * w;
						weightSum += 2.0 * w;
					}
					gl_FragColor = vec4(diffuseSum/weightSum, 1.0);
				}`})}getCompositeMaterial(t){return new an({defines:{NUM_MIPS:t},uniforms:{blurTexture1:{value:null},blurTexture2:{value:null},blurTexture3:{value:null},blurTexture4:{value:null},blurTexture5:{value:null},bloomStrength:{value:1},bloomFactors:{value:null},bloomTintColors:{value:null},bloomRadius:{value:0}},vertexShader:`varying vec2 vUv;
				void main() {
					vUv = uv;
					gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );
				}`,fragmentShader:`varying vec2 vUv;
				uniform sampler2D blurTexture1;
				uniform sampler2D blurTexture2;
				uniform sampler2D blurTexture3;
				uniform sampler2D blurTexture4;
				uniform sampler2D blurTexture5;
				uniform float bloomStrength;
				uniform float bloomRadius;
				uniform float bloomFactors[NUM_MIPS];
				uniform vec3 bloomTintColors[NUM_MIPS];

				float lerpBloomFactor(const in float factor) {
					float mirrorFactor = 1.2 - factor;
					return mix(factor, mirrorFactor, bloomRadius);
				}

				void main() {
					gl_FragColor = bloomStrength * ( lerpBloomFactor(bloomFactors[0]) * vec4(bloomTintColors[0], 1.0) * texture2D(blurTexture1, vUv) +
						lerpBloomFactor(bloomFactors[1]) * vec4(bloomTintColors[1], 1.0) * texture2D(blurTexture2, vUv) +
						lerpBloomFactor(bloomFactors[2]) * vec4(bloomTintColors[2], 1.0) * texture2D(blurTexture3, vUv) +
						lerpBloomFactor(bloomFactors[3]) * vec4(bloomTintColors[3], 1.0) * texture2D(blurTexture4, vUv) +
						lerpBloomFactor(bloomFactors[4]) * vec4(bloomTintColors[4], 1.0) * texture2D(blurTexture5, vUv) );
				}`})}}Js.BlurDirectionX=new St(1,0),Js.BlurDirectionY=new St(0,1);const hb={name:"OutputShader",uniforms:{tDiffuse:{value:null},toneMappingExposure:{value:1}},vertexShader:`
		precision highp float;

		uniform mat4 modelViewMatrix;
		uniform mat4 projectionMatrix;

		attribute vec3 position;
		attribute vec2 uv;

		varying vec2 vUv;

		void main() {

			vUv = uv;
			gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );

		}`,fragmentShader:`
	
		precision highp float;

		uniform sampler2D tDiffuse;

		#include <tonemapping_pars_fragment>
		#include <colorspace_pars_fragment>

		varying vec2 vUv;

		void main() {

			gl_FragColor = texture2D( tDiffuse, vUv );

			// tone mapping

			#ifdef LINEAR_TONE_MAPPING

				gl_FragColor.rgb = LinearToneMapping( gl_FragColor.rgb );

			#elif defined( REINHARD_TONE_MAPPING )

				gl_FragColor.rgb = ReinhardToneMapping( gl_FragColor.rgb );

			#elif defined( CINEON_TONE_MAPPING )

				gl_FragColor.rgb = OptimizedCineonToneMapping( gl_FragColor.rgb );

			#elif defined( ACES_FILMIC_TONE_MAPPING )

				gl_FragColor.rgb = ACESFilmicToneMapping( gl_FragColor.rgb );

			#elif defined( AGX_TONE_MAPPING )

				gl_FragColor.rgb = AgXToneMapping( gl_FragColor.rgb );

			#endif

			// color space

			#ifdef SRGB_TRANSFER

				gl_FragColor = sRGBTransferOETF( gl_FragColor );

			#endif

		}`};class ub extends Zs{constructor(){super();const t=hb;this.uniforms=gr.clone(t.uniforms),this.material=new jv({name:t.name,uniforms:this.uniforms,vertexShader:t.vertexShader,fragmentShader:t.fragmentShader}),this.fsQuad=new Wl(this.material),this._outputColorSpace=null,this._toneMapping=null}render(t,e,i){this.uniforms.tDiffuse.value=i.texture,this.uniforms.toneMappingExposure.value=t.toneMappingExposure,(this._outputColorSpace!==t.outputColorSpace||this._toneMapping!==t.toneMapping)&&(this._outputColorSpace=t.outputColorSpace,this._toneMapping=t.toneMapping,this.material.defines={},se.getTransfer(this._outputColorSpace)===he&&(this.material.defines.SRGB_TRANSFER=""),this._toneMapping===dh?this.material.defines.LINEAR_TONE_MAPPING="":this._toneMapping===fh?this.material.defines.REINHARD_TONE_MAPPING="":this._toneMapping===ph?this.material.defines.CINEON_TONE_MAPPING="":this._toneMapping===ja?this.material.defines.ACES_FILMIC_TONE_MAPPING="":this._toneMapping===mh&&(this.material.defines.AGX_TONE_MAPPING=""),this.material.needsUpdate=!0),this.renderToScreen===!0?(t.setRenderTarget(null),this.fsQuad.render(t)):(t.setRenderTarget(e),this.clear&&t.clear(t.autoClearColor,t.autoClearDepth,t.autoClearStencil),this.fsQuad.render(t))}dispose(){this.material.dispose(),this.fsQuad.dispose()}}function Gn(n,t=!1){const e=n[0].index!==null,i=new Set(Object.keys(n[0].attributes)),s=new Set(Object.keys(n[0].morphAttributes)),r={},o={},a=n[0].morphTargetsRelative,l=new Ce;let c=0;for(let h=0;h<n.length;++h){const u=n[h];let d=0;if(e!==(u.index!==null))return console.error("THREE.BufferGeometryUtils: .mergeGeometries() failed with geometry at index "+h+". All geometries must have compatible attributes; make sure index attribute exists among all geometries, or in none of them."),null;for(const f in u.attributes){if(!i.has(f))return console.error("THREE.BufferGeometryUtils: .mergeGeometries() failed with geometry at index "+h+'. All geometries must have compatible attributes; make sure "'+f+'" attribute exists among all geometries, or in none of them.'),null;r[f]===void 0&&(r[f]=[]),r[f].push(u.attributes[f]),d++}if(d!==i.size)return console.error("THREE.BufferGeometryUtils: .mergeGeometries() failed with geometry at index "+h+". Make sure all geometries have the same number of attributes."),null;if(a!==u.morphTargetsRelative)return console.error("THREE.BufferGeometryUtils: .mergeGeometries() failed with geometry at index "+h+". .morphTargetsRelative must be consistent throughout all geometries."),null;for(const f in u.morphAttributes){if(!s.has(f))return console.error("THREE.BufferGeometryUtils: .mergeGeometries() failed with geometry at index "+h+".  .morphAttributes must be consistent throughout all geometries."),null;o[f]===void 0&&(o[f]=[]),o[f].push(u.morphAttributes[f])}if(t){let f;if(e)f=u.index.count;else if(u.attributes.position!==void 0)f=u.attributes.position.count;else return console.error("THREE.BufferGeometryUtils: .mergeGeometries() failed with geometry at index "+h+". The geometry must have either an index or a position attribute"),null;l.addGroup(c,f,h),c+=f}}if(e){let h=0;const u=[];for(let d=0;d<n.length;++d){const f=n[d].index;for(let g=0;g<f.count;++g)u.push(f.getX(g)+h);h+=n[d].attributes.position.count}l.setIndex(u)}for(const h in r){const u=Td(r[h]);if(!u)return console.error("THREE.BufferGeometryUtils: .mergeGeometries() failed while trying to merge the "+h+" attribute."),null;l.setAttribute(h,u)}for(const h in o){const u=o[h][0].length;if(u===0)break;l.morphAttributes=l.morphAttributes||{},l.morphAttributes[h]=[];for(let d=0;d<u;++d){const f=[];for(let _=0;_<o[h].length;++_)f.push(o[h][_][d]);const g=Td(f);if(!g)return console.error("THREE.BufferGeometryUtils: .mergeGeometries() failed while trying to merge the "+h+" morphAttribute."),null;l.morphAttributes[h].push(g)}}return l}function Td(n){let t,e,i,s=-1,r=0;for(let c=0;c<n.length;++c){const h=n[c];if(h.isInterleavedBufferAttribute)return console.error("THREE.BufferGeometryUtils: .mergeAttributes() failed. InterleavedBufferAttributes are not supported."),null;if(t===void 0&&(t=h.array.constructor),t!==h.array.constructor)return console.error("THREE.BufferGeometryUtils: .mergeAttributes() failed. BufferAttribute.array must be of consistent array types across matching attributes."),null;if(e===void 0&&(e=h.itemSize),e!==h.itemSize)return console.error("THREE.BufferGeometryUtils: .mergeAttributes() failed. BufferAttribute.itemSize must be consistent across matching attributes."),null;if(i===void 0&&(i=h.normalized),i!==h.normalized)return console.error("THREE.BufferGeometryUtils: .mergeAttributes() failed. BufferAttribute.normalized must be consistent across matching attributes."),null;if(s===-1&&(s=h.gpuType),s!==h.gpuType)return console.error("THREE.BufferGeometryUtils: .mergeAttributes() failed. BufferAttribute.gpuType must be consistent across matching attributes."),null;r+=h.array.length}const o=new t(r);let a=0;for(let c=0;c<n.length;++c)o.set(n[c].array,a),a+=n[c].array.length;const l=new Tn(o,e,i);return s!==void 0&&(l.gpuType=s),l}/*!
 * @kurkle/color v0.3.4
 * https://github.com/kurkle/color#readme
 * (c) 2024 Jukka Kurkela
 * Released under the MIT License
 */function yr(n){return n+.5|0}const Oi=(n,t,e)=>Math.max(Math.min(n,e),t);function Sr(n){return Oi(yr(n*2.55),0,255)}function Ui(n){return Oi(yr(n*255),0,255)}function ui(n){return Oi(yr(n/2.55)/100,0,1)}function wd(n){return Oi(yr(n*100),0,100)}const Cn={0:0,1:1,2:2,3:3,4:4,5:5,6:6,7:7,8:8,9:9,A:10,B:11,C:12,D:13,E:14,F:15,a:10,b:11,c:12,d:13,e:14,f:15},Xl=[..."0123456789ABCDEF"],db=n=>Xl[n&15],fb=n=>Xl[(n&240)>>4]+Xl[n&15],$o=n=>(n&240)>>4===(n&15),pb=n=>$o(n.r)&&$o(n.g)&&$o(n.b)&&$o(n.a);function mb(n){var t=n.length,e;return n[0]==="#"&&(t===4||t===5?e={r:255&Cn[n[1]]*17,g:255&Cn[n[2]]*17,b:255&Cn[n[3]]*17,a:t===5?Cn[n[4]]*17:255}:(t===7||t===9)&&(e={r:Cn[n[1]]<<4|Cn[n[2]],g:Cn[n[3]]<<4|Cn[n[4]],b:Cn[n[5]]<<4|Cn[n[6]],a:t===9?Cn[n[7]]<<4|Cn[n[8]]:255})),e}const gb=(n,t)=>n<255?t(n):"";function _b(n){var t=pb(n)?db:fb;return n?"#"+t(n.r)+t(n.g)+t(n.b)+gb(n.a,t):void 0}const xb=/^(hsla?|hwb|hsv)\(\s*([-+.e\d]+)(?:deg)?[\s,]+([-+.e\d]+)%[\s,]+([-+.e\d]+)%(?:[\s,]+([-+.e\d]+)(%)?)?\s*\)$/;function Ad(n,t,e){const i=t*Math.min(e,1-e),s=(r,o=(r+n/30)%12)=>e-i*Math.max(Math.min(o-3,9-o,1),-1);return[s(0),s(8),s(4)]}function vb(n,t,e){const i=(s,r=(s+n/60)%6)=>e-e*t*Math.max(Math.min(r,4-r,1),0);return[i(5),i(3),i(1)]}function bb(n,t,e){const i=Ad(n,1,.5);let s;for(t+e>1&&(s=1/(t+e),t*=s,e*=s),s=0;s<3;s++)i[s]*=1-t-e,i[s]+=t;return i}function Mb(n,t,e,i,s){return n===s?(t-e)/i+(t<e?6:0):t===s?(e-n)/i+2:(n-t)/i+4}function jl(n){const e=n.r/255,i=n.g/255,s=n.b/255,r=Math.max(e,i,s),o=Math.min(e,i,s),a=(r+o)/2;let l,c,h;return r!==o&&(h=r-o,c=a>.5?h/(2-r-o):h/(r+o),l=Mb(e,i,s,h,r),l=l*60+.5),[l|0,c||0,a]}function Yl(n,t,e,i){return(Array.isArray(t)?n(t[0],t[1],t[2]):n(t,e,i)).map(Ui)}function ql(n,t,e){return Yl(Ad,n,t,e)}function yb(n,t,e){return Yl(bb,n,t,e)}function Sb(n,t,e){return Yl(vb,n,t,e)}function Cd(n){return(n%360+360)%360}function Eb(n){const t=xb.exec(n);let e=255,i;if(!t)return;t[5]!==i&&(e=t[6]?Sr(+t[5]):Ui(+t[5]));const s=Cd(+t[2]),r=+t[3]/100,o=+t[4]/100;return t[1]==="hwb"?i=yb(s,r,o):t[1]==="hsv"?i=Sb(s,r,o):i=ql(s,r,o),{r:i[0],g:i[1],b:i[2],a:e}}function Tb(n,t){var e=jl(n);e[0]=Cd(e[0]+t),e=ql(e),n.r=e[0],n.g=e[1],n.b=e[2]}function wb(n){if(!n)return;const t=jl(n),e=t[0],i=wd(t[1]),s=wd(t[2]);return n.a<255?`hsla(${e}, ${i}%, ${s}%, ${ui(n.a)})`:`hsl(${e}, ${i}%, ${s}%)`}const Rd={x:"dark",Z:"light",Y:"re",X:"blu",W:"gr",V:"medium",U:"slate",A:"ee",T:"ol",S:"or",B:"ra",C:"lateg",D:"ights",R:"in",Q:"turquois",E:"hi",P:"ro",O:"al",N:"le",M:"de",L:"yello",F:"en",K:"ch",G:"arks",H:"ea",I:"ightg",J:"wh"},Pd={OiceXe:"f0f8ff",antiquewEte:"faebd7",aqua:"ffff",aquamarRe:"7fffd4",azuY:"f0ffff",beige:"f5f5dc",bisque:"ffe4c4",black:"0",blanKedOmond:"ffebcd",Xe:"ff",XeviTet:"8a2be2",bPwn:"a52a2a",burlywood:"deb887",caMtXe:"5f9ea0",KartYuse:"7fff00",KocTate:"d2691e",cSO:"ff7f50",cSnflowerXe:"6495ed",cSnsilk:"fff8dc",crimson:"dc143c",cyan:"ffff",xXe:"8b",xcyan:"8b8b",xgTMnPd:"b8860b",xWay:"a9a9a9",xgYF:"6400",xgYy:"a9a9a9",xkhaki:"bdb76b",xmagFta:"8b008b",xTivegYF:"556b2f",xSange:"ff8c00",xScEd:"9932cc",xYd:"8b0000",xsOmon:"e9967a",xsHgYF:"8fbc8f",xUXe:"483d8b",xUWay:"2f4f4f",xUgYy:"2f4f4f",xQe:"ced1",xviTet:"9400d3",dAppRk:"ff1493",dApskyXe:"bfff",dimWay:"696969",dimgYy:"696969",dodgerXe:"1e90ff",fiYbrick:"b22222",flSOwEte:"fffaf0",foYstWAn:"228b22",fuKsia:"ff00ff",gaRsbSo:"dcdcdc",ghostwEte:"f8f8ff",gTd:"ffd700",gTMnPd:"daa520",Way:"808080",gYF:"8000",gYFLw:"adff2f",gYy:"808080",honeyMw:"f0fff0",hotpRk:"ff69b4",RdianYd:"cd5c5c",Rdigo:"4b0082",ivSy:"fffff0",khaki:"f0e68c",lavFMr:"e6e6fa",lavFMrXsh:"fff0f5",lawngYF:"7cfc00",NmoncEffon:"fffacd",ZXe:"add8e6",ZcSO:"f08080",Zcyan:"e0ffff",ZgTMnPdLw:"fafad2",ZWay:"d3d3d3",ZgYF:"90ee90",ZgYy:"d3d3d3",ZpRk:"ffb6c1",ZsOmon:"ffa07a",ZsHgYF:"20b2aa",ZskyXe:"87cefa",ZUWay:"778899",ZUgYy:"778899",ZstAlXe:"b0c4de",ZLw:"ffffe0",lime:"ff00",limegYF:"32cd32",lRF:"faf0e6",magFta:"ff00ff",maPon:"800000",VaquamarRe:"66cdaa",VXe:"cd",VScEd:"ba55d3",VpurpN:"9370db",VsHgYF:"3cb371",VUXe:"7b68ee",VsprRggYF:"fa9a",VQe:"48d1cc",VviTetYd:"c71585",midnightXe:"191970",mRtcYam:"f5fffa",mistyPse:"ffe4e1",moccasR:"ffe4b5",navajowEte:"ffdead",navy:"80",Tdlace:"fdf5e6",Tive:"808000",TivedBb:"6b8e23",Sange:"ffa500",SangeYd:"ff4500",ScEd:"da70d6",pOegTMnPd:"eee8aa",pOegYF:"98fb98",pOeQe:"afeeee",pOeviTetYd:"db7093",papayawEp:"ffefd5",pHKpuff:"ffdab9",peru:"cd853f",pRk:"ffc0cb",plum:"dda0dd",powMrXe:"b0e0e6",purpN:"800080",YbeccapurpN:"663399",Yd:"ff0000",Psybrown:"bc8f8f",PyOXe:"4169e1",saddNbPwn:"8b4513",sOmon:"fa8072",sandybPwn:"f4a460",sHgYF:"2e8b57",sHshell:"fff5ee",siFna:"a0522d",silver:"c0c0c0",skyXe:"87ceeb",UXe:"6a5acd",UWay:"708090",UgYy:"708090",snow:"fffafa",sprRggYF:"ff7f",stAlXe:"4682b4",tan:"d2b48c",teO:"8080",tEstN:"d8bfd8",tomato:"ff6347",Qe:"40e0d0",viTet:"ee82ee",JHt:"f5deb3",wEte:"ffffff",wEtesmoke:"f5f5f5",Lw:"ffff00",LwgYF:"9acd32"};function Ab(){const n={},t=Object.keys(Pd),e=Object.keys(Rd);let i,s,r,o,a;for(i=0;i<t.length;i++){for(o=a=t[i],s=0;s<e.length;s++)r=e[s],a=a.replace(r,Rd[r]);r=parseInt(Pd[o],16),n[a]=[r>>16&255,r>>8&255,r&255]}return n}let Ko;function Cb(n){Ko||(Ko=Ab(),Ko.transparent=[0,0,0,0]);const t=Ko[n.toLowerCase()];return t&&{r:t[0],g:t[1],b:t[2],a:t.length===4?t[3]:255}}const Rb=/^rgba?\(\s*([-+.\d]+)(%)?[\s,]+([-+.e\d]+)(%)?[\s,]+([-+.e\d]+)(%)?(?:[\s,/]+([-+.e\d]+)(%)?)?\s*\)$/;function Pb(n){const t=Rb.exec(n);let e=255,i,s,r;if(t){if(t[7]!==i){const o=+t[7];e=t[8]?Sr(o):Oi(o*255,0,255)}return i=+t[1],s=+t[3],r=+t[5],i=255&(t[2]?Sr(i):Oi(i,0,255)),s=255&(t[4]?Sr(s):Oi(s,0,255)),r=255&(t[6]?Sr(r):Oi(r,0,255)),{r:i,g:s,b:r,a:e}}}function Lb(n){return n&&(n.a<255?`rgba(${n.r}, ${n.g}, ${n.b}, ${ui(n.a)})`:`rgb(${n.r}, ${n.g}, ${n.b})`)}const $l=n=>n<=.0031308?n*12.92:Math.pow(n,1/2.4)*1.055-.055,Qs=n=>n<=.04045?n/12.92:Math.pow((n+.055)/1.055,2.4);function Db(n,t,e){const i=Qs(ui(n.r)),s=Qs(ui(n.g)),r=Qs(ui(n.b));return{r:Ui($l(i+e*(Qs(ui(t.r))-i))),g:Ui($l(s+e*(Qs(ui(t.g))-s))),b:Ui($l(r+e*(Qs(ui(t.b))-r))),a:n.a+e*(t.a-n.a)}}function Zo(n,t,e){if(n){let i=jl(n);i[t]=Math.max(0,Math.min(i[t]+i[t]*e,t===0?360:1)),i=ql(i),n.r=i[0],n.g=i[1],n.b=i[2]}}function Ld(n,t){return n&&Object.assign(t||{},n)}function Dd(n){var t={r:0,g:0,b:0,a:255};return Array.isArray(n)?n.length>=3&&(t={r:n[0],g:n[1],b:n[2],a:255},n.length>3&&(t.a=Ui(n[3]))):(t=Ld(n,{r:0,g:0,b:0,a:1}),t.a=Ui(t.a)),t}function Ib(n){return n.charAt(0)==="r"?Pb(n):Eb(n)}class Er{constructor(t){if(t instanceof Er)return t;const e=typeof t;let i;e==="object"?i=Dd(t):e==="string"&&(i=mb(t)||Cb(t)||Ib(t)),this._rgb=i,this._valid=!!i}get valid(){return this._valid}get rgb(){var t=Ld(this._rgb);return t&&(t.a=ui(t.a)),t}set rgb(t){this._rgb=Dd(t)}rgbString(){return this._valid?Lb(this._rgb):void 0}hexString(){return this._valid?_b(this._rgb):void 0}hslString(){return this._valid?wb(this._rgb):void 0}mix(t,e){if(t){const i=this.rgb,s=t.rgb;let r;const o=e===r?.5:e,a=2*o-1,l=i.a-s.a,c=((a*l===-1?a:(a+l)/(1+a*l))+1)/2;r=1-c,i.r=255&c*i.r+r*s.r+.5,i.g=255&c*i.g+r*s.g+.5,i.b=255&c*i.b+r*s.b+.5,i.a=o*i.a+(1-o)*s.a,this.rgb=i}return this}interpolate(t,e){return t&&(this._rgb=Db(this._rgb,t._rgb,e)),this}clone(){return new Er(this.rgb)}alpha(t){return this._rgb.a=Ui(t),this}clearer(t){const e=this._rgb;return e.a*=1-t,this}greyscale(){const t=this._rgb,e=yr(t.r*.3+t.g*.59+t.b*.11);return t.r=t.g=t.b=e,this}opaquer(t){const e=this._rgb;return e.a*=1+t,this}negate(){const t=this._rgb;return t.r=255-t.r,t.g=255-t.g,t.b=255-t.b,this}lighten(t){return Zo(this._rgb,2,t),this}darken(t){return Zo(this._rgb,2,-t),this}saturate(t){return Zo(this._rgb,1,t),this}desaturate(t){return Zo(this._rgb,1,-t),this}rotate(t){return Tb(this._rgb,t),this}}/*!
 * Chart.js v4.4.1
 * https://www.chartjs.org
 * (c) 2023 Chart.js Contributors
 * Released under the MIT License
 */function di(){}const Ob=(()=>{let n=0;return()=>n++})();function ee(n){return n===null||typeof n>"u"}function _e(n){if(Array.isArray&&Array.isArray(n))return!0;const t=Object.prototype.toString.call(n);return t.slice(0,7)==="[object"&&t.slice(-6)==="Array]"}function Zt(n){return n!==null&&Object.prototype.toString.call(n)==="[object Object]"}function be(n){return(typeof n=="number"||n instanceof Number)&&isFinite(+n)}function gn(n,t){return be(n)?n:t}function kt(n,t){return typeof n>"u"?t:n}const Ub=(n,t)=>typeof n=="string"&&n.endsWith("%")?parseFloat(n)/100:+n/t,Id=(n,t)=>typeof n=="string"&&n.endsWith("%")?parseFloat(n)/100*t:+n;function ue(n,t,e){if(n&&typeof n.call=="function")return n.apply(e,t)}function oe(n,t,e,i){let s,r,o;if(_e(n))for(r=n.length,s=0;s<r;s++)t.call(e,n[s],s);else if(Zt(n))for(o=Object.keys(n),r=o.length,s=0;s<r;s++)t.call(e,n[o[s]],o[s])}function Jo(n,t){let e,i,s,r;if(!n||!t||n.length!==t.length)return!1;for(e=0,i=n.length;e<i;++e)if(s=n[e],r=t[e],s.datasetIndex!==r.datasetIndex||s.index!==r.index)return!1;return!0}function Qo(n){if(_e(n))return n.map(Qo);if(Zt(n)){const t=Object.create(null),e=Object.keys(n),i=e.length;let s=0;for(;s<i;++s)t[e[s]]=Qo(n[e[s]]);return t}return n}function Od(n){return["__proto__","prototype","constructor"].indexOf(n)===-1}function Fb(n,t,e,i){if(!Od(n))return;const s=t[n],r=e[n];Zt(s)&&Zt(r)?Tr(s,r,i):t[n]=Qo(r)}function Tr(n,t,e){const i=_e(t)?t:[t],s=i.length;if(!Zt(n))return n;e=e||{};const r=e.merger||Fb;let o;for(let a=0;a<s;++a){if(o=i[a],!Zt(o))continue;const l=Object.keys(o);for(let c=0,h=l.length;c<h;++c)r(l[c],n,o,e)}return n}function wr(n,t){return Tr(n,t,{merger:Nb})}function Nb(n,t,e){if(!Od(n))return;const i=t[n],s=e[n];Zt(i)&&Zt(s)?wr(i,s):Object.prototype.hasOwnProperty.call(t,n)||(t[n]=Qo(s))}const Ud={"":n=>n,x:n=>n.x,y:n=>n.y};function kb(n){const t=n.split("."),e=[];let i="";for(const s of t)i+=s,i.endsWith("\\")?i=i.slice(0,-1)+".":(e.push(i),i="");return e}function Bb(n){const t=kb(n);return e=>{for(const i of t){if(i==="")break;e=e&&e[i]}return e}}function Fi(n,t){return(Ud[t]||(Ud[t]=Bb(t)))(n)}function Kl(n){return n.charAt(0).toUpperCase()+n.slice(1)}const Ar=n=>typeof n<"u",Ni=n=>typeof n=="function",Fd=(n,t)=>{if(n.size!==t.size)return!1;for(const e of n)if(!t.has(e))return!1;return!0};function zb(n){return n.type==="mouseup"||n.type==="click"||n.type==="contextmenu"}const fe=Math.PI,pe=2*fe,Hb=pe+fe,ta=Number.POSITIVE_INFINITY,Vb=fe/180,Se=fe/2,is=fe/4,Nd=fe*2/3,ki=Math.log10,Wn=Math.sign;function Cr(n,t,e){return Math.abs(n-t)<e}function kd(n){const t=Math.round(n);n=Cr(n,t,n/1e3)?t:n;const e=Math.pow(10,Math.floor(ki(n))),i=n/e;return(i<=1?1:i<=2?2:i<=5?5:10)*e}function Gb(n){const t=[],e=Math.sqrt(n);let i;for(i=1;i<e;i++)n%i===0&&(t.push(i),t.push(n/i));return e===(e|0)&&t.push(e),t.sort((s,r)=>s-r).pop(),t}function tr(n){return!isNaN(parseFloat(n))&&isFinite(n)}function Wb(n,t){const e=Math.round(n);return e-t<=n&&e+t>=n}function Bd(n,t,e){let i,s,r;for(i=0,s=n.length;i<s;i++)r=n[i][e],isNaN(r)||(t.min=Math.min(t.min,r),t.max=Math.max(t.max,r))}function kn(n){return n*(fe/180)}function Zl(n){return n*(180/fe)}function zd(n){if(!be(n))return;let t=1,e=0;for(;Math.round(n*t)/t!==n;)t*=10,e++;return e}function Hd(n,t){const e=t.x-n.x,i=t.y-n.y,s=Math.sqrt(e*e+i*i);let r=Math.atan2(i,e);return r<-.5*fe&&(r+=pe),{angle:r,distance:s}}function Jl(n,t){return Math.sqrt(Math.pow(t.x-n.x,2)+Math.pow(t.y-n.y,2))}function Xb(n,t){return(n-t+Hb)%pe-fe}function _n(n){return(n%pe+pe)%pe}function Rr(n,t,e,i){const s=_n(n),r=_n(t),o=_n(e),a=_n(r-s),l=_n(o-s),c=_n(s-r),h=_n(s-o);return s===r||s===o||i&&r===o||a>l&&c<h}function ke(n,t,e){return Math.max(t,Math.min(e,n))}function jb(n){return ke(n,-32768,32767)}function fi(n,t,e,i=1e-6){return n>=Math.min(t,e)-i&&n<=Math.max(t,e)+i}function Ql(n,t,e){e=e||(o=>n[o]<t);let i=n.length-1,s=0,r;for(;i-s>1;)r=s+i>>1,e(r)?s=r:i=r;return{lo:s,hi:i}}const pi=(n,t,e,i)=>Ql(n,e,i?s=>{const r=n[s][t];return r<e||r===e&&n[s+1][t]===e}:s=>n[s][t]<e),Yb=(n,t,e)=>Ql(n,e,i=>n[i][t]>=e);function qb(n,t,e){let i=0,s=n.length;for(;i<s&&n[i]<t;)i++;for(;s>i&&n[s-1]>e;)s--;return i>0||s<n.length?n.slice(i,s):n}const Vd=["push","pop","shift","splice","unshift"];function $b(n,t){if(n._chartjs){n._chartjs.listeners.push(t);return}Object.defineProperty(n,"_chartjs",{configurable:!0,enumerable:!1,value:{listeners:[t]}}),Vd.forEach(e=>{const i="_onData"+Kl(e),s=n[e];Object.defineProperty(n,e,{configurable:!0,enumerable:!1,value(...r){const o=s.apply(this,r);return n._chartjs.listeners.forEach(a=>{typeof a[i]=="function"&&a[i](...r)}),o}})})}function Gd(n,t){const e=n._chartjs;if(!e)return;const i=e.listeners,s=i.indexOf(t);s!==-1&&i.splice(s,1),!(i.length>0)&&(Vd.forEach(r=>{delete n[r]}),delete n._chartjs)}function Wd(n){const t=new Set(n);return t.size===n.length?n:Array.from(t)}const Xd=(function(){return typeof window>"u"?function(n){return n()}:window.requestAnimationFrame})();function jd(n,t){let e=[],i=!1;return function(...s){e=s,i||(i=!0,Xd.call(window,()=>{i=!1,n.apply(t,e)}))}}function Kb(n,t){let e;return function(...i){return t?(clearTimeout(e),e=setTimeout(n,t,i)):n.apply(this,i),t}}const tc=n=>n==="start"?"left":n==="end"?"right":"center",Ye=(n,t,e)=>n==="start"?t:n==="end"?e:(t+e)/2,Zb=(n,t,e,i)=>n===(i?"left":"right")?e:n==="center"?(t+e)/2:t;function Yd(n,t,e){const i=t.length;let s=0,r=i;if(n._sorted){const{iScale:o,_parsed:a}=n,l=o.axis,{min:c,max:h,minDefined:u,maxDefined:d}=o.getUserBounds();u&&(s=ke(Math.min(pi(a,l,c).lo,e?i:pi(t,l,o.getPixelForValue(c)).lo),0,i-1)),d?r=ke(Math.max(pi(a,o.axis,h,!0).hi+1,e?0:pi(t,l,o.getPixelForValue(h),!0).hi+1),s,i)-s:r=i-s}return{start:s,count:r}}function qd(n){const{xScale:t,yScale:e,_scaleRanges:i}=n,s={xmin:t.min,xmax:t.max,ymin:e.min,ymax:e.max};if(!i)return n._scaleRanges=s,!0;const r=i.xmin!==t.min||i.xmax!==t.max||i.ymin!==e.min||i.ymax!==e.max;return Object.assign(i,s),r}const ea=n=>n===0||n===1,$d=(n,t,e)=>-(Math.pow(2,10*(n-=1))*Math.sin((n-t)*pe/e)),Kd=(n,t,e)=>Math.pow(2,-10*n)*Math.sin((n-t)*pe/e)+1,Pr={linear:n=>n,easeInQuad:n=>n*n,easeOutQuad:n=>-n*(n-2),easeInOutQuad:n=>(n/=.5)<1?.5*n*n:-.5*(--n*(n-2)-1),easeInCubic:n=>n*n*n,easeOutCubic:n=>(n-=1)*n*n+1,easeInOutCubic:n=>(n/=.5)<1?.5*n*n*n:.5*((n-=2)*n*n+2),easeInQuart:n=>n*n*n*n,easeOutQuart:n=>-((n-=1)*n*n*n-1),easeInOutQuart:n=>(n/=.5)<1?.5*n*n*n*n:-.5*((n-=2)*n*n*n-2),easeInQuint:n=>n*n*n*n*n,easeOutQuint:n=>(n-=1)*n*n*n*n+1,easeInOutQuint:n=>(n/=.5)<1?.5*n*n*n*n*n:.5*((n-=2)*n*n*n*n+2),easeInSine:n=>-Math.cos(n*Se)+1,easeOutSine:n=>Math.sin(n*Se),easeInOutSine:n=>-.5*(Math.cos(fe*n)-1),easeInExpo:n=>n===0?0:Math.pow(2,10*(n-1)),easeOutExpo:n=>n===1?1:-Math.pow(2,-10*n)+1,easeInOutExpo:n=>ea(n)?n:n<.5?.5*Math.pow(2,10*(n*2-1)):.5*(-Math.pow(2,-10*(n*2-1))+2),easeInCirc:n=>n>=1?n:-(Math.sqrt(1-n*n)-1),easeOutCirc:n=>Math.sqrt(1-(n-=1)*n),easeInOutCirc:n=>(n/=.5)<1?-.5*(Math.sqrt(1-n*n)-1):.5*(Math.sqrt(1-(n-=2)*n)+1),easeInElastic:n=>ea(n)?n:$d(n,.075,.3),easeOutElastic:n=>ea(n)?n:Kd(n,.075,.3),easeInOutElastic(n){return ea(n)?n:n<.5?.5*$d(n*2,.1125,.45):.5+.5*Kd(n*2-1,.1125,.45)},easeInBack(n){return n*n*((1.70158+1)*n-1.70158)},easeOutBack(n){return(n-=1)*n*((1.70158+1)*n+1.70158)+1},easeInOutBack(n){let t=1.70158;return(n/=.5)<1?.5*(n*n*(((t*=1.525)+1)*n-t)):.5*((n-=2)*n*(((t*=1.525)+1)*n+t)+2)},easeInBounce:n=>1-Pr.easeOutBounce(1-n),easeOutBounce(n){return n<1/2.75?7.5625*n*n:n<2/2.75?7.5625*(n-=1.5/2.75)*n+.75:n<2.5/2.75?7.5625*(n-=2.25/2.75)*n+.9375:7.5625*(n-=2.625/2.75)*n+.984375},easeInOutBounce:n=>n<.5?Pr.easeInBounce(n*2)*.5:Pr.easeOutBounce(n*2-1)*.5+.5};function ec(n){if(n&&typeof n=="object"){const t=n.toString();return t==="[object CanvasPattern]"||t==="[object CanvasGradient]"}return!1}function Zd(n){return ec(n)?n:new Er(n)}function nc(n){return ec(n)?n:new Er(n).saturate(.5).darken(.1).hexString()}const Jb=["x","y","borderWidth","radius","tension"],Qb=["color","borderColor","backgroundColor"];function tM(n){n.set("animation",{delay:void 0,duration:1e3,easing:"easeOutQuart",fn:void 0,from:void 0,loop:void 0,to:void 0,type:void 0}),n.describe("animation",{_fallback:!1,_indexable:!1,_scriptable:t=>t!=="onProgress"&&t!=="onComplete"&&t!=="fn"}),n.set("animations",{colors:{type:"color",properties:Qb},numbers:{type:"number",properties:Jb}}),n.describe("animations",{_fallback:"animation"}),n.set("transitions",{active:{animation:{duration:400}},resize:{animation:{duration:0}},show:{animations:{colors:{from:"transparent"},visible:{type:"boolean",duration:0}}},hide:{animations:{colors:{to:"transparent"},visible:{type:"boolean",easing:"linear",fn:t=>t|0}}}})}function eM(n){n.set("layout",{autoPadding:!0,padding:{top:0,right:0,bottom:0,left:0}})}const Jd=new Map;function nM(n,t){t=t||{};const e=n+JSON.stringify(t);let i=Jd.get(e);return i||(i=new Intl.NumberFormat(n,t),Jd.set(e,i)),i}function Lr(n,t,e){return nM(t,e).format(n)}const Qd={values(n){return _e(n)?n:""+n},numeric(n,t,e){if(n===0)return"0";const i=this.chart.options.locale;let s,r=n;if(e.length>1){const c=Math.max(Math.abs(e[0].value),Math.abs(e[e.length-1].value));(c<1e-4||c>1e15)&&(s="scientific"),r=iM(n,e)}const o=ki(Math.abs(r)),a=isNaN(o)?1:Math.max(Math.min(-1*Math.floor(o),20),0),l={notation:s,minimumFractionDigits:a,maximumFractionDigits:a};return Object.assign(l,this.options.ticks.format),Lr(n,i,l)},logarithmic(n,t,e){if(n===0)return"0";const i=e[t].significand||n/Math.pow(10,Math.floor(ki(n)));return[1,2,3,5,10,15].includes(i)||t>.8*e.length?Qd.numeric.call(this,n,t,e):""}};function iM(n,t){let e=t.length>3?t[2].value-t[1].value:t[1].value-t[0].value;return Math.abs(e)>=1&&n!==Math.floor(n)&&(e=n-Math.floor(n)),e}var na={formatters:Qd};function sM(n){n.set("scale",{display:!0,offset:!1,reverse:!1,beginAtZero:!1,bounds:"ticks",clip:!0,grace:0,grid:{display:!0,lineWidth:1,drawOnChartArea:!0,drawTicks:!0,tickLength:8,tickWidth:(t,e)=>e.lineWidth,tickColor:(t,e)=>e.color,offset:!1},border:{display:!0,dash:[],dashOffset:0,width:1},title:{display:!1,text:"",padding:{top:4,bottom:4}},ticks:{minRotation:0,maxRotation:50,mirror:!1,textStrokeWidth:0,textStrokeColor:"",padding:3,display:!0,autoSkip:!0,autoSkipPadding:3,labelOffset:0,callback:na.formatters.values,minor:{},major:{},align:"center",crossAlign:"near",showLabelBackdrop:!1,backdropColor:"rgba(255, 255, 255, 0.75)",backdropPadding:2}}),n.route("scale.ticks","color","","color"),n.route("scale.grid","color","","borderColor"),n.route("scale.border","color","","borderColor"),n.route("scale.title","color","","color"),n.describe("scale",{_fallback:!1,_scriptable:t=>!t.startsWith("before")&&!t.startsWith("after")&&t!=="callback"&&t!=="parser",_indexable:t=>t!=="borderDash"&&t!=="tickBorderDash"&&t!=="dash"}),n.describe("scales",{_fallback:"scale"}),n.describe("scale.ticks",{_scriptable:t=>t!=="backdropPadding"&&t!=="callback",_indexable:t=>t!=="backdropPadding"})}const ss=Object.create(null),ic=Object.create(null);function Dr(n,t){if(!t)return n;const e=t.split(".");for(let i=0,s=e.length;i<s;++i){const r=e[i];n=n[r]||(n[r]=Object.create(null))}return n}function sc(n,t,e){return typeof t=="string"?Tr(Dr(n,t),e):Tr(Dr(n,""),t)}class rM{constructor(t,e){this.animation=void 0,this.backgroundColor="rgba(0,0,0,0.1)",this.borderColor="rgba(0,0,0,0.1)",this.color="#666",this.datasets={},this.devicePixelRatio=i=>i.chart.platform.getDevicePixelRatio(),this.elements={},this.events=["mousemove","mouseout","click","touchstart","touchmove"],this.font={family:"'Helvetica Neue', 'Helvetica', 'Arial', sans-serif",size:12,style:"normal",lineHeight:1.2,weight:null},this.hover={},this.hoverBackgroundColor=(i,s)=>nc(s.backgroundColor),this.hoverBorderColor=(i,s)=>nc(s.borderColor),this.hoverColor=(i,s)=>nc(s.color),this.indexAxis="x",this.interaction={mode:"nearest",intersect:!0,includeInvisible:!1},this.maintainAspectRatio=!0,this.onHover=null,this.onClick=null,this.parsing=!0,this.plugins={},this.responsive=!0,this.scale=void 0,this.scales={},this.showLine=!0,this.drawActiveElementsOnTop=!0,this.describe(t),this.apply(e)}set(t,e){return sc(this,t,e)}get(t){return Dr(this,t)}describe(t,e){return sc(ic,t,e)}override(t,e){return sc(ss,t,e)}route(t,e,i,s){const r=Dr(this,t),o=Dr(this,i),a="_"+e;Object.defineProperties(r,{[a]:{value:r[e],writable:!0},[e]:{enumerable:!0,get(){const l=this[a],c=o[s];return Zt(l)?Object.assign({},c,l):kt(l,c)},set(l){this[a]=l}}})}apply(t){t.forEach(e=>e(this))}}var Me=new rM({_scriptable:n=>!n.startsWith("on"),_indexable:n=>n!=="events",hover:{_fallback:"interaction"},interaction:{_scriptable:!1,_indexable:!1}},[tM,eM,sM]);function oM(n){return!n||ee(n.size)||ee(n.family)?null:(n.style?n.style+" ":"")+(n.weight?n.weight+" ":"")+n.size+"px "+n.family}function ia(n,t,e,i,s){let r=t[s];return r||(r=t[s]=n.measureText(s).width,e.push(s)),r>i&&(i=r),i}function aM(n,t,e,i){i=i||{};let s=i.data=i.data||{},r=i.garbageCollect=i.garbageCollect||[];i.font!==t&&(s=i.data={},r=i.garbageCollect=[],i.font=t),n.save(),n.font=t;let o=0;const a=e.length;let l,c,h,u,d;for(l=0;l<a;l++)if(u=e[l],u!=null&&!_e(u))o=ia(n,s,r,o,u);else if(_e(u))for(c=0,h=u.length;c<h;c++)d=u[c],d!=null&&!_e(d)&&(o=ia(n,s,r,o,d));n.restore();const f=r.length/2;if(f>e.length){for(l=0;l<f;l++)delete s[r[l]];r.splice(0,f)}return o}function rs(n,t,e){const i=n.currentDevicePixelRatio,s=e!==0?Math.max(e/2,.5):0;return Math.round((t-s)*i)/i+s}function tf(n,t){t=t||n.getContext("2d"),t.save(),t.resetTransform(),t.clearRect(0,0,n.width,n.height),t.restore()}function rc(n,t,e,i){ef(n,t,e,i,null)}function ef(n,t,e,i,s){let r,o,a,l,c,h,u,d;const f=t.pointStyle,g=t.rotation,_=t.radius;let m=(g||0)*Vb;if(f&&typeof f=="object"&&(r=f.toString(),r==="[object HTMLImageElement]"||r==="[object HTMLCanvasElement]")){n.save(),n.translate(e,i),n.rotate(m),n.drawImage(f,-f.width/2,-f.height/2,f.width,f.height),n.restore();return}if(!(isNaN(_)||_<=0)){switch(n.beginPath(),f){default:s?n.ellipse(e,i,s/2,_,0,0,pe):n.arc(e,i,_,0,pe),n.closePath();break;case"triangle":h=s?s/2:_,n.moveTo(e+Math.sin(m)*h,i-Math.cos(m)*_),m+=Nd,n.lineTo(e+Math.sin(m)*h,i-Math.cos(m)*_),m+=Nd,n.lineTo(e+Math.sin(m)*h,i-Math.cos(m)*_),n.closePath();break;case"rectRounded":c=_*.516,l=_-c,o=Math.cos(m+is)*l,u=Math.cos(m+is)*(s?s/2-c:l),a=Math.sin(m+is)*l,d=Math.sin(m+is)*(s?s/2-c:l),n.arc(e-u,i-a,c,m-fe,m-Se),n.arc(e+d,i-o,c,m-Se,m),n.arc(e+u,i+a,c,m,m+Se),n.arc(e-d,i+o,c,m+Se,m+fe),n.closePath();break;case"rect":if(!g){l=Math.SQRT1_2*_,h=s?s/2:l,n.rect(e-h,i-l,2*h,2*l);break}m+=is;case"rectRot":u=Math.cos(m)*(s?s/2:_),o=Math.cos(m)*_,a=Math.sin(m)*_,d=Math.sin(m)*(s?s/2:_),n.moveTo(e-u,i-a),n.lineTo(e+d,i-o),n.lineTo(e+u,i+a),n.lineTo(e-d,i+o),n.closePath();break;case"crossRot":m+=is;case"cross":u=Math.cos(m)*(s?s/2:_),o=Math.cos(m)*_,a=Math.sin(m)*_,d=Math.sin(m)*(s?s/2:_),n.moveTo(e-u,i-a),n.lineTo(e+u,i+a),n.moveTo(e+d,i-o),n.lineTo(e-d,i+o);break;case"star":u=Math.cos(m)*(s?s/2:_),o=Math.cos(m)*_,a=Math.sin(m)*_,d=Math.sin(m)*(s?s/2:_),n.moveTo(e-u,i-a),n.lineTo(e+u,i+a),n.moveTo(e+d,i-o),n.lineTo(e-d,i+o),m+=is,u=Math.cos(m)*(s?s/2:_),o=Math.cos(m)*_,a=Math.sin(m)*_,d=Math.sin(m)*(s?s/2:_),n.moveTo(e-u,i-a),n.lineTo(e+u,i+a),n.moveTo(e+d,i-o),n.lineTo(e-d,i+o);break;case"line":o=s?s/2:Math.cos(m)*_,a=Math.sin(m)*_,n.moveTo(e-o,i-a),n.lineTo(e+o,i+a);break;case"dash":n.moveTo(e,i),n.lineTo(e+Math.cos(m)*(s?s/2:_),i+Math.sin(m)*_);break;case!1:n.closePath();break}n.fill(),t.borderWidth>0&&n.stroke()}}function mi(n,t,e){return e=e||.5,!t||n&&n.x>t.left-e&&n.x<t.right+e&&n.y>t.top-e&&n.y<t.bottom+e}function sa(n,t){n.save(),n.beginPath(),n.rect(t.left,t.top,t.right-t.left,t.bottom-t.top),n.clip()}function ra(n){n.restore()}function lM(n,t,e,i,s){if(!t)return n.lineTo(e.x,e.y);if(s==="middle"){const r=(t.x+e.x)/2;n.lineTo(r,t.y),n.lineTo(r,e.y)}else s==="after"!=!!i?n.lineTo(t.x,e.y):n.lineTo(e.x,t.y);n.lineTo(e.x,e.y)}function cM(n,t,e,i){if(!t)return n.lineTo(e.x,e.y);n.bezierCurveTo(i?t.cp1x:t.cp2x,i?t.cp1y:t.cp2y,i?e.cp2x:e.cp1x,i?e.cp2y:e.cp1y,e.x,e.y)}function hM(n,t){t.translation&&n.translate(t.translation[0],t.translation[1]),ee(t.rotation)||n.rotate(t.rotation),t.color&&(n.fillStyle=t.color),t.textAlign&&(n.textAlign=t.textAlign),t.textBaseline&&(n.textBaseline=t.textBaseline)}function uM(n,t,e,i,s){if(s.strikethrough||s.underline){const r=n.measureText(i),o=t-r.actualBoundingBoxLeft,a=t+r.actualBoundingBoxRight,l=e-r.actualBoundingBoxAscent,c=e+r.actualBoundingBoxDescent,h=s.strikethrough?(l+c)/2:c;n.strokeStyle=n.fillStyle,n.beginPath(),n.lineWidth=s.decorationWidth||2,n.moveTo(o,h),n.lineTo(a,h),n.stroke()}}function dM(n,t){const e=n.fillStyle;n.fillStyle=t.color,n.fillRect(t.left,t.top,t.width,t.height),n.fillStyle=e}function os(n,t,e,i,s,r={}){const o=_e(t)?t:[t],a=r.strokeWidth>0&&r.strokeColor!=="";let l,c;for(n.save(),n.font=s.string,hM(n,r),l=0;l<o.length;++l)c=o[l],r.backdrop&&dM(n,r.backdrop),a&&(r.strokeColor&&(n.strokeStyle=r.strokeColor),ee(r.strokeWidth)||(n.lineWidth=r.strokeWidth),n.strokeText(c,e,i,r.maxWidth)),n.fillText(c,e,i,r.maxWidth),uM(n,e,i,c,r),i+=Number(s.lineHeight);n.restore()}function Ir(n,t){const{x:e,y:i,w:s,h:r,radius:o}=t;n.arc(e+o.topLeft,i+o.topLeft,o.topLeft,1.5*fe,fe,!0),n.lineTo(e,i+r-o.bottomLeft),n.arc(e+o.bottomLeft,i+r-o.bottomLeft,o.bottomLeft,fe,Se,!0),n.lineTo(e+s-o.bottomRight,i+r),n.arc(e+s-o.bottomRight,i+r-o.bottomRight,o.bottomRight,Se,0,!0),n.lineTo(e+s,i+o.topRight),n.arc(e+s-o.topRight,i+o.topRight,o.topRight,0,-Se,!0),n.lineTo(e+o.topLeft,i)}const fM=/^(normal|(\d+(?:\.\d+)?)(px|em|%)?)$/,pM=/^(normal|italic|initial|inherit|unset|(oblique( -?[0-9]?[0-9]deg)?))$/;function mM(n,t){const e=(""+n).match(fM);if(!e||e[1]==="normal")return t*1.2;switch(n=+e[2],e[3]){case"px":return n;case"%":n/=100;break}return t*n}const gM=n=>+n||0;function oc(n,t){const e={},i=Zt(t),s=i?Object.keys(t):t,r=Zt(n)?i?o=>kt(n[o],n[t[o]]):o=>n[o]:()=>n;for(const o of s)e[o]=gM(r(o));return e}function nf(n){return oc(n,{top:"y",right:"x",bottom:"y",left:"x"})}function as(n){return oc(n,["topLeft","topRight","bottomLeft","bottomRight"])}function qe(n){const t=nf(n);return t.width=t.left+t.right,t.height=t.top+t.bottom,t}function De(n,t){n=n||{},t=t||Me.font;let e=kt(n.size,t.size);typeof e=="string"&&(e=parseInt(e,10));let i=kt(n.style,t.style);i&&!(""+i).match(pM)&&(console.warn('Invalid font style specified: "'+i+'"'),i=void 0);const s={family:kt(n.family,t.family),lineHeight:mM(kt(n.lineHeight,t.lineHeight),e),size:e,style:i,weight:kt(n.weight,t.weight),string:""};return s.string=oM(s),s}function Or(n,t,e,i){let s,r,o;for(s=0,r=n.length;s<r;++s)if(o=n[s],o!==void 0&&o!==void 0)return o}function _M(n,t,e){const{min:i,max:s}=n,r=Id(t,(s-i)/2),o=(a,l)=>e&&a===0?0:a+l;return{min:o(i,-Math.abs(r)),max:o(s,r)}}function Bi(n,t){return Object.assign(Object.create(n),t)}function ac(n,t=[""],e,i,s=()=>n[0]){const r=e||n;typeof i>"u"&&(i=lf("_fallback",n));const o={[Symbol.toStringTag]:"Object",_cacheable:!0,_scopes:n,_rootScopes:r,_fallback:i,_getTarget:s,override:a=>ac([a,...n],t,r,i)};return new Proxy(o,{deleteProperty(a,l){return delete a[l],delete a._keys,delete n[0][l],!0},get(a,l){return rf(a,l,()=>TM(l,t,n,a))},getOwnPropertyDescriptor(a,l){return Reflect.getOwnPropertyDescriptor(a._scopes[0],l)},getPrototypeOf(){return Reflect.getPrototypeOf(n[0])},has(a,l){return cf(a).includes(l)},ownKeys(a){return cf(a)},set(a,l,c){const h=a._storage||(a._storage=s());return a[l]=h[l]=c,delete a._keys,!0}})}function er(n,t,e,i){const s={_cacheable:!1,_proxy:n,_context:t,_subProxy:e,_stack:new Set,_descriptors:sf(n,i),setContext:r=>er(n,r,e,i),override:r=>er(n.override(r),t,e,i)};return new Proxy(s,{deleteProperty(r,o){return delete r[o],delete n[o],!0},get(r,o,a){return rf(r,o,()=>vM(r,o,a))},getOwnPropertyDescriptor(r,o){return r._descriptors.allKeys?Reflect.has(n,o)?{enumerable:!0,configurable:!0}:void 0:Reflect.getOwnPropertyDescriptor(n,o)},getPrototypeOf(){return Reflect.getPrototypeOf(n)},has(r,o){return Reflect.has(n,o)},ownKeys(){return Reflect.ownKeys(n)},set(r,o,a){return n[o]=a,delete r[o],!0}})}function sf(n,t={scriptable:!0,indexable:!0}){const{_scriptable:e=t.scriptable,_indexable:i=t.indexable,_allKeys:s=t.allKeys}=n;return{allKeys:s,scriptable:e,indexable:i,isScriptable:Ni(e)?e:()=>e,isIndexable:Ni(i)?i:()=>i}}const xM=(n,t)=>n?n+Kl(t):t,lc=(n,t)=>Zt(t)&&n!=="adapters"&&(Object.getPrototypeOf(t)===null||t.constructor===Object);function rf(n,t,e){if(Object.prototype.hasOwnProperty.call(n,t))return n[t];const i=e();return n[t]=i,i}function vM(n,t,e){const{_proxy:i,_context:s,_subProxy:r,_descriptors:o}=n;let a=i[t];return Ni(a)&&o.isScriptable(t)&&(a=bM(t,a,n,e)),_e(a)&&a.length&&(a=MM(t,a,n,o.isIndexable)),lc(t,a)&&(a=er(a,s,r&&r[t],o)),a}function bM(n,t,e,i){const{_proxy:s,_context:r,_subProxy:o,_stack:a}=e;if(a.has(n))throw new Error("Recursion detected: "+Array.from(a).join("->")+"->"+n);a.add(n);let l=t(r,o||i);return a.delete(n),lc(n,l)&&(l=cc(s._scopes,s,n,l)),l}function MM(n,t,e,i){const{_proxy:s,_context:r,_subProxy:o,_descriptors:a}=e;if(typeof r.index<"u"&&i(n))return t[r.index%t.length];if(Zt(t[0])){const l=t,c=s._scopes.filter(h=>h!==l);t=[];for(const h of l){const u=cc(c,s,n,h);t.push(er(u,r,o&&o[n],a))}}return t}function of(n,t,e){return Ni(n)?n(t,e):n}const yM=(n,t)=>n===!0?t:typeof n=="string"?Fi(t,n):void 0;function SM(n,t,e,i,s){for(const r of t){const o=yM(e,r);if(o){n.add(o);const a=of(o._fallback,e,s);if(typeof a<"u"&&a!==e&&a!==i)return a}else if(o===!1&&typeof i<"u"&&e!==i)return null}return!1}function cc(n,t,e,i){const s=t._rootScopes,r=of(t._fallback,e,i),o=[...n,...s],a=new Set;a.add(i);let l=af(a,o,e,r||e,i);return l===null||typeof r<"u"&&r!==e&&(l=af(a,o,r,l,i),l===null)?!1:ac(Array.from(a),[""],s,r,()=>EM(t,e,i))}function af(n,t,e,i,s){for(;e;)e=SM(n,t,e,i,s);return e}function EM(n,t,e){const i=n._getTarget();t in i||(i[t]={});const s=i[t];return _e(s)&&Zt(e)?e:s||{}}function TM(n,t,e,i){let s;for(const r of t)if(s=lf(xM(r,n),e),typeof s<"u")return lc(n,s)?cc(e,i,n,s):s}function lf(n,t){for(const e of t){if(!e)continue;const i=e[n];if(typeof i<"u")return i}}function cf(n){let t=n._keys;return t||(t=n._keys=wM(n._scopes)),t}function wM(n){const t=new Set;for(const e of n)for(const i of Object.keys(e).filter(s=>!s.startsWith("_")))t.add(i);return Array.from(t)}function hf(n,t,e,i){const{iScale:s}=n,{key:r="r"}=this._parsing,o=new Array(i);let a,l,c,h;for(a=0,l=i;a<l;++a)c=a+e,h=t[c],o[a]={r:s.parse(Fi(h,r),c)};return o}const AM=Number.EPSILON||1e-14,nr=(n,t)=>t<n.length&&!n[t].skip&&n[t],uf=n=>n==="x"?"y":"x";function CM(n,t,e,i){const s=n.skip?t:n,r=t,o=e.skip?t:e,a=Jl(r,s),l=Jl(o,r);let c=a/(a+l),h=l/(a+l);c=isNaN(c)?0:c,h=isNaN(h)?0:h;const u=i*c,d=i*h;return{previous:{x:r.x-u*(o.x-s.x),y:r.y-u*(o.y-s.y)},next:{x:r.x+d*(o.x-s.x),y:r.y+d*(o.y-s.y)}}}function RM(n,t,e){const i=n.length;let s,r,o,a,l,c=nr(n,0);for(let h=0;h<i-1;++h)if(l=c,c=nr(n,h+1),!(!l||!c)){if(Cr(t[h],0,AM)){e[h]=e[h+1]=0;continue}s=e[h]/t[h],r=e[h+1]/t[h],a=Math.pow(s,2)+Math.pow(r,2),!(a<=9)&&(o=3/Math.sqrt(a),e[h]=s*o*t[h],e[h+1]=r*o*t[h])}}function PM(n,t,e="x"){const i=uf(e),s=n.length;let r,o,a,l=nr(n,0);for(let c=0;c<s;++c){if(o=a,a=l,l=nr(n,c+1),!a)continue;const h=a[e],u=a[i];o&&(r=(h-o[e])/3,a[`cp1${e}`]=h-r,a[`cp1${i}`]=u-r*t[c]),l&&(r=(l[e]-h)/3,a[`cp2${e}`]=h+r,a[`cp2${i}`]=u+r*t[c])}}function LM(n,t="x"){const e=uf(t),i=n.length,s=Array(i).fill(0),r=Array(i);let o,a,l,c=nr(n,0);for(o=0;o<i;++o)if(a=l,l=c,c=nr(n,o+1),!!l){if(c){const h=c[t]-l[t];s[o]=h!==0?(c[e]-l[e])/h:0}r[o]=a?c?Wn(s[o-1])!==Wn(s[o])?0:(s[o-1]+s[o])/2:s[o-1]:s[o]}RM(n,s,r),PM(n,r,t)}function oa(n,t,e){return Math.max(Math.min(n,e),t)}function DM(n,t){let e,i,s,r,o,a=mi(n[0],t);for(e=0,i=n.length;e<i;++e)o=r,r=a,a=e<i-1&&mi(n[e+1],t),r&&(s=n[e],o&&(s.cp1x=oa(s.cp1x,t.left,t.right),s.cp1y=oa(s.cp1y,t.top,t.bottom)),a&&(s.cp2x=oa(s.cp2x,t.left,t.right),s.cp2y=oa(s.cp2y,t.top,t.bottom)))}function IM(n,t,e,i,s){let r,o,a,l;if(t.spanGaps&&(n=n.filter(c=>!c.skip)),t.cubicInterpolationMode==="monotone")LM(n,s);else{let c=i?n[n.length-1]:n[0];for(r=0,o=n.length;r<o;++r)a=n[r],l=CM(c,a,n[Math.min(r+1,o-(i?0:1))%o],t.tension),a.cp1x=l.previous.x,a.cp1y=l.previous.y,a.cp2x=l.next.x,a.cp2y=l.next.y,c=a}t.capBezierPoints&&DM(n,e)}function hc(){return typeof window<"u"&&typeof document<"u"}function uc(n){let t=n.parentNode;return t&&t.toString()==="[object ShadowRoot]"&&(t=t.host),t}function aa(n,t,e){let i;return typeof n=="string"?(i=parseInt(n,10),n.indexOf("%")!==-1&&(i=i/100*t.parentNode[e])):i=n,i}const la=n=>n.ownerDocument.defaultView.getComputedStyle(n,null);function OM(n,t){return la(n).getPropertyValue(t)}const UM=["top","right","bottom","left"];function ls(n,t,e){const i={};e=e?"-"+e:"";for(let s=0;s<4;s++){const r=UM[s];i[r]=parseFloat(n[t+"-"+r+e])||0}return i.width=i.left+i.right,i.height=i.top+i.bottom,i}const FM=(n,t,e)=>(n>0||t>0)&&(!e||!e.shadowRoot);function NM(n,t){const e=n.touches,i=e&&e.length?e[0]:n,{offsetX:s,offsetY:r}=i;let o=!1,a,l;if(FM(s,r,n.target))a=s,l=r;else{const c=t.getBoundingClientRect();a=i.clientX-c.left,l=i.clientY-c.top,o=!0}return{x:a,y:l,box:o}}function cs(n,t){if("native"in n)return n;const{canvas:e,currentDevicePixelRatio:i}=t,s=la(e),r=s.boxSizing==="border-box",o=ls(s,"padding"),a=ls(s,"border","width"),{x:l,y:c,box:h}=NM(n,e),u=o.left+(h&&a.left),d=o.top+(h&&a.top);let{width:f,height:g}=t;return r&&(f-=o.width+a.width,g-=o.height+a.height),{x:Math.round((l-u)/f*e.width/i),y:Math.round((c-d)/g*e.height/i)}}function kM(n,t,e){let i,s;if(t===void 0||e===void 0){const r=uc(n);if(!r)t=n.clientWidth,e=n.clientHeight;else{const o=r.getBoundingClientRect(),a=la(r),l=ls(a,"border","width"),c=ls(a,"padding");t=o.width-c.width-l.width,e=o.height-c.height-l.height,i=aa(a.maxWidth,r,"clientWidth"),s=aa(a.maxHeight,r,"clientHeight")}}return{width:t,height:e,maxWidth:i||ta,maxHeight:s||ta}}const ca=n=>Math.round(n*10)/10;function BM(n,t,e,i){const s=la(n),r=ls(s,"margin"),o=aa(s.maxWidth,n,"clientWidth")||ta,a=aa(s.maxHeight,n,"clientHeight")||ta,l=kM(n,t,e);let{width:c,height:h}=l;if(s.boxSizing==="content-box"){const d=ls(s,"border","width"),f=ls(s,"padding");c-=f.width+d.width,h-=f.height+d.height}return c=Math.max(0,c-r.width),h=Math.max(0,i?c/i:h-r.height),c=ca(Math.min(c,o,l.maxWidth)),h=ca(Math.min(h,a,l.maxHeight)),c&&!h&&(h=ca(c/2)),(t!==void 0||e!==void 0)&&i&&l.height&&h>l.height&&(h=l.height,c=ca(Math.floor(h*i))),{width:c,height:h}}function df(n,t,e){const i=t||1,s=Math.floor(n.height*i),r=Math.floor(n.width*i);n.height=Math.floor(n.height),n.width=Math.floor(n.width);const o=n.canvas;return o.style&&(e||!o.style.height&&!o.style.width)&&(o.style.height=`${n.height}px`,o.style.width=`${n.width}px`),n.currentDevicePixelRatio!==i||o.height!==s||o.width!==r?(n.currentDevicePixelRatio=i,o.height=s,o.width=r,n.ctx.setTransform(i,0,0,i,0,0),!0):!1}const zM=(function(){let n=!1;try{const t={get passive(){return n=!0,!1}};hc()&&(window.addEventListener("test",null,t),window.removeEventListener("test",null,t))}catch{}return n})();function ff(n,t){const e=OM(n,t),i=e&&e.match(/^(\d+)(\.\d+)?px$/);return i?+i[1]:void 0}function hs(n,t,e,i){return{x:n.x+e*(t.x-n.x),y:n.y+e*(t.y-n.y)}}function HM(n,t,e,i){return{x:n.x+e*(t.x-n.x),y:i==="middle"?e<.5?n.y:t.y:i==="after"?e<1?n.y:t.y:e>0?t.y:n.y}}function VM(n,t,e,i){const s={x:n.cp2x,y:n.cp2y},r={x:t.cp1x,y:t.cp1y},o=hs(n,s,e),a=hs(s,r,e),l=hs(r,t,e),c=hs(o,a,e),h=hs(a,l,e);return hs(c,h,e)}const GM=function(n,t){return{x(e){return n+n+t-e},setWidth(e){t=e},textAlign(e){return e==="center"?e:e==="right"?"left":"right"},xPlus(e,i){return e-i},leftForLtr(e,i){return e-i}}},WM=function(){return{x(n){return n},setWidth(n){},textAlign(n){return n},xPlus(n,t){return n+t},leftForLtr(n,t){return n}}};function ir(n,t,e){return n?GM(t,e):WM()}function pf(n,t){let e,i;(t==="ltr"||t==="rtl")&&(e=n.canvas.style,i=[e.getPropertyValue("direction"),e.getPropertyPriority("direction")],e.setProperty("direction",t,"important"),n.prevTextDirection=i)}function mf(n,t){t!==void 0&&(delete n.prevTextDirection,n.canvas.style.setProperty("direction",t[0],t[1]))}function gf(n){return n==="angle"?{between:Rr,compare:Xb,normalize:_n}:{between:fi,compare:(t,e)=>t-e,normalize:t=>t}}function _f({start:n,end:t,count:e,loop:i,style:s}){return{start:n%e,end:t%e,loop:i&&(t-n+1)%e===0,style:s}}function XM(n,t,e){const{property:i,start:s,end:r}=e,{between:o,normalize:a}=gf(i),l=t.length;let{start:c,end:h,loop:u}=n,d,f;if(u){for(c+=l,h+=l,d=0,f=l;d<f&&o(a(t[c%l][i]),s,r);++d)c--,h--;c%=l,h%=l}return h<c&&(h+=l),{start:c,end:h,loop:u,style:n.style}}function xf(n,t,e){if(!e)return[n];const{property:i,start:s,end:r}=e,o=t.length,{compare:a,between:l,normalize:c}=gf(i),{start:h,end:u,loop:d,style:f}=XM(n,t,e),g=[];let _=!1,m=null,p,v,x;const y=()=>l(s,x,p)&&a(s,x)!==0,b=()=>a(r,p)===0||l(r,x,p),E=()=>_||y(),S=()=>!_||b();for(let C=h,M=h;C<=u;++C)v=t[C%o],!v.skip&&(p=c(v[i]),p!==x&&(_=l(p,s,r),m===null&&E()&&(m=a(p,s)===0?C:M),m!==null&&S()&&(g.push(_f({start:m,end:C,loop:d,count:o,style:f})),m=null),M=C,x=p));return m!==null&&g.push(_f({start:m,end:u,loop:d,count:o,style:f})),g}function vf(n,t){const e=[],i=n.segments;for(let s=0;s<i.length;s++){const r=xf(i[s],n.points,t);r.length&&e.push(...r)}return e}function jM(n,t,e,i){let s=0,r=t-1;if(e&&!i)for(;s<t&&!n[s].skip;)s++;for(;s<t&&n[s].skip;)s++;for(s%=t,e&&(r+=s);r>s&&n[r%t].skip;)r--;return r%=t,{start:s,end:r}}function YM(n,t,e,i){const s=n.length,r=[];let o=t,a=n[t],l;for(l=t+1;l<=e;++l){const c=n[l%s];c.skip||c.stop?a.skip||(i=!1,r.push({start:t%s,end:(l-1)%s,loop:i}),t=o=c.stop?l:null):(o=l,a.skip&&(t=l)),a=c}return o!==null&&r.push({start:t%s,end:o%s,loop:i}),r}function qM(n,t){const e=n.points,i=n.options.spanGaps,s=e.length;if(!s)return[];const r=!!n._loop,{start:o,end:a}=jM(e,s,r,i);if(i===!0)return bf(n,[{start:o,end:a,loop:r}],e,t);const l=a<o?a+s:a,c=!!n._fullLoop&&o===0&&a===s-1;return bf(n,YM(e,o,l,c),e,t)}function bf(n,t,e,i){return!i||!i.setContext||!e?t:$M(n,t,e,i)}function $M(n,t,e,i){const s=n._chart.getContext(),r=Mf(n.options),{_datasetIndex:o,options:{spanGaps:a}}=n,l=e.length,c=[];let h=r,u=t[0].start,d=u;function f(g,_,m,p){const v=a?-1:1;if(g!==_){for(g+=l;e[g%l].skip;)g-=v;for(;e[_%l].skip;)_+=v;g%l!==_%l&&(c.push({start:g%l,end:_%l,loop:m,style:p}),h=p,u=_%l)}}for(const g of t){u=a?u:g.start;let _=e[u%l],m;for(d=u+1;d<=g.end;d++){const p=e[d%l];m=Mf(i.setContext(Bi(s,{type:"segment",p0:_,p1:p,p0DataIndex:(d-1)%l,p1DataIndex:d%l,datasetIndex:o}))),KM(m,h)&&f(u,d-1,g.loop,h),_=p,h=m}u<d-1&&f(u,d-1,g.loop,h)}return c}function Mf(n){return{backgroundColor:n.backgroundColor,borderCapStyle:n.borderCapStyle,borderDash:n.borderDash,borderDashOffset:n.borderDashOffset,borderJoinStyle:n.borderJoinStyle,borderWidth:n.borderWidth,borderColor:n.borderColor}}function KM(n,t){if(!t)return!1;const e=[],i=function(s,r){return ec(r)?(e.includes(r)||e.push(r),e.indexOf(r)):r};return JSON.stringify(n,i)!==JSON.stringify(t,i)}/*!
 * Chart.js v4.4.1
 * https://www.chartjs.org
 * (c) 2023 Chart.js Contributors
 * Released under the MIT License
 */class ZM{constructor(){this._request=null,this._charts=new Map,this._running=!1,this._lastDate=void 0}_notify(t,e,i,s){const r=e.listeners[s],o=e.duration;r.forEach(a=>a({chart:t,initial:e.initial,numSteps:o,currentStep:Math.min(i-e.start,o)}))}_refresh(){this._request||(this._running=!0,this._request=Xd.call(window,()=>{this._update(),this._request=null,this._running&&this._refresh()}))}_update(t=Date.now()){let e=0;this._charts.forEach((i,s)=>{if(!i.running||!i.items.length)return;const r=i.items;let o=r.length-1,a=!1,l;for(;o>=0;--o)l=r[o],l._active?(l._total>i.duration&&(i.duration=l._total),l.tick(t),a=!0):(r[o]=r[r.length-1],r.pop());a&&(s.draw(),this._notify(s,i,t,"progress")),r.length||(i.running=!1,this._notify(s,i,t,"complete"),i.initial=!1),e+=r.length}),this._lastDate=t,e===0&&(this._running=!1)}_getAnims(t){const e=this._charts;let i=e.get(t);return i||(i={running:!1,initial:!0,items:[],listeners:{complete:[],progress:[]}},e.set(t,i)),i}listen(t,e,i){this._getAnims(t).listeners[e].push(i)}add(t,e){!e||!e.length||this._getAnims(t).items.push(...e)}has(t){return this._getAnims(t).items.length>0}start(t){const e=this._charts.get(t);e&&(e.running=!0,e.start=Date.now(),e.duration=e.items.reduce((i,s)=>Math.max(i,s._duration),0),this._refresh())}running(t){if(!this._running)return!1;const e=this._charts.get(t);return!(!e||!e.running||!e.items.length)}stop(t){const e=this._charts.get(t);if(!e||!e.items.length)return;const i=e.items;let s=i.length-1;for(;s>=0;--s)i[s].cancel();e.items=[],this._notify(t,e,Date.now(),"complete")}remove(t){return this._charts.delete(t)}}var gi=new ZM;const yf="transparent",JM={boolean(n,t,e){return e>.5?t:n},color(n,t,e){const i=Zd(n||yf),s=i.valid&&Zd(t||yf);return s&&s.valid?s.mix(i,e).hexString():t},number(n,t,e){return n+(t-n)*e}};class QM{constructor(t,e,i,s){const r=e[i];s=Or([t.to,s,r,t.from]);const o=Or([t.from,r,s]);this._active=!0,this._fn=t.fn||JM[t.type||typeof o],this._easing=Pr[t.easing]||Pr.linear,this._start=Math.floor(Date.now()+(t.delay||0)),this._duration=this._total=Math.floor(t.duration),this._loop=!!t.loop,this._target=e,this._prop=i,this._from=o,this._to=s,this._promises=void 0}active(){return this._active}update(t,e,i){if(this._active){this._notify(!1);const s=this._target[this._prop],r=i-this._start,o=this._duration-r;this._start=i,this._duration=Math.floor(Math.max(o,t.duration)),this._total+=r,this._loop=!!t.loop,this._to=Or([t.to,e,s,t.from]),this._from=Or([t.from,s,e])}}cancel(){this._active&&(this.tick(Date.now()),this._active=!1,this._notify(!1))}tick(t){const e=t-this._start,i=this._duration,s=this._prop,r=this._from,o=this._loop,a=this._to;let l;if(this._active=r!==a&&(o||e<i),!this._active){this._target[s]=a,this._notify(!0);return}if(e<0){this._target[s]=r;return}l=e/i%2,l=o&&l>1?2-l:l,l=this._easing(Math.min(1,Math.max(0,l))),this._target[s]=this._fn(r,a,l)}wait(){const t=this._promises||(this._promises=[]);return new Promise((e,i)=>{t.push({res:e,rej:i})})}_notify(t){const e=t?"res":"rej",i=this._promises||[];for(let s=0;s<i.length;s++)i[s][e]()}}class Sf{constructor(t,e){this._chart=t,this._properties=new Map,this.configure(e)}configure(t){if(!Zt(t))return;const e=Object.keys(Me.animation),i=this._properties;Object.getOwnPropertyNames(t).forEach(s=>{const r=t[s];if(!Zt(r))return;const o={};for(const a of e)o[a]=r[a];(_e(r.properties)&&r.properties||[s]).forEach(a=>{(a===s||!i.has(a))&&i.set(a,o)})})}_animateOptions(t,e){const i=e.options,s=ey(t,i);if(!s)return[];const r=this._createAnimations(s,i);return i.$shared&&ty(t.options.$animations,i).then(()=>{t.options=i},()=>{}),r}_createAnimations(t,e){const i=this._properties,s=[],r=t.$animations||(t.$animations={}),o=Object.keys(e),a=Date.now();let l;for(l=o.length-1;l>=0;--l){const c=o[l];if(c.charAt(0)==="$")continue;if(c==="options"){s.push(...this._animateOptions(t,e));continue}const h=e[c];let u=r[c];const d=i.get(c);if(u)if(d&&u.active()){u.update(d,h,a);continue}else u.cancel();if(!d||!d.duration){t[c]=h;continue}r[c]=u=new QM(d,t,c,h),s.push(u)}return s}update(t,e){if(this._properties.size===0){Object.assign(t,e);return}const i=this._createAnimations(t,e);if(i.length)return gi.add(this._chart,i),!0}}function ty(n,t){const e=[],i=Object.keys(t);for(let s=0;s<i.length;s++){const r=n[i[s]];r&&r.active()&&e.push(r.wait())}return Promise.all(e)}function ey(n,t){if(!t)return;let e=n.options;if(!e){n.options=t;return}return e.$shared&&(n.options=e=Object.assign({},e,{$shared:!1,$animations:{}})),e}function Ef(n,t){const e=n&&n.options||{},i=e.reverse,s=e.min===void 0?t:0,r=e.max===void 0?t:0;return{start:i?r:s,end:i?s:r}}function ny(n,t,e){if(e===!1)return!1;const i=Ef(n,e),s=Ef(t,e);return{top:s.end,right:i.end,bottom:s.start,left:i.start}}function iy(n){let t,e,i,s;return Zt(n)?(t=n.top,e=n.right,i=n.bottom,s=n.left):t=e=i=s=n,{top:t,right:e,bottom:i,left:s,disabled:n===!1}}function Tf(n,t){const e=[],i=n._getSortedDatasetMetas(t);let s,r;for(s=0,r=i.length;s<r;++s)e.push(i[s].index);return e}function wf(n,t,e,i={}){const s=n.keys,r=i.mode==="single";let o,a,l,c;if(t!==null){for(o=0,a=s.length;o<a;++o){if(l=+s[o],l===e){if(i.all)continue;break}c=n.values[l],be(c)&&(r||t===0||Wn(t)===Wn(c))&&(t+=c)}return t}}function sy(n){const t=Object.keys(n),e=new Array(t.length);let i,s,r;for(i=0,s=t.length;i<s;++i)r=t[i],e[i]={x:r,y:n[r]};return e}function Af(n,t){const e=n&&n.options.stacked;return e||e===void 0&&t.stack!==void 0}function ry(n,t,e){return`${n.id}.${t.id}.${e.stack||e.type}`}function oy(n){const{min:t,max:e,minDefined:i,maxDefined:s}=n.getUserBounds();return{min:i?t:Number.NEGATIVE_INFINITY,max:s?e:Number.POSITIVE_INFINITY}}function ay(n,t,e){const i=n[t]||(n[t]={});return i[e]||(i[e]={})}function Cf(n,t,e,i){for(const s of t.getMatchingVisibleMetas(i).reverse()){const r=n[s.index];if(e&&r>0||!e&&r<0)return s.index}return null}function Rf(n,t){const{chart:e,_cachedMeta:i}=n,s=e._stacks||(e._stacks={}),{iScale:r,vScale:o,index:a}=i,l=r.axis,c=o.axis,h=ry(r,o,i),u=t.length;let d;for(let f=0;f<u;++f){const g=t[f],{[l]:_,[c]:m}=g,p=g._stacks||(g._stacks={});d=p[c]=ay(s,h,_),d[a]=m,d._top=Cf(d,o,!0,i.type),d._bottom=Cf(d,o,!1,i.type);const v=d._visualValues||(d._visualValues={});v[a]=m}}function dc(n,t){const e=n.scales;return Object.keys(e).filter(i=>e[i].axis===t).shift()}function ly(n,t){return Bi(n,{active:!1,dataset:void 0,datasetIndex:t,index:t,mode:"default",type:"dataset"})}function cy(n,t,e){return Bi(n,{active:!1,dataIndex:t,parsed:void 0,raw:void 0,element:e,index:t,mode:"default",type:"data"})}function Ur(n,t){const e=n.controller.index,i=n.vScale&&n.vScale.axis;if(i){t=t||n._parsed;for(const s of t){const r=s._stacks;if(!r||r[i]===void 0||r[i][e]===void 0)return;delete r[i][e],r[i]._visualValues!==void 0&&r[i]._visualValues[e]!==void 0&&delete r[i]._visualValues[e]}}}const fc=n=>n==="reset"||n==="none",Pf=(n,t)=>t?n:Object.assign({},n),hy=(n,t,e)=>n&&!t.hidden&&t._stacked&&{keys:Tf(e,!0),values:null};class Bn{constructor(t,e){this.chart=t,this._ctx=t.ctx,this.index=e,this._cachedDataOpts={},this._cachedMeta=this.getMeta(),this._type=this._cachedMeta.type,this.options=void 0,this._parsing=!1,this._data=void 0,this._objectData=void 0,this._sharedOptions=void 0,this._drawStart=void 0,this._drawCount=void 0,this.enableOptionSharing=!1,this.supportsDecimation=!1,this.$context=void 0,this._syncList=[],this.datasetElementType=new.target.datasetElementType,this.dataElementType=new.target.dataElementType,this.initialize()}initialize(){const t=this._cachedMeta;this.configure(),this.linkScales(),t._stacked=Af(t.vScale,t),this.addElements(),this.options.fill&&!this.chart.isPluginEnabled("filler")&&console.warn("Tried to use the 'fill' option without the 'Filler' plugin enabled. Please import and register the 'Filler' plugin and make sure it is not disabled in the options")}updateIndex(t){this.index!==t&&Ur(this._cachedMeta),this.index=t}linkScales(){const t=this.chart,e=this._cachedMeta,i=this.getDataset(),s=(u,d,f,g)=>u==="x"?d:u==="r"?g:f,r=e.xAxisID=kt(i.xAxisID,dc(t,"x")),o=e.yAxisID=kt(i.yAxisID,dc(t,"y")),a=e.rAxisID=kt(i.rAxisID,dc(t,"r")),l=e.indexAxis,c=e.iAxisID=s(l,r,o,a),h=e.vAxisID=s(l,o,r,a);e.xScale=this.getScaleForId(r),e.yScale=this.getScaleForId(o),e.rScale=this.getScaleForId(a),e.iScale=this.getScaleForId(c),e.vScale=this.getScaleForId(h)}getDataset(){return this.chart.data.datasets[this.index]}getMeta(){return this.chart.getDatasetMeta(this.index)}getScaleForId(t){return this.chart.scales[t]}_getOtherScale(t){const e=this._cachedMeta;return t===e.iScale?e.vScale:e.iScale}reset(){this._update("reset")}_destroy(){const t=this._cachedMeta;this._data&&Gd(this._data,this),t._stacked&&Ur(t)}_dataCheck(){const t=this.getDataset(),e=t.data||(t.data=[]),i=this._data;if(Zt(e))this._data=sy(e);else if(i!==e){if(i){Gd(i,this);const s=this._cachedMeta;Ur(s),s._parsed=[]}e&&Object.isExtensible(e)&&$b(e,this),this._syncList=[],this._data=e}}addElements(){const t=this._cachedMeta;this._dataCheck(),this.datasetElementType&&(t.dataset=new this.datasetElementType)}buildOrUpdateElements(t){const e=this._cachedMeta,i=this.getDataset();let s=!1;this._dataCheck();const r=e._stacked;e._stacked=Af(e.vScale,e),e.stack!==i.stack&&(s=!0,Ur(e),e.stack=i.stack),this._resyncElements(t),(s||r!==e._stacked)&&Rf(this,e._parsed)}configure(){const t=this.chart.config,e=t.datasetScopeKeys(this._type),i=t.getOptionScopes(this.getDataset(),e,!0);this.options=t.createResolver(i,this.getContext()),this._parsing=this.options.parsing,this._cachedDataOpts={}}parse(t,e){const{_cachedMeta:i,_data:s}=this,{iScale:r,_stacked:o}=i,a=r.axis;let l=t===0&&e===s.length?!0:i._sorted,c=t>0&&i._parsed[t-1],h,u,d;if(this._parsing===!1)i._parsed=s,i._sorted=!0,d=s;else{_e(s[t])?d=this.parseArrayData(i,s,t,e):Zt(s[t])?d=this.parseObjectData(i,s,t,e):d=this.parsePrimitiveData(i,s,t,e);const f=()=>u[a]===null||c&&u[a]<c[a];for(h=0;h<e;++h)i._parsed[h+t]=u=d[h],l&&(f()&&(l=!1),c=u);i._sorted=l}o&&Rf(this,d)}parsePrimitiveData(t,e,i,s){const{iScale:r,vScale:o}=t,a=r.axis,l=o.axis,c=r.getLabels(),h=r===o,u=new Array(s);let d,f,g;for(d=0,f=s;d<f;++d)g=d+i,u[d]={[a]:h||r.parse(c[g],g),[l]:o.parse(e[g],g)};return u}parseArrayData(t,e,i,s){const{xScale:r,yScale:o}=t,a=new Array(s);let l,c,h,u;for(l=0,c=s;l<c;++l)h=l+i,u=e[h],a[l]={x:r.parse(u[0],h),y:o.parse(u[1],h)};return a}parseObjectData(t,e,i,s){const{xScale:r,yScale:o}=t,{xAxisKey:a="x",yAxisKey:l="y"}=this._parsing,c=new Array(s);let h,u,d,f;for(h=0,u=s;h<u;++h)d=h+i,f=e[d],c[h]={x:r.parse(Fi(f,a),d),y:o.parse(Fi(f,l),d)};return c}getParsed(t){return this._cachedMeta._parsed[t]}getDataElement(t){return this._cachedMeta.data[t]}applyStack(t,e,i){const s=this.chart,r=this._cachedMeta,o=e[t.axis],a={keys:Tf(s,!0),values:e._stacks[t.axis]._visualValues};return wf(a,o,r.index,{mode:i})}updateRangeFromParsed(t,e,i,s){const r=i[e.axis];let o=r===null?NaN:r;const a=s&&i._stacks[e.axis];s&&a&&(s.values=a,o=wf(s,r,this._cachedMeta.index)),t.min=Math.min(t.min,o),t.max=Math.max(t.max,o)}getMinMax(t,e){const i=this._cachedMeta,s=i._parsed,r=i._sorted&&t===i.iScale,o=s.length,a=this._getOtherScale(t),l=hy(e,i,this.chart),c={min:Number.POSITIVE_INFINITY,max:Number.NEGATIVE_INFINITY},{min:h,max:u}=oy(a);let d,f;function g(){f=s[d];const _=f[a.axis];return!be(f[t.axis])||h>_||u<_}for(d=0;d<o&&!(!g()&&(this.updateRangeFromParsed(c,t,f,l),r));++d);if(r){for(d=o-1;d>=0;--d)if(!g()){this.updateRangeFromParsed(c,t,f,l);break}}return c}getAllParsedValues(t){const e=this._cachedMeta._parsed,i=[];let s,r,o;for(s=0,r=e.length;s<r;++s)o=e[s][t.axis],be(o)&&i.push(o);return i}getMaxOverflow(){return!1}getLabelAndValue(t){const e=this._cachedMeta,i=e.iScale,s=e.vScale,r=this.getParsed(t);return{label:i?""+i.getLabelForValue(r[i.axis]):"",value:s?""+s.getLabelForValue(r[s.axis]):""}}_update(t){const e=this._cachedMeta;this.update(t||"default"),e._clip=iy(kt(this.options.clip,ny(e.xScale,e.yScale,this.getMaxOverflow())))}update(t){}draw(){const t=this._ctx,e=this.chart,i=this._cachedMeta,s=i.data||[],r=e.chartArea,o=[],a=this._drawStart||0,l=this._drawCount||s.length-a,c=this.options.drawActiveElementsOnTop;let h;for(i.dataset&&i.dataset.draw(t,r,a,l),h=a;h<a+l;++h){const u=s[h];u.hidden||(u.active&&c?o.push(u):u.draw(t,r))}for(h=0;h<o.length;++h)o[h].draw(t,r)}getStyle(t,e){const i=e?"active":"default";return t===void 0&&this._cachedMeta.dataset?this.resolveDatasetElementOptions(i):this.resolveDataElementOptions(t||0,i)}getContext(t,e,i){const s=this.getDataset();let r;if(t>=0&&t<this._cachedMeta.data.length){const o=this._cachedMeta.data[t];r=o.$context||(o.$context=cy(this.getContext(),t,o)),r.parsed=this.getParsed(t),r.raw=s.data[t],r.index=r.dataIndex=t}else r=this.$context||(this.$context=ly(this.chart.getContext(),this.index)),r.dataset=s,r.index=r.datasetIndex=this.index;return r.active=!!e,r.mode=i,r}resolveDatasetElementOptions(t){return this._resolveElementOptions(this.datasetElementType.id,t)}resolveDataElementOptions(t,e){return this._resolveElementOptions(this.dataElementType.id,e,t)}_resolveElementOptions(t,e="default",i){const s=e==="active",r=this._cachedDataOpts,o=t+"-"+e,a=r[o],l=this.enableOptionSharing&&Ar(i);if(a)return Pf(a,l);const c=this.chart.config,h=c.datasetElementScopeKeys(this._type,t),u=s?[`${t}Hover`,"hover",t,""]:[t,""],d=c.getOptionScopes(this.getDataset(),h),f=Object.keys(Me.elements[t]),g=()=>this.getContext(i,s,e),_=c.resolveNamedOptions(d,f,g,u);return _.$shared&&(_.$shared=l,r[o]=Object.freeze(Pf(_,l))),_}_resolveAnimations(t,e,i){const s=this.chart,r=this._cachedDataOpts,o=`animation-${e}`,a=r[o];if(a)return a;let l;if(s.options.animation!==!1){const h=this.chart.config,u=h.datasetAnimationScopeKeys(this._type,e),d=h.getOptionScopes(this.getDataset(),u);l=h.createResolver(d,this.getContext(t,i,e))}const c=new Sf(s,l&&l.animations);return l&&l._cacheable&&(r[o]=Object.freeze(c)),c}getSharedOptions(t){if(t.$shared)return this._sharedOptions||(this._sharedOptions=Object.assign({},t))}includeOptions(t,e){return!e||fc(t)||this.chart._animationsDisabled}_getSharedOptions(t,e){const i=this.resolveDataElementOptions(t,e),s=this._sharedOptions,r=this.getSharedOptions(i),o=this.includeOptions(e,r)||r!==s;return this.updateSharedOptions(r,e,i),{sharedOptions:r,includeOptions:o}}updateElement(t,e,i,s){fc(s)?Object.assign(t,i):this._resolveAnimations(e,s).update(t,i)}updateSharedOptions(t,e,i){t&&!fc(e)&&this._resolveAnimations(void 0,e).update(t,i)}_setStyle(t,e,i,s){t.active=s;const r=this.getStyle(e,s);this._resolveAnimations(e,i,s).update(t,{options:!s&&this.getSharedOptions(r)||r})}removeHoverStyle(t,e,i){this._setStyle(t,i,"active",!1)}setHoverStyle(t,e,i){this._setStyle(t,i,"active",!0)}_removeDatasetHoverStyle(){const t=this._cachedMeta.dataset;t&&this._setStyle(t,void 0,"active",!1)}_setDatasetHoverStyle(){const t=this._cachedMeta.dataset;t&&this._setStyle(t,void 0,"active",!0)}_resyncElements(t){const e=this._data,i=this._cachedMeta.data;for(const[a,l,c]of this._syncList)this[a](l,c);this._syncList=[];const s=i.length,r=e.length,o=Math.min(r,s);o&&this.parse(0,o),r>s?this._insertElements(s,r-s,t):r<s&&this._removeElements(r,s-r)}_insertElements(t,e,i=!0){const s=this._cachedMeta,r=s.data,o=t+e;let a;const l=c=>{for(c.length+=e,a=c.length-1;a>=o;a--)c[a]=c[a-e]};for(l(r),a=t;a<o;++a)r[a]=new this.dataElementType;this._parsing&&l(s._parsed),this.parse(t,e),i&&this.updateElements(r,t,e,"reset")}updateElements(t,e,i,s){}_removeElements(t,e){const i=this._cachedMeta;if(this._parsing){const s=i._parsed.splice(t,e);i._stacked&&Ur(i,s)}i.data.splice(t,e)}_sync(t){if(this._parsing)this._syncList.push(t);else{const[e,i,s]=t;this[e](i,s)}this.chart._dataChanges.push([this.index,...t])}_onDataPush(){const t=arguments.length;this._sync(["_insertElements",this.getDataset().data.length-t,t])}_onDataPop(){this._sync(["_removeElements",this._cachedMeta.data.length-1,1])}_onDataShift(){this._sync(["_removeElements",0,1])}_onDataSplice(t,e){e&&this._sync(["_removeElements",t,e]);const i=arguments.length-2;i&&this._sync(["_insertElements",t,i])}_onDataUnshift(){this._sync(["_insertElements",0,arguments.length])}}ut(Bn,"defaults",{}),ut(Bn,"datasetElementType",null),ut(Bn,"dataElementType",null);function uy(n,t){if(!n._cache.$bar){const e=n.getMatchingVisibleMetas(t);let i=[];for(let s=0,r=e.length;s<r;s++)i=i.concat(e[s].controller.getAllParsedValues(n));n._cache.$bar=Wd(i.sort((s,r)=>s-r))}return n._cache.$bar}function dy(n){const t=n.iScale,e=uy(t,n.type);let i=t._length,s,r,o,a;const l=()=>{o===32767||o===-32768||(Ar(a)&&(i=Math.min(i,Math.abs(o-a)||i)),a=o)};for(s=0,r=e.length;s<r;++s)o=t.getPixelForValue(e[s]),l();for(a=void 0,s=0,r=t.ticks.length;s<r;++s)o=t.getPixelForTick(s),l();return i}function fy(n,t,e,i){const s=e.barThickness;let r,o;return ee(s)?(r=t.min*e.categoryPercentage,o=e.barPercentage):(r=s*i,o=1),{chunk:r/i,ratio:o,start:t.pixels[n]-r/2}}function py(n,t,e,i){const s=t.pixels,r=s[n];let o=n>0?s[n-1]:null,a=n<s.length-1?s[n+1]:null;const l=e.categoryPercentage;o===null&&(o=r-(a===null?t.end-t.start:a-r)),a===null&&(a=r+r-o);const c=r-(r-Math.min(o,a))/2*l;return{chunk:Math.abs(a-o)/2*l/i,ratio:e.barPercentage,start:c}}function my(n,t,e,i){const s=e.parse(n[0],i),r=e.parse(n[1],i),o=Math.min(s,r),a=Math.max(s,r);let l=o,c=a;Math.abs(o)>Math.abs(a)&&(l=a,c=o),t[e.axis]=c,t._custom={barStart:l,barEnd:c,start:s,end:r,min:o,max:a}}function Lf(n,t,e,i){return _e(n)?my(n,t,e,i):t[e.axis]=e.parse(n,i),t}function Df(n,t,e,i){const s=n.iScale,r=n.vScale,o=s.getLabels(),a=s===r,l=[];let c,h,u,d;for(c=e,h=e+i;c<h;++c)d=t[c],u={},u[s.axis]=a||s.parse(o[c],c),l.push(Lf(d,u,r,c));return l}function pc(n){return n&&n.barStart!==void 0&&n.barEnd!==void 0}function gy(n,t,e){return n!==0?Wn(n):(t.isHorizontal()?1:-1)*(t.min>=e?1:-1)}function _y(n){let t,e,i,s,r;return n.horizontal?(t=n.base>n.x,e="left",i="right"):(t=n.base<n.y,e="bottom",i="top"),t?(s="end",r="start"):(s="start",r="end"),{start:e,end:i,reverse:t,top:s,bottom:r}}function xy(n,t,e,i){let s=t.borderSkipped;const r={};if(!s){n.borderSkipped=r;return}if(s===!0){n.borderSkipped={top:!0,right:!0,bottom:!0,left:!0};return}const{start:o,end:a,reverse:l,top:c,bottom:h}=_y(n);s==="middle"&&e&&(n.enableBorderRadius=!0,(e._top||0)===i?s=c:(e._bottom||0)===i?s=h:(r[If(h,o,a,l)]=!0,s=c)),r[If(s,o,a,l)]=!0,n.borderSkipped=r}function If(n,t,e,i){return i?(n=vy(n,t,e),n=Of(n,e,t)):n=Of(n,t,e),n}function vy(n,t,e){return n===t?e:n===e?t:n}function Of(n,t,e){return n==="start"?t:n==="end"?e:n}function by(n,{inflateAmount:t},e){n.inflateAmount=t==="auto"?e===1?.33:0:t}class ha extends Bn{parsePrimitiveData(t,e,i,s){return Df(t,e,i,s)}parseArrayData(t,e,i,s){return Df(t,e,i,s)}parseObjectData(t,e,i,s){const{iScale:r,vScale:o}=t,{xAxisKey:a="x",yAxisKey:l="y"}=this._parsing,c=r.axis==="x"?a:l,h=o.axis==="x"?a:l,u=[];let d,f,g,_;for(d=i,f=i+s;d<f;++d)_=e[d],g={},g[r.axis]=r.parse(Fi(_,c),d),u.push(Lf(Fi(_,h),g,o,d));return u}updateRangeFromParsed(t,e,i,s){super.updateRangeFromParsed(t,e,i,s);const r=i._custom;r&&e===this._cachedMeta.vScale&&(t.min=Math.min(t.min,r.min),t.max=Math.max(t.max,r.max))}getMaxOverflow(){return 0}getLabelAndValue(t){const e=this._cachedMeta,{iScale:i,vScale:s}=e,r=this.getParsed(t),o=r._custom,a=pc(o)?"["+o.start+", "+o.end+"]":""+s.getLabelForValue(r[s.axis]);return{label:""+i.getLabelForValue(r[i.axis]),value:a}}initialize(){this.enableOptionSharing=!0,super.initialize();const t=this._cachedMeta;t.stack=this.getDataset().stack}update(t){const e=this._cachedMeta;this.updateElements(e.data,0,e.data.length,t)}updateElements(t,e,i,s){const r=s==="reset",{index:o,_cachedMeta:{vScale:a}}=this,l=a.getBasePixel(),c=a.isHorizontal(),h=this._getRuler(),{sharedOptions:u,includeOptions:d}=this._getSharedOptions(e,s);for(let f=e;f<e+i;f++){const g=this.getParsed(f),_=r||ee(g[a.axis])?{base:l,head:l}:this._calculateBarValuePixels(f),m=this._calculateBarIndexPixels(f,h),p=(g._stacks||{})[a.axis],v={horizontal:c,base:_.base,enableBorderRadius:!p||pc(g._custom)||o===p._top||o===p._bottom,x:c?_.head:m.center,y:c?m.center:_.head,height:c?m.size:Math.abs(_.size),width:c?Math.abs(_.size):m.size};d&&(v.options=u||this.resolveDataElementOptions(f,t[f].active?"active":s));const x=v.options||t[f].options;xy(v,x,p,o),by(v,x,h.ratio),this.updateElement(t[f],f,v,s)}}_getStacks(t,e){const{iScale:i}=this._cachedMeta,s=i.getMatchingVisibleMetas(this._type).filter(l=>l.controller.options.grouped),r=i.options.stacked,o=[],a=l=>{const c=l.controller.getParsed(e),h=c&&c[l.vScale.axis];if(ee(h)||isNaN(h))return!0};for(const l of s)if(!(e!==void 0&&a(l))&&((r===!1||o.indexOf(l.stack)===-1||r===void 0&&l.stack===void 0)&&o.push(l.stack),l.index===t))break;return o.length||o.push(void 0),o}_getStackCount(t){return this._getStacks(void 0,t).length}_getStackIndex(t,e,i){const s=this._getStacks(t,i),r=e!==void 0?s.indexOf(e):-1;return r===-1?s.length-1:r}_getRuler(){const t=this.options,e=this._cachedMeta,i=e.iScale,s=[];let r,o;for(r=0,o=e.data.length;r<o;++r)s.push(i.getPixelForValue(this.getParsed(r)[i.axis],r));const a=t.barThickness;return{min:a||dy(e),pixels:s,start:i._startPixel,end:i._endPixel,stackCount:this._getStackCount(),scale:i,grouped:t.grouped,ratio:a?1:t.categoryPercentage*t.barPercentage}}_calculateBarValuePixels(t){const{_cachedMeta:{vScale:e,_stacked:i,index:s},options:{base:r,minBarLength:o}}=this,a=r||0,l=this.getParsed(t),c=l._custom,h=pc(c);let u=l[e.axis],d=0,f=i?this.applyStack(e,l,i):u,g,_;f!==u&&(d=f-u,f=u),h&&(u=c.barStart,f=c.barEnd-c.barStart,u!==0&&Wn(u)!==Wn(c.barEnd)&&(d=0),d+=u);const m=!ee(r)&&!h?r:d;let p=e.getPixelForValue(m);if(this.chart.getDataVisibility(t)?g=e.getPixelForValue(d+f):g=p,_=g-p,Math.abs(_)<o){_=gy(_,e,a)*o,u===a&&(p-=_/2);const v=e.getPixelForDecimal(0),x=e.getPixelForDecimal(1),y=Math.min(v,x),b=Math.max(v,x);p=Math.max(Math.min(p,b),y),g=p+_,i&&!h&&(l._stacks[e.axis]._visualValues[s]=e.getValueForPixel(g)-e.getValueForPixel(p))}if(p===e.getPixelForValue(a)){const v=Wn(_)*e.getLineWidthForValue(a)/2;p+=v,_-=v}return{size:_,base:p,head:g,center:g+_/2}}_calculateBarIndexPixels(t,e){const i=e.scale,s=this.options,r=s.skipNull,o=kt(s.maxBarThickness,1/0);let a,l;if(e.grouped){const c=r?this._getStackCount(t):e.stackCount,h=s.barThickness==="flex"?py(t,e,s,c):fy(t,e,s,c),u=this._getStackIndex(this.index,this._cachedMeta.stack,r?t:void 0);a=h.start+h.chunk*u+h.chunk/2,l=Math.min(o,h.chunk*h.ratio)}else a=i.getPixelForValue(this.getParsed(t)[i.axis],t),l=Math.min(o,e.min*e.ratio);return{base:a-l/2,head:a+l/2,center:a,size:l}}draw(){const t=this._cachedMeta,e=t.vScale,i=t.data,s=i.length;let r=0;for(;r<s;++r)this.getParsed(r)[e.axis]!==null&&i[r].draw(this._ctx)}}ut(ha,"id","bar"),ut(ha,"defaults",{datasetElementType:!1,dataElementType:"bar",categoryPercentage:.8,barPercentage:.9,grouped:!0,animations:{numbers:{type:"number",properties:["x","y","base","width","height"]}}}),ut(ha,"overrides",{scales:{_index_:{type:"category",offset:!0,grid:{offset:!0}},_value_:{type:"linear",beginAtZero:!0}}});class ua extends Bn{initialize(){this.enableOptionSharing=!0,super.initialize()}parsePrimitiveData(t,e,i,s){const r=super.parsePrimitiveData(t,e,i,s);for(let o=0;o<r.length;o++)r[o]._custom=this.resolveDataElementOptions(o+i).radius;return r}parseArrayData(t,e,i,s){const r=super.parseArrayData(t,e,i,s);for(let o=0;o<r.length;o++){const a=e[i+o];r[o]._custom=kt(a[2],this.resolveDataElementOptions(o+i).radius)}return r}parseObjectData(t,e,i,s){const r=super.parseObjectData(t,e,i,s);for(let o=0;o<r.length;o++){const a=e[i+o];r[o]._custom=kt(a&&a.r&&+a.r,this.resolveDataElementOptions(o+i).radius)}return r}getMaxOverflow(){const t=this._cachedMeta.data;let e=0;for(let i=t.length-1;i>=0;--i)e=Math.max(e,t[i].size(this.resolveDataElementOptions(i))/2);return e>0&&e}getLabelAndValue(t){const e=this._cachedMeta,i=this.chart.data.labels||[],{xScale:s,yScale:r}=e,o=this.getParsed(t),a=s.getLabelForValue(o.x),l=r.getLabelForValue(o.y),c=o._custom;return{label:i[t]||"",value:"("+a+", "+l+(c?", "+c:"")+")"}}update(t){const e=this._cachedMeta.data;this.updateElements(e,0,e.length,t)}updateElements(t,e,i,s){const r=s==="reset",{iScale:o,vScale:a}=this._cachedMeta,{sharedOptions:l,includeOptions:c}=this._getSharedOptions(e,s),h=o.axis,u=a.axis;for(let d=e;d<e+i;d++){const f=t[d],g=!r&&this.getParsed(d),_={},m=_[h]=r?o.getPixelForDecimal(.5):o.getPixelForValue(g[h]),p=_[u]=r?a.getBasePixel():a.getPixelForValue(g[u]);_.skip=isNaN(m)||isNaN(p),c&&(_.options=l||this.resolveDataElementOptions(d,f.active?"active":s),r&&(_.options.radius=0)),this.updateElement(f,d,_,s)}}resolveDataElementOptions(t,e){const i=this.getParsed(t);let s=super.resolveDataElementOptions(t,e);s.$shared&&(s=Object.assign({},s,{$shared:!1}));const r=s.radius;return e!=="active"&&(s.radius=0),s.radius+=kt(i&&i._custom,r),s}}ut(ua,"id","bubble"),ut(ua,"defaults",{datasetElementType:!1,dataElementType:"point",animations:{numbers:{type:"number",properties:["x","y","borderWidth","radius"]}}}),ut(ua,"overrides",{scales:{x:{type:"linear"},y:{type:"linear"}}});function My(n,t,e){let i=1,s=1,r=0,o=0;if(t<pe){const a=n,l=a+t,c=Math.cos(a),h=Math.sin(a),u=Math.cos(l),d=Math.sin(l),f=(x,y,b)=>Rr(x,a,l,!0)?1:Math.max(y,y*e,b,b*e),g=(x,y,b)=>Rr(x,a,l,!0)?-1:Math.min(y,y*e,b,b*e),_=f(0,c,u),m=f(Se,h,d),p=g(fe,c,u),v=g(fe+Se,h,d);i=(_-p)/2,s=(m-v)/2,r=-(_+p)/2,o=-(m+v)/2}return{ratioX:i,ratioY:s,offsetX:r,offsetY:o}}class us extends Bn{constructor(t,e){super(t,e),this.enableOptionSharing=!0,this.innerRadius=void 0,this.outerRadius=void 0,this.offsetX=void 0,this.offsetY=void 0}linkScales(){}parse(t,e){const i=this.getDataset().data,s=this._cachedMeta;if(this._parsing===!1)s._parsed=i;else{let r=l=>+i[l];if(Zt(i[t])){const{key:l="value"}=this._parsing;r=c=>+Fi(i[c],l)}let o,a;for(o=t,a=t+e;o<a;++o)s._parsed[o]=r(o)}}_getRotation(){return kn(this.options.rotation-90)}_getCircumference(){return kn(this.options.circumference)}_getRotationExtents(){let t=pe,e=-pe;for(let i=0;i<this.chart.data.datasets.length;++i)if(this.chart.isDatasetVisible(i)&&this.chart.getDatasetMeta(i).type===this._type){const s=this.chart.getDatasetMeta(i).controller,r=s._getRotation(),o=s._getCircumference();t=Math.min(t,r),e=Math.max(e,r+o)}return{rotation:t,circumference:e-t}}update(t){const e=this.chart,{chartArea:i}=e,s=this._cachedMeta,r=s.data,o=this.getMaxBorderWidth()+this.getMaxOffset(r)+this.options.spacing,a=Math.max((Math.min(i.width,i.height)-o)/2,0),l=Math.min(Ub(this.options.cutout,a),1),c=this._getRingWeight(this.index),{circumference:h,rotation:u}=this._getRotationExtents(),{ratioX:d,ratioY:f,offsetX:g,offsetY:_}=My(u,h,l),m=(i.width-o)/d,p=(i.height-o)/f,v=Math.max(Math.min(m,p)/2,0),x=Id(this.options.radius,v),y=Math.max(x*l,0),b=(x-y)/this._getVisibleDatasetWeightTotal();this.offsetX=g*x,this.offsetY=_*x,s.total=this.calculateTotal(),this.outerRadius=x-b*this._getRingWeightOffset(this.index),this.innerRadius=Math.max(this.outerRadius-b*c,0),this.updateElements(r,0,r.length,t)}_circumference(t,e){const i=this.options,s=this._cachedMeta,r=this._getCircumference();return e&&i.animation.animateRotate||!this.chart.getDataVisibility(t)||s._parsed[t]===null||s.data[t].hidden?0:this.calculateCircumference(s._parsed[t]*r/pe)}updateElements(t,e,i,s){const r=s==="reset",o=this.chart,a=o.chartArea,c=o.options.animation,h=(a.left+a.right)/2,u=(a.top+a.bottom)/2,d=r&&c.animateScale,f=d?0:this.innerRadius,g=d?0:this.outerRadius,{sharedOptions:_,includeOptions:m}=this._getSharedOptions(e,s);let p=this._getRotation(),v;for(v=0;v<e;++v)p+=this._circumference(v,r);for(v=e;v<e+i;++v){const x=this._circumference(v,r),y=t[v],b={x:h+this.offsetX,y:u+this.offsetY,startAngle:p,endAngle:p+x,circumference:x,outerRadius:g,innerRadius:f};m&&(b.options=_||this.resolveDataElementOptions(v,y.active?"active":s)),p+=x,this.updateElement(y,v,b,s)}}calculateTotal(){const t=this._cachedMeta,e=t.data;let i=0,s;for(s=0;s<e.length;s++){const r=t._parsed[s];r!==null&&!isNaN(r)&&this.chart.getDataVisibility(s)&&!e[s].hidden&&(i+=Math.abs(r))}return i}calculateCircumference(t){const e=this._cachedMeta.total;return e>0&&!isNaN(t)?pe*(Math.abs(t)/e):0}getLabelAndValue(t){const e=this._cachedMeta,i=this.chart,s=i.data.labels||[],r=Lr(e._parsed[t],i.options.locale);return{label:s[t]||"",value:r}}getMaxBorderWidth(t){let e=0;const i=this.chart;let s,r,o,a,l;if(!t){for(s=0,r=i.data.datasets.length;s<r;++s)if(i.isDatasetVisible(s)){o=i.getDatasetMeta(s),t=o.data,a=o.controller;break}}if(!t)return 0;for(s=0,r=t.length;s<r;++s)l=a.resolveDataElementOptions(s),l.borderAlign!=="inner"&&(e=Math.max(e,l.borderWidth||0,l.hoverBorderWidth||0));return e}getMaxOffset(t){let e=0;for(let i=0,s=t.length;i<s;++i){const r=this.resolveDataElementOptions(i);e=Math.max(e,r.offset||0,r.hoverOffset||0)}return e}_getRingWeightOffset(t){let e=0;for(let i=0;i<t;++i)this.chart.isDatasetVisible(i)&&(e+=this._getRingWeight(i));return e}_getRingWeight(t){return Math.max(kt(this.chart.data.datasets[t].weight,1),0)}_getVisibleDatasetWeightTotal(){return this._getRingWeightOffset(this.chart.data.datasets.length)||1}}ut(us,"id","doughnut"),ut(us,"defaults",{datasetElementType:!1,dataElementType:"arc",animation:{animateRotate:!0,animateScale:!1},animations:{numbers:{type:"number",properties:["circumference","endAngle","innerRadius","outerRadius","startAngle","x","y","offset","borderWidth","spacing"]}},cutout:"50%",rotation:0,circumference:360,radius:"100%",spacing:0,indexAxis:"r"}),ut(us,"descriptors",{_scriptable:t=>t!=="spacing",_indexable:t=>t!=="spacing"&&!t.startsWith("borderDash")&&!t.startsWith("hoverBorderDash")}),ut(us,"overrides",{aspectRatio:1,plugins:{legend:{labels:{generateLabels(t){const e=t.data;if(e.labels.length&&e.datasets.length){const{labels:{pointStyle:i,color:s}}=t.legend.options;return e.labels.map((r,o)=>{const l=t.getDatasetMeta(0).controller.getStyle(o);return{text:r,fillStyle:l.backgroundColor,strokeStyle:l.borderColor,fontColor:s,lineWidth:l.borderWidth,pointStyle:i,hidden:!t.getDataVisibility(o),index:o}})}return[]}},onClick(t,e,i){i.chart.toggleDataVisibility(e.index),i.chart.update()}}}});class da extends Bn{initialize(){this.enableOptionSharing=!0,this.supportsDecimation=!0,super.initialize()}update(t){const e=this._cachedMeta,{dataset:i,data:s=[],_dataset:r}=e,o=this.chart._animationsDisabled;let{start:a,count:l}=Yd(e,s,o);this._drawStart=a,this._drawCount=l,qd(e)&&(a=0,l=s.length),i._chart=this.chart,i._datasetIndex=this.index,i._decimated=!!r._decimated,i.points=s;const c=this.resolveDatasetElementOptions(t);this.options.showLine||(c.borderWidth=0),c.segment=this.options.segment,this.updateElement(i,void 0,{animated:!o,options:c},t),this.updateElements(s,a,l,t)}updateElements(t,e,i,s){const r=s==="reset",{iScale:o,vScale:a,_stacked:l,_dataset:c}=this._cachedMeta,{sharedOptions:h,includeOptions:u}=this._getSharedOptions(e,s),d=o.axis,f=a.axis,{spanGaps:g,segment:_}=this.options,m=tr(g)?g:Number.POSITIVE_INFINITY,p=this.chart._animationsDisabled||r||s==="none",v=e+i,x=t.length;let y=e>0&&this.getParsed(e-1);for(let b=0;b<x;++b){const E=t[b],S=p?E:{};if(b<e||b>=v){S.skip=!0;continue}const C=this.getParsed(b),M=ee(C[f]),w=S[d]=o.getPixelForValue(C[d],b),U=S[f]=r||M?a.getBasePixel():a.getPixelForValue(l?this.applyStack(a,C,l):C[f],b);S.skip=isNaN(w)||isNaN(U)||M,S.stop=b>0&&Math.abs(C[d]-y[d])>m,_&&(S.parsed=C,S.raw=c.data[b]),u&&(S.options=h||this.resolveDataElementOptions(b,E.active?"active":s)),p||this.updateElement(E,b,S,s),y=C}}getMaxOverflow(){const t=this._cachedMeta,e=t.dataset,i=e.options&&e.options.borderWidth||0,s=t.data||[];if(!s.length)return i;const r=s[0].size(this.resolveDataElementOptions(0)),o=s[s.length-1].size(this.resolveDataElementOptions(s.length-1));return Math.max(i,r,o)/2}draw(){const t=this._cachedMeta;t.dataset.updateControlPoints(this.chart.chartArea,t.iScale.axis),super.draw()}}ut(da,"id","line"),ut(da,"defaults",{datasetElementType:"line",dataElementType:"point",showLine:!0,spanGaps:!1}),ut(da,"overrides",{scales:{_index_:{type:"category"},_value_:{type:"linear"}}});class Fr extends Bn{constructor(t,e){super(t,e),this.innerRadius=void 0,this.outerRadius=void 0}getLabelAndValue(t){const e=this._cachedMeta,i=this.chart,s=i.data.labels||[],r=Lr(e._parsed[t].r,i.options.locale);return{label:s[t]||"",value:r}}parseObjectData(t,e,i,s){return hf.bind(this)(t,e,i,s)}update(t){const e=this._cachedMeta.data;this._updateRadius(),this.updateElements(e,0,e.length,t)}getMinMax(){const t=this._cachedMeta,e={min:Number.POSITIVE_INFINITY,max:Number.NEGATIVE_INFINITY};return t.data.forEach((i,s)=>{const r=this.getParsed(s).r;!isNaN(r)&&this.chart.getDataVisibility(s)&&(r<e.min&&(e.min=r),r>e.max&&(e.max=r))}),e}_updateRadius(){const t=this.chart,e=t.chartArea,i=t.options,s=Math.min(e.right-e.left,e.bottom-e.top),r=Math.max(s/2,0),o=Math.max(i.cutoutPercentage?r/100*i.cutoutPercentage:1,0),a=(r-o)/t.getVisibleDatasetCount();this.outerRadius=r-a*this.index,this.innerRadius=this.outerRadius-a}updateElements(t,e,i,s){const r=s==="reset",o=this.chart,l=o.options.animation,c=this._cachedMeta.rScale,h=c.xCenter,u=c.yCenter,d=c.getIndexAngle(0)-.5*fe;let f=d,g;const _=360/this.countVisibleElements();for(g=0;g<e;++g)f+=this._computeAngle(g,s,_);for(g=e;g<e+i;g++){const m=t[g];let p=f,v=f+this._computeAngle(g,s,_),x=o.getDataVisibility(g)?c.getDistanceFromCenterForValue(this.getParsed(g).r):0;f=v,r&&(l.animateScale&&(x=0),l.animateRotate&&(p=v=d));const y={x:h,y:u,innerRadius:0,outerRadius:x,startAngle:p,endAngle:v,options:this.resolveDataElementOptions(g,m.active?"active":s)};this.updateElement(m,g,y,s)}}countVisibleElements(){const t=this._cachedMeta;let e=0;return t.data.forEach((i,s)=>{!isNaN(this.getParsed(s).r)&&this.chart.getDataVisibility(s)&&e++}),e}_computeAngle(t,e,i){return this.chart.getDataVisibility(t)?kn(this.resolveDataElementOptions(t,e).angle||i):0}}ut(Fr,"id","polarArea"),ut(Fr,"defaults",{dataElementType:"arc",animation:{animateRotate:!0,animateScale:!0},animations:{numbers:{type:"number",properties:["x","y","startAngle","endAngle","innerRadius","outerRadius"]}},indexAxis:"r",startAngle:0}),ut(Fr,"overrides",{aspectRatio:1,plugins:{legend:{labels:{generateLabels(t){const e=t.data;if(e.labels.length&&e.datasets.length){const{labels:{pointStyle:i,color:s}}=t.legend.options;return e.labels.map((r,o)=>{const l=t.getDatasetMeta(0).controller.getStyle(o);return{text:r,fillStyle:l.backgroundColor,strokeStyle:l.borderColor,fontColor:s,lineWidth:l.borderWidth,pointStyle:i,hidden:!t.getDataVisibility(o),index:o}})}return[]}},onClick(t,e,i){i.chart.toggleDataVisibility(e.index),i.chart.update()}}},scales:{r:{type:"radialLinear",angleLines:{display:!1},beginAtZero:!0,grid:{circular:!0},pointLabels:{display:!1},startAngle:0}}});class mc extends us{}ut(mc,"id","pie"),ut(mc,"defaults",{cutout:0,rotation:0,circumference:360,radius:"100%"});class fa extends Bn{getLabelAndValue(t){const e=this._cachedMeta.vScale,i=this.getParsed(t);return{label:e.getLabels()[t],value:""+e.getLabelForValue(i[e.axis])}}parseObjectData(t,e,i,s){return hf.bind(this)(t,e,i,s)}update(t){const e=this._cachedMeta,i=e.dataset,s=e.data||[],r=e.iScale.getLabels();if(i.points=s,t!=="resize"){const o=this.resolveDatasetElementOptions(t);this.options.showLine||(o.borderWidth=0);const a={_loop:!0,_fullLoop:r.length===s.length,options:o};this.updateElement(i,void 0,a,t)}this.updateElements(s,0,s.length,t)}updateElements(t,e,i,s){const r=this._cachedMeta.rScale,o=s==="reset";for(let a=e;a<e+i;a++){const l=t[a],c=this.resolveDataElementOptions(a,l.active?"active":s),h=r.getPointPositionForValue(a,this.getParsed(a).r),u=o?r.xCenter:h.x,d=o?r.yCenter:h.y,f={x:u,y:d,angle:h.angle,skip:isNaN(u)||isNaN(d),options:c};this.updateElement(l,a,f,s)}}}ut(fa,"id","radar"),ut(fa,"defaults",{datasetElementType:"line",dataElementType:"point",indexAxis:"r",showLine:!0,elements:{line:{fill:"start"}}}),ut(fa,"overrides",{aspectRatio:1,scales:{r:{type:"radialLinear"}}});class pa extends Bn{getLabelAndValue(t){const e=this._cachedMeta,i=this.chart.data.labels||[],{xScale:s,yScale:r}=e,o=this.getParsed(t),a=s.getLabelForValue(o.x),l=r.getLabelForValue(o.y);return{label:i[t]||"",value:"("+a+", "+l+")"}}update(t){const e=this._cachedMeta,{data:i=[]}=e,s=this.chart._animationsDisabled;let{start:r,count:o}=Yd(e,i,s);if(this._drawStart=r,this._drawCount=o,qd(e)&&(r=0,o=i.length),this.options.showLine){this.datasetElementType||this.addElements();const{dataset:a,_dataset:l}=e;a._chart=this.chart,a._datasetIndex=this.index,a._decimated=!!l._decimated,a.points=i;const c=this.resolveDatasetElementOptions(t);c.segment=this.options.segment,this.updateElement(a,void 0,{animated:!s,options:c},t)}else this.datasetElementType&&(delete e.dataset,this.datasetElementType=!1);this.updateElements(i,r,o,t)}addElements(){const{showLine:t}=this.options;!this.datasetElementType&&t&&(this.datasetElementType=this.chart.registry.getElement("line")),super.addElements()}updateElements(t,e,i,s){const r=s==="reset",{iScale:o,vScale:a,_stacked:l,_dataset:c}=this._cachedMeta,h=this.resolveDataElementOptions(e,s),u=this.getSharedOptions(h),d=this.includeOptions(s,u),f=o.axis,g=a.axis,{spanGaps:_,segment:m}=this.options,p=tr(_)?_:Number.POSITIVE_INFINITY,v=this.chart._animationsDisabled||r||s==="none";let x=e>0&&this.getParsed(e-1);for(let y=e;y<e+i;++y){const b=t[y],E=this.getParsed(y),S=v?b:{},C=ee(E[g]),M=S[f]=o.getPixelForValue(E[f],y),w=S[g]=r||C?a.getBasePixel():a.getPixelForValue(l?this.applyStack(a,E,l):E[g],y);S.skip=isNaN(M)||isNaN(w)||C,S.stop=y>0&&Math.abs(E[f]-x[f])>p,m&&(S.parsed=E,S.raw=c.data[y]),d&&(S.options=u||this.resolveDataElementOptions(y,b.active?"active":s)),v||this.updateElement(b,y,S,s),x=E}this.updateSharedOptions(u,s,h)}getMaxOverflow(){const t=this._cachedMeta,e=t.data||[];if(!this.options.showLine){let a=0;for(let l=e.length-1;l>=0;--l)a=Math.max(a,e[l].size(this.resolveDataElementOptions(l))/2);return a>0&&a}const i=t.dataset,s=i.options&&i.options.borderWidth||0;if(!e.length)return s;const r=e[0].size(this.resolveDataElementOptions(0)),o=e[e.length-1].size(this.resolveDataElementOptions(e.length-1));return Math.max(s,r,o)/2}}ut(pa,"id","scatter"),ut(pa,"defaults",{datasetElementType:!1,dataElementType:"point",showLine:!1,fill:!1}),ut(pa,"overrides",{interaction:{mode:"point"},scales:{x:{type:"linear"},y:{type:"linear"}}});var yy=Object.freeze({__proto__:null,BarController:ha,BubbleController:ua,DoughnutController:us,LineController:da,PieController:mc,PolarAreaController:Fr,RadarController:fa,ScatterController:pa});function ds(){throw new Error("This method is not implemented: Check that a complete date adapter is provided.")}class gc{constructor(t){ut(this,"options");this.options=t||{}}static override(t){Object.assign(gc.prototype,t)}init(){}formats(){return ds()}parse(){return ds()}format(){return ds()}add(){return ds()}diff(){return ds()}startOf(){return ds()}endOf(){return ds()}}var Sy={_date:gc};function Ey(n,t,e,i){const{controller:s,data:r,_sorted:o}=n,a=s._cachedMeta.iScale;if(a&&t===a.axis&&t!=="r"&&o&&r.length){const l=a._reversePixels?Yb:pi;if(i){if(s._sharedOptions){const c=r[0],h=typeof c.getRange=="function"&&c.getRange(t);if(h){const u=l(r,t,e-h),d=l(r,t,e+h);return{lo:u.lo,hi:d.hi}}}}else return l(r,t,e)}return{lo:0,hi:r.length-1}}function ma(n,t,e,i,s){const r=n.getSortedVisibleDatasetMetas(),o=e[t];for(let a=0,l=r.length;a<l;++a){const{index:c,data:h}=r[a],{lo:u,hi:d}=Ey(r[a],t,o,s);for(let f=u;f<=d;++f){const g=h[f];g.skip||i(g,c,f)}}}function Ty(n){const t=n.indexOf("x")!==-1,e=n.indexOf("y")!==-1;return function(i,s){const r=t?Math.abs(i.x-s.x):0,o=e?Math.abs(i.y-s.y):0;return Math.sqrt(Math.pow(r,2)+Math.pow(o,2))}}function _c(n,t,e,i,s){const r=[];return!s&&!n.isPointInArea(t)||ma(n,e,t,function(a,l,c){!s&&!mi(a,n.chartArea,0)||a.inRange(t.x,t.y,i)&&r.push({element:a,datasetIndex:l,index:c})},!0),r}function wy(n,t,e,i){let s=[];function r(o,a,l){const{startAngle:c,endAngle:h}=o.getProps(["startAngle","endAngle"],i),{angle:u}=Hd(o,{x:t.x,y:t.y});Rr(u,c,h)&&s.push({element:o,datasetIndex:a,index:l})}return ma(n,e,t,r),s}function Ay(n,t,e,i,s,r){let o=[];const a=Ty(e);let l=Number.POSITIVE_INFINITY;function c(h,u,d){const f=h.inRange(t.x,t.y,s);if(i&&!f)return;const g=h.getCenterPoint(s);if(!(!!r||n.isPointInArea(g))&&!f)return;const m=a(t,g);m<l?(o=[{element:h,datasetIndex:u,index:d}],l=m):m===l&&o.push({element:h,datasetIndex:u,index:d})}return ma(n,e,t,c),o}function xc(n,t,e,i,s,r){return!r&&!n.isPointInArea(t)?[]:e==="r"&&!i?wy(n,t,e,s):Ay(n,t,e,i,s,r)}function Uf(n,t,e,i,s){const r=[],o=e==="x"?"inXRange":"inYRange";let a=!1;return ma(n,e,t,(l,c,h)=>{l[o](t[e],s)&&(r.push({element:l,datasetIndex:c,index:h}),a=a||l.inRange(t.x,t.y,s))}),i&&!a?[]:r}var Cy={modes:{index(n,t,e,i){const s=cs(t,n),r=e.axis||"x",o=e.includeInvisible||!1,a=e.intersect?_c(n,s,r,i,o):xc(n,s,r,!1,i,o),l=[];return a.length?(n.getSortedVisibleDatasetMetas().forEach(c=>{const h=a[0].index,u=c.data[h];u&&!u.skip&&l.push({element:u,datasetIndex:c.index,index:h})}),l):[]},dataset(n,t,e,i){const s=cs(t,n),r=e.axis||"xy",o=e.includeInvisible||!1;let a=e.intersect?_c(n,s,r,i,o):xc(n,s,r,!1,i,o);if(a.length>0){const l=a[0].datasetIndex,c=n.getDatasetMeta(l).data;a=[];for(let h=0;h<c.length;++h)a.push({element:c[h],datasetIndex:l,index:h})}return a},point(n,t,e,i){const s=cs(t,n),r=e.axis||"xy",o=e.includeInvisible||!1;return _c(n,s,r,i,o)},nearest(n,t,e,i){const s=cs(t,n),r=e.axis||"xy",o=e.includeInvisible||!1;return xc(n,s,r,e.intersect,i,o)},x(n,t,e,i){const s=cs(t,n);return Uf(n,s,"x",e.intersect,i)},y(n,t,e,i){const s=cs(t,n);return Uf(n,s,"y",e.intersect,i)}}};const Ff=["left","top","right","bottom"];function Nr(n,t){return n.filter(e=>e.pos===t)}function Nf(n,t){return n.filter(e=>Ff.indexOf(e.pos)===-1&&e.box.axis===t)}function kr(n,t){return n.sort((e,i)=>{const s=t?i:e,r=t?e:i;return s.weight===r.weight?s.index-r.index:s.weight-r.weight})}function Ry(n){const t=[];let e,i,s,r,o,a;for(e=0,i=(n||[]).length;e<i;++e)s=n[e],{position:r,options:{stack:o,stackWeight:a=1}}=s,t.push({index:e,box:s,pos:r,horizontal:s.isHorizontal(),weight:s.weight,stack:o&&r+o,stackWeight:a});return t}function Py(n){const t={};for(const e of n){const{stack:i,pos:s,stackWeight:r}=e;if(!i||!Ff.includes(s))continue;const o=t[i]||(t[i]={count:0,placed:0,weight:0,size:0});o.count++,o.weight+=r}return t}function Ly(n,t){const e=Py(n),{vBoxMaxWidth:i,hBoxMaxHeight:s}=t;let r,o,a;for(r=0,o=n.length;r<o;++r){a=n[r];const{fullSize:l}=a.box,c=e[a.stack],h=c&&a.stackWeight/c.weight;a.horizontal?(a.width=h?h*i:l&&t.availableWidth,a.height=s):(a.width=i,a.height=h?h*s:l&&t.availableHeight)}return e}function Dy(n){const t=Ry(n),e=kr(t.filter(c=>c.box.fullSize),!0),i=kr(Nr(t,"left"),!0),s=kr(Nr(t,"right")),r=kr(Nr(t,"top"),!0),o=kr(Nr(t,"bottom")),a=Nf(t,"x"),l=Nf(t,"y");return{fullSize:e,leftAndTop:i.concat(r),rightAndBottom:s.concat(l).concat(o).concat(a),chartArea:Nr(t,"chartArea"),vertical:i.concat(s).concat(l),horizontal:r.concat(o).concat(a)}}function kf(n,t,e,i){return Math.max(n[e],t[e])+Math.max(n[i],t[i])}function Bf(n,t){n.top=Math.max(n.top,t.top),n.left=Math.max(n.left,t.left),n.bottom=Math.max(n.bottom,t.bottom),n.right=Math.max(n.right,t.right)}function Iy(n,t,e,i){const{pos:s,box:r}=e,o=n.maxPadding;if(!Zt(s)){e.size&&(n[s]-=e.size);const u=i[e.stack]||{size:0,count:1};u.size=Math.max(u.size,e.horizontal?r.height:r.width),e.size=u.size/u.count,n[s]+=e.size}r.getPadding&&Bf(o,r.getPadding());const a=Math.max(0,t.outerWidth-kf(o,n,"left","right")),l=Math.max(0,t.outerHeight-kf(o,n,"top","bottom")),c=a!==n.w,h=l!==n.h;return n.w=a,n.h=l,e.horizontal?{same:c,other:h}:{same:h,other:c}}function Oy(n){const t=n.maxPadding;function e(i){const s=Math.max(t[i]-n[i],0);return n[i]+=s,s}n.y+=e("top"),n.x+=e("left"),e("right"),e("bottom")}function Uy(n,t){const e=t.maxPadding;function i(s){const r={left:0,top:0,right:0,bottom:0};return s.forEach(o=>{r[o]=Math.max(t[o],e[o])}),r}return i(n?["left","right"]:["top","bottom"])}function Br(n,t,e,i){const s=[];let r,o,a,l,c,h;for(r=0,o=n.length,c=0;r<o;++r){a=n[r],l=a.box,l.update(a.width||t.w,a.height||t.h,Uy(a.horizontal,t));const{same:u,other:d}=Iy(t,e,a,i);c|=u&&s.length,h=h||d,l.fullSize||s.push(a)}return c&&Br(s,t,e,i)||h}function ga(n,t,e,i,s){n.top=e,n.left=t,n.right=t+i,n.bottom=e+s,n.width=i,n.height=s}function zf(n,t,e,i){const s=e.padding;let{x:r,y:o}=t;for(const a of n){const l=a.box,c=i[a.stack]||{placed:0,weight:1},h=a.stackWeight/c.weight||1;if(a.horizontal){const u=t.w*h,d=c.size||l.height;Ar(c.start)&&(o=c.start),l.fullSize?ga(l,s.left,o,e.outerWidth-s.right-s.left,d):ga(l,t.left+c.placed,o,u,d),c.start=o,c.placed+=u,o=l.bottom}else{const u=t.h*h,d=c.size||l.width;Ar(c.start)&&(r=c.start),l.fullSize?ga(l,r,s.top,d,e.outerHeight-s.bottom-s.top):ga(l,r,t.top+c.placed,d,u),c.start=r,c.placed+=u,r=l.right}}t.x=r,t.y=o}var $e={addBox(n,t){n.boxes||(n.boxes=[]),t.fullSize=t.fullSize||!1,t.position=t.position||"top",t.weight=t.weight||0,t._layers=t._layers||function(){return[{z:0,draw(e){t.draw(e)}}]},n.boxes.push(t)},removeBox(n,t){const e=n.boxes?n.boxes.indexOf(t):-1;e!==-1&&n.boxes.splice(e,1)},configure(n,t,e){t.fullSize=e.fullSize,t.position=e.position,t.weight=e.weight},update(n,t,e,i){if(!n)return;const s=qe(n.options.layout.padding),r=Math.max(t-s.width,0),o=Math.max(e-s.height,0),a=Dy(n.boxes),l=a.vertical,c=a.horizontal;oe(n.boxes,_=>{typeof _.beforeLayout=="function"&&_.beforeLayout()});const h=l.reduce((_,m)=>m.box.options&&m.box.options.display===!1?_:_+1,0)||1,u=Object.freeze({outerWidth:t,outerHeight:e,padding:s,availableWidth:r,availableHeight:o,vBoxMaxWidth:r/2/h,hBoxMaxHeight:o/2}),d=Object.assign({},s);Bf(d,qe(i));const f=Object.assign({maxPadding:d,w:r,h:o,x:s.left,y:s.top},s),g=Ly(l.concat(c),u);Br(a.fullSize,f,u,g),Br(l,f,u,g),Br(c,f,u,g)&&Br(l,f,u,g),Oy(f),zf(a.leftAndTop,f,u,g),f.x+=f.w,f.y+=f.h,zf(a.rightAndBottom,f,u,g),n.chartArea={left:f.left,top:f.top,right:f.left+f.w,bottom:f.top+f.h,height:f.h,width:f.w},oe(a.chartArea,_=>{const m=_.box;Object.assign(m,n.chartArea),m.update(f.w,f.h,{left:0,top:0,right:0,bottom:0})})}};class Hf{acquireContext(t,e){}releaseContext(t){return!1}addEventListener(t,e,i){}removeEventListener(t,e,i){}getDevicePixelRatio(){return 1}getMaximumSize(t,e,i,s){return e=Math.max(0,e||t.width),i=i||t.height,{width:e,height:Math.max(0,s?Math.floor(e/s):i)}}isAttached(t){return!0}updateConfig(t){}}class Fy extends Hf{acquireContext(t){return t&&t.getContext&&t.getContext("2d")||null}updateConfig(t){t.options.animation=!1}}const _a="$chartjs",Ny={touchstart:"mousedown",touchmove:"mousemove",touchend:"mouseup",pointerenter:"mouseenter",pointerdown:"mousedown",pointermove:"mousemove",pointerup:"mouseup",pointerleave:"mouseout",pointerout:"mouseout"},Vf=n=>n===null||n==="";function ky(n,t){const e=n.style,i=n.getAttribute("height"),s=n.getAttribute("width");if(n[_a]={initial:{height:i,width:s,style:{display:e.display,height:e.height,width:e.width}}},e.display=e.display||"block",e.boxSizing=e.boxSizing||"border-box",Vf(s)){const r=ff(n,"width");r!==void 0&&(n.width=r)}if(Vf(i))if(n.style.height==="")n.height=n.width/(t||2);else{const r=ff(n,"height");r!==void 0&&(n.height=r)}return n}const Gf=zM?{passive:!0}:!1;function By(n,t,e){n.addEventListener(t,e,Gf)}function zy(n,t,e){n.canvas.removeEventListener(t,e,Gf)}function Hy(n,t){const e=Ny[n.type]||n.type,{x:i,y:s}=cs(n,t);return{type:e,chart:t,native:n,x:i!==void 0?i:null,y:s!==void 0?s:null}}function xa(n,t){for(const e of n)if(e===t||e.contains(t))return!0}function Vy(n,t,e){const i=n.canvas,s=new MutationObserver(r=>{let o=!1;for(const a of r)o=o||xa(a.addedNodes,i),o=o&&!xa(a.removedNodes,i);o&&e()});return s.observe(document,{childList:!0,subtree:!0}),s}function Gy(n,t,e){const i=n.canvas,s=new MutationObserver(r=>{let o=!1;for(const a of r)o=o||xa(a.removedNodes,i),o=o&&!xa(a.addedNodes,i);o&&e()});return s.observe(document,{childList:!0,subtree:!0}),s}const zr=new Map;let Wf=0;function Xf(){const n=window.devicePixelRatio;n!==Wf&&(Wf=n,zr.forEach((t,e)=>{e.currentDevicePixelRatio!==n&&t()}))}function Wy(n,t){zr.size||window.addEventListener("resize",Xf),zr.set(n,t)}function Xy(n){zr.delete(n),zr.size||window.removeEventListener("resize",Xf)}function jy(n,t,e){const i=n.canvas,s=i&&uc(i);if(!s)return;const r=jd((a,l)=>{const c=s.clientWidth;e(a,l),c<s.clientWidth&&e()},window),o=new ResizeObserver(a=>{const l=a[0],c=l.contentRect.width,h=l.contentRect.height;c===0&&h===0||r(c,h)});return o.observe(s),Wy(n,r),o}function vc(n,t,e){e&&e.disconnect(),t==="resize"&&Xy(n)}function Yy(n,t,e){const i=n.canvas,s=jd(r=>{n.ctx!==null&&e(Hy(r,n))},n);return By(i,t,s),s}class qy extends Hf{acquireContext(t,e){const i=t&&t.getContext&&t.getContext("2d");return i&&i.canvas===t?(ky(t,e),i):null}releaseContext(t){const e=t.canvas;if(!e[_a])return!1;const i=e[_a].initial;["height","width"].forEach(r=>{const o=i[r];ee(o)?e.removeAttribute(r):e.setAttribute(r,o)});const s=i.style||{};return Object.keys(s).forEach(r=>{e.style[r]=s[r]}),e.width=e.width,delete e[_a],!0}addEventListener(t,e,i){this.removeEventListener(t,e);const s=t.$proxies||(t.$proxies={}),o={attach:Vy,detach:Gy,resize:jy}[e]||Yy;s[e]=o(t,e,i)}removeEventListener(t,e){const i=t.$proxies||(t.$proxies={}),s=i[e];if(!s)return;({attach:vc,detach:vc,resize:vc}[e]||zy)(t,e,s),i[e]=void 0}getDevicePixelRatio(){return window.devicePixelRatio}getMaximumSize(t,e,i,s){return BM(t,e,i,s)}isAttached(t){const e=uc(t);return!!(e&&e.isConnected)}}function $y(n){return!hc()||typeof OffscreenCanvas<"u"&&n instanceof OffscreenCanvas?Fy:qy}class zn{constructor(){ut(this,"x");ut(this,"y");ut(this,"active",!1);ut(this,"options");ut(this,"$animations")}tooltipPosition(t){const{x:e,y:i}=this.getProps(["x","y"],t);return{x:e,y:i}}hasValue(){return tr(this.x)&&tr(this.y)}getProps(t,e){const i=this.$animations;if(!e||!i)return this;const s={};return t.forEach(r=>{s[r]=i[r]&&i[r].active()?i[r]._to:this[r]}),s}}ut(zn,"defaults",{}),ut(zn,"defaultRoutes");function Ky(n,t){const e=n.options.ticks,i=Zy(n),s=Math.min(e.maxTicksLimit||i,i),r=e.major.enabled?Qy(t):[],o=r.length,a=r[0],l=r[o-1],c=[];if(o>s)return tS(t,c,r,o/s),c;const h=Jy(r,t,s);if(o>0){let u,d;const f=o>1?Math.round((l-a)/(o-1)):null;for(va(t,c,h,ee(f)?0:a-f,a),u=0,d=o-1;u<d;u++)va(t,c,h,r[u],r[u+1]);return va(t,c,h,l,ee(f)?t.length:l+f),c}return va(t,c,h),c}function Zy(n){const t=n.options.offset,e=n._tickSize(),i=n._length/e+(t?0:1),s=n._maxLength/e;return Math.floor(Math.min(i,s))}function Jy(n,t,e){const i=eS(n),s=t.length/e;if(!i)return Math.max(s,1);const r=Gb(i);for(let o=0,a=r.length-1;o<a;o++){const l=r[o];if(l>s)return l}return Math.max(s,1)}function Qy(n){const t=[];let e,i;for(e=0,i=n.length;e<i;e++)n[e].major&&t.push(e);return t}function tS(n,t,e,i){let s=0,r=e[0],o;for(i=Math.ceil(i),o=0;o<n.length;o++)o===r&&(t.push(n[o]),s++,r=e[s*i])}function va(n,t,e,i,s){const r=kt(i,0),o=Math.min(kt(s,n.length),n.length);let a=0,l,c,h;for(e=Math.ceil(e),s&&(l=s-i,e=l/Math.floor(l/e)),h=r;h<0;)a++,h=Math.round(r+a*e);for(c=Math.max(r,0);c<o;c++)c===h&&(t.push(n[c]),a++,h=Math.round(r+a*e))}function eS(n){const t=n.length;let e,i;if(t<2)return!1;for(i=n[0],e=1;e<t;++e)if(n[e]-n[e-1]!==i)return!1;return i}const nS=n=>n==="left"?"right":n==="right"?"left":n,jf=(n,t,e)=>t==="top"||t==="left"?n[t]+e:n[t]-e,Yf=(n,t)=>Math.min(t||n,n);function qf(n,t){const e=[],i=n.length/t,s=n.length;let r=0;for(;r<s;r+=i)e.push(n[Math.floor(r)]);return e}function iS(n,t,e){const i=n.ticks.length,s=Math.min(t,i-1),r=n._startPixel,o=n._endPixel,a=1e-6;let l=n.getPixelForTick(s),c;if(!(e&&(i===1?c=Math.max(l-r,o-l):t===0?c=(n.getPixelForTick(1)-l)/2:c=(l-n.getPixelForTick(s-1))/2,l+=s<t?c:-c,l<r-a||l>o+a)))return l}function sS(n,t){oe(n,e=>{const i=e.gc,s=i.length/2;let r;if(s>t){for(r=0;r<s;++r)delete e.data[i[r]];i.splice(0,s)}})}function Hr(n){return n.drawTicks?n.tickLength:0}function $f(n,t){if(!n.display)return 0;const e=De(n.font,t),i=qe(n.padding);return(_e(n.text)?n.text.length:1)*e.lineHeight+i.height}function rS(n,t){return Bi(n,{scale:t,type:"scale"})}function oS(n,t,e){return Bi(n,{tick:e,index:t,type:"tick"})}function aS(n,t,e){let i=tc(n);return(e&&t!=="right"||!e&&t==="right")&&(i=nS(i)),i}function lS(n,t,e,i){const{top:s,left:r,bottom:o,right:a,chart:l}=n,{chartArea:c,scales:h}=l;let u=0,d,f,g;const _=o-s,m=a-r;if(n.isHorizontal()){if(f=Ye(i,r,a),Zt(e)){const p=Object.keys(e)[0],v=e[p];g=h[p].getPixelForValue(v)+_-t}else e==="center"?g=(c.bottom+c.top)/2+_-t:g=jf(n,e,t);d=a-r}else{if(Zt(e)){const p=Object.keys(e)[0],v=e[p];f=h[p].getPixelForValue(v)-m+t}else e==="center"?f=(c.left+c.right)/2-m+t:f=jf(n,e,t);g=Ye(i,o,s),u=e==="left"?-Se:Se}return{titleX:f,titleY:g,maxWidth:d,rotation:u}}class fs extends zn{constructor(t){super(),this.id=t.id,this.type=t.type,this.options=void 0,this.ctx=t.ctx,this.chart=t.chart,this.top=void 0,this.bottom=void 0,this.left=void 0,this.right=void 0,this.width=void 0,this.height=void 0,this._margins={left:0,right:0,top:0,bottom:0},this.maxWidth=void 0,this.maxHeight=void 0,this.paddingTop=void 0,this.paddingBottom=void 0,this.paddingLeft=void 0,this.paddingRight=void 0,this.axis=void 0,this.labelRotation=void 0,this.min=void 0,this.max=void 0,this._range=void 0,this.ticks=[],this._gridLineItems=null,this._labelItems=null,this._labelSizes=null,this._length=0,this._maxLength=0,this._longestTextCache={},this._startPixel=void 0,this._endPixel=void 0,this._reversePixels=!1,this._userMax=void 0,this._userMin=void 0,this._suggestedMax=void 0,this._suggestedMin=void 0,this._ticksLength=0,this._borderValue=0,this._cache={},this._dataLimitsCached=!1,this.$context=void 0}init(t){this.options=t.setContext(this.getContext()),this.axis=t.axis,this._userMin=this.parse(t.min),this._userMax=this.parse(t.max),this._suggestedMin=this.parse(t.suggestedMin),this._suggestedMax=this.parse(t.suggestedMax)}parse(t,e){return t}getUserBounds(){let{_userMin:t,_userMax:e,_suggestedMin:i,_suggestedMax:s}=this;return t=gn(t,Number.POSITIVE_INFINITY),e=gn(e,Number.NEGATIVE_INFINITY),i=gn(i,Number.POSITIVE_INFINITY),s=gn(s,Number.NEGATIVE_INFINITY),{min:gn(t,i),max:gn(e,s),minDefined:be(t),maxDefined:be(e)}}getMinMax(t){let{min:e,max:i,minDefined:s,maxDefined:r}=this.getUserBounds(),o;if(s&&r)return{min:e,max:i};const a=this.getMatchingVisibleMetas();for(let l=0,c=a.length;l<c;++l)o=a[l].controller.getMinMax(this,t),s||(e=Math.min(e,o.min)),r||(i=Math.max(i,o.max));return e=r&&e>i?i:e,i=s&&e>i?e:i,{min:gn(e,gn(i,e)),max:gn(i,gn(e,i))}}getPadding(){return{left:this.paddingLeft||0,top:this.paddingTop||0,right:this.paddingRight||0,bottom:this.paddingBottom||0}}getTicks(){return this.ticks}getLabels(){const t=this.chart.data;return this.options.labels||(this.isHorizontal()?t.xLabels:t.yLabels)||t.labels||[]}getLabelItems(t=this.chart.chartArea){return this._labelItems||(this._labelItems=this._computeLabelItems(t))}beforeLayout(){this._cache={},this._dataLimitsCached=!1}beforeUpdate(){ue(this.options.beforeUpdate,[this])}update(t,e,i){const{beginAtZero:s,grace:r,ticks:o}=this.options,a=o.sampleSize;this.beforeUpdate(),this.maxWidth=t,this.maxHeight=e,this._margins=i=Object.assign({left:0,right:0,top:0,bottom:0},i),this.ticks=null,this._labelSizes=null,this._gridLineItems=null,this._labelItems=null,this.beforeSetDimensions(),this.setDimensions(),this.afterSetDimensions(),this._maxLength=this.isHorizontal()?this.width+i.left+i.right:this.height+i.top+i.bottom,this._dataLimitsCached||(this.beforeDataLimits(),this.determineDataLimits(),this.afterDataLimits(),this._range=_M(this,r,s),this._dataLimitsCached=!0),this.beforeBuildTicks(),this.ticks=this.buildTicks()||[],this.afterBuildTicks();const l=a<this.ticks.length;this._convertTicksToLabels(l?qf(this.ticks,a):this.ticks),this.configure(),this.beforeCalculateLabelRotation(),this.calculateLabelRotation(),this.afterCalculateLabelRotation(),o.display&&(o.autoSkip||o.source==="auto")&&(this.ticks=Ky(this,this.ticks),this._labelSizes=null,this.afterAutoSkip()),l&&this._convertTicksToLabels(this.ticks),this.beforeFit(),this.fit(),this.afterFit(),this.afterUpdate()}configure(){let t=this.options.reverse,e,i;this.isHorizontal()?(e=this.left,i=this.right):(e=this.top,i=this.bottom,t=!t),this._startPixel=e,this._endPixel=i,this._reversePixels=t,this._length=i-e,this._alignToPixels=this.options.alignToPixels}afterUpdate(){ue(this.options.afterUpdate,[this])}beforeSetDimensions(){ue(this.options.beforeSetDimensions,[this])}setDimensions(){this.isHorizontal()?(this.width=this.maxWidth,this.left=0,this.right=this.width):(this.height=this.maxHeight,this.top=0,this.bottom=this.height),this.paddingLeft=0,this.paddingTop=0,this.paddingRight=0,this.paddingBottom=0}afterSetDimensions(){ue(this.options.afterSetDimensions,[this])}_callHooks(t){this.chart.notifyPlugins(t,this.getContext()),ue(this.options[t],[this])}beforeDataLimits(){this._callHooks("beforeDataLimits")}determineDataLimits(){}afterDataLimits(){this._callHooks("afterDataLimits")}beforeBuildTicks(){this._callHooks("beforeBuildTicks")}buildTicks(){return[]}afterBuildTicks(){this._callHooks("afterBuildTicks")}beforeTickToLabelConversion(){ue(this.options.beforeTickToLabelConversion,[this])}generateTickLabels(t){const e=this.options.ticks;let i,s,r;for(i=0,s=t.length;i<s;i++)r=t[i],r.label=ue(e.callback,[r.value,i,t],this)}afterTickToLabelConversion(){ue(this.options.afterTickToLabelConversion,[this])}beforeCalculateLabelRotation(){ue(this.options.beforeCalculateLabelRotation,[this])}calculateLabelRotation(){const t=this.options,e=t.ticks,i=Yf(this.ticks.length,t.ticks.maxTicksLimit),s=e.minRotation||0,r=e.maxRotation;let o=s,a,l,c;if(!this._isVisible()||!e.display||s>=r||i<=1||!this.isHorizontal()){this.labelRotation=s;return}const h=this._getLabelSizes(),u=h.widest.width,d=h.highest.height,f=ke(this.chart.width-u,0,this.maxWidth);a=t.offset?this.maxWidth/i:f/(i-1),u+6>a&&(a=f/(i-(t.offset?.5:1)),l=this.maxHeight-Hr(t.grid)-e.padding-$f(t.title,this.chart.options.font),c=Math.sqrt(u*u+d*d),o=Zl(Math.min(Math.asin(ke((h.highest.height+6)/a,-1,1)),Math.asin(ke(l/c,-1,1))-Math.asin(ke(d/c,-1,1)))),o=Math.max(s,Math.min(r,o))),this.labelRotation=o}afterCalculateLabelRotation(){ue(this.options.afterCalculateLabelRotation,[this])}afterAutoSkip(){}beforeFit(){ue(this.options.beforeFit,[this])}fit(){const t={width:0,height:0},{chart:e,options:{ticks:i,title:s,grid:r}}=this,o=this._isVisible(),a=this.isHorizontal();if(o){const l=$f(s,e.options.font);if(a?(t.width=this.maxWidth,t.height=Hr(r)+l):(t.height=this.maxHeight,t.width=Hr(r)+l),i.display&&this.ticks.length){const{first:c,last:h,widest:u,highest:d}=this._getLabelSizes(),f=i.padding*2,g=kn(this.labelRotation),_=Math.cos(g),m=Math.sin(g);if(a){const p=i.mirror?0:m*u.width+_*d.height;t.height=Math.min(this.maxHeight,t.height+p+f)}else{const p=i.mirror?0:_*u.width+m*d.height;t.width=Math.min(this.maxWidth,t.width+p+f)}this._calculatePadding(c,h,m,_)}}this._handleMargins(),a?(this.width=this._length=e.width-this._margins.left-this._margins.right,this.height=t.height):(this.width=t.width,this.height=this._length=e.height-this._margins.top-this._margins.bottom)}_calculatePadding(t,e,i,s){const{ticks:{align:r,padding:o},position:a}=this.options,l=this.labelRotation!==0,c=a!=="top"&&this.axis==="x";if(this.isHorizontal()){const h=this.getPixelForTick(0)-this.left,u=this.right-this.getPixelForTick(this.ticks.length-1);let d=0,f=0;l?c?(d=s*t.width,f=i*e.height):(d=i*t.height,f=s*e.width):r==="start"?f=e.width:r==="end"?d=t.width:r!=="inner"&&(d=t.width/2,f=e.width/2),this.paddingLeft=Math.max((d-h+o)*this.width/(this.width-h),0),this.paddingRight=Math.max((f-u+o)*this.width/(this.width-u),0)}else{let h=e.height/2,u=t.height/2;r==="start"?(h=0,u=t.height):r==="end"&&(h=e.height,u=0),this.paddingTop=h+o,this.paddingBottom=u+o}}_handleMargins(){this._margins&&(this._margins.left=Math.max(this.paddingLeft,this._margins.left),this._margins.top=Math.max(this.paddingTop,this._margins.top),this._margins.right=Math.max(this.paddingRight,this._margins.right),this._margins.bottom=Math.max(this.paddingBottom,this._margins.bottom))}afterFit(){ue(this.options.afterFit,[this])}isHorizontal(){const{axis:t,position:e}=this.options;return e==="top"||e==="bottom"||t==="x"}isFullSize(){return this.options.fullSize}_convertTicksToLabels(t){this.beforeTickToLabelConversion(),this.generateTickLabels(t);let e,i;for(e=0,i=t.length;e<i;e++)ee(t[e].label)&&(t.splice(e,1),i--,e--);this.afterTickToLabelConversion()}_getLabelSizes(){let t=this._labelSizes;if(!t){const e=this.options.ticks.sampleSize;let i=this.ticks;e<i.length&&(i=qf(i,e)),this._labelSizes=t=this._computeLabelSizes(i,i.length,this.options.ticks.maxTicksLimit)}return t}_computeLabelSizes(t,e,i){const{ctx:s,_longestTextCache:r}=this,o=[],a=[],l=Math.floor(e/Yf(e,i));let c=0,h=0,u,d,f,g,_,m,p,v,x,y,b;for(u=0;u<e;u+=l){if(g=t[u].label,_=this._resolveTickFontOptions(u),s.font=m=_.string,p=r[m]=r[m]||{data:{},gc:[]},v=_.lineHeight,x=y=0,!ee(g)&&!_e(g))x=ia(s,p.data,p.gc,x,g),y=v;else if(_e(g))for(d=0,f=g.length;d<f;++d)b=g[d],!ee(b)&&!_e(b)&&(x=ia(s,p.data,p.gc,x,b),y+=v);o.push(x),a.push(y),c=Math.max(x,c),h=Math.max(y,h)}sS(r,e);const E=o.indexOf(c),S=a.indexOf(h),C=M=>({width:o[M]||0,height:a[M]||0});return{first:C(0),last:C(e-1),widest:C(E),highest:C(S),widths:o,heights:a}}getLabelForValue(t){return t}getPixelForValue(t,e){return NaN}getValueForPixel(t){}getPixelForTick(t){const e=this.ticks;return t<0||t>e.length-1?null:this.getPixelForValue(e[t].value)}getPixelForDecimal(t){this._reversePixels&&(t=1-t);const e=this._startPixel+t*this._length;return jb(this._alignToPixels?rs(this.chart,e,0):e)}getDecimalForPixel(t){const e=(t-this._startPixel)/this._length;return this._reversePixels?1-e:e}getBasePixel(){return this.getPixelForValue(this.getBaseValue())}getBaseValue(){const{min:t,max:e}=this;return t<0&&e<0?e:t>0&&e>0?t:0}getContext(t){const e=this.ticks||[];if(t>=0&&t<e.length){const i=e[t];return i.$context||(i.$context=oS(this.getContext(),t,i))}return this.$context||(this.$context=rS(this.chart.getContext(),this))}_tickSize(){const t=this.options.ticks,e=kn(this.labelRotation),i=Math.abs(Math.cos(e)),s=Math.abs(Math.sin(e)),r=this._getLabelSizes(),o=t.autoSkipPadding||0,a=r?r.widest.width+o:0,l=r?r.highest.height+o:0;return this.isHorizontal()?l*i>a*s?a/i:l/s:l*s<a*i?l/i:a/s}_isVisible(){const t=this.options.display;return t!=="auto"?!!t:this.getMatchingVisibleMetas().length>0}_computeGridLineItems(t){const e=this.axis,i=this.chart,s=this.options,{grid:r,position:o,border:a}=s,l=r.offset,c=this.isHorizontal(),u=this.ticks.length+(l?1:0),d=Hr(r),f=[],g=a.setContext(this.getContext()),_=g.display?g.width:0,m=_/2,p=function(V){return rs(i,V,_)};let v,x,y,b,E,S,C,M,w,U,O,Z;if(o==="top")v=p(this.bottom),S=this.bottom-d,M=v-m,U=p(t.top)+m,Z=t.bottom;else if(o==="bottom")v=p(this.top),U=t.top,Z=p(t.bottom)-m,S=v+m,M=this.top+d;else if(o==="left")v=p(this.right),E=this.right-d,C=v-m,w=p(t.left)+m,O=t.right;else if(o==="right")v=p(this.left),w=t.left,O=p(t.right)-m,E=v+m,C=this.left+d;else if(e==="x"){if(o==="center")v=p((t.top+t.bottom)/2+.5);else if(Zt(o)){const V=Object.keys(o)[0],$=o[V];v=p(this.chart.scales[V].getPixelForValue($))}U=t.top,Z=t.bottom,S=v+m,M=S+d}else if(e==="y"){if(o==="center")v=p((t.left+t.right)/2);else if(Zt(o)){const V=Object.keys(o)[0],$=o[V];v=p(this.chart.scales[V].getPixelForValue($))}E=v-m,C=E-d,w=t.left,O=t.right}const D=kt(s.ticks.maxTicksLimit,u),F=Math.max(1,Math.ceil(u/D));for(x=0;x<u;x+=F){const V=this.getContext(x),$=r.setContext(V),K=a.setContext(V),Y=$.lineWidth,Q=$.color,et=K.dash||[],pt=K.dashOffset,B=$.tickWidth,J=$.tickColor,ct=$.tickBorderDash||[],vt=$.tickBorderDashOffset;y=iS(this,x,l),y!==void 0&&(b=rs(i,y,Y),c?E=C=w=O=b:S=M=U=Z=b,f.push({tx1:E,ty1:S,tx2:C,ty2:M,x1:w,y1:U,x2:O,y2:Z,width:Y,color:Q,borderDash:et,borderDashOffset:pt,tickWidth:B,tickColor:J,tickBorderDash:ct,tickBorderDashOffset:vt}))}return this._ticksLength=u,this._borderValue=v,f}_computeLabelItems(t){const e=this.axis,i=this.options,{position:s,ticks:r}=i,o=this.isHorizontal(),a=this.ticks,{align:l,crossAlign:c,padding:h,mirror:u}=r,d=Hr(i.grid),f=d+h,g=u?-h:f,_=-kn(this.labelRotation),m=[];let p,v,x,y,b,E,S,C,M,w,U,O,Z="middle";if(s==="top")E=this.bottom-g,S=this._getXAxisLabelAlignment();else if(s==="bottom")E=this.top+g,S=this._getXAxisLabelAlignment();else if(s==="left"){const F=this._getYAxisLabelAlignment(d);S=F.textAlign,b=F.x}else if(s==="right"){const F=this._getYAxisLabelAlignment(d);S=F.textAlign,b=F.x}else if(e==="x"){if(s==="center")E=(t.top+t.bottom)/2+f;else if(Zt(s)){const F=Object.keys(s)[0],V=s[F];E=this.chart.scales[F].getPixelForValue(V)+f}S=this._getXAxisLabelAlignment()}else if(e==="y"){if(s==="center")b=(t.left+t.right)/2-f;else if(Zt(s)){const F=Object.keys(s)[0],V=s[F];b=this.chart.scales[F].getPixelForValue(V)}S=this._getYAxisLabelAlignment(d).textAlign}e==="y"&&(l==="start"?Z="top":l==="end"&&(Z="bottom"));const D=this._getLabelSizes();for(p=0,v=a.length;p<v;++p){x=a[p],y=x.label;const F=r.setContext(this.getContext(p));C=this.getPixelForTick(p)+r.labelOffset,M=this._resolveTickFontOptions(p),w=M.lineHeight,U=_e(y)?y.length:1;const V=U/2,$=F.color,K=F.textStrokeColor,Y=F.textStrokeWidth;let Q=S;o?(b=C,S==="inner"&&(p===v-1?Q=this.options.reverse?"left":"right":p===0?Q=this.options.reverse?"right":"left":Q="center"),s==="top"?c==="near"||_!==0?O=-U*w+w/2:c==="center"?O=-D.highest.height/2-V*w+w:O=-D.highest.height+w/2:c==="near"||_!==0?O=w/2:c==="center"?O=D.highest.height/2-V*w:O=D.highest.height-U*w,u&&(O*=-1),_!==0&&!F.showLabelBackdrop&&(b+=w/2*Math.sin(_))):(E=C,O=(1-U)*w/2);let et;if(F.showLabelBackdrop){const pt=qe(F.backdropPadding),B=D.heights[p],J=D.widths[p];let ct=O-pt.top,vt=0-pt.left;switch(Z){case"middle":ct-=B/2;break;case"bottom":ct-=B;break}switch(S){case"center":vt-=J/2;break;case"right":vt-=J;break;case"inner":p===v-1?vt-=J:p>0&&(vt-=J/2);break}et={left:vt,top:ct,width:J+pt.width,height:B+pt.height,color:F.backdropColor}}m.push({label:y,font:M,textOffset:O,options:{rotation:_,color:$,strokeColor:K,strokeWidth:Y,textAlign:Q,textBaseline:Z,translation:[b,E],backdrop:et}})}return m}_getXAxisLabelAlignment(){const{position:t,ticks:e}=this.options;if(-kn(this.labelRotation))return t==="top"?"left":"right";let s="center";return e.align==="start"?s="left":e.align==="end"?s="right":e.align==="inner"&&(s="inner"),s}_getYAxisLabelAlignment(t){const{position:e,ticks:{crossAlign:i,mirror:s,padding:r}}=this.options,o=this._getLabelSizes(),a=t+r,l=o.widest.width;let c,h;return e==="left"?s?(h=this.right+r,i==="near"?c="left":i==="center"?(c="center",h+=l/2):(c="right",h+=l)):(h=this.right-a,i==="near"?c="right":i==="center"?(c="center",h-=l/2):(c="left",h=this.left)):e==="right"?s?(h=this.left+r,i==="near"?c="right":i==="center"?(c="center",h-=l/2):(c="left",h-=l)):(h=this.left+a,i==="near"?c="left":i==="center"?(c="center",h+=l/2):(c="right",h=this.right)):c="right",{textAlign:c,x:h}}_computeLabelArea(){if(this.options.ticks.mirror)return;const t=this.chart,e=this.options.position;if(e==="left"||e==="right")return{top:0,left:this.left,bottom:t.height,right:this.right};if(e==="top"||e==="bottom")return{top:this.top,left:0,bottom:this.bottom,right:t.width}}drawBackground(){const{ctx:t,options:{backgroundColor:e},left:i,top:s,width:r,height:o}=this;e&&(t.save(),t.fillStyle=e,t.fillRect(i,s,r,o),t.restore())}getLineWidthForValue(t){const e=this.options.grid;if(!this._isVisible()||!e.display)return 0;const s=this.ticks.findIndex(r=>r.value===t);return s>=0?e.setContext(this.getContext(s)).lineWidth:0}drawGrid(t){const e=this.options.grid,i=this.ctx,s=this._gridLineItems||(this._gridLineItems=this._computeGridLineItems(t));let r,o;const a=(l,c,h)=>{!h.width||!h.color||(i.save(),i.lineWidth=h.width,i.strokeStyle=h.color,i.setLineDash(h.borderDash||[]),i.lineDashOffset=h.borderDashOffset,i.beginPath(),i.moveTo(l.x,l.y),i.lineTo(c.x,c.y),i.stroke(),i.restore())};if(e.display)for(r=0,o=s.length;r<o;++r){const l=s[r];e.drawOnChartArea&&a({x:l.x1,y:l.y1},{x:l.x2,y:l.y2},l),e.drawTicks&&a({x:l.tx1,y:l.ty1},{x:l.tx2,y:l.ty2},{color:l.tickColor,width:l.tickWidth,borderDash:l.tickBorderDash,borderDashOffset:l.tickBorderDashOffset})}}drawBorder(){const{chart:t,ctx:e,options:{border:i,grid:s}}=this,r=i.setContext(this.getContext()),o=i.display?r.width:0;if(!o)return;const a=s.setContext(this.getContext(0)).lineWidth,l=this._borderValue;let c,h,u,d;this.isHorizontal()?(c=rs(t,this.left,o)-o/2,h=rs(t,this.right,a)+a/2,u=d=l):(u=rs(t,this.top,o)-o/2,d=rs(t,this.bottom,a)+a/2,c=h=l),e.save(),e.lineWidth=r.width,e.strokeStyle=r.color,e.beginPath(),e.moveTo(c,u),e.lineTo(h,d),e.stroke(),e.restore()}drawLabels(t){if(!this.options.ticks.display)return;const i=this.ctx,s=this._computeLabelArea();s&&sa(i,s);const r=this.getLabelItems(t);for(const o of r){const a=o.options,l=o.font,c=o.label,h=o.textOffset;os(i,c,0,h,l,a)}s&&ra(i)}drawTitle(){const{ctx:t,options:{position:e,title:i,reverse:s}}=this;if(!i.display)return;const r=De(i.font),o=qe(i.padding),a=i.align;let l=r.lineHeight/2;e==="bottom"||e==="center"||Zt(e)?(l+=o.bottom,_e(i.text)&&(l+=r.lineHeight*(i.text.length-1))):l+=o.top;const{titleX:c,titleY:h,maxWidth:u,rotation:d}=lS(this,l,e,a);os(t,i.text,0,0,r,{color:i.color,maxWidth:u,rotation:d,textAlign:aS(a,e,s),textBaseline:"middle",translation:[c,h]})}draw(t){this._isVisible()&&(this.drawBackground(),this.drawGrid(t),this.drawBorder(),this.drawTitle(),this.drawLabels(t))}_layers(){const t=this.options,e=t.ticks&&t.ticks.z||0,i=kt(t.grid&&t.grid.z,-1),s=kt(t.border&&t.border.z,0);return!this._isVisible()||this.draw!==fs.prototype.draw?[{z:e,draw:r=>{this.draw(r)}}]:[{z:i,draw:r=>{this.drawBackground(),this.drawGrid(r),this.drawTitle()}},{z:s,draw:()=>{this.drawBorder()}},{z:e,draw:r=>{this.drawLabels(r)}}]}getMatchingVisibleMetas(t){const e=this.chart.getSortedVisibleDatasetMetas(),i=this.axis+"AxisID",s=[];let r,o;for(r=0,o=e.length;r<o;++r){const a=e[r];a[i]===this.id&&(!t||a.type===t)&&s.push(a)}return s}_resolveTickFontOptions(t){const e=this.options.ticks.setContext(this.getContext(t));return De(e.font)}_maxDigits(){const t=this._resolveTickFontOptions(0).lineHeight;return(this.isHorizontal()?this.width:this.height)/t}}class ba{constructor(t,e,i){this.type=t,this.scope=e,this.override=i,this.items=Object.create(null)}isForType(t){return Object.prototype.isPrototypeOf.call(this.type.prototype,t.prototype)}register(t){const e=Object.getPrototypeOf(t);let i;uS(e)&&(i=this.register(e));const s=this.items,r=t.id,o=this.scope+"."+r;if(!r)throw new Error("class does not have id: "+t);return r in s||(s[r]=t,cS(t,o,i),this.override&&Me.override(t.id,t.overrides)),o}get(t){return this.items[t]}unregister(t){const e=this.items,i=t.id,s=this.scope;i in e&&delete e[i],s&&i in Me[s]&&(delete Me[s][i],this.override&&delete ss[i])}}function cS(n,t,e){const i=Tr(Object.create(null),[e?Me.get(e):{},Me.get(t),n.defaults]);Me.set(t,i),n.defaultRoutes&&hS(t,n.defaultRoutes),n.descriptors&&Me.describe(t,n.descriptors)}function hS(n,t){Object.keys(t).forEach(e=>{const i=e.split("."),s=i.pop(),r=[n].concat(i).join("."),o=t[e].split("."),a=o.pop(),l=o.join(".");Me.route(r,s,l,a)})}function uS(n){return"id"in n&&"defaults"in n}class dS{constructor(){this.controllers=new ba(Bn,"datasets",!0),this.elements=new ba(zn,"elements"),this.plugins=new ba(Object,"plugins"),this.scales=new ba(fs,"scales"),this._typedRegistries=[this.controllers,this.scales,this.elements]}add(...t){this._each("register",t)}remove(...t){this._each("unregister",t)}addControllers(...t){this._each("register",t,this.controllers)}addElements(...t){this._each("register",t,this.elements)}addPlugins(...t){this._each("register",t,this.plugins)}addScales(...t){this._each("register",t,this.scales)}getController(t){return this._get(t,this.controllers,"controller")}getElement(t){return this._get(t,this.elements,"element")}getPlugin(t){return this._get(t,this.plugins,"plugin")}getScale(t){return this._get(t,this.scales,"scale")}removeControllers(...t){this._each("unregister",t,this.controllers)}removeElements(...t){this._each("unregister",t,this.elements)}removePlugins(...t){this._each("unregister",t,this.plugins)}removeScales(...t){this._each("unregister",t,this.scales)}_each(t,e,i){[...e].forEach(s=>{const r=i||this._getRegistryForType(s);i||r.isForType(s)||r===this.plugins&&s.id?this._exec(t,r,s):oe(s,o=>{const a=i||this._getRegistryForType(o);this._exec(t,a,o)})})}_exec(t,e,i){const s=Kl(t);ue(i["before"+s],[],i),e[t](i),ue(i["after"+s],[],i)}_getRegistryForType(t){for(let e=0;e<this._typedRegistries.length;e++){const i=this._typedRegistries[e];if(i.isForType(t))return i}return this.plugins}_get(t,e,i){const s=e.get(t);if(s===void 0)throw new Error('"'+t+'" is not a registered '+i+".");return s}}var Xn=new dS;class fS{constructor(){this._init=[]}notify(t,e,i,s){e==="beforeInit"&&(this._init=this._createDescriptors(t,!0),this._notify(this._init,t,"install"));const r=s?this._descriptors(t).filter(s):this._descriptors(t),o=this._notify(r,t,e,i);return e==="afterDestroy"&&(this._notify(r,t,"stop"),this._notify(this._init,t,"uninstall")),o}_notify(t,e,i,s){s=s||{};for(const r of t){const o=r.plugin,a=o[i],l=[e,s,r.options];if(ue(a,l,o)===!1&&s.cancelable)return!1}return!0}invalidate(){ee(this._cache)||(this._oldCache=this._cache,this._cache=void 0)}_descriptors(t){if(this._cache)return this._cache;const e=this._cache=this._createDescriptors(t);return this._notifyStateChanges(t),e}_createDescriptors(t,e){const i=t&&t.config,s=kt(i.options&&i.options.plugins,{}),r=pS(i);return s===!1&&!e?[]:gS(t,r,s,e)}_notifyStateChanges(t){const e=this._oldCache||[],i=this._cache,s=(r,o)=>r.filter(a=>!o.some(l=>a.plugin.id===l.plugin.id));this._notify(s(e,i),t,"stop"),this._notify(s(i,e),t,"start")}}function pS(n){const t={},e=[],i=Object.keys(Xn.plugins.items);for(let r=0;r<i.length;r++)e.push(Xn.getPlugin(i[r]));const s=n.plugins||[];for(let r=0;r<s.length;r++){const o=s[r];e.indexOf(o)===-1&&(e.push(o),t[o.id]=!0)}return{plugins:e,localIds:t}}function mS(n,t){return!t&&n===!1?null:n===!0?{}:n}function gS(n,{plugins:t,localIds:e},i,s){const r=[],o=n.getContext();for(const a of t){const l=a.id,c=mS(i[l],s);c!==null&&r.push({plugin:a,options:_S(n.config,{plugin:a,local:e[l]},c,o)})}return r}function _S(n,{plugin:t,local:e},i,s){const r=n.pluginScopeKeys(t),o=n.getOptionScopes(i,r);return e&&t.defaults&&o.push(t.defaults),n.createResolver(o,s,[""],{scriptable:!1,indexable:!1,allKeys:!0})}function bc(n,t){const e=Me.datasets[n]||{};return((t.datasets||{})[n]||{}).indexAxis||t.indexAxis||e.indexAxis||"x"}function xS(n,t){let e=n;return n==="_index_"?e=t:n==="_value_"&&(e=t==="x"?"y":"x"),e}function vS(n,t){return n===t?"_index_":"_value_"}function Kf(n){if(n==="x"||n==="y"||n==="r")return n}function bS(n){if(n==="top"||n==="bottom")return"x";if(n==="left"||n==="right")return"y"}function Mc(n,...t){if(Kf(n))return n;for(const e of t){const i=e.axis||bS(e.position)||n.length>1&&Kf(n[0].toLowerCase());if(i)return i}throw new Error(`Cannot determine type of '${n}' axis. Please provide 'axis' or 'position' option.`)}function Zf(n,t,e){if(e[t+"AxisID"]===n)return{axis:t}}function MS(n,t){if(t.data&&t.data.datasets){const e=t.data.datasets.filter(i=>i.xAxisID===n||i.yAxisID===n);if(e.length)return Zf(n,"x",e[0])||Zf(n,"y",e[0])}return{}}function yS(n,t){const e=ss[n.type]||{scales:{}},i=t.scales||{},s=bc(n.type,t),r=Object.create(null);return Object.keys(i).forEach(o=>{const a=i[o];if(!Zt(a))return console.error(`Invalid scale configuration for scale: ${o}`);if(a._proxy)return console.warn(`Ignoring resolver passed as options for scale: ${o}`);const l=Mc(o,a,MS(o,n),Me.scales[a.type]),c=vS(l,s),h=e.scales||{};r[o]=wr(Object.create(null),[{axis:l},a,h[l],h[c]])}),n.data.datasets.forEach(o=>{const a=o.type||n.type,l=o.indexAxis||bc(a,t),h=(ss[a]||{}).scales||{};Object.keys(h).forEach(u=>{const d=xS(u,l),f=o[d+"AxisID"]||d;r[f]=r[f]||Object.create(null),wr(r[f],[{axis:d},i[f],h[u]])})}),Object.keys(r).forEach(o=>{const a=r[o];wr(a,[Me.scales[a.type],Me.scale])}),r}function Jf(n){const t=n.options||(n.options={});t.plugins=kt(t.plugins,{}),t.scales=yS(n,t)}function Qf(n){return n=n||{},n.datasets=n.datasets||[],n.labels=n.labels||[],n}function SS(n){return n=n||{},n.data=Qf(n.data),Jf(n),n}const tp=new Map,ep=new Set;function Ma(n,t){let e=tp.get(n);return e||(e=t(),tp.set(n,e),ep.add(e)),e}const Vr=(n,t,e)=>{const i=Fi(t,e);i!==void 0&&n.add(i)};class ES{constructor(t){this._config=SS(t),this._scopeCache=new Map,this._resolverCache=new Map}get platform(){return this._config.platform}get type(){return this._config.type}set type(t){this._config.type=t}get data(){return this._config.data}set data(t){this._config.data=Qf(t)}get options(){return this._config.options}set options(t){this._config.options=t}get plugins(){return this._config.plugins}update(){const t=this._config;this.clearCache(),Jf(t)}clearCache(){this._scopeCache.clear(),this._resolverCache.clear()}datasetScopeKeys(t){return Ma(t,()=>[[`datasets.${t}`,""]])}datasetAnimationScopeKeys(t,e){return Ma(`${t}.transition.${e}`,()=>[[`datasets.${t}.transitions.${e}`,`transitions.${e}`],[`datasets.${t}`,""]])}datasetElementScopeKeys(t,e){return Ma(`${t}-${e}`,()=>[[`datasets.${t}.elements.${e}`,`datasets.${t}`,`elements.${e}`,""]])}pluginScopeKeys(t){const e=t.id,i=this.type;return Ma(`${i}-plugin-${e}`,()=>[[`plugins.${e}`,...t.additionalOptionScopes||[]]])}_cachedScopes(t,e){const i=this._scopeCache;let s=i.get(t);return(!s||e)&&(s=new Map,i.set(t,s)),s}getOptionScopes(t,e,i){const{options:s,type:r}=this,o=this._cachedScopes(t,i),a=o.get(e);if(a)return a;const l=new Set;e.forEach(h=>{t&&(l.add(t),h.forEach(u=>Vr(l,t,u))),h.forEach(u=>Vr(l,s,u)),h.forEach(u=>Vr(l,ss[r]||{},u)),h.forEach(u=>Vr(l,Me,u)),h.forEach(u=>Vr(l,ic,u))});const c=Array.from(l);return c.length===0&&c.push(Object.create(null)),ep.has(e)&&o.set(e,c),c}chartOptionScopes(){const{options:t,type:e}=this;return[t,ss[e]||{},Me.datasets[e]||{},{type:e},Me,ic]}resolveNamedOptions(t,e,i,s=[""]){const r={$shared:!0},{resolver:o,subPrefixes:a}=np(this._resolverCache,t,s);let l=o;if(wS(o,e)){r.$shared=!1,i=Ni(i)?i():i;const c=this.createResolver(t,i,a);l=er(o,i,c)}for(const c of e)r[c]=l[c];return r}createResolver(t,e,i=[""],s){const{resolver:r}=np(this._resolverCache,t,i);return Zt(e)?er(r,e,void 0,s):r}}function np(n,t,e){let i=n.get(t);i||(i=new Map,n.set(t,i));const s=e.join();let r=i.get(s);return r||(r={resolver:ac(t,e),subPrefixes:e.filter(a=>!a.toLowerCase().includes("hover"))},i.set(s,r)),r}const TS=n=>Zt(n)&&Object.getOwnPropertyNames(n).some(t=>Ni(n[t]));function wS(n,t){const{isScriptable:e,isIndexable:i}=sf(n);for(const s of t){const r=e(s),o=i(s),a=(o||r)&&n[s];if(r&&(Ni(a)||TS(a))||o&&_e(a))return!0}return!1}var AS="4.4.1";const CS=["top","bottom","left","right","chartArea"];function ip(n,t){return n==="top"||n==="bottom"||CS.indexOf(n)===-1&&t==="x"}function sp(n,t){return function(e,i){return e[n]===i[n]?e[t]-i[t]:e[n]-i[n]}}function rp(n){const t=n.chart,e=t.options.animation;t.notifyPlugins("afterRender"),ue(e&&e.onComplete,[n],t)}function RS(n){const t=n.chart,e=t.options.animation;ue(e&&e.onProgress,[n],t)}function op(n){return hc()&&typeof n=="string"?n=document.getElementById(n):n&&n.length&&(n=n[0]),n&&n.canvas&&(n=n.canvas),n}const ya={},ap=n=>{const t=op(n);return Object.values(ya).filter(e=>e.canvas===t).pop()};function PS(n,t,e){const i=Object.keys(n);for(const s of i){const r=+s;if(r>=t){const o=n[s];delete n[s],(e>0||r>t)&&(n[r+e]=o)}}}function LS(n,t,e,i){return!e||n.type==="mouseout"?null:i?t:n}function Sa(n,t,e){return n.options.clip?n[e]:t[e]}function DS(n,t){const{xScale:e,yScale:i}=n;return e&&i?{left:Sa(e,t,"left"),right:Sa(e,t,"right"),top:Sa(i,t,"top"),bottom:Sa(i,t,"bottom")}:t}class xn{static register(...t){Xn.add(...t),lp()}static unregister(...t){Xn.remove(...t),lp()}constructor(t,e){const i=this.config=new ES(e),s=op(t),r=ap(s);if(r)throw new Error("Canvas is already in use. Chart with ID '"+r.id+"' must be destroyed before the canvas with ID '"+r.canvas.id+"' can be reused.");const o=i.createResolver(i.chartOptionScopes(),this.getContext());this.platform=new(i.platform||$y(s)),this.platform.updateConfig(i);const a=this.platform.acquireContext(s,o.aspectRatio),l=a&&a.canvas,c=l&&l.height,h=l&&l.width;if(this.id=Ob(),this.ctx=a,this.canvas=l,this.width=h,this.height=c,this._options=o,this._aspectRatio=this.aspectRatio,this._layers=[],this._metasets=[],this._stacks=void 0,this.boxes=[],this.currentDevicePixelRatio=void 0,this.chartArea=void 0,this._active=[],this._lastEvent=void 0,this._listeners={},this._responsiveListeners=void 0,this._sortedMetasets=[],this.scales={},this._plugins=new fS,this.$proxies={},this._hiddenIndices={},this.attached=!1,this._animationsDisabled=void 0,this.$context=void 0,this._doResize=Kb(u=>this.update(u),o.resizeDelay||0),this._dataChanges=[],ya[this.id]=this,!a||!l){console.error("Failed to create chart: can't acquire context from the given item");return}gi.listen(this,"complete",rp),gi.listen(this,"progress",RS),this._initialize(),this.attached&&this.update()}get aspectRatio(){const{options:{aspectRatio:t,maintainAspectRatio:e},width:i,height:s,_aspectRatio:r}=this;return ee(t)?e&&r?r:s?i/s:null:t}get data(){return this.config.data}set data(t){this.config.data=t}get options(){return this._options}set options(t){this.config.options=t}get registry(){return Xn}_initialize(){return this.notifyPlugins("beforeInit"),this.options.responsive?this.resize():df(this,this.options.devicePixelRatio),this.bindEvents(),this.notifyPlugins("afterInit"),this}clear(){return tf(this.canvas,this.ctx),this}stop(){return gi.stop(this),this}resize(t,e){gi.running(this)?this._resizeBeforeDraw={width:t,height:e}:this._resize(t,e)}_resize(t,e){const i=this.options,s=this.canvas,r=i.maintainAspectRatio&&this.aspectRatio,o=this.platform.getMaximumSize(s,t,e,r),a=i.devicePixelRatio||this.platform.getDevicePixelRatio(),l=this.width?"resize":"attach";this.width=o.width,this.height=o.height,this._aspectRatio=this.aspectRatio,df(this,a,!0)&&(this.notifyPlugins("resize",{size:o}),ue(i.onResize,[this,o],this),this.attached&&this._doResize(l)&&this.render())}ensureScalesHaveIDs(){const e=this.options.scales||{};oe(e,(i,s)=>{i.id=s})}buildOrUpdateScales(){const t=this.options,e=t.scales,i=this.scales,s=Object.keys(i).reduce((o,a)=>(o[a]=!1,o),{});let r=[];e&&(r=r.concat(Object.keys(e).map(o=>{const a=e[o],l=Mc(o,a),c=l==="r",h=l==="x";return{options:a,dposition:c?"chartArea":h?"bottom":"left",dtype:c?"radialLinear":h?"category":"linear"}}))),oe(r,o=>{const a=o.options,l=a.id,c=Mc(l,a),h=kt(a.type,o.dtype);(a.position===void 0||ip(a.position,c)!==ip(o.dposition))&&(a.position=o.dposition),s[l]=!0;let u=null;if(l in i&&i[l].type===h)u=i[l];else{const d=Xn.getScale(h);u=new d({id:l,type:h,ctx:this.ctx,chart:this}),i[u.id]=u}u.init(a,t)}),oe(s,(o,a)=>{o||delete i[a]}),oe(i,o=>{$e.configure(this,o,o.options),$e.addBox(this,o)})}_updateMetasets(){const t=this._metasets,e=this.data.datasets.length,i=t.length;if(t.sort((s,r)=>s.index-r.index),i>e){for(let s=e;s<i;++s)this._destroyDatasetMeta(s);t.splice(e,i-e)}this._sortedMetasets=t.slice(0).sort(sp("order","index"))}_removeUnreferencedMetasets(){const{_metasets:t,data:{datasets:e}}=this;t.length>e.length&&delete this._stacks,t.forEach((i,s)=>{e.filter(r=>r===i._dataset).length===0&&this._destroyDatasetMeta(s)})}buildOrUpdateControllers(){const t=[],e=this.data.datasets;let i,s;for(this._removeUnreferencedMetasets(),i=0,s=e.length;i<s;i++){const r=e[i];let o=this.getDatasetMeta(i);const a=r.type||this.config.type;if(o.type&&o.type!==a&&(this._destroyDatasetMeta(i),o=this.getDatasetMeta(i)),o.type=a,o.indexAxis=r.indexAxis||bc(a,this.options),o.order=r.order||0,o.index=i,o.label=""+r.label,o.visible=this.isDatasetVisible(i),o.controller)o.controller.updateIndex(i),o.controller.linkScales();else{const l=Xn.getController(a),{datasetElementType:c,dataElementType:h}=Me.datasets[a];Object.assign(l,{dataElementType:Xn.getElement(h),datasetElementType:c&&Xn.getElement(c)}),o.controller=new l(this,i),t.push(o.controller)}}return this._updateMetasets(),t}_resetElements(){oe(this.data.datasets,(t,e)=>{this.getDatasetMeta(e).controller.reset()},this)}reset(){this._resetElements(),this.notifyPlugins("reset")}update(t){const e=this.config;e.update();const i=this._options=e.createResolver(e.chartOptionScopes(),this.getContext()),s=this._animationsDisabled=!i.animation;if(this._updateScales(),this._checkEventBindings(),this._updateHiddenIndices(),this._plugins.invalidate(),this.notifyPlugins("beforeUpdate",{mode:t,cancelable:!0})===!1)return;const r=this.buildOrUpdateControllers();this.notifyPlugins("beforeElementsUpdate");let o=0;for(let c=0,h=this.data.datasets.length;c<h;c++){const{controller:u}=this.getDatasetMeta(c),d=!s&&r.indexOf(u)===-1;u.buildOrUpdateElements(d),o=Math.max(+u.getMaxOverflow(),o)}o=this._minPadding=i.layout.autoPadding?o:0,this._updateLayout(o),s||oe(r,c=>{c.reset()}),this._updateDatasets(t),this.notifyPlugins("afterUpdate",{mode:t}),this._layers.sort(sp("z","_idx"));const{_active:a,_lastEvent:l}=this;l?this._eventHandler(l,!0):a.length&&this._updateHoverStyles(a,a,!0),this.render()}_updateScales(){oe(this.scales,t=>{$e.removeBox(this,t)}),this.ensureScalesHaveIDs(),this.buildOrUpdateScales()}_checkEventBindings(){const t=this.options,e=new Set(Object.keys(this._listeners)),i=new Set(t.events);(!Fd(e,i)||!!this._responsiveListeners!==t.responsive)&&(this.unbindEvents(),this.bindEvents())}_updateHiddenIndices(){const{_hiddenIndices:t}=this,e=this._getUniformDataChanges()||[];for(const{method:i,start:s,count:r}of e){const o=i==="_removeElements"?-r:r;PS(t,s,o)}}_getUniformDataChanges(){const t=this._dataChanges;if(!t||!t.length)return;this._dataChanges=[];const e=this.data.datasets.length,i=r=>new Set(t.filter(o=>o[0]===r).map((o,a)=>a+","+o.splice(1).join(","))),s=i(0);for(let r=1;r<e;r++)if(!Fd(s,i(r)))return;return Array.from(s).map(r=>r.split(",")).map(r=>({method:r[1],start:+r[2],count:+r[3]}))}_updateLayout(t){if(this.notifyPlugins("beforeLayout",{cancelable:!0})===!1)return;$e.update(this,this.width,this.height,t);const e=this.chartArea,i=e.width<=0||e.height<=0;this._layers=[],oe(this.boxes,s=>{i&&s.position==="chartArea"||(s.configure&&s.configure(),this._layers.push(...s._layers()))},this),this._layers.forEach((s,r)=>{s._idx=r}),this.notifyPlugins("afterLayout")}_updateDatasets(t){if(this.notifyPlugins("beforeDatasetsUpdate",{mode:t,cancelable:!0})!==!1){for(let e=0,i=this.data.datasets.length;e<i;++e)this.getDatasetMeta(e).controller.configure();for(let e=0,i=this.data.datasets.length;e<i;++e)this._updateDataset(e,Ni(t)?t({datasetIndex:e}):t);this.notifyPlugins("afterDatasetsUpdate",{mode:t})}}_updateDataset(t,e){const i=this.getDatasetMeta(t),s={meta:i,index:t,mode:e,cancelable:!0};this.notifyPlugins("beforeDatasetUpdate",s)!==!1&&(i.controller._update(e),s.cancelable=!1,this.notifyPlugins("afterDatasetUpdate",s))}render(){this.notifyPlugins("beforeRender",{cancelable:!0})!==!1&&(gi.has(this)?this.attached&&!gi.running(this)&&gi.start(this):(this.draw(),rp({chart:this})))}draw(){let t;if(this._resizeBeforeDraw){const{width:i,height:s}=this._resizeBeforeDraw;this._resize(i,s),this._resizeBeforeDraw=null}if(this.clear(),this.width<=0||this.height<=0||this.notifyPlugins("beforeDraw",{cancelable:!0})===!1)return;const e=this._layers;for(t=0;t<e.length&&e[t].z<=0;++t)e[t].draw(this.chartArea);for(this._drawDatasets();t<e.length;++t)e[t].draw(this.chartArea);this.notifyPlugins("afterDraw")}_getSortedDatasetMetas(t){const e=this._sortedMetasets,i=[];let s,r;for(s=0,r=e.length;s<r;++s){const o=e[s];(!t||o.visible)&&i.push(o)}return i}getSortedVisibleDatasetMetas(){return this._getSortedDatasetMetas(!0)}_drawDatasets(){if(this.notifyPlugins("beforeDatasetsDraw",{cancelable:!0})===!1)return;const t=this.getSortedVisibleDatasetMetas();for(let e=t.length-1;e>=0;--e)this._drawDataset(t[e]);this.notifyPlugins("afterDatasetsDraw")}_drawDataset(t){const e=this.ctx,i=t._clip,s=!i.disabled,r=DS(t,this.chartArea),o={meta:t,index:t.index,cancelable:!0};this.notifyPlugins("beforeDatasetDraw",o)!==!1&&(s&&sa(e,{left:i.left===!1?0:r.left-i.left,right:i.right===!1?this.width:r.right+i.right,top:i.top===!1?0:r.top-i.top,bottom:i.bottom===!1?this.height:r.bottom+i.bottom}),t.controller.draw(),s&&ra(e),o.cancelable=!1,this.notifyPlugins("afterDatasetDraw",o))}isPointInArea(t){return mi(t,this.chartArea,this._minPadding)}getElementsAtEventForMode(t,e,i,s){const r=Cy.modes[e];return typeof r=="function"?r(this,t,i,s):[]}getDatasetMeta(t){const e=this.data.datasets[t],i=this._metasets;let s=i.filter(r=>r&&r._dataset===e).pop();return s||(s={type:null,data:[],dataset:null,controller:null,hidden:null,xAxisID:null,yAxisID:null,order:e&&e.order||0,index:t,_dataset:e,_parsed:[],_sorted:!1},i.push(s)),s}getContext(){return this.$context||(this.$context=Bi(null,{chart:this,type:"chart"}))}getVisibleDatasetCount(){return this.getSortedVisibleDatasetMetas().length}isDatasetVisible(t){const e=this.data.datasets[t];if(!e)return!1;const i=this.getDatasetMeta(t);return typeof i.hidden=="boolean"?!i.hidden:!e.hidden}setDatasetVisibility(t,e){const i=this.getDatasetMeta(t);i.hidden=!e}toggleDataVisibility(t){this._hiddenIndices[t]=!this._hiddenIndices[t]}getDataVisibility(t){return!this._hiddenIndices[t]}_updateVisibility(t,e,i){const s=i?"show":"hide",r=this.getDatasetMeta(t),o=r.controller._resolveAnimations(void 0,s);Ar(e)?(r.data[e].hidden=!i,this.update()):(this.setDatasetVisibility(t,i),o.update(r,{visible:i}),this.update(a=>a.datasetIndex===t?s:void 0))}hide(t,e){this._updateVisibility(t,e,!1)}show(t,e){this._updateVisibility(t,e,!0)}_destroyDatasetMeta(t){const e=this._metasets[t];e&&e.controller&&e.controller._destroy(),delete this._metasets[t]}_stop(){let t,e;for(this.stop(),gi.remove(this),t=0,e=this.data.datasets.length;t<e;++t)this._destroyDatasetMeta(t)}destroy(){this.notifyPlugins("beforeDestroy");const{canvas:t,ctx:e}=this;this._stop(),this.config.clearCache(),t&&(this.unbindEvents(),tf(t,e),this.platform.releaseContext(e),this.canvas=null,this.ctx=null),delete ya[this.id],this.notifyPlugins("afterDestroy")}toBase64Image(...t){return this.canvas.toDataURL(...t)}bindEvents(){this.bindUserEvents(),this.options.responsive?this.bindResponsiveEvents():this.attached=!0}bindUserEvents(){const t=this._listeners,e=this.platform,i=(r,o)=>{e.addEventListener(this,r,o),t[r]=o},s=(r,o,a)=>{r.offsetX=o,r.offsetY=a,this._eventHandler(r)};oe(this.options.events,r=>i(r,s))}bindResponsiveEvents(){this._responsiveListeners||(this._responsiveListeners={});const t=this._responsiveListeners,e=this.platform,i=(l,c)=>{e.addEventListener(this,l,c),t[l]=c},s=(l,c)=>{t[l]&&(e.removeEventListener(this,l,c),delete t[l])},r=(l,c)=>{this.canvas&&this.resize(l,c)};let o;const a=()=>{s("attach",a),this.attached=!0,this.resize(),i("resize",r),i("detach",o)};o=()=>{this.attached=!1,s("resize",r),this._stop(),this._resize(0,0),i("attach",a)},e.isAttached(this.canvas)?a():o()}unbindEvents(){oe(this._listeners,(t,e)=>{this.platform.removeEventListener(this,e,t)}),this._listeners={},oe(this._responsiveListeners,(t,e)=>{this.platform.removeEventListener(this,e,t)}),this._responsiveListeners=void 0}updateHoverStyle(t,e,i){const s=i?"set":"remove";let r,o,a,l;for(e==="dataset"&&(r=this.getDatasetMeta(t[0].datasetIndex),r.controller["_"+s+"DatasetHoverStyle"]()),a=0,l=t.length;a<l;++a){o=t[a];const c=o&&this.getDatasetMeta(o.datasetIndex).controller;c&&c[s+"HoverStyle"](o.element,o.datasetIndex,o.index)}}getActiveElements(){return this._active||[]}setActiveElements(t){const e=this._active||[],i=t.map(({datasetIndex:r,index:o})=>{const a=this.getDatasetMeta(r);if(!a)throw new Error("No dataset found at index "+r);return{datasetIndex:r,element:a.data[o],index:o}});!Jo(i,e)&&(this._active=i,this._lastEvent=null,this._updateHoverStyles(i,e))}notifyPlugins(t,e,i){return this._plugins.notify(this,t,e,i)}isPluginEnabled(t){return this._plugins._cache.filter(e=>e.plugin.id===t).length===1}_updateHoverStyles(t,e,i){const s=this.options.hover,r=(l,c)=>l.filter(h=>!c.some(u=>h.datasetIndex===u.datasetIndex&&h.index===u.index)),o=r(e,t),a=i?t:r(t,e);o.length&&this.updateHoverStyle(o,s.mode,!1),a.length&&s.mode&&this.updateHoverStyle(a,s.mode,!0)}_eventHandler(t,e){const i={event:t,replay:e,cancelable:!0,inChartArea:this.isPointInArea(t)},s=o=>(o.options.events||this.options.events).includes(t.native.type);if(this.notifyPlugins("beforeEvent",i,s)===!1)return;const r=this._handleEvent(t,e,i.inChartArea);return i.cancelable=!1,this.notifyPlugins("afterEvent",i,s),(r||i.changed)&&this.render(),this}_handleEvent(t,e,i){const{_active:s=[],options:r}=this,o=e,a=this._getActiveElements(t,s,i,o),l=zb(t),c=LS(t,this._lastEvent,i,l);i&&(this._lastEvent=null,ue(r.onHover,[t,a,this],this),l&&ue(r.onClick,[t,a,this],this));const h=!Jo(a,s);return(h||e)&&(this._active=a,this._updateHoverStyles(a,s,e)),this._lastEvent=c,h}_getActiveElements(t,e,i,s){if(t.type==="mouseout")return[];if(!i)return e;const r=this.options.hover;return this.getElementsAtEventForMode(t,r.mode,r,s)}}ut(xn,"defaults",Me),ut(xn,"instances",ya),ut(xn,"overrides",ss),ut(xn,"registry",Xn),ut(xn,"version",AS),ut(xn,"getChart",ap);function lp(){return oe(xn.instances,n=>n._plugins.invalidate())}function IS(n,t,e){const{startAngle:i,pixelMargin:s,x:r,y:o,outerRadius:a,innerRadius:l}=t;let c=s/a;n.beginPath(),n.arc(r,o,a,i-c,e+c),l>s?(c=s/l,n.arc(r,o,l,e+c,i-c,!0)):n.arc(r,o,s,e+Se,i-Se),n.closePath(),n.clip()}function OS(n){return oc(n,["outerStart","outerEnd","innerStart","innerEnd"])}function US(n,t,e,i){const s=OS(n.options.borderRadius),r=(e-t)/2,o=Math.min(r,i*t/2),a=l=>{const c=(e-Math.min(r,l))*i/2;return ke(l,0,Math.min(r,c))};return{outerStart:a(s.outerStart),outerEnd:a(s.outerEnd),innerStart:ke(s.innerStart,0,o),innerEnd:ke(s.innerEnd,0,o)}}function sr(n,t,e,i){return{x:e+n*Math.cos(t),y:i+n*Math.sin(t)}}function Ea(n,t,e,i,s,r){const{x:o,y:a,startAngle:l,pixelMargin:c,innerRadius:h}=t,u=Math.max(t.outerRadius+i+e-c,0),d=h>0?h+i+e+c:0;let f=0;const g=s-l;if(i){const F=h>0?h-i:0,V=u>0?u-i:0,$=(F+V)/2,K=$!==0?g*$/($+i):g;f=(g-K)/2}const _=Math.max(.001,g*u-e/fe)/u,m=(g-_)/2,p=l+m+f,v=s-m-f,{outerStart:x,outerEnd:y,innerStart:b,innerEnd:E}=US(t,d,u,v-p),S=u-x,C=u-y,M=p+x/S,w=v-y/C,U=d+b,O=d+E,Z=p+b/U,D=v-E/O;if(n.beginPath(),r){const F=(M+w)/2;if(n.arc(o,a,u,M,F),n.arc(o,a,u,F,w),y>0){const Y=sr(C,w,o,a);n.arc(Y.x,Y.y,y,w,v+Se)}const V=sr(O,v,o,a);if(n.lineTo(V.x,V.y),E>0){const Y=sr(O,D,o,a);n.arc(Y.x,Y.y,E,v+Se,D+Math.PI)}const $=(v-E/d+(p+b/d))/2;if(n.arc(o,a,d,v-E/d,$,!0),n.arc(o,a,d,$,p+b/d,!0),b>0){const Y=sr(U,Z,o,a);n.arc(Y.x,Y.y,b,Z+Math.PI,p-Se)}const K=sr(S,p,o,a);if(n.lineTo(K.x,K.y),x>0){const Y=sr(S,M,o,a);n.arc(Y.x,Y.y,x,p-Se,M)}}else{n.moveTo(o,a);const F=Math.cos(M)*u+o,V=Math.sin(M)*u+a;n.lineTo(F,V);const $=Math.cos(w)*u+o,K=Math.sin(w)*u+a;n.lineTo($,K)}n.closePath()}function FS(n,t,e,i,s){const{fullCircles:r,startAngle:o,circumference:a}=t;let l=t.endAngle;if(r){Ea(n,t,e,i,l,s);for(let c=0;c<r;++c)n.fill();isNaN(a)||(l=o+(a%pe||pe))}return Ea(n,t,e,i,l,s),n.fill(),l}function NS(n,t,e,i,s){const{fullCircles:r,startAngle:o,circumference:a,options:l}=t,{borderWidth:c,borderJoinStyle:h,borderDash:u,borderDashOffset:d}=l,f=l.borderAlign==="inner";if(!c)return;n.setLineDash(u||[]),n.lineDashOffset=d,f?(n.lineWidth=c*2,n.lineJoin=h||"round"):(n.lineWidth=c,n.lineJoin=h||"bevel");let g=t.endAngle;if(r){Ea(n,t,e,i,g,s);for(let _=0;_<r;++_)n.stroke();isNaN(a)||(g=o+(a%pe||pe))}f&&IS(n,t,g),r||(Ea(n,t,e,i,g,s),n.stroke())}class Gr extends zn{constructor(e){super();ut(this,"circumference");ut(this,"endAngle");ut(this,"fullCircles");ut(this,"innerRadius");ut(this,"outerRadius");ut(this,"pixelMargin");ut(this,"startAngle");this.options=void 0,this.circumference=void 0,this.startAngle=void 0,this.endAngle=void 0,this.innerRadius=void 0,this.outerRadius=void 0,this.pixelMargin=0,this.fullCircles=0,e&&Object.assign(this,e)}inRange(e,i,s){const r=this.getProps(["x","y"],s),{angle:o,distance:a}=Hd(r,{x:e,y:i}),{startAngle:l,endAngle:c,innerRadius:h,outerRadius:u,circumference:d}=this.getProps(["startAngle","endAngle","innerRadius","outerRadius","circumference"],s),f=(this.options.spacing+this.options.borderWidth)/2,_=kt(d,c-l)>=pe||Rr(o,l,c),m=fi(a,h+f,u+f);return _&&m}getCenterPoint(e){const{x:i,y:s,startAngle:r,endAngle:o,innerRadius:a,outerRadius:l}=this.getProps(["x","y","startAngle","endAngle","innerRadius","outerRadius"],e),{offset:c,spacing:h}=this.options,u=(r+o)/2,d=(a+l+h+c)/2;return{x:i+Math.cos(u)*d,y:s+Math.sin(u)*d}}tooltipPosition(e){return this.getCenterPoint(e)}draw(e){const{options:i,circumference:s}=this,r=(i.offset||0)/4,o=(i.spacing||0)/2,a=i.circular;if(this.pixelMargin=i.borderAlign==="inner"?.33:0,this.fullCircles=s>pe?Math.floor(s/pe):0,s===0||this.innerRadius<0||this.outerRadius<0)return;e.save();const l=(this.startAngle+this.endAngle)/2;e.translate(Math.cos(l)*r,Math.sin(l)*r);const c=1-Math.sin(Math.min(fe,s||0)),h=r*c;e.fillStyle=i.backgroundColor,e.strokeStyle=i.borderColor,FS(e,this,h,o,a),NS(e,this,h,o,a),e.restore()}}ut(Gr,"id","arc"),ut(Gr,"defaults",{borderAlign:"center",borderColor:"#fff",borderDash:[],borderDashOffset:0,borderJoinStyle:void 0,borderRadius:0,borderWidth:2,offset:0,spacing:0,angle:void 0,circular:!0}),ut(Gr,"defaultRoutes",{backgroundColor:"backgroundColor"}),ut(Gr,"descriptors",{_scriptable:!0,_indexable:e=>e!=="borderDash"});function cp(n,t,e=t){n.lineCap=kt(e.borderCapStyle,t.borderCapStyle),n.setLineDash(kt(e.borderDash,t.borderDash)),n.lineDashOffset=kt(e.borderDashOffset,t.borderDashOffset),n.lineJoin=kt(e.borderJoinStyle,t.borderJoinStyle),n.lineWidth=kt(e.borderWidth,t.borderWidth),n.strokeStyle=kt(e.borderColor,t.borderColor)}function kS(n,t,e){n.lineTo(e.x,e.y)}function BS(n){return n.stepped?lM:n.tension||n.cubicInterpolationMode==="monotone"?cM:kS}function hp(n,t,e={}){const i=n.length,{start:s=0,end:r=i-1}=e,{start:o,end:a}=t,l=Math.max(s,o),c=Math.min(r,a),h=s<o&&r<o||s>a&&r>a;return{count:i,start:l,loop:t.loop,ilen:c<l&&!h?i+c-l:c-l}}function zS(n,t,e,i){const{points:s,options:r}=t,{count:o,start:a,loop:l,ilen:c}=hp(s,e,i),h=BS(r);let{move:u=!0,reverse:d}=i||{},f,g,_;for(f=0;f<=c;++f)g=s[(a+(d?c-f:f))%o],!g.skip&&(u?(n.moveTo(g.x,g.y),u=!1):h(n,_,g,d,r.stepped),_=g);return l&&(g=s[(a+(d?c:0))%o],h(n,_,g,d,r.stepped)),!!l}function HS(n,t,e,i){const s=t.points,{count:r,start:o,ilen:a}=hp(s,e,i),{move:l=!0,reverse:c}=i||{};let h=0,u=0,d,f,g,_,m,p;const v=y=>(o+(c?a-y:y))%r,x=()=>{_!==m&&(n.lineTo(h,m),n.lineTo(h,_),n.lineTo(h,p))};for(l&&(f=s[v(0)],n.moveTo(f.x,f.y)),d=0;d<=a;++d){if(f=s[v(d)],f.skip)continue;const y=f.x,b=f.y,E=y|0;E===g?(b<_?_=b:b>m&&(m=b),h=(u*h+y)/++u):(x(),n.lineTo(y,b),g=E,u=0,_=m=b),p=b}x()}function yc(n){const t=n.options,e=t.borderDash&&t.borderDash.length;return!n._decimated&&!n._loop&&!t.tension&&t.cubicInterpolationMode!=="monotone"&&!t.stepped&&!e?HS:zS}function VS(n){return n.stepped?HM:n.tension||n.cubicInterpolationMode==="monotone"?VM:hs}function GS(n,t,e,i){let s=t._path;s||(s=t._path=new Path2D,t.path(s,e,i)&&s.closePath()),cp(n,t.options),n.stroke(s)}function WS(n,t,e,i){const{segments:s,options:r}=t,o=yc(t);for(const a of s)cp(n,r,a.style),n.beginPath(),o(n,t,a,{start:e,end:e+i-1})&&n.closePath(),n.stroke()}const XS=typeof Path2D=="function";function jS(n,t,e,i){XS&&!t.options.segment?GS(n,t,e,i):WS(n,t,e,i)}class zi extends zn{constructor(t){super(),this.animated=!0,this.options=void 0,this._chart=void 0,this._loop=void 0,this._fullLoop=void 0,this._path=void 0,this._points=void 0,this._segments=void 0,this._decimated=!1,this._pointsUpdated=!1,this._datasetIndex=void 0,t&&Object.assign(this,t)}updateControlPoints(t,e){const i=this.options;if((i.tension||i.cubicInterpolationMode==="monotone")&&!i.stepped&&!this._pointsUpdated){const s=i.spanGaps?this._loop:this._fullLoop;IM(this._points,i,t,s,e),this._pointsUpdated=!0}}set points(t){this._points=t,delete this._segments,delete this._path,this._pointsUpdated=!1}get points(){return this._points}get segments(){return this._segments||(this._segments=qM(this,this.options.segment))}first(){const t=this.segments,e=this.points;return t.length&&e[t[0].start]}last(){const t=this.segments,e=this.points,i=t.length;return i&&e[t[i-1].end]}interpolate(t,e){const i=this.options,s=t[e],r=this.points,o=vf(this,{property:e,start:s,end:s});if(!o.length)return;const a=[],l=VS(i);let c,h;for(c=0,h=o.length;c<h;++c){const{start:u,end:d}=o[c],f=r[u],g=r[d];if(f===g){a.push(f);continue}const _=Math.abs((s-f[e])/(g[e]-f[e])),m=l(f,g,_,i.stepped);m[e]=t[e],a.push(m)}return a.length===1?a[0]:a}pathSegment(t,e,i){return yc(this)(t,this,e,i)}path(t,e,i){const s=this.segments,r=yc(this);let o=this._loop;e=e||0,i=i||this.points.length-e;for(const a of s)o&=r(t,this,a,{start:e,end:e+i-1});return!!o}draw(t,e,i,s){const r=this.options||{};(this.points||[]).length&&r.borderWidth&&(t.save(),jS(t,this,i,s),t.restore()),this.animated&&(this._pointsUpdated=!1,this._path=void 0)}}ut(zi,"id","line"),ut(zi,"defaults",{borderCapStyle:"butt",borderDash:[],borderDashOffset:0,borderJoinStyle:"miter",borderWidth:3,capBezierPoints:!0,cubicInterpolationMode:"default",fill:!1,spanGaps:!1,stepped:!1,tension:0}),ut(zi,"defaultRoutes",{backgroundColor:"backgroundColor",borderColor:"borderColor"}),ut(zi,"descriptors",{_scriptable:!0,_indexable:t=>t!=="borderDash"&&t!=="fill"});function up(n,t,e,i){const s=n.options,{[e]:r}=n.getProps([e],i);return Math.abs(t-r)<s.radius+s.hitRadius}class Ta extends zn{constructor(e){super();ut(this,"parsed");ut(this,"skip");ut(this,"stop");this.options=void 0,this.parsed=void 0,this.skip=void 0,this.stop=void 0,e&&Object.assign(this,e)}inRange(e,i,s){const r=this.options,{x:o,y:a}=this.getProps(["x","y"],s);return Math.pow(e-o,2)+Math.pow(i-a,2)<Math.pow(r.hitRadius+r.radius,2)}inXRange(e,i){return up(this,e,"x",i)}inYRange(e,i){return up(this,e,"y",i)}getCenterPoint(e){const{x:i,y:s}=this.getProps(["x","y"],e);return{x:i,y:s}}size(e){e=e||this.options||{};let i=e.radius||0;i=Math.max(i,i&&e.hoverRadius||0);const s=i&&e.borderWidth||0;return(i+s)*2}draw(e,i){const s=this.options;this.skip||s.radius<.1||!mi(this,i,this.size(s)/2)||(e.strokeStyle=s.borderColor,e.lineWidth=s.borderWidth,e.fillStyle=s.backgroundColor,rc(e,s,this.x,this.y))}getRange(){const e=this.options||{};return e.radius+e.hitRadius}}ut(Ta,"id","point"),ut(Ta,"defaults",{borderWidth:1,hitRadius:1,hoverBorderWidth:1,hoverRadius:4,pointStyle:"circle",radius:3,rotation:0}),ut(Ta,"defaultRoutes",{backgroundColor:"backgroundColor",borderColor:"borderColor"});function dp(n,t){const{x:e,y:i,base:s,width:r,height:o}=n.getProps(["x","y","base","width","height"],t);let a,l,c,h,u;return n.horizontal?(u=o/2,a=Math.min(e,s),l=Math.max(e,s),c=i-u,h=i+u):(u=r/2,a=e-u,l=e+u,c=Math.min(i,s),h=Math.max(i,s)),{left:a,top:c,right:l,bottom:h}}function Hi(n,t,e,i){return n?0:ke(t,e,i)}function YS(n,t,e){const i=n.options.borderWidth,s=n.borderSkipped,r=nf(i);return{t:Hi(s.top,r.top,0,e),r:Hi(s.right,r.right,0,t),b:Hi(s.bottom,r.bottom,0,e),l:Hi(s.left,r.left,0,t)}}function qS(n,t,e){const{enableBorderRadius:i}=n.getProps(["enableBorderRadius"]),s=n.options.borderRadius,r=as(s),o=Math.min(t,e),a=n.borderSkipped,l=i||Zt(s);return{topLeft:Hi(!l||a.top||a.left,r.topLeft,0,o),topRight:Hi(!l||a.top||a.right,r.topRight,0,o),bottomLeft:Hi(!l||a.bottom||a.left,r.bottomLeft,0,o),bottomRight:Hi(!l||a.bottom||a.right,r.bottomRight,0,o)}}function $S(n){const t=dp(n),e=t.right-t.left,i=t.bottom-t.top,s=YS(n,e/2,i/2),r=qS(n,e/2,i/2);return{outer:{x:t.left,y:t.top,w:e,h:i,radius:r},inner:{x:t.left+s.l,y:t.top+s.t,w:e-s.l-s.r,h:i-s.t-s.b,radius:{topLeft:Math.max(0,r.topLeft-Math.max(s.t,s.l)),topRight:Math.max(0,r.topRight-Math.max(s.t,s.r)),bottomLeft:Math.max(0,r.bottomLeft-Math.max(s.b,s.l)),bottomRight:Math.max(0,r.bottomRight-Math.max(s.b,s.r))}}}}function Sc(n,t,e,i){const s=t===null,r=e===null,a=n&&!(s&&r)&&dp(n,i);return a&&(s||fi(t,a.left,a.right))&&(r||fi(e,a.top,a.bottom))}function KS(n){return n.topLeft||n.topRight||n.bottomLeft||n.bottomRight}function ZS(n,t){n.rect(t.x,t.y,t.w,t.h)}function Ec(n,t,e={}){const i=n.x!==e.x?-t:0,s=n.y!==e.y?-t:0,r=(n.x+n.w!==e.x+e.w?t:0)-i,o=(n.y+n.h!==e.y+e.h?t:0)-s;return{x:n.x+i,y:n.y+s,w:n.w+r,h:n.h+o,radius:n.radius}}class wa extends zn{constructor(t){super(),this.options=void 0,this.horizontal=void 0,this.base=void 0,this.width=void 0,this.height=void 0,this.inflateAmount=void 0,t&&Object.assign(this,t)}draw(t){const{inflateAmount:e,options:{borderColor:i,backgroundColor:s}}=this,{inner:r,outer:o}=$S(this),a=KS(o.radius)?Ir:ZS;t.save(),(o.w!==r.w||o.h!==r.h)&&(t.beginPath(),a(t,Ec(o,e,r)),t.clip(),a(t,Ec(r,-e,o)),t.fillStyle=i,t.fill("evenodd")),t.beginPath(),a(t,Ec(r,e)),t.fillStyle=s,t.fill(),t.restore()}inRange(t,e,i){return Sc(this,t,e,i)}inXRange(t,e){return Sc(this,t,null,e)}inYRange(t,e){return Sc(this,null,t,e)}getCenterPoint(t){const{x:e,y:i,base:s,horizontal:r}=this.getProps(["x","y","base","horizontal"],t);return{x:r?(e+s)/2:e,y:r?i:(i+s)/2}}getRange(t){return t==="x"?this.width/2:this.height/2}}ut(wa,"id","bar"),ut(wa,"defaults",{borderSkipped:"start",borderWidth:0,borderRadius:0,inflateAmount:"auto",pointStyle:void 0}),ut(wa,"defaultRoutes",{backgroundColor:"backgroundColor",borderColor:"borderColor"});var JS=Object.freeze({__proto__:null,ArcElement:Gr,BarElement:wa,LineElement:zi,PointElement:Ta});const Tc=["rgb(54, 162, 235)","rgb(255, 99, 132)","rgb(255, 159, 64)","rgb(255, 205, 86)","rgb(75, 192, 192)","rgb(153, 102, 255)","rgb(201, 203, 207)"],fp=Tc.map(n=>n.replace("rgb(","rgba(").replace(")",", 0.5)"));function pp(n){return Tc[n%Tc.length]}function mp(n){return fp[n%fp.length]}function QS(n,t){return n.borderColor=pp(t),n.backgroundColor=mp(t),++t}function tE(n,t){return n.backgroundColor=n.data.map(()=>pp(t++)),t}function eE(n,t){return n.backgroundColor=n.data.map(()=>mp(t++)),t}function nE(n){let t=0;return(e,i)=>{const s=n.getDatasetMeta(i).controller;s instanceof us?t=tE(e,t):s instanceof Fr?t=eE(e,t):s&&(t=QS(e,t))}}function gp(n){let t;for(t in n)if(n[t].borderColor||n[t].backgroundColor)return!0;return!1}function iE(n){return n&&(n.borderColor||n.backgroundColor)}var sE={id:"colors",defaults:{enabled:!0,forceOverride:!1},beforeLayout(n,t,e){if(!e.enabled)return;const{data:{datasets:i},options:s}=n.config,{elements:r}=s;if(!e.forceOverride&&(gp(i)||iE(s)||r&&gp(r)))return;const o=nE(n);i.forEach(o)}};function rE(n,t,e,i,s){const r=s.samples||i;if(r>=e)return n.slice(t,t+e);const o=[],a=(e-2)/(r-2);let l=0;const c=t+e-1;let h=t,u,d,f,g,_;for(o[l++]=n[h],u=0;u<r-2;u++){let m=0,p=0,v;const x=Math.floor((u+1)*a)+1+t,y=Math.min(Math.floor((u+2)*a)+1,e)+t,b=y-x;for(v=x;v<y;v++)m+=n[v].x,p+=n[v].y;m/=b,p/=b;const E=Math.floor(u*a)+1+t,S=Math.min(Math.floor((u+1)*a)+1,e)+t,{x:C,y:M}=n[h];for(f=g=-1,v=E;v<S;v++)g=.5*Math.abs((C-m)*(n[v].y-M)-(C-n[v].x)*(p-M)),g>f&&(f=g,d=n[v],_=v);o[l++]=d,h=_}return o[l++]=n[c],o}function oE(n,t,e,i){let s=0,r=0,o,a,l,c,h,u,d,f,g,_;const m=[],p=t+e-1,v=n[t].x,y=n[p].x-v;for(o=t;o<t+e;++o){a=n[o],l=(a.x-v)/y*i,c=a.y;const b=l|0;if(b===h)c<g?(g=c,u=o):c>_&&(_=c,d=o),s=(r*s+a.x)/++r;else{const E=o-1;if(!ee(u)&&!ee(d)){const S=Math.min(u,d),C=Math.max(u,d);S!==f&&S!==E&&m.push({...n[S],x:s}),C!==f&&C!==E&&m.push({...n[C],x:s})}o>0&&E!==f&&m.push(n[E]),m.push(a),h=b,r=0,g=_=c,u=d=f=o}}return m}function _p(n){if(n._decimated){const t=n._data;delete n._decimated,delete n._data,Object.defineProperty(n,"data",{configurable:!0,enumerable:!0,writable:!0,value:t})}}function xp(n){n.data.datasets.forEach(t=>{_p(t)})}function aE(n,t){const e=t.length;let i=0,s;const{iScale:r}=n,{min:o,max:a,minDefined:l,maxDefined:c}=r.getUserBounds();return l&&(i=ke(pi(t,r.axis,o).lo,0,e-1)),c?s=ke(pi(t,r.axis,a).hi+1,i,e)-i:s=e-i,{start:i,count:s}}var lE={id:"decimation",defaults:{algorithm:"min-max",enabled:!1},beforeElementsUpdate:(n,t,e)=>{if(!e.enabled){xp(n);return}const i=n.width;n.data.datasets.forEach((s,r)=>{const{_data:o,indexAxis:a}=s,l=n.getDatasetMeta(r),c=o||s.data;if(Or([a,n.options.indexAxis])==="y"||!l.controller.supportsDecimation)return;const h=n.scales[l.xAxisID];if(h.type!=="linear"&&h.type!=="time"||n.options.parsing)return;let{start:u,count:d}=aE(l,c);const f=e.threshold||4*i;if(d<=f){_p(s);return}ee(o)&&(s._data=c,delete s.data,Object.defineProperty(s,"data",{configurable:!0,enumerable:!0,get:function(){return this._decimated},set:function(_){this._data=_}}));let g;switch(e.algorithm){case"lttb":g=rE(c,u,d,i,e);break;case"min-max":g=oE(c,u,d,i);break;default:throw new Error(`Unsupported decimation algorithm '${e.algorithm}'`)}s._decimated=g})},destroy(n){xp(n)}};function cE(n,t,e){const i=n.segments,s=n.points,r=t.points,o=[];for(const a of i){let{start:l,end:c}=a;c=Ac(l,c,s);const h=wc(e,s[l],s[c],a.loop);if(!t.segments){o.push({source:a,target:h,start:s[l],end:s[c]});continue}const u=vf(t,h);for(const d of u){const f=wc(e,r[d.start],r[d.end],d.loop),g=xf(a,s,f);for(const _ of g)o.push({source:_,target:d,start:{[e]:vp(h,f,"start",Math.max)},end:{[e]:vp(h,f,"end",Math.min)}})}}return o}function wc(n,t,e,i){if(i)return;let s=t[n],r=e[n];return n==="angle"&&(s=_n(s),r=_n(r)),{property:n,start:s,end:r}}function hE(n,t){const{x:e=null,y:i=null}=n||{},s=t.points,r=[];return t.segments.forEach(({start:o,end:a})=>{a=Ac(o,a,s);const l=s[o],c=s[a];i!==null?(r.push({x:l.x,y:i}),r.push({x:c.x,y:i})):e!==null&&(r.push({x:e,y:l.y}),r.push({x:e,y:c.y}))}),r}function Ac(n,t,e){for(;t>n;t--){const i=e[t];if(!isNaN(i.x)&&!isNaN(i.y))break}return t}function vp(n,t,e,i){return n&&t?i(n[e],t[e]):n?n[e]:t?t[e]:0}function bp(n,t){let e=[],i=!1;return _e(n)?(i=!0,e=n):e=hE(n,t),e.length?new zi({points:e,options:{tension:0},_loop:i,_fullLoop:i}):null}function Mp(n){return n&&n.fill!==!1}function uE(n,t,e){let s=n[t].fill;const r=[t];let o;if(!e)return s;for(;s!==!1&&r.indexOf(s)===-1;){if(!be(s))return s;if(o=n[s],!o)return!1;if(o.visible)return s;r.push(s),s=o.fill}return!1}function dE(n,t,e){const i=gE(n);if(Zt(i))return isNaN(i.value)?!1:i;let s=parseFloat(i);return be(s)&&Math.floor(s)===s?fE(i[0],t,s,e):["origin","start","end","stack","shape"].indexOf(i)>=0&&i}function fE(n,t,e,i){return(n==="-"||n==="+")&&(e=t+e),e===t||e<0||e>=i?!1:e}function pE(n,t){let e=null;return n==="start"?e=t.bottom:n==="end"?e=t.top:Zt(n)?e=t.getPixelForValue(n.value):t.getBasePixel&&(e=t.getBasePixel()),e}function mE(n,t,e){let i;return n==="start"?i=e:n==="end"?i=t.options.reverse?t.min:t.max:Zt(n)?i=n.value:i=t.getBaseValue(),i}function gE(n){const t=n.options,e=t.fill;let i=kt(e&&e.target,e);return i===void 0&&(i=!!t.backgroundColor),i===!1||i===null?!1:i===!0?"origin":i}function _E(n){const{scale:t,index:e,line:i}=n,s=[],r=i.segments,o=i.points,a=xE(t,e);a.push(bp({x:null,y:t.bottom},i));for(let l=0;l<r.length;l++){const c=r[l];for(let h=c.start;h<=c.end;h++)vE(s,o[h],a)}return new zi({points:s,options:{}})}function xE(n,t){const e=[],i=n.getMatchingVisibleMetas("line");for(let s=0;s<i.length;s++){const r=i[s];if(r.index===t)break;r.hidden||e.unshift(r.dataset)}return e}function vE(n,t,e){const i=[];for(let s=0;s<e.length;s++){const r=e[s],{first:o,last:a,point:l}=bE(r,t,"x");if(!(!l||o&&a)){if(o)i.unshift(l);else if(n.push(l),!a)break}}n.push(...i)}function bE(n,t,e){const i=n.interpolate(t,e);if(!i)return{};const s=i[e],r=n.segments,o=n.points;let a=!1,l=!1;for(let c=0;c<r.length;c++){const h=r[c],u=o[h.start][e],d=o[h.end][e];if(fi(s,u,d)){a=s===u,l=s===d;break}}return{first:a,last:l,point:i}}class yp{constructor(t){this.x=t.x,this.y=t.y,this.radius=t.radius}pathSegment(t,e,i){const{x:s,y:r,radius:o}=this;return e=e||{start:0,end:pe},t.arc(s,r,o,e.end,e.start,!0),!i.bounds}interpolate(t){const{x:e,y:i,radius:s}=this,r=t.angle;return{x:e+Math.cos(r)*s,y:i+Math.sin(r)*s,angle:r}}}function ME(n){const{chart:t,fill:e,line:i}=n;if(be(e))return yE(t,e);if(e==="stack")return _E(n);if(e==="shape")return!0;const s=SE(n);return s instanceof yp?s:bp(s,i)}function yE(n,t){const e=n.getDatasetMeta(t);return e&&n.isDatasetVisible(t)?e.dataset:null}function SE(n){return(n.scale||{}).getPointPositionForValue?TE(n):EE(n)}function EE(n){const{scale:t={},fill:e}=n,i=pE(e,t);if(be(i)){const s=t.isHorizontal();return{x:s?i:null,y:s?null:i}}return null}function TE(n){const{scale:t,fill:e}=n,i=t.options,s=t.getLabels().length,r=i.reverse?t.max:t.min,o=mE(e,t,r),a=[];if(i.grid.circular){const l=t.getPointPositionForValue(0,r);return new yp({x:l.x,y:l.y,radius:t.getDistanceFromCenterForValue(o)})}for(let l=0;l<s;++l)a.push(t.getPointPositionForValue(l,o));return a}function Cc(n,t,e){const i=ME(t),{line:s,scale:r,axis:o}=t,a=s.options,l=a.fill,c=a.backgroundColor,{above:h=c,below:u=c}=l||{};i&&s.points.length&&(sa(n,e),wE(n,{line:s,target:i,above:h,below:u,area:e,scale:r,axis:o}),ra(n))}function wE(n,t){const{line:e,target:i,above:s,below:r,area:o,scale:a}=t,l=e._loop?"angle":t.axis;n.save(),l==="x"&&r!==s&&(Sp(n,i,o.top),Ep(n,{line:e,target:i,color:s,scale:a,property:l}),n.restore(),n.save(),Sp(n,i,o.bottom)),Ep(n,{line:e,target:i,color:r,scale:a,property:l}),n.restore()}function Sp(n,t,e){const{segments:i,points:s}=t;let r=!0,o=!1;n.beginPath();for(const a of i){const{start:l,end:c}=a,h=s[l],u=s[Ac(l,c,s)];r?(n.moveTo(h.x,h.y),r=!1):(n.lineTo(h.x,e),n.lineTo(h.x,h.y)),o=!!t.pathSegment(n,a,{move:o}),o?n.closePath():n.lineTo(u.x,e)}n.lineTo(t.first().x,e),n.closePath(),n.clip()}function Ep(n,t){const{line:e,target:i,property:s,color:r,scale:o}=t,a=cE(e,i,s);for(const{source:l,target:c,start:h,end:u}of a){const{style:{backgroundColor:d=r}={}}=l,f=i!==!0;n.save(),n.fillStyle=d,AE(n,o,f&&wc(s,h,u)),n.beginPath();const g=!!e.pathSegment(n,l);let _;if(f){g?n.closePath():Tp(n,i,u,s);const m=!!i.pathSegment(n,c,{move:g,reverse:!0});_=g&&m,_||Tp(n,i,h,s)}n.closePath(),n.fill(_?"evenodd":"nonzero"),n.restore()}}function AE(n,t,e){const{top:i,bottom:s}=t.chart.chartArea,{property:r,start:o,end:a}=e||{};r==="x"&&(n.beginPath(),n.rect(o,i,a-o,s-i),n.clip())}function Tp(n,t,e,i){const s=t.interpolate(e,i);s&&n.lineTo(s.x,s.y)}var CE={id:"filler",afterDatasetsUpdate(n,t,e){const i=(n.data.datasets||[]).length,s=[];let r,o,a,l;for(o=0;o<i;++o)r=n.getDatasetMeta(o),a=r.dataset,l=null,a&&a.options&&a instanceof zi&&(l={visible:n.isDatasetVisible(o),index:o,fill:dE(a,o,i),chart:n,axis:r.controller.options.indexAxis,scale:r.vScale,line:a}),r.$filler=l,s.push(l);for(o=0;o<i;++o)l=s[o],!(!l||l.fill===!1)&&(l.fill=uE(s,o,e.propagate))},beforeDraw(n,t,e){const i=e.drawTime==="beforeDraw",s=n.getSortedVisibleDatasetMetas(),r=n.chartArea;for(let o=s.length-1;o>=0;--o){const a=s[o].$filler;a&&(a.line.updateControlPoints(r,a.axis),i&&a.fill&&Cc(n.ctx,a,r))}},beforeDatasetsDraw(n,t,e){if(e.drawTime!=="beforeDatasetsDraw")return;const i=n.getSortedVisibleDatasetMetas();for(let s=i.length-1;s>=0;--s){const r=i[s].$filler;Mp(r)&&Cc(n.ctx,r,n.chartArea)}},beforeDatasetDraw(n,t,e){const i=t.meta.$filler;!Mp(i)||e.drawTime!=="beforeDatasetDraw"||Cc(n.ctx,i,n.chartArea)},defaults:{propagate:!0,drawTime:"beforeDatasetDraw"}};const wp=(n,t)=>{let{boxHeight:e=t,boxWidth:i=t}=n;return n.usePointStyle&&(e=Math.min(e,t),i=n.pointStyleWidth||Math.min(i,t)),{boxWidth:i,boxHeight:e,itemHeight:Math.max(t,e)}},RE=(n,t)=>n!==null&&t!==null&&n.datasetIndex===t.datasetIndex&&n.index===t.index;class Ap extends zn{constructor(t){super(),this._added=!1,this.legendHitBoxes=[],this._hoveredItem=null,this.doughnutMode=!1,this.chart=t.chart,this.options=t.options,this.ctx=t.ctx,this.legendItems=void 0,this.columnSizes=void 0,this.lineWidths=void 0,this.maxHeight=void 0,this.maxWidth=void 0,this.top=void 0,this.bottom=void 0,this.left=void 0,this.right=void 0,this.height=void 0,this.width=void 0,this._margins=void 0,this.position=void 0,this.weight=void 0,this.fullSize=void 0}update(t,e,i){this.maxWidth=t,this.maxHeight=e,this._margins=i,this.setDimensions(),this.buildLabels(),this.fit()}setDimensions(){this.isHorizontal()?(this.width=this.maxWidth,this.left=this._margins.left,this.right=this.width):(this.height=this.maxHeight,this.top=this._margins.top,this.bottom=this.height)}buildLabels(){const t=this.options.labels||{};let e=ue(t.generateLabels,[this.chart],this)||[];t.filter&&(e=e.filter(i=>t.filter(i,this.chart.data))),t.sort&&(e=e.sort((i,s)=>t.sort(i,s,this.chart.data))),this.options.reverse&&e.reverse(),this.legendItems=e}fit(){const{options:t,ctx:e}=this;if(!t.display){this.width=this.height=0;return}const i=t.labels,s=De(i.font),r=s.size,o=this._computeTitleHeight(),{boxWidth:a,itemHeight:l}=wp(i,r);let c,h;e.font=s.string,this.isHorizontal()?(c=this.maxWidth,h=this._fitRows(o,r,a,l)+10):(h=this.maxHeight,c=this._fitCols(o,s,a,l)+10),this.width=Math.min(c,t.maxWidth||this.maxWidth),this.height=Math.min(h,t.maxHeight||this.maxHeight)}_fitRows(t,e,i,s){const{ctx:r,maxWidth:o,options:{labels:{padding:a}}}=this,l=this.legendHitBoxes=[],c=this.lineWidths=[0],h=s+a;let u=t;r.textAlign="left",r.textBaseline="middle";let d=-1,f=-h;return this.legendItems.forEach((g,_)=>{const m=i+e/2+r.measureText(g.text).width;(_===0||c[c.length-1]+m+2*a>o)&&(u+=h,c[c.length-(_>0?0:1)]=0,f+=h,d++),l[_]={left:0,top:f,row:d,width:m,height:s},c[c.length-1]+=m+a}),u}_fitCols(t,e,i,s){const{ctx:r,maxHeight:o,options:{labels:{padding:a}}}=this,l=this.legendHitBoxes=[],c=this.columnSizes=[],h=o-t;let u=a,d=0,f=0,g=0,_=0;return this.legendItems.forEach((m,p)=>{const{itemWidth:v,itemHeight:x}=PE(i,e,r,m,s);p>0&&f+x+2*a>h&&(u+=d+a,c.push({width:d,height:f}),g+=d+a,_++,d=f=0),l[p]={left:g,top:f,col:_,width:v,height:x},d=Math.max(d,v),f+=x+a}),u+=d,c.push({width:d,height:f}),u}adjustHitBoxes(){if(!this.options.display)return;const t=this._computeTitleHeight(),{legendHitBoxes:e,options:{align:i,labels:{padding:s},rtl:r}}=this,o=ir(r,this.left,this.width);if(this.isHorizontal()){let a=0,l=Ye(i,this.left+s,this.right-this.lineWidths[a]);for(const c of e)a!==c.row&&(a=c.row,l=Ye(i,this.left+s,this.right-this.lineWidths[a])),c.top+=this.top+t+s,c.left=o.leftForLtr(o.x(l),c.width),l+=c.width+s}else{let a=0,l=Ye(i,this.top+t+s,this.bottom-this.columnSizes[a].height);for(const c of e)c.col!==a&&(a=c.col,l=Ye(i,this.top+t+s,this.bottom-this.columnSizes[a].height)),c.top=l,c.left+=this.left+s,c.left=o.leftForLtr(o.x(c.left),c.width),l+=c.height+s}}isHorizontal(){return this.options.position==="top"||this.options.position==="bottom"}draw(){if(this.options.display){const t=this.ctx;sa(t,this),this._draw(),ra(t)}}_draw(){const{options:t,columnSizes:e,lineWidths:i,ctx:s}=this,{align:r,labels:o}=t,a=Me.color,l=ir(t.rtl,this.left,this.width),c=De(o.font),{padding:h}=o,u=c.size,d=u/2;let f;this.drawTitle(),s.textAlign=l.textAlign("left"),s.textBaseline="middle",s.lineWidth=.5,s.font=c.string;const{boxWidth:g,boxHeight:_,itemHeight:m}=wp(o,u),p=function(E,S,C){if(isNaN(g)||g<=0||isNaN(_)||_<0)return;s.save();const M=kt(C.lineWidth,1);if(s.fillStyle=kt(C.fillStyle,a),s.lineCap=kt(C.lineCap,"butt"),s.lineDashOffset=kt(C.lineDashOffset,0),s.lineJoin=kt(C.lineJoin,"miter"),s.lineWidth=M,s.strokeStyle=kt(C.strokeStyle,a),s.setLineDash(kt(C.lineDash,[])),o.usePointStyle){const w={radius:_*Math.SQRT2/2,pointStyle:C.pointStyle,rotation:C.rotation,borderWidth:M},U=l.xPlus(E,g/2),O=S+d;ef(s,w,U,O,o.pointStyleWidth&&g)}else{const w=S+Math.max((u-_)/2,0),U=l.leftForLtr(E,g),O=as(C.borderRadius);s.beginPath(),Object.values(O).some(Z=>Z!==0)?Ir(s,{x:U,y:w,w:g,h:_,radius:O}):s.rect(U,w,g,_),s.fill(),M!==0&&s.stroke()}s.restore()},v=function(E,S,C){os(s,C.text,E,S+m/2,c,{strikethrough:C.hidden,textAlign:l.textAlign(C.textAlign)})},x=this.isHorizontal(),y=this._computeTitleHeight();x?f={x:Ye(r,this.left+h,this.right-i[0]),y:this.top+h+y,line:0}:f={x:this.left+h,y:Ye(r,this.top+y+h,this.bottom-e[0].height),line:0},pf(this.ctx,t.textDirection);const b=m+h;this.legendItems.forEach((E,S)=>{s.strokeStyle=E.fontColor,s.fillStyle=E.fontColor;const C=s.measureText(E.text).width,M=l.textAlign(E.textAlign||(E.textAlign=o.textAlign)),w=g+d+C;let U=f.x,O=f.y;l.setWidth(this.width),x?S>0&&U+w+h>this.right&&(O=f.y+=b,f.line++,U=f.x=Ye(r,this.left+h,this.right-i[f.line])):S>0&&O+b>this.bottom&&(U=f.x=U+e[f.line].width+h,f.line++,O=f.y=Ye(r,this.top+y+h,this.bottom-e[f.line].height));const Z=l.x(U);if(p(Z,O,E),U=Zb(M,U+g+d,x?U+w:this.right,t.rtl),v(l.x(U),O,E),x)f.x+=w+h;else if(typeof E.text!="string"){const D=c.lineHeight;f.y+=Cp(E,D)+h}else f.y+=b}),mf(this.ctx,t.textDirection)}drawTitle(){const t=this.options,e=t.title,i=De(e.font),s=qe(e.padding);if(!e.display)return;const r=ir(t.rtl,this.left,this.width),o=this.ctx,a=e.position,l=i.size/2,c=s.top+l;let h,u=this.left,d=this.width;if(this.isHorizontal())d=Math.max(...this.lineWidths),h=this.top+c,u=Ye(t.align,u,this.right-d);else{const g=this.columnSizes.reduce((_,m)=>Math.max(_,m.height),0);h=c+Ye(t.align,this.top,this.bottom-g-t.labels.padding-this._computeTitleHeight())}const f=Ye(a,u,u+d);o.textAlign=r.textAlign(tc(a)),o.textBaseline="middle",o.strokeStyle=e.color,o.fillStyle=e.color,o.font=i.string,os(o,e.text,f,h,i)}_computeTitleHeight(){const t=this.options.title,e=De(t.font),i=qe(t.padding);return t.display?e.lineHeight+i.height:0}_getLegendItemAt(t,e){let i,s,r;if(fi(t,this.left,this.right)&&fi(e,this.top,this.bottom)){for(r=this.legendHitBoxes,i=0;i<r.length;++i)if(s=r[i],fi(t,s.left,s.left+s.width)&&fi(e,s.top,s.top+s.height))return this.legendItems[i]}return null}handleEvent(t){const e=this.options;if(!IE(t.type,e))return;const i=this._getLegendItemAt(t.x,t.y);if(t.type==="mousemove"||t.type==="mouseout"){const s=this._hoveredItem,r=RE(s,i);s&&!r&&ue(e.onLeave,[t,s,this],this),this._hoveredItem=i,i&&!r&&ue(e.onHover,[t,i,this],this)}else i&&ue(e.onClick,[t,i,this],this)}}function PE(n,t,e,i,s){const r=LE(i,n,t,e),o=DE(s,i,t.lineHeight);return{itemWidth:r,itemHeight:o}}function LE(n,t,e,i){let s=n.text;return s&&typeof s!="string"&&(s=s.reduce((r,o)=>r.length>o.length?r:o)),t+e.size/2+i.measureText(s).width}function DE(n,t,e){let i=n;return typeof t.text!="string"&&(i=Cp(t,e)),i}function Cp(n,t){const e=n.text?n.text.length:0;return t*e}function IE(n,t){return!!((n==="mousemove"||n==="mouseout")&&(t.onHover||t.onLeave)||t.onClick&&(n==="click"||n==="mouseup"))}var OE={id:"legend",_element:Ap,start(n,t,e){const i=n.legend=new Ap({ctx:n.ctx,options:e,chart:n});$e.configure(n,i,e),$e.addBox(n,i)},stop(n){$e.removeBox(n,n.legend),delete n.legend},beforeUpdate(n,t,e){const i=n.legend;$e.configure(n,i,e),i.options=e},afterUpdate(n){const t=n.legend;t.buildLabels(),t.adjustHitBoxes()},afterEvent(n,t){t.replay||n.legend.handleEvent(t.event)},defaults:{display:!0,position:"top",align:"center",fullSize:!0,reverse:!1,weight:1e3,onClick(n,t,e){const i=t.datasetIndex,s=e.chart;s.isDatasetVisible(i)?(s.hide(i),t.hidden=!0):(s.show(i),t.hidden=!1)},onHover:null,onLeave:null,labels:{color:n=>n.chart.options.color,boxWidth:40,padding:10,generateLabels(n){const t=n.data.datasets,{labels:{usePointStyle:e,pointStyle:i,textAlign:s,color:r,useBorderRadius:o,borderRadius:a}}=n.legend.options;return n._getSortedDatasetMetas().map(l=>{const c=l.controller.getStyle(e?0:void 0),h=qe(c.borderWidth);return{text:t[l.index].label,fillStyle:c.backgroundColor,fontColor:r,hidden:!l.visible,lineCap:c.borderCapStyle,lineDash:c.borderDash,lineDashOffset:c.borderDashOffset,lineJoin:c.borderJoinStyle,lineWidth:(h.width+h.height)/4,strokeStyle:c.borderColor,pointStyle:i||c.pointStyle,rotation:c.rotation,textAlign:s||c.textAlign,borderRadius:o&&(a||c.borderRadius),datasetIndex:l.index}},this)}},title:{color:n=>n.chart.options.color,display:!1,position:"center",text:""}},descriptors:{_scriptable:n=>!n.startsWith("on"),labels:{_scriptable:n=>!["generateLabels","filter","sort"].includes(n)}}};class Rc extends zn{constructor(t){super(),this.chart=t.chart,this.options=t.options,this.ctx=t.ctx,this._padding=void 0,this.top=void 0,this.bottom=void 0,this.left=void 0,this.right=void 0,this.width=void 0,this.height=void 0,this.position=void 0,this.weight=void 0,this.fullSize=void 0}update(t,e){const i=this.options;if(this.left=0,this.top=0,!i.display){this.width=this.height=this.right=this.bottom=0;return}this.width=this.right=t,this.height=this.bottom=e;const s=_e(i.text)?i.text.length:1;this._padding=qe(i.padding);const r=s*De(i.font).lineHeight+this._padding.height;this.isHorizontal()?this.height=r:this.width=r}isHorizontal(){const t=this.options.position;return t==="top"||t==="bottom"}_drawArgs(t){const{top:e,left:i,bottom:s,right:r,options:o}=this,a=o.align;let l=0,c,h,u;return this.isHorizontal()?(h=Ye(a,i,r),u=e+t,c=r-i):(o.position==="left"?(h=i+t,u=Ye(a,s,e),l=fe*-.5):(h=r-t,u=Ye(a,e,s),l=fe*.5),c=s-e),{titleX:h,titleY:u,maxWidth:c,rotation:l}}draw(){const t=this.ctx,e=this.options;if(!e.display)return;const i=De(e.font),r=i.lineHeight/2+this._padding.top,{titleX:o,titleY:a,maxWidth:l,rotation:c}=this._drawArgs(r);os(t,e.text,0,0,i,{color:e.color,maxWidth:l,rotation:c,textAlign:tc(e.align),textBaseline:"middle",translation:[o,a]})}}function UE(n,t){const e=new Rc({ctx:n.ctx,options:t,chart:n});$e.configure(n,e,t),$e.addBox(n,e),n.titleBlock=e}var FE={id:"title",_element:Rc,start(n,t,e){UE(n,e)},stop(n){const t=n.titleBlock;$e.removeBox(n,t),delete n.titleBlock},beforeUpdate(n,t,e){const i=n.titleBlock;$e.configure(n,i,e),i.options=e},defaults:{align:"center",display:!1,font:{weight:"bold"},fullSize:!0,padding:10,position:"top",text:"",weight:2e3},defaultRoutes:{color:"color"},descriptors:{_scriptable:!0,_indexable:!1}};const Aa=new WeakMap;var NE={id:"subtitle",start(n,t,e){const i=new Rc({ctx:n.ctx,options:e,chart:n});$e.configure(n,i,e),$e.addBox(n,i),Aa.set(n,i)},stop(n){$e.removeBox(n,Aa.get(n)),Aa.delete(n)},beforeUpdate(n,t,e){const i=Aa.get(n);$e.configure(n,i,e),i.options=e},defaults:{align:"center",display:!1,font:{weight:"normal"},fullSize:!0,padding:0,position:"top",text:"",weight:1500},defaultRoutes:{color:"color"},descriptors:{_scriptable:!0,_indexable:!1}};const Wr={average(n){if(!n.length)return!1;let t,e,i=0,s=0,r=0;for(t=0,e=n.length;t<e;++t){const o=n[t].element;if(o&&o.hasValue()){const a=o.tooltipPosition();i+=a.x,s+=a.y,++r}}return{x:i/r,y:s/r}},nearest(n,t){if(!n.length)return!1;let e=t.x,i=t.y,s=Number.POSITIVE_INFINITY,r,o,a;for(r=0,o=n.length;r<o;++r){const l=n[r].element;if(l&&l.hasValue()){const c=l.getCenterPoint(),h=Jl(t,c);h<s&&(s=h,a=l)}}if(a){const l=a.tooltipPosition();e=l.x,i=l.y}return{x:e,y:i}}};function jn(n,t){return t&&(_e(t)?Array.prototype.push.apply(n,t):n.push(t)),n}function _i(n){return(typeof n=="string"||n instanceof String)&&n.indexOf(`
`)>-1?n.split(`
`):n}function kE(n,t){const{element:e,datasetIndex:i,index:s}=t,r=n.getDatasetMeta(i).controller,{label:o,value:a}=r.getLabelAndValue(s);return{chart:n,label:o,parsed:r.getParsed(s),raw:n.data.datasets[i].data[s],formattedValue:a,dataset:r.getDataset(),dataIndex:s,datasetIndex:i,element:e}}function Rp(n,t){const e=n.chart.ctx,{body:i,footer:s,title:r}=n,{boxWidth:o,boxHeight:a}=t,l=De(t.bodyFont),c=De(t.titleFont),h=De(t.footerFont),u=r.length,d=s.length,f=i.length,g=qe(t.padding);let _=g.height,m=0,p=i.reduce((y,b)=>y+b.before.length+b.lines.length+b.after.length,0);if(p+=n.beforeBody.length+n.afterBody.length,u&&(_+=u*c.lineHeight+(u-1)*t.titleSpacing+t.titleMarginBottom),p){const y=t.displayColors?Math.max(a,l.lineHeight):l.lineHeight;_+=f*y+(p-f)*l.lineHeight+(p-1)*t.bodySpacing}d&&(_+=t.footerMarginTop+d*h.lineHeight+(d-1)*t.footerSpacing);let v=0;const x=function(y){m=Math.max(m,e.measureText(y).width+v)};return e.save(),e.font=c.string,oe(n.title,x),e.font=l.string,oe(n.beforeBody.concat(n.afterBody),x),v=t.displayColors?o+2+t.boxPadding:0,oe(i,y=>{oe(y.before,x),oe(y.lines,x),oe(y.after,x)}),v=0,e.font=h.string,oe(n.footer,x),e.restore(),m+=g.width,{width:m,height:_}}function BE(n,t){const{y:e,height:i}=t;return e<i/2?"top":e>n.height-i/2?"bottom":"center"}function zE(n,t,e,i){const{x:s,width:r}=i,o=e.caretSize+e.caretPadding;if(n==="left"&&s+r+o>t.width||n==="right"&&s-r-o<0)return!0}function HE(n,t,e,i){const{x:s,width:r}=e,{width:o,chartArea:{left:a,right:l}}=n;let c="center";return i==="center"?c=s<=(a+l)/2?"left":"right":s<=r/2?c="left":s>=o-r/2&&(c="right"),zE(c,n,t,e)&&(c="center"),c}function Pp(n,t,e){const i=e.yAlign||t.yAlign||BE(n,e);return{xAlign:e.xAlign||t.xAlign||HE(n,t,e,i),yAlign:i}}function VE(n,t){let{x:e,width:i}=n;return t==="right"?e-=i:t==="center"&&(e-=i/2),e}function GE(n,t,e){let{y:i,height:s}=n;return t==="top"?i+=e:t==="bottom"?i-=s+e:i-=s/2,i}function Lp(n,t,e,i){const{caretSize:s,caretPadding:r,cornerRadius:o}=n,{xAlign:a,yAlign:l}=e,c=s+r,{topLeft:h,topRight:u,bottomLeft:d,bottomRight:f}=as(o);let g=VE(t,a);const _=GE(t,l,c);return l==="center"?a==="left"?g+=c:a==="right"&&(g-=c):a==="left"?g-=Math.max(h,d)+s:a==="right"&&(g+=Math.max(u,f)+s),{x:ke(g,0,i.width-t.width),y:ke(_,0,i.height-t.height)}}function Ca(n,t,e){const i=qe(e.padding);return t==="center"?n.x+n.width/2:t==="right"?n.x+n.width-i.right:n.x+i.left}function Dp(n){return jn([],_i(n))}function WE(n,t,e){return Bi(n,{tooltip:t,tooltipItems:e,type:"tooltip"})}function Ip(n,t){const e=t&&t.dataset&&t.dataset.tooltip&&t.dataset.tooltip.callbacks;return e?n.override(e):n}const Op={beforeTitle:di,title(n){if(n.length>0){const t=n[0],e=t.chart.data.labels,i=e?e.length:0;if(this&&this.options&&this.options.mode==="dataset")return t.dataset.label||"";if(t.label)return t.label;if(i>0&&t.dataIndex<i)return e[t.dataIndex]}return""},afterTitle:di,beforeBody:di,beforeLabel:di,label(n){if(this&&this.options&&this.options.mode==="dataset")return n.label+": "+n.formattedValue||n.formattedValue;let t=n.dataset.label||"";t&&(t+=": ");const e=n.formattedValue;return ee(e)||(t+=e),t},labelColor(n){const e=n.chart.getDatasetMeta(n.datasetIndex).controller.getStyle(n.dataIndex);return{borderColor:e.borderColor,backgroundColor:e.backgroundColor,borderWidth:e.borderWidth,borderDash:e.borderDash,borderDashOffset:e.borderDashOffset,borderRadius:0}},labelTextColor(){return this.options.bodyColor},labelPointStyle(n){const e=n.chart.getDatasetMeta(n.datasetIndex).controller.getStyle(n.dataIndex);return{pointStyle:e.pointStyle,rotation:e.rotation}},afterLabel:di,afterBody:di,beforeFooter:di,footer:di,afterFooter:di};function ln(n,t,e,i){const s=n[t].call(e,i);return typeof s>"u"?Op[t].call(e,i):s}class Pc extends zn{constructor(t){super(),this.opacity=0,this._active=[],this._eventPosition=void 0,this._size=void 0,this._cachedAnimations=void 0,this._tooltipItems=[],this.$animations=void 0,this.$context=void 0,this.chart=t.chart,this.options=t.options,this.dataPoints=void 0,this.title=void 0,this.beforeBody=void 0,this.body=void 0,this.afterBody=void 0,this.footer=void 0,this.xAlign=void 0,this.yAlign=void 0,this.x=void 0,this.y=void 0,this.height=void 0,this.width=void 0,this.caretX=void 0,this.caretY=void 0,this.labelColors=void 0,this.labelPointStyles=void 0,this.labelTextColors=void 0}initialize(t){this.options=t,this._cachedAnimations=void 0,this.$context=void 0}_resolveAnimations(){const t=this._cachedAnimations;if(t)return t;const e=this.chart,i=this.options.setContext(this.getContext()),s=i.enabled&&e.options.animation&&i.animations,r=new Sf(this.chart,s);return s._cacheable&&(this._cachedAnimations=Object.freeze(r)),r}getContext(){return this.$context||(this.$context=WE(this.chart.getContext(),this,this._tooltipItems))}getTitle(t,e){const{callbacks:i}=e,s=ln(i,"beforeTitle",this,t),r=ln(i,"title",this,t),o=ln(i,"afterTitle",this,t);let a=[];return a=jn(a,_i(s)),a=jn(a,_i(r)),a=jn(a,_i(o)),a}getBeforeBody(t,e){return Dp(ln(e.callbacks,"beforeBody",this,t))}getBody(t,e){const{callbacks:i}=e,s=[];return oe(t,r=>{const o={before:[],lines:[],after:[]},a=Ip(i,r);jn(o.before,_i(ln(a,"beforeLabel",this,r))),jn(o.lines,ln(a,"label",this,r)),jn(o.after,_i(ln(a,"afterLabel",this,r))),s.push(o)}),s}getAfterBody(t,e){return Dp(ln(e.callbacks,"afterBody",this,t))}getFooter(t,e){const{callbacks:i}=e,s=ln(i,"beforeFooter",this,t),r=ln(i,"footer",this,t),o=ln(i,"afterFooter",this,t);let a=[];return a=jn(a,_i(s)),a=jn(a,_i(r)),a=jn(a,_i(o)),a}_createItems(t){const e=this._active,i=this.chart.data,s=[],r=[],o=[];let a=[],l,c;for(l=0,c=e.length;l<c;++l)a.push(kE(this.chart,e[l]));return t.filter&&(a=a.filter((h,u,d)=>t.filter(h,u,d,i))),t.itemSort&&(a=a.sort((h,u)=>t.itemSort(h,u,i))),oe(a,h=>{const u=Ip(t.callbacks,h);s.push(ln(u,"labelColor",this,h)),r.push(ln(u,"labelPointStyle",this,h)),o.push(ln(u,"labelTextColor",this,h))}),this.labelColors=s,this.labelPointStyles=r,this.labelTextColors=o,this.dataPoints=a,a}update(t,e){const i=this.options.setContext(this.getContext()),s=this._active;let r,o=[];if(!s.length)this.opacity!==0&&(r={opacity:0});else{const a=Wr[i.position].call(this,s,this._eventPosition);o=this._createItems(i),this.title=this.getTitle(o,i),this.beforeBody=this.getBeforeBody(o,i),this.body=this.getBody(o,i),this.afterBody=this.getAfterBody(o,i),this.footer=this.getFooter(o,i);const l=this._size=Rp(this,i),c=Object.assign({},a,l),h=Pp(this.chart,i,c),u=Lp(i,c,h,this.chart);this.xAlign=h.xAlign,this.yAlign=h.yAlign,r={opacity:1,x:u.x,y:u.y,width:l.width,height:l.height,caretX:a.x,caretY:a.y}}this._tooltipItems=o,this.$context=void 0,r&&this._resolveAnimations().update(this,r),t&&i.external&&i.external.call(this,{chart:this.chart,tooltip:this,replay:e})}drawCaret(t,e,i,s){const r=this.getCaretPosition(t,i,s);e.lineTo(r.x1,r.y1),e.lineTo(r.x2,r.y2),e.lineTo(r.x3,r.y3)}getCaretPosition(t,e,i){const{xAlign:s,yAlign:r}=this,{caretSize:o,cornerRadius:a}=i,{topLeft:l,topRight:c,bottomLeft:h,bottomRight:u}=as(a),{x:d,y:f}=t,{width:g,height:_}=e;let m,p,v,x,y,b;return r==="center"?(y=f+_/2,s==="left"?(m=d,p=m-o,x=y+o,b=y-o):(m=d+g,p=m+o,x=y-o,b=y+o),v=m):(s==="left"?p=d+Math.max(l,h)+o:s==="right"?p=d+g-Math.max(c,u)-o:p=this.caretX,r==="top"?(x=f,y=x-o,m=p-o,v=p+o):(x=f+_,y=x+o,m=p+o,v=p-o),b=x),{x1:m,x2:p,x3:v,y1:x,y2:y,y3:b}}drawTitle(t,e,i){const s=this.title,r=s.length;let o,a,l;if(r){const c=ir(i.rtl,this.x,this.width);for(t.x=Ca(this,i.titleAlign,i),e.textAlign=c.textAlign(i.titleAlign),e.textBaseline="middle",o=De(i.titleFont),a=i.titleSpacing,e.fillStyle=i.titleColor,e.font=o.string,l=0;l<r;++l)e.fillText(s[l],c.x(t.x),t.y+o.lineHeight/2),t.y+=o.lineHeight+a,l+1===r&&(t.y+=i.titleMarginBottom-a)}}_drawColorBox(t,e,i,s,r){const o=this.labelColors[i],a=this.labelPointStyles[i],{boxHeight:l,boxWidth:c}=r,h=De(r.bodyFont),u=Ca(this,"left",r),d=s.x(u),f=l<h.lineHeight?(h.lineHeight-l)/2:0,g=e.y+f;if(r.usePointStyle){const _={radius:Math.min(c,l)/2,pointStyle:a.pointStyle,rotation:a.rotation,borderWidth:1},m=s.leftForLtr(d,c)+c/2,p=g+l/2;t.strokeStyle=r.multiKeyBackground,t.fillStyle=r.multiKeyBackground,rc(t,_,m,p),t.strokeStyle=o.borderColor,t.fillStyle=o.backgroundColor,rc(t,_,m,p)}else{t.lineWidth=Zt(o.borderWidth)?Math.max(...Object.values(o.borderWidth)):o.borderWidth||1,t.strokeStyle=o.borderColor,t.setLineDash(o.borderDash||[]),t.lineDashOffset=o.borderDashOffset||0;const _=s.leftForLtr(d,c),m=s.leftForLtr(s.xPlus(d,1),c-2),p=as(o.borderRadius);Object.values(p).some(v=>v!==0)?(t.beginPath(),t.fillStyle=r.multiKeyBackground,Ir(t,{x:_,y:g,w:c,h:l,radius:p}),t.fill(),t.stroke(),t.fillStyle=o.backgroundColor,t.beginPath(),Ir(t,{x:m,y:g+1,w:c-2,h:l-2,radius:p}),t.fill()):(t.fillStyle=r.multiKeyBackground,t.fillRect(_,g,c,l),t.strokeRect(_,g,c,l),t.fillStyle=o.backgroundColor,t.fillRect(m,g+1,c-2,l-2))}t.fillStyle=this.labelTextColors[i]}drawBody(t,e,i){const{body:s}=this,{bodySpacing:r,bodyAlign:o,displayColors:a,boxHeight:l,boxWidth:c,boxPadding:h}=i,u=De(i.bodyFont);let d=u.lineHeight,f=0;const g=ir(i.rtl,this.x,this.width),_=function(C){e.fillText(C,g.x(t.x+f),t.y+d/2),t.y+=d+r},m=g.textAlign(o);let p,v,x,y,b,E,S;for(e.textAlign=o,e.textBaseline="middle",e.font=u.string,t.x=Ca(this,m,i),e.fillStyle=i.bodyColor,oe(this.beforeBody,_),f=a&&m!=="right"?o==="center"?c/2+h:c+2+h:0,y=0,E=s.length;y<E;++y){for(p=s[y],v=this.labelTextColors[y],e.fillStyle=v,oe(p.before,_),x=p.lines,a&&x.length&&(this._drawColorBox(e,t,y,g,i),d=Math.max(u.lineHeight,l)),b=0,S=x.length;b<S;++b)_(x[b]),d=u.lineHeight;oe(p.after,_)}f=0,d=u.lineHeight,oe(this.afterBody,_),t.y-=r}drawFooter(t,e,i){const s=this.footer,r=s.length;let o,a;if(r){const l=ir(i.rtl,this.x,this.width);for(t.x=Ca(this,i.footerAlign,i),t.y+=i.footerMarginTop,e.textAlign=l.textAlign(i.footerAlign),e.textBaseline="middle",o=De(i.footerFont),e.fillStyle=i.footerColor,e.font=o.string,a=0;a<r;++a)e.fillText(s[a],l.x(t.x),t.y+o.lineHeight/2),t.y+=o.lineHeight+i.footerSpacing}}drawBackground(t,e,i,s){const{xAlign:r,yAlign:o}=this,{x:a,y:l}=t,{width:c,height:h}=i,{topLeft:u,topRight:d,bottomLeft:f,bottomRight:g}=as(s.cornerRadius);e.fillStyle=s.backgroundColor,e.strokeStyle=s.borderColor,e.lineWidth=s.borderWidth,e.beginPath(),e.moveTo(a+u,l),o==="top"&&this.drawCaret(t,e,i,s),e.lineTo(a+c-d,l),e.quadraticCurveTo(a+c,l,a+c,l+d),o==="center"&&r==="right"&&this.drawCaret(t,e,i,s),e.lineTo(a+c,l+h-g),e.quadraticCurveTo(a+c,l+h,a+c-g,l+h),o==="bottom"&&this.drawCaret(t,e,i,s),e.lineTo(a+f,l+h),e.quadraticCurveTo(a,l+h,a,l+h-f),o==="center"&&r==="left"&&this.drawCaret(t,e,i,s),e.lineTo(a,l+u),e.quadraticCurveTo(a,l,a+u,l),e.closePath(),e.fill(),s.borderWidth>0&&e.stroke()}_updateAnimationTarget(t){const e=this.chart,i=this.$animations,s=i&&i.x,r=i&&i.y;if(s||r){const o=Wr[t.position].call(this,this._active,this._eventPosition);if(!o)return;const a=this._size=Rp(this,t),l=Object.assign({},o,this._size),c=Pp(e,t,l),h=Lp(t,l,c,e);(s._to!==h.x||r._to!==h.y)&&(this.xAlign=c.xAlign,this.yAlign=c.yAlign,this.width=a.width,this.height=a.height,this.caretX=o.x,this.caretY=o.y,this._resolveAnimations().update(this,h))}}_willRender(){return!!this.opacity}draw(t){const e=this.options.setContext(this.getContext());let i=this.opacity;if(!i)return;this._updateAnimationTarget(e);const s={width:this.width,height:this.height},r={x:this.x,y:this.y};i=Math.abs(i)<.001?0:i;const o=qe(e.padding),a=this.title.length||this.beforeBody.length||this.body.length||this.afterBody.length||this.footer.length;e.enabled&&a&&(t.save(),t.globalAlpha=i,this.drawBackground(r,t,s,e),pf(t,e.textDirection),r.y+=o.top,this.drawTitle(r,t,e),this.drawBody(r,t,e),this.drawFooter(r,t,e),mf(t,e.textDirection),t.restore())}getActiveElements(){return this._active||[]}setActiveElements(t,e){const i=this._active,s=t.map(({datasetIndex:a,index:l})=>{const c=this.chart.getDatasetMeta(a);if(!c)throw new Error("Cannot find a dataset at index "+a);return{datasetIndex:a,element:c.data[l],index:l}}),r=!Jo(i,s),o=this._positionChanged(s,e);(r||o)&&(this._active=s,this._eventPosition=e,this._ignoreReplayEvents=!0,this.update(!0))}handleEvent(t,e,i=!0){if(e&&this._ignoreReplayEvents)return!1;this._ignoreReplayEvents=!1;const s=this.options,r=this._active||[],o=this._getActiveElements(t,r,e,i),a=this._positionChanged(o,t),l=e||!Jo(o,r)||a;return l&&(this._active=o,(s.enabled||s.external)&&(this._eventPosition={x:t.x,y:t.y},this.update(!0,e))),l}_getActiveElements(t,e,i,s){const r=this.options;if(t.type==="mouseout")return[];if(!s)return e.filter(a=>this.chart.data.datasets[a.datasetIndex]&&this.chart.getDatasetMeta(a.datasetIndex).controller.getParsed(a.index)!==void 0);const o=this.chart.getElementsAtEventForMode(t,r.mode,r,i);return r.reverse&&o.reverse(),o}_positionChanged(t,e){const{caretX:i,caretY:s,options:r}=this,o=Wr[r.position].call(this,t,e);return o!==!1&&(i!==o.x||s!==o.y)}}ut(Pc,"positioners",Wr);var XE={id:"tooltip",_element:Pc,positioners:Wr,afterInit(n,t,e){e&&(n.tooltip=new Pc({chart:n,options:e}))},beforeUpdate(n,t,e){n.tooltip&&n.tooltip.initialize(e)},reset(n,t,e){n.tooltip&&n.tooltip.initialize(e)},afterDraw(n){const t=n.tooltip;if(t&&t._willRender()){const e={tooltip:t};if(n.notifyPlugins("beforeTooltipDraw",{...e,cancelable:!0})===!1)return;t.draw(n.ctx),n.notifyPlugins("afterTooltipDraw",e)}},afterEvent(n,t){if(n.tooltip){const e=t.replay;n.tooltip.handleEvent(t.event,e,t.inChartArea)&&(t.changed=!0)}},defaults:{enabled:!0,external:null,position:"average",backgroundColor:"rgba(0,0,0,0.8)",titleColor:"#fff",titleFont:{weight:"bold"},titleSpacing:2,titleMarginBottom:6,titleAlign:"left",bodyColor:"#fff",bodySpacing:2,bodyFont:{},bodyAlign:"left",footerColor:"#fff",footerSpacing:2,footerMarginTop:6,footerFont:{weight:"bold"},footerAlign:"left",padding:6,caretPadding:2,caretSize:5,cornerRadius:6,boxHeight:(n,t)=>t.bodyFont.size,boxWidth:(n,t)=>t.bodyFont.size,multiKeyBackground:"#fff",displayColors:!0,boxPadding:0,borderColor:"rgba(0,0,0,0)",borderWidth:0,animation:{duration:400,easing:"easeOutQuart"},animations:{numbers:{type:"number",properties:["x","y","width","height","caretX","caretY"]},opacity:{easing:"linear",duration:200}},callbacks:Op},defaultRoutes:{bodyFont:"font",footerFont:"font",titleFont:"font"},descriptors:{_scriptable:n=>n!=="filter"&&n!=="itemSort"&&n!=="external",_indexable:!1,callbacks:{_scriptable:!1,_indexable:!1},animation:{_fallback:!1},animations:{_fallback:"animation"}},additionalOptionScopes:["interaction"]},jE=Object.freeze({__proto__:null,Colors:sE,Decimation:lE,Filler:CE,Legend:OE,SubTitle:NE,Title:FE,Tooltip:XE});const YE=(n,t,e,i)=>(typeof t=="string"?(e=n.push(t)-1,i.unshift({index:e,label:t})):isNaN(t)&&(e=null),e);function qE(n,t,e,i){const s=n.indexOf(t);if(s===-1)return YE(n,t,e,i);const r=n.lastIndexOf(t);return s!==r?e:s}const $E=(n,t)=>n===null?null:ke(Math.round(n),0,t);function Up(n){const t=this.getLabels();return n>=0&&n<t.length?t[n]:n}class Lc extends fs{constructor(t){super(t),this._startValue=void 0,this._valueRange=0,this._addedLabels=[]}init(t){const e=this._addedLabels;if(e.length){const i=this.getLabels();for(const{index:s,label:r}of e)i[s]===r&&i.splice(s,1);this._addedLabels=[]}super.init(t)}parse(t,e){if(ee(t))return null;const i=this.getLabels();return e=isFinite(e)&&i[e]===t?e:qE(i,t,kt(e,t),this._addedLabels),$E(e,i.length-1)}determineDataLimits(){const{minDefined:t,maxDefined:e}=this.getUserBounds();let{min:i,max:s}=this.getMinMax(!0);this.options.bounds==="ticks"&&(t||(i=0),e||(s=this.getLabels().length-1)),this.min=i,this.max=s}buildTicks(){const t=this.min,e=this.max,i=this.options.offset,s=[];let r=this.getLabels();r=t===0&&e===r.length-1?r:r.slice(t,e+1),this._valueRange=Math.max(r.length-(i?0:1),1),this._startValue=this.min-(i?.5:0);for(let o=t;o<=e;o++)s.push({value:o});return s}getLabelForValue(t){return Up.call(this,t)}configure(){super.configure(),this.isHorizontal()||(this._reversePixels=!this._reversePixels)}getPixelForValue(t){return typeof t!="number"&&(t=this.parse(t)),t===null?NaN:this.getPixelForDecimal((t-this._startValue)/this._valueRange)}getPixelForTick(t){const e=this.ticks;return t<0||t>e.length-1?null:this.getPixelForValue(e[t].value)}getValueForPixel(t){return Math.round(this._startValue+this.getDecimalForPixel(t)*this._valueRange)}getBasePixel(){return this.bottom}}ut(Lc,"id","category"),ut(Lc,"defaults",{ticks:{callback:Up}});function KE(n,t){const e=[],{bounds:s,step:r,min:o,max:a,precision:l,count:c,maxTicks:h,maxDigits:u,includeBounds:d}=n,f=r||1,g=h-1,{min:_,max:m}=t,p=!ee(o),v=!ee(a),x=!ee(c),y=(m-_)/(u+1);let b=kd((m-_)/g/f)*f,E,S,C,M;if(b<1e-14&&!p&&!v)return[{value:_},{value:m}];M=Math.ceil(m/b)-Math.floor(_/b),M>g&&(b=kd(M*b/g/f)*f),ee(l)||(E=Math.pow(10,l),b=Math.ceil(b*E)/E),s==="ticks"?(S=Math.floor(_/b)*b,C=Math.ceil(m/b)*b):(S=_,C=m),p&&v&&r&&Wb((a-o)/r,b/1e3)?(M=Math.round(Math.min((a-o)/b,h)),b=(a-o)/M,S=o,C=a):x?(S=p?o:S,C=v?a:C,M=c-1,b=(C-S)/M):(M=(C-S)/b,Cr(M,Math.round(M),b/1e3)?M=Math.round(M):M=Math.ceil(M));const w=Math.max(zd(b),zd(S));E=Math.pow(10,ee(l)?w:l),S=Math.round(S*E)/E,C=Math.round(C*E)/E;let U=0;for(p&&(d&&S!==o?(e.push({value:o}),S<o&&U++,Cr(Math.round((S+U*b)*E)/E,o,Fp(o,y,n))&&U++):S<o&&U++);U<M;++U){const O=Math.round((S+U*b)*E)/E;if(v&&O>a)break;e.push({value:O})}return v&&d&&C!==a?e.length&&Cr(e[e.length-1].value,a,Fp(a,y,n))?e[e.length-1].value=a:e.push({value:a}):(!v||C===a)&&e.push({value:C}),e}function Fp(n,t,{horizontal:e,minRotation:i}){const s=kn(i),r=(e?Math.sin(s):Math.cos(s))||.001,o=.75*t*(""+n).length;return Math.min(t/r,o)}class Ra extends fs{constructor(t){super(t),this.start=void 0,this.end=void 0,this._startValue=void 0,this._endValue=void 0,this._valueRange=0}parse(t,e){return ee(t)||(typeof t=="number"||t instanceof Number)&&!isFinite(+t)?null:+t}handleTickRangeOptions(){const{beginAtZero:t}=this.options,{minDefined:e,maxDefined:i}=this.getUserBounds();let{min:s,max:r}=this;const o=l=>s=e?s:l,a=l=>r=i?r:l;if(t){const l=Wn(s),c=Wn(r);l<0&&c<0?a(0):l>0&&c>0&&o(0)}if(s===r){let l=r===0?1:Math.abs(r*.05);a(r+l),t||o(s-l)}this.min=s,this.max=r}getTickLimit(){const t=this.options.ticks;let{maxTicksLimit:e,stepSize:i}=t,s;return i?(s=Math.ceil(this.max/i)-Math.floor(this.min/i)+1,s>1e3&&(console.warn(`scales.${this.id}.ticks.stepSize: ${i} would result generating up to ${s} ticks. Limiting to 1000.`),s=1e3)):(s=this.computeTickLimit(),e=e||11),e&&(s=Math.min(e,s)),s}computeTickLimit(){return Number.POSITIVE_INFINITY}buildTicks(){const t=this.options,e=t.ticks;let i=this.getTickLimit();i=Math.max(2,i);const s={maxTicks:i,bounds:t.bounds,min:t.min,max:t.max,precision:e.precision,step:e.stepSize,count:e.count,maxDigits:this._maxDigits(),horizontal:this.isHorizontal(),minRotation:e.minRotation||0,includeBounds:e.includeBounds!==!1},r=this._range||this,o=KE(s,r);return t.bounds==="ticks"&&Bd(o,this,"value"),t.reverse?(o.reverse(),this.start=this.max,this.end=this.min):(this.start=this.min,this.end=this.max),o}configure(){const t=this.ticks;let e=this.min,i=this.max;if(super.configure(),this.options.offset&&t.length){const s=(i-e)/Math.max(t.length-1,1)/2;e-=s,i+=s}this._startValue=e,this._endValue=i,this._valueRange=i-e}getLabelForValue(t){return Lr(t,this.chart.options.locale,this.options.ticks.format)}}class Dc extends Ra{determineDataLimits(){const{min:t,max:e}=this.getMinMax(!0);this.min=be(t)?t:0,this.max=be(e)?e:1,this.handleTickRangeOptions()}computeTickLimit(){const t=this.isHorizontal(),e=t?this.width:this.height,i=kn(this.options.ticks.minRotation),s=(t?Math.sin(i):Math.cos(i))||.001,r=this._resolveTickFontOptions(0);return Math.ceil(e/Math.min(40,r.lineHeight/s))}getPixelForValue(t){return t===null?NaN:this.getPixelForDecimal((t-this._startValue)/this._valueRange)}getValueForPixel(t){return this._startValue+this.getDecimalForPixel(t)*this._valueRange}}ut(Dc,"id","linear"),ut(Dc,"defaults",{ticks:{callback:na.formatters.numeric}});const Xr=n=>Math.floor(ki(n)),ps=(n,t)=>Math.pow(10,Xr(n)+t);function Np(n){return n/Math.pow(10,Xr(n))===1}function kp(n,t,e){const i=Math.pow(10,e),s=Math.floor(n/i);return Math.ceil(t/i)-s}function ZE(n,t){const e=t-n;let i=Xr(e);for(;kp(n,t,i)>10;)i++;for(;kp(n,t,i)<10;)i--;return Math.min(i,Xr(n))}function JE(n,{min:t,max:e}){t=gn(n.min,t);const i=[],s=Xr(t);let r=ZE(t,e),o=r<0?Math.pow(10,Math.abs(r)):1;const a=Math.pow(10,r),l=s>r?Math.pow(10,s):0,c=Math.round((t-l)*o)/o,h=Math.floor((t-l)/a/10)*a*10;let u=Math.floor((c-h)/Math.pow(10,r)),d=gn(n.min,Math.round((l+h+u*Math.pow(10,r))*o)/o);for(;d<e;)i.push({value:d,major:Np(d),significand:u}),u>=10?u=u<15?15:20:u++,u>=20&&(r++,u=2,o=r>=0?1:o),d=Math.round((l+h+u*Math.pow(10,r))*o)/o;const f=gn(n.max,d);return i.push({value:f,major:Np(f),significand:u}),i}class Ic extends fs{constructor(t){super(t),this.start=void 0,this.end=void 0,this._startValue=void 0,this._valueRange=0}parse(t,e){const i=Ra.prototype.parse.apply(this,[t,e]);if(i===0){this._zero=!0;return}return be(i)&&i>0?i:null}determineDataLimits(){const{min:t,max:e}=this.getMinMax(!0);this.min=be(t)?Math.max(0,t):null,this.max=be(e)?Math.max(0,e):null,this.options.beginAtZero&&(this._zero=!0),this._zero&&this.min!==this._suggestedMin&&!be(this._userMin)&&(this.min=t===ps(this.min,0)?ps(this.min,-1):ps(this.min,0)),this.handleTickRangeOptions()}handleTickRangeOptions(){const{minDefined:t,maxDefined:e}=this.getUserBounds();let i=this.min,s=this.max;const r=a=>i=t?i:a,o=a=>s=e?s:a;i===s&&(i<=0?(r(1),o(10)):(r(ps(i,-1)),o(ps(s,1)))),i<=0&&r(ps(s,-1)),s<=0&&o(ps(i,1)),this.min=i,this.max=s}buildTicks(){const t=this.options,e={min:this._userMin,max:this._userMax},i=JE(e,this);return t.bounds==="ticks"&&Bd(i,this,"value"),t.reverse?(i.reverse(),this.start=this.max,this.end=this.min):(this.start=this.min,this.end=this.max),i}getLabelForValue(t){return t===void 0?"0":Lr(t,this.chart.options.locale,this.options.ticks.format)}configure(){const t=this.min;super.configure(),this._startValue=ki(t),this._valueRange=ki(this.max)-ki(t)}getPixelForValue(t){return(t===void 0||t===0)&&(t=this.min),t===null||isNaN(t)?NaN:this.getPixelForDecimal(t===this.min?0:(ki(t)-this._startValue)/this._valueRange)}getValueForPixel(t){const e=this.getDecimalForPixel(t);return Math.pow(10,this._startValue+e*this._valueRange)}}ut(Ic,"id","logarithmic"),ut(Ic,"defaults",{ticks:{callback:na.formatters.logarithmic,major:{enabled:!0}}});function Oc(n){const t=n.ticks;if(t.display&&n.display){const e=qe(t.backdropPadding);return kt(t.font&&t.font.size,Me.font.size)+e.height}return 0}function QE(n,t,e){return e=_e(e)?e:[e],{w:aM(n,t.string,e),h:e.length*t.lineHeight}}function Bp(n,t,e,i,s){return n===i||n===s?{start:t-e/2,end:t+e/2}:n<i||n>s?{start:t-e,end:t}:{start:t,end:t+e}}function tT(n){const t={l:n.left+n._padding.left,r:n.right-n._padding.right,t:n.top+n._padding.top,b:n.bottom-n._padding.bottom},e=Object.assign({},t),i=[],s=[],r=n._pointLabels.length,o=n.options.pointLabels,a=o.centerPointLabels?fe/r:0;for(let l=0;l<r;l++){const c=o.setContext(n.getPointLabelContext(l));s[l]=c.padding;const h=n.getPointPosition(l,n.drawingArea+s[l],a),u=De(c.font),d=QE(n.ctx,u,n._pointLabels[l]);i[l]=d;const f=_n(n.getIndexAngle(l)+a),g=Math.round(Zl(f)),_=Bp(g,h.x,d.w,0,180),m=Bp(g,h.y,d.h,90,270);eT(e,t,f,_,m)}n.setCenterPoint(t.l-e.l,e.r-t.r,t.t-e.t,e.b-t.b),n._pointLabelItems=sT(n,i,s)}function eT(n,t,e,i,s){const r=Math.abs(Math.sin(e)),o=Math.abs(Math.cos(e));let a=0,l=0;i.start<t.l?(a=(t.l-i.start)/r,n.l=Math.min(n.l,t.l-a)):i.end>t.r&&(a=(i.end-t.r)/r,n.r=Math.max(n.r,t.r+a)),s.start<t.t?(l=(t.t-s.start)/o,n.t=Math.min(n.t,t.t-l)):s.end>t.b&&(l=(s.end-t.b)/o,n.b=Math.max(n.b,t.b+l))}function nT(n,t,e){const i=n.drawingArea,{extra:s,additionalAngle:r,padding:o,size:a}=e,l=n.getPointPosition(t,i+s+o,r),c=Math.round(Zl(_n(l.angle+Se))),h=aT(l.y,a.h,c),u=rT(c),d=oT(l.x,a.w,u);return{visible:!0,x:l.x,y:h,textAlign:u,left:d,top:h,right:d+a.w,bottom:h+a.h}}function iT(n,t){if(!t)return!0;const{left:e,top:i,right:s,bottom:r}=n;return!(mi({x:e,y:i},t)||mi({x:e,y:r},t)||mi({x:s,y:i},t)||mi({x:s,y:r},t))}function sT(n,t,e){const i=[],s=n._pointLabels.length,r=n.options,{centerPointLabels:o,display:a}=r.pointLabels,l={extra:Oc(r)/2,additionalAngle:o?fe/s:0};let c;for(let h=0;h<s;h++){l.padding=e[h],l.size=t[h];const u=nT(n,h,l);i.push(u),a==="auto"&&(u.visible=iT(u,c),u.visible&&(c=u))}return i}function rT(n){return n===0||n===180?"center":n<180?"left":"right"}function oT(n,t,e){return e==="right"?n-=t:e==="center"&&(n-=t/2),n}function aT(n,t,e){return e===90||e===270?n-=t/2:(e>270||e<90)&&(n-=t),n}function lT(n,t,e){const{left:i,top:s,right:r,bottom:o}=e,{backdropColor:a}=t;if(!ee(a)){const l=as(t.borderRadius),c=qe(t.backdropPadding);n.fillStyle=a;const h=i-c.left,u=s-c.top,d=r-i+c.width,f=o-s+c.height;Object.values(l).some(g=>g!==0)?(n.beginPath(),Ir(n,{x:h,y:u,w:d,h:f,radius:l}),n.fill()):n.fillRect(h,u,d,f)}}function cT(n,t){const{ctx:e,options:{pointLabels:i}}=n;for(let s=t-1;s>=0;s--){const r=n._pointLabelItems[s];if(!r.visible)continue;const o=i.setContext(n.getPointLabelContext(s));lT(e,o,r);const a=De(o.font),{x:l,y:c,textAlign:h}=r;os(e,n._pointLabels[s],l,c+a.lineHeight/2,a,{color:o.color,textAlign:h,textBaseline:"middle"})}}function zp(n,t,e,i){const{ctx:s}=n;if(e)s.arc(n.xCenter,n.yCenter,t,0,pe);else{let r=n.getPointPosition(0,t);s.moveTo(r.x,r.y);for(let o=1;o<i;o++)r=n.getPointPosition(o,t),s.lineTo(r.x,r.y)}}function hT(n,t,e,i,s){const r=n.ctx,o=t.circular,{color:a,lineWidth:l}=t;!o&&!i||!a||!l||e<0||(r.save(),r.strokeStyle=a,r.lineWidth=l,r.setLineDash(s.dash),r.lineDashOffset=s.dashOffset,r.beginPath(),zp(n,e,o,i),r.closePath(),r.stroke(),r.restore())}function uT(n,t,e){return Bi(n,{label:e,index:t,type:"pointLabel"})}class jr extends Ra{constructor(t){super(t),this.xCenter=void 0,this.yCenter=void 0,this.drawingArea=void 0,this._pointLabels=[],this._pointLabelItems=[]}setDimensions(){const t=this._padding=qe(Oc(this.options)/2),e=this.width=this.maxWidth-t.width,i=this.height=this.maxHeight-t.height;this.xCenter=Math.floor(this.left+e/2+t.left),this.yCenter=Math.floor(this.top+i/2+t.top),this.drawingArea=Math.floor(Math.min(e,i)/2)}determineDataLimits(){const{min:t,max:e}=this.getMinMax(!1);this.min=be(t)&&!isNaN(t)?t:0,this.max=be(e)&&!isNaN(e)?e:0,this.handleTickRangeOptions()}computeTickLimit(){return Math.ceil(this.drawingArea/Oc(this.options))}generateTickLabels(t){Ra.prototype.generateTickLabels.call(this,t),this._pointLabels=this.getLabels().map((e,i)=>{const s=ue(this.options.pointLabels.callback,[e,i],this);return s||s===0?s:""}).filter((e,i)=>this.chart.getDataVisibility(i))}fit(){const t=this.options;t.display&&t.pointLabels.display?tT(this):this.setCenterPoint(0,0,0,0)}setCenterPoint(t,e,i,s){this.xCenter+=Math.floor((t-e)/2),this.yCenter+=Math.floor((i-s)/2),this.drawingArea-=Math.min(this.drawingArea/2,Math.max(t,e,i,s))}getIndexAngle(t){const e=pe/(this._pointLabels.length||1),i=this.options.startAngle||0;return _n(t*e+kn(i))}getDistanceFromCenterForValue(t){if(ee(t))return NaN;const e=this.drawingArea/(this.max-this.min);return this.options.reverse?(this.max-t)*e:(t-this.min)*e}getValueForDistanceFromCenter(t){if(ee(t))return NaN;const e=t/(this.drawingArea/(this.max-this.min));return this.options.reverse?this.max-e:this.min+e}getPointLabelContext(t){const e=this._pointLabels||[];if(t>=0&&t<e.length){const i=e[t];return uT(this.getContext(),t,i)}}getPointPosition(t,e,i=0){const s=this.getIndexAngle(t)-Se+i;return{x:Math.cos(s)*e+this.xCenter,y:Math.sin(s)*e+this.yCenter,angle:s}}getPointPositionForValue(t,e){return this.getPointPosition(t,this.getDistanceFromCenterForValue(e))}getBasePosition(t){return this.getPointPositionForValue(t||0,this.getBaseValue())}getPointLabelPosition(t){const{left:e,top:i,right:s,bottom:r}=this._pointLabelItems[t];return{left:e,top:i,right:s,bottom:r}}drawBackground(){const{backgroundColor:t,grid:{circular:e}}=this.options;if(t){const i=this.ctx;i.save(),i.beginPath(),zp(this,this.getDistanceFromCenterForValue(this._endValue),e,this._pointLabels.length),i.closePath(),i.fillStyle=t,i.fill(),i.restore()}}drawGrid(){const t=this.ctx,e=this.options,{angleLines:i,grid:s,border:r}=e,o=this._pointLabels.length;let a,l,c;if(e.pointLabels.display&&cT(this,o),s.display&&this.ticks.forEach((h,u)=>{if(u!==0){l=this.getDistanceFromCenterForValue(h.value);const d=this.getContext(u),f=s.setContext(d),g=r.setContext(d);hT(this,f,l,o,g)}}),i.display){for(t.save(),a=o-1;a>=0;a--){const h=i.setContext(this.getPointLabelContext(a)),{color:u,lineWidth:d}=h;!d||!u||(t.lineWidth=d,t.strokeStyle=u,t.setLineDash(h.borderDash),t.lineDashOffset=h.borderDashOffset,l=this.getDistanceFromCenterForValue(e.ticks.reverse?this.min:this.max),c=this.getPointPosition(a,l),t.beginPath(),t.moveTo(this.xCenter,this.yCenter),t.lineTo(c.x,c.y),t.stroke())}t.restore()}}drawBorder(){}drawLabels(){const t=this.ctx,e=this.options,i=e.ticks;if(!i.display)return;const s=this.getIndexAngle(0);let r,o;t.save(),t.translate(this.xCenter,this.yCenter),t.rotate(s),t.textAlign="center",t.textBaseline="middle",this.ticks.forEach((a,l)=>{if(l===0&&!e.reverse)return;const c=i.setContext(this.getContext(l)),h=De(c.font);if(r=this.getDistanceFromCenterForValue(this.ticks[l].value),c.showLabelBackdrop){t.font=h.string,o=t.measureText(a.label).width,t.fillStyle=c.backdropColor;const u=qe(c.backdropPadding);t.fillRect(-o/2-u.left,-r-h.size/2-u.top,o+u.width,h.size+u.height)}os(t,a.label,0,-r,h,{color:c.color,strokeColor:c.textStrokeColor,strokeWidth:c.textStrokeWidth})}),t.restore()}drawTitle(){}}ut(jr,"id","radialLinear"),ut(jr,"defaults",{display:!0,animate:!0,position:"chartArea",angleLines:{display:!0,lineWidth:1,borderDash:[],borderDashOffset:0},grid:{circular:!1},startAngle:0,ticks:{showLabelBackdrop:!0,callback:na.formatters.numeric},pointLabels:{backdropColor:void 0,backdropPadding:2,display:!0,font:{size:10},callback(t){return t},padding:5,centerPointLabels:!1}}),ut(jr,"defaultRoutes",{"angleLines.color":"borderColor","pointLabels.color":"color","ticks.color":"color"}),ut(jr,"descriptors",{angleLines:{_fallback:"grid"}});const Pa={millisecond:{common:!0,size:1,steps:1e3},second:{common:!0,size:1e3,steps:60},minute:{common:!0,size:6e4,steps:60},hour:{common:!0,size:36e5,steps:24},day:{common:!0,size:864e5,steps:30},week:{common:!1,size:6048e5,steps:4},month:{common:!0,size:2628e6,steps:12},quarter:{common:!1,size:7884e6,steps:4},year:{common:!0,size:3154e7}},cn=Object.keys(Pa);function Hp(n,t){return n-t}function Vp(n,t){if(ee(t))return null;const e=n._adapter,{parser:i,round:s,isoWeekday:r}=n._parseOpts;let o=t;return typeof i=="function"&&(o=i(o)),be(o)||(o=typeof i=="string"?e.parse(o,i):e.parse(o)),o===null?null:(s&&(o=s==="week"&&(tr(r)||r===!0)?e.startOf(o,"isoWeek",r):e.startOf(o,s)),+o)}function Gp(n,t,e,i){const s=cn.length;for(let r=cn.indexOf(n);r<s-1;++r){const o=Pa[cn[r]],a=o.steps?o.steps:Number.MAX_SAFE_INTEGER;if(o.common&&Math.ceil((e-t)/(a*o.size))<=i)return cn[r]}return cn[s-1]}function dT(n,t,e,i,s){for(let r=cn.length-1;r>=cn.indexOf(e);r--){const o=cn[r];if(Pa[o].common&&n._adapter.diff(s,i,o)>=t-1)return o}return cn[e?cn.indexOf(e):0]}function fT(n){for(let t=cn.indexOf(n)+1,e=cn.length;t<e;++t)if(Pa[cn[t]].common)return cn[t]}function Wp(n,t,e){if(!e)n[t]=!0;else if(e.length){const{lo:i,hi:s}=Ql(e,t),r=e[i]>=t?e[i]:e[s];n[r]=!0}}function pT(n,t,e,i){const s=n._adapter,r=+s.startOf(t[0].value,i),o=t[t.length-1].value;let a,l;for(a=r;a<=o;a=+s.add(a,1,i))l=e[a],l>=0&&(t[l].major=!0);return t}function Xp(n,t,e){const i=[],s={},r=t.length;let o,a;for(o=0;o<r;++o)a=t[o],s[a]=o,i.push({value:a,major:!1});return r===0||!e?i:pT(n,i,s,e)}class Yr extends fs{constructor(t){super(t),this._cache={data:[],labels:[],all:[]},this._unit="day",this._majorUnit=void 0,this._offsets={},this._normalized=!1,this._parseOpts=void 0}init(t,e={}){const i=t.time||(t.time={}),s=this._adapter=new Sy._date(t.adapters.date);s.init(e),wr(i.displayFormats,s.formats()),this._parseOpts={parser:i.parser,round:i.round,isoWeekday:i.isoWeekday},super.init(t),this._normalized=e.normalized}parse(t,e){return t===void 0?null:Vp(this,t)}beforeLayout(){super.beforeLayout(),this._cache={data:[],labels:[],all:[]}}determineDataLimits(){const t=this.options,e=this._adapter,i=t.time.unit||"day";let{min:s,max:r,minDefined:o,maxDefined:a}=this.getUserBounds();function l(c){!o&&!isNaN(c.min)&&(s=Math.min(s,c.min)),!a&&!isNaN(c.max)&&(r=Math.max(r,c.max))}(!o||!a)&&(l(this._getLabelBounds()),(t.bounds!=="ticks"||t.ticks.source!=="labels")&&l(this.getMinMax(!1))),s=be(s)&&!isNaN(s)?s:+e.startOf(Date.now(),i),r=be(r)&&!isNaN(r)?r:+e.endOf(Date.now(),i)+1,this.min=Math.min(s,r-1),this.max=Math.max(s+1,r)}_getLabelBounds(){const t=this.getLabelTimestamps();let e=Number.POSITIVE_INFINITY,i=Number.NEGATIVE_INFINITY;return t.length&&(e=t[0],i=t[t.length-1]),{min:e,max:i}}buildTicks(){const t=this.options,e=t.time,i=t.ticks,s=i.source==="labels"?this.getLabelTimestamps():this._generate();t.bounds==="ticks"&&s.length&&(this.min=this._userMin||s[0],this.max=this._userMax||s[s.length-1]);const r=this.min,o=this.max,a=qb(s,r,o);return this._unit=e.unit||(i.autoSkip?Gp(e.minUnit,this.min,this.max,this._getLabelCapacity(r)):dT(this,a.length,e.minUnit,this.min,this.max)),this._majorUnit=!i.major.enabled||this._unit==="year"?void 0:fT(this._unit),this.initOffsets(s),t.reverse&&a.reverse(),Xp(this,a,this._majorUnit)}afterAutoSkip(){this.options.offsetAfterAutoskip&&this.initOffsets(this.ticks.map(t=>+t.value))}initOffsets(t=[]){let e=0,i=0,s,r;this.options.offset&&t.length&&(s=this.getDecimalForValue(t[0]),t.length===1?e=1-s:e=(this.getDecimalForValue(t[1])-s)/2,r=this.getDecimalForValue(t[t.length-1]),t.length===1?i=r:i=(r-this.getDecimalForValue(t[t.length-2]))/2);const o=t.length<3?.5:.25;e=ke(e,0,o),i=ke(i,0,o),this._offsets={start:e,end:i,factor:1/(e+1+i)}}_generate(){const t=this._adapter,e=this.min,i=this.max,s=this.options,r=s.time,o=r.unit||Gp(r.minUnit,e,i,this._getLabelCapacity(e)),a=kt(s.ticks.stepSize,1),l=o==="week"?r.isoWeekday:!1,c=tr(l)||l===!0,h={};let u=e,d,f;if(c&&(u=+t.startOf(u,"isoWeek",l)),u=+t.startOf(u,c?"day":o),t.diff(i,e,o)>1e5*a)throw new Error(e+" and "+i+" are too far apart with stepSize of "+a+" "+o);const g=s.ticks.source==="data"&&this.getDataTimestamps();for(d=u,f=0;d<i;d=+t.add(d,a,o),f++)Wp(h,d,g);return(d===i||s.bounds==="ticks"||f===1)&&Wp(h,d,g),Object.keys(h).sort(Hp).map(_=>+_)}getLabelForValue(t){const e=this._adapter,i=this.options.time;return i.tooltipFormat?e.format(t,i.tooltipFormat):e.format(t,i.displayFormats.datetime)}format(t,e){const s=this.options.time.displayFormats,r=this._unit,o=e||s[r];return this._adapter.format(t,o)}_tickFormatFunction(t,e,i,s){const r=this.options,o=r.ticks.callback;if(o)return ue(o,[t,e,i],this);const a=r.time.displayFormats,l=this._unit,c=this._majorUnit,h=l&&a[l],u=c&&a[c],d=i[e],f=c&&u&&d&&d.major;return this._adapter.format(t,s||(f?u:h))}generateTickLabels(t){let e,i,s;for(e=0,i=t.length;e<i;++e)s=t[e],s.label=this._tickFormatFunction(s.value,e,t)}getDecimalForValue(t){return t===null?NaN:(t-this.min)/(this.max-this.min)}getPixelForValue(t){const e=this._offsets,i=this.getDecimalForValue(t);return this.getPixelForDecimal((e.start+i)*e.factor)}getValueForPixel(t){const e=this._offsets,i=this.getDecimalForPixel(t)/e.factor-e.end;return this.min+i*(this.max-this.min)}_getLabelSize(t){const e=this.options.ticks,i=this.ctx.measureText(t).width,s=kn(this.isHorizontal()?e.maxRotation:e.minRotation),r=Math.cos(s),o=Math.sin(s),a=this._resolveTickFontOptions(0).size;return{w:i*r+a*o,h:i*o+a*r}}_getLabelCapacity(t){const e=this.options.time,i=e.displayFormats,s=i[e.unit]||i.millisecond,r=this._tickFormatFunction(t,0,Xp(this,[t],this._majorUnit),s),o=this._getLabelSize(r),a=Math.floor(this.isHorizontal()?this.width/o.w:this.height/o.h)-1;return a>0?a:1}getDataTimestamps(){let t=this._cache.data||[],e,i;if(t.length)return t;const s=this.getMatchingVisibleMetas();if(this._normalized&&s.length)return this._cache.data=s[0].controller.getAllParsedValues(this);for(e=0,i=s.length;e<i;++e)t=t.concat(s[e].controller.getAllParsedValues(this));return this._cache.data=this.normalize(t)}getLabelTimestamps(){const t=this._cache.labels||[];let e,i;if(t.length)return t;const s=this.getLabels();for(e=0,i=s.length;e<i;++e)t.push(Vp(this,s[e]));return this._cache.labels=this._normalized?t:this.normalize(t)}normalize(t){return Wd(t.sort(Hp))}}ut(Yr,"id","time"),ut(Yr,"defaults",{bounds:"data",adapters:{},time:{parser:!1,unit:!1,round:!1,isoWeekday:!1,minUnit:"millisecond",displayFormats:{}},ticks:{source:"auto",callback:!1,major:{enabled:!1}}});function La(n,t,e){let i=0,s=n.length-1,r,o,a,l;e?(t>=n[i].pos&&t<=n[s].pos&&({lo:i,hi:s}=pi(n,"pos",t)),{pos:r,time:a}=n[i],{pos:o,time:l}=n[s]):(t>=n[i].time&&t<=n[s].time&&({lo:i,hi:s}=pi(n,"time",t)),{time:r,pos:a}=n[i],{time:o,pos:l}=n[s]);const c=o-r;return c?a+(l-a)*(t-r)/c:a}class Uc extends Yr{constructor(t){super(t),this._table=[],this._minPos=void 0,this._tableRange=void 0}initOffsets(){const t=this._getTimestampsForTable(),e=this._table=this.buildLookupTable(t);this._minPos=La(e,this.min),this._tableRange=La(e,this.max)-this._minPos,super.initOffsets(t)}buildLookupTable(t){const{min:e,max:i}=this,s=[],r=[];let o,a,l,c,h;for(o=0,a=t.length;o<a;++o)c=t[o],c>=e&&c<=i&&s.push(c);if(s.length<2)return[{time:e,pos:0},{time:i,pos:1}];for(o=0,a=s.length;o<a;++o)h=s[o+1],l=s[o-1],c=s[o],Math.round((h+l)/2)!==c&&r.push({time:c,pos:o/(a-1)});return r}_generate(){const t=this.min,e=this.max;let i=super.getDataTimestamps();return(!i.includes(t)||!i.length)&&i.splice(0,0,t),(!i.includes(e)||i.length===1)&&i.push(e),i.sort((s,r)=>s-r)}_getTimestampsForTable(){let t=this._cache.all||[];if(t.length)return t;const e=this.getDataTimestamps(),i=this.getLabelTimestamps();return e.length&&i.length?t=this.normalize(e.concat(i)):t=e.length?e:i,t=this._cache.all=t,t}getDecimalForValue(t){return(La(this._table,t)-this._minPos)/this._tableRange}getValueForPixel(t){const e=this._offsets,i=this.getDecimalForPixel(t)/e.factor-e.end;return La(this._table,i*this._tableRange+this._minPos,!0)}}ut(Uc,"id","timeseries"),ut(Uc,"defaults",Yr.defaults);var mT=Object.freeze({__proto__:null,CategoryScale:Lc,LinearScale:Dc,LogarithmicScale:Ic,RadialLinearScale:jr,TimeScale:Yr,TimeSeriesScale:Uc});const gT=[yy,JS,jE,mT];xn.register(...gT),window.Chart=xn,window.__tameruBooted=!0;const N=n=>document.getElementById(n),Yn=(n,t,e)=>n<t?t:n>e?e:n,rr=(n,t,e)=>n+(t-n)*e,Fc=(n,t,e)=>{const i=Yn((e-n)/(t-n),0,1);return i*i*(3-2*i)},_T=n=>n<.5?4*n*n*n:1-Math.pow(-2*n+2,3)/2,vn=n=>{n=Math.max(0,Math.round(n));const t=Math.floor(n/60)%24,e=n%60;return String(t).padStart(2,"0")+":"+String(e).padStart(2,"0")},qn=n=>Math.round(n).toLocaleString("en-US"),Da=()=>new Promise(n=>requestAnimationFrame(()=>n()));function Nc(n){return function(){n|=0,n=n+1831565813|0;let t=Math.imul(n^n>>>15,1|n);return t=t+Math.imul(t^t>>>7,61|t)^t,((t^t>>>14)>>>0)/4294967296}}function qr(n,t){N("ldBar").style.width=n*100+"%",N("ldStep").textContent=t}let le=(()=>{try{return new URLSearchParams(location.search).get("lang")||localStorage.getItem("tameru_lang")||"en"}catch{return"en"}})();window.addEventListener("message",n=>{n.data&&n.data.type==="SET_LANG"&&(le=n.data.lang,kc())});function kc(){const n=le==="ja";if(document.documentElement.lang=le,N("btnScenWithout")&&(N("btnScenWithout").textContent=n?"Tameruなし":"Without Tameru"),N("btnScenWith")&&(N("btnScenWith").textContent=n?"Tameru導入":"With Tameru"),N("demoBtnLbl")&&(N("demoBtnLbl").textContent=n?"デモ解説 (D)":"DEMO MODE"),N("hSim")&&(N("hSim").textContent=n?"シミュレーション制御":"Simulation Controls"),N("hEngine")&&(N("hEngine").textContent=n?"蓄積制御 (Tameru)":"Tameru Engine (蓄積制御)"),N("swTitle")&&(N("swTitle").textContent=n?"スマート蓄水スケジューリング":"Smart scheduling"),N("hStress")&&(N("hStress").textContent=n?"過負荷・熱波ストレステスト":"Stress Events (過負荷・熱波)"),N("surgeLbl")&&(N("surgeLbl").textContent=n?"突発的な需要の急増":"Trigger peak demand surge"),N("heatLbl")&&(N("heatLbl").textContent=n?"地中海性熱波シミュレーション":"Simulated Mediterranean heatwave"),N("hForecast")&&(N("hForecast").textContent=n?"AI需要予測モジュール":"Forecast AI Module"),N("hLegend")&&(N("hLegend").textContent=n?"農場ステータス表示":"Farm Status Indicators"),N("hElectricity")&&(N("hElectricity").textContent=n?"電力系統":"Electricity"),N("hWater")&&(N("hWater").textContent=n?"水資源管理":"Water Management"),N("hCompare")&&(N("hCompare").textContent=n?"シナリオ比較検証":"Scenario Comparison"),N("illusLabel")&&(N("illusLabel").textContent=n?"説明用のビジュアルコンセプトであり、シミュレーション結果ではありません":"Illustrative visual concept: not our simulation results"),N("ldTag")&&(N("ldTag").textContent=n?"説明用の3Dコンセプト · シミュレーション結果ではありません":"Illustrative 3D concept · not our simulation results"),N("topTag")&&(N("topTag").textContent=n?"説明用の3Dコンセプト":"Illustrative 3D concept"),N("illusNote")&&(N("illusNote").innerHTML=n?"<b>説明用であり、結果ではありません。</b>このアニメーションは考え方を示すために独自の簡易地区を動かしています。負荷、時刻、合計値は意図的に非表示にしています。シミュレーション結果とその基準・限界は、サイトの「結果」ページにあります。":"<b>An illustration, not a result.</b> This animation runs its own simplified district to show the idea. Its loads, times and totals are hidden on purpose: our simulated results, with their basis and limits, are on the Results page of the site."),N("cmpFootNote")&&(N("cmpFootNote").textContent=n?"説明用のビジュアルコンセプトであり、シミュレーション結果ではありません。シミュレーション結果はサイトの「結果」ページにあります。":"Illustrative visual concept: not our simulation results. Our simulated results are on the Results page of the site."),Jn.demand){const[t,e,i]=Jn.demand.data.datasets;t.label=n?"Tameruなし":"Without Tameru",e.label=n?"Tameru導入":"With Tameru",i.label=n?"系統定格容量":"Grid capacity"}}const ce={N:200,PER_SECTOR:50,CAP:1e3,TARIFF:[1020,1200],RESERVE:.15,MIN_PER_SEC_1X:5,PX:4.6,PZ:3.9,SURGE_KW:270,SURGE_MIN:120},Mt=ce.N,$n=[{n:"A",x:-28,z:-14.75},{n:"B",x:28,z:-14.75},{n:"C",x:-28,z:14.75},{n:"D",x:28,z:14.75}],Bc=[190,182,176,172,176,196,238,276,292,298,304,310,316,322,334,362,412,470,520,512,468,404,326,252,190],mt={cap:new Float32Array(Mt),dem:new Float32Array(Mt),kw:new Float32Array(Mt),rate:new Float32Array(Mt),mS:new Int16Array(Mt),mD:new Int16Array(Mt),eS:new Int16Array(Mt),eD:new Int16Array(Mt),hS:new Int16Array(Mt),sec:new Uint8Array(Mt),x:new Float32Array(Mt),z:new Float32Array(Mt),lvl0:new Float32Array(Mt),m0:new Float32Array(Mt),phase:new Float32Array(Mt)};(function(){const t=Nc(20261112),e=i=>Math.round(i/5)*5;for(let i=0;i<Mt;i++){const s=Math.floor(i/ce.PER_SECTOR),r=i%ce.PER_SECTOR,o=r%10,a=Math.floor(r/10);mt.sec[i]=s,mt.x[i]=$n[s].x+(o-4.5)*ce.PX,mt.z[i]=$n[s].z+(a-2)*ce.PZ,mt.cap[i]=Math.round(35+55*Math.pow(t(),1.25)),mt.dem[i]=7+7*t(),mt.kw[i]=4+2*t(),mt.rate[i]=mt.kw[i]*3.4,mt.mS[i]=t()<.55?e(300+t()*150):-1,mt.mD[i]=e(90+t()*90),mt.eS[i]=t()<.7?e(930+t()*150):-1,mt.eD[i]=e(150+t()*120),mt.hS[i]=t()<.35?e(690+t()*60):-1,mt.lvl0[i]=(.1+.25*t())*mt.cap[i],mt.m0[i]=.55+.25*t(),mt.phase[i]=t()}})();const z={t:0,day:1,running:!1,speed:2,acc:0,tameru:!1,heat:!1,surges:[],win:[...ce.TARIFF],risk:null,fc:null,fcPeak:0,fcPeakT:0,target:new Float32Array(Mt),snap:null,waiters:[],dirtyChart:!0,lastChart:0},Ge={A:[],B:[],fA:[],fB:[],cap:[{x:0,y:ce.CAP},{x:1440,y:ce.CAP}]};function jp(n,t){const e=mt.mS[n];if(e>=0&&t>=e&&t<e+mt.mD[n])return!0;const i=mt.eS[n];if(i>=0&&t>=i&&t<i+mt.eD[n])return!0;if(z.heat){const s=mt.hS[n];if(s>=0&&t>=s&&t<s+110)return!0}return!1}function xT(n,t,e){const i=(n-t)/e;return Math.abs(i)>=1?0:.5*(1+Math.cos(Math.PI*i))}function vT(n){let t=0;for(const e of z.surges)n>=e&&n<e+ce.SURGE_MIN&&(t+=ce.SURGE_KW*Math.min(1,(n-e)/8,(e+ce.SURGE_MIN-n)/8));return t}function zc(n){return z.surges.some(t=>n>=t&&n<t+ce.SURGE_MIN)}function Yp(n,t=!0){const e=n/60,i=Math.floor(e)%24,s=e-Math.floor(e),r=(1-Math.cos(Math.PI*s))/2;let o=Bc[i]+(Bc[i+1]-Bc[i])*r+7*Math.sin(n*.047)+4*Math.sin(n*.0131+1.7);return z.heat&&(o*=1+.17*xT(n,900,330)),t&&(o+=vT(n)),o}const $r=()=>ce.CAP*(z.heat?.94:1);function bT(n){const t=(n-360)/810;return t<=0||t>=1?0:Math.sin(Math.PI*t)}function Hc(n,t,e,i){return n<0?0:Math.max(0,Math.min(n+t,i)-Math.max(n,e))}function Kr(){const n=$r(),t=new Float32Array(97);let e=0,i=0,s=-1,r=-1;for(let c=0;c<=96;c++){const h=Math.min(1439,c*15);let u=0;for(let f=0;f<Mt;f++)jp(f,h)&&(u+=mt.kw[f]);const d=Yp(h,!1)+u+18;t[c]=d,d>e&&(e=d,i=h),h>=720&&d>.9*n&&(s<0&&(s=h),r=h+15)}z.fc=t,z.fcPeak=e,z.fcPeakT=i,z.risk=s>=0?[s,r]:null;const o=s>=0?Math.min(ce.TARIFF[0],Math.floor(s/30)*30):ce.TARIFF[0],a=s>=0?Math.max(ce.TARIFF[1],Math.ceil(r/30)*30):ce.TARIFF[1];z.win=[o,a];const l=z.heat?1.2:1;for(let c=0;c<Mt;c++){let h=Hc(mt.mS[c],mt.mD[c],o,a)+Hc(mt.eS[c],mt.eD[c],o,a);z.heat&&(h+=Hc(mt.hS[c],110,o,a));const u=mt.dem[c]*l*h/60;z.target[c]=Yn((u+.3*mt.cap[c])/mt.cap[c],.6,.95)}Ge.cap[0].y=Ge.cap[1].y=n,GT()}class qp{constructor(t){this.managed=t,this.level=new Float32Array(Mt),this.moist=new Float32Array(Mt),this.latch=new Uint8Array(Mt),this.want=new Uint8Array(Mt),this.pumpOn=new Uint8Array(Mt),this.irrig=new Uint8Array(Mt),this.short=new Uint8Array(Mt),this.resched=new Uint8Array(Mt),this.emerg=new Uint8Array(Mt),this.everShort=new Uint8Array(Mt),this.prio=new Float32Array(Mt),this.shed=[0,0,0,0],this.shedUntil=[0,0,0,0],this.lastShed=[-1e9,-1e9,-1e9,-1e9],this.L=[0,0,0,0],this.st={req:0,served:0,cap:ce.CAP,active:0,resched:0,emerg:0,stored:0,fill:0,irrOK:0,short:0,shedN:0},this.cand=[],this.init()}init(){this.level.set(mt.lvl0),this.moist.set(mt.m0);for(const t of[this.latch,this.want,this.pumpOn,this.irrig,this.short,this.resched,this.emerg])t.fill(0);this.shed=[0,0,0,0],this.shedUntil=[0,0,0,0],this.lastShed=[-1e9,-1e9,-1e9,-1e9],this.resetDay()}resetDay(){this.day={peakReq:0,peakT:0,shedMin:0,shortFM:0,kwh:0,peakKWh:0,pumped:0,ever:0},this.everShort.fill(0)}snapshot(){return{level:this.level.slice(),moist:this.moist.slice(),latch:this.latch.slice(),pumpOn:this.pumpOn.slice(),shed:[...this.shed],shedUntil:[...this.shedUntil],lastShed:[...this.lastShed]}}restore(t){this.level.set(t.level),this.moist.set(t.moist),this.latch.set(t.latch),this.pumpOn.set(t.pumpOn),this.shed=[...t.shed],this.shedUntil=[...t.shedUntil],this.lastShed=[...t.lastShed],this.resetDay()}}const Ae=new qp(!1),Ee=new qp(!0);function MT(n){const t=zc(n);return{base:Yp(n,!0),cap:$r(),heatMul:z.heat?1.4:1,heatET:z.heat?1.5:1,sunF:bT(n),peak:n>=z.win[0]&&n<z.win[1]||t,prefill:!t&&n>=z.win[0]-360&&n<z.win[0],night:n<360}}function $p(n,t,e){const i=.016666666666666666,s=e.cap;for(let b=0;b<Mt;b++)n.irrig[b]=jp(b,t)?1:0;if(n.managed){const b=n.cand;b.length=0;for(let C=0;C<Mt;C++){const M=n.level[C]/mt.cap[C],w=n.pumpOn[C];let U=!1,O=0;if(e.peak)U=M<ce.RESERVE||w&&M<ce.RESERVE+.1,O=2+(.3-M)+(n.irrig[C]?.5:0);else if(e.prefill){const Z=z.target[C];U=M<Z-.04||w&&M<Z,O=Z-M+(n.irrig[C]?.3:0)}else{const Z=n.irrig[C]?.45:.3;U=M<Z||w&&M<.65,O=.65-M+(n.irrig[C]?.4:0)}n.prio[C]=O,n.want[C]=0,U&&b.push(C)}b.sort((C,M)=>n.prio[M]-n.prio[C]);let S=(e.peak?.9:e.prefill?.68:e.night?.6:.78)*s-e.base;for(const C of b)mt.kw[C]<=S&&(n.want[C]=1,S-=mt.kw[C]);for(let C=0;C<Mt;C++){const M=n.level[C]/mt.cap[C],w=n.irrig[C]||M<.15;n.resched[C]=w&&!n.want[C]?1:0,n.emerg[C]=e.peak&&n.want[C]?1:0}}else for(let b=0;b<Mt;b++){const E=n.level[b]/mt.cap[b];E<.08?n.latch[b]=1:E>=.3&&(n.latch[b]=0),n.want[b]=n.irrig[b]||n.latch[b]?1:0,n.resched[b]=0,n.emerg[b]=0}const r=n.L;r[0]=r[1]=r[2]=r[3]=e.base/4;for(let b=0;b<Mt;b++)n.want[b]&&(r[mt.sec[b]]+=mt.kw[b]);const o=r[0]+r[1]+r[2]+r[3];let a=0;for(let b=0;b<4;b++)n.shed[b]||(a+=r[b]);for(let b=0;b<4;b++)if(n.shed[b]&&t>=n.shedUntil[b])if(a+r[b]<=.95*s)n.shed[b]=0,a+=r[b];else{let E=-1;for(let S=0;S<4;S++)!n.shed[S]&&S!==b&&a+r[b]-r[S]<=.97*s&&(E<0||n.lastShed[S]<n.lastShed[E])&&(E=S);E>=0?(n.shed[E]=1,n.shedUntil[E]=t+60,n.lastShed[E]=t,a+=r[b]-r[E],n.shed[b]=0):n.shedUntil[b]=t+10}for(;a>s;){let b=-1,E=-1e9;for(let S=0;S<4;S++)if(!n.shed[S]){const C=r[S]-(t-n.lastShed[S]<90?500:0);C>E&&(E=C,b=S)}if(b<0)break;n.shed[b]=1,n.shedUntil[b]=t+60,n.lastShed[b]=t,a-=r[b]}let l=0,c=0,h=0,u=0,d=0,f=0,g=0,_=0,m=0;const p=(.015+.035*e.sunF)*e.heatET;for(let b=0;b<Mt;b++){const E=!n.shed[mt.sec[b]],S=n.want[b]&&E;n.pumpOn[b]=S?1:0;const C=n.irrig[b]?mt.dem[b]*e.heatMul:0;let M=0;S&&(M=!n.managed&&n.irrig[b]&&!n.latch[b]?C:mt.rate[b],l++,f+=mt.kw[b],m+=M*i);let w=n.level[b]+(M-C)*i,U=1;w<0&&(U=C>0?Math.max(0,1+w/(C*i)):1,w=0),w>mt.cap[b]&&(w=mt.cap[b]),n.level[b]=w;const O=C>0&&U<.5;n.short[b]=O?1:0,O?(h++,n.everShort[b]||(n.everShort[b]=1,n.day.ever++)):C>0&&c++,n.moist[b]=Yn(n.moist[b]+(C>0&&!O?.4*i:0)-p*i*(O?2.2:1),.05,1),u+=w,d+=w/mt.cap[b],g+=n.resched[b],_+=n.emerg[b]&&S?1:0}const v=n.shed[0]+n.shed[1]+n.shed[2]+n.shed[3],x=n.st;x.req=o,x.served=a,x.cap=s,x.active=l,x.resched=g,x.emerg=_,x.stored=u,x.fill=d/Mt,x.irrOK=c,x.short=h,x.shedN=v;const y=n.day;o>y.peakReq&&(y.peakReq=o,y.peakT=t),v&&y.shedMin++,y.shortFM+=h,y.kwh+=f*i,y.pumped+=m,t>=ce.TARIFF[0]&&t<ce.TARIFF[1]&&(y.peakKWh+=f*i)}function yT(n){Ge.A.push({x:n,y:Ae.st.req}),Ge.B.push({x:n,y:Ee.st.req}),Ge.fA.push({x:n,y:Ae.st.fill*100}),Ge.fB.push({x:n,y:Ee.st.fill*100}),z.dirtyChart=!0}function Vc(){Ge.A.length=Ge.B.length=Ge.fA.length=Ge.fB.length=0,z.dirtyChart=!0}function Gc(){const n=z.t,t=MT(n);$p(Ae,n,t),$p(Ee,n,t),n%5===0&&yT(n),z.t++,z.t>=1440&&ST()}function ST(){z.day++,z.t=0,z.surges=[];for(const n of[Ae,Ee]){n.resetDay();for(let t=0;t<4;t++)n.shedUntil[t]-=1440,n.lastShed[t]-=1440}Vc(),Kr(),z.snap={A:Ae.snapshot(),B:Ee.snapshot()}}function Ia(n){for(n=Yn(Math.round(n),0,1439),Ae.restore(z.snap.A),Ee.restore(z.snap.B),z.t=0,z.acc=0,Vc(),z.surges=z.surges.filter(t=>t<n);z.t<n;)Gc()}function Kp(n=360){for(z.heat=!1,z.surges=[],z.day=1,z.t=0,z.acc=0,Ae.init(),Ee.init(),Kr(),Vc(),z.snap={A:Ae.snapshot(),B:Ee.snapshot()};z.t<n;)Gc();Qr()}const H={ok:!1},Zp=new L,Jp=new Sn,Qp=new L,tm=new ge,Oa=new L(0,1,0),ET=new Sn,ms=n=>new xt(n),Kn={pump:new xt(.2,1.4,2.7),stored:new xt(.25,2.2,.8),resched:new xt(2.6,1.3,.1),emerg:new xt(2.9,.7,.08),short:new xt(3.1,.2,.2),cut:new xt(3.1,.15,.15),idle:new xt(.06,.08,.08),off:new xt(.2,.03,.03)},Zn={soilDry:ms(7033656),soilWet:ms(3155227),lush:ms(4165434),dry:ms(10127941),parched:ms(8017200),water:ms(3116287),waterLow:ms(14251782)};function TT(){try{const n=document.createElement("canvas");return!!(window.WebGLRenderingContext&&(n.getContext("webgl2")||n.getContext("webgl")))}catch{return!1}}function Ie(n,t,e,{shadow:i=!0,receive:s=!1,dynamic:r=!1}={}){const o=new Gv(n,t,e);return o.castShadow=i,o.receiveShadow=s,r&&(o.instanceMatrix.setUsage(fg),o.frustumCulled=!1),H.scene.add(o),o}function Oe(n,t,e,i,s,r=1,o=1,a=1,l=ET){Zp.set(e,i,s),Qp.set(r,o,a),tm.compose(Zp,l,Qp),n.setMatrixAt(t,tm)}function xe(n){return new Ks(Object.assign({color:16777215,roughness:.85,metalness:.05},n))}function ae(n,t,e,i=0,s=0,r=0){return new Qi(n,t,e).translate(i,s,r)}const Wt={field:[-.62,0],tank:[1.45,-.55],house:[1.45,.95],pump:[1.45,-1.38],pipeMainA:new L(1.05,.21,-.55),pipeMainB:new L(-1.95,.21,-.55),pipePumpA:new L(1.45,.42,-1.25),pipePumpB:new L(1.45,1.33,-.9)};function wT(){const n=N("scene"),t=new sd({canvas:n,antialias:!0,powerPreference:"high-performance"});t.setPixelRatio(Math.min(window.devicePixelRatio||1,1.5)),t.shadowMap.enabled=!0,t.shadowMap.type=oh,t.toneMapping=ja,t.toneMappingExposure=1.08;const e=new Hv;e.background=new xt(790808),e.fog=new Nl(790808,150,360);const i=new An(36,1,.5,1200);Object.assign(H,{renderer:t,scene:e,camera:i,canvas:n});const s=new eb(i,n);s.enableDamping=!0,s.dampingFactor=.07,s.maxPolarAngle=1.38,s.minDistance=8,s.maxDistance=280,s.screenSpacePanning=!1,s.panSpeed=.9,s.rotateSpeed=.6,H.controls=s;const r=new Yv(11125478,1909532,.55);e.add(r);const o=new Kv(16773596,1.6);o.castShadow=!0,o.shadow.mapSize.set(1024,1024),Object.assign(o.shadow.camera,{left:-100,right:100,top:100,bottom:-100,near:10,far:400}),o.shadow.bias=-6e-4,o.shadow.normalBias=.03,o.target.position.set(-8,0,0),e.add(o),e.add(o.target),Object.assign(H,{hemi:r,sun:o});try{const a=new ab(t);a.addPass(new lb(e,i));const l=new Js(new St(512,512),.55,.45,.92);a.addPass(l),a.addPass(new ub),H.composer=a,H.bloom=l}catch(a){console.warn("Bloom disabled",a)}AT(),CT(),RT(),PT(),LT(),IT(),H.ok=!0}function AT(){const{scene:n}=H,t=new Kt(new _r(520,380),xe({color:1317398,roughness:1}));t.rotation.x=-Math.PI/2,t.receiveShadow=!0,n.add(t);const e=new Qv(520,104,2042933,1516075);e.material.transparent=!0,e.material.opacity=.35,e.position.y=.012,n.add(e);const i=xe({color:1711910,roughness:.95}),s=[ae(112,.06,10,-2,.03,0),ae(10,.06,59,0,.031,0),ae(112,.06,4,-2,.03,-27.6),ae(112,.06,4,-2,.03,27.6),ae(4,.06,59,-55.6,.03,0),ae(4,.06,59,53.6,.03,0)],r=new Kt(Gn(s),i);r.receiveShadow=!0,n.add(r);const o=[];for(let a=-52;a<=50;a+=4)Math.abs(a)>6&&o.push(ae(1.6,.02,.14,a,.07,0));for(let a=-26;a<=26;a+=4)Math.abs(a)>6&&o.push(ae(.14,.02,1.6,0,.07,a));n.add(new Kt(Gn(o),new on({color:3884371}))),H.sectorOverlay=[],H.sectorLine=[];for(let a=0;a<4;a++){const l=$n[a],c=new Kt(ae(46.6,.08,19.9,l.x,.04,l.z),xe({color:1449498,roughness:1}));c.receiveShadow=!0,n.add(c);const h=new Kt(new _r(46.6,19.9),new on({color:13111342,transparent:!0,opacity:0,depthWrite:!1}));h.rotation.x=-Math.PI/2,h.position.set(l.x,.42,l.z),h.renderOrder=2,n.add(h),H.sectorOverlay.push(h);const u=23.4,d=10.05,f=.1,g=[new L(l.x-u,f,l.z-d),new L(l.x+u,f,l.z-d),new L(l.x+u,f,l.z+d),new L(l.x-u,f,l.z+d)],_=new Wv(new Ce().setFromPoints(g),new $s({color:2902618,transparent:!0,opacity:.9}));n.add(_),H.sectorLine.push(_)}}function CT(){const n=Wt.field[0],t=ae(4.3,.1,3.5,0,.13,0),e=ae(2.75,.06,2.95,n,.21,0),i=[];for(let B=0;B<7;B++)i.push(ae(2.55,.17,.2,n,.31,-1.2+B*.4));const s=Gn(i),r=ae(.85,.55,.7,Wt.house[0],.455,Wt.house[1]),o=new Mr(.63,.38,4).rotateY(Math.PI/4).translate(Wt.house[0],.92,Wt.house[1]),a=new Ii(.12,12,8).translate(Wt.house[0],1.25,Wt.house[1]),l=new Le(.4,.4,1.2,22,1,!0).translate(Wt.tank[0],.78,Wt.tank[1]),c=Gn([new Le(.5,.52,.08,22).translate(Wt.tank[0],.2,Wt.tank[1]),new Le(.42,.42,.06,22).translate(Wt.tank[0],.24,Wt.tank[1]),new Le(.43,.43,.06,22).translate(Wt.tank[0],1.36,Wt.tank[1])]),h=new Le(.36,.36,1,22).translate(0,.5,0),u=ae(.42,.3,.36,Wt.pump[0],.33,Wt.pump[1]),d=Gn([new Le(.07,.07,.06,10),ae(.34,.025,.07),ae(.34,.025,.07).rotateY(Math.PI/3),ae(.34,.025,.07).rotateY(-Math.PI/3)]),f=new Le(.055,.055,1,8,1,!0).translate(0,.5,0),g=new Ii(.07,8,6),_=xe({roughness:1}),m=xe({roughness:.95}),p=xe({roughness:.8}),v=xe({color:14275784,roughness:.8}),x=xe({roughness:.7}),y=new on({color:16777215}),b=new Ks({color:12572394,transparent:!0,opacity:.2,roughness:.1,metalness:.2,side:dn,depthWrite:!1}),E=xe({color:7305862,metalness:.6,roughness:.4}),S=new Ks({color:16777215,roughness:.15,metalness:0,emissive:734054,emissiveIntensity:.55}),C=xe({color:6056826,metalness:.5,roughness:.45}),M=xe({color:13226973,metalness:.7,roughness:.3}),w=new Ks({color:10997226,transparent:!0,opacity:.32,roughness:.1,depthWrite:!1}),U=new on({color:16777215}),O=H.farm={plot:Ie(t,_,Mt,{receive:!0,shadow:!1}),field:Ie(e,m,Mt,{receive:!0,shadow:!1}),crop:Ie(s,p,Mt,{receive:!0}),house:Ie(r,v,Mt,{receive:!0}),roof:Ie(o,x,Mt),led:Ie(a,y,Mt,{shadow:!1}),shell:Ie(l,b,Mt,{shadow:!1}),rims:Ie(c,E,Mt),water:Ie(h,S,Mt,{dynamic:!0,shadow:!1}),pump:Ie(u,C,Mt),imp:Ie(d,M,Mt,{dynamic:!0}),pipeM:Ie(f,w,Mt,{shadow:!1}),pipeP:Ie(f,w,Mt,{shadow:!1}),drops:Ie(g,U,Mt*6,{dynamic:!0,shadow:!1})};O.shell.renderOrder=3,O.pipeM.renderOrder=3,O.pipeP.renderOrder=3;const Z=Nc(77),D=[8010547,3428703,6113850,4086342,7040885],F=new L().subVectors(Wt.pipeMainB,Wt.pipeMainA),V=F.length();F.normalize();const $=new L().subVectors(Wt.pipePumpB,Wt.pipePumpA),K=$.length();$.normalize();const Y=new Sn().setFromUnitVectors(Oa,F),Q=new Sn().setFromUnitVectors(Oa,$),et=new xt;for(let B=0;B<Mt;B++){const J=mt.x[B],ct=mt.z[B];for(const vt of["plot","field","crop","house","roof","led","shell","rims","pump"])Oe(O[vt],B,J,0,ct);Oe(O.pipeM,B,J+Wt.pipeMainA.x,Wt.pipeMainA.y,ct+Wt.pipeMainA.z,1,V,1,Y),Oe(O.pipeP,B,J+Wt.pipePumpA.x,Wt.pipePumpA.y,ct+Wt.pipePumpA.z,1,K,1,Q),O.plot.setColorAt(B,et.setHex(2761499).offsetHSL(0,0,(Z()-.5)*.03)),O.roof.setColorAt(B,et.setHex(D[Math.floor(Z()*D.length)])),O.field.setColorAt(B,Zn.soilDry),O.crop.setColorAt(B,Zn.lush),O.led.setColorAt(B,Kn.idle),O.water.setColorAt(B,Zn.water),Oe(O.water,B,J+Wt.tank[0],.27,ct+Wt.tank[1],1,.5,1),Oe(O.imp,B,J+Wt.pump[0],.51,ct+Wt.pump[1])}for(let B=0;B<Mt*6;B++)Oe(O.drops,B,0,-10,0,0,0,0),O.drops.setColorAt(B,Kn.pump);for(const B in O)O[B].instanceMatrix.needsUpdate=!0,O[B].instanceColor&&(O[B].instanceColor.needsUpdate=!0);O.dispLevel=new Float32Array(Mt),O.dispMoist=new Float32Array(Mt),O.dispStress=new Float32Array(Mt),O.dispWet=new Float32Array(Mt),O.imp_a=new Float32Array(Mt),O.qM=Y;const pt=new Xv(new Qi(4.45,.5,3.65));H.hover=new Vo(pt,new $s({color:12577279,transparent:!0,opacity:.8})),H.select=new Vo(pt,new $s({color:13111342})),H.hover.visible=H.select.visible=!1,H.scene.add(H.hover,H.select)}function RT(){const{scene:n}=H,t=new xr;n.add(t),H.station=t;const e=new Kt(ae(9.2,.22,9.2,0,.11,0),xe({color:2304821,roughness:.9}));e.receiveShadow=!0,t.add(e);const i=xe({color:9016739,metalness:.65,roughness:.38}),s=[],r=[],o=[];for(const f of[-2.4,0,2.4]){s.push(ae(1.6,1.5,1.3,f,.97,-1.7));for(let g=-3;g<=3;g++)r.push(ae(.04,1.2,.3,f+g*.2,.9,-1.7+.8));for(let g=-1;g<=1;g++)o.push(new Le(.07,.11,.6,8).translate(f+g*.45,2.02,-1.7))}const a=new Kt(Gn([...s,...r]),i);a.castShadow=a.receiveShadow=!0,t.add(a),t.add(new Kt(Gn(o),xe({color:13154458,roughness:.5})));const l=Gn([ae(.18,4,.18,-3.6,2.2,-3.6),ae(.18,4,.18,3.6,2.2,-3.6),ae(7.4,.18,.18,0,4.1,-3.6),ae(.18,4,.18,-3.6,2.2,3.6),ae(.18,4,.18,3.6,2.2,3.6)]),c=new Kt(l,i);c.castShadow=!0,t.add(c);const h=new Kt(ae(3.4,1.5,2,-1,.97,2),xe({color:3819093,roughness:.7}));h.castShadow=h.receiveShadow=!0,t.add(h),H.stStrip=new Kt(ae(3.1,.14,.04,-1,1.25,3.02),new on({color:new xt(.2,1.8,.8)})),t.add(H.stStrip);const u=new Kt(new Le(.1,.42,7.5,4).translate(2.6,3.97,2.3),i);u.castShadow=!0,t.add(u),H.beacon=new Kt(new Ii(.26,14,10).translate(2.6,7.95,2.3),new on({color:new xt(.2,2,.8)})),t.add(H.beacon),H.warn=[];for(const[f,g]of[[-4.3,-4.3],[4.3,-4.3],[-4.3,4.3],[4.3,4.3]]){const _=new Kt(new Le(.06,.06,1.2,6).translate(f,.82,g),i);t.add(_);const m=new Kt(new Ii(.2,12,8).translate(f,1.5,g),new on({color:new xt(.2,1.6,.6)}));t.add(m),H.warn.push(m)}const d=new on({color:new xt(.2,1.8,.8),transparent:!0,opacity:.9,side:dn,depthWrite:!1});H.ring=new Kt(new Yo(6,6.3,72).rotateX(-Math.PI/2),d),H.ring.position.y=.09,t.add(H.ring),H.shock=new Kt(new Yo(6,6.45,72).rotateX(-Math.PI/2),new on({color:new xt(3,.2,.2),transparent:!0,opacity:0,side:dn,depthWrite:!1})),H.shock.position.y=.1,t.add(H.shock);for(const[f,g]of[[-1,-1],[1,-1],[-1,1],[1,1]]){const _=new Kt(new Le(.08,.1,3.4,6).translate(f*3.4,1.8,g*4),i);_.castShadow=!0,t.add(_)}}function PT(){const{scene:n}=H,t=-74,e=0,i=new Kt(new Le(11,11.6,2.4,64,1,!0).translate(t,1.2,e),xe({color:4871262,roughness:.9,side:dn}));i.castShadow=i.receiveShadow=!0,n.add(i),n.add(new Kt(new zl(11.3,.28,8,64).rotateX(Math.PI/2).translate(t,2.4,e),xe({color:6121587,roughness:.8})));const s=new Kt(new Go(11,48).rotateX(-Math.PI/2).translate(t,.05,e),xe({color:792352}));n.add(s),H.resWater=new Kt(new Go(10.95,64).rotateX(-Math.PI/2),new Ks({color:1929144,roughness:.08,metalness:.25,transparent:!0,opacity:.9,emissive:668246,emissiveIntensity:.7})),H.resWater.position.set(t,1.8,e),n.add(H.resWater);const r=new Kt(ae(3.6,2.2,3,-59.5,1.1,-6.5),xe({color:3819093}));r.castShadow=!0,n.add(r),n.add(new Kt(new Mr(2.8,.8,4).rotateY(Math.PI/4).translate(-59.5,2.6,-6.5),xe({color:2831424})));const o=new Ks({color:10274534,transparent:!0,opacity:.3,roughness:.1,depthWrite:!1}),a=Gn([new Le(.22,.22,116,12,1,!0).rotateZ(Math.PI/2).translate(-5,.35,-4.4),new Le(.22,.22,116,12,1,!0).rotateZ(Math.PI/2).translate(-5,.35,4.4)]),l=new Kt(a,o);l.renderOrder=3,n.add(l),H.mainDrops=Ie(new Ii(.16,8,6),new on({color:16777215}),80,{dynamic:!0,shadow:!1});for(let c=0;c<80;c++)H.mainDrops.setColorAt(c,new xt(.25,.9,2.4))}function LT(){const e=Gn([new Le(.05,.07,2.5,6).translate(0,1.25,0),ae(.72,.06,.07,0,2.38,0)]),i=[];H.paths=[],H.wires=[];const s=(l,c,h)=>{for(let d=h.length?1:0;d<=8;d++){const f=d/8,g=new L().lerpVectors(l,c,f);g.y-=.22*Math.sin(Math.PI*f)*(l.distanceTo(c)/4.6),h.push(g)}};for(let l=0;l<4;l++){const c=$n[l],h=Math.sign(c.x),u=Math.sign(c.z),d=new L(h*3.4,3.45,u*4),f=new L(h*4.4,2.45,u*5.6),g=[];for(let x=0;x<5;x++)g.push(c.z+(x-2)*ce.PZ-ce.PZ/2);g.sort((x,y)=>Math.abs(x)-Math.abs(y));const _=[],m=[f,...g.map(x=>new L(h*4.4,2.45,x))];i.push({x:f.x,z:f.z,rot:0});for(let x=1;x<m.length;x++)i.push({x:m[x].x,z:m[x].z,rot:0});_.push([d,f]);for(let x=1;x<m.length;x++)_.push([m[x-1],m[x]]);g.forEach((x,y)=>{const b=[];for(let C=0;C<=10;C++)b.push(new L(h*(4.4+C*4.66),2.45,x));for(let C=1;C<b.length;C++)i.push({x:b[C].x,z:x,rot:Math.PI/2}),_.push([b[C-1],b[C]]);const E=[];s(d,f,E);for(let C=1;C<=y+1;C++)s(m[C-1],m[C],E);for(let C=1;C<b.length;C++)s(b[C-1],b[C],E);const S=[0];for(let C=1;C<E.length;C++)S.push(S[C-1]+E[C].distanceTo(E[C-1]));H.paths.push({s:l,pts:E,cum:S,len:S[S.length-1],off:Math.random()})});const p=[];for(const[x,y]of _){const b=new L().subVectors(y,x),E=new L(-b.z,0,b.x).normalize().multiplyScalar(.28);for(const S of[E,E.clone().negate()]){const C=[];s(x.clone().add(S),y.clone().add(S),C);for(let M=1;M<C.length;M++)p.push(C[M-1],C[M])}}const v=new Vo(new Ce().setFromPoints(p),new $s({color:7176082,transparent:!0,opacity:.55}));H.scene.add(v),H.wires.push(v)}const r=Ie(e,xe({color:5917243,roughness:.9}),i.length),o=new Sn;i.forEach((l,c)=>{o.setFromAxisAngle(Oa,l.rot),Oe(r,c,l.x,0,l.z,1,1,1,o)}),r.instanceMatrix.needsUpdate=!0;const a=5;H.energy=Ie(new Ii(.1,8,6),new on({color:16777215}),H.paths.length*a,{dynamic:!0,shadow:!1}),H.energyK=a;for(let l=0;l<H.paths.length*a;l++)H.energy.setColorAt(l,new xt(.2,1.4,2.8));H.pathU=new Float32Array(H.paths.length).map(()=>Math.random())}function DT(n,t,e){t=(t%n.len+n.len)%n.len;let i=0,s=n.cum.length-1;for(;s-i>1;){const o=i+s>>1;n.cum[o]<=t?i=o:s=o}const r=n.cum[s]-n.cum[i]||1;return e.lerpVectors(n.pts[i],n.pts[s],(t-n.cum[i])/r)}function IT(){const n=Nc(911),t=[];for(;t.length<320;){const r=(n()-.5)*300,o=(n()-.5)*210;Math.abs(r+2)<62&&Math.abs(o)<34||Math.hypot(r+74,o)<17||Math.abs(r+59.5)<5&&Math.abs(o+6.5)<5||t.push([r,o,.7+n()*.9,n()])}const e=Ie(new Mr(1.1,3,7).translate(0,2.7,0),xe({roughness:.9}),t.length),i=Ie(new Le(.12,.16,1.3,5).translate(0,.65,0),xe({color:4864556}),t.length),s=new xt;t.forEach(([r,o,a,l],c)=>{Oe(e,c,r,0,o,a,a,a),Oe(i,c,r,0,o,a,a,a),e.setColorAt(c,s.setHSL(.27+l*.08,.35,.16+l*.06))}),e.receiveShadow=!0}const Zr={target:new L(-6,0,3),pos:new L(44,62,88)},Rn={active:!1};function Wc(n,t,e=1.5){if(H.ok){if(e<=0){H.camera.position.copy(n),H.controls.target.copy(t),Rn.active=!1;return}Object.assign(Rn,{active:!0,t:0,dur:e,p0:H.camera.position.clone(),p1:n.clone(),q0:H.controls.target.clone(),q1:t.clone()})}}function gs(n=1.5){Wc(Zr.pos,Zr.target,n)}function Xc(n,t=1.6,e=!1){const i=$n[n],s=new L(i.x,0,i.z);Wc(s.clone().add(e?new L(9,17,22):new L(20,40,52)),s,t)}function OT(n,t=1.4){const e=new L(mt.x[n]+.3,.5,mt.z[n]);Wc(e.clone().add(new L(6.5,7.2,9.5)),e,t)}function UT(n){if(!Rn.active)return;Rn.t+=n/Rn.dur;const t=_T(Math.min(1,Rn.t));H.camera.position.lerpVectors(Rn.p0,Rn.p1,t),H.controls.target.lerpVectors(Rn.q0,Rn.q1,t),Rn.t>=1&&(Rn.active=!1)}const Hn=new xt,jc=new xt,We=new L;let Vi=0;function Ua(){return z.tameru?Ee:Ae}function em(n,t){return n.short[t]?"short":n.shed[mt.sec[t]]?"cut":n.pumpOn[t]?n.emerg[t]?"emerg":"pump":n.resched[t]?"resched":n.irrig[t]?"stored":"idle"}function nm(n){Vi+=n;const t=Ua(),e=H.farm,i=Math.min(1,n*5),s=Math.min(1,n*2.2),r=Math.sin(Vi*9)>0;for(let f=0;f<Mt;f++){const g=mt.x[f],_=mt.z[f],m=t.level[f]/mt.cap[f];e.dispLevel[f]+=(m-e.dispLevel[f])*i,e.dispMoist[f]+=(t.moist[f]-e.dispMoist[f])*s,e.dispStress[f]+=((t.short[f]?1:0)-e.dispStress[f])*s;const p=t.irrig[f]&&!t.short[f]?1:0;e.dispWet[f]+=(p-e.dispWet[f])*s,Oe(e.water,f,g+Wt.tank[0],.27,_+Wt.tank[1],1,Math.max(.005,e.dispLevel[f]*1.06),1),Hn.copy(Zn.water),e.dispLevel[f]<.2&&Hn.lerp(Zn.waterLow,1-e.dispLevel[f]/.2),e.water.setColorAt(f,Hn),t.pumpOn[f]&&(e.imp_a[f]+=n*16),Jp.setFromAxisAngle(Oa,e.imp_a[f]),Oe(e.imp,f,g+Wt.pump[0],.51,_+Wt.pump[1],1,1,1,Jp);const v=em(t,f);let x=Kn.idle;v==="short"?x=r?Kn.short:Kn.off:v==="cut"?x=r?Kn.cut:Kn.off:x=Kn[v],e.led.setColorAt(f,x),Hn.copy(Zn.soilDry).lerp(Zn.soilWet,e.dispWet[f]*.85),e.field.setColorAt(f,Hn);const y=Fc(.15,.8,e.dispMoist[f]);Hn.copy(Zn.dry).lerp(Zn.lush,y).lerp(Zn.parched,e.dispStress[f]*.85),e.dispWet[f]>.01&&(jc.setRGB(.05,.16,.12),Hn.lerp(jc,e.dispWet[f]*.12)),e.crop.setColorAt(f,Hn);const b=f*6,E=mt.phase[f],S=t.irrig[f]&&!t.short[f];for(let C=0;C<4;C++)if(S){const M=(Vi*.55+C/4+E)%1;We.lerpVectors(Wt.pipeMainA,Wt.pipeMainB,M),Oe(e.drops,b+C,g+We.x,We.y,_+We.z),e.drops.setColorAt(b+C,jc.setRGB(.25,.85,2.6))}else Oe(e.drops,b+C,0,-10,0,0,0,0);for(let C=0;C<2;C++)if(t.pumpOn[f]){const M=(Vi*1.1+C/2+E)%1;We.lerpVectors(Wt.pipePumpA,Wt.pipePumpB,M),Oe(e.drops,b+4+C,g+We.x,We.y,_+We.z,.85,.85,.85),e.drops.setColorAt(b+4+C,t.emerg[f]?Kn.emerg:Kn.pump)}else Oe(e.drops,b+4+C,0,-10,0,0,0,0)}for(const f of["water","imp","drops"])e[f].instanceMatrix.needsUpdate=!0;for(const f of["water","led","field","crop","drops"])e[f].instanceColor.needsUpdate=!0;const o=t.st.req/t.st.cap,a=t.st.shedN>0||o>1,l=a?new xt(3,.25,.25):o>.85?new xt(2.6,1.2,.12):new xt(.2,2,.8),c=H.energyK;H.paths.forEach((f,g)=>{const _=f.s,m=t.shed[_],p=t.L[_]||0,v=3+13*Yn(p/330,0,1.6);H.pathU[g]+=n*v;for(let x=0;x<c;x++){const y=g*c+x;if(m){Oe(H.energy,y,0,-10,0,0,0,0);continue}DT(f,H.pathU[g]+x*f.len/c+f.off*f.len,We),Oe(H.energy,y,We.x,We.y,We.z),H.energy.setColorAt(y,a?Hn.setRGB(3,.35,.25):o>.85?Hn.setRGB(2.8,1.3,.15):Hn.setRGB(.25,1.5,2.8))}}),H.energy.instanceMatrix.needsUpdate=!0,H.energy.instanceColor.needsUpdate=!0;for(let f=0;f<4;f++){const g=t.shed[f],_=H.sectorOverlay[f],m=g?.08+.035*Math.sin(Vi*4):0;_.material.opacity+=(m-_.material.opacity)*Math.min(1,n*4),_.visible=_.material.opacity>.003,H.sectorLine[f].material.color.setHex(g?13111342:t.managed?1483594:2902618),H.wires[f].material.color.setHex(g?5904408:a?10104880:7176082)}const h=.5+.5*Math.sin(Vi*(a?10:2.4));if(H.ring.material.color.copy(l).multiplyScalar(a?.6+.6*h:.8+.2*h),H.stStrip.material.color.copy(l),H.beacon.material.color.copy(l).multiplyScalar(a?r?1.2:.15:1),H.warn.forEach((f,g)=>f.material.color.copy(a?r^g%2?new xt(3.4,.2,.2):new xt(.3,.02,.02):l).multiplyScalar(a?1:.6)),a){const f=Vi%1.2/1.2;H.shock.scale.setScalar(1+f*1.6),H.shock.material.opacity=.75*(1-f)}else H.shock.material.opacity=0;H.resWater.position.y=1.15+1*Yn(.85-t.day.pumped/9e3,.25,.95);const u=H.mainDrops,d=t.st.active/Mt;for(let f=0;f<80;f++){if(d<.01){Oe(u,f,0,-10,0,0,0,0);continue}const g=f%2,_=(Vi*(.03+.12*d)+f/80*2)%1;Oe(u,f,-62+_*112,.35,g?4.4:-4.4)}u.instanceMatrix.needsUpdate=!0,FT(z.t+z.acc),hn.farm>=0&&H.select.position.set(mt.x[hn.farm],.38,mt.z[hn.farm])}function FT(n){const t=(n-360)/810,e=Math.sin(Math.PI*Yn(t,-.12,1.12)),i=Yn(e,0,1),s=H.sun;s.position.set(-8+Math.cos(Math.PI*Yn(t,0,1))*95,14+i*90,50),s.target.position.set(-8,0,0),s.intensity=.4+2.2*i,s.color.setRGB(1,rr(.62,.95,Fc(0,.5,i)),rr(.42,.86,Fc(0,.6,i))),e<=0&&s.color.setRGB(.55,.65,1),H.hemi.intensity=.38+.7*i,H.scene.background.setRGB(rr(.028,.045,i),rr(.04,.066,i),rr(.066,.095,i)),H.scene.fog.color.copy(H.scene.background),H.bloom&&(H.bloom.strength=rr(.85,.5,i))}const im=[];function NT(){const n=N("labels"),t=(e,i,s)=>{const r=document.createElement("div");r.className="chip "+e,r.innerHTML=i,n.appendChild(r);const o={el:r,pos:s};return im.push(o),o};H.secLabels=$n.map(e=>t("",`<i></i><b>SECTOR ${e.n}</b><span>— kW</span>`,new L(e.x,3.4,e.z))),H.stLabel=t("st","<i></i><b>SUBSTATION</b><span>—</span>",new L(0,9.2,2.3)),H.resLabel=t("st",'<i style="background:var(--water)"></i><b>RESERVOIR</b><span>—</span>',new L(-74,4.2,0))}function sm(n){const t=H.canvas.clientWidth,e=H.canvas.clientHeight;for(const r of im){if(We.copy(r.pos).project(H.camera),We.z>1||We.z<-1){r.el.style.display="none";continue}r.el.style.display="";const o=(We.x*.5+.5)*t,a=(-We.y*.5+.5)*e;r.el.style.transform=`translate(${o.toFixed(1)}px,${a.toFixed(1)}px) translate(-50%,-100%)`}if(!n)return;const i=Ua();H.secLabels.forEach((r,o)=>{const a=i.shed[o];r.el.classList.toggle("off",!!a),r.el.querySelector("span").textContent=a?le==="ja"?"停電中":"POWER CUT":le==="ja"?"通電中":"POWER ON"});const s=i.st.req/i.st.cap;H.stLabel.el.classList.toggle("over",i.st.shedN>0||s>1),H.stLabel.el.querySelector("i").style.background=i.st.shedN>0||s>1?"var(--red)":s>.85?"var(--amber)":"var(--green)",H.stLabel.el.querySelector("span").textContent=i.st.shedN>0||s>1?le==="ja"?"容量超過":"Over capacity":s>.85?le==="ja"?"高負荷":"High load":le==="ja"?"通常":"Normal load",H.resLabel.el.querySelector("span").textContent=i.st.active>0?le==="ja"?"揚水中":"pumps drawing":le==="ja"?"揚水なし":"no pumping"}const hn={farm:-1,hover:-1,down:null},rm=new Jv,om=new St;function am(n){const t=H.canvas.getBoundingClientRect();om.set((n.clientX-t.left)/t.width*2-1,-((n.clientY-t.top)/t.height)*2+1),rm.setFromCamera(om,H.camera);const e=rm.intersectObjects([H.farm.plot,H.farm.crop,H.farm.house,H.farm.shell],!1);return e.length?e[0].instanceId:-1}let Fa=null;function kT(){const n=H.canvas;n.addEventListener("pointermove",t=>{Fa=t}),n.addEventListener("pointerdown",t=>{hn.down=[t.clientX,t.clientY]}),n.addEventListener("pointerup",t=>{if(!hn.down)return;const e=Math.hypot(t.clientX-hn.down[0],t.clientY-hn.down[1]);if(hn.down=null,e>5||un.active)return;const i=am(t);i>=0&&YT(i)})}function BT(){if(!Fa)return;const n=Fa;Fa=null;const t=un.active?-1:am(n);hn.hover=t,H.hover.visible=t>=0&&t!==hn.farm,t>=0&&H.hover.position.set(mt.x[t],.38,mt.z[t]),H.canvas.style.cursor=t>=0?"pointer":""}const Jn={};function zT(){if(!window.Chart)return;xn.defaults.font.family="'Jost', 'Inter', sans-serif",xn.defaults.color="#5b6573";const n={color:"rgba(23,23,23,0.06)",drawTicks:!1},t={id:"peakBand",beforeDatasetsDraw(r){const{ctx:o,chartArea:a,scales:{x:l}}=r;if(a){if(o.save(),r.canvas.id==="demandChart"){o.font="700 9px Jost, sans-serif",o.textAlign="left";for(const c of z.surges){const h=l.getPixelForValue(c),u=l.getPixelForValue(Math.min(1440,c+ce.SURGE_MIN));o.fillStyle="rgba(200,16,46,0.12)",o.fillRect(h,a.top,u-h,a.bottom-a.top),o.fillStyle="rgba(200,16,46,0.9)",o.fillText("SURGE",h+4,a.bottom-5)}}o.restore()}},afterDatasetsDraw(r){const{ctx:o,chartArea:a,scales:{x:l}}=r;if(!a)return;const c=l.getPixelForValue(z.t);o.save(),o.strokeStyle="rgba(23,23,23,0.6)",o.lineWidth=1.2,o.beginPath(),o.moveTo(c,a.top),o.lineTo(c,a.bottom),o.stroke(),o.restore()}},e=(r,o)=>a=>{const{ctx:l,chartArea:c}=a.chart;if(!c)return`rgba(${r},0.08)`;const h=l.createLinearGradient(0,c.top,0,c.bottom);return h.addColorStop(0,`rgba(${r},${o})`),h.addColorStop(1,`rgba(${r},0)`),h},i={type:"linear",min:0,max:1440,grid:n,border:{display:!1},ticks:{stepSize:180,padding:6,font:{size:9.5,family:"'JetBrains Mono', monospace"},callback:r=>vn(r)}},s={backgroundColor:"rgba(255,255,255,0.95)",titleColor:"#171717",bodyColor:"#303030",borderColor:"rgba(23,23,23,0.15)",borderWidth:1,padding:9,titleFont:{family:"'JetBrains Mono', monospace",size:11},bodyFont:{size:11},callbacks:{title:r=>r.length?vn(r[0].parsed.x):""}};Jn.demand=new xn(N("demandChart"),{type:"line",data:{datasets:[{label:le==="ja"?"Tameruなし":"Without Tameru",data:Ge.A,borderColor:"#C8102E",backgroundColor:e("200,16,46",.22),borderWidth:2,pointRadius:0,tension:.25,fill:"origin"},{label:le==="ja"?"Tameru導入":"With Tameru",data:Ge.B,borderColor:"#16a34a",backgroundColor:e("22,163,74",.2),borderWidth:1.4,pointRadius:0,tension:.25,fill:!1},{label:le==="ja"?"系統定格容量":"Grid capacity",data:Ge.cap,borderColor:"rgba(23,23,23,0.45)",borderDash:[5,5],borderWidth:1,pointRadius:0,fill:!1}]},options:{animation:!1,responsive:!0,maintainAspectRatio:!1,parsing:!1,normalized:!0,interaction:{mode:"nearest",axis:"x",intersect:!1},plugins:{legend:{display:!1},tooltip:{...s,callbacks:{...s.callbacks,label:r=>` ${r.dataset.label}`}}},scales:{x:i,y:{min:0,suggestedMax:1400,grid:n,border:{display:!1},ticks:{display:!1}}}},plugins:[t]}),Jn.water=new xn(N("waterChart"),{type:"line",data:{datasets:[{label:"Without",data:Ge.fA,borderColor:"#C8102E",borderWidth:1.4,pointRadius:0,tension:.3,fill:!1},{label:"With Tameru",data:Ge.fB,borderColor:"#0284c7",backgroundColor:e("2,132,199",.25),borderWidth:1.8,pointRadius:0,tension:.3,fill:"origin"}]},options:{animation:!1,responsive:!0,maintainAspectRatio:!1,parsing:!1,normalized:!0,interaction:{mode:"nearest",axis:"x",intersect:!1},plugins:{legend:{display:!1},tooltip:{...s,callbacks:{...s.callbacks,label:r=>` ${r.dataset.label}: ${r.parsed.y.toFixed(0)}% avg fill`}}},scales:{x:{...i,ticks:{...i.ticks,stepSize:360}},y:{min:0,max:100,grid:n,border:{display:!1},ticks:{stepSize:50,padding:4,font:{size:9,family:"'JetBrains Mono', monospace"},callback:r=>r+"%"}}}},plugins:[t]}),lm()}function lm(){if(!Jn.demand)return;const[n,t]=Jn.demand.data.datasets,e=z.tameru;n.borderWidth=e?1.3:2.2,t.borderWidth=e?2.2:1.3,n.borderColor=e?"rgba(200,16,46,0.45)":"#C8102E",t.borderColor=e?"#16a34a":"rgba(22,163,74,0.45)",n.fill=e?!1:"origin",t.fill=e?"origin":!1;const[i,s]=Jn.water.data.datasets;i.borderColor=e?"rgba(200,16,46,0.45)":"#C8102E",s.borderColor=e?"#0284c7":"rgba(2,132,199,0.45)",i.fill=!1,s.fill=e?"origin":!1,z.dirtyChart=!0}function Jr(n,t){Jn.demand&&(!t&&n-z.lastChart<220||(z.lastChart=n,Jn.demand.update("none"),Jn.water.update("none"),z.dirtyChart=!1))}function HT(){const n=N("fcCanvas"),t=Math.min(2,window.devicePixelRatio||1),e=n.clientWidth,i=n.clientHeight;if(!e)return;n.width!==Math.round(e*t)&&(n.width=Math.round(e*t),n.height=Math.round(i*t));const s=n.getContext("2d");s.setTransform(t,0,0,t,0,0),s.clearRect(0,0,e,i);const r=$r(),o=Math.max(r*1.4,z.fcPeak*1.08),a=d=>4+d/1440*(e-8),l=d=>i-6-d/o*(i-12),c=z.fc;s.beginPath(),s.moveTo(a(0),l(0));for(let d=0;d<=96;d++)s.lineTo(a(d*15),l(c[d]));s.lineTo(a(1440),l(0)),s.closePath();const h=s.createLinearGradient(0,0,0,i);h.addColorStop(0,"rgba(200,16,46,0.22)"),h.addColorStop(1,"rgba(200,16,46,0.02)"),s.fillStyle=h,s.fill(),s.beginPath();for(let d=0;d<=96;d++)s[d?"lineTo":"moveTo"](a(d*15),l(c[d]));s.strokeStyle="rgba(200,16,46,0.7)",s.lineWidth=1.2,s.setLineDash([3,2]),s.stroke(),s.setLineDash([]);const u=z.tameru?Ge.B:Ge.A;u.length>1&&(s.beginPath(),u.forEach((d,f)=>s[f?"lineTo":"moveTo"](a(d.x),l(d.y))),s.strokeStyle=z.tameru?"#16a34a":"#C8102E",s.lineWidth=1.6,s.stroke()),s.strokeStyle="rgba(23,23,23,0.3)",s.setLineDash([4,3]),s.lineWidth=1,s.beginPath(),s.moveTo(0,l(r)),s.lineTo(e,l(r)),s.stroke(),s.setLineDash([]),s.fillStyle="#C8102E",s.fillRect(a(z.t)-.5,0,1.5,i),s.font="700 8.5px Jost, sans-serif",s.fillStyle="rgba(23,23,23,0.6)",s.fillText("CAPACITY",6,l(r)-3),s.fillStyle="rgba(200,16,46,0.85)",s.fillText("FORECAST",6,i-6)}class xi{constructor(t,e,i=7){this.el=t,this.fmt=e,this.v=0,this.target=0,this.rate=i,this.last=""}set(t,e){this.target=t,e&&(this.v=t)}tick(t){const e=this.target-this.v;this.v=Math.abs(e)<.001?this.target:this.v+e*Math.min(1,t*this.rate);const i=this.fmt(this.v);i!==this.last&&(this.el.textContent=i,this.last=i)}}const vi={};function VT(){vi.nums={demand:new xi(N("mDemand"),i=>(i/1e3).toFixed(2)),util:new xi(N("mUtil"),i=>Math.round(i)+"%"),pumps:new xi(N("mPumps"),i=>Math.round(i)),resched:new xi(N("mResched"),i=>z.tameru?Math.round(i):"—"),shed:new xi(N("mShed"),i=>Math.round(i)),stored:new xi(N("wStored"),i=>qn(i)),fill:new xi(N("wFill"),i=>Math.round(i)),irr:new xi(N("wIrr"),i=>Math.round(i)),short:new xi(N("wShort"),i=>Math.round(i))},N("playBtn").onclick=()=>Qn(!z.running),N("resetBtn").onclick=()=>{Jc(),Kp(),Qn(!1),gs(1.2),to("Simulation reset to 06:00, day 1")},N("speedSeg").querySelectorAll("button").forEach(i=>i.onclick=()=>Yc(+i.dataset.v)),N("scenarioSeg").querySelectorAll("button").forEach(i=>i.onclick=()=>bi(i.dataset.s==="1")),N("tameruSwitch").onclick=()=>bi(!z.tameru),N("peakBtn").onclick=$c,N("heatBtn").onclick=()=>qc(!z.heat),N("demoBtn").onclick=eo,N("capExit").onclick=Jc,N("cmpClose").onclick=()=>{N("compare").classList.add("hidden")},N("cmpReplay").onclick=()=>{N("compare").classList.add("hidden"),eo()},N("iClose").onclick=Na,N("iBack").onclick=()=>{Na(),gs(1.3)};const n=N("timeline");let t=null;n.addEventListener("pointerdown",()=>{vi.scrubbing=!0}),n.addEventListener("input",()=>{t=+n.value,vi.scrubRAF||(vi.scrubRAF=requestAnimationFrame(()=>{vi.scrubRAF=0,t!=null&&(Ia(t),t=null,Jr(0,!0))}))}),n.addEventListener("change",()=>{vi.scrubbing=!1}),window.addEventListener("pointerup",()=>{vi.scrubbing=!1}),window.addEventListener("keydown",i=>{i.target.tagName==="INPUT"&&i.target.type!=="range"||(i.code==="Escape"&&(un.active?Jc():N("compare").classList.contains("hidden")?Na():N("compare").classList.add("hidden")),!un.active&&(i.code==="Space"?(i.preventDefault(),Qn(!z.running)):i.key==="t"||i.key==="T"?bi(!z.tameru):i.key==="h"||i.key==="H"?qc(!z.heat):i.key==="d"||i.key==="D"?eo():i.key==="r"||i.key==="R"?N("resetBtn").click():(i.key==="p"||i.key==="P")&&$c()))});const e=N("capDots");for(let i=0;i<8;i++)e.appendChild(document.createElement("i"));kc()}function Qn(n){z.running=n,N("playLbl").textContent=n?le==="ja"?"一時停止":"Pause":le==="ja"?"開始":"Start",N("playIco").innerHTML=n?'<path d="M4 2.5h3v11H4zM9 2.5h3v11H9z"/>':'<path d="M4 2.5v11l9-5.5-9-5.5Z"/>'}function Yc(n){z.speed=n,z.demoRate=null,N("speedSeg").querySelectorAll("button").forEach(t=>t.classList.toggle("on",+t.dataset.v===n))}function bi(n,t){z.tameru=n,N("scenarioSeg").querySelectorAll("button").forEach(e=>e.classList.toggle("on",e.dataset.s==="1"===n)),N("tameruSwitch").setAttribute("aria-checked",n?"true":"false"),N("swRow").classList.toggle("on",n),N("swSub").textContent=n?le==="ja"?"稼働中 — AI予測に基づく需要平準化":"On — forecast-driven pump scheduling":le==="ja"?"停止中 — 各農場が個別に揚水":"Off — pumps follow farm schedules",lm(),t||to(n?"Showing the district <b>with Tameru</b> — coordinated pump scheduling":"Showing the district <b>without Tameru</b> — unmanaged schedules")}function qc(n){z.heat=n,Kr(),Qr(),to(n?le==="ja"?"猛暑（説明用）：作物の必要水量が増え、配電線の容量が下がります":"Heatwave (illustrative): crops need more water, the line carries less":le==="ja"?"猛暑が終わりました":"Heatwave ended")}function $c(){z.t>1420||(z.surges.push(z.t),Qr(),N("peakBtn").classList.remove("flash"),N("peakBtn").offsetWidth,N("peakBtn").classList.add("flash"),to(le==="ja"?"突発的な需要の急増：Tameruはポンプを止めて配電線を守ります":"Unplanned demand surge: Tameru holds pumps to protect the line"))}function Qr(){N("heatBtn").classList.toggle("active",z.heat),N("heatState").textContent=z.heat?"ACTIVE":"OFF";const n=zc(z.t);N("peakBtn").classList.toggle("active",n),N("peakState").textContent=n?"ACTIVE":"READY"}let cm=0;function to(n){const t=N("toast");t.innerHTML=n,t.classList.add("on"),clearTimeout(cm),cm=setTimeout(()=>t.classList.remove("on"),3200)}function GT(){const n=N("tlBand");n&&(n.style.left=z.win[0]/1440*100+"%",n.style.width=(z.win[1]-z.win[0])/1440*100+"%",N("fcWin").textContent=`${vn(z.win[0])}–${vn(z.win[1])}`)}function WT(n){return zc(n)?"surge":n>=z.win[0]&&n<z.win[1]?"peak":n>=z.win[0]-360&&n<z.win[0]?"prefill":n>=z.win[1]&&n<z.win[1]+150?"recovery":"normal"}let Kc=0;function XT(n,t){const e=Ua(),i=e.st,s=vi.nums,r=i.req/i.cap;s.demand.set(i.req),s.util.set(r*100),s.pumps.set(i.active),s.resched.set(i.resched),s.shed.set(i.shedN),s.stored.set(i.stored),s.fill.set(i.fill*100),s.irr.set(i.irrOK),s.short.set(i.short);for(const x in s)s[x].tick(n);if(Kc+=n,Kc<.12)return;Kc=0;const o=i.shedN>0||r>1,a=N("uFill");a.style.width=Yn(r/1.3,0,1)*100+"%",a.style.background=o?"var(--red)":r>.85?"var(--amber)":"var(--green)",N("mCap").innerHTML=`of <b>${(i.cap/1e3).toFixed(2)} MW</b> capacity`;const l=N("gridPill");l.className="pill "+(o?"red":r>.85?"amber":"green"),l.textContent=o?"OVERLOAD":r>.85?"STRESSED":"STABLE",N("tShed").className="tile "+(i.shedN?"bad":""),N("tShort").className="tile "+(i.short?"bad":"good"),N("tResched").className="tile "+(z.tameru&&i.resched?"warn":"");const c=Ae.day.peakReq,h=Ee.day.peakReq,u=c>0?1-h/c:0;N("mRed").innerHTML=z.t<z.win[0]&&z.day===1&&c<ce.CAP?'<small style="margin:0">at peak</small>':c>0?`${u>0?"−":"+"}${Math.abs(u*100).toFixed(0)}<small>% · ${qn(c-h)} kW</small>`:"—",N("tRed").className="tile "+(u>.05?"good":"");const d=$r();N("cPeakA").textContent=`${qn(c)} kW`,N("cPeakB").textContent=`${qn(h)} kW`,N("cShedA").textContent=`${Ae.day.shedMin} min`,N("cShedB").textContent=`${Ee.day.shedMin} min`,N("cIntA").textContent=Ae.day.ever,N("cIntB").textContent=Ee.day.ever,N("cDryA").textContent=(Ae.day.shortFM/60).toFixed(1),N("cDryB").textContent=(Ee.day.shortFM/60).toFixed(1),N("cPkA").textContent=qn(Ae.day.peakKWh),N("cPkB").textContent=qn(Ee.day.peakKWh),N("clock").textContent=vn(z.t),N("dayLbl").textContent=`Day ${z.day} · ${z.running?z.demoRate?"demo":z.speed+"× speed":"paused"}`;const f=WT(z.t),g=N("phase");g.className="phase"+(f==="peak"||f==="surge"?" peak":""),g.textContent={peak:"PEAK HOURS",surge:"DEMAND SURGE",prefill:"PRE-PEAK",recovery:"POST-PEAK",normal:z.t<360?"NIGHT · OFF-PEAK":"OFF-PEAK"}[f],vi.scrubbing||(N("timeline").value=z.t),N("tlProg").style.width=z.t/1440*100+"%",Qr(),N("fcRisk").textContent=z.risk?`${vn(z.risk[0])}–${vn(z.risk[1])}`:"none",N("fcPeak").textContent=`${(z.fcPeak/1e3).toFixed(2)} MW · ${Math.round(z.fcPeak/d*100)}%`,N("fcConf").textContent=`CONF ${z.heat?88:94}%`;const _=z.win[0]-z.t;N("fcNext").textContent=_>0?`${Math.floor(_/60)} h ${String(_%60).padStart(2,"0")} min`:z.t<z.win[1]?"in progress":"tomorrow";const m=N("fcStrategy");let p=0;for(let x=0;x<Mt;x++)p+=z.target[x];p/=Mt,z.tameru?f==="prefill"?(m.dataset.p="prefill",m.innerHTML=`<b>PRE-PEAK FILLING</b>Tanks ${Math.round(Ee.st.fill*100)}% → target ${Math.round(p*100)}%. Staggered under a 68% load ceiling.`):f==="peak"||f==="surge"?(m.dataset.p="peak",m.innerHTML=`<b>${f==="surge"?"SURGE RESPONSE":"PEAK SHAVING"}</b>${Ee.st.resched} pumps rescheduled. ${Ee.st.emerg} farms topping up their minimum reserve.`):f==="recovery"?(m.dataset.p="recovery",m.innerHTML="<b>STAGGERED RECOVERY</b>Refilling tanks in priority order to avoid a post-peak rebound."):(m.dataset.p="prefill",m.innerHTML=`<b>MONITORING</b>${z.t<360?"Night valley filling at low tariff.":"Normal operation — next pre-fill starts "+vn(z.win[0]-360)+"."}`):(m.dataset.p="off",m.innerHTML="<b>SCHEDULING OFF</b>The forecast sees the overload coming, but pumps keep following individual schedules."),HT();const v=N("banner");if(!z.tameru)i.shedN?(v.dataset.state="red",N("bTitle").textContent="GRID OVERLOAD — LOAD SHEDDING ACTIVE",N("bSub").textContent=`Demand ${Math.round(r*100)}% of capacity · sector${i.shedN>1?"s":""} ${$n.filter((x,y)=>e.shed[y]).map(x=>x.n).join(", ")} disconnected · ${i.short} farms dry`):r>.85?(v.dataset.state="amber",N("bTitle").textContent="GRID UNDER STRESS — UNMANAGED PUMPING",N("bSub").textContent=`${i.active} pumps on · ${Math.round(r*100)}% of capacity`):(v.dataset.state="neutral",N("bTitle").textContent="WITHOUT TAMERU — UNMANAGED SCHEDULES",N("bSub").textContent=`Pumps follow individual farm schedules · ${Math.round(r*100)}% of capacity`);else if(i.shedN)v.dataset.state="red",N("bTitle").textContent="GRID OVERLOAD — LOAD SHEDDING ACTIVE",N("bSub").textContent="Non-pump load alone exceeds capacity";else{v.dataset.state=i.short?"amber":"green",N("bTitle").textContent="TAMERU ACTIVE — GRID STABLE";const x=i.short?` · ${i.short} farms below reserve`:" · irrigation uninterrupted";N("bSub").textContent=f==="peak"||f==="surge"?`Peak shaving · ${i.resched} pumps rescheduled · ${Math.round(r*100)}% of capacity${x}`:f==="prefill"?`Pre-filling tanks ahead of the ${vn(z.win[0])} peak · ${Math.round(r*100)}% of capacity`:`${Math.round(r*100)}% of capacity${x}`}N("alarm").classList.toggle("on",!!i.shedN),H.ok&&sm(!0),hn.farm>=0&&hm()}const jT={pump:["Pumping","var(--cyan)"],stored:["Irrigating from tank","var(--green)"],resched:["Pump rescheduled","var(--amber)"],emerg:["Reserve top-up","#ff7a2a"],short:["Water shortage","var(--red)"],cut:["Power cut","var(--red)"],idle:["Idle","#5b6573"]};function YT(n){hn.farm=n,H.select.visible=!0,H.hover.visible=!1,N("inspector").classList.remove("hidden"),hm(),OT(n)}function Na(){hn.farm=-1,H.ok&&(H.select.visible=!1),N("inspector").classList.add("hidden")}function hm(){const n=hn.farm,t=Ua();if(n<0)return;const e=t.level[n]/mt.cap[n],i=em(t,n),[s,r]=jT[i];N("iTitle").textContent=`Farm ${String(n+1).padStart(3,"0")}`,N("iSub").textContent=`Sector ${$n[mt.sec[n]].n} · ${z.tameru?"with":"without"} Tameru`,N("iStatus").innerHTML=`<i style="background:${r};box-shadow:0 0 8px ${r}"></i><span>${s}</span>`,N("iTank").textContent=`${t.level[n].toFixed(1)} / ${mt.cap[n]} m³ · ${Math.round(e*100)}%`;const o=N("iTankBar");o.style.width=e*100+"%",o.style.background=e<ce.RESERVE?"var(--amber)":"var(--water)",N("iTarget").style.left=z.target[n]*100+"%",N("iTarget").style.display=z.tameru?"":"none",N("iMoist").textContent=Math.round(t.moist[n]*100)+"%",N("iMoistBar").style.width=t.moist[n]*100+"%",N("iPump").textContent=t.shed[mt.sec[n]]?"No power":t.pumpOn[n]?`Running · ${mt.kw[n].toFixed(1)} kW`:t.resched[n]?"Held by Tameru":"Off";const a=mt.dem[n]*(z.heat?1.4:1);N("iIrr").textContent=t.irrig[n]?t.short[n]?"Interrupted":`${a.toFixed(1)} m³/h`:"Not scheduled",N("iTgt").textContent=z.tameru?`${Math.round(z.target[n]*100)}% by ${vn(z.win[0])}`:"—";const l=(c,h)=>c<0?"—":`<b>${vn(c)}–${vn(c+h)}</b>`;N("iSched").innerHTML=`Irrigation schedule: morning ${l(mt.mS[n],mt.mD[n])}, evening ${l(mt.eS[n],mt.eD[n])}${z.heat&&mt.hS[n]>=0?`, heat ${l(mt.hS[n],110)}`:""}.<br>Pump ${mt.kw[n].toFixed(1)} kW · ${mt.rate[n].toFixed(1)} m³/h.`}const un={active:!1,abort:!1},or=n=>new Promise((t,e)=>{const i=performance.now(),s=()=>{if(un.abort)return e("abort");if(performance.now()-i>=n)return t();requestAnimationFrame(s)};s()});function _s(n,t){const e=typeof n=="number"?()=>z.t>=n:n;return z.demoRate=t,Qn(!0),N("speedSeg").querySelectorAll("button").forEach(i=>i.classList.remove("on")),new Promise((i,s)=>z.waiters.push({fn:e,res:i,rej:s}))}function Zc(){z.waiters.length&&(z.waiters=z.waiters.filter(n=>un.abort?(n.rej("abort"),!1):n.fn()?(n.res(),!1):!0))}function Gi(n,t){N("caption").classList.remove("hidden"),N("capTag").textContent=`DEMO · ${n} / 8`,N("capText").innerHTML=t,[...N("capDots").children].forEach((e,i)=>e.classList.toggle("done",i<n))}async function um(n){N("fade").classList.add("on"),await or(600),n(),await or(250),N("fade").classList.remove("on")}async function eo(){if(!un.active){un.active=!0,un.abort=!1,document.body.classList.add("demo"),Na(),N("compare").classList.add("hidden");try{Qn(!1),await um(()=>{z.heat=!1,z.surges=[],Kr(),Qr(),bi(!1,!0),Ia(810),gs(0),Jr(0,!0)}),Gi(1,le==="ja"?"<b>ひとつの農村配電線につながる農家の地区。</b>Tameruがないと、各ポンプは電力網の状態に関係なく自分の予定どおりに動きます。":"<b>A district of farms on one rural feeder.</b> Without Tameru, every pump follows its own schedule, whatever the state of the grid."),await or(4500),Gi(2,le==="ja"?"<b>夕方：</b>家庭の需要が増え、夕方の灌漑が始まります。需要曲線が容量の線に近づきます。":"<b>Late afternoon:</b> household demand climbs and evening irrigation starts. Watch the demand curve approach the capacity line."),await _s(1020,26),await _s(()=>Ae.st.shedN>0||z.t>=1080,7);const n=Math.max(0,Ae.shed.findIndex(t=>t));Xc(n,1.8),Gi(3,le==="ja"?`<b>需要が配電線の容量を超えます。</b>電力会社が負荷を遮断し、セクター${$n[n].n}が停電します。`:`<b>Demand goes over the line’s capacity.</b> The utility sheds load: sector ${$n[n].n} loses power.`),await _s(1095,7),Gi(4,le==="ja"?"<b>ポンプが止まり、小さなタンクが空になります。</b>暑さの中で灌漑が途切れる農家が出ます。":"<b>Pumps stop and small tanks run dry.</b> Some farms lose irrigation in the heat."),await _s(1140,8),Qn(!1),await or(900),await um(()=>{bi(!0,!0),Ia(630),gs(0),Jr(0,!0)}),Gi(5,le==="ja"?"<b>同じ日、同じ農家、同じ天気。</b>今回はTameruの揚水スケジューリングが動いています。":"<b>Same day, same farms, same weather.</b> This time Tameru schedules the pumping."),await or(3200),Xc(0,2.2,!0),Gi(6,le==="ja"?"<b>Tameruは夕方のピークを予測し、</b>配電線に余裕のあるうちにタンクを満たします。":"<b>Tameru anticipates the evening peak</b> and fills the tanks earlier, while the line has room."),await _s(1010,34),gs(2),Gi(7,le==="ja"?"<b>危険な時間帯にはポンプが止まります。</b>畑はタンクから重力で灌漑を続けます。":"<b>In the risky hours, pumps pause.</b> The tanks keep irrigating the fields by gravity."),await _s(1095,8),Gi(8,le==="ja"?"<b>このアニメーションでは、配電線は容量内に収まります。</b>シミュレーション結果とその限界は、サイトの「結果」ページにあります。":"<b>In this animation the line stays under its capacity.</b> Our simulated results, with their limits, are on the Results page of the site."),await _s(1190,8),Qn(!1),await or(500),$T()}catch(n){n!=="abort"&&console.error(n)}finally{qT()}}}function Jc(){un.active&&(un.abort=!0,Zc())}function qT(){un.active=!1,un.abort=!1,z.demoRate=null,z.waiters=[],document.body.classList.remove("demo"),N("caption").classList.add("hidden"),N("fade").classList.remove("on"),Yc(z.speed)}function $T(){const n=Ae.day,t=Ee.day,e=$r(),i=n.peakReq>0?1-t.peakReq/n.peakReq:0;N("hRed").textContent=`−${(i*100).toFixed(0)}%`,N("hShed").textContent=`${Math.max(0,n.shedMin-t.shedMin)} min`,N("hFarms").textContent=`${Math.max(0,n.ever-t.ever)}`,N("cmpSub").textContent=`Results up to ${vn(z.t)} · identical farms, schedules and weather · ${z.heat?"heatwave":"normal day"}.`;const s=(o,a,l,c)=>`<div>${o}</div><div class="num a">${a}</div><div class="num b">${l}</div><div class="d">${c}</div>`,r=(o,a)=>o>0?`−${Math.round((1-a/o)*100)}%`:"—";N("cmpGrid").innerHTML='<div class="h">Metric</div><div class="h num">Without Tameru</div><div class="h num">With Tameru</div><div class="h d">Improvement</div>'+s("Peak grid demand",`${qn(n.peakReq)} kW · ${Math.round(n.peakReq/e*100)}%`,`${qn(t.peakReq)} kW · ${Math.round(t.peakReq/e*100)}%`,r(n.peakReq,t.peakReq))+s("Load-shedding blackouts",`${n.shedMin} min`,`${t.shedMin} min`,n.shedMin?r(n.shedMin,t.shedMin):"—")+s("Farms with lost irrigation",n.ever,t.ever,r(n.ever,t.ever))+s("Farm-hours without water",(n.shortFM/60).toFixed(1),(t.shortFM/60).toFixed(1),r(n.shortFM,t.shortFM))+s("Peak pump energy consumed",`${qn(n.peakKWh)} kWh`,`${qn(t.peakKWh)} kWh`,r(n.peakKWh,t.peakKWh))+s("Average tank reserve level",`${Math.round(Ae.st.fill*100)}%`,`${Math.round(Ee.st.fill*100)}%`,`+${Math.round((Ee.st.fill-Ae.st.fill)*100)} pts`),N("compare").classList.remove("hidden")}function dm(){if(!H.ok)return;const n=H.canvas,t=n.clientWidth,e=n.clientHeight;if(H.renderer.setSize(t,e,!1),H.composer&&H.composer.setSize(t,e),H.camera.aspect=t/e,window.innerWidth>980){const i=N("left").getBoundingClientRect().right,s=window.innerWidth-N("right").getBoundingClientRect().left,r=Math.round((s-i)/2*.9),o=Math.round(142/2);H.camera.setViewOffset(t,e,r,o,t,e)}else H.camera.clearViewOffset();H.camera.updateProjectionMatrix()}let ka=performance.now(),no=!0,io=null;function Ba(){no&&(no=!1,io&&(cancelAnimationFrame(io),io=null))}function za(){no||(no=!0,ka=performance.now(),io=requestAnimationFrame(Qc))}function fm(){if(Ba(),H.controls)try{H.controls.dispose()}catch{}if(H.renderer)try{H.renderer.dispose(),H.renderer.forceContextLoss()}catch{}H.ok=!1}document.addEventListener("visibilitychange",()=>{document.hidden?Ba():za()}),window.addEventListener("message",n=>{n.data&&(n.data.action==="pause"?Ba():n.data.action==="resume"?za():n.data.action==="dispose"?fm():n.data.action==="play"?(za(),Qn(!0)):n.data.action==="pauseSim"?Qn(!1):n.data.action==="demo"?eo():n.data.action==="setScenario"&&(n.data.scenario==="unmanaged"?bi(!1):n.data.scenario==="tameru"&&bi(!0)))});function Qc(n){if(!no)return;const t=Math.min(.1,(n-ka)/1e3);if(ka=n,z.running){const e=z.demoRate||z.speed*ce.MIN_PER_SEC_1X;z.acc+=t*e;let i=0;for(;z.acc>=1&&i<200;){if(Gc(),z.acc-=1,i++,z.waiters.length&&(Zc(),!z.running)){z.acc=0;break}if(un.active&&z.waiters.length===0){z.acc=0;break}}}Zc(),H.ok&&(UT(t),H.controls.update(),BT(),nm(t),sm(!1),H.composer?H.composer.render():H.renderer.render(H.scene,H.camera)),XT(t),z.dirtyChart&&Jr(n),io=requestAnimationFrame(Qc)}async function KT(){if(qr(.1,"Generating 200 agricultural plots…"),await Da(),Kr(),Kp(360),VT(),Yc(2),bi(!1,!0),TT()){qr(.3,"Building 3D instanced geometry…"),await Da();try{wT(),NT(),kT()}catch(t){console.error(t),H.ok=!1}}H.ok||(N("ldErr").style.display="block",N("ldErr").innerHTML="<b>WebGL is disabled or unavailable.</b> The simulation, dashboard and charts continue in analytical mode.",N("scene").style.display="none"),qr(.65,"Calibrating forecast engine…"),await Da(),zT(),kc(),qr(.85,"Finalizing lighting & materials…"),await Da(),H.ok&&(gs(0),dm(),window.addEventListener("resize",dm),nm(.016),H.composer?H.composer.render():H.renderer.render(H.scene,H.camera)),Jr(0,!0),qr(1,"Ready"),await new Promise(t=>setTimeout(t,H.ok?350:2600)),N("loader").classList.add("done"),Qn(!0),ka=performance.now(),requestAnimationFrame(Qc),H.ok&&(H.camera.position.set(Zr.pos.x+40,Zr.pos.y+40,Zr.pos.z+50),gs(2.6)),setTimeout(()=>to("Welcome to <b>TAMERU 蓄める</b> · Press <b>DEMO MODE</b> for guided tour or click any farm to inspect"),3e3)}window.__tameru={App:z,WA:Ae,WB:Ee,seek:Ia,runDemo:eo,setScenario:bi,setHeat:qc,triggerSurge:$c,S3:H,flyToSector:Xc,pause:Ba,resume:za,dispose:fm},KT()})();
