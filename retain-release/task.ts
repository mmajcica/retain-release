import task = require('vsts-task-lib');
import api = require('vso-node-api');
import { ReleaseUpdateMetadata, Release } from 'vso-node-api/interfaces/ReleaseInterfaces';
import { IReleaseApi } from 'vso-node-api/ReleaseApi';

async function run() {
    try {
        let lock: boolean = task.getBoolInput('lock', true);

        let serverUrl: string = task.getVariable("System.TeamFoundationCollectionUri");
        let project: string = task.getVariable("System.TeamProject");
        let releaseId: number = +task.getVariable("Release.ReleaseId");

        let pat: string = task.getEndpointAuthorizationParameter("SYSTEMVSSCONNECTION", "AccessToken", false)
        let authHandler = api.getPersonalAccessTokenHandler(pat);

        let vsts: api.WebApi = new api.WebApi(serverUrl, authHandler);
        let vstsRelease: IReleaseApi  = await vsts.getReleaseApi()

        let metatdata: ReleaseUpdateMetadata = <ReleaseUpdateMetadata>{ keepForever: lock }

        let response: Release = await vstsRelease.updateReleaseResource(metatdata, project, releaseId)

        console.log("Release '" + response.name + "' is marked with Retain indefinitely flag.");
    }
    catch (err) {
        task.setResult(task.TaskResult.Failed, err.message);
    }
}

run();