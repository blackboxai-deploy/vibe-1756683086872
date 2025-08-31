'use client';

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { AnalysisResult } from "@/types/analysis";

interface DiagnosticReportProps {
  analysis: AnalysisResult;
}

export default function DiagnosticReport({ analysis }: DiagnosticReportProps) {
  const getScoreColor = (score: number) => {
    if (score >= 8) return "text-green-600";
    if (score >= 6) return "text-yellow-600"; 
    return "text-red-600";
  };

  const getScoreLabel = (score: number) => {
    if (score >= 8) return "Excelente";
    if (score >= 6) return "Bueno";
    if (score >= 4) return "Regular";
    return "Necesita mejora";
  };

  const getPurposeLabel = (purpose: string) => {
    const labels: Record<string, string> = {
      narrative: 'Narrativo',
      argumentative: 'Argumentativo',
      descriptive: 'Descriptivo', 
      informative: 'Informativo',
      persuasive: 'Persuasivo',
      unknown: 'No determinado'
    };
    return labels[purpose] || purpose;
  };

  return (
    <div className="space-y-4">
      {/* Puntuaciones Principales */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-lg flex items-center gap-2">
            📊 Diagnóstico General
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Puntuación General */}
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">Puntuación General</span>
                <span className={`text-lg font-bold ${getScoreColor(analysis.overallScore)}`}>
                  {analysis.overallScore}/10
                </span>
              </div>
              <Progress value={analysis.overallScore * 10} className="h-2" />
              <Badge variant="secondary" className="text-xs">
                {getScoreLabel(analysis.overallScore)}
              </Badge>
            </div>

            {/* Cumplimiento del Propósito */}
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">Cumplimiento del Propósito</span>
                <span className={`text-lg font-bold ${getScoreColor(analysis.purposeScore)}`}>
                  {analysis.purposeScore}/10
                </span>
              </div>
              <Progress value={analysis.purposeScore * 10} className="h-2" />
              <Badge variant="outline" className="text-xs">
                {getPurposeLabel(analysis.textPurpose)}
              </Badge>
            </div>
          </div>

          {/* Análisis del Propósito */}
          {analysis.purposeAnalysis && (
            <div className="pt-2 border-t border-gray-100">
              <p className="text-sm text-gray-700 leading-relaxed">
                {analysis.purposeAnalysis}
              </p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Fortalezas */}
      {analysis.strengths && analysis.strengths.length > 0 && (
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-lg flex items-center gap-2 text-green-700">
              ✅ Fortalezas Detectadas
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="space-y-2">
              {analysis.strengths.map((strength, index) => (
                <li key={index} className="flex items-start gap-2">
                  <div className="w-1.5 h-1.5 rounded-full bg-green-500 mt-2 flex-shrink-0" />
                  <span className="text-sm text-gray-700 leading-relaxed">{strength}</span>
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>
      )}

      {/* Debilidades */}
      {analysis.weaknesses && analysis.weaknesses.length > 0 && (
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-lg flex items-center gap-2 text-orange-700">
              ⚠️ Áreas de Mejora
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="space-y-2">
              {analysis.weaknesses.map((weakness, index) => (
                <li key={index} className="flex items-start gap-2">
                  <div className="w-1.5 h-1.5 rounded-full bg-orange-500 mt-2 flex-shrink-0" />
                  <span className="text-sm text-gray-700 leading-relaxed">{weakness}</span>
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>
      )}

      {/* Recomendaciones */}
      {analysis.recommendations && analysis.recommendations.length > 0 && (
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-lg flex items-center gap-2 text-blue-700">
              💡 Recomendaciones
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="space-y-2">
              {analysis.recommendations.map((recommendation, index) => (
                <li key={index} className="flex items-start gap-2">
                  <div className="w-1.5 h-1.5 rounded-full bg-blue-500 mt-2 flex-shrink-0" />
                  <span className="text-sm text-gray-700 leading-relaxed">{recommendation}</span>
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>
      )}
    </div>
  );
}