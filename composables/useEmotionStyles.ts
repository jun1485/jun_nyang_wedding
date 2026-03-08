import { appStyles, contactStyles, homeStyles, sharedStyles } from "./emotion-styles/baseStyles";
import {
  countdownStyles,
  flowerPetalStyles,
  galleryStyles,
  invitationStyles,
  musicPlayerStyles,
  venueStyles,
} from "./emotion-styles/experienceStyles";
import { adminStyles, guestbookStyles } from "./emotion-styles/interactionStyles";

export function useEmotionStyles() {
  return {
    sharedStyles,
    appStyles,
    homeStyles,
    contactStyles,
    guestbookStyles,
    adminStyles,
    countdownStyles,
    galleryStyles,
    invitationStyles,
    musicPlayerStyles,
    venueStyles,
    flowerPetalStyles,
  };
}
