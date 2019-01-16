function loadStorage(defaultCharSheet){
  let defaultCharInfo={
    "charName":"Sample",
    "charSheets":[defaultCharSheet],
    "id":0,
    "activeSheet":0,
    "activePage":0,
    "totalPages":1
  };
  //setting up local Storage after a reset
  let savedChars=[defaultCharInfo];

  if (localStorage.getItem("savedChars") === null) {
    localStorage.setItem('savedChars', JSON.stringify(savedChars));
  }

  if (localStorage.getItem("activeChar") === null) {
    localStorage.setItem('activeChar', 0);
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
