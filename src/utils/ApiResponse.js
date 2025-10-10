class ApiResponse {
    constructor(statusCode, message="Success", data = null) {
        this.statusCode = statusCode;
        this.message = message;
        this.data = data;
        this.success = statusCode >= 200 && statusCode < 300;
    }

    toJSON() {
        return {
            status: this.status,
            message: this.message,
            data: this.data
        };
    }
}

export {ApiResponse};