const BANK_RED = '#da0c24'

export default function BankMuscatGateway({ className = '' }) {
  return (
    <div
      dir="ltr"
      className={`rounded-2xl h-12 bg-[#da0c24] flex items-center justify-end px-4 sm:px-5 py-1 ${className}`}
    >
      <img
        src="/images/bank-muscat-mark.png"
        alt="بنك مسقط - bank muscat"
        className="h-[42px] sm:h-[44px] w-auto max-w-[190px] sm:max-w-[210px] object-contain object-right"
        loading="eager"
        decoding="async"
      />
    </div>
  )
}

export { BANK_RED }
