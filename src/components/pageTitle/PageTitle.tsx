import "./PageTitle.css";

type PageTitleProps = {
  title: string;
  subtitle: string;
};

export const PageTitle = (props: PageTitleProps) => {
  return (
    <header className="header">
      <h1 className="title">{props.title}</h1>
      <p className="subtitle">{props.subtitle}</p>
    </header>
  );
};
