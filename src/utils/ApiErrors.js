class ApiErrors extends Error {
    constructor(
        message = "Internal Server Error",
        statusCode,
        errors = [],
        stackt = ""

    ) {
        super(message);
        this.statusCode = statusCode;
        this.name = this.constructor.name;
        this.data = null;
        this.success = false;
        this.errors = errors;
       
        if (stackt) {
            this.stack = stackt;
        }
        else {
            Error.captureStackTrace(this, this.constructor);
        } 
    }
}
export default ApiErrors