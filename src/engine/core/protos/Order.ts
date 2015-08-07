module engine {
	export class Order extends Proto implements IOrder {

		protected _executedHandler_:Function;
		protected _applyHandler_:Function;
		protected _status_:string;

		public constructor() {
			super();
		}

		public execute() {
			if (this._applyHandler_ != null) {
				this._applyHandler_();
			}
		}

		public get executedHandler():Function {
			return this._executedHandler_;
		}

		public get applyHandler():Function {
			return this._applyHandler_;
		}

		public dispose() {
			super.dispose();
			this._executedHandler_ = null;
			this._applyHandler_ = null;
			this._status_ = null;
		}

	}
}