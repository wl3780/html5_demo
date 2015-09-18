module engine {
	export class DisplayObjectPort {

		private static instanceHash:Map<string, IDisplay> = new Map<string, IDisplay>();

		public static addTarget(value:IDisplay) {
			DisplayObjectPort.instanceHash.set(value.id, value);
		}

		public static removeTarget(id:string):boolean {
			return DisplayObjectPort.instanceHash.delete(id);
		}

		public static takeTarget(id:string):IDisplay {
			return DisplayObjectPort.instanceHash.get(id);
		}

		public static hasTarget(id:string):boolean {
			return DisplayObjectPort.instanceHash.has(id);
		}

	}
}
