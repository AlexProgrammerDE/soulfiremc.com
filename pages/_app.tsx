import '../style.css'
import PlausibleProvider from "next-plausible";

export default function App({Component, pageProps}) {
  return (
    <PlausibleProvider trackOutboundLinks trackFileDownloads scriptProps={{"add-file-types": "jar"} as never}
                       domain="soulfiremc.com">
      <Component {...pageProps} />
    </PlausibleProvider>
  )
}
