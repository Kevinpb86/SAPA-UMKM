const { pool } = require('./config/database');
const fs = require('fs');
const path = require('path');

async function applySchema() {
    let connection;
    try {
        const schemaPath = path.join(__dirname, 'database', 'schema.sql');
        const schemaSql = fs.readFileSync(schemaPath, 'utf8');

        console.log('Connecting to database...');
        connection = await pool.getConnection();
        console.log('Connected.');

        // Strip out single-line comments and multi-line comments
        const cleanSql = schemaSql
            .replace(/--.*$/gm, '') // Remove -- comments
            .replace(/\/\*[\s\S]*?\*\//g, ''); // Remove /* */ comments

        const statements = cleanSql
            .split(';')
            .map(s => s.trim())
            .filter(s => s.length > 0);

        for (const statement of statements) {
            const cleanStatement = statement.replace(/\r?\n|\r/g, " ");
            if (cleanStatement.toLowerCase().startsWith('use')) continue;
            console.log(`Executing: ${cleanStatement.substring(0, 50)}...`);
            await connection.query(cleanStatement);
        }

        console.log('✅ Schema applied successfully!');
    } catch (error) {
        console.error('❌ Error applying schema:', error);
    } finally {
        if (connection) connection.release();
        process.exit();
    }
}

applySchema();
