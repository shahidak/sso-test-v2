module.exports = {
  development: {
    app: {
      name: 'Passport SAML strategy example',
      port: process.env.PORT || 3000
    },
    passport: {
      strategy: 'saml',
      saml: {
        path: process.env.SAML_PATH || '/saml/callback',
        entryPoint: process.env.SAML_ENTRY_POINT || 'https://demoa.onelogin.com/trust/saml2/http-post/sso/eca3d219-ed8a-4fb7-8791-db37abe9a840',
        issuer: 'https://app.onelogin.com/saml/metadata/eca3d219-ed8a-4fb7-8791-db37abe9a840',
        identifierFormat: 'urn:oasis:names:tc:SAML:1.1:nameid-format:emailAddress',
        // identifierFormat: "urn:oasis:names:tc:SAML:2.0:nameid-format:transient",
        // Service Provider settings
        callbackUrl: 'http://localhost:3000/saml/callback',
        logoutUrl: 'https://demoa.onelogin.com/trust/saml2/http-redirect/slo/2163463',
        logoutCallback: 'http://localhost:3000/post-logout',
        cert: `MIID2DCCAsCgAwIBAgIUM/OlsELLA/eZu9kEGDlu/AIcjx8wDQYJKoZIhvcNAQEF
BQAwRDEPMA0GA1UECgwGUk5NS1JTMRUwEwYDVQQLDAxPbmVMb2dpbiBJZFAxGjAY
BgNVBAMMEU9uZUxvZ2luIEFjY291bnQgMB4XDTIzMDQyMTAzMzcwOFoXDTI4MDQy
MTAzMzcwOFowRDEPMA0GA1UECgwGUk5NS1JTMRUwEwYDVQQLDAxPbmVMb2dpbiBJ
ZFAxGjAYBgNVBAMMEU9uZUxvZ2luIEFjY291bnQgMIIBIjANBgkqhkiG9w0BAQEF
AAOCAQ8AMIIBCgKCAQEA15HSasWb9P3tXzukGBR2mzE9AKH+glm96O7gYtEHmXPR
crSeVSM71ddysrsRvsNK09kHYvf+9IRKznPdM/e3RS9JoVwwXJg3T4YFGmTMiB3p
ZwUpT5cnCLkDiVzFcbGIqSldHLvWBQ+6dnxLfDmjVfSrsmGXA+QbeiW3fcu/ZCJw
rMYey4091sv3N6RqpD/W+sEsrzHEV3cpo0d595PtKpkrDrDU6c0Xzk3Fnp7Okuj7
fsKpqyp2D3uMSIjBg2OJsMN+Bbp7J6vH7VH9EBGwCUtBV4v3lltfVgd9fSSZadet
ss6Bmz9cuqA8rjck+jGOOpteOM7s1FrS3zZTk7Nh/wIDAQABo4HBMIG+MAwGA1Ud
EwEB/wQCMAAwHQYDVR0OBBYEFKXphCFWGpXFwjF9OeWjSFTPbLS9MH8GA1UdIwR4
MHaAFKXphCFWGpXFwjF9OeWjSFTPbLS9oUikRjBEMQ8wDQYDVQQKDAZSTk1LUlMx
FTATBgNVBAsMDE9uZUxvZ2luIElkUDEaMBgGA1UEAwwRT25lTG9naW4gQWNjb3Vu
dCCCFDPzpbBCywP3mbvZBBg5bvwCHI8fMA4GA1UdDwEB/wQEAwIHgDANBgkqhkiG
9w0BAQUFAAOCAQEAgGzQhSHCKDhyhzPQhP1HooBcrAo8ejKVD8jo2FTsWbxJ6+GD
qpgvaIeEVp1VES/cYD3YoMIkQlzMAIuUsIYQUfXk77OOr6+OhauqCpbrXEFom2zG
aZ0ttIVHZjbZwmO7HCOhKEfwAW1DN4ucvU7kATFy6LhOPRm0gmje+YQra3nqnU/V
C5feeTWGd8jv7oyKCHMwOzLW6GmaNt5JOxwl4qe460gZipZ8jdoCDom6WbNnI9mX
X1R1v3retnA+vMHwBnHyki6yVgW4o9XDFzWHItZ0UtwnOEnaMEzXfq93yubUjkfq
hRkwM2PFqOF7fNmlTyYu71w7Z3ByDRQqkJOyeA==`
      }
    }
  }
};
