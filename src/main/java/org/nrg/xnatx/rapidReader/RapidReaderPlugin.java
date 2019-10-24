package org.nrg.xnatx.rapidReader;

import org.nrg.framework.annotations.XnatPlugin;
//import org.springframework.context.annotation.ComponentScan;

@XnatPlugin(
        value = "rapidReaderPlugin",
        name = "XNAT Rapid Reader Plugin",
        version = "0.1.0",
        description = "Simplified UI for performing rad reads.",
        openUrls = {"/read"}
)
//@ComponentScan({
//        "org.nrg.xnatx.rapidReader.xapi",
//        "org.nrg.xnatx.rapidReader.event.listeners"
//})
public class RapidReaderPlugin {
    // Only static HTML - no Java classes
}
