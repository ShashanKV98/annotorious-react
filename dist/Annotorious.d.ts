import { ReactNode } from 'react';
import { Annotation, Annotator, StoreChangeEvent } from '@annotorious/annotorious';
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
export declare const useAnnotationStore: <T extends {
    addAnnotation: (annotation: Annotation, origin?: import("@annotorious/core").Origin) => void;
    addBody: (body: import("@annotorious/annotorious").AnnotationBody, origin?: import("@annotorious/core").Origin) => void;
    all: () => Annotation[];
    bulkAddAnnotation: (annotations: Annotation[], replace?: boolean, origin?: import("@annotorious/core").Origin) => void;
    bulkDeleteAnnotation: (annotationsOrIds: (string | Annotation)[], origin?: import("@annotorious/core").Origin) => void;
    bulkUpdateAnnotation: (annotations: Annotation[], origin?: import("@annotorious/core").Origin) => void;
    bulkUpdateBodies: (bodies: import("@annotorious/annotorious").AnnotationBody[], origin?: import("@annotorious/core").Origin) => void;
    bulkUpdateTargets: (targets: import("@annotorious/annotorious").AnnotationTarget[], origin?: import("@annotorious/core").Origin) => void;
    clear: (origin?: import("@annotorious/core").Origin) => void;
    deleteAnnotation: (annotationOrId: string | Annotation, origin?: import("@annotorious/core").Origin) => void;
    deleteBody: (body: {
        id: string;
        annotation: string;
    }, origin?: import("@annotorious/core").Origin) => void;
    getAnnotation: (id: string) => Annotation;
    getBody: (id: string) => import("@annotorious/annotorious").AnnotationBody;
    observe: (onChange: (event: StoreChangeEvent<Annotation>) => void, options?: import("@annotorious/core").StoreObserveOptions) => number;
    unobserve: (onChange: (event: StoreChangeEvent<Annotation>) => void) => void;
    updateAnnotation: (arg1: string | Annotation, arg2?: Annotation | import("@annotorious/core").Origin, arg3?: import("@annotorious/core").Origin) => void;
    updateBody: (oldBodyId: {
        id: string;
        annotation: string;
    }, newBody: import("@annotorious/annotorious").AnnotationBody, origin?: import("@annotorious/core").Origin) => void;
    updateTarget: (target: import("@annotorious/annotorious").AnnotationTarget, origin?: import("@annotorious/core").Origin) => void;
}>() => T;
export declare const useAnnotations: <T extends Annotation>(debounce?: number) => T[];
export declare const useSelection: <T extends Annotation>() => Selection<T>;
export declare const useAnnotatorUser: () => any;
export declare const useViewportState: <T extends Annotation>(debounce?: number) => T[];
export {};
//# sourceMappingURL=Annotorious.d.ts.map