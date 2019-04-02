function loadStorage(defaultCharSheet){
  let defaultCharInfo={
    "charName":"Sample",
    "charSheets":[defaultCharSheet],
    "id":0,
    "activeSheet":0,
    "activePage":0,
    "totalPages":1,
    "activeToggleBar":0,
    "toggleBarTitles":["New ToggleBar"],
    "totalToggleBars":1
  };
  //setting up local Storage after a reset
  let savedChars=[defaultCharInfo];
  let bonusTypes={
    "Alchemical":{
      stackable:false,
      category:"General Purpose"
    },
    "Armor":{
      stackable:false,
      category:"Armor Class Specific"
    },
    "Circumstance":{
      stackable:true,
      category:"General Purpose"
    },
    "Competence":{
      stackable:false,
      category:"General Purpose"
    },
    "Deflection":{
      stackable:false,
      category:"Armor Class Specific"
    },
    "Dodge":{
      stackable:true,
      category:"Armor Class Specific"
    },
    "Enhancement":{
      stackable:false,
      category:"General Purpose"
    },
    "Inherent":{
      stackable:false,
      category:"Ability Score Specific"
    },
    "Insight":{
      stackable:false,
      category:"General Purpose"
    },
    "Luck":{
      stackable:false,
      category:"General Purpose"
    },
    "Morale":{
      stackable:false,
      category:"General Purpose"
    },
    "Natural_Armor":{
      stackable:false,
      category:"Armor Class Specific"
    },
    "Profane":{
      stackable:false,
      category:"General Purpose"
    },
    "Racial":{
      stackable:false,
      category:"General Purpose"
    },
    "Resistance":{
      stackable:false,
      category:"General Purpose"
    },
    "Sacred":{
      stackable:false,
      category:"General Purpose"
    },
    "Shield":{
      stackable:false,
      category:"Armor Class Specific"
    },
    "Size":{
      stackable:false,
      category:"General Purpose"
    },
    "Trait":{
      stackable:false,
      category:"General Purpose"
    },
    "Untyped":{
      stackable:true,
      category:"General Purpose"
    }

  }



  if (localStorage.getItem("savedChars") === null) {
    localStorage.setItem('savedChars', JSON.stringify(savedChars));
  }

localStorage.setItem('defaultCharSheet', JSON.stringify(defaultCharSheet));
  if (localStorage.getItem("defaultCharSheet") === null) {
    localStorage.setItem('defaultCharSheet', JSON.stringify(defaultCharSheet));
  }

  if (localStorage.getItem("activeChar") === null) {
    localStorage.setItem('activeChar', 0);
  }

  if (localStorage.getItem("bonusTypes") === null) {
    localStorage.setItem('bonusTypes', JSON.stringify(bonusTypes));
  }


}


function loadBible(json){
  console.log("loading bible");

  if (localStorage.getItem("styleBible") === null) {
    localStorage.setItem('styleBible', JSON.stringify(json));
  }
}






function resetStorage(){
  if (window.confirm("Do you really want to delete all your saved info?")) {
  localStorage.clear();
  location.reload();
}
}
