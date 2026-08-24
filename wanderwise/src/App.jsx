import { useMemo, useState } from 'react';
import {
  ArrowRight,
  BedDouble,
  Bell,
  CalendarDays,
  Check,
  ChevronDown,
  Compass,
  Heart,
  House,
  Leaf,
  MapPin,
  Menu,
  MessageCircle,
  Mountain,
  Search,
  ShieldCheck,
  Sparkles,
  Star,
  Trophy,
  Users,
  X,
} from 'lucide-react';
import { defaultItinerary, destinations, experiences, hotels } from './data';

const money = (value) => `₹${value.toLocaleString('en-IN')}`;

function Logo() {
  return (
    <div className="logo" onClick={() => window.dispatchEvent(new CustomEvent('ww-home'))}>
      <span className="logo-mark"><Compass size={18} /></span>
      <span>Wander<span>Wise</span></span>
    </div>
  );
}

function App() {
  const [page, setPage] = useState('home');
  const [role, setRole] = useState('traveler');
  const [mobileMenu, setMobileMenu] = useState(false);
  const [toast, setToast] = useState('');
  const [plannerInput, setPlannerInput] = useState({ destination: 'Hampi', dates: '12–14 Oct 2026', budget: '25000', pace: 'Balanced' });
  const [itinerary, setItinerary] = useState(defaultItinerary);
  const [saved, setSaved] = useState(false);
  const [favorites, setFavorites] = useState([]);

  const notify = (message) => {
    setToast(message);
    window.clearTimeout(window.__wwToast);
    window.__wwToast = window.setTimeout(() => setToast(''), 2800);
  };

  const navigate = (nextPage) => {
    setPage(nextPage);
    setMobileMenu(false);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const toggleFavorite = (id) => {
    setFavorites((items) => items.includes(id) ? items.filter((item) => item !== id) : [...items, id]);
  };

  const generatePlan = () => {
    setItinerary(defaultItinerary.map((day, index) => ({
      ...day,
      title: index === 0 ? `Arrive gently in ${plannerInput.destination}` : index === 1 ? 'Follow the local rhythm' : 'Leave with a story',
    })));
    notify('Your personalized plan is ready.');
  };

  return (
    <div className="app-shell">
      <Header page={page} role={role} setRole={setRole} navigate={navigate} mobileMenu={mobileMenu} setMobileMenu={setMobileMenu} />
      {role === 'traveler' ? (
        <TravelerRoutes page={page} navigate={navigate} notify={notify} plannerInput={plannerInput} setPlannerInput={setPlannerInput} itinerary={itinerary} generatePlan={generatePlan} saved={saved} setSaved={setSaved} favorites={favorites} toggleFavorite={toggleFavorite} />
      ) : (
        <Dashboard role={role} setRole={setRole} navigate={navigate} notify={notify} />
      )}
      <Concierge notify={notify} />
      <Footer navigate={navigate} />
      {toast && <div className="toast"><Check size={16} /> {toast}</div>}
    </div>
  );
}

function Header({ page, role, setRole, navigate, mobileMenu, setMobileMenu }) {
  const navItems = [
    ['home', 'Discover'],
    ['planner', 'AI Planner'],
    ['stays', 'Stays'],
    ['experiences', 'Experiences'],
    ['trips', 'My trips'],
  ];

  return (
    <header className="topbar">
      <div className="nav-inner">
        <Logo />
        <nav className={`main-nav ${mobileMenu ? 'open' : ''}`}>
          {navItems.map(([id, label]) => <button key={id} className={page === id ? 'active' : ''} onClick={() => navigate(id)}>{label}</button>)}
        </nav>
        <div className="nav-actions">
          <button className="icon-button" aria-label="Notifications" onClick={() => navigate('rewards')}><Bell size={18} /></button>
          <div className="role-select">
            <select value={role} onChange={(event) => setRole(event.target.value)} aria-label="Demo role">
              <option value="traveler">Traveler view</option>
              <option value="vendor">Vendor dashboard</option>
              <option value="guide">Guide dashboard</option>
            </select>
            <ChevronDown size={15} />
          </div>
          <button className="avatar" aria-label="Open profile" onClick={() => navigate('profile')}>P</button>
          <button className="menu-button" onClick={() => setMobileMenu(!mobileMenu)} aria-label="Toggle menu">{mobileMenu ? <X size={21} /> : <Menu size={21} />}</button>
        </div>
      </div>
    </header>
  );
}

function TravelerRoutes(props) {
  switch (props.page) {
    case 'planner': return <Planner {...props} />;
    case 'stays': return <Stays {...props} />;
    case 'experiences': return <Experiences {...props} />;
    case 'trips': return <Trips {...props} />;
    case 'rewards': return <Rewards {...props} />;
    case 'profile': return <Profile {...props} />;
    default: return <Home {...props} />;
  }
}

function Home({ navigate, notify, toggleFavorite, favorites }) {
  return (
    <main>
      <section className="hero-section">
        <div className="hero-copy">
          <div className="eyebrow"><Sparkles size={14} /> Travel with intention</div>
          <h1>Go somewhere<br /><em>worth remembering.</em></h1>
          <p>Plan thoughtful trips, stay with people who know the place, and make room for the unexpected.</p>
          <div className="hero-actions"><button className="button button-primary" onClick={() => navigate('planner')}>Build my trip <ArrowRight size={17} /></button><button className="text-button" onClick={() => navigate('experiences')}>Explore local experiences</button></div>
        </div>
        <div className="hero-art"><div className="hero-image" /><div className="floating-note note-one"><Leaf size={17} /><span><strong>12,480 kg</strong><small>CO₂ avoided this month</small></span></div><div className="floating-note note-two"><MapPin size={16} /><span><strong>Hampi, Karnataka</strong><small>Less crowded · 4.9 ★</small></span></div></div>
      </section>
      <SearchPanel navigate={navigate} />
      <section className="section container">
        <SectionHeading eyebrow="Find your kind of place" title="A little off the beaten path" copy="Places that reward curiosity, not crowds." action="View all destinations" onAction={() => navigate('stays')} />
        <div className="destination-grid">{destinations.slice(0, 3).map((destination, index) => <DestinationCard key={destination.id} destination={destination} index={index} onClick={() => navigate('stays')} />)}</div>
      </section>
      <section className="split-banner container"><div className="split-photo" /><div className="split-copy"><div className="eyebrow sage">THE WANDERWISE PROMISE</div><h2>More local. Less ordinary.</h2><p>When you book directly with small stays and local hosts, more of your money stays in the community. We make the thoughtful choice the easy choice.</p><div className="promise-list"><div><span>01</span><p><strong>Direct by design</strong><br />Fairer commissions for people on the ground.</p></div><div><span>02</span><p><strong>Curious by default</strong><br />Discover places just beyond the obvious.</p></div></div><button className="button button-dark" onClick={() => navigate('rewards')}>See your impact <ArrowRight size={17} /></button></div></section>
      <section className="section container"><SectionHeading eyebrow="Made by locals" title="Small moments, big memories" copy="Book experiences you will still be talking about on the flight home." action="Browse experiences" onAction={() => navigate('experiences')} /><div className="experience-grid">{experiences.map((experience) => <ExperienceCard key={experience.id} experience={experience} isFavorite={favorites.includes(experience.id)} onFavorite={() => toggleFavorite(experience.id)} onClick={() => notify(`${experience.title} selected`)} />)}</div></section>
      <section className="quote-section"><div className="container quote-inner"><div className="quote-mark">“</div><blockquote>We do not remember days, we remember moments.</blockquote><p>— Cesare Pavese</p><button className="button button-light" onClick={() => navigate('planner')}>Make some moments <ArrowRight size={17} /></button></div></section>
    </main>
  );
}

function SearchPanel({ navigate }) {
  const [destination, setDestination] = useState('');
  return <div className="search-wrap container"><div className="search-panel"><div className="search-field destination-field"><MapPin size={19} /><label>Where to?<input value={destination} onChange={(event) => setDestination(event.target.value)} placeholder="Try 'Hampi' or 'Kerala'" /></label></div><div className="search-field"><CalendarDays size={19} /><label>When?<span>12 Oct – 14 Oct 2026</span></label></div><div className="search-field"><Users size={19} /><label>Who?<span>2 travelers</span></label></div><button className="search-button" onClick={() => navigate('stays')}><Search size={20} /><span>Search stays</span></button></div></div>;
}

function SectionHeading({ eyebrow, title, copy, action, onAction }) {
  return <div className="section-heading"><div><div className="eyebrow">{eyebrow}</div><h2>{title}</h2>{copy && <p>{copy}</p>}</div>{action && <button className="text-button" onClick={onAction}>{action} <ArrowRight size={16} /></button>}</div>;
}

function DestinationCard({ destination, index, onClick }) {
  return <article className={`destination-card card-${index}`} onClick={onClick}><img src={destination.image} alt={destination.name} /><div className="destination-overlay" /><div className="destination-content"><span className="tag light-tag">{destination.tag}</span><h3>{destination.name}</h3><p>{destination.region}</p><div className="destination-bottom"><span>From {money(destination.price)} / night</span><span><Star size={14} fill="currentColor" /> {destination.rating}</span></div></div></article>;
}

function Planner({ navigate, notify, plannerInput, setPlannerInput, itinerary, generatePlan, saved, setSaved }) {
  return <main className="planner-page container"><div className="planner-header"><div><div className="eyebrow"><Sparkles size={14} /> Your pocket travel designer</div><h1>Plan less.<br /><em>Live more.</em></h1><p>Tell us what makes a good trip for you. We will shape the details around it.</p></div><div className="planner-progress"><span className="progress-dot done">1</span><i /><span className="progress-dot active">2</span><i /><span className="progress-dot">3</span></div></div><div className="planner-layout"><aside className="planner-form"><div className="form-label">01 / Destination</div><h3>Where are you headed?</h3><div className="input-with-icon"><MapPin size={17} /><input value={plannerInput.destination} onChange={(event) => setPlannerInput({ ...plannerInput, destination: event.target.value })} /></div><div className="form-label">02 / Dates & budget</div><div className="two-inputs"><input value={plannerInput.dates} onChange={(event) => setPlannerInput({ ...plannerInput, dates: event.target.value })} /><input value={plannerInput.budget} onChange={(event) => setPlannerInput({ ...plannerInput, budget: event.target.value })} placeholder="Budget in ₹" /></div><div className="form-label">03 / Your pace</div><div className="pace-buttons">{['Relaxed', 'Balanced', 'Packed'].map((pace) => <button key={pace} className={plannerInput.pace === pace ? 'selected' : ''} onClick={() => setPlannerInput({ ...plannerInput, pace })}>{pace}</button>)}</div><div className="form-label">04 / What pulls you in?</div><div className="interest-chips">{['Food', 'Culture', 'Nature', 'Wellness', 'Adventure'].map((interest, index) => <button key={interest} className={index < 3 ? 'selected' : ''} onClick={(event) => event.currentTarget.classList.toggle('selected')}>{interest}</button>)}</div><button className="button button-primary full-button" onClick={generatePlan}><Sparkles size={16} /> Generate my itinerary</button></aside><section className="itinerary-preview"><div className="preview-top"><div><span className="tag sage-tag">AI DRAFT · {plannerInput.destination.toUpperCase()}</span><h2>A slower side of Hampi</h2><p>3 days · Balanced pace · {money(Number(plannerInput.budget) || 25000)} budget</p></div><button className="icon-button save-button" onClick={() => { setSaved(!saved); notify(saved ? 'Draft removed from My Trips' : 'Itinerary saved to My Trips'); }} aria-label="Save itinerary"><Heart size={18} fill={saved ? 'currentColor' : 'none'} /></button></div><div className="itinerary-days">{itinerary.map((day) => <ItineraryDay key={day.day} day={day} notify={notify} />)}</div><div className="preview-footer"><ShieldCheck size={18} /><span>Designed to spread your spend across local stays and hosts.</span><button className="text-button" onClick={() => navigate('trips')}>Save & continue <ArrowRight size={16} /></button></div></section></div></main>;
}

function ItineraryDay({ day, notify }) {
  return <article className="itinerary-day"><div className="day-label"><span>{day.day}</span><small>{day.date}</small></div><div className="day-body"><h3>{day.title}</h3>{day.slots.map((slot) => <div className="slot" key={slot.time}><span className={`slot-icon ${slot.type}`}><Compass size={14} /></span><div><small>{slot.time}</small><p>{slot.text}</p></div><button className="edit-slot" onClick={() => notify('Slot editing is ready to connect to your backend')}>Edit</button></div>)}</div></article>;
}

function Stays({ navigate, notify, toggleFavorite, favorites }) {
  const [offbeatOnly, setOffbeatOnly] = useState(false);
  const visibleHotels = useMemo(() => offbeatOnly ? hotels.filter((hotel) => hotel.offbeat) : hotels, [offbeatOnly]);
  return <main className="container page-content"><div className="page-title-row"><div><div className="eyebrow">Stay somewhere with a story</div><h1>Stays in Hampi</h1><p>24 handpicked places · 12–14 Oct 2026 · 2 guests</p></div><button className="button button-soft" onClick={() => notify('Map view will connect to a map provider later')}><MapPin size={16} /> Map view</button></div><div className="filter-row"><button className={`filter-pill ${offbeatOnly ? 'selected' : ''}`} onClick={() => setOffbeatOnly(!offbeatOnly)}><Leaf size={15} /> Offbeat gems</button>{['₹ Price', 'Guest score', 'Amenities', 'Property type'].map((filter) => <button className="filter-pill" key={filter} onClick={() => notify(`${filter} filter placeholder`)}>{filter} <ChevronDown size={14} /></button>)}</div><div className="stay-list">{visibleHotels.map((hotel) => <HotelCard key={hotel.id} hotel={hotel} isFavorite={favorites.includes(hotel.id)} onFavorite={() => toggleFavorite(hotel.id)} onBook={() => navigate('trips')} />)}</div></main>;
}

function HotelCard({ hotel, isFavorite, onFavorite, onBook }) {
  return <article className="hotel-card"><img src={hotel.image} alt={hotel.name} /><div className="hotel-card-body"><div className="hotel-card-top"><div><span className="small-caps">{hotel.offbeat ? 'OFFBEAT GEM' : 'GUEST FAVOURITE'}</span><h3>{hotel.name}</h3><p><MapPin size={13} /> {hotel.location}</p></div><button className="icon-button" aria-label="Favorite stay" onClick={onFavorite}><Heart size={18} fill={isFavorite ? 'currentColor' : 'none'} /></button></div><div className="amenities">{hotel.amenities.map((item) => <span key={item}>{item}</span>)}</div><div className="hotel-card-bottom"><span className="rating"><Star size={14} fill="currentColor" /> {hotel.rating} <small>({hotel.reviews})</small></span><span><strong>{money(hotel.price)}</strong> / night</span><button className="button button-dark small-button" onClick={onBook}>View stay</button></div></div></article>;
}

function Experiences({ notify, toggleFavorite, favorites }) {
  return <main className="container page-content"><div className="page-title-row"><div><div className="eyebrow">Meet the people behind the place</div><h1>Go local</h1><p>Small-group experiences led by people who call this place home.</p></div><button className="button button-primary" onClick={() => notify('Host onboarding placeholder opened')}><Sparkles size={16} /> Become a host</button></div><div className="category-row">{['All experiences', 'Food', 'Adventure', 'Culture', 'Wellness', 'Workshops'].map((category, index) => <button className={index === 0 ? 'active' : ''} key={category} onClick={() => notify(`${category} category selected`)}>{category}</button>)}</div><div className="experience-grid experience-page-grid">{experiences.concat(experiences.slice(0, 1)).map((experience, index) => <ExperienceCard key={`${experience.id}-${index}`} experience={experience} isFavorite={favorites.includes(experience.id)} onFavorite={() => toggleFavorite(experience.id)} onClick={() => notify('Experience detail placeholder opened')} />)}</div></main>;
}

function ExperienceCard({ experience, isFavorite, onFavorite, onClick }) {
  return <article className="experience-card"><div className="experience-image" onClick={onClick}><img src={experience.image} alt={experience.title} /><span className="category-tag">{experience.category}</span><button className="image-favorite" aria-label="Favorite experience" onClick={(event) => { event.stopPropagation(); onFavorite(); }}><Heart size={16} fill={isFavorite ? 'currentColor' : 'none'} /></button></div><div className="experience-copy"><h3>{experience.title}</h3><p>{experience.host} · {experience.duration}</p><div><span className="rating"><Star size={13} fill="currentColor" /> {experience.rating}</span><span><strong>{money(experience.price)}</strong> / person</span></div></div></article>;
}

function Trips({ navigate, notify, itinerary }) {
  return <main className="container page-content"><div className="page-title-row"><div><div className="eyebrow">Your travel journal</div><h1>My trips</h1><p>Keep every little detail in one place.</p></div><button className="button button-primary" onClick={() => navigate('planner')}><Sparkles size={16} /> Plan a new trip</button></div><div className="trip-card"><div className="trip-cover" /><div className="trip-card-body"><div className="trip-heading"><div><span className="tag sage-tag">UPCOMING · 12–14 OCT</span><h2>Hampi, the slower way</h2><p><MapPin size={14} /> Karnataka, India · 2 travelers</p></div><button className="text-button" onClick={() => notify('Share link placeholder copied')}>Share trip <ArrowRight size={15} /></button></div><div className="booking-summary"><div><BedDouble size={18} /><span><strong>Mango Tree Homestay</strong><small>2 nights · Confirmed</small></span></div><div><Mountain size={18} /><span><strong>2 local experiences</strong><small>Confirmed · ₹2,550</small></span></div><div><ShieldCheck size={18} /><span><strong>Safety briefing</strong><small>Reviewed 10 Oct</small></span></div></div><div className="mini-itinerary">{itinerary.slice(0, 3).map((day) => <div key={day.day}><small>{day.day}</small><strong>{day.title}</strong><span>{day.slots.length} moments planned</span></div>)}</div><button className="button button-dark" onClick={() => notify('Confirmation download placeholder')}><ArrowRight size={16} /> Download confirmations</button></div></div></main>;
}

function Rewards({ notify }) {
  return <main className="container page-content"><div className="rewards-hero"><div><div className="eyebrow light-eyebrow"><Trophy size={14} /> WanderPoints</div><h1>Good travel<br /><em>goes further.</em></h1><p>Every thoughtful choice earns you a little more to explore with.</p></div><div className="points-orb"><span>2,840</span><small>points balance</small></div></div><div className="rewards-grid"><section className="white-panel"><div className="panel-heading"><h2>Your impact</h2><span>Since joining · Mar 2026</span></div><div className="impact-number">₹18,650 <small>spent with local hosts</small></div><div className="impact-bar"><span style={{ width: '72%' }} /></div><p className="muted">You have helped keep an estimated <strong>₹4,660</strong> in local communities instead of OTA commissions.</p><div className="badges-row"><div className="reward-badge unlocked">✦<span>Pathfinder<small>3 offbeat trips</small></span></div><div className="reward-badge unlocked">♥<span>Good guest<small>5 reviews shared</small></span></div><div className="reward-badge locked">♢<span>Local legend<small>10 experiences</small></span></div></div></section><section className="white-panel"><div className="panel-heading"><h2>Redeem your points</h2><button className="text-button" onClick={() => notify('Rewards catalog placeholder')}>See all</button></div>{[['₹300 off a local stay', '1,500 points'], ['Free chai at a host experience', '800 points'], ['Room upgrade, on us', '2,000 points']].map(([name, cost]) => <div className="reward-row" key={name}><div className="reward-icon"><Sparkles size={17} /></div><span><strong>{name}</strong><small>{cost}</small></span><button className="button button-soft" onClick={() => notify(`${name} redemption placeholder`)}>Redeem</button></div>)}</section></div></main>;
}

function Profile({ notify }) {
  return <main className="container page-content narrow-content"><div className="profile-heading"><div className="large-avatar">P</div><div><div className="eyebrow">Your WanderWise profile</div><h1>Priya Sharma</h1><p>Curious planner · Member since March 2026</p></div><button className="button button-soft" onClick={() => notify('Profile editing placeholder')}>Edit profile</button></div><div className="settings-grid"><section className="white-panel"><h2>Travel preferences</h2>{[['Travel style', 'Authentic & unhurried'], ['Budget band', '₹3,000–₹6,000 / night'], ['Favorite interests', 'Food · Culture · Nature'], ['Preferred pace', 'Balanced']].map(([label, value]) => <div className="setting-row" key={label}><span>{label}</span><strong>{value}</strong><ArrowRight size={15} /></div>)}</section><section className="white-panel"><h2>Account settings</h2>{['Notifications', 'Language · English', 'Saved payment methods', 'Privacy & safety'].map((item) => <button className="setting-row setting-button" key={item} onClick={() => notify(`${item} placeholder`)}><span>{item}</span><ArrowRight size={15} /></button>)}</section></div></main>;
}

function Dashboard({ role, setRole, navigate, notify }) {
  const isVendor = role === 'vendor';
  const title = isVendor ? 'Mango Tree Homestay' : 'Meera’s local studio';
  const stats = isVendor ? [['₹1,84,200', 'Revenue this month', '+18%'], ['62%', 'Occupancy rate', '+7%'], ['48', 'Confirmed bookings', '+12'], ['4.9', 'Guest rating', 'Stable']] : [['₹68,400', 'Earnings this month', '+24%'], ['32', 'Completed bookings', '+8'], ['14', 'Upcoming guests', '+5'], ['4.8', 'Guest rating', 'Stable']];
  return <main className="dashboard-shell"><aside className="dashboard-sidebar"><div className="dashboard-brand"><span className="logo-mark"><Compass size={17} /></span><span>WanderWise <small>{isVendor ? 'HOST' : 'GUIDE'}</small></span></div><div className="side-nav"><button className="selected"><House size={17} /> Overview</button><button onClick={() => notify('Listings placeholder')}><BedDouble size={17} /> {isVendor ? 'Listings' : 'Experiences'}</button><button onClick={() => notify('Bookings placeholder')}><CalendarDays size={17} /> Bookings</button><button onClick={() => notify('Analytics placeholder')}><Trophy size={17} /> Analytics</button><button onClick={() => notify('Reviews placeholder')}><MessageCircle size={17} /> Reviews</button></div><button className="switch-role" onClick={() => { setRole('traveler'); navigate('home'); }}>← Back to traveler</button></aside><section className="dashboard-main"><div className="dashboard-top"><div><div className="eyebrow">Good morning, {isVendor ? 'Rakesh' : 'Meera'}</div><h1>{title}</h1></div><div className="dashboard-user"><Bell size={18} /><span>{isVendor ? 'R' : 'M'}</span></div></div><div className="stat-grid">{stats.map(([value, label, change]) => <div className="stat-card" key={label}><span>{label}</span><strong>{value}</strong><small>{change} vs last month</small></div>)}</div><div className="dashboard-content-grid"><section className="white-panel chart-panel"><div className="panel-heading"><div><h2>Bookings overview</h2><span>Last 6 months</span></div><button className="filter-pill">This year <ChevronDown size={13} /></button></div><div className="fake-chart"><div className="chart-lines"><i /><i /><i /><i /></div><div className="chart-bars">{[38, 52, 46, 70, 58, 82, 68, 92, 76, 86, 100, 90].map((height, index) => <span key={index} style={{ height: `${height}%` }} />)}</div><div className="chart-labels"><span>Mar</span><span>Apr</span><span>May</span><span>Jun</span><span>Jul</span><span>Aug</span></div></div></section><section className="white-panel action-panel"><div className="panel-heading"><h2>Quick actions</h2></div><button onClick={() => notify('Listing editor placeholder')}><span className="action-icon"><BedDouble size={17} /></span><span><strong>{isVendor ? 'Update listing' : 'Edit experience'}</strong><small>Keep your details fresh</small></span><ArrowRight size={16} /></button><button onClick={() => notify('Availability placeholder')}><span className="action-icon"><CalendarDays size={17} /></span><span><strong>Manage availability</strong><small>Block dates or open slots</small></span><ArrowRight size={16} /></button><button onClick={() => notify('Insights placeholder')}><span className="action-icon"><Sparkles size={17} /></span><span><strong>View WanderWise insights</strong><small>Simple ways to grow</small></span><ArrowRight size={16} /></button></section></div></section></main>;
}

function Concierge({ notify }) {
  return <button className="concierge" onClick={() => notify('AI Concierge placeholder — connect your LLM endpoint in backend/main.py')}><MessageCircle size={19} /><span>Ask WanderWise</span></button>;
}

function Footer({ navigate }) {
  return <footer className="footer"><div className="container footer-grid"><div><Logo /><p>Plan deeper. Travel lighter.<br />Leave a little more behind.</p></div><div><strong>Discover</strong><button onClick={() => navigate('stays')}>Stays</button><button onClick={() => navigate('experiences')}>Experiences</button><button onClick={() => navigate('planner')}>AI Planner</button></div><div><strong>For hosts</strong><button onClick={() => navigate('profile')}>List your stay</button><button onClick={() => navigate('profile')}>Host an experience</button><button onClick={() => navigate('rewards')}>Our promise</button></div><div><strong>Stay in the loop</strong><p className="footer-note">Occasional inspiration for your next good trip.</p><div className="subscribe"><input placeholder="Your email" aria-label="Email address" /><button onClick={() => alert('Thanks for subscribing!')}><ArrowRight size={16} /></button></div></div></div><div className="container footer-bottom"><span>© 2026 WanderWise</span><span>Made for the curious</span><span>Privacy · Terms</span></div></footer>;
}

export default App;
