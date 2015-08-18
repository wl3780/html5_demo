module engine {
	export class SubProxy extends Proto implements IProxy {

		private _lock:boolean = false;

		public constructor() {
			super();
		}

		public send(message:IMessage) {
			if (message && this.oid) {
				message.sender = this.oid;
				message.send();
			}
		}

		public checkFromat():boolean {
			return true;
		}

		public subHandle(message:IMessage) {
		}

		public get lock():boolean {
			return this._lock;
		}
		public set lock(value:boolean) {
			this._lock = value;
		}

		public sendToModule(actionOrder:string, geter:string, data:any = null) {
			Message.sendToModule(actionOrder, geter, data, this.oid);
		}

		public sendToModules(actionOrder:string, geters:Array<string>, data:any = null) {
			Message.sendToModules(actionOrder, geters, data, this.oid);
		}

		public sendToTotalModule(actionOrder:string, data:any = null) {
			Message.sendToTotalModule(actionOrder, data, this.oid);
		}

		public sendToService(data:ISocket_tos, actionOrder:string = null) {
			Message.sendToService(data, actionOrder, this.oid);
		}

		public sendToSubs(actionOrder:string, data:any = null) {
			Message.sendToSubs(actionOrder, data, this.oid);
		}

	}
}