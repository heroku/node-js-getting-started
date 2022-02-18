
var Number = 4;


function AddActivity() {

  Number += 1;

  document.querySelector("table").innerHTML += '<tr>    <td> Activity ' + Number + '</td> <td> A' + Number + '</td> <td> <input class="textbox" size="2" id="Weight' + Number + '"> </input> </td>  <td> <input class="textbox" size="2" id="Top' + Number + '"> </input> <p3> / </p3> <input class="textbox" size="2" id="Bottom' + Number + '"> </input> </td>  <td id="P' + Number + '"></td></tr>';
  
}

document.addEventListener("keyup", function () {

for (var x = 1; x < Number + 1; x++ ){

  let inputWeight = document.querySelector("#Weight" + x).value;
  let inputTop = document.querySelector("#Top" + x).value;
  let inputBottom = document.querySelector("#Bottom" + x).value;

  Percentage = inputTop / inputBottom;
  Percentage = Percentage * 100; 
  Percentage = Percentage.toFixed(2);

  
  if (!isNaN(Percentage) && isFinite(Percentage)) {
    document.querySelector("#P" + x).innerHTML = Percentage + "%";
     }

  else{
    document.querySelector("#P" + x).innerHTML = " "
    }
  }
})


function TotalMean() {

  var Total = 0;
  var Mean = 0;
  var counter = 0;

  for (var x = 1; x < Number + 1; x++ ) {

    Total += document.querySelector("#Top" + x).value / document.querySelector("#Bottom" + x).value;
    
    counter += 1;
    }

   Mean = Total / counter;
   Mean = Mean * 100;
   Mean = Mean.toFixed(2);

   if (!isNaN(Mean) && isFinite(Mean)) { 

     document.querySelector("#Print").innerHTML = "Your Mean Grade is: " + Mean + "%";
   }

   else {
   	document.querySelector("#Print").innerHTML = "Please Fill in the Missing Grades"
   }
}



function TotalWeight() {

  var Total = 0;
  var TempWeight = 0;
  var Weight = 0;
  var counter = 0;

  for (var x = 1; x < Number + 1; x++ ) {

    if (document.querySelector("#Weight" + x).value != " " && document.querySelector("#Top" + x).value != " " && document.querySelector("#Bottom" + x).value != " ") {

    TempWeight += document.querySelector("#Weight" + x).value * document.querySelector("#Top" + x).value / document.querySelector("#Bottom" + x).value;

    Weight += document.querySelector("#Weight" + x).value*1;
      }
  }

    Total = TempWeight / Weight;
    Total = Total * 100;
    Total = Total.toFixed(2);

  if (!isNaN(Total) && isFinite(Total)) { 

     document.querySelector("#Print").innerHTML = "Your Weighted Grade is: " +  Total + "%";
   }

   else {
    document.querySelector("#Print").innerHTML = "Please Fill in the Missing Values"
    }


}
