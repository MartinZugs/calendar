var currentDay = new Date();
var activeMonth = currentDay.getMonth();


const Day = {
    Sunday: "Sunday",
    Monday: "Monday",
    Tuesday: "Tuesday",
    Wednesday: "Wednesday",
    Thursday: "Thursday",
    Friday: "Friday",
    Saturday: "Saturday"
}

//event for testing
// var testEvent = {
//     "color": "#008000",
//     "name": "Test Event",
//     "startDate": formatDate(currentDay),
//     "endDate": formatDate(currentDay),
//     "startTime":"13:00",
//     "endTime":"15:00",
//     "type": "Standard",
//     "daysActive": [getFullDayName(currentDay)],
//     "timeSlotLength": "10",
//     "description":"test",
//     "signups":[]
// }




function startOfMonth(date) {
    return new Date(date.getFullYear(), date.getMonth(), 1);
}

function generateCalendar(startDate) {
    var table = $("#calendar-Body > tbody");
    table.empty();
    var newStart = new Date(startDate.getFullYear(), startDate.getMonth(), startDate.getDate() - startDate.getDay());
    setMonthText(new Date(startDate.getFullYear(), activeMonth, 1));
    for (let i = 0; i < 6; i++) {
        table.append(createWeek(new Date(newStart.getFullYear(), newStart.getMonth(), newStart.getDate() + 7 * i)));
    }

}

function createWeek(startDate) {
    var week = document.createElement("tr");
    for (let i = 0; i < 7; i++) {
        week.appendChild(createDay(new Date(startDate.getFullYear(), startDate.getMonth(), startDate.getDate() + i)));
        //console.log(startDate.getMonth())
    }
    return week;
}

function createDay(date) {
    var day = document.createElement("td");
    var dayDiv = document.createElement("div");
    dayDiv.className = "day";
    dayDiv.innerHTML = date.getDate();
    dayDiv.setAttribute("data-date", date.toString());
    $(dayDiv).data("date",date);
    var events = document.createElement("div");
    events.className = "events";
    if (date.getMonth() == currentDay.getMonth() && date.getDate() == currentDay.getDate() && currentDay.getFullYear() == date.getFullYear()) {
        dayDiv.className = "day active";
    }

    dayDiv.appendChild(events);
    day.appendChild(dayDiv);
    
    return day;
}



function previousMonth() {
    activeMonth--;
    var dt = new Date(currentDay.getFullYear(), activeMonth, 1);
    generateCalendar(dt);
    setMonthText(new Date(currentDay.getFullYear(), activeMonth, 1));

    events.forEach(element => {
        insertEvent(element);
    });
}

function nextMonth() {
    activeMonth++;
    var dt = new Date(currentDay.getFullYear(), activeMonth, 1);
    generateCalendar(dt);
    setMonthText(new Date(currentDay.getFullYear(), activeMonth, 1));

    events.forEach(element => {
        insertEvent(element);
    });
}

function setCurrentMonth() {
    activeMonth = currentDay.getMonth();
    var startDate = startOfMonth(currentDay);
    generateCalendar(startDate);
    setMonthText(new Date(currentDay.getFullYear(), activeMonth, 1));

    events.forEach(element => {
        insertEvent(element);
    });

}

function setMonthText(date) {
    const month = date.toLocaleString('default', { month: 'long' });
    var year= date.getFullYear();
    $("#month").html(month+", "+year);
}


function formatDate(date) {
    let year  = date.getFullYear(),
        month = "" + (date.getMonth()+1),
        day   = "" + date.getDate();
        
    if (day.length < 2) 
        day = "0" + day;
    if (month.length <2)
        month = "0" + month;
    
    return [year, month, day].join('-');
}

function formatTime(date) {
        let hour  = "" + (date.getHours()),
            minutes = "" + (date.getMinutes());

        if (hour.length < 2)
            hour = "0" + hour;
        if (minutes.length < 2)
            minutes = "0" + minutes;
        
        return [hour, minutes].join(":");
}



$(document).ready(() => {


    //console.log(testEvent);
    var startDate = startOfMonth(currentDay);
    generateCalendar(startDate);
    events.forEach((e)=>{
        insertEvent(e);
    })
    //insertEvent(testEvent);
});


function getFullDayName(date) {
    var day = date.toDateString().substring(0,3);
    switch(day) {
        case "Sun":
            return Day.Sunday;
        case "Mon":
            return Day.Monday;
        case "Tue":
            return Day.Tuesday;
        case "Wed":
            return Day.Wednesday;
        case "Thu":
            return Day.Thursday;
        case "Fri":
            return Day.Friday;
        case "Sat":
            return Day.Saturday;
        default:
            break;
}
}

