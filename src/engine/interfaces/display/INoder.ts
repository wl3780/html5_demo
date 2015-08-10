module engine {

    export interface INoder {
        x:number;

        y:number;

        id:string;

        tid?:string;

        stage?:egret.Stage;

        isActive?:boolean;

        node:INodeRect;

        activate():void;

        unactivate():void;

        getBounds(resultRect?:egret.Rectangle, calculateAnchor?:boolean): egret.Rectangle;
    }
}