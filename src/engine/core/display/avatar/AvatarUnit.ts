module engine {
	export class AvatarUnit extends Proto {

		private static _instanceHash_:Map<string, AvatarUnit> = new Map<string, AvatarUnit>();
		private static _recoverQueue_:Array<AvatarUnit> = [];
		private static _recoverIndex_:number = 50;

		public renderIndex:number;
		public isDisposed:boolean;
		public priorLoadQueue:Array<string>;
		public mainActionData:AvatarActionData;

		public hitFrameFunc:Function;
		public skillFrameFunc:Function;
		public renderFunc:Function;

		protected _actNow_:string;
		protected _actNext_:string;
		protected _currFrame_:number;
		protected _currDir_:number;

		private _bodyRenderTime_:number = 0;
		private _effectRenderTime_:number = 0;

		private bodyPartHash:Map<string, AvatarActionData>;

		public constructor() {
			super();
			this.priorLoadQueue = [ActionConst.STAND];
			this.renderIndex = Math.random() * AvatarRenderManager.renderNum >> 0;
			this.bodyPartHash = new Map<string, AvatarActionData>();
			AvatarUnit._instanceHash_.set(this.id, this);
			AvatarRenderManager.getInstance().addUnit(this);
		}

		public static createAvatarUnit():AvatarUnit {
			if (AvatarUnit._recoverQueue_.length) {
				var ret:AvatarUnit = AvatarUnit._recoverQueue_.pop();
				ret._id_ = Engine.getSoleId();
				AvatarUnit._instanceHash_.set(ret.id, ret);
				return ret;
			} else {
				return new AvatarUnit();
			}
		}

		public static takeAvatarUnit(id:string):AvatarUnit {
			return AvatarUnit._instanceHash_.get(id);
		}

		public static removeAvatarUnit(id:string):boolean {
			return AvatarUnit._instanceHash_.delete(id);
		}

		public init() {
			this._actNow_ = this._actNext_ = ActionConst.STAND;
            this._currDir_ = DirConst.BOTTOM;
			this._currFrame_ = 0;
			this._bodyRenderTime_ = 0;
		}

		public loadAvatarPart(avatarType:string, idNum:string, random:number) {
			var orgData:AvatarActionData = this.bodyPartHash.get(avatarType);
			if (idNum) {
				var dataId:string = AvatarRequestManager.getInstance().loadAvatarFormat(this.id, avatarType, idNum);
				var actData:AvatarActionData = AvatarActionData.takeAvatarActionData(dataId);
				var tmpData:AvatarActionData = this.mainActionData;
				if (this.mainActionData == null || avatarType == AvatarTypes.BODY_TYPE) {
					this.mainActionData = actData;
					this.mainActionData.currAction = this._actNow_;
					this.mainActionData.currDir = this._currDir_;
					if (this._currFrame_ > this.mainActionData.totalFrames) {
						this._currFrame_ = 0;
					}
					if (tmpData) {    // 已有数据更新
						this.mainActionData.stopFrame = tmpData.stopFrame;
						this.mainActionData.replay = tmpData.replay;
					}
				}
				this.mainActionData.random = random;
				this.bodyPartHash.set(avatarType, actData);
			} else {
				this.bodyPartHash.delete(avatarType);
			}
			if (orgData) {	// 资源回收
				orgData.recover();
			}
		}

		public play(action:string, renderType:number=AvatarRenderTypes.NORMAL_RENDER, stopFrame:number=-1) {
			if (this.mainActionData == null) {
				this._actNow_ = this._actNext_ = action;
				return;
			}
			if (this.isLoopAct(action) || renderType) {
				if (this._actNow_ != action) {
					if ((this._actNow_ == ActionConst.WALK && action == ActionConst.RUN) || (this._actNow_ == ActionConst.RUN || action == ActionConst.WALK)) {
						this.mainActionData.currAction = action;
						if (this._currFrame_ >= this.mainActionData.totalFrames) {
							this._currFrame_ = 0;
						}
						renderType = AvatarRenderTypes.UN_PLAY_NEXT_RENDER;
					} else {
						this.mainActionData.currAction = action;
						this._currFrame_ = stopFrame != -1 ? stopFrame : 0;
					}
				} else {
					renderType = AvatarRenderTypes.NORMAL_RENDER;
				}
				if (action == ActionConst.DEATH) {
					this.mainActionData.stopFrame = this.mainActionData.totalFrames - 1;
				} else {
                    this.mainActionData.stopFrame = stopFrame;
				}
				this._actNow_ = this._actNext_ = action;
				this.onBodyRender(renderType);
			} else {
				this._actNext_ = action;
				this.mainActionData.stopFrame = stopFrame;
				this.onBodyRender(renderType);
			}
		}

		public onBodyRender(renderType:number=AvatarRenderTypes.NORMAL_RENDER) {
            var owner:IAvatar = AvatarUnitDisplay.takeUnitDisplay(this.oid);
            if (owner == null) {
                return;
            }
			if (this.mainActionData && this.mainActionData.isReady) {
				if (this._currFrame_ >= this.mainActionData.totalFrames) {
					if (egret.getTimer() - this._bodyRenderTime_ < this.mainActionData.currInterval) {
						return;
					}
					if (this._actNow_ == ActionConst.DEATH || this.mainActionData.stopFrame != -1) {
						this._currFrame_ = this.mainActionData.stopFrame;
					} else {
						this._currFrame_ = 0;
						if (this.isLoopAct(this._actNow_)) {
							if (this._actNow_ != this._actNext_) {
								this.play(this._actNext_, AvatarRenderTypes.PLAY_NEXT_RENDER);
							}
						} else {
							if (this._actNow_ == ActionConst.ATTACK || this._actNow_ == ActionConst.SKILL) {
								this.play(ActionConst.AttackWarm, AvatarRenderTypes.PLAY_NEXT_RENDER);
							} else {
								this.play(ActionConst.STAND, AvatarRenderTypes.PLAY_NEXT_RENDER);
							}
						}
						return;
					}
				}

				var durTime:number = this.mainActionData.currInterval;
				var passTime:number = egret.getTimer() - this._bodyRenderTime_;
				if (passTime  - durTime >= -1 || renderType) {
					this.bodyPartHash.forEach(actData => {
						if (actData.isReady) {
							actData.currAction = this._actNow_;
							actData.currDir = this._currDir_;
							actData.currFrame = this._currFrame_;
							var bmd:egret.Texture = actData.getBitmapData(this._currDir_, this._currFrame_);
							var tx:number = actData.getBitmapDataOffsetX(this._currDir_, this._currFrame_);
							var ty:number = actData.getBitmapDataOffsetY(this._currDir_, this._currFrame_);
							if (actData.type == AvatarTypes.EFFECT_TYPE) {
								owner.onBodyRender(AvatarRenderTypes.BODY_EFFECT, actData.type, bmd, tx, ty);
							} else {
								owner.onBodyRender(AvatarRenderTypes.BODY_TYPE, actData.type, bmd, tx, ty);
							}
						}
					});
                    if (this.renderFunc) {
                        this.renderFunc.apply(owner, null);
                    }
				}
				if (passTime - durTime >= 0 || renderType == AvatarRenderTypes.PLAY_NEXT_RENDER) {
					if (this.skillFrameFunc && this._currFrame_ == this.mainActionData.skillFrame && (this._actNow_ == ActionConst.ATTACK || this._actNow_ == ActionConst.SKILL)) {
						this.skillFrameFunc.apply(owner, null);
					}
					if (this.hitFrameFunc && this._currFrame_ == this.mainActionData.hitFrame) {
						this.hitFrameFunc.apply(owner, null);
					}
                    //console.log(this._actNow_+":"+this._currFrame_+"--"+durTime);    // 调试代码
					if (this._actNow_ != ActionConst.AttackWarm) {
						this._currFrame_++;
					}
					this._bodyRenderTime_ = egret.getTimer();
				}
			}
		}

		public onEffectRender(renderType:number=AvatarRenderTypes.NORMAL_RENDER) {

		}

		public get action():string {
			return this._actNow_;
		}

		public get dir():number {
			return this._currDir_;
		}
		public set dir(value:number) {
			if (this._currDir_ != value) {
				this._currDir_ = value;
				this.onBodyRender(AvatarRenderTypes.UN_PLAY_NEXT_RENDER);
			}
		}

		public get frame():number {
			return this._currFrame_;
		}

		public recover() {
			if (this.isDisposed) {
				return;
			}
			this.clear();
			if (AvatarUnit._recoverQueue_.length < AvatarUnit._recoverIndex_) {
				AvatarUnit._recoverQueue_.push(this);
			} else {
				this.dispose();
			}
		}

		public dispose() {
			this.isDisposed = true;
			super.dispose();
		}

		private isLoopAct(act:string):boolean {
			return ActionConst.LoopActions.indexOf(act) != -1;
		}

		private clear() {
			AvatarRenderManager.getInstance().removeUnit(this.id);
			AvatarUnit._instanceHash_.delete(this.id);
		}
	}
}