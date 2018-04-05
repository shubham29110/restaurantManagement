var mongoose = require('mongoose');

//Restaurant schema
var RestaurantSchema = mongoose.Schema({
    restaurantname : String,
    address : String,
    ownername: String,
    contactnumber : Number, 
    createdby : String

});

//Restaurant likes schema
var RestaurantLikesSchema = mongoose.Schema({
    restaurantid: String,
    likedbyid: String
})

var RestaurantLikes = module.exports = mongoose.model('RestaurantLikes', RestaurantLikesSchema);

var Restaurant = module.exports = mongoose.model('Restaurant', RestaurantSchema);

module.exports.addRestaurant = function(req, res){
    return new Promise(async function(resolve, reject){
       // console.log(req._passport.session.user)
        try{
            let restInfo = {
                restaurantname : req.body.rest_name,
                address : req.body.address,
                ownername : req.body.owner_name,
                contactnumber : req.body.contact_number,
                createdby : req._passport.session.user
            }
            
            let data = new Restaurant(restInfo);
            let returnData = await data.save();
            resolve(returnData);

        }catch(err){
            reject(err);

        }
    })

}

//update
module.exports.updateRestaurant = function(id, req, res){
    return new Promise(async function(resolve, reject){
        try{
            let restInfo = {
                restaurantname : req.body.rest_name,
                address : req.body.address,
                ownername : req.body.owner_name,
                contactnumber : req.body.contact_number,
                createdby : req._passport.session.user
            }
        var query = {'_id':id};
           Restaurant.findOneAndUpdate(query, restInfo, {upsert:true}, function(err, doc){
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

//delete
module.exports.deleteRestaurant = function(id, req, res){
    return new Promise(async function(resolve, reject){
        try{
        var query = {'_id':id};
           Restaurant.findOneAndRemove(query, function(err, doc){
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


module.exports.getAllRestaurant = function(){
    return new Promise(async function(resolve, reject){
        try{
           await Restaurant.find({}, function(err, docs){
                if(err){
                    reject(err);
                }else{
                    resolve(docs);
                }
            })

        }catch(err){
            reject(err);
        }
    })
}

module.exports.getRestaurant = function(id){
    return new Promise(async function(resolve, reject){
        try{
            Restaurant.findById(id, function(err, docs){
                if(err){
                    reject(err);
                }else{
                    resolve(docs);
                }
            })

        }catch(err){
            reject(err);
        }
    })
}

//likes
module.exports.restaurantLike = function(restId,req,res){
    return new Promise(async function(resolve, reject){
        try{
            let restInfo = {
                restaurantid :restId,
                likedbyid : req._passport.session.user
            }

            let data = new RestaurantLikes(restInfo);
            let returnData = await data.save();
            resolve(returnData);

        }catch(err){
            reject(err);

        }

    })
}

//unlike
module.exports.restaurantUnlike = function(restId,req,res){
    return new Promise(async function(resolve, reject){
        try{
            var query = {'_id':restId};
            RestaurantLikes.findOneAndRemove(query, function(err, doc){
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
module.exports.checkLikes = function(restId,req,res){
    return new Promise(async function(resolve, reject){
        try{
           let returnData = await RestaurantLikes.find({$and:[{"restaurantid":restId},{"likedbyid": req._passport.session.user }]});
            resolve(returnData);

        }catch(err){
            reject(err);

        }

    })
}

//like counts
module.exports.likeCounts = function(restId, req, res){
    return new Promise(async function(resolve, reject){
        try{
           let returnData = await RestaurantLikes.find({"restaurantid":restId}).count();
           console.log('count model ' +returnData)
            resolve(returnData);

        }catch(err){
            reject(err);

        }

    })
}

