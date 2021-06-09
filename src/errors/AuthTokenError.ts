export class AuthTokenError extends Error {
  constructor() {
    super('Error in Token request');
  }
}