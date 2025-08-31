'use client';

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { TextSegment, COLOR_ICONS, AnalysisType } from "@/types/analysis";

interface AnalysisPanelProps {
  segments: TextSegment[];
}

export default function AnalysisPanel({ segments }: AnalysisPanelProps) {
  if (!segments || segments.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">📋 Panel de Análisis</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8 text-gray-500">
            <div className="text-2xl mb-2">🔍</div>
            <p className="text-sm">
              Ingresa un texto y haz clic en "Analizar Texto" para ver los resultados detallados aquí.
            </p>
          </div>
        </CardContent>
      </Card>
    );
  }

  // Agrupar segmentos por tipo
  const groupedSegments = segments.reduce((acc, segment) => {
    if (!acc[segment.type]) {
      acc[segment.type] = [];
    }
    acc[segment.type].push(segment);
    return acc;
  }, {} as Record<AnalysisType, TextSegment[]>);

  const typeLabels = {
    spelling: 'Errores Ortográficos',
    confusion: 'Ideas Confusas',
    repetition: 'Repeticiones',
    clarity: 'Ideas Claras'
  };

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'high': return 'bg-red-100 text-red-800 border-red-200';
      case 'medium': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'low': return 'bg-blue-100 text-blue-800 border-blue-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getSeverityLabel = (severity: string) => {
    switch (severity) {
      case 'high': return 'Alta';
      case 'medium': return 'Media';
      case 'low': return 'Baja';
      default: return 'N/A';
    }
  };

  return (
    <div className="space-y-4">
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">📋 Panel de Análisis</CardTitle>
          <p className="text-sm text-gray-600">
            Se encontraron {segments.length} observaciones en total
          </p>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {Object.entries(groupedSegments).map(([type, typeSegments]) => {
              const segments = typeSegments as TextSegment[];
              return (
                <div key={type} className="space-y-3">
                  <div className="flex items-center gap-2 pb-2 border-b border-gray-100">
                    <span className="text-lg">
                      {COLOR_ICONS[type as AnalysisType]}
                    </span>
                    <h4 className="font-medium text-gray-900">
                      {typeLabels[type as AnalysisType]}
                    </h4>
                    <Badge variant="secondary" className="ml-auto">
                      {segments.length}
                    </Badge>
                  </div>
                  
                  <div className="space-y-3 pl-6">
                    {segments.map((segment) => (
                    <div
                      key={segment.id}
                      className="p-3 border border-gray-100 rounded-lg bg-gray-50 hover:bg-gray-100 transition-colors"
                    >
                      <div className="flex items-start justify-between gap-2 mb-2">
                        <div className="font-mono text-sm bg-white px-2 py-1 rounded border text-gray-800 flex-1">
                          "{segment.text}"
                        </div>
                        <Badge className={getSeverityColor(segment.severity)}>
                          {getSeverityLabel(segment.severity)}
                        </Badge>
                      </div>
                      
                      <div className="space-y-2 text-sm">
                        <div>
                          <span className="font-medium text-gray-700">Explicación:</span>
                          <p className="text-gray-600 mt-1 leading-relaxed">
                            {segment.explanation}
                          </p>
                        </div>
                        
                        <div>
                          <span className="font-medium text-gray-700">Impacto en el lector:</span>
                          <p className="text-gray-600 mt-1 leading-relaxed">
                            {segment.impact}
                          </p>
                        </div>
                      </div>
                    </div>
                  ))}
                  </div>
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}