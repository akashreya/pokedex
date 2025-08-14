import React from "react";

export default function TypeLogoBadge({ type }) {
  return (
    <span 
      className={`pokemon-card-type bg-type-solid-${type}`}
      data-type={type}
    >
      <img
        src={`https://raw.githubusercontent.com/duiker101/pokemon-type-svg-icons/master/icons/${type}.svg`}
        alt={type}
        loading="lazy"
        title={type.charAt(0).toUpperCase() + type.slice(1)}
      />
    </span>
  );
}
