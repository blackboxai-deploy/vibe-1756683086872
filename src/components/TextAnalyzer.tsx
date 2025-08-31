'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { AnalysisResult } from '@/types/analysis';
import TextEditor from './TextEditor';
import AnalysisPanel from './AnalysisPanel';
import DiagnosticReport from './DiagnosticReport';
import ColorLegend from './ColorLegend';
import StatisticsChart from './StatisticsChart';
import TextComparator from './TextComparator';
import ThemeToggle from './ThemeToggle';

export default function TextAnalyzer() {
  const [text, setText] = useState('');
  const [analysis, setAnalysis] = useState<AnalysisResult | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleAnalyze = async () => {
    if (!text.trim()) {
      setError('Por favor, ingresa un texto para analizar');
      return;
    }

    setIsAnalyzing(true);
    setError(null);
    setAnalysis(null);

    try {
      const response = await fetch('/api/analyze', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ text: text.trim() }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Error al analizar el texto');
      }

      const result = await response.json();
      setAnalysis(result);
    } catch (err) {
      console.error('Error en análisis:', err);
      setError(
        err instanceof Error 
          ? err.message 
          : 'Error inesperado al analizar el texto. Por favor, inténtalo de nuevo.'
      );
    } finally {
      setIsAnalyzing(false);
    }
  };

  const handleClear = () => {
    setText('');
    setAnalysis(null);
    setError(null);
  };

  const handleTextChange = (newText: string) => {
    setText(newText);
    if (analysis) {
      // Si hay un análisis previo y el texto cambia, limpiar el análisis
      setAnalysis(null);
    }
  };

  return (
    <div className="max-w-7xl mx-auto p-4 space-y-6">
      {/* Header */}
      <Card>
        <CardHeader>
          <div className="flex justify-between items-start">
            <div className="text-center flex-1">
              <CardTitle className="text-2xl font-bold">
                🔍 Analizador Automático de Textos
              </CardTitle>
              <p className="text-gray-600 leading-relaxed mt-2">
                Herramienta de análisis inteligente que evalúa ortografía, coherencia, claridad y propósito comunicativo de tus textos.
              </p>
            </div>
            <div className="flex items-center gap-2">
              <ThemeToggle />
            </div>
          </div>
        </CardHeader>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Panel Principal de Texto */}
        <div className="lg:col-span-3 space-y-6">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle>Editor de Texto</CardTitle>
                <div className="space-x-2">
                  <Button
                    onClick={handleAnalyze}
                    disabled={isAnalyzing || !text.trim()}
                    className="bg-blue-600 hover:bg-blue-700"
                  >
                    {isAnalyzing ? '🔄 Analizando...' : '🔍 Analizar Texto'}
                  </Button>
                  <Button
                    variant="outline"
                    onClick={handleClear}
                    disabled={isAnalyzing}
                  >
                    🗑️ Limpiar
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              {error && (
                <Alert className="mb-4 border-red-200 bg-red-50">
                  <AlertDescription className="text-red-700">
                    {error}
                  </AlertDescription>
                </Alert>
              )}

              <TextEditor
                text={text}
                segments={analysis?.segments || []}
                onTextChange={handleTextChange}
                isAnalyzing={isAnalyzing}
              />
            </CardContent>
          </Card>

          {/* Tabs de Resultados */}
          {analysis && (
            <Card>
              <CardContent className="p-0">
                <Tabs defaultValue="analysis" className="w-full">
                  <div className="border-b border-gray-200 px-6 pt-6">
                    <TabsList className="grid w-full grid-cols-2 md:grid-cols-4">
                      <TabsTrigger value="analysis">📋 Análisis</TabsTrigger>
                      <TabsTrigger value="diagnostic">📊 Diagnóstico</TabsTrigger>
                      <TabsTrigger value="statistics">📈 Estadísticas</TabsTrigger>
                      <TabsTrigger value="compare">🔄 Comparar</TabsTrigger>
                    </TabsList>
                  </div>
                  
                  <TabsContent value="analysis" className="p-6">
                    <AnalysisPanel segments={analysis.segments} />
                  </TabsContent>
                  
                  <TabsContent value="diagnostic" className="p-6">
                    <DiagnosticReport analysis={analysis} />
                  </TabsContent>
                  
                  <TabsContent value="statistics" className="p-6">
                    <StatisticsChart analysis={analysis} />
                  </TabsContent>
                  
                  <TabsContent value="compare" className="p-6">
                    <TextComparator 
                      currentAnalysis={analysis} 
                      currentText={text} 
                    />
                  </TabsContent>
                </Tabs>
              </CardContent>
            </Card>
          )}
        </div>

        {/* Panel Lateral */}
        <div className="space-y-4">
          <ColorLegend />

          {/* Estadísticas Rápidas */}
          {analysis && (
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-sm font-medium">📈 Resumen Rápido</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="grid grid-cols-2 gap-3 text-sm">
                  <div className="text-center p-2 bg-gray-50 rounded">
                    <div className="font-bold text-lg text-gray-900">
                      {analysis.overallScore}/10
                    </div>
                    <div className="text-xs text-gray-600">Puntuación</div>
                  </div>
                  <div className="text-center p-2 bg-gray-50 rounded">
                    <div className="font-bold text-lg text-gray-900">
                      {analysis.segments.length}
                    </div>
                    <div className="text-xs text-gray-600">Observaciones</div>
                  </div>
                </div>
                
                <div className="space-y-2 text-xs">
                  <div className="flex justify-between">
                    <span>🔴 Ortografía:</span>
                    <span className="font-medium">
                      {analysis.segments.filter(s => s.type === 'spelling').length}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span>🟠 Confusión:</span>
                    <span className="font-medium">
                      {analysis.segments.filter(s => s.type === 'confusion').length}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span>🟡 Repeticiones:</span>
                    <span className="font-medium">
                      {analysis.segments.filter(s => s.type === 'repetition').length}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span>🟢 Claridad:</span>
                    <span className="font-medium">
                      {analysis.segments.filter(s => s.type === 'clarity').length}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span>🟣 Tono:</span>
                    <span className="font-medium">
                      {analysis.segments.filter(s => s.type === 'tone').length}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span>🔵 Legibilidad:</span>
                    <span className="font-medium">
                      {analysis.segments.filter(s => s.type === 'readability').length}
                    </span>
                  </div>
                  {analysis.segments.filter(s => ['sentiment', 'plagiarism', 'vocabulary'].includes(s.type)).length > 0 && (
                    <div className="border-t border-gray-200 pt-2 mt-2">
                      <div className="flex justify-between">
                        <span>💭 Otros:</span>
                        <span className="font-medium">
                          {analysis.segments.filter(s => ['sentiment', 'plagiarism', 'vocabulary'].includes(s.type)).length}
                        </span>
                      </div>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          )}

          {/* Tips de Uso */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium">💡 Consejos de Uso</CardTitle>
            </CardHeader>
            <CardContent className="text-xs text-gray-600 space-y-2">
              <div>• Escribe al menos 50 palabras para un análisis completo</div>
              <div>• Pasa el cursor sobre las partes resaltadas para ver explicaciones</div>
              <div>• El análisis considera el contexto y propósito del texto</div>
              <div>• Las sugerencias están orientadas a mejorar la comunicación</div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}