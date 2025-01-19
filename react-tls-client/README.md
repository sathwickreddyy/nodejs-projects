# Setting Up a Trusted SSL Certificate for Localhost on macOS

Since you cannot use a public Certificate Authority (CA) like Let's Encrypt for localhost (as it is not a valid domain), the best approach is to generate a locally trusted certificate using a tool like `mkcert` or `OpenSSL`. Below are step-by-step instructions for generating and using a trusted SSL certificate for localhost on macOS.

## Option 1: Using mkcert (Recommended)

### Step 1: Install mkcert

Install `mkcert` via Homebrew:

```
brew install mkcert
```


Install the `nss` tool if you use Firefox:

```
brew install nss
```


### Step 2: Set Up a Local Certificate Authority

Run the following command to create and install a local CA:

```
mkcert -install
```

This creates a root certificate authority (CA) and installs it into your macOS system's trust store.

### Step 3: Generate Certificates for localhost

Navigate to your project directory or any folder where you want to store the certificates.

Run the following command to generate certificates for localhost:

```
mkcert localhost 127.0.0.1 ::1
```


This will create two files:
- `localhost.pem` (the certificate)
- `localhost-key.pem` (the private key)

### Step 4: Configure Spring Boot to Use the Certificates

Convert the `.pem` files into a `.p12` keystore format that Spring Boot can use:

```
openssl pkcs12 -export -out localhost.p12 -inkey localhost-key.pem -in localhost.pem -name "localhost" -password pass:password
```

Move the `localhost.p12` file to your Spring Boot project’s `src/main/resources/` directory.

Update your `application.properties` file to configure HTTPS:

```
server.port=8443
server.ssl.enabled=true
server.ssl.key-store=classpath:localhost.p12
server.ssl.key-store-password=password
server.ssl.key-store-type=PKCS12
```


### Step 5: Test HTTPS Locally

Start your Spring Boot application:

```
./gradlew bootRun
```


Open your browser and navigate to `https://localhost:8443`. You should see no certificate warnings because the certificate is trusted by your macOS system.

