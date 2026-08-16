import { notFound, redirect } from "next/navigation";
import getDb from "@/lib/db";
import { getCurrentUser } from "@/lib/auth";
import { sendListingMessage } from "@/lib/actions";

export default async function ListingDetailPage({ params }) {
  const user = await getCurrentUser();
  if (!user) redirect("/login");

  const { id } = await params;
  const db = getDb();
  const listing = db
    .prepare(
      `SELECT listings.*, users.name AS author_name, users.email AS author_email
       FROM listings JOIN users ON users.id = listings.user_id
       WHERE listings.id = ?`
    )
    .get(id);

  if (!listing || listing.school_domain !== user.school_domain) notFound();

  const messages = db
    .prepare(
      `SELECT listing_messages.*, users.name AS author_name
       FROM listing_messages JOIN users ON users.id = listing_messages.user_id
       WHERE listing_id = ? ORDER BY created_at ASC`
    )
    .all(id);

  const boundSend = sendListingMessage.bind(null, listing.id);

  return (
    <div className="mx-auto flex max-w-2xl flex-col gap-6">
      <div>
        <span className="badge">{listing.kind === "sublet" ? "Sublet" : listing.category}</span>
        <h1 className="mt-2 text-2xl font-bold text-zinc-900">{listing.title}</h1>
        <p className="mt-1 text-sm text-zinc-600">
          {listing.price && <span className="font-medium text-zinc-800">{listing.price}</span>}
          {listing.kind === "sublet" && listing.date_range ? ` · ${listing.date_range}` : ""}
          {listing.kind === "item" && listing.condition ? ` · ${listing.condition}` : ""}
        </p>
        <p className="mt-1 text-xs text-zinc-400">Posted by {listing.author_name}</p>
      </div>

      {listing.description && (
        <div className="card">
          <h2 className="mb-1 text-sm font-semibold text-zinc-900">Description</h2>
          <p className="text-sm text-zinc-600 whitespace-pre-wrap">{listing.description}</p>
        </div>
      )}

      <div className="card grid gap-2 text-sm text-zinc-600 sm:grid-cols-2">
        <p>
          <span className="font-medium text-zinc-800">
            {listing.kind === "sublet" ? "Location" : "Pickup area"}:
          </span>{" "}
          {listing.pickup_area || "Not listed"}
        </p>
        {listing.kind === "sublet" && listing.room_type && (
          <p>
            <span className="font-medium text-zinc-800">Room type:</span> {listing.room_type}
          </p>
        )}
        {listing.kind === "sublet" && listing.amenities && (
          <p className="sm:col-span-2">
            <span className="font-medium text-zinc-800">Amenities:</span> {listing.amenities}
          </p>
        )}
      </div>

      <div className="card flex flex-col gap-4">
        <h2 className="text-sm font-semibold text-zinc-900">
          Messages {messages.length > 0 && `(${messages.length})`}
        </h2>
        {messages.length === 0 && (
          <p className="text-sm text-zinc-500">
            No messages yet — reach out to arrange pickup or ask a question.
          </p>
        )}
        {messages.map((m) => (
          <div key={m.id} className="border-b border-zinc-100 pb-3 last:border-0">
            <p className="text-sm text-zinc-800">{m.body}</p>
            <p className="mt-1 text-xs text-zinc-400">{m.author_name}</p>
          </div>
        ))}
        <form action={boundSend} className="flex gap-2">
          <input
            className="input"
            name="body"
            placeholder="Is this still available?"
            required
          />
          <button type="submit" className="btn-secondary shrink-0">
            Send
          </button>
        </form>
      </div>
    </div>
  );
}
