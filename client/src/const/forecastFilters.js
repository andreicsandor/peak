export const ForecastFilters = {
  ALL: "allCond",
  EXCELLENT: "excellentCond",
  VERY_GOOD: "veryGoodCond",
  GOOD: "goodCond",
  FAIR: "fairCond",
  POOR: "poorCond",
  VERY_POOR: "veryPoorCond",
};

let forecastFilter = ForecastFilters.ALL;

export function getForecastFilter() {
  return forecastFilter;
}

export function setForecastFilter(newForecastFilter) {
  forecastFilter = newForecastFilter;
}
