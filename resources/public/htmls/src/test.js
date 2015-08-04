/**
 * Created by Administrator on 2015/8/3.
 */
(function (factory) {
    // Packaging/modules magic dance
    var L;
    if (typeof define === 'function' && define.amd) {
        // AMD
        define(['leaflet'], factory);
    } else if (typeof module !== 'undefined') {
        // Node/CommonJS
        L = require('leaflet');
        module.exports = factory(L);
    } else {
        // Browser globals
        if (typeof window.L === 'undefined') {
            throw new Error('Leaflet must be loaded first');
        }
        factory(window.L);
    }
}(function (L) {
    'use strict';
    L.Control.Zoomslider = (function () {
        var Knob = L.Draggable.extend({
            initialize: function (element, stepHeight, knobHeight) {
                L.Draggable.prototype.initialize.call(this, element, element);
                this._element = element;
                this._stepHeight = stepHeight;
                this._knobHeight = knobHeight;
                this.on('predrag', function () {
                    this._newPos.x = 0;
                    this._newPos.y = this._adjust(this._newPos.y);
                }, this);
            },

            _adjust: function (y) {
                var value = Math.round(this._toValue(y));
                value = Math.max(2, Math.min(this._maxValue, value));
                return this._toY(value);
            },

            // y = k*v + m
            _toY: function (value) {
                return this._k * value + this._m;
            },
            // v = (y - m) / k
            _toValue: function (y) {
                return (y - this._m) / this._k;
            },

            setSteps: function (steps) {
                var sliderHeight = steps * this._stepHeight;											//滑块滑动的距离
                this._maxValue = steps - 1;

                // conversion parameters
                // the conversion is just a common linear function.
                this._k = -this._stepHeight;
                this._m = sliderHeight - (this._stepHeight + this._knobHeight) / 2;
            },

            setPosition: function (y) {
                L.DomUtil.setPosition(this._element,
                    L.point(0,this._adjust(y) ));//
            },

            setValue: function (v) {
                this.setPosition(this._toY(v));
            },

            getValue: function () {
                return this._toValue(L.DomUtil.getPosition(this._element).y);
            }
        });

        var Zoomslider = L.Control.extend({																	//创建滑动轮
            options: {
                position: 'topleft',
                // Height of zoom-slider.png in px
                stepHeight: 7,
                // Height of the knob div in px (including border)
                knobHeight: 6,
                styleNS: 'leaflet-control-zoomslider'
            },

            onAdd: function (map) {
                this._map = map;
                this._ui = this._createUI();
                this._knob = new Knob(this._ui.knob,
                    this.options.stepHeight,
                    this.options.knobHeight);
                this._topyuan=new Knob(this._ui.Topyuan);
                this._leftyuan=new Knob(this._ui.Leftyuan);
                this._rightyuan=new Knob(this._ui.Rightyuan);
                this._bottomyuan=new Knob(this._ui.Bottomyuan);
                this._gray=new Knob(this._ui.grey);
                this._zL=new Knob(this._ui.zL);
                this._zS=new Knob(this._ui.zS);
                this._body=new Knob(this._ui.body);
                this._jie=new Knob(this._ui.jie);
                this._shi=new Knob(this._ui.shi);
                this._sheng=new Knob(this._ui.sheng);
                this._guo=new Knob(this._ui.guo);
                this._gray._element.style.height='36px';
                map.whenReady(this._initKnob,        this)
                    .whenReady(this._initEvents,      this)
                    .whenReady(this._updateSize,      this)
                    .whenReady(this._updateKnobValue, this)
                    .whenReady(this._updateDisabled,  this);
                return this._ui.bar;
            },

            onRemove: function (map) {
                map.off('zoomlevelschange',         this._updateSize,      this)
                    .off('zoomend zoomlevelschange', this._updateKnobValue, this)
                    .off('zoomend zoomlevelschange', this._updateDisabled,  this);
            },

            _createUI: function () {
                var ui = {},
                    ns = this.options.styleNS;
                ui.bar     = L.DomUtil.create('div', ns + ' leaflet-bar');
                ui.zL  =  L.DomUtil.create('div',ns+'-L');
                ui.wrap    = L.DomUtil.create('div', ns + '-wrap leaflet-bar-part', ui.bar);
                ui.zS =  L.DomUtil.create('div',ns+'-S');
                ui.body    = L.DomUtil.create('div', ns + '-body', ui.wrap);
                ui.knob    = L.DomUtil.create('div', ns + '-knob');
                ui.yuan    = L.DomUtil.create('div', ns + '-yuan');
                ui.Leftyuan    = L.DomUtil.create('div', ns + '-Leftyuan');
                ui.Rightyuan    = L.DomUtil.create('div', ns + '-Rightyuan');
                ui.Topyuan    = L.DomUtil.create('div', ns + '-Topyuan');
                ui.Bottomyuan    = L.DomUtil.create('div', ns + '-Bottomyuan');
                ui.grey= L.DomUtil.create('div',ns+'-grey');
                ui.jie= L.DomUtil.create('div',ns+'-jie');
                ui.shi= L.DomUtil.create('div',ns+'-shi');
                ui.sheng= L.DomUtil.create('div',ns+'-sheng');
                ui.guo= L.DomUtil.create('div',ns+'-guo');
                L.DomEvent.disableClickPropagation(ui.bar);
                L.DomEvent.disableClickPropagation(ui.knob);
                return ui;
            },

            _initKnob: function () {
                this._knob.enable();
                this._ui.body.appendChild(this._ui.knob);
                this._ui.body.appendChild(this._ui.yuan);
                this._ui.body.appendChild(this._ui.yuan).appendChild(this._ui.Leftyuan);
                this._ui.body.appendChild(this._ui.yuan).appendChild(this._ui.Rightyuan);
                this._ui.body.appendChild(this._ui.yuan).appendChild(this._ui.Topyuan);
                this._ui.body.appendChild(this._ui.yuan).appendChild(this._ui.Bottomyuan);
                this._ui.body.appendChild(this._ui.grey);
                this._ui.body.appendChild(this._ui.zL);
                this._ui.body.appendChild(this._ui.zS);
                this._ui.body.appendChild(this._ui.grey);
                this._ui.body.appendChild(this._ui.jie);
                this._ui.body.appendChild(this._ui.shi);
                this._ui.body.appendChild(this._ui.sheng);
                this._ui.body.appendChild(this._ui.guo);
            },
            _initEvents: function () {
                this._map
                    .on('zoomlevelschange',         this._updateSize,      this)
                    .on('zoomend zoomlevelschange', this._updateKnobValue, this)
                    .on('zoomend zoomlevelschange', this._updateDisabled,  this)
                /*.on('click',this._zuobiao,this);*/
                /*	L.DomEvent.on(this._ui.body,    'click', this._onSliderClick, this);*/
                this._knob.on('dragend', this._updateMapZoom, this);
                L.DomEvent.on(this._ui.Topyuan,'click',this._toppanto,this);
                L.DomEvent.on(this._ui.Leftyuan,'click',this._leftpanto,this);
                L.DomEvent.on(this._ui.Rightyuan,'click',this._rightpanto,this);
                L.DomEvent.on(this._ui.Bottomyuan,'click',this._bottompanto,this);
                L.DomEvent.on(this._ui.knob,'mousedown',this._distence,this);
                L.DomEvent.on(this._ui.Topyuan,'mouseover',this._topshow,this);
                L.DomEvent.on(this._ui.Topyuan,'mouseout',this._tophide,this);
                L.DomEvent.on(this._ui.Leftyuan,'mouseover',this._leftshow,this);
                L.DomEvent.on(this._ui.Leftyuan,'mouseout',this._lefthide,this);
                L.DomEvent.on(this._ui.Rightyuan,'mouseover',this._rightshow,this);
                L.DomEvent.on(this._ui.Rightyuan,'mouseout',this._righthide,this);
                L.DomEvent.on(this._ui.Bottomyuan,'mouseover',this._bottomshow,this);
                L.DomEvent.on(this._ui.Bottomyuan,'mouseout',this._bottomhide,this);
               /* this._zL._element.addEventListener('click',this._zoomIn,this);*/
                L.DomEvent.on(this._ui.zL,    'click',this._zoomIn , this);
                L.DomEvent.on(this._ui.zS,'click',this._zoomOut,this);
                L.DomEvent.on(this._ui.body,'mouseover',this._showpic,this);
                //L.DomEvent.on(this._ui.body,'mouseout',this._hidepic,this);
                L.DomEvent.on(this._ui.jie,'click',this._jieheight,this);
                L.DomEvent.on(this._ui.shi,'click',this._shiheight,this);
                L.DomEvent.on(this._ui.sheng,'click',this._shengheight,this);
                L.DomEvent.on(this._ui.guo,'click',this._guoheight,this);
                L.DomEvent.on(this._ui.body,'click',this._clickHeight,this);
                L.DomEvent.on(this._ui.knob,'mouseover',this._showWhite,this);
                L.DomEvent.on(this._ui.knob,'mouseout',this._hideWhite,this);
                L.DomEvent.on(this._ui.zL,'mouseover',this._showZl,this);
                L.DomEvent.on(this._ui.zL,'mouseout',this._hideZl,this);
                L.DomEvent.on(this._ui.zS,'mouseover',this._showZs,this);
                L.DomEvent.on(this._ui.zS,'mouseout',this._hideZs,this);
            },

            _onSliderClick: function (e) {
                var first = (e.touches && e.touches.length === 1 ? e.touches[0] : e),
                    y = L.DomEvent.getMousePosition(first, this._ui.body).y;
                this._knob.setPosition(y);
                this._updateMapZoom();																						//滑轮滚动
            },
            _zoomIn: function (e) {
                this._map.zoomIn(e.shiftKey ? 3 : 1);
                var ss = (this._knob.getValue() * (-7) + 126.5);
                this._gray._element.style.height = ss + 'px';
                this._knob.setPosition(ss);
            },
            _zoomOut: function (e) {
                var num=this._knob.getValue();
                if(num>2){
                    this._map.zoomOut(e.shiftKey ? 3 : 1);
                    var ss = (this._knob.getValue() * (-7) + 126.5);
                    this._gray._element.style.height = ss + 'px';
                    this._knob.setPosition(ss);
                }
            },

            _zoomLevels: function () {
                var zoomLevels = this._map.getMaxZoom() - this._map.getMinZoom() + 1;
                return zoomLevels < Infinity ? zoomLevels : 0;
            },
            _toZoomLevel: function (value) {
                return value + this._map.getMinZoom();
            },
            _toValue: function (zoomLevel) {
                return zoomLevel - this._map.getMinZoom();
            },

            _updateSize: function () {
                var steps = this._zoomLevels();
                this._ui.body.style.height = this.options.stepHeight * steps + 'px';
                this._knob.setSteps(steps);

            },
            _updateMapZoom: function () {
                this._map.setZoom(this._toZoomLevel(this._knob.getValue()));
            },

            _updateyuanMapZoom: function () {
                this._map.setZoom(this._toZoomLevel(this._topyuan.getValue()));
            },
            _updateKnobValue: function () {
                this._knob.setValue(this._toValue(this._map.getZoom()));
                var distence = (this._knob.getValue() * (-7) + 126.5);
                this._gray._element.style.height = distence + 'px';
            },
            _updateDisabled: function () {
                var zoomLevel = this._map.getZoom(),
                    className = this.options.styleNS + '-disabled';
                L.DomUtil.removeClass(this._ui.zL,  className);
                L.DomUtil.removeClass(this._ui.zS, className);

                if (zoomLevel === this._map.getMinZoom()) {
                    L.DomUtil.addClass(this._ui.zS, className);
                }
                if (zoomLevel === this._map.getMaxZoom()) {
                    L.DomUtil.addClass(this._ui.zL, className);
                }
            },

            _toppanto:function(){
                var center=map.getCenter();
                this.center=center;
                this.x=center.lat;//经度
                this.y=center.lng//纬度
                map.panTo([this.x+0.003,this.y])
            },
            _bottompanto:function(){
                var center=map.getCenter();
                this.center=center;
                this.x=center.lat;//经度
                this.y=center.lng//纬度
                map.panTo([this.x-0.003,this.y])
            },
            _leftpanto:function(e){
                var center=map.getCenter();
                this.center=center;
                this.x=center.lat;//经度
                this.y=center.lng//纬度
                map.panTo([this.x,this.y-0.003])
            },
            _rightpanto:function(e){
                var center=map.getCenter();
                this.center=center;
                this.x=center.lat;//经度
                this.y=center.lng//纬度
                map.panTo([this.x,this.y+0.003])
            },
            _distence:function(){
                L.DomEvent.on(this._ui.knob,'mousemove',this._maindisy,this);
            },
            _maindisy:function(event){
                var distence=(this._knob.getValue() * (-7) + 126.5)
                this._gray._element.style.height=distence+'px';
                L.DomEvent.on( this._ui.knob,'mouseup',this._nothing,this);
            },
            _nothing:function(){
                L.DomEvent.on(this._ui.knob,'mousemove',this._maindisy,this);
            },
            _topshow:function(){
                this._topyuan._element.style.background='url("../img/mapNav2.png") -9px -52px no-repeat';
            },
            _tophide:function(){
                this._topyuan._element.style.background='';
            },
            _leftshow:function(){
                this._leftyuan._element.style.background='url("../img/mapNav2.png") -1px -219px no-repeat';
            },
            _lefthide:function(){
                this._leftyuan._element.style.background='';
            },
            _rightshow:function(){
                this._rightyuan._element.style.background='url("../img/mapNav2.png") -32px -112px no-repeat';
            },
            _righthide:function(){
                this._rightyuan._element.style.background='';
            },
            _bottomshow:function(){
                this._bottomyuan._element.style.background='url("../img/mapNav2.png") -8px -190px no-repeat';
            },
            _bottomhide:function(){
                this._bottomyuan._element.style.background='';
            },
            _showpic:function(){
                this._jie._element.style.display='block';
                this._sheng._element.style.display='block';
                this._shi._element.style.display='block';
                this._guo._element.style.display='block';
            },
            _hidepic:function(){
                this._jie._element.style.display='none';
                this._sheng._element.style.display='none';
                this._shi._element.style.display='none';
                this._guo._element.style.display='none';
            },
            _jieheight:function(){
                this._knob.setPosition(13);
                var ss = (this._knob.getValue() * (-7) + 126.5);
                this._gray._element.style.height=ss+'px';
                this._map.setZoom(this._toZoomLevel(this._knob.getValue()));

            },
            _shiheight:function(){
                this._knob.setPosition(33);
                var ss = (this._knob.getValue() * (-7) + 126.5);
                this._gray._element.style.height=ss+'px';
                this._map.setZoom(this._toZoomLevel(this._knob.getValue()));
            },
            _shengheight:function(){
                this._knob.setPosition(67);
                var ss = (this._knob.getValue() * (-7) + 126.5);
                this._gray._element.style.height=ss+'px';
                this._map.setZoom(this._toZoomLevel(this._knob.getValue()));
            },
            _guoheight:function(){
                this._knob.setPosition(105);
                var ss = (this._knob.getValue() * (-7) + 126.5);
                this._gray._element.style.height=ss+'px';
                this._map.setZoom(this._toZoomLevel(this._knob.getValue()));
            },
            _clickHeight:function(e){
                var mm= e.clientY;
                var min=18* (-7) + 126.5;
                var max=0.5*(-7)+126.5;
                if((mm-120)<max&&(mm-120)>min){
                    this._knob.setPosition(mm-120);
                    var distence3=(this._knob.getValue() * (-7) + 126.5)
                    this._gray._element.style.height=distence3+'px';
                    this._map.setZoom(this._toZoomLevel(this._knob.getValue()));
                }
            },
            _showWhite:function(){
                this._knob._element.style.background='url("../img/mapNav2.png") -57px -88px no-repeat';
            },
            _hideWhite:function(){
                this._knob._element.style.background='url("../img/mapNav2.png") -57px -76px no-repeat';
            },
            _showZl:function(){
                this._zL._element.style.background='url("../img/mapNav2.png") -22px -267px no-repeat';
            },
            _hideZl:function(){
                this._zL._element.style.background='url("../img/mapNav2.png") 0px -267px no-repeat';
            },
            _showZs:function(){
                this._zS._element.style.background='url("../img/mapNav2.png") -22px -290px no-repeat';
            },
            _hideZs:function(){
                this._zS._element.style.background='url("../img/mapNav2.png") 0px -290px no-repeat';
            }
        });

        return Zoomslider;
    })();
    L.Map.addInitHook(function () {
        if (this.options.zoomsliderControl) {
            this.zoomsliderControl = new L.Control.Zoomslider();
            this.addControl(this.zoomsliderControl);
        }
    });

    L.control.zoomslider = function (options) {
        return new L.Control.Zoomslider(options);
    };
}));
