import clips from './clips.json';

/** Clip shapes shared by the home: #win and #winn are upright windows whose top edge is a real contour segment (objectBoundingBox). */
export function BrandDefs() {
  return (
    <svg className="defs" width="0" height="0" aria-hidden="true" focusable="false">
      <defs>
        <clipPath id="win" clipPathUnits="objectBoundingBox">
          <path d={clips.win} />
        </clipPath>
        <clipPath id="winn" clipPathUnits="objectBoundingBox">
          <path d={clips.winn} />
        </clipPath>
      </defs>
    </svg>
  );
}

/** The origin numeral's own contour baseline (the brand book's contours.json "base", same units as the book's origin). */
export const numeralBase = clips.base;
