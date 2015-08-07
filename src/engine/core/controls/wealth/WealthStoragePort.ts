module com {
	export module coder {
		export module core {
			export module controls {
				export module wealth {
					export class WealthStoragePort extends com.coder.core.protos.Proto {

						public static _symbolIntanceHash_:com.coder.utils.Hash;
						public static _loaderInstanceHash_:com.coder.utils.Hash;
						public static removeWealth(path:string)
						{
							var loader_id:string = <string>com.coder.core.controls.wealth.WealthStoragePort._loaderInstanceHash_["remove" + ""](path);
							for(var key in com.coder.core.controls.wealth.WealthStoragePort._symbolIntanceHash_)
							{
								if(key.indexOf(path) != -1)
								{
									com.coder.core.controls.wealth.WealthStoragePort._symbolIntanceHash_["remove" + ""](key);
								}
							}
						}

						public static depositWealth(path:string,loader_id:string)
						{
							com.coder.core.controls.wealth.WealthStoragePort._loaderInstanceHash_["put" + ""](path,loader_id);
						}

						public static takeLoaderByWealth(path:string):com.coder.interfaces.display.ILoader
						{
							var loader_id:string = <string>com.coder.core.controls.wealth.WealthStoragePort._loaderInstanceHash_["take" + ""](path);
							var loader:com.coder.interfaces.display.ILoader = <com.coder.interfaces.display.ILoader>flash.As3As(com.coder.core.controls.wealth.WealthElisor.loaderInstanceHash["take" + ""](loader_id),"com.coder.interfaces.display.ILoader");
							return loader;
						}

						public static disposeLoaderByWealth(path:string)
						{
							var loader_id:string = <string>com.coder.core.controls.wealth.WealthStoragePort._loaderInstanceHash_["take" + ""](path);
							var loader:com.coder.interfaces.display.ILoader = <com.coder.interfaces.display.ILoader>flash.As3As(com.coder.core.controls.wealth.WealthElisor.loaderInstanceHash["remove" + ""](loader_id),"com.coder.interfaces.display.ILoader");
							if(loader)
							{
								loader.dispose();
							}
						}

						public static hasWealth(path:string):boolean
						{
							for(var key in com.coder.core.controls.wealth.WealthStoragePort._symbolIntanceHash_)
							{
								if(key.indexOf(path) != -1)
								{
									return true;
								}
							}
							return false;
						}

						public static getSymbolIntance(path:string,symbol:string = null):any
						{
							var key:string = symbol?path + com.coder.engine.Asswc.SIGN + symbol:path;
							var result:any = com.coder.core.controls.wealth.WealthStoragePort._symbolIntanceHash_["take" + ""](key);
							if(result)
							{
								return result;
							}
							var cls:any = com.coder.core.controls.wealth.WealthStoragePort.getClass(path,symbol);
							if(cls)
							{
								result = new cls();
								com.coder.core.controls.wealth.WealthStoragePort._symbolIntanceHash_["put" + ""](key,result);
								return result;
							}
							return null;
						}

						public static getClass(path:string,symbol:string):any
						{
							var loader:com.coder.core.displays.items.unit.DisplayLoader = <com.coder.core.displays.items.unit.DisplayLoader>flash.As3As(com.coder.core.controls.wealth.WealthStoragePort.takeLoaderByWealth(path),com.coder.core.displays.items.unit.DisplayLoader);
							if(loader)
							{
								return <any>loader.contentLoaderInfo.applicationDomain.getDefinition(symbol);
							}
							return null;
						}

						public static clear()
						{
							com.coder.core.displays.avatar.AvatarRequestElisor.getInstance().clear();
						}

						public static clean(idName:string)
						{
							var resource:any;
							for(var key in com.coder.core.controls.wealth.WealthStoragePort._symbolIntanceHash_)
							{
								if(key.indexOf(idName) != -1)
								{
									resource = com.coder.core.controls.wealth.WealthStoragePort._symbolIntanceHash_["remove" + ""](key);
									if(flash.As3is(resource,flash.BitmapData))
									{
										(<flash.BitmapData>flash.As3As(resource,flash.BitmapData)).dispose();
									}
								}
							}
						}

					}
				}
			}
		}
	}
}

com.coder.core.controls.wealth.WealthStoragePort._symbolIntanceHash_ = new Hash();
com.coder.core.controls.wealth.WealthStoragePort._loaderInstanceHash_ = new Hash();
