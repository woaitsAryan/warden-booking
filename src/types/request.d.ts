import {UserInterface} from '../models/userModel'

declare module 'express' {
    interface Request {
        user: UserInterface; 
    }
}