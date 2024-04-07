
import { Request, Response, NextFunction } from 'express';

const dashboard = (req: Request, res: Response) => {
    if (req.user) {
        res.status(200).json({
          success: true,
          message: "successfull",
          user: req.user,
          //   cookies: req.cookies
        });
      }
};

export {dashboard};