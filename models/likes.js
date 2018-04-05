var mongoose = require("mongoose");

//schema
var likeSchema = mongoose.Schema({
    itemid: String,
    likedbyid: String
});

var Likes = module.exports = mongoose.model('Likes', likeSchema);

//likes
module.exports.like = function(id,req,res){
    return new Promise(async function(resolve, reject){
        try{
            let likeInfo = {
                itemid :id,
                likedbyid : req._passport.session.user
            }

            let data = new Likes(likeInfo);
            let returnData = await data.save();
            resolve(returnData);

        }catch(err){
            reject(err);

        }

    })
}

//unlike
module.exports.unlike = function(id,req,res){
    return new Promise(async function(resolve, reject){
        try{
            var query = {'_id':id};
            Likes.findOneAndRemove(query, function(err, doc){
                   if(err){
                    reject(err);
                   }else{
                    resolve(doc);
                   }
               })
               
            }catch(err){
                reject(err);
    
            }
    })
}

//check like
module.exports.checkLikes = function(id,req,res){
    return new Promise(async function(resolve, reject){
        try{
           let returnData = await Likes.find({$and:[{"itemid":id},{"likedbyid": req._passport.session.user }]});
            resolve(returnData);

        }catch(err){
            reject(err);

        }

    })
}

//like counts
module.exports.likeCounts = function(id, req, res){
    return new Promise(async function(resolve, reject){
        try{
           let returnData = await Likes.find({"itemid":id}).count();
           console.log('count model ' +returnData)
            resolve(returnData);

        }catch(err){
            reject(err);

        }

    })
}

