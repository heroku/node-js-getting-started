const authRoutes = require('../auth/authRoutes');
const userRoutes = require('../notepad/src/components/users/userRoutes.js');
const notesRoutes = require('../notepad/src/components/notes/notesRoutes.js');

module.exports = function (server) {
    // sanity check route
    server.get('/', function (req, res) {
        res.json({ api: 'up and running' });
    });

    server.use('/users', userRoutes);
    server.use('/users', authRoutes);
    server.use('/users/notes', notesRoutes);
};
