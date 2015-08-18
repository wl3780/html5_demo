module engine {
	export class ModuleDock {

		public static NETWORK_MODULE_NAME:string = egret.getQualifiedClassName(INetworkModule);
		public static DEFAULT_MODULE_NAME:string = egret.getQualifiedClassName(DefaultModule);

		private static moduleList:Array<string> = [];
		private static moduleHash:Map<string, IModule> = new Map<string, IModule>();
		private static subscribes:Map<string, Array<IProxy>> = new Map<string, Array<IProxy>>();

		public static get modules():Array<string> {
			return ModuleDock.moduleList;
		}

		public static setup(moduleConst:any, networkModule:any) {
			var netModule:INetworkModule = new networkModule();
			netModule.register();

			var kName:string = null;
			var module:IModule = null;
			for (var item_key in moduleConst) {
				kName = moduleConst[item_key];
				module = ObjectUtils.newInstance(kName);
				if (module) {
					module.register();
				} else {
					throw new Error("常量" + kName + "不是Module子类定义");
				}
			}
		}

		public static addModule(module:IModule) {
			if (ModuleDock.moduleHash.has(module.name) == false) {
				ModuleDock.moduleHash.set(module.name, module);
				ModuleDock.moduleList.push(module.name);
			}
		}

		public static takeModule(module_name:string):IModule {
			return ModuleDock.moduleHash.get(module_name);
		}

		public static removeModule(module_name:string) {
			ModuleDock.moduleHash.delete(module_name);
			var index:number = ModuleDock.moduleList.indexOf(module_name);
			if (index != -1) {
				ModuleDock.moduleList.splice(index,1);
			}
		}

		public static addModuleSub(subProxy:SubProxy) {
			var subList:Array<SubProxy>;
			if (ModuleDock.subscribes.has(subProxy.oid) == false) {
				subList = [];
				ModuleDock.subscribes.set(subProxy.oid, subList);
			} else {
				subList = ModuleDock.subscribes.get(subProxy.oid);
			}
			var index:number = subList.indexOf(subProxy);
			if (index == -1) {
				subList.push(subProxy);
			}
		}

		public static removeModeleSub(subProxy:SubProxy) {
			var subList:Array<SubProxy> = ModuleDock.subscribes.get(subProxy.oid);
			if (subList && subList.length) {
				var index:number = subList.indexOf(subProxy);
				if (index >= 0) {
					subList.splice(index, 1);
				}
			}
		}

		public static sendToModules(message:IMessage) {
			var module:IModule = null;
			var subList:Array<SubProxy>;
			var geters:Array<string> = message.geters;
			geters.forEach(geterName => {
				module = this.takeModule(geterName);
				if(module && !module.lock && geterName != ModuleDock.NETWORK_MODULE_NAME) {
					module.subHandle(message);
					subList = ModuleDock.subscribes.get(geterName);
					subList.forEach(proxy => {
						if(!proxy.lock) {
							proxy.subHandle(message);
						}
					});
				}
			});
			message.recover();
		}

		public static sendToService(message:IMessage) {
			var netModule:INetworkModule = <INetworkModule>ModuleDock.takeModule(ModuleDock.NETWORK_MODULE_NAME);
			if(netModule && !netModule.lock) {
				netModule.subHandle(message);
				var subList:Array<SubProxy> = ModuleDock.subscribes.get(netModule.name);
				subList.forEach(proxy => {
					if(!proxy.lock) {
						proxy.subHandle(message);
					}
				});
			}
		}

	}
}
