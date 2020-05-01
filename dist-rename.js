const fs = require('fs');

// fancy-rollup can't deal with filesnames that only differ by extension so we need to rename afterwards
for (const filename of fs.readdirSync('dist/')) {
    if (filename.includes('.m.js')) {
        fs.rename(`dist/${filename}`, `dist/${filename.replace('.m.js', '.mjs')}`, err => {
            if (err) throw err;
        });
    }
}
