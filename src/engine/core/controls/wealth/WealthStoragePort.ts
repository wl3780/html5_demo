module engine {
	export class WealthStoragePort {

		public static _loaderInstanceHash_:Map<string, ILoader> = new Map<string, ILoader>();
		public static _wealthLoaderHash_:Map<string, string> = new Map<string, string>();

		public static depositWealth(path:string, loader_id:string) {
			WealthStoragePort._wealthLoaderHash_.set(path, loader_id);
		}
		public static takeLoaderByWealth(path:string):ILoader {
			var loader_id:string = WealthStoragePort._wealthLoaderHash_.get(path);
			var loader:ILoader = WealthStoragePort._loaderInstanceHash_.get(loader_id);
			return loader;
		}
		public static disposeLoaderByWealth(path:string) {
			var loader_id:string = WealthStoragePort._wealthLoaderHash_.get(path);
			var loader:ILoader = WealthStoragePort._loaderInstanceHash_.get(loader_id);
			if (loader) {
				WealthStoragePort._loaderInstanceHash_.delete(loader_id);
				loader.dispose();
			}
		}

		public static addLoader(loader:ILoader):void {
			WealthStoragePort._loaderInstanceHash_.set(loader.id, loader);
		}
		public static takeLoader(id:string):ILoader {
			return WealthStoragePort._loaderInstanceHash_.get(id);
		}
		public static removeLoader(id:string):boolean {
			return WealthStoragePort._loaderInstanceHash_.delete(id);
		}

	}
}
