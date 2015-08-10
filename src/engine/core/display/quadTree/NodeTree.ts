module engine {
	export class NodeTree extends Proto {

		public static minWidth:number = 0;
		public static minHeight:number = 0;
		public static minSize:number = 0;
		public static doubleMinWidth:number = 0;
		public static doubleMinHeight:number = 0;

		public initialized:boolean = false;

		private _scopeRect:egret.Rectangle;
		private _depth:number = 0;
		private _rulerValue:number = 0;
		private _topNode:NodeRect;
		private _hash:Map<string, NodeRect>;

		public constructor(id:string) {
			super();
			this.id = id;
		}

		public reset() {
			if (this._topNode) {
				this._topNode.dispose();
				this._topNode = null;
			}
		}

		public get nodes():Map<string, NodeRect> {
			return this._hash;
		}

		public build(scopeRect:egret.Rectangle, minSize:number = 50, source:Array<INoder> = null) {
			NodeTreePool.getInstance().put(this);
			this._scopeRect = scopeRect;
			this._hash = new Map<string, NodeRect>();
			this._rulerValue = (scopeRect.width - scopeRect.height) > 0 ? scopeRect.width : scopeRect.height;
			this._depth = NodeTree.takeDepth(this._rulerValue, minSize);
			var value:number = Math.round(Math.pow(2, this._depth));
			scopeRect.width = Math.round(scopeRect.width / value) * value;
			scopeRect.height = Math.round(scopeRect.height / value) * value;

			NodeTree.minSize = (this._rulerValue / value) >> 0;
			NodeTree.minWidth = scopeRect.width / value >> 0;
			NodeTree.minHeight = scopeRect.height / value >> 0;
			NodeTree.doubleMinWidth = NodeTree.minWidth * 2 >> 0;
			NodeTree.doubleMinHeight = NodeTree.minHeight * 2 >> 0;

			this._topNode = new NodeRect();
			this._topNode.setUp(this.id, null, scopeRect, this._depth);
			if(source) {
				source.forEach(noder => {
					noder.tid = this.id;
					this._topNode.addChild(noder.id, noder);
				});
			}
			this.initialized = true;
		}

		public find(rect:egret.Rectangle, exact:boolean = false, definition:number = 20):Array<any> {
			if(this.initialized) {
				var result:Array<any> = [];
				var dic:Map<string, INoder> = new Map<string, INoder>();
				if (definition < NodeTree.minSize) {
					definition = NodeTree.minSize
				}
				var tmpDepth:number = NodeTree.takeDepth(this._rulerValue, definition);
				this.cycleFind(result, dic, this._topNode, rect, this._depth - tmpDepth + 1, exact);
				return result;
			}
			return null;
		}

		private cycleFind(arr:Array<any>, dic:Map<string, INoder>, node:NodeRect, rect:egret.Rectangle, level:number, exact:boolean) {
			if(node == null) {
				return ;
			}
			if(rect.intersects(node.rect) && node.length > 0) {
				if(node.depth == level) {
					var bounds:egret.Rectangle;
					node.dic.forEach(noder => {
						if (noder && noder.stage) {
							if(exact) {
								bounds = noder.getBounds(bounds);
								if(rect.intersects(bounds)) {
									if(dic.has(noder.id) == false) {
										dic.set(noder.id, noder);
										arr.push(noder);
									}
								}
							} else {
								if(dic.has(noder.id) == false) {
									dic.set(noder.id, noder);
									arr.push(noder);
								}
							}
						}
					});
				} else {
					if(node.nodeA) {
						this.cycleFind(arr, dic, node.nodeA, rect, level, exact);
					}
					if(node.nodeB) {
						this.cycleFind(arr, dic, node.nodeB, rect, level, exact);
					}
					if(node.nodeC) {
						this.cycleFind(arr, dic, node.nodeC, rect, level, exact);
					}
					if(node.nodeD) {
						this.cycleFind(arr, dic, node.nodeD, rect, level, exact);
					}
				}
			}
		}

		public addNode(id:string, node:NodeRect) {
			this._hash.set(id, node);
		}

		public removeNode(id:string) {
			this._hash.delete(id);
		}

		public takeNode(id:string):NodeRect {
			return this._hash.get(id);
		}

		private static takeDepth(ruler:number, minSize:number):number {
			var i:number = 1;
			var size:number = 0;
			while(true) {
				size = Math.round(ruler / Math.pow(2, i));
				if(size <= minSize) {
					return i;
				}
                i++;
			}
			return -1;
		}

	}
}

