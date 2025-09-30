// MusclesFront config
import Abs from "./abs";
import ArmsF from "./arms_f";
import Chest from "./chest";
import LegsF from "./legs_f";
import ShouldersF from "./shoulders_traps_f";

export const musclesFront = [
  { name: "Abs", Component: Abs, top: 180, left: 218, width: 80, height: 100, z: 6 },
  { name: "ArmsF", Component: ArmsF, top: 161, left: 166, width: 190, height: 125, z: 2 },
  { name: "Chest", Component: Chest, top: 140, left: 208.5, width: 100, height: 50, z: 4 },
  { name: "Shoulders", Component: ShouldersF, top: 114, left: 186, width: 150, height: 53, z: 3 },
  { name: "Legs", Component: LegsF, top: 265, left: 197.3, width: 110, height: 200, z: 1 },
  
  
];
