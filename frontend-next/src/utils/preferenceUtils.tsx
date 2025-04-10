// Function to get preference color based on type
export const getPreferenceColor = (): string => {
  return "bg-gray-200 text-black" // Unified color for all preferences
}

export const getPreferenceLabel = (key: string): string => {
  switch (key) {
    case "fun_social":
      return "Fun & Social"
    case "training_for_competitions":
      return "Training"
    case "fitness":
      return "Fitness"
    case "learning_tennis":
      return "Learning"
    default:
      return key.replace("_", " ")
  }
}