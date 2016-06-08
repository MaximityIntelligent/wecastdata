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
		var option = {};
		//option.action = actionName;
		if(!action2||!buttonAction){
			res.view('log-month');
			return;
		}
		if( typeof action2 === 'string' ) {
    	action2 = [ action2 ];
		}
		//console.log(action2);
		var totalPrize1Winner;
		var totalPrize2Winner;
		user.find({credit: {'>': 79}}).exec(function(err, prize1Winners){
			totalPrize1Winner = prize1Winners.length;
			user.find({credit: {'>': 79}}).exec(function(err, prize2Winners){
				totalPrize2Winner = prize2Winners.length;
				console.log(totalPrize1Winner+ " "+totalPrize2Winner);

				user.find().exec(function(err, users){

						if(buttonAction=="accessMonth"){
							var year = req.param("year");
							var month = req.param("month");
							var startOfMonthStr = month+"/"+"01"+"/"+year;
							var startOfMonthDate = moment(startOfMonthStr, "MM/DD/YYYY").startOf('day').toDate();
							var endOfMonthDate = moment(startOfMonthStr, "MM/DD/YYYY").endOf('month').toDate();
							if(startOfMonthDate&&endOfMonthDate)
									option.createdAt = {">": startOfMonthDate, "<": endOfMonthDate};

							log.find(option).exec(function(err, accessArr){
									if(err){
											res.serverError(err);
											return;
									}
									actionAccess = _.groupBy(accessArr, function(access){
										return access.action;
									});
									var actionAccessCountMonth = {};
									var actionAccessTotal = {};
									actions = ['share_friend','share_timeline','share_button','about_easywash','rules','address','google_map','tel','prize1_page','prize2_page','redeem_prize1','redeem_prize2','continue_collect','go_wash','prize1_return','prize2_return','about_easywash_return','thankyou_page', 'total_share_friends'];
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
									res.view('log-month', {accessCountMonth: accessCountMonth, totalAccess: totalAccess, totalUser: users.length, action: actionName, year: year, month: month, action2: action2, actionAccessCountMonth: actionAccessCountMonth, actionAccessTotal: actionAccessTotal, totalPrize1Winner: totalPrize1Winner, totalPrize2Winner: totalPrize2Winner});
							});
					}else if(buttonAction=="accessDate"){
							var dateStr = req.param('date');
							var accessDateFrom = moment(dateStr, "MM/DD/YYYY").startOf('day').toDate();
							var accessDateTo = moment(dateStr, "MM/DD/YYYY").endOf('day').toDate();
							option.createdAt = {">": accessDateFrom, "<": accessDateTo};
							log.find(option).exec(function(err, accessArr){
									if(err){
											res.serverError(err);
											return;
									}
									actionAccess = _.groupBy(accessArr, function(access){
										return access.action;
									});
									var actionAccessCountDate = {};
									var actionAccessTotal = {};
									actions = ['share_friend','share_timeline','share_button','about_easywash','rules','address','google_map','tel','prize1_page','prize2_page','redeem_prize1','redeem_prize2','continue_collect','go_wash','prize1_return','prize2_return','about_easywash_return', 'thankyou_page', 'total_share_friends'];
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
									res.view('log-month', {accessCountDate: accessCountDate, totalAccess: totalAccess, totalUser: users.length, date: dateStr, action2: action2, actionAccessCountDate: actionAccessCountDate, actionAccessTotal: actionAccessTotal, totalPrize1Winner: totalPrize1Winner, totalPrize2Winner: totalPrize2Winner });
							});
					}

				})














			});
		});




	},
	logView: function(req, res){

		res.view('log-month');
	},
	checkServerUp: function(req, res){
		var http = require("http");
		http.get({host: "mood.ibeacon-macau.com"}, function(wecastRes){
			if(wecastRes.statusCode == 200){
				res.json({server: 'up'});
				return;
			}else{
				res.json({server: 'down'});
				return;
			}

		})
	}
};
