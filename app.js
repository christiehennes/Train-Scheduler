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
    let trainFreq = parseInt($('#train-frequency').val());


    if ((trainName === '' || trainDest === '' || trainTime === '' || trainFreq === '')){
        displayError();
    }
    else{

        let nextTrain = calcNextTrain(trainTime, trainFreq);
        createTrain(trainName, trainDest, trainTime, trainFreq, nextTrain.nextTrain, nextTrain.numMins );
        
    }


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

let now = 0;
let next = 0;
let start = 0;

//Get the current time in minutes
now = parseInt((moment().hour() * 60) + moment().minute());
console.log(now);

//Convert the start time to minutes
start = parseInt((moment(time, "hh:mm").hour()*60) + moment(time, "hh:mm").minute());
console.log(start);

//compare the times. if star is before current, back pedal to find the difference
if (start < now){
    let diff = now - start;

    //If the difference and frequency hit an even number, find the time 
    if (diff % freq === 0){

        //Start the formatting
        next = Math.floor((now+freq) / 60) + ':';

        //Complete the formatting
        if(((now+freq) % 60) < 10){
            next = next + '0' + ((now+freq) % 60);
        }
        else{
            next = next + ((now+freq)%60);
        }

        //Create object and return it 
        let nextObj = {
            nextTrain: next,
            numMins: freq
        };
        return nextObj;
    }
    //Else, find the correct time 
    else{
       let delta = diff % freq;
       let next = parseInt(now + freq) - parseInt(delta);
       let mins = freq - delta;

      next =  Math.floor(next / 60) + ':' + (next % 60);

        let nextObj = {
            nextTrain: next,
            numMins: mins
        };
        return nextObj;
    }
}
else{

    let minsUntil = start - now;

    time = Math.floor(start / 60) + ':';
    if(start % 60 === 0){
        time = time + '00';
    }
    else{
        time = time + '0' + (start%60);
    }

    let nextObj = {
        nextTrain: time,
        numMins: minsUntil

    }
    return nextObj;
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

function displayError(){

    alert("Please enter a value for all fields to add to table");

}



//Update the train list on load
updateTrains();