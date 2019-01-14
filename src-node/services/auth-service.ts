import * as jwt from 'jsonwebtoken';
import * as bcrypt from 'bcrypt';
import { ServiceManager } from '../service-manager';
import { HttpError } from '../utilities/http-error.class';
import { MongoDbService } from './mongo-db-service';
import { Request, Response, NextFunction } from 'express';

export class AuthService {

    // here is the service that will do all db work
    private dbService: MongoDbService = ServiceManager.getService('db-service');

    private JWT_SECRET = process.env.JWT_SECRET || 'jwt-encryption-secret';
    private BCRYPT_SALT_ROUNDS = 10;

    /**
     * Express RequestHandler to handle login requests
     */
    public async loginHandler(req: Request, res: Response) {

        // get the email and password from the request body
        const userEmail: string = req.body.email.toLowerCase();
        const userPassword = req.body.password;

        // make sure that the user exists
        const userData: any = await this.dbService.getDocumentById('users', userEmail );
        if ( !userData ) {
            console.log('Invalid login attempt, unknown username: user=\'' + userEmail + '\'');
            const httpError: HttpError = { errorCode: 301, errorMessage: 'user does not exist' };
            res.status(401).send(httpError);
            return;
        }

        // make sure that the user provided a valid password
        const validPassword = await this.validateUserAndPassword(userData, userPassword);
        if ( !validPassword ) {
            console.log('Invalid login attempt, bad password: user=\'' + userEmail + '\'');
            const httpError: HttpError = { errorCode: 302, errorMessage: 'invalid password' };
            res.status(401).send(httpError);
            return;
        }

        // create a JWT token that will be sent back to the client
        const jwtPayload: JwtPayload = {userEmail: userEmail};
        const jwtBearerToken = jwt.sign( jwtPayload, this.JWT_SECRET, {expiresIn: 60 * 60 * 24} );

        // set it in an HTTP Only + Secure Cookie
        res.send( { sessionid: jwtBearerToken } );
    }

    /**
     * Express RequestHandler to handle signup requests
     */
    public async signupHandler(req: Request, res: Response) {

        // get the email and password from the request body
        const userEmail: string = req.body.email.toLowerCase();
        const userPassword = req.body.password;

        // make sure that the user does not exist
        const userData: any = await this.dbService.getDocumentById('users', userEmail );
        if ( userData ) {
            const httpError: HttpError = { errorCode: 201, errorMessage: 'email already exists' };
            res.status(401).send(httpError);
            return;
        }

        // encrypt the password
        const encryptedPassword = await bcrypt.hash(userPassword, this.BCRYPT_SALT_ROUNDS );

        // create a new user
        const newUser: UserDBData = { _id: userEmail, userPasswordEncrypted: encryptedPassword };
        await this.dbService.createDocument('users', newUser );

        // create a JWT token that will be sent back to the client
        const jwtPayload: JwtPayload = {userEmail: userEmail};
        const jwtBearerToken = jwt.sign( jwtPayload, this.JWT_SECRET, {expiresIn: 60 * 60 * 24} );

        // set it in an HTTP Only + Secure Cookie
        res.send( { sessionid: jwtBearerToken } );
    }

    /**
     * Express RequestHandler that will validate if the user has a valid session, ie. have they
     * generated a valid sessionid token in the request header.
     */
    public async checkIfAuthenticated(req: Request, res: Response, next: NextFunction ) {

        try {

            // make sure that the sessionid was provided in the header
            const sessionId = ( req.headers.sessionid as string );
            if ( !sessionId ) {
                const httpError: HttpError = { errorCode: 101, errorMessage: 'no sessionid provided in request header' };
                res.status(401).send(httpError);
            }

            // validate that the sessionid is ok (throws an exception if invalid)
            const jwtPayload: JwtPayload = ( jwt.verify(sessionId , this.JWT_SECRET) as JwtPayload );

            // store the user id in the request header for future handlers
            req.headers.userid = jwtPayload.userEmail;

            // this is middleware, so pass this to the next Express router
            next();

        } catch (err) {
            const httpError: HttpError = {
                errorCode: 102,
                errorMessage: 'invalid sessionid provided in request header, use login to get a sessionid'
            };
            res.status(401).send(httpError);
        }
    }

    /**
     * Method to ensure that the provided password is valid for the
     * given user record from the DB
     * @param userData
     * @param password
     */
    private async validateUserAndPassword( userData: UserDBData, password: string ): Promise<boolean> {
        const match = await bcrypt.compare(password, userData.userPasswordEncrypted);
        if ( match ) {
            return true;
        } else {
            return false;
        }
    }
}

/**
 * An interface for the User record stored in the database
 */
interface UserDBData {
    _id: string;
    userPasswordEncrypted: string;
}

interface JwtPayload {
    userEmail: string;
}
