module com {
	export module coder {
		export module core {
			export module controls {
				export module dock {
					export class Module extends com.coder.core.protos.Proto implements com.coder.interfaces.dock.IModule {

						protected _name_:string;
						protected _lock_:boolean = false;

						public constructor()
						{
							super();
							this.id = this._name_ = egret.getQualifiedClassName(this);
						}

						public register()
						{
							com.coder.core.controls.dock.ModuleDock.getInstance().addModule(this);
						}

						public unregister()
						{
							com.coder.core.controls.dock.ModuleDock.getInstance().removeModule(this.name);
						}

						public send(message:com.coder.interfaces.dock.IMessage)
						{
							com.coder.core.controls.dock.MessageDock.getInstance().send(message);
						}

						public subHandle(message:com.coder.interfaces.dock.IMessage)
						{
						}

						public registerSubProxy(...args)
						{
							var proxy:com.coder.core.controls.dock.SubProxy;
							for(var sub_key_a in args)
							{
								var sub:any = args[sub_key_a];
								if(flash.As3is(sub,any))
								{
									proxy = new sub();
									if(!proxy)
									{
										throw new flash.Error("参数" + sub + "不是SubProxy子类").message;
									}
								}
								else
								{
									if(flash.As3is(sub,com.coder.core.controls.dock.SubProxy))
									{
										proxy = sub;
									}
									else
									{
										throw new flash.Error("参数" + sub + "不是SubProxy子对象").message;
									}
								}
								if(proxy.checkFromat())
								{
									proxy.oid = this.name;
									com.coder.core.controls.dock.ModuleDock.getInstance().addModuleSub(proxy);
								}
							}
						}

						public registerSubPackage(...args)
						{
							var module:com.coder.core.controls.dock.INetworkModule = <com.coder.core.controls.dock.INetworkModule>flash.As3As(com.coder.core.controls.dock.ModuleDock.getInstance().takeModule(com.coder.core.controls.dock.ModuleDock.NETWORK_MODULE_NAME),"com.coder.core.controls.dock.INetworkModule");
							for(var packageId_key_a in args)
							{
								var packageId:string = args[packageId_key_a];
								module.addPackageHandler(packageId,this);
							}
						}

						public registerPackParser(...args)
						{
							var module:com.coder.core.controls.dock.INetworkModule = <com.coder.core.controls.dock.INetworkModule>flash.As3As(com.coder.core.controls.dock.ModuleDock.getInstance().takeModule(com.coder.core.controls.dock.ModuleDock.NETWORK_MODULE_NAME),"com.coder.core.controls.dock.INetworkModule");
							for(var pClass_key_a in args)
							{
								var pClass:any = args[pClass_key_a];
								module.addPackageParser(pClass);
							}
						}

						public get name():string
						{
							return this._name_;
						}

						public get lock():boolean
						{
							return this._lock_;
						}

						public set lock(value:boolean)
						{
							this._lock_ = value;
						}

						public sendToModule(actionOrder:string,geter:string,data:any = null)
						{
							com.coder.core.controls.dock.Message.sendToModule(actionOrder,geter,data,this.name);
						}

						public sendToModules(actionOrder:string,geters:Array<string>,data:any = null)
						{
							com.coder.core.controls.dock.Message.sendToModules(actionOrder,geters,data,this.name);
						}

						public sendToTotalModule(actionOrder:string,data:any = null)
						{
							com.coder.core.controls.dock.Message.sendToTotalModule(actionOrder,data,this.name);
						}

						public sendToService(data:com.coder.interfaces.dock.ISocket_tos,actionOrder:string)
						{
							com.coder.core.controls.dock.Message.sendToService(data,actionOrder,this.name);
						}

						public sendToSubs(actionOrder:string,data:any = null)
						{
							com.coder.core.controls.dock.Message.sendToSubs(actionOrder,data,this.name);
						}

					}
				}
			}
		}
	}
}

flash.implementsClass("com.coder.core.controls.dock.Module",["com.coder.interfaces.dock.IModule"]);