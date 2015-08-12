module engine {
	export class AvatarDataFormatGroup extends Proto {

		public static _instanceHash_:Map<string, AvatarDataFormatGroup> = new Map<string, AvatarDataFormatGroup>();
		public static _recoverQueue_:Array<AvatarDataFormatGroup> = [];
		public static _recoverIndex_:number = 50;

		public isCreateWarn:boolean = true;
		public owner:string;
		public type:string;
		public isLoaded:boolean = false;
		public isPend:boolean = false;
		public isDisposed:boolean = false;
		public quoteQueue:Array<string>;
		public idName:string;
		public wealth_path:string;
		public wealth_id:string;

		private actionGroup:Map<string, AvatarDataFormat>;

		public constructor() {
			super();
			this.actionGroup = new Map<string, AvatarDataFormat>();
			this.quoteQueue = [];
			AvatarDataFormatGroup._instanceHash_.set(this.id, this);
		}

		public static createAvatarActionDataGroup():AvatarDataFormatGroup {
			if (AvatarDataFormatGroup._recoverQueue_.length) {
				var result:AvatarDataFormatGroup = AvatarDataFormatGroup._recoverQueue_.pop();
				result._id_ = Engine.getSoleId();
				AvatarDataFormatGroup._instanceHash_.set(result.id, result);
			} else {
				return new AvatarDataFormatGroup();
			}
		}

		public static takeAvatarDataFormatGroup(id:string):AvatarDataFormatGroup {
			return AvatarDataFormatGroup._instanceHash_.get(id);
		}

		public static removeAvatarDataFormatGroup(id:string) {
			AvatarDataFormatGroup._instanceHash_.delete(id);
		}

		public addAction(action:string, dataFormat:AvatarDataFormat) {
			this.actionGroup.set(action, dataFormat);
		}

		public takeAction(action:string):AvatarDataFormat {
			return this.actionGroup.get(action);
		}

		public removeAction(action:string) {
			this.actionGroup.delete(action);
		}

		public hasAction(action:string):boolean {
			return this.actionGroup.has(action);
		}

		public noticeAvatarActionData() {
			if (this.isLoaded) {
				var data:AvatarActionData = null;
				this.quoteQueue.forEach(id => {
					data = AvatarActionData.takeAvatarActionData(id);
					if(data) {
						data.onSetupReady();
					}
				});
				this.quoteQueue.length = 0;
			}
		}

		public recover() {
			if (this.isDisposed) {
				return ;
			}
			AvatarDataFormatGroup._instanceHash_.delete(this.id);
			if (AvatarDataFormatGroup._recoverQueue_.length < AvatarDataFormatGroup._recoverIndex_) {
				AvatarDataFormatGroup._recoverQueue_.push(this);
			} else {
				this.dispose();
			}
		}

		public dispose() {
			super.dispose();
			this.isDisposed = true;
		}

	}
}
