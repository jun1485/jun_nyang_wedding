import type { WeddingData } from "~/types/wedding";
import { WEDDING_DATA } from "../data/wedding";

export default defineEventHandler((): WeddingData => {
  return WEDDING_DATA;
});
