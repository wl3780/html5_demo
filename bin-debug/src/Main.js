var Main = (function (_super) {
    __extends(Main, _super);
    function Main() {
        _super.call(this);
        this.addEventListener(egret.Event.ADDED_TO_STAGE, this.onAddToStage, this);
    }
    var __egretProto__ = Main.prototype;
    __egretProto__.onAddToStage = function (event) {
        egret.Profiler.getInstance().run();
        this.stage.addEventListener(egret.Event.RESIZE, this.onResize, this);
        engine.Engine.setup(this, "");
        RES.addEventListener(RES.ResourceEvent.CONFIG_COMPLETE, this.onConfigComplete, this);
        RES.loadConfig("resource/resource.json", "resource/");
    };
    __egretProto__.onConfigComplete = function (event) {
        RES.removeEventListener(RES.ResourceEvent.CONFIG_COMPLETE, this.onConfigComplete, this);
        RES.addEventListener(RES.ResourceEvent.GROUP_COMPLETE, this.onResourceLoadComplete, this);
        RES.addEventListener(RES.ResourceEvent.GROUP_LOAD_ERROR, this.onResourceLoadError, this);
        RES.loadGroup("preload");
    };
    __egretProto__.onResourceLoadComplete = function (event) {
        if (event.groupName == "preload") {
            this.createGameScene();
        }
        else if (event.groupName.indexOf("mid") != -1) {
            AvatarManager.getInstance().addAvatarSheet(event.groupName);
            AvatarManager.getInstance().addAvatarParam(event.groupName);
        }
    };
    __egretProto__.onResourceLoadError = function (event) {
        this.onResourceLoadComplete(event);
    };
    __egretProto__.onResize = function (evt) {
        console.log("fuck you " + this.stage.stageWidth + "px " + this.stage.stageHeight + "px");
    };
    __egretProto__.createGameScene = function () {
        this.scene = new GameScene();
        this.scene.setup(this);
        this.scene.changeScene("10321");
    };
    return Main;
})(egret.DisplayObjectContainer);
Main.prototype.__class__ = "Main";
//# sourceMappingURL=Main.js.map