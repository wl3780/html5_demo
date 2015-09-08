module engine {
	export class WealthGroup extends Proto {

		private static _instanceHash_:Map<string, WealthGroup> = new Map<string, WealthGroup>();

		public type:number = 0;
		public loadedIndex:number = 0;

		private _wealthHash:Map<string, WealthData>;
		private _wealthList:Array<WealthData>;
		private _loaded:boolean = false;

		public constructor() {
			super();
			WealthGroup._instanceHash_.set(this.id, this);
			this.type = WealthConst.PRIORITY_LEVEL;
			this._wealthHash = new Map<string, WealthData>();
			this._wealthList = [];
		}

		public sortOn() {
			this._wealthList.sort((a, b) => {
				if (a.prio > b.prio) {
					return -1;
				} else if (a.prio == b.prio) {
    				if (a.time < b.time) {
                        return -1;
    				} else {
						return 1;
					}
				} else {
					return 1;
				}
			});
		}

		public addWealth(url:string, data:any = null, prio:number = -1):string {
			var wealthData:WealthData = this.takeWealthByPath(url);
			if (wealthData) {
				wealthData.prio++;	// 多次请求提高优先级
				return wealthData.id;
			}

			wealthData = new WealthData();
			wealthData.url = url;
			wealthData.data = data;
			wealthData.oid = this.id;
			wealthData.wid = this.oid;
			wealthData.prio = prio;
			if (url.indexOf(EngineGlobal.SM_EXTENSION) != -1) {
				wealthData.prio = 10;
			}

			this._wealthHash.set(wealthData.id, wealthData);
			this._wealthList.push(wealthData);
			return wealthData.id;
		}

		public takeWealthById(id:string):WealthData {
			return this._wealthHash.get(id);
		}

		public takeWealthByPath(url:string):WealthData {
			var ret:WealthData = null;
			for (var k in this._wealthList) {
				ret = this._wealthList[k];
				if (ret && ret.url == url) {
					return ret;
				}
			}
			return null;
		}

		public hasWealth(url:string):boolean {
			return this.takeWealthByPath(url) != null;
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

		public getNextNeedWealthData():WealthData {
			var ret:WealthData = null;
			for (var k in this._wealthList) {
				ret = this._wealthList[k];
				if (this.type == WealthConst.BUBBLE_LEVEL) {	// 顺序执行
					if(ret.isLoaded == false) {
						if (ret.isPended == false) {
							return ret;
						} else {
							return null;
						}
					}
				} else {
					if(ret.isLoaded == false && ret.isPended == false) {
						return ret;
					}
				}
			}
			return null;
		}

		public checkTotalFinish() {
			this.loadedIndex = 0;
			var wealthData:WealthData = null;
			for (var k in this._wealthList) {
				wealthData = this._wealthList[k];
				if (wealthData.isLoaded == false) {
					this._loaded = false;
					break;
				} else {
					this.loadedIndex++;
				}
			}
		}

		public dispose() {
			WealthGroup._instanceHash_.delete(this.id);
			this._wealthHash.clear();
			this._wealthHash = null;
			this._wealthList.length = 0;
			this._wealthList = null;
			this._loaded = false;
			super.dispose();
		}

		public get wealthHash():Array<WealthData> {
			return this._wealthList;
		}

		public get length():number {
			return this._wealthList.length;
		}

		public get loaded():boolean {
			return this._loaded;
		}

	}
}
