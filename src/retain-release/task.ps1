[CmdletBinding()]
param()

Trace-VstsEnteringInvocation $MyInvocation

try
{
    $lock = Get-VstsInput -Name lock -Require
    $collectionUrl = Get-VstsTaskVariable -Name System.TeamFoundationCollectionUri -Require
    $project = Get-VstsTaskVariable -Name System.TeamProject
    $releaseId = Get-VstsTaskVariable -Name Release.ReleaseId

    $uri = "$collectionUrl/$project/_apis/release/releases/$($releaseId)?api-version=3.0-preview.2"

    Invoke-RestMethod -Uri $uri -Method Patch -ContentType "application/json" -Body "{keepforever:$lock}" -UseDefaultCredentials | Out-Null
}
finally
{
    Trace-VstsLeavingInvocation $MyInvocation
}
