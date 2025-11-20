import { useState } from "react";

const requirements = ["Prime Time", "Logicoland", "Both"];
const ageGroups = ["0–3", "3+", "6+", "8+"];
const budgetRanges = [
  { label: "0–500", min: 0, max: 500 },
  { label: "500–1000", min: 500, max: 1000 },
  { label: "1000–1500", min: 1000, max: 1500 },
];

export default function BulkOrderForm() {
  const [form, setForm] = useState({
    name: "",
    email: "",
    contact: "",
    requirement: requirements[0],
    ageGroup: ageGroups[0],
    quantity: 1,
    budget: budgetRanges[0].label,
    date: "",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  function validate() {
    if (!form.name.trim()) return "Name required";
    if (!form.email.match(/^[^@]+@[^@]+\.[^@]+$/)) return "Valid email required";
    if (!form.contact.match(/^\d{10,}$/)) return "Valid contact number required";
    if (!form.quantity || form.quantity < 1) return "Quantity must be at least 1";
    if (!form.date) return "Delivery date required";
    return "";
  }

  async function handleSubmit(e: any) {
    e.preventDefault();
    setError("");
    setSuccess(false);
    const err = validate();
    if (err) {
      setError(err);
      return;
    }
    setLoading(true);
    // Calculate average budget
    const budgetObj = budgetRanges.find((b) => b.label === form.budget);
    const avgBudget = budgetObj ? Math.round((budgetObj.min + budgetObj.max) / 2) : 500;
    const totalAmount = form.quantity * avgBudget;
    // Store in DB, create Razorpay order, open payment popup
    try {
      // 1. Store in DB
      const dbRes = await fetch("/api/bulk-order", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...form, totalAmount }),
      });
      const dbData = await dbRes.json();
      if (!dbData.success || !dbData._id) throw new Error(dbData.error || "DB error");
      // 2. Create Razorpay order
      const rzRes = await fetch("/api/razorpay-bulk-order", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ amount: totalAmount, receipt: dbData._id }),
      });
      const rzData = await rzRes.json();
      if (!rzData.success || !rzData.order) throw new Error(rzData.error || "Razorpay error");
      // 3. Open Razorpay popup
      const options = {
        key: rzData.key,
        amount: rzData.order.amount,
        currency: "INR",
        name: "Logicology Bulk Order",
        description: "Bulk Order Payment",
        order_id: rzData.order.id,
        handler: async function (response: any) {
          // Mark paid in DB
          await fetch("/api/bulk-order", {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              _id: dbData._id,
              paid: true,
              paymentId: response.razorpay_payment_id,
            }),
          });
          setSuccess(true);
        },
        prefill: {
          name: form.name,
          email: form.email,
          contact: form.contact,
        },
        theme: { color: "#0A8A80" },
      };
      // @ts-ignore
      const rzp = new window.Razorpay(options);
      rzp.open();
    } catch (err: any) {
      setError(err.message || "Unknown error");
    }
    setLoading(false);
  }

  return (
    <form
      className="mx-auto max-w-lg space-y-5 rounded-xl bg-white p-6 shadow-lg"
      onSubmit={handleSubmit}
    >
      <h2 className="mb-2 text-center text-2xl font-bold text-[#0A8A80]">
        Bulk Order / Return Gifts
      </h2>
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
        <input
          type="text"
          placeholder="Name"
          required
          className="rounded-lg border px-4 py-2"
          value={form.name}
          onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
        />
        <input
          type="email"
          placeholder="Email"
          required
          className="rounded-lg border px-4 py-2"
          value={form.email}
          onChange={(e) => setForm((f) => ({ ...f, email: e.target.value }))}
        />
        <input
          type="number"
          placeholder="Contact number"
          required
          className="rounded-lg border px-4 py-2"
          value={form.contact}
          onChange={(e) => setForm((f) => ({ ...f, contact: e.target.value }))}
        />
        <select
          className="rounded-lg border px-4 py-2"
          value={form.requirement}
          onChange={(e) => setForm((f) => ({ ...f, requirement: e.target.value }))}
        >
          {requirements.map((r) => (
            <option key={r}>{r}</option>
          ))}
        </select>
        <div className="flex flex-col">
          <div className="mb-1 text-sm font-semibold">Age group</div>
          <div className="flex gap-2">
            {ageGroups.map((a) => (
              <label key={a} className="flex items-center gap-1">
                <input
                  type="radio"
                  name="ageGroup"
                  value={a}
                  checked={form.ageGroup === a}
                  onChange={(e) => setForm((f) => ({ ...f, ageGroup: a }))}
                />
                <span>{a}</span>
              </label>
            ))}
          </div>
        </div>
        <input
          type="number"
          min={1}
          placeholder="Quantity"
          required
          className="rounded-lg border px-4 py-2"
          value={form.quantity}
          onChange={(e) => setForm((f) => ({ ...f, quantity: Number(e.target.value) }))}
        />
        <div className="flex flex-col">
          <div className="mb-1 text-sm font-semibold">Budget per product</div>
          <div className="flex gap-2">
            {budgetRanges.map((b) => (
              <label key={b.label} className="flex items-center gap-1">
                <input
                  type="radio"
                  name="budget"
                  value={b.label}
                  checked={form.budget === b.label}
                  onChange={(e) => setForm((f) => ({ ...f, budget: b.label }))}
                />
                <span>{b.label}</span>
              </label>
            ))}
          </div>
        </div>
        <input
          type="date"
          required
          className="rounded-lg border px-4 py-2"
          value={form.date}
          onChange={(e) => setForm((f) => ({ ...f, date: e.target.value }))}
        />
      </div>
      <button
        type="submit"
        disabled={loading}
        className="mt-4 w-full rounded-lg bg-[#0A8A80] py-2 font-semibold text-white transition hover:bg-[#0B3F44]"
      >
        {loading ? "Submitting..." : "Submit"}
      </button>
      {error && <div className="mt-2 text-center text-red-600">{error}</div>}
      {success && (
        <div className="mt-2 text-center font-bold text-green-600">
          Order placed & paid successfully!
        </div>
      )}
    </form>
  );
}
