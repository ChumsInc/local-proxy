# Local Proxy for CHUMS development

---

## Required Configuration for API endpoint development

### Required Environment Variables
The following variables must be set up the local environment, preferably in the .env file for proper operation
- __INTRANET_API_CLIENT__ - username for connection to Chums Intranet API
- __INTRANET_API_SECRET__ - password/secret for connection to Chums Intranet API

### MySQL Port Forwarding
#### BitVise SSH client
- Set C2S to listen on port localhost:3306 and redirect to localhost:3306 on the server side.

---

## Commands
### General Development
The following by default listen on port 8081 so that port 8080 is available for webpack dev server.

``npm run intranet`` For app development, creates proxies for most intranet & API endpoints

``npm run b2b`` For Chums b2b development, creates proxies for endpoints required for Chums B2B

### API endpoint development
- The API will use the port defined in .env files, but will default to 8080 
- They will also set up listeners on port 80 for endpoints listed below
- Feel free to add endpoints that are used in the API if needed for ease of development  

``npm run api-operations`` For developing /api/operations endpoints 
- /api/user -> https://intranet.chums.com/api/user
- /api/shopify -> https://intranet.chums.com/api/shopify
- /node-sage -> https://intranet.chums.com/node-sage
- /sage -> https://intranet.chums.com/sage
- /api/search -> https://intranet.chums.com/api/search

``npm run api-partners`` For developing /api/partners endpoints
- /api/user -> https://intranet.chums.com/api/user
- /api/operations -> https://intranet.chums.com/api/operations
- /node-sage -> https://intranet.chums.com/node-sage
- /sage -> https://intranet.chums.com/sage

``npm run api-sales`` For developing /api/sales endpoints
- /api/images -> https://intranet.chums.com/api/images
- /api/user -> https://intranet.chums.com/api/user

``npm run api-shopify`` For developing /api/shopify endpoints
- /api/user -> https://intranet.chums.com/api/user

``npm run b2b-server`` For developing B2B server
- /keywords -> https://b2b.chums.com/keywords
- /preload -> https://b2b.chums.com/preload
- /images -> https://b2b.chums.com/images
- /version -> localhost:8080/package.json

``npm run api-user`` For developing /api/user endpoints
- _Generally this API does not rely on other endpoints._


