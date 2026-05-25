class APIerror extends Error{
    constructor(
        statusCode,
        message = "something went wrong!",
        error=[],
        stack=""
    ){
        super(message)
        this.statusCode=statusCode
        this.data=null
        this.message=message
        this.success=false
        this.errors=error
    }
}

export default APIerror