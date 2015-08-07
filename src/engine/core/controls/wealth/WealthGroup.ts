module com {
	export module coder {
		export module core {
			export module controls {
				export module wealth {
					export class WealthGroup extends com.coder.core.protos.Proto {

						public static instanceHash:com.coder.utils.Hash;
						public static _recoverQueue_:Array<com.coder.core.controls.wealth.WealthGroup>;
						public static _recoverIndex_:number;
						public type:number = 0;
						public loadedIndex:number = 0;
						protected _isDisposed_:boolean = false;
						private _wealths:flash.Dictionary;
						private _wealthUrls:Array<any>;
						private _loaded_:boolean = false;
						private _length:number = 0;

						public constructor()
						{
							super();
							com.coder.core.controls.wealth.WealthGroup.instanceHash["put" + ""](this._id_,this);
							this.type = com.coder.core.controls.wealth.WealthConst.PRIORITY_LEVEL;
							this._wealths = new flash.Dictionary();
							this._wealthUrls = [];
						}

						public static createWealthGroup():com.coder.core.controls.wealth.WealthGroup
						{
							var group:com.coder.core.controls.wealth.WealthGroup = null;
							if(com.coder.core.controls.wealth.WealthGroup._recoverQueue_.length)
							{
								group = com.coder.core.controls.wealth.WealthGroup._recoverQueue_.pop();
								com.coder.core.controls.wealth.WealthGroup.instanceHash["put" + ""](group.id,group);
							}
							else
							{
								group = new com.coder.core.controls.wealth.WealthGroup();
							}
							return group;
						}

						public get wealths():Array<any>
						{
							return this._wealthUrls;
						}

						public resetWealths()
						{
							this._wealthUrls.length = 0;
							this._wealths = new flash.Dictionary();
						}

						public sortOn(arr1:Array<any>,arr2:Array<any>)
						{
							flash.sortOn(this._wealthUrls,arr1,arr2);
						}

						public get loaded():boolean
						{
							return this._loaded_;
						}

						public set loaded(value:boolean)
						{
							this._loaded_ = value;
						}

						public addWealth(url:string,data:any = null,dataFormat:string = null,otherArgs:any = null,prio:number = -1):string
						{
							var wealthData:com.coder.core.controls.wealth.WealthData = new com.coder.core.controls.wealth.WealthData();
							wealthData.url = url;
							wealthData.data = data;
							wealthData.proto = otherArgs;
							wealthData.oid = this.id;
							wealthData.wid = this.oid_com_coder_core_controls_wealth_WealthGroup;
							if(prio != -1)
							{
								wealthData.prio = 0;
							}
							if(url.indexOf(com.coder.global.EngineGlobal.SM_EXTENSION) != -1)
							{
								wealthData.prio = 0;
							}
							if(dataFormat)
							{
								wealthData.dataFormat = dataFormat;
							}
							else
							{
								if(wealthData.type == com.coder.core.controls.wealth.WealthConst.BING_WEALTH)
								{
									if(com.coder.engine.Asswc.TEXT_Files.indexOf(wealthData.suffix) != -1)
									{
										wealthData.dataFormat = egret.URLLoaderDataFormat.TEXT;
									}
									else
									{
										wealthData.dataFormat = egret.URLLoaderDataFormat.BINARY;
									}
								}
							}
							this._wealths.setItem(wealthData.id,wealthData);
							this._wealthUrls.push(wealthData);
							return wealthData.id;
						}

						public takeWealthById(id:string):com.coder.core.controls.wealth.WealthData
						{
							return <com.coder.core.controls.wealth.WealthData>flash.As3As(this._wealths.getItem(id),com.coder.core.controls.wealth.WealthData);
						}

						public hashWealth(url:string):boolean
						{
							for(var wealthData_key_a in this._wealths.map)
							{
								var wealthData:com.coder.core.controls.wealth.WealthData = this._wealths.map[wealthData_key_a][1];
								if(wealthData.url == url)
								{
									return true;
								}
							}
							return false;
						}

						public removeWealthById(id:string)
						{
							var wealthData:com.coder.core.controls.wealth.WealthData = <com.coder.core.controls.wealth.WealthData>flash.As3As(this._wealths.getItem(id),com.coder.core.controls.wealth.WealthData);
							if(wealthData)
							{
								this._wealths.delItem(id);
								var index:number = this._wealthUrls.indexOf(wealthData);
								this._wealthUrls.splice(index,1);
								com.coder.core.controls.wealth.WealthElisor.getInstance().cancelWealth(wealthData.id);
							}
						}

						public set oid_com_coder_core_controls_wealth_WealthGroup(value:string)
						{
							this.oid = value;
							for(var wealthData_key_a in this._wealthUrls)
							{
								var wealthData:com.coder.core.controls.wealth.WealthData = this._wealthUrls[wealthData_key_a];
								wealthData.wid = value;
							}
						}

						public dispose()
						{
							com.coder.core.controls.wealth.WealthGroup.instanceHash["remove" + ""](this.id);
							this._wealths = null;
							this._wealthUrls = null;
							this._isDisposed_ = true;
							super.dispose();
						}

						public reset()
						{
							this._isDisposed_ = false;
							this._wealths = new flash.Dictionary();
							this._wealthUrls.length = 0;
						}

						public recover()
						{
							if(this._isDisposed_)
							{
								return ;
							}
							this.reset();
							if(com.coder.core.controls.wealth.WealthGroup._recoverQueue_.length <= com.coder.core.controls.wealth.WealthGroup._recoverIndex_)
							{
								com.coder.core.controls.wealth.WealthGroup._recoverQueue_.push(this);
							}
						}

						public getNextNeedWealthData():com.coder.core.controls.wealth.WealthData
						{
							for(var wealthData_key_a in this._wealthUrls)
							{
								var wealthData:com.coder.core.controls.wealth.WealthData = this._wealthUrls[wealthData_key_a];
								if(this.type == com.coder.core.controls.wealth.WealthConst.BUBBLE_LEVEL)
								{
									if(wealthData.loaded == false && wealthData.isPend == false)
									{
										return wealthData;
									}
									if(wealthData.loaded == false && wealthData.isPend)
									{
										return null;
									}
								}
								else
								{
									if(wealthData.loaded == false && wealthData.isPend == false)
									{
										return wealthData;
									}
								}
							}
							return null;
						}

						public checkTotalFinish()
						{
							var wealthData:com.coder.core.controls.wealth.WealthData = null;
							var wealthLen:number = this._wealths.getItem("length");
							var loadedCount:number = 0;
							var index:number = 0;
							while(index < wealthLen)
							{
								wealthData = this._wealthUrls[index];
								if(wealthData)
								{
									if(!wealthData.loaded)
									{
										this._loaded_ = false;
										break;
									}
									else
									{
										loadedCount++;
									}
								}
								index++;
							}
							this.loadedIndex = loadedCount;
							if(loadedCount >= wealthLen)
							{
								this._loaded_ = true;
							}
						}

						public get length():number
						{
							return this._wealthUrls.length;
						}

					}
				}
			}
		}
	}
}

com.coder.core.controls.wealth.WealthGroup.instanceHash = new Hash();
com.coder.core.controls.wealth.WealthGroup._recoverQueue_ = new Array<com.coder.core.controls.wealth.WealthGroup>();
com.coder.core.controls.wealth.WealthGroup._recoverIndex_ = 10;
