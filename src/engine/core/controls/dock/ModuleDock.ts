module com {
	export module coder {
		export module core {
			export module controls {
				export module dock {
					export class ModuleDock extends egret.HashObject {

						public static NETWORK_MODULE_NAME:string;
						public static DEFAULT_MODULE_NAME:string;
						public static _instance:com.coder.core.controls.dock.ModuleDock;
						public static moduleList:Array<string>;
						public static moduleHash:com.coder.utils.Hash;
						public static subscribes:com.coder.utils.Hash;
						public static getInstance():com.coder.core.controls.dock.ModuleDock
						{
							return com.coder.core.controls.dock.ModuleDock._instance = com.coder.core.controls.dock.ModuleDock._instance || new com.coder.core.controls.dock.ModuleDock();
						}

						public static get modules():Array<string>
						{
							return com.coder.core.controls.dock.ModuleDock.moduleList;
						}

						public static setup(moduleConst:any,networkModule:any)
						{
							var netModule:com.coder.core.controls.dock.INetworkModule = new networkModule();
							netModule.register();
							var kName:string = null;
							var klass:any = null;
							var module:com.coder.interfaces.dock.IModule = null;
							var refXML:flash.XML = flash.describeType(moduleConst);
							var constItems:flash.XMLList = refXML.child("constant");
							for(var item_key_a in constItems)
							{
								var item:flash.XML = constItems[item_key_a];
								kName = moduleConst[item.dotAlt("name")];
								klass = <any>flash.getDefinitionByName(kName);
								module = <com.coder.interfaces.dock.IModule>flash.As3As(new klass(),"com.coder.interfaces.dock.IModule");
								if(module)
								{
									module.register();
								}
								else
								{
									throw new flash.Error("常量" + kName + "不是Module子类定义").message;
								}
							}
						}

						public addModule(module:com.coder.interfaces.dock.IModule)
						{
							if(!com.coder.core.controls.dock.ModuleDock.moduleHash["has" + ""](module.name))
							{
								com.coder.core.controls.dock.ModuleDock.moduleHash["put" + ""](module.name,module);
								com.coder.core.controls.dock.ModuleDock.moduleList.push(module.name);
							}
						}

						public takeModule(module_id:string):com.coder.interfaces.dock.IModule
						{
							return <com.coder.interfaces.dock.IModule>flash.As3As(com.coder.core.controls.dock.ModuleDock.moduleHash["take" + ""](module_id),"com.coder.interfaces.dock.IModule");
						}

						public removeModule(module_id:string):com.coder.interfaces.dock.IModule
						{
							var module:com.coder.interfaces.dock.IModule = <com.coder.interfaces.dock.IModule>flash.As3As(com.coder.core.controls.dock.ModuleDock.moduleHash["remove" + ""](module_id),"com.coder.interfaces.dock.IModule");
							var index:number = com.coder.core.controls.dock.ModuleDock.moduleList.indexOf(module_id);
							if(index != -1)
							{
								com.coder.core.controls.dock.ModuleDock.moduleList.splice(index,1);
							}
							return module;
						}

						public addModuleSub(subProxy:com.coder.core.controls.dock.SubProxy)
						{
							var subList:Array<com.coder.core.controls.dock.SubProxy>;
							if(!com.coder.core.controls.dock.ModuleDock.subscribes["has" + ""](subProxy.oid))
							{
								subList = new Array<com.coder.core.controls.dock.SubProxy>();
								com.coder.core.controls.dock.ModuleDock.subscribes["put" + ""](subProxy.oid,subList);
							}
							else
							{
								subList = <Array<com.coder.core.controls.dock.SubProxy>>flash.As3As(com.coder.core.controls.dock.ModuleDock.subscribes["take" + ""](subProxy.oid),Array<com.coder.core.controls.dock.SubProxy>);
							}
							var index:number = subList.indexOf(subProxy);
							if(index == -1)
							{
								subList.push(subProxy);
							}
						}

						public removeModeleSub(subProxy:com.coder.core.controls.dock.SubProxy)
						{
							var subList:Array<com.coder.core.controls.dock.SubProxy> = <Array<com.coder.core.controls.dock.SubProxy>>flash.As3As(com.coder.core.controls.dock.ModuleDock.subscribes["take" + ""](subProxy.oid),Array<com.coder.core.controls.dock.SubProxy>);
							if(subList && subList.length)
							{
								var index:number = subList.indexOf(subProxy);
								if(index >= 0)
								{
									subList.splice(index,1);
								}
							}
						}

						public sendToModules(message:com.coder.interfaces.dock.IMessage)
						{
							var module:com.coder.interfaces.dock.IModule = null;
							var subList:Array<com.coder.core.controls.dock.SubProxy>;
							var geters:Array<string> = message.geters;
							for(var item_key_a in geters)
							{
								var item:string = geters[item_key_a];
								module = this.takeModule(item);
								if(module && !module.lock && item != com.coder.core.controls.dock.ModuleDock.NETWORK_MODULE_NAME)
								{
									module.subHandle(message);
									subList = <Array<com.coder.core.controls.dock.SubProxy>>flash.As3As(com.coder.core.controls.dock.ModuleDock.subscribes["take" + ""](item),Array<com.coder.core.controls.dock.SubProxy>);
									for(var proxy_key_a in subList)
									{
										var proxy:com.coder.core.controls.dock.SubProxy = subList[proxy_key_a];
										if(!proxy.lock)
										{
											proxy.subHandle(message);
										}
									}
								}
							}
							com.coder.core.controls.dock.MessageDock.recover(message);
						}

						public sendToSubs(message:com.coder.interfaces.dock.IMessage)
						{
							this.sendToModules(message);
						}

						public sendToTotalModule(message:com.coder.interfaces.dock.IMessage)
						{
							this.sendToModules(message);
						}

						public sendToService(message:com.coder.interfaces.dock.IMessage)
						{
							var netModule:com.coder.core.controls.dock.INetworkModule = <com.coder.core.controls.dock.INetworkModule>flash.As3As(this.takeModule(com.coder.core.controls.dock.ModuleDock.NETWORK_MODULE_NAME),"com.coder.core.controls.dock.INetworkModule");
							if(netModule && !netModule.lock)
							{
								netModule.subHandle(message);
								var subList:Array<com.coder.core.controls.dock.SubProxy> = <Array<com.coder.core.controls.dock.SubProxy>>flash.As3As(com.coder.core.controls.dock.ModuleDock.subscribes["take" + ""](com.coder.core.controls.dock.ModuleDock.NETWORK_MODULE_NAME),Array<com.coder.core.controls.dock.SubProxy>);
								for(var proxy_key_a in subList)
								{
									var proxy:com.coder.core.controls.dock.SubProxy = subList[proxy_key_a];
									if(!proxy.lock)
									{
										proxy.subHandle(message);
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

com.coder.core.controls.dock.ModuleDock.NETWORK_MODULE_NAME = egret.getQualifiedClassName(com.coder.core.controls.dock.INetworkModule);
com.coder.core.controls.dock.ModuleDock.DEFAULT_MODULE_NAME = egret.getQualifiedClassName(com.coder.core.controls.dock.DefaultModule);
com.coder.core.controls.dock.ModuleDock.moduleList = new Array<string>();
com.coder.core.controls.dock.ModuleDock.moduleHash = new Hash();
com.coder.core.controls.dock.ModuleDock.subscribes = new Hash();
