module com {
	export module coder {
		export module core {
			export module controls {
				export module elisor {
					export class Elisor extends com.coder.core.protos.Proto {

						public static _instance:com.coder.core.controls.elisor.Elisor;
						public static getInstance():com.coder.core.controls.elisor.Elisor
						{
							return com.coder.core.controls.elisor.Elisor._instance = com.coder.core.controls.elisor.Elisor._instance || new com.coder.core.controls.elisor.Elisor();
						}

						public setup(stage:egret.Stage)
						{
							com.coder.core.controls.elisor.FrameElisor.getInstance().setup(stage);
						}

						public addFrameOrder(target:com.coder.interfaces.dock.IProto,heartBeatHandler:Function,delay:number = 0,isOnStageHandler:boolean = false)
						{
							var order:com.coder.core.controls.elisor.FrameOrder = com.coder.core.controls.elisor.FrameOrder.createFrameOrder();
							order.value = delay;
							if(delay == 0)
							{
								order.setup(com.coder.core.controls.elisor.OrderMode.ENTER_FRAME_ORDER,target.id,heartBeatHandler);
							}
							else
							{
								if(isOnStageHandler)
								{
									order.display = <egret.DisplayObject>flash.As3As(target,egret.DisplayObject);
								}
								order.setup(com.coder.core.controls.elisor.OrderMode.DELAY_FRAME_ORDER,target.id,heartBeatHandler);
							}
							com.coder.core.controls.elisor.FrameElisor.getInstance().addFrameOrder(order);
						}

						public hasFrameOrder(heartBeatHandler:Function):boolean
						{
							return com.coder.core.controls.elisor.FrameElisor.getInstance().hasFrameOrder(heartBeatHandler);
						}

						public setInterval(target:com.coder.interfaces.dock.IProto,heartBeatHandler:Function,delay:number,...args)
						{
							var order:com.coder.core.controls.elisor.FrameOrder = com.coder.core.controls.elisor.FrameOrder.createFrameOrder();
							order.value = delay;
							order.setup(com.coder.core.controls.elisor.OrderMode.INTERVAL_FRAME_ORDER,target.id,heartBeatHandler);
							order.proto = args;
							com.coder.core.controls.elisor.FrameElisor.getInstance().addFrameOrder(order);
						}

						public setTimeOut(target:com.coder.interfaces.dock.IProto,closureHandler:Function,delay:number,...args):string
						{
							var order:com.coder.core.controls.elisor.FrameOrder = com.coder.core.controls.elisor.FrameOrder.createFrameOrder();
							order.value = delay;
							order.setup(com.coder.core.controls.elisor.OrderMode.DELAY_FRAME_ORDER,target.id,closureHandler);
							order.proto = args;
							com.coder.core.controls.elisor.FrameElisor.getInstance().addFrameOrder(order);
							return order.id;
						}

						public removeFrameOrder(heartBeatHandler:Function)
						{
							com.coder.core.controls.elisor.FrameElisor.getInstance().removeFrameOrder(heartBeatHandler);
						}

						public stopFrameOrder(heartBeatHandler:Function)
						{
							com.coder.core.controls.elisor.FrameElisor.getInstance().stopFrameOrder(heartBeatHandler);
						}

						public stopTargetFrameOrder(target:com.coder.interfaces.dock.IProto)
						{
							com.coder.core.controls.elisor.FrameElisor.getInstance().stopFrameGroup(target.id);
						}

						public removeTotalFrameOrder(target:com.coder.interfaces.dock.IProto)
						{
							com.coder.core.controls.elisor.FrameElisor.getInstance().removeFrameGroup(target.id);
						}

						public hasEventOrder(oid:string,listenerType:string):boolean
						{
							return com.coder.core.controls.elisor.EventElisor.getInstance().hasEventOrder(oid,listenerType);
						}

						public addEventOrder(tar:com.coder.interfaces.system.IOrderDispatcher,type:string,listener:Function)
						{
							var order:com.coder.core.controls.elisor.EventOrder = com.coder.core.controls.elisor.EventOrder.createEventOrder();
							order.register(tar.id,tar.className,type,listener);
							com.coder.core.controls.elisor.EventElisor.getInstance().addOrder(order);
						}

						public removeEventOrder(oid:string,listenerType:string)
						{
							com.coder.core.controls.elisor.EventElisor.getInstance().removeEventOrder(oid,listenerType);
						}

						public removeTotalEventOrder(target:com.coder.interfaces.dock.IProto)
						{
							com.coder.core.controls.elisor.EventElisor.getInstance().disposeGroupOrders(target.id);
						}

						public removeTotlaOrder(target:com.coder.interfaces.dock.IProto)
						{
							this.removeTotalEventOrder(target);
							this.removeTotalFrameOrder(target);
						}

					}
				}
			}
		}
	}
}

