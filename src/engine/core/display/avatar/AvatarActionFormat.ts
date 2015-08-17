module engine {
	export class AvatarActionFormat extends Proto {

		public static _instanceHash_:Map<string, AvatarActionFormat> = new Map<string, AvatarActionFormat>();
		public static _recoverQueue_:Array<AvatarActionFormat> = [];
		public static _recoverIndex_:number = 50;

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
		public path:string;

		public intervalTimes:Array<number>;
		public txs:Array<Array<number>>;
		public tys:Array<Array<number>>;
		public widths:Array<Array<number>>;
		public heights:Array<Array<number>>;
		public bitmapdatas:Array<Array<string>>;
		public max_rects:Array<Array<number>>;
		public dirOffsetX:Array<number>;
		public dirOffsetY:Array<number>;

		private actState:any;

		public bitmapFlips:Array<boolean>;

		public constructor() {
			super();
			this.actState = {};
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

		public resetActReady() {
			this.actState = {};
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
            this.bitmapFlips = new Array(8);
		}

		public recover() {
			if(this.isDisposed) {
				return ;
			}
			AvatarActionFormat._instanceHash_.delete(this.id);
			if(AvatarActionFormat._recoverQueue_.length <= AvatarActionFormat._recoverIndex_) {
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
			if (this.bitmapFlips[dir] == true) {
				dir = 8-dir;
			}
			var key:string = this.idName + Engine.LINE + this.actionName + Engine.LINE + dir + Engine.LINE + frame;
			if (this.totalDir == 1) {
				key = this.idName + Engine.LINE + this.actionName + Engine.LINE + 0 + Engine.LINE + frame;
			}
			return key;
		}

		public setup(actGroup:AvatarActionFormatGroup, config:any) {
			this.oid = actGroup.id;
			this.idName = actGroup.idName;
			this.actionName = config.id;
			this.totalFrames = config.frames;
			this.actionSpeed = config.speed;
			this.offset_x = config.offset_x;
			this.offset_y = config.offset_y;
			this.replay = config.replay;
			if (this.replay == 0) {
				this.replay = -1;
			}

			var dirList:Array<any> = config.action;
			var dirLen:number = dirList.length;
			var dirIdx:number = 0;
			var frameData:any;
			this.totalDir = dirLen;
			if (dirLen == 1) {
				frameData = dirList[0];
				this.initFrameData(0, frameData.action);
				while (dirIdx < 8) {
					this.txs[dirIdx] = this.txs[0];
					this.tys[dirIdx] = this.txs[0];
					this.widths[dirIdx] = this.txs[0];
					this.heights[dirIdx] = this.txs[0];
					this.bitmapFlips[dirIdx] = false;
					dirIdx++;
				}
			} else {
				while (dirIdx < 8) {
					if (dirIdx < dirLen) {
						frameData = dirList[dirIdx];
						this.initFrameData(dirIdx, frameData.action);
						this.bitmapFlips[dirIdx] = false;
					} else {
						this.txs[dirIdx] = [];
						var flipDirIdx:number = 8 - dirIdx;
						var flipFrameIdx:number = 0;
						while (flipFrameIdx < this.widths[flipDirIdx].length) {
							var flipFrameX:number = this.widths[flipDirIdx][flipFrameIdx]*0 - this.txs[flipDirIdx][flipFrameIdx];
							this.txs[dirIdx].push(flipFrameX);
							flipFrameIdx++;
						}
						this.tys[dirIdx] = this.tys[flipDirIdx];
						this.widths[dirIdx] = this.tys[flipDirIdx];
						this.heights[dirIdx] = this.heights[flipDirIdx];
						this.bitmapFlips[dirIdx] = true;
					}
					dirIdx++;
				}
			}
		}
		private initFrameData(dirIdx:number, frameDatas:Array<any>):void {
			this.txs[dirIdx] = [];
			this.tys[dirIdx] = [];
			this.widths[dirIdx] = [];
			this.heights[dirIdx] = [];

			var frameLen:number = frameDatas.length;
			if (frameLen > this.totalFrames) {
				this.totalFrames = frameLen;
			}
			var frameIdx:number = 0;
			while (frameIdx < frameLen) {
				this.txs[dirIdx].push(<number>frameDatas[frameIdx].tx);
				this.tys[dirIdx].push(<number>frameDatas[frameIdx].ty);
				this.widths[dirIdx].push(<number>frameDatas[frameIdx].width);
				this.heights[dirIdx].push(<number>frameDatas[frameIdx].height);
				frameIdx++;
			}
		}
	}
}