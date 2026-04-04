export default function PlantsIcon({ color }: { color: string }) {
  return (
    <svg xmlns='http://www.w3.org/2000/svg' width='16' height='16' viewBox='0 0 16 16' fill='none'>
      <g clipPath='url(#clip0_329_2359)'>
        <path
          d='M1.33337 13.3333C1.33337 13.687 1.47385 14.0261 1.7239 14.2761C1.97395 14.5262 2.31309 14.6667 2.66671 14.6667H13.3334C13.687 14.6667 14.0261 14.5262 14.2762 14.2761C14.5262 14.0261 14.6667 13.687 14.6667 13.3333V5.33334L10 8.66667V5.33334L5.33337 8.66667V2.66667C5.33337 2.31305 5.1929 1.97391 4.94285 1.72386C4.6928 1.47381 4.35366 1.33334 4.00004 1.33334H2.66671C2.31309 1.33334 1.97395 1.47381 1.7239 1.72386C1.47385 1.97391 1.33337 2.31305 1.33337 2.66667V13.3333Z'
          stroke={color}
          strokeWidth='1.5'
          strokeLinecap='round'
          strokeLinejoin='round'
        />
        <path
          d='M11.3334 12H12'
          stroke={color}
          strokeWidth='1.5'
          strokeLinecap='round'
          strokeLinejoin='round'
        />
        <path
          d='M8 12H8.66667'
          stroke={color}
          strokeWidth='1.33'
          strokeLinecap='round'
          strokeLinejoin='round'
        />
        <path d='M4.66663 12H5.33329' stroke={color} strokeLinecap='round' strokeLinejoin='round' />
      </g>

      <defs>
        <clipPath id='clip0_329_2359'>
          <rect width='16' height='16' />
        </clipPath>
      </defs>
    </svg>
  )
}
