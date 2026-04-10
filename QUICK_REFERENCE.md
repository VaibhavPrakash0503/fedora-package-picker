# Quick Reference - Fedora Package Picker Deployment

## 3-Step Deployment

### Step 1: Neo4j Aura Setup (5 mins)
```
URL: https://neo4j.com/cloud/aura/
→ Sign up → Create instance → Copy credentials
```

**Save these:**
- `NEO4J_URI=bolt+s://...`
- `NEO4J_USER=neo4j`
- `NEO4J_PASSWORD=...`

### Step 2: Local Test (5 mins) - Optional
```bash
cp .env.example .env
# Edit .env with credentials above
./setup.sh
# OR: npm install && npm run seed && npm start
# Visit: http://localhost:3000
```

### Step 3: Deploy to Vercel (10 mins)
```
URL: https://vercel.com/new
1. Import your GitHub repo
2. Add environment variables (from Step 1)
3. Click Deploy
4. Wait 2-3 minutes
5. Your site: https://your-project.vercel.app ✅
```

---

## Files Created

| File | Purpose |
|------|---------|
| `server.js` | Express backend + API |
| `seed.js` | Load packages into Neo4j |
| `package.json` | Dependencies |
| `.env.example` | Credentials template |
| `vercel.json` | Deployment config |
| `DEPLOYMENT.md` | Detailed 10-step guide |
| `README.md` | Feature overview |
| `setup.sh` | One-command setup |

---

## NPM Scripts

```bash
npm start          # Start server (localhost:3000)
npm run seed       # Populate database
npm install        # Install dependencies
```

---

## Environment Variables

```
NEO4J_URI=bolt+s://your-id.databases.neo4j.io
NEO4J_USER=neo4j
NEO4J_PASSWORD=your-password
NODE_ENV=production
PORT=3000
```

---

## API Endpoints

After deployment:
```
GET  https://your-site.vercel.app/api/health
GET  https://your-site.vercel.app/api/packages
GET  https://your-site.vercel.app/api/search?q=python
GET  https://your-site.vercel.app/api/packages/git/related
POST https://your-site.vercel.app/api/collections
GET  https://your-site.vercel.app/api/collections
```

---

## Troubleshooting

**Can't connect?**
- Check `.env` has correct credentials
- Verify Neo4j instance is running

**Database empty?**
- Run `npm run seed` locally or after Vercel deployment

**Vercel failing?**
- Check deployment logs
- Verify all env vars are set
- Ensure `.env` is in `.gitignore`

See `DEPLOYMENT.md` for more help.

---

## Technology Stack

- **Frontend:** HTML/CSS/JS (unchanged)
- **Backend:** Node.js + Express
- **Database:** Neo4j Aura (Graph DB)
- **Hosting:** Vercel

---

## Costs

- Neo4j Aura: FREE (200k nodes)
- Vercel: FREE (hobby projects)
- **Total: $0**

---

## Need Help?

1. Read `DEPLOYMENT.md` (detailed step-by-step)
2. Read `README.md` (features overview)
3. Check server.js comments (API implementation)
4. See TROUBLESHOOTING in DEPLOYMENT.md

---

## Go Live!

1. Get Neo4j credentials
2. Create `.env` file
3. Deploy to Vercel
4. Share your URL!

Good luck! 🚀
