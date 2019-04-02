
sheetProj.view.sheetLogic = {
  setupUserInterface: function () {
      loadSheet();
      setClicks();
      displayBible();
      updateFinalMods();
      toggleBar.loadBar();
      charaSwap.loadTitle();

      window.addEventListener('unload', function(event) {
        let skipNextSave=JSON.parse(localStorage.getItem("skipNextSave"));
        if (skipNextSave){
          localStorage.setItem("skipNextSave", JSON.stringify(false));
        }
        else{
          saveActivePage();
        }

      });


      if (!JSON.parse(localStorage.getItem("tutorialSkip"))){
        runTutorial();
      }

    }
};

let toggleBar={
  toggleBody:function(){
    $("#toggleBarBody").toggleClass("noHeight");
  },
  drag:function(ev) {
    ev.dataTransfer.setData("text", ev.target.parentNode.id);
  },
  allowDrop:function(ev) {
    ev.preventDefault();
  },
  drop:function(ev) {
    ev.preventDefault();
    var data = ev.dataTransfer.getData("text");
    if (ev.target.childElementCount==0 && ev.target.classList.contains("toggleSlot")){
      ev.target.appendChild(document.getElementById(data));
      toggleBar.saveBarPosition();
    }
  },
  //------------
  loadBar:function(){
    let savedChars=JSON.parse(localStorage.getItem("savedChars"));
    let activeChar=JSON.parse(localStorage.getItem("activeChar"));
    let chara=savedChars[activeChar];
    let sheet=chara.charSheets[chara.activeSheet];

    let incomingToggles=[];

    $(".toggleSlot").empty();
    $("#ToggleTitle").val(chara.toggleBarTitles[chara.activeToggleBar]);

    for (let key in sheet.toggles){
      if (sheet.toggles[key].bar==chara.activeToggleBar){
        incomingToggles.push(sheet.toggles[key]);
      }
    }


    for (let i=0; i<7 && i<incomingToggles.length; i++){
      let toggleSelected="";


      let currentToggle=incomingToggles[i];

      if (currentToggle.status){
        toggleSelected="toggleSelected";
      }
      let newToggle=`<label class="toggle ${toggleSelected}" id="toggle${currentToggle.id}" style="width:100%; height:100%; position:relative;">
          <img class="toggleImg" src="${currentToggle.icon}" alt="some img" draggable="true" ondragstart="toggleBar.drag(event)">
          <img class="toggleSettings" src="https://res.cloudinary.com/metaverse/image/upload/v1547929282/icons8-settings-24.png" alt="settings" onClick="toggleBar.fetchSettings(event)">
          <div class="toggleNameTag">${currentToggle.name}</div>
          <input id="toggleCheck${currentToggle.id}" onchange="toggleBar.toggle(event)" style="height:15%; width:100%; visibility:hidden; position:absolute;" type="checkbox" ${currentToggle.status}>
      </label>`;

      $(`#toggleSlot${currentToggle.slotNum}`).html(newToggle);
    }

    if (chara.activeToggleBar+1 >= chara.totalToggleBars){
      $("#toggleBarNextBtn").prop( "disabled", true );
      $("#toggleShuffleRightBtn").prop( "disabled", true );
    }
    else{
      $("#toggleBarNextBtn").prop( "disabled", false );
      $("#toggleShuffleRightBtn").prop( "disabled", false );
    }

    if(chara.activeToggleBar<=0){
      $("#toggleBarPrevBtn").prop( "disabled", true );
      $("#toggleShuffleLeftBtn").prop( "disabled", true );
    }
    else{
      $("#toggleBarPrevBtn").prop( "disabled", false );
      $("#toggleShuffleLeftBtn").prop( "disabled", false );

    }

  },
  titleChange:function(newTitle){
    let savedChars=JSON.parse(localStorage.getItem("savedChars"));
    let activeChar=JSON.parse(localStorage.getItem("activeChar"));
    let chara=savedChars[activeChar];

    chara.toggleBarTitles.splice(chara.activeToggleBar,1, newTitle);

    localStorage.setItem("savedChars", JSON.stringify(savedChars));

  },
  saveBarPosition:function(){
    let savedChars=JSON.parse(localStorage.getItem("savedChars"));
    let activeChar=JSON.parse(localStorage.getItem("activeChar"));
    let chara=savedChars[activeChar];
    let sheet=chara.charSheets[chara.activeSheet];
    let toggleList=sheet.toggles;

    let barToggles=$(".toggle");

    for (let key=0; key<barToggles.length; key++){



      let currToggle= findByID(toggleList, parseInt(barToggles[key].id.replace('toggle','')));

      currToggle.slotNum=parseInt($(barToggles[key]).closest(".toggleSlot")[0].id.replace("toggleSlot", ""));

    }
    localStorage.setItem("savedChars", JSON.stringify(savedChars));
  },
  nextBar:function(){
    let savedChars=JSON.parse(localStorage.getItem("savedChars"));
    let activeChar=JSON.parse(localStorage.getItem("activeChar"));
    let chara=savedChars[activeChar];

    if(chara.activeToggleBar+1<chara.totalToggleBars){
      chara.activeToggleBar++;
    }
    localStorage.setItem("savedChars", JSON.stringify(savedChars));
    toggleBar.loadBar();
  },
  prevBar:function(){
    let savedChars=JSON.parse(localStorage.getItem("savedChars"));
    let activeChar=JSON.parse(localStorage.getItem("activeChar"));
    let chara=savedChars[activeChar];

    if(chara.activeToggleBar>0){
      chara.activeToggleBar--;
    }
    localStorage.setItem("savedChars", JSON.stringify(savedChars));
    toggleBar.loadBar();

  },
  shuffleBarLeft:function(){
    let savedChars=JSON.parse(localStorage.getItem("savedChars"));
    let activeChar=JSON.parse(localStorage.getItem("activeChar"));
    let chara=savedChars[activeChar];
    let sheet=chara.charSheets[chara.activeSheet];
    let oldBarNum=chara.activeToggleBar;
    let newBarNum=chara.activeToggleBar-1;
    let sheetKeys=Object.keys(sheet.toggles);

    if(chara.activeToggleBar>0){
      chara.activeToggleBar--;
      sheetKeys.forEach(function(key){
        if (sheet.toggles[key].bar==newBarNum){
          sheet.toggles[key].bar=oldBarNum;
        }
        else if(sheet.toggles[key].bar==oldBarNum){
          sheet.toggles[key].bar=newBarNum;
        }
      });
      chara.toggleBarTitles=ci.arraySwap(chara.toggleBarTitles, oldBarNum, newBarNum);
    }
    localStorage.setItem("savedChars", JSON.stringify(savedChars));
    toggleBar.loadBar();
  },
  shuffleBarRight:function(){
    let savedChars=JSON.parse(localStorage.getItem("savedChars"));
    let activeChar=JSON.parse(localStorage.getItem("activeChar"));
    let chara=savedChars[activeChar];
    let sheet=chara.charSheets[chara.activeSheet];
    let oldBarNum=chara.activeToggleBar;
    let newBarNum=chara.activeToggleBar+1;
    let sheetKeys=Object.keys(sheet.toggles);

    if(chara.activeToggleBar+1<chara.totalToggleBars){
      chara.activeToggleBar++;
      sheetKeys.forEach(function(key){
        if (sheet.toggles[key].bar==newBarNum){
          sheet.toggles[key].bar=oldBarNum;
        }
        else if(sheet.toggles[key].bar==oldBarNum){
          sheet.toggles[key].bar=newBarNum;
        }
      });
      chara.toggleBarTitles=ci.arraySwap(chara.toggleBarTitles, oldBarNum, newBarNum);
    }
    localStorage.setItem("savedChars", JSON.stringify(savedChars));
    toggleBar.loadBar();
  },
  addBar:function(){
    let savedChars=JSON.parse(localStorage.getItem("savedChars"));
    let activeChar=JSON.parse(localStorage.getItem("activeChar"));
    let chara=savedChars[activeChar];
    chara.totalToggleBars++;
    chara.toggleBarTitles.push("New ToggleBar");

    localStorage.setItem("savedChars", JSON.stringify(savedChars));
    toggleBar.loadBar();

  },
  deleteBar:function(){
    let savedChars=JSON.parse(localStorage.getItem("savedChars"));
    let activeChar=JSON.parse(localStorage.getItem("activeChar"));
    let chara=savedChars[activeChar];
    let sheet=chara.charSheets[chara.activeSheet];

    if (chara.totalToggleBars==1){
      alert("You can't delete your only ToggleBar!");
      return
    }

    for (let key in sheet.toggles){
      let tog=sheet.toggles[key];
      if (tog.bar==chara.activeToggleBar){
        localStorage.setItem("savedChars", JSON.stringify(savedChars));
        toggleBar.deleteToggle(tog.id);
        savedChars=JSON.parse(localStorage.getItem("savedChars"));
      }
      else if(tog.bar>chara.activeToggleBar){
        tog.bar--;
      }
    }
    chara.toggleBarTitles.splice(chara.activeToggleBar,1);

    if(chara.activeToggleBar+1==chara.totalToggleBars){
      chara.activeToggleBar--;
    }
    chara.totalToggleBars--;

    localStorage.setItem("savedChars", JSON.stringify(savedChars));
    toggleBar.loadBar();
  },
  //------------
  toggle:function(event){
    let savedChars=JSON.parse(localStorage.getItem("savedChars"));
    let activeChar=JSON.parse(localStorage.getItem("activeChar"));
    let chara=savedChars[activeChar];
    let sheet=chara.charSheets[chara.activeSheet];
    let toggleList=sheet.toggles;


    let togContainer=$(event.target).closest(".toggle")[0];


    let currToggle= findByID(toggleList, parseInt(event.target.id.replace('toggleCheck','')));
    if (event.target.checked){
      currToggle.status="checked";
      localStorage.setItem("savedChars",JSON.stringify(savedChars));
      toggleBar.applyEffects(currToggle.id,Object.values(currToggle.effects));


    }
    else{
      currToggle.status="";
      localStorage.setItem("savedChars",JSON.stringify(savedChars));
      toggleBar.removeEffects(currToggle.id,Object.values(currToggle.effects));

    }
    $(togContainer).toggleClass("toggleSelected");
    updateFinalMods();


  },
  applyEffects:function(toggleID, effectList){
    let savedChars=JSON.parse(localStorage.getItem("savedChars"));
    let activeChar=JSON.parse(localStorage.getItem("activeChar"));
    let chara=savedChars[activeChar];
    let sheet=chara.charSheets[chara.activeSheet];

    for (var i=0; i<effectList.length; i++){
      let effect=effectList[i];
      let drag=sheet.draggables[effect.targetDraggable];

      if (!drag){
        continue;
      }
      let dragEffects=drag.toggleEffects;
      if (!dragEffects.hasOwnProperty(toggleID)){
        dragEffects[toggleID]=[];
      }
      dragEffects[toggleID].push([effect.effectMod, effect.effectType]);
    }

    localStorage.setItem("savedChars",JSON.stringify(savedChars));
  },
  removeEffects:function(toggleID, effectList){
    let savedChars=JSON.parse(localStorage.getItem("savedChars"));
    let activeChar=JSON.parse(localStorage.getItem("activeChar"));
    let chara=savedChars[activeChar];
    let sheet=chara.charSheets[chara.activeSheet];

    for (var i=0; i<effectList.length; i++){
      let effect=effectList[i];
      let drag=sheet.draggables[effect.targetDraggable];
      if (!drag){
        continue;
      }
      let dragEffects=drag.toggleEffects;
      delete dragEffects[toggleID];
    }
    localStorage.setItem("savedChars",JSON.stringify(savedChars));
  },
  fetchSettings:function(event){
    event.preventDefault();
    let toggleID=$(event.target).closest(".toggle")[0].id.replace('toggle','');

    toggleBar.loadSettings(toggleID);


  },
  loadSettings:function(toggleID){
    let savedChars=JSON.parse(localStorage.getItem("savedChars"));
    let activeChar=JSON.parse(localStorage.getItem("activeChar"));
    let chara=savedChars[activeChar];
    let sheet=chara.charSheets[chara.activeSheet];
    let toggleList=sheet.toggles;



    let toggle= findByID(toggleList, parseInt(toggleID));
    let toggleEffects="";


    let draggables=Object.entries(sheet.draggables);
    let bonusTypes=Object.entries(JSON.parse(localStorage.getItem("bonusTypes")));
    let toggleKeys=Object.keys(toggle.effects);

    for (let i=0; i<toggleKeys.length; i++){
      let effect=toggle.effects[toggleKeys[i]];
      let validTargets="";
      let unsortedTargets=[];
      let targetGroups={};
      let genEffects="";
      let armorEffects="";
      let ablEffects="";

      let selected="";

      for (let i=0; i<draggables.length; i++){
        if (draggables[i][1].finalMod!==null && draggables[i][1].uiName!="Unnamed"){
          if(effect.targetDraggable==draggables[i][1].id){
            selected="selected";
          }
          unsortedTargets.push([draggables[i][1].uiName,`<option ${selected} value="${draggables[i][1].id}">${draggables[i][1].uiName}</option>`, draggables[i][1].toggleLabel]);

          selected="";
        }
      }
      unsortedTargets.sort(function (a, b) {
             if (a[0] < b[0]) return -1;
             if (a[0] > b[0]) return 1;
             return 0;
           });


      for (let i=0; i<unsortedTargets.length; i++){

        if (targetGroups.hasOwnProperty(unsortedTargets[i][2])){
          targetGroups[unsortedTargets[i][2]]+=unsortedTargets[i][1]
        }
        else{
          targetGroups[unsortedTargets[i][2]]=unsortedTargets[i][1];
        }

      }
      targetGroups=Object.entries(targetGroups);

      for (let i=0; i<targetGroups.length; i++){
        validTargets+=`<optgroup label="${targetGroups[i][0]}">`;
        validTargets+=targetGroups[i][1];
        validTargets+='</outgroup>';
      }


      for (let i=0; i<bonusTypes.length; i++){
        if (bonusTypes[i][0]==effect.effectType){
          selected="selected";
        }
        switch (bonusTypes[i][1].category){
          case "General Purpose":
            genEffects+=`<option ${selected} value="${bonusTypes[i][0]}">${bonusTypes[i][0]}</option>`;
            break;

          case "Armor Class Specific":
            armorEffects+=`<option ${selected} value="${bonusTypes[i][0]}">${bonusTypes[i][0]}</option>`;
            break;

          case "Ability Score Specific":
            ablEffects+=`<option ${selected} value="${bonusTypes[i][0]}">${bonusTypes[i][0]}</option>`;
            break;

          default:
            genEffects+=`<option ${selected} value="${bonusTypes[i][0]}">${bonusTypes[i][0]}</option>`;
            console.log("error:  bonus type "+ bonusTypes[i][0]+ " did not fit into any category.  Setting to General Purpose.");
            break;
        }

        selected="";
      }

        toggleEffects+=`
        <div id="effectContainer${effect.id}" class="effectContainer" style="position:relative">
          <img class="effectDeleter" src="https://res.cloudinary.com/metaverse/image/upload/v1548289539/icons8-delete-48.png" alt="deleteEffect" onclick="toggleBar.deleteEffect(event)">
          <table id="effect${effect.id}" class="toggleEffectTable mt-2">

            <tr style="width:100%;">
              <td style="width:40%;">Draggable Modified:</td>
              <td style="width:60%;"><select id="target${effect.id}" onchange="toggleBar.changeTarget(event)" style="width:80%;">
                <option value="" selected disabled hidden style="font-size:.5em">Select Target</option>
                <optgroup label="Named Draggables">
                </outgroup>
                <optgroup label="--------">
                </outgroup>
                ${validTargets}

              </select></td>
            </tr>
            <tr style="width:100%;">
              <td style="width:40%;">Modifier:</td>
              <td style="width:60%;"><input id="modifier${effect.id}" onchange="toggleBar.changeMod(event)" type="number" value="${effect.effectMod}" style="width:80%;"></td>
            </tr>
            <tr style="width:100%;">
              <td style="width:40%;">Modifier Type:</td>
              <td style="width:60%;"><select id="effectType${effect.id}" onchange="toggleBar.changeType(event)" style="width:80%">
              <optgroup label="General Bonus Types">
                ${genEffects}
              </outgroup>
              <optgroup label="Armor Specific Bonuses">
                ${armorEffects}
              </outgroup>
              <optgroup label="Abl Score Specific Bonuses">
                ${ablEffects}
              </outgroup>
              </select></td>
            </tr>
          </table>
        </div>`;
    }

    let newInfo=`<input class="invisible" id="selectedToggle" value="${toggleID}">
    <label for="toggleName" style="font-size:1.5em; font-weight:bold;">Toggle Name:</label>
    <input id="toggleName" onchange="toggleBar.changeName(event.target.value)" value="${toggle.name}">
    <label for="toggleIcon" class=" mt-2" style="font-size:1.5em; font-weight:bold;">Toggle Icon:</label>
    <div class="container-fluid">
      <div class="row">
        <img class="col-2" src=${toggle.icon}>
        <input class="col-6" id="toggleIcon" onchange="toggleBar.changeIcon(event.target.value)" value="${toggle.icon}">
      </div>
    </div>
    <label for="toggleDescription" style="font-weight:bold;" class="mt-2">Toggle Description:</label>
    <div id="descriptionHolder">
      ${toggle.description}
    </div>

    <p class="mt-2"><b>Effect List:<br></b></p>
    <div id="toggleEffects" class="mt-2">
    ${toggleEffects}
    </div>
    <button onclick="toggleBar.newEffect()" style="background-color:cyan" class="mt-4">Add a new Effect</button>
    <button onclick="toggleBar.deleteToggle()" style="background-color:red">Delete</button>`;

    $("#draggableInfo").html(newInfo);
    $("#descriptionHolder").click(toggleBar.toggleDescription);
  },
  changeName:function(newName){
    let savedChars=JSON.parse(localStorage.getItem("savedChars"));
    let activeChar=JSON.parse(localStorage.getItem("activeChar"));
    let chara=savedChars[activeChar];
    let sheet=chara.charSheets[chara.activeSheet];

    let selectedToggle= $("#selectedToggle")[0].value;



    sheet.toggles[selectedToggle].name=newName;
    localStorage.setItem("savedChars", JSON.stringify(savedChars));
    toggleBar.loadBar();
  },
  changeDescription:function(event){
    let savedChars=JSON.parse(localStorage.getItem("savedChars"));
    let activeChar=JSON.parse(localStorage.getItem("activeChar"));
    let chara=savedChars[activeChar];
    let sheet=chara.charSheets[chara.activeSheet];

    let selectedToggle= $("#selectedToggle")[0].value;
    let newDescription=$(event.target).val();


    sheet.toggles[selectedToggle].description=newDescription;
    localStorage.setItem("savedChars", JSON.stringify(savedChars));
    $("#descriptionHolder").html(newDescription);
  },
  toggleDescription:function(){


    if ($("#toggleDescription").length!=0){
      return;
    }
    let savedChars=JSON.parse(localStorage.getItem("savedChars"));
    let activeChar=JSON.parse(localStorage.getItem("activeChar"));
    let chara=savedChars[activeChar];
    let sheet=chara.charSheets[chara.activeSheet];

    let selectedToggle= $("#selectedToggle")[0].value;
    let toggle=sheet.toggles[selectedToggle];


    $("#descriptionHolder").html(`<textarea id="toggleDescription" onchange="toggleBar.changeDescription(event)">${toggle.description}</textarea>`);

  },
  changeTarget:function(event){
    let savedChars=JSON.parse(localStorage.getItem("savedChars"));
    let activeChar=JSON.parse(localStorage.getItem("activeChar"));
    let chara=savedChars[activeChar];
    let sheet=chara.charSheets[chara.activeSheet];

    let selectedToggle= $("#selectedToggle")[0].value;
    let selectedEffect=parseInt(event.target.id.replace('target',''));
    let newValue=parseInt(event.target.value);

    if(sheet.toggles[selectedToggle].status=="checked"){
      localStorage.setItem("savedChars", JSON.stringify(savedChars));
      toggleBar.removeEffects(selectedToggle,Object.values(sheet.toggles[selectedToggle].effects));
      savedChars=JSON.parse(localStorage.getItem("savedChars"));
      chara=savedChars[activeChar];
      sheet=chara.charSheets[chara.activeSheet];

      sheet.toggles[selectedToggle].effects[selectedEffect].targetDraggable=newValue;


      localStorage.setItem("savedChars", JSON.stringify(savedChars));
      toggleBar.applyEffects(selectedToggle,Object.values(sheet.toggles[selectedToggle].effects));
      savedChars=JSON.parse(localStorage.getItem("savedChars"));
      chara=savedChars[activeChar];
      sheet=chara.charSheets[chara.activeSheet];
    }
    else{
      sheet.toggles[selectedToggle].effects[selectedEffect].targetDraggable=newValue;
    }






    localStorage.setItem("savedChars", JSON.stringify(savedChars));
    updateFinalMods();
  },
  changeMod:function(event){
    let savedChars=JSON.parse(localStorage.getItem("savedChars"));
    let activeChar=JSON.parse(localStorage.getItem("activeChar"));
    let chara=savedChars[activeChar];
    let sheet=chara.charSheets[chara.activeSheet];

    let selectedToggle= $("#selectedToggle")[0].value;
    let selectedEffect=parseInt(event.target.id.replace('modifier',''));
    let newValue=parseInt(event.target.value);

    if(sheet.toggles[selectedToggle].status=="checked"){
      localStorage.setItem("savedChars", JSON.stringify(savedChars));
      toggleBar.removeEffects(selectedToggle,Object.values(sheet.toggles[selectedToggle].effects));
      savedChars=JSON.parse(localStorage.getItem("savedChars"));
      chara=savedChars[activeChar];
      sheet=chara.charSheets[chara.activeSheet];

      sheet.toggles[selectedToggle].effects[selectedEffect].effectMod=newValue;


      localStorage.setItem("savedChars", JSON.stringify(savedChars));
      toggleBar.applyEffects(selectedToggle,Object.values(sheet.toggles[selectedToggle].effects));
      savedChars=JSON.parse(localStorage.getItem("savedChars"));
      chara=savedChars[activeChar];
      sheet=chara.charSheets[chara.activeSheet];
    }
    else{
      sheet.toggles[selectedToggle].effects[selectedEffect].effectMod=newValue;
    }


    localStorage.setItem("savedChars", JSON.stringify(savedChars));
    updateFinalMods();
  },
  changeType:function(event){
    let savedChars=JSON.parse(localStorage.getItem("savedChars"));
    let activeChar=JSON.parse(localStorage.getItem("activeChar"));
    let chara=savedChars[activeChar];
    let sheet=chara.charSheets[chara.activeSheet];

    let selectedToggle= $("#selectedToggle")[0].value;
    let selectedEffect=parseInt(event.target.id.replace('effectType',''));
    let newValue=event.target.value;

    if(sheet.toggles[selectedToggle].status=="checked"){
      localStorage.setItem("savedChars", JSON.stringify(savedChars));
      toggleBar.removeEffects(selectedToggle,Object.values(sheet.toggles[selectedToggle].effects));
      savedChars=JSON.parse(localStorage.getItem("savedChars"));
      chara=savedChars[activeChar];
      sheet=chara.charSheets[chara.activeSheet];

      sheet.toggles[selectedToggle].effects[selectedEffect].effectType=newValue;

      localStorage.setItem("savedChars", JSON.stringify(savedChars));
      toggleBar.applyEffects(selectedToggle,Object.values(sheet.toggles[selectedToggle].effects));
      savedChars=JSON.parse(localStorage.getItem("savedChars"));
      chara=savedChars[activeChar];
      sheet=chara.charSheets[chara.activeSheet];
    }
    else{
      sheet.toggles[selectedToggle].effects[selectedEffect].effectType=newValue;
    }


    localStorage.setItem("savedChars", JSON.stringify(savedChars));
    updateFinalMods();
  },
  changeIcon:function(newIcon){
    let savedChars=JSON.parse(localStorage.getItem("savedChars"));
    let activeChar=JSON.parse(localStorage.getItem("activeChar"));
    let chara=savedChars[activeChar];
    let sheet=chara.charSheets[chara.activeSheet];

    let selectedToggle= $("#selectedToggle")[0].value;

    sheet.toggles[selectedToggle].icon=newIcon;
    localStorage.setItem("savedChars", JSON.stringify(savedChars));
    toggleBar.loadBar();
    toggleBar.loadSettings(selectedtoggle);
  },
  newEffect:function(){
    let savedChars=JSON.parse(localStorage.getItem("savedChars"));
    let activeChar=JSON.parse(localStorage.getItem("activeChar"));
    let chara=savedChars[activeChar];
    let sheet=chara.charSheets[chara.activeSheet];

    let selectedToggle= $("#selectedToggle")[0].value;
    let effectID=newID(sheet.toggles[selectedToggle].effects);

    // if(sheet.toggles[selectedToggle].status=="checked"){
    //   savedChars=toggleBar.resetToggle(selectedToggle);
    //   chara=savedChars[activeChar];
    //   sheet=chara.charSheets[chara.activeSheet];
    // }

    sheet.toggles[selectedToggle].effects[effectID]={
      targetDraggable:null,
      effectType:"Untyped",
      effectMod:0,
      id:effectID
    }
    localStorage.setItem("savedChars", JSON.stringify(savedChars));
    toggleBar.loadSettings(selectedToggle);
  },
  deleteEffect:function(event){
    let savedChars=JSON.parse(localStorage.getItem("savedChars"));
    let activeChar=JSON.parse(localStorage.getItem("activeChar"));
    let chara=savedChars[activeChar];
    let sheet=chara.charSheets[chara.activeSheet];
    let selectedToggle= $("#selectedToggle")[0].value;

    let effectID=parseInt($(event.target).closest(".effectContainer")[0].id.replace("effectContainer",""));

    if(sheet.toggles[selectedToggle].status=="checked"){
      localStorage.setItem("savedChars", JSON.stringify(savedChars));
      toggleBar.removeEffects(selectedToggle,Object.values(sheet.toggles[selectedToggle].effects));
      savedChars=JSON.parse(localStorage.getItem("savedChars"));
      chara=savedChars[activeChar];
      sheet=chara.charSheets[chara.activeSheet];

        delete sheet.toggles[selectedToggle].effects[effectID];

      localStorage.setItem("savedChars", JSON.stringify(savedChars));
      toggleBar.applyEffects(selectedToggle,Object.values(sheet.toggles[selectedToggle].effects));
      savedChars=JSON.parse(localStorage.getItem("savedChars"));
      chara=savedChars[activeChar];
      sheet=chara.charSheets[chara.activeSheet];
    }
    else{
      delete sheet.toggles[selectedToggle].effects[effectID];
    }

    localStorage.setItem("savedChars", JSON.stringify(savedChars));
    toggleBar.loadSettings(selectedToggle);
    updateFinalMods();

  },
  deleteToggle:function(toggleID){
    let savedChars=JSON.parse(localStorage.getItem("savedChars"));
    let activeChar=JSON.parse(localStorage.getItem("activeChar"));
    let chara=savedChars[activeChar];
    let sheet=chara.charSheets[chara.activeSheet];
    let selectedToggle;

    if(isNaN(toggleID)){
      selectedToggle= $("#selectedToggle")[0].value;
    }
    else{
      selectedToggle= toggleID;
    }


    if(sheet.toggles[selectedToggle].status=="checked"){
      toggleBar.removeEffects(selectedToggle, Object.values(sheet.toggles[selectedToggle].effects));
      savedChars=JSON.parse(localStorage.getItem("savedChars"));
      chara=savedChars[activeChar];
      sheet=chara.charSheets[chara.activeSheet];
    }

    delete sheet.toggles[selectedToggle];

    localStorage.setItem("savedChars", JSON.stringify(savedChars));
    $("#draggableInfo").html("");
    toggleBar.loadBar();
    updateFinalMods();
  },
  newToggle:function(){
    let savedChars=JSON.parse(localStorage.getItem("savedChars"));
    let activeChar=JSON.parse(localStorage.getItem("activeChar"));
    let chara=savedChars[activeChar];
    let sheet=chara.charSheets[chara.activeSheet];

    let toggleID=newID(sheet.toggles);

    let availableSlot=null;

    let barToggles=$(".toggleSlot");

    for (let key=0; key<barToggles.length; key++){
      if(barToggles[key].childElementCount==0){
        availableSlot=key;
        break;
      }
    }
    if (availableSlot ===null){
      alert("Current toggle bar is full!  Change toggle bars or clear out space before creating a new toggle!");
    }
    else{
      sheet.toggles[toggleID]={
          id: toggleID,
          name: "Unnamed Toggle",
          bar: chara.activeToggleBar,
          slotNum: availableSlot,
          effects: {
            0:{
              targetDraggable:null,
              effectType:"Untyped",
              effectMod:0,
              id:0
              }
          },
          icon: "https://res.cloudinary.com/metaverse/image/upload/v1548787121/icons8-transition-both-directions-48.png",
          status: "",
          description:""
      }
      localStorage.setItem("savedChars",JSON.stringify(savedChars));
      toggleBar.loadBar();
    }

  },
  resetToggle:function(toggleID){
    let savedChars=JSON.parse(localStorage.getItem("savedChars"));
    let activeChar=JSON.parse(localStorage.getItem("activeChar"));
    let chara=savedChars[activeChar];
    let sheet=chara.charSheets[chara.activeSheet];

    let toggle=sheet.toggles[toggleID];


    toggleBar.removeEffects(toggle.id,Object.values(toggle.effects));
    savedChars=JSON.parse(localStorage.getItem("savedChars"));
    toggleBar.applyEffects(toggle.id,Object.values(toggle.effects));
    savedChars=JSON.parse(localStorage.getItem("savedChars"));



    return savedChars;
  }


}

let dragLogic={

  changeCategory:function(newCategory){
    let savedChars=JSON.parse(localStorage.getItem("savedChars"));
    let activeChar=JSON.parse(localStorage.getItem("activeChar"));
    let chara=savedChars[activeChar];
    let sheet=chara.charSheets[chara.activeSheet];

    let selectedDrag= $("#selectedDraggable")[0].value;



    sheet.draggables[selectedDrag].toggleLabel=newCategory;
    localStorage.setItem("savedChars", JSON.stringify(savedChars));
  },
  toggleDescription:function(){
    if ($("#draggableDescription").length!=0){
      return;
    }
    let savedChars=JSON.parse(localStorage.getItem("savedChars"));
    let activeChar=JSON.parse(localStorage.getItem("activeChar"));
    let chara=savedChars[activeChar];
    let sheet=chara.charSheets[chara.activeSheet];

    let selectedDrag= $("#selectedDraggable")[0].value;
    let draggable=sheet.draggables[selectedDrag];


    $("#descriptionHolder").html(`<textarea id="draggableDescription" onchange="dragLogic.changeDescription(event)">${draggable.description}</textarea>`);

  },

  changeDescription:function(event){

    let savedChars=JSON.parse(localStorage.getItem("savedChars"));
    let activeChar=JSON.parse(localStorage.getItem("activeChar"));
    let chara=savedChars[activeChar];
    let sheet=chara.charSheets[chara.activeSheet];

    let draggableID=$("#selectedDraggable")[0].value;

    let draggable=findByID(sheet.draggables, draggableID);
    draggable.description=$(event.target).val();


    localStorage.setItem("savedChars", JSON.stringify(savedChars));
    $("#descriptionHolder").html(draggable.description);
  }
}

//-----------------

let pageNavi={
  nextPage:function(){
    saveActivePage();
    let savedChars=JSON.parse(localStorage.getItem("savedChars"));
    let activeChar=JSON.parse(localStorage.getItem("activeChar"));
    let chara=savedChars[activeChar];
    let sheet=chara.charSheets[chara.activeSheet];
    if (chara.activePage+1<chara.totalPages){
      chara.activePage++;
      // $("#reversePageButton").prop( "disabled", false );
      // if (!(chara.activePage+1<chara.totalPages)){
      //   $("#forwardPageButton").prop( "disabled", true );
      // }
    }
    localStorage.setItem("savedChars", JSON.stringify(savedChars));
    loadSheet();
    restoreHighlights(sheet.draggables);
    updateAbilityMods();

  },
  prevPage:function(){
    saveActivePage();
    let savedChars=JSON.parse(localStorage.getItem("savedChars"));
    let activeChar=JSON.parse(localStorage.getItem("activeChar"));
    let chara=savedChars[activeChar];
    let sheet=chara.charSheets[chara.activeSheet];
    if (chara.activePage>0){
      chara.activePage--;
      // $("#forwardPageButton").prop( "disabled", false );
      // if (chara.activePage<=0){
      //   $("#reversePageButton").prop( "disabled", true );
      // }
    }
    localStorage.setItem("savedChars", JSON.stringify(savedChars));
    loadSheet();
    restoreHighlights(sheet.draggables);
    updateAbilityMods();
  },
  spawnPage:function(){
    let savedChars=JSON.parse(localStorage.getItem("savedChars"));
    let activeChar=JSON.parse(localStorage.getItem("activeChar"));
    let chara=savedChars[activeChar];
    chara.totalPages++;
    localStorage.setItem("savedChars", JSON.stringify(savedChars));
    $("#forwardPageButton").prop( "disabled", false );
  },
  destroyPage:function(){
    let savedChars=JSON.parse(localStorage.getItem("savedChars"));
    let activeChar=JSON.parse(localStorage.getItem("activeChar"));
    let chara=savedChars[activeChar];
    let sheet=chara.charSheets[chara.activeSheet];
    if (chara.totalPages==1){
      alert("You can't delete your last page!");
      return
    }

    for (let key in sheet.draggables){
      let elem=sheet.draggables[key];
      if (elem.page==chara.activePage){
        delete sheet.draggables[key];
      }
      else if(elem.page>chara.activePage){
        elem.page--;
      }
    }
    chara.totalPages--;
    chara.activePage--;
    localStorage.setItem("savedChars", JSON.stringify(savedChars));
    loadSheet();
    restoreHighlights(sheet.draggables);
  },
  shufflePageLeft:function(){
    saveActivePage();
    let savedChars=JSON.parse(localStorage.getItem("savedChars"));
    let activeChar=JSON.parse(localStorage.getItem("activeChar"));
    let chara=savedChars[activeChar];
    let sheet=chara.charSheets[chara.activeSheet];
    let oldPageNum=chara.activePage;
    let newPageNum=chara.activePage-1;
    let sheetKeys=Object.keys(sheet.draggables);

    if (chara.activePage>0){
      chara.activePage--;
      sheetKeys.forEach(function(key){
        if (sheet.draggables[key].page==newPageNum){
          sheet.draggables[key].page=oldPageNum;
        }
        else if(sheet.draggables[key].page==oldPageNum){
          sheet.draggables[key].page=newPageNum;
        }
      });
      // $("#forwardPageButton").prop( "disabled", false );
      // if (chara.activePage<=0){
      //   $("#reversePageButton").prop( "disabled", true );
      // }
    }
    localStorage.setItem("savedChars", JSON.stringify(savedChars));
    loadSheet();
    restoreHighlights(sheet.draggables);
  },
  shufflePageRight:function(){
    saveActivePage();
    let savedChars=JSON.parse(localStorage.getItem("savedChars"));
    let activeChar=JSON.parse(localStorage.getItem("activeChar"));
    let chara=savedChars[activeChar];
    let sheet=chara.charSheets[chara.activeSheet];
    let oldPageNum=chara.activePage;
    let newPageNum=chara.activePage+1;
    let sheetKeys=Object.keys(sheet.draggables);

    console.log(chara.activePage+1);
    console.log(chara.totalPages);
    if (chara.activePage+1<chara.totalPages){
      console.log("triggered");
      chara.activePage++;
      sheetKeys.forEach(function(key){
        if (sheet.draggables[key].page==newPageNum){
          sheet.draggables[key].page=oldPageNum;
        }
        else if(sheet.draggables[key].page==oldPageNum){
          sheet.draggables[key].page=newPageNum;
        }
      });
      // $("#reversePageButton").prop( "disabled", false );
      // if (chara.activePage+1>=chara.totalPages){
      //   $("#forwardPageButton").prop( "disabled", true );
      // }
    }
    localStorage.setItem("savedChars", JSON.stringify(savedChars));
    loadSheet();
    restoreHighlights(sheet.draggables);
  }
}

let charaSwap={
  changeTitle:function(newTitle){
    let savedChars=JSON.parse(localStorage.getItem("savedChars"));
    let activeChar=JSON.parse(localStorage.getItem("activeChar"));
    let chara=savedChars[activeChar];

    chara.charName=newTitle;

    localStorage.setItem("savedChars", JSON.stringify(savedChars));
    charaSwap.loadTitle();
  },
  loadTitle:function(){
    let savedChars=JSON.parse(localStorage.getItem("savedChars"));
    let activeChar=JSON.parse(localStorage.getItem("activeChar"));
    let chara=savedChars[activeChar];
    let options='';

    for(let i=0; i<savedChars.length; i++){
      if (i==activeChar){
        options+=`<option selected value="${i}">${savedChars[i].charName}</option>`;
      }
      else{
        options+=`<option value="${i}">${savedChars[i].charName}</option>`;
      }

    }
    options+=`<option value="new">NEW CHARACTER</option>`;
    options+=`<option value="delete">DELETE CHARACTER</option>`;

    $("#charTitleBanner").val(chara.charName);
    $("#charChoiceMenu").empty();
    $("#charChoiceMenu").html(options);
  },
  changeChar:function(newChar){
    let savedChars=JSON.parse(localStorage.getItem("savedChars"));
    let activeChar=JSON.parse(localStorage.getItem("activeChar"));
    let chara=savedChars[activeChar];

    if (newChar=="new"){
      charaSwap.newChar();
      return;
    }
    else if (newChar=="delete"){
      charaSwap.deleteChar();
      return;
    }
    saveActivePage();
    localStorage.setItem("skipNextSave", JSON.stringify(true));
    activeChar=parseInt(newChar);
    localStorage.setItem("activeChar", JSON.stringify(activeChar));

    location.reload();
  },
  newChar:function(){
    let savedChars=JSON.parse(localStorage.getItem("savedChars"));
    let activeChar=JSON.parse(localStorage.getItem("activeChar"));
    let defaultCharSheet=JSON.parse(localStorage.getItem("defaultCharSheet"));
    let chara=savedChars[activeChar];

    let newChar={
      "charName":"New Char",
      "charSheets":[defaultCharSheet],
      "activeSheet":0,
      "activePage":0,
      "totalPages":7,
      "activeToggleBar":0,
      "toggleBarTitles":["New ToggleBar"],
      "totalToggleBars":1
    }

    savedChars.push(newChar);
    localStorage.setItem("savedChars", JSON.stringify(savedChars));
    localStorage.setItem("activeChar", JSON.stringify(savedChars.length-1));

    location.reload();
  },
  deleteChar:function(){
    let savedChars=JSON.parse(localStorage.getItem("savedChars"));
    let activeChar=JSON.parse(localStorage.getItem("activeChar"));
    let defaultCharSheet=JSON.parse(localStorage.getItem("defaultCharSheet"));
    let chara=savedChars[activeChar];

    if (savedChars.length<=1){
      alert("You can't delete your only character!");
      return;
    }

    savedChars.splice(activeChar,1);
    if (activeChar>0){
      activeChar--;;
    }
    localStorage.setItem("savedChars", JSON.stringify(savedChars));
    localStorage.setItem("activeChar", JSON.stringify(activeChar));

    location.reload();

  }
}

let ci={
  arraySwap:function(array, index1, index2){
    //swaps two values in an arrays order by index then returns the modified array
    let tmp=array[index1];
    array[index1]=array[index2];
    array[index2]=tmp;
    return array;

  }
}

function setClicks(){
  $(".collapseButton").click(collapseParent);
  $(".tabHead").click(collapseTabBody);
  $("#reversePageButton").click(pageNavi.prevPage);
  $("#forwardPageButton").click(pageNavi.nextPage);
  $("#shuffleLeftPageButton").click(pageNavi.shufflePageLeft);
  $("#shuffleRightPageButton").click(pageNavi.shufflePageRight);
  $("#spawnPage").click(pageNavi.spawnPage);
  $("#deletePage").click(pageNavi.destroyPage);

  $("#toggleBarHeader").click(toggleBar.toggleBody);
  $("#toggleShuffleRightBtn").click(toggleBar.shuffleBarRight);
  $("#toggleShuffleLeftBtn").click(toggleBar.shuffleBarLeft);


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
  $(".draggable").remove();



  if (chara.activePage+1>=chara.totalPages){
    $("#forwardPageButton").prop( "disabled", true );
    $("#shuffleRightPageButton").prop( "disabled", true );
  }
  else{
      $("#forwardPageButton").prop( "disabled", false );
      $("#shuffleRightPageButton").prop( "disabled", false );
  }
  if (chara.activePage<=0){
    $("#reversePageButton").prop( "disabled", true );
    $("#shuffleLeftPageButton").prop( "disabled", true );
  }
  else{
    $("#reversePageButton").prop( "disabled", false );
    $("#shuffleLeftPageButton").prop( "disabled", false );

  }

  for (var key in sheet.draggables){

    let elem=sheet.draggables[key];
    // elem.toggleEffects={};
    if (elem.page != chara.activePage){

      continue;
    }

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
    $("#temporary").find(".artBox").attr(`src`, `${elem.backgroundArt}`);
    if($("#temporary").hasClass("artBox")){
      $("#temporary").attr(`src`, `${elem.backgroundArt}`);
    };

    $("#temporary").prop('id', `${elem.id}`);
    spawnBox($("#htmlPalette").children());
    $("#htmlPalette").empty();

  }
  // localStorage.setItem("savedChars", JSON.stringify(savedChars));

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
        "page":chara.activePage,
        "toggleEffects": {},
        "name":"Title",
        "uiName":"Unnamed",
        "value":0,
        "finalAblScore":0,
        "finalMod":0,
        "drawsFrom":[],
        "toggleLabel":"Uncategorized",
        "activeRules":[],
        "backgroundArt":"",
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
    if (i!=ids[i]){
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
  let draggable=findByID(sheet.draggables, $(event).closest(".draggable")[0].id);
  draggable.name=event.value;
  localStorage.setItem("savedChars", JSON.stringify(savedChars));
}

function changeValue(event){
  let savedChars=JSON.parse(localStorage.getItem("savedChars"));
  let activeChar=JSON.parse(localStorage.getItem("activeChar"));
  let chara=savedChars[activeChar];
  let sheet=chara.charSheets[chara.activeSheet];

  let draggable=findByID(sheet.draggables, $(event).closest(".draggable")[0].id);

  draggable.value=event.value;
  localStorage.setItem("savedChars", JSON.stringify(savedChars));

  updateFinalMods();
}

function directChangeDragSize(newSize, axis){
  let savedChars=JSON.parse(localStorage.getItem("savedChars"));
  let activeChar=JSON.parse(localStorage.getItem("activeChar"));
  let chara=savedChars[activeChar];
  let sheet=chara.charSheets[chara.activeSheet];

  let draggable=findByID(sheet.draggables, $("#selectedDraggable")[0].value);
  $(`#${draggable.id}`).css(axis, `${newSize}px`);
}


function changeDrawRatio(event){
  let savedChars=JSON.parse(localStorage.getItem("savedChars"));
  let activeChar=JSON.parse(localStorage.getItem("activeChar"));
  let chara=savedChars[activeChar];
  let sheet=chara.charSheets[chara.activeSheet];

  let draggable=findByID(sheet.draggables, stripToID($(event).closest('table')[0].id));
  console.log(event.value);

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
function changeDraggableArt(event){

  let savedChars=JSON.parse(localStorage.getItem("savedChars"));
  let activeChar=JSON.parse(localStorage.getItem("activeChar"));
  let chara=savedChars[activeChar];
  let sheet=chara.charSheets[chara.activeSheet];

  let draggableID=$("#selectedDraggable")[0].value;

  let draggable=findByID(sheet.draggables, draggableID);
  draggable.backgroundArt=event.target.value;
  $(`#${draggableID}`).attr("src", `${event.target.value}`);
  console.log($(`#${draggableID}`));
  localStorage.setItem("savedChars", JSON.stringify(savedChars));
}



function displayInfo(event){
  if ($(event.target).hasClass("artBox")){
    displayArt(event);
    return;
  }


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


  <label class="mt-4"><span style="display: inline-block; text-align: right; width:55px;">Width:</span><input onchange="directChangeDragSize(event.target.value, 'width')" type="number" value="${parseInt(draggable.width)}"></label>
  <label><span style="display: inline-block; text-align: right; width:55px;">Height:</span><input onchange="directChangeDragSize(event.target.value, 'height')" type="number" value="${parseInt(draggable.height)}"></label>

  <label class="mt-4"><span style="display: inline-block; text-align: right; width:55px;">X-Pos:</span><input onchange="directChangeDragSize(event.target.value, 'left')" type="number" value="${parseInt(draggable.left)}"></label>
  <label><span style="display: inline-block; text-align: right; width:55px;">Y-Pos:</span><input onchange="directChangeDragSize(event.target.value, 'top')" type="number" value="${parseInt(draggable.top)}"></label>


  <label for="draggableCategory" style="font-size:1.5em; font-weight:bold;">Category:</label>
  <input id="draggableCategory" onchange="dragLogic.changeCategory(event.target.value)" value="${draggable.toggleLabel}">
  <p><b>Draggable Description:</b></p>
  <div id="descriptionHolder">
    ${draggable.description}
  </div>


  <div id="draggableDraws" class="mt-4">
  </div>
  <div id="draggableRules" class="mt-2">
    ${displayedRules}
  </div>
  <button onclick="deleteDraggable()" style="background-color:red">Delete</button>`;


  $("#draggableInfo").html(newInfo);
  $("#descriptionHolder").click(dragLogic.toggleDescription);
}



function displayArt(event){

  let savedChars=JSON.parse(localStorage.getItem("savedChars"));
  let activeChar=JSON.parse(localStorage.getItem("activeChar"));
  let chara=savedChars[activeChar];
  let sheet=chara.charSheets[chara.activeSheet];


  let dragID=event.currentTarget.id;
  let draggable=findByID(sheet.draggables, dragID);
  console.log(draggable);

  let newInfo=`<input class="invisible" id="selectedDraggable" value="${draggable.id}">
  <label for="draggableArtURL" style="font-size:1.5em; font-weight:bold;">Art URL:</label>
  <input id="draggableArtURL" onchange="changeDraggableArt(event)" value="${draggable.backgroundArt}">
  <p><b>Draggable Description:</b></p>
  <div id="descriptionHolder">
    ${draggable.description}
  </div>
  <button onclick="deleteDraggable()" style="background-color:red">Delete</button>`;

  $("#draggableInfo").html(newInfo);
  $("#descriptionHolder").click(dragLogic.toggleDescription);
}



function bubbleReceptiveDivs(){
  let receptiveDivs=$(".finalMod").closest(".draggable");


  $.each(receptiveDivs, function( key, div ) {
    $(div).toggleClass("layer4");
      });
}

function bubbleSenderDivs(receiverID){
  let senderDivs=$(".baseInput").closest(".draggable");



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
  $("#pageNavigation").toggleClass("layer4");
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

function restoreHighlights(draggables){
  if ($("#drawOverlay").hasClass("invisible")){return;}

  let targetID=JSON.parse(localStorage.getItem("targetSelected"));
  if (targetID!==false){
    let targetElem=$(`#${targetID}`);
    bubbleSenderDivs(targetID);
    highlightSendingDivs(draggables[targetID].drawsFrom);
    $(targetElem).addClass("receiverBorder");
    $(targetElem).addClass("layer4");
  }
  else{
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
      targetElem=$(e.target).closest(".draggable")[0];
      //targetElem=e.target.parentNode;
    }

    if (targetElem.id==localStorage.getItem("targetSelected")){
      popBubbles();
      stripBorders();
      bubbleReceptiveDivs();
      $("#drawDisplay").addClass("layer4");
      $("#pageNavigation").addClass("layer4");
      localStorage.setItem("targetSelected", false);
      newHint("What's the difference between draggables that can or can't be selected in this phase?  It's the grey box. No use dynamically updating a value that won't be displayed, ya know?");
      insertDrawSlots([]);
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
      targetElem=$(e.target).closest(".draggable")[0];
    }


    targetID=targetElem.id;
    popBubbles();
    bubbleSenderDivs(targetID);
    highlightSendingDivs(draggables[targetID].drawsFrom);
    $("#drawDisplay").addClass("layer4");
    $("#pageNavigation").addClass("layer4");
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
        <td>${draggables[drawSources[i][0]].uiName}</td><td><input id="drawSource${drawSources[i][0]}" type="number" step="any" onchange="changeDrawRatio(this)" value="${drawSources[i][1]}"></td>
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

function updateAbilityMods(){
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
  let bonusList=JSON.parse(localStorage.getItem("bonusTypes"));
  let bonusTypes=Object.entries(bonusList);
  let toggleBoons={};
  let toggleLedger=Object.values(object.toggleEffects);





  if (!skipList){
    skipList=[];
  }

  let totalMod=0;

  object.drawsFrom.forEach(function(source){
    let sourceObj=draggables[source[0]];
    if (!sourceObj){
      return;
    }
    if (skipList.indexOf(sourceObj.id)>-1){
      alert(`Hey there, this is a message from Higgsy's Charsheet.  There seems to be an infinite loop going on involving draggable: "${sourceObj.uiName}".  This likely means that its been set to draw from another draggable that, somewhere down the line, draws from the original draggable again.  If you got this message it's likely a bug since we're supposed to prevent these loops from happening in the first place so please let me know (contact info in credits) and I'll get it fixed asap.  For now I've short-circuited the loop but this may have jumbled some of the math on your sheet.  This error will likely pop up at least one additional time with the name of the draggable it's looping with.  Sorry about this, please don't tell Higgsy.  `);
      return totalMod;
    }

    let drawnAmount=0;
    //check if sourceObj has to draw from anything itself.

    if(!isNaN(sourceObj.value)){
      skipList.push(object.id);

      sourceObj.finalMod=parseInt(sourceObj.value)+getDrawnMod(sourceObj, skipList);
    }


    // if(sourceObj.drawsFrom.length>0 && !isNaN(sourceObj.value)){
    //   skipList.push(object.id);
    //
    //   sourceObj.finalMod=parseInt(sourceObj.value)+getDrawnMod(sourceObj, skipList);
    // }
    // else{
    //   sourceObj.finalMod=sourceObj.value;
    // }





    if (sourceObj.activeRules.indexOf("abilityScore")>-1){
      drawnAmount=Math.floor(parseInt(sourceObj.finalMod)/2)-5;
      drawnAmount*=parseFloat(source[1]);

      //this is because while we store the final mod of ability scores as the raw number the actual modifier they offer is a bit odd in pathfinder.  10-11 is neutral, 12-13 is +1, 8-9 is -1, 6-7 is -2 and so and and so forth.
    }
    else{
      drawnAmount=(parseInt(sourceObj.finalMod)*parseFloat(source[1]));

    }




    totalMod+=drawnAmount;

  });



  if (object.value>0  && object.activeRules.indexOf("classSkill")>-1 ){
    totalMod+=3;
    //this is because class skills in pathfinder offer a +3 if at least one rank is applied to it
  }



  for (let i=0; i<bonusTypes.length;i++){
      toggleBoons[bonusTypes[i][0]] = 0;
    }

  if (toggleLedger){
      for (let i=0; i<toggleLedger.length;i++){
        let effectMod=toggleLedger[i][0][0];
        let effectType=toggleLedger[i][0][1];

        if (bonusList[effectType].stackable){
          toggleBoons[effectType]+=effectMod;
        }
        else if(effectMod>toggleBoons[effectType]){
            toggleBoons[effectType]=effectMod;
        }
      }
    }


  toggleBoons=Object.values(toggleBoons);
  for (let i=0; i<toggleBoons.length;i++){
    totalMod+=parseInt(toggleBoons[i]);
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
