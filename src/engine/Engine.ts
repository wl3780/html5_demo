module engine {

    export class Engine {
        public static SIGN:string = "@";
        public static LINE:string = "_";
        public static WEALTH_ALONE_SIGN:string = "【WQA】";
        public static WEALTH_GROUP_SIGN:string = "【WQG】";
        public static stage:egret.Stage;

        public static SWF_Files:Array<string> = ["swf","tmp"];
        public static IMG_Files:Array<string> = ["png","jpg","jpeg","gif","jxr"];
        public static TEXT_Files:Array<string> = ["json","text","css","xml","html"];

        public static char_shadow:egret.Texture = null;

        public static enabled:boolean = true;
        public static compress:boolean = true;
        public static sceneClickEnabled:boolean = true;

        private static instance_index:number = 2147483647;
        private static pointRecoverList:Array<egret.Point> = [];
        private static rectRecoverList:Array<egret.Rectangle> = [];

        public static setup(target:egret.DisplayObjectContainer, moduleClass:any, netClass:any, path:string, lang:string="zh_CN", ver:string="v1.0"):void {
            Engine.stage = target.stage;
            EngineGlobal.assetsHost = path;
            EngineGlobal.language = lang;
            EngineGlobal.version = ver;
            FPSUtils.setup(target.stage);
            ModuleDock.setup(moduleClass, netClass);
        }

        public static getSoleId():string {
            Engine.instance_index--;
            if (Engine.instance_index < 0) {
                Engine.instance_index = 2147483647;
            }
            return Engine.instance_index.toString(16);
        }

        public static getPoint(x:number=0, y:number=0):egret.Point {
            if (Engine.pointRecoverList.length) {
                var p:egret.Point = Engine.pointRecoverList.pop();
                p.setTo(x, y);
                return p;
            }
            return new egret.Point(x, y);
        }
        public static putPoint(p:egret.Point) {
            Engine.pointRecoverList.push(p);
        }

        public static getRectangle(x:number=0, y:number=0, width:number=0, height:number=0):egret.Rectangle {
            if (Engine.rectRecoverList.length) {
                var rect:egret.Rectangle = Engine.rectRecoverList.pop();
                rect.setTo(x, y, width, height);
                return rect;
            }
            return new egret.Rectangle(x, y, width, height);
        }
        public static putRectangle(rect:egret.Rectangle) {
            Engine.rectRecoverList.push(rect);
        }
    }
}