var engine;
(function (engine) {
    var MapLayer = (function (_super) {
        __extends(MapLayer, _super);
        function MapLayer() {
            _super.call(this);
            this.mapData = new engine.TileMapData();
            this.mapdataHash = new Map();
            this.minimapHash = new Map();
            this._imgreqHash = new Map();
            this._imgloadHash = new Map();
            this._imgrenderHash = new Map();
            this.loaderQueue = [];
            this._general_limitIndex_ = 4; // 最大并发数
            this._limitIndex_ = 15;
            this.changeSceneTime = 0;
            this.loadImageTime = 0;
            this.bg_bmp = new egret.Bitmap();
            this.addChild(this.bg_bmp);
            this.touchEnabled = this.touchChildren = false;
            this.tar_rect = new egret.Rectangle(0, 0, engine.EngineGlobal.IMAGE_WIDTH, engine.EngineGlobal.IMAGE_HEIGHT);
            this.tar2_rect = new egret.Rectangle(0, 0, engine.EngineGlobal.IMAGE_WIDTH + 200, engine.EngineGlobal.IMAGE_HEIGHT + 100);
            this.stage_rect = new egret.Rectangle(0, 0, engine.Engine.stage.stageWidth, engine.Engine.stage.stageHeight);
            this._stageMinP = new egret.Point(0, 0);
            this._stageMidP = new egret.Point(engine.Engine.stage.stageWidth / 2, engine.Engine.stage.stageHeight / 2);
            this._stageMaxP = new egret.Point(engine.Engine.stage.stageWidth, engine.Engine.stage.stageHeight);
            var timer = new egret.Timer(0);
            timer.addEventListener(egret.TimerEvent.TIMER, this.timeFunc, this);
            timer.start();
        }
        var __egretProto__ = MapLayer.prototype;
        __egretProto__.changeScene = function (scene_id) {
            if (this.scene_id != scene_id) {
                this.isReady = false;
                this.changeSceneTime = egret.getTimer();
                this.scene_id = scene_id;
                this.clean();
                this.loadMapData();
            }
        };
        __egretProto__.loadMapData = function () {
            var path = engine.EngineGlobal.getMapConfigPath(this.scene_id);
            if (this.mapdataHash.has(path)) {
                this.analyzeMapData(this.mapdataHash.get(path));
                this.loadMiniMap();
            }
            else {
                if (this.mapdataLoader) {
                    this.mapdataLoader.removeEventListener(egret.Event.COMPLETE, this.onMapDataComplete, this);
                    this.mapdataLoader.removeEventListener(egret.IOErrorEvent.IO_ERROR, this.onMapDataError, this);
                }
                this.mapdataLoader = new egret.URLLoader();
                this.mapdataLoader.dataFormat = egret.URLLoaderDataFormat.BINARY;
                this.mapdataLoader.addEventListener(egret.Event.COMPLETE, this.onMapDataComplete, this);
                this.mapdataLoader.addEventListener(egret.IOErrorEvent.IO_ERROR, this.onMapDataError, this);
                this.mapdataLoader.load(new egret.URLRequest(path));
            }
        };
        __egretProto__.onMapDataComplete = function (evt) {
            var bytes = new egret.ByteArray(this.mapdataLoader.data);
            var path = engine.EngineGlobal.getMapConfigPath(this.scene_id);
            this.mapdataHash.set(path, bytes);
            this.analyzeMapData(bytes);
            this.loadMiniMap();
            this.mapdataLoader.removeEventListener(egret.Event.COMPLETE, this.onMapDataComplete, this);
            this.mapdataLoader.removeEventListener(egret.IOErrorEvent.IO_ERROR, this.onMapDataError, this);
            this.mapdataLoader = null;
        };
        __egretProto__.onMapDataError = function (evt) {
            console.error("地图数据加载失败：" + evt.target.name);
            this.loadMapData();
        };
        __egretProto__.analyzeMapData = function (bytes) {
            this.mapData.uncode(bytes);
            engine.Scene.scene.setupReady();
        };
        __egretProto__.loadMiniMap = function () {
            var path = engine.EngineGlobal.getMapMiniPath(this.scene_id);
            if (this.minimapHash.has(path)) {
                this.onMiniMapComplete(null, this.minimapHash.get(path));
            }
            else {
                if (this.minimapLoader) {
                    this.minimapLoader.removeEventListener(egret.Event.COMPLETE, this.onMiniMapComplete, this);
                    this.minimapLoader.removeEventListener(egret.IOErrorEvent.IO_ERROR, this.onMiniMapError, this);
                }
                this.minimapLoader = new egret.URLLoader();
                this.minimapLoader.dataFormat = egret.URLLoaderDataFormat.TEXTURE;
                this.minimapLoader.addEventListener(egret.Event.COMPLETE, this.onMiniMapComplete, this);
                this.minimapLoader.addEventListener(egret.IOErrorEvent.IO_ERROR, this.onMiniMapError, this);
                this.minimapLoader.load(new egret.URLRequest(path));
            }
        };
        __egretProto__.onMiniMapComplete = function (evt, texture) {
            if (texture === void 0) { texture = null; }
            this.isReady = true;
            if (texture) {
                this.bg_bmp.texture = texture;
            }
            else {
                var path = engine.EngineGlobal.getMapMiniPath(this.scene_id);
                this.minimapHash.set(path, this.minimapLoader.data);
                this.bg_bmp.texture = this.minimapLoader.data;
                this.minimapLoader.removeEventListener(egret.Event.COMPLETE, this.onMiniMapComplete, this);
                this.minimapLoader.removeEventListener(egret.IOErrorEvent.IO_ERROR, this.onMiniMapError, this);
                this.minimapLoader = null;
            }
            this.bg_bmp.width = this.mapData.pixel_width;
            this.bg_bmp.height = this.mapData.pixel_height;
        };
        __egretProto__.onMiniMapError = function (evt) {
            console.error("小地图加载失败：" + this.scene_id);
            //this.loadMiniMap();
        };
        __egretProto__.timeFunc = function (evt) {
            if (this.isReady == false) {
                return;
            }
            this._stageMidP.x = engine.Engine.stage.stageWidth / 2;
            this._stageMidP.y = engine.Engine.stage.stageHeight / 2;
            this._stageMaxP.x = engine.Engine.stage.stageWidth;
            this._stageMaxP.y = engine.Engine.stage.stageHeight;
            this._mapMinP = this.globalToLocal(this._stageMinP.x, this._stageMinP.y, this._mapMinP);
            this._mapMidP = this.globalToLocal(this._stageMidP.x, this._stageMidP.y, this._mapMidP);
            this._mapMaxP = this.globalToLocal(this._stageMaxP.x, this._stageMaxP.y, this._mapMaxP);
            this.stage_rect.setTo(this._mapMinP.x, this._mapMinP.y, engine.Engine.stage.stageWidth, engine.Engine.stage.stageHeight);
            this.checkNeedLoadImage();
            this.loopLoadImage();
            this.renderIntersects();
        };
        __egretProto__.checkNeedLoadImage = function () {
            var start_x = this._mapMinP.x / engine.EngineGlobal.IMAGE_WIDTH >> 0;
            var end_x = this._mapMaxP.x / engine.EngineGlobal.IMAGE_WIDTH >> 0;
            var start_y = this._mapMinP.y / engine.EngineGlobal.IMAGE_HEIGHT >> 0;
            var end_y = this._mapMaxP.y / engine.EngineGlobal.IMAGE_HEIGHT >> 0;
            var index_x = start_x;
            var index_y;
            while (index_x <= end_x) {
                index_y = start_y;
                while (index_y <= end_y) {
                    this.addNeedLoadImage(index_x, index_y);
                    index_y++;
                }
                index_x++;
            }
        };
        __egretProto__.addNeedLoadImage = function (index_x, index_y) {
            if (index_x < 0 || index_y < 0) {
                return;
            }
            var path = engine.EngineGlobal.getMapImagePath(this.scene_id, index_x, index_y);
            if (this._imgloadHash.has(path) == true) {
                return;
            }
            this.tar_rect.x = index_x * engine.EngineGlobal.IMAGE_WIDTH;
            this.tar_rect.y = index_y * engine.EngineGlobal.IMAGE_HEIGHT;
            if (this.stage_rect.intersects(this.tar_rect)) {
                var key = index_x + engine.Engine.LINE + index_y;
                if (this._imgreqHash.has(key) == false) {
                    this._imgreqHash.set(key, {
                        map_id: this.scene_id,
                        key: key,
                        dis: 0,
                        index_x: index_x,
                        index_y: index_y
                    });
                }
            }
        };
        __egretProto__.loopLoadImage = function () {
            if (this._imgreqHash.size == 0) {
                return;
            }
            var time = 20;
            if ((egret.getTimer() - this.changeSceneTime) < 8000) {
                time = 0;
            }
            if ((egret.getTimer() - this.loadImageTime) < time) {
                return;
            }
            var idx = 0;
            while (idx < this._general_limitIndex_) {
                if (this._imgreqHash.size && this._limitIndex_ > 0) {
                    var data = this.getNear();
                    this.tar2_rect.x = data.index_x * engine.EngineGlobal.IMAGE_WIDTH - 150;
                    this.tar2_rect.y = data.index_y * engine.EngineGlobal.IMAGE_HEIGHT - 50;
                    if (this.stage_rect.intersects(this.tar2_rect)) {
                        this._imgreqHash.delete(data.key);
                        this.loadImage(data.index_x, data.index_y);
                    }
                }
                idx++;
            }
        };
        __egretProto__.getNear = function () {
            var tX = this._mapMidP.x / engine.EngineGlobal.IMAGE_WIDTH >> 0;
            var tY = this._mapMidP.y / engine.EngineGlobal.IMAGE_HEIGHT >> 0;
            var keyObj = null;
            this._imgreqHash.forEach(function (item) {
                var dX = item.index_x;
                var dY = item.index_y;
                item.dis = Math.abs(dX - tX) + Math.abs(dY - tY);
                if (keyObj == null || keyObj.dis > item.dis) {
                    keyObj = item;
                }
            });
            return keyObj;
        };
        __egretProto__.loadImage = function (index_x, index_y) {
            var path = engine.EngineGlobal.getMapImagePath(this.scene_id, index_x, index_y);
            if (this._imgloadHash.has(path) == false && this._limitIndex_ > 0) {
                var tmpLoader = null;
                if (this.loaderQueue.length) {
                    tmpLoader = this.loaderQueue.pop();
                }
                else {
                    tmpLoader = new engine.ProtoURLLoader();
                }
                tmpLoader.name = path;
                tmpLoader.x = index_x * engine.EngineGlobal.IMAGE_WIDTH;
                tmpLoader.y = index_y * engine.EngineGlobal.IMAGE_HEIGHT;
                tmpLoader.dataFormat = egret.URLLoaderDataFormat.TEXTURE;
                tmpLoader.load(new egret.URLRequest(path));
                tmpLoader.addEventListener(egret.Event.COMPLETE, this.onLoadedFunc, this);
                tmpLoader.addEventListener(egret.IOErrorEvent.IO_ERROR, this.onErrorFunc, this);
                this._imgloadHash.set(path, tmpLoader);
                this._limitIndex_--;
            }
        };
        __egretProto__.onLoadedFunc = function (evt) {
            var tmpLoader = evt.target;
            tmpLoader.removeEventListener(egret.Event.COMPLETE, this.onLoadedFunc, this);
            tmpLoader.removeEventListener(egret.IOErrorEvent.IO_ERROR, this.onErrorFunc, this);
            if (this._limitIndex_ < this._general_limitIndex_) {
                this._limitIndex_++;
            }
            console.log(tmpLoader.name + "加载成功");
        };
        __egretProto__.onErrorFunc = function (evt) {
            var tmpLoader = evt.target;
            tmpLoader.removeEventListener(egret.Event.COMPLETE, this.onLoadedFunc, this);
            tmpLoader.removeEventListener(egret.IOErrorEvent.IO_ERROR, this.onErrorFunc, this);
            if (this._limitIndex_ < this._general_limitIndex_) {
                this._limitIndex_++;
            }
            this._imgloadHash.delete(tmpLoader.name);
            if (this._limitIndex_ < this._general_limitIndex_) {
                this._limitIndex_++;
            }
            console.error(tmpLoader.name + "加载失败");
        };
        __egretProto__.renderIntersects = function () {
            if (this._imgloadHash.size == 0) {
                return;
            }
            var start_x = this._mapMinP.x / engine.EngineGlobal.IMAGE_WIDTH >> 0;
            var end_x = this._mapMaxP.x / engine.EngineGlobal.IMAGE_WIDTH >> 0;
            var start_y = this._mapMinP.y / engine.EngineGlobal.IMAGE_HEIGHT >> 0;
            var end_y = this._mapMaxP.y / engine.EngineGlobal.IMAGE_HEIGHT >> 0;
            var index_x = start_x;
            var index_y;
            while (index_x <= end_x) {
                index_y = start_y;
                while (index_y <= end_y) {
                    this.onRenderLoadedImage(index_x, index_y);
                    index_y++;
                }
                index_x++;
            }
        };
        __egretProto__.onRenderLoadedImage = function (index_x, index_y) {
            var path = engine.EngineGlobal.getMapImagePath(this.scene_id, index_x, index_y);
            if (this._imgrenderHash.has(path) == false) {
                this.tar_rect.x = index_x * engine.EngineGlobal.IMAGE_WIDTH;
                this.tar_rect.y = index_y * engine.EngineGlobal.IMAGE_HEIGHT;
                if (this.stage_rect.intersects(this.tar_rect)) {
                    if (this._imgloadHash.has(path) == true) {
                        var image = null;
                        var tmpLoader = this._imgloadHash.get(path);
                        if (tmpLoader) {
                            image = tmpLoader.data;
                        }
                        if (image) {
                            var bmp = new egret.Bitmap(image);
                            bmp.x = this.tar_rect.x;
                            bmp.y = this.tar_rect.y;
                            this.addChild(bmp);
                            this._imgrenderHash.set(path, bmp);
                        }
                    }
                }
            }
        };
        __egretProto__.clean = function () {
            var _this = this;
            if (this.minimapLoader) {
                this.minimapLoader.removeEventListener(egret.Event.COMPLETE, this.onMiniMapComplete, this);
                this.minimapLoader.removeEventListener(egret.IOErrorEvent.IO_ERROR, this.onMiniMapError, this);
                this.minimapLoader = null;
            }
            this._imgloadHash.forEach(function (tmpLoader) {
                tmpLoader.removeEventListener(egret.Event.COMPLETE, _this.onLoadedFunc, _this);
                tmpLoader.removeEventListener(egret.IOErrorEvent.IO_ERROR, _this.onErrorFunc, _this);
                _this.loaderQueue.push(tmpLoader);
            });
            this._imgrenderHash.forEach(function (bmp) {
                if (bmp.parent) {
                    bmp.parent.removeChild(bmp);
                }
                if (bmp.texture) {
                    bmp.texture.dispose();
                }
            });
            var stageIndexW = Math.ceil(engine.Engine.stage.stageWidth / engine.EngineGlobal.IMAGE_WIDTH);
            var stageIndexH = Math.ceil(engine.Engine.stage.stageHeight / engine.EngineGlobal.IMAGE_HEIGHT);
            this._limitIndex_ = stageIndexW * stageIndexH;
            this._limitIndex_ = this._limitIndex_ > 15 ? 15 : this._limitIndex_;
            this._limitIndex_ = this._limitIndex_ < this._general_limitIndex_ ? this._general_limitIndex_ : this._limitIndex_;
            var idx = this.loaderQueue.length;
            while (idx < this._limitIndex_) {
                this.loaderQueue.push(new engine.ProtoURLLoader());
                idx++;
            }
            this._imgreqHash.clear();
            this._imgloadHash.clear();
            this._imgrenderHash.clear();
        };
        return MapLayer;
    })(engine.DisplaySprite);
    engine.MapLayer = MapLayer;
    MapLayer.prototype.__class__ = "engine.MapLayer";
})(engine || (engine = {}));
//# sourceMappingURL=MapLayer.js.map