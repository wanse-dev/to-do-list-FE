import "./FallBack.css";
import { Link } from "react-router";

export const FallBack = () => {
  return (
    <section className="fall-back">
      <p>(404 not found)</p>
      <Link className="go-back-button" to="/" draggable={false}>
        Back to main page
      </Link>
    </section>
  );
};
