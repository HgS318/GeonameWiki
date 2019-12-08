

function getQueryString(name) {
    var result = location.search.match(new RegExp("[\?\&]" + name + "=([^\&]+)", "i"));
    if (result == null || result.length < 1) {
        return "";
    }
    return decodeURIComponent(result[1]);
}

function searchWord() {
    var srhname = document.getElementById("name0").value;
    if(srhname && "" != srhname) {
        // if(data && data.name && data.name == srhname) {
        //     return;
        // }
        var newurl = "wikiContent_fitall.html?name=" + srhname;
        window.open(newurl);
    }
}

function srchkeypress(e) {
    var keynum = window.event ? e.keyCode : e.which;
    if(13 == keynum) {
        searchWord();
    }
}

function getBigTypeFromSmall(smallType) {
    var types = typedata.subclasses;
    for(var i = 0; i < types.length; i++) {
        var type = types[i];
        var subTypes = type['subclasses'];
        for(var j = 0; j < subTypes.length; j++) {
            var _stype =subTypes[j];
            if(smallType == _stype['name']) {
                return type['name'];
            }
        }
    }
    return "";
}

// function checkImgExists(imgurl) {
//     var ImgObj = new Image();
//     ImgObj.src = imgurl;
//     if (ImgObj.fileSize > 0 || (ImgObj.width > 0 && ImgObj.height > 0)) {
//         return true;
//     } else {
//         return false;
//     }
// }

function validateImage(url)
{
    var xmlHttp;
    if (window.ActiveXObject) {
        xmlHttp = new ActiveXObject("Microsoft.XMLHTTP");
    } else if (window.XMLHttpRequest) {
        xmlHttp = new XMLHttpRequest();
    }
    xmlHttp.open("Get",url,false);
    xmlHttp.send();
    if(xmlHttp.status==404) {
        return false;
    }
    else {
        return true;
    }
}
