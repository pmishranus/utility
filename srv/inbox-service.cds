service InboxService @(path: '/task') {

    @open
    type object {};

    action   taskactions(data : object)       returns String;

    action sendEmail(data : object)       returns String;



}
