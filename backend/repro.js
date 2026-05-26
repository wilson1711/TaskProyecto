const { pool } = require('./src/config/db');
console.log('Pool imported from db.js:', pool);

const taskController = require('./src/controllers/taskController');
// We can't easily check internal variables of taskController unless they are exported,
// but we can check if it throws when calling a function that uses pool.
// However, taskController might fail to load if it tries to use pool at top level (it doesn't).

async function test() {
    try {
        const { getStats } = taskController;
        // Mocking res and req
        const req = {};
        const res = {
            status: function(s) { this.statusCode = s; return this; },
            json: function(j) { this.body = j; return this; }
        };
        await getStats(req, res);
        console.log('getStats response:', res.body);
    } catch (e) {
        console.error('getStats threw error:', e);
    }
}

test();
