let config = {
    apiKey: "AIzaSyC329vGMXLuMFL0BKPCjtbXYcCgWS6oD0k",
    authDomain: "train-scheduler-6f82b.firebaseapp.com",
    databaseURL: "https://train-scheduler-6f82b.firebaseio.com",
    projectId: "train-scheduler-6f82b",
    storageBucket: "train-scheduler-6f82b.appspot.com",
    messagingSenderId: "918594800229"
  };
  firebase.initializeApp(config);

let database = firebase.database();


//Click hander for add button 
$('#add-button').on('click', function(){

    event.preventDefault();

    let trainName = $('#train-name').val();
    let trainDest = $('#train-destination').val();
    let trainTime = $('#train-time').val();
    let trainFreq = $('#train-frequency').val();


    console.log(trainName);
    console.log(trainDest);
    console.log(trainTime);
    console.log(trainFreq);

    createTrain(trainName, trainDest, trainTime, trainFreq);
    

});

//Functions

//Create employee -- push the data up to the db
function createTrain(name, dest, time, freq){

    database.ref().push({
        Name: name,
        Destination: dest,
        Time: time,
        Freq: freq
    });

   

   // function convertDate(startDate){

    //     console.log(startDate);

    //     //Get the time now 
    //     let todayDate = Date.now();
    //     console.log(todayDate);


    //    //Convert the startDate into a different time format  
    //    let convertedTime = Date(startDate);
    //    console.log(convertedTime);

    //    var array = new Array();

    //    array = startDate.split('/');
    //     let mili = Date.UTC(array[2], array[0], array[1]);
    //     console.log(mili);

        //return monthsWorked = Math.abs(moment().diff(moment(startDate), 'months'));


    //    var convertedTime_utc =  Date.UTC(date.getUTCFullYear(), date.getUTCMonth(), date.getUTCDate(),
    //     date.getUTCHours(), date.getUTCMinutes(), date.getUTCSeconds());
   // }

}

function updateTrains(){

    $('#table').empty();

    database.ref().on('child_added', function(snapshot){

        let val = snapshot.val();

        $('#tbody').append(
            `
            <tr>
              <td>
              ${val.Name}
              </td>
              <td>
              ${val.Destination}
              </td>
              <td>
              ${val.Freq}
              </td>
              <td>
              
              </td>
              <td>
              
              </td>
            </tr>
            `
        )

    });
}

//Update the train list on load
updateTrains();