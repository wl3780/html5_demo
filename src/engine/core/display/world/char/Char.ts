module engine {
	export class Char extends AvatarUnitDisplay implements IChar {

		public runSpeed:number = 230;
		public walkSpeed:number = 100;

		public type:string;
		public layer:string;
		public char_id:string;
		public scene_id:string;

		public point:egret.Point;
		public tilePoint:egret.Point;
		public enabled:boolean = false;
		public isDisposed:boolean = false;
		public isRuning:boolean = false;

		public moveEndFunc:Function;

		private _speed_:number;
		private _movePath_:Array<egret.Point>;
		private _tarPoint_:egret.Point;
		private _loopMoveTime_:number;
		private _totalTime_:number;

		public constructor() {
			super();
			this.point = Engine.getPoint();
			this.tilePoint = Engine.getPoint();
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
			if (dis <= TileConst.WH && value.length == 0) {
				this._CharMoveEnd_();
				return;
			}
			this.checkAndSetDir(true);
			this.changeMoveAction();
			this._movePath_ = value;

			this._loopMoveTime_ = egret.getTimer();
			this._totalTime_ = 0;
			this.isRuning = true;
		}

		public stopMove() {
			this.isRuning = false;
            if (this.action != ActionConst.STAND && this.action != ActionConst.DEATH && this.action.indexOf("warm") == -1) {
                this.play(ActionConst.STAND, AvatarRenderTypes.UN_PLAY_NEXT_RENDER);
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

		public dispose() {
			super.dispose();
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

		private changeMoveAction() {
			if (this._tarPoint_) {
				var dis:number = egret.Point.distance(this._tarPoint_, this.point);
				var pass:number;
				if (this.dir == DirConst.TOP || this.dir == DirConst.BOTTOM) {
					pass = TileConst.TILE_HEIGHT * 2;
				} else {
					pass = TileConst.TILE_WIDTH * 2;
				}
				if (dis < pass) {
					this.play(ActionConst.WALK);
				} else {
					this.play(ActionConst.RUN);
				}
			}
		}

		private setMoveSpeed() {
			if (this.dir == DirConst.TOP || this.dir == DirConst.BOTTOM) {
				this._speed_ = this.runSpeed / 2;
			} else {
				this._speed_ = this.runSpeed;
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
