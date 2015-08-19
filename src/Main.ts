class Main extends egret.DisplayObjectContainer {

    private scene:GameScene;
    private all_avatar:Array<string> = ["100000001","100000002","100000003","100000004"];
    private dir_flags:Array<number> = [1, -1];
    private robot_list:Array<engine.Char> = [];
    private robot_index:number = 0;
    private time_dur:number = 0;

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

    private onConfigComplete(event:RES.ResourceEvent) {
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
        this.scene.mainChar.loadAvatarPart(engine.AvatarTypes.BODY_TYPE, "100000002");

        for (var i:number=0; i<1; i++) {
            var idx:number = Math.random() * this.all_avatar.length >> 0;
            var char:engine.Char = new engine.Char();
            char.x = this.scene.mainChar.x + Math.random() * 500 >> 0;
            char.y = this.scene.mainChar.y + Math.random() * 300 >> 0;
            char.loadAvatarPart(engine.AvatarTypes.BODY_TYPE, this.all_avatar[idx]);
            this.scene.addItem(char, engine.SceneConst.MIDDLE_LAYER);
            this.robot_list.push(char);
        }

        this.stage.addEventListener(egret.Event.ENTER_FRAME, this.loop, this);
    }

    private loop(evt:egret.Event) {
        if (this.robot_list.length && egret.getTimer() - this.time_dur < 80) {
            return;
        }
        this.time_dur = egret.getTimer();

        if (this.robot_index >= this.robot_list.length) {
            this.robot_index = 0;
        }
        var char:engine.Char = this.robot_list[this.robot_index];
        if (char.isRuning == false) {
            var pt_start:egret.Point = engine.Engine.getPoint(char.x, char.y);
            var pt_end:egret.Point = engine.Engine.getPoint(this.scene.mainChar.x, this.scene.mainChar.y);
            pt_end.x += Math.random() * 400 * this.dir_flags[Math.random() * 2 >> 0];
            pt_end.y += Math.random() * 200 * this.dir_flags[Math.random() * 2 >> 0];
            var paths:Array<egret.Point> = MainCharWalkManager.getInstance().getPath(pt_start, pt_end);
            char.tarMoveTo(paths);

            engine.Engine.putPoint(pt_start);
            engine.Engine.putPoint(pt_end);
        }
        this.robot_index++;
    }

}


