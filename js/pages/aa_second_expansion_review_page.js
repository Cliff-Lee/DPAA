(function () {
  function componentTable(part) {
    return `
      <div class="diagram-table-scroll">
        <table class="diagram-table review-mark-table">
          <thead><tr><th>Mark</th><th>Criterion</th><th>Dependency</th><th>FT</th><th>Alternatives</th><th>Accuracy / exactness</th></tr></thead>
          <tbody>${(part.markComponents || []).map((component) => `
            <tr>
              <td>${AA_UI.escapeHtml(component.type)}1</td>
              <td>${AA_UI.escapeHtml(component.criterion)}</td>
              <td>${AA_UI.escapeHtml(component.dependency)}</td>
              <td>${AA_UI.escapeHtml(component.followThrough)}</td>
              <td>${AA_UI.escapeHtml(component.acceptableAlternatives)}</td>
              <td>${AA_UI.escapeHtml(component.accuracyOrExactness)}</td>
            </tr>`).join("")}</tbody>
        </table>
      </div>`;
  }

  function familyCard(question, index) {
    return `
      <article id="${AA_UI.escapeHtml(question.familyId)}" class="card review-family-card">
        <div class="preview-header">
          <div><p class="eyebrow">Family ${index + 1}</p><h2>${AA_UI.escapeHtml(question.familyId)}</h2></div>
          <div class="meta-row">${AA_UI.questionBadges(question)}</div>
        </div>
        <p><strong>Reasoning signature:</strong> <code>${AA_UI.escapeHtml(question.reasoningSignature)}</code></p>
        <p><strong>Goal:</strong> ${AA_UI.escapeHtml(question.mathematicalGoal)}</p>
        <p><strong>Syllabus:</strong> ${question.syllabusIds.map(AA_UI.escapeHtml).join("; ")} | <strong>Style:</strong> ${AA_UI.escapeHtml(question.questionStyle)} | <strong>Context:</strong> ${AA_UI.escapeHtml(question.contextType)} | <strong>Representation:</strong> ${AA_UI.escapeHtml(question.representationType)}</p>
        <p><strong>Primary strategy:</strong> ${AA_UI.escapeHtml(question.primarySolutionStrategy)}</p>
        <p><strong>Alternatives:</strong> ${question.acceptableAlternativeStrategies.map(AA_UI.escapeHtml).join("; ")}</p>
        <p><strong>Prior knowledge:</strong> ${question.requiredPriorKnowledge.map(AA_UI.escapeHtml).join("; ")}</p>
        <p><strong>Misconceptions:</strong> ${question.misconceptionsTested.map(AA_UI.escapeHtml).join("; ")}</p>
        ${question.promptLatex ? `<div class="math-block"><strong>Question lead:</strong> ${AA_UI.escapeHtml(question.promptLatex)}</div>` : ""}
        ${AA_UI.renderDiagram(question.diagram)}
        <ol class="exam-parts" type="a">${question.parts.map((part) => `
          <li>
            <div class="math-block"><strong>Question:</strong> ${AA_UI.escapeHtml(part.promptLatex)} <span class="exam-marks">[${part.marks}]</span></div>
            <div class="math-block"><strong>Answer and working:</strong> ${AA_UI.escapeHtml(part.workedSolutionLatex)}</div>
            <div><strong>Formatted markscheme:</strong> ${part.markschemeLatex}</div>
            ${componentTable(part)}
          </li>`).join("")}</ol>
        <p><strong>Verification:</strong> ${AA_UI.escapeHtml(question.answerVerificationMethod)}</p>
        <p><strong>Constraints:</strong> ${AA_UI.escapeHtml(JSON.stringify(question.parameterConstraints))} | <strong>Degenerate cases:</strong> ${question.degenerateCases.map(AA_UI.escapeHtml).join("; ")}</p>
      </article>`;
  }

  function links(title, questions) {
    return `<section><h3>${AA_UI.escapeHtml(title)} (${questions.length})</h3><p>${questions.map((question) => `<a href="#${AA_UI.escapeHtml(question.familyId)}">${AA_UI.escapeHtml(question.familyId)}</a>`).join(" · ")}</p></section>`;
  }

  function init() {
    const questions = window.AA_SECOND_EXPANSION_QUESTIONS || [];
    const accessible = questions.filter((question) => Number(question.difficulty) === 2).slice(0, 10);
    const standard = questions.filter((question) => Number(question.difficulty) === 3).slice(0, 10);
    const challenging = questions.filter((question) => Number(question.difficulty) === 4).slice(0, 10);
    AA_UI.byId("reviewSummary").innerHTML = `<h2>Review scope</h2><p><strong>${questions.length}</strong> fully rendered fixed exemplars. Each card keeps question, answer, markscheme, structural components, metadata and reasoning signature together.</p>`;
    AA_UI.byId("reviewIndexes").innerHTML = [
      links("Difficulty 4", questions.filter((question) => Number(question.difficulty) === 4)),
      links("Mixed-topic families", questions.filter((question) => question.mixedTopic)),
      links("Diagram-dependent families", questions.filter((question) => question.diagramDependency === "mathematically-necessary")),
      links("Deterministic sample: 10 accessible", accessible),
      links("Deterministic sample: 10 standard", standard),
      links("Deterministic sample: 10 challenging", challenging)
    ].join("");
    AA_UI.byId("reviewFamilies").innerHTML = questions.map(familyCard).join("");
    AA_UI.typeset(document.body);
  }
  window.addEventListener("DOMContentLoaded", init);
})();
