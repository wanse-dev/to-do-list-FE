import "./PageTitle.css";
import React from "react";

type PageTitleProps = {
  title: string;
  subtitle: string;
};

export const PageTitle: React.FC<PageTitleProps> = ({ title, subtitle }) => {
  return (
    <header className="header">
      <h1 className="title">{title}</h1>
      <p className="subtitle">{subtitle}</p>
    </header>
  );
};
