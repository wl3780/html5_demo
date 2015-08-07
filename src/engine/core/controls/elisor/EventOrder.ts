module com {
	export module coder {
		export module core {
			export module controls {
				export module elisor {
					export class EventOrder extends com.coder.core.protos.Order {

						public static OrderQueue:Array<com.coder.core.controls.elisor.EventOrder>;
						protected _listener_:Function;
						protected _listenerType_:string;
						protected _orderMode_:string;

						public constructor()
						{
							super();
							this._className_ = null;
							registerClassAlias("com.coder.save.EventOrder",com.coder.core.controls.elisor.EventOrder);
							this._orderMode_ = com.coder.core.controls.elisor.OrderMode.EVENT_ORDER;
						}

						public static createEventOrder():com.coder.core.controls.elisor.EventOrder
						{
							var order:com.coder.core.controls.elisor.EventOrder = com.coder.core.controls.elisor.EventOrder.OrderQueue.length?com.coder.core.controls.elisor.EventOrder.OrderQueue.pop():new com.coder.core.controls.elisor.EventOrder();
							return order;
						}

						public get type():string
						{
							return this._listenerType_;
						}

						public register(oid:string,className:string,listenerType:string,listener:Function)
						{
							this._listener_ = listener;
							this._listenerType_ = listenerType;
							this._oid_ = oid;
							this._className_ = className;
							this._id_ = oid + com.coder.engine.Asswc.SIGN + listenerType;
						}

						public dispose()
						{
							this.unactivate();
							this._listener_ = null;
							this._listenerType_ = null;
							super.dispose();
						}

						public execute()
						{
							this.activate();
						}

						public activate()
						{
							var pispatcher:com.coder.interfaces.system.IOrderDispatcher = com.coder.core.displays.DisplayObjectPort.takeTargetByClassName(this.className,this.oid);
							if(pispatcher)
							{
								pispatcher["addEventListener" + ""](this.type,this._listener_);
							}
						}

						public unactivate()
						{
							var pispatcher:com.coder.interfaces.system.IOrderDispatcher = com.coder.core.displays.DisplayObjectPort.removeTargetByClassName(this.className,this.oid);
							if(pispatcher)
							{
								pispatcher["removeEventListener" + ""](this.type,this._listener_);
							}
						}

					}
				}
			}
		}
	}
}

com.coder.core.controls.elisor.EventOrder.OrderQueue = new Array<com.coder.core.controls.elisor.EventOrder>();
