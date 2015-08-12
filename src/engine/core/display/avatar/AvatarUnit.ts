module engine {
	export class AvatarUnit extends Proto {

		private static _instanceHash_:Map<string, AvatarUnit> = new Map<string, AvatarUnit>();
		private static _recoverQueue_:Array<AvatarUnit> = [];
		private static _recoverIndex_:number = 50;

		public isDisposed:boolean;

		public constructor() {
			super();
			AvatarUnit._instanceHash_.set(this.id, this);
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

		public loadAvatarPart(type:string, idName:string) {

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

		private clear() {
			AvatarUnit._instanceHash_.delete(this.id);
		}
	}
}