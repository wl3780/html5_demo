module engine {
	export class WealthQueueGroup extends egret.EventDispatcher implements IProto, IWealthQueue {

		public name:string;

		protected _id_:string;
		protected _oid_:string;
		protected _proto_:any;
		protected _className_:string;
		protected _isDispose_:boolean = false;

		private _wealthGroupQueue:Array<WealthGroup>;
		private _wealthGroupHash:Map<string, WealthGroup>;

		private _delay:number = 0;
		private _delayTime:number = 0;
		private _limitIndex:number = 2;
		private _limitIndexMax:number = 2;
		private _stop:boolean = false;

		private wealthElisor:WealthElisor = WealthElisor.getInstance();

		public constructor() {
			super();
			this._id_ = EngineGlobal.WEALTH_QUEUE_GROUP_SIGN + Engine.getSoleId();
			WealthElisor.instanceHash.set(this.id, this);

			this._wealthGroupQueue = [];
			this._wealthGroupHash = new Map<string, WealthGroup>();

			egret.Ticker.getInstance().register(this.loop, this);
		}

		public addWealthGroup(group:WealthGroup) {
			group.oid = this.id;
			if (this._wealthGroupHash.has(group.id) == false) {
				this._wealthGroupQueue.push(group);
				this._wealthGroupHash.set(group.id, group);
			}
		}

		public takeWealthGroup(gid:string):WealthGroup {
			return this._wealthGroupHash.get(gid);
		}

		public removeWealthGroup(gid:string) {
			var group:WealthGroup = this._wealthGroupHash.get(gid);
			if (group) {
				group.wealthHash.forEach(wealthData => {
					this.wealthElisor.cancelWealth(wealthData.id);
				});
				var index:number = this._wealthGroupQueue.indexOf(group);
				if (index != -1) {
					this._wealthGroupQueue.splice(index, 1);
				}
				group.dispose();
			}
		}

		public removeWealthById(wealth_id:string) {
			var wealthData:WealthData = WealthData.getWealthData(wealth_id);
			if (wealthData && wealthData.oid) {
				var group:WealthGroup = this._wealthGroupHash.get(wealthData.oid);
				if (group) {
					group.removeWealthById(wealth_id);
				}
			}
		}

		public get group_length():number {
			var result:number = 0;
			this._wealthGroupQueue.forEach(group => {
				if (group.loaded == false) {
					result++;
				}
			});
			return result;
		}

		public setStateLimitIndex(on:boolean) {
			if (on) {
				this._limitIndex--;
				if (this._limitIndex < 0) {
					this._limitIndex = 0;
				}
			} else {
				this._limitIndex++;
				if (this._limitIndex > this._limitIndexMax) {
					this._limitIndex = this._limitIndexMax;
				}
			}
		}

		private loop() {
			if (this._stop) {
				return ;
			}
			if ((egret.getTimer() - this._delayTime) > this._delay) {
				this._delayTime = egret.getTimer();
				this.loadWealth();
			}
		}

		private loadWealth() {
			if (this._wealthGroupQueue.length) {
				var wealthGroup:WealthGroup = null;
				var wealthData:WealthData = null;
				while (this._limitIndex > 0 && this._wealthGroupQueue.length) {
					wealthGroup = this.getNeedWealthGroup();
					if (wealthGroup) {
						wealthData = wealthGroup.getNextNeedWealthData();
						if (wealthData) {
							this.wealthElisor.loadWealth(wealthData);
						} else {
							return;
						}
					} else {
						var index:number = this._wealthGroupQueue.length - 1;
						while (index >= 0) {
							this.removeWealthGroup(this._wealthGroupQueue[index].id);
							index--;
						}
					}
				}
			}
		}

		private getNeedWealthGroup():WealthGroup {
            var ret:WealthGroup = null;
			this._wealthGroupQueue.forEach(group => {
				if (group.loaded == false) {
                    ret = group;
				}
			});
			return ret;
		}

		public _callSuccess_(wealth_id:string) {
			var wealthData:WealthData = WealthData.getWealthData(wealth_id);
			if (wealthData) {
				this._limitIndex++;
				wealthData.isLoaded = true;
				wealthData.isPended = false;
				wealthData.isSucc = true;
				var group:WealthGroup = this.updateWealthGroup(wealth_id);
				this.dispatchWealthEvent(WealthEvent.WEALTH_COMPLETE, wealthData.url, wealth_id, group.id);
				if (group.loaded) {
					this.dispatchWealthEvent(WealthEvent.WEALTH_GROUP_COMPLETE, wealthData.url, wealth_id, group.id);
					this.removeWealthGroup(group.id);
				}
			}
		}

		public _callError_(wealth_id:string) {
			var wealthData:WealthData = WealthData.getWealthData(wealth_id);
			if (wealthData) {
				this._limitIndex++;
				wealthData.isLoaded = true;
				wealthData.isPended = false;
				wealthData.isSucc = false;
				var group:WealthGroup = this.updateWealthGroup(wealth_id);
				this.dispatchWealthEvent(WealthEvent.WEALTH_ERROR, wealthData.url, wealth_id, group.id);
				if (group.loaded) {
					this.dispatchWealthEvent(WealthEvent.WEALTH_GROUP_COMPLETE, wealthData.url, wealth_id, group.id);
					this.removeWealthGroup(group.id);
				}
			}
		}

		public _callProgress_(wealth_id:string, bytesLoaded:number, bytesTotal:number) {
			var wealthData:WealthData = WealthData.getWealthData(wealth_id);
			if (wealthData) {
				this.dispatchWealthProgressEvent(wealthData.url, wealth_id, bytesLoaded, bytesTotal);
			}
		}

		private dispatchWealthEvent(eventType:string, path:string, wealth_id:string, wealthGroup_id:string) {
			var event:WealthEvent = new WealthEvent(eventType);
			event.path = path;
			event.wealth_id = wealth_id;
			event.wealthGroup_id = wealthGroup_id;
			this.dispatchEvent(event);
		}

		private dispatchWealthProgressEvent(path:string, wealth_id:string, bytesLoaded:number, bytesTotal:number) {
			var event:WealthProgressEvent = new WealthProgressEvent(WealthProgressEvent.PROGRESS);
			event.path = path;
			event.wealth_id = wealth_id;
			event.bytesLoaded = bytesLoaded;
			event.bytesTotal = bytesTotal;
			this.dispatchEvent(event);
		}

		private updateWealthGroup(wealth_id:string):WealthGroup {
			var wealthData:WealthData = WealthData.getWealthData(wealth_id);
			if(wealthData) {
				var group:WealthGroup = this.takeWealthGroup(wealthData.oid);
				group.checkTotalFinish();
				return group;
			}
			return null;
		}

		public dispose() {
			egret.Ticker.getInstance().unregister(this.loop, this);
			this._id_ = null;
			this._oid_ = null;
			this._proto_ = null;
			this._isDispose_ = true;
			this.wealthElisor = null;
		}

		public get limitIndex():number {
			return this._limitIndex;
		}

		public get stop():boolean {
			return this._stop;
		}
		public set stop(value:boolean) {
			this._stop = value;
		}

		public get id():string {
			return this._id_;
		}

		public get oid():string {
			return this._oid_;
		}

		public get proto():any {
			return this._proto_;
		}
		public set proto(value:any) {
			this._proto_ = value;
		}

		public get className():string {
			if (this._className_ == null) {
				this._className_ = egret.getQualifiedClassName(this);
			}
			return this._className_;
		}

		public toString():string {
			return "[" + this.className + Engine.SIGN + this.id + "]";
		}

	}
}
