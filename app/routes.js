 // app/routes.js

// grab the notes model
var headlines = require('./models/headlines');

    module.exports = function(app) {

        // Server routes.  Handles api calls, authentication etc

        // get all api call
        app.get('/api/headlines', function(req, res) {
            // use mongoose to get all notes in the database
            headlines.find(function(err, headlines) {
                // if there is an error retrieving, send the error. 
                // nothing after res.send(err) will execute
                if (err)
                    res.send(err);
                res.json({ all : headlines }); // return all notes in JSON format
            });
        });

        // get single note api call
        app.get('/api/notes/single/:_id', function(req, res) {
            // use mongoose to get all nerds in the database
            UserNotes.findOne({
                _id: req.params._id
                }, function(err, note) {
                    if (err)
                        res.send(err);
                    res.json({ userNote : note }); // return all favorites in JSON format
            });
        });

        // route to handle creating (app.post)
        app.post('/api/captureHeadlines', function(req, res) { 

            var newHeadlines = req.body.headlines;

            console.log(newHeadlines);

            headlines.collection.insert(newHeadlines, onInsert);

            function onInsert(err, data) {
                if (err) {
                    // console.log('error');
                } else {
                    console.info('%d headlines were successfully stored.', docs.length);
                    // console.log('win');
                    res.json({ headlines: data });
                }
            }

        });
        
        // route to handle delete goes here based on object _id (app.delete)
        app.delete('/api/removeHeadline/:_id', function(req, res) { 
            
        headlines.remove({
            _id: req.params._id,
            }, function(err, note) {
                if (err)
                    res.send(err);
                res.json({ message: 'Successfully removed headline'});
            });
        });

        // Frontend routes 

        // route to handle root request
        app.get('/', function(req, res) {
            res.render('index'); // load our public/index.ejs file
        });

        // route to handle root request
        app.get('/note/:noteId', function(req, res) {
            // load our public/note.ejs file and pass the note id
            res.render('note', { noteId: req.params.noteId }); 
        });

        // catch 404 and forward to error handler
        app.get('*', function(req, res) {
          res.render('error', { title: 'Express' }); // load our public/error.ejs file
        });

    };
