module engine {
	export class TileAstarData extends egret.HashObject {

		public key:string;
		public pt:egret.Point;
		public G:number = 0;
		public F:number = 0;
		public parent:TileAstarData;

		public constructor(g:number, f:number, pt:egret.Point) {
			super();
			this.G = g;
			this.F = f;
			if(pt) {
				this.key = pt.x + "|" + pt.y;
			}
			this.pt = pt;
		}

	}
}

