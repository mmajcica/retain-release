# Retain indefinitely current release
### Overview
As a common practice, after a successful release to production, often there is a need retain the involved artifact and relevant release information for certain amount of time. In order to avoid that a retention policy removes this information, you will mark that release with a Retain indefinitely flag, by choosing that option from the VSTS UI.
As this is a manual process, with this task I'm trying to automate this, in a form of task that can be used in your release, to set the Retain indefinitely flag for the running release.

### Requirements

The only requirement is that the account on which the build agent is running has sufficient privileges to set Retain indefinitely flag.

### Parameters

Only a single parameter is presented by the task in a form of a checkbox labeled **Mark the current release to be retained indefinitely**. By default is set to true. If checked, it will mark the current release with Retain indefinitely flag. Otherwise it will take the Retain indefinitely flag off the current release.

## Contributing

Feel free to notify any issue in the issues section of this GitHub repository.
In order to build this task, you will need Node.js and gulp installed. Once cloned the repository, just run 'gulp package' and in the newly created folder called dist you will find a new version of the extension.