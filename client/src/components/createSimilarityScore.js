export function addSimilarityScore(percentageSimilarity) {
  const similarityWrapper = document.querySelector(".dashboard-similarity-wrapper");

  const similarityPercentage = parseFloat(
    percentageSimilarity.toFixed(1)
  );

  const formattedPercentage =
    similarityPercentage % 1 === 0
      ? similarityPercentage.toFixed(0)
      : similarityPercentage.toFixed(1);

  const contentMarkup = `
    <div class="dashboard-info-container">
      <div class="dashboard-info-item">
        <div class="dashboard-info-item">
          <span class="dashboard-info-value">${formattedPercentage}%</span>
        </div>
        <div class="dashboard-info-title">Similarity</div>
      </div>
    </div>
  `;

  similarityWrapper.innerHTML = contentMarkup;
}
