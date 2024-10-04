/* eslint-env node */
import {ImageResponse} from '@vercel/og'

export const config = {
    runtime: 'edge'
}

const font = fetch(new URL('./Inter-SemiBold.otf', import.meta.url)).then(res =>
    res.arrayBuffer()
)

export default async function (req) {
    const inter = await font

    const {searchParams} = new URL(req.url)

    // ?title=<title>
    const hasTitle = searchParams.has('title')
    const title = hasTitle
        ? searchParams.get('title')?.slice(0, 100)
        : 'SoulFire Documentation'

    return new ImageResponse(
        (
            <div
                style={{
                    height: '100%',
                    width: '100%',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'flex-start',
                    justifyContent: 'center',
                    padding: 80,
                    backgroundColor: '#030303',
                    backgroundImage:
                        'radial-gradient(circle at 25px 25px, #333 2%, transparent 0%), radial-gradient(circle at 75px 75px, #333 2%, transparent 0%)',
                    backgroundSize: '100px 100px',
                    backgroundPosition: '-30px -10px',
                    fontWeight: 600,
                    color: 'white'
                }}
            >
                <svg xmlns="http://www.w3.org/2000/svg" style={{position: 'absolute', top: 70, left: 80}} height="40"
                     viewBox="0 0 120 120">
                    <rect width="100%" height="100%" fill="#3289BF" rx="10%" ry="10%"/>
                    <g>
                        <g xmlSpace="preserve"
                           style="font-style:normal;font-variant:normal;font-weight:400;font-stretch:normal;font-size:72px;font-family:Ubuntu;-inkscape-font-specification:'Ubuntu, Normal';font-variant-ligatures:normal;font-variant-caps:normal;font-variant-numeric:normal;font-variant-east-asian:normal;fill:#fff;fill-opacity:1;stroke-width:6">
                            <g style="stroke-width:6">
                                <path
                                    d="M27.78 95.03Q38.73 95.03 38.73 87.54Q38.73 85.24 37.76 83.62Q36.78 82 35.13 80.81Q33.47 79.62 31.35 78.76Q29.22 77.9 26.85 77.03Q24.11 76.1 21.66 74.91Q19.22 73.72 17.42 72.1Q15.62 70.48 14.57 68.25Q13.53 66.02 13.53 62.85Q13.53 56.3 17.99 52.62Q22.46 48.95 30.3 48.95Q34.84 48.95 38.55 49.92Q42.26 50.9 43.98 52.05L41.75 57.74Q40.24 56.8 37.25 55.9Q34.26 55 30.3 55Q28.29 55 26.56 55.43Q24.83 55.86 23.54 56.73Q22.24 57.59 21.48 58.92Q20.73 60.26 20.73 62.06Q20.73 64.07 21.52 65.44Q22.31 66.81 23.75 67.85Q25.19 68.9 27.1 69.76Q29.01 70.62 31.31 71.49Q34.55 72.78 37.25 74.08Q39.95 75.38 41.93 77.18Q43.91 78.98 44.99 81.46Q46.07 83.94 46.07 87.47Q46.07 94.02 41.28 97.55Q36.5 101.08 27.78 101.08Q24.83 101.08 22.35 100.68Q19.86 100.29 17.92 99.75Q15.98 99.21 14.57 98.6Q13.17 97.98 12.38 97.55L14.46 91.79Q16.12 92.73 19.5 93.88Q22.89 95.03 27.78 95.03ZM54.5 100L54.5 50.1L84.59 50.1L84.59 56.08L61.48 56.08L61.48 71.13L82 71.13L82 77.03L61.48 77.03L61.48 100Z"/>
                            </g>
                        </g>
                    </g>
                </svg>
                <p
                    style={{
                        position: 'absolute',
                        bottom: 70,
                        left: 80,
                        margin: 0,
                        fontSize: 30,
                        letterSpacing: -1
                    }}
                >
                    Advanced Minecraft Server-Stresser Tool. Launch bot attacks on your servers to measure performance.
                </p>
                <h1
                    style={{
                        fontSize: 82,
                        margin: '0 0 40px -2px',
                        lineHeight: 1.1,
                        textShadow: '0 2px 30px #000',
                        letterSpacing: -4,
                        backgroundImage: 'linear-gradient(90deg, #fff 40%, #aaa)',
                        backgroundClip: 'text',
                        color: 'transparent'
                    }}
                >
                    {title}
                </h1>
            </div>
        ),
        {
            width: 1200,
            height: 630,
            fonts: [
                {
                    name: 'inter',
                    data: inter,
                    style: 'normal'
                }
            ]
        }
    )
}
