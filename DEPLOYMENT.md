# 🚀 Deployment Guide: Fedora Package Picker

## Overview
- **Frontend**: index.html (static)
- **Backend**: Node.js + Express
- **Database**: Neo4j Aura (Free Cloud Graph DB)
- **Hosting**: Vercel (Free)

---

## 📋 Prerequisites
- GitHub account
- Vercel account (free, login with GitHub)
- Neo4j Aura account (free)

---

## Step 1: Create Neo4j Aura Instance (5 mins)

### 1.1 Create Account
Go to https://neo4j.com/cloud/aura/ and sign up (free tier available)

### 1.2 Create a New Database
- Click "Create" → "Neo4j Aura"
- Choose "Free tier"
- Region: Pick closest to you
- Name it: `fedora-package-picker`
- Note down the credentials (will be shown once)

### 1.3 Get Connection Details
After creation, you'll see:
```
Connection String: bolt+s://xxxxxxxx.databases.neo4j.io
Username: neo4j
Password: (generated password)
```

**⚠️ Save these! You won't see the password again.**

---

## Step 2: Seed the Database (10 mins)

### 2.1 Create .env file locally
```bash
cp .env.example .env
```

Edit `.env` and add your Neo4j credentials:
```
NEO4J_URI=bolt+s://your-id.databases.neo4j.io
NEO4J_USER=neo4j
NEO4J_PASSWORD=your-password
```

### 2.2 Install dependencies & seed
```bash
npm install
npm run seed
```

You should see:
```
✅ Database seeded successfully!
📦 Total packages: 61
```

---

## Step 3: Test Locally (5 mins)

```bash
npm start
```

Visit: http://localhost:3000

API endpoints to test:
- Health: http://localhost:3000/api/health
- Packages: http://localhost:3000/api/packages
- Search: http://localhost:3000/api/search?q=python

---

## Step 4: Deploy to Vercel (10 mins)

### 4.1 Push to GitHub (if not already)
```bash
git add .
git commit -m "Add Neo4j backend and deployment config"
git push
```

### 4.2 Import to Vercel
1. Go to https://vercel.com/new
2. Import your GitHub repository
3. Click "Deploy"

### 4.3 Add Environment Variables in Vercel
In your Vercel project settings:

1. Go to Settings → Environment Variables
2. Add:
   - `NEO4J_URI`: Your Neo4j connection string
   - `NEO4J_USER`: neo4j
   - `NEO4J_PASSWORD`: Your password
   - `NODE_ENV`: production

3. Click "Deploy" again (or redeploy)

### 4.4 Seed Production Database
Once deployed, seed the production database:

```bash
NEO4J_URI="your-uri" NEO4J_USER="neo4j" NEO4J_PASSWORD="your-password" npm run seed
```

Or do it from local terminal with your .env file

---

## Step 5: Access Your Site

Your app is now live at:
```
https://your-project.vercel.app
```

Share this link with anyone! They can:
- Browse packages by category
- Search for packages
- Select and install multiple packages
- Save their selections

---

## 🔐 Security Checklist

- [ ] `.env` file is in `.gitignore` (don't commit secrets!)
- [ ] Neo4j password is stored in Vercel env vars only
- [ ] Use `bolt+s://` (secure connection)
- [ ] Neo4j Aura has IP whitelist (allow 0.0.0.0 for now)

---

## 📊 API Endpoints

### GET `/api/health`
Health check
```bash
curl https://your-site.vercel.app/api/health
```

### GET `/api/packages`
Get all categories and packages
```bash
curl https://your-site.vercel.app/api/packages
```

### GET `/api/search?q=<query>`
Search packages
```bash
curl "https://your-site.vercel.app/api/search?q=python"
```

### GET `/api/packages/:name/related`
Get related/dependent packages
```bash
curl https://your-site.vercel.app/api/packages/git/related
```

### POST `/api/collections`
Save a collection of packages
```bash
curl -X POST https://your-site.vercel.app/api/collections \
  -H "Content-Type: application/json" \
  -d '{"name":"My Dev Setup","packages":["git","python3","nodejs"]}'
```

### GET `/api/collections`
Get all saved collections
```bash
curl https://your-site.vercel.app/api/collections
```

---

## 🐛 Troubleshooting

### "Connection refused" error
- Check Neo4j URI is correct
- Make sure Neo4j instance is running
- Verify credentials in `.env`

### Database is empty
- Run `npm run seed` to populate
- Check for errors in output

### Vercel deployment fails
- Check logs: Vercel Dashboard → Deployments → View logs
- Make sure all env vars are set
- Ensure `.env` is in `.gitignore`

### Slow responses
- Free tier Neo4j may be slower
- Consider upgrading to paid plan for better performance

---

## 📈 Future Improvements

1. **Add authentication** - Secure collections per user
2. **Add more relationships** - Mark package conflicts, dependencies
3. **Web UI for graph** - Visualize package relationships with D3.js
4. **Analytics** - Track popular packages
5. **Import/Export** - DNF commands, Docker, etc.

---

## 🎯 Common Tasks

### Change Database Credentials
1. Create new Neo4j instance
2. Update env vars in Vercel + local `.env`
3. Run `npm run seed` again

### Add More Packages
Edit `seed.js` → add to `packageCategories` array → run `npm run seed`

### Share Specific Setup
Use the API to create a collection:
```
POST /api/collections
{"name":"Gaming Setup","packages":["gcc","python3","nodejs"]}
```

---

## ✅ Verification Checklist

- [ ] Neo4j Aura instance created and running
- [ ] Local `.env` file configured
- [ ] `npm run seed` completed successfully
- [ ] Local tests pass (`npm start` works)
- [ ] Code pushed to GitHub
- [ ] Vercel project created and deployed
- [ ] Environment variables set in Vercel
- [ ] Production database seeded
- [ ] Site accessible at vercel.app URL
- [ ] API endpoints responding

---

You're all set! 🎉 Share the Vercel URL with others and they can use your package picker!
