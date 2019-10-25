package org.nrg.xnatx.rapidReader;

import org.nrg.framework.annotations.XnatPlugin;

@XnatPlugin(
        value = "rapidReaderPlugin",
        name = "XNAT Rapid Reader Plugin",
        version = "0.1.0",
        description = "Simplified UI for performing rad reads.",
        openUrls = {"/read"}
)

public class RapidReaderPlugin {
    // Only static HTML - no Java classes
}
