module com {
	export module coder {
		export module core {
			export module controls {
				export module elisor {
					export class FrameOrder extends com.coder.core.protos.Order {

						public static OrderQueue:Array<com.coder.core.controls.elisor.FrameOrder>;
						public value:number = 0;
						public display:egret.DisplayObject;
						private _stop:boolean = false;
						private _orderMode:string;

						public constructor()
						{
							super();
						}

						public static createFrameOrder():com.coder.core.controls.elisor.FrameOrder
						{
							var order:com.coder.core.controls.elisor.FrameOrder = null;
							if(com.coder.core.controls.elisor.FrameOrder.OrderQueue.length)
							{
								order = com.coder.core.controls.elisor.FrameOrder.OrderQueue.pop();
								order.id = com.coder.engine.Asswc.getSoleId();
							}
							else
							{
								order = new com.coder.core.controls.elisor.FrameOrder();
							}
							return order;
						}

						public get stop():boolean
						{
							return this._stop;
						}

						public set stop(value:boolean)
						{
							this._stop = value;
						}

						public get orderMode():string
						{
							return this._orderMode;
						}

						public get isOnStageHandler():boolean
						{
							if(this.display)
							{
								return true;
							}
							return false;
						}

						public setup(orderType:string,oid:string,applyHandler:Function,executedHandler:Function = null)
						{
							this._orderMode = orderType;
							this._oid_ = oid;
							this._applyHandler_ = applyHandler;
							this._executedHandler_ = executedHandler;
						}

						public execute()
						{
						}

						public dispose()
						{
							super.dispose();
							this.display = null;
							this.value = 0;
							this._stop = false;
							this._orderMode = null;
							com.coder.core.controls.elisor.FrameOrder.OrderQueue.push(this);
						}

					}
				}
			}
		}
	}
}

com.coder.core.controls.elisor.FrameOrder.OrderQueue = new Array<com.coder.core.controls.elisor.FrameOrder>();
