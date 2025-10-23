/**
 * app.config.js
 * Centralized Expo config that reads environment variables to allow
 * different app names / package identifiers for development builds.
 *
 * Usage:
 *  - Set APP_NAME to change the display name
 *  - Set APP_SUFFIX to append to the Android package / iOS bundle id
 *    (example: APP_SUFFIX=.dev -> com.anonymous.BudgetTracker.dev)
 */
const fs = require("fs");
const path = require("path");

const base = require("./app.json");

function joinPkg(basePackage, suffix) {
  if (!suffix) return basePackage;
  // If suffix already contains a leading dot, just append
  return `${basePackage}${suffix.startsWith(".") ? suffix : `.${suffix}`}`;
}

module.exports = ({ config }) => {
  // Prefer process.env first, but also allow reading from a .env file in project root
  const envName = process.env.APP_NAME || process.env.EXPO_APP_NAME;
  const appSuffix = process.env.APP_SUFFIX || process.env.EXPO_APP_SUFFIX;

  const expo = Object.assign({}, base.expo, config || {});

  if (envName) {
    expo.name = envName;
    // Do NOT change slug automatically — changing slug can break EAS project
    // linking when a projectId is already associated. Only change slug when
    // an explicit APP_SLUG is provided.
  }

  const envSlug = process.env.APP_SLUG || process.env.EXPO_APP_SLUG;
  if (envSlug) {
    expo.slug = String(envSlug)
      .replace(/[^a-z0-9-]/gi, "")
      .toLowerCase();
  }

  if (appSuffix) {
    if (expo.android && expo.android.package) {
      expo.android.package = joinPkg(expo.android.package, appSuffix);
    }
    if (expo.ios && expo.ios.bundleIdentifier) {
      expo.ios.bundleIdentifier = joinPkg(expo.ios.bundleIdentifier, appSuffix);
    }
  }

  return { expo };
};
