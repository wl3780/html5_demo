module engine {
	export class AvatarActionFormatGroup extends Proto {

		public static _instanceHash_:Map<string, AvatarActionFormatGroup> = new Map<string, AvatarActionFormatGroup>();
		public static _recoverQueue_:Array<AvatarActionFormatGroup> = [];
		public static _recoverIndex_:number = 50;

		public isCreateWarn:boolean = true;
		public owner:string;
		public type:string;
		public isLoaded:boolean = false;	// 加载成功
		public isPended:boolean = false;	// 加载中
		public isDisposed:boolean = false;
		public quoteQueue:Array<string>;
		public idName:string;
		public wealth_path:string;
		public wealth_id:string;

		private actionGroup:Map<string, AvatarActionFormat>;

		public constructor() {
			super();
			this.actionGroup = new Map<string, AvatarActionFormat>();
			this.quoteQueue = [];
			AvatarActionFormatGroup._instanceHash_.set(this.id, this);
		}

		public static createAvatarActionFormatGroup():AvatarActionFormatGroup {
			if (AvatarActionFormatGroup._recoverQueue_.length) {
				var result:AvatarActionFormatGroup = AvatarActionFormatGroup._recoverQueue_.pop();
				result._id_ = Engine.getSoleId();
				AvatarActionFormatGroup._instanceHash_.set(result.id, result);
			} else {
				return new AvatarActionFormatGroup();
			}
		}

		public static takeAvatarActionFormatGroup(id:string):AvatarActionFormatGroup {
			return AvatarActionFormatGroup._instanceHash_.get(id);
		}

		public static removeAvatarActionFormatGroup(id:string) {
			AvatarActionFormatGroup._instanceHash_.delete(id);
		}

		public addAction(action:string, dataFormat:AvatarActionFormat) {
			this.actionGroup.set(action, dataFormat);
		}

		public takeAction(action:string):AvatarActionFormat {
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
			AvatarActionFormatGroup._instanceHash_.delete(this.id);
			if (AvatarActionFormatGroup._recoverQueue_.length < AvatarActionFormatGroup._recoverIndex_) {
				AvatarActionFormatGroup._recoverQueue_.push(this);
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
