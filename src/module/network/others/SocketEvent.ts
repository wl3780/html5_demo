/**
 * 服务器通讯事件类
 */
class SocketEvent extends egret.Event {
	/**
	 * 掉线
	 */
	public static SERVER_DISCONNECT:string = "server_disconnect";

	/**
	 * 连线成功
	 */
	public static SERVER_CONNECT_SUCCESS:string = "server_connect_success";

	/**
	 * 连线失败
	 */
	public static SERVER_CONNECT_FAIL:string = "server_connect_fail";

	/**
	 * 命令解析错误
	 */
	public static SERVER_ERROR_PARSE:string = "server_error_parse";

	/**
	 * 命令解释成功
	 */
	public static SERVER_SUCCESS_PARSE:string = "server_success_parse";

	public params:any;

	/**
	 * construct
	 * @param type		事件类型
	 */
	public constructor(type:string, bubbles:boolean=false, cancelable:boolean=false) {
		super(type, bubbles, cancelable);
	}
}