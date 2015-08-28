module engine {
	export class WealthStoragePort {

		public static _loaderInstanceHash_:Map<string, ILoader> = new Map<string, ILoader>();
		public static _wealthLoaderHash_:Map<string, string> = new Map<string, string>();
		public static _symbolIntanceHash_:Map<string, ProtoURLLoader> = new Map<string, ProtoURLLoader>();

		public static removeWealth(path:string) {
			var loader_id:string = WealthStoragePort._loaderInstanceHash_.get(path);
			for(var key in WealthStoragePort._symbolIntanceHash_) {
				if(key.indexOf(path) != -1) {
					WealthStoragePort._symbolIntanceHash_.delete(key);
				}
			}
		}

		public static depositWealth(path:string, loader_id:string) {
			WealthStoragePort._loaderInstanceHash_.set(path, loader_id);
		}

		public static takeLoaderByWealth(path:string):ProtoURLLoader {
			var loader_id:string = WealthStoragePort._loaderInstanceHash_.get(path);
			var loader:ProtoURLLoader = WealthElisor.loaderInstanceHash.get(loader_id);
			return loader;
		}

		public static disposeLoaderByWealth(path:string) {
			var loader_id:string = WealthStoragePort._loaderInstanceHash_.get(path);
			var loader:ProtoURLLoader = WealthElisor.loaderInstanceHash.delete(loader_id);
			if(loader) {
				loader.dispose();
			}
		}

		public static hasWealth(path:string):boolean {
			for(var key in WealthStoragePort._symbolIntanceHash_) {
				if(key.indexOf(path) != -1) {
					return true;
				}
			}
			return false;
		}

		public static addLoader(loader:ILoader):void {
			WealthStoragePort._loaderInstanceHash_.set(loader.id, loader);
		}
		public static takeLoader(id:String):ILoader {
			return WealthStoragePort._loaderInstanceHash_.get(id);
		}
		public static removeLoader(id:String):boolean {
			return WealthStoragePort._loaderInstanceHash_.delete(id);
		}

	}
}
