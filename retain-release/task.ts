import task = require("azure-pipelines-task-lib");
import { IReleaseApi } from "azure-devops-node-api/ReleaseApi";
import * as api from "azure-devops-node-api";
import { Release, ReleaseUpdateMetadata } from "azure-devops-node-api/interfaces/ReleaseInterfaces";
import { Build } from "azure-devops-node-api/interfaces/BuildInterfaces";
import { IBuildApi } from "azure-devops-node-api/BuildApi";

async function run() {
    try {
        const lock: boolean = task.getBoolInput('lock', true);

        const serverUrl: string = task.getVariable("System.TeamFoundationCollectionUri");
        const project: string = task.getVariable("System.TeamProject");
        const hostType: string = task.getVariable("System.HostType");

        const pat: string = task.getEndpointAuthorizationParameter("SYSTEMVSSCONNECTION", "AccessToken", false);
        const authHandler = api.getPersonalAccessTokenHandler(pat);
        const vsts: api.WebApi = new api.WebApi(serverUrl, authHandler);

        if (hostType === 'build') {
            task.debug('Detected execution context is build.');

            const buildId: number = +task.getVariable("Build.BuildId");
            const vstsBuild: IBuildApi = await vsts.getBuildApi();
            const buildProp: Build = <Build>{ keepForever: lock };
            const response: Build = await vstsBuild.updateBuild(buildProp, project, buildId);

            console.log(`Build '${response.buildNumber}' is marked is set to be manually retained.`);
        } else {
            task.debug('Detected execution context is release.');

            const releaseId: number = +task.getVariable("Release.ReleaseId");
            const vstsRelease: IReleaseApi = await vsts.getReleaseApi();
            const metaData: ReleaseUpdateMetadata = <ReleaseUpdateMetadata>{ keepForever: lock };
            const response: Release = await vstsRelease.updateReleaseResource(metaData, project, releaseId);

            console.log(`Release '${response.name}' is marked with Retain indefinitely flag.`);
        }
    }
    catch (err) {
        task.setResult(task.TaskResult.Failed, err.message);
    }
}

run();
