module engine {
	export class Tile {

		private static _tileHash_:Array<Tile> = new Array<Tile>();

		public type:number = 0;
		public initValue:number = 0;
		public color:number;
		public isSell:boolean = false;
		public isSafe:boolean = false;
		public isAlpha:boolean = false;
		public quoteIndex:number = 0;
		public charIndex:number = 0;
		public _pt_:egret.Point;

		private _x_:number = 0;
		private _y_:number = 0;
		private _key_:string;

		public constructor() {
			this._pt_ = new egret.Point();
		}

		public static createTile():Tile {
			if(Tile._tileHash_.length) {
				return Tile._tileHash_.pop();
			}
			return new Tile();
		}

		public setTileIndex(x:number, y:number) {
			TileUtils.pixelsToTile(x, y, this._pt_);
		}

		public setXY(x:number, y:number) {
			this._x_ = x;
			this._y_ = y;
			this._pt_.x = x;
			this._pt_.y = y;
			this._key_ = this._x_ + "|" + this._y_;
		}

		public set x(value:number) {
			this._x_ = value;
			this._pt_.x = value;
			this._key_ = this._x_ + "|" + this._y_;
		}

		public set y(value:number) {
			this._y_ = value;
			this._pt_.y = value;
			this._key_ = this._x_ + "|" + this._y_;
		}

		public get x():number {
			return this._x_;
		}

		public get y():number {
			return this._y_;
		}

		public get pt():egret.Point {
			return this._pt_;
		}

		public get key():string {
			return this._key_;
		}

		public dispose():void {
			Tile._tileHash_.push(this);
		}

	}
}
