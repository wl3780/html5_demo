module engine {

    export interface ISceneItem extends IDisplay {
        layer:string;

        char_id:string;

        scene_id:string;

        stageIntersects():boolean;
    }
}