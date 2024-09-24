import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";

const BudgetCardKennzahlen = ({ month, budget, selectedYear, onSubmit, onCreate }) => {
  const [defaultAmount, setDefaultAmount] = useState("");
  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
  } = useForm({
    defaultValues: {
      amount: defaultAmount,
    },
  });

  useEffect(() => {
    if (budget) {
      setDefaultAmount(budget.amount);
      setValue("amount", budget.amount);
    } else {
      setDefaultAmount("");
      setValue("amount", "");
    }
  }, [budget, selectedYear, setValue]);

  const handleFormSubmit = (data) => {
    if (budget) {
      onSubmit(data, month);
    } else {
      onCreate(data, month);
    }
  };

  return (
    <form
      className="bg-white p-4 rounded-lg shadow-md flex flex-col"
      onSubmit={handleSubmit(handleFormSubmit)}
    >
      <input type="hidden" {...register("year")} value={selectedYear} />

      <h2 className="text-lg font-semibold text-gray-800 mb-4">{month}</h2>

      <div className="mb-3 flex items-center w-full">
        <label
          htmlFor={`amount-${month}`}
          className="block text-sm font-medium text-[#07074D] w-1/4"
        >
          Betrag (€):
        </label>
        <input
          type="number"
          {...register("amount", { required: true })}
          id={`amount-${month}`}
          className={`w-3/5 rounded-md border ${
            errors.amount ? "border-red-500" : "border-[#e0e0e0]"
          } bg-white py-2 px-3 text-sm text-[#6B7280] outline-none focus:border-[#6A64F1] focus:shadow-md`}
          placeholder="€"
        />
        {!budget && (
          <span className="text-red-500 font-semibold text-xs ml-2 w-1/4">
            Budget noch nicht erstellt
          </span>
        )}
        {errors.amount && (
          <span className="text-red-500 text-xs ml-2">Betrag erforderlich</span>
        )}
      </div>

      <div className="mt-auto mx-auto">
        <button
          type="submit"
          className={`text-sm font-medium p-2 text-white uppercase w-full rounded cursor-pointer hover:shadow-lg transition transform hover:-translate-y-0.5 ${
            budget
              ? "bg-gradient-to-b from-gray-700 to-gray-900"
              : "bg-gradient-to-b from-blue-700 to-blue-900"
          }`}
        >
          {budget ? "Budget aktualisieren" : "Budget festlegen"}
        </button>
      </div>
    </form>
  );
};

export default BudgetCardKennzahlen;
