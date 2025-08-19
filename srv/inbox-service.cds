service InboxService @(path: '/task') {

    @open
    type object {};

    action taskactions(data : object) returns array of object;
    action sendEmail(data : object)   returns String;


}
