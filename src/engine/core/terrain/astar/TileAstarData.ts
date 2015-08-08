module engine {
	export class TileAstarData extends egret.HashObject {

		private static _recoverList_:Array<TileAstarData> = [];

		public key:string;
		public pt:egret.Point;
		public G:number = 0;
		public F:number = 0;
		public parent:TileAstarData;

		public constructor() {
			super();
		}

		public dispose() {
			if (TileAstarData._recoverList_.indexOf(this) != -1) {
				TileAstarData._recoverList_.push(this);
			}
		}

		private setup(g:number, f:number, pt:egret.Point) {
			this.G = g;
			this.F = f;
			if(pt) {
				this.key = pt.x + "|" + pt.y;
			}
			this.pt = pt;
		}

		public static create(g:number, f:number, pt:egret.Point):TileAstarData {
			var ret:TileAstarData;
			if (TileAstarData._recoverList_.length) {
				ret = TileAstarData._recoverList_.pop();
			} else {
				ret = new engine.TileAstarData();
			}
			ret.setup(g, f, pt);
			return ret;
		}

	}
}

