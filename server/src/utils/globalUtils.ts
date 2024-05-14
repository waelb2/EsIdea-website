import { Request, Response, NextFunction } from 'express'
import { appendFile } from 'fs'

/**
 * Middleware to log incoming requests.
 * Logs the method and path of the incoming request.
 * Appends the request to the 'access.log' file.
 * @param req The Express request object.
 * @param res The Express response object.
 * @param next The next function in the middleware chain.
 */
export function loggerMiddleware(
  req: Request,
  res: Response,
  next: NextFunction
): void {
  console.log(`-------------------------------------
    ${req.method} request made to ${req.path}`)
  // Append the request to the log file
  appendFile(
    'access.log',
    `${new Date().toISOString()} - ${req.method} ${req.url}\n`,
    err => {
      if (err) {
        console.error('Error writing to access.log file:', err)
      }
    }
  )
  next()
}