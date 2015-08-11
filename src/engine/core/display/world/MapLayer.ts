module engine {

    export class MapLayer extends DisplaySprite {

        public scene_id:string;
        public isReady:boolean;
        public mapData:TileMapData = new TileMapData();

        private mapdataLoader:egret.URLLoader;
        private minimapLoader:egret.URLLoader;

        private mapdataHash:Map<string, egret.ByteArray> = new Map<string, egret.ByteArray>();
        private minimapHash:Map<string, egret.Texture> = new Map<string, egret.Texture>();
        private _imgreqHash:Map<string, any> = new Map<string, any>();
        private _imgloadHash:Map<string, ProtoURLLoader> = new Map<string, ProtoURLLoader>();
        private _imgrenderHash:Map<string, egret.Bitmap> = new Map<string, egret.Bitmap>();
        private loaderQueue:Array<ProtoURLLoader> = [];

        private tar_rect:egret.Rectangle;
        private tar2_rect:egret.Rectangle;
        private stage_rect:egret.Rectangle;

        private _stageMinP:egret.Point;
        private _stageMidP:egret.Point;
        private _stageMaxP:egret.Point;
        private _mapMinP:egret.Point;
        private _mapMidP:egret.Point;
        private _mapMaxP:egret.Point;

        private bg_bmp:egret.Bitmap;

        private _general_limitIndex_:number = 4;	// 最大并发数
        private _limitIndex_:number = 15;

        private changeSceneTime:number = 0;
        private loadImageTime:number = 0;

        constructor() {
            super();

            this.bg_bmp = new egret.Bitmap();
            this.addChild(this.bg_bmp);
            this.touchEnabled = this.touchChildren = false;

            this.tar_rect = new egret.Rectangle(0, 0, EngineGlobal.IMAGE_WIDTH, EngineGlobal.IMAGE_HEIGHT);
            this.tar2_rect = new egret.Rectangle(0, 0, EngineGlobal.IMAGE_WIDTH+200, EngineGlobal.IMAGE_HEIGHT+100);
            this.stage_rect = new egret.Rectangle(0, 0, Engine.stage.stageWidth, Engine.stage.stageHeight);

            this._stageMinP = new egret.Point(0, 0);
            this._stageMidP = new egret.Point(Engine.stage.stageWidth/2, Engine.stage.stageHeight/2);
            this._stageMaxP = new egret.Point(Engine.stage.stageWidth, Engine.stage.stageHeight);

            var timer:egret.Timer = new egret.Timer(0);
            timer.addEventListener(egret.TimerEvent.TIMER, this.timeFunc, this);
            timer.start();
        }

        public changeScene(scene_id:string):void {
            if (this.scene_id != scene_id) {
                this.isReady = false;
                this.changeSceneTime = egret.getTimer();
                this.scene_id = scene_id;
                this.clean();
                this.loadMapData();
            }
        }

        private loadMapData():void {
            var path:string = EngineGlobal.getMapConfigPath(this.scene_id);
            if (this.mapdataHash.has(path)) {
                this.analyzeMapData(this.mapdataHash.get(path));
                this.loadMiniMap();
            } else {
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
        }
        private onMapDataComplete(evt:egret.Event):void {
            var bytes:egret.ByteArray = new egret.ByteArray(this.mapdataLoader.data);
            var path:string = EngineGlobal.getMapConfigPath(this.scene_id);
            this.mapdataHash.set(path, bytes);
            this.analyzeMapData(bytes);
            this.loadMiniMap();

            this.mapdataLoader.removeEventListener(egret.Event.COMPLETE, this.onMapDataComplete, this);
            this.mapdataLoader.removeEventListener(egret.IOErrorEvent.IO_ERROR, this.onMapDataError, this);
            this.mapdataLoader = null;
        }
        private onMapDataError(evt:egret.IOErrorEvent):void {
            console.error("地图数据加载失败：" + evt.target.name);
            this.loadMapData();
        }

        private analyzeMapData(bytes:egret.ByteArray):void {
            this.mapData.uncode(bytes);
            Scene.scene.setupReady();
        }

        private loadMiniMap():void {
            var path:string = EngineGlobal.getMapMiniPath(this.scene_id);
            if (this.minimapHash.has(path)) {
                this.onMiniMapComplete(null, this.minimapHash.get(path));
            } else {
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
        }
        private onMiniMapComplete(evt:egret.Event, texture:egret.Texture=null):void {
            this.isReady = true;
            if (texture) {
                this.bg_bmp.texture = texture;
            } else {
                var path:string = EngineGlobal.getMapMiniPath(this.scene_id);
                this.minimapHash.set(path, this.minimapLoader.data);
                this.bg_bmp.texture = this.minimapLoader.data;

                this.minimapLoader.removeEventListener(egret.Event.COMPLETE, this.onMiniMapComplete, this);
                this.minimapLoader.removeEventListener(egret.IOErrorEvent.IO_ERROR, this.onMiniMapError, this);
                this.minimapLoader = null;
            }
            this.bg_bmp.width = this.mapData.pixel_width;
            this.bg_bmp.height = this.mapData.pixel_height;
        }
        private onMiniMapError(evt:egret.IOErrorEvent):void {
            console.error("小地图加载失败：" + this.scene_id);
            this.loadMiniMap();
        }

        private timeFunc(evt:egret.TimerEvent):void {
            if (this.isReady == false) {
                return;
            }
            this._stageMidP.x = Engine.stage.stageWidth/2;
            this._stageMidP.y = Engine.stage.stageHeight/2;
            this._stageMaxP.x = Engine.stage.stageWidth;
            this._stageMaxP.y = Engine.stage.stageHeight;

            this._mapMinP = this.globalToLocal(this._stageMinP.x, this._stageMinP.y, this._mapMinP);
            this._mapMidP = this.globalToLocal(this._stageMidP.x, this._stageMidP.y, this._mapMidP);
            this._mapMaxP = this.globalToLocal(this._stageMaxP.x, this._stageMaxP.y, this._mapMaxP);

            this.stage_rect.setTo(this._mapMinP.x, this._mapMinP.y, Engine.stage.stageWidth, Engine.stage.stageHeight);

            this.checkNeedLoadImage();
            this.loopLoadImage();
            this.renderIntersects();
        }

        private checkNeedLoadImage():void {
            var start_x:number = this._mapMinP.x / EngineGlobal.IMAGE_WIDTH >> 0;
            var end_x:number = this._mapMaxP.x / EngineGlobal.IMAGE_WIDTH >> 0;
            var start_y:number = this._mapMinP.y / EngineGlobal.IMAGE_HEIGHT >> 0;
            var end_y:number = this._mapMaxP.y / EngineGlobal.IMAGE_HEIGHT >> 0;
            var index_x:number = start_x;
            var index_y:number;
            while (index_x <= end_x) {
                index_y = start_y;
                while (index_y <= end_y) {
                    this.addNeedLoadImage(index_x, index_y);
                    index_y++;
                }
                index_x++;
            }
        }

        private addNeedLoadImage(index_x:number, index_y:number):void {
            if (index_x < 0 || index_y < 0) {
                return;
            }
            var path:string = EngineGlobal.getMapImagePath(this.scene_id, index_x, index_y);
            if (this._imgloadHash.has(path) == true) {
                return;
            }

            this.tar_rect.x = index_x * EngineGlobal.IMAGE_WIDTH;
            this.tar_rect.y = index_y * EngineGlobal.IMAGE_HEIGHT;
            if (this.stage_rect.intersects(this.tar_rect)) {
                var key:string = index_x + Engine.LINE + index_y;
                if (this._imgreqHash.has(key) == false) {
                    this._imgreqHash.set(key, {
                        map_id:this.scene_id,
                        key:key,
                        dis:0,
                        index_x:index_x,
                        index_y:index_y
                    });
                }
            }
        }

        private loopLoadImage():void {
            if (this._imgreqHash.size == 0) {
                return;
            }
            var time:number = 20;
            if ((egret.getTimer()-this.changeSceneTime) < 8000) {
                time = 0;
            }
            if ((egret.getTimer()-this.loadImageTime) < time) {
                return;
            }
            var idx:number = 0;
            while (idx < this._general_limitIndex_) {
                if (this._imgreqHash.size && this._limitIndex_ > 0) {
                    var data:any = this.getNear();
                    this.tar2_rect.x = data.index_x * EngineGlobal.IMAGE_WIDTH - 150;
                    this.tar2_rect.y = data.index_y * EngineGlobal.IMAGE_HEIGHT - 50;
                    if (this.stage_rect.intersects(this.tar2_rect)) {
                        this._imgreqHash.delete(data.key);
                        this.loadImage(data.index_x, data.index_y);
                    }
                }
                idx++;
            }
        }

        private getNear():any {
            var tX:number = this._mapMidP.x / EngineGlobal.IMAGE_WIDTH >> 0;
            var tY:number = this._mapMidP.y / EngineGlobal.IMAGE_HEIGHT >> 0;
            var keyObj:any = null;
            this._imgreqHash.forEach(item => {
                var dX:number = item.index_x;
                var dY:number = item.index_y;
                item.dis = Math.abs(dX - tX) + Math.abs(dY - tY);
                if (keyObj == null || keyObj.dis > item.dis) {
                    keyObj = item;
                }
            });
            return keyObj;
        }

        private loadImage(index_x:number, index_y:number):void {
            var path:string = EngineGlobal.getMapImagePath(this.scene_id, index_x, index_y);
            if (this._imgloadHash.has(path) == false && this._limitIndex_ > 0) {
                var tmpLoader:ProtoURLLoader = null;
                if (this.loaderQueue.length) {
                    tmpLoader = this.loaderQueue.pop();
                } else {
                    tmpLoader = new ProtoURLLoader();
                }
                tmpLoader.name = path;
                tmpLoader.x = index_x * EngineGlobal.IMAGE_WIDTH;
                tmpLoader.y = index_y * EngineGlobal.IMAGE_HEIGHT;
                tmpLoader.dataFormat = egret.URLLoaderDataFormat.TEXTURE;
                tmpLoader.load(new egret.URLRequest(path));
                tmpLoader.addEventListener(egret.Event.COMPLETE, this.onLoadedFunc, this);
                tmpLoader.addEventListener(egret.IOErrorEvent.IO_ERROR, this.onErrorFunc, this);
                this._imgloadHash.set(path, tmpLoader);
                this._limitIndex_ --;
            }
        }

        private onLoadedFunc(evt:egret.Event):void {
            var tmpLoader:ProtoURLLoader = evt.target;
            tmpLoader.removeEventListener(egret.Event.COMPLETE, this.onLoadedFunc, this);
            tmpLoader.removeEventListener(egret.IOErrorEvent.IO_ERROR, this.onErrorFunc, this);
            if (this._limitIndex_ < this._general_limitIndex_) {
                this._limitIndex_ ++;
            }
            //console.log(tmpLoader.name + "加载成功");
        }
        private onErrorFunc(evt:egret.IOErrorEvent):void {
            var tmpLoader:ProtoURLLoader = evt.target;
            tmpLoader.removeEventListener(egret.Event.COMPLETE, this.onLoadedFunc, this);
            tmpLoader.removeEventListener(egret.IOErrorEvent.IO_ERROR, this.onErrorFunc, this);
            if (this._limitIndex_ < this._general_limitIndex_) {
                this._limitIndex_ ++;
            }
            this._imgloadHash.delete(tmpLoader.name);
            if (this._limitIndex_ < this._general_limitIndex_) {
                this._limitIndex_ ++;
            }
            console.error(tmpLoader.name + "加载失败");
        }

        private renderIntersects():void {
            if (this._imgloadHash.size == 0) {
                return;
            }
            var start_x:number = this._mapMinP.x / EngineGlobal.IMAGE_WIDTH >> 0;
            var end_x:number = this._mapMaxP.x / EngineGlobal.IMAGE_WIDTH >> 0;
            var start_y:number = this._mapMinP.y / EngineGlobal.IMAGE_HEIGHT >> 0;
            var end_y:number = this._mapMaxP.y / EngineGlobal.IMAGE_HEIGHT >> 0;
            var index_x:number = start_x;
            var index_y:number;
            while (index_x <= end_x) {
                index_y = start_y;
                while (index_y <= end_y) {
                    this.onRenderLoadedImage(index_x, index_y);
                    index_y++;
                }
                index_x++;
            }
        }

        private onRenderLoadedImage(index_x:number, index_y:number):void
        {
            var path:string = EngineGlobal.getMapImagePath(this.scene_id, index_x, index_y);
            if (this._imgrenderHash.has(path) == false) {
                this.tar_rect.x = index_x * EngineGlobal.IMAGE_WIDTH;
                this.tar_rect.y = index_y * EngineGlobal.IMAGE_HEIGHT;
                if (this.stage_rect.intersects(this.tar_rect)) {
                    if (this._imgloadHash.has(path) == true) {
                        var image:egret.Texture = null;
                        var tmpLoader:ProtoURLLoader = this._imgloadHash.get(path);
                        if (tmpLoader) {
                            image = tmpLoader.data;
                        }
                        if (image) {
                            var bmp:egret.Bitmap = new egret.Bitmap(image);
                            bmp.x = this.tar_rect.x;
                            bmp.y = this.tar_rect.y;
                            this.addChild(bmp);
                            this._imgrenderHash.set(path, bmp);
                        }
                    }
                }
            }
        }

        private clean():void {
            if (this.minimapLoader) {
                this.minimapLoader.removeEventListener(egret.Event.COMPLETE, this.onMiniMapComplete, this);
                this.minimapLoader.removeEventListener(egret.IOErrorEvent.IO_ERROR, this.onMiniMapError, this);
                this.minimapLoader = null;
            }
            this._imgloadHash.forEach(tmpLoader => {
                tmpLoader.removeEventListener(egret.Event.COMPLETE, this.onLoadedFunc, this);
                tmpLoader.removeEventListener(egret.IOErrorEvent.IO_ERROR, this.onErrorFunc, this);
                this.loaderQueue.push(tmpLoader);
            });
            this._imgrenderHash.forEach(bmp => {
                if (bmp.parent) {
                    bmp.parent.removeChild(bmp);
                }
                if (bmp.texture) {
                    bmp.texture.dispose();
                }
            });

            var stageIndexW:number = Math.ceil(Engine.stage.stageWidth / EngineGlobal.IMAGE_WIDTH);
            var stageIndexH:number = Math.ceil(Engine.stage.stageHeight / EngineGlobal.IMAGE_HEIGHT);
            this._limitIndex_ = stageIndexW * stageIndexH;
            this._limitIndex_ = this._limitIndex_ > 15 ? 15 : this._limitIndex_;
            this._limitIndex_ = this._limitIndex_ < this._general_limitIndex_ ? this._general_limitIndex_ : this._limitIndex_;

            var idx:number = this.loaderQueue.length;
            while (idx < this._limitIndex_) {
                this.loaderQueue.push(new ProtoURLLoader());
                idx++;
            }

            this._imgreqHash.clear();
            this._imgloadHash.clear();
            this._imgrenderHash.clear();
        }

    }
}