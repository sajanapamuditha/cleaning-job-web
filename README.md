
# TaskMatch — Service Request Board

Built for the GlobalTNA Full-Stack Developer Intern assessment.

## Tech Stack
- **Frontend**: Next.js 14 (App Router) + Tailwind CSS
- **Backend**: Node.js + Express (separate app)
- **Database**: MongoDB (Mongoose ODM)

Project Structure
```
taskmatch/
├── server/   ← Express REST API + MongoDB
└── client/   ← Next.js App Router frontend
```



1. Setup MongoDB

**Option A — MongoDB Atlas (free cloud)**
1. Go to https://www.mongodb.com/atlas and create a free cluster
2. Copy your connection string (looks like `mongodb+srv://user:pass@cluster.mongodb.net/taskmatch`)

**Option B — Local MongoDB**
1. Install MongoDB Community: https://www.mongodb.com/try/download/community
2. Start it: `mongod`
3. Connection string: `mongodb://localhost:27017/taskmatch`



2. Run the Backend (Express)

```bash
cd server
npm install
```

Edit `.env` with your MongoDB URI:
```
PORT=5000
MONGODB_URI=mongodb://localhost:27017/taskmatch
CLIENT_URL=http://localhost:3000
```

Then start:
```bash
npm run dev      # development (nodemon)
npm start        # production
```

API runs at: **http://localhost:5000**

### REST Endpoints
| Method | Route | Description |
|--------|-------|-------------|
| GET | /api/jobs | List all jobs (supports ?category=&status=) |
| GET | /api/jobs/:id | Get single job |
| POST | /api/jobs | Create new job |
| PATCH | /api/jobs/:id | Update status only |
| DELETE | /api/jobs/:id | Delete job |

---

## 3. Run the Frontend (Next.js)

```bash
cd client
npm install
```

Edit `.env.local`:
```
NEXT_PUBLIC_API_URL=http://localhost:5000
```

Then start:
```bash
npm run dev
```

Frontend runs at: **http://localhost:3000**

---

## 4. Screens
1. **Home** (`/`) — Job cards grid with category & status filter dropdowns
2. **New Job** (`/jobs/new`) — Form with client-side + server-side validation
3. **Job Detail** (`/jobs/[id]`) — Full details, status dropdown, delete button
=======
# cleaning-job-web
>>>>>>> f7ba4e333d37c9a28cfbeb6bf68fd9f2c12a44d1
