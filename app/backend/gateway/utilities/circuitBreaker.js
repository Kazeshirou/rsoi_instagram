var logger = require("./logger");

class CircuitBreaker {
    constructor(failureThreshold, retryTimePeriod, name, recoveryCallback) {
        this.name = name;
        // We start in a closed state hoping that everything is fine
        this.state = 'CLOSED';
        // Number of failures we receive from the depended service before we change the state to 'OPEN'
        this.failureThreshold = failureThreshold;
        // Time period after which a fresh request be made to the dependent
        // service to check if service is up.
        this.retryTimePeriod = retryTimePeriod;
        this.lastFailureTime = null;
        this.failureCount = 0;
        this.recoveryCallback = recoveryCallback ? recoveryCallback : () => { };
    }

    log() {
        logger.info({
            message: `Circuit breaker for ${this.name}: call`,
            detail: this
        })
    }

    call(resolve, reject, promise) {
        this.setState();
        switch (this.state) {
            case 'OPEN':
                // return  cached response if no the circuit is in OPEN state
                reject({
                    statusCode: 424,
                    body: {
                        err: {
                            message: `${this.name} не отвечает.`
                        }
                    }
                });
                break;
            // Make the API request if the circuit is not OPEN
            case 'HALF-OPEN':
            case 'CLOSED':
                promise()
                    .then(res => {
                        this.reset();
                        resolve(res);
                    })
                    .catch(err => {
                        this.recordFailure();
                        reject(err)
                    })
                break;

            default:
                reject({
                    statusCode: 501,
                    body: {
                        message: `Circuit breaker for ${this.name}: unexpected state`
                    }
                });
        }
    }



    // reset all the parameters to the initial state when circuit is initialized
    reset() {
        this.failureCount = 0;
        this.lastFailureTime = null;
        this.state = 'CLOSED';
        this.recoveryCallback();
    }

    // Set the current state of our circuit breaker.
    setState() {
        if (this.failureCount > this.failureThreshold) {
            if ((Date.now() - this.lastFailureTime) > this.retryTimePeriod) {
                this.state = 'HALF-OPEN';
            } else {
                this.state = 'OPEN';
            }
        } else {
            this.state = 'CLOSED';
        }
    }

    recordFailure() {
        this.failureCount += 1;
        this.lastFailureTime = Date.now();
    }
}

module.exports = CircuitBreaker;