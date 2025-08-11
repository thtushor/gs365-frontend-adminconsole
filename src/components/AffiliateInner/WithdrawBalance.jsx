// components/affiliate/WithdrawBalance.js
import React, { useState } from "react";

const WithdrawBalance = () => {
  const [form, setForm] = useState({ amount: "", currency: "" });

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Transfer Submit:", form);
  };

  return (
    <div className="bg-white p-4 rounded-md mb-6">
      <h1 className="mt-[-5px] text-base font-semibold bg-[#07122b] text-white px-3 w-fit rounded-full py-1 pt-[2px] mb-2">
        Withdraw Balance
      </h1>
      <form onSubmit={handleSubmit} className="space-y-3">
        <input
          type="text"
          placeholder="Main Balance"
          value="20000"
          disabled
          className="w-full p-2 border rounded"
        />
        <input
          type="number"
          placeholder="Amount"
          value={form.amount}
          onChange={(e) => setForm({ ...form, amount: e.target.value })}
          className="w-full p-2 border rounded"
        />
        <input
          type="text"
          placeholder="Country-Currency"
          value={form.currency}
          onChange={(e) => setForm({ ...form, currency: e.target.value })}
          className="w-full p-2 border rounded"
        />
        <button
          type="submit"
          className="bg-green-500 text-white  cursor-pointer px-4 py-2 rounded"
        >
          Submit
        </button>
      </form>
    </div>
  );
};

export default WithdrawBalance;
