var engine;
(function (engine) {
    var Scene = (function (_super) {
        __extends(Scene, _super);
        function Scene() {
            _super.call(this);
            this.currP = new egret.Point();
            Scene.scene = this;
            this.init();
        }
        var __egretProto__ = Scene.prototype;
        __egretProto__.setup = function (container) {
            this.container = container;
            this.container.addChildAt(this, 0);
            this.container.addChildAt(this.mapLayer, 0);
            this.stage.addEventListener(egret.TouchEvent.TOUCH_BEGIN, this._EngineMouseDownFunc_, this);
            this.stage.addEventListener(egret.TouchEvent.TOUCH_END, this._EngineMouseUpFunc_, this);
            var timer = new egret.Timer(0);
            timer.addEventListener(egret.TimerEvent.TIMER, this.enterFrameFunc, this);
            timer.start();
        };
        __egretProto__.setupReady = function () {
            this.isReady = true;
            this.mapData = this.mapLayer.mapData;
        };
        __egretProto__.changeScene = function (scene_id) {
            this.changing = true;
            this.isReady = false;
            this.mapLayer.changeScene(scene_id);
        };
        __egretProto__.sceneMoveTo = function (px, py) {
            this.focusP = this.getCameraFocusTo(px, py, this.focusP);
            this.currP.setTo(this.x, this.y);
            this.sceneMove(this.currP, this.focusP);
        };
        __egretProto__.addItem = function (item, layer) {
            item.layer = layer;
            //            var dis:egret.DisplayObject = <egret.DisplayObject>item;
            //            switch (layer) {
            //                case SceneConst.TOP_LAYER:
            //                    this.topLayer.addChild(dis);
            //                    break;
            //                case SceneConst.ITEM_LAYER:
            //                    this.itemLayer.addChild(dis);
            //                    break;
            //                case SceneConst.MIDDLE_LAYER:
            //                    this.middleLayer.addChild(dis);
            //                    break;
            //                case SceneConst.BOTTOM_LAYER:
            //                    this.bottomLayer.addChild(dis);
            //                    break;
            //            }
        };
        __egretProto__.removeItem = function (item) {
        };
        __egretProto__.takeItem = function (char_id) {
            return null;
        };
        __egretProto__.dispose = function () {
            _super.prototype.dispose.call(this);
        };
        __egretProto__.init = function () {
            this.touchEnabled = this.touchChildren = false;
            this.topLayer = new egret.Sprite();
            this.topLayer.touchEnabled = this.topLayer.touchChildren = false;
            this.topLayer.name = engine.SceneConst.TOP_LAYER;
            this.middleLayer = new egret.Sprite();
            this.middleLayer.touchEnabled = this.middleLayer.touchChildren = false;
            this.middleLayer.name = engine.SceneConst.MIDDLE_LAYER;
            this.bottomLayer = new egret.Sprite();
            this.bottomLayer.touchEnabled = this.bottomLayer.touchChildren = false;
            this.bottomLayer.name = engine.SceneConst.BOTTOM_LAYER;
            this.itemLayer = new egret.Sprite();
            this.itemLayer.touchEnabled = this.itemLayer.touchChildren = false;
            this.itemLayer.name = engine.SceneConst.ITEM_LAYER;
            this.addChild(this.bottomLayer);
            this.addChild(this.itemLayer);
            this.addChild(this.middleLayer);
            this.addChild(this.topLayer);
            this.mapLayer = new engine.MapLayer();
        };
        __egretProto__._EngineMouseDownFunc_ = function (evt) {
        };
        __egretProto__._EngineMouseUpFunc_ = function (evt) {
        };
        __egretProto__.enterFrameFunc = function (evt) {
        };
        __egretProto__.getCameraFocusTo = function (px, py, valueP) {
            var fx;
            var fy;
            var stageW = engine.Engine.stage.stageWidth;
            var stageH = engine.Engine.stage.stageHeight;
            var mapW = 4000;
            var mapH = 4000;
            if (this.mapData && this.mapData.pixel_width > 0 && this.mapData.pixel_height > 0) {
                mapW = this.mapData.pixel_width;
                mapH = this.mapData.pixel_height;
            }
            var centerX = stageW / 2;
            var centerY = stageH / 2;
            if ((px >= centerX) && (px <= mapW - centerX)) {
                fx = centerX - px;
            }
            else {
                if (px <= centerX) {
                    fx = 0;
                }
                else {
                    fx = stageW - mapW;
                }
            }
            if ((py >= centerY) && (py <= mapH - centerY)) {
                fy = centerY - py;
            }
            else {
                if (py <= centerY) {
                    fy = 0;
                }
                else {
                    fy = stageH - mapH;
                }
            }
            if (valueP) {
                valueP.x = fx;
                valueP.y = fy;
                return valueP;
            }
            else {
                return new egret.Point(fx, fy);
            }
        };
        __egretProto__.sceneMove = function (pt_from, pt_to) {
            var dis = egret.Point.distance(pt_from, pt_to);
            if (dis > 0) {
                this.x = this.mapLayer.x = pt_to.x >> 0;
                this.y = this.mapLayer.y = pt_to.y >> 0;
            }
        };
        return Scene;
    })(engine.DisplaySprite);
    engine.Scene = Scene;
    Scene.prototype.__class__ = "engine.Scene";
})(engine || (engine = {}));
//# sourceMappingURL=Scene.js.map