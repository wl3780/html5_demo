module engine {
	export class WealthProgressEvent extends egret.ProgressEvent {

		public static PROGRESS:string = "PROGRESS";

		public path:string;
		public proto:any;
		public wealth_id:string;

		public constructor(type:string,bubbles:boolean = false,cancelable:boolean = false,bytesLoaded:number = 0,bytesTotal:number = 0)
		{
			super(type, bubbles, cancelable, bytesLoaded, bytesTotal);
		}

	}
}

