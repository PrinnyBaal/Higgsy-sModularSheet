
sheetProj.view.sheetLogic = {
  setupUserInterface: function () {
      loadSheet();
      setClicks();
      displayBible();
      updateFinalMods();

      if (!JSON.parse(localStorage.getItem("tutorialSkip"))){
        runTutorial();
      }

    }
};

function setClicks(){
  $(".collapseButton").click(collapseParent);
  $(".tabHead").click(collapseTabBody);
}

function collapseTabBody(event){
  // $(event.currentTarget.nextElementSibling).toggleClass("invisible");
  $(event.currentTarget.nextElementSibling).toggleClass("noHeight");
}



function loadSheet(){
  let savedChars=JSON.parse(localStorage.getItem("savedChars"));
  let activeChar=JSON.parse(localStorage.getItem("activeChar"));
  let chara=savedChars[activeChar];
  let sheet=chara.charSheets[chara.activeSheet];

  let styleBible=JSON.parse(localStorage.getItem("styleBible"));

  for (var key in sheet.draggables){
    let elem=sheet.draggables[key];

    $("#htmlPalette").html(styleBible[elem.bibleRef].html);
    $("#temporary").css({ 'left': `${elem.left}`, 'top': `${elem.top}`,'width': `${elem.width}`, 'height': `${elem.height}`});

    if (elem.locked){
      $("#temporary").addClass("locked");
    }
    if (elem.activeRules.indexOf("abilityScore")>-1){
      $("#temporary").addClass("abilityScore");
    }
    if (elem.activeRules.indexOf("classSkill")>-1){
      $("#temporary").addClass("classSkill");
    }
    $("#temporary").find(".boxTitle").val(`${elem.name}`);
    $("#temporary").find(".label").val(`${elem.name}`);
    $("#temporary").find(".testInput").val(`${elem.value}`);
    $("#temporary").find(".baseInput").val(`${elem.value}`);
    $("#temporary").find(".finalMod").val(`${elem.finalMod}`);


    $("#temporary").prop('id', `${elem.id}`);
    spawnBox($("#htmlPalette").children());
    $("#htmlPalette").empty();
  }

}

function saveActivePage(){
  let savedChars=JSON.parse(localStorage.getItem("savedChars"));
  let activeChar=JSON.parse(localStorage.getItem("activeChar"));
  let chara=savedChars[activeChar];
  let sheet=chara.charSheets[chara.activeSheet];
  let divsToSave=$(".draggable");

  let currDrag;
  let currDiv;
  for (var i=0;i<divsToSave.length;i++){
    currDiv=divsToSave[i];
    currDrag=sheet.draggables[currDiv.id];
    currDrag.locked=$(currDiv).hasClass("locked");
    currDrag.height=currDiv.style.height;
    currDrag.width=currDiv.style.width;
    currDrag.top=currDiv.style.top;
    currDrag.left=currDiv.style.left;
  }
  localStorage.setItem("savedChars", JSON.stringify(savedChars));
}

function collapseParent(e){
  $(e.target.parentElement).toggleClass("collapsed");
}



function spawnBox(child){
  $("#activeSheet").append(child);
  setDrag($("#activeSheet").find(`#${child[0].id}`)[0]);
  $(`#${child[0].id}`).on("click", displayInfo);
}

function stripToID(string){
  string=string.replace( /\D/g,"");
  return string
}

function newBox(event){


  let savedChars=JSON.parse(localStorage.getItem("savedChars"));
  let activeChar=JSON.parse(localStorage.getItem("activeChar"));
  let chara=savedChars[activeChar];
  let sheet=chara.charSheets[chara.activeSheet];
  let styleBible=JSON.parse(localStorage.getItem("styleBible"));
  let elem;

  let newDraggable={
        "id":`${newID(sheet.draggables)}`,
        "name":"Title",
        "uiName":"Unnamed",
        "value":"",
        "finalAblScore":0,
        "finalMod":0,
        "drawsFrom":[],
        "activeRules":[],
        "height":"100px",
        "width":"100px",
        "top":"50%",
        "left":"50%",
        "locked":false,
        "bibleRef":`${stripToID(event.currentTarget.id)}`
      };

  sheet.draggables[newDraggable.id]=JSON.parse(JSON.stringify(newDraggable));

  elem=sheet.draggables[newDraggable.id];

  $("#htmlPalette").html(styleBible[elem.bibleRef].html);
  $("#temporary").attr('height', `${elem.height}`);
  $("#temporary").attr('width', `${elem.width}`);
  $("#temporary").prop('top', `${elem.top}`);
  $("#temporary").prop('left', `${elem.left}`);
  $("#temporary").prop('id', `${elem.id}`);


  spawnBox($("#htmlPalette").children());
  $("#htmlPalette").empty();
  localStorage.setItem("savedChars", JSON.stringify(savedChars));


}

function newID(objList){
  let ids=[];
  let newID=0;

  for (var key in objList){
    ids.push(parseInt(objList[key].id));
  }
  ids.sort((a, b) => (a - b));

  for (let i=0;i<ids.length;i++){
    if (!i==ids[i]){
      newID=i;
      break;
    }
    if (i==ids.length-1){
      newID=i+1;
    }
  }
  return newID;
}

function displayBible(){
let styleBible=JSON.parse(localStorage.getItem("styleBible"));
let numList=[];

for (var key in styleBible){
  numList.push(styleBible[key].id);
}
nextInBible(numList);

function nextInBible(nextArray){

  let num=nextArray.shift();
  $("#htmlPalette").empty();
  $("#htmlPalette").html(styleBible[num].html);
  $("#temporary").prop('height', `50`);
  $("#temporary").prop('width', `50`);
  html2canvas(document.querySelector("#temporary")).then(canvas => {
      addToPalette(canvas, num);
      $("#htmlPalette").empty();
      if (nextArray.length){nextInBible(nextArray);}
    });

  }

}


function addToPalette(canvas, num){
  let dataURL = canvas.toDataURL();
  let paletteSlot=`<div id="paletteID${num}"class="col-4 imgSlot" style="background-image: url('${dataURL}')"></div>`;
  $("#spawnPalette").append(paletteSlot);
  $(`#paletteID${num}`).click(newBox);
}

function findByID(objList, id){
  let foundObj=false;
  for (var key in objList){
    if (id==objList[key].id){
      foundObj=objList[key];
      break;
    }
  }
  return foundObj;
}

function lockDraggable(e){

  $(e.currentTarget).toggleClass("locked");
}

function changeTitle(event){
  let savedChars=JSON.parse(localStorage.getItem("savedChars"));
  let activeChar=JSON.parse(localStorage.getItem("activeChar"));
  let chara=savedChars[activeChar];
  let sheet=chara.charSheets[chara.activeSheet];
  let draggable=findByID(sheet.draggables, event.parentElement.id);
  draggable.name=event.value;
  localStorage.setItem("savedChars", JSON.stringify(savedChars));
}

function changeValue(event){
  let savedChars=JSON.parse(localStorage.getItem("savedChars"));
  let activeChar=JSON.parse(localStorage.getItem("activeChar"));
  let chara=savedChars[activeChar];
  let sheet=chara.charSheets[chara.activeSheet];

  let draggable=findByID(sheet.draggables, event.parentElement.id);

  draggable.value=event.value;
  localStorage.setItem("savedChars", JSON.stringify(savedChars));

  updateFinalMods();
}

function changeDrawRatio(event){
  let savedChars=JSON.parse(localStorage.getItem("savedChars"));
  let activeChar=JSON.parse(localStorage.getItem("activeChar"));
  let chara=savedChars[activeChar];
  let sheet=chara.charSheets[chara.activeSheet];

  let draggable=findByID(sheet.draggables, stripToID($(event).closest('table')[0].id));

  draggable=setDrawRatio(draggable, stripToID(event.id), event.value);
  localStorage.setItem("savedChars", JSON.stringify(savedChars));

  updateFinalMods();
}

function changeRule(event){
  let savedChars=JSON.parse(localStorage.getItem("savedChars"));
  let activeChar=JSON.parse(localStorage.getItem("activeChar"));
  let chara=savedChars[activeChar];
  let sheet=chara.charSheets[chara.activeSheet];
  let rules=sheet.rules;

  let ruleID=stripToID(event.parentElement.id);
  let targetRule=findByID(rules, ruleID);
  let draggableID=$("#selectedDraggable")[0].value;
  let checked=event.checked;

  let draggable=findByID(sheet.draggables, draggableID);
  if (checked){
    draggable.activeRules.push(targetRule.label);
    $(`#${draggableID}`).addClass(targetRule.label);
  }
  else{
    let index = draggable.activeRules.indexOf(targetRule.label);
    if (index !== -1){
      draggable.activeRules.splice(index, 1);
      }
    $(`#${draggableID}`).removeClass(targetRule.label);
  }
  localStorage.setItem("savedChars", JSON.stringify(savedChars));

  updateFinalMods();
}

function changeUIName(event){

  let savedChars=JSON.parse(localStorage.getItem("savedChars"));
  let activeChar=JSON.parse(localStorage.getItem("activeChar"));
  let chara=savedChars[activeChar];
  let sheet=chara.charSheets[chara.activeSheet];

  let draggableID=$("#selectedDraggable")[0].value;

  let draggable=findByID(sheet.draggables, draggableID);
  draggable.uiName=event.target.value;


  localStorage.setItem("savedChars", JSON.stringify(savedChars));
}

function changeDescription(event){

  let savedChars=JSON.parse(localStorage.getItem("savedChars"));
  let activeChar=JSON.parse(localStorage.getItem("activeChar"));
  let chara=savedChars[activeChar];
  let sheet=chara.charSheets[chara.activeSheet];

  let draggableID=$("#selectedDraggable")[0].value;

  let draggable=findByID(sheet.draggables, draggableID);
  draggable.description=event.target.value;


  localStorage.setItem("savedChars", JSON.stringify(savedChars));
}

function displayInfo(event){
  let savedChars=JSON.parse(localStorage.getItem("savedChars"));
  let activeChar=JSON.parse(localStorage.getItem("activeChar"));
  let chara=savedChars[activeChar];
  let sheet=chara.charSheets[chara.activeSheet];
  let rules=sheet.rules;

  let dragID=event.currentTarget.id;
  let draggable=findByID(sheet.draggables, dragID);
  // $("#selectedDraggable").attr("value", dragID);

  let displayedRules=``;
  let checkStatus;
  for (var key in sheet.rules){
    if (draggable.activeRules.indexOf(sheet.rules[key].label)>-1){
      checkStatus="checked";
    }
    else{checkStatus=""}
    displayedRules+=`<div class="rule">
      <label id="rule${sheet.rules[key].id}" style="font-size:"1.25em"><input type="checkbox" onchange="changeRule(this)" ${checkStatus} >&nbsp;&nbsp;<i>${sheet.rules[key].name}</i></label>
      <p>Description: ${sheet.rules[key].description}</p>
    </div>`;
  }


  let newInfo=`
  <input class="invisible" id="selectedDraggable" value="${dragID}">
  <label for="draggableUIName" style="font-size:1.5em; font-weight:bold;">Draggable Name:</label>
  <input id="draggableUIName" onchange="changeUIName(event)" value="${draggable.uiName}">
  <p><b>Draggable Description:</b> ${draggable.description}</p>
  <label for="draggableDescription" style="font-weight:italic;">Input new Description:</label>
  <input id="draggableDescription" onchange="changeDescription(event)" value="${draggable.description}">

  <div id="draggableDraws">
  </div>
  <div id="draggableRules" class="mt-2">
    ${displayedRules}
  </div>
  <button onclick="deleteDraggable()" style="background-color:red">Delete</button>`;


  $("#draggableInfo").html(newInfo);
}

function bubbleReceptiveDivs(){
  let receptiveDivs=$(".finalMod").parent();


  $.each(receptiveDivs, function( key, div ) {
    $(div).toggleClass("layer4");
      });
}

function bubbleSenderDivs(receiverID){
  let senderDivs=$(".baseInput").parent();



  $.each(senderDivs, function( key, div ) {
    $(div).toggleClass("layer4");

    if (checkForRelationship(div.id, receiverID)){
      $(div).toggleClass("bannedBorder");
    }
      });
}

function highlightSendingDivs(senders){
  for (let i=0; i<senders.length;i++){
    $(`#${senders[i][0]}`).addClass("sourceBorder");
  }
}

function stripBorders(){
  $(".sourceBorder").removeClass("sourceBorder");
  $(".receiverBorder").removeClass("receiverBorder");
  $(".bannedBorder").removeClass("bannedBorder");
}

function popBubbles(){
  $(".layer4").removeClass("layer4");
  $(".layer3").removeClass("layer3");
  $(".layer2").removeClass("layer2");
  $(".layer1").removeClass("layer1");
  $(".layer0").removeClass("layer0");
}



function deleteDraggable(){
  let savedChars=JSON.parse(localStorage.getItem("savedChars"));
  let activeChar=JSON.parse(localStorage.getItem("activeChar"));
  let chara=savedChars[activeChar];
  let sheet=chara.charSheets[chara.activeSheet];

  let draggableID=$("#selectedDraggable")[0].value;
  $(`#${draggableID}`).remove();
  $("#draggableInfo").empty();
  delete sheet.draggables[draggableID];


  localStorage.setItem("savedChars", JSON.stringify(savedChars));
}

function setDrag(elem){
  dragElement(elem);
  $(elem).off("dblclick", lockDraggable);
  $(elem).on("dblclick",lockDraggable);
  $(elem).off("click", drawSelect);
  $(elem).on("click",drawSelect);
}

function printSheet(){
  $("#printOverlay").toggleClass("invisible");


html2canvas(document.querySelector("#activeSheet")).then(canvas => {
    $("#printScreen").html(canvas);

});
}

function toggleCredits(){
    $("#creditsOverlay").toggleClass("invisible");
}

function clearSheet(){
  if (window.confirm("Do you really want to delete all your currently saved draggables?")) {
    let savedChars=JSON.parse(localStorage.getItem("savedChars"));
    let activeChar=JSON.parse(localStorage.getItem("activeChar"));
    let chara=savedChars[activeChar];
    let sheet=chara.charSheets[chara.activeSheet];
    sheet.draggables={};
    localStorage.setItem("savedChars", JSON.stringify(savedChars));

  location.reload();
}
}

function getJSON(){
  let savedChars=JSON.parse(localStorage.getItem("savedChars"));
  let activeChar=JSON.parse(localStorage.getItem("activeChar"));
  let chara=savedChars[activeChar];
  let sheet=chara.charSheets[chara.activeSheet];


  newHint(JSON.stringify(sheet));
}

function toggleDrawOverlay(){
  let targetSelected=false;
  localStorage.setItem("targetSelected", JSON.stringify(targetSelected));

  $("#drawOverlay").toggleClass("invisible");
  $("#drawDisplay").toggleClass("layer4");
  if ($("#drawOverlay").hasClass("invisible")){
    newHint("Double click a draggable to lock/unlock it.  When unlocked you can drag it around the sheet or tug at its bottom/right border to resize it.  Want to add a new draggable?  Just click one of the options from the box on the right labeled 'Draggable Palette'");
    popBubbles();
    stripBorders();
    $("#drawBody").html(`<table style="width:100%"><tr><td colspan=2 align="center"><button onclick="toggleDrawOverlay()">Toggle Relationship View</button></td></tr></table>`);

  }
  else{
    newHint("Some draggables can update their final values by referencing the value of other draggables.  I've highlighted the ones capable of this, pick one now to edit its references.");
    bubbleReceptiveDivs();
  }

}

function drawSelect(e){
  if ($("#drawOverlay").hasClass("invisible")){
    return;
  }

  e = e || window.event;
  e.preventDefault();
  let targetSelected=JSON.parse(localStorage.getItem("targetSelected"));
  let targetID;
  let targetElem;
  let savedChars=JSON.parse(localStorage.getItem("savedChars"));
  let activeChar=JSON.parse(localStorage.getItem("activeChar"));
  let chara=savedChars[activeChar];
  let sheet=chara.charSheets[chara.activeSheet];
  let draggables=sheet.draggables;

  //when a target node has been selected
  if (!isNaN(targetSelected) && targetSelected!==false){
    if ($(e.target).hasClass("draggable")){
      targetElem=e.target;
    }
    else{
      targetElem=e.target.parentNode;
    }

    if (targetElem.id==localStorage.getItem("targetSelected")){
      popBubbles();
      stripBorders();
      bubbleReceptiveDivs();
      $("#drawDisplay").addClass("layer4");
      localStorage.setItem("targetSelected", false);
      newHint("What's the difference between draggables that can or can't be selected in this phase?  It's the grey box. No use dynamically updating a value that won't be displayed, ya know?");
    }


    else{
      toggleSender(targetElem);

    }
  }
  //when a target node has NOT been selected
  else{
    if ($(e.target).hasClass("draggable")){
      targetElem=e.target;
    }
    else{
      targetElem=e.target.parentNode;
    }


    targetID=targetElem.id;
    popBubbles();
    bubbleSenderDivs(targetID);
    highlightSendingDivs(draggables[targetID].drawsFrom);
    $("#drawDisplay").addClass("layer4");
    $(targetElem).addClass("receiverBorder");
    $(targetElem).addClass("layer4");
    localStorage.setItem("targetSelected", targetID);
    insertDrawSlots(draggables[targetID].drawsFrom);
      newHint("Gold border=selected.\nNo border=selectable.\nGreen Border=already selected.\nRed Border=will cause an error if selected since it's already basing ITS value on your selected draggable.");
  }

  function insertDrawSlots(drawSources){
    let drawSlots=``;

    for (let i=0; i<drawSources.length; i++){
      drawSlots+=`<tr>
        <td>${draggables[drawSources[i][0]].uiName}</td><td><input id="drawSource${drawSources[i][0]}" type="number" onchange="changeDrawRatio(this)" value="${drawSources[i][1]}"></td>
      </tr>`;
    }
    let drawHTML=
    `<table style="width:100%" id="drawTable${targetID}">
        <tr>
          <td colspan=2 align="center"><button onclick="toggleDrawOverlay()">Toggle Relationship View</button></td>
        </tr>
        <tr>
          <th>Source Name</th><th>Relationship Strength</th>
        </tr>
        <tr>
          <td colspan=2><hr></td>
        </tr>
        ${drawSlots}
        <tr>
          <td colspan=2><hr></td>
        </tr>
    </table>`;

    $("#drawBody").html(drawHTML);
  }

  function toggleSender(target){
    let selected=JSON.parse(localStorage.getItem("targetSelected"));
    sourceID=stripToID(target.id);

    //deselecting
    if ($(target).hasClass("sourceBorder")){
      draggables[selected]=removeDraw(draggables[selected], sourceID);
    }
    else if ($(target).hasClass("bannedBorder")){
      alert("You cannot choose this draggable as doing so would cause an infinite loop.  If you believe that you received this error in ..erm...error please send me a message (contact info in credits tab) and I'll be happy to look into it for you.");
      return;
    }
    //selecting
    else{
      draggables[selected].drawsFrom.push([sourceID,1]);
    }

    newHint("Check out the box beneath me now.  Did you see how it updated itself to reflect the draggable you selected/deselected to be in your gold-bordered draggables references?  The number you see next to the name reflects the *strength* of the relationship.")
    $(target).toggleClass("sourceBorder");
    localStorage.setItem("savedChars", JSON.stringify(savedChars));
    insertDrawSlots(draggables[selected].drawsFrom);
    updateFinalMods();
  }

}

function removeDraw(draggable, id){
  let drawList=draggable.drawsFrom;

  for (let i=0; i<drawList.length; i++){
    if (id==drawList[i][0]){
      drawList.splice(i, 1);
      break;
    }
  }
  return draggable;
}

function setDrawRatio(draggable,id, newRatio){
  let drawList=draggable.drawsFrom;

  for (let i=0; i<drawList.length; i++){
    if (id==drawList[i][0]){
      drawList[i][1]=newRatio;
      break;
    }
  }
  return draggable;
}

function closeParentOverlay(event){
  $(event.target.parentNode).toggleClass("invisible");
}

function updateFinalMods(){
  let savedChars=JSON.parse(localStorage.getItem("savedChars"));
  let activeChar=JSON.parse(localStorage.getItem("activeChar"));
  let chara=savedChars[activeChar];
  let sheet=chara.charSheets[chara.activeSheet];
  let draggables=sheet.draggables;

  for (let key in draggables){
    if ($(`#${draggables[key].id}`).hasClass("abilityScore")){
      draggables[key].finalAblScore=getDrawnMod(draggables[key])+parseInt(draggables[key].value);
      draggables[key].finalMod=Math.floor(draggables[key].finalAblScore/2)-5;
    }
    else{
      draggables[key].finalMod=getDrawnMod(draggables[key])+parseInt(draggables[key].value);
    }
    if($(`#${draggables[key].id}`).find(".finalMod")[0]){
      $(`#${draggables[key].id}`).find(".finalMod")[0].value=draggables[key].finalMod;
    }

  }

  localStorage.setItem("savedChars", JSON.stringify(savedChars));
}

function getDrawnMod(object, skipList){

  let savedChars=JSON.parse(localStorage.getItem("savedChars"));
  let activeChar=JSON.parse(localStorage.getItem("activeChar"));
  let chara=savedChars[activeChar];
  let sheet=chara.charSheets[chara.activeSheet];
  let draggables=sheet.draggables;

  if (!skipList){
    skipList=[];
  }

  let totalMod=0;

  object.drawsFrom.forEach(function(source){

    let sourceObj=draggables[source[0]];
    if (skipList.indexOf(sourceObj.id)>-1){
      alert(`Hey there, this is a message from Higgsy's Charsheet.  There seems to be an infinite loop going on involving draggable: "${sourceObj.uiName}".  This likely means that its been set to draw from another draggable that, somewhere down the line, draws from the original draggable again.  If you got this message it's likely a bug since we're supposed to prevent these loops from happening in the first place so please let me know (contact info in credits) and I'll get it fixed asap.  For now I've short-circuited the loop but this may have jumbled some of the math on your sheet.  This error will likely pop up at least one additional tme with the name of the draggable it's looping with.  Sorry about this, please don't tell Higgsy.  `);
      return totalMod;
    }

    let drawnAmount=0;
    //check if sourceObj has to draw from anything itself.
    if(sourceObj.drawsFrom.length>0 && !isNaN(sourceObj.value)){
      skipList.push(object.id);
      sourceObj.finalMod=sourceObj.value+getDrawnMod(sourceObj, skipList);
    }
    else{
      sourceObj.finalMod=sourceObj.value;
    }

    drawnAmount=(sourceObj.finalMod*source[1]);

    if (sourceObj.activeRules.indexOf("abilityScore")>-1){
      drawnAmount=Math.floor(drawnAmount/2)-5;
      //this is because while we store the final mod of ability scores as the raw number the actual modifier they offer is a bit odd in pathfinder.  10-11 is neutral, 12-13 is +1, 8-9 is -1, 6-7 is -2 and so and and so forth.
    }



    totalMod+=drawnAmount;
  });


  if (object.value>0  && object.activeRules.indexOf("classSkill")>-1 ){

    totalMod+=3;
    //this is because class skills in pathfinder offer a +3 if at least one rank is applied to it
  }

  return totalMod;

}

function checkForRelationship(prospect, selfID){
  let savedChars=JSON.parse(localStorage.getItem("savedChars"));
  let activeChar=JSON.parse(localStorage.getItem("activeChar"));
  let chara=savedChars[activeChar];
  let sheet=chara.charSheets[chara.activeSheet];
  let draggables=sheet.draggables;
  let relationship=false;
  if (!isNaN(prospect)){
    prospect=draggables[prospect];
  }



  prospect.drawsFrom.forEach(function (source){
    if (source[0]==selfID){
      relationship=true;
      return relationship;
    }
    else{
      let sourceObj=draggables[source[0]];
      if (sourceObj.drawsFrom.length>0){
        if (checkForRelationship(sourceObj, selfID)){
          relationship=true;
          return relationship;
        }
      }
    }


  });

  return relationship;


}

//drag and drop functionality
function dragElement(elmnt) {
  var pos1 = 0, pos2 = 0, pos3 = 0, pos4 = 0;
  elmnt.onmousedown = dragMouseDown;

  function dragMouseDown(e) {
    e = e || window.event;

    if ($("#drawOverlay").hasClass("invisible")){
      newHint("After clicking a draggable you'll see its information displayed on the right-hand side.  From here you can apply special rules to it, name it, or delete it.");
    }

    if($(e.currentTarget).hasClass("locked")){
      return;
    }
    e.preventDefault();
    // get the mouse cursor position at startup:
    pos3 = e.clientX;
    pos4 = e.clientY;
    document.onmouseup = closeDragElement;
    // call a function whenever the cursor moves:

    if (checkIfOnEdge(e)){

      document.onmousemove = elementResize;
    }
    else{
      document.onmousemove = elementDrag;
    }

  }
  function elementResize(e){
    e = e || window.event;
    e.preventDefault();
    // calculate the new cursor position:
    pos1 = pos3 - e.clientX;
    pos2 = pos4 - e.clientY;
    pos3 = e.clientX;
    pos4 = e.clientY;
    // set the element's new position:

    if ((elmnt.offsetHeight - pos2)>25){
      elmnt.style.height = (elmnt.offsetHeight - pos2) + "px";
    }
    if((elmnt.offsetWidth - pos1)>25){
      elmnt.style.width = (elmnt.offsetWidth - pos1) + "px";
    }

  }

  function elementDrag(e) {
    e = e || window.event;
    e.preventDefault();
    // calculate the new cursor position:
    pos1 = pos3 - e.clientX;
    pos2 = pos4 - e.clientY;
    pos3 = e.clientX;
    pos4 = e.clientY;
    // set the element's new position:

    let rect = elmnt.getBoundingClientRect();
    let borders=elmnt.parentElement.getBoundingClientRect();


    if ((rect.top - pos2)>=borders.top  &&  (rect.bottom - pos2)<=borders.bottom){
        elmnt.style.top = (elmnt.offsetTop - pos2) + "px";
    }

    if ((rect.left - pos1)>=borders.left  &&  (rect.right - pos1)<=borders.right){
      elmnt.style.left = (elmnt.offsetLeft - pos1) + "px";
    }

  }

  function closeDragElement() {
    /* stop moving when mouse button is released:*/
    document.onmouseup = null;
    document.onmousemove = null;
  }

  function checkIfOnEdge(e){
    let rect = elmnt.getBoundingClientRect();
    let yMargin=rect.height*.2;
    let xMargin=rect.width*.2;

    if (Math.abs(rect.bottom-e.clientY)<=yMargin ||Math.abs(rect.right-e.clientX)<= xMargin){
      return true;
    }
    else{
      return false;
    }

  }

}

function newHint(string){
  $("#hintBox").html(string);
}
