export default function Document({ color }: { color?: string }) {
  return (
    <svg xmlns='http://www.w3.org/2000/svg' width='16' height='16' viewBox='0 0 16 16' fill='none'>
      <path
        d='M9.99996 1.33331H3.99996C3.64634 1.33331 3.3072 1.47379 3.05715 1.72384C2.8071 1.97389 2.66663 2.31302 2.66663 2.66665V13.3333C2.66663 13.6869 2.8071 14.0261 3.05715 14.2761C3.3072 14.5262 3.64634 14.6666 3.99996 14.6666H12C12.3536 14.6666 12.6927 14.5262 12.9428 14.2761C13.1928 14.0261 13.3333 13.6869 13.3333 13.3333V4.66665L9.99996 1.33331Z'
        stroke={color}
        stroke-width='1.5'
        stroke-linecap='round'
        stroke-linejoin='round'
      />
      <path
        d='M9.33337 1.33331V3.99998C9.33337 4.3536 9.47385 4.69274 9.7239 4.94279C9.97395 5.19284 10.3131 5.33331 10.6667 5.33331H13.3334'
        stroke={color}
        stroke-width='1.5'
        stroke-linecap='round'
        stroke-linejoin='round'
      />
      <path
        d='M6.66671 6H5.33337'
        stroke={color}
        stroke-width='1.5'
        stroke-linecap='round'
        stroke-linejoin='round'
      />
      <path
        d='M10.6667 8.66669H5.33337'
        stroke={color}
        stroke-width='1.5'
        stroke-linecap='round'
        stroke-linejoin='round'
      />
      <path
        d='M10.6667 11.3333H5.33337'
        stroke={color}
        stroke-width='1.5'
        stroke-linecap='round'
        stroke-linejoin='round'
      />
    </svg>
  )
}
