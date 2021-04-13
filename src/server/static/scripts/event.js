var events = []
const EventType = {
    Personal: "Personal",
    Standard: "Standard"
}

const Day = {
    Sunday: "Sunday",
    Monday: "Monday",
    Tuesday: "Tuesday",
    Wednesday: "Wednesday",
    Thursday: "Thursday",
    Friday: "Friday",
    Saturday: "Saturday"
}

class CalendarEvent {
    name
    description
    color
    type = EventType.Standard
    daysActive = []
    startTime
    endTime
    startDate
    endDate

    constructor(name, description, color, eventType, daysActive, startTime, endTime, startDate, endDate) {
        //TODO make a validator for these like cant have end time before start time and date
        this.name = name;
        this.color = color;
        this.type = eventType;
        this.description = description;
        this.daysActive = daysActive;
        this.startTime = startTime;
        this.endTime = endTime;
        this.startDate = startDate;
        this.endDate = endDate
    }




}





$("#eventForm").submit(function (e) {
    e.preventDefault();
    $("#eventModal").modal('hide');
    var array = $("#eventForm").serializeArray()
    console.log(array)
    var eventType = EventType.Standard;
    var days = []
    var event = new CalendarEvent()
    array.forEach(element => {
        switch (element.name) {
            case "eventType":
                if (element.value == "on") {
                    eventType = EventType.Personal;
                }
                break;
            case "eventName":
                event.name = element.value;
                break;
            case "eventDescription":
                event.description = element.value;
                break;
            case Day.Sunday:
                days.push(Day.Sunday);
                break;
            case Day.Monday:
                days.push(Day.Monday);
                break;
            case Day.Tuesday:
                days.push(Day.Tuesday);
                break;
            case Day.Wednesday:
                days.push(Day.Wednesday);
                break;
            case Day.Thursday:
                days.push(Day.Thursday);
                break;
            case Day.Friday:
                days.push(Day.Friday);
                break;
            case Day.Saturday:
                days.push(Day.Saturday);
                break;

            case "eventStartDate":
                event.startDate = element.value;
                break;
            case "eventEndDate":
                event.endDate = element.value;
                break;
            case "eventStartTime":
                event.startTime = element.value;
                break;
            case "eventEndTime":
                event.endTime = element.value;
                break;
            case "eventColor":
                event.color = element.value;
                break;
            default:
                break;
        }
    });
    event.type = eventType;
    event.daysActive = days;
    console.log(event)
    events.push(event);
    insertEvent(event)

})

function insertEvent(event) {
    
    var table = document.getElementById("calendar-Body");
    var once = true;
    for (let row of table.rows) {
        if (once) {
            once= false;
            continue;
        }
        var makeChange = false;
        var newHeight = 0;
        for (let cell of row.cells) {
            //iterate through cells
            
            let date = new Date($(cell.children[0]).data("date"));
            
            let startDate = new Date(event.startDate+"T00:00:00");
            let endDate = new Date(event.endDate+"T00:00:00");
            //console.log(cell);
            // let month = date.getMonth() + 1; 
            // let day = date.getDate();
            // let year = date.getFullYear();
            // let dateString = year+"-"+month+"-"+day;
            //console.log(date, date.getTime() >= startDate.getTime() && date.getTime() <= endDate.getTime(), startDate, endDate)
            if (date.getTime() >= startDate.getTime() && date.getTime() <= endDate.getTime()) {
                let eventHtml = createEventHTML(event);
                let day = cell.children[0];
                let events = day.children[0];
                console.log(day);
                $(events).append(eventHtml);
                if ($(day).height()>newHeight) {
                    newHeight = $(day).height();
                    makeChange = true;
                }
                

            }
        }
        if (makeChange) {
            console.log(newHeight)
            for (let cell of row.cells) {
                let day = cell.children[0];
                
                $(day).css('min-height',newHeight+10);
                //$(day).css('height',newHeight);
                console.log($(day).height());
            }
        }
    }


}



$("#shareEventForm").submit(function (e) {
    e.preventDefault();
    console.log($("#shareEventForm").serializeArray())
    $("#shareEventModal").modal('hide');
})

$(".event").on("click", eventClick)
function eventClick() {
    $("#shareEventModal").modal('show');
    console.log(this);
}

function copyLink() {
    console.log("TODO copy link")
}


