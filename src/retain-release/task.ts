import task = require('vsts-task-lib');
import api = require('vso-node-api');
import { ReleaseUpdateMetadata, Release } from 'vso-node-api/interfaces/ReleaseInterfaces';
import { IReleaseApi } from 'vso-node-api/ReleaseApi';

async function run() {
    let serverUrl: string = task.getVariable("System.TeamFoundationCollectionUri");
    let project: string = task.getVariable("System.TeamProject");
    let releaseId: number = +task.getVariable("Release.ReleaseId");

    let pat: string = task.getEndpointAuthorizationParameter("SYSTEMVSSCONNECTION", "AccessToken", false)
    let authHandler = api.getPersonalAccessTokenHandler(pat);

    let vsts: api.WebApi = new api.WebApi(serverUrl, authHandler);
    console.log("Getting Release Api")
    let vstsRelease: IReleaseApi  = await vsts.getReleaseApi()
    console.log("Got Release Api")

    let metatdata: ReleaseUpdateMetadata = <ReleaseUpdateMetadata>{ keepForever: true }

    let response: Release = await vstsRelease.updateReleaseResource(metatdata, project, releaseId)

    console.log("Release '${response.name}' is marked with Retain indefinitely flag.");
}

run();