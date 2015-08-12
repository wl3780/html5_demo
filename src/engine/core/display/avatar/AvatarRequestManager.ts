module engine {
	export class AvatarRequestManager {

		private static instance:AvatarRequestManager;

		private _requestHash_:Map<string, AvatarDataFormatGroup> = new Map<string, AvatarDataFormatGroup>();
		private _bitmapdataHash_:Map<string, egret.SpriteSheet> = new Map<string, egret.SpriteSheet>();

		public constructor() {
		}

		public static getInstance():AvatarRequestManager {
			if (AvatarRequestManager.instance == null) {
				AvatarRequestManager.instance = new AvatarRequestManager();
			}
			return AvatarRequestManager.instance;
		}

		public getBitmapData(key:String, link:String):egret.Texture {
			var sheet:egret.SpriteSheet = this._bitmapdataHash_.get(key);
			if (sheet) {
				return sheet.getTexture(link);
			}
			return null;
		}

		public loadAvatar(unitId:string, avatarType:string, avatarNum:string):string {
			var avatarId:string = avatarType + Engine.LINE + avatarNum;
			var actData:AvatarActionData = AvatarActionData.createAvatarActionData();
			var actGroup:AvatarDataFormatGroup = this._requestHash_.get(avatarId);
			if (actGroup == null) {
				actGroup = AvatarDataFormatGroup.createAvatarActionDataGroup();
				this._requestHash_.set(avatarId, actGroup);
			}
			actGroup.quoteQueue.push(actData.id);
			actData.oid = unitId;
			actData.type = avatarType;
			actData.idName = avatarId;
			actData.avatarDataFormatGroup_id = actGroup.id;
			if (actGroup.isLoaded == false) {
				this.addLoadItem(avatarId);
			} else {
				actData.onSetupReady();
			}
			return actData.id;
		}

		public onWealthLoadFunc(avatarId:string) {
			var resId:string = avatarId + "_sm";
			var config:any = RES.getRes(resId);
			var actGroup:AvatarDataFormatGroup = this._requestHash_.get(avatarId);
			this.analyeAvatarActionFormat(actGroup, config);
			actGroup.isLoaded = true;
			actGroup.noticeAvatarActionData();

			resId = avatarId + "_json";
			var sheet:egret.SpriteSheet = RES.getRes(resId);
			this.analyzeSWF(avatarId, sheet);
		}

		public onWealthErrorFunc(avatarId:string) {

		}

		private addLoadItem(avatarId:string) {
			if (RES.isGroupLoaded(avatarId) == false) {
				RES.createGroup(avatarId, [avatarId + "_sm", avatarId + "_json", avatarId + "_png"]);
				RES.loadGroup(avatarId);
			}
		}

		private analyeAvatarActionFormat(actGroup:AvatarDataFormatGroup, config:any) {
			var avatar:any = config.avatar;
			var actionList:Array<any> = avatar.action;
			var actionIdx:number = 0;
			var actionLen:number = actionList.length;
			var actFormat:AvatarDataFormat;
			while (actionIdx < actionLen) {
				var actionItem:any = actionList[actionIdx];
				actFormat = AvatarDataFormat.createAvatarDataFormat();
				actFormat.setup(actGroup, actionItem);
				actGroup.addAction(actFormat.actionName, actFormat);
				actionIdx++;
			}
		}

		private analyzeSWF(avatarId:string, data:any) {
			this._bitmapdataHash_.set(avatarId, data);
		}
	}
}