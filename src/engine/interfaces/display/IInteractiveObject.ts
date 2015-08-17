module engine {

    export interface IInteractiveObject {
        tarMoveTo(paths:Array<egret.Point>);

        loopMove();
    }
}