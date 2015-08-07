module com {
	export module coder {
		export module core {
			export module controls {
				export module wealth {
					export class WealthData extends com.coder.core.protos.Proto {

						public static instanceHash:com.coder.utils.Hash;
						public data:any;
						public dataFormat:string = egret.URLLoaderDataFormat.TEXT;
						public loaded:boolean = false;
						public isSucc:boolean = false;
						public time:number = 0;
						public prio:number = 5;
						protected _wid_:string;
						private _url:string;
						private _type:string;
						private _suffix:string;
						private _isPend:boolean = false;

						public constructor()
						{
							super();
							com.coder.core.controls.wealth.WealthData.instanceHash["put" + ""](this.id,this);
						}

						public static getWealthData(id:string):com.coder.core.controls.wealth.WealthData
						{
							return <com.coder.core.controls.wealth.WealthData>flash.As3As(com.coder.core.controls.wealth.WealthData.instanceHash["take" + ""](id),com.coder.core.controls.wealth.WealthData);
						}

						public static removeWealthData(id:string):com.coder.core.controls.wealth.WealthData
						{
							return <com.coder.core.controls.wealth.WealthData>flash.As3As(com.coder.core.controls.wealth.WealthData.instanceHash["remove" + ""](id),com.coder.core.controls.wealth.WealthData);
						}

						public static resetInstanceHash()
						{
							com.coder.core.controls.wealth.WealthData.instanceHash["reset" + ""]();
						}

						public set wid(value:string)
						{
							this._wid_ = value;
						}

						public get wid():string
						{
							return this._wid_;
						}

						public get url():string
						{
							return this._url;
						}

						public set url(value:string)
						{
							this._url = value;
							if(value)
							{
								try 
								{
									this._suffix = value.split(".").pop();
									this._suffix = this._suffix.split("?").shift();
									if(com.coder.engine.Asswc.SWF_Files.indexOf(this._suffix) != -1)
									{
										this._type = com.coder.core.controls.wealth.WealthConst.SWF_WEALTH;
									}
									else if(com.coder.engine.Asswc.IMG_Files.indexOf(this._suffix) != -1)
									{
										this._type = com.coder.core.controls.wealth.WealthConst.IMG_WEALTH;
									}
									else
									{
										this._type = com.coder.core.controls.wealth.WealthConst.BING_WEALTH;
									}
								}
								catch(e)
								{
									com.coder.utils.log.Log.error(this,this.toString() + "请检查资源地址格式是否正确");
								}
							}
							this.time = egret.getTimer();
						}

						public get type():string
						{
							return this._type;
						}

						public get suffix():string
						{
							return this._suffix;
						}

						public set isPend(value:boolean)
						{
							this._isPend = value;
						}

						public get isPend():boolean
						{
							return this._isPend;
						}

						public dispose()
						{
							com.coder.core.controls.wealth.WealthData.removeWealthData(this.id);
							this._suffix = null;
							this._type = null;
							super.dispose();
						}

					}
				}
			}
		}
	}
}

com.coder.core.controls.wealth.WealthData.instanceHash = new Hash();
