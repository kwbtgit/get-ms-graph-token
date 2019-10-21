# get-ms-graph-token
``get-ms-graph-token``は、Microsoft Graph APIのトークン取得およびトークン使用例です。

下記の例を記載しています。

- ``get-ms-graph-token``
  - リフレッシュトークン取得
- ``example``
  - リフレッシュトークンを使ってアクセストークン取得
  - アクセストークンを使って、トークン所有者のOffice365ユーザー情報取得

## アプリ登録
Microsoft Graph APIのトークンを取得するには、トークンを使用するアプリを事前に登録しておく必要があります。

アプリは、AzureのAzure Active Directoryで登録するので、Azureにアカウントを作成しておく必要があります。

以下、Azureにアカウント登録した後の、アプリ登録方法になります。

アプリ登録はAzureポータルから行います。

### アプリ作成
- [Azure]-[Azure Active Directory]-[App registorations]-[+New registration]

> <img src="https://raw.github.com/kwbtgit/kwbtgit-images/master/get-ms-graph-token/01_new_registration.png" />

``Redirect URI``に``http://localhost:3000/auth/callbak``と入力

> <img src="https://raw.github.com/kwbtgit/kwbtgit-images/master/get-ms-graph-token/02_redirect_uri.png" />


### アプリ情報メモ
[Overview]に移動して、``Application (client) ID``をメモしておきます。

> <img src="https://raw.github.com/kwbtgit/kwbtgit-images/master/get-ms-graph-token/03_application_id.png"/>

### シークレット作成
[Certifications & secrets]に移動して、[Client secrets]の``+New client secret``をクリックします。

> <img src="https://raw.github.com/kwbtgit/kwbtgit-images/master/get-ms-graph-token/04_new_secret.png" />

シークレットが生成されるのでメモしておくきます。

## ``get-ms-graph-token``実行
``.env``ファイルに、メモしておいた``Application ID``と``Client Secret``を追記します。

必要に応じて``src/server.ts``の``SCOPES``で、取得したい権限を追加します。

Node.jsおよびnpmを使用しているのでインストールしておきます。

インストール後、下記を実行します。
```sh
npm install -D
npm install -P
npm run start
```

ブラザで``http://localhost:3000``にアクセスします。

> <img src="https://raw.github.com/kwbtgit/kwbtgit-images/master/get-ms-graph-token/05_start.png" />

``signin``でOffice365にログインします。

> <img src="https://raw.github.com/kwbtgit/kwbtgit-images/master/get-ms-graph-token/06_login.png" />


ログインしたユーザーのリフレッシュトークンが取得できます。

> <img src="https://raw.github.com/kwbtgit/kwbtgit-images/master/get-ms-graph-token/07_token.png" />

## トークン取得例
- リフレッシュトークンを使ってアクセストークン取得
- アクセストークンを使って、トークン所有者のOffice365ユーザー情報取得

のサンプルを、``example/src/index.ts``に記載しました。