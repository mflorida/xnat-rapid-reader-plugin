<p style="padding:0.75rem 1.25rem;background:#733;color:white;font-size:1.5rem;line-height:1.25;">
This plugin is deprecated and will not see further development in the foreseeable future. 
For now, this repo will remain for archival purposes.
</p>

---

# XNAT Rapid Reader Plugin

The _Rapid Reader_ plugin is intended to facilitate quickly performing radiology reads from a worklist of sessions that need assessment.
This plugin depends on the XNAT OHIF viewer plugin being installed in the host XNAT system, but in the future may include a customized
viewer for a more streamlined workflow.

### Building the app and plugin

From the `rapid-reader` folder, run `yarn` then `yarn build` to build the React app and XNAT plugin.

### XNAT Dependencies

> The info below is outdated. The viewer plugins have had major changes since this Rapid Reader plugin was last worked on.
> There are no current plans to update this Rapid Reader plugin. This repo is here for archival purposes.

The XNAT system running this plugin must have the [ohif-viewer-xnat-plugin](https://bitbucket.org/icrimaginginformatics/ohif-viewer-xnat-plugin/),
which subsequently requires the [xnat-roi-plugin](https://bitbucket.org/icrimaginginformatics/xnat-roi-plugin/). These can be downloaded as a single
bundle [here](https://bitbucket.org/icrimaginginformatics/ohif-viewer-xnat-plugin/downloads/).
