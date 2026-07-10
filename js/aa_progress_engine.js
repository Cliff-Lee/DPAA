(function () {
  function attemptsFor(attempts, predicate) {
    return (attempts || []).filter(predicate || (() => true));
  }

  function accuracy(attempts) {
    const rows = attempts || [];
    if (!rows.length) return 0;
    return rows.filter((attempt) => attempt.isCorrect).length / rows.length;
  }

  function averageTime(attempts) {
    const rows = attempts || [];
    if (!rows.length) return 0;
    return rows.reduce((sum, attempt) => sum + Number(attempt.timeTakenSeconds || 0), 0) / rows.length;
  }

  function groupBy(attempts, keyFn) {
    return (attempts || []).reduce((groups, attempt) => {
      const key = keyFn(attempt) || "Unknown";
      if (!groups[key]) groups[key] = [];
      groups[key].push(attempt);
      return groups;
    }, {});
  }

  function groupedStats(attempts, keyFn, labelFn) {
    return Object.entries(groupBy(attempts, keyFn)).map(([key, rows]) => ({
      id: key,
      label: labelFn ? labelFn(rows[0], key) : key,
      attempts: rows.length,
      correct: rows.filter((attempt) => attempt.isCorrect).length,
      accuracy: accuracy(rows),
      averageTimeSeconds: averageTime(rows)
    }));
  }

  function masteryScore(attemptsOrCount, maybeAccuracy) {
    const attempts = Array.isArray(attemptsOrCount) ? attemptsOrCount.length : Number(attemptsOrCount || 0);
    const acc = Array.isArray(attemptsOrCount) ? accuracy(attemptsOrCount) : Number(maybeAccuracy || 0);
    if (attempts < 3) return "Not enough evidence";
    return acc * Math.min(1, attempts / 5);
  }

  function weakestRows(rows, limit = 3) {
    return [...rows]
      .filter((row) => row.attempts > 0)
      .sort((a, b) => {
        if (a.accuracy !== b.accuracy) return a.accuracy - b.accuracy;
        return b.attempts - a.attempts;
      })
      .slice(0, limit);
  }

  function readiness(attempts, paperStyle) {
    const rows = attemptsFor(attempts, (attempt) => attempt.paperStyle === paperStyle);
    const acc = accuracy(rows);
    const mastery = masteryScore(rows);
    let label = "Not enough evidence";
    if (typeof mastery === "number") {
      if (mastery >= 0.75) label = "Ready";
      else if (mastery >= 0.5) label = "Developing";
      else label = "Needs practice";
    }
    return {
      paperStyle,
      attempts: rows.length,
      accuracy: acc,
      averageTimeSeconds: averageTime(rows),
      masteryScore: mastery,
      label
    };
  }

  function misconceptionFrequency(attempts) {
    const counts = {};
    (attempts || []).forEach((attempt) => {
      if (attempt.isCorrect) return;
      (attempt.misconceptionTags || []).forEach((tag) => {
        counts[tag] = (counts[tag] || 0) + 1;
      });
    });
    return Object.entries(counts)
      .map(([tag, count]) => ({ tag, count }))
      .sort((a, b) => b.count - a.count || a.tag.localeCompare(b.tag));
  }

  function calculateStats(attempts) {
    const rows = attempts || [];
    const byTopic = groupedStats(
      rows,
      (attempt) => attempt.topicId,
      (attempt) => `Topic ${attempt.topicId}: ${attempt.topicName}`
    ).sort((a, b) => Number(a.id) - Number(b.id));
    const bySyllabus = groupedStats(
      rows,
      (attempt) => attempt.syllabusId,
      (attempt) => attempt.syllabusLabel || attempt.syllabusId
    ).sort((a, b) => a.id.localeCompare(b.id));

    return {
      totalAttempts: rows.length,
      correct: rows.filter((attempt) => attempt.isCorrect).length,
      accuracy: accuracy(rows),
      accuracyByTopic: byTopic,
      accuracyBySyllabusPoint: bySyllabus,
      averageTimeSeconds: averageTime(rows),
      weakestTopics: weakestRows(byTopic),
      weakestSyllabusPoints: weakestRows(bySyllabus),
      masteryScore: masteryScore(rows),
      paper1Readiness: readiness(rows, "Paper 1"),
      paper2Readiness: readiness(rows, "Paper 2"),
      paper3Readiness: readiness(rows, "Paper 3"),
      misconceptionFrequency: misconceptionFrequency(rows)
    };
  }

  function heatmapRows(attempts, syllabusPoints) {
    const rowsByStudent = groupBy(attempts, (attempt) => attempt.nickname);
    return Object.entries(rowsByStudent)
      .sort(([a], [b]) => a.localeCompare(b))
      .map(([nickname, studentAttempts]) => {
        const cells = (syllabusPoints || []).map((point) => {
          const cellAttempts = attemptsFor(studentAttempts, (attempt) => attempt.syllabusId === point.id);
          return {
            syllabusId: point.id,
            label: point.shortLabel || point.label,
            attempts: cellAttempts.length,
            accuracy: accuracy(cellAttempts),
            masteryScore: masteryScore(cellAttempts)
          };
        });
        return { nickname, cells };
      });
  }

  window.AAProgressEngine = {
    attemptsFor,
    accuracy,
    averageTime,
    groupedStats,
    masteryScore,
    weakestRows,
    readiness,
    misconceptionFrequency,
    calculateStats,
    heatmapRows
  };
})();
