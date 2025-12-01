// jest-dom adds custom jest matchers for asserting on DOM nodes.
// allows you to do things like:
// expect(element).toHaveTextContent(/react/i)
// learn more: https://github.com/testing-library/jest-dom
import '@testing-library/jest-dom';

/* 
export default function Header() {
  const [open, setOpen] = useState(false);

  return (
    <>
      <header className="header">
        <div className="container">
          <div className="headerContent">
            <div className="">LOGO</div>

            <button onClick={() => setOpen(true)}>
              ☰
            </button>
          </div>
        </div>
      </header>

      <MenuDrawer open={open} onClose={() => setOpen(false)} />
    </>
  );
}


import React, { useState } from "react";
import styles from "./MenuDrawer.module.scss";
import classNames from "classnames";

interface MenuGroup {
  title: string;
  children?: string[];
}

const menuData: MenuGroup[] = [
  { title: "업무 분야" },
  { title: "전문가 소개" },
  { title: "교육/세미나" },
  {
    title: "함께 소개",
    children: ["소개", "연혁", "수상/인증", "본점/지점 안내", "주요 고객", "CI 가이드"],
  },
  { title: "인사이트" },
  { title: "신고 대리" },
];

interface Props {
  open: boolean;
  onClose: () => void;
}

export default function MenuDrawer({ open, onClose }: Props) {
  const [active, setActive] = useState<string | null>("함께 소개");

  const toggle = (title: string) => {
    if (active === title) setActive(null);
    else setActive(title);
  };

  return (
    <div className={classNames(styles.drawer, { [styles.open]: open })}>
      <div className={styles.backdrop} onClick={onClose} />

      <aside className={styles.panel}>
        <header className={styles.header}>
          <div className={styles.auth}>
            <a href="#">로그인</a>
            <span> | </span>
            <a href="#">회원가입</a>
          </div>
          <button className={styles.closeBtn} onClick={onClose}>
            ✕
          </button>
        </header>

        <nav className={styles.menu}>
          {menuData.map((g) => (
            <div key={g.title} className={styles.group}>
              <div
                className={classNames(styles.groupHeader, {
                  [styles.active]: active === g.title,
                })}
                onClick={() => toggle(g.title)}
              >
                <span className={styles.title}>{g.title}</span>

                {g.children ? (
                  <span className={styles.icon}>
                    {active === g.title ? "−" : "+"}
                  </span>
                ) : (
                  <span className={styles.arrow}>›</span>
                )}
              </div>

              {g.children && active === g.title && (
                <ul className={styles.subMenu}>
                  {g.children.map((c) => (
                    <li key={c}>{c}</li>
                  ))}
                </ul>
              )}
            </div>
          ))}
        </nav>

        <div className={styles.bottomLogo}>
          <div className={styles.logoBox}>LOGO</div>
        </div>
      </aside>
    </div>
  );
}


.drawer {
  position: fixed;
  inset: 0;
  z-index: 2000;
  pointer-events: none;

  &.open {
    pointer-events: auto;

    .backdrop {
      opacity: 1;
      visibility: visible;
    }

    .panel {
      transform: translateX(0);
    }
  }
}

.backdrop {
  position: absolute;
  inset: 0;
  background: rgba(0, 0, 0, 0.42);
  opacity: 0;
  visibility: hidden;
  transition: 0.25s ease;
}

.panel {
  position: absolute;
  top: 0;
  right: 0;
  width: 420px;
  max-width: 90%;
  height: 100%;
  background: #ffffffcc;
  backdrop-filter: blur(14px);
  padding: 24px;
  display: flex;
  flex-direction: column;

  transform: translateX(100%);
  transition: transform 0.28s ease;

  border-left: 1px solid rgba(0, 0, 0, 0.08);
}

.header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 24px;

  .auth {
    font-size: 14px;

    a {
      color: #333;
      text-decoration: none;
      font-weight: 500;

      &:hover {
        color: #0f5fa3;
      }
    }
  }

  .closeBtn {
    background: none;
    border: none;
    font-size: 24px;
    cursor: pointer;
    padding: 4px;
  }
}

.menu {
  flex: 1;
  overflow-y: auto;
  padding-right: 6px;
}

.group {
  margin-bottom: 20px;
}

.groupHeader {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 14px 0;
  cursor: pointer;
  font-size: 20px;
  font-weight: 600;
  color: #444;

  border-bottom: 1px solid rgba(0, 0, 0, 0.08);

  &.active {
    color: #0f8c8c;
  }
}

.icon {
  font-size: 26px;
  line-height: 1;
}

.arrow {
  font-size: 24px;
  opacity: 0.4;
}

.subMenu {
  list-style: none;
  padding: 8px 0 0 12px;

  li {
    padding: 8px 0;
    font-size: 16px;
    color: #444;

    &:hover {
      color: #0f5fa3;
      cursor: pointer;
    }
  }
}

.bottomLogo {
  padding: 10px 0 0 0;
  display: flex;
  justify-content: flex-end;

  .logoBox {
    width: 90px;
    height: 90px;
    border: 1px solid #e1e5eb;
    border-radius: 10px;
    background: #f7f9fb;
    display: flex;
    align-items: center;
    justify-content: center;
    opacity: 0.7;
  }
}





*/
