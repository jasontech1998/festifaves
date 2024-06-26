import {
    GetServerSidePropsContext,
    NextApiRequest,
    NextApiResponse,
} from 'next'
import { NextAuthOptions, getServerSession } from "next-auth";

const SpotifyScope =
  "user-read-recently-played user-read-playback-state user-top-read user-modify-playback-state user-read-currently-playing user-follow-read playlist-read-private user-read-email user-read-private user-library-read playlist-read-collaborative playlist-modify-private";

import SpotifyProvider from 'next-auth/providers/spotify';

const authOptions: NextAuthOptions = {
  providers: [
    SpotifyProvider({
      clientId: process.env.SPOTIFY_CLIENT_ID || "",
      clientSecret: process.env.SPOTIFY_CLIENT_SECRET || "",
      authorization: {
        params: { scope: SpotifyScope },
      },
    }),
  ],
  secret: process.env.NEXTAUTH_SECRET,
  callbacks: {
    jwt: async ({ token, user, account }) => {
        if (account && account.access_token) {
            token.accessToken = account.access_token
        }

        return token
    },
    session: async ({ session, token, user }) => {
        // If we want to make the accessToken available in components, then we have to explicitly forward it here.
        return { ...session, token: token.accessToken }
    },
  },
};

function auth(  // <-- use this function to access the jwt from React components
    ...args:
        | [GetServerSidePropsContext['req'], GetServerSidePropsContext['res']]
        | [NextApiRequest, NextApiResponse]
        | []
) {
    return getServerSession(...args, authOptions)
}

export { authOptions, auth }
