module engine {
	export class WealthGroup extends Proto {

		public static instanceHash:Map<string, WealthGroup> = new Map<string, WealthGroup>();

		private static _recoverQueue_:Array<WealthGroup> = [];
		private static _recoverIndex_:number = 10;

		public type:number = 0;
		public loadedIndex:number = 0;

		protected _isDisposed_:boolean = false;

		private _wealthHash:Map<string, WealthData>;
		private _wealthList:Array<WealthData>;
		private _loaded:boolean = false;

		public constructor() {
			super();
			WealthGroup.instanceHash.set(this.id, this);
			this.type = WealthConst.PRIORITY_LEVEL;
			this._wealthHash = new Map<string, WealthData>();
			this._wealthList = [];
		}

		public static createWealthGroup():WealthGroup {
			var group:WealthGroup = null;
			if (WealthGroup._recoverQueue_.length) {
				group = WealthGroup._recoverQueue_.pop();
				WealthGroup.instanceHash.set(group.id, group);
			} else {
				group = new WealthGroup();
			}
			return group;
		}

		public get wealthHash():Array<any>
		{
			return this._wealthList;
		}

		public sortOn() {
			this._wealthList.sort((a, b) => {
				if (a.prio > b.prio) {
					return -1;
				} else {
					return 1;
				}
			});
		}

		public get loaded():boolean {
			return this._loaded;
		}

		public addWealth(url:string, data:any = null, dataFormat:string = null, otherArgs:any = null, prio:number = -1):string {
			var wealthData:WealthData = new WealthData();
			wealthData.url = url;
			wealthData.data = data;
			wealthData.proto = otherArgs;
			wealthData.oid = this.id;
			wealthData.wid = this.oid;
			if (prio != -1) {
				wealthData.prio = 0;
			}
			if (url.indexOf(EngineGlobal.SM_EXTENSION) != -1) {
				wealthData.prio = 0;
			}
			if (dataFormat) {
				wealthData.dataFormat = dataFormat;
			} else {
				if (wealthData.type == WealthConst.BING_WEALTH) {
					if (Engine.TEXT_Files.indexOf(wealthData.suffix) != -1) {
						wealthData.dataFormat = egret.URLLoaderDataFormat.TEXT;
					} else {
						wealthData.dataFormat = egret.URLLoaderDataFormat.BINARY;
					}
				}
			}
			this._wealthHash.set(wealthData.id, wealthData);
			this._wealthList.push(wealthData);
			return wealthData.id;
		}

		public takeWealthById(id:string):WealthData {
			return this._wealthHash.get(id);
		}

		public hashWealth(url:string):boolean {
			this._wealthList.forEach(item => {
				if (item.url == url) {
					return true;
				}
			});
			return false;
		}

		public removeWealthById(id:string) {
			var wealthData:WealthData = this._wealthHash.get(id);
			if (wealthData) {
				this._wealthHash.delete(id);
				var index:number = this._wealthList.indexOf(wealthData);
				this._wealthList.splice(index, 1);
				WealthElisor.getInstance().cancelWealth(wealthData.id);
			}
		}

		public recover() {
			if(this._isDisposed_) {
				return ;
			}
			WealthGroup.instanceHash.delete(this.id);
			if (WealthGroup._recoverQueue_.length <= WealthGroup._recoverIndex_) {
				WealthGroup._recoverQueue_.push(this);
				this._wealthList.length = 0;
				this._wealthHash.clear();
				this._loaded = false;
			} else {
				this.dispose();
			}
		}

		public dispose() {
			this._wealthHash = null;
			this._wealthList = null;
			this._isDisposed_ = true;
			super.dispose();
		}

		public getNextNeedWealthData():WealthData
		{
			for(var wealthData_key_a in this._wealthList)
			{
				var wealthData:WealthData = this._wealthList[wealthData_key_a];
				if(this.type == WealthConst.BUBBLE_LEVEL)
				{
					if(wealthData.isLoaded == false && wealthData.isPended == false)
					{
						return wealthData;
					}
					if(wealthData.isLoaded == false && wealthData.isPended)
					{
						return null;
					}
				}
				else
				{
					if(wealthData.isLoaded == false && wealthData.isPended == false)
					{
						return wealthData;
					}
				}
			}
			return null;
		}

		public checkTotalFinish()
		{
			var wealthData:WealthData = null;
			var wealthLen:number = this._wealthHash.getItem("length");
			var loadedCount:number = 0;
			var index:number = 0;
			while(index < wealthLen)
			{
				wealthData = this._wealthList[index];
				if(wealthData)
				{
					if(!wealthData.isLoaded)
					{
						this._loaded = false;
						break;
					}
					else
					{
						loadedCount++;
					}
				}
				index++;
			}
			this.loadedIndex = loadedCount;
			if(loadedCount >= wealthLen)
			{
				this._loaded = true;
			}
		}

		public get length():number
		{
			return this._wealthList.length;
		}

	}
}
