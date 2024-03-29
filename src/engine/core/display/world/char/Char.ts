module engine {
	export class Char extends AvatarUnitDisplay implements IChar {

		private static shadowMale:AvatarUnit;
		private static shadowFemale:AvatarUnit;

		public runSpeed:number = 230;
		public walkSpeed:number = 100;

		public type:string;
		public sex:number = SexTypes.Male;
		public layer:string;
		public char_id:string;
		public scene_id:string;

		public point:egret.Point;
		public tilePoint:egret.Point;
		public enabled:boolean = false;
		public isDisposed:boolean = false;
		public isRunning:boolean = false;
        public isDeath:boolean = false;

		public moveEndFunc:Function;

		protected headShape:CharHead;
		protected shadowShape:CharShadow;

		private _speed_:number;
		private _movePath_:Array<egret.Point>;
		private _tarPoint_:egret.Point;
		private _loopMoveTime_:number;
		private _totalTime_:number;

		public constructor() {
			super();
			this.type = CharTypes.CHAR;
			this.point = Engine.getPoint();
			this.tilePoint = Engine.getPoint();

			this.headShape = CharHead.createCharHead();
			this.headShape.oid = this.id;
		}

		public moveTo(x:number, y:number) {
		}

		public moveToTile(index_x:number, index_y:number) {
		}

		public tarMoveTo(value:Array<egret.Point>) {
			if (!value || !value.length) {
				this._CharMoveEnd_();
				return;
			}
			this._tarPoint_ = value.shift();
			var dis:number = egret.Point.distance(this._tarPoint_, this.point);
			if (dis < TileConst.WH && value.length == 0) {
				this._CharMoveEnd_();
				return;
			}
			this.checkAndSetDir(true);
			this.changeMoveAction();
			this._movePath_ = value;

			this._loopMoveTime_ = egret.getTimer();
			this._totalTime_ = 0;
			this.isRunning = true;
		}

		public stopMove() {
			this.isRunning = false;
            if (this.action != ActionConst.STAND && this.action != ActionConst.DEATH && this.action.indexOf("warm") == -1) {
                this.play(ActionConst.STAND, AvatarRenderTypes.UN_PLAY_NEXT_RENDER);
            }
		}

		public loop() {
			if (this.headShape) {
				this.headShape.x = this.x >> 0;
				this.headShape.y = this.y - 100 >> 0;
			}
			if (this.shadowShape) {
				this.shadowShape.x = this.x;
				this.shadowShape.y = this.y;
			}
		}

		public loopMove() {
			this._totalTime_ += egret.getTimer() - this._loopMoveTime_;
			if (this._tarPoint_ && this._totalTime_ > 0) {
				this._tarMove_();
			}
			this._loopMoveTime_ = egret.getTimer();
		}

		public get content():egret.DisplayObject {
			return this;
		}

		public play(action:string, renderType:number=AvatarRenderTypes.NORMAL_RENDER, playEndFunc:Function=null, stopFrame:number=-1) {
			super.play(action, renderType, playEndFunc, stopFrame);
			if (this.shadowShape) {
				this.shadowShape.play(action, renderType, null, stopFrame);
			}
			this.setMoveSpeed();
		}

		public _setX(value:number) {
			super._setX(value);
			this.point.x = value;
			this.tilePoint.x = this.x / TileConst.TILE_WIDTH >> 0;
			Scene.isDepthChange = true;
		}

		public _setY(value:number) {
			super._setY(value);
			this.point.y = value;
			this.tilePoint.y = this.y / TileConst.TILE_HEIGHT >> 0;
			Scene.isDepthChange = true;
		}

		public showShadow() {
			if (this.shadowShape == null) {
				this.shadowShape = new CharShadow();
			}
			if (Char.shadowMale == null) {
				Char.shadowMale = new AvatarUnit();
				Char.shadowMale.init();
				AvatarRenderManager.getInstance().removeUnit(Char.shadowMale.id);
			}
			if (Char.shadowFemale == null) {
				Char.shadowFemale = new AvatarUnit();
				Char.shadowFemale.init();
				AvatarRenderManager.getInstance().removeUnit(Char.shadowFemale.id);
			}
			var idNum:string;
			if (this.sex == SexTypes.Male) {
				this.shadowShape.unit = Char.shadowMale;
				idNum = EngineGlobal.SHADOW_MALE;
			} else if (this.sex == SexTypes.Female) {
				this.shadowShape.unit = Char.shadowFemale;
				idNum = EngineGlobal.SHADOW_FEMALE;
			}
			this.shadowShape.loadAvatarPart(AvatarTypes.BODY_TYPE, idNum);
		}

		public set charName(value:string) {
			if (value) {
				this.headShape.nameVisible = true;
				this.headShape.charName = value;
				Scene.scene.topLayer.addChild(this.headShape);
			} else {
				this.headShape.nameVisible = false;
				if (this.headShape.parent) {
					this.headShape.parent.removeChild(this.headShape);
				}
			}
		}

		public setBlood(curr:number, max:number) {
    		if (this.isDeath) {
                this.headShape.bloodKitVisible = false;    
    		} else {
                this.headShape.bloodKitVisible = true;
    		}
			this.headShape.setBloodValue(curr, max);
		}

		public setNei(curr:number, max:number) {
            if(this.isDeath) {
                this.headShape.neiKitVisible = false;
            } else {
                this.headShape.neiKitVisible = true;
            }
			this.headShape.setNeiValue(curr, max);
		}

		public dispose() {
			super.dispose();
		}

		protected setup() {
			super.setup();
			this._unit_.renderFunc = this._renderHandler_;
			this._unit_.skillFrameFunc = this._skillFrameHandler_;
			this._unit_.hitFrameFunc = this._hitFrameHandler_;
		}

		protected _CharMoveEnd_() {
            this.stopMove();
			if (this.moveEndFunc != null) {
				this.moveEndFunc();
			}
		}

		protected _tarMove_() {
			var dis:number = egret.Point.distance(this.point, this._tarPoint_);
			var time:number = (dis / this._speed_) * 1000;
			if (this._totalTime_ >= time) {
				this._totalTime_ -= time;
			} else {
				time = this._totalTime_;
				this._totalTime_ = 0;
			}
			if (time > 0) {
				var subDis:number = this._speed_ * (time / 1000);
				var f:number = subDis / dis;
				var p:egret.Point = egret.Point.interpolate(this._tarPoint_, this.point, f);
				this.x = p.x;
				this.y = p.y;
				dis = egret.Point.distance(this.point, this._tarPoint_);
			}
			if (dis <= 0.5) {
				this.x = this._tarPoint_.x;
				this.y = this._tarPoint_.y;
				this._totalTime_ = 0;
				if (this._movePath_.length) {
					this._tarPoint_ = this._movePath_.shift();
                    this.checkAndSetDir(false);
					this.changeMoveAction();
				} else {
					this._tarPoint_ = null;
					this._CharMoveEnd_();
				}
			}
		}

		protected _renderHandler_() {
			if (this.shadowShape) {
				this.shadowShape.display(this._unit_.action, this._unit_.dir, this._unit_.frame);
			}
		}

		protected _skillFrameHandler_() {

		}

		protected _hitFrameHandler_() {

		}

		private changeMoveAction() {
			if (this._tarPoint_) {
				var dis:number = egret.Point.distance(this._tarPoint_, this.point);
				var pass:number;
				if (this.dir == DirConst.TOP || this.dir == DirConst.BOTTOM) {
					pass = TileConst.TILE_HEIGHT;
				} else {
					pass = TileConst.TILE_WIDTH;
				}
				if (dis < pass) {
					this.play(ActionConst.WALK);
				} else {
					this.play(ActionConst.RUN);
				}
			}
		}

		private setMoveSpeed() {
			if (this.action == ActionConst.WALK) {
				if (this.dir == DirConst.TOP || this.dir == DirConst.BOTTOM) {
					this._speed_ = this.walkSpeed / 2;
				} else {
					this._speed_ = this.walkSpeed;
				}
			} else if (this.action == ActionConst.RUN) {
				if (this.dir == DirConst.TOP || this.dir == DirConst.BOTTOM) {
					this._speed_ = this.runSpeed / 2;
				} else {
					this._speed_ = this.runSpeed;
				}
			}
		}

		private checkAndSetDir(force:boolean=false) {
			if (this._tarPoint_) {
				var tp_cur:egret.Point = TileUtils.pixelsToTile(this.point.x, this.point.y);
				var tp_tar:egret.Point = TileUtils.pixelsToTile(this._tarPoint_.x, this._tarPoint_.y);
				if (tp_cur.equals(tp_tar) == false || force) {
					this.dir = LinearUtils.getDirection(this.point.x, this.point.y, this._tarPoint_.x, this._tarPoint_.y);
				}
			}

		}

	}
}
