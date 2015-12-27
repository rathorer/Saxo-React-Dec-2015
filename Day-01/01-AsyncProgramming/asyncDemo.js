/* Sync */
//Provider
function add(x,y){
    console.log("[SP] processing ", x , " and ", y);
    var result = x + y;
    console.log("[SP] returning result");
    return result;
}

//Consumer
function addClient(x,y){
    console.log("[SC] triggering add");
    var result = add(x,y);
    console.log("[SC] result = ", result);
}

/* Async */

//Provider
function addAsync(x, y, resultCallback, errorCallback){
    console.log("[SP] processing ", x, " and ", y);
    var result = x+y;
    if(isNaN(result) && (typeof errorCallback === 'function')){
            errorCallback();
    }
    setTimeout(function(){
            console.log("[SP] returning result");
            //return result;
        if(typeof resultCallback === 'function'){
            resultCallback(result);
        }
        }, 5000);
    
}

//Consumer
//modify the below to handle the error and display a meaniful message
function addClientAsync(x, y){
    console.log("[SC] triggering add");
    var result = addAsync(x, y, function(result){
        console.log("[SC] result = ", result);
    }, function(){
        console.log("There is a error.");
    });
}



//Promises
function addUsingPromise(x, y){
    console.log("[SP] processing ", x, " and ", y);
    var promise = new Promise(function(resolve, reject){
        var result = x+y;
        
        setTimeout(function(){
            if(isNaN(result)){
                reject("Not a valid result");
            }
            console.log("returning result");
            resolve(result);
        }, 5000);
    });
    return promise;
}
