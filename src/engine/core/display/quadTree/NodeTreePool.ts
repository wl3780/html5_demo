module engine {
	export class NodeTreePool {

		public static _instance:NodeTreePool;

		private hash:Map<string, NodeTree>;

		public constructor() {
			this.hash = new Map<string, NodeTree>();
		}

		public static getInstance():NodeTreePool {
			if(NodeTreePool._instance == null) {
				NodeTreePool._instance = new NodeTreePool();
			}
			return NodeTreePool._instance;
		}

		public put(value:NodeTree) {
			this.hash.set(value.id, value);
		}

		public take(id:string):NodeTree {
			return this.hash.get(id);
		}

		public remove(id:string):boolean {
			return this.hash.delete(id);
		}

	}
}

