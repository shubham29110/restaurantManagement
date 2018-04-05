var mongoose = require('mongoose');

//deal schema
var DealSchema = mongoose.Schema({
    dealname : String,
    dealtype : String,
    discountoffer: Number,
    restaurantid : String,
    createdby : String

});

var Deal = module.exports = mongoose.model('Deal', DealSchema);

module.exports.createDeal = function(req, res){
    return new Promise(async function(resolve, reject){
        try{
            let dealInfo = {
                dealname : req.body.deal_name,
                dealtype : req.body.deal_type,
                discountoffer : req.body.discount_offer,
                restaurantid : req.body.restaurant,
                createdby : req._passport.session.user
            }
            let data = new Deal(dealInfo);
            let returnData = await data.save();
            resolve(returnData);

        }catch(err){
            reject(err);

        }
    })

}

//update
module.exports.updateDeal = function(id, req, res){
    return new Promise(async function(resolve, reject){
        try{
            let dealInfo = {
                dealname : req.body.deal_name,
                dealtype : req.body.deal_type,
                discountoffer : req.body.discount_offer,
                restaurantid : req.body.restaurant,
                createdby : req._passport.session.user
            }
        var query = {'_id':id};
           Deal.findOneAndUpdate(query, dealInfo, {upsert:true}, function(err, doc){
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
module.exports.deleteDeal = function(id, req, res){
    return new Promise(async function(resolve, reject){
        try{
            console.log("delete called "+id)
        var query = {'_id':id};
           var doc = Deal.findOneAndRemove(query, function(err, doc){
               if(err){
                reject(err);
               }else{
                   console.log("returned object "+doc)
                resolve(doc);
               }
           })
           
        }catch(err){
            reject(err);

        }
    })

}


module.exports.getAllDeals = function(){
    return new Promise(async function(resolve, reject){
        try{
            Deal.find({}, function(err, docs){
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

module.exports.getDeal = function(id){
    return new Promise(async function(resolve, reject){
        try{
            Deal.findById(id, function(err, docs){
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