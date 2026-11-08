import { Link } from "react-router-dom";
import { FaRunning, FaSwimmer, FaDumbbell } from "react-icons/fa";
import runImg from "../../images/run.jpg";
import swimImg from "../../images/swim.jpg";
import fitkoImg from "../../images/fitko.jpg";
import "./homepage.css";

const tiles = [
  { title: "RUN", icon: FaRunning, href: "/run", image: runImg },
  { title: "SWIM", icon: FaSwimmer, href: "/swim", image: swimImg, position: "top" },
  { title: "FITKO", icon: FaDumbbell, href: "/fitko", image: fitkoImg },
];

function Homepage() {
  return (
    <main className="home">
      <div className="home__tiles">
        {tiles.map(({ title, icon: Icon, href, image, position }) => (
          <Link key={title} to={href} className="tile">
            <img
              src={image}
              alt=""
              className="tile__bg"
              style={{ objectPosition: position }}
            />
            <Icon className="tile__icon" />
            <h2 className="tile__title">{title}</h2>
          </Link>
        ))}
      </div>
    </main>
  );
}

export default Homepage;
