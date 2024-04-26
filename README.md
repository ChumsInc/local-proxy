# Local Proxy for CHUMS development

---

## Required Configuration for API endpoint development

### Required Environment Variables
- INTRANET_API_CLIENT - username for connection to Chums Intranet API
- INTRANET_API_SECRET - password/secret for connection to Chums Intranet API

### BitVise SSH client
- Set C2S to listen on port localhost:3306 and redirect to localhost:3306 on the server side.

---

## Commands
### The following by default listen on port 8081 so that port 8080 is available for webpack dev server
``npm run start`` For app development, creates proxy for all intranet & API endpoints

``npm run start-b2b`` For Chums b2b development

### The following by default listen on port 8080 for API endpoint development
``npm run api-operations`` For developing /api/operations endpoints

``npm run api-partners`` For developing /api/partners endpoints

``npm run api-sales`` For developing /api/sales endpoints

``npm run api-shopify`` For developing /api/shopify endpoints

``npm run api-user`` For developing /api/user endpoints


