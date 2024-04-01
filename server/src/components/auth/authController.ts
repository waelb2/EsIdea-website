import { Request, Response,NextFunction } from 'express';

import passport from 'passport';



const auth = (req:Request,res:Response) => {
      res.send('<a href="/auth/google">Authenticate with Google</a>');
}

//////////////////////////////// google auth //////////////////////////////////////

const authenticate = passport.authenticate('google', { scope: ['email profile'], prompt: 'select_account' });

const authenticateCallback = passport.authenticate('google');

const isLoggedIn = (req: Request, res: Response, next: NextFunction) => {
    req.user ? next() : res.send("Please authenticate");
}

const logout = (req: Request, res: Response) => {
    req.logout(() => { });
    res.redirect('/auth');
}
//////////////////////////////// google auth //////////////////////////////////////

const login_get = (req: Request, res: Response) => {
    res.send("login_get");
}

const login_post = async (req: Request, res: Response) => {
    const { email, password, username } = req.body;

    try {
        res.status(200).json();
    } catch (err) {
        const errors = handleError(err);
        res.status(400).json({ errors });
    }
}


const handleError = (err: any) => {
    let errors: any = {};
    if (err.name === 'ValidationError') {
        Object.values(err.errors).forEach((validationError: any) => {
            errors[validationError.path] = validationError.message;
        });
    }
    return errors;
}

export { login_get, login_post,auth ,authenticate, authenticateCallback, isLoggedIn, logout};