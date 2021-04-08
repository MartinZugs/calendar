var currentDay = new Date();
var activeMonth = currentDay.getMonth();
//event for testing
var testEvent = {
    "color": "green",
    "name": "Test Event",
    "date": currentDay.toDateString()

}

function startOfMonth(date) {
    return new Date(date.getFullYear(), date.getMonth(), 1);
}

function generateCalendar(startDate) {
    var table = $("#calendar-Body > tbody");
    table.empty();
    var newStart = new Date(startDate.getFullYear(), startDate.getMonth(), startDate.getDate() - startDate.getDay());
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
    var events = document.createElement("div");
    events.className = "events";
    if (date.getMonth() == currentDay.getMonth() && date.getDate() == currentDay.getDate() && currentDay.getFullYear() == date.getFullYear()) {
        dayDiv.className = "day active";
    }
    //in future loop through events
    if (date.toDateString() == testEvent.date) {

        events.appendChild(createEventHTML(testEvent));
    }
    dayDiv.appendChild(events);
    day.appendChild(dayDiv);
    
    return day;
}

function createEventHTML(event) {
    var eventHTML = document.createElement("div");
    eventHTML.className = "event";
    var dot = document.createElement("span");
    dot.className = "eventDot " + event.color;
    var text = document.createElement("span");
    text.className = "eventText";
    text.innerHTML = event.name;
    eventHTML.appendChild(dot);
    eventHTML.appendChild(text);
    return eventHTML;
}

function previousMonth() {
    activeMonth--;
    var dt = new Date(currentDay.getFullYear(), activeMonth, 1);
    generateCalendar(dt);
    setMonthText(new Date(currentDay.getFullYear(), activeMonth, 1));

}
function nextMonth() {
    activeMonth++;
    var dt = new Date(currentDay.getFullYear(), activeMonth, 1);
    generateCalendar(dt);
    setMonthText(new Date(currentDay.getFullYear(), activeMonth, 1));
}

function setCurrentMonth() {
    activeMonth = currentDay.getMonth();
    var startDate = startOfMonth(currentDay);
    generateCalendar(startDate);
    setMonthText(new Date(currentDay.getFullYear(), activeMonth, 1));
}

function setMonthText(date) {
    const month = date.toLocaleString('default', { month: 'long' });
    $("#month").html(month);
}



$(document).ready(() => {

    console.log(testEvent);
    var startDate = startOfMonth(currentDay);
    generateCalendar(startDate);
});

