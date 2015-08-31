module engine {
	export class WealthEvent extends egret.Event {

		public static WEALTH_COMPLETE:string = "WEALTH_COMPLETE";
		public static WEALTH_ERROR:string = "WEALTH_ERROR";
		public static WEALTH_GROUP_COMPLETE:string = "WEALTH_GROUP_COMPLETE";

		public path:string;
		public wealth_id:string;
		public wealthGroup_id:string;

		public constructor(type:string, bubbles:boolean = false, cancelable:boolean = false) {
			super(type, bubbles, cancelable);
		}

	}
}

