module com {
	export module coder {
		export module core {
			export module controls {
				export module dock {
					export class Message extends com.coder.core.protos.Proto implements com.coder.interfaces.dock.IMessage {

						private _sender:string;
						private _actionOrder:string;
						private _messageType:string;
						private _geters:Array<string>;
						private _isDisposed:boolean = false;
						private _isRevived:boolean = false;

						public constructor()
						{
							super();
						}

						public send():boolean
						{
							if(this.checkFormat())
							{
								com.coder.core.controls.dock.MessageDock.getInstance().send(this);
								return true;
							}
							return false;
						}

						public get geters():Array<string>
						{
							return this._geters;
						}

						public get sender():string
						{
							return this._sender;
						}

						public get actionOrder():string
						{
							return this._actionOrder;
						}

						public get messageType():string
						{
							return this._messageType;
						}

						public checkFormat():boolean
						{
							if(this._actionOrder == null || this._geters == null || this._geters.length == 0)
							{
								return false;
							}
							return true;
						}

						public setup(actionOrder:string,geters:Array<string>,data:any = null,sender:string = null,messageType:string = com.coder.core.controls.dock.MessageConst.MODULE_TO_MODULE)
						{
							if(sender == null)
							{
								sender = com.coder.core.controls.dock.ModuleDock.DEFAULT_MODULE_NAME;
							}
							this._actionOrder = actionOrder;
							this._geters = geters;
							this._messageType = messageType;
							this._sender = sender;
							this.proto = data;
						}

						public recover()
						{
							com.coder.core.controls.dock.MessageDock.recover(this);
						}

						public dispose()
						{
							super.dispose();
							this._actionOrder = null;
							this._geters = null;
							this._messageType = null;
							this._sender = null;
							this._isDisposed = true;
							this._isRevived = false;
						}

						public revive()
						{
							this._actionOrder = null;
							this._geters = null;
							this._messageType = null;
							this._sender = null;
							this._isDisposed = false;
							this._isRevived = true;
						}

						public get isDisposed():boolean
						{
							return this._isDisposed;
						}

						public get isRevived():boolean
						{
							return this._isRevived;
						}

						public toString():string
						{
							var kName:string = egret.getQualifiedClassName(this);
							var result:string = "";
							result = result + "[" + kName.substr((kName.indexOf("::") + 2),kName.length) + " " + this.id + "] \n{\n";
							result = result + " messageType=" + this.messageType + " \n";
							result = result + " actionOrder=" + this.actionOrder + " \n";
							result = result + " sender=" + this.sender + " \n";
							if(this.messageType != com.coder.core.controls.dock.MessageConst.MODULE_TO_TOTAL_MODULE)
							{
								result = result + " geters=" + this.geters + " \n}\n";
							}
							else
							{
								result = result + " geters=total_module \n}\n";
							}
							return result;
						}

						public static sendToModule(actionOrder:string,geter:string,data:any = null,sender:string = null)
						{
							com.coder.core.controls.dock.Message.sendToModules(actionOrder,[geter],data,sender);
						}

						public static sendToModules(actionOrder:string,geters:Array<string>,data:any = null,sender:string = null)
						{
							var message:com.coder.core.controls.dock.Message = <com.coder.core.controls.dock.Message>flash.As3As(com.coder.core.controls.dock.MessageDock.produce(),com.coder.core.controls.dock.Message);
							message.setup(actionOrder,geters,data,sender,com.coder.core.controls.dock.MessageConst.MODULE_TO_MODULE);
							com.coder.core.controls.dock.MessageDock.getInstance().send(message);
						}

						public static sendToTotalModule(actionOrder:string,data:any = null,sender:string = null)
						{
							var message:com.coder.core.controls.dock.Message = <com.coder.core.controls.dock.Message>flash.As3As(com.coder.core.controls.dock.MessageDock.produce(),com.coder.core.controls.dock.Message);
							message.setup(actionOrder,com.coder.core.controls.dock.ModuleDock.modules,data,sender,com.coder.core.controls.dock.MessageConst.MODULE_TO_TOTAL_MODULE);
							com.coder.core.controls.dock.MessageDock.getInstance().send(message);
						}

						public static sendToService(data:com.coder.interfaces.dock.ISocket_tos,actionOrder:string = null,sender:string = null)
						{
							var message:com.coder.core.controls.dock.Message = <com.coder.core.controls.dock.Message>flash.As3As(com.coder.core.controls.dock.MessageDock.produce(),com.coder.core.controls.dock.Message);
							if(actionOrder == null)
							{
								actionOrder = com.coder.core.controls.dock.MessageConst.SEND_TO_SOCKET;
							}
							message.setup(actionOrder,[com.coder.core.controls.dock.ModuleDock.NETWORK_MODULE_NAME],data,sender,com.coder.core.controls.dock.MessageConst.MODULE_TO_SERVICE);
							com.coder.core.controls.dock.MessageDock.getInstance().send(message);
						}

						public static sendToSubs(actionOrder:string,data:any = null,sender:string = null)
						{
							if(sender && com.coder.core.controls.dock.ModuleDock.modules.indexOf(sender) >= 0)
							{
								com.coder.core.controls.dock.Message.sendToModule(actionOrder,sender,data,sender);
							}
						}

					}
				}
			}
		}
	}
}

flash.implementsClass("com.coder.core.controls.dock.Message",["com.coder.interfaces.dock.IMessage"]);