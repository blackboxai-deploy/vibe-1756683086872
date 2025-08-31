'use client';

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { AnalysisResult } from "@/types/analysis";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  Radar
} from 'recharts';

interface StatisticsChartProps {
  analysis: AnalysisResult;
}

export default function StatisticsChart({ analysis }: StatisticsChartProps) {
  // Datos para el gráfico de barras de tipos de problemas
  const problemsData = [
    {
      name: 'Ortografía',
      count: analysis.segments.filter(s => s.type === 'spelling').length,
      color: '#ef4444'
    },
    {
      name: 'Confusión',
      count: analysis.segments.filter(s => s.type === 'confusion').length,
      color: '#f97316'
    },
    {
      name: 'Repeticiones',
      count: analysis.segments.filter(s => s.type === 'repetition').length,
      color: '#eab308'
    },
    {
      name: 'Ideas claras',
      count: analysis.segments.filter(s => s.type === 'clarity').length,
      color: '#22c55e'
    },
    {
      name: 'Tono',
      count: analysis.segments.filter(s => s.type === 'tone').length,
      color: '#a855f7'
    },
    {
      name: 'Legibilidad',
      count: analysis.segments.filter(s => s.type === 'readability').length,
      color: '#3b82f6'
    },
    {
      name: 'Sentimientos',
      count: analysis.segments.filter(s => s.type === 'sentiment').length,
      color: '#ec4899'
    },
    {
      name: 'Clichés',
      count: analysis.segments.filter(s => s.type === 'plagiarism').length,
      color: '#6b7280'
    },
    {
      name: 'Vocabulario',
      count: analysis.segments.filter(s => s.type === 'vocabulary').length,
      color: '#6366f1'
    }
  ].filter(item => item.count > 0);

  // Datos para el gráfico de severidad
  const severityData = [
    {
      name: 'Baja',
      count: analysis.segments.filter(s => s.severity === 'low').length,
      color: '#22c55e'
    },
    {
      name: 'Media',
      count: analysis.segments.filter(s => s.severity === 'medium').length,
      color: '#eab308'
    },
    {
      name: 'Alta',
      count: analysis.segments.filter(s => s.severity === 'high').length,
      color: '#ef4444'
    }
  ].filter(item => item.count > 0);

  // Datos para el radar de puntuaciones
  const scoreData = [
    {
      subject: 'General',
      score: analysis.overallScore * 10,
      fullMark: 100
    },
    {
      subject: 'Propósito',
      score: analysis.purposeScore * 10,
      fullMark: 100
    },
    {
      subject: 'Legibilidad',
      score: analysis.readabilityIndex?.score || 0,
      fullMark: 100
    },
    {
      subject: 'Vocabulario',
      score: analysis.vocabularyRichness?.richness || 0,
      fullMark: 100
    },
    {
      subject: 'Sentimientos',
      score: (analysis.sentimentAnalysis?.confidence || 0) * 100,
      fullMark: 100
    }
  ];

  // Datos para emociones si están disponibles
  const emotionsData = analysis.sentimentAnalysis?.emotions ? [
    { name: 'Alegría', value: analysis.sentimentAnalysis.emotions.joy * 100, color: '#22c55e' },
    { name: 'Tristeza', value: analysis.sentimentAnalysis.emotions.sadness * 100, color: '#3b82f6' },
    { name: 'Enojo', value: analysis.sentimentAnalysis.emotions.anger * 100, color: '#ef4444' },
    { name: 'Miedo', value: analysis.sentimentAnalysis.emotions.fear * 100, color: '#6b7280' },
    { name: 'Sorpresa', value: analysis.sentimentAnalysis.emotions.surprise * 100, color: '#a855f7' }
  ].filter(emotion => emotion.value > 0) : [];

  return (
    <div className="space-y-6">
      {/* Gráfico de Problemas por Tipo */}
      {problemsData.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              📊 Distribución de Observaciones
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={problemsData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" fontSize={12} />
                <YAxis />
                <Tooltip />
                <Bar dataKey="count" fill="#8884d8" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Gráfico de Severidad */}
        {severityData.length > 0 && (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                ⚠️ Severidad de Problemas
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={250}>
                <PieChart>
                  <Pie
                    data={severityData}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="count"
                  >
                    {severityData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        )}

        {/* Radar de Puntuaciones */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              🎯 Análisis Multidimensional
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={250}>
              <RadarChart data={scoreData}>
                <PolarGrid />
                <PolarAngleAxis dataKey="subject" fontSize={12} />
                <PolarRadiusAxis
                  angle={90}
                  domain={[0, 100]}
                  fontSize={10}
                />
                <Radar
                  name="Puntuación"
                  dataKey="score"
                  stroke="#3b82f6"
                  fill="#3b82f6"
                  fillOpacity={0.3}
                />
                <Tooltip />
              </RadarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* Gráfico de Emociones si disponible */}
      {emotionsData.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              😊 Análisis Emocional
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={emotionsData} layout="horizontal">
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis type="number" domain={[0, 100]} />
                <YAxis dataKey="name" type="category" fontSize={12} />
                <Tooltip formatter={(value) => [`${value.toFixed(1)}%`, 'Intensidad']} />
                <Bar dataKey="value" fill="#8884d8" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      )}

      {/* Estadísticas Textuales */}
      {analysis.statistics && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              📈 Estadísticas del Texto
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="text-center p-3 bg-blue-50 rounded-lg">
                <div className="text-2xl font-bold text-blue-600">
                  {analysis.statistics.wordCount}
                </div>
                <div className="text-sm text-blue-600">Palabras</div>
              </div>
              <div className="text-center p-3 bg-green-50 rounded-lg">
                <div className="text-2xl font-bold text-green-600">
                  {analysis.statistics.sentenceCount}
                </div>
                <div className="text-sm text-green-600">Oraciones</div>
              </div>
              <div className="text-center p-3 bg-purple-50 rounded-lg">
                <div className="text-2xl font-bold text-purple-600">
                  {analysis.statistics.readingTime}
                </div>
                <div className="text-sm text-purple-600">Min. lectura</div>
              </div>
              <div className="text-center p-3 bg-orange-50 rounded-lg">
                <div className="text-2xl font-bold text-orange-600">
                  {analysis.statistics.averageWordsPerSentence.toFixed(1)}
                </div>
                <div className="text-sm text-orange-600">Palabras/oración</div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}