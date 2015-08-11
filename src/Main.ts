class Main extends egret.DisplayObjectContainer {

    private scene:GameScene;

    public constructor() {
        super();
        this.addEventListener(egret.Event.ADDED_TO_STAGE,this.onAddToStage,this);
    }
    
    private onAddToStage(event: egret.Event) {
        egret.Profiler.getInstance().run();
        this.stage.addEventListener(egret.Event.RESIZE, this.onResize, this);

        engine.Engine.setup(this, "");

        RES.addEventListener(RES.ResourceEvent.CONFIG_COMPLETE,this.onConfigComplete,this);
        RES.loadConfig("resource/resource.json","resource/");
    }

    private onConfigComplete(event: RES.ResourceEvent): void {
        RES.removeEventListener(RES.ResourceEvent.CONFIG_COMPLETE,this.onConfigComplete,this);
        RES.addEventListener(RES.ResourceEvent.GROUP_COMPLETE,this.onResourceLoadComplete,this);
        RES.addEventListener(RES.ResourceEvent.GROUP_LOAD_ERROR,this.onResourceLoadError,this);
        RES.loadGroup("preload");
    }

    private onResourceLoadComplete(event: RES.ResourceEvent): void {
        if(event.groupName=="preload") {
            this.createGameScene();
        } else if(event.groupName.indexOf("mid") != -1) {
            AvatarManager.getInstance().addAvatarSheet(event.groupName);
            AvatarManager.getInstance().addAvatarParam(event.groupName);
        }
    }

    private onResourceLoadError(event: RES.ResourceEvent): void {
        this.onResourceLoadComplete(event);
    }

    private onResize(evt:egret.Event):void {
        console.log("fuck you " + this.stage.stageWidth+"px " + this.stage.stageHeight+"px");
    }

    private createGameScene(): void {
        this.scene = new GameScene();
        this.scene.setup(this);
        this.scene.mainChar.x = 2500;
        this.scene.mainChar.y = 1300;
        this.scene.changeScene("10321");
//        this.scene.changeScene("10001");
    }

}


