require('dotenv').config();
const neo4j = require('neo4j-driver');

const driver = neo4j.driver(
  process.env.NEO4J_URI || 'bolt://localhost:7687',
  neo4j.auth.basic(
    process.env.NEO4J_USER || 'neo4j',
    process.env.NEO4J_PASSWORD || 'password'
  )
);

// Your package data
const packageCategories = [
  {
    id: "terminal",
    label: "Terminal Tools",
    description: "Essential command-line utilities and shell enhancements",
    order: 1,
    packages: [
      { name: "htop", displayName: "htop", description: "Interactive process viewer" },
      { name: "tmux", displayName: "tmux", description: "Terminal multiplexer" },
      { name: "zsh", displayName: "Zsh", description: "Z shell with advanced features" },
      { name: "fish", displayName: "Fish", description: "Friendly interactive shell" },
      { name: "neofetch", displayName: "Neofetch", description: "System info script" },
      { name: "bat", displayName: "bat", description: "Cat clone with syntax highlighting" },
      { name: "exa", displayName: "exa", description: "Modern replacement for ls" },
      { name: "ripgrep", displayName: "ripgrep", description: "Fast recursive search tool" },
      { name: "fd-find", displayName: "fd", description: "Simple and fast file finder" },
      { name: "fzf", displayName: "fzf", description: "Fuzzy finder for the terminal" },
      { name: "jq", displayName: "jq", description: "JSON processor for the command line" },
      { name: "wget", displayName: "wget", description: "Network file downloader" },
      { name: "curl", displayName: "curl", description: "Transfer data with URLs" },
      { name: "git", displayName: "Git", description: "Version control system" },
      { name: "tree", displayName: "tree", description: "Directory listing in tree format" },
      { name: "ncdu", displayName: "ncdu", description: "Disk usage analyzer with ncurses" },
      { name: "ranger", displayName: "Ranger", description: "Console file manager with VI bindings" },
      { name: "tldr", displayName: "tldr", description: "Simplified man pages" },
      { name: "screen", displayName: "Screen", description: "Terminal session manager" },
    ],
  },
  {
    id: "desktop",
    label: "Desktop Apps",
    description: "Graphical applications for everyday use",
    order: 2,
    packages: [
      { name: "firefox", displayName: "Firefox", description: "Web browser by Mozilla" },
      { name: "thunderbird", displayName: "Thunderbird", description: "Email client by Mozilla" },
      { name: "vlc", displayName: "VLC", description: "Multimedia player" },
      { name: "gimp", displayName: "GIMP", description: "Image editor" },
      { name: "inkscape", displayName: "Inkscape", description: "Vector graphics editor" },
      { name: "libreoffice", displayName: "LibreOffice", description: "Office suite" },
      { name: "blender", displayName: "Blender", description: "3D creation suite" },
      { name: "obs-studio", displayName: "OBS Studio", description: "Streaming and recording" },
      { name: "kdenlive", displayName: "Kdenlive", description: "Video editor" },
      { name: "audacity", displayName: "Audacity", description: "Audio editor" },
      { name: "transmission", displayName: "Transmission", description: "BitTorrent client" },
      { name: "filezilla", displayName: "FileZilla", description: "FTP client" },
      { name: "keepassxc", displayName: "KeePassXC", description: "Password manager" },
      { name: "flameshot", displayName: "Flameshot", description: "Screenshot tool" },
      { name: "qbittorrent", displayName: "qBittorrent", description: "BitTorrent client" },
    ],
  },
  {
    id: "coding",
    label: "Coding Tools",
    description: "Development environments, compilers, and programming utilities",
    order: 3,
    packages: [
      { name: "git", displayName: "Git", description: "Version control system" },
      { name: "vim-enhanced", displayName: "Vim", description: "Improved Vi text editor" },
      { name: "neovim", displayName: "Neovim", description: "Hyperextensible Vim fork" },
      { name: "emacs", displayName: "Emacs", description: "Extensible text editor" },
      { name: "gcc", displayName: "GCC", description: "GNU C/C++ compiler" },
      { name: "clang", displayName: "Clang", description: "C/C++/ObjC compiler" },
      { name: "python3", displayName: "Python 3", description: "Python interpreter" },
      { name: "python3-pip", displayName: "pip", description: "Python package manager" },
      { name: "bat", displayName: "bat", description: "Cat clone with syntax highlighting" },
      { name: "wget", displayName: "wget", description: "Network file downloader" },
      { name: "curl", displayName: "curl", description: "Transfer data with URLs" },
      { name: "nodejs", displayName: "Node.js", description: "JavaScript runtime" },
      { name: "npm", displayName: "npm", description: "Node package manager" },
      { name: "rust", displayName: "Rust", description: "Rust toolchain via rustup" },
      { name: "cargo", displayName: "Cargo", description: "Rust package manager" },
      { name: "golang", displayName: "Go", description: "Go programming language" },
      { name: "java-latest-openjdk", displayName: "Java (OpenJDK)", description: "Java development kit" },
      { name: "docker", displayName: "Docker", description: "Container runtime" },
      { name: "podman", displayName: "Podman", description: "Rootless container engine" },
      { name: "cmake", displayName: "CMake", description: "Cross-platform build system" },
      { name: "make", displayName: "Make", description: "GNU build automation" },
      { name: "gdb", displayName: "GDB", description: "GNU debugger" },
      { name: "strace", displayName: "strace", description: "System call tracer" },
      { name: "valgrind", displayName: "Valgrind", description: "Memory debugging tool" },
    ],
  },
];

async function seedDatabase() {
  const session = driver.session();

  try {
    console.log('🗑️  Clearing existing data...');
    await session.run('MATCH (n) DETACH DELETE n');

    for (const category of packageCategories) {
      console.log(`📂 Creating category: ${category.label}`);

      // Create category
      await session.run(
        `MERGE (c:Category {id: $id})
         SET c.label = $label,
             c.description = $description,
             c.order = $order`,
        {
          id: category.id,
          label: category.label,
          description: category.description,
          order: category.order,
        }
      );

      // Create packages and link to category
      for (const pkg of category.packages) {
        await session.run(
          `MATCH (c:Category {id: $catId})
           MERGE (p:Package {name: $name})
           ON CREATE SET p.displayName = $displayName, p.description = $description
           ON MATCH SET p.displayName = $displayName, p.description = $description
           MERGE (p)-[:BELONGS_TO]->(c)`,
          {
            catId: category.id,
            name: pkg.name,
            displayName: pkg.displayName,
            description: pkg.description,
          }
        );
      }
    }

    // Create package relationships (pairs + common CLI/tooling links)
    console.log('🔗 Creating package relationships...');
    const pairings = [
      { from: 'git', to: 'vim-enhanced' },
      { from: 'git', to: 'neovim' },
      { from: 'nodejs', to: 'npm' },
      { from: 'python3', to: 'python3-pip' },
      { from: 'gcc', to: 'gdb' },
      { from: 'rust', to: 'cargo' },
      { from: 'golang', to: 'git' },
      { from: 'docker', to: 'git' },
    ];

    const commonLinks = [
      { from: 'bat', to: 'git', reason: 'command-line-workflow' },
      { from: 'curl', to: 'git', reason: 'network-and-cli-tooling' },
      { from: 'wget', to: 'git', reason: 'download-and-cli-tooling' },
      { from: 'bat', to: 'curl', reason: 'terminal-utilities' },
      { from: 'bat', to: 'wget', reason: 'terminal-utilities' },
      { from: 'curl', to: 'wget', reason: 'network-tools' },
      { from: 'git', to: 'tmux', reason: 'terminal-development' },
    ];

    for (const pair of pairings) {
      await session.run(
        `MATCH (p1:Package {name: $from}), (p2:Package {name: $to})
         MERGE (p1)-[:PAIRS_WITH]->(p2)`,
        { from: pair.from, to: pair.to }
      );
    }

    for (const link of commonLinks) {
      await session.run(
        `MATCH (p1:Package {name: $from}), (p2:Package {name: $to})
         MERGE (p1)-[r:COMMON_USE]->(p2)
         SET r.reason = $reason`,
        link
      );
    }

    const summary = await session.run(`
      MATCH (p:Package)
      WITH count(DISTINCT p) AS packageCount
      MATCH ()-[r]->()
      RETURN packageCount, count(r) AS relationshipCount
    `);
    const row = summary.records[0];
    console.log('✅ Database seeded successfully!');
    console.log(`📦 Total unique packages: ${row.get('packageCount').toNumber()}`);
    console.log(`🔗 Total relationships: ${row.get('relationshipCount').toNumber()}`);
  } catch (error) {
    console.error('❌ Error seeding database:', error);
  } finally {
    await session.close();
    await driver.close();
  }
}

seedDatabase();
