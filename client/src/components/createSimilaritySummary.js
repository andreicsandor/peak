export function createSimilaritySummary(route) {
  if (
    route.percentageSimilarity === null ||
    route.percentageSimilarity === undefined
  ) {
    return null;
  }

  const date = new Date(route.completedTime);

  const formattedDateTime = date.toLocaleString("en-US", {
    weekday: "short",
    year: "numeric",
    month: "short",
    day: "numeric",
    hour: "numeric",
    minute: "numeric",
    hour12: true,
  });

  // Convert percentage similarity to a number and round to one decimal place
  const similarityPercentage = parseFloat(
    route.percentageSimilarity.toFixed(1)
  );

  // Format percentage to avoid showing '.0' for whole numbers
  const formattedPercentage =
    similarityPercentage % 1 === 0
      ? similarityPercentage.toFixed(0)
      : similarityPercentage.toFixed(1);

  const similaritySummaryMarkup = `
      <div class="similarity-summary">
        <div class="summary-card">
          <div class="card-body">
            <div class="summary-info">
              <div class="summary-location">Route Completed</div>
              <div class="summary-datetime">${formattedDateTime}</div>
              <div class="summary-location"></div>
              <div class="summary-description">Similarity Achieved</div>
              <div class="summary-main">
                <div class="summary-temperature">${formattedPercentage}%</div>
                <div class="summary-rating"><img src="./src/assets/patch-check-fill.svg" alt="Logo"></div>
              </div>
              <div class="summary-message">Click Edit to view more details</div>              
          </div>
        </div>
      </div>
    `;

  const similaritySummary = document.createElement("div");
  similaritySummary.innerHTML = similaritySummaryMarkup;
  return similaritySummary;
}
