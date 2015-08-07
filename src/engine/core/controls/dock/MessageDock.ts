module com {
	export module coder {
		export module core {
			export module controls {
				export module dock {
					export class MessageDock extends egret.HashObject {

						public static RecoverMessages:Array<com.coder.interfaces.dock.IMessage>;
						public static RecoverSize:number;
						public static _instance:com.coder.core.controls.dock.MessageDock;
						public static getInstance():com.coder.core.controls.dock.MessageDock
						{
							return com.coder.core.controls.dock.MessageDock._instance = com.coder.core.controls.dock.MessageDock._instance || new com.coder.core.controls.dock.MessageDock();
						}

						public static recover(message:com.coder.interfaces.dock.IMessage)
						{
							if(com.coder.core.controls.dock.MessageDock.RecoverMessages.length < com.coder.core.controls.dock.MessageDock.RecoverSize)
							{
								com.coder.core.controls.dock.MessageDock.RecoverMessages.push(message);
							}
							else
							{
								message.dispose();
							}
						}

						public static produce():com.coder.interfaces.dock.IMessage
						{
							var message:com.coder.core.controls.dock.Message;
							if(com.coder.core.controls.dock.MessageDock.RecoverMessages.length)
							{
								message = <com.coder.core.controls.dock.Message>flash.As3As(com.coder.core.controls.dock.MessageDock.RecoverMessages.pop(),com.coder.core.controls.dock.Message);
								message.revive();
								message.id = com.coder.engine.Asswc.getSoleId();
							}
							else
							{
								message = new com.coder.core.controls.dock.Message();
							}
							return message;
						}

						public send(message:com.coder.interfaces.dock.IMessage)
						{
							if(!message.checkFormat())
							{
								return ;
							}
							switch(message.messageType)
							{
							case com.coder.core.controls.dock.MessageConst.MODULE_TO_MODULE :
								com.coder.core.controls.dock.ModuleDock.getInstance().sendToModules(message);
								break;
							case com.coder.core.controls.dock.MessageConst.MODULE_TO_TOTAL_MODULE :
								com.coder.core.controls.dock.ModuleDock.getInstance().sendToTotalModule(message);
								break;
							case com.coder.core.controls.dock.MessageConst.MODULE_TO_SERVICE :
								com.coder.core.controls.dock.ModuleDock.getInstance().sendToService(message);
								break;
							case com.coder.core.controls.dock.MessageConst.MODULE_TO_SUB :
								com.coder.core.controls.dock.ModuleDock.getInstance().sendToSubs(message);
								break;
							}
						}

					}
				}
			}
		}
	}
}

com.coder.core.controls.dock.MessageDock.RecoverMessages = new Array<com.coder.interfaces.dock.IMessage>();
com.coder.core.controls.dock.MessageDock.RecoverSize = 50;
