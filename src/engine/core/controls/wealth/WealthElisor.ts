module engine {
	export class WealthElisor extends egret.HashObject {

		public static instanceHash:Map<string, IWealthQueue> = new Map<string, IWealthQueue>();

		private static _instance:WealthElisor;

		private wealthHash:Map<string, Sign>;

		public constructor() {
			super();
			this.wealthHash = new Map<string, Sign>();
		}

		public static getInstance():WealthElisor {
			if (WealthElisor._instance == null) {
				WealthElisor._instance = new WealthElisor();
			}
			return WealthElisor._instance;
		}

		public static removeSign(path:string) {
			var dict:Map<string, Sign> = WealthElisor._instance.wealthHash;
			var sign:Sign = dict.get(path);
			if (sign) {
				sign.dispose();
			}
			dict.delete(path);
		}

		public static clear(unHash:any) {
			var file:string = null;
			var sign:Sign = null;
			var dict:Map<string, Sign> = WealthElisor._instance.wealthHash;
			for (var path in dict) {
				file = path.split("/").pop();
				file = file.split("?")[0];
				if (unHash[file]) {
					sign = dict.get(path);
					sign.dispose();
					dict.delete(path);
				}
			}
		}

		public loadWealth(wealthData:WealthData) {
			var url:string = wealthData.url;
			var owner:string = wealthData.id;
			var sign:Sign = this.wealthHash.get(url);
			if (sign == null) {
				sign = new Sign();
				sign.path = url;
				this.wealthHash.set(url, sign);
			}
			if (sign.wealths.indexOf(owner) == -1) {
				sign.wealths.push(owner);
			}
			if (!sign.isLoaded && !sign.isPended) {
				sign.isPended = true;
				sign.wealth_id = owner;
				var loader:ILoader = new WealthLoader();
				loader.dataFormat = wealthData.dataFormat;
				loader.loadElemt(wealthData.url, this._callSuccess_, this._callError_, this._callProgress_, this);
				this.updateWealthState(sign.wealths, "isPended", sign.isPended);
			} else if (!sign.isLoaded && sign.isPended) {
				this.updateWealthState(sign.wealths, "isPended", sign.isPended);
			} else if (sign.isLoaded) {
				this.updateWealthState(sign.wealths, "isLoaded", sign.isLoaded);
			}
		}

		private updateWealthState(wealths:Array<string>, proto:string, value:boolean) {
			var wealthData:WealthData = null;
			var wealthQueue:IWealthQueue = null;
			wealths.forEach(wealth_id => {
				wealthData = WealthData.getWealthData(wealth_id);
				if (wealthData) {
					wealthQueue = WealthElisor.instanceHash.get(wealthData.wid);
					if (wealthQueue) {
						if ("isPended" == proto) {
							wealthData.isPended = value;
							wealthQueue.setStateLimitIndex(true);
						} else if ("isLoaded" == proto) {
							wealthData.isLoaded = value;
							if (wealthData.isLoaded) {
								wealthQueue["_callSuccess_"](wealthData.id);
							}
						}
					}
				}
			});
		}

		protected _callSuccess_(path:string) {
			var sign:Sign = this.wealthHash.get(path);
			if (sign) {
				sign.isLoaded = true;
				this.update(path, 1);
			}
		}

		protected _callError_(path:string) {
			var sign:Sign = this.wealthHash.get(path);
			if (sign) {
				console.error("加载失败：", sign.path);
				var wealthData:WealthData = WealthData.getWealthData(sign.wealth_id);
				if (wealthData && sign.tryNum > 0) {
					// 重新加载，恢复加载剩余次数
					var wealthQueue:IWealthQueue = WealthElisor.instanceHash.get(wealthData.wid);
					wealthQueue.setStateLimitIndex(false);

					WealthStoragePort.disposeLoaderByWealth(sign.path);
					sign.tryNum -= 1;
					sign.isPended = false;
					this.loadWealth(wealthData);
				} else {
					sign.isLoaded = true;
					this.update(path, 0);
				}
			}
		}

		protected _callProgress_(path:string, bytesLoaded:number, bytesTotal:number) {
			var sign:Sign = this.wealthHash.get(path);
			if (sign) {
				sign.isPended = true;
				this.update(path, 2, bytesLoaded, bytesTotal);
			}
		}

		public update(url:string, state:number, bytesLoaded:number = 0, bytesTotal:number = 0) {
			var sign:Sign = this.wealthHash.get(url);
			if (!sign) {
				return;
			}
			var wealthData:WealthData = null;
			var wealthQueue:any = null;
			if (state == 0 || state == 1) {
				while (sign.wealths.length) {
					wealthData = WealthData.getWealthData(sign.wealths.shift());
					if (wealthData && wealthData.isLoaded == false && Engine.enabled) {
						wealthQueue = WealthElisor.instanceHash.get(wealthData.wid);
						if (wealthQueue) {
							if (state == 0) {
								wealthQueue["_callError_"](wealthData.id);
							} else if (state == 1) {
								wealthQueue["_callSuccess_"](wealthData.id);
							}
						}
					}
				}
			} else {
				sign.wealths.forEach(wealthId => {
					wealthData = WealthData.getWealthData(wealthId);
					if (wealthData) {
						wealthQueue = WealthElisor.instanceHash.get(wealthData.wid);
						if (wealthQueue && wealthQueue.name != WealthConst.AVATAR_REQUEST_WEALTH) {
							wealthQueue["_callProgress_"](wealthData.id, bytesLoaded, bytesTotal);
						}
					}
				});
			}
		}

		public checkWealthPendSatte(url:string):boolean {
			var sign:Sign = this.wealthHash.get(url);
			if (sign) {
				return sign.isPended;
			}
			return false;
		}

		public checkWealthHasCache(url:string):boolean {
			var sign:Sign = this.wealthHash.get(url);
			if (sign) {
				return sign.isLoaded;
			}
			return false;
		}

		public cancelWealth(wealth_id:string) {
			var wealthData:WealthData = WealthData.getWealthData(wealth_id);
			if (wealthData) {
				var url:string = wealthData.url;
				var sign:Sign = this.wealthHash.get(url);
				if (sign) {
					var index:number = sign.wealths.indexOf(wealth_id);
					if (index != -1) {
						sign.wealths.splice(index, 1);
						if (sign.isPended && !sign.isLoaded && sign.wealths.length == 0) {
							WealthStoragePort.disposeLoaderByWealth(url);
						}
					}
				}
			}
		}

		public cancelByPath(url:string) {
			var sign:Sign = this.wealthHash.get(url);
			if (sign && sign.isPended && !sign.isLoaded) {
				sign.wealths.length = 0;
				WealthStoragePort.disposeLoaderByWealth(url);
			}
		}

	}

	class Sign extends Proto {

		public tryNum:number = 1;
		public path:string;
		public wealths:Array<string>;
		public isPended:boolean = false;
		public isLoaded:boolean = false;
		public wealth_id:string;

		public constructor() {
			super();
			this.wealths = [];
		}

		public dispose() {
			super.dispose();
			this.path = null;
			this.wealths = null;
			this.wealth_id = null;
		}
	}

}
