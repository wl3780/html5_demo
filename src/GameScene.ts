class GameScene extends engine.Scene {

    public static scene:GameScene;

    public constructor() {
        super();
        GameScene.scene = this;
    }

    protected _EngineMouseDownFunc_(evt:egret.TouchEvent):void {
        super._EngineMouseDownFunc_(evt);
        if (this.isReady == false) {
            return;
        }
        this.mouseDownPoint.setTo(evt.stageX-this.x, evt.stageY-this.y)
        MainCharWalkManager.getInstance().mainCharWalk(this.mouseDownPoint, null);
    }
}