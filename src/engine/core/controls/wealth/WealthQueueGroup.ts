module com {
	export module coder {
		export module core {
			export module controls {
				export module wealth {
					export class WealthQueueGroup extends egret.EventDispatcher implements com.coder.interfaces.dock.IProto,com.coder.interfaces.system.IWealthQueue {

						public loaderContext:flash.LoaderContext;
						public name:string;
						protected _id_:string;
						protected _oid_:string;
						protected _proto_:any;
						protected _className_:string;
						protected _isDispose_:boolean = false;
						private _delay:number = 0;
						private _delayTime:number = 0;
						private _wealthGroup:com.coder.core.controls.wealth.WealthGroup;
						private _wealthGroupQueue:Array<com.coder.core.controls.wealth.WealthGroup>;
						private _wealthKeyHash:com.coder.utils.Hash;
						private _limitIndex:number = 2;
						private _stop:boolean = false;
						private dur:number = 0;
						private wealthElisor:com.coder.core.controls.wealth.WealthElisor;

						public constructor()
						{
							super();
							this._id_ = com.coder.global.EngineGlobal.WEALTH_QUEUE_GROUP_SIGN + com.coder.engine.Asswc.getSoleId();
							this._className_ = egret.getQualifiedClassName(this);
							com.coder.core.controls.wealth.WealthQueueAlone.instanceHash["put" + ""](this.id,this);
							this._wealthGroupQueue = new Array<com.coder.core.controls.wealth.WealthGroup>();
							this._wealthKeyHash = new Hash();
							this.wealthElisor = com.coder.core.controls.wealth.WealthElisor.getInstance();
							com.coder.core.controls.elisor.Elisor.getInstance().addFrameOrder(this,flash.bind(this.loop,this));
						}

						public get limitIndex():number
						{
							return this._limitIndex;
						}

						public get stop():boolean
						{
							return this._stop;
						}

						public set stop(value:boolean)
						{
							this._stop = value;
						}

						public loop()
						{
							if(this._stop)
							{
								return ;
							}
							if((egret.getTimer() - this._delayTime) > this._delay)
							{
								this._delayTime = egret.getTimer();
								this.loadWealth();
							}
						}

						public addWealthGroup(value:com.coder.core.controls.wealth.WealthGroup)
						{
							value.oid_com_coder_core_controls_wealth_WealthGroup = this.id;
							if(!this._wealthKeyHash["has" + ""](value.id))
							{
								this._wealthGroupQueue.push(value);
								this._wealthKeyHash["put" + ""](value.id,value);
							}
						}

						public get group_length():number
						{
							var result:number = 0;
							for(var group_key_a in this._wealthGroupQueue)
							{
								var group:com.coder.core.controls.wealth.WealthGroup = this._wealthGroupQueue[group_key_a];
								if(!group.loaded)
								{
									result++;
								}
							}
							return result;
						}

						public takeWealthGroup(gid:string):com.coder.core.controls.wealth.WealthGroup
						{
							return <com.coder.core.controls.wealth.WealthGroup>flash.As3As(this._wealthKeyHash["take" + ""](gid),com.coder.core.controls.wealth.WealthGroup);
						}

						public removeWealthGroup(gid:string)
						{
							var group:com.coder.core.controls.wealth.WealthGroup = <com.coder.core.controls.wealth.WealthGroup>flash.As3As(this._wealthKeyHash["take" + ""](gid),com.coder.core.controls.wealth.WealthGroup);
							if(group)
							{
								for(var wealthData_key_a in group.wealths)
								{
									var wealthData:com.coder.core.controls.wealth.WealthData = group.wealths[wealthData_key_a];
									this.wealthElisor.cancelWealth(wealthData.id);
								}
								var index:number = this._wealthGroupQueue.indexOf(group);
								if(index != -1)
								{
									this._wealthGroupQueue.splice(index,1);
								}
							}
						}

						public removeWealthById(wealth_id:string)
						{
							var wealthData:com.coder.core.controls.wealth.WealthData = com.coder.core.controls.wealth.WealthData.getWealthData(wealth_id);
							if(wealthData && wealthData.oid)
							{
								var group:com.coder.core.controls.wealth.WealthGroup = <com.coder.core.controls.wealth.WealthGroup>flash.As3As(this._wealthKeyHash["take" + ""](wealthData.oid),com.coder.core.controls.wealth.WealthGroup);
								if(group)
								{
									group.removeWealthById(wealth_id);
								}
							}
						}

						public loadWealth()
						{
							if((egret.getTimer() - this.dur) < 5 || com.coder.core.controls.wealth.WealthElisor.isClearing)
							{
								return ;
							}
							this.dur = egret.getTimer();
							if(this._wealthGroupQueue.length)
							{
								var tmpGroup:com.coder.core.controls.wealth.WealthGroup = null;
								var wealthData:com.coder.core.controls.wealth.WealthData = null;
								var index:number = 0;
								while(this._limitIndex > 0 && !com.coder.core.controls.wealth.WealthElisor.isClearing && this._wealthGroupQueue.length)
								{
									tmpGroup = this._wealthGroup;
									this._wealthGroup = this.getNeedWealthGroup();
									if(this._wealthGroup && tmpGroup != this._wealthGroup)
									{
										(this._wealthGroup.type == 1)?this._limitIndex = 1:this._limitIndex = 2;
									}
									else
									{
										if(this._wealthGroup == null)
										{
											if(this._wealthGroupQueue.length)
											{
												index = 0;
												while(index < this._wealthGroupQueue.length)
												{
													this.removeWealthGroup(this._wealthGroupQueue[index].id);
													index++;
												}
											}
											this._limitIndex = 2;
										}
									}
									if(this._wealthGroup)
									{
										wealthData = this._wealthGroup.getNextNeedWealthData();
										if(wealthData)
										{
											this.wealthElisor.loadWealth(wealthData,this.loaderContext);
										}
									}
									this._limitIndex--;
								}
							}
						}

						private getNeedWealthGroup():com.coder.core.controls.wealth.WealthGroup
						{
							for(var group_key_a in this._wealthGroupQueue)
							{
								var group:com.coder.core.controls.wealth.WealthGroup = this._wealthGroupQueue[group_key_a];
								if(!group.loaded)
								{
									return group;
								}
							}
							return null;
						}

						public _callSuccess_(wealth_id:string)
						{
							var wealthData:com.coder.core.controls.wealth.WealthData = com.coder.core.controls.wealth.WealthData.getWealthData(wealth_id);
							if(wealthData)
							{
								this._limitIndex += 1;
								wealthData.loaded = true;
								wealthData.isPend = false;
								wealthData.isSucc = true;
								var group:com.coder.core.controls.wealth.WealthGroup = this.updateWealthGroup(wealth_id);
								this.dispatchWealthEvent(com.coder.core.events.WealthEvent.WEALTH_COMPLETE,wealthData.url,wealth_id,group.id);
								if(group.loaded)
								{
									this.dispatchWealthEvent(com.coder.core.events.WealthEvent.WEALTH_GROUP_COMPLETE,wealthData.url,wealth_id,group.id);
									this.removeWealthGroup(group.id);
								}
							}
						}

						public _callError_(wealth_id:string)
						{
							var wealthData:com.coder.core.controls.wealth.WealthData = com.coder.core.controls.wealth.WealthData.getWealthData(wealth_id);
							if(wealthData)
							{
								this._limitIndex += 1;
								wealthData.loaded = true;
								wealthData.isPend = false;
								wealthData.isSucc = false;
								var group:com.coder.core.controls.wealth.WealthGroup = this.updateWealthGroup(wealth_id);
								this.dispatchWealthEvent(com.coder.core.events.WealthEvent.WEALTH_ERROR,wealthData.url,wealth_id,group.id);
								if(group.loaded)
								{
									this.dispatchWealthEvent(com.coder.core.events.WealthEvent.WEALTH_GROUP_COMPLETE,wealthData.url,wealth_id,group.id);
									this.removeWealthGroup(group.id);
								}
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

						private updateWealthGroup(wealth_id:string):com.coder.core.controls.wealth.WealthGroup
						{
							var wealthData:com.coder.core.controls.wealth.WealthData = com.coder.core.controls.wealth.WealthData.getWealthData(wealth_id);
							if(wealthData)
							{
								var group:com.coder.core.controls.wealth.WealthGroup = this.takeWealthGroup(wealthData.oid);
								group.checkTotalFinish();
								return group;
							}
							return null;
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
							com.coder.core.controls.elisor.Elisor.getInstance().removeTotalFrameOrder(this);
							this._id_ = null;
							this._oid_ = null;
							this._proto_ = null;
							this._isDispose_ = true;
							this._delay = 0;
							this._delayTime = 0;
							this._limitIndex = 0;
							this._wealthGroup.dispose();
							this._wealthGroup = null;
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

flash.implementsClass("com.coder.core.controls.wealth.WealthQueueGroup",["com.coder.interfaces.dock.IProto","com.coder.interfaces.system.IWealthQueue"]);