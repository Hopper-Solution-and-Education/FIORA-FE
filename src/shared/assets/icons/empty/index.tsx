import type { IconProps } from '@/shared/assets/icons';

export default function ImgEmpty(props: IconProps) {
  const { color = '', width = 120, className = '' } = props;
  return (
    <svg
      width={width}
      height={width}
      color={color}
      className={className}
      viewBox="0 0 120 120"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <circle cx="59.85" cy="62.2502" r="53.55" fill="#F2F7FF" />
      <g filter="url(#filter0_d_575_7417)">
        <path
          d="M17.7121 37.2467C17.4944 33.808 20.2338 30.8999 23.6906 30.8999H97.8094C101.266 30.8999 104.006 33.808 103.788 37.2467L101.98 65.8051C101.781 68.9504 99.1636 71.3999 96.0016 71.3999H25.4983C22.3364 71.3999 19.719 68.9504 19.5199 65.8051L17.7121 37.2467Z"
          fill="#CDD5DF"
        />
        <path
          d="M13.0849 58.4743C12.8903 55.3903 15.3391 52.782 18.4293 52.782H59.9996C62.1901 52.782 64.271 51.824 65.6953 50.1598L73.5353 40.9997C74.5527 39.811 76.0391 39.1267 77.6037 39.1267H103.483C106.547 39.1267 108.986 41.6924 108.831 44.7523L105.944 100.637C105.771 104.056 102.949 106.739 99.526 106.739H22.2397C18.8479 106.739 16.0401 104.102 15.8264 100.717L13.0849 58.4743Z"
          fill="white"
        />
        <circle cx="48.3" cy="74.1" r="3.6" fill="#4B5565" />
        <circle cx="73.5" cy="74.1" r="3.6" fill="#4B5565" />
        <path
          d="M54.2271 87.2184C54.2271 86.7756 54.4119 86.4024 54.6641 86.288C54.766 86.2417 54.884 86.2422 54.9944 86.2237C59.508 85.4674 62.1044 85.3808 66.5593 86.2164C66.6831 86.2396 66.8168 86.2397 66.9289 86.2972C67.1713 86.4214 67.3468 86.7869 67.3468 87.2184V88.7359C67.3468 89.2697 67.0782 89.7024 66.7468 89.7024C62.0609 89.1701 59.4569 89.2708 54.827 89.7024C54.4957 89.7024 54.2271 89.2697 54.2271 88.7359V87.2184Z"
          fill="#CDD5DF"
        />
      </g>
      <circle cx="108.15" cy="14.5501" r="1.95" fill="#A3C2FF" />
      <ellipse cx="20.1" cy="9.7498" rx="3.6" ry="3.45" fill="#E6EEFF" />
      <rect x="47" y="23" width="3" height="18" rx="1.5" fill="#9AA4B2" />
      <rect
        width="3"
        height="13"
        rx="1.5"
        transform="matrix(-0.819152 0.573576 0.573576 0.819152 34.1693 29.3149)"
        fill="#9AA4B2"
      />
      <rect
        x="62.4565"
        y="29.3149"
        width="3"
        height="13"
        rx="1.5"
        transform="rotate(35 62.4565 29.3149)"
        fill="#9AA4B2"
      />
      <defs>
        <filter
          id="filter0_d_575_7417"
          x="9.07404"
          y="30.8999"
          width="103.764"
          height="87.8389"
          filterUnits="userSpaceOnUse"
          colorInterpolationFilters="sRGB"
        >
          <feFlood floodOpacity="0" result="BackgroundImageFix" />
          <feColorMatrix
            in="SourceAlpha"
            type="matrix"
            values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0"
            result="hardAlpha"
          />
          <feMorphology
            radius="12"
            operator="erode"
            in="SourceAlpha"
            result="effect1_dropShadow_575_7417"
          />
          <feOffset dy="8" />
          <feGaussianBlur stdDeviation="8" />
          <feColorMatrix
            type="matrix"
            values="0 0 0 0 0.0625882 0 0 0 0 0.0926346 0 0 0 0 0.15702 0 0 0 0.12 0"
          />
          <feBlend mode="normal" in2="BackgroundImageFix" result="effect1_dropShadow_575_7417" />
          <feBlend
            mode="normal"
            in="SourceGraphic"
            in2="effect1_dropShadow_575_7417"
            result="shape"
          />
        </filter>
      </defs>
    </svg>
  );
}
