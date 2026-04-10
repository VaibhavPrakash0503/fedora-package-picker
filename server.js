require('dotenv').config();
const express = require('express');
const neo4j = require('neo4j-driver');
const cors = require('cors');
const path = require('path');

const app = express();
app.use(cors());
app.use(express.json());
app.use(express.static('.'));

// Neo4j driver initialization
const driver = neo4j.driver(
  process.env.NEO4J_URI || 'bolt://localhost:7687',
  neo4j.auth.basic(
    process.env.NEO4J_USER || 'neo4j',
    process.env.NEO4J_PASSWORD || 'password'
  )
);

// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', db: 'neo4j' });
});

// Get all categories with packages
app.get('/api/packages', async (req, res) => {
  const session = driver.session();
  try {
    const result = await session.run(`
      MATCH (c:Category)
      OPTIONAL MATCH (c)<-[:BELONGS_TO]-(p:Package)
      RETURN c {.*} as category, collect(p {.*}) as packages
      ORDER BY c.order
    `);

    const categories = result.records.map(record => ({
      ...record.get('category'),
      packages: record.get('packages').filter(p => p !== null)
    }));

    res.json(categories);
  } catch (error) {
    console.error('DB Error:', error);
    res.status(500).json({ error: error.message });
  } finally {
    await session.close();
  }
});

// Search packages
app.get('/api/search', async (req, res) => {
  const q = String(req.query.q || '').trim();
  const session = driver.session();
  try {
    if (!q) {
      return res.json([]);
    }

    const escaped = q.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    const regex = `(?i).*${escaped}.*`;
    const result = await session.run(`
      MATCH (p:Package)
      WHERE p.displayName =~ $regex
         OR p.description =~ $regex
      MATCH (p)-[:BELONGS_TO]->(c:Category)
      RETURN p {.*} as package, c {.*} as category
      LIMIT 50
    `, { regex });

    const packages = result.records.map(record => ({
      ...record.get('package'),
      category: record.get('category')
    }));

    res.json(packages);
  } catch (error) {
    res.status(500).json({ error: error.message });
  } finally {
    await session.close();
  }
});

// Get package dependencies/related packages
app.get('/api/packages/:name/related', async (req, res) => {
  const { name } = req.params;
  const session = driver.session();
  try {
    const result = await session.run(`
      MATCH (p:Package {name: $name})-[:PAIRS_WITH|DEPENDS_ON]->(related:Package)
      RETURN related {.*} as package
    `, { name });

    const packages = result.records.map(r => r.get('package'));
    res.json(packages);
  } catch (error) {
    res.status(500).json({ error: error.message });
  } finally {
    await session.close();
  }
});

// Add selected packages to a collection (saved list)
app.post('/api/collections', async (req, res) => {
  const { name, packages } = req.body;
  const session = driver.session();
  try {
    await session.run(`
      CREATE (col:Collection {id: randomUUID(), name: $name, createdAt: datetime()})
      WITH col
      UNWIND $packages as pkgName
      MATCH (p:Package {name: pkgName})
      CREATE (col)-[:CONTAINS]->(p)
    `, { name, packages });

    res.json({ success: true });
  } catch (error) {
    res.status(500).json({ error: error.message });
  } finally {
    await session.close();
  }
});

// Get all collections
app.get('/api/collections', async (req, res) => {
  const session = driver.session();
  try {
    const result = await session.run(`
      MATCH (col:Collection)-[:CONTAINS]->(p:Package)
      RETURN col {.*} as collection, collect(p.name) as packages
    `);

    const collections = result.records.map(record => ({
      ...record.get('collection'),
      packages: record.get('packages')
    }));

    res.json(collections);
  } catch (error) {
    res.status(500).json({ error: error.message });
  } finally {
    await session.close();
  }
});

// Serve index.html for root path
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'index.html'));
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
  console.log(`📊 Neo4j: ${process.env.NEO4J_URI || 'localhost:7687'}`);
});

// Graceful shutdown
process.on('SIGINT', async () => {
  await driver.close();
  process.exit(0);
});
