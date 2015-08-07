module engine {
	export class DisplayObjectPort {

		private static hash:Map<string, IDisplay> = new Map<string, IDisplay>();

		public static addTarget(value:IDisplay) {
			DisplayObjectPort.hash.set(value.id, value);
		}

		public static removeTarget(id:string):boolean {
			return DisplayObjectPort.hash.delete(id);
		}

		public static takeTarget(id:string):IDisplay
		{
			return DisplayObjectPort.hash.get(id);
		}

		public static hasTarget(id:string):boolean {
			return DisplayObjectPort.hash.has(id);
		}

	}
}
