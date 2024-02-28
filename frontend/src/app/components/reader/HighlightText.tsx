import {HighlightScheme} from "../../types/article.types.ts";
import React, {useRef} from "react";
import {RenderHighlightsProps} from "@react-pdf-viewer/highlight";

export const HighlightText = ({note, props, jumpToNote}:{note: HighlightScheme, props: RenderHighlightsProps, jumpToNote: (note: HighlightScheme) => void}) => {
  const ref = useRef<HTMLDivElement>(null)
  return (
    <div ref={ref} key={note.id}>
      {note.highlightAreas
        .filter((area) => area.pageIndex === props.pageIndex)
        .map((area, idx) => (
          <div
            key={idx}
            style={Object.assign({}, {
              background: 'yellow',
              opacity: 0.4,
            }, props.getCssProperties(area, props.rotation))}
            onClick={() => jumpToNote(note)}
          />
        ))}
    </div>
  )
}