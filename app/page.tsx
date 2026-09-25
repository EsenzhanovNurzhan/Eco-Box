'use client';

import Image from "next/image";
import Link from "next/link";
import { CampusMapDialog } from "./components/campus-map-dialog";
import { LanguageSwitcher, useLocale } from "./i18n";
import { useEffect, useState } from "react";
import {
  ArrowRight,
  ArrowUpRight,
  BadgeCheck,
  BookOpen,
  Bookmark,
  Check,
  ChevronDown,
  Clock3,
  Coffee,
  Heart,
  Leaf,
  MapPin,
  Navigation,
  PackageOpen,
  Pencil,
  Search,
  Shirt,
  SlidersHorizontal,
  Sparkles,
  Ticket,
  UserRound,
  X,
  CupSoda,
} from "lucide-react";

type Category = "Все" | "Одежда" | "Книги" | "Посуда" | "Канцелярия";
type Condition = "Отличное" | "Хорошее" | "Требует чистки";
type Tab = "market" | "reservations" | "karma";

type EcoItem = {
  id: string;
  title: string;
  category: Exclude<Category, "Все">;
  condition: Condition;
  locationId: string;
  age: string;
  ageHours: number;
  image: string;
  imageAlt: string;
  note: string;
  reserved?: boolean;
};

type Reservation = {
  itemId: string;
  expiresAt: number;
};

const basePath = process.env.NEXT_PUBLIC_BASE_PATH ?? "";

const university = {
  name: "Атырауский университет нефти и газа имени Сафи Утебаева",
  color: "blue",
};

const locations = [
  {
    id: "all",
    name: "Все корпуса и филиалы",
    address: "Атырау",
    mapUrl: "https://2gis.kz/atyrau/branches/70000001035132953/firm/70000001035144333",
  },
  {
    id: "building-2",
    name: "Учебный корпус №2 · нефтегазовый факультет",
    address: "ул. Муса Баймуханова, 45а/1 · Атырау",
    mapUrl: "https://2gis.kz/atyrau/firm/70000001035144333",
  },
  {
    id: "building-9",
    name: "Учебный корпус №9 · индустриально-технологический факультет",
    address: "ул. Муса Баймуханова, 45а/7 · Атырау",
    mapUrl: "https://2gis.kz/atyrau/firm/70000001035132954",
  },
  {
    id: "building-10",
    name: "Учебный корпус №10 · факультет информационных технологий",
    address: "ул. Муса Баймуханова, 45а/3 · Атырау",
    mapUrl: "https://2gis.kz/atyrau/firm/70000001113884779",
  },
  {
    id: "building-5",
    name: "Учебный корпус №5",
    address: "ул. Муса Баймуханова, 45а/3 · Атырау",
    mapUrl: "https://2gis.kz/atyrau/firm/70000001035144735",
  },
  {
    id: "dorm-4",
    name: "Общежитие №4",
    address: "ул. Муса Баймуханова, 45а/4 · Атырау",
    mapUrl: "https://2gis.kz/atyrau/firm/70000001035132959",
  },
  {
    id: "sports-complex",
    name: "Студенческий спортивный комплекс",
    address: "ул. Муса Баймуханова, 45а/4 · Атырау",
    mapUrl: "https://2gis.kz/atyrau/firm/70000001035132939",
  },
  {
    id: "institute",
    name: "Институт нефтехимической инженерии и экологии им. Н.К. Надирова",
    address: "пр. Азаттык, 1 · Атырау",
    mapUrl: "https://2gis.kz/atyrau/firm/70000001036345137",
  },
  {
    id: "admissions",
    name: "Приёмная комиссия",
    address: "ул. Муса Баймуханова, 45а/6 · Атырау",
    mapUrl: "https://2gis.kz/atyrau/firm/70000001113884781",
  },
];

const items: EcoItem[] = [
  {
    id: "field-guide",
    title: "Атлас растений средней полосы",
    category: "Книги",
    condition: "Отличное",
    locationId: "building-2",
    age: "2 часа назад",
    ageHours: 2,
    image: "https://images.unsplash.com/photo-1544947950-fa07a98d237f?auto=format&fit=crop&w=900&q=85",
    imageAlt: "Иллюстрированная книга на столе",
    note: "Внутри нет пометок",
  },
  {
    id: "ceramic-cup",
    title: "Кружка ручной работы",
    category: "Посуда",
    condition: "Хорошее",
    locationId: "building-2",
    age: "Сегодня",
    ageHours: 5,
    image: "https://images.unsplash.com/photo-1514228742587-6b1558fcca3d?auto=format&fit=crop&w=900&q=85",
    imageAlt: "Керамическая чашка на столе",
    note: "Без сколов, чистая",
  },
  {
    id: "green-knit",
    title: "Свитер цвета мха",
    category: "Одежда",
    condition: "Отличное",
    locationId: "building-9",
    age: "Вчера",
    ageHours: 22,
    image: "https://images.unsplash.com/photo-1576566588028-4147f3842f27?auto=format&fit=crop&w=900&q=85",
    imageAlt: "Сложенный зелёный свитер",
    note: "Размер M, после стирки",
  },
  {
    id: "marker-set",
    title: "Маркеры для скетчинга",
    category: "Канцелярия",
    condition: "Хорошее",
    locationId: "building-10",
    age: "Вчера",
    ageHours: 27,
    image: "https://images.unsplash.com/photo-1513364776144-60967b0f800f?auto=format&fit=crop&w=900&q=85",
    imageAlt: "Материалы для рисования на столе",
    note: "6 цветов, все пишут",
  },
  {
    id: "art-book",
    title: "Искусство видеть",
    category: "Книги",
    condition: "Хорошее",
    locationId: "building-5",
    age: "3 дня назад",
    ageHours: 68,
    image: "https://images.unsplash.com/photo-1519682337058-a94d519337bc?auto=format&fit=crop&w=900&q=85",
    imageAlt: "Книги и блокнот на деревянном столе",
    note: "Мягкая обложка",
  },
  {
    id: "denim-jacket",
    title: "Джинсовая куртка",
    category: "Одежда",
    condition: "Требует чистки",
    locationId: "dorm-4",
    age: "Сегодня",
    ageHours: 7,
    image: "https://images.unsplash.com/photo-1543076447-215ad9ba6923?auto=format&fit=crop&w=900&q=85",
    imageAlt: "Джинсовая куртка на вешалке",
    note: "Размер S, нужна стирка",
  },
  {
    id: "breakfast-plate",
    title: "Тарелка для завтрака",
    category: "Посуда",
    condition: "Отличное",
    locationId: "institute",
    age: "2 дня назад",
    ageHours: 43,
    image: "https://images.unsplash.com/photo-1610701596007-11502861dcfa?auto=format&fit=crop&w=900&q=85",
    imageAlt: "Керамическая тарелка ручной работы",
    note: "Керамика, без сколов",
  },
  {
    id: "notebook",
    title: "Скетчбук в точку",
    category: "Канцелярия",
    condition: "Отличное",
    locationId: "building-10",
    age: "4 дня назад",
    ageHours: 92,
    image: "https://images.unsplash.com/photo-1544816155-12df9643f363?auto=format&fit=crop&w=900&q=85",
    imageAlt: "Открытый блокнот с карандашом",
    note: "Почти не использовался",
    reserved: true,
  },
];

const categoryIcons = {
  Одежда: Shirt,
  Книги: BookOpen,
  Посуда: CupSoda,
  Канцелярия: Pencil,
};

const categoryOptions: Category[] = ["Все", "Одежда", "Книги", "Посуда", "Канцелярия"];

function formatTime(milliseconds: number) {
  const totalSeconds = Math.max(0, Math.ceil(milliseconds / 1000));
  const minutes = Math.floor(totalSeconds / 60);
  const seconds = totalSeconds % 60;
  return `${minutes}:${String(seconds).padStart(2, "0")}`;
}

function TabButton({
  active,
  icon,
  label,
  onClick,
}: {
  active: boolean;
  icon: React.ReactNode;
  label: string;
  onClick: () => void;
}) {
  return (
    <button className={`tab-button${active ? " is-active" : ""}`} onClick={onClick} aria-current={active ? "page" : undefined}>
      {icon}
      <span>{label}</span>
    </button>
  );
}

function ItemCard({
  item,
  locationName,
  isSaved,
  isMyReservation,
  onBookmark,
  onReserve,
}: {
  item: EcoItem;
  locationName: string;
  isSaved: boolean;
  isMyReservation: boolean;
  onBookmark: () => void;
  onReserve: () => void;
}) {
  const { tr } = useLocale();
  const CategoryIcon = categoryIcons[item.category];

  return (
    <article className="item-card">
      <div className="item-image-wrap">
        <Image src={item.image} alt={tr(item.imageAlt)} fill sizes="(max-width: 640px) 46vw, (max-width: 1000px) 30vw, 260px" unoptimized className="item-image" />
        <span className="item-category"><CategoryIcon size={13} strokeWidth={1.8} />{tr(item.category)}</span>
        <button className={`bookmark-button${isSaved ? " is-saved" : ""}`} onClick={onBookmark} aria-label={tr(isSaved ? "Убрать из избранного" : "В избранное")} aria-pressed={isSaved} title={tr(isSaved ? "Убрать из избранного" : "В избранное")}>
          <Heart size={17} fill={isSaved ? "currentColor" : "none"} />
        </button>
        {item.reserved && <span className="reserved-ribbon">{tr("Забронировано")}</span>}
      </div>
      <div className="item-content">
        <div className="item-title-row">
          <h3>{tr(item.title)}</h3>
          <span className={`condition-dot ${item.condition === "Отличное" ? "condition-great" : item.condition === "Хорошее" ? "condition-good" : "condition-clean"}`} title={tr(item.condition)} />
        </div>
        <p className="item-note">{tr(item.note)}</p>
        <div className="item-meta">
          <span><MapPin size={13} />{locationName}</span>
          <span><Clock3 size={13} />{tr(item.age)}</span>
        </div>
        <button className={`reserve-button${item.reserved ? " is-disabled" : ""}`} onClick={onReserve} disabled={item.reserved}>
          {tr(isMyReservation ? "Моя бронь" : item.reserved ? "Забронировано" : "Забронировать")}
          {!item.reserved && <ArrowRight size={15} />}
        </button>
      </div>
    </article>
  );
}

export default function Home() {
  const { t, tr } = useLocale();
  const [activeTab, setActiveTab] = useState<Tab>("market");
  const [locationId, setLocationId] = useState("all");
  const [locationOpen, setLocationOpen] = useState(false);
  const [mapOpen, setMapOpen] = useState(false);
  const [category, setCategory] = useState<Category>("Все");
  const [condition, setCondition] = useState("Все состояния");
  const [ageFilter, setAgeFilter] = useState("Любое время");
  const [query, setQuery] = useState("");
  const [showFilters, setShowFilters] = useState(false);
  const [favorites, setFavorites] = useState<string[]>([]);
  const [showOnlyFavorites, setShowOnlyFavorites] = useState(false);
  const [reservation, setReservation] = useState<Reservation | null>(null);
  const [pendingItem, setPendingItem] = useState<EcoItem | null>(null);
  const [notice, setNotice] = useState("");
  const [now, setNow] = useState(0);
  const [hydrated, setHydrated] = useState(false);

  const currentLocation = locations.find((location) => location.id === locationId) ?? locations[0];
  const activeReservation = reservation && reservation.expiresAt > now ? reservation : null;
  const reservedItem = activeReservation ? items.find((item) => item.id === activeReservation.itemId) : undefined;
  const reservedLocation = reservedItem ? locations.find((location) => location.id === reservedItem.locationId) ?? currentLocation : currentLocation;
  const pendingLocation = pendingItem ? locations.find((location) => location.id === pendingItem.locationId) ?? currentLocation : currentLocation;
  const locationItemCount = locationId === "all" ? items.length : items.filter((item) => item.locationId === locationId).length;

  useEffect(() => {
    const timeout = window.setTimeout(() => {
      const savedReservation = window.localStorage.getItem("ecobox-demo-reservation");
      if (savedReservation) {
        try {
          const parsed = JSON.parse(savedReservation) as Reservation;
          if (parsed.expiresAt > Date.now() && items.some((item) => item.id === parsed.itemId)) {
            setReservation(parsed);
          } else {
            window.localStorage.removeItem("ecobox-demo-reservation");
          }
        } catch {
          window.localStorage.removeItem("ecobox-demo-reservation");
        }
      }
      setNow(Date.now());
      setHydrated(true);
    }, 0);

    return () => window.clearTimeout(timeout);
  }, []);

  useEffect(() => {
    const interval = window.setInterval(() => {
      const currentTime = Date.now();
      setNow(currentTime);
      if (reservation && reservation.expiresAt <= currentTime) {
        setReservation(null);
        window.localStorage.removeItem("ecobox-demo-reservation");
        setNotice(tr("Время брони истекло. Вещь снова доступна."));
      }
    }, 1000);

    return () => window.clearInterval(interval);
  }, [reservation, tr]);

  useEffect(() => {
    if (!hydrated) return;
    if (reservation && reservation.expiresAt > Date.now()) {
      window.localStorage.setItem("ecobox-demo-reservation", JSON.stringify(reservation));
    } else {
      window.localStorage.removeItem("ecobox-demo-reservation");
    }
  }, [hydrated, reservation]);

  useEffect(() => {
    if (!notice) return;
    const timeout = window.setTimeout(() => setNotice(""), 4200);
    return () => window.clearTimeout(timeout);
  }, [notice]);

  const filteredItems = items.filter((item) => {
    if (locationId !== "all" && item.locationId !== locationId) return false;
    if (category !== "Все" && item.category !== category) return false;
    if (condition !== "Все состояния" && item.condition !== condition) return false;
    if (ageFilter === "До 24 часов" && item.ageHours > 24) return false;
    if (ageFilter === "До недели" && item.ageHours > 168) return false;
    if (activeTab === "market" && query && !`${item.title} ${item.category} ${item.note}`.toLowerCase().includes(query.toLowerCase())) return false;
    return true;
  });

  const visibleItems = activeTab === "market" && showOnlyFavorites
    ? filteredItems.filter((item) => favorites.includes(item.id))
    : filteredItems;

  function toggleFavorite(itemId: string) {
    setFavorites((current) => current.includes(itemId) ? current.filter((id) => id !== itemId) : [...current, itemId]);
  }

  function showFavorites() {
    setShowOnlyFavorites((current) => !current);
    setActiveTab("market");
  }

  function startReservation(item: EcoItem) {
    if (activeReservation) {
      if (activeReservation.itemId === item.id) {
        setActiveTab("reservations");
      } else {
        setNotice(tr("Сначала забери или отмени текущую бронь."));
      }
      return;
    }
    setPendingItem(item);
  }

  function confirmReservation() {
    if (!pendingItem) return;
    const createdAt = Date.now();
    setNow(createdAt);
    setReservation({ itemId: pendingItem.id, expiresAt: createdAt + 20 * 60 * 1000 });
    setPendingItem(null);
    setActiveTab("reservations");
    setNotice(tr("Готово! Вещь забронирована на 20 минут."));
  }

  function releaseReservation(message: string) {
    setReservation(null);
    setNotice(message);
  }

  function selectLocation(id: string) {
    setLocationId(id);
    setLocationOpen(false);
  }

  const reservationTime = activeReservation ? formatTime(activeReservation.expiresAt - now) : "20:00";

  return (
    <main className="app-shell">
      <div className="page-grain" aria-hidden="true" />
      <header className="topbar">
        <div className="brand-cluster">
          <Link className="brand" href="/" aria-label="EcoBox, на главную">
            <Image src={`${basePath}/ecobox-logo.jpg`} alt="" width={768} height={768} className="ecobox-logo" />
          </Link>
          <span className="brand-divider" aria-hidden="true" />
          <div className="university-mark" title={t("universityName")}>
            <Image src={`${basePath}/aogu-logo.png`} alt={t("universityLogoAlt")} width={72} height={72} loading="eager" unoptimized />
          </div>
        </div>
        <nav className="desktop-nav" aria-label={t("sectionsLabel")}>
          <TabButton active={activeTab === "market"} icon={<PackageOpen size={17} />} label={t("navMarket")} onClick={() => setActiveTab("market")} />
          <TabButton active={activeTab === "reservations"} icon={<Bookmark size={17} />} label={t("navReservations")} onClick={() => setActiveTab("reservations")} />
          <TabButton active={activeTab === "karma"} icon={<Leaf size={17} />} label={t("navKarma")} onClick={() => setActiveTab("karma")} />
        </nav>
        <div className="topbar-actions">
          <LanguageSwitcher />
          <button className="points-pill" onClick={() => setActiveTab("karma")}><Sparkles size={15} />86 <span>{t("pointsShort")}</span></button>
          <Link className="avatar-button" href="/signup" aria-label={t("createAccount")} title={t("createAccount")}><UserRound size={18} /></Link>
        </div>
      </header>

      <div className="campus-select-wrap">
        <button className={`campus-trigger${locationOpen ? " is-open" : ""}`} onClick={() => setLocationOpen((open) => !open)} aria-expanded={locationOpen}>
          <span className="campus-pin"><MapPin size={16} /></span>
          <span className="campus-trigger-copy"><small>{t("universityLabel")}</small><strong>{t("universityName")}</strong></span>
          <ChevronDown size={17} className="campus-chevron" />
        </button>
        {locationOpen && (
          <div className="campus-menu">
            <p className="menu-eyebrow">{t("locationsHeading")}</p>
            {locations.map((location) => (
              <button className={`campus-option${location.id === locationId ? " is-selected" : ""}`} key={location.id} onClick={() => selectLocation(location.id)}>
                <span className="campus-option-icon"><MapPin size={17} /></span>
                <span><strong>{tr(location.name)}</strong><small>{tr(location.address)}</small></span>
                <span className="location-count">{location.id === "all" ? items.length : items.filter((item) => item.locationId === location.id).length}</span>
                {location.id === locationId && <Check size={17} />}
              </button>
            ))}
          </div>
        )}
      </div>

      <div className="main-frame">
        {activeTab === "market" && (
          <>
            <section className="hero-section">
              <div className="hero-copy">
                <span className="eyebrow"><span className="eyebrow-dot" />{t("heroEyebrow")}</span>
                <h1>{t("heroTitleA")}<br /><em>{t("heroTitleB")}</em></h1>
                <p>{t("heroBody")}</p>
                <a className="hero-cta" href="#market" onClick={() => setActiveTab("market")}>{t("openShowcase")} <ArrowRight size={17} /></a>
                <div className="hero-proof"><span className="proof-avatars"><i><Leaf size={12} /></i><i>A</i><i>G</i></span><span>{t("demoShowcase")} <strong>{t("communityAogu")}</strong></span></div>
              </div>
              <aside className={`locker-feature ${university.color}`}>
                <div className="locker-feature-top"><span className="locker-live"><i />{t("demoPoint")}</span><span className="locker-number">AOGU</span></div>
                <div className="mini-map" aria-label={`${t("mapAltPrefix")} ${tr(currentLocation.name)}`}>
                  <span className="map-block map-block-one" /><span className="map-block map-block-two" /><span className="map-block map-block-three" />
                  <span className="map-road map-road-horizontal" /><span className="map-road map-road-vertical" />
                  <span className="map-marker"><MapPin size={19} fill="currentColor" /></span>
                  <span className="map-label">EcoBox</span>
                  <span className="map-compass">N <ArrowUpRight size={13} /></span>
                </div>
                <div className="locker-feature-bottom">
                  <div><small>{t("mapLabel")}</small><strong>{tr(currentLocation.name)}</strong><span>{tr(currentLocation.address)}</span></div>
                  <span className="locker-count">{locationItemCount}<small>{t("demoItems")}</small></span>
                </div>
                <button className="locker-route" type="button" onClick={() => setMapOpen(true)}><Navigation size={15} />{t("openInteractiveMap")} <ArrowUpRight size={14} /></button>
              </aside>
            </section>

            <section className="catalog-section" id="market">
              <div className="section-heading">
                <div><span className="eyebrow">{t("catalogEyebrow")}</span><h2>{t("catalogTitle")} <span>{visibleItems.length}</span></h2></div>
                <button className={`saved-filter${showOnlyFavorites ? " is-active" : ""}`} onClick={showFavorites} aria-pressed={showOnlyFavorites}><Heart size={16} fill={showOnlyFavorites ? "currentColor" : "none"} /> {t("favorites")} <span>{favorites.length}</span></button>
              </div>

              <div className="catalog-tools">
                <label className="search-field"><Search size={18} /><input value={query} onChange={(event) => setQuery(event.target.value)} placeholder={t("searchPlaceholder")} aria-label={t("searchPlaceholder")} />{query && <button onClick={() => setQuery("")} aria-label={t("close")}><X size={16} /></button>}</label>
                <button className={`filter-toggle${showFilters ? " is-active" : ""}`} onClick={() => setShowFilters((open) => !open)} aria-expanded={showFilters}><SlidersHorizontal size={17} />{t("filters")}</button>
              </div>

              <div className="category-row" role="group" aria-label={t("categoriesLabel")}>
                {categoryOptions.map((option) => <button key={option} className={`category-chip${category === option ? " is-active" : ""}`} onClick={() => setCategory(option)} aria-pressed={category === option}>{tr(option)}</button>)}
              </div>

              {showFilters && (
                <div className="filter-panel">
                  <label>{t("condition")}<select value={condition} onChange={(event) => setCondition(event.target.value)}><option value="Все состояния">{tr("Все состояния")}</option><option value="Отличное">{tr("Отличное")}</option><option value="Хорошее">{tr("Хорошее")}</option><option value="Требует чистки">{tr("Требует чистки")}</option></select></label>
                  <label>{t("ageInLocker")}<select value={ageFilter} onChange={(event) => setAgeFilter(event.target.value)}><option value="Любое время">{tr("Любое время")}</option><option value="До 24 часов">{tr("До 24 часов")}</option><option value="До недели">{tr("До недели")}</option></select></label>
                  <button onClick={() => { setCondition("Все состояния"); setAgeFilter("Любое время"); setCategory("Все"); setQuery(""); }}><X size={14} />{t("reset")}</button>
                </div>
              )}

              {visibleItems.length > 0 ? (
                <div className="item-grid">
                  {visibleItems.map((item, index) => <div className="item-reveal" style={{ animationDelay: `${index * 55}ms` }} key={item.id}><ItemCard item={item} locationName={tr(locations.find((location) => location.id === item.locationId)?.name ?? university.name)} isSaved={favorites.includes(item.id)} isMyReservation={activeReservation?.itemId === item.id} onBookmark={() => toggleFavorite(item.id)} onReserve={() => startReservation(item)} /></div>)}
                </div>
              ) : (
                <div className="empty-state"><span><PackageOpen size={24} /></span><h3>{tr(showOnlyFavorites ? "Пока ничего не сохранено" : "Пока здесь тихо")}</h3><p>{tr(showOnlyFavorites ? "Нажми на сердечко у вещи, чтобы вернуться к ней позже." : "Смени фильтры или загляни позже — новые вещи появятся здесь.")}</p><button onClick={() => { setCategory("Все"); setCondition("Все состояния"); setAgeFilter("Любое время"); setQuery(""); setShowOnlyFavorites(false); }}>{t("showAll")} <ArrowRight size={15} /></button></div>
              )}
            </section>

            <section className="karma-banner">
              <div className="karma-banner-mark"><Leaf size={24} /></div>
              <div><span className="eyebrow">{t("bannerEyebrow")}</span><h2>{t("bannerTitleA")}<br className="mobile-break" /> {t("bannerTitleB")}</h2><p>{t("bannerBody")}</p></div>
              <button onClick={() => setActiveTab("karma")}>{t("myKarma")} <ArrowRight size={16} /></button>
              <span className="banner-orbit orbit-one" /><span className="banner-orbit orbit-two" />
            </section>

            <section className="faq-section" id="faq">
              <div className="faq-heading"><div><span className="eyebrow">{t("faqShortHeading")}</span><h2>{t("faqTitle")}</h2></div><span className="faq-side-note">{t("faqAside")}</span></div>
              <div className="faq-list">
                <details><summary>{t("faqReservationQuestion")}<span>+</span></summary><p>{t("faqReservationAnswer")}</p></details>
                <details><summary>{t("faqAppQuestion")}<span>+</span></summary><p>{t("faqAppAnswer")}</p></details>
                <details><summary>{t("faqModeratorQuestion")}<span>+</span></summary><p>{t("faqModeratorAnswer")}</p></details>
              </div>
            </section>
          </>
        )}

        {activeTab === "reservations" && (
          <section className="subpage-section">
            <div className="subpage-heading"><span className="eyebrow">{t("reservationEyebrow")}</span><h1>{t("reservationsTitle")}<span className="heading-period">.</span></h1><p>{t("reservationIntro")}</p></div>
            {activeReservation && reservedItem ? (
              <article className="reservation-card">
                <div className="reservation-image"><Image src={reservedItem.image} alt={reservedItem.imageAlt} fill sizes="(max-width: 600px) 90vw, 430px" unoptimized className="item-image" /></div>
                <div className="reservation-details"><span className="reservation-state"><i />{t("reservationActive")}</span><h2>{tr(reservedItem.title)}</h2><p>{tr(reservedLocation.name)} · {tr(reservedLocation.address)}</p><div className="reservation-countdown"><Clock3 size={18} /><span>{t("reservationCountdown")}</span><strong>{reservationTime}</strong></div><div className="reservation-actions"><button className="primary-button" onClick={() => releaseReservation(t("reservationPicked"))}>{t("pickedUp")} <Check size={16} /></button><button className="text-button" onClick={() => releaseReservation(t("reservationCanceled"))}>{t("cancelReservation")}</button></div><p className="demo-note">{t("localReservationNote")}</p></div>
              </article>
            ) : (
              <div className="empty-state reservation-empty"><span><Bookmark size={23} /></span><h3>{t("emptyReservationsTitle")}</h3><p>{t("emptyReservationsBody")}</p><button onClick={() => setActiveTab("market")}>{t("goToShowcase")} <ArrowRight size={15} /></button></div>
            )}
          </section>
        )}

        {activeTab === "karma" && (
          <section className="subpage-section karma-page">
            <div className="subpage-heading"><span className="eyebrow">{t("karmaEyebrow")}</span><h1>{t("karmaTitle")}<span className="heading-period">.</span></h1><p>{t("karmaBody")}</p></div>
            <div className="karma-profile">
              <div className="karma-profile-top"><div className="karma-avatar"><Leaf size={27} /></div><div><span className="level-tag"><BadgeCheck size={14} />{t("karmaLevel")}</span><h2>{t("karmaHeader")}</h2></div></div>
              <div className="points-total"><strong>86</strong><span>{t("points")}</span><Sparkles size={22} /></div>
              <div className="progress-label"><span>{t("progressToLevel")}</span><strong>{t("pointsRemaining")}</strong></div><div className="progress-track"><span /></div>
              <div className="level-progress"><span>{t("levelTwo")}</span><span>{t("levelThree")} · 120</span></div>
              <p className="demo-note">{t("karmaDemoNote")}</p>
            </div>
            <div className="rewards-heading"><div><span className="eyebrow">{t("rewardsEyebrow")}</span><h2>{t("rewardsTitle")}</h2></div><span>{t("rewardsSoon")}</span></div>
            <div className="reward-list">
              <article className="reward-row"><span className="reward-icon reward-coffee"><Coffee size={20} /></span><div><strong>{t("coffeeReward")}</strong><small>{t("coffeeDetails")}</small></div><span className="reward-cost"><Sparkles size={14} />120</span><button disabled aria-label={t("rewardUnavailable")}><ArrowUpRight size={17} /></button></article>
              <article className="reward-row"><span className="reward-icon reward-merch"><Ticket size={20} /></span><div><strong>{t("merchReward")}</strong><small>{t("merchDetails")}</small></div><span className="reward-cost"><Sparkles size={14} />240</span><button disabled aria-label={t("rewardUnavailable")}><ArrowUpRight size={17} /></button></article>
            </div>
            <div className="levels-strip"><span><span className="level-number">01</span>{t("levelOne")} <small>0–2</small></span><ArrowRight size={15} /><span><span className="level-number">02</span>{t("levelTwo")} <small>3–9</small></span><ArrowRight size={15} /><span><span className="level-number">03</span>{t("levelThree")} <small>10+</small></span></div>
          </section>
        )}

        <footer className="site-footer"><Link className="footer-brand" href="/" aria-label="EcoBox, на главную"><Image src={`${basePath}/ecobox-logo.jpg`} alt="" width={768} height={768} className="ecobox-logo" /></Link><span>{t("siteFooter")}</span><a href="#faq">{t("faqLink")} <ArrowUpRight size={13} /></a></footer>
      </div>

      <nav className="mobile-nav" aria-label={t("bottomNavLabel")}>
        <TabButton active={activeTab === "market"} icon={<PackageOpen size={19} />} label={t("navMarket")} onClick={() => setActiveTab("market")} />
        <TabButton active={activeTab === "reservations"} icon={<Bookmark size={19} />} label={t("navReservations")} onClick={() => setActiveTab("reservations")} />
        <TabButton active={activeTab === "karma"} icon={<Leaf size={19} />} label={t("navKarma")} onClick={() => setActiveTab("karma")} />
      </nav>

      {pendingItem && (
        <div className="modal-backdrop" onMouseDown={(event) => { if (event.target === event.currentTarget) setPendingItem(null); }}>
          <section className="booking-modal" role="dialog" aria-modal="true" aria-labelledby="booking-title">
            <button className="modal-close" onClick={() => setPendingItem(null)} aria-label="Закрыть"><X size={18} /></button>
            <span className="modal-icon"><Bookmark size={21} /></span>
            <span className="eyebrow">{t("itemWaiting")}</span>
            <h2 id="booking-title">{t("reserveQuestion").replace("{item}", tr(pendingItem.title))}</h2>
            <p>{t("itemWaitingAt")} <strong>{tr(pendingLocation.name)}</strong>. {t("bookingDuration")}</p>
            <div className="modal-location"><MapPin size={16} /><span>{tr(pendingLocation.name)}<small>{tr(pendingLocation.address)}</small></span></div>
            <button className="primary-button modal-confirm" onClick={confirmReservation}>{t("reserveFor20")} <ArrowRight size={16} /></button>
            <button className="modal-cancel" onClick={() => setPendingItem(null)}>{t("notNow")}</button>
            <p className="demo-note">{t("demoOnly")}</p>
          </section>
        </div>
      )}

      {notice && <div className="toast-message" role="status" aria-live="polite"><span><Check size={15} /></span>{notice}<button onClick={() => setNotice("")} aria-label={t("closeNotice")}><X size={15} /></button></div>}
      {mapOpen && (
        <CampusMapDialog
          isOpen={mapOpen}
          locationId={currentLocation.id}
          locationName={tr(currentLocation.name)}
          address={tr(currentLocation.address)}
          mapUrl={currentLocation.mapUrl}
          onClose={() => setMapOpen(false)}
        />
      )}
    </main>
  );
}
