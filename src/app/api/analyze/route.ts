import { NextRequest, NextResponse } from 'next/server';
import { AnalysisResult } from '@/types/analysis';

export async function POST(req: NextRequest) {
  try {
    const { text } = await req.json();

    if (!text || text.trim().length === 0) {
      return NextResponse.json(
        { error: 'El texto no puede estar vacío' },
        { status: 400 }
      );
    }

    const systemPrompt = `Eres un experto analizador de textos en español. Tu tarea es realizar un análisis exhaustivo y multidimensional de textos.

INSTRUCCIONES ESPECÍFICAS:

1. ESCANEO TRADICIONAL:
- Detecta errores ortográficos, gramaticales y de puntuación
- Identifica frases confusas, incoherentes o poco claras
- Encuentra muletillas, repeticiones innecesarias y redundancias
- Evalúa la coherencia general y claridad del texto

2. NUEVOS ANÁLISIS AVANZADOS:
- TONO: Evalúa formalidad/informalidad, registro académico vs coloquial
- LEGIBILIDAD: Complejidad de oraciones, vocabulario accesible
- SENTIMIENTOS: Emociones transmitidas (positivo, neutral, negativo)
- PLAGIO: Frases muy comunes o clichés repetitivos
- VOCABULARIO: Riqueza léxica, sofisticación, variedad

3. EVALUACIÓN DEL PROPÓSITO:
- Determina el propósito comunicativo (narrar, argumentar, describir, informar, persuadir)
- Evalúa qué tan bien cumple ese propósito (escala 1-10)
- Identifica dónde se logra bien y dónde se pierde

4. CATEGORIZACIÓN EXPANDIDA:
- "spelling": Errores ortográficos, gramaticales o de puntuación
- "confusion": Ideas confusas, incoherentes o poco claras
- "repetition": Muletillas, repeticiones innecesarias o redundancias
- "clarity": Ideas bien expresadas, claras y coherentes (aspectos positivos)
- "tone": Fragmentos con tono específico notable (formal/informal)
- "readability": Oraciones muy complejas o muy simples
- "sentiment": Fragmentos con carga emocional notable
- "plagiarism": Frases cliché o muy comunes
- "vocabulary": Uso de vocabulario sofisticado o repetitivo

5. ESTADÍSTICAS TEXTUALES:
Calcula métricas precisas del texto analizado.

6. RETROALIMENTACIÓN:
- Explica SIEMPRE cómo cada problema afecta la claridad y comprensión
- No solo digas "está mal según la norma", sino el impacto en el lector
- Incluye fortalezas, no solo errores
- Sé constructivo y educativo

RESPONDE EN JSON con esta estructura EXACTA:
{
  "segments": [
    {
      "id": "unique_id",
      "text": "fragmento exacto del texto",
      "start": posición_inicio,
      "end": posición_final,
      "type": "spelling|confusion|repetition|clarity|tone|readability|sentiment|plagiarism|vocabulary",
      "explanation": "explicación clara y educativa",
      "impact": "cómo afecta al lector/comprensión",
      "severity": "low|medium|high"
    }
  ],
  "strengths": ["fortaleza 1", "fortaleza 2"],
  "weaknesses": ["debilidad 1", "debilidad 2"],
  "purposeScore": número_1_al_10,
  "purposeAnalysis": "análisis del cumplimiento del propósito",
  "overallScore": número_1_al_10,
  "recommendations": ["recomendación 1", "recomendación 2"],
  "textPurpose": "narrative|argumentative|descriptive|informative|persuasive|unknown",
  "statistics": {
    "wordCount": número_palabras,
    "characterCount": número_caracteres,
    "paragraphCount": número_párrafos,
    "sentenceCount": número_oraciones,
    "averageWordsPerSentence": promedio_palabras_por_oración,
    "readingTime": minutos_lectura_estimados,
    "complexWords": número_palabras_complejas,
    "uniqueWords": número_palabras_únicas
  },
  "readabilityIndex": {
    "score": número_0_100,
    "level": "muy_facil|facil|moderado|dificil|muy_dificil",
    "description": "descripción del nivel de legibilidad"
  },
  "sentimentAnalysis": {
    "overall": "positivo|neutral|negativo",
    "confidence": número_0_1,
    "emotions": {
      "joy": número_0_1,
      "sadness": número_0_1,
      "anger": número_0_1,
      "fear": número_0_1,
      "surprise": número_0_1
    }
  },
  "vocabularyRichness": {
    "richness": número_0_100,
    "level": "basico|intermedio|avanzado|experto",
    "sophisticatedWords": ["palabra1", "palabra2"],
    "repetitiveWords": ["palabra1", "palabra2"]
  },
  "toneAnalysis": {
    "formality": "muy_informal|informal|neutral|formal|muy_formal",
    "confidence": número_0_1,
    "characteristics": ["característica1", "característica2"]
  }
}`;

    const response = await fetch('https://oi-server.onrender.com/chat/completions', {
      method: 'POST',
      headers: {
        'customerId': 'cus_SyFQwQZOWx0lia',
        'Content-Type': 'application/json',
        'Authorization': 'Bearer xxx'
      },
      body: JSON.stringify({
        model: 'openrouter/anthropic/claude-sonnet-4',
        messages: [
          {
            role: 'system',
            content: systemPrompt
          },
          {
            role: 'user',
            content: `Analiza este texto:\n\n"${text}"`
          }
        ],
        temperature: 0.3,
        max_tokens: 4000
      })
    });

    if (!response.ok) {
      throw new Error(`Error de la API: ${response.status}`);
    }

    const data = await response.json();
    const aiResponse = data.choices[0].message.content;
    
    // Intentar parsear la respuesta JSON
    let analysisResult: AnalysisResult;
    try {
      analysisResult = JSON.parse(aiResponse);
    } catch (parseError) {
      // Si falla el parsing, extraer JSON de la respuesta
      const jsonMatch = aiResponse.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        analysisResult = JSON.parse(jsonMatch[0]);
      } else {
        throw new Error('No se pudo parsear la respuesta de la IA');
      }
    }

    // Validar y asegurar que todos los segmentos tengan IDs únicos
    if (analysisResult.segments) {
      analysisResult.segments = analysisResult.segments.map((segment, index) => ({
        ...segment,
        id: segment.id || `segment-${index}-${Date.now()}`
      }));
    }

    return NextResponse.json(analysisResult);

  } catch (error) {
    console.error('Error en análisis de texto:', error);
    return NextResponse.json(
      { 
        error: 'Error interno del servidor',
        details: error instanceof Error ? error.message : 'Error desconocido'
      },
      { status: 500 }
    );
  }
}