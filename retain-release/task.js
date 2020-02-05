"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const task = require("azure-pipelines-task-lib");
const api = require("azure-devops-node-api");
function run() {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const lock = task.getBoolInput('lock', true);
            const serverUrl = task.getVariable("System.TeamFoundationCollectionUri");
            const project = task.getVariable("System.TeamProject");
            const hostType = task.getVariable("System.HostType");
            const pat = task.getEndpointAuthorizationParameter("SYSTEMVSSCONNECTION", "AccessToken", false);
            const authHandler = api.getPersonalAccessTokenHandler(pat);
            const vsts = new api.WebApi(serverUrl, authHandler);
            if (hostType === 'build') {
                task.debug('Detected execution context is build.');
                const buildId = +task.getVariable("Build.BuildId");
                const vstsBuild = yield vsts.getBuildApi();
                const buildProp = { keepForever: lock };
                const response = yield vstsBuild.updateBuild(buildProp, project, buildId);
                console.log(`Build '${response.buildNumber}' is marked is set to be manually retained.`);
            }
            else {
                task.debug('Detected execution context is release.');
                const releaseId = +task.getVariable("Release.ReleaseId");
                const vstsRelease = yield vsts.getReleaseApi();
                const metaData = { keepForever: lock };
                const response = yield vstsRelease.updateReleaseResource(metaData, project, releaseId);
                console.log(`Release '${response.name}' is marked with Retain indefinitely flag.`);
            }
        }
        catch (err) {
            task.setResult(task.TaskResult.Failed, err.message);
        }
    });
}
run();
