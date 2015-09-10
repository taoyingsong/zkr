/*0618update机构网店右侧详情*/
function dataset(element){
	if(element.dataset){                 //判断当前浏览器是否原生支持dataset属性
		return element.dataset;
	}
	var arr = [],                    //data-*自定义属性以“-”拆分后得到的数组
	result = {},                    //返回的属性对象
	attrName;                       //得到的新的属性名
	var attr = element.attributes;    //获取element元素的所有属性集合

	for(var i = 0; i < attr.length ; i++){          
		if(attr[i].name.slice(0,5) == "data-"){   //获取data-*的自定义属性                   
			arr = attr[i].name.split("-");        //data-*自定义属性以“-”拆分后得到的数组
			for(var j = 1; j < arr.length; j++){  //从第二个单词开始
				if(j > 1){   
					attrName += arr[j].slice(0,1).toUpperCase() + arr[j].slice(1);   //第二个单词开始首字母大写 
				}else{
					attrName = arr[j];    //第一个单词还是保持小写
				}
			}
			result[attrName] = attr[i].value;   //将属性名和值存入返回对象中                 }
		}
	}
	return result;
}

$(function(){

	//展开侧边详情
	$('.china_map a').bind('click',function(event){
		event = event || window.event;
		var target = event.target || event.srcElement;
		var agencyCode = target.getAttribute('value');
		//ajax
		$.ajax({
			url:'/ecenter/servicesModule/compro/queryComProInfosByPro',
			data:{
				provinceStr:agencyCode
			},
			type:'post',
			async:false,
			dataType:'json',
			contentType:'application/x-www-form-urlencoded;charset=utf-8',
			success:function(data){
				if(data == 'fail') {
					return false;
				}
				else{
					//写页面节点
					var results = data.companyProfiles;
					$('.h4_text').text(results[0].localcity);
					$('.map_side_list').html('');
					$.each(results, function(index, result){
						var item = ' <li class="side_li_01" data-city-branch="'+ result.citybranch +'"><i class="side_i" data-city-branch=' + result.citybranch + '"></i><span class="side_span_01" data-institution-name="' + result.institutionname + '" data-address="' + result.institutionaddress + '" data-postcode="' + result.postcode + '" data-phone="' + result.contactinfo + '" data-worktime="' + result.worktime +'" data-city-branch="' + result.citybranch + '">' + result.citybranch + '</span></li>'
						$('.map_side_list').append(item);
					});
				}
				$('.map_side_list').append("<li style='height:190px;clear:both;'></li>");
				$('.map_side').show();
				$('.srh_side').hide();
			}

		});
//		$('.map_side').show();
//		$('.srh_side').hide();

	})	
	//关闭侧边详情0702add
	$('.h4_close').bind('click',function(){
		$(this).parents('.map_side').find('.side_i').removeClass('side_i_chosen');
		$(this).parents('.map_side').children('.map_side_list').find('ul').hide();
		$(this).parents('.map_side').hide();
		$(this).parents('.srh_side').hide();
	})	

	$('.map_side_list').bind('click', function(event){
		event = event || window.event;
		var target = event.target || event.srcElement;
		while(target && target.tagName != 'LI') {
			target = target.parentNode;
		}
		var dataSet = dataset(target);
		var cityStr = dataSet.cityBranch;
		alert(target);
		
		var ul = target.querySelector("ul");
		alert(ul);
		if(ul) {
			$(target).find('ul').toggle();
		}
		else {
			$.ajax({
				url:'/ecenter/servicesModule/compro/queryComProInfosByCity',
				data:{
					cityStr:cityStr
				},
				type:'post',
				async:false,
				dataType:'json',
				contentType:'application/x-www-form-urlencoded;charset=utf-8',
				success:function(data){
					if(data == 'fail') {
						return false;
					}
					else{
						//写页面节点

						var results = data.companyProfiles;
						//创建ul
//						var ul = document.creatElement("ul");
						var ul = $("<ul></ul>");

						//向ul中添加元素
						$.each(results, function(index, result){
							var item = '<li class="side_li_02"><span class="side_span_02" data-institution-name="' + result.institutionname + '" data-address="' + result.institutionaddress + '" data-postcode="' + result.postcode + '" data-phone="' + result.contactinfo + '" data-worktime="' + result.worktime + '">' + result.institutionbrief + '</span></li>'
							ul.append(item);
						});		
						//将ul插入追加到页面
//						alert(target);
//						target.append(ul);
//						$parent.append(ul);
						$(target).append(ul);

					}
				}
			});

			$parent = $(target);
			$parent.toggleClass('side_i_chosen');
			if($parent.hasClass('side_i_chosen')){
				$parent.find('ul').show();
				$parent.siblings('li').removeClass('side_i_chosen');
				$parent.siblings('li').find('span').removeClass('side_span01_chosen');
				$parent.siblings('li').find('ul').hide();
			}else{
				$parent.find('ul').hide();
				$parent.children('i').siblings().find('.side_span_02').removeClass('side_span02_chosen');
				$parent.children('i').siblings().find('.side_span_03').removeClass('side_span03_chosen');

			}
			$parent.parents('.map_side_list').find('span').removeClass('side_span01_chosen');
			$('.side_layer').hide();
		}
	});

//	//侧边菜单展开
////	$('.side_i').bind('click',function(){
//	$('.side_li_01>span').livequery('click',function(event){
////	$('.side_i').livequery('click',function(event){
//	event = event || window.event;
//	var target = event.target || event.srcElement;
////	alert(target);
////	if(target.className != 'side_li_01') {
////	target = target.parent();
////	}
//	var $parent = $(this).parent();
////	alert(target);
//	var dataSet = dataset(target);
//	var cityStr = dataSet.cityBranch;
////	var thisObj = $(this);
//	//ajax
//	if(!$(this).parent().find('ul').length>0) {
//	$.ajax({
//	url:'/ecenter/servicesModule/compro/queryComProInfosByCity',
//	data:{
//	cityStr:cityStr
//	},
//	type:'post',
//	async:false,
//	dataType:'json',
//	contentType:'application/x-www-form-urlencoded;charset=utf-8',
//	success:function(data){
//	if(data == 'fail') {
//	return false;
//	}
//	else{
//	//写页面节点
//	var results = data.companyProfiles;
//	//创建ul
//	//					var ul = document.creatElement("ul");
//	var ul = $("<ul></ul>")
//	ul.className = "side_ul_01";
//	//向ul中添加元素
//	$.each(results, function(index, result){
//	var item = '<li class="side_li_02"><span class="side_span_02" data-institution-name="' + result.institutionname + '" data-address="' + result.institutionaddress + '" data-postcode="' + result.postcode + '" data-phone="' + result.contactinfo + '" data-worktime="' + result.worktime + '">' + result.institutionbrief + '</span></li>'
//	ul.append(item);
//	});
//	//将ul插入追加到页面
//	//					alert(target);
//	//					target.append(ul);
//	$parent.append(ul);

//	}
//	}
//	});
//	}
//	$parent.toggleClass('side_i_chosen');
//	if($parent.hasClass('side_i_chosen')){
//	$parent.find('ul').show();
//	$parent.siblings('li').removeClass('side_i_chosen');
//	$parent.siblings('li').find('span').removeClass('side_span01_chosen');
//	$parent.siblings('li').find('ul').hide();
//	}else{
//	$parent.find('ul').hide();
//	$parent.children('i').siblings().find('.side_span_02').removeClass('side_span02_chosen');
//	$parent.children('i').siblings().find('.side_span_03').removeClass('side_span03_chosen');

//	}
//	$parent.parents('.map_side_list').find('span').removeClass('side_span01_chosen');
//	$('.side_layer').hide();
//	})
	//侧边菜单划过

	$('.map_side_list span').livequery('mouseover',function(event){
		event = event || window.event;
		var target = event.target || event.srcElement;
		var dataSet = dataset(target);
		$("#institutionNameLayer").html(dataSet.institutionName);
		$("#institutionAddressLayer").html(dataSet.address);
		$("#postCodeLayer").html(dataSet.postcode);
		$("#contactInfoLayer").html(dataSet.phone);
		var time = dataSet.worktime.split(' ');
		var timeStr = time[0];
		if( time[1] ) {
			'<br/>' + time[1];
		}
		$("#workTimeLayer").html(timeStr);

		var $left = $(this).parent('li').offset().left;
		var $top = $(this).offset().top;
		// alert($left);
		$('.side_layer').css({'left':parseInt($left-328),'top':parseInt($top-7)}).show();
		$(this).parents('.map_side_list').find('span').removeClass('side_span01_chosen');
		$(this).parents('.map_side_list').find('span').removeClass('side_span02_chosen');
		$(this).parents('.map_side_list').find('span').removeClass('side_span03_chosen');
		if($(this).hasClass('side_span_01')){
			$(this).addClass('side_span01_chosen');

		}else if($(this).hasClass('side_span_02')){
			$(this).addClass('side_span02_chosen');

		}else if($(this).hasClass('side_span_03')){
			$(this).addClass('side_span03_chosen');

		}else{
			return false;	
		}
	}).livequery('mouseleave',function(){
		$('.side_layer').hide();
		$(this).removeClass('side_span01_chosen');
		$(this).removeClass('side_span02_chosen');
		$(this).removeClass('side_span03_chosen');
	})
	//搜索侧边栏展示
	$('.quick_query a').bind('click',function(){
		var keyword = $('#keyword').val();
		$.ajax({
			url:'/ecenter/servicesModule/compro/queryComProInfosByKeyword',
			data:{
				keyword:keyword
			},
			type:'post',
			async:false,
			dataType:'json',
			contentType:'application/x-www-form-urlencoded;charset=utf-8',
			success:function(data){
				if(data == 'fail') {
					$('#resultNumber').text("0");
					$('.srh_side_list').html('');
					$('.srh_side').show();
					$('.map_side').hide();
					return false;
				}
				else{
					//写页面节点
					var count = data.count;
					var results = data.companyProfiles;
					if(count<=200) {
						$('#resultNumber').text(count);
					}
					else {
						$('#resultNumber').text('前200');
					}
					$('.srh_side_list').html('');
					$.each(results, function(index, result){
						var item = ' <li data-institution-name="' + result.institutionname + '" data-address="' + result.institutionaddress + '" data-postcode="' + result.postcode + '" data-phone="' + result.contactinfo + '" data-worktime="' + result.worktime +'" data-city-branch="' + result.citybranch + '">' + result.institutionbrief + '</li>'
						$('.srh_side_list').append(item);
					});
				}
				$('.srh_side_list').append("<li style='height:190px;clear:both;'></li>");
				$('.srh_side').show();
				$('.map_side').hide();
			}

		});
//		$('.srh_side').show();
//		$('.map_side').hide();
	})

	//搜索侧边栏划过
	$('.srh_side_list li').livequery('mouseover',function(event){
		event = event || window.event;
		var target = event.target || event.srcElement;
		var dataSet = dataset(target);
		$("#institutionNameLayer").html(dataSet.institutionName);
		$("#institutionAddressLayer").html(dataSet.address);
		$("#postCodeLayer").html(dataSet.postcode);
		$("#contactInfoLayer").html(dataSet.phone);
		var time = dataSet.worktime.split(' ');
		var timeStr = time[0];
		if( time[1] ) {
			'<br/>' + time[1];
		}
		$("#workTimeLayer").html(timeStr);

		var $left = $(this).offset().left;
		var $top = $(this).offset().top;
		$('.side_layer').css({'left':parseInt($left-347),'top':parseInt($top-3)}).show();
		$(this).addClass('srh_li_hover');
	}).livequery('mouseleave',function(){
		$('.side_layer').hide();
		$(this).removeClass('srh_li_hover');
	})

});