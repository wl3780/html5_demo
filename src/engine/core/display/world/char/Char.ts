module engine {
	export class Char extends egret.Sprite implements IChar {

		public runSpeed:number = 230;
		public walkSpeed:number = 100;

		public type:string;
		public layer:string;
		public char_id:string;
		public scene_id:string;

		public point:egret.Point;
		public enabled:boolean;
		public isDisposed:boolean;

		public moveEndFunc:Function;

		private _dir:number = DirConst.BOTTOM;
		private _speed_:number;
		private _movePath_:Array<egret.Point>;
		private _tarPoint_:egret.Point;
		private _loopMoveTime_:number;
		private _totalTime_:number;

		public constructor() {
			super();
			this.point = Engine.getPoint();
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
			this.setMoveSpeed();
			this._movePath_ = value;

			this._loopMoveTime_ = egret.getTimer();
			this._totalTime_ = 0;
		}

		public stopMove() {

		}

		public loopMove() {
			this._totalTime_ += egret.getTimer() - this._loopMoveTime_;
			if (this._tarPoint_ && this._totalTime_ > 0) {
				this._tarMove_();
			}
			this._loopMoveTime_ = egret.getTimer();
		}

		public stageIntersects():boolean {
			return true;
		}

		public onRender():void {
		}

		public dispose():void {
		}

		public toString():string {
			return null;
		}

		public get content():egret.DisplayObject {
			return this;
		}

		public set x(value:number) {
			this._setX(value);
			TileUtils.toPixelsCenter(this.x, this.y, this.point);
		}

		public set y(value:number) {
			this._setY(value);
			TileUtils.toPixelsCenter(this.x, this.y, this.point);
		}

		public get dir():number {
			return this._dir;
		}
		public set dir(value:number) {
			this._dir = value;
		}

		public setMoveSpeed() {
			if (this.dir == DirConst.TOP || this.dir == DirConst.BOTTOM) {
				this._speed_ = this.runSpeed / 2;
			} else {
				this._speed_ = this.runSpeed;
			}
		}

		protected _CharMoveEnd_():void {
			if (this.moveEndFunc != null) {
				this.moveEndFunc();
			}
		}

		protected _tarMove_() {
			var dis:number = egret.Point.distance(this.point, this._tarPoint_);
			var time:number = dis / this._speed_ * 1000;
			if (this._totalTime_ >= time) {
				this._totalTime_ -= time;
			} else {
				time = this._totalTime_;
				this._totalTime_ = 0;
			}
			if (time > 0) {
				var vs:number = this._speed_ * time / 1000;
				var vd:number = vs / dis;
				var p:egret.Point = egret.Point.interpolate(this._tarPoint_, this.point, vd);
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
				} else {
					this._tarPoint_ = null;
					this._CharMoveEnd_();
				}
			}
			if (this._totalTime_ > 0) {
				this._tarMove_();
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