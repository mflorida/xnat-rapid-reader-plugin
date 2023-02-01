# XNAT Rapid Reader Plugin

The _Rapid Reader_ plugin is intended to facilitate quickly performing radiology reads from a worklist of sessions that need assessment.
This plugin depends on the XNAT OHIF viewer plugin being installed in the host XNAT system, but in the future may include a customized
viewer for a more streamlined workflow.

### Building the app and plugin

From this folder, run `yarn` to install dependencies then `yarn build` to build the React app and XNAT plugin. This
will generate a `.jar` file that can be deployed to the 'plugins' directory of an XNAT instance.

### XNAT Dependencies

> The info below is outdated. The viewer plugins have had major changes since this Rapid Reader plugin was last worked on.
> There are no current plans to update this Rapid Reader plugin. This repo is here for archival purposes.

The XNAT system running this plugin must have the [ohif-viewer-xnat-plugin](https://bitbucket.org/icrimaginginformatics/ohif-viewer-xnat-plugin/),
which subsequently requires the [xnat-roi-plugin](https://bitbucket.org/icrimaginginformatics/xnat-roi-plugin/). These can be downloaded as a single
bundle [here](https://bitbucket.org/icrimaginginformatics/ohif-viewer-xnat-plugin/downloads/).
