import { useMemo, useState } from "react";
import { useApp } from "../store";
import type { TxType } from "../types";
import {
  Button,
  Card,
  EmptyState,
  Field,
  Input,
  Modal,
  ProgressBar,
  SectionTitle,
} from "../ui";
import {
  ArrowDownIcon,
  ArrowUpIcon,
  FinanceIcon,
  PlusIcon,
  TrashIcon,
} from "../icons";
import { cx, currentMonthKey, formatDate, formatMoney, monthKey, todayISO } from "../lib/utils";

export default function Finance() {
  const {
    state,
    addTransaction,
    deleteTransaction,
    addBudget,
    deleteBudget,
  } = useApp();
  const cur = state.currency;
  const month = currentMonthKey();

  const [txOpen, setTxOpen] = useState(false);
  const [budgetOpen, setBudgetOpen] = useState(false);

  const [type, setType] = useState<TxType>("gasto");
  const [amount, setAmount] = useState("");
  const [category, setCategory] = useState("");
  const [note, setNote] = useState("");
  const [date, setDate] = useState(todayISO());

  const [bName, setBName] = useState("");
  const [bLimit, setBLimit] = useState("");

  const monthTx = useMemo(
    () => state.transactions.filter((t) => monthKey(t.date) === month),
    [state.transactions, month]
  );

  const income = monthTx.filter((t) => t.type === "ingreso").reduce((a, t) => a + t.amount, 0);
  const expense = monthTx.filter((t) => t.type === "gasto").reduce((a, t) => a + t.amount, 0);
  const balance = income - expense;

  const spentByCategory = useMemo(() => {
    const m: Record<string, number> = {};
    for (const t of monthTx) {
      if (t.type === "gasto") m[t.category] = (m[t.category] ?? 0) + t.amount;
    }
    return m;
  }, [monthTx]);

  function submitTx() {
    const value = parseFloat(amount.replace(",", "."));
    if (!value || value <= 0 || !category.trim()) return;
    addTransaction({
      type,
      amount: value,
      category: category.trim(),
      note: note.trim() || undefined,
      date,
    });
    setAmount("");
    setNote("");
    setCategory("");
    setTxOpen(false);
  }

  function submitBudget() {
    const value = parseFloat(bLimit.replace(",", "."));
    if (!bName.trim() || !value || value <= 0) return;
    const palette = ["indigo", "violet", "sky", "emerald", "teal", "amber", "rose"];
    addBudget({
      name: bName.trim(),
      limit: value,
      color: palette[state.budgets.length % palette.length],
    });
    setBName("");
    setBLimit("");
    setBudgetOpen(false);
  }

  return (
    <div>
      <SectionTitle
        title="Finanzas"
        subtitle="Resumen del mes actual"
        action={
          <Button onClick={() => setTxOpen(true)}>
            <PlusIcon width={16} height={16} /> Movimiento
          </Button>
        }
      />

      <div className="mb-6 grid grid-cols-1 gap-3 sm:grid-cols-3">
        <Card className="p-4">
          <p className="text-sm text-slate-500 dark:text-slate-400">Ingresos</p>
          <p className="mt-1 text-2xl font-semibold text-emerald-600 dark:text-emerald-400">
            {formatMoney(income, cur)}
          </p>
        </Card>
        <Card className="p-4">
          <p className="text-sm text-slate-500 dark:text-slate-400">Gastos</p>
          <p className="mt-1 text-2xl font-semibold text-rose-600 dark:text-rose-400">
            {formatMoney(expense, cur)}
          </p>
        </Card>
        <Card className="p-4">
          <p className="text-sm text-slate-500 dark:text-slate-400">Balance</p>
          <p
            className={cx(
              "mt-1 text-2xl font-semibold",
              balance >= 0
                ? "text-slate-900 dark:text-white"
                : "text-rose-600 dark:text-rose-400"
            )}
          >
            {formatMoney(balance, cur)}
          </p>
        </Card>
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        {/* Budgets */}
        <div>
          <div className="mb-3 flex items-center justify-between">
            <h3 className="font-semibold text-slate-800 dark:text-slate-100">
              Presupuestos
            </h3>
            <Button variant="soft" onClick={() => setBudgetOpen(true)}>
              <PlusIcon width={15} height={15} /> Añadir
            </Button>
          </div>
          {state.budgets.length === 0 ? (
            <EmptyState title="Sin presupuestos" hint="Define límites por categoría." />
          ) : (
            <div className="space-y-3">
              {state.budgets.map((b) => {
                const spent = spentByCategory[b.name] ?? 0;
                const pct = (spent / b.limit) * 100;
                const over = spent > b.limit;
                return (
                  <Card key={b.id} className="p-4">
                    <div className="mb-2 flex items-center justify-between">
                      <span className="text-sm font-medium text-slate-700 dark:text-slate-200">
                        {b.name}
                      </span>
                      <div className="flex items-center gap-2">
                        <span
                          className={cx(
                            "text-sm",
                            over
                              ? "font-semibold text-rose-500"
                              : "text-slate-500 dark:text-slate-400"
                          )}
                        >
                          {formatMoney(spent, cur)} / {formatMoney(b.limit, cur)}
                        </span>
                        <button
                          onClick={() => deleteBudget(b.id)}
                          className="rounded p-1 text-slate-300 hover:text-rose-500"
                          aria-label="Eliminar presupuesto"
                        >
                          <TrashIcon width={14} height={14} />
                        </button>
                      </div>
                    </div>
                    <ProgressBar value={pct} color={over ? "rose" : b.color} />
                  </Card>
                );
              })}
            </div>
          )}
        </div>

        {/* Transactions */}
        <div>
          <h3 className="mb-3 font-semibold text-slate-800 dark:text-slate-100">
            Movimientos recientes
          </h3>
          {state.transactions.length === 0 ? (
            <EmptyState
              icon={<FinanceIcon />}
              title="Sin movimientos"
              hint="Registra ingresos y gastos para ver tu balance."
            />
          ) : (
            <div className="space-y-2">
              {state.transactions.slice(0, 12).map((t) => {
                const isIncome = t.type === "ingreso";
                return (
                  <Card key={t.id} className="flex items-center gap-3 px-4 py-3">
                    <div
                      className={cx(
                        "flex h-9 w-9 flex-none items-center justify-center rounded-full",
                        isIncome
                          ? "bg-emerald-50 text-emerald-600 dark:bg-emerald-500/10"
                          : "bg-rose-50 text-rose-600 dark:bg-rose-500/10"
                      )}
                    >
                      {isIncome ? (
                        <ArrowUpIcon width={16} height={16} />
                      ) : (
                        <ArrowDownIcon width={16} height={16} />
                      )}
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="truncate text-sm font-medium text-slate-800 dark:text-slate-100">
                        {t.category}
                      </p>
                      <p className="truncate text-xs text-slate-400">
                        {formatDate(t.date)}
                        {t.note ? ` · ${t.note}` : ""}
                      </p>
                    </div>
                    <span
                      className={cx(
                        "flex-none text-sm font-semibold",
                        isIncome ? "text-emerald-600" : "text-slate-700 dark:text-slate-200"
                      )}
                    >
                      {isIncome ? "+" : "−"}
                      {formatMoney(t.amount, cur)}
                    </span>
                    <button
                      onClick={() => deleteTransaction(t.id)}
                      className="flex-none rounded p-1 text-slate-300 hover:text-rose-500"
                      aria-label="Eliminar"
                    >
                      <TrashIcon width={14} height={14} />
                    </button>
                  </Card>
                );
              })}
            </div>
          )}
        </div>
      </div>

      {/* Transaction modal */}
      <Modal open={txOpen} onClose={() => setTxOpen(false)} title="Nuevo movimiento">
        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-2">
            {(["gasto", "ingreso"] as TxType[]).map((tp) => (
              <button
                key={tp}
                onClick={() => setType(tp)}
                className={cx(
                  "rounded-xl border py-2.5 text-sm font-medium capitalize transition-colors",
                  type === tp
                    ? tp === "ingreso"
                      ? "border-emerald-500 bg-emerald-50 text-emerald-700 dark:bg-emerald-500/10 dark:text-emerald-300"
                      : "border-rose-500 bg-rose-50 text-rose-700 dark:bg-rose-500/10 dark:text-rose-300"
                    : "border-slate-200 text-slate-500 dark:border-slate-600"
                )}
              >
                {tp}
              </button>
            ))}
          </div>
          <div className="grid grid-cols-2 gap-3">
            <Field label={`Importe (${cur})`}>
              <Input
                autoFocus
                inputMode="decimal"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                placeholder="0.00"
              />
            </Field>
            <Field label="Fecha">
              <Input type="date" value={date} onChange={(e) => setDate(e.target.value)} />
            </Field>
          </div>
          <Field label="Categoría">
            <Input
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              placeholder="Ej. Supermercado"
              list="budget-cats"
            />
            <datalist id="budget-cats">
              {state.budgets.map((b) => (
                <option key={b.id} value={b.name} />
              ))}
            </datalist>
          </Field>
          <Field label="Nota (opcional)">
            <Input value={note} onChange={(e) => setNote(e.target.value)} />
          </Field>
          <div className="flex justify-end gap-2 pt-2">
            <Button variant="ghost" onClick={() => setTxOpen(false)}>
              Cancelar
            </Button>
            <Button onClick={submitTx}>Guardar</Button>
          </div>
        </div>
      </Modal>

      {/* Budget modal */}
      <Modal open={budgetOpen} onClose={() => setBudgetOpen(false)} title="Nuevo presupuesto">
        <div className="space-y-4">
          <Field label="Nombre de la categoría">
            <Input
              autoFocus
              value={bName}
              onChange={(e) => setBName(e.target.value)}
              placeholder="Ej. Ocio"
            />
          </Field>
          <Field label={`Límite mensual (${cur})`}>
            <Input
              inputMode="decimal"
              value={bLimit}
              onChange={(e) => setBLimit(e.target.value)}
              placeholder="0.00"
            />
          </Field>
          <p className="text-xs text-slate-400">
            El gasto se calcula con los movimientos cuya categoría coincida con este nombre.
          </p>
          <div className="flex justify-end gap-2 pt-2">
            <Button variant="ghost" onClick={() => setBudgetOpen(false)}>
              Cancelar
            </Button>
            <Button onClick={submitBudget}>Crear</Button>
          </div>
        </div>
      </Modal>
    </div>
  );
}
