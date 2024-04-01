import { Request, Response, NextFunction } from 'express';

import bcrypt from 'bcrypt';
import passport from 'passport';
import { User } from '../user/userModels';
import jwt from 'jsonwebtoken';

const auth = (req: Request, res: Response) => {
    res.send('<a href="/auth/google">Authenticate with Google</a>');
}

//////////////////////////////// google auth //////////////////////////////////////

const authenticate = passport.authenticate('google', { scope: ['email profile'], prompt: 'select_account' });

const authenticateCallback = passport.authenticate('google');



const logout = (req: Request, res: Response) => {
    req.logout(() => { });
    res.redirect('/auth');
}
//////////////////////////////// google auth //////////////////////////////////////

const login_get = (req: Request, res: Response) => {
    res.send("login_get");
}
const createToken = (id:any) => {
    return jwt.sign({ id }, 'net ninja secret', {
      expiresIn: 30*24*60*60,
    });
  };
const login_post = async (req: Request, res: Response) => {
    const { email, password } = req.body;

    try {
        const user = await User.findOne({ email: email},); // no validation !
        if (!user) {
            return res.status(200).json({ message:"No user found with that email!" });
        }
        const passwordMatch = await bcrypt.compare(String(password), String(user!.password));
        if (!passwordMatch){
            return res.status(404).json({ message: "Wrong Password, try again!" });
        }
        const token = createToken(user._id);
        res.cookie('jwt',token,{httpOnly:true,maxAge:30*24*60*60*1000});

        return res.status(200).json({ user });
       

    } catch (err) { 
        const errors = handleError(err);
        res.status(400).json({ errors });
    }
};

//////////////////////////////////////////////////////////////////////////
const addPassword = async (req: Request, res: Response) => {
    const { email, newPassword } = req.body;
    
    const salt = await bcrypt.genSalt();
    const hashedPassword = await bcrypt.hash(String(newPassword), salt);
    try {
        const updateResult = await User.findOneAndUpdate(
            { email: email },
            { $set: { password: hashedPassword } },
            { runValidators: true, new: true }
        );
        if (!updateResult) {
            return res.status(404).json({ message: "User not found" });
        }
        return res.status(200).json({ message: "Password Added Successfully" });
    } catch (e) {
        const errors = handleError(e);
        return res.status(404).json({ errors });
    }
}

//////////////////////////////////////////////////////////////////////////

const updatePassword = async (req: Request, res: Response) => {
    const { email, currentPassword, newPassword } = req.body;
    
    try {
        const user = await User.findOne({ email: email},); // no validation !
        if (!user) {
            return res.status(400).json({ message:"No user found with that email!" });
        }
        const passwordMatch = await bcrypt.compare(currentPassword, String(user!.password));
        
        if (!passwordMatch){
            return res.status(404).json({ message: "Wrong Password, try again!" });
        }
        const salt = await bcrypt.genSalt();
        const hashedPassword = await bcrypt.hash(String(newPassword), salt);

        const updateResult = await User.findOneAndUpdate(
            { email: email },
            { $set: { password: hashedPassword } },
            { runValidators: true, new: true }
        );
        if (!updateResult) {
            return res.status(404).json({ message: "User not found" });
        }
        return res.status(200).json({ message: "Password Added Successfully" });
    } catch (e) {
        const errors = handleError(e);
        return res.status(404).json({ errors });
    }
}

//////////////////////////////////////////////////////////////////////////

const handleError = (err: any) => {
    let errors: any = {};
    if (err.name === 'ValidationError') {
        Object.values(err.errors).forEach((validationError: any) => {
            errors[validationError.path] = validationError.message;
        });
    }
    return errors;
}

export { login_get, login_post, auth, authenticate, authenticateCallback, logout, addPassword,updatePassword };