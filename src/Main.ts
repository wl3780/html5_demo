class Main extends egret.DisplayObjectContainer {

    private scene:GameScene;

    public constructor() {
        super();
        this.addEventListener(egret.Event.ADDED_TO_STAGE,this.onAddToStage,this);
    }
    
    private onAddToStage(event:egret.Event) {
        egret.Profiler.getInstance().run();
        this.stage.addEventListener(egret.Event.RESIZE, this.onResize, this);

        engine.Engine.setup(this, "");

        RES.addEventListener(RES.ResourceEvent.CONFIG_COMPLETE,this.onConfigComplete,this);
        RES.loadConfig("resource/resource.json","resource/");
    }

    private onConfigComplete(event: RES.ResourceEvent) {
        RES.removeEventListener(RES.ResourceEvent.CONFIG_COMPLETE,this.onConfigComplete,this);
        RES.addEventListener(RES.ResourceEvent.GROUP_COMPLETE,this.onResourceLoadComplete,this);
        RES.addEventListener(RES.ResourceEvent.GROUP_LOAD_ERROR,this.onResourceLoadError,this);
        RES.loadGroup("preload");
    }

    private onResourceLoadComplete(event:RES.ResourceEvent) {
        if(event.groupName=="preload") {
            this.createGameScene();
        } else if(event.groupName.indexOf("mid") != -1) {
            engine.AvatarRequestManager.getInstance().onWealthLoadFunc(event.groupName);
        }
    }

    private onResourceLoadError(event:RES.ResourceEvent) {
        console.error("资源加载失败:" + event.groupName);
        if (event.groupName.indexOf("mid") != -1) {
            engine.AvatarRequestManager.getInstance().onWealthErrorFunc(event.groupName);
        }
    }

    private onResize(evt:egret.Event) {
        console.log("fuck you " + this.stage.stageWidth+"px " + this.stage.stageHeight+"px");
    }

    private createGameScene() {
        this.scene = new GameScene();
        this.scene.setup(this);
        this.scene.mainChar.x = 2500;
        this.scene.mainChar.y = 1300;
        this.scene.changeScene("10321");
//        this.scene.changeScene("10001");
    }

}


