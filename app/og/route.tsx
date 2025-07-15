/* eslint-env node */
import {ImageResponse} from '@vercel/og'

export const runtime = 'edge';

const font = fetch(new URL('./Inter-SemiBold.otf', import.meta.url)).then(res =>
  res.arrayBuffer()
);

export async function GET(req) {
  const inter = await font

  const {searchParams} = new URL(req.url)

  // ?title=<title>
  const hasTitle = searchParams.has('title')
  const title = hasTitle
    ? searchParams.get('title')?.slice(0, 100)
    : 'SoulFire Documentation'
  // &description=<description>
  const hasDescription = searchParams.has('description')
  const description = hasDescription
    ? searchParams.get('description')?.slice(0, 200)
    : 'Advanced Minecraft Server-Stresser Tool. Launch bot attacks on your servers to measure performance.'

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
        <svg xmlns="http://www.w3.org/2000/svg" style={{position: 'absolute', top: 70, left: 80}} height="80"
             viewBox="0 0 200 200">
          <defs>
            <linearGradient id="bgGradient" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stop-color="#2a2d3e"/>
              <stop offset="100%" stop-color="#1c1e2a"/>
            </linearGradient>
            <linearGradient id="iconGradient" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="33%" stop-color="#00F3FF"/>
              <stop offset="66%" stop-color="#33f2f5"/>
            </linearGradient>
          </defs>
          <rect width="100%" height="100%" rx="30" ry="30" fill="url(#bgGradient)"/>
          <g transform="translate(30,30)">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="140"
              height="140"
              viewBox="0 0 24 24"
              fill="url(#iconGradient)"
            >
              <path fill-rule="evenodd" clip-rule="evenodd"
                    d="M12.963 2.286a.75.75 0 0 0-1.071-.136 9.742 9.742 0 0 0-3.539 6.176
           7.547 7.547 0 0 1-1.705-1.715.75.75 0 0 0-1.152-.082A9 9 0 1 0 15.68 4.534
           a7.46 7.46 0 0 1-2.717-2.248ZM15.75 14.25a3.75 3.75 0 1 1-7.313-1.172
           c.628.465 1.35.81 2.133 1a5.99 5.99 0 0 1 1.925-3.546
           3.75 3.75 0 0 1 3.255 3.718Z"/>
            </svg>
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
          {description}
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
