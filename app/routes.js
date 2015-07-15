 // app/routes.js

// grab the notes model
var headlines = require('./models/headlines');

// include GraphicsMagick and Filesystem
var fs = require('fs-extra')
var gm = require('gm');
var gs = require('gs');
var ffmpeg = require('fluent-ffmpeg');
var command = ffmpeg();


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
                                console.info('%d headlines were successfully stored.', data.length);
                                // console.log('win');
                                res.json({ headlines: data });
                            }
                        }

                    });
                    
                    // route to handle delete goes here based on object _id (app.delete)
                    app.delete('/api/removeHeadline/:_id', function(req, res) {

                        // delete old image file
                        var filePath = "public/images/create/"+req.params._id+".png" ; 
                        fs.unlinkSync(filePath);

                        // delete headline from DB
                        headlines.remove({
                          _id: req.params._id,
                            }, function(err, note) {
                              if (err)
                                  res.send(err);
                              res.json({ message: 'Successfully removed headline'});
                        });
                    });


                    // route to delete all headlines
                    app.delete('/api/resetHeadlines/all', function(req, res) {

                        // delete old headline images
                        fs.emptyDir('public/images/create', function (err) {
                          if (!err) console.log('success!')
                        })

                        // Empty Collection in Mongo
                        headlines.remove({
                            }, function(err, note) {
                              if (err)
                                  res.send(err);
                              res.json({ message: 'Successfully emptied collection'});
                        });
                    });

        // GraphicsMagik Routes
            
                    // Test Get Image Size
                    app.get('/gm/size', function(req, res) {
                        // output all available image properties
                        var img = ('/nats.jpg');
                        gm('public/images' + img)
                        .size(function (err, size) {
                            if(err){
                                console.log(err);
                            }
                          if (!err)
                            console.log(size);
                            res.json({ image: size });
                        });
                        res.json({ message : 'successfully created image' });
                    });

                    // Resize Image
                    app.get('/gm/resize', function(req, res) {
                        var img = ('/nats.jpg');
                        gm('public/images' + img)
                        .flip()
                        .magnify()
                        .rotate('green', 45)
                        .blur(7, 3)
                        .crop(300, 300, 150, 130)
                        .edge(3)
                        .write('public/images/nats2.jpg', function (err) {
                          if (err) console.log('crazytown has not arrived ' + err);
                        })
                        res.json({ message : 'successfully created image' });
                    });

                    // Create Image
                    app.post('/gm/create', function(req, res) {
                        var text = req.body.text;
                        var imgId = req.body.id;
                        console.log(imgId);
                        gm(800, 40, "Transparent")
                        .font("Helvetica.ttf", 32)
                        .drawText(10, 30, text)
                        .write("public/images/create/"+imgId+".png", function (err, value) {
                          if(err){
                                console.log(err);
                            }
                          if (!err)
                            console.log(value);
                        });
                        // headlines.findOne({ _id: '55a51c73ef52cb308929d334' }, function (err, doc){
                        //   console.log(doc);
                        //   doc.imageUrl = 'public/images/create/'+doc._id+'.png'; 
                        //   doc.name = 'jason borne';
                        //   doc.save();
                        // })
                        res.json({ message : 'successfully created image' });
                    });

                    // Montage GraphicMagik
                    app.post('/gm/montage', function(req, res) {

                        // delete old montage file
                        // var filePath = "public/images/final/montage.png" ; 
                        // fs.unlinkSync(filePath);

                        // // creating an image for montage canvas
                        // gm(1600, 1200, "#FFF")
                        // .write("public/images/final/montage.png", function (err) {
                        //   // chill out and relax
                        // });

                        gm()
                        .montage('public/images/create/*.png')
                        .geometry('+100+150')
                        .write('public/images/final/montage.png', function(err) {
                            if(err) console.log(err);
                        });
                        res.json({ message : 'successfully created montage' });
                    });

                    
                    // Annotate
                    app.get('/gm/annotate', function(req, res) {
                        // annotate an image
                        gm('public/images/nats.jpg')
                        .stroke("#ffffff")
                        .drawCircle(10, 10, 20, 10)
                        .font("Helvetica.ttf", 12)
                        .drawText(300, 20, "Hi Kat!")
                        .write("public/images/annotate.png", function (err) {
                          if (err) console.log(err);
                        });
                        res.json({ message : 'successfully created image' });
                    });

                    // Montage ImageMagick
                    app.post('/im/montage', function(req, res) {
                      im.montage(['public/images/create/*.png', '-geometry', '+3+3', 'public/images/create/sprites.png'],
                        function(err, metadata){
                            if (err) throw err
                            console.log('stdout:', stdout);
                      });
                      res.json({ message : 'successfully created image' });
                    });
                    
        // FFMpeg routes

                    app.post('/ff/create', function(req, res) {
                        // make sure you set the correct path to your video file
                        ffmpeg()
                          .addInput('public/images/final/montage.png')
                          // loop for 5 seconds
                          .loop(5)
                          // using 25 fps
                          .fps(25)
                          // setup event handlers
                          .on('end', function() {
                            console.log('file has been converted succesfully');
                          })
                          .on('error', function(err) {
                            console.log('an error happened: ' + err.message);
                          })
                          // save to file
                          .save('public/images/final/video.m4v');
                          //Success!
                          res.json({ message : 'successfully created video' });
                    });

                    app.post('/ff/filter', function(req, res) {
                        // make sure you set the correct path to your video file
                        ffmpeg('public/images/final/video.m4v')
                          .videoFilters('fade=in:0:30', 'pad=640:480:0:40:violet')
                          .on('end', function() {
                            console.log('file has been converted succesfully');
                          })
                          .on('error', function(err, stdout, stderr) {
                               console.log('error: ' + err.message);
                               // console.log('stdout: ' + stdout);
                               // console.log('stderr: ' + stderr);
                           })
                          // save to file
                          .save('public/images/final/video.m4v');
                          //Success!
                          res.json({ message : 'successfully created video' });
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
