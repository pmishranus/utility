class EmailResponseDto {
    constructor({
        status = "",
        templateId = "",
        saveStatus = "",
        statusCode = "",
        message = ""
    } = {}) {
        this.status = status;
        this.templateId = templateId;
        this.saveStatus = saveStatus;
        this.statusCode = statusCode;
        this.message = message;
    }

    // Setters and getters are not strictly necessary in JS,
    // but you can add them if you want property validation or transformation

    frameEmailResponse(status, message, statusCode) {
        this.status = status;
        this.statusCode = statusCode;
        this.message = message;
    }
}

module.exports = EmailResponseDto;