// stuff for finding objects in different browsers or whatever
var aDOM = 0, ieDOM = 0, nsDOM = 0; var stdDOM = document.getElementById;

	if (stdDOM)
		aDOM = 1;
	else
	{
		ieDOM = document.all;
		if (ieDOM)
			aDOM = 1;
		else
		{
			var nsDOM = ((navigator.appName.indexOf('Netscape') != -1) && (parseInt(navigator.appVersion) ==4));
			if (nsDOM)
				aDOM = 1;
		}
	}

	function findDOM(objectId, wS)
	{
		if (stdDOM) return wS ? document.getElementById(objectId).style:document.getElementById(objectId);
		if (ieDOM) return wS ? document.all[objectId].style: document.all[objectId];
		if (nsDOM) return document.layers[objectId];
	}

	function pageWidth()
	{
		if(window.innerWidth==null)
		{
			return document.body.clientWidth;
		}
		else
			return window.innerWidth;
	}

    function pageHeight()
	{
		if(window.innerHeight==null)
		{
			return document.body.clientHeight;
		}
		else
			return window.innerHeight;
	}

	var objStyle = null;
	var titleY=-302;
    var titleDY=0;
    var clouds=new Array();
    var boxObj=null;
    var scrnObj=null;
    var scrn2Obj=null;

	function moveTitle()
	{
        titleDY+=0.25;
        titleY+=titleDY*5;
        if(titleY>-10)
        {
            titleY=-10;
            titleDY=-titleDY*0.6;
            if(titleDY>-1)
                titleDY=0;
        }

		objStyle.top=titleY+'px';
        boxObj.top=262+"px";
        boxObj.left=((pageWidth()-660)/2)+"px";
        scrnObj.top=boxObj.top;
        scrnObj.left=((pageWidth()-660)/2-180)+"px";
        scrn2Obj.top=boxObj.top;
        scrn2Obj.left=((pageWidth()-660)/2+660+20)+"px";
	}

    function putTitle()
    {
        titleY=-10;
        titleDY=0;
        moveTitle();
    }

    function resetCloud(cloud,firstTime)
    {
        var pw=pageWidth();
        var ph=pageHeight();
        if(firstTime)
            cloud["x"]=Math.floor((Math.random()*pw)+1);
        else
            cloud["x"]=pw+Math.floor((Math.random()*(pw/2))+1);
        cloud["y"]=-100+Math.floor((Math.random()*(ph*3/4))+1);
        cloud["dist"]=Math.random()*0.75+0.25;
        cloud["obj"].zIndex=-10-Math.floor((1-cloud["dist"])*10);
        cloud["obj"].width=Math.floor(cloud["dist"]*197)+"px";
        cloud["obj"].height=Math.floor(cloud["dist"]*111)+"px";
    }

    function moveCloud(cloud)
    {
        cloud["x"]-=cloud["dist"]*5;
        if(cloud["x"]<-197)
        {
            resetCloud(cloud,false);
        }
        cloud["obj"].left=cloud["x"]+'px';
        cloud["obj"].top=cloud["y"]+'px';
    }

    function moveAllClouds()
    {
        for(var i=0;i<clouds.length;i++)
        {
            moveCloud(clouds[i]);
        }
    }

    function cloudGo(obj)
    {
        if(aDOM)
        {
            var c=new Array();
            c["obj"]=findDOM(obj,1);
            c["x"]=0;
            c["y"]=0;
            c["dist"]=1;
            clouds[clouds.length]=c;
            resetCloud(c,true);
            moveCloud(c);
        }
    }

	function titleGo(objectID,mobile)
	{
		if (aDOM)
		{
	 		objStyle = findDOM(objectID,1);
            boxObj=findDOM("mainbox",1);
            scrnObj=findDOM("screens",1);
            scrn2Obj=findDOM("screens2",1);
            setInterval('moveTitle();',50);
       		if(!mobile)
			{
                setInterval('moveAllClouds();',50);
            }
            else
                putTitle();
		}
	}

    function simplerGo(mobile)
    {
        if(!mobile)
            setInterval('moveAllClouds();',50);
    }