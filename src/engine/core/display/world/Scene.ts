module engine {
    export class Scene extends DisplaySprite implements IScene {

        public static scene:Scene;
        public static isDepthChange:boolean;

        public changing:boolean;
        public isReady:boolean;

        public topLayer:egret.Sprite;
        public middleLayer:egret.Sprite;
        public bottomLayer:egret.Sprite;
        public itemLayer:egret.Sprite;
        public mapLayer:MapLayer;

        public mapData:TileMapData;
        public nodeTree:NodeTree;
        public mainChar:MainChar;

        public mouseDownPoint:egret.Point;
        public stageIntersectsHash:Map<string, egret.DisplayObject>;

        private container:egret.DisplayObjectContainer;
        private focusP:egret.Point;
        private currP:egret.Point = new egret.Point();
        private _depthTime:number = 0;

        constructor() {
            super();
            Scene.scene = this;
            this.mouseDownPoint = new egret.Point();
            this.stageIntersectsHash = new Map<string, egret.DisplayObject>();
            this.init();
        }

        public setup(container:egret.DisplayObjectContainer) {
            this.container = container;
            this.container.addChildAt(this, 0);
            this.container.addChildAt(this.mapLayer, 0);

            this.stage.addEventListener(egret.TouchEvent.TOUCH_BEGIN, this._EngineMouseDownFunc_, this);
            this.stage.addEventListener(egret.TouchEvent.TOUCH_END, this._EngineMouseUpFunc_, this);

            var timer:egret.Timer = new egret.Timer(0);
            timer.addEventListener(egret.TimerEvent.TIMER, this.enterFrameFunc, this);
            timer.start();
        }

        public setupReady() {
            this.isReady = true;
            this.mapData = this.mapLayer.mapData;
        }

        public changeScene(scene_id:string) {
            this.changing = true;
            this.isReady = false;
            this.mapLayer.changeScene(scene_id);
        }

        public sceneMoveTo(px:number, py:number) {
            this.focusP = this.getCameraFocusTo(px, py, this.focusP);
            this.currP.setTo(this.x, this.y);
            this.sceneMove(this.currP, this.focusP);
        }

        public addItem(item:ISceneItem, layer:string) {
            item.layer = layer;
            switch (layer) {
                case SceneConst.TOP_LAYER:
                    this.topLayer.addChild(item.content);
                    break;
                case SceneConst.ITEM_LAYER:
                    this.itemLayer.addChild(item.content);
                    break;
                case SceneConst.MIDDLE_LAYER:
                    this.middleLayer.addChild(item.content);
                    break;
                case SceneConst.BOTTOM_LAYER:
                    this.bottomLayer.addChild(item.content);
                    break;
            }
        }

        public removeItem(item:ISceneItem) {

        }

        public takeItem(char_id:string):ISceneItem {
            return null;
        }

        public dispose() {
            super.dispose();
        }

        private init() {
            this.touchEnabled = this.touchChildren = false;

            this.nodeTree = new engine.NodeTree(SceneConst.SCENE_ITEM_NODER);
            this.nodeTree.build(new egret.Rectangle(0, 0, 15000, 15000), 80);

            this.topLayer = new egret.Sprite();
            this.topLayer.touchEnabled = this.topLayer.touchChildren = false;
            this.topLayer.name = SceneConst.TOP_LAYER;

            this.middleLayer = new egret.Sprite();
            this.middleLayer.touchEnabled = this.middleLayer.touchChildren = false;
            this.middleLayer.name = SceneConst.MIDDLE_LAYER;

            this.bottomLayer = new egret.Sprite();
            this.bottomLayer.touchEnabled = this.bottomLayer.touchChildren = false;
            this.bottomLayer.name = SceneConst.BOTTOM_LAYER;

            this.itemLayer = new egret.Sprite();
            this.itemLayer.touchEnabled = this.itemLayer.touchChildren = false;
            this.itemLayer.name = SceneConst.ITEM_LAYER;

            this.addChild(this.bottomLayer);
            this.addChild(this.itemLayer);
            this.addChild(this.middleLayer);
            this.addChild(this.topLayer);

            this.mapLayer = new MapLayer();

            this.mainChar = new MainChar();
            this.addItem(this.mainChar, SceneConst.MIDDLE_LAYER);
        }

        protected _EngineMouseDownFunc_(evt:egret.TouchEvent) {

        }

        protected _EngineMouseUpFunc_(evt:egret.TouchEvent) {

        }

        protected enterFrameFunc(evt:egret.TimerEvent) {
            if (this.isReady) {
                this.globalToLocal(0, 0, EngineGlobal.stagePoint);
                EngineGlobal.stageRect.x = EngineGlobal.stagePoint.x;
                EngineGlobal.stageRect.y = EngineGlobal.stagePoint.y;
                EngineGlobal.stageRect.width = Engine.stage.stageWidth;
                EngineGlobal.stageRect.height = Engine.stage.stageHeight;
                
                this.mainChar.loopMove();
                this.sceneMoveTo(this.mainChar.x, this.mainChar.y);

                this.charQueueMove();
                this.autoDepth();
            }
        }

        protected getCameraFocusTo(px:number, py:number, valueP:egret.Point):egret.Point {
            var fx:number;
            var fy:number;
            var stageW:number = Engine.stage.stageWidth;
            var stageH:number = Engine.stage.stageHeight;
            var mapW:number = 4000;
            var mapH:number = 4000;
            if (this.mapData && this.mapData.pixel_width > 0 && this.mapData.pixel_height > 0) {
                mapW = this.mapData.pixel_width;
                mapH = this.mapData.pixel_height;
            }
            var centerX:number = stageW / 2;
            var centerY:number = stageH / 2;
            if ((px>=centerX) && (px<=mapW-centerX)) {	// 地图之间
                fx = centerX - px;
            } else {	//　地图两端
                if (px <= centerX) {
                    fx = 0;
                } else {
                    fx = stageW - mapW;
                }
            }
            if ((py>=centerY) && (py <= mapH-centerY)) {	// 地图之间
                fy = centerY - py;
            } else {	//　地图两端
                if (py <= centerY) {
                    fy = 0;
                } else {
                    fy = stageH - mapH;
                }
            }
            if (valueP) {
                valueP.x = fx;
                valueP.y = fy;
                return valueP;
            } else {
                return new egret.Point(fx, fy);
            }
        }

        protected sceneMove(pt_from:egret.Point, pt_to:egret.Point) {
            var dis:Number = egret.Point.distance(pt_from, pt_to);
            if (dis > 0) {
                this.x = this.mapLayer.x = pt_to.x >> 0;
                this.y = this.mapLayer.y = pt_to.y >> 0;
            }
        }

        protected charQueueMove() {
            var display:any;
            var idx:number = this.middleLayer.numChildren - 1;
            while (idx >= 0) {
                display = this.middleLayer.getChildAt(idx);
                if (display != this.mainChar && display.loopMove != undefined) {
                    (<IInteractiveObject>display).loopMove();
                }
                idx--;
            }
        }

        protected autoDepth() {
            if (this.isReady == false || Scene.isDepthChange == false) {
                return;
            }
            var needTime:number = 300;
            if (egret.getTimer()-this._depthTime < needTime) {
                return;
            }
            Scene.isDepthChange = false
            this._depthTime = egret.getTimer();

            var idx:number = 0;
            var len:number = this.middleLayer.numChildren;
            var display:any;
            var list:Array<egret.DisplayObject> = [];
            while (idx < len) {
                display = this.middleLayer.getChildAt(idx);
                if (display.stageIntersects != undefined && (<ISceneItem>display).stageIntersects) {
                    list.push(display);
                }
                idx++;
            }
            list.sort((a, b) => {
                if (a.y < b.y) {
                    return -1;
                }
                return 1;
            });
            idx = 0;
            len = list.length;
            while (idx < len) {
                display = list[idx];
                if (idx < this.middleLayer.numChildren) {
                    this.middleLayer.addChildAt(display, idx);
                } else {
                    this.middleLayer.addChild(display);
                }
                idx++;
            }
        }

    }
}