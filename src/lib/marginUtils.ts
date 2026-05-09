import React from 'react';
export const getMarginClass = (marginSize: "tight" | "normal" | "wide" | "custom", customMarginPx?: number): string => {
  if (marginSize === "custom") {
    return "";
  }
  switch (marginSize) {
    case "tight":
      return "p-2";
    case "normal":
      return "p-4";
    case "wide":
      return "p-8";
    default:
      return "p-4";
  }
};

export const getMarginStyle = (
  marginSize: "tight" | "normal" | "wide" | "custom",
  customMarginPx?: number,
  customHorizontalMarginPx?: number,
  customVerticalMarginPx?: number,
): React.CSSProperties => {
  if (marginSize === "custom") {
    const horizontal = customHorizontalMarginPx ?? customMarginPx ?? 16;
    const vertical = customVerticalMarginPx ?? customMarginPx ?? 16;
    return {
      marginLeft: `${horizontal}px`,
      marginRight: `${horizontal}px`,
      marginTop: `${vertical}px`,
      marginBottom: `${vertical}px`,
    };
  }
  return {};
};

export const getHorizontalMarginClass = (
  marginSize: "tight" | "normal" | "wide" | "custom",
  customMarginPx?: number,
): string => {
  if (marginSize === "custom") {
    return "";
  }
  switch (marginSize) {
    case "tight":
      return "px-2";
    case "normal":
      return "px-4";
    case "wide":
      return "px-8";
    default:
      return "px-4";
  }
};

export const getHorizontalMarginStyle = (
  marginSize: "tight" | "normal" | "wide" | "custom",
  customMarginPx?: number,
  customHorizontalMarginPx?: number,
): React.CSSProperties => {
  if (marginSize === "custom") {
    const horizontal = customHorizontalMarginPx ?? customMarginPx ?? 16;
    return { marginLeft: `${horizontal}px`, marginRight: `${horizontal}px` };
  }
  return {};
};

export const getVerticalMarginClass = (
  marginSize: "tight" | "normal" | "wide" | "custom",
  customMarginPx?: number,
): string => {
  if (marginSize === "custom") {
    return "";
  }
  switch (marginSize) {
    case "tight":
      return "py-2";
    case "normal":
      return "py-4";
    case "wide":
      return "py-8";
    default:
      return "py-4";
  }
};

export const getVerticalMarginStyle = (
  marginSize: "tight" | "normal" | "wide" | "custom",
  customMarginPx?: number,
  customVerticalMarginPx?: number,
): React.CSSProperties => {
  if (marginSize === "custom") {
    const vertical = customVerticalMarginPx ?? customMarginPx ?? 16;
    return { marginTop: `${vertical}px`, marginBottom: `${vertical}px` };
  }
  return {};
};

