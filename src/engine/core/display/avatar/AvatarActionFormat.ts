module engine {
	export class AvatarActionFormat extends Proto {

		private static _instanceHash_:Map<string, AvatarActionFormat> = new Map<string, AvatarActionFormat>();
		private static _recoverQueue_:Array<AvatarActionFormat> = [];
		private static _recoverIndex_:number = 50;

		public idName:string;
		public offset_x:number = 0;
		public offset_y:number = 0;
		public actionName:string;
		public totalFrames:number = 0;
		public actionSpeed:number = 0;
		public replay:number = -1;
		public skillFrame:number = 0;
		public hitFrame:number = 0;
		public totalDir:number = 0;
		public totalTime:number = 0;
		public isDisposed:boolean = false;

		public intervalTimes:Array<number>;
		public txs:Array<Array<number>>;
		public tys:Array<Array<number>>;
		public widths:Array<Array<number>>;
		public heights:Array<Array<number>>;
		public bitmapdatas:Array<Array<string>>;
		public max_rects:Array<Array<number>>;
		public dirOffsetX:Array<number>;
		public dirOffsetY:Array<number>;

		public constructor() {
			super();
			AvatarActionFormat._instanceHash_.set(this.id, this);
		}

		public static createAvatarActionFormat():AvatarActionFormat {
			var result:AvatarActionFormat = null;
			if(AvatarActionFormat._recoverQueue_.length) {
				result = AvatarActionFormat._recoverQueue_.pop();
				result._id_ = Engine.getSoleId();
				AvatarActionFormat._instanceHash_.set(result.id, result);
			} else {
				result = new AvatarActionFormat();
			}
			result.init();
			return result;
		}

		public static takeAvatarActionFormat(id:string):AvatarActionFormat {
			return AvatarActionFormat._instanceHash_.get(id);
		}

		public static removeAvatarActionFormat(id:string) {
			AvatarActionFormat._instanceHash_.delete(id);
		}

		public init() {
			this.offset_x = 0;
			this.offset_y = 0;
			this.actionName = "";
			this.totalFrames = 0;
			this.actionSpeed = 0;
			this.replay = -1;
			this.skillFrame = 0;
			this.hitFrame = 0;
			this.totalDir = 0;
			this.intervalTimes = [];
			this.txs = [];
			this.tys = [];
			this.widths = [];
			this.heights = [];
			this.bitmapdatas = [];
			this.max_rects = [];
			this.dirOffsetX = [0,0,0,0,0,0,0,0];
			this.dirOffsetY = [0,0,0,0,0,0,0,0];
		}

		public recover() {
			if(this.isDisposed) {
				return ;
			}
			AvatarActionFormat._instanceHash_.delete(this.id);
			if(AvatarActionFormat._recoverQueue_.length < AvatarActionFormat._recoverIndex_) {
				AvatarActionFormat._recoverQueue_.push(this);
			} else {
				this.dispose();
			}
		}

		public dispose() {
			super.dispose();
			this.isDisposed = true;
		}

		public getLink(dir:number, frame:number):string {
			var key:string = this.idName + Engine.LINE + this.actionName + Engine.LINE + dir + Engine.LINE + frame;
			if (this.totalDir == 1) {
				key = this.idName + Engine.LINE + this.actionName + Engine.LINE + 0 + Engine.LINE + frame;
			}
			return key;
		}

	}
}