var express    = require('express');
var app        = express();
var bodyParser = require('body-parser');
var mongoose   = require('mongoose');
mongoose.connect('mongodb://localhost:27017/express-todo');
var Note = require('./app/models/note.js');

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

var port = process.env.PORT || 8080;

var router = express.Router();
router.get('/', function(req, res) {
    res.json({ message: 'hooray! welcome to our api!' });   
});

router.route('/notes')
  .post(function(req, res) {
    var note = new Note();
    note.title = req.body.title;
    note.body = req.body.body;

    note.save(function(err) {
      if (err) {
        return res.send(err);
      }
      res.json({ message: 'note created!' });
    });
  })
  .get(function(req, res) {
    Note.find(function(err, notes) {
      if (err) {
        return res.send(err);
      }
      res.json(notes);
    });
  });

router.route('/notes/:note_id')
  .get(function(req, res) {
    Note.findById(req.params.note_id, function(err, note) {
      if (err) {
        return res.send(err);
      }
      res.json(note);
    });
  })
  .put(function(req, res) {
    Note.findById(req.params.note_id, function(err, note) {
      if (err) {
        return res.send(err);
      }
      if (req.body.title) {
        note.title = req.body.title;  // update the bears info
      }
      if (req.body.body) {
        note.body = req.body.body;  // update the bears info
      }
      note.save(function(err) {
        if (err) {
          return res.send(err);
        }
        res.json({ message: 'Note updated!' });
      });
    });
  })
  .delete(function(req, res) {
    Note.remove({
      _id: req.params.note_id
    }, function(err, note) {
      if (err) {
        return res.send(err);
      }
      res.json({ message: 'Successfully deleted' });
    });
  });
// all of our routes will be prefixed with /api
app.use('/api', router);

// START THE SERVER
// =============================================================================
app.listen(port);
console.log('Magic happens on port ' + port);