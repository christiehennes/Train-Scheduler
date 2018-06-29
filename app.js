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
    let trainTime = parseInt($('#train-time').val());
    let trainFreq = parseInt($('#train-frequency').val());


    console.log(trainName);
    console.log(trainDest);
    console.log(trainTime);
    console.log(trainFreq);

    let nextTrain = calcNextTrain(trainTime, trainFreq);
    createTrain(trainName, trainDest, trainTime, trainFreq, nextTrain.nextTrain, nextTrain.numMins );
    

});

//Functions

//Create employee -- push the data up to the db
function createTrain(name, dest, time, freq, next, mins){

    database.ref().push({
        Name: name,
        Destination: dest,
        Time: time,
        Freq: freq,
        NextTrain: next,
        MinsAway: mins
    });

}

function calcNextTrain(time, freq){

//Get the current time in minutes
let now = parseInt((moment().hour() * 60) + moment().minute());
console.log(now);

//Convert the start time to minutes
let start = parseInt((moment(time, "HH:mm").hour()*60) + moment(time, "HH:mm").minute());
console.log(start);

//compare the times. if star is before current, back pedal to find the difference
if (start < now){
    let diff = now - start;
    if (diff % freq === 0){
        console.log("time is now");

        let nextObj = {
            nextTrain: moment().minutes(now+freq).format("HH:mm"),
            numMins: freq
        };
        return nextObj;
    }
    else{
       let delta = diff % freq;
       console.log(diff);
       console.log(delta);

       console.log(now);
       let next = parseInt(now + freq) - parseInt(delta);
       let mins = freq - delta;
       console.log(next);
        let nextObj = {
            nextTrain: moment().minutes(next).format("HH:mm"),
            numMins: mins
        };
        return nextObj;
    }
}


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
              ${val.NextTrain}
              </td>
              <td>
              ${val.MinsAway}
              </td>
            </tr>
            `
        )

    });
}

//Update the train list on load
updateTrains();