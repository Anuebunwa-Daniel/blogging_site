

app.post("/edit", (req, res) => {
  const requestedId = req.params.id;
  console.log(req.body);
  Post.findOneAndUpdate({
     _id: requestedId                   // Query Part
  },
  {
    $set: {
       title: req.body.title,           // Fields which we need to update
       content: req.body.content
    }
  }
  { 
    new: true                          // option part ( new: true will provide you updated data in response )
 },
 );
});
