var GameScene = (function (_super) {
    __extends(GameScene, _super);
    function GameScene() {
        _super.call(this);
    }
    var __egretProto__ = GameScene.prototype;
    __egretProto__._EngineMouseDownFunc_ = function (evt) {
        _super.prototype._EngineMouseDownFunc_.call(this, evt);
        if (this.isReady == false) {
            return;
        }
        this.sceneMoveTo(evt.stageX - this.x, evt.stageY - this.y);
    };
    return GameScene;
})(engine.Scene);
GameScene.prototype.__class__ = "GameScene";
//# sourceMappingURL=GameScene.js.map