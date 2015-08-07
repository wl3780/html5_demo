class AvatarManager {
    
    private static instance:AvatarManager;

	public avatarHash:any;
	public sheetHash:any;
	public paramHash:any;

	public constructor() {
		this.avatarHash = {};
		this.sheetHash = {};
		this.paramHash = {};

		egret.Ticker.getInstance().register(this.onEnterFrame, this);
	}

	public static getInstance():AvatarManager {
		if (AvatarManager.instance == null) {
			AvatarManager.instance = new AvatarManager();
		}
		return AvatarManager.instance;
	}

	public addAvatarSheet(avatarId:string):void {
		var resId:string = avatarId + "_json";
		var sheet:egret.SpriteSheet = RES.getRes(resId);
		this.sheetHash[avatarId] = sheet;
	}

	public addAvatarParam(avatarId:string):void {
		var resId:string = avatarId + "_sm";
		var config:any = RES.getRes(resId);
		var hash:any = this.analyzeData(config);
		this.paramHash[avatarId] = hash;
	}

	public getAvatarParamHash(avatarId:string):any {
		if (avatarId) {
			return this.paramHash[avatarId];
		}
		return null;
	}

	public put(avatar:Avatar):void {
		if (this.avatarHash[avatar.id] == null) {
			this.avatarHash[avatar.id] = avatar;
		}
	}

	public remove(id:string):void {
		if (this.avatarHash[id]) {
			delete this.avatarHash[id];
		}
	}

	public take(id:string):Avatar {
		return this.avatarHash[id];
	}

	public loadAvatar(avatarType:string, avatarNum:string):void {
		var avatarId:string = avatarType + "_" + avatarNum;
		if (RES.isGroupLoaded(avatarId) == false) {
			RES.createGroup(avatarId, [avatarId+"_sm",avatarId+"_json",avatarId+"_png"]);
			RES.loadGroup(avatarId);
		}
	}

	private analyzeData(config: any): any {
		var hash:any = {};
		var avatar:any = config.avatar;
        var avatarId:string = avatar.id;
		var actionList:Array<any> = avatar.action;
		var actionLen:number = actionList.length;
		var actionIdx:number = 0;
		while (actionIdx < actionLen) {
			var actionItem:any = actionList[actionIdx];
			var param:AvatarParam = new AvatarParam();
			param.setup(avatarId, actionItem);
			hash[param.action] = param;
			actionIdx++;
		}
		return hash;
	}

	private onEnterFrame(frameTime:number):void {
		for (var key in this.avatarHash) {
			this.avatarHash[key].bodyRender();
		}
	}
}
