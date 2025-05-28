const cds = require("@sap/cds");
const { ApplicationConstants } = require("../util/constant");
async function getEmailTemplateConfiguration(processCode, taskName, actionCode) {

    const getEmailTemplateConfiguration = await cds.run(
        SELECT.one.from('NUSEXT_UTILITY_EMAIL_CONFIGS')
            .where({
                PROCESS_CODE: processCode,
                EMAIL_TYPE: ApplicationConstants.S,
                'UPPER(TASK_NAME)': UPPER(taskName),
                'UPPER(ACTION_CODE)': UPPER(actionCode)
            }));
    return getEmailTemplateConfiguration || null;
}

async function getEmailTemplateConfigurationByTemplateName(
    processCode,
    referenceKey,
    taskName
) {
    const getEmailTemplateConfigurationByTemplateName = await cds.run(
        SELECT.one.from('NUSEXT_UTILITY_EMAIL_CONFIGS')
            .where({
                PROCESS_CODE: processCode,
                EMAIL_TYPE: ApplicationConstants.S,
                'UPPER(TASK_NAME)': UPPER(taskName),
                'UPPER(TEMPLATE_NAME)': UPPER(referenceKey)
            }));
    return getEmailTemplateConfigurationByTemplateName || null;
}

async function getPendingEmailTemplateConfiguration(
    processCode,
    taskName,
    templateName
) {
    const getPendingEmailTemplateConfiguration = await cds.run(
        SELECT.one.from('NUSEXT_UTILITY_EMAIL_CONFIGS')
            .where({
                PROCESS_CODE: processCode,
                EMAIL_TYPE: ApplicationConstants.B,
                'UPPER(TASK_NAME)': UPPER(taskName),
                'UPPER(TEMPLATE_NAME)': UPPER(templateName)
            }));
    return getPendingEmailTemplateConfiguration || null;
}

async function getEmailTemplate(
    TEMPLATE_NAME
) {
    const getEmailTemplate = await cds.run(
        SELECT.one.from('NUSEXT_UTILITY_EMAIL_TEMPLATES')
            .where({
                TEMPLATE_NAME
            }));
    return getEmailTemplate || null;
}



module.exports = { getEmailTemplateConfiguration,getEmailTemplateConfigurationByTemplateName ,getPendingEmailTemplateConfiguration,getEmailTemplate}