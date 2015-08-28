module engine {
	export class WealthGroup extends Proto {

		public static instanceHash:Map<string, WealthGroup> = new Map<string, WealthGroup>();

		public type:number = 0;
		public loadedIndex:number = 0;

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

		public sortOn() {
			this._wealthList.sort((a, b) => {
				if (a.prio > b.prio) {
					return -1;
				} else {
					return 1;
				}
			});
		}

		public addWealth(url:string, data:any = null, otherArgs:any = null, prio:number = -1):string {
			if (this.hasWealth(url)) {
				return null;
			}

			var wealthData:WealthData = new WealthData();
			wealthData.url = url;
			wealthData.data = data;
			wealthData.proto = otherArgs;
			wealthData.oid = this.id;
			wealthData.wid = this.oid;
			if (prio == -1) {
				wealthData.prio = 0;
			}
			if (url.indexOf(EngineGlobal.SM_EXTENSION) != -1) {
				wealthData.prio = 0;
			}

			this._wealthHash.set(wealthData.id, wealthData);
			this._wealthList.push(wealthData);
			return wealthData.id;
		}

		public takeWealthById(id:string):WealthData {
			return this._wealthHash.get(id);
		}

		public hasWealth(url:string):boolean {
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
				wealthData.dispose();
			}
		}

		public getNextNeedWealthData():WealthData {
			this._wealthList.forEach(wealthData => {
				if(this.type == WealthConst.BUBBLE_LEVEL) {	// 顺序执行
					if(wealthData.isLoaded == false) {
						if (wealthData.isPended == false) {
							return wealthData;
						} else {
							return null;
						}
					}
				} else {
					if(wealthData.isLoaded == false && wealthData.isPended == false) {
						return wealthData;
					}
				}
			});
			return null;
		}

		public checkTotalFinish() {
			this.loadedIndex = 0;
			this._wealthList.forEach(wealthData => {
				if (wealthData.isLoaded == false) {
					this._loaded = false;
					return;
				} else {
					this.loadedIndex++;
				}
			});
		}

		public dispose() {
			WealthGroup.instanceHash.delete(this.id);
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
