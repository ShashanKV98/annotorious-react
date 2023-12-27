import { Annotation, Annotator } from '@annotorious/annotorious';
export interface AnnotoriousPluginProps<I extends Annotation, E extends unknown> {
    plugin: (anno: Annotator<I, E>, opts?: Object) => ({
        unmount?: () => void;
    }) | void;
    opts?: Object;
}
export declare const AnnotoriousPlugin: <I extends Annotation = Annotation, E extends unknown = unknown>(props: AnnotoriousPluginProps<I, E>) => any;
//# sourceMappingURL=AnnotoriousPlugin.d.ts.map