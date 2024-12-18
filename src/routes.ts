/**
 * An Array of routes that are accessible to the public
 * @type {string[]}
 */
export const publicRoutes = ["/", "/auth/new-verification"];

/**
 * An Array of routes that are accessible to authenticated users
 * @type {string[]}

*/

export const authRoutes = [
  "/auth/login",
  "/auth/register",
  "/auth/error",
  "/auth/reset",
  "/auth/new-password",
];

/**
 * An Array of routes that are accessible to authenticated users
 * @type {string}
 */

export const apiAuthPrefix = "/api/auth";
/**
 * An Array of routes that are accessible to authenticated users
 * @type {string}
 */

export const DEFAULT_LOGIN_REDIRECT = "/settings";
