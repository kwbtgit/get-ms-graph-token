// Example use Microsoft Graph API token
//     refresh token
//     get access token
//     use Graph API (get me information)

import * as dotenv from 'dotenv';
import * as fs from 'fs';
import * as simpleOauth2 from 'simple-oauth2';
import axios from 'axios';
if (process.env.DEBUG) {
    dotenv.config({ path: './.env.local' });
} else {
    dotenv.config();
}

const oauth2 = simpleOauth2.create({
    client: {
        id: process.env.CLIENT_ID,
        secret: process.env.CLIENT_SECRET
    },
    auth: {
        tokenHost: "https://login.microsoftonline.com/common",
        authorizePath: "/oauth2/v2.0/authorize",
        tokenPath: "/oauth2/v2.0/token"
    }
});

// saved token
const TOKEN_PATH = './data/token';

async function getToken() {

    let graphToken: any = {
        "access_token": "",
        "refresh_token": "",
        "expires_in": ""
    };

    if (fs.existsSync(TOKEN_PATH)) {
        // read saved token
        graphToken = JSON.parse(fs.readFileSync(TOKEN_PATH).toString());

        const accessToken = oauth2.accessToken.create(graphToken);
        if (!accessToken.expired()) {
            // return access token
            return graphToken.access_token;

        }
    } else {
        // set initial token
        graphToken.refresh_token = process.env.REFRESH_TOKEN;
    }

    // refresh token
    const accessToken = oauth2.accessToken.create(graphToken);
    const token = await accessToken.refresh();

    // save token
    graphToken = token.token;
    fs.writeFileSync(TOKEN_PATH, JSON.stringify(graphToken));

    // return access token
    return graphToken.access_token;
}

async function testGetMe(token: string) {
    const url = `https://graph.microsoft.com/v1.0/me`;

    const res = await axios.request({
        headers: {
            'authorization': `Bearer ${token}`
        },
        url,
        method: "GET"
    });

    return res.data;
}

(async () => {
    try {

        const access_token = await getToken();

        const user = await testGetMe(access_token);
        console.log(user);

    } catch (err) {

        console.log(err);

    }
})();

