 // app/routes.js

// grab the notes model
var headlines = require('./models/headlines');

// include GraphicsMagick and Filesystem
var fs = require('fs');
var gm = require('gm');
var gs = require('gs');


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
                                console.info('%d headlines were successfully stored.', data.length);
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


                    // route to delete all headlines
                    app.delete('/api/resetHeadlines/all', function(req, res) {
                        headlines.remove({
                            }, function(err, note) {
                              if (err)
                                  res.send(err);
                              res.json({ message: 'Successfully removed headline'});
                        });
                    });

        // GraphicMagik Routes
            
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
                    });

                    // Create Image
                    app.post('/gm/create', function(req, res) {
                        var text = req.body.text;
                        var id = req.body.id;
                        console.log(text);
                        gm(800, 40, "#fff")
                        .font("Helvetica.ttf", 32)
                        .drawText(10, 30, text)
                        .write("public/images/create/"+text+".png", function (err) {
                          if (err) console.log(err);
                        });
                      //   Sub.findOne({ _id: sub._id }, function (err, doc){
                      //     if (err || !doc) {
                      //       res.json({ error : err });
                      //     } else {
                      //       //get this submission's status before the update. This decides whether we send an email notification
                      //       var originalStatus = doc.submitted;
                      //       //Add new mediasets. Do not overwrite existing mediasets!
                      //       for(var i=0; sub.mediasets.length > i; i++){
                      //         var exists = false;
                      //         for(var c=0; doc.mediasets.length > c; c++){
                      //           if(doc.mediasets[c] != null && sub.mediasets[i] != null && doc.mediasets[c].mediasetId == sub.mediasets[i].mediasetId){ exists = true; }
                      //         }
                      //         if(!exists && sub.mediasets[i]){
                      //           doc.mediasets.push(sub.mediasets[i]);
                      //         }
                      //       }

                      //       doc.formData = sub.formData;    
                      //       //doc.mediasets = sub.mediasets;    
                      //       doc.tags = sub.tags;
                      //       doc.submitted = sub.submitted;       
                      //       doc.cookies = sub.cookies; 
                      //       doc.save();
                      //       console.log("Action='update submission' SubId="+sub._id+" Status=success");
                      //       //If this sub's submitted status was false and now it's true, send a notification email  
                      //       if(!originalStatus && sub.submitted) {
                      //         sendSubmissionNotification(doc, App, User, ses, messages, applicationBase); 
                      //       }     
                      //       res.json({ submissionInfo : doc });
                      //     }

                      //   });
                      // };
                    });

                    // Montage
                    app.post('/gm/montage', function(req, res) {
                        gm('public/images/create/montage.png')
                        .montage('public/images/create/1.png')
                        .geometry('+100+150')
                        .write('public/images/create/montage.png', function(err) {
                            if(err) console.log(err);
                        });
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
