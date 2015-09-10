"use strict";
var format = function(time, format){ 
	var t = new Date(time); 
	var tf = function(i){return (i < 10 ? '0' : '') + i}; 
	return format.replace(/yyyy|MM|dd|HH|mm|ss/g, function(a){ 
	switch(a){ 
	case 'yyyy': 
	return tf(t.getFullYear()); 
	break; 
	case 'MM': 
	return tf(t.getMonth() + 1); 
	break; 
	case 'mm': 
	return tf(t.getMinutes()); 
	break; 
	case 'dd': 
	return tf(t.getDate()); 
	break; 
	case 'HH': 
	return tf(t.getHours()); 
	break; 
	case 'ss': 
	return tf(t.getSeconds()); 
	break; 
	}; 
	}); 
	}; 
var firstPage = 1;
var pageSize = 6;

(function(){
	//进入我的推荐，初始化收益信息上一步下一步按钮
	$('#profitsPage .prePage').attr('disabled','disabled');
	$('#profitsPage .prePage').addClass('hover');
//	}
	var countOfProfitInfos = $('#countOfProfitInfosHidden').val();
	var profitPageCount=Math.ceil(countOfProfitInfos/pageSize);
	if(profitPageCount <= firstPage) {// && typeof($('#profitsPage .nextPage').attr('disabled')) != 'undefined'
		$('#profitsPage .nextPage').attr('disabled','disabled');
		$('#profitsPage .nextPage').addClass('hover');
	}
})();

//切换选项卡时初始化上一步，下一步按钮
function initialPageBtn(pageCount, preBtnObj, nextBtnObj, nowPageNo) { 
	if(nowPageNo == 1) { 
	preBtnObj.attr("disabled","disabled"); 
	} 
	if(pageCount <= firstPage) { 
	nextBtnObj.attr('disabled','disabled'); 
	} 
	}
//获取数据之前上一步下一步按钮处理
function beforeChangePage(pageBtnFlag, prePageObj, nextPageObj, nowPageNo, pageCount){
	/*pre
	IF(pageNo == 1){  return false;}
	ELSE(pageNo != 1){pre按钮置灰,计算上一页页号}
	*/
	if(pageBtnFlag == 'pre') {
		if(nowPageNo == firstPage) {
			return false;
		}
		else {
			prePageObj.attr('disabled', 'disabled');
			nowPageNo = Number(nowPageNo) - 1;
			return nowPageNo;
		}
	}
	
	/*next
	IF(pageNo == lastPage){ return false;}
	IF(pageNO != lastPage){next按钮置灰，计算下一页页号}
	*/
	if(pageBtnFlag == 'next') {
		if(nowPageNo == pageCount) {
			return false;
		}
		else {
			nextPageObj.attr('disabled', 'disabled');
			nowPageNo = Number(nowPageNo) + 1;
			return nowPageNo; 
		}
	}
}
//获取数据之后上一步下一步按钮处理
function afterChangePage(pageBtnFlag, prePageObj, nowPageObj, nextPageObj, pageNo, pageCount) {
	/*pre
	IF(pageNo == 1){不作处理（已经是灰色的）}
	展示页号,--只要能进来应该都可以改页码的
	ELSE(pageNo != 1){pre按钮恢复}
	IF(pageNo != lastPage && next按钮disabled){next恢复}
	*/
	nowPageObj.text(pageNo);
	if(pageBtnFlag == 'pre') {
		if(pageNo != 1) {
			prePageObj.removeAttr('disabled');
		}
		if(pageNo != pageCount && typeof(nextPageObj.attr('disabled')) != 'undefined') {
			nextPageObj.removeAttr('disabled');
		}
	}
	/*next
	IF(pageNo == lastPage){不作处理（已经是灰色的）}
	展示页号，--只要能进来应该都可以改页码的
	ELSE(pageNo != lastPage){next按钮恢复}
	IF(pageNo != firstPage && pre按钮disabled){pre恢复}
	*/
	if(pageBtnFlag == 'next') {
		nowPageObj.text(pageNo);
		if(pageNo != pageCount) {
			nextPageObj.removeAttr('disabled');
		}
		if(pageNo != firstPage && typeof(prePageObj.attr('disabled')) != 'undefined') {
			prePageObj.removeAttr('disabled');
		}
	}
	
}

function toggleHover(prePageObj, nextPageObj) {
	
	if(prePageObj.attr('disabled')){
		prePageObj.addClass('hover');
	}
	else {
		prePageObj.removeClass('hover');
	}
	if(nextPageObj.attr('disabled')){
		nextPageObj.addClass('hover');
	}
	else {
		nextPageObj.removeClass('hover');
	}
}

//ajax我推荐的用户
function showPreRecommendUsers(){
	showMyRecommendUsers('pre');
}
function showNextRecommendUsers(){
	showMyRecommendUsers('next');
}
function showMyRecommendUsers(pageBtnFlag) {
	//初始化上一步下一步按钮
	//展示数据getMyRecommendInfos()
	/*
	 * 
	 * beforeChangePage();
	 * ajax
	 * afterChangePage();
	 * 
	 */
	var countOfRecommendRegs=$('#countOfRecommendRegsHidden').val(); 
	var pageCount=Math.ceil(countOfRecommendRegs/pageSize);
	var nowPageNo=$.trim($('#recommendUsersPage .nowPage').text());
	var prePageObj=$('#recommendUsersPage .prePage');
	var nowPageObj=$('#recommendUsersPage .nowPage');
	var nextPageObj=$('#recommendUsersPage .nextPage');
	if(!pageBtnFlag) {
		initialPageBtn(pageCount, prePageObj, nextPageObj,nowPageNo);
		toggleHover(prePageObj, nextPageObj);
	}
	var pageNo = firstPage;
	if(typeof(pageBtnFlag) != 'undefined'){
		pageNo=beforeChangePage(pageBtnFlag, prePageObj, nextPageObj, nowPageNo, pageCount);
		if(!pageNo) {
			return false;
		}
		toggleHover(prePageObj, nextPageObj);
	}
	$.ajax({
		url: '/ecenter/servicesModule/myRecommend/getMyRecommendRegs',
		data: {
			pageNo : pageNo
		},
		type: 'post',
		async: true,
		dataType: 'json',
		contentType: 'application/x-www-form-urlencoded;charset=utf-8',
		success: function(data){
			if(data == 'fail' || !data.length) {	
				$('#recommendUsers').html('<tr class="table_head"><td width="330" class="differ">用户名</td><td width="330" class="differ">注册日期</td></tr>');
			}
			else {
				$('#recommendUsers').html('<tr class="table_head"><td width="330" class="differ">用户名</td><td width="330" class="differ">注册日期</td></tr>');
				$.each(data, function(index, recommendUserInfo) {//2014年12月01日&nbsp;&nbsp;&nbsp;12:30
					var item = '<tr><td>' + recommendUserInfo.recommendentryid.substring(0,1)+'***' + '</td><td class="look">' + format(recommendUserInfo.registerPolicyTime, 'yyyy-MM-dd HH:mm') + '</td></tr>';
					$('#recommendUsers').append(item);
				});
				if(typeof(pageBtnFlag) != 'undefined') {
					afterChangePage(pageBtnFlag, prePageObj, nowPageObj, nextPageObj, pageNo, pageCount);
					toggleHover(prePageObj, nextPageObj);
				}
			}
		}
	});
}

//设置我推荐的保单
function showPreRecommendInsures(){
	showMyRecommendInsures('pre');
}
function showNextRecommendInsures(){
	showMyRecommendInsures('next');
}
function showMyRecommendInsures(pageBtnFlag) {
	//初始化上一步下一步按钮
	//展示数据getMyRecommendInfos()
	/*
	 * 
	 * beforeChangePage();
	 * ajax
	 * afterChangePage();
	 * 
	 */
	var countOfInsuranceInfos=$('#countOfInsuranceInfosHidden').val(); 
	var pageCount=Math.ceil(countOfInsuranceInfos/pageSize);
	var nowPageNo=$.trim($('#insuranceInfosPage .nowPage').text());
	var prePageObj=$('#insuranceInfosPage .prePage');
	var nowPageObj=$('#insuranceInfosPage .nowPage');
	var nextPageObj=$('#insuranceInfosPage .nextPage');
	if(!pageBtnFlag) {
		initialPageBtn(pageCount, prePageObj, nextPageObj,nowPageNo);
		toggleHover(prePageObj, nextPageObj);
	}
	var pageNo = firstPage;
	if(typeof(pageBtnFlag) != 'undefined'){
		pageNo=beforeChangePage(pageBtnFlag, prePageObj, nextPageObj, nowPageNo, pageCount);
		if(!pageNo) {
			return false;
		}
		toggleHover(prePageObj, nextPageObj);
	}
	$.ajax({
		url: '/ecenter/servicesModule/myRecommend/getInsuranceInfos',
		data: {
			pageNo : pageNo
		},
		type: 'post',
		async: true,
		dataType: 'json',
		contentType: 'application/x-www-form-urlencoded;charset=utf-8',
		success: function(data){
			if(data == 'fail' || !data.length) {	
				$('#recommendInsures').html('<tr class="table_head"><td width="244" class="differ">所购产品</td><td width="242" class="differ">被保险车牌号/投保人姓名</td><td width="130" class="differ">保费(元)</td></tr>');
			}
			else {
				$('#recommendInsures').html('<tr class="table_head"><td width="244" class="differ">所购产品</td><td width="242" class="differ">被保险车牌号/投保人姓名</td><td width="130" class="differ">保费(元)</td></tr>');
				$.each(data, function(index, recommendInsureInfo) {//2014年12月01日&nbsp;&nbsp;&nbsp;12:30
					var secondColumn = recommendInsureInfo.productname;
					if( secondColumn ) {
						//车险展示被投保人车牌号只显示第一位和最后两位，中间位用*代替 
						if(recommendInsureInfo.platenumber!=null){//车险
							//车险投保新车未上牌：地区简称+*（京*） 
							 if(recommendInsureInfo.platenumber=="新车暂未上牌"||containsChar(recommendInsureInfo.platenumber)){
								//暂代地区
								var codeArea=recommendInsureInfo.policyno.substring(8,10);
								var secondColumn=getCodeToArea(codeArea);
								var secondColumnShow =secondColumn;
							}else{
								secondColumn=recommendInsureInfo.platenumber;
								var asteriskStr=''		
								for(var i=3;i<secondColumn.length;i++){
								 asteriskStr=asteriskStr+'*'
								}
								var secondColumnShow = secondColumn.substring(0,1) + asteriskStr+secondColumn.substring((secondColumn.length-2),secondColumn.length);
							}		
								var item = '<tr><td>' + recommendInsureInfo.productname + '</td><td>' + secondColumnShow + '</td><td class="look">' + recommendInsureInfo.premium + '</td></tr>';
								$('#recommendInsures').append(item);
						}else{
							//非车展示投保人首字母,其余位用*代替
							var asteriskStr = ''
							secondColumn = recommendInsureInfo.nameofapplicant;
							for(var i=1;i<secondColumn.length;i++){
								asteriskStr=asteriskStr+'*';
							}
							var secondColumnShow = secondColumn.substring(0,1) + asteriskStr;
							var item = '<tr><td>' + recommendInsureInfo.productname + '</td><td>' + secondColumnShow + '</td><td class="look">' + recommendInsureInfo.premium + '</td></tr>';
								$('#recommendInsures').append(item);
						}
					}
				});
				if(typeof(pageBtnFlag) != 'undefined') {
					afterChangePage(pageBtnFlag, prePageObj, nowPageObj, nextPageObj, pageNo, pageCount);
					toggleHover(prePageObj, nextPageObj);
				}
			}
		}
	});
}

//设置我的收益详情


//因为我产生的总活跃值

//根据地区代码获得车牌号地区头部
function getCodeToArea(codeArea){
    var strAreaMask =codeArea; 
    var codeToArea="";
        // 1北京 
        if (strAreaMask=="11") { 
        	codeToArea = "京*"; 
        //2 天津 
        } else if (strAreaMask=="12") { 
        	codeToArea = "津*"; 
 
        //3 河北 
        } else if (strAreaMask=="13") { 
        	codeToArea = "冀*"; 
 
        // 4山西 
        } else if (strAreaMask=="14") { 
        	codeToArea = "晋*"; 
 
        //5 内蒙古 
        } else if (strAreaMask=="15") { 
        	codeToArea = "蒙*"; 
 
        // 6辽宁 
        } else if (strAreaMask=="21") { 
        	codeToArea = "辽*"; 
 
        //7 大连 
        } else if (strAreaMask=="22") { 
        	codeToArea = "吉*"; 
 
        //8 吉林 
        } else if (strAreaMask=="23") { 
        	codeToArea = "黑*"; 
 
        //9 黑龙江 
        } else if (strAreaMask=="31") { 
        	codeToArea = "沪*"; 
 
        //10 上海 
        } else if (strAreaMask=="32") { 
        	codeToArea = "苏*"; 
 
        // 11江苏 
        } else if (strAreaMask=="33") { 
        	codeToArea = "浙*"; 
 
        //12 浙江 
        } else if (strAreaMask=="34") { 
        	codeToArea = "皖*"; 
 
        // 13宁波 
        } else if (strAreaMask=="35") { 
        	codeToArea = "闽*"; 
 
        // 14安徽 
        } else if (strAreaMask=="36") { 
        	codeToArea = "赣*"; 
 
        //15 福建 
        } else if (strAreaMask=="37") { 
        	codeToArea = "鲁*"; 
 
        //16 厦门 
        } else if (strAreaMask=="41") { 
        	codeToArea = "豫*"; 
 
        // 17江西 
        } else if (strAreaMask=="42") { 
        	codeToArea = "鄂*"; 
 
        //18 山东 
        } else if (strAreaMask=="43") { 
        	codeToArea = "湘*"; 
 
        //19 青岛 
        } else if (strAreaMask=="44") { 
        	codeToArea = "粤*"; 
 
        //20 河南 
        } else if (strAreaMask=="45") { 
        	codeToArea = "桂*"; 
 
        // 21湖北 
        } else if (strAreaMask=="46") { 
        	codeToArea = "琼*"; 
 
        // 22湖南 
        } else if (strAreaMask=="50") { 
        	codeToArea = "渝*"; 
 
        //23 广东 
        } else if (strAreaMask=="51") { 
        	codeToArea = "川*"; 
 
        // 24深圳 
        } else if (strAreaMask=="52") { 
        	codeToArea = "贵*"; 
 
        //25 广西 
        } else if (strAreaMask=="53") { 
        	codeToArea = "云*"; 
 
        //26 海南 
        } else if (strAreaMask=="54") { 
        	codeToArea = "藏*"; 
 
        //27 四川 
        } else if (strAreaMask=="61") { 
        	codeToArea = "陕*"; 
 
        //28 重庆 
        } else if (strAreaMask=="62") { 
        	codeToArea = "甘*"; 
 
        //29 贵州 
        } else if (strAreaMask=="63") { 
        	codeToArea = "青*"; 
 
        //30 云南 
        } else if (strAreaMask=="64") { 
        	codeToArea = "宁*"; 
 
        //31 西藏 
        } else if (strAreaMask=="65") { 
        	codeToArea = "疆*"; 
 
        }
        return  codeToArea;
   
}

/*
英文判断函数，返回true表示是全部英文，返回false表示不全部是英文
*/
function containsChar(str){
	for(var i=0;i<str.length;i++){
		var c=str.charAt(i);
		if((c<"a"||c>"z")&&(c<"A"||c>"Z")){
			return false;
		}
	}
	return true;
}
