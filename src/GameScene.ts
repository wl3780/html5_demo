class GameScene extends engine.Scene {

    public constructor() {
        super();
    }

    protected _EngineMouseDownFunc_(evt:egret.TouchEvent):void {
        super._EngineMouseDownFunc_(evt);
        if (this.isReady == false) {
            return;
        }
        this.mouseDownPoint.setTo(evt.stageX-this.x, evt.stageY-this.y)
        this.sceneMoveTo(this.mouseDownPoint.x, this.mouseDownPoint.y);
    }
}