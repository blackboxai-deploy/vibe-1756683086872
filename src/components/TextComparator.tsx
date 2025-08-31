'use client';

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { ComparisonData, AnalysisResult } from "@/types/analysis";

interface TextComparatorProps {
  currentAnalysis: AnalysisResult;
  currentText: string;
}

export default function TextComparator({ currentAnalysis, currentText }: TextComparatorProps) {
  const [compareText, setCompareText] = useState('');
  const [compareAnalysis, setCompareAnalysis] = useState<AnalysisResult | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [savedVersions, setSavedVersions] = useState<ComparisonData[]>([]);

  const analyzeCompareText = async () => {
    if (!compareText.trim()) return;

    setIsAnalyzing(true);
    try {
      const response = await fetch('/api/analyze', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text: compareText.trim() }),
      });

      if (response.ok) {
        const result = await response.json();
        setCompareAnalysis(result);
      }
    } catch (error) {
      console.error('Error analyzing comparison text:', error);
    } finally {
      setIsAnalyzing(false);
    }
  };

  const saveCurrentVersion = () => {
    const newVersion: ComparisonData = {
      id: Date.now().toString(),
      name: `Versión ${savedVersions.length + 1}`,
      text: currentText,
      analysis: currentAnalysis,
      timestamp: new Date()
    };
    
    setSavedVersions(prev => [...prev, newVersion]);
  };

  const loadVersion = (version: ComparisonData) => {
    setCompareText(version.text);
    setCompareAnalysis(version.analysis);
  };

  const getScoreComparison = () => {
    if (!compareAnalysis) return null;
    
    const currentScore = currentAnalysis.overallScore;
    const compareScore = compareAnalysis.overallScore;
    const diff = compareScore - currentScore;
    
    return {
      diff,
      isImprovement: diff > 0,
      percentage: Math.abs(diff / currentScore * 100)
    };
  };

  const getSegmentComparison = () => {
    if (!compareAnalysis) return null;

    const currentCounts = {
      spelling: currentAnalysis.segments.filter(s => s.type === 'spelling').length,
      confusion: currentAnalysis.segments.filter(s => s.type === 'confusion').length,
      repetition: currentAnalysis.segments.filter(s => s.type === 'repetition').length,
      clarity: currentAnalysis.segments.filter(s => s.type === 'clarity').length,
    };

    const compareCounts = {
      spelling: compareAnalysis.segments.filter(s => s.type === 'spelling').length,
      confusion: compareAnalysis.segments.filter(s => s.type === 'confusion').length,
      repetition: compareAnalysis.segments.filter(s => s.type === 'repetition').length,
      clarity: compareAnalysis.segments.filter(s => s.type === 'clarity').length,
    };

    return { currentCounts, compareCounts };
  };

  const scoreComparison = getScoreComparison();
  const segmentComparison = getSegmentComparison();

  return (
    <div className="space-y-6">
      {/* Selector de Versiones Guardadas */}
      <Card>
        <CardHeader>
          <div className="flex justify-between items-center">
            <CardTitle className="flex items-center gap-2">
              🔄 Comparador de Versiones
            </CardTitle>
            <Button onClick={saveCurrentVersion} size="sm">
              💾 Guardar Versión Actual
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          {savedVersions.length > 0 ? (
            <div className="flex flex-wrap gap-2">
              {savedVersions.map((version) => (
                <Button
                  key={version.id}
                  variant="outline"
                  size="sm"
                  onClick={() => loadVersion(version)}
                  className="text-xs"
                >
                  {version.name} ({version.analysis.overallScore}/10)
                </Button>
              ))}
            </div>
          ) : (
            <p className="text-sm text-gray-600">
              Guarda versiones de tu texto para poder compararlas después
            </p>
          )}
        </CardContent>
      </Card>

      {/* Editor de Comparación */}
      <Card>
        <CardHeader>
          <CardTitle>📝 Texto para Comparar</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <Textarea
            value={compareText}
            onChange={(e) => setCompareText(e.target.value)}
            placeholder="Pega aquí una versión alternativa de tu texto para comparar..."
            className="min-h-[150px]"
            disabled={isAnalyzing}
          />
          <Button 
            onClick={analyzeCompareText}
            disabled={isAnalyzing || !compareText.trim()}
            className="w-full"
          >
            {isAnalyzing ? '🔄 Analizando...' : '🔍 Analizar para Comparar'}
          </Button>
        </CardContent>
      </Card>

      {/* Comparación de Resultados */}
      {compareAnalysis && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Texto Original */}
          <Card>
            <CardHeader>
              <CardTitle className="text-blue-600">📄 Versión Original</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="bg-blue-50 p-4 rounded-lg">
                <div className="text-center">
                  <div className="text-3xl font-bold text-blue-600">
                    {currentAnalysis.overallScore}/10
                  </div>
                  <div className="text-sm text-blue-600">Puntuación General</div>
                </div>
              </div>
              
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span>🔴 Errores ortográficos:</span>
                  <Badge variant="destructive">
                    {segmentComparison?.currentCounts.spelling || 0}
                  </Badge>
                </div>
                <div className="flex justify-between text-sm">
                  <span>🟠 Ideas confusas:</span>
                  <Badge variant="secondary">
                    {segmentComparison?.currentCounts.confusion || 0}
                  </Badge>
                </div>
                <div className="flex justify-between text-sm">
                  <span>🟡 Repeticiones:</span>
                  <Badge variant="outline">
                    {segmentComparison?.currentCounts.repetition || 0}
                  </Badge>
                </div>
                <div className="flex justify-between text-sm">
                  <span>🟢 Ideas claras:</span>
                  <Badge className="bg-green-100 text-green-800">
                    {segmentComparison?.currentCounts.clarity || 0}
                  </Badge>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Texto Comparado */}
          <Card>
            <CardHeader>
              <CardTitle className="text-green-600">📄 Versión Comparada</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="bg-green-50 p-4 rounded-lg">
                <div className="text-center">
                  <div className="text-3xl font-bold text-green-600">
                    {compareAnalysis.overallScore}/10
                  </div>
                  <div className="text-sm text-green-600">Puntuación General</div>
                  
                  {scoreComparison && (
                    <div className={`text-sm mt-1 ${scoreComparison.isImprovement ? 'text-green-600' : 'text-red-600'}`}>
                      {scoreComparison.isImprovement ? '📈' : '📉'} {scoreComparison.diff > 0 ? '+' : ''}{scoreComparison.diff.toFixed(1)} puntos
                    </div>
                  )}
                </div>
              </div>
              
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span>🔴 Errores ortográficos:</span>
                  <Badge variant="destructive">
                    {segmentComparison?.compareCounts.spelling || 0}
                  </Badge>
                </div>
                <div className="flex justify-between text-sm">
                  <span>🟠 Ideas confusas:</span>
                  <Badge variant="secondary">
                    {segmentComparison?.compareCounts.confusion || 0}
                  </Badge>
                </div>
                <div className="flex justify-between text-sm">
                  <span>🟡 Repeticiones:</span>
                  <Badge variant="outline">
                    {segmentComparison?.compareCounts.repetition || 0}
                  </Badge>
                </div>
                <div className="flex justify-between text-sm">
                  <span>🟢 Ideas claras:</span>
                  <Badge className="bg-green-100 text-green-800">
                    {segmentComparison?.compareCounts.clarity || 0}
                  </Badge>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Resumen de Mejoras */}
      {scoreComparison && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              {scoreComparison.isImprovement ? '📈 Mejoras Detectadas' : '📉 Cambios Detectados'}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className={`p-4 rounded-lg ${scoreComparison.isImprovement ? 'bg-green-50' : 'bg-orange-50'}`}>
              <p className="text-sm">
                <strong>Cambio en la puntuación:</strong> {scoreComparison.diff > 0 ? '+' : ''}{scoreComparison.diff.toFixed(1)} puntos 
                ({scoreComparison.percentage.toFixed(1)}% {scoreComparison.isImprovement ? 'mejor' : 'diferente'})
              </p>
              
              {segmentComparison && (
                <div className="mt-3 space-y-1 text-sm">
                  <p><strong>Cambios específicos:</strong></p>
                  <ul className="list-disc list-inside space-y-1">
                    {segmentComparison.compareCounts.spelling !== segmentComparison.currentCounts.spelling && (
                      <li>Errores ortográficos: {segmentComparison.currentCounts.spelling} → {segmentComparison.compareCounts.spelling}</li>
                    )}
                    {segmentComparison.compareCounts.confusion !== segmentComparison.currentCounts.confusion && (
                      <li>Ideas confusas: {segmentComparison.currentCounts.confusion} → {segmentComparison.compareCounts.confusion}</li>
                    )}
                    {segmentComparison.compareCounts.repetition !== segmentComparison.currentCounts.repetition && (
                      <li>Repeticiones: {segmentComparison.currentCounts.repetition} → {segmentComparison.compareCounts.repetition}</li>
                    )}
                    {segmentComparison.compareCounts.clarity !== segmentComparison.currentCounts.clarity && (
                      <li>Ideas claras: {segmentComparison.currentCounts.clarity} → {segmentComparison.compareCounts.clarity}</li>
                    )}
                  </ul>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}