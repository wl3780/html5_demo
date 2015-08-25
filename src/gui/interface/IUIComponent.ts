module gui {
    export interface IUIComponent extends engine.IProto {

        enabled:boolean;

        styleName?:string;

        /**
         * 下一帧渲染
         */
        display();

        /**
         * 立即渲染
         */
        onRender();

    }
}