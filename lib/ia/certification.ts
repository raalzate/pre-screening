import { Question, CertificationResult, ResultDetail } from "@/types/outputConfig";

/**
 * Server-side certification validation logic (US1)
 */
export function calculateCertificationResult(
    userAnswers: Record<number, string>,
    allQuestions: Question[]
): CertificationResult {
    let score = 0;
    const details: ResultDetail[] = [];

    allQuestions.forEach((q, index) => {
        const chosen = userAnswers[index] ?? null;
        const isCorrect = chosen === q.correctAnswer;

        if (isCorrect) score++;

        details.push({
            questionId: q.id,
            correct: isCorrect,
            chosen,
            correctAnswer: q.correctAnswer,
            rationale: q.rationale,
            relatedTo: q.relatedTo,
        });
    });

    const wrongTopics: string[] = [];
    details.forEach((d) => {
        if (!d.correct) wrongTopics.push(...d.relatedTo);
    });

    const analysis = wrongTopics.length === 0
        ? "Excelente, el candidato respondió correctamente todas las preguntas."
        : `El candidato mostró debilidades en las áreas: ${[...new Set(wrongTopics)].join(", ")}.`;

    return {
        score,
        total: allQuestions.length,
        details,
        analysis,
    };
}
