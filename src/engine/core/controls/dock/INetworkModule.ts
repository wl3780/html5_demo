module com {
	export module coder {
		export module core {
			export module controls {
				export module dock {
					export interface INetworkModule extends com.coder.interfaces.dock.IModule {

						addPackageHandler(packageId:string,module:com.coder.interfaces.dock.IModule);
						addPackageParser(pClass:any);
					}
				}
			}
		}
	}
}

