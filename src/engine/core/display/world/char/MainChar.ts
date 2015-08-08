module engine {
	export class MainChar extends egret.Sprite {

		public constructor() {
			super();
			this.graphics.beginFill(0xCCCC00);
			this.graphics.drawCircle(0, 0, 20);
			this.graphics.endFill();
		}

		public get dir():number {
			return DirConst.BOTTOM;
		}

	}
}

