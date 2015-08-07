module com {
	export module coder {
		export module core {
			export module controls {
				export module wealth {
					export class WealthQueueAlone extends egret.EventDispatcher implements com.coder.interfaces.dock.IProto,com.coder.interfaces.system.IWealthQueue {

						public static instanceHash:com.coder.utils.Hash;
						public static avatarRequestElisorTime:number = 0;
						public _wealthGroup_:com.coder.core.controls.wealth.WealthGroup;
						public loaderContext:flash.LoaderContext;
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
						private wealthElisor:com.coder.core.controls.wealth.WealthElisor;

						public constructor()
						{
							super();
							registerClassAlias("com.coder.WealthQuene",com.coder.core.controls.wealth.WealthQueueAlone);
							this._id_ = com.coder.global.EngineGlobal.WEALTH_QUEUE_ALONE_SIGN + com.coder.engine.Asswc.getSoleId();
							this._className_ = egret.getQualifiedClassName(this);
							com.coder.core.controls.wealth.WealthQueueAlone.instanceHash["put" + ""](this.id,this);
							this.wealthElisor = com.coder.core.controls.wealth.WealthElisor.getInstance();
							this._wealthGroup_ = com.coder.core.controls.wealth.WealthGroup.createWealthGroup();
							this._wealthGroup_.oid_com_coder_core_controls_wealth_WealthGroup = this.id;
							var checkPolicy:boolean = false;
							if(flash.Security["sandboxType" + ""] == flash.Security.REMOTE)
							{
								checkPolicy = true;
							}
							this.loaderContext = new flash.LoaderContext(checkPolicy,flash.ApplicationDomain.currentDomain);
							this.timer = new egret.Timer(5);
							this.timer.addEventListener(egret.TimerEvent.TIMER,flash.bind(this.timerFunc,this),null);
							this.timer.start();
						}

						public static getWealthQueue(id:string):com.coder.interfaces.system.IWealthQueue
						{
							return <com.coder.interfaces.system.IWealthQueue>flash.As3As(com.coder.core.controls.wealth.WealthQueueAlone.instanceHash["take" + ""](id),"com.coder.interfaces.system.IWealthQueue");
						}

						protected timerFunc(event:egret.TimerEvent)
						{
							this.loop();
						}

						public set limitIndex(value:number)
						{
							this._limitIndex = value;
							this._limitIndexMax = value;
						}

						public setStateLimitIndex()
						{
							this._limitIndex--;
							if(this._limitIndex < 0)
							{
								this._limitIndex = 0;
							}
						}

						public get length():number
						{
							return this._wealthGroup_.length;
						}

						public get stop():boolean
						{
							return this._stop;
						}

						public set stop(value:boolean)
						{
							this._stop = value;
						}

						public addWealth(url:string,data:any = null,dataFormat:string = null,otherArgs:any = null,prio:number = -1):string
						{
							if(this._isDispose_)
							{
								return null;
							}
							var wealth_id:string = this._wealthGroup_.addWealth(url,data,dataFormat,otherArgs,prio);
							if(this.isSortOn)
							{
								this._wealthGroup_.sortOn(["prio","time"],[flash.AS3Array.NUMERIC,flash.AS3Array.NUMERIC]);
							}
							return wealth_id;
						}

						public loop()
						{
							var pass:boolean = true;
							if(this.name == com.coder.core.controls.wealth.WealthConst.AVATAR_REQUEST_WEALTH)
							{
								pass = false;
								if((egret.getTimer() - com.coder.core.controls.wealth.WealthQueueAlone.avatarRequestElisorTime) > 500)
								{
									pass = true;
								}
							}
							if(!this._stop && pass && (egret.getTimer() - this._delayTime) > this._delay)
							{
								this._delayTime = egret.getTimer();
								this.loadWealth();
							}
						}

						public loadWealth()
						{
							if(this._wealthGroup_ && this._wealthGroup_.length && !com.coder.core.controls.wealth.WealthElisor.isClearing && !this._stop)
							{
								var index:number = 0;
								var wealthData:com.coder.core.controls.wealth.WealthData = null;
								while(index < this._limitIndex)
								{
									if(!com.coder.core.controls.wealth.WealthElisor.isClearing && !this._stop)
									{
										wealthData = this._wealthGroup_.getNextNeedWealthData();
										if(wealthData)
										{
											this.wealthElisor.loadWealth(wealthData,this.loaderContext);
										}
									}
									index++;
								}
							}
						}

						public _callSuccess_(wealth_id:string)
						{
							var wealthData:com.coder.core.controls.wealth.WealthData = com.coder.core.controls.wealth.WealthData.getWealthData(wealth_id);
							if(wealthData && wealthData.loaded == false)
							{
								this._limitIndex += 1;
								if(this._limitIndex > this._limitIndexMax)
								{
									this._limitIndex = this._limitIndexMax;
								}
								wealthData.loaded = true;
								wealthData.isPend = false;
								wealthData.isSucc = true;
								this._wealthGroup_.removeWealthById(wealth_id);
								this.dispatchWealthEvent(com.coder.core.events.WealthEvent.WEALTH_COMPLETE,wealthData.url,wealth_id,wealthData.oid);
							}
						}

						public _callError_(wealth_id:string)
						{
							var wealthData:com.coder.core.controls.wealth.WealthData = com.coder.core.controls.wealth.WealthData.getWealthData(wealth_id);
							if(wealthData && wealthData.loaded == false)
							{
								this._limitIndex += 1;
								if(this._limitIndex > this._limitIndexMax)
								{
									this._limitIndex = this._limitIndexMax;
								}
								wealthData.loaded = true;
								wealthData.isPend = false;
								wealthData.isSucc = false;
								this._wealthGroup_.removeWealthById(wealth_id);
								this.dispatchWealthEvent(com.coder.core.events.WealthEvent.WEALTH_ERROR,wealthData.url,wealth_id,wealthData.oid);
							}
						}

						public _callProgress_(wealth_id:string,bytesLoaded:number,bytesTotal:number)
						{
							var wealthData:com.coder.core.controls.wealth.WealthData = com.coder.core.controls.wealth.WealthData.getWealthData(wealth_id);
							if(wealthData)
							{
								this.dispatchWealthProgressEvent(wealthData.url,wealth_id,bytesLoaded,bytesTotal);
							}
						}

						private dispatchWealthEvent(eventType:string,path:string,wealth_id:string,wealthGroup_id:string)
						{
							var event:com.coder.core.events.WealthEvent = new com.coder.core.events.WealthEvent(eventType);
							event.path = path;
							event.wealth_id = wealth_id;
							event.wealthGroup_id = wealthGroup_id;
							this.dispatchEvent(event);
						}

						private dispatchWealthProgressEvent(path:string,wealth_id:string,bytesLoaded:number,bytesTotal:number)
						{
							var event:com.coder.core.events.WealthProgressEvent = new com.coder.core.events.WealthProgressEvent(com.coder.core.events.WealthProgressEvent.PROGRESS_static_com_coder_core_events_WealthProgressEvent);
							event.path = path;
							event.bytesLoaded = bytesLoaded;
							event.wealth_id = wealth_id;
							event.bytesTotal = bytesTotal;
							this.dispatchEvent(event);
						}

						public removeWealth(wealth_id:string)
						{
							if(this._isDispose_)
							{
								return ;
							}
							this.wealthElisor.cancelWealth(wealth_id);
							this._wealthGroup_.removeWealthById(wealth_id);
						}

						public get delay():number
						{
							return this._delay;
						}

						public set delay(value:number)
						{
							this._delay = value;
						}

						public get id():string
						{
							return this._id_;
						}

						public set id(value:string)
						{
							this._id_ = value;
						}

						public get oid():string
						{
							return this._oid_;
						}

						public set oid(value:string)
						{
							this._oid_ = value;
						}

						public get proto():any
						{
							return this._proto_;
						}

						public set proto(value:any)
						{
							this._proto_ = value;
						}

						public clone():any
						{
							return com.coder.utils.ObjectUtils.copy(this);
						}

						public dispose()
						{
							this.timer.stop();
							this.timer.removeEventListener(egret.TimerEvent.TIMER,flash.bind(this.timerFunc,this),null);
							this.timer = null;
							com.coder.core.controls.wealth.WealthQueueAlone.instanceHash["remove" + ""](this.id);
							this._id_ = null;
							this._oid_ = null;
							this._proto_ = null;
							this._className_ = null;
							this._delay = 0;
							this._delayTime = 0;
							this._limitIndex = 0;
							this._isDispose_ = true;
							this._wealthGroup_.dispose();
							this._wealthGroup_ = null;
							this.wealthElisor = null;
							this.stop = false;
						}

						public toString():string
						{
							return "[" + this._className_ + com.coder.engine.Asswc.SIGN + this._id_ + "]";
						}

						public get className():string
						{
							return this._className_;
						}

					}
				}
			}
		}
	}
}

com.coder.core.controls.wealth.WealthQueueAlone.instanceHash = new Hash();
flash.implementsClass("com.coder.core.controls.wealth.WealthQueueAlone",["com.coder.interfaces.dock.IProto","com.coder.interfaces.system.IWealthQueue"]);