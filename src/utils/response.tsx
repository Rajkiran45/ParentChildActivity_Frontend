/* eslint-disable prettier/prettier */
/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable prettier/prettier */
// eslint-disable-next-line prettier/prettier

import React from 'react';
import {Dimensions, PixelRatio, Platform, StatusBar} from 'react-native';

const {height, width} = Dimensions.get('window');

export let SCREENWIDTH = width;
export let SCREENHEIGHT = height;

let TARGET_MOBILE_WIDTH = 360;
let TARGET_MOBILE_HEIGHT = SCREENHEIGHT;

if (SCREENWIDTH >= 375 && SCREENWIDTH < 414) {
  TARGET_MOBILE_WIDTH = 300;
} else if (SCREENWIDTH >= 414) {
  TARGET_MOBILE_WIDTH = 300;
} else {
  TARGET_MOBILE_WIDTH = 350;
}

if (SCREENHEIGHT >= 667 && SCREENHEIGHT < 712) {
  TARGET_MOBILE_HEIGHT = SCREENHEIGHT - 120;
} else if (SCREENHEIGHT >= 712 && SCREENHEIGHT <= 812) {
  TARGET_MOBILE_HEIGHT = SCREENHEIGHT - 75;
} else {
  TARGET_MOBILE_HEIGHT = SCREENHEIGHT - 150;
}

function widthPercentageToDP(widthPercentage: any) {
  const element =
    typeof widthPercentage === 'number'
      ? widthPercentage
      : parseFloat(widthPercentage);
  return PixelRatio.roundToNearestPixel((SCREENWIDTH * element) / 100);
}

export function heightPercentageToDP(heightPercentage: any) {
  const element =
    typeof heightPercentage === 'number'
      ? heightPercentage
      : parseFloat(heightPercentage);
  return PixelRatio.roundToNearestPixel((SCREENHEIGHT * element) / 100);
}

export function getResWidth(no: number) {
  return widthPercentageToDP((no * 100) / TARGET_MOBILE_WIDTH);
}

export function getResHeight(no: number) {
  return heightPercentageToDP((no * 100) / TARGET_MOBILE_HEIGHT);
}

// MARK: -FontSize;
const standardLength = SCREENWIDTH > SCREENHEIGHT ? SCREENWIDTH : SCREENHEIGHT;
const offset =
  SCREENWIDTH > SCREENHEIGHT
    ? 0
    : Platform.OS === 'ios'
    ? 78
    : StatusBar.currentHeight; // iPhone X style SafeAreaView size in portrait
const deviceHeight =
 Platform.OS === 'android'
? standardLength - offset!
    : standardLength;

export function getFontpercent(percent: number) {
  const heightPercent = (percent * deviceHeight) / 100;
  return Math.round(heightPercent);
}

// guideline height for standard 5" device screen is 680
export function getFontSize(fontSize:number, standardScreenHeight = 680) {
  const heightPercent = (fontSize * deviceHeight) / standardScreenHeight;
  return Math.round(heightPercent);
}

export {widthPercentageToDP as wp, heightPercentageToDP as hp};
