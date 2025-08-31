'use client';

import { useState, useCallback } from 'react';
import { TextSegment, COLOR_SCHEME, AnalysisType } from '@/types/analysis';
import { Textarea } from '@/components/ui/textarea';

interface TextEditorProps {
  text: string;
  segments: TextSegment[];
  onTextChange: (text: string) => void;
  isAnalyzing: boolean;
}

export default function TextEditor({ text, segments, onTextChange, isAnalyzing }: TextEditorProps) {
  const [hoveredSegment, setHoveredSegment] = useState<string | null>(null);

  const renderTextWithMarkup = useCallback(() => {
    if (!segments || segments.length === 0 || text.trim() === '') {
      return (
        <div className="whitespace-pre-wrap text-gray-500 p-3 min-h-[200px] leading-relaxed">
          {text || 'Escribe o pega aquí el texto que deseas analizar...'}
        </div>
      );
    }

    // Crear una copia de los segmentos y ordenarlos por posición
    const sortedSegments = [...segments].sort((a, b) => a.start - b.start);
    const parts: React.ReactElement[] = [];
    let currentIndex = 0;

    sortedSegments.forEach((segment, index) => {
      // Agregar texto antes del segmento
      if (currentIndex < segment.start) {
        const beforeText = text.slice(currentIndex, segment.start);
        if (beforeText) {
          parts.push(
            <span key={`before-${index}`}>
              {beforeText}
            </span>
          );
        }
      }

      // Agregar el segmento marcado
      const segmentText = text.slice(segment.start, segment.end);
      if (segmentText) {
        parts.push(
          <span
            key={segment.id}
            className={`relative px-1 py-0.5 rounded cursor-help transition-all duration-200 ${
              COLOR_SCHEME[segment.type as AnalysisType]
            } ${hoveredSegment === segment.id ? 'ring-2 ring-blue-400' : ''}`}
            onMouseEnter={() => setHoveredSegment(segment.id)}
            onMouseLeave={() => setHoveredSegment(null)}
            title={`${segment.explanation}\n\nImpacto: ${segment.impact}`}
          >
            {segmentText}
            {hoveredSegment === segment.id && (
              <div className="absolute z-50 p-3 mt-2 w-80 bg-white border border-gray-200 rounded-lg shadow-lg left-0 top-full">
                <div className="text-sm font-medium text-gray-900 mb-2">
                  {segment.explanation}
                </div>
                <div className="text-xs text-gray-600 border-t border-gray-100 pt-2">
                  <strong>Impacto en el lector:</strong> {segment.impact}
                </div>
                <div className="text-xs text-gray-500 mt-1">
                  Severidad: <span className="capitalize">{segment.severity}</span>
                </div>
              </div>
            )}
          </span>
        );
      }

      currentIndex = Math.max(currentIndex, segment.end);
    });

    // Agregar texto restante
    if (currentIndex < text.length) {
      const remainingText = text.slice(currentIndex);
      if (remainingText) {
        parts.push(
          <span key="remaining">
            {remainingText}
          </span>
        );
      }
    }

    return (
      <div className="whitespace-pre-wrap p-3 min-h-[200px] leading-relaxed text-gray-900">
        {parts}
      </div>
    );
  }, [text, segments, hoveredSegment]);

  return (
    <div className="space-y-4">
      <div className="space-y-2">
        <label className="text-sm font-medium text-gray-700">
          Texto a Analizar
        </label>
        <Textarea
          value={text}
          onChange={(e) => onTextChange(e.target.value)}
          placeholder="Escribe o pega aquí el texto que deseas analizar..."
          className="min-h-[150px] resize-y text-base leading-relaxed"
          disabled={isAnalyzing}
        />
      </div>

      {/* Vista con marcado visual */}
      {segments && segments.length > 0 && (
        <div className="space-y-2">
          <label className="text-sm font-medium text-gray-700">
            Análisis Visual
            <span className="text-xs text-gray-500 ml-2">
              (Pasa el cursor sobre las partes resaltadas para ver detalles)
            </span>
          </label>
          <div className="border border-gray-200 rounded-lg bg-white relative overflow-hidden">
            {renderTextWithMarkup()}
          </div>
        </div>
      )}

      {isAnalyzing && (
        <div className="flex items-center justify-center py-8">
          <div className="text-center space-y-2">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
            <p className="text-sm text-gray-600">Analizando texto...</p>
          </div>
        </div>
      )}
    </div>
  );
}