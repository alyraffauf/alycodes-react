#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

const BLOG_DIR = path.join(__dirname, '..', 'public', 'blog');
const INDEX_FILE = path.join(BLOG_DIR, 'index.json');

function generateBlogIndex() {
  try {
    // Read all files in the blog directory
    const files = fs.readdirSync(BLOG_DIR);

    // Filter for markdown files only
    const markdownFiles = files.filter(file =>
      file.endsWith('.md') && file !== 'README.md'
    );

    // Generate index entries
    const indexEntries = markdownFiles.map(filename => {
      const filePath = path.join(BLOG_DIR, filename);
      const stats = fs.statSync(filePath);

      return {
        filename: filename,
        lastModified: stats.mtime.toISOString()
      };
    });

    // Sort by last modified date (newest first)
    indexEntries.sort((a, b) =>
      new Date(b.lastModified) - new Date(a.lastModified)
    );

    // Write the index file
    fs.writeFileSync(INDEX_FILE, JSON.stringify(indexEntries, null, 2));

    console.log(`✅ Generated blog index with ${indexEntries.length} posts:`);
    indexEntries.forEach(entry => {
      console.log(`   - ${entry.filename}`);
    });

  } catch (error) {
    console.error('❌ Error generating blog index:', error.message);
    process.exit(1);
  }
}

// Run the script
generateBlogIndex();
