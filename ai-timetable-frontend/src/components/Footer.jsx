export default function Footer() {

  return (
    <footer className="footer">

      <div className="footer-content">

        <span>
          © {new Date().getFullYear()} AI Timetable Generator
        </span>

        <span className="footer-divider">|</span>

        <span>
          Academic Management System
        </span>

      </div>

    </footer>
  );

}