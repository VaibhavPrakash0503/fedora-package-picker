# Fedora Package Picker 📦

A web app to pick Fedora packages and generate install commands. Now with a **Neo4j Graph Database** backend and **cloud hosting**!

## Features ✨

- 📦 Browse 60+ Fedora packages organized by category
- 🔍 Search packages instantly
- ✅ Select multiple packages
- 📋 Generate install commands (dnf)
- 🌐 **Cloud-hosted** (anyone can access)
- 📊 **Graph database** (Neo4j) - see package relationships
- 💾 Save your package collections

## Quick Start 🚀

### 1. Get Neo4j Aura (Free)
```bash
# Visit https://neo4j.com/cloud/aura/
# Create a free instance
# Copy credentials to .env
```

### 2. Setup Locally
```bash
cp .env.example .env
# Edit .env with your Neo4j credentials

chmod +x setup.sh
./setup.sh
```

### 3. Run Locally
```bash
npm start
# Visit http://localhost:3000
```

### 4. Deploy to Vercel (Free)
```bash
git add .
git commit -m "Ready to deploy"
git push

# Go to vercel.com/new → import your repo → deploy
# Add NEO4J_URI, NEO4J_USER, NEO4J_PASSWORD as env vars
```

## Detailed Setup

See [DEPLOYMENT.md](DEPLOYMENT.md) for complete step-by-step guide.

## Architecture 🏗️

```
┌─────────────────────────────────────────┐
│         Vercel Hosting (Free)           │
│  ┌───────────────┐    ┌──────────────┐  │
│  │  index.html   │    │ server.js    │  │
│  │  (Frontend)   │───▶│ (Node.js)    │  │
│  └───────────────┘    └──────────────┘  │
└────────────────┬───────────────────────┘
                 │
                 │ REST API
                 │
         ┌───────▼──────────┐
         │   Neo4j Aura     │
         │  (Graph DB)      │
         │                  │
         │ Categories       │
         │ ├─ Packages      │
         │ └─ Relationships │
         └──────────────────┘
```

## API Endpoints 📡

| Endpoint | Method | Purpose |
|----------|--------|---------|
| `/api/health` | GET | Health check |
| `/api/packages` | GET | All categories & packages |
| `/api/search?q=...` | GET | Search packages |
| `/api/packages/:name/related` | GET | Related packages |
| `/api/collections` | GET | Saved collections |
| `/api/collections` | POST | Create collection |

## Database Schema 🗄️

```
Neo4j Graph Model:

(Category) ◀─[BELONGS_TO]─ (Package)
    │                          │
    │                          └──[PAIRS_WITH]──┐
    │                                           │
    └──────────────────────────────────────── (Package)
```

## Technologies 🛠️

- **Frontend**: Vanilla HTML/CSS/JS
- **Backend**: Node.js + Express
- **Database**: Neo4j Aura (Free graph DB)
- **Hosting**: Vercel (Free)
- **Deployment**: GitHub → Vercel (auto-deploy)

## Files 📁

```
├── index.html          # Frontend UI
├── server.js           # Express backend
├── seed.js             # Database seeder
├── package.json        # Dependencies
├── .env.example        # Environment template
├── vercel.json         # Vercel config
├── DEPLOYMENT.md       # Full setup guide
└── setup.sh            # Quick setup script
```

## Environment Variables 🔐

```
NEO4J_URI=bolt+s://xxxx.databases.neo4j.io
NEO4J_USER=neo4j
NEO4J_PASSWORD=xxxxx
NODE_ENV=production
```

## Share Your Link 🔗

Once deployed to Vercel, you get a URL like:
```
https://your-project.vercel.app
```

Share this with anyone! They can:
- Browse all packages
- Search
- Create selections
- See install commands

## Development 💻

### Local Commands
```bash
npm start          # Run server
npm run seed       # Populate database
npm test           # Run tests (if any)
```

### Add More Packages
Edit `seed.js` → `packageCategories` array → Run `npm run seed`

### Modify API
Edit `server.js` → Restart with `npm start`

## Free Tier Limits ⚠️

- **Neo4j Aura**: 200k node limit, 600k relationships (plenty!)
- **Vercel**: 100GB bandwidth/month, unlimited deployments
- **Both**: Free forever for hobby projects

## Upgrade Later 📈

Need more?
- **Neo4j**: $20/month for production instance
- **Vercel**: Pay-as-you-go for higher limits

## Troubleshooting 🐛

See [DEPLOYMENT.md](DEPLOYMENT.md) for detailed troubleshooting.

**Quick fixes:**
- Can't connect to Neo4j? Check `.env` and credentials
- Database empty? Run `npm run seed`
- Vercel failing? Check logs and env vars

## Contributing 🤝

Want to add features? Edit:
1. `index.html` - UI changes
2. `server.js` - API changes
3. `seed.js` - Data changes

Then push to GitHub → Vercel auto-deploys!

## License 📜

ISC

---

**Ready to deploy?** → See [DEPLOYMENT.md](DEPLOYMENT.md) 🚀
