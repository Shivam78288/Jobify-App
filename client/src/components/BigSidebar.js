import React from "react";
import Wrapper from "../assets/wrappers/BigSidebar.js";
import { useAppContext } from "../context/appContext.js";
import NavLinks from "./NavLinks.js";
import Logo from "./Logo.js";

const BigSidebar = () => {
  const { showSidebar } = useAppContext();

  return (
    <Wrapper>
      <div
        className={
          // It is done in opposite way because showSidebar is false by default but we want to
          // show sidebar in large screen by default
          showSidebar ? "sidebar-container" : "sidebar-container show-sidebar"
        }
      >
        <div className="content">
          <header>
            <Logo />
          </header>
          <NavLinks />
        </div>
      </div>
    </Wrapper>
  );
};

export default BigSidebar;
