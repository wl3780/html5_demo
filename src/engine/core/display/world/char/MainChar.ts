module engine {
	export class MainChar extends Char {

		public constructor() {
			super();
			this.graphics.beginFill(0xCCCC00);
			this.graphics.drawCircle(0, 0, 20);
			this.graphics.endFill();
		}

	}
}

