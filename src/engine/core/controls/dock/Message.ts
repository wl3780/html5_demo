module engine {
	export class Message extends Proto implements IMessage {

		private static RecoverMessages:Array<Message> = [];
		private static RecoverSize:number = 50;

		private _sender:string;
		private _actionOrder:string;
		private _messageType:string;
		private _geters:Array<string>;
		private _isDisposed:boolean = false;

		public constructor() {
			super();
		}

		public send():boolean {
			if(this.checkFormat()) {
				Message.send(this);
				return true;
			}
			return false;
		}

		public checkFormat():boolean {
			if(this._actionOrder == null || this._geters == null || this._geters.length == 0) {
				return false;
			}
			return true;
		}

		public setup(actionOrder:string, geters:Array<string>, data:any = null, sender:string = null, messageType:string = MessageConst.MODULE_TO_MODULE) {
			if (sender == null) {
				sender = ModuleDock.DEFAULT_MODULE_NAME;
			}
			this._actionOrder = actionOrder;
			this._geters = geters;
			this._messageType = messageType;
			this._sender = sender;
			this.proto = data;
		}

		public get geters():Array<string> {
			return this._geters;
		}

		public get sender():string {
			return this._sender;
		}

		public get actionOrder():string {
			return this._actionOrder;
		}

		public get messageType():string {
			return this._messageType;
		}

		public get isDisposed():boolean {
			return this._isDisposed;
		}

		public recover() {
			if (this.isDisposed) {
				return;
			}
			if (Message.RecoverMessages.length < Message.RecoverSize) {
				Message.RecoverMessages.push(this);
			} else {
				this.dispose();
			}
		}

		public dispose() {
			this._sender = null;
			this._geters = null;
			this._actionOrder = null;
			this._messageType = null;
			this._isDisposed = true;
			super.dispose();
		}

		private static produce():Message {
			var message:Message;
			if(Message.RecoverMessages.length) {
				message = Message.RecoverMessages.pop();
				message.id = Engine.getSoleId();
			} else {
				message = new Message();
			}
			return message;
		}

		private static send(message:IMessage) {
			switch (message.messageType) {
				case MessageConst.MODULE_TO_MODULE:
					ModuleDock.sendToModules(message);
					break;
				case MessageConst.MODULE_TO_SERVICE:
					ModuleDock.sendToService(message);
					break;
			}
		}

		public static sendToModule(actionOrder:string, geter:string, data:any = null, sender:string = null) {
			Message.sendToModules(actionOrder, [geter], data, sender);
		}

		public static sendToModules(actionOrder:string, geters:Array<string>, data:any = null, sender:string = null) {
			var message:Message = Message.produce();
			message.setup(actionOrder, geters, data, sender, MessageConst.MODULE_TO_MODULE);
			Message.send(message);
		}

		public static sendToTotalModule(actionOrder:string, data:any = null, sender:string = null) {
			var message:Message = Message.produce();
			message.setup(actionOrder, ModuleDock.modules, data, sender, MessageConst.MODULE_TO_MODULE);
			Message.send(message);
		}

		public static sendToService(data:ISocket_tos, actionOrder:string = null, sender:string = null) {
			var message:Message = Message.produce();
			if (actionOrder == null) {
				actionOrder = MessageConst.SEND_TO_SOCKET;
			}
			message.setup(actionOrder, [ModuleDock.NETWORK_MODULE_NAME], data, sender, MessageConst.MODULE_TO_SERVICE);
			Message.send(message);
		}

		public static sendToSubs(actionOrder:string, data:any = null, sender:string = null) {
			if(sender && ModuleDock.modules.indexOf(sender) >= 0) {
				Message.sendToModule(actionOrder, sender, data, sender);
			}
		}

	}
}
