module engine {
    export class Scene extends DisplaySprite implements IScene {

        public static scene:Scene;

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

        private container:egret.DisplayObjectContainer;
        private focusP:egret.Point;
        private currP:egret.Point = new egret.Point();

        constructor() {
            super();
            Scene.scene = this;
            this.mouseDownPoint = new egret.Point();
            this.init();
        }

        public setup(container:egret.DisplayObjectContainer):void {
            this.container = container;
            this.container.addChildAt(this, 0);
            this.container.addChildAt(this.mapLayer, 0);

            this.stage.addEventListener(egret.TouchEvent.TOUCH_BEGIN, this._EngineMouseDownFunc_, this);
            this.stage.addEventListener(egret.TouchEvent.TOUCH_END, this._EngineMouseUpFunc_, this);

            var timer:egret.Timer = new egret.Timer(0);
            timer.addEventListener(egret.TimerEvent.TIMER, this.enterFrameFunc, this);
            timer.start();
        }

        public setupReady():void {
            this.isReady = true;
            this.mapData = this.mapLayer.mapData;
//            this.mainChar.x = -this.mapData.pixel_x;
//            this.mainChar.y = -this.mapData.pixel_y;
        }

        public changeScene(scene_id:string):void {
            this.changing = true;
            this.isReady = false;
            this.mapLayer.changeScene(scene_id);
        }

        public sceneMoveTo(px:number, py:number):void {
            this.focusP = this.getCameraFocusTo(px, py, this.focusP);
            this.currP.setTo(this.x, this.y);
            this.sceneMove(this.currP, this.focusP);
        }

        public addItem(item:ISceneItem, layer:string):void {
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

        public removeItem(item:ISceneItem):void {

        }

        public takeItem(char_id:string):ISceneItem {
            return null;
        }

        public dispose():void {
            super.dispose();
        }

        private init():void {
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

        protected _EngineMouseDownFunc_(evt:egret.TouchEvent):void {

        }

        protected _EngineMouseUpFunc_(evt:egret.TouchEvent):void {

        }

        protected enterFrameFunc(evt:egret.TimerEvent):void {
            if (this.isReady) {
                this.mainChar.loopMove();
                this.sceneMoveTo(this.mainChar.x, this.mainChar.y);
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

        protected sceneMove(pt_from:egret.Point, pt_to:egret.Point):void {
            var dis:Number = egret.Point.distance(pt_from, pt_to);
            if (dis > 0) {
                this.x = this.mapLayer.x = pt_to.x >> 0;
                this.y = this.mapLayer.y = pt_to.y >> 0;
            }
        }

    }
}