

    if (user) {
        console.log(user);
    }
//temporary will be stored in localstorage    
console.log(events)
//events.push(testEvent);
//console.log(events);
const EventType = {
    Personal: "Personal",
    Standard: "Standard"
}

class SignUp {
    name
    email
    
    startTime
    endTime

    constructor(name, email, startTime, endTime) {
        this.name = name;
        this.email = email;
        
        this.startTime = startTime;
        this.endTime = endTime;
    }
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
    timeSlotLength
    signups = []

    constructor(name, description, color, eventType, daysActive, startTime, endTime, startDate, endDate, timeSlotLength, signups) {
        //TODO make a validator for these like cant have end time before start time and date
        this.name = name;
        this.color = color;
        this.type = eventType;
        this.description = description;
        this.daysActive = daysActive;
        this.startTime = startTime;
        this.endTime = endTime;
        this.startDate = startDate;
        this.endDate = endDate;
        this.timeSlotLength = timeSlotLength;
        this.signups = signups;
    }

}


function openCreateEventForm() {
    $("#eventModal").modal('show');
    resetEventForm();
    $('#eventModal .modal-title').text('Create Event');
    var dateString = formatDate(currentDay);
    var time = formatTime(currentDay);
    
    $("#event-startdate-input").val(dateString);
    $("#event-enddate-input").val(dateString);
    $("#start-time-input").val(time);
    $("#end-time-input").val(time);
    //var day = currentDay.toDateString().substring(0,3);
    
    $("#"+getFullDayName(currentDay).toLowerCase()+"Checkbox").prop("checked", true);
    $("label[for='"+getFullDayName(currentDay).toLowerCase()+"Checkbox"+"']").removeClass("inactiveDay"); 
    $("label[for='"+getFullDayName(currentDay).toLowerCase()+"Checkbox"+"']").addClass("activeDay"); 
    $( "#eventShare" ).hide();
    $("#eventSignUps").hide();
    $("#eventDelete").hide();
    $( "#eventForm" ).unbind();
    $( "#eventForm" ).submit((e)=> {
        e.preventDefault();
        submitCreateEvent();
    });
}

function resetEventForm() {
    $("#eventForm").trigger("reset");
    for(let [key, day] of Object.entries(Day)) {
        //day = day.substring(0,3);
        
        $("label[for='"+day.toLowerCase()+"Checkbox"+"']").addClass("inactiveDay"); 
        $("label[for='"+day.toLowerCase()+"Checkbox"+"']").removeClass("activeDay"); 
    }
        
    
    
}

function openEditEventForm(event) {
    $("#eventModal").modal('show');
    $('#eventModal .modal-title').text('Edit Event');
    resetEventForm();

    $("#eventShare").show();
    $("#eventShare").click((e)=>{openShareEvent(event);});

    $("#eventSignUps").show();
    $("#eventSignUps").click((e)=>{openEventSignUps(event)});

    $("#eventDelete").show();
    $("#eventDelete").on("click",(e)=>{e.preventDefault(); openDeleteEvent(event);});
    fillEventForm(event);
    
    $( "#eventForm" ).unbind();
    $( "#eventForm" ).submit((e)=> {
        e.preventDefault();
        submitEditEvent(event);
    });
}


function openEventSignUps(event) {

}

function openDeleteEvent(event) {
    $("#eventModal").modal('hide');
    $("#confirmModal").modal('show');
    $("#confirmSubmision").unbind();
    $("#confirmSubmision").on("submit", (e)=> {
        e.preventDefault();
        var index = events.indexOf(event);
        events.splice(index,1);
        removeEventHtml(event);
        
        $.ajax(
            {
                method: "POST",
                url: `/calendar/${user.username}/removeEvent`,
                type: "application/json",
                data: JSON.stringify(event),
                success: (e)=> {
                    createAlert(JSON.parse(e))
                }
            }
        )

        $("#confirmModal").modal('hide');
    })

}

function fillEventForm(event) {
    if (event.type == EventType.Personal) {
        $("#eventSwitch").prop("checked", true);
    }
    
    $("#inputEventName").val(event.name);
    $("#inputEventDiscription").val(event.description);

    event.daysActive.forEach((day)=> {
        //console.log(day);
        $("label[for='"+day.toLowerCase()+"Checkbox"+"']").removeClass("inactiveDay"); 
        $("label[for='"+day.toLowerCase()+"Checkbox"+"']").addClass("activeDay"); 
        $("#"+day.toLowerCase()+"Checkbox").prop("checked", true);
    })
    
    $("#event-startdate-input").val(event.startDate);
    $("#event-enddate-input").val(event.endDate);
    $("#start-time-input").val(event.startTime);
    $("#end-time-input").val(event.endTime);
    $("#eventcolor-input").val(event.color);
    $("#event-timeLength-input").val(event.timeSlotLength);

}


function createEventHTML(event) {
    var eventHTML = document.createElement("div");
    eventHTML.className = "calendarEvent";
    $(eventHTML).data("event", event);
    var dot = document.createElement("span");
    dot.className = "eventDot";
    dot.style.backgroundColor = event.color;
    var text = document.createElement("span");
    text.className = "eventText";
    text.innerHTML = event.name;
    eventHTML.onclick = eventClick;
    eventHTML.appendChild(dot);
    eventHTML.appendChild(text);
    
    return eventHTML;
}

function fillEvent(event, array) {
    var eventType = EventType.Standard;
    var days = []
    array.forEach(element => {
        
        switch (element.name) {
            case "eventType":
                
                eventType = EventType.Personal;
                
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
                //console.log(element.value)
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
            case "eventTimeSlotLength":
                event.timeSlotLength = element.value;
                break;
            default:
                break;
        }
    });
    event.type = eventType;
    event.daysActive = days;
    
}

function submitCreateEvent() {
    $("#eventModal").modal('hide');
    var array = $("#eventForm").serializeArray()
    console.log(array)
    
    var event = new CalendarEvent()
    fillEvent(event, array);
    
    
    events.push(event);
    //console.log(events);
    insertEvent(event);
    $.ajax(
        {
            method: "POST",
            url: `/calendar/${user.username}/addEvent`,
            type: "application/json",
            data: JSON.stringify(event),
            success: (e)=> {
                createAlert(JSON.parse(e))
            }
        }
    )
}

function submitEditEvent(event) {
    $("#eventModal").modal('hide');
    var array = $("#eventForm").serializeArray()
    //console.log(array)
    
    //var event = new CalendarEvent()
    fillEvent(event, array);
    
    //console.log(event);
    //console.log(events);
    //$(eventHTML).data("event", event);
    //events.push(event);
    updateEventHTML(event);
    $.ajax(
        {
            method: "POST",
            url: `/calendar/${user.username}/updateEvent`,
            type: "application/json",
            data: JSON.stringify(event),
            success: (e)=> {
                createAlert(JSON.parse(e))
            }
        }
    )
    //insertEvent(event);
}


function createAlert(alert) {
    
    if (alert.type == "success") 
    {
        
        $('#alerts').append(
            '<div class="alert alert-success" >' +
                '<button type="button" class="close" data-dismiss="alert" aria-label="Close">' +
                '<span aria-hidden="true">&times;</span>' +
                '</button>' + alert.message + '</div>');
        
    }
    else 
    {

    }
}

function updateEventHTML(event) {
    var table = document.getElementById("calendar-Body");
    var once = true;
    for (let row of table.rows) {
        if (once) {
            once = false;
            continue;
        }
        
        for (let cell of row.cells) {
            let date = new Date($(cell.children[0]).data("date"));

            let startDate = new Date(event.startDate + "T00:00:00");
            let endDate = new Date(event.endDate + "T00:00:00");
            //console.log(cell);
            // let month = date.getMonth() + 1; 
            // let day = date.getDate();
            // let year = date.getFullYear();
            // let dateString = year+"-"+month+"-"+day;
            //console.log(date, date.getTime() >= startDate.getTime() && date.getTime() <= endDate.getTime(), startDate, endDate)
            var dateName = date.toLocaleDateString('default', { weekday: 'long' });
            let day = cell.children[0];
            let events = day.children[0];
            
            if (events.children.length >0) {
                
                Array.from(events.children).forEach((e)=> {
                    let item = $(e).data("event");
                    //console.log(item);
                    if (item.name == event.name) {
                        $(e).remove();
                    }
                });
            }
            
            

            if (date.getTime() >= startDate.getTime() && date.getTime() <= endDate.getTime() && event.daysActive.includes(dateName)) {
                let eventHtml = createEventHTML(event);
                
                //console.log(day);
                $(events).append(eventHtml);
                


            }
        }
    }
}

function removeEventHtml(event) {
    var table = document.getElementById("calendar-Body");
    var once = true;
    for (let row of table.rows) {
        if (once) {
            once = false;
            continue;
        }
        
        for (let cell of row.cells) {
            let date = new Date($(cell.children[0]).data("date"));

            let startDate = new Date(event.startDate + "T00:00:00");
            let endDate = new Date(event.endDate + "T00:00:00");
            //console.log(cell);
            // let month = date.getMonth() + 1; 
            // let day = date.getDate();
            // let year = date.getFullYear();
            // let dateString = year+"-"+month+"-"+day;
            //console.log(date, date.getTime() >= startDate.getTime() && date.getTime() <= endDate.getTime(), startDate, endDate)
            var dateName = date.toLocaleDateString('default', { weekday: 'long' });
            let day = cell.children[0];
            let events = day.children[0];
            
            if (events.children.length >0) {
                
                Array.from(events.children).forEach((e)=> {
                    let item = $(e).data("event");
                    //console.log(item);
                    if (item.name == event.name) {
                        $(e).remove();
                    }
                });
            }
            
            

    
        }
    }
}



function insertEvent(event) {
    //console.log(event);
    var table = document.getElementById("calendar-Body");
    var once = true;
    for (let row of table.rows) {
        if (once) {
            once = false;
            continue;
        }
        var makeChange = false;
        var newHeight = 0;
        for (let cell of row.cells) {
            //iterate through cells

            let date = new Date($(cell.children[0]).data("date"));

            let startDate = new Date(event.startDate + "T00:00:00");
            let endDate = new Date(event.endDate + "T00:00:00");
            //console.log(cell);
            // let month = date.getMonth() + 1; 
            // let day = date.getDate();
            // let year = date.getFullYear();
            // let dateString = year+"-"+month+"-"+day;
            //console.log(date, date.getTime() >= startDate.getTime() && date.getTime() <= endDate.getTime(), startDate, endDate)
            var dateName = date.toLocaleDateString('default', { weekday: 'long' });

            if (date.getTime() >= startDate.getTime() && date.getTime() <= endDate.getTime() && event.daysActive.includes(dateName)) {
                let eventHtml = createEventHTML(event);
                let day = cell.children[0];
                let events = day.children[0];
                //console.log(day);
                $(events).append(eventHtml);
                if ($(day).height() > newHeight) {
                    newHeight = $(day).height();
                    makeChange = true;
                }


            }
        }
        if (makeChange) {
            //console.log(newHeight)
            for (let cell of row.cells) {
                let day = cell.children[0];

                $(day).css('min-height', newHeight + 10);
                //$(day).css('height',newHeight);
                //console.log($(day).height());
            }
        }
    }


}

function openShareEvent(event){
    $("#eventModal").modal('hide');
    $("#shareEventModal").modal('show');
    
    $("#shareEventForm").on("submit",function (e) {
        e.preventDefault();
        var data = $("#shareEventForm").serializeArray()
        data[0].event = event;
        console.log(data)
        $.ajax(
            {
                method: "POST",
                url: `/calendar/${user.username}/shareEvent`,
                type: "application/json",
                data: JSON.stringify(data),
                success: (e)=> {
                    createAlert(JSON.parse(e))
                }
            }
        )
        $("#shareEventModal").modal('hide');
    })
}



$(".event").on("click", eventClick)
function eventClick() {
    //console.log(this);
    if (user.admin) {
        var event = $(this).data("event");
        //console.log(event);
        openEditEventForm(event);
    }
    else {
        var event = $(this).data("event");
        openEventSignUp(event);
    }    
    //$("#eventModal").modal('show');
    //$("#shareEventModal").modal('show');
    
}

// $("#eventSignUpForm").on("submit", function(e) {
//     e.preventDefault();
//     submitEventSignUp(e)
// });

function openEventSignUp(event) {
    //console.log(event);
    $("#signUpModal").modal('show');
    fillSignUpDropDown(event);
    $("#eventSignUpForm").on("submit",(e)=>{
        e.preventDefault();
        submitEventSignUp(event);
    })
}

function fillSignUpDropDown(event) {
    $("#SelectTimeSlot").empty();
    var timeSlotLength = parseInt(event.timeSlotLength);
    var startTime = event.startTime;
    var startHour = parseInt(startTime.split(":")[0])
    var startMin = parseInt(startTime.split(":")[1])
    
    var endTime = event.endTime;
    var endHour = parseInt(endTime.split(":")[0])
    var endMin = parseInt(endTime.split(":")[1])
    var totalHours = endHour - startHour;
    var totalMin  = endMin - startMin;
    var totalTime = totalHours*60 + totalMin;
    console.log(`${startTime}, ${endTime}, ${totalTime}`)

    var possibleSignUpsCount = totalTime/timeSlotLength;

    
    for (let i = 0; i <possibleSignUpsCount;i++) {
        

        var option = document.createElement("option");
       
        
        
        var time = timeSlotLength *i;

        let starthour = startHour + parseInt((startMin+time)/60);
        let startmin =  parseInt((startMin+time)%60);
        
        
        let endhour = startHour + parseInt(((startMin+time) + timeSlotLength)/60);
        
        let endmin =  parseInt(((startMin+time)+ timeSlotLength)%60);
        console.log(`${starthour},${startmin},${endhour},${endmin}`)
        if (startmin.toString().length == 1) {
            startmin = "0"+startmin
        }
        if (starthour.toString().length == 1) {
            starthour = "0"+starthour
        }
        if (endhour.toString().length == 1) {
            endhour = "0"+endhour
        }
        if (endmin.toString().length == 1) {
            endmin = "0"+endmin
        }
        var dontInsert = false;
        for (let j = 0; j <event.signups.length;j++) {
            if (starthour+":"+startmin ==  event.signups[j].startTime & endhour+":"+endmin == event.signups[j].endTime) {
                dontInsert = true;
            }
        }
        if (!dontInsert) {
            option.innerHTML = starthour+":"+startmin +"-"+ endhour+":"+endmin;
            option.value = starthour+":"+startmin +"-"+ endhour+":"+endmin;
            
            $("#SelectTimeSlot").append(option);
        }
        
    }

    // event.signups.forEach(element => {
        
    // });

}

function submitEventSignUp(event) {
    
    $("#signUpModal").modal('hide');
    var array = $("#eventSignUpForm").serializeArray()
    console.log(array)
    
    var signUp = createSignUp(array);
    //var event = new CalendarEvent()
    addSignUpToEvent(event, signUp);
    // $.post(`/calendar/signUp/${user.username}`,JSON.stringify(signUp), function(data) {
    //     console.log(data);
    // });
    var data = {"event":event,"signUp":signUp}
    $.ajax(
        {
            method: "POST",
            url: `/calendar/signUp/${user.username}`,
            type: "application/json",
            data: JSON.stringify(data),
            success: (e)=> {
                createAlert(JSON.parse(e))
            }
        }
    )
}   

function createSignUp(array) {
    console.log("TODO create signup and its class")
    var signUp = new SignUp();
    array.forEach((e)=> {
        switch(e.name) {
            case "name":
                signUp.name = e.value;
                break;
            case "email":
                signUp.email = e.value;
                break;
            case "TimeSlot":
                let times = e.value.split("-");
                signUp.startTime = times[0]
                signUp.endTime = times[1]
                break;
            default:
                break;
        }
    });
    console.log(signUp);
    return signUp;
    
}
function addSignUpToEvent(event, signUp) {
    
    event.signups.push(signUp);
}

function copyLink() {
    console.log("TODO copy link")
}

$(".checkbox").change(function() {
    
    if (this.checked) {
        $("label[for='"+$(this).attr("id")+"']").removeClass("inactiveDay"); 
        $("label[for='"+$(this).attr("id")+"']").addClass("activeDay"); 
    }
    else {
        $("label[for='"+$(this).attr("id")+"']").removeClass("activeDay"); 
        $("label[for='"+$(this).attr("id")+"']").addClass("inactiveDay"); 
    }
})

