module com {
	export module coder {
		export module utils {
			export class GameTimer extends egret.HashObject {

				public static _instance:com.coder.utils.GameTimer;
				private loopCallOrder:Array<Function>;
				private loopParamsOrder:Array<Array<any>>;
				private loopDelayOrder:Array<number>;
				private loopFrameOrder:Array<number>;
				private onceCallOrder:Array<Function>;
				private onceParamsOrder:Array<Array<any>>;
				private onceFrameOrder:Array<number>;
				private _frameIndex:number = 0;
				private _sysTimeStamp:number = 0;
				private _sysTimeRed:number = 0;

				public constructor()
				{
					super();
					this.loopCallOrder = new Array<Function>();
					this.loopParamsOrder = new Array<Array<any>>();
					this.loopDelayOrder = new Array<number>();
					this.loopFrameOrder = new Array<number>();
					this.onceCallOrder = new Array<Function>();
					this.onceParamsOrder = new Array<Array<any>>();
					this.onceFrameOrder = new Array<number>();
				}

				public static getInstance():com.coder.utils.GameTimer
				{
					return com.coder.utils.GameTimer._instance = com.coder.utils.GameTimer._instance || new com.coder.utils.GameTimer();
				}

				public setup(stage:egret.Stage)
				{
					stage.addEventListener(egret.Event.ENTER_FRAME,flash.bind(this.onEnterFrame,this),null);
				}

				public addLoopTime(delay:number,method:Function,args:Array<any> = null)
				{
					var frame:number = Math.ceil(delay * com.coder.engine.Engine.frameRate / 1000);
					this.addLoopFrame(frame,method,args);
				}

				public addOnceTime(delay:number,method:Function,args:Array<any> = null)
				{
					var frame:number = Math.ceil(delay * com.coder.engine.Engine.frameRate / 1000);
					this.addOnceFrame(frame,method,args);
				}

				public addLoopFrame(frame:number,method:Function,args:Array<any> = null)
				{
					if(frame)
					{
						this.loopDelayOrder.push(frame);
						this.loopCallOrder.push(method);
						this.loopParamsOrder.push(args);
						this.loopFrameOrder.push(this._frameIndex + frame);
					}
				}

				public addOnceFrame(frame:number,method:Function,args:Array<any> = null)
				{
					if(frame)
					{
						this.onceCallOrder.push(method);
						this.onceParamsOrder.push(args);
						this.onceFrameOrder.push(this._frameIndex + frame);
					}
				}

				public clearOrder(method:Function)
				{
					var index:number = this.loopCallOrder.indexOf(method);
					if(index != -1)
					{
						this.loopDelayOrder.splice(index,1);
						this.loopCallOrder.splice(index,1);
						this.loopParamsOrder.splice(index,1);
						this.loopFrameOrder.splice(index,1);
					}
					index = this.onceCallOrder.indexOf(method);
					if(index != -1)
					{
						this.onceCallOrder.splice(index,1);
						this.onceParamsOrder.splice(index,1);
						this.onceFrameOrder.splice(index,1);
					}
				}

				protected onEnterFrame(evt:egret.Event)
				{
					this._frameIndex++;
					var method:Function;
					var params:Array<any>;
					for(var index:number = this.loopCallOrder.length - 1;index >= 0; index--)
					{
						if(this._frameIndex >= this.loopFrameOrder[index])
						{
							method = this.loopCallOrder[index];
							params = this.loopParamsOrder[index];
							method.apply(null,params);
							this.loopFrameOrder[index] += this.loopDelayOrder[index];
						}
					}
					for(index = this.onceCallOrder.length - 1; index >= 0; index--)
					{
						if(this._frameIndex >= this.onceFrameOrder[index])
						{
							method = this.onceCallOrder[index];
							params = this.onceParamsOrder[index];
							this.clearOrder(method);
							method.apply(null,params);
						}
					}
				}

				public get sysTime():number
				{
					return this._sysTimeStamp + egret.getTimer() - this._sysTimeRed;
				}

				public set sysTime(value:number)
				{
					this._sysTimeStamp = value;
					this._sysTimeRed = egret.getTimer();
				}

			}
		}
	}
}

