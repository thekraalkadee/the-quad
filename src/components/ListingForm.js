"use client";

import { useState } from "react";
import { createListing } from "@/lib/actions";

export default function ListingForm({ error }) {
  const [kind, setKind] = useState("item");

  return (
    <form action={createListing} className="card flex flex-col gap-4">
      {error && <p className="alert-error">{error}</p>}

      <div>
        <span className="label">Listing type</span>
        <div className="flex gap-2">
          {[
            { value: "item", label: "Item for sale / free" },
            { value: "sublet", label: "Sublet" },
          ].map((k) => (
            <label
              key={k.value}
              className={`flex-1 cursor-pointer rounded-lg border px-3 py-2 text-center text-sm font-medium ${
                kind === k.value
                  ? "border-indigo-500 bg-indigo-50 text-indigo-700"
                  : "border-zinc-300 text-zinc-600"
              }`}
            >
              <input
                type="radio"
                name="kind"
                value={k.value}
                checked={kind === k.value}
                onChange={() => setKind(k.value)}
                className="sr-only"
              />
              {k.label}
            </label>
          ))}
        </div>
      </div>

      <div>
        <label className="label" htmlFor="title">
          Title
        </label>
        <input
          className="input"
          id="title"
          name="title"
          required
          placeholder={kind === "item" ? "IKEA desk, barely used" : "1BR sublet near campus, fall quarter"}
        />
      </div>

      {kind === "item" ? (
        <div className="grid gap-4 sm:grid-cols-3">
          <div>
            <label className="label" htmlFor="category">
              Category
            </label>
            <select className="input" id="category" name="category" defaultValue="furniture">
              <option value="furniture">Furniture</option>
              <option value="electronics">Electronics</option>
              <option value="textbooks">Textbooks</option>
              <option value="clothes">Clothes</option>
              <option value="free">Free / giveaway</option>
              <option value="other">Other</option>
            </select>
          </div>
          <div>
            <label className="label" htmlFor="price">
              Price
            </label>
            <input className="input" id="price" name="price" placeholder="$25 or Free" />
          </div>
          <div>
            <label className="label" htmlFor="condition">
              Condition
            </label>
            <input className="input" id="condition" name="condition" placeholder="Like new" />
          </div>
        </div>
      ) : (
        <div className="grid gap-4 sm:grid-cols-3">
          <div>
            <label className="label" htmlFor="price">
              Price / month
            </label>
            <input className="input" id="price" name="price" placeholder="$800/mo" />
          </div>
          <div>
            <label className="label" htmlFor="date_range">
              Date range
            </label>
            <input className="input" id="date_range" name="date_range" placeholder="Jun-Sep 2027" />
          </div>
          <div>
            <label className="label" htmlFor="room_type">
              Room type
            </label>
            <input className="input" id="room_type" name="room_type" placeholder="Private room in 2BR" />
          </div>
        </div>
      )}

      <div>
        <label className="label" htmlFor="pickup_area">
          {kind === "item" ? "Pickup area" : "General location"}
        </label>
        <input
          className="input"
          id="pickup_area"
          name="pickup_area"
          placeholder="Exact address optional — a general area works, e.g. near South Campus"
        />
      </div>

      {kind === "sublet" && (
        <div>
          <label className="label" htmlFor="amenities">
            Amenities
          </label>
          <input className="input" id="amenities" name="amenities" placeholder="Laundry in unit, parking, ..." />
        </div>
      )}

      <div>
        <label className="label" htmlFor="description">
          Description
        </label>
        <textarea className="input" id="description" name="description" rows={3} />
      </div>

      <button type="submit" className="btn-primary self-start">
        Post listing
      </button>
    </form>
  );
}
