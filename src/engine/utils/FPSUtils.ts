module com {
	export module coder {
		export module utils {
			export class FPSUtils extends egret.HashObject {

				public static maxCount:number;
				public static _stage:egret.Stage;
				public static fpsTime:number = 0;
				public static count:number = 0;
				public static _fps:number;
				public static _lost_fps:number;
				public static get fps():number
				{
					return com.coder.utils.FPSUtils._fps;
				}

				public static get lost_fps():number
				{
					return com.coder.utils.FPSUtils._lost_fps;
				}

				public static setup(s:egret.Stage)
				{
					com.coder.utils.FPSUtils._fps = Math.round(s["frameRate" + ""]);
					s.addEventListener(egret.Event.ENTER_FRAME,com.coder.utils.FPSUtils.onEnterFrame,null);
					com.coder.utils.FPSUtils._stage = s;
					com.coder.utils.FPSUtils.fpsTime = egret.getTimer();
					com.coder.utils.FPSUtils.count = 0;
				}

				private static onEnterFrame(event:egret.Event)
				{
					com.coder.utils.FPSUtils.count = com.coder.utils.FPSUtils.count + 1;
					if(com.coder.utils.FPSUtils.count >= com.coder.utils.FPSUtils.maxCount)
					{
						com.coder.utils.FPSUtils._fps = Math.round(1000 * com.coder.utils.FPSUtils.maxCount / (egret.getTimer() - com.coder.utils.FPSUtils.fpsTime));
						var temp:number = com.coder.utils.FPSUtils._stage["frameRate" + ""] - com.coder.utils.FPSUtils._fps;
						com.coder.utils.FPSUtils._lost_fps = (temp > 0)?temp:0;
						com.coder.utils.FPSUtils.count = 0;
						com.coder.utils.FPSUtils.fpsTime = egret.getTimer();
					}
				}

			}
		}
	}
}

com.coder.utils.FPSUtils.maxCount = 10;
com.coder.utils.FPSUtils._fps = 30;
com.coder.utils.FPSUtils._lost_fps = 0;
