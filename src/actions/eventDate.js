export const SET_CREATE_DATE = 'SET_CREATE_DATE';

export function setEventDate(dateArray) {
    var eventStartDate = "";
    var eventEndDate = "";
    ////console.log("setEventDate", dateArray)
    if(dateArray.length > 1 ) {
        eventStartDate = dateArray[0];
        eventEndDate = dateArray[1];
    }

    return {
        type: SET_CREATE_DATE,
        payload: {eventStartDate: eventStartDate, eventEndDate: eventEndDate}
    }
}
