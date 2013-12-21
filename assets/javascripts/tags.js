function Tagger(photoSpanId,rectDivId,formStartX,formStartY,formWidth, formHeight, submitID){
	//the forms...use these to manipulate form values
	this.formStartX = formStartX;
	this.formStartY = formStartY;
	this.formWidth = formWidth;
	this.formHeight = formHeight;

	//init the rectangle params
	this.startX =0;  //the initially clicked points
	this.startY=0;
	

	//the uppermost Y value and the leftmost X value determine the positional offset of the box
	this.originX=0;
	this.originY=0;

	//init width and height
	this.currHeight=0;
	this.currWidth=0;

	this.isMouseDown = false;

	//use this if you need the parent span for calculations
    this.photoSpanElement = document.getElementById(photoSpanId);
    
    //use this to manipulate the rectangle
    this.rectDivElement = document.getElementById(rectDivId);

    //use this to manipulate visibility of submission button
    this.submitElement = document.getElementById(submitID);

    var obj = this;  //refers to the handler object


    //click down behavior
    this.photoSpanElement.onmousedown = function(event) {
        obj.mouseDown(event);
    }

    //mouse move behavior while clicked
    document.body.onmousemove = function(event){
    	obj.mouseMove(event);
    }

}

Tagger.prototype.mouseDown = function(event){

	event.preventDefault();//prevents dragging of image (default behavior)
	var obj = this;  //will refer to the handler object


	//reinitialize the rectangle to nothing on every click
    obj.rectDivElement.style.top = 0;
    obj.rectDivElement.style.left = 0;
    obj.rectDivElement.style.width = 0;
    obj.rectDivElement.style.height = 0;


	//get coordinates
	var clickX=event.pageX;
	var clickY=event.pageY;

	//convert to relative coordinates...
	this.startX = obj.convertX(clickX,this.photoSpanElement);
	this.startY = obj.convertY(clickY,this.photoSpanElement);
	
	//anchor the rectangle at the click point.  CSS positioning will be absolute relative to its parent container?
	obj.rectDivElement.style.top = this.startY+"px";
	obj.rectDivElement.style.left = this.startX+"px";


	this.oldMoveHandler = document.body.onmousemove;//save the old body move handler, if any
	document.body.onmousemove = function(event){
		obj.mouseMove(event);
	}


	this.oldUpHandler = document.body.onmouseup;//save the old body up handler, if any
    document.body.onmouseup = function(event){
    	obj.mouseUp(event);
    }


	this.isMouseDown=true;

}

Tagger.prototype.mouseMove = function(event){
	var obj = this;
	if (!this.isMouseDown) {  //no actions if mouse is not down
        return;
    }

    //get coordinates
    var currX = event.pageX;
    var currY = event.pageY;

    //limit effective coordinates to edge of image's span
    if(currX < this.photoSpanElement.offsetLeft){
    	currX = this.photoSpanElement.offsetLeft;
    }
    else if(currX > (this.photoSpanElement.offsetLeft+this.photoSpanElement.clientWidth)){
    	currX = this.photoSpanElement.offsetLeft+this.photoSpanElement.clientWidth-2;  //-2 to compensate for rectangle border itself
    }

    if(currY < this.photoSpanElement.offsetTop){
    	currY = this.photoSpanElement.offsetTop;
    }
    else if(currY > (this.photoSpanElement.offsetTop+this.photoSpanElement.clientHeight)){
    	currY = this.photoSpanElement.offsetTop+this.photoSpanElement.clientHeight-2;
    }

    //convert to relative coordinates...
	var relativeX = obj.convertX(currX,this.photoSpanElement);
	var relativeY = obj.convertY(currY,this.photoSpanElement);

	//calculate width and height from start point(abs value)
	this.currWidth = Math.abs(relativeX - this.startX);
	this.currHeight = Math.abs(relativeY-this.startY);

	//figure out what the upperleft most point would be
	this.originX = Math.min(this.startX, relativeX);
	this.originY = Math.min(this.startY, relativeY);



    //keep resizing the rectangle!
    obj.rectDivElement.style.top = this.originY+"px";
    obj.rectDivElement.style.left = this.originX+"px";
    obj.rectDivElement.style.width = this.currWidth+"px";
    obj.rectDivElement.style.height = this.currHeight+"px";

}


Tagger.prototype.mouseUp = function(event){
	var obj=this;
	obj.isMouseDown = false;

	//finalize the origin coordinates & width/height, fill in the given form elements with those values
	obj.formStartX.value= obj.originX;
	obj.formStartY.value= obj.originY;
	obj.formWidth.value=obj.currWidth;
	obj.formHeight.value=obj.currHeight;


	//make submission visible once a rect has been drawn
	this.submitElement.style.visibility = "visible";

	//restore the old move handlers and up handlers
	document.body.onmousemove = obj.oldMoveHandler;
	document.body.onmouseup = obj.oldUpHandler;
}

Tagger.prototype.convertX = function(pageXval,photoSpanElement){
	var photoSpanX = photoSpanElement.offsetLeft;
	return pageXval-photoSpanX;
}

Tagger.prototype.convertY = function(pageYval,photoSpanElement){
	var photoSpanY = photoSpanElement.offsetTop;
	return pageYval-photoSpanY;
}




function ShowTag(){ //only need 1 per page. 
	var obj = this;  //will refer to the handler object
	this.showTagElement = document.getElementById("showTagDiv");  //the encapsulating div for the picture

	this.showTagElement.onmousemove = function(event){  //don't need bodywide onmousemove
		obj.mouseMove(event);
	}

	//use this to output the name of whoever is being pointed at (may be multiple)
	this.outputDivElement = document.getElementById("names");
}


//ShowTag class deals with showing the tag names on mouseover (separate page)
ShowTag.prototype.mouseMove = function(event){
	var obj = this;  //will refer to the handler object
	

	obj.outputDivElement.innerHTML="&nbsp";  //clear the output every time we move the mouse

	//get coordinates
	var currX=event.pageX;
	var currY=event.pageY;


	//convert to relative coordinates...
	var relativeX = obj.convertX(currX,this.showTagElement);
	var relativeY = obj.convertY(currY,this.showTagElement);
	
	this.rect = this.showTagElement.firstChild.nextSibling;  //get the first rectangle (sib of the photo)
	while(obj.rect!=obj.rect.parentNode.lastChild){
		if(obj.rect.tagName == "DIV"){  //need this because blank space is considered a sibling element too

			var rectX = obj.rect.offsetLeft;
			var rectY = obj.rect.offsetTop;
			var rectW = obj.rect.offsetWidth;
			var rectH = obj.rect.offsetHeight;

			//concatenate the output string with names of those in the tag rect (name is stored in the id)
			if(obj.withinRect(relativeX,relativeY,rectX,rectY,rectW,rectH)){
				var safeString = obj.htmlEncode(obj.rect.title);
				obj.outputDivElement.innerHTML +=safeString+"&nbsp &nbsp &nbsp";  //separate them with whitespace
			}		
		}
		obj.rect = obj.rect.nextSibling;
		
	}
}

ShowTag.prototype.htmlEncode = function(s)  //helper function to make an html escaped version of a js string
{
  var el = document.createElement("div");
  el.innerText = el.textContent = s;
  s = el.innerHTML;
  return s;
}

ShowTag.prototype.withinRect = function(mouseX,mouseY,rectX,rectY,rectW,rectH){
	var isWithinX = (mouseX<(rectX+rectW)) && (mouseX>rectX);
	var isWithinY = (mouseY<(rectY+rectH)) && (mouseY>rectY);
	return isWithinX && isWithinY;

}

ShowTag.prototype.convertX = function(pageXval,photoSpanElement){
	var photoSpanX = photoSpanElement.offsetLeft;
	return pageXval-photoSpanX;
}

ShowTag.prototype.convertY = function(pageYval,photoSpanElement){
	var photoSpanY = photoSpanElement.offsetTop;
	return pageYval-photoSpanY;
}


//instantiate one of each class!
if(document.getElementById("showTagDiv")!=null){
	var showTagger = new ShowTag(); //not all tag-controller based pages need this
}



if(document.getElementById("newTagParentDiv")!=null){ //not all tag-controller pages need this
	var xForm = document.getElementById("startX");
	var yForm = document.getElementById("startY");
	var wForm = document.getElementById("formWidth");
	var hForm = document.getElementById("formHeight");
	var newTagger = new Tagger("newTagParentDiv","newTagRectDiv",xForm,yForm,wForm,hForm,"submission");
}


