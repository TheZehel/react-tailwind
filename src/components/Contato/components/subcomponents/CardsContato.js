import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faPhone,
  faEnvelope,
  faCocktail,
} from "@fortawesome/free-solid-svg-icons";

export default function CardsContato() {
  return (
    <div className="flex flex-wrap mx-5">
      <div className="p-4 md:w-1/3 w-full">
        <div className="h-full border-2 border-bluePrime rounded-lg overflow-hidden shadow-lg">
          <div className="p-6">
            <FontAwesomeIcon icon={faPhone} />
            <h2 className="text-lg  font-medium title-font mb-2">Telefone</h2>
            <p className="leading-relaxed text-base">
              <b>11 3511- 0708</b>
            </p>
          </div>
        </div>
      </div>
      <div className="p-4 md:w-1/3 w-full">
        <div className="h-full border-2 border-bluePrime rounded-lg overflow-hidden shadow-lg">
          <div className="p-6">
            <FontAwesomeIcon icon={faEnvelope} />
            <h2 className="text-lg  font-medium title-font mb-2">Email</h2>
            <p className="leading-relaxed text-base">
              <b>corretora@primesecure.com.br</b>
            </p>
          </div>
        </div>
      </div>
      <div className="p-4 md:w-1/3 w-full">
        <div className="h-full border-2 border-bluePrime rounded-lg overflow-hidden shadow-lg">
          <div className="p-6">
            <FontAwesomeIcon icon={faCocktail} />
            <h2 className="text-lg  font-medium title-font mb-2">WhatsApp</h2>
            <p className="leading-relaxed text-base">
              <b>11 96653-4903</b>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
