module engine {
	export class FPSUtils extends egret.HashObject {

		public static fps:number = 30;
		public static lost_fps:number = 0;

		private static maxCount:number = 10;
		private static fpsTime:number = 0;
		private static count:number = 0;

		private static _stage:egret.Stage;

		public static setup(s:egret.Stage) {
			s.addEventListener(egret.Event.ENTER_FRAME,FPSUtils.onEnterFrame,null);
			FPSUtils.fps = s.frameRate;
			FPSUtils._stage = s;
			FPSUtils.fpsTime = egret.getTimer();
			FPSUtils.count = 0;
		}

		private static onEnterFrame(event:egret.Event) {
			FPSUtils.count++;
			if(FPSUtils.count >= FPSUtils.maxCount) {
				FPSUtils.fps = Math.round(1000 * FPSUtils.maxCount / (egret.getTimer() - FPSUtils.fpsTime));
				var temp:number = FPSUtils._stage.frameRate - FPSUtils.fps;
				FPSUtils.lost_fps = (temp > 0) ? temp : 0;
				FPSUtils.count = 0;
				FPSUtils.fpsTime = egret.getTimer();
			}
		}

	}
}
