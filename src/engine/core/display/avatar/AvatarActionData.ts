module engine {

	export class AvatarActionData extends Proto {

		public static _instanceHash_:Map<string, AvatarActionData>;
		public static _recoverQueue_:Array<AvatarActionData> = [];
		public static _recoverIndex_:number = 50;

		public type:string;
		public idName:string;
		public isDisposed:Boolean = false;

		private _avatarDataFormatGroup_id_:string;

		private _actionGroup_:AvatarDataFormatGroup;
		private _actionFormat_:AvatarDataFormat;

		public constructor() {
			super();
			AvatarActionData._instanceHash_.set(this.id, this);
		}

		public static createAvatarActionData():AvatarActionData {
			if (AvatarActionData._recoverQueue_.length) {
				var result:AvatarActionData = AvatarActionData._recoverQueue_.pop();
				result._id_ = Engine.getSoleId();
				AvatarActionData._instanceHash_.set(result.id, result);
			} else {
				return new AvatarActionData();
			}
		}

		public static takeAvatarActionData(id:string):AvatarActionData {
			return AvatarActionData._instanceHash_.get(id);
		}

		public static removeAvatarActionData(id:string) {
			AvatarActionData._instanceHash_.delete(id);
		}

		public onSetupReady() {

		}

		public get avatarDataFormatGroup_id():String {
			return this._avatarDataFormatGroup_id_;
		}
		public set avatarDataFormatGroup_id(value:String) {
			this._avatarDataFormatGroup_id_ = value;
			this._actionGroup_ = AvatarDataFormatGroup.takeAvatarDataFormatGroup(value);
		}

		public recover() {
			if (this.isDisposed) {
				return;
			}
			AvatarActionData._instanceHash_.delete(this.id);
			if (AvatarActionData._recoverQueue_.length < AvatarActionData._recoverIndex_) {
				AvatarActionData._recoverQueue_.push(this);
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