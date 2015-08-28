module engine {
	export class WealthElisor extends egret.HashObject {

		public static instanceHash:Map<string, IWealthQueue> = new Map<string, IWealthQueue>();
		public static isClearing:boolean = false;
		public static loaderInstanceHash:com.coder.utils.Hash;
		public static _instance:WealthElisor;

		private wealthHash:Map<>;

		public constructor() {
			super();
			this.wealthHash = new Map<>();
		}

		public static getInstance():WealthElisor {
			if (WealthElisor._instance == null) {
				WealthElisor._instance = new WealthElisor();
			}
			return WealthElisor._instance;
		}

		public static removeSign(path:string) {
			var dict:flash.Dictionary = WealthElisor._instance.wealthHash;
			var sign:Sign = <Sign>flash.As3As(dict.getItem(path), Sign);
			if (sign) {
				sign.dispose();
			}
			dict.delItem(path);
		}

		public static clear(unHash:com.coder.utils.Hash) {
			var arr:Array<any> = null;
			var file:string = null;
			var sign:Sign = null;
			var dict:flash.Dictionary = WealthElisor._instance.wealthHash;
			for (var forinvar__ in dict.map) {
				var path = dict.map[forinvar__][0];
				arr = path.split("/");
				file = arr[arr.length - 1];
				if (unHash["has" + ""](file)) {
					sign = dict.getItem(path);
					sign.dispose();
					dict.delItem(path);
				}
			}
		}

		public loadWealth(wealthData:WealthData, lc:flash.LoaderContext = null) {
			if (!wealthData) {
				return;
			}
			var url:string = wealthData.url;
			var owner:string = wealthData.id;
			var sign:Sign = <Sign>flash.As3As(this.wealthHash.getItem(url), Sign);
			if (sign == null) {
				sign = new Sign();
				sign.path = url;
				this.wealthHash.setItem(url, sign);
			}
			if (sign.wealths.indexOf(owner) == -1) {
				sign.wealths.push(owner);
			}
			if (!sign.isLoaded && !sign.isPend) {
				sign.lc = lc;
				sign.isPend = true;
				sign.wealth_id = owner;
				var loader:com.coder.interfaces.display.ILoader = null;
				if (wealthData.type == WealthConst.BING_WEALTH || wealthData.dataFormat == egret.URLLoaderDataFormat.BINARY) {
					loader = new com.coder.core.displays.items.unit.BingLoader();
					(<egret.URLLoader>(loader)).dataFormat = wealthData.dataFormat;
					loader.loadElemt(wealthData.url, flash.bind(this._callSuccess_, this), flash.bind(this._callError_, this), flash.bind(this._callProgress_, this), lc ? lc : this.loaderContext);
				}
				else if (wealthData.type == WealthConst.TXT_WEALTH || wealthData.type == WealthConst.IMG_WEALTH) {
					loader = new com.coder.core.displays.items.unit.DisplayLoader();
					loader.loadElemt(wealthData.url, flash.bind(this._callSuccess_, this), flash.bind(this._callError_, this), flash.bind(this._callProgress_, this), lc ? lc : this.loaderContext);
				}
				this.updateWealthState(sign.wealths, "isPended", sign.isPend);
			}
			else if (!sign.isLoaded && sign.isPend) {
				this.updateWealthState(sign.wealths, "isPended", sign.isPend);
			}
			else if (sign.isLoaded) {
				this.updateWealthState(sign.wealths, "loaded", sign.isLoaded);
			}
		}

		private updateWealthState(wealths:Array<string>, proto:string, value:boolean) {
			if (!wealths || wealths.length == 0) {
				return;
			}
			var wealthData:WealthData = null;
			var wealthQueue:any = null;
			for (var wealth_id_key_a in wealths) {
				var wealth_id:string = wealths[wealth_id_key_a];
				wealthData = WealthData.getWealthData(wealth_id);
				if (wealthData) {
					wealthQueue = WealthQueueAlone.getWealthQueue(wealthData.wid);
					if (wealthQueue) {
						if (flash.As3is(wealthQueue, WealthQueueAlone)) {
							(<WealthQueueAlone>(wealthQueue)).setStateLimitIndex();
						}
						if ("isPended" == proto) {
							wealthData.isPend = value;
						}
						else if ("loaded" == proto) {
							wealthData.loaded = value;
							if (wealthData.loaded) {
								wealthQueue["_callSuccess_" + ""](wealthData.id);
							}
						}
					}
				}
			}
		}

		protected _callSuccess_(path:string) {
			var sign:Sign = <Sign>flash.As3As(this.wealthHash.getItem(path), Sign);
			if (sign) {
				sign.isLoaded = true;
				this.update(path, 1);
			}
		}

		protected _callError_(path:string) {
			var sign:Sign = <Sign>flash.As3As(this.wealthHash.getItem(path), Sign);
			if (sign) {
				com.coder.utils.log.Log.error(this, sign.path);
				var wealthData:WealthData = WealthData.getWealthData(sign.wealth_id);
				if (wealthData && sign.tryNum > 0) {
					WealthStoragePort.disposeLoaderByWealth(sign.path);
					sign.tryNum -= 1;
					sign.isPend = false;
					this.loadWealth(wealthData, sign.lc);
				}
				else {
					sign.isLoaded = true;
					this.update(path, 0);
				}
			}
		}

		protected _callProgress_(path:string, bytesLoaded:number, bytesTotal:number) {
			var sign:Sign = <Sign>flash.As3As(this.wealthHash.getItem(path), Sign);
			if (sign) {
				sign.isPend = true;
				this.update(path, 2, bytesLoaded, bytesTotal);
			}
		}

		public update(url:string, state:number, bytesLoaded:number = 0, bytesTotal:number = 0) {
			var sign:Sign = <Sign>flash.As3As(this.wealthHash.getItem(url), Sign);
			if (!sign) {
				return;
			}
			var wealthData:WealthData = null;
			var wealthQueue:any = null;
			if (state == 0 || state == 1) {
				while (sign.wealths.length) {
					wealthData = WealthData.getWealthData(sign.wealths.shift());
					if (wealthData && wealthData.loaded == false && com.coder.engine.Asswc.enabled) {
						wealthQueue = <Object>flash.As3As(WealthQueueAlone.getWealthQueue(wealthData.wid), Object);
						if (wealthQueue) {
							if (state == 0) {
								wealthQueue["_callError_" + ""](wealthData.id);
							}
							else if (state == 1) {
								wealthQueue["_callSuccess_" + ""](wealthData.id);
							}
						}
					}
				}
			}
			else {
				for (var wealthId_key_a in sign.wealths) {
					var wealthId:string = sign.wealths[wealthId_key_a];
					wealthData = WealthData.getWealthData(wealthId);
					if (wealthData) {
						wealthQueue = <Object>flash.As3As(WealthQueueAlone.getWealthQueue(wealthData.wid), Object);
						if (wealthQueue && wealthQueue["name" + ""] != WealthConst.AVATAR_REQUEST_WEALTH) {
							wealthQueue["_callProgress_" + ""](wealthData.id, bytesLoaded, bytesTotal);
						}
					}
				}
			}
		}

		public checkWealthPendSatte(url:string):boolean {
			var sign:Sign = <Sign>flash.As3As(this.wealthHash.getItem(url), Sign);
			if (sign) {
				return sign.isPend;
			}
			return false;
		}

		public checkWealthHasCache(url:string):boolean {
			var sign:Sign = <Sign>flash.As3As(this.wealthHash.getItem(url), Sign);
			if (sign) {
				return sign.isLoaded;
			}
			return false;
		}

		public cancelWealth(wealth_id:string) {
			var wealthData:WealthData = WealthData.getWealthData(wealth_id);
			if (wealthData) {
				var url:string = wealthData.url;
				var sign:Sign = <Sign>flash.As3As(this.wealthHash.getItem(url), Sign);
				if (sign) {
					var index:number = sign.wealths.indexOf(wealth_id);
					if (index != -1) {
						sign.wealths.splice(index, 1);
						if (sign.isPend && !sign.isLoaded && sign.wealths.length == 0) {
							WealthStoragePort.disposeLoaderByWealth(url);
						}
					}
				}
			}
		}

		public cancelByPath(url:string) {
			if (!url) {
				return;
			}
			var sign:Sign = <Sign>flash.As3As(this.wealthHash.getItem(url), Sign);
			if (sign && sign.isPend && !sign.isLoaded) {
				sign.wealths = new Array<string>();
				WealthStoragePort.disposeLoaderByWealth(url);
			}
		}

	}

	class Sign extends com.coder.core.protos.Proto {

		public tryNum:number = 1;
		public path:string;
		public wealths:Array<string>;
		public isPend:boolean = false;
		public isLoaded:boolean = false;
		public wealth_id:string;
		public lc:flash.LoaderContext;

		public constructor() {
			super();
			this.wealths = new Array<string>();
		}

		public dispose() {
			super.dispose();
			this.lc = null;
			this.path = null;
			this.wealths = null;
			this.wealth_id = null;
		}

	}
}
