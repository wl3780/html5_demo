module engine {
	export class NodeRect extends Proto implements INodeRect {

		private _tid:string;
		private _depth:number = 0;
		private _rect:egret.Rectangle;

		private _nodeA:NodeRect;
		private _nodeB:NodeRect;
		private _nodeC:NodeRect;
		private _nodeD:NodeRect;
		private _nodes:Map<string, INoder>;
		private _length:number = 0;
		private _tree:NodeTree;

		public constructor() {
			super();
			this._nodes = Map<string, INoder>();
		}

		public setUp(tid:string, oid:string, rect:egret.Rectangle, depth:number) {
			this._tid = tid;
			this._rect = rect;
			this._depth = depth;

			var rectX:number = rect.x;
			var rectY:number = rect.y;
			var rectW:number = rect.width;
			var rectH:number = rect.height;
			var rectHW:number = rectW / 2 >> 0;
			var rectHH:number = rectH / 2 >> 0;

			this._id_ = (rectX + rectHW) + Engine.SIGN + (rectY + rectHH);
			this._oid_ = oid;
			this._tree = NodeTreePool.getInstance().take(tid);
			this._tree.addNode(this._id_, this);

			var nextRect:egret.Rectangle = null;
			var nextDepth:number = depth - 1;
			if (nextDepth > 0) {
				if (this._nodeA == null) {
					this._nodeA = new NodeRect();
					nextRect = new egret.Rectangle(rectX, rectY, rectHW, rectHH);
					this._nodeA.setUp(tid, this._id_, nextRect, nextDepth);
				}
				if (this._nodeB == null) {
					this._nodeB = new NodeRect();
					nextRect = new egret.Rectangle(rectX, (rectY + rectHH), rectHW, rectHH);
					this._nodeB.setUp(tid, this._id_, nextRect, nextDepth);
				}
				if (this._nodeC == null) {
					this._nodeC = new NodeRect();
					nextRect = new egret.Rectangle((rectX + rectHW), rectY, rectHW, rectHH);
					this._nodeC.setUp(tid, this._id_, nextRect, nextDepth);
				}
				if (this._nodeD == null) {
					this._nodeD = new NodeRect();
					nextRect = new egret.Rectangle((rectX + rectHW), (rectY + rectHH), rectHW, rectHH);
					this._nodeD.setUp(tid, this._id_, nextRect, nextDepth);
				}
				this.project();
			}
		}

		private project() {
			if (this._depth > 0) {
				this._nodes.forEach(noder => {
					if (this._nodeA._rect.contains(noder.x, noder.y)) {
						this._nodeA.addChild(noder.id, noder);
					} else if (this._nodeB._rect.contains(noder.x, noder.y)) {
						this._nodeB.addChild(noder.id, noder);
					} else if (this._nodeC._rect.contains(noder.x, noder.y)) {
						this._nodeC.addChild(noder.id, noder);
					} else if (this._nodeD._rect.contains(noder.x, noder.y)) {
						this._nodeD.addChild(noder.id, noder);
					}
				});
			}
		}

		public reFree() {
			if (this._depth >= 1) {
				this._nodes.clear();
				if (this._nodeA) {
					this._nodeA.reFree();
				}
				if (this._nodeB) {
					this._nodeB.reFree();
				}
				if (this._nodeC) {
					this._nodeC.reFree();
				}
				if (this._nodeD) {
					this._nodeD.reFree();
				}
			}
		}

		public dispose() {
			this._nodes = null;
			this._tree = null;
			super.dispose();
		}

		public get parent():NodeRect {
			if (this.oid == null) {
				return null;
			}
			return this._tree.nodes.get(this.oid);
		}

		public addChild(id:string, noder:INoder) {
			if (this._nodes.has(id) == false) {
				this._nodes.set(id, noder);
				this._length++;
			}
		}

		public removeChild(id:string) {
			if (this._nodes.has(id) == true) {
				this._nodes.delete(id);
				this._length--;
			}
		}

		public get nodeA():NodeRect {
			return this._nodeA;
		}

		public get nodeB():NodeRect {
			return this._nodeB;
		}

		public get nodeC():NodeRect {
			return this._nodeC;
		}

		public get nodeD():NodeRect {
			return this._nodeD;
		}

		public get length():number {
			return this._length;
		}

		public get dic():Map<string, INoder> {
			return this._nodes;
		}

		public get depth():number {
			return this._depth;
		}

		public get rect():egret.Rectangle {
			return this._rect;
		}
	}
}