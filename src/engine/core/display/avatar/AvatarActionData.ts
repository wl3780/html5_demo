module engine {

	export class AvatarActionData extends Proto {

		private static _instanceHash_:Map<string, AvatarActionData> = new Map<string, AvatarActionData>();
		private static _recoverQueue_:Array<AvatarActionData> = [];
		private static _recoverIndex_:number = 50;

		public type:string;
		public idName:string;
		public random:number;
		public isReady:boolean = false;
		public isDisposed:Boolean = false;
		public offsetX:number = 0;
		public offsetY:number = 0;
		public stopFrame:number = -1;

		private _avatarDataFormatGroup_id_:string;
		private _currAction_:string = ActionConst.STAND;
		private _currDir_:number = 0;
		private  _currInterval_:number = 0;
		private _totalFrames_:number = 0;
		private _currFrame_:number = 0;

		private _actionGroup_:AvatarActionFormatGroup;
		private _actionFormat_:AvatarActionFormat;

		public constructor() {
			super();
			AvatarActionData._instanceHash_.set(this.id, this);
		}

		public static createAvatarActionData():AvatarActionData {
			if (AvatarActionData._recoverQueue_.length) {
				var result:AvatarActionData = AvatarActionData._recoverQueue_.pop();
				result._id_ = Engine.getSoleId();
				AvatarActionData._instanceHash_.set(result.id, result);
                return result;
			} else {
				return new AvatarActionData();
			}
		}

		public static takeAvatarActionData(id:string):AvatarActionData {
			return AvatarActionData._instanceHash_.get(id);
		}

		public static removeAvatarActionData(id:string) {
			AvatarActionData._instanceHash_.delete(id);
		}

		public onSetupReady() {
			this.isReady = true;
			this._actionFormat_ = this._actionGroup_.takeAction(this._currAction_);
			this._totalFrames_ = this._actionFormat_.totalFrames;
			this.loadActSWF(this._currAction_, this._currDir_);
		}

		public get currInterval():number {
			if (this._actionFormat_) {
				var frame:number = this._currFrame_ - 1;
				if (frame <= -1) {
					return 0;
				}
				if (frame >= this._actionFormat_.intervalTimes.length) {
					frame = this._actionFormat_.intervalTimes.length - 1;
				}
				this._currInterval_ = this._actionFormat_.intervalTimes[frame];
			}
			return this._currInterval_;
		}

		public getActionFormat(act:string):AvatarActionFormat {
			if (this._actionGroup_) {
				var format:AvatarActionFormat = this._actionGroup_.takeAction(act);
				return format;
			} else {
				return null;
			}
		}

		public getBitmapData(dir:number, frame:number):egret.Texture {
			if (this._actionFormat_) {
				var key:string = this.idName + Engine.LINE + this._currAction_ + Engine.LINE + this._currDir_;
				var sheet:egret.SpriteSheet = AvatarRequestManager.getInstance().getBitmapData(key);
				if (sheet) {
					if (frame >= this._actionFormat_.bitmapdatas[dir].length) {
						frame = this._actionFormat_.bitmapdatas[dir].length - 1;
					}
					var link:string = this._actionFormat_.bitmapdatas[dir][frame];
					return sheet.getTexture(link);
				} else {
					this.loadActSWF(this._currAction_, dir);
				}
			}
			return null;
		}

		public getBitmapDataOffsetX(dir:number, frame:number):number {
			if (this._actionFormat_) {
				if (this._actionFormat_.totalDir == 1) {
					dir = 0;
				}
				if (this._actionFormat_.txs[dir] && frame < this._actionFormat_.txs[dir].length) {
					return this._actionFormat_.txs[dir][frame] - this._actionFormat_.dirOffsetX[dir] + this.offsetX;
				}
			}
			return 0;
		}

		public getBitmapDataOffsetY(dir:number, frame:number):number {
			if (this._actionFormat_) {
				if (this._actionFormat_.totalDir == 1) {
					dir = 0;
				}
				if (this._actionFormat_.tys[dir] && frame < this._actionFormat_.tys[dir].length) {
					return this._actionFormat_.tys[dir][frame] - this._actionFormat_.dirOffsetY[dir] + this.offsetY;
				}
			}
			return 0;
		}

		public set avatarDataFormatGroup_id(value:string) {
			this._avatarDataFormatGroup_id_ = value;
			this._actionGroup_ = AvatarActionFormatGroup.takeAvatarActionFormatGroup(value);
		}

		public set currAction(value:string) {
			if (this._actionGroup_ && this._actionGroup_.isLoaded) {
				this._actionFormat_ = this._actionGroup_.takeAction(value);
				this._totalFrames_ = this._actionFormat_.totalFrames;
			}
			this._currAction_ = value;
		}

		public set currDir(value:number) {
			this._currDir_ = value;
		}

		public get totalFrames():number {
			return this._totalFrames_;
		}

		public set currFrame(value:number) {
			this._currFrame_ = value;
		}

		public recover() {
			if (this.isDisposed) {
				return;
			}
			AvatarActionData._instanceHash_.delete(this.id);
			if (AvatarActionData._recoverQueue_.length < AvatarActionData._recoverIndex_) {
				AvatarActionData._recoverQueue_.push(this);
			} else {
				this.dispose();
			}
		}

		public dispose() {
			super.dispose();
			this.isDisposed = true;
		}

		private loadActSWF(act:string, dir:number) {
			if (this.isDisposed) {
				return;
			}
			if (this._actionGroup_ && this._actionGroup_.isLoaded) {
				this._actionFormat_ = this._actionGroup_.takeAction(act);
				if (this._actionFormat_) {
					if (act == ActionConst.AttackWarm) {
						act = ActionConst.ATTACK;
					}
					AvatarRequestManager.getInstance().loadAvatarSWF(this.idName, act, dir);
				}
			}
		}

	}

}