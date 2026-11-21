/**
 * Developer mode (`?dev=1` in the URL): shows source file and column names in the detail views' tooltips and
 * method notes. Off by default; the jury and the experts never see file names.
 */
export const DEV = typeof location !== "undefined" && new URLSearchParams(location.search).get("dev") === "1";
