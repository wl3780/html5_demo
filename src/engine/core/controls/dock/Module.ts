module engine {
	export class Module extends Proto implements IModule {

		protected _name_:string;
		protected _lock_:boolean = false;

		public constructor() {
			super();
			this._name_ = egret.getQualifiedClassName(this);
		}

		public register() {
			ModuleDock.addModule(this);
		}

		public unregister() {
			ModuleDock.removeModule(this.name);
		}

		public send(message:IMessage) {
			if (message && this.name) {
				message.sender = this.name;
				message.send();
			}
		}

		public subHandle(message:IMessage) {
		}

		public registerSubProxy(...args) {
			var proxy:SubProxy;
			args.forEach(item => {
				if (item instanceof SubProxy) {
					proxy = item;
				} else {
					proxy = new item();
					if(!proxy) {
						throw new Error("参数" + item + "不是SubProxy子类").message;
					}
				}
				if(proxy.checkFromat()) {
					proxy.oid = this.name;
					ModuleDock.addModuleSub(proxy);
				}
			});
		}

		public registerSubPackage(...args) {
			var module:INetworkModule = <INetworkModule>ModuleDock.takeModule(ModuleDock.NETWORK_MODULE_NAME);
			args.forEach(packageId => {
				module.addPackageHandler(packageId, this);
			});
		}

		public registerPackParser(...args) {
			var module:INetworkModule = <INetworkModule>ModuleDock.takeModule(ModuleDock.NETWORK_MODULE_NAME);
			args.forEach(pClass => {
				module.addPackageParser(pClass);
			});
		}

		public get name():string {
			return this._name_;
		}
		public set name(value:string) {
			this._name_ = value;
		}

		public get lock():boolean {
			return this._lock_;
		}
		public set lock(value:boolean) {
			this._lock_ = value;
		}

		public sendToModule(actionOrder:string, geter:string, data:any = null) {
			Message.sendToModule(actionOrder, geter, data, this.name);
		}

		public sendToModules(actionOrder:string, geters:Array<string>, data:any = null) {
			Message.sendToModules(actionOrder, geters, data, this.name);
		}

		public sendToTotalModule(actionOrder:string, data:any = null) {
			Message.sendToTotalModule(actionOrder, data, this.name);
		}

		public sendToService(data:ISocket_tos, actionOrder:string) {
			Message.sendToService(data, actionOrder, this.name);
		}

		public sendToSubs(actionOrder:string, data:any = null) {
			Message.sendToSubs(actionOrder, data, this.name);
		}

	}
}