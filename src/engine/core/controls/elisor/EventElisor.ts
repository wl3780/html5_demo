module com {
	export module coder {
		export module core {
			export module controls {
				export module elisor {
					export class EventElisor extends com.coder.core.protos.Proto {

						public static _instance:com.coder.core.controls.elisor.EventElisor;
						private _orderHash:flash.Dictionary;
						private _length:number = 0;

						public constructor()
						{
							super();
							this._orderHash = new flash.Dictionary();
						}

						public static getInstance():com.coder.core.controls.elisor.EventElisor
						{
							return com.coder.core.controls.elisor.EventElisor._instance = com.coder.core.controls.elisor.EventElisor._instance || new com.coder.core.controls.elisor.EventElisor();
						}

						public addOrder(order:com.coder.core.controls.elisor.EventOrder):boolean
						{
							if(!order || !order.type || !order.oid)
							{
								return false;
							}
							var subHash:com.coder.utils.Hash = <Hash>flash.As3As(this._orderHash.getItem(order.oid),Hash);
							if(!subHash)
							{
								subHash = new Hash();
								this._orderHash.setItem(order.oid,subHash);
							}
							if(!subHash["has" + ""](order.type))
							{
								this._length++;
							}
							subHash["put" + ""](order.type,order,true);
							return true;
						}

						public removeEventOrder(oid:string,listenerType:string)
						{
							if(!listenerType || !oid)
							{
								return ;
							}
							var subHash:com.coder.utils.Hash = <Hash>flash.As3As(this._orderHash.getItem(oid),Hash);
							if(subHash)
							{
								var order:com.coder.core.controls.elisor.EventOrder = <com.coder.core.controls.elisor.EventOrder>flash.As3As(subHash["remove" + ""](listenerType),com.coder.core.controls.elisor.EventOrder);
								if(order)
								{
									this._length--;
									order.dispose();
								}
							}
						}

						public hasEventOrder(oid:string,listenerType:string):boolean
						{
							if(!listenerType || !oid)
							{
								return false;
							}
							var subHash:com.coder.utils.Hash = <Hash>flash.As3As(this._orderHash.getItem(oid),Hash);
							if(subHash)
							{
								return subHash["has" + ""](listenerType);
							}
							return false;
						}

						public takeOrder(oid:string,listenerType:string):com.coder.core.controls.elisor.EventOrder
						{
							if(!listenerType || !oid)
							{
								return null;
							}
							var subHash:com.coder.utils.Hash = <Hash>flash.As3As(this._orderHash.getItem(oid),Hash);
							if(subHash)
							{
								return <com.coder.core.controls.elisor.EventOrder>flash.As3As(subHash["take" + ""](listenerType),com.coder.core.controls.elisor.EventOrder);
							}
							return null;
						}

						public hasGroup(oid:string):boolean
						{
							var subHash:com.coder.utils.Hash = this._orderHash.getItem(oid);
							if(subHash)
							{
								return subHash["length" + ""] > 0;
							}
							return false;
						}

						public takeGroupOrder(oid:string):Array<com.coder.interfaces.system.IOrder>
						{
							var result:Array<com.coder.interfaces.system.IOrder> = new Array<com.coder.interfaces.system.IOrder>();
							var subHash:com.coder.utils.Hash = <Hash>flash.As3As(this._orderHash.getItem(oid),Hash);
							if(subHash)
							{
								for(var order_key_a in subHash)
								{
									var order:com.coder.core.controls.elisor.EventOrder = subHash[order_key_a];
									result.push(order);
								}
							}
							return result;
						}

						public disposeGroupOrders(oid:string)
						{
							var suhHash:com.coder.utils.Hash = <Hash>flash.As3As(this._orderHash.getItem(oid),Hash);
							this._orderHash.delItem(oid);
							if(suhHash)
							{
								for(var order_key_a in suhHash)
								{
									var order:com.coder.core.controls.elisor.EventOrder = suhHash[order_key_a];
									order.dispose();
									this._length--;
								}
								suhHash["dispose" + ""]();
							}
						}

						public dispose()
						{
							for(var forinvar__ in this._orderHash.map)
							{
								var key = this._orderHash.map[forinvar__][0];
								this.disposeGroupOrders(key);
							}
							this._orderHash = null;
							com.coder.core.controls.elisor.EventElisor._instance = null;
							super.dispose();
						}

					}
				}
			}
		}
	}
}

