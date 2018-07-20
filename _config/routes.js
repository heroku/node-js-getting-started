const userRoutes = require('../users/userRoutes');
const authRoutes = require('../auth/authRoutes');
// const budgetRouter = require('./budgetapp/src/components/budget/budgetRouter.js');
// const categoryRouter = require('./budgetapp/src/components/category/categoryRouter.js');
// const expenseRouter = require('./budgetapp/src/components/expense/expenseRouter.js');

module.exports = function (server) {
    // sanity check route
    server.get('/', function (req, res) {
        res.json({ api: 'up and running' });
    });

    server.use('/users', userRoutes);
    server.use('/users', authRoutes);
    server.use('/users/notes', notesRoutes);

    // server.use('/users/${user.id}/notes/new', noteRoutes);
    // server.use('users/${user.id}/notes/', noteRoutes);
    // server.use('/users/${user.id}/notes', noteRoutes);
};
