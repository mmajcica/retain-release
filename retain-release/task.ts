import task = require('vsts-task-lib');
import api = require('vso-node-api');
import { ReleaseUpdateMetadata, Release } from 'vso-node-api/interfaces/ReleaseInterfaces';
import { IReleaseApi } from 'vso-node-api/ReleaseApi';

async function run() {
    try {
        const lock: boolean = task.getBoolInput('lock', true);

        const serverUrl: string = task.getVariable("System.TeamFoundationCollectionUri");
        const project: string = task.getVariable("System.TeamProject");
        const releaseId: number = +task.getVariable("Release.ReleaseId");

        const pat: string = task.getEndpointAuthorizationParameter("SYSTEMVSSCONNECTION", "AccessToken", false)
        const authHandler = api.getPersonalAccessTokenHandler(pat);

        const proxy = task.getHttpProxyConfiguration();
        const options = proxy ? { proxy, ignoreSslError: true } : undefined;
        
        let vsts: api.WebApi = new api.WebApi(serverUrl, authHandler, options);
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
