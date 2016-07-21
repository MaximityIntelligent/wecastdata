/**
 * LogController
 *
 * @description :: Server-side logic for managing logs
 * @help        :: See http://sailsjs.org/#!/documentation/concepts/Controllers
 */
var moment = require('moment');
module.exports = {
	log: function(req, res){
		var buttonAction = req.param('buttonAction');

		var actionName = req.param('action');
		var action2 = req.param('action2');
		var accumulated = req.param('accumulated');
		var option = {};
		//option.action = actionName;
		if(!action2||!buttonAction){
			res.view('log-month');
			return;
		}
		if( typeof action2 === 'string' ) {
    	action2 = [ action2 ];
		}
		console.log(action2.length);
		var totalPrize1Winner = 0;
		var totalPrize2Winner = 0;
		// user.count({credit: {'>=': 15}}).exec(function(err, prize1Winners){
		// 	totalPrize1Winner = prize1Winners;
		// 	user.count({credit: {'>=': 30}}).exec(function(err, prize2Winners){
		// 		totalPrize2Winner = prize2Winners;
		// 		console.log(totalPrize1Winner+ " "+totalPrize2Winner);

				user.find().exec(function(err, users){
					if (err) {
						console.log(err);
					}
					console.log(users.length);
					console.log(buttonAction);
					// user.count({vote:'vote1'}).exec(function (err, vote1) {
					// user.count({vote:'vote2'}).exec(function (err, vote2) {
						// console.log(vote1+" : "+ vote2);
						if(buttonAction=="accessMonth"){
							var year = req.param("year");
							var month = req.param("month");
							var startOfMonthStr = month+"/"+"01"+"/"+year;
							var startOfMonthDate = moment(startOfMonthStr, "MM/DD/YYYY").startOf('day').toDate();
							var endOfMonthDate = moment(startOfMonthStr, "MM/DD/YYYY").endOf('month').toDate();
							if(startOfMonthDate&&endOfMonthDate)
									option.createdAt = {">": startOfMonthDate, "<": endOfMonthDate};
							if (action2) {
								option.action = action2;
							}

							log.find({ where: option, select:['action', 'createdAt']}).exec(function(err, accessArr){
								    console.log("accessArr");
									if(err){
											res.serverError(err);
											return;
									}
									actionAccess = _.groupBy(accessArr, function(access){
										return access.action;
									});
									var actionAccessCountMonth = {};
									var actionAccessTotal = {};
									var noActions = ['about_easywash','prize1_page','prize2_page','go_wash','prize1_return','prize2_return','about_easywash_return']
									actions = ['regist','share_friend','share_timeline','share_button','rules','address','google_map','tel','redeem_prize1','redeem_prize2','continue_collect','thankyou_page', 'total_share_friends', 'redeem_vote'];
									
									for (var j=0; j< actions.length; j++){
										actionAccessTotal[actions[j]] = 0;
										actionAccessCountMonth[actions[j]] = {};
									}
									for (var property in actionAccess){
										if(actionAccess[property]){
											actionAccessTotal[property] = actionAccess[property].length;
										}else {
											actionAccessTotal[property] = 0;
										}

										actionAccess[property+"-access"] = _.groupBy(actionAccess[property], function(a){
											return a.createdAt.getDate();
										})
										actionAccessCountMonth[property] = {};
										for (var property2 in actionAccess[property+'-access']){
											actionAccessCountMonth[property][property2] = actionAccess[property+'-access'][property2].length;
											//console.log(property+property2+actionAccess[property+'-access'][property2].length);
										}

									}
									accessObj = _.groupBy(accessArr, function(access){
											return access.createdAt.getDate();
									});
									var accessCountMonth = {};
									for(var property in accessObj) {
											accessCountMonth[property] = accessObj[property].length;
											var sum =0;
									}
									var totalAccess = accessArr.length;
									//console.log("action:"+action2.length);
									if(!action2){
										action2 = [];
									}
									console.log({year: year, month: month, actionAccessCountMonth: actionAccessCountMonth.length, accumulated: accumulated});
									res.view('log-month', {accessCountMonth: accessCountMonth, totalAccess: totalAccess, totalUser: users.length, action: actionName, year: year, month: month, action2: action2, actionAccessCountMonth: actionAccessCountMonth, actionAccessTotal: actionAccessTotal, totalPrize1Winner: totalPrize1Winner, totalPrize2Winner: totalPrize2Winner, accumulated: accumulated});
							});
						}else if(buttonAction=="accessDate"){
							var dateStr = req.param('date');
							var accessDateFrom = moment(dateStr, "MM/DD/YYYY").startOf('day').toDate();
							var accessDateTo = moment(dateStr, "MM/DD/YYYY").endOf('day').toDate();
							option.createdAt = {">": accessDateFrom, "<": accessDateTo};
							if (action2) {
								option.action = action2;
							}
							log.find(option).exec(function(err, accessArr){
									console.log("accessArr");
									if(err){
											res.serverError(err);
											return;
									}
									actionAccess = _.groupBy(accessArr, function(access){
										return access.action;
									});
									var actionAccessCountDate = {};
									var actionAccessTotal = {};
									var noActions = ['about_easywash','prize1_page','prize2_page','go_wash','prize1_return','prize2_return','about_easywash_return']
									actions = ['regist','share_friend','share_timeline','share_button','rules','address','google_map','tel','vote','show_redeem','redeem_prize1','redeem_prize2','continue_collect','thankyou_page', 'total_share_friends', 'redeem_vote'];
									for (var j=0; j< actions.length; j++){
										actionAccessTotal[actions[j]] = 0;
										actionAccessCountDate[actions[j]] = {};
									}
									for (var property in actionAccess){
										if(actionAccess[property]){
											actionAccessTotal[property] = actionAccess[property].length;
										}else {
											actionAccessTotal[property] = 0;
										}
										actionAccess[property+"-access"] = _.groupBy(actionAccess[property], function(a){
											return moment(a.createdAt).hour();//a.createdAt.getDate();
										})
										actionAccessCountDate[property] = {};
										for (var property2 in actionAccess[property+'-access']){
											actionAccessCountDate[property][property2] = actionAccess[property+'-access'][property2].length;
											//console.log(property+property2+actionAccess[property+'-access'][property2].length);
										}

									}
									accessObj = _.groupBy(accessArr, function(access){
											return moment(access.createdAt).hour();
									});
									var accessCountDate = {};
									for(var property in accessObj) {
											accessCountDate[property] = accessObj[property].length;
									}
									var totalAccess = accessArr.length;
									if(!action2){
										action2 = [];
									}
									console.log({date: dateStr, actionAccessCountDate: actionAccessCountDate.length, accumulated: accumulated});
									res.view('log-month', {accessCountDate: accessCountDate, totalAccess: totalAccess, totalUser: users.length, date: dateStr, action2: action2, actionAccessCountDate: actionAccessCountDate, actionAccessTotal: actionAccessTotal, totalPrize1Winner: totalPrize1Winner, totalPrize2Winner: totalPrize2Winner, accumulated: accumulated});
							});
						}

					// });
					// });

				});














		// 	});
		// });




	},
	logView: function(req, res){

		res.view('log-month');
	}
	// ,
	// checkServerUp: function(req, res){
	// 	var http = require("http");
	// 	http.get({host: "lb.ibeacon-macau.com", path:"/api/checkAlive"}, function(wecastRes){
	// 		if(wecastRes.statusCode == 200){
	// 			res.json({server: 'up'});
	// 			return;
	// 		}else{
	// 			res.json({server: 'down'});
	// 			return;
	// 		}

	// 	})
	// }
};
