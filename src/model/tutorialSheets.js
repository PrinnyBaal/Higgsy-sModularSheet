

let avatarHiggs={
  laugh:"https://res.cloudinary.com/metaverse/image/upload/v1541010546/Avatars/Higgsy/side_higgsLaugh.png",
  snide:"https://res.cloudinary.com/metaverse/image/upload/v1541010541/Avatars/Higgsy/side_higgsSnide.png",
  shocked:"https://res.cloudinary.com/metaverse/image/upload/v1541010539/Avatars/Higgsy/side_higgsShocked.png",
  normal:"https://res.cloudinary.com/metaverse/image/upload/v1541010543/Avatars/Higgsy/side_higgsNormal.png",
  drained:"https://res.cloudinary.com/metaverse/image/upload/v1541010547/Avatars/Higgsy/side_higgsDrained.png",
  mad:"https://res.cloudinary.com/metaverse/image/upload/v1541010545/Avatars/Higgsy/side_higgsMad.png",
}

function exitTutorial(){
  localStorage.setItem("tutorialSkip", true);
  let grey=document.getElementById('tutorialOverlay');
  let query=document.getElementById('tutorialQueryBox');
  let dialogue=document.getElementById('tutorialDialogueBox');
  grey.parentNode.removeChild(grey);
  query.parentNode.removeChild(query);
  dialogue.parentNode.removeChild(dialogue);
}

function resetTutorial(){
  localStorage.setItem("tutorialSkip", false);
  location.reload();
}


function Tutorial(){
  $("#tutorialOverlay").remove();
  this.genAvatar=`${avatarHiggs.laugh}`;
  this.overlay=`<div id="tutorialOverlay" class="overlay" style="z-index:4;"></div>`;
  this.queryBox=`<div id="tutorialQueryBox" style="background-color:#d6c3a4; border-color: #a7834b; border-style: solid; border-radius:5%; height:13vh; width:15vw; left:40%;  top:30%; position:absolute; text-align:center; font-size:1vw; z-index:6;"> Play tutorial? <button style="position:absolute; bottom:5%; left:20%;" id="tutorialYesButton" class="trayButton darkWoodBtn"> Yes</button>
  <button class="trayButton darkWoodBtn" style="position:absolute; bottom:5%; right:20%;" id="tutorialNoButton">No</button></div>`;
  this.dialogueBox=`<div id="tutorialDialogueBox" class="container-fluid" style="color:white; background-color:black; height:30vh; width:100vw; bottom: 0; position:absolute; z-index:10;">
    <div class="row h-100" style="z-index:6;">
    <div id="tutorialAvatar" style="background-image: url(${this.genAvatar});  background-size: 100% 100%; background-repeat:no-repeat; background-color:brown; border-style: solid;
    border-width: 5px; border-color:white; border-radius:5px; z-index:7;" class="col-2"></div>
    <div id="tutorialDialogue" class="col-9 pt-3" style="font-size:1.25vw; z-index:6;"></div>
    <div class="col-1" style="z-index:7;"><button  id="tutorialNextButton" class="trayButton darkWoodBtn mt-4" onclick="tutorialChangeFrame()">Next</button></div>
    </div>
  </div>`;

  this.currentFrame=0;
  this.frames=[];
  this.highlighted=[];

  this.changeFrame=function(){
    this.currentFrame++;
    let highlighted=this.highlighted;
    if (highlighted.length){
      for (let i=0; i< highlighted.length; i++){
        $(highlighted[i]).css("z-index", "");
      }
      this.highlighted=[];
    }
    if (this.frames ===undefined){
      return
    }
    else if (this.currentFrame>=this.frames.length){
            $("#tutorialNextButton").attr("onclick",'exitTutorial()');
            return
    }
    else if (this.currentFrame==this.frames.length-1){
      $("#tutorialNextButton").attr("onclick",'exitTutorial()');
    }
    let frameChanges=this.frames[this.currentFrame];
    $("#tutorialDialogue").html(frameChanges.dialogue);

    if (frameChanges.position=="floatText"){; $('#tutorialDialogueBox').css({'bottom': '', 'top': 0}); }
    else{$('#tutorialDialogueBox').css({'bottom': 0, 'top': ''});}

    //set the highlights to actually work
    if (frameChanges.highlights.length){frameChanges.highlights.forEach(function(highlight){$(highlight).css("z-index", 5);openingTutorial.highlighted.push(highlight);});}

    if (frameChanges.newImage){$('#tutorialAvatar').css("background-image",`url(${frameChanges.newImage})`);}
    else{$('#tutorialAvatar').css("background-image",`url(${this.genAvatar})`);}

    if(frameChanges.clickToProceed===false){ $("#tutorialNextButton").attr("disabled",true);}
    else{ $("#tutorialNextButton").attr("disabled",false);}

    if(frameChanges.queryUser){ $("#tutorialQueryBox").css("display","block");}
    else{ $("#tutorialQueryBox").css("display","none");}

    if(frameChanges.answerYes){$("#tutorialYesButton").attr("onclick",`tutorialChangeFrame()`);}

    if(frameChanges.answerNo){$("#tutorialNoButton").attr("onclick",'exitTutorial()');}
  }

  this.addFrame=function(dialogue, position, highlights, newImage, clickToProceed, queryUser, answerYes, answerNo){
    let newFrame={};
    if (!dialogue){dialogue="";}
    if (!position){position="sinkText";}
    if (!highlights){highlights=[];}
    if (!newImage){newImage=false;}
    if (clickToProceed===undefined){clickToProceed=true;}
    if (!queryUser){queryUser=false;}
    if (!answerYes){answerYes=false;}
    if (!answerNo){answerNo=false;}

    newFrame.dialogue=dialogue;
    newFrame.position=position;
    newFrame.highlights=highlights;
    newFrame.newImage=newImage;
    newFrame.clickToProceed=clickToProceed;
    newFrame.queryUser=queryUser;
    newFrame.answerYes=answerYes;
    newFrame.answerNo=answerNo;

    this.frames.push(newFrame);
  }
}

function tutorialChangeFrame(){
  openingTutorial.changeFrame();
}

function runTutorial(){
  let tutorial=openingTutorial;
  if (!$("#tutorialOverlay").length){
    $("body").append(tutorial.overlay);
    $("body").append(tutorial.queryBox);
    $("body").append(tutorial.dialogueBox);
    document.getElementById('tutorialOverlay').style.display= "block";
    tutorial.currentFrame--;
  }

  tutorial.changeFrame();
}

let openingTutorial=new Tutorial();

openingTutorial.addFrame("Hi there, it looks like you <i>might</i> be new.  Would you like me to give you a tour?  If you say no you can always change your mind by scrolling down and pressing the blue 'Replay Tour' button (I'm kinda covering it up right now but it's at the bottom-right the page).", "sinkText", false, avatarHiggs.normal, false, true, openingTutorial.changeFrame, exitTutorial);
openingTutorial.addFrame("Great!  Well I guess first off you can call me Higgsy, artificer extraordinaire.  To proceed through the tour just click the 'next' button over on the right, if it's inactive though just look for any on-screen instructions.");
openingTutorial.addFrame("Our first stop is the character sheet.  That's where you'll spend most of your time since it's where you'll find all your...oh I should probably explain what draggables are...", "sinkText", false, avatarHiggs.snide);
openingTutorial.addFrame("You see, with this character sheet you can add, remove, rearrange, or resize different boxes that you can then cram your character's info into.  Since you can drag these segments around I gave the name 'draggables'.  Cute, right?");
openingTutorial.addFrame("Anywho, let me go ahead and highlight the sheet for you.  You should currently be seeing the sample sheet of Ron the Sample Barbarian.  If a Draggable is unlocked it will have a shadow effect beneath it.  To lock/unlock a draggable just double click it.  When unlocked you'll be able to grab and drag it around anywhere on the sheet that you'd like.  Pull at its bottom or right border to resize it instead.","sinkText", ["#activeSheet"]);
openingTutorial.addFrame("Eventually you'll be able to have a sheet with multiple pages.  This is just a proof of concept until the folks in their ivory wizard's tower sign off on an expansion.  Since apparantly my funding's on thin ice after the <i>incident</i>...","sinkText", ["#lapidary"], avatarHiggs.mad);
openingTutorial.addFrame("But nevermind that! I've highlighted a column here on the right too this time.  Whenever you click a draggable you'll see some of its information displayed on the top of this column.  From here you can give the draggable a collective name, write additional notes about it, put it in a special category like 'abilityScore' that changes how we treat it when doing math behind the scenes,  or just delete that sucker.  Don't worry it's never been proven that Draggables feel pain.  If you want to hide this column just click that button with the 'arrows' on it.  Next..." ,"sinkText", ["#activeSheet", "#palette"], avatarHiggs.normal);
openingTutorial.addFrame("The next thing you'll notice is a box labeled 'Draggable Palette'.  If you want to add a new draggable to your sheet just click one of the styles shown here.  They might not look like the prettiest options right now but they get the job done.  Note that draggables with grey boxes are dynamic.  That is, the value in the grey boxes can automatically change to reflect changes elsewhere on your character sheet.  But we'll get into how to make that happen a little later, for now..." ,"sinkText", ["#activeSheet", "#palette"]);
openingTutorial.addFrame("...just know that your draggables can be made up of 1-3 different components as of the latest update.  White components represent a value you can edit and we can attempt to do some math with it behind the scenes if it's a number.  Black components work a lot like white components except they're purely cosmetic and we'll never look at them for behind-the-scenes math.  Finally the grey components cannot be manually edited but will instead update themselves to show the final value of the draggable after any behind-the-scenes math is done." ,"sinkText", ["#activeSheet", "#palette"]);
openingTutorial.addFrame("Next, take a look at the buttons below the Draggable Palette.  Clicking 'Print' will open up an image version of your sheet for easy printing.  While changes you make in the values of your draggables will automatically be saved, to save their current physical position on your sheet you'll need to click the 'Save' button.  Clicking 'Clear Sheet' will scrub the sheet clean of all draggables and let you start designing from scratch. Credits will show you artist names and some contact info,  and settings is under development. Finally that red button that screams 'do not touch'?  Well, actually it screams 'Reset Storage' but close enough.  Clicking that will reset everything as though you were opening up this sheet for the very first time. And of course the blue button will let you replay this tutorial.  Anyway just two more things to talk about and we're done..." ,"floatText", ["#activeSheet", "#palette"], avatarHiggs.normal);
openingTutorial.addFrame("This box here on the left will spout out some contextual tips.  Mostly it's meant as a compromise for all those people who decided to skip my tour.  Thankfully <i>you're</i> not one of THOSE types so let me just get out of the way a little and we can move on~" ,"sinkText", ["#hintBox"], avatarHiggs.snide);
openingTutorial.addFrame("Alright now it's time to learn a little about dynamic boxes.  Note the button in this box here.  You can click it to open up the Relationship Overlay...wow really that's what we called it?  Anyway don't actually do that yet though.  WAIT...did you...quick, go to the next line!!!", "floatText", ["#activeSheet", "#drawDisplay"], avatarHiggs.shocked);
openingTutorial.addFrame("Ah-ha, actually it's fine if you did, just click the button again to toggle it off.  It's just that the hint box is probably a little more efficient at helping you play around with this feature.  Just to give you a short and sweet description though, once you toggle on that view it will highlight any dynamic boxes that can show their updated value.  Those would be the ones with the grey boxes I mentioned before, remember?", "floatText", ["#activeSheet", "#drawDisplay", "#hintBox"]);
openingTutorial.addFrame("After that you can click any draggables that have a numerical value, ones with the white boxes if you'll recall, to make a relationship between them and the dynamic draggable you picked at first.  When one of the related draggable's value goes up, the dynamic draggable's value will go up.  You can also set the strength of this relationship so you can do things like add half your level to your damage or even make the relationship negative.", "floatText", ["#activeSheet", "#drawDisplay", "#hintBox"]);
openingTutorial.addFrame("Okay, that brings us to us to the end of our tour for now.  In the future we'll have some new features to talk about like saving/loading different character sheets, having character sheets with multiple pages, color swapping, linking draggables to web-pages for references, and my personal favorite the ability to turn on a 'skillbar' to toggle the effects of spells and abilities on/off your character.");
openingTutorial.addFrame("If you encounter any bugs or have any feature requests get in contact with my assistant.  You can find his contact information in the credits tab.  If you have any complaints send those over too...unless they're about me!  ...fine, okay, even if they're about me.  Higgsy, out!");
