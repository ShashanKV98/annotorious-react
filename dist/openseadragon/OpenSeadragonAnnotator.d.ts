import { ReactNode } from 'react';
import { AnnotoriousOpts, DrawingStyle, Filter, ImageAnnotation } from '@annotorious/annotorious';
export declare const OpenSeadragonAnnotatorContext: import("react").Context<{
    viewer: OpenSeadragon.Viewer;
    setViewer(viewer: OpenSeadragon.Viewer): void;
}>;
export type OpenSeadragonAnnotatorProps<E extends unknown> = AnnotoriousOpts<ImageAnnotation, E> & {
    children?: ReactNode;
    drawingEnabled?: boolean;
    filter?: Filter<ImageAnnotation>;
    style?: DrawingStyle | ((annotation: ImageAnnotation) => DrawingStyle);
    tool?: string | null;
};
export declare const OpenSeadragonAnnotator: <E extends unknown>(props: OpenSeadragonAnnotatorProps<E>) => import("react/jsx-runtime").JSX.Element;
export declare const useViewer: () => OpenSeadragon.Viewer;
//# sourceMappingURL=OpenSeadragonAnnotator.d.ts.map