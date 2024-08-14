class ValidationResultsDto {
    constructor(field, message, type, displayIdx, sTitle, title, state, idx) {
      this.field = field;
      this.message = message;
      this.type = type;
      this.displayIdx = displayIdx;
      this.sTitle = sTitle;
      this.title = title;
      this.state = state;
      this.idx = idx;
    }
  
    // Getter and setter methods
    getField() {
      return this.field;
    }
  
    setField(field) {
      this.field = field;
    }
  
    getMessage() {
      return this.message;
    }
  
    setMessage(message) {
      this.message = message;
    }
  
    getType() {
      return this.type;
    }
  
    setType(type) {
      this.type = type;
    }
  
    getDisplayIdx() {
      return this.displayIdx;
    }
  
    setDisplayIdx(displayIdx) {
      this.displayIdx = displayIdx;
    }
  
    getsTitle() {
      return this.sTitle;
    }
  
    setsTitle(sTitle) {
      this.sTitle = sTitle;
    }
  
    getTitle() {
      return this.title;
    }
  
    setTitle(title) {
      this.title = title;
    }
  
    getState() {
      return this.state;
    }
  
    setState(state) {
      this.state = state;
    }
  
    getIdx() {
      return this.idx;
    }
  
    setIdx(idx) {
      this.idx = idx;
    }
  
    toString() {
      return `ValidationResultsDto [field=${this.field}, message=${this.message}, type=${this.type}, displayIdx=${this.displayIdx}, sTitle=${this.sTitle}, title=${this.title}, state=${this.state}, idx=${this.idx}]`;
    }
  }
  
  module.exports = ValidationResultsDto;
  