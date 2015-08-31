module engine {
	export class WealthData extends Proto {

		private static instanceHash:Map<string, WealthData> = new Map<string, WealthData>();

		public data:any;
		public dataFormat:string = egret.URLLoaderDataFormat.TEXT;
		public isLoaded:boolean = false;
		public isPended:boolean = false;
		public isSucc:boolean = false;
		public time:number = 0;
		public prio:number = 5;

		protected _wid_:string;

		private _url:string;
		private _type:string;
		private _suffix:string;

		public constructor() {
			super();
			WealthData.instanceHash.set(this.id, this);
		}

		public static getWealthData(id:string):WealthData {
			return WealthData.instanceHash.get(id);
		}

		public static removeWealthData(id:string):boolean {
			return WealthData.instanceHash.delete(id);
		}

		public set wid(value:string) {
			this._wid_ = value;
		}
		public get wid():string {
			return this._wid_;
		}

		public get url():string {
			return this._url;
		}
		public set url(value:string) {
			this._url = value;
			if (value) {
                this._suffix = value.split("?")[0];
				this._suffix = this._suffix.split(".").pop();
				if (Engine.TEXT_Files.indexOf(this._suffix) != -1) {
					this._type = WealthConst.TXT_WEALTH;
					this.dataFormat = egret.URLLoaderDataFormat.TEXT;
				} else if (Engine.IMG_Files.indexOf(this._suffix) != -1) {
					this._type = WealthConst.IMG_WEALTH;
					this.dataFormat = egret.URLLoaderDataFormat.TEXTURE;
				} else {
					this._type = WealthConst.BING_WEALTH;
					this.dataFormat = egret.URLLoaderDataFormat.BINARY;
				}
			}
			this.time = egret.getTimer();
		}

		public get type():string {
			return this._type;
		}

		public get suffix():string {
			return this._suffix;
		}

		public dispose() {
			WealthData.removeWealthData(this.id);
			this._wid_ = null;
			this._suffix = null;
			this._type = null;
			super.dispose();
		}

	}
}
