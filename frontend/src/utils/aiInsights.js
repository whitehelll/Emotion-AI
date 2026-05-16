export function generateInsights(emotions) {
  if (!emotions.length) return "No data available";

  const top = emotions.reduce((a, b) => (a.count > b.count ? a : b));

  if (top.emotion === "sad") {
    return "User shows frequent sadness. Monitor engagement.";
  }

  if (top.emotion === "happy") {
    return "User is mostly positive and engaged.";
  }

  if (top.emotion === "angry") {
    return "User shows signs of frustration.";
  }

  return `Dominant emotion: ${top.emotion}`;
}