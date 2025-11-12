export function getBadgeImage(assetKey: string) {
  switch (assetKey) {

    case "all_the_way_up.png":
      return require("@/assets/badges/all_the_way_up.png");

    case "are_we_there_yet.png":
      return require("@/assets/badges/are_we_there_yet.png");

    case "boost.png":
      return require("@/assets/badges/boost.png");

    case "bring_it_on.png":
      return require("@/assets/badges/bring_it_on.png");

    case "charged_up.png":
      return require("@/assets/badges/charged_up.png");

    case "consistency_king.png":
      return require("@/assets/badges/consistency_king.png");

    case "default.png":
      return require("@/assets/badges/default.png");

    case "first_workout.png":
      return require("@/assets/badges/first_workout.png");

    case "masterful.png":
      return require("@/assets/badges/masterful.png");

    case "never_cold.png":
      return require("@/assets/badges/never_cold.png");

    case "no_rest.png":
      return require("@/assets/badges/no_rest.png");

    case "olympus.png":
      return require("@/assets/badges/olympus.png");

    case "rival_destroyer.png":
      return require("@/assets/badges/rival_destroyer.png");

    case "rising_star.png":
      return require("@/assets/badges/rising_star.png");

    case "shining.png":
      return require("@/assets/badges/shining.png");

    case "solo_leveling.png":
      return require("@/assets/badges/solo_leveling.png");

    case "ten_workouts.png":
      return require("@/assets/badges/ten_workouts.png");

    case "xp_boost.png":
      return require("@/assets/badges/xp_boost.png");

    default:
      return require("@/assets/badges/default.png");
  }
}
