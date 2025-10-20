import {
  AlertCircle,
  AlertTriangle,
  ArrowLeft,
  ArrowLeftRight,
  ArrowRight,
  Ban,
  Banknote,
  BanknoteArrowDown,
  Bell,
  BellRing,
  Book,
  Calendar,
  Car,
  ChartBar,
  ChartColumn,
  Check,
  CheckCircle,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  Circle,
  CircleArrowLeft,
  CircleArrowRight,
  CircleChevronDown,
  CircleChevronLeft,
  CircleChevronUp,
  CircleDollarSign,
  CircleFadingArrowUp,
  CircuitBoardIcon,
  ClipboardList,
  Coins,
  Command,
  CornerDownRight,
  CreditCard,
  Database,
  DollarSign,
  Download,
  Edit,
  Edit3,
  EllipsisVertical,
  Expand,
  ExternalLink,
  Eye,
  EyeOff,
  File,
  FileText,
  FunnelPlus,
  GraduationCap,
  Grip,
  GripVertical,
  HandCoins,
  Handshake,
  Hash,
  HelpCircle,
  Home,
  Image,
  ImageIcon,
  Info,
  Landmark,
  Languages,
  Laptop,
  LayoutDashboardIcon,
  LayoutTemplate,
  Loader2,
  LoaderCircle,
  LogIn,
  LucideIcon,
  LucideProps,
  LucideShoppingBag,
  Mail,
  MailCheck,
  MailPlus,
  Minus,
  Monitor,
  MonitorSmartphone,
  Moon,
  MoonStar,
  MoreVertical,
  MoveLeft,
  Package,
  PanelLeftClose,
  PanelRightOpen,
  Pencil,
  Percent,
  Phone,
  Pickaxe,
  PiggyBank,
  Pizza,
  Plus,
  RefreshCcw,
  Save,
  SaveAll,
  ScreenShare,
  Search,
  Send,
  Settings,
  ShieldCheck,
  ShoppingCart,
  Shrink,
  SlidersHorizontal,
  Smartphone,
  Snowflake,
  SunMedium,
  Table,
  Tablet,
  Trash,
  Trello,
  TrendingDown,
  TrendingUp,
  Twitter,
  Upload,
  User,
  UserCircle2Icon,
  UserPen,
  UserPlus,
  Users,
  UserX2Icon,
  UtensilsCrossed,
  Vault,
  Wallet,
  X,
} from 'lucide-react';

export type Icon = LucideIcon;

export const Icons = {
  dashboard: LayoutDashboardIcon,
  logo: Command,
  login: LogIn,
  close: X,
  product: LucideShoppingBag,
  spinner: Loader2,
  kanban: CircuitBoardIcon,
  chevronLeft: ChevronLeft,
  chevronRight: ChevronRight,
  trash: Trash,
  employee: UserX2Icon,
  post: FileText,
  page: File,
  userPen: UserPen,
  user2: UserCircle2Icon,
  media: Image,
  settings: Settings,
  billing: CreditCard,
  ellipsis: MoreVertical,
  add: Plus,
  warning: AlertTriangle,
  user: User,
  pickaxe: Pickaxe,
  users: Users,
  arrowRight: ArrowRight,
  help: HelpCircle,
  pizza: Pizza,
  sun: SunMedium,
  moon: Moon,
  moonStar: MoonStar,
  laptop: Laptop,
  gitHub: ({ ...props }: LucideProps) => (
    <svg
      aria-hidden="true"
      focusable="false"
      data-prefix="fab"
      data-icon="github"
      role="img"
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 496 512"
      {...props}
    >
      <path
        fill="currentColor"
        d="M165.9 397.4c0 2-2.3 3.6-5.2 3.6-3.3 .3-5.6-1.3-5.6-3.6 0-2 2.3-3.6 5.2-3.6 3-.3 5.6 1.3 5.6 3.6zm-31.1-4.5c-.7 2 1.3 4.3 4.3 4.9 2.6 1 5.6 0 6.2-2s-1.3-4.3-4.3-5.2c-2.6-.7-5.5 .3-6.2 2.3zm44.2-1.7c-2.9 .7-4.9 2.6-4.6 4.9 .3 2 2.9 3.3 5.9 2.6 2.9-.7 4.9-2.6 4.6-4.6-.3-1.9-3-3.2-5.9-2.9zM244.8 8C106.1 8 0 113.3 0 252c0 110.9 69.8 205.8 169.5 239.2 12.8 2.3 17.3-5.6 17.3-12.1 0-6.2-.3-40.4-.3-61.4 0 0-70 15-84.7-29.8 0 0-11.4-29.1-27.8-36.6 0 0-22.9-15.7 1.6-15.4 0 0 24.9 2 38.6 25.8 21.9 38.6 58.6 27.5 72.9 20.9 2.3-16 8.8-27.1 16-33.7-55.9-6.2-112.3-14.3-112.3-110.5 0-27.5 7.6-41.3 23.6-58.9-2.6-6.5-11.1-33.3 2.6-67.9 20.9-6.5 69 27 69 27 20-5.6 41.5-8.5 62.8-8.5s42.8 2.9 62.8 8.5c0 0 48.1-33.6 69-27 13.7 34.7 5.2 61.4 2.6 67.9 16 17.7 25.8 31.5 25.8 58.9 0 96.5-58.9 104.2-114.8 110.5 9.2 7.9 17 22.9 17 46.4 0 33.7-.3 75.4-.3 83.6 0 6.5 4.6 14.4 17.3 12.1C428.2 457.8 496 362.9 496 252 496 113.3 383.5 8 244.8 8zM97.2 352.9c-1.3 1-1 3.3 .7 5.2 1.6 1.6 3.9 2.3 5.2 1 1.3-1 1-3.3-.7-5.2-1.6-1.6-3.9-2.3-5.2-1zm-10.8-8.1c-.7 1.3 .3 2.9 2.3 3.9 1.6 1 3.6 .7 4.3-.7 .7-1.3-.3-2.9-2.3-3.9-2-.6-3.6-.3-4.3 .7zm32.4 35.6c-1.6 1.3-1 4.3 1.3 6.2 2.3 2.3 5.2 2.6 6.5 1 1.3-1.3 .7-4.3-1.3-6.2-2.2-2.3-5.2-2.6-6.5-1zm-11.4-14.7c-1.6 1-1.6 3.6 0 5.9 1.6 2.3 4.3 3.3 5.6 2.3 1.6-1.3 1.6-3.9 0-6.2-1.4-2.3-4-3.3-5.6-2z"
      ></path>
    </svg>
  ),
  wallet: Wallet,
  twitter: Twitter,
  check: Check,
  trello: Trello,
  banknote: Banknote,
  bellRing: BellRing,
  pencil: Pencil,
  eye: Eye,
  utensils: UtensilsCrossed,
  home: Home,
  car: Car,
  phone: Phone,
  shoppingCart: ShoppingCart,
  piggyBank: PiggyBank,
  trendingUp: TrendingUp,
  trendindDown: TrendingDown,
  dollarSign: DollarSign,
  circleDollarSign: CircleDollarSign,
  circle: Circle,
  save: Save,
  chevronDown: ChevronDown,
  minus: Minus,
  circleChevronDown: CircleChevronDown,
  circleChevronUp: CircleChevronUp,
  moveLeft: MoveLeft,
  alertCircle: AlertCircle,
  circleArrowLeft: CircleArrowLeft,
  layoutBanner: LayoutTemplate,
  banknoteArrowDown: BanknoteArrowDown,
  saveAll: SaveAll,
  circleArrowRight: CircleArrowRight,
  package: Package,
  database: Database,
  clipboardList: ClipboardList,
  handShake: Handshake,
  expand: Expand,
  shrink: Shrink,
  chartBar: ChartBar,
  loader: LoaderCircle,
  handCoins: HandCoins,
  calendar: Calendar,
  circleChevronLeft: CircleChevronLeft,
  none: Ban,
  table: Table,
  chartColumn: ChartColumn,
  funnelPlus: FunnelPlus,
  banknoteArrowUp: ({ ...props }: LucideProps) => (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className="lucide lucide-banknote-arrow-up-icon lucide-banknote-arrow-up"
      {...props}
    >
      <path d="M12 18H4a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v5" />
      <path d="M18 12h.01" />
      <path d="M19 22v-6" />
      <path d="m22 19-3-3-3 3" />
      <path d="M6 12h.01" />
      <circle cx="12" cy="12" r="2" />
    </svg>
  ),
  arrowLeftRight: ArrowLeftRight,
  snowflake: Snowflake,
  panelRightOpen: PanelRightOpen,
  panelLeftClose: PanelLeftClose,
  walletPackageCard: ({ ...props }: LucideProps) => (
    <svg
      width="60"
      height="60"
      viewBox="0 0 60 60"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      {...props}
    >
      <rect x="0.5" y="0.5" width="59" height="59" rx="5.5" fill="url(#paint0_linear_2216_23683)" />
      <rect x="0.5" y="0.5" width="59" height="59" rx="5.5" stroke="#E2E8F0" />
      <path
        d="M41.1651 27.0122C42.8982 27.6583 44.4404 28.731 45.649 30.1311C46.8576 31.5311 47.6937 33.2134 48.08 35.0222C48.4662 36.831 48.3901 38.708 47.8587 40.4796C47.3273 42.2512 46.3578 43.8602 45.0397 45.1578C43.7217 46.4554 42.0978 47.3998 40.3181 47.9035C38.5384 48.4071 36.6604 48.454 34.8579 48.0395C33.0553 47.6251 31.3863 46.7629 30.0053 45.5325C28.6243 44.3022 27.5758 42.7435 26.9568 41.0005M20.8333 19.0003H22.6666V26.3337M38.6351 33.4468L39.9185 34.7484L34.7485 39.9184M33.6666 22.667C33.6666 28.7421 28.7418 33.667 22.6666 33.667C16.5915 33.667 11.6666 28.7421 11.6666 22.667C11.6666 16.5919 16.5915 11.667 22.6666 11.667C28.7418 11.667 33.6666 16.5919 33.6666 22.667Z"
        stroke="white"
        stroke-width="2"
        stroke-linecap="round"
        stroke-linejoin="round"
      />
      <defs>
        <linearGradient
          id="paint0_linear_2216_23683"
          x1="60"
          y1="30"
          x2="-22"
          y2="20"
          gradientUnits="userSpaceOnUse"
        >
          <stop stop-color="#A855F7" />
          <stop offset="1" stop-color="#3B82F6" />
        </linearGradient>
      </defs>
    </svg>
  ),
  checkCircle: CheckCircle,
  upload: Upload,
  edit: Edit,
  image: ImageIcon,
  externalLink: ExternalLink,
  userPlus: UserPlus,
  circleFadingArrowUp: CircleFadingArrowUp,
  coins: Coins,
  mail: Mail,
  hash: Hash,
  download: Download,
  pdf: ({ ...props }: LucideProps) => (
    <svg
      width="48"
      height="48"
      viewBox="0 0 40 40"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      {...props}
    >
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M13.7824 2H26.1139L36.9991 12.7642V33.4347C36.9991 35.9447 34.9224 38 32.3816 38H13.7825C11.2437 38 9.16699 35.9447 9.16699 33.4347V6.56532C9.16699 4.0553 11.2437 2 13.7824 2Z"
        fill="#DB5656"
      />
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M26.1152 2L37.0005 12.7642H27.2889C26.6417 12.7642 26.1152 12.2416 26.1152 11.6018V2Z"
        fill="#C13A3A"
      />
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M4.01341 17.3291H29.0904C29.6481 17.3291 30.1038 17.7797 30.1038 18.3311V27.4267C30.1038 27.9781 29.6481 28.4286 29.0904 28.4286H4.01341C3.45572 28.4286 3 27.9781 3 27.4267V18.3311C3 17.7797 3.45579 17.3291 4.01341 17.3291Z"
        fill="#C13A3A"
      />
      <path
        d="M10.1689 19.1846H8.2773C7.95266 19.1846 7.68945 19.4448 7.68945 19.7658V22.8313V23.5863V25.9914C7.68945 26.3124 7.95266 26.5726 8.2773 26.5726C8.60195 26.5726 8.86515 26.3124 8.86515 25.9914V24.1675H10.1688C11.5359 24.1675 12.6482 23.0678 12.6482 21.7162V21.6359C12.6483 20.2843 11.536 19.1846 10.1689 19.1846ZM11.4726 21.7161C11.4726 22.4268 10.8877 23.005 10.1689 23.005H8.86515V22.8312V20.3469H10.1688C10.8876 20.3469 11.4725 20.9252 11.4725 21.6358V21.7161H11.4726ZM16.4948 19.1846H14.6033C14.2787 19.1846 14.0155 19.4448 14.0155 19.7658V25.9914C14.0155 26.3124 14.2787 26.5726 14.6033 26.5726H16.4948C17.862 26.5726 18.9742 25.4729 18.9742 24.1213V21.6359C18.9742 20.2843 17.862 19.1846 16.4948 19.1846ZM17.7985 24.1212C17.7985 24.8319 17.2137 25.4101 16.4948 25.4101H15.1912V20.3469H16.4948C17.2137 20.3469 17.7985 20.9252 17.7985 21.6358V24.1212ZM21.6315 20.347V21.9559H24.3565C24.6811 21.9559 24.9443 22.2161 24.9443 22.5371C24.9443 22.858 24.6811 23.1183 24.3565 23.1183H21.6315V25.9914C21.6315 26.3124 21.3683 26.5726 21.0437 26.5726C20.719 26.5726 20.4558 26.3124 20.4558 25.9914V19.7658C20.4558 19.4448 20.719 19.1846 21.0437 19.1846H24.8267C25.1514 19.1846 25.4146 19.4448 25.4146 19.7658C25.4146 20.0867 25.1514 20.347 24.8267 20.347H21.6315Z"
        fill="white"
      />
    </svg>
  ),
  refreshCcw: RefreshCcw,
  grip: Grip,
  gripVertical: GripVertical,
  slidersHorizontal: SlidersHorizontal,
  info: Info,
  arrowLeft: ArrowLeft,
  bell: Bell,
  education: ({ ...props }: LucideProps) => (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className="lucide lucide-graduation-cap-icon lucide-graduation-cap"
      {...props}
    >
      <path d="M21.42 10.922a1 1 0 0 0-.019-1.838L12.83 5.18a2 2 0 0 0-1.66 0L2.6 9.08a1 1 0 0 0 0 1.832l8.57 3.908a2 2 0 0 0 1.66 0z" />
      <path d="M22 10v6" />
      <path d="M6 12.5V16a6 3 0 0 0 12 0v-3.5" />
    </svg>
  ),
  shieldCheck: ShieldCheck,
  cornerDownRight: CornerDownRight,
  book: Book,
  graduationCap: GraduationCap,
  eyeOff: EyeOff,
  smartphone: Smartphone,
  tablet: Tablet,
  monitor: Monitor,
  screenShare: ScreenShare,
  monitorSmartphone: MonitorSmartphone,
  edit3: Edit3,
  languages: Languages,
  ellipsisVertical: EllipsisVertical,
  mailCheck: MailCheck,
  mailPlus: MailPlus,
  send: Send,
  vault: Vault,
  search: Search,
  percent: Percent,
  landmark: Landmark,
  moneyAtm: ({ ...props }: LucideProps) => (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      viewBox="0 0 48 48"
      id="Money-Atm--Streamline-Kameleon"
      height="48"
      width="48"
      {...props}
    >
      <desc>{'\n    Money Atm Streamline Icon: https://streamlinehq.com\n  '}</desc>
      <path
        fill="#deeeff"
        d="M23.9979 47.9973c13.2548 0 23.9999 -10.7451 23.9999 -23.9999 0 -13.2547 -10.7451 -23.99984141 -23.9999 -23.99984141S-0.00195312 10.7427 -0.00195312 23.9974c0 13.2548 10.74505312 23.9999 23.99985312 23.9999Z"
        strokeWidth={1}
      />
      <path
        fill="#2e3ecd"
        d="M36.2155 14.833c0 0.4822 -0.3905 0.8727 -0.8727 0.8727H12.652c-0.4822 0 -0.8727 -0.3905 -0.8727 -0.8727v-1.7454c0 -0.4822 0.3905 -0.8728 0.8727 -0.8728h22.6908c0.4822 0 0.8727 0.3906 0.8727 0.8728v1.7454Z"
        strokeWidth={1}
      />
      <path
        fill="#2e3ecd"
        fillRule="evenodd"
        d="M17.0163 13.5244h13.9635l3.4909 17.4545h-2.7058l0.2739 -0.7688 0.0126 -0.082c0.3597 -2.3361 -1.0175 -4.5911 -3.2597 -5.3387 -2.2441 -0.7482 -4.7002 0.232 -5.8133 2.3188l-2.0641 3.8707h-7.3889l3.4909 -17.4545Z"
        clipRule="evenodd"
        strokeWidth={1}
      />
      <path
        fill="#6bafff"
        fillRule="evenodd"
        d="M31.483 27.0099c-0.574 -1.0185 -1.5134 -1.8277 -2.6917 -2.2205 -2.2441 -0.7482 -4.7003 0.232 -5.8133 2.3188l-1.1334 2.1252h-3.1225c-0.1877 -1.1214 -1.0909 -2.0029 -2.2211 -2.1556l2.2603 -13.5534H29.234l2.249 13.4855Z"
        clipRule="evenodd"
        strokeWidth={1}
      />
      <path
        fill="#2e3ecd"
        d="M23.561 23.9969c2.169 0 3.9273 -1.5629 3.9273 -3.4909 0 -1.9279 -1.7583 -3.4909 -3.9273 -3.4909 -2.1689 0 -3.9272 1.563 -3.9272 3.4909 0 1.928 1.7583 3.4909 3.9272 3.4909Z"
        strokeWidth={1}
      />
      <path
        fill="#6bafff"
        d="M25.9509 20.5403c0 0.1401 -0.1252 0.2513 -0.2827 0.2513h-0.076c-0.0436 0.261 -0.1304 0.4931 -0.2613 0.7008 -0.0598 0.0917 -0.1632 0.1737 -0.3264 0.1737 -0.2069 0 -0.3644 -0.1449 -0.3644 -0.3286 0 -0.058 0.0161 -0.116 0.0489 -0.1693 0.0816 -0.1357 0.1466 -0.271 0.185 -0.4014h-0.8269c-0.223 0.7348 -0.5603 1.049 -1.1695 1.049 -0.6091 0 -1.001 -0.4159 -1.0769 -1.025h-0.2884c-0.1576 0 -0.2828 -0.1113 -0.2828 -0.2514 0 -0.14 0.1252 -0.2513 0.2828 -0.2513h0.2936c0.0489 -0.343 0.185 -0.6668 0.381 -0.9522 0.0707 -0.1016 0.1798 -0.164 0.3264 -0.164 0.212 0 0.37 0.1448 0.37 0.3334 0 0.0628 -0.0271 0.1304 -0.0707 0.1885 -0.1466 0.2029 -0.25 0.3962 -0.3046 0.6187h0.8649c0.2121 -0.696 0.5114 -1.0394 1.1585 -1.0394 0.5987 0 1.0011 0.4063 1.0717 1.015h0.0651c0.1575 0.0009 0.2827 0.1121 0.2827 0.2522Zm-2.7146 0.2273h-0.7562c0.038 0.2274 0.1575 0.3435 0.3535 0.3435 0.1797 0 0.2993 -0.0825 0.4027 -0.3435Zm0.9522 -0.4542h0.7344c-0.038 -0.2321 -0.1685 -0.3338 -0.3426 -0.3338 -0.1689 0 -0.2832 0.0676 -0.3918 0.3338Z"
        strokeWidth={1}
      />
      <path
        fill="#2e3ecd"
        d="m28.3504 37.9606 2.8381 -7.9653c0.295 -1.9156 -0.8343 -3.7649 -2.6732 -4.378 -1.8401 -0.6135 -3.8543 0.1902 -4.7672 1.9016l-5.5684 10.4417h10.1707Z"
        strokeWidth={1}
      />
      <path
        fill="#6bafff"
        d="M29.2013 29.98c0.3814 -1.1088 -0.2086 -2.3171 -1.3173 -2.6985 -1.1088 -0.3814 -2.3171 0.2086 -2.6985 1.3174l-0.1728 0.5018 4.0158 1.3807 0.1728 -0.5014Z"
        strokeWidth={1}
      />
    </svg>
  ),
};
