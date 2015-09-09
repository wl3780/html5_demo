class Main extends egret.DisplayObjectContainer {

    private scene:GameScene;

    private all_avatar:Array<string> = ["wcx001","wcx004","wco005","wco001"];
    private all_sex:Array<number> = [1,1,2,2];
    private all_weapon:Array<string> = ["wwx007"];
    private all_wing:Array<string> = ["cb12"];

    private dir_flags:Array<number> = [1, -1];
    private robot_list:Array<engine.Char> = [];
    private robot_index:number = 0;
    private main_avatar_index:number = 0;
    private time_dur:number = 0;

    public constructor() {
        super();
        this.addEventListener(egret.Event.ADDED_TO_STAGE,this.onAddToStage,this);
    }
    
    private onAddToStage(event:egret.Event) {
        egret.Profiler.getInstance().run();
        engine.Engine.setup(this, ModuleConst, NetworkModule, "");

        this.stage.addEventListener(egret.Event.RESIZE, this.onResize, this);

        RES.addEventListener(RES.ResourceEvent.CONFIG_COMPLETE,this.onConfigComplete,this);
        RES.loadConfig("resource/resource.json", "resource/");
    }

    private onConfigComplete(event:RES.ResourceEvent) {
        RES.removeEventListener(RES.ResourceEvent.CONFIG_COMPLETE,this.onConfigComplete,this);
        RES.addEventListener(RES.ResourceEvent.GROUP_COMPLETE,this.onResourceLoadComplete,this);
        RES.addEventListener(RES.ResourceEvent.GROUP_LOAD_ERROR,this.onResourceLoadError,this);
        RES.loadGroup("preload");
    }

    private onResourceLoadComplete(event:RES.ResourceEvent) {
        if(event.groupName == "preload") {
            RES.loadGroup("assets");
        } else if (event.groupName == "assets") {
            this.createHUD();
            this.createGameScene();
        }
    }

    private onResourceLoadError(event:RES.ResourceEvent) {
        console.error("资源加载失败:" + event.groupName);
    }

    private onResize(evt:egret.Event) {
        console.log("fuck you " + this.stage.stageWidth+"px " + this.stage.stageHeight+"px");
    }

    private createGameScene() {
        this.main_avatar_index = 1;
        this.scene = new GameScene();
        this.scene.setup(this);
        this.scene.mainChar.x = 2500;
        this.scene.mainChar.y = 1300;
        this.scene.changeScene("10321");
        this.scene.mainChar.loadAvatarPart(engine.AvatarTypes.BODY_TYPE, this.all_avatar[this.main_avatar_index]);
        this.scene.mainChar.sex = this.all_sex[this.main_avatar_index];
        this.scene.mainChar.loadAvatarPart(engine.AvatarTypes.WEAPON_TYPE, this.all_weapon[0]);
        this.scene.mainChar.loadAvatarPart(engine.AvatarTypes.WING_TYPE, this.all_wing[0]);
        this.scene.mainChar.showShadow();
        this.scene.mainChar.charName = "西门大官人";
        this.scene.mainChar.setBlood(100, 500);
        this.scene.mainChar.setNei(200, 800);

        for (var i:number=0; i<0; i++) {
            var idx:number = Math.random() * this.all_avatar.length >> 0;
            var char:engine.Char = new engine.Char();
            char.x = this.scene.mainChar.x + Math.random() * 500 >> 0;
            char.y = this.scene.mainChar.y + Math.random() * 300 >> 0;
            char.showShadow();
            char.sex = this.all_sex[idx];
            char.loadAvatarPart(engine.AvatarTypes.BODY_TYPE, this.all_avatar[idx]);
            char.charName = "Robot" + i;
            this.scene.addItem(char, engine.SceneConst.MIDDLE_LAYER);
            this.robot_list.push(char);
        }

        this.stage.addEventListener(egret.Event.ENTER_FRAME, this.loop, this);
    }

    private loop(evt:egret.Event) {
        if (this.robot_list.length <= 0 || egret.getTimer() - this.time_dur < 80) {
            return;
        }
        this.time_dur = egret.getTimer();

        if (this.robot_index >= this.robot_list.length) {
            this.robot_index = 0;
        }
        var char:engine.Char = this.robot_list[this.robot_index];
        if (char.isRunning == false) {
            var pt_end:egret.Point = engine.Engine.getPoint(this.scene.mainChar.x, this.scene.mainChar.y);
            pt_end.x += Math.random() * 500 * this.dir_flags[Math.random() * 2 >> 0] >> 0;
            pt_end.y += Math.random() * 300 * this.dir_flags[Math.random() * 2 >> 0] >> 0;
            var paths:Array<egret.Point> = [pt_end];
            char.tarMoveTo(paths);
        }
        this.robot_index++;
    }
    
    private createHUD() {
        this.createButton(this.tapFunc, "变身", 210, 0);
        this.createButton(this.attackFunc, "攻击", 320, 0);
        this.createButton(this.skillFunc, "施法", 430, 0);
        this.createButton(this.hitFunc, "受击", 540, 0);
        this.createButton(this.deathFunc, "死亡", 650, 0);
    }

    private createButton(handler:Function, label:string, x:number, y:number) {
        var btn:gui.Button = new gui.Button();
        btn.styleName = "mybutton";
        btn.label = label;
        btn.x = x;
        btn.y = y;
        btn.width = 125;
        btn.height = 65;
        btn.addEventListener(egret.TouchEvent.TOUCH_TAP, handler, this);
        this.addChild(btn);
    }

    private tapFunc() {
        this.main_avatar_index++;
        if (this.main_avatar_index >= this.all_avatar.length) {
            this.main_avatar_index = 0;
        }
        this.scene.mainChar.loadAvatarPart(engine.AvatarTypes.BODY_TYPE, this.all_avatar[this.main_avatar_index]);
    }

    private attackFunc() {
        this.scene.mainChar.play(engine.ActionConst.ATTACK, engine.AvatarRenderTypes.PLAY_NEXT_RENDER);
    }

    private skillFunc() {
        this.scene.mainChar.play(engine.ActionConst.SKILL, engine.AvatarRenderTypes.PLAY_NEXT_RENDER);
    }
    
    private hitFunc() {
        this.scene.mainChar.play(engine.ActionConst.HIT, engine.AvatarRenderTypes.PLAY_NEXT_RENDER);
    }
    
    private deathFunc() {
        this.scene.mainChar.play(engine.ActionConst.DEATH, engine.AvatarRenderTypes.PLAY_NEXT_RENDER);
    }

}
