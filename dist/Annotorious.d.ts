import { ReactNode } from 'react';
import { Annotation, Annotator, Store } from '@annotorious/annotorious';
interface Selection<T extends Annotation = Annotation> {
    selected: {
        annotation: T;
        editable?: boolean;
    }[];
    pointerEvent?: PointerEvent;
}
export interface AnnotoriousContextState {
    anno: Annotator;
    setAnno(anno: Annotator<Annotation, unknown>): void;
    annotations: Annotation[];
    selection: Selection;
}
export declare const AnnotoriousContext: import("react").Context<{
    anno: any;
    setAnno: any;
    annotations: any[];
    selection: {
        selected: any[];
    };
}>;
export declare const Annotorious: import("react").ForwardRefExoticComponent<{
    children: ReactNode;
} & import("react").RefAttributes<Annotator<Annotation, Annotation>>>;
export declare const useAnnotator: <T extends Annotator<any, unknown>>() => T;
export declare const useAnnotationStore: <T extends Store<Annotation>>() => T;
export declare const useAnnotations: <T extends Annotation>(debounce?: number) => T[];
export declare const useSelection: <T extends Annotation>() => Selection<T>;
export declare const useAnnotatorUser: () => any;
export declare const useViewportState: <T extends Annotation>(debounce?: number) => T[];
export {};
//# sourceMappingURL=Annotorious.d.ts.map