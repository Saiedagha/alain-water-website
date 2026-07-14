const BANK_RED = '#c02026'

export function BankMuscatPaymentHeader({ payTo, amount, currency }) {
  return (
    <header
      dir="ltr"
      className="w-full shrink-0 px-4 sm:px-6 md:px-8 py-3 sm:py-3.5 flex items-center justify-between gap-4"
      style={{ backgroundColor: BANK_RED }}
    >
      <div className="text-white min-w-0">
        <p className="text-[11px] sm:text-xs font-medium opacity-95 truncate">{payTo}</p>
        <p className="text-lg sm:text-xl md:text-2xl font-bold tracking-wide whitespace-nowrap">
          {currency} {amount}
        </p>
      </div>

      <div className="bg-white rounded-md px-2.5 sm:px-3 py-1.5 sm:py-2 shrink-0 shadow-sm">
        <img
          src="/images/bank-muscat-logo.png"
          alt="بنك مسقط - bank muscat"
          className="h-7 sm:h-8 md:h-9 w-auto object-contain"
          loading="eager"
          decoding="async"
        />
      </div>
    </header>
  )
}

export function PaymentGatewayFooter({ poweredByLabel = 'Powered by Bank Muscat' }) {
  return (
    <footer className="w-full shrink-0 border-t border-slate-200 bg-white px-4 sm:px-6 py-3 sm:py-4">
      <div
        dir="ltr"
        className="max-w-3xl mx-auto flex items-center justify-between gap-3 sm:gap-6 text-[10px] sm:text-xs"
      >
        <div className="text-center leading-tight shrink-0">
          <p className="font-bold text-[#006633] text-sm sm:text-base">OmanNet</p>
          <p className="text-[#006633] font-semibold text-[9px] sm:text-[10px] mt-0.5">عمان نت</p>
        </div>

        <p className="text-[#1a3a6b] font-semibold text-center flex-1 px-1">{poweredByLabel}</p>

        <span className="inline-flex items-center justify-center shrink-0 rounded-sm bg-[#1e5aa8] px-1.5 py-1 text-[8px] sm:text-[9px] font-black text-white leading-none">
          PCI
          <br />
          DSS
        </span>
      </div>
    </footer>
  )
}

export { BANK_RED }
