module engine {
	export class WealthQueueAlone extends egret.EventDispatcher implements IProto, IWealthQueue {

		public _wealthGroup_:WealthGroup;
		public isSortOn:boolean = false;
		public name:string;

		protected _id_:string;
		protected _oid_:string;
		protected _proto_:any;
		protected _className_:string;
		protected _isDispose_:boolean = false;

		private _delay:number = 15;
		private _delayTime:number = 0;
		private _limitIndex:number = 2;
		private _limitIndexMax:number = 2;
		private _stop:boolean = false;

		private timer:egret.Timer;
		private wealthElisor:WealthElisor = WealthElisor.getInstance();

		public constructor() {
			super();
			this._id_ = EngineGlobal.WEALTH_QUEUE_ALONE_SIGN + Engine.getSoleId();
			WealthElisor.instanceHash.set(this.id, this);

			this._wealthGroup_ = new WealthGroup();
			this._wealthGroup_.oid = this.id;

			this.timer = new egret.Timer(5);
			this.timer.addEventListener(egret.TimerEvent.TIMER, this.timerFunc, this);
			this.timer.start();
		}

		public set limitIndex(value:number) {
			this._limitIndex = value;
			this._limitIndexMax = value;
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

		public addWealth(path:string, data:any = null, prio:number = -1):string {
			if (this._isDispose_) {
				return null;
			}
			var wealth_id:string = this._wealthGroup_.addWealth(path, data, prio);
			if (wealth_id && this.isSortOn) {
				this._wealthGroup_.sortOn();
			}
			return wealth_id;
		}

		public removeWealth(wealth_id:string) {
			if (this._isDispose_) {
				return ;
			}
			this.wealthElisor.cancelWealth(wealth_id);
			this._wealthGroup_.removeWealthById(wealth_id);
		}

		private timerFunc(evt:egret.TimerEvent) {
			if (this._stop == false) {
				this.loop();
			}
		}

		private loop() {
			var intervalTime:number = this._delay;
			if(this.name == WealthConst.AVATAR_REQUEST_WEALTH) {
				intervalTime = 500;
			}
			if((egret.getTimer() - this._delayTime) > intervalTime) {
				this._delayTime = egret.getTimer();
				this.loadWealth();
			}
		}

		private loadWealth() {
			if(this._wealthGroup_ && this._wealthGroup_.length) {
				var wealthData:WealthData = null;
				for (var index=0; index<this._limitIndex; index++) {
					wealthData = this._wealthGroup_.getNextNeedWealthData();
					if (wealthData) {
						this.wealthElisor.loadWealth(wealthData);
					} else {
						break;
					}
				}
			}
		}

		public _callSuccess_(wealth_id:string) {
			var wealthData:WealthData = WealthData.getWealthData(wealth_id);
			if (wealthData && wealthData.isLoaded == false) {
				this._limitIndex += 1;
				if(this._limitIndex > this._limitIndexMax) {
					this._limitIndex = this._limitIndexMax;
				}
				wealthData.isLoaded = true;
				wealthData.isPended = false;
				wealthData.isSucc = true;
				this._wealthGroup_.removeWealthById(wealth_id);
				this.dispatchWealthEvent(WealthEvent.WEALTH_COMPLETE, wealthData.url, wealth_id, wealthData.oid);
			}
		}

		public _callError_(wealth_id:string) {
			var wealthData:WealthData = WealthData.getWealthData(wealth_id);
			if (wealthData && wealthData.isLoaded == false) {
				this._limitIndex += 1;
				if (this._limitIndex > this._limitIndexMax) {
					this._limitIndex = this._limitIndexMax;
				}
				wealthData.isLoaded = true;
				wealthData.isPended = false;
				wealthData.isSucc = false;
				this._wealthGroup_.removeWealthById(wealth_id);
				this.dispatchWealthEvent(WealthEvent.WEALTH_ERROR, wealthData.url, wealth_id, wealthData.oid);
			}
		}

		public _callProgress_(wealth_id:string,bytesLoaded:number,bytesTotal:number) {
			var wealthData:WealthData = WealthData.getWealthData(wealth_id);
			if(wealthData) {
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

		public dispose() {
			this.timer.stop();
			this.timer.removeEventListener(egret.TimerEvent.TIMER, this.timerFunc, this);
			this.timer = null;
			WealthElisor.instanceHash.delete(this.id);

			this._id_ = null;
			this._oid_ = null;
			this._proto_ = null;
			this._className_ = null;
			this._isDispose_ = true;
			this._wealthGroup_.dispose();
			this._wealthGroup_ = null;
			this.wealthElisor = null;
		}

		public get length():number {
			return this._wealthGroup_.length;
		}

		public get stop():boolean {
			return this._stop;
		}
		public set stop(value:boolean) {
			this._stop = value;
		}

		public get delay():number {
			return this._delay;
		}
		public set delay(value:number) {
			this._delay = value;
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
