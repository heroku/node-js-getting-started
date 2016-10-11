var FaceHelper = {
  getPreviousFace: function(number, callback){
    Face.find({number:{$lt:number}}).limit(10).sort({'number':'desc'}).exec(function(err, faces) {
        callback(faces[0]);
    });
  },
  getNextFace: function(number, callback){
    Face.find({number:{$gt:number}}).limit(10).sort({'number':'asc'}).exec(function(err, faces) {
        callback(faces[0]);
    });
  }
};

module.exports = FaceHelper;
