module com {
	export module coder {
		export module core {
			export module controls {
				export module dock {
					export class SubProxy extends com.coder.core.protos.Proto implements com.coder.interfaces.dock.IProxy {

						private _lock:boolean = false;

						public constructor()
						{
							super();
						}

						public send(message:com.coder.interfaces.dock.IMessage)
						{
							com.coder.core.controls.dock.MessageDock.getInstance().send(message);
						}

						public checkFromat():boolean
						{
							return true;
						}

						public subHandle(message:com.coder.interfaces.dock.IMessage)
						{
						}

						public get lock():boolean
						{
							return this._lock;
						}

						public set lock(value:boolean)
						{
							this._lock = value;
						}

						public sendToModule(actionOrder:string,geter:string,data:any = null)
						{
							com.coder.core.controls.dock.Message.sendToModule(actionOrder,geter,data,this.oid);
						}

						public sendToModules(actionOrder:string,gaters:Array<string>,data:any = null)
						{
							com.coder.core.controls.dock.Message.sendToModules(actionOrder,gaters,data,this.oid);
						}

						public sendToTotalModule(actionOrder:string,data:any = null)
						{
							com.coder.core.controls.dock.Message.sendToTotalModule(actionOrder,data,this.oid);
						}

						public sendToService(data:com.coder.interfaces.dock.ISocket_tos,actionOrder:string = null)
						{
							com.coder.core.controls.dock.Message.sendToService(data,actionOrder,this.oid);
						}

						public sendToSubs(actionOrder:string,data:any = null)
						{
							com.coder.core.controls.dock.Message.sendToSubs(actionOrder,data,this.oid);
						}

					}
				}
			}
		}
	}
}

flash.implementsClass("com.coder.core.controls.dock.SubProxy",["com.coder.interfaces.dock.IProxy"]);