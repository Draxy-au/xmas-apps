import NextAuth from 'next-auth';
import CredentialProvider from "next-auth/providers/credentials"

import { connectToDatabase, userExists } from "../../../lib/db";
import { verifyPassword } from "../../../lib/auth";
 
 
// NextAuth() executes and returns a handler function 
export default NextAuth({
    // object used to configure NextAuth's behaviour 
    session: {
        strategy: "jwt",
        maxAge: 60 * 60 * 24 * 30, // 30 days
        updateAge: 60 * 60 * 24 // 24 hours
    },
    providers: [
        CredentialProvider({
            name: "credentials",
            async authorize(credentials) {
                if (!credentials) {
                    throw new Error('Invalid credentials!');
                }

                const client = await connectToDatabase();
                const db = client.db();
                const user = await userExists(db, 'users', { email: credentials.email });

                if (!user) {
                    // no user with the entered email
                    client.close();
                    throw new Error('No user found!');
                }
                


                // found a user with that email address, check for password
                const isValid = await verifyPassword(credentials.password, user.password);

                if (!isValid) {
                    client.close();
                    throw new Error('Invalid password! Try again!');

                }

                client.close();

                // authorization succeeded 
                const uId = user._id.valueOf().toString();
                const fUser = { name: user.username, email: user.email, id: uId };

                // return object that is encoded for JWT token
                return fUser;                
            },
            credentials: {
                username: { label: "username", type: "text", placeholder: "username" },
                email: { label: "email", type: "email", placeholder: "test@test.com" },
                password: { label: "Password", type: "password" },
                id: { id: "id", type: "text"}
            },
        },
        )
    ],
    theme: {
       colorScheme: "auto"
    }
 
});