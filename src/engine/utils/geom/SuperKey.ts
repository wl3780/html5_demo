module com {
	export module coder {
		export module utils {
			export module geom {
				export class SuperKey extends egret.EventDispatcher {

					public static SUPER:string;
					public static DEBUG:string;
					public static HELLP:string;
					public static GM:string;
					public static KEY:string;
					public static _instance:com.coder.utils.geom.SuperKey;
					private keyArray:Array<any>;
					private stage:egret.Stage;
					private time:number = 0;
					private inputMode:boolean = false;
					private inputTime:number = 0;

					public constructor()
					{
						super();
						this.keyArray = [];
					}

					public static getInstance():com.coder.utils.geom.SuperKey
					{
						return com.coder.utils.geom.SuperKey._instance = com.coder.utils.geom.SuperKey._instance || new com.coder.utils.geom.SuperKey();
					}

					public setup(stage:egret.Stage)
					{
						this.stage = stage;
						this.stage.addEventListener(flash.KeyboardEvent.KEY_DOWN,flash.bind(this.keydownFunc,this),null);
						this.stage.addEventListener(flash.KeyboardEvent.KEY_UP,flash.bind(this.keyupFunc,this),null);
					}

					private keydownFunc(evt:flash.KeyboardEvent)
					{
						this.dispatchEvent(evt);
						if(this.inputMode)
						{
							if((egret.getTimer() - this.inputTime) > 10000)
							{
								this.inputMode = false;
								this.keyArray.length = 0;
								return ;
							}
							if(evt.shiftKey && evt.keyCode == 16)
							{
								this.keyArray.length = 0;
							}
							if((egret.getTimer() - this.time) < 1000 || this.time == 0)
							{
								this.time = egret.getTimer();
								this.keyArray.push(String.fromCharCode(evt.keyCode));
							}
							else
							{
								this.time = 0;
								this.keyArray.length = 0;
								this.keyArray.push(String.fromCharCode(evt.keyCode));
							}
						}
						if(evt.shiftKey && String.fromCharCode(evt.keyCode) == "¿")
						{
							this.dispatchEvent(new egret.Event(com.coder.utils.geom.SuperKey.KEY));
							this.inputMode = true;
							this.inputTime = egret.getTimer();
							this.keyArray.length = 0;
						}
						var input:string = this.keyArray.join("");
						if(input == com.coder.utils.geom.SuperKey.SUPER)
						{
							this.dispatchEvent(new egret.Event(com.coder.utils.geom.SuperKey.SUPER));
						}
						else if(input == com.coder.utils.geom.SuperKey.DEBUG)
						{
							this.dispatchEvent(new egret.Event(com.coder.utils.geom.SuperKey.DEBUG));
						}
						else if(input == com.coder.utils.geom.SuperKey.HELLP)
						{
							this.dispatchEvent(new egret.Event(com.coder.utils.geom.SuperKey.HELLP));
						}
						else if(input == com.coder.utils.geom.SuperKey.GM)
						{
							this.dispatchEvent(new egret.Event(com.coder.utils.geom.SuperKey.GM));
						}
						this.stage.removeEventListener(flash.KeyboardEvent.KEY_DOWN,flash.bind(this.keydownFunc,this),null);
						this.stage.removeEventListener(flash.KeyboardEvent.KEY_UP,flash.bind(this.keyupFunc,this),null);
						this.stage.addEventListener(flash.KeyboardEvent.KEY_DOWN,flash.bind(this.keydownFunc,this),null);
						this.stage.addEventListener(flash.KeyboardEvent.KEY_UP,flash.bind(this.keyupFunc,this),null);
					}

					private keyupFunc(e:flash.KeyboardEvent)
					{
						this.dispatchEvent(e);
					}

				}
			}
		}
	}
}

com.coder.utils.geom.SuperKey.SUPER = "SAIMAN";
com.coder.utils.geom.SuperKey.DEBUG = "DEBUG";
com.coder.utils.geom.SuperKey.HELLP = "HELLP";
com.coder.utils.geom.SuperKey.GM = "GM";
com.coder.utils.geom.SuperKey.KEY = "KEY";
