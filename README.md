# Local Proxy for CHUMS development

## Commands
### The following by default listen on port 8081 so that port 8080 is available for webpack dev server
``npm run start`` For app development, creates proxy for all intranet & API endpoints

``npm run start-b2b`` For Chums b2b development

### The following by default listen on port 8080 for API endpoint development
``npm run start-api-operations`` For developing /api/operations endpoints

``npm run start-api-partners`` For developing /api/partners endpoints

``npm run start-api-sales`` For developing /api/sales endpoints

``npm run start-api-shopify`` For developing /api/shopify endpoints

``npm run start-api-user`` For developing /api/user endpoints


## Required Configuration for API endpoint development
### BitVise SSH client
  - Set C2S to listen on port localhost:3306 and redirect to localhost:3306 on the server side. 
