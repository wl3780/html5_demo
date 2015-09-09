/**
 * 服务器通讯事件类
 */
class SocketEvent extends egret.Event {
	/**
	 * 掉线
	 */
	public static SERVER_DISCONNECT:String = "server_disconnect";

	/**
	 * 连线成功
	 */
	public static SERVER_CONNECT_SUCCESS:String = "server_connect_success";

	/**
	 * 连线失败
	 */
	public static SERVER_CONNECT_FAIL:String = "server_connect_fail";

	/**
	 * 命令解析错误
	 */
	public static SERVER_ERROR_PARSE:String = "server_error_parse";

	/**
	 * 命令解释成功
	 */
	public static SERVER_SUCCESS_PARSE:String = "server_success_parse";

	public params:Object;

	/**
	 * construct
	 * @param type		事件类型
	 */
	public constructor(type:string, bubbles:boolean=false, cancelable:boolean=false) {
		super(type, bubbles, cancelable);
	}
}