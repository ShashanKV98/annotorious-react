export * from './Annotorious';
export * from './AnnotoriousPlugin';
export * from './AnnotoriousPopup';
export * from './ImageAnnotator';
export * from './openseadragon';


export type { Annotation, AnnotationBody, AnnotationTarget, Annotator, AnnotatorState, Appearance, AppearanceProvider, Color, DrawingStyle, Filter, FormatAdapter, HoverState, LifecycleEvents, ParseResult, PresentUser, Purpose, Selection, SelectionState, Store, StoreChangeEvent, StoreObserver, User, W3CAnnotation, W3CAnnotationBody, W3CAnnotationTarget, W3CSelector } from '@annotorious/core';
import { createAnonymousGuest as _createAnonymousGuest, createBody as _createBody, defaultColorProvider as _defaultColorProvider, Origin as _Origin, PointerSelectAction as _PointerSelectAction } from '@annotorious/core';
export { _createAnonymousGuest as createAnonymousGuest };
export { _createBody as createBody };
export { _defaultColorProvider as defaultColorProvider };
export { _Origin as Origin };
export { _PointerSelectAction as PointerSelectAction };
export type { AnnotoriousOpts, DrawingMode, DrawingTool, ImageAnnotator as AnnotoriousImageAnnotator, ImageAnnotation, ImageAnnotator, ImageAnnotatorState, Polygon, PolygonGeometry, Rectangle, RectangleGeometry, Shape } from '@annotorious/annotorious';
import { ShapeType as _ShapeType } from '@annotorious/annotorious';
export declare const createImageAnnotator: <E extends unknown = import("@annotorious/annotorious").ImageAnnotation>(image: string | HTMLImageElement | HTMLCanvasElement, options?: import("@annotorious/annotorious").AnnotoriousOpts<import("@annotorious/annotorious").ImageAnnotation, E>) => import("@annotorious/annotorious").ImageAnnotator<E>;
export declare const ShapeType: typeof _ShapeType;
export declare const W3CImageFormat: (source: string, invertY?: boolean) => import("@annotorious/annotorious").W3CImageFormatAdapter;
export type { OpenSeadragonAnnotator as AnnotoriousOpenSeadragonAnnotator } from '@annotorious/openseadragon';
export type { Viewer } from 'openseadragon';
//# sourceMappingURL=index.d.ts.map