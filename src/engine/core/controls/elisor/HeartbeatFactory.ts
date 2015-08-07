module com {
	export module coder {
		export module core {
			export module controls {
				export module elisor {
					export class HeartbeatFactory extends egret.HashObject {

						public static _instance_:com.coder.core.controls.elisor.HeartbeatFactory;
						private hash:flash.Dictionary;
						private unstageFrameOrder:Array<Function>;
						private stageFrameOrder:Array<Function>;
						private stageFrameOrderTarget:Array<egret.DisplayObject>;
						private heartbeatIndex:number = 0;
						private heartbeatSize:number = 0;
						private startIndex:number = 0;
						private endIndex:number = 0;

						public constructor()
						{
							super();
							super();
							this.hash = new flash.Dictionary();
							this.unstageFrameOrder = new Array<Function>();
							this.stageFrameOrder = new Array<Function>();
							this.stageFrameOrderTarget = new Array<egret.DisplayObject>();
						}

						public static getInstance():com.coder.core.controls.elisor.HeartbeatFactory
						{
							return com.coder.core.controls.elisor.HeartbeatFactory._instance_ = com.coder.core.controls.elisor.HeartbeatFactory._instance_ || new com.coder.core.controls.elisor.HeartbeatFactory();
						}

						public setup(stage:egret.Stage)
						{
							stage.addEventListener(egret.Event.ENTER_FRAME,flash.bind(this.onEnterFrame,this),null);
						}

						protected onEnterFrame(event:egret.Event)
						{
							var index:number = 0;
							var len:number = 0;
							var order:Function = null;
							if(this.unstageFrameOrder.length)
							{
								com.coder.utils.FPSUtils.fps < 3?this.heartbeatSize = 2:this.heartbeatSize = 6;
								this.heartbeatIndex = Math.ceil(this.unstageFrameOrder.length / this.heartbeatSize);
								for(index = 0,len = this.unstageFrameOrder.length - this.heartbeatIndex; index < len; index++)
								{
									if(this.startIndex >= this.unstageFrameOrder.length)
									{
										this.startIndex = 0;
									}
									order = this.unstageFrameOrder[this.startIndex];
									order.apply();
									this.startIndex++;
								}
							}
							var dis:egret.DisplayObject = null;
							for(index = 0,len = this.stageFrameOrder.length; index < len; index++)
							{
								dis = this.stageFrameOrderTarget[index];
								if(dis.stage)
								{
									order = this.stageFrameOrder[index];
									order.apply();
								}
							}
						}

						public addFrameOrder(listener:Function,onStageTarget:egret.DisplayObject = null)
						{
							if(this.hash.getItem(listener) == null)
							{
								this.hash.setItem(listener,{onStageTarget:onStageTarget});
								if(onStageTarget)
								{
									this.stageFrameOrder.push(listener);
									this.stageFrameOrderTarget.push(onStageTarget);
								}
								else
								{
									this.unstageFrameOrder.push(listener);
								}
							}
						}

						public removeFrameOrder(listener:Function)
						{
							if(this.hash.getItem(listener) != null)
							{
								var dis:egret.DisplayObject = <egret.DisplayObject>flash.As3As(this.hash.getItem(listener).onStageTarget,egret.DisplayObject);
								this.hash.delItem(listener);
								var index:number = 0;
								if(!dis)
								{
									index = this.unstageFrameOrder.indexOf(listener);
									if(index != -1)
									{
										this.unstageFrameOrder.splice(index,1);
									}
								}
								else
								{
									index = this.stageFrameOrder.indexOf(listener);
									if(index != -1)
									{
										this.stageFrameOrder.splice(index,1);
										this.stageFrameOrderTarget.splice(index,1);
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

