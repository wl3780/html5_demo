module engine {

    export class Engine {
        public static SIGN:string = "@";
        public static LINE:string = "_";
        public static stage:egret.Stage;

        public static enabled:boolean = true;
        public static compress:boolean = true;
        public static sceneClickEnabled:boolean = true;

        private static instance_index:number = 2147483647;

        public static setup(target:egret.DisplayObjectContainer, path:string, lang:string="zh_CN", ver:string="v1.0"):void {
            Engine.stage = target.stage;
            EngineGlobal.assetsHost = path;
            EngineGlobal.language = lang;
            EngineGlobal.version = ver;
        }

        public static getSoleId():string {
            Engine.instance_index--;
            if (Engine.instance_index < 0) {
                Engine.instance_index = 2147483647;
            }
            return Engine.instance_index.toString(16);
        }

        public static getPoint():egret.Point {
            return new egret.Point();
        }

        public static getRectangle():egret.Rectangle {
            return new egret.Rectangle();
        }
    }
}