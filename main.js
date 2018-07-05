
 $( document ).ready(function(){
    //the username from the page



    var config = {
    apiKey: "AIzaSyDGslo5TDUNWXb1yiwWVOeZP5ZY1pl32xc",
    authDomain: "train-time2.firebaseapp.com",
    databaseURL: "https://train-time2.firebaseio.com",
    projectId: "train-time2",
    storageBucket: "",
    messagingSenderId: "563100923857"
    };

    firebase.initializeApp(config);
    
    var dataRef = firebase.database();

//I MADE THIS IT ME PRINCESS TAYLOR. WIP

$("#add-user").click(function(){


    event.preventDefault();

      //the username from the page
      var username = $('#name-input').val().trim();
      console.log("Latest name = " + username);
      //the user role from the page
      var userrole = $('#role-input').val().trim();
      console.log("Latest role = " + userrole);
      //the start date form the page
      var userstartdate = $('#date-input').val().trim();
      console.log("Latest start date = " + userstartdate);
      //the rate from the page
      var userrate = $('#rate-input').val().trim();
      console.log("Latest rate = "+ userrate);
  
      //the math allowing total
      var firstTimeConverted = moment(userrate, "HH:mm").subtract(1, "years");
      console.log(firstTimeConverted);
      var currentTime = moment();
      console.log(currentTime);
      var diffTime = moment().diff(moment(firstTimeConverted), "minutes");
      console.log(diffTime);
      var tRemainder = diffTime % userstartdate;
      console.log(tRemainder);
      var tMinutesTillTrain = userstartdate - tRemainder;
      console.log(tMinutesTillTrain);
      var usertotalcomp = moment().add(tMinutesTillTrain, "minutes").toLocaleString(); // to locale string so that it will pass into firebase since firebase is whiny about functions, have to reconvert in other function
      console.log(moment(usertotalcomp).format("hh:mm"));

      //local object for holding data to be passed through firebase and into new function
      var databaseobject = {
            trainname: username,
            destination: userrole,
            nextarrival: usertotalcomp,
            frequency: userstartdate,
            minutesaway: tMinutesTillTrain, //this one is wrong
            dateAdded: firebase.database.ServerValue.TIMESTAMP
        
      }

          // Uploads data
          dataRef.ref().push(databaseobject);

          alert("Employee successfully added");

        // Clears all of the text-boxes
        $("#name-input").val("");
        $("#role-input").val("");
        $("#date-input").val("");
        $("#rate-input").val("");

        });


    //===Grabbing data from the database =====================================

    //debug notes = Is it thinking a child is added when nothing is happening? It runs before we have a chance to put in any data and it is something intrinsic to the firebase issue

    //Update the HTML everytime a child is added to our form element, using the data we pushed to firebase
    dataRef.ref().on("child_added", function(snapshot) {

      console.log("THIS IS THE PROBLEM!");



    console.log("this is the current snapshot = " + snapshot.val());

    //store firebase values into local variables
    var dataname = snapshot.val().trainname;
    var datadest = snapshot.val().destination;
    var dataarrival = snapshot.val().nextarrival;
    var datafrequency = snapshot.val().frequency;
    var dataminutes = snapshot.val().minutesaway;


    //USERRATE IS NOW THE NEXT ARRIVAL TIME, USERSTARTDATE IS THE FREQUENCY AND TOTALCOMP NEEDS SOME MATH

    //this segment creates the html

    //creates the row container on the list
    var rowadd = $('<tr>');
    //creates the bold header under employee name from the field
    var namehead = $('<th>');
    namehead.html(dataname);
    //creates the role data asset under role
    var roledata = $('<td>');
    roledata.html(datadest);
    //creates the data data asset under date  THIS IS NOW FREQUENCY
    var datedata = $('<td>');
    datedata.html(datafrequency);
    //creates the monthly rate asset THIS IS NOW NEXT ARRIVAL moment(dataarrival).format("hh:mm")
    var ratedata = $('<td>');
    ratedata.html(dataarrival);
    //creates the total comp asset THIS IS NOW THE MINUTES AWAY
    var totalcomp = $('<td>');
    totalcomp.html(dataminutes);

    
  
    rowadd.append(namehead);
    rowadd.append(roledata);
    rowadd.append(datedata);
    rowadd.append(ratedata);
    rowadd.append(totalcomp);
    //add the complete table row to the tbody element
    $('tbody').append(rowadd);

    //simply logs the snapshot values after they have gone through the function

      var newPost = snapshot.val();
      console.log("Latest train name: " + newPost.trainname);
      console.log("Latest destination: " + newPost.destination);
      console.log("Latest frequency: " + newPost.frequency);
      console.log("Latest arrival data: " + newPost.nextarrival);
      console.log("Latest minutes away: " + newPost.minutesaway);

      
    });


 });
