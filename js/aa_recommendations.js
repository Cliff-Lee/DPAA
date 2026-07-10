(function () {
  function topicName(topicId) {
    const topic = (window.AA_SYLLABUS || []).find((item) => item.topicId === String(topicId));
    return topic ? `Topic ${topic.topicId}: ${topic.topicName}` : `Topic ${topicId}`;
  }

  function getTopicStats(attempts) {
    const allTopicIds = ["1", "2", "3", "4", "5"];
    const grouped = window.AAProgressEngine.groupedStats(
      attempts || [],
      (attempt) => attempt.topicId,
      (attempt) => `Topic ${attempt.topicId}: ${attempt.topicName}`
    );
    return allTopicIds.map((topicId) => {
      const existing = grouped.find((row) => row.id === topicId);
      return existing || {
        id: topicId,
        label: topicName(topicId),
        attempts: 0,
        correct: 0,
        accuracy: 0,
        averageTimeSeconds: 0
      };
    });
  }

  function recommendationForTopic(row) {
    if (row.attempts < 3) {
      return {
        priority: "more-practice",
        label: row.label,
        message: `${row.label}: try more practice to build evidence.`
      };
    }
    if (row.accuracy < 0.5) {
      return {
        priority: "foundation",
        label: row.label,
        message: `${row.label}: use foundation questions and review core methods.`
      };
    }
    if (row.accuracy < 0.75) {
      return {
        priority: "mixed",
        label: row.label,
        message: `${row.label}: use mixed practice to strengthen retrieval.`
      };
    }
    return {
      priority: "exam-style",
      label: row.label,
      message: `${row.label}: move to harder exam-style questions.`
    };
  }

  function getRecommendations(attempts, courseLevel) {
    const rows = getTopicStats(attempts);
    const topicRecommendations = rows.map(recommendationForTopic);
    const weakest = [...topicRecommendations].sort((a, b) => {
      const order = { foundation: 0, "more-practice": 1, mixed: 2, "exam-style": 3 };
      return order[a.priority] - order[b.priority] || a.label.localeCompare(b.label);
    });

    const recommendations = weakest.slice(0, 3);
    if (courseLevel === "HL") {
      const ahlAttempts = (attempts || []).filter((attempt) => attempt.level === "AHL");
      const ahlAccuracy = window.AAProgressEngine.accuracy(ahlAttempts);
      if (ahlAttempts.length < 3) {
        recommendations.push({
          priority: "ahl-more-practice",
          label: "AHL practice",
          message: "AHL: try more HL-only questions to build a separate evidence base."
        });
      } else if (ahlAccuracy < 0.5) {
        recommendations.push({
          priority: "ahl-foundation",
          label: "AHL practice",
          message: "AHL: return to foundation HL skills before Paper 3-style reasoning."
        });
      } else if (ahlAccuracy < 0.75) {
        recommendations.push({
          priority: "ahl-mixed",
          label: "AHL practice",
          message: "AHL: use mixed HL practice across algebra, functions, vectors and calculus."
        });
      } else {
        recommendations.push({
          priority: "ahl-exam-style",
          label: "AHL practice",
          message: "AHL: attempt harder Paper 3 reasoning and multi-step proof questions."
        });
      }
    }
    return recommendations;
  }

  function recommendedPracticeMode(attempts, courseLevel) {
    const first = getRecommendations(attempts, courseLevel)[0];
    if (!first) return "Whole course mixed practice";
    if (first.priority.includes("foundation")) return "Topic practice with foundation difficulty";
    if (first.priority.includes("more-practice")) return "Topic practice to gather more evidence";
    if (first.priority.includes("mixed")) return "Whole course mixed practice";
    return courseLevel === "HL" ? "HL Paper 3 reasoning practice" : "Paper 1 and Paper 2 exam-style practice";
  }

  window.AARecommendations = {
    getTopicStats,
    getRecommendations,
    recommendedPracticeMode
  };
})();
