module engine {

    export interface INodeRect {
        id:string;

        rect:egret.Rectangle;

        reFree():void;
    }
}