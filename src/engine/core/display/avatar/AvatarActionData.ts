module engine {

	export class AvatarActionData extends Proto {

		public static _instanceHash_:Map<string, AvatarActionData> = new Map<string, AvatarActionData>();
		public static _recoverQueue_:Array<AvatarActionData> = [];
		public static _recoverIndex_:number = 50;

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
		private _currDir_:number;
		private _totalFrames_:number;
		private _currFrame_:number;

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
		}

		public get currInterval():number {
			if (this._actionFormat_) {
				var frame:number = this._currFrame_ - 1;
				if (frame <= -1) {
					return 0;
				}
				return this._actionFormat_.actionSpeed;
			}
			return 0;
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
				var link:string = this._actionFormat_.getLink(dir, frame);
				var bmd:egret.Texture = AvatarRequestManager.getInstance().getBitmapData(this.idName, link);
				return bmd;
			} else {
				return null;
			}
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

		public getBitmapDataFlip(dir:number):boolean {
			if (this._actionFormat_) {
				if (this._actionFormat_.totalDir == 1) {
					dir = 0;
				}
				return this._actionFormat_.bitmapFlips[dir];
			}
			return false;
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

	}

}