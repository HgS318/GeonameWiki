
var infoWindow, map, level = 12;
var markers = [];	//	所有点标注
var showingPlaces;	//	所有当前显示的地名
var windata;		//	当前信息窗体中的地名数据
var orgdata, destdata;	//	信息窗体搜索框中起点，终点的地点数据
var navMethod = "trans";	//	信息窗体中上一次导航方式
var entered = false;	//	信息窗体搜索框是否键入过Enter
var infoWinDown;	//	信息窗体下部搜索框html

//	生成信息窗体的内容
function constructInfoWindow(title, content) {
    var info = document.createElement("div");
    info.className = "info";

    //可以通过下面的方式修改自定义窗体的宽高
    //info.style.width = "400px";
    // 定义顶部标题
    var top = document.createElement("div");
    var titleD = document.createElement("div");
    var closeX = document.createElement("img");
    top.className = "info-top";
    titleD.innerHTML = title;
    closeX.src = "images/close2.gif";
    closeX.onclick = closeInfoWindow;
    top.appendChild(titleD);
    top.appendChild(closeX);
    info.appendChild(top);

    // 定义中部内容
    var middle = document.createElement("div");
    middle.className = "info-middle";
    middle.style.backgroundColor = 'white';
    middle.innerHTML = content;
    info.appendChild(middle);

    //	添加下部内容（搜索框）
//			info.appendChild(infoWinDown);

    // 定义底部内容
    var bottom = document.createElement("div");
    bottom.className = "info-bottom";
    bottom.style.position = 'relative';
    bottom.style.top = '0px';
    bottom.style.margin = '0 auto';
    var sharp = document.createElement("img");
    sharp.src = "images/sharp.png";
    bottom.appendChild(sharp);
    info.appendChild(bottom);

    return info;
}

function constructWeiboBtn() {
    var div = document.getElementById("actwb");
    var htm = div.outerHTML;
    return htm;
}

//	生成信息创意下部（搜索框）的内容
function constructInfoDown() {
    //	定义下部内容
    var down = document.createElement("div");
    down.className = "amap-info-combo status-origin";
    down.setAttribute("id", "winbtm");
//			down.setAttribute("style", "background-color: #FFFFFF");
    var downstr = "" +
//			"<div class=\"amap-info-combo status-origin\" id=\"winbtm\">" +
            "<table><tbody>"+
            "<tr class=\"amap-info-tabs\">" +
            "<td class=\"tab\" id=\"findnear\" onclick=\"selectsrhmethod(this)\"><i class=\"tab-icon icon-around\"></i>在附近找</td>" +
            "<td class=\"tab selected\" id=\"fromhere\" onclick=\"selectsrhmethod(this)\"><i class=\"tab-icon icon-start\"></i>这里出发</td>" +
            "<td class=\"tab\" id=\"tothere\" onclick=\"selectsrhmethod(this)\"><i class=\"tab-icon icon-end\"></i>到这里去</td>" +
            "</tr></tbody>" +
            "</table>" +
            "<table cellpadding=\"0\"><tbody>" +
            "<tr>" +
            "<td class=\"input-label\" id=\"startorend\">终点</td>" +
            "<td>" +
            "<div class=\"keyword-input\"><input class=\"keyword\" type=\"text\" id=\"winsrhword\" /></div>" +
            "</td>" +
            "<td>" +
            "<div class=\"search-button hide\" id=\"poisrhbtn\" onclick=\"srhpoi();\">搜索</div>" +
            "<div class=\"nav-button\" id=\"navsrhdiv\">" +
            "<span class=\"nav-icon nav-drive\" id=\"drivesrhbtn\" onclick=\"srhdrive();\">驾车</span>" +
            "<span class=\"nav-icon nav-bus\" id=\"bussrhbtn\" onclick=\"srhbus();\">公交</span>" +
            "<span class=\"nav-icon nav-walk\" id=\"walksrhbtn\" onclick=\"srhwalk();\">步行</span>" +
            "</div>" +
            "</td>" +
            "</tr></tbody>" +
            "</table>"
//			 + "</div>"
        ;
    down.innerHTML = downstr;
    return down;
}

//	打开信息窗体
function openInfoWindow(data) {
    var extData = data;
//			var wbttm = constructWeiboBtn();
//			var title = '<table><tbody><tr><td style="padding-top: 7px">' +
//					wbttm + '&nbsp;&nbsp;' + '</td><td>' +
//					extData.name + '<span style="font-size:11px;color:#F00;">&nbsp;&nbsp;' + extData['小类'] + '</span>'
//					+ '</td></tr></tbody></table>';
    var objdesc = extData['地理实体描述'], showobj = "";
//			if(objdesc) {
//				showobj = objdesc.replace("<br/>","：  ");
//				if(showobj.length > 34) {
//					showobj = showobj.substring(0, 32) + "...";
//				}
//			}
    showobj = extData['desbrif'];
    var title = extData.name + '<span style="font-size:11px;color:#F00;">&nbsp;&nbsp;' + extData['类别名称'] + '</span>';
    //var title = '华荣正街' + '<span style="font-size:11px;color:#F00;">&nbsp;&nbsp;' + '街道' + '</span>';
    var content = [];
    content.push("<img src='images/contentdemopic.jpg'>"
        + "<strong>地名含义：</strong>" + extData['brif']);
    content.push("<strong>行政区：</strong>" + extData['所在跨行政区']);
    content.push("<strong>使用时间：</strong>" + extData['使用时间']);
//			content.push(
//					"<a href='html/wikiContent_fitall.html?name=" + extData.nickname + "' target='_blank'>详细信息</a>"
////					"&nbsp; &nbsp; &nbsp; &nbsp;  " + wbttm
////					+ "<a href='html/wikiContent_fitall.html?name=" + extData.nickname + "' target='_blank'>详细信息</a>"
//			);
    content.push("<strong>地理实体描述：</strong>" + showobj +
        "&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;" +
        "<a href='html/wikiContent_fitall.html?name=" + extData['spell'] + "' target='_blank'>详细信息</a>");
    closeInfoWindow();
    infoWindow = new AMap.InfoWindow({
        isCustom: true,  //使用自定义窗体
        content: constructInfoWindow(title, content.join("<br>")),
        offset: new AMap.Pixel(14, -47)	//-113, -140
    });
    infoWindow.on('open', function () {
        windata = data;
    });
    infoWindow.on('close', function () {
        hasAutoCom = false;
//				var srhdiv = document.getElementById("winbtm");
//				srhdiv.setAttribute("id", "oldwinbtm");
//				srhdiv.innerHTML = " ";
    });
    infoWindow.on('change', function () {

    });

    infoWindow.open(map, data.position);


}

//	关闭地图中的信息窗体
function closeInfoWindow() {
    if(infoWindow) {
        infoWindow.close();
        map.clearInfoWindow();
        infoWindow = null;
    }
}

//	附近搜索
function srhpoi() {
    var item0 = consPlaceResult(windata, "中");

    var inputele = document.getElementById("winsrhword");
    var srhtxt = inputele.value;
    var placeSearch = new AMap.PlaceSearch({ //构造地点查询类
        pageSize: 5,
        pageIndex: 1,
        city: windata.citycode, //城市
        map: map,
        panel: "pathinfo1"
    });
    placeSearch.searchNearBy(srhtxt, windata.position, 500, function(status, result) {
        var test = 0;
    });
    closeWindowBySearch();
    clearNavPanel();
    setResultsInDiv([item0], "pathpoints");
}

//	驾车搜索
function srhdrive() {
    navMethod = "drive";
    var transOptions = createTransOption();
    var trans = new AMap.Driving(transOptions);
    trans.search(orgdata.position, destdata.position, function(status, result) {
        //TODO:开发者使用result自己创建交互面板和地图展示
    });
    closeWindowBySearch();
}

//	公交搜索
function srhbus() {
    navMethod = "trans";
    var transOptions = createTransOption();
    var trans = new AMap.Transfer(transOptions);
    trans.search(orgdata.position, destdata.position, function(status, result) {
        //TODO:开发者使用result自己创建交互面板和地图展示
    });
    closeWindowBySearch();
}

//	步行搜索
function srhwalk() {
    navMethod = "walk";
    var transOptions = createTransOption();
    var trans = new AMap.Walking(transOptions);
    trans.search(orgdata.position, destdata.position, function(status, result) {
        //TODO:开发者使用result自己创建交互面板和地图展示
    });
    closeWindowBySearch();
}

//	生成搜索Options的内容
function createTransOption() {
    var inputele = document.getElementById("winsrhword");
    var srhtxt = inputele.value;
    var soe = document.getElementById("startorend");
    var otherplace = findPlaceByAttr("name", srhtxt);
    if(soe.innerHTML == "起点") {
        orgdata = otherplace;
        destdata = windata;
    } else {
        orgdata = windata;
        destdata = otherplace;
    }
    var item1 = consPlaceResult(orgdata, "起");
    var item2 = consPlaceResult(destdata, "终");
    clearNavPanel();
    setResultsInDiv([item1, item2], "pathpoints");

    var transOptions = {
        city: orgdata.citycode,
        citid: destdata.citycode,
//				policy: AMap.TransferPolicy.LEAST_TIME,
        map: map,
        panel: "pathinfo1"
    };
    return transOptions;
}

//	在所有地名中按属性查询
function findPlaceByAttr(attr, _name) {
    var pla = null;
    for(var i = 0; i < placedata.length; i++) {
        var testplace = placedata[i];
        if(testplace[attr] == _name) {
            pla = testplace;
            break;
        }
    }
    return pla;
}

//	因为搜索而关闭信息窗体
function closeWindowBySearch() {
    document.getElementById("winsrhword").value = "";
    closeInfoWindow();
    map.clearMap();
    initmarkers();
//			toChangeHead("hm_favnav");
}

//	清空“路径规划”容器的内容
function clearNavPanel() {
    var navPanel = document.getElementById("pathinfo1");
    navPanel.innerHTML = "";
}

//	设置信息窗体搜索方式
function selectsrhmethod(e) {
    var oid = e.id;
    var posObj = document.getElementById("findnear");
    var fhObj = document.getElementById("fromhere");
    var thObj = document.getElementById("tothere");

    switch(oid) {
        case "findnear":{
            posObj.className = "tab selected";
            fhObj.className = "tab";
            thObj.className = "tab";
            $("#startorend")[0].innerHTML = "";
            $("#poisrhbtn")[0].className = "search-button";
            $("#navsrhdiv")[0].className = "nav-button hide";
            break;
        }
        case "fromhere":{
            posObj.className = "tab";
            fhObj.className = "tab selected";
            thObj.className = "tab";
            $("#startorend")[0].innerHTML = "终点";
            $("#poisrhbtn")[0].className = "search-button hide";
            $("#navsrhdiv")[0].className = "nav-button";
            break;
        }
        case "tothere":{
            posObj.className = "tab";
            fhObj.className = "tab";
            thObj.className = "tab selected";
            $("#startorend")[0].innerHTML = "起点";
            $("#poisrhbtn")[0].className = "search-button hide";
            $("#navsrhdiv")[0].className = "nav-button";
            break;
        }
    }

}

//	切换左边栏的窗体
function toChangeHead(oid) {
//			var titles=["hm_wikinav", "hm_classnav", "hm_favnav"];
    var titles=["hm_wikinav", "hm_classnav"];
    var infoClassObj = document.getElementById("hm_infoClass");
//			var favoritesObj = document.getElementById("hm_favorites");
    var wikiClassObj = document.getElementById("hm_wikiClass");

    for(var i = 0;i < titles.length; i++) {
        var title = titles[i];
        var preHeadObj = document.getElementById(title);
        var reg = new RegExp('(\\s|^)' + "active" + '(\\s|$)');
        preHeadObj.className = preHeadObj.className.replace(reg, ' ');
    }
    document.getElementById(oid).className += " active";
    document.getElementById("hm_mapInfo").style.display="block";
    document.getElementById("searchresults").style.display="none";
    switch(oid) {
        case "hm_classnav":{
            infoClassObj.style.display="block";
//					favoritesObj.style.display="none";
            document.getElementById("pathinfo1").style.display = "none";
            wikiClassObj.style.display="none";
            break;
        }
//				case "hm_favnav":{
//					infoClassObj.style.display="none";
//					favoritesObj.style.display="block";
//					document.getElementById("pathinfo1").style.display = "block";
//					wikiClassObj.style.display="none";
//					break;
//				}
        case "hm_wikinav":{
            infoClassObj.style.display="none";
//					favoritesObj.style.display="none";
            document.getElementById("pathinfo1").style.display = "none";
            wikiClassObj.style.display="block";
            break;
        }
    }
}

//	显示某大类的所有地名
function gotoBigType(bigtype) {
    var tmpdata = [];
    if(!bigtype) {
        tmpdata = placedata;
    }
    for (var i = 0; i < placedata.length; i++) {
        var data = placedata[i];
        if(data['大类'] == bigtype) {
            tmpdata.push(data);
        }
    }
    if(tmpdata.length > 0) {
        showingPlaces = tmpdata;
        setNewMarkers(tmpdata);
        setResultItems(tmpdata, "searchresults");
//				setResultItems(tmpdata, "pathinfo1");
    } else {
        if(bigtype) {
            alert("暂无 " + bigtype + " 相关数据...");
        } else {
            alert("暂无数据...");
        }
    }
}

//	显示某小类的所有地名
function gotoSmallType(bigtype, smalltype) {
    var tmpdata = [];
    for (var i = 0; i < placedata.length; i++) {
        var data = placedata[i];
        var flag = false;
        if(data['大类'] == bigtype && data['小类'] == smalltype) {
            tmpdata.push(data);
        }
    }
    if(tmpdata.length > 0) {
        showingPlaces = tmpdata;
        setNewMarkers(tmpdata);
        setResultItems(tmpdata, "searchresults");
//				setResultItems(tmpdata, "pathinfo1");
    } else {
        alert("暂无 " + bigtype +"-" + smalltype + " 相关数据...");
    }
}

//	显示某地区的所有地名
function gotoDist(dictcode) {

    var tmpdata = [];
    if(!dictcode) {
        tmpdata = placedata;
    }
    for (var i = 0; i < placedata.length; i++) {
        var data = placedata[i];
        var thiscode = data['dist'];
        if (distIn(thiscode, dictcode)) {
            tmpdata.push(data);
        }
    }
    if(tmpdata.length > 0) {
        showingPlaces = tmpdata;
        setNewMarkers(tmpdata);
        setResultItems(tmpdata, "searchresults");
//				setResultItems(tmpdata, "pathinfo1");
    } else {
        if(dictcode) {
            alert("暂无 " + dictcode + " 地区相关数据...");
        } else {
            alert("暂无数据...");
        }
    }
}

//	地图前往某一坐标点
function gotoPlace(posStr, name) {
    var pla;
    if(name) {
        pla = findPlaceByAttr("name", name);
        closeInfoWindow();
    }
    var xystr = posStr.split(",");
    var x = parseFloat(xystr[0]);
    var y = parseFloat(xystr[1]);
    var npos = [x, y];
    var zom = map.getZoom();
    if(zom < 16) {
        map.setZoom(16);
//				if(zom < 14) {
//					map.setZoom(14);
//				} else {
//					map.setZoom(zom + 1);
//				}
    }
    map.panTo(npos);
    if(pla) {
        openInfoWindow(pla);
    }
//			openInfoWindow(placedata);
}

//	地区代码是否位于某地区
function distIn(sub, par) {
    var i = 0;
    for(i = 0; i < sub.length; i++) {
        var c1 = sub.charCodeAt(i), c2 = par.charCodeAt(i);
        if(c1 != c2) {
            break;
        }
    }
    for( ;i < par.length; i++) {
        var c = par.charCodeAt(i);
        if(c != 48) {
            return false;
        }
    }
    return true;
}

//	新的点标注
function setNewMarkers(newdata) {
    while (markers.length > 0) {
        map.remove(markers);
        markers.pop();
    }
    closeInfoWindow();
//			for(var i = 0; i < newdata.length; i++) {
//				var data = newdata[i];
//				var marker;
//				marker = new AMap.Marker({
//					map: map,
//					position: data.position,
//					zIndex: 3,
//					extData: data,
//					title: data.name,
//					label: data.name.substring(0, 1),
//				});
//				AMap.event.addListener(marker, "click", mapFeatureClick);
//				markers.push(marker);
//			}
    showNarkers(newdata);
    map.setFitView();
}

//	在左边结果栏显示若干条结果，muldata为json
function setResultItems(muldata, divname) {

    var parentdiv = document.getElementById(divname);
    parentdiv.style.display="block";
    var prestr = "<div class='list-group'>", endstr = "</div>", midstr = "";
    for(var i = 0; i < muldata.length; i++) {
        var data = muldata[i];
        var str = consPlaceResult(data, i + 1);
        midstr += str;
    }
    var totalstr = prestr + midstr + endstr;
    parentdiv.innerHTML = totalstr;
}

//	在左边结果栏显示若干条结果，items为html
function setResultsInDiv(items, divname) {
    var parentdiv = document.getElementById(divname);
    parentdiv.style.display="block";
    var prestr = "<div class='list-group'>", endstr = "</div>", midstr = "";
    for(var i = 0; i < items.length; i++) {
        midstr += items[i];
    }
    var totalstr = prestr + midstr + endstr;
    parentdiv.innerHTML = totalstr;
}

//	产生左边结果栏的一条数据——名称，位置，起点/终点，最左序号，下方详情
function consResultItem(name, pos, type, order, content){
    var posstr = pos[0] +"," + pos[1];
    str = "<div class='list-group-item'" +"onclick=\"gotoPlace('"+ posstr + "', '" + name + "')\"" +
        "><div class='SearchResult_item_left' " +
        "><p><strong>" + order +
        "</strong></p></div><div class='SearchResult_item_content'>" +
        "<p><font color='#0B73EB'>" + name +
        "</font><span class='wikiTag'>" + type +
        "</span></p><p>" + content + "</p></div></div>";
    return str;
}

//	产生左边结果栏的一条数据，place为地点的json数据
function consPlaceResult(place, order) {
    return consResultItem(place.name, place.position, place['小类'], order, "地名代码：" + place['geonamecode']);
}

//	全部行政区域显示在左边栏相应位置
function setDists() {
    var wholetree = document.getElementById("tree1");
    var temp = document.getElementById("folder1");
    var inner1 = "<li class='collapsable'>";
    var inner2 = "</li>";
    var branches = $(inner1 + "<div class='hitarea collapsable-hitarea'></div>" +
        "<a href='#' onclick=\"gotoDist('420527000')\">秭归县</a><ul id='clist'></ul>" + inner2).appendTo("#folder1");
    var branchdom =$('#clist')[0];

    var subDistricts = distdata.children;
    for (var k = 0; k < subDistricts.length; k++) {	//	区县内各街道
        var street = subDistricts[k];
        var streetname = street.name;
        var streetnode = document.createElement("li");
        var streeta = document.createElement("a");
        streeta.setAttribute("href", "#");
        streeta.setAttribute("onclick", "gotoDist('" + street.id + "')");
        var streettext = document.createTextNode(streetname);
        streeta.appendChild(streettext);
        streetnode.appendChild(streeta);
        if(k == subDistricts.length - 1) {
            streetnode.className = "last";
        }
        branchdom.appendChild(streetnode);
    }

//			for (var i = 0; i < subDistricts.length; i++) {	//	省内各城市
//				var city = subDistricts[i];
//				var cityname = city.name;
//				var citynode = document.createElement("li");
//				var $cn = $(citynode);
//				if(i == subDistricts.length - 1) {
//					citynode.setAttribute("class", "last");
//				} else {
//					if(cityname == '秭归县') {
//						citynode.setAttribute("class", "collapsable");
//					} else {
//						citynode.setAttribute("class", "expandable");
//					}
//				}
////				citynode.setAttribute("class", "expandable");
//				var citydiv = document.createElement("div");
//				if(cityname == '秭归县') {
//					citydiv.setAttribute("class", "hitarea collapsable-hitarea");
//				} else {
//					citydiv.setAttribute("class", "hitarea expandable-hitarea");
//				}
//				var citya = document.createElement("a");
//				citya.setAttribute("href", "#");
////				citya.setAttribute("class", "");
//				citya.setAttribute("onclick", "gotoDist('" + city.id + "')");
//				var citytext = document.createTextNode(cityname);
//				citya.appendChild(citytext);
//				citynode.appendChild(citydiv);
//				citynode.appendChild(citya);
//				if (!city.children) {
//					branchdom.appendChild(citynode);
//					continue;
//				}
//				var countylist = document.createElement("ul");
//				if(cityname == '秭归县') {
//					countylist.setAttribute("style", "overflow: hidden;");
//				} else {
//					countylist.setAttribute("style", "display: none;");
//				}
//				for (var j = 0; j < city.children.length; j++) {//	城市内各区县
//					var county = city.children[j];
//					var countyname = county.name;
//					var countynode = document.createElement("li");
//					var countya = document.createElement("a");
//					countya.setAttribute("href", "#");
//					countya.setAttribute("onclick", "gotoDist('" + county.id + "')");
//					var countytext = document.createTextNode(countyname);
//					countya.appendChild(countytext);
//
//					if (county.children) {
//						if(j == city.children.length - 1) {
//							countynode.setAttribute("class", "last");
//						} else {
//							countynode.setAttribute("class", "expandable");
//						}
////						countynode.setAttribute("class", "expandable");
//						var countydiv = document.createElement("div");
//						countydiv.setAttribute("class", "hitarea expandable-hitarea");
//						countynode.appendChild(countydiv);
//						countynode.appendChild(countya);
////						var streetlist = document.createElement("ul");
////						streetlist.setAttribute("style", "display: none;");
////						for (var k = 0; k < county.subclasses.length; k++) {	//	区县内各街道
////							var street = county.subclasses[k];
////							var streetname = street.name;
////							var streetnode = document.createElement("li");
////							var streeta = document.createElement("a");
////							streeta.setAttribute("href", "#");
////							streeta.setAttribute("onclick", "gotoDist('" + street.id + "')");
////							var streettext = document.createTextNode(streetname);
////							streeta.appendChild(streettext);
////							streetnode.appendChild(streeta);
////							if(k == county.subclasses.length - 1) {
////								streetnode.className = "last";
////							}
////							streetlist.appendChild(streetnode);
////						}
////						countynode.appendChild(streetlist);
//					} else {
//						if(j == city.children.length - 1) {
//							countynode.setAttribute("class", "last");
//						}
//						countynode.appendChild(countya);
//					}
//					countylist.appendChild(countynode);
//				}
//				citynode.appendChild(countylist);
//				branchdom.appendChild(citynode);
//			}
    var htm = branches.html();
    wholetree.innerHTML = inner1 + htm + inner2;

    $("#tree1").treeview({
//				add: branches,
//				remove: branches,
        collapsed: true,
        animated: "fast",
        control:"#sidetreecontrol1",
        prerendered: true,
//				persist: "location"
    });
}

//	全部地名类型显示在左边栏相应位置
function setTypes() {
    var wholetree = document.getElementById("tree2");
    var temp = document.getElementById("folder2");
    var inner1 = "<li class='collapsable'>";
    var inner2 = "</li>";
    var branches = $(inner1 + "<div class='hitarea collapsable-hitarea'></div>" +
        "<a href='#' onclick='gotoBigType()'>所有分类</a><ul id='dlist'></ul>" + inner2).appendTo("#folder2");
    var branchdom =$('#dlist')[0];
    var subDistricts = typedata.subclasses;
    for (var i = 0; i < subDistricts.length; i += 1) {	//	省内各城市
        var city = subDistricts[i];
        var cityname = city.name;
        var citynode = document.createElement("li");
        var $cn = $(citynode);
//				if(i == subDistricts.length - 1) {
//					citynode.setAttribute("class", "last");
//				} else {
//					citynode.setAttribute("class", "expandable");
//				}
        citynode.setAttribute("class", "expandable");
        var citydiv = document.createElement("div");
        citydiv.setAttribute("class", "hitarea expandable-hitarea");
        var citya = document.createElement("a");
        citya.setAttribute("href", "#");
//				citya.setAttribute("class", "");
        citya.setAttribute("onclick", "gotoBigType('" + cityname + "')");
        var citytext = document.createTextNode(cityname);
        citya.appendChild(citytext);
        citynode.appendChild(citydiv);
        citynode.appendChild(citya);
        if (!city.subclasses) {
            branchdom.appendChild(citynode);
            continue;
        }
        var streetlist = document.createElement("ul");
        streetlist.setAttribute("style", "display: none;");
        for (var k = 0; k < city.subclasses.length; k++) {	//	区县内各街道
            var street = city.subclasses[k];
            var streetname = street.name;
            var streetnode = document.createElement("li");
            var streeta = document.createElement("a");
            streeta.setAttribute("href", "#");
            streeta.setAttribute("onclick", "gotoSmallType('"+cityname+"', '"+streetname+"')");
            var streettext = document.createTextNode(streetname);
            streeta.appendChild(streettext);
            streetnode.appendChild(streeta);
            if(k == city.subclasses.length - 1) {
                streetnode.className = "last";
            }
            streetlist.appendChild(streetnode);
        }
        citynode.appendChild(streetlist);
        branchdom.appendChild(citynode);
    }
    var htm = branches.html();
    wholetree.innerHTML = inner1 + htm + inner2;

    $("#tree2").treeview({
//				add: branches,
//				remove: branches,
        collapsed: true,
        animated: "fast",
        control:"#sidetreecontrol2",
        prerendered: true,
//				persist: "location"
    });
}

//	设置自动补全
function setAutoComplete() {
    infoWinDown = constructInfoDown();
    document.getElementById("hiddendiv").appendChild(infoWinDown);
    $("#winsrhword").focus().autocomplete(placedata, {
        minChars: 1,
        width: 100,
        matchCase: false,//不区分大小写
//				matchContains: "word",
//				autoFill: true,
        formatItem: function(row, i, max) {
            return row.name;
        },
        formatMatch: function(row, i, max) {
            return row.ChnSpell + row.name;
        },
        formatResult: function(row) {
            return row.name;
        },
        reasultSearch:function(row,v) {//本场数据自定义查询语法 注意这是我自己新加的事件
            //自定义在code或spell中匹配
            if(row.data.ChnSpell.indexOf(v) == 0 || row.data.name.indexOf(v) == 0) {
                return row;
            }
            else {
                return false;
            }
        }
    });
    $("#winsrhword").keydown(function(e) {
        if(e.keyCode != 13){
            return;
        }
        if(!entered) {
            entered = true;
            return;
        }
        var navTxt = $("#startorend")[0].innerText;
        entered = false;
        if(navTxt =="起点" || navTxt =="终点") {
            if(navMethod == "trans") {
                srhbus();
            } else if(navMethod == "drive") {
                srhdrive();
            } else if(navMethod == "walk") {
                srhwalk();
            }
        } else {
            srhpoi();
        }
    });
}

//	初始化所有点标注
function initmarkers(pdata) {
    if(pdata) {
        showingPlaces = pdata;
        showNarkers(pdata);
    } else {
        showingPlaces = placedata;
        showNarkers(placedata);
    }
}

//	显示一定量的点标注
function showNarkers(pdata) {
    for (var i = 0; i < pdata.length; i++) {
        var data = pdata[i];
        if (data.path) {
            var lineArr = JSON.parse(data.path);
            var polyline = new AMap.Polyline({
                map: map,
                zIndex: 95,
                extData: data,
                path: lineArr,          //设置线覆盖物路径
                strokeColor: "#3366FF", //线颜色
                strokeOpacity: 1,       //线透明度
                strokeWeight: 5,        //线宽
                strokeStyle: "solid",   //线样式
                strokeDasharray: [10, 5] //补充线样式
            });
//					AMap.event.addListener(polyline, "mouseover", markerHighlight);
//					AMap.event.addListener(polyline, "mouseout", markerMouseOut);
            AMap.event.addListener(polyline, "click", mapFeatureClick);
            markers.push(polyline);
        } else {
            var marker = new AMap.Marker({
                map: map,
                position: data.position,
                zIndex: 100,
                extData: data,
                title: data.name,
                label: data.name.substring(0, 1)
//						icon: "images/markers/common_marker.png",
            });
//					AMap.event.addListener(marker, "mouseover", markerHighlight);
//					AMap.event.addListener(marker, "mouseout", markerMouseOut);
            AMap.event.addListener(marker, "click", mapFeatureClick);
            markers.push(marker);
        }
    }
}

//	点击标注Marker时
function mapFeatureClick(e){
    openInfoWindow(e.target.getExtData());
}

$(function() {

    var wholepnurl = 'easyGeonames.action?zg=zg';

    $.ajax({
        url: wholepnurl,
        type: 'get',
        dataType: 'json',
        success: function (data) {
            placedata = data;

            map = new AMap.Map('mapContainer',{
                resizeEnable: true,
//						center: [109.461756,30.285877],
                zoom:level,
                keyboardEnable :false,
            });
            map.on('complete', function(){
                map.plugin(["AMap.ToolBar", "AMap.OverView", "AMap.Scale"], function(){
                    map.addControl(new AMap.ToolBar);
                    map.addControl(new AMap.OverView({isOpen: true}));
                    map.addControl(new AMap.Scale);
                });
            });

            showingPlaces = placedata;
            initmarkers();
            //	showNarkers(showingPlaces);
            map.setFitView();


        },
        error: function (data) {
            console.log(data);
        }
    })

    setDists();
    setTypes();
    setAutoComplete();

});
