module engine {
	export class AvatarRequestManager {

		private static instance:AvatarRequestManager;

		private _requestHash_:Map<string, AvatarActionFormatGroup> = new Map<string, AvatarActionFormatGroup>();
		private _textureHash_:Map<string, egret.SpriteSheet> = new Map<string, egret.SpriteSheet>();
		private _wealthQueue_:WealthQueueAlone;

		public constructor() {
			this._wealthQueue_ = new WealthQueueAlone();
			this._wealthQueue_.limitIndex = 80;
			this._wealthQueue_.name = WealthConst.AVATAR_REQUEST_WEALTH;
			this._wealthQueue_.isSortOn = true;
			this._wealthQueue_.addEventListener(WealthEvent.WEALTH_COMPLETE, this.onWealthLoadFunc, this);
			this._wealthQueue_.addEventListener(WealthEvent.WEALTH_ERROR, this.onWealthErrorFunc, this);
		}

		public static getInstance():AvatarRequestManager {
			if (AvatarRequestManager.instance == null) {
				AvatarRequestManager.instance = new AvatarRequestManager();
			}
			return AvatarRequestManager.instance;
		}

		public getBitmapData(key:string):egret.SpriteSheet {
			var sheet:egret.SpriteSheet = this._textureHash_.get(key);
			return sheet;
		}

		public loadAvatarFormat(unitId:string, avatarType:string, avatarNum:string):string {
			var avatarId:string = avatarType + Engine.LINE + avatarNum;
			var actData:AvatarActionData = AvatarActionData.createAvatarActionData();
			var actGroup:AvatarActionFormatGroup = this._requestHash_.get(avatarId);
			if (actGroup == null) {
				actGroup = AvatarActionFormatGroup.createAvatarActionFormatGroup();
                actGroup.idName = avatarId;
				this._requestHash_.set(avatarId, actGroup);
			}
			actGroup.quoteQueue.push(actData.id);
			actData.oid = unitId;
			actData.type = avatarType;
			actData.idName = avatarId;
			actData.avatarDataFormatGroup_id = actGroup.id;
			if (avatarId == EngineGlobal.SHADOW_ID) {
				EngineGlobal.shadowAvatarGroup = actGroup;
				EngineGlobal.shadowAvatarData = actData;
			}
			if (avatarId == EngineGlobal.MALE_SHADOW) {
				EngineGlobal.shadowAvatarGroupMale = actGroup;
				EngineGlobal.shadowAvatarDataMale = actData;
			}
			if (avatarId == EngineGlobal.FEMALE_SHADOW) {
				EngineGlobal.shadowAvatarGroupFemale = actGroup;
				EngineGlobal.shadowAvatarDataFemale = actData;
			}
			if (avatarId == EngineGlobal.MALE_BASE) {
				EngineGlobal.baseAvatarGroupMale = actGroup;
				EngineGlobal.baseAvatarDataMale = actData;
			}
			if (avatarId == EngineGlobal.FEMALE_BASE) {
				EngineGlobal.baseAvatarGroupFemale = actGroup;
				EngineGlobal.baseAvatarDataFemale = actData;
			}
			if (actGroup.isLoaded == false) {
				if (actGroup.isPended == false) {
					actGroup.isPended = true;
					var path:string = EngineGlobal.getAvatarAssetsConfigPath(avatarId);
					this._wealthQueue_.addWealth(path, {
						actionDataGroup_id:actGroup.id,
						avatarData_id:actData.id,
						avatarUnit_id:unitId
					});
				}
			} else {
				actData.onSetupReady();
			}
			return actData.id;
		}

		public loadAvatarSWF(idName:string, act:string, dir:number) {
			var key:string = idName + Engine.LINE + act + Engine.LINE + dir;
			if (this._textureHash_.has(key) == true) {
				return;
			}

			var path:string = EngineGlobal.getAvatarAssetsJsonPath(idName, act ,dir);
			var path2:string = EngineGlobal.getAvatarAssetsImagePath(idName, act, dir);
			var loader:ILoader = WealthStoragePort.takeLoaderByWealth(path);
			var loader2:ILoader = WealthStoragePort.takeLoaderByWealth(path2);
			var data:any = {idName:idName,act:act,dir:dir};
			if (loader == null || loader2 == null) {
				var prio:number = -1;
				var arr:Array<string> = [Scene.scene.mainChar.mid, Scene.scene.mainChar.wid, Scene.scene.mainChar.wgid];
				var index:number = arr.indexOf(idName);
				if (index != -1) {
					prio = 1;
				}
				if (loader == null) {
					this._wealthQueue_.addWealth(path, data, prio);
				}
				if (loader2 == null) {
					this._wealthQueue_.addWealth(path2, data, prio);
				}
			} else {
				this.analyzeSWF(data);
			}
		}

		private onWealthLoadFunc(evt:WealthEvent) {
			var loader:ILoader = WealthStoragePort.takeLoaderByWealth(evt.path);
			var wealthData:WealthData = WealthData.getWealthData(evt.wealth_id);
			if (wealthData.type == WealthConst.BING_WEALTH) {
				if (loader.data) {
					var actGroup:AvatarActionFormatGroup = AvatarActionFormatGroup.takeAvatarActionFormatGroup(wealthData.data.actionDataGroup_id);
					this.analyzeAvatarActionFormat(actGroup, new egret.ByteArray(loader.data));
					actGroup.isLoaded = true;
					actGroup.isPended = false;
					actGroup.noticeAvatarActionData();
				}
			} else if (wealthData.type == WealthConst.IMG_WEALTH) {
				if (loader.data) {
					this.analyzeSWF(wealthData.data);
				}
			} else if (wealthData.type == WealthConst.TXT_WEALTH) {
				if (loader.data) {
					this.analyzeSWF(wealthData.data);
				}
			}
			this._wealthQueue_.removeWealth(wealthData.id);
			wealthData.dispose();
		}

		private onWealthErrorFunc(evt:WealthEvent) {

		}

		private analyzeAvatarActionFormat(actGroup:AvatarActionFormatGroup, byte:egret.ByteArray) {
			var idName:string = byte.readUTF();
			actGroup.idName = idName;
			var len:number = byte.readByte();
			var index:number = 0;
			var actionFormat:AvatarActionFormat;
			while (index < len) {
				actionFormat = AvatarActionFormat.createAvatarActionFormat();
				actionFormat.oid = actGroup.id;
				actionFormat.idName = idName;
				var actionName:string = byte.readUTF();
				var totalFrames:number = byte.readByte();
				var actionSpeed:number = byte.readShort();
				var replay:number = byte.readInt();
				var skillFrame:number = byte.readByte();
				var hitFrame:number = byte.readByte();
				var totalDir:number = byte.readByte();
				actionFormat.actionName = actionName;
				actionFormat.totalFrames = totalFrames;
				actionFormat.actionSpeed = actionSpeed;
				actionFormat.replay = replay;
				actionFormat.skillFrame = skillFrame==0 ? totalFrames - 2 : skillFrame;
				actionFormat.hitFrame = hitFrame;
				actionFormat.totalDir = totalDir;
				if (actionFormat.replay == 0) {
					actionFormat.replay = 1;
				}
				actionFormat.totalTime = 0;

				var frameIndex:number = 0;
				while (frameIndex < totalFrames) {
					var interval:number = byte.readInt();
					actionFormat.intervalTimes.push(actionSpeed + interval);
					actionFormat.totalTime += actionSpeed + interval;
					frameIndex++;
                } console.log(idName + "_" + actionName + ":" + actionFormat.intervalTimes);

				var dirIndex:number = 0;
				while (dirIndex < totalDir) {
					actionFormat.dirOffsetX[dirIndex] = byte.readInt();
					actionFormat.dirOffsetY[dirIndex] = byte.readInt();
					dirIndex++;
				}

				dirIndex = 0;
				while (dirIndex < totalDir) {
					var bWidths:Array<number> = [];
					var bHeights:Array<number> = [];
					var bTxs:Array<number> = [];
					var bTys:Array<number> = [];
					var bBitmapdatas:Array<string> = [];

					frameIndex = 0;
					while (frameIndex < totalFrames) {
						var w:number = byte.readShort();
						var h:number = byte.readShort();
						var tx:number = byte.readShort();
						var ty:number = byte.readShort();
						tx -= EngineGlobal.AVATAR_IMAGE_WIDTH;
						ty -= EngineGlobal.AVATAR_IMAGE_HEIGHT;
						bWidths.push(w);
						bHeights.push(h);
						bTxs.push(tx);
						bTys.push(ty);
						bBitmapdatas.push(actionFormat.getLink(dirIndex, frameIndex));
						frameIndex ++;
					}
					actionFormat.widths.push(bWidths);
					actionFormat.heights.push(bHeights);
					actionFormat.txs.push(bTxs);
					actionFormat.tys.push(bTys);
					actionFormat.bitmapdatas.push(bBitmapdatas);
					dirIndex ++;
				}
				actGroup.addAction(actionName, actionFormat);
				index++;
			}
			if (actGroup.isCreateWarn) {
				if (actGroup.hasAction("attack")) {
					this.addWarmDataFormat("attack", "attack_warm", actGroup);
				}
			}
		}
		private addWarmDataFormat(copyFrom:string, warmAction:string, actGroup:AvatarActionFormatGroup) {
			var copyFormat:AvatarActionFormat = actGroup.takeAction(copyFrom);
			if (!copyFormat) {
				return;
			}

			var actionFormat:AvatarActionFormat = AvatarActionFormat.createAvatarActionFormat();
			actionFormat.oid = actGroup.id;
			actionFormat.idName = actGroup.idName;
			actionFormat.actionName = warmAction;
			actionFormat.totalFrames = 1;
			actionFormat.actionSpeed = copyFormat.actionSpeed;
			actionFormat.replay = -1;
			actionFormat.skillFrame = 0;
			actionFormat.hitFrame = 0;
			actionFormat.totalDir = copyFormat.totalDir;
			actionFormat.totalTime = 0;

			var frameIndex:number = 0;
			while (frameIndex < actionFormat.totalFrames) {
				actionFormat.intervalTimes.push(actionFormat.actionSpeed + 0);
				actionFormat.totalTime += actionFormat.actionSpeed + 0;
				frameIndex++;
			}

			var dirIndex:number = 0;
			while (dirIndex < actionFormat.totalDir) {
				actionFormat.dirOffsetX[dirIndex] = copyFormat.dirOffsetX[dirIndex];
				actionFormat.dirOffsetY[dirIndex] = copyFormat.dirOffsetY[dirIndex];
				dirIndex++;
			}
			dirIndex = 0;
			while (dirIndex < actionFormat.totalDir) {
				var bWidths:Array<number> = copyFormat.widths[dirIndex].slice(0, 1);
				var bHeights:Array<number> = copyFormat.heights[dirIndex].slice(0, 1);
				var bTxs:Array<number> = copyFormat.txs[dirIndex].slice(0, 1);
				var bTys:Array<number> = copyFormat.tys[dirIndex].slice(0, 1);
				var bBitmapdatas:Array<string> = copyFormat.bitmapdatas[dirIndex].slice(0, 1);

				actionFormat.widths.push(bWidths);
				actionFormat.heights.push(bHeights);
				actionFormat.txs.push(bTxs);
				actionFormat.tys.push(bTys);
				actionFormat.bitmapdatas.push(bBitmapdatas);
				dirIndex++;
			}
			actGroup.addAction(warmAction, actionFormat);
		}

		private analyzeSWF(data:any) {
			var path:string = EngineGlobal.getAvatarAssetsJsonPath(data.idName, data.act, data.dir);
			var path2:string = EngineGlobal.getAvatarAssetsImagePath(data.idName, data.act, data.dir);
			var loader:ILoader = WealthStoragePort.takeLoaderByWealth(path);
			var loader2:ILoader = WealthStoragePort.takeLoaderByWealth(path2);
			if (loader && loader2) {
				var key:string = data.idName + Engine.LINE + data.act + Engine.LINE + data.dir;
				if (this._textureHash_.has(key) == false) {
					var sheet:egret.SpriteSheet = this.parseSpriteSheet(loader2.data, JSON.parse(loader.data));
					this._textureHash_.set(key, sheet);

					var warmAct:string = ActionConst.warmHash[data.act];
					if (warmAct) {
						var key2:string = data.idName + Engine.LINE + warmAct + Engine.LINE + data.dir;
						this._textureHash_.set(key2, sheet);
					}
				}
			}
		}
		private parseSpriteSheet(texture:egret.Texture, data:any):egret.SpriteSheet {
			var frames:any = data.frames;
			if(!frames) {
				return null;
			}
			var spriteSheet:egret.SpriteSheet = new egret.SpriteSheet(texture);
			for (var subkey in frames) {
				var config:any = frames[subkey];
				var texture:egret.Texture = spriteSheet.createTexture(subkey,config.x,config.y,config.w,config.h,config.offX,config.offY,config.sourceW,config.sourceH);
			}
			return spriteSheet;
		}
	}
}