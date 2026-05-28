export default function NavBar() {


  return (
    <header className="fixed-top bg-white shadow-sm" style={{ zIndex: 1000 }}>
      <div className="container-lg d-flex justify-content-between align-items-center px-3 py-2">
        
        {/* Logo */}
        <div className="logo d-flex justify-content-center align-items-center">
          <img
            src="/Logo/V-logo.svg"
            alt="logo"
            className="img-fluid"
            style={{ height: 'auto', maxHeight: '80px' }}
          />
          <span className="ms-2" style={{ fontWeight: 600, fontSize: '1rem' }}>
            CARTE FRANCE <p style={{ fontWeight: 300, color: '#82CEF9', margin: 0 }}>Departement</p>
          </span>
        </div>
      </div>
    </header>
  );
}

