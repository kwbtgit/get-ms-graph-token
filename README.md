# get-ms-graph-token
[日本語](README_J.md)

``get-ms-graph-token`` is a Microsoft Graph API token acquisition and token usage example.

The following example is described.

- ``get-ms-graph-token``
  - Get refresh token
- ``example``
  - Get access token using refresh token
  - Use access tokens to obtain Office365 user information of the token owner

## application registration
To get a Microsoft Graph API token, you need to register an application that uses the token in advance.

Since the application is registered in Azure Active Directory of Azure, it is necessary to create an account in Azure.

Below, after the account registered to the Azure, will the app registration method.

App registration is done from the Azure portal.

### Create app
- [Azure]-[Azure Active Directory]-[App registorations]-[+New registration]

> <img src="https://raw.github.com/kwbtgit/kwbtgit-images/master/get-ms-graph-token/01_new_registration.png" />

Enter ``http://localhost:3000/auth/callbak`` for ``Redirect URI``

> <img src="https://raw.github.com/kwbtgit/kwbtgit-images/master/get-ms-graph-token/02_redirect_uri.png" />

### App information memo
Go to [Overview] and make a note of ``Application (client) ID``.

> <img src="https://raw.github.com/kwbtgit/kwbtgit-images/master/get-ms-graph-token/03_application_id.png"/>

### Secret creation
Go to [Certifications & secrets] and click ``+ New client secret`` in [Client secrets].

> <img src="https://raw.github.com/kwbtgit/kwbtgit-images/master/get-ms-graph-token/04_new_secret.png" />

Make a note of the secret that will be generated.


## ``get-ms-graph-token`` execution
Add the ``Application ID`` and ``Client Secret`` that you noted down to the ``.env`` file.

If necessary, add the authority you want to obtain with ``SCOPES`` in ``src/server.ts``.

Since Node.js and npm are used, install them.

After installation, run:

```sh
npm install -D
npm install -P
npm run start
```

Access ``http://localhost:3000`` with a browser.

> <img src="https://raw.github.com/kwbtgit/kwbtgit-images/master/get-ms-graph-token/05_start.png" />

Log in to Office365 with ``signin``.

> <img src="https://raw.github.com/kwbtgit/kwbtgit-images/master/get-ms-graph-token/06_login.png" />

You can get the refresh token of the logged-in user.

> <img src="https://raw.github.com/kwbtgit/kwbtgit-images/master/get-ms-graph-token/07_token.png" />

## Token acquisition example
- Get access token using refresh token
- Use access tokens to obtain Office365 user information of the token owner

The sample of was described in ``example/src/index.ts``.
