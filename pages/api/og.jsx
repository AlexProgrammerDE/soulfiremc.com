/* eslint-env node */
import { ImageResponse } from '@vercel/og'

export const config = {
    runtime: 'edge'
}

const font = fetch(new URL('./Inter-SemiBold.otf', import.meta.url)).then(res =>
    res.arrayBuffer()
)

export default async function (req) {
    const inter = await font

    const { searchParams } = new URL(req.url)

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
                <svg xmlns="http://www.w3.org/2000/svg" style={{position: 'absolute', top: 70, left: 80}} height="40" viewBox="0 0 120 120">
                    <rect width="100%" height="100%" fill="#3289BF" rx="10%" ry="10%"/>
                    <g>
                        <text xmlSpace="preserve" style="font-style:normal;font-variant:normal;font-weight:400;font-stretch:normal;font-size:72px;font-family:Ubuntu;-inkscape-font-specification:'Ubuntu, Normal';font-variant-ligatures:normal;font-variant-caps:normal;font-variant-numeric:normal;font-variant-east-asian:normal;fill:#fff;fill-opacity:1;stroke-width:6"><tspan x="10" y="100" style="stroke-width:6">SF</tspan></text>
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
