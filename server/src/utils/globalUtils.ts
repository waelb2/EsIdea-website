import { Request, Response } from 'express'
import { NextFunction } from 'express'
import { appendFile } from 'fs'

export function loggerMiddleware (
    req: Request,
    res: Response,
    next: NextFunction
  ): void {
    console.log(`-------------------------------------
      ${req.method} request made to ${req.path}`)
    // Rajouter la requete dans le fichier log
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