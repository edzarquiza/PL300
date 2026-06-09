import RelationshipDiagram from '../RelationshipDiagram'

export default function RelationshipSlide({ slide }) {
  return (
    <div className="space-y-2">
      <div>
        <h3 className="text-sm font-semibold text-gray-800">{slide.title}</h3>
        {slide.caption && (
          <p className="text-xs text-gray-500 mt-0.5 leading-snug">{slide.caption}</p>
        )}
      </div>
      <RelationshipDiagram diagram={slide} />
    </div>
  )
}
