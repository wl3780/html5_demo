module com {
	export module coder {
		export module core {
			export module controls {
				export module elisor {
					export class FrameElisor extends com.coder.core.protos.Proto {

						public static _instance_:com.coder.core.controls.elisor.FrameElisor;
						private heartbeatSize:number = 6;
						private hash:com.coder.utils.Hash;
						private enterFrameOrder:Array<Function>;
						private enterFrameHeartbeatState:Array<boolean>;
						private enterFrameHeartbeatIndex:number = 0;
						private onStageFrameOrder:Array<Function>;
						private onStageDisplays:Array<egret.DisplayObject>;
						private onStageHeartbeatState:Array<boolean>;
						private onStageHeartbeatIndex:number = 0;
						private intervalFrameOrder:Array<Function>;
						private intervalQueue:Array<number>;
						private intervalCountQueue:Array<number>;
						private intervalHeartbeatState:Array<boolean>;
						private intervalHeartbeatIndex:number = 0;
						private delayFrameOrder:Array<Function>;
						private delayFrameQueue:Array<number>;
						private delayHeartbeatState:Array<boolean>;
						private delayHeartbeatIndex:number = 0;
						private _stop:boolean = false;

						public constructor()
						{
							super();
							this.hash = new Hash();
							this.hash["oid" + ""] = this.id;
							this.enterFrameOrder = new Array<Function>();
							this.enterFrameHeartbeatState = new Array<boolean>();
							this.onStageFrameOrder = new Array<Function>();
							this.onStageDisplays = new Array<egret.DisplayObject>();
							this.onStageHeartbeatState = new Array<boolean>();
							this.intervalFrameOrder = new Array<Function>();
							this.intervalQueue = new Array<number>();
							this.intervalCountQueue = new Array<number>();
							this.intervalHeartbeatState = new Array<boolean>();
							this.delayFrameOrder = new Array<Function>();
							this.delayFrameQueue = new Array<number>();
							this.delayHeartbeatState = new Array<boolean>();
						}

						public static getInstance():com.coder.core.controls.elisor.FrameElisor
						{
							return com.coder.core.controls.elisor.FrameElisor._instance_ = com.coder.core.controls.elisor.FrameElisor._instance_ || new com.coder.core.controls.elisor.FrameElisor();
						}

						public get stop():boolean
						{
							return this._stop;
						}

						public set stop(value:boolean)
						{
							this._stop = value;
						}

						public setup(stage:egret.Stage)
						{
							stage.addEventListener(egret.Event.ENTER_FRAME,flash.bind(this.onEnterFrame,this),null);
						}

						private onEnterFrame(event:egret.Event)
						{
							if(this._stop || !com.coder.engine.Asswc.enabled)
							{
								return ;
							}
							com.coder.utils.FPSUtils.fps < 3?this.heartbeatSize = 2:this.heartbeatSize = 6;
							this.onEnterFrameHandler();
							this.onStageFrameHandler();
							this.onIntervalHandler();
							this.onDelayHandler();
						}

						private onEnterFrameHandler()
						{
							var orderNum:number = this.enterFrameOrder.length;
							if(orderNum <= 0)
							{
								return ;
							}
							var applyHandler:Function = null;
							var state:boolean;
							var orderIndex:number = Math.ceil(orderNum / this.heartbeatSize);
							var tmp:number = orderNum - orderIndex;
							while(tmp >= 0 && !this._stop)
							{
								if(this.enterFrameHeartbeatIndex >= this.enterFrameOrder.length)
								{
									this.enterFrameHeartbeatIndex = 0;
								}
								applyHandler = this.enterFrameOrder[this.enterFrameHeartbeatIndex];
								state = this.enterFrameHeartbeatState[this.enterFrameHeartbeatIndex];
								if(!state && applyHandler != null)
								{
									applyHandler.apply();
								}
								this.enterFrameHeartbeatIndex++;
								tmp--;
							}
						}

						private onStageFrameHandler()
						{
							var orderNum:number = this.onStageFrameOrder.length;
							if(orderNum <= 0)
							{
								return ;
							}
							var applyHandler:Function = null;
							var state:boolean;
							var orderIndex:number = Math.ceil(orderNum / this.heartbeatSize);
							var tmp:number = orderNum - orderIndex;
							while(tmp >= 0 && !this._stop)
							{
								if(this.onStageHeartbeatIndex >= this.onStageFrameOrder.length)
								{
									this.onStageHeartbeatIndex = 0;
								}
								applyHandler = this.onStageFrameOrder[this.onStageHeartbeatIndex];
								state = this.onStageHeartbeatState[this.onStageHeartbeatIndex];
								if(!state && applyHandler != null)
								{
									applyHandler.apply();
								}
								this.onStageHeartbeatIndex++;
								tmp--;
							}
						}

						private onIntervalHandler()
						{
							var orderNum:number = this.intervalFrameOrder.length;
							if(orderNum <= 0)
							{
								return ;
							}
							var applyHandler:Function = null;
							var interval:number = 0;
							var time:number = 0;
							var state:boolean;
							var order:com.coder.core.controls.elisor.FrameOrder = null;
							var orderIndex:number = Math.ceil(orderNum / this.heartbeatSize);
							var tmp:number = orderNum - orderIndex;
							while(tmp >= 0 && !this._stop)
							{
								if(this.intervalHeartbeatIndex >= this.intervalFrameOrder.length)
								{
									this.intervalHeartbeatIndex = 0;
								}
								applyHandler = this.intervalFrameOrder[this.intervalHeartbeatIndex];
								time = this.intervalCountQueue[this.intervalHeartbeatIndex];
								interval = this.intervalQueue[this.intervalHeartbeatIndex];
								state = this.intervalHeartbeatState[this.intervalHeartbeatIndex];
								if(!state && applyHandler != null && (egret.getTimer() - time) >= interval)
								{
									order = <com.coder.core.controls.elisor.FrameOrder>flash.As3As(this.hash["take" + ""](applyHandler),com.coder.core.controls.elisor.FrameOrder);
									if(order.proto)
									{
										applyHandler.apply(null,[order.proto]);
									}
									else
									{
										applyHandler.apply();
									}
									this.intervalCountQueue[this.intervalHeartbeatIndex] = egret.getTimer();
								}
								this.intervalHeartbeatIndex++;
								tmp--;
							}
						}

						private onDelayHandler()
						{
							var orderNum:number = this.delayFrameOrder.length;
							if(orderNum <= 0)
							{
								return ;
							}
							var applyHandler:Function = null;
							var time:number = 0;
							var state:boolean;
							var order:com.coder.core.controls.elisor.FrameOrder = null;
							var orderIndex:number = Math.ceil(orderNum / this.heartbeatSize);
							var tmp:number = orderNum - orderIndex;
							while(tmp >= 0 && !this._stop)
							{
								if(this.delayHeartbeatIndex >= this.delayFrameOrder.length)
								{
									this.delayHeartbeatIndex = 0;
								}
								applyHandler = this.delayFrameOrder[this.delayHeartbeatIndex];
								time = this.delayFrameQueue[this.delayHeartbeatIndex];
								state = this.delayHeartbeatState[this.delayHeartbeatIndex];
								if(!state && applyHandler != null && (egret.getTimer() - time) >= 0)
								{
									order = <com.coder.core.controls.elisor.FrameOrder>flash.As3As(this.hash["remove" + ""](applyHandler),com.coder.core.controls.elisor.FrameOrder);
									if(order.proto)
									{
										applyHandler.apply(null,[order.proto]);
									}
									else
									{
										applyHandler.apply();
									}
									this.delayFrameOrder.splice(this.delayHeartbeatIndex,1);
									this.delayFrameQueue.splice(this.delayHeartbeatIndex,1);
									this.delayHeartbeatState.splice(this.delayHeartbeatIndex,1);
									order.dispose();
									this.delayHeartbeatIndex--;
								}
								this.delayHeartbeatIndex++;
								tmp--;
							}
						}

						public hasFrameOrder(heartBeatHandler:Function):boolean
						{
							return this.hash["has" + ""](heartBeatHandler);
						}

						public takeFrameOrder(heartBeatHandler:Function):com.coder.core.controls.elisor.FrameOrder
						{
							return <com.coder.core.controls.elisor.FrameOrder>flash.As3As(this.hash["take" + ""](heartBeatHandler),com.coder.core.controls.elisor.FrameOrder);
						}

						public addFrameOrder(order:com.coder.core.controls.elisor.FrameOrder)
						{
							var applyHandler:Function = order.applyHandler;
							if(!this.hash["has" + ""](applyHandler))
							{
								this.stop = true;
								this.hash["put" + ""](applyHandler,order);
								if(com.coder.core.controls.elisor.OrderMode.ENTER_FRAME_ORDER == order.orderMode)
								{
									if(order.isOnStageHandler)
									{
										this.onStageFrameOrder.push(applyHandler);
										this.onStageDisplays.push(order.display);
										this.onStageHeartbeatState.push(order.stop);
									}
									else
									{
										this.enterFrameOrder.push(applyHandler);
										this.enterFrameHeartbeatState.push(order.stop);
									}
								}
								else if(com.coder.core.controls.elisor.OrderMode.INTERVAL_FRAME_ORDER == order.orderMode)
								{
									this.intervalFrameOrder.push(applyHandler);
									this.intervalQueue.push(order.value);
									this.intervalCountQueue.push(egret.getTimer());
									this.intervalHeartbeatState.push(order.stop);
								}
								else if(com.coder.core.controls.elisor.OrderMode.DELAY_FRAME_ORDER == order.orderMode)
								{
									this.delayFrameOrder.push(applyHandler);
									this.delayFrameQueue.push(egret.getTimer() + order.value);
									this.delayHeartbeatState.push(order.stop);
								}
								this.stop = false;
							}
						}

						public removeFrameOrder(applyHandler:Function)
						{
							var order:com.coder.core.controls.elisor.FrameOrder = <com.coder.core.controls.elisor.FrameOrder>flash.As3As(this.hash["remove" + ""](applyHandler),com.coder.core.controls.elisor.FrameOrder);
							if(!order)
							{
								return ;
							}
							var index:number = 0;
							this.stop = true;
							if(com.coder.core.controls.elisor.OrderMode.ENTER_FRAME_ORDER == order.orderMode)
							{
								if(order.isOnStageHandler)
								{
									index = this.onStageFrameOrder.indexOf(applyHandler);
									if(index != -1)
									{
										this.onStageDisplays.splice(index,1);
										this.onStageFrameOrder.splice(index,1);
										this.onStageHeartbeatState.splice(index,1);
										if(index >= this.onStageHeartbeatIndex)
										{
											this.onStageHeartbeatIndex--;
										}
										if(this.onStageHeartbeatIndex < 0)
										{
											this.onStageHeartbeatIndex = 0;
										}
									}
								}
								else
								{
									index = this.enterFrameOrder.indexOf(applyHandler);
									if(index != -1)
									{
										this.enterFrameOrder.splice(index,1);
										this.enterFrameHeartbeatState.splice(index,1);
										if(index >= this.enterFrameHeartbeatIndex)
										{
											this.enterFrameHeartbeatIndex--;
										}
										if(this.enterFrameHeartbeatIndex < 0)
										{
											this.enterFrameHeartbeatIndex = 0;
										}
									}
								}
							}
							else if(com.coder.core.controls.elisor.OrderMode.INTERVAL_FRAME_ORDER == order.orderMode)
							{
								index = this.intervalFrameOrder.indexOf(applyHandler);
								if(index != -1)
								{
									this.intervalFrameOrder.splice(index,1);
									this.intervalQueue.splice(index,1);
									this.intervalCountQueue.splice(index,1);
									this.intervalHeartbeatState.splice(index,1);
									if(index >= this.intervalHeartbeatIndex)
									{
										this.intervalHeartbeatIndex--;
									}
									if(this.intervalHeartbeatIndex < 0)
									{
										this.intervalHeartbeatIndex = 0;
									}
								}
							}
							else if(com.coder.core.controls.elisor.OrderMode.DELAY_FRAME_ORDER == order.orderMode)
							{
								index = this.delayFrameOrder.indexOf(applyHandler);
								if(index != -1)
								{
									this.delayFrameOrder.splice(index,1);
									this.delayFrameQueue.splice(index,1);
									this.delayHeartbeatState.splice(index,1);
									if(index >= this.delayHeartbeatIndex)
									{
										this.delayHeartbeatIndex--;
									}
									if(this.delayHeartbeatIndex < 0)
									{
										this.delayHeartbeatIndex = 0;
									}
								}
							}
							order.dispose();
							this.stop = false;
						}

						public startFrameOrder(applyHandler:Function)
						{
							var order:com.coder.core.controls.elisor.FrameOrder = <com.coder.core.controls.elisor.FrameOrder>flash.As3As(this.hash["take" + ""](applyHandler),com.coder.core.controls.elisor.FrameOrder);
							if(!order)
							{
								return ;
							}
							var index:number = 0;
							order.stop = false;
							if(com.coder.core.controls.elisor.OrderMode.ENTER_FRAME_ORDER == order.orderMode)
							{
								if(order.isOnStageHandler)
								{
									index = this.onStageFrameOrder.indexOf(applyHandler);
									if(index != -1)
									{
										this.onStageHeartbeatState[index] = false;
									}
								}
								else
								{
									index = this.enterFrameOrder.indexOf(applyHandler);
									if(index != -1)
									{
										this.enterFrameHeartbeatState[index] = false;
									}
								}
							}
							else if(com.coder.core.controls.elisor.OrderMode.INTERVAL_FRAME_ORDER == order.orderMode)
							{
								index = this.intervalFrameOrder.indexOf(applyHandler);
								if(index != -1)
								{
									this.intervalHeartbeatState[index] = false;
								}
							}
							else if(com.coder.core.controls.elisor.OrderMode.DELAY_FRAME_ORDER == order.orderMode)
							{
								index = this.delayFrameOrder.indexOf(applyHandler);
								if(index != -1)
								{
									this.delayHeartbeatState[index] = false;
								}
							}
						}

						public stopFrameOrder(applyHandler:Function)
						{
							var order:com.coder.core.controls.elisor.FrameOrder = <com.coder.core.controls.elisor.FrameOrder>flash.As3As(this.hash["take" + ""](applyHandler),com.coder.core.controls.elisor.FrameOrder);
							if(!order)
							{
								return ;
							}
							var index:number = 0;
							order.stop = true;
							if(com.coder.core.controls.elisor.OrderMode.ENTER_FRAME_ORDER == order.orderMode)
							{
								if(order.isOnStageHandler)
								{
									index = this.onStageFrameOrder.indexOf(applyHandler);
									if(index != -1)
									{
										this.onStageHeartbeatState[index] = true;
									}
								}
								else
								{
									index = this.enterFrameOrder.indexOf(applyHandler);
									if(index != -1)
									{
										this.enterFrameHeartbeatState[index] = true;
									}
								}
							}
							else if(com.coder.core.controls.elisor.OrderMode.INTERVAL_FRAME_ORDER == order.orderMode)
							{
								index = this.intervalFrameOrder.indexOf(applyHandler);
								if(index != -1)
								{
									this.intervalHeartbeatState[index] = true;
								}
							}
							else if(com.coder.core.controls.elisor.OrderMode.DELAY_FRAME_ORDER == order.orderMode)
							{
								index = this.delayFrameOrder.indexOf(applyHandler);
								if(index != -1)
								{
									this.delayHeartbeatState[index] = true;
								}
							}
						}

						public stopFrameGroup(group_id:string)
						{
							if(!group_id)
							{
								return ;
							}
							for(var order_key_a in this.hash)
							{
								var order:com.coder.core.controls.elisor.FrameOrder = this.hash[order_key_a];
								if(order.oid == group_id)
								{
									this.stopFrameOrder(order.applyHandler);
								}
							}
						}

						public startFrameGroup(group_id:string)
						{
							if(!group_id)
							{
								return ;
							}
							for(var order_key_a in this.hash)
							{
								var order:com.coder.core.controls.elisor.FrameOrder = this.hash[order_key_a];
								if(order.oid == group_id)
								{
									this.startFrameOrder(order.applyHandler);
								}
							}
						}

						public removeFrameGroup(group_id:string)
						{
							if(!group_id)
							{
								return ;
							}
							for(var order_key_a in this.hash)
							{
								var order:com.coder.core.controls.elisor.FrameOrder = this.hash[order_key_a];
								if(order.oid == group_id)
								{
									this.removeFrameOrder(order.applyHandler);
								}
							}
						}

						public dispose()
						{
							super.dispose();
						}

					}
				}
			}
		}
	}
}

