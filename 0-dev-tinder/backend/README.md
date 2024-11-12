# 1. Requirement Analysis

1. Users should be able to create account. 
   - Login management (Auth) 
   - Update profile
   - Verification (Additional)
2. Feed page - Explore
   - Display's feed with 4-5 button : swipe left or right 
3. Sending Connection Request
4. Matches
5. Update profile

# 2. High Level Design

1. Front end
2. Back end
3. Database


# 3. Low Level Design

## 3.1 DB Design 

**Using MongoDB**
- User Collection
  - first name, last name, email, age, gender
- Connections Collection
  - from_user_id, to_user_id, connection_id, status (PENDING/ACCEPTED/REJECTED) (Ignored) (Blocked)

## API Design { REST API }

POST /signup
POST /login
GET /profile
POST /profile
PATCH /profile
DELETE /profile
POST /send_connection_request 
            / \
      ignore   interested
POST /reviewRequest
            / \
         accept reject
GET /requests
GET /connections