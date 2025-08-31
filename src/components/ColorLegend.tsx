import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { COLOR_ICONS } from "@/types/analysis";

export default function ColorLegend() {
  const legendItems = [
    {
      type: 'spelling',
      color: COLOR_ICONS.spelling,
      label: 'Errores ortográficos',
      description: 'Palabras mal escritas, errores gramaticales o de puntuación'
    },
    {
      type: 'confusion',
      color: COLOR_ICONS.confusion,
      label: 'Ideas confusas',
      description: 'Frases poco claras, incoherentes o que generan confusión'
    },
    {
      type: 'repetition',
      color: COLOR_ICONS.repetition,
      label: 'Repeticiones',
      description: 'Muletillas, redundancias o repeticiones innecesarias'
    },
    {
      type: 'clarity',
      color: COLOR_ICONS.clarity,
      label: 'Ideas claras',
      description: 'Fragmentos bien expresados, coherentes y efectivos'
    },
    {
      type: 'tone',
      color: COLOR_ICONS.tone,
      label: 'Tono específico',
      description: 'Fragmentos con registro formal/informal notable'
    },
    {
      type: 'readability',
      color: COLOR_ICONS.readability,
      label: 'Legibilidad',
      description: 'Oraciones muy complejas o demasiado simples'
    },
    {
      type: 'sentiment',
      color: COLOR_ICONS.sentiment,
      label: 'Carga emocional',
      description: 'Fragmentos con sentimientos o emociones marcadas'
    },
    {
      type: 'plagiarism',
      color: COLOR_ICONS.plagiarism,
      label: 'Clichés comunes',
      description: 'Frases muy usadas o expresiones demasiado comunes'
    },
    {
      type: 'vocabulary',
      color: COLOR_ICONS.vocabulary,
      label: 'Vocabulario',
      description: 'Uso sofisticado o repetitivo del vocabulario'
    }
  ];

  return (
    <Card className="w-full">
      <CardHeader className="pb-3">
        <CardTitle className="text-sm font-medium">Sistema de Marcado</CardTitle>
      </CardHeader>
      <CardContent className="space-y-2">
        {legendItems.map((item) => (
          <div key={item.type} className="flex items-start gap-2">
            <span className="text-sm mt-0.5">{item.color}</span>
            <div className="flex-1 min-w-0">
              <div className="text-xs font-medium text-gray-900">
                {item.label}
              </div>
              <div className="text-xs text-gray-600 leading-tight">
                {item.description}
              </div>
            </div>
          </div>
        ))}
        <div className="pt-2 mt-3 border-t border-gray-100">
          <p className="text-xs text-gray-500 leading-tight">
            <strong>Tip:</strong> Pasa el cursor sobre cualquier parte resaltada para ver la explicación detallada.
          </p>
        </div>
      </CardContent>
    </Card>
  );
}