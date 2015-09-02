module engine {
	export class NoderSprite extends DisplaySprite implements INoderDisplay {

		protected _tid:string;

		private _node:NodeRect;
		private _tree:NodeTree;
		private _initialized:boolean = false;
		private _isActivate:boolean = false;

		public constructor() {
			super();
			this.touchChildren = this.touchEnabled = false;
		}

		public registerNodeTree(tid:string) {
			this._tid = tid;
			this._tree = NodeTreePool.getInstance().take(tid);
			this._initialized = true;
			this.activate();
		}

		public _setX(value:number) {
			if (this.x != value) {
				super._setX(value);
				this.updata(value, this.y, this.nodeKey);
			}
		}

		public _setY(value:number) {
			if (this.y != value) {
				super._setY(value);
				this.updata(this.x, value, this.nodeKey);
			}
		}

		public updata(x:number, y:number, key:string) {
			if (this._initialized == false || this._isActivate == false) {
				return;
			}
			if (this._tree.initialized) {
				if (this._node == null) {
					this._node = this._tree.nodes.get(key);
				}
				if (!this._node.rect.contains(x, y)) {
					var newNode:NodeRect = this._tree.nodes.get(key);
					this.resetNode(this._node, newNode);
					if (newNode != null) {
						this._node = newNode;
					}
				}
			}
		}

		private resetNode(node:NodeRect, newNode:NodeRect) {
			if (node && newNode) {
				if (node != newNode) {
					node.removeChild(this.id);
					newNode.addChild(this.id, this);
					this.resetNode(node.parent, newNode.parent);
				}
			}
		}

		public get node():INodeRect {
			return this._node;
		}

		private get nodeKey():string {
			var subX:number = this.x / NodeTree.doubleMinWidth * NodeTree.doubleMinWidth + NodeTree.minWidth >> 0;
			var subY:number = this.y / NodeTree.doubleMinHeight * NodeTree.doubleMinHeight + NodeTree.minHeight >> 0;
			return subX + Engine.SIGN + subY;
		}

		public activate() {
			if (this._tree.initialized) {
				this._isActivate = true;
				var newNode:NodeRect = this._tree.nodes.get(this.nodeKey);
				this._node = newNode;
				this.push(newNode);
			}
		}

		public unactivate() {
			this._isActivate = false;
			if (this._node) {
				this.remove(this._node);
				this._node = null;
			}
		}

		public get isActivate():boolean {
			return this._isActivate;
		}

		public get tid():string {
			return this._tid;
		}

		public push(node:NodeRect) {
			if (node == null) {
				return;
			}
			node.addChild(this.id, this);
			var pNode:NodeRect = node.parent;
			if (pNode) {
				this.push(pNode);
			}
		}

		private remove(node:NodeRect) {
			if (node == null) {
				return;
			}
			node.removeChild(this.id);
			var pNode:NodeRect = node.parent;
			if (pNode) {
				this.remove(pNode);
			}
		}

		public dispose() {
			this.unactivate();
			this._node = null;
			this._tree = null;
			super.dispose();
		}
	}

}