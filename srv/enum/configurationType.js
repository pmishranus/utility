// ConfigurationType.js

const ConfigurationType = {
    CLAIMANT:        "CLAIMANT",
    CA:              "CLAIM_ASSISTANT",
    VERIFIER:        "VERIFIER",
    ADDITIONAL_APPROVER1: "ADDITIONAL_APP_1",
    ADDITIONAL_APPROVER2: "ADDITIONAL_APP_2",
    APPROVER:        "APPROVER",
    REPORTING_MGR:   "REPORTING_MGR",
    CW_ESS:          "CW_ESS",
    CW_HRP:          "CW_HRP",
    CW_REPORTING_MGR: "CW_REPORTING_MGR",
    CW_MANAGERS_MGR: "CW_MANAGERS_MGR",
    CW_OHRSS:        "CW_OHRSS",
    CW_PROGRAM_ADMIN: "CW_PROGRAM_ADMIN",
    CW_PROGRAM_MANAGER: "CW_PROGRAM_MANAGER",
    CW_DEPARTMENT_ADMIN: "CW_DEPARTMENT_ADMIN",
    FINANCE_LEAD:    "FINANCE_LEAD",
    UNKNOWN:         "unknown"
};

function fromValue(value) {
    for (const [key, val] of Object.entries(ConfigurationType)) {
        if (val === value) return key;
    }
    return "UNKNOWN";
}

function getValue(enumKey) {
    return ConfigurationType[enumKey] || ConfigurationType.UNKNOWN;
}

module.exports = { ConfigurationType, fromValue, getValue };