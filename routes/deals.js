var express = require('express');
var router = express.Router();
var dealModel = require('../models/deals');
var restModel = require('../models/restaurants');
var userModel = require('../models/user');
var defaultJson = require('../default.json');
var likeModel = require('../models/likes');

//add new deal
router.get('/addDeal', ensureAuthenticated, async function (req, res) {
	var docs = await restModel.getAllRestaurant();
	res.render('add_deal', { rests: docs,  dealtype: defaultJson.dealtype, pageHeader:'Add New Deal' });
});

router.post('/addDeal', ensureAuthenticated, async function (req, res) {
	try {
		await dealModel.createDeal(req, res);
		req.flash('success_msg', 'Deal has been added successfully.');

		return res.redirect('/deals/viewDeals')
	} catch (err) {
		console.log(err)
	}
})

//update deal
router.get('/editDeal/:id', ensureAuthenticated, async function(req, res){
	let id = req.params.id;
	try{
		let docs = await dealModel.getDeal(id);
		let rest = await restModel.getAllRestaurant();
		console.log('editing' + docs);
		res.render('add_deal', {deal: docs, rests: rest, dealtype: defaultJson.dealtype, pageHeader:'Edit Deal'});
	}catch(err){

	}
})


router.post('/editDeals/:id', ensureAuthenticated, async function(req, res){
	try {
		await dealModel.updateDeal(req.params.id, req, res);
		req.flash('success_msg', 'Deal has been updated successfully.');

		return res.redirect('/deals/viewDeals')
	} catch (err) {
		console.log(err)
	}

})

//delete deal
router.post('/deleteDeal/:id', ensureAuthenticated, async function(req, res){
	try{
		console.log('delete.............')
		await dealModel.deleteDeal(req.params.id, req, res);
		console.log('doc value ' + doc._id);
		req.flash('success_msg', 'Deal has been deleted successfully.');
	    res.send('done');
	}catch(err){

	}
})


//view deals
router.get('/viewDeals', ensureAuthenticated, async function (req, res) {
	try {
		let docs = await dealModel.getAllDeals();
		for(let i = 0; i < docs.length; i++){
			let likeCount = await likeModel.likeCounts(docs[i]._id, req, res);
			docs[i].likeCounting = likeCount;
			let check = await likeModel.checkLikes(docs[i]._id, req, res)
			
			if(check.length>0){
				docs[i].liked = true;
				docs[i].likeid = check[0]._id;
			}else{
				docs[i].liked = false;
			}
		let restaurantName = await restModel.findOne({ _id: docs[i].restaurantid }, { restaurantname: 1 });
		let createdByName = await userModel.findOne({_id: docs[i].createdby}, {name : 1});
			console.log(restaurantName +" "+ createdByName);
			if(restaurantName){
				docs[i].restName = restaurantName.restaurantname;
			}
			if(createdByName){
				docs[i].createdByName = createdByName.name;
			}
			
		}
		res.render('view_deals', { deals: docs });
		console.log(docs);
	} catch (err) {
		console.log(err);
	}
})

//like deal
router.get('/like/:dealid', ensureAuthenticated, async function(req, res){
	try{
		await likeModel.like(req.params.dealid, req, res);
		//req.flash('success_msg', 'Restaurant has been added successfully.');

		return res.redirect('/deals/viewDeals');
	}catch(err){
		console.log(err);
	}
})

//unlike deal
router.get('/unlike/:id', ensureAuthenticated, async function(req, res){
	try{
		console.log('unliking')
		await likeModel.unlike(req.params.id, req, res);
		//req.flash('success_msg', 'Restaurant has been added successfully.');

		return res.redirect('/deals/viewDeals');
	}catch(err){
		console.log(err);
	}
})


//authenticate user
function ensureAuthenticated(req, res, next) {
	if (req.isAuthenticated()) {
		return next();
	} else {
		//req.flash('error_msg','You are not logged in');
		res.redirect('/users/login');
	}
}


module.exports = router;