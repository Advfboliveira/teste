"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ExecutionType = void 0;
const axios_1 = __importDefault(require("axios"));
/* eslint-disable no-use-before-define */
/* eslint-disable no-shadow */
var ExecutionType;
(function (ExecutionType) {
    ExecutionType["DELAY"] = "delay";
    ExecutionType["REPEAT"] = "repeat";
})(ExecutionType = exports.ExecutionType || (exports.ExecutionType = {}));
class QueueListener {
    static onError(err) {
        console.error(err);
    }
    static onWaiting(jobId) {
        // console.log(`Job with ID ${jobId} is waiting`);
    }
    static onActive(job, 
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    jobPromise) {
        // console.log(`Job with ID ${job.id} active`);
    }
    static onStalled(job) {
        // console.log(`Job with ID ${job.id} stalled`);
        // TODO: log stalled request. These requests are most probably double processed.
    }
    static onCompleted(job, result) {
        // console.log(`Job with ID ${job.id} completed`);
        // console.log({ result });
    }
    // eslint-disable-next-line consistent-return
    static onFailed(job, err) {
        var _a;
        console.log(`Job with ID ${job.id} failed. Attempts made ${job.attemptsMade}. Max attempts ${job.opts.attempts}`, err);
        if (job.opts.attempts && job.attemptsMade === job.opts.attempts) {
            // if max attempts reached, execute fallback logic.
            const jobConfig = job.data;
            if ((_a = jobConfig.retryOptions) === null || _a === void 0 ? void 0 : _a.fallbackUrl) {
                const apiBody = Object.assign(Object.assign({}, jobConfig), { id: job.id, error: err });
                // console.log("Sending fallback hook");
                return axios_1.default.post(jobConfig.retryOptions.fallbackUrl, apiBody);
            }
            // if no fallback, mail admin that the job has failed repeatedly
            const { id: jobId, data: jobData, name: jobName, opts: jobOpts, timestamp } = job;
            const subject = `Job - ${jobId} failed ${job.attemptsMade} times`;
            const mailBody = `
                    <h1> Job Failed Repeatedly </h1>
                    <div>
                        <p> Job ID : ${jobId} </p>
                        <p> Job Name: ${jobName} </p>
                        <p> Timestamp: ${timestamp} </p
                        <div> <p> JobData : </p>
                        <code> ${JSON.stringify(jobData)} </code> </div>
                        <div> <p> JobOptions : </p>
                        <code> ${JSON.stringify(jobOpts)} </code> </div>
                    </div>
               `;
            // return Mailer.sendMail(mailBody, subject);
            console.error("On Failed", subject, mailBody);
        }
    }
    static onClean(jobs, type) {
        // console.log(`Jobs cleaned ${jobs.length} - ${type}`);
        // console.log(JSON.stringify(jobs));
    }
    static onRemoved(job) {
        // console.log(`Job with ID ${job.id} removed`);
    }
}
exports.default = QueueListener;
//# sourceMappingURL=QueueListeners.js.map