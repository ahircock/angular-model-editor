import * as jwt from 'jsonwebtoken';
import { ServiceManager } from '../service-manager';
import { MongoDbService } from '../services/mongo-db-service';
import { Request, Response, NextFunction } from 'express';

export class AuthService {

    // here is the service that will do all db work
    private dbService: MongoDbService = ServiceManager.getService("db-service");

    private JWT_SECRET = process.env.JWT_SECRET || "jwt-encryption-secret";
    
    /**
     * Express RequestHandler to handle login requests
     */
    public async loginHandler(req: Request, res: Response) {

        // get the email and password from the request body
        const userEmail = req.body.email;
        const userPassword = req.body.password;

        // make sure that the user exists
        let userData: any = await this.dbService.getDocumentById("users", userEmail )
        if ( !userData ) {
            res.status(401).send({ errCode: 301, error: "user does not exist" });
            return;
        }

        // make sure that the user provided a valid password
        if ( !this.validateUserAndPassword(userData, userPassword) ) {
            res.status(401).send({ errCode: 302, error: "invalid password" });
            return;
        }

        // create a JWT token that will be sent back to the client
        let jwtPayload = {userEmail:userEmail};
        const jwtBearerToken = jwt.sign( jwtPayload, this.JWT_SECRET, {expiresIn:60*60*24} )

        // set it in an HTTP Only + Secure Cookie
        res.send( { sessionid: jwtBearerToken } );
    };

    /**
     * Express RequestHandler to handle signup requests
     */
    public async signupHandler(req: Request, res: Response) {

        // get the email and password from the request body
        const userEmail = req.body.email;
        const userPassword = req.body.password;

        // make sure that the user does not exist
        let userData: any = await this.dbService.getDocumentById("users", userEmail )
        if ( userData ) {
            res.status(401).send({ errCode: 201, error: "email already exists" });
            return;
        }

        // create a new user
        let newUser: UserData = { _id: userEmail, userPasswordEncrypted: userPassword };
        await this.dbService.createDocument("usersdb", newUser );

        // create a JWT token that will be sent back to the client
        let jwtPayload = {userEmail:userEmail};
        const jwtBearerToken = jwt.sign( jwtPayload, this.JWT_SECRET, {expiresIn:60*60*24} )

        // set it in an HTTP Only + Secure Cookie
        res.send( { sessionid: jwtBearerToken } );
    };

    public async checkIfAuthenticated(req: Request, res: Response, next: NextFunction ) {

        try {

            // make sure that the sessionid was provided in the header
            let sessionId = ( req.headers.sessionid as string );
            if ( !sessionId ) {
                res.status(401).send({ errCode: 101, error: "no sessionid provided in request header" });
            }

            // validate that the sessionid is ok
            jwt.verify(sessionId , this.JWT_SECRET);        
            next();

        } catch (err) {
            res.status(401).send({ errCode: 102, error: "invalid sessionid provided in request header, use login to get a sessionid" });
        }
    }

    private validateUserAndPassword( userData: UserData, password: string ): boolean {
        if ( userData.userPasswordEncrypted == password ) {
            return true;
        } else {
            return false;
        }
    }
}

interface UserData {
    _id: string,
    userPasswordEncrypted: string
}