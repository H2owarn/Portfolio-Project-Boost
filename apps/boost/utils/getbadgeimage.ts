export function getBadgeImage(assetKey: string) {
  switch (assetKey) {
    case "first_workout.png":
      return require("@/assets/badges/first_workout.png");
    case "ten_workouts.png":
      return require("@/assets/badges/ten_workouts.png");
    case "consistency_king.png":
      return require("@/assets/badges/consistency_king.png");
    case "rival_destroyer.png":
      return require("@/assets/badges/rival_destroyer.png");
    case "charged_up.png":
      return require("@/assets/badges/charged_up.png");
    case "rising_star.png":
      return require("@/assets/badges/rising_star.png");
    case "boost.png":
      return require("@/assets/badges/boost.png");
    case "no_rest.png":
      return require("@/assets/badges/no_rest.png");
    default:
      return require("@/assets/badges/default.png");
  }
}
