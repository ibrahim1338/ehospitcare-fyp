# Backend
FOR LOCAL
A. On axios.js file in front-end/src/services/axios.js
i. Change or confirm the baseURL
(example ==> baseURL: 'http://localhost:3000')

B. On db.js file in backend/config/db.js
i. Change OR confirm the mongoDB connection
(example ==> return await mongoose.connect('mongodb://localhost:27017/hospital'))

C. Create a .env file in the backend folder
i. Inside the .env file create a JWT_SECRET
(example ==> JWT_SECRET = this_is_secret)

...To create first Admin, make sure to follow these steps:
On terminal:
i. cd backend
ii. node
iii. const func = require('./startup')
iv. func("Ibrahim","ibrahim@gmail.com","admin","Admin","Narowal Pakistan","03123456789","password")

On terminal:
i. cd client
ii. npm run dev

On another terminal:
i. cd backend
ii. npm run dev


