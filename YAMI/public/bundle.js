!function(e){var t={};function n(o){if(t[o])return t[o].exports;var i=t[o]={i:o,l:!1,exports:{}};return e[o].call(i.exports,i,i.exports,n),i.l=!0,i.exports}n.m=e,n.c=t,n.d=function(e,t,o){n.o(e,t)||Object.defineProperty(e,t,{configurable:!1,enumerable:!0,get:o})},n.r=function(e){Object.defineProperty(e,"__esModule",{value:!0})},n.n=function(e){var t=e&&e.__esModule?function(){return e.default}:function(){return e};return n.d(t,"a",t),t},n.o=function(e,t){return Object.prototype.hasOwnProperty.call(e,t)},n.p="",n(n.s=8)}([function(e,t){e.exports={fps:30,interpolation:0,autoIntensity:!1,bgColor:16711680,rightClickAllowed:!1,zoomSpeed:1.1,zoomInIsWheelDown:!0,stackTopIsWheelDown:!0,zoomIn:"+",zoomIn2:"i",zoomOut:"-",zoomOut2:"o",zoomHold:17,stackUp:"ArrowUp",stackDown:"ArrowDown",mouseClickProbe:1,mouseClickPan:2,mouseClickWindow:3,resetCamera:"r"}},function(e,t,n){"use strict";n.r(t),n.d(t,"default",function(){return o});class o{static uniforms(){return{uTextureBackground:{type:"t",value:[],typeGLSL:"sampler2D"},uTextureFusion:{type:"t",value:[],typeGLSL:"sampler2D"},uOpacityMin:{type:"f",value:1,typeGLSL:"float"},uOpacityMax:{type:"f",value:1,typeGLSL:"float"},uThreshold:{type:"f",value:.01,typeGLSL:"float"}}}}},function(e,t,n){"use strict";n.r(t),n.d(t,"default",function(){return o});class o{constructor(e){this._uniforms=e,this._functions={},this._main=""}functions(){""===this._main&&this.main();let e="";for(let t in this._functions)e+=this._functions[t]+"\n";return e}uniforms(){let e="";for(let t in this._uniforms){let n=this._uniforms[t];e+=`uniform ${n.typeGLSL} ${t}`,n&&n.length&&(e+=`[${n.length}]`),e+=";\n"}return e}main(){this._main="\nvoid main(void) {\n\n  vec2 texc = vec2(((vProjectedCoords.x / vProjectedCoords.w) + 1.0 ) / 2.0,\n                ((vProjectedCoords.y / vProjectedCoords.w) + 1.0 ) / 2.0 );\n\n  // just silence warning for\n  // vec4 dummy = vPos;\n\n  //The back position is the world space position stored in the texture.\n  vec4 baseColorBG = texture2D(uTextureBackground, texc);\n  vec4 baseColorFusion = texture2D(uTextureFusion, texc);\n\n  if(baseColorFusion.w < uThreshold){\n    gl_FragColor = baseColorBG;\n  }else{\n    gl_FragColor = mix( baseColorBG, baseColorFusion, uOpacityMin+uOpacityMax*baseColorFusion.w);\n  }\n  return;\n}\n   "}compute(){return`\n// uniforms\n${this.uniforms()}\n\n// varying (should fetch it from vertex directly)\n// varying vec4      vPos;\nvarying vec4      vProjectedCoords;\n\n// tailored functions\n${this.functions()}\n\n// main loop\n${this._main}\n      `}}},function(e,t,n){"use strict";n.r(t),n.d(t,"default",function(){return a});const o=n(2),i=n(1),r=n(0);class a{constructor(e){let t=[0,0,0,0,0,0];this.worldBB=t;let n,a,s,l,u=e,c=[],d=[],h=[],m=[],f=[],p=[],g=[],w=[];function v(){!function(){for(let e=0;e<h.length;e++)h[e].geometry.dispose(),h[e].geometry=n.slice.geometry,h[e].geometry.verticesNeedUpdate=!0}(),function(){for(let e=0;e<w.length;e++)p[e].remove(w[e]),w[e].material.dispose(),w[e].geometry.dispose(),w[e]=new THREE.Mesh(n.slice.geometry,g[e]),w[e].applyMatrix(n.stack._ijk2LPS),p[e].add(w[e])}()}function E(e){for(let n=0;n<t.length;n++)n%2==0?e[n]<t[n]&&(t[n]=e[n]):e[n]>t[n]&&(t[n]=e[n])}a=new THREE.Scene,(s=new AMI.LutHelper("my-lut-canvases","default","linear",[[0,0,0,0],[0,1,1,1]],[[0,1],[1,1]])).luts=AMI.LutHelper.presetLuts(),s.lut="default",(l=new THREE.WebGLRenderTarget(u.clientWidth,u.clientHeight,{minFilter:THREE.NearestFilter,magFilter:THREE.NearestFilter,format:THREE.RGBAFormat})).setSize(u.clientWidth,u.clientHeight),this.resize=function(){for(let e=0;e<f.length;e++)f[e].setSize(u.clientWidth,u.clientHeight);l.setSize(u.clientWidth,u.clientHeight)},this.render=function(e,t){v(),e.render(a,t,l,!0);for(let n=0;n<c.length-1;n++)e.render(c[n],t,f[n],!0),e.render(p[n],t,f[n],!0);e.render(c[c.length-1],t,f[f.length-1],!0),e.render(p[c.length-1],t)},this.setMainStackHelper=function(e){(n=e).slice.intensityAuto=r.autoIntensity,n.slice.interpolation=r.interpolation,n.slice.lut=s,n.slice.lutTexture=s.texture,a.add(n),E(n._stack.worldBoundingBox())},this.addLayer=function(e){let t=new THREE.Scene;c.push(t);let a=new AMI.LutHelper("my-lut-canvases","default","linear",[[0,0,0,0],[1,1,1,1]],[[0,0],[1,1]]);a.luts=AMI.LutHelper.presetLuts(),d.push(a),a.lut="blue";let s=new THREE.WebGLRenderTarget(u.clientWidth,u.clientHeight,{minFilter:THREE.NearestFilter,magFilter:THREE.NearestFilter,format:THREE.RGBAFormat});s.setSize(u.clientWidth,u.clientHeight),f.push(s),e.prepare(),e.pack();let x=[];for(let t=0;t<e._rawData.length;t++){let n=new THREE.DataTexture(e.rawData[t],e.textureSize,e.textureSize,e.textureType,THREE.UnsignedByteType,THREE.UVMapping,THREE.ClampToEdgeWrapping,THREE.ClampToEdgeWrapping,THREE.NearestFilter,THREE.NearestFilter);n.needsUpdate=!0,n.flipY=!0,x.push(n)}let y=AMI.DataUniformShader.uniforms();y.uTextureSize.value=e.textureSize,y.uTextureContainer.value=x,y.uWorldToData.value=e.lps2IJK,y.uNumberOfChannels.value=e.numberOfChannels,y.uBitsAllocated.value=e.bitsAllocated,y.uPackedPerPixel.value=e.packedPerPixel,y.uWindowCenterWidth.value=[e.windowCenter,e.windowWidth],y.uRescaleSlopeIntercept.value=[e.rescaleSlope,e.rescaleIntercept],y.uDataDimensions.value=[e.dimensionsIJK.x,e.dimensionsIJK.y,e.dimensionsIJK.z],y.uInterpolation.value=r.interpolation,y.uLowerUpperThreshold.value=[...e.minMax],y.uLut.value=1,y.uTextureLUT.value=a.texture;let T=new AMI.DataFragmentShader(y),C=new AMI.DataVertexShader,H=new THREE.ShaderMaterial({side:THREE.FrontSide,uniforms:y,vertexShader:C.compute(),fragmentShader:T.compute()}),L=new THREE.Mesh(n.slice.geometry,H);h.push(L),L.applyMatrix(n.stack._ijk2LPS);let R=n._stack.worldCenter().clone();R.sub(e.worldCenter()),m.push(R),L.translateX(R.x),L.translateY(R.y),L.translateZ(R.z),t.add(L),E(e.worldBoundingBox()),function(e){p.push(new THREE.Scene);let t=i.default.uniforms(),r=f.length-1;0===r?(t.uTextureBackground.value=l.texture,t.uTextureFusion.value=f[r].texture):(t.uTextureBackground.value=f[r-1].texture,t.uTextureFusion.value=f[r].texture);t.uOpacityMin.value=.1,t.uOpacityMax.value=.8,t.uThreshold.value=.01;let a=new o.default(t),s=new AMI.LayerVertexShader,u=new THREE.ShaderMaterial({side:THREE.FrontSide,uniforms:t,vertexShader:s.compute(),fragmentShader:a.compute(),transparent:!0});g.push(u);let c=new THREE.Mesh(n.slice.geometry,u);w.push(c),c.applyMatrix(n.stack._ijk2LPS),p[p.length-1].add(c),v()}()}}}},function(e,t,n){"use strict";n.r(t),n.d(t,"default",function(){return i});const o=n(0);class i extends THREE.EventDispatcher{constructor(e,t,n,i){super();let r=this,a=i,s={NONE:0,SETPROB:1,PAN:2,WINDOW:3},l=new Map,u=(s.NONE,new THREE.Vector2),c=new THREE.Vector2,d=new THREE.Vector3,h=new THREE.Vector3;function m(e){switch(e.key){case o.zoomIn:case o.zoomIn2:r.zoom(!0);break;case o.zoomOut:case o.zoomOut2:r.zoom(!1);break;case o.resetCamera:r.reset()}}function f(e){switch(l.set(e.keyCode,!0),e.key){case"Escape":r._state=s.NONE;break;case o.stackUp:r.scrollStack(!0);break;case o.stackDown:r.scrollStack(!1)}}function p(e){l.set(e.keyCode,!1)}function g(e){switch(e.which){case o.mouseClickProbe:r._state=s.SETPROB;break;case o.mouseClickPan:r._state=s.PAN;break;case o.mouseClickWindow:r._state=s.WINDOW}u.x=e.clientX,u.y=e.clientY,document.addEventListener("mousemove",v,!1),e.preventDefault()}function w(e){r._state=s.NONE,document.removeEventListener("mousemove",v,!1)}function v(e){switch(c.x=e.clientX,c.y=e.clientY,r._state){case s.PAN:r.pan(u,c);break;case s.SETPROB:case s.WINDOW:}u=c,c=new THREE.Vector2}function E(e){var t;t=o.zoomHold,l.has(t)&&l.get(t)?(r.zoom(e.deltaY>0===o.zoomInIsWheelDown),e.preventDefault()):(r.scrollStack(e.deltaY>0===o.stackTopIsWheelDown),e.preventDefault())}function x(e){o.rightClickAllowed||e.preventDefault()}this.camera=e,this.stack=t,this.domElement=void 0!==n?n:document,this.target=new THREE.Vector3,this.noZoom=!1,this.noPan=!1,this.noRotate=!0,this.handleResize=function(){},this.update=function(){r._changed&&r.camera.updateProjectionMatrix(),this.camera.lookAt(this.target)},this.setAsResetState=function(){},this.reset=function(){a.hasChanged=!0},this.pan=function(e,t){if(d.subVectors(r.camera.position,r.target),this.noPan)return;let o=t.x-e.x,i=t.y-e.y;o/=n.offsetWidth,i/=n.offsetHeight,o*=(r.camera.right-r.camera.left)/r.camera.zoom,i*=(r.camera.top-r.camera.bottom)/r.camera.zoom;let s=new THREE.Vector3;s.copy(r.camera.up).setLength(i),s.add(h.copy(d).cross(r.camera.up).setLength(o)),r.camera.position.add(s),r.target.add(s),r._changed=!0,a.hasChanged=!0},this.zoom=function(e){if(this.noZoom)return;let t=e?1/o.zoomSpeed:o.zoomSpeed;Math.abs(t-1)>1e-6&&t>0&&(this.camera.zoom/=t,a.hasChanged=!0)},this.scrollStack=function(e){if(e){if(t.index>=t.orientationMaxIndex-1)return!1;t.index+=1}else{if(t.index<=0)return!1;t.index-=1}a.hasChanged=!0},this.dispose=function(){document.removeEventListener("mousedown",g,!1),document.removeEventListener("mouseup",w,!1),document.removeEventListener("wheel",E,!1),document.removeEventListener("contextmenu",x,!1),document.removeEventListener("keypress",m,!1),document.removeEventListener("keyup",p,!1),document.removeEventListener("keydown",f,!1)},document.addEventListener("mousedown",g,!1),document.addEventListener("mouseup",w,!1),document.addEventListener("wheel",E,!1),document.addEventListener("contextmenu",x,!1),document.addEventListener("keypress",m,!1),document.addEventListener("keyup",p,!1),document.addEventListener("keydown",f,!1),this.camera.position.z=1,this.handleResize(),this.update(),this.setAsResetState()}}},function(e,t){e.exports=function(){function e(e,t){"CR"!==t&&"DX"!==t&&(document.getElementById("top").innerHTML=e[0],document.getElementById("bottom").innerHTML=e[1],document.getElementById("right").innerHTML=e[2],document.getElementById("left").innerHTML=e[3])}return{buildGUI:function(t,n){let o=t._stack,i=new dat.GUI({autoPlace:!1}),r={invertRows:!1,invertColumns:!1,rotate:!1,orientation:"default",convention:"radio"};document.getElementById("my-gui-container").appendChild(i.domElement);let a=i.addFolder("Stack");a.add(t.slice,"windowWidth",1,o.minMax[1]-o.minMax[0]).step(1).listen(),a.add(t.slice,"windowCenter",o.minMax[0],o.minMax[1]).step(1).listen(),a.add(t.slice,"invert"),lut=new AMI.LutHelper("my-lut-canvases","default","linear",[[0,0,0,0],[1,1,1,1]],[[0,1],[1,1]]),lut.luts=AMI.LutHelper.presetLuts(),a.add(t.slice,"lut",lut.lutsAvailable()).onChange(function(e){lut.lut=e,t.slice.lutTexture=lut.texture}),a.add(lut,"discrete",!1).onChange(function(e){lut.discrete=e,t.slice.lutTexture=lut.texture});let s=a.add(t,"index",0,o.dimensionsIJK.z-1).step(1).listen();a.open();let l=i.addFolder("Camera");l.add(r,"invertRows").onChange(function(){n.invertRows(),e(n.directionsLabel,o.modality)}),l.add(r,"invertColumns").onChange(function(){n.invertColumns(),e(n.directionsLabel,o.modality)}),l.add(n,"angle",0,360).step(1).listen().onChange(function(){e(n.directionsLabel,o.modality)}),l.add(r,"rotate").onChange(function(){n.rotate(),e(n.directionsLabel,o.modality)}),l.add(r,"orientation",["default","axial","coronal","sagittal"]).onChange(function(i){n.orientation=i,n.update(),n.fitBox(2),t.orientation=n.stackOrientation,e(n.directionsLabel,o.modality),s.__max=t.orientationMaxIndex,t.index=Math.floor(s.__max/2)}),l.add(r,"convention",["radio","neuro"]).onChange(function(t){n.convention=t,n.update(),n.fitBox(2),e(n.directionsLabel,o.modality)})},updateLabels:e}}()},function(e,t){e.exports=function(){let e,t,n,o,i,r;function a(){n=Date.now(),(i=n-o)>e&&(o=n-i%e,r()),requestAnimationFrame(a)}return{startAnimating:function(n,i){r=i,imgHasChanged=!0,e=1e3/n,o=Date.now(),t=o,a()}}}()},function(e,t){e.exports=function(){function e(e,t){return t.extension.toUpperCase()===e.toUpperCase()}function t(e){return new Promise((t,n)=>{const o=new XMLHttpRequest;o.responseType="blob",o.onload=(()=>{"200"==o.status?t(o.response):n(o.statusText)}),o.onerror=(()=>n(o.statusText)),o.open("GET",e),o.send()})}return{readMultipleFiles:function(n,o){let i,r={},a={};var s;function l(o,i,a){return new Promise((s,l)=>{Promise.resolve().then(e=>{if(void 0!==o[a])return console.log(a+" : Files request..."),function(e,n,o){return new Promise((i,r)=>{e[o]||r("No category with this name ("+o+") in json.");let a=Promise.resolve(),s=[];for(let n=0;n<e[o].length;n++)a=a.then(i=>t("/datafiles/"+e.study+"/"+e[o][n])).then(t=>{e[o][n].split("/").pop(),s.push(new File([t],e[o][n].split("/").pop()))});a=a.then(e=>{n[o]=s,i()})})}(o,i,a)}).then(t=>{if(void 0!==o[a])return console.log(a+" : Files loading..."),function(t,o){return new Promise((i,a)=>{const s=[],l=[],c={};let d;for(let n=0;n<t[o].length;n++){let i=AMI.UtilsCore.parseUrl(t[o][n].name);e("mhd",i)?(c.header=t[o][n],d=!0):e("raw",i)?c.data=t[o][n]:l.push(t[o][n])}if(void 0!==d)void 0===c.header||void 0===c.data?a("Data seems to be 'header (mhd) + data (raw)' but data can't be found !"):s.push(function(e,t){const o=[];for(let t in e)o.push(new Promise((n,o)=>{const i=new FileReader;i.onload=(e=>{n(e.target.result)}),i.readAsArrayBuffer(e[t])}).then(function(n){return{url:e[t].name,buffer:n}}));return Promise.all(o).then(e=>n.parse(e)).then(function(e){r[t]=[],r[t].push(e)}).catch(function(e){window.console.log("oops... something went wrong while parsing the sequence..."),window.console.log(e)})}(c,o));else for(let e=0;e<l.length;e++)s.push(u(e,l,o));Promise.all(s).then(function(){i(r)}).catch(function(e){window.console.log(e),a("oops... something went wrong while using the sequence...")})})}(i,a)}).then(e=>{s()})})}function u(e,t,o){return Promise.resolve().then(function(){return new Promise(function(n,o){const i=new FileReader;i.addEventListener("load",function(e){n(e.target.result)}),i.readAsArrayBuffer(t[e])})}).then(function(o){return n.parse({url:t[e].name,buffer:o})}).then(function(e){r[o]=[],r[o].push(e)}).catch(function(e){window.console.log("Oops... something went wrong while loading the sequence..."),window.console.log(e)})}Promise.resolve().then(e=>{console.log("Json request...");const t="/"+function(){let e=[],t=window.location.search.substring(1).split("&");for(let n=0,o=t.length;n<o;n++){if(""===t[n])continue;let o=t[n].split("=");"viewer"===decodeURIComponent(o[0])&&(e[decodeURIComponent(o[0])]=decodeURIComponent(o[1]||""))}return e}().viewer;return s=t,new Promise((e,t)=>{const n=new XMLHttpRequest;n.overrideMimeType("application/json"),n.onload=(()=>{"200"==n.status?e(n.responseText):t(n.statusText)}),n.onerror=(()=>t(n.statusText)),n.open("GET",s),n.send()})}).then(e=>{i=JSON.parse(e)}).then(e=>l(i,a,"image")).then(e=>l(i,a,"fusion")).then(e=>{console.log("Files loaded."),o(r)}).catch(e=>{console.log("An error has occured:"),console.log(e)})}}}()},function(e,t,n){const o=n(0),i=n(7),r=n(6),a=(n(5),n(4)),s=n(3);let l,u,c,d,h,m,f,p={hasChanged:!0};window.onload=function(){u=document.getElementById("r3d"),(l=new THREE.WebGLRenderer({antialias:1==o.interpolation})).setSize(u.offsetWidth,u.offsetHeight),l.setClearColor(o.bgColor,1),l.setPixelRatio(window.devicePixelRatio),u.appendChild(l.domElement),c=new Stats,u.appendChild(c.domElement),d=new s.default(u),m=new AMI.OrthographicCamera(u.clientWidth/-2,u.clientWidth/2,u.clientHeight/2,u.clientHeight/-2,.1,1e4);let e=new AMI.VolumeLoader(u);i.readMultipleFiles(e,function(t){e.free(),e=null;let n=t.image[0].mergeSeries(t.image)[0].stack[0],i=t.fusion[0].mergeSeries(t.fusion)[0].stack[0];(h=new AMI.StackHelper(n)).bbox.visible=!1,h.border.visible=!1,d.setMainStackHelper(h),d.addLayer(i,h),f=new a.default(m,h,u,p),m.controls=f;let s=d.worldBB,g=new THREE.Vector3((s[1]-s[0])/2,(s[3]-s[2])/2,(s[5]-s[4])/2),w={center:n.worldCenter().clone(),halfDimensions:new THREE.Vector3(g.x+100,g.y+100,g.z+100)},v={width:u.clientWidth,height:u.clientHeight};m.directions=[n.xCosine,n.yCosine,n.zCosine],m.box=w,m.canvas=v,m.update(),m.fitBox(2),function(){function e(){m.canvas={width:u.offsetWidth,height:u.offsetHeight},l.setSize(u.offsetWidth,u.offsetHeight),d.resize()}r.startAnimating(o.fps,function(){f.update(),p.hasChanged&&(d.render(l,m),p.hasChanged=!1),c.update()}),window.addEventListener("resize",e,!1),e()}()})}}]);