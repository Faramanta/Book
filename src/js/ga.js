/* Google Analytics */
function trackEventBound(event, event_id, event_name, event_param, event_cat){

    switch(event){
        case 1:
            event = 'addEvents_makeConversions';
            break;
        case 2:
            event = 'addEvents_makeActions';
    }

    event_cat = event_cat === undefined ? SERVICE_NAME : event_cat;

    try {
        dataLayer.push({
            'event': event,
            'event_id': event_id,
            'event_cat': event_cat,
            'event_name': event_name,
            'event_param': event_param
        });
    } catch(e){}
}