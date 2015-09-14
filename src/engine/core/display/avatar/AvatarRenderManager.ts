module engine {
	export class AvatarRenderManager {

		public static renderNum:number = 2;

		public static _instance_:AvatarRenderManager;

		private checkTime:number = 0;
		private interTime:number = 0;
		private renderIndex:number = 0;

		private unitQueue:Array<AvatarUnit> = [];

		public constructor() {
			var timer:egret.Timer = new egret.Timer(0);
			timer.addEventListener(egret.TimerEvent.TIMER, this.timerFrameFunc, this);
			timer.start();
		}

		public static getInstance():AvatarRenderManager {
			if (AvatarRenderManager._instance_ == null) {
				AvatarRenderManager._instance_ = new AvatarRenderManager();
			}
			return AvatarRenderManager._instance_;
		}

		public static get unit_length():number {
			return AvatarRenderManager._instance_.unitQueue.length;
		}

		public addUnit(unit:AvatarUnit) {
			if (this.unitQueue.indexOf(unit) == -1) {
				this.unitQueue.push(unit);
			}
		}

		public removeUnit(unit_id:string) {
			var avatarUnit:AvatarUnit = AvatarUnit.takeAvatarUnit(unit_id);
			if (avatarUnit) {
				var idx:number = this.unitQueue.indexOf(avatarUnit);
				if (idx != -1) {
					this.unitQueue.splice(idx, 1);
				}
			}
		}

		private timerFrameFunc(evt:egret.TimerEvent) {
			this.heartBeatHandler();
		}

		private heartBeatHandler() {
			if(!Scene.scene || !Scene.scene.isReady) {
				return ;
			}

			if (egret.getTimer() - this.checkTime >= 1000) {
				this.checkTime = egret.getTimer();
				this.checkRenderFps();
			}

			var needTime:number = 30;
			if (egret.getTimer() - this.interTime < needTime) {
				return ;
			}
			this.interTime = egret.getTimer();

			this.renderIndex++;
			if(this.renderIndex >= AvatarRenderManager.renderNum) {
				this.renderIndex = 0;
			}

			var avatarUnit:AvatarUnit = null;
			var avatarDisplay:IAvatar = null;
			var queueIndex:number = 0;
			while (queueIndex < this.unitQueue.length) {
				avatarUnit = this.unitQueue[queueIndex];
				avatarDisplay = AvatarUnitDisplay.takeUnitDisplay(avatarUnit.oid);
				if ((avatarUnit.renderIndex == this.renderIndex) || (avatarDisplay == Scene.scene.mainChar)) {
					avatarUnit.onBodyRender();
					avatarUnit.onEffectRender();
				}
				queueIndex++;
			}
		}

		private checkRenderFps() {
			var num:number = 2;
			if (Engine.fps < 10) {
				num = 12;
			} else if (Engine.fps < 20) {
				num = 8;
			} else if (Engine.fps < 30) {
				num = 4;
			}
			if (num != AvatarRenderManager.renderNum) {
				this.unitQueue.forEach(item => {
					item.renderIndex = Math.random() * num >> 0;
				});
				AvatarRenderManager.renderNum = num;
			}
		}

	}

}
