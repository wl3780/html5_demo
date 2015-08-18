module engine {
	export interface INetworkModule extends IModule {

		addPackageHandler(packageId:string, module:IModule);

		addPackageParser(pClass:any);
	}
}

