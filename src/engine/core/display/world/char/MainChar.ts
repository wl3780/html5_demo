module engine {
	export class MainChar extends Char {

		public constructor() {
			super();
			this.type = CharTypes.MAIN_CHAR;
			this._unit_.priorLoadQueue = [ActionConst.STAND, ActionConst.WALK, ActionConst.RUN];
		}

	}
}

