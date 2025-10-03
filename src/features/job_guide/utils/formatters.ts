import * as schemas from '@shared/models/index.js';

export const formatUserInfo = (userInfo: schemas.UserInfoType) => {
  let infoString = '';

  Object.entries(userInfo).forEach(([key, value]) => {
    if (value) {
      infoString += `${key}: ${value}\n`;
    }
  });

  return infoString;
}

export const formatEducationInfo = (educationInfo: schemas.EducationInfoType) => {
  let infoString = '';

  Object.entries(educationInfo).forEach(([key, value]) => {
    if (value) {
      infoString += `${key}: ${value}\n`;
    }
  });

  return infoString;
}