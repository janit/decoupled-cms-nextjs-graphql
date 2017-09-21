import React from "react";
import Link from "next/link";
import { simplifyLinks } from "../lib/contentUtils";

export default ({ items, title }) => (
  <nav>
    <h2>{title}</h2>
    <ul>
      {items.map(item => (
        <li key={item.content.id}>
          <Link
            href={"/activity?id=" + item.content.id}
            as={"activity/" + item.content.id}
          >
            <a>{item.content.name}</a>
          </Link>
        </li>
      ))}
    </ul>
  </nav>
);
