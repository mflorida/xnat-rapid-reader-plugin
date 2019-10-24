# XNAT Rapid Reader Plugin

The _Rapid Reader_ plugin is intended to facilitate quickly performing radiology reads from a worklist of sessions that need assessment.
This plugin depends on the XNAT OHIF viewer plugin being installed in the host XNAT system, but in the future may include a customized
viewer for a more streamlined workflow.

### Building the app and plugin

From the `rapid-reader` folder, run `yarn` then `yarn build` to build the React app and XNAT plugin.


### XNAT Dependencies

The XNAT system running this plugin must have the [ohif-viewer-xnat-plugin](https://bitbucket.org/icrimaginginformatics/ohif-viewer-xnat-plugin/),
which subsequently requires the [xnat-roi-plugin](https://bitbucket.org/icrimaginginformatics/xnat-roi-plugin/). These can be downloaded as a single
bundle [here](https://bitbucket.org/icrimaginginformatics/ohif-viewer-xnat-plugin/downloads/).
