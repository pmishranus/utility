class ProcessConfigType {
    // Define static instances
    static PTT = new ProcessConfigType("101", "PTT");
    static CW = new ProcessConfigType("102", "CW");
    static OT = new ProcessConfigType("103", "OT");
    static HM = new ProcessConfigType("104", "HM");
    static CWS = new ProcessConfigType("201", "CWS");
    static NED = new ProcessConfigType("202", "NED");
    static OPWN = new ProcessConfigType("203", "OPWN");
    static ECLAIMS = new ProcessConfigType("100", "ECLAIMS");
    static CPOWN = new ProcessConfigType("200", "CPOWN");
    static TB = new ProcessConfigType("105", "TB");
    static UNKNOWN = new ProcessConfigType("unknown", "UNKNOWN");

    // Constructor
    constructor(value, name) {
        this.value = value;
        this.name = name;
    }

    // Method to get the name from a value
    static fromValue(value) {
        for (const key of Object.keys(ProcessConfigType)) {
            const type = ProcessConfigType[key];
            if (type instanceof ProcessConfigType && type.value === value) {
                return type.name;
            }
        }
        return ProcessConfigType.UNKNOWN.name;
    }

    // Method to get the value
    getValue() {
        return this.value;
    }

    // Method to get the name
    getName() {
        return this.name;
    }
}

module.exports = ProcessConfigType;
